# Roadmap

Work happens on `dev`; `main` is the live site and only gets playable versions. Each stage starts when the one before it is done.

## 1. Clean up the code (done 2026-11-11)

- [x] Update the code to modern JavaScript (`let`/`const`, template strings, arrow functions where they help).
- [x] Remove redundancy: repeated blocks (e.g. the same "end of event, back to the event picker" code in many places), copy-pasted texts, duplicated constants.
- [x] Make it more manageable: smaller functions with clear names, related code together.
- [x] Annotate each part of the code: a short comment per module and per function saying what it does. No excessive comments.
- [x] Keep gameplay identical, checked with the same tests as the v2 rebuild.

## 2. Modern, faster, less redundant (done 2026-11-12, released as 2.1.0)

Gate before moving on: the whole code base is modern, measurably faster where it matters (game loop, drawing, console output), and free of the redundancy found in stage 1.

*Result:* measured over 10- and 30-minute games (animation frames, images, sounds, console writes). Drawing was the only real cost and was fixed. The console was measured as cheap (30–60 writes a minute) and left as it is; a lighter `print()` (one element per line instead of rewriting the whole console) can come later if needed.

- [x] Spell animations never stop (a v1 bug, found in stage 1): when the last frame is drawn, `spell()` cancels the frame request but then requests another one, so every spell ever cast keeps redrawing about 60 times per second, each loop clearing the shared spell canvas. Fix first: it costs CPU and can make spells flicker. *Fixed 2026-11-12: over a 30-minute game, 72,329 animation callbacks (peak 646/s) became 3,730 (peak 50/s).*
- [x] Images loaded once and reused (v1 created a new image on every redraw), with stale late loads ignored.
- [x] Dead speed-debug branches (`masterTime < 500`) removed; enemy flags are real booleans; the medium-length event functions split into named steps.
- [x] Offline file list and cache version generated at deploy (`.github/scripts/precache.py`); `service-worker.js` went from 22 KB to 3 KB.
- [ ] Later: the cache version is the commit, so every deploy (even docs-only) makes installed players re-download all ~6 MB. Derive it from a hash of the cached files, or keep art and sound in a long-lived cache of their own.
- [x] Chapter race fixed: when the scroll had to close first, the chapter text was read for the level reached by then (two levels at once could crash).

## 3. Stats, playtests, then the story with the faith rebalance

