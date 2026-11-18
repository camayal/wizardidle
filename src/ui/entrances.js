// Wizard Idle v2 - how enemies arrive (the author's playtest notes: "flying enemies arrive from
// the air, floating ones just float in, those that tend to hide jump into the scene, underground
// creatures come out of the ground"). All of it is done with code on the plain sprites (the
// author: "some walking or jumping could be done mathematically so we avoid more art"): paths,
// bobbing, squash on landing, a ground line that hides what is still underground, the dust strip.
//
// Mages have three ways in (the author's notes): a flicker or a fade-in, at random, and for the
// rare ones a portal (the artist's three, purple, blue or red, at random). The mage bosses step out
// of their own bigger portal: Doria blue, King Midas golden, Rainbow multicolour. Every portal is
// an fx_portal_* strip of 16 frames (open 0-5, loop 6-11, close 12-15); until its file is there
// a stand-in drawn by code in its colours plays instead. A boss's portal is drawn a little smaller
// than its art (the author: the whole boss should be seen) and the boss grows out of the portal's
// centre while it turns, standing in its place just before the portal closes behind it.
//
// Bosses arrive by what they are (the author's note): fliers fly in, spectres float, the mage bosses
// step out of their portals, King Skeleton out of his skull arch; Herbus (a shaman) grows out of vines,
// kkck pushes up a bump of dirt and bursts out of it, the brutes slam down from a leap (Rojo in a
// burst of fire), the cube bounces in and medusa slithers.
//
// When the wizard falls, the enemy leaves its own way in, played backwards (playLeave): walkers turn
// and walk off, fliers fly off, risers sink back into the ground, mages fade away, the portal bosses
// go back through their portal.
//
// The game is frozen while an enemy arrives; nothing plays in a simulation or in the background.

import { run, ui } from '../runtime.js';
import { state } from '../state.js';
import * as loop from '../loop.js';
import { cancelNPCDraw, clearNPC, drawFrame, imageNow, loadNPC, looksRandom, npcBox, npcCanvas, pixelContext } from './render.js';
import { art } from '../media.js';
import { playSound } from '../audio.js';
import { enemySprites } from '../data/enemies.js';
import { zones } from '../data/zones.js';

// Families by how they arrive (walk is the default).
const ENTRANCE = {
    fly: ["el_angelicus", "el_demonio", "el_dragus", "arcangel", "fenix"],
    float: ["el_espectro", "la_esencia", "el_ojo", "el_elemental", "infraespectro", "etymos"],
    rise: ["baba", "polipoide", "el_ent", "el_umigubi", "momia", "el_esqueleto", "mother", "hydskon", "icedra",
        "herbus"],
    burrow: ["kkck"],
    jump: ["el_pillo", "la_pilla", "el_diabillo", "animalejo", "el_mediano", "el_elfo", "la_amazona", "cuboq"],
    slam: ["goro", "protromus", "bicaptop", "rojo"],
    slither: ["medusa"],
    blink: ["el_hechicero", "la_hechicera", "el_vampiro"],
};
const FIERY = new Set(["rojo"]);     // lands in a burst of fire and embers (melee with elemental powers)
const KIND = {};
for (const [kind, families] of Object.entries(ENTRANCE)) for (const f of families) KIND[f] = kind;

const STEP_MS = 50;
const FRAMES = { walk: 18, fly: 18, float: 18, rise: 11, jump: 14, slam: 26, burrow: 30, slither: 20, blink: 12, fade: 20, portal: 28, bossPortal: 28, archPortal: 30 };
export const ARRIVALS = Object.keys(FRAMES);
// Each portal strip and the stand-in's rings, outer to inner.
export const PORTALS = {
    fx_portal_a: ["#5b2a9e", "#9b5de5", "#e0c3ff"],             // purple, the swirl rift
    fx_portal_b: ["#1d3f8f", "#3f7fe0", "#bfe0ff"],             // blue, the dashed rings
    fx_portal_c: ["#7a1020", "#d0343c", "#ffc2a8"],             // red, the ragged rift
    fx_portal_doria: ["#163a8a", "#2f6fdc", "#9cc8ff"],         // the mage bosses' bigger portals
    fx_portal_midas: ["#7a5200", "#d9a520", "#fff1a8"],
    fx_portal_rainbow: ["#d03a3a", "#e8a020", "#3fb04f", "#3f7fe0", "#9b5de5"],
    fx_portal_skeleton: ["#2a1f33", "#cfc8b0", "#7cff6a"],      // King Skeleton's skull arch
};
const MAGE_PORTALS = ["fx_portal_a", "fx_portal_b", "fx_portal_c"];
// Portals: the three wizard bosses step out of their own; King Skeleton (a magical melee) out of
// his cursed skull arch.
const BOSS_PORTAL = { doria: "fx_portal_doria", midas: "fx_portal_midas", rainbow: "fx_portal_rainbow",
    skeleton: "fx_portal_skeleton" };
