// Wizard Idle v2 - dev tools: the scene picker shared by the sounds and art modes.
//
// Anything the game can show can be set on the scene and played with the game's own code: the
// wizard's animations and poses at any tier, any enemy's move or arrival, any boss attack, a
// hydra, a scene spell, a spell effect, the dice, any sprite or object, any background. The
// picker is three lists (kind, what, which) and a tier; scenePicker() builds them in a panel.

import { state } from '../state.js';
import { ui } from '../runtime.js';
import * as loop from '../loop.js';
import { enemySprites } from '../data/enemies.js';
import { spells, npcSpells } from '../data/spells.js';
import { zones } from '../data/zones.js';
import { bossAttacks, sceneSpells } from '../data/bossAttacks.js';
import { enemyMoveTiming, playEnemyMove } from '../ui/enemyMoves.js';
import { bossAttackTiming, hydraAttackTiming, playBossAttack, playHydraAttack, playSceneSpell, sceneSpellTiming,
    startHydraIdle } from '../ui/bossAttacks.js';
import { playEntrance } from '../ui/entrances.js';
import { drawFrame, drawWizard, drawWizardPose, loadBackground, loadNPC, npcCanvas, pixelContext, pjCanvas, playHydraGrow,
    playWizardAnim } from '../ui/render.js';
import { spell } from '../spells.js';
import { snd } from '../media.js';

export const TIERS = Array.from({ length: 21 }, (_, i) => i * 10);
const WIZARD_ANIMS = { cast: 700, walk: 1120, pray: 600, fall_sit: 600, fall_dead: 660, petrify: 800, unpetrify: 1000 };   // ms
const POSES = ['fallen', 'dead', 'stone'];
const MOVES = ['slash', 'thrust', 'smash', 'shoot', 'charge', 'pounce', 'slam'];
const SCHOOLS = ['arcane', 'nature', 'fire', 'thunder', 'frost', 'divine'];
const HYDRAS = { mother: 10, icedra: 5, hydskon: 5 };
const HYDRA_SPELL = { mother: 'spellRainGreen_24', icedra: 'spellChispasBlue_8', hydskon: 'spellRainRed_24' };
const DICE = 'spellMiniDados_18', DICE_MS = 18 * 80;
export const DICE_STEP = 1500;          // a new roll every 1.5 s (src/minigames/sixFiveFour.js)
const sprites = Object.keys(enemySprites).sort();
let images = [];                        // img/ files, for "any sprite or object"
let paths = [];                         // the same with their folders (img/wizard/cast/anim_cast0.png)

const move = (v) => v.startsWith('cast ') ? { kind: 'cast', school: v.slice(5) } : { kind: v };
const heads = (v) => parseInt(v);
const listOf = (x) => (Array.isArray(x) ? x : String(x || '').split(',')).filter(Boolean);

