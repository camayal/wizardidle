// Wizard Idle v2 - Start of the game: the name screen, loading a wizard, play time, and the starting values of the
// shared runtime objects (set here in the same order v1 set them).
// Original game hand-written by Carlos Alonso Maya Lastra (2018-2020), see tag v1.0.0.

import { zones } from './data/zones.js';
import { roundNumbertoLetter } from './utils.js';
import { state } from './state.js';
import { fight, run, ui } from './runtime.js';
import { randomName } from './combat.js';
import { event, nextEvent } from './events.js';
import { levelUP } from './wizard.js';
import { playSound } from './audio.js';
import { drawWizard, print, showStage, updateHeading, wizardName } from './ui/render.js';
import { defineObjectSize, getEM } from './ui/layout.js';
import { el } from './ui/dom.js';

const version = "2.0.0"; // v1: "02nov2020_10pm"
let uniqueID;
ui.objectSize = defineObjectSize();
ui.headLevel = ui.objectSize * 0.109375;//56;
ui.squareSide = ui.objectSize * 0.125;//64;
ui.charWidth = ui.squareSide; ui.charHeight = ui.squareSide;
ui.em = getEM();

run.multipleEventsCounter = 0;
ui.frameCounter = 0;
ui.jumpSpace = ui.squareSide / 4;
fight.bossCombat = false;
fight.hydraCombat = false;

fight.enemyHP = 0;
fight.enemyHPbase = 0;
fight.enemyName = "";
fight.bossMultiplier = 1;//reset the bossmultiplier
fight.bossGoldMultiplier = 1;
fight.enemy = "";
fight.enemyAndNumber = "";
fight.spellEnemy = "";
fight.polymorphed = false;
fight.pjDead = false;
run.disablePjBtn = false;
run.disableCenterBtn = false;
ui.sceneOnTop = true;






run.restAtInn = false;
run.pause = false;

run.afterChapterExe = false;
//vars icons
ui.goldIcon = `<img class='imgInConsole' height='${ui.em}' src='img/gold.png'/> `;

ui.spiritIcon = `<img class='imgInConsole' height='${ui.em}' src='img/spirit.png'/> `;
ui.attackIcon = `<img class='imgInConsole' height='${ui.em}' src='img/attack.png'/> `;
ui.healIcon = `<img class='imgInConsole' height='${ui.em}' src='img/heal.png'/> `;



// Load the wizard on screen and start the master clock (first run: level up from 0 to 1).
function start() {
    run.timeStart = performance.now()
    
    playSound("start");
    state.npc = "";
    if (state.firstUse) {
        
        levelUP();
        //artificial levelUP from 0 to 1 to add some vars
        state.firstUse = false;
    };
    if (state.player.hp <= 0){//perfom a weak revive if the player does not revive after reload, loss faith
        state.player.hp = state.player.hpBase * 0.1;
            const feperdida = state.player.hpBase * 0.25;
            state.player.faith = state.player.faith - feperdida
        print(`${wizardName()} loses hope in you and tries to restore himself (${ui.spiritIcon}-${roundNumbertoLetter(feperdida)})`);
    }
    updateHeading();
    drawWizard();
    showStage();
    //load previous locality random scenaria
    nextEvent();
    //trigger event selecter

};

// Pause the game after the current event, or resume it (a story chapter pauses it until its scroll is closed).
function pauseToggle(){
    if (run.pause){
        run.pause = false;
        nextEvent();
    }else{
        run.pause = true;
    }
    
}

// Add the time since the last call to the wizard's total play time.
function setLiveTime(){
    state.meta.playTimeMs += performance.now() - run.timeStart;
    run.timeStart = performance.now()
}


///////////////////////////////////////////////
//  ██████╗ ████████╗██╗  ██╗███████╗██████╗ //
// ██╔═══██╗╚══██╔══╝██║  ██║██╔════╝██╔══██╗//
// ██║   ██║   ██║   ███████║█████╗  ██████╔╝//
// ██║   ██║   ██║   ██╔══██║██╔══╝  ██╔══██╗//
// ╚██████╔╝   ██║   ██║  ██║███████╗██║  ██║//
//  ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝//
///////////////////////////////////////////////                                          
//Other funcs

// At page load: first visit shows the name screen with a suggested name, otherwise the game starts.
function initialName(){

 

    // The Capricor is extinct once its last one was killed (v1 checked this inside the zone data)
    if (state.achievements.logro_ultimocapricor) {
        zones.el_Bosque.enemies = "el_Elfo,Animalejo,el_Ent,el_Herbo,la_Amazona";
    }

    if(state.firstUse){
        el("inputName").value = randomName();
        el("launcher").style.display = "none" ;

    }else{
        start();
    }

}

// Start button on the name screen: keep the typed name (or a random one) and start.
function setName(){
    if(el("inputName").value !== ""){
            if(!state.player.name){state.player.name = el("inputName").value};
        }else{
            if(!state.player.name){state.player.name = randomName()};
        }
        el("launcher").style.display = "none" ;
        el("main").style.display = "block" ;
        state.meta.playTimeMs = 0;
        start();
}

/*
 * v1 developer console - DISABLED in v2, kept for the record.
 * Clicking name -> level -> faith icon opened a box that ran any typed text with eval().
 * Not functional (it still uses the v1 storage API); safe to delete later.
 * Its HTML is commented out at the end of index.html.
 *
 * function exe(){
 *     try{
 *     var exeString = document.getElementById("inputExe").value;
 *     var exeResult = eval(exeString);
 *     print("<span style='color:DarkRed'>DEV: " + exeResult + "</span>")
 *     }catch(err){
 *     print("<span style='color:Red'>DEV error: " + err.message+ "</span>")
 *     }
 *     }
 *
 * //dev acces clic in pjname>lvl>feIcon
 * var devAccess;
 * document.addEventListener("click",function(e){
 * if(e.target.id == "pjName"){
 *     devAccess = 1;
 * }else if(e.target.id == "lvl" && devAccess == 1){
 *     devAccess = 2;
 * }else if(e.target.id == "spiritIcon" && devAccess == 2){
 *     devAccess = undefined;
 *     document.getElementById("exe").style.display = "block";
 * } else {
 *     devAccess = undefined;
 * }
 * });
 *
 * var commands = '<br>FUNCTIONS<br>\
 * pauseToggle() \
 * list(), \
 * setLocal("property", value), \
 * getLocal("property"), \
 * addXP(#factor), \
 * setLocal("forceEvent","#event,#event2"), \
 * <br>VARS<br>\
 * masterTime = #ms, \
 * selfrevivetime = #ms';
 */

//This app is made by Carlos Alonso Maya Lastra by fun//

export {
    initialName,
    pauseToggle,
    setLiveTime,
    setName,
    version,
};
