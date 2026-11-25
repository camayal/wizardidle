// Wizard Idle v2 - dev tools: the hotspots mode (only while developing). See docs/plans/HOTSPOTS.md.
//
// Pick a scene, drag a rectangle on it to add a clickable spot, then give it a kind, the place it leads to
// (a stage such as la_Torre1, a zone or a connector point) and a label for the console ("the stairs up").
// Save writes src/data/hotspots.js (through tools/serve.py); reload the page afterwards. The outlines show
// only here: in the game nothing marks a spot.

import { hotspots } from '../data/hotspots.js';
import { places } from '../data/zones.js';
import { sidePanel } from './panel.js';
import { esc } from './review.js';
import { loadBackground } from '../ui/render.js';
import { useSpots } from '../ui/hotspots.js';
import { el } from '../ui/dom.js';

const W = 256, H = 64;
const KIND_NAMES = ['exit'];
let side, tools, scene = '', draft = {}, overlay = null, timer = null, drag = null;

const key = () => scene.toLowerCase();
const spots = () => (draft[key()] = draft[key()] || []);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function placeOverlay() {
    const r = el('esceneCanvas').getBoundingClientRect();
    Object.assign(overlay.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
}

function draw() {
    overlay.querySelectorAll('.o').forEach((n) => n.remove());
    spots().forEach((s, i) => {
        const d = document.createElement('div');
        d.className = 'o';
        d.textContent = i + 1;
        d.style.cssText = `position:absolute;left:${s.x / W * 100}%;top:${s.y / H * 100}%;width:${s.w / W * 100}%;height:${s.h / H * 100}%;` +
            'border:2px solid #f0f;background:rgba(255,0,255,0.15);color:#fff;font:bold 12px sans-serif;pointer-events:none;box-sizing:border-box';
        overlay.appendChild(d);
    });
    list();
}

function list() {
    const box = side.body.querySelector('[data-id=list]');
    box.innerHTML = spots().map((s, i) => `<div class="row" data-i="${i}"><b>${i + 1}</b>
        <select data-f="kind">${KIND_NAMES.map((k) => `<option ${k == s.kind ? 'selected' : ''}>${k}</option>`).join('')}</select>
        <input type="text" data-f="to" value="${esc(s.to || '')}" placeholder="leads to (stage, zone, connector)" size="16">
        <input type="text" data-f="label" value="${esc(s.label || '')}" placeholder="label for the console" size="16">
        <label>x<input type="number" data-f="x" value="${s.x}"></label><label>y<input type="number" data-f="y" value="${s.y}"></label>
        <label>w<input type="number" data-f="w" value="${s.w}"></label><label>h<input type="number" data-f="h" value="${s.h}"></label>
        <button data-f="del">Delete</button></div>`).join('') || '<div class="muted">No spot in this scene yet: drag a rectangle on it.</div>';
    box.querySelectorAll('[data-f]').forEach((n) => {
        const i = Number(n.closest('[data-i]').dataset.i), f = n.dataset.f;
        if (f == 'del') n.onclick = () => { spots().splice(i, 1); if (!spots().length) delete draft[key()]; draw(); };
        else n.onchange = () => { spots()[i][f] = ['x', 'y', 'w', 'h'].includes(f) ? Number(n.value) : n.value; draw(); };
    });
}

function show(name) {
    scene = name.trim();
    if (!scene) return;
    loadBackground(scene);
    setTimeout(() => { placeOverlay(); draw(); }, 100);
}

const point = (e) => {
    const r = overlay.getBoundingClientRect();
    return [clamp(Math.round((e.clientX - r.left) / r.width * W), 0, W), clamp(Math.round((e.clientY - r.top) / r.height * H), 0, H)];
};

export async function open(devTools) {
    tools = devTools;
    tools.setSpeed(1);
    tools.resetScene();
    draft = JSON.parse(JSON.stringify(hotspots));
    useSpots((s) => draft[String(s).toLowerCase()] || []);
    side = sidePanel('right', 'Hotspots: clickable spots of the scenes', () => close());
    side.maxWidth = 700;
    el('console').style.visibility = 'hidden'; el('backConsole').style.visibility = 'hidden';
    side.body.innerHTML = `
        <div class="row"><b>Scene:</b><input type="text" data-id="scene" list="hsScenes" placeholder="e.g. la_Torre1" size="20" spellcheck="false">
            <datalist id="hsScenes">${Object.keys(places).sort().map((n) => `<option value="${n}">`).join('')}</datalist><button data-id="go">Show</button></div>
        <div class="muted">Drag a rectangle on the scene to add a spot (sprite px of the 256 x 64 scene; a spot under 24 px wide is widened in the game). The outlines show only here. One touch per scene in the game; the first tap spends faith.</div>
        <div data-id="list"></div>
        <div class="row"><button data-id="save">Save to src/data/hotspots.js</button><span data-id="msg" class="muted"></span></div>`;
    overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;z-index:9990;cursor:crosshair;touch-action:none';
    document.body.appendChild(overlay);
    overlay.onpointerdown = (e) => { drag = point(e); overlay.setPointerCapture(e.pointerId); };
    overlay.onpointerup = (e) => {
        if (!drag || !scene) { drag = null; return; }
        const [x2, y2] = point(e), x = Math.min(drag[0], x2), y = Math.min(drag[1], y2), w = Math.abs(x2 - drag[0]), h = Math.abs(y2 - drag[1]);
        drag = null;
        if (w < 4 || h < 4) return;
        spots().push({ x, y, w, h, kind: 'exit', to: '', label: '' });
        draw();
    };
    timer = setInterval(() => { if (overlay) placeOverlay(); }, 500);
    const input = side.body.querySelector('[data-id=scene]');
    side.body.querySelector('[data-id=go]').onclick = () => show(input.value);
    input.onkeydown = (e) => { if (e.key == 'Enter') show(input.value); };
    side.body.querySelector('[data-id=save]').onclick = async () => {
        const msg = side.body.querySelector('[data-id=msg]');
        const clean = {};
        for (const [k, v] of Object.entries(draft)) if (v.length) clean[k] = v;
        try {
            const r = await fetch('/hotspots/save', { method: 'POST', body: JSON.stringify({ hotspots: clean }) });
            msg.textContent = await r.text();
        } catch (e) { msg.textContent = `not saved: ${e.message}`; }
    };
    placeOverlay();
}

export function close(resume = true) {
    if (!side) return;
    clearInterval(timer); timer = null;
    overlay.remove(); overlay = null;
    side.close(); side = null;
    useSpots((s) => hotspots[String(s).toLowerCase()] || []);
    el('console').style.visibility = ''; el('backConsole').style.visibility = '';
    if (resume) tools.closed();
}