// King Skeleton's arch (the author picked it, 2026-11-17): drawn at full size around him (an 80 px
// wide strip at 1 art px per boss px), he fades in standing inside it, then it fades away behind him.
const ARCH = new Set(["skeleton"]);
const STRIP_FRAMES = 16;
const BOSS_PORTAL_SCALE = 0.9;      // the 80 x 96 boss strips at 90%: 72 x 86, bigger than the 64 px boss (the author: 70% and 85% too small)
const BOSS_STRIP_WIDTH = 80;        // a smaller strip (the 40 px mage portals) is scaled up to it
// The strip frame for an arrival step: opens, loops while the enemy steps out, closes.
const stripFrame = (k) => k < 6 ? k : k < 24 ? 6 + (k - 6) % 6 : Math.min(15, 12 + k - 24);
// The artist's general hydra entrances (img/bosses/hydras/anim_hydra_<effect>_enter.png): 16 frames
// of 96 x 96 sprite px with no hydra in them, drawn on top of the hydra at any head count; the
// hydra shows from the reveal frame (0-based) on. Each plays its sound from frame 0 (the author's
// two sounds fused, the burst on the reveal frame; volumes from the author's sound test, docs/SOUNDS.md).
const HYDRA_ENTER = {
    mother: { effect: "mud", reveal: 9, sound: "hydra_mud_enter", volume: 0.3 },
    icedra: { effect: "ice", reveal: 10, sound: "hydra_ice_enter", volume: 0.6 },
    hydskon: { effect: "bones", reveal: 11, sound: "hydra_bones_enter", volume: 0.3 },
};
const HYDRA_FRAME = 96;
// The ground effects the risers come out of and sink into (the artist's, img/effects/fx/fx_ground_<a-d>
// and fx_ground_boss_<a-d>): 10 frames, 48 x 32 for a 32 px sprite, 96 x 64 for a 64 px boss, drawn at
// 1 art px per sprite px with the ground row on the feet. One of the four at random each time. The
// sprite shows from frame `from` and is fully up on frame `up`; leaving plays it all backwards.
const GROUND = { a: { from: 3, up: 7 }, b: { from: 3, up: 7 }, c: { from: 1, up: 5 }, d: { from: 3, up: 7 } };
const GROUND_ROW = { 32: 24, 64: 48 };       // by sprite size: the ground row of the strip
const GROUND_FRAMES = 10;
// The hydras' leaving strips (anim_hydra_<effect>_leave, 14 frames of 96 x 96, ground = bottom row,
// laid over the sinking hydra, which is out of sight by frame 9).
const HYDRA_LEAVE_GONE = 9;
const HYDRA_ENTER_MS = 120;
const HYDRA_FADE = 5;               // steps the last frame fades over (the last droplets and shards fade out)
// Bosses with their own entrance strip with the boss drawn in it (the artist's, 100 ms a frame):
// Herbus grows out of braided vines; the last frame is his sprite, so the swap is seamless.
const STRIP_ENTER = { herbus: { src: "anim_herbus_enter", frame: 64 } };
const STRIP_ENTER_MS = 100;
const OFF_RIGHT = 80;               // sprite px from its place to just past the scene's right edge

export function entranceKind(npc) {
    const family = (npc || "").replace(/\d+$/, "");
    return KIND[family] || "walk";
}

