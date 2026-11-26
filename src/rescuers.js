// Wizard Idle - who gets him up when the god doesn't (docs/plans/for_implementation_faith.md, section 9, step 7).
// Picked by the zone where he fell: pagan caravan, shaman, gravedigger, or a ghost of the cemetery (rare, anywhere);
// otherwise he gets up alone. Text only for now (no scenes or art yet). `hp` is the share of his HP he stands up with (getting up alone leaves him as he fell, near 0), `share` scales the faith the self-revive costs
// (1 = today's), `fellow` is what the console says. Numbers: config.rescuer (placeholders).

import { config } from './config.js';
import { state, world } from './state.js';
import { YesOrNot } from './utils.js';

const BY_ZONE = {
    la_Pradera: "pagan", el_Desierto: "pagan", las_Dunas: "pagan",
    el_Bosque: "shaman", el_Pantano: "shaman", la_Tundra: "shaman",
    el_Castillo: "digger", el_Duenon: "digger", la_Gruta: "digger",
};

const RESCUERS = {
    pagan: { share: 1, hp: 0.7, text: "A pagan caravan finds him, heals him with their rites and sets him on his feet" },
    shaman: { share: 0.6, hp: 0.5, text: "A shaman heals him with herbs and a murmured song, and asks nothing" },
    digger: { share: 1.5, hp: 0.5, text: "A gravedigger raises him, not quite alive, and whispers that there are quicker ways to power" },
};

// { who, share, text } of the rescuer, or null when he gets up alone.
export function pickRescuer() {
    const dead = world.cemetery.filter((w) => w.name);
    if (dead.length && YesOrNot(config.rescuer.ghostChance, 0)) {
        const ghost = dead[Math.floor(Math.random() * dead.length)];
        return { who: "ghost", share: 0, hp: 0.25, text: `The ghost of ${ghost.name} (lvl ${ghost.lvl}) lifts him up` };
    }
    const kind = BY_ZONE[state.zone.current];
    return kind ? { who: kind, ...RESCUERS[kind] } : null;
}
