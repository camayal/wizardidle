// Wizard Idle v2 - game balance.
//
// In v1 these numbers were copied into every wizard's save on the first run, so changing
// one meant wiping saves to see the effect. Now they live here: edit a value and every
// wizard plays by the new rules on the next page load.
// Values and comments are the ones from v1's checkDB().

export const config = {
    // Belief (docs/FAITH.md 3.1, the author's starting values, to playtest): its own meter,
    // moved by moments; the level lines, the margin on the way up, and what each level changes.
    belief: {
        start: 20, min: -100, max: 100,
        devout: 60, doubter: 0, atheist: -60,  // lines: Devout from +60, Believer from 0, Atheist below -60
        margin: 10,
        lowHpLine: 0.2,                        // a heal below this share of his HP is a "very low HP" heal
        weights: {
            savedFromKillingBlow: 8,           // a heal touch that keeps him alive through the enemy's next hit
            lowHpHeal: 5,
            finalBlow: 5,                      // the god's touch kills the enemy
            critic: 3,                         // the god's touch lands a critic (the divine powers)
            superCritic: 6,
            touch: 0.5,                        // a normal heal or hit touch
            revive: 2,
            prayer: 1,                         // entering a shrine
            skippedShrine: -1,
            passedShrine: 0.5,                 // a Doubter or Atheist walks past a shrine (the way back, 2026-11-13)
            closeCall: 1,                      // he wins a fight below 10% HP with no help from the god
            roseAlone: -10,                    // he got up without the god, as a Believer or Devout
            roseAloneDoubting: -1,             //   ... as a Doubter or Atheist
        },
        closeCallLine: 0.1,
        superCriticChance: 0.1,                // 1 in 10 of the god's critics (the author)
        superCriticMultiplier: 16,             // against x8 for a critic
        devoutTouchCost: 0.75, doubterTouchCost: 2,
        devoutShrine: 0.15, doubterShrine: -0.15,
    },
    // Fixed rules of the world.
    balance: {
        rXP: 1.1,                  // XP curve exponent
        factorHP: 8,               // XP/HP scale factor
        rHP: 1.6483,               // HP per XP of the next level
        rEnemyXP: 16,              // enemies needed per level (roughly)
        rGold: 0.15,               // gold per HP
        sacredDamageMultiplier: 1,
        pGetBoss: 0.015,           // chance a fight is against the zone boss
        pGetGuardian: 0.1,         // megabosses
        pGetStatue: 0.08,
        dreamChance: 0.15,         // a rest has a random dream or nightmare (looks only, docs/SLEEP.md; how rare is to decide)
        pGetHydra: 0.1,            // only once the hydra mystery is solved
        pDados: 0.1,               // was 0.2: too easy to get stuck in the dice game
        allowChangeZone: 1,        // 1 = use pChangeZone as is, 0 = never change zone
        // boss effects (docs/SCENE_SPELLS.md; starting values, to playtest)
        petrifyChance: 0.25,       // Medusa's gaze turns him to stone
        petrifyTurns: 2,
        artefactChance: 0.05,      // a find is the artefact against her gaze (after his first stone)
        midasHeal: 0.15,           // of Midas's max HP, per golden-rays heal
        midasHealsPerFight: 2,
        blizzardChance: 0.5,       // he skips his next attack
        earthquakeChance: 0.5,     // his next spell misses
        poisonTurns: 2,
        poisonDamage: 0.04,        // of his max HP, per turn
    },

    // Starting value of each trainable skill. Statues, runes and books raise them per
    // wizard; the save only stores what this wizard has gained (state.statBonus).
    baseStats: {
        pAttack: 0.6,              // attack chance
        fAttack: 1,                // mastery in magic arts
        pPolymorph: 0.025,         // polymorphism mastery
        fCritic: 2,                // critical multiplier
        pCritic: 0.2,              // critic chance
        pHeal: 0.17,               // heal chance (was 0.2)
        fHeal: 0.1,                // restoration knowledge
        pStudy: 0.1,               // intellect (was 0.25, lowered because studying triples)
        pBotin: 0.2,               // avarice (loot)
        pChangeZone: 0.35,         // exploration faculties
        pFindCapel: 0.35,          // devotion (shrines)
        pFindMaterials: 0.2,       // scavenger skills
        pOfrenda: 0.25,            // devotion for the tithe
        fOfrenda: 0.5678,          // generosity (was 1.3748)
    },
};

// Timing and limits (v1: loose globals at the top of main.js).
export const MAXSTAGES = 5;
export const MAXLINESINCONSOLE = 50;
export const RAREMULTIPLIER = 2;
export const masterTime = 1500;
export const selfrevivetime = 120000;

// Dev tools (src/dev/): the test bar at the bottom of the screen. On while developing;
// the deploy rewrites this line to false, so the live site never loads them.
export const DEV = true;