// How this enemy arrives now, { kind, portal }: the dev tools' pick ("portal" or "portal:<strip>"),
// the mage bosses' own portal, a random portal for rare mages, a flicker or a fade-in for other
// mages, otherwise its family's way (other bosses too).
function arrivalKind(npc) {
    const forced = run.forceEntrance || "";
    run.forceEntrance = undefined;
    const portal = (strip) => {
        strip = strip || BOSS_PORTAL[npc] || MAGE_PORTALS[Math.floor(looksRandom() * 3)];
        return { kind: ARCH.has(npc) ? "archPortal" : BOSS_PORTAL[npc] ? "bossPortal" : "portal", portal: strip };
    };
    if (forced.startsWith("portal")) return portal(forced.split(":")[1]);
    if (FRAMES[forced]) return { kind: forced };
    if (BOSS_PORTAL[npc]) return portal();
    const kind = entranceKind(npc);
    if (kind != "blink") return { kind };
    if ((enemySprites[npc] || {}).rare) return portal();
    return { kind: looksRandom() < 0.5 ? "blink" : "fade" };
}

// A random one of the four ground effects for this enemy's size: { src, row, from, up }.
function groundSet(npc) {
    const img = imageNow(art(npc)), boss = img && img.naturalWidth > 40;
    const letter = "abcd"[Math.floor(looksRandom() * 4) % 4];
    return Object.assign({ src: art(boss ? `fx_ground_boss_${letter}` : `fx_ground_${letter}`), row: GROUND_ROW[boss ? 64 : 32] }, GROUND[letter]);
}

const easeOut = (t) => 1 - (1 - t) * (1 - t);
const clamp01 = (x) => Math.max(0, Math.min(1, x));

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
        p.riseFrame = k;                                                    // the ground effect's frame; draw() raises the sprite
        p.clip = true;
    } else if (kind == "jump") {
        if (t < 0.8) {
            const u = t / 0.8;
            p.dx = OFF_RIGHT * (1 - u);
            p.dy = -4 * 18 * u * (1 - u);                                   // the arc
            p.sy = 1.06; p.sx = 0.95;                                      // stretched in the air
        } else { p.sy = 0.82; p.sx = 1.14; p.dust = 1; }                   // lands, squashed
    } else if (kind == "slam") {                                           // a heavy leap, a hard landing
        if (t < 0.7) {
            const u = t / 0.7;
            p.dx = OFF_RIGHT * (1 - u);
            p.dy = -4 * 30 * u * (1 - u);
            p.sy = 1.08; p.sx = 0.94;
        } else {
            const v = clamp01((t - 0.7) / 0.3);                            // squashed, rising back, shaking
            p.sy = 0.72 + 0.28 * v; p.sx = 1.22 - 0.22 * v;
            p.dx = (k % 2 ? 1 : -1) * 1.5 * (1 - v);
            p.dust = Math.min(2, Math.floor(v * 3));
            p.landed = v;
        }
    } else if (kind == "burrow") {                                         // a bump of dirt, then it bursts out
        if (t < 0.45) {
            const u = t / 0.45;
            p.alpha = 0;
            p.mound = easeOut(u);
            p.moundShake = u > 0.5 ? (k % 2 ? 1 : -1) * (u - 0.5) * 2 : 0;   // trembles before it breaks
        } else {
            const v = clamp01((t - 0.45) / 0.5);
            p.dy = 34 * (1 - easeOut(v));
            p.dx = v < 1 ? Math.sin(k * 2.2) * 0.8 : 0;
            p.clip = true;
            p.mound = 1 - v;                                               // flattens as it comes out
            p.clods = v;
            p.dust = Math.min(2, Math.floor(v * 3));
        }
    } else if (kind == "slither") {                                        // glides in on a sideways wave
        p.dx = OFF_RIGHT * (1 - t) + (t < 1 ? Math.sin(k * 1.3) * 1.5 : 0);
        p.sx = t < 1 ? 1 + 0.05 * Math.sin(k * 1.3) : 1;
    } else if (kind == "blink") {
        p.alpha = k % 2 ? 0.25 + 0.75 * t : t;                             // flickers in
        p.sx = Math.max(0.05, easeOut(t));                                 // opens from a line
        p.sy = 1 + 0.25 * (1 - t);
    } else if (kind == "fade") {                                           // comes together out of thin air
        p.alpha = t * t;
        p.ghost = 10 * (1 - easeOut(t));                                   // two faint copies close in
        p.dy = -3 * (1 - t);
    } else if (kind == "portal") {                                         // opens, it steps out, closes
        p.portal = t < 0.3 ? easeOut(t / 0.3) : t > 0.78 ? clamp01(1 - (t - 0.78) / 0.2) : 1;
        const u = clamp01((t - 0.25) / 0.45);
        p.alpha = u;
        p.sx = p.sy = 0.5 + 0.5 * easeOut(u);
        p.portalClip = u < 1;                                              // still inside the portal
    } else if (kind == "archPortal") {                                     // fades in inside the arch
        p.portal = t < 0.3 ? easeOut(t / 0.3) : t > 0.85 ? clamp01(1 - (t - 0.85) / 0.15) : 1;
        p.alpha = clamp01((t - 0.22) / 0.5);                               // during the loop frames
        p.bossScale = 1;
    } else if (kind == "bossPortal") {                                     // grows out of the portal's centre
        p.portal = t < 0.3 ? easeOut(t / 0.3) : t > 0.85 ? clamp01(1 - (t - 0.85) / 0.15) : 1;
        const u = clamp01((t - 0.23) / 0.6);                               // strip loop frames, done before the close
        p.alpha = Math.min(1, u * 1.5);
        p.grow = Math.max(0.02, easeOut(u));
        p.bossScale = BOSS_PORTAL_SCALE;
    }
    return p;
}

