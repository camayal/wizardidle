// Wizard Idle v2 - how enemies arrive (the author's playtest notes: "flying enemies arrive from
// the air, floating ones just float in, those that tend to hide jump into the scene, underground
// creatures come out of the ground"). All of it is done with code on the plain sprites (the
// author: "some walking or jumping could be done mathematically so we avoid more art"): paths,
// bobbing, squash on landing, a ground line that hides what is still underground, the dust strip.
//
// The game is frozen while an enemy arrives; nothing plays in a simulation or in the background.

import { run, ui } from '../runtime.js';
import { state } from '../state.js';
import * as loop from '../loop.js';
import { drawFrame, imageNow, loadNPC, npcBox, npcCanvas, pixelContext } from './render.js';

// Families by how they arrive (walk is the default).
const ENTRANCE = {
    fly: ["el_angelicus", "el_demonio", "el_dragus", "arcangel", "fenix"],
    float: ["el_espectro", "la_esencia", "el_ojo", "el_elemental", "infraespectro"],
    rise: ["baba", "polipoide", "el_ent", "el_umigubi", "momia", "el_esqueleto", "mother", "hydskon", "icedra"],
    jump: ["el_pillo", "la_pilla", "el_diabillo", "animalejo", "el_mediano", "el_elfo", "la_amazona"],
    blink: ["el_hechicero", "la_hechicera", "el_vampiro"],
};
const KIND = {};
for (const [kind, families] of Object.entries(ENTRANCE)) for (const f of families) KIND[f] = kind;

const STEP_MS = 50;
const FRAMES = { walk: 18, fly: 18, float: 18, rise: 16, jump: 14, blink: 12 };
const OFF_RIGHT = 80;               // sprite px from its place to just past the scene's right edge

export function entranceKind(npc) {
    const family = (npc || "").replace(/\d+$/, "");
    return KIND[family] || "walk";
}

const easeOut = (t) => 1 - (1 - t) * (1 - t);

// Where and how the sprite is drawn at t (0 to 1) for each kind: offsets in sprite px, scale
// from the feet, opacity, the ground clip (rise) and the dust frame.
function pose(kind, t, k) {
    const p = { dx: 0, dy: 0, sx: 1, sy: 1, alpha: 1, clip: false, dust: -1 };
    if (kind == "walk") {
        p.dx = OFF_RIGHT * (1 - t);
        p.dy = t < 1 ? -Math.abs(Math.sin(t * Math.PI * 5)) * 2 : 0;        // steps
    } else if (kind == "fly") {
        p.dx = OFF_RIGHT * (1 - t);                                         // glides down from the upper right
        p.dy = -40 * Math.pow(1 - t, 1.5);
        p.sy = t < 0.9 ? 1 - 0.08 * (0.5 + 0.5 * Math.sin(k * 1.6)) : 1;   // wingbeats
        if (t >= 0.9) { p.sy = 0.9; p.sx = 1.08; }                         // lands
    } else if (kind == "float") {
        p.dx = 60 * (1 - easeOut(t));
        p.dy = Math.sin(k * 0.7) * 2.5 * (1 - t);
        p.alpha = Math.min(1, t * 1.6);
    } else if (kind == "rise") {
        p.dy = 34 * (1 - easeOut(t));
        p.dx = t < 1 ? Math.sin(k * 2.2) * 0.8 : 0;                        // pushing out
        p.clip = true;
        p.dust = Math.min(2, Math.floor(t * 3));
    } else if (kind == "jump") {
        if (t < 0.8) {
            const u = t / 0.8;
            p.dx = OFF_RIGHT * (1 - u);
            p.dy = -4 * 18 * u * (1 - u);                                   // the arc
            p.sy = 1.06; p.sx = 0.95;                                      // stretched in the air
        } else { p.sy = 0.82; p.sx = 1.14; p.dust = 1; }                   // lands, squashed
    } else if (kind == "blink") {
        p.alpha = k % 2 ? 0.25 + 0.75 * t : t;                             // flickers in
        p.sx = Math.max(0.05, easeOut(t));                                 // opens from a line
        p.sy = 1 + 0.25 * (1 - t);
    }
    return p;
}

// The enemy now on the scene arrives; done runs when it stands in its place.
export function playEntrance(done) {
    const npc = state.npc;
    if (run.simulation || !document.hasFocus() || !npc) return done && done();
    const kind = entranceKind(npc), total = FRAMES[kind];
    imageNow(`img/${npc}.png`);
    imageNow("img/fx_dust.png");
    loop.freezeGame();
    npcCanvas.width = npcCanvas.offsetWidth;
    npcCanvas.height = npcCanvas.offsetHeight;
    let k = 0, waited = 0;
    const finish = () => {
        loop.stop("animNPC");
        loop.thawGame();
        if (state.npc == npc) loadNPC(npc);
        if (done) done();
    };
    const step = () => {
        if (state.npc != npc || k > total) return finish();
        const img = imageNow(`img/${npc}.png`);
        if (!img) {                                 // not loaded yet: wait for it (2 s at most)
            pixelContext(npcCanvas).clearRect(0, 0, npcCanvas.width, npcCanvas.height);
            if (++waited > 40) k = total + 1;
            return;
        }
        draw(npc, img, pose(kind, Math.min(1, k / (total - 2)), k));
        k++;
    };
    step();                                         // at once: it never shows in its place first
    loop.every("animNPC", step, STEP_MS);
}

function draw(npc, img, p) {
    const [bx, by, bw, bh] = npcBox(npc);
    const scene = ui.charWidth / 32;
    const w = bw * p.sx, h = bh * p.sy;
    const x = bx + p.dx * scene + (bw - w) / 2, y = by + p.dy * scene + bh - h;
    const ctx = pixelContext(npcCanvas);
    ctx.clearRect(0, 0, npcCanvas.width, npcCanvas.height);
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.clip) {                                   // only what is above the ground shows
        ctx.beginPath();
        ctx.rect(0, 0, npcCanvas.width, by + bh);
        ctx.clip();
    }
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();
    const dust = imageNow("img/fx_dust.png");
    if (dust && p.dust >= 0) {                      // dust at the feet (24 x 8, 3 frames)
        const dw = 24 * scene * (bw / ui.charWidth), dh = 8 * scene * (bw / ui.charWidth);
        drawFrame(ctx, dust, p.dust * 24, 0, 24, 8, bx + (bw - dw) / 2, by + bh - dh, dw, dh);
    }
}
