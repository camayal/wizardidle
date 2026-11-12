// Wizard Idle v2 - The three divine touches: on the wizard (left), on the scene (center), on the enemy (right).
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { getRandomInt, pickRandomItem, roundNumbertoLetter } from './utils.js';
import { count, stat, state } from './state.js';
import { fight, run, ui } from './runtime.js';
import { reviveEV, startEvent } from './events.js';
import { getSpell, spell } from './spells.js';
import { playSound } from './audio.js';
import { drawWizard, loadBackground, loadNPC, print, updateHeading, updateHeartNPC, wizardName } from './ui/render.js';

// Touch on the wizard: revive him if he has fallen, otherwise heal him, at a cost in faith.
function pjBtn(){
    if (run.disablePjBtn) return;
    if (fight.pjDead) {
        reviveByTouch();
    } else {
        healByTouch();
    }
}

// Bring the fallen wizard back at full HP; the healer's scene follows.
function reviveByTouch() {
    count("divineTouch");
    run.disablePjBtn = true;
    playSound("revive");
    spell("spellMultiDivine_28", true);
    print(`${wizardName()} feels the divine touch!`);
    if (!!fight.autorevive) {
        clearTimeout(fight.autorevive);
        fight.autorevive = "";
    }
    state.player.hp = state.player.hpBase;
    loadBackground("curanderobg");
    fight.pjDead = false;
    drawWizard();
    loadNPC("curandero");
    startEvent(reviveEV);
}

// Heal 50-200% of his restoration knowledge, paying 1-3 faith per HP; never above full HP,
// and never more faith than he has.
function healByTouch() {
    const healOperation = state.player.hpBase * stat("fHeal");
    let healHit = getRandomInt(healOperation * 0.5, healOperation * 2);
    if (Math.round(state.player.hp) + Math.round(healHit) > Math.round(state.player.hpBase)) {
        healHit = Math.round(state.player.hpBase) - Math.round(state.player.hp);
    }
    let faithLost = healHit * getRandomInt(1, 3);
    if (Math.round(state.player.faith) - Math.round(faithLost) < 0) {
        faithLost = state.player.faith;
        healHit = faithLost / getRandomInt(1, 3);
    }
    if ((Math.round(state.player.hp) < Math.round(state.player.hpBase)) && (Math.round(state.player.faith) > 0)) {
        count("DivineHeal");
        if (state.player.hp + healHit > state.player.hpBase) {
            healHit = state.player.hpBase - state.player.hp;
            state.player.hp = state.player.hpBase;
            faithLost = healHit * getRandomInt(1, 3);
        } else {
            state.player.hp = state.player.hp + (healHit);
        }
        state.player.faith = state.player.faith - faithLost;
        updateHeading();
        playSound("heal");
        spell("spellHeal_8", true);
        print(`${wizardName()} feels a healing touch and recovers ${ui.healIcon}${roundNumbertoLetter(healHit)}`);
    }
}

// Touch on the enemy: hurt it with divine wrath, at a cost in faith.
function npcBtn(){
    let txt;
    if(!!state.npc && !!fight.enemy && Math.round(state.player.faith) > 0 && Math.round(fight.enemyHP) > 1){
        //hurt npc
        let divineHit = getRandomInt(state.player.attack * 1.5, state.player.attack * 3);
        if ( Math.round(fight.enemyHP) -  Math.round(divineHit) <= 0){//modify the divineHit to avoid god kills
            divineHit = ( Math.round(fight.enemyHP) - 1);
        }
        let faithLost =  divineHit * getRandomInt(1,3)
        if ( Math.round(state.player.faith) - Math.round(faithLost) < 0) {//avoid extra attack and reduce the god attack to the amount of faith
            faithLost = state.player.faith;
            divineHit = faithLost / getRandomInt(1,3);//update divine hit
        }

            const spellId = getSpell(20);
            spell( spellId,false);
            if (spellId == "spellChispasMulti_12" || spellId == "spellRainMultiColor_24" || spellId == "spellColorSpin_16"){
                divineHit = Math.round(divineHit) * 8 //if is one of the divine powers
                txt = "sees how the god's wrath destroy the enemy - ";
            }else{
                txt = "feels the god's power over the enemy - ";
            }
            fight.enemyHP = Math.round(fight.enemyHP) - (Math.round(divineHit));
            
            updateHeartNPC()
            state.player.faith = state.player.faith - faithLost;
            updateHeading();
            print(`${wizardName()} ${txt}${ui.heartIcon} ${roundNumbertoLetter(fight.enemyHP)}`)
            count("DivineHit");
        }
    }

// Touch on the scene: ask the wizard for a tithe in gold, which becomes faith.
function centerBtn(){
    //increase faith like offer
    if(!run.disableCenterBtn){
        if(state.player.gold > 0 && !!ui.currentBackGround.match(/altar/gi)){
            run.disableCenterBtn = true;
            const ofrendaGold = getRandomInt(state.player.gold * 0.25, state.player.gold * 0.75);
            run.feGanada = (ofrendaGold * stat("fOfrenda"));
            run.feGanada *= state.player.faithMultiplier;
            state.player.faith = state.player.faith + run.feGanada;
            state.player.gold = state.player.gold - ofrendaGold;
            const textoffer = "feels the need to give a higher tithe, increases the tithe, feels that someone order to offer extra gold"
            print(`${wizardName()} ${pickRandomItem(textoffer)} (${ui.goldIcon} -${roundNumbertoLetter(ofrendaGold)}, ${ui.spiritIcon} ${roundNumbertoLetter(run.feGanada)})`);
            count("DivineMandatoryOffers");
            count("GoldOffered", Math.round(ofrendaGold));
            count("FeByGold",Math.round(run.feGanada));
            updateHeading();
            playSound("coins");
            spell("spellCoins",false);
        }
    }
}

export {
    centerBtn,
    npcBtn,
    pjBtn,
};
