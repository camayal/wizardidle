// Wizard Idle v2 - game logic (phase 1: same code as v1, now an ES module).
// Original game hand-written by Carlos Alonso Maya Lastra (2018-2020), see tag v1.0.0.

import { enemyTypes, enemySprites } from './data/enemies.js';
import { zones, places } from './data/zones.js';
import { spells, spellTiers, npcSpells } from './data/spells.js';
import { achievements } from './data/achievements.js';
import { YesOrNot, getRandomInt, pickRandomItem, roundNumbertoLetter, capitalize, getRandomColor, secsToHours } from './utils.js';
import { config } from './config.js';
import { state, world, stat, count, deleteSave } from './state.js';
import { fight, run, ui } from './runtime.js';

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
var version = "02nov2020_10pm"; //26jul2018_6pm
var uniqueID;
ui.objectSize = defineObjectSize();
ui.headLevel = ui.objectSize * 0.109375;//56;
ui.squareSide = ui.objectSize * 0.125;//64;
ui.charWidth = ui.squareSide; ui.charHeight = ui.squareSide;
ui.em = getEM();
var eventClock;//declare the main clock
var eventMasterClock;
var animateClockNPC;
var animateClock;
var statusClock;
var statsClock;

run.multipleEventsCounter = 0;
ui.frameCounter = 0;
var MAXSTAGES = 5;//max number of scenaria per locality
var MAXLINESINCONSOLE = 50;
var JUMPSPACE = ui.squareSide / 4;
fight.bossCombat = false;
fight.hydraCombat = false;

fight.enemyHP = 0;
fight.enemyHPbase = 0;
fight.enemyName = "";
var RAREMULTIPLIER = 2;
fight.bossMultiplier = 1;//reset the bossmultiplier
fight.bossGoldMultiplier = 1;
var masterTime = 1500;
var selfrevivetime = 120000;
fight.enemy = "";
fight.enemyAndNumber = "";
fight.spellEnemy = "";
fight.polymorphed = false;





var scrollIDContent;
fight.pjDead = false;
run.disablePjBtn = false;
run.disableCenterBtn = false;
ui.sceneOnTop = true;






run.restAtInn = false;
run.pause = false;

run.afterChapterExe = false;
//vars spell animation
var frameWidth = 30;
var frameHeight = 30;
var currentFrame = 0, shift = 0;
//vars icons
ui.goldIcon = "<img class='imgInConsole' height='" + ui.em + "' src='img/gold.png'/> ";
//var heartIcon = "<img class='imgInConsole' height='" + em + "' src='img/heart.png'/> ";

ui.spiritIcon = "<img class='imgInConsole' height='" + ui.em + "' src='img/spirit.png'/> ";
ui.attackIcon = "<img class='imgInConsole' height='" + ui.em + "' src='img/attack.png'/> ";
ui.healIcon = "<img class='imgInConsole' height='" + ui.em + "' src='img/heal.png'/> ";
// #endregion





// Game data (enemies, zones, spells, achievements) now lives in src/data/.

// Achievements: definitions from data/achievements.js plus the unlock function.
const logro = {
    ...achievements,
    set: function(nameLogro){
        if(!state.achievements[nameLogro.name]){
        //sonido de archivements
        playSound("achivement");
        state.achievements[nameLogro.name] = true;
        print("<img class='imgInConsoleSpecial' height='" + ui.em * 1.5 + "' src='img/achivement.png'><span class='specialTextInConsole' style='font-size:" + ui.em * 1.5 + "px; line-height:" + ui.em * 1.5 + "px;'><b>" + nameLogro.title + "</b> - " + nameLogro.description + "</span>");
        
        if (ui.scrollCurrentContent == "achievements"){
        updateAchievements();
        }
        }
    }
};
    

//stat definition object
var statObj = {
    pAttack: {name:"attack chance", code:"pAttack"},
    fAttack: {name:"mastery in magic arts", code:"fAttack"},
    pPolymorph: {name:"polymorphism mastery", code:"pPolymorph"},
    fCritic: {name:"critical multiplier", code:"fCritic"},
    pCritic: {name:"critic chance", code:"pCritic"},
    pHeal: {name:"heal chance", code:"pHeal"},
    fHeal: {name:"restauration knowledge", code:"fHeal"},
    pStudy: {name:"intelect", code:"pStudy"},
    pBotin: {name:"avarice", code:"pBotin"},
    pChangeZone: {name:"exploration faculties", code:"pChangeZone"},
    pFindCapel: {name:"devotion", code:"pFindCapel"},
    pFindMaterials: {name:"scavenger skills", code:"pFindMaterials"},
    pOfrenda: {name:"devotion for the tithe", code:"pOfrenda"},
    fOfrenda: {name:"generosity", code:"fOfrenda"},
    increase: function(stat,extra=1,value=0.001){
        if (!!stat.match(/^f/)){//if is a factor and not a probability modify 0.1 instead 0.001
            value = 0.1;
        }
        state.statBonus[stat] = (state.statBonus[stat] || 0) + value * extra
        return statObj[stat].name;
    },
    random: function(){
        var keys = Object.keys(this);
        return this[keys[ (keys.length - 2) * Math.random() << 0]].code;
    }
}


//define statueobj
var statueObj = {
    statue_el_Bosque: {name:"Snail",event:function(){return statObj.increase(statObj.pPolymorph.code,2)},code:"statue_el_Bosque"},
    statue_el_Castillo: {name:"Knight", event:function(){return statObj.increase(statObj.pAttack.code,2)},code:"statue_el_Castillo"},
    statue_la_Ciudad: {name:"Queen", event:function(){return statObj.increase(statObj.fOfrenda.code,2)},code:"statue_la_Ciudad"},
    statue_la_Gruta: {name:"Grotesque creature", event:function(){return statObj.increase(statObj.fAttack.code,2)},code:"statue_la_Gruta"},
    statue_el_Desierto: {name:"Feline", event:function(){return statObj.increase(statObj.pChangeZone.code,2)},code:"statue_el_Desierto"},
    statue_el_Duenon: {name:"Terrifying Imp", event:function(){return statObj.increase(statObj.pCritic.code,2)},code:"statue_el_Duenon"},
    statue_las_Dunas: {name:"Perfect sphere", event:function(){
        run.feGanada = (getRandomInt(((state.player.hpBase * config.balance.rGold) * 0.75),((state.player.hpBase * config.balance.rGold) * 1.5))) * 10;
        run.feGanada *= state.player.faithMultiplier
        state.player.faith = state.player.faith + run.feGanada;
        updateHeading();
        return "divine</i> and gains some faith (" + ui.spiritIcon + roundNumbertoLetter(run.feGanada) + ")<i>";
    },code:"statue_las_Dunas"},
    statue_el_Heidan: {name:"Majestic angel", event:function(){
        statObj.increase(statObj.pBotin.code,2)
        var goldFound = (state.player.lastBattleGold * 7.3)
        state.player.gold = state.player.gold + goldFound;
        updateHeading();
        playSound("coins");
        return statObj.pBotin.name + "</i> and found some coins (" + ui.goldIcon + roundNumbertoLetter(goldFound) + ")<i>";
    },code:"statue_el_Heidan"},
    statue_la_Mina: {name:"Dwarf", event:function(){return statObj.increase(statObj.pFindMaterials.code,2)},code:"statue_la_Mina"},
    statue_el_Pantano: {name:"Hydra", event:function(){
        playSound("hidra");
        state.hydraMysteryResolved = true;
        logro.set(logro.logro_hydramystery);
        return "hydraMysteryResolved";
    },code:"statue_el_Pantano"},
    statue_la_Pradera: {name:"Strange bird", event:function(){return statObj.increase(statObj.fHeal.code,2)},code:"statue_la_Pradera"},
    statue_la_Torre: {name:"Wizard", event:function(){return statObj.increase(statObj.pStudy.code,2)},code:"statue_la_Torre"},
    statue_la_Tundra: {name:"Wraith", event:function(){return statObj.increase(statObj.fCritic.code,2)},code:"statue_la_Tundra"},
    statue_el_Volcan: {name:"Dragon", event:function(){return statObj.increase(statObj.pHeal.code,2)},code:"statue_el_Volcan"},
}


//levelUP function
function levelUP() {
    state.player.lvl = state.player.lvl + 1
    //console.log("lvl" + getLocal("lvl"))
    if (state.player.lvl > 1){
        //achievement
        switch (state.player.lvl){
            case 2:
                logro.set(logro.logro_lvl2);
            break;
            case 140:
                logro.set(logro.logro_level140);
            break;
            case 200:
                logro.set(logro.logro_level200);
            break;
            default:
            playSound("lvlup");
            print("<img class='imgInConsoleSpecial' height='" + ui.em * 1.5 + "' src='img/star.png'></img> " + "<span class='specialTextInConsole' style='font-size:" + ui.em * 1.5 + "px; line-height:" + ui.em * 1.5 + "px;'> <b>" + state.player.name + " level up</b></span>" + " <img class='imgInConsoleSpecial' height='" + ui.em * 1.5 + "' src='img/star.png'></img> ");
        }
    //calculate age
        state.player.age = state.player.age + (state.player.xpNext * 0.0005)
    }



    state.player.xpNext = Math.pow(state.player.lvl, config.balance.rXP) * config.balance.factorHP;
    state.player.xpPast = Math.pow((state.player.lvl - 1), config.balance.rXP) * config.balance.factorHP;
    state.player.hpBase = state.player.xpNext * config.balance.rHP;
    state.player.hp = Math.floor(state.player.hpBase);
    state.player.enemyHpRange = state.player.hpBase * 1.2;
    state.player.enemyAttackRange = state.player.hpBase * 0.2;
    state.player.xpPerEnemy = ((Math.pow((state.player.lvl + 1), config.balance.rXP) * config.balance.factorHP) - state.player.xpNext) / config.balance.rEnemyXP;
    state.player.attack = state.player.hpBase * 0.2;
    //loadCanvasChar(getLocal("lvl"), squareSide, headLevel);
    updateHeading();

    //call history if exists
    if(chapter["lvl" + state.player.lvl]){
        openHistory()
    }else{//avoid change lvl skin automatically, for levels that needs some previous change (before get corruption staff, en 149, etc)
        loadCanvasChar(state.player.lvl, ui.squareSide, ui.headLevel);
    }

    //multilevel control (not expected)
    if(state.player.xp >= state.player.xpNext){
        levelUP();
    };
   
}



//Start the game (load everything)
function start() {
    run.timeStart = performance.now()
    
    playSound("start");
    state.npc = "";
    if (state.firstUse) {
        
        levelUP();
        //artificial levelUP from 0 to 1 to add some vars
        state.firstUse = false;
    };
    if (state.player.hp <= 0){//perfom a weak revive if the player does not revive after reload, loss faith
        state.player.hp = state.player.hpBase * 0.1;
            var feperdida = state.player.hpBase * 0.25;
            //localStorage[thx("fe")] = thx(Number(getLocal("fe")) - feperdida);
            state.player.faith = state.player.faith - feperdida
        print("<b>" + state.player.name + "</b> " + "loses hope in you and trys to restore himself (" + ui.spiritIcon + "-" +  roundNumbertoLetter(feperdida) + ")");
    }
    updateHeading();
    loadCanvasChar(state.player.lvl, ui.squareSide, ui.headLevel);
    loadBackground(state.zone.current + state.zone.stage);
    //load previous locality random scenaria
    eventMasterClock = setInterval(event, masterTime);
    //statusClock = setInterval(cacheStatus, 5000);
    //trigger event selecter

};


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

//permits continue the action but stop in the next event, if paused trigger a new event
function pauseToggle(){
    if (run.pause){
        run.pause = false;
        eventMasterClock = setInterval(event, masterTime);
    }else{
        run.pause = true;
    }
    
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


//Animate pj execute as: animateClock = setInterval(animatePJ, 100);
function animatePJ() {

    //avoid  animation in high speed debug
    if(masterTime < 500){clearInterval(animateClock);return}


    ui.frameCounter += 1;
    switch (ui.frameCounter) {
    case 1:

        loadCanvasChar(state.player.lvl, ui.squareSide - JUMPSPACE, ui.headLevel);
        break;
    case 2:
       loadCanvasChar(state.player.lvl, ui.squareSide, ui.headLevel);
        ui.frameCounter = 0;
        clearInterval(animateClock);
    }
};

//Animate npc execute as: animateClockNPC = setInterval(animateNPC, 100);
function animateNPC() {  

    //avoid  animation in high speed debug
    if(masterTime < 500){clearInterval(animateClockNPC);return}


    if (state.npc != ""){
        ui.frameCounter += 1;
        switch (ui.frameCounter) {
        case 1:
            loadNPC(state.npc, ui.squareSide + (JUMPSPACE / 6));
            break;
        case 2:
            loadNPC(state.npc);
            ui.frameCounter = 0;
            clearInterval(animateClockNPC);
        }
    }
};




//Spell animation  //spell("spellRingYellow_8",true,frameWidth,frameHeight,currentFrame,shift)
function spell(img,pj,frameWidth,frameHeight,currentFrame,shift,critic=0,center=0){

    //avoid spell animation in high speed debug
    if(masterTime < 500){return}


//    var t0 = performance.now();
    //if (eval(img).school != "na"){
    if (spells[img].school != "na"){
        if(critic){var volume = 1}
        //playSound(eval(img).school, volume);
        playSound(spells[img].school, volume);

    }
    //var totalFrames = eval(img).frames;
    var totalFrames = spells[img].frames;
    var canvas = document.querySelector("#spellCanvas");
    var context = canvas.getContext("2d");

    if(!pj){
        var mult = 6;
    }else{
        var mult = 1;
    }

    //Make big animation with Critics
    if(critic){
        var multiSize = 1.5;
        var topMultiHeadLocation = 0.5;
        var leftMultiHeadLocation = 0.96;
    //center spell
    }else if(center){
        var multiSize = 1;
        var topMultiHeadLocation = 1;
        var leftMultiHeadLocation = 3.5;
    }else{
        var multiSize = 1;
        var topMultiHeadLocation = 1;
        var leftMultiHeadLocation = 1;
    }

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    var myImage = new Image();
    myImage.src = "img/" + img + ".png";
    myImage.addEventListener("load",animate)
    var requestFrame;

    function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        //draw each frame + place them in the middle
        context.drawImage(myImage, shift, 0, frameWidth, 
            frameHeight, (ui.squareSide * mult) * leftMultiHeadLocation, ui.headLevel * topMultiHeadLocation, ui.squareSide * multiSize, ui.squareSide * multiSize);
        shift += frameWidth + 1;
        if (currentFrame == totalFrames) {
            window.cancelAnimationFrame(requestFrame);
        }
        currentFrame++;
    
        requestFrame = requestAnimationFrame(animate);
    
        }
//console.log(performance.now() - t0)
};
    
//retorno a la anterior para evitar bug en background
function playSound(ogg, volume = 0.3){
    
    //avoid sound in speed debug
    if(masterTime < 500){return}

    ui.audio = new Audio("ogg/" + ogg + ".ogg");
    //audio.volume = 0.3;
    ui.audio.volume = volume;
    //audio.playbackRate = -1.0; 
    //if (loop){audio.loop = true}
    var promise = ui.audio.play();
    //avoid autoplay policy error
    if (promise !== undefined) {
        promise.then(_ => {
          // Autoplay started!
        }).catch(error => {
          // Autoplay was prevented.
          // Show a "Play" button so that user can start playback.
        });
      }
}






/////////////////////////////////////////////////////////
// ███████╗██╗   ██╗███████╗███╗   ██╗████████╗███████╗//
// ██╔════╝██║   ██║██╔════╝████╗  ██║╚══██╔══╝██╔════╝//
// █████╗  ██║   ██║█████╗  ██╔██╗ ██║   ██║   ███████╗//
// ██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║╚██╗██║   ██║   ╚════██║//
// ███████╗ ╚████╔╝ ███████╗██║ ╚████║   ██║   ███████║//
// ╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝//
///////////////////////////////////////////////////////// 
//Events

//Select event, call in this way only:  eventMasterClock = setInterval(event, masterTime);    
function event() {
    clearInterval(eventMasterClock);
    if(run.pause){return}//detect pause command

    if (run.afterChapterExe){
    afterChapter()//call special events after history
    }

    if(state.forceEvent){//force some event for debugging and history
        var masterOption = Number(pickRandomItem(state.forceEvent));
    }else{
        var masterOption = Math.floor((Math.random() * 5) + 1)
    }
    switch (masterOption) {
    case 1:
        //Get an enemy and start a battle
        //getEnemy();
        enemyEV();
        break;
    case 2:
        //Move to other locality
        exploreEV();
        break;
    case 3:
        //enter to the shrine
        prayEV();
        break;
    case 4:
        //rest in a inn
        innEV();
        break;
    case 5:
        //found book, rune or statue
        studyEV();
    }

};

