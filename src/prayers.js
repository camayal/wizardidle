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
import { godFace } from './miracles_spells.js';
import { pickRandomItem } from './utils.js';
import { logro } from './achievements.js';
import { printIn, wizardName } from './ui/render.js';
const print = printIn('divine');

const PRAY = {
    mercy: "prays to a god he knows is kind,whispers a prayer, sure that someone listens,asks for the mercy he has felt before",
    wrath: "prays, afraid of the god's anger,begs the stern god for a little help,bows his head and prays",
    distant: "prays into the silence,whispers a prayer he is not sure anyone hears,asks the empty sky for help",
};
let helps = 0;      // touches of the god since a prayer last went unanswered (expected help)
export function noteHelp() { helps++; }

// After the enemy's hit: a boss has him low, so he prays (once per fight).
export function despairCheck() {
    const p = state.player;
    if (!fight.bossCombat || fight.prayed || isAtheist() || p.hp <= 0 || p.hp >= p.hpBase * config.prayer.hpLine) return;
    fight.prayed = fight.prayerOpen = true;
    stats.count("prayer.made");
    print(`<i>${wizardName()} ${pickRandomItem(PRAY[godFace()])}...</i>`);
    loop.every("prayerWindow", () => {
        loop.stop("prayerWindow");
        if (!fight.prayerOpen) return;
        fight.prayerOpen = false;
        beliefMoment("prayerIgnored");
        if (helps >= config.prayer.expectAfter) beliefMoment("expectedMissed");      // help he had learnt to expect didn't come
        helps = 0;
        stats.count("prayer.ignored");
        logro.set(logro.logro_hardened);
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
