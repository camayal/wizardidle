// Wizard Idle - the god's face and the signature miracles (docs/plans/for_implementation_faith.md, section 7, step 5).
// The face comes from what the god does most: heals (Mercy), hits (Wrath) or little of either (Distant).
// Mercy: every heal touch in a fight also raises a Sanctuary (hits by belief level, a few times per fight).
// Wrath: the god's hit on the enemy is a Smite (sword of light, the pillar for a Devout). Numbers: config.face (placeholders).

import { config } from './config.js';
import { stats } from './stats.js';
import { fight } from './runtime.js';
import { beliefLevel } from './belief.js';
import { spell } from './spells.js';
import { printIn, wizardName } from './ui/render.js';
const print = printIn('divine');

const byLevel = (list) => list[{ doubter: 0, believer: 1, devout: 2 }[beliefLevel()] ?? 1];

// "mercy", "wrath" or "distant"
export function godFace() {
    const heals = stats.get("god.heals"), hits = stats.get("god.hits");
    if (heals + hits < config.face.minActs) return "distant";
    return heals >= hits ? "mercy" : "wrath";
}

// After a heal touch (a believing wizard only): a Mercy god also raises a Sanctuary, a few times per fight.
export function sanctuaryOnHeal() {
    if (!fight.enemy || godFace() != "mercy" || beliefLevel() == "atheist") return;
    if ((fight.sanctUses || 0) >= byLevel(config.face.sanctuaryPerFight)) return;
    fight.sanctUses = (fight.sanctUses || 0) + 1;
    fight.sanctHits = byLevel(config.face.sanctuaryHits);
    stats.count("god.sanctuary");
    spell("spellSanctuary_1", true, 0, 0, null, true);
    print(`<i>A Sanctuary rises around ${wizardName()}</i>`);
}

// Called by enemyAttack with the hit about to land: a Sanctuary takes it whole (one hit used, boss or not).
export function sanctuaryAbsorb(enemyHit) {
    if (!(fight.sanctHits > 0)) return enemyHit;
    fight.sanctHits--;
    stats.count("god.sanctuaryHits");
    spell("spellSanctuary_1", true, 0, 0, null, true);
    return 0;
}

// The look and the strength of a Smite (null if the god is not Wrath).
export function smiteFor() {
    if (godFace() != "wrath" || beliefLevel() == "atheist") return null;
    return { spell: beliefLevel() == "devout" ? "spellSmite_pillar" : "spellSmite_sword", bonus: config.face.smiteBonus };
}

export function clearMiracles() {
    fight.sanctHits = 0;
    fight.sanctUses = 0;
}
