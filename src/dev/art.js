// Wizard Idle v2 - dev tools: the art mode (only while developing).
//
// For the artist and the author: see the art in the real scene, played by the game's own code.
// Opened from the dev panel (Modes > Art), on the right of the game; the game waits until it is closed.
//
// The author's rework (2026-11-17):
//   Files       one table: the sessions' newest images (review/), local files, and game files chosen
//               by folder (no names to type). Each row: Scene, Alt, View.
//   Scene       the game's scene plays the "Scene" file in place of the game image it replaces (or
//               alone, at a chosen spot, when the game doesn't use it yet).
//   Alt scene   under the game, where the console was: the same scene with the "Alt" file, or with
//               the game's own art when no Alt is chosen, to compare side by side. The game can play
//               one scene at a time, so the alt one is recorded on a first pass and replayed in step.
//   Frame size  found by itself (the name's rules, then the pictures in the strip), overridable.
//   Viewer      one, over the game, for what isn't a sprite in a scene (sheets, close-ups) or to
//               look at any file frame by frame.
//
// The details (scene, files, frame size, the viewer) go to the author notes box.

import { state } from '../state.js';
import { ui } from '../runtime.js';
import * as loop from '../loop.js';
import { bossAttacks } from '../data/bossAttacks.js';
import { drawWizard, forgetImages, loadNPC, replaceImage } from '../ui/render.js';
import { listImagePaths, playStripInScene, sceneForImage, scenePicker, stopScene } from './scenes.js';
import { setNoteSource, refreshNote } from './notes.js';
import { el } from '../ui/dom.js';
import { art } from '../media.js';
import { gameBox, sidePanel } from './panel.js';
import { esc, isImage, reviewEntries } from './review.js';

const STORE_KEY = 'wizardidle2:artMode';
const FIELDS = ['speed', 'fms', 'where', 'fw', 'fh', 'folder'];
const SCENE_CANVASES = ['esceneCanvas', 'pjCanvas', 'npcCanvas', 'spellCanvas'];

let side, p, picker, tools, prevSpeed = 1, prevLevel, prevCrisp, replay, playToken = 0;
let rows = [], added = [], paths = [];
const slots = { main: null, alt: null };       // a row put in the scene / the alt scene, with its picture
const name = (path) => String(path || '').split('/').pop();
const base = (path) => name(path).replace(/\.png$/i, '');

// The game's path of an image written any way (name, name.png, img/name.png, with folders).
function gamePath(text) {
    return art(base(text));
}

// What a review line says it replaces, when it names one game file ("-" or a set: none).
function cleanReplaces(text) {
    return text && !/\s|<|\.\.\./.test(text) ? text : '';
}

function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
    });
}

// ---------------------------------------------------------------- frame size

// The frame size the game's code uses for an image, from its name; null when no rule knows it.
function ruleFrame(file, img) {
    const b = base(file), h = img.naturalHeight;
    if (/^scene_/.test(b)) return [256, 64];
    if (/^anim_(mother|icedra|hydskon)_(strike|cast|idle)/.test(b)) return [84, h];
    if (/^anim_(mother|icedra|hydskon)_grow/.test(b)) return [64, h];
    if (Object.keys(bossAttacks).some((x) => b.startsWith(`anim_${x}_`))) return [104, 80];
    if (/^spell/.test(b)) return [30, 30];
    const fx = { fx_slash: [24, 32], fx_bite: [14, 14], fx_dust: [24, 8], fx_arrow: [12, 5], fx_sting: [12, 5], fx_thrust: [28, 10], fx_smash: [24, 40], fx_impact: [16, 16] };
    if (fx[b]) return fx[b];
    if (/^fx_spark_/.test(b)) return [16, 16];
    return null;
}

// Sheets the sessions make to compare options, not sprites the game draws: the viewer only.
const isSheet = (file) => /sheet|close_?up|compar|before_after|_vs_/i.test(file);

