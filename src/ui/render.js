// Wizard Idle v2 - Drawing the game: the heading (name, level, XP bar, HP, gold, faith), the console, the scene
// background, the wizard and the enemy, and their idle animations.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { roundNumbertoLetter } from '../utils.js';
import { state } from '../state.js';
import { fight, run, ui } from '../runtime.js';
import * as loop from '../loop.js';
import { setLiveTime } from '../game.js';
import { MAXLINESINCONSOLE } from '../config.js';
import { logro } from '../achievements.js';
import { localizarBocadillo } from './scrolls.js';
import { el } from './dom.js';
import { stats } from '../stats.js';
import { spells } from '../data/spells.js';

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
    el("XPprogressBar").max = state.player.xpNext;
    el("XPprogressBar").min = state.player.xpPast;
    el("XPprogressBar").value = state.player.xp;
    el('hp').innerText = roundNumbertoLetter(state.player.hp);
    el('gold').innerText = roundNumbertoLetter(state.player.gold);
    el('fe').innerText = roundNumbertoLetter(state.player.faith);
    const hpPercent = state.player.hp / state.player.hpBase;
    el("hpIcon").src = heartMeter(hpPercent);
}

// Heart icon for the enemy's remaining HP (fraction from 0 to 1).
function heartMeter(hpPercent){
    if (hpPercent > 0.75) return "img/heart.png";
    if (hpPercent > 0.5) return "img/heart75.png";
    if (hpPercent > 0.1) return "img/heart50.png";
    if (hpPercent > 0) return "img/heart10.png";
    if (hpPercent <= 0) return "img/heart0.png";
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
    esceneCanvas.style.background = `url('img/${back.toLowerCase()}.png') no-repeat`;
    esceneCanvas.style.backgroundSize = "contain";
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

// Draw the wizard; his sprite changes with the level (img/lvl<N>.png, every 10 levels).
function loadCanvasChar(lvl, squareSide, headLevel) {
    if (run.simulation) return;
    pjCanvas.width = pjCanvas.offsetWidth;
    pjCanvas.height = pjCanvas.offsetHeight;
    withImage("pj", `img/lvl${Math.floor(lvl / 10) * 10}.png`, (img) => {
        const ctx = pixelContext(pjCanvas);
        ctx.drawImage(img, squareSide, headLevel, ui.charWidth, ui.charHeight);
    });
}

// Draw the wizard with his normal sprite for his level.
function drawWizard() {
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
// spark at the staff tip on frames 3-4 instead of the plain glint, or for a staff hit a weapon
// slash in front of him; heals and other non-attacks keep the glint.
function castEffect(ctx, frame, img, tier, spellId) {
    const school = spellId && spells[spellId] ? spells[spellId].school : "na";
    const unit = ui.charWidth / 32, x0 = wizardX(), y0 = ui.headLevel;
    if (school == "Physical") {
        const slash = imageNow("img/fx_slash.png");
        if (!slash || frame < 2) return;
        ctx.save();                                     // mirrored: the slash opens toward the enemy
        ctx.translate(x0 + 50 * unit, y0);
        ctx.scale(-1, 1);
        ctx.drawImage(slash, (frame - 2) * 24, 0, 24, 32, 0, 0, 24 * unit, 32 * unit);
        ctx.restore();
    } else if (school != "na" && (frame == 3 || frame == 4)) {
        const spark = imageNow(`img/fx_spark_${school.toLowerCase()}.png`);
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
    if (name == "cast" && spellId && spells[spellId]) {
        const school = spells[spellId].school;
        if (school == "Physical") imageNow("img/fx_slash.png");
        else if (school != "na") imageNow(`img/fx_spark_${school.toLowerCase()}.png`);
    }
    let step = 0;
    clearWizardCanvas();
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
        withImage("pj", `img/anim_${name}${tier}.png`, (img) => {
            const ctx = pixelContext(pjCanvas);
            ctx.clearRect(0, 0, pjCanvas.width, pjCanvas.height);
            ctx.drawImage(img, frame * 32, 0, 32, 32, wizardX(), ui.headLevel, ui.charWidth, ui.charHeight);
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
    clearWizardCanvas();
    withImage("pj", `img/${pose}${wizardTier()}.png`, (img) => {
        const ctx = pixelContext(pjCanvas);
        ctx.drawImage(img, wizardX(), ui.headLevel, ui.charWidth, ui.charHeight);
        if (pose != "fallen") return;
        withImage("pjSkull", "img/muerto.png", (skull) => {
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

const WALK_STEP = 16;               // sprite px per 100 ms frame
const OFF_RIGHT = 240, OFF_LEFT = -72;   // offsets just past the right and left edges of the scene

// Walk out of the scene to the right, change the scene, walk in from the left to his place
// (the author's idea for leaving a find or a statue, and for changing zone).
function walkThroughScene(changeScene, onArrive) {
    walkWizardTo(OFF_RIGHT, () => {
        changeScene();
        ui.wizardOffset = OFF_LEFT;
        walkWizardTo(0, onArrive);
    });
}

function wizardX() {
    return ui.squareSide + (ui.wizardOffset || 0) * ui.charWidth / 32;
}

// Walk to an offset (sprite px), playing the walk strip (mirrored when going back), then call
// onArrive. Without drawing (simulation, page in the background) he is simply there.
function walkWizardTo(target, onArrive) {
    const arrive = () => {
        loop.stop("walkPJ");
        ui.wizardOffset = target;
        if (!run.simulation) drawWizard();
        if (onArrive) onArrive();
    };
    const from = ui.wizardOffset || 0, dir = Math.sign(target - from);
    if (run.simulation || !document.hasFocus() || !dir) return arrive();
    loop.stop("animPJ");
    wizardAnim = "";
    const tier = wizardTier();
    let step = 0;
    clearWizardCanvas();
    loop.every("walkPJ", () => {
        ui.wizardOffset = (ui.wizardOffset || 0) + dir * WALK_STEP;
        if ((target - ui.wizardOffset) * dir <= 0) return arrive();
        const frame = step++ % 4;
        withImage("pj", `img/anim_walk${tier}.png`, (img) => {
            const ctx = pixelContext(pjCanvas), x = wizardX();
            ctx.clearRect(0, 0, pjCanvas.width, pjCanvas.height);
            ctx.save();
            if (dir < 0) { ctx.translate(x + ui.charWidth, ui.headLevel); ctx.scale(-1, 1); } else ctx.translate(x, ui.headLevel);
            ctx.drawImage(img, frame * 32, 0, 32, 32, 0, 0, ui.charWidth, ui.charHeight);
            ctx.restore();
        });
    }, 100);
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
    if (npc === "arcangel" || npc === "doria" || npc === "midas" || npc === "kkck" || npc === "herbus" || npc === "skeleton" || npc === "medusa" || npc === "rainbow" || npc === "rojo") {
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
    //the remaining (32x32px)
    return [squareSideIn * 6, headLevelIn, charWidthIn, charWidthIn];
}

// Draw the enemy or object on the right, sized by type (npcBox).
function loadNPC(npc, squareSideIn=ui.squareSide, headLevelIn=ui.headLevel, charWidthIn=ui.charWidth, charHeightIn=ui.charHeight) {
    state.npc = npc;
    if (run.simulation) return;
    loop.stop("blink");
    npcCanvas.width = npcCanvas.offsetWidth;
    npcCanvas.height = npcCanvas.offsetHeight;
    withImage("npc", `img/${npc}.png`, (img) => {
        const [x, y, w, h] = npcBox(state.npc, squareSideIn, headLevelIn, charWidthIn, charHeightIn);
        pixelContext(npcCanvas).drawImage(img, x, y, w, h);
    });
}

// A hydra grows its next head (the artist's strips img/anim_<hydra>_grow<N>.png, from N heads
// to N+1, frames the size of the hydra sprite), drawn where the hydra is.
function playHydraGrow(hydra, fromHeads) {
    if (run.simulation || !document.hasFocus()) return;
    const npc = `${hydra}${fromHeads + 1}`, src = `img/anim_${hydra}_grow${fromHeads}.png`;
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
        ctx.drawImage(strip, k * frameW, 0, frameW, frameH, x, y, w, h);
        k++;
    };
    next();
    loop.every("animNPC", next, 90);
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
    walkThroughScene,
    npcBox,
    looksRandom,
    showBlink,
    walkWizardTo,
    playHydraGrow,
    imageNow,
    drawWizardPose,
    playWizardAnim,
    pixelContext,
    withImage,
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
