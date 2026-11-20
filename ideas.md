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
- Map revamp: ground and aboveground maps, delta and beach with nagas, bridges, border scenes → [docs/MAPS.md](docs/MAPS.md)
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
- 2026-11-18 (dev): wired logro_libros, logro_runas, logro_tabernero, logro_tocado (100 god touches, config.touchedAchievement) and the missing eagle trigger (combat.js, cave sprites animalejo12/13); namesake compare now ignores case. Belief meter already built (belief.js), its dev note archived. Next: playtest + odds.py re-run.
- 2026-11-18 (dev): own music built as code, no WAVs (author's call): src/synth.js (text song format + Web Audio player), src/dev/music.js (Music mode: edit, play, Save to game), songs/ folder, serve.py /songs POST and /__list/songs. Musician drops <name>.song.txt in the review drop. Next: decide where songs play in the game (stingers, loops or both).
- 2026-11-18 (dev): wired the 8 seals with wider notched tails (artist option A, author approved); art note archived. Unused rare options b/c/d left in the review drop for clerk.
- 2026-11-18 (dev): ribbon icon losing rows when opened: placeScrollTabs now snaps the ribbon pixel size and positions to whole device pixels (src/ui/scrolls.js). Not seen in a browser; if it still happens, look at the ribbon art itself.
- 2026-11-18 (dev): bestiary ribbon icon hidden by the page (author, second report; pixel snapping did not fix it): ribbon z-index 1000 and the gap after the title is now measured in placeScrollTabs so the page starts below the open ribbon. Not seen in a browser.
- 2026-11-18 (dev): author found the bestiary ribbon bug is the slow page build (many sprites): ribbon now repaints before the page renders (setTimeout 0), both ribbon bodies stay loaded (toggle display), bestiary imgs decoding=async. Idea: build the bestiary in chunks or lazy-load sprites if it is still slow.
- 2026-11-18 (dev): wired the artist's C15 ribbons (18x29) and ten 9x9 icons; RIBBON_W 18, RIBBON_ICON 9, RIBBON_H_REST/OPEN 25/29, icon at x 3, y 7 (11 open) in src/ui/scrolls.js. Trial files C/C13 etc. left in the review drop for clerk.
- 2026-11-18 (dev): ribbons too large (author): RIBBON_SCALE 2 -> 1.5 (still snapped to whole device pixels); ribbons start RIBBON_TOP=3 ribbon px below the roll's top with scrollBackUp z-index 2 over ribbons z-index 1, so the roll covers their first rows. Not seen in a browser.
- 2026-11-18 (dev): ribbon test per author: ribbons now hang over the top of the roll (RIBBON_TOP 0, z-index 3 over the roll's 2), RIBBON_SCALE 1.8. The tucked-under-the-roll look is RIBBON_TOP 3 + ribbon z-index 1 if wanted back.
- 2026-11-18 (dev): ribbon test 2: RIBBON_SCALE 1.6, RIBBON_TOP -2 (starts above the roll, over it) because at 0 the start looked mid-roll.
- 2026-11-18 (dev): ribbon test 3: RIBBON_SCALE 1.5, RIBBON_TOP -6 (4 ribbon px higher still, author).
- 2026-11-18 (dev): ribbon test 4: RIBBON_SCALE 1.55, RIBBON_TOP -5.
- 2026-11-18 (dev): ribbon position and size approved by the author at scale 1.55, top -5. Note: ribbon pixel size is rounded to whole device pixels (placeScrollTabs), so scale changes jump in steps on some window sizes; kept because the author likes the current look.
- 2026-11-18 (dev): RIBBON_SCALE 1.51 (author).
- 2026-11-18 (dev): RIBBON_SCALE back to 1.5 (author).
- 2026-11-19 (dev): toolbar dead at start fixed: disableMainButtons no longer overwrites saved handlers on a second call; enable only restores saved ones.
- 2026-11-19 (dev): docs cleanup: SCROLLS.md archived whole (pilot done, no spread to other scrolls); STATS, AWAY and ROADMAP trimmed to what is still open; finished parts in docs/ARCHIVE.md.
- 2026-11-19 (dev): docs cleanup 2: SCENE_SPELLS boss effects and FAITH sections 1-2 archived; FAITH has a status paragraph. SCENES.md is untouched: no scene engine exists yet.
- 2026-11-19 (dev): step 1 of docs/MAPS.md done: the sea strip at the left edge of las_dunas1..5 is painted out (the artist's files, approved by the author). New bug noted in dev-notes: the tab never restarts after inactivity (empty console), needs a repro.
- 2026-11-19 (dev): installed the approved maps (img/ui/mapa.png = mapa_b4, img/ui/mapaboveground.png = mapaboveground_b); mapLayerFor in src/ui/scrolls.js picks the map (el_Heidan aboveground), used by the map button and the marker. Heidan map x/y kept as they were (they sit on the new clouds). Not run in a browser yet. Left in docs/MAPS.md: the beach zone la_playa, the portals as the wizard's path, bridge and border scenes, the walkable Dunes shore.
- 2026-11-19 (dev): map scroll ribbons built (MAP_PAGES in src/ui/scrolls.js, ui.scrollViews.map); Heidan spots moved onto the aboveground map (3 = NE portal, 4 = SE stairs, 5 = SE portal, altar = ruby pedestal). Not run in a browser. Ground map spots still to re-check against the new art.
- 2026-11-19 (dev): ground map spots checked on the new mapa.png; only the Dunes (and la_Mina5) sat in the sea and were moved to the beach sand. Others fine.
- 2026-11-19 (dev): fixed the game not starting: the map ribbons commit had deleted disableMainButtons, enableMainButtons and updateAchievements from src/ui/scrolls.js (restored).
- 2026-11-19 (dev): map scroll title shows just "Map" on layers the wizard is not on (long names overlapped).
- 2026-11-19 (dev): installed the approved underground map (option F2 from the review drop) as img/ui/mapaunderground.png. Bookmark icons (cloud, mountain, cave) still being drawn by the artist.
- 2026-11-19 (dev): installed map bookmark icon set 2 (cloud, mountain, cave) into img/ui/ribbon/icon_map_*.png.
- 2026-11-19 (dev): freeze after hibernation: the save beat in src/state.js now reloads when it wakes late (>= away.minSeconds) without a visibility event. Root cause of the empty clock list (all clocks gone, nothing queued) not found; if it still freezes, check the browser console for the [away] warning and red errors. Added loop.loopInfo().
- 2026-11-19 (dev): the freeze after a long inactive tab also happens on main on the author's phone (so not only laptop hibernation). The late-wake reload (1a2e2f9) is on dev-repo only; verify on the phone once released. Root cause (all clocks gone) still open.
- 2026-11-19 (dev): freeze root cause found: src/game.js start() only called nextEvent when settleAway returned "none", so "drift" (away 5+ min, not fallen) never started the master clock. Fixed; also an events.js watchdog (startWatchdog, loop.idle) restarts the picker after 20 s with no clock, unless fallen/paused.
- 2026-11-19 (dev): installed the approved ground map with the reworked Prairie bridge (artist option C4: volcano spring joins the river in a Y, S-curved river, Prairie extended into the south gulf) as img/ui/mapa.png. The Prairie bridge is now near map pixel (125,145) and the river runs a bit further south: map spots by the old channel and on the south Prairie coast still to re-check (docs/MAPS.md question B open).
- 2026-11-19 (dev): checked every existing map spot (stage x,y in src/data/zones.js) against the new ground map C4: all on land, none moved. Spots for the future scenes, from the artist, as x,y fractions of the 250 px map: Prairie bridge 0.5,0.58 (125,145); Swamp bridge 0.724,0.2 (181,50); beach la_playa about 0.916,0.32 (229,80), author still to choose between the north-east beach and the south-west palm sand. No place data exists for these yet, so nothing to wire until the scenes are built.
- 2026-11-19 (dev): author decided: la_playa = north-east beach; the south-west palm sand is a second beach, only next to the lake and only reachable from the surrounding zones (recorded in docs/MAPS.md). Needs its own zone/destinations design later.
- 2026-11-19 (dev): installed the approved aboveground map rework (artist option C2: puffy cloud edges, 14 decorative clouds) as img/ui/mapaboveground.png. Portals and stair arrivals unchanged, so the Heidan spots stay valid.
- 2026-11-19 (dev): author corrected: the south-west palm sand is the Dunes (las_Dunas), not a separate beach zone. MAPS.md updated.
- 2026-11-19 (dev): installed the underground map rework (artist option G2, warm brown rock) as img/ui/mapaunderground.png as a base to keep working on. Author wants the ground-map cave and mine entrances to match it exactly (with the artist).
- 2026-11-19 (dev): installed underground option G2b (G2 with the three mine ends aligned to the ground entrances, plus daylight at the six entrances) as img/ui/mapaunderground.png, base for more cave-like work with the artist.
- 2026-11-19 (dev): installed underground option H2 (more cave-like caves: side nooks, pillars, sheen) as img/ui/mapaunderground.png. Entrances unchanged; mine and volcano unchanged.
- 2026-11-19 (dev): installed the ground map with the south road, second bridge (centre 166,162) and fisher's pier (artist option P1b; pier tip 150,171, centre 150,168) as img/ui/mapa.png. The Prairie bridge (125,145) crosses only the volcano spring; the south is also reachable over the Dunes' sand land bridge. The pier is a new place still to add. Travel network (generated edges + water test from the art) proposed, awaiting the author's go.
- 2026-11-19 (dev): wrote docs/TRAVEL.md: the travel graph plan (nodes = scenes plus waypoints, generated edges with soft terrain costs, Dijkstra, travelCost/route interface, built to serve the dynamic scenes; rivers cost, rocks walkable). Not built; waiting for the author's go.
- 2026-11-19 (dev): built the travel graph (TRAVEL.md steps 1-3 and 5): tools/travel_graph.py, src/data/travelGraph.js, src/travelGraph.js, config.travel. Derived destinations match the old strings about 70%; the game still uses the old ones, switch waits for the author. Overlay as a PNG only.
