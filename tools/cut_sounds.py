"""Wizard Idle v2 - cut the approved sounds and save them as the game's .ogg files.

The list is tools/sound_cuts.txt: one line per game sound (its name, its folder of snd/, the
source file, where the cut starts and ends). For each line this reads the source (mp3, ogg,
wav, flac), keeps the cut, mixes it to mono, fades the end out and writes
snd/<folder>/<name>.ogg (Ogg Vorbis). The volume is not changed: the game sets it when it plays.

    python tools/cut_sounds.py                  every sound of the list
    python tools/cut_sounds.py hooves roar      only these
    python tools/cut_sounds.py --list           show the list and check the sources, write nothing
    python tools/cut_sounds.py --review         also copy each new file to the review drop

Sources are looked for in wizardidle-old-ideas/unorganized_sounds/ beside the repo's folder
(or --src <folder>); a source starting with snd/ is a sound already in the game.

Needs once:  python -m pip install soundfile   (it reads mp3 and writes ogg by itself)
"""

import argparse
import shutil
import subprocess
import sys
import time
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
CUTS = Path(__file__).resolve().parent / 'sound_cuts.txt'
OUTSIDE = Path('wizardidle-old-ideas') / 'unorganized_sounds'
FADE_OUT_MS = 30
QUALITY = 0.5           # Vorbis quality, 0 to 1 (about 96 to 128 kbps in mono)


def read_cuts():
    cuts = []
    for n, line in enumerate(CUTS.read_text(encoding='utf-8').splitlines(), 1):
        line = line.split('#')[0].strip()
        if not line:
            continue
        parts = [p.strip() for p in line.split('|')]
        if len(parts) != 5:
            sys.exit(f'{CUTS.name} line {n}: expected 5 fields, found {len(parts)}')
        name, folder, source, start, end = parts
        if name != name.lower() or ' ' in name or '-' in name:
            sys.exit(f'{CUTS.name} line {n}: "{name}" is not a game name (lowercase, words joined by _)')
        cuts.append({
            'name': name, 'folder': folder, 'source': source,
            'start': None if start == '-' else float(start),
            'end': None if end == '-' else float(end),
        })
    names = [c['name'] for c in cuts]
    for name in set(names):
        if names.count(name) > 1:
            sys.exit(f'{CUTS.name}: "{name}" is listed twice')
    return cuts


def outside_folder(given):
    if given:
        return Path(given)
    for up in REPO.parents:            # the repo may sit a few folders deep
        if (up / OUTSIDE).is_dir():
            return up / OUTSIDE
    return None


def source_path(cut, outside):
    if cut['source'].startswith('snd/'):
        return REPO / cut['source']
    return outside / cut['source'] if outside else None


def review_folder():
    """review/ at the root of the main checkout (the same repo when there is only one)."""
    out = subprocess.run(['git', 'rev-parse', '--path-format=absolute', '--git-common-dir'],
                         cwd=REPO, capture_output=True, text=True)
    root = Path(out.stdout.strip()).parent if out.returncode == 0 and out.stdout.strip() else REPO
    folder = root / 'review'
    folder.mkdir(exist_ok=True)
    return folder


def cut_one(cut, src, sf, np):
    data, rate = sf.read(str(src), dtype='float32', always_2d=True)
    mono = data.mean(axis=1)
    a = 0 if cut['start'] is None else round(cut['start'] * rate)
    b = len(mono) if cut['end'] is None else min(len(mono), round(cut['end'] * rate))
    if not 0 <= a < b:
        sys.exit(f'{cut["name"]}: the cut {cut["start"]} to {cut["end"]} s is outside the file ({len(mono) / rate:.3f} s)')
    piece = mono[a:b].copy()
    fade = min(len(piece), round(FADE_OUT_MS / 1000 * rate))
    if fade:
        piece[-fade:] *= np.linspace(1, 0, fade, dtype='float32')
    out = REPO / 'snd' / cut['folder'] / f'{cut["name"]}.ogg'
    out.parent.mkdir(parents=True, exist_ok=True)
    with sf.SoundFile(str(out), 'w', samplerate=rate, channels=1, format='OGG', subtype='VORBIS',
                      compression_level=1 - QUALITY) as f:
        for i in range(0, len(piece), 8192):     # in blocks: long single writes can crash the encoder
            f.write(piece[i:i + 8192])
    return out, len(piece) / rate


def main():
    ap = argparse.ArgumentParser(description='Cut the approved sounds into snd/ as .ogg files.')
    ap.add_argument('names', nargs='*', help='only these sounds (default: all of the list)')
    ap.add_argument('--list', action='store_true', help='show the list and check the sources, write nothing')
    ap.add_argument('--review', action='store_true', help='also copy each new file to the review drop')
    ap.add_argument('--src', help='the folder of the source files outside the repo')
    args = ap.parse_args()

    cuts = read_cuts()
    unknown = [n for n in args.names if n not in {c['name'] for c in cuts}]
    if unknown:
        sys.exit(f'not in {CUTS.name}: {", ".join(unknown)}')
    if args.names:
        cuts = [c for c in cuts if c['name'] in args.names]

    outside = outside_folder(args.src)
    missing = 0
    for c in cuts:
        c['path'] = source_path(c, outside)
        if not c['path'] or not c['path'].is_file():
            missing += 1
    if args.list or missing:
        for c in cuts:
            ok = c['path'] and c['path'].is_file()
            span = 'whole file' if c['start'] is None and c['end'] is None else f'{c["start"] or 0:.3f} to {c["end"]:.3f} s' if c['end'] is not None else f'from {c["start"]:.3f} s'
            print(f'{"ok     " if ok else "MISSING"} snd/{c["folder"]}/{c["name"]}.ogg  <-  {c["source"]}  ({span})')
        if missing:
            sys.exit(f'{missing} source file(s) not found (looked in {outside or "no folder: use --src"})')
        return

    try:
        import numpy as np
        import soundfile as sf
    except ImportError:
        sys.exit('This needs the soundfile library once:  python -m pip install soundfile')

    review = review_folder() if args.review else None
    for c in cuts:
        out, seconds = cut_one(c, c['path'], sf, np)
        print(f'snd/{c["folder"]}/{c["name"]}.ogg  {seconds:.2f} s  {out.stat().st_size / 1024:.0f} KB')
        if review:
            shutil.copyfile(out, review / out.name)
            with open(review / 'index.txt', 'a', encoding='utf-8') as f:
                f.write(f'{time.strftime("%Y-%m-%d %H:%M")} | musician | {out.name} | - | cut from {c["source"]}\n')
    if review:
        print(f'copied to {review}')


if __name__ == '__main__':
    main()
