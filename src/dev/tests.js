// Wizard Idle v2 - dev tools: the dev panel (only while developing).
//
// Loaded by main.js only when DEV is true in config.js; the deploy sets it to false, so
// players never get this file. A panel beside the game (src/dev/panel.js) has menus:
//   - modes, opened in a panel on the other side: sounds (src/dev/sounds.js) and art
//     (src/dev/art.js); the game waits while one is open;
//   - scenarios: each one saves the wizard, reloads the page, prepares the wizard (level,
//     zone, HP...) and forces the first event, then says what to check;
//   - quick actions that change the running game at once (fights, +1 level, gold, speed...);
//   - a command line that runs any typed code; `dev` gives access to the game objects.
//
// Adding a test means adding one entry to `scenarios` or `actions` below.

import { config } from '../config.js';
import { saveGame, state, world } from '../state.js';
import { fight, run, ui } from '../runtime.js';
import * as loop from '../loop.js';
import { enemySprites } from '../data/enemies.js';
import { zones } from '../data/zones.js';
import { addXP, setLevelValues } from '../wizard.js';
import { pauseToggle } from '../game.js';
import { clearNPC, drawWizard, loadNPC, showStage, updateHeading } from '../ui/render.js';
import { endEvent, nextEvent } from '../events.js';
import { sidePanel } from './panel.js';
import { buildNotesBox, setNoteSource } from './notes.js';

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
        name: 'Sleep: Town inn, with a dream',
        check: 'Walks in, pays, walks slowly to the middle of the inn, the scene goes dark, the chapter dream shows over the dark, he is back in his place, walks out.',
        setup() {
            moveTo('el_Poblado');
            run.storyDream = 'chapter';
            state.player.gold = Math.max(state.player.gold, 1e9);       // enough for a bed at any level
            state.player.hp = Math.floor(state.player.hpBase / 2);
            return { event: EVENT.inn };
        },
    },
    {
        name: 'Sleep: camping, with a dream',
        check: 'He walks a few steps, lays the sleeping bag, the dark with the dream after a fall (a nightmare, reddish), he is back in his place and goes on.',
        setup() {
            moveTo('el_Bosque');
            run.storyDream = 'fall';
            state.player.hp = Math.floor(state.player.hpBase / 2);
            return { event: EVENT.inn };
        },
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
        name: 'Guardian chance (level 191)',
        check: 'Above level 190 the guardian chance starts a normal fight (v1 froze here until a reload).',
        setup() { setLevel(191); override('balance', { pGetGuardian: 1 }); return { event: EVENT.enemy }; },
    },
];

// ---------------------------------------------------------------- quick actions (no reload)
// Shown in the dev panel by group; sub starts a small heading inside the group.