//Main event: EXPLORE
function exploreEV() {
    //Evalue if booty or not
    if (YesOrNot(stat("pBotin"), 0)) {
        //getBotin();
        run.objectToBreak = "";
        print("<b>" + state.player.name + "</b> is searching...");
        eventClock = setInterval(getBotin, masterTime);
    //go to dice house, use the same probability
    } else if (YesOrNot(config.balance.pDados, 0) && state.zone.current == "la_Ciudad" || state.zone.current == "el_Poblado"){
        //check if gold is more than 0
        if(state.player.gold > 0){
            //call the game function
            if (run.previousEvent == "sixfivefour"){
                var textDice = pickRandomItem("decides come back to the gaming house, returns to the dice house,wants to spend more coins at the gaming house");
            }else{
                var textDice = pickRandomItem("finds a gamming house and enters,wants to play 6-5-4,wants to gambling");
            }
            print("<b>" + state.player.name + "</b> " + textDice);
            loadBackground(state.zone.current + "_casadados");
            loadNPC("jugon");
            run.previousEvent = "sixfivefour"
            eventClock = setInterval(sixfivefour, masterTime);       
        }else{
            print("<b>" + state.player.name + "</b> " + "finds a gamming house but does not have gold to bet");
            eventMasterClock = setInterval(event, masterTime);
        }
    }else {
        if (YesOrNot(stat("pChangeZone") * config.balance.allowChangeZone, 0)) {
            print("<b>" + state.player.name + "</b> is exploring...");
            eventClock = setInterval(changeLocality, masterTime);
        } else {
            print("<b>" + state.player.name + "</b>" + pickRandomItem(" continues exploring the , sees something interesting and continues in the , advances in the ") + zones[state.zone.current].name);
            pickRandomBackgroundForCurrentZone();
            addXP(0.5);
            eventMasterClock = setInterval(event, masterTime);
            //trigger event selecter
        };
    };
};

//ToDo:
//robbed!
//rest { chance to be robbed}
//found materials
//quest? check the scrolls at http://pousse.rapiere.free.fr/tome/tiles/DO/tome-doitemstiles.htm


//Main event: BATTLE
function battle() {
    //stats
    run.multipleEventsCounter += 1;
    var option = 1;
    if (run.multipleEventsCounter > 1) {//special because is a loop in the second case until someone die
        option = 2
    }
    switch (option) {
    case 1:
        //anounce the battle
        if (fight.bossCombat) {
            print(fight.enemyName + " releases the power and attack!" + " (" + ui.heartIcon + roundNumbertoLetter(fight.enemyHP) + ")");
        } else if (fight.hydraCombat){
            print(fight.enemyName + " releases all its fury and attack with brutality!" + " (" + ui.heartIcon + roundNumbertoLetter(fight.enemyHP) + ")");
        }else {
            print(fight.enemyName + pickRandomItem(" goes back, is scared, rammed, shouts, defends himself") + " (" + ui.heartIcon + roundNumbertoLetter(fight.enemyHP) + ")");
        }
        break;
    case 2:
        //perform a loop until enemy or pj HP is 0
        if(YesOrNot(stat("pHeal"),0) && (state.player.hp < state.player.hpBase)){
            healEV();
        }else{
            attackEV();
        }
        //if enemy dies
        if (Math.round(fight.enemyHP) <= 0) {
            if (fight.hydraCombat && (state.hydraHeads[fight.hydra] + 1) <= Number(zones[state.zone.current].headsMax)){
                state.hydraHeads[fight.hydra] = state.hydraHeads[fight.hydra] + 1;
                count("HydrasHeadCut");
                getHydra();
            }else{//end conditional hydra, here if die bosses and enemies
                //stop clock of battle and reset bossMultiplier
            run.multipleEventsCounter = 0;
            clearInterval(eventClock);

            
            //kill capricor
            if (fight.enemy == "el_capricor"){
                logro.set(logro.logro_ultimocapricor);
                zones.el_Bosque.enemies = "el_Elfo,Animalejo,el_Ent,el_Herbo,la_Amazona";
            }

            fight.polymorphed = false;
            if (fight.bossCombat){
                count("BossesKilled");
                logro.set(logro.logro_primerbossderrotado)
                //todo logro de todos los boss
            }else if(fight.hydraCombat){
                count("HydrasKilled");
                delete state.hydraHeads[fight.hydra]
                //todo logro de cada hidra
            }else{
                if(enemySprites[fight.enemyAndNumber].rare == 1){
                    count("rareEnemiesKilled");
                }else{
                    count("EnemiesKilled");
                }
            }
            count("Combo");
            if(state.counters.longestCombo === undefined){
                state.counters.longestCombo = state.counters.Combo;
            }else if(state.counters.longestCombo < state.counters.Combo){
                state.counters.longestCombo = state.counters.Combo;
            }
            npcCanvas.getContext("2d").clearRect(0, 0, npcCanvas.width, npcCanvas.height);
            //addXP();
            
            
            //add faith if the enemy is corrupted but only if not boss or hydra
            if(!fight.bossCombat && !fight.hydraCombat){
                if (enemySprites[fight.enemyAndNumber].corrupted == "1" && !state.player.inSin){
                    run.feGanada = calculateFe() * 5;
                    run.feGanada *= state.player.faithMultiplier
                    state.player.faith = state.player.faith + run.feGanada;
                    count("FeByCleanCorruption",Math.round(run.feGanada));
                    var corruptedText = ", also gained " + ui.spiritIcon + " " + roundNumbertoLetter(run.feGanada) + " by corruption erradication";
                }else {
                    var corruptedText = "";
                }
            }

            //punish if the wizard is in sin (use the same corruptedText)
            if(state.player.inSin){
                var feperdida = calculateFe();
                state.player.faith = state.player.faith - feperdida;
                var corruptedText = ", and reduce the faith " + ui.spiritIcon + " -" + roundNumbertoLetter(feperdida);

            }

            //print and add xp depent of the enemy
            if (enemyTypes[fight.enemy].hasgold == "true") {
                playSound("coins");
                addGold();
                if(fight.bossCombat){
                    addXP(4);
                    print(fight.enemyName + " was defeated and a big loot has been found " + ui.goldIcon + roundNumbertoLetter(state.player.lastBattleGold * fight.bossGoldMultiplier));
                }else if(fight.hydraCombat){
                    addXP(Number(zones[state.zone.current].hidrasXPMultiplier));
                    print(fight.enemyName + " was defeated and a treasure has been found " + ui.goldIcon + roundNumbertoLetter(state.player.lastBattleGold * 15));
                }else{
                    addXP(enemySprites[fight.enemyAndNumber].rare == 1 ? RAREMULTIPLIER : 1.5);
                    print(fight.enemyName + " was defeated and looted " + ui.goldIcon + roundNumbertoLetter(state.player.lastBattleGold) + corruptedText);
                }
            } else {
                if(fight.bossCombat){//kill no gold boss
                    addXP(4);
                    print(fight.enemyName + " was defeated");
                }else{
                    addXP(enemySprites[fight.enemyAndNumber].rare == 1 ? RAREMULTIPLIER : 1.5);
                    print(fight.enemyName + " was defeated" + corruptedText);
                }

            }

            fight.enemy = "";
            fight.enemyAndNumber = "";
            state.npc = "";
                fight.bossMultiplier = 1;
                fight.bossGoldMultiplier = 1;
                eventMasterClock = setInterval(event, masterTime);
            }
            
        }
        //if pj dies
        if (Math.round(state.player.hp) <= 0) {
            //stop clock of battle and reset bossMultiplier
            run.multipleEventsCounter = 0;
            clearInterval(eventClock);
            //kiled by a sheep or chicken
            if(fight.polymorphed){
                switch (fight.polymorphedAnimal){
                    case "gallina":
                    logro.set(logro.logro_killedbychicken);
                    break;
                    case "oveja":
                    logro.set(logro.logro_killedbysheep);
                }
            }

            if(fight.bossCombat){logro.set(logro.logro_primeraderrotaporboss)}
            
            fight.polymorphed = false;
            if(state.counters.longestCombo === undefined){
                state.counters.longestCombo = state.counters.Combo;
            }else if(state.counters.longestCombo < state.counters.Combo){
                state.counters.longestCombo = state.counters.Combo;
            }
            state.counters.Combo = 0;
            count("Deaths");
            playSound("hurt" + getRandomInt(1,6));
            fight.pjDead = true;
            loadAlterCanvasChar("muerto", ui.squareSide, ui.headLevel);
            var lootedText = "";
            console.log(fight.enemy +": a")//para detectar BUG
            if (state.player.gold > 0 && enemyTypes[fight.enemy].hasgold == "true"){//acá hay un BUG
            var goldLooted = getRandomInt(state.player.lastBattleGold,state.player.lastBattleGold * 2);
            state.player.gold = state.player.gold - goldLooted;
            lootedText = " and losses some gold" +  " (" + ui.goldIcon + "-" + roundNumbertoLetter(goldLooted) + ")";
            count("goldLostInBattle", goldLooted);
            }
            console.log(fight.enemy +": b")//para detectar BUG
            print("<b>" + state.player.name + "</b>" + " has fallen in battle" + lootedText);
            npcCanvas.getContext("2d").clearRect(0, 0, pjCanvas.width, pjCanvas.height);
            state.npc = "";
            fight.enemy = "";
            fight.enemyAndNumber = "";
            fight.bossMultiplier = 1;
            fight.bossGoldMultiplier = 1;
            //Activate clock event //
            fight.autorevive = setTimeout(function(){ 
                run.previousEvent = "autorevive"
                fight.autorevive = "";       
                //var feperdida = Number(getLocal("HPBase")) * 0.75;
                var feperdida = state.player.hpBase * 1.2454654;
                state.player.faith = state.player.faith - feperdida;
                print("<b>" + state.player.name + "</b> " + "recovers himself but feels abandoned by his god (" + ui.spiritIcon + "-" + roundNumbertoLetter(feperdida) + ")") 
                fight.pjDead = false;
                loadCanvasChar(state.player.lvl, ui.squareSide, ui.headLevel);
                count("selfRevive");
                playSound("heal");
                updateHeading();
                eventMasterClock = setInterval(event, masterTime);
            }, selfrevivetime);
        }
    }
    updateHeading();
};

//Main event: REVIVE BY MISTERIOUS GUY
function reviveEV(){
    run.multipleEventsCounter += 1;
    switch(run.multipleEventsCounter){
        case 1:
        print("<b>" + state.player.name + "</b>" + " wakes up " + pickRandomItem("confused,perplexed,perturbed"));
        run.previousEvent = "reviveInCabin"
            break;
        case 2:
            print("<b>" + state.player.name + "</b>" + " is treated by a mysterious healer");
            playSound("heal");
            spell("spellHeal_8",true,frameWidth,frameHeight,currentFrame,shift);
            break;
        case 3:
            spell("spellPinRed_16",false,frameWidth,frameHeight,currentFrame,shift);
            npcCanvas.getContext("2d").clearRect(0, 0, npcCanvas.width, npcCanvas.height);
            state.npc = "";
            print("<b>" + state.player.name + "</b>" + " is totally recovered (" + ui.healIcon + roundNumbertoLetter(state.player.hpBase) + ") and the mysterious guy is gone")
            updateHeading();
            break;
        case 4:
        var randomLocality = pickRandomItem("el_Bosque,la_Pradera,el_Poblado,las_Dunas,el_Desierto,el_Pantano")
        state.zone.current = randomLocality;
        state.zone.stage = Math.floor((Math.random() * MAXSTAGES) + 1);
        count("zonesChanged");
        count("zone_" + randomLocality);
        //pickRandomBackgroundForCurrentZone();
        loadBackground(state.zone.current +  state.zone.stage);
        print("<b>" + state.player.name + "</b>" + " leaves the healer's cabin")
        count("hospital");
        run.multipleEventsCounter = 0;
        clearInterval(eventClock);
        run.disablePjBtn = false;
        eventMasterClock = setInterval(event, masterTime);
    }
};


//Main event: PRAY
function prayEV(){
    if (YesOrNot(stat("pFindCapel"),0)){
        playSound("altar");
        count("altar");
        count("altar_zone_" + state.zone.current);
        if (run.previousEvent == "enterAltar"){
            var textCapel = pickRandomItem("decides come back to the shire, returns to the shire,wants to spend more time at the temple");
        }else{
            var textCapel = pickRandomItem("finds a shire,sees a shire,finds a temple");
        }
        print("<b>" + state.player.name + "</b> " + textCapel);
        loadBackground(state.zone.current + "_altar");
        var mistico = "mistico" + getRandomInt(1,3);
        loadNPC(mistico);
        if (YesOrNot(stat("pOfrenda"),0) && state.player.gold > 0){
            run.offer = true;
        }else{
            run.offer = false;
        }
        run.previousEvent = "enterAltar"
        eventClock = setInterval(doOffering, masterTime);
    }else{
        count("negar");
        if (run.previousEvent == "negar"){
            var textCapel = pickRandomItem("finds again the same shire,sees the same shire");
        }else{
            var textCapel = pickRandomItem("finds a shire,sees a shire,finds a temple");
        }
        var faithLost = calculateFe();
        print("<b>" + state.player.name + "</b> " + textCapel + " but does not enter and continues (" + ui.spiritIcon + "-" + roundNumbertoLetter(faithLost) + ")");
        state.player.faith = state.player.faith - faithLost;
        updateHeading();
        run.previousEvent = "negar"
        eventMasterClock = setInterval(event, masterTime);
    }
}



//Main event: SLEEP OR INN
function innEV(){
    if(Math.round(state.player.hp) < Math.round(state.player.hpBase)){
           
           if (run.previousEvent == "innEV"){
            var textInn = "wants to rest a little more,still is tired"
           }else{
            var textInn = "feels tired,wants to rest,is falling asleep"
           }
           print("<b>" + state.player.name + "</b> " + pickRandomItem(textInn)) 
           run.previousEvent = "innEV"
           eventClock = setInterval(searchInn, masterTime);
    }else{
        var textNoInn = "feels good and continues his journey, continues with his trip, wants to explore a little more,has energies to continue"
        print("<b>" + state.player.name + "</b> " + pickRandomItem(textNoInn)) 
        run.previousEvent = "innEVFeelsGood"
        eventMasterClock = setInterval(event, masterTime);
    }
}

//ToDo: agregar que un pillo lo robe y escape, bajon de gold


//Main event: study and found statues
//TODO:CHECK A POTENTIAL BUG, THE WIZARD NEVER WILL BE TRUE FOR THE TWO LAST STAIMENTS
function studyEV() {
     if(YesOrNot(config.balance.pGetStatue, 0) &&  state.zone.current != "el_Poblado" &&  state.zone.current != "la_Cueva"){//found statue, poblado and cueva has not statue
        if(state.zone.current == "el_Pantano" && state.hydraMysteryResolved){//avoid show hidra statue twice, instead find a rune
            print("<b>" + state.player.name + "</b> " + "sees something...") 
            eventClock = setInterval(findRuneOrBook, masterTime);
        }else{
            print("<b>" + state.player.name + "</b> " + "sees something...") 
            eventClock = setInterval(findStatue, masterTime);
        }
        //examine the estatue

    }else{//found book or rune
    print("<b>" + state.player.name + "</b> " + "sees something...") 
    eventClock = setInterval(findRuneOrBook, masterTime);
    }
}


//Main event: start battle, getting enemy (or boss), or guardian or hydra
function enemyEV(){
    if ((YesOrNot(config.balance.pGetGuardian,0)) && (state.player.lvl > 190)){//get guardian
    //guardians in all the places
    }else if ((YesOrNot(config.balance.pGetHydra,0)) && (state.hydraMysteryResolved)){//get hydra
    //hydra in some localities
        if(state.zone.current == "el_Pantano" || state.zone.current == "las_Dunas" || state.zone.current == "la_Tundra"){
            getHydra(true);
        }else{
            getEnemy();
        }
    }else{// call other enemies, here is included boss
        getEnemy();
    }
}

    


////////////////////////////////////////////////////////////////////////////////
// ███╗   ███╗███████╗ ██████╗██╗  ██╗ █████╗ ███╗   ██╗██╗███████╗███╗   ███╗//
// ████╗ ████║██╔════╝██╔════╝██║  ██║██╔══██╗████╗  ██║██║██╔════╝████╗ ████║//
// ██╔████╔██║█████╗  ██║     ███████║███████║██╔██╗ ██║██║███████╗██╔████╔██║//
// ██║╚██╔╝██║██╔══╝  ██║     ██╔══██║██╔══██║██║╚██╗██║██║╚════██║██║╚██╔╝██║//
// ██║ ╚═╝ ██║███████╗╚██████╗██║  ██║██║  ██║██║ ╚████║██║███████║██║ ╚═╝ ██║//
// ╚═╝     ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚══════╝╚═╝     ╚═╝//
////////////////////////////////////////////////////////////////////////////////
//Mechanisms

