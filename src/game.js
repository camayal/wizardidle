// Wizard Idle v2 - game logic (phase 1: same code as v1, now an ES module).
// Original game hand-written by Carlos Alonso Maya Lastra (2018-2020), see tag v1.0.0.

import { enemyTypes, enemySprites } from './data/enemies.js';
import { zones, places } from './data/zones.js';
import { spells, spellTiers, npcSpells } from './data/spells.js';
import { achievements } from './data/achievements.js';
import { YesOrNot, getRandomInt, pickRandomItem, roundNumbertoLetter, capitalize, getRandomColor, secsToHours } from './utils.js';
import { thx, hx, getLocal, setLocal, idx, check } from './storage.js';

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
if(!localStorage[thx("firstUse")]){setLocal("firstUse", "true")};
// #region Define vars
var esceneCanvas = document.getElementById("esceneCanvas");
var pjCanvas = document.getElementById("pjCanvas");
var npcCanvas = document.getElementById("npcCanvas");
var version = "02nov2020_10pm"; //26jul2018_6pm
var uniqueID;
var objectSize = defineObjectSize();
var headLevel = objectSize * 0.109375;//56;
var squareSide = objectSize * 0.125;//64;
var charWidth = squareSide, charHeight = squareSide;
var em = getEM();
var eventClock;//declare the main clock
var eventMasterClock;
var animateClockNPC;
var animateClock;
var statusClock;
var statsClock;
var xpPercent;
var multipleEventsCounter = 0;
var frameCounter = 0;
var MAXSTAGES = 5;//max number of scenaria per locality
var MAXLINESINCONSOLE = 50;
var JUMPSPACE = squareSide / 4;
var bossCombat = false;
var hydraCombat = false;
var hydra;
var enemyHP = 0;
var enemyHPbase = 0;
var enemyName = "";
var RAREMULTIPLIER = 2;
var bossMultiplier = 1;//reset the bossmultiplier
var bossGoldMultiplier = 1;
var masterTime = 1500;
var selfrevivetime = 120000;
var enemy = "";
var enemyAndNumber = "";
var spellEnemy = "";
var polymorphed = false;
var polymorphedAnimal;
var offer;
var feGanada;
var objectToBreak;
var objectToStudy;
var scrollIDContent;
var pjDead = false;
var disablePjBtn = false;
var disableCenterBtn = false;
var sceneOnTop = true;
var currentBackGround;
var autorevive;
var audio;
var statsPage;
var timeStart;
var previousEvent;
var restAtInn = false;
var pause = false;
var scrollCurrentContent;
var afterChapterExe = false;
//vars spell animation
var frameWidth = 30;
var frameHeight = 30;
var currentFrame = 0, shift = 0;
//vars icons
var goldIcon = "<img class='imgInConsole' height='" + em + "' src='img/gold.png'/> ";
//var heartIcon = "<img class='imgInConsole' height='" + em + "' src='img/heart.png'/> ";
var heartIcon;
var spiritIcon = "<img class='imgInConsole' height='" + em + "' src='img/spirit.png'/> ";
var attackIcon = "<img class='imgInConsole' height='" + em + "' src='img/attack.png'/> ";
var healIcon = "<img class='imgInConsole' height='" + em + "' src='img/heal.png'/> ";
// #endregion





// Game data (enemies, zones, spells, achievements) now lives in src/data/.

// Achievements: definitions from data/achievements.js plus the unlock function.
const logro = {
    ...achievements,
    set: function(nameLogro){
        if(!localStorage.getItem(nameLogro.name)){
        //sonido de archivements
        playSound("achivement");
        localStorage.setItem(nameLogro.name,true);
        print("<img class='imgInConsoleSpecial' height='" + em * 1.5 + "' src='img/achivement.png'><span class='specialTextInConsole' style='font-size:" + em * 1.5 + "px; line-height:" + em * 1.5 + "px;'><b>" + nameLogro.title + "</b> - " + nameLogro.description + "</span>");
        
        if (scrollCurrentContent == "achievements"){
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
        setLocal(stat,(Number(getLocal(stat)) + value * extra))
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
        feGanada = (getRandomInt(((Number(getLocal("HPBase")) * Number(getLocal("rGold"))) * 0.75),((Number(getLocal("HPBase")) * Number(getLocal("rGold"))) * 1.5))) * 10;
        feGanada *= Number(getLocal("feMultiplicator"))
        setLocal("fe", Number(getLocal("fe")) + feGanada);
        updateHeading();
        return "divine</i> and gains some faith (" + spiritIcon + roundNumbertoLetter(feGanada) + ")<i>";
    },code:"statue_las_Dunas"},
    statue_el_Heidan: {name:"Majestic angel", event:function(){
        statObj.increase(statObj.pBotin.code,2)
        var goldFound = (Number(getLocal("lastGoldFromBattle")) * 7.3)
        setLocal("Gold", Number(getLocal("Gold")) + goldFound);
        updateHeading();
        playSound("coins");
        return statObj.pBotin.name + "</i> and found some coins (" + goldIcon + roundNumbertoLetter(goldFound) + ")<i>";
    },code:"statue_el_Heidan"},
    statue_la_Mina: {name:"Dwarf", event:function(){return statObj.increase(statObj.pFindMaterials.code,2)},code:"statue_la_Mina"},
    statue_el_Pantano: {name:"Hydra", event:function(){
        playSound("hidra");
        setLocal("hydraMysteryResolved", "true");
        logro.set(logro.logro_hydramystery);
        return "hydraMysteryResolved";
    },code:"statue_el_Pantano"},
    statue_la_Pradera: {name:"Strange bird", event:function(){return statObj.increase(statObj.fHeal.code,2)},code:"statue_la_Pradera"},
    statue_la_Torre: {name:"Wizard", event:function(){return statObj.increase(statObj.pStudy.code,2)},code:"statue_la_Torre"},
    statue_la_Tundra: {name:"Wraith", event:function(){return statObj.increase(statObj.fCritic.code,2)},code:"statue_la_Tundra"},
    statue_el_Volcan: {name:"Dragon", event:function(){return statObj.increase(statObj.pHeal.code,2)},code:"statue_el_Volcan"},
}


//Detect that is the first run and save some important information in local storage or if some is not it is saved
function checkDB(){
    if(!localStorage[thx("lvl")]){setLocal("lvl", 0)};
    if(!localStorage[thx("age")]){setLocal("age", 19)};
    if(!localStorage[thx("currentZone")]){setLocal("currentZone", "la_Ciudad")};
    if(!localStorage[thx("lastZone")]){setLocal("lastZone", "la_Torre")};
    if(!localStorage[thx("idx_zone_la_Ciudad")]){setLocal("idx_zone_la_Ciudad", 1)};
    if(!localStorage[thx("currentStage")]){setLocal("currentStage", Math.floor((Math.random()*MAXSTAGES)+1))};
    if(!localStorage[thx("idx_Combo")]){setLocal("idx_Combo", 0)};
    if(!localStorage[thx("rXP")]){setLocal("rXP", 1.1)};//1.1
    if(!localStorage[thx("rGold")]){setLocal("rGold", 0.15)};
    if(!localStorage[thx("factorHP")]){setLocal("factorHP", 8)};
    if(!localStorage[thx("rHP")]){setLocal("rHP", 1.6483)};
    if(!localStorage[thx("rEnemyXP")]){setLocal("rEnemyXP", 16)};//16
    if(!localStorage[thx("pAttack")]){setLocal("pAttack", 0.6)};
    if(!localStorage[thx("fAttack")]){setLocal("fAttack", 1)};
    if(!localStorage[thx("sacredDamageMultiplier")]){setLocal("sacredDamageMultiplier", 1)};
    if(!localStorage[thx("pPolymorph")]){setLocal("pPolymorph", 0.025)};
    if(!localStorage[thx("fCritic")]){setLocal("fCritic", 2)};
    if(!localStorage[thx("pCritic")]){setLocal("pCritic", 0.2)};
    if(!localStorage[thx("XP")]){setLocal("XP", 0)};
    if(!localStorage[thx("pHeal")]){setLocal("pHeal", 0.17)};//0.2
    if(!localStorage[thx("fHeal")]){setLocal("fHeal", 0.1)};
    //if(!localStorage[thx("fHealinn")]){setLocal("fHealinn", 0.3)};
    if(!localStorage[thx("pStudy")]){setLocal("pStudy", 0.1)};//0.25 down because it is the triple in this versio
    if(!localStorage[thx("pBotin")]){setLocal("pBotin", 0.2)};
    if(!localStorage[thx("pDados")]){setLocal("pDados", 0.1)};//0.2 down because is too much chance to stuck in dice game
    if(!localStorage[thx("pChangeZone")]){setLocal("pChangeZone", 0.35)};
    if(!localStorage[thx("allowChangeZone")]){setLocal("allowChangeZone", 1)};//1 means equal to pChangeZone, 0 means avoid changeZone at all
    if(!localStorage[thx("pGetBoss")]){setLocal("pGetBoss", 0.015)};//0.015
    if(!localStorage[thx("pGetGuardian")]){setLocal("pGetGuardian", 0.1)};//megabosses
    if(!localStorage[thx("pGetStatue")]){setLocal("pGetStatue", 0.08)};
    if(!localStorage[thx("Gold")]){setLocal("Gold",getRandomInt(10,50))};
    if(!localStorage[thx("pFindMaterials")]){setLocal("pFindMaterials", 0.2)};
    if(!localStorage[thx("pFindCapel")]){setLocal("pFindCapel", 0.35)};
    if(!localStorage[thx("pOfrenda")]){setLocal("pOfrenda", 0.25)};
    if(!localStorage[thx("fOfrenda")]){setLocal("fOfrenda", 0.5678)};//1.3748
    if(!localStorage[thx("feMultiplicator")]){setLocal("feMultiplicator", 1)};
    if(!localStorage[thx("lastGoldFromBattle")]){setLocal("lastGoldFromBattle", 0)};
    if(!localStorage[thx("fe")]){setLocal("fe",getRandomInt(10,35))};
    if(!localStorage[thx("hydraMysteryResolved")]){setLocal("hydraMysteryResolved", "false")};
    if(!localStorage[thx("pGetHydra")]){setLocal("pGetHydra", 0.1)};
    if(!localStorage[thx("forceEvent")]){setLocal("forceEvent", "")};
    if(!localStorage[thx("inPecado")]){setLocal("inPecado", "false")};
    if(!localStorage.initialDate){localStorage.initialDate=new Date();};
}

//levelUP function
function levelUP() {
    setLocal("lvl",Number(getLocal("lvl")) + 1)
    //console.log("lvl" + getLocal("lvl"))
    if (getLocal("lvl") > 1){
        //achievement
        switch (getLocal("lvl")){
            case "2":
                logro.set(logro.logro_lvl2);
            break;
            case "140":
                logro.set(logro.logro_level140);
            break;
            case "200":
                logro.set(logro.logro_level200);
            break;
            default:
            playSound("lvlup");
            print("<img class='imgInConsoleSpecial' height='" + em * 1.5 + "' src='img/star.png'></img> " + "<span class='specialTextInConsole' style='font-size:" + em * 1.5 + "px; line-height:" + em * 1.5 + "px;'> <b>" + getLocal("pjName") + " level up</b></span>" + " <img class='imgInConsoleSpecial' height='" + em * 1.5 + "' src='img/star.png'></img> ");
        }
    //calculate age
        setLocal("age", Number(getLocal("age")) + (Number(getLocal("XPNextLevel")) * 0.0005))
    }



    setLocal("XPNextLevel", Math.pow(Number(getLocal("lvl")), Number(getLocal("rXP"))) * Number(getLocal("factorHP")));
    setLocal("XPPastLevel", Math.pow((Number(getLocal("lvl")) - 1), Number(getLocal("rXP"))) * Number(getLocal("factorHP")));
    setLocal("HPBase", Number(getLocal("XPNextLevel")) * Number(getLocal("rHP")));
    setLocal("HP", Math.floor(getLocal("HPBase")));
    setLocal("rangeEnemyHP", Number(getLocal("HPBase")) * 1.2);
    setLocal("rangeEnemyAttack", Number(getLocal("HPBase")) * 0.2);
    setLocal("XPbyEnemy", ((Math.pow((Number(getLocal("lvl")) + 1), Number(getLocal("rXP"))) * Number(getLocal("factorHP"))) - Number(getLocal("XPNextLevel"))) / Number(getLocal("rEnemyXP")));
    setLocal("attack", Number(getLocal("HPBase")) * 0.2);
    //loadCanvasChar(getLocal("lvl"), squareSide, headLevel);
    updateHeading();

    //call history if exists
    if(chapter["lvl" + getLocal("lvl")]){
        openHistory()
    }else{//avoid change lvl skin automatically, for levels that needs some previous change (before get corruption staff, en 149, etc)
        loadCanvasChar(getLocal("lvl"), squareSide, headLevel);
    }

    //multilevel control (not expected)
    if(Number(getLocal("XP")) >= Number(getLocal("XPNextLevel"))){
        levelUP();
    };
   
}



//Start the game (load everything)
function start() {
    timeStart = performance.now()
    
    playSound("start");
    setLocal("currentNpc","");
    checkDB();
    if (localStorage[thx("firstUse")] === thx("true")) {
        
        levelUP();
        //artificial levelUP from 0 to 1 to add some vars
        setLocal("firstUse", "false");
    };
    if (getLocal("HP") <= 0){//perfom a weak revive if the player does not revive after reload, loss faith
        setLocal("HP", Number(getLocal("HPBase")) * 0.1);
            var feperdida = Number(getLocal("HPBase")) * 0.25;
            //localStorage[thx("fe")] = thx(Number(getLocal("fe")) - feperdida);
            setLocal("fe", Number(getLocal("fe")) - feperdida)
        print("<b>" + getLocal("pjName") + "</b> " + "loses hope in you and trys to restore himself (" + spiritIcon + "-" +  roundNumbertoLetter(feperdida) + ")");
    }
    updateHeading();
    loadCanvasChar(getLocal("lvl"), squareSide, headLevel);
    loadBackground(getLocal("currentZone") + getLocal("currentStage"));
    //load previous locality random scenaria
    eventMasterClock = setInterval(event, masterTime);
    //statusClock = setInterval(cacheStatus, 5000);
    //trigger event selecter

};


//Populate and update the headding
function updateHeading() {
    document.getElementById('pjName').innerText = getLocal("pjName");
    document.getElementById('lvl').innerText = "Lv. " + getLocal("lvl");
    document.getElementById("XPprogressBar").max = getLocal("XPNextLevel");
    document.getElementById("XPprogressBar").min = getLocal("XPPastLevel");
    document.getElementById("XPprogressBar").value = getLocal("XP");
    document.getElementById('hp').innerText = roundNumbertoLetter(getLocal("HP"));
    document.getElementById('gold').innerText = roundNumbertoLetter(Number(getLocal("Gold")));
    document.getElementById('fe').innerText = roundNumbertoLetter(Number(getLocal("fe")));
    var hpPercent = Number(getLocal("HP")) / Number(getLocal("HPBase"));
    document.getElementById("hpIcon").src = heartMeter(hpPercent);

    if (Number(getLocal("fe")) < -10000){logro.set(logro.logro_hategod)}

    //calcule % of xp bar
    xpPercent = 1 - (Number(getLocal("XPNextLevel")) - Number(getLocal("XP"))) / (Number(getLocal("XPNextLevel")) - Number(getLocal("XPPastLevel")))

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
heartIcon = '<img style="filter: hue-rotate(45deg)" class="imgInConsole" height="' + em + '" src="' + heartMeter(Math.round(enemyHP) / enemyHPbase) + '"/> ';
}

//permits continue the action but stop in the next event, if paused trigger a new event
function pauseToggle(){
    if (pause){
        pause = false;
        eventMasterClock = setInterval(event, masterTime);
    }else{
        pause = true;
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
    currentBackGround = back;
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
        ctx.drawImage(img, squareSide, headLevel, charWidth, charHeight);
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
        ctx.drawImage(img, squareSide, headLevel, charWidth, charHeight);
    }, false);
}


