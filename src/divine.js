// Wizard Idle v2 - The three divine touches: on the wizard (left), on the scene (center), on the enemy (right).
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { getRandomInt, pickRandomItem, roundNumbertoLetter, YesOrNot } from './utils.js';
import { stat, state } from './state.js';
import { stats } from './stats.js';
import { fight, run, ui } from './runtime.js';
import * as loop from './loop.js';
import { reviveEV, startEvent } from './events.js';
import { getSpell, spell } from './spells.js';
import { playSound } from './audio.js';
import { logro } from './achievements.js';
import { enterPlace, loadBackground, loadNPC, printIn, printDivine, updateHeading, updateHeartNPC, wizardName } from './ui/render.js';
const print = printIn('divine');      // the console category (Settings: Text in the console)
import { interruptMidasHeal } from './bossEffects.js';
import { config } from './config.js';
import { cabinSpot } from './cabin.js';
import { beliefLevel, beliefMoment, isAtheist, touchCost } from './belief.js';
import { suggest } from './quests.js';
import { buzz } from './prefs.js';
import { faithChange } from './faith.js';
import { handHelpWizard, handWeakenEnemy } from './hand.js';
import { calculateFe } from './wizard.js';
import { signTouch } from './winback.js';
import { sanctuaryOnHeal, smiteFor } from './miracles.js';
import { prayerAnswered } from './prayers.js';

// Touch on the wizard: revive him if he has fallen, otherwise heal him, at a cost in faith.
function pjBtn(){
    if (run.disablePjBtn) return;
    buzz();
    if (fight.pjDead) {
        reviveByTouch();
    } else {
        healByTouch();
    }
}

// The divine rings play over the fallen wizard before the scene fades (28 frames at the screen's
// refresh, a little under half a second, plus a short beat).
const RINGS_MS = 650;

// Every touch of the god counts towards "Feel the divine touch".
function touchedCheck() {
    if (stats.get("god.touches") + stats.get("god.heals") + stats.get("god.hits") >= config.touchedAchievement) logro.set(logro.logro_tocado);
}

// Bring the fallen wizard back at full HP; the healer's scene follows. The author's order: the
// rings over him where he fell, the fade, then he is in the healer's cabin.
function reviveByTouch() {
    stats.count("god.touches");
    touchedCheck();
    if (run.softDead) { run.softDead = false; state.meta.softDead = false; state.meta.awayHours = 0; stats.count("away.savedByTouch"); }
    run.disablePjBtn = true;
    playSound("revive");
    spell("spellMultiDivine_28", true);
    printDivine(`${wizardName()} feels the divine touch!`);
    if (!!fight.autorevive) {
        loop.stop("selfRevive");
        fight.autorevive = "";
    }
    state.player.hp = state.player.hpBase;
    fight.pjDead = false;
    const atheist = isAtheist();      // winning him back: his free revive is worth double (belief and faith)
    faithChange(Math.round(calculateFe() * config.faith.reviveFe * (atheist ? 2 : 1)), "revive");
    beliefMoment(atheist ? "reviveAtheist" : "revive");
    const toCabin = () => enterPlace((run.cabin = cabinSpot()).bg, "healer_hooded", () => startEvent(reviveEV), true);   // he wakes up there, with the hooded healer (the god in disguise; art by the artist)
    if (run.simulation || !document.hasFocus()) return toCabin();
    loop.freezeGame();                          // nothing moves on while the rings play
    loop.every("reviveRings", () => {
        loop.stop("reviveRings");
        loop.thawGame();
        toCabin();
    }, RINGS_MS);
}

// Heal 50-200% of his restoration knowledge, paying 1-3 faith per HP; never above full HP,
// and never more faith than he has.
function healByTouch() {
    if (isAtheist()) { if (!handHelpWizard()) refuseTouch(); return; }       // the invisible hand: he never knows
    const answered = prayerAnswered();      // a prayer was open: the heal works at full strength
    const healOperation = state.player.hpBase * stat("fHeal");
    let healHit = getRandomInt(healOperation * 0.5, healOperation * 2) * (beliefLevel() == 'doubter' && !answered ? config.belief.doubterHealFactor : 1);
    if (Math.round(state.player.hp) + Math.round(healHit) > Math.round(state.player.hpBase)) {
        healHit = Math.round(state.player.hpBase) - Math.round(state.player.hp);
    }
    let faithLost = touchCost(healHit * getRandomInt(1, 3)) * config.belief.healCostFactor;
    if (Math.round(state.player.faith) - Math.round(faithLost) < 0) {
        faithLost = state.player.faith;
        healHit = faithLost / config.belief.healCostFactor / getRandomInt(1, 3);
    }
    if ((Math.round(state.player.hp) < Math.round(state.player.hpBase)) && (Math.round(state.player.faith) > 0)) {
        stats.count("god.heals");
        touchedCheck();
        // belief: a heal at very low HP counts more; whether it saved him shows at the enemy's next hit
        beliefMoment(state.player.hp < state.player.hpBase * config.belief.lowHpLine ? "lowHpHeal" : "touch");
        if (fight.enemy) { fight.healedFrom = state.player.hp; fight.godHelped = true; }
        if (state.player.hp + healHit > state.player.hpBase) {
            healHit = state.player.hpBase - state.player.hp;
            state.player.hp = state.player.hpBase;
            faithLost = touchCost(healHit * getRandomInt(1, 3)) * config.belief.healCostFactor;
        } else {
            state.player.hp = state.player.hp + (healHit);
        }
        faithChange(-faithLost, "heal");
        updateHeading();
        playSound("heal");
        spell("spellHeal_8", true);
        sanctuaryOnHeal();
        printDivine(`${wizardName()} feels a healing touch and recovers ${ui.healIcon}${roundNumbertoLetter(healHit)}`);
    }
}

