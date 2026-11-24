// Wizard Idle v2 - dev tools: the travel mode (only while developing). See docs/TRAVEL.md.
//
// Curate the travel graph by hand. Pick a source and a target (the lists, or click a spot on the map and
// shift-click another; scenes, bridges, the pier, cave mouths and stairs all count), set the weight of the
// link between them (Accessible / Difficult / Impossible / Auto) and move a spot's coordinates ("change
// coord", then click the map). "Save verdict" writes the verdicts (src/data/travelOverrides.js) and the new
// positions (zones.js for scenes, travelPositions for waypoints) and regenerates the graph; reload after.
// The map shows the cheapest paths from the source: green = a move inside the zone, yellow = a destination
// in another zone, red = too far. Clicking a scene also shows that scene in the game.
// The source has a black dot in its centre. Shift-click adds or drops targets: the weight buttons set the link from the source to every target at once. The map layers (above, ground, under) are buttons beside the map, with the weight buttons below them.
// Opened from the dev panel (Modes > Travel), on the right of the game; the game waits until it is closed.

import { travelGraph as g } from '../data/travelGraph.js';
import { places } from '../data/zones.js';
import { neighbors, overrides, pairKey, verdict, byName, rebuild, travelCost, routeIds, dynamicScenes, SIZE } from '../travelGraph.js';
import { config } from '../config.js';
import { travelPoints } from '../data/travelOverrides.js';
import { sidePanel } from './panel.js';
import { esc } from './review.js';
import { loadBackground } from '../ui/render.js';
import { art } from '../media.js';
import { connectorScenesOf } from '../data/connectors.js';

