// Wizard Idle v2 - The toolbar: achievements, stats, kill, map and help buttons, and closing the scroll.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { deleteSave, state, world } from '../state.js';
import { run, ui } from '../runtime.js';
import * as loop from '../loop.js';
import { pauseToggle } from '../game.js';
import { masterTime } from '../config.js';
import { localizarBocadillo, scrollClose, scrollOpen, updateAchievements, updateHelp, updateKill, updateStats } from './scrolls.js';
import { el } from './dom.js';
import { stats } from '../stats.js';
import { clearNPC, playWizardAnim } from './render.js';

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

// Toolbar: open the kill scroll.
function killBtn(){
    ui.scrollViews.kill = "kill";
    updateKill();
    el("innerTextScroll").style.display = "block";
    scrollOpen("kill");    
}

// Kill the wizard for good: record him in the cemetery, stop every clock, delete the save; he
// falls for the last time (the true-death animation) and the page reloads.
function realKill(){
    world.cemetery.push({
        name: state.player.name,
        lvl: state.player.lvl,
        age: state.player.age,
        born: state.meta.createdAt,
        died: new Date().toISOString(),
        kills: stats.get("kill.enemies") + stats.get("kill.rare"),
        falls: stats.get("death.falls"),
    });
    loop.stopAll(); // every clock, including any v1 would have leaked
    run.multipleEventsCounter = 0;
    deleteSave();
    scrollClose();
    clearNPC();
    playWizardAnim("fall_dead");
    setTimeout(() => location.reload(), 2200);
}


// Close button of the scroll.
function btnCloseEvent(){
    if (ui.scrollCurrentContent == "history"){//unpause game after history
       pauseToggle();
    }
    scrollClose()
}


// Toolbar: open the map with the wizard's position.
function mapBtn(){
    if(state.zone.current == "la_Mina" || state.zone.current == "la_Cueva" || state.zone.current == "el_Volcan"){
        el("backMapa").src = "img/mapaunderground.png";
    }else{
        el("backMapa").src = "img/mapa.png";
    }
    el("bocadilloMapa").src = "img/bocadillo.png";
    el("pjMapa").src = `img/lvl${Math.floor(state.player.lvl / 10) * 10}.png`;
    el("mapa").style.display = "block";
    localizarBocadillo()
    
    
    scrollOpen("map");
}


// Toolbar: open the help scroll.
function helpBtn(){
    updateHelp();
    el("innerTextScroll").style.display = "block";
    scrollOpen("help");
}


// Toolbar: open the stats scroll (refreshed while open).
function statsBtn(){
    ui.scrollViews.stats = "stats";
    loop.every("stats", updateStats,masterTime);
    updateStats();
    el("innerTextScroll").style.display = "block";
    scrollOpen("stats");
}



// Toolbar: open the achievements scroll.
function archBtn(){
    updateAchievements();
    el("innerTextScroll").style.display = "block";
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
