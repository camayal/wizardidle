// Wizard Idle v2 - What happens on each tick of the master clock: the event picker and every event the wizard can
// stumble into (exploring, inns, shrines, statues, runes and books, loot, offerings, revival).
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { zones } from './data/zones.js';
import { getRandomInt, pickRandomItem, roundNumbertoLetter, YesOrNot } from './utils.js';
import { config, masterTime, MAXSTAGES } from './config.js';
import { stat, state } from './state.js';
import { stats } from './stats.js';
import { run, ui } from './runtime.js';
import * as loop from './loop.js';
import { enemyEV } from './combat.js';
import { addXP, calculateFe, statObj } from './wizard.js';
import { changeLocality, pickRandomBackgroundForCurrentZone } from './travel.js';
import { afterChapter } from './story.js';
import { logro } from './achievements.js';
import { spell } from './spells.js';
import { playSound } from './audio.js';
import { clearNPC, drawWizard, enterPlace, leavePlace, loadBackground, loadNPC, looksRandom, playWizardAnim, print, showBlink, showStage, sleepInDark, updateHeading, walkThroughScene, walkWizardTo, wizardName } from './ui/render.js';
import { counterText } from './ui/scrolls.js';
import { sixfivefour } from './minigames/sixFiveFour.js';
import { artefactFound } from './bossEffects.js';
import { dreams } from './data/dreams.js';
import { beliefMoment, isAtheist, shrineChance } from './belief.js';

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
    if(run.forceOnce){//dev tools: one forced event (src/dev/tests.js)
        masterOption = run.forceOnce;
        run.forceOnce = undefined;
    }else if(state.forceEvent){//force some event for debugging and history
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
            enterPlace(`${state.zone.current}_casadados`, "jugon");
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
            walkThroughScene(pickRandomBackgroundForCurrentZone, () => {   // walks on to the next spot
                addXP(0.5);
                nextEvent();
            });
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
            print(`${wizardName()} is totally recovered (${ui.healIcon}${roundNumbertoLetter(state.player.hpBase)}) and the mysterious guy is gone`)
            updateHeading();
            break;
        case 4:
        const randomLocality = pickRandomItem("el_Bosque,la_Pradera,el_Poblado,las_Dunas,el_Desierto,el_Pantano")
        state.zone.current = randomLocality;
        state.zone.stage = Math.floor((Math.random() * MAXSTAGES) + 1);
        stats.count("explore.zoneChanges");
        stats.count(`explore.zone.${randomLocality}`);
        print(`${wizardName()} leaves the healer's cabin`)
        stats.count("death.healer");
        endEvent();
        run.disablePjBtn = false;
        leavePlace(showStage, nextEvent);
    }
};


