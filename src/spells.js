// Wizard Idle v2 - Spell animations on the spell canvas and choosing which spell the wizard casts.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { spells, spellTiers } from './data/spells.js';
import { pickRandomItem } from './utils.js';
import { state } from './state.js';
import { run, ui } from './runtime.js';
import { playSound } from './audio.js';
import { withImage } from './ui/render.js';
import { art } from './media.js';
import { TALL_ROWS } from './data/tallScenes.js';





// Play a spell animation from img/<spell>.png on the wizard or the enemy (bigger on a critic) and its sound.
// at: {x, y} in scene sprite px (256 x 64) to place the effect somewhere else, e.g. above a find.
function spell(img, pj, critic = 0, center = 0, at = null, silent = false){
    if (run.simulation) return;
    const frameWidth = spells[img].size || 30, frameHeight = spells[img].h || frameWidth, gap = spells[img].gap ?? 1;    // size of one frame in the sprite sheet and the gutter between frames (the 30 px ones)
    let currentFrame = 0, shift = 0;            // animation position, advanced every frame


    let volume;
    if (spells[img].school != "na" && !silent){
        if(critic){volume = 1}
        playSound(spells[img].school, volume);

    }
    const totalFrames = spells[img].frames;
    const canvas = document.querySelector("#spellCanvas");
    const context = canvas.getContext("2d");

    let mult;
    if(!pj){
        mult = 6;
    }else{
        mult = 1;
    }

    //Make big animation with Critics
    let multiSize, topMultiHeadLocation, leftMultiHeadLocation;
    if(critic){
        multiSize = 1.5;
        topMultiHeadLocation = 0.5;
        leftMultiHeadLocation = 0.96;
    //center spell
    }else if(center){
        multiSize = 1;
        topMultiHeadLocation = 1;
        leftMultiHeadLocation = 3.5;
    }else{
        multiSize = 1;
        topMultiHeadLocation = 1;
        leftMultiHeadLocation = 1;
    }

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // each frame is copied out at 1:1 first, so scaling it up can't sample the cells around it
    const cell = document.createElement("canvas");
    cell.width = frameWidth; cell.height = frameHeight;
    const cellCtx = cell.getContext("2d");
    let myImage;
    // most effects advance one frame per screen refresh; a spell with its own frame time (ms in
    // the data, e.g. the dice to match their sound) waits that long between frames (set before
    // withImage: with the image already loaded it starts the animation at once)
    const frameMs = spells[img].ms || 0;
    let lastFrameAt = -Infinity;
    // when the effect on the wizard is over (a frame per screen refresh, about 17 ms): the enemy
    // that felled him waits for it before it leaves (ui/entrances.js playLeave)
    run.spellUntil = Math.max(run.spellUntil || 0, performance.now() + totalFrames * Math.max(frameMs, 17) + 50);   // any spell: a fight on a crossing waits for it before it un-mirrors the scene (travel.js)
    if (pj) run.wizardSpellUntil = Math.max(run.wizardSpellUntil || 0, performance.now() + totalFrames * Math.max(frameMs, 17) + 100);
    withImage(`spell${center ? "Center" : pj ? "Wizard" : "Enemy"}`, art(`${img}`), (image) => { myImage = image; animate(); });

    // one frame per screen refresh; the last step only clears the canvas, then the animation
    // stops (v1 drew one step past the last frame, which could leave a sliver of the next cell or
    // of the sheet's 1-px gutters on screen: the author's two stray lines by the fallen wizard)
    function animate(now = performance.now()) {
        if (frameMs && now - lastFrameAt < frameMs) return requestAnimationFrame(animate);
        lastFrameAt = now;
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (currentFrame >= totalFrames) return;
        context.imageSmoothingEnabled = !ui.crisp;   // resizing the canvas resets it
        //draw each frame + place them in the middle
        const unit = ui.charWidth / 32;
        const lift = ui.tallScene ? (TALL_ROWS - 64) * unit : 0;       // the spell canvas grows upward over a tall scene (layout.js)
        let x = at ? at.x * unit : (ui.squareSide * mult) * leftMultiHeadLocation + (pj ? (ui.wizardOffset || 0) * unit : 0);
        let y = (at ? at.y * unit : ui.headLevel * topMultiHeadLocation) + lift;
        cellCtx.clearRect(0, 0, frameWidth, frameHeight);
        cellCtx.drawImage(myImage, shift, 0, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
        let side = ui.squareSide * multiSize * frameWidth / 30, sideH = side * frameHeight / frameWidth, pad = (ui.squareSide * multiSize - side) / 2, padY = (ui.squareSide * multiSize - sideH) / 2;     // a smaller sprite stays centred where a 30 px one would sit
        if (spells[img].exact) {        // drawn 1:1 in art pixels, centred over the enemy, its bottom on the walk line (the Wrath strike)
            side = frameWidth * unit; sideH = frameHeight * unit; pad = 0; padY = 0;
            if (!at) { x = ui.squareSide * 6 + (ui.squareSide - side) / 2; y = lift - (TALL_ROWS - 64) * unit; }
        }
        context.drawImage(cell, x + pad, y + padY, side, sideH);
        shift += frameWidth + gap;
        currentFrame++;
        requestAnimationFrame(animate);
    }
};




// Highest spell tier the wizard knows: one tier every 10 levels, capped at the last one
// (v1 asked for tier 21 at level 210, which doesn't exist, and every attack crashed).
function knownTier(){
    return Math.min(Math.floor(state.player.lvl / 10), spellTiers.length - 1);
}

// A random spell from every tier the wizard knows.
function getSpell(lvlBase = knownTier()){
    //spellTier0
    let i;
    let spellSelected = "";
    for (i = 0; i <= lvlBase; i++) { 
        if(spellSelected !== ""){
            spellSelected =  `${spellSelected},${spellTiers[i]}`;
        }else{
        spellSelected =  spellTiers[i];
        }
    }
    return pickRandomItem(spellSelected);
}

// How many spells the wizard knows (for the stats page).
function countSpellKnown(){
    const lvlBase = knownTier()
    let numberSpells = 0;
        for (let i = 0; i <= lvlBase; i++) { 
            numberSpells += Number(spellTiers[i].split(',').length)
        }
    return numberSpells
}

export {
    countSpellKnown,
    getSpell,
    spell,
};
