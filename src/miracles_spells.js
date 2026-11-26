// Wizard Idle - the god's face and the signature miracle spells (Mercy shield, Wrath strike, Last luck) (docs/plans/for_implementation_faith.md, section 7, step 5).
// The face comes from what the god does most: heals (Mercy), hits (Wrath) or little of either (Distant).
// Mercy: every heal touch in a fight also raises a Mercy shield (hits by belief level, a few times per fight).
// Wrath: the god's hit on the enemy is a Wrath strike (sword of light, the pillar for a Devout). Numbers: config.face (placeholders).

import { config } from './config.js';
import { state } from './state.js';
import { stats } from './stats.js';
import { fight } from './runtime.js';
import { beliefLevel } from './belief.js';
import { spell } from './spells.js';
import { logro } from './achievements.js';
import { printIn, wizardName } from './ui/render.js';
const print = printIn('divine');

const byLevel = (list) => list[{ doubter: 0, believer: 1, devout: 2 }[beliefLevel()] ?? 1];

// "mercy", "wrath" or "distant"
export function godFace() {
    const heals = stats.get("god.heals"), hits = stats.get("god.hits");
    if (heals + hits < config.face.minActs) return "distant";
    return heals >= hits ? "mercy" : "wrath";
}

// "gentle", "stern" or "distant": how a heal touch feels from this god
export const faceWord = () => ({ mercy: "gentle", wrath: "stern", distant: "distant" })[godFace()];

// One achievement per face reached at Devout (called after each touch)
export function faceLogro() {
    if (beliefLevel() != "devout") return;
    logro.set(logro[`logro_${godFace()}`]);
}

// After a heal touch (a believing wizard only): a Mercy god also raises a Mercy shield, a few times per fight.
export function sanctuaryOnHeal() {
    if (!fight.enemy || godFace() != "mercy" || beliefLevel() == "atheist") return;
    if ((fight.sanctUses || 0) >= byLevel(config.face.sanctuaryPerFight)) return;
    fight.sanctUses = (fight.sanctUses || 0) + 1;
    fight.sanctHits = byLevel(config.face.sanctuaryHits);
    stats.count("god.sanctuary");
    spell("spellSanctuary_1", true, 0, 0, null, true);
    print(`<i>A Mercy shield rises around ${wizardName()}</i>`);
}

// Called by enemyAttack with the hit about to land: a Mercy shield takes it whole (one hit used, boss or not).
export function sanctuaryAbsorb(enemyHit) {
    if (!(fight.sanctHits > 0)) return enemyHit;
    fight.sanctHits--;
    stats.count("god.sanctuaryHits");
    spell("spellSanctuary_1", true, 0, 0, null, true);
    return 0;
}

// The look and the strength of a Wrath strike (null if the god is not Wrath).
export function smiteFor() {
    if (godFace() != "wrath" || beliefLevel() == "atheist") return null;
    return { spell: beliefLevel() == "devout" ? "spellSmite_pillar" : "spellSmite_sword", bonus: config.face.smiteBonus };
}

// Last luck (Distant god, Doubter and up; an Atheist has his paid graze instead): a killing hit sometimes leaves him 1 HP on its own, once per fight, at no
// faith (the invisible hand's graze, seen this time).
export function providenceHit(enemyHit) {
    const hp = state.player.hp, level = beliefLevel();
    if (level == "atheist" || godFace() != "distant" || fight.providenceUsed || hp - enemyHit > 0) return enemyHit;
    if (Math.round(state.player.faith) > 0) return enemyHit;      // with faith the player heals or shields him himself
    if (Math.random() >= config.face.luckChance[level]) return enemyHit;
    fight.providenceUsed = true;
    stats.count("god.providence");
    spell(["spellProvidence_a", "spellProvidence_b", "spellProvidence_c"][Math.floor(Math.random() * 3)], true, 0, 0, null, true);
    print(`<i>Last luck: ${wizardName()} is spared by a luck he cannot explain</i>`);
    return Math.max(0, hp - 1);
}

export function clearMiracles() {
    fight.providenceUsed = false;
    fight.sanctHits = 0;
    fight.sanctUses = 0;
}
