// Wizard Idle v2 - dev tools: the sounds mode (only while developing).
//
// The author's way to try sounds (2026-11-14): pick any scene (src/dev/scenes.js: an enemy's
// attack, a boss, a hydra, a spell, the dice, an object...), pick a sound, and play them together
// with the game's own code. The sound is cut (from / to, seconds of the file), extended (the cut
// repeated N times), sped up or slowed down, faded, and starts some ms after the first frame of
// the move (negative: before it). The game plays its sounds at volume 0.3. The spell that lands
// with the blow plays its school sound too, as in the game (it can be muted).
//
// "Needs a sound" (src/dev/soundNeeds.js) is a shortcut to the moves still waiting for one. The
// settings are kept per scene and per file (switching between two files keeps both cuts). The
// details of the test go to the author notes box (src/dev/notes.js), ready to copy.
//
// Opened from the dev panel (Modes > Sounds), on the right of the game; the console is hidden
// and the game waits until it is closed.

import * as loop from '../loop.js';
import { state } from '../state.js';
import { soundNeeds } from './soundNeeds.js';
import { listImages, scenePicker, stopScene } from './scenes.js';
import { setNoteSource, refreshNote } from './notes.js';
import { spell } from '../spells.js';
import { spells } from '../data/spells.js';
import { el } from '../ui/dom.js';
import { sidePanel } from './panel.js';
import { isSound, reviewList } from './review.js';

const SETTINGS_KEY = 'wizardidle2:soundMode';       // settings per scene and per file, in this browser
const FIELDS = ['cutFrom', 'cutTo', 'speed', 'extend', 'volume', 'fadeIn', 'fadeOut', 'startsAt'];
const DEFAULTS = { cutFrom: 0, cutTo: '', speed: 1, extend: 1, volume: 0.3, fadeIn: 0, fadeOut: 30, startsAt: 0 };

let side, p, picker, tools, audio, buffer, replay, startTimer, oggs = [], prevSpeed = 1, prevLevel;
let sources = [];
const files = new Map();                            // files added by the author: name -> File
const decoded = new Map();                          // sound name -> AudioBuffer

const needs = () => soundNeeds.filter((n) => !n.done);
const sceneKey = () => { const v = picker.get(); return `${v.kind}|${v.target}|${v.variant}`; };

// The need this scene is, if it is one.
function matchingNeed() {
    const v = picker.get();
    return needs().find((n) => n.scene.kind == v.kind && n.scene.target == v.target && (n.scene.variant || '') == v.variant);
}

// ---------------------------------------------------------------- the sound

function audioCtx() {
    if (!audio) audio = new AudioContext();
    if (audio.state == 'suspended') audio.resume();
    return audio;
}

async function loadSound(name) {
    buffer = null;
    p.fileLen.textContent = '';
    if (!name) return;
    try {
        if (!decoded.has(name)) {
            const data = files.has(name) ? await files.get(name).arrayBuffer() : await (await fetch(name)).arrayBuffer();
            decoded.set(name, await audioCtx().decodeAudioData(data));
        }
        buffer = decoded.get(name);
        p.fileLen.textContent = `file ${buffer.duration.toFixed(3)} s`;
    } catch (error) {
        p.fileLen.textContent = `can't play this file (${error.message})`;
    }
}

function settings() {
    const n = (name) => Number(p[name].value) || 0;
    const s = { cutFrom: n('cutFrom'), cutTo: n('cutTo'), speed: n('speed') || 1, extend: Math.max(1, n('extend')),
        volume: n('volume'), fadeIn: n('fadeIn'), fadeOut: n('fadeOut'), startsAt: n('startsAt') };
    if (buffer) s.cutTo = Math.min(s.cutTo || buffer.duration, buffer.duration);
    s.cutFrom = Math.min(Math.max(0, s.cutFrom), s.cutTo);
    s.length = (s.cutTo - s.cutFrom) / s.speed * s.extend;        // how long it plays, in s
    return s;
}

