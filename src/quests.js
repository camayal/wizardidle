// Wizard Idle v2 - quests (docs/plans/QUESTS.md): a goal plus a place to go. One quest at a time (state.quest), the
// others wait in a small queue (state.quests.queue). A quest has two phases: travelling (he follows the cheapest
// way to the target stage by stage, see steer/mode) and searching (he roams the target zone and does not leave
// until the target turns up: the longer he searches the likelier, and a long search sends the quest down the queue).
// Only the god cancels a quest. With no quest he wanders as always.
//
// state.quest = { id, kind, giver, text, target: {zone, enemy?, boss?, zones?, visited?}, phase, searched, secret, reward, since }
// kinds: wanted, explore, study, shrine, pilgrimage, hidden, delivery (ingredients and crafting wait for professions, fishing later)

import { zones, places, bossesOf } from './data/zones.js';
import { enemySprites, enemyTypes } from './data/enemies.js';
import { config } from './config.js';
import { state } from './state.js';
import { stats } from './stats.js';
import { run } from './runtime.js';
import { pickRandomItem, YesOrNot } from './utils.js';
import { byName, destinations, moves, travelCost } from './travelGraph.js';
import { addXP, calculateFe } from './wizard.js';
import { print, updateHeading, wizardName } from './ui/render.js';

const here = () => state.zone.current + state.zone.stage;
const zoneName = (z) => zones[z].name;
export const qs = () => (state.quests = state.quests || { queue: [], log: [], persona: pickRandomItem('greedy,pious,curious') });

// ---- the places a quest can name ----

const hasStages = (z) => byName[`${z}1`] !== undefined;
const stagesOf = (z) => Object.keys(places).filter((n) => places[n].zone === z && byName[n] !== undefined);
const ZONES = () => Object.keys(zones).filter(hasStages);
const SHRINE_ZONES = () => ZONES().filter((z) => places[`${z}_altar`]);
const INN_ZONES = ['la_Ciudad', 'el_Poblado', 'el_Desierto'];
export const HIDDEN_SHRINE_ZONE = 'el_Volcan';

// The rare sprites that live in a zone (families of its enemy list).
function raresOf(z) {
    const fam = zones[z].enemies.toLowerCase().split(',');
    return Object.keys(enemySprites).filter((s) => enemySprites[s].rare && !/^spectrum_/.test(s) && fam.includes(s.replace(/\d+$/, '')));
}

// ---- making a quest ----

let nextId = 1;
const base = (kind, giver, text, target, rewardKind) => ({ id: Date.now() * 10 + (nextId++ % 10), kind, giver, text, target, phase: 'travel', searched: 0, secret: false, reward: rewardKind, since: Date.now() });

// kind -> a fresh quest of it, or null when nothing fits. `from`: zone where a delivery is picked up.
const MAKERS = {
    wanted(giver) {
        const z = pickRandomItem(ZONES().join(','));
        const rares = raresOf(z), boss = pickRandomItem(bossesOf(zones[z]).join(','));
        if (rares.length && YesOrNot(0.5, 0)) {
            const s = pickRandomItem(rares.join(','));
            return base('wanted', giver, `Hunt the ${enemySprites[s].altName} of the ${zoneName(z)}`, { zone: z, enemy: s }, 'xp');
        }
        return boss ? base('wanted', giver, `Defeat ${enemyTypes[boss].name} of the ${zoneName(z)}`, { zone: z, boss }, 'xp') : null;
    },
    explore(giver) {
        const z = pickRandomItem(ZONES().filter((x) => x !== state.zone.current).join(','));
        return base('explore', giver, `Go and see the ${zoneName(z)}`, { zone: z }, 'xp');
    },
    study(giver) {
        const z = pickRandomItem(ZONES().join(','));
        return base('study', giver, `Find something to study in the ${zoneName(z)}`, { zone: z }, 'xp');
    },
    shrine(giver) {
        const z = pickRandomItem(SHRINE_ZONES().join(','));
        return base('shrine', giver, `Pray at the shrine of the ${zoneName(z)}`, { zone: z }, 'faith');
    },
    pilgrimage(giver) {
        const list = SHRINE_ZONES().sort(() => Math.random() - 0.5).slice(0, config.quests.pilgrimageShrines);
        if (list.length < 2) return null;
        return base('pilgrimage', giver, `Pilgrimage: pray in ${list.map(zoneName).join(', ')}`, { zones: list, visited: [], zone: list[0] }, 'faith');
    },
    hidden(giver) {
        if (!hasStages(HIDDEN_SHRINE_ZONE)) return null;
        return base('hidden', giver, `Find the hidden shrine of the ${zoneName(HIDDEN_SHRINE_ZONE)}`, { zone: HIDDEN_SHRINE_ZONE }, 'faith');
    },
    delivery(giver) {
        const z = pickRandomItem(INN_ZONES.filter((x) => x !== state.zone.current && hasStages(x)).join(','));
        return z ? base('delivery', giver, `Deliver a parcel to the inn of the ${zoneName(z)}`, { zone: z }, 'gold') : null;
    },
};
export const KINDS = Object.keys(MAKERS);
export const makeQuest = (kind, giver = 'himself') => (MAKERS[kind] ? MAKERS[kind](giver) : null);