// Find a shrine: enter and offer gold, or pass by and lose a little faith.
function prayEV(){
    let textCapel;
    if (YesOrNot(shrineChance(stat("pFindCapel")),0)){      // by his belief level (an Atheist never enters)
        playSound("altar");
        beliefMoment("prayer");
        stats.count("faith.shrines");
        stats.count(`faith.shrineZone.${state.zone.current}`);
        if (run.previousEvent == "enterAltar"){
            textCapel = pickRandomItem("decides to come back to the shrine, returns to the shrine,wants to spend more time at the temple");
        }else{
            textCapel = pickRandomItem("finds a shrine,sees a shrine,finds a temple");
        }
        print(`${wizardName()} ${textCapel}`);
        const mistico = `mistico${getRandomInt(1,3)}`;
        enterPlace(`${state.zone.current}_altar`, mistico);
        if (YesOrNot(stat("pOfrenda"),0) && state.player.gold > 0){
            run.offer = true;
        }else{
            run.offer = false;
        }
        run.previousEvent = "enterAltar"
        startEvent(doOffering);
    }else{
        stats.count("faith.shrineSkipped");
        if (run.previousEvent == "negar"){
            textCapel = pickRandomItem("finds again the same shrine,sees the same shrine");
        }else{
            textCapel = pickRandomItem("finds a shrine,sees a shrine,finds a temple");
        }
        if (isAtheist()) {          // he doesn't care: no loss of faith or belief
            print(`${wizardName()} ${textCapel} and walks past it without a thought`);
            run.previousEvent = "negar";
            nextEvent();
            return;
        }
        beliefMoment("skippedShrine");
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
// Finds and statues: the wizard walks to them (the author's idea). Scene x in sprite px of the
// 256 x 64 scene; his place is x 32, so walking to x means an offset of x - 32.
const STATUE_X = { el_Bosque: 207, el_Castillo: 128, el_Desierto: 172, el_Duenon: 161, el_Heidan: 195, el_Pantano: 188,
    el_Volcan: 183, la_Ciudad: 148, la_Gruta: 220, la_Mina: 200, la_Pradera: 161, la_Torre: 208, la_Tundra: 212, las_Dunas: 180 };
const CROSS_X = 124;                // shrine crosses stand around the middle of the scene

// A blink appears somewhere on the ground and he walks to it; the find will lie there.
function walkToFind() {
    ui.findSpot = Math.round(80 + looksRandom() * 90);
    showBlink(ui.findSpot);
    walkWizardTo(ui.findSpot - 66);
}

// Where study effects play: right above the find, or over the statue (full size).
function aboveFind() {
    return { x: ui.findSpot + 5 - 16, y: 12 };
}
function overStatue() {
    return { x: (STATUE_X[state.zone.current] || 190) - 16, y: 10 };
}
// Another spot of the same zone, for the looks only: in a simulation nothing changes, so a
// seeded run plays the same (the stage only decides the background and the map marker).
function newStage() {
    if (!run.simulation) state.zone.stage = 1 + Math.floor(looksRandom() * MAXSTAGES);
    showStage();
}

// Prayer effects appear here and there around the shrine's cross.
function aroundCross() {
    return { x: CROSS_X - 16 + Math.round((looksRandom() - 0.5) * 70), y: Math.round(looksRandom() * 26) };
}

function studyEV() {
     if(YesOrNot(config.balance.pGetStatue, 0) &&  state.zone.current != "el_Poblado" &&  state.zone.current != "la_Cueva"){//found statue, poblado and cueva has not statue
        if(state.zone.current == "el_Pantano" && state.hydraMysteryResolved){//avoid show hidra statue twice, instead find a rune
            print(`${wizardName()} sees something...`)
            walkToFind();
            startEvent(findRuneOrBook);
        }else{
            print(`${wizardName()} sees something...`)
            startEvent(findStatue);
        }
        //examine the estatue

    }else{//found book or rune
    print(`${wizardName()} sees something...`)
    walkToFind();
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
        enterPlace(`${state.zone.current}_estatua`, null, () => walkWizardTo((STATUE_X[state.zone.current] || 190) - 88));
        stats.count(`explore.statue.statue_${state.zone.current}`)
        stats.count("explore.statues");
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
            stats.count("study.statueSuccess");
            spell("spellStudyGood_15",true,0,0,overStatue());
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
            spell("spellStudyTry_16",true,0,0,overStatue());
            learnTxt = pickRandomItem("tries to understand what is written in the statue,reads the glyphs in at the base of the statue,observes the statue,interprets the shape of the figure and the material");
            //fail study try again
            if(run.multipleEventsCounter == 4){
                stats.count("study.statueFail");
                //last chance of study failed, mod text
                spell("spellStudySleep_15",true,0,0,overStatue());
                learnTxt = pickRandomItem("does not find any pattern,can not understand the glyphs in the statue,does not know the purpose of the statue");
            }
            print(`${wizardName()} ${learnTxt}`) 
        }
        break;
        case 5:
        print(`${wizardName()} leaves the statue and continues`)
        endEvent();
        addXP(1);
        walkThroughScene(newStage, nextEvent);  // walks on out of the scene, into the next one
    }
}


// Steps of studying a rune or a book; success raises a random skill.
function findRuneOrBook(){
    const placesWithBooks = state.zone.current == "la_Ciudad" || state.zone.current == "el_Poblado" || state.zone.current == "el_Castillo" || state.zone.current == "la_Torre";
    const optionTemp = studyPhase();
    let learnTxt;
    switch(optionTemp){
        case 1:
        if (artefactFound()) {      // the rare artefact against Medusa's gaze (src/bossEffects.js)
            // which of the two (the looks only): a mirror shield or a gorgon's-eye amulet
            const [sprite, name] = looksRandom() < 0.5 ? ["item_mirrorshield", "mirror shield"] : ["item_gorgoneye", "gorgon's-eye amulet"];
            run.objectToStudy = "artefact";
            run.artefactName = name;
            loadNPC(sprite);
            print(`${wizardName()} finds a ${name}! Medusa's gaze will never turn him to stone again`);
            run.multipleEventsCounter = 4;
            break;
        }
        const number = getRandomInt(1,10);
        if(placesWithBooks){
            run.objectToStudy = "book";
            loadNPC(`libro${number}`)
        }else{
            run.objectToStudy = "rune";
            loadNPC(`runa${number}`)
        }
        print(`${wizardName()} finds ${run.previousEvent == "findRuneorBook" ? "another " : "a "}${run.objectToStudy}`) 
        stats.count(`study.found.${run.objectToStudy}`)
        run.previousEvent = "findRuneorBook"
        break;
        case 2:
        if (YesOrNot(stat("pStudy"),0)){
            playSound("statUp");
            stats.count("study.success");
            spell("spellStudyGood_15",true,0,0,aboveFind());
            learnTxt = pickRandomItem("finds useful information in the,learns new things from the,feels the power of knowledge of the");
            //exit loop, sucess study
            const statToIncrease = statObj[statObj.random()];
            const learned = statObj.increase(statToIncrease.code);
            print(`${wizardName()} ${learnTxt} ${run.objectToStudy} and increases the <i>${learned}</i>`) 
            stats.count(`study.skill.${statToIncrease.code}`);
            
            run.multipleEventsCounter = 4;
        }else{
            playSound(`study${run.objectToStudy}`);
            spell("spellStudyTry_16",true,0,0,aboveFind());
            learnTxt = pickRandomItem("tries to understand what is written in the,reads the glyphs in the,analyzes the information in the,continues reading the");
            //fail study try again
            if(run.multipleEventsCounter == 4){
                stats.count("study.fail");
                //last chance of study failed, mod text
                spell("spellStudySleep_15",true,0,0,aboveFind());
                learnTxt = pickRandomItem("does not find any pattern in the,can not understand anything in the,does not understand the language in the");
            }
            print(`${wizardName()} ${learnTxt} ${run.objectToStudy}`) 
        }
        break;
        case 5:
        print(run.objectToStudy == "artefact" ? `${wizardName()} takes the ${run.artefactName} and continues` : `${wizardName()} leaves the ${run.objectToStudy} and continues`)  
        clearNPC();
        run.objectToStudy = "";
        ui.findSpot = null;
        endEvent();
        addXP(0.25);
        walkThroughScene(newStage, nextEvent);  // walks on out of the scene, into the next one
    }
}



// Steps of resting: arrive (inn in some towns, otherwise camp), sleep, wake up.
function searchInn(){
    const placesWithInn = state.zone.current == "la_Ciudad" || state.zone.current == "el_Poblado" || state.zone.current == "el_Desierto";
    run.multipleEventsCounter += 1;
    switch (run.multipleEventsCounter) {
        case 1: arriveToRest(placesWithInn); break;
        case 2: sleep(placesWithInn); break;
        case 3: wakeUp(placesWithInn);
    }
}

// Enter an inn, or find a place to camp.
function arriveToRest(placesWithInn) {
    if (placesWithInn) {
        enterPlace(`${state.zone.current}_taberna`);
        stats.count("inn.rests");
        stats.count(`inn.zone.${state.zone.current}`);
        print(`${wizardName()} enters in an inn`);
    } else {
        loadNPC("sleepingbag");
        const textCamping = "looks for a safe place too rest,hides to rest,falls asleep";
        print(`${wizardName()} ${pickRandomItem(textCamping)}`);
        stats.count("inn.campings");
    }
}

// Where he sleeps (docs/SLEEP.md), as the centre of his sprite in scene px (256 x 64). STAND-INS
// until the artist draws beds in the inns: the Town inn's door to the rooms, a free spot in the
// City inn, the Desert inn's carpet; camping, next to the sleeping bag (drawn at x 192).
const BED_X = { el_Poblado: 107, la_Ciudad: 150, el_Desierto: 155 };
const BAG_X = 176;

// A dream for tonight, or none: a story dream on the first rest after a fall or a chapter,
// otherwise now and then a random dream (more for believers) or nightmare (more for doubters).
// Looks only: picked with looksRandom, never the game's Math.random, and only when it is shown.
function pickDream() {
    const pick = (list) => list[Math.floor(looksRandom() * list.length)];
    if (run.storyDream) {
        const kind = run.storyDream;
        run.storyDream = "";
        stats.count("dream.story");
        return { lines: pick(dreams[kind]), nightmare: kind == "fall" };
    }
    if (looksRandom() >= config.balance.dreamChance) return null;
    const nightmare = looksRandom() < (state.player.faith > 0 ? 0.25 : 0.75);
    stats.count(nightmare ? "nightmare.random" : "dream.random");
    return { lines: pick(dreams[nightmare ? "nightmare" : "dream"]), nightmare };
}

// He walks to his bed or sleeping bag, the sleep spell, the dark (with tonight's dream, kept in
// the console too). Without drawing (simulation, page in the background) none of it plays.
function goToBed(placesWithInn) {
    stats.count(placesWithInn ? "sleep.inn" : "sleep.camping");
    if (run.simulation || !document.hasFocus()) return spell("spellSleep_24", true);
    const dream = pickDream();
    walkWizardTo((placesWithInn ? BED_X[state.zone.current] || 150 : BAG_X) - 48, () => {
        spell("spellSleep_24", true);
        if (dream) print(`<i>${wizardName()} dreams: ${dream.lines.join(" ")}</i>`);
        sleepInDark(dream);
    });
}

// Pay for a bed if he can (a full rest), otherwise sleep for free (a partial rest).
function sleep(placesWithInn) {
    const textSleeps = "sleeps,replenishes energies,rests";
    if (placesWithInn) {
        const innCost = 1 + getRandomInt(state.player.lastBattleGold * 2, state.player.lastBattleGold * 3);
        if ((state.player.gold - innCost) <= 0) {
            playSound("drink");
            print(`${wizardName()} cannot afford pay a bed, but takes a free drink`);
            run.restAtInn = false;
        } else {
            goToBed(true);
            state.player.gold = state.player.gold - innCost;
            stats.add("gold.spentAtInns", Number(innCost));
            playSound("coins");
            print(`${wizardName()} ${pickRandomItem(textSleeps)} (${ui.goldIcon}-${roundNumbertoLetter(innCost)})`);
            run.restAtInn = true;
        }
    } else {
        goToBed(false);
        print(`${wizardName()} ${pickRandomItem(textSleeps)}`);
        run.restAtInn = false;
    }
    updateHeading();
}

// Recover HP (all of it after a paid bed) and go back to the road.
function wakeUp(placesWithInn) {
    let rested, textRecover;
    if (placesWithInn && run.restAtInn) {
        rested = state.player.hpBase - state.player.hp;
    } else {
        rested = (state.player.hpBase - state.player.hp) / getRandomInt(1, 5);
    }
    state.player.hp = state.player.hp + rested;
    // v1 adds `rested` a second time here, so "totally renewed" also shows after a partial rest
    if ((state.player.hp + rested) >= state.player.hpBase) {
        textRecover = "feels totally renewed,feels well rested,has new energies,regained his health";
    } else {
        textRecover = "feels slightly renewed,feels poorly rested,has some energies,regained some health";
    }
    if (Math.round(rested) <= 0) {
        textRecover = "couldn't rest well";
    }
    updateHeading();
    clearNPC();
    print(`${wizardName()} ${pickRandomItem(textRecover)} (${ui.healIcon}${roundNumbertoLetter(rested)})`);
    run.restAtInn = false;
    endEvent();
    if (placesWithInn) leavePlace(showStage, nextEvent);    // out through the door
    else walkWizardTo(0, nextEvent);                       // back from the sleeping bag
}


// Steps at a shrine: an offering (asked for with the scene touch, or required by the god)
// turns gold into faith; otherwise the wizard prays for a few steps.
function doOffering(){
    if (run.offer) {
        run.multipleEventsCounter += 1;
        switch (run.multipleEventsCounter) {
            case 1: giveOffering(); break;
            case 2:
                spell("spellAnk_8", true, 0, 0, aroundCross());
                print(`${wizardName()} leaves the shrine and continues the journey (${ui.spiritIcon}${roundNumbertoLetter(run.feGanada)})`);
                leaveShrine();
        }
    } else {
        switch (studyPhase()) {
            case 1:
                print(wizardName() + pickRandomItem(" adore you, prays to you, asks for your advice, praises you, exalts you, asks you for his favor"));
                break;
            case 2: pray(); break;
            case 5:
                print(`${wizardName()} leaves the shrine and continues`);
                leaveShrine();
        }
    }
    updateHeading();
}

// Give 10-50% of his gold; faith grows with generosity and the faith multiplier.
function giveOffering() {
    const ofrendaGold = getRandomInt(state.player.gold * 0.1, state.player.gold * 0.5);
    run.feGanada = (ofrendaGold * stat("fOfrenda"));
    run.feGanada *= state.player.faithMultiplier;
    state.player.faith = state.player.faith + run.feGanada;
    state.player.gold = state.player.gold - ofrendaGold;
    stats.count("faith.offerings");
    stats.add("gold.offered", Math.round(ofrendaGold));
    stats.add("faith.gain.offering", Math.round(run.feGanada));
    playSound("coins");
    spell("spellCoins", false);
    const textOffering = pickRandomItem("to revere you,to please you,to exalt you,to adore you,to venerate you,to idolize you,for cherishing you,to honor you");
    print(`${wizardName()} offers ${ui.goldIcon}${roundNumbertoLetter(ofrendaGold)} ${textOffering}`);
}

// One prayer: gain some faith.
function pray() {
    playSound("pray");
    playWizardAnim("pray");     // kneels and keeps praying until he leaves the shrine
    spell("spellAnk_8", true, 0, 0, aroundCross());
    run.feGanada = calculateFe();
    run.feGanada *= state.player.faithMultiplier;
    state.player.faith = state.player.faith + run.feGanada;
    stats.add("faith.gain.prayer", Math.round(run.feGanada));
    const textPray = pickRandomItem(" concentrates on his pray,  asks for his greatness, tries to please you, begs for your help");
    print(wizardName() + textPray + " (" + ui.spiritIcon + roundNumbertoLetter(run.feGanada) + ")");
}

// Leave the shrine and go back to the road.
function leaveShrine() {
    drawWizard();               // stands up again
    clearNPC();
    endEvent();
    run.disableCenterBtn = false;
    run.offer = false;
    walkThroughScene(newStage, nextEvent);  // walks on out of the scene, into the next one
}


// Steps of looting: see a container (bag, barrel, box, chest or pot), then open it for gold.
function getBotin() {
    run.multipleEventsCounter += 1;
    switch (run.multipleEventsCounter) {
        case 1: showLoot(); break;
        case 2: openLoot();
    }
}

// Pick and draw a container (chests and pots have several sprites).
function showLoot() {
    run.objectToBreak = pickRandomItem("bag,barrel,box,chest,pot");
    if (run.objectToBreak == "chest") {
        loadNPC(`chest${getRandomInt(1, 6)}`);
    } else if (run.objectToBreak == "pot") {
        loadNPC(`pot${getRandomInt(1, 4)}`);
    } else {
        loadNPC(run.objectToBreak);
    }
    print(`${wizardName()} sees ${run.previousEvent == "getBotin" ? "another " : "a "}${run.objectToBreak}`);
}

// Open (or break) the container, take the gold and go back to the road.
function openLoot() {
    let botinTexts;
    if (run.objectToBreak == "bag") {
        playSound("coins");
        botinTexts = " takes the bag and finds ";
    } else if (run.objectToBreak == "chest") {
        playSound("unlock");
        botinTexts = " opens the chest and finds ";
        spell("spellKey_8", false);
    } else {
        playSound(run.objectToBreak == "pot" ? "breakPot" : "breakWood");
        botinTexts = ` breaks the ${run.objectToBreak} and finds `;
        spell("spellPush9", false);
    }
    clearNPC();
    const goldBotin = 1 + getRandomInt(state.player.lastBattleGold, state.player.lastBattleGold * 10);
    print(wizardName() + botinTexts + ui.goldIcon + roundNumbertoLetter(goldBotin));
    stats.count("loot.containers");
    stats.add("gold.fromLoot", goldBotin);
    stats.add(`gold.loot.${run.objectToBreak}`, goldBotin);
    stats.count(`loot.container.${run.objectToBreak}`);
    state.player.gold = state.player.gold + goldBotin;
    if (Number(counterText("loot.container.chest")) > 100) logro.set(logro.logro_botines);
    if (Number(counterText("loot.container.pot")) > 100) logro.set(logro.logro_pots);
    run.previousEvent = "getBotin";
    updateHeading();
    endEvent();
    addXP(0.5);
    nextEvent();
}

export {
    endEvent,
    event,
    nextEvent,
    startEvent,
    reviveEV,
    statueObj,
};
