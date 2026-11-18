// Wizard Idle v2 - time away (docs/AWAY.md). The save stores when the god last watched
// (state.meta.lastSeen); on load, away time / 108 is "world time" and changes the wizard a
// little: faith falls, gold drifts, a level or two (never up to the next chapter), and after
// about a month he has fallen (soft dead); after more, he may die for good. The numbers are
// in config.away, the formulas in src/awayMath.js. Nothing is announced except the console
// line when he has fallen and the poem when he died for good.
//
// To try it: in the browser console set `dev.state.meta.lastSeen -= 40 * 86400000` and reload
// (about 40 days away); the page saves again on hide, so do it right before reloading.

import { config, DEV } from './config.js';
import { state, world, deleteSave, reloadAway } from './state.js';
import { fight, run, ui } from './runtime.js';
import * as loop from './loop.js';
import { chapter } from './story.js';
import { recordLevel, stats } from './stats.js';
import { setLevelValues } from './wizard.js';
import { print, wizardName } from './ui/render.js';
import { scrollOpen } from './ui/scrolls.js';
import { el } from './ui/dom.js';
import { awayTexts, awayText } from './data/awayTexts.js';
import { faithAfter, goldAfter, levelsGained, permadeathChance, worldHours } from './awayMath.js';

// Levels with a chapter stop the levels from away time; so does the last level.
const thresholds = () => [...Object.keys(chapter).map((k) => Number(k.replace("lvl", ""))), 200];

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
    const since = state.meta.lastSeen;
    state.meta.lastSeen = Date.now();
    if (!since || run.simulation) return "none";
    const seconds = (Date.now() - since) / 1000;
    if (seconds < config.away.minSeconds) return "none";
    const hours = worldHours(seconds);
    const p = state.player;
    if (rand() < permadeathChance(hours)) {
        dieAway();
        return "dead";
    }
    p.faith = faithAfter(p.faith, hours);
    p.gold = goldAfter(p.gold, hours, rand());
    for (let n = levelsGained(p.lvl, hours, rand(), thresholds()); n > 0; n--) quietLevel();
    stats.add("away.worldHours", hours);
    stats.count("away.returns");
    stats.max("away.longestHours", Math.round(hours * 10) / 10);
    if (hours >= config.away.softDeadHours) {
        p.hp = 0;
        fight.pjDead = true;
        run.softDead = true;        // a touch now saves him (src/divine.js counts it)
        stats.count("death.falls", 1, { world: true });
        stats.count("death.away");
        stats.count("away.softDead");
        print(awayText("softDead", wizardName()));
        // no self revive: only the god's touch lifts him (docs/AWAY.md)
        return "soft";
    }
    return "drift";
}

// He died for good while away: the cemetery, the save forgotten, the poem on a scroll; closing
// it loads the next wizard (src/ui/menu.js).
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
    deleteSave();
    setTimeout(() => {
        el("innerTextScroll").innerHTML = `<span class="titles" id="historyTitle">${awayTexts.poemTitle}</span><br><br>${awayText("poem", wizardName())}<br>`;
        el("innerTextScroll").style.display = "block";
        el("historyTitle").style.fontSize = `${ui.em * 2.5}px`;
        el("historyTitle").style.lineHeight = `${ui.em * 2.5}px`;
        scrollOpen("away");
    }, 600);
}

// A hidden page counts as away: the game waits while it is hidden; if it stayed hidden past
// minSeconds, showing it again reloads, and the load settles the time. Not in the dev tools
// (they have their own wait) so a long look elsewhere does not reload a developer's session.
let watching = false;
export function watchHidden() {
    if (watching || DEV || run.simulation) return;
    watching = true;
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) return loop.freezeGame();
        loop.thawGame();
        if ((Date.now() - state.meta.lastSeen) / 1000 >= config.away.minSeconds) reloadAway();
    });
}