// The enemy now on the scene arrives; done runs when it stands in its place.
export function playEntrance(done) {
    const npc = state.npc;
    if (run.simulation || !document.hasFocus() || !npc) return done && done();
    const hydra = /^(mother|hydskon|icedra)\d+$/.exec(npc);
    if (hydra) return playHydraEnter(npc, hydra[1], done);
    if (STRIP_ENTER[npc] && !run.forceEntrance) return playStripEnter(npc, done);
    const { kind, portal } = arrivalKind(npc), total = FRAMES[kind];
    cancelNPCDraw();                                // the sprite must not pop up in its place mid-arrival
    imageNow(art(`${npc}`));
    if (portal) imageNow(art(portal));
    imageNow(art(`fx_dust`));
    const ground = kind == "rise" ? groundSet(npc) : undefined;
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
        const img = imageNow(art(`${npc}`));
        if (!img || (ground && !imageNow(ground.src))) {   // not loaded yet: wait for it (2 s at most)
            pixelContext(npcCanvas).clearRect(0, 0, npcCanvas.width, npcCanvas.height);
            if (++waited > 40) k = total + 1;
            return;
        }
        draw(npc, img, Object.assign(pose(kind, Math.min(1, k / (total - 2)), k), { strip: portal, spin: k, fire: FIERY.has(npc), ground }));
        k++;
    };
    step();                                         // at once: it never shows in its place first
    loop.every("animNPC", step, STEP_MS);
}

// The one on the scene leaves: the mages' fade-in played backwards (the author: the healer
// vanishes like a mage comes in, not with an overlay). The game waits while it fades.
export function playExit(done) {
    const npc = state.npc;
    const img = npc && imageNow(art(`${npc}`));
    if (run.simulation || !document.hasFocus() || !img) {
        if (npc) clearNPC();
        return done && done();
    }
    cancelNPCDraw();
    loop.freezeGame();
    const total = FRAMES.fade;
    let k = 0;
    const finish = () => {
        loop.stop("animNPC");
        loop.thawGame();
        if (state.npc == npc) clearNPC();
        if (done) done();
    };
    const step = () => {
        if (state.npc != npc || k > total) return finish();
        draw(npc, img, pose("fade", 1 - Math.min(1, k / (total - 2)), k));
        k++;
    };
    step();
    loop.every("animNPC", step, STEP_MS);
}

