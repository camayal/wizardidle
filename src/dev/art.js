// Wizard Idle v2 - dev tools: the art mode (only while developing).
//
// For the artist and the author (2026-11-14): see the art in the real scene, played by the
// game's own code, and look at any image closely. Opened from the dev panel (Modes > Art), on the
// right of the game; the console is hidden and the game waits until it is closed.
//
//   In the scene  any scene of src/dev/scenes.js at any tier; slow motion, the moment the blow
//                 lands, crisp pixels (on by default), "Reload art" (edited PNGs again without
//                 reloading the page) and "Try a file": a local PNG shown in place of a game
//                 image until the art is reloaded, to see a draft in the real scene.
//   Viewer        any img/ file (or a local one) frame by frame: game size and big side by side,
//                 two slots to compare options, every tier of a wizard image, a grid, the
//                 previous frame as a ghost, the feet line, and dark / grey / light / checked backdrops.
//
//   From the sessions  the newest images the sessions dropped in review/ (src/dev/review.js):
//                 view one in slot A or B, or try it in the scene in place of the game image.
//
// The details (scene, tier, tried files, the frame being looked at) go to the author notes box.

import { state } from '../state.js';
import { ui } from '../runtime.js';
import * as loop from '../loop.js';
import { bossAttacks } from '../data/bossAttacks.js';
import { drawWizard, forgetImages, loadNPC, replaceImage } from '../ui/render.js';
import { listImages, scenePicker, stopScene, TIERS } from './scenes.js';
import { setNoteSource, refreshNote } from './notes.js';
import { el } from '../ui/dom.js';
import { sidePanel } from './panel.js';
import { isImage, reviewList } from './review.js';

const STORE_KEY = 'wizardidle2:artMode';
const CHECKS = ['grid', 'onion', 'feet', 'tiers'];
const FIELDS = ['speed', 'v0', 'v1', 'zoom', 'backdrop', 'fms'];

let side, p, picker, tools, prevSpeed = 1, prevLevel, prevCrisp, replay;
const tried = new Map();                // game image -> local file name shown instead

// ---------------------------------------------------------------- the scene

function playScene() {
    clearTimeout(replay);
    loop.setSpeed(Number(p.speed.value));
    picker.play(() => {
        p.blow.classList.add('on');
        setTimeout(() => p.blow.classList.remove('on'), 300);
    });
    const t = picker.timing() || {};
    replay = setTimeout(() => {
        if (!p) return;
        showTiming();               // a hydra's strip has loaded by now: its timing is known
        if (!p.repeat.checked) return;
        picker.setUp();
        replay = setTimeout(playScene, 600);
    }, ((t.totalMs || 1500) + (t.again || 0)) / Number(p.speed.value) + 100);
}

function stop() {
    clearTimeout(replay);
    stopScene();
}

function showTiming() {
    const t = picker.timing();
    p.timing.textContent = !t ? '' : (t.hitMs !== undefined ? `Blow lands at ${t.hitMs} ms (frame ${Math.round(t.hitMs / 100)}) · ` : '') +
        (t.totalMs ? `lasts ${t.totalMs} ms` : '');
    refreshNote();
}

// Try a file: a local picture in place of a game image, until the art is reloaded.
async function tryFile() {
    const file = p.tryFile.files[0];
    let path = p.tryPath.value.trim();
    if (!file || !path) { p.tryNote.textContent = 'Pick the game image and a file.'; return; }
    if (!path.startsWith('img/')) path = `img/${path}`;
    await replaceImage(path, URL.createObjectURL(file));
    tried.set(path, file.name);
    p.tryNote.textContent = `${path} shows ${file.name} until "Reload art".`;
    picker.setUp();
    showTiming();
}

