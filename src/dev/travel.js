// Wizard Idle v2 - dev tools: the travel mode (only while developing). See docs/TRAVEL.md.
//
// The map of a layer with the cheapest paths from a chosen scene (click a scene, or pick it in the
// list), to judge the travel numbers by eye. Green = a move inside the zone, yellow = a destination
// in another zone, red = too far (not offered). Dots are the scenes (one per map spot), squares the
// waypoints (bridges, pier, cave mouths, stairs). Hover a dot for its name and cost.
// Opened from the dev panel (Modes > Travel), on the right of the game; the game waits until closed.

import { travelGraph as g } from '../data/travelGraph.js';
import { places } from '../data/zones.js';
import { travelCost, route, destinations, moves, SIZE } from '../travelGraph.js';
import { config } from '../config.js';
import { sidePanel } from './panel.js';
import { esc } from './review.js';

const MAPS = { ground: 'img/ui/mapa.png', above: 'img/ui/mapaboveground.png', under: 'img/ui/mapaunderground.png' };
const ZOOM = 2, COLORS = { move: '#2fd02f', dest: '#f2d21c', far: '#e03030' };
let side, p, tools, stage = 'la_Pradera1', layer = 'ground', imgs = {};
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
    const n = (k) => stages.filter((s) => s !== stage && kind(s) === k).length;
    p.info.innerHTML = `<b>${esc(stage)}</b> (${esc(layerOf(stage))}): ${mv.size} moves, ${ds.size} destinations
        (limits ${config.travel.moveLimit} / ${config.travel.destinationLimit}), ${n('far')} too far.`;
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
    stage = n; p.list.value = n;
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
        <div data-id="tip" class="muted">Click a scene to see its paths. Green: move in the zone. Yellow: destination. Red: too far.</div>`;
    p = {};
    side.body.querySelectorAll('[data-id]').forEach((e) => { p[e.dataset.id] = e; });
    p.list.onchange = () => pick(p.list.value);
    p.layers.onclick = (e) => e.target.dataset.l && setLayer(e.target.dataset.l);
    p.canvas.onclick = (e) => { const s = nearest(e).name; if (s) pick(s); };
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
