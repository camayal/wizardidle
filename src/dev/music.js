// Wizard Idle v2 - dev tools: the music mode (only while developing).
//
// The author's request (2026-11-18): the game's own music is code, not sound files, and it is
// written and changed in the dev console, both the author's songs and the ones the musician
// makes. A song is a plain text file (format in src/synth.js): songs/<name>.txt in the game, or
// <name>.song.txt in the review drop. Pick one (or start a new one), edit the text, press Play:
// while it plays, every edit restarts it so the change is heard at once. Save to game writes
// songs/<name>.txt through tools/serve.py. Unsaved edits are kept in this browser (drafts).
//
// Opened from the dev panel (Modes > Music), on the right of the game; the game waits until it is
// closed. The notes box (sound notes) carries the song's name and text, ready to copy.

import { parseSong, playSong } from '../synth.js';
import { sidePanel } from './panel.js';
import { setNoteSource, refreshNote } from './notes.js';
import { esc, reviewList } from './review.js';

const DRAFTS_KEY = 'wizardidle2:musicDrafts';       // name -> edited text not yet saved, in this browser
const LAST_KEY = 'wizardidle2:musicLast';
const NEW_SONG = '# A new song: see the format at the top of src/synth.js\ntitle New song\ntempo 90\nloop 2\n\nC4 0 1 lead\nE4 1 1 lead\nG4 2 1 lead\nC5 3 1 lead\nC3+G3 0 4 pad\nC2 0 2 bass\nG2 2 2 bass\n';

let side, p, tools, name = '', playing = null, restartTimer = null, saved = '';

function readJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (e) { return fallback; }
}
function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode */ }
}
const drafts = () => readJSON(DRAFTS_KEY, {});
const cleanName = (s) => s.trim().toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40);

function say(text) { p.status.textContent = text; }

// ---------------------------------------------------------------- playing

function stop() {
    clearTimeout(restartTimer);
    if (playing) { playing.stop(); playing = null; }
    if (p) p.play.textContent = 'Play';
}

function showProblems(song) {
    p.problems.innerHTML = song.errors.length ? song.errors.map((e) => `Line ${e.line}: ${esc(e.message)}`).join('<br>') : '';
    p.info.textContent = `${song.title || '(no title)'}: ${song.notes.length} notes, ${song.length} beats at ${song.tempo} bpm (${(song.length * 60 / song.tempo).toFixed(1)} s a pass)`;
}

function play() {
    stop();
    const song = parseSong(p.text.value);
    showProblems(song);
    if (!song.notes.length) return say('Nothing to play yet.');
    playing = playSong(song, { volume: Number(p.volume.value), loop: p.loop.checked ? true : undefined, onEnd: () => stop() });
    p.play.textContent = 'Restart';
    say('Playing.');
}

// ---------------------------------------------------------------- the text and the files

function setText(newName, text, fromFile = true) {
    stop();
    name = newName;
    p.name.value = name;
    p.text.value = text;
    if (fromFile) saved = text;
    showProblems(parseSong(text));
    writeJSON(LAST_KEY, name);
    refreshNote();
}

