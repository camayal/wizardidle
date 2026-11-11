// Wizard Idle v2 - The wizard's progression: levelling up, XP, gold, faith from gold, and trainable skills (statObj).
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { enemySprites, enemyTypes } from './data/enemies.js';
import { getRandomInt } from './utils.js';
import { config, RAREMULTIPLIER } from './config.js';
import { count, state } from './state.js';
import { fight, ui } from './runtime.js';
import { chapter, openHistory } from './story.js';
import { logro } from './achievements.js';
import { playSound } from './audio.js';
import { loadCanvasChar, print, updateHeading } from './ui/render.js';

    

//stat definition object
var statObj = {
    pAttack: {name:"attack chance", code:"pAttack"},
    fAttack: {name:"mastery in magic arts", code:"fAttack"},
    pPolymorph: {name:"polymorphism mastery", code:"pPolymorph"},
    fCritic: {name:"critical multiplier", code:"fCritic"},
    pCritic: {name:"critic chance", code:"pCritic"},
    pHeal: {name:"heal chance", code:"pHeal"},
    fHeal: {name:"restoration knowledge", code:"fHeal"},
    pStudy: {name:"intellect", code:"pStudy"},
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
        // a random skill (v1 relied on increase/random being the last two keys)
        var skills = Object.keys(this).filter((key) => typeof this[key] === "object");
        return this[skills[Math.floor(Math.random() * skills.length)]].code;
    }
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

export {
    addGold,
    addXP,
    calculateFe,
    levelUP,
    statObj,
};
