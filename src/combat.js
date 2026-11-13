// Wizard Idle v2 - Battles: choosing the enemy (normal, boss or hydra), each round of a fight, the wizard's attacks and
// heals, polymorph, and the random names enemies get.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { enemySprites, enemyTypes } from './data/enemies.js';
import { zones } from './data/zones.js';
import { npcSpells, spells } from './data/spells.js';
import { capitalize, getRandomInt, pickRandomItem, roundNumbertoLetter, YesOrNot } from './utils.js';
import { config, RAREMULTIPLIER, selfrevivetime } from './config.js';
import { stat, state } from './state.js';
import { stats } from './stats.js';
import { fight, run, ui } from './runtime.js';
import * as loop from './loop.js';
import { endEvent, event, nextEvent, startEvent } from './events.js';
import { addGold, addXP, calculateFe } from './wizard.js';
import { logro } from './achievements.js';
import { getSpell, spell } from './spells.js';
import { playSound } from './audio.js';
import { animateNPC, animatePJ, clearNPC, drawWizard, loadAlterCanvasChar, loadNPC, npcCanvas, pjCanvas, print, updateHeading, updateHeartNPC, wizardName } from './ui/render.js';



// One step of the current fight, run by the event clock. The first step announces the
// fight; every later step the wizard heals or attacks, then the fight may end.
function battle() {
    run.multipleEventsCounter += 1;
    if (run.multipleEventsCounter == 1) {
        announceBattle();
    } else {
        if (YesOrNot(stat("pHeal"), 0) && state.player.hp < state.player.hpBase) {
            healEV();
        } else {
            attackEV();
        }
        if (Math.round(fight.enemyHP) <= 0) enemyFalls();
        if (Math.round(state.player.hp) <= 0) wizardFalls();
    }
    updateHeading();
}

// First message of a fight.
function announceBattle() {
    const hp = ` (${ui.heartIcon}${roundNumbertoLetter(fight.enemyHP)})`;
    if (fight.bossCombat) {
        print(`${fight.enemyName} releases the power and attack!${hp}`);
    } else if (fight.hydraCombat) {
        print(`${fight.enemyName} releases all its fury and attack with brutality!${hp}`);
    } else {
        print(fight.enemyName + pickRandomItem(" goes back, is scared, rammed, shouts, defends himself") + hp);
    }
}

// The enemy reached 0 HP: a hydra grows another head (up to the zone's maximum), anything
// else is defeated.
function enemyFalls() {
    if (fight.hydraCombat && (state.hydraHeads[fight.hydra] + 1) <= Number(zones[state.zone.current].headsMax)) {
        state.hydraHeads[fight.hydra] = state.hydraHeads[fight.hydra] + 1;
        stats.count("kill.hydraHeads");
        getHydra();
    } else {
        defeatEnemy();
    }
}

// The fight is won: counters and achievements, faith, loot and XP, then back to the road.
function defeatEnemy() {
    endEvent();
    if (fight.enemy == "el_capricor") {
        logro.set(logro.logro_ultimocapricor);
        zones.el_Bosque.enemies = "el_Elfo,Animalejo,el_Ent,el_Herbo,la_Amazona";
    }
    fight.polymorphed = false;
    if (fight.bossCombat) {
        stats.count("kill.bosses", 1, { world: true });
        stats.count(`kill.boss.${fight.enemy}`);
        stats.first("first.bossKill");
        logro.set(logro.logro_primerbossderrotado);
    } else if (fight.hydraCombat) {
        stats.count("kill.hydras", 1, { world: true });
        stats.count(`kill.hydra.${fight.hydra}`);
        stats.first("first.hydraKill");
        delete state.hydraHeads[fight.hydra];
    } else if (enemySprites[fight.enemyAndNumber].rare) {
        stats.count("kill.rare", 1, { world: true });
        stats.count(`kill.sprite.${fight.enemyAndNumber}`);
        stats.first("first.rareKill");
    } else {
        stats.count("kill.enemies", 1, { world: true });
        stats.count(`kill.sprite.${fight.enemyAndNumber}`);
    }
    stats.count("combat.combo");
    updateLongestCombo();
    clearNPC();

    // faith: cleansing a corrupted enemy gains faith; while in sin every kill costs faith
    let faithText;
    if (!fight.bossCombat && !fight.hydraCombat) {
        if (enemySprites[fight.enemyAndNumber].corrupted && !state.player.inSin) {
            run.feGanada = calculateFe() * 5;
            run.feGanada *= state.player.faithMultiplier;
            state.player.faith = state.player.faith + run.feGanada;
            stats.add("faith.gain.cleanse", Math.round(run.feGanada));
            faithText = `, also gained ${ui.spiritIcon} ${roundNumbertoLetter(run.feGanada)} by corruption eradication`;
        } else {
            faithText = "";
        }
    }
    if (state.player.inSin) {
        const faithLost = calculateFe();
        state.player.faith = state.player.faith - faithLost;
        faithText = `, and reduce the faith ${ui.spiritIcon} -${roundNumbertoLetter(faithLost)}`;
    }

    victoryRewards(faithText);
    clearFight();
    nextEvent();
}

