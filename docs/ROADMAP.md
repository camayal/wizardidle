# Roadmap

Work happens on `dev-repo`; `main` is the live site and only gets playable versions. Each stage starts when the one before it is done. Stages 1 and 2 (code clean-up, modern and fast) and the v2 rebuild are done and in the archive.

## Later: the cache version

- [ ] The cache version is the commit, so every deploy (even docs-only) makes installed players re-download all ~6 MB. Derive it from a hash of the cached files, or keep art and sound in a long-lived cache of their own.

## 3. Stats, playtests, then the story with the faith rebalance

Order decided by the author on 2026-11-12: the story depends on the faith rebalance (chapter X lock, the Last Escape scroll, belief levels) and on professions (the second trade unlocks at chapter III), and no balance number gets set without a playtest. Detailed plans: [plans/STATS.md](plans/STATS.md), [plans/for_implementation_faith.md](plans/for_implementation_faith.md), [plans/PROFESSIONS.md](plans/PROFESSIONS.md), [plans/ERASURE.md](plans/ERASURE.md) (the final battle's souls).

**3a. Stats and playtest tools**
- [x] Dev test bar (`src/dev/tests.js`, done 2026-11-12): a bar at the bottom of the screen while developing, with test scenarios (each prepares the wizard and forces the first event, then says what to check), quick actions (+1 level, gold, faith, speed x10, pause) and a command line. `DEV` in `src/config.js`; the deploy switches it off, so the live site never loads it.
- [x] A stats module (`src/stats.js`, done 2026-11-12): counters, totals, records and firsts under dotted names, per wizard and per world, one history line per level ([plans/STATS.md](plans/STATS.md)).
- [x] The curated stats scroll and the Records page (done 2026-11-12, `src/ui/statsPages.js`; chosen from mockups, options A + B).
- [x] Playtest tools (done 2026-11-12): simulation mode (`?sim=1`, `src/dev/sim.js`: virtual clock, seeded random, no sound or drawing), god bots (`src/dev/bots.js`), the runner `tools/playtest.py`, results in `docs/playtests/`. A level-200 run takes about 2 real seconds.
- [ ] Faith stats (`faithChange()`), then the faith playtests ([plans/for_implementation_faith.md](plans/for_implementation_faith.md)); professions and dice stats with their features; data-driven achievements.

**3b. The story, planned together with the faith rebalance**
- [ ] Faith rebalance: belief levels, a free revive, rescuers instead of the self-revive, the chapter X lock, the Last Escape scroll ([plans/for_implementation_faith.md](plans/for_implementation_faith.md)).
- [ ] Implement the story from the ideas backlog in `ideas.md` ("Finish the story": chapters III–XI and the final battle, plus the related story ideas), balanced with the playtest tools.

## 4. Professions, then the rest

- [ ] Professions ([plans/PROFESSIONS.md](plans/PROFESSIONS.md)); fix the Town dice house condition in the same change (see the v1 bugs below).
- [ ] The rest of the ideas backlog in `ideas.md`, one feature at a time. This is the long part.

## Bugs spotted in v1

Phases 1-3 deliberately preserved v1 behavior, so these were written down first and fixed in phase 4:

- **Dice house in the Town** (still open; to fix together with the professions vendors, the author's decision): `YesOrNot(pDados) && zone == "la_Ciudad" || zone == "el_Poblado"` in `exploreEV()` reads as `(chance && City) || Town`, so in the Town every exploration without loot goes to the dice house (if he has gold) and the dice chance never applies there.
- **Rare stall after a chapter** (found 2026-11-12, open): once in about fifteen 2-hour stress runs the game stayed paused right after the level 10 chapter, which opened while the test was opening and closing other scrolls (stats, kill...). Chapters pause the game until their scroll is closed; a race between closing another scroll and the chapter opening seems to leave it paused. To investigate with the dev bar (chapter scenario plus opening scrolls).
