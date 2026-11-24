# Map of Wizard Idle

Read this before opening any code. Plain JavaScript modules, no build step; the game opens from index.html. Files marked (dev) load only while developing.

## Root

- index.html: the page shell; loads src/main.js. manifest.json, browserconfig.xml, favicon.ico: install-as-app info.
- service-worker.js: offline mode. Code files network first, art and sound cache first; each deploy gets its own cache.
- CHANGELOG.md: what changed per release. ideas.md: status, one line per idea (text in docs/ideas/ or the plans), the last three journal entries. README.md: public readme.

## src/ (core)

- dimension.js: one world, one tab: the first tab holds a browser lock and saves; other tabs are read-only "dimensions" that glitch and collapse (off in DEV unless ?dimension=1).
- synth.js: the game's own music: parses song text files (songs/<name>.txt, format in its header) and plays them live with Web Audio, no sound files. Not played anywhere in the game yet. tools/midi_to_song.py makes song files from .mid files.
- main.js: entry point. Connects the page buttons to the game; with `?sim=1` loads src/dev/sim.js, otherwise loads the dev panel when DEV is on.
- config.js: all balance numbers (`config`), the DEV switch (the deploy turns it off), `masterTime` (tick length) and other constants.
- state.js: `state` (the current wizard) and `world` (cemetery, outlives wizards); `saveGame`, `deleteSave`, `freshStart`. Plain JSON in localStorage, keys `wizardidle2:save` and `wizardidle2:world`.
- runtime.js: `fight`, `run`, `ui`: what the game keeps in mind while running. Never saved.
- game.js: name screen, loading a wizard, play time, pause, starting values of the runtime objects.
- loop.js: the one game loop. Named clocks (`every`, `stop`), speed, freeze/thaw, and `simulate/step` for the fast virtual clock.
- events.js: what happens on each master tick: the event picker and every event (explore, inn, shrine, statue, rune, book, loot, offering, revival).
- combat.js: choosing the enemy (normal, boss, hydra), each round, attacks, heals, polymorph, enemy names.
- spectra.js: the seven secret spectra of the Tundra (rare, once each), the prism quest flag (`state.spectra`) and the Rainbow's fusion entrance trigger.
- cabin.js: where the healer's cabin stands after a revive by touch (near the stage he fell at while `state.quest` is set; never in Dueñon or Heidan) and which look it has.
- bossEffects.js: extra effects of boss attacks (Medusa's stone gaze, Midas heal, blizzard skip).
- spells.js: spell sprite animation on the spell canvas and which spell is cast.
- wizard.js: levelling, XP, gold, faith from gold, trainable skills.
- belief.js: belief meter (-100 to +100), its four levels, shrine and touch costs.
- divine.js: the god's three touches (wizard, scene, enemy).
- story.js: chapters unlocked by level, history scroll, story events.
- travel.js: changing zone and stage, picking backgrounds.
- travelGraph.js: the graph is the author's manual links (data/travelOverrides.js, from Modes > Travel): `moves(stage)` and `destinations(stage)` are what travel.js picks from (Accessible and Difficult links lead somewhere, Impossible none; a bridge, mouth or stairs point passes the trip on to the stages linked to it; a stage with no link falls back to the typed strings of zones.js). travelCost and route still run over the generated graph (data/travelGraph.js, tools/travel_graph.py) for the dev tools (docs/TRAVEL.md).
- data/overlays.js: the scenes that have a front layer (img/places/overlays/overlay_<scene>.png, drawn on overlayCanvas over the wizard and sprites).
- dev/travel.js: dev mode (Modes > Travel): the map of a layer with the cheapest paths from a clicked scene (green move, yellow destination, red too far).  Shift-click a second scene to set a manual verdict for the pair (saved in data/travelOverrides.js, applied by travelGraph.js).
- achievements.js: unlocking and listing achievements.
- away.js: time away (docs/plans/AWAY.md): settles away time / 108 on load (faith, gold, levels, soft dead, permadeath and the poem) and reloads a long-hidden page. awayMath.js: its formulas; data/awayTexts.js: its texts; numbers in config.away.
- stats.js: counters, totals and records (`stats.count/add/max/min`), play time. Read by achievements and stats pages.
- audio.js: `playSound(name)`, volume 0.3 for every game sound.
- media.js: `art(name)` and `snd(name)` give file paths (see Media).
- utils.js: small pure helpers (random, chance, number format).

## src/data/ (content tables)

- enemies.js: families, sprite variants (`enemySprites`, `max` = how many numbered sprites), gold flag.
- zones.js: zones, stages, their enemies, boss, destinations.
- spells.js: spell sprite sheets (name_frames), school, display name.
- bossAttacks.js: each boss's attacks, frame counts, scene spell and its start frame.
- achievements.js: achievement list. dreams.js: the dream pool (docs/plans/SLEEP.md). src/dream.js picks tonight's dream (shuffle bags) and applies its belief effect.

## src/ui/ (drawing and menus)

- render.js: heading (HP, XP, gold, faith), console, backgrounds, wizard and enemy drawing and idle animation.
- layout.js: sizes everything from the window, portrait or landscape.
- menu.js: toolbar buttons. scrolls.js: parchment scroll pages (stats, achievements, help, kill, map). statsPages.js: the Stats page the Inventory page (the stats scroll's second tab) and the Faith scroll (the prayer button, btn4). bestiary.js: kill scroll's bestiary page. cemetery.js: kill scroll's cemetery page (a tomb per dead wizard, name and age carved in the tomb font, a parchment note on tap; erased = cracked tomb).
- bossAttacks.js: plays boss attack strips, scene spells, earthquake shake, Medusa's gaze.
- enemyMoves.js: how normal enemies attack (sprite moved by code plus an effect).
- entrances.js: how enemies arrive (glide, float, rise, jump, flicker, walk; mages also fade in; rare mages and the mage bosses through fx_portal_* strips).
- text.js: `markup(html, slots)`: game texts are HTML; `[sprite]` becomes an inline icon, `{name}` and other slots are filled.
- dom.js: `el(id)` shortcut. src/minigames/sixFiveFour.js: the dice game in town houses.

## src/dev/ (dev)

- tests.js: the dev panel: pickers (wizard, bosses, hydras, enemies, each fight with a chosen arrival), scenarios, quick actions, command line, mode buttons.
- panel.js: left and right side panels (float over the game on small screens).
- music.js: music mode: pick, edit and play a song (songs/ or the review drop's .song.txt), restarts on every edit, Save to game writes songs/<name>.txt.
- sounds.js: sounds mode: pick a scene and a sound, cut/speed/fade/volume, play together.
- art.js: art mode: a files table (review drop, local files, game files picked by folder), the scene and an alt scene under it to compare, frame size found by itself, one viewer for sheets.
- scenes.js: scene picker shared by both modes (wizard moves, enemies, bosses, spells, objects, backgrounds).
- soundNeeds.js: list of moves still needing a sound (delete a line when approved).
- texts.js: texts mode: drops of chapters (read from docs/STORY.md), dreams (data/dreams.js) and console lines (phrase lists read from the game code and zones, story beats from STORY.md); shows the picked text in the chapter scroll, the dark of the night or the console, and edits it live in the notes box.
- notes.js: notes box (in the texts mode it becomes the text's editor). review.js: reads the review drop.
- sim.js: fast simulation mode (`?sim=1&seed=7&god=active&until=100&set=name:value`). bots.js: the god bots it uses.

## tools/

- travel_graph.py: builds src/data/travelGraph.js from the maps and zones.js and checks it (--compare with the old strings, --paths <stage> <png> to draw the cheapest paths). serve.py: local server without caching, note saving, and the review drop at review/. land.py: lands a work branch on dev-repo in the main folder by itself (run after every commit by hooks/post-commit, with `git config core.hooksPath tools/hooks`). odds.py: achievement odds in a second from a playtest's odds-data.json (players who quit at random, counters projected, suggested tier). playtest.py: runs many simulations headless and writes docs/playtests/<date>-<name>/ (summary.md, runs.csv). cut_sounds.py: cuts the approved sounds of sound_cuts.txt into snd/. to_ogg.py: turns whole mp3/wav/flac files (or a folder) into game .ogg files, same settings; never convert sounds by hand.

## How it connects

- Start: main.js, then game.js loads or creates `state`; loop.js starts the master clock every `masterTime`; each tick events.js picks an event.
- Everything the player sees is derived from `state` (saved) plus `fight/run/ui` (not saved); a fight is lost on reload. Saving happens through `saveGame`.
- Combat: an enemy event calls combat.js; each round the wizard casts (spells.js, wizard.js), the enemy answers (ui/enemyMoves.js, or ui/bossAttacks.js plus bossEffects.js for bosses). Kills feed wizard.js (XP, gold) and stats.js.
- Scenes: travel.js picks the zone, stage and background; render.js draws it; entrances.js brings enemies in.
- God and story: divine.js (touches) and belief.js (belief) change faith, HP and enemies; story.js unlocks chapters by level. Plans: docs/plans/FAITH.md, docs/plans/ERASURE.md.
- Every count goes through stats.js, so achievements and stats pages read one source.

## Media

Code asks by plain name; only src/media.js knows folders. A name that fits no rule is warned in the browser console during development.

- Images: img/wizard/<cast|walk|pray|fall|petrify|unpetrify>/ (anim_<name><tier>), img/wizard/poses/, img/enemies/<family>/ (el_golem1..., run_<sprite>, ram_<sprite>, polymorph/), img/bosses/<boss>/ (boss and anim_<boss>_<attack>), img/bosses/hydras/<hydra>/, img/effects/<spells|scene|fx>/ (spell*, scene_*, fx_*), img/places/<zone>/, img/story, objects, ui, ui/achievements, app.
- Sounds: snd/<schools|wizard|creatures|places|ui>/<name>.ogg. A new sound name needs a rule in media.js first.
- Sprite strips are one row of frames side by side; frame height is the image height. Usual frame width: equal to the height when the width divides evenly; spells 30x30 (1px gap); fx_* each their own size; scene_* 256x64; boss attacks 104x80 (boss 64x64 at 36,12); hydra strike/cast/idle 84 wide, grow 64 wide.
- Enemy variants are numbered (el_golem1, el_golem2...); `max` in data/enemies.js says how many.
- Sound volume: the game plays everything at 0.3; the sounds mode can try other volumes and notes them.
- Files from outside are renamed first (short, lowercase, `_`, the kind's prefix; source goes in docs, never the file name).
- The old root folder ogg/ is not used by the code.

## Dev tools

- Run: `python tools/serve.py` (port 8000, or give another), open http://localhost:8000. DEV in config.js must be true.
- Panels: left holds the dev menus; Modes open on the right: Sounds, Art, Texts. The game waits while a mode is open. Hide from Help, Developer tools.
- Notes box: type a comment; "Capture moment" freezes the technical details; "Save to file" appends to docs/sound-notes.md, docs/art-notes.md, docs/dev-notes.md or, from the Texts mode, docs/history-notes.md (the edited texts, to copy into the code) (localhost only, via serve.py).
- Review drop: the folder wizardidle-review/ beside the main folder, outside the project (tools/serve.py serves it at review/ from any working folder). Roles drop new art and sounds only there, never in img/ or snd/; dev copies an approved file into the game. Add a line to its index.txt: `date | who | file | game file it would replace, or - | short note`. Art and Sounds modes list them newest first. Delete handled lines and files.
- Achievements: every time one is added, give it a tier in src/data/rarity.js and re-run `python tools/playtest.py --name achievement-rates --seeds 12 --setting idle:god=idle --setting active:god=active` (its summary lists the share of runs earning each); the bots do not do everything (no studying, inns, runes), so judge those by hand.
- Playtests: `python tools/playtest.py` (see its help) or open index.html with `?sim=1`.

## docs/

- Top level (inboxes and index): ROADMAP.md: stages ahead. ARCHIVE.md: finished items, append-only, never read. dev-notes.md: the one notes file for the author (bugs, improvements, talk with dev). art-notes.md, sound-notes.md (saved from the dev tools box), thinker-notes.md (design notes moved there): role inboxes. MAP.md: this file.
- STORY.md: the story script, every chapter scroll and console beat (stays here: the texts mode fetches it). Its review page is in artefacts_tests/ (README there); after changing STORY.md run `python artefacts_tests/build_story_scrolls.py`.
- SOUNDS.md: sounds pending (approved, to cut, to choose) (stays here: the musician role and the sounds mode use it). TRAVEL.md: plan to replace the hand-typed destinations with a graph computed from map coordinates (soft costs, bridges, built for the dynamic scenes) (stays here: travel code comments and tools point at it).
- plans/: feature plans and their decisions. AWAY.md (time away), DECISIONS.md (settled choices and why, append-only, not read in normal work), ERASURE.md (what follows the god's final win and erasure), FAITH.md (belief, faith, revive plan), LANDSCAPE.md (big-screen landscape: scrolls in columns beside the game, sharp scene snap), MAPS.md (map revamp: ground and aboveground maps, the coast, creek, bridges, border scenes), PROFESSIONS.md (reagents, recipes, vendors), SCENES.md (composing scenes from parts), SCENE_SPELLS.md (full-scene spell animations and boss effects), SLEEP.md (sleep, dreams, nightmares), STATS.md (stats and playtest tools).
- ideas/: idea text by topic (story.md, world.md, creatures.md, extras.md, dreams.md); ideas.md (root) lists them one line each. Open only the topic you work on.
- data/ (generated results): playtests/ (results of simulation runs, written by tools/playtest.py) and travel-captures/ (map snapshots from the travel mode, written by tools/serve.py). Both stay at docs/playtests/ and docs/travel-captures/ because the tools write there.