// Gold (if the enemy carries any) and XP for a won fight, with the victory message.
function victoryRewards(faithText) {
    if (enemyTypes[fight.enemy].hasgold) {
        playSound("coins");
        addGold();
        if (fight.bossCombat) {
            addXP(4);
            print(`${fight.enemyName} was defeated and a big loot has been found ${ui.goldIcon}${roundNumbertoLetter(state.player.lastBattleGold * fight.bossGoldMultiplier)}`);
        } else if (fight.hydraCombat) {
            addXP(Number(zones[state.zone.current].hidrasXPMultiplier));
            print(`${fight.enemyName} was defeated and a treasure has been found ${ui.goldIcon}${roundNumbertoLetter(state.player.lastBattleGold * 15)}`);
        } else {
            addXP(enemySprites[fight.enemyAndNumber].rare ? RAREMULTIPLIER : 1.5);
            print(`${fight.enemyName} was defeated and looted ${ui.goldIcon}${roundNumbertoLetter(state.player.lastBattleGold)}${faithText}`);
        }
    } else if (fight.bossCombat) {
        addXP(4);
        print(`${fight.enemyName} was defeated`);
    } else if (fight.hydraCombat) {
        addXP(Number(zones[state.zone.current].hidrasXPMultiplier));
        print(`${fight.enemyName} was defeated`);
    } else {
        addXP(enemySprites[fight.enemyAndNumber].rare ? RAREMULTIPLIER : 1.5);
        print(`${fight.enemyName} was defeated${faithText}`);
    }
}

// The wizard reached 0 HP: achievements, combo reset, maybe lose gold, then wait for a
// divine touch or the self-revive.
function wizardFalls() {
    endEvent();
    // If the enemy fell in this same round, its death above already restarted the
    // event picker: stop it until the wizard is revived.
    loop.stop("master");
    if (fight.polymorphed) {
        if (fight.polymorphedAnimal == "gallina") logro.set(logro.logro_killedbychicken);
        if (fight.polymorphedAnimal == "oveja") logro.set(logro.logro_killedbysheep);
    }
    if (fight.bossCombat) logro.set(logro.logro_primeraderrotaporboss);
    fight.polymorphed = false;
    updateLongestCombo();
    stats.reset("combat.combo");
    stats.count("death.falls", 1, { world: true });
    stats.first("first.fall");
    playSound(`hurt${getRandomInt(1, 6)}`);
    fight.pjDead = true;
    loadAlterCanvasChar("muerto", ui.squareSide, ui.headLevel);
    let lootedText = "";
    // v1 crashed here ("acá hay un BUG") when the enemy had fallen in the same round:
    // fight.enemy was already empty. A fallen enemy can't take the wizard's gold.
    if (state.player.gold > 0 && fight.enemy && enemyTypes[fight.enemy].hasgold) {
        const goldLooted = getRandomInt(state.player.lastBattleGold, state.player.lastBattleGold * 2);
        state.player.gold = state.player.gold - goldLooted;
        lootedText = ` and loses some gold (${ui.goldIcon}-${roundNumbertoLetter(goldLooted)})`;
        stats.add("gold.lostInBattle", goldLooted);
    }
    print(`${wizardName()} has fallen in battle${lootedText}`);
    npcCanvas.getContext("2d").clearRect(0, 0, pjCanvas.width, pjCanvas.height);
    clearFight();
    scheduleSelfRevive();
}

