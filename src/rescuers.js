// Wizard Idle - who gets him up when the god doesn't (docs/plans/for_implementation_faith.md, section 9, step 7).
// Picked by the zone where he fell: pagan caravan, shaman, gravedigger, or a ghost of the cemetery (rare, anywhere);
// otherwise he gets up alone. Text only for now (no scenes or art yet). `hp` is the share of his HP he stands up with (getting up alone leaves him as he fell, near 0), `share` scales the faith the self-revive costs
// (1 = today's), `fellow` is what the console says. Numbers: config.rescuer (placeholders).

import { config } from './config.js';
import { state, world } from './state.js';
import { pickRandomItem, YesOrNot } from './utils.js';
import { stats } from './stats.js';
import { zones } from './data/zones.js';
import { destinations } from './travelGraph.js';
import { clearNPC, loadNPC, loadBackground, printIn, showStage, sleepInDark, wizardName } from './ui/render.js';
import { pickDream } from './dream.js';
import { run } from './runtime.js';
import { markup } from './ui/text.js';

const print = printIn('fight');

// The art that has landed (img/story/rescuer_<kind>.png, drawn on the enemy side like any NPC) and the camp scene of the caravan
// (img/places/<zone>/...). Add a kind here once the artist's file is in the game; until then the rescue plays without a picture.
const RESCUER_ART = new Set([]);
const CAMP_SCENE = "";           // e.g. "camp_caravan" once the fire pit scene is wired (the pagans only)
const STAY_MS = 3000;            // how long the rescuer stays beside him once the light is back

const BY_ZONE = {
    la_Pradera: "pagan", el_Desierto: "pagan", las_Dunas: "pagan",
    el_Bosque: "shaman", el_Pantano: "shaman", la_Tundra: "shaman",
    el_Castillo: "digger", el_Duenon: "digger", la_Gruta: "digger",
};

const RESCUERS = {
    pagan: { share: 1, hp: 0.7, carry: true, text: "A pagan caravan finds him, heals him with their rites and sets him on his feet" },
    shaman: { share: 0.6, hp: 0.5, text: "A shaman heals him with herbs and a murmured song, and asks nothing" },
    digger: { share: 1.5, hp: 0.5, text: "A gravedigger raises him, not quite alive, and whispers that there are quicker ways to power" },
};

// Where the story takes the god's click away, the story itself protects him (the plan, section 9: true death rule). Chapters VI and VII:
// the corrupt staff; X: the Last Escape scroll (heals him fully); XI: the reforged staff. Chapter VIII (149-159) is the story's own death
// scene (not built), so it is left to the usual rescuers. No faith cost: faith is locked there.
function storyRescuer() {
    const lvl = state.player.lvl;
    if (lvl >= 130 && lvl < 149) return { who: "staff", share: 0, hp: 0.5, text: `The corrupt staff drags ${state.player.name} up by itself, and he does not thank it` };
    if (lvl >= 190 && lvl < 200) return { who: "escape", share: 0, hp: 1, text: `The Last Escape tears ${state.player.name} away and heals him; the scroll burns a little` };
    if (lvl >= 200) return { who: "reforged", share: 0, hp: 0.5, text: `${world.staffName || 'Orrovan'} drags ${state.player.name} up, burning. He does not thank it` };
    return null;
}

// { who, share, text } of the rescuer, or null when he gets up alone.
export function pickRescuer() {
    const story = storyRescuer();
    if (story) return story;
    const dead = world.cemetery.filter((w) => w.name);
    if (dead.length && YesOrNot(config.rescuer.ghostChance, 0)) {
        const ghost = dead[Math.floor(Math.random() * dead.length)];
        return { who: "ghost", share: 0, hp: 0.25, text: `The ghost of ${ghost.name} (lvl ${ghost.lvl}) lifts him up` };
    }
    const kind = BY_ZONE[state.zone.current];
    return kind ? { who: kind, ...RESCUERS[kind] } : null;
}

// The pagan caravan drops him in another zone (a neighbour of the stage where he fell). Nothing happens if the stage has no way out.
export function carryAway() {
    const to = destinations(state.zone.current + state.zone.stage);
    if (!to.length) return;
    const spot = pickRandomItem(to.join(","));
    state.zone.current = spot.match(/\D+/).toString();
    state.zone.stage = Number(spot.match(/\d+/));
    state.zone.stay = 0;
    stats.count("death.carried");
    showStage();
    print(`${wizardName()} wakes up in the ${zones[state.zone.current].name}, far from where he fell`);
}

// The rescue as a scene (the author, 2026-11-26): no lifting animation. He fades out, the dream of the fall plays, and in the dark
// he is set where the rescuer waits (the caravan's camp in another zone; the others beside him, in place); then the light is back,
// the rescuer stays a moment and leaves. `rise()` (combat.js) stands him up in the dark; `done()` goes on with the next event.
export function rescueScene(rescuer, rise, done) {
    run.fallBy = "rescuer";
    const dream = pickDream();                   // the dream of the fall (run.storyDream = "fall"), played now instead of at the next rest
    let kind = rescuer.who;
    sleepInDark(dream, () => {
        const stay = () => { clearNPC(); done(); };
        if (RESCUER_ART.has(kind) && !run.simulation) setTimeout(stay, STAY_MS);       // the stay is a real-time beat; the game is thawed here
        else stay();
    }, () => {
        rise();                                  // standing, healed, and the caravan carries him away
        if (rescuer.carry && CAMP_SCENE) loadCamp();
        if (RESCUER_ART.has(kind)) loadNPC(`rescuer_${kind}`);
    });
    if (dream) print(fx('Dream', `${wizardName()} dreams: ${markup(dream.lines.join(" "), { name: wizardName() })}`), false, false, 'dreams');
}

function loadCamp() { loadBackground(CAMP_SCENE); }
