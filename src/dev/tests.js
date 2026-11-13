// Wizard Idle v2 - dev tools: the test bar (only while developing).
//
// Loaded by main.js only when DEV is true in config.js; the deploy sets it to false, so
// players never get this file. A thin bar at the bottom of the screen has:
//   - a list of scenarios: each one saves the wizard, reloads the page, prepares the
//     wizard (level, zone, HP...) and forces the first event, then says what to check;
//   - quick actions that change the running game at once (+1 level, gold, speed...);
//   - a command line that runs any typed code; `dev` gives access to the game objects.
//
// Adding a test means adding one entry to `scenarios` below.

import { config } from '../config.js';
import { saveGame, state, world } from '../state.js';
import { fight, run, ui } from '../runtime.js';
import * as loop from '../loop.js';
import { enemySprites } from '../data/enemies.js';
import { zones } from '../data/zones.js';
import { addXP, setLevelValues } from '../wizard.js';
import { pauseToggle } from '../game.js';
import { drawWizard, loadNPC, playHydraGrow, playWizardAnim, print, updateHeading } from '../ui/render.js';
import { playEnemyMove } from '../ui/enemyMoves.js';
import { spell } from '../spells.js';

const PENDING_KEY = 'wizardidle2:devScenario';   // scenario to prepare after the reload
const SPEED_KEY = 'wizardidle2:devSpeed';
const HIDDEN_KEY = 'wizardidle2:devBarHidden';    // hidden from Help > Developer tools
const EVENT = { enemy: 1, explore: 2, shrine: 3, inn: 4, study: 5 };

// ---------------------------------------------------------------- helpers for scenarios

// Put the wizard at the start of a level, with full HP (no level-up message or chapter).
function setLevel(lvl) {
    state.player.lvl = lvl;
    setLevelValues();
    state.player.xp = state.player.xpPast;
}

// XP just short of the next level, so the next XP gained levels up.
function almostLevelUp() {
    state.player.xp = state.player.xpNext - state.player.xpPerEnemy * 0.01;
}

// Enough XP that the next XP gained crosses two levels at once.
function twoLevelsAhead() {
    const p = config.balance;
    state.player.xp = Math.pow(state.player.lvl + 1, p.rXP) * p.factorHP - state.player.xpPerEnemy * 0.01;
}

function moveTo(zone) {
    state.zone.current = zone;
}

// The first sprite with a flag (rare, corrupted) whose family lives in some zone.
function findSprite(flag) {
    for (const [zoneName, zone] of Object.entries(zones)) {
        const families = zone.enemies.toLowerCase().split(',');
        const sprite = Object.keys(enemySprites).find((s) => enemySprites[s][flag] && families.includes(s.replace(/\d+$/, '')));
        if (sprite) return { zone: zoneName, sprite };
    }
}

// Config values changed only until the forced event has run.
const overridden = [];
function override(group, values) {
    for (const [key, value] of Object.entries(values)) {
        overridden.push([group, key, config[group][key]]);
        config[group][key] = value;
    }
}
function restoreOverrides() {
    for (const [group, key, value] of overridden.splice(0)) config[group][key] = value;
}

// The next enemy event is a normal enemy (no boss, hydra or level 190+ guardian).
function normalEnemy() {
    override('balance', { pGetBoss: 0, pGetHydra: 0, pGetGuardian: 0 });
    return EVENT.enemy;
}

// The next explore event is a plain walk, which gives half an enemy's XP (no loot, dice
// house or zone change; the Town always has the dice house, a v1 bug, so leave it).
function walkForXP() {
    if (state.zone.current == 'el_Poblado') moveTo('la_Pradera');
    override('balance', { pDados: 0 });
    override('baseStats', { pBotin: 0, pChangeZone: 0 });
    return EVENT.explore;
}

// ---------------------------------------------------------------- scenarios
// setup() runs after the reload, before the game starts. It edits the wizard and returns
// the first event to force ({ event, enemy }). `check` is what to look at.

