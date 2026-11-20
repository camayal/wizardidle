# Changelog

## Unreleased
- Developer tools: a new Travel mode shows the map with the cheapest paths from any scene (green: moves in the zone, yellow: destinations, red: too far), to judge the travel numbers by eye before the game uses them.
- Travel mode redesigned for hand curation: pick a source and a target (lists, or click and shift-click on the map; scenes, bridges, the pier, cave mouths and stairs all count), set the link Accessible (green), Difficult (yellow), Impossible (red) or Auto, and "change coord" to move a spot on the map. "Save verdict" writes the corrections to files the game reads (travelOverrides.js, scene positions in zones.js) and regenerates the travel graph. The game now stops while the mode is open, so the scene stays on the one you picked. A Capture button saves the map and the corrections to docs/travel-captures/.
- Travel mode: new points can be added by hand (a future scene or a connector such as a bridge or stairs: type a name, "Add point", click the map; Save verdict and reload connects it to the graph), and Impossible (red) paths and spots are drawn see-through so the map is easier to read.
- Travel mode now shows only the direct links of the chosen scene (straight lines to its neighbours), coloured by weight: green easy, yellow hard (for example crossing a river), red too dear or removed and drawn see-through; spots reached only through another are not shown as neighbours. Scene circles are bigger with a white halo so they stand out on any map.
- Travel mode: the map layer buttons (ground, above, under) now sit beside the map.  The weight buttons (Accessible, Difficult, Impossible, Auto) sit just above the map; the "Delete source point" button is gone.  The travel graph now starts blank: it makes no links of its own (config.travel.manualLinksOnly), every link is set by hand in the Travel mode.  The source has a black dot in its centre, the link numbers are gone, and shift-click adds or drops several targets so one weight button sets all their links at once.
- Travel mode: each spot shows a small number again: how many manual links it has (red 0 means not done yet), so you can see which spots you already linked.
- Aboveground map redrawn in crisp pixel art (no more blur): the ground below is smaller, as if Heidan floated high above it, and the stairs and ladder end in small clouds that act as gates.
- Travel mode: clicking a scene on the map also shows that scene in the game, as a reference for the corrections.
- Developer tools: the mode buttons now show just one word (Sounds, Art, Travel, Music, Texts), and the Travel mode has a colour legend.
- Behind the scenes: the first version of the travel graph. A tool reads the map and the scene positions and works out how far apart places really are (rivers and sea cost extra, bridges are free crossings, cave mouths and the stairs join the layers). The game does not use it yet; it will replace the hand-typed lists of where the wizard can go once the author has reviewed the differences.
- Ground map: a road now leaves the town going south, turns west, crosses a second small bridge and ends at a new fisher's pier on the south coast (the pier is a place to add later).
- Underground map repainted to look like a natural cave: warm brown cloudy rock with cracks, winding tunnels of varied width with rough walls, a basalt volcano chamber with a lava lake and glow, rails and lamps in the mine, irregular pools and crystal clusters. The mine ends line up with the ground entrances and each entrance has a patch of daylight; the caves have rough walls, side nooks, rock pillars and a damp sheen.  Redrawn again in the Wizard Idle pixel style: brown caves and grey mines, a sealed lava chamber reached only through la_Mina2 (with its red crystal), a ladder between the south cave and the mine, and two open tunnel ends for future scenes.
- Lava chamber scenes (el_Volcan): the grey rock is now the dark basalt of the new underground map.
- Aboveground map: the cloud lands have puffy, irregular edges and the sky has some small decorative clouds around them.
- Ground map: the Prairie bridge now crosses something. A spring from the volcano runs down to the road, under the bridge, and joins the main river in a Y; the river has gentle S curves down to the sea, and the Prairie reaches a little further into the southern gulf so the river no longer runs beside the sea.
- Fixed the game sitting frozen after the tab was left alone for a long time: after the reload that settles the time away, the wizard now goes on with his adventures (before, only a wizard with no change at all restarted). A safety net also restarts the events if nothing has been scheduled for 20 seconds, and says so in the console.
- Waking a laptop that slept with the game tab open now reloads the game, so the time away is settled. Before, no visibility event fired, the away time was lost and the game could sit frozen with no events until a manual reload. Also added loop.loopInfo() for debugging (dev console: dev.loop.loopInfo()).
- Map scroll bookmarks have new icons: a cloud (aboveground), a mountain (ground) and a cave (underground).
- New underground map: dark cobbled rock that darkens toward the edges, a warm glow and magma veins around the volcano, glowing crystals, dark pools and a magma pocket, with rough, chipped edges where the rock meets the caves and the mine.
- Map scroll: when the player peeks at another layer the title just says "Map" (the long layer names overlapped); the zone's name shows only on the wizard's own layer.
- The game did not start: the map scroll commit had cut three scroll functions (blocking and restoring the toolbar, and the achievements page) by mistake. They are back.
- Map: the Dunes marker spots (and the mine entrance in the Dunes) moved onto the new beach, so the bubble no longer floats over the sea. The other ground spots were checked against the new map and sit on land.
- Map scroll has three ribbon bookmarks (aboveground, ground, underground): it opens on the wizard's own layer and a tap shows another map; the marker shows only on his layer, and the title names the other maps. The Heidan marker spots now sit on the aboveground map's features: the stairs at each end, the two portals and the altar's ruby pedestal.
- New maps: the ground map is repainted (a lake and a river, a thin land bridge from the Dunes to the Prairie, a beach along the north and east coast, bridges marked in the Prairie and the Swamp; the two Heidan cloud islands are gone, only the sacred stairs with a cluster of clouds at their end remain). Heidan has its own aboveground map now: two big clouds over a blurred copy of the ground, with portals and the props of its scenes; the map button shows it while the wizard is in Heidan. The portals and the new beach zone are still to come.
- Dunes: the thin strip of sea at the left edge of all five Dunes scenes, where the wizard walks in, is painted out as sand, so he no longer walks through the water. A walkable shore will come back with the map revamp.
n- Toolbar buttons could stay dead after the game opened, with only the ? working at some point: opening a second scroll right after another (the chapter scrolls) saved a blocked button as its handler. Blocking the toolbar now keeps the real handlers.

