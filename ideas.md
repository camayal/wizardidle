# Ideas & development journal

The index of Wizard Idle v2: where the project stands, one line per idea, and the latest journal. Each idea's text lives in its plan or topic file: open only the one you are working on.

- Release notes → [CHANGELOG.md](CHANGELOG.md) · the route ahead → [docs/ROADMAP.md](docs/ROADMAP.md) · file map and rules → [docs/MAP.md](docs/MAP.md)
- Settled choices and why → [docs/DECISIONS.md](docs/DECISIONS.md) (add rows at the end; no need to read it)
- Finished things go to [docs/ARCHIVE.md](docs/ARCHIVE.md) with `cat >>`; never read it.
- The author's old notes and art sources (2014–2018) live outside the repo, in the sibling folder `wizardidle-old-ideas/`.

## Where we are

- **Branch:** `dev-repo` (v2 work). `main` is the live site, so merge only when playable.
- **Released:** 2.2.0 live since 2026-11-18 (animations, arrivals, boss attacks, belief, bestiary, cemetery, XP bar; 2.1.0 on 2026-11-12: cleanup and speed). **Now:** stage 3a; the dev test bar, the stats module and the playtest tools are built, with a baseline. **Next:** the faith stats and playtests ([FAITH.md](docs/FAITH.md)); then the story with the faith rebalance.
- **Live:** [camayal.info/wizardidle](https://camayal.info/wizardidle/) serves 2.2.0 from `main`; `/legacy/` serves the frozen `v1.0.0` tag (not linked anywhere).

## Inboxes (notes from the dev tools, one per role)

[dev](docs/dev-notes.md) · [art](docs/art-notes.md) · [sound](docs/sound-notes.md) · [thinker](docs/thinker-notes.md). Each role reads only its own; a note for another role is moved there, and a handled note is cut to the archive.

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
- Stats for most of the game (the author's decision, docs/DECISIONS.md): every stat now also counts per world, so achievements (the player's, decided today) outlive permadeath. New counters for wins, damage, falls by enemy, zone and level, time away (soft dead, permadeath, saved by the touch), the dice house, dreams seen, chapters, the kill button and the cemetery; the list is in docs/STATS.md. Achievement ideas wait in the thinker's inbox. A 4-run simulation to level 40 ran clean.
- The elementals arrive by their element (the author's dev note): a new "element" arrival in src/ui/entrances.js under the artist's strips, the author's picks (img/effects/fx/fx_elemental_<fire|thunder|frost>_enter: fire A flame pillar, thunder A single strike, frost B crystal crown; 10 frames of 48 x 48, body from the reveal frame). A first version drawn by code was dropped (frost not nice enough). They leave by fading out while drifting towards the wizard (the author). The entrance plays its school's sound (Fire, Thunder, Frost, like the spells). Checked frame by frame in a headless browser.
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
- Wired the artist's ground effects (fx_ground_a-c, fx_ground_boss_a-c in img/effects/fx; the d pair was dropped as not nice enough) into the "rise" entrance and leave (src/ui/entrances.js): a random one of three per arrival, 1 art px per sprite px, ground row on the feet, sprite raised by the effect's own frames (a/b show at frame 3, up at 7; c at 1 and 5). Boss set is picked by sprite width, so Herbus and kkck leaving use it; kkck still arrives with his own dirt mound. Hydra leave strips (anim_hydra_<effect>_leave) wired in leaveHydra: the hydra sinks behind the ground line, hidden by frame 9. Not seen in a live browser by me; only a headless run to level 20 for load errors.
- 2026-11-18 (dev): time away finished: soft dead is saved (state.meta.softDead, awayHours) so a reload or a quick second visit keeps him down and the hours add up; protected chapters (config.away.protectedLevels) never fall or die from absence. The slowed return sound is not wired: it needs the musician's file and a rule in media.js.
- 2026-11-18 (dev): removed the dev panel's freeze on a hidden page (src/dev/tests.js); dev sessions run on like the live game.
- 2026-11-18 (dev): away poem is a shuffle bag of the thinker's 8 poems (world.poemBag), shown by poemInDark in src/ui/render.js; scroll path removed. Still open: the slowed return sound (musician).
- 2026-11-18 (dev): Inventory = second tab of the stats scroll (statsPages.js inventoryPageHtml, state.artefacts saved when an artefact is found); belief meter bar in the Faith section; away poems added to the Texts mode. The staff has no icon yet (img/objects/stuff.png is a pile, not a staff): ask the artist for a staff icon.
- 2026-11-18 (dev): the belief meter lives in a Faith scroll on the prayer button (btn4, next to the map), not in Stats; faith lines moved there.
- 2026-11-18 (dev): the dev panel's own freeze is gone and src/away.js watchHidden now runs in dev too: hidden = frozen, long absence = reload and settle, same as live.
- 2026-11-18 (dev): the artist's five staff icons (img/objects/staff_<design>.png) are on the Inventory page; statsPages.js maps each tier to its design.
- 2026-11-18 (dev): inventory is a grid of square slots (slotHtml in src/ui/statsPages.js, inline styles, slot = 3.5 em); not run in a browser yet. Asked the thinker about themed scroll backgrounds (cemetery grass, wooden crates), in thinker-notes.
- 2026-11-18 (dev): wired the approved move sounds (first SOUNDS.md table): playSoundAt in audio.js, MOVE_SOUND by family in enemyMoves.js, attackSounds in data/bossAttacks.js. Not tried by ear yet. Left: the second table (Midas, Rojo, Fenix, Goro, Skeleton, Rainbow... their files are not cut yet) and the 'still to choose' list.
- 2026-11-18 (dev): src/dev/notes.js noteText: in the 'sound' mode the live details always go in the note (they were only kept after Capture, so the author's approvals saved as '-'). Six empty entries dropped from docs/sound-notes.md; the author must re-save the approvals. Musician has nothing to cut yet.
- 2026-11-18 (dev): wired the second batch of approved sounds (25 boss moves + Golem slam): tools/sound_cuts.txt now takes speed/extend/fade out; attackSounds + mutedLanding in data/bossAttacks.js; negative start holds the boss animation back (lead in ui/bossAttacks.js); spell() got a silent flag. Conflicts (Rojo slam/punch, Skeleton curse, Arcangel lightning) kept the SOUNDS.md files. Not run in a browser or heard by me.
- 2026-11-18 (dev): tools/synth_demo.html: one tune played by a plain Web Audio synth (A) and by a WebAudioFont soundfont (B, jsdelivr), so the author can hear both before choosing how to make our own music. Asked the musician: feasible; author leans plain Web Audio first. Not heard or run by me.
- 2026-11-18 (dev): wired the faith scroll redesign: img/ui/faith/ (media.js rule), #scrollText[data-page] set in scrollOpen for per-scroll CSS, beliefMeter in statsPages.js is layered (conic mask for the lit glass), updateFaith skips identical html so the candle keeps animating. Not seen in a browser by me.
- 2026-11-18 (dev): the author heard both synth demos and chose A, the plain Web Audio synth (no soundfont, no library). Next, if asked: a note-list bench in tools/ and a render to WAV for snd/. Still open: stingers, loops or both.
- 2026-11-18 faith scroll: level name in title font, spaced caps, stars, per-level colour, more space before stats (docs/SCROLLS.md has no note on the label; art for it would be a later sprite option).
- 2026-11-18 ribbon bookmarks wired for the kill and stats scrolls (RIBBON_SIDE in src/ui/scrolls.js, default left because the close button is top right); achievements (this run / historic) and map layer ribbons wait on decisions in docs/dev-notes.md.

- 2026-11-18 (dev): achievements ribbons wired: cemetery entries carry an `achievements` map (menu.js realKill, away.js dieAway); tabPages() in src/ui/scrolls.js shows run/all ribbons only when world.cemetery holds earned achievements. Old/sample cemetery entries simply have none.
- 2026-11-18 (dev): achievements list spacing: .achRow cells in index.html (padding 0.7em, wider icon gap); tweak there if still tight
- 2026-11-18 (dev): logro_capricorreturns added (combat.js: cemetery has logro_ultimocapricor); art requested in docs/art-notes.md (icon + static frame idea). Faith meter bug: faithBtn filled before display:block so clientWidth was 0.
- 2026-11-18 (dev): rarity tiers in src/data/rarity.js (set from the achievement-rates playtest + judgment); rule: re-run the playtest when adding an achievement (MAP.md). Next: artist makes one seal colour per tier (frame C, icon B for capricorreturns).
- 2026-11-18 (dev): achievement layers (logro_frame, picture-only logro_*, logro_seal_<tier>) approved and wired in img/ui/achievements; no_logro still a full icon (could become frame grey + lock).
- 2026-11-18 (dev): tools/odds.py (bootstrap of playtest runs + random quitting, counters projected); logro.set stores first.achievement.<name>. Found: libros, runas, tabernero, tocado have no trigger in code yet (no logro.set call). Never seen by bots: tocado, capricorreturns, eagle, namesake. Leaving numbers (25% in hour 1, mean 15 h) are guesses.
- 2026-11-18 (dev): rarity tiers re-set from tools/odds.py output; hydramystery and never-seen ones kept by judgment.
