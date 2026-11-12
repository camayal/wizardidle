// Wizard Idle v2 - Achievements: unlocking them (logro.set) and listing the unlocked ones.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { achievements } from './data/achievements.js';
import { state } from './state.js';
import { ui } from './runtime.js';
import { playSound } from './audio.js';
import { print } from './ui/render.js';
import { updateAchievements } from './ui/scrolls.js';






// Game data (enemies, zones, spells, achievements) now lives in src/data/.

// Achievements: definitions from data/achievements.js plus the unlock function.
const logro = {
    ...achievements,
    set: function(nameLogro){
        if(!state.achievements[nameLogro.name]){
        // achievement sound
        playSound("achivement");
        state.achievements[nameLogro.name] = true;
        print(`<img class='imgInConsoleSpecial' height='${ui.em * 1.5}' src='img/achivement.png'><span class='specialTextInConsole' style='font-size:${ui.em * 1.5}px; line-height:${ui.em * 1.5}px;'><b>${nameLogro.title}</b> - ${nameLogro.description}</span>`);
        
        if (ui.scrollCurrentContent == "achievements"){
        updateAchievements();
        }
        }
    }
};

// Table rows (icon, title, description) for every achievement the wizard has unlocked.
function achievementList(){
    let out = "";
    for (const text of Object.keys(state.achievements)){
        out += `<div class="divTableRow"><div class="divTableCell"><img src="img/${logro[text].name}.png" height="${ui.em * 4}px" /></div><div class="divTableCell"><strong>${logro[text].title}</strong> <br>${logro[text].description}</div></div>`;
    }
    return out;
}

// How many achievements this wizard has unlocked.
function countLogros(){
    return Object.keys(state.achievements).length;
}

export {
    achievementList,
    countLogros,
    logro,
};
