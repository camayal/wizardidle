// Wizard Idle v2 - Spell animations on the spell canvas and choosing which spell the wizard casts.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { spells, spellTiers } from './data/spells.js';
import { pickRandomItem } from './utils.js';
import { state } from './state.js';
import { ui } from './runtime.js';
import { masterTime } from './config.js';
import { playSound } from './audio.js';
import { withImage } from './ui/render.js';





// Play a spell animation from img/<spell>.png on the wizard or the enemy (bigger on a critic) and its sound.
function spell(img, pj, critic = 0, center = 0){
    const frameWidth = 30, frameHeight = 30;    // size of one frame in the sprite sheet
    let currentFrame = 0, shift = 0;            // animation position, advanced every frame

    //avoid spell animation in high speed debug
    if(masterTime < 500){return}


    let volume;
    if (spells[img].school != "na"){
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

    let myImage;
    withImage(`spell${center ? "Center" : pj ? "Wizard" : "Enemy"}`, `img/${img}.png`, (image) => { myImage = image; animate(); });

    // one frame per screen refresh; the last step draws past the end of the sprite sheet,
    // which leaves the canvas clear, and then the animation stops
    function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        //draw each frame + place them in the middle
        context.drawImage(myImage, shift, 0, frameWidth, 
            frameHeight, (ui.squareSide * mult) * leftMultiHeadLocation, ui.headLevel * topMultiHeadLocation, ui.squareSide * multiSize, ui.squareSide * multiSize);
        shift += frameWidth + 1;
        if (currentFrame == totalFrames) return;    // v1 asked for another frame here, forever
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
