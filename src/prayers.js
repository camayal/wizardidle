// Wizard Idle - unanswered prayers and Hardened Heart (docs/plans/for_implementation_faith.md, section 4, step 5).
// Low on HP in a boss fight a believing wizard prays and a short window opens. If the god's heal touch comes in it,
// belief jumps and the heal works at full strength at any level; if not, belief drops and he gets a lasting
// Hardened Heart bonus (crit and XP, growing with each ignored prayer up to a cap). Numbers: config.prayer.

import { config } from './config.js';
import { state } from './state.js';
import { stats } from './stats.js';
import { fight } from './runtime.js';
import * as loop from './loop.js';
import { beliefMoment, isAtheist } from './belief.js';
import { printIn, wizardName } from './ui/render.js';
const print = printIn('divine');

const PRAY = "prays, with what little strength he has left,whispers a prayer he thought he had forgotten,begs the heavens for help";

// After the enemy's hit: a boss has him low, so he prays (once per fight).
export function despairCheck() {
    const p = state.player;
    if (!fight.bossCombat || fight.prayed || isAtheist() || p.hp <= 0 || p.hp >= p.hpBase * config.prayer.hpLine) return;
    fight.prayed = fight.prayerOpen = true;
    stats.count("prayer.made");
    print(`<i>${wizardName()} ${PRAY.split(",")[Math.floor(Math.random() * 3)]}...</i>`);
    loop.every("prayerWindow", () => {
        loop.stop("prayerWindow");
        if (!fight.prayerOpen) return;
        fight.prayerOpen = false;
        beliefMoment("prayerIgnored");
        stats.count("prayer.ignored");
        print(`<i>No answer comes. ${wizardName()}'s heart hardens.</i>`);
    }, config.prayer.windowMs);
}

// A heal touch while the prayer is open answers it. True when it did (the heal then ignores a Doubter's weakness).
export function prayerAnswered() {
    if (!fight.prayerOpen) return false;
    fight.prayerOpen = false;
    loop.stop("prayerWindow");
    beliefMoment("prayerAnswered");
    stats.count("prayer.answered");
    return true;
}

export function clearPrayer() {
    fight.prayerOpen = false;
    fight.prayed = false;
    loop.stop("prayerWindow");
}

// The lasting bonus of the prayers the god ignored.
export function hardened() {
    return Math.min(config.prayer.hardenedCap, stats.get("prayer.ignored"));
}
