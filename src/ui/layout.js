// Wizard Idle v2 - Screen layout: sizes everything from the window size, in portrait or landscape.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { state } from '../state.js';
import { fight, ui } from '../runtime.js';
import { loadAlterCanvasChar, loadCanvasChar, loadNPC } from './render.js';
import { scrollClose } from './scrolls.js';
import { el } from './dom.js';

//seg





 

 


 
  

/*
 * v1 developer helper (only reachable from the disabled console): listed every
 * decoded localStorage entry. Not functional in v2; safe to delete later.
 *
 * function list(){
 *     scrollOpen()
 *     var txt = "";
 *     for (var i = 0; i < localStorage.length; i++){
 *         txt += hx(localStorage.key(i)) + " = " + hx(localStorage.getItem(localStorage.key(i))) + "<br>"
 *     }
 *     el("innerTextScroll").style.display = "block";
 *     el('innerTextScroll').innerHTML=txt;
 *     el("btnClose").style.top = objectSize * 0.13 + "px";
 * }
 */

//convert secs to string 
 

///////////////////////////////////////////////////////// 
// ██╗      █████╗ ██╗   ██╗ ██████╗ ██╗   ██╗████████╗//
// ██║     ██╔══██╗╚██╗ ██╔╝██╔═══██╗██║   ██║╚══██╔══╝//
// ██║     ███████║ ╚████╔╝ ██║   ██║██║   ██║   ██║   //
// ██║     ██╔══██║  ╚██╔╝  ██║   ██║██║   ██║   ██║   //
// ███████╗██║  ██║   ██║   ╚██████╔╝╚██████╔╝   ██║   //
// ╚══════╝╚═╝  ╚═╝   ╚═╝    ╚═════╝  ╚═════╝    ╚═╝   //
///////////////////////////////////////////////////////// 
//Layout

// Size and place everything for the current window (portrait, or landscape on phones).
function responsiveLayout() {
    
    ui.objectSize = defineObjectSize();
    ui.em = getEM();
    
    //update the icons to avoid bug big icons when start the game in landscape
    ui.goldIcon = "<img class='imgInConsole' height='" + ui.em + "' src='img/gold.png'/> ";
    ui.spiritIcon = "<img class='imgInConsole' height='" + ui.em + "' src='img/spirit.png'/> ";
    ui.attackIcon = "<img class='imgInConsole' height='" + ui.em + "' src='img/attack.png'/> ";
    ui.healIcon = "<img class='imgInConsole' height='" + ui.em + "' src='img/heal.png'/> ";

    let x, i;
    if (!!document.getElementsByClassName("imgInConsole")[0]){
    x = document.getElementsByClassName("imgInConsole");
    
    for (i = 0; i < x.length; i++) {
        x[i].style.height = ui.em + "px";
        x[i].style.width = ui.em + "px";
    }
    }

    if (!!document.getElementsByClassName("imgInConsoleSpecial")[0]){
        x = document.getElementsByClassName("imgInConsoleSpecial");
        
        for (i = 0; i < x.length; i++) {
            x[i].style.height = ui.em * 1.5 + "px";
            x[i].style.width = ui.em * 1.5 + "px";
        }
        }

    if (!!document.getElementsByClassName("specialTextInConsole")[0]){
    x = document.getElementsByClassName("specialTextInConsole");
    
    for (i = 0; i < x.length; i++) {
        x[i].style.fontSize = ui.em * 1.5 + "px";
        x[i].style.lineHeight = ui.em *1.5 + "px";
    }
    }
        
    
    
    const orientation = screen.msOrientation || (screen.orientation || screen.mozOrientation || {}).type;
    //block for detect landscape in mobile and change the elements

    
    if (!!orientation.match("landscape") && detectmob()){//solved the problem that landscape-secondary does not trigger the landscape mode
        layoutLandscapeMobile();
        if (parseInt(el("scrollBackCenter").style.minHeight) > 0) {
            if (ui.scrollCurrentContent != "history"){//avoid close scroll in a history
                scrollClose()
            }
        }
    }else{
        layoutPortrait();
    }

    
     
     ui.headLevel = ui.objectSize * 0.109375;//56;
     ui.charWidth = ui.charHeight = ui.squareSide = ui.objectSize * 0.125;//64;
     //load chars if was ok to redraw
    if (state.npc) {
        loadNPC(state.npc);
    }
    if(!state.firstUse){loadCanvasChar(state.player.lvl, ui.squareSide, ui.headLevel);}
    if (fight.pjDead){loadAlterCanvasChar("muerto", ui.squareSide, ui.headLevel);
};
    

};


