// Wizard Idle v2 - dev tools: the travel mode (only while developing). See docs/TRAVEL.md.
//
// The map of a layer with the cheapest paths from a chosen scene (click a scene, or pick it in the
// list), to judge the travel numbers by eye. Green = a move inside the zone, yellow = a destination
// in another zone, red = too far (not offered). Dots are the scenes (one per map spot), squares the
// waypoints (bridges, pier, cave mouths, stairs). Hover a dot for its name and cost.
// Opened from the dev panel (Modes > Travel), on the right of the game; the game waits until closed.

import { travelGraph as g } from '../data/travelGraph.js';
import { places } from '../data/zones.js';
import { travelCost, route, destinations, moves, overrides, pairKey, verdict, SIZE } from '../travelGraph.js';
import { config } from '../config.js';
import { sidePanel } from './panel.js';
import { esc } from './review.js';

const MAPS = { ground: 'img/ui/mapa.png', above: 'img/ui/mapaboveground.png', under: 'img/ui/mapaunderground.png' };
const ZOOM = 2, COLORS = { move: '#2fd02f', dest: '#f2d21c', far: '#e03030' };
const DRAFT = 'wizardidle2:travelOverrides';
const NAMES = { move: 'green', dest: 'yellow', far: 'red' };
let side, p, tools, stage = 'la_Pradera1', target = '', layer = 'ground', imgs = {};
const stages = Object.keys(g.anchors).sort();
const layerOf = (n) => g.nodes[g.anchors[n]][0];

function line(ctx, a, b, color) {
    ctx.strokeStyle = color; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(a.x * ZOOM, a.y * ZOOM); ctx.lineTo(b.x * ZOOM, b.y * ZOOM); ctx.stroke();
}

function draw() {
    if (!p) return;
    const c = p.canvas, ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, c.width, c.height);
    if (imgs[layer] && imgs[layer].complete) ctx.drawImage(imgs[layer], 0, 0, c.width, c.height);
    const mv = new Set(moves(stage)), ds = new Set(destinations(stage));
    const kind = (n) => mv.has(n) ? 'move' : ds.has(n) ? 'dest' : 'far';
    // the paths: far first so the useful ones stay on top
    for (const k of ['far', 'dest', 'move']) {
        const seen = new Set();
        for (const n of stages) {
            if (n === stage || kind(n) !== k || seen.has(g.anchors[n])) continue;
            seen.add(g.anchors[n]);
            const r = route(stage, n);
            for (let i = 1; i < r.length; i++) if (r[i].layer === layer && r[i - 1].layer === layer) line(ctx, r[i - 1], r[i], COLORS[k]);
        }
    }
    // the manual links of this scene, straight and dashed (they may not follow a path)
    ctx.setLineDash([4, 3]);
    for (const n of stages) {
        const v = n !== stage && verdict(stage, n);
        if (!v || layerOf(n) !== layer || layerOf(stage) !== layer) continue;
        const [, ax, ay] = g.nodes[g.anchors[stage]], [, bx, by] = g.nodes[g.anchors[n]];
        line(ctx, { x: ax, y: ay }, { x: bx, y: by }, COLORS[v]);
    }
    ctx.setLineDash([]);
    // the nodes
    g.nodes.forEach(([l, x, y, type], i) => {
        if (l !== layer) return;
        const names = stages.filter((n) => g.anchors[n] === i);
        ctx.fillStyle = i === g.anchors[stage] ? '#fff' : names.length ? COLORS[kind(names[0])] : '#9be';
        ctx.strokeStyle = '#000'; ctx.lineWidth = 1;
        const s = names.length ? 4 : 3;
        ctx.beginPath();
        if (names.length) ctx.arc(x * ZOOM, y * ZOOM, s, 0, 7); else ctx.rect(x * ZOOM - s, y * ZOOM - s, 2 * s, 2 * s);
        ctx.fill(); ctx.stroke();
    });
    if (target && layerOf(target) === layer) {
        const [, x, y] = g.nodes[g.anchors[target]];
        ctx.strokeStyle = '#f0f'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x * ZOOM, y * ZOOM, 8, 0, 7); ctx.stroke();
    }
    drawLink();
    const n = (k) => stages.filter((s) => s !== stage && kind(s) === k).length;
    p.info.innerHTML = `<b>${esc(stage)}</b> (${esc(layerOf(stage))}): ${mv.size} moves, ${ds.size} destinations
        (limits ${config.travel.moveLimit} / ${config.travel.destinationLimit}), ${n('far')} too far.`;
}

const auto = (a, b) => {       // what the graph says without the manual verdict
    const had = overrides[pairKey(a, b)];
    delete overrides[pairKey(a, b)];
    const k = moves(a).includes(b) ? 'move' : destinations(a).includes(b) ? 'dest' : 'far';
    if (had) overrides[pairKey(a, b)] = had;
    return k;
};

function drawLink() {
    const box = p.link;
    if (!target || target === stage) { box.innerHTML = '<span class="muted">Shift-click a second scene (or pick it here) to correct the link from it.</span>'; return; }
    const manual = verdict(stage, target), a = auto(stage, target);
    box.innerHTML = `<b>${esc(stage)}</b> &harr; <b>${esc(target)}</b>: ${manual ? `manual <b>${NAMES[manual]}</b> (auto: ${NAMES[a]})` : `auto <b>${NAMES[a]}</b>`}
        <div class="row"><button data-v="move">Green</button><button data-v="dest">Yellow</button><button data-v="far">Red</button><button data-v="">Auto</button></div>`;
}