//find statue
function findStatue(){
    run.multipleEventsCounter += 1;
    if (run.multipleEventsCounter >= 2 && run.multipleEventsCounter <= 4 ) {
        var optionTemp = 2;
    }else{
        var optionTemp = run.multipleEventsCounter;
    }
    switch(optionTemp){
        case 1:
        //found and change locality
        loadBackground(state.zone.current + "_estatua");
        count("estatuas_statue_" + state.zone.current)
        count("statuesFound");
        //print("<b>" + getLocal("pjName") + "</b> " + "finds a " + statueObj["statue_" + getLocal("currentZone")].name + " statue");
        if (run.previousEvent == "findStatue"){
            print("<b>" + state.player.name + "</b> " + "wants to try study the " + statueObj["statue_" + state.zone.current].name + " statue again");
        }else{
            print("<b>" + state.player.name + "</b> " + "finds a " + statueObj["statue_" + state.zone.current].name + " statue");
        }
        run.previousEvent = "findStatue"
        break;
        case 2:
        //examine and get or not
        if (YesOrNot(stat("pStudy"),0.15)){//increase the prob a little to avoid never activate 
            count("sucessStudyStatue");
            spell("spellStudyGood_15",true,frameWidth,frameHeight,currentFrame,shift);
            var learnTxt = pickRandomItem("finds powerful information in the statue,learns new mystical arts from the statue scripts,feels the power of the statue");
            var result = statueObj["statue_" + state.zone.current].event()
        if(result == "hydraMysteryResolved"){
            //play hydra sound
            print("<b>" + state.player.name + "</b> " + "hears something but nothing happens");
        }else{
            playSound("statUp");
            print("<b>" + state.player.name + "</b> " + learnTxt + ". Increases the <i>" + result + "</i>");
        }
            run.multipleEventsCounter = 4;
        }else{
            playSound("studyrune");
            spell("spellStudyTry_16",true,frameWidth,frameHeight,currentFrame,shift);
            var learnTxt = pickRandomItem("tries to understand what is written in the statue,reads the glyphs in at the base of the statue,observes the statue,interprets the shape of the figure and the material");
            //fail study try again
            if(run.multipleEventsCounter == 4){
                count("failStudyStatue");
                //last chance of study failed, mod text
                spell("spellStudySleep_15",true,frameWidth,frameHeight,currentFrame,shift);
                var learnTxt = pickRandomItem("does not find any pattern,can not understand the glyphs in the statue,does not know the purpose of the statue");
            }
            print("<b>" + state.player.name + "</b> " + learnTxt) 
        }
        break;
        case 5:
        print("<b>" + state.player.name + "</b> " + "leaves the statue and continues") 
        loadBackground(state.zone.current +  state.zone.stage);
        run.multipleEventsCounter = 0;
        clearInterval(eventClock);
        addXP(1);
        eventMasterClock = setInterval(event, masterTime);
    }
}


//Find book or rune
function findRuneOrBook(){
    var placesWithBooks = state.zone.current == "la_Ciudad" || state.zone.current == "el_Poblado" || state.zone.current == "el_Castillo" || state.zone.current == "la_Torre";
    run.multipleEventsCounter += 1;
    if (run.multipleEventsCounter >= 2 && run.multipleEventsCounter <= 4 ) {
        var optionTemp = 2;
    }else{
        var optionTemp = run.multipleEventsCounter;
    }
    switch(optionTemp){
        case 1:
        var number = getRandomInt(1,10);
        if(placesWithBooks){
            run.objectToStudy = "book";
            loadNPC("libro" + number)
        }else{
            run.objectToStudy = "rune";
            loadNPC("runa" + number)
        }
        print("<b>" + state.player.name + "</b> " + "finds " + (run.previousEvent == "findRuneorBook" ? "another " : "a ") + run.objectToStudy) 
        count(run.objectToStudy)
        run.previousEvent = "findRuneorBook"
        break;
        case 2:
        if (YesOrNot(stat("pStudy"),0)){
            playSound("statUp");
            count("sucessStudy");
            spell("spellStudyGood_15",true,frameWidth,frameHeight,currentFrame,shift);
            var learnTxt = pickRandomItem("finds useful information in the,learns new things from the,feels the power of knowledge of the");
            //exit loop, sucess study
            //var statToUP = pickRandomItem("pAttack,pPolymorph,fCritic,pCritic,pHeal,fHeal,pStudy,pBotin,pChangeZone,pFindCapel,pFindMaterials,pOfrenda,fOfrenda")
            var statToIncrease = statObj[statObj.random()];
            var learned = statObj.increase(statToIncrease.code);
            print("<b>" + state.player.name + "</b> " + learnTxt + " " + run.objectToStudy + " and increases the <i>" + learned + "</i>") 
            count("study_" + statToIncrease.code);
            
            run.multipleEventsCounter = 4;
        }else{
            playSound("study" + run.objectToStudy);
            spell("spellStudyTry_16",true,frameWidth,frameHeight,currentFrame,shift);
            var learnTxt = pickRandomItem("tries to understand what is written in the,reads the glyphs in the,analyzes the information in the,continues reading the");
            //fail study try again
            if(run.multipleEventsCounter == 4){
                count("failStudy");
                //last chance of study failed, mod text
                spell("spellStudySleep_15",true,frameWidth,frameHeight,currentFrame,shift);
                var learnTxt = pickRandomItem("does not find any pattern in the,can not understand anything in the,does not understand the language in the");
            }
            print("<b>" + state.player.name + "</b> " + learnTxt + " " + run.objectToStudy) 
        }
        break;
        case 5:
        print("<b>" + state.player.name + "</b> " + "leaves the " + run.objectToStudy + " and continues") 
        npcCanvas.getContext("2d").clearRect(0, 0, npcCanvas.width, npcCanvas.height);
        state.npc = "";
        run.objectToStudy = "";
        run.multipleEventsCounter = 0;
        clearInterval(eventClock);
        addXP(0.25);
        eventMasterClock = setInterval(event, masterTime);
    }
}



//Search an inn
function searchInn(){
    var placesWithInn = state.zone.current == "la_Ciudad" || state.zone.current == "el_Poblado" || state.zone.current == "el_Desierto"
    run.multipleEventsCounter += 1;
    switch(run.multipleEventsCounter){
        case 1:
            if(placesWithInn){
                loadBackground(state.zone.current + "_taberna");
                count("taberna");
                count("taberna_zone_" + state.zone.current);
                print("<b>" + state.player.name + "</b> " + "enters in an inn") 

            }else{
                loadNPC("sleepingbag");
                var textCamping = "looks for a safe place too rest,hides to rest,falls asleep"
                print("<b>" + state.player.name + "</b> " + pickRandomItem(textCamping));
                count("camping");

            }
            break;
        case 2:
            var textSleeps = "sleeps,replenishes energies,rests"
            if(placesWithInn){
                // add event of fight if have not gold
                //var innCost = getRandomInt(Number(localStorage.Gold) * 0.05,Number(localStorage.Gold) * 0.1);
                var innCost = 1 + getRandomInt(state.player.lastBattleGold * 2,state.player.lastBattleGold * 3);
                if ((state.player.gold - innCost) <= 0){
                    //innCost = Number(getLocal("Gold"));
                    //setLocal("Gold", 0);
                    //cannot affort
                    playSound("drink");
                    print("<b>" + state.player.name + "</b> " + "cannot afford pay a bed, but takes a free drink");
                    run.restAtInn = false;
                }else{
                    spell("spellSleep_24",true,frameWidth,frameHeight,currentFrame,shift);
                    state.player.gold = state.player.gold - innCost;
                    count("GoldSpendInn",Number(innCost));
                    playSound("coins");
                    print("<b>" + state.player.name + "</b> " + pickRandomItem(textSleeps) +  " (" + ui.goldIcon + "-" + roundNumbertoLetter(innCost) + ")") 
                    run.restAtInn = true;
                }
                
            }else{
                spell("spellSleep_24",true,frameWidth,frameHeight,currentFrame,shift);
                print("<b>" + state.player.name + "</b> " + pickRandomItem(textSleeps)) 
                run.restAtInn = false;
            }
            updateHeading();
            break;
        case 3:
            if(placesWithInn && run.restAtInn){
                var rested = state.player.hpBase - state.player.hp
            }
            else{
                var rested = (state.player.hpBase - state.player.hp) / getRandomInt(1,5)
            }
            state.player.hp = state.player.hp + rested;
            if ((state.player.hp + rested) >= state.player.hpBase){
                var textRecover = "feels totally renewed,feels well rested,has new energies,regained his health"
            }else{
                var textRecover = "feels slightly renewed,feels poorly rested,has some energies,regained some health"
            }
            if (Math.round(rested) <= 0){
                var textRecover = "couldn't rest well"
            };
            //spell("spellHeal_8",true,frameWidth,frameHeight,currentFrame,shift);
            updateHeading();
            npcCanvas.getContext("2d").clearRect(0, 0, npcCanvas.width, npcCanvas.height);
            state.npc = "";
            print("<b>" + state.player.name + "</b> " + pickRandomItem(textRecover) + " (" + ui.healIcon + roundNumbertoLetter(rested) + ")") 
            if(placesWithInn){
                //pickRandomBackgroundForCurrentZone();
                loadBackground(state.zone.current +  state.zone.stage);
            }
            run.restAtInn = false;
            run.multipleEventsCounter = 0;
            clearInterval(eventClock);
            eventMasterClock = setInterval(event, masterTime);
    }
}


//Pray and offer gold
function doOffering(){
    
    if(run.offer){
        run.multipleEventsCounter += 1;
        switch(run.multipleEventsCounter){
            case 1:
                var ofrendaGold = getRandomInt(state.player.gold * 0.1,state.player.gold * 0.5)
                run.feGanada = (ofrendaGold * stat("fOfrenda"));
                run.feGanada *= state.player.faithMultiplier;
                state.player.faith = state.player.faith + run.feGanada;
                state.player.gold = state.player.gold - ofrendaGold;
                count("offers");
                count("GoldOffered", Math.round(ofrendaGold));
                count("FeByGold",Math.round(run.feGanada));
                playSound("coins");
                spell("spellCoins",false,frameWidth,frameHeight,currentFrame,shift);
                var textOffering = pickRandomItem("to revere you,to please you,to exalt you,to adore you,to venerate you,to idolize you,for cherishing you,to honor you");
                print("<b>" + state.player.name + "</b>" + " offers " + ui.goldIcon + roundNumbertoLetter(ofrendaGold) + " " + textOffering);
                break;
            case 2:
                //animation anks for pj
                //playSound("pray");
                spell("spellAnk_8",true,frameWidth,frameHeight,currentFrame,shift);
                print("<b>" + state.player.name + "</b>" + " leaves the shire and continue the journey" + " (" + ui.spiritIcon + roundNumbertoLetter(run.feGanada) + ")");
                npcCanvas.getContext("2d").clearRect(0, 0, npcCanvas.width, npcCanvas.height);
                state.npc = "";
                //pickRandomBackgroundForCurrentZone();
                loadBackground(state.zone.current +  state.zone.stage);
                run.multipleEventsCounter = 0;
                clearInterval(eventClock);
                run.disableCenterBtn = false;
                run.offer = false;
                eventMasterClock = setInterval(event, masterTime);
        }
    }else{
        run.multipleEventsCounter += 1;
        if (run.multipleEventsCounter >= 2 && run.multipleEventsCounter <= 4 ) {
            var optionTemp = 2;
        }else{
            var optionTemp = run.multipleEventsCounter;
        }
        switch(optionTemp){
            case 1:
                var textPray = pickRandomItem(" adore you, prays to you, asks for your advice, praises you, exalts you, asks you for his favor")
                print("<b>" + state.player.name + "</b>" + textPray)
                break;
            case 2:
                playSound("pray");
                spell("spellAnk_8",true,frameWidth,frameHeight,currentFrame,shift);
                run.feGanada = calculateFe();
                run.feGanada *= state.player.faithMultiplier
                state.player.faith = state.player.faith + run.feGanada;
                count("FeByPray",Math.round(run.feGanada));
                var textPray = pickRandomItem(" concentrates on his pray,  asks for his greatness, tries to please you, begs for your help");
                print("<b>" + state.player.name + "</b>" + textPray + " (" + ui.spiritIcon + roundNumbertoLetter(run.feGanada) + ")")
            break;
            case 5:
                print("<b>" + state.player.name + "</b>" + " leaves the shire and continues")
                npcCanvas.getContext("2d").clearRect(0, 0, npcCanvas.width, npcCanvas.height);
                state.npc = "";
                //pickRandomBackgroundForCurrentZone();
                loadBackground(state.zone.current +  state.zone.stage);
                run.disableCenterBtn = false;
                run.offer = false;
                run.multipleEventsCounter = 0;
                clearInterval(eventClock);
                eventMasterClock = setInterval(event, masterTime);
        }
    }


updateHeading();

}




//Select random spell per level
function getSpell(lvlBase = Math.floor(state.player.lvl / 10)){
    //spellTier0
    var i;
    var spellSelected = "";
    for (i = 0; i <= lvlBase; i++) { 
        if(spellSelected !== ""){
            //spellSelected =  spellSelected + "," + eval("spellTier" + i);
            spellSelected =  spellSelected + "," + spellTiers[i];
        }else{
        //spellSelected =  eval("spellTier" + i);
        spellSelected =  spellTiers[i];
        }
    }
    return pickRandomItem(spellSelected);
}



//Add gold
function addGold(){
    if (fight.bossCombat){
         var possibleGold = state.player.hpBase * config.balance.rGold;
         state.player.lastBattleGold = getRandomInt(possibleGold,possibleGold * 2) + 1;
         state.player.gold = state.player.gold + (state.player.lastBattleGold * fight.bossGoldMultiplier);
         count("GoldFromBosses", (state.player.lastBattleGold * (fight.bossGoldMultiplier)));
    }else if(fight.hydraCombat){
        var possibleGold = state.player.hpBase * config.balance.rGold;
         state.player.lastBattleGold = getRandomInt(possibleGold,possibleGold * 2) + 1;
         state.player.gold = state.player.gold + (state.player.lastBattleGold * 15);
         count("GoldFromBosses", (state.player.lastBattleGold * (15)));
    }else{
     //if (eval(enemy).hasgold == "true") {
        if (enemyTypes[fight.enemy].hasgold == "true") {
         var possibleGold = state.player.hpBase * config.balance.rGold;
         var goldcurrentBattle = (getRandomInt(possibleGold,possibleGold * 2) + 1) * (enemySprites[fight.enemyAndNumber].rare == 1 ? RAREMULTIPLIER : 1)
         state.player.lastBattleGold = goldcurrentBattle;
         state.player.gold = state.player.gold + goldcurrentBattle;
         count("GoldFromEnemies", goldcurrentBattle);
         }else{
             //ToDo: add some material or resource
         }
    }
};


//Add XP after a battle or exploration
function addXP(specialMultiplier = 1){
    var xpGained = ((state.player.xpPerEnemy * specialMultiplier));
    //console.log(("\t" + getLocal("lvl")) +"\t"+ xpGained);
    state.player.xp = (xpGained + state.player.xp);
    updateHeading();
    if(state.player.xp >= state.player.xpNext){
        levelUP();
    };
};


//Get Botin
function getBotin() {
    run.multipleEventsCounter += 1;
    switch (run.multipleEventsCounter){
        case 1:
            run.objectToBreak = pickRandomItem("bag,barrel,box,chest,pot")
            switch (run.objectToBreak){
                case "bag":
                    loadNPC("bag");
                    break;
                case "barrel":
                loadNPC("barrel");
                    break;
                case "box":
                loadNPC("box");
                    break;
                case "chest":
                    var number = getRandomInt(1,6);
                    loadNPC("chest" + number);
                    break;
                case "pot":
                    var number = getRandomInt(1,4);
                    loadNPC("pot" + number);
            }
            print("<b>" + state.player.name + "</b>" + " sees " + (run.previousEvent == "getBotin" ? "another " : "a ")  + run.objectToBreak);
            break;
        case 2:
        if (run.objectToBreak == "bag"){
            playSound("coins");
            var botinTexts = " takes the bag and finds ";
        }else if(run.objectToBreak == "chest"){
            playSound("unlock");
            var botinTexts = " opens the chest and finds ";
            spell("spellKey_8",false,frameWidth,frameHeight,currentFrame,shift);
        }else{
            if (run.objectToBreak == "pot"){
                playSound("breakPot");
            }else{
                playSound("breakWood");
            }
            var botinTexts = " breaks the " + run.objectToBreak +" and finds ";
            spell("spellPush9",false,frameWidth,frameHeight,currentFrame,shift);
        }
        npcCanvas.getContext("2d").clearRect(0, 0, npcCanvas.width, npcCanvas.height);
        state.npc = "";
        var goldBotin = 1 + getRandomInt(state.player.lastBattleGold, state.player.lastBattleGold * 10);
        print("<b>" + state.player.name + "</b>" + botinTexts + ui.goldIcon + roundNumbertoLetter(goldBotin));
        count("BotinGot");
        count("GoldFromBotin",goldBotin)
        count("GoldFromBotin_" + run.objectToBreak,goldBotin)
        count("BotinGot_" + run.objectToBreak);
        state.player.gold = state.player.gold + goldBotin;
        if(Number(counterText("BotinGot_chest")) > 100){logro.set(logro.logro_botines)};
        if(Number(counterText("BotinGot_pot")) > 100){logro.set(logro.logro_pots)};
        run.previousEvent = "getBotin"
        updateHeading();    //Update heading
        run.multipleEventsCounter = 0;
        clearInterval(eventClock);
        addXP(0.5);
        eventMasterClock = setInterval(event, masterTime);//trigger event selecter
            
    }
    
   
};



