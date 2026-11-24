// Wizard Idle v2 - the game's own music: songs written as plain text and played live with
// Web Audio (oscillators, filters, envelopes, and stereo echo). No sound files, no library.
//
// A song is a text file (songs/<name>.txt), one line each:
//
//     # a comment
//     title Tower theme
//     tempo 84                  beats per minute
//     length 16                 beats in one pass (default: where the last note ends)
//     loop 2                    passes (default 1; 0 = forever)
//     echo 0.32 0.22            optional master stereo echo: delay s, feedback (0 0 = dry)
//
//     # Instrument formats (both 5-arg and 7-arg ADSR work; trailing key=val options are optional):
//     #   instrument name wave attack release gain [opts...]
//     #   instrument name wave attack decay sustain release gain [opts...]
//     #   waves: sine, triangle, square, sawtooth, noise
//     #   opts:  cutoff=Hz  q=res  detune=cents  vibrato=Hz  vdepth=cents  pan=-1..1
//     instrument lead triangle 0.02 0.25 0.22 detune=6 vibrato=4.5 vdepth=6 pan=-0.1
//
//     C4 0 1 lead               note, start beat, length in beats, instrument
//     C4@0.6 1 1 lead           @0.6 scales note volume (velocity)
//     C4->G4 2 2 lead           -> glides pitch smoothly from C4 to G4
//     C3+G3+C4 8 4 pad          a chord: notes joined with +

