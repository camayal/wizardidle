// Wizard Idle v2 - dev tools: the dev panel (only while developing).
//
// Loaded by main.js only when DEV is true in config.js; the deploy sets it to false, so
// players never get this file. A panel beside the game (src/dev/panel.js) has menus:
//   - modes, opened in a panel on the other side: sounds (src/dev/sounds.js), art
//     (src/dev/art.js) and texts (src/dev/texts.js); the game waits while one is open;
//   - scenarios: each one saves the wizard, reloads the page, prepares the wizard (level,
//     zone, HP...) and forces the first event, then says what to check;
//   - pickers (lists plus a button) that change the running game at once: the wizard (level,
//     pose, animation, gifts), a boss, a hydra, an enemy (exact or random by attack, rare,
//     arrival), each fight with a chosen arrival;
//   - a few quick actions (speed, pause...);
//   - a command line that runs any typed code; `dev` gives access to the game objects.
//
// Adding a test means adding one entry to `scenarios` or `actions`, or an option to a picker.

import { config } from '../config.js';
import { saveGame, state, world } from '../state.js';
import { fight, run, ui } from '../runtime.js';
import * as loop from '../loop.js';
import { enemySprites, enemyTypes } from '../data/enemies.js';
import { zones } from '../data/zones.js';
import { addXP, setLevelValues } from '../wizard.js';
import { pauseToggle } from '../game.js';
import { clearNPC, drawWizard, drawWizardPose, loadNPC, playWizardAnim, showStage, updateHeading } from '../ui/render.js';
import { ARRIVALS, PORTALS, entranceKind } from '../ui/entrances.js';
import { meleeMoveOf } from '../ui/enemyMoves.js';
import { endEvent, nextEvent } from '../events.js';
import { scrollOpen } from '../ui/scrolls.js';
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

// Enough XP that the next XP gained reaches level `target` in one go.
function xpToReach(target) {
    const p = config.balance;
    state.player.xp = Math.pow(target - 1, p.rXP) * p.factorHP - state.player.xpPerEnemy * 0.01;
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
        name: 'Two chapters at once (9 to 30)',
        check: 'Jumps to level 30: the Chapter I scroll opens; closing it opens Chapter II (the shrine), and only closing that one resumes the game.',
        setup() { setLevel(9); xpToReach(30); return { event: walkForXP() }; },
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
        check: 'Tired, rests at the inn, wakes up.',
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
    { group: 'Modes', name: 'Music: write and play songs made with code', run() { openMode('music'); } },
    { group: 'Modes', name: 'Texts: read and edit the story, dreams and console lines in place', run() { openMode('texts'); } },

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

    { group: 'Cemetery', name: 'Add sample tombs (all five, whole and erased) and open it', run() {
        world.cemetery = world.cemetery.filter((w) => !w.sample);
        const names = ['Orin', "D'Arcy", 'Zephyra', 'Barnaby the Bold', 'Maë-Lin'];
        const day = (n) => new Date(Date.now() - n * 864e5).toISOString();
        ['a', 'b', 'c', 'd', 'e'].forEach((tomb, i) => {
            for (const erased of [false, true]) world.cemetery.push({ sample: true, tomb, erased,
                name: erased ? `${names[i]} II` : names[i], lvl: [12, 57, 140, 199, 210][i], age: [37, 112, 1234, 9, 3400000][i],
                born: day(40 - i * 3), died: day(20 - i * 3), kills: 50 * (i + 1), falls: i * 2 });
        });
        saveGame();
        ui.scrollViews.kill = 'cemetery';
        scrollOpen('kill');
        devPrint('10 sample tombs added (top row whole, cracked ones are the erased)');
    } },
    { group: 'Cemetery', name: 'Remove the sample tombs', run() {
        world.cemetery = world.cemetery.filter((w) => !w.sample);
        saveGame();
        devPrint('sample tombs removed');
    } },
];

// ---------------------------------------------------------------- pickers (lists plus a button)

const HYDRA_NAMES = { mother: 'Swamp hydra', icedra: 'Ice hydra', hydskon: 'Dunes hydra' };
const HYDRA_ZONE = { mother: 'el_Pantano', icedra: 'la_Tundra', hydskon: 'las_Dunas' };
const HYDRA_MAX = { mother: 10, icedra: 5, hydskon: 5 };
const LEVELS = [1, 5, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 189, 190, 191, 200, 209, 210];
const POSES = ['fallen', 'dead', 'stone'];
const ANIMS = ['cast', 'walk', 'pray', 'fall_sit', 'fall_dead', 'petrify', 'unpetrify'];
const MOVES = ['slash', 'thrust', 'smash', 'shoot', 'charge', 'pounce', 'slam'];
const GIFTS = {
    '+1000 gold': () => { state.player.gold += 1000; },
    '+1 million gold': () => { state.player.gold += 1e6; },
    '+faith (one level of HP)': () => { state.player.faith += state.player.hpBase; },
    'Full HP': () => { state.player.hp = Math.floor(state.player.hpBase); },
    'Half HP': () => { state.player.hp = Math.floor(state.player.hpBase / 2); },
    '1 HP (falls at the next blow)': () => { state.player.hp = 1; },
};