// The wizard has fallen: the enemy that beat him leaves its own way in, played backwards (the
// author: like the entrances, done with code). npc is the one that was on the scene: it stays
// there (state.npc) while its last attack, its scene spell and the effect on the wizard play out
// (the author: it left before its last spell was cast), then it leaves and the scene is empty.
// Another one coming in stops it. The game waits meanwhile.
const LEAVE = { blink: "fade", slam: "jump", burrow: "rise" };
const TURNS = new Set(["walk", "jump", "fly", "slither"]);                 // turn their back to go
const LEAVE_WAIT_MS = 8000;                                                // waits for the blow 8 s at most
export function playLeave(npc, done) {
    const gone = () => state.npc && state.npc != npc;                       // someone else is on the scene now
    if (!npc || run.simulation || !document.hasFocus()) {
        if (!gone()) clearNPC();
        return done && done();
    }
    if (!state.npc) state.npc = npc;                // its attack goes on to the end
    loop.freezeGame();
    const since = performance.now();
    const busy = () => loop.isRunning("animNPC") || loop.isRunning("animScene") || performance.now() < (run.wizardSpellUntil || 0);
    loop.every("leaveNPC", () => {
        if (gone() || !busy() || performance.now() - since > LEAVE_WAIT_MS) {
            loop.stop("leaveNPC");
            leave(npc, gone, done);
        }
    }, STEP_MS);
}

function leave(npc, gone, done) {
    const hydra = /^(mother|hydskon|icedra)\d+$/.exec(npc);
    if (hydra) return leaveHydra(npc, hydra[1], gone, done);
    // the portal bosses go back through their portal: it opens, they shrink (or fade, King Skeleton)
    // into it, it closes
    const strip = BOSS_PORTAL[npc];
    const kind = strip ? (ARCH.has(npc) ? "archPortal" : "bossPortal") : LEAVE[entranceKind(npc)] || entranceKind(npc), total = FRAMES[kind];
    if (strip) imageNow(art(strip));
    const ground = kind == "rise" ? groundSet(npc) : undefined;
    cancelNPCDraw();
    npcCanvas.width = npcCanvas.offsetWidth;
    npcCanvas.height = npcCanvas.offsetHeight;
    let k = 0, waited = 0;
    const finish = () => {
        loop.stop("animNPC");
        loop.thawGame();
        if (!gone()) clearNPC();
        if (done) done();
    };
    const step = () => {
        if (gone() || k > total) return finish();
        const img = imageNow(art(`${npc}`));
        if (!img || (ground && !imageNow(ground.src))) { if (++waited > 40) k = total + 1; return; }
        const back = kind == "rise" ? total - 2 - k : k;     // the ground effect plays backwards
        draw(npc, img, Object.assign(pose(kind, 1 - Math.min(1, k / (total - 2)), back), { flip: TURNS.has(kind), strip, spin: k, ground }));
        k++;
    };
    step();
    loop.every("animNPC", step, STEP_MS);
}

