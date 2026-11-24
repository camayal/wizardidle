"""MIDI file -> song text for src/synth.js (the game's own music).

    python tools/midi_to_song.py tune.mid                 writes songs/tune.txt
    python tools/midi_to_song.py tune.mid out.txt         writes out.txt
    options: --loop N (passes, 0 = forever; default 2)  --echo T FB  --max-beats B  --skip 3,5 (MIDI channels, 1-16)
             --solo 1,2 (only these channels)  --min-vel V (drop notes quieter than V, 0-127)

Every MIDI channel becomes one instrument picked from its General MIDI program (piano, bells, organ, guitar, bass,
strings, brass, reeds, synth lead, pad). Channel 10 is the drum kit: kick, snare, hats, toms and cymbals become noise
and sine hits. Note velocity, channel volume (CC7), pan (CC10), the sustain pedal (CC64) and tempo changes are kept;
pitch bend, modulation and other controllers are ignored. Chords (same start, length and instrument) are joined with +.
No libraries needed.
"""
import os, re, struct, sys

# GM program ranges (first, last) -> instrument line (without the name). See BASE_INSTRUMENTS in src/synth.js.
FAMILIES = [
    (0, 7, 'piano', 'triangle 0.005 0.35 0.30 0.40 0.20 cutoff=3400 detune=4'),
    (8, 15, 'bell', 'sine 0.005 0.60 0.20 1.40 0.14 cutoff=4500 detune=9'),
    (16, 23, 'organ', 'square 0.02 0.10 0.80 0.12 0.07 cutoff=2200 detune=6'),
    (24, 31, 'guitar', 'sawtooth 0.005 0.30 0.25 0.30 0.11 cutoff=2400 detune=5'),
    (32, 39, 'bass', 'triangle 0.015 0.18 0.65 0.18 0.18 cutoff=700 q=1.5'),
    (40, 55, 'strings', 'sawtooth 0.30 0.30 0.80 0.60 0.07 cutoff=1800 q=1 detune=14'),
    (56, 63, 'brass', 'sawtooth 0.07 0.20 0.70 0.20 0.10 cutoff=2400 q=1.2 detune=6'),
    (64, 79, 'reed', 'triangle 0.05 0.15 0.75 0.25 0.20 cutoff=2800 detune=6 vibrato=4.5 vdepth=8'),
    (80, 87, 'synthlead', 'square 0.02 0.12 0.70 0.20 0.09 cutoff=2800 detune=8'),
    (88, 103, 'padsynth', 'sawtooth 0.65 0.40 0.80 1.10 0.07 cutoff=950 q=1.2 detune=14'),
    (104, 111, 'pluck', 'sawtooth 0.005 0.20 0.20 0.30 0.12 cutoff=2800 detune=4'),
    (112, 127, 'perc', 'sine 0.005 0.40 0.10 0.60 0.14 cutoff=3000'),
]
DRUMS = {   # drum kind -> instrument line; kicks glide down
    'kick': 'sine 0.001 0.10 0.0 0.08 0.45 cutoff=900',
    'snare': 'noise 0.001 0.10 0.0 0.10 0.22 cutoff=4200',
    'hat': 'noise 0.001 0.03 0.0 0.04 0.10 cutoff=9000',
    'tom': 'sine 0.001 0.15 0.0 0.12 0.35 cutoff=1500',
    'cymbal': 'noise 0.002 0.40 0.10 0.60 0.10 cutoff=8000',
    'perc': 'triangle 0.001 0.06 0.0 0.08 0.20 cutoff=3500',
}


def drum_kind(n):
    if n in (35, 36): return 'kick'
    if n in (37, 38, 39, 40): return 'snare'
    if n in (42, 44, 46): return 'hat'
    if 41 <= n <= 50 and n not in (42, 44, 46, 49): return 'tom'
    if n in (49, 51, 52, 53, 55, 57, 59): return 'cymbal'
    return 'perc'


