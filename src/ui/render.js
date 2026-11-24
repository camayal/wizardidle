// Wizard Idle v2 - Drawing the game: the heading (name, level, XP bar, HP, gold, faith), the console, the scene
// background, the wizard and the enemy, and their idle animations.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { roundNumbertoLetter } from '../utils.js';
import { state } from '../state.js';
import { zones } from '../data/zones.js';
import { fight, run, ui } from '../runtime.js';
import * as loop from '../loop.js';
import { setLiveTime } from '../game.js';
import { MAXLINESINCONSOLE } from '../config.js';
import { logro } from '../achievements.js';
import { localizarBocadillo } from './scrolls.js';
import { el } from './dom.js';
import { stats } from '../stats.js';
import { spells } from '../data/spells.js';
import { art } from '../media.js';
import { overlays } from '../data/overlays.js';
import { connectorSceneInfo } from '../data/connectors.js';
import { markup } from './text.js';
import { DICE_HOUSES, WIZARD_AT_TABLE, showDiceTable } from './diceTable.js';

////////////////////////////////////////////////////////////////////////////////////
// ██████╗ ███████╗███████╗██╗███╗   ██╗██╗████████╗██╗ ██████╗ ███╗   ██╗███████╗//
// ██╔══██╗██╔════╝██╔════╝██║████╗  ██║██║╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝//
// ██║  ██║█████╗  █████╗  ██║██╔██╗ ██║██║   ██║   ██║██║   ██║██╔██╗ ██║███████╗//
// ██║  ██║██╔══╝  ██╔══╝  ██║██║╚██╗██║██║   ██║   ██║██║   ██║██║╚██╗██║╚════██║//
// ██████╔╝███████╗██║     ██║██║ ╚████║██║   ██║   ██║╚██████╔╝██║ ╚████║███████║//
// ╚═════╝ ╚══════╝╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝//
////////////////////////////////////////////////////////////////////////////////////
//Author:  Carlos Alonso Maya Lastra
const esceneCanvas = el("esceneCanvas");
const pjCanvas = el("pjCanvas");
const npcCanvas = el("npcCanvas");


// Refresh the heading: name, level, XP bar, HP, gold and faith.
function updateHeading() {
    if (!run.simulation) showHeading();
    if (state.player.faith < -10000){logro.set(logro.logro_hategod)}
    stats.max("faith.highest", Math.round(state.player.faith));
    stats.max("gold.highest", Math.round(state.player.gold));
    //calcule % of xp bar
    ui.xpPercent = 1 - (state.player.xpNext - state.player.xp) / (state.player.xpNext - state.player.xpPast)
};

// The heading on screen (skipped in a simulation, where nobody looks).
function showHeading() {
    el('pjName').innerText = state.player.name;
    el('lvl').innerText = `Lv. ${state.player.lvl}`;
    const span = state.player.xpNext - state.player.xpPast;
    const xpShare = span > 0 ? Math.min(1, Math.max(0, (state.player.xp - state.player.xpPast) / span)) : 0;
    el("xpFill").style.width = `${xpShare * 100}%`;
    el('hp').innerText = roundNumbertoLetter(state.player.hp);
    el('gold').innerText = roundNumbertoLetter(state.player.gold);
    el('fe').innerText = roundNumbertoLetter(state.player.faith);
    const hpPercent = state.player.hp / state.player.hpBase;
    el("hpIcon").src = heartMeter(hpPercent);
}

// Heart icon for the enemy's remaining HP (fraction from 0 to 1).
function heartMeter(hpPercent){
    if (hpPercent > 0.75) return art(`heart`);
    if (hpPercent > 0.5) return art(`heart75`);
    if (hpPercent > 0.1) return art(`heart50`);
    if (hpPercent > 0) return art(`heart10`);
    if (hpPercent <= 0) return art(`heart0`);
}

// Refresh the enemy heart icon used in console messages.
function updateHeartNPC(){
ui.heartIcon = `<img style="filter: hue-rotate(45deg)" class="imgInConsole" height="${ui.em}" src="${heartMeter(Math.round(fight.enemyHP) / fight.enemyHPbase)}"/> `;
}




/////////////////////////////////////////////////////////
//  ██████╗ ██████╗  █████╗ ██████╗ ██╗  ██╗██╗ ██████╗//
// ██╔════╝ ██╔══██╗██╔══██╗██╔══██╗██║  ██║██║██╔════╝//
// ██║  ███╗██████╔╝███████║██████╔╝███████║██║██║     //
// ██║   ██║██╔══██╗██╔══██║██╔═══╝ ██╔══██║██║██║     //
// ╚██████╔╝██║  ██║██║  ██║██║     ██║  ██║██║╚██████╗//
//  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝╚═╝ ╚═════╝//
/////////////////////////////////////////////////////////
//Graphics

// Draw a background (a zone stage, altar, inn...) and move the map marker.
function loadBackground(back) {
    ui.currentBackGround = back;
    if (run.simulation) return;     // in a simulation only what's on the scene matters
    // the old background stays until the new image has loaded (no flash of the page behind)
    withImage("background", art(`${back.toLowerCase()}`), () => {
        esceneCanvas.style.background = `url('${art(`${back.toLowerCase()}`)}') no-repeat`;
        esceneCanvas.style.backgroundSize = "contain";
        // the front layer of this scene, if it has one (cleared otherwise)
        const front = el("overlayCanvas").style, name = back.toLowerCase();
        front.background = overlays.has(name) ? `url('${art(`overlay_${name}`)}') no-repeat` : "none";
        front.backgroundSize = "contain";
        showDiceTable(back);                    // the table of a dice house (cleared in any other scene)
    });
    //change bocadillo location
    localizarBocadillo();
};