// The frame width read from the pictures: strip widths that divide the image are tried, and the
// one whose neighbouring frames overlap the most (an animation moves a little each frame) wins;
// the smallest of the nearly-best ones, since two frames side by side also look alike.
function pixelFrame(img) {
    const w = img.naturalWidth, h = img.naturalHeight;
    if (w < h * 1.5) return [w, h];
    let alpha;
    try {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const cx = c.getContext('2d');
        cx.drawImage(img, 0, 0);
        const data = cx.getImageData(0, 0, w, h).data;
        alpha = new Uint8Array(w * h);
        for (let i = 0; i < w * h; i++) alpha[i] = data[i * 4 + 3] > 0 ? 1 : 0;
    } catch (e) { return w % h == 0 ? [h, h] : [w, h]; }
    const score = (fw) => {
        const n = w / fw;
        let total = 0;
        for (let k = 0; k < n - 1; k++) {
            let both = 0, any = 0;
            for (let y = 0; y < h; y++) for (let x = 0; x < fw; x++) {
                const a = alpha[y * w + k * fw + x], b = alpha[y * w + (k + 1) * fw + x];
                both += a & b; any += a | b;
            }
            total += any ? both / any : 0.5;
        }
        return total / (n - 1);
    };
    const scores = [];
    for (let fw = Math.max(4, Math.floor(h / 4)); fw <= w / 2; fw++) if (w % fw == 0) scores.push([fw, score(fw)]);
    if (!scores.length) return [w, h];
    const best = Math.max(...scores.map((s) => s[1]));
    if (best < 0.35) return [w, h];
    const square = scores.find((s) => s[0] == h);
    if (square && square[1] >= best * 0.85) return [h, h];
    return [scores.find((s) => s[1] >= best * 0.92)[0], h];
}

// A row's frame size and how it was found: [w, h, how].
function autoFrame(row, img) {
    if (!img) return [32, 32, '-'];
    if (isSheet(row.file)) return [img.naturalWidth, img.naturalHeight, 'whole picture'];
    const rule = ruleFrame(row.file, img) || (row.replaces && ruleFrame(row.replaces, img));
    if (rule) return [...rule, 'from the name'];
    return [...pixelFrame(img), 'from the pictures'];
}

// The size used: the boxes when filled in by hand, otherwise the one found.
function frameOf(slot) {
    const fw = Number(p.fw.value), fh = Number(p.fh.value);
    return [fw || slot.fw, fh || slot.fh];
}

// ---------------------------------------------------------------- the files table

async function readRows() {
    const review = (await reviewEntries()).filter(isImage).filter((e) => !/\s/.test(e.file)).slice(0, 30)
        .map((e) => ({ ...e, kind: 'review', replaces: cleanReplaces(e.replaces) }));
    for (const r of review) r.id = rowId(r);
    rows = [...added, ...review];
    drawTable();
}

function drawTable() {
    if (!p) return;
    const mark = (r) => `${slots.main && slots.main.id == r.id ? ' isMain' : ''}${slots.alt && slots.alt.id == r.id ? ' isAlt' : ''}`;
    const sprite = (r) => !isSheet(r.file);
    p.files.innerHTML = rows.length ? `<table class="files"><tr><th>File</th><th>Replaces</th><th></th></tr>` +
        rows.map((r, i) => `<tr class="${mark(r)}"><td class="name"><b>${esc(r.file)}</b>
            <div class="small">${r.kind == 'review' ? `${esc(r.who)}, ${esc(r.date)}${r.note ? `: ${esc(r.note)}` : ''}` : r.kind == 'local' ? 'local file' : 'game file'}</div></td>
            <td class="small">${esc(r.kind == 'game' ? '(itself)' : r.replaces || '-')}</td>
            <td class="acts">${sprite(r) ? `<button data-row="${i}:main" title="Play it in the game's scene">Scene</button><button data-row="${i}:alt" title="Play it in the alt scene, to compare">Alt</button>` : ''}<button data-row="${i}:view" title="Open it in the viewer">View</button></td></tr>`).join('') +
        '</table>' : '<div class="muted">No files yet: the sessions drop them in review/, or add one below.</div>';
}

function rowId(r) {
    return `${r.kind}:${r.file}:${r.url || ''}:${r.date || ''}`;
}

function addRow(r) {
    r.id = rowId(r);
    added = [r, ...added.filter((x) => x.id != r.id)];
    rows = [r, ...rows.filter((x) => x.id != r.id)];
    drawTable();
}

// The game file lists: folder, then file (with a filter), from the server's list of img/.
function fillFolders(saved) {
    const folders = [...new Set(paths.map((x) => x.slice(0, x.lastIndexOf('/'))))].sort();
    p.folder.innerHTML = folders.map((f) => `<option>${f}</option>`).join('');
    if (saved && folders.includes(saved)) p.folder.value = saved;
    fillGameFiles();
}

function fillGameFiles() {
    const folder = p.folder.value, filter = p.filter.value.trim().toLowerCase();
    const files = paths.filter((x) => filter ? x.toLowerCase().includes(filter) : x.slice(0, x.lastIndexOf('/')) == folder);
    p.gameFile.innerHTML = files.slice(0, 400).map((x) => `<option value="${x}">${filter ? x.slice(4) : name(x)}</option>`).join('');
}