// Each kind: targets (the "what" list), variants (the "which" list, for a target), setUp (put it on
// the scene), play(target, variant, onHit) and, when known, timing (ms: when the blow lands,
// how long it lasts) and landing (the spell whose effect and school sound land with the blow).
export const KINDS = {
    enemyMove: { label: 'Enemy: attack', targets: () => sprites, variants: () => [...MOVES, ...SCHOOLS.map((s) => `cast ${s}`)],
        setUp: (t) => loadNPC(t),
        play: (t, v, onHit) => playEnemyMove(move(v), onHit),
        timing: (t, v) => enemyMoveTiming(move(v)),
        landing: (t, v) => v.startsWith('cast') ? null : listOf(npcSpells[(enemySprites[t] || {}).type])[0] || null },
    arrival: { label: 'Enemy: arrival', targets: () => sprites, variants: () => [],
        play: (t) => { loadNPC(t); playEntrance(); } },
    boss: { label: 'Boss: attack', targets: () => Object.keys(bossAttacks), variants: (t) => (bossAttacks[t] || []).map((a) => a.id),
        setUp: (t) => loadNPC(t),
        play: (t, v, onHit) => playBossAttack(t, bossAttackTiming(t, v).attack, false, onHit),
        timing: (t, v) => bossAttackTiming(t, v),
        landing: (t, v) => {                // the spell src/bossEffects.js pairs with this attack
            const zone = Object.values(zones).find((z) => z.boss == t), attacks = bossAttacks[t] || [];
            const index = attacks.findIndex((a) => a.id == v);
            return listOf(zone && zone.bossSpell).find((_, i) => i % attacks.length == index) || null;
        } },
    hydra: { label: 'Hydra', targets: () => Object.keys(HYDRAS),
        variants: (t) => Array.from({ length: HYDRAS[t] || 1 }, (_, i) => i + 1).flatMap((n) =>
            [`${n} heads: strike`, `${n} heads: cast`, ...(n < HYDRAS[t] ? [`${n} heads: grow to ${n + 1}`] : [])]),
        setUp: (t, v) => { loadNPC(`${t}${heads(v)}`); startHydraIdle(); hydraAttackTiming(`${t}${heads(v)}`, HYDRA_SPELL[t], v.includes('cast')); },
        play: (t, v, onHit) => {
            if (v.includes('grow')) { loadNPC(`${t}${heads(v) + 1}`); playHydraGrow(t, heads(v)); return; }
            playHydraAttack(v.includes('cast') ? HYDRA_SPELL[t] : '', onHit, v.includes('cast'));
        },
        timing: (t, v) => v.includes('grow') ? null : hydraAttackTiming(`${t}${heads(v)}`, v.includes('cast') ? HYDRA_SPELL[t] : '', v.includes('cast')),
        landing: (t, v) => {
            const zone = Object.values(zones).find((z) => z.hidrasName == t), list = listOf(zone && zone.hidrasSpells);
            return v.includes('cast') ? HYDRA_SPELL[t] : list[0] || null;
        } },
    scene: { label: 'Scene spell', targets: () => Object.keys(sceneSpells), variants: () => [],
        play: (t, v, onHit) => playSceneSpell(t, onHit), timing: (t) => sceneSpellTiming(t) },
    spell: { label: 'Spell effect', targets: () => Object.keys(spells), variants: () => ['on the wizard', 'on the enemy', 'centered'],
        setUp: () => loadNPC('el_orco2'),
        play: (t, v) => spell(t, v == 'on the wizard', false, v == 'centered'),
        timing: (t) => ({ totalMs: spells[t] && spells[t].ms ? spells[t].frames * spells[t].ms : null }) },
    wizardAnim: { label: 'Wizard: animation', targets: () => Object.keys(WIZARD_ANIMS),
        variants: (t) => t == 'cast' ? ['(plain glint)', ...Object.keys(spells)] : [],
        setUp: (t) => { if (t == 'unpetrify') { ui.petrified = true; drawWizardPose('stone'); } },
        play: (t, v) => { if (t == 'unpetrify') ui.petrified = true; playWizardAnim(t, t == 'cast' && v != '(plain glint)' ? v : undefined); },
        timing: (t) => ({ totalMs: WIZARD_ANIMS[t] }) },
    wizardPose: { label: 'Wizard: pose', targets: () => POSES, variants: () => [], play: (t) => drawWizardPose(t) },
    dice: { label: 'Dice roll (two rolls, 1.5 s apart)', targets: () => ['dice'], variants: () => [],
        play: () => { spell(DICE, true, false, true); setTimeout(() => spell(DICE, true, false, true), DICE_STEP); },
        timing: () => ({ totalMs: DICE_MS, again: DICE_STEP }), current: snd('dice') },
    object: { label: 'Any sprite or object', targets: () => images.filter((n) => !/^(anim_|scene_|spell|fx_|run_|ram_)/.test(n)).map((n) => n.replace(/\.png$/, '')),
        variants: () => [], setUp: (t) => loadNPC(t), play: (t) => loadNPC(t) },
    background: { label: 'Background', targets: () => Object.keys(zones),
        variants: () => ['1', '2', '3', '4', '5', 'altar', 'estatua'],
        setUp: (t, v) => loadBackground(`${t}${/^\d$/.test(v) ? v : `_${v}`}`),
        play: (t, v) => loadBackground(`${t}${/^\d$/.test(v) ? v : `_${v}`}`) },
};

