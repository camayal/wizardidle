// Wizard Idle v2 - the game's own music: songs written as plain text and played live with
// Web Audio (oscillators and envelopes). No sound files, no library.
//
// A song is a text file (songs/<name>.txt), one line each:
//
//     # a comment
//     title Tower theme
//     tempo 84                  beats per minute
//     length 16                 beats in one pass (default: where the last note ends)
//     loop 2                    passes (default 1; 0 = forever)
//     instrument lead triangle 0.02 0.25 0.22     name, wave, attack s, release s, gain
//     C4 0 1 lead               note, start beat, length in beats, instrument
//     C3+G3+C4 8 4 pad          a chord: notes joined with +
//
// A note is a letter A-G, an optional # or b, and an octave (A4 = 440 Hz); a plain number is a
// MIDI note. Instruments lead, pad, bass, bell and pluck exist; an `instrument` line adds or
// changes one. The dev tools' Music mode (src/dev/music.js) edits and plays these files.

const WAVES = ['sine', 'triangle', 'square', 'sawtooth'];
const BASE_INSTRUMENTS = {
    lead:  { wave: 'triangle', attack: 0.02,  release: 0.25, gain: 0.22 },
    pad:   { wave: 'sine',     attack: 0.5,   release: 0.8,  gain: 0.08 },
    bass:  { wave: 'square',   attack: 0.01,  release: 0.12, gain: 0.10 },
    bell:  { wave: 'sine',     attack: 0.005, release: 1.2,  gain: 0.15 },
    pluck: { wave: 'sawtooth', attack: 0.005, release: 0.3,  gain: 0.12 },
};
const SEMITONE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

// "A4", "C#5", "Bb3" or "69" -> MIDI number (NaN when it is not a note).
export function pitchToMidi(text) {
    if (/^\d+$/.test(text)) return Number(text);
    const m = /^([A-Ga-g])([#b]?)(-?\d)$/.exec(text);
    if (!m) return NaN;
    return 12 * (Number(m[3]) + 1) + SEMITONE[m[1].toUpperCase()] + (m[2] == '#' ? 1 : m[2] == 'b' ? -1 : 0);
}
const hz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

// Text -> { title, tempo, loops, length, instruments, notes: [{ midi, start, beats, instrument, line }], errors: [{ line, message }] }.
export function parseSong(text) {
    const song = { title: '', tempo: 90, loops: 1, length: 0, instruments: { ...BASE_INSTRUMENTS }, notes: [], errors: [] };
    const bad = (line, message) => song.errors.push({ line, message });
    const pending = [];         // notes are checked after every instrument line is read
    String(text).split(/\r?\n/).forEach((raw, i) => {
        const line = raw.replace(/(^|\s)#.*$/, '').trim();       // a # starts a comment (C#4 has no space before it)
        if (!line) return;
        const [word, ...rest] = line.split(/\s+/);
        const n = i + 1;
        if (word == 'title') { song.title = rest.join(' '); return; }
        if (word == 'tempo' || word == 'length' || word == 'loop') {
            const v = Number(rest[0]);
            if (rest[0] === undefined || !(v >= 0) || (word != 'loop' && v == 0)) return bad(n, `${word} needs a number`);
            if (word == 'tempo') song.tempo = v; else if (word == 'length') song.length = v; else song.loops = Math.floor(v);
            return;
        }
        if (word == 'instrument') {
            const [name, wave, attack, release, gain] = rest;
            const nums = [attack, release, gain].map(Number);
            if (!name || !WAVES.includes(wave) || nums.some((x) => !(x >= 0))) return bad(n, `instrument: name, wave (${WAVES.join('/')}), attack, release, gain`);
            song.instruments[name] = { wave, attack: nums[0], release: nums[1], gain: nums[2] };
            return;
        }
        const [pitches, start, beats, instrument = 'lead'] = [word, ...rest];
        const midis = pitches.split('+').map(pitchToMidi);
        if (midis.some(Number.isNaN)) return bad(n, `"${pitches}" is not a note (like C4, F#3, Bb2)`);
        if (start === undefined || !(Number(start) >= 0)) return bad(n, 'start beat needs a number');
        if (!(Number(beats) > 0)) return bad(n, 'length in beats needs a number above 0');
        for (const midi of midis) pending.push({ midi, start: Number(start), beats: Number(beats), instrument, line: n });
    });
    for (const note of pending) {
        if (!song.instruments[note.instrument]) { bad(note.line, `unknown instrument "${note.instrument}"`); continue; }
        song.notes.push(note);
    }
    if (!song.length) song.length = Math.ceil(song.notes.reduce((end, x) => Math.max(end, x.start + x.beats), 0));
    return song;
}

let context = null;
function audioContext() {
    if (!context) context = new (window.AudioContext || window.webkitAudioContext)();
    context.resume();
    return context;
}

// Play a parsed song. options: { volume (0.3, like every game sound), loop (true: forever, false: one pass,
// default: the song's own loop line), onEnd }. Returns { stop(), seconds } (seconds of one pass).
export function playSong(song, options = {}) {
    const c = audioContext();
    const beat = 60 / song.tempo, pass = song.length * beat;
    const passes = options.loop === true ? 0 : options.loop === false ? 1 : song.loops;
    const master = c.createGain(), tone = c.createBiquadFilter();
    master.gain.value = (options.volume ?? 0.3) / 0.3 * 0.8;
    tone.type = 'lowpass'; tone.frequency.value = 3000;
    master.connect(tone); tone.connect(c.destination);
    let oscillators = [], timer = null, stopped = false, next = 0;
    const startAt = c.currentTime + 0.1;

    const schedule = () => {
        const t0 = startAt + next * pass;
        for (const note of song.notes) {
            const v = song.instruments[note.instrument];
            const t = t0 + note.start * beat, d = note.beats * beat * 0.95;
            const o = c.createOscillator(), g = c.createGain();
            o.type = v.wave; o.frequency.value = hz(note.midi);
            g.gain.setValueAtTime(0, t);
            g.gain.linearRampToValueAtTime(v.gain, t + v.attack);
            g.gain.setValueAtTime(v.gain, t + Math.max(v.attack, d));
            g.gain.linearRampToValueAtTime(0, t + d + v.release);
            o.connect(g); g.connect(master);
            o.start(t); o.stop(t + d + v.release + 0.05);
            oscillators.push(o);
        }
        next++;
        oscillators = oscillators.slice(-4000);
        const passEnd = (startAt + next * pass - c.currentTime) * 1000;
        if (passes == 0 || next < passes) {
            // one pass ahead is enough: wake up shortly before the pass in the air ends
            timer = setTimeout(() => { if (!stopped) schedule(); }, Math.max(100, passEnd - 500));
        } else if (options.onEnd) {
            timer = setTimeout(() => { if (!stopped) options.onEnd(); }, passEnd + 300);
        }
    };
    if (song.notes.length && pass > 0) schedule();
    return {
        seconds: pass,
        stop() {
            stopped = true;
            clearTimeout(timer);
            for (const o of oscillators) { try { o.stop(); } catch (e) { /* already ended */ } }
            master.disconnect();
        },
    };
}

// A song of the game by name (songs/<name>.txt), parsed.
export async function loadSong(name) {
    const r = await fetch(`songs/${name}.txt`);
    if (!r.ok) throw new Error(`song ${name} not found`);
    return parseSong(await r.text());
}
