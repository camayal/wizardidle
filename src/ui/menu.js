// Wizard Idle v2 - The toolbar: achievements, stats, kill, map and help buttons, and closing the scroll.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { deleteSave, state, world } from '../state.js';
import { run, ui } from '../runtime.js';
import * as loop from '../loop.js';
import { pauseToggle } from '../game.js';
import { masterTime } from '../config.js';
import { localizarBocadillo, scrollClose, scrollOpen, updateAchievements, updateHelp, updateKill, updateStats } from './scrolls.js';

//////////////////////////////END OTHER REGION//////////////////////////////////
//------------------------------------------------------------------------------//

///////////////////////////////////////////////////////////////////
// ██████╗ ██╗   ██╗████████╗████████╗ ██████╗ ███╗   ██╗███████╗//
// ██╔══██╗██║   ██║╚══██╔══╝╚══██╔══╝██╔═══██╗████╗  ██║██╔════╝//
// ██████╔╝██║   ██║   ██║      ██║   ██║   ██║██╔██╗ ██║███████╗//
// ██╔══██╗██║   ██║   ██║      ██║   ██║   ██║██║╚██╗██║╚════██║//
// ██████╔╝╚██████╔╝   ██║      ██║   ╚██████╔╝██║ ╚████║███████║//
// ╚═════╝  ╚═════╝    ╚═╝      ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚══════╝//
///////////////////////////////////////////////////////////////////
//Buttons

//Kill button funct
function killBtn(){
    updateKill();
    document.getElementById("innerTextScroll").style.display = "block";
    scrollOpen("kill");    
}

function realKill(){
    world.cemetery.push({
        name: state.player.name,
        lvl: state.player.lvl,
        age: state.player.age,
        born: state.meta.createdAt,
        died: new Date().toISOString(),
    });
    loop.stopAll(); // every clock, including any v1 would have leaked
    run.multipleEventsCounter = 0;
    deleteSave();
    location.reload();
}


//control close button in the scroll
function btnCloseEvent(){
    if (ui.scrollCurrentContent == "history"){//unpause game after history
       pauseToggle();
    }
    scrollClose()
}


//map button funct
function mapBtn(){
    if(state.zone.current == "la_Mina" || state.zone.current == "la_Cueva" || state.zone.current == "el_Volcan"){
        document.getElementById("backMapa").src = "img/mapaunderground.png";
    }else{
        document.getElementById("backMapa").src = "img/mapa.png";
    }
    document.getElementById("bocadilloMapa").src = "img/bocadillo.png";
    document.getElementById("pjMapa").src = "img/lvl" + Math.floor(state.player.lvl / 10) * 10 + ".png";
    document.getElementById("mapa").style.display = "block";
    localizarBocadillo()
    
    
    scrollOpen("map");
}


//help button funct
function helpBtn(){
    updateHelp();
    document.getElementById("innerTextScroll").style.display = "block";
    scrollOpen("help");
}


//stats button funct
function statsBtn(){
    //document.getElementById('innerTextScroll').innerHTML= statsPage;
    loop.every("stats", updateStats,masterTime);
    updateStats();
    document.getElementById("innerTextScroll").style.display = "block";
    scrollOpen("stats");
}



function archBtn(){
    updateAchievements();
    document.getElementById("innerTextScroll").style.display = "block";
    scrollOpen("achievements");

}

export {
    archBtn,
    btnCloseEvent,
    helpBtn,
    killBtn,
    mapBtn,
    realKill,
    statsBtn,
};
