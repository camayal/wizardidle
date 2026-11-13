// Wizard Idle v2 - boss attacks: each boss's own animations, scene spells, the earthquake shake,
// and Medusa's gaze turning the wizard to stone.
//
// Art and timing by the artist, approved by the author (2026-11-13); the data is in
// src/data/bossAttacks.js. A boss attack plays its strip where the boss stands (bosses that
// charge or roll travel toward the wizard along their path); a scene spell plays over the whole
// scene, above everyone, from the frame the data says. The game's own spell effect lands on
// the wizard when the blow does. Hydras weave their heads and strike or cast (end of file).

import { ui, run, fight } from '../runtime.js';
import { state } from '../state.js';
import * as loop from '../loop.js';
import { bossAttacks, sceneSpells } from '../data/bossAttacks.js';
import { imageNow, loadNPC, looksRandom, npcBox, npcCanvas, pixelContext, playWizardAnim } from './render.js';
import { el } from './dom.js';

const FW = 104, FH = 80;            // a boss frame; the 64 x 64 boss rests at (36, 12) in it
const SHAKE = [0, 1, -1, 2, -2, 2, -2, 1, -1, 2, -2, 1, -1, 1, 0, 0];     // the earthquake, px per frame
const SHAKEN = ["esceneCanvas", "pjCanvas", "npcCanvas", "spellCanvas"];

// The canvas for scene spells: over the whole scene, above the characters.
let sceneCanvas;
function sceneLayer() {
    if (!sceneCanvas) {
        sceneCanvas = document.createElement("canvas");
        sceneCanvas.id = "sceneFxCanvas";
        sceneCanvas.style.position = "absolute";
        sceneCanvas.style.pointerEvents = "none";
        el("spellCanvas").after(sceneCanvas);
    }
    const scene = el("esceneCanvas").style;
    Object.assign(sceneCanvas.style, { left: scene.left, top: scene.top, width: scene.width, height: scene.height,
        zIndex: (parseInt(getComputedStyle(el("spellCanvas")).zIndex) || 0) + 1 });
    sceneCanvas.width = el("esceneCanvas").offsetWidth;
    sceneCanvas.height = el("esceneCanvas").offsetHeight;
    return sceneCanvas;
}

function shakeScene(px) {
    for (const id of SHAKEN) el(id).style.transform = px ? `translateX(${px * ui.charWidth / 32}px)` : "";
    if (sceneCanvas) sceneCanvas.style.transform = px ? `translateX(${px * ui.charWidth / 32}px)` : "";
}

// Medusa's gaze: the wizard turns to stone, stays a while, then breaks free.
function petrify() {
    ui.petrified = true;
    playWizardAnim("petrify");      // he breaks free when the game says (src/bossEffects.js)
}

// Does this boss have its own attacks?
export function hasBossAttacks(boss) {
    return !!bossAttacks[boss];
}

// Play the boss's attack (chosen by the game, src/bossEffects.js); stone says whether this gaze
// turns him to stone. onHit runs once, when the blow lands (at once if nothing is drawn).
export function playBossAttack(boss, chosen, stone, onHit) {
    let hit = false;
    const land = () => { if (!hit) { hit = true; onHit(); } };
    const attacks = bossAttacks[boss];
    if (run.simulation || !document.hasFocus() || !attacks || state.npc != boss) {
        if (stone && !run.simulation) ui.petrified = true;
        return land();
    }
    const attack = chosen || attacks[Math.floor(looksRandom() * attacks.length)];
    const strip = `img/anim_${boss}_${attack.id}.png`, scene = attack.scene ? `img/scene_${attack.scene}.png` : null;
    imageNow(strip);
    if (scene) imageNow(scene);
    const sceneFrames = attack.scene ? sceneSpells[attack.scene] : 0;
    const total = Math.max(attack.frames, attack.scene ? attack.sceneAt + sceneFrames : 0);
    // the blow lands when the scene spell reaches the wizard, at the end of a charge, or late in the swing
    const hitAt = attack.scene ? attack.sceneAt + Math.floor(sceneFrames / 2)
        : attack.path ? attack.path.indexOf(Math.min(...attack.path)) : Math.floor(attack.frames * 0.6);
    const [bx, by, bw] = npcBox(boss);
    const k = bw / 64;                                  // screen px per art px
    const layer = scene ? sceneLayer() : null;
    npcCanvas.width = npcCanvas.offsetWidth;
    npcCanvas.height = npcCanvas.offsetHeight;
    let i = 0;
    const next = () => {
        if (i >= total || state.npc != boss) {           // done, or the boss is gone
            loop.stop("animNPC");
            shakeScene(0);
            if (layer) layer.getContext("2d").clearRect(0, 0, layer.width, layer.height);
            land();
            if (state.npc == boss) loadNPC(boss);
            return;
        }
        const img = imageNow(strip);
        if (img) {
            const f = i < attack.frames ? i : 0;
            const dx = attack.path && i < attack.frames ? attack.path[f] * ui.charWidth / 32 : 0;
            const ctx = pixelContext(npcCanvas);
            ctx.clearRect(0, 0, npcCanvas.width, npcCanvas.height);
            ctx.drawImage(img, f * FW, 0, FW, FH, bx - 36 * k + dx, by - 12 * k, FW * k, FH * k);
        }
        if (layer) {
            const ctx = pixelContext(layer), s = i - attack.sceneAt, spell = imageNow(scene);
            ctx.clearRect(0, 0, layer.width, layer.height);
            if (spell && s >= 0 && s < sceneFrames) ctx.drawImage(spell, s * 256, 0, 256, 64, 0, 0, layer.width, layer.height);
            if (attack.scene == "earthquake") shakeScene(s >= 0 && s < SHAKE.length ? SHAKE[s] : 0);
        }
        if (stone && attack.wizard && attack.wizard[0] == "petrify" && i == attack.wizard[1] && !fight.pjDead) petrify();
        if (i == hitAt) land();
        i++;
    };
    next();
    loop.every("animNPC", next, 100);
}

