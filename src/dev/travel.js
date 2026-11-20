// Wizard Idle v2 - dev tools: the travel mode (only while developing). See docs/TRAVEL.md.
//
// Curate the travel graph by hand. Pick a source and a target (the lists, or click a spot on the map and
// shift-click another; scenes, bridges, the pier, cave mouths and stairs all count), set the weight of the
// link between them (Accessible / Difficult / Impossible / Auto) and move a spot's coordinates ("change
// coord", then click the map). "Save verdict" writes the verdicts (src/data/travelOverrides.js) and the new
// positions (zones.js for scenes, travelPositions for waypoints) and regenerates the graph; reload after.
// The map shows the cheapest paths from the source: green = a move inside the zone, yellow = a destination
// in another zone, red = too far. Clicking a scene also shows that scene in the game.
// The source has a black dot in its centre. Shift-click adds or drops targets: the weight buttons set the link from the source to every target at once. The map layers (ground, above, under) are buttons beside the map.
// Opened from the dev panel (Modes > Travel), on the right of the game; the game waits until it is closed.

import { travelGraph as g } from '../data/travelGraph.js';
import { places } from '../data/zones.js';
import { neighbors, overrides, pairKey, verdict, byName, rebuild, SIZE } from '../travelGraph.js';
import { config } from '../config.js';
import { sidePanel } from './panel.js';
import { esc } from './review.js';
import { loadBackground } from '../ui/render.js';

const MAPS = { ground: 'img/ui/mapa.png', above: 'img/ui/mapaboveground.png', under: 'img/ui/mapaunderground.png' };
const ZOOM = 2, COLORS = { move: '#2fd02f', dest: '#f2d21c', far: '#e03030' };
const NAMES = { move: 'Accessible', dest: 'Difficult', far: 'Impossible' };
const DRAFT = 'wizardidle2:travelDraft';
const stages = Object.keys(g.anchors).sort();
const waypoints = g.nodes.map((n) => n[4]).filter(Boolean).sort();
const names = g.nodes.map((n, i) => { const at = stages.filter((s) => g.anchors[s] === i); return at.length ? at : n[4] ? [n[4]] : []; });
const baseOf = (n) => n.replace(/_(under|above)$/, '');       // a cave mouth moves with its underground twin
const CUSTOM = ['future', 'connector'];         // kinds of the points added by hand
let side, p, tools, imgs = {}, layer = 'ground', src = '', tgts = [], placing = '', moved = {}, points = {}, newPoint = null;
g.nodes.forEach((n) => { if (CUSTOM.includes(n[3])) points[n[4]] = { kind: n[3], layer: n[0], x: n[1], y: n[2] }; });

const tgt = () => tgts[tgts.length - 1] || '';           // the last target: the one "change coord" moves
const layerOf = (n) => g.nodes[byName[n]][0];
const isStage = (n) => n in g.anchors;
const pos = (i) => moved[baseOf(names[i][0] || '')] || [g.nodes[i][1], g.nodes[i][2]];
const save = () => { try { localStorage.setItem(DRAFT, JSON.stringify({ verdicts: overrides, positions: moved, points })); } catch (e) { /* no storage: fine */ } };

// The colour of a direct link source -> node j of cost c: the manual verdict if there is one, else the cost.
function edgeKind(a, j, c) {
    for (const n of names[j]) if (verdict(a, n)) return verdict(a, n);
    return c <= config.travel.moveLimit ? 'move' : c <= config.travel.difficultLimit ? 'dest' : 'far';
}

// The direct link of a pair without its manual verdict: its colour, or '' when the two are not linked.
function autoKind(a, b) {
    const key = pairKey(a, b), had = overrides[key];
    delete overrides[key]; rebuild();
    const link = neighbors(a).find(([j]) => j === byName[b]);
    const k = link ? edgeKind(a, byName[b], link[1]) : '';
    if (had) overrides[key] = had;
    rebuild();
    return k;
}

