// Wizard Idle v2 - Screen layout: sizes everything from the window size, in portrait or landscape.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { headLevelShare } from '../data/connectors.js';
import { state } from '../state.js';
import { fight, ui } from '../runtime.js';
import { drawWizard, drawWizardPose, loadNPC } from './render.js';
import { scrollClose } from './scrolls.js';
import { el } from './dom.js';
import { art } from '../media.js';
import { chosenTextScale, browserTextScale, heightScale } from '../prefs.js';

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
    ui.goldIcon = `<img class='imgInConsole' height='${ui.em}' src='${art(`gold`)}'/> `;
    ui.spiritIcon = `<img class='imgInConsole' height='${ui.em}' src='${art(`spirit`)}'/> `;
    ui.attackIcon = `<img class='imgInConsole' height='${ui.em}' src='${art(`attack`)}'/> `;
    ui.healIcon = `<img class='imgInConsole' height='${ui.em}' src='${art(`heal`)}'/> `;

    let x, i;
    if (!!document.getElementsByClassName("imgInConsole")[0]){
    x = document.getElementsByClassName("imgInConsole");
    
    for (i = 0; i < x.length; i++) {
        x[i].style.height = `${ui.em}px`;
        x[i].style.width = `${ui.em}px`;
    }
    }

    if (!!document.getElementsByClassName("imgInConsoleSpecial")[0]){
        x = document.getElementsByClassName("imgInConsoleSpecial");
        
        for (i = 0; i < x.length; i++) {
            x[i].style.height = `${ui.em * 1.5}px`;
            x[i].style.width = `${ui.em * 1.5}px`;
        }
        }

    if (!!document.getElementsByClassName("specialTextInConsole")[0]){
    x = document.getElementsByClassName("specialTextInConsole");
    
    for (i = 0; i < x.length; i++) {
        x[i].style.fontSize = `${ui.em * 1.5}px`;
        x[i].style.lineHeight = `${ui.em *1.5}px`;
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

    
     
     ui.headLevel = ui.objectSize * headLevelShare(ui.currentBackGround);      // row 28 of 256; row 24 in the connector scenes
     ui.charWidth = ui.charHeight = ui.squareSide = ui.objectSize * 0.125;//64;
     //load chars if was ok to redraw
    if (state.npc) {
        loadNPC(state.npc);
    }
    if(!state.firstUse){drawWizard();}
    if (fight.pjDead){drawWizardPose("fallen");
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
// The text scale is the product of three things: the screen height (tall phones), the browser's own
// text size and the choice made in the settings scroll.
function textScale(){
    return heightScale(window.innerWidth, window.innerHeight, detectmob()) * browserTextScale() * chosenTextScale();
}

function getEM(){
    ui.em = ui.objectSize * 0.04 * textScale();
    return ui.em;
}



// Set inline styles on one element; numbers are written as pixels.
function setStyles(id, styles) {
    const style = el(id).style;
    for (const [property, value] of Object.entries(styles)) {
        style[property] = typeof value === "number" ? `${value}px` : value;
    }
}

// The same styles on several elements.
function setEach(ids, styles) {
    for (const id of ids) setStyles(id, styles);
}

const CANVASES = ["esceneCanvas", "propsCanvas", "pjCanvas", "npcCanvas", "spellCanvas", "overlayCanvas"];
const TOOLBAR = ["btn1", "btn2", "btn3", "btn4", "btn5", "btn6"];
const HEADING_ICONS = ["hpIcon", "goldIcon", "spiritIcon"];

// The XP bar on its dark plate with gilt rules, the indicators below it (the artist's option D).
// u is one art pixel on screen. The plate's gold rules (4 rows on top, 2 below, caps 8 wide)
// keep their size and its dark middle stretches, so the plate can be as tall as the text needs.
// The bar is 10 high (caps 8 wide, the track 4 in from each end), 3 below the plate's top; the
// indicators take the 12 rows under it, in text as big as before.
function layoutXPPlate(top, width, u) {
    setStyles("xpPlate", { left: 0, top, width, height: 28 * u, borderImageWidth: `${4 * u}px ${8 * u}px ${2 * u}px` });
    setStyles("XPprogressBar", { display: "block", left: 4 * u, top: top + 3 * u, width: width - 8 * u, height: 10 * u, borderImageWidth: `0 ${8 * u}px` });
    setStyles("xpTrack", { left: 4 * u, right: 4 * u });
    setStyles("xpFill", { backgroundSize: `${8 * u}px ${10 * u}px` });
    setStyles("indicadores", { left: 8 * u, top: top + 14 * u, width: width - 16 * u, height: 12 * u, fontSize: 11 * u, lineHeight: `${12 * u}px`,
        display: "flex", alignItems: "center", justifyContent: "space-between" });
    setEach(HEADING_ICONS, { height: 11 * u, width: 11 * u });
}

// Layout for desktop and phones held upright: heading, scene, then the console.
// Everything is proportional to ui.objectSize (s); the console fills the remaining height.
function layoutPortrait(){
    const s = ui.objectSize, em = ui.em, W = window.innerWidth, H = window.innerHeight;
    const button = s * 0.09375;                      // the launcher's font unit
    // toolbar: on tall phones the buttons grow and sit closer, the name plate gives up the width
    const kb = heightScale(W, H, detectmob());
    const tb = button * kb, step = tb * 1.04;        // button size and the distance between buttons
    const tbLeft = s * 1.04 - step * 3 + (step - tb), tbTop = s * 0.01;

    if (state.firstUse) {
        setStyles("nubes", { display: "none" });
        setStyles("launcher", { display: "block" });
    } else {
        setStyles("launcher", { display: "none" });
        setStyles("main", { display: "block" });
    }

    // sizes everything else depends on
    // tall phones: the XP plate (bar, HP, gold, spirit) drops under the buttons and takes the full width,
    // so its text can grow with them; otherwise it sits beside the buttons as always
    const tall = kb > 1.02;
    const plateW = tall ? tbLeft - s * 0.04 : Math.min(s * 0.7, tbLeft - s * 0.04);
    const plateU = tall ? Math.min(s * 0.0042 * kb, plateW / 150) : s * 0.0042;
    const plateTop = tall ? tbTop + step + (tb - 28 * plateU) / 2 : s * 0.092;
    const headingH = Math.max(tall ? 0 : s * 0.21, tbTop * 2 + step + tb);
    const marcoH = s * 0.3125;
    const sceneH = s * 0.25;
    const backConsoleH = H - parseInt(sceneH) * 1.2 - parseInt(headingH) * 1.2;
    const scrollH = H - (s * 0.25) * 1.5;
    const sceneLeft = parseInt(marcoH) * 0.1;
    const pjBtnW = s * 0.325, centerBtnW = s * 0.35;
    const startBtnW = (button * 1.90625) * 1.5;

    // heading
    setStyles("heading", { height: headingH });
    setStyles("pjName", { fontSize: button * (tall ? kb : 1), width: Math.min(s * 0.7, tbLeft - s * 0.04) });
    layoutXPPlate(plateTop, plateW, plateU);
    setEach(TOOLBAR, { display: "block", width: tb });
    setEach(["btn1", "btn4"], { left: tbLeft });
    setEach(["btn2", "btn5"], { left: tbLeft + step });
    setEach(["btn3", "btn6"], { left: tbLeft + step * 2 });
    setEach(["btn1", "btn2", "btn3"], { top: tbTop });
    setEach(["btn4", "btn5", "btn6"], { top: tbTop + step });

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
    setStyles("btnClose", { width: tb, left: tbLeft + step * 2, top: s * 0.065 });
    if (parseInt(el("scrollBackCenter").style.minHeight) > 0) {     // the scroll is open: resize it too
        setStyles("scrollBackCenter", { minHeight: scrollH * 0.97 });
        setStyles("scrollText", { minHeight: scrollH * 0.92 });
        setStyles("scrollBackDown", { top: scrollH * 0.97 });
    }
    document.dispatchEvent(new Event("wizardidle:layout"));    // e.g. the stats scroll tab fits itself again
    setStyles("zoneMap", { fontSize: em * 2.5 });
    setStyles("zoneName", { fontSize: em * 2, width: s, left: 0 });
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
    layoutXPPlate(s * 0.117, W * 0.95, s * 0.0042);
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
    document.dispatchEvent(new Event("wizardidle:layout"));    // e.g. the stats scroll tab fits itself again
}

export {
    defineObjectSize,
    detectmob,
    getEM,
    layoutPortrait,
    responsiveLayout,
};
