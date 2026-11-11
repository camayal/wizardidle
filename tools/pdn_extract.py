#!/usr/bin/env python3
"""Extract the layers of Paint.NET (.pdn) files as PNGs. Standard library only.

Usage:
    python tools/pdn_extract.py <file.pdn | folder> <out_dir>

For every .pdn it writes <out_dir>/<file name>/ containing:
    NN_<layer name>.png   one transparent PNG per layer, bottom (00) to top
    composite.png         the visible layers stacked (normal blend + opacity)
    layers.json           size and, per layer: file, name, visible, opacity,
                          blend mode, background flag, share of pixels drawn

How the PDN3 format is read:
    b"PDN3", a 3-byte little-endian header length, an XML header (width, height,
    layer count), then a .NET BinaryFormatter object graph, then the pixels.
    - Layer settings come from each Layer+LayerProperties record in the graph:
      name (string or reference), userMetaData (reference), visible (bool),
      isBackground (bool), opacity (byte), blendMode (enum, int32 value__).
    - Pixels are gzip chunks of BGRA32 rows, one surface per layer, in the same
      bottom-to-top order as the properties.
    Only the "normal" blend mode is reproduced in composite.png; layers using
    another mode are flagged in layers.json.
"""
import json
import os
import re
import struct
import sys
import zlib

BLEND_MODES = ["normal", "multiply", "additive", "colorburn", "colordodge", "reflect", "glow",
               "overlay", "difference", "negation", "lighten", "darken", "screen", "xor"]


def png_bytes(w, h, rgba):
    raw = b"".join(b"\x00" + rgba[y * w * 4:(y + 1) * w * 4] for y in range(h))

    def chunk(kind, payload):
        c = struct.pack(">I", len(payload)) + kind + payload
        return c + struct.pack(">I", zlib.crc32(kind + payload) & 0xFFFFFFFF)

    return (b"\x89PNG\r\n\x1a\n"
            + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(raw, 9))
            + chunk(b"IEND", b""))


def read_7bit_int(buf, pos):
    """.NET length prefix: 7 bits per byte, high bit = more bytes follow."""
    value, shift = 0, 0
    while True:
        b = buf[pos]
        pos += 1
        value |= (b & 0x7F) << shift
        if not b & 0x80:
            return value, pos
        shift += 7


def all_strings(body):
    """Map of BinaryFormatter object id -> string, for resolving references."""
    out = {}
    for m in re.finditer(rb"\x06(.{4})", body, re.S):
        try:
            length, start = read_7bit_int(body, m.end())
            text = body[start:start + length].decode("utf-8")
        except (IndexError, UnicodeDecodeError):
            continue
        out[struct.unpack("<i", m.group(1))[0]] = text
    return out


def layer_properties(body):
    """Layer+LayerProperties records, in file order (bottom to top)."""
    strings = all_strings(body)
    props = []
    # name value: 0x06 (new string) or 0x09 (reference), then userMetaData as a
    # 0x09 reference, then visible, isBackground, opacity, then the blend-mode
    # record: 0x01 (ClassWithId) or 0x05 (first occurrence, full class).
    pattern = re.compile(rb"(?:\x06(.{4})|\x09(.{4}))(?=(.*?)\x09.{4}([\x00\x01])([\x00\x01])(.)([\x01\x05]))", re.S)
    pos = 0
    while True:
        m = pattern.search(body, pos)
        if not m:
            break
        if m.group(1) is not None:
            oid = struct.unpack("<i", m.group(1))[0]
            length, start = read_7bit_int(body, m.end())
            try:
                name = body[start:start + length].decode("utf-8")
            except UnicodeDecodeError:
                pos = m.start() + 1
                continue
            after = start + length
        else:
            ref = struct.unpack("<i", m.group(2))[0]
            if ref not in strings:
                pos = m.start() + 1
                continue
            name = strings[ref]
            after = m.end()
        # what follows the name must be exactly: 09 <4 bytes> visible bg opacity record
        tail = body[after:after + 9]
        if len(tail) < 9 or tail[0] != 0x09 or tail[5] > 1 or tail[6] > 1 or tail[8] not in (0x01, 0x05):
            pos = m.start() + 1
            continue
        visible, background, opacity, kind = tail[5], tail[6], tail[7], tail[8]
        rec = after + 8
        if kind == 0x01:                      # ClassWithId: id, metadata id, value__
            blend = struct.unpack("<i", body[rec + 9:rec + 13])[0]
        else:                                 # first full class record
            v = body.find(b"value__", rec)
            blend = struct.unpack("<i", body[v + 7 + 2 + 4:v + 7 + 2 + 4 + 4])[0] if v >= 0 else 0
        props.append({"name": name, "visible": bool(visible), "background": bool(background),
                      "opacity": opacity,
                      "blend": BLEND_MODES[blend] if 0 <= blend < len(BLEND_MODES) else str(blend)})
        pos = rec + 1
    return props


