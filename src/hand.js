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
import { beliefMoment, isAtheist, isDoubting } from './belief.js';
import { spell } from './spells.js';
import { printIn, updateHeading, updateHeartNPC, wizardName } from './ui/render.js';
const print = printIn('fight');      // the console category (Settings: Text in the console)

const EXCUSES = {
    weaken: "the enemy's blade snaps on its own,the enemy stumbles on a loose stone,a strap of the enemy's armour gives way,the enemy's eyes water for no reason",
    graze: "a lucky dodge,the blow glances off a rib he didn't know was strong,his foot slips and saves him,a gust turns the blade aside",
    herb: "a herb, right where he needed it,finds a healing herb growing by the path,a patch of moss that eases the pain",
};

// The same acts for a wizard who believes (a sign from the centre touch): light and inspiration, never an order.
const GUIDED = {
    weaken: "sees a weakness in the enemy, as if someone had pointed at it,notices the enemy's guard has a gap,was guided to the enemy's weak side",
    herb: "saw a healing herb, as if someone had shown him,was guided to a herb by the path,finds a patch of moss that eases the pain, and feels grateful",
};
const lines = (k) => (isAtheist() ? EXCUSES[k] : GUIDED[k]);

// A lucky moment he doesn't understand: every few of them he feels someone watches over him (hidden blessings).
function lucky() {
    if (!isDoubting()) return;
    stats.count("hand.lucky");
    if (stats.get("hand.lucky") % config.hand.blessingEvery) return;
    beliefMoment("blessing");
    stats.count("winback.blessing");
    print(`<i>${wizardName()} ${pickRandomItem("feels someone is watching over him,wonders why he is so lucky lately,feels, for a moment, that he is not alone")}</i>`);
}

// The herb he finds: one of the three herbs or one of the mushrooms (img/effects/spells/spellHerb_*, spellMushroom_*).
const HERBS = ["spellHerb_a", "spellHerb_b", "spellHerb_c"].concat("black,blue,brown,green,green2,grey,grey2,orange,purple,red,red2,silver,tan,teal,white,yellow".split(",").map((c) => `spellMushroom_${c}`));

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
    spell("spellWeaken", false, 0, 0, null, true);       // the violet chevrons sink over the enemy
    print(`${wizardName()} ${isAtheist() ? "sees " : ""}${pickRandomItem(lines("weaken"))} - ${roundNumbertoLetter(fight.enemyHP)}`);
    lucky();
    return true;
}

// Touch on the wizard: in a fight it arms a graze (once); with one armed, or out of a fight, a herb heals him.
export function handHelpWizard() {
    const p = state.player;
    if (fight.enemy && !fight.handGraze) {
        if (!pay("handGraze")) return false;
        fight.handGraze = true;                       // enemyAttack() reads it (grazeHit)
        lucky();
        return true;
    }
    if (p.hp >= p.hpBase || !pay("handHerb")) return false;
    const heal = Math.min(p.hpBase - p.hp, p.hpBase * config.hand.herbShare * getRandomInt(50, 150) / 100);
    p.hp += heal;
    updateHeading();
    spell(pickRandomItem(HERBS.join(",")), true, 0, 0, null, true);       // the herb shows for a moment
    print(`${wizardName()} ${pickRandomItem(lines("herb"))} (+${roundNumbertoLetter(heal)})`);
    lucky();
    return true;
}

// Called by enemyAttack with the hit about to land: an armed graze turns a killing hit into 1 HP left (and is used up).
export function grazeHit(enemyHit) {
    if (!fight.handGraze || state.player.hp - enemyHit > 0) return enemyHit;
    fight.handGraze = false;
    stats.count("hand.grazed");
    spell("spellGraze", true, 0, 0, null, true);       // the cracked heart that holds
    print(`${wizardName()} ${pickRandomItem(EXCUSES.graze)}`);
    return Math.max(0, state.player.hp - 1);
}