async function gameSongs() {
    try {
        const r = await fetch('/__list/songs', { cache: 'no-store' });
        return r.ok ? (await r.json()).filter((f) => f.endsWith('.txt')).map((f) => f.replace(/^.*\//, '').replace(/\.txt$/, '')) : [];
    } catch (e) { return []; }
}

async function fillSongs() {
    const names = await gameSongs();
    p.pick.innerHTML = '<option value="">(pick a song of the game)</option>' + names.map((n) => `<option>${esc(n)}</option>`).join('');
    return names;
}

async function openGameSong(n) {
    const r = await fetch(`songs/${n}.txt`, { cache: 'no-store' });
    if (!r.ok) return say(`songs/${n}.txt not found.`);
    const text = await r.text();
    const draft = drafts()[n];
    setText(n, draft ?? text);
    saved = text;
    say(draft != null && draft != text ? 'Opened with your unsaved edits (Revert goes back to the file).' : 'Opened.');
}

async function openReviewSong(e) {
    const r = await fetch(e.url, { cache: 'no-store' });
    if (!r.ok) return say(`${e.file} could not be read.`);
    setText(cleanName(e.file.replace(/^.*\//, '').replace(/\.song\.txt$/, '')), await r.text(), false);
    saved = '';
    say(`Opened from the review drop (${e.who}). Save to game puts it in songs/.`);
}

async function saveToGame() {
    const n = cleanName(p.name.value);
    if (!n) return say('Give the song a name (letters, numbers, _).');
    const r = await fetch(`/songs/${n}`, { method: 'POST', body: p.text.value }).catch(() => null);
    if (!r || !r.ok) return say('Could not save: run python tools/serve.py and open the game from it.');
    const all = drafts(); delete all[n]; writeJSON(DRAFTS_KEY, all);
    name = n; saved = p.text.value; p.name.value = n;
    say(`Saved to songs/${n}.txt.`);
    const names = await fillSongs();
    if (names.includes(n)) p.pick.value = n;
}

function buildPanel() {
    side = sidePanel('right', 'Music: songs made with code', () => close(true));
    side.body.innerHTML = `
        <div class="row"><select data-m="pick"></select><button data-m="open">Open</button><button data-m="new">New song</button></div>
        <details><summary>From the review drop (the musician's songs)</summary><div data-m="review"></div></details>
        <div class="row"><label>Name <input type="text" data-m="name" placeholder="song_name"></label>
            <button data-m="save">Save to game</button><button data-m="revert">Revert</button></div>
        <textarea data-m="text" spellcheck="false" style="height:24em;font-family:monospace;white-space:pre;overflow:auto"></textarea>
        <div class="row"><button data-m="play">Play</button><button data-m="stop">Stop</button>
            <label><input type="checkbox" data-m="loop"> Loop</label>
            <label>Volume <input type="range" data-m="volume" min="0" max="1" step="0.05" value="0.3"></label></div>
        <div class="muted" data-m="info"></div>
        <div class="note" data-m="problems"></div>
        <div class="muted" data-m="status"></div>`;
    p = { };
    for (const node of side.body.querySelectorAll('[data-m]')) p[node.dataset.m] = node;
    p.open.onclick = () => p.pick.value && openGameSong(p.pick.value);
    p.pick.onchange = () => p.pick.value && openGameSong(p.pick.value);
    p.new.onclick = () => { setText('', NEW_SONG, false); saved = ''; p.name.focus(); say('A new song: give it a name, then Save to game.'); };
    p.save.onclick = saveToGame;
    p.revert.onclick = () => {
        const all = drafts(); delete all[name]; writeJSON(DRAFTS_KEY, all);
        if (name && saved !== '') { setText(name, saved); say('Back to the saved file.'); } else say('Nothing saved to go back to.');
    };
    p.play.onclick = play;
    p.stop.onclick = () => { stop(); say('Stopped.'); };
    p.loop.onchange = () => { if (playing) play(); };
    p.volume.oninput = () => { if (playing) { clearTimeout(restartTimer); restartTimer = setTimeout(play, 300); } };
    p.text.oninput = () => {
        const key = cleanName(p.name.value) || name;
        if (key) { const all = drafts(); if (p.text.value == saved) delete all[key]; else all[key] = p.text.value; writeJSON(DRAFTS_KEY, all); }
        showProblems(parseSong(p.text.value));
        refreshNote();
        if (playing) { clearTimeout(restartTimer); restartTimer = setTimeout(play, 500); }
    };
    // Tab inserts spaces instead of leaving the box
    p.text.onkeydown = (e) => {
        if (e.key == 'Tab') { e.preventDefault(); document.execCommand('insertText', false, '  '); }
    };
    reviewList(p.review, (e) => /\.song\.txt$/i.test(e.file), [['Open', openReviewSong]]);
}

// ---------------------------------------------------------------- open and close

export async function open(devTools) {
    tools = devTools;
    tools.setSpeed(1);
    buildPanel();
    const names = await fillSongs();
    setNoteSource(() => `Song: ${name || '(unsaved)'}\n\n${p ? p.text.value : ''}`, 'sound');
    const last = readJSON(LAST_KEY, '');
    if (last && names.includes(last)) { p.pick.value = last; await openGameSong(last); }
    else if (names.length) { p.pick.value = names[0]; await openGameSong(names[0]); }
    else setText('', NEW_SONG, false);
}

// Close the panel; resume: the game goes on (not when another mode opens instead).
export function close(resume = true) {
    if (!side) return;
    stop();
    side.close();
    side = null;
    p = null;
    setNoteSource(null);
    if (resume) tools.closed();
}