- Scroll ribbon bookmarks are new and a bit smaller: a crimson cloth banner with gold trim, a folded flap and a swallowtail, hanging over the roll at the top of the scroll, with ten new 9x9 icons (trophy for all achievements, skull, tombstone, beast, pouch, chart and the three map layers). Opening the bestiary no longer leaves a half-drawn icon.
- Scroll ribbons no longer show a half-drawn icon while a slow page (the bestiary, with all its sprites) builds: the ribbon moves first, both ribbon pictures stay loaded, and the page is built right after; the bestiary sprites decode in the background.
- Scroll ribbon bookmarks: the page now always starts below the open ribbon (the gap after the title is measured instead of fixed), and the ribbons are drawn above the page, so the bestiary's creature rows no longer hide the lower part of its icon.
- Scroll ribbon bookmarks: fixed part of the icon vanishing when a ribbon was opened (the bestiary's dotted row). Ribbon pixels now always land on whole screen pixels.
- Achievement seals: the two ribbon tails are now wider (2px, notched, hanging past the frame's bottom edge) in each tier's own colour, so they no longer blend into the parchment frame.
- Dev tools: new Music mode (Modes > Music) to write and play the game's own music, which is code instead of sound files: a song is a plain text note list (songs/<name>.txt, format in the header of src/synth.js), played live with Web Audio. Pick one of the game or the musician's songs from the review drop, edit the text, and it restarts on every edit so you hear the change at once; Save to game writes the file. A first song is in (A minor walk). Nothing in the game plays songs yet.
- Four achievements can now be earned: "The librarian" (1000 books), "Someone is throwing rocks" (1000 runes), "BnB, beer and bed" (250 inn visits) and "Feel the divine touch" (100 god revivals, heals and hits together, a first number to tune in config.js). Finding an eagle in the cave now unlocks "Why this animal is here?" (it never did), and the namesake check ignores capital letters, so a typed "Gandalf" can match a random "gandalf".
- Achievement rarities re-set from the new odds estimate: Common now includes "The last of their kind" and "Shaaaaame on you"; "A new king", "The return of the king", "Atheist!" and "Someone is throwing rocks" are Rare; the chest and pot hunts are Epic; the inn is Legendary; the librarian is Mythic.
- Dev tool: `tools/odds.py` estimates in a second how many players would ever earn each achievement, counting that players leave the game at random (the longer an achievement takes, the fewer reach it), and suggests a rarity tier. Playtests now save the data it needs.

- Achievement pictures are now layers: one parchment frame, the picture alone, and a wax seal whose design grows fancier with the tier (plain grey Common up to the golden, rayed Divine). "Aren't you extinct?" has its picture (the Capricor climbing out of its grave).

- Achievements now have a rarity, shown as a coloured tag after the title: Common (grey), Uncommon (green), Rare (blue), Epic (purple), Legendary (orange), Mythic (red), Ancient (teal) and Divine (gold, sparkling). Mythic and Ancient have none yet. The playtest summary now lists how often each achievement is earned.

- New achievement "Aren't you extinct?": kill the "last" Capricor again with a later wizard (the Capricor comes back with each new wizard). Its picture is still to be drawn.
- A new wizard's Achievements scroll now says there are none yet instead of staying blank.
- Faith scroll: the belief window no longer opens gigantic and then shrinks; it is sized right from the first moment.
- Achievements scroll: each entry has more breathing room (space above and below, a wider gap between icon and text, and a little air before the date), so the list no longer looks cramped.
- Achievements: each wizard now takes his achievements to the cemetery. Once a dead wizard has earned some, the Achievements scroll gets two ribbons: this wizard's page and an "Other wizards" page whose entries say "Earned by: <name>". With no dead wizard earning anything it stays one page with no ribbons.
- Faith scroll: the stained-glass belief window is much bigger, about 75% of the page width (in whole pixel steps so the art stays sharp), and the gap between the Faith title and the window is smaller.
- Scroll pages now switch with small one-colour ribbon bookmarks hanging from the scroll's top left, each with an icon (kill, cemetery, bestiary; stats, inventory); the ribbon is the banner style (dark wine, a thin gold band with a pin, swallowtail cut), the open page's ribbon hangs lower, and tapping one plays the scroll sound. They replace the paper strips with page names.
- Faith scroll: its stats are grouped under subtitles like the Stats page (Where faith came from, Shrines, Your touches), one line each, still on one page.
- Faith scroll: the glass arc now sits right under the title; the "Faith now" number moved to the Stats page (Gold and faith). The belief level name is back in the readable normal font (bold, between two stars, coloured by level), and a real gap follows it before the stats; the page's zero-margin rule had been eating the gap.
- Faith scroll: the belief level name is now written in the title font, in spaced capitals between two small stars, coloured by level (gold-brown for Devout, greying down to Atheist, red for Lost), with more room below it before the stats.
- Faith scroll: the stained-glass belief meter is now really centred; the page style that zeroes every div margin was overriding its auto margins, so it sat at the left.
- Faith scroll, plainer: back to the normal scroll (no gold-leaf border, no candle by the title); the header ornament moved to the bottom; the belief arc sits centred with room above and below; no belief number is shown, only the level name (or Lost) under the arc.
- Dev tools: tools/synth_demo.html plays one short tune two ways, with a plain browser synth and with real instrument samples, to decide how we make our own music.

- Faith scroll: the gold-leaf border now sits inside the parchment on all four sides; before, it added its own width and stuck out on the right and bottom.
- The Faith scroll has its new look: a gold-leaf border and a header ornament (only on this scroll), and the belief meter is now a stained-glass window whose light fills up to his belief, with a marker on the ring and a flickering candle for his level (cold wax when belief is lost); a small candle icon sits by the title. The glass flares when belief rises and dims when it falls.
- Dev tools, Sounds mode: "Save to file" now always writes the sound details (sound, settings, verdict) into the note; before, they only went in after "Capture moment", so an approval saved without capturing came out as an empty note.
- Enemy moves have their own sounds, at their own moment: the Ent's thud, the Elf's arrow, the horn charges' hooves, the Orc's and Warrior's swings, the Ogre's smash, the Imp's bite; and the bosses' moves (Protromus, Kkck, Bicaptop, Cuboq, Infraespectro's curse, Doria's boom and rune circle). Medusa's stone grinds as it climbs and cracks when he breaks free, and the Swamp hydra's regrowth squelches.
- The bosses' other moves have their own sounds at their own moment (Midas, Rojo, Cuboq, Skeleton, Rainbow, Fenix, Protromus, Goro, Infraespectro, Herbus, Arcangel, Etymos), and the Golem's slam. Midas's golden rays and the Skeleton's curse silence their spell's school sound; a sound that starts before its move (the curse, the spores) holds the move back a moment.
- Inventory: the items show in a grid, each in its own square slot (staff, gold with its amount in the corner, then the artefacts); hover a slot for its name.
- The stats scroll has a second page, Inventory (a strip above it, like the kill scroll's): for now the staff (drawn by his tier: five designs, the artist's icons), his gold and any artefact he has found, such as the mirror shield or the gorgon's-eye amulet. The prayer button (next to the map) opens a Faith scroll: faith now, the belief level with a meter bar (ticks at the Atheist, Doubter and Devout lines) and where faith came from; the Faith section left the Stats page.
- Texts dev mode: the eight away poems are listed (Dreams drop, "Away poems"), shown over the dark and playable.
- A wizard who dies for good while the god is away gets a poem, one of eight that never repeat in one world, shown softly over the dark scene (title, then the lines) before the next wizard begins; the fallen line now names the zone he lies in.
- Dev tools: a hidden or minimized window behaves as in the live game: the game waits while it is hidden and, after a long absence, settles the time away on return.
- Time away: a wizard found fallen after a long absence now stays down, even after a reload or a second visit; only the god's touch lifts him, and the hours he lay there keep adding up toward his death. Chapters VI, VIII, X and XI protect him: no fall and no death from absence there (faith and gold still drift).

## 2.2.0 — 2026-11-18

- The XP bar has a gilt frame (gold rules, diamond knobs, a ticked gold fill) on a white plate that also holds the level, HP, gold and faith line in dark text, instead of the plain white bar; each icon sits by its number.
- The mother hydra now leaves with a dive: she sinks among ripple rings, and a crown of mud splashes up as her head goes under.
- Risers come out of the ground, and sink back into it, in the artist's new ground effects (cracked hole, soil burst, dust plume, sinkhole; a random one each time, a bigger set for the 64 px bosses) instead of the small dust puff; the sprite rises with the effect's frames. The hydras (mother, icedra, hydskon) leave by sinking into their own mud pool, ice spikes or bone heap.
- Hydra entrances have their own sounds (mud, ice, bones), each with a burst as the hydra shows; the generic hydra sound now plays only when a head regrows.
- Tools: tools/to_ogg.py turns mp3, wav or flac files (or a whole folder) into the game's .ogg files (mono, game names, the same quality as the cut sounds).
- Fixed: chapters show at their own levels: Chapter IV at 90, IX at 160, X at 190, XI at 200 (v1 key typos had IX and X replacing levels 60 and 90, and XI never came).
- Two chapters reached close together each get their own scroll, one after the other; the game resumes after the last.
- Sounds mode: a line under the verdict box reminds how to record a verdict (Capture moment, optional comment, Save to file).
- Fixed: after a partial rest the wizard no longer says he "feels totally renewed"; that line is kept for a full recovery.
- When the wizard falls, the enemy leaves the way it came, backwards: walkers turn and walk off, fliers fly away, risers sink into the ground, mages fade out, the portal bosses go back through their portal.
- Boss entrances: King Skeleton fades in inside his cursed skull arch, which then crumbles away; Herbus grows out of braided vines; kkck pushes up a bump of dirt and bursts out of it; Goro, Protromus and Bicaptop slam down from a leap, Rojo in a burst of fire; Cuboq bounces in; Etymos floats in; Medusa slithers.
- The enemy that fells the wizard finishes its attack and its spell before it leaves.
- The killing blow takes the wizard's last HP when it lands (a boss's scene spell reaching him, a strike hitting), and he falls then, not before the attack starts; the game waits for that blow.
- Bestiary: the Bosses heading shows only once the first boss is met, and Secrets only once the first hydra is found.
- The Kill button asks twice: the first press opens a small parchment saying to press again, that it is permanent; tapping the parchment closes it.
- The mysterious healer leaves by fading away (the mages' fade-in played backwards), with his red pin animation played over it.
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
- Dev: lighter notes: ideas.md is a short index, idea text sits by topic in docs/ideas/, decisions in docs/DECISIONS.md, one notes inbox per role; the approved boss and hydra sounds are recorded in SOUNDS.md and gone from the dev tools' "needs a sound" list.
- A file map, docs/MAP.md: what every file does, how the parts connect, media and dev-tools rules, for anyone starting work.
- Wizard animations from the artist: casting (with a spark by school, or a staff slash), walking, praying, falling, true death, turned to stone and breaking free, at every tier.
- Fallen and dead poses: a fallen wizard sits with a skull above him until revived; a true death shows the dead pose; the dead wizard lies face down, hair only, at every tier.
- Hands down at every tier: the raised hand that held the flame is lowered, so each wizard rests with both hands down; the flame now shows only in the cast animation, held in the lowered hand.
- The wizard walks: to finds and statues, out of one scene and into the next, through doors, and to the street door of inns and dice houses in the Town and the City before going in.
- Shrines, statues and inns outside the towns are entered on foot; scene changes fade more slowly.
- Shrines: the wizard stops a little before the cross, the shrine sound plays once he is inside, and the mystic stays while he walks away.
- Loot: the wizard walks up to the bag, barrel, box, chest or pot before opening it, then walks on.
- Sleeping: the dark and the dream stay over the scene when a scroll opens or closes.
- Each achievement shows when it was won, in small grey text.
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
- Stats scroll: a curated stats page.
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