function draw(npc, img, p) {
    const [bx, by, bw, bh] = npcBox(npc);
    const scene = ui.charWidth / 32;
    let w = bw * p.sx, h = bh * p.sy;
    let x = bx + p.dx * scene + (bw - w) / 2, y = by + p.dy * scene + bh - h;
    if (p.riseFrame !== undefined && p.ground) {    // out of the ground effect: hidden, then up by its frames
        const g = p.ground, f = p.riseFrame, u = clamp01((f - g.from) / (g.up - g.from));
        if (f < g.from) p.alpha = 0;
        y += bh * 1.05 * (1 - easeOut(u));
        x += f < g.up && f >= g.from ? Math.sin(f * 2.2) * 0.8 * scene : 0;     // pushing out
    }
    const ctx = pixelContext(npcCanvas);
    ctx.clearRect(0, 0, npcCanvas.width, npcCanvas.height);
    let cx = bx + bw / 2, cy = by + bh * 0.55, rx = bw * 0.42, ry = bh * 0.56;
    const strip = p.strip && imageNow(art(p.strip));
    if (strip) {                                    // the artist's strip, feet on the ground line
        const fw = strip.naturalWidth / STRIP_FRAMES, fh = strip.naturalHeight;
        const px = bw / img.naturalWidth * (p.bossScale ? p.bossScale * BOSS_STRIP_WIDTH / fw : 1);
        const sw = fw * px, sh = fh * px;
        drawFrame(ctx, strip, stripFrame(p.spin) * fw, 0, fw, fh, bx + (bw - sw) / 2, by + bh + px - sh, sw, sh);
        rx = sw * 0.4; ry = sh * 0.42; cy = by + bh - ry;      // its open oval
    } else if (p.portal > 0) drawPortal(ctx, cx, cy, rx * p.portal, ry, scene, PORTALS[p.strip] || PORTALS.fx_portal_a, p.spin);
    if (p.grow) {                                   // from the portal's centre to its own place
        const gw = bw * p.grow, gh = bh * p.grow;
        const gx = cx + (bx + bw / 2 - cx) * p.grow, gy = cy + (by + bh / 2 - cy) * p.grow;
        x = gx - gw / 2; y = gy - gh / 2; w = gw; h = gh;
    }
    ctx.save();
    ctx.globalAlpha = p.alpha;
    if (p.clip) {                                   // only what is above the ground shows
        ctx.beginPath();
        ctx.rect(0, 0, npcCanvas.width, by + bh);
        ctx.clip();
    }
    if (p.portalClip) {                             // only what is through the portal shows
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.max(0.1, rx * p.portal), ry, 0, 0, Math.PI * 2);
        ctx.clip();
    }
    if (p.flip) {                                   // turned around, going away
        ctx.translate(x * 2 + w, 0);
        ctx.scale(-1, 1);
    }
    ctx.drawImage(img, x, y, w, h);
    if (p.ghost) {
        ctx.globalAlpha = p.alpha * 0.35;
        ctx.drawImage(img, x - p.ghost * scene, y, w, h);
        ctx.drawImage(img, x + p.ghost * scene, y, w, h);
    }
    ctx.restore();
    if (p.mound > 0 || p.clods > 0) drawDirt(ctx, bx + bw / 2 + (p.moundShake || 0) * scene, by + bh, bw / img.naturalWidth, p);
    if (p.fire && p.landed !== undefined) drawFire(ctx, bx + bw / 2, by + bh, bw, scene, p.landed);
    const fx = p.ground && p.riseFrame >= 0 && p.riseFrame < GROUND_FRAMES && imageNow(p.ground.src);
    if (fx) {                                       // the hole in front of the feet, 1 art px per sprite px
        const a = bw / img.naturalWidth, fw = fx.naturalWidth / GROUND_FRAMES, fh = fx.naturalHeight;
        drawFrame(ctx, fx, p.riseFrame * fw, 0, fw, fh, bx + (bw - fw * a) / 2, by + bh - p.ground.row * a, fw * a, fh * a);
    }
    const dust = imageNow(art(`fx_dust`));
    if (dust && p.dust >= 0) {                      // dust at the feet (24 x 8, 3 frames)
        const dw = 24 * scene * (bw / ui.charWidth), dh = 8 * scene * (bw / ui.charWidth);
        drawFrame(ctx, dust, p.dust * 24, 0, 24, 8, bx + (bw - dw) / 2, by + bh - dh, dw, dh);
    }
}

// A burst of fire at the feet on landing (v 0 to 1): flames flare out and up, embers rise and fade,
// yellow to orange to red, square pixels like the art. Placed by a fixed pattern, not at random.
const FIRE = ["#fff1a8", "#ffd23f", "#f7931e", "#e8411c", "#a51c1c"];
function drawFire(ctx, cx, ground, bw, scene, v) {
    const px = Math.max(1, Math.round(scene * 2));
    ctx.save();
    for (let i = 0; i < 44; i++) {
        const side = i % 2 ? 1 : -1, spread = 0.1 + ((i * 37) % 23) / 23 * 0.65;      // how far out
        const lift = ((i * 53) % 17) / 17;                                              // how high
        const ember = i >= 30;                                                          // the last ones fly up
        const x = cx + side * spread * bw * (0.4 + 0.6 * v);
        const y = ground - (ember ? lift * bw * 0.8 * v + bw * 0.08 : lift * bw * 0.45 * (1 - 0.6 * v));
        ctx.globalAlpha = Math.max(0, 1 - v * (ember ? 0.7 : 0.85));
        ctx.fillStyle = FIRE[Math.min(FIRE.length - 1, Math.floor(lift * 2.5 + v * 2))];
        const size = ember ? px : px * (v < 0.6 ? 3 : 2);
        ctx.fillRect(Math.round(x - size / 2), Math.round(y - size), size, size);
    }
    ctx.restore();
}