function addGameFile() {
    const path = p.gameFile.value;
    if (!path) return;
    addRow({ kind: 'game', file: name(path), url: null, replaces: path });
}

function addLocalFile() {
    const file = p.localFile.files[0];
    if (!file) return;
    const replaces = p.localReplaces.checked ? p.gameFile.value : '';
    addRow({ kind: 'local', file: file.name, url: URL.createObjectURL(file), replaces });
    p.localFile.value = '';
}

function onRow(ev) {
    const r = ev.target.dataset && ev.target.dataset.row;
    if (!r) return;
    const [i, what] = r.split(':');
    const row = rows[Number(i)];
    if (what == 'view') openViewer(row);
    else setSlot(what, row);
}

// ---------------------------------------------------------------- scene and alt scene

const sceneOf = (slot) => slot && slot.replaces ? sceneForImage(slot.replaces) : null;
const altActive = () => !!(slots.alt || (slots.main && slots.main.url && slots.main.replaces));   // a new file vs the game's own
const speed = () => Number(p.speed.value);

async function setSlot(which, row) {
    stop();
    const img = await loadImage(row.url || gamePath(row.replaces || row.file));
    if (!p) return;
    if (!img) { p.tryNote.textContent = `Can't load ${row.file}.`; return; }
    const [fw, fh, how] = autoFrame(row, img);
    slots[which] = { ...row, img, fw, fh, how };
    const scene = sceneOf(slots[which]);
    if (scene && (which == 'main' || !sceneOf(slots.main))) {
        picker.set({ ...scene, tier: scene.tier !== undefined ? scene.tier : picker.get().tier });
    }
    showSlots();
    drawTable();
    remember();
    playScene();
}

function clearSlot(which) {
    const slot = slots[which];
    slots[which] = null;
    if (slot && slot.url && slot.replaces) replaceImage(gamePath(slot.replaces), gamePath(slot.replaces));
    stop();
    picker.setUp();
    showSlots();
    drawTable();
    clearAlt();
}

function showSlots() {
    const say = (slot) => !slot ? '' : `${esc(slot.file)}${slot.url && slot.replaces ? ` <span class="muted">in place of ${esc(name(slot.replaces))}</span>` : ''}` +
        `${sceneOf(slot) ? '' : ` <span class="muted">(alone, at the ${p.where.value == 'scene' ? 'whole scene' : `${p.where.value}'s spot`})</span>`}`;
    p.nowMain.innerHTML = slots.main ? `${say(slots.main)} <button data-act="clearMain">×</button>` : '<span class="muted">the game\'s own art</span>';
    p.nowAlt.innerHTML = slots.alt ? `${say(slots.alt)} <button data-act="clearAlt">×</button>` :
        `<span class="muted">${altActive() ? "the game's own art" : 'off (choose Alt on a file, or a Scene file to compare with the game)'}</span>`;
    const s = slots.main || slots.alt;
    p.autoSize.textContent = s ? `found ${s.fw} x ${s.fh} (${s.how})` : '';
}

// Put the art of one pass in the game's place: its file where it replaces, the other pass's
// replaced image back to the game's own.
async function applyArt(which) {
    const on = slots[which], off = slots[which == 'main' ? 'alt' : 'main'];
    const jobs = [];
    if (off && off.url && off.replaces && !(on && on.url && on.replaces == off.replaces)) jobs.push(replaceImage(gamePath(off.replaces), gamePath(off.replaces)));
    if (on && on.url && on.replaces) jobs.push(replaceImage(gamePath(on.replaces), on.url));
    await Promise.all(jobs);
}

// One pass: the scene the picker says, or a picture the game doesn't use, alone on the scene.
function runPass(which, onHit = () => {}) {
    const slot = slots[which];
    if (slot && !sceneOf(slot)) {
        const [fw, fh] = frameOf(slot);
        tools.resetScene();
        playStripInScene(slot.img, { where: p.where.value, fw, fh, ms: Number(p.fms.value) || 100 });
        return;
    }
    // a file of another tier (lvl70 while the scene is at tier 20) plays at its own tier
    const scene = sceneOf(slot);
    picker.setUp(scene && scene.tier !== undefined ? scene.tier : undefined);
    picker.play(onHit);
}

