// Wizard Idle v2 - the cemetery: one tomb per wizard who ever died, on the Cemetery page of the
// kill scroll (Kill / Cemetery / Bestiary).
//
// The author chose the artist's five tombs (A-E) on 2026-11-17: each wizard gets one of them,
// always the same one (picked from his name and birth), with his name and age carved by code
// in the artist's 3 x 5 pixel font (img/ui/cemetery/tomb_font.png), so one font fits every
// tomb. A wizard who suffered the ERASURE (lost the final battle, docs/ERASURE.md; his record
// says erased) lies under the cracked version, his name upside down and crossed out. Tapping a
// tomb opens a small parchment note beside it with the rest of his story; tapping it, or
// another tomb, closes it.

import { world } from '../state.js';
import { ui } from '../runtime.js';
import { stats } from '../stats.js';
import { art } from '../media.js';
import { roundNumbertoLetter } from '../utils.js';

const TOMBS = ['a', 'b', 'c', 'd', 'e'];
const TILE_W = 52, TILE_H = 56;                         // one tomb, in art pixels
const PANEL = { x: 11, w: 33, nameY: 31, ageY: 40, dotY: 38 };  // the carved panel (same on every tomb), centred as the artist did
const FONT = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-' ";
const CELL_W = 4, CELL_H = 6, ROW_CHARS = 8;            // a glyph is 3 x 5 plus a gap and its light line
const STROKE = 'rgb(43, 41, 50)';                       // the carved strokes: the strike and the dots are drawn in it
const LIP = { whole: [176, 176, 168], cracked: [132, 132, 134] };   // the light line under a stroke, per stone

// The wizards, newest first, each with his place in world.cemetery.
function graves() {
    return world.cemetery.map((w, i) => ({ w, i })).reverse();
}

// Which of the five tombs a wizard lies under: always the same for him.
function tombOf(w) {
    if (TOMBS.includes(w.tomb)) return w.tomb;
    const key = `${w.name}|${w.born}`;
    let h = 0;
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
    return TOMBS[h % TOMBS.length];
}

// Text the font can carve: capitals, no accents, unknown signs dropped, at most one row.
function carvable(text) {
    const clean = String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()
        .split('').filter((c) => FONT.includes(c)).join('').replace(/\s+/g, ' ').trim();
    return clean.length > ROW_CHARS ? clean.slice(0, ROW_CHARS - 1) + '.' : clean;
}

// A short age for the tomb: 37, 1.2K, 3.4M.
function shortAge(age) {
    const n = Math.max(0, Math.floor(Number(age) || 0));
    if (n < 1000) return String(n);
    if (n < 1e6) return `${(n / 1e3).toFixed(n < 1e4 ? 1 : 0)}K`;
    return `${Math.min(999, n / 1e6).toFixed(n < 1e7 ? 1 : 0)}M`;
}

// Carve one row of text, centred on the panel; flipped turns it upside down (the erased).
function carve(ctx, font, text, y, flipped) {
    const width = text.length * CELL_W - 1;
    const x = PANEL.x + Math.floor((PANEL.w - width) / 2);
    ctx.save();
    if (flipped) {                                      // turn the row half a circle about its centre
        ctx.translate(2 * x + width, 2 * y + CELL_H);
        ctx.scale(-1, -1);
    }
    [...text].forEach((c, i) => {
        const k = FONT.indexOf(c);
        if (k >= 0 && c != ' ') ctx.drawImage(font, k * CELL_W, 0, CELL_W, CELL_H, x + i * CELL_W, y, CELL_W, CELL_H);
    });
    ctx.restore();
    return { x, width };
}

// The font with its light lines tinted to the stone (the strip's own lip is a yellowish grey).
const tinted = {};
function tintFont(font, kind) {
    if (tinted[kind]) return tinted[kind];
    const c = document.createElement('canvas');
    c.width = font.naturalWidth; c.height = font.naturalHeight;
    const ctx = c.getContext('2d');
    ctx.drawImage(font, 0, 0);
    const data = ctx.getImageData(0, 0, c.width, c.height), px = data.data, [r, g, b] = LIP[kind];
    for (let i = 0; i < px.length; i += 4) {
        if (px[i + 3] && px[i] + px[i + 1] + px[i + 2] > 300) { px[i] = r; px[i + 1] = g; px[i + 2] = b; }
    }
    ctx.putImageData(data, 0, 0);
    return (tinted[kind] = c);
}

function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
    });
}