//Draw NPC
function loadNPC(npc, squareSideIn=squareSide, headLevelIn=headLevel, charWidthIn=charWidth, charHeightIn=charHeight) {
    setLocal("currentNpc", npc);
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
        if (getLocal("currentNpc") === "arcangel" || getLocal("currentNpc") === "doria" || getLocal("currentNpc") === "midas" || getLocal("currentNpc") === "kkck" || getLocal("currentNpc") === "herbus" || getLocal("currentNpc") === "skeleton" || getLocal("currentNpc") === "medusa" || getLocal("currentNpc") === "rainbow" || getLocal("currentNpc") === "rojo") {
            ctx.drawImage(img, squareSideIn * 6, headLevelIn - (objectSize * 0.03515625), charWidthIn * 1.25, charHeightIn * 1.25);
        }
        //big bosses (64x64px)
        else if (getLocal("currentNpc") === "bicaptop" || getLocal("currentNpc") === "cuboq" || getLocal("currentNpc") === "etymos" || getLocal("currentNpc") === "fenix" || getLocal("currentNpc") === "goro" || getLocal("currentNpc") === "infraespectro" || getLocal("currentNpc") === "protromus" || getLocal("currentNpc").match("hydskon") || getLocal("currentNpc").match("icedra")) {
            ctx.drawImage(img, squareSideIn * 6, headLevelIn - (objectSize * 0.0625), charWidthIn * 1.5, charHeightIn * 1.5);
        }
        //huge bosses (64x96px)
        else if (getLocal("currentNpc").match("mother") || getLocal("currentNpc").match("guardian")){
            ctx.drawImage(img, squareSideIn * 6, headLevelIn - (objectSize * 0.113), charWidthIn * 1.33, charHeightIn * 1.9);
        }
        //objects to get (20x20px)
        else if(getLocal("currentNpc").match("libro") || getLocal("currentNpc").match("runa")){
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


    frameCounter += 1;
    switch (frameCounter) {
    case 1:

        loadCanvasChar(getLocal("lvl"), squareSide - JUMPSPACE, headLevel);
        break;
    case 2:
       loadCanvasChar(getLocal("lvl"), squareSide, headLevel);
        frameCounter = 0;
        clearInterval(animateClock);
    }
};

//Animate npc execute as: animateClockNPC = setInterval(animateNPC, 100);
function animateNPC() {  

    //avoid  animation in high speed debug
    if(masterTime < 500){clearInterval(animateClockNPC);return}


    if (getLocal("currentNpc") != ""){
        frameCounter += 1;
        switch (frameCounter) {
        case 1:
            loadNPC(getLocal("currentNpc"), squareSide + (JUMPSPACE / 6));
            break;
        case 2:
            loadNPC(getLocal("currentNpc"));
            frameCounter = 0;
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
            frameHeight, (squareSide * mult) * leftMultiHeadLocation, headLevel * topMultiHeadLocation, squareSide * multiSize, squareSide * multiSize);
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

    audio = new Audio("ogg/" + ogg + ".ogg");
    //audio.volume = 0.3;
    audio.volume = volume;
    //audio.playbackRate = -1.0; 
    //if (loop){audio.loop = true}
    var promise = audio.play();
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
    if(pause){return}//detect pause command

    if (afterChapterExe){
    afterChapter()//call special events after history
    }

    if(getLocal("forceEvent")){//force some event for debugging and history
        var masterOption = Number(pickRandomItem(getLocal("forceEvent")));
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
    if (YesOrNot(getLocal("pBotin"), 0)) {
        //getBotin();
        objectToBreak = "";
        print("<b>" + getLocal("pjName") + "</b> is searching...");
        eventClock = setInterval(getBotin, masterTime);
    //go to dice house, use the same probability
    } else if (YesOrNot(getLocal("pDados"), 0) && getLocal("currentZone") == "la_Ciudad" || getLocal("currentZone") == "el_Poblado"){
        //check if gold is more than 0
        if(Number(getLocal("Gold")) > 0){
            //call the game function
            if (previousEvent == "sixfivefour"){
                var textDice = pickRandomItem("decides come back to the gaming house, returns to the dice house,wants to spend more coins at the gaming house");
            }else{
                var textDice = pickRandomItem("finds a gamming house and enters,wants to play 6-5-4,wants to gambling");
            }
            print("<b>" + getLocal("pjName") + "</b> " + textDice);
            loadBackground(getLocal("currentZone") + "_casadados");
            loadNPC("jugon");
            previousEvent = "sixfivefour"
            eventClock = setInterval(sixfivefour, masterTime);       
        }else{
            print("<b>" + getLocal("pjName") + "</b> " + "finds a gamming house but does not have gold to bet");
            eventMasterClock = setInterval(event, masterTime);
        }
    }else {
        if (YesOrNot(Number(getLocal("pChangeZone")) * Number(getLocal("allowChangeZone")), 0)) {
            print("<b>" + getLocal("pjName") + "</b> is exploring...");
            eventClock = setInterval(changeLocality, masterTime);
        } else {
            print("<b>" + getLocal("pjName") + "</b>" + pickRandomItem(" continues exploring the , sees something interesting and continues in the , advances in the ") + zones[getLocal("currentZone")].name);
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
    multipleEventsCounter += 1;
    var option = 1;
    if (multipleEventsCounter > 1) {//special because is a loop in the second case until someone die
        option = 2
    }
    switch (option) {
    case 1:
        //anounce the battle
        if (bossCombat) {
            print(enemyName + " releases the power and attack!" + " (" + heartIcon + roundNumbertoLetter(enemyHP) + ")");
        } else if (hydraCombat){
            print(enemyName + " releases all its fury and attack with brutality!" + " (" + heartIcon + roundNumbertoLetter(enemyHP) + ")");
        }else {
            print(enemyName + pickRandomItem(" goes back, is scared, rammed, shouts, defends himself") + " (" + heartIcon + roundNumbertoLetter(enemyHP) + ")");
        }
        break;
    case 2:
        //perform a loop until enemy or pj HP is 0
        if(YesOrNot(getLocal("pHeal"),0) && (Number(getLocal("HP")) < Number(getLocal("HPBase")))){
            healEV();
        }else{
            attackEV();
        }
        //if enemy dies
        if (Math.round(enemyHP) <= 0) {
            if (hydraCombat && (Number(getLocal("currentHead" + hydra)) + 1) <= Number(zones[getLocal("currentZone")].headsMax)){
                setLocal("currentHead" + hydra, Number(getLocal("currentHead" + hydra)) + 1);
                idx("HydrasHeadCut");
                getHydra();
            }else{//end conditional hydra, here if die bosses and enemies
                //stop clock of battle and reset bossMultiplier
            multipleEventsCounter = 0;
            clearInterval(eventClock);

            
            //kill capricor
            if (enemy == "el_capricor"){
                logro.set(logro.logro_ultimocapricor);
                zones.el_Bosque.enemies = "el_Elfo,Animalejo,el_Ent,el_Herbo,la_Amazona";
            }

            polymorphed = false;
            if (bossCombat){
                idx("BossesKilled");
                logro.set(logro.logro_primerbossderrotado)
                //todo logro de todos los boss
            }else if(hydraCombat){
                idx("HydrasKilled");
                setLocal("currentHead" + hydra, "")
                //todo logro de cada hidra
            }else{
                if(enemySprites[enemyAndNumber].rare == 1){
                    idx("rareEnemiesKilled");
                }else{
                    idx("EnemiesKilled");
                }
            }
            idx("Combo");
            if(!localStorage[thx("idx_longestCombo")]){
                setLocal("idx_longestCombo", getLocal("idx_Combo"));
            }else if(Number(getLocal("idx_longestCombo")) < Number(getLocal("idx_Combo"))){
                setLocal("idx_longestCombo", getLocal("idx_Combo"));
            }
            npcCanvas.getContext("2d").clearRect(0, 0, npcCanvas.width, npcCanvas.height);
            //addXP();
            
            
            //add faith if the enemy is corrupted but only if not boss or hydra
            if(!bossCombat && !hydraCombat){
                if (enemySprites[enemyAndNumber].corrupted == "1" && getLocal("inPecado") == "false"){
                    feGanada = calculateFe() * 5;
                    feGanada *= Number(getLocal("feMultiplicator"))
                    setLocal("fe", Number(getLocal("fe")) + feGanada);
                    idx("FeByCleanCorruption",Math.round(feGanada));
                    var corruptedText = ", also gained " + spiritIcon + " " + roundNumbertoLetter(feGanada) + " by corruption erradication";
                }else {
                    var corruptedText = "";
                }
            }

            //punish if the wizard is in sin (use the same corruptedText)
            if(getLocal("inPecado") == "true"){
                var feperdida = calculateFe();
                setLocal("fe", Number(getLocal("fe")) - feperdida);
                var corruptedText = ", and reduce the faith " + spiritIcon + " -" + roundNumbertoLetter(feperdida);

            }

            //print and add xp depent of the enemy
            if (enemyTypes[enemy].hasgold == "true") {
                playSound("coins");
                addGold();
                if(bossCombat){
                    addXP(4);
                    print(enemyName + " was defeated and a big loot has been found " + goldIcon + roundNumbertoLetter(getLocal("lastGoldFromBattle") * bossGoldMultiplier));
                }else if(hydraCombat){
                    addXP(Number(zones[getLocal("currentZone")].hidrasXPMultiplier));
                    print(enemyName + " was defeated and a treasure has been found " + goldIcon + roundNumbertoLetter(getLocal("lastGoldFromBattle") * 15));
                }else{
                    addXP(enemySprites[enemyAndNumber].rare == 1 ? RAREMULTIPLIER : 1.5);
                    print(enemyName + " was defeated and looted " + goldIcon + roundNumbertoLetter(getLocal("lastGoldFromBattle")) + corruptedText);
                }
            } else {
                if(bossCombat){//kill no gold boss
                    addXP(4);
                    print(enemyName + " was defeated");
                }else{
                    addXP(enemySprites[enemyAndNumber].rare == 1 ? RAREMULTIPLIER : 1.5);
                    print(enemyName + " was defeated" + corruptedText);
                }

            }

            enemy = "";
            enemyAndNumber = "";
            setLocal("currentNpc", "");
                bossMultiplier = 1;
                bossGoldMultiplier = 1;
                eventMasterClock = setInterval(event, masterTime);
            }
            
        }
        //if pj dies
        if (Math.round(Number(getLocal("HP"))) <= 0) {
            //stop clock of battle and reset bossMultiplier
            multipleEventsCounter = 0;
            clearInterval(eventClock);
            //kiled by a sheep or chicken
            if(polymorphed){
                switch (polymorphedAnimal){
                    case "gallina":
                    logro.set(logro.logro_killedbychicken);
                    break;
                    case "oveja":
                    logro.set(logro.logro_killedbysheep);
                }
            }

            if(bossCombat){logro.set(logro.logro_primeraderrotaporboss)}
            
            polymorphed = false;
            if(!localStorage[thx("idx_longestCombo")]){
                setLocal("idx_longestCombo", getLocal("idx_Combo"));
            }else if(Number(getLocal("idx_longestCombo")) < Number(getLocal("idx_Combo"))){
                setLocal("idx_longestCombo", getLocal("idx_Combo"));
            }
            setLocal("idx_Combo", 0);
            idx("Deaths");
            playSound("hurt" + getRandomInt(1,6));
            pjDead = true;
            loadAlterCanvasChar("muerto", squareSide, headLevel);
            var lootedText = "";
            console.log(enemy +": a")//para detectar BUG
            if (getLocal("Gold") > 0 && enemyTypes[enemy].hasgold == "true"){//acá hay un BUG
            var goldLooted = getRandomInt(Number(getLocal("lastGoldFromBattle")),Number(getLocal("lastGoldFromBattle")) * 2);
            setLocal("Gold", Number(getLocal("Gold")) - goldLooted);
            lootedText = " and losses some gold" +  " (" + goldIcon + "-" + roundNumbertoLetter(goldLooted) + ")";
            idx("goldLostInBattle", goldLooted);
            }
            console.log(enemy +": b")//para detectar BUG
            print("<b>" + getLocal("pjName") + "</b>" + " has fallen in battle" + lootedText);
            npcCanvas.getContext("2d").clearRect(0, 0, pjCanvas.width, pjCanvas.height);
            setLocal("currentNpc", "");
            enemy = "";
            enemyAndNumber = "";
            bossMultiplier = 1;
            bossGoldMultiplier = 1;
            //Activate clock event //
            autorevive = setTimeout(function(){ 
                previousEvent = "autorevive"
                autorevive = "";       
                //var feperdida = Number(getLocal("HPBase")) * 0.75;
                var feperdida = Number(getLocal("HPBase")) * 1.2454654;
                setLocal("fe", Number(getLocal("fe")) - feperdida);
                print("<b>" + getLocal("pjName") + "</b> " + "recovers himself but feels abandoned by his god (" + spiritIcon + "-" + roundNumbertoLetter(feperdida) + ")") 
                pjDead = false;
                loadCanvasChar(getLocal("lvl"), squareSide, headLevel);
                idx("selfRevive");
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
    multipleEventsCounter += 1;
    switch(multipleEventsCounter){
        case 1:
        print("<b>" + getLocal("pjName") + "</b>" + " wakes up " + pickRandomItem("confused,perplexed,perturbed"));
        previousEvent = "reviveInCabin"
            break;
        case 2:
            print("<b>" + getLocal("pjName") + "</b>" + " is treated by a mysterious healer");
            playSound("heal");
            spell("spellHeal_8",true,frameWidth,frameHeight,currentFrame,shift);
            break;
        case 3:
            spell("spellPinRed_16",false,frameWidth,frameHeight,currentFrame,shift);
            npcCanvas.getContext("2d").clearRect(0, 0, npcCanvas.width, npcCanvas.height);
            setLocal("currentNpc", "");
            print("<b>" + getLocal("pjName") + "</b>" + " is totally recovered (" + healIcon + roundNumbertoLetter(Number(getLocal("HPBase"))) + ") and the mysterious guy is gone")
            updateHeading();
            break;
        case 4:
        var randomLocality = pickRandomItem("el_Bosque,la_Pradera,el_Poblado,las_Dunas,el_Desierto,el_Pantano")
        setLocal("currentZone", randomLocality);
        setLocal("currentStage", Math.floor((Math.random() * MAXSTAGES) + 1));
        idx("zonesChanged");
        idx("zone_" + randomLocality);
        //pickRandomBackgroundForCurrentZone();
        loadBackground(getLocal("currentZone") +  getLocal("currentStage"));
        print("<b>" + getLocal("pjName") + "</b>" + " leaves the healer's cabin")
        idx("hospital");
        multipleEventsCounter = 0;
        clearInterval(eventClock);
        disablePjBtn = false;
        eventMasterClock = setInterval(event, masterTime);
    }
};


//Main event: PRAY
function prayEV(){
    if (YesOrNot(getLocal("pFindCapel"),0)){
        playSound("altar");
        idx("altar");
        idx("altar_zone_" + getLocal("currentZone"));
        if (previousEvent == "enterAltar"){
            var textCapel = pickRandomItem("decides come back to the shire, returns to the shire,wants to spend more time at the temple");
        }else{
            var textCapel = pickRandomItem("finds a shire,sees a shire,finds a temple");
        }
        print("<b>" + getLocal("pjName") + "</b> " + textCapel);
        loadBackground(getLocal("currentZone") + "_altar");
        var mistico = "mistico" + getRandomInt(1,3);
        loadNPC(mistico);
        if (YesOrNot(getLocal("pOfrenda"),0) && Number(getLocal("Gold")) > 0){
            offer = true;
        }else{
            offer = false;
        }
        previousEvent = "enterAltar"
        eventClock = setInterval(doOffering, masterTime);
    }else{
        idx("negar");
        if (previousEvent == "negar"){
            var textCapel = pickRandomItem("finds again the same shire,sees the same shire");
        }else{
            var textCapel = pickRandomItem("finds a shire,sees a shire,finds a temple");
        }
        var faithLost = calculateFe();
        print("<b>" + getLocal("pjName") + "</b> " + textCapel + " but does not enter and continues (" + spiritIcon + "-" + roundNumbertoLetter(faithLost) + ")");
        setLocal("fe", Number(getLocal("fe")) - faithLost);
        updateHeading();
        previousEvent = "negar"
        eventMasterClock = setInterval(event, masterTime);
    }
}



//Main event: SLEEP OR INN
function innEV(){
    if(Math.round(Number(getLocal("HP"))) < Math.round(Number(getLocal("HPBase")))){
           
           if (previousEvent == "innEV"){
            var textInn = "wants to rest a little more,still is tired"
           }else{
            var textInn = "feels tired,wants to rest,is falling asleep"
           }
           print("<b>" + getLocal("pjName") + "</b> " + pickRandomItem(textInn)) 
           previousEvent = "innEV"
           eventClock = setInterval(searchInn, masterTime);
    }else{
        var textNoInn = "feels good and continues his journey, continues with his trip, wants to explore a little more,has energies to continue"
        print("<b>" + getLocal("pjName") + "</b> " + pickRandomItem(textNoInn)) 
        previousEvent = "innEVFeelsGood"
        eventMasterClock = setInterval(event, masterTime);
    }
}

//ToDo: agregar que un pillo lo robe y escape, bajon de gold


//Main event: study and found statues
//TODO:CHECK A POTENTIAL BUG, THE WIZARD NEVER WILL BE TRUE FOR THE TWO LAST STAIMENTS
function studyEV() {
     if(YesOrNot(getLocal("pGetStatue"), 0) &&  getLocal("currentZone") != "el_Poblado" &&  getLocal("currentZone") != "la_Cueva"){//found statue, poblado and cueva has not statue
        if(getLocal("currentZone") == "el_Pantano" && getLocal("hydraMysteryResolved") == "true"){//avoid show hidra statue twice, instead find a rune
            print("<b>" + getLocal("pjName") + "</b> " + "sees something...") 
            eventClock = setInterval(findRuneOrBook, masterTime);
        }else{
            print("<b>" + getLocal("pjName") + "</b> " + "sees something...") 
            eventClock = setInterval(findStatue, masterTime);
        }
        //examine the estatue

    }else{//found book or rune
    print("<b>" + getLocal("pjName") + "</b> " + "sees something...") 
    eventClock = setInterval(findRuneOrBook, masterTime);
    }
}


//Main event: start battle, getting enemy (or boss), or guardian or hydra
function enemyEV(){
    if ((YesOrNot(getLocal("pGetGuardian"),0)) && (getLocal("lvl") > 190)){//get guardian
    //guardians in all the places
    }else if ((YesOrNot(getLocal("pGetHydra"),0)) && (getLocal("hydraMysteryResolved") == "true")){//get hydra
    //hydra in some localities
        if(getLocal("currentZone") == "el_Pantano" || getLocal("currentZone") == "las_Dunas" || getLocal("currentZone") == "la_Tundra"){
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
    multipleEventsCounter += 1;
    if (multipleEventsCounter >= 2 && multipleEventsCounter <= 4 ) {
        var optionTemp = 2;
    }else{
        var optionTemp = multipleEventsCounter;
    }
    switch(optionTemp){
        case 1:
        //found and change locality
        loadBackground(getLocal("currentZone") + "_estatua");
        idx("estatuas_statue_" + getLocal("currentZone"))
        idx("statuesFound");
        //print("<b>" + getLocal("pjName") + "</b> " + "finds a " + statueObj["statue_" + getLocal("currentZone")].name + " statue");
        if (previousEvent == "findStatue"){
            print("<b>" + getLocal("pjName") + "</b> " + "wants to try study the " + statueObj["statue_" + getLocal("currentZone")].name + " statue again");
        }else{
            print("<b>" + getLocal("pjName") + "</b> " + "finds a " + statueObj["statue_" + getLocal("currentZone")].name + " statue");
        }
        previousEvent = "findStatue"
        break;
        case 2:
        //examine and get or not
        if (YesOrNot(getLocal("pStudy"),0.15)){//increase the prob a little to avoid never activate 
            idx("sucessStudyStatue");
            spell("spellStudyGood_15",true,frameWidth,frameHeight,currentFrame,shift);
            var learnTxt = pickRandomItem("finds powerful information in the statue,learns new mystical arts from the statue scripts,feels the power of the statue");
            var result = statueObj["statue_" + getLocal("currentZone")].event()
        if(result == "hydraMysteryResolved"){
            //play hydra sound
            print("<b>" + getLocal("pjName") + "</b> " + "hears something but nothing happens");
        }else{
            playSound("statUp");
            print("<b>" + getLocal("pjName") + "</b> " + learnTxt + ". Increases the <i>" + result + "</i>");
        }
            multipleEventsCounter = 4;
        }else{
            playSound("studyrune");
            spell("spellStudyTry_16",true,frameWidth,frameHeight,currentFrame,shift);
            var learnTxt = pickRandomItem("tries to understand what is written in the statue,reads the glyphs in at the base of the statue,observes the statue,interprets the shape of the figure and the material");
            //fail study try again
            if(multipleEventsCounter == 4){
                idx("failStudyStatue");
                //last chance of study failed, mod text
                spell("spellStudySleep_15",true,frameWidth,frameHeight,currentFrame,shift);
                var learnTxt = pickRandomItem("does not find any pattern,can not understand the glyphs in the statue,does not know the purpose of the statue");
            }
            print("<b>" + getLocal("pjName") + "</b> " + learnTxt) 
        }
        break;
        case 5:
        print("<b>" + getLocal("pjName") + "</b> " + "leaves the statue and continues") 
        loadBackground(getLocal("currentZone") +  getLocal("currentStage"));
        multipleEventsCounter = 0;
        clearInterval(eventClock);
        addXP(1);
        eventMasterClock = setInterval(event, masterTime);
    }
}


//Find book or rune
function findRuneOrBook(){
    var placesWithBooks = getLocal("currentZone") == "la_Ciudad" || getLocal("currentZone") == "el_Poblado" || getLocal("currentZone") == "el_Castillo" || getLocal("currentZone") == "la_Torre";
    multipleEventsCounter += 1;
    if (multipleEventsCounter >= 2 && multipleEventsCounter <= 4 ) {
        var optionTemp = 2;
    }else{
        var optionTemp = multipleEventsCounter;
    }
    switch(optionTemp){
        case 1:
        var number = getRandomInt(1,10);
        if(placesWithBooks){
            objectToStudy = "book";
            loadNPC("libro" + number)
        }else{
            objectToStudy = "rune";
            loadNPC("runa" + number)
        }
        print("<b>" + getLocal("pjName") + "</b> " + "finds " + (previousEvent == "findRuneorBook" ? "another " : "a ") + objectToStudy) 
        idx(objectToStudy)
        previousEvent = "findRuneorBook"
        break;
        case 2:
        if (YesOrNot(getLocal("pStudy"),0)){
            playSound("statUp");
            idx("sucessStudy");
            spell("spellStudyGood_15",true,frameWidth,frameHeight,currentFrame,shift);
            var learnTxt = pickRandomItem("finds useful information in the,learns new things from the,feels the power of knowledge of the");
            //exit loop, sucess study
            //var statToUP = pickRandomItem("pAttack,pPolymorph,fCritic,pCritic,pHeal,fHeal,pStudy,pBotin,pChangeZone,pFindCapel,pFindMaterials,pOfrenda,fOfrenda")
            var statToIncrease = statObj[statObj.random()];
            var learned = statObj.increase(statToIncrease.code);
            print("<b>" + getLocal("pjName") + "</b> " + learnTxt + " " + objectToStudy + " and increases the <i>" + learned + "</i>") 
            idx("study_" + statToIncrease.code);
            
            multipleEventsCounter = 4;
        }else{
            playSound("study" + objectToStudy);
            spell("spellStudyTry_16",true,frameWidth,frameHeight,currentFrame,shift);
            var learnTxt = pickRandomItem("tries to understand what is written in the,reads the glyphs in the,analyzes the information in the,continues reading the");
            //fail study try again
            if(multipleEventsCounter == 4){
                idx("failStudy");
                //last chance of study failed, mod text
                spell("spellStudySleep_15",true,frameWidth,frameHeight,currentFrame,shift);
                var learnTxt = pickRandomItem("does not find any pattern in the,can not understand anything in the,does not understand the language in the");
            }
            print("<b>" + getLocal("pjName") + "</b> " + learnTxt + " " + objectToStudy) 
        }
        break;
        case 5:
        print("<b>" + getLocal("pjName") + "</b> " + "leaves the " + objectToStudy + " and continues") 
        npcCanvas.getContext("2d").clearRect(0, 0, npcCanvas.width, npcCanvas.height);
        setLocal("currentNpc", "");
        objectToStudy = "";
        multipleEventsCounter = 0;
        clearInterval(eventClock);
        addXP(0.25);
        eventMasterClock = setInterval(event, masterTime);
    }
}



//Search an inn
function searchInn(){
    var placesWithInn = getLocal("currentZone") == "la_Ciudad" || getLocal("currentZone") == "el_Poblado" || getLocal("currentZone") == "el_Desierto"
    multipleEventsCounter += 1;
    switch(multipleEventsCounter){
        case 1:
            if(placesWithInn){
                loadBackground(getLocal("currentZone") + "_taberna");
                idx("taberna");
                idx("taberna_zone_" + getLocal("currentZone"));
                print("<b>" + getLocal("pjName") + "</b> " + "enters in an inn") 

            }else{
                loadNPC("sleepingbag");
                var textCamping = "looks for a safe place too rest,hides to rest,falls asleep"
                print("<b>" + getLocal("pjName") + "</b> " + pickRandomItem(textCamping));
                idx("camping");

            }
            break;
        case 2:
            var textSleeps = "sleeps,replenishes energies,rests"
            if(placesWithInn){
                // add event of fight if have not gold
                //var innCost = getRandomInt(Number(localStorage.Gold) * 0.05,Number(localStorage.Gold) * 0.1);
                var innCost = 1 + getRandomInt(Number(getLocal("lastGoldFromBattle")) * 2,Number(getLocal("lastGoldFromBattle")) * 3);
                if ((Number(getLocal("Gold")) - innCost) <= 0){
                    //innCost = Number(getLocal("Gold"));
                    //setLocal("Gold", 0);
                    //cannot affort
                    playSound("drink");
                    print("<b>" + getLocal("pjName") + "</b> " + "cannot afford pay a bed, but takes a free drink");
                    restAtInn = false;
                }else{
                    spell("spellSleep_24",true,frameWidth,frameHeight,currentFrame,shift);
                    setLocal("Gold", Number(getLocal("Gold")) - innCost);
                    idx("GoldSpendInn",Number(innCost));
                    playSound("coins");
                    print("<b>" + getLocal("pjName") + "</b> " + pickRandomItem(textSleeps) +  " (" + goldIcon + "-" + roundNumbertoLetter(innCost) + ")") 
                    restAtInn = true;
                }
                
            }else{
                spell("spellSleep_24",true,frameWidth,frameHeight,currentFrame,shift);
                print("<b>" + getLocal("pjName") + "</b> " + pickRandomItem(textSleeps)) 
                restAtInn = false;
            }
            updateHeading();
            break;
        case 3:
            if(placesWithInn && restAtInn){
                var rested = Number(getLocal("HPBase")) - Number(getLocal("HP"))
            }
            else{
                var rested = (Number(getLocal("HPBase")) - Number(getLocal("HP"))) / getRandomInt(1,5)
            }
            setLocal("HP", Number(getLocal("HP")) + rested);
            if ((Number(getLocal("HP")) + rested) >= Number(getLocal("HPBase"))){
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
            setLocal("currentNpc", "");
            print("<b>" + getLocal("pjName") + "</b> " + pickRandomItem(textRecover) + " (" + healIcon + roundNumbertoLetter(rested) + ")") 
            if(placesWithInn){
                //pickRandomBackgroundForCurrentZone();
                loadBackground(getLocal("currentZone") +  getLocal("currentStage"));
            }
            restAtInn = false;
            multipleEventsCounter = 0;
            clearInterval(eventClock);
            eventMasterClock = setInterval(event, masterTime);
    }
}


//Pray and offer gold
function doOffering(){
    
    if(offer){
        multipleEventsCounter += 1;
        switch(multipleEventsCounter){
            case 1:
                var ofrendaGold = getRandomInt(Number(getLocal("Gold")) * 0.1,Number(getLocal("Gold")) * 0.5)
                feGanada = (ofrendaGold * getLocal("fOfrenda"));
                feGanada *= Number(getLocal("feMultiplicator"));
                setLocal("fe", Number(getLocal("fe")) + feGanada);
                setLocal("Gold", Number(getLocal("Gold")) - ofrendaGold);
                idx("offers");
                idx("GoldOffered", Math.round(ofrendaGold));
                idx("FeByGold",Math.round(feGanada));
                playSound("coins");
                spell("spellCoins",false,frameWidth,frameHeight,currentFrame,shift);
                var textOffering = pickRandomItem("to revere you,to please you,to exalt you,to adore you,to venerate you,to idolize you,for cherishing you,to honor you");
                print("<b>" + getLocal("pjName") + "</b>" + " offers " + goldIcon + roundNumbertoLetter(ofrendaGold) + " " + textOffering);
                break;
            case 2:
                //animation anks for pj
                //playSound("pray");
                spell("spellAnk_8",true,frameWidth,frameHeight,currentFrame,shift);
                print("<b>" + getLocal("pjName") + "</b>" + " leaves the shire and continue the journey" + " (" + spiritIcon + roundNumbertoLetter(feGanada) + ")");
                npcCanvas.getContext("2d").clearRect(0, 0, npcCanvas.width, npcCanvas.height);
                setLocal("currentNpc", "");
                //pickRandomBackgroundForCurrentZone();
                loadBackground(getLocal("currentZone") +  getLocal("currentStage"));
                multipleEventsCounter = 0;
                clearInterval(eventClock);
                disableCenterBtn = false;
                offer = false;
                eventMasterClock = setInterval(event, masterTime);
        }
    }else{
        multipleEventsCounter += 1;
        if (multipleEventsCounter >= 2 && multipleEventsCounter <= 4 ) {
            var optionTemp = 2;
        }else{
            var optionTemp = multipleEventsCounter;
        }
        switch(optionTemp){
            case 1:
                var textPray = pickRandomItem(" adore you, prays to you, asks for your advice, praises you, exalts you, asks you for his favor")
                print("<b>" + getLocal("pjName") + "</b>" + textPray)
                break;
            case 2:
                playSound("pray");
                spell("spellAnk_8",true,frameWidth,frameHeight,currentFrame,shift);
                feGanada = calculateFe();
                feGanada *= Number(getLocal("feMultiplicator"))
                setLocal("fe", Number(getLocal("fe")) + feGanada);
                idx("FeByPray",Math.round(feGanada));
                var textPray = pickRandomItem(" concentrates on his pray,  asks for his greatness, tries to please you, begs for your help");
                print("<b>" + getLocal("pjName") + "</b>" + textPray + " (" + spiritIcon + roundNumbertoLetter(feGanada) + ")")
            break;
            case 5:
                print("<b>" + getLocal("pjName") + "</b>" + " leaves the shire and continues")
                npcCanvas.getContext("2d").clearRect(0, 0, npcCanvas.width, npcCanvas.height);
                setLocal("currentNpc", "");
                //pickRandomBackgroundForCurrentZone();
                loadBackground(getLocal("currentZone") +  getLocal("currentStage"));
                disableCenterBtn = false;
                offer = false;
                multipleEventsCounter = 0;
                clearInterval(eventClock);
                eventMasterClock = setInterval(event, masterTime);
        }
    }


updateHeading();

}




//Select random spell per level
function getSpell(lvlBase = Math.floor(Number(getLocal("lvl")) / 10)){
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
    if (bossCombat){
         var possibleGold = Number(getLocal("HPBase")) * Number(getLocal("rGold"));
         setLocal("lastGoldFromBattle", getRandomInt(possibleGold,possibleGold * 2) + 1);
         setLocal("Gold", Number(getLocal("Gold")) + (Number(getLocal("lastGoldFromBattle")) * bossGoldMultiplier));
         idx("GoldFromBosses", (Number(getLocal("lastGoldFromBattle")) * (bossGoldMultiplier)));
    }else if(hydraCombat){
        var possibleGold = Number(getLocal("HPBase")) * Number(getLocal("rGold"));
         setLocal("lastGoldFromBattle", getRandomInt(possibleGold,possibleGold * 2) + 1);
         setLocal("Gold", Number(getLocal("Gold")) + (Number(getLocal("lastGoldFromBattle")) * 15));
         idx("GoldFromBosses", (Number(getLocal("lastGoldFromBattle")) * (15)));
    }else{
     //if (eval(enemy).hasgold == "true") {
        if (enemyTypes[enemy].hasgold == "true") {
         var possibleGold = Number(getLocal("HPBase")) * Number(getLocal("rGold"));
         var goldcurrentBattle = (getRandomInt(possibleGold,possibleGold * 2) + 1) * (enemySprites[enemyAndNumber].rare == 1 ? RAREMULTIPLIER : 1)
         setLocal("lastGoldFromBattle", goldcurrentBattle);
         setLocal("Gold", Number(getLocal("Gold")) + goldcurrentBattle);
         idx("GoldFromEnemies", goldcurrentBattle);
         }else{
             //ToDo: add some material or resource
         }
    }
};


//Add XP after a battle or exploration
function addXP(specialMultiplier = 1){
    var xpGained = ((Number(getLocal("XPbyEnemy")) * specialMultiplier));
    //console.log(("\t" + getLocal("lvl")) +"\t"+ xpGained);
    setLocal("XP", (xpGained + Number(getLocal("XP"))));
    updateHeading();
    if(Number(getLocal("XP")) >= Number(getLocal("XPNextLevel"))){
        levelUP();
    };
};


//Get Botin
function getBotin() {
    multipleEventsCounter += 1;
    switch (multipleEventsCounter){
        case 1:
            objectToBreak = pickRandomItem("bag,barrel,box,chest,pot")
            switch (objectToBreak){
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
            print("<b>" + getLocal("pjName") + "</b>" + " sees " + (previousEvent == "getBotin" ? "another " : "a ")  + objectToBreak);
            break;
        case 2:
        if (objectToBreak == "bag"){
            playSound("coins");
            var botinTexts = " takes the bag and finds ";
        }else if(objectToBreak == "chest"){
            playSound("unlock");
            var botinTexts = " opens the chest and finds ";
            spell("spellKey_8",false,frameWidth,frameHeight,currentFrame,shift);
        }else{
            if (objectToBreak == "pot"){
                playSound("breakPot");
            }else{
                playSound("breakWood");
            }
            var botinTexts = " breaks the " + objectToBreak +" and finds ";
            spell("spellPush9",false,frameWidth,frameHeight,currentFrame,shift);
        }
        npcCanvas.getContext("2d").clearRect(0, 0, npcCanvas.width, npcCanvas.height);
        setLocal("currentNpc", "");
        var goldBotin = 1 + getRandomInt(Number(getLocal("lastGoldFromBattle")), Number(getLocal("lastGoldFromBattle")) * 10);
        print("<b>" + getLocal("pjName") + "</b>" + botinTexts + goldIcon + roundNumbertoLetter(goldBotin));
        idx("BotinGot");
        idx("GoldFromBotin",goldBotin)
        idx("GoldFromBotin_" + objectToBreak,goldBotin)
        idx("BotinGot_" + objectToBreak);
        setLocal("Gold", Number(getLocal("Gold")) + goldBotin);
        if(Number(check("idx_BotinGot_chest")) > 100){logro.set(logro.logro_botines)};
        if(Number(check("idx_BotinGot_pot")) > 100){logro.set(logro.logro_pots)};
        previousEvent = "getBotin"
        updateHeading();    //Update heading
        multipleEventsCounter = 0;
        clearInterval(eventClock);
        addXP(0.5);
        eventMasterClock = setInterval(event, masterTime);//trigger event selecter
            
    }
    
   
};



//Change locality
function changeLocality() {
    multipleEventsCounter += 1;
    //console.log(multipleEventsCounter);
    switch (multipleEventsCounter) {
    case 1:
        //get new zone
        setLocal("lastZone", getLocal("currentZone"));
        //save in getLocal("currentZone")
        print("<b>" + getLocal("pjName") + "</b> left the " + zones[getLocal("lastZone")].name);
        
        getZone();
        //get a new zone
        break;
    case 2:
        //change background
        //pickRandomBackgroundForCurrentZone();
        loadBackground(getLocal("currentZone") + getLocal("currentStage"));
        print("<b>" + getLocal("pjName") + "</b> is entering to the " + zones[getLocal("currentZone")].name + ", " + pickRandomItem(zones[getLocal("currentZone")].legend));
        break;
    case 3:
        //cancel the Interval, put 0 to the counter and trigger a new event
        addXP(1);
        previousEvent = "changeLocality";
        multipleEventsCounter = 0;
        clearInterval(eventClock);
        eventMasterClock = setInterval(event, masterTime);
        //trigger event selecter
    }

};


//Get enemy by current locality and drow it
function getEnemy() {
    //generate a unique type of attack for each enemy
    bossCombat = false;
    hydraCombat = false;
    if (YesOrNot(getLocal("pGetBoss"), 0)) {
        playSound("boss");
        idx("Bosses");
        bossCombat = true;
        bossMultiplier = 2.5;
        bossGoldMultiplier = 5;
        var boss = zones[getLocal("currentZone")].boss;
        // if (boss == "cuboq" || boss == "etymos" || boss == "infraespectro"){
        //     document.getElementById("npcCanvas").style.opacity = 0.7;
        // }else{
        //     document.getElementById("npcCanvas").style.opacity = 1;
        // }
        enemy = boss;
        idx("typeBoss_" + boss)
        loadNPC(boss);
        enemyHP = (getRandomInt(Number(getLocal("rangeEnemyHP")) * 0.75, Number(getLocal("rangeEnemyHP")) * 1.25)) * bossMultiplier;
        enemyHPbase = Math.round(enemyHP)
        updateHeartNPC()
        //enemyName = "<span style='color:DarkRed'><img class='imgInConsole' height='" + em + "' src='img/boss.png'/>" + " " + boss.toUpperCase() + "</span>";
        enemyName = "<span style='color:DarkRed'><img class='imgInConsole' height='" + em + "' src='img/boss.png'/>" + " " + enemyTypes[boss].name.toUpperCase() + "</span>";
    } else {
        //spellEnemy = pickRandomItem("spellPush1,spellPush2,spellPush3,spellPush4,spellPush5,spellPush6,spellPush7,spellPush8,spellPush9,spellPush10");
        enemy = pickRandomItem(zones[getLocal("currentZone")].enemies).toLowerCase();
        // if (!!eval(enemy).translucid){
        //     document.getElementById("npcCanvas").style.opacity = 0.8;
        // }else{
        //     document.getElementById("npcCanvas").style.opacity = 1;
        // }
        idx("enemy_" + enemy);
        var number = Math.floor((Math.random() * enemyTypes[enemy].max) + 1);
        //random number of the image max    
        //select a spell based on the school of enemy
        spellEnemy = pickRandomItem(npcSpells[enemySprites[enemy + number].type]);
        enemyAndNumber = enemy + number;
        if (enemySprites[enemyAndNumber].rare == 1){
            idx("rareEnemyEncounters");
        }else{
            idx("enemyEncounters");
        }
        loadNPC(enemy + number);
        enemyHP = (getRandomInt(Number(getLocal("rangeEnemyHP")) * 0.75, Number(getLocal("rangeEnemyHP")) * 1.25));
        enemyHPbase = Math.round(enemyHP)
        updateHeartNPC()
        var raretext = (enemySprites[enemy + number].rare == 1 ? " <b><small>(RARE)</small></b> " : "");
        
        if (enemy == "baba" || enemy == "el_esqueleto" || enemy == "animalejo" || enemy == "polipoide" || enemy == "momia") {
            //avoid name creatures and others
            //enemyName = "A " + enemyTypes[enemy].name;
            enemyName = "A " + enemySprites[enemy + number].altName + raretext;
        } else if (enemy == "el_capricor"){
            enemyName = "The " + capitalize(enemyTypes[enemy].name) + raretext;
        }
        else {
            if (enemySprites[enemy + number].altName){//choose the altername if have some
                enemyName = "<i>" + randomName() + "</i> the " + capitalize(enemySprites[enemy + number].altName) + raretext;
            }else{
                enemyName = "<i>" + randomName() + "</i> the " + capitalize(enemyTypes[enemy].name) + raretext;
            }
        }
    }
    var startBattleText = "has entered in " + (previousEvent == "enemy" ? "another" : "a") + " battle!,finds " + (previousEvent == "enemy" ? "another" : "an") + " enemy!,start " + (previousEvent == "enemy" ? "another" : "a") + " fight!"
    if (enemy + number == "el_mediano14") startBattleText = "shouts: HEY GUY LOOK AT ME!"
    previousEvent = "enemy";
    if (bossCombat){ 
        var article = (previousEvent == "boss" ? "another" : "a")
        startBattleText = "has entered in " + article + " battle with a Boss!,finds " + article + " Boss!,start " + article + " fight with a Boss!"
        previousEvent = "boss";
    }
    print("<b>" + getLocal("pjName") + "</b> " + pickRandomItem(startBattleText));
    
    eventClock = setInterval(battle, masterTime);
};


//ToDo: cuando cargue el_mediano14, logro de Hey guy look at me.
//The world is losing it's values, the un-polite enemies do not see the opponent in the face


function getHydra(newEncounter = false){
    bossCombat = false;
    hydraCombat = true;
    playSound("hidra");
    hydra =  zones[getLocal("currentZone")].hidrasName;
    if(!localStorage[thx("currentHead" + hydra)]){setLocal("currentHead" + hydra, 1)};
    enemy = hydra;
    loadNPC(hydra + getLocal("currentHead" + hydra));
    enemyHP = (getRandomInt(Number(getLocal("rangeEnemyHP")) * 0.75, Number(getLocal("rangeEnemyHP")) * 1.25)) * (Number(getLocal("currentHead" + hydra)));
    enemyHPbase = Math.round(enemyHP)
    updateHeartNPC();
    enemyName = "<span style='color:DarkGreen'><img class='imgInConsole' height='" + em + "' src='img/boss.png'/>" + " " + hydra.toUpperCase() + "</span>";
    if (newEncounter){
        idx("Hydras");
        idx("typeofHydras_" + hydra)
        var startBattleText = "has entered in a battle with a hydra!,finds an hydra!,start a fight with a hydra!"
        print("<b>" + getLocal("pjName") + "</b> " + pickRandomItem(startBattleText));
        eventClock = setInterval(battle, masterTime);
    } else {
        var startBattleText = "sees how another head grows!, sees how the hydra regenerates its heal points"
        print("<b>" + getLocal("pjName") + "</b> " + pickRandomItem(startBattleText));
    }
    
}



//Performs attack
function attackEV() {
    if (YesOrNot(getLocal("pPolymorph"), 0) && !hydraCombat && !bossCombat && !polymorphed && enemy !== "baba" && enemy !== "el_elemental" && enemy !== "el_ent" && enemy !== "el_espectro" && enemy !== "el_esqueleto" && enemy !== "el_golem" && enemy !== "el_ojo" && enemy !== "la_esencia"){
        if (document.hasFocus()){animateClock = setInterval(animatePJ, 100)};
        enemyHP = 1;
        updateHeartNPC()
        spell("spellPinBlue_16",false,frameWidth,frameHeight,currentFrame,shift);
        idx("school_" + spells.spellPinBlue_16.school)
        polymorphedAnimal = pickRandomItem("gallina,oveja");
        playSound(polymorphedAnimal);
        loadNPC(polymorphedAnimal);
        print("<b>" + getLocal("pjName") + "</b>" + " cast polymorphism!");
        idx("Polymorph_" + polymorphedAnimal);
        polymorphed = true;
    } else {
        if (YesOrNot(getLocal("pAttack"), 0)) {
            //determine the prob of attack, if fail enemy attack
            if (YesOrNot(getLocal("pCritic"), 0)) {
                //animateClock = setInterval(animatePJ, 100)                
                if (document.hasFocus()){animateClock = setInterval(animatePJ, 100)};
                //determine if is critical or not
                var pjAttackWithCritic = Number(getLocal("attack")) * Number(getLocal("fCritic")) * Number(getLocal("fAttack"));
                pjAttackWithCritic *= Number(getLocal("sacredDamageMultiplier"));
                var spellId = getSpell();
                if (spellId == "spellChispasMulti_12" || spellId == "spellRainMultiColor_24" || spellId == "spellColorSpin_16"){
                    pjAttackWithCritic = pjAttackWithCritic * 4 //if is one of the divine powers
                }
                if (enemyHP - pjAttackWithCritic < 0) {//avoid -hp in enemy
                    enemyHP = 0;
                } else {
                    enemyHP = Math.round(enemyHP) - Math.round(pjAttackWithCritic);
                }
                updateHeartNPC()
                idx("school_" + spells[spellId].school)
                spell(spellId,false,frameWidth,frameHeight,currentFrame,shift,true);
                print("<b>" + getLocal("pjName") + "</b> performs a <b>critic attack!</b>" + " (" + attackIcon + roundNumbertoLetter(Number(getLocal("attack")) * Number(getLocal("fAttack"))) + ") &times; " + Math.round(getLocal("fCritic")) + " - " + heartIcon + roundNumbertoLetter(enemyHP));
                //if (document.hasFocus()){animateClock = setInterval(animatePJ, 100)};
                idx("Critics");
            } else {
                //animateClock = setInterval(animatePJ, 100)
                if (document.hasFocus()){animateClock = setInterval(animatePJ, 100)};
                //attack with no critic
                var pjHit = getRandomInt(Number(getLocal("attack")) * 0.5, Number(getLocal("attack"))) * Number(getLocal("fAttack"));
                pjHit *= Number(getLocal("sacredDamageMultiplier"));
                var spellId = getSpell();
                if (spellId == "spellChispasMulti_12" || spellId == "spellRainMultiColor_24" || spellId == "spellColorSpin_16"){
                    pjHit *= 4 //if is one of the divine powers
                }
                if (enemyHP - pjHit < 0) {//avoid -hp in enemy
                    enemyHP = 0;
                } else {
                    enemyHP = Math.round(enemyHP) - Math.round(pjHit);
                }
                updateHeartNPC()
                idx("school_" + spells[spellId].school)
                var spellText = spells[spellId].name.toLowerCase()
                
                if (spells[spellId].school == "Physical"){
                    var text = pickRandomItem(" uses the , attacks with the ");
                }else{
                    var text = pickRandomItem(" cast , attacks with ");
                }

                print("<b>" + getLocal("pjName") + "</b>" + text + spellText + " (" + attackIcon + roundNumbertoLetter(pjHit) + ") - " + heartIcon + roundNumbertoLetter(enemyHP));
                spell(spellId,false,frameWidth,frameHeight,currentFrame,shift);

                //if (document.hasFocus()){animateClock = setInterval(animatePJ, 100)};
                idx("Attacks");

            }
            if(pjAttackWithCritic > 500 || pjHit > 500){logro.set(logro.logro_attack500)}
            if(pjAttackWithCritic > 1000 || pjHit > 1000){logro.set(logro.logro_attack1000)}
        } else {
            //enemy attack
            //animateClockNPC = setInterval(animateNPC, 100)
            if (document.hasFocus()){animateClockNPC = setInterval(animateNPC, 100)};
            var enemyHit = getRandomInt(Number(getLocal("rangeEnemyAttack")) * 0.5, Number(getLocal("rangeEnemyAttack")) * Number(getLocal("fAttack"))) * bossMultiplier;

            if (enemy == "midas"){enemyHit *= 2}//duplicate midas attack

            if (spellEnemy == "spellChispasMulti_12" || spellEnemy == "spellRainMultiColor_24" || spellEnemy == "spellColorSpin_16"){
                enemyHit *= 4 //if is one of the divine powers
            }

            if (Number(getLocal("HP")) - enemyHit < 0) {
                setLocal("HP", 0);
            } else {
                setLocal("HP", Number(getLocal("HP")) - enemyHit);
            }
            print(enemyName + " attacks (" + attackIcon + roundNumbertoLetter(enemyHit) + ")");
            if (bossCombat){
                spellEnemy = pickRandomItem(zones[getLocal("currentZone")].bossSpell);
            }else if (hydraCombat){
                spellEnemy = pickRandomItem(zones[getLocal("currentZone")].hidrasSpells);
            }
            spell(spellEnemy,true,frameWidth,frameHeight,currentFrame,shift);
            idx("IncomingAttacks");
            //if (document.hasFocus()){animateClockNPC = setInterval(animateNPC, 100)};
        }
    }
};


//Performs healing
function healEV() {
        idx("Heal");
            var healOperation = Number(getLocal("HPBase")) * Number(getLocal("fHeal"));
            var healHit = getRandomInt(healOperation * 0.5,healOperation);
            if (Number(getLocal("HP")) + healHit > Number(getLocal("HPBase"))){
                healHit =  Number(getLocal("HPBase")) - Number(getLocal("HP"));
                setLocal("HP", getLocal("HPBase"));
            }else{
                setLocal("HP", Number(getLocal("HP")) + healHit);
            }
        playSound("heal");
        spell("spellHeal_8",true,frameWidth,frameHeight,currentFrame,shift);
        print("<b>" + getLocal("pjName") + "</b>" + pickRandomItem(" casts heal spell and restore , cast minor healing , use restauration ") + "(" + healIcon + roundNumbertoLetter(healHit) + ")");    
         
        
    
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
    return (getRandomInt(((Number(getLocal("HPBase")) * Number(getLocal("rGold")))),Number(getLocal("HPBase")) * Number(getLocal("rGold")) * 5 ));
}

//Set the timer to avoid loss seconds
function setLiveTime(){
    if (!localStorage.timeTotal){localStorage.timWeTotal = 0}
    localStorage.timeTotal = Number(localStorage.timeTotal) + (performance.now() - timeStart);
    timeStart = performance.now()
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
    if(enemyAndNumber.match("amazona") || enemyAndNumber.match("guerrera") || enemyAndNumber.match("hechicera") || enemyAndNumber.match("pilla")){//feminice name
        name += pickRandomItem("A,E,I").toLowerCase();
        name += pickRandomItem("A,E,I,B,C,D,F,G,H,J,K,L,M,N,P,S,V,W,X,Y,Z,Ss,Kh,Th,Xh,Sj,Yh,'").toLowerCase();
        name += pickRandomItem("E,I,A,,,,,,,,,,").toLowerCase();
    }else{
        name += pickRandomItem("A,E,I,O,U").toLowerCase();
        name += pickRandomItem("A,E,I,O,U,B,C,D,F,G,H,J,K,L,M,N,P,Q,R,S,T,V,W,X,Y,Z,Ss,Kh,Th,Br,Tr,Mr,Zr,Xh,Sj,Cr,Kr,Yh,'").toLowerCase();
        name += pickRandomItem("E,I,O,U,,,,,,,,,,").toLowerCase();
    }
    idx("RandomNames");
    if(!!localStorage[thx("pjName")]){
    if(name == getLocal("pjName")){logro.set(logro.logro_namesake);}
    };

    //avoid rename the two sacred
    if(enemyAndNumber == "el_hechicero10" || enemyAndNumber == "la_hechicera7" ){
        if(!localStorage[thx(enemyAndNumber + "_name")]){
            setLocal(enemyAndNumber + "_name", name);
        }else{
            name = getLocal(enemyAndNumber + "_name");
        }
    }



    return name;
};



//Return a random element from a list
;



//Select random background for currentZone
function pickRandomBackgroundForCurrentZone() {
    var randomLocality = pickRandomItem(places[getLocal("currentZone") + getLocal("currentStage")].moves)
    loadBackground(randomLocality);
};


//Search for a close zone to move
function getZone() {
    if (getLocal("currentZone") !== undefined) {
        idx("zonesChanged");
        var randomLocality = pickRandomItem(places[getLocal("currentZone") + getLocal("currentStage")].destinations)
        setLocal("currentZone", randomLocality.match(/\D+/).toString());//extract no digits
        setLocal("currentStage", randomLocality.match(/\d+/).toString());//extract digits
        idx("zone_" + getLocal("currentZone"));
        } else {
        setLocal("currentZone", "la_Ciudad");//default start
    }
};


;


//Put first char in uppercase
;

//count number of spells that know
function countSpellKnown(){
    var lvlBase = Math.floor(Number(getLocal("lvl")) / 10)
    var numberSpells = 0;
        for (var i = 0; i <= lvlBase; i++) { 
            numberSpells += Number(spellTiers[i].split(',').length)
        }
    return numberSpells
}


//check if the variable is undefined and put 0, intended for stats page


//count the kind of elements and add the number for organized list of idx
//example of usage getListOfOrganizedLocalStorage(thx("idx_enemy_"))
function getListOfOrganizedLocalStorage(token,inObj=""){
    //Get all localstore variables, useful for stats page
    var out = "";
    for (var i = 0; i < localStorage.length; i++){
        // do something with localStorage.getItem(localStorage.key(i));
        //for example search for idx_
        if (localStorage.key(i).match(token)){
            if(token == "/logro_/"){
                var text = localStorage.key(i);
                out += '<div class="divTableRow"><div class="divTableCell"><img src="img/' + logro[text].name + '.png" height="' + em * 4 + 'px" /></div><div class="divTableCell"><strong>' + logro[text].title + '</strong> <br>' + logro[text].description + '</div></div>';
            }else{
                if(inObj == ""){
                var text = hx(localStorage.key(i).replace(token, ""));
                out += capitalize((enemyTypes[text] || zones[text]).name) + " (" + hx(localStorage.getItem(localStorage.key(i))) + "), ";
                } else{
                    //var text = hx(localStorage.key(i).replace(token, ""));
                    //out += capitalize([inObj + "." + text].name) + " (" + hx(localStorage.getItem(localStorage.key(i))) + "), ";
                    var text = hx(localStorage.key(i).replace(token, ""));
                                        out += capitalize({ statObj, statueObj }[inObj][text].name) + " (" + hx(localStorage.getItem(localStorage.key(i))) + "), ";
                }
                
            }
        } 
    }
    return out.slice(0,-2);
}

//count logros
function countLogros(){
    var count = 0;
    for (var i = 0; i < localStorage.length; i++){
        if (localStorage.key(i).match(/logro_/)){
            count++
        }}
    return count;
}


//seg





 

 


 
  

function list(){
    scrollOpen()
    var txt = "";
    for (var i = 0; i < localStorage.length; i++){
        txt += hx(localStorage.key(i)) + " = " + hx(localStorage.getItem(localStorage.key(i))) + "<br>"
    }
    document.getElementById("innerTextScroll").style.display = "block";
    document.getElementById('innerTextScroll').innerHTML=txt;
    document.getElementById("btnClose").style.top = objectSize * 0.13 + "px";
}

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
    
    objectSize = defineObjectSize();
    em = getEM();
    
    //update the icons to avoid bug big icons when start the game in landscape
    goldIcon = "<img class='imgInConsole' height='" + em + "' src='img/gold.png'/> ";
    spiritIcon = "<img class='imgInConsole' height='" + em + "' src='img/spirit.png'/> ";
    attackIcon = "<img class='imgInConsole' height='" + em + "' src='img/attack.png'/> ";
    healIcon = "<img class='imgInConsole' height='" + em + "' src='img/heal.png'/> ";

    if (!!document.getElementsByClassName("imgInConsole")[0]){
    var x = document.getElementsByClassName("imgInConsole");
    var i;
    for (i = 0; i < x.length; i++) {
        x[i].style.height = em + "px";
        x[i].style.width = em + "px";
    }
    }

    if (!!document.getElementsByClassName("imgInConsoleSpecial")[0]){
        var x = document.getElementsByClassName("imgInConsoleSpecial");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.height = em * 1.5 + "px";
            x[i].style.width = em * 1.5 + "px";
        }
        }

    if (!!document.getElementsByClassName("specialTextInConsole")[0]){
    var x = document.getElementsByClassName("specialTextInConsole");
    var i;
    for (i = 0; i < x.length; i++) {
        x[i].style.fontSize = em * 1.5 + "px";
        x[i].style.lineHeight = em *1.5 + "px";
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
            if (scrollCurrentContent != "history"){//avoid close scroll in a history
                scrollClose()
            }
        }
    }else{
        layoutPortrait();
    }

    
     
     headLevel = objectSize * 0.109375;//56;
     charWidth = charHeight = squareSide = objectSize * 0.125;//64;
     //load chars if was ok to redraw
    if (localStorage[thx("currentNpc")]) {
        loadNPC(getLocal("currentNpc"));
    }
    if(getLocal("firstUse") !== "true"){loadCanvasChar(getLocal("lvl"), squareSide, headLevel);}
    if (pjDead){loadAlterCanvasChar("muerto", squareSide, headLevel);
};
    

};


var centerMain;
var centerLauncher;
//Define size of window
function defineObjectSize() {
     if (!detectmob()) {
        //var objectSize = 512;
        objectSize = window.innerHeight / 2;//better adaptation 
        // centerMain = (window.innerWidth / 2) - (objectSize * 1.0625 /2) + "px";
        // centerLauncher = (window.innerWidth / 2) - ((objectSize / 0.9) /2) + "px";
    } else {
        objectSize = window.innerWidth * 0.9;
        // centerMain = (window.innerWidth  / 2) - (objectSize * 1.0625 /2) + "px";
        // centerLauncher = "0px"
    }
    ;return objectSize;
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
    em = objectSize * 0.04;
    return em;
}



//Default layout for mobile and desktop
function layoutPortrait(){

    if(getLocal("firstUse") == "true"){
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
    document.getElementById("pjName").style.fontSize = objectSize * 0.09375 + "px";
    document.getElementById("console").style.fontSize = em + "px";
    document.getElementById("indicadores").style.fontSize = objectSize * 0.045 + "px";
    document.getElementById("statusText").style.fontSize = em * 2 + "px";
    document.getElementById("inputName").style.fontSize = (objectSize * 0.09375) * 1.5 + "px";
    document.getElementById("labelInputName").style.fontSize = (objectSize * 0.09375) * 0.5 + "px";
    // document.querySelector(".longBtnText").style.fontSize = (objectSize * 0.09375) * 0.75 + "px";
    document.getElementById("title1").style.fontSize = (objectSize * 0.09375) * 2.5 + "px";
    document.getElementById("title2").style.fontSize = (objectSize * 0.09375) * 1.5 + "px";
    document.getElementById("footer").style.fontSize = (objectSize * 0.09375) * 0.6 + "px";
    document.getElementById("scrollText").style.fontSize = em + "px";
    
    document.getElementById("zoneMap").style.fontSize = em * 2.5 + "px";
    document.getElementById("scrollText").style.margin = em / 2 + "px";

    


    //widths
    document.getElementById("main").style.width = objectSize + "px";
    document.getElementById("console").style.width = objectSize + "px";
    document.getElementById("marco").style.width = objectSize * 1.0625 + "px";
    document.getElementById("esceneCanvas").style.width = objectSize + "px";
    document.getElementById("pjCanvas").style.width = objectSize + "px";
    document.getElementById("npcCanvas").style.width = objectSize + "px";
    document.getElementById("spellCanvas").style.width = objectSize + "px";
    document.getElementById("XPprogressBar").style.width  = objectSize * 0.7 + "px";
    document.getElementById("pjName").style.width  = objectSize * 0.7 + "px";
    document.getElementById("indicadores").style.width  = objectSize * 0.7 + "px";
    document.getElementById("btn1").style.width  = objectSize * 0.09375 + "px";
    document.getElementById("btn2").style.width  = objectSize * 0.09375 + "px";
    document.getElementById("btn3").style.width  = objectSize * 0.09375 + "px";
    document.getElementById("btn4").style.width  = objectSize * 0.09375 + "px";
    document.getElementById("btn5").style.width  = objectSize * 0.09375 + "px";
    document.getElementById("btn6").style.width  = objectSize * 0.09375 + "px";  
    document.getElementById("backConsole").style.width = objectSize + (objectSize * 0.075) + "px";
    document.getElementById("launcher").style.width = objectSize / 0.9 + "px";
    //document.getElementById("fondoLauncher").style.width = objectSize + (objectSize * 0.075) + "px";
    document.getElementById("fondoLauncher").style.width = objectSize / 0.9 + "px";
    document.getElementById("inputName").style.width = objectSize * 1.085 + "px";
    document.getElementById("labelInputName").style.width = objectSize * 1.085 + "px";
    var startBtnW = document.getElementById("startBtn").style.width  = ((objectSize * 0.09375) * 1.90625) * 1.5 + "px";  
    // document.getElementById("btnBlackBack").style.width  = startBtnW;
    document.getElementById("scroll").style.width = objectSize + "px";  
    document.getElementById("scrollBackCenter").style.width = objectSize + (objectSize * 0.075) + "px";  
    document.getElementById("scrollBackUp").style.width = objectSize + (objectSize * 0.075) + "px";  
    document.getElementById("scrollBackDown").style.width = objectSize + (objectSize * 0.075) + "px";  

    document.getElementById("scrollText").style.width = objectSize + "px";  
    document.getElementById("btnClose").style.width  = objectSize * 0.09375 + "px";  
    
    var pjBtnWidth = document.getElementById("pjDivineBtn").style.width = objectSize * 0.325 + "px";
    document.getElementById("npcDivineBtn").style.width = objectSize * 0.325 + "px";
    var centerDivineBtn = document.getElementById("centerDivineBtn").style.width = objectSize * 0.35 + "px";

    document.getElementById("backMapa").style.width = objectSize + "px"; 
    document.getElementById("bocadilloMapa").style.width  = objectSize * 0.075 + "px";  
    document.getElementById("pjMapa").style.width  = objectSize * 0.065 + "px";  

    
    
    
    


    //heights
    var headingH = document.getElementById("heading").style.height = objectSize * 0.21 + "px";
    var marcoH = document.getElementById("marco").style.height = objectSize * 0.3125 + "px";
    var sceneCanvasH = document.getElementById("esceneCanvas").style.height = objectSize * 0.25 + "px";
    document.getElementById("pjCanvas").style.height = objectSize * 0.25 + "px";
    document.getElementById("npcCanvas").style.height = objectSize * 0.25 + "px";
    document.getElementById("spellCanvas").style.height = objectSize * 0.25 + "px";
    document.getElementById("XPprogressBar").style.height  = objectSize * 0.035  + "px";
    var backConsoleH = document.getElementById("backConsole").style.height = window.innerHeight - parseInt(sceneCanvasH) * 1.2 - parseInt(headingH) * 1.2 + "px";
    var consoleH = document.getElementById("console").style.height = parseInt(backConsoleH) * 0.94 + "px";
    document.getElementById("launcher").style.height = window.innerHeight + "px";
    document.getElementById("fondoLauncher").style.height = window.innerHeight + "px";
    //document.getElementById("startBtn").style.height  = (objectSize * 0.09375) * 1.5 + "px"; 
    document.getElementById("startBtn").style.height  = (objectSize * 0.09375) * 1.5 + "px"; 
    // document.getElementById("btnBlackBack").style.height  = (objectSize * 0.09375) * 1.4 + "px"; 
    //document.getElementById("scrollBackCenter").style.height = window.innerHeight - parseInt(sceneCanvasH) * 1.5 + "px";
    //document.getElementById("scrollBackUp").style.height = window.innerHeight - parseInt(sceneCanvasH) * 0.25 + "px";
    document.getElementById("main").style.height = window.innerHeight + "px";
    document.getElementById("scrollText").style.height = (window.innerHeight - (objectSize * 0.25) * 1.5) + "px";
    //document.getElementById("scrollBackCenter").style.height = (window.innerHeight - (objectSize * 0.25) * 1.5) + "px";
    
    document.getElementById("pjDivineBtn").style.height = objectSize * 0.25 + "px";
    document.getElementById("npcDivineBtn").style.height = objectSize * 0.25 + "px";
    document.getElementById("centerDivineBtn").style.height = objectSize * 0.25 + "px";

    //auto resize scroll if is open
    if(parseInt(document.getElementById("scrollBackCenter").style.minHeight) > 0){
    document.getElementById("scrollBackCenter").style.minHeight = (window.innerHeight - (objectSize * 0.25) * 1.5) * 0.97 + "px";
    document.getElementById("scrollText").style.minHeight = (window.innerHeight - (objectSize * 0.25) * 1.5) * 0.92 + "px";
    document.getElementById("scrollBackDown").style.top = (window.innerHeight - (objectSize * 0.25) * 1.5) * 0.97 + "px";
    }
    

    //lefts
    //document.getElementById("main").style.left = (window.innerWidth - objectSize) / 2 - (window.innerWidth * 0.025) + "px";
    //document.getElementById("main").style.left = centerMain;
    document.getElementById("main").style.left = (window.innerWidth / 2) - (objectSize * 1.0625 /2) + "px";
    document.getElementById("console").style.left = objectSize * 0.03 + "px";
    document.getElementById("backConsole").style.left = (objectSize * -0.01) + "px";
    document.getElementById("esceneCanvas").style.left = (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("pjCanvas").style.left = (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("npcCanvas").style.left = (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("spellCanvas").style.left = (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("btn1").style.left = objectSize * 0.75 + "px";
    document.getElementById("btn4").style.left = objectSize * 0.75 + "px";
    document.getElementById("btn2").style.left = objectSize * 0.75 + (objectSize * 0.1) + "px";
    document.getElementById("btn5").style.left = objectSize * 0.75 + (objectSize * 0.1) + "px";
    document.getElementById("btn3").style.left = objectSize * 0.75 + (objectSize * 0.1) * 2 +"px";
    document.getElementById("btn6").style.left = objectSize * 0.75 + (objectSize * 0.1) * 2 + "px";
    document.getElementById("statusText").style.left = objectSize + "px";
    ////launcher
    //document.getElementById("launcher").style.left = (window.innerWidth - objectSize) / 2 - (window.innerWidth * 0.05) + "px";
    //document.getElementById("launcher").style.left = centerLauncher;
    document.getElementById("launcher").style.left = (window.innerWidth / 2) - ((objectSize / 0.9) /2) + "px";
    document.getElementById("fondoLauncher").style.left = "0px";
    document.getElementById("labelInputName").style.left = objectSize * 0.03 + "px";
    document.getElementById("startBtn").style.left = ((objectSize * 1.085 - parseInt(startBtnW)) / 2) + "px";
    // document.getElementById("btnBlackBack").style.left = ((objectSize * 1.085 - parseInt(startBtnW)) / 2) + "px";
    // document.getElementById("textStartBtn").style.left = ((objectSize * 1.085 - parseInt(startBtnW)) / 2) * 1.115 + "px";
    
    document.getElementById("title1").style.left = objectSize * 0.16 + "px";
    document.getElementById("title2").style.left = objectSize * 0.7 + "px";
    document.getElementById("footer").style.left = objectSize * 0.1 + "px";
    ////scroll
    //document.getElementById("scroll").style.left = (window.innerWidth - objectSize) / 2 - (window.innerWidth * 0.025) + "px";
    document.getElementById("scroll").style.left = (window.innerWidth / 2) - (objectSize * 1.0625 /2) + "px";
    document.getElementById("scrollBackCenter").style.left = (objectSize * -0.01) + "px";
    document.getElementById("scrollBackUp").style.left = (objectSize * -0.01) + "px";
    document.getElementById("scrollBackDown").style.left = (objectSize * -0.01) + "px";

    document.getElementById("btnClose").style.left = objectSize * 0.75 + (objectSize * 0.1) * 2 + "px";
    document.getElementById("scrollText").style.left = objectSize * 0.03 + "px";

    var pjBtnLeft = document.getElementById("pjDivineBtn").style.left = (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("centerDivineBtn").style.left = parseInt(pjBtnLeft) + parseInt(pjBtnWidth) + "px";
    document.getElementById("npcDivineBtn").style.left = parseInt(pjBtnLeft) + parseInt(pjBtnWidth) + parseInt(centerDivineBtn) + "px";
    
    
    document.getElementById("backMapa").style.left = 0 + "px";
    
    

    //tops
    document.getElementById("main").style.top = window.innerHeight * 0.005 + "px";

    // define if scene is on top of console, if not invert (useful when scroll is desplayed)
    if (sceneOnTop){
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
	
    document.getElementById("indicadores").style.top = (objectSize * 0.09375) * 1.57 + "px";
    document.getElementById("XPprogressBar").style.top = (objectSize * 0.09375) * 1.125 + "px";
    document.getElementById("btn1").style.top = objectSize * 0.01 + "px";
    document.getElementById("btn4").style.top = objectSize * 0.11 + "px";
    document.getElementById("btn2").style.top = objectSize * 0.01 + "px";
    document.getElementById("btn5").style.top = objectSize * 0.11 + "px";
    document.getElementById("btn3").style.top = objectSize * 0.01 + "px";
    document.getElementById("btn6").style.top = objectSize * 0.11 + "px";
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
    document.getElementById("scroll").style.top = objectSize * 0.02 + "px";
    document.getElementById("scrollBackCenter").style.top = objectSize * 0.02 + "px";
    document.getElementById("scrollBackUp").style.top = objectSize * 0.02 + "px";
    document.getElementById("btnClose").style.top = objectSize * 0.065 + "px";
    document.getElementById("scrollText").style.top = objectSize * 0.065 + "px";

    document.getElementById("backMapa").style.top = objectSize * 0.1 + "px";
    
    
    //Others
    document.getElementById("indicadores").style.display = "flex";
    document.getElementById("indicadores").style.justifyContent = "space-between";
    document.getElementById("hpIcon").style.height = objectSize * 0.045 + "px";
    document.getElementById("goldIcon").style.height = objectSize * 0.045 + "px";
    document.getElementById("spiritIcon").style.height = objectSize * 0.045 + "px";
    document.getElementById("hpIcon").style.width = objectSize * 0.045 + "px";
    document.getElementById("goldIcon").style.width = objectSize * 0.045 + "px";
    document.getElementById("spiritIcon").style.width = objectSize * 0.045 + "px";
    //document.getElementById("textStartBtn").style.padding = objectSize * 0.02 + "px";
    //document.getElementById("btnBlackBack").style.borderRadius = objectSize * 0.05859375 + "px";
    

 

}


//Change layout when is landscape in mobile only
function layoutLandscapeMobile(){

    if(getLocal("firstUse") == "true"){
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
    document.getElementById("pjName").style.fontSize = objectSize * 0.11 + "px";
    document.getElementById("indicadores").style.fontSize = objectSize * 0.05 + "px";
    document.getElementById("statusText").style.fontSize = em * 2 + "px";
    document.getElementById("scrollText").style.fontSize = objectSize * 0.05 + "px";

    
    //widths
    document.getElementById("main").style.width = objectSize + "px";
    document.getElementById("XPprogressBar").style.width  = window.innerWidth * 0.95  + "px";
    document.getElementById("pjName").style.width  = window.innerWidth * 0.90 + "px";
    document.getElementById("indicadores").style.width  = window.innerWidth * 0.95 + "px";
    document.getElementById("marco").style.width = objectSize * 1.0625 + "px";
    document.getElementById("esceneCanvas").style.width = objectSize + "px";
    document.getElementById("pjCanvas").style.width = objectSize + "px";
    document.getElementById("npcCanvas").style.width = objectSize + "px";
    document.getElementById("spellCanvas").style.width = objectSize + "px";
    document.getElementById("nubes").style.width = window.innerWidth + "px";
    document.getElementById("scroll").style.width = window.innerWidth * 0.98 + "px";  
    document.getElementById("scrollBackCenter").style.width = window.innerWidth * 0.98 + "px";  
    document.getElementById("scrollBackUp").style.width = window.innerWidth * 0.98 + "px";
    document.getElementById("scrollBackDown").style.width = window.innerWidth * 0.98 + "px";  
  
    document.getElementById("scrollText").style.width = window.innerWidth * 0.92 + "px";  
    document.getElementById("btnClose").style.width  = objectSize * 0.09375 + "px";  


    var pjBtnWidth = document.getElementById("pjDivineBtn").style.width = objectSize * 0.325 + "px";
    document.getElementById("npcDivineBtn").style.width = objectSize * 0.325 + "px";
    var centerDivineBtn = document.getElementById("centerDivineBtn").style.width = objectSize * 0.35 + "px";


    //heights
    var headingH = document.getElementById("heading").style.height = objectSize * 0.24 + "px";
    var marcoH = document.getElementById("marco").style.height = objectSize * 0.3125 + "px";
    document.getElementById("esceneCanvas").style.height = objectSize * 0.25 + "px";
    document.getElementById("pjCanvas").style.height = objectSize * 0.25 + "px";
    document.getElementById("npcCanvas").style.height = objectSize * 0.25 + "px";
    document.getElementById("spellCanvas").style.height = objectSize * 0.25 + "px";
    document.getElementById("XPprogressBar").style.height  = objectSize * 0.03  + "px";
    document.getElementById("nubes").style.height  = window.innerHeight  + "px";
    //document.getElementById("scrollText").style.height  = window.innerHeight * 0.75  + "px";
    //document.getElementById("scrollBackCenter").style.height  = window.innerHeight * 0.9  + "px";

    if(parseInt(document.getElementById("scrollBackCenter").style.minHeight) > 0){
        document.getElementById("scrollBackCenter").style.minHeight = window.innerHeight * 0.8 + "px";
        document.getElementById("scrollText").style.minHeight = window.innerHeight * 0.7 + "px";
        document.getElementById("scrollBackDown").style.top = window.innerHeight * 0.8 + "px";
    }



    document.getElementById("pjDivineBtn").style.height = objectSize * 0.25 + "px";
    document.getElementById("npcDivineBtn").style.height = objectSize * 0.25 + "px";
    document.getElementById("centerDivineBtn").style.height = objectSize * 0.25 + "px";


    //lefts
    document.getElementById("main").style.left = (window.innerWidth - objectSize) / 2 - (window.innerWidth * 0.025) + "px";
    document.getElementById("esceneCanvas").style.left = (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("pjCanvas").style.left = (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("npcCanvas").style.left = (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("spellCanvas").style.left = (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("statusText").style.left = window.innerWidth * 0.925 + "px";
    document.getElementById("nubes").style.left = "0px";
    document.getElementById("btnClose").style.left = objectSize * 0.75 + (objectSize * 0.1) * 2 + "px";
    document.getElementById("scroll").style.left = objectSize * 0.01 + "px";
    document.getElementById("scrollText").style.left = objectSize * 0.03 + "px";

    var pjBtnLeft = document.getElementById("pjDivineBtn").style.left = (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("centerDivineBtn").style.left = parseInt(pjBtnLeft) + parseInt(pjBtnWidth) + "px";
    document.getElementById("npcDivineBtn").style.left = parseInt(pjBtnLeft) + parseInt(pjBtnWidth) + parseInt(centerDivineBtn) + "px";


    //tops
    document.getElementById("indicadores").style.top = objectSize * 0.17 + "px";
    document.getElementById("XPprogressBar").style.top = objectSize * 0.13 + "px";
    document.getElementById("statusText").style.top = objectSize * 0.01 + "px";
    document.getElementById("marco").style.top = parseInt(headingH) + "px";
    document.getElementById("esceneCanvas").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("pjCanvas").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("npcCanvas").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("spellCanvas").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("nubes").style.top = "0px";
    document.getElementById("scroll").style.top = objectSize * 0.02 + "px";
    document.getElementById("scrollBackCenter").style.top = objectSize * 0.02 + "px";
    document.getElementById("scrollBackUp").style.top = objectSize * 0.02 + "px";
    document.getElementById("btnClose").style.top = objectSize * 0.065 + "px";
    document.getElementById("scrollText").style.top = objectSize * 0.06 + "px";

    document.getElementById("pjDivineBtn").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("npcDivineBtn").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.1) + "px";
    document.getElementById("centerDivineBtn").style.top = parseInt(headingH) + (parseInt(marcoH) * 0.1) + "px";


    //Others
    document.getElementById("indicadores").style.display = "flex";
    document.getElementById("indicadores").style.justifyContent = "space-between";
    document.getElementById("hpIcon").style.height = objectSize * 0.05 + "px";
    document.getElementById("goldIcon").style.height = objectSize * 0.05 + "px";
    document.getElementById("spiritIcon").style.height = objectSize * 0.05 + "px";
    document.getElementById("hpIcon").style.width = objectSize * 0.05 + "px";
    document.getElementById("goldIcon").style.width = objectSize * 0.05 + "px";
    document.getElementById("spiritIcon").style.width = objectSize * 0.05 + "px";

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
	sceneOnTop = true;
	layoutPortrait()
}
  
// scroll close 
function scrollClose(){
    scrollCurrentContent = "";
    playSound("scroll");
    document.getElementById("btnClose").style.display = "none";
    document.getElementById("btnClose").style.top = objectSize * 0.065 + "px";
    var content = document.getElementById("scrollText");
    var el = document.getElementById("scrollBackCenter");
    var sbd =  document.getElementById("scrollBackDown");

    el.style.minHeight = 0 + "px";
    content.style.minHeight = 0 + "px";
    sbd.style.top = objectSize * 0.02 + "px";

    //crate a event that listen the css transition, and after that remove the listener in hideScrollContent
    el.addEventListener("transitionend", hideScrollContent);
	
  }

//show the close button only when the scroll is totally opened
function showCloseButton(){
    document.getElementById("btnClose").style.display = "block";
    document.getElementById("scrollBackCenter").removeEventListener("transitionend", showCloseButton)
}

// scroll open
function scrollOpen(currentContent,height = (window.innerHeight - (objectSize * 0.25) * 1.5)){
    scrollCurrentContent = currentContent;
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
    sbd.style.top = objectSize * 0.02 + "px";
    //sbd.style.visibility = "visible";
    sbd.style.opacity = 1;


    document.getElementById("scroll").style.zIndex = 150;
    el.style.minHeight = height * 0.97 + "px";
    content.style.minHeight = height * 0.92 + "px";
    sbd.style.top = height * 0.97 + "px";

    el.addEventListener("transitionend", showCloseButton);
	
		//switch positions scene and console
	sceneOnTop = false;
	layoutPortrait()
  }


//Put the bocadillo in the right place in the map
function localizarBocadillo(){
    if (currentBackGround == "curanderobg"){
        document.getElementById("bocadilloMapa").style.display ="none";
        document.getElementById("pjMapa").style.display ="none";
    }else{
        if(getLocal("currentZone") == "la_Mina" || getLocal("currentZone") == "la_Cueva" || getLocal("currentZone") == "el_Volcan"){
            document.getElementById("backMapa").src = "img/mapaunderground.png";
        }else{
            document.getElementById("backMapa").src = "img/mapa.png";
        }
        if(!currentBackGround.match(/_altar/) && !currentBackGround.match(/_estatua/)){
        var localidad = places[currentBackGround];
        document.getElementById("zoneMap").innerHTML= "The " + zones[getLocal("currentZone")].name;
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

 

    //add a pseudouniqueID for this device:
    if(!localStorage[thx("uniqueID")]){
        //uniqueID = Math.random().toString(36).substr(2, 16);
        //localStorage.uniqueID = uniqueID;
        setLocal("uniqueID",Math.random().toString(36).substr(2, 16))
    };

    if(getLocal("firstUse") == "true"){
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
            if(!localStorage[thx("pjName")]){setLocal("pjName",  document.getElementById("inputName").value)};
        }else{
            if(!localStorage[thx("pjName")]){setLocal("pjName", randomName())};
        }
        document.getElementById("launcher").style.display = "none" ;
        document.getElementById("main").style.display = "block" ;
        //fadeOut(document.getElementById("launcher"))
        //fadeIn(document.getElementById("main"))
        localStorage.timeTotal = 0;
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
    if(!localStorage.cementery){localStorage.cementery = ""};
    var birthDate = new Date(Date.parse(localStorage.initialDate)).toLocaleDateString("en", {year: 'numeric', month: 'long', day: 'numeric'});
    var dieDate = new Date().toLocaleDateString("en", {year: 'numeric', month: 'long', day: 'numeric'});
    localStorage.cementery = localStorage.cementery +  getLocal("pjName") + " (lvl: " + check("lvl") + ") died at the age of " + check("age") + ". " + birthDate + " - " + dieDate + "<br>";
    clearInterval(animateClock); 
    clearInterval(animateClockNPC);
    clearInterval(eventMasterClock);
    clearInterval(eventClock);
    multipleEventsCounter = 0;
    //save uniqueID
    var uniqueIDRescue = getLocal("uniqueID");
    var cementery = localStorage.cementery;
    localStorage.clear();
    setLocal("uniqueID", uniqueIDRescue)
    localStorage.cementery = cementery;
    location.reload(true);
}


//pj divine button funct
function pjBtn(){
    if (!disablePjBtn){
        if(pjDead){
            idx("divineTouch");
            disablePjBtn = true;
            playSound("revive")
            spell("spellMultiDivine_28",true,frameWidth,frameHeight,currentFrame,shift);
            print("<b>" + getLocal("pjName") + "</b> " + "feels the divine touch!");
            if (!!autorevive){
                clearTimeout(autorevive);
                autorevive = "";
            }
            //
            setLocal("HP", getLocal("HPBase"));
            loadBackground("curanderobg");
            pjDead = false;
            loadCanvasChar(getLocal("lvl"), squareSide, headLevel);
            loadNPC("curandero");
            //
            eventClock = setInterval(reviveEV, masterTime);
        }else{
            //heal pj
            // console.log("HP " + getLocal("HP"));
            // console.log("HPBase " + getLocal("HPBase"));
            var healOperation = Number(getLocal("HPBase")) * Number(getLocal("fHeal"));
            var healHit = getRandomInt(healOperation * 0.5 ,healOperation * 2);
            if ( Math.round(Number(getLocal("HP"))) +  Math.round(healHit) >  Math.round(Number(getLocal("HPBase")))){
                healHit =   Math.round(Number(getLocal("HPBase"))) -  Math.round(Number(getLocal("HP"))); //modify heal to avoid overhealing
            }
            var faithLost = healHit * getRandomInt(1,3);//determine faith cost
            //balance faith cost
            if ( Math.round(Number(getLocal("fe"))) -  Math.round(faithLost) < 0) {//avoid extra attack and reduce the god attack to the amount of faith
                faithLost = Number(getLocal("fe"));//update faith cost
                healHit = faithLost / getRandomInt(1,3);//update heal hit
            }
            if ((Math.round(Number(getLocal("HP"))) < Math.round(Number(getLocal("HPBase")))) && ( Math.round(Number(getLocal("fe"))) > 0)){
                idx("DivineHeal");
                if (Number(getLocal("HP")) + healHit > Number(getLocal("HPBase"))){
                    healHit = Number(getLocal("HPBase")) - Number(getLocal("HP"));//update values
                    setLocal("HP", getLocal("HPBase"));
                    faithLost = healHit * getRandomInt(1,3)//update values
                }else{
                    setLocal("HP", Number(getLocal("HP")) + (healHit));
                } 
                //localStorage[thx("fe")] = thx(Number(getLocal("fe")) - faithLost);
                setLocal("fe", Number(getLocal("fe")) - faithLost);
                
                // console.log("faithLost " + faithLost)
                // console.log("healHit " + healHit)
                updateHeading();
                
                playSound("heal");
                spell("spellHeal_8",true,frameWidth,frameHeight,currentFrame,shift);
                print("<b>" + getLocal("pjName") + "</b> " + "feels a healing touch and recovers " + healIcon + roundNumbertoLetter(healHit)/* + " (" + spiritIcon + " -" + roundNumbertoLetter(faithLost) + ")"*/);

            }

    }
}
}

//npc divine button funct
function npcBtn(){
    if(!!localStorage[thx("currentNpc")] && !!enemy && Math.round(Number(getLocal("fe"))) > 0 && Math.round(enemyHP) > 1){
        //hurt npc
        var divineHit = getRandomInt(Number(getLocal("attack")) * 1.5, Number(getLocal("attack")) * 3);
        if ( Math.round(enemyHP) -  Math.round(divineHit) <= 0){//modify the divineHit to avoid god kills
            divineHit = ( Math.round(enemyHP) - 1);
        }
        var faithLost =  divineHit * getRandomInt(1,3)
        if ( Math.round(Number(getLocal("fe"))) - Math.round(faithLost) < 0) {//avoid extra attack and reduce the god attack to the amount of faith
            faithLost = Number(getLocal("fe"));
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
            enemyHP = Math.round(enemyHP) - (Math.round(divineHit));
            
            updateHeartNPC()
            setLocal("fe", Number(getLocal("fe")) - faithLost);
            updateHeading();
            print("<b>" + getLocal("pjName") + "</b> " + txt + heartIcon + " " + roundNumbertoLetter(enemyHP))
            idx("DivineHit");
        }
    }

//center divine button funct
function centerBtn(){
    //increase faith like offer
    if(!disableCenterBtn){
        if(Number(getLocal("Gold")) > 0 && !!currentBackGround.match(/altar/gi)){
            disableCenterBtn = true;
            var ofrendaGold = getRandomInt(Number(getLocal("Gold")) * 0.25, Number(getLocal("Gold")) * 0.75);
            //feGanada = (ofrendaGold / getRandomInt(7,15)) * getLocal("fOfrenda");
            feGanada = (ofrendaGold * Number(getLocal("fOfrenda")));
            feGanada *= Number(getLocal("feMultiplicator"));
            setLocal("fe", Number(getLocal("fe")) + feGanada);
            setLocal("Gold", Number(getLocal("Gold")) - ofrendaGold);
            //localStorage.idx_offers = Number(localStorage.idx_offers) + ofrendaGold;
            var textoffer = "feels the need to give a higher tithe, increases the tithe, feels that someone order to offer extra gold"
            print("<b>" + getLocal("pjName") + "</b> " + pickRandomItem(textoffer) + " (" + goldIcon + " -" + roundNumbertoLetter(ofrendaGold) + ", " + spiritIcon + " " + roundNumbertoLetter(feGanada) + ")");
            idx("DivineMandatoryOffers");
            idx("GoldOffered", Math.round(ofrendaGold));
            idx("FeByGold",Math.round(feGanada));
            updateHeading();
            playSound("coins");
            spell("spellCoins",false,frameWidth,frameHeight,currentFrame,shift);
        }
    }
}


//control close button in the scroll
function btnCloseEvent(){
    if (scrollCurrentContent == "history"){//unpause game after history
       pauseToggle();
    }
    scrollClose()
}


//map button funct
function mapBtn(){
    if(getLocal("currentZone") == "la_Mina" || getLocal("currentZone") == "la_Cueva" || getLocal("currentZone") == "el_Volcan"){
        document.getElementById("backMapa").src = "img/mapaunderground.png";
    }else{
        document.getElementById("backMapa").src = "img/mapa.png";
    }
    document.getElementById("bocadilloMapa").src = "img/bocadillo.png";
    document.getElementById("pjMapa").src = "img/lvl" + Math.floor(Number(getLocal("lvl")) / 10) * 10 + ".png";
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
    txt += getListOfOrganizedLocalStorage(/logro_/);
    //txt += '<div class="divTableRow"><div class="divTableCell"><img src="img/no_logro.png" height="' + em * 4 + 'px" /></div><div class="divTableCell"><strong>?????????????</strong> <br></div></div>';
    txt += "</div>"
    document.getElementById('innerTextScroll').innerHTML=txt;
    document.getElementById("titleAchievements").style.fontSize = em * 2.5 + "px";
    document.getElementById("titleAchievements").style.lineHeight = em * 2.5 + "px";  

}

function updateStats(){

    var secondsIngameInstats = ((Number(localStorage.timeTotal) + (performance.now() - timeStart))/1000).toFixed(0);
    var numLogrosGanados = countLogros();
    statsPage = "<div id='stats'><span class='titles' id='titleStats'>Stats</span><br>" + 
    "<span class='subtitles'>Wizard</span><br>" + 
    "Name: " + (getLocal("pjName")) + "<br>" +
    "Level: " + check("lvl") + "<br>" +
    "Age: " + check("age") + " yrs<br>" +
    "Health points: " + check("HPBase") + "<br>" + 
    "Attack points: " + check("attack") + "<br>" + 
    "Critic multiplier: " + check("fCritic") + "<br>" + 
    "Exp. to next level: " + Math.round((Number(getLocal("XPNextLevel")) - Number(getLocal("XP"))) * 100) + "<br>" + 
    "Time of existence: " + /*roundNumbertoLetter(secondsIngameInstats) + "~" +*/ secsToHours(secondsIngameInstats) + "<br>" +
    "<br><span class='subtitles'>Battles</span><br>" + 
    "Attacks: " + check("idx_Attacks") + "<br>" + 
    "Critic attacks: " + check("idx_Critics") + "<br>" + 
    "Melee attacks: " + check("idx_school_Physical") + "<br>" + 
    "Magical attacks: " + (Number(check("idx_Attacks")) - Number(check("idx_school_Physical")))  + "<br>" + 
    "Attacks received: " + check("idx_IncomingAttacks") + "<br>" + 
    "Enemy encounters: " + check("idx_enemyEncounters") + "<br>" + 
    "Enemies derroted: " + check("idx_EnemiesKilled") + "<br>" + 
    "Rare encounters: " + check("idx_rareEnemyEncounters") + "<br>" + 
    "Rare derroted: " + check("idx_rareEnemiesKilled") + "<br>" + 
    (check("idx_enemyEncounters") > 0 ? "Types of enemies found: " + getListOfOrganizedLocalStorage(thx("idx_enemy_")) + "<br>" : "") + 
    //"Bosses found: " + check("idx_Bosses") + "<br>" + 
    "Bosses found: " + check("idx_Bosses") + (check("idx_Bosses") > 0 ? " {" + getListOfOrganizedLocalStorage(thx("idx_typeBoss_")) + "}": "") + "<br>" + 
    "Bosses derroted: " + check("idx_BossesKilled") + "<br>" +
    (getLocal("hydraMysteryResolved") == "true" &&  check("idx_Hydras") > 0 ?  "Hydras found: " + check("idx_Hydras") + " {" + getListOfOrganizedLocalStorage(thx("idx_typeofHydras_")) + "}<br>": "") +
    (getLocal("hydraMysteryResolved") == "true" &&  check("idx_Hydras") > 0 ?  "Hydras derroted: " + check("idx_HydrasKilled") + "<br>" : "") +
    (getLocal("hydraMysteryResolved") == "true" &&  check("idx_Hydras") > 0 ?  "Hydras heads chopped off: " + check("idx_HydrasHeadCut") + "<br>" : "") +
    "Falls: " + check("idx_Deaths") + "<br>" + 
    "Current flawless victory: " + check("idx_Combo") + "<br>" + 
    "Longest flawless victory: " + check("idx_longestCombo") + "<br>" + 
    "<br><span class='subtitles'>Magic</span><br>" + 
    "Current magical level: " + Math.floor(Number(getLocal("lvl")) / 10) + "<br>" + 
    "Known spells: " + countSpellKnown() + "<br>" + 
    "Arcane spells cast: " + check("idx_school_Arcane") + "<br>" + 
    "Healing spells cast: " + check("idx_Heal") + "<br>" + 
    "Nature spells cast: " + check("idx_school_Nature") + "<br>" + 
    "Fire spells cast: " + check("idx_school_Fire") + "<br>" + 
    "Frost spells cast: " + check("idx_school_Frost") + "<br>" + 
    "Thunder spells cast: " + check("idx_school_Thunder") + "<br>" + 
    "Shadow spells cast: " + check("idx_school_Shadow") + "<br>" + 
    "Divine spells cast: " + check("idx_school_Divine") + "<br>" + 
    "Enemies polymorphed into a sheep: " + check("idx_Polymorph_oveja") + "<br>" + 
    "Enemies polymorphed into a chicken: " + check("idx_Polymorph_gallina") + "<br>" + 
    "<br><span class='subtitles'>Study</span><br>" + 
    "Books found: " + check("idx_book") + "<br>" + 
    "Runes found: " + check("idx_rune") + "<br>" + 
    "Successful studies: " + check("idx_sucessStudy") + "<br>" + 
    "Failed studies: " + check("idx_failStudy") + "<br>" + 
    "Successful statue studies: " + check("idx_sucessStudyStatue") + "<br>" + 
    "Failed statue studies: " + check("idx_failStudyStatue") + "<br>" + 
    (check("idx_sucessStudyStatue") > 0 ?  "Skills incresed studing books or runes: " + getListOfOrganizedLocalStorage(thx("idx_study_"),"statObj") + "<br>" : "") + 
    "<br><span class='subtitles'>Exploration</span><br>" + 
    "Current zone: " + "The " + zones[getLocal("currentZone")].name + "<br>" + 
    "Last zone: " + "The " + zones[getLocal("lastZone")].name + "<br>" + 
    "Changes of zones: " + check("idx_zonesChanged") + "<br>" + 
    "Times in the Prairie: " + check("idx_zone_la_Pradera") + "<br>" + 
    "Times in the City: " + check("idx_zone_la_Ciudad") + "<br>" + 
    "Times in the Castle: " + check("idx_zone_el_Castillo") + "<br>" + 
    "Times in the Town: " + check("idx_zone_el_Poblado") + "<br>" + 
    "Times in the Cave: " + check("idx_zone_la_Cueva") + "<br>" + 
    "Times in the Grute: " + check("idx_zone_la_Gruta") + "<br>" + 
    "Times in the Tower: " + check("idx_zone_la_Torre") + "<br>" + 
    "Times in the Forest: " + check("idx_zone_el_Bosque") + "<br>" + 
    "Times in the Swamp: " + check("idx_zone_el_Pantano") + "<br>" + 
    "Times in the Dunes: " + check("idx_zone_las_Dunas") + "<br>" + 
    "Times in the Tundra: " + check("idx_zone_la_Tundra") + "<br>" + 
    "Times in the Volcano: " + check("idx_zone_el_Volcan") + "<br>" + 
    "Times in the Desert: " + check("idx_zone_el_Desierto") + "<br>" + 
    "Times in the Heidan: " + check("idx_zone_el_Heidan") + "<br>" + 
    "Times in the Duenon: " + check("idx_zone_el_Duenon") + "<br>" + 
    "Times in the Mine: " + check("idx_zone_la_Mina") + "<br>" + 
    "Bags found: " + check("idx_BotinGot_bag") + "<br>" + 
    "Chests found: " + check("idx_BotinGot_chest") + "<br>" + 
    "Pots found: " + check("idx_BotinGot_pot") + "<br>" + 
    "Barrels found: " + check("idx_BotinGot_barrel") + "<br>" + 
    "Boxes found: " + check("idx_BotinGot_box") + "<br>" + 
    "Total statues found: " + check("idx_statuesFound") + "<br>" + 
    (check("idx_statuesFound") > 0 ? "Type of statues found: " + getListOfOrganizedLocalStorage(thx("idx_estatuas_"),"statueObj") + "<br>" : "") + 
    "<br><span class='subtitles'>Economy</span><br>" + 
    "Current gold: " + check("Gold") + "<br>" + 
    "Total gold looted: " + check("idx_GoldFromEnemies") + "<br>" + 
    "Total gold looted from bosses: " + check("idx_GoldFromBosses") + "<br>" + 
    "Total gold found: " + check("idx_GoldFromBotin") + "<br>" + 
    "Total gold lost in battles: " + check("idx_goldLostInBattle") + "<br>" + 
    "Gold found in bags: " + check("idx_GoldFromBotin_bag") + "<br>" + 
    "Gold found in chests: " + check("idx_GoldFromBotin_chest") + "<br>" + 
    "Gold found in pots: " + check("idx_GoldFromBotin_pot") + "<br>" + 
    "Gold found in barrels: " + check("idx_GoldFromBotin_barrel") + "<br>" + 
    "Gold found in boxes: " + check("idx_GoldFromBotin_box") + "<br>" + 
    "<br><span class='subtitles'>Leisure</span><br>" + 
    "Rests in inns: " + check("idx_taberna") + "<br>" + 
    "Gold spend at inns: " + check("idx_GoldSpendInn") + "<br>" + 
    "Campings: " + check("idx_camping") + "<br>" + 
    "<br><span class='subtitles'>Spirituality</span><br>" + 
    "Faith: " + check("fe") + "<br>" + 
    "Offers: " + check("idx_offers") + "<br>" + 
    "Tithe: " + check("idx_GoldOffered") + "<br>" + 
    "Faith obtained by gold: " + check("idx_FeByGold") + "<br>" + 
    "Faith obtained by pray: " + check("idx_FeByPray") + "<br>" + 
    "Faith obtained by corruption erradication: " + check("idx_FeByCleanCorruption") + "<br>" + 
    "Shrines visited: " + check("idx_altar") + "<br>" + 
    (check("idx_altar") > 0 ? "Shrines visited in: " + getListOfOrganizedLocalStorage(thx("idx_altar_zone_")) + "<br>" : "") + 
    "Mandatory offers: " + check("idx_DivineMandatoryOffers") + "<br>" + 
    "Negations: " + check("idx_negar") + "<br>" + 
    "Self recovery: " + check("idx_selfRevive")  + "<br>" + 
    "Recovered by healer: " + check("idx_hospital") + "<br>" + 
    "Divine touches: " + check("idx_divineTouch") + "<br>" + 
    "Divine healings: " + check("idx_DivineHeal") + "<br>" + 
    "Divine punishments to enemies: " + check("idx_DivineHit") + "<br>" + 
    "<br><span class='subtitles'>Achievements</span><br>" + 
    "Currenly won: " + numLogrosGanados + "<br>" + 
    "Completation: " + Math.round((numLogrosGanados / (Object.keys(logro).length - 1)) * 100) + "%<br>" + 
    "</div>";   
    document.getElementById('innerTextScroll').innerHTML= statsPage;  
    document.getElementById("stats").style.fontSize = em + "px";
    document.getElementById("stats").style.lineHeight = em + "px";
    document.getElementById("titleStats").style.fontSize = em * 2.5 + "px";
    document.getElementById("titleStats").style.lineHeight = em * 2.5 + "px";    

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
        '<div class="divTableRow"><div class="divTableCell"><img src="img/boss.png" height="' + em + 'px" /></div><div class="divTableCell">Boss, this encounter is harder than others, the reward is multiplied too.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img src="img/attack.png" height="' + em + 'px" /></div><div class="divTableCell">Attack, followed by the amount of damage against the wizard or the enemy.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img src="img/heart.png" height="' + em + 'px" /></div><div class="divTableCell">Wizard health, can be found in five states depending of the percentage (100%, 75%, 50%, 10%, and 0%).</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img style="filter: hue-rotate(45deg)" src="img/heart.png" height="' + em + 'px" /></div><div class="divTableCell">Enemy health, as well wizard health, it can be found in five states.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img src="img/achivement.png" height="' + em + 'px" /></div><div class="divTableCell">Achivement, just won a achivement.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img src="img/gold.png" height="' + em + 'px" /></div><div class="divTableCell">Gold, represent the currency in the game.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img src="img/heal.png" height="' + em + 'px" /></div><div class="divTableCell">Healing, followed by amount of health recovered.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img src="img/spirit.png" height="' + em + 'px" /></div><div class="divTableCell">Faith, divine currency in the game, divine touches and other stuff cost faith instead gold.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><span style="font-size:' + em * 1.5 + 'px">!</span></div><div class="divTableCell">Showed near the bottom-right corner, new content or update is available in the server. Reload the game to download the new content for offline access.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><span style="font-size:' + em * 1.5 + 'px">...</span></div><div class="divTableCell">Showed near the bottom-right corner, searching for new content or updates.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><span style="font-size:' + em * 1.5 + 'px">.</span></div><div class="divTableCell">Showed near the bottom-right corner, the game can run but some problem with the offline functions happens. No enough space, your browser does not allow cache, or cache is in conflict with a previous one.</div></div>' +
   '</div>' +
   '<div class="faq">The wizard</div><div class="a">The center of this game, ' + (getLocal("pjName")) + ' is growing in power and ambitions. The fate is just one.</div>' +
   '<div class="faq">The player</div><div class="a"><b>You</b>, to avoid interrupt the free will of the wizard, you can only watch and help limited reducing the faith of the wizard. If the wizard has faith < 0 you cannot help him.</div>' +
   '<div class="faq">Divine touches</div><div class="a">This is the main player interaction with the wizard and occurs when click or touch the Scene panel. Some basic interactions are: <ol><li>Touch the wizard heal him (cost faith).</li><li>Touch the wizard when he is dead (soft dead) revive him.</li><li>Touch the enemy damage him/her/it (cost faith).</li><li>Touch a shire mandate the wizard to give a tribute in gold (gain faith).</li>'+(check("travelFavor") == "1" ? "<li>Touch the map teleport the wizard to the selected area.</li>" : "")+'</ol></div>' +
   '<div class="faq">Kill the wizard</div><div class="a">' +
   '<div class="divTableRow"><div class="divTableCell"><img src="img/diebtn.png" height="' + objectSize * 0.09375 + 'px" /></div><div class="divTableCell">This is a definitive option, with this the player can destroy the current wizard in order to create another, <b>this action cannot be undone.</b></div></div>' +
   '</div>' +
   '<div class="faq">Achievements</div><div class="a">' + 
   '<div class="divTableRow"><div class="divTableCell"><img src="img/archbtn.png" height="' + objectSize * 0.09375 + 'px" /></div><div class="divTableCell">A history of events your wizard achieve during his journey.</div></div>' +
   '</div>' +
   '<div class="faq">Stats</div><div class="a">' +
   '<div class="divTableRow"><div class="divTableCell"><img src="img/statsbtn.png" height="' + objectSize * 0.09375 + 'px" /></div><div class="divTableCell">Many stats about what happen in the wizard trip. Pure informational.</div></div>' +
   '</div>' +
   '<div class="faq">Map</div><div class="a">' + 
   '<div class="divTableRow"><div class="divTableCell"><img src="img/mapbtn.png" height="' + objectSize * 0.09375 + 'px" /></div><div class="divTableCell">   Here you can see the representation of the continent where everything happens. ' + (check("travelFavor") == "1" ? "Touching it can teleport the wizard to the selected area." : "") + '</div></div>' +
   '</div>' +
   '<div class="faq">Study and skills</div><div class="a">During the wizard\'s trip, books, runes and statues can be found available to study. A sucessful study of them increase some stats. In this way the wizard can be a strong archmage or a devote donor to your cause.</div>' +
   '<div class="faq">Faith</div><div class="a">Your interaction with the wizard\'s world depends of this currency. The wizard gains faith praying and offering in your shrines. He loses the faith avoiding enter to the shires, reviving himself, and after each divine touch.</div>' +
   '<div class="faq">Rest and healing</div><div class="a">There are different ways to heal the wizard:<br><ol><li>By himself, casting some restauration spell during the battles.</li><li>By himself, sleeping.</li><li>By your interaction, in exchange for faith.</li></ol></div>' +
   '<div class="faq">Revive (soft dead)</div><div class="a">' +
        '<div class="divTableRow"><div class="divTableCell"><img src="img/muerto.png" height="' + em * 3 + 'px" /></div><div class="divTableCell">If the wizard falls in a battle, there are two ways to revive and continue with the game: <ol><li>By divine intervention touching the dead image (promotes godliness).</li><li>By himself, after some time, this cost huge amounts of faith and the recover is partial (promotes atheism).</li></ol></div></div>' +
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
    document.getElementById("help").style.fontSize = em + "px";
    document.getElementById("help").style.lineHeight = em + "px";
    document.getElementById("titleHelp").style.fontSize = em * 2.5 + "px";
    document.getElementById("titleHelp").style.lineHeight = em * 2.5 + "px";  


    
    //collapsible in help scroll
    var coll = document.getElementsByClassName("faq");
    var i;
    for (i = 0; i < coll.length; i++) {
    coll[i].style.lineHeight = em * 2 + "px";
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
    var secondsIngameInstats = ((Number(localStorage.timeTotal) + (performance.now() - timeStart))/1000).toFixed(0);
    var txt = '<div id="kill"><span class="titles" id="titleKill">Kill</span><br>' +
    '<div>' + 
    'Do you want to kill <b>' + getLocal("pjName") + '</b>?<br><br>' +
    'All progress, achievement and stats of this wizard will be lost forever (<b>this action cannot be undone</b>).<br><br>' +
    '<b>' + getLocal("pjName") + '</b> has existed for ' + secsToHours(secondsIngameInstats) + ", he is on level " + check("lvl") + (countLogros() > 0 ? " and has " + countLogros() + " achievements" : "") + "<br><br>" +
    'For kill the wizard press Kill button below, otherwise just close this scroll.' +
    '</div>' +
    '<br><br><div>' + 
    '<img class="btn" id="realKillBtn" src="img/matar.png"/>' +
    '</div><br><br>' + 
    '<span class="titles" id="titleCementery">' + (!localStorage.cementery ? "" : "Cementery") + '</span>' + 
    (!localStorage.cementery ? "" : "<small>" + localStorage.cementery + "</small>");
    document.getElementById('innerTextScroll').innerHTML=txt;
    document.getElementById("realKillBtn").onclick = realKill;
    document.getElementById("kill").style.fontSize = em + "px";
    document.getElementById("kill").style.lineHeight = em + "px";
    document.getElementById("titleKill").style.fontSize = em * 2.5 + "px";
    document.getElementById("titleKill").style.lineHeight = em * 2.5 + "px";
    document.getElementById("titleCementery").style.fontSize = em * 2.5 + "px";
    document.getElementById("titleCementery").style.lineHeight = em * 2.5 + "px";
    
    var realKillBtnW = document.getElementById("realKillBtn").style.width  = ((objectSize * 0.09375) * 1.90625) * 1.5 + "px";  
    document.getElementById("realKillBtn").style.left = ((objectSize - parseInt(realKillBtnW)) / 2) + "px";
    document.getElementById("realKillBtn").style.height  = (objectSize * 0.09375) * 1.5 + "px"; 

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
            idx("altar");
            idx("altar_zone_" + getLocal("currentZone"));
            //multiplicador de fe 
            setLocal("feMultiplicator", 2)
            if (Number(check("idx_divineTouch")) + Number(check("idx_DivineHeal")) + Number(check("idx_DivineHit")) > 200){
                var text = "decides to devote himself to your consecration to retribute all your help";
            }else{
                var text = "decides to devote himself to your consecration to get more divine attention";
            }
            print("<b>" + getLocal("pjName") + "</b> " + text + ", and obtain a Divine crosier")
            loadBackground(getLocal("currentZone") + "_altar");
            var mistico = "mistico" + getRandomInt(1,3);
            loadNPC(mistico);
            loadCanvasChar(getLocal("lvl"), squareSide, headLevel);
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
    afterChapterExe = true;//activate post chapter event
    chapter["lvl" + getLocal("lvl")].event()

    //if has writen history display it
    if (chapter["lvl" + getLocal("lvl")].text != "NA"){
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
   document.getElementById('innerTextScroll').innerHTML= chapter["lvl" + getLocal("lvl")].text;
   document.getElementById("innerTextScroll").style.display = "block";
   document.getElementById("historyTitle").style.fontSize = em * 2.5 + "px";
   document.getElementById("historyTitle").style.lineHeight = em * 2.5 + "px";
   scrollOpen("history");
}


function afterChapter(){
    afterChapterExe = false;
    var lvl = Number(getLocal("lvl"));
    switch(lvl){
        case 30:
        npcCanvas.getContext("2d").clearRect(0, 0, npcCanvas.width, npcCanvas.height);
        setLocal("currentNpc", "");
        loadBackground(getLocal("currentZone") +  getLocal("currentStage"));
        print("<b>" + getLocal("pjName") + "</b>" + " leaves the shire and continue the journey");
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
    betForDice = getRandomInt(Number(getLocal("Gold")) * 0.1,Number(getLocal("Gold")) * 0.5)
    playSound("coins");

    //console.log("enemy start: " + enemyStart)
    if (enemyStart){
        nameDicePlayer = gamblingManName
    } else {
        nameDicePlayer = "<b>" + getLocal("pjName") + "</b> "
    }

    

    countRounds++
    //spell("spellCoins",false,frameWidth,frameHeight,currentFrame,shift);
    //spell("spellCoins",true,frameWidth,frameHeight,currentFrame,shift);
    //set or equal the bet
    setLocal("Gold", Number(getLocal("Gold")) - betForDice);
    updateHeading();
    print(nameDicePlayer + " starts the game and suggest a bet of " + goldIcon + roundNumbertoLetter(betForDice))

    

    clearInterval(eventClock);
    eventClock = setInterval( function() { rollDicesForSixfivefour(enemyStart,nameDicePlayer); }, masterTime);
}


//Mechanism for the game Six Five Four
function rollDicesForSixfivefour(enemyStart, nameDicePlayer) {
    multipleEventsCounter += 1;
    
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
                if (multipleEventsCounter == 3){
                    print(nameDicePlayer + " rolls the dice again " + ((symbolCurrentHand != '') ? '(' : '') + symbolCurrentHand + ((symbolCurrentHand != '') ? ')' : ''))
                }else if (multipleEventsCounter == 5){
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
                resultDice = resultDice + "<img class='imgInConsole' height='" + em + "' src='img/d" + dicesToRoll[elem] +".png'/>"
            }
            

        
            //check if some dice is 6 an delete the dice and set ship true
            for (let elem in dicesToRoll){
                if(dicesToRoll[elem] == 6 && !ship){
                    delete dicesToRoll[elem];
                    ship = true
                    currentHand = "<img class='imgInConsole' height='" + em + "' src='img/d6.png'/>:<img class='imgInConsole' height='" + em + "' src='img/ship.png'/> "
                    symbolCurrentHand = "<img class='imgInConsole' height='" + em + "' src='img/ship.png'/>"
                    //console.log("ship: " + ship)
                }
            }
            //check if some dice is 5 an delete the dice and set captain true
            for (let elem in dicesToRoll){
                if(dicesToRoll[elem] == 5 && ship && !captain){
                    delete dicesToRoll[elem];
                    captain = true
                    currentHand += "<img class='imgInConsole' height='" + em + "' src='img/d5.png'/>:<img class='imgInConsole' height='" + em + "' src='img/captain.png'/> "
                    symbolCurrentHand += "<img class='imgInConsole' height='" + em + "' src='img/captain.png'/>"
                    //console.log("captain: " + captain)
                }
            }
            //check if some dice is 4 an delete the dice and set crew true
            for (let elem in dicesToRoll){
                if(dicesToRoll[elem] == 4 && ship && captain && !crew){
                    delete dicesToRoll[elem];
                    crew = true
                    currentHand += "<img class='imgInConsole' height='" + em + "' src='img/d4.png'/>:<img class='imgInConsole' height='" + em + "' src='img/crew.png'/> "
                    symbolCurrentHand += "<img class='imgInConsole' height='" + em + "' src='img/crew.png'/>"
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
            multipleEventsCounter = 0;
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

    if (multipleEventsCounter == 6){
        clearInterval(eventClock);
        multipleEventsCounter = 0;
        
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
            if (!enemyStart){nameDicePlayer = gamblingManName} else {nameDicePlayer = "<b>" + getLocal("pjName") + "</b> "}
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

    multipleEventsCounter += 1;
    switch (multipleEventsCounter){
        case 1:
            countRounds = 0
            tie = cargoFirstPlayer == cargo
            
            if (!tie){
                firstPlayerWins = cargoFirstPlayer > cargo;
                if(firstPlayerWins){
                    print(nameFirstPlayer + " wins " + goldIcon + roundNumbertoLetter(betForDice * 2) + " (" + cargoFirstPlayer + " vs. " + cargo + ") ")
                    var winnerDice = nameFirstPlayer;
                }else{
                    print(nameDicePlayer + " wins " + goldIcon + roundNumbertoLetter(betForDice * 2) + " (" + cargoFirstPlayer + " vs. " + cargo + ") ")
                    var winnerDice = nameDicePlayer;
                }

                if (winnerDice == gamblingManName){
                    playSound("coins");
                    spell("spellCoins",false,frameWidth,frameHeight,currentFrame,shift);
                }else{
                    playSound("coins");
                    spell("spellCoins",true,frameWidth,frameHeight,currentFrame,shift);
                    setLocal("Gold", Number(getLocal("Gold")) + betForDice * 2);
                    updateHeading();
                }

            }else{
                print("Nobody won (" + cargoFirstPlayer + " vs. " + cargo + ")")
                //spell("spellCoins",true,frameWidth,frameHeight,currentFrame,shift);
                setLocal("Gold", Number(getLocal("Gold")) + betForDice);
                updateHeading();
            }
        break;
        case 2:
            print("<b>" + getLocal("pjName") + "</b> exits the gaming house");
            cargoFirstPlayer = 0;
            resetSixFiveFour()
            npcCanvas.getContext("2d").clearRect(0, 0, npcCanvas.width, npcCanvas.height);
            setLocal("currentNpc", "");
            loadBackground(getLocal("currentZone") +  getLocal("currentStage"));
            restAtInn = false;
            multipleEventsCounter = 0;
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

///////////////////////
///////////////////////
///////////////////////
//////just for dev/////
function exe(){
    try{
    var exeString = document.getElementById("inputExe").value;
    var exeResult = eval(exeString);
    print("<span style='color:DarkRed'>DEV: " + exeResult + "</span>")
    }catch(err){
    print("<span style='color:Red'>DEV error: " + err.message+ "</span>")
    }
    }


//dev acces clic in pjname>lvl>feIcon
var devAccess;
document.addEventListener("click",function(e){
    //console.log(e);
if(e.target.id == "pjName"){
    devAccess = 1;
}else if(e.target.id == "lvl" && devAccess == 1){
    devAccess = 2;
}else if(e.target.id == "spiritIcon" && devAccess == 2){
    devAccess = undefined;
    document.getElementById("exe").style.display = "block";
    /*document.getElementById("pjName").style.color = getRandomColor();*/
} else {
    devAccess = undefined;
}
});


var commands = '<br>FUNCTIONS<br>\
pauseToggle() \
list(), \
setLocal("property", value), \
getLocal("property"), \
addXP(#factor), \
setLocal("forceEvent","#event,#event2"), \
<br>VARS<br>\
masterTime = #ms, \
selfrevivetime = #ms';


//This app is made by Carlos Alonso Maya Lastra by fun//


// Entry points used by src/main.js to wire the page (v1 used inline onclick="..." attributes).
export {
    initialName, setName, responsiveLayout, exe,
    archBtn, statsBtn, killBtn, mapBtn, helpBtn,
    pjBtn, centerBtn, npcBtn, btnCloseEvent,
};
