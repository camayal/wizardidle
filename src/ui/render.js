// Wizard Idle v2 - Drawing the game: the heading (name, level, XP bar, HP, gold, faith), the console, the scene
// background, the wizard and the enemy, and their idle animations.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { roundNumbertoLetter } from '../utils.js';
import { state } from '../state.js';
import { fight, run, ui } from '../runtime.js';
import * as loop from '../loop.js';
import { setLiveTime } from '../game.js';
import { MAXLINESINCONSOLE } from '../config.js';
import { logro } from '../achievements.js';
import { localizarBocadillo } from './scrolls.js';
import { el } from './dom.js';

////////////////////////////////////////////////////////////////////////////////////
// ██████╗ ███████╗███████╗██╗███╗   ██╗██╗████████╗██╗ ██████╗ ███╗   ██╗███████╗//
// ██╔══██╗██╔════╝██╔════╝██║████╗  ██║██║╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝//
// ██║  ██║█████╗  █████╗  ██║██╔██╗ ██║██║   ██║   ██║██║   ██║██╔██╗ ██║███████╗//
// ██║  ██║██╔══╝  ██╔══╝  ██║██║╚██╗██║██║   ██║   ██║██║   ██║██║╚██╗██║╚════██║//
// ██████╔╝███████╗██║     ██║██║ ╚████║██║   ██║   ██║╚██████╔╝██║ ╚████║███████║//
// ╚═════╝ ╚══════╝╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝//
////////////////////////////////////////////////////////////////////////////////////
//Author:  Carlos Alonso Maya Lastra
const esceneCanvas = el("esceneCanvas");
const pjCanvas = el("pjCanvas");
const npcCanvas = el("npcCanvas");


// Refresh the heading: name, level, XP bar, HP, gold and faith.
function updateHeading() {
    if (!run.simulation) showHeading();
    if (state.player.faith < -10000){logro.set(logro.logro_hategod)}
    //calcule % of xp bar
    ui.xpPercent = 1 - (state.player.xpNext - state.player.xp) / (state.player.xpNext - state.player.xpPast)
};

// The heading on screen (skipped in a simulation, where nobody looks).
function showHeading() {
    el('pjName').innerText = state.player.name;
    el('lvl').innerText = `Lv. ${state.player.lvl}`;
    el("XPprogressBar").max = state.player.xpNext;
    el("XPprogressBar").min = state.player.xpPast;
    el("XPprogressBar").value = state.player.xp;
    el('hp').innerText = roundNumbertoLetter(state.player.hp);
    el('gold').innerText = roundNumbertoLetter(state.player.gold);
    el('fe').innerText = roundNumbertoLetter(state.player.faith);
    const hpPercent = state.player.hp / state.player.hpBase;
    el("hpIcon").src = heartMeter(hpPercent);
}

// Heart icon for the enemy's remaining HP (fraction from 0 to 1).
function heartMeter(hpPercent){
    if (hpPercent > 0.75) return "img/heart.png";
    if (hpPercent > 0.5) return "img/heart75.png";
    if (hpPercent > 0.1) return "img/heart50.png";
    if (hpPercent > 0) return "img/heart10.png";
    if (hpPercent <= 0) return "img/heart0.png";
}

// Refresh the enemy heart icon used in console messages.
function updateHeartNPC(){
ui.heartIcon = `<img style="filter: hue-rotate(45deg)" class="imgInConsole" height="${ui.em}" src="${heartMeter(Math.round(fight.enemyHP) / fight.enemyHPbase)}"/> `;
}




/////////////////////////////////////////////////////////
//  ██████╗ ██████╗  █████╗ ██████╗ ██╗  ██╗██╗ ██████╗//
// ██╔════╝ ██╔══██╗██╔══██╗██╔══██╗██║  ██║██║██╔════╝//
// ██║  ███╗██████╔╝███████║██████╔╝███████║██║██║     //
// ██║   ██║██╔══██╗██╔══██║██╔═══╝ ██╔══██║██║██║     //
// ╚██████╔╝██║  ██║██║  ██║██║     ██║  ██║██║╚██████╗//
//  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝╚═╝ ╚═════╝//
/////////////////////////////////////////////////////////
//Graphics

// Draw a background (a zone stage, altar, inn...) and move the map marker.
function loadBackground(back) {
    ui.currentBackGround = back;
    if (run.simulation) return;     // in a simulation only what's on the scene matters
    esceneCanvas.style.background = `url('img/${back.toLowerCase()}.png') no-repeat`;
    esceneCanvas.style.backgroundSize = "contain";
    //change bocadillo location
    localizarBocadillo();
};

// Images are loaded once and reused (v1 created a new Image for every redraw).
const imageCache = new Map();
const latestDraw = {};

// Call draw(img) with the image at src, now if it's already loaded, otherwise when it loads.
// Each canvas only keeps its latest request: an older image that finishes loading late is
// not drawn over a newer one.
function withImage(canvasName, src, draw) {
    const ticket = latestDraw[canvasName] = (latestDraw[canvasName] || 0) + 1;
    let img = imageCache.get(src);
    if (!img) {
        img = new Image();
        img.src = src;
        imageCache.set(src, img);
    }
    if (img.complete && img.naturalWidth > 0) {
        draw(img);
    } else {
        img.addEventListener("load", () => { if (latestDraw[canvasName] === ticket) draw(img); }, { once: true });
    }
}

// Draw the wizard; his sprite changes with the level (img/lvl<N>.png, every 10 levels).
function loadCanvasChar(lvl, squareSide, headLevel) {
    if (run.simulation) return;
    pjCanvas.width = pjCanvas.offsetWidth;
    pjCanvas.height = pjCanvas.offsetHeight;
    withImage("pj", `img/lvl${Math.floor(lvl / 10) * 10}.png`, (img) => {
        const ctx = pjCanvas.getContext("2d");
        ctx.drawImage(img, squareSide, headLevel, ui.charWidth, ui.charHeight);
    });
}

