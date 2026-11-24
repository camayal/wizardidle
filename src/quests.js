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
import { beliefLevel } from './belief.js';

const here = () => state.zone.current + state.zone.stage;
const zoneName = (z) => zones[z].name;
export const qs = () => (state.quests = state.quests || { queue: [], log: [], persona: pickRandomItem('greedy,pious,curious'), orderWait: 0 });

// ---- the places a quest can name ----

const hasStages = (z) => byName[`${z}1`] !== undefined;
const stagesOf = (z) => Object.keys(places).filter((n) => places[n].zone === z && byName[n] !== undefined);
const ZONES = () => Object.keys(zones).filter(hasStages);
const SHRINE_ZONES = () => ZONES().filter((z) => places[`${z}_altar`]);
const INN_ZONES = ['la_Ciudad', 'el_Poblado', 'el_Desierto'];
export const HIDDEN_SHRINE_ZONE = 'el_Volcan';
// Who gives quests (placeholders: where the boards and posts stand is the author's to say; art for both is still to ask the artist):
// inns, the board of the City, and wanted posts on the roads of these regions (each gives a wanted quest of its own region).
export const BOARD_ZONES = ['la_Ciudad'];
export const POST_ZONES = () => ['la_Pradera', 'el_Bosque', 'la_Gruta', 'la_Mina', 'el_Pantano', 'las_Dunas', 'la_Cueva', 'la_Tundra'].filter(hasStages);

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
    wanted(giver, zone) {
        const z = zone || pickRandomItem(ZONES().join(','));
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
    // Looking for work: go to a place that gives quests (an inn, the board, a post) and ask there.
    seek(giver) {
        const spots = [...INN_ZONES.filter(hasStages).map((z) => ({ z, g: 'inn', t: `Look for work at the inn of the ${zoneName(z)}` })),
            ...BOARD_ZONES.filter(hasStages).map((z) => ({ z, g: 'board', t: `Read the board of the ${zoneName(z)}` })),
            ...POST_ZONES().map((z) => ({ z, g: 'post', t: `Look for a wanted post in the ${zoneName(z)}` }))];
        const s = spots[Math.floor(Math.random() * spots.length)];
        return s ? base('seek', giver, s.t, { zone: s.z, giver: s.g }, 'xp') : null;
    },
};
export const KINDS = Object.keys(MAKERS);
export const makeQuest = (kind, giver = 'himself', zone) => (MAKERS[kind] ? MAKERS[kind](giver, zone) : null);

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

const FORCED = { wanted: 1, shrine: 3, pilgrimage: 3, hidden: 3, delivery: 4, study: 5, seek: 2 };