// Draw one tomb (a 52 x 56 canvas): the stone, then the name and age.
async function paintTomb(canvas, w) {
    const kind = tombOf(w);
    const [stone, font] = await Promise.all([loadImage(art(`tomb_${kind}${w.erased ? '_cracked' : ''}`)), loadImage(art('tomb_font'))]);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, TILE_W, TILE_H);
    if (stone) ctx.drawImage(stone, 0, 0);
    if (!font) return;
    const glyphs = tintFont(font, w.erased ? 'cracked' : 'whole');
    const name = carve(ctx, glyphs, carvable(w.name), PANEL.nameY, w.erased);
    carve(ctx, glyphs, carvable(`AGE ${shortAge(w.age)}`), PANEL.ageY, false);
    ctx.fillStyle = STROKE;
    for (let x = 20; x <= 30; x += 2) ctx.fillRect(x, PANEL.dotY, 1, 1);     // the dotted line between them
    if (w.erased) {                                     // crossed out, a pixel past each end
        ctx.fillRect(name.x - 1, PANEL.nameY + 3, name.width + 2, 1);   // the middle of the turned letters
    }
}

// The Cemetery page: the tombs in rows, newest first.
export function cemeteryPageHtml() {
    if (!world.cemetery.length) return '<br>Nobody rests here yet.';
    const h = Math.round(ui.em * 5.5), wPx = Math.round(h * TILE_W / TILE_H);
    const tombs = graves().map(({ w, i }) =>
        `<canvas class='tomb' data-grave='${i}' width='${TILE_W}' height='${TILE_H}' title='${esc(w.name)}' ` +
        `style='width:${wPx}px;height:${h}px;margin:${Math.round(ui.em * 0.3)}px;image-rendering:pixelated;cursor:pointer'></canvas>`).join('');
    return `<br><div id='cemeteryGrid' style='position:relative'>${tombs}</div>`;
}

// After the page is in place: draw the tombs and make them open their notes.
export function paintCemetery(container) {
    const grid = container.querySelector('#cemeteryGrid');
    if (!grid) return;
    for (const canvas of grid.querySelectorAll('canvas.tomb')) {
        const w = world.cemetery[Number(canvas.dataset.grave)];
        if (w) paintTomb(canvas, w);
    }
    grid.onclick = (ev) => {
        const open = grid.querySelector('.tombNote');
        const tomb = ev.target.closest && ev.target.closest('canvas.tomb');
        const same = open && tomb && open.dataset.grave == tomb.dataset.grave;
        if (open) open.remove();
        if (tomb && !same) {
            openNote(grid, tomb);
            stats.count(`world.cemetery.read.${tomb.dataset.grave}`);     // "read every note": one key per tomb
        }
    };
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function day(iso) {
    const d = new Date(iso);
    return isNaN(d) ? '?' : d.toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' });
}

// The small parchment beside a tomb with the rest of his story.
function openNote(grid, tomb) {
    const w = world.cemetery[Number(tomb.dataset.grave)];
    if (!w) return;
    const width = Math.min(grid.clientWidth * 0.92, tomb.offsetWidth * 2.9);
    const left = Math.max(0, Math.min(grid.clientWidth - width, tomb.offsetLeft + tomb.offsetWidth / 2 - width / 2));
    const top = tomb.offsetTop + tomb.offsetHeight * 0.55;
    const lines = [
        `<b>${esc(w.name)}</b>`,
        `Level ${roundNumbertoLetter(w.lvl)}, died at ${roundNumbertoLetter(w.age)}`,
    ];
    if (w.kills !== undefined) lines.push(`${roundNumbertoLetter(w.kills)} victories, ${roundNumbertoLetter(w.falls)} falls`);
    lines.push(`${day(w.born)} - ${day(w.died)}`);
    if (w.erased) lines.push('<i>Erased in the final battle</i>');
    const note = parchmentNote(lines, width, `left:${left}px; top:${top}px`);
    note.className = 'tombNote';
    note.dataset.grave = tomb.dataset.grave;
    grid.appendChild(note);
}

// A small parchment note (the tomb note art), width px wide, absolutely placed by place (css),
// one line per entry of lines. Also the kill confirmation on the Kill page.
export function parchmentNote(lines, width, place) {
    const note = document.createElement('div');
    const height = width * 72 / 112;
    note.style.cssText = `position:absolute; ${place}; width:${width}px; height:${height}px; ` +
        `box-sizing:border-box; padding:${height * 13 / 72}px ${width * 10 / 112}px; z-index:2; cursor:pointer; overflow:hidden; ` +
        `display:flex; flex-direction:column; justify-content:center; text-align:center; ` +
        `font-size:${ui.em * 0.8}px; line-height:${ui.em * 0.95}px; color:#462808; ` +
        `background:url('${art('tomb_note')}') center / 100% 100% no-repeat; image-rendering:pixelated`;
    note.innerHTML = lines.map((l) => `<div>${l}</div>`).join('');
    loadImage(art('tomb_note')).then((img) => { if (!img) note.style.backgroundColor = '#e9d3a1'; });   // plain parchment until it's drawn
    return note;
}
