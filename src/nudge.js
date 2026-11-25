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
import { NUDGE_TEXTS } from './data/nudgeTexts.js';
import { YesOrNot } from './utils.js';
import { print, updateHeading, wizardName } from './ui/render.js';

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
    print(`<i>${line.replace('{name}', wizardName()).replace('{where}', spot.label || 'there')}</i>`);
    if (follows) run.nudge = { kind: spot.kind, to: spot.to, label: spot.label, life: config.faith.nudgeLife };
    return 'done';
}

// Each event: a pending nudge grows old.
export function tickNudge() {
    if (run.nudge && --run.nudge.life <= 0) run.nudge = null;
}