const scenarios = [
    {
        name: 'Chapter: level 9 to 10',
        check: 'Walks on, levels up, and the level 10 chapter scroll opens once. Closing it resumes the game.',
        setup() { setLevel(9); almostLevelUp(); return { event: walkForXP() }; },
    },
    {
        name: 'Two levels at once with a chapter (9 to 11)',
        check: 'Levels 10 and 11 at once: the level 10 chapter text shows, no error in the browser console (v1 crashed here).',
        setup() { setLevel(9); twoLevelsAhead(); return { event: walkForXP() }; },
    },
    {
        name: 'Boss fight',
        check: 'A Boss (red name, boss icon) with 2.5x HP; winning pays 5x gold.',
        setup() {
            override('balance', { pGetBoss: 1, pGetGuardian: 0, pGetHydra: 0 });
            return { event: EVENT.enemy };
        },
    },
    {
        name: 'Wizard falls (1 HP)',
        check: 'The wizard falls. Touch him to revive, or wait for the self-revive (2 min, 12 s at speed x10), which costs faith.',
        setup() { state.player.hp = 1; return { event: normalEnemy() }; },
    },
    {
        name: 'Shrine and offering',
        check: 'Enters a shrine, offers gold, prays; the faith gained is shown.',
        setup() {
            override('baseStats', { pFindCapel: 1, pOfrenda: 1 });
            state.player.gold = Math.max(state.player.gold, 1000);
            return { event: EVENT.shrine };
        },
    },
    {
        name: 'Inn rest (City)',
        check: 'Tired, rests at the inn, wakes up. Known v1 text bug: "totally renewed" also shows after a partial rest.',
        setup() { moveTo('la_Ciudad'); state.player.hp = Math.floor(state.player.hpBase / 2); return { event: EVENT.inn }; },
    },
    {
        name: 'Dice house 6-5-4 (City)',
        check: 'Enters the gaming house; the 6-5-4 game plays and ends, gold changes.',
        setup() {
            moveTo('la_Ciudad');
            override('balance', { pDados: 1 });
            override('baseStats', { pBotin: 0 });
            state.player.gold = Math.max(state.player.gold, 1000);
            return { event: EVENT.explore };
        },
    },
    {
        name: 'Level 210 fight',
        check: 'The fight works and the wizard sprite shows (v1 crashed attacking at level 210+).',
        setup() { setLevel(210); return { event: normalEnemy() }; },
    },
    {
        name: 'Hydra (Swamp)',
        check: 'A hydra fight; each head cut off grows back as a bigger hydra. Note: marks the hydra mystery solved for this wizard.',
        setup() {
            moveTo('el_Pantano');
            state.hydraMysteryResolved = true;
            override('balance', { pGetHydra: 1, pGetGuardian: 0 });
            return { event: EVENT.enemy };
        },
    },
    {
        name: 'Rare enemy',
        check: 'The enemy name has (RARE); winning gives double XP.',
        setup() { const f = findSprite('rare'); moveTo(f.zone); return { event: normalEnemy(), enemy: f.sprite }; },
    },
    {
        name: 'Corrupted enemy',
        check: 'Winning cleanses the corrupted enemy and gains faith.',
        setup() { const f = findSprite('corrupted'); moveTo(f.zone); return { event: normalEnemy(), enemy: f.sprite }; },
    },
    {
        name: 'Guardian freeze (level 191, v1 bug)',
        check: 'Known v1 bug: above level 190 a "guardian" fight does nothing and the game stops until reload. Fix planned.',
        setup() { setLevel(191); override('balance', { pGetGuardian: 1 }); return { event: EVENT.enemy }; },
    },
];

// ---------------------------------------------------------------- quick actions (no reload)

