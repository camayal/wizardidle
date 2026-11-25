// Wizard Idle - the god nudges the wizard by touching a spot of the scene (docs/plans/HOTSPOTS.md, decided 2026-11-25).
// A touch costs a flat amount of faith. He follows it by his belief (a refused nudge still costs the faith). One touch
// of the environment per scene: any later tap in the same scene does nothing, silently. A followed nudge waits as
// run.nudge for the next decision (travel, events) and expires after a few events.

import { config } from './config.js';
import { state } from './state.js';
import { run } from './runtime.js';
import { stats } from './stats.js';
import { beliefLevel } from './belief.js';
import { faithChange } from './faith.js';
import { calculateFe } from './wizard.js';
import { NUDGE_TEXTS, THEN } from './data/nudgeTexts.js';
import { YesOrNot } from './utils.js';
import { clearFindSpot } from './ui/hotspots.js';
import { printDivine, updateHeading, wizardName } from './ui/render.js';

export const nudgeCost = () => Math.round(calculateFe() * config.faith.nudgeCostFe);

let usedIn = null;       // the scene visit that already had its one touch
export const newScene = () => { usedIn = null; };

// The spot's tap, called by the hotspot layer. Returns 'done' when it nudged, 'silent' when the tap was swallowed on
// purpose (no text, no glow: nothing may show where a spot is), false when it falls through to the buttons under it.
export function touchSpot(spot) {
    if (run.questOffer || run.questAttn) return false;       // a job is waiting: the touches mean "take it" or "leave it"
    if (usedIn) return 'silent';                             // one touch per scene: the rest do nothing
    if (run.nudge || state.player.faith < nudgeCost()) return 'silent';
    usedIn = spot;
    const level = beliefLevel(), follows = YesOrNot(config.faith.nudgeFollow[level] ?? 0.5, 0);
    faithChange(-nudgeCost(), 'nudge');
    updateHeading();
    stats.count('nudge.sent');
    stats.count(`nudge.sent.${spot.kind}`);
    stats.count(follows ? 'nudge.followed' : 'nudge.refused');
    const lines = NUDGE_TEXTS[level][follows ? 'yes' : 'no'], line = lines[Math.floor(Math.random() * lines.length)];
    const thens = THEN[spot.kind] || THEN.exit, then = thens[Math.floor(Math.random() * thens.length)];
    printDivine(`<i>${line.replace('{then}', follows ? then : '').replace('{where}', spot.label || 'there').replace('{name}', wizardName()).trim()}</i>`);
    const travels = spot.kind == 'exit' || spot.kind == 'mouth';
    if (follows && spot.kind == 'dream') { run.godDream = spot.to || 'nightmare'; stats.count('nudge.used.dream'); }       // tonight's sleep (src/dream.js)
    else if (follows) run.nudge = { kind: spot.kind, to: spot.to, label: spot.label, fresh: true, life: travels ? config.faith.nudgeTravelLife : config.faith.nudgeLife };
    return 'done';
}

// Each event: a pending nudge grows old.
export function tickNudge() {
    if (run.nudge && --run.nudge.life <= 0) run.nudge = null;
}

// A place nudge (a shrine, an inn, something to study in sight) decides the next event; returns its number or 0.
const PLACE_EVENT = { shrine: 3, inn: 4, study: 5, book: 5 };
export function nudgeEvent() {
    const n = run.nudge;
    if (!n || n.kind != 'place') return 0;
    run.nudge = null;
    const event = PLACE_EVENT[n.to];
    if (!event) return 0;
    stats.count('nudge.used.place');
    if (event == 3) run.questShrine = true;          // he goes in, as for a quest's shrine
    if (event == 4) run.questInn = true;
    if (n.to == 'book') run.studyBook = true;        // the shelves: a book, never a statue
    return event;
}

// While he studies a find the god pointed at: this study succeeds. True once, then the nudge is used up.
export function studyFocus() {
    const n = run.nudge;
    if (!n || n.kind != 'find') return false;
    run.nudge = null;
    stats.count('nudge.used.find');
    return true;
}

// The find is over: a nudge about it that was not used goes with it.
export function endFind() {
    if (run.nudge && run.nudge.kind == 'find') run.nudge = null;
    clearFindSpot();
}
