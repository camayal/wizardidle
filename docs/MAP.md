# Map of Wizard Idle

Read this before opening any code. Plain JavaScript modules, no build step; the game opens from index.html. Files marked (dev) load only while developing.

## Root

- index.html: the page shell; loads src/main.js. manifest.json, browserconfig.xml, favicon.ico: install-as-app info.
- service-worker.js: offline mode. Code files network first, art and sound cache first; each deploy gets its own cache.
- CHANGELOG.md: what changed per release. ideas.md: status, one line per idea (text in docs/ideas/ or the plans), the last three journal entries. README.md: public readme.

## src/ (core)

- main.js: entry point. Connects the page buttons to the game; with `?sim=1` loads src/dev/sim.js, otherwise loads the dev panel when DEV is on.
- config.js: all balance numbers (`config`), the DEV switch (the deploy turns it off), `masterTime` (tick length) and other constants.
- state.js: `state` (the current wizard) and `world` (cemetery, outlives wizards); `saveGame`, `deleteSave`, `freshStart`. Plain JSON in localStorage, keys `wizardidle2:save` and `wizardidle2:world`.
- runtime.js: `fight`, `run`, `ui`: what the game keeps in mind while running. Never saved.
- game.js: name screen, loading a wizard, play time, pause, starting values of the runtime objects.
- loop.js: the one game loop. Named clocks (`every`, `stop`), speed, freeze/thaw, and `simulate/step` for the fast virtual clock.
- events.js: what happens on each master tick: the event picker and every event (explore, inn, shrine, statue, rune, book, loot, offering, revival).
- combat.js: choosing the enemy (normal, boss, hydra), each round, attacks, heals, polymorph, enemy names.
- bossEffects.js: extra effects of boss attacks (Medusa's stone gaze, Midas heal, blizzard skip).
- spells.js: spell sprite animation on the spell canvas and which spell is cast.
- wizard.js: levelling, XP, gold, faith from gold, trainable skills.
- belief.js: belief meter (-100 to +100), its four levels, shrine and touch costs.
- divine.js: the god's three touches (wizard, scene, enemy).
- story.js: chapters unlocked by level, history scroll, story events.
- travel.js: changing zone and stage, picking backgrounds.
- achievements.js: unlocking and listing achievements.
- stats.js: counters, totals and records (`stats.count/add/max/min`), play time. Read by achievements and stats pages.
- audio.js: `playSound(name)`, volume 0.3 for every game sound.
- media.js: `art(name)` and `snd(name)` give file paths (see Media).
- utils.js: small pure helpers (random, chance, number format).

## src/data/ (content tables)

- enemies.js: families, sprite variants (`enemySprites`, `max` = how many numbered sprites), gold flag.
- zones.js: zones, stages, their enemies, boss, destinations.
- spells.js: spell sprite sheets (name_frames), school, display name.
- bossAttacks.js: each boss's attacks, frame counts, scene spell and its start frame.
- achievements.js: achievement list. dreams.js: the dream pool (docs/SLEEP.md). src/dream.js picks tonight's dream (shuffle bags) and applies its belief effect.

## src/ui/ (drawing and menus)

- render.js: heading (HP, XP, gold, faith), console, backgrounds, wizard and enemy drawing and idle animation.
- layout.js: sizes everything from the window, portrait or landscape.
- menu.js: toolbar buttons. scrolls.js: parchment scroll pages (stats, achievements, help, kill, map). statsPages.js: the Stats page. bestiary.js: kill scroll's bestiary page. cemetery.js: kill scroll's cemetery page (a tomb per dead wizard, name and age carved in the tomb font, a parchment note on tap; erased = cracked tomb).
- bossAttacks.js: plays boss attack strips, scene spells, earthquake shake, Medusa's gaze.
- enemyMoves.js: how normal enemies attack (sprite moved by code plus an effect).
- entrances.js: how enemies arrive (glide, float, rise, jump, flicker, walk; mages also fade in; rare mages and the mage bosses through fx_portal_* strips).
- text.js: `markup(html, slots)`: game texts are HTML; `[sprite]` becomes an inline icon, `{name}` and other slots are filled.
- dom.js: `el(id)` shortcut. src/minigames/sixFiveFour.js: the dice game in town houses.

## src/dev/ (dev)

- tests.js: the dev panel: pickers (wizard, bosses, hydras, enemies, each fight with a chosen arrival), scenarios, quick actions, command line, mode buttons.
- panel.js: left and right side panels (float over the game on small screens).
- sounds.js: sounds mode: pick a scene and a sound, cut/speed/fade/volume, play together.
- art.js: art mode: a files table (review drop, local files, game files picked by folder), the scene and an alt scene under it to compare, frame size found by itself, one viewer for sheets.
- scenes.js: scene picker shared by both modes (wizard moves, enemies, bosses, spells, objects, backgrounds).
- soundNeeds.js: list of moves still needing a sound (delete a line when approved).
- texts.js: texts mode: drops of chapters (read from docs/STORY.md), dreams (data/dreams.js) and console lines (phrase lists read from the game code and zones, story beats from STORY.md); shows the picked text in the chapter scroll, the dark of the night or the console, and edits it live in the notes box.
- notes.js: notes box (in the texts mode it becomes the text's editor). review.js: reads the review drop.
- sim.js: fast simulation mode (`?sim=1&seed=7&god=active&until=100&set=name:value`). bots.js: the god bots it uses.

## tools/

- serve.py: local server without caching, note saving, and the review drop at review/. land.py: lands a work branch on dev-repo in the main folder by itself (run after every commit by hooks/post-commit, with `git config core.hooksPath tools/hooks`). playtest.py: runs many simulations headless and writes docs/playtests/<date>-<name>/ (summary.md, runs.csv).

## How it connects

- Start: main.js, then game.js loads or creates `state`; loop.js starts the master clock every `masterTime`; each tick events.js picks an event.
- Everything the player sees is derived from `state` (saved) plus `fight/run/ui` (not saved); a fight is lost on reload. Saving happens through `saveGame`.
- Combat: an enemy event calls combat.js; each round the wizard casts (spells.js, wizard.js), the enemy answers (ui/enemyMoves.js, or ui/bossAttacks.js plus bossEffects.js for bosses). Kills feed wizard.js (XP, gold) and stats.js.
- Scenes: travel.js picks the zone, stage and background; render.js draws it; entrances.js brings enemies in.
- God and story: divine.js (touches) and belief.js (belief) change faith, HP and enemies; story.js unlocks chapters by level. Plans: docs/FAITH.md, docs/ERASURE.md.
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
- Playtests: `python tools/playtest.py` (see its help) or open index.html with `?sim=1`.

## docs/

- ROADMAP.md: stages ahead. ARCHIVE.md: finished items, append-only, never read. DECISIONS.md: settled choices and why, append-only, not read in normal work.
- ideas/: idea text by topic (story.md, world.md, creatures.md, extras.md); ideas.md lists them one line each. Open only the topic you work on.
- AUTHOR_NOTES.md: the author's bugs and needs after playtests. Inboxes, one per role: dev-notes.md, art-notes.md, sound-notes.md (saved from the dev tools box), thinker-notes.md (design notes moved there).
- STATS.md: stats and playtest tools plan. FAITH.md: belief, faith, revive plan. PROFESSIONS.md: reagents, recipes, vendors plan.
- SCENES.md: composing scenes from parts. SCENE_SPELLS.md: full-scene spell animations and boss effects.
- STORY.md: the story script, every chapter scroll and console beat. Its review page is in artefacts_tests/ (README there); after changing STORY.md run `python artefacts_tests/build_story_scrolls.py`.
- SLEEP.md: sleep, dreams, nightmares. ERASURE.md: what follows the god's final win and erasure.
- SOUNDS.md: sounds pending (approved, to cut, to choose). playtests/: results of simulation runs.
