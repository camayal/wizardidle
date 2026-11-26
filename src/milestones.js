// Wizard Idle - faith that needs no touch, and the slow drift of belief (docs/plans/for_implementation_faith.md,
// sections 3 and 4, step 4): his own prayers when he rests or levels up, milestones (a boss, a chapter, a new zone,
// a close call) and belief drifting down while the god is silent (live and while the game was closed).
// Numbers: config.milestone (placeholders).

import { config } from './config.js';
import { stats, playTime } from './stats.js';
import { faithChange } from './faith.js';
import { calculateFe } from './wizard.js';
import { beliefLevel, beliefMoment, isDoubting } from './belief.js';
import { pickRandomItem, YesOrNot } from './utils.js';
import { printIn, updateHeading, wizardName } from './ui/render.js';
const print = printIn('divine');

const PRAYS = "says a short prayer,prays a little before going on,thanks the heavens quietly";
const MARKS = { boss: "feels the god's quiet approval", chapter: "feels a new chapter has been blessed", zone: "feels the god walking ahead of him in a new land", closeCall: "feels he was not alone in that fight" };

// His own prayer (rest, level up): faith by his level, never for an Atheist.
export function ownPrayer() {
    const level = beliefLevel();
    if (!YesOrNot(config.milestone.prayerChance[level] ?? 0, 0)) return;
    const got = faithChange(calculateFe() * config.milestone.prayerFe, "ownPrayer");
    stats.count("prayer.own");
    if (got > 0) { print(`<i>${wizardName()} ${pickRandomItem(PRAYS)}</i>`); updateHeading(); }
}

// A milestone: boss, chapter, zone, closeCall. Faith for everybody (no touch needed), even an Atheist.
export function milestone(kind) {
    const got = faithChange(calculateFe() * config.milestone[kind], `milestone.${kind}`);
    stats.count(`milestone.${kind}`);
    if (got > 0 && !isDoubting()) print(`<i>${wizardName()} ${MARKS[kind]}</i>`);
    updateHeading();
}

// Silence: the god has done nothing for a while. Belief drifts down (never below his start by silence alone).
let lastAct = 0;
export function godActed() { lastAct = playTime(); }

export function silenceTick() {
    if (playTime() - lastAct < config.milestone.silenceMs) return;
    beliefMoment("silence", config.milestone.silenceFloor);
    stats.count("belief.silenceTicks");
}

// While the game was closed: the same drift per world hour.
export function driftAway(hours) {
    for (let n = Math.min(120, Math.floor(hours * config.milestone.driftPerWorldHour)); n > 0; n--) beliefMoment("silence", config.milestone.silenceFloor);
}