let centerMain;
let centerLauncher;
// Base size of the game square: half the window height on desktop, 90% of the width on phones.
function defineObjectSize() {
     if (!detectmob()) {
        ui.objectSize = window.innerHeight / 2;//better adaptation 
    } else {
        ui.objectSize = window.innerWidth * 0.9;
    }
    ;return ui.objectSize;
}


// Is this a phone or tablet (by user agent)?
function detectmob() { 
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    return true;
  }
 else {
    return false;
  }
}


// Base font size, proportional to the game square.
function getEM(){
    ui.em = ui.objectSize * 0.04;
    return ui.em;
}



// Set inline styles on one element; numbers are written as pixels.
function setStyles(id, styles) {
    const style = el(id).style;
    for (const [property, value] of Object.entries(styles)) {
        style[property] = typeof value === "number" ? value + "px" : value;
    }
}

// The same styles on several elements.
function setEach(ids, styles) {
    for (const id of ids) setStyles(id, styles);
}

const CANVASES = ["esceneCanvas", "pjCanvas", "npcCanvas", "spellCanvas"];
const TOOLBAR = ["btn1", "btn2", "btn3", "btn4", "btn5", "btn6"];
const HEADING_ICONS = ["hpIcon", "goldIcon", "spiritIcon"];

// Layout for desktop and phones held upright: heading, scene, then the console.
// Everything is proportional to ui.objectSize (s); the console fills the remaining height.
function layoutPortrait(){
    const s = ui.objectSize, em = ui.em, W = window.innerWidth, H = window.innerHeight;
    const button = s * 0.09375;                      // toolbar button size, also the launcher's font unit

    if (state.firstUse) {
        setStyles("nubes", { display: "none" });
        setStyles("launcher", { display: "block" });
    } else {
        setStyles("launcher", { display: "none" });
        setStyles("main", { display: "block" });
    }

    // sizes everything else depends on
    const headingH = s * 0.21;
    const marcoH = s * 0.3125;
    const sceneH = s * 0.25;
    const backConsoleH = H - parseInt(sceneH) * 1.2 - parseInt(headingH) * 1.2;
    const scrollH = H - (s * 0.25) * 1.5;
    const sceneLeft = parseInt(marcoH) * 0.1;
    const pjBtnW = s * 0.325, centerBtnW = s * 0.35;
    const startBtnW = (button * 1.90625) * 1.5;

    // heading
    setStyles("heading", { height: headingH });
    setStyles("pjName", { fontSize: button, width: s * 0.7 });
    setStyles("XPprogressBar", { display: "block", width: s * 0.7, height: s * 0.035, top: button * 1.125 });
    setStyles("indicadores", { fontSize: s * 0.045, width: s * 0.7, top: button * 1.57, display: "flex", justifyContent: "space-between" });
    setEach(HEADING_ICONS, { height: s * 0.045, width: s * 0.045 });
    setEach(TOOLBAR, { display: "block", width: button });
    setEach(["btn1", "btn4"], { left: s * 0.75 });
    setEach(["btn2", "btn5"], { left: s * 0.75 + (s * 0.1) });
    setEach(["btn3", "btn6"], { left: s * 0.75 + (s * 0.1) * 2 });
    setEach(["btn1", "btn2", "btn3"], { top: s * 0.01 });
    setEach(["btn4", "btn5", "btn6"], { top: s * 0.11 });

    // game area, scene and console
    setStyles("main", { width: s, height: H, left: (W / 2) - (s * 1.0625 / 2), top: H * 0.005 });
    setStyles("marco", { width: s * 1.0625, height: marcoH });
    setEach(CANVASES, { width: s, height: sceneH, left: sceneLeft });
    setStyles("pjDivineBtn", { width: pjBtnW, height: s * 0.25, left: sceneLeft });
    setStyles("centerDivineBtn", { width: centerBtnW, height: s * 0.25, left: parseInt(sceneLeft) + parseInt(pjBtnW) });
    setStyles("npcDivineBtn", { width: pjBtnW, height: s * 0.25, left: parseInt(sceneLeft) + parseInt(pjBtnW) + parseInt(centerBtnW) });
    setStyles("console", { display: "block", fontSize: em, width: s, height: parseInt(backConsoleH) * 0.94, left: s * 0.03 });
    setStyles("backConsole", { display: "block", width: s + (s * 0.075), height: backConsoleH, left: (s * -0.01) });
    setStyles("statusText", { fontSize: em * 2, left: s });

    // vertical order: scene above the console, or below it while a scroll is open
    const sceneDivine = ["pjDivineBtn", "npcDivineBtn", "centerDivineBtn"];
    if (ui.sceneOnTop) {
        setStyles("marco", { top: parseInt(headingH) + parseInt(headingH) * 0.1 });
        setEach([...CANVASES, ...sceneDivine], { top: parseInt(headingH) + (parseInt(marcoH) * 0.165) });
        setStyles("console", { top: parseInt(headingH) + parseInt(marcoH) + (parseInt(marcoH) * 0.2) });
        setStyles("backConsole", { top: parseInt(headingH) + parseInt(marcoH) + (parseInt(marcoH) * 0.1) });
        setStyles("statusText", { top: parseInt(headingH) + parseInt(marcoH) + (parseInt(marcoH) * 0.2) + (parseInt(backConsoleH) * 0.925) });
    } else {
        setStyles("console", { top: parseInt(headingH) + parseInt(headingH) * 0.2 });
        setStyles("backConsole", { top: headingH });
        setStyles("marco", { top: parseInt(headingH) + parseInt(backConsoleH) });
        setEach([...CANVASES, ...sceneDivine], { top: parseInt(headingH) + parseInt(backConsoleH) + (parseInt(marcoH) * 0.1) });
        setStyles("statusText", { top: parseInt(headingH) + (parseInt(backConsoleH) * 0.925) });
    }

    // name screen
    setStyles("launcher", { width: s / 0.9, height: H, left: (W / 2) - ((s / 0.9) / 2) });
    setStyles("fondoLauncher", { width: s / 0.9, height: H, left: 0, top: 0 });
    setStyles("title1", { fontSize: button * 2.5, left: s * 0.16, top: H * 0.1 });
    setStyles("title2", { fontSize: button * 1.5, left: s * 0.7, top: H * 0.20 });
    setStyles("labelInputName", { fontSize: button * 0.5, width: s * 1.085, left: s * 0.03, top: H * 0.45 });
    setStyles("inputName", { fontSize: button * 1.5, width: s * 1.085, top: H * 0.5 });
    setStyles("startBtn", { width: startBtnW, height: button * 1.5, left: ((s * 1.085 - parseInt(startBtnW)) / 2), top: H * 0.7 });
    setStyles("footer", { fontSize: button * 0.6, left: s * 0.1, top: H * 0.9 });

    // scroll and map
    setStyles("scroll", { width: s, left: (W / 2) - (s * 1.0625 / 2), top: s * 0.02 });
    setEach(["scrollBackCenter", "scrollBackUp", "scrollBackDown"], { width: s + (s * 0.075), left: (s * -0.01) });
    setEach(["scrollBackCenter", "scrollBackUp"], { top: s * 0.02 });
    setStyles("scrollText", { fontSize: em, margin: em / 2, width: s, height: scrollH, left: s * 0.03, top: s * 0.065 });
    setStyles("btnClose", { width: button, left: s * 0.75 + (s * 0.1) * 2, top: s * 0.065 });
    if (parseInt(el("scrollBackCenter").style.minHeight) > 0) {     // the scroll is open: resize it too
        setStyles("scrollBackCenter", { minHeight: scrollH * 0.97 });
        setStyles("scrollText", { minHeight: scrollH * 0.92 });
        setStyles("scrollBackDown", { top: scrollH * 0.97 });
    }
    setStyles("zoneMap", { fontSize: em * 2.5 });
    setStyles("backMapa", { width: s, left: 0, top: s * 0.1 });
    setStyles("bocadilloMapa", { width: s * 0.075 });
    setStyles("pjMapa", { width: s * 0.065 });
}


