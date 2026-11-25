// Wizard Idle - the clickable spots of the scene (docs/plans/HOTSPOTS.md). A layer over the scene holds one invisible
// button per spot of the scene shown (src/data/hotspots.js); nothing marks them, the player finds them by trying.
// A tap goes to src/nudge.js; when that leaves it unused (a fight, a job waiting) it falls through to the buttons below.

import { hotspots } from '../data/hotspots.js';
import { fight, run, ui } from '../runtime.js';
import { touchSpot, newScene } from '../nudge.js';
import { el } from './dom.js';

const W = 256, H = 64;          // the scene in sprite px
const MIN_W = 24;               // a spot is never narrower than this: it has to be easy to hit with a finger

// The spots of this scene (the dev mode swaps in its own list while it edits).
export let spotsOf = (scene) => hotspots[String(scene).toLowerCase()] || [];
export const useSpots = (fn) => { spotsOf = fn; };

export function showHotspots(scene) {
    newScene();                  // a new scene visit: one more touch of the environment
    const layer = el('hotspotLayer');
    if (!layer) return;
    layer.textContent = '';
    for (const spot of spotsOf(scene)) {
        const b = document.createElement('button');
        b.className = 'spot';
        const w = Math.max(MIN_W, spot.w), x = Math.max(0, Math.min(W - w, spot.x + (spot.w - w) / 2));
        Object.assign(b.style, { left: `${x / W * 100}%`, top: `${spot.y / H * 100}%`, width: `${w / W * 100}%`, height: `${spot.h / H * 100}%` });
        b.onclick = (e) => tap(e, b, spot, scene);
        layer.appendChild(b);
    }
}

// A find in sight (a rune, a book, a statue) is a spot while he studies it; the code makes it, nobody authors it.
export function showFindSpot(x, label, y = 24, w = 36, h = 36) {
    const layer = el('hotspotLayer');
    if (!layer || run.simulation) return;
    clearFindSpot();
    const spot = { x, y, w, h, kind: 'find', label };
    const b = document.createElement('button');
    b.className = 'spot found';
    const sw = Math.max(MIN_W, w);
    Object.assign(b.style, { left: `${Math.max(0, x) / W * 100}%`, top: `${y / H * 100}%`, width: `${sw / W * 100}%`, height: `${h / H * 100}%` });
    b.onclick = (e) => tap(e, b, spot, ui.currentBackGround);
    layer.appendChild(b);
}
export function clearFindSpot() {
    const layer = el('hotspotLayer');
    if (layer) layer.querySelectorAll('.found').forEach((n) => n.remove());
}

function tap(e, node, spot, scene) {
    const blocked = fight.enemy || /altar/i.test(String(scene)) || run.disablePjBtn;      // those scenes keep their own touches
    const used = blocked ? false : touchSpot(spot);
    if (used) {
        if (used == 'done') { node.classList.remove('glow'); void node.offsetWidth; node.classList.add('glow'); }     // the glow only shows after a real nudge
        return;
    }
    // not ours: the button under the spot gets the tap
    for (const under of document.elementsFromPoint(e.clientX, e.clientY)) {
        if (under.classList && under.classList.contains('transparentBtn')) { under.click(); return; }
    }
}