// A canvas's 2D context, set to draw pixel art crisp (sharp squares) or smoothed. Set before
// every draw: resizing a canvas resets its context settings.
function pixelContext(canvas) {
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = !ui.crisp;
    return ctx;
}

// Images are loaded once and reused (v1 created a new Image for every redraw).

// Draw one frame of a strip: copied out at 1:1 first, so scaling it up can't sample the frames
// next to it (a sliver of the neighbour on the edge, worst at odd screen sizes).
const frameCell = document.createElement("canvas");
function drawFrame(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
    if (frameCell.width != sw || frameCell.height != sh) { frameCell.width = sw; frameCell.height = sh; }
    const cell = frameCell.getContext("2d");
    cell.clearRect(0, 0, sw, sh);
    cell.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    ctx.drawImage(frameCell, dx, dy, dw, dh);
}
const imageCache = new Map();
const latestDraw = {};

// The image at src if it has loaded, otherwise null (and it starts loading).
function imageNow(src) {
    let img = imageCache.get(src);
    if (!img) {
        img = new Image();
        img.src = src;
        imageCache.set(src, img);
    }
    return img.complete && img.naturalWidth > 0 ? img : null;
}

// Dev tools (art mode): forget every loaded image, so edited files are loaded again; or show
// another picture (a local file's URL) wherever the game draws src, until forgotten.
function forgetImages() {
    imageCache.clear();
}
function replaceImage(src, url) {
    const img = new Image();
    img.src = url;
    imageCache.set(src, img);
    return new Promise((resolve) => { img.onload = img.onerror = () => resolve(img); });
}

// Call draw(img) with the image at src, now if it's already loaded, otherwise when it loads.
// Each canvas only keeps its latest request: an older image that finishes loading late is
// not drawn over a newer one.
function withImage(canvasName, src, draw) {
    const ticket = latestDraw[canvasName] = (latestDraw[canvasName] || 0) + 1;
    let img = imageCache.get(src);
    if (!img) {
        img = new Image();
        img.src = src;
        imageCache.set(src, img);
    }
    if (img.complete && img.naturalWidth > 0) {
        draw(img);
    } else {
        img.addEventListener("load", () => { if (latestDraw[canvasName] === ticket) draw(img); }, { once: true });
    }
}

// Call ready() once the scene's background and the wizard's sprite have loaded, so a scroll
// opened as the game starts (the Prologue) shows over a drawn scene, not before it.
function whenSceneReady(ready) {
    if (run.simulation) return ready();
    const srcs = [art(`${(state.zone.current + state.zone.stage).toLowerCase()}`),
                  art(`lvl${Math.floor(state.player.lvl / 10) * 10}`)];
    let left = srcs.length;
    // a frame later, so the canvases that wait for the same images have drawn first
    const one = () => { if (--left == 0) requestAnimationFrame(() => ready()); };
    for (const src of srcs) {
        if (imageNow(src)) { one(); continue; }
        const img = imageCache.get(src);
        img.addEventListener("load", one, { once: true });
        img.addEventListener("error", one, { once: true });    // a missing picture never blocks the story
    }
}

// Draw the wizard; his sprite changes with the level (img/lvl<N>.png, every 10 levels).
function loadCanvasChar(lvl, squareSide, headLevel) {
    if (run.simulation) return;
    withImage("pj", art(`lvl${Math.floor(lvl / 10) * 10}`), (img) => {
        clearWizardCanvas();        // cleared only when the new image is ready (no blank flash)
        const ctx = pixelContext(pjCanvas);
        ctx.drawImage(img, squareSide, headLevel, ui.charWidth, ui.charHeight);
    });
}

// Draw the wizard with his normal sprite for his level.
// Load the wizard's animation strips and poses for his tier ahead of time, so an animation
// never waits for its image (and never leaves him blank).
let preloadedTier = -1;
function preloadWizardArt() {
    const tier = wizardTier();
    if (tier == preloadedTier || run.simulation) return;
    preloadedTier = tier;
    for (const name of Object.keys(WIZARD_ANIMS)) imageNow(art(`anim_${name}${tier}`));
    for (const pose of ["fallen", "dead", "stone"]) imageNow(art(`${pose}${tier}`));
    imageNow(art(`anim_walk${tier}`));
}

function drawWizard() {
    preloadWizardArt();
    if (ui.petrified) return drawWizardPose("stone");     // still stone (Medusa), see ui/bossAttacks.js
    loop.stop("animPJ");        // a normal redraw ends any animation (ui/render.js, wizard animations)
    wizardAnim = "";
    loadCanvasChar(state.player.lvl, wizardX(), ui.headLevel);
}

// ------------------------------------------------------------------ wizard animations
// The artist's strips: img/anim_<name><tier>.png, 32x32 frames side by side, one strip per
// tier (every 10 levels, like lvl<N>.png). Played on the animPJ clock; any normal redraw of
// the wizard (drawWizard) stops them.
const WIZARD_ANIMS = {
    cast: { frames: 7, ms: 100 },                       // the staff swings forward, a glint, back
    walk: { frames: 4, ms: 140, repeat: 2 },            // two steps
    pray: { frames: 6, ms: 100, loopFrom: 3 },          // frames 3-5 loop until he stands up
    fall_sit: { frames: 6, ms: 100, then: "fallen" },   // a fall he can be revived from
    fall_dead: { frames: 6, ms: 110, then: "dead" },    // true death
    petrify: { frames: 8, ms: 100, then: "stone" },      // Medusa's gaze: stone climbs from the feet
    unpetrify: { frames: 10, ms: 100 },                  // the stone cracks and bursts off
};
let wizardAnim = "";

function wizardTier() {
    return Math.min(200, Math.floor(state.player.lvl / 10) * 10);
}