const actions = [
    { group: 'Modes', name: 'Sounds: choose a sound for a move', run() { openMode('sounds'); } },
    { group: 'Modes', name: 'Art: play animations, scenes and other art', run() { openMode('art'); } },

    { group: 'Wizard', name: '+1 level', run() { state.player.xp = state.player.xpNext; addXP(0); } },
    { group: 'Wizard', name: '+1000 gold', run() { state.player.gold += 1000; updateHeading(); } },
    { group: 'Wizard', name: '+faith (one level of HP)', run() { state.player.faith += state.player.hpBase; updateHeading(); } },
    { group: 'Wizard', name: 'Full HP', run() { state.player.hp = Math.floor(state.player.hpBase); updateHeading(); } },

    // real fights: the current event ends and this one starts (the game's own fight code)
    { group: 'Fight now', sub: 'Bosses', name: 'Medusa (Desert)', run() { liveFight(() => bossIn('el_Desierto')); } },
    { group: 'Fight now', name: 'Medusa, her gaze always petrifies', run() { liveFight(() => { override('balance', { petrifyChance: 1 }); return bossIn('el_Desierto'); }); } },
    { group: 'Fight now', name: 'Protromus (Cave, earthquake)', run() { liveFight(() => bossIn('la_Cueva')); } },
    { group: 'Fight now', name: 'Goro (Prairie, charge)', run() { liveFight(() => bossIn('la_Pradera')); } },
    { group: 'Fight now', name: 'Fenix (Volcano)', run() { liveFight(() => bossIn('el_Volcan')); } },
    { group: 'Fight now', name: 'King Midas (Tower)', run() { liveFight(() => bossIn('la_Torre')); } },
    { group: 'Fight now', name: 'Kkck (Town, poison cloud)', run() { liveFight(() => bossIn('el_Poblado')); } },
    { group: 'Fight now', sub: 'Hydras', name: 'Swamp hydra, 4 heads', run() { liveFight(() => hydraIn('el_Pantano', 'mother', 4)); } },
    { group: 'Fight now', name: 'Ice hydra, 3 heads', run() { liveFight(() => hydraIn('la_Tundra', 'icedra', 3)); } },
    { group: 'Fight now', name: 'Dunes hydra, 2 heads', run() { liveFight(() => hydraIn('las_Dunas', 'hydskon', 2)); } },
    { group: 'Fight now', sub: 'Enemies by attack', name: 'warrior (thrust)', run() { liveFight(() => enemyNamed('el_guerrero2')); } },
    { group: 'Fight now', name: 'creature (pounce)', run() { liveFight(() => enemyNamed('animalejo24')); } },
    { group: 'Fight now', name: 'ent (slam)', run() { liveFight(() => enemyNamed('el_ent3')); } },
    { group: 'Fight now', name: 'elf (shoot)', run() { liveFight(() => enemyNamed('el_elfo1')); } },
    { group: 'Fight now', name: 'ogre (smash)', run() { liveFight(() => enemyNamed('el_ogro3')); } },
    { group: 'Fight now', name: 'cowren (charge)', run() { liveFight(() => enemyNamed('el_tauren1')); } },
    { group: 'Fight now', name: 'rogue (slash)', run() { liveFight(() => enemyNamed('el_pillo3')); } },
    { group: 'Fight now', name: 'wizard (caster)', run() { liveFight(() => enemyNamed('el_hechicero2')); } },
    { group: 'Fight now', sub: 'Enemies by arrival', name: 'walking (orc)', run() { liveFight(() => enemyNamed('el_orco2')); } },
    { group: 'Fight now', name: 'flying (demon)', run() { liveFight(() => enemyNamed('el_demonio1')); } },
    { group: 'Fight now', name: 'floating (spectre)', run() { liveFight(() => enemyNamed('el_espectro3')); } },
    { group: 'Fight now', name: 'from the ground (slime)', run() { liveFight(() => enemyNamed('baba1')); } },
    { group: 'Fight now', name: 'jumping (rogue)', run() { liveFight(() => enemyNamed('el_pillo2')); } },
    { group: 'Fight now', name: 'in a flicker (wizard)', run() { liveFight(() => enemyNamed('el_hechicero1')); } },

    { group: 'Game', name: 'Speed x1 / x10', run() { setSpeed(loop.getSpeed() == 1 ? 10 : 1); } },
    { group: 'Game', name: 'Pause / resume', run() { pauseToggle(); devPrint(run.pause ? 'paused after this event' : 'resumed'); } },
    { group: 'Game', name: 'Crisp pixels on / off', run() {
        ui.crisp = !ui.crisp;
        document.documentElement.classList.toggle('crisp', ui.crisp);
        drawWizard();
        if (state.npc) loadNPC(state.npc);
        devPrint(ui.crisp ? 'crisp pixels' : 'smoothed (as before 2.2)');
    } },
    { group: 'Game', name: 'Back to the game (end the scene, next event)', run() { closeMode(); resetScene(); nextEvent(); } },
];

// What the notes box says when no mode is open: where the game stands.
function gameDetails() {
    const p = state.player, zone = zones[state.zone.current];
    return [
        'Game test',
        `Wizard: level ${p.lvl}, HP ${Math.floor(p.hp)} / ${Math.floor(p.hpBase)}, gold ${Math.floor(p.gold)}, faith ${Math.floor(p.faith)}`,
        `Zone: ${zone ? zone.name : state.zone.current}, stage ${state.zone.stage}`,
        `On the scene: ${state.npc || 'nothing'}${fight.bossCombat ? ' (boss fight)' : fight.hydraCombat ? ' (hydra fight)' : ''}`,
        `Speed x${loop.getSpeed()}${run.pause ? ', paused' : ''}`,
    ].join(String.fromCharCode(10));
}