def layer_pixels(body, size):
    """Decompress the gzip chunks and cut them into whole layers."""
    blobs, pos = [], 0
    while True:
        i = body.find(b"\x1f\x8b\x08", pos)
        if i < 0:
            break
        d = zlib.decompressobj(16 + zlib.MAX_WBITS)
        try:
            out = d.decompress(body[i:])
        except zlib.error:
            pos = i + 1
            continue
        blobs.append(out)
        pos = len(body) - len(d.unused_data) if d.unused_data else len(body)
    layers, buf = [], b""
    for b in blobs:
        buf += b
        while len(buf) >= size:
            layers.append(buf[:size])
            buf = buf[size:]
    return layers


def composite(w, h, layers, props):
    out = bytearray(w * h * 4)                # premultiplied-free "over" in float-ish ints
    for px, p in zip(layers, props):
        if not p["visible"] or p["blend"] != "normal":
            continue
        lo = p["opacity"] / 255
        for i in range(0, len(px), 4):
            a = px[i + 3] / 255 * lo
            if a == 0:
                continue
            da = out[i + 3] / 255
            oa = a + da * (1 - a)
            for c_src, c_dst in ((2, 0), (1, 1), (0, 2)):   # BGRA source -> RGBA out
                out[i + c_dst] = round((px[i + c_src] * a + out[i + c_dst] * da * (1 - a)) / oa)
            out[i + 3] = round(oa * 255)
    return bytes(out)


def extract(path, out_root):
    data = open(path, "rb").read()
    if data[:4] != b"PDN3":
        return None, "not a PDN3 file"
    hlen = int.from_bytes(data[4:7], "little")
    header = data[7:7 + hlen].decode("utf-8", "ignore")
    m = re.search(r'width="(\d+)"\s+height="(\d+)"\s+layers="(\d+)"', header)
    w, h, n = map(int, m.groups())
    body = data[7 + hlen:]
    layers = layer_pixels(body, w * h * 4)
    props = layer_properties(body)
    problems = []
    if len(layers) != n:
        problems.append("expected %d layers, found %d surfaces" % (n, len(layers)))
    if len(props) != len(layers):
        problems.append("%d layer records for %d surfaces; names may be off" % (len(props), len(layers)))
        props = (props + [{"name": "layer", "visible": True, "background": False,
                           "opacity": 255, "blend": "normal"}] * len(layers))[:len(layers)]

    out_dir = os.path.join(out_root, os.path.splitext(os.path.basename(path))[0])
    os.makedirs(out_dir, exist_ok=True)
    manifest = {"source": os.path.basename(path), "width": w, "height": h, "layers": [], "problems": problems}
    for idx, (px, p) in enumerate(zip(layers, props)):
        rgba = bytearray(px)
        rgba[0::4], rgba[2::4] = px[2::4], px[0::4]          # BGRA -> RGBA
        safe = re.sub(r"[^\w\- ]", "_", p["name"]).strip() or "layer"
        fn = "%02d_%s.png" % (idx, safe)
        with open(os.path.join(out_dir, fn), "wb") as f:
            f.write(png_bytes(w, h, bytes(rgba)))
        drawn = sum(1 for a in px[3::4] if a) / (w * h)
        manifest["layers"].append(dict(p, file=fn, drawn=round(drawn, 3)))
    with open(os.path.join(out_dir, "composite.png"), "wb") as f:
        f.write(png_bytes(w, h, composite(w, h, layers, props)))
    with open(os.path.join(out_dir, "layers.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)
    return manifest, None


def main():
    src, out_root = sys.argv[1], sys.argv[2]
    files = [src] if src.lower().endswith(".pdn") else sorted(
        os.path.join(r, f) for r, _, fs in os.walk(src) for f in fs if f.lower().endswith(".pdn"))
    for path in files:
        manifest, err = extract(path, out_root)
        if err:
            print("%s: skipped (%s)" % (os.path.basename(path), err))
            continue
        hidden = sum(1 for l in manifest["layers"] if not l["visible"])
        print("%s: %d layers (%d hidden)%s" % (manifest["source"], len(manifest["layers"]), hidden,
                                               "  ! " + "; ".join(manifest["problems"]) if manifest["problems"] else ""))


if __name__ == "__main__":
    main()
