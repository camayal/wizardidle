# Changelog

## Unreleased (dev)

- Wizard animations from the artist: casting (with a spark by school, or a staff slash), walking, praying, falling, true death, turned to stone and breaking free, at every tier.
- Fallen and dead poses: a fallen wizard sits with a skull above him until revived; a true death shows the dead pose.
- The wizard walks: to finds and statues, out of one scene and into the next, through doors, and to the street door of inns and dice houses in the Town and the City before going in.
- Shrines, statues and inns outside the towns are entered on foot; scene changes fade more slowly.
- Something to find twinkles on the ground before the wizard walks to it.
- Enemies arrive their own way: flyers glide down, floaters drift in, burrowers rise from the ground, hiders jump in, casters flicker in, the rest walk in.
- Enemy attacks match their weapons: slash, thrust, smash, shoot, pounce, slam, and chargers run across the scene.
- Bosses have their own attacks and scene spells, from the artist; hydras weave their heads, strike or cast, and grow each new head on screen.
- Boss effects: Medusa's gaze can turn the wizard to stone, King Midas heals with his golden rays (your touch interrupts it), blizzards, earthquakes and poison clouds.
- Medusa's artefacts: after his first time as stone, a rare find (a mirror shield or a gorgon's-eye amulet) makes him immune.
- Hydras keep their wounds between battles and heal only when a head grows; the game says how many heads they have left.
- Belief: a meter of its own, apart from faith, moved by moments (a heal that saves him, your final blow, getting up alone); four levels (Devout, Believer, Doubter, Atheist) change shrine visits and touch prices, and an Atheist refuses heals and hits.
- Your touch on an enemy can now kill it; one in ten of your critics is a super-critic.
- Sleep: he walks into the inn or lays his sleeping bag, the scene goes dark, sometimes with a dream or a nightmare, and he wakes in his place.
- The revive plays in order: the divine rings over the fallen wizard, the fade, then the hooded healer's cabin.
- Bestiary: a third tab of the kill scroll, with every creature seen or defeated, ink stains for the unknown, and the hydras as a secret.
- Stats scroll: a curated stats page and a Records tab (bests, firsts, a journey chart, all your wizards).
- Sprites drawn crisp (sharp pixels).
- Fixed: the game froze for good above level 190 (guardian fights).
- Fixed: the Volcano boss crashed its fights.
- Fixed: stray lines left by spell effects, blank flashes between images, a blank wizard while praying.
- Fixed: scroll text overflowing past the bottom bar.
- Dev: a stats module, a seeded simulation mode with god bots, and `tools/playtest.py` for playtests (with results in `docs/playtests/`).
- Dev: a test bar (local only) with scenarios, "Fight now" fights, animation previews and a command line.
- Plans added: faith and belief, professions, story, stats, erasure, sleep, scene spells, sounds, scenes.

## 2.1.0 — 2026-11-12

- Faster: spell animations stop after their last frame (before, every spell ever cast kept redrawing forever; 19 times fewer redraws in a 30-minute game).
- Faster: images are loaded once and reused instead of on every redraw.
- Fixed: a crash when two levels were gained at once while a scroll was open and the first level had a chapter.
- Fixed: a late-loading image could show the wrong frame (e.g. during a hop).
- Fixed typos: health points, Currently won, Gold spent at inns, Hydra heads, enough, decides to come back, gaming house, wants to gamble, a hydra, Divine polypoid.
- Offline mode: the file list and the cache version are generated at every deploy, so every release gets a fresh offline copy.
- Code: modern JavaScript throughout (no more `var`, template strings).
- Code: repeated snippets replaced by small named helpers.
- Code: the longest functions split into named pieces (battle, attacks, stats page, dice rolls, inn, shrine, loot, enemy choice, divine touch).
- Code: screen layout rewritten as one line per element (352 → 139 lines), same positions and sizes.
- Code: enemy data uses true/false instead of "true"/"1" text.
- Code: 117 lines of commented-out dead code and the old speed-debug shortcuts removed; the ideas found in the comments moved to `ideas.md`.
- Code: one short comment above every function; Spanish comments, including the story plans, translated to English.
- Restored the disabled developer console code and the author's signature line, dropped by the 2.0.0 module split.
- Version shown as 2.1.0.

## 2.0.0 — 2026-11-11

- Code split from one 4,254-line file into ES modules under `src/`, one per system.
- Game data (enemies, zones, spells, achievements) moved to `src/data/`.
- Buttons wired from `src/main.js` instead of inline `onclick` attributes.
- 11 undeclared variables declared; canvases looked up explicitly.
- Save is now one plain-JSON object instead of ~150 encoded storage entries.
- Names with spaces no longer get corrupted in the save.
- Balance numbers (XP curve, chances, starting skills) moved to `src/config.js`.
- Skills raised by statues, runes and books are stored as a bonus on top of the base values.
- Killing a wizard no longer erases other data stored by the site.
- Cemetery kept as records (name, level, age, born, died) that survive every wizard.
- One game loop with named clocks replaces five independent timers.
- Fixed: leaked timers that kept running events in parallel and could not be stopped.
- Fixed: every attack crashed from level 210 on (spell tiers ran out).
- Fixed: crash when the wizard and the enemy fell in the same round.
- Fixed: events kept running while the wizard was dead.
- Fixed: "another Boss" message never appeared.
- Fixed: easter egg check used a missing value on boss fights.
- Fixed: random skill training depended on the order of its fields.
- Fixed: installing as an app opened a broken page (wrong paths in `manifest.json`).
- Fixed typos: explosion, tries, Cemetery, Grotto, increased studying, restoration, intellect, Completion, defeated, loses, eradication, environment, BEGINNING, shrine.
- Unfinished achievements hidden and left out of the completion percentage.
- Offline mode: the whole game is stored on the device after the first visit.
- Old offline cache from v1 removed automatically.
- Version shown as 2.0.0.
- Developer console disabled.
- Removed unused files: `exp.js`, `cache.appcache`.

## 1.0.0 — 2018–2020

- Original version, written by hand while learning JavaScript. Frozen as tag `v1.0.0`.