// If nobody revives him, the wizard gets up by himself after selfrevivetime, losing faith.
function scheduleSelfRevive() {
    // a loop clock that runs once (v1: a setTimeout), so the simulation's clock drives it too
    fight.autorevive = true;
    loop.every("selfRevive", function () {
        loop.stop("selfRevive");
        run.previousEvent = "autorevive";
        fight.autorevive = "";
        const faithLost = state.player.hpBase * 1.2454654;
        state.player.faith = state.player.faith - faithLost;
        print(`${wizardName()} recovers himself but feels abandoned by his god (${ui.spiritIcon}-${roundNumbertoLetter(faithLost)})`);
        fight.pjDead = false;
        drawWizard();
        stats.count("death.selfRevive");
        playSound("heal");
        updateHeading();
        nextEvent();
    }, selfrevivetime);
}

// Keep the longest streak of fights won in a row.
function updateLongestCombo() {
    stats.max("combat.longestCombo", stats.get("combat.combo"));
}

// Forget the enemy once a fight is over (won or lost).
function clearFight() {
    fight.enemy = "";
    fight.enemyAndNumber = "";
    state.npc = "";
    fight.bossMultiplier = 1;
    fight.bossGoldMultiplier = 1;
}


// Start a fight: a hydra (where the hydra mystery is solved), otherwise a normal enemy or a boss.
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


// Creatures that get no personal name ("A slime", not "Zubruwi the slime").
const NAMELESS = ["baba", "el_esqueleto", "animalejo", "polipoide", "momia"];

// Pick the opponent for the current zone (sometimes the zone boss), draw it, name it and start the battle.
function getEnemy() {
    fight.bossCombat = false;
    fight.hydraCombat = false;
    if (YesOrNot(config.balance.pGetBoss, 0)) {
        setUpBoss();
    } else {
        setUpEnemy();
    }
    let startBattleText = `has entered in ${run.previousEvent == "enemy" ? "another" : "a"} battle!,finds ${run.previousEvent == "enemy" ? "another" : "an"} enemy!,start ${run.previousEvent == "enemy" ? "another" : "a"} fight!`;
    if (fight.bossCombat) {
        // v1 overwrote previousEvent before reading it here, so this always said "a Boss"
        const article = (run.previousEvent == "boss" ? "another" : "a");
        startBattleText = `has entered in ${article} battle with a Boss!,finds ${article} Boss!,start ${article} fight with a Boss!`;
        run.previousEvent = "boss";
    } else {
        if (fight.enemyAndNumber == "el_mediano14") startBattleText = "shouts: HEY GUY LOOK AT ME!";
        run.previousEvent = "enemy";
    }
    print(`${wizardName()} ${pickRandomItem(startBattleText)}`);
    startEvent(battle);
}

// The zone boss: 2.5x HP, 5x gold.
function setUpBoss() {
    playSound("boss");
    stats.count("combat.bosses");
    fight.bossCombat = true;
    fight.bossMultiplier = 2.5;
    fight.bossGoldMultiplier = 5;
    const boss = zones[state.zone.current].boss;
    fight.enemy = boss;
    stats.count(`combat.boss.${boss}`);
    loadNPC(boss);
    fight.enemyHP = (getRandomInt(state.player.enemyHpRange * 0.75, state.player.enemyHpRange * 1.25)) * fight.bossMultiplier;
    fight.enemyHPbase = Math.round(fight.enemyHP);
    updateHeartNPC();
    fight.enemyName = `<span style='color:DarkRed'><img class='imgInConsole' height='${ui.em}' src='img/boss.png'/> ${enemyTypes[boss].name.toUpperCase()}</span>`;
}

// A normal enemy of the zone: one of its family's sprites, with the spell of its type.
function setUpEnemy() {
    const forced = run.forceEnemy;    // dev tools can ask for one sprite (src/dev/tests.js)
    run.forceEnemy = undefined;
    fight.enemy = forced ? forced.replace(/\d+$/, "") : pickRandomItem(zones[state.zone.current].enemies).toLowerCase();
    stats.count(`combat.enemy.${fight.enemy}`);
    const number = forced ? Number(forced.match(/\d+$/)[0]) : Math.floor((Math.random() * enemyTypes[fight.enemy].max) + 1);
    fight.spellEnemy = pickRandomItem(npcSpells[enemySprites[fight.enemy + number].type]);
    fight.enemyAndNumber = fight.enemy + number;
    stats.count(enemySprites[fight.enemyAndNumber].rare ? "combat.rareEncounters" : "combat.encounters");
    loadNPC(fight.enemy + number);
    fight.enemyHP = (getRandomInt(state.player.enemyHpRange * 0.75, state.player.enemyHpRange * 1.25));
    fight.enemyHPbase = Math.round(fight.enemyHP);
    updateHeartNPC();
    fight.enemyName = enemyDisplayName(enemySprites[fight.enemyAndNumber]);
}