Order decided by the author on 2026-11-12: the story depends on the faith rebalance (chapter X lock, the Last Escape scroll, belief levels) and on professions (the second trade unlocks at chapter III), and no balance number gets set without a playtest. Detailed plans: [STATS.md](STATS.md), [FAITH.md](FAITH.md), [PROFESSIONS.md](PROFESSIONS.md), [ERASURE.md](ERASURE.md) (the final battle's souls).

**3a. Stats and playtest tools**
- [x] Dev test bar (`src/dev/tests.js`, done 2026-11-12): a bar at the bottom of the screen while developing, with test scenarios (each prepares the wizard and forces the first event, then says what to check), quick actions (+1 level, gold, faith, speed x10, pause) and a command line. `DEV` in `src/config.js`; the deploy switches it off, so the live site never loads it.
- [x] A stats module (`src/stats.js`, done 2026-11-12): counters, totals, records and firsts under dotted names, per wizard and per world, one history line per level ([STATS.md](STATS.md)).
- [ ] The curated stats scroll and the records page (open question in [STATS.md](STATS.md)).
- [x] Playtest tools (done 2026-11-12): simulation mode (`?sim=1`, `src/dev/sim.js`: virtual clock, seeded random, no sound or drawing), god bots (`src/dev/bots.js`), the runner `tools/playtest.py`, results in `docs/playtests/`. A level-200 run takes about 2 real seconds.
- [ ] Faith stats (`faithChange()`), then the faith playtests ([FAITH.md](FAITH.md)); professions and dice stats with their features; data-driven achievements.

**3b. The story, planned together with the faith rebalance**
- [ ] Queue chapters first: with the keys fixed, consecutive levels will have chapters (128–129, 139–140, 149–150, 199–200). The chapter-race fix keeps one chapter at a time, so a second chapter opening while the scroll is still closing would replace the first one's text.
- [ ] Fix the chapter keys in `src/story.js` (a v1 bug, kept so stage 1 doesn't change gameplay): `lvl60` and `lvl90` appear twice, so the later entries (Chapter IX and X, meant for levels 160 and 190) replace the earlier ones and show at levels 60 and 90; Chapter IV never shows. `lvl99` should be `lvl199`, and `lv200` (missing an `l`) means Chapter XI never fires.
- [ ] Fix the rest message (v1 text bug): `wakeUp()` in `events.js` counts the recovered HP twice when choosing it, so "feels totally renewed" also shows after a partial rest.
- [ ] Faith rebalance: belief levels, a free revive, rescuers instead of the self-revive, the chapter X lock, the Last Escape scroll ([FAITH.md](FAITH.md)).
- [ ] Implement the story from the ideas backlog in `ideas.md` ("Finish the story": chapters III–XI and the final battle, plus the related story ideas), balanced with the playtest tools.

## 4. Professions, then the rest

- [ ] Professions ([PROFESSIONS.md](PROFESSIONS.md)); fix the Town dice house condition in the same change (see the v1 bugs below).
- [ ] The rest of the ideas backlog in `ideas.md`, one feature at a time. This is the long part.

## Done: the v2 rebuild (2.0.0, live since 2026-11-11)

- [x] **Structure.** ES modules under `src/`, game data in `src/data/`, no build step.
- [x] **State.** One plain-JSON save (`src/state.js`), balance in `src/config.js`, kill no longer wipes other site data.
- [x] **Systems.** 15 modules, shared runtime objects (`src/runtime.js`), one game loop (`src/loop.js`).
- [x] **Polish and release.** v1 bugs fixed (below), offline mode, fixed manifest, version 2.0.0.

## Bugs spotted in v1

Phases 1-3 deliberately preserved v1 behavior, so these were written down first and fixed in phase 4:

- ~~**Level 210+ crashes every attack.**~~ Fixed: past level 200 the wizard keeps using the 21 existing spell tiers instead of asking for a 22nd (`knownTier()` in `spells.js`). Verified by stress runs from level 205 up to 270.
- ~~**"acá hay un BUG" (v1 author's own note).**~~ Root cause found: the wizard and the enemy can fall in the same round. The enemy's death cleared `fight.enemy` and restarted the event picker; the wizard's death then read `enemyTypes[""]` and crashed, and events would keep running while he lay dead. Fixed: a fallen enemy takes no gold, and the event picker stops until the wizard revives.
- ~~**"another Boss" never shows.**~~ Fixed: the text is chosen before `previousEvent` is overwritten.
- ~~**Easter egg check uses an unset variable.**~~ Fixed: the "HEY GUY LOOK AT ME!" check only runs for normal enemies.
- ~~**`stats.random()` assumes two methods.**~~ Fixed: picks from the skills explicitly.
- ~~**Boss fights read the previous enemy.**~~ On closer reading this was not a real bug: gold and XP already branch on boss / hydra / normal enemy. The one weak spot, a hydra without gold reading the last normal enemy, can't happen today (every hydra drops gold) and was hardened anyway.
- ~~**Placeholder achievements.**~~ The 13 unfinished ones are marked `planned:true`, stay hidden and no longer count towards completion (which made 100% impossible). Designing them is in the ideas backlog.
- ~~**Typos in player-facing text.**~~ Fixed: explosion, tries, Cemetery, Grotto, increased studying, restoration, intellect, Completion, defeated, loses, eradication, environment, BEGINNING, shrine (was "shire").
- ~~**Forest's Capricor is decided at load.**~~ Fixed in phase 2: the check moved into game start.
- ~~**Clocks may survive a wizard's death.**~~ Fixed in phase 3: the game loop allows each named clock only once, and kill stops them all.
- **Dice house in the Town** (still open; to fix together with the professions vendors, the author's decision): `YesOrNot(pDados) && zone == "la_Ciudad" || zone == "el_Poblado"` in `exploreEV()` reads as `(chance && City) || Town`, so in the Town every exploration without loot goes to the dice house (if he has gold) and the dice chance never applies there.
- **The game freezes above level 190** (found 2026-11-12, still open; the dev bar has a scenario for it): in `enemyEV()` the guardian branch (`pGetGuardian`, 10%, level 191+) is empty, a megaboss v1 never wrote. Nothing starts the next event, so about 2% of events stop the game until the page is reloaded. To fix with the story (the guardians, or skip the branch).
- **Manifest paths** (found in phase 4): `manifest.json` pointed at `wizardidle/index.html`, which resolves to `/wizardidle/wizardidle/index.html`, so installing the app opened a broken page. Fixed with relative paths and 192/512 px icons.