//Change locality
function changeLocality() {
    run.multipleEventsCounter += 1;
    //console.log(multipleEventsCounter);
    switch (run.multipleEventsCounter) {
    case 1:
        //get new zone
        state.zone.last = state.zone.current;
        //save in getLocal("currentZone")
        print("<b>" + state.player.name + "</b> left the " + zones[state.zone.last].name);
        
        getZone();
        //get a new zone
        break;
    case 2:
        //change background
        //pickRandomBackgroundForCurrentZone();
        loadBackground(state.zone.current + state.zone.stage);
        print("<b>" + state.player.name + "</b> is entering to the " + zones[state.zone.current].name + ", " + pickRandomItem(zones[state.zone.current].legend));
        break;
    case 3:
        //cancel the Interval, put 0 to the counter and trigger a new event
        addXP(1);
        run.previousEvent = "changeLocality";
        run.multipleEventsCounter = 0;
        clearInterval(eventClock);
        eventMasterClock = setInterval(event, masterTime);
        //trigger event selecter
    }

};


//Get enemy by current locality and drow it
function getEnemy() {
    //generate a unique type of attack for each enemy
    fight.bossCombat = false;
    fight.hydraCombat = false;
    if (YesOrNot(config.balance.pGetBoss, 0)) {
        playSound("boss");
        count("Bosses");
        fight.bossCombat = true;
        fight.bossMultiplier = 2.5;
        fight.bossGoldMultiplier = 5;
        var boss = zones[state.zone.current].boss;
        // if (boss == "cuboq" || boss == "etymos" || boss == "infraespectro"){
        //     document.getElementById("npcCanvas").style.opacity = 0.7;
        // }else{
        //     document.getElementById("npcCanvas").style.opacity = 1;
        // }
        fight.enemy = boss;
        count("typeBoss_" + boss)
        loadNPC(boss);
        fight.enemyHP = (getRandomInt(state.player.enemyHpRange * 0.75, state.player.enemyHpRange * 1.25)) * fight.bossMultiplier;
        fight.enemyHPbase = Math.round(fight.enemyHP)
        updateHeartNPC()
        //enemyName = "<span style='color:DarkRed'><img class='imgInConsole' height='" + em + "' src='img/boss.png'/>" + " " + boss.toUpperCase() + "</span>";
        fight.enemyName = "<span style='color:DarkRed'><img class='imgInConsole' height='" + ui.em + "' src='img/boss.png'/>" + " " + enemyTypes[boss].name.toUpperCase() + "</span>";
    } else {
        //spellEnemy = pickRandomItem("spellPush1,spellPush2,spellPush3,spellPush4,spellPush5,spellPush6,spellPush7,spellPush8,spellPush9,spellPush10");
        fight.enemy = pickRandomItem(zones[state.zone.current].enemies).toLowerCase();
        // if (!!eval(enemy).translucid){
        //     document.getElementById("npcCanvas").style.opacity = 0.8;
        // }else{
        //     document.getElementById("npcCanvas").style.opacity = 1;
        // }
        count("enemy_" + fight.enemy);
        var number = Math.floor((Math.random() * enemyTypes[fight.enemy].max) + 1);
        //random number of the image max    
        //select a spell based on the school of enemy
        fight.spellEnemy = pickRandomItem(npcSpells[enemySprites[fight.enemy + number].type]);
        fight.enemyAndNumber = fight.enemy + number;
        if (enemySprites[fight.enemyAndNumber].rare == 1){
            count("rareEnemyEncounters");
        }else{
            count("enemyEncounters");
        }
        loadNPC(fight.enemy + number);
        fight.enemyHP = (getRandomInt(state.player.enemyHpRange * 0.75, state.player.enemyHpRange * 1.25));
        fight.enemyHPbase = Math.round(fight.enemyHP)
        updateHeartNPC()
        var raretext = (enemySprites[fight.enemy + number].rare == 1 ? " <b><small>(RARE)</small></b> " : "");
        
        if (fight.enemy == "baba" || fight.enemy == "el_esqueleto" || fight.enemy == "animalejo" || fight.enemy == "polipoide" || fight.enemy == "momia") {
            //avoid name creatures and others
            //enemyName = "A " + enemyTypes[enemy].name;
            fight.enemyName = "A " + enemySprites[fight.enemy + number].altName + raretext;
        } else if (fight.enemy == "el_capricor"){
            fight.enemyName = "The " + capitalize(enemyTypes[fight.enemy].name) + raretext;
        }
        else {
            if (enemySprites[fight.enemy + number].altName){//choose the altername if have some
                fight.enemyName = "<i>" + randomName() + "</i> the " + capitalize(enemySprites[fight.enemy + number].altName) + raretext;
            }else{
                fight.enemyName = "<i>" + randomName() + "</i> the " + capitalize(enemyTypes[fight.enemy].name) + raretext;
            }
        }
    }
    var startBattleText = "has entered in " + (run.previousEvent == "enemy" ? "another" : "a") + " battle!,finds " + (run.previousEvent == "enemy" ? "another" : "an") + " enemy!,start " + (run.previousEvent == "enemy" ? "another" : "a") + " fight!"
    if (fight.enemy + number == "el_mediano14") startBattleText = "shouts: HEY GUY LOOK AT ME!"
    run.previousEvent = "enemy";
    if (fight.bossCombat){ 
        var article = (run.previousEvent == "boss" ? "another" : "a")
        startBattleText = "has entered in " + article + " battle with a Boss!,finds " + article + " Boss!,start " + article + " fight with a Boss!"
        run.previousEvent = "boss";
    }
    print("<b>" + state.player.name + "</b> " + pickRandomItem(startBattleText));
    
    eventClock = setInterval(battle, masterTime);
};


//ToDo: cuando cargue el_mediano14, logro de Hey guy look at me.
//The world is losing it's values, the un-polite enemies do not see the opponent in the face


function getHydra(newEncounter = false){
    fight.bossCombat = false;
    fight.hydraCombat = true;
    playSound("hidra");
    fight.hydra =  zones[state.zone.current].hidrasName;
    if(!state.hydraHeads[fight.hydra]){state.hydraHeads[fight.hydra] = 1};
    fight.enemy = fight.hydra;
    loadNPC(fight.hydra + state.hydraHeads[fight.hydra]);
    fight.enemyHP = (getRandomInt(state.player.enemyHpRange * 0.75, state.player.enemyHpRange * 1.25)) * (state.hydraHeads[fight.hydra]);
    fight.enemyHPbase = Math.round(fight.enemyHP)
    updateHeartNPC();
    fight.enemyName = "<span style='color:DarkGreen'><img class='imgInConsole' height='" + ui.em + "' src='img/boss.png'/>" + " " + fight.hydra.toUpperCase() + "</span>";
    if (newEncounter){
        count("Hydras");
        count("typeofHydras_" + fight.hydra)
        var startBattleText = "has entered in a battle with a hydra!,finds an hydra!,start a fight with a hydra!"
        print("<b>" + state.player.name + "</b> " + pickRandomItem(startBattleText));
        eventClock = setInterval(battle, masterTime);
    } else {
        var startBattleText = "sees how another head grows!, sees how the hydra regenerates its heal points"
        print("<b>" + state.player.name + "</b> " + pickRandomItem(startBattleText));
    }
    
}



//Performs attack
function attackEV() {
    if (YesOrNot(stat("pPolymorph"), 0) && !fight.hydraCombat && !fight.bossCombat && !fight.polymorphed && fight.enemy !== "baba" && fight.enemy !== "el_elemental" && fight.enemy !== "el_ent" && fight.enemy !== "el_espectro" && fight.enemy !== "el_esqueleto" && fight.enemy !== "el_golem" && fight.enemy !== "el_ojo" && fight.enemy !== "la_esencia"){
        if (document.hasFocus()){animateClock = setInterval(animatePJ, 100)};
        fight.enemyHP = 1;
        updateHeartNPC()
        spell("spellPinBlue_16",false,frameWidth,frameHeight,currentFrame,shift);
        count("school_" + spells.spellPinBlue_16.school)
        fight.polymorphedAnimal = pickRandomItem("gallina,oveja");
        playSound(fight.polymorphedAnimal);
        loadNPC(fight.polymorphedAnimal);
        print("<b>" + state.player.name + "</b>" + " cast polymorphism!");
        count("Polymorph_" + fight.polymorphedAnimal);
        fight.polymorphed = true;
    } else {
        if (YesOrNot(stat("pAttack"), 0)) {
            //determine the prob of attack, if fail enemy attack
            if (YesOrNot(stat("pCritic"), 0)) {
                //animateClock = setInterval(animatePJ, 100)                
                if (document.hasFocus()){animateClock = setInterval(animatePJ, 100)};
                //determine if is critical or not
                var pjAttackWithCritic = state.player.attack * stat("fCritic") * stat("fAttack");
                pjAttackWithCritic *= config.balance.sacredDamageMultiplier;
                var spellId = getSpell();
                if (spellId == "spellChispasMulti_12" || spellId == "spellRainMultiColor_24" || spellId == "spellColorSpin_16"){
                    pjAttackWithCritic = pjAttackWithCritic * 4 //if is one of the divine powers
                }
                if (fight.enemyHP - pjAttackWithCritic < 0) {//avoid -hp in enemy
                    fight.enemyHP = 0;
                } else {
                    fight.enemyHP = Math.round(fight.enemyHP) - Math.round(pjAttackWithCritic);
                }
                updateHeartNPC()
                count("school_" + spells[spellId].school)
                spell(spellId,false,frameWidth,frameHeight,currentFrame,shift,true);
                print("<b>" + state.player.name + "</b> performs a <b>critic attack!</b>" + " (" + ui.attackIcon + roundNumbertoLetter(state.player.attack * stat("fAttack")) + ") &times; " + Math.round(stat("fCritic")) + " - " + ui.heartIcon + roundNumbertoLetter(fight.enemyHP));
                //if (document.hasFocus()){animateClock = setInterval(animatePJ, 100)};
                count("Critics");
            } else {
                //animateClock = setInterval(animatePJ, 100)
                if (document.hasFocus()){animateClock = setInterval(animatePJ, 100)};
                //attack with no critic
                var pjHit = getRandomInt(state.player.attack * 0.5, state.player.attack) * stat("fAttack");
                pjHit *= config.balance.sacredDamageMultiplier;
                var spellId = getSpell();
                if (spellId == "spellChispasMulti_12" || spellId == "spellRainMultiColor_24" || spellId == "spellColorSpin_16"){
                    pjHit *= 4 //if is one of the divine powers
                }
                if (fight.enemyHP - pjHit < 0) {//avoid -hp in enemy
                    fight.enemyHP = 0;
                } else {
                    fight.enemyHP = Math.round(fight.enemyHP) - Math.round(pjHit);
                }
                updateHeartNPC()
                count("school_" + spells[spellId].school)
                var spellText = spells[spellId].name.toLowerCase()
                
                if (spells[spellId].school == "Physical"){
                    var text = pickRandomItem(" uses the , attacks with the ");
                }else{
                    var text = pickRandomItem(" cast , attacks with ");
                }

                print("<b>" + state.player.name + "</b>" + text + spellText + " (" + ui.attackIcon + roundNumbertoLetter(pjHit) + ") - " + ui.heartIcon + roundNumbertoLetter(fight.enemyHP));
                spell(spellId,false,frameWidth,frameHeight,currentFrame,shift);

                //if (document.hasFocus()){animateClock = setInterval(animatePJ, 100)};
                count("Attacks");

            }
            if(pjAttackWithCritic > 500 || pjHit > 500){logro.set(logro.logro_attack500)}
            if(pjAttackWithCritic > 1000 || pjHit > 1000){logro.set(logro.logro_attack1000)}
        } else {
            //enemy attack
            //animateClockNPC = setInterval(animateNPC, 100)
            if (document.hasFocus()){animateClockNPC = setInterval(animateNPC, 100)};
            var enemyHit = getRandomInt(state.player.enemyAttackRange * 0.5, state.player.enemyAttackRange * stat("fAttack")) * fight.bossMultiplier;

            if (fight.enemy == "midas"){enemyHit *= 2}//duplicate midas attack

            if (fight.spellEnemy == "spellChispasMulti_12" || fight.spellEnemy == "spellRainMultiColor_24" || fight.spellEnemy == "spellColorSpin_16"){
                enemyHit *= 4 //if is one of the divine powers
            }

            if (state.player.hp - enemyHit < 0) {
                state.player.hp = 0;
            } else {
                state.player.hp = state.player.hp - enemyHit;
            }
            print(fight.enemyName + " attacks (" + ui.attackIcon + roundNumbertoLetter(enemyHit) + ")");
            if (fight.bossCombat){
                fight.spellEnemy = pickRandomItem(zones[state.zone.current].bossSpell);
            }else if (fight.hydraCombat){
                fight.spellEnemy = pickRandomItem(zones[state.zone.current].hidrasSpells);
            }
            spell(fight.spellEnemy,true,frameWidth,frameHeight,currentFrame,shift);
            count("IncomingAttacks");
            //if (document.hasFocus()){animateClockNPC = setInterval(animateNPC, 100)};
        }
    }
};


//Performs healing
function healEV() {
        count("Heal");
            var healOperation = state.player.hpBase * stat("fHeal");
            var healHit = getRandomInt(healOperation * 0.5,healOperation);
            if (state.player.hp + healHit > state.player.hpBase){
                healHit =  state.player.hpBase - state.player.hp;
                state.player.hp = state.player.hpBase;
            }else{
                state.player.hp = state.player.hp + healHit;
            }
        playSound("heal");
        spell("spellHeal_8",true,frameWidth,frameHeight,currentFrame,shift);
        print("<b>" + state.player.name + "</b>" + pickRandomItem(" casts heal spell and restore , cast minor healing , use restauration ") + "(" + ui.healIcon + roundNumbertoLetter(healHit) + ")");    
         
        
    
};





//Card combat game
function cardCombat(){

}

//////////////////////////////END MECHANISM REGION////////////////////////////////
//------------------------------------------------------------------------------//







///////////////////////////////////// 
//  ██████╗ █████╗ ██╗      ██████╗//
// ██╔════╝██╔══██╗██║     ██╔════╝//
// ██║     ███████║██║     ██║     //
// ██║     ██╔══██║██║     ██║     //
// ╚██████╗██║  ██║███████╗╚██████╗//
//  ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝//
/////////////////////////////////////
//Calcs 


//Calculate fe per action (losses and gains)
function calculateFe(){
    return (getRandomInt(((state.player.hpBase * config.balance.rGold)),state.player.hpBase * config.balance.rGold * 5 ));
}

//Set the timer to avoid loss seconds
function setLiveTime(){
    state.meta.playTimeMs += performance.now() - run.timeStart;
    run.timeStart = performance.now()
}

//Create the localStorage object if it does not exist and add 1 by default to the stats and return the current number



//Do something probability Yes or Not
;



//Get random number in an interval
;



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



//Get a random name
function randomName() {
    var name = pickRandomItem("B,C,D,F,G,H,J,K,L,M,N,P,Q,R,S,T,V,W,X,Y,Z,Sh,Kh,Th,Br,Tr,Mr,Zr,Xh,Sj,Cr,Kr,Yh,A,E,I,O,U");
    name += pickRandomItem("A,E,I,O,U").toLowerCase();
    name += pickRandomItem("B,C,D,F,G,H,J,K,L,M,N,P,Q,R,S,T,V,W,X,Y,Z,Ss,Kh,Th,Br,Tr,Mr,Zr,Xh,Sj,Cr,Kr,Yh").toLowerCase();
    if(fight.enemyAndNumber.match("amazona") || fight.enemyAndNumber.match("guerrera") || fight.enemyAndNumber.match("hechicera") || fight.enemyAndNumber.match("pilla")){//feminice name
        name += pickRandomItem("A,E,I").toLowerCase();
        name += pickRandomItem("A,E,I,B,C,D,F,G,H,J,K,L,M,N,P,S,V,W,X,Y,Z,Ss,Kh,Th,Xh,Sj,Yh,'").toLowerCase();
        name += pickRandomItem("E,I,A,,,,,,,,,,").toLowerCase();
    }else{
        name += pickRandomItem("A,E,I,O,U").toLowerCase();
        name += pickRandomItem("A,E,I,O,U,B,C,D,F,G,H,J,K,L,M,N,P,Q,R,S,T,V,W,X,Y,Z,Ss,Kh,Th,Br,Tr,Mr,Zr,Xh,Sj,Cr,Kr,Yh,'").toLowerCase();
        name += pickRandomItem("E,I,O,U,,,,,,,,,,").toLowerCase();
    }
    count("RandomNames");
    if(!!state.player.name){
    if(name == state.player.name){logro.set(logro.logro_namesake);}
    };

    //avoid rename the two sacred
    if(fight.enemyAndNumber == "el_hechicero10" || fight.enemyAndNumber == "la_hechicera7" ){
        if(!state.sacredNames[fight.enemyAndNumber]){
            state.sacredNames[fight.enemyAndNumber] = name;
        }else{
            name = state.sacredNames[fight.enemyAndNumber];
        }
    }



    return name;
};



//Return a random element from a list
;



//Select random background for currentZone
function pickRandomBackgroundForCurrentZone() {
    var randomLocality = pickRandomItem(places[state.zone.current + state.zone.stage].moves)
    loadBackground(randomLocality);
};


