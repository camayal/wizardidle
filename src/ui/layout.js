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



// Layout for desktop and phones held upright: scene above the console.
function layoutPortrait(){

    if(state.firstUse){
        el("nubes").style.display = "none" ;
        el("launcher").style.display = "block" ;
    }else{
        el("launcher").style.display = "none" ;
        el("main").style.display = "block" ;
    }

    
    el("console").style.display = "block" ;
    el("XPprogressBar").style.display = "block" ;
    el("backConsole").style.display = "block" ;
    el("btn1").style.display = "block" ;
    el("btn2").style.display = "block" ;
    el("btn3").style.display = "block" ;
    el("btn4").style.display = "block" ;
    el("btn5").style.display = "block" ;
    el("btn6").style.display = "block" ;
    
    //fonts
    el("pjName").style.fontSize = ui.objectSize * 0.09375 + "px";
    el("console").style.fontSize = ui.em + "px";
    el("indicadores").style.fontSize = ui.objectSize * 0.045 + "px";
    el("statusText").style.fontSize = ui.em * 2 + "px";
    el("inputName").style.fontSize = (ui.objectSize * 0.09375) * 1.5 + "px";
    el("labelInputName").style.fontSize = (ui.objectSize * 0.09375) * 0.5 + "px";
    el("title1").style.fontSize = (ui.objectSize * 0.09375) * 2.5 + "px";
    el("title2").style.fontSize = (ui.objectSize * 0.09375) * 1.5 + "px";
    el("footer").style.fontSize = (ui.objectSize * 0.09375) * 0.6 + "px";
    el("scrollText").style.fontSize = ui.em + "px";
    
    el("zoneMap").style.fontSize = ui.em * 2.5 + "px";
    el("scrollText").style.margin = ui.em / 2 + "px";

    


    //widths
    el("main").style.width = ui.objectSize + "px";
    el("console").style.width = ui.objectSize + "px";
    el("marco").style.width = ui.objectSize * 1.0625 + "px";
    el("esceneCanvas").style.width = ui.objectSize + "px";
    el("pjCanvas").style.width = ui.objectSize + "px";
    el("npcCanvas").style.width = ui.objectSize + "px";
    el("spellCanvas").style.width = ui.objectSize + "px";
    el("XPprogressBar").style.width  = ui.objectSize * 0.7 + "px";
    el("pjName").style.width  = ui.objectSize * 0.7 + "px";
    el("indicadores").style.width  = ui.objectSize * 0.7 + "px";
    el("btn1").style.width  = ui.objectSize * 0.09375 + "px";
    el("btn2").style.width  = ui.objectSize * 0.09375 + "px";
    el("btn3").style.width  = ui.objectSize * 0.09375 + "px";
    el("btn4").style.width  = ui.objectSize * 0.09375 + "px";
    el("btn5").style.width  = ui.objectSize * 0.09375 + "px";
    el("btn6").style.width  = ui.objectSize * 0.09375 + "px";  
    el("backConsole").style.width = ui.objectSize + (ui.objectSize * 0.075) + "px";
    el("launcher").style.width = ui.objectSize / 0.9 + "px";
    el("fondoLauncher").style.width = ui.objectSize / 0.9 + "px";
    el("inputName").style.width = ui.objectSize * 1.085 + "px";
    el("labelInputName").style.width = ui.objectSize * 1.085 + "px";
    const startBtnW = el("startBtn").style.width  = ((ui.objectSize * 0.09375) * 1.90625) * 1.5 + "px";  
    el("scroll").style.width = ui.objectSize + "px";  
    el("scrollBackCenter").style.width = ui.objectSize + (ui.objectSize * 0.075) + "px";  
    el("scrollBackUp").style.width = ui.objectSize + (ui.objectSize * 0.075) + "px";  
    el("scrollBackDown").style.width = ui.objectSize + (ui.objectSize * 0.075) + "px";  

    el("scrollText").style.width = ui.objectSize + "px";  
    el("btnClose").style.width  = ui.objectSize * 0.09375 + "px";  
    
    const pjBtnWidth = el("pjDivineBtn").style.width = ui.objectSize * 0.325 + "px";
    el("npcDivineBtn").style.width = ui.objectSize * 0.325 + "px";
    const centerDivineBtn = el("centerDivineBtn").style.width = ui.objectSize * 0.35 + "px";

    el("backMapa").style.width = ui.objectSize + "px"; 
    el("bocadilloMapa").style.width  = ui.objectSize * 0.075 + "px";  
    el("pjMapa").style.width  = ui.objectSize * 0.065 + "px";  

    
    
    
    


    //heights
    const headingH = el("heading").style.height = ui.objectSize * 0.21 + "px";
    const marcoH = el("marco").style.height = ui.objectSize * 0.3125 + "px";
    const sceneCanvasH = el("esceneCanvas").style.height = ui.objectSize * 0.25 + "px";
    el("pjCanvas").style.height = ui.objectSize * 0.25 + "px";
    el("npcCanvas").style.height = ui.objectSize * 0.25 + "px";
    el("spellCanvas").style.height = ui.objectSize * 0.25 + "px";
    el("XPprogressBar").style.height  = ui.objectSize * 0.035  + "px";
    const backConsoleH = el("backConsole").style.height = window.innerHeight - parseInt(sceneCanvasH) * 1.2 - parseInt(headingH) * 1.2 + "px";
    const consoleH = el("console").style.height = parseInt(backConsoleH) * 0.94 + "px";
    el("launcher").style.height = window.innerHeight + "px";
    el("fondoLauncher").style.height = window.innerHeight + "px";
    el("startBtn").style.height  = (ui.objectSize * 0.09375) * 1.5 + "px"; 
    el("main").style.height = window.innerHeight + "px";
    el("scrollText").style.height = (window.innerHeight - (ui.objectSize * 0.25) * 1.5) + "px";
    
    el("pjDivineBtn").style.height = ui.objectSize * 0.25 + "px";
    el("npcDivineBtn").style.height = ui.objectSize * 0.25 + "px";
    el("centerDivineBtn").style.height = ui.objectSize * 0.25 + "px";

    //auto resize scroll if is open
    if(parseInt(el("scrollBackCenter").style.minHeight) > 0){
    el("scrollBackCenter").style.minHeight = (window.innerHeight - (ui.objectSize * 0.25) * 1.5) * 0.97 + "px";
    el("scrollText").style.minHeight = (window.innerHeight - (ui.objectSize * 0.25) * 1.5) * 0.92 + "px";
    el("scrollBackDown").style.top = (window.innerHeight - (ui.objectSize * 0.25) * 1.5) * 0.97 + "px";
    }
    

    //lefts
    el("main").style.left = (window.innerWidth / 2) - (ui.objectSize * 1.0625 /2) + "px";
    el("console").style.left = ui.objectSize * 0.03 + "px";
    el("backConsole").style.left = (ui.objectSize * -0.01) + "px";
    el("esceneCanvas").style.left = (parseInt(marcoH) * 0.1) + "px";
    el("pjCanvas").style.left = (parseInt(marcoH) * 0.1) + "px";
    el("npcCanvas").style.left = (parseInt(marcoH) * 0.1) + "px";
    el("spellCanvas").style.left = (parseInt(marcoH) * 0.1) + "px";
    el("btn1").style.left = ui.objectSize * 0.75 + "px";
    el("btn4").style.left = ui.objectSize * 0.75 + "px";
    el("btn2").style.left = ui.objectSize * 0.75 + (ui.objectSize * 0.1) + "px";
    el("btn5").style.left = ui.objectSize * 0.75 + (ui.objectSize * 0.1) + "px";
    el("btn3").style.left = ui.objectSize * 0.75 + (ui.objectSize * 0.1) * 2 +"px";
    el("btn6").style.left = ui.objectSize * 0.75 + (ui.objectSize * 0.1) * 2 + "px";
    el("statusText").style.left = ui.objectSize + "px";
    ////launcher
    el("launcher").style.left = (window.innerWidth / 2) - ((ui.objectSize / 0.9) /2) + "px";
    el("fondoLauncher").style.left = "0px";
    el("labelInputName").style.left = ui.objectSize * 0.03 + "px";
    el("startBtn").style.left = ((ui.objectSize * 1.085 - parseInt(startBtnW)) / 2) + "px";
    
    el("title1").style.left = ui.objectSize * 0.16 + "px";
    el("title2").style.left = ui.objectSize * 0.7 + "px";
    el("footer").style.left = ui.objectSize * 0.1 + "px";
    ////scroll
    el("scroll").style.left = (window.innerWidth / 2) - (ui.objectSize * 1.0625 /2) + "px";
    el("scrollBackCenter").style.left = (ui.objectSize * -0.01) + "px";
    el("scrollBackUp").style.left = (ui.objectSize * -0.01) + "px";
    el("scrollBackDown").style.left = (ui.objectSize * -0.01) + "px";

    el("btnClose").style.left = ui.objectSize * 0.75 + (ui.objectSize * 0.1) * 2 + "px";
    el("scrollText").style.left = ui.objectSize * 0.03 + "px";

    const pjBtnLeft = el("pjDivineBtn").style.left = (parseInt(marcoH) * 0.1) + "px";
    el("centerDivineBtn").style.left = parseInt(pjBtnLeft) + parseInt(pjBtnWidth) + "px";
    el("npcDivineBtn").style.left = parseInt(pjBtnLeft) + parseInt(pjBtnWidth) + parseInt(centerDivineBtn) + "px";
    
    
    el("backMapa").style.left = 0 + "px";
    
    

    //tops
    el("main").style.top = window.innerHeight * 0.005 + "px";

    // define if scene is on top of console, if not invert (useful when scroll is desplayed)
    if (ui.sceneOnTop){
    	//test new organization, scene top
    	el("marco").style.top = parseInt(headingH) + parseInt(headingH) * 0.1 + "px";
    	el("esceneCanvas").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.165) + "px";
    	el("pjCanvas").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.165) + "px";
    	el("npcCanvas").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.165) + "px";
    	el("spellCanvas").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.165) + "px";
		el("pjDivineBtn").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.165) + "px";
		el("npcDivineBtn").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.165) + "px";
		el("centerDivineBtn").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.165) + "px";
    	el("console").style.top = parseInt(headingH) + parseInt(marcoH) + (parseInt(marcoH) * 0.2) + "px";
    	el("backConsole").style.top = parseInt(headingH) + parseInt(marcoH) + (parseInt(marcoH) * 0.1) + "px";
		el("statusText").style.top = parseInt(headingH) + parseInt(marcoH) + (parseInt(marcoH) * 0.2) + (parseInt(backConsoleH) * 0.925) + "px";
	//end test new organization
    }else {
	    el("console").style.top = parseInt(headingH) + parseInt(headingH) * 0.2 + "px";
	    el("backConsole").style.top = headingH;
	    el("marco").style.top = parseInt(headingH) + parseInt(backConsoleH) + "px";
	    el("esceneCanvas").style.top = parseInt(headingH) + parseInt(backConsoleH) + (parseInt(marcoH) * 0.1) + "px";
	    el("pjCanvas").style.top = parseInt(headingH) + parseInt(backConsoleH) + (parseInt(marcoH) * 0.1) + "px";
	    el("npcCanvas").style.top = parseInt(headingH) + parseInt(backConsoleH) + (parseInt(marcoH) * 0.1) + "px";
	    el("spellCanvas").style.top = parseInt(headingH) + parseInt(backConsoleH) + (parseInt(marcoH) * 0.1) + "px";
	    el("pjDivineBtn").style.top = parseInt(headingH) + parseInt(backConsoleH) + (parseInt(marcoH) * 0.1) + "px";
	    el("npcDivineBtn").style.top = parseInt(headingH) + parseInt(backConsoleH) + (parseInt(marcoH) * 0.1) + "px";
	    el("centerDivineBtn").style.top = parseInt(headingH) + parseInt(backConsoleH) + (parseInt(marcoH) * 0.1) + "px";
	    el("statusText").style.top = parseInt(headingH) + (parseInt(backConsoleH) * 0.925) + "px";
    }
	
    el("indicadores").style.top = (ui.objectSize * 0.09375) * 1.57 + "px";
    el("XPprogressBar").style.top = (ui.objectSize * 0.09375) * 1.125 + "px";
    el("btn1").style.top = ui.objectSize * 0.01 + "px";
    el("btn4").style.top = ui.objectSize * 0.11 + "px";
    el("btn2").style.top = ui.objectSize * 0.01 + "px";
    el("btn5").style.top = ui.objectSize * 0.11 + "px";
    el("btn3").style.top = ui.objectSize * 0.01 + "px";
    el("btn6").style.top = ui.objectSize * 0.11 + "px";
    el("title1").style.top = window.innerHeight * 0.1 + "px";
    el("title2").style.top = window.innerHeight * 0.20 + "px";
    el("labelInputName").style.top = window.innerHeight * 0.45 + "px";
    el("inputName").style.top = window.innerHeight * 0.5 + "px";
    el("fondoLauncher").style.top = "0px";
    el("startBtn").style.top = window.innerHeight * 0.7 + "px";

    el("footer").style.top = window.innerHeight * 0.9 + "px";
    el("scroll").style.top = ui.objectSize * 0.02 + "px";
    el("scrollBackCenter").style.top = ui.objectSize * 0.02 + "px";
    el("scrollBackUp").style.top = ui.objectSize * 0.02 + "px";
    el("btnClose").style.top = ui.objectSize * 0.065 + "px";
    el("scrollText").style.top = ui.objectSize * 0.065 + "px";

    el("backMapa").style.top = ui.objectSize * 0.1 + "px";
    
    
    //Others
    el("indicadores").style.display = "flex";
    el("indicadores").style.justifyContent = "space-between";
    el("hpIcon").style.height = ui.objectSize * 0.045 + "px";
    el("goldIcon").style.height = ui.objectSize * 0.045 + "px";
    el("spiritIcon").style.height = ui.objectSize * 0.045 + "px";
    el("hpIcon").style.width = ui.objectSize * 0.045 + "px";
    el("goldIcon").style.width = ui.objectSize * 0.045 + "px";
    el("spiritIcon").style.width = ui.objectSize * 0.045 + "px";
    

 

}


