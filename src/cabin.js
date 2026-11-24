// Wizard Idle v2 - where the healer's cabin stands when the god revives a fallen wizard.
//
// Not on a quest: a random wild zone and stage, as always. On a quest (state.quest, set by the future
// quest system): the cabin is as near as possible to the stage where he fell, so he is not taken far
// from his path. Dueñon, Heidan, the Castle and the Tower never have a cabin; a quest there puts him at the stage of an allowed
// zone with the cheapest walk from where he fell (the travel graph, docs/TRAVEL.md).
// The cabin has four looks: wild (default), Town, City and cave (cave, mine, grotto).

import { places } from './data/zones.js';
import { state } from './state.js';
import { MAXSTAGES } from './config.js';
import { pickRandomItem } from './utils.js';
import { byName, travelCost } from './travelGraph.js';

const NO_CABIN = new Set(['el_Duenon', 'el_Heidan', 'el_Castillo', 'la_Torre']);
const CAVE_ZONES = new Set(['la_Cueva', 'la_Mina', 'la_Gruta']);
const LOOK = { el_Poblado: 'town', la_Ciudad: 'city' };
// Looks whose art exists in img/story (curanderobg_<look>.png).
const LOOK_ART = new Set(['wild', 'town', 'city', 'cave']);   // wild = the cabin with its trap door closed; the open-door curanderobg is kept for the final battle

const onQuest = () => !!state.quest;
const cabinAllowed = (zone) => !NO_CABIN.has(zone);
const lookOf = (zone) => CAVE_ZONES.has(zone) ? 'cave' : (LOOK[zone] || 'wild');
const backgroundOf = (zone) => { const look = lookOf(zone); return LOOK_ART.has(look) ? `curanderobg_${look}` : 'curanderobg'; };

// The stage nearest to where he fell among those that may have a cabin ('' when the graph knows none).
function nearestCabinStage(fellAt) {
    if (byName[fellAt] === undefined) return '';
    let best = '', bestCost = Infinity;
    for (const [name, p] of Object.entries(places)) {
        if (!p.zone || !cabinAllowed(p.zone) || byName[name] === undefined) continue;
        const c = travelCost(fellAt, name);
        if (c < bestCost) { best = name; bestCost = c; }
    }
    return best;
}

// { zone, stage, bg } of the cabin for the wizard who has just fallen where state.zone says.
function cabinSpot() {
    if (onQuest()) {
        const name = nearestCabinStage(`${state.zone.current}${state.zone.stage}`);
        if (name) { const zone = places[name].zone; return { zone, stage: Number(name.slice(zone.length)), bg: backgroundOf(zone) }; }
    }
    const zone = pickRandomItem("el_Bosque,la_Pradera,el_Poblado,las_Dunas,el_Desierto,el_Pantano");
    return { zone, stage: Math.floor(Math.random() * MAXSTAGES) + 1, bg: backgroundOf(zone) };
}

export { cabinSpot, onQuest, cabinAllowed, lookOf };