// Play the cut at audio time `when`.
function playCut(when) {
    const s = settings(), ctx = audioCtx();
    if (!buffer || s.length <= 0) return;
    const src = ctx.createBufferSource(), gain = ctx.createGain();
    src.buffer = buffer;
    src.playbackRate.value = s.speed;
    if (s.extend > 1) { src.loop = true; src.loopStart = s.cutFrom; src.loopEnd = s.cutTo; }
    src.connect(gain).connect(ctx.destination);
    const end = when + s.length, fadeIn = Math.min(s.fadeIn / 1000, s.length), fadeOut = Math.min(s.fadeOut / 1000, s.length - fadeIn);
    gain.gain.setValueAtTime(fadeIn ? 0 : s.volume, when);
    if (fadeIn) gain.gain.linearRampToValueAtTime(s.volume, when + fadeIn);
    if (fadeOut) { gain.gain.setValueAtTime(s.volume, end - fadeOut); gain.gain.linearRampToValueAtTime(0, end); }
    src.start(when, s.cutFrom);
    src.stop(end);
    sources.push(src);
}

// ---------------------------------------------------------------- play, stop, repeat

function stopAll() {
    clearTimeout(replay);
    clearTimeout(startTimer);
    for (const src of sources) try { src.stop(); } catch (e) { /* already stopped */ }
    sources = [];
    stopScene();
}

function play(withMove = true) {
    stopAll();
    const s = settings(), ctx = audioCtx(), t = picker.timing() || {};
    const soundAt = Math.max(0, s.startsAt), moveAt = Math.max(0, -s.startsAt);      // ms from now
    const again = t.again || 0;                 // the dice roll twice at the game's spacing
    playCut(ctx.currentTime + soundAt / 1000);
    if (again) playCut(ctx.currentTime + (soundAt + again) / 1000);
    const land = picker.landing();
    if (withMove) {
        startTimer = setTimeout(() => picker.play(() => {
            p.blow.classList.add('on');
            setTimeout(() => p.blow.classList.remove('on'), 250);
            if (land && p.landing.checked) spell(land, true);       // its effect and school sound, as in the game
        }), moveAt);
    }
    const moveMs = withMove ? (t.totalMs || 1000) + again : 0;
    const lasts = Math.max(moveAt + moveMs, soundAt + again + (buffer ? s.length * 1000 : 0));
    replay = setTimeout(() => {
        showTiming();
        if (!p.repeat.checked) return;
        picker.setUp();
        replay = setTimeout(() => play(withMove), 700);
    }, lasts + 50);
}

function showTiming() {
    const t = picker.timing();
    p.timing.textContent = !t ? '' : (t.hitMs !== undefined ? `Blow lands at ${t.hitMs} ms · ` : '') + (t.totalMs ? `the move lasts ${t.totalMs} ms` : '');
    refreshNote();
}

// ---------------------------------------------------------------- the notes (technical details)

function details() {
    if (!p) return '';
    const need = matchingNeed(), s = settings(), t = picker.timing();
    const name = p.sound.value, from = !name ? '' : files.has(name) ? ' (added file)' : ' (from ogg/, in the game)';
    const whole = buffer && s.cutFrom == 0 && Math.abs(s.cutTo - buffer.duration) < 0.0005;
    const ref = t ? (t.hitMs !== undefined ? `blow lands at ${t.hitMs} ms, ` : '') + (t.totalMs ? `the move lasts ${t.totalMs} ms` : '') : 'no timing';
    const land = picker.landing(), school = land && spells[land] && spells[land].school;
    return [
        need ? `Sound test ${need.id}: ${need.who}: ${need.move}` : 'Sound test (free choice)',
        `Scene: ${picker.describe()}`,
        `Verdict: ${p.verdict.value}`,
        `Sound: ${name || '(none)'}${from}`,
        `Cut: ${whole ? 'whole file' : `${s.cutFrom.toFixed(3)} s to ${s.cutTo.toFixed(3)} s`} (file ${buffer ? `${buffer.duration.toFixed(3)} s` : 'not loaded'})`,
        `Speed: ${s.speed}x | Extend: ${s.extend}x | Plays for ${s.length.toFixed(2)} s`,
        `Fade in ${s.fadeIn} ms, fade out ${s.fadeOut} ms | Volume ${s.volume}`,
        `Starts at ${s.startsAt} ms (${ref})`,
        `Landing sound: ${school && school != 'na' ? `${school} (${land}), ${p.landing.checked ? 'heard' : 'muted'}` : 'none'}`,
    ].join('\n');
}