// Normal enemies only (no boss or hydra), with what the filters need.
const BOSS_NAMES = new Set(Object.values(zones).map((z) => z.boss));
const enemyList = Object.keys(enemySprites).filter((s) => {
    const family = s.replace(/\d+$/, '');
    return /\d$/.test(s) && enemyTypes[family] && !BOSS_NAMES.has(family) && !HYDRA_NAMES[family];
}).sort();
const familyOf = (s) => s.replace(/\d+$/, '');
const isCaster = (s) => enemySprites[s].type != 'melee';

// Random picks: label -> test on a sprite.
const ENEMY_PICKS = {
    'random: any enemy': () => true,
    'random: caster (magic)': isCaster,
    'random: melee (any move)': (s) => !isCaster(s),
    ...Object.fromEntries(MOVES.map((m) => [`random: melee ${m}`, (s) => !isCaster(s) && meleeMoveOf(familyOf(s)) == m])),
    'random: rare': (s) => enemySprites[s].rare,
    'random: rare mage (portal a/b/c)': (s) => enemySprites[s].rare && entranceKind(s) == 'blink',
    'random: corrupted': (s) => enemySprites[s].corrupted,
    ...Object.fromEntries(['walk', 'fly', 'float', 'rise', 'jump', 'blink'].map((k) =>
        [`random: arrives by ${k == 'blink' ? 'magic (mages)' : k}`, (s) => entranceKind(s) == k])),
};
const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

function pickerHtml() {
    const opts = (list, labels = list) => list.map((x, i) => `<option value="${x}">${labels[i]}</option>`).join('');
    const portals = Object.keys(PORTALS).map((x) => `portal:${x}`);
    const arrival = `<label>Arrival <select data-f="arrival"><option value="">its own way</option>${opts(ARRIVALS.map((x) => x == 'portal' ? 'portal' : x),
        ARRIVALS.map((x) => x == 'portal' ? 'portal (random a/b/c)' : x))}${opts(portals, portals.map((x) => x.slice(10).replace('_', ' ')))}</select></label>`;
    const bossZones = Object.keys(zones).filter((z) => zones[z].boss && enemyTypes[zones[z].boss]);
    const bossLabels = bossZones.map((z) => `${enemyTypes[zones[z].boss].name} (${zones[z].name || z})`);
    return {
        Wizard: `
            <div class="row"><label>Level <select data-f="level">${opts(LEVELS)}</select></label>
                <button data-do="setLevel">Set</button><button data-do="levelDown">-1</button><button data-do="levelUp">+1 (level up)</button></div>
            <div class="row"><select data-f="look">
                <optgroup label="Poses">${opts(POSES.map((x) => `pose:${x}`), POSES)}</optgroup>
                <optgroup label="Animations">${opts(ANIMS.map((x) => `anim:${x}`), ANIMS)}</optgroup>
                <option value="stand">standing (back to normal)</option></select>
                <button data-do="look">Show</button></div>
            <div class="row"><select data-f="gift">${opts(Object.keys(GIFTS))}</select><button data-do="gift">Apply</button></div>`,
        Bosses: `
            <div class="row"><select data-f="boss">${opts(bossZones, bossLabels)}</select></div>
            <div class="row">${arrival}<label><input type="checkbox" data-f="petrify"> gaze always petrifies (Medusa)</label></div>
            <div class="row"><button data-do="boss">Fight</button></div>`,
        Hydras: `
            <div class="row"><select data-f="hydra">${opts(Object.keys(HYDRA_NAMES), Object.values(HYDRA_NAMES))}</select>
                <label>Heads <select data-f="heads"></select></label><button data-do="hydra">Fight</button></div>`,
        Enemies: `
            <div class="row"><select data-f="pick">${opts(Object.keys(ENEMY_PICKS))}<option value="exact">exact sprite (below)</option></select></div>
            <div class="row"><input type="text" data-f="sprite" list="devEnemyList" spellcheck="false" placeholder="sprite, e.g. el_hechicero10">
                <datalist id="devEnemyList">${enemyList.map((x) => `<option value="${x}">${enemySprites[x].rare ? 'rare ' : ''}${enemySprites[x].type}</option>`).join('')}</datalist></div>
            <div class="row">${arrival}<button data-do="enemy">Fight</button></div>`,
    };
}

