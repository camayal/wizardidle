# Changelog

## Unreleased (dev-repo, shown as 2.2.0-dev)

- The mysterious healer vanishes with his old red pin animation again, played over his fade-out.
- Risers come out of the ground, and sink back into it, in the artist's new ground effects (cracked hole, soil burst, dust plume, sinkhole; a random one each time, a bigger set for the 64 px bosses) instead of the small dust puff; the sprite rises with the effect's frames. The hydras (mother, icedra, hydskon) leave by sinking into their own mud pool, ice spikes or bone heap.
- Hydra entrances have their own sounds (mud, ice, bones), each with a burst as the hydra shows; the generic hydra sound now plays only when a head regrows.
- Tools: tools/to_ogg.py turns mp3, wav or flac files (or a whole folder) into the game's .ogg files (mono, game names, the same quality as the cut sounds).
- Fixed: chapters show at their own levels: Chapter IV at 90, IX at 160, X at 190, XI at 200 (v1 key typos had IX and X replacing levels 60 and 90, and XI never came).
- Two chapters reached close together each get their own scroll, one after the other; the game resumes after the last.
- Fixed: after a partial rest the wizard no longer says he "feels totally renewed"; that line is kept for a full recovery.
- When the wizard falls, the enemy leaves the way it came, backwards: walkers turn and walk off, fliers fly away, risers sink into the ground, mages fade out, the portal bosses go back through their portal.
- Boss entrances: King Skeleton fades in inside his cursed skull arch, which then crumbles away; Herbus grows out of braided vines; kkck pushes up a bump of dirt and bursts out of it; Goro, Protromus and Bicaptop slam down from a leap, Rojo in a burst of fire; Cuboq bounces in; Etymos floats in; Medusa slithers.
- The enemy that fells the wizard finishes its attack and its spell before it leaves.
- The killing blow takes the wizard's last HP when it lands (a boss's scene spell reaching him, a strike hitting), and he falls then, not before the attack starts; the game waits for that blow.
- Bestiary: the Bosses heading shows only once the first boss is met, and Secrets only once the first hydra is found.
- The Kill button asks twice: the first press opens a small parchment saying to press again, that it is permanent; tapping the parchment closes it.
- The mysterious healer leaves by fading away, the mages' fade-in played backwards, instead of the red pin overlay.
- Credits: Dragon Studio (ko-fi.com/dragonstudio) for a bunch of sounds.
- The wizard no longer lingers in one zone: after a while there each walk makes him more likely to move on, and after a long stay he sets off for another zone.
- Dice houses: after a game he may stay at the table for another round instead of walking out and back in. In the Town he no longer walks into the dice house on almost every exploration (a missing bracket).
- The Prologue scroll opens only once the scene has loaded, so the scene shows below it; a chapter scroll now holds the game the moment it is due, so no event starts behind it.
- The wizard fights only with spells: the staff hits (Staff, Staff and cause hemorrhage) are gone from his spells; bosses still use them. Breaking pots and crates with the staff stays.
- Time away: the time the god was not watching changes the wizard a little (away time divided by 108). His faith falls, gold drifts, he may gain a level or two (never up to a chapter). After about a month he has fallen and only your touch lifts him; after more he may die for good, and then a poem is the only thing you are told. A page left hidden for a few minutes counts as away. The help scroll holds a hint about the slow clock.
- Reloading the game starts with a clean scene: the enemy, hydra or object that was there when the game closed no longer stands frozen on the right.
- Dev tools, Texts mode: every chapter scroll, dream and console line in drop lists, shown where the game shows it (chapter scroll, the dark of the night, the console); the author notes box becomes a taller editor, each edit shows in the game at once, Save to file adds it to docs/history-notes.md.
- Dream lines are HTML over the dark: bold, italics, colours, sizes and [sprite] icons can be written in a dream; long lines wrap instead of running off the scene.

