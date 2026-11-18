// Wizard Idle v2 - time away (docs/AWAY.md). The save stores when the god last watched
// (state.meta.lastSeen); on load, away time / 108 is "world time" and changes the wizard a
// little: faith falls, gold drifts, a level or two (never up to the next chapter), and after
// about a month he has fallen (soft dead); after more, he may die for good. The numbers are
// in config.away, the formulas in src/awayMath.js. Nothing is announced except the console
// line when he has fallen and the poem when he died for good.
//
// To try it: in the browser console set `dev.state.meta.lastSeen -= 40 * 86400000` and reload
// (about 40 days away); the page saves again on hide, so do it right before reloading.

import { config } from './config.js';
import { state, world, deleteSave, reloadAway } from './state.js';
import { fight, run, ui } from './runtime.js';
import * as loop from './loop.js';
import { chapter } from './story.js';
import { recordLevel, stats } from './stats.js';
import { setLevelValues } from './wizard.js';
import { print, wizardName, poemInDark } from './ui/render.js';
import { zones } from './data/zones.js';
import { poems, awayText } from './data/awayTexts.js';
import { faithAfter, goldAfter, levelsGained, permadeathChance, worldHours } from './awayMath.js';

// Levels with a chapter stop the levels from away time; so does the last level.
const thresholds = () => [...Object.keys(chapter).map((k) => Number(k.replace("lvl", ""))), 200];

// Chapters where the story protects him (config.away.protectedLevels).
const protectedLevel = (lvl) => config.away.protectedLevels.some(([a, b]) => lvl >= a && lvl <= b);

// A quiet level up: no scroll, no console line, no sound.
function quietLevel() {
    const p = state.player;
    p.lvl += 1;
    p.age += p.xpNext * 0.0005;
    setLevelValues();
    p.xp = p.xpPast;
    recordLevel();
}

// Settle the time since the god last watched. Returns "none", "drift", "soft" (fallen, can be
// revived) or "dead" (died for good: the poem is on screen). Call once when a wizard loads.
export function settleAway(rand = Math.random) {
    const m = state.meta;
    const since = m.lastSeen;
    m.lastSeen = Date.now();
    if (run.simulation) return "none";
    const p = state.player;
    const safe = protectedLevel(p.lvl);
    if (safe) { m.softDead = false; m.awayHours = 0; }
    const seconds = since ? (Date.now() - since) / 1000 : 0;
    const hours = seconds < config.away.minSeconds ? 0 : worldHours(seconds);
    const wasDown = !!m.softDead;
    if (!hours && !wasDown) return "none";
    // a fallen wizard keeps counting from where he lay: the hours add up until the god's touch
    const total = wasDown ? (m.awayHours || 0) + hours : hours;
    if (hours && !safe && (wasDown || total >= config.away.softDeadHours) && rand() < permadeathChance(total)) {
        dieAway();
        return "dead";
    }
    if (hours) {
        p.faith = faithAfter(p.faith, hours);
        p.gold = goldAfter(p.gold, hours, rand());
        for (let n = levelsGained(p.lvl, hours, rand(), thresholds()); n > 0; n--) quietLevel();
        stats.add("away.worldHours", hours);
        stats.count("away.returns");
        stats.max("away.longestHours", Math.round(hours * 10) / 10);
    }
    if (!safe && (wasDown || total >= config.away.softDeadHours)) {
        m.softDead = true;
        m.awayHours = total;
        p.hp = 0;
        fight.pjDead = true;
        run.softDead = true;        // a touch now saves him (src/divine.js counts it)
        if (!wasDown) {
            stats.count("death.falls", 1, { world: true });
            stats.count("death.away");
            stats.count("away.softDead");
        }
        print(awayText("softDead", slots()));
        // no self revive, not even after a reload: only the god's touch lifts him (docs/AWAY.md)
        return "soft";
    }
    return hours ? "drift" : "none";
}

// He died for good while away: the cemetery, the save forgotten, the poem over the dark
// scene, then the next wizard.
function dieAway() {
    world.cemetery.push({
        name: state.player.name,
        lvl: state.player.lvl,
        age: state.player.age,
        born: state.meta.createdAt,
        died: new Date().toISOString(),
        kills: stats.get("kill.enemies") + stats.get("kill.rare"),
        falls: stats.get("death.falls"),
        away: true,
    });
    stats.count("death.away");
    stats.count("away.permadeath");
    loop.stopAll();
    const poem = nextPoem();        // before the world is written: the bag is saved with it
    deleteSave();
    setTimeout(() => poemInDark(poem, slots(), () => location.reload()), 600);     // the next wizard
}

// The slots of the away texts: his name and the zone he lay in.
const slots = () => ({ name: wizardName(), zone: zones[state.zone.current].name });

// The next poem of the world's shuffle bag: none repeats until all have been read; the one read
// last never opens the next round.
function nextPoem() {
    let bag = world.poemBag;
    if (!bag || !bag.length) {
        bag = poems.map((p) => p.id);
        for (let i = bag.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [bag[i], bag[j]] = [bag[j], bag[i]];
        }
        if (bag.length > 1 && bag[0] == world.poemLast) bag.push(bag.shift());
        world.poemBag = bag;
    }
    const id = world.poemLast = bag.shift();
    return poems.find((p) => p.id == id);
}

// A hidden page counts as away: the game waits while it is hidden; if it stayed hidden past
// minSeconds, showing it again reloads, and the load settles the time. The same in the dev
// tools (the author's request, 2026-11-18: dev sessions behave as the live game).
let watching = false;
export function watchHidden() {
    if (watching || run.simulation) return;
    watching = true;
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) return loop.freezeGame();
        loop.thawGame();
        if ((Date.now() - state.meta.lastSeen) / 1000 >= config.away.minSeconds) reloadAway();
    });
}
