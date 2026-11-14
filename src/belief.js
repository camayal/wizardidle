// Wizard Idle v2 - belief: how much the wizard believes in his god (docs/FAITH.md 3.1, decided
// by the author on 2026-11-13). Faith stays the currency the god spends; belief is its own
// meter, -100 to +100, moved by moments (a heal that saves him, the god's final blow...), never
// by spending, and it doesn't drift on its own. The four levels read from it. The numbers are
// starting values in config.belief, to tune with playtests.

import { config } from './config.js';
import { state } from './state.js';
import { playTime, stats } from './stats.js';
import { print, wizardName } from './ui/render.js';

const LEVELS = ["atheist", "doubter", "believer", "devout"];
const ANNOUNCE = {
    devout: "is filled with devotion for his god",
    believer: "believes in his god again",
    doubter: "starts to doubt his god",
    atheist: "no longer believes in anything",
};
const b = () => config.belief;

// The level for a value, with no margin: the lines are at atheist, doubter (0) and devout.
function rawLevel(value) {
    if (value >= b().devout) return "devout";
    if (value >= b().doubter) return "believer";
    if (value >= b().atheist) return "doubter";
    return "atheist";
}

// The line he must reach to climb into a level (the margin applies on the way up only, so he
// doesn't flicker at a line: back from Atheist only at -50).
function lineFor(level) {
    return { doubter: b().atheist, believer: b().doubter, devout: b().devout }[level];
}

export function beliefLevel() {
    return state.player.beliefLevel || "believer";
}

// A moment moves belief (kind is the config weight's name; stats count each kind). Nothing moves
// once the story has locked it ("lost").
export function beliefMoment(kind) {
    if (state.player.beliefLost) return;
    const weight = b().weights[kind];
    if (!weight) return;
    const p = state.player;
    p.belief = Math.max(b().min, Math.min(b().max, p.belief + weight));
    stats.count(`belief.moment.${kind}`);
    stats.max("belief.highest", Math.round(p.belief));
    stats.min("belief.lowest", Math.round(p.belief));
    updateLevel();
}

function updateLevel() {
    const p = state.player, now = beliefLevel(), raw = rawLevel(p.belief);
    let next = now;
    if (LEVELS.indexOf(raw) < LEVELS.indexOf(now)) next = raw;                  // down: at once
    else if (LEVELS.indexOf(raw) > LEVELS.indexOf(now)) {                       // up: past the margin
        for (const level of LEVELS.slice(LEVELS.indexOf(now) + 1, LEVELS.indexOf(raw) + 1)) {
            if (p.belief >= lineFor(level) + b().margin) next = level;
        }
    }
    if (next == now) return;
    stats.add(`belief.time.${now}`, playTime() - (p.beliefSince || 0));     // ms of play at each level
    p.beliefSince = playTime();
    p.beliefLevel = next;
    stats.first(`first.belief.${next}`);
    stats.count(`belief.reached.${next}`);
    print(`<span style='color:#7a4fa0'>${wizardName()} ${ANNOUNCE[next]}</span>`);
}

// What a touch costs at his level (Devout cheaper, Doubter double); null when he refuses it
// (an Atheist refuses every touch but a revive).
export function touchCost(faith) {
    const level = beliefLevel();
    if (level == "atheist") return null;
    return faith * (level == "devout" ? b().devoutTouchCost : level == "doubter" ? b().doubterTouchCost : 1);
}

// The chance he enters a shrine, from his level (an Atheist never does).
export function shrineChance(base) {
    const level = beliefLevel();
    if (level == "atheist") return 0;
    return Math.max(0, Math.min(1, base + (level == "devout" ? b().devoutShrine : level == "doubter" ? b().doubterShrine : 0)));
}

// Doubters and Atheists are on the way out: some moments weigh differently for them.
export function isDoubting() {
    const level = beliefLevel();
    return level == "doubter" || level == "atheist";
}

export function isAtheist() {
    return beliefLevel() == "atheist";
}