// The bump of dirt (burrow): a mound of soil swelling at the feet, in art pixels (a = canvas px per
// sprite px), darker at the base with lighter crumbs on top; then clods thrown out in arcs as the
// creature bursts through. Fixed patterns, no randomness.
const DIRT = ["#3e2612", "#5a3a1e", "#7a4f2a", "#9b6a3c", "#c08a52"];
function drawDirt(ctx, cx, ground, a, p) {
    ctx.save();
    const m = p.mound || 0, W = 28, H = Math.round(20 * m);          // half-width and height in art px
    for (let r = 0; r < H; r++) {
        const half = Math.round(W * (0.55 + 0.45 * m) * Math.sqrt(1 - Math.pow(r / Math.max(1, H), 2)));
        for (let x = -half; x < half; x++) {
            const edge = half - Math.abs(x) <= 1 || r == H - 1;
            const speck = (x * 7 + r * 13) % 11 == 0;
            const shade = edge ? 1 : speck ? 4 : r > H * 0.6 ? 3 : 2;
            ctx.fillStyle = DIRT[shade];
            ctx.fillRect(Math.round(cx + x * a), Math.round(ground - (r + 1) * a), Math.ceil(a), Math.ceil(a));
        }
    }
    const v = p.clods || 0;
    if (v > 0) {
        for (let i = 0; i < 18; i++) {
            const side = i % 2 ? 1 : -1, reach = 10 + ((i * 29) % 13) * 2.2, rise = 8 + ((i * 41) % 11) * 2;
            const x = cx + side * reach * v * a, y = ground - (Math.sin(Math.PI * Math.min(1, v * 1.1)) * rise + 2) * a;
            const size = (i % 3 == 0 ? 4 : 3) * a;
            ctx.globalAlpha = Math.max(0, 1 - v * v);
            ctx.fillStyle = DIRT[1 + (i % 4)];
            ctx.fillRect(Math.round(x - size / 2), Math.round(y - size / 2), Math.ceil(size), Math.ceil(size));
        }
    }
    ctx.restore();
}

// The portal (stand-in until the artist's strip): a dark oval with three dashed rings turning
// opposite ways, rx wide (0 when shut).
function drawPortal(ctx, cx, cy, rx, ry, scene, colors, spin) {
    if (rx < 0.5) return;
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(18, 6, 32, 0.85)";
    ctx.fill();
    ctx.lineWidth = Math.max(1, scene * 1.5);
    colors.forEach((color, i) => {
        const shrink = 1 - i * 0.48 / colors.length;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx * shrink, ry * shrink, 0, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.setLineDash([scene * (5 - i), scene * 3]);
        ctx.lineDashOffset = (i % 2 ? -1 : 1) * spin * scene * 2;
        ctx.stroke();
    });
    ctx.restore();
}

// A boss with its own entrance strip (STRIP_ENTER): the frames are drawn in its place, feet on the
// ground line, then its sprite takes over. If the strip doesn't load, it rises out of the ground.
function playStripEnter(npc, done) {
    const { src, frame } = STRIP_ENTER[npc], file = art(src);
    cancelNPCDraw();
    imageNow(file);
    imageNow(art(npc));
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
        const strip = imageNow(file), img = imageNow(art(npc));
        if (!strip || !img) {                       // not loaded yet: wait (2 s at most), then rise instead
            pixelContext(npcCanvas).clearRect(0, 0, npcCanvas.width, npcCanvas.height);
            if (++waited > 20) { loop.stop("animNPC"); loop.thawGame(); run.forceEntrance = "rise"; playEntrance(done); }
            return;
        }
        const frames = Math.round(strip.naturalWidth / frame);
        if (state.npc != npc || k >= frames) return finish();
        const [bx, by, bw, bh] = npcBox(npc);
        const size = frame * bw / img.naturalWidth;
        const ctx = pixelContext(npcCanvas);
        ctx.clearRect(0, 0, npcCanvas.width, npcCanvas.height);
        drawFrame(ctx, strip, k * frame, 0, frame, strip.naturalHeight, bx + (bw - size) / 2, by + bh - size, size, size);
        k++;
    };
    step();
    loop.every("animNPC", step, STRIP_ENTER_MS);
}