const MAPS = { above: 'img/ui/mapaboveground.png', ground: 'img/ui/mapa.png', under: 'img/ui/mapaunderground.png' };
const ZOOM = 2, COLORS = { move: '#2fd02f', dest: '#f2d21c', far: '#e03030' }, FUTURE = '#f0f';
const NAMES = { move: 'Accessible', dest: 'Difficult', far: 'Impossible' };
const DRAFT = 'wizardidle2:travelDraft';
const stages = Object.keys(g.anchors).sort();
const waypoints = g.nodes.map((n) => n[4]).filter(Boolean).sort();
const names = g.nodes.map((n, i) => { const at = stages.filter((s) => g.anchors[s] === i); return at.length ? at : n[4] ? [n[4]] : []; });
const baseOf = (n) => n.replace(/_(under|above)$/, '');       // a cave mouth moves with its underground twin
const CUSTOM = ['future', 'connector'];         // kinds of the points added by hand
const touched = new Set();                      // links given a verdict since this page was opened
let checking = false, showPath = false;
let side, p, tools, imgs = {}, layer = 'ground', src = '', tgts = [], showNums = true, placing = '', moved = {}, points = {}, newPoint = null;
g.nodes.forEach((n) => { if (CUSTOM.includes(n[3])) points[n[4]] = { kind: n[3], layer: n[0], x: n[1], y: n[2], note: (travelPoints[n[4]] || {}).note || '' }; });
// The spots not joined to the biggest group of linked spots (impossible links do not count): [node, ...].
function lost() {
    const group = g.nodes.map(() => -1), sizes = [];
    g.nodes.forEach((n, s) => {
        if (group[s] >= 0 || !names[s].length) return;
        const id = sizes.length; let size = 0; const todo = [s]; group[s] = id;
        while (todo.length) {
            const u = todo.pop(); size++;
            for (const [j] of neighbors(names[u][0])) if (group[j] < 0) { group[j] = id; todo.push(j); }
        }
        sizes.push(size);
    });
    const main = sizes.indexOf(Math.max(...sizes));
    return g.nodes.map((n, i) => i).filter((i) => names[i].length && group[i] !== main).sort((a, b) => group[a] - group[b]);
}
const kindOf = (i) => (points[names[i][0]] || {}).kind || g.nodes[i][3];       // a point's type can be switched before the graph is rebuilt
const isCustom = (n) => n in points;

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
    ctx.beginPath(); ctx.moveTo(a[0] * ZOOM, a[1] * ZOOM); ctx.lineTo(b[0] * ZOOM, b[1] * ZOOM);
    ctx.strokeStyle = 'rgba(0,0,0,0.85)'; ctx.lineWidth = 4; ctx.stroke();       // dark outline: a green line stays visible on green grass
    ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
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
    const goals = tgts.filter((t) => t !== src);
    let pathText = '';
    if (showPath) {
        if (!src || goals.length !== 1) pathText = 'Optimal path: pick a source and exactly one target.';
        else if (!Number.isFinite(travelCost(src, goals[0]))) pathText = `<b>${esc(src)}</b> to <b>${esc(goals[0])}</b>: no path.`;
        else {
            const ids = routeIds(src, goals[0]);
            ctx.lineJoin = 'round'; ctx.lineCap = 'round';
            for (let k = 1; k < ids.length; k++) {
                if (g.nodes[ids[k]][0] !== layer || g.nodes[ids[k - 1]][0] !== layer) continue;
                const a = pos(ids[k - 1]), b = pos(ids[k]);
                ctx.beginPath(); ctx.moveTo(a[0] * ZOOM, a[1] * ZOOM); ctx.lineTo(b[0] * ZOOM, b[1] * ZOOM);
                ctx.strokeStyle = '#000'; ctx.lineWidth = 8; ctx.stroke();
                ctx.strokeStyle = '#0ff'; ctx.lineWidth = 4; ctx.stroke();
            }
            const at = (n) => ({ layer: g.nodes[n][0], x: g.nodes[n][1], y: g.nodes[n][2] });
            const legs = ids.slice(1).map((n, k) => dynamicScenes(travelCost(at(ids[k]), at(n))));
            const stops = ids.map((n) => names[n][0] || g.nodes[n][4]).filter(Boolean);
            pathText = `<b>Optimal path</b> ${esc(src)} to ${esc(goals[0])}: cost ${Math.round(travelCost(src, goals[0]))} (walking pixels), about ${legs.reduce((t, l) => t + l, 0)} dynamic scenes (${legs.join(' + ')} per leg), ${ids.length} spots: ${stops.map(esc).join(' &rarr; ')}`;
        }
    }
    p.pathInfo.innerHTML = pathText;
    g.nodes.forEach(([l], i) => {
        if (l !== layer) return;
        const kind = kindOf(i);
        const [x, y] = pos(i), scene = names[i].some(isStage), k = kinds[i];
        const isSrc = i === byName[src], isTgt = tgts.some((t) => byName[t] === i), X = x * ZOOM, Y = y * ZOOM;
        ctx.globalAlpha = k === 'far' && !isSrc && !isTgt ? 0.3 : 1;      // red is see-through
        ctx.fillStyle = isSrc ? '#fff' : k ? COLORS[k] : kind === 'future' ? FUTURE : scene ? '#ddd' : '#9be';
        ctx.beginPath();
        if (scene || kind === 'future') ctx.arc(X, Y, 8, 0, 7);       // round: a scene or a future scene
        else ctx.rect(X - 7, Y - 7, 14, 14);                          // square: a connector
        ctx.fill();
        ctx.lineWidth = 4; ctx.strokeStyle = '#fff'; ctx.stroke();                  // a white halo, then a black ring: seen on any map
        ctx.lineWidth = 2; ctx.strokeStyle = isTgt ? '#f0f' : '#000'; ctx.stroke();
        if (isTgt) { ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(X, Y, 12, 0, 7); ctx.stroke(); }
        if (isSrc) { ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(X, Y, 3, 0, 7); ctx.fill(); }      // a black dot marks the source
        if (showNums) {
        const n = Object.keys(overrides).filter((key) => key.split('|').some((s) => names[i].includes(s))).length;   // manual links of this spot: 0 = not done yet
        ctx.font = 'bold 12px sans-serif'; ctx.textBaseline = 'middle'; ctx.lineWidth = 3; ctx.strokeStyle = '#fff'; ctx.fillStyle = n ? '#000' : '#c00';
        ctx.strokeText(n, X + 11, Y - 9); ctx.fillText(n, X + 11, Y - 9);
        }
        ctx.globalAlpha = 1;
    });
    for (const [name, d] of Object.entries(points)) {       // added but not in the graph yet: save and reload to connect
        if (d.layer !== layer || name in byName) continue;
        ctx.fillStyle = d.kind === 'future' ? FUTURE : '#9be'; ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.setLineDash([3, 2]);      // dashed: new, not in the graph yet
        ctx.beginPath();
        if (d.kind === 'future') ctx.arc(d.x * ZOOM, d.y * ZOOM, 7, 0, 7); else ctx.rect(d.x * ZOOM - 6, d.y * ZOOM - 6, 12, 12);
        ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
    }
    if (checking) for (const i of lost()) {      // isolated spots: a thick red ring
        const [x, y] = pos(i);
        if (g.nodes[i][0] !== layer) continue;
        ctx.strokeStyle = '#e00'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x * ZOOM, y * ZOOM, 15, 0, 7); ctx.stroke();
    }
    const count = (k) => Object.values(kinds).filter((v) => v === k).length;
    p.summary.textContent = src ? `${src}: ${count('move')} accessible, ${count('dest')} difficult, ${count('far')} red (see-through) direct links` : '';
    drawLink();
}