- Dreams: some dreams raise belief (+1 Devout or Believer, +2 Doubter, +3 Atheist; callings for the doubting), nightmares can shake a Believer or Devout a little but never below the Believer line; the full pool of 56 dreams, none repeats until its whole pool has played, and they happen in the background too.
- Lighter notes: ideas.md is a short index, idea text sits by topic in docs/ideas/, decisions in docs/DECISIONS.md, one notes inbox per role; the approved boss and hydra sounds are recorded in SOUNDS.md and gone from the dev tools' "needs a sound" list.
- A file map, docs/MAP.md: what every file does, how the parts connect, media and dev-tools rules, for anyone starting work.
- Wizard animations from the artist: casting (with a spark by school, or a staff slash), walking, praying, falling, true death, turned to stone and breaking free, at every tier.
- Fallen and dead poses: a fallen wizard sits with a skull above him until revived; a true death shows the dead pose; the dead wizard lies face down, hair only, at every tier.
- Hands down at every tier: the raised hand that held the flame is lowered, so each wizard rests with both hands down; the flame now shows only in the cast animation, held in the lowered hand.
- The wizard walks: to finds and statues, out of one scene and into the next, through doors, and to the street door of inns and dice houses in the Town and the City before going in.
- Shrines, statues and inns outside the towns are entered on foot; scene changes fade more slowly.
- Shrines: the wizard stops a little before the cross, the shrine sound plays once he is inside, and the mystic stays while he walks away.
- Loot: the wizard walks up to the bag, barrel, box, chest or pot before opening it, then walks on.
- Sleeping: the dark and the dream stay over the scene when a scroll opens or closes.
- The bestiary no longer explains hydras under Secrets.
- The Records page of the stats scroll is gone (achievements do that job; past wizards are in the Cemetery). Each achievement now shows when it was won, in small grey text.
- Something to find twinkles on the ground before the wizard walks to it.
- Hydra entrances redrawn: the ice peaks now match the icedra (black outline, faceted faces) and the mud burst no longer leaves a pond behind.
- Enemies arrive their own way: flyers glide down, floaters drift in, burrowers rise from the ground, hiders jump in, casters flicker in, the rest walk in.
- Enemy mages now flicker in or fade in out of thin air; rare mages step out of a portal (purple, blue or red, three designs by the artist), and the mage bosses out of their own bigger one: Doria blue, King Midas golden, Rainbow multicolour.
- Dreams and nightmares come less often (one rest in twenty instead of about one in seven).
- Doria, Midas and Rainbow step out of a portal a bit bigger than themselves (90% of its art), and the boss grows out of the portal's centre while it turns, in its place just before the portal closes.
- Dev workflow: the review drop lives outside the project and work lands on dev-repo by itself after each commit, so no more manual merges or files in git's way.
- Dev tools: the long button lists became pickers: the wizard (level, -1/+1, poses, animations, gold/faith/HP), any boss with its arrival, any hydra with its heads, and enemies by exact sprite or at random (caster, melee by move, rare, rare mage, corrupted, by arrival), each with a chosen arrival; scenarios are one list with a Run button.
- Enemy attacks match their weapons: slash, thrust, smash, shoot, pounce, slam, and chargers run across the scene. The wizard waits for a charger to be back in place before casting again.
- Hydras arrive their own way at every head count: the Swamp mother rises from a mud pool, the Tundra icedra breaks out of an iceberg, the Dunes hydskon is built from flying bones (playable in the art dev console as "N heads: arrive").
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
- Fixed: exploring could walk the wizard out of a scene and back into the same one.
- Fixed: the game froze for good above level 190 (guardian fights).
- Fixed: the Volcano boss crashed its fights.
- Fixed (dev tools): after killing a wizard, or on a first visit, the name screen stayed hidden and only the dev panel showed.
- Fixed: stray lines left by spell effects, blank flashes between images, a blank wizard while praying.
- Fixed: scroll text overflowing past the bottom bar.
- Fixed: an arriving enemy could flash in its place, vanish, and only then come in.
- Dev: a stats module, a seeded simulation mode with god bots, and `tools/playtest.py` for playtests (with results in `docs/playtests/`).
- Dev: the rules for new files: files from outside are renamed to the game's short style before they come in; their source and licence go in the docs.
- Images and sounds organized in folders (wizard, enemies by family, bosses, effects, places by zone, story, objects, interface; sounds by kind); unused leftover files removed.
- Dev: dev tools (local only) in a light panel beside the game, with menus: modes, scenarios, "Fight now" fights, wizard and game actions, a command line.
- Dev: sounds mode sliders beside the number boxes, and Add folder: a list of the folder's sounds, each played by moving with the arrow keys.
- Dev: a sounds mode: any scene played by the game with any sound, cut, extended, sped up, faded and timed against the blow, with the landing sound; a list of the moves still needing a sound.
- Dev: an art mode: any scene at any tier in slow motion, edited art reloaded without a reload, a local PNG tried in place of a game image, and a frame-by-frame viewer (game size and big, two files side by side, all tiers, grid, ghost, feet line).
- Dev: an author notes box: a comment with the date, Copy, Save to file (`docs/<mode>-notes.md` through `tools/serve.py`, then clears), and "Capture moment" to freeze the test's details into the note.
- Dev: the game waits while its window is hidden or minimized.
- Dev: a review drop: the sessions' newest art and sounds listed in the art and sounds modes; "In scene" plays new art in its real scene, in place of the game image.
- Fixed: a spell effect whose image was already loaded could crash (the dice's second roll).
- Plans added: faith and belief, professions, story, stats, erasure, sleep, scene spells, sounds, scenes.
- Dev tools, art mode reworked: one table of files (the sessions' drops, local files, game files chosen by folder) with Scene, Alt and View on each row; an alt scene under the game plays the same moment with another file or the game's own art, side by side; frame sizes are found by themselves (and can be set by hand); one viewer, over the game, for sheets and close-ups.
- Scene spells (rains, the poison cloud, the rest) no longer stay on screen now and then: they fade away when they end, even if another animation cuts in.
- Arrows fly faster.
- The Cemetery is a field of tombs: each fallen wizard has one of five headstones with his name and age carved in it; tap one to read his story on a small parchment. Erased wizards lie under a cracked stone, their name turned and crossed out.


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