// Layout for phones held sideways: only the heading and the scene (no console, no toolbar).
function layoutLandscapeMobile(){
    const s = ui.objectSize, em = ui.em, W = window.innerWidth, H = window.innerHeight;

    if (state.firstUse) {
        setStyles("launcher", { display: "none" });
        setStyles("nubes", { display: "block" });
    } else {
        setStyles("launcher", { display: "none" });
        setStyles("main", { display: "block" });
    }

    const headingH = s * 0.24;
    const marcoH = s * 0.3125;
    const sceneTop = parseInt(headingH) + (parseInt(marcoH) * 0.1);
    const sceneLeft = parseInt(marcoH) * 0.1;
    const pjBtnW = s * 0.325, centerBtnW = s * 0.35;

    // hidden in landscape
    setEach(["console", "backConsole", ...TOOLBAR], { display: "none" });

    // heading
    setStyles("heading", { height: headingH });
    setStyles("pjName", { fontSize: s * 0.11, width: W * 0.90 });
    setStyles("XPprogressBar", { width: W * 0.95, height: s * 0.03, top: s * 0.13 });
    setStyles("indicadores", { fontSize: s * 0.05, width: W * 0.95, top: s * 0.17, display: "flex", justifyContent: "space-between" });
    setEach(HEADING_ICONS, { height: s * 0.05, width: s * 0.05 });
    setStyles("statusText", { fontSize: em * 2, left: W * 0.925, top: s * 0.01 });

    // scene
    setStyles("main", { width: s, left: (W - s) / 2 - (W * 0.025) });
    setStyles("marco", { width: s * 1.0625, height: marcoH, top: parseInt(headingH) });
    setEach(CANVASES, { width: s, height: s * 0.25, left: sceneLeft, top: sceneTop });
    setStyles("pjDivineBtn", { width: pjBtnW, height: s * 0.25, left: sceneLeft, top: sceneTop });
    setStyles("centerDivineBtn", { width: centerBtnW, height: s * 0.25, left: parseInt(sceneLeft) + parseInt(pjBtnW), top: sceneTop });
    setStyles("npcDivineBtn", { width: pjBtnW, height: s * 0.25, left: parseInt(sceneLeft) + parseInt(pjBtnW) + parseInt(centerBtnW), top: sceneTop });

    // clouds behind the name screen
    setStyles("nubes", { width: W, height: H, left: 0, top: 0 });

    // scroll
    setStyles("scroll", { width: W * 0.98, left: s * 0.01, top: s * 0.02 });
    setEach(["scrollBackCenter", "scrollBackUp", "scrollBackDown"], { width: W * 0.98 });
    setEach(["scrollBackCenter", "scrollBackUp"], { top: s * 0.02 });
    setStyles("scrollText", { fontSize: s * 0.05, width: W * 0.92, left: s * 0.03, top: s * 0.06 });
    setStyles("btnClose", { width: s * 0.09375, left: s * 0.75 + (s * 0.1) * 2, top: s * 0.065 });
    if (parseInt(el("scrollBackCenter").style.minHeight) > 0) {     // the scroll is open: resize it too
        setStyles("scrollBackCenter", { minHeight: H * 0.8 });
        setStyles("scrollText", { minHeight: H * 0.7 });
        setStyles("scrollBackDown", { top: H * 0.8 });
    }
}

export {
    defineObjectSize,
    detectmob,
    getEM,
    layoutPortrait,
    responsiveLayout,
};