def read_vlq(d, i):
    v = 0
    while True:
        b = d[i]; i += 1
        v = (v << 7) | (b & 0x7F)
        if not b & 0x80: return v, i


def parse_midi(data):
    """-> ppq, tempos [(tick, usPerBeat)], events [(tick, kind, channel, a, b)] with kind on/off/cc/prog."""
    if data[:4] != b'MThd': raise SystemExit('not a MIDI file (no MThd)')
    _, ntracks, division = struct.unpack('>HHH', data[8:14])
    if division & 0x8000: raise SystemExit('SMPTE time division is not supported')
    i = 14
    tempos, events = [], []
    for _ in range(ntracks):
        if data[i:i + 4] != b'MTrk': raise SystemExit('broken track header')
        size = struct.unpack('>I', data[i + 4:i + 8])[0]
        i += 8
        end, tick, status = i + size, 0, 0
        while i < end:
            delta, i = read_vlq(data, i)
            tick += delta
            b = data[i]
            if b == 0xFF:
                typ = data[i + 1]
                n, j = read_vlq(data, i + 2)
                if typ == 0x51 and n == 3: tempos.append((tick, int.from_bytes(data[j:j + 3], 'big')))
                i = j + n
                continue
            if b in (0xF0, 0xF7):
                n, j = read_vlq(data, i + 1)
                i = j + n
                continue
            if b & 0x80:
                status = b; i += 1
            hi, ch = status & 0xF0, status & 0x0F
            if hi in (0xC0, 0xD0):
                if hi == 0xC0: events.append((tick, 'prog', ch, data[i], 0))
                i += 1
                continue
            a, c = data[i], data[i + 1]
            i += 2
            if hi == 0x90 and c > 0: events.append((tick, 'on', ch, a, c))
            elif hi in (0x80, 0x90): events.append((tick, 'off', ch, a, 0))
            elif hi == 0xB0: events.append((tick, 'cc', ch, a, c))
    tempos.sort()
    return division, tempos, events


def convert(data, name, loop=2, echo=None, max_beats=None, skip=(), solo=(), min_vel=0):
    ppq, tempos, events = parse_midi(data)
    if not tempos or tempos[0][0] != 0: tempos.insert(0, (0, 500000))
    bpm0 = 60e6 / tempos[0][1]
    # tick -> beats of the first tempo (a later tempo change is kept as real time)
    marks, sec = [], 0.0
    for k, (t, us) in enumerate(tempos):
        if k: sec += (t - tempos[k - 1][0]) / ppq * tempos[k - 1][1] / 1e6
        marks.append((t, sec, us))

    def beats(tick):
        t, s, us = [m for m in marks if m[0] <= tick][-1]
        return (s + (tick - t) / ppq * us / 1e6) * bpm0 / 60

    events.sort(key=lambda e: (e[0], {'cc': 0, 'prog': 0, 'off': 1, 'on': 2}[e[1]]))
    program, vol, pan, pedal = {}, {}, {}, {}
    open_notes, held, notes, used = {}, {}, [], {}
    for tick, kind, ch, a, b in events:
        if ch + 1 in skip or (solo and ch + 1 not in solo): continue
        if kind == 'prog': program[ch] = a
        elif kind == 'cc':
            if a == 7: vol[ch] = b
            elif a == 10: pan[ch] = b
            elif a == 64:
                pedal[ch] = b >= 64
                if not pedal[ch]:
                    for key in held.pop(ch, []): finish(notes, key, tick, beats)
        elif kind == 'on':
            if (ch, a) in open_notes: finish(notes, open_notes.pop((ch, a)) + (tick,), tick, beats, early=True)
            open_notes[(ch, a)] = (ch, a, tick, b, vol.get(ch, 100), pan.get(ch, 64), program.get(ch, 0))
        elif kind == 'off' and (ch, a) in open_notes:
            key = open_notes.pop((ch, a))
            if pedal.get(ch): held.setdefault(ch, []).append(key)
            else: finish(notes, key + (tick,), tick, beats)
    last = events[-1][0] if events else 0
    for key in list(open_notes.values()): finish(notes, key + (last,), last, beats)
    for ch, keys in held.items():
        for key in keys: finish(notes, key, last, beats)

    insts, rows = {}, {}
    for (ch, pitch, t0, vel, cvol, cpan, prog, t1) in notes:
        if vel < min_vel: continue
        v = min(1.3, max(0.1, vel / 110 * (cvol / 100)))
        start, length = beats(t0), max(0.05, beats(t1) - beats(t0))
        if ch == 9:
            kind = drum_kind(pitch)
            iname = 'drum_' + kind
            insts[iname] = 'instrument %s %s' % (iname, DRUMS[kind])
            if kind == 'kick': token, length = 'A2->A1', 0.3
            else:
                token = 'A4'
                length = {'hat': 0.1, 'snare': 0.25, 'cymbal': 1.0}.get(kind, 0.3)
        else:
            fam = next((f for f in FAMILIES if f[0] <= prog <= f[1]), FAMILIES[0])
            iname = 'ch%d_%s' % (ch + 1, fam[2])
            p = round((cpan - 64) / 64 * 0.6, 2)
            insts[iname] = 'instrument %s %s%s' % (iname, fam[3], ' pan=%g' % p if p else '')
            token = midi_name(pitch)
        if max_beats and start >= max_beats: continue
        rows.setdefault((round(start, 3), round(length, 3), round(v, 2), iname), []).append(token)
    lines = ['# Converted from a MIDI file by tools/midi_to_song.py.', 'title ' + name.replace('_', ' '),
             'tempo %g' % round(bpm0, 2), 'loop %d' % loop]
    if max_beats: lines.append('length %g' % max_beats)
    if echo: lines.append('echo %g %g' % echo)
    lines += sorted(insts.values()) + ['']
    for (start, length, v, iname), toks in sorted(rows.items()):
        chord = '+'.join(sorted(set(toks)))
        lines.append('%s%s %g %g %s' % (chord, '@%g' % v if v != 1 else '', start, length, iname))
    return '\n'.join(lines) + '\n', len(notes)