// Layout for phones held sideways.
function layoutLandscapeMobile(){

    if(state.firstUse){
        el("launcher").style.display = "none" ;
        el("nubes").style.display = "block" ;
    }else{
        el("launcher").style.display = "none" ;
        el("main").style.display = "block" ;

    }



    //hide
    el("console").style.display = "none" ;
    el("backConsole").style.display = "none" ;
    el("btn1").style.display = "none" ;
    el("btn2").style.display = "none" ;
    el("btn3").style.display = "none" ;
    el("btn4").style.display = "none" ;
    el("btn5").style.display = "none" ;
    el("btn6").style.display = "none" ;

    //fonts
    el("pjName").style.fontSize = ui.objectSize * 0.11 + "px";
    el("indicadores").style.fontSize = ui.objectSize * 0.05 + "px";
    el("statusText").style.fontSize = ui.em * 2 + "px";
    el("scrollText").style.fontSize = ui.objectSize * 0.05 + "px";

    
    //widths
    el("main").style.width = ui.objectSize + "px";
    el("XPprogressBar").style.width  = window.innerWidth * 0.95  + "px";
    el("pjName").style.width  = window.innerWidth * 0.90 + "px";
    el("indicadores").style.width  = window.innerWidth * 0.95 + "px";
    el("marco").style.width = ui.objectSize * 1.0625 + "px";
    el("esceneCanvas").style.width = ui.objectSize + "px";
    el("pjCanvas").style.width = ui.objectSize + "px";
    el("npcCanvas").style.width = ui.objectSize + "px";
    el("spellCanvas").style.width = ui.objectSize + "px";
    el("nubes").style.width = window.innerWidth + "px";
    el("scroll").style.width = window.innerWidth * 0.98 + "px";  
    el("scrollBackCenter").style.width = window.innerWidth * 0.98 + "px";  
    el("scrollBackUp").style.width = window.innerWidth * 0.98 + "px";
    el("scrollBackDown").style.width = window.innerWidth * 0.98 + "px";  
  
    el("scrollText").style.width = window.innerWidth * 0.92 + "px";  
    el("btnClose").style.width  = ui.objectSize * 0.09375 + "px";  


    const pjBtnWidth = el("pjDivineBtn").style.width = ui.objectSize * 0.325 + "px";
    el("npcDivineBtn").style.width = ui.objectSize * 0.325 + "px";
    const centerDivineBtn = el("centerDivineBtn").style.width = ui.objectSize * 0.35 + "px";


    //heights
    const headingH = el("heading").style.height = ui.objectSize * 0.24 + "px";
    const marcoH = el("marco").style.height = ui.objectSize * 0.3125 + "px";
    el("esceneCanvas").style.height = ui.objectSize * 0.25 + "px";
    el("pjCanvas").style.height = ui.objectSize * 0.25 + "px";
    el("npcCanvas").style.height = ui.objectSize * 0.25 + "px";
    el("spellCanvas").style.height = ui.objectSize * 0.25 + "px";
    el("XPprogressBar").style.height  = ui.objectSize * 0.03  + "px";
    el("nubes").style.height  = window.innerHeight  + "px";

    if(parseInt(el("scrollBackCenter").style.minHeight) > 0){
        el("scrollBackCenter").style.minHeight = window.innerHeight * 0.8 + "px";
        el("scrollText").style.minHeight = window.innerHeight * 0.7 + "px";
        el("scrollBackDown").style.top = window.innerHeight * 0.8 + "px";
    }



    el("pjDivineBtn").style.height = ui.objectSize * 0.25 + "px";
    el("npcDivineBtn").style.height = ui.objectSize * 0.25 + "px";
    el("centerDivineBtn").style.height = ui.objectSize * 0.25 + "px";


    //lefts
    el("main").style.left = (window.innerWidth - ui.objectSize) / 2 - (window.innerWidth * 0.025) + "px";
    el("esceneCanvas").style.left = (parseInt(marcoH) * 0.1) + "px";
    el("pjCanvas").style.left = (parseInt(marcoH) * 0.1) + "px";
    el("npcCanvas").style.left = (parseInt(marcoH) * 0.1) + "px";
    el("spellCanvas").style.left = (parseInt(marcoH) * 0.1) + "px";
    el("statusText").style.left = window.innerWidth * 0.925 + "px";
    el("nubes").style.left = "0px";
    el("btnClose").style.left = ui.objectSize * 0.75 + (ui.objectSize * 0.1) * 2 + "px";
    el("scroll").style.left = ui.objectSize * 0.01 + "px";
    el("scrollText").style.left = ui.objectSize * 0.03 + "px";

    const pjBtnLeft = el("pjDivineBtn").style.left = (parseInt(marcoH) * 0.1) + "px";
    el("centerDivineBtn").style.left = parseInt(pjBtnLeft) + parseInt(pjBtnWidth) + "px";
    el("npcDivineBtn").style.left = parseInt(pjBtnLeft) + parseInt(pjBtnWidth) + parseInt(centerDivineBtn) + "px";


    //tops
    el("indicadores").style.top = ui.objectSize * 0.17 + "px";
    el("XPprogressBar").style.top = ui.objectSize * 0.13 + "px";
    el("statusText").style.top = ui.objectSize * 0.01 + "px";
    el("marco").style.top = parseInt(headingH) + "px";
    el("esceneCanvas").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.1) + "px";
    el("pjCanvas").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.1) + "px";
    el("npcCanvas").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.1) + "px";
    el("spellCanvas").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.1) + "px";
    el("nubes").style.top = "0px";
    el("scroll").style.top = ui.objectSize * 0.02 + "px";
    el("scrollBackCenter").style.top = ui.objectSize * 0.02 + "px";
    el("scrollBackUp").style.top = ui.objectSize * 0.02 + "px";
    el("btnClose").style.top = ui.objectSize * 0.065 + "px";
    el("scrollText").style.top = ui.objectSize * 0.06 + "px";

    el("pjDivineBtn").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.1) + "px";
    el("npcDivineBtn").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.1) + "px";
    el("centerDivineBtn").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.1) + "px";


    //Others
    el("indicadores").style.display = "flex";
    el("indicadores").style.justifyContent = "space-between";
    el("hpIcon").style.height = ui.objectSize * 0.05 + "px";
    el("goldIcon").style.height = ui.objectSize * 0.05 + "px";
    el("spiritIcon").style.height = ui.objectSize * 0.05 + "px";
    el("hpIcon").style.width = ui.objectSize * 0.05 + "px";
    el("goldIcon").style.width = ui.objectSize * 0.05 + "px";
    el("spiritIcon").style.width = ui.objectSize * 0.05 + "px";

};

export {
    defineObjectSize,
    detectmob,
    getEM,
    layoutPortrait,
    responsiveLayout,
};