function passMs(which) {
    const slot = slots[which];
    if (slot && !sceneOf(slot)) {
        const [fw] = frameOf(slot), frames = Math.max(1, Math.floor(slot.img.naturalWidth / fw));
        return Math.max(1000, frames * (Number(p.fms.value) || 100)) / speed() + 100;
    }
    const t = picker.timing() || {};
    return ((t.totalMs || 1500) + (t.again || 0)) / speed() + 100;
}

function flashBlow() {
    if (!p) return;
    p.blow.classList.add('on');
    setTimeout(() => p && p.blow.classList.remove('on'), 300);
}

async function playScene() {
    const token = ++playToken;
    clearTimeout(replay);
    stopAlt();
    loop.setSpeed(speed());
    if (altActive()) {
        const key = JSON.stringify([picker.get(), p.speed.value, p.where.value, p.fw.value, p.fh.value, p.fms.value,
            slots.main && slots.main.id, slots.alt && slots.alt.id, alt.canvas.width, alt.canvas.height]);
        if (alt.key != key) {
            alt.label.textContent = 'Alt scene: recording…';
            await applyArt('alt');
            if (token != playToken) return;
            await record(() => runPass('alt'), passMs('alt'), token);
            if (token != playToken) return;
            alt.key = key;
        }
    }
    await applyArt('main');
    if (token != playToken || !p) return;
    runPass('main', flashBlow);
    if (altActive()) replayAlt();
    replay = setTimeout(() => {
        if (!p || token != playToken) return;
        showTiming();               // a hydra's strip has loaded by now: its timing is known
        if (p.repeat.checked) replay = setTimeout(playScene, 600);
    }, passMs('main'));
}

function stop() {
    playToken++;
    clearTimeout(replay);
    stopAlt();
    stopScene();
}

function showTiming() {
    const t = picker.timing();
    p.timing.textContent = !t ? '' : (t.hitMs !== undefined ? `Blow lands at ${t.hitMs} ms (frame ${Math.round(t.hitMs / 100)}) · ` : '') +
        (t.totalMs ? `lasts ${t.totalMs} ms` : '');
    refreshNote();
}

// The alt scene: a canvas where the console was, showing a recording of the alt pass.
const alt = { box: null, canvas: null, label: null, frames: [], key: '', raf: 0, timer: 0 };

function buildAlt() {
    alt.box = document.createElement('div');
    alt.box.className = 'artAlt';
    alt.box.innerHTML = '<div></div><canvas></canvas>';
    Object.assign(alt.box.style, { position: 'fixed', zIndex: 9990, background: '#1b1612', border: '1px solid #2a5fa8', borderRadius: '3px',
        font: '12px sans-serif', color: '#cfe0ff', boxSizing: 'border-box', padding: '2px' });
    document.body.appendChild(alt.box);
    alt.label = alt.box.firstChild;
    alt.label.style.padding = '0 4px 2px';
    alt.canvas = alt.box.lastChild;
    alt.canvas.style.display = 'block';
    placeAlt();
    alt.timer = setInterval(placeAlt, 1000);
    clearAlt();
}

// Under the scene, in the console's place: as wide as the scene, its height kept in proportion.
function placeAlt() {
    if (!alt.box) return;
    const scene = el('esceneCanvas').getBoundingClientRect(), back = el('backConsole').getBoundingClientRect();
    if (!scene.width) return;
    const room = back.height ? back : { left: scene.left, top: scene.bottom + 8, width: scene.width, height: innerHeight - scene.bottom - 16 };
    let w = Math.min(scene.width, room.width), h = w * scene.height / scene.width;
    if (h > room.height - 22) { h = Math.max(40, room.height - 22); w = h * scene.width / scene.height; }
    w = Math.round(w); h = Math.round(h);
    Object.assign(alt.box.style, { left: `${Math.round(room.left + (room.width - w) / 2)}px`, top: `${Math.round(room.top)}px`, width: `${w + 6}px` });
    if (alt.canvas.width != w || alt.canvas.height != h) {
        alt.canvas.width = w; alt.canvas.height = h;
        alt.frames = [];
        alt.key = '';
        clearAlt();
    }
}

function clearAlt() {
    if (!alt.canvas) return;
    const ctx = alt.canvas.getContext('2d');
    ctx.fillStyle = '#1b1612';
    ctx.fillRect(0, 0, alt.canvas.width, alt.canvas.height);
    alt.label.textContent = altActive() ? `Alt scene: ${slots.alt ? slots.alt.file : "the game's own art"} (plays with the scene)` :
        'Alt scene: choose Alt on a file, or a Scene file to compare it with the game\'s art';
}

