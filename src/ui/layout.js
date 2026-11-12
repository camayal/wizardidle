// Wizard Idle v2 - Screen layout: sizes everything from the window size, in portrait or landscape.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { state } from '../state.js';
import { fight, ui } from '../runtime.js';
import { loadAlterCanvasChar, loadCanvasChar, loadNPC } from './render.js';
import { scrollClose } from './scrolls.js';

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
 *     document.getElementById("innerTextScroll").style.display = "block";
 *     document.getElementById('innerTextScroll').innerHTML=txt;
 *     document.getElementById("btnClose").style.top = objectSize * 0.13 + "px";
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

//Responsive layout
function responsiveLayout() {
    
    ui.objectSize = defineObjectSize();
    ui.em = getEM();
    
    //update the icons to avoid bug big icons when start the game in landscape
    ui.goldIcon = "<img class='imgInConsole' height='" + ui.em + "' src='img/gold.png'/> ";
    ui.spiritIcon = "<img class='imgInConsole' height='" + ui.em + "' src='img/spirit.png'/> ";
    ui.attackIcon = "<img class='imgInConsole' height='" + ui.em + "' src='img/attack.png'/> ";
    ui.healIcon = "<img class='imgInConsole' height='" + ui.em + "' src='img/heal.png'/> ";

    if (!!document.getElementsByClassName("imgInConsole")[0]){
    var x = document.getElementsByClassName("imgInConsole");
    var i;
    for (i = 0; i < x.length; i++) {
        x[i].style.height = ui.em + "px";
        x[i].style.width = ui.em + "px";
    }
    }

    if (!!document.getElementsByClassName("imgInConsoleSpecial")[0]){
        var x = document.getElementsByClassName("imgInConsoleSpecial");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.height = ui.em * 1.5 + "px";
            x[i].style.width = ui.em * 1.5 + "px";
        }
        }

    if (!!document.getElementsByClassName("specialTextInConsole")[0]){
    var x = document.getElementsByClassName("specialTextInConsole");
    var i;
    for (i = 0; i < x.length; i++) {
        x[i].style.fontSize = ui.em * 1.5 + "px";
        x[i].style.lineHeight = ui.em *1.5 + "px";
    }
    }
        
    
    
    const orientation = screen.msOrientation || (screen.orientation || screen.mozOrientation || {}).type;
    //block for detect landscape in mobile and change the elements
    // if (!orientation){ //add support for browsers that have not this property working like edge
    //     if (window.matchMedia("(orientation: landscape)").matches && detectmob()) {
    //         layoutLandscapeMobile();
    //         if (parseInt(document.getElementById("scrollBackCenter").style.minHeight) > 0) {
    //             scrollClose()
    //         }
    //      } else {
    //         layoutPortrait();
    //      }
    // }else{
    // if (!window.screen.orientation.type.match("portrait") && detectmob()) {
    //     layoutLandscapeMobile();
    //     if (parseInt(document.getElementById("scrollBackCenter").style.minHeight) > 0) {
    //         scrollClose()
    //     }
    //  } else {
    //     layoutPortrait();
    //  }
    // }

    
    //if (orientation == "landscape-primary" && detectmob()){
    if (!!orientation.match("landscape") && detectmob()){//solved the problem that landscape-secondary does not trigger the landscape mode
        layoutLandscapeMobile();
        if (parseInt(document.getElementById("scrollBackCenter").style.minHeight) > 0) {
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
//Define size of window
function defineObjectSize() {
     if (!detectmob()) {
        //var objectSize = 512;
        ui.objectSize = window.innerHeight / 2;//better adaptation 
        // centerMain = (window.innerWidth / 2) - (objectSize * 1.0625 /2) + "px";
        // centerLauncher = (window.innerWidth / 2) - ((objectSize / 0.9) /2) + "px";
    } else {
        ui.objectSize = window.innerWidth * 0.9;
        // centerMain = (window.innerWidth  / 2) - (objectSize * 1.0625 /2) + "px";
        // centerLauncher = "0px"
    }
    ;return ui.objectSize;
}


//Detect mobile
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


//Get em size
function getEM(){
    //em = window.innerHeight / 55
    //em = parseInt(document.getElementById("console").style.height) / 30;
    //em = (window.innerHeight - (objectSize * 0.5225)) / 30;
    ui.em = ui.objectSize * 0.04;
    return ui.em;
}



//Default layout for mobile and desktop
function layoutPortrait(){

    if(state.firstUse){
        document.getElementById("nubes").style.display = "none" ;
        document.getElementById("launcher").style.display = "block" ;
        //fadeOut(document.getElementById("nubes"))
        //fadeIn(document.getElementById("launcher"))
    }else{
        document.getElementById("launcher").style.display = "none" ;
        document.getElementById("main").style.display = "block" ;
        //fadeOut(document.getElementById("launcher"))
        //fadeIn(document.getElementById("main"))
    }

    
    document.getElementById("console").style.display = "block" ;
    document.getElementById("XPprogressBar").style.display = "block" ;
    document.getElementById("backConsole").style.display = "block" ;
    document.getElementById("btn1").style.display = "block" ;
    document.getElementById("btn2").style.display = "block" ;
    document.getElementById("btn3").style.display = "block" ;
    document.getElementById("btn4").style.display = "block" ;
    document.getElementById("btn5").style.display = "block" ;
    document.getElementById("btn6").style.display = "block" ;
    
    //fonts
    document.getElementById("pjName").style.fontSize = ui.objectSize * 0.09375 + "px";
    document.getElementById("console").style.fontSize = ui.em + "px";
    document.getElementById("indicadores").style.fontSize = ui.objectSize * 0.045 + "px";
    document.getElementById("statusText").style.fontSize = ui.em * 2 + "px";
    document.getElementById("inputName").style.fontSize = (ui.objectSize * 0.09375) * 1.5 + "px";
    document.getElementById("labelInputName").style.fontSize = (ui.objectSize * 0.09375) * 0.5 + "px";
    // document.querySelector(".longBtnText").style.fontSize = (objectSize * 0.09375) * 0.75 + "px";
    document.getElementById("title1").style.fontSize = (ui.objectSize * 0.09375) * 2.5 + "px";
    document.getElementById("title2").style.fontSize = (ui.objectSize * 0.09375) * 1.5 + "px";
    document.getElementById("footer").style.fontSize = (ui.objectSize * 0.09375) * 0.6 + "px";
    document.getElementById("scrollText").style.fontSize = ui.em + "px";
    
    document.getElementById("zoneMap").style.fontSize = ui.em * 2.5 + "px";
    document.getElementById("scrollText").style.margin = ui.em / 2 + "px";

    


    //widths
    document.getElementById("main").style.width = ui.objectSize + "px";
    document.getElementById("console").style.width = ui.objectSize + "px";
    document.getElementById("marco").style.width = ui.objectSize * 1.0625 + "px";
    document.getElementById("esceneCanvas").style.width = ui.objectSize + "px";
    document.getElementById("pjCanvas").style.width = ui.objectSize + "px";
    document.getElementById("npcCanvas").style.width = ui.objectSize + "px";
    document.getElementById("spellCanvas").style.width = ui.objectSize + "px";
    document.getElementById("XPprogressBar").style.width  = ui.objectSize * 0.7 + "px";
    document.getElementById("pjName").style.width  = ui.objectSize * 0.7 + "px";
    document.getElementById("indicadores").style.width  = ui.objectSize * 0.7 + "px";
    document.getElementById("btn1").style.width  = ui.objectSize * 0.09375 + "px";
    document.getElementById("btn2").style.width  = ui.objectSize * 0.09375 + "px";
    document.getElementById("btn3").style.width  = ui.objectSize * 0.09375 + "px";
    document.getElementById("btn4").style.width  = ui.objectSize * 0.09375 + "px";
    document.getElementById("btn5").style.width  = ui.objectSize * 0.09375 + "px";
    document.getElementById("btn6").style.width  = ui.objectSize * 0.09375 + "px";  
    document.getElementById("backConsole").style.width = ui.objectSize + (ui.objectSize * 0.075) + "px";
    document.getElementById("launcher").style.width = ui.objectSize / 0.9 + "px";
    //document.getElementById("fondoLauncher").style.width = objectSize + (objectSize * 0.075) + "px";
    document.getElementById("fondoLauncher").style.width = ui.objectSize / 0.9 + "px";
    document.getElementById("inputName").style.width = ui.objectSize * 1.085 + "px";
    document.getElementById("labelInputName").style.width = ui.objectSize * 1.085 + "px";
    const startBtnW = document.getElementById("startBtn").style.width  = ((ui.objectSize * 0.09375) * 1.90625) * 1.5 + "px";  
    // document.getElementById("btnBlackBack").style.width  = startBtnW;
    document.getElementById("scroll").style.width = ui.objectSize + "px";  
    document.getElementById("scrollBackCenter").style.width = ui.objectSize + (ui.objectSize * 0.075) + "px";  
    document.getElementById("scrollBackUp").style.width = ui.objectSize + (ui.objectSize * 0.075) + "px";  
    document.getElementById("scrollBackDown").style.width = ui.objectSize + (ui.objectSize * 0.075) + "px";  

    document.getElementById("scrollText").style.width = ui.objectSize + "px";  
    document.getElementById("btnClose").style.width  = ui.objectSize * 0.09375 + "px";  
    
    const pjBtnWidth = document.getElementById("pjDivineBtn").style.width = ui.objectSize * 0.325 + "px";
    document.getElementById("npcDivineBtn").style.width = ui.objectSize * 0.325 + "px";
    const centerDivineBtn = document.getElementById("centerDivineBtn").style.width = ui.objectSize * 0.35 + "px";

    document.getElementById("backMapa").style.width = ui.objectSize + "px"; 
    document.getElementById("bocadilloMapa").style.width  = ui.objectSize * 0.075 + "px";  
    document.getElementById("pjMapa").style.width  = ui.objectSize * 0.065 + "px";  

    
    
    
    


    //heights
    const headingH = document.getElementById("heading").style.height = ui.objectSize * 0.21 + "px";
    const marcoH = document.getElementById("marco").style.height = ui.objectSize * 0.3125 + "px";
    const sceneCanvasH = document.getElementById("esceneCanvas").style.height = ui.objectSize * 0.25 + "px";
    document.getElementById("pjCanvas").style.height = ui.objectSize * 0.25 + "px";
    document.getElementById("npcCanvas").style.height = ui.objectSize * 0.25 + "px";
    document.getElementById("spellCanvas").style.height = ui.objectSize * 0.25 + "px";
    document.getElementById("XPprogressBar").style.height  = ui.objectSize * 0.035  + "px";
    const backConsoleH = document.getElementById("backConsole").style.height = window.innerHeight - parseInt(sceneCanvasH) * 1.2 - parseInt(headingH) * 1.2 + "px";
    const consoleH = document.getElementById("console").style.height = parseInt(backConsoleH) * 0.94 + "px";
    document.getElementById("launcher").style.height = window.innerHeight + "px";
    document.getElementById("fondoLauncher").style.height = window.innerHeight + "px";
    //document.getElementById("startBtn").style.height  = (objectSize * 0.09375) * 1.5 + "px"; 
    document.getElementById("startBtn").style.height  = (ui.objectSize * 0.09375) * 1.5 + "px"; 
    // document.getElementById("btnBlackBack").style.height  = (objectSize * 0.09375) * 1.4 + "px"; 
    //document.getElementById("scrollBackCenter").style.height = window.innerHeight - parseInt(sceneCanvasH) * 1.5 + "px";
    //document.getElementById("scrollBackUp").style.height = window.innerHeight - parseInt(sceneCanvasH) * 0.25 + "px";
    document.getElementById("main").style.height = window.innerHeight + "px";
    document.getElementById("scrollText").style.height = (window.innerHeight - (ui.objectSize * 0.25) * 1.5) + "px";
    //document.getElementById("scrollBackCenter").style.height = (window.innerHeight - (objectSize * 0.25) * 1.5) + "px";
    
    document.getElementById("pjDivineBtn").style.height = ui.objectSize * 0.25 + "px";
    document.getElementById("npcDivineBtn").style.height = ui.objectSize * 0.25 + "px";
    document.getElementById("centerDivineBtn").style.height = ui.objectSize * 0.25 + "px";

    //auto resize scroll if is open
    if(parseInt(document.getElementById("scrollBackCenter").style.minHeight) > 0){
    document.getElementById("scrollBackCenter").style.minHeight = (window.innerHeight - (ui.objectSize * 0.25) * 1.5) * 0.97 + "px";
    document.getElementById("scrollText").style.minHeight = (window.innerHeight - (ui.objectSize * 0.25) * 1.5) * 0.92 + "px";
    document.getElementById("scrollBackDown").style.top = (window.innerHeight - (ui.objectSize * 0.25) * 1.5) * 0.97 + "px";
    }
    

    //lefts
    //document.getElementById("main").style.left = (window.innerWidth - objectSize) / 2 - (window.innerWidth * 0.025) + "px";
    //document.getElementById("main").style.left = centerMain;
    document.getElementById("main").style.left = (window.innerWidth / 2) - (ui.objectSize * 1.0625 /2) + "px";
    document.getElementById("console").style.left = ui.objectSize * 0.03 + "px";
    document.getElementById("backConsole").style.left = (ui.objectSize * -0.01) + "px";
    document.getElementById("esceneCanvas").style.left = (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("pjCanvas").style.left = (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("npcCanvas").style.left = (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("spellCanvas").style.left = (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("btn1").style.left = ui.objectSize * 0.75 + "px";
    document.getElementById("btn4").style.left = ui.objectSize * 0.75 + "px";
    document.getElementById("btn2").style.left = ui.objectSize * 0.75 + (ui.objectSize * 0.1) + "px";
    document.getElementById("btn5").style.left = ui.objectSize * 0.75 + (ui.objectSize * 0.1) + "px";
    document.getElementById("btn3").style.left = ui.objectSize * 0.75 + (ui.objectSize * 0.1) * 2 +"px";
    document.getElementById("btn6").style.left = ui.objectSize * 0.75 + (ui.objectSize * 0.1) * 2 + "px";
    document.getElementById("statusText").style.left = ui.objectSize + "px";
    ////launcher
    //document.getElementById("launcher").style.left = (window.innerWidth - objectSize) / 2 - (window.innerWidth * 0.05) + "px";
    //document.getElementById("launcher").style.left = centerLauncher;
    document.getElementById("launcher").style.left = (window.innerWidth / 2) - ((ui.objectSize / 0.9) /2) + "px";
    document.getElementById("fondoLauncher").style.left = "0px";
    document.getElementById("labelInputName").style.left = ui.objectSize * 0.03 + "px";
    document.getElementById("startBtn").style.left = ((ui.objectSize * 1.085 - parseInt(startBtnW)) / 2) + "px";
    // document.getElementById("btnBlackBack").style.left = ((objectSize * 1.085 - parseInt(startBtnW)) / 2) + "px";
    // document.getElementById("textStartBtn").style.left = ((objectSize * 1.085 - parseInt(startBtnW)) / 2) * 1.115 + "px";
    
    document.getElementById("title1").style.left = ui.objectSize * 0.16 + "px";
    document.getElementById("title2").style.left = ui.objectSize * 0.7 + "px";
    document.getElementById("footer").style.left = ui.objectSize * 0.1 + "px";
    ////scroll
    //document.getElementById("scroll").style.left = (window.innerWidth - objectSize) / 2 - (window.innerWidth * 0.025) + "px";
    document.getElementById("scroll").style.left = (window.innerWidth / 2) - (ui.objectSize * 1.0625 /2) + "px";
    document.getElementById("scrollBackCenter").style.left = (ui.objectSize * -0.01) + "px";
    document.getElementById("scrollBackUp").style.left = (ui.objectSize * -0.01) + "px";
    document.getElementById("scrollBackDown").style.left = (ui.objectSize * -0.01) + "px";

    document.getElementById("btnClose").style.left = ui.objectSize * 0.75 + (ui.objectSize * 0.1) * 2 + "px";
    document.getElementById("scrollText").style.left = ui.objectSize * 0.03 + "px";

    const pjBtnLeft = document.getElementById("pjDivineBtn").style.left = (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("centerDivineBtn").style.left = parseInt(pjBtnLeft) + parseInt(pjBtnWidth) + "px";
    document.getElementById("npcDivineBtn").style.left = parseInt(pjBtnLeft) + parseInt(pjBtnWidth) + parseInt(centerDivineBtn) + "px";
    
    
    document.getElementById("backMapa").style.left = 0 + "px";
    
    

    //tops
    document.getElementById("main").style.top = window.innerHeight * 0.005 + "px";

    // define if scene is on top of console, if not invert (useful when scroll is desplayed)
    if (ui.sceneOnTop){
    	//test new organization, scene top
    	document.getElementById("marco").style.top = parseInt(headingH) + parseInt(headingH) * 0.1 + "px";
    	document.getElementById("esceneCanvas").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.165) + "px";
    	document.getElementById("pjCanvas").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.165) + "px";
    	document.getElementById("npcCanvas").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.165) + "px";
    	document.getElementById("spellCanvas").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.165) + "px";
		document.getElementById("pjDivineBtn").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.165) + "px";
		document.getElementById("npcDivineBtn").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.165) + "px";
		document.getElementById("centerDivineBtn").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.165) + "px";
    	document.getElementById("console").style.top = parseInt(headingH) + parseInt(marcoH) + (parseInt(marcoH) * 0.2) + "px";
    	document.getElementById("backConsole").style.top = parseInt(headingH) + parseInt(marcoH) + (parseInt(marcoH) * 0.1) + "px";
		document.getElementById("statusText").style.top = parseInt(headingH) + parseInt(marcoH) + (parseInt(marcoH) * 0.2) + (parseInt(backConsoleH) * 0.925) + "px";
	//end test new organization
    }else {
	    document.getElementById("console").style.top = parseInt(headingH) + parseInt(headingH) * 0.2 + "px";
	    document.getElementById("backConsole").style.top = headingH;
	    document.getElementById("marco").style.top = parseInt(headingH) + parseInt(backConsoleH) + "px";
	    document.getElementById("esceneCanvas").style.top = parseInt(headingH) + parseInt(backConsoleH) + (parseInt(marcoH) * 0.1) + "px";
	    document.getElementById("pjCanvas").style.top = parseInt(headingH) + parseInt(backConsoleH) + (parseInt(marcoH) * 0.1) + "px";
	    document.getElementById("npcCanvas").style.top = parseInt(headingH) + parseInt(backConsoleH) + (parseInt(marcoH) * 0.1) + "px";
	    document.getElementById("spellCanvas").style.top = parseInt(headingH) + parseInt(backConsoleH) + (parseInt(marcoH) * 0.1) + "px";
	    document.getElementById("pjDivineBtn").style.top = parseInt(headingH) + parseInt(backConsoleH) + (parseInt(marcoH) * 0.1) + "px";
	    document.getElementById("npcDivineBtn").style.top = parseInt(headingH) + parseInt(backConsoleH) + (parseInt(marcoH) * 0.1) + "px";
	    document.getElementById("centerDivineBtn").style.top = parseInt(headingH) + parseInt(backConsoleH) + (parseInt(marcoH) * 0.1) + "px";
	    document.getElementById("statusText").style.top = parseInt(headingH) + (parseInt(backConsoleH) * 0.925) + "px";
    }
	
    document.getElementById("indicadores").style.top = (ui.objectSize * 0.09375) * 1.57 + "px";
    document.getElementById("XPprogressBar").style.top = (ui.objectSize * 0.09375) * 1.125 + "px";
    document.getElementById("btn1").style.top = ui.objectSize * 0.01 + "px";
    document.getElementById("btn4").style.top = ui.objectSize * 0.11 + "px";
    document.getElementById("btn2").style.top = ui.objectSize * 0.01 + "px";
    document.getElementById("btn5").style.top = ui.objectSize * 0.11 + "px";
    document.getElementById("btn3").style.top = ui.objectSize * 0.01 + "px";
    document.getElementById("btn6").style.top = ui.objectSize * 0.11 + "px";
    //document.getElementById("nubes").style.top = "0px";
    document.getElementById("title1").style.top = window.innerHeight * 0.1 + "px";
    document.getElementById("title2").style.top = window.innerHeight * 0.20 + "px";
    document.getElementById("labelInputName").style.top = window.innerHeight * 0.45 + "px";
    document.getElementById("inputName").style.top = window.innerHeight * 0.5 + "px";
    document.getElementById("fondoLauncher").style.top = "0px";
    document.getElementById("startBtn").style.top = window.innerHeight * 0.7 + "px";
    // document.getElementById("btnBlackBack").style.top = window.innerHeight * 0.71 + "px";
    // document.getElementById("textStartBtn").style.top = window.innerHeight * 0.721 + "px";

    document.getElementById("footer").style.top = window.innerHeight * 0.9 + "px";
    document.getElementById("scroll").style.top = ui.objectSize * 0.02 + "px";
    document.getElementById("scrollBackCenter").style.top = ui.objectSize * 0.02 + "px";
    document.getElementById("scrollBackUp").style.top = ui.objectSize * 0.02 + "px";
    document.getElementById("btnClose").style.top = ui.objectSize * 0.065 + "px";
    document.getElementById("scrollText").style.top = ui.objectSize * 0.065 + "px";

    document.getElementById("backMapa").style.top = ui.objectSize * 0.1 + "px";
    
    
    //Others
    document.getElementById("indicadores").style.display = "flex";
    document.getElementById("indicadores").style.justifyContent = "space-between";
    document.getElementById("hpIcon").style.height = ui.objectSize * 0.045 + "px";
    document.getElementById("goldIcon").style.height = ui.objectSize * 0.045 + "px";
    document.getElementById("spiritIcon").style.height = ui.objectSize * 0.045 + "px";
    document.getElementById("hpIcon").style.width = ui.objectSize * 0.045 + "px";
    document.getElementById("goldIcon").style.width = ui.objectSize * 0.045 + "px";
    document.getElementById("spiritIcon").style.width = ui.objectSize * 0.045 + "px";
    //document.getElementById("textStartBtn").style.padding = objectSize * 0.02 + "px";
    //document.getElementById("btnBlackBack").style.borderRadius = objectSize * 0.05859375 + "px";
    

 

}