// ---- the queue ----

export const current = () => state.quest || null;
export const active = () => !!state.quest;
const urgent = (q) => (q.secret ? 0 : 1);

// How far (travel cost) from where he stands the quest's nearest target stage is.
function costTo(q, from = here()) {
    if (byName[from] === undefined) return Infinity;
    let best = Infinity;
    for (const t of targetStages(q)) best = Math.min(best, travelCost(from, t));
    return best;
}
const targetStages = (q) => (q.target.zone ? stagesOf(q.target.zone) : []);

// Take the next quest from the queue: secrets first, then the nearest by travel cost.
function promote() {
    const list = qs().queue;
    if (!list.length) return;
    list.sort((a, b) => urgent(a) - urgent(b) || costTo(a) - costTo(b));
    const q = list.shift();
    q.phase = state.zone.current === q.target.zone ? 'search' : 'travel';
    state.quest = q;
    print(`<i>${wizardName()} sets out on his next errand: ${q.text}</i>`);
}

// A new quest from any source. True when it was taken (current or queued); false when the queue is full.
// A secret jumps the queue: it pauses the current quest, which waits at the front.
export function offer(q, { secret = false } = {}) {
    if (!q) return false;
    q.secret = secret;
    const Q = qs();
    if (!state.quest) {
        state.quest = q;
        q.phase = state.zone.current === q.target.zone ? 'search' : 'travel';
        stats.count('quest.started');
        return true;
    }
    if (secret && !state.quest.secret) {
        const paused = state.quest;
        paused.phase = 'travel';
        Q.queue.unshift(paused);
        state.quest = q;
        q.phase = state.zone.current === q.target.zone ? 'search' : 'travel';
        stats.count('quest.started');
        return true;
    }
    if (Q.queue.length >= config.quests.queueMax) { stats.count('quest.turnedDown'); return false; }
    Q.queue.push(q);
    stats.count('quest.started');
    return true;
}

// Only the god cancels (the Faith scroll): the quest leaves for good and the next one starts.
export function cancel() {
    if (!state.quest) return false;
    finish(state.quest, 'cancelled');
    return true;
}

function finish(q, how) {
    const log = qs().log;
    log.unshift({ text: q.text, giver: q.giver, kind: q.kind, how, at: Date.now() });
    if (log.length > 10) log.length = 10;
    state.quest = null;
    stats.count(`quest.${how}`);
    promote();
}

function reward(q) {
    const c = config.quests, p = state.player;
    if (q.reward === 'gold') {
        const gold = Math.round(p.hpBase * config.balance.rGold * c.goldMult);
        p.gold += gold;
        updateHeading();
        return `${gold} gold`;
    }
    if (q.reward === 'faith') {
        const f = Math.round(calculateFe() * c.faithMult * p.faithMultiplier);
        p.faith += f;
        updateHeading();
        return `${f} faith`;
    }
    addXP(c.xpMult);
    return 'experience';
}

function complete(q) {
    const got = reward(q);
    print(`<i>${wizardName()} has finished his quest (${q.text}): ${got}</i>`);
    finish(q, 'done');
}

// ---- moving: travelling and searching (travel.js asks) ----

// Where the quest steers: among the candidate stages, the one with the cheapest way to the target (null: none helps).
function bestOf(q, list) {
    let best = null, bestCost = Infinity;
    for (const n of list) {
        if (byName[n] === undefined) continue;
        const c = costTo(q, n);
        if (c < bestCost) { best = n; bestCost = c; }
    }
    return bestCost === Infinity ? null : best;
}
const stepsFrom = (origin) => [...moves(origin), ...destinations(origin)];

// 'leave' (the next stage on the way is in another zone), 'move' (stay in this zone: on the way, or searching), or null (no quest).
export function mode() {
    const q = state.quest;
    if (!q) return null;
    if (q.phase === 'search') return 'move';
    const best = bestOf(q, stepsFrom(here()));
    if (!best) return null;
    return places[best].zone === state.zone.current ? 'move' : 'leave';
}

// The stage to walk to among `list` (the moves or the destinations of `origin`), or null: pick at random as usual.
export function steer(origin, list) {
    const q = state.quest;
    if (!q || q.phase === 'search') return null;
    return bestOf(q, list);
}

// ---- finding the target ----