function clearWizardCanvas() {
    pjCanvas.width = pjCanvas.offsetWidth;
    pjCanvas.height = pjCanvas.offsetHeight;
}

// Where the glint at the staff tip is in a cast strip (frame 3), in sprite pixels; found once
// per tier from the art itself, since the staff is on the left or the right depending on the tier.
const glints = new Map();
function staffTip(img, tier) {
    if (glints.has(tier)) return glints.get(tier);
    const c = document.createElement("canvas");
    c.width = 32; c.height = 32;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 3 * 32, 0, 32, 32, 0, 0, 32, 32);
    const data = ctx.getImageData(0, 0, 32, 32).data;
    let x = 0, y = 0, n = 0;
    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 200 && Math.min(data[i], data[i + 1], data[i + 2]) >= 225) { x += (i / 4) % 32; y += Math.floor(i / 4 / 32); n++; }
    }
    const tip = n ? [x / n, y / n] : [16, 2];
    glints.set(tier, tip);
    return tip;
}

// On the cast animation, show what he casts (the author's "spark by school"): the school's
// spark at the staff tip on frames 3-4 instead of the plain glint; heals and other non-attacks
// keep the glint. He never hits with the staff (only spells), so Physical has no spark.
function castEffect(ctx, frame, img, tier, spellId) {
    const school = spellId && spells[spellId] ? spells[spellId].school : "na";
    const unit = ui.charWidth / 32, x0 = wizardX(), y0 = ui.headLevel;
    if (school != "na" && school != "Physical" && (frame == 3 || frame == 4)) {
        const spark = imageNow(art(`fx_spark_${school.toLowerCase()}`));
        if (!spark) return;
        const [tx, ty] = staffTip(img, tier);
        ctx.drawImage(spark, (frame - 1) * 16, 0, 16, 16, x0 + (tx - 7.5) * unit, y0 + (ty - 7.5) * unit, 16 * unit, 16 * unit);
    }
}

// Play one of the wizard's animations; a looping one (pray) keeps going if asked again.
// For "cast", spellId says what he casts (see castEffect).
function playWizardAnim(name, spellId) {
    if (run.simulation) return;
    if (ui.petrified && (name == "cast" || name == "walk" || name == "pray")) return;    // stone can't move
    if (name.startsWith("fall")) { ui.petrified = false; loop.stop("stone"); }          // a fall breaks the stone
    const anim = WIZARD_ANIMS[name];
    if (name == wizardAnim && anim.loopFrom !== undefined && loop.isRunning("animPJ")) return;
    wizardAnim = name;
    const tier = wizardTier(), total = anim.frames * (anim.repeat || 1);
    if (pjCanvas.width != pjCanvas.offsetWidth) clearWizardCanvas();   // only when the size changed
    if (name == "cast" && spellId && spells[spellId]) {
        const school = spells[spellId].school;
        if (school != "na" && school != "Physical") imageNow(art(`fx_spark_${school.toLowerCase()}`));
    }
    let step = 0;
    const next = () => {
        let frame;
        if (step < total) frame = step % anim.frames;
        else if (anim.loopFrom !== undefined) frame = anim.loopFrom + (step - total) % (anim.frames - anim.loopFrom);
        else {
            loop.stop("animPJ");
            wizardAnim = "";
            if (name == "unpetrify") ui.petrified = false;
            if (anim.then) drawWizardPose(anim.then); else drawWizard();
            return;
        }
        step++;
        withImage("pj", art(`anim_${name}${tier}`), (img) => {
            const ctx = pixelContext(pjCanvas);
            ctx.clearRect(0, 0, pjCanvas.width, pjCanvas.height);
            drawFrame(ctx, img, frame * 32, 0, 32, 32, wizardX(), ui.headLevel, ui.charWidth, ui.charHeight);
            if (name == "cast") castEffect(ctx, frame, img, tier, spellId);
        });
    };
    next();
    loop.every("animPJ", next, anim.ms);
}

// A still pose: "fallen" (with the skull above him: he needs your attention) or "dead".
function drawWizardPose(pose) {
    if (run.simulation) return;
    loop.stop("animPJ");
    wizardAnim = "";
    withImage("pj", art(`${pose}${wizardTier()}`), (img) => {
        clearWizardCanvas();        // cleared only when the pose is ready (no blank flash)
        const ctx = pixelContext(pjCanvas);
        ctx.drawImage(img, wizardX(), ui.headLevel, ui.charWidth, ui.charHeight);
        if (pose != "fallen") return;
        withImage("pjSkull", art(`muerto`), (skull) => {
            // half his size, 12 sprite px right and 10 up from his top-left (the artist's spot,
            // clear of every staff top and crown)
            pixelContext(pjCanvas).drawImage(skull, wizardX() + ui.charWidth * 0.375, ui.headLevel - ui.charHeight * 0.3125,
                ui.charWidth / 2, ui.charHeight / 2);
        });
    });
}

// ------------------------------------------------------------------ walking in the scene
// The wizard can leave his place to reach something (a find, a statue) and come back.
// ui.wizardOffset is how far right of his place he is, in sprite pixels (the 256 x 64 scene
// has the wizard's place at x 32). Everything drawn on him follows it.

// Randomness for the looks only (where a blink appears): never the game's Math.random, so a
// seeded simulation plays the same whatever is drawn.
let looks = (Date.now() % 2147483647) || 1;
function looksRandom() {
    looks = (looks * 48271) % 2147483647;
    return looks / 2147483647;
}

const WALK_STEP = 11;               // sprite px per 100 ms frame (the author found 16 too fast)
const OFF_RIGHT = 240, OFF_LEFT = -72;   // offsets just past the right and left edges of the scene

