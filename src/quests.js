// Wizard Idle v2 - quests (docs/plans/QUESTS.md): a goal plus a place to go. One quest at a time (state.quest), the
// others wait in a small queue (state.quests.queue). A quest has two phases: travelling (he follows the cheapest
// way to the target stage by stage, see steer/mode) and searching (he roams the target zone and does not leave
// until the target turns up: the longer he searches the likelier, and a long search sends the quest down the queue).
// Only the god cancels a quest. With no quest he wanders as always.
//
// state.quest = { id, kind, giver, text, target: {zone, enemy?, boss?, zones?, visited?}, phase, searched, secret, reward, since }
// kinds: wanted, explore, study, shrine, pilgrimage, hidden, delivery, seek; secrets: prism, medusa, rune, hidden (ingredients and crafting wait for professions, fishing later)

import { art } from './media.js';
import { zones, places, bossesOf } from './data/zones.js';
import { enemySprites, enemyTypes } from './data/enemies.js';
import { config } from './config.js';
import { state } from './state.js';
import { stats } from './stats.js';
import { run, ui } from './runtime.js';
import { pickRandomItem, YesOrNot } from './utils.js';
import { byName, destinations, moves, route, travelCost, SIZE } from './travelGraph.js';
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
// Random humans met on the road in the safe areas (very rare): a merchant or an old man with a job (sprites from img/story).
export const SAFE_ZONES = ['la_Ciudad', 'el_Poblado', 'la_Pradera', 'el_Bosque', 'el_Desierto', 'las_Dunas'];
export const HUMANS = 'stranger_merchant,stranger_farmer,stranger_hunter,stranger_pilgrim,stranger_woman,stranger_oldwoman,stranger_traveller';     // road strangers (img/story); the old man (viejo) stays in the Dunes inn
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
    wanted(giver, zone, how) {       // how: 'rare' (a rare enemy) or 'boss'; unset = by config.quests.pWantedRare
        const z = zone || pickRandomItem(ZONES().join(','));
        const rares = raresOf(z), boss = pickRandomItem(bossesOf(zones[z]).join(','));
        const wantRare = how ? how === 'rare' : YesOrNot(config.quests.pWantedRare, 0);
        if (rares.length && (wantRare || !boss)) {
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
    // Looking for work: he only goes to the inns to ask (the board and the posts he finds by chance on his way, never on purpose).
    seek(giver) {
        const spots = INN_ZONES.filter(hasStages).map((z) => ({ z, g: 'inn', t: `Look for work at the inn of the ${zoneName(z)}` }));
        const s = spots[Math.floor(Math.random() * spots.length)];
        return s ? base('seek', giver, s.t, { zone: s.z, giver: s.g }, 'xp') : null;
    },
};
export const KINDS = Object.keys(MAKERS);
const MEDUSA_ZONE = 'el_Desierto';       // where Medusa lives (her gaze, and the artefact against it)
// Secrets (they start from a find, never from a wish or an offer): the prism for the lost colours, a rune's trail, the hidden shrine told by a whisper.
const SECRETS = {
    prism: () => base('prism', 'whisper', 'Find the prism that gathers the lost colours', { zone: 'la_Tundra' }, 'faith'),
    medusa: () => base('medusa', 'whisper', `Find what shields him from Medusa's gaze in the ${zoneName(MEDUSA_ZONE)}`, { zone: MEDUSA_ZONE }, 'faith'),
    rune: (giver, zone) => base('rune', 'whisper', `Follow the rune's trail to the ${zoneName(zone)}`, { zone }, 'xp'),
    hidden: () => MAKERS.hidden('whisper'),
};
// An atheist gets and takes no shrine, pilgrimage or hidden-shrine quest (docs/plans/QUESTS.md).
export const SHRINE_KINDS = ['shrine', 'pilgrimage', 'hidden'];
export const isAtheist = () => beliefLevel() === 'atheist' || !!state.player.beliefLost;
export function makeQuest(kind, giver = 'himself', zone, how) {
    if (SHRINE_KINDS.includes(kind) && isAtheist()) return null;
    const make = MAKERS[kind] || SECRETS[kind];
    return make ? make(giver, zone, how) : null;
}

// A secret starts a quest and jumps the queue like the prism did.
export function secret(kind, zone) {
    const q = makeQuest(kind, 'whisper', zone);
    if (!q || !offer(q, { secret: true })) return false;
    stats.count(`quest.secret.${kind}`);
    print(`<i>A whisper that is not his own: ${q.text}</i>`);
    return true;
}
export function onRune() {
    if (!YesOrNot(config.quests.pRune, 0)) return;
    const list = ZONES().filter((z) => z !== state.zone.current);
    if (list.length) secret('rune', pickRandomItem(list.join(',')));
}
export function onArtefact() {         // the mirror shield or the gorgon's-eye amulet was found
    const q = state.quest;
    if (q && q.kind === 'medusa') complete(q);
}
export function onPrism() {
    const q = state.quest;
    if (q && q.kind === 'prism') complete(q);
}
// The first time he sets foot in the Volcano the god whispers of its hidden shrine.
function volcanoWhisper() {
    const Q = qs();
    if (Q.hiddenTold || state.zone.current !== HIDDEN_SHRINE_ZONE || isAtheist()) return;
    Q.hiddenTold = true;
    secret('hidden');
}

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
    if (!qs().manual) list.sort((a, b) => urgent(a) - urgent(b) || costTo(a) - costTo(b));   // once the god reorders, his order stands
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

// Does the quest's text name the place (everything but the prism's hunt)? Only then the map rings it for players.
export const questNamesPlace = () => !!state.quest && state.quest.kind !== 'prism';

// The way ahead for the map: points {layer, x, y} (fractions of the map) from where he stands to the nearest stage of the target zone, or null.
export function questPath() {
    const q = state.quest, from = here();
    if (!q || byName[from] === undefined) return null;
    let best = null, bestCost = Infinity;
    for (const t of targetStages(q)) { const c = travelCost(from, t); if (c < bestCost) { best = t; bestCost = c; } }
    if (!best) return null;
    return route(from, best).map((p) => ({ layer: p.layer, x: p.x / SIZE, y: p.y / SIZE }));
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

const FORCED = { prism: 5, medusa: 5, rune: 5, wanted: 1, shrine: 3, pilgrimage: 3, hidden: 3, delivery: 4, study: 5, seek: 2 };

// Each event tick (events.js event()): arrival, the search, wishes. Returns an event number to force, or 0.
export function eventPick() {
    const Qs = qs();
    if (Qs.orderWait > 0) Qs.orderWait--;
    volcanoWhisper();
    if (!state.quest) { wish(); return 0; }
    const q = state.quest;
    if (q.phase === 'travel' && state.zone.current === q.target.zone) {
        q.phase = 'search';
        q.searched = 0;
        stats.count('quest.arrived');
        if (q.kind === 'explore') { complete(q); return 0; }
        print(`<i>${wizardName()} has reached the ${zoneName(q.target.zone)} and looks around: ${q.text}</i>`);
    }
    if (q.phase === 'travel') return YesOrNot(config.quests.pTravelExplore, 0) ? 2 : 0;     // on the road he mostly keeps walking (2 = explore)
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
    if (q.cool > 0) { q.cool--; return 0; }          // just met the target: a breather, so it does not turn up again and again
    if (!YesOrNot(Math.min(c.findMax, c.findBase + c.findStep * q.searched), 0)) return 0;
    return turnUp(q);
}

// The target turns up: the next event is made for it.
function turnUp(q) {
    q.cool = config.quests.turnUpCooldown; q.searched = 0;       // the odds start over after each meeting (he may have lost the fight)
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
    if (q && (q.kind === 'study' || q.kind === 'rune') && state.zone.current === q.target.zone) complete(q);
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
    if (g && forced === g) return g;
    if (!canTake()) return '';
    if (g && YesOrNot(g === 'board' ? config.quests.pBoard : config.quests.pPost, 0)) return g;
    return SAFE_ZONES.includes(z) && YesOrNot(config.quests.pHuman, 0) ? 'human' : '';
}

// The kind of job a giver offers, by the weights of config.quests.offerKinds (a post only ever has hunts).
function offerKind(giver) {
    const w = config.quests.offerKinds[giver] || config.quests.offerKinds.board;
    const list = Object.entries(w), total = list.reduce((t, [, n]) => t + n, 0);
    let r = Math.random() * total;
    for (const [k, n] of list) { r -= n; if (r < 0) return k; }
    return list[0][0];
}

// A giver offers a job: the offer waits for the wizard's answer (decideOffer) while the god may suggest one (suggest).
// True when something was offered.
export function beginOffer(giver) {
    const z = state.zone.current, cur = state.quest;
    if (cur && cur.kind === 'seek' && cur.target.zone === z && cur.target.giver === giver) complete(cur);     // he came to ask for work: that errand is done
    if (!canTake()) { run.questOffer = null; return false; }
    const pick = offerKind(giver), hunt = pick === 'rare' || pick === 'boss';       // the two hunts are told apart in config.quests.offerKinds
    const q = makeQuest(hunt ? 'wanted' : pick, giver, giver === 'post' ? z : undefined, hunt ? pick : undefined);
    if (!q) { run.questOffer = null; return false; }
    run.questOffer = { q, giver, hint: '' };
    const name = wizardName();
    print(giver === 'inn' ? `<i>The innkeeper has a job for ${name}: ${q.text}</i>`
        : giver === 'human' ? `<i>The stranger has a job for ${name}: ${q.text}</i>`
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
    if (!o) return false;
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
    return accept;
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
export const ORDER_NAMES = { shrine: 'Pray at<br>a shrine', pilgrimage: 'A<br>pilgrimage', hidden: 'Find the<br>hidden shrine' };

export function godOrder(kind) {
    const Q = qs(), name = wizardName();
    if (Q.orderWait > 0 || !GOD_ORDERS.includes(kind) || isAtheist()) return false;
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

// Reordering from the Faith scroll (i = 0 is the current quest, i >= 1 the queue). Moving the current quest down
// or the first waiting one up swaps them. A move or a cancel is an order too: belief decides.
function hear() {
    const name = wizardName();
    if (obeys()) { stats.count('quest.obeyed'); return true; }
    stats.count('quest.ignored');
    print(`<i>${name} hears, but he is not convinced</i>`);
    return false;
}
function activate(q) {
    q.phase = state.zone.current === q.target.zone ? 'search' : 'travel';
    state.quest = q;
}
export function godMove(i, dir) {
    const Q = qs(), cur = state.quest;
    const all = cur ? [cur, ...Q.queue] : [...Q.queue];
    const j = i + dir;
    if (i < 0 || i >= all.length || j < 0 || j >= all.length) return false;
    if (!hear()) return true;
    [all[i], all[j]] = [all[j], all[i]];
    Q.manual = true;
    Q.queue = all.slice(1);
    if (all[0] !== cur) {
        if (cur) cur.phase = 'travel';
        activate(all[0]);
        print(`<i>${wizardName()} feels your will and turns to: ${all[0].text}</i>`);
    }
    return true;
}
// Is the quest in row i (0 = the current one) a secret (a one-time quest: forgetting it asks first)?
export function isSecretAt(i) {
    const q = i === 0 ? state.quest : qs().queue[i - 1];
    return !!(q && q.secret);
}
export function godDrop(i) {
    const Q = qs();
    if (i === 0) return godCancel();
    if (!Q.queue[i - 1]) return false;
    if (!hear()) return true;
    const [q] = Q.queue.splice(i - 1, 1);
    qs().log.unshift({ text: q.text, giver: q.giver, kind: q.kind, how: 'cancelled', at: Date.now() });
    if (Q.log.length > 10) Q.log.length = 10;
    stats.count('quest.cancelled');
    return true;
}

// ---- the Faith scroll's quest page (its own ribbon): fixed orders on top, then the list with big touch buttons ----

// each delivery carries one of three parcels (kept by its id, so it never changes on redraw)
const parcelOf = (q) => `item_parcel_${'abc'[q.id % 3]}`;
const PHASE = { travel: 'on the road', search: 'searching' };
const ORDER_ICONS = { shrine: 'icon_order_shrine_mid', pilgrimage: 'icon_order_pilgrim_mid', hidden: 'icon_order_hidden_mid' };   // drawn in the socket of order_plate_*
const STATES = (stem) => `style="--n:url(${art(stem + '_normal')});--p:url(${art(stem + '_pressed')});--d:url(${art(stem + '_disabled')})"`;
const orderIcon = (k) => `<img class='orderIcon' src='${art(ORDER_ICONS[k])}'/>`;      // sits in the plate's socket
const mvBtn = (act, i, stem, off, cls = '') => `<button class='stoneBtn ${cls}' ${STATES(stem)} data-quest='${act}:${i}' ${off ? 'disabled' : ''}></button>`;
export function scrollHtml() {
    const Q = qs(), q = state.quest;
    const all = q ? [q, ...Q.queue] : [...Q.queue];
    let h = `<br><span class='subtitles'>Divine orders</span><br><div class='questOrders'>`;
    h += Q.orderWait > 0 ? `<div style="grid-column:1/-1;text-align:center;font-style:italic;color:#7a6a58;margin:1em 0">Your will has been heard. The wizard is following your order; the heavens need a while before the next one can be given.</div>`
        : GOD_ORDERS.map((k) => `<button class='orderBtn' ${STATES('order_plate')} data-quest='order:${k}' ${isAtheist() ? "disabled title='He no longer believes'" : ''}>${orderIcon(k)}<span>${ORDER_NAMES[k]}</span></button>`).join('');
    h += `</div><br><span class='subtitles'>Errands</span><br>`;
    if (!all.length) h += `<p>No quest now</p>`;
    h += all.map((x, i) => `<div class='questRow'><div class='questText'>${x.kind === 'delivery' ? `<img class='parcel' src='${art(parcelOf(x))}'/>` : ''}${x.text}<br><small>${i === 0 ? `now, ${PHASE[x.phase] || x.phase}` : `waiting #${i}`}; from ${x.giver}</small></div>` +
        mvBtn('up', i, 'btn_up', i === 0) +
        mvBtn('down', i, 'btn_down', i === all.length - 1) +
        mvBtn('drop', i, 'btn_x', false) + `</div>`).join('');
    if (Q.log.length) {   // the history is folded like the Help sections; the page redraws, so the open state lives in ui
        const open = ui.questLogOpen;
        h += `<br><span class='subtitles questLogToggle'>Past quests (${Q.log.length})</span><br>` +
            `<div class='a' style='max-height:${open ? 'none' : '0'}'>${Q.log.map((x) => `${x.text} <small>(${x.how})</small>`).join('<br>')}</div>`;
    }
    return h;
}
export function questsPageHtml() {
    return `<div id='quests'><span class='titles' id='titleQuests'>Quests</span><br>${scrollHtml()}</div>`;
}