//Search for a close zone to move
function getZone() {
    if (state.zone.current !== undefined) {
        count("zonesChanged");
        var randomLocality = pickRandomItem(places[state.zone.current + state.zone.stage].destinations)
        state.zone.current = randomLocality.match(/\D+/).toString();//extract no digits
        state.zone.stage = Number(randomLocality.match(/\d+/));//extract digits
        count("zone_" + state.zone.current);
        } else {
        state.zone.current = "la_Ciudad";//default start
    }
};


;


//Put first char in uppercase
;

//count number of spells that know
function countSpellKnown(){
    var lvlBase = Math.floor(state.player.lvl / 10)
    var numberSpells = 0;
        for (var i = 0; i <= lvlBase; i++) { 
            numberSpells += Number(spellTiers[i].split(',').length)
        }
    return numberSpells
}


//Stats page helpers (v1 scanned every localStorage key for these)

// A counter formatted for the stats page, or 0 if it never happened (v1: check("idx_..."))
function counterText(name){
    return state.counters[name] ? roundNumbertoLetter(state.counters[name]) : 0;
}

// "Golem (3), Slime (5)" for every counter starting with prefix, e.g. "enemy_".
// Names come from enemies/zones, or from statObj/statueObj when inObj says so.
function counterList(prefix, inObj = ""){
    var out = "";
    for (const [key, value] of Object.entries(state.counters)){
        if (!key.startsWith(prefix)) continue;
        var text = key.slice(prefix.length);
        var entry = inObj == "" ? (enemyTypes[text] || zones[text]) : { statObj, statueObj }[inObj][text];
        out += capitalize(entry.name) + " (" + value + "), ";
    }
    return out.slice(0,-2);
}

// Table rows for every unlocked achievement
function achievementList(){
    var out = "";
    for (const text of Object.keys(state.achievements)){
        out += '<div class="divTableRow"><div class="divTableCell"><img src="img/' + logro[text].name + '.png" height="' + ui.em * 4 + 'px" /></div><div class="divTableCell"><strong>' + logro[text].title + '</strong> <br>' + logro[text].description + '</div></div>';
    }
    return out;
}

//count logros
function countLogros(){
    return Object.keys(state.achievements).length;
}


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
        
    
    
    var orientation = screen.msOrientation || (screen.orientation || screen.mozOrientation || {}).type;
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


var centerMain;
var centerLauncher;
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
    var startBtnW = document.getElementById("startBtn").style.width  = ((ui.objectSize * 0.09375) * 1.90625) * 1.5 + "px";  
    // document.getElementById("btnBlackBack").style.width  = startBtnW;
    document.getElementById("scroll").style.width = ui.objectSize + "px";  
    document.getElementById("scrollBackCenter").style.width = ui.objectSize + (ui.objectSize * 0.075) + "px";  
    document.getElementById("scrollBackUp").style.width = ui.objectSize + (ui.objectSize * 0.075) + "px";  
    document.getElementById("scrollBackDown").style.width = ui.objectSize + (ui.objectSize * 0.075) + "px";  

    document.getElementById("scrollText").style.width = ui.objectSize + "px";  
    document.getElementById("btnClose").style.width  = ui.objectSize * 0.09375 + "px";  
    
    var pjBtnWidth = document.getElementById("pjDivineBtn").style.width = ui.objectSize * 0.325 + "px";
    document.getElementById("npcDivineBtn").style.width = ui.objectSize * 0.325 + "px";
    var centerDivineBtn = document.getElementById("centerDivineBtn").style.width = ui.objectSize * 0.35 + "px";

    document.getElementById("backMapa").style.width = ui.objectSize + "px"; 
    document.getElementById("bocadilloMapa").style.width  = ui.objectSize * 0.075 + "px";  
    document.getElementById("pjMapa").style.width  = ui.objectSize * 0.065 + "px";  

    
    
    
    


    //heights
    var headingH = document.getElementById("heading").style.height = ui.objectSize * 0.21 + "px";
    var marcoH = document.getElementById("marco").style.height = ui.objectSize * 0.3125 + "px";
    var sceneCanvasH = document.getElementById("esceneCanvas").style.height = ui.objectSize * 0.25 + "px";
    document.getElementById("pjCanvas").style.height = ui.objectSize * 0.25 + "px";
    document.getElementById("npcCanvas").style.height = ui.objectSize * 0.25 + "px";
    document.getElementById("spellCanvas").style.height = ui.objectSize * 0.25 + "px";
    document.getElementById("XPprogressBar").style.height  = ui.objectSize * 0.035  + "px";
    var backConsoleH = document.getElementById("backConsole").style.height = window.innerHeight - parseInt(sceneCanvasH) * 1.2 - parseInt(headingH) * 1.2 + "px";
    var consoleH = document.getElementById("console").style.height = parseInt(backConsoleH) * 0.94 + "px";
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

    var pjBtnLeft = document.getElementById("pjDivineBtn").style.left = (parseInt(marcoH) * 0.1) + "px";
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


    var pjBtnWidth = document.getElementById("pjDivineBtn").style.width = ui.objectSize * 0.325 + "px";
    document.getElementById("npcDivineBtn").style.width = ui.objectSize * 0.325 + "px";
    var centerDivineBtn = document.getElementById("centerDivineBtn").style.width = ui.objectSize * 0.35 + "px";


    //heights
    var headingH = document.getElementById("heading").style.height = ui.objectSize * 0.24 + "px";
    var marcoH = document.getElementById("marco").style.height = ui.objectSize * 0.3125 + "px";
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

    var pjBtnLeft = document.getElementById("pjDivineBtn").style.left = (parseInt(marcoH) * 0.1) + "px";
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




//hide content from scroll
function hideScrollContent(){
    clearInterval(statsClock);
    enableMainButtons()
    document.getElementById("scrollBackDown").style.opacity = 0;
    document.getElementById("scrollBackUp").style.opacity = 0;
    document.getElementById("mapa").style.display = "none"
    document.getElementById("innerTextScroll").style.display = "none"
    document.getElementById('innerTextScroll').innerHTML='';
    document.getElementById("scroll").style.zIndex = 0;
    document.getElementById("scrollBackCenter").removeEventListener("transitionend", hideScrollContent)
	
	
	//switch positions scene and console
	ui.sceneOnTop = true;
	layoutPortrait()
}
  
// scroll close 
function scrollClose(){
    ui.scrollCurrentContent = "";
    playSound("scroll");
    document.getElementById("btnClose").style.display = "none";
    document.getElementById("btnClose").style.top = ui.objectSize * 0.065 + "px";
    var content = document.getElementById("scrollText");
    var el = document.getElementById("scrollBackCenter");
    var sbd =  document.getElementById("scrollBackDown");

    el.style.minHeight = 0 + "px";
    content.style.minHeight = 0 + "px";
    sbd.style.top = ui.objectSize * 0.02 + "px";

    //crate a event that listen the css transition, and after that remove the listener in hideScrollContent
    el.addEventListener("transitionend", hideScrollContent);
	
  }

//show the close button only when the scroll is totally opened
function showCloseButton(){
    document.getElementById("btnClose").style.display = "block";
    document.getElementById("scrollBackCenter").removeEventListener("transitionend", showCloseButton)
}

// scroll open
function scrollOpen(currentContent,height = (window.innerHeight - (ui.objectSize * 0.25) * 1.5)){
    ui.scrollCurrentContent = currentContent;
    playSound("scroll");
    var content = document.getElementById("scrollText");
    var el = document.getElementById("scrollBackCenter");

    var orientation = screen.msOrientation || (screen.orientation || screen.mozOrientation || {}).type;
    if (!!orientation.match("landscape") && detectmob()){
        height = window.innerHeight * 0.92;
    }

    disableMainButtons()
    document.getElementById("scrollBackUp").style.opacity = 1;
    var sbd =  document.getElementById("scrollBackDown");
    sbd.style.top = ui.objectSize * 0.02 + "px";
    //sbd.style.visibility = "visible";
    sbd.style.opacity = 1;


    document.getElementById("scroll").style.zIndex = 150;
    el.style.minHeight = height * 0.97 + "px";
    content.style.minHeight = height * 0.92 + "px";
    sbd.style.top = height * 0.97 + "px";

    el.addEventListener("transitionend", showCloseButton);
	
		//switch positions scene and console
	ui.sceneOnTop = false;
	layoutPortrait()
  }


//Put the bocadillo in the right place in the map
function localizarBocadillo(){
    if (ui.currentBackGround == "curanderobg"){
        document.getElementById("bocadilloMapa").style.display ="none";
        document.getElementById("pjMapa").style.display ="none";
    }else{
        if(state.zone.current == "la_Mina" || state.zone.current == "la_Cueva" || state.zone.current == "el_Volcan"){
            document.getElementById("backMapa").src = "img/mapaunderground.png";
        }else{
            document.getElementById("backMapa").src = "img/mapa.png";
        }
        if(!ui.currentBackGround.match(/_altar/) && !ui.currentBackGround.match(/_estatua/)){
        var localidad = places[ui.currentBackGround];
        document.getElementById("zoneMap").innerHTML= "The " + zones[state.zone.current].name;
        var mapWidth = document.getElementById("backMapa").style.width;
        document.getElementById("bocadilloMapa").style.display ="block";
        document.getElementById("pjMapa").style.display ="block";
        document.getElementById("bocadilloMapa").style.left = parseInt(mapWidth) * localidad.x + "px";
        document.getElementById("bocadilloMapa").style.top = parseInt(mapWidth) * localidad.y + "px";
        document.getElementById("pjMapa").style.left = parseInt(mapWidth) * localidad.x * 1.01 + "px";
        document.getElementById("pjMapa").style.top = parseInt(mapWidth) * localidad.y * 0.98 + "px";
        }else{
            document.getElementById("bocadilloMapa").style.display ="none";
            document.getElementById("pjMapa").style.display ="none";
        }
    }
    
}

///////////////////////////////////////////////
//  ██████╗ ████████╗██╗  ██╗███████╗██████╗ //
// ██╔═══██╗╚══██╔══╝██║  ██║██╔════╝██╔══██╗//
// ██║   ██║   ██║   ███████║█████╗  ██████╔╝//
// ██║   ██║   ██║   ██╔══██║██╔══╝  ██╔══██╗//
// ╚██████╔╝   ██║   ██║  ██║███████╗██║  ██║//
//  ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝//
///////////////////////////////////////////////                                          
//Other funcs

//Initial name, suggest the first name and put in the input and check if is first launch
//if not first use run the game
//var sessionID;
function initialName(){
    //add uniqueID for this session:
    //sessionID = Math.random().toString(36).substr(2, 16);
    // if(!localStorage[thx("uniqueSessionID")]){
    //     setLocal("uniqueSessionID",sessionID)
    // }
    // if(getLocal("uniqueSessionID") === sessionID){

 

    // The Capricor is extinct once its last one was killed (v1 checked this inside the zone data)
    if (state.achievements.logro_ultimocapricor) {
        zones.el_Bosque.enemies = "el_Elfo,Animalejo,el_Ent,el_Herbo,la_Amazona";
    }

    if(state.firstUse){
        document.getElementById("inputName").value = randomName();
        document.getElementById("launcher").style.display = "none" ;

    }else{
        start();
    }
// }else{
//     document.getElementsByTagName("BODY")[0].style.display = "none";
//     window.location.href="about:blank";
//     alert("Wizardidle is running in another tab!")
// }

}

//Only when start button is pressed
function setName(){
    if(document.getElementById("inputName").value !== ""){
            if(!state.player.name){state.player.name = document.getElementById("inputName").value};
        }else{
            if(!state.player.name){state.player.name = randomName()};
        }
        document.getElementById("launcher").style.display = "none" ;
        document.getElementById("main").style.display = "block" ;
        //fadeOut(document.getElementById("launcher"))
        //fadeIn(document.getElementById("main"))
        state.meta.playTimeMs = 0;
        start();
}

// //start counting seconds of live of each wizard
// window.addEventListener('load', function(event) {
//     timeStart = performance.now()
//     //avoid back key in android go works and exit the app
//     window.history.pushState({ noBackExitsApp: true }, '')
//   });

//avoid back button in android exit app
// window.addEventListener('popstate', function(event) {
    // if (event.state && event.state.noBackExitsApp) {
    //   window.history.pushState({ noBackExitsApp: true }, '')
    // }
//   })



// v1 registered an offline-cache service worker here. v2 ships a self-removing
// service-worker.js instead (so nobody gets stuck on cached v1 files); a proper
// offline cache comes back before the 2.0.0 release.




//avoid clic when scroll is open
  function disableMainButtons() {
    var eles = document.getElementsByClassName('dis');
    for (var i=0; i < eles.length; i++) {
      eles[i].prev_click = eles[i].onclick; // save the previous value
      eles[i].onclick = false;
    }
}

function enableMainButtons() {
    var eles = document.getElementsByClassName('dis');
    for (var i=0; i < eles.length; i++)
       eles[i].onclick = eles[i].prev_click;  // restore the previous value
    };






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

//Kill button funct
function killBtn(){
    updateKill();
    document.getElementById("innerTextScroll").style.display = "block";
    scrollOpen("kill");    
}

function realKill(){
    world.cemetery.push({
        name: state.player.name,
        lvl: state.player.lvl,
        age: state.player.age,
        born: state.meta.createdAt,
        died: new Date().toISOString(),
    });
    clearInterval(animateClock);
    clearInterval(animateClockNPC);
    clearInterval(eventMasterClock);
    clearInterval(eventClock);
    run.multipleEventsCounter = 0;
    deleteSave();
    location.reload();
}

// Cemetery lines as v1 wrote them: "Name (lvl: 12) died at the age of 23. May 3, 2026 - May 9, 2026"
function cemeteryText(){
    var dateOptions = {year: 'numeric', month: 'long', day: 'numeric'};
    return world.cemetery.map(function(w){
        return w.name + " (lvl: " + roundNumbertoLetter(w.lvl) + ") died at the age of " + roundNumbertoLetter(w.age) + ". " +
            new Date(w.born).toLocaleDateString("en", dateOptions) + " - " + new Date(w.died).toLocaleDateString("en", dateOptions) + "<br>";
    }).join("");
}


//pj divine button funct
function pjBtn(){
    if (!run.disablePjBtn){
        if(fight.pjDead){
            count("divineTouch");
            run.disablePjBtn = true;
            playSound("revive")
            spell("spellMultiDivine_28",true,frameWidth,frameHeight,currentFrame,shift);
            print("<b>" + state.player.name + "</b> " + "feels the divine touch!");
            if (!!fight.autorevive){
                clearTimeout(fight.autorevive);
                fight.autorevive = "";
            }
            //
            state.player.hp = state.player.hpBase;
            loadBackground("curanderobg");
            fight.pjDead = false;
            loadCanvasChar(state.player.lvl, ui.squareSide, ui.headLevel);
            loadNPC("curandero");
            //
            eventClock = setInterval(reviveEV, masterTime);
        }else{
            //heal pj
            // console.log("HP " + getLocal("HP"));
            // console.log("HPBase " + getLocal("HPBase"));
            var healOperation = state.player.hpBase * stat("fHeal");
            var healHit = getRandomInt(healOperation * 0.5 ,healOperation * 2);
            if ( Math.round(state.player.hp) +  Math.round(healHit) >  Math.round(state.player.hpBase)){
                healHit =   Math.round(state.player.hpBase) -  Math.round(state.player.hp); //modify heal to avoid overhealing
            }
            var faithLost = healHit * getRandomInt(1,3);//determine faith cost
            //balance faith cost
            if ( Math.round(state.player.faith) -  Math.round(faithLost) < 0) {//avoid extra attack and reduce the god attack to the amount of faith
                faithLost = state.player.faith;//update faith cost
                healHit = faithLost / getRandomInt(1,3);//update heal hit
            }
            if ((Math.round(state.player.hp) < Math.round(state.player.hpBase)) && ( Math.round(state.player.faith) > 0)){
                count("DivineHeal");
                if (state.player.hp + healHit > state.player.hpBase){
                    healHit = state.player.hpBase - state.player.hp;//update values
                    state.player.hp = state.player.hpBase;
                    faithLost = healHit * getRandomInt(1,3)//update values
                }else{
                    state.player.hp = state.player.hp + (healHit);
                } 
                //localStorage[thx("fe")] = thx(Number(getLocal("fe")) - faithLost);
                state.player.faith = state.player.faith - faithLost;
                
                // console.log("faithLost " + faithLost)
                // console.log("healHit " + healHit)
                updateHeading();
                
                playSound("heal");
                spell("spellHeal_8",true,frameWidth,frameHeight,currentFrame,shift);
                print("<b>" + state.player.name + "</b> " + "feels a healing touch and recovers " + ui.healIcon + roundNumbertoLetter(healHit)/* + " (" + spiritIcon + " -" + roundNumbertoLetter(faithLost) + ")"*/);

            }

    }
}
}