// An image from review/: in a viewer slot, or in the scene in place of the game image it names.
function viewReview(e, i) {
    viewer.slots[i].local = { name: e.file, url: e.url };
    p[`v${i}`].value = e.file;
    loadSlots();
}
async function tryReview(e) {
    let path = e.replaces || p.tryPath.value.trim();
    if (!path) { p.tryNote.textContent = `Which game image should ${e.file} replace? Write it in "Try a file", then press Try again.`; return; }
    if (!path.startsWith('img/')) path = `img/${path}`;
    await replaceImage(path, e.url);
    tried.set(path, `${e.file} (review/)`);
    p.tryNote.textContent = `${path} shows ${e.file} until "Reload art".`;
    picker.setUp();
    showTiming();
}

function reloadArt() {
    forgetImages();
    tried.clear();
    tierImages.clear();
    feetCache.clear();
    for (const slot of viewer.slots) slot.img = null;
    p.tryNote.textContent = 'Art reloaded from disk.';
    picker.setUp();
    loadSlots();
    refreshNote();
}

function setCrisp(on) {
    ui.crisp = on;
    document.documentElement.classList.toggle('crisp', on);
    drawWizard();
    if (state.npc) loadNPC(state.npc);
}

// ---------------------------------------------------------------- the viewer

const viewer = { frame: 0, playing: false, timer: null, slots: [{}, {}] };

// The usual frame size of an image, from its name (the strips' layouts in the game's code).
function guessFrame(name, img) {
    const h = img.naturalHeight, w = img.naturalWidth;
    const base = name.replace(/\.png$/, '');
    if (/^scene_/.test(base)) return [256, 64];
    if (/^anim_(mother|icedra|hydskon)_(strike|cast|idle)/.test(base)) return [84, h];
    if (/^anim_(mother|icedra|hydskon)_grow/.test(base)) return [64, h];
    if (Object.keys(bossAttacks).some((b) => base.startsWith(`anim_${b}_`))) return [104, 80];
    if (/^spell/.test(base)) return [30, 30];
    const fx = { fx_slash: [24, 32], fx_bite: [14, 14], fx_dust: [24, 8], fx_arrow: [12, 5], fx_thrust: [28, 10], fx_smash: [24, 40], fx_impact: [16, 16] };
    if (fx[base]) return fx[base];
    if (/^fx_spark_/.test(base)) return [16, 16];
    return w % h == 0 ? [h, h] : [w, h];
}

function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
    });
}

async function loadSlots() {
    for (const [i, slot] of viewer.slots.entries()) {
        const name = p[`v${i}`].value.trim();
        if (!name) { Object.assign(slot, { img: null, name: '' }); continue; }
        if (slot.name == name && slot.img) continue;
        slot.name = name;
        slot.img = slot.local && slot.local.name == name ? await loadImage(slot.local.url) : await loadImage(`img/${name}`);
        if (slot.img && i == 0) {
            const [fw, fh] = guessFrame(name, slot.img);
            p.fw.value = fw; p.fh.value = fh;
        }
    }
    viewer.frame = 0;
    drawViewer();
}

function frameCount(img) {
    const fw = Number(p.fw.value) || img.naturalWidth;
    return Math.max(1, Math.floor(img.naturalWidth / fw));
}

// Tiers of a wizard image: name0.png ... name200.png.
function tierNames(name) {
    const m = /^(.*\D)(\d+)\.png$/.exec(name);
    return m && TIERS.includes(Number(m[2])) ? TIERS.map((t) => `${m[1]}${t}.png`) : null;
}

const tierImages = new Map();
async function tierImage(name) {
    if (!tierImages.has(name)) tierImages.set(name, await loadImage(`img/${name}`));
    return tierImages.get(name);
}

