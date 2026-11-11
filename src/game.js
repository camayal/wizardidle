// Wizard Idle v2 - Start of the game: the name screen, loading a wizard, play time, and the starting values of the
// shared runtime objects (set here in the same order v1 set them).
// Original game hand-written by Carlos Alonso Maya Lastra (2018-2020), see tag v1.0.0.

import { zones } from './data/zones.js';
import { roundNumbertoLetter } from './utils.js';
import { state } from './state.js';
import { fight, run, ui } from './runtime.js';
import * as loop from './loop.js';
import { masterTime } from './config.js';
import { randomName } from './combat.js';
import { event } from './events.js';
import { levelUP } from './wizard.js';
import { playSound } from './audio.js';
import { loadBackground, loadCanvasChar, print, updateHeading } from './ui/render.js';
import { defineObjectSize, getEM } from './ui/layout.js';

var version = "02nov2020_10pm"; //26jul2018_6pm
var uniqueID;
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
ui.goldIcon = "<img class='imgInConsole' height='" + ui.em + "' src='img/gold.png'/> ";
//var heartIcon = "<img class='imgInConsole' height='" + em + "' src='img/heart.png'/> ";

ui.spiritIcon = "<img class='imgInConsole' height='" + ui.em + "' src='img/spirit.png'/> ";
ui.attackIcon = "<img class='imgInConsole' height='" + ui.em + "' src='img/attack.png'/> ";
ui.healIcon = "<img class='imgInConsole' height='" + ui.em + "' src='img/heal.png'/> ";



//Start the game (load everything)
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
            var feperdida = state.player.hpBase * 0.25;
            //localStorage[thx("fe")] = thx(Number(getLocal("fe")) - feperdida);
            state.player.faith = state.player.faith - feperdida
        print("<b>" + state.player.name + "</b> " + "loses hope in you and trys to restore himself (" + ui.spiritIcon + "-" +  roundNumbertoLetter(feperdida) + ")");
    }
    updateHeading();
    loadCanvasChar(state.player.lvl, ui.squareSide, ui.headLevel);
    loadBackground(state.zone.current + state.zone.stage);
    //load previous locality random scenaria
    loop.every("master", event, masterTime);
    //statusClock = setInterval(cacheStatus, 5000);
    //trigger event selecter

};

//permits continue the action but stop in the next event, if paused trigger a new event
function pauseToggle(){
    if (run.pause){
        run.pause = false;
        loop.every("master", event, masterTime);
    }else{
        run.pause = true;
    }
    
}

//Set the timer to avoid loss seconds
function setLiveTime(){
    state.meta.playTimeMs += performance.now() - run.timeStart;
    run.timeStart = performance.now()
}

//Create the localStorage object if it does not exist and add 1 by default to the stats and return the current number



//Do something probability Yes or Not
;



//Get random number in an interval
;

///////////////////////////////////////////////
//  ██████╗ ████████╗██╗  ██╗███████╗██████╗ //
// ██╔═══██╗╚══██╔══╝██║  ██║██╔════╝██╔══██╗//
// ██║   ██║   ██║   ███████║█████╗  ██████╔╝//
// ██║   ██║   ██║   ██╔══██║██╔══╝  ██╔══██╗//
// ╚██████╔╝   ██║   ██║  ██║███████╗██║  ██║//
//  ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝//
///////////////////////////////////////////////                                          
//Other funcs

//Initial name, suggest the first name and put in the input and check if is first launch
//if not first use run the game
//var sessionID;
function initialName(){
    //add uniqueID for this session:
    //sessionID = Math.random().toString(36).substr(2, 16);
    // if(!localStorage[thx("uniqueSessionID")]){
    //     setLocal("uniqueSessionID",sessionID)
    // }
    // if(getLocal("uniqueSessionID") === sessionID){

 

    // The Capricor is extinct once its last one was killed (v1 checked this inside the zone data)
    if (state.achievements.logro_ultimocapricor) {
        zones.el_Bosque.enemies = "el_Elfo,Animalejo,el_Ent,el_Herbo,la_Amazona";
    }

    if(state.firstUse){
        document.getElementById("inputName").value = randomName();
        document.getElementById("launcher").style.display = "none" ;

    }else{
        start();
    }
// }else{
//     document.getElementsByTagName("BODY")[0].style.display = "none";
//     window.location.href="about:blank";
//     alert("Wizardidle is running in another tab!")
// }

}

//Only when start button is pressed
function setName(){
    if(document.getElementById("inputName").value !== ""){
            if(!state.player.name){state.player.name = document.getElementById("inputName").value};
        }else{
            if(!state.player.name){state.player.name = randomName()};
        }
        document.getElementById("launcher").style.display = "none" ;
        document.getElementById("main").style.display = "block" ;
        //fadeOut(document.getElementById("launcher"))
        //fadeIn(document.getElementById("main"))
        state.meta.playTimeMs = 0;
        start();
}

export {
    initialName,
    pauseToggle,
    setLiveTime,
    setName,
    version,
};