// Walk out of the scene to the right, change the scene, walk in from the left to his place
// (the author's idea for leaving a find or a statue, and for changing zone), or on to stopAt
// (an offset) to reach something in the new scene.
function walkThroughScene(changeScene, onArrive, stopAt = 0) {
    walkWizardTo(OFF_RIGHT, () => {
        changeScene();
        ui.wizardOffset = OFF_LEFT;
        walkWizardTo(stopAt, onArrive);
    });
}

// The way back: he walks out to the left, the scene changes, and he comes in from the left (the
// author: from a shrine he goes back the way he came).
function walkBackThroughScene(changeScene, onArrive) {
    walkWizardTo(OFF_LEFT, () => {
        changeScene();
        ui.wizardOffset = OFF_LEFT;
        walkWizardTo(0, onArrive);
    });
}

// Across a connector (bridge, stairs, cave or mine mouth): its scenes in turn. steps is a list of
// {scene, dir, start, end, fade}: he walks right (dir 1) or left (dir -1, the walk strip mirrored) from
// `start` to `end` (offsets; by default from just outside one edge to just outside the other). With
// fade he stops at `end` (a door) and the scene fades into the next one, where he appears at that
// step's `start` (its opening). With pause (ms) he stands still at `end` that long first. The first step is reached by walking out of the scene he is in; at the
// end changeScene shows the real destination and he stands in his place (no walking in).
function walkAcross(steps, changeScene, onArrive) {
    const side = (d) => d > 0 ? OFF_RIGHT : OFF_LEFT, entry = (d) => d > 0 ? OFF_LEFT : OFF_RIGHT;
    const startOf = (s) => s.start != null ? s.start : entry(s.dir);
    const play = (i) => {
        const s = steps[i], more = i + 1 < steps.length;
        ui.wizardOffset = startOf(s);
        const target = s.end != null ? s.end : side(s.dir);
        const walkOn = (onReached) => s.fightSpot == null ? walkWizardTo(target, onReached)
            // a fight on the way (travel.js): he walks to its spot, the fight runs, then he walks on
            : walkWizardTo(s.fightSpot, () => s.fight(() => walkWizardTo(target, onReached)));
        walkOn(() => {
            const show = () => {
                if (more) loadBackground(steps[i + 1].scene); else changeScene();
                ui.wizardOffset = more ? startOf(steps[i + 1]) : entry(s.dir);      // after the last scene he comes into the real one from the edge he was heading to
                if (!run.simulation) drawWizard();
            };
            const next = () => more ? play(i + 1) : walkWizardTo(0, onArrive);      // and walks in to his place
            const go = () => { if (s.fade) fadeScene(show, next); else { show(); next(); } };
            if (s.pause && !run.simulation && document.hasFocus()) {     // a stop at `end` (the pier's end), then on
                loop.freezeGame();
                loop.every("crossPause", () => { loop.stop("crossPause"); loop.thawGame(); go(); }, s.pause);
            } else go();
        });
    };
    walkWizardTo(side(steps[0].dir), () => {
        loadBackground(steps[0].scene);
        const info = connectorSceneInfo(steps[0].scene);
        if (info && !run.simulation) print(`${wizardName()} comes to ${info.label}`);
        play(0);
    });
}

function wizardX() {
    return ui.squareSide + (ui.wizardOffset || 0) * ui.charWidth / 32;
}

// Mirror the characters (the wizard, the enemy and the spells, not the scene) for a fight in a scene he
// walks right to left: he stands on the right facing left, the enemy comes from the left. The god's touch
// areas swap sides with them. facing is 1 (as drawn) or -1.
function setFacing(facing) {
    ui.facing = facing;
    if (run.simulation) return;
    for (const id of ["pjCanvas", "npcCanvas", "spellCanvas"]) el(id).style.transform = facing < 0 ? "scaleX(-1)" : "";
    const pj = el("pjDivineBtn"), npc = el("npcDivineBtn"), d = npc.offsetLeft - pj.offsetLeft;
    pj.style.transform = facing < 0 ? `translateX(${d}px)` : "";
    npc.style.transform = facing < 0 ? `translateX(${-d}px)` : "";
}

// Walk to an offset (sprite px), playing the walk strip (mirrored when going back), then call
// onArrive. Without drawing (simulation, page in the background) he is simply there.
let walkToken = 0;
function walkWizardTo(target, onArrive, stepPx = WALK_STEP) {
    let froze = false;
    const arrive = () => {
        loop.stop("walkPJ");
        if (froze) loop.thawGame();
        ui.wizardOffset = target;
        if (!run.simulation) drawWizard();
        if (onArrive) onArrive();
    };
    const from = ui.wizardOffset || 0, dir = Math.sign(target - from);
    if (run.simulation || !document.hasFocus() || !dir) return arrive();
    loop.stop("animPJ");
    wizardAnim = "";
    loop.freezeGame();
    froze = true;
    const tier = wizardTier();
    let step = 0;
    // (no wipe here: the canvas was blank until the first frame, the author's flicker when he
    // starts walking; the first frame is drawn at once, where he stands)
    if (pjCanvas.width != pjCanvas.offsetWidth) clearWizardCanvas();
    const drawStep = () => {
        const frame = step % 4;
        withImage("pj", art(`anim_walk${tier}`), (img) => {
            const ctx = pixelContext(pjCanvas), x = wizardX();
            ctx.clearRect(0, 0, pjCanvas.width, pjCanvas.height);
            ctx.save();
            if (dir < 0) { ctx.translate(x + ui.charWidth, ui.headLevel); ctx.scale(-1, 1); } else ctx.translate(x, ui.headLevel);
            drawFrame(ctx, img, frame * 32, 0, 32, 32, 0, 0, ui.charWidth, ui.charHeight);
            ctx.restore();
        });
    };
    drawStep();
    // He moves every screen refresh (stepPx per 100 ms, the same speed as before, but smooth: it used to jump a
    // whole step every 100 ms); the walk strip still changes frame every 100 ms. If the page is not painting
    // (a background tab) the clock below moves him instead, so the walk still ends.
    let last = performance.now();
    const me = ++walkToken;
    const move = (t, again) => {
        if (me !== walkToken || !loop.isRunning("walkPJ")) return;     // the walk was cancelled or another one began
        const dt = Math.min(Math.max(t - last, 0), 100);
        last = t;
        ui.wizardOffset = (ui.wizardOffset || 0) + dir * stepPx * dt / 100 * loop.getSpeed();
        if ((target - ui.wizardOffset) * dir <= 0) return arrive();
        drawStep();
        if (again) requestAnimationFrame((n) => move(n, true));
    };
    loop.every("walkPJ", () => {
        step++;
        if (performance.now() - last > 250) move(performance.now(), false);
    }, 100);
    requestAnimationFrame((t) => move(t, true));
}