// ------------------------------------------------------------------ hydras
// Art by the artist, approved by the author: while a hydra is on screen its heads weave
// (img/anim_<hydra>_idle<N>.png, 8 frames, N = heads); it attacks with a strike (the front heads
// bite) or a cast (the heads rear up glowing, then a scene spell from frame 5).
// Frames are the sprite plus a margin, the sprite resting at (12, 6).

// Which scene spell each hydra spell becomes (from the zones' hidrasSpells).
const HYDRA_SCENES = {
    mother: [["RainGreen", "poison_rain"], ["EarthSpike", "earth_spikes"],
        ["RingGreen", "poison_cloud"], ["SparkGreen", "poison_cloud"], ["ChispasGreen", "poison_cloud"], ["Poisson", "poison_cloud"], ["SpiralGreen", "poison_cloud"]],
    hydskon: [["Maldicion", "curse"], ["RainRed", "fire_rain"], ["RingPale", "fire_tornado"], ["SpiralRed", "fire_tornado"]],
    icedra: [["ChispasBlue", "frost_breath"], ["SparkWhite", "frost_breath"], ["WhiteSpin", "frost_breath"],
        ["RainBlue", "blizzard"], ["RingBlue", "blizzard"], ["SpiralBlue", "blizzard"], ["IceSpike", "ice_spikes"]],
};
const HYDRA_SPRITE_H = { mother: 96, hydskon: 64, icedra: 64 };
const CAST_SCENE_AT = 5;

function hydraParts(npc) {
    const m = /^(mother|hydskon|icedra)(\d+)$/.exec(npc || "");
    return m ? { hydra: m[1], heads: Number(m[2]) } : null;
}

// Draw one frame of a hydra strip where the hydra stands.
function drawHydraFrame(npc, strip, index) {
    const parts = hydraParts(npc), img = imageNow(strip);
    if (!parts || !img) return;
    const frameH = HYDRA_SPRITE_H[parts.hydra] + 8, frameW = 84;
    const [bx, by, bw, bh] = npcBox(npc);
    const kx = bw / 64, ky = bh / HYDRA_SPRITE_H[parts.hydra];
    const ctx = pixelContext(npcCanvas);
    ctx.clearRect(0, 0, npcCanvas.width, npcCanvas.height);
    ctx.drawImage(img, index * frameW, 0, frameW, frameH, bx - 12 * kx, by - 6 * ky, frameW * kx, frameH * ky);
}

// The heads weave while the hydra is on screen; other animations (attacks, a growing head)
// draw instead while they play. It stops by itself when the hydra is gone.
export function startHydraIdle() {
    if (run.simulation || !hydraParts(state.npc)) return;
    let k = 0;
    loop.every("idleNPC", () => {
        const parts = hydraParts(state.npc);
        if (!parts) return loop.stop("idleNPC");
        if (loop.isRunning("animNPC") || !document.hasFocus()) return;
        drawHydraFrame(state.npc, `img/anim_${parts.hydra}_idle${parts.heads}.png`, k++ % 8);
    }, 100);
}

// A hydra attacks: a cast with its scene spell (when the spell has one, half of the time, for
// the looks) or a strike; onHit runs once, when the blow lands.
export function playHydraAttack(spellId, onHit) {
    let hit = false;
    const land = () => { if (!hit) { hit = true; onHit(); } };
    const parts = hydraParts(state.npc);
    if (run.simulation || !document.hasFocus() || !parts) return land();
    const npc = state.npc, { hydra, heads } = parts;
    const match = (HYDRA_SCENES[hydra] || []).find(([part]) => spellId.includes(part));
    const cast = match && looksRandom() < 0.5;
    const strip = `img/anim_${hydra}_${cast ? "cast" : "strike"}${heads}.png`;
    const scene = cast ? `img/scene_${match[1]}.png` : null, sceneFrames = cast ? sceneSpells[match[1]] : 0;
    imageNow(strip);
    if (scene) imageNow(scene);
    const layer = scene ? sceneLayer() : null;
    npcCanvas.width = npcCanvas.offsetWidth;
    npcCanvas.height = npcCanvas.offsetHeight;
    let i = 0, frames = 0;
    const next = () => {
        const img = imageNow(strip);
        if (img && !frames) frames = Math.round(img.naturalWidth / 84);
        const total = cast ? Math.max(frames || 9, CAST_SCENE_AT + sceneFrames) : frames || 8;
        const hitAt = cast ? CAST_SCENE_AT + Math.floor(sceneFrames / 2) : Math.floor(total * 0.6);
        if (i >= total || state.npc != npc) {
            loop.stop("animNPC");
            if (layer) layer.getContext("2d").clearRect(0, 0, layer.width, layer.height);
            land();
            return;                                 // the idle weaving takes over again
        }
        if (img) drawHydraFrame(npc, strip, Math.min(i, (frames || 1) - 1));
        if (layer) {
            const ctx = pixelContext(layer), s = i - CAST_SCENE_AT, spell = imageNow(scene);
            ctx.clearRect(0, 0, layer.width, layer.height);
            if (spell && s >= 0 && s < sceneFrames) ctx.drawImage(spell, s * 256, 0, 256, 64, 0, 0, layer.width, layer.height);
        }
        if (i == hitAt) land();
        i++;
    };
    next();
    loop.every("animNPC", next, 100);
}