function line(ctx, a, b, color) {
    ctx.strokeStyle = color; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(a[0] * ZOOM, a[1] * ZOOM); ctx.lineTo(b[0] * ZOOM, b[1] * ZOOM); ctx.stroke();
}

function draw() {
    if (!p) return;
    const c = p.canvas, ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, c.width, c.height);
    if (imgs[layer] && imgs[layer].complete) ctx.drawImage(imgs[layer], 0, 0, c.width, c.height);
    const kinds = {};               // node -> colour of its direct link with the source
    if (src) {
        for (const [j, cost] of neighbors(src)) if (j !== byName[src]) kinds[j] = edgeKind(src, j, cost);
        for (const k of ['far', 'dest', 'move']) {      // red first, see-through; the useful ones on top
            for (const j of Object.keys(kinds)) {
                if (kinds[j] !== k || g.nodes[j][0] !== layer || g.nodes[byName[src]][0] !== layer) continue;
                ctx.globalAlpha = k === 'far' ? 0.12 : 1;
                line(ctx, pos(byName[src]), pos(Number(j)), COLORS[k]);
            }
        }
        ctx.globalAlpha = 1;
        ctx.setLineDash([4, 3]);        // manual links of the source, linked or not
        for (const [key, v] of Object.entries(overrides)) {
            const [a, b] = key.split('|'), other = a === src ? b : b === src ? a : '';
            if (other && byName[other] !== undefined && layerOf(other) === layer && layerOf(src) === layer) {
                ctx.globalAlpha = v === 'far' ? 0.25 : 1;
                line(ctx, pos(byName[src]), pos(byName[other]), COLORS[v]);
            }
        }
        ctx.globalAlpha = 1;
        ctx.setLineDash([]);
    }
    g.nodes.forEach(([l, , , kind], i) => {
        if (l !== layer) return;
        const [x, y] = pos(i), scene = names[i].some(isStage), k = kinds[i];
        const isSrc = i === byName[src], isTgt = tgts.some((t) => byName[t] === i), X = x * ZOOM, Y = y * ZOOM;
        ctx.globalAlpha = k === 'far' && !isSrc && !isTgt ? 0.3 : 1;      // red is see-through
        ctx.fillStyle = isSrc ? '#fff' : k ? COLORS[k] : kind === 'future' ? '#f90' : scene ? '#ddd' : '#9be';
        ctx.beginPath();
        if (scene) ctx.arc(X, Y, 7, 0, 7);
        else if (kind === 'future') { ctx.moveTo(X, Y - 9); ctx.lineTo(X + 9, Y); ctx.lineTo(X, Y + 9); ctx.lineTo(X - 9, Y); ctx.closePath(); }
        else ctx.rect(X - 6, Y - 6, 12, 12);
        ctx.fill();
        ctx.lineWidth = 4; ctx.strokeStyle = '#fff'; ctx.stroke();                  // a white halo, then a black ring: seen on any map
        ctx.lineWidth = 2; ctx.strokeStyle = isTgt ? '#f0f' : '#000'; ctx.stroke();
        if (isTgt) { ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(X, Y, 12, 0, 7); ctx.stroke(); }
        if (isSrc) { ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(X, Y, 3, 0, 7); ctx.fill(); }      // a black dot marks the source
        const n = Object.keys(overrides).filter((key) => key.split('|').some((s) => names[i].includes(s))).length;   // manual links of this spot: 0 = not done yet
        ctx.font = 'bold 12px sans-serif'; ctx.textBaseline = 'middle'; ctx.lineWidth = 3; ctx.strokeStyle = '#fff'; ctx.fillStyle = n ? '#000' : '#c00';
        ctx.strokeText(n, X + 11, Y - 9); ctx.fillText(n, X + 11, Y - 9);
        ctx.globalAlpha = 1;
    });
    for (const [name, d] of Object.entries(points)) {       // added but not in the graph yet: save and reload to connect
        if (d.layer !== layer || name in byName) continue;
        ctx.fillStyle = '#fff'; ctx.strokeStyle = '#f0f'; ctx.lineWidth = 2;
        ctx.strokeRect(d.x * ZOOM - 6, d.y * ZOOM - 6, 12, 12);
    }
    const count = (k) => Object.values(kinds).filter((v) => v === k).length;
    p.summary.textContent = src ? `${src}: ${count('move')} accessible, ${count('dest')} difficult, ${count('far')} red (see-through) direct links` : '';
    drawLink();
}