// The scene's background is the canvas's CSS background (render.js loadBackground), drawn "contain".
const backgrounds = new Map();
function background() {
    const m = /url\(["']?([^"')]+)["']?\)/.exec(el('esceneCanvas').style.backgroundImage || '');
    if (!m) return null;
    if (!backgrounds.has(m[1])) { const img = new Image(); img.src = m[1]; backgrounds.set(m[1], img); }
    const img = backgrounds.get(m[1]);
    return img.complete && img.naturalWidth ? img : null;
}

// The scene as it is on the screen, at the alt canvas's size.
function snapshot() {
    const c = document.createElement('canvas');
    c.width = alt.canvas.width; c.height = alt.canvas.height;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const box = el('esceneCanvas').getBoundingClientRect(), k = c.width / box.width;
    const back = background();
    if (back) {
        const fit = Math.min(c.width / back.naturalWidth, c.height / back.naturalHeight);
        ctx.drawImage(back, 0, 0, back.naturalWidth * fit, back.naturalHeight * fit);
    }
    for (const id of SCENE_CANVASES) {
        const node = el(id);
        if (!node || !node.width) continue;
        const r = node.getBoundingClientRect(), css = getComputedStyle(node);
        if (!r.width || css.display == 'none' || css.visibility == 'hidden') continue;
        ctx.globalAlpha = Number(css.opacity);
        ctx.drawImage(node, (r.left - box.left) * k, (r.top - box.top) * k, r.width * k, r.height * k);
    }
    return c;
}

function record(run, ms, token) {
    return new Promise((resolve) => {
        const frames = [], t0 = performance.now();
        run();
        const grab = () => {
            if (token != playToken || !p) return resolve();
            const t = performance.now() - t0;
            frames.push({ t, c: snapshot() });
            if (t < ms) setTimeout(grab, 40);
            else { alt.frames = frames; resolve(); }
        };
        grab();
    });
}

function replayAlt() {
    stopAlt();
    const frames = alt.frames, ctx = alt.canvas.getContext('2d'), t0 = performance.now();
    if (!frames.length) return;
    alt.label.textContent = `Alt scene: ${slots.alt ? slots.alt.file : "the game's own art"}`;
    let i = 0;
    const tick = () => {
        const t = performance.now() - t0;
        while (i < frames.length - 1 && frames[i + 1].t <= t) i++;
        ctx.drawImage(frames[i].c, 0, 0);
        if (i < frames.length - 1) alt.raf = requestAnimationFrame(tick);
    };
    tick();
}

function stopAlt() {
    cancelAnimationFrame(alt.raf);
}

function reloadArt() {
    stop();
    forgetImages();
    alt.key = '';
    p.tryNote.textContent = 'Art reloaded from disk.';
    picker.setUp();
    refreshNote();
}

function setCrisp(on) {
    ui.crisp = on;
    document.documentElement.classList.toggle('crisp', on);
    drawWizard();
    if (state.npc) loadNPC(state.npc);
}

// ---------------------------------------------------------------- the viewer (one, over the game)

const viewer = { box: null, v: {}, row: null, img: null, fw: 0, fh: 0, how: '', frame: 0, timer: 0 };

function buildViewer() {
    const box = viewer.box = document.createElement('div');
    box.className = 'devPanel artViewer';
    box.innerHTML = `
        <div class="devHead"><b data-v="title"></b><button data-v="close">Close</button></div>
        <div class="row"><label>Zoom <select data-v="zoom"><option value="0">fit</option><option>1</option><option>2</option><option>4</option><option>8</option></select></label>
            <label>Backdrop <select data-v="backdrop"><option value="light">light</option><option value="mid">grey</option><option value="dark">dark</option><option value="checks">checks</option></select></label>
            <label><input type="checkbox" data-v="grid"> grid</label><label><input type="checkbox" data-v="onion"> ghost</label><label><input type="checkbox" data-v="feet"> feet line</label></div>
        <div class="row"><label>Frame <input type="number" data-v="fw" min="1" placeholder="auto"> x <input type="number" data-v="fh" min="1" placeholder="auto"> px</label>
            <span class="muted" data-v="how"></span></div>
        <div class="row"><button data-v="prev">◀</button><button data-v="play">Play</button><button data-v="next">▶</button>
            <span data-v="frameNo"></span><label><input type="number" data-v="ms" min="20" step="10" value="100"> ms a frame</label></div>
        <div style="overflow:auto"><canvas></canvas></div>`;
    const v = viewer.v;
    for (const node of box.querySelectorAll('[data-v]')) v[node.dataset.v] = node;
    v.canvas = box.querySelector('canvas');
    Object.assign(box.style, { display: 'none' });
    document.body.appendChild(box);
    box.addEventListener('keydown', (e) => e.stopPropagation());
    v.close.onclick = closeViewer;
    v.prev.onclick = () => stepViewer(-1);
    v.next.onclick = () => stepViewer(1);
    v.play.onclick = togglePlay;
    v.ms.onchange = () => { if (viewer.timer) { togglePlay(); togglePlay(); } };
    for (const k of ['zoom', 'backdrop', 'grid', 'onion', 'feet', 'fw', 'fh']) v[k].addEventListener('change', drawViewer);
    v.feet.checked = true;
}

