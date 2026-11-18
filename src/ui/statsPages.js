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
    return section('Gold') +
        line('Earned', n(stats.get('gold.fromEnemies') + stats.get('gold.fromBosses') + stats.get('gold.fromLoot'))) +
        line('Given to you', n(stats.get('gold.offered'))) +
        line('Spent at inns', n(stats.get('gold.spentAtInns'))) +
        line('Lost in battle', n(stats.get('gold.lostInBattle')));
}

// The belief meter: a bar from the lowest to the highest belief, filled up to his value, with a
// tick at each level line (Atheist, Doubter, Devout); empty and marked lost when the story has
// locked it.
function beliefMeter() {
    const { min, max, devout, doubter, atheist } = config.belief;
    const at = (v) => Math.round(100 * (v - min) / (max - min));
    const share = state.player.beliefLost ? 0 : Math.max(0, Math.min(1, (state.player.belief - min) / (max - min)));
    const ticks = [atheist, doubter, devout].map((v) => `<div style='position:absolute; top:0; bottom:0; left:${at(v)}%; width:2px; background:#462808'></div>`).join('');
    return "<div style='position:relative; height:1.2em; margin:0.3em 0 0.5em; border:2px solid #462808; background:rgba(70,40,8,0.15)'>" +
        `<div style='height:100%; width:${Math.round(share * 100)}%; background:#8a5a14'></div>${ticks}</div>`;
}

function faithSection() {
    const level = beliefLevel();
    return line('Faith now', n(state.player.faith)) +
        // belief (src/belief.js): its level and value, or the story's lock
        line('Belief', state.player.beliefLost ? 'lost &#8856;' : `${level.charAt(0).toUpperCase() + level.slice(1)} (${Math.round(state.player.belief)})`) +
        beliefMeter() +
        line('From prayers', n(stats.get('faith.gain.prayer'))) +
        line('From offerings', n(stats.get('faith.gain.offering'))) +
        line('From cleansing corruption', n(stats.get('faith.gain.cleanse'))) +
        line('Shrines visited / passed by', `${n(stats.get('faith.shrines'))} / ${n(stats.get('faith.shrineSkipped'))}`) +
        line('Your touches', `${n(stats.get('god.heals'))} heals, ${n(stats.get('god.touches'))} revivals, ${n(stats.get('god.hits'))} punishments`);
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

export function inventoryPageHtml() {
    const icon = (name) => `<img class='imgInConsole' height='${(ui.em || 16) * 2}' src='${art(name)}'/> `;
    const artefacts = (state.artefacts || []).map((a) => `${icon(a.sprite)}${a.name}<br>`).join('');
    return "<div id='inventory'><span class='titles' id='titleInventory'>Inventory</span><br>" +
        section('Carried') +
        `${icon(staffIcon())}Staff<br>` +
        `${icon('gold')}${n(state.player.gold)} gold<br>` +
        (artefacts ? section('Artefacts') + artefacts : '') +
        '</div>';
}

// ------------------------------------------------------------------ Faith

// The Faith scroll (the prayer button): faith, the belief meter and where faith came from.
export function faithPageHtml() {
    return "<div id='faith'><span class='titles' id='titleFaith'>Faith</span><br><br>" + faithSection() + '</div>';
}

// ------------------------------------------------------------------ the page

export function statsPageHtml(secondsInGame) {
    return "<div id='stats'><span class='titles' id='titleStats'>Stats</span>" +
        wizardSection(secondsInGame) + battlesSection() + magicSection() + travelsSection() +
        goldSection() + achievementsSection() +
        '</div>';
}