// "A slime", "The Capricor", or a random name plus the sprite's own name; rare ones are marked.
function enemyDisplayName(sprite) {
    const raretext = (sprite.rare ? " <b><small>(RARE)</small></b> " : "");
    if (NAMELESS.includes(fight.enemy)) return `A ${sprite.altName}${raretext}`;
    if (fight.enemy == "el_capricor") return `The ${capitalize(enemyTypes[fight.enemy].name)}${raretext}`;
    if (sprite.altName) return `<i>${randomName()}</i> the ${capitalize(sprite.altName)}${raretext}`;
    return `<i>${randomName()}</i> the ${capitalize(enemyTypes[fight.enemy].name)}${raretext}`;
}




// Start a hydra fight, or regrow a head (newEncounter false) after one was cut off.
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
    fight.enemyName = `<span style='color:DarkGreen'><img class='imgInConsole' height='${ui.em}' src='img/boss.png'/> ${fight.hydra.toUpperCase()}</span>`;
    let startBattleText;
    if (newEncounter){
        stats.count("combat.hydras");
        stats.count(`combat.hydra.${fight.hydra}`)
        startBattleText = "has entered in a battle with a hydra!,finds a hydra!,start a fight with a hydra!"
        print(`${wizardName()} ${pickRandomItem(startBattleText)}`);
        startEvent(battle);
    } else {
        startBattleText = "sees how another head grows!, sees how the hydra regenerates its health points"
        print(`${wizardName()} ${pickRandomItem(startBattleText)}`);
    }
    
}



// Enemies that can't be turned into a sheep or a chicken.
const POLYMORPH_IMMUNE = ["baba", "el_elemental", "el_ent", "el_espectro", "el_esqueleto", "el_golem", "el_ojo", "la_esencia"];

// The divine spells hit four times harder.
function isDivineSpell(spellId) {
    return spellId == "spellChispasMulti_12" || spellId == "spellRainMultiColor_24" || spellId == "spellColorSpin_16";
}

// Make the wizard hop, only while the page has focus (never in a simulation).
function hopWizard() {
    if (document.hasFocus() && !run.simulation) loop.every("animPJ", animatePJ, 100);
}

// Make the enemy hop, only while the page has focus (never in a simulation).
function hopEnemy() {
    if (document.hasFocus() && !run.simulation) loop.every("animNPC", animateNPC, 100);
}

// Take damage off the enemy, never below 0.
function damageEnemy(damage) {
    stats.max("combat.biggestHit", Math.round(damage));
    if (fight.enemyHP - damage < 0) {
        fight.enemyHP = 0;
    } else {
        fight.enemyHP = Math.round(fight.enemyHP) - Math.round(damage);
    }
    updateHeartNPC();
}

// One exchange: the wizard may polymorph the enemy, or attacks (maybe a critic); if his
// attack roll fails, the enemy hits him instead.
function attackEV() {
    const canPolymorph = !fight.hydraCombat && !fight.bossCombat && !fight.polymorphed && !POLYMORPH_IMMUNE.includes(fight.enemy);
    if (YesOrNot(stat("pPolymorph"), 0) && canPolymorph) {
        castPolymorph();
    } else if (YesOrNot(stat("pAttack"), 0)) {
        const damage = YesOrNot(stat("pCritic"), 0) ? criticAttack() : normalAttack();
        if (damage > 500) logro.set(logro.logro_attack500);
        if (damage > 1000) logro.set(logro.logro_attack1000);
    } else {
        enemyAttack();
    }
}

