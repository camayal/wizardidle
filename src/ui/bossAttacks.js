// Wizard Idle v2 - boss attacks: each boss's own animations, scene spells, the earthquake shake,
// and Medusa's gaze turning the wizard to stone.
//
// Art and timing by the artist, approved by the author (2026-11-13); the data is in
// src/data/bossAttacks.js. A boss attack plays its strip where the boss stands (bosses that
// charge or roll travel toward the wizard along their path); a scene spell plays over the whole
// scene, above everyone, from the frame the data says. The game's own spell effect lands on
// the wizard when the blow does. Hydras keep their hop for now.

import { ui, run, fight } from '../runtime.js';
import { state } from '../state.js';
import * as loop from '../loop.js';
import { bossAttacks, sceneSpells } from '../data/bossAttacks.js';
import { imageNow, loadNPC, looksRandom, npcBox, npcCanvas, pixelContext, playWizardAnim } from './render.js';
import { el } from './dom.js';

const FW = 104, FH = 80;            // a boss frame; the 64 x 64 boss rests at (36, 12) in it
const SHAKE = [0, 1, -1, 2, -2, 2, -2, 1, -1, 2, -2, 1, -1, 1, 0, 0];     // the earthquake, px per frame
const SHAKEN = ["esceneCanvas", "pjCanvas", "npcCanvas", "spellCanvas"];
const STONE_MS = 2500;              // how long the wizard stays stone (to be decided by the planner)

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
    playWizardAnim("petrify");
    loop.every("stone", () => {
        loop.stop("stone");
        playWizardAnim("unpetrify");
    }, STONE_MS);
}

// Does this boss have its own attacks?
export function hasBossAttacks(boss) {
    return !!bossAttacks[boss];
}

// Play one of the boss's attacks; onHit runs once, when the blow lands (at once if nothing is
// drawn). The attack is picked at random for the looks only (not the game's Math.random).
export function playBossAttack(boss, onHit) {
    let hit = false;
    const land = () => { if (!hit) { hit = true; onHit(); } };
    const attacks = bossAttacks[boss];
    if (run.simulation || !document.hasFocus() || !attacks || state.npc != boss) return land();
    const attack = attacks[Math.floor(looksRandom() * attacks.length)];
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
        if (attack.wizard && attack.wizard[0] == "petrify" && i == attack.wizard[1] && !fight.pjDead) petrify();
        if (i == hitAt) land();
        i++;
    };
    next();
    loop.every("animNPC", next, 100);
}

