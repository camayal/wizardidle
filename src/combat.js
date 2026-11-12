// Wizard Idle v2 - Battles: choosing the enemy (normal, boss or hydra), each round of a fight, the wizard's attacks and
// heals, polymorph, and the random names enemies get.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { enemySprites, enemyTypes } from './data/enemies.js';
import { zones } from './data/zones.js';
import { npcSpells, spells } from './data/spells.js';
import { capitalize, getRandomInt, pickRandomItem, roundNumbertoLetter, YesOrNot } from './utils.js';
import { config, RAREMULTIPLIER, selfrevivetime } from './config.js';
import { count, stat, state } from './state.js';
import { fight, run, ui } from './runtime.js';
import * as loop from './loop.js';
import { endEvent, event, nextEvent, startEvent } from './events.js';
import { addGold, addXP, calculateFe } from './wizard.js';
import { logro } from './achievements.js';
import { currentFrame, frameHeight, frameWidth, getSpell, shift, spell } from './spells.js';
import { playSound } from './audio.js';
import { animateNPC, animatePJ, loadAlterCanvasChar, loadCanvasChar, loadNPC, npcCanvas, pjCanvas, print, updateHeading, updateHeartNPC, wizardName } from './ui/render.js';
import { el } from './ui/dom.js';



//Main event: BATTLE
function battle() {
    //stats
    run.multipleEventsCounter += 1;
    let option = 1;
    if (run.multipleEventsCounter > 1) {//special because is a loop in the second case until someone die
        option = 2
    }
    let corruptedText;
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
            endEvent();

            
            //kill capricor
            if (fight.enemy == "el_capricor"){
                logro.set(logro.logro_ultimocapricor);
                zones.el_Bosque.enemies = "el_Elfo,Animalejo,el_Ent,el_Herbo,la_Amazona";
            }

            fight.polymorphed = false;
            if (fight.bossCombat){
                count("BossesKilled");
                logro.set(logro.logro_primerbossderrotado)
            }else if(fight.hydraCombat){
                count("HydrasKilled");
                delete state.hydraHeads[fight.hydra]
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
            
            
            //add faith if the enemy is corrupted but only if not boss or hydra
            if(!fight.bossCombat && !fight.hydraCombat){
                if (enemySprites[fight.enemyAndNumber].corrupted == "1" && !state.player.inSin){
                    run.feGanada = calculateFe() * 5;
                    run.feGanada *= state.player.faithMultiplier
                    state.player.faith = state.player.faith + run.feGanada;
                    count("FeByCleanCorruption",Math.round(run.feGanada));
                    corruptedText = ", also gained " + ui.spiritIcon + " " + roundNumbertoLetter(run.feGanada) + " by corruption eradication";
                }else {
                    corruptedText = "";
                }
            }

            //punish if the wizard is in sin (use the same corruptedText)
            if(state.player.inSin){
                const feperdida = calculateFe();
                state.player.faith = state.player.faith - feperdida;
                corruptedText = ", and reduce the faith " + ui.spiritIcon + " -" + roundNumbertoLetter(feperdida);

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
                }else if(fight.hydraCombat){
                    addXP(Number(zones[state.zone.current].hidrasXPMultiplier));
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
                nextEvent();
            }
            
        }
        //if pj dies
        if (Math.round(state.player.hp) <= 0) {
            //stop clock of battle and reset bossMultiplier
            endEvent();
            // If the enemy fell in this same round, its death above already restarted the
            // event picker: stop it until the wizard is revived.
            loop.stop("master");
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
            let lootedText = "";
            // v1 crashed here ("acá hay un BUG") when the enemy had fallen in the same round:
            // fight.enemy was already empty. A fallen enemy can't take the wizard's gold.
            if (state.player.gold > 0 && fight.enemy && enemyTypes[fight.enemy].hasgold == "true"){
            const goldLooted = getRandomInt(state.player.lastBattleGold,state.player.lastBattleGold * 2);
            state.player.gold = state.player.gold - goldLooted;
            lootedText = " and loses some gold" +  " (" + ui.goldIcon + "-" + roundNumbertoLetter(goldLooted) + ")";
            count("goldLostInBattle", goldLooted);
            }
            print(wizardName() + " has fallen in battle" + lootedText);
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
                const feperdida = state.player.hpBase * 1.2454654;
                state.player.faith = state.player.faith - feperdida;
                print(wizardName() + " " + "recovers himself but feels abandoned by his god (" + ui.spiritIcon + "-" + roundNumbertoLetter(feperdida) + ")") 
                fight.pjDead = false;
                loadCanvasChar(state.player.lvl, ui.squareSide, ui.headLevel);
                count("selfRevive");
                playSound("heal");
                updateHeading();
                nextEvent();
            }, selfrevivetime);
        }
    }
    updateHeading();
};


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
        const boss = zones[state.zone.current].boss;
        fight.enemy = boss;
        count("typeBoss_" + boss)
        loadNPC(boss);
        fight.enemyHP = (getRandomInt(state.player.enemyHpRange * 0.75, state.player.enemyHpRange * 1.25)) * fight.bossMultiplier;
        fight.enemyHPbase = Math.round(fight.enemyHP)
        updateHeartNPC()
        fight.enemyName = "<span style='color:DarkRed'><img class='imgInConsole' height='" + ui.em + "' src='img/boss.png'/>" + " " + enemyTypes[boss].name.toUpperCase() + "</span>";
    } else {
        fight.enemy = pickRandomItem(zones[state.zone.current].enemies).toLowerCase();
        count("enemy_" + fight.enemy);
        const number = Math.floor((Math.random() * enemyTypes[fight.enemy].max) + 1);
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
        const raretext = (enemySprites[fight.enemy + number].rare == 1 ? " <b><small>(RARE)</small></b> " : "");
        
        if (fight.enemy == "baba" || fight.enemy == "el_esqueleto" || fight.enemy == "animalejo" || fight.enemy == "polipoide" || fight.enemy == "momia") {
            //avoid name creatures and others
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
    let startBattleText = "has entered in " + (run.previousEvent == "enemy" ? "another" : "a") + " battle!,finds " + (run.previousEvent == "enemy" ? "another" : "an") + " enemy!,start " + (run.previousEvent == "enemy" ? "another" : "a") + " fight!"
    if (fight.bossCombat){
        // v1 overwrote previousEvent before reading it here, so this always said "a Boss"
        const article = (run.previousEvent == "boss" ? "another" : "a")
        startBattleText = "has entered in " + article + " battle with a Boss!,finds " + article + " Boss!,start " + article + " fight with a Boss!"
        run.previousEvent = "boss";
    }else{
        if (fight.enemyAndNumber == "el_mediano14") startBattleText = "shouts: HEY GUY LOOK AT ME!"
        run.previousEvent = "enemy";
    }
    print(wizardName() + " " + pickRandomItem(startBattleText));
    
    startEvent(battle);
};




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
    let startBattleText;
    if (newEncounter){
        count("Hydras");
        count("typeofHydras_" + fight.hydra)
        startBattleText = "has entered in a battle with a hydra!,finds an hydra!,start a fight with a hydra!"
        print(wizardName() + " " + pickRandomItem(startBattleText));
        startEvent(battle);
    } else {
        startBattleText = "sees how another head grows!, sees how the hydra regenerates its heal points"
        print(wizardName() + " " + pickRandomItem(startBattleText));
    }
    
}