// Every image's file name (img/ and its folders), from the list tools/serve.py gives.
export async function listImages() {
    if (images.length) return images;
    try {
        paths = (await (await fetch('__list/img')).json()).filter((p) => p.endsWith('.png'));        // tools/serve.py
        images = paths.map((p) => p.split('/').pop()).sort();
    } catch (e) { /* another server: no list */ }
    return images;
}

// Every image with its folder, for choosing a game file by folder instead of typing its name.
export async function listImagePaths() {
    await listImages();
    return paths;
}

export function stopScene() {
    for (const clock of ['animNPC', 'animScene', 'animPJ']) loop.stop(clock);
}

// The picker's lists in a container; onChange runs when the scene changed (after it is set up).
// Returns { get(), set({kind, target, variant, tier}), setUp(), play(onHit), timing(), landing(), describe() }.
export function scenePicker(container, resetScene, onChange) {
    const id = `scn${Math.random().toString(36).slice(2, 7)}`;
    const opts = (list, labels = list) => list.map((x, i) => `<option value="${x}">${labels[i]}</option>`).join('');
    container.innerHTML = `
        <div class="row"><select data-f="kind">${opts(Object.keys(KINDS), Object.values(KINDS).map((k) => k.label))}</select>
            <label>Tier <select data-f="tier">${opts(TIERS)}</select></label></div>
        <div class="row"><input type="text" data-f="target" list="${id}" spellcheck="false" placeholder="what (type to search)">
            <datalist id="${id}"></datalist><select data-f="variant"></select></div>`;
    const f = {};
    for (const node of container.querySelectorAll('[data-f]')) f[node.dataset.f] = node;
    const list = container.querySelector('datalist');
    const kind = () => KINDS[f.kind.value];
    const target = () => f.target.value.trim();

    const fillVariants = () => {
        const vs = kind().variants(target());
        if (!vs.includes(f.variant.value)) f.variant.innerHTML = vs.map((x) => `<option>${x}</option>`).join('');
        f.variant.style.display = vs.length ? '' : 'none';
    };
    const fillTargets = () => {
        const ts = kind().targets();
        list.innerHTML = ts.map((x) => `<option value="${x}">`).join('');
        if (!ts.includes(target())) f.target.value = ts[0] || '';
        f.variant.innerHTML = '';
        fillVariants();
    };
    const picker = {
        get: () => ({ kind: f.kind.value, target: target(), variant: f.variant.style.display == 'none' ? '' : f.variant.value, tier: f.tier.value }),
        set(v) {
            if (v.kind && KINDS[v.kind]) f.kind.value = v.kind;
            fillTargets();
            if (v.target) f.target.value = v.target;
            f.variant.innerHTML = '';
            fillVariants();
            if (v.variant) f.variant.value = v.variant;
            if (v.tier !== undefined && TIERS.includes(Number(v.tier))) f.tier.value = v.tier;
        },
        setUp(tier = f.tier.value) {          // another tier than the list's, for one play (art mode's alt scene)
            stopScene();
            resetScene();
            ui.petrified = false;
            state.player.lvl = Number(tier);
            drawWizard();
            const k = kind();
            if (k.setUp) k.setUp(target(), f.variant.value);
        },
        play(onHit = () => {}) { stopScene(); kind().play(target(), f.variant.value, onHit); },
        timing() { const k = kind(); return k.timing ? k.timing(target(), f.variant.value) : null; },
        landing() { const k = kind(); return k.landing ? k.landing(target(), f.variant.value) : null; },
        current() {             // the file the game plays today for this move
            const k = kind();
            if (k.current) return k.current;
            const id = picker.landing(), school = id && spells[id] && spells[id].school;
            return school && school != 'na' ? snd(school) : null;
        },
        describe() {
            const v = picker.get();
            return `${kind().label}: ${v.target}${v.variant ? ` / ${v.variant}` : ''} (wizard tier ${v.tier})`;
        },
    };
    const changed = () => { picker.setUp(); onChange(); };
    f.kind.onchange = () => { fillTargets(); changed(); };
    f.target.onchange = () => { f.variant.innerHTML = ''; fillVariants(); changed(); };
    f.variant.onchange = changed;
    f.tier.onchange = changed;
    f.tier.value = String(Math.min(200, Math.floor(state.player.lvl / 10) * 10));
    fillTargets();
    return picker;
}

