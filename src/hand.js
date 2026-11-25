// Wizard Idle v2 - the invisible hand (docs/plans/for_implementation_faith.md, section 5, step 3): what the god's
// touches do for an Atheist. They act on the world, not on him, and he never knows: each one shows a luck excuse.
// Touch on the enemy weakens it; touch on him in a fight arms a graze (the next killing hit leaves 1 HP);
// touch on him outside a fight (or with a graze armed) makes a healing herb appear. Numbers: config.hand (placeholders).

import { config } from './config.js';
import { state } from './state.js';
import { stats } from './stats.js';
import { fight } from './runtime.js';
import { pickRandomItem, roundNumbertoLetter, getRandomInt } from './utils.js';
import { faithChange } from './faith.js';
import { calculateFe } from './wizard.js';
import { print, updateHeading, updateHeartNPC, wizardName } from './ui/render.js';

const EXCUSES = {
    weaken: "the enemy's blade snaps on its own,the enemy stumbles on a loose stone,a strap of the enemy's armour gives way,the enemy's eyes water for no reason",
    graze: "a lucky dodge,the blow glances off a rib he didn't know was strong,his foot slips and saves him,a gust turns the blade aside",
    herb: "a herb, right where he needed it,finds a healing herb growing by the path,a patch of moss that eases the pain",
};

const cost = () => Math.max(1, Math.round(calculateFe() * config.hand.costFe));

// Pay the faith (all of it or nothing: the hand does not work on credit). False if he has too little.
function pay(source) {
    if (state.player.faith < cost()) return false;
    faithChange(-cost(), source);
    stats.count(`hand.${source}`);
    return true;
}

// Touch on the enemy: it loses part of its life (no belief moves: he thinks it was luck).
export function handWeakenEnemy() {
    if (!fight.enemy || fight.enemyHP <= 0 || !pay("handWeaken")) return false;
    const cut = Math.max(1, Math.round(fight.enemyHP * config.hand.weakenShare));
    fight.enemyHP = Math.max(1, Math.round(fight.enemyHP) - cut);
    updateHeartNPC();
    updateHeading();
    print(`${wizardName()} sees ${pickRandomItem(EXCUSES.weaken)} - ${roundNumbertoLetter(fight.enemyHP)}`);
    return true;
}

// Touch on the wizard: in a fight it arms a graze (once); with one armed, or out of a fight, a herb heals him.
export function handHelpWizard() {
    const p = state.player;
    if (fight.enemy && !fight.handGraze) {
        if (!pay("handGraze")) return false;
        fight.handGraze = true;                       // enemyAttack() reads it (grazeHit)
        return true;
    }
    if (p.hp >= p.hpBase || !pay("handHerb")) return false;
    const heal = Math.min(p.hpBase - p.hp, p.hpBase * config.hand.herbShare * getRandomInt(50, 150) / 100);
    p.hp += heal;
    updateHeading();
    print(`${wizardName()} ${pickRandomItem(EXCUSES.herb)} (+${roundNumbertoLetter(heal)})`);
    return true;
}

// Called by enemyAttack with the hit about to land: an armed graze turns a killing hit into 1 HP left (and is used up).
export function grazeHit(enemyHit) {
    if (!fight.handGraze || state.player.hp - enemyHit > 0) return enemyHit;
    fight.handGraze = false;
    stats.count("hand.grazed");
    print(`${wizardName()} ${pickRandomItem(EXCUSES.graze)}`);
    return Math.max(0, state.player.hp - 1);
}