//Performs attack
function attackEV() {
    let pjAttackWithCritic, spellId, pjHit, text;
    if (YesOrNot(stat("pPolymorph"), 0) && !fight.hydraCombat && !fight.bossCombat && !fight.polymorphed && fight.enemy !== "baba" && fight.enemy !== "el_elemental" && fight.enemy !== "el_ent" && fight.enemy !== "el_espectro" && fight.enemy !== "el_esqueleto" && fight.enemy !== "el_golem" && fight.enemy !== "el_ojo" && fight.enemy !== "la_esencia"){
        if (document.hasFocus()){loop.every("animPJ", animatePJ, 100)};
        fight.enemyHP = 1;
        updateHeartNPC()
        spell("spellPinBlue_16",false,frameWidth,frameHeight,currentFrame,shift);
        count("school_" + spells.spellPinBlue_16.school)
        fight.polymorphedAnimal = pickRandomItem("gallina,oveja");
        playSound(fight.polymorphedAnimal);
        loadNPC(fight.polymorphedAnimal);
        print(wizardName() + " cast polymorphism!");
        count("Polymorph_" + fight.polymorphedAnimal);
        fight.polymorphed = true;
    } else {
        if (YesOrNot(stat("pAttack"), 0)) {
            //determine the prob of attack, if fail enemy attack
            if (YesOrNot(stat("pCritic"), 0)) {
                if (document.hasFocus()){loop.every("animPJ", animatePJ, 100)};
                //determine if is critical or not
                pjAttackWithCritic = state.player.attack * stat("fCritic") * stat("fAttack");
                pjAttackWithCritic *= config.balance.sacredDamageMultiplier;
                spellId = getSpell();
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
                print(wizardName() + " performs a <b>critic attack!</b>" + " (" + ui.attackIcon + roundNumbertoLetter(state.player.attack * stat("fAttack")) + ") &times; " + Math.round(stat("fCritic")) + " - " + ui.heartIcon + roundNumbertoLetter(fight.enemyHP));
                count("Critics");
            } else {
                if (document.hasFocus()){loop.every("animPJ", animatePJ, 100)};
                //attack with no critic
                pjHit = getRandomInt(state.player.attack * 0.5, state.player.attack) * stat("fAttack");
                pjHit *= config.balance.sacredDamageMultiplier;
                spellId = getSpell();
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
                const spellText = spells[spellId].name.toLowerCase()
                
                if (spells[spellId].school == "Physical"){
                    text = pickRandomItem(" uses the , attacks with the ");
                }else{
                    text = pickRandomItem(" cast , attacks with ");
                }

                print(wizardName() + text + spellText + " (" + ui.attackIcon + roundNumbertoLetter(pjHit) + ") - " + ui.heartIcon + roundNumbertoLetter(fight.enemyHP));
                spell(spellId,false,frameWidth,frameHeight,currentFrame,shift);

                count("Attacks");

            }
            if(pjAttackWithCritic > 500 || pjHit > 500){logro.set(logro.logro_attack500)}
            if(pjAttackWithCritic > 1000 || pjHit > 1000){logro.set(logro.logro_attack1000)}
        } else {
            //enemy attack
            if (document.hasFocus()){loop.every("animNPC", animateNPC, 100)};
            let enemyHit = getRandomInt(state.player.enemyAttackRange * 0.5, state.player.enemyAttackRange * stat("fAttack")) * fight.bossMultiplier;

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
        }
    }
};


//Performs healing
function healEV() {
        count("Heal");
            const healOperation = state.player.hpBase * stat("fHeal");
            let healHit = getRandomInt(healOperation * 0.5,healOperation);
            if (state.player.hp + healHit > state.player.hpBase){
                healHit =  state.player.hpBase - state.player.hp;
                state.player.hp = state.player.hpBase;
            }else{
                state.player.hp = state.player.hp + healHit;
            }
        playSound("heal");
        spell("spellHeal_8",true,frameWidth,frameHeight,currentFrame,shift);
        print(wizardName() + pickRandomItem(" casts heal spell and restore , cast minor healing , use restoration ") + "(" + ui.healIcon + roundNumbertoLetter(healHit) + ")");    
         
        
    
};





//Card combat game
function cardCombat(){

}



//Get a random name
function randomName() {
    let name = pickRandomItem("B,C,D,F,G,H,J,K,L,M,N,P,Q,R,S,T,V,W,X,Y,Z,Sh,Kh,Th,Br,Tr,Mr,Zr,Xh,Sj,Cr,Kr,Yh,A,E,I,O,U");
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

export {
    enemyEV,
    randomName,
};