// Touch on the enemy: hurt it with divine wrath, at a cost in faith.
function npcBtn(){
    buzz();
    if (suggest('accept')) return;      // a job is waiting: the touch on the giver suggests taking it (src/quests.js)
    let txt;
    if(!!state.npc && !!fight.enemy && Math.round(state.player.faith) > 0 && Math.round(fight.enemyHP) > 0){
        if (isAtheist()) { if (!handWeakenEnemy()) refuseTouch(); return; }
        //hurt npc
        interruptMidasHeal();
        // the god's touch may kill now (docs/plans/FAITH.md 3.1: the final blow; v1 always left it 1 HP)
        let divineHit = getRandomInt(state.player.attack * 1.5, state.player.attack * 3);
        let faithLost =  touchCost(divineHit * getRandomInt(1,3))
        if ( Math.round(state.player.faith) - Math.round(faithLost) < 0) {//avoid extra attack and reduce the god attack to the amount of faith
            faithLost = state.player.faith;
            divineHit = faithLost / getRandomInt(1,3);//update divine hit
        }

            const smite = smiteFor();       // a Wrath god's touch is a Smite
            const spellId = smite ? smite.spell : getSpell(20);
            spell( spellId,false);
            let moment = "touch";
            if (smite) {
                divineHit = Math.round(divineHit * smite.bonus);
                txt = "sees a Smite fall from above - ";
            } else if (spellId == "spellChispasMulti_12" || spellId == "spellRainMultiColor_24" || spellId == "spellColorSpin_16"){
                const superCritic = config.belief.superCriticChance > 0 && YesOrNot(config.belief.superCriticChance, 0);
                divineHit = Math.round(divineHit) * (superCritic ? config.belief.superCriticMultiplier : 8) //if is one of the divine powers
                txt = superCritic ? "sees divine wrath crush the enemy - " : "watches divine wrath destroy the enemy - ";
                moment = superCritic ? "superCritic" : "critic";
            }else{
                txt = "feels a divine power strike the enemy - ";
            }
            fight.enemyHP = Math.max(0, Math.round(fight.enemyHP) - (Math.round(divineHit)));
            beliefMoment(moment);
            if (fight.bossCombat) beliefMoment("bossHit");     // hitting a boss directly raises belief more
            fight.godHelped = true;
            if (fight.enemyHP <= 0) beliefMoment("finalBlow");      // it falls at the fight's next step
            
            updateHeartNPC()
            faithChange(-faithLost, "hit");
            updateHeading();
            printDivine(`${wizardName()} ${txt}${ui.heartIcon} ${roundNumbertoLetter(fight.enemyHP)}`)
            stats.count("god.hits");
            touchedCheck();
        }
    }

// An Atheist refuses the god's heal and hit (docs/plans/FAITH.md 3.1); nothing is spent.
function refuseTouch() {
    print(`${wizardName()} ${pickRandomItem("shrugs off a touch he doesn't believe in,refuses help from a deity he doesn't believe in,ignores a strange warmth")}`);
    stats.count("belief.touchesRefused");
}

// Touch on the scene: ask the wizard for a tithe in gold, which becomes faith.
function centerBtn(){
    buzz();
    if (suggest('refuse')) return;      // a job is waiting: the touch on the door suggests leaving it
    //increase faith like offer
    if(!run.disableCenterBtn){
        if(state.player.gold > 0 && !!ui.currentBackGround.match(/altar/gi)){
            run.disableCenterBtn = true;
            const ofrendaGold = getRandomInt(state.player.gold * 0.25, state.player.gold * 0.75);
            run.feGanada = (ofrendaGold * stat("fOfrenda"));
            run.feGanada = faithChange(run.feGanada * state.player.faithMultiplier, "tithe");
            state.player.gold = state.player.gold - ofrendaGold;
            const textoffer = "feels the need to give a higher tithe, increases the tithe, feels that someone wants him to offer extra gold"
            printDivine(`${wizardName()} ${pickRandomItem(textoffer)} (${ui.goldIcon} -${roundNumbertoLetter(ofrendaGold)}, ${ui.spiritIcon} ${roundNumbertoLetter(run.feGanada)})`);
            stats.count("faith.mandatoryOffers");
            stats.add("gold.offered", Math.round(ofrendaGold));
            updateHeading();
            playSound("coins");
            spell("spellCoins",false);
        } else {
            signTouch();      // a sign, a dream of a shrine or a pilgrim (src/winback.js)
        }
    }
}

export {
    centerBtn,
    npcBtn,
    pjBtn,
};