// Turn the enemy into a sheep or a chicken with 1 HP.
function castPolymorph() {
    hopWizard();
    fight.enemyHP = 1;
    updateHeartNPC();
    spell("spellPinBlue_16", false);
    stats.count(`spell.school.${spells.spellPinBlue_16.school}`);
    fight.polymorphedAnimal = pickRandomItem("gallina,oveja");
    playSound(fight.polymorphedAnimal);
    loadNPC(fight.polymorphedAnimal);
    print(`${wizardName()} cast polymorphism!`);
    stats.count(`spell.polymorph.${fight.polymorphedAnimal}`);
    fight.polymorphed = true;
}

// A critic: full attack x critic multiplier x mastery. Returns the damage.
function criticAttack() {
    hopWizard();
    let damage = state.player.attack * stat("fCritic") * stat("fAttack");
    damage *= config.balance.sacredDamageMultiplier;
    const spellId = getSpell();
    if (isDivineSpell(spellId)) damage = damage * 4;
    damageEnemy(damage);
    stats.count(`spell.school.${spells[spellId].school}`);
    spell(spellId, false, true);
    print(`${wizardName()} performs a <b>critic attack!</b> (${ui.attackIcon}${roundNumbertoLetter(state.player.attack * stat("fAttack"))}) &times; ${Math.round(stat("fCritic"))} - ${ui.heartIcon}${roundNumbertoLetter(fight.enemyHP)}`);
    stats.count("combat.critics");
    return damage;
}

// A normal attack: 50-100% of the attack x mastery, with a spell or the staff. Returns the damage.
function normalAttack() {
    hopWizard();
    let damage = getRandomInt(state.player.attack * 0.5, state.player.attack) * stat("fAttack");
    damage *= config.balance.sacredDamageMultiplier;
    const spellId = getSpell();
    if (isDivineSpell(spellId)) damage *= 4;
    damageEnemy(damage);
    stats.count(`spell.school.${spells[spellId].school}`);
    const spellText = spells[spellId].name.toLowerCase();
    const verb = spells[spellId].school == "Physical" ? pickRandomItem(" uses the , attacks with the ") : pickRandomItem(" cast , attacks with ");
    print(wizardName() + verb + spellText + " (" + ui.attackIcon + roundNumbertoLetter(damage) + ") - " + ui.heartIcon + roundNumbertoLetter(fight.enemyHP));
    spell(spellId, false);
    stats.count("combat.attacks");
    return damage;
}

// The enemy hits the wizard (bosses harder, King Midas x2, divine spells x4).
function enemyAttack() {
    hopEnemy();
    let enemyHit = getRandomInt(state.player.enemyAttackRange * 0.5, state.player.enemyAttackRange * stat("fAttack")) * fight.bossMultiplier;
    if (fight.enemy == "midas") enemyHit *= 2;
    if (isDivineSpell(fight.spellEnemy)) enemyHit *= 4;
    if (state.player.hp - enemyHit < 0) {
        state.player.hp = 0;
    } else {
        state.player.hp = state.player.hp - enemyHit;
    }
    print(`${fight.enemyName} attacks (${ui.attackIcon}${roundNumbertoLetter(enemyHit)})`);
    if (fight.bossCombat) {
        fight.spellEnemy = pickRandomItem(zones[state.zone.current].bossSpell);
    } else if (fight.hydraCombat) {
        fight.spellEnemy = pickRandomItem(zones[state.zone.current].hidrasSpells);
    }
    spell(fight.spellEnemy, true);
    stats.count("combat.attacksReceived");
}


// The wizard heals himself instead of attacking.
function healEV() {
        stats.count("spell.heals");
            const healOperation = state.player.hpBase * stat("fHeal");
            let healHit = getRandomInt(healOperation * 0.5,healOperation);
            if (state.player.hp + healHit > state.player.hpBase){
                healHit =  state.player.hpBase - state.player.hp;
                state.player.hp = state.player.hpBase;
            }else{
                state.player.hp = state.player.hp + healHit;
            }
        playSound("heal");
        spell("spellHeal_8",true);
        print(wizardName() + pickRandomItem(" casts heal spell and restore , cast minor healing , use restoration ") + "(" + ui.healIcon + roundNumbertoLetter(healHit) + ")");    
         
        
    
};





// Placeholder for the tavern card game (never built in v1; see the ideas backlog).
function cardCombat(){

}



// A random fantasy name for an enemy; the two sacred wizards always keep their first one.
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
    stats.count("names.random");
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
    hopEnemy,
    hopWizard,
    enemyEV,
    randomName,
};
