// Wizard Idle - the tableau of a rescue (src/rescuers.js): the caravan's camp over whatever outdoor scene he wakes in, or a rescuer standing
// at the enemy's place. The camp is a front overlay (img/places/overlays/overlay_caravan_camp.png, drawn with the scene's own front layer by
// render.js loadBackground) plus the folk, the mule and the fire on the props canvas, redrawn every frame while it shows.
// Positions are art px of the regular 64-row scene (feet on row 60); the characters' canvases cover those rows in the tall viewer too.

import { art } from '../media.js';
import { run, ui } from '../runtime.js';

export const CAMP_OVERLAY = 'overlay_caravan_camp';
const CAMP = [
    { name: 'rescuer_mule', x: 212, y: 24, w: 48, h: 40 },
    { name: 'rescuer_pagan_hunter', x: 58, y: 28 },
    { name: 'rescuer_pagan_bearer', x: 78, y: 28 },
    { name: 'rescuer_campfire', x: 104, y: 32, w: 24, h: 24, frames: 4, ms: 120 },
    { name: 'rescuer_pagan_elder', x: 126, y: 28, flip: true },
    { name: 'rescuer_pagan_singer', x: 146, y: 28, flip: true },
];
const GHOST = [{ name: 'rescuer_ghost', x: 192, y: 28, frames: 4, ms: 180 }];      // beside the wizard's place, over the enemy's spot

let pieces = [], camp = false, running = false;
const images = {};
const load = (name) => images[name] || (images[name] = Object.assign(new Image(), { src: art(name) }));

export const campShowing = () => camp;

function draw(now) {
    if (!pieces.length) { running = false; return; }
    const canvas = document.getElementById('propsCanvas');
    if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const ctx = canvas.getContext('2d'), u = ui.charWidth / 32;
        ctx.imageSmoothingEnabled = !ui.crisp;
        for (const p of pieces) {
            const img = load(p.name);
            if (!img.complete || !img.naturalWidth) continue;
            const w = p.w || 32, h = p.h || 32, f = p.frames ? Math.floor(now / p.ms) % p.frames : 0;
            if (p.flip) { ctx.save(); ctx.translate((p.x + w) * u, 0); ctx.scale(-1, 1); ctx.drawImage(img, f * w, 0, w, h, 0, p.y * u, w * u, h * u); ctx.restore(); }
            else ctx.drawImage(img, f * w, 0, w, h, p.x * u, p.y * u, w * u, h * u);
        }
    }
    requestAnimationFrame(draw);
}

// Show the caravan's camp (camp = true: the overlay is added by render.js on the next background load) or the ghost beside him.
export function showTableau(kind) {
    if (run.simulation) return;
    camp = kind === 'pagan';
    pieces = camp ? CAMP : kind === 'ghost' ? GHOST : [];
    pieces.forEach((p) => load(p.name));
    if (pieces.length && !running) { running = true; requestAnimationFrame(draw); }
}

// Take the tableau away (the props canvas is cleared on the next frame; the caller reloads the scene so the front layer drops the camp).
export function hideTableau() {
    camp = false;
    pieces = [];
    const canvas = document.getElementById('propsCanvas');
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}
