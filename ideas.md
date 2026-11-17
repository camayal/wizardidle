# Ideas & development journal

The index of Wizard Idle v2: where the project stands, one line per idea, and the latest journal. Each idea's text lives in its plan or topic file: open only the one you are working on.

- Release notes → [CHANGELOG.md](CHANGELOG.md) · the route ahead → [docs/ROADMAP.md](docs/ROADMAP.md) · file map and rules → [docs/MAP.md](docs/MAP.md)
- Settled choices and why → [docs/DECISIONS.md](docs/DECISIONS.md) (add rows at the end; no need to read it)
- Finished things go to [docs/ARCHIVE.md](docs/ARCHIVE.md) with `cat >>`; never read it.
- The author's old notes and art sources (2014–2018) live outside the repo, in the sibling folder `wizardidle-old-ideas/`.

## Where we are

- **Branch:** `dev-repo` (v2 work). `main` is the live site, so merge only when playable.
- **Released:** 2.1.0 live since 2026-11-12 (stages 1 and 2: cleanup and speed). **Now:** stage 3a; the dev test bar, the stats module and the playtest tools are built, with a baseline. **Next:** the faith stats and playtests ([FAITH.md](docs/FAITH.md)); then the story with the faith rebalance.
- **Live:** [camayal.info/wizardidle](https://camayal.info/wizardidle/) serves 2.1.0 from `main`; `/legacy/` serves the frozen `v1.0.0` tag (not linked anywhere).

## Inboxes (notes from the dev tools, one per role)

[dev](docs/dev-notes.md) · [art](docs/art-notes.md) · [sound](docs/sound-notes.md) · [thinker](docs/thinker-notes.md) · [author's play-test list](docs/AUTHOR_NOTES.md). Each role reads only its own; a note for another role is moved there, and a handled note is cut to the archive.

## Ideas (one line each; the text is in the linked file)

New idea: one line here, its text in the matching file. Nothing here is a commitment.

**With a plan**
- Faith rebalance, belief levels, rescuers → [docs/FAITH.md](docs/FAITH.md)
- Professions: reagents, items, vendors → [docs/PROFESSIONS.md](docs/PROFESSIONS.md)
- Stats for almost everything, playtest tools → [docs/STATS.md](docs/STATS.md)
- Souls of erased wizards in the final battle → [docs/ERASURE.md](docs/ERASURE.md)
- Scene spells for bosses and the wizard → [docs/SCENE_SPELLS.md](docs/SCENE_SPELLS.md)
- Soft sleep, dreams and nightmares → [docs/SLEEP.md](docs/SLEEP.md)
- Dynamic scenes, map of places, exits → [docs/SCENES.md](docs/SCENES.md)
- The story script, every scroll → [docs/STORY.md](docs/STORY.md) (review page in `artefacts_tests/`)

**Story** → [docs/ideas/story.md](docs/ideas/story.md)
- Finish chapters III–XI and the final battle (the 2018 arc, the "in sin" switch)
- King Midas hits ×4 · wizards from the past help · story notes kept in `src/story.js`
- Death management: a rare true death · the fallen and dead sprites (skull as a warning)
- Story art: the hooded healer, his true form, the shrine · bosses return except Midas, the Tower refills, the staff's random name

**World** → [docs/ideas/world.md](docs/ideas/world.md)
- Map revamp: fog, inner maps, travel favour · dynamic scenes from the author's layers · discoveries in the scene

**Creatures** → [docs/ideas/creatures.md](docs/ideas/creatures.md)
- The old creature list · new races and statues with art ready (nagas, salamanders, yaktaurs…)

**Other** → [docs/ideas/extras.md](docs/ideas/extras.md)
- The 13 placeholder achievements · real offline mode · background notifications · levelling pace (XP per enemy)
- Unused sprites (card game, town, shops, boss crowns) · pixel-art UI tiles · ideas from the v1 code comments · what's already built

---

## Journal

Newest first; keep the last three, cut older ones to the archive.

### 2026-11-17: Scene spells wipe themselves, faster arrows
- Two author notes. A scene spell (rain, poison cloud…) sometimes stayed on screen forever: boss and hydra scene spells were drawn by the enemy's animation clock, which other animations (a hit, a death, an entrance) replace, and then nothing cleared the layer. Scene spells now run on their own clock, and a clock can carry a clean-up that runs however it ends (finished, replaced, stopped, or every clock stopped when the wizard dies). Arrows fly 60 px every 50 ms (was 36), 3 frames instead of 4. The flicker note was dropped (the author no longer sees it). Checked by a headless playtest (3 seeds to level 40, no errors), which skips animations, so neither change was watched in a browser.

### 2026-11-17: Mages fade in or step out of a portal, fewer dreams, dev pickers
- Two author notes from the dev inbox. Random dreams drop from 15% to 5% of rests (story dreams unchanged). Enemy mages flicker or fade in at random; rare mages (Evoker, Sacred wizardess) come through one of the artist's three portals (a purple, b blue, c red, at random); of the bosses only the mages do: Doria blue, King Midas golden, Rainbow multicolour, bigger strips (all six strips drawn by the artist and wired in; a code stand-in plays if a file is missing). Boss portals at 70% of the strip so the whole boss shows, and the boss grows from the portal's centre while it turns. The review drop moved outside the project (wizardidle-review/, still review/ in the dev tools) and tools/land.py lands work branches on dev-repo after every commit (hooks in tools/hooks). The dev panel's Wizard and Fight now buttons became pickers (wizard, bosses, hydras, enemies by sprite or random by attack, rare, arrival, each with a forced arrival); scenarios are one list. Checked by a headless playtest (3 seeds to level 40, no errors) and a headless page load (panel builds, no console errors); the entrances were not watched in a browser.

### 2026-11-17: Chargers get home first, the dream follows the scene
- The author's three dev notes. Chargers (capricorns, taurens) took about 2 s to paw, dash, ram and trot back, but a battle step is 1.5 s, so the wizard cast while they were still running home; now a move longer than a step holds the game's clocks for its tail and the wizard casts about 0.15 s after the enemy is back (shorter moves unchanged). The sleep dark with its dream, and the boss scene-spell layer, now follow the scene when a scroll opens or closes. The hydra explanation under the bestiary's Secrets is gone. Checked by a headless playtest (3 seeds to level 40, no errors), which skips animations, so the charge and the dream were not watched in a browser.