// A small twinkle on the ground where something can be found (scene x in sprite px), until
// the find is drawn there (loadNPC stops it).
function showBlink(spotX) {
    if (run.simulation) return;
    npcCanvas.width = npcCanvas.offsetWidth;
    npcCanvas.height = npcCanvas.offsetHeight;
    const unit = ui.charWidth / 32, cx = (spotX + 5) * unit, cy = 50 * unit;
    let k = 0;
    loop.every("blink", () => {
        const ctx = npcCanvas.getContext("2d"), r = [1, 2, 3, 2][k++ % 4];
        ctx.clearRect(0, 0, npcCanvas.width, npcCanvas.height);
        ctx.fillStyle = "#fffbe0";
        ctx.fillRect(cx - unit / 2, cy - (r + 0.5) * unit, unit, (2 * r + 1) * unit);    // a little 4-point star
        ctx.fillRect(cx - (r + 0.5) * unit, cy - unit / 2, (2 * r + 1) * unit, unit);
    }, 120);
}

// ------------------------------------------------------------------ scene transitions
// Every change of scene goes through here (option B, chosen by the author): he walks out and
// in when he goes somewhere, and a quick fade brings a place (shrine, inn, dice house, the
// healer's cabin) around him; where a place has a door he comes in and goes out through it.
// While a transition plays the game's clocks wait (loop.freezeGame), so nothing overlaps; in
// a simulation nothing is drawn and everything happens at once, in the same order.

// Doors in the place backgrounds: scene x of the door's middle, in sprite px.
const DOORS = { el_poblado_casadados: 16, la_ciudad_casadados: 16, el_poblado_taberna: 40, la_ciudad_taberna: 52, las_dunas_taberna: 22 };

let fadeCanvas;
function fadeLayer() {
    if (!fadeCanvas) {
        fadeCanvas = document.createElement("canvas");
        fadeCanvas.id = "fadeCanvas";
        fadeCanvas.style.position = "absolute";
        fadeCanvas.style.pointerEvents = "none";
        el("spellCanvas").after(fadeCanvas);
    }
    const scene = el("esceneCanvas").style;
    Object.assign(fadeCanvas.style, { left: scene.left, top: scene.top, width: scene.width, height: scene.height, zIndex: 50 });
    fadeCanvas.width = el("esceneCanvas").offsetWidth;
    fadeCanvas.height = el("esceneCanvas").offsetHeight;
    return fadeCanvas;
}
// The scene moves when a scroll opens or closes (or the window turns): the dark and the dream
// over it follow (the author's note; only the box moves, so what is drawn stays).
document.addEventListener("wizardidle:layout", () => {
    if (!fadeCanvas) return;
    const scene = el("esceneCanvas").style;
    Object.assign(fadeCanvas.style, { left: scene.left, top: scene.top, width: scene.width, height: scene.height });
    if (dreamBox) Object.assign(dreamBox.style, { left: scene.left, top: scene.top, width: scene.width, height: scene.height });
});

const FADE_STEP_MS = 80;            // the fade has 9 steps: about 0.7 s

// Fade the scene to dark, change it, fade back in (about 0.7 s), then done(). With
// ready, it stays dark until ready() says the new scene can show (its image has loaded).
function fadeScene(change, done, ready) {
    if (run.simulation || !document.hasFocus()) {
        change();
        if (done) done();
        return;
    }
    loop.freezeGame();
    const layer = fadeLayer(), ctx = layer.getContext("2d");
    const steps = [0.3, 0.6, 0.85, 1, 1, 0.75, 0.45, 0.2, 0];
    let k = 0, waited = 0;
    loop.every("fade", () => {
        if (k == 4) change();                       // at full dark
        if (k == 5 && ready && !ready() && waited++ < 62) return;     // hold the dark while it loads (5 s at most)
        ctx.clearRect(0, 0, layer.width, layer.height);
        ctx.fillStyle = `rgba(12, 8, 6, ${steps[k]})`;
        ctx.fillRect(0, 0, layer.width, layer.height);
        if (++k >= steps.length) {
            loop.stop("fade");
            ctx.clearRect(0, 0, layer.width, layer.height);
            loop.thawGame();
            if (done) done();
        }
    }, FADE_STEP_MS);
}

// Sleep (docs/plans/SLEEP.md): the scene fades to dark and stays dark a moment; a dream's lines
// (1-3) appear softly over the dark one after the other, then it fades back. atDark runs once
// it is fully dark (to change the scene unseen), done after.
// The lines are HTML over the dark (2026-11-17, the author: bold, italics, colours, sizes and
// [sprite] icons are written in the dream itself; src/ui/text.js), not drawn on the canvas.
const SLEEP_DARK_MS = 2000, DREAM_LINE_MS = 1800;
let dreamBox;