function drawLink() {
    const has = src && tgts.some((t) => t !== src), vs = has ? tgts.filter((t) => t !== src).map((t) => verdict(src, t)) : [];
    p.srcPlace.style.fontWeight = placing === 'src' ? 'bold' : '';
    p.tgtPlace.style.fontWeight = placing === 'tgt' ? 'bold' : '';
    p.newAdd.textContent = placing === 'new' ? 'click the map...' : 'Add point';
    p.srcPlace.textContent = placing === 'src' ? 'click the map...' : 'change coord';
    p.tgtPlace.textContent = placing === 'tgt' ? 'click the map...' : 'change coord (last target)';
    for (const b of p.weights.querySelectorAll('button')) b.style.outline = has && vs.every((v) => v === b.dataset.v) ? '3px solid #000' : '';
    p.linkInfo.innerHTML = !has ? '<span class="muted">Pick a source and one or more targets (shift-click adds or removes a target) to set the weight of their links.</span>' :
        tgts.filter((t) => t !== src).map((t) => {
            const v = verdict(src, t), ak = autoKind(src, t), auto = ak ? NAMES[ak] : 'no direct link';
            return `<b>${esc(src)}</b> &harr; <b>${esc(t)}</b>: ${v ? `manual <b>${NAMES[v]}</b> (auto: ${auto})` : `auto <b>${auto}</b>`}`;
        }).join('<br>');
    p.count.textContent = `${Object.keys(overrides).length} verdicts, ${Object.keys(moved).length} moved spots (unsaved changes stay in this browser)`;
}

// Set the weight of a link for every scene sharing the two spots (the five scenes of the Castle are one spot).
function setVerdict(v) {
    if (!src || !tgts.length) return;
    const spot = (n) => isStage(n) ? stages.filter((m) => g.anchors[m] === g.anchors[n]) : [n];
    for (const t of tgts) {
        for (const a of spot(src)) {
            for (const b of spot(t)) {
                if (a === b) continue;
                if (v) overrides[pairKey(a, b)] = v; else delete overrides[pairKey(a, b)];
            }
        }
    }
    rebuild(); save(); draw();
}

async function post(url, body, what) {
    try {
        const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        p.tip.textContent = r.ok ? `${what}: ${await r.text()}` : `${what} failed (${r.status}): run tools/serve.py from this computer`;
        return r.ok;
    } catch (e) { p.tip.textContent = `${what} failed: ${e.message}`; return false; }
}

function nearest(ev) {
    const r = p.canvas.getBoundingClientRect();
    const x = (ev.clientX - r.left) * p.canvas.width / r.width / ZOOM, y = (ev.clientY - r.top) * p.canvas.height / r.height / ZOOM;
    let best = -1, bd = 8;
    g.nodes.forEach(([l], i) => {
        const d = Math.hypot(pos(i)[0] - x, pos(i)[1] - y);
        if (l === layer && d < bd && names[i].length) { best = i; bd = d; }
    });
    return { i: best, x, y, name: best < 0 ? '' : names[best].find((n) => n === src || tgts.includes(n)) || names[best][0] };
}

// The game's own scene of a stage, as a reference for the curation (the stage name is its background name).
function show(n) {
    if (!isStage(n)) return;
    try { loadBackground(n); } catch (e) { /* no background for this stage */ }
}

