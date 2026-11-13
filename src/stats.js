// Wizard Idle v2 - stats: everything that happens, counted.
//
// Four kinds, all under dotted names by area (combat.*, kill.*, faith.*, gold.*, ...):
//
//   stats.count("kill.bosses")            a counter: +1 (or +amount)
//   stats.add("gold.fromEnemies", 120)    a total: + an amount
//   stats.max("combat.longestCombo", 12)  a record: kept if higher, with when it happened
//   stats.min("faith.lowest", -310)       a record: kept if lower
//   stats.first("first.bossKill")         a first: written once, with when it happened
//
// Per wizard in state.stats; per world (what outlives every wizard) in world.stats, when
// called with { world: true } (both). Names starting with "world." are only per world.
// A record or a first is { value, lvl, age, date, playTimeMs }.
// v1 and 2.x up to 2.1 had only counters (state.counters, v1: idx_*); they were renamed
// to this scheme without a migration (dev phase, old saves don't matter).

import { state, world } from './state.js';
import { run } from './runtime.js';
import * as loop from './loop.js';

// Play time including the session running now.
export function playTime() {
    const running = run.timeStart === undefined ? 0 : loop.now() - run.timeStart;
    return Math.round(state.meta.playTimeMs + running);
}

function when(value) {
    return { value, name: state.player.name, lvl: state.player.lvl, age: Math.round(state.player.age * 10) / 10, date: new Date().toISOString(), playTimeMs: playTime() };
}

function stores(name, options) {
    if (name.startsWith('world.')) return [world.stats];
    return options && options.world ? [state.stats, world.stats] : [state.stats];
}

export const stats = {
    count(name, amount = 1, options) {
        let result;
        for (const store of stores(name, options)) result = store[name] = (store[name] || 0) + amount;
        return result;
    },
    add(name, amount, options) {
        return this.count(name, amount, options);
    },
    max(name, value, options) {
        for (const store of stores(name, options)) {
            if (store[name] === undefined || value > store[name].value) store[name] = when(value);
        }
    },
    min(name, value, options) {
        for (const store of stores(name, options)) {
            if (store[name] === undefined || value < store[name].value) store[name] = when(value);
        }
    },
    first(name, options) {
        for (const store of stores(name, options)) {
            if (store[name] === undefined) store[name] = when(true);
        }
    },
    // Start a counter again (e.g. the current streak after a fall).
    reset(name) {
        state.stats[name] = 0;
    },
    // The number behind a stat (a record's value), 0 if it never happened.
    get(name, options) {
        const value = (name.startsWith('world.') || (options && options.world) ? world.stats : state.stats)[name];
        return value === undefined ? 0 : typeof value === 'object' ? value.value : value;
    },
};

// One line per level-up, for the playtests now and a chart later (200 lines at most).
export function recordLevel() {
    state.history.push({
        lvl: state.player.lvl,
        playTimeMs: playTime(),
        faith: Math.round(state.player.faith),
        gold: Math.round(state.player.gold),
        falls: stats.get('death.falls'),
        kills: stats.get('kill.enemies'),
    });
    stats.max('world.highestLevel', state.player.lvl, { world: true });
    stats.max('world.oldestAge', Math.round(state.player.age * 10) / 10, { world: true });
}