// The dream's lines over the scene, all hidden (opacity 0); returns the line elements.
function dreamLines(dream, slots) {
    const layer = fadeLayer();
    if (!dreamBox) {
        dreamBox = document.createElement("div");
        dreamBox.id = "dreamText";
        Object.assign(dreamBox.style, { position: "absolute", pointerEvents: "none", boxSizing: "border-box",
            flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center",
            padding: "0 4%", fontFamily: "munroregular, monospace", lineHeight: "1.2", overflow: "hidden" });
        layer.after(dreamBox);
    }
    const s = layer.style;
    Object.assign(dreamBox.style, { left: s.left, top: s.top, width: s.width, height: s.height, zIndex: 51, display: "flex",
        fontSize: `${Math.max(10, Math.round(layer.height / 7))}px`,
        color: dream && dream.nightmare ? "rgb(255, 150, 130)" : "rgb(230, 222, 255)" });
    const name = wizardName();
    dreamBox.innerHTML = (dream ? dream.lines : []).map((line) => `<div style="opacity: 0">${markup(line, slots || { name, zone: zones[state.zone.current].name })}</div>`).join("");
    return [...dreamBox.children];
}

function hideDreamLines() {
    if (!dreamBox) return;
    dreamBox.innerHTML = "";
    dreamBox.style.display = "none";
}

function sleepInDark(dream, done, atDark) {
    if (run.simulation || !document.hasFocus()) {
        if (atDark) atDark();
        return done && done();
    }
    loop.freezeGame();
    const layer = fadeLayer(), ctx = layer.getContext("2d");
    const lines = dreamLines(dream);
    const hold = Math.round((SLEEP_DARK_MS + lines.length * DREAM_LINE_MS) / FADE_STEP_MS);
    const steps = [0.3, 0.6, 0.85, ...Array(hold).fill(1), 0.75, 0.45, 0.2, 0];
    let k = 0;
    loop.every("sleep", () => {
        ctx.clearRect(0, 0, layer.width, layer.height);
        ctx.fillStyle = `rgba(6, 4, 12, ${steps[k]})`;
        ctx.fillRect(0, 0, layer.width, layer.height);
        if (k == 3 && atDark) atDark();
        const t = (k - 3) * FADE_STEP_MS - 500;     // ms into the dark, after a short beat
        const shown = k >= 3 && k < 3 + hold;
        lines.forEach((line, i) => {
            line.style.opacity = shown ? Math.max(0, Math.min(1, (t - i * DREAM_LINE_MS) / 500)) : 0;
        });
        if (++k >= steps.length) {
            loop.stop("sleep");
            ctx.clearRect(0, 0, layer.width, layer.height);
            hideDreamLines();
            loop.thawGame();
            if (done) done();
        }
    }, FADE_STEP_MS);
}

// The poem for a wizard who died for good while the god was away (docs/plans/AWAY.md): the scene
// fades to dark, the title and the lines appear one after the other, slowly, and it stays dark;
// done() runs after the last line has had its time (the name screen follows).
const POEM_LINE_MS = 2600, POEM_END_MS = 4500;
function poemInDark(poem, slots, done) {
    const layer = fadeLayer(), ctx = layer.getContext("2d");
    const lines = dreamLines({ lines: [`<b>${poem.title}</b>`, ...poem.lines] }, slots);
    const total = 1500 + lines.length * POEM_LINE_MS + POEM_END_MS;
    let t = 0;
    loop.every("poem", () => {
        const dark = Math.min(1, t / 1000);
        ctx.fillStyle = `rgba(6, 4, 12, ${dark})`;
        ctx.fillRect(0, 0, layer.width, layer.height);
        lines.forEach((line, i) => {
            line.style.opacity = Math.max(0, Math.min(1, (t - 1500 - i * POEM_LINE_MS) / 700));
        });
        t += FADE_STEP_MS;
        if (t >= total) {
            loop.stop("poem");
            if (done) done();
        }
    }, FADE_STEP_MS);
}

// The dark with a dream's lines fully shown, held until dreamStillOff() (the Texts dev mode:
// the author edits a dream and sees it as it looks at night). Call again to show an edit.
function dreamStill(dream) {
    loop.stop("sleep");
    dreamLines(dream).forEach((line) => { line.style.opacity = 1; });     // first: it sizes (and so clears) the layer
    const ctx = fadeCanvas.getContext("2d");
    ctx.fillStyle = "rgba(6, 4, 12, 1)";
    ctx.fillRect(0, 0, fadeCanvas.width, fadeCanvas.height);
}

function dreamStillOff() {
    loop.stop("sleep");
    if (fadeCanvas) fadeCanvas.getContext("2d").clearRect(0, 0, fadeCanvas.width, fadeCanvas.height);
    hideDreamLines();
}

// He goes into a place. With a door: the fade, then he comes in through it and walks to his
// spot. Without one (a shrine, a statue): he walks out of the scene and into the place, like any
// change of scene (the author's request); fade = true keeps the plain fade (waking up in the
// healer's cabin). Already there (back to the same shrine): only who is there changes.
// npc is who is there (e.g. the shrine's mystic), shown with the place.
// The doors of those places from the street (the author: he stops at the door before going
// in): the street background that shows it and the door's centre in scene px. Doors already
// in the art: the desert's tent, the Town's open doorways, the City's saloon doors (beer poster) and the door by
// the dice sign.
const STREET_DOORS = {
    el_poblado_taberna: ["el_Poblado4", 120], el_poblado_casadados: ["el_Poblado5", 119],
    la_ciudad_taberna: ["la_Ciudad4", 52], la_ciudad_casadados: ["la_Ciudad1", 149],
    las_dunas_taberna: ["las_Dunas2", 243],         // the stone arch at the right edge of las_dunas2 (x about 243): the underground inn
    el_desierto_taberna: ["el_Desierto1", 180],     // the tent of el_desierto1: he stops at its door (the dark opening, x about 180) and goes in
};
const DOOR_PAUSE_MS = 400;