function drawLink() {
    const has = src && tgts.some((t) => t !== src), vs = has ? tgts.filter((t) => t !== src).map((t) => verdict(src, t)) : [];
    const own = isCustom(src);
    p.srcPlace.style.fontWeight = placing === 'src' ? 'bold' : '';
    p.tgtPlace.style.fontWeight = placing === 'tgt' ? 'bold' : '';
    p.newAdd.textContent = placing === 'new' ? 'click the map...' : 'Add point';
    p.srcPlace.textContent = placing === 'src' ? 'click the map...' : 'change coord';
    p.tgtPlace.textContent = placing === 'tgt' ? 'click the map...' : 'change coord (last target)';
    for (const b of p.weights.querySelectorAll('button')) b.style.outline = has && vs.every((v) => v === b.dataset.v) ? '3px solid #000' : '';
    const picked = [src, ...tgts].filter((n, i, a) => n && a.indexOf(n) === i && isCustom(n)).map((n) => `<b>${esc(n)}</b>: ${points[n].kind === 'future' ? 'future scene (circle)' : 'connector (square)'}`).join(' &middot; ');
    p.linkInfo.innerHTML = (picked ? `<div>${picked}</div>` : '') + (!has ? '<span class="muted">Pick a source and one or more targets (shift-click adds or removes a target) to set the weight of their links.</span>' :
        tgts.filter((t) => t !== src).map((t) => {
            const v = verdict(src, t), ak = autoKind(src, t), auto = ak ? NAMES[ak] : 'no direct link';
            return `<b>${esc(src)}</b> &harr; <b>${esc(t)}</b>: ${v ? `manual <b>${NAMES[v]}</b> (auto: ${auto})` : `auto <b>${auto}</b>`}`;
        }).join('<br>'));
    if (checking) {
        const bad = lost();
        p.checkInfo.innerHTML = bad.length ? `<b style="color:#e00">${bad.length} spots are cut off from the main map</b> (red rings): ` + bad.map((i) => `${esc(names[i].join('/'))} (${g.nodes[i][0]})`).join(', ')
            : '<b style="color:#2a2">Every spot is connected to the main map.</b>';
    } else p.checkInfo.textContent = '';
    p.count.textContent = `${touched.size} verdicts this session, ${Object.keys(moved).length} moved spots (unsaved changes stay in this browser)`;
}

