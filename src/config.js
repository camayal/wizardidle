// Wizard Idle v2 - game balance.
//
// In v1 these numbers were copied into every wizard's save on the first run, so changing
// one meant wiping saves to see the effect. Now they live here: edit a value and every
// wizard plays by the new rules on the next page load.
// Values and comments are the ones from v1's checkDB().

export const config = {
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
        pGetHydra: 0.1,            // only once the hydra mystery is solved
        pDados: 0.1,               // was 0.2: too easy to get stuck in the dice game
        allowChangeZone: 1,        // 1 = use pChangeZone as is, 0 = never change zone
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
