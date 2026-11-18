"""Wizard Idle v2 - turn sound files (mp3, wav, flac, ogg) into the game's .ogg files.

Whole files, no cutting: for cuts use tools/cut_sounds.py. Each file is mixed to mono and
written as Ogg Vorbis at the game's quality, named the game's way (lowercase, words joined
by _). The volume is not changed: the game sets it when it plays.

    python tools/to_ogg.py song.mp3                    writes song.ogg beside it
    python tools/to_ogg.py folder/                     every mp3/wav/flac in the folder
    python tools/to_ogg.py a.mp3 b.wav --out snd/ui    writes into snd/ui/
    python tools/to_ogg.py "Big Roar.mp3" --name roar  one file, a chosen name
    python tools/to_ogg.py folder/ --stereo            keep the channels instead of mono

A file whose .ogg already exists is skipped unless --force is given.

Needs once:  python -m pip install soundfile   (it reads mp3 and writes ogg by itself)
"""

import argparse
import re
import sys
from pathlib import Path

QUALITY = 0.5           # Vorbis quality, 0 to 1 (about 96 to 128 kbps in mono)
SOURCES = {'.mp3', '.wav', '.flac', '.ogg'}


def game_name(stem):
    """'Big Roar-02' -> 'big_roar_02'"""
    return re.sub(r'[^a-z0-9]+', '_', stem.lower()).strip('_') or 'sound'


def write_ogg(out, samples, rate, sf):
    """Write samples (frames, or frames x channels) to out as Ogg Vorbis at the game's quality."""
    out.parent.mkdir(parents=True, exist_ok=True)
    channels = 1 if samples.ndim == 1 else samples.shape[1]
    with sf.SoundFile(str(out), 'w', samplerate=rate, channels=channels, format='OGG', subtype='VORBIS',
                      compression_level=1 - QUALITY) as f:
        for i in range(0, len(samples), 8192):     # in blocks: long single writes can crash the encoder
            f.write(samples[i:i + 8192])


def gather(paths):
    files = []
    for p in map(Path, paths):
        if p.is_dir():
            files += sorted(f for f in p.iterdir() if f.suffix.lower() in SOURCES - {'.ogg'})
        elif p.is_file():
            files.append(p)
        else:
            sys.exit(f'not found: {p}')
    return files


def main():
    ap = argparse.ArgumentParser(description="Turn sound files into the game's .ogg files.")
    ap.add_argument('paths', nargs='+', help='files or folders')
    ap.add_argument('--out', help='write here instead of beside each source')
    ap.add_argument('--name', help='the game name of the new file (one source only)')
    ap.add_argument('--stereo', action='store_true', help='keep the channels instead of mixing to mono')
    ap.add_argument('--force', action='store_true', help='overwrite an .ogg that already exists')
    args = ap.parse_args()

    files = gather(args.paths)
    if not files:
        sys.exit('no mp3, wav or flac files found')
    if args.name and len(files) > 1:
        sys.exit('--name works with one source file only')

    try:
        import soundfile as sf
    except ImportError:
        sys.exit('This needs the soundfile library once:  python -m pip install soundfile')

    made = skipped = 0
    for src in files:
        out = (Path(args.out) if args.out else src.parent) / f'{game_name(args.name or src.stem)}.ogg'
        if out.resolve() == src.resolve():
            sys.exit(f'{src}: the output would overwrite the source; use --out or --name')
        if out.exists() and not args.force:
            print(f'skip  {out}  (exists; --force to overwrite)')
            skipped += 1
            continue
        data, rate = sf.read(str(src), dtype='float32', always_2d=True)
        samples = data if args.stereo else data.mean(axis=1)
        write_ogg(out, samples, rate, sf)
        print(f'{src.name}  ->  {out}  {len(data) / rate:.2f} s  {out.stat().st_size / 1024:.0f} KB')
        made += 1
    print(f'{made} written, {skipped} skipped')


if __name__ == '__main__':
    main()