// ---------------------------------------------------------------- settings per scene and file

function readStore() {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch (e) { return {}; }
}

function remember() {
    const store = readStore(), key = sceneKey();
    store.last = picker.get();
    const entry = store[key] = store[key] || { files: {} };
    entry.sound = p.sound.value;
    entry.files[p.sound.value] = Object.fromEntries(FIELDS.map((f) => [f, p[f].value]));
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(store)); } catch (e) { /* private mode */ }
    refreshNote();
}

// The settings of this scene with this file (each file keeps its own cut: a quick A/B).
async function recall(sound) {
    const entry = readStore()[sceneKey()] || { files: {} };
    if (sound === undefined) sound = entry.sound !== undefined ? entry.sound : p.sound.value;
    if (![...p.sound.options].some((o) => o.value == sound)) sound = '';      // an added file is gone after a reload
    p.sound.value = sound;
    const values = { ...DEFAULTS, ...entry.files[sound] };
    for (const f of FIELDS) p[f].value = values[f];
    await loadSound(sound);
    if (buffer && !p.cutTo.value) p.cutTo.value = buffer.duration.toFixed(3);
    markCurrent();
    const need = matchingNeed();
    p.need.value = need ? need.id : '';
    showTiming();
}

// The file the game plays today for this scene is marked in the picker.
function markCurrent() {
    const now = picker.current();
    for (const o of p.sound.options) o.textContent = o.value ? o.value + (o.value == now ? '  <- the game plays this now' : '') : '(no sound)';
}

function fillSounds() {
    const keep = p.sound.value;
    p.sound.innerHTML = '<option value="">(no sound)</option>' +
        (files.size ? `<optgroup label="Added files">${[...files.keys()].map((n) => `<option value="${n}">${n}</option>`).join('')}</optgroup>` : '') +
        (oggs.length ? `<optgroup label="In the game (ogg/)">${oggs.map((n) => `<option value="${n}">${n}</option>`).join('')}</optgroup>` : '');
    if ([...p.sound.options].some((o) => o.value == keep)) p.sound.value = keep;
    markCurrent();
}

// The game's own sounds (ogg/), from the folder listing tools/serve.py gives.
async function gameSounds() {
    try {
        const html = await (await fetch('ogg/')).text();
        return [...html.matchAll(/href="([^"]+\.ogg)"/gi)].map((m) => `ogg/${decodeURIComponent(m[1])}`);
    } catch (e) { return []; }
}

// ---------------------------------------------------------------- the panel