// ---------------------------------------------------------------- any image in the scene

// The scene that shows a game image (img/<name>.png), for the picker; null when none does.
export function sceneForImage(path) {
    const name = path.split('/').pop().replace(/\.png$/, '');      // any folder, or a plain name
    let m;
    if ((m = /^anim_([a-z]+)_(.+)$/.exec(name)) && bossAttacks[m[1]] && bossAttacks[m[1]].some((a) => a.id == m[2])) return { kind: 'boss', target: m[1], variant: m[2] };
    if ((m = /^anim_(mother|icedra|hydskon)_(strike|cast)(\d+)$/.exec(name))) return { kind: 'hydra', target: m[1], variant: `${m[3]} heads: ${m[2]}` };
    if ((m = /^anim_(mother|icedra|hydskon)_grow(\d+)$/.exec(name))) return { kind: 'hydra', target: m[1], variant: `${m[2]} heads: grow to ${Number(m[2]) + 1}` };
    if ((m = /^scene_(.+)$/.exec(name)) && sceneSpells[m[1]]) return { kind: 'scene', target: m[1] };
    if ((m = /^anim_([a-z_]+?)(\d+)$/.exec(name)) && WIZARD_ANIMS[m[1]] !== undefined) return { kind: 'wizardAnim', target: m[1], tier: m[2] };
    if ((m = /^(fallen|dead|stone)(\d+)$/.exec(name))) return { kind: 'wizardPose', target: m[1], tier: m[2] };
    if ((m = /^lvl(\d+)$/.exec(name))) return { kind: 'wizardAnim', target: 'cast', variant: '(plain glint)', tier: m[1] };
    if ((m = /^(run|ram)_(.+)$/.exec(name)) && enemySprites[m[2]]) return { kind: 'enemyMove', target: m[2], variant: 'charge' };
    if (enemySprites[name]) return { kind: 'enemyMove', target: name, variant: 'slash' };
    if (spells[name]) return { kind: 'spell', target: name, variant: 'on the wizard' };
    if (name == DICE) return { kind: 'dice', target: 'dice' };
    if ((m = /^([a-z]+_[A-Za-z]+?)(\d|_altar|_estatua)$/i.exec(name))) {
        const zone = Object.keys(zones).find((z) => z.toLowerCase() == m[1].toLowerCase());
        if (zone) return { kind: 'background', target: zone, variant: m[2].replace(/^_/, '') };
    }
    return null;
}

// Any picture or strip on the scene, frame by frame: at the enemy's spot, the wizard's, or over
// the whole scene; frames of fw x fh art px, ms each (follows the slow motion), looped.
export function playStripInScene(img, { where = 'enemy', fw, fh, ms = 100, loopIt = true } = {}) {
    stopScene();
    fw = fw || img.naturalHeight; fh = fh || img.naturalHeight;
    const frames = Math.max(1, Math.floor(img.naturalWidth / fw));
    const unit = ui.charWidth / 32;                 // screen px per art px
    npcCanvas.width = npcCanvas.offsetWidth;
    npcCanvas.height = npcCanvas.offsetHeight;
    if (where == 'wizard') pjCanvas.getContext('2d').clearRect(0, 0, pjCanvas.width, pjCanvas.height);
    const box = () => {
        if (where == 'scene') return [0, 0, npcCanvas.width, npcCanvas.height];
        const w = fw * unit, h = fh * unit, feet = ui.headLevel + ui.charHeight;       // standing on the ground line
        const x = where == 'wizard' ? ui.squareSide : ui.squareSide * 6;
        return [x + (ui.charWidth - w) / 2, feet - h, w, h];
    };
    let k = 0;
    const next = () => {
        if (k >= frames && !loopIt) { loop.stop('animNPC'); return; }
        const [x, y, w, h] = box(), ctx = pixelContext(npcCanvas);
        ctx.clearRect(0, 0, npcCanvas.width, npcCanvas.height);
        drawFrame(ctx, img, (k % frames) * fw, 0, fw, fh, x, y, w, h);
        k++;
    };
    next();
    if (frames > 1 || !loopIt) loop.every('animNPC', next, ms);
    return frames;
}
