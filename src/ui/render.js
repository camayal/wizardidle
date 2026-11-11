// Wizard Idle v2 - Drawing the game: the heading (name, level, XP bar, HP, gold, faith), the console, the scene
// background, the wizard and the enemy, and their idle animations.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { roundNumbertoLetter } from '../utils.js';
import { state } from '../state.js';
import { fight, ui } from '../runtime.js';
import * as loop from '../loop.js';
import { setLiveTime } from '../game.js';
import { masterTime, MAXLINESINCONSOLE } from '../config.js';
import { logro } from '../achievements.js';
import { localizarBocadillo } from './scrolls.js';

////////////////////////////////////////////////////////////////////////////////////
// ██████╗ ███████╗███████╗██╗███╗   ██╗██╗████████╗██╗ ██████╗ ███╗   ██╗███████╗//
// ██╔══██╗██╔════╝██╔════╝██║████╗  ██║██║╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝//
// ██║  ██║█████╗  █████╗  ██║██╔██╗ ██║██║   ██║   ██║██║   ██║██╔██╗ ██║███████╗//
// ██║  ██║██╔══╝  ██╔══╝  ██║██║╚██╗██║██║   ██║   ██║██║   ██║██║╚██╗██║╚════██║//
// ██████╔╝███████╗██║     ██║██║ ╚████║██║   ██║   ██║╚██████╔╝██║ ╚████║███████║//
// ╚═════╝ ╚══════╝╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝//
////////////////////////////////////////////////////////////////////////////////////
//Definitions
//Author:  Carlos Alonso Maya Lastra
// #region Define vars
var esceneCanvas = document.getElementById("esceneCanvas");
var pjCanvas = document.getElementById("pjCanvas");
var npcCanvas = document.getElementById("npcCanvas");


//Populate and update the headding
function updateHeading() {
    document.getElementById('pjName').innerText = state.player.name;
    document.getElementById('lvl').innerText = "Lv. " + state.player.lvl;
    document.getElementById("XPprogressBar").max = state.player.xpNext;
    document.getElementById("XPprogressBar").min = state.player.xpPast;
    document.getElementById("XPprogressBar").value = state.player.xp;
    document.getElementById('hp').innerText = roundNumbertoLetter(state.player.hp);
    document.getElementById('gold').innerText = roundNumbertoLetter(state.player.gold);
    document.getElementById('fe').innerText = roundNumbertoLetter(state.player.faith);
    var hpPercent = state.player.hp / state.player.hpBase;
    document.getElementById("hpIcon").src = heartMeter(hpPercent);

    if (state.player.faith < -10000){logro.set(logro.logro_hategod)}

    //calcule % of xp bar
    ui.xpPercent = 1 - (state.player.xpNext - state.player.xp) / (state.player.xpNext - state.player.xpPast)

};

function heartMeter(hpPercent){
    if(hpPercent > 0.75 /*&& hpPercent <= 1*/){var heartImg = "img/heart.png"};
    if(hpPercent > 0.5 && hpPercent <= 0.75){var heartImg = "img/heart75.png"};
    if(hpPercent > 0.1 && hpPercent <= 0.5){var heartImg = "img/heart50.png"};
    if(hpPercent > 0 && hpPercent <= 0.1){var heartImg =  "img/heart10.png"};
    if(hpPercent <= 0){var heartImg =  "img/heart0.png"};
    return heartImg
}

