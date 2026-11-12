// Wizard Idle v2 - simulation mode: the real game, much faster than real time.
//
//   index.html?sim=1&seed=7&god=active&until=100&set=pDados:0.2,pGetBoss:0.03
//
// Loaded by main.js only with ?sim=1 (normal play never loads it). It plays a new wizard
// on a virtual clock (src/loop.js jumps straight to the next clock that is due), with a
// seeded Math.random so a seed always plays the same run, no sound or spell animations,
// and a god bot (src/dev/bots.js). Nothing is read from or written to the saves.
// At the end it writes a JSON report into <pre id="simReport"> and sets the title to
// "sim done"; tools/playtest.py collects it.
//
// Parameters: seed (1), god (idle), until (level, 200), set (config overrides,
// key:value by commas, from config.balance or config.baseStats), hours (play-time cap
// in virtual hours, 2000).

import { config } from '../config.js';
import { freshStart, state, world } from '../state.js';
import { fight, run, ui } from "../runtime.js";
import * as loop from '../loop.js';
import { setName } from '../game.js';
import { nextEvent } from '../events.js';
import { btnCloseEvent } from '../ui/menu.js';
import { playTime } from '../stats.js';
import { el } from '../ui/dom.js';
import { makeBot } from './bots.js';

const STEPS_PER_BATCH = 5000;

// Between batches the page gets a moment to breathe. A MessageChannel is used instead of
// setTimeout, which browsers throttle hard in hidden and headless pages.
const channel = new MessageChannel();
channel.port1.onmessage = () => drive();
const nextBatch = () => channel.port2.postMessage(0);

// mulberry32: a small, fast seeded generator (0 <= x < 1)
function seeded(seed) {
    let a = seed >>> 0;
    return function () {
        a = (a + 0x6D2B79F5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// "pDados:0.2,pGetBoss:0.03" -> config values for this run; unknown keys are reported.
function applySettings(text) {
    const applied = {}, unknown = [];
    for (const pair of (text || '').split(',').filter(Boolean)) {
        const [key, value] = pair.split(':');
        const group = ['balance', 'baseStats'].find((g) => key in config[g]);
        if (!group) { unknown.push(key); continue; }
        config[group][key] = Number(value);
        applied[key] = Number(value);
    }
    return { applied, unknown };
}

let settings, bot, until, capMs, steps = 0, freezes = 0, startedAt;

export function startSimulation(params) {
    const seed = Number(params.get('seed') || 1);
    until = Number(params.get('until') || 200);
    capMs = Number(params.get('hours') || 2000) * 3600000;
    Math.random = seeded(seed);
    settings = { seed, god: params.get('god') || 'idle', until, ...applySettings(params.get('set')) };
    freshStart();
    run.simulation = true;
    loop.simulate();
    bot = makeBot(params);
    settings.rules = bot.rules;
    startedAt = performance.now();
    el('inputName').value = `Sim ${seed}`;
    setName();
    drive();
}

function drive() {
    for (let i = 0; i < STEPS_PER_BATCH; i++) {
        if (state.player.lvl >= until) return finish('reached level');
        if (playTime() > capMs) return finish('play-time cap');
        if (ui.scrollCurrentContent == 'history') btnCloseEvent();   // a chapter: read at once
        bot.step();
        if (!loop.step()) {
            // Nothing is running. Known v1 bug: above level 190 the empty guardian branch
            // in enemyEV() starts no next event. A player would reload; the sim goes on.
            freezes++;
            nextEvent();
        }
        steps++;
    }
    document.title = `sim level ${state.player.lvl}`;
    if (new URLSearchParams(location.search).has("trace")) console.log(`[sim] lvl ${state.player.lvl} steps ${steps} freezes ${freezes} t ${Math.round(loop.now()/1000)} hp ${Math.round(state.player.hp)} dead ${fight.pjDead} clocks ${loop.clockNames()}`);
    nextBatch();
}

function finish(reason) {
    const report = {
        settings, reason, steps, freezes,
        level: state.player.lvl,
        playTimeHours: Math.round(playTime() / 36000) / 100,
        realSeconds: Math.round(performance.now() - startedAt) / 1000,
        player: { ...state.player },
        stats: state.stats,
        history: state.history,
        world: world.stats,
    };
    const pre = document.createElement('pre');
    pre.id = 'simReport';
    pre.textContent = JSON.stringify(report);
    document.body.appendChild(pre);
    document.title = 'sim done';
    console.log('[sim]', reason, `level ${report.level}`, `${report.playTimeHours} h`, `${report.realSeconds} s`);
}