def finish(notes, key, tick, beats, early=False):
    ch, pitch, t0, vel, cvol, cpan, prog = key[:7]
    t1 = tick if len(key) < 8 else key[7]
    if t1 > t0: notes.append((ch, pitch, t0, vel, cvol, cpan, prog, t1))


NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']


def midi_name(n): return '%s%d' % (NAMES[n % 12], n // 12 - 1)


def main(argv):
    args, opts, i = [], {}, 0
    while i < len(argv):
        a = argv[i]
        if a in ('--loop', '--max-beats', '--skip', '--solo', '--min-vel'): opts[a] = argv[i + 1]; i += 2
        elif a == '--echo': opts[a] = (argv[i + 1], argv[i + 2]); i += 3
        else: args.append(a); i += 1
    if not args or not args[0].lower().endswith(('.mid', '.midi')):
        raise SystemExit(__doc__)
    src = args[0]
    name = re.sub(r'[^A-Za-z0-9_]+', '_', os.path.splitext(os.path.basename(src))[0]).strip('_').lower() or 'song'
    out = args[1] if len(args) > 1 else os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'songs', name + '.txt')
    ints = lambda s: tuple(int(x) for x in s.split(',') if x)
    text, n = convert(open(src, 'rb').read(), name, loop=int(opts.get('--loop', 2)),
                      echo=tuple(float(x) for x in opts['--echo']) if '--echo' in opts else None,
                      max_beats=float(opts['--max-beats']) if '--max-beats' in opts else None,
                      skip=ints(opts.get('--skip', '')), solo=ints(opts.get('--solo', '')), min_vel=int(opts.get('--min-vel', 0)))
    open(out, 'w', newline='\n').write(text)
    print('%s: %d notes -> %d lines' % (out, n, text.count('\n')))
    if n > 3500: print('warning: %d notes is heavy for live synthesis; try --skip, --solo or --max-beats' % n)


if __name__ == '__main__':
    main(sys.argv[1:])