const WAVES = ['sine', 'triangle', 'square', 'sawtooth', 'noise'];
const BASE_INSTRUMENTS = {
    lead:  { wave: 'triangle', attack: 0.03,  decay: 0.15, sustain: 0.75, release: 0.35, gain: 0.20, cutoff: 2600, q: 1,   detune: 6,  vibrato: 4.5, vdepth: 5,  pan: -0.08 },
    pad:   { wave: 'sawtooth', attack: 0.65,  decay: 0.40, sustain: 0.80, release: 1.10, gain: 0.07, cutoff: 950,  q: 1.2, detune: 14, vibrato: 0.4, vdepth: 4,  pan: 0.05  },
    bass:  { wave: 'triangle', attack: 0.015, decay: 0.18, sustain: 0.65, release: 0.18, gain: 0.18, cutoff: 700,  q: 1.5, detune: 0,  vibrato: 0,   vdepth: 0,  pan: 0     },
    bell:  { wave: 'sine',     attack: 0.005, decay: 0.60, sustain: 0.20, release: 1.40, gain: 0.14, cutoff: 4500, q: 1,   detune: 9,  vibrato: 0,   vdepth: 0,  pan: 0.22  },
    pluck: { wave: 'sawtooth', attack: 0.005, decay: 0.22, sustain: 0.15, release: 0.28, gain: 0.13, cutoff: 1800, q: 2.0, detune: 4,  vibrato: 0,   vdepth: 0,  pan: -0.20 },
    choir: { wave: 'sawtooth', attack: 0.50,  decay: 0.30, sustain: 0.85, release: 0.90, gain: 0.07, cutoff: 1200, q: 2.5, detune: 18, vibrato: 5.0, vdepth: 10, pan: 0.12  },
    wind:  { wave: 'noise',    attack: 0.80,  decay: 0.50, sustain: 0.60, release: 1.20, gain: 0.05, cutoff: 650,  q: 3.5, detune: 0,  vibrato: 0.2, vdepth: 0,  pan: -0.15 },
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

function parseInstrument(rest) {
    const [name, wave, ...tokens] = rest;
    if (!name || !WAVES.includes(wave)) return null;
    const nums = [], opts = {};
    for (const tok of tokens) {
        const kv = /^([a-z]+)=(-?\d+(?:\.\d+)?)$/i.exec(tok);
        if (kv) {
            opts[kv[1].toLowerCase()] = Number(kv[2]);
        } else {
            const v = Number(tok);
            if (!(v >= 0)) return null;
            nums.push(v);
        }
    }
    let attack, decay, sustain, release, gain;
    if (nums.length === 3) {
        [attack, release, gain] = nums;
        decay = 0.05;
        sustain = 1.0;
    } else if (nums.length === 5) {
        [attack, decay, sustain, release, gain] = nums;
        if (sustain > 1) return null;
    } else {
        return null;
    }
    return {
        wave,
        attack,
        decay,
        sustain,
        release,
        gain,
        cutoff:  opts.cutoff  ?? 3400,
        q:       opts.q       ?? 1,
        detune:  opts.detune  ?? 0,
        vibrato: opts.vibrato ?? 0,
        vdepth:  opts.vdepth  ?? 0,
        pan:     Math.max(-1, Math.min(1, opts.pan ?? 0)),
    };
}

// Text -> { title, tempo, loops, length, echo, instruments, notes: [...], errors: [...] }.
export function parseSong(text) {
    const song = {
        title: '',
        tempo: 90,
        loops: 1,
        length: 0,
        echo: { time: 0.30, feedback: 0.20 },
        instruments: Object.fromEntries(Object.entries(BASE_INSTRUMENTS).map(([k, v]) => [k, { ...v }])),
        notes: [],
        errors: [],
    };
    const bad = (line, message) => song.errors.push({ line, message });
    const pending = [];
    String(text).split(/\r?\n/).forEach((raw, i) => {
        const line = raw.replace(/(^|\s)#.*$/, '').trim();
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
        if (word == 'echo') {
            const t = Number(rest[0]), fb = Number(rest[1] ?? 0.2);
            if (!(t >= 0) || !(fb >= 0 && fb < 0.9)) return bad(n, 'echo: delaySeconds (0..2) feedback (0..0.85)');
            song.echo = { time: Math.min(2, t), feedback: fb };
            return;
        }
        if (word == 'instrument') {
            const inst = parseInstrument(rest);
            if (!inst) return bad(n, `instrument: name, wave (${WAVES.join('/')}), attack, [decay, sustain,] release, gain [cutoff=Hz detune=cents pan=-1..1]`);
            song.instruments[rest[0]] = inst;
            return;
        }
        const [pitchToken, start, beats, instrument = 'lead'] = [word, ...rest];
        const [chordStr, velStr] = pitchToken.split('@');
        const vel = velStr === undefined ? 1 : Number(velStr);
        if (!(vel > 0 && vel <= 4)) return bad(n, `"${pitchToken}" has invalid @velocity (use 0.1..4)`);

        const parts = chordStr.split('+');
        const parsedNotes = [];
        for (const p of parts) {
            const [fromStr, toStr] = p.split('->');
            const midi = pitchToMidi(fromStr);
            const glideTo = toStr !== undefined ? pitchToMidi(toStr) : null;
            if (Number.isNaN(midi) || (glideTo !== null && Number.isNaN(glideTo))) {
                return bad(n, `"${p}" is not a note (like C4, F#3, Bb2, or C4->G4)`);
            }
            parsedNotes.push({ midi, glideTo });
        }
        if (start === undefined || !(Number(start) >= 0)) return bad(n, 'start beat needs a number');
        if (!(Number(beats) > 0)) return bad(n, 'length in beats needs a number above 0');
        for (const pn of parsedNotes) {
            pending.push({ midi: pn.midi, glideTo: pn.glideTo, vel, start: Number(start), beats: Number(beats), instrument, line: n });
        }
    });
    for (const note of pending) {
        if (!song.instruments[note.instrument]) { bad(note.line, `unknown instrument "${note.instrument}"`); continue; }
        song.notes.push(note);
    }
    if (!song.length) song.length = Math.ceil(song.notes.reduce((end, x) => Math.max(end, x.start + x.beats), 0));
    return song;
}

let context = null;
let noiseBuffer = null;

function audioContext() {
    if (!context) context = new (window.AudioContext || window.webkitAudioContext)();
    context.resume();
    return context;
}

function getNoiseBuffer(c) {
    if (noiseBuffer && noiseBuffer.sampleRate === c.sampleRate) return noiseBuffer;
    const len = c.sampleRate * 2;
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    noiseBuffer = buf;
    return buf;
}

// Play a parsed song. options: { volume (0.3, like every game sound), loop (true: forever, false: one pass,
// default: the song's own loop line), onEnd }. Returns { stop(), seconds } (seconds of one pass).
export function playSong(song, options = {}) {
    const c = audioContext();
    const beat = 60 / song.tempo, pass = song.length * beat;
    const passes = options.loop === true ? 0 : options.loop === false ? 1 : song.loops;

    const master = c.createGain();
    const tone = c.createBiquadFilter();
    const limiter = c.createDynamicsCompressor();
    master.gain.value = (options.volume ?? 0.3) / 0.3 * 0.85;
    tone.type = 'lowpass';
    tone.frequency.value = 4800;
    limiter.threshold.value = -10;
    limiter.ratio.value = 6;

    master.connect(tone);
    tone.connect(limiter);
    limiter.connect(c.destination);

    // Optional stereo echo bus for spacious tower/shrine resonance
    let delayNode = null;
    if (song.echo && song.echo.time > 0 && song.echo.feedback > 0) {
        delayNode = c.createDelay(2.0);
        const fb = c.createGain();
        const wet = c.createGain();
        const echoTone = c.createBiquadFilter();
        delayNode.delayTime.value = song.echo.time;
        fb.gain.value = song.echo.feedback;
        wet.gain.value = 0.28;
        echoTone.type = 'lowpass';
        echoTone.frequency.value = 2200;

        master.connect(delayNode);
        delayNode.connect(echoTone);
        echoTone.connect(fb);
        fb.connect(delayNode);
        echoTone.connect(wet);
        wet.connect(limiter);
    }

    let sources = [], timer = null, stopped = false, next = 0;
    const startAt = c.currentTime + 0.1;

    const schedule = () => {
        const t0 = startAt + next * pass;
        for (const note of song.notes) {
            const v = song.instruments[note.instrument];
            const t = t0 + note.start * beat;
            const d = Math.max(0.02, note.beats * beat * 0.96);
            const endAt = t + d + v.release;
            const peak = v.gain * (note.vel ?? 1);
            const sustainLevel = peak * (v.sustain ?? 1);

            // Per-voice filter + envelope + stereo pan
            const filter = c.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(v.cutoff ?? 3400, t);
            filter.Q.value = v.q ?? 1;

            const env = c.createGain();
            const attackEnd = t + v.attack;
            const decayEnd = Math.min(t + d, attackEnd + (v.decay ?? 0.05));
            env.gain.setValueAtTime(0, t);
            env.gain.linearRampToValueAtTime(peak, attackEnd);
            env.gain.linearRampToValueAtTime(sustainLevel, decayEnd);
            env.gain.setValueAtTime(sustainLevel, Math.max(decayEnd, t + d));
            env.gain.linearRampToValueAtTime(0, endAt);

            const panner = c.createStereoPanner ? c.createStereoPanner() : null;
            if (panner) panner.pan.value = v.pan ?? 0;

            filter.connect(env);
            if (panner) { env.connect(panner); panner.connect(master); }
            else { env.connect(master); }

            // Optional pitch vibrato LFO
            let lfo = null;
            if (v.wave !== 'noise' && v.vibrato > 0 && v.vdepth > 0) {
                lfo = c.createOscillator();
                const lfoGain = c.createGain();
                lfo.frequency.value = v.vibrato;
                lfoGain.gain.value = v.vdepth;
                lfo.connect(lfoGain);
                lfo.start(t);
                lfo.stop(endAt + 0.05);
                sources.push(lfo);
                lfo._gain = lfoGain;
            }

            if (v.wave === 'noise') {
                const src = c.createBufferSource();
                src.buffer = getNoiseBuffer(c);
                src.loop = true;
                src.connect(filter);
                src.start(t);
                src.stop(endAt + 0.05);
                sources.push(src);
            } else {
                const detunes = v.detune ? [-v.detune / 2, v.detune / 2] : [0];
                const voiceGain = detunes.length > 1 ? c.createGain() : null;
                if (voiceGain) {
                    voiceGain.gain.value = 0.65;
                    voiceGain.connect(filter);
                }
                for (const det of detunes) {
                    const o = c.createOscillator();
                    o.type = v.wave;
                    o.frequency.setValueAtTime(hz(note.midi), t);
                    if (note.glideTo !== null) {
                        o.frequency.exponentialRampToValueAtTime(hz(note.glideTo), t + d);
                    }
                    if (det) o.detune.value = det;
                    if (lfo) lfo._gain.connect(o.detune);
                    o.connect(voiceGain || filter);
                    o.start(t);
                    o.stop(endAt + 0.05);
                    sources.push(o);
                }
            }
        }
        next++;
        sources = sources.slice(-6000);
        const passEnd = (startAt + next * pass - c.currentTime) * 1000;
        if (passes == 0 || next < passes) {
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
            for (const s of sources) { try { s.stop(); } catch (e) { /* already ended */ } }
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