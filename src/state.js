// Wizard Idle v2 - everything the game remembers, and saving it.
//
// v1 stored ~150 separate localStorage entries, each key and value encoded with thx()
// (base-36 char codes). Now there is one object, `state`, saved as plain JSON:
//
//   wizardidle2:save   the current wizard (deleted when the wizard is killed)
//   wizardidle2:world  what outlives a wizard: the cemetery and the device id
//
// Nothing else in localStorage is touched, so other games on the same domain
// (including the legacy v1 copy) keep their saves.

import { config } from './config.js';
import { getRandomInt } from './utils.js';

const SAVE_KEY = 'wizardidle2:save';
const WORLD_KEY = 'wizardidle2:world';
const SAVE_EVERY_MS = 2000;
const MAXSTAGES = 5;

function newState() {
    return {
        version: 2,
        firstUse: true,             // true until the player names the wizard and starts
        meta: {
            createdAt: new Date().toISOString(),
            playTimeMs: 0,
        },
        player: {
            name: '',
            lvl: 0,
            age: 19,
            xp: 0,
            xpNext: 0,
            xpPast: 0,
            hp: 0,
            hpBase: 0,
            attack: 0,
            gold: getRandomInt(10, 50),
            faith: getRandomInt(10, 35),
            faithMultiplier: 1,       // doubles at chapter II (devotion)
            belief: config.belief.start,  // his belief, -100 to +100 (src/belief.js)
            beliefLevel: "",          // devout, believer, doubter, atheist ("" until it first changes: read from belief)
            beliefLost: false,        // the story's lock (chapter X): belief stops moving
            enemyHpRange: 0,
            enemyAttackRange: 0,
            xpPerEnemy: 0,
            lastBattleGold: 0,
            inSin: false,             // planned in v1 (lose faith after killing), never switched on
        },
        zone: {
            current: 'la_Ciudad',
            last: 'la_Torre',
            stage: Math.floor((Math.random() * MAXSTAGES) + 1),
        },
        npc: '',                      // sprite currently on the right side of the scene
        forceEvent: '',               // debug: comma-separated event numbers to force
        hydraMysteryResolved: false,
        petrifiedOnce: false,         // Medusa turned him to stone at least once (src/bossEffects.js)
        petrifyImmune: false,         // he found the artefact against her gaze
        travelFavor: false,           // planned in v1 (map travel once god loves the wizard), never unlocked
        hydraHeads: {},               // hydra name -> current number of heads
        hydraHealth: {},              // hydra name -> share of its HP left after a fight it survived
                                      //   (the author: its wounds stay; it heals only when a head grows)
        sacredNames: {},              // the two sacred wizards keep the name they first got
        statBonus: {},                // skill -> gained on top of config.baseStats
        stats: { 'explore.zone.la_Ciudad': 1, 'combat.combo': 0 },  // see src/stats.js (v1: idx_*)
        history: [],                  // one line per level-up (src/stats.js)
        achievements: {},             // achievement name -> true
    };
}

function newWorld() {
    return {
        deviceId: Math.random().toString(36).substr(2, 16),
        cemetery: [],                 // { name, lvl, age, born, died } of every killed wizard
        stats: {},                    // lifetime stats across wizards (src/stats.js)
    };
}

function read(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        console.warn(`[save] could not read ${key}`, e);
        return null;
    }
}

function write(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn(`[save] could not write ${key}`, e);
    }
}

// Saved values are laid over a fresh state, so a save from an older v2 build
// picks up any field added since.
function merge(base, saved) {
    for (const [key, value] of Object.entries(saved)) {
        if (value && typeof value === 'object' && !Array.isArray(value) && base[key] && typeof base[key] === 'object') {
            merge(base[key], value);
        } else {
            base[key] = value;
        }
    }
    return base;
}

export const state = newState();
export const world = newWorld();
merge(state, read(SAVE_KEY) || {});
merge(world, read(WORLD_KEY) || {});

let saving = true;

export function saveGame() {
    if (!saving) return;
    write(SAVE_KEY, state);
    write(WORLD_KEY, world);
}

// Simulation mode (src/dev/sim.js): a new wizard and an empty world, never read from or
// written to the saves.
export function freshStart() {
    saving = false;
    for (const key of Object.keys(state)) delete state[key];
    Object.assign(state, newState());
    for (const key of Object.keys(world)) delete world[key];
    Object.assign(world, newWorld());
}

// Kill the wizard: forget the current save (the world, with the cemetery, stays).
// Saving stops so nothing writes the old wizard back before the page reloads.
export function deleteSave() {
    saving = false;
    write(WORLD_KEY, world);
    localStorage.removeItem(SAVE_KEY);
}

setInterval(saveGame, SAVE_EVERY_MS);
window.addEventListener('pagehide', saveGame);
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveGame();
});

// Current value of a trainable skill: the base from config plus what this wizard gained.
export function stat(name) {
    return config.baseStats[name] + (state.statBonus[name] || 0);
}