const actions = [
    { name: '+1 level', run() { state.player.xp = state.player.xpNext; addXP(0); } },
    { name: '+1000 gold', run() { state.player.gold += 1000; updateHeading(); } },
    { name: '+faith (one level of HP)', run() { state.player.faith += state.player.hpBase; updateHeading(); } },
    { name: 'Full HP', run() { state.player.hp = Math.floor(state.player.hpBase); updateHeading(); } },
    { name: 'Animation: cast', run() { playWizardAnim('cast'); } },
    { name: 'Animation: walk', run() { playWizardAnim('walk'); } },
    { name: 'Animation: pray (loops)', run() { playWizardAnim('pray'); } },
    { name: 'Animation: fall (then fallen + skull)', run() { playWizardAnim('fall_sit'); } },
    { name: 'Animation: true death (preview only)', run() { playWizardAnim('fall_dead'); } },
    { name: 'Stand up (normal sprite)', run() { drawWizard(); } },
    { name: 'Wizard cast: fire spell', run() { playWizardAnim('cast', 'spellSparkYellow_8'); } },
    { name: 'Wizard cast: staff hit', run() { playWizardAnim('cast', 'spellPush9'); } },
    { name: 'Hydra grows a head (Swamp mother, 3 to 4)', run() { loadNPC('mother4'); playHydraGrow('mother', 3); } },
    { name: 'Hydra grows a head (ice hydra, 1 to 2)', run() { loadNPC('icedra2'); playHydraGrow('icedra', 1); } },
    { name: 'Enemy move: slash (warrior)', run() { previewEnemy('el_guerrero11', { kind: 'slash' }); } },
    { name: 'Enemy move: pounce (creature)', run() { previewEnemy('animalejo24', { kind: 'pounce' }); } },
    { name: 'Enemy move: slam (ent)', run() { previewEnemy('el_ent3', { kind: 'slam' }); } },
    { name: 'Enemy move: shoot (elf)', run() { previewEnemy('el_elfo1', { kind: 'shoot' }); } },
    { name: 'Enemy move: thrust (warrior)', run() { previewEnemy('el_guerrero2', { kind: 'thrust' }); } },
    { name: 'Enemy move: smash (ogre)', run() { previewEnemy('el_ogro3', { kind: 'smash' }); } },
    { name: 'Enemy move: charge (cowren)', run() { previewEnemy('el_tauren1', { kind: 'charge' }); } },
    { name: 'Enemy move: cast frost (wizard)', run() { previewEnemy('el_hechicero2', { kind: 'cast', school: 'frost' }); } },
    { name: 'Crisp pixels on / off', run() {
        ui.crisp = !ui.crisp;
        document.documentElement.classList.toggle('crisp', ui.crisp);
        drawWizard();
        if (state.npc) loadNPC(state.npc);
        devPrint(ui.crisp ? 'crisp pixels' : 'smoothed (as before 2.2)');
    } },
    { name: 'Speed x1 / x10', run() { setSpeed(loop.getSpeed() == 1 ? 10 : 1); } },
    { name: 'Pause / resume', run() { pauseToggle(); devPrint(run.pause ? 'paused after this event' : 'resumed'); } },
];

// Show an enemy and play one of its attack moves (the spell effect lands on the wizard).
function previewEnemy(sprite, move) {
    loadNPC(sprite);
    setTimeout(() => playEnemyMove(move, () => spell(move.kind == 'cast' ? { frost: 'spellPush8' }[move.school] || 'spellPush1' : 'spellPush9', true)), 300);
}

function setSpeed(factor) {
    loop.setSpeed(factor);
    try { sessionStorage.setItem(SPEED_KEY, factor); } catch (e) { /* private mode */ }
    if (bar) bar.speed.textContent = factor == 1 ? '' : `x${factor}`;
}

// ---------------------------------------------------------------- running a scenario

function runScenario(index) {
    try { localStorage.setItem(PENDING_KEY, String(index)); } catch (e) { return devPrint('no localStorage', true); }
    saveGame();
    location.reload();
}

// After the reload: prepare the wizard and queue the forced event (main.js waits for this
// file before starting the game).
function preparePending() {
    let index;
    try {
        index = localStorage.getItem(PENDING_KEY);
        localStorage.removeItem(PENDING_KEY);
    } catch (e) { return; }
    const scenario = scenarios[index];
    if (index === null || !scenario) return;
    if (state.firstUse) return console.warn('[dev] create a wizard first');
    const first = scenario.setup() || {};
    run.forceOnce = first.event;
    run.forceEnemy = first.enemy;
    saveGame();
    // the overrides last until the forced event has been picked
    const watch = setInterval(() => {
        if (run.forceOnce === undefined) { restoreOverrides(); clearInterval(watch); }
    }, 50);
    return scenario;
}