function placeViewer() {
    const g = gameBox(), s = viewer.box.style;
    Object.assign(s, { left: `${Math.max(8, g.left)}px`, width: `${Math.min(innerWidth - 16, Math.max(320, g.right - g.left))}px`,
        top: `${Math.max(8, g.top)}px`, maxHeight: `${innerHeight - Math.max(8, g.top) - 8}px`, bottom: '', right: '' });
}

async function openViewer(row) {
    const img = await loadImage(row.url || gamePath(row.replaces || row.file));
    if (!img) { p.tryNote.textContent = `Can't load ${row.file}.`; return; }
    [viewer.fw, viewer.fh, viewer.how] = autoFrame(row, img);
    Object.assign(viewer, { row, img, frame: 0 });
    viewer.v.fw.value = ''; viewer.v.fh.value = '';
    viewer.v.title.textContent = row.file;
    viewer.box.style.display = '';
    placeViewer();
    drawViewer();
}

function closeViewer() {
    clearInterval(viewer.timer);
    viewer.timer = 0;
    viewer.v.play.textContent = 'Play';
    viewer.box.style.display = 'none';
    viewer.row = null;
    refreshNote();
}

function viewerFrame() {
    return [Number(viewer.v.fw.value) || viewer.fw, Number(viewer.v.fh.value) || viewer.fh];
}

function drawViewer() {
    const v = viewer.v, img = viewer.img;
    if (!img || !viewer.row) return;
    const [fw, fh] = viewerFrame(), n = Math.max(1, Math.floor(img.naturalWidth / fw)), f = viewer.frame % n;
    const room = viewer.box.clientWidth - 24;
    const zoom = Number(v.zoom.value) || Math.max(1, Math.floor(Math.min(room / fw, (innerHeight * 0.6) / fh)));
    const canvas = v.canvas, ctx = canvas.getContext('2d');
    canvas.width = fw * zoom + 8;
    canvas.height = fh * zoom + 8;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = { dark: '#111', mid: '#7a7a7a', light: '#f2f2f2' }[v.backdrop.value] || '#f2f2f2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (v.backdrop.value == 'checks') {
        for (let y = 0; y < canvas.height; y += 8) for (let x = 0; x < canvas.width; x += 8) {
            ctx.fillStyle = (x + y) % 16 ? '#ccc' : '#999';
            ctx.fillRect(x, y, 8, 8);
        }
    }
    const x = 4, y = 4;
    if (v.onion.checked && n > 1) {
        ctx.globalAlpha = 0.3;
        ctx.drawImage(img, ((f + n - 1) % n) * fw, 0, fw, fh, x, y, fw * zoom, fh * zoom);
        ctx.globalAlpha = 1;
    }
    ctx.drawImage(img, f * fw, 0, fw, fh, x, y, fw * zoom, fh * zoom);
    if (v.grid.checked && zoom >= 4) {
        ctx.strokeStyle = 'rgba(128,128,128,0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i <= fw; i++) { ctx.moveTo(x + i * zoom + 0.5, y); ctx.lineTo(x + i * zoom + 0.5, y + fh * zoom); }
        for (let j = 0; j <= fh; j++) { ctx.moveTo(x, y + j * zoom + 0.5); ctx.lineTo(x + fw * zoom, y + j * zoom + 0.5); }
        ctx.stroke();
    }
    if (v.feet.checked && n > 1) {
        const feet = feetRow(img, fw, fh);
        if (feet >= 0) {
            ctx.strokeStyle = '#0a6';
            ctx.beginPath();
            ctx.moveTo(x - 2, y + (feet + 1) * zoom + 0.5);
            ctx.lineTo(x + fw * zoom + 2, y + (feet + 1) * zoom + 0.5);
            ctx.stroke();
        }
    }
    v.how.textContent = v.fw.value || v.fh.value ? 'set by hand' : `found ${viewer.fw} x ${viewer.fh} (${viewer.how})`;
    v.frameNo.textContent = `frame ${f + 1} / ${n}, x${zoom}`;
    viewer.count = n;
    viewer.zoom = zoom;
    refreshNote();
}