function enterPlace(bg, npc, done, fade = false) {
    const street = STREET_DOORS[bg.toLowerCase()];
    if (street && !run.simulation && document.hasFocus()) {
        const [streetBg, x] = street;
        const toDoor = () => walkWizardTo(x - 48, () => {
            loop.freezeGame();                      // a short stop at the door, then in
            loop.every("doorPause", () => {
                loop.stop("doorPause");
                loop.thawGame();
                goInside(bg, npc, done, fade);
            }, DOOR_PAUSE_MS);
        });
        imageNow(art(`${streetBg.toLowerCase()}`));
        if ((ui.currentBackGround || "").toLowerCase() == streetBg.toLowerCase()) return toDoor();
        return walkThroughScene(() => loadBackground(streetBg), toDoor);
    }
    goInside(bg, npc, done, fade);
}

function goInside(bg, npc, done, fade) {
    const door = DOORS[bg.toLowerCase()], src = art(`${bg.toLowerCase()}`);
    imageNow(src);                                  // start loading it on the way
    const change = () => {
        loadBackground(bg);
        if (npc) { loadNPC(npc); startNpcIdle(); }
    };
    if ((ui.currentBackGround || "").toLowerCase() == bg.toLowerCase()) {
        change();
        if (done) done();
        return;
    }
    if (door == null && !fade) return walkThroughScene(change, done);
    fadeScene(() => {
        change();
        if (door != null) ui.wizardOffset = door - 48;
        if (!run.simulation) drawWizard();
    }, () => (door != null ? walkWizardTo(DICE_HOUSES[bg.toLowerCase()] ? WIZARD_AT_TABLE : 0, done) : done && done()), () => imageNow(src) != null);
}

// He leaves the place: out through its door and a fade to the street at that door (where the street is
// known, STREET_DOORS), where he walks right out of the scene and in again to the next scene (like any trip,
// the author's idea from the connectors); with no street he stands in changeScene's scene at his place. Where
// there is no door at all, he walks out of the scene to the right and in again.
function leavePlace(changeScene, done) {
    const key = (ui.currentBackGround || "").toLowerCase(), door = DOORS[key], street = STREET_DOORS[key];
    if (door == null) return walkThroughScene(changeScene, done);
    walkWizardTo(door - 48, () => fadeScene(() => {
        if (street && !run.simulation) {
            loadBackground(street[0]);
            ui.wizardOffset = street[1] - 48;           // at the door in the street
        } else {
            ui.wizardOffset = 0;
            changeScene();
        }
        if (!run.simulation) drawWizard();
    }, () => {
        if (!street) return done && done();
        walkWizardTo(OFF_RIGHT, () => {                  // out of the scene to the right, into the next from the left
            changeScene();
            ui.wizardOffset = OFF_LEFT;
            walkWizardTo(0, done);
        });
    }));
}

// Remove the enemy (or object) from the right side of the scene.
function clearNPC() {
    npcCanvas.getContext("2d").clearRect(0, 0, npcCanvas.width, npcCanvas.height);
    state.npc = "";
}

// Show the background of the stage the wizard is on.
function showStage() {
    loadBackground(state.zone.current + state.zone.stage);
}

// The wizard's name in bold, as most console messages start.
function wizardName() {
    return `<b>${state.player.name}</b>`;
}



// Where and how big the enemy or object on the right is drawn, by type (bosses, objects, the
// rest): [x, y, width, height].
function npcBox(npc, squareSideIn = ui.squareSide, headLevelIn = ui.headLevel, charWidthIn = ui.charWidth, charHeightIn = ui.charHeight) {
    //medium size bosses (64x64px)
    if (npc === "arcangel" || npc === "doria" || npc === "midas" || npc === "kkck" || npc === "herbus" || npc === "skeleton" || npc === "medusa" || npc === "lamia" || npc === "greater_naga" || npc === "rainbow" || npc === "rojo") {
        return [squareSideIn * 6, headLevelIn - (ui.objectSize * 0.03515625), charWidthIn * 1.25, charHeightIn * 1.25];
    }
    //big bosses (64x64px)
    if (npc === "bicaptop" || npc === "cuboq" || npc === "etymos" || npc === "fenix" || npc === "goro" || npc === "infraespectro" || npc === "protromus" || npc.match("hydskon") || npc.match("icedra")) {
        return [squareSideIn * 6, headLevelIn - (ui.objectSize * 0.0625), charWidthIn * 1.5, charHeightIn * 1.5];
    }
    //huge bosses (64x96px)
    if (npc.match("mother") || npc.match("guardian")) {
        return [squareSideIn * 6, headLevelIn - (ui.objectSize * 0.113), charWidthIn * 1.33, charHeightIn * 1.9];
    }
    //objects to get (20x20px), where the blink was (ui.findSpot, scene x in sprite px)
    if (npc.match("libro") || npc.match("runa")) {
        const x = ui.findSpot != null ? ui.findSpot * charWidthIn / 32 : squareSideIn * 2;
        return [x, headLevelIn * 1.6, charWidthIn / 3, charHeightIn / 3];
    }
    // rare items (32x32 with the object in about 20 px): the same size and ground as a book
    if (npc.startsWith("item_")) {
        const book = charWidthIn / 3, size = book * 32 / 20;
        const x = (ui.findSpot != null ? ui.findSpot * charWidthIn / 32 : squareSideIn * 2) - (size - book) / 2;
        return [x, headLevelIn * 1.6 + book - size * 0.85, size, size];
    }
    // the sleeping bag, laid in front of him where he stopped (ui.bagSpot, scene px)
    if (npc === "sleepingbag" && ui.bagSpot != null) return [ui.bagSpot * charWidthIn / 32, headLevelIn, charWidthIn, charWidthIn];
    //the remaining (32x32px)
    return [squareSideIn * 6, headLevelIn, charWidthIn, charWidthIn];
}