function buildPanel() {
    side = sidePanel('right', 'Sounds', () => close(true));
    const groups = [...new Set(needs().map((n) => n.who))];
    side.body.innerHTML = `
        <div class="row"><label>Needs a sound</label><select name="need"><option value="">(free choice)</option>${groups.map((g) =>
            `<optgroup label="${g}">${needs().filter((n) => n.who == g).map((n) => `<option value="${n.id}">${n.who}: ${n.move}</option>`).join('')}</optgroup>`).join('')}</select></div>
        <div class="devSub">Scene</div>
        <div data-scene></div>
        <details><summary>From the sessions (review/)</summary><div data-review></div></details>
        <div class="devSub">Sound</div>
        <div class="row"><select name="sound"></select></div>
        <div class="row"><label>Add files <input type="file" name="files" multiple accept="audio/*,.mp3,.ogg,.wav"></label>
            <span class="muted" data-out="fileLen"></span></div>
        <div class="row">
            <label>Cut from <input type="number" name="cutFrom" step="0.001" min="0"> s</label>
            <label>to <input type="number" name="cutTo" step="0.001" min="0"> s</label>
        </div>
        <div class="row">
            <label>Extend <input type="number" name="extend" step="1" min="1"> x</label>
            <label>Speed <input type="number" name="speed" step="0.05" min="0.1"> x</label>
            <label>Volume <input type="number" name="volume" step="0.05" min="0" max="1"></label>
        </div>
        <div class="row">
            <label>Fade in <input type="number" name="fadeIn" step="10" min="0"> ms</label>
            <label>Fade out <input type="number" name="fadeOut" step="10" min="0"> ms</label>
            <label>Starts at <input type="number" name="startsAt" step="10"> ms</label>
        </div>
        <div class="row"><button data-act="play">Play</button><button data-act="sound">Sound only</button><button data-act="stop">Stop</button>
            <label><input type="checkbox" name="repeat"> repeat</label>
            <label title="The spell's effect and school sound when the blow lands, as in the game"><input type="checkbox" name="landing" checked> landing sound</label></div>
        <div class="row"><span class="blow">● blow</span><span class="muted" data-out="timing"></span></div>
        <div class="row"><label>Verdict <select name="verdict"><option>COMMENT (not approved yet)</option><option>APPROVED</option></select></label>
            <span class="muted">goes to the author notes</span></div>`;
    p = { blow: side.body.querySelector('.blow') };
    for (const node of side.body.querySelectorAll('[name]')) p[node.name] = node;
    for (const node of side.body.querySelectorAll('[data-out]')) p[node.dataset.out] = node;

    picker = scenePicker(side.body.querySelector('[data-scene]'), tools.resetScene, async () => { stopAll(); await recall(); remember(); });
    // a sound from review/ joins the added files and is picked
    reviewList(side.body.querySelector('[data-review]'), isSound, [['Use', async (e) => {
        const blob = await (await fetch(e.url)).blob();
        files.set(e.file, new File([blob], e.file));
        decoded.delete(e.file);
        fillSounds();
        await recall(e.file);
        remember();
    }]]);
    const acts = { play: () => play(true), sound: () => play(false), stop: stopAll };
    side.body.onclick = (e) => { const act = e.target.dataset && e.target.dataset.act; if (act) acts[act](); };
    p.need.onchange = async () => {
        const need = needs().find((n) => n.id == p.need.value);
        if (!need) return;
        stopAll();
        picker.set(need.scene);
        picker.setUp();
        await recall();
        remember();
    };
    p.sound.onchange = async () => { await recall(p.sound.value); remember(); };
    for (const f of FIELDS) p[f].addEventListener('change', remember);
    for (const name of ['verdict', 'landing']) p[name].addEventListener('change', refreshNote);
    p.files.onchange = async () => {
        for (const file of p.files.files) { files.set(file.name, file); decoded.delete(file.name); }
        fillSounds();
        const first = p.files.files[0];
        p.files.value = '';
        if (first) { p.sound.value = first.name; await recall(first.name); remember(); }
    };
}

// ---------------------------------------------------------------- open and close

export async function open(devTools) {
    tools = devTools;
    prevSpeed = loop.getSpeed();
    prevLevel = state.player.lvl;          // the scene's tier changes it while the mode is open
    tools.setSpeed(1);
    await listImages();
    buildPanel();
    oggs = await gameSounds();
    fillSounds();
    el('console').style.visibility = 'hidden';
    el('backConsole').style.visibility = 'hidden';
    const last = readStore().last;
    if (last) picker.set(last);
    picker.setUp();
    setNoteSource(details, 'sound');
    await recall();
}

// Close the panel; resume: the game goes on (not when another mode opens instead).
export function close(resume = true) {
    if (!side) return;
    stopAll();
    side.close();
    side = null;
    p = null;
    setNoteSource(null);
    state.player.lvl = prevLevel;
    el('console').style.visibility = '';
    el('backConsole').style.visibility = '';
    tools.setSpeed(prevSpeed);
    if (resume) tools.closed();
}
