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
import { run, ui } from './runtime.js';
import { hideTableau, showTableau } from './ui/camp.js';
import { markup } from './ui/text.js';

const print = printIn('fight');

// The art in the game: the pagans' camp (src/ui/camp.js), the shaman (img/story/rescuer_shaman.png, drawn at the enemy's place) and the
// ghost (an animated strip, camp.js). The gravedigger has none yet: add its kind here once img/story/rescuer_digger.png is in.
const RESCUER_ART = new Set(["pagan", "shaman", "ghost"]);
const STAY_MS = { pagan: 5000 };     // how long the rescuer stays once the light is back (the others 3 s)
const CAMP_ZONES = new Set(["la_Pradera", "el_Desierto", "las_Dunas", "el_Bosque", "la_Tundra"]);     // open scenes where the caravan's camp fits (no swamp firepit, castle, caves, mines)

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
    const to = destinations(state.zone.current + state.zone.stage).filter((d) => CAMP_ZONES.has(d.match(/\D+/).toString()));
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
    const kind = rescuer.who, art = RESCUER_ART.has(kind) && !run.simulation;
    sleepInDark(dream, () => {
        const stay = () => { hideTableau(); clearNPC(); loadBackground(ui.currentBackGround, ui.mirrored); done(); };     // the scene is reloaded so its front layer drops the camp
        if (art) setTimeout(stay, STAY_MS[kind] || 3000);       // a real-time beat; the game is thawed here
        else done();
    }, () => {
        ui.wizardOffset = 0;                     // he wakes at his usual place
        if (art) showTableau(kind);              // before the move, so the new scene's front layer already has the camp
        rise();                                  // standing, healed, and the caravan carries him away
        if (art) loadBackground(ui.currentBackGround, ui.mirrored);
        if (art && kind == "shaman") loadNPC("rescuer_shaman");
    });
    if (dream) print(fx('Dream', `${wizardName()} dreams: ${markup(dream.lines.join(" "), { name: wizardName() })}`), false, false, 'dreams');
}

// For the dev tests: the rescuer of a kind ("pagan", "shaman", "digger") or the ghost.
export const rescuerOf = (kind) => kind == "ghost" ? { who: "ghost", share: 0, hp: 0.25, text: "A ghost lifts him up" } : { who: kind, ...RESCUERS[kind] };