async function drawViewer() {
    if (!p) return;
    const canvas = p.canvas, ctx = canvas.getContext('2d');
    const zoom = Number(p.zoom.value), fw = Number(p.fw.value) || 32, fh = Number(p.fh.value) || 32;
    const game = Math.max(1, (ui.charWidth || 64) / 32);           // screen px per art px in the scene
    const slots = viewer.slots.filter((s) => s.img);
    const cellH = Math.max(fh * game, fh * zoom) + 22;
    const width = Math.max(200, canvas.parentElement.clientWidth - 4);
    const tiers = p.tiers.checked && slots[0] ? tierNames(slots[0].name) : null;
    const tierCols = Math.max(1, Math.floor(width / (fw * 2 + 8)));
    const tierRows = tiers ? Math.ceil(tiers.length / tierCols) : 0;
    canvas.width = width;
    canvas.height = Math.max(60, slots.length * cellH + tierRows * (fh * 2 + 18) + 24);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = { dark: '#111', mid: '#7a7a7a', light: '#f2f2f2' }[p.backdrop.value] || '#f2f2f2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (p.backdrop.value == 'checks') {
        for (let y = 0; y < canvas.height; y += 8) for (let x = 0; x < canvas.width; x += 8) {
            ctx.fillStyle = (x + y) % 16 ? '#ccc' : '#999';
            ctx.fillRect(x, y, 8, 8);
        }
    }
    const text = p.backdrop.value == 'dark' ? '#fc6' : '#222';
    ctx.font = '11px sans-serif';
    let y = 4, count = 1;
    for (const slot of slots) {
        const n = frameCount(slot.img), f = viewer.frame % n;
        count = Math.max(count, n);
        ctx.fillStyle = text;
        ctx.fillText(`${slot.name}  frame ${f + 1} / ${n}`, 4, y + 10);
        const top = y + 16;
        drawCell(ctx, slot.img, f, n, fw, fh, 4, top, game, false);
        drawCell(ctx, slot.img, f, n, fw, fh, 4 + fw * game + 16, top, zoom, true);
        y += cellH;
    }
    if (tiers) {
        ctx.fillStyle = text;
        ctx.fillText('All tiers (x2)', 4, y + 10);
        y += 14;
        const imgs = await Promise.all(tiers.map(tierImage));
        imgs.forEach((img, i) => {
            if (!img) return;
            const x = 4 + (i % tierCols) * (fw * 2 + 8), ty = y + Math.floor(i / tierCols) * (fh * 2 + 18);
            ctx.drawImage(img, (viewer.frame % frameCount(img)) * fw, 0, fw, fh, x, ty, fw * 2, fh * 2);
            ctx.fillStyle = text;
            ctx.fillText(String(TIERS[i]), x, ty + fh * 2 + 11);
        });
    }
    viewer.count = count;
    p.frameNo.textContent = slots.length ? `frame ${viewer.frame % count + 1} / ${count}` : 'pick an image';
    refreshNote();
}