//update the level of healt in NPC icon
function updateHeartNPC(){
ui.heartIcon = '<img style="filter: hue-rotate(45deg)" class="imgInConsole" height="' + ui.em + '" src="' + heartMeter(Math.round(fight.enemyHP) / fight.enemyHPbase) + '"/> ';
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

//Load locality
function loadBackground(back) {
    ui.currentBackGround = back;
    esceneCanvas.style.background = "url('img/" + back.toLowerCase() + ".png') no-repeat";
    esceneCanvas.style.backgroundSize = "contain";
    // esceneCanvas.width = esceneCanvas.offsetWidth;
    // esceneCanvas.height = esceneCanvas.offsetHeight;
    // var img = new Image();
    // img.src = "img/" + back.toLowerCase() + ".png";
    // img.addEventListener("load", function() {
    //     var ctx = esceneCanvas.getContext("2d");
    //     ctx.mozImageSmoothingEnabled = false;
    //     ctx.webkitImageSmoothingEnabled = false;
    //     ctx.msImageSmoothingEnabled = false;
    //     ctx.imageSmoothingEnabled = false;
    //     ctx.clearRect(0, 0, esceneCanvas.width, esceneCanvas.height);
    //     ctx.drawImage(img, 0, 0, esceneCanvas.width, esceneCanvas.height);
    // }, false);
    //change bocadillo location
    localizarBocadillo();
};

//Draw main char
function loadCanvasChar(lvl, squareSide, headLevel) {
    pjCanvas.width = pjCanvas.offsetWidth;
    pjCanvas.height = pjCanvas.offsetHeight;
    var img = new Image();
    img.src = "img/lvl" + Math.floor(lvl / 10) * 10 + ".png";
    //round in base 10
    img.addEventListener("load", function() {
        var ctx = pjCanvas.getContext("2d");
        // ctx.mozImageSmoothingEnabled = false;
        // ctx.webkitImageSmoothingEnabled = false;
        // ctx.msImageSmoothingEnabled = false;
        // ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, squareSide, headLevel, ui.charWidth, ui.charHeight);
    }, false);
}



//Draw alter main char for example death symbol
function loadAlterCanvasChar(imagen, squareSide, headLevel) {
    pjCanvas.width = pjCanvas.offsetWidth;
    pjCanvas.height = pjCanvas.offsetHeight;
    var img = new Image();
    img.src = "img/" + imagen + ".png";
    img.addEventListener("load", function() {
        var ctx = pjCanvas.getContext("2d");
        // ctx.mozImageSmoothingEnabled = false;
        // ctx.webkitImageSmoothingEnabled = false;
        // ctx.msImageSmoothingEnabled = false;
        // ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, pjCanvas.width, pjCanvas.height);
        ctx.drawImage(img, squareSide, headLevel, ui.charWidth, ui.charHeight);
    }, false);
}


//Draw NPC
function loadNPC(npc, squareSideIn=ui.squareSide, headLevelIn=ui.headLevel, charWidthIn=ui.charWidth, charHeightIn=ui.charHeight) {
    state.npc = npc;
    npcCanvas.width = npcCanvas.offsetWidth;
    npcCanvas.height = npcCanvas.offsetHeight;
    var img = new Image();
    img.src = "img/" + npc + ".png";
    img.addEventListener("load", function() {
        var ctx = npcCanvas.getContext("2d");
        // ctx.mozImageSmoothingEnabled = false;
        // ctx.webkitImageSmoothingEnabled = false;
        // ctx.msImageSmoothingEnabled = false;
        // ctx.imageSmoothingEnabled = false;
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
    }, false);
}


//Animate pj execute as: loop.every("animPJ", animatePJ, 100);
function animatePJ() {

    //avoid  animation in high speed debug
    if(masterTime < 500){loop.stop("animPJ");return}


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

//Animate npc execute as: loop.every("animNPC", animateNPC, 100);
function animateNPC() {  

    //avoid  animation in high speed debug
    if(masterTime < 500){loop.stop("animNPC");return}


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
    }
};



//Print in ingame-console and cut after 30 lines
function print(data) {
    setLiveTime(); //set seconds of game and add to total time
    document.getElementById("console").innerHTML = data + "<br>" + document.getElementById("console").innerHTML;
    var brSplit = document.getElementById('console').innerHTML.split("<br>")
    if (brSplit.length > MAXLINESINCONSOLE) {
        brSplit.splice(-1, 1);
        document.getElementById("console").innerHTML = brSplit.join("<br>");
    }
    ;
};

export {
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
