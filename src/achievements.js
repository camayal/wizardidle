// Wizard Idle v2 - Achievements: unlocking them (logro.set) and listing the unlocked ones.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { achievements } from './data/achievements.js';
import { state, world } from './state.js';
import { ui } from './runtime.js';
import { playSound } from './audio.js';
import { printIn } from './ui/render.js';
const print = printIn('achievements');      // the console category (Settings: Text in the console)
import { updateAchievements } from './ui/scrolls.js';
import { art } from './media.js';
import { stats } from './stats.js';
import { tiers, rarityOf } from './data/rarity.js';






// Game data (enemies, zones, spells, achievements) now lives in src/data/.

// Achievements: definitions from data/achievements.js plus the unlock function.
const logro = {
    ...achievements,
    set: function(nameLogro){
        if(!state.achievements[nameLogro.name]){
        // achievement sound
        playSound("achivement");
        state.achievements[nameLogro.name] = Date.now();
        stats.first(`first.achievement.${nameLogro.name}`);   // when (play time, level): the odds model reads it
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
const NONE_YET = `<div style="text-align:center;font-style:italic;color:#7a6a58;margin-top:1.5em">No achievements yet. This wizard's story is still to be written.</div>`;
function achievementList(){
    let out = "";
    for (const [text, time] of Object.entries(state.achievements)){
        out += achievementRow(text, time, "");
    }
    return out || NONE_YET;
}

// The tier name in its colour; the divine one is gold and sparkles (css .rarity-divine).
function rarityTag(text){
    const tier = tiers.find((t) => t.key == (rarityOf[text] || "common"));
    return `<small class="rarity rarity-${tier.key}" style="color:${tier.color}"><b>${tier.name}</b></small> `;
}

// An achievement icon is three 53x53 layers: the one parchment frame (art "logro_frame"), the picture
// on a transparent background, and the wax seal of its tier (art "logro_seal_<tier>"). A missing layer hides itself.
function layer(name, first){
    return `<img class="achLayer${first ? " achPic" : ""}" src="${art(name)}" height="${ui.em * 5}px" onerror="this.style.display='none'" />`;
}
function sealImg(text){
    return layer("logro_seal_" + (rarityOf[text] || "common"), false);
}

function achievementRow(text, time, by){
    if (!logro[text]) return "";
    const earned = by ? `<br><small style="color:#7a6a58">First earned by: ${by}</small>` : "";
    return `<div class="divTableRow achRow"><div class="divTableCell"><span class="achIcon seal-${rarityOf[text] || "common"}">${layer("logro_frame", false)}${layer(logro[text].name, true)}${sealImg(text)}</span></div><div class="divTableCell"><strong>${logro[text].title}</strong> ${rarityTag(text)}<br>${logro[text].description}${wonText(time)}${earned}</div></div>`;
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