// Draw the wizard with his normal sprite for his level.
function drawWizard() {
    loadCanvasChar(state.player.lvl, ui.squareSide, ui.headLevel);
}

// Remove the enemy (or object) from the right side of the scene.
function clearNPC() {
    npcCanvas.getContext("2d").clearRect(0, 0, npcCanvas.width, npcCanvas.height);
    state.npc = "";
}

// Show the background of the stage the wizard is on.
function showStage() {
    loadBackground(state.zone.current + state.zone.stage);
}

// The wizard's name in bold, as most console messages start.
function wizardName() {
    return `<b>${state.player.name}</b>`;
}



// Draw another image in the wizard's place (e.g. the skull when he falls).
function loadAlterCanvasChar(imagen, squareSide, headLevel) {
    if (run.simulation) return;
    pjCanvas.width = pjCanvas.offsetWidth;
    pjCanvas.height = pjCanvas.offsetHeight;
    const img = new Image();
    img.src = `img/${imagen}.png`;
    img.addEventListener("load", function() {
        const ctx = pjCanvas.getContext("2d");
        ctx.clearRect(0, 0, pjCanvas.width, pjCanvas.height);
        ctx.drawImage(img, squareSide, headLevel, ui.charWidth, ui.charHeight);
    }, false);
}


// Draw the enemy or object on the right, sized by type (bosses, objects, the rest).
function loadNPC(npc, squareSideIn=ui.squareSide, headLevelIn=ui.headLevel, charWidthIn=ui.charWidth, charHeightIn=ui.charHeight) {
    state.npc = npc;
    if (run.simulation) return;
    npcCanvas.width = npcCanvas.offsetWidth;
    npcCanvas.height = npcCanvas.offsetHeight;
    withImage("npc", `img/${npc}.png`, (img) => {
        const ctx = npcCanvas.getContext("2d");
        //medium size bosses (64x64px)
        if (state.npc === "arcangel" || state.npc === "doria" || state.npc === "midas" || state.npc === "kkck" || state.npc === "herbus" || state.npc === "skeleton" || state.npc === "medusa" || state.npc === "rainbow" || state.npc === "rojo") {
            ctx.drawImage(img, squareSideIn * 6, headLevelIn - (ui.objectSize * 0.03515625), charWidthIn * 1.25, charHeightIn * 1.25);
        }
        //big bosses (64x64px)
        else if (state.npc === "bicaptop" || state.npc === "cuboq" || state.npc === "etymos" || state.npc === "fenix" || state.npc === "goro" || state.npc === "infraespectro" || state.npc === "protromus" || state.npc.match("hydskon") || state.npc.match("icedra")) {
            ctx.drawImage(img, squareSideIn * 6, headLevelIn - (ui.objectSize * 0.0625), charWidthIn * 1.5, charHeightIn * 1.5);
        }
        //huge bosses (64x96px)
        else if (state.npc.match("mother") || state.npc.match("guardian")){
            ctx.drawImage(img, squareSideIn * 6, headLevelIn - (ui.objectSize * 0.113), charWidthIn * 1.33, charHeightIn * 1.9);
        }
        //objects to get (20x20px)
        else if(state.npc.match("libro") || state.npc.match("runa")){
            ctx.drawImage(img, squareSideIn * 2, headLevelIn * 1.6, charWidthIn / 3, charHeightIn / 3);
        }
        //the remaining (32x32px)
        else {
            ctx.drawImage(img, squareSideIn * 6, headLevelIn, charWidthIn, charWidthIn);
        }
    });
}


// Make the wizard hop for a few frames (run by the animPJ clock).
function animatePJ() {


    ui.frameCounter += 1;
    switch (ui.frameCounter) {
    case 1:

        loadCanvasChar(state.player.lvl, ui.squareSide - ui.jumpSpace, ui.headLevel);
        break;
    case 2:
       loadCanvasChar(state.player.lvl, ui.squareSide, ui.headLevel);
        ui.frameCounter = 0;
        loop.stop("animPJ");
    }
};

// Make the enemy hop for a few frames (run by the animNPC clock).
function animateNPC() {  


    if (state.npc != ""){
        ui.frameCounter += 1;
        switch (ui.frameCounter) {
        case 1:
            loadNPC(state.npc, ui.squareSide + (ui.jumpSpace / 6));
            break;
        case 2:
            loadNPC(state.npc);
            ui.frameCounter = 0;
            loop.stop("animNPC");
        }
    } else {
        loop.stop("animNPC");   // nobody left to hop (v1 kept this clock running forever)
    }
};



// Add a line at the top of the console, keeping at most MAXLINESINCONSOLE lines.
function print(data) {
    setLiveTime(); //set seconds of game and add to total time
    if (run.simulation) return;     // nobody reads the console in a simulation
    el("console").innerHTML = `${data}<br>${el("console").innerHTML}`;
    const brSplit = el('console').innerHTML.split("<br>")
    if (brSplit.length > MAXLINESINCONSOLE) {
        brSplit.splice(-1, 1);
        el("console").innerHTML = brSplit.join("<br>");
    }
    ;
};

export {
    withImage,
    clearNPC,
    drawWizard,
    showStage,
    wizardName,
    animateNPC,
    animatePJ,
    loadAlterCanvasChar,
    loadBackground,
    loadCanvasChar,
    loadNPC,
    npcCanvas,
    pjCanvas,
    print,
    updateHeading,
    updateHeartNPC,
};