function setLayer(l) {
    layer = l;
    p.layers.querySelectorAll('button').forEach((b) => { b.style.fontWeight = b.dataset.l == l ? 'bold' : ''; });
    if (!imgs[l]) { imgs[l] = new Image(); imgs[l].onload = draw; imgs[l].src = MAPS[l]; }
    draw();
}

function choose(role, n) {
    if (role === 'src') src = n;
    else if (role === 'tgt') tgts = n ? [n] : [];                   // the list: one target
    else if (n) tgts = tgts.includes(n) ? tgts.filter((t) => t !== n) : [...tgts, n];       // shift-click: add or drop a target
    p.srcSel.value = src; p.tgtSel.value = tgt();
    placing = '';
    if (n) { show(n); setLayer(layerOf(n)); } else draw();
}

const options = () => `<option value="">(drop to select)</option><optgroup label="Scenes">${stages.map((n) => `<option>${n}</option>`).join('')}</optgroup>
    <optgroup label="Connectors and future scenes">${waypoints.map((n) => `<option>${n}</option>`).join('')}</optgroup>`;

export async function open(devTools) {
    tools = devTools;
    tools.setSpeed(1);
    tools.resetScene();             // the game waits while the mode is open: the scene stays as picked
    side = sidePanel('right', 'Travel: curate the links', () => close());
    side.body.innerHTML = `
        <div class="row"><b>Source:</b><select data-id="srcSel">${options()}</select><button data-id="srcPlace">change coord</button></div>
        <div class="row"><b>Target:</b><select data-id="tgtSel">${options()}</select><button data-id="tgtPlace">change coord</button></div>
        <div class="row"><b>New point:</b><select data-id="newKind"><option value="future">future scene</option><option value="connector">connector (bridge, stairs...)</option></select>
            <input data-id="newName" placeholder="name (letters, digits, _)" size="18"><button data-id="newAdd">Add point</button></div>
        <div class="row"><b>Adjust travel weight:</b><span data-id="weights">
            <button data-v="move" style="background:${COLORS.move}">Accessible</button>
            <button data-v="dest" style="background:${COLORS.dest}">Difficult</button>
            <button data-v="far" style="background:${COLORS.far};color:#fff">Impossible</button>
            <button data-v="">Auto</button></span></div>
        <div data-id="linkInfo"></div>
        <div data-id="summary" class="muted"></div>
        <div style="display:flex;gap:6px;align-items:flex-start">
            <div data-id="layers" style="display:flex;flex-direction:column;gap:4px">${Object.keys(MAPS).map((l) => `<button data-l="${l}">${l}</button>`).join('')}</div>
            <canvas data-id="canvas" width="${SIZE * ZOOM}" height="${SIZE * ZOOM}" style="flex:1;min-width:0;image-rendering:pixelated;cursor:crosshair"></canvas>
        </div>
        <div class="row"><button data-id="save">Save verdict</button><button data-id="capture">Capture the map</button><span data-id="count" class="muted"></span></div>
        <div class="row" style="gap:2px 12px">
            <span>Only the direct links of the source are drawn, as straight lines; a spot reached only through another is not a neighbour.</span>
            <span><b style="color:${COLORS.move}">&#9632;</b> Accessible: an easy link (cost up to ${config.travel.moveLimit})</span>
            <span><b style="color:${COLORS.dest}">&#9632;</b> Difficult: a hard link, e.g. across a river (up to ${config.travel.difficultLimit})</span>
            <span><b style="color:${COLORS.far}">&#9632;</b> Impossible: a link too dear or removed; drawn see-through</span>
            <span>white dot with a black centre: the source; magenta ring: a target (shift-click adds or drops targets, the list picks just one); round: a scene; blue square: bridge, pier, entrance, stairs or connector; orange diamond: a future scene; red is drawn see-through; dashed: a manual link; the small number beside a spot is how many manual links it has (red 0 = not done yet)</span>
            <span class="muted">Cost = walking in map pixels: rivers add a lot, bridges are free, the sea is nearly blocked. To link two spots that are not neighbours, pick both and press Accessible or Difficult. Accessible sets a link's cost to ${config.travel.accessibleCost}, Difficult multiplies it by ${config.travel.difficultFactor} (at least ${config.travel.difficultMin}), Impossible removes it.</span>
        </div>
        <div data-id="tip" class="muted">Click a spot for the source, shift-click one for the target. Hover for its name and cost.</div>`;
    p = {};
    side.body.querySelectorAll('[data-id]').forEach((e) => { p[e.dataset.id] = e; });
    p.srcSel.onchange = () => choose('src', p.srcSel.value);
    p.tgtSel.onchange = () => choose('tgt', p.tgtSel.value);
    p.srcPlace.onclick = () => { placing = placing === 'src' ? '' : src ? 'src' : ''; draw(); };
    p.tgtPlace.onclick = () => { placing = placing === 'tgt' ? '' : tgt() ? 'tgt' : ''; draw(); };
    p.newAdd.onclick = () => {
        const name = p.newName.value.trim().replace(/\W+/g, '_');
        if (!name || name in byName || name in points) { p.tip.textContent = 'Give the new point a name nobody uses yet.'; return; }
        newPoint = { name, kind: p.newKind.value };
        placing = 'new'; p.tip.textContent = `Click the map (${layer}) to put ${name}.`; draw();
    };
    p.weights.onclick = (e) => { if (e.target.dataset.v !== undefined) setVerdict(e.target.dataset.v); };
    p.layers.onclick = (e) => e.target.dataset.l && setLayer(e.target.dataset.l);
    p.canvas.onclick = (e) => {
        const h = nearest(e);
        if (placing === 'new') {
            points[newPoint.name] = { kind: newPoint.kind, layer, x: Math.round(h.x), y: Math.round(h.y) };
            p.tip.textContent = `${newPoint.name} added: Save verdict and reload to connect it.`;
            placing = ''; newPoint = null; p.newName.value = ''; save(); draw();
        } else if (placing) {          // move the chosen spot (every scene sharing it, and a cave mouth's twin)
            const n = placing === 'src' ? src : tgt();
            for (const m of names[byName[n]]) moved[baseOf(m)] = [Math.round(h.x), Math.round(h.y)];
            placing = ''; save(); draw();
        } else if (h.name) choose(e.shiftKey ? 'more' : 'src', h.name);
    };
    p.canvas.onmousemove = (e) => {
        const s = nearest(e).name;
        p.tip.textContent = s ? `${s}${places[s] ? ` (${places[s].zone})` : ''}${src && s !== src ? (neighbors(src).find(([j]) => j === byName[s]) ? `: direct link, cost ${Math.round(neighbors(src).find(([j]) => j === byName[s])[1])}` : ': not a direct link') : ''}` : 'Click a spot for the source, shift-click one for the target.';
    };
    p.save.onclick = async () => {
        const positions = { ...moved };
        for (const [name, d] of Object.entries(points)) {       // a moved point of ours is saved in its own entry
            if (positions[name]) { [d.x, d.y] = positions[name]; delete positions[name]; }
        }
        if (await post('travel/overrides', { verdicts: overrides, positions, points }, 'Save')) { try { localStorage.removeItem(DRAFT); } catch (e) { /* none */ } }
    };
    p.capture.onclick = () => post('travel/capture', { png: p.canvas.toDataURL('image/png'), stage: src, layer, overrides, moved }, 'Capture');
    try {
        const d = JSON.parse(localStorage.getItem(DRAFT) || '{}');
        Object.assign(overrides, d.verdicts || {});
        moved = d.positions || {};
        if (d.points) points = d.points;
        rebuild();
    } catch (e) { /* no draft */ }
    choose('src', src || 'la_Pradera1');
}

export function close(resume = true) {
    if (!side) return;
    side.close();
    side = null; p = null;
    if (resume) tools.closed();
}