// ---------------------------------------------------------------- modes (the right panel)
// One mode open at a time: src/dev/sounds.js or src/dev/art.js. The game waits while it is open.

let mode = null, modeName = '';
const modeTools = () => ({ resetScene, setSpeed, devPrint, closed() { mode = null; modeName = ''; setNoteSource(gameDetails); resetScene(); nextEvent(); } });

function openMode(name) {
    if (modeName == name) return;
    closeMode(false);
    modeName = name;
    import(`./${name}.js`)
        .then((m) => { mode = m; return m.open(modeTools()); })
        .catch((error) => { modeName = ''; devPrint(`${name} mode failed: ${error.message}`, true); console.error(error); });
}

// Close the open mode (resume: the game goes on afterwards).
function closeMode(resume = true) {
    if (!mode) return;
    const m = mode;
    mode = null; modeName = '';
    m.close(resume);
}

// End whatever is happening (event, fight, walk, fade, scroll clocks) and put the wizard back
// in his place at full health, with no enemy on the scene.
function resetScene() {
    loop.stopAll();
    endEvent();
    Object.assign(fight, { bossCombat: false, hydraCombat: false, enemy: '', enemyAndNumber: '', enemyHP: 0,
        polymorphed: false, pjDead: false, autorevive: '', bossMultiplier: 1, bossGoldMultiplier: 1 });
    Object.assign(ui, { petrified: false, wizardOffset: 0, findSpot: null });
    run.pause = false;
    state.player.hp = Math.floor(state.player.hpBase);
    clearNPC();
    showStage();
    drawWizard();
    updateHeading();
}

// A real fight now: the current event ends, setup() prepares it (zone, chances) and returns
// the event to force, which starts right away; config changes last until it is picked.
function liveFight(setup) {
    resetScene();
    const first = setup();
    showStage();
    run.forceOnce = first.event;
    run.forceEnemy = first.enemy;
    const watch = setInterval(() => {
        if (run.forceOnce === undefined) { restoreOverrides(); clearInterval(watch); }
    }, 50);
    nextEvent();
}

function bossIn(zone) {
    moveTo(zone);
    override('balance', { pGetBoss: 1, pGetGuardian: 0, pGetHydra: 0 });
    return { event: EVENT.enemy };
}

// (this marks the hydra mystery solved for the current wizard)
function hydraIn(zone, hydra, heads) {
    moveTo(zone);
    state.hydraMysteryResolved = true;
    state.hydraHeads[hydra] = heads;
    override('balance', { pGetHydra: 1, pGetGuardian: 0 });
    return { event: EVENT.enemy };
}

function enemyNamed(sprite) {
    return { event: normalEnemy(), enemy: sprite };
}

