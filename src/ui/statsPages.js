// Wizard Idle v2 - the stats scroll: two pages, Stats and Records.
//
// Stats is the curated page: a few lines per area, totals instead of long lists.
// The other page's scroll peeks out above (ui/scrolls.js, stats scroll tabs).
// Records shows this wizard's bests and firsts (with the level they happened at), a chart
// of his journey, and numbers across every wizard of this world (src/stats.js).
// Everything else that is recorded stays hidden, for achievements, quests and playtests.
// Chosen by the author on 2026-11-12 from mockups (options A + B).

import { zones } from '../data/zones.js';
import { roundNumbertoLetter } from '../utils.js';
import { state, world } from '../state.js';
import { stats } from '../stats.js';
import { ui } from '../runtime.js';
import { countLogros, logro } from '../achievements.js';

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

function faithSection() {
    return section('Faith') +
        line('Faith now', n(state.player.faith)) +
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

// ------------------------------------------------------------------ Records

function best(key, label, unit = '') {
    const record = state.stats[key];
    return line(label, record ? `${n(record.value)}${unit}, at level ${record.lvl}` : 'not yet');
}

function first(key, label) {
    const record = state.stats[key];
    return line(label, record ? `level ${record.lvl}, after ${hoursText(record.playTimeMs)}` : 'not yet');
}

// Hours played to reach each level, as a small line chart.
function journeyChart() {
    const history = state.history;
    if (history.length < 2) return 'Not much of a journey yet<br>';
    const W = 300, H = 110, last = history[history.length - 1];
    const maxHours = last.playTimeMs / 3600000 || 1;
    const x = (lvl) => 10 + (lvl - history[0].lvl) / Math.max(1, last.lvl - history[0].lvl) * (W - 20);
    const y = (ms) => H - 15 - (ms / 3600000) / maxHours * (H - 30);
    const points = history.map((h) => `${x(h.lvl).toFixed(1)},${y(h.playTimeMs).toFixed(1)}`).join(' ');
    return `<small>hours played to reach each level</small><br>` +
        `<svg viewBox='0 0 ${W} ${H}' width='100%' style='max-width:${W}px'>` +
        `<polyline points='${points}' fill='none' stroke='currentColor' stroke-width='2'/>` +
        `<text x='10' y='${H - 2}' font-size='11' fill='currentColor'>level ${history[0].lvl}</text>` +
        `<text x='${W - 70}' y='${H - 2}' font-size='11' fill='currentColor'>level ${last.lvl}</text>` +
        `<text x='12' y='12' font-size='11' fill='currentColor'>${maxHours.toFixed(1)} h</text></svg><br>`;
}

function worldRecord(key, label, unit = '') {
    const record = world.stats[key];
    return line(label, record ? `${n(record.value)}${unit}${record.name ? ` (${record.name})` : ''}` : 'not yet');
}

function hallOfWizards() {
    const alive = { name: state.player.name, lvl: state.player.lvl, age: state.player.age,
        kills: stats.get('kill.enemies') + stats.get('kill.rare'), alive: true };
    const all = [alive, ...world.cemetery].sort((a, b) => b.lvl - a.lvl);
    return all.map((w) => `${w.name}: level ${n(w.lvl)}, ${n(w.age)} yrs` +
        (w.kills !== undefined ? `, ${n(w.kills)} kills` : '') + (w.alive ? ' (alive)' : '') + '<br>').join('');
}

function recordsPage() {
    const name = state.player.name;
    const wizards = Math.max(stats.get('world.wizards'), world.cemetery.length + 1);
    return section(`${name}'s bests`) +
        best('combat.longestCombo', 'Longest flawless streak', ' fights') +
        best('combat.biggestHit', 'Biggest hit') +
        best('faith.highest', 'Most faith at once') +
        best('gold.highest', 'Richest', ' gold') +
        section(`${name}'s firsts`) +
        first('first.rareKill', 'First rare enemy') +
        first('first.fall', 'First fall') +
        first('first.bossKill', 'First boss defeated') +
        (state.hydraMysteryResolved ? first('first.hydraKill', 'First hydra defeated') : '') +
        section(`${name}'s journey`) + journeyChart() +
        section('All your wizards') +
        line('Wizards created', n(wizards)) +
        line('Enemies defeated', n(stats.get('kill.enemies', { world: true }) + stats.get('kill.rare', { world: true }))) +
        line('Falls', n(stats.get('death.falls', { world: true }))) +
        worldRecord('world.highestLevel', 'Highest level ever') +
        worldRecord('world.oldestAge', 'Oldest wizard', ' yrs') +
        section('Hall of wizards') + hallOfWizards();
}

// ------------------------------------------------------------------ the page

export function statsPageHtml(secondsInGame) {
    const records = ui.scrollViews.stats == 'records';
    return `<div id='stats'><span class='titles' id='titleStats'>${records ? 'Records' : 'Stats'}</span>` +
        (records ? recordsPage()
            : wizardSection(secondsInGame) + battlesSection() + magicSection() + travelsSection() +
              goldSection() + faithSection() + achievementsSection()) +
        '</div>';
}