//Change layout when is landscape in mobile only
function layoutLandscapeMobile(){

    if(state.firstUse){
        document.getElementById("launcher").style.display = "none" ;
        document.getElementById("nubes").style.display = "block" ;
        //fadeOut(document.getElementById("launcher"))
        //fadeIn(document.getElementById("nubes"))
    }else{
        document.getElementById("launcher").style.display = "none" ;
        document.getElementById("main").style.display = "block" ;

        //fadeOut(document.getElementById("launcher"))
    }



    //hide
    document.getElementById("console").style.display = "none" ;
    document.getElementById("backConsole").style.display = "none" ;
    document.getElementById("btn1").style.display = "none" ;
    document.getElementById("btn2").style.display = "none" ;
    document.getElementById("btn3").style.display = "none" ;
    document.getElementById("btn4").style.display = "none" ;
    document.getElementById("btn5").style.display = "none" ;
    document.getElementById("btn6").style.display = "none" ;

    //fonts
    document.getElementById("pjName").style.fontSize = ui.objectSize * 0.11 + "px";
    document.getElementById("indicadores").style.fontSize = ui.objectSize * 0.05 + "px";
    document.getElementById("statusText").style.fontSize = ui.em * 2 + "px";
    document.getElementById("scrollText").style.fontSize = ui.objectSize * 0.05 + "px";

    
    //widths
    document.getElementById("main").style.width = ui.objectSize + "px";
    document.getElementById("XPprogressBar").style.width  = window.innerWidth * 0.95  + "px";
    document.getElementById("pjName").style.width  = window.innerWidth * 0.90 + "px";
    document.getElementById("indicadores").style.width  = window.innerWidth * 0.95 + "px";
    document.getElementById("marco").style.width = ui.objectSize * 1.0625 + "px";
    document.getElementById("esceneCanvas").style.width = ui.objectSize + "px";
    document.getElementById("pjCanvas").style.width = ui.objectSize + "px";
    document.getElementById("npcCanvas").style.width = ui.objectSize + "px";
    document.getElementById("spellCanvas").style.width = ui.objectSize + "px";
    document.getElementById("nubes").style.width = window.innerWidth + "px";
    document.getElementById("scroll").style.width = window.innerWidth * 0.98 + "px";  
    document.getElementById("scrollBackCenter").style.width = window.innerWidth * 0.98 + "px";  
    document.getElementById("scrollBackUp").style.width = window.innerWidth * 0.98 + "px";
    document.getElementById("scrollBackDown").style.width = window.innerWidth * 0.98 + "px";  
  
    document.getElementById("scrollText").style.width = window.innerWidth * 0.92 + "px";  
    document.getElementById("btnClose").style.width  = ui.objectSize * 0.09375 + "px";  


    const pjBtnWidth = document.getElementById("pjDivineBtn").style.width = ui.objectSize * 0.325 + "px";
    document.getElementById("npcDivineBtn").style.width = ui.objectSize * 0.325 + "px";
    const centerDivineBtn = document.getElementById("centerDivineBtn").style.width = ui.objectSize * 0.35 + "px";


    //heights
    const headingH = document.getElementById("heading").style.height = ui.objectSize * 0.24 + "px";
    const marcoH = document.getElementById("marco").style.height = ui.objectSize * 0.3125 + "px";
    document.getElementById("esceneCanvas").style.height = ui.objectSize * 0.25 + "px";
    document.getElementById("pjCanvas").style.height = ui.objectSize * 0.25 + "px";
    document.getElementById("npcCanvas").style.height = ui.objectSize * 0.25 + "px";
    document.getElementById("spellCanvas").style.height = ui.objectSize * 0.25 + "px";
    document.getElementById("XPprogressBar").style.height  = ui.objectSize * 0.03  + "px";
    document.getElementById("nubes").style.height  = window.innerHeight  + "px";
    //document.getElementById("scrollText").style.height  = window.innerHeight * 0.75  + "px";
    //document.getElementById("scrollBackCenter").style.height  = window.innerHeight * 0.9  + "px";

    if(parseInt(document.getElementById("scrollBackCenter").style.minHeight) > 0){
        document.getElementById("scrollBackCenter").style.minHeight = window.innerHeight * 0.8 + "px";
        document.getElementById("scrollText").style.minHeight = window.innerHeight * 0.7 + "px";
        document.getElementById("scrollBackDown").style.top = window.innerHeight * 0.8 + "px";
    }



    document.getElementById("pjDivineBtn").style.height = ui.objectSize * 0.25 + "px";
    document.getElementById("npcDivineBtn").style.height = ui.objectSize * 0.25 + "px";
    document.getElementById("centerDivineBtn").style.height = ui.objectSize * 0.25 + "px";


    //lefts
    document.getElementById("main").style.left = (window.innerWidth - ui.objectSize) / 2 - (window.innerWidth * 0.025) + "px";
    document.getElementById("esceneCanvas").style.left = (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("pjCanvas").style.left = (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("npcCanvas").style.left = (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("spellCanvas").style.left = (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("statusText").style.left = window.innerWidth * 0.925 + "px";
    document.getElementById("nubes").style.left = "0px";
    document.getElementById("btnClose").style.left = ui.objectSize * 0.75 + (ui.objectSize * 0.1) * 2 + "px";
    document.getElementById("scroll").style.left = ui.objectSize * 0.01 + "px";
    document.getElementById("scrollText").style.left = ui.objectSize * 0.03 + "px";

    const pjBtnLeft = document.getElementById("pjDivineBtn").style.left = (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("centerDivineBtn").style.left = parseInt(pjBtnLeft) + parseInt(pjBtnWidth) + "px";
    document.getElementById("npcDivineBtn").style.left = parseInt(pjBtnLeft) + parseInt(pjBtnWidth) + parseInt(centerDivineBtn) + "px";


    //tops
    document.getElementById("indicadores").style.top = ui.objectSize * 0.17 + "px";
    document.getElementById("XPprogressBar").style.top = ui.objectSize * 0.13 + "px";
    document.getElementById("statusText").style.top = ui.objectSize * 0.01 + "px";
    document.getElementById("marco").style.top = parseInt(headingH) + "px";
    document.getElementById("esceneCanvas").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("pjCanvas").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("npcCanvas").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("spellCanvas").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("nubes").style.top = "0px";
    document.getElementById("scroll").style.top = ui.objectSize * 0.02 + "px";
    document.getElementById("scrollBackCenter").style.top = ui.objectSize * 0.02 + "px";
    document.getElementById("scrollBackUp").style.top = ui.objectSize * 0.02 + "px";
    document.getElementById("btnClose").style.top = ui.objectSize * 0.065 + "px";
    document.getElementById("scrollText").style.top = ui.objectSize * 0.06 + "px";

    document.getElementById("pjDivineBtn").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("npcDivineBtn").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("centerDivineBtn").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.1) + "px";


    //Others
    document.getElementById("indicadores").style.display = "flex";
    document.getElementById("indicadores").style.justifyContent = "space-between";
    document.getElementById("hpIcon").style.height = ui.objectSize * 0.05 + "px";
    document.getElementById("goldIcon").style.height = ui.objectSize * 0.05 + "px";
    document.getElementById("spiritIcon").style.height = ui.objectSize * 0.05 + "px";
    document.getElementById("hpIcon").style.width = ui.objectSize * 0.05 + "px";
    document.getElementById("goldIcon").style.width = ui.objectSize * 0.05 + "px";
    document.getElementById("spiritIcon").style.width = ui.objectSize * 0.05 + "px";

};

export {
    defineObjectSize,
    detectmob,
    getEM,
    layoutPortrait,
    responsiveLayout,
};
