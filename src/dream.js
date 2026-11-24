// Wizard Idle v2 - which dream he has tonight, and what it does to his belief (docs/plans/SLEEP.md,
// Belief dreams). The choice and the belief effect run on every rest, drawn or not (simulation,
// page in the background), with the game's real RNG; only the visuals are looks-only.
//
// No dream repeats: each pool keeps a shuffle bag saved per wizard in state. A dream night takes
// the next id; an empty bag is reshuffled, with the dream played last moved to the back.

import { config } from './config.js';
import { state, world } from './state.js';
import { run } from './runtime.js';
import { stats } from './stats.js';
import { beliefLevel, beliefMoment } from './belief.js';
import { dreams } from './data/dreams.js';

function shuffled(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// The next dream of a pool, from its bag (exported for the bag test).
export function takeFromBag(pool) {
    let bag = state.dreamBags[pool];
    if (!bag || !bag.length) {
        const ids = shuffled(dreams[pool].map((d) => d.id));
        const last = state.dreamLast[pool];
        if (ids.length > 1 && ids[0] == last) ids.push(ids.shift());
        bag = state.dreamBags[pool] = ids;
    }
    const id = bag.shift();
    state.dreamLast[pool] = id;
    return dreams[pool].find((d) => d.id == id);
}

const BELIEF_KIND = { devout: "dreamDevout", believer: "dreamBeliever", doubter: "dreamDoubter", atheist: "dreamAtheist" };

// A dream for tonight, or null: a story dream on the first rest after a chapter or a fall,
// otherwise now and then a random dream or nightmare, split by belief level. Applies the belief
// effect and counts the stats; returns { lines, nightmare } for the scene.
export function pickDream() {
    let pool, nightmare = false;
    if (run.storyDream) {
        const kind = run.storyDream;
        run.storyDream = "";
        stats.count("dream.story");
        pool = kind == "fall" ? { healer: "fallHealer", rescuer: "fallRescuer" }[run.fallBy] || "fallAlone" : "chap";
    } else {
        if (Math.random() >= config.balance.dreamChance) return null;
        const level = beliefLevel();
        const doubting = level == "doubter" || level == "atheist";
        nightmare = Math.random() < (doubting ? config.balance.dreamDoubterNightmare : config.balance.dreamBelieverNightmare);
        stats.count(nightmare ? "nightmare.random" : "dream.random");
        if (nightmare) pool = "night";
        else if (world.erasures && world.erasures.length && Math.random() < config.balance.echoDreamChance) pool = "echo";
        else pool = doubting ? "call" : "light";
    }
    const dream = takeFromBag(pool);
    stats.count(`dream.seen.${dream.id}`);      // "every dream": one key per dream
    if (nightmare) {
        const level = beliefLevel();
        if (level == "believer" || level == "devout") beliefMoment("nightmare", config.belief.nightmareFloor);
    } else if (dream.belief) {
        beliefMoment(BELIEF_KIND[beliefLevel()]);
        if (!state.player.beliefLost) stats.count("belief.moment.dream");
    }
    return { lines: dream.lines, nightmare: nightmare || pool.startsWith("fall") };   // a fall dream is drawn in the nightmare colour
}
