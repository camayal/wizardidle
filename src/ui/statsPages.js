// Wizard Idle v2 - the stats scroll, its Inventory page and the Faith scroll.
//
// The curated page: a few lines per area, totals instead of long lists.
// Everything else that is recorded stays hidden, for achievements, quests and playtests.
// Chosen by the author on 2026-11-12 from mockups. The Records page was removed on
// 2026-11-17 (the author: achievements do that job; past wizards live in the Cemetery).

import { zones } from '../data/zones.js';
import { roundNumbertoLetter } from '../utils.js';
import { state } from '../state.js';
import { ui } from '../runtime.js';
import { stats } from '../stats.js';
import { countLogros, logro } from '../achievements.js';
import { beliefLevel } from '../belief.js';
import { config } from '../config.js';
import { art } from '../media.js';
import { scrollHtml as questsHtml } from '../quests.js';

const n = roundNumbertoLetter;

function line(label, value) {
    return `${label}: ${value}<br>`;
}

function section(title) {
    return `<br><span class='subtitles'>${title}</span><br>`;
}

function hoursText(ms) {
    const minutes = Math.floor(ms / 60000);
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

// The biggest entry among stats starting with prefix, e.g. the most cast spell school.
function favourite(prefix) {
    let best = null;
    for (const [key, value] of Object.entries(state.stats)) {
        if (key.startsWith(prefix) && typeof value == 'number' && (!best || value > best[1])) best = [key.slice(prefix.length), value];
    }
    return best;
}

function count(prefix) {
    return Object.keys(state.stats).filter((key) => key.startsWith(prefix)).length;
}

// ------------------------------------------------------------------ Stats

function wizardSection(secondsInGame) {
    return "<br><span class='subtitles'>Wizard</span><br>" +
        line('Name', state.player.name) +
        line('Level', n(state.player.lvl)) +
        `Age: ${n(state.player.age)} yrs<br>` +
        line('Time of existence', hoursText(secondsInGame * 1000)) +
        line('Health points', n(state.player.hpBase)) +
        line('Attack points', n(state.player.attack));
}

function battlesSection() {
    const combo = state.stats['combat.longestCombo'];
    const attacks = stats.get('combat.attacks');
    return section('Battles') +
        line('Enemies defeated', `${n(stats.get('kill.enemies') + stats.get('kill.rare'))} (${n(stats.get('kill.rare'))} rare)`) +
        line('Bosses defeated', `${n(stats.get('kill.bosses'))} of ${n(stats.get('combat.bosses'))} met`) +
        (state.hydraMysteryResolved ? line('Hydras defeated', `${n(stats.get('kill.hydras'))} (${n(stats.get('kill.hydraHeads'))} heads chopped off)`) : '') +
        line('Falls', n(stats.get('death.falls'))) +
        line('Longest flawless streak', combo ? `${n(combo.value)} fights (level ${combo.lvl})` : 0) +
        line('Critical hits', `${attacks ? Math.round(100 * stats.get('combat.critics') / attacks) : 0}% of attacks`);
}

function magicSection() {
    const school = favourite('spell.school.');
    return section('Magic') +
        line('Spells cast', n(stats.get('combat.attacks'))) +
        (school ? line('Favourite school', `${school[0]} (${n(school[1])})`) : '') +
        line('Healing spells', n(stats.get('spell.heals'))) +
        line('Enemies turned into animals', n(stats.get('spell.polymorph.oveja') + stats.get('spell.polymorph.gallina')));
}

function travelsSection() {
    const zone = favourite('explore.zone.');
    const studies = stats.get('study.success') + stats.get('study.fail');
    return section('Travels') +
        line('Zones visited', `${count('explore.zone.')} of ${Object.keys(zones).length}`) +
        (zone ? line('Favourite zone', `${zones[zone[0]].name} (${n(zone[1])} times)`) : '') +
        line('Treasures opened', n(stats.get('loot.containers'))) +
        line('Books and runes understood', `${n(stats.get('study.success'))} of ${n(studies)}`) +
        line('Statues studied', n(stats.get('explore.statues')));
}

function goldSection() {
    return section('Gold and faith') +
        line('Faith now', n(state.player.faith)) +
        line('Earned', n(stats.get('gold.fromEnemies') + stats.get('gold.fromBosses') + stats.get('gold.fromLoot'))) +
        line('Given to you', n(stats.get('gold.offered'))) +
        line('Spent at inns', n(stats.get('gold.spentAtInns'))) +
        line('Lost in battle', n(stats.get('gold.lostInBattle')));
}

// The belief meter: a bar from the lowest to the highest belief, filled up to his value, with a
// tick at each level line (Atheist, Doubter, Devout); empty and marked lost when the story has
// locked it.
// The belief meter: the artist's stained-glass window with the lit glass up to his belief, a
// marker on the stone ring and the candle of his level. Drawn at 2x.
// Locked by the story (lost): the dark window and the cold candle.
const METER_CENTRE = { x: 47.5, y: 54, r: 44 };
let lastBelief = null, flare = { dir: '', until: 0 };
function beliefMeter() {
    const { min, max } = config.belief;
    const lost = !!state.player.beliefLost;
    const belief = state.player.belief;
    if (lastBelief !== null && Math.abs(belief - lastBelief) > 0.01) flare = { dir: belief > lastBelief ? 'up' : 'down', until: Date.now() + 1500 };
    lastBelief = belief;
    const t = Math.max(0, Math.min(1, (belief - min) / (max - min)));
    const f = (name) => `url("${art(name)}")`;
    const layer = (extra) => `<div style='position:absolute;left:0;top:0;width:96px;height:64px;${extra}'></div>`;
    let inner = layer(`background:${f(lost ? 'faith_meter_window_lost' : 'faith_meter_window')}`);
    if (!lost) {
        const sweep = (180 * t).toFixed(1);
        const mask = `conic-gradient(from 270deg at ${METER_CENTRE.x}px ${METER_CENTRE.y}px, #000 ${sweep}deg, transparent ${sweep}deg)`;
        const cls = Date.now() < flare.until ? ` flare-${flare.dir}` : '';
        inner += `<div class='faithLit${cls}' style='position:absolute;left:0;top:0;width:96px;height:64px;background:${f('faith_meter_glass_lit')};-webkit-mask-image:${mask};mask-image:${mask}'></div>`;
        const a = Math.PI * (1 - t);
        const mx = METER_CENTRE.x + METER_CENTRE.r * Math.cos(a), my = METER_CENTRE.y - METER_CENTRE.r * Math.sin(a);
        // a little needle on the stone ring, pointing out from the candle and sliding along its line, so it reads as something that moves
        const turn = (90 - 180 * t).toFixed(1);       // 0 deg = straight up (the ring's middle), -90 left end, +90 right end
        inner += layer(`left:${(mx - 2.5).toFixed(1)}px;top:${(my - 5.5).toFixed(1)}px;width:5px;height:11px;transform:rotate(${(-turn).toFixed(1)}deg)`)
            .replace("></div>", `><div class='faithStick' style='background-image:${f('faith_meter_marker')}'></div></div>`);
    }
    inner += `<div class='${lost ? '' : 'faithCandle'}' style='position:absolute;left:28px;top:20px;width:40px;height:40px;background:${f(lost ? 'anim_faith_candle_lost' : 'anim_faith_candle_' + beliefLevel())}'></div>`;
    // big: about 75% of the page width, in whole pixel steps so the art stays crisp (at least 2x)
    const pageWidth = document.getElementById('innerTextScroll')?.clientWidth || window.innerWidth * 0.8;
    const scale = Math.max(2, Math.floor(pageWidth * 0.75 / 96));
    return `<div style='width:${96 * scale}px;height:${64 * scale}px;margin:0.2em auto 0.5em !important'>` +
        `<div style='position:relative;width:96px;height:64px;transform:scale(${scale});transform-origin:0 0;image-rendering:pixelated'>${inner}</div></div>`;
}

function faithSection() {
    const level = beliefLevel();
    return beliefMeter() +
        `<div class='faithLevel ${state.player.beliefLost ? 'lost' : level}'>✦ ${state.player.beliefLost ? 'Lost' : level} ✦</div>` +
        section('Where faith came from') +
        line('From prayers', n(stats.get('faith.gain.prayer'))) +
        line('From offerings', n(stats.get('faith.gain.offering'))) +
        line('From cleansing corruption', n(stats.get('faith.gain.cleanse'))) +
        section('Shrines') +
        line('Visited', n(stats.get('faith.shrines'))) +
        line('Passed by', n(stats.get('faith.shrineSkipped'))) +
        section('Your touches') +
        line('Heals', n(stats.get('god.heals'))) +
        line('Revivals', n(stats.get('god.touches'))) +
        line('Punishments', n(stats.get('god.hits'))) +
        questsHtml();
}

function achievementsSection() {
    const won = countLogros();
    const total = Object.keys(logro).filter((key) => logro[key].name && !logro[key].planned).length;
    return section('Achievements') + line('Currently won', won) + `Completion: ${Math.round((won / total) * 100)}%<br>`;
}

// ------------------------------------------------------------------ Inventory

// What he carries: only the staff and his gold for now, plus the artefacts he has found. More
// will come (the staff changes with the story, docs/STORY.md).
// One staff drawing covers several tiers (the walk art has five designs).
const STAFF_DESIGNS = [0, 30, 60, 90, 130];
const STAFF_OF_TIER = { 0: 0, 10: 0, 20: 0, 30: 30, 40: 30, 50: 0, 60: 60, 70: 60, 80: 0, 90: 90, 100: 90, 110: 30, 120: 30,
    130: 130, 140: 130, 150: 0, 160: 30, 170: 30, 180: 30, 190: 0, 200: 130 };
function staffIcon() {
    const tier = Math.min(200, Math.floor(state.player.lvl / 10) * 10);
    return `staff_${STAFF_DESIGNS.includes(STAFF_OF_TIER[tier]) ? STAFF_OF_TIER[tier] : 0}`;
}

// Each item sits in its own square slot (the staff icons are square 32x32 for this); gold shows
// its amount as a small count in the corner.
function slotHtml(name, sprite, count) {
    const em = ui.em || 16;
    const box = Math.round(em * 3.5);
    return `<span title='${name}' style='display:inline-block;position:relative;width:${box}px;height:${box}px;` +
        `margin:2px;border:2px solid #6b4a1e;background:rgba(80,50,20,0.18);vertical-align:top;text-align:center'>` +
        `<img class='imgInConsole' height='${em * 2}' src='${art(sprite)}' style='margin-top:${Math.round((box - em * 2) / 2 - 2)}px'/>` +
        (count ? `<span style='position:absolute;right:2px;bottom:0;font-size:${Math.round(em * 0.7)}px'>${count}</span>` : '') +
        '</span>';
}

export function inventoryPageHtml() {
    const slots = [slotHtml('Staff', staffIcon()), slotHtml('Gold', 'gold', n(state.player.gold))]
        .concat((state.artefacts || []).map((a) => slotHtml(a.name, a.sprite)));
    return "<div id='inventory'><span class='titles' id='titleInventory'>Inventory</span><br>" +
        section('Carried') + slots.join('') + '</div>';
}

// ------------------------------------------------------------------ Faith

// The Faith scroll (the prayer button): faith, the belief meter and where faith came from.
export function faithPageHtml() {
    return "<div id='faith'><span class='titles' id='titleFaith'>Faith</span>" + faithSection() +
        `<img src='${art('faith_header_a')}' width='256' style='display:block;margin:1em auto 0;image-rendering:pixelated'/></div>`;
}

// ------------------------------------------------------------------ the page

export function statsPageHtml(secondsInGame) {
    return "<div id='stats'><span class='titles' id='titleStats'>Stats</span>" +
        wizardSection(secondsInGame) + battlesSection() + magicSection() + travelsSection() +
        goldSection() + achievementsSection() +
        '</div>';
}