// One frame at a scale, with the ghost of the previous frame, the grid and the feet line.
function drawCell(ctx, img, f, n, fw, fh, x, y, scale, big) {
    if (p.onion.checked && n > 1) {
        ctx.globalAlpha = 0.3;
        ctx.drawImage(img, ((f + n - 1) % n) * fw, 0, fw, fh, x, y, fw * scale, fh * scale);
        ctx.globalAlpha = 1;
    }
    ctx.drawImage(img, f * fw, 0, fw, fh, x, y, fw * scale, fh * scale);
    if (big && p.grid.checked && scale >= 4) {
        ctx.strokeStyle = 'rgba(128,128,128,0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i <= fw; i++) { ctx.moveTo(x + i * scale + 0.5, y); ctx.lineTo(x + i * scale + 0.5, y + fh * scale); }
        for (let j = 0; j <= fh; j++) { ctx.moveTo(x, y + j * scale + 0.5); ctx.lineTo(x + fw * scale, y + j * scale + 0.5); }
        ctx.stroke();
    }
    if (p.feet.checked) {
        const feet = feetRow(img, fw, fh);
        if (feet >= 0) {
            ctx.strokeStyle = '#0a6';
            ctx.beginPath();
            ctx.moveTo(x - 2, y + (feet + 1) * scale + 0.5);
            ctx.lineTo(x + fw * scale + 2, y + (feet + 1) * scale + 0.5);
            ctx.stroke();
        }
    }
    ctx.strokeStyle = 'rgba(128,128,128,0.5)';
    ctx.strokeRect(x - 0.5, y - 0.5, fw * scale + 1, fh * scale + 1);
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

function step(d) {
    viewer.frame = Math.max(0, viewer.frame + d);
    drawViewer();
}

function togglePlay() {
    viewer.playing = !viewer.playing;
    p.vplay.textContent = viewer.playing ? 'Pause' : 'Play';
    clearInterval(viewer.timer);
    if (viewer.playing) viewer.timer = setInterval(() => step(1), Math.max(20, Number(p.fms.value) || 100));
}

// ---------------------------------------------------------------- the notes and remembered choices

function details() {
    if (!p) return '';
    const lines = ['Art test', `Scene: ${picker.describe()}`, `Speed x${p.speed.value}, crisp pixels ${p.crisp.checked ? 'on' : 'off'}`];
    const t = picker.timing();
    if (t && t.hitMs !== undefined) lines.push(`Blow lands at ${t.hitMs} ms (frame ${Math.round(t.hitMs / 100)}), lasts ${t.totalMs} ms`);
    for (const [path, name] of tried) lines.push(`Tried: ${name} in place of ${path}`);
    const slots = viewer.slots.filter((s) => s.img);
    if (slots.length) {
        lines.push(`Viewer: ${slots.map((s, i) => `${'AB'[i]} ${s.name}${s.local && s.local.name == s.name ? ' (local file)' : ''}`).join(', ')}`);
        lines.push(`Frame ${viewer.frame % (viewer.count || 1) + 1} / ${viewer.count || 1} (${p.fw.value} x ${p.fh.value} px), zoom x${p.zoom.value}, backdrop ${p.backdrop.value}` +
            `${p.tiers.checked ? ', all tiers' : ''}`);
    }
    return lines.join('\n');
}

function remember() {
    const saved = Object.fromEntries(FIELDS.map((f) => [f, p[f].value]));
    for (const f of CHECKS) saved[f] = p[f].checked;
    saved.scene = picker.get();
    try { localStorage.setItem(STORE_KEY, JSON.stringify(saved)); } catch (e) { /* private mode */ }
    refreshNote();
}

function recall() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
}

// ---------------------------------------------------------------- the panel

