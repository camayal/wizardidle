// Wizard Idle v2 - Spell animations on the spell canvas and choosing which spell the wizard casts.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { spells, spellTiers } from './data/spells.js';
import { pickRandomItem } from './utils.js';
import { state } from './state.js';
import { ui } from './runtime.js';
import { masterTime } from './config.js';
import { playSound } from './audio.js';

//vars spell animation
var frameWidth = 30;
var frameHeight = 30;
var currentFrame = 0, shift = 0;




//Spell animation  //spell("spellRingYellow_8",true,frameWidth,frameHeight,currentFrame,shift)
function spell(img,pj,frameWidth,frameHeight,currentFrame,shift,critic=0,center=0){

    //avoid spell animation in high speed debug
    if(masterTime < 500){return}


//    var t0 = performance.now();
    //if (eval(img).school != "na"){
    if (spells[img].school != "na"){
        if(critic){var volume = 1}
        //playSound(eval(img).school, volume);
        playSound(spells[img].school, volume);

    }
    //var totalFrames = eval(img).frames;
    var totalFrames = spells[img].frames;
    var canvas = document.querySelector("#spellCanvas");
    var context = canvas.getContext("2d");

    if(!pj){
        var mult = 6;
    }else{
        var mult = 1;
    }

    //Make big animation with Critics
    if(critic){
        var multiSize = 1.5;
        var topMultiHeadLocation = 0.5;
        var leftMultiHeadLocation = 0.96;
    //center spell
    }else if(center){
        var multiSize = 1;
        var topMultiHeadLocation = 1;
        var leftMultiHeadLocation = 3.5;
    }else{
        var multiSize = 1;
        var topMultiHeadLocation = 1;
        var leftMultiHeadLocation = 1;
    }

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    var myImage = new Image();
    myImage.src = "img/" + img + ".png";
    myImage.addEventListener("load",animate)
    var requestFrame;

    function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        //draw each frame + place them in the middle
        context.drawImage(myImage, shift, 0, frameWidth, 
            frameHeight, (ui.squareSide * mult) * leftMultiHeadLocation, ui.headLevel * topMultiHeadLocation, ui.squareSide * multiSize, ui.squareSide * multiSize);
        shift += frameWidth + 1;
        if (currentFrame == totalFrames) {
            window.cancelAnimationFrame(requestFrame);
        }
        currentFrame++;
    
        requestFrame = requestAnimationFrame(animate);
    
        }
//console.log(performance.now() - t0)
};




// Highest spell tier the wizard knows: one tier every 10 levels, up to the last one.
// (v1 asked for tier 21 at level 210, which doesn't exist, and every attack crashed.)
function knownTier(){
    return Math.min(Math.floor(state.player.lvl / 10), spellTiers.length - 1);
}

//Select random spell per level
function getSpell(lvlBase = knownTier()){
    //spellTier0
    var i;
    var spellSelected = "";
    for (i = 0; i <= lvlBase; i++) { 
        if(spellSelected !== ""){
            //spellSelected =  spellSelected + "," + eval("spellTier" + i);
            spellSelected =  spellSelected + "," + spellTiers[i];
        }else{
        //spellSelected =  eval("spellTier" + i);
        spellSelected =  spellTiers[i];
        }
    }
    return pickRandomItem(spellSelected);
}

//count number of spells that know
function countSpellKnown(){
    var lvlBase = knownTier()
    var numberSpells = 0;
        for (var i = 0; i <= lvlBase; i++) { 
            numberSpells += Number(spellTiers[i].split(',').length)
        }
    return numberSpells
}

export {
    countSpellKnown,
    currentFrame,
    frameHeight,
    frameWidth,
    getSpell,
    shift,
    spell,
};