// Set the weight of a link for every scene sharing the two spots (the five scenes of the Castle are one spot).
function setVerdict(v) {
    if (!src || !tgts.length) return;
    const spot = (n) => isStage(n) ? stages.filter((m) => g.anchors[m] === g.anchors[n]) : [n];
    for (const t of tgts) {
        for (const a of spot(src)) {
            for (const b of spot(t)) {
                if (a === b) continue;
                touched.add(pairKey(a, b));
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

// The scenes of a spot for the viewers: a connector's own scenes (a bridge, stairs or mouth has several), else its stage.
const scenesOf = (n) => (isStage(n) ? [n] : connectorScenesOf(n));
function viewers() {
    p.views.innerHTML = [['Source', src], ['Target', tgt()]].filter(([, n]) => n).map(([role, n]) => {
        const list = scenesOf(n);
        return `<div><b>${role}: ${esc(n)}</b>${list.length ? '' : ' <span class="muted">(no scene yet)</span>'}<div style="display:flex;flex-wrap:wrap;gap:6px">${list.map((s) =>
            `<figure style="margin:0"><img src="${art(s.toLowerCase())}" alt="${esc(s)}" style="width:256px;image-rendering:pixelated;display:block;background:#222" onerror="this.style.display='none'"><figcaption class="muted">${esc(s)}</figcaption></figure>`).join('')}</div></div>`;
    }).join('');
}

function setLayer(l) {
    layer = l;
    p.layers.querySelectorAll('button').forEach((b) => { b.style.fontWeight = b.dataset.l == l ? 'bold' : ''; });
    if (!imgs[l]) { imgs[l] = new Image(); imgs[l].onload = draw; imgs[l].src = MAPS[l]; }
    draw();
}

function choose(role, n) {
    if (role === 'src') { if (n !== src) tgts = []; src = n; }       // a new source starts with no targets
    else if (role === 'tgt') tgts = n ? [n] : [];                   // the list: one target
    else if (n) tgts = tgts.includes(n) ? tgts.filter((t) => t !== n) : [...tgts, n];       // shift-click: add or drop a target
    p.srcSel.value = src; p.tgtSel.value = tgt(); viewers();
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
    side.maxWidth = 900;
    side.body.innerHTML = `
        <div class="row"><b>Source:</b><select data-id="srcSel">${options()}</select><button data-id="srcPlace">change coord</button></div>
        <div class="row"><b>Target:</b><select data-id="tgtSel">${options()}</select><button data-id="tgtPlace">change coord</button></div>
        <div class="row"><b>New point:</b><select data-id="newKind"><option value="future">future scene</option><option value="connector">connector (bridge, stairs...)</option></select>
            <input data-id="newName" placeholder="name (letters, digits, _)" size="18"><button data-id="newAdd">Add point</button></div>
        <div data-id="summary" class="muted"></div>
        <canvas data-id="canvas" width="${SIZE * ZOOM}" height="${SIZE * ZOOM}" style="width:100%;min-width:0;image-rendering:pixelated;cursor:crosshair;display:block"></canvas>
        <div style="display:flex;flex-wrap:wrap;gap:6px 18px;align-items:flex-start;margin:6px 0">
            <div data-id="layers" style="display:flex;gap:4px;align-items:center"><b>Map</b>${Object.keys(MAPS).map((l) => `<button data-l="${l}">${l}</button>`).join('')}</div>
            <div data-id="weights" style="display:flex;gap:4px;align-items:center"><b>Weight</b>
                <button data-v="move" style="background:${COLORS.move}">Accessible</button>
                <button data-v="dest" style="background:${COLORS.dest}">Difficult</button>
                <button data-v="far" style="background:${COLORS.far};color:#fff">Impossible</button>
                <button data-v="">Auto</button></div>
            <div style="display:flex;gap:4px;align-items:center"><b>Points</b>
                <button data-id="align" title="move the target(s) onto the source, e.g. the two ends of a connector">Align to source</button>
                <button data-id="swap" title="future scene becomes a connector and the other way round (source and targets)">Future &harr; connector</button></div>
            <div style="display:flex;gap:4px;align-items:center"><b>View</b>
                <button data-id="deselect">Deselect all</button><button data-id="nums">Hide numbers</button><button data-id="check" title="ring every spot that no chain of links joins to the main map">Check connections</button>
                <button data-id="path" title="pick a source and exactly one target: draws the cheapest path the wizard would walk">Optimal path</button></div>
        </div>
        <div data-id="views" style="display:flex;flex-direction:column;gap:6px;margin:6px 0"></div>
        <div data-id="linkInfo"></div>
        <div data-id="checkInfo"></div>
        <div data-id="pathInfo"></div>
        <div class="row"><button data-id="save">Save verdict</button><button data-id="capture">Capture the map</button><span data-id="count" class="muted"></span></div>
        <div class="row" style="gap:2px 12px">
            <span>Only the direct links of the source are drawn, as straight lines; a spot reached only through another is not a neighbour.</span>
            <span><b style="color:${COLORS.move}">&#9632;</b> Accessible: an easy link (cost up to ${config.travel.moveLimit})</span>
            <span><b style="color:${COLORS.dest}">&#9632;</b> Difficult: a hard link, e.g. across a river (up to ${config.travel.difficultLimit})</span>
            <span><b style="color:${COLORS.far}">&#9632;</b> Impossible: a link too dear or removed; drawn see-through</span>
            <span>white dot with a black centre: the source; dashed outline: a new point not saved yet; magenta ring: a target; red ring: cut off from the main map (Check connections) (shift-click adds or drops targets, the list picks just one); round: a scene (grey) or a future scene (magenta); blue square: bridge, pier, entrance, stairs or connector; red is drawn see-through; dashed: a manual link; the small number beside a spot is how many manual links it has (red 0 = not done yet)</span>
            <span class="muted">Cost = walking in map pixels: rivers add a lot, bridges are free, the sea is nearly blocked. To link two spots that are not neighbours, pick both and press Accessible or Difficult. Accessible sets a link's cost to ${config.travel.accessibleCost}, Difficult multiplies it by ${config.travel.difficultFactor} (at least ${config.travel.difficultMin}), Impossible removes it.</span>
        </div>
        <div data-id="tip" class="muted">Click a spot for the source, shift-click one for the target. Hover for its name and cost.</div>`;
    p = {};
    side.body.querySelectorAll('[data-id]').forEach((e) => { p[e.dataset.id] = e; });
    p.align.onclick = () => {          // the targets go onto the source (every scene sharing them)
        if (!src || !tgts.some((t) => t !== src)) { p.tip.textContent = 'Pick a source and a target first: the target moves onto the source.'; return; }
        const [x, y] = pos(byName[src]);
        for (const t of tgts) if (t !== src) for (const m of names[byName[t]]) moved[baseOf(m)] = [x, y];
        save(); draw();
    };
    p.swap.onclick = () => {           // future scene <-> connector, for the points added by hand
        for (const n of [src, ...tgts]) {   // a built-in bridge, the pier or the stairs can be switched too: it becomes an entry of ours
            if (n && !isCustom(n) && byName[n] !== undefined && ['bridge', 'pier', 'stairs'].includes(g.nodes[byName[n]][3])) {
                const [x, y] = pos(byName[n]);
                points[n] = { kind: 'connector', layer: layerOf(n), x, y, note: '' };
            }
        }
        const list = [src, ...tgts].filter((n, i, a) => n && isCustom(n) && a.indexOf(n) === i);
        if (!list.length) { p.tip.textContent = 'Select a future scene, a connector, a bridge, the pier or the stairs.'; return; }
        for (const n of list) points[n].kind = points[n].kind === 'future' ? 'connector' : 'future';
        save(); draw();
        p.tip.textContent = `${list.join(', ')}: type switched. Save verdict and reload to apply it to the graph.`;
    };
    p.path.onclick = () => { showPath = !showPath; p.path.textContent = showPath ? 'Hide path' : 'Optimal path'; draw(); };
    p.deselect.onclick = () => { tgts = []; choose('src', ''); };
    p.check.onclick = () => { checking = !checking; p.check.textContent = checking ? 'Hide check' : 'Check connections'; draw(); };
    p.nums.onclick = () => { showNums = !showNums; p.nums.textContent = showNums ? 'Hide numbers' : 'Show numbers'; draw(); };
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
        } else if (h.name) choose(e.shiftKey || (src && layerOf(src) !== layer) ? 'more' : 'src', h.name);   // a plain click on another map than the source's picks a target
    };
    p.canvas.onmousemove = (e) => {
        const s = nearest(e).name;
        p.tip.textContent = s ? `${s}${places[s] ? ` (${places[s].zone})` : ''}${src && s !== src ? (neighbors(src).find(([j]) => j === byName[s]) ? `: direct link, cost ${Math.round(neighbors(src).find(([j]) => j === byName[s])[1])}, ${dynamicScenes(neighbors(src).find(([j]) => j === byName[s])[1])} dynamic scene(s)` : ': not a direct link') : ''}` : 'Click a spot for the source, shift-click one for the target.';
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