const FORCED = { wanted: 1, shrine: 3, pilgrimage: 3, hidden: 3, delivery: 4, study: 5 };

// Each event tick (events.js event()): arrival, the search, wishes. Returns an event number to force, or 0.
export function eventPick() {
    const q = state.quest;
    if (!q) { wish(); return 0; }
    if (q.phase === 'travel' && state.zone.current === q.target.zone) {
        q.phase = 'search';
        q.searched = 0;
        stats.count('quest.arrived');
        if (q.kind === 'explore') { complete(q); return 0; }
        print(`<i>${wizardName()} has reached the ${zoneName(q.target.zone)} and looks around: ${q.text}</i>`);
    }
    if (q.phase !== 'search') return 0;
    q.searched++;
    const c = config.quests;
    if (q.searched >= c.searchPatience && qs().queue.length) {          // it drags on: down the queue, never dropped
        q.searched = 0;
        q.phase = 'travel';
        qs().queue.push(q);
        state.quest = null;
        stats.count('quest.postponed');
        print(`<i>${wizardName()} puts his quest aside for now: ${q.text}</i>`);
        promote();
        return 0;
    }
    if (!YesOrNot(Math.min(c.findMax, c.findBase + c.findStep * q.searched), 0)) return 0;
    return turnUp(q);
}

// The target turns up: the next event is made for it.
function turnUp(q) {
    if (q.kind === 'wanted') {
        if (!YesOrNot(config.quests.pWantedBoost, 0)) return 0;
        if (q.target.boss) run.forceBoss = q.target.boss; else run.forceEnemy = q.target.enemy;
    }
    if (q.kind === 'shrine' || q.kind === 'pilgrimage' || q.kind === 'hidden') run.questShrine = true;
    if (q.kind === 'delivery') run.questInn = true;
    return FORCED[q.kind] || 0;
}

// What happened in the game: the quest may be done.
export function onKill(name, boss) {
    const q = state.quest;
    if (!q || q.kind !== 'wanted' || state.zone.current !== q.target.zone) return;
    if (boss ? q.target.boss === name : q.target.enemy === name) complete(q);
}
export function onShrine() {
    const q = state.quest, z = state.zone.current;
    if (!q) return;
    if (q.kind === 'pilgrimage') {
        if (!q.target.zones.includes(z) || q.target.visited.includes(z)) return;
        q.target.visited.push(z);
        const left = q.target.zones.filter((x) => !q.target.visited.includes(x));
        if (!left.length) return complete(q);
        q.target.zone = left.sort((a, b) => costTo({ target: { zone: a } }) - costTo({ target: { zone: b } }))[0];
        q.phase = 'travel';
        print(`<i>${wizardName()} has prayed here for his pilgrimage; next, the ${zoneName(q.target.zone)}</i>`);
        return;
    }
    if ((q.kind === 'shrine' || q.kind === 'hidden') && z === q.target.zone) complete(q);
}
export function onStudy() {
    const q = state.quest;
    if (q && q.kind === 'study' && state.zone.current === q.target.zone) complete(q);
}
export function onInn() {
    const q = state.quest;
    if (q && q.kind === 'delivery' && state.zone.current === q.target.zone) complete(q);
}

// ---- his own wishes: a needs score plus a small personality ----

// What he lacks, 0 to 1 each (the references are placeholders for the playtests).
function needs() {
    const p = state.player, ref = p.hpBase * config.balance.rGold;
    return {
        gold: 1 - p.gold / (p.gold + ref * 10),
        faith: 1 - p.faith / (p.faith + ref * 20),
        strength: 0.3,
    };
}

const TILT = { greedy: { wanted: 1, delivery: 1 }, pious: { shrine: 1, pilgrimage: 1, hidden: 1 }, curious: { explore: 1, study: 1 } };
const NEEDS = { wanted: (n) => n.gold * 0.6 + n.strength, shrine: (n) => n.faith, pilgrimage: (n) => n.faith * 0.6, hidden: (n) => n.faith * 0.3,
    explore: () => 0.4, study: () => 0.35, delivery: (n) => n.gold * 0.7 };

export function wishKind() {
    const n = needs(), c = config.quests, tilt = TILT[qs().persona] || {};
    let best = '', bestScore = -1;
    for (const k of KINDS) {
        const s = NEEDS[k](n) + (tilt[k] ? c.personality * 0.2 : 0) + Math.random() * c.needNoise;
        if (s > bestScore) { best = k; bestScore = s; }
    }
    return best;
}

function wish() {
    if (qs().queue.length || !YesOrNot(config.quests.pWish, 0)) return;
    const kind = wishKind(), q = makeQuest(kind, 'himself');
    if (!q) return;
    offer(q);
    stats.count('quest.wishes');
    print(`<i>${wizardName()} has made up his mind: ${q.text}</i>`);
}