// Draw the enemy or object on the right, sized by type (npcBox).
function loadNPC(npc, squareSideIn=ui.squareSide, headLevelIn=ui.headLevel, charWidthIn=ui.charWidth, charHeightIn=ui.charHeight) {
    state.npc = npc;
    if (run.simulation) return;
    loop.stop("blink");
    withImage("npc", art(`${npc}`), (img) => {
        if (state.npc != npc) return;               // cleared or replaced while it loaded
        npcCanvas.width = npcCanvas.offsetWidth;    // cleared only when the new image is ready
        npcCanvas.height = npcCanvas.offsetHeight;
        const [x, y, w, h] = npcBox(state.npc, squareSideIn, headLevelIn, charWidthIn, charHeightIn);
        pixelContext(npcCanvas).drawImage(img, x, y, w, h);
    });
}

// Drop loadNPC's draw that is still waiting for its image (an arrival draws the enemy itself;
// otherwise the image could land mid-arrival and show the enemy in its place for a moment).
function cancelNPCDraw() {
    latestDraw.npc = (latestDraw.npc || 0) + 1;
}

// A hydra grows its next head (the artist's strips img/anim_<hydra>_grow<N>.png, from N heads
// to N+1, frames the size of the hydra sprite), drawn where the hydra is.
function playHydraGrow(hydra, fromHeads) {
    if (run.simulation || !document.hasFocus()) return;
    const npc = `${hydra}${fromHeads + 1}`, src = art(`anim_${hydra}_grow${fromHeads}`);
    const frameW = 64, frameH = hydra == "mother" ? 96 : 64;
    let k = 0, waited = 0;
    const next = () => {
        const strip = imageNow(src);
        if (!strip) {                                   // still loading: wait a little, then give up
            if (++waited > 20) { loop.stop("animNPC"); if (state.npc == npc) loadNPC(npc); }
            return;
        }
        if (k >= strip.naturalWidth / frameW || state.npc != npc) {
            loop.stop("animNPC");
            if (state.npc == npc) loadNPC(npc);
            return;
        }
        const [x, y, w, h] = npcBox(npc);
        const ctx = pixelContext(npcCanvas);
        ctx.clearRect(0, 0, npcCanvas.width, npcCanvas.height);
        drawFrame(ctx, strip, k * frameW, 0, frameW, frameH, x, y, w, h);
        k++;
    };
    next();
    loop.every("animNPC", next, 90);
}


// Idle of a friendly NPC, done in code (no art): he breathes, the sprite stretching 3% up from
// his feet and back, every half second, for as long as he is on the scene.
const IDLE_NPCS = new Set(["viejo"]);
const BREATH = 0.03, BREATH_MS = 500;
function startNpcIdle() {
    if (run.simulation || !IDLE_NPCS.has(state.npc)) return;
    let out = false;
    loop.every("idleNPC", () => {
        if (!IDLE_NPCS.has(state.npc)) return loop.stop("idleNPC");
        out = !out;
        const stretch = out ? BREATH : 0;
        loadNPC(state.npc, ui.squareSide, ui.headLevel - ui.charHeight * stretch, ui.charWidth, ui.charHeight * (1 + stretch));
    }, BREATH_MS);
}

// Make the enemy hop for a few frames (run by the animNPC clock).
function animateNPC() {  


    if (state.npc != ""){
        ui.frameCounter += 1;
        switch (ui.frameCounter) {
        case 1:
            loadNPC(state.npc, ui.squareSide + (ui.jumpSpace / 6));
            break;
        case 2:
            loadNPC(state.npc);
            ui.frameCounter = 0;
            loop.stop("animNPC");
        }
    } else {
        loop.stop("animNPC");   // nobody left to hop (v1 kept this clock running forever)
    }
};



// Add a line at the top of the console, keeping at most MAXLINESINCONSOLE lines.
function print(data) {
    setLiveTime(); //set seconds of game and add to total time
    if (run.simulation) return;     // nobody reads the console in a simulation
    el("console").innerHTML = `${data}<br>${el("console").innerHTML}`;
    const brSplit = el('console').innerHTML.split("<br>")
    if (brSplit.length > MAXLINESINCONSOLE) {
        brSplit.splice(-1, 1);
        el("console").innerHTML = brSplit.join("<br>");
    }
    ;
};

export {
    setFacing,
    forgetImages,
    replaceImage,
    wizardTier,
    walkBackThroughScene,
    drawFrame,
    sleepInDark,
    poemInDark,
    dreamStill,
    dreamStillOff,
    enterPlace,
    fadeScene,
    leavePlace,
    walkThroughScene,
    npcBox,
    cancelNPCDraw,
    looksRandom,
    showBlink,
    walkWizardTo,
    walkAcross,
    playHydraGrow,
    imageNow,
    drawWizardPose,
    playWizardAnim,
    pixelContext,
    withImage,
    whenSceneReady,
    clearNPC,
    drawWizard,
    showStage,
    wizardName,
    animateNPC,
    loadBackground,
    loadCanvasChar,
    loadNPC,
    npcCanvas,
    pjCanvas,
    print,
    updateHeading,
    updateHeartNPC,
};