// ---------------------------------------------------------------- the bar

function devPrint(text, error = false) {
    print(`<span style='color:${error ? 'Red' : 'DarkRed'}'>DEV: ${text}</span>`);
}

// Command line: runs typed code in the page (like v1's exe()), with `dev` for the game.
function runCommand(code) {
    try {
        const result = (0, eval)(code);
        devPrint(String(result));
        console.log('[dev]', result);
    } catch (error) {
        devPrint(`error: ${error.message}`, true);
    }
}

let bar;
function buildBar(prepared) {
    const style = document.createElement('style');
    style.textContent = `
        #devBar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 9999; display: flex; flex-wrap: wrap;
            gap: 4px 6px; align-items: center; padding: 4px 8px; background: rgba(20, 10, 10, 0.88); color: #eee;
            font: 12px/1.3 sans-serif; }
        #devBar select, #devBar input, #devBar button { font: inherit; }
        #devBar select { max-width: 60vw; }
        #devBar input { flex: 1 1 140px; min-width: 0; }
        #devBar .devCheck { flex-basis: 100%; color: #fc6; }
        #devBar .devTag { font-weight: bold; color: #f88; cursor: pointer; }
        #devBar.devClosed > :not(.devTag) { display: none; }
    `;
    document.head.appendChild(style);

    const root = document.createElement('div');
    root.id = 'devBar';
    root.innerHTML = `
        <span class="devTag" title="Hide or show the dev bar">DEV</span><span class="devSpeed"></span>
        <select>
            <optgroup label="Scenarios (reload)">${scenarios.map((s, i) => `<option value="s${i}">${s.name}</option>`).join('')}</optgroup>
            <optgroup label="Actions (now)">${actions.map((a, i) => `<option value="a${i}">${a.name}</option>`).join('')}</optgroup>
        </select>
        <button>Run</button>
        <input type="text" placeholder="command, e.g. dev.state.player.gold = 5000" spellcheck="false">
        <div class="devCheck"></div>`;
    document.body.appendChild(root);

    bar = {
        select: root.querySelector('select'),
        check: root.querySelector('.devCheck'),
        speed: root.querySelector('.devSpeed'),
    };
    const showCheck = () => {
        const v = bar.select.value;
        bar.check.textContent = v[0] == 's' ? `Check: ${scenarios[v.slice(1)].check}` : '';
    };
    bar.select.onchange = showCheck;
    root.querySelector('button').onclick = () => {
        const v = bar.select.value;
        if (v[0] == 's') runScenario(Number(v.slice(1)));
        else actions[v.slice(1)].run();
    };
    root.querySelector('input').onkeydown = (e) => {
        if (e.key == 'Enter' && e.target.value.trim()) { runCommand(e.target.value); e.target.select(); }
    };
    root.querySelector('.devTag').onclick = () => root.classList.toggle('devClosed');

    // Help > Developer tools hides or shows the whole bar, remembered in this browser
    let hidden = false;
    try { hidden = localStorage.getItem(HIDDEN_KEY) == '1'; } catch (e) { /* private mode */ }
    root.style.display = hidden ? 'none' : '';
    document.addEventListener('wizardidle:toggleDevBar', () => {
        hidden = !hidden;
        root.style.display = hidden ? 'none' : '';
        try { localStorage.setItem(HIDDEN_KEY, hidden ? '1' : '0'); } catch (e) { /* private mode */ }
    });

    if (prepared) {
        bar.select.value = `s${scenarios.indexOf(prepared)}`;
        bar.check.textContent = `Running "${prepared.name}". Check: ${prepared.check}`;
    } else {
        showCheck();
    }
}

// ---------------------------------------------------------------- start

const prepared = preparePending();
let savedSpeed = 1;
try { savedSpeed = Number(sessionStorage.getItem(SPEED_KEY)) || 1; } catch (e) { /* private mode */ }
buildBar(prepared);
setSpeed(savedSpeed);

// For the command line and the browser console.
window.dev = { state, world, config, run, fight, ui, loop, scenarios, actions, setLevel, setSpeed, runScenario };