// Each event tick (events.js event()): arrival, the search, wishes. Returns an event number to force, or 0.
export function eventPick() {
    const q = state.quest, Qs = qs();
    if (Qs.orderWait > 0) Qs.orderWait--;
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
    if (q.kind === 'seek') {
        if (q.target.giver === 'inn') { run.questInn = true; return 4; }
        run.questGiver = q.target.giver;
    }
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

const TILT = { greedy: { wanted: 1, delivery: 1, seek: 1 }, pious: { shrine: 1, pilgrimage: 1, hidden: 1 }, curious: { explore: 1, study: 1 } };
const NEEDS = { wanted: (n) => n.gold * 0.6 + n.strength, shrine: (n) => n.faith, pilgrimage: (n) => n.faith * 0.6, hidden: (n) => n.faith * 0.3,
    explore: () => 0.4, study: () => 0.35, delivery: (n) => n.gold * 0.7, seek: (n) => 0.3 + n.gold * 0.3 };

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

// ---- offers: inns, the board, wanted posts (the god may suggest; belief decides) ----

// config.quests.obey: how often he does what the god suggests or orders, by belief level (placeholders).
const obeys = () => YesOrNot(config.quests.obey[beliefLevel()] ?? 0.5, 0);
const canTake = () => !state.quest || qs().queue.length < config.quests.queueMax;

// Which giver stands here (for the explore event): 'board' or 'post', by chance or because the quest he is on asked for it. '' when none.
export function giverHere() {
    const z = state.zone.current, forced = run.questGiver;
    run.questGiver = '';
    const g = BOARD_ZONES.includes(z) ? 'board' : POST_ZONES().includes(z) ? 'post' : '';
    if (!g) return '';
    if (forced === g) return g;
    return canTake() && YesOrNot(g === 'board' ? config.quests.pBoard : config.quests.pPost, 0) ? g : '';
}

// A giver offers a job: the offer waits for the wizard's answer (decideOffer) while the god may suggest one (suggest).
// True when something was offered.
export function beginOffer(giver) {
    const z = state.zone.current, cur = state.quest;
    if (cur && cur.kind === 'seek' && cur.target.zone === z && cur.target.giver === giver) complete(cur);     // he came to ask for work: that errand is done
    if (!canTake()) { run.questOffer = null; return false; }
    const kind = giver === 'post' ? 'wanted' : pickRandomItem(giver === 'board' ? 'wanted,delivery,explore,study,shrine' : 'wanted,delivery,explore,study');
    const q = makeQuest(kind, giver, giver === 'post' ? z : undefined);
    if (!q) { run.questOffer = null; return false; }
    run.questOffer = { q, giver, hint: '' };
    const name = wizardName();
    print(giver === 'inn' ? `<i>The innkeeper has a job for ${name}: ${q.text}</i>`
        : `<i>${name} reads ${giver === 'board' ? 'a notice on the board' : 'a wanted poster'}: ${q.text}</i>`);
    stats.count(`quest.offers.${giver}`);
    return true;
}

// The god's touch while an offer waits: the NPC (right) suggests taking it, the door (centre) suggests leaving it.
// True when the touch was used for that.
export function suggest(hint) {
    const o = run.questOffer;
    if (!o) return false;
    o.hint = hint;
    stats.count('quest.suggestions');
    return true;
}

// Does the quest suit what he lacks and his nature? (his own judgement, with a little noise)
function suits(q) {
    const tilt = TILT[qs().persona] || {};
    return NEEDS[q.kind](needs()) + (tilt[q.kind] ? config.quests.personality * 0.2 : 0) + Math.random() * config.quests.needNoise >= config.quests.acceptLine;
}

// The wizard answers the waiting offer: by the god's suggestion if his belief makes him listen, otherwise by his own mind.
export function decideOffer() {
    const o = run.questOffer;
    run.questOffer = null;
    if (!o) return;
    const name = wizardName();
    let accept = suits(o.q), line;
    if (o.hint) {
        if (obeys()) {
            accept = o.hint === 'accept';
            line = `${name} feels your will and ${accept ? 'takes the job' : 'leaves it alone'}`;
            stats.count('quest.obeyed');
        } else {
            line = `${name} hears, but he is not convinced, and ${accept ? 'takes the job anyway' : 'turns it down anyway'}`;
            stats.count('quest.ignored');
        }
    } else {
        line = `${name} thinks it over and ${accept ? 'takes the job' : 'turns it down'}`;
    }
    if (accept && !offer(o.q)) { accept = false; line = `${name} has too much to do already and turns it down`; }
    print(`<i>${line}</i>`);
    stats.count(accept ? 'quest.accepted' : 'quest.refused');
}

// The inn he is entering: maybe the host has a job (always when he came looking for work).
export function innVisit() {
    const q = state.quest, z = state.zone.current;
    const seeking = q && q.kind === 'seek' && q.target.giver === 'inn' && q.target.zone === z;
    if (seeking || (canTake() && YesOrNot(config.quests.pInnOffer, 0))) beginOffer('inn');
}

// Dev tools: an offer from a giver at once, answered after a few seconds (time to try a touch).
export function meetNow(giver, after = 4000) {
    if (!beginOffer(giver)) return false;
    setTimeout(decideOffer, after);
    return true;
}

// ---- the god's orders and cancel (the Faith scroll): obeyed by belief ----

export const GOD_ORDERS = ['shrine', 'pilgrimage', 'hidden'];
export const ORDER_NAMES = { shrine: 'Pray at a shrine', pilgrimage: 'A pilgrimage', hidden: 'Find the hidden shrine' };

export function godOrder(kind) {
    const Q = qs(), name = wizardName();
    if (Q.orderWait > 0 || !GOD_ORDERS.includes(kind)) return false;
    if (!canTake()) { print(`<i>${name} has too much to do already</i>`); return false; }
    const q = makeQuest(kind, 'god');
    if (!q) return false;
    Q.orderWait = config.quests.orderWait;
    stats.count('quest.orders');
    if (!obeys()) { stats.count('quest.ignored'); print(`<i>${name} hears, but he is not convinced</i>`); return true; }
    stats.count('quest.obeyed');
    offer(q);
    print(`<i>${name} feels your will: ${q.text}</i>`);
    return true;
}

export function godCancel() {
    const q = state.quest, name = wizardName();
    if (!q) return false;
    if (!obeys()) { stats.count('quest.ignored'); print(`<i>${name} hears, but he is not convinced</i>`); return true; }
    stats.count('quest.obeyed');
    print(`<i>${name} feels your will and forgets his errand: ${q.text}</i>`);
    cancel();
    return true;
}

// ---- the Faith scroll's quest section ----

const PHASE = { travel: 'on the road', search: 'searching' };
export function scrollHtml() {
    const Q = qs(), q = state.quest, log = Q.log.slice(0, 3);
    let h = `<br><span class='subtitles'>Quests</span><br>`;
    h += q ? `Now: ${q.text}<br><small>(${PHASE[q.phase] || q.phase}; from ${q.giver})</small><br>` : 'No quest now<br>';
    if (Q.queue.length) h += `Waiting: ${Q.queue.map((x) => x.text).join('; ')}<br>`;
    if (log.length) h += `Lately: ${log.map((x) => `${x.text} (${x.how})`).join('; ')}<br>`;
    if (q) h += `<button class='questBtn' data-quest='cancel'>Forget it</button> `;
    h += Q.orderWait > 0 ? `<small>Your next order will be heard in a while</small><br>`
        : GOD_ORDERS.map((k) => `<button class='questBtn' data-quest='order:${k}'>${ORDER_NAMES[k]}</button>`).join(' ');
    return h;
}