// A hydra (any head count) arrives under its zone's effect: the strip is centred on the hydra's
// feet, bottom-aligned, the hydra hidden until the reveal frame, then the last frame fades out.
function playHydraEnter(npc, hydra, done) {
    const { effect, reveal, sound, volume } = HYDRA_ENTER[hydra], src = art(`anim_hydra_${effect}_enter`), body = art(npc);
    cancelNPCDraw();
    playSound(sound, volume);
    imageNow(src);
    imageNow(body);
    loop.freezeGame();
    npcCanvas.width = npcCanvas.offsetWidth;
    npcCanvas.height = npcCanvas.offsetHeight;
    let k = 0, waited = 0;
    const finish = () => {
        loop.stop("animNPC");
        loop.thawGame();
        if (state.npc == npc) loadNPC(npc);                // the idle weaving (already running) takes over
        if (done) done();
    };
    const step = () => {
        const strip = imageNow(src), img = imageNow(body);
        if (!strip || !img) {                       // not loaded yet: wait for them (2 s at most)
            pixelContext(npcCanvas).clearRect(0, 0, npcCanvas.width, npcCanvas.height);
            if (++waited > 17) finish();
            return;
        }
        const frames = strip.naturalWidth / HYDRA_FRAME;
        if (state.npc != npc || k >= frames + HYDRA_FADE) return finish();
        const [bx, by, bw, bh] = npcBox(npc);
        const px = bw / img.naturalWidth, size = HYDRA_FRAME * px;     // canvas px per sprite px
        const ctx = pixelContext(npcCanvas);
        ctx.clearRect(0, 0, npcCanvas.width, npcCanvas.height);
        if (k >= reveal) ctx.drawImage(img, bx, by, bw, bh);
        ctx.save();
        if (k >= frames) ctx.globalAlpha = 1 - (k - frames + 1) / (HYDRA_FADE + 1);
        drawFrame(ctx, strip, Math.min(k, frames - 1) * HYDRA_FRAME, 0, HYDRA_FRAME, HYDRA_FRAME,
            bx + (bw - size) / 2, by + bh - size, size, size);
        ctx.restore();
        k++;
    };
    step();
    loop.every("animNPC", step, HYDRA_ENTER_MS);
}

// A hydra leaves: it sinks behind the ground line while the artist's strip (no hydra drawn) plays over
// it, out of sight by frame HYDRA_LEAVE_GONE. No sound.
function leaveHydra(npc, hydra, gone, done) {
    const src = art(`anim_hydra_${HYDRA_ENTER[hydra].effect}_leave`), body = art(npc);
    cancelNPCDraw();
    imageNow(src);
    imageNow(body);
    npcCanvas.width = npcCanvas.offsetWidth;
    npcCanvas.height = npcCanvas.offsetHeight;
    let k = 0, waited = 0;
    const finish = () => {
        loop.stop("animNPC");
        loop.thawGame();
        if (!gone()) clearNPC();
        if (done) done();
    };
    const step = () => {
        const strip = imageNow(src), img = imageNow(body);
        if (!strip || !img) {
            if (++waited > 17) finish();
            return;
        }
        const frames = strip.naturalWidth / HYDRA_FRAME;
        if (gone() || k >= frames) return finish();
        const [bx, by, bw, bh] = npcBox(npc);
        const px = bw / img.naturalWidth, size = HYDRA_FRAME * px;
        const ctx = pixelContext(npcCanvas);
        ctx.clearRect(0, 0, npcCanvas.width, npcCanvas.height);
        if (k < HYDRA_LEAVE_GONE) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, 0, npcCanvas.width, by + bh);          // only what is above the ground shows
            ctx.clip();
            ctx.drawImage(img, bx, by + bh * clamp01(k / (HYDRA_LEAVE_GONE - 0.5)), bw, bh);
            ctx.restore();
        }
        drawFrame(ctx, strip, k * HYDRA_FRAME, 0, HYDRA_FRAME, HYDRA_FRAME, bx + (bw - size) / 2, by + bh - size, size, size);
        k++;
    };
    step();
    loop.every("animNPC", step, HYDRA_ENTER_MS);
}
