# Ideas & development journal

The index of Wizard Idle v2: where the project stands, one line per idea, and the latest journal. Each idea's text lives in its plan or topic file: open only the one you are working on.

- Release notes → [CHANGELOG.md](CHANGELOG.md) · the route ahead → [docs/ROADMAP.md](docs/ROADMAP.md) · file map and rules → [docs/MAP.md](docs/MAP.md)
- Settled choices and why → [docs/plans/DECISIONS.md](docs/plans/DECISIONS.md) (add rows at the end; no need to read it)
- Finished things go to [docs/ARCHIVE.md](docs/ARCHIVE.md) with `cat >>`; never read it.
- The author's old notes and art sources (2014–2018) live outside the repo, in the sibling folder `wizardidle-old-ideas/`.

## Where we are

- **Branch:** `dev-repo` (v2 work). `main` is the live site, so merge only when playable.
- **Released:** 2.2.0 live since 2026-11-18 (animations, arrivals, boss attacks, belief, bestiary, cemetery, XP bar; 2.1.0 on 2026-11-12: cleanup and speed). **Now:** stage 3a; the dev test bar, the stats module and the playtest tools are built, with a baseline. **Next:** the faith stats and playtests ([FAITH.md](docs/plans/FAITH.md)); then the story with the faith rebalance.
- **Live:** [camayal.info/wizardidle](https://camayal.info/wizardidle/) serves 2.2.0 from `main`; `/legacy/` serves the frozen `v1.0.0` tag (not linked anywhere).

## Inboxes (notes from the dev tools, one per role)

[dev](docs/dev-notes.md) · [art](docs/art-notes.md) · [sound](docs/sound-notes.md) · [thinker](docs/thinker-notes.md). Each role reads only its own; a note for another role is moved there, and a handled note is cut to the archive.

## Ideas (one line each; the text is in the linked file)

New idea: one line here, its text in the matching file. Nothing here is a commitment.

**With a plan**
- Map revamp: ground and aboveground maps, delta and beach with nagas, bridges, border scenes → [docs/plans/MAPS.md](docs/plans/MAPS.md)
- Faith rebalance, belief levels, rescuers → [docs/plans/FAITH.md](docs/plans/FAITH.md)
- Professions: reagents, items, vendors → [docs/plans/PROFESSIONS.md](docs/plans/PROFESSIONS.md)
- Stats for almost everything, playtest tools → [docs/plans/STATS.md](docs/plans/STATS.md)
- Souls of erased wizards in the final battle → [docs/plans/ERASURE.md](docs/plans/ERASURE.md)
- Scene spells for bosses and the wizard → [docs/plans/SCENE_SPELLS.md](docs/plans/SCENE_SPELLS.md)
- Soft sleep, dreams and nightmares → [docs/plans/SLEEP.md](docs/plans/SLEEP.md)
- Dynamic scenes, map of places, exits → [docs/plans/SCENES.md](docs/plans/SCENES.md)
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

### 2026-11-24: Fights on crossings
- A crossing (travel.js crossing/planFight) may stop for a plain fight: render.walkAcross steps carry fightSpot and fight(resume); crossFight stops the event clock, mirrors pjCanvas/npcCanvas/spellCanvas with CSS (render.setFacing, ui.facing; bossAttacks shake keeps the mirror), combat.startCrossingFight runs getEnemy(plain) and defeatEnemy calls run.crossFightDone instead of nextEvent; a fall calls run.crossFightAbort (shows the destination stage). Spot 0 going right, 160 (mirror image) going left, so nothing jumps. config.balance.pFightInCrossing (0.1); stat travel.crossingFights. Simulation: 20-30 crossing fights per 40-level run, no errors. Not seen in a browser: check the mirrored look (boss-free), the god's touch areas swapped, the scene spells (full-scene ones are not mirrored on purpose). Dev panel > Connectors has a 'Walk it with a fight' button (travel.withFight) to test it at once. Idea: mirror the full-scene spell too, and tune the chance after playtests.

### 2026-11-24: First border scene
- border_gruta_duenon wired: a border is a static scene joining two regions, walkable both ways, no events yet (vocabulary in docs/MAP.md). `borderScenes` in data/connectors.js, `crossing` in travel.js picks the direction by the zone on its left; art in img/places/borders (media.js rule border_). Point linked to la_Gruta2/3 and el_Duenon1/2 by hand edits of travelOverrides, graph regenerated. Not tested in a browser. Idea: when more borders arrive, mirrored art or enemies inside could be a design call.

### 2026-11-20: Scene art wired, front overlays
- The artist's review queue is done: two files replace game art (la_pradera2, ground map stone bridge), the rest is copied into img/places/future, connectors and overlays with media.js rules. A front layer (overlayCanvas, src/data/overlays.js) draws over the wizard for mina_cueva1 and mina_cueva_2; untested in a browser (no way to run it here). Later the same day: the future scenes became numbered stages in zones.js and the game travels by the author's manual links only (src/travelGraph.js moves/destinations, old strings as the fallback). Open: la_playa1-6 need a zone (enemies, boss) before they can be stages; connector halves (bridges, mouths, stairs) are art in img/places/connectors, not yet shown on a trip; floor shaft in ladder mine side vs the walk line.

### 2026-11-17: Bestiary headings, the enemy leaves, boss entrances
- Stats for most of the game (the author's decision, docs/plans/DECISIONS.md): every stat now also counts per world, so achievements (the player's, decided today) outlive permadeath. New counters for wins, damage, falls by enemy, zone and level, time away (soft dead, permadeath, saved by the touch), the dice house, dreams seen, chapters, the kill button and the cemetery; the list is in docs/plans/STATS.md. Achievement ideas wait in the thinker's inbox. A 4-run simulation to level 40 ran clean.
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
- Built docs/plans/AWAY.md: lastSeen in the save, settlement on load (src/away.js, formulas in src/awayMath.js, numbers in config.away, texts in src/data/awayTexts.js as placeholders: soft-dead line candidate 1, poem draft A). Estimates table added to AWAY.md. Left for later: the hidden-page slow motion and the slowed sound (thinker advises only a sound fade cue; not built, needs the audio module to track the music); reloading a soft-dead wizard still gives the old weak self-revive (the "left again without touching" answer is pending); the protected-chapter rule (no absence death there) is not applied yet; the poem is on a scroll, not over the dark scene as the thinker briefed.
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
- 2026-11-19 (dev): step 1 of docs/plans/MAPS.md done: the sea strip at the left edge of las_dunas1..5 is painted out (the artist's files, approved by the author). New bug noted in dev-notes: the tab never restarts after inactivity (empty console), needs a repro.
- 2026-11-19 (dev): installed the approved maps (img/ui/mapa.png = mapa_b4, img/ui/mapaboveground.png = mapaboveground_b); mapLayerFor in src/ui/scrolls.js picks the map (el_Heidan aboveground), used by the map button and the marker. Heidan map x/y kept as they were (they sit on the new clouds). Not run in a browser yet. Left in docs/plans/MAPS.md: the beach zone la_playa, the portals as the wizard's path, bridge and border scenes, the walkable Dunes shore.
- 2026-11-19 (dev): map scroll ribbons built (MAP_PAGES in src/ui/scrolls.js, ui.scrollViews.map); Heidan spots moved onto the aboveground map (3 = NE portal, 4 = SE stairs, 5 = SE portal, altar = ruby pedestal). Not run in a browser. Ground map spots still to re-check against the new art.
- 2026-11-19 (dev): ground map spots checked on the new mapa.png; only the Dunes (and la_Mina5) sat in the sea and were moved to the beach sand. Others fine.
- 2026-11-19 (dev): fixed the game not starting: the map ribbons commit had deleted disableMainButtons, enableMainButtons and updateAchievements from src/ui/scrolls.js (restored).
- 2026-11-19 (dev): map scroll title shows just "Map" on layers the wizard is not on (long names overlapped).
- 2026-11-19 (dev): installed the approved underground map (option F2 from the review drop) as img/ui/mapaunderground.png. Bookmark icons (cloud, mountain, cave) still being drawn by the artist.
- 2026-11-19 (dev): installed map bookmark icon set 2 (cloud, mountain, cave) into img/ui/ribbon/icon_map_*.png.
- 2026-11-19 (dev): freeze after hibernation: the save beat in src/state.js now reloads when it wakes late (>= away.minSeconds) without a visibility event. Root cause of the empty clock list (all clocks gone, nothing queued) not found; if it still freezes, check the browser console for the [away] warning and red errors. Added loop.loopInfo().
- 2026-11-19 (dev): the freeze after a long inactive tab also happens on main on the author's phone (so not only laptop hibernation). The late-wake reload (1a2e2f9) is on dev-repo only; verify on the phone once released. Root cause (all clocks gone) still open.
- 2026-11-19 (dev): freeze root cause found: src/game.js start() only called nextEvent when settleAway returned "none", so "drift" (away 5+ min, not fallen) never started the master clock. Fixed; also an events.js watchdog (startWatchdog, loop.idle) restarts the picker after 20 s with no clock, unless fallen/paused.
- 2026-11-19 (dev): installed the approved ground map with the reworked Prairie bridge (artist option C4: volcano spring joins the river in a Y, S-curved river, Prairie extended into the south gulf) as img/ui/mapa.png. The Prairie bridge is now near map pixel (125,145) and the river runs a bit further south: map spots by the old channel and on the south Prairie coast still to re-check (docs/plans/MAPS.md question B open).
- 2026-11-19 (dev): checked every existing map spot (stage x,y in src/data/zones.js) against the new ground map C4: all on land, none moved. Spots for the future scenes, from the artist, as x,y fractions of the 250 px map: Prairie bridge 0.5,0.58 (125,145); Swamp bridge 0.724,0.2 (181,50); beach la_playa about 0.916,0.32 (229,80), author still to choose between the north-east beach and the south-west palm sand. No place data exists for these yet, so nothing to wire until the scenes are built.
- 2026-11-19 (dev): author decided: la_playa = north-east beach; the south-west palm sand is a second beach, only next to the lake and only reachable from the surrounding zones (recorded in docs/plans/MAPS.md). Needs its own zone/destinations design later.
- 2026-11-19 (dev): installed the approved aboveground map rework (artist option C2: puffy cloud edges, 14 decorative clouds) as img/ui/mapaboveground.png. Portals and stair arrivals unchanged, so the Heidan spots stay valid.
- 2026-11-19 (dev): author corrected: the south-west palm sand is the Dunes (las_Dunas), not a separate beach zone. MAPS.md updated.
- 2026-11-19 (dev): installed the underground map rework (artist option G2, warm brown rock) as img/ui/mapaunderground.png as a base to keep working on. Author wants the ground-map cave and mine entrances to match it exactly (with the artist).
- 2026-11-19 (dev): installed underground option G2b (G2 with the three mine ends aligned to the ground entrances, plus daylight at the six entrances) as img/ui/mapaunderground.png, base for more cave-like work with the artist.
- 2026-11-19 (dev): installed underground option H2 (more cave-like caves: side nooks, pillars, sheen) as img/ui/mapaunderground.png. Entrances unchanged; mine and volcano unchanged.
- 2026-11-19 (dev): installed the ground map with the south road, second bridge (centre 166,162) and fisher's pier (artist option P1b; pier tip 150,171, centre 150,168) as img/ui/mapa.png. The Prairie bridge (125,145) crosses only the volcano spring; the south is also reachable over the Dunes' sand land bridge. The pier is a new place still to add. Travel network (generated edges + water test from the art) proposed, awaiting the author's go.
- 2026-11-19 (dev): wrote docs/TRAVEL.md: the travel graph plan (nodes = scenes plus waypoints, generated edges with soft terrain costs, Dijkstra, travelCost/route interface, built to serve the dynamic scenes; rivers cost, rocks walkable). Not built; waiting for the author's go.
- 2026-11-19 (dev): built the travel graph (TRAVEL.md steps 1-3 and 5): tools/travel_graph.py, src/data/travelGraph.js, src/travelGraph.js, config.travel. Derived destinations match the old strings about 70%; the game still uses the old ones, switch waits for the author. Overlay as a PNG only.
- 2026-11-19 (dev): built the travel overlay as a dev mode (Modes > Travel, src/dev/travel.js): map per layer, click a scene for its cheapest paths coloured move/destination/too far. Untested in a browser (no node here); step 6 still waits for the author.
- 2026-11-19 (dev): Travel mode curation: shift-click a pair, set green/yellow/red/auto, save to src/data/travelOverrides.js (applied by travelGraph.js), capture map + verdicts to docs/travel-captures/. Clicking an edge line itself is not supported (pairs are picked by their scenes). Untested in a browser.
- 2026-11-19 (dev): Travel mode reworked (source/target lists, weight buttons, change coord, save regenerates graph; game stops while open). Untested in a browser (no node here). Later: click on an edge line itself.
- 2026-11-19 (dev): Travel mode: add future-scene and connector points (travelPoints), red drawn see-through. Untested in a browser.
- 2026-11-19 (dev): Travel mode shows direct links only (neighbors() in travelGraph.js, config.travel.difficultLimit 150), bigger circles. The game adapter moves()/destinations() still use shortest-path costs: when step 6 happens they should become the direct green/yellow links.
- 2026-11-19 (dev): Travel mode: layer buttons beside the map, per-spot count of green+yellow direct links. Untested in a browser.
- 2026-11-19 (dev): Travel mode: weight buttons moved above the map, Delete source point removed (dangerous). Untested in a browser.
- 2026-11-19 (dev): Travel graph reset on the author's request: config.travel.manualLinksOnly = 1 makes tools/travel_graph.py write 0 edges, travelOverrides emptied (old state in commit 18743d0). Set it to 0 to get the computed links back.
- 2026-11-19 (dev): el_volcan scenes recoloured (dark basalt rock, approved version A, from the artist); the new underground map waits for approval.
- 2026-11-19 (dev): new underground map installed (artist option A + ladder + chamber floor). Travel points added on 'under': future_cave_NW (60,44), future_chamber (80,132), ladder_cueva4_mina2 (112,162). The (130,120) volcano mouth and the chamber link: the graph is blank, author links by hand.
- 2026-11-19 (dev): Travel mode: source marked with a black dot, link numbers removed, several targets by shift-click (tgts list). Untested in a browser (no node here).
- 2026-11-19 (dev): Travel mode: small number beside each spot = its manual links (red 0 = not done). Untested in a browser.
- 2026-11-19 (dev): aboveground map installed (artist: crisp A, ground at 50%, stairs B with cloud puffs). Same 250x250, so travel points on 'above' keep their spots.
- 2026-11-19 (dev): Travel mode: Deselect all and Hide/Show numbers buttons (showNums). Untested in a browser.
- 2026-11-19 (dev): Travel mode: weight buttons under the layer buttons (left of the map); layers ordered above, ground, under. Untested in a browser.
- 2026-11-19 (dev): aboveground map replaced by artist option clouds_a (small cloud islets at both stair ends). Ground map clouds at the stairs: with the artist.
- 2026-11-19 (dev): Travel mode: Deselect all and Hide numbers moved to the left column. Untested in a browser.
- 2026-11-19 (dev): Travel mode: plain click on another layer than the source picks a target (cross-map links). Untested in a browser; if it still fails the author should say what happens.
- 2026-11-19 (dev): ground map replaced by artist option clouds_c_v2 (5 sky-colour clouds over each stair tip). Only open sea changed; map spots unaffected.
- 2026-11-19 (dev): Travel mode: Tools section, Align to source, Future<->connector switch, notes per added point (travelPoints[].note, kept by serve.py, <=500 chars). Notes only editable once the point is in the graph (save + reload). Untested in a browser.
- 2026-11-19 (author, idea): in the future every connector (bridges, stairs, ladder...) becomes a real scene; for now they are the important links of the travel graph. Switch them with the Future<->connector button when each gets its scene. The three built-in bridges are generator waypoints and can't be switched yet.
- 2026-11-20 (dev): Travel mode: future=circle, connector=square (pending points too, they showed a fixed square so the Future<->connector switch looked dead); verdict counter is per page session (touched set). Untested in a browser.
- 2026-11-20 (dev): Travel mode: selected added points list their type (circle/square) above the link info; shapes bigger. Swap logic itself read fine; if it still fails the author should say which point and what the tip says.
- 2026-11-20 (dev): Travel mode: link list moved under the map; a new source clears the targets. Untested in a browser.
- 2026-11-20 (dev): Travel mode: pending points magenta; Future<->connector works on built-in bridge/pier/stairs (travelPoints entry with the same name; travel_graph.py changes that node's kind instead of adding one). Bridges still cancel river price by name list, whatever their type. Untested in a browser.
- 2026-11-20 (dev): Travel mode: future scenes magenta, pending = dashed outline; Check connections button (lost(): components over neighbors(), all but the biggest group are ringed and listed). Cave-mouth twins and the castle's five scenes count as one spot each. Untested in a browser.
- 2026-11-20 (dev): artist drew 27 future + 31 connector scenes in the review drop; open questions saved in docs/dev-notes.md (walk line rows, mouth types, mirrors, wiring). Nothing wired yet.
- 2026-11-20 (dev): bridges as scenes on a trip: src/data/connectors.js lists the scenes, travelGraph.connectorsBetween finds the bridges of a trip, render.walkAcross plays them (east to west mirrors only the walk). Untested in a browser (no node here). Later the same day: stairs (up right, down left) and mouths (stop at the opening, fade, walk on) too, openings read off the art in data/connectors.js; only zone-changing trips cross connectors. Ladder (door steps, positions 150 and 122 read off the art) and a dev panel Connectors picker (travel.connectorTests) added. enter_mine_S plays as a tunnel step after (in) or before (out) the underground side of mouth_dunas_mina (a guess). Fights inside connector scenes and jumps still to do. Pier: an explore branch (events.js, config.balance.pPier) plays pier_land, pier_end (3 s stop), then back left; placeholder numbers.
- 2026-11-20 (dev): connector walks died on scenes.js localizarBocadillo (places[scene] undefined, so the wizard stayed off screen); fixed. Trick for next time: headless Edge (msedge --headless=new --dump-dom, tools/serve.py) with a temp module page calling render functions, document.hasFocus forced true, logging to document.title.
- 2026-11-20 (dev): connector scenes registered as scenes (connectors.js connectorSceneInfo; map dot via travelGraph.pointSpot). Events inside and stage entries wait for thinker: chance, scene length, enemy list of a connector (zone it joins? either side?), mirrored cast.
- 2026-11-20 (dev): walkAcross ends with him standing in his place (no walk-in after the last connector scene), author's request.
- 2026-11-20 (dev): bridge overlays wired (overlays.js, img/places/overlays); spring wall shifted 3 rows (feet row 60). Leaving inn/dice house now exits to the street at the door and walks right into the next scene (render.leavePlace).
- 2026-11-20 (dev): TRIAL walk line +2 px everywhere (headLevel 0.109375 -> 0.1015625, layout.js + game.js); revert by restoring the number if scenes look floaty.
- 2026-11-20 (dev): trial walk line raised to 6 px (headLevel 0.0859375); overlays drawn for feet row 60 will need shifting up if kept.
- 2026-11-20 (dev): trial walk line now 4 px (headLevel 0.09375); overlays drawn for feet row 60 need shifting up 4 rows if kept.
- 2026-11-20 (dev): taller bridge overlays + 6 stairs overlays wired (overlays.js).
- 2026-11-20 (dev): south and swamp bridge overlays cut 2 top rows (rail was too tall).
- 2026-11-20 (dev): south and swamp rails cut 2 more rows (4 total); the stairs front railings were disliked and removed from the game; artist asked for short ornaments instead.
- 2026-11-20 (dev): stairs newel-post overlays wired to test (overlays.js); LANDSCAPE.md plan exists, question 1 answered (columns appear when needed).
- 2026-11-20 (dev): Beach zone wired: la_playa scenes, ten naga sprites (la_naga), bosses lamia and greater_naga, couple-of-bosses support. Open: names of our own for the champion and oracle, real boss attacks, beach altar, water spells.
- 2026-11-20 (dev): Water school added (placeholder art/sound copied from frost); art and sound notes left. Next: boss attacks for the lamia and greater naga once the author picks them.
- 2026-11-20 (dev): beach boss attacks and sea-jump entrance chosen by the author (lamia: maelstrom, tidal wave, serpent gaze; greater naga: tide charge, fury slaps, coil crush); notes left for artist and musician; media.js now finds anim_<boss>_ files of bosses with an underscore in the name.
- 2026-11-20 (dev): beach boss moves wired with placeholder strips and scenes (lamia charm via config.balance.charmChance, a placeholder number); entrance and sounds pending.
- 2026-11-20 (dev): water bolt, whirlpool, spark and the naga sting art approved and wired (the sharpshooter shoots fx_sting). The delta is dropped; the beach is the only coast zone. Next: sea-jump entrance, boss move sounds.
- 2026-11-20 (dev): lamia sea-jump entrance (entrances.js, kind seaJump) as a trial; the greater naga follows if the author likes it (move him to the seaJump list). Splash sound pending.
- 2026-11-20 (dev): lamia jump starts in the visible sea; lamia and greater naga added to the medium boss box (render.js npcBox); the greater naga keeps the sand rise (author likes it).
- 2026-11-20 (dev): lamia jump faster; greater naga sandBurst entrance (burrow with a sand palette, bigger); dev console lists one boss per line (run.forceBoss). Artist asked for the real beach boss powers.
- 2026-11-20 (dev): la_playa6 renamed la_playa5 (the Beach now has scenes 1-5; the author's numbering slip). Maelstrom scene spell final art wired; tidal wave art awaits the author's verdict.
- 2026-11-20 (dev): lamia strips, naga tide charge (strip + scene) and both 64 px sprites wired; fury slaps and coil crush get a path (he moves to the wizard) and an optional attack.hit frame; their strips are being redone by the artist.
- 2026-11-24 (dev): greater naga fury slaps and coil crush final art wired; the beach bosses' art is complete (sounds pending). Docs reorganized into docs/plans by the clerk; dev-notes/sound-notes/ideas tidy postponed by the author.
- 2026-11-24 (dev): committed the author's map-spot and travel-override edits, regenerated the travel graph, cleaned synth.js (dead commented copy removed), added tools/midi_to_song.py (MIDI to song text). Idea: a Music-mode button to import a .mid straight in the browser (needs the converter ported to JS); songs are not played anywhere in the game yet.
- 2026-11-24 (dev): freesound_community added to the in-game credits (the other Pixabay names in docs/SOUNDS.md still wait for the author's word).
- 2026-11-24 (dev): camping wake-up walk done. Desert tent entrance needs a new scene (el_Desierto tent exterior): asked from the artist in art-notes; wire it in STREET_DOORS/DOORS of render.js when it arrives.
- 2026-11-24 (dev): second-tab paradox built (src/dimension.js, read-only mode in state.js); untested in a browser (no node). Test: open two tabs of the game with ?dimension=1. Idea: more glitch kinds later (rain of letters, scene tearing).
- 2026-11-24 (dev): second-tab guard closed: read-only until claimed (state.js allowSaving), localStorage heartbeat fallback without Web Locks. Untested in a browser.
- 2026-11-24 (dev): the 29 approved sfx are wired (snd/creatures; attackSounds; arrivalSound in entrances.js). Untested in a browser. Open: healing_rain and divine_light sounds have no caster; Medusa poison strike, whirlwind, eclipse still unchosen.
- 2026-11-24 (dev): "First earned by" done; lamia attack animations were already wired. The la_Mina2 rail is in the art (la_mina2.png): for the artist, left in dev-notes.
- 2026-11-24 (dev): faith meter stick (statsPages.js, .faithStick in index.html) and the boss-blank-before-a-move fix (ui/bossAttacks.js: canvas cleared at the first frame, not at the start) done, untested in a browser. The Texts console error is fixed (a newline inside a string, texts.js:170). The belief meter marker art and the la_Mina2 rail are in art-notes for the artist.
- 2026-11-24 (dev): belief meter marker art B (needle on a bead, 5x11) wired in place of the stand-in stick; untested in a browser.
- 2026-11-24 (dev): travel console edge outline + note box removed; la_mina4 option A copied in; sea-coloured boss spells are art, sent to art-notes. la_Mina2 option C waits for the author's yes.
- 2026-11-24 (dev): la_mina2 option C copied in; rail note archived.
- 2026-11-24 (dev): boss hits raise belief (config.belief.weights.bossHit 1.5), heal touch costs x0.5 (config.belief.healCostFactor), travel console layout + Optimal path done; all untested in a browser, numbers are first guesses. Left in the travel note: source/target scene viewers, edge length as dynamic scenes.
- 2026-11-24 (dev): dynamic scene count per edge (travelGraph.dynamicScenes, config.travel.pxPerScene 40) shown in the travel console; the rate is a guess to tune. Not used by the game yet.
- 2026-11-24 (dev): desert tent entrance wired (STREET_DOORS el_desierto_taberna -> el_Desierto1, door x 180 read off the art by eye; check it); la_pradera9 option B copied in. Untested in a browser. Leaving the desert inn still has no inside door x (DOORS), so he leaves by the plain walk.
- 2026-11-24 (dev): approved art copied in (sea spells, Rainbow cape C, healer hood C, tavern A for el_poblado, spectrum x7 in img/enemies/spectrum). Left: tavern fix for la_ciudad and el_desierto taverns (artist), Rainbow spectrum event wiring (dev).
- 2026-11-24 (dev): Travel console scene viewers: the game scene is the source's first scene, Alt/Alt2... viewers sit in the console's place (like art mode; connectorScenesOf in data/connectors.js). Untested in a browser (no node). Author's travel links committed.
- 2026-11-24 (dev): checked that the game does use the travel graph (travel.js -> travelGraph.js moves/destinations from the author's manual links, zones.js strings as fallback); the old dev-notes line saying otherwise was stale and is corrected. Open: border scenes list (artist reviews map/coords/scenes first).
- 2026-11-24 (dev): Dunas2 underground inn code scaffolded behind config.balance.dunesInn (off) while the artist draws the room; the shop half waits for the professions vendors.
- 2026-11-24 (dev): Dunas2 underground inn wired (art A2 + old man D, config.balance.dunesInn = 1, NPC idle by code in render.js IDLE_NPCS). Idea for later: a blink or sway idle needs art; shop half = professions vendors.
- 2026-11-24 (dev): Rainbow spectra wired (src/spectra.js, hooks in combat.js, events.js, entrances.js, state.spectra; config pSpectrum, prismSpectrumBoost, prismChance, all placeholders). Waiting on the author's pick of fusion A/B/C and prism A/B/C in the review drop (wizardidle-review/rainbow/); the fusion strips are 256x64, so playStripEnter needs a wide-frame option when wired. Untested in a browser (no node).
- 2026-11-24 (dev): spectra: fusion B and prism B wired; last spectrum dead -> achievement logro_spectra (icon pending, artist options in the review drop) and the Rainbow comes at once with the fusion (run.forceOnce/forceBoss); dev console Spectra tab. Untested in a browser (no node).
- 2026-11-24 (dev): dev-notes cleaned: finished or already-planned notes (sea-colour spells, submaps, Etymos, spectra, caravans, battle AI, dynamic scenes, beach transitions) moved to the archive; kept open: border scenes, music, travel notes, connectors, dice house, revive near the quest, Gruta mouth.
- 2026-11-24 (dev): healer cabin near the quest path (src/cabin.js: cabinSpot, state.quest, nearest allowed stage by travelCost; no cabin in Dueñon/Heidan; looks wild/town/city/cave, art pending, LOOK_ART lists the ones wired). Untested in a browser (no node). The quest system itself is not built: it must set state.quest.
- 2026-11-24 (dev): the four cabin looks wired (img/story/curanderobg_wild/town/city/cave); scrolls.js hides the map dot for any curanderobg*. Clerk may clear the round-one options in review/healer.
- 2026-11-24 (dev): mouth_gruta_cueva (Cave to Grotto crack) registered: ENTRANCES in tools/travel_graph.py, mouthDoors 160/160, three links in travelOverrides (la_Gruta3 | mouth ground side, la_Cueva2 | under side), art swapped to the ground=Grotto convention. Big canyon opening waits for the artist's redraw.
- 2026-11-24 (dev): big Grotto canyon entrance wired as mouth_dunas-pradera_gruta (+ _under), overlays in img/places/overlays (data/overlays.js), links la_Pradera13 and las_Dunas5 to the ground side, la_Gruta1 and 2 to the inside. Untested in a browser.
- 2026-11-24 (dev): pier excluded from planFight (travel.js), so no fight can land on a pier scene. The pier visit never used planFight, so if the author still saw a fight near the pier it was a neighbouring bridge or border crossing: ask which.
- 2026-11-24 (dev): dev connector walks got From/To stage pickers (devWalk in src/dev/tests.js); the old walk always ended in the start stage, which looked like a teleport back after a crossing fight. Untested in a browser (no node).