//npc divine button funct
function npcBtn(){
    if(!!state.npc && !!fight.enemy && Math.round(state.player.faith) > 0 && Math.round(fight.enemyHP) > 1){
        //hurt npc
        var divineHit = getRandomInt(state.player.attack * 1.5, state.player.attack * 3);
        if ( Math.round(fight.enemyHP) -  Math.round(divineHit) <= 0){//modify the divineHit to avoid god kills
            divineHit = ( Math.round(fight.enemyHP) - 1);
        }
        var faithLost =  divineHit * getRandomInt(1,3)
        if ( Math.round(state.player.faith) - Math.round(faithLost) < 0) {//avoid extra attack and reduce the god attack to the amount of faith
            faithLost = state.player.faith;
            divineHit = faithLost / getRandomInt(1,3);//update divine hit
        }

            var spellId = getSpell(20);
            spell( spellId,false,frameWidth,frameHeight,currentFrame,shift);
            if (spellId == "spellChispasMulti_12" || spellId == "spellRainMultiColor_24" || spellId == "spellColorSpin_16"){
                divineHit = Math.round(divineHit) * 8 //if is one of the divine powers
                var txt = "sees how the god's wrath destroy the enemy - ";
            }else{
                var txt = "feels the god's power over the enemy - ";
            }
            fight.enemyHP = Math.round(fight.enemyHP) - (Math.round(divineHit));
            
            updateHeartNPC()
            state.player.faith = state.player.faith - faithLost;
            updateHeading();
            print("<b>" + state.player.name + "</b> " + txt + ui.heartIcon + " " + roundNumbertoLetter(fight.enemyHP))
            count("DivineHit");
        }
    }

//center divine button funct
function centerBtn(){
    //increase faith like offer
    if(!run.disableCenterBtn){
        if(state.player.gold > 0 && !!ui.currentBackGround.match(/altar/gi)){
            run.disableCenterBtn = true;
            var ofrendaGold = getRandomInt(state.player.gold * 0.25, state.player.gold * 0.75);
            //feGanada = (ofrendaGold / getRandomInt(7,15)) * getLocal("fOfrenda");
            run.feGanada = (ofrendaGold * stat("fOfrenda"));
            run.feGanada *= state.player.faithMultiplier;
            state.player.faith = state.player.faith + run.feGanada;
            state.player.gold = state.player.gold - ofrendaGold;
            //localStorage.idx_offers = Number(localStorage.idx_offers) + ofrendaGold;
            var textoffer = "feels the need to give a higher tithe, increases the tithe, feels that someone order to offer extra gold"
            print("<b>" + state.player.name + "</b> " + pickRandomItem(textoffer) + " (" + ui.goldIcon + " -" + roundNumbertoLetter(ofrendaGold) + ", " + ui.spiritIcon + " " + roundNumbertoLetter(run.feGanada) + ")");
            count("DivineMandatoryOffers");
            count("GoldOffered", Math.round(ofrendaGold));
            count("FeByGold",Math.round(run.feGanada));
            updateHeading();
            playSound("coins");
            spell("spellCoins",false,frameWidth,frameHeight,currentFrame,shift);
        }
    }
}


//control close button in the scroll
function btnCloseEvent(){
    if (ui.scrollCurrentContent == "history"){//unpause game after history
       pauseToggle();
    }
    scrollClose()
}


//map button funct
function mapBtn(){
    if(state.zone.current == "la_Mina" || state.zone.current == "la_Cueva" || state.zone.current == "el_Volcan"){
        document.getElementById("backMapa").src = "img/mapaunderground.png";
    }else{
        document.getElementById("backMapa").src = "img/mapa.png";
    }
    document.getElementById("bocadilloMapa").src = "img/bocadillo.png";
    document.getElementById("pjMapa").src = "img/lvl" + Math.floor(state.player.lvl / 10) * 10 + ".png";
    document.getElementById("mapa").style.display = "block";
    localizarBocadillo()
    
    
    scrollOpen("map");
}


//help button funct
function helpBtn(){
    updateHelp();
    document.getElementById("innerTextScroll").style.display = "block";
    scrollOpen("help");
}


//stats button funct
function statsBtn(){
    //document.getElementById('innerTextScroll').innerHTML= statsPage;
    statsClock = setInterval(updateStats,masterTime);
    updateStats();
    document.getElementById("innerTextScroll").style.display = "block";
    scrollOpen("stats");
}



function archBtn(){
    updateAchievements();
    document.getElementById("innerTextScroll").style.display = "block";
    scrollOpen("achievements");

}


////////////////////////////////////////////////
//  ████████╗███████╗██╗  ██╗████████╗███████╗//
//  ╚══██╔══╝██╔════╝╚██╗██╔╝╚══██╔══╝██╔════╝//
//     ██║   █████╗   ╚███╔╝    ██║   ███████╗//
//     ██║   ██╔══╝   ██╔██╗    ██║   ╚════██║//
//     ██║   ███████╗██╔╝ ██╗   ██║   ███████║//
//     ╚═╝   ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝//
////////////////////////////////////////////////
//Texts
function updateAchievements(){

    var txt = "<div id='achievements'><span class='titles' id='titleAchievements'>Achievements</span><br>"
    txt += achievementList();
    //txt += '<div class="divTableRow"><div class="divTableCell"><img src="img/no_logro.png" height="' + em * 4 + 'px" /></div><div class="divTableCell"><strong>?????????????</strong> <br></div></div>';
    txt += "</div>"
    document.getElementById('innerTextScroll').innerHTML=txt;
    document.getElementById("titleAchievements").style.fontSize = ui.em * 2.5 + "px";
    document.getElementById("titleAchievements").style.lineHeight = ui.em * 2.5 + "px";  

}

function updateStats(){

    var secondsIngameInstats = ((state.meta.playTimeMs + (performance.now() - run.timeStart))/1000).toFixed(0);
    var numLogrosGanados = countLogros();
    ui.statsPage = "<div id='stats'><span class='titles' id='titleStats'>Stats</span><br>" + 
    "<span class='subtitles'>Wizard</span><br>" + 
    "Name: " + (state.player.name) + "<br>" +
    "Level: " + roundNumbertoLetter(state.player.lvl) + "<br>" +
    "Age: " + roundNumbertoLetter(state.player.age) + " yrs<br>" +
    "Health points: " + roundNumbertoLetter(state.player.hpBase) + "<br>" + 
    "Attack points: " + roundNumbertoLetter(state.player.attack) + "<br>" + 
    "Critic multiplier: " + roundNumbertoLetter(stat("fCritic")) + "<br>" + 
    "Exp. to next level: " + Math.round((state.player.xpNext - state.player.xp) * 100) + "<br>" + 
    "Time of existence: " + /*roundNumbertoLetter(secondsIngameInstats) + "~" +*/ secsToHours(secondsIngameInstats) + "<br>" +
    "<br><span class='subtitles'>Battles</span><br>" + 
    "Attacks: " + counterText("Attacks") + "<br>" + 
    "Critic attacks: " + counterText("Critics") + "<br>" + 
    "Melee attacks: " + counterText("school_Physical") + "<br>" + 
    "Magical attacks: " + (Number(counterText("Attacks")) - Number(counterText("school_Physical")))  + "<br>" + 
    "Attacks received: " + counterText("IncomingAttacks") + "<br>" + 
    "Enemy encounters: " + counterText("enemyEncounters") + "<br>" + 
    "Enemies derroted: " + counterText("EnemiesKilled") + "<br>" + 
    "Rare encounters: " + counterText("rareEnemyEncounters") + "<br>" + 
    "Rare derroted: " + counterText("rareEnemiesKilled") + "<br>" + 
    (counterText("enemyEncounters") > 0 ? "Types of enemies found: " + counterList("enemy_") + "<br>" : "") + 
    //"Bosses found: " + check("idx_Bosses") + "<br>" + 
    "Bosses found: " + counterText("Bosses") + (counterText("Bosses") > 0 ? " {" + counterList("typeBoss_") + "}": "") + "<br>" + 
    "Bosses derroted: " + counterText("BossesKilled") + "<br>" +
    (state.hydraMysteryResolved &&  counterText("Hydras") > 0 ?  "Hydras found: " + counterText("Hydras") + " {" + counterList("typeofHydras_") + "}<br>": "") +
    (state.hydraMysteryResolved &&  counterText("Hydras") > 0 ?  "Hydras derroted: " + counterText("HydrasKilled") + "<br>" : "") +
    (state.hydraMysteryResolved &&  counterText("Hydras") > 0 ?  "Hydras heads chopped off: " + counterText("HydrasHeadCut") + "<br>" : "") +
    "Falls: " + counterText("Deaths") + "<br>" + 
    "Current flawless victory: " + counterText("Combo") + "<br>" + 
    "Longest flawless victory: " + counterText("longestCombo") + "<br>" + 
    "<br><span class='subtitles'>Magic</span><br>" + 
    "Current magical level: " + Math.floor(state.player.lvl / 10) + "<br>" + 
    "Known spells: " + countSpellKnown() + "<br>" + 
    "Arcane spells cast: " + counterText("school_Arcane") + "<br>" + 
    "Healing spells cast: " + counterText("Heal") + "<br>" + 
    "Nature spells cast: " + counterText("school_Nature") + "<br>" + 
    "Fire spells cast: " + counterText("school_Fire") + "<br>" + 
    "Frost spells cast: " + counterText("school_Frost") + "<br>" + 
    "Thunder spells cast: " + counterText("school_Thunder") + "<br>" + 
    "Shadow spells cast: " + counterText("school_Shadow") + "<br>" + 
    "Divine spells cast: " + counterText("school_Divine") + "<br>" + 
    "Enemies polymorphed into a sheep: " + counterText("Polymorph_oveja") + "<br>" + 
    "Enemies polymorphed into a chicken: " + counterText("Polymorph_gallina") + "<br>" + 
    "<br><span class='subtitles'>Study</span><br>" + 
    "Books found: " + counterText("book") + "<br>" + 
    "Runes found: " + counterText("rune") + "<br>" + 
    "Successful studies: " + counterText("sucessStudy") + "<br>" + 
    "Failed studies: " + counterText("failStudy") + "<br>" + 
    "Successful statue studies: " + counterText("sucessStudyStatue") + "<br>" + 
    "Failed statue studies: " + counterText("failStudyStatue") + "<br>" + 
    (counterText("sucessStudyStatue") > 0 ?  "Skills incresed studing books or runes: " + counterList("study_", "statObj") + "<br>" : "") + 
    "<br><span class='subtitles'>Exploration</span><br>" + 
    "Current zone: " + "The " + zones[state.zone.current].name + "<br>" + 
    "Last zone: " + "The " + zones[state.zone.last].name + "<br>" + 
    "Changes of zones: " + counterText("zonesChanged") + "<br>" + 
    "Times in the Prairie: " + counterText("zone_la_Pradera") + "<br>" + 
    "Times in the City: " + counterText("zone_la_Ciudad") + "<br>" + 
    "Times in the Castle: " + counterText("zone_el_Castillo") + "<br>" + 
    "Times in the Town: " + counterText("zone_el_Poblado") + "<br>" + 
    "Times in the Cave: " + counterText("zone_la_Cueva") + "<br>" + 
    "Times in the Grute: " + counterText("zone_la_Gruta") + "<br>" + 
    "Times in the Tower: " + counterText("zone_la_Torre") + "<br>" + 
    "Times in the Forest: " + counterText("zone_el_Bosque") + "<br>" + 
    "Times in the Swamp: " + counterText("zone_el_Pantano") + "<br>" + 
    "Times in the Dunes: " + counterText("zone_las_Dunas") + "<br>" + 
    "Times in the Tundra: " + counterText("zone_la_Tundra") + "<br>" + 
    "Times in the Volcano: " + counterText("zone_el_Volcan") + "<br>" + 
    "Times in the Desert: " + counterText("zone_el_Desierto") + "<br>" + 
    "Times in the Heidan: " + counterText("zone_el_Heidan") + "<br>" + 
    "Times in the Duenon: " + counterText("zone_el_Duenon") + "<br>" + 
    "Times in the Mine: " + counterText("zone_la_Mina") + "<br>" + 
    "Bags found: " + counterText("BotinGot_bag") + "<br>" + 
    "Chests found: " + counterText("BotinGot_chest") + "<br>" + 
    "Pots found: " + counterText("BotinGot_pot") + "<br>" + 
    "Barrels found: " + counterText("BotinGot_barrel") + "<br>" + 
    "Boxes found: " + counterText("BotinGot_box") + "<br>" + 
    "Total statues found: " + counterText("statuesFound") + "<br>" + 
    (counterText("statuesFound") > 0 ? "Type of statues found: " + counterList("estatuas_", "statueObj") + "<br>" : "") + 
    "<br><span class='subtitles'>Economy</span><br>" + 
    "Current gold: " + roundNumbertoLetter(state.player.gold) + "<br>" + 
    "Total gold looted: " + counterText("GoldFromEnemies") + "<br>" + 
    "Total gold looted from bosses: " + counterText("GoldFromBosses") + "<br>" + 
    "Total gold found: " + counterText("GoldFromBotin") + "<br>" + 
    "Total gold lost in battles: " + counterText("goldLostInBattle") + "<br>" + 
    "Gold found in bags: " + counterText("GoldFromBotin_bag") + "<br>" + 
    "Gold found in chests: " + counterText("GoldFromBotin_chest") + "<br>" + 
    "Gold found in pots: " + counterText("GoldFromBotin_pot") + "<br>" + 
    "Gold found in barrels: " + counterText("GoldFromBotin_barrel") + "<br>" + 
    "Gold found in boxes: " + counterText("GoldFromBotin_box") + "<br>" + 
    "<br><span class='subtitles'>Leisure</span><br>" + 
    "Rests in inns: " + counterText("taberna") + "<br>" + 
    "Gold spend at inns: " + counterText("GoldSpendInn") + "<br>" + 
    "Campings: " + counterText("camping") + "<br>" + 
    "<br><span class='subtitles'>Spirituality</span><br>" + 
    "Faith: " + roundNumbertoLetter(state.player.faith) + "<br>" + 
    "Offers: " + counterText("offers") + "<br>" + 
    "Tithe: " + counterText("GoldOffered") + "<br>" + 
    "Faith obtained by gold: " + counterText("FeByGold") + "<br>" + 
    "Faith obtained by pray: " + counterText("FeByPray") + "<br>" + 
    "Faith obtained by corruption erradication: " + counterText("FeByCleanCorruption") + "<br>" + 
    "Shrines visited: " + counterText("altar") + "<br>" + 
    (counterText("altar") > 0 ? "Shrines visited in: " + counterList("altar_zone_") + "<br>" : "") + 
    "Mandatory offers: " + counterText("DivineMandatoryOffers") + "<br>" + 
    "Negations: " + counterText("negar") + "<br>" + 
    "Self recovery: " + counterText("selfRevive")  + "<br>" + 
    "Recovered by healer: " + counterText("hospital") + "<br>" + 
    "Divine touches: " + counterText("divineTouch") + "<br>" + 
    "Divine healings: " + counterText("DivineHeal") + "<br>" + 
    "Divine punishments to enemies: " + counterText("DivineHit") + "<br>" + 
    "<br><span class='subtitles'>Achievements</span><br>" + 
    "Currenly won: " + numLogrosGanados + "<br>" + 
    "Completation: " + Math.round((numLogrosGanados / (Object.keys(logro).length - 1)) * 100) + "%<br>" + 
    "</div>";   
    document.getElementById('innerTextScroll').innerHTML= ui.statsPage;  
    document.getElementById("stats").style.fontSize = ui.em + "px";
    document.getElementById("stats").style.lineHeight = ui.em + "px";
    document.getElementById("titleStats").style.fontSize = ui.em * 2.5 + "px";
    document.getElementById("titleStats").style.lineHeight = ui.em * 2.5 + "px";    

}