// The lowest row with a visible pixel in the first frame: where it stands (the same line on
// every frame shows whether a frame floats or sinks).
const feetCache = new Map();
function feetRow(img, fw, fh) {
    const key = `${img.src}|${fw}|${fh}`;
    if (feetCache.has(key)) return feetCache.get(key);
    let row = -1;
    try {
        const c = document.createElement('canvas');
        c.width = fw; c.height = fh;
        const cx = c.getContext('2d');
        cx.drawImage(img, 0, 0, fw, fh, 0, 0, fw, fh);
        const data = cx.getImageData(0, 0, fw, fh).data;
        for (let j = fh - 1; j >= 0 && row < 0; j--) for (let i = 0; i < fw; i++) if (data[(j * fw + i) * 4 + 3] > 0) { row = j; break; }
    } catch (e) { /* a picture that can't be read */ }
    feetCache.set(key, row);
    return row;
}

function stepViewer(d) {
    viewer.frame = Math.max(0, viewer.frame + d);
    drawViewer();
}

function togglePlay() {
    clearInterval(viewer.timer);
    viewer.timer = viewer.timer ? 0 : setInterval(() => stepViewer(1), Math.max(20, Number(viewer.v.ms.value) || 100));
    viewer.v.play.textContent = viewer.timer ? 'Pause' : 'Play';
}

// ---------------------------------------------------------------- the notes and remembered choices

function details() {
    if (!p) return '';
    const file = (s) => s.url && s.replaces ? `${s.file} in place of ${name(s.replaces)}` : s.url ? `${s.file} (alone on the scene, ${p.where.value}'s spot)` : `${s.file} (game file)`;
    const lines = ['Art test', `Scene: ${picker.describe()}`, `Speed x${p.speed.value}, crisp pixels ${p.crisp.checked ? 'on' : 'off'}`];
    const t = picker.timing();
    if (t && t.hitMs !== undefined) lines.push(`Blow lands at ${t.hitMs} ms (frame ${Math.round(t.hitMs / 100)}), lasts ${t.totalMs} ms`);
    if (slots.main) lines.push(`Scene file: ${file(slots.main)}`);
    if (altActive()) lines.push(`Alt scene: ${slots.alt ? file(slots.alt) : "the game's own art"}`);
    const s = slots.main || slots.alt;
    if (s && !sceneOf(s)) lines.push(`Frame ${frameOf(s).join(' x ')} px${p.fw.value || p.fh.value ? ' (set by hand)' : ` (${s.how})`}, ${p.fms.value} ms a frame`);
    if (viewer.row) {
        const [fw, fh] = viewerFrame();
        lines.push(`Viewer: ${viewer.row.file}, frame ${viewer.frame % (viewer.count || 1) + 1} / ${viewer.count || 1} (${fw} x ${fh} px), x${viewer.zoom}, backdrop ${viewer.v.backdrop.value}`);
    }
    return lines.join('\n');
}

function remember() {
    if (!p) return;
    const saved = Object.fromEntries(FIELDS.map((f) => [f, p[f].value]));
    saved.repeat = p.repeat.checked;
    saved.scene = picker.get();
    try { localStorage.setItem(STORE_KEY, JSON.stringify(saved)); } catch (e) { /* private mode */ }
    refreshNote();
}

function recall() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
}

// ---------------------------------------------------------------- the panel

