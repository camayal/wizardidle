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

### 2026-11-17: Belief dreams, written, decided and built
- The author's note "some dreams can increase believer score", with the wish that dreams never repeat. The story side wrote a pool of dreams in docs/ideas/dreams.md: light dreams, callings for doubters, nightmares, fall dreams, general chapter dreams and echo dreams, plus six story-linked chapter dreams kept for later. The author decided (docs/SLEEP.md, Belief dreams): belief dreams give +1 Devout/Believer, +2 Doubter, +3 Atheist; nightmares take 1 only from a Believer or Devout, never below the Believer line; every weight in config for playtests; a shuffle bag per pool and per wizard, so no dream returns before its whole pool has played; no wake line. Built the same day: src/dream.js (shuffle bags saved per wizard in state, the dream-or-nightmare split by belief level, belief effect run in simulation too with the real RNG), the full pool in src/data/dreams.js, every number in config.belief and config.balance. Fall dreams by healer or alone (the rescuer pool waits for rescuers). Echo dreams join after an erasure (world.erasures does not exist yet).

### 2026-11-17: The Cemetery becomes tombs
- The author approved the artist's five tombs (A-E), their cracked versions, a 3 x 5 carved pixel font and a small parchment note (img/ui/cemetery/). The Cemetery page of the kill scroll now shows one tomb per dead wizard, newest first, each always the same design (picked from his name and birth), with his name and age carved by code (8 characters a row, long names cut, ages as 1.2K / 3.4M). A tap opens the note with level, age, victories, falls and dates. Records with erased (set only by the final battle, not built yet) get the cracked tomb, the name upside down and crossed out. Dev panel: Cemetery, add or remove ten sample tombs. Checked by a headless screenshot of the page with the samples and a note open, and a headless playtest (2 seeds to level 20, no errors).

### 2026-11-17: Scene spells wipe themselves, faster arrows
- Two author notes. A scene spell (rain, poison cloud…) sometimes stayed on screen forever: boss and hydra scene spells were drawn by the enemy's animation clock, which other animations (a hit, a death, an entrance) replace, and then nothing cleared the layer. Scene spells now run on their own clock, and a clock can carry a clean-up that runs however it ends (finished, replaced, stopped, or every clock stopped when the wizard dies). Arrows fly 60 px every 50 ms (was 36), 3 frames instead of 4. The flicker note was dropped (the author no longer sees it). Checked by a headless playtest (3 seeds to level 40, no errors), which skips animations, so neither change was watched in a browser.