function updateHelp(){
    var frequentQuestions = '<b>Why everyone has a name?</b> - All individuals of sentient species have one (Pybryas are very smart!)<br>' +
    '<b>Why the wizard knows all the names?</b> - The console is not what the wizard sees, is what you sees, and you are an omniscient god that know all the names<br>' +
    '<b>Why everyone is so hostile?</b> - It is a very conflictive world and the interspecific hate is very accepted<br>' +
    '<b>Why other humans attack my wizard</b> - He is a heretic in the eyes of the King Midas<br>' +
    '<b></b> - <br>' +
    '<b></b> - <br>' +
    '<b></b> - <br>' +
    '<b></b> - <br>' +
    '<b></b> - <br>' +
    '<b></b> - <br>';

    var txt = '<div id="help"><span class="titles" id="titleHelp">Help</span><br>' +
   '<div class="faq">WizardIDLE, what is this?</div><div class="a">It is a game with typical elements of a common RPG game, the only difference is the player role. You are the god of the wizard and your interaction is limited due his free will. With or withour your help the wizard can reach to his fate being a deep believer or a hardened atheist.</div>' +
   '<div class="faq">About the Gameplay</div><div class="a">This is an idle game, a true idle game, you must do nothing. The wizard can perform all actions without your help. This is a different way to play, watching what other beings do without your control but some interference (you can interact with miracles). <b><i>This is a god like game</i></b>.</div>' +
   '<div class="faq">Graphical layout</div><div class="a">The screen is divided in three main parts. From top to bottom:<br> <b>The control</b>, this is an informational panel with the name, experience bar, level, heal points, gold and faith points. In this panel you can found the buttons to access other information displayed in <b>The scroll</b>.<br><b>The console</b>, where is printed all actions performed by the wizard.<br><b>The scene</b>, this is the graphical version of the console, <i>you can click or touch to intect</i> with the wizard, non-player caracters or enviroments. </div>' +
   '<div class="faq">Icons explanation</div><div class="a">' +
        '<div class="divTableRow"><div class="divTableCell"><img src="img/boss.png" height="' + ui.em + 'px" /></div><div class="divTableCell">Boss, this encounter is harder than others, the reward is multiplied too.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img src="img/attack.png" height="' + ui.em + 'px" /></div><div class="divTableCell">Attack, followed by the amount of damage against the wizard or the enemy.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img src="img/heart.png" height="' + ui.em + 'px" /></div><div class="divTableCell">Wizard health, can be found in five states depending of the percentage (100%, 75%, 50%, 10%, and 0%).</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img style="filter: hue-rotate(45deg)" src="img/heart.png" height="' + ui.em + 'px" /></div><div class="divTableCell">Enemy health, as well wizard health, it can be found in five states.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img src="img/achivement.png" height="' + ui.em + 'px" /></div><div class="divTableCell">Achivement, just won a achivement.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img src="img/gold.png" height="' + ui.em + 'px" /></div><div class="divTableCell">Gold, represent the currency in the game.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img src="img/heal.png" height="' + ui.em + 'px" /></div><div class="divTableCell">Healing, followed by amount of health recovered.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img src="img/spirit.png" height="' + ui.em + 'px" /></div><div class="divTableCell">Faith, divine currency in the game, divine touches and other stuff cost faith instead gold.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><span style="font-size:' + ui.em * 1.5 + 'px">!</span></div><div class="divTableCell">Showed near the bottom-right corner, new content or update is available in the server. Reload the game to download the new content for offline access.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><span style="font-size:' + ui.em * 1.5 + 'px">...</span></div><div class="divTableCell">Showed near the bottom-right corner, searching for new content or updates.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><span style="font-size:' + ui.em * 1.5 + 'px">.</span></div><div class="divTableCell">Showed near the bottom-right corner, the game can run but some problem with the offline functions happens. No enough space, your browser does not allow cache, or cache is in conflict with a previous one.</div></div>' +
   '</div>' +
   '<div class="faq">The wizard</div><div class="a">The center of this game, ' + (state.player.name) + ' is growing in power and ambitions. The fate is just one.</div>' +
   '<div class="faq">The player</div><div class="a"><b>You</b>, to avoid interrupt the free will of the wizard, you can only watch and help limited reducing the faith of the wizard. If the wizard has faith < 0 you cannot help him.</div>' +
   '<div class="faq">Divine touches</div><div class="a">This is the main player interaction with the wizard and occurs when click or touch the Scene panel. Some basic interactions are: <ol><li>Touch the wizard heal him (cost faith).</li><li>Touch the wizard when he is dead (soft dead) revive him.</li><li>Touch the enemy damage him/her/it (cost faith).</li><li>Touch a shire mandate the wizard to give a tribute in gold (gain faith).</li>'+(state.travelFavor ? "<li>Touch the map teleport the wizard to the selected area.</li>" : "")+'</ol></div>' +
   '<div class="faq">Kill the wizard</div><div class="a">' +
   '<div class="divTableRow"><div class="divTableCell"><img src="img/diebtn.png" height="' + ui.objectSize * 0.09375 + 'px" /></div><div class="divTableCell">This is a definitive option, with this the player can destroy the current wizard in order to create another, <b>this action cannot be undone.</b></div></div>' +
   '</div>' +
   '<div class="faq">Achievements</div><div class="a">' + 
   '<div class="divTableRow"><div class="divTableCell"><img src="img/archbtn.png" height="' + ui.objectSize * 0.09375 + 'px" /></div><div class="divTableCell">A history of events your wizard achieve during his journey.</div></div>' +
   '</div>' +
   '<div class="faq">Stats</div><div class="a">' +
   '<div class="divTableRow"><div class="divTableCell"><img src="img/statsbtn.png" height="' + ui.objectSize * 0.09375 + 'px" /></div><div class="divTableCell">Many stats about what happen in the wizard trip. Pure informational.</div></div>' +
   '</div>' +
   '<div class="faq">Map</div><div class="a">' + 
   '<div class="divTableRow"><div class="divTableCell"><img src="img/mapbtn.png" height="' + ui.objectSize * 0.09375 + 'px" /></div><div class="divTableCell">   Here you can see the representation of the continent where everything happens. ' + (state.travelFavor ? "Touching it can teleport the wizard to the selected area." : "") + '</div></div>' +
   '</div>' +
   '<div class="faq">Study and skills</div><div class="a">During the wizard\'s trip, books, runes and statues can be found available to study. A sucessful study of them increase some stats. In this way the wizard can be a strong archmage or a devote donor to your cause.</div>' +
   '<div class="faq">Faith</div><div class="a">Your interaction with the wizard\'s world depends of this currency. The wizard gains faith praying and offering in your shrines. He loses the faith avoiding enter to the shires, reviving himself, and after each divine touch.</div>' +
   '<div class="faq">Rest and healing</div><div class="a">There are different ways to heal the wizard:<br><ol><li>By himself, casting some restauration spell during the battles.</li><li>By himself, sleeping.</li><li>By your interaction, in exchange for faith.</li></ol></div>' +
   '<div class="faq">Revive (soft dead)</div><div class="a">' +
        '<div class="divTableRow"><div class="divTableCell"><img src="img/muerto.png" height="' + ui.em * 3 + 'px" /></div><div class="divTableCell">If the wizard falls in a battle, there are two ways to revive and continue with the game: <ol><li>By divine intervention touching the dead image (promotes godliness).</li><li>By himself, after some time, this cost huge amounts of faith and the recover is partial (promotes atheism).</li></ol></div></div>' +
   '</div>' +
   '<div class="faq">FAQ</div><div class="a">' + frequentQuestions + '</div>' +
   '<div class="faq">Licences</div><div class="a">' + 
   'All media included in this game was provided by the authors under Creative Commons licenses or Public domain (included: CC0,CC-BY 3.0, CC-BY-SA 3.0).<br><br>The vast majority of the graphics was created by: David E. Gervais found in the follow repository <a href="http://pousse.rapiere.free.fr/tome/" target="_blank">http://pousse.rapiere.free.fr/tome/</a>.  <br>Some other graphics was created by multiple artist and distributed by Crawl Stone Soup team (<a href="http://crawl.develz.org/wordpress/" target="_blank">http://crawl.develz.org/wordpress/</a>) based on the work rltiles (<a href="http://rltiles.sourceforge.net/" target="_blank">http://rltiles.sourceforge.net/</a>). The repository can be found at <a href="https://github.com/crawl/tiles" target="_blank">https://github.com/crawl/tiles</a> <br><br>Some of the sounds was created by:<br>David McKee (VIRiX Dreamcore) (<a href="https://soundcloud.com/virix" target="_blank">https://soundcloud.com/virix</a>) <br>Little Robot Sound Factory (<a href="http://www.littlerobotsoundfactory.com/" target="_blank">http://www.littlerobotsoundfactory.com/</a>) <br>p0ss (<a href="https://opengameart.org/users/p" target="_blank">https://opengameart.org/users/p</a>) 0ss) <br>wobbleboxx (<a href="http://wobbleboxx.com" target="_blank">http://wobbleboxx.com</a>) <br>kenney (<a href="http://kenney.nl" target="_blank">http://kenney.nl</a>) <br>Iwan Gabovitch (<a href="http://qubodup.net" target="_blank">http://qubodup.net</a>) <br>Bart Kelsey (<a href="https://opengameart.org/users/bart" target="_blank">https://opengameart.org/users/bart</a>) <br>spookymodem (<a href="https://opengameart.org/users/spookymodem" target="_blank">https://opengameart.org/users/spookymodem</a>) <br>artisticdude (<a href="https://opengameart.org/users/artisticdude" target="_blank">https://opengameart.org/users/artisticdude</a>) <br>DoKashiteru (<a href="https://opengameart.org/users/dokashiteru" target="_blank">https://opengameart.org/users/dokashiteru</a>) <br>Vehicle (<a href="http://www.vehiclemusic.eu" target="_blank">http://www.vehiclemusic.eu</a>) <br>Ogrebane (<a href="https://opengameart.org/users/ogrebane" target="_blank">https://opengameart.org/users/ogrebane</a>) <br><br>Thanks to all kind artist to share their art for other people projects' +
   '</div>' +
   '<div class="faq">Version</div><div class="a">The current version is: <b>' + version + '</b></div>' +
   '</div>';

   //'<div class="divTableRow"><div class="divTableCell"><img src="img/muerto.png" height="' + em * 3 + 'px" /></div><div class="divTableCell"></div></div>' +
   //'</div>' +

    document.getElementById('innerTextScroll').innerHTML=txt;
    document.getElementById("help").style.fontSize = ui.em + "px";
    document.getElementById("help").style.lineHeight = ui.em + "px";
    document.getElementById("titleHelp").style.fontSize = ui.em * 2.5 + "px";
    document.getElementById("titleHelp").style.lineHeight = ui.em * 2.5 + "px";  


    
    //collapsible in help scroll
    var coll = document.getElementsByClassName("faq");
    var i;
    for (i = 0; i < coll.length; i++) {
    coll[i].style.lineHeight = ui.em * 2 + "px";
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
        content.style.maxHeight = null;
        } else {
        content.style.maxHeight = content.scrollHeight + "px";
        } 
    });
    }
}

function updateKill(){
    var secondsIngameInstats = ((state.meta.playTimeMs + (performance.now() - run.timeStart))/1000).toFixed(0);
    var txt = '<div id="kill"><span class="titles" id="titleKill">Kill</span><br>' +
    '<div>' + 
    'Do you want to kill <b>' + state.player.name + '</b>?<br><br>' +
    'All progress, achievement and stats of this wizard will be lost forever (<b>this action cannot be undone</b>).<br><br>' +
    '<b>' + state.player.name + '</b> has existed for ' + secsToHours(secondsIngameInstats) + ", he is on level " + roundNumbertoLetter(state.player.lvl) + (countLogros() > 0 ? " and has " + countLogros() + " achievements" : "") + "<br><br>" +
    'For kill the wizard press Kill button below, otherwise just close this scroll.' +
    '</div>' +
    '<br><br><div>' + 
    '<img class="btn" id="realKillBtn" src="img/matar.png"/>' +
    '</div><br><br>' + 
    '<span class="titles" id="titleCementery">' + (world.cemetery.length == 0 ? "" : "Cementery") + '</span>' + 
    (world.cemetery.length == 0 ? "" : "<small>" + cemeteryText() + "</small>");
    document.getElementById('innerTextScroll').innerHTML=txt;
    document.getElementById("realKillBtn").onclick = realKill;
    document.getElementById("kill").style.fontSize = ui.em + "px";
    document.getElementById("kill").style.lineHeight = ui.em + "px";
    document.getElementById("titleKill").style.fontSize = ui.em * 2.5 + "px";
    document.getElementById("titleKill").style.lineHeight = ui.em * 2.5 + "px";
    document.getElementById("titleCementery").style.fontSize = ui.em * 2.5 + "px";
    document.getElementById("titleCementery").style.lineHeight = ui.em * 2.5 + "px";
    
    var realKillBtnW = document.getElementById("realKillBtn").style.width  = ((ui.objectSize * 0.09375) * 1.90625) * 1.5 + "px";  
    document.getElementById("realKillBtn").style.left = ((ui.objectSize - parseInt(realKillBtnW)) / 2) + "px";
    document.getElementById("realKillBtn").style.height  = (ui.objectSize * 0.09375) * 1.5 + "px"; 

}


//////////////////////////////////////////////////////////
//██╗  ██╗██╗███████╗████████╗ ██████╗ ██████╗ ██╗   ██╗//
//██║  ██║██║██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗╚██╗ ██╔╝//
//███████║██║███████╗   ██║   ██║   ██║██████╔╝ ╚████╔╝ //
//██╔══██║██║╚════██║   ██║   ██║   ██║██╔══██╗  ╚██╔╝  //
//██║  ██║██║███████║   ██║   ╚██████╔╝██║  ██║   ██║   //
//╚═╝  ╚═╝╚═╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝   //
//////////////////////////////////////////////////////////                                                      
//History

//declaration of chapter object, if text is NA, considere only a event and not a history.
var chapter = {
    lvl1:{
        text:'<span class="titles" id="historyTitle">Prologue</span>~~THE BEGINING~~<br>',
        event: function(){
            //just history reserve the event
        }
    },
    lvl10:{
        text:'<span class="titles" id="historyTitle">Chapter I</span>~~~~<br>',
        event: function(){
            //just history reserve the event
        }
    },
    lvl30:{
        text:'<span class="titles" id="historyTitle">Chapter II</span>~~DEVOTION~~<br>',
        event: function(){
            //teleport al altar de la zona
            playSound("altar");
            count("altar");
            count("altar_zone_" + state.zone.current);
            //multiplicador de fe 
            state.player.faithMultiplier = 2
            if (Number(counterText("divineTouch")) + Number(counterText("DivineHeal")) + Number(counterText("DivineHit")) > 200){
                var text = "decides to devote himself to your consecration to retribute all your help";
            }else{
                var text = "decides to devote himself to your consecration to get more divine attention";
            }
            print("<b>" + state.player.name + "</b> " + text + ", and obtain a Divine crosier")
            loadBackground(state.zone.current + "_altar");
            var mistico = "mistico" + getRandomInt(1,3);
            loadNPC(mistico);
            loadCanvasChar(state.player.lvl, ui.squareSide, ui.headLevel);
        }
    },
    lvl50:{
        text:'<span class="titles" id="historyTitle">Chapter III</span>',
        event: function(){
            //baja multiplicador de fe a la mitad, pero fe normal intacta
            console.log("evento2")
        }
    },
    lvl60:{
        text:'NA',
        event: function(){
            //print sobre nuevo staff encontrado
        }
    },
    lvl80:{
        text:'NA',
        event: function(){
            //print sobre break staff
        }
    },
    lvl90:{
        text:'<span class="titles" id="historyTitle">Chapter IV</span>',
        event: function(){
            //solo historia
            console.log("evento2")
        }
    },
    lvl100:{
        text:'NA',
        event: function(){
            //sacredDamageMultiplier agregar variable en localStorage para multiplciar daño x1.5
            //pierde fe cada que mata a alguien, esto agregar una flag, pero desarrollar eso en battleEV cuando muere enemy - "inPecado"
            //print control del staff sagrado
        }
    },
    lvl110:{
        text:'<span class="titles" id="historyTitle">Chapter V</span>',
        event: function(){
            //sacredDamageMultiplier variable de dañosagrado a 1 = sacredDamageMultiplier
            //quita flag de perder fe - "inPecado"
            console.log("evento2")
        }
    },
    lvl128:{
        text:'NA',
        event: function(){
            //aparece runa (crear nuevo evento con 4 pasos)
            //1 encuentra runa, ROJA, 
            //2 intenta estudiarla
            //3 encuentra una escritura 
            //4 cree que se trata de un mapa
            //Logro de runa roja
        }
    },
    lvl129:{
        text:'NA',
        event: function(){
            //print de teleport al volcan
            //teleport al volcal
            //no salir volcan,
            //reduce tiempo de selfrevive a 5 segundos e indicarlo en la consola, puede ser un clock cada 1.5s y al 5to ciclo, reviva.
            //Niega ayuda, agregar en divinetouch un print de negación cada toque
            //aumenta curación
        }
    },
    lvl130:{
        text:'<span class="titles" id="historyTitle">Chapter VI</span>',
        event: function(){
            //normaliza tiempo selfrevive aunque no se use por ahora
            //desbloquear otros eventos
            //ya no muere, cuando llegba a 0, se teletransporta y sana completamente
            //negación total, ninguna ayuda 
            //inPecado = "true" en localstorage
            //Daño sagrado x 3
            console.log("evento2")
        }
    },
    lvl139:{
        text:'NA',
        event: function(){
            //print de teleport a la torre
            //teleport a la torre
            //no salir de la torre,
            //aumenta ligeramente la probabilidad de encotnrar boss, agregar a addXP funcion de porcentaje y si falta 25% para subir de nivel, subir a 1 prob de que aparezca boss
            //crear condicional que luego de lvl139 no se seleccine boss en la torre
        }
    }, 
    lvl140:{
        text:'<span class="titles" id="historyTitle">Chapter VII</span>',
        event: function(){
            //bajar probabilidad de boss a la inicial
            //desbloquear otros eventos
            //hacer bandera para modificar enemigos en ciudad y torre que no aparezcan hechiceros
            console.log("evento2")
        }
    },
    lvl149:{
        text:'<span class="titles" id="historyTitle">Chapter VIII Part I</span>',
        event: function(){
            //viaja a la torre
            //elimina bandera que modifica enemigos en ciudad y torre
            //add bandera para nulificar la addXP de todos los enemigos
            //load npc especial, con hechicera7 y varios magos juntos atras
            //spell de maldición sobre PJ evita que se cure
            //allowHeal * 0 para bajar la probabilidad de que se cure
            //inicia linchamiento (agregar bandera). forzar solo batallas y cambios de escenario pero sin botines
            //agregar idx en linchamiento
            //agregar condicional de muerte y llamar chapter especial specialDeathLvl149
                //no salga calavera muerte es pausa y carga especial chapter
            console.log("evento2")
        }
    },
    specialDeathLvl149:{
        text:'<span class="titles" id="historyTitle">Chapter VIII Part II</span>',
        event: function(){
            //load npc dos sagrados
            //denegateDivineHelp = 0
            //desbloquear otros eventos
                //incluido entrar altares
                    //aplicar modificción, si fe > 0, no gana suma. Puede ser un letreo, cada que consiga fe, en el updateHeading, PJ siente como es ignorado (-FE)
                    // si fe < 0 va sumando 
            //reduce tiempo de selfrevive a 5 segundos e indicarlo en la consola, puede ser un clock cada 1.5s y al 5to ciclo, reviva. Poner textos como sabe que esta abandonado y no espera que le ayuden. Pero se puede revivir con toque divino si uno quiere
            //subir a lvl150
            //logro, linchado
            console.log("evento2")
        }
    },
    lvl60:{
        text:'<span class="titles" id="historyTitle">Chapter IX</span>',
        event: function(){
            //vuevle a ganar fe si es mayor a 0
            console.log("evento2")
        }
    },
    lvl90:{
        text:'<span class="titles" id="historyTitle">Chapter X</span>',
        event: function(){
            //ya no muere, cuando llegba a 0, se teletransporta y sana completamente
            //negación total, ninguna ayuda denegateDivineHelp
            //
            console.log("evento2")
        }
    },
    lvl99:{
        text:'NA',
        event: function(){
            //telepor a heidan
            //print que va a heidan
            //no sale de heidan
            console.log("evento2")
        }
    },
    lv200:{
        text:'<span class="titles" id="historyTitle">Chapter XI</span>',
        event: function(){
            //daño sagrado 3x
            //no entra a altares
            //eliminar fe icon y valores
            //barra xp se pone DarkRed llena
            //addXP no funciona, ningun elemento sube xp
            //add nuevo evento de aparecer curandero
                //curandero con sangre igual a la del wizard
                //ataques del curandero entre el 0.5 y 1 del wizard
            //add evento de batalla del curandero con prob
            //si mata el curandero add desenso y batalla con uno.
            console.log("evento2")
        }
    },
    specialEnd:{
        text:'<span class="titles" id="historyTitle">Epilogue</span>',
        event: function(){
            //pause end of game and final history.
            //add flag para que en reload no aparezca nada, que en vez cambie randomly de paisaje
            //en Kill, cambiar el texto y colocar boton que diga Game Over
            console.log("evento2")
        }
    },
}