function buildPanel(saved) {
    side = sidePanel('right', 'Art', () => close(true));
    const opts = (list, labels = list) => list.map((x, i) => `<option value="${x}">${labels[i]}</option>`).join('');
    side.body.innerHTML = `
        <details open><summary>Files</summary>
            <div class="row"><button data-act="refresh">Refresh</button><span class="muted">newest first: the sessions' drops (review/), then what you add below</span></div>
            <div data-out="files"></div>
            <div class="devSub">Add a game file</div>
            <div class="row"><select name="folder"></select><input type="text" name="filter" placeholder="or search every folder" spellcheck="false"></div>
            <div class="row"><select name="gameFile" size="5" style="flex:1 1 100%"></select></div>
            <div class="row"><button data-act="addGame">Add game file</button>
                <span class="muted">or a local file</span><input type="file" name="localFile" accept="image/png">
                <label title="The local file shows wherever the game draws the chosen game file"><input type="checkbox" name="localReplaces" checked> in place of the chosen game file</label></div>
        </details>
        <details open><summary>Scene</summary>
            <div data-scene></div>
            <div class="row"><span class="tagMain">Scene</span><span data-out="nowMain"></span></div>
            <div class="row"><span class="tagAlt">Alt</span><span data-out="nowAlt"></span></div>
            <div class="row"><button data-act="play">Play</button><button data-act="stop">Stop</button>
                <label><input type="checkbox" name="repeat"> repeat</label>
                <label>Speed <select name="speed">${opts(['1', '0.5', '0.25', '0.1'], ['x1', 'x0.5', 'x0.25', 'x0.1'])}</select></label>
                <label><input type="checkbox" name="crisp" checked> crisp pixels</label></div>
            <div class="row"><span class="blow">● blow</span><span class="muted" data-out="timing"></span></div>
            <div class="devSub">A picture the game doesn't use yet</div>
            <div class="row"><label>Shown at <select name="where"><option value="enemy">the enemy's spot</option>
                <option value="wizard">the wizard's spot</option><option value="scene">the whole scene</option></select></label>
                <label><input type="number" name="fms" min="20" step="10"> ms a frame</label></div>
            <div class="row"><label>Frame <input type="number" name="fw" min="1" placeholder="auto"> x <input type="number" name="fh" min="1" placeholder="auto"> px</label>
                <span class="muted" data-out="autoSize"></span></div>
            <div class="row"><button data-act="reload">Reload art</button><span class="muted">loads the edited PNGs again</span></div>
            <div class="row"><span class="note" data-out="tryNote"></span></div>
        </details>`;
    p = { blow: side.body.querySelector('.blow') };
    for (const node of side.body.querySelectorAll('[name]')) p[node.name] = node;
    for (const node of side.body.querySelectorAll('[data-out]')) p[node.dataset.out] = node;

    for (const f of FIELDS) if (saved[f] !== undefined && f != 'folder') p[f].value = saved[f];
    p.repeat.checked = !!saved.repeat;
    if (!p.fms.value) p.fms.value = 100;

    picker = scenePicker(side.body.querySelector('[data-scene]'), tools.resetScene, () => { stop(); showTiming(); remember(); });
    const acts = { play: playScene, stop, reload: reloadArt, refresh: readRows, addGame: addGameFile,
        clearMain: () => clearSlot('main'), clearAlt: () => clearSlot('alt') };
    side.body.addEventListener('click', (e) => {
        const act = e.target.dataset && e.target.dataset.act;
        if (act) acts[act]();
        else onRow(e);
    });
    p.speed.onchange = remember;
    p.crisp.onchange = () => { setCrisp(p.crisp.checked); refreshNote(); };
    p.folder.onchange = () => { p.filter.value = ''; fillGameFiles(); remember(); };
    p.filter.oninput = fillGameFiles;
    p.gameFile.ondblclick = addGameFile;
    p.localFile.onchange = addLocalFile;
    for (const f of ['where', 'fw', 'fh', 'fms']) p[f].addEventListener('change', () => { showSlots(); remember(); });
}

// ---------------------------------------------------------------- open and close

export async function open(devTools) {
    tools = devTools;
    prevSpeed = loop.getSpeed();
    prevLevel = state.player.lvl;
    prevCrisp = ui.crisp;
    tools.setSpeed(1);
    paths = await listImagePaths();
    const saved = recall();
    buildPanel(saved);
    fillFolders(saved.folder);
    el('console').style.visibility = 'hidden';
    el('backConsole').style.visibility = 'hidden';
    buildAlt();
    buildViewer();
    setCrisp(true);                     // the artist judges crisp pixels (no smoothing)
    if (saved.scene) picker.set(saved.scene);
    picker.setUp();
    setNoteSource(details, 'art');
    showSlots();
    showTiming();
    readRows();
}

// Close the panel; resume: the game goes on (not when another mode opens instead).
export function close(resume = true) {
    if (!side) return;
    stop();
    closeViewer();
    viewer.box.remove();
    clearInterval(alt.timer);
    alt.box.remove();
    Object.assign(alt, { box: null, canvas: null, frames: [], key: '' });
    side.close();
    side = null;
    p = null;
    if (slots.main || slots.alt) forgetImages();       // the game's own art again
    slots.main = slots.alt = null;
    setNoteSource(null);
    state.player.lvl = prevLevel;
    ui.petrified = false;
    setCrisp(prevCrisp);
    el('console').style.visibility = '';
    el('backConsole').style.visibility = '';
    tools.setSpeed(prevSpeed);
    if (resume) tools.closed();
}