function buildPanel(saved, images) {
    side = sidePanel('right', 'Art', () => close(true));
    const opts = (list, labels = list) => list.map((x, i) => `<option value="${x}">${labels[i]}</option>`).join('');
    side.body.innerHTML = `
        <details open><summary>From the sessions (review/)</summary><div data-review></div></details>
        <details open><summary>In the scene</summary>
            <div data-scene></div>
            <div class="row"><button data-act="play">Play</button><button data-act="stop">Stop</button>
                <label><input type="checkbox" name="repeat"> repeat</label>
                <label>Speed <select name="speed">${opts(['1', '0.5', '0.25', '0.1'], ['x1', 'x0.5', 'x0.25', 'x0.1'])}</select></label>
                <label><input type="checkbox" name="crisp" checked> crisp pixels</label></div>
            <div class="row"><span class="blow">● blow</span><span class="muted" data-out="timing"></span></div>
            <div class="row"><button data-act="reload">Reload art</button><span class="muted">loads the edited PNGs again</span></div>
            <div class="row"><b>Try a file</b> <input type="text" name="tryPath" list="artImages" placeholder="img/anim_goro_charge.png" spellcheck="false"></div>
            <div class="row"><input type="file" name="tryFile" accept="image/png"><button data-act="try">Show it</button></div>
            <div class="row"><span class="note" data-out="tryNote"></span></div>
        </details>
        <details open><summary>Viewer</summary>
            <div class="row"><label>A <input type="text" name="v0" list="artNames" placeholder="anim_cast0.png" spellcheck="false"></label>
                <input type="file" name="f0" accept="image/png"></div>
            <div class="row"><label>B <input type="text" name="v1" list="artNames" placeholder="(optional, to compare)" spellcheck="false"></label>
                <input type="file" name="f1" accept="image/png"></div>
            <datalist id="artNames">${images.map((n) => `<option value="${n}">`).join('')}</datalist>
            <datalist id="artImages">${images.map((n) => `<option value="img/${n}">`).join('')}</datalist>
            <div class="row"><label>Frame <input type="number" name="fw" min="1"> x <input type="number" name="fh" min="1"> px</label>
                <label>Zoom <select name="zoom">${opts(['2', '4', '8'], ['x2', 'x4', 'x8'])}</select></label></div>
            <div class="row"><button data-act="prev">◀</button><button data-act="vplay" name="vplay">Play</button><button data-act="next">▶</button>
                <span data-out="frameNo"></span><label><input type="number" name="fms" min="20" step="10"> ms a frame</label></div>
            <div class="row"><label>Backdrop <select name="backdrop">${opts(['light', 'mid', 'dark', 'checks'], ['light', 'grey', 'dark', 'checks'])}</select></label>
                <label><input type="checkbox" name="grid"> grid</label><label><input type="checkbox" name="onion"> ghost</label>
                <label><input type="checkbox" name="feet"> feet line</label><label><input type="checkbox" name="tiers"> all tiers</label></div>
            <div><canvas></canvas></div>
        </details>`;
    p = { canvas: side.body.querySelector('canvas'), blow: side.body.querySelector('.blow') };
    for (const node of side.body.querySelectorAll('[name]')) p[node.name] = node;
    for (const node of side.body.querySelectorAll('[data-out]')) p[node.dataset.out] = node;

    for (const f of FIELDS) if (saved[f] !== undefined) p[f].value = saved[f];
    for (const f of CHECKS) p[f].checked = saved[f] !== undefined ? !!saved[f] : f == 'feet';
    if (!p.fms.value) p.fms.value = 100;

    picker = scenePicker(side.body.querySelector('[data-scene]'), tools.resetScene, () => { stop(); showTiming(); remember(); });
    reviewList(side.body.querySelector('[data-review]'), isImage, [['A', (e) => viewReview(e, 0)], ['B', (e) => viewReview(e, 1)], ['Try', tryReview]]);
    const acts = { play: playScene, stop, reload: reloadArt, try: tryFile, prev: () => step(-1), next: () => step(1), vplay: togglePlay };
    side.body.onclick = (e) => { const act = e.target.dataset && e.target.dataset.act; if (act) acts[act](); };
    p.speed.onchange = remember;
    p.crisp.onchange = () => { setCrisp(p.crisp.checked); refreshNote(); };
    for (const i of [0, 1]) {
        p[`v${i}`].onchange = () => { remember(); loadSlots(); };
        p[`f${i}`].onchange = () => {
            const file = p[`f${i}`].files[0];
            if (!file) return;
            viewer.slots[i].local = { name: file.name, url: URL.createObjectURL(file) };
            p[`v${i}`].value = file.name;
            loadSlots();
        };
    }
    for (const name of ['fw', 'fh', 'zoom', 'backdrop', ...CHECKS]) p[name].addEventListener('change', () => { remember(); drawViewer(); });
    p.fms.onchange = () => { remember(); if (viewer.playing) { togglePlay(); togglePlay(); } };
}

// ---------------------------------------------------------------- open and close

export async function open(devTools) {
    tools = devTools;
    prevSpeed = loop.getSpeed();
    prevLevel = state.player.lvl;
    prevCrisp = ui.crisp;
    tools.setSpeed(1);
    const images = await listImages();
    const saved = recall();
    buildPanel(saved, images);
    el('console').style.visibility = 'hidden';
    el('backConsole').style.visibility = 'hidden';
    setCrisp(true);                     // the artist judges crisp pixels (no smoothing)
    if (saved.scene) picker.set(saved.scene);
    picker.setUp();
    setNoteSource(details, 'art');
    showTiming();
    loadSlots();
}

// Close the panel; resume: the game goes on (not when another mode opens instead).
export function close(resume = true) {
    if (!side) return;
    stop();
    clearInterval(viewer.timer);
    viewer.playing = false;
    side.close();
    side = null;
    p = null;
    setNoteSource(null);
    state.player.lvl = prevLevel;
    ui.petrified = false;
    setCrisp(prevCrisp);
    el('console').style.visibility = '';
    el('backConsole').style.visibility = '';
    tools.setSpeed(prevSpeed);
    if (resume) tools.closed();
}
