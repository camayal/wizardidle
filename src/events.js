// Wizard Idle v2 - What happens on each tick of the master clock: the event picker and every event the wizard can
// stumble into (exploring, inns, shrines, statues, runes and books, loot, offerings, revival).
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { zones } from './data/zones.js';
import { getRandomInt, pickRandomItem, roundNumbertoLetter, YesOrNot } from './utils.js';
import { config, masterTime, MAXSTAGES } from './config.js';
import { count, stat, state } from './state.js';
import { run, ui } from './runtime.js';
import * as loop from './loop.js';
import { enemyEV } from './combat.js';
import { addXP, calculateFe, statObj } from './wizard.js';
import { changeLocality, pickRandomBackgroundForCurrentZone } from './travel.js';
import { afterChapter } from './story.js';
import { logro } from './achievements.js';
import { spell } from './spells.js';
import { playSound } from './audio.js';
import { clearNPC, loadBackground, loadNPC, print, showStage, updateHeading, wizardName } from './ui/render.js';
import { counterText } from './ui/scrolls.js';
import { sixfivefour } from './minigames/sixFiveFour.js';

//define statueobj
const statueObj = {
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
        return `divine</i> and gains some faith (${ui.spiritIcon}${roundNumbertoLetter(run.feGanada)})<i>`;
    },code:"statue_las_Dunas"},
    statue_el_Heidan: {name:"Majestic angel", event:function(){
        statObj.increase(statObj.pBotin.code,2)
        const goldFound = (state.player.lastBattleGold * 7.3)
        state.player.gold = state.player.gold + goldFound;
        updateHeading();
        playSound("coins");
        return `${statObj.pBotin.name}</i> and found some coins (${ui.goldIcon}${roundNumbertoLetter(goldFound)})<i>`;
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






/////////////////////////////////////////////////////////
// ███████╗██╗   ██╗███████╗███╗   ██╗████████╗███████╗//
// ██╔════╝██║   ██║██╔════╝████╗  ██║╚══██╔══╝██╔════╝//
// █████╗  ██║   ██║█████╗  ██╔██╗ ██║   ██║   ███████╗//
// ██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║╚██╗██║   ██║   ╚════██║//
// ███████╗ ╚████╔╝ ███████╗██║ ╚████║   ██║   ███████║//
// ╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝//
///////////////////////////////////////////////////////// 
//Events

// The game moves on two clocks (see loop.js): the "master" clock picks the next event,
// and the "event" clock runs a multi-step event until it hands control back.

// Run fn on the event clock, one step every masterTime.
function startEvent(fn){
    loop.every("event", fn, masterTime);
}

// The current event is over: stop its clock and reset its step counter.
function endEvent(){
    run.multipleEventsCounter = 0;
    loop.stop("event");
}

// Study-like events take up to 5 steps: 1 start, 2-4 try (success jumps to 4), 5 finish.
// Advances the step counter and returns 1, 2 or 5 (or more if the event runs on).
function studyPhase(){
    run.multipleEventsCounter += 1;
    if (run.multipleEventsCounter >= 2 && run.multipleEventsCounter <= 4) return 2;
    return run.multipleEventsCounter;
}

// Hand control back to the event picker.
function nextEvent(){
    loop.every("master", event, masterTime);
}

// The event picker, run by the master clock: forced events first (debug), else one of five at random.
function event() {
    loop.stop("master");
    if(run.pause){return}//detect pause command

    if (run.afterChapterExe){
    afterChapter()//call special events after history
    }

    let masterOption;
    if(state.forceEvent){//force some event for debugging and history
        masterOption = Number(pickRandomItem(state.forceEvent));
    }else{
        masterOption = Math.floor((Math.random() * 5) + 1)
    }
    switch (masterOption) {
    case 1:
        //Get an enemy and start a battle
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

// Explore: maybe loot, maybe a dice house in town, maybe change zone, otherwise walk on.
function exploreEV() {
    //Evalue if booty or not
    let textDice;
    if (YesOrNot(stat("pBotin"), 0)) {
        run.objectToBreak = "";
        print(`${wizardName()} is searching...`);
        startEvent(getBotin);
    //go to dice house, use the same probability
    } else if (YesOrNot(config.balance.pDados, 0) && state.zone.current == "la_Ciudad" || state.zone.current == "el_Poblado"){
        //check if gold is more than 0
        if(state.player.gold > 0){
            //call the game function
            if (run.previousEvent == "sixfivefour"){
                textDice = pickRandomItem("decides to come back to the gaming house, returns to the dice house,wants to spend more coins at the gaming house");
            }else{
                textDice = pickRandomItem("finds a gaming house and enters,wants to play 6-5-4,wants to gamble");
            }
            print(`${wizardName()} ${textDice}`);
            loadBackground(`${state.zone.current}_casadados`);
            loadNPC("jugon");
            run.previousEvent = "sixfivefour"
            startEvent(sixfivefour);       
        }else{
            print(`${wizardName()} finds a gaming house but does not have gold to bet`);
            nextEvent();
        }
    }else {
        if (YesOrNot(stat("pChangeZone") * config.balance.allowChangeZone, 0)) {
            print(`${wizardName()} is exploring...`);
            startEvent(changeLocality);
        } else {
            print(wizardName() + pickRandomItem(" continues exploring the , sees something interesting and continues in the , advances in the ") + zones[state.zone.current].name);
            pickRandomBackgroundForCurrentZone();
            addXP(0.5);
            nextEvent();
            //trigger event selecter
        };
    };
};

// Steps of the mysterious healer who revives the wizard when he has fallen.
function reviveEV(){
    run.multipleEventsCounter += 1;
    switch(run.multipleEventsCounter){
        case 1:
        print(`${wizardName()} wakes up ${pickRandomItem("confused,perplexed,perturbed")}`);
        run.previousEvent = "reviveInCabin"
            break;
        case 2:
            print(`${wizardName()} is treated by a mysterious healer`);
            playSound("heal");
            spell("spellHeal_8",true);
            break;
        case 3:
            spell("spellPinRed_16",false);
            clearNPC();
            state.npc = "";
            print(`${wizardName()} is totally recovered (${ui.healIcon}${roundNumbertoLetter(state.player.hpBase)}) and the mysterious guy is gone`)
            updateHeading();
            break;
        case 4:
        const randomLocality = pickRandomItem("el_Bosque,la_Pradera,el_Poblado,las_Dunas,el_Desierto,el_Pantano")
        state.zone.current = randomLocality;
        state.zone.stage = Math.floor((Math.random() * MAXSTAGES) + 1);
        count("zonesChanged");
        count(`zone_${randomLocality}`);
        showStage();
        print(`${wizardName()} leaves the healer's cabin`)
        count("hospital");
        endEvent();
        run.disablePjBtn = false;
        nextEvent();
    }
};


// Find a shrine: enter and offer gold, or pass by and lose a little faith.
function prayEV(){
    let textCapel;
    if (YesOrNot(stat("pFindCapel"),0)){
        playSound("altar");
        count("altar");
        count(`altar_zone_${state.zone.current}`);
        if (run.previousEvent == "enterAltar"){
            textCapel = pickRandomItem("decides to come back to the shrine, returns to the shrine,wants to spend more time at the temple");
        }else{
            textCapel = pickRandomItem("finds a shrine,sees a shrine,finds a temple");
        }
        print(`${wizardName()} ${textCapel}`);
        loadBackground(`${state.zone.current}_altar`);
        const mistico = `mistico${getRandomInt(1,3)}`;
        loadNPC(mistico);
        if (YesOrNot(stat("pOfrenda"),0) && state.player.gold > 0){
            run.offer = true;
        }else{
            run.offer = false;
        }
        run.previousEvent = "enterAltar"
        startEvent(doOffering);
    }else{
        count("negar");
        if (run.previousEvent == "negar"){
            textCapel = pickRandomItem("finds again the same shrine,sees the same shrine");
        }else{
            textCapel = pickRandomItem("finds a shrine,sees a shrine,finds a temple");
        }
        const faithLost = calculateFe();
        print(`${wizardName()} ${textCapel} but does not enter and continues (${ui.spiritIcon}-${roundNumbertoLetter(faithLost)})`);
        state.player.faith = state.player.faith - faithLost;
        updateHeading();
        run.previousEvent = "negar"
        nextEvent();
    }
}



// Feel tired: look for an inn (or camp), or feel fine and keep going.
function innEV(){
    let textInn;
    if(Math.round(state.player.hp) < Math.round(state.player.hpBase)){
           
           if (run.previousEvent == "innEV"){
            textInn = "wants to rest a little more,still is tired"
           }else{
            textInn = "feels tired,wants to rest,is falling asleep"
           }
           print(`${wizardName()} ${pickRandomItem(textInn)}`) 
           run.previousEvent = "innEV"
           startEvent(searchInn);
    }else{
        const textNoInn = "feels good and continues his journey, continues with his trip, wants to explore a little more,has energies to continue"
        print(`${wizardName()} ${pickRandomItem(textNoInn)}`) 
        run.previousEvent = "innEVFeelsGood"
        nextEvent();
    }
}



// See something: a statue to study (not in every zone), otherwise a rune or a book.
function studyEV() {
     if(YesOrNot(config.balance.pGetStatue, 0) &&  state.zone.current != "el_Poblado" &&  state.zone.current != "la_Cueva"){//found statue, poblado and cueva has not statue
        if(state.zone.current == "el_Pantano" && state.hydraMysteryResolved){//avoid show hidra statue twice, instead find a rune
            print(`${wizardName()} sees something...`) 
            startEvent(findRuneOrBook);
        }else{
            print(`${wizardName()} sees something...`) 
            startEvent(findStatue);
        }
        //examine the estatue

    }else{//found book or rune
    print(`${wizardName()} sees something...`) 
    startEvent(findRuneOrBook);
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

// Steps of studying a statue; success raises a skill (each zone's statue has its own effect).
function findStatue(){
    const optionTemp = studyPhase();
    let learnTxt;
    switch(optionTemp){
        case 1:
        //found and change locality
        loadBackground(`${state.zone.current}_estatua`);
        count(`estatuas_statue_${state.zone.current}`)
        count("statuesFound");
        if (run.previousEvent == "findStatue"){
            print(`${wizardName()} wants to try study the ${statueObj["statue_" + state.zone.current].name} statue again`);
        }else{
            print(`${wizardName()} finds a ${statueObj["statue_" + state.zone.current].name} statue`);
        }
        run.previousEvent = "findStatue"
        break;
        case 2:
        //examine and get or not
        if (YesOrNot(stat("pStudy"),0.15)){//increase the prob a little to avoid never activate 
            count("sucessStudyStatue");
            spell("spellStudyGood_15",true);
            learnTxt = pickRandomItem("finds powerful information in the statue,learns new mystical arts from the statue scripts,feels the power of the statue");
            const result = statueObj[`statue_${state.zone.current}`].event()
        if(result == "hydraMysteryResolved"){
            //play hydra sound
            print(`${wizardName()} hears something but nothing happens`);
        }else{
            playSound("statUp");
            print(`${wizardName()} ${learnTxt}. Increases the <i>${result}</i>`);
        }
            run.multipleEventsCounter = 4;
        }else{
            playSound("studyrune");
            spell("spellStudyTry_16",true);
            learnTxt = pickRandomItem("tries to understand what is written in the statue,reads the glyphs in at the base of the statue,observes the statue,interprets the shape of the figure and the material");
            //fail study try again
            if(run.multipleEventsCounter == 4){
                count("failStudyStatue");
                //last chance of study failed, mod text
                spell("spellStudySleep_15",true);
                learnTxt = pickRandomItem("does not find any pattern,can not understand the glyphs in the statue,does not know the purpose of the statue");
            }
            print(`${wizardName()} ${learnTxt}`) 
        }
        break;
        case 5:
        print(`${wizardName()} leaves the statue and continues`) 
        showStage();
        endEvent();
        addXP(1);
        nextEvent();
    }
}


// Steps of studying a rune or a book; success raises a random skill.
function findRuneOrBook(){
    const placesWithBooks = state.zone.current == "la_Ciudad" || state.zone.current == "el_Poblado" || state.zone.current == "el_Castillo" || state.zone.current == "la_Torre";
    const optionTemp = studyPhase();
    let learnTxt;
    switch(optionTemp){
        case 1:
        const number = getRandomInt(1,10);
        if(placesWithBooks){
            run.objectToStudy = "book";
            loadNPC(`libro${number}`)
        }else{
            run.objectToStudy = "rune";
            loadNPC(`runa${number}`)
        }
        print(`${wizardName()} finds ${run.previousEvent == "findRuneorBook" ? "another " : "a "}${run.objectToStudy}`) 
        count(run.objectToStudy)
        run.previousEvent = "findRuneorBook"
        break;
        case 2:
        if (YesOrNot(stat("pStudy"),0)){
            playSound("statUp");
            count("sucessStudy");
            spell("spellStudyGood_15",true);
            learnTxt = pickRandomItem("finds useful information in the,learns new things from the,feels the power of knowledge of the");
            //exit loop, sucess study
            const statToIncrease = statObj[statObj.random()];
            const learned = statObj.increase(statToIncrease.code);
            print(`${wizardName()} ${learnTxt} ${run.objectToStudy} and increases the <i>${learned}</i>`) 
            count(`study_${statToIncrease.code}`);
            
            run.multipleEventsCounter = 4;
        }else{
            playSound(`study${run.objectToStudy}`);
            spell("spellStudyTry_16",true);
            learnTxt = pickRandomItem("tries to understand what is written in the,reads the glyphs in the,analyzes the information in the,continues reading the");
            //fail study try again
            if(run.multipleEventsCounter == 4){
                count("failStudy");
                //last chance of study failed, mod text
                spell("spellStudySleep_15",true);
                learnTxt = pickRandomItem("does not find any pattern in the,can not understand anything in the,does not understand the language in the");
            }
            print(`${wizardName()} ${learnTxt} ${run.objectToStudy}`) 
        }
        break;
        case 5:
        print(`${wizardName()} leaves the ${run.objectToStudy} and continues`) 
        clearNPC();
        state.npc = "";
        run.objectToStudy = "";
        endEvent();
        addXP(0.25);
        nextEvent();
    }
}



// Steps of resting: pay for an inn when possible, otherwise camp; recover HP.
function searchInn(){
    const placesWithInn = state.zone.current == "la_Ciudad" || state.zone.current == "el_Poblado" || state.zone.current == "el_Desierto"
    run.multipleEventsCounter += 1;
    let rested, textRecover;
    switch(run.multipleEventsCounter){
        case 1:
            if(placesWithInn){
                loadBackground(`${state.zone.current}_taberna`);
                count("taberna");
                count(`taberna_zone_${state.zone.current}`);
                print(`${wizardName()} enters in an inn`) 

            }else{
                loadNPC("sleepingbag");
                const textCamping = "looks for a safe place too rest,hides to rest,falls asleep"
                print(`${wizardName()} ${pickRandomItem(textCamping)}`);
                count("camping");

            }
            break;
        case 2:
            const textSleeps = "sleeps,replenishes energies,rests"
            if(placesWithInn){
                // add event of fight if have not gold
                const innCost = 1 + getRandomInt(state.player.lastBattleGold * 2,state.player.lastBattleGold * 3);
                if ((state.player.gold - innCost) <= 0){
                    //cannot affort
                    playSound("drink");
                    print(`${wizardName()} cannot afford pay a bed, but takes a free drink`);
                    run.restAtInn = false;
                }else{
                    spell("spellSleep_24",true);
                    state.player.gold = state.player.gold - innCost;
                    count("GoldSpendInn",Number(innCost));
                    playSound("coins");
                    print(`${wizardName()} ${pickRandomItem(textSleeps)} (${ui.goldIcon}-${roundNumbertoLetter(innCost)})`) 
                    run.restAtInn = true;
                }
                
            }else{
                spell("spellSleep_24",true);
                print(`${wizardName()} ${pickRandomItem(textSleeps)}`) 
                run.restAtInn = false;
            }
            updateHeading();
            break;
        case 3:
            if(placesWithInn && run.restAtInn){
                rested = state.player.hpBase - state.player.hp
            }
            else{
                rested = (state.player.hpBase - state.player.hp) / getRandomInt(1,5)
            }
            state.player.hp = state.player.hp + rested;
            if ((state.player.hp + rested) >= state.player.hpBase){
                textRecover = "feels totally renewed,feels well rested,has new energies,regained his health"
            }else{
                textRecover = "feels slightly renewed,feels poorly rested,has some energies,regained some health"
            }
            if (Math.round(rested) <= 0){
                textRecover = "couldn't rest well"
            };
            updateHeading();
            clearNPC();
            state.npc = "";
            print(`${wizardName()} ${pickRandomItem(textRecover)} (${ui.healIcon}${roundNumbertoLetter(rested)})`) 
            if(placesWithInn){
                showStage();
            }
            run.restAtInn = false;
            endEvent();
            nextEvent();
    }
}


// Steps at a shrine: pray, and give gold for faith (sometimes a mandatory offering).
function doOffering(){
    
    let optionTemp, textPray;
    if(run.offer){
        run.multipleEventsCounter += 1;
        switch(run.multipleEventsCounter){
            case 1:
                const ofrendaGold = getRandomInt(state.player.gold * 0.1,state.player.gold * 0.5)
                run.feGanada = (ofrendaGold * stat("fOfrenda"));
                run.feGanada *= state.player.faithMultiplier;
                state.player.faith = state.player.faith + run.feGanada;
                state.player.gold = state.player.gold - ofrendaGold;
                count("offers");
                count("GoldOffered", Math.round(ofrendaGold));
                count("FeByGold",Math.round(run.feGanada));
                playSound("coins");
                spell("spellCoins",false);
                const textOffering = pickRandomItem("to revere you,to please you,to exalt you,to adore you,to venerate you,to idolize you,for cherishing you,to honor you");
                print(`${wizardName()} offers ${ui.goldIcon}${roundNumbertoLetter(ofrendaGold)} ${textOffering}`);
                break;
            case 2:
                //animation anks for pj
                spell("spellAnk_8",true);
                print(`${wizardName()} leaves the shrine and continues the journey (${ui.spiritIcon}${roundNumbertoLetter(run.feGanada)})`);
                clearNPC();
                state.npc = "";
                showStage();
                endEvent();
                run.disableCenterBtn = false;
                run.offer = false;
                nextEvent();
        }
    }else{
        optionTemp = studyPhase();
        switch(optionTemp){
            case 1:
                textPray = pickRandomItem(" adore you, prays to you, asks for your advice, praises you, exalts you, asks you for his favor")
                print(wizardName() + textPray)
                break;
            case 2:
                playSound("pray");
                spell("spellAnk_8",true);
                run.feGanada = calculateFe();
                run.feGanada *= state.player.faithMultiplier
                state.player.faith = state.player.faith + run.feGanada;
                count("FeByPray",Math.round(run.feGanada));
                textPray = pickRandomItem(" concentrates on his pray,  asks for his greatness, tries to please you, begs for your help");
                print(wizardName() + textPray + " (" + ui.spiritIcon + roundNumbertoLetter(run.feGanada) + ")")
            break;
            case 5:
                print(`${wizardName()} leaves the shrine and continues`)
                clearNPC();
                state.npc = "";
                showStage();
                run.disableCenterBtn = false;
                run.offer = false;
                endEvent();
                nextEvent();
        }
    }


updateHeading();

}


// Steps of looting a container (bag, chest, barrel, box or pot) for gold.
function getBotin() {
    run.multipleEventsCounter += 1;
    let number, botinTexts;
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
                    number = getRandomInt(1,6);
                    loadNPC(`chest${number}`);
                    break;
                case "pot":
                    number = getRandomInt(1,4);
                    loadNPC(`pot${number}`);
            }
            print(`${wizardName()} sees ${run.previousEvent == "getBotin" ? "another " : "a "}${run.objectToBreak}`);
            break;
        case 2:
        if (run.objectToBreak == "bag"){
            playSound("coins");
            botinTexts = " takes the bag and finds ";
        }else if(run.objectToBreak == "chest"){
            playSound("unlock");
            botinTexts = " opens the chest and finds ";
            spell("spellKey_8",false);
        }else{
            if (run.objectToBreak == "pot"){
                playSound("breakPot");
            }else{
                playSound("breakWood");
            }
            botinTexts = ` breaks the ${run.objectToBreak} and finds `;
            spell("spellPush9",false);
        }
        clearNPC();
        state.npc = "";
        const goldBotin = 1 + getRandomInt(state.player.lastBattleGold, state.player.lastBattleGold * 10);
        print(wizardName() + botinTexts + ui.goldIcon + roundNumbertoLetter(goldBotin));
        count("BotinGot");
        count("GoldFromBotin",goldBotin)
        count(`GoldFromBotin_${run.objectToBreak}`,goldBotin)
        count(`BotinGot_${run.objectToBreak}`);
        state.player.gold = state.player.gold + goldBotin;
        if(Number(counterText("BotinGot_chest")) > 100){logro.set(logro.logro_botines)};
        if(Number(counterText("BotinGot_pot")) > 100){logro.set(logro.logro_pots)};
        run.previousEvent = "getBotin"
        updateHeading();    //Update heading
        endEvent();
        addXP(0.5);
        nextEvent();//trigger event selecter
            
    }
    
   
};

export {
    endEvent,
    event,
    nextEvent,
    startEvent,
    reviveEV,
    statueObj,
};
