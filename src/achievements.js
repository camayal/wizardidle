// Wizard Idle v2 - Achievements: unlocking them (logro.set) and listing the unlocked ones.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { achievements } from './data/achievements.js';
import { state, world } from './state.js';
import { ui } from './runtime.js';
import { playSound } from './audio.js';
import { print } from './ui/render.js';
import { updateAchievements } from './ui/scrolls.js';
import { art } from './media.js';






// Game data (enemies, zones, spells, achievements) now lives in src/data/.

// Achievements: definitions from data/achievements.js plus the unlock function.
const logro = {
    ...achievements,
    set: function(nameLogro){
        if(!state.achievements[nameLogro.name]){
        // achievement sound
        playSound("achivement");
        state.achievements[nameLogro.name] = Date.now();
        print(`<img class='imgInConsoleSpecial' height='${ui.em * 1.5}' src='${art(`achivement`)}'><span class='specialTextInConsole' style='font-size:${ui.em * 1.5}px; line-height:${ui.em * 1.5}px;'><b>${nameLogro.title}</b> - ${nameLogro.description}</span>`);
        
        if (ui.scrollCurrentContent == "achievements"){
        updateAchievements();
        }
        }
    }
};

// When an achievement was won, as small grey text (the author's note, 2026-11-15).
function wonText(time){
    if (typeof time != "number") return "";
    const when = new Date(time).toLocaleString("en", {year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"});
    return `<br><small style="color:#7a6a58">${when}</small>`;
}

// Table rows (icon, title, description, when won) for every achievement the wizard has unlocked.
function achievementList(){
    let out = "";
    for (const [text, time] of Object.entries(state.achievements)){
        out += achievementRow(text, time, "");
    }
    return out;
}

function achievementRow(text, time, by){
    if (!logro[text]) return "";
    const earned = by ? `<br><small style="color:#7a6a58">Earned by: ${by}</small>` : "";
    return `<div class="divTableRow achRow"><div class="divTableCell"><img src="${art(`${logro[text].name}`)}" height="${ui.em * 5}px" /></div><div class="divTableCell"><strong>${logro[text].title}</strong> <br>${logro[text].description}${wonText(time)}${earned}</div></div>`;
}

// Achievements earned by wizards who died (kept in their cemetery entry), newest first.
function othersAchievements(){
    const rows = [];
    for (const dead of world.cemetery){
        for (const [text, time] of Object.entries(dead.achievements || {})) rows.push({text, time, by: dead.name});
    }
    return rows.sort((a, b) => (b.time || 0) - (a.time || 0));
}

function othersList(){
    return othersAchievements().map((r) => achievementRow(r.text, r.time, r.by)).join("");
}

// Two scrolls (and ribbons) only when someone besides the current wizard has earned something.
function hasOthers(){
    return othersAchievements().length > 0;
}

// How many achievements this wizard has unlocked.
function countLogros(){
    return Object.keys(state.achievements).length;
}

export {
    achievementList,
    countLogros,
    hasOthers,
    othersList,
    logro,
};