// Set the verdict of a link for every stage sharing the two spots (the five scenes of the Castle are one spot).
function setVerdict(v) {
    const spot = (n) => stages.filter((m) => g.anchors[m] === g.anchors[n]);
    for (const a of spot(stage)) for (const b of spot(target)) {
        if (a === b) continue;
        if (v) overrides[pairKey(a, b)] = v; else delete overrides[pairKey(a, b)];
    }
    try { localStorage.setItem(DRAFT, JSON.stringify(overrides)); } catch (e) { /* no storage: fine */ }
    p.count.textContent = `${Object.keys(overrides).length} verdicts (unsaved changes are kept in this browser)`;
    draw();
}

async function post(url, body, what) {
    try {
        const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        p.tip.textContent = r.ok ? `${what}: ${await r.text()}` : `${what} failed (${r.status}): run tools/serve.py from this computer`;
    } catch (e) { p.tip.textContent = `${what} failed: ${e.message}`; }
}

function nearest(ev) {
    const r = p.canvas.getBoundingClientRect();
    const x = (ev.clientX - r.left) * p.canvas.width / r.width / ZOOM, y = (ev.clientY - r.top) * p.canvas.height / r.height / ZOOM;
    let best = '', bd = 8;
    for (const n of stages) {
        const [l, nx, ny] = g.nodes[g.anchors[n]];
        const d = Math.hypot(nx - x, ny - y);
        if (l === layer && d < bd) { best = n; bd = d; }
    }
    return { name: best, x, y };
}

function setLayer(l) {
    layer = l;
    p.layers.querySelectorAll('button').forEach((b) => { b.style.fontWeight = b.dataset.l == l ? 'bold' : ''; });
    if (!imgs[l]) { imgs[l] = new Image(); imgs[l].onload = draw; imgs[l].src = MAPS[l]; }
    draw();
}

function pick(n) {
    stage = n; if (target === stage) target = ''; p.list.value = n;
    setLayer(layerOf(n));
}

export async function open(devTools) {
    tools = devTools;
    tools.setSpeed(1);
    side = sidePanel('right', 'Travel: the cheapest paths from a scene', () => close());
    side.body.innerHTML = `<div class="row"><select data-id="list">${stages.map((n) => `<option>${n}</option>`).join('')}</select>
        <span data-id="layers">${Object.keys(MAPS).map((l) => `<button data-l="${l}">${l}</button>`).join(' ')}</span></div>
        <div data-id="info" class="muted"></div>
        <canvas data-id="canvas" width="${SIZE * ZOOM}" height="${SIZE * ZOOM}" style="width:100%;image-rendering:pixelated;cursor:crosshair"></canvas>
        <div class="row" data-id="legend" style="gap:2px 12px">
            <span><b style="color:${COLORS.move}">&#9632;</b> green: a move inside the zone (cost under ${config.travel.moveLimit})</span>
            <span><b style="color:${COLORS.dest}">&#9632;</b> yellow: a destination in another zone (cost under ${config.travel.destinationLimit})</span>
            <span><b style="color:${COLORS.far}">&#9632;</b> red: too far, not offered</span>
            <span><b style="color:#fff;text-shadow:0 0 2px #000">&#9679;</b> white dot: the chosen scene</span>
            <span><b style="color:#9be">&#9632;</b> blue square: a waypoint (bridge, pier, cave mouth, stairs); round dots are scenes</span>
            <span class="muted">Cost = steps of walking in map pixels: rivers add a lot, bridges are free, the sea is nearly blocked, stairs and cave mouths have their own price.</span>
        </div>
        <div class="row"><select data-id="tlist"><option value="">(target scene)</option>${stages.map((n) => `<option>${n}</option>`).join('')}</select></div>
        <div data-id="link"></div>
        <div class="row"><button data-id="save">Save verdicts to file</button><button data-id="capture">Capture the map</button>
            <span data-id="count" class="muted"></span></div>
        <div data-id="tip" class="muted">Click a scene to see its paths; shift-click another to correct the link between them. Hover for its name and cost.</div>`;
    p = {};
    side.body.querySelectorAll('[data-id]').forEach((e) => { p[e.dataset.id] = e; });
    p.list.onchange = () => pick(p.list.value);
    p.layers.onclick = (e) => e.target.dataset.l && setLayer(e.target.dataset.l);
    p.canvas.onclick = (e) => {
        const s = nearest(e).name;
        if (!s) return;
        if (e.shiftKey) { target = s; p.tlist.value = s; draw(); } else { target = ''; p.tlist.value = ''; pick(s); }
    };
    p.tlist.onchange = () => { target = p.tlist.value; draw(); };
    p.link.onclick = (e) => { if (e.target.dataset.v !== undefined && target) setVerdict(e.target.dataset.v); };
    p.save.onclick = async () => { await post('travel/overrides', overrides, 'Save'); try { localStorage.removeItem(DRAFT); } catch (e) { /* none */ } };
    p.capture.onclick = () => post('travel/capture', { png: p.canvas.toDataURL('image/png'), stage, layer, overrides }, 'Capture');
    try { Object.assign(overrides, JSON.parse(localStorage.getItem(DRAFT) || '{}')); } catch (e) { /* no draft */ }
    p.count.textContent = `${Object.keys(overrides).length} verdicts`;
    p.canvas.onmousemove = (e) => {
        const s = nearest(e).name;
        p.tip.textContent = s ? `${s}: cost ${Math.round(travelCost(stage, s))}${places[s] ? ` (${places[s].zone})` : ''}` : 'Click a scene to see its paths.';
    };
    pick(stage);
}

export function close(resume = true) {
    if (!side) return;
    side.close();
    side = null; p = null;
    if (resume) tools.closed();
}
