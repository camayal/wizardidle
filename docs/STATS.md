# Stats and playtest tools plan

The technical base the professions plan ([PROFESSIONS.md](PROFESSIONS.md)) and the faith plan ([FAITH.md](FAITH.md)) both need:
1. **Stats:** record almost everything that happens, so achievements, quests, the story and balance decisions have numbers to work from. This is the "Track almost everything as stats" backlog entry in `ideas.md`.
2. **Playtest tools:** fast, repeatable simulated runs with god bots, because the author decided that **no balance number is set without a playtest**.

Written 2026-11-12. **Built 2026-11-12:** steps 1–4 below (the stats module, simulation mode, god bots and the runner, and the baseline in `docs/playtests/`); the curated scroll and records page are still open.

---

## Decisions (2026-11-12, by the author)

| Question | Decision |
|---|---|
| Where the tools live | **In the repo:** the `?sim=1` mode ships with the site (off unless asked for), the runner in `tools/`, results in `docs/playtests/` |
| What the player sees | **A curated stats scroll plus a new records page** (bests, firsts, lifetime numbers); the rest stays hidden for achievements, quests and playtests |
| Old counter names | **Rename them all to one dotted scheme. Old saves don't matter: we're in the dev phase.** No migration |
| How sure a playtest is | **10 seeds per setting, from level 1 to 200** (the whole game, so late-game snowballs show) |

---

## 1. Stats today

- **`count(name, amount = 1)`** (`src/state.js`) adds to `state.counters[name]`. That's the only kind of stat: **55 distinct counters**, several split by a key (`zone_*`, `enemy_*`, `typeBoss_*`, `school_*`, `altar_zone_*`, `BotinGot_*`, `Polymorph_*`, `study_*`, `taberna_zone_*`…). Some are really totals (`GoldFromEnemies`, `FeByPray`, `GoldOffered` add amounts).
- **`meta.playTimeMs`** is play time.
- **The world save** (`wizardidle2:world`) keeps the cemetery and the device id, and **no stats across wizards**.
- **Missing:** records (highest / lowest), firsts (when something first happened), per-level history, anything across wizards, and the **dice game tracks nothing**.
- The stats scroll (`updateStats()`, `src/ui/scrolls.js`) shows a hand-picked set, built section by section.
- Saves since 2.0.0 hold these counters. *Decided:* they don't need to keep working; the counters are renamed without a migration.

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
- **Per-level history:** at every level-up, one line is stored in `state.history`: `{ lvl, playTimeMs, faithG, goldG, belief, deaths, kills }` (amounts in g, the unit from FAITH.md). It's small (one line per level, 200 at most), and it serves the playtests now and a chart on the stats scroll later.

### What goes in first

Only what the next features need, in this order:

1. **Faith** (FAITH.md): every gain and loss goes through `faithChange(amount, source)`, which writes `faith.gain.<source>` / `faith.loss.<source>` totals, the `faith.highestG` / `faith.lowestG` records, belief-level changes and time spent at each level, and touches by kind (heal, hit, revive, tithe, refused).
2. **Deaths and revivals:** deaths by zone and by enemy (`killedBy`), revived by the god vs each rescuer.
3. **Professions** (PROFESSIONS.md): gathered, crafted, failed, used, sold and bought per item, blessings, trainer meetings.
4. **Dice game:** games, won / lost / tied, gold won / lost, best cargo, risky rolls and whether they paid.
5. **The rest of the catalogue** in `ideas.md` (combat records, exploration, study, habits, world), a few at a time.

### Achievements from stats

Achievement checks are scattered through the code today (`if (Number(counterText("BotinGot_chest")) > 100) …`). New achievements are written as **data**: `{ id, stat: "dice.won", atLeast: 50 }`, checked whenever that stat changes. The 13 placeholder achievements get their triggers this way.

## 3. Playtest tools

### What they do

Run the real game **much faster than real time**, with a **fixed random seed** and a **god bot**, from level 1 to a target level, and write a report. Different settings (e.g. `offeringMode: "cap"` vs `"share"`) run on the same seeds, so the comparison is fair.

### How

| Piece | What | Where |
|---|---|---|
| **Fast-forward loop** | `src/loop.js` gets a simulation mode: instead of waiting, it jumps straight to the next clock that is due. A virtual clock (`loop.now()`) replaces `performance.now()` for play time | `src/loop.js` |
| **The last stray timer** | The self-revive `setTimeout` (`src/combat.js`) becomes a loop clock, so it runs on the virtual clock too | `src/combat.js` |
| **Fixed seed** | In simulation mode `Math.random` (13 calls) is replaced by a seeded generator, so a seed always plays the same run | the simulation entry point |
| **No sound, light drawing** | Audio is muted and animations are skipped in simulation mode | `src/audio.js`, `src/spells.js` |
| **God bots** | *Idle*: never touches. *Active*: heals below 30% HP, revives at once, tithes at every shrine, tries to win back an atheist, uses the professions touches. *Custom*: rules from the URL | `src/dev/bots.js`, loaded only in simulation mode |
| **Settings from the URL** | `index.html?sim=1&seed=7&god=active&until=100&set=offeringMode:cap` overrides `config` values for the run | the simulation entry point |
| **Report** | At the end, the per-level history, the stats and the settings, written as JSON into the page | the simulation entry point |
| **Runner** | A Python script (standard library only; Edge and Python are already on the machine, Node isn't) serves the game locally, runs headless Edge for each setting × seed, collects the reports, and writes a summary table (and a chart) | `tools/playtest.py` |
| **Results** | One folder per question: `docs/playtests/2026-11-xx-offerings/` with the summary and the settings, so each decision is written down with its numbers | `docs/playtests/` |

The simulation mode only switches on with `?sim=1`. Normal play is unaffected.

### First questions to answer with it

From FAITH.md: offerings (share / cap / sqrt / level), the revive boost and faith farming, the belief thresholds, the shrine chance, and the professions touch prices. Plus a standing check after every change: **the pace still matches** (levels per hour and kills per level against the previous version, as in every phase so far).

## 4. Build order

1. `src/stats.js` with the four kinds, every `count()` call renamed, `state.stats` / `world.stats`, per-level history, the curated stats scroll and the records page. No gameplay change.
2. Fast-forward loop, the self-revive clock, seed, mute: simulation mode. Check a seeded run plays the same twice.
3. God bots and the URL settings; the report.
4. `tools/playtest.py` and the first summary: today's game with the idle and active god, 10 seeds to level 200 (the baseline every later change is compared with).
5. `faithChange()` and the faith stats, then the faith playtests (FAITH.md, step 1 onwards).
6. Professions and dice stats with their features; data-driven achievements.

## 5. Open questions

- Which stats make the curated scroll, and how the records page looks (it could reuse the scroll art).
- Run time: 10 seeds × level 200 per setting may take a while; if it's too slow, the runner can run several Edge windows at once.
