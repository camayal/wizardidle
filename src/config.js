// Wizard Idle v2 - game balance.
//
// In v1 these numbers were copied into every wizard's save on the first run, so changing
// one meant wiping saves to see the effect. Now they live here: edit a value and every
// wizard plays by the new rules on the next page load.
// Values and comments are the ones from v1's checkDB().

export const config = {
    // "Feel the divine touch": revivals, heals and hits by the god, added up (a first number to tune).
    touchedAchievement: 100,
    // Belief (docs/plans/FAITH.md 3.1, the author's starting values, to playtest): its own meter,
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
            bossHit: 1.5,                      // a direct hit on a boss (extra to the touch itself; a first number to tune)
            revive: 2,
            prayer: 1,                         // entering a shrine
            skippedShrine: -1,
            passedShrine: 0.5,                 // a Doubter or Atheist walks past a shrine (the way back, 2026-11-13)
            closeCall: 1,                      // he wins a fight below 10% HP with no help from the god
            roseAlone: -10,                    // he got up without the god, as a Believer or Devout
            roseAloneDoubting: -1,             //   ... as a Doubter or Atheist
            dreamDevout: 1,                    // a belief dream (docs/plans/SLEEP.md), by his level when he dreams it
            dreamBeliever: 1,
            dreamDoubter: 2,
            dreamAtheist: 3,                   //   (none while belief is lost)
            nightmare: -1,                     // a nightmare, only while Believer or Devout, never below nightmareFloor
        },
        nightmareFloor: 0,                     // a nightmare never takes belief below this (the Believer line)
        closeCallLine: 0.1,
        superCriticChance: 0.1,                // 1 in 10 of the god's critics (the author)
        superCriticMultiplier: 16,             // against x8 for a critic
        devoutTouchCost: 1, doubterTouchCost: 1,   // touches cost the same at every level now (faith plan, section 5)
        doubterHealFactor: 0.6,                // a Doubter's heal restores this share (the god's help works worse on a doubter)
        selfXp: 0.3, selfCrit: 0.1,            // self-reliance: at the lowest belief he earns this much more XP and crit chance on his own (placeholders)
        healCostFactor: 0.5,                   // a healing touch costs this share of the faith an attack of the same size would (a first number to tune)
        devoutShrine: 0.15, doubterShrine: -0.15,
    },
    // The invisible hand (an Atheist's touches, src/hand.js): placeholders, tune with the playtests.
    hand: {
        costFe: 2,                 // each touch costs this many prayers' worth of faith (calculateFe)
        weakenShare: 0.2,          // the enemy loses this share of its life
        herbShare: 0.3,            // a herb heals this share of his HP (50% to 150% of it)
    },

    // Faith, the god's currency (docs/plans/for_implementation_faith.md): placeholders, tune with the playtests.
    faith: {
        maxPerHp: 100,             // the most faith he can hold = hpBase x this
        maxMin: 200,               // ... but never less than this
        nudgeCostFe: 2,            // a nudge (touching a spot of the scene) costs this many prayers' worth of faith (calculateFe)
        nudgeFollow: { devout: 0.95, believer: 0.8, doubter: 0.5, atheist: 0.1 },      // how often he follows a nudge
        nudgeLife: 3,              // events a followed nudge waits for his next decision
        nudgeTravelLife: 10,       // ... a nudge to walk somewhere keeps steering him this many events (it ends on arrival)
    },
    // Time away (docs/plans/AWAY.md, first estimates, to playtest): away time / worldDivisor = world time.
    away: {
        worldDivisor: 108,         // 1 month away is about 6.7 world hours
        minSeconds: 300,           // shorter than this changes nothing (a reload, a quick look elsewhere)
        capDays: 90,               // elapsed time is capped (a clock set forward cannot farm): 20 world hours
        faithLossPerHour: 0.02,    // share of his faith lost per world hour (compounds, never below 0)
        goldDriftPerHour: 0.005,   // gold moves up or down by up to this share per world hour
        levelsPerHour: 0.3,        // expected levels per world hour (his normal pace is 3 to 6)
        maxLevels: 3,              // most levels one absence can give, and never up to the next chapter level
        softDeadHours: 6.6,        // from here (a little under 1 month) he has fallen; the god can revive him
        deadRampHours: 13.3,       // about 2 months: permadeath chance is deadRampChance here
        deadRampChance: 0.7,
        deadCertainHours: 20,      // the cap: permadeath is certain
        protectedLevels: [[130, 139], [149, 159], [190, 200]],  // chapters VI, VIII, X and XI: the story takes the god's click away, so no soft dead and no permadeath there (STORY.md, true death rule)
    },
    // Travel graph (docs/TRAVEL.md): the cost of walking, in map pixels. tools/travel_graph.py reads
    // the terrain numbers, the game reads the limits. First guesses, tuned with the overlay.
    travel: {
        landCost: 1,               // one pixel of land
        roadCost: 1,               // one pixel of road (the sand of the beaches is not a road: no discount yet)
        riverCost: 60,             // a flat price per river crossing (none on a bridge)
        seaCost: 50,               // one pixel of sea or lake
        entranceCost: 15,          // a cave or mine mouth, between the ground and the underground
        stairsCost: 30,            // the sacred stairs up to Heidan
        accessibleCost: 5,         // a link set Accessible by hand in the dev tools: this cost
        difficultFactor: 3,        // a link set Difficult: its cost times this, at least difficultMin
        difficultMin: 100,
        difficultLimit: 150,       // a direct link dearer than this (a river crossing and more) is shown red in the dev tools
        pxPerScene: 40,            // dynamic scenes: a leg needs one scene per this much cost, at least one (a first guess, to tune)
        searchDistance: 60,        // two spots this close (map pixels) get a direct edge
        destinationLimit: 45,      // a place this cheap away is a destination (the adapter)
        moveLimit: 45,             // a stage of the same zone this cheap away is a move
        manualLinksOnly: 1,        // 1: tools/travel_graph.py makes no links, every link is set by hand in the dev tools; 0: it computes them from the map
    },
    // Quests (docs/plans/QUESTS.md). Every number here is a PLACEHOLDER for the playtests (the plan gives none).
    quests: {
        queueMax: 7,               // quests waiting behind the current one (8 in all; was 3, 4 in all); a full queue turns new offers down
        pWish: 0.06,               // chance per event, with no quest, that he sets one himself (from his needs)
        findBase: 0.08,            // searching the target zone: chance per event that the target turns up...
        findStep: 0.03,            // ...plus this for every event already spent searching...
        findMax: 0.6,              // ...up to this
        searchPatience: 40,        // events of searching after which the quest moves down the queue (when another waits)
        maxDemotions: 3,           // the quest is dropped the 3rd time its search runs out (or at once when it is the only one); never a secret
        pWantedBoost: 1,           // placeholder: the forced fight when the wanted target "turns up" (1 = always that enemy)
        goldMult: 6,               // reward: gold = hpBase * rGold * this
        faithMult: 4,              // reward: faith = calculateFe() * this
        bossMult: 2.5,             // a boss hunt pays this many times the gold, faith and XP of a rare hunt (placeholder)
        logMax: 20,                // finished quests kept in the log
        xpMult: 12,                // reward: XP = xpPerEnemy * this
        pilgrimageShrines: 3,      // zones to pray in
        personality: 1.5,          // how much a personality (greedy, pious, curious) tilts the wish scores
        needNoise: 0.25,           // randomness added to each wish score, so he is not predictable
        acceptLine: 0.5,           // an offer he judges alone (no suggestion): taken when its score reaches this
        obey: { devout: 0.95, believer: 0.8, doubter: 0.4, atheist: 0.1 },   // chance he does what the god suggests or orders, by belief
        pInnOffer: 0.3,            // chance the host of an inn he enters has a job
        pBoard: 0.08,              // chance an explore event in the City reads the board
        pRune: 0.01,               // chance a rune he finds starts a secret quest (the rune's trail to another zone)
        pDeliverStranger: 0.5,      // a delivery goes to a stranger waiting on the road instead of an inn host (placeholder)
        pHuman: 0.03,              // chance an explore event in a safe area meets a stranger with a job (was 0.004, very rare; raised 2026-11-25: strangers are the main way to get quests)
        pPost: 0.06,               // chance an explore event in a region with a post reads it
        pTravelExplore: 0.75,      // on the way to a quest's target, chance each event is just exploring (walking on) instead of a random event
        turnUpCooldown: 8,         // events after the target turned up (a wanted enemy, a boss) before it can turn up again
        offerKinds: {              // how likely each kind is when a giver offers a job (weights, placeholders for the playtests)
            inn:   { rare: 3, boss: 1, delivery: 4, explore: 2, study: 1 },
            oldman: { artefact: 8, rare: 1, boss: 1, delivery: 2, explore: 1, study: 1 },     // the Dunes inn's old man; artefact only counts while an artefact job exists
            board: { rare: 4, boss: 2, delivery: 2, explore: 2, study: 1, shrine: 1 },
            human: { rare: 2, boss: 1, delivery: 3, explore: 3, study: 2, shrine: 1 },
            post:  { rare: 3, boss: 1 },       // hunts only
        },
        stepTime: 2800,            // ms between the beats of a quest scene (meeting, guild): slower than the usual 1500 so the lines can be read
        studyBoost: 2,             // a study quest: the find gives its skill this many extra times
        pKnownPlace: 0.15,         // an explore offer names a place he already knows (he says so and goes on)
        pWantedRare: 0.7,          // a hunt he sets himself (a wish): chance it is a rare enemy rather than a boss
        pStop: { devout: 0.95, believer: 0.8, doubter: 0.55, atheist: 0.3 },   // a stranger calls: chance he stops to help instead of walking on, by belief
        stopCurious: 0.15,         // ...plus this for a curious nature
        orderWait: 15,             // events before the god can give another order from the Faith scroll
    },
    // Fixed rules of the world.
    balance: {
        dunesInn: 1,               // 1 = the underground inn of las_Dunas2 exists (turn on once its art is in img/places/las_dunas/las_dunas_taberna.png)
        rXP: 1.1,                  // XP curve exponent
        factorHP: 8,               // XP/HP scale factor
        rHP: 1.6483,               // HP per XP of the next level
        rEnemyXP: 16,              // enemies needed per level (roughly)
        rGold: 0.15,               // gold per HP
        sacredDamageMultiplier: 1,
        pFightInCrossing: 0.1,     // chance a walk across a border or connector (zone change) stops for a fight (0 = never)
        pGetBoss: 0.015,           // chance a fight is against the zone boss
        pGetGuardian: 0.1,         // megabosses
        pGetStatue: 0.08,
        dreamChance: 0.05,         // a rest has a random dream or nightmare (docs/plans/SLEEP.md); was 0.15, too frequent
        dreamBelieverNightmare: 0.25,  // share of dream nights that are nightmares for a Believer or Devout
        dreamDoubterNightmare: 0.75,   //   ... for a Doubter or Atheist
        echoDreamChance: 0.25,         // after an erasure, share of random dreams taken from the echo pool
        pGetHydra: 0.1,            // only once the hydra mystery is solved
        pDados: 0.1,               // was 0.2: too easy to get stuck in the dice game
        allowChangeZone: 1,        // 1 = use pChangeZone as is, 0 = never change zone
        zoneStayFree: 12,          // events in one zone before he grows restless (the author: he stayed too long)
        zoneStayPush: 0.05,        //   then each event adds this to the change-zone chance
        zoneStayMax: 40,           //   and after this many the next event takes him to another zone
        pPier: 0.08,               // placeholder, chance an exploring wizard near the pier walks out on it (not playtested)
        pDadosAgain: 0.35,         // after a dice game, chance he stays for another round (gold left)
        // boss effects (docs/plans/SCENE_SPELLS.md; starting values, to playtest)
        petrifyChance: 0.25,       // Medusa's gaze turns him to stone
        petrifyTurns: 2,
        artefactChance: 0.05,      // a find is the artefact against her gaze (after his first stone)
        pSpectrum: 0.04,           // placeholder, chance a Tundra fight is a secret spectrum (not playtested)
        prismSpectrumBoost: 3,     //   times this with the prism in his pack
        prismChance: 0.05,         // placeholder, chance a find is the prism once the spectra quest is given
        midasHeal: 0.15,           // of Midas's max HP, per golden-rays heal
        midasHealsPerFight: 2,
        charmChance: 0.5,          // the lamia's serpent gaze: he skips his next attack (placeholder, like the blizzard)
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
