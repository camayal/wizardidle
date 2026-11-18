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

### 2026-11-17: Bestiary headings, the enemy leaves, boss entrances
- The bestiary's Bosses heading waits for the first boss met, Secrets for the first hydra.
- When the wizard falls the enemy leaves its own way in, backwards (playLeave in src/ui/entrances.js), instead of vanishing at once. Ten bosses that walked in now arrive by what they are: two new kinds, slam (a heavy leap, squash and shake) and slither. The dev tools' Enemy: arrival has "arrive" and "leave" for every sprite. A 2-seed simulation to level 40 (185 falls) ran clean; the look still needs the author's eye.
- Mage boss portals (Doria, Midas, Rainbow) grown to 90% of their art (70% was too small; King Skeleton's arch stays full size). The killing blow now takes the wizard's last HP when it lands (enemyAttack in src/combat.js freezes the game until then), so he no longer falls before a boss's scene spell reaches him; the author checked both in the game.
- The rest message no longer counts the recovered HP twice (wakeUp in src/events.js), so "totally renewed" shows only after a full recovery.
- Chapter keys fixed in src/story.js (IX at 160, X at 190, the Heidan event at 199, XI at 200; Chapter IV now shows at 90). Chapters with text queue up (chapterRead in src/story.js, called when the scroll closes), so two close together no longer overwrite each other; dev test "Two chapters at once (9 to 30)".
- tools/to_ogg.py: whole mp3/wav/flac files or folders to game .ogg (mono, game names, skips existing unless --force); cut_sounds.py now shares its writer. Ticks the author's Oggify note.
- Hydra entrance sounds: the author's inf + burst pairs fused per hydra (burst on the reveal frame), cut and volumed in the Sound mode, wired in playHydraEnter (src/ui/entrances.js); getHydra plays the generic `hidra` only on a regrow.

### 2026-11-17: Prologue after the scene, a wizard of spells only
- Two dev notes. The Prologue opened before the scene was drawn: the first run levels the wizard from 0 to 1 before the scene and the wizard are on screen. A chapter scroll now waits for the scene's background and the wizard's sprite (whenSceneReady in src/ui/render.js) and pauses the game at once, so nothing starts behind it.
- "It is a wizard after all, only spells": the three Physical staff hits left his spell tiers (tier 0 keeps five spells, tier 1 two); bosses keep them in their bossSpell lists, and the staff still breaks pots and crates. The cast animation's staff slash went with them. A 2-seed simulation to level 40 ran clean.

### 2026-11-17: Time away, numbers and code
- Built docs/AWAY.md: lastSeen in the save, settlement on load (src/away.js, formulas in src/awayMath.js, numbers in config.away, texts in src/data/awayTexts.js as placeholders: soft-dead line candidate 1, poem draft A). Estimates table added to AWAY.md. Left for later: the hidden-page slow motion and the slowed sound (thinker advises only a sound fade cue; not built, needs the audio module to track the music); reloading a soft-dead wizard still gives the old weak self-revive (the "left again without touching" answer is pending); the protected-chapter rule (no absence death there) is not applied yet; the poem is on a scroll, not over the dark scene as the thinker briefed.