//Open scroll for history closing if opened only ishas history, if not only event is triggered
function openHistory(){
    //execute the action for each lvl
    run.afterChapterExe = true;//activate post chapter event
    chapter["lvl" + state.player.lvl].event()

    //if has writen history display it
    if (chapter["lvl" + state.player.lvl].text != "NA"){
        if (parseInt(document.getElementById("scrollBackCenter").style.minHeight) > 0) {
            scrollClose()
            document.getElementById("scrollBackCenter").addEventListener("transitionend", updateHistory);
        } else{
            updateHistory();
        }
    } 
}

//update content of history scroll
function updateHistory(){
   document.getElementById("scrollBackCenter").removeEventListener("transitionend", updateHistory)
   pauseToggle();
   document.getElementById('innerTextScroll').innerHTML= chapter["lvl" + state.player.lvl].text;
   document.getElementById("innerTextScroll").style.display = "block";
   document.getElementById("historyTitle").style.fontSize = ui.em * 2.5 + "px";
   document.getElementById("historyTitle").style.lineHeight = ui.em * 2.5 + "px";
   scrollOpen("history");
}


function afterChapter(){
    run.afterChapterExe = false;
    var lvl = state.player.lvl;
    switch(lvl){
        case 30:
        npcCanvas.getContext("2d").clearRect(0, 0, npcCanvas.width, npcCanvas.height);
        state.npc = "";
        loadBackground(state.zone.current +  state.zone.stage);
        print("<b>" + state.player.name + "</b>" + " leaves the shire and continue the journey");
        break;       
        case 50:

    }
    
}





//TODO add idx for all this part and archievements
//temp dicegame
//define dice and set 1 as default
var dicesToRoll = {a: 1,b: 1,c: 1,d: 1,e: 1}
var nameDicePlayer, tie, firstPlayerWins, diceRolled; // shared by the dice game functions (were implicit globals)
var ship = false;
var captain = false;
var crew = false;
var cargo = 0;
var cargoFirstPlayer = 0;
var nameFirstPlayer = ""
var riskinDice = 7;
var countRounds = 0;
var currentHand = "";
var symbolCurrentHand = "";
var currentPlayerDice = ""
var gamblingManName = "<i>Gambling man</i>"
var isRolling = false
var resultDice = "";
var betForDice = 0;


//Start the game Six Five Four
function sixfivefour(){
    //calculate the risk (amount of cargo that consider risky)
    riskinDice = Math.floor(Math.random() * (10 - 6) ) + 6;
    //determine if the opponent start or the wizard
    var enemyStart = Math.random() >= 0.5;
    //declare bet
    betForDice = getRandomInt(state.player.gold * 0.1,state.player.gold * 0.5)
    playSound("coins");

    //console.log("enemy start: " + enemyStart)
    if (enemyStart){
        nameDicePlayer = gamblingManName
    } else {
        nameDicePlayer = "<b>" + state.player.name + "</b> "
    }

    

    countRounds++
    //spell("spellCoins",false,frameWidth,frameHeight,currentFrame,shift);
    //spell("spellCoins",true,frameWidth,frameHeight,currentFrame,shift);
    //set or equal the bet
    state.player.gold = state.player.gold - betForDice;
    updateHeading();
    print(nameDicePlayer + " starts the game and suggest a bet of " + ui.goldIcon + roundNumbertoLetter(betForDice))

    

    clearInterval(eventClock);
    eventClock = setInterval( function() { rollDicesForSixfivefour(enemyStart,nameDicePlayer); }, masterTime);
}


//Mechanism for the game Six Five Four
function rollDicesForSixfivefour(enemyStart, nameDicePlayer) {
    run.multipleEventsCounter += 1;
    
    //switch between rolling and results
    isRolling = !isRolling

    //detect if is rolling or presenting the result
    if (isRolling){
        //Roll if cargo is <= risknumber, this is usefull to skip the last rollings in case the player has a good amoung of points

        if (cargo < riskinDice || cargo <= cargoFirstPlayer){

            //animate thow dice
            if (nameDicePlayer == gamblingManName){
                if (document.hasFocus()){animateClockNPC = setInterval(animateNPC, 100)};
            }else{
                if (document.hasFocus()){animateClock = setInterval(animatePJ, 100)};
            }
            spell("spellMiniDados_18",true,frameWidth,frameHeight,currentFrame,shift,false,true);
            playSound("dice");


            //console.log("risk: " + riskinDice)
            //Set a dialog if the risk is too high
            if (riskinDice > cargo && ship && captain && crew){
                print(nameDicePlayer + " feels risky and rolls the dice to try a better cargo")
            }else if(cargo <= cargoFirstPlayer && ship && captain && crew){
                print(nameDicePlayer + " rolls the dice to try to get more cargo")
            }else{
                if (run.multipleEventsCounter == 3){
                    print(nameDicePlayer + " rolls the dice again " + ((symbolCurrentHand != '') ? '(' : '') + symbolCurrentHand + ((symbolCurrentHand != '') ? ')' : ''))
                }else if (run.multipleEventsCounter == 5){
                    print(nameDicePlayer + " plays the last turn " + ((symbolCurrentHand != '') ? '(' : '') + symbolCurrentHand + ((symbolCurrentHand != '') ? ')' : ''))
                }else{
                    print(nameDicePlayer + " rolls the dice")
                }
            }
            

            resultDice = "";
            //for each element in the dicesToRoll object put a randon from 1 to 6
            for (let elem in dicesToRoll) {
                dicesToRoll[elem] = Math.floor(Math.random() * 6 + 1)
                // "dado: " + elem + " roll: " + dicesToRoll[elem]
                //console.log("dado: " + elem + " roll: " + dicesToRoll[elem])
                //save current roll (to avoid delete info in the next steps) with images
                resultDice = resultDice + "<img class='imgInConsole' height='" + ui.em + "' src='img/d" + dicesToRoll[elem] +".png'/>"
            }
            

        
            //check if some dice is 6 an delete the dice and set ship true
            for (let elem in dicesToRoll){
                if(dicesToRoll[elem] == 6 && !ship){
                    delete dicesToRoll[elem];
                    ship = true
                    currentHand = "<img class='imgInConsole' height='" + ui.em + "' src='img/d6.png'/>:<img class='imgInConsole' height='" + ui.em + "' src='img/ship.png'/> "
                    symbolCurrentHand = "<img class='imgInConsole' height='" + ui.em + "' src='img/ship.png'/>"
                    //console.log("ship: " + ship)
                }
            }
            //check if some dice is 5 an delete the dice and set captain true
            for (let elem in dicesToRoll){
                if(dicesToRoll[elem] == 5 && ship && !captain){
                    delete dicesToRoll[elem];
                    captain = true
                    currentHand += "<img class='imgInConsole' height='" + ui.em + "' src='img/d5.png'/>:<img class='imgInConsole' height='" + ui.em + "' src='img/captain.png'/> "
                    symbolCurrentHand += "<img class='imgInConsole' height='" + ui.em + "' src='img/captain.png'/>"
                    //console.log("captain: " + captain)
                }
            }
            //check if some dice is 4 an delete the dice and set crew true
            for (let elem in dicesToRoll){
                if(dicesToRoll[elem] == 4 && ship && captain && !crew){
                    delete dicesToRoll[elem];
                    crew = true
                    currentHand += "<img class='imgInConsole' height='" + ui.em + "' src='img/d4.png'/>:<img class='imgInConsole' height='" + ui.em + "' src='img/crew.png'/> "
                    symbolCurrentHand += "<img class='imgInConsole' height='" + ui.em + "' src='img/crew.png'/>"
                    //console.log("crew: " + crew)
                }
            }
        
            //check the cargo and roll if is less than 7 (most probable number for two dices)
            if(ship && captain && crew ){
                //reset cargo in case need a second rolling of risk
                cargo = 0;
                for (let elem in dicesToRoll){
                        cargo = cargo + dicesToRoll[elem]
                }
                //console.log("cargo: " + cargo)
            }

        }else{
            
            clearInterval(eventClock);
            run.multipleEventsCounter = 0;
            print(nameDicePlayer + " thinks the cargo is enought and skip")
            //va a eval
            eventClock = setInterval( function() { evalSixFiveFour(enemyStart,nameDicePlayer); }, masterTime );
        }


}
//display the results of each roll in a separate line of print
else{

    //print result
    print(nameDicePlayer + " gets " + resultDice + ((currentHand != '') ? ' and banks ' +  currentHand : '') )

    currentHand = "";
    symbolCurrentHand = "";

    if (run.multipleEventsCounter == 6){
        clearInterval(eventClock);
        run.multipleEventsCounter = 0;
        
        //eval
        eventClock = setInterval( function() { evalSixFiveFour(enemyStart,nameDicePlayer); }, masterTime );
    }
}
}






//eval the game, if is the first round, pass to the next player
function evalSixFiveFour(enemyStart, nameDicePlayer){
    //Evaluate the current round
    if (ship && captain && crew){print(nameDicePlayer + " set sail with " + cargo + " of cargo")}
    if (ship && captain && !crew){print(nameDicePlayer + " got a ship and captain but no the crew, does not set sail (" + cargo + ")")}
    if (ship && !captain && !crew){print(nameDicePlayer + " got a ship but neither captain nor crew were available, does not set sail (" + cargo + ")")}
    if (!ship && !captain && !crew){print(nameDicePlayer + " got nothing (" + cargo + ")")}


       //Start the second round
        if (countRounds == 1){
            cargoFirstPlayer = cargo;
            nameFirstPlayer = nameDicePlayer;
            countRounds++
            if (!enemyStart){nameDicePlayer = gamblingManName} else {nameDicePlayer = "<b>" + state.player.name + "</b> "}
            resetSixFiveFour()
            clearInterval(eventClock);
            eventClock = setInterval( function() { rollDicesForSixfivefour(!enemyStart,nameDicePlayer); }, masterTime );
        }else{
            //Final scoring call
            //multipleEventsCounter = 0;
            clearInterval(eventClock);
            eventClock = setInterval( function() { finalScoreSixFiveFour(nameDicePlayer); }, masterTime );
        }

    
     

}

/*
spell("spellCoins",true,frameWidth,frameHeight,currentFrame,shift);
setLocal("Gold", Number(getLocal("Gold")) - betForDice);
updateHeading();
*/

//calculate the final result and check the winner
function finalScoreSixFiveFour(nameDicePlayer){

    run.multipleEventsCounter += 1;
    switch (run.multipleEventsCounter){
        case 1:
            countRounds = 0
            tie = cargoFirstPlayer == cargo
            
            if (!tie){
                firstPlayerWins = cargoFirstPlayer > cargo;
                if(firstPlayerWins){
                    print(nameFirstPlayer + " wins " + ui.goldIcon + roundNumbertoLetter(betForDice * 2) + " (" + cargoFirstPlayer + " vs. " + cargo + ") ")
                    var winnerDice = nameFirstPlayer;
                }else{
                    print(nameDicePlayer + " wins " + ui.goldIcon + roundNumbertoLetter(betForDice * 2) + " (" + cargoFirstPlayer + " vs. " + cargo + ") ")
                    var winnerDice = nameDicePlayer;
                }

                if (winnerDice == gamblingManName){
                    playSound("coins");
                    spell("spellCoins",false,frameWidth,frameHeight,currentFrame,shift);
                }else{
                    playSound("coins");
                    spell("spellCoins",true,frameWidth,frameHeight,currentFrame,shift);
                    state.player.gold = state.player.gold + betForDice * 2;
                    updateHeading();
                }

            }else{
                print("Nobody won (" + cargoFirstPlayer + " vs. " + cargo + ")")
                //spell("spellCoins",true,frameWidth,frameHeight,currentFrame,shift);
                state.player.gold = state.player.gold + betForDice;
                updateHeading();
            }
        break;
        case 2:
            print("<b>" + state.player.name + "</b> exits the gaming house");
            cargoFirstPlayer = 0;
            resetSixFiveFour()
            npcCanvas.getContext("2d").clearRect(0, 0, npcCanvas.width, npcCanvas.height);
            state.npc = "";
            loadBackground(state.zone.current +  state.zone.stage);
            run.restAtInn = false;
            run.multipleEventsCounter = 0;
            clearInterval(eventClock);
            eventMasterClock = setInterval(event, masterTime);
    }
}


//reset game
function resetSixFiveFour(){
    nameDicePlayer = ""
     currentHand = "";
     symbolCurrentHand = "";
     dicesToRoll = {a: 1,b: 1,c: 1,d: 1,e: 1};
     ship = false;
     captain = false;
     crew = false;
     cargo = 0;
     isRolling = false
     diceRolled = ""
}



//BUG: when the wizard is killed and start again another one, maybe some clocks are still running and have some problems

/*
 * v1 developer console - DISABLED in v2, kept for the record.
 * Clicking name -> level -> faith icon opened a box that ran any typed text with eval().
 * Not functional (it still uses the v1 storage API); safe to delete later.
 *
 * ///////////////////////
 * ///////////////////////
 * ///////////////////////
 * //////just for dev/////
 * function exe(){
 *     try{
 *     var exeString = document.getElementById("inputExe").value;
 *     var exeResult = eval(exeString);
 *     print("<span style='color:DarkRed'>DEV: " + exeResult + "</span>")
 *     }catch(err){
 *     print("<span style='color:Red'>DEV error: " + err.message+ "</span>")
 *     }
 *     }
 *
 *
 * //dev acces clic in pjname>lvl>feIcon
 * var devAccess;
 * document.addEventListener("click",function(e){
 *     //console.log(e);
 * if(e.target.id == "pjName"){
 *     devAccess = 1;
 * }else if(e.target.id == "lvl" && devAccess == 1){
 *     devAccess = 2;
 * }else if(e.target.id == "spiritIcon" && devAccess == 2){
 *     devAccess = undefined;
 *     document.getElementById("exe").style.display = "block";
 *     /*document.getElementById("pjName").style.color = getRandomColor();* /
 * } else {
 *     devAccess = undefined;
 * }
 * });
 *
 *
 * var commands = '<br>FUNCTIONS<br>\
 * pauseToggle() \
 * list(), \
 * setLocal("property", value), \
 * getLocal("property"), \
 * addXP(#factor), \
 * setLocal("forceEvent","#event,#event2"), \
 * <br>VARS<br>\
 * masterTime = #ms, \
 * selfrevivetime = #ms';
 */


//This app is made by Carlos Alonso Maya Lastra by fun//


// Entry points used by src/main.js to wire the page (v1 used inline onclick="..." attributes).
export {
    initialName, setName, responsiveLayout,
    archBtn, statsBtn, killBtn, mapBtn, helpBtn,
    pjBtn, centerBtn, npcBtn, btnCloseEvent,
};