// The pickers' buttons: f gives a list's value in the same section.
const pickerActions = {
    setLevel(f) { setLevel(Number(f('level'))); afterWizardChange(); },
    levelDown() { setLevel(Math.max(1, state.player.lvl - 1)); afterWizardChange(); },
    levelUp() { state.player.xp = state.player.xpNext; addXP(0); },
    look(f) {
        const [kind, name] = f('look').split(':');
        ui.petrified = false;
        if (kind == 'pose') drawWizardPose(name);
        else if (kind == 'anim') { if (name == 'unpetrify') ui.petrified = true; playWizardAnim(name); }
        else drawWizard();
    },
    gift(f) { GIFTS[f('gift')](); updateHeading(); },
    boss(f) {
        const zone = f('boss'), petrify = f('petrify');
        liveFight(() => {
            if (petrify) override('balance', { petrifyChance: 1 });
            return bossIn(zone);
        }, f('arrival'));
    },
    hydra(f) { const h = f('hydra'); liveFight(() => hydraIn(HYDRA_ZONE[h], h, Number(f('heads')))); },
    enemy(f) {
        let sprite = f('sprite').trim();
        if (f('pick') != 'exact') {
            const list = enemyList.filter(ENEMY_PICKS[f('pick')]);
            if (!list.length) return devPrint(`no enemy for "${f('pick')}"`, true);
            sprite = pickRandom(list);
        } else if (!enemyList.includes(sprite)) return devPrint(`unknown sprite "${sprite}"`, true);
        devPrint(`fight: ${sprite} (${enemySprites[sprite].type}${enemySprites[sprite].rare ? ', rare' : ''})`);
        liveFight(() => enemyNamed(sprite), f('arrival'));
    },
};

function afterWizardChange() {
    drawWizard();
    updateHeading();
    devPrint(`level ${state.player.lvl}`);
}

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
    run.forceEntrance = undefined;
    state.player.hp = Math.floor(state.player.hpBase);
    clearNPC();
    showStage();
    drawWizard();
    updateHeading();
}

// A real fight now: the current event ends, setup() prepares it (zone, chances) and returns
// the event to force, which starts right away; config changes last until it is picked.
function liveFight(setup, arrival) {
    resetScene();
    const first = setup();
    showStage();
    run.forceOnce = first.event;
    run.forceEnemy = first.enemy;
    run.forceEntrance = arrival || undefined;
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
    const pickers = pickerHtml();
    panel.body.innerHTML = `
        <div class="row"><span class="muted devSpeed"></span></div>
        ${section('Modes', 'Modes', `<div class="devList">${groupHtml('Modes')}</div>`)}
        ${Object.entries(pickers).map(([key, inner]) => section(key, key, `<div data-picker="${key}">${inner}</div>`)).join('')}
        ${section('Scenarios', 'Scenarios (reload the page)', `<div class="row"><select class="devScenario">${scenarios.map((sc, i) => `<option value="${i}">${sc.name}</option>`).join('')}</select>
            <button data-do="scenario">Run</button></div>`)}
        ${groups.filter((g) => g != 'Modes').map((g) => section(g, g, `<div class="devList">${groupHtml(g)}</div>`)).join('')}
        ${section('Command', 'Command line', `<div class="row"><input type="text" placeholder="e.g. dev.state.player.gold = 5000" spellcheck="false"></div>`)}
        <div class="note devCheck"></div>
        <div class="log"></div>`;
    buildNotesBox(panel.body);

    bar = { root: panel.root, check: panel.body.querySelector('.devCheck'), speed: panel.body.querySelector('.devSpeed'),
        log: panel.body.querySelector('.log') };

    const scenarioList = panel.body.querySelector('.devScenario');
    const showCheck = () => { bar.check.textContent = `Check: ${scenarios[scenarioList.value].check}`; };
    scenarioList.onchange = showCheck;
    panel.body.onclick = (e) => {
        const d = e.target.dataset || {};
        if (d.do == 'scenario') return runScenario(Number(scenarioList.value));
        if (d.do) {                                 // a picker's button: read the lists of its section
            const box = e.target.closest('[data-picker]');
            const f = (name) => { const node = box.querySelector(`[data-f="${name}"]`); return node.type == 'checkbox' ? node.checked : node.value; };
            bar.check.textContent = '';
            return pickerActions[d.do](f);
        }
        if (d.run) { bar.check.textContent = ''; actions[d.run.slice(1)].run(); }
    };
    // the hydra's head list follows the hydra
    const hydra = panel.body.querySelector('[data-f="hydra"]'), heads = panel.body.querySelector('[data-f="heads"]');
    const fillHeads = () => { heads.innerHTML = Array.from({ length: HYDRA_MAX[hydra.value] }, (_, i) => `<option>${i + 1}</option>`).join(''); };
    hydra.onchange = fillHeads;
    fillHeads();
    // the level list starts at the wizard's level
    const level = panel.body.querySelector('[data-f="level"]');
    level.value = String(LEVELS.filter((l) => l <= state.player.lvl).pop() || 1);
    panel.body.querySelector('[data-key="Command"] input').onkeydown = (e) => {
        if (e.key == 'Enter' && e.target.value.trim()) { runCommand(e.target.value); e.target.select(); }
    };

    // unfolded menus are remembered
    let open = ['Modes', 'Enemies'];
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

// For the command line and the browser console.
window.dev = { state, world, config, run, fight, ui, loop, scenarios, actions, setLevel, setSpeed, runScenario, openMode, closeMode };
