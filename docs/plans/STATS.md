# Stats and playtest tools plan

The technical base the professions plan ([PROFESSIONS.md](PROFESSIONS.md)) and the faith plan ([for_implementation_faith.md](for_implementation_faith.md)) both need:
1. **Stats:** record almost everything that happens, so achievements, quests, the story and balance decisions have numbers to work from. This is the "Track almost everything as stats" backlog entry in `ideas.md`.
2. **Playtest tools:** fast, repeatable simulated runs with god bots, because the author decided that **no balance number is set without a playtest**.

Written 2026-11-12. **Built:** the stats module, simulation mode (`?sim=1`), god bots, the runner `tools/playtest.py` (how they work: MAP.md) and the curated Stats and Records pages. This file now keeps the naming scheme and the stats the next features add; the finished plan is in the archive.

---

## Decisions (2026-11-12, by the author)

| Question | Decision |
|---|---|
| Where the tools live | **In the repo:** the `?sim=1` mode ships with the site (off unless asked for), the runner in `tools/`, results in `docs/playtests/` |
| What the player sees | **A curated stats scroll plus a new records page** (bests, firsts, lifetime numbers); the rest stays hidden for achievements, quests and playtests |
| Old counter names | **Rename them all to one dotted scheme. Old saves don't matter: we're in the dev phase.** No migration |
| How sure a playtest is | **10 seeds per setting, from level 1 to 200** (the whole game, so late-game snowballs show) |

---

## 2. Four kinds of stat, one module

A new `src/stats.js` replaces the bare `count()`:

| Kind | Call | Stored as | Example |
|---|---|---|---|
| **Counter** | `stat.count("kill.corrupted")` | a number | corrupted enemies killed |
| **Total** | `stat.add("gold.fromEnemies", 120)` | a number | gold earned from kills |
| **Record** | `stat.max("combat.biggestHit", 940)` / `stat.min("faith.lowestG", -310)` | `{ value, lvl, age, date }` | biggest hit, lowest faith |
| **First** | `stat.first("boss.firstKill")` | `{ lvl, age, date, playTimeMs }`, written once | first boss, first death, profession chosen |

- **Per wizard** in `state.stats`, **per world** in `world.stats` (lifetime kills, wizards created, highest level ever, oldest wizard). One call can write both: `stat.count("kill.boss", 1, { world: true })`.
- **Names (decided):** every stat uses a dotted name by area (`faith.*`, `combat.*`, `prof.*`, `dice.*`, `explore.*`, `world.*`). The 55 existing counters are **renamed** (e.g. `GoldFromEnemies` → `gold.fromEnemies`, `negar` → `faith.shrineSkipped`, `taberna_zone_el_Poblado` → `inn.zone.el_Poblado`). No migration: a save from before simply starts its stats again.
- **Per-level history:** at every level-up, one line is stored in `state.history`: `{ lvl, playTimeMs, faithG, goldG, belief, deaths, kills }` (amounts in g, the unit from for_implementation_faith.md). It's small (one line per level, 200 at most), and it serves the playtests now and a chart on the stats scroll later.

### What goes in first

Only what the next features need, in this order:

1. **Faith** (for_implementation_faith.md): every gain and loss goes through `faithChange(amount, source)`, which writes `faith.gain.<source>` / `faith.loss.<source>` totals, the `faith.highestG` / `faith.lowestG` records, belief-level changes and time spent at each level, and touches by kind (heal, hit, revive, tithe, refused).
2. **Deaths and revivals:** deaths by zone and by enemy (`killedBy`), revived by the god vs each rescuer.
3. **Professions** (PROFESSIONS.md): gathered, crafted, failed, used, sold and bought per item, blessings, trainer meetings.
4. **Dice game:** games, won / lost / tied, gold won / lost, best cargo, risky rolls and whether they paid.
5. **The rest of the catalogue** in `ideas.md` (combat records, exploration, study, habits, world), a few at a time.

### Added 2026-11-17 (every stat is per wizard and per world)

- **Combat:** `combat.won`, `combat.wonAlone` / `combat.wonWithGod`, `combat.flawless` (no damage taken), `combat.longestFight` (steps), `combat.closestCallPct` (lowest HP % at a win), `combat.damageDealt`, `combat.damageTaken`, `combat.biggestHitTaken`, `spell.cast.<spell>`, `spell.healed`, `kill.polymorphed`.
- **Falls:** `death.by.<sprite|boss|hydra>`, `death.byBoss`, `death.byHydra`, `death.byPolymorphed.<animal>`, `death.zone.<zone>`, `death.level.<tens>`.
- **Time away:** `away.returns`, `away.longestHours`, `away.softDead`, `away.permadeath`, `away.savedByTouch` (`death.away` still counts both).
- **Dice house:** `dice.games`, `dice.wins` / `dice.losses` / `dice.ties`, `dice.anotherRound`, `dice.biggestBet`, `gold.dice.bet`, `gold.dice.won`.
- **Elsewhere:** `explore.restlessLeaves`, `inn.hpRecovered`, `story.chaptersRead`, `dream.seen.<dream id>`, `god.killAsked`, `god.killTakenBack`, `world.wizardsKilledByGod`, `world.cemetery.read.<tomb>`.

### Achievements from stats

Achievement checks are scattered through the code today (`if (Number(counterText("BotinGot_chest")) > 100) …`). New achievements are written as **data**: `{ id, stat: "dice.won", atLeast: 50 }`, checked whenever that stat changes. The 13 placeholder achievements get their triggers this way.

## 5. Open questions

- ~~Which stats make the curated scroll, and how the records page looks.~~ **Decided 2026-11-12:** curated Stats page plus a Records page in the same scroll (tabs), from mockups.
- Run time: 10 seeds × level 200 per setting may take a while; if it's too slow, the runner can run several Edge windows at once.