function setSpeed(factor) {
    loop.setSpeed(factor);
    try { sessionStorage.setItem(SPEED_KEY, factor); } catch (e) { /* private mode */ }
    if (bar) bar.speed.textContent = factor == 1 ? '' : `speed x${factor}`;
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

// ---------------------------------------------------------------- the dev panel (left side)

// Messages of the dev tools: in the panel's log (and the browser console), not in the game's.
function devPrint(text, error = false) {
    console[error ? 'warn' : 'log']('[dev]', text);
    if (!bar) return;
    const line = document.createElement('div');
    line.textContent = text;
    if (error) line.style.color = '#f88';
    bar.log.prepend(line);
    while (bar.log.childElementCount > 40) bar.log.lastChild.remove();
}

// Command line: runs typed code in the page (like v1's exe()), with `dev` for the game.
function runCommand(code) {
    try {
        const result = (0, eval)(code);
        devPrint(`> ${code}\n${String(result)}`);
    } catch (error) {
        devPrint(`> ${code}\nerror: ${error.message}`, true);
    }
}

const OPEN_KEY = 'wizardidle2:devOpenGroups';     // which menus are unfolded, in this browser

let bar;
function buildBar(prepared) {
    const panel = sidePanel('left', 'Dev tools');
    const groups = [...new Set(actions.map((a) => a.group))];
    const button = (value, label, title = '') => `<button data-run="${value}" title="${title.replace(/"/g, '&quot;')}">${label}</button>`;
    const groupHtml = (g) => {
        let html = '';
        actions.forEach((a, i) => {
            if (a.group != g) return;
            if (a.sub) html += `<div class="devSub">${a.sub}</div>`;
            html += button(`a${i}`, a.name);
        });
        return html;
    };
    const section = (key, title, inner) => `<details data-key="${key}"><summary>${title}</summary>${inner}</details>`;
    panel.body.innerHTML = `
        <div class="row"><span class="muted devSpeed"></span></div>
        ${section('Modes', 'Modes', `<div class="devList">${groupHtml('Modes')}</div>`)}
        ${section('Scenarios', 'Scenarios (reload the page)', `<div class="devList">${scenarios.map((sc, i) => button(`s${i}`, sc.name, sc.check)).join('')}</div>`)}
        ${groups.filter((g) => g != 'Modes').map((g) => section(g, g, `<div class="devList">${groupHtml(g)}</div>`)).join('')}
        ${section('Command', 'Command line', `<div class="row"><input type="text" placeholder="e.g. dev.state.player.gold = 5000" spellcheck="false"></div>`)}
        <div class="note devCheck"></div>
        <div class="log"></div>`;
    buildNotesBox(panel.body);

    bar = { root: panel.root, check: panel.body.querySelector('.devCheck'), speed: panel.body.querySelector('.devSpeed'),
        log: panel.body.querySelector('.log') };

    panel.body.onclick = (e) => {
        const v = e.target.dataset && e.target.dataset.run;
        if (!v) return;
        if (v[0] == 's') runScenario(Number(v.slice(1)));
        else { bar.check.textContent = ''; actions[v.slice(1)].run(); }
    };
    // a scenario's check shows when the pointer is over it
    panel.body.onmouseover = (e) => {
        const v = e.target.dataset && e.target.dataset.run;
        if (v && v[0] == 's') bar.check.textContent = `Check: ${scenarios[v.slice(1)].check}`;
    };
    panel.body.querySelector('input').onkeydown = (e) => {
        if (e.key == 'Enter' && e.target.value.trim()) { runCommand(e.target.value); e.target.select(); }
    };

    // unfolded menus are remembered
    let open = ['Modes', 'Fight now'];
    try { open = JSON.parse(localStorage.getItem(OPEN_KEY)) || open; } catch (e) { /* private mode */ }
    for (const d of panel.body.querySelectorAll('details')) {
        d.open = open.includes(d.dataset.key);
        d.ontoggle = () => {
            const now = [...panel.body.querySelectorAll('details')].filter((x) => x.open).map((x) => x.dataset.key);
            try { localStorage.setItem(OPEN_KEY, JSON.stringify(now)); } catch (e) { /* private mode */ }
        };
    }

    // Help > Developer tools hides or shows the dev panel, remembered in this browser
    let hidden = false;
    try { hidden = localStorage.getItem(HIDDEN_KEY) == '1'; } catch (e) { /* private mode */ }
    panel.root.style.display = hidden ? 'none' : '';
    document.addEventListener('wizardidle:toggleDevBar', () => {
        hidden = !hidden;
        panel.root.style.display = hidden ? 'none' : '';
        try { localStorage.setItem(HIDDEN_KEY, hidden ? '1' : '0'); } catch (e) { /* private mode */ }
    });

    if (prepared) bar.check.textContent = `Running "${prepared.name}". Check: ${prepared.check}`;
}

// ---------------------------------------------------------------- start

const prepared = preparePending();
let savedSpeed = 1;
try { savedSpeed = Number(sessionStorage.getItem(SPEED_KEY)) || 1; } catch (e) { /* private mode */ }
buildBar(prepared);
setSpeed(savedSpeed);
setNoteSource(gameDetails);

// While developing, the game waits when its window can't be seen (minimized, or behind other
// windows: the browser reports both as hidden), so it doesn't play on unwatched.
document.addEventListener('visibilitychange', () => {
    if (document.hidden) loop.freezeGame(); else loop.thawGame();
});

// For the command line and the browser console.
window.dev = { state, world, config, run, fight, ui, loop, scenarios, actions, setLevel, setSpeed, runScenario, openMode, closeMode };
