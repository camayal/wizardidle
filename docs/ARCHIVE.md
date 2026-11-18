# Archive

Finished work moved out of the working files (journal entries, done or dropped ideas,
fixed bugs, approved sounds and art), so those files stay small. Append only: add with a
simple `cat >>`, never read or edit it as part of normal work.

## 2026-11-14 from ideas.md: done or dropped ideas

- ~~Link to the legacy version from inside the game (help or stats scroll).~~ *Dropped 2026-11-10:* the author decided there's no link to `/legacy/` from the game or the README.
- ~~Fix the typos in player-facing text.~~ *Done by dev in phase 4 (2.0.0):* fourteen kinds of typos fixed ("the Grute" → "the Grotto", "shire" → "shrine", "restauration" → "restoration", …). See CHANGELOG.md.
- ~~Publishing: would `wizardidle-old-ideas/` and `tools/` go live with the site?~~ **Resolved 2026-11-10:** the author keeps both **local only**. They're untracked on `dev` and listed in `.gitignore`, and the files stay on disk in the main checkout.
- ~~Professions: keep the old trio (Alchemy, Enchanting, Writing) and the 15 recipes, or rethink them? What should each item actually do (e.g. teleportation scroll ↔ map rework, divine binding ↔ faith)? Does the wizard pick one himself (free will) or does the player choose? One at a time or several, with their own levels? What do they produce: gold, faith, items, spell boosts? Do they tie into the faith rebalance or atheism?~~ **Decided 2026-11-11:** see "Decisions" in [docs/PROFESSIONS.md](docs/PROFESSIONS.md); a few smaller questions remain there.
- ~~Should the dev console (`exe()`, unlocked by clicking name → level → faith icon) stay in v2 as a secret, or move behind a debug flag?~~ **Decided 2026-11-12:** behind a flag: the dev test bar (`src/dev/tests.js`), on while developing, switched off by the deploy.

## 2026-11-14 from ideas.md: journal entries up to 2026-11-13

### 2026-11-13: Enemies arrive their own way
- The author's playtest notes ("flying enemies arrive from the air, floating ones float in, those that hide jump into the scene, underground creatures come out of the ground"), done with code on the plain sprites as the author asked, no new art: `src/ui/entrances.js`. Six ways by family: **fly** (angelicus, demon, dragus; arcangel, fenix) glides down from the upper right with wingbeats and lands; **float** (spectre, ether, eye, elemental, infraespectro) drifts in, fading in and bobbing; **rise** (slime, polypoid, ent, umigubi, mummy, skeleton, the hydras) pushes up out of the ground line with dust; **jump** (rogues, imp, creatures, shortie, elf, amazon) leaps in on an arc and lands squashed with dust; **blink** (wizards, wizardesses, vampire) flickers in, opening from a line; everyone else **walks** in from the right with steps. Bosses and new hydra encounters too (a growing head keeps its own animation).
- The game waits while it arrives (about 0.9 s); it waits for the sprite to load first, so a first-time sprite isn't skipped. Nothing plays in a simulation or in the background.
- Dev bar: "Fight now: arrives ..." for each of the six.
- No art asked for now; real run or flight strips from the artist could replace the math later for some families.
- Tests: real-browser frames of all six; gameplay suite 0 errors.

### 2026-11-13: He stops at the door before going in
- The author (playtest notes, then "doors outside too"): before entering an inn or a dice house in the Town or the City, he walks to the street that shows its door (if he isn't on it), walks to the door, stops a moment (0.4 s), then the fade takes him inside. The doors were already in the street art: the Town's open doorways (stages 4 and 5), the City's saloon doors by the beer poster (stage 4) and the door by the dice sign (stage 1). `STREET_DOORS` in render.js; no art needed. Simulations and the page in the background go straight in, as before.
- Tests: real-browser trace of the Town inn (street, doorway, stop, inside, sleep, out); gameplay suite 0 errors.

### 2026-11-13: Belief levels: two meters (decision)
- From the author's playtest notes, the author chose **two meters**: faith stays the currency the god spends; belief becomes its own bounded meter moved by moments (a critical heal or the final blow a lot, normal touches a little, leaving him to revive alone a lot down), the four levels read from it, and the story can lock it at "lost" (a symbol, not -inf). Recorded in docs/FAITH.md Decisions; the planner details weights, bounds and what counts as critical before it is built.

### 2026-11-13: Sleep and dreams (docs/SLEEP.md), first version
- The planner's sleep plan, asked for by the author: when he rests he walks to his bed or to the sleeping bag, the sleep spell plays, the scene fades to dark (about 2 s), and when tonight has a dream its 1-3 lines appear softly over the dark one after the other (pale for dreams, reddish for nightmares) and stay in the console; then it fades back and he wakes as before (camping: he walks back from the bag).
- Dreams: a story dream on the first rest after a fall or a chapter (`run.storyDream`); otherwise `config.balance.dreamChance` (0.15, to decide: "how rare" is open) of a random dream or nightmare, nightmares more likely when faith is not positive (until belief levels exist). Pure story: picked with the looks' random, only when drawn, no effect on play; simulations unchanged. Stats: `sleep.inn`, `sleep.camping`, `dream.story`, `dream.random`, `nightmare.random`.
- STAND-INS until the art and the story script: the inns have no beds, so he goes to the Town inn's door to the rooms, a free spot in the City inn, the Desert inn's carpet; he doesn't lie down (no sleeping pose yet); the dream lines in `src/data/dreams.js` are placeholders for the story script. Asks for the artist: beds in the inn backgrounds (or a bed sprite), the wizard lying in bed / in the sleeping bag, optional faint dream images.
- Dev bar: "Sleep: Town inn, with a dream" and "Sleep: camping, with a dream".
- Tests: real-browser capture of the camping scene (walk, dark, the fall dream over the dark, wake, walk back); gameplay suite 0 errors; seeded simulation runs fine.

### 2026-11-13: Into a shrine on foot
- The author: entering a shrine should be a walk, like a change of scene, not a fade. Every place without a door (shrines, statues, inns outside the towns) now works that way: he walks out to the right, the place appears, he walks in from the left (`enterPlace`). Places with a door keep the fade and the door; waking up in the healer's cabin keeps its plain fade (`fade = true`). When he is already in the place (back to the same shrine), only who is there changes, with no walk.
- Tests: real-browser trace of the shrine scenario (out, into the shrine with the mystic, the offering, out again); gameplay suite 0 errors.

### 2026-11-13: Sounds for the new attacks: what to reuse, what to find
- The author asked which sounds can be reused for the new attacks and which to find: `docs/SOUNDS.md`. Today every attack plays only its spell's school sound when the blow lands, so long animations are silent until the end. Twelve existing files can cover most moves and scene spells (by name and length; the author confirms by ear); ten are to find (thud, rumble, bow, hooves, roll, roar, squelch, wind, stone, bite). Nothing wired yet: waiting for the author's choice.

### 2026-11-13: Hydras: their wounds stay, a word on the heads
- The author: a hydra doesn't heal from one battle to the next, only when a new head grows. When the wizard falls against a hydra, the share of its HP left is kept (`state.hydraHealth`); the next encounter with that hydra starts with that share of its new HP ("The hydra still bears the wounds of their last battle"). A growing head brings its HP back in full, and killing it forgets the wound. The share (not the HP) is kept so a wound from many levels ago still means something.
- The author: short info on the heads. When a head grows: "Each head cut off grows back with more life: 3 of 5 heads", or at the last head "the next one cut off is for good". The bestiary's Secrets section explains it in one line once a hydra has been met.
- Gameplay change from the author's own rule (no new number). Tests: a real-browser run (wounded at 36%, back at 36% next fight, full again after a head grew).

### 2026-11-13: The revive in order: rings, fade, cabin
- Bug (the author): the divine rings of a revive played over the wizard already standing and the fade started at once. Now the rings play over him where he fell (the game frozen for 0.65 s), then the fade, then he is in the healer's cabin, and the cabin's event starts after the fade. In a simulation or in the background it goes straight to the cabin, as before.
- Tests: a real-browser capture over 3 s (rings over the fallen pose, the dark, the cabin, "wakes up perplexed").

### 2026-11-13: Author's playtest notes: stray lines and flicker
- Bug (the author): two lines of pixels by the fallen wizard, left and bottom. Each spell effect drew one step past its last frame to "leave the canvas clear"; 6 sheets have spare cells, and many have pixels in their 1-px gutters, so a sliver (or a whole spare cell) could stay on the spell canvas. The last step now only clears, and each frame is copied out at 1:1 before scaling, so no neighbour cell or gutter is sampled.
- Bug (the author): flicker when animations change. The wizard, his poses and the enemy wiped their canvas before the new image was ready, so an image not yet cached left a blank frame. They now clear only when the image is ready (and a late image for an enemy that is gone is not drawn). Animation strips (wizard, walk, hydras, bosses, enemy moves) also use the 1:1 copy (`drawFrame` in render.js).
- Tests: the gameplay suite, 0 errors (it caught a first try that used the copy canvas before it existed); a real-browser close-up of the fallen pose, clean. Visual only: simulations unchanged.

### 2026-11-13: Medusa's artefacts in the game
- The artist's two artefacts (approved by the author) are the rare find against Medusa's gaze: a mirror shield or a gorgon's-eye amulet (which one is for the looks), drawn where the find twinkle was, the size of a book, and named in the text ("finds a gorgon's-eye amulet!", "takes the ... and continues").

### 2026-11-13: Boss effects built
- The planner's "Boss effects" (docs/SCENE_SPELLS.md) are in the game (`src/bossEffects.js`, numbers in `config.balance` to tune): Medusa's gaze turns him to stone for 2 turns, 1 in 4 gazes (she hits freely; he breaks free after); after his first stone, 1 find in 20 is the mirror shield that makes him immune for good (art asked from the artist); King Midas's golden rays heal him 15% of his max HP at most twice per fight, and the god's touch while they spin stops the heal; the blizzard (Rainbow) makes him skip his next attack half of the time, the earthquake (Protromus) makes his next spell miss half of the time, the poison cloud (Kkck) hurts him 4% of his max HP for 2 turns.
- The boss's attack now follows from the spell the game picks (its place in the zone's list), so the effects are part of the game and the simulations play them; the looks play that same attack. The stone ends when the game says (no more 2.5 s timer).
- Playtest `docs/playtests/2026-11-13-boss-effects` vs the baseline: pace barely changes (idle ~41 h, active ~16 h to level 200), since bosses are rare (1.5% of fights). With bosses at 50% in test runs every effect fires; the artefact came after 1-3 stones each time.

### 2026-11-13: Dev bar: real fights instead of drawn previews
- Bug (the author): the boss, hydra and enemy previews drew the creature on top of whatever fight was running. They are now **"Fight now"** actions: the current event ends (every clock stops, the fight and the scene are cleared, the wizard is back in his place at full HP) and a real fight starts with the game's own code (forced event and chances, like the scenarios, but without a reload): 5 bosses, the 3 hydras, and one enemy for each attack move. The two hydra growth previews reset the scene first.

### 2026-11-13: Hydra attacks and weaving heads
- Merged the artist's hydra art (approved by the author) and wired it: while a hydra is on screen its heads weave (idle strip for its head count); it attacks with a strike (the front heads bite) or, half of the time when its spell has one, a cast with a scene spell from frame 5: the Swamp mother's poison rain, poison cloud or earth spikes, the Dunes hydra's curse, fire rain or fire tornado, the ice hydra's new frost breath, blizzard or ice spikes. A new head still grows in with its animation, then the weaving goes on at the new size. The strike or cast is picked for the looks only (never the game's random).

### 2026-11-13: Hydra attacks and moving heads (artist)

- The author asked for hydra attacks (some ordinary, some scene spells) and heads that move. Tried three head motions (sway, bob, weave); **the author chose weave**: each head traces a small circle, out of step, bending from where its neck meets the body.
- For every head stage of the three hydras: idle (weave), strike (the heads lunge in turn and bite: venom for mother, dark sparks for hydskon, frost shards for icedra) and cast (heads rear up glowing, then thrust into a scene spell). Scene spells match each hydra's spells: mother poison rain, poison cloud, earth spikes; hydskon curse, fire rain, fire tornado; icedra a new frost breath, blizzard, ice spikes.
- Added to the review page (`wizardidle-old-ideas/tools/boss_review/index.html`, "Hydras" section). The author approved them all and they were sent to dev.

### 2026-11-13: Scene transitions (option B) and a scene director
- The author found scene changes unreliable (shrines, for example). Review: 12 scene changes behaved differently (some walked, most snapped), walks ran on their own clock while events kept going every 1.5 s (zone changes jumped, the next event could start mid-walk), and nothing kept transitions from overlapping.
- Chosen: **B, walk for travel, fade for places**. Every scene change goes through one place in `ui/render.js`: he walks out right and in from the left when he goes somewhere (the plain walk to the next spot, leaving a shrine, a find or a statue, changing zone); a quick fade brings a place around him (shrine, inn, dice house, the healer's cabin, a statue's scene); places with a door (both dice houses, the Town and City inns) have him come in and go out through it (a door table of scene x positions).
- While a transition plays the game's clocks wait (`loop.freezeGame`/`thawGame`), so events never overlap it. In a simulation nothing is drawn and everything happens at once in the same order: seeded runs unchanged.
- Fixed on the way: backgrounds no longer flash the page behind while the new image loads (the old one stays until the new has loaded; a fade holds the dark until the place is ready, 5 s at most); an animation no longer wipes the wizard before its first frame is ready (he went blank while praying until the strip arrived); his strips and poses for the tier are preloaded.
- The author's plan for later: more dynamic scenes (walking with background layers scrolling right to left). That needs layered art per zone; the director is where it would replace the walk out and in.

### 2026-11-13: Walking through scene changes; capricor in the bestiary
- The author found the walk back after a find cut off by the scene change. Now, when he leaves a find or a statue, he walks on out of the scene to the right, the scene changes to another spot of the zone, and he walks in from the left to his place; changing zone works the same way (walks out, the new zone appears, walks in). Walking is faster (16 sprite px a frame). The new spot is for the looks only: a simulation keeps its stage, so seeded runs are unchanged.
- Bug (the author): a defeated capricor didn't show in the bestiary. The last capricor's death takes it off the Forest's enemy list, and the bestiary built its families from those lists; it now takes them as they are when the game loads.
- Stress-test levels looked low; a side-by-side 30-minute run of the code before today (level 88, 18 fights) and now (level 72, 19 fights) shows the same pace: earlier higher levels came from runs cut off by the real-time limit, measured differently.

### 2026-11-13: Planner items

- Belief, after the first playtest (an idle wizard was an Atheist for good before level 25): a way back decided (passing shrines +0.5, close calls +1, getting up alone −1 once a Doubter or Atheist); the god's super-critic is 1 in 10 of his critics at ×16. Sleep plan: no beds.
- Belief meter detailed (FAITH.md 3.1, the author's choices): −100 to +100, start +20, levels at +60 / 0 / −60 with a 10-point margin; critical moments and starting weights; the god's touch may now kill (the final blow).
- Scenes plan: the street doors (`STREET_DOORS`) are the first fixed door landmarks; enemy entrance paths stay free of props.
- Scenes plan written (`docs/SCENES.md`) from the author's decisions: scenes composed from his layers, a finite seeded world (about 100 of 300 variants), three tiers joined by stairs and cave mouths, visible exits with a god nudge, light and weather from game time. Checked the art: every layer file already splits `Fondo` (base) and `Piso` (floor). Decided too: one map per tier (a new Heidan map), rare scenes marked quietly, engine first then art.
- Recorded the author's new races and statues (`New NPC/` in the old sprites): nagas, salamanders, yaktaurs, swamp creatures, mushrooms, chaos spawn, two hydras, the existing statues as sprites and five new statues; licence check noted.
- From the author's story review: the Tower refills with mages after the lynching (none in the City or Tower from VII to 149); the staff's true name is random (`world.staffName`), replacing "Nomaleatorio" in FAITH.md and SCENE_SPELLS.md.
- Bosses keep returning as today, except King Midas: removed forever after he dies in chapter VII (noted for dev with the Tower guard). Medusa's immunity artefact is rare.
- Boss effects decided: Medusa's stone rare plus an immunity artefact; Midas heals about 15% at most twice, interruptible by the god; blizzard, poison cloud and earthquake get one effect each (SCENE_SPELLS.md).
- Professions: gathering plays as a discovery in the scene (blink, walk, the reagent appears; bountiful harvest is a touch on it).
- Skull alert decided: it floats above the fallen wizard only while the god can still act, never over a true death (FAITH.md 3.2).
- Scene spells plan written (`docs/SCENE_SPELLS.md`): staff unlocks, super-critic, god's critics, story moments.
- Sleep plan written (`docs/SLEEP.md`): walk to the bed or sleeping bag, fade to dark; dreams are rare visions over the dark plus story nights; pure story for now.

### 2026-11-13: Boss attacks, scene spells, Medusa's stone
- Merged the artist's boss art (approved by the author): 16 bosses with 2-3 attacks each, 35 scene spells (256x64 frames over the whole scene), the petrify set for every tier. `src/data/bossAttacks.js` holds the attacks (frames, scene spell and its start frame, travel paths, Medusa's petrify frame); `src/ui/bossAttacks.js` plays them: the boss strip at its usual box (goro and bicaptop charge, kkck rolls, the king skeleton's great slash travels), the scene spell on a new layer above everyone, the earthquake shakes the scene, Medusa's gaze turns the wizard to stone (2.5 s for now, then he breaks free; the stone can't cast or walk; a fall ends it). The attack is picked at random for the looks (never the game's random). Hydras keep the hop.
- Open for the planner: how long the stone lasts and whether it costs turns; whether scene spells should have game effects.

### 2026-11-13: The level-190 freeze fixed; new baseline
- Above level 190 the guardian chance (10% of fights, guardians never written in v1) did nothing and the game stopped until a reload. Until the story adds guardians, it starts a normal fight. The dev bar scenario now checks that.
- New baseline in `docs/playtests/2026-11-13-baseline` (no freezes): idle god ~43 h to level 200, active ~16 h, much as before. Negative gold appears again in active runs (as low as -1,041): still to look into with the faith stats.

### 2026-11-13: Discoveries in the scene: blink, walk, find
- The author's idea, built: before a book or rune is found, a small twinkle appears at a random spot on the ground; the wizard walks there (walk animation) and the find lies there; the study effects play at their usual size right above it; afterwards he walks back to his place before the next event. Statues: he walks to the statue (a table of where each zone's statue stands) and the effects play over it. Shrines: no walk; the prayer sparkle appears here and there around the cross.
- The wizard can now leave his place (`ui.wizardOffset`); every drawing of him follows it. The random spot uses its own randomness (never the game's `Math.random`), so seeded simulations play exactly the same.
- Stress tests: the slow runs were the known freeze above level 190 (the empty guardian branch), caught by a new stall detector in the test page; not related to this change.

### 2026-11-12: Boss review, round 3; the wizard turned to stone (artist)

- Infraespectro's curse and arcane flare became scene spells; kkck now curls into a dung ball, rolls to the wizard, hits, jumps back and lands in its own shape; king skeleton runs in with the sword raised and swings it down into the slash.
- Drew the wizard turning to stone, staying stone, and breaking free, for all 21 tiers; medusa's gaze uses it in the review page. Noted for the planner: midas's golden rays heal him; medusa's gaze petrifies the wizard for a couple of turns (rare, or better, an artefact for immunity). Nothing sent to dev.

### 2026-11-12: Boss review, round 2 (artist)

- Applied the author's notes on every boss: 18 more boss attacks became scene spells (see "Scene spells" in the backlog); goro's four arms flail; goro and bicaptop run across the scene to ram the wizard; kkck rolls to him like a dung ball; king skeleton runs up for the great slash; cuboq bounces three times; protromus punches the ground into an earthquake; rojo's slam raises a fiery stone peak under the wizard; the last ice spike explodes; meteors, earthquake and whirlwind are stronger.
- The review page (`wizardidle-old-ideas/tools/boss_review/index.html`) is updated for the next round of comments. Noted for the planner: the scene must shake. Nothing sent to dev.

### 2026-11-12: Chargers get running frames (artist)

- For the charge across the scene: a 4-frame run cycle and a head-down ram frame for capricor and the four cowrens (`img/run_<sprite>.png`, `img/ram_<sprite>.png`), approved by the author and sent to dev. The outline change for bosses and hydras was dropped: the author likes them as they are.

### 2026-11-12: Boss attacks, scene spells, review page (artist)

- Drafted 2–3 unique attacks for each of the 16 bosses, themed on the spells each really casts (bossSpell in the zones). The ones that cover the whole scene now trigger **scene spells**: 8 used by bosses plus 8 kept for the story and other powers (see "Scene spells" in the backlog; noted for the planner, who wasn't running).
- A local review page shows every boss attack in its own zone and every scene spell over any zone, with a comment box each: `wizardidle-old-ideas/tools/boss_review/index.html`. Waiting for the author's comments; nothing in the game yet.
- The author asked that nothing be sent to dev without their approval from now on.

### 2026-11-12: The charge crosses the scene
- One stress run (of about fifteen today) stalled after the level 10 chapter; four reruns reached level 200+. Recorded in the roadmap's bugs as a likely chapter/scroll race, to investigate. The author asked to leave the outline question as is for now; boss comments go in the boss review.
- The author agreed: the horned chargers (capricor, cowrens) now paw the ground, dash across the scene to the wizard with a dust trail, hit (impact burst, shake, the spell effect), recoil and trot back (about 2 s). The artist was asked for running frames (`img/run_<sprite>.png`, 32x32 frames facing left); the code uses them automatically when they exist (mirrored for the trot back) and the standing sprite until then.

### 2026-11-12: Enemy moves matched to their weapons
- The author asked for each family's move to match the attack its sprites make; the artist drew the four missing overlays (arrow, thrust, smash, impact) with frame lists. New moves: **shoot** (elves: draw, release, the arrow flies 16 px a frame to the wizard), **thrust** (warriors, dares: spears), **smash** (ogres, dwarves, herbos, cornovits: heavy overhead weapons, then dust), **charge** (capricor, cowrens: horns, impact burst). Slash for the other sword users, pounce for beasts, slam for heavy bodies. Each family uses its most common attack; per-sprite moves could come later.

### 2026-11-12: Hydras grow their heads
- The artist's head-growth strips (approved by the author) play when a hydra grows its next head: the Dunes hydra's neck grows with a shimmer, the ice hydra's head forms in an ice block that shatters, the Swamp mother's neck rises from a green splash. 90 ms per frame, at the hydra's size and place (loadNPC's size rules are now `npcBox()`, shared by both).

### 2026-11-12: Enemy attack moves; the wizard's spark by school
- Asked by the author via the artist: normal enemies no longer hop. Their plain sprite moves by code (`src/ui/enemyMoves.js`, from the artist's reference): **slash** (weapon users), **pounce** (beasts), **slam** (heavy bodies), or **cast** with the spark of their spell's school for casters (from the sprite's type); a reusable overlay (spark, slash, bite, dust) plays in front, and when the blow lands the game's spell effect plays on the wizard. Bosses and hydras keep the hop until they get their own animations. Polymorphed enemies (sheep, chicken) pounce.
- Move per family, decided by dev from the sprites (to review with the author): pounce for creatures, capricor, imps and pybryas; slam for ents, umigubis, golems, mummies and rock men; slash for the other 28 melee families.
- The wizard's cast now shows what he casts: the spark of the spell's school at the staff tip on the glint frames (found from each tier's art), a mirrored weapon slash for staff hits, the plain glint for heals and other non-attacks.

### 2026-11-12: Hydras in the bestiary; a no-cache local server
- Bestiary: a hydra shows as it is now (its picture grows with each head cut off), or after it was defeated, as the most heads it ever had (new record `hydra.maxHeads.<hydra>`). Pictures keep their proportions (the swamp hydra is taller than wide).
- The author couldn't test some animations: most likely the browser reused old code files, because `python -m http.server` sends no cache rules. New `tools/serve.py` serves the game with `Cache-Control: no-store` (`python tools/serve.py`, then http://localhost:8000).

### 2026-11-12: Wizard animations, fallen and true-death poses; Volcano boss fixed
- Merged the artist's animation strips (21 tiers each) and wired them (`playWizardAnim()` in `ui/render.js`, on the animPJ clock; any normal redraw stops them): **cast** on every attack (the author's choice, replaces the hop), **walk** on the plain walk and when changing zone, **pray** at shrines (frames 3-5 loop until he leaves), **fall** when he falls in battle, then the **fallen** pose with the **skull above his head** (half size, the artist's spot) until he is revived, and the **true death** (fall_dead, then the dead pose) when the player kills him with the kill button, before the page reloads. The story's permadeath comes with the faith rebalance.
- The dev bar can preview each animation. The old hop and the skull-as-body drawing are gone.
- v1 bug found by the stress tests: the Volcano boss (`fenix`) had no entry in the enemy families, so a boss fight there crashed and the game stopped until a reload (the simulation counted it as a freeze). Added the entry.

### 2026-11-12: Bestiary secrets; stale code while testing
- Bestiary: the hydras are secret characters, so their section is "Secrets", shown from the start as ink stains labelled "Secret" until met. Only enemies are listed (never the healer). The total no longer counts two old sprite families that live in no zone (`la_guerrera`, `la_pilla`).
- The author still saw the scroll text run long on open, fixed after interacting: that is how the code behaved before the fix, so the browser most likely ran stale code. Real-time captures (driving Edge through its debugging protocol) at desktop, big-monitor and phone sizes show the right size after the opening animation. Two fixes against stale code: the offline worker now re-checks code files with the server every time (`cache: 'no-cache'`), so players also get new code right after a release; and while developing (`DEV`) no offline worker is installed (an old one is removed).

### 2026-11-12: Kill scroll: Kill / Cemetery / Bestiary
- The author asked for the kill scroll as tabbed scrolls, with a bestiary. The tab code is now shared: Stats / Records, and Kill / Cemetery / Bestiary (two strips stacked above the front scroll).
- **Cemetery** gets its own page; entries now say how many victories and falls the wizard had (for wizards killed from now on).
- **Bestiary** (layout A from three mockups): families he has met, every sprite with how many he defeated (★ = rare); never defeated as an **ink stain** (grainy dotted shape with a ragged rim, chosen from three silhouette mockups), drawn in the browser from the sprite itself. Bosses and hydras have their own sections; "X of 632 creatures discovered" on top.
- New stats for it: `kill.sprite.<sprite>`, `kill.boss.<boss>`, `kill.hydra.<hydra>` (start counting now).
- Then (the author): a creature shows as soon as he **sees** it, and the number counts defeats (0 until the first). New stats `seen.sprite.<sprite>`, `seen.boss.<boss>`, `seen.hydra.<hydra>`; the header reads "X of 632 creatures seen, Y defeated".

### 2026-11-12: Wizard animations (artist)

- The author asked for five animations: fall to sitting, fall to lying (permadeath), moving the staff (also for casting), dropping the staff to pray, and walking. Drafted on tier 0, the author asked for polish, then all tiers.
- Made all five for every tier as frame strips (32×32 frames side by side, for the 100 ms animation clock): `img/anim_cast<tier>.png` (7 frames), `anim_walk` (4, loop), `anim_fall_sit` (6, ends on `fallen<tier>`), `anim_fall_dead` (6, ends on `dead<tier>`), `anim_pray` (6; frames 3–5 can loop). Built from each tier's own sprite (staff, gripping hand, body), so the style matches.
- Known: tiers with the staff on the right end the sitting fall with the staff on the left (the approved sitting pose), so it jumps across on the last frames.
- Previews (local only): `wizardidle-old-ideas/tools/anim/out/` (GIFs for tier 0, a board per tier; review GIFs of every tier in `review/`) and the generator `anim.py`. Not wired into the game yet.
- Fixed after the author's review: in the pray loop only the head bows; the body no longer bobs.

### 2026-11-12: Crisp pixels; scroll text overflow fixed
- The author chose crisp pixels: images are enlarged as sharp squares instead of blurred (`image-rendering: pixelated` on images and the scene, `imageSmoothingEnabled = false` on the canvases). No image files changed. The dev bar has "Crisp pixels on / off" to compare.
- Bug (found by the author): on the stats scroll the text ran past the bottom roll over the scene. The layout redoes the scroll right after it opens (and on resize), which reset the front scroll's height until the next stats refresh. The layout now announces it (`wizardidle:layout`) and the tab refits at once.

### 2026-11-12: Stats scroll tabs built (option a)
- Merged `artist/art` (fallen and dead sprites, not wired yet; the shaded scroll art). Removed a worktree path from the artist's journal line.
- The stats scroll's other page now lies behind and peeks out above (the back roll and a strip of shaded paper with the page name, Pixeled, #462808); clicking it swaps Stats and Records. The front scroll, with the close button, moves down by the strip (0.092 of the scroll width) and gets shorter by the same, so the bottom roll stays put. Only on the stats scroll; the plain "Stats · Records" text line is gone.

### 2026-11-12: Sprite sheets measured, decided against for now
- The author asked whether to convert the ~1,000 images into sheets. Measured: 1,008 images, 2.25 MB (the 679 sprites of 32x32 are 262 KB; the 117 backgrounds are half the bytes). Sheets don't save space (one sheet of the 679 sprites is ~310 KB), they save requests: from the live site, 679 files took ~4 s (6-7 s with 6 connections) vs ~0.2 s for the same bytes in 5 files. That cost is paid at the first visit and after every release (the offline copy re-downloads everything); during play images come from the cache.
- With the game's smoothing on, sprites drawn from a sheet differ at the edges; with smoothing off they match exactly. Smoothing off also looks sharper (`wizardidle-old-ideas/tools/sheets-test/smooth_vs_crisp.png`).
- **Decided:** keep separate sprites, because editing art in sheets would be a bottleneck; only animations are sheets. Possible later: a script that packs sheets at deploy from the separate files (art stays editable), if downloads become a problem.

### 2026-11-12: Author's playtest of stage 3a
- Everything tested fine on localhost. Notes: the dev bar can now be hidden and shown from Help > Developer tools (only while developing; remembered per browser).
- Stats: the author likes Records, and wants real tabs: two scrolls, one behind the other, offset at the top or to the side so the back one shows. Asked the artist for mockups of both versions; dev builds it after the author picks.
- Simulation mode: the author isn't sure yet that it works as intended; to check together later.
- Next: the author's ideas about how sprites are drawn (opinion and tests first).

### 2026-11-12: Stats scroll: curated page and Records
- Built mockups of three options with a simulated level-120 wizard and three earlier ones (local preview in `wizardidle-old-ideas/tools/stats-preview/`). The author chose **A + B**.
- **Stats** (curated): Wizard, Battles, Magic, Travels, Gold, Faith, Achievements, about 35 lines; totals instead of long lists (enemies defeated with rare, bosses defeated of met, favourite school and zone, zones visited of 16, critical hit %, your touches in one line).
- **Records** (tab in the same scroll): this wizard's bests (longest streak, biggest hit, most faith at once, richest; the last three are new records), firsts, a chart of hours played per level, numbers across all wizards, and a Hall of wizards. Records now keep the wizard's name; cemetery entries keep kills and falls.
- v1 bug gone with the old page: "Magical attacks" showed NaN past 1,000 attacks (it subtracted numbers already formatted as "2.35k").

### 2026-11-12: Stats module, simulation mode, god bots, runner, baseline
- **Stats** (`src/stats.js`): counters, totals, records and firsts, per wizard (`state.stats`) and per world (`world.stats`); all 55 old counters renamed to dotted names (no migration); one history line per level. Stats, achievements, help and kill pages byte-identical before and after.
- **Simulation mode** (`?sim=1`, `src/dev/sim.js`): the loop jumps to the next due clock on a virtual clock (`loop.now()`), `Math.random` is seeded, sound, spell animations, hops and drawing are skipped (the logic inside the drawing functions still runs), nothing is read from or written to the saves. The self-revive is now a loop clock instead of a `setTimeout`. A seed always plays the same run; a level-200 run takes about 2 real seconds.
- **God bots** (`src/dev/bots.js`): idle, active (revive at once, heal below 30%, tithe at shrines), or custom rules from the URL. `set=key:value` overrides config for a run; unknown keys are reported.
- **Runner** (`tools/playtest.py`, standard library only): serves the repo, runs headless Edge per setting and seed, writes `docs/playtests/<date>-<name>/summary.md` and `runs.csv`. `tools/` is kept off the live site.
- Found on the way: the enemy hop clock never stopped when no enemy was on screen (harmless for players, it flooded the simulation; now it stops). Headless browsers throttle chained `setTimeout`s, so the sim yields with a `MessageChannel`.
- **Baseline** ([docs/playtests/2026-11-12-baseline](docs/playtests/2026-11-12-baseline/summary.md)), 10 seeds each to level 200: idle god about 43 h of play (falls 570, all self-revived), active god about 16 h (falls 109). Faith ends in the millions with nothing to spend it on (the faith rebalance's starting point). The guardian freeze hits 4–18 times per run above level 190. One active run ended with negative gold (-148): something can spend more gold than he has; to look into with the faith stats.

### 2026-11-12: Faith and story agree on chapter X

- The author decided (with the story plan) the two conflicts between FAITH.md and STORY.md: no afterlife gods in the death mechanics; the Last Escape scroll stays, written by the wizard himself at X and burnt at Heidan in XI; after that the reforged staff raises him. Rule: a true death only while the god can click to revive; where the story removes the click, the story protects him. FAITH.md 3.7 and the death-management entry updated.

### 2026-11-12: Stats scroll tabs, art and mockups (artist)

- Asked by the author via dev: real tabs for the Stats / Records scroll, as two scrolls, one behind the other. Two options to test: (a) the back scroll peeks out above, (b) its edge shows at the side.
- Drew the back scroll's art: `img/scrollBackUpShade.png` and `img/scrollBackCenterShade.png` (the same paper in warm shadow), plus `img/scrollShadowV.png` / `scrollShadowH.png` (a hard 2 px shadow from the front scroll).
- Mockups at 400×760 with the game fonts, offsets and swap notes: `wizardidle-old-ideas/tools/scroll_tabs/` (local only: `out/mockups_board.png`, `NOTES.md`, `make_tabs.py`). **The author picked (a)**, with the close button on the front scroll; dev builds it for the next version.

### 2026-11-12: Fallen and dead wizard sprites drawn (artist)

- Dev handed over the fallen sprite. A first kneeling version (all 21 tiers) didn't meet the author's standard and was replaced.
- Drew five poses on tier 0 by hand; the author picked two: **sitting slumped** for a fall and **flat on his back** for permadeath. The skull stays as a sign that the wizard needs attention.
- Made both for all 21 tiers: `img/fallen0…200.png` and `img/dead0…200.png` (32×32), hand-drawn bodies recoloured per tier, with each tier's own staff (slanted, ornament upright), hair, skin and crown.
- Generator and previews are local only, in `wizardidle-old-ideas/tools/fallen/artist/` (`make_fallen2.py`, `poses/`, `sheet2.png`, `preview_B_E.png`). Next: dev wires them in; the planner designs when the skull shows. No planner session was running, so the two decisions are noted in the backlog entry.

### 2026-11-12: New session: artist

- The author started an **artist** session: it draws and edits pixel-art sprites, UI tiles and backgrounds in the game's existing style, and hands them to dev to wire into the game. It works on the `artist/art` branch (off `dev`); finished PNGs go in `img/` there and are merged into `dev` when the author says so. Working files (.pdn, drafts) stay outside the repo in `wizardidle-old-ideas/`.
- First job waiting for it: the final art of the fallen wizard (a collapsed pose per tier), see "A fallen wizard sprite instead of the skull".

### 2026-11-12: Erasure plan

- Wrote `docs/ERASURE.md` for the "god wins" ending (asked by the author with the story plan): each erasure leaves a soul that helps the next wizard in the final battle.
- The author decided: souls that act, one per erasure capped at 5, turn order wizard → souls → god, only in the final battle, no faith change. Open: a soul's strength, entrance, déjà vu lines, the museum.

### 2026-11-12: Fallen wizard sprite searched

- Searched every art source for a wizard lying injured, to replace the skull for a fall that isn't a death (asked by the author with the story plan). None exists; recorded the closest parts and three options (rotate the tier sprites, draw a collapsed pose, one generic image) in the backlog entry "A fallen wizard sprite instead of the skull".

### 2026-11-12: 2.1.0 released; the dev test bar
- 2.1.0 released after the author's playtest: `main` fast-forwarded, tag `v2.1.0`, live site checked (version 2.1.0, worker stamped with the commit, offline list published).
- The author asked for a way to test specific criteria, like the old dev console but with a list of scenarios, on while developing and off on the live site. Built `src/dev/tests.js`: a bar at the bottom of the screen with a dropdown (12 scenarios, 6 quick actions), a Run button, a "Check:" line saying what to look at, and a command line (`dev` gives the game objects).
- A scenario saves the wizard, reloads, prepares him (level, zone, HP, gold), forces the first event and changes config chances only until that event is picked. Small hooks in the game: `run.forceOnce` (events.js), `run.forceEnemy` (combat.js), a clock speed in loop.js (also used by the self-revive), and `setLevelValues()` split out of `levelUP()`. With `DEV` false nothing changes.
- `DEV` lives in `src/config.js`; the deploy rewrites it to false (and fails if it can't), so players never load the bar.
- Found while writing scenarios: above level 190, the empty guardian branch in `enemyEV()` freezes the game on about 2% of events (also in v1). Recorded in the roadmap's v1 bugs, with a scenario that shows it.
- Tests: every scenario run headless and checked (chapter, two levels at once, boss, fall, shrine, inn, dice, level 210, hydra, rare, corrupted, guardian freeze), overrides restored after each; the full gameplay suite with the bar on; layout and pixels identical to 2.1.0 with `DEV` false.

### 2026-11-12: Idea: death management

- Added "Death management: a wizard can really die" to the backlog, in the author's words: a small chance of true death when nobody rescues him, a story line about time ("for you, god, time is nothing; for the world it is everything"), then back to the name screen. Linked from the faith plan's rescuers.

### 2026-11-12: Stats and playtest tools plan

- Wrote `docs/STATS.md`: a stats module with four kinds of stat, per-level history, data-driven achievements; a `?sim=1` fast-forward mode with a fixed seed, god bots and a JSON report; a Python runner driving headless Edge (no Node on the machine).
- Found: no playtest scripts were kept from earlier phases; the self-revive is the last `setTimeout` outside the game loop; `Math.random` is called 13 times.
- The author decided: tools in the repo; curated stats scroll plus a records page; rename every counter, old saves don't matter in the dev phase; 10 seeds to level 200 per setting.

### 2026-11-12: Faith rebalance plan

- Wrote `docs/FAITH.md`: every faith gain and loss in one unit (g = `hpBase × rGold`), what's off, and a proposal.
- Found: the god's revive is free and works at any faith (the old help said the healer charges faith); offerings and the tithe are a share of the gold he holds, so faith grows with hoarded gold; 65% of shrine events are skips; the "Atheist!" achievement is a fixed −10,000 whatever the level.
- The author decided: four belief levels that change behaviour, drifting both ways until chapter X; the revive stays free and gives a little faith, also for atheists; rescuers replace the self-revive (pagan caravan, shaman, gravedigger, ghost of a fallen wizard); the god can win back an atheist (prayer in despair, sign, dream, pilgrim, hidden blessings, rare relics); the Last Escape scroll at chapter X burns in chapter XI; offerings and every number wait for playtests with idle and active god bots.

### 2026-11-12: Professions details

- Added starting numbers (≈10 reagents per level), god-touch prices tied to the tithe rate, the vendor scene and the holy recipes to `docs/PROFESSIONS.md`.
- The author decided: trainers appear by chance in cabins and huts (the god touches the trainer to accept, the door to leave; silence → the wizard decides); holy recipes only with a blessed craft; the Volcano gets a 7th reagent (proposed: brimstone for "infernal" items made while in sin).
- Next plan: the faith rebalance.

### 2026-11-12: 2.1.0 prepared

- Version set to 2.1.0; CHANGELOG "Unreleased" became the 2.1.0 entry, player-visible changes first. Stage 2 marked done in the roadmap.
- Waiting for: the author's playtest, and reviews from the planner and historian sessions.

### 2026-11-12: Stage 2, offline list at deploy; chapter race

- The deploy workflow now writes `precache.json` (every file except legacy and docs, 1,074 today) and stamps the worker with the commit, so each deploy gets a fresh cache without editing `service-worker.js` (22 KB → 3 KB). Checked with a simulated deploy; the live site picks it up on the next merge into `main`.
- Stress runs found a v1 race: a chapter opened while a scroll was open was read again after the scroll closed, by then possibly for the next level (crash). `openHistory()` now keeps the chapter it opened. Chapter-focused stress runs (levels 25 → 126) zero errors.

### 2026-11-12: Stage 2, tidy data and medium functions

- Removed the `masterTime < 500` speed-debug branches (masterTime is a constant now, they could never run).
- Enemy data: `hasgold`, `rare`, `corrupted` are booleans instead of "true"/"1" strings; the 10 checks read naturally.
- Split `searchInn`, `doOffering`, `getBotin`, `getEnemy`, `pjBtn` into named steps; `clearNPC()` also forgets the npc (it always went together).
- Pace re-checked over 4 runs of 10 game-minutes per version: 48 vs 48 encounters, 9 vs 9 deaths.
- Noted a v1 text bug in `wakeUp()` (HP counted twice when choosing the message), recorded in the roadmap.

### 2026-11-12: Stage 2 started, the endless animations

- Measured first (10 and 30 virtual minutes, counting animation callbacks, images, sounds and console writes). The only big cost was the spell animations: up to 999 animation callbacks per second in the 10-minute baseline runs (646/s in the 30-minute comparison), growing with play time. Images, sounds and the console are small.
- Spell animations now stop after their last frame; images are cached and a late-loading image can't overwrite a newer one.
- 30-minute game: 72,329 → 3,730 animation callbacks, peak 646/s → 50/s. Wizard sprite verified pixel-identical; gameplay suite zero errors.

### 2026-11-11: Professions decided

- The author decided the plan's open questions: one trade per wizard plus a second at chapter III; the wizard asks the god for guidance (the god chooses only with faith above 0, otherwise he decides by his skills); 2 zones per reagent (to revisit); rings wear out; all four god touches ship together; the Town dice quirk is fixed with the vendors; no mana; holy recipes later; vendors as scene events; divine binding refused by atheists and burnt at chapter X. Recorded in `docs/PROFESSIONS.md`.

### 2026-11-11: Professions plan

- Wrote `docs/PROFESSIONS.md` from `Recetas.csv`, the old help and the code hooks: reagents and where they come from, one profession per wizard (the old help says "one of three"), the 15 items with effects tied to existing mechanics, level-scaled prices, new NPCs (travelling merchant, herbalist, jeweller, scribe, tavern keeper, fence), bag, stats, code plan, build order.
- Found in the recipe sheet: each profession has a base reagent (Alchemy mushroom, Enchanting gem, Writing essence) in all five recipes; two bases = price 100 / hard, one base = 50 / easy. The sheet planned 1 zone per base reagent and 3 for the others; the code has 2 each.
- Found in `exploreEV()`: the dice-house check `pDados && City || Town` sends every non-loot explore in the Town to the dice house (precedence). Not changed; noted in the plan.

### 2026-11-11: Stage 1 step 8, tidy-ups; stage 1 done

- 223 single-line concatenations became template strings (only where it can't change the text); `spell()` keeps its own animation counters instead of taking four constant arguments; `drawWizard()`, `clearNPC()` and `studyPhase()` replace repeated snippets. Stats page and all 8 layout cases verified identical.
- Player-facing typos fixed (health points, Currently, spent, enough, gaming, gamble, a hydra, polypoid...). Internal names that live in saves or file names (`sucessStudy`, `polipoide`) left as they are.
- Found a v1 performance bug: spell animations never stop and keep redrawing forever. First item of stage 2 in the roadmap.
- **Stage 1 is done.** Next: stage 2 (modern and faster).

### 2026-11-11: Stage 1 step 7, layout

- `layoutPortrait()` 225 → 88 lines and `layoutLandscapeMobile()` 127 → 51: one `setStyles(id, {...})` call per element (numbers become px), grouped by area, with the shared sizes named once.
- Verified by snapshotting every element's inline style in 8 cases (desktop and phone, normal, first visit, scroll open) for the old and new code: identical, property by property.

### 2026-11-11: Stage 1 step 6, long functions split

- `battle()` 189 → 15 lines (announce, enemy falls, defeat, rewards, wizard falls, self-revive, plus `updateLongestCombo()` / `clearFight()` that were copied in two places).
- `attackEV()` 95 → 12 lines (polymorph, critic, normal attack, enemy attack; helpers for divine spells, damage and hops).
- `updateStats()` 123 lines → one helper per section with loops for zones, containers and schools; checked to produce the exact same HTML as before from a rich test save.
- `rollDicesForSixfivefour()` 115 → 15 lines (roll, message, bank a die, show, skip; `diceImg()` for the repeated icon HTML). A dice-only test played ~80 games without errors.
- Pace against v1 checked again: same spread of levels and the same ratios of attacks, critics and heals.

### 2026-11-11: Stage 1 step 5, comments

- One short comment above each of the 95 functions; stale comments replaced (old storage API, "possible bug" note in studyEV, which was checked and is fine).
- The author's Spanish story plans in `src/story.js` translated line by line, plus the few other Spanish comments.
- Found a v1 bug in the chapter keys (`lvl60`/`lvl90` twice, `lvl99`, `lv200`); left as is to keep gameplay identical, recorded in the roadmap for stage 3.

### 2026-11-11: Stage 1 steps 1-3, var gone and helpers

- Step 1: 157 `var` statements became `const`/`let` with a scope-aware tool that only converted what provably couldn't change behavior.
- Step 2: helpers for repeated snippets (`startEvent`, `endEvent`, `nextEvent`, `showStage`, `wizardName`, `el`). The tests caught three mistakes in the replacement script (helpers calling themselves, `events.js` importing itself, a local variable named like the new `el`), fixed before pushing. The module checker now also checks that imports match exports, self-imports, duplicate names and shadowed imports.
- Step 3: the 92 remaining `var` converted by hand (one `let` per name where first needed); `YesOrNot()` and `heartMeter()` rewritten.

### 2026-11-11: Stage 1 step 4, dead code removed

- 117 lines of commented-out v1 code removed (old versions of live lines, debug `console.log`s, leftovers of the old storage API, unused layout lines). Every idea hidden in them was moved to the backlog first ("Ideas found in the v1 code comments").
- Kept: the story plans in `src/story.js`, TODO notes that mark where a feature will hook in, the empty "guardians after level 190" branch.
- Restored the disabled dev console block and the author's signature line, lost by the phase 3 module split (the splitter dropped the text attached to the old export list).

### 2026-11-11: New route, simpler changelog

- CHANGELOG rewritten as plain bullet points per version (the narrative version was not what the author wanted).
- Roadmap now follows the author's route: 1 clean up the code, 2 modern and faster, 3 the story, 4 new features.

### 2026-11-11: 2.0.0 is live

- `dev` fast-forwarded into `main`, tagged `v2.0.0`, deployed by GitHub Actions. Checked live: new modules load, version 2.0.0, new service worker served, `/legacy/` still serves v1, old notes not published.
- The author confirmed bulb won't be used again; its leftover worktree folders are deleted.

### 2026-11-10: Playtest passed; one notebook, one keeper

- The author played 2.0.0 locally: the wizard comes back after a reload, the pages look right, the offline service worker is activated and running.
- The bulb role is retired at the author's request: everything on `bulb/ideas` was already in `dev`; the branch is deleted locally and on GitHub. dev keeps this notebook, backlog included.
- The old notes (`docs/old_ideas/`, ~15,000 files) and `tools/` moved out of the repo into the sibling folder `wizardidle-old-ideas/`; `.gitignore` no longer needs to list them.

### 2026-11-10: Backlog after 2.0.0 (bulb)

- Synced phase 4. Placeholder achievements: noted the `planned:true` flag (design them, then remove the flag). Struck the legacy-link idea (the author decided against it) and the typo fixes (done in 2.0.0). No quotes in the backlog used the old spellings.

### 2026-11-10: Phase 4 done, 2.0.0 ready for the playtest

- Fixed: the level-210 crash (`knownTier()` keeps the 21 tiers; stress runs from level 205 reached 224–270 with zero errors), the author's own "acá hay un BUG" (wizard and enemy falling in the same round; the event picker also kept running while the wizard was dead), "another Boss" text, the easter egg check, `statObj.random()`, 14 kinds of typos ("shire" was meant to be "shrine").
- Corrected an earlier roadmap entry: "bosses read the previous enemy" wasn't a real bug; hardened the one theoretical spot.
- 13 unfinished achievements marked `planned:true`: hidden, not counted, so completion can reach 100%.
- Offline mode (`service-worker.js`): stores ~6 MB of code, art and sound; network first for code, stored first for media; per-release cache. Fixed `manifest.json`, whose paths opened `/wizardidle/wizardidle/index.html` when installed.
- Version 2.0.0. No legacy link in the game; removed the public legacy link from the README.
- Testing gap: headless Edge can't complete a service worker install here (its fetches never resolve), so offline mode needs a manual check in a real browser before going live.

### 2026-11-10: Old ideas and tools kept local (bulb)

- The author decided `docs/old_ideas/` (sources, extracted layers) and `tools/` stay local only. dev untracked them and added `.gitignore`. Marked the publishing question resolved and noted "local only" where the backlog points at them. The paths are unchanged.

### 2026-11-10: Anchors updated for phase 3 (bulb)

- Phase 3 split `src/game.js` into 15 modules. Pointed the backlog's code references at their new files (`src/combat.js`, `src/story.js`, `src/divine.js`, `src/ui/render.js`, `src/ui/scrolls.js`). Function names didn't change.
- Added dev's question about `docs/old_ideas/` and `tools/` being published with the site.

### 2026-11-10: Phase 3 done, the tower has rooms

- 3a: ~45 shared variables moved into `fight` / `run` / `ui` (`src/runtime.js`) with a scope-aware rename (711 references; locals with the same name untouched).
- 3b: `src/loop.js`, one 50 ms tick with named clocks (`master`, `event`, `animPJ`, `animNPC`, `stats`). Fixes v1's leaked master clocks (several places restarted it without stopping it); kill stops everything. Pace checked against v1 over four 30-minute runs: average level 6.5 (v1) vs 6.75 (v2), same encounter and kill counts.
- 3c: `game.js` (3,700 lines) split into 15 modules by a script from a name-to-module map, imports/exports computed. Constants (`masterTime`, `RAREMULTIPLIER`...) moved to `config.js`; `JUMPSPACE` became `ui.jumpSpace`.
- Tests: play, persistence across a full browser restart (new test: quit the browser, reopen the same profile), kill with foreign keys, v1 vs v2 stress with identical settings (v2 197-232, v1 208). Only the known level-210 bug.
- Note for the merge into `main`: bulb's extracted art layers (`docs/old_ideas/`, ~900 files) and `tools/` would be published with the site; decide before 2.0.0 whether the deploy should skip them.

### 2026-11-10: Layers extracted; map fog, inner maps, pixel UI (bulb)

- Wrote `tools/pdn_extract.py` (standard library only) and extracted all 51 .pdn files into `docs/old_ideas/layers/` (901 PNGs, with layer names, visibility and opacity). 26 of 34 scene files rebuild a game background pixel for pixel.
- Dynamic scenes: added the author's direction (keep the hand-crafted nature; special scenes identical to the legacy ones).
- Map revamp: added map fog with story-known places, and inner or local maps.
- New idea: pixel-art tiles for the XP bar and the rest of the HTML-drawn UI.

### 2026-11-10: Idea: dynamic scenes (bulb)

- Added "Dynamic scenes". Read the 32 background .pdn files: 256×64 scenes with 5–42 layers each (base + deco + props, some named). Proposed composing scenes from layers plus time, weather, animation, memory and story changes. Also found layered map files (`mapa.pdn`, `guias.pdn`) for the map rework, and a merchant sprite (`Monsters/comerciante.pdn`).

### 2026-11-10: Cards confirmed (bulb)

- The author confirmed the 1–6 playing cards were for a card game against tavern NPCs, which explains the empty `cardCombat()`. Updated the sprites entry. The open question is now about the rules.

### 2026-11-10: Unused sprites matched to ideas (bulb)

- Compared `docs/old_ideas/unorganzed_sprites/` with `img/`: 51 images aren't in the game. Matched them to ideas: rings and mushrooms (professions), playing cards (`cardCombat()`), town and shop sheets (shops, rumours, NPCs), interior tiles, boss crowns, a missing level-100 achievement icon.
- Wrote the placeholder achievements' intended meanings next to that entry, decoded from their icon names.

### 2026-11-10: Idea: track almost everything (bulb)

- Added "Track almost everything as stats": listed the 56 counters the game keeps today, proposed records, totals and firsts on top of counters, and a catalogue of candidates by area. Noted the dice game is untracked and `cardCombat()` is an empty stub.

### 2026-11-10: Old spreadsheets checked (bulb)

- `infodexp.xlsx`: the XP model. The curve, HP, age and enemy HP match the code. Two differences went to the backlog: the planned kills per level (16 × level vs. today's flat 16) and gold per HP (0.25 vs. 0.15). Its creature list became a new-enemies idea.
- `InformationByEnemy.xlsx` and `enemyLocation.xlsx`: already in the game (669/669 sprites identical; zones match apart from two later edits). Recorded under "Already built".

### 2026-11-10: Phase 2 done, the wizard has one memory

- All ~150 encoded localStorage entries became one `state` object (`src/state.js`) saved as plain JSON every 2 seconds and when the tab hides or closes. `getLocal`/`setLocal`/`idx`/`check` and `storage.js` are gone; 578 lines were converted from a key map that refused unknown keys.
- Balance moved to `src/config.js`. Achievements, counters, hydra heads and the two sacred wizards' names are plain fields now.
- Found while converting: the old `thx`/`hx` encoding corrupted any name with a space (a space is one base-36 digit, the decoder reads two), and emoji/CJK broke it too. JSON fixes it.
- Behavior kept: the level-up achievements compared the level as text (`case "2"`), converted to numbers so lvl 2/140/200 still fire. The Capricor extinction check moved from the zone data into game start.
- Kill is now safe for other games on the domain; the cemetery is structured data (name, level, age, born, died), shown with v1's exact wording. **Idea from the author:** build on the cemetery later, e.g. wizards from the past helping in the story (for bulb's backlog).
- Two v1 plans found switched off and kept as flags: `inSin` (lose faith after killing) and `travelFavor` (map travel).
- Tests: normal play, save/reload persistence, kill with foreign keys present, and v1 vs v2 stress runs. Zero errors below level 210. **At level 210+ both v1 and v2 crash in `attackEV`**: spell tiers run out (21 tiers, one per 10 levels). Logged for phase 4.

### 2026-11-10: From dev: unfinished flags and the cemetery (bulb)

- dev found two v1 features coded but never switched on: "in sin" (`inPecado` → `state.player.inSin`) and "travel favor" (`state.travelFavor`). Added to the story and map entries.
- New idea via dev: wizards from the cemetery help in the story.

### 2026-11-10: Old notes mined (bulb)

- Read the 2014–2018 notes in `docs/old_ideas/` (old help text, story-per-level plan, place graph, place colours, recipes, spell list) and checked each against the code.
- Added: story chapters III–XI and the final battle, Midas ×4, background notifications. Enriched professions with the old trio, materials and recipes.
- Corrected the map entry: tap-to-teleport (`travelFavor`) was never built. It only appears in the help text.
- Listed what's already built so it isn't proposed again.

### 2026-11-10: Idea: professions (bulb)

- Added "Professions for the wizard" to the backlog, marked ready for dev since it was asked to be built, with open questions on how professions should work.

### 2026-11-10: Idea: faith rebalance (bulb)

- Added "Rebalance faith and player interaction" to the backlog (the atheist path must survive), with an open question about what feels off.

### 2026-11-10: Idea: map rework (bulb)

- Added "Map rework: many ways to move" to the backlog, with an open question about which kinds of movement.

### 2026-11-10: Roles named (bulb)

- Named the two working roles: **dev** builds the game, **bulb** keeps the ideas. Added "Who's who" and a format for new backlog entries.

### 2026-11-10: Legacy preserved, phase 1 done

- Tagged the original as `v1.0.0`, created `legacy/1.x`, set up the Actions deploy. Legacy is live at `/legacy/`.
- Phase 1: split the 4,254-line `main.js` into `src/` modules: data (enemies, zones, spells, achievements), utils, storage, game logic, entry point. Strict mode exposed 11 undeclared variables and 3 canvases reached via the "element id = global" quirk; all fixed.
- Replaced v1's cache-first service worker with a self-removing one so returning players aren't pinned to v1.
- Verified by running v1 and v2 side by side in headless Edge with virtual time and boosted rare events: zero errors, v2 reached level 118. The dice game didn't come up in testing.
- Found v1 bugs along the way (boss fights read the previous enemy's data, "another Boss" text never shows, …), logged in the roadmap for phase 4.
- Housekeeping: removed co-author trailers from commit history; turned off commit attribution globally.

## 2026-11-14 from ideas.md: older journal entries

### 2026-11-13: Story art merged; the hooded healer in the cabin
- The artist's story art (approved by the author) is on dev: the hooded healer (`healer_hooded`), the final battle (`anim_god_unhood` 29 frames, `anim_god_wings_open` 8, `anim_god_wings_burn` 15, `anim_god_death` 26 at 64 x 56, stills `god_form_G1/G2/G3/G3b/G1_remnants` at 48 x 40, drawn at the healer's box - 8 sprite px, about 110 ms a frame) and the god's shrine (`god_shrine` 4-frame candle loop, `anim_shrine_break` 13 frames, `god_shrine_broken`). Frame counts checked against the artist's notes.
- Wired now: the healer in the cabin after a divine revive is the hooded healer (the god in disguise). The rest waits for the story stage (docs/STORY.md): the stranger moments in II, V, VIII, IX, the shrine in chapter II and its breaking in chapter X, the final battle phases (when each starts is for the planner).

## 2026-11-14 from docs/AUTHOR_NOTES.md: done (the healer's hood redrawn as a cowl, artist/art 10837a2)

[x] healer hood still looks weird (the pixels in the chin )

## 2026-11-14 from docs/SOUNDS.md: the reuse table (every row decided)

Existing sounds that could be reused, judged by name and length, then decided by ear.

| File | Length | Reuse for |
|---|---|---|
| Physical.ogg | 0.23 s | the swing of a regular enemy's slash, thrust, smash (approved, each with its own cut); ~~phase, great slash, the flurry~~ (boss moves) |
| ~~Nature.ogg~~ | 0.35 s | ~~spit, slime spit, poison strike / dart, poison cloud, spores, vines~~ |
| ~~Fire.ogg~~ | 1.73 s | ~~fire breath, flame pillar, fire rain, fire fist, fire peak, fire tornado~~ |
| ~~Frost.ogg~~ | 1.16 s | ~~blizzard, ice spikes, frost breath~~ |
| ~~Thunder.ogg~~ | 0.70 s | ~~lightning, golden storm~~ |
| ~~Shadow.ogg~~ | 3.43 s | ~~curse, eclipse (long: may need a shorter cut)~~ |
| ~~Arcane.ogg~~ | 1.25 s | ~~arcane flare, arcane rain, rune circle, sonic boom, prism pulse, colour burst, rainbow orbs~~ |
| ~~Divine.ogg~~ | 2.27 s | ~~golden touch, divine light~~ |
| ~~heal.ogg~~ | 3.43 s | ~~Midas healed by his golden rays, healing rain~~ |
| ~~breakPot.ogg~~ | 1.36 s | ~~the stone bursting off the wizard (unpetrify)~~ (another sound chosen) |
| ~~breakWood.ogg~~ | 1.50 s | ~~stand-in for the ram's impact and heavy slams until a thud is found~~ (the thud was found; the ram got its own sound) |
| hidra.ogg | 3.32 s | already plays when a hydra appears or grows a head |

The author's decision (2026-11-13): the rows crossed out are boss spells, and each boss move gets
its own sound instead of sharing its school's.

## 2026-11-14 from docs/SOUNDS.md: the "sounds to find" list (found rows)

| # | Sound | For |
|---|---|---|
| ~~1~~ | ~~Heavy thud / ground hit~~ | ~~slam (Ent, Golem, Mummy, Umigubi, Roco, bosses), ground punch~~ (found) |
| ~~2~~ | ~~Deep rumble, ~1.5 s~~ | ~~the earthquake scene spell (with the shake)~~ (found) |
| ~~3~~ | ~~Bow twang + arrow whoosh~~ | ~~shoot (Elf)~~ (found) |
| ~~4~~ | ~~Hooves galloping, ~1 s, loopable~~ | ~~charge (Capricor, Tauren, boss charges)~~ (found) |
| ~~5~~ | ~~Rolling rumble, ~1.5 s~~ | ~~the boss's roll~~ (found) |
| ~~6~~ | ~~Beast roar, ~1 s~~ | ~~roar (boss) only~~ (found) |
| ~~6b~~ | ~~Small creature snarl, under 0.5 s~~ | ~~pounce (small creatures need their own, lighter sound)~~ (found) |
| ~~7~~ | ~~Slime squelch / boing~~ | ~~the slime boss's bounce~~ (found) |
| 8 | Wind gust, ~1 s | ~~sandstorm~~ (found); whirlwind and the Fenix's wing flap stayed pending |
| ~~9~~ | ~~Stone grinding / crackle, ~0.8 s~~ | ~~Medusa's gaze turning him to stone~~ (found) |
| 10 | Hydra strike | stayed pending (on hold); ~~pounce bites~~ (the small creatures' snarl, 6b) |
| ~~11~~ | ~~Ram impact~~ | ~~the Capricor's and the Tauren's ram when the charge lands (not a thud)~~ (Physical.ogg chosen) |

## 2026-11-14 from docs/SOUNDS.md: how some choices were reached

- Hooves: the author first approved freesound_community-gallop-98644.mp3 and replaced it a minute
  later with freesound_community-single-horse-galopp-6152.mp3.
- Stone grinding: the first choice was dragon-studio-glass-cracking-511310.mp3, replaced the next
  day by freesound_community-stoneblockdragwoodgrind-82327.mp3.
- The roar (2026-11-13): the author heard the beast growl on a pounce and decided a roar like that
  is only for Bicaptop; small creatures need another sound. The boss's roar and the small
  creatures' snarl became two separate rows, each approved on its own.
- Sounds were first tried on a separate test page; since 2026-11-14 they are tried in the game's
  dev mode for sounds.

## 2026-11-14 from ideas.md: older journal entries

### 2026-11-13: Medusa's poison shot, more visible
- The author's note, redrawn by the artist (approved by the author): `scene_poison_dart.png` is now a slim dark stinger with a green venom drop, outlined, with a venom streak, drips and a splash on the wizard; 15 frames (was 14), set in `sceneSpells`.

### 2026-11-13: Belief: the way back from atheism, and a fix
- The author's way back (FAITH.md 3.1 Decisions): a Doubter or Atheist passing a shrine +0.5; a close call (a fight won below 10% HP with no help from the god) +1; getting up alone -10 only as a Believer or Devout, -1 as a Doubter or Atheist; the god's super-critic is 1 in 10 of his critics at x16.
- Fix: the stored belief level started empty and followed the value, so level changes were never recorded (no margin, no announcement, no time per level). He now starts as a Believer.
- Time spent at each level is counted (`belief.time.<level>`, ms of play), and `tools/playtest.py` writes a Belief table (end value and level, when he first turned Doubter / Atheist, times back to Believer, hours per level).
- Playtest `docs/playtests/2026-11-13-belief-way-back`: an idle wizard is a Doubter from level 1-2, never an Atheist, and yo-yos back to Believer 32-48 times (Doubter ~37 h, Believer ~6 h of ~43 h); his faith stays positive. An active god's wizard is Devout within the first hour and pinned at +100.

### 2026-11-13: Belief built; rest without beds
- **Belief** (docs/FAITH.md 3.1, the author's decision detailed by the planner) is in the game: `src/belief.js`, numbers in `config.belief`. Faith stays the currency; belief (-100 to +100, start +20) moves only by moments (saved from the killing blow +8, heal below 20% HP +5, the god's final blow +5, critic +3, normal touch +0.5, revive +2, shrine +1, skipped shrine -1, getting up alone -10). Levels with a 10-point margin on the way up: Devout (touches -25%, shrines +15%), Believer, Doubter (touches x2, shrines -15%), Atheist (refuses heal and hit touches, never enters shrines, no penalty for skipping). The god's touch may now kill. Stats page shows the level and value. Not yet: super-critic chance (off), Atheists getting up faster, rescuers and potions, the heading icon.
- Playtest `docs/playtests/2026-11-13-belief`: the active god plays as before; an idle god's wizard turns Atheist after about 9 falls alone (before level 25), never enters a shrine again and his faith ends deeply negative (-1.5M). For the author and the planner: intended road to atheism, or -10 too strong?
- **Rest** (the author, through the artist: no beds or sleeping pose needed): at an inn he walks slowly to the middle and the scene goes dark; camping, he walks a few steps, the sleeping bag appears in front of him (no more bag at the enemy's place on arrival) and it goes dark; when the scene comes back he stands in his place, with no walk back. The stand-in bed spots are gone.
- Tests: browser runs of the touches and of both rests; gameplay suite 0 errors.

## 2026-11-17 from docs/dev-notes.md: fixed, name screen hidden behind the dev tools (fdbef4a)

```
Date: 2026-11-15 00:17
Author's note: if a wizard is killed and the dev console is open, the game never appears, just the dev console
```

```
Date: 2026-11-15 11:18
Author's note: Sometimes before the enemy enters the sprite is loaded in the regular position, disapear and the eneme enters. This is a bug
```

## 2026-11-17 from docs/sound-notes.md: 34 approved boss and hydra sound tests (recorded in SOUNDS.md)

```
Sound test DOR.sonic_boom: Doria: sonic boom
Scene: Boss: attack: doria / sonic_boom (wizard tier 0)
Verdict: APPROVED
Sound: dragon-studio-ghostly-tone-499659.mp3 (from the picked folder)
Cut: whole file (file 3.120 s)
Speed: 1x | Extend: 1x | Plays for 3.12 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 0 ms (blow lands at 1000 ms, the move lasts 2300 ms)
Landing sound: Arcane (spellPush2), heard
Date: 2026-11-14 16:50
Author's note: -
```

```
Sound test DOR.rune_circle: Doria: rune circle
Scene: Boss: attack: doria / rune_circle (wizard tier 0)
Verdict: APPROVED
Sound: coghezzi-sacred-rune-lock-02-arcane-seal-activation-536458.mp3 (from the picked folder)
Cut: whole file (file 4.049 s)
Speed: 1x | Extend: 1x | Plays for 4.05 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 0 ms (blow lands at 1000 ms, the move lasts 2400 ms)
Landing sound: Arcane (spellRingRose_8), heard
Date: 2026-11-14 16:55
Author's note: -
```

```
Sound test (free choice)
Scene: Hydra: mother / 1 heads: grow to 2 (wizard tier 0)
Verdict: APPROVED
Sound: universfield-wet-squelch-276679.mp3 (from the picked folder)
Cut: whole file (file 2.328 s)
Speed: 1x | Extend: 1x | Plays for 2.33 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 0 ms (no timing)
Landing sound: Nature (spellChispasGreen_8), muted
Date: 2026-11-14 16:56
Author's note: -
```

```
Sound test (free choice)
Scene: Hydra: mother / 2 heads: grow to 3 (wizard tier 0)
Verdict: APPROVED
Sound: universfield-wet-squelch-276679.mp3 (from the picked folder)
Cut: whole file (file 2.328 s)
Speed: 1x | Extend: 1x | Plays for 2.33 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 0 ms (no timing)
Landing sound: Nature (spellChispasGreen_8), muted
Date: 2026-11-14 16:56
Author's note: -
```

```
Sound test (free choice)
Scene: Hydra: mother / 3 heads: grow to 4 (wizard tier 0)
Verdict: APPROVED
Sound: universfield-wet-squelch-276679.mp3 (from the picked folder)
Cut: whole file (file 2.328 s)
Speed: 1x | Extend: 1x | Plays for 2.33 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 0 ms (no timing)
Landing sound: Nature (spellChispasGreen_8), muted
Date: 2026-11-14 16:56
Author's note: -
```

```
Sound test (free choice)
Scene: Hydra: mother / 4 heads: grow to 5 (wizard tier 0)
Verdict: APPROVED
Sound: universfield-wet-squelch-276679.mp3 (from the picked folder)
Cut: whole file (file 2.328 s)
Speed: 1x | Extend: 1x | Plays for 2.33 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 0 ms (no timing)
Landing sound: Nature (spellChispasGreen_8), muted
Date: 2026-11-14 16:56
Author's note: -
```

```
Sound test (free choice)
Scene: Hydra: mother / 5 heads: grow to 6 (wizard tier 0)
Verdict: APPROVED
Sound: universfield-wet-squelch-276679.mp3 (from the picked folder)
Cut: whole file (file 2.328 s)
Speed: 1x | Extend: 1x | Plays for 2.33 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 0 ms (no timing)
Landing sound: Nature (spellChispasGreen_8), muted
Date: 2026-11-14 16:57
Author's note: -
```

```
Sound test (free choice)
Scene: Hydra: mother / 6 heads: grow to 7 (wizard tier 0)
Verdict: APPROVED
Sound: universfield-wet-squelch-276679.mp3 (from the picked folder)
Cut: whole file (file 2.328 s)
Speed: 1x | Extend: 1x | Plays for 2.33 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 0 ms (no timing)
Landing sound: Nature (spellChispasGreen_8), muted
Date: 2026-11-14 16:57
Author's note: -
```

```
Sound test MID.rainbow_orbs: Midas: rainbow orbs
Scene: Boss: attack: midas / rainbow_orbs (wizard tier 0)
Verdict: APPROVED
Sound: dragon-studio-bubble-gum-popping-467465.mp3 (from the picked folder)
Cut: whole file (file 1.392 s)
Speed: 1.6x | Extend: 1x | Plays for 0.87 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 0 ms (blow lands at 1200 ms, the move lasts 2700 ms)
Landing sound: Nature (spellChispasGreen_8), heard
Date: 2026-11-14 19:27
Author's note: -
```

```
Sound test MID.golden_rays: Midas: golden rays
Scene: Boss: attack: midas / golden_rays (wizard tier 0)
Verdict: APPROVED
Sound: dragon-studio-eerie-resonant-tone-478368.mp3 (from the picked folder)
Cut: whole file (file 3.120 s)
Speed: 1x | Extend: 1x | Plays for 3.12 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 0 ms (blow lands at 1100 ms, the move lasts 2600 ms)
Landing sound: Thunder (spellChispasReddish_8), muted
Date: 2026-11-14 19:29
Author's note: Remember that this spell needs to be changed in the code, this is a Midas healing spell, not an attack spell
```

```
Sound test MID.golden_rays: Midas: golden rays
Scene: Boss: attack: midas / golden_rays (wizard tier 0)
Verdict: APPROVED
Sound: dragon-studio-eerie-resonant-tone-478368.mp3 (from the picked folder)
Cut: whole file (file 3.120 s)
Speed: 1x | Extend: 1x | Plays for 3.12 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 0 ms (blow lands at 1100 ms, the move lasts 2600 ms)
Landing sound: Thunder (spellChispasReddish_8), muted
Date: 2026-11-14 19:29
Author's note: Remember that this spell needs to be changed in the code, this is a Midas healing spell, not an attack spell
```

```
Sound test MID.golden_touch: Midas: golden touch
Scene: Boss: attack: midas / golden_touch (wizard tier 0)
Verdict: APPROVED
Sound: dragon-studio-glass-wail-570451.mp3 (from the picked folder)
Cut: whole file (file 1.411 s)
Speed: 1x | Extend: 1x | Plays for 1.41 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 0 ms (blow lands at 1100 ms, the move lasts 2600 ms)
Landing sound: Frost (spellChispasBlue_8), heard
Date: 2026-11-14 19:31
Author's note: this school need to be changed, perhaps holy or something, now is kinda shock/electric. Landing sound will change as well
```

```
Sound test ROJ.slam: Rojo: slam (fire peak)
Scene: Boss: attack: rojo / slam (wizard tier 0)
Verdict: APPROVED
Sound: dragon-studio-elemental-spell-impact-flame-448566.mp3 (from the picked folder)
Cut: 0.000 s to 2.541 s (file 5.592 s)
Speed: 1x | Extend: 1x | Plays for 2.54 s
Fade in 0 ms, fade out 140 ms | Volume 0.3
Starts at 0 ms (blow lands at 1300 ms, the move lasts 2600 ms)
Landing sound: Physical (spellPush9), heard
Date: 2026-11-14 19:35
Author's note: -
```

```
Sound test ROJ.flaming_punch: Rojo: flaming punch
Scene: Boss: attack: rojo / flaming_punch (wizard tier 0)
Verdict: APPROVED
Sound: dragon-studio-elemental-spell-impact-flame-448566.mp3 (from the picked folder)
Cut: 2.559 s to 5.592 s (file 5.592 s)
Speed: 1x | Extend: 1x | Plays for 3.03 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 0 ms (blow lands at 1000 ms, the move lasts 2300 ms)
Landing sound: Physical (spellPush10), heard
Date: 2026-11-14 19:36
Author's note: -
```

```
Sound test CUB.spit: Cuboq: spit
Scene: Boss: attack: cuboq / spit (wizard tier 0)
Verdict: APPROVED
Sound: dragon-studio-clean-minimal-pop-467466.mp3 (from the picked folder)
Cut: whole file (file 1.632 s)
Speed: 0.45x | Extend: 1x | Plays for 3.63 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 0 ms (blow lands at 1100 ms, the move lasts 2400 ms)
Landing sound: Nature (spellPoisson_8), heard
Date: 2026-11-14 19:37
Author's note: -
```

```
Sound test SKE.great_slash: Skeleton: great slash
Scene: Boss: attack: skeleton / great_slash (wizard tier 0)
Verdict: APPROVED
Sound: dragon-studio-simple-whoosh-copyright-free-631457.mp3 (from the picked folder)
Cut: whole file (file 1.045 s)
Speed: 1x | Extend: 1x | Plays for 1.04 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 740 ms (blow lands at 900 ms, the move lasts 1900 ms)
Landing sound: Arcane (spellPush2), heard
Date: 2026-11-14 19:40
Author's note: -
```

```
Sound test SKE.curse: Skeleton: curse
Scene: Boss: attack: skeleton / curse (wizard tier 0)
Verdict: APPROVED
Sound: freesound_community-deathmagic-94937.mp3 (from the picked folder)
Cut: whole file (file 8.016 s)
Speed: 1x | Extend: 1x | Plays for 8.02 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at -1140 ms (blow lands at 1300 ms, the move lasts 3000 ms)
Landing sound: Arcane (spellRainPurple_24), muted
Date: 2026-11-14 19:42
Author's note: This is a curse spell, need to work kinda like hemoragie, no need landing sound, change school is needed
```

```
Sound test RAI.ice_spikes: Rainbow: ice spikes
Scene: Boss: attack: rainbow / ice_spikes (wizard tier 0)
Verdict: APPROVED
Sound: dragon-studio-glass-cracking-504028.mp3 (from the picked folder)
Cut: whole file (file 1.704 s)
Speed: 0.65x | Extend: 1x | Plays for 2.62 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 0 ms (blow lands at 1100 ms, the move lasts 2500 ms)
Landing sound: Frost (spellPush8), heard
Date: 2026-11-14 19:44
Author's note: -
```

```
Sound test RAI.blizzard: Rainbow: blizzard
Scene: Boss: attack: rainbow / blizzard (wizard tier 0)
Verdict: APPROVED
Sound: dragon-studio-freezing-winter-wind-499654.mp3 (from the picked folder)
Cut: 0.000 s to 2.200 s (file 13.392 s)
Speed: 1x | Extend: 1x | Plays for 2.20 s
Fade in 0 ms, fade out 1000 ms | Volume 0.3
Starts at 0 ms (blow lands at 1000 ms, the move lasts 2400 ms)
Landing sound: Frost (spellChispasBlue_8), heard
Date: 2026-11-14 19:48
Author's note: -
```

```
Sound test RAI.blizzard: Rainbow: blizzard
Scene: Boss: attack: rainbow / blizzard (wizard tier 0)
Verdict: APPROVED
Sound: dragon-studio-freezing-winter-wind-499654.mp3 (from the picked folder)
Cut: 0.000 s to 2.200 s (file 13.392 s)
Speed: 1x | Extend: 1x | Plays for 2.20 s
Fade in 0 ms, fade out 1000 ms | Volume 0.3
Starts at 0 ms (blow lands at 1000 ms, the move lasts 2400 ms)
Landing sound: Frost (spellChispasBlue_8), heard
Date: 2026-11-14 19:48
Author's note: -
```

```
Sound test FEN.fire_breath: Fenix: fire breath
Scene: Boss: attack: fenix / fire_breath (wizard tier 0)
Verdict: APPROVED
Sound: dragon-studio-fire-spell-impact-393921.mp3 (from the picked folder)
Cut: whole file (file 2.900 s)
Speed: 1x | Extend: 1x | Plays for 2.90 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 0 ms (blow lands at 1100 ms, the move lasts 2500 ms)
Landing sound: Fire (spellPush4), heard
Date: 2026-11-14 19:49
Author's note: -
```

```
Sound test FEN.wing_flap: Fenix: wing flap
Scene: Boss: attack: fenix / wing_flap (wizard tier 0)
Verdict: APPROVED
Sound: dragon-studio-bush-rustling-467467.mp3 (from the picked folder)
Cut: whole file (file 1.392 s)
Speed: 0.45x | Extend: 1x | Plays for 3.09 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 0 ms (blow lands at 1200 ms, the move lasts 2700 ms)
Landing sound: Fire (spellChispasRed_8), heard
Date: 2026-11-14 19:50
Author's note: -
```

```
Sound test FEN.flame_pillar: Fenix: flame pillar
Scene: Boss: attack: fenix / flame_pillar (wizard tier 0)
Verdict: APPROVED
Sound: dragon-studio-elemental-spell-impact-flame-448566.mp3 (from the picked folder)
Cut: 0.000 s to 2.200 s (file 5.592 s)
Speed: 1x | Extend: 1x | Plays for 2.20 s
Fade in 0 ms, fade out 870 ms | Volume 0.3
Starts at 0 ms (blow lands at 1000 ms, the move lasts 2400 ms)
Landing sound: Fire (spellRainRed_24), heard
Date: 2026-11-14 19:51
Author's note: -
```

```
Sound test PRO.earth_spikes: Protromus: earth spikes
Scene: Boss: attack: protromus / earth_spikes (wizard tier 0)
Verdict: APPROVED
Sound: dragon-studio-colossal-footsteps-467495.mp3 (from the picked folder)
Cut: whole file (file 8.832 s)
Speed: 2.55x | Extend: 1x | Plays for 3.46 s
Fade in 0 ms, fade out 30 ms | Volume 0.82
Starts at 0 ms (blow lands at 1400 ms, the move lasts 2800 ms)
Landing sound: Nature (spellEarthSpike_10), heard
Date: 2026-11-14 19:54
Author's note: -
```

```
Sound test GOR.flurry: Goro: flurry
Scene: Boss: attack: goro / flurry (wizard tier 0)
Verdict: APPROVED
Sound: dragon-studio-beast-growl-sound-376873.mp3 (from the picked folder)
Cut: whole file (file 1.097 s)
Speed: 1.05x | Extend: 1x | Plays for 1.04 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 0 ms (blow lands at 700 ms, the move lasts 1200 ms)
Landing sound: Physical (spellPush10), heard
Date: 2026-11-14 19:59
Author's note: -
```

```
Sound test GOR.slam: Goro: slam
Scene: Boss: attack: goro / slam (wizard tier 0)
Verdict: APPROVED
Sound: dragon-studio-heavy-boulder-thud-515257.mp3 (from the picked folder)
Cut: whole file (file 2.112 s)
Speed: 1x | Extend: 1x | Plays for 2.11 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 0 ms (blow lands at 600 ms, the move lasts 1100 ms)
Landing sound: Physical (spellPush6), heard
Date: 2026-11-14 20:01
Author's note: -
```

```
Sound test GOR.charge: Goro: charge
Scene: Boss: attack: goro / charge (wizard tier 0)
Verdict: APPROVED
Sound: dragon-studio-heavy-boulder-thud-515257.mp3 (from the picked folder)
Cut: 0.343 s to 0.678 s (file 2.112 s)
Speed: 1.25x | Extend: 3x | Plays for 0.80 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 0 ms (blow lands at 700 ms, the move lasts 1800 ms)
Landing sound: Physical (spellPush9), heard
Date: 2026-11-14 20:03
Author's note: -
```

```
Sound test INF.arcane_flare: Infraespectro: arcane flare
Scene: Boss: attack: infraespectro / arcane_flare (wizard tier 0)
Verdict: APPROVED
Sound: dragon-studio-creepy-sound-effect-570459.mp3 (from the picked folder)
Cut: 0.000 s to 1.702 s (file 3.161 s)
Speed: 1x | Extend: 1x | Plays for 1.70 s
Fade in 0 ms, fade out 810 ms | Volume 0.3
Starts at 0 ms (blow lands at 1000 ms, the move lasts 2400 ms)
Landing sound: Shadow (spellWhiteMaldicion_8), heard
Date: 2026-11-14 20:05
Author's note: -
```

```
Sound test INF.phase: Infraespectro: phase
Scene: Boss: attack: infraespectro / phase (wizard tier 0)
Verdict: APPROVED
Sound: dragon-studio-velvet-whoosh-sfx-570450.mp3 (from the picked folder)
Cut: 0.000 s to 0.473 s (file 0.549 s)
Speed: 0.7x | Extend: 1x | Plays for 0.68 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 0 ms (blow lands at 600 ms, the move lasts 1100 ms)
Landing sound: Arcane (spellChispasWhite_8), heard
Date: 2026-11-14 20:07
Author's note: Perhaps reclasify this to adjust landing sound
```

```
Sound test HER.vines: Herbus: vines
Scene: Boss: attack: herbus / vines (wizard tier 0)
Verdict: APPROVED
Sound: yodguard-bouncy_jelly_creature_movement-387893.mp3 (from the picked folder)
Cut: whole file (file 8.040 s)
Speed: 0.4x | Extend: 1x | Plays for 20.10 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 0 ms (blow lands at 1000 ms, the move lasts 2400 ms)
Landing sound: Nature (spellChispasGreen_8), heard
Date: 2026-11-14 20:08
Author's note: -
```

```
Sound test HER.vines: Herbus: vines
Scene: Boss: attack: herbus / vines (wizard tier 0)
Verdict: APPROVED
Sound: yodguard-bouncy_jelly_creature_movement-387893.mp3 (from the picked folder)
Cut: 0.000 s to 1.132 s (file 8.040 s)
Speed: 0.4x | Extend: 1x | Plays for 2.83 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 0 ms (blow lands at 1000 ms, the move lasts 2400 ms)
Landing sound: Nature (spellChispasGreen_8), heard
Date: 2026-11-14 20:08
Author's note: -
```

```
Sound test HER.vines: Herbus: vines
Scene: Boss: attack: herbus / vines (wizard tier 0)
Verdict: APPROVED
Sound: yodguard-bouncy_jelly_creature_movement-387893.mp3 (from the picked folder)
Cut: 0.000 s to 1.132 s (file 8.040 s)
Speed: 0.4x | Extend: 1x | Plays for 2.83 s
Fade in 0 ms, fade out 30 ms | Volume 0.3
Starts at 0 ms (blow lands at 1000 ms, the move lasts 2400 ms)
Landing sound: Nature (spellChispasGreen_8), heard
Date: 2026-11-14 20:08
Author's note: -
```

```
Sound test HER.spores: Herbus: spores
Scene: Boss: attack: herbus / spores (wizard tier 0)
Verdict: APPROVED
Sound: dragon-studio-sand-transition-451861.mp3 (from the picked folder)
Cut: 0.000 s to 2.400 s (file 3.912 s)
Speed: 0.85x | Extend: 1x | Plays for 2.82 s
Fade in 0 ms, fade out 500 ms | Volume 0.3
Starts at -360 ms (blow lands at 1000 ms, the move lasts 2400 ms)
Landing sound: Nature (spellPoisson_8), heard
Date: 2026-11-14 20:12
Author's note: -
```

```
Sound test ARC.lightning: Arcangel: lightning
Scene: Boss: attack: arcangel / lightning (wizard tier 0)
Verdict: APPROVED
Sound: dragon-studio-thunder-4-631461.mp3 (from the picked folder)
Cut: 0.000 s to 2.233 s (file 3.056 s)
Speed: 1x | Extend: 1x | Plays for 2.23 s
Fade in 0 ms, fade out 810 ms | Volume 0.3
Starts at 0 ms (blow lands at 900 ms, the move lasts 2200 ms)
Landing sound: Thunder (spellChispasReddish_8), heard
Date: 2026-11-14 20:14
Author's note: -
```

## 2026-11-17 from ideas.md: working rules (now in docs/MAP.md and the roles' memory)

- **Done goes to the archive** (the author's rule, 2026-11-14): when something is finished (a journal entry older than the newest few, an idea built or dropped, a bug fixed, a sound or a piece of art approved, a note handled), cut it from its working file and append it to [docs/ARCHIVE.md](docs/ARCHIVE.md) with a plain `cat >>` (a heading `## <date> from <file>: <what>`, then the text). Never read or open the archive in normal work; it only grows. Working files (this one, SOUNDS.md, AUTHOR_NOTES.md, the plans' pending parts, `src/dev/soundNeeds.js`, `docs/*-notes.md`) keep only what is still pending.
- **Where art and sounds live** (the author's layout, 2026-11-14): `img/` in folders by kind and creature (wizard/<animation>, enemies/<family>, bosses/<boss>, bosses/hydras/<hydra>, effects/<spells|scene|fx>, places/<zone>, story, objects, ui, ui/achievements, app) and `snd/` (schools, wizard, creatures, places, ui). File names did not change. The code asks by name, `art('el_golem1')` and `snd('Fire')`; only `src/media.js` knows the folders. A new file goes in the folder its name's rule says; a new kind needs a rule there first (while developing, an unknown name is reported in the browser console).
- **Files from outside get renamed** (the author's rule, 2026-11-14): downloaded or found images and sounds (packs, freesound, the author's folders) usually have long or odd names. Before a file enters `img/` or `snd/`, rename it to the game's style: short, lowercase English or the game's existing words, words joined by `_`, no spaces, no author, site, pack, ids or version numbers, and the prefix its kind uses (`anim_<who>_<move>`, `scene_<spell>`, `fx_<name>`, `run_`/`ram_<sprite>`, a creature's family name plus a number; sounds like `fire_breath`, `hooves`, `dice_roll`). The original name, source and licence go in the doc that records the decision (SOUNDS.md for sounds, the art notes for images), never in the file name. The name must fit a rule of `src/media.js`; a new kind needs its rule first.
- **New files go to the review drop** (the author's rule, 2026-11-14): every session copies its latest outputs (art, sounds) into `review/` at the root of the main checkout (git-ignored) and adds one line per file to `review/index.txt`: `date | who | file | game file it would replace, or - | short note`. The dev tools' art and sounds modes list them, newest first, to view or try. Delete handled lines and files.

## 2026-11-17 from ideas.md: backlog entries whose plan doc holds them (faith, professions, stats, erasure, scene spells, sleep)

- **Rebalance faith and player interaction** (2026-11-10; **plan → [docs/FAITH.md](docs/FAITH.md)**, decisions recorded there, numbers wait for playtests): rebalance faith points and how the player (the god) interacts with the wizard, while **keeping the atheist ending possible**. *Today:* faith comes from praying, shrine offerings (gold to faith) and wiping out corrupted enemies. It's lost by skipping shrines, self-reviving, and every divine touch (heal, hit enemy). Below 0 faith the player can't help at all, which is the road to atheism ("The player" help text and the divine-touch faith costs, `//determine faith cost`, in `src/ui/scrolls.js` and `src/divine.js`).

- **Professions for the wizard** (2026-11-10, *asked to be built: ready for dev*; **plan written 2026-11-11 → [docs/PROFESSIONS.md](docs/PROFESSIONS.md)**: reagents, the 15 items and their effects, vendors and trainers, build order): give the wizard professions. *From the old notes* (`wizardidle-old-ideas/Help.txt`, `Recetas.csv`): three professions, **Alchemy, Enchanting and Writing**. Each zone has its own material to gather: mushroom (hongo), bone (hueso), gem (gema), ectoplasm, essence, herb. Recipes take two materials and have a price (50 or 100) and a difficulty:
  - *Writing → scrolls:* reduction, teleportation, understanding, maximisation, divine binding.
  - *Enchanting → rings:* health, magic power, natural integration, luck, greatness.
  - *Alchemy → potions:* health, mana, vitality, alcohol, golden potion.

  *Today:* half-prepared. Zones already name their material (`drop:` in `src/data/zones.js`) and there's a "scavenger skills" stat (`pFindMaterials`, raised by the Dwarf statue), but gathering is only a `//found materials` ToDo in `src/combat.js`, and there's no inventory, crafting or use for the items. The old help also had "Commerce" and "Gathering" pages that the current help lacks. *Art already drawn* (`wizardidle-old-ideas/unorganzed_sprites/Sprites/`): `anilos.png` is **five gem rings** (pink, blue, green, orange, brown), one per ring recipe. `BASE/dg_food32.gif` has mushrooms in a dozen colours (the *hongo* material), plus drinks, bread and meat.

- **Track almost everything as stats** (2026-11-10; **plan → [docs/STATS.md](docs/STATS.md)**, with the playtest tools): keep a stat for nearly everything that happens, so later achievements, missions, quests and new areas have numbers to hang on ("kill 50 corrupted enemies", "reach 0 faith three times", "visit every place in the Swamp"). *Today:* 56 counters via `count()` into `state.counters`, several split by key (`zone_*`, `enemy_*`, `typeBoss_*`, `school_*`, `altar_zone_*`, `BotinGot_*`, `Polymorph_*`, `study_*`…), plus `meta.playTimeMs`. Gaps found: they're **all counters**. There are no records (highest / lowest), no "firsts" (when something first happened), and nothing across wizards. The **dice game tracks nothing at all**.

  Four kinds of stat to keep:
  - *Counters:* how many times (what `count()` does today).
  - *Totals:* how much in all (damage, gold, faith).
  - *Records:* the best or worst ever (biggest hit, most gold held, lowest faith).
  - *Firsts:* the level, age and date something first happened (first boss, first death, first rare). These are great for story callbacks and quest unlocks.

  Each can live per wizard (`state`) or per world across all wizards (`wizardidle2:world`, next to the cemetery).

  Candidates, by area:
  - *Combat:* damage dealt / taken (totals); biggest hit and biggest crit (records); longest fight in rounds; fights won without taking a hit; close calls (won under 10% HP); kill streak without dying; kills by enemy type (melee, wizard, nature, fire, frost…) and by zone; corrupted enemies killed; rare enemies killed by name; spells cast by spell, not just school; total HP healed; kills while polymorphed.
  - *Deaths:* deaths by zone and **killed by** (which enemy or boss); divine revives vs self-revives (amount of faith lost); level and age at each death.
  - *Faith and the god:* faith gained / spent (totals); highest and lowest faith ever (how deep into atheism); times faith crossed 0 in each direction; time spent below 0; divine touches by target (wizard, enemy, boss, shrine); touches with too little faith; faith lost skipping shrines (an amount; `negar` only counts).
  - *Gold:* earned / spent (totals); most gold held (record); inn spending (exists); robbed, once robbery exists.
  - *Dice (untracked today):* games played; won / lost / tied; gold won / lost; best cargo; times he risked another roll and whether it paid; opponents beaten.
  - *Exploration:* unique places visited (e.g. `el_Bosque3`, not just zones); first-visit level per zone; time spent per zone; overworld vs underground; longest stay in one zone; map opened.
  - *Study:* runes vs books separately; total skill gained per stat (`statBonus` holds the result, not the history).
  - *Progress and time:* time per level (real play time); level, age and date of each chapter; sessions, days played, longest session; offline time, if offline progress comes back.
  - *Player habits:* scrolls opened (stats, achievements, help, map); taps on the scene.
  - *World, across wizards:* wizards created / killed; highest level ever; oldest wizard; lifetime kills, bosses, gold, faith. Enables account-wide achievements and the cemetery idea.
  - *For future systems:* materials gathered by type, items crafted / used (professions); quests started / completed; story choices.

  Found while looking: `cardCombat()` in `src/combat.js` is an empty placeholder (a card-combat idea that never started?).

- **After an erasure: the souls of erased wizards help the next one** (2026-11-12, asked by the author with the story plan; **plan → [docs/ERASURE.md](docs/ERASURE.md)**): when the god wins the final battle he erases the wizard (removed from existence, name reversed and struck through in the cemetery), a museum appears, and a new game is the god going back in time. Decided: in the next final battles **the souls of the erased wizards come to help**, one per erasure **up to 5**, **entering one by one** every few rounds (each named by his reversed name), shown in the museum's final-battle snapshot, in turn order **wizard → souls → god**; the souls act only in the final battle, but after at least one erasure the next game's text shows **small echoes** (a different Prologue opening: *"You have heard him before. You will hear him again. Time is nothing to you. To him, it is everything. Will this one win?"*, and a few déjà vu lines in the chapters); faith rules don't change. Saved per world (`world.erasures`, `world.loop`, next to the cemetery). Every win brings the god's own end closer, which is the prophecy. **Only wizards defeated by the god in the final battle are erased** (the author, 2026-11-12); wizards who die at any other moment are a regular part of the cemetery and have a different role (ghost rescuers, letters, legends: "Wizards from the past help in the story").

- **Scene spells: attacks that cover the whole scene** (2026-11-12, the author, via the artist session). Boss fights are special, so some boss attacks play over the **whole scene**, not just on the wizard: spikes erupting from the ground toward him, rains, lightning, a blizzard, a pillar of fire. They are drawn as independent full-scene animations (the size of a zone background) whose ground effects are translucent, so a spike bursts out of a bit of that zone's own soil. Drafted by the artist (art in `wizardidle-old-ideas/tools/scene_spells/`, not in the game yet):
  - *Used by bosses:* earth spikes (protromus), ice spikes and blizzard (rainbow), fire rain (rojo), arcane rain (doria, king skeleton), lightning (arcangel), entangling vines (herbus), flame pillar (fenix).
  - *Added after the author's boss review (round 2):* sonic boom and rune circle (doria), poison cloud (kkck), golden touch, rainbow orbs and golden rays (king midas), spore storm (herbus), slime spit (cuboq), curse (king skeleton), fire tornado and fire breath (fenix), petrifying gaze and poison dart (medusa), golden storm (arcangel), prism pulse and colour burst (etymos), fire fist and fire peak (rojo); the earthquake now follows protromus's ground punch. 34 scene spells in all.
  - *Kept for later, not used by anyone yet:* meteor shower, divine light, eclipse, sandstorm, whirlwind, healing rain.
  - *For the planner (the author, round 3):* **king midas's golden rays heal him** (the rays spinning around him are a self-heal, not an attack).
  - *For the planner (the author, round 3):* **medusa's gaze turns the wizard to stone for a couple of turns.** It needs to be rare, or, better (the author prefers it), the wizard can **find an artefact that makes him immune** to it. Art drawn for every tier (not in the game yet): the wizard turning to stone, a stone wizard held while he is petrified, and the stone cracking and bursting off him (`wizardidle-old-ideas/tools/anim/stone/`).
  - Infraespectro's curse and arcane flare are scene spells too (a new "arcane flare": a blinding burst that races over the scene).
  - *For the planner (the author's words): the scene must shake.* The earthquake (and big hits like slams and the meteor shower) needs **the whole scene to shake** for a moment, which art alone can't do: the game moves the scene canvas a pixel or two each frame (suggested for the earthquake: 0, 1, −1, 2, −2, 2, −2, 1, −1, 2, −2, 1, −1, 1, 0, 0 px).
  - **Boss effects decided (2026-11-13, [docs/SCENE_SPELLS.md](docs/SCENE_SPELLS.md)):** Medusa's gaze petrifies rarely (about 1 in 4 gazes, 2 turns) and after the first time he can find a **rare** artefact for permanent immunity; Midas's golden rays heal him about 15%, at most twice per fight, and the god's touch interrupts them; a few signature effects (blizzard: skip an attack; poison cloud: damage over 2 turns; earthquake: miss a spell), the rest looks only.
  - **Plan → [docs/SCENE_SPELLS.md](docs/SCENE_SPELLS.md)** (decided 2026-11-13): the wizard earns them with the staff (90, VI, XI); a critic can become a **super-critic** that casts a scene spell (very rare before 90, rare with a staff); the god's touch-critics play divine light, meteor shower or healing rain; eclipse, sandstorm/whirlwind and divine light go to story moments, and the earthquake (now protromus's) is reused at the Tower siege.
  - *For the planner (the author's words):* add notes for **our wizard to use scene spells when he is very powerful**, and use the spare ones **for the story and for other powers**. Open: at what level or chapter he earns them, which god actions or story moments trigger the "kept for later" ones (an eclipse at a dark chapter, divine light for a miracle, an earthquake, healing rain from the god…), and whether they cost faith.

- **Soft sleep, dreams and nightmares** (2026-11-12, the author; **plan → [docs/SLEEP.md](docs/SLEEP.md)**, decided 2026-11-13: he walks to the bed or sleeping bag, the scene fades to dark; dreams are rare visions over the dark plus story nights; pure story for now): resting today plays a sleep effect over the wizard and prints a few lines (`searchInn` in `src/events.js`: arrive, sleep, wake up, at an inn or camping). The author wants something soft: the scene goes dark for a couple of seconds, then he wakes. Sleep is also the natural place for the story's **dreams and nightmares**. Leave sleeping untouched until it's planned.
  - *To decide:* how the darkness looks and how long; what a dream or nightmare is (console text, a short scroll, a vision over the dark scene); when they come (chance, level, chapter, belief level, after a fall, near the final battle); what they do (pure story, hints, a rest bonus, faith changes, ties to the erasure echoes and souls); whether nightmares belong to atheism and dreams to faith. The artist can help with the visuals once it's decided.

## 2026-11-17 from ideas.md: journal entries 2026-11-13 to 2026-11-14

### 2026-11-14: Images and sounds in folders
- The author's choices (asked one by one): folders by kind and per creature; one helper by rules; `ogg/` renamed to `snd/` (a 3-letter abbreviation, the author's) with folders for what exists now, more when needed; junk deleted.
- 1,447 files moved with `git mv` (history kept). `img/null`, `ogg/null` and `img/lvlNaN.png` (v1 bug leftovers, unused) deleted.
- `src/media.js`: `art(name)` and `snd(name)` give each file's path from its name (enemy sprites by family from `enemySprites`, bosses from `bossAttacks` and the zones, hydras, wizard tiers, zone backgrounds...); a name no rule knows is reported in the console while developing. The game's paths (85 places) now go through them; index.html, manifest.json and browserconfig.xml have the new literal paths.
- `tools/serve.py` lists every file of `img/` or `snd/` at `/__list/img` and `/__list/snd` for the dev tools; the notes limit is 200 KB.
- Checked: every file is where its name's rule says (1,412 images, 35 sounds), all 1,231 names the game data can ask for exist, and a live run (fights with bosses, a hydra, chargers, both dev modes) had no missing file and no warning.

### 2026-11-14: The healer's hood, redrawn by hand
- The author's note "healer hood still looks weird (the pixels in the chin)": the old hood was a perfect oval and looked artificial. The artist hand-drew four cloth hoods; the author picked **A, the cowl** (flatter top, the cloth bunches at the back in a darker fold). The chin is now clean: dark face, a soft brown chin catching a little light (no stray grey or gold pixels). The staff is unchanged.
- `healer_hooded.png` replaced; `anim_god_unhood.png` regenerated so the reveal opens with the new hood (only its hooded frames changed; the wings and god forms are identical).

### 2026-11-14: Dev tools beside the game, sounds and art modes
- The author's request (with the musician's and the artist's lists of what each test needs): the bottom dev bar is now a light panel left of the game (`src/dev/panel.js`, `src/dev/tests.js`) with folding menus (Modes, Scenarios, Fight now, Wizard, Game, Command line) and a log; on a narrow screen it floats over the game.
- Shared scene picker (`src/dev/scenes.js`): kind, what, which and tier; enemy attacks and arrivals, boss attacks, hydras (strike, cast, grow), scene spells, spell effects, wizard animations and poses, the dice (two rolls 1.5 s apart), any sprite or object, backgrounds. Each knows when its blow lands and the spell that lands with it.
- Sounds mode (`src/dev/sounds.js`): any scene with an ogg/ file or added files; cut, extend, speed, volume (game 0.3, up to 1), fades, starts at (ms from the first frame), the landing spell's effect and school sound (can be muted), the file the game plays now marked, settings kept per scene and per file for A/B, verdict. "Needs a sound" (`src/dev/soundNeeds.js`, from SOUNDS.md) jumps to a waiting move; strike entries there when approved.
- Art mode (`src/dev/art.js`): the scene at any tier in slow motion (x1 to x0.1) with the blow marked, crisp pixels on, Reload art, Try a file (a local PNG in place of a game image); a viewer for any img/ file or local file: frame by frame, game size and x2/x4/x8 side by side, slots A and B, all tiers, grid, ghost of the previous frame, feet line, light/grey/dark/checked backdrops. Not done yet: frame-by-frame stepping inside the live scene, story scenes and UI tiles as their own kinds (the viewer shows any image meanwhile).
- Sounds mode (author, later the same day): a slider beside every number box (the boxes stay for fine edits; the cut's sliders end at the file's length), and Add folder: its sound files fill a list where ↑ ↓ plays the next one (alone, or with the scene), Enter or Space plays it again.
- Author notes box (`src/dev/notes.js`), always in the dev panel: the technical details fill in by themselves; the author adds a comment, Copy puts both on the clipboard, Save to file appends to `docs/<mode>-notes.md` (`tools/serve.py` accepts POST `/notes/sound|art|dev` from localhost).
- The game waits while its window is hidden (minimized or covered), only while developing.
- Review drop (`src/dev/review.js`): sessions copy new files to `review/` and list them in `review/index.txt`; the art mode shows the images: "In scene" puts one in place of the game image it names and plays that image's real scene (the author: sizes and positions are judged in the scene, not a viewer; an image the game doesn't use yet plays alone at the enemy's spot, the wizard's, or over the whole scene), A / B open it in the viewer, whose slots also have "In scene", the sounds mode the sound files (Use adds one to the picker).
- Fixed: `spell()` used `frameMs` before declaring it when the image was already loaded (the dice's second roll crashed).

### 2026-11-14: Sounds: one per move, bosses apart (musician)
- The author's decisions while listening: one sound per move, heard on that move; bosses apart from regular enemies; each boss spell gets its own sound instead of its school's (the author is looking for them); the Capricor's ram is not a thud; the hydras need new sounds. `docs/SOUNDS.md` has a new section "Boss moves: one sound each" with what is still to choose.
- Approved since the first seven: the small creatures' snarl, the wind on the sandstorm, the stone grinding for Medusa's gaze, the stone bursting off (a rock sound instead of breakPot.ogg), and the thud and the hooves again on Protromus's ground punch and the Capricor's charge. Nothing is in `ogg/` or wired yet.

### 2026-11-13: Sounds: the first seven chosen by ear (musician)
- The author tried the candidate sounds against the attack animations and approved seven: the heavy thud, the deep rumble, the arrow whoosh, the hooves (a second file replaced the first choice), the rolling rumble, the beast roar (for Bicaptop only: small creatures get their own snarl, new row 6b) and the slime bounce. Files, cuts, volume and the moment each starts are in `docs/SOUNDS.md` (Decisions); those seven are crossed out of "Sounds to find". Still to find: small creature snarl, wind, stone, bite; the reuse table is still to confirm by ear. The files are not in `ogg/` yet and nothing is wired.

## 2026-11-17 from docs/dev-notes.md: two duplicate notes

```
Date: 2026-11-15 11:40
Author's note: dreem scene do not respect the reposition of the scene view when stats or other UI scroll are opened
(cut: duplicate of the 11:39 note)
```

```
Date: 2026-11-15 11:42
Author's note: elementals shoudl have another movement to go into the battle, i would say like fade in
(cut: replaced by the 11:53 note on elementals)
```

## 2026-11-17 from ideas.md: journal entry 2026-11-17 File map for the roles

### 2026-11-17: File map for the roles
- Wrote docs/MAP.md: one line per file, how the pieces connect, media rules, dev tools and docs. Roles read it before code. Loose end: a root `ogg/` folder still exists though the code no longer uses it; the comment in src/data/bossAttacks.js still says img/anim_<boss>_<attack>.png (now in img/bosses/<boss>/).

## 2026-11-17 from ideas.md: journal entry from branch musician/sounds (merged into dev)

### 2026-11-14: Sounds: a script that cuts them, game names, three more approved (musician)
- The author's note (no conversion by hand each time): `tools/cut_sounds.py` reads `tools/sound_cuts.txt` (game name, folder, source file, cut) and writes each `snd/<folder>/<name>.ogg`: the cut, mono, a 30 ms fade out, Ogg Vorbis, the volume untouched (`--list` checks the sources, `--review` also copies to the review drop). It needs the `soundfile` library once (`python -m pip install soundfile`); the machine has no ffmpeg. Run for the 18 approved sounds: the files are in `snd/creatures/` and in the review drop, read back as mono Ogg Vorbis with the approved lengths. Not wired: the game does not play them yet.
- Every approved sound has its game name by the rule for files from outside (`thud`, `rumble`, `rock_roll`, `arrow`, `hooves`, `roar`, `rock_smash`, `stone_break`, `stone_grind`, `bounce`, `bite`, `wind_gust`, `swing_slash`, `swing_thrust`, `curse`, `sonic_boom`, `rune_circle`, `squelch`), all for `snd/creatures/`; `src/media.js` needs them in its creatures list when they are wired. `docs/SOUNDS.md` keeps the original names and cuts ("The files"); the site and licence of the downloads are still to confirm by the author.
- Approved in the game's sounds mode (2026-11-14): Doria's sonic boom and rune circle, and a head growing on the Swamp hydra (one squelch for every growth). Still to strike by dev: `DOR.sonic_boom` and `DOR.rune_circle` in `src/dev/soundNeeds.js`, and the eight handled notes of `docs/sound-notes.md`.

## 2026-11-17 from ideas.md: journal entries from branch plan/story (merged into dev)

### 2026-11-13: Story review page kept in the repo
- New folder [artefacts_tests/](artefacts_tests/README.md): the Story Scrolls review page (template, build script, built page, data). It always shows the latest script (commit and date at the top), and notes can be sent for review or erased, one or all.
- After every change to `docs/STORY.md`: rebuild with `python artefacts_tests/build_story_scrolls.py` and load `story-data.json` into the page's store.

### 2026-11-13: The broken shrine
- The author decided the god's shrine is destroyed in Chapter X: after breaking with the god, the wizard walks back to the shrine he found in Chapter II and breaks it with his bare hands; the candle goes out. Then he writes the Last Escape scroll. Step-by-step console lines and an echo line in [docs/STORY.md](docs/STORY.md); the Chapter II shrine's zone is saved (`{shrineZone}`). The shrine stays broken afterwards, in the museum too.
- Art: the destruction animation and the broken state requested from the artist.

### 2026-11-13: Story scrolls, the author's review
- The author read every scroll and left a verdict and note per scroll. Kept as written: III, VI, VIII part II, X, XI.
- Changed: "Midas's Tower"; Chapter I has slimes instead of wolves (no wolves in the game) and no longer reveals that the healer is the god ("he never sees the healer's face"); Chapter V's moral shock is stronger (he wakes among the dead of a pilgrim camp, the staff warm in his hand, and prays to their gods); the epilogues are now *The Unmaking* and *The Last Light*.
- The staff's true name was never meant to be "Nomaleatorio": it is a random name (`{staffName}`), made in the first game and kept in every loop.
- Notes for the code: Midas gone forever after VII (bosses return otherwise); the Tower full of mages again after the lynching; art needed for the god's shrine and a distinct hooded stranger.

### 2026-11-12: Story scrolls get echoes and variable phrases
- Every chapter scroll in [docs/STORY.md](docs/STORY.md) now has slots filled when it opens: one phrase by the belief level (Devout, Believer, Doubter, Atheist; FAITH.md), one by the place (16 zones in 6 sceneries: open, wild, cold, hot, deep, walls), and one déjà vu line in echo games (after an erasure). Faith slots are skipped where the story locks faith (VII, X, XI), place slots where the place is fixed (Volcano, Tower, Heidan).
- New echoes: the healer's pause (I), the stranger's slipping smile (II), the seer's tally on the exile scroll (III), the staff you always swear to take (IV), Midas dreaming the steps (VII), "How many times, god?" (VIII), "I have tried" (XI), and both epilogues.
- Longest combination of any scroll: 99 words, under the ~110 the screen holds without scrolling. Code notes: a `scenery` field on zones, one function filling the slots, the filled text stored with each chapter's snapshot for the museum.

### 2026-11-12: Story reviewed for plot holes, then rewritten
- Recapped the arc and listed its weak spots (why Midas didn't kill him, who planted the staff, death rules, V and IX repeating, the seer vanishing, the Tower at 139, the self-crowning). The author answered each one; [docs/STORY.md](docs/STORY.md) rewritten with the decisions table.
- New lore from the author: a hyperpolytheist world; the prophecy names **the Omni, god of gods**; the dead hunger for his soul but only a crown can feed them, and a crown that bends his road is cursed (so Midas exiled him and was cursed anyway); deaths in play are falls; a rare true death leaves the soul in purgatory; if the god wins he unmakes the soul and rewinds time (echo games, reversed struck-through names in the cemetery); if the wizard wins he engulfs the universe and the save becomes a black museum, blocked forever.
- Coordinated with the planner: [docs/ERASURE.md](docs/ERASURE.md) (souls of erased wizards in the final battle, one by one, shown in the museum; echoes only after an erasure) and a request for a sprite of the wizard lying injured.

### 2026-11-12: The story is scripted
- Wrote [docs/STORY.md](docs/STORY.md) on branch `plan/story`: the text of every chapter scroll (Prologue to XI, both epilogues) and the console lines between them. 38–77 words each, so every scroll fits the screen without scrolling (it holds about 110–140).
- The author decided, one question at a time: the scroll speaks to you, the god; the arc is free to revise; hooks are a secret behind the exile, a recurring stranger and a cliffhanger last line; the secret is a prophecy; the stranger is your mask; two endings by who dies; short scrolls plus console beats; one staff that changes; the prophecy is revealed in pieces, complete at VII; in X he finds out who watched the lynching; the god fears the prophecy.
- Choices made while writing, open to change: the lynching's sorceress is the seer who wrote the prophecy; the reforged staff is *Nomaleatorio*; Midas thought he was the god of the prophecy.

### 2026-11-17: Name screen hidden behind the dev tools
- Author's note (2026-11-15): after a kill with the dev tools on, only the dev panel showed. Cause: with DEV, main.js starts the game after the dev tools load, which can be after the page's load event; `initialName()` then hid the name screen and no layout showed it again. Now `initialName()` runs the layout for a new wizard. Checked with a fresh visit in headless Edge.

### Dev note handled 2026-11-17 (dev console capture moment)
```
Date: 2026-11-15 00:01
Author's note: for dev console, a button that say, camputre moment, so the tecnical detail is frozzen untile the save to file or clear is clicqued. also save to file should  clear the comment. Otherwise, notes shoudl not have technical information.
```
## Art note: dead wizard sprite (done 2026-11-17, commit bcaa33e)

```
Date: 2026-11-15 11:43
Author's note: Dead wizard sprite is not quite interesting, I think I would prefer somethin more like laying down face toward the floor, more like dead, rather than sleeping.
```

```
Date: 2026-11-15 11:23
Author's note: For artist, some tiers have the hand elevated, this was a limitation of the open source art i used in the past, we should make a couple of things: 1) make that the default position is with both hands down, and 2) hands up can be anothe rmoment for wizard, it can be related with some healing schools and perhaps another specific school defined from the begining (the natural school that the wizard can dominate naturally, without th ehelp of the staff) send this last idea to @planner to think about this system
```
(artist, 2026-11-17: part 1 done. Every tier now rests with both hands down, in all poses and animations; the hands-up idea went to the thinker notes.)

### 2026-11-17: Enemy flash before its arrival (from the journal)
- Author's note (2026-11-15): an enemy sometimes showed in its place, vanished, then came in. Cause: when its image was not loaded yet, loadNPC's draw waited for the load and landed in the middle of the arrival. Now `playEntrance()` cancels that pending draw (`cancelNPCDraw()` in render.js); the arrival draws the enemy itself and puts it in place at the end. Checked that the game loads clean in headless Edge.

```
Date: 2026-11-15 16:42
Author's note: @artist going into battle animations for hycras should be special. similar to the bosses.
```
Done 2026-11-17 (artist): each hydra got its own entrance, anim_<hydra>_enter.png; dev note written.



```
Date: 2026-11-17
From artist (approved by the author): hydra entrances, ready to wire.
Files: img/bosses/hydras/<hydra>/anim_<hydra>_enter.png, one strip each, 16 frames, played once
when the hydra arrives (instead of its normal entrance), then its idle. About 120 ms a frame.
- mother (Swamp): rises out of a green mud pool. Frames 96x96: the hydra sits 16 px in from the
  left, so draw the frame 16 px further left than mother1.png (same feet line).
- icedra (Tundra): an iceberg grows with the hydra inside, cracks and shatters. Frames 64x64.
- hydskon (Dunes): bones whirl and fly in to build the hydra, eyes light up. Frames 64x64.
Same pixel scale as the stage-1 sprites (hydskon1, icedra1, mother1): draw at the hydra's normal
scale, never stretched to a fixed box, or the wider mother frame comes out smaller.
They show the stage-1 hydra (one head).
```

## Dev notes handled 2026-11-17 (shrines)

```
Date: 2026-11-14 23:49
Author's note: When walk towards the shrine wizars is almost on top of the cross, perhaps put him some space away
```
```
Date: 2026-11-14 23:50
Author's note: when leaving the shrine, monk does not need to disapear, it can stay there.
```
```
Date: 2026-11-14 23:59
Author's note: the shrine sound is played before enteringinto the actual shrine scene. i think it better to play it when is entering the shrine
```

## Journal cut 2026-11-17

### 2026-11-17: Notes cleanup
- The author's request: fewer tokens per session. ideas.md is now this index; idea text moved to the plans or `docs/ideas/`; decisions to `docs/DECISIONS.md`; the 30 approved boss and hydra sounds recorded in SOUNDS.md (and cut from `src/dev/soundNeeds.js`); dev notes for the artist and the thinker moved to their inboxes, duplicates cut.

### 2026-11-17: Hydra entrances wired
- Artist's strips (`anim_<hydra>_enter.png`, 16 frames, 120 ms) play once in `playEntrance` (ui/entrances.js) for mother1, hydskon1 and icedra1; mother's frame is drawn 16 px left of the sprite. Hydras with more heads (wounded return) keep the old rise. Not run in a browser here (no node).

## Done 2026-11-17: general hydra entrances wired (every head count)

```
Date: 2026-11-17
From artist (approved by the author): general hydra entrances, effect only, for every hydra at every head count.
Files: img/bosses/hydras/anim_hydra_mud_enter.png (swamp), anim_hydra_ice_enter.png (tundra), anim_hydra_bones_enter.png (dunes).
Each strip is 16 frames of 96x96 with no hydra in it. Draw it ON TOP of the hydra, bottom-aligned and centred on the hydra's feet.
Keep the hydra hidden until the reveal frame (0-based): mud 9, ice 10, bones 11. The mud pond stays on the last frame (hold it or fade it).
These replace the three anim_<hydra>_enter.png strips and their one-head-only wiring; once wired, delete the old ones.
Please make them playable over a real hydra in the art dev console so the author can check them there.
```

## Dev notes handled 2026-11-17 (walk before looting, same scene)

```
Date: 2026-11-14 23:54
Author's note: we need to modify pots, boxes and chest, wizard need to walt towards them before interacting.
```
```
Date: 2026-11-15 16:34
Author's note: sometime when wizar is exploring he walks to reach the same scene. wizar only should walk if the scene is different.
```

### 2026-11-17: Art mode reworked
- Author's request: the art console was messy. Files are one table (name, what it replaces, Scene / Alt / View); game files are picked by folder or search; the alt scene sits where the console was and replays a recording of the same scene with the Alt file (or the game's art), in step with the live one; frame size found from the name, then from the pictures (neighbouring frames overlap most), with boxes to override; one viewer over the game for sheets. Also: one refresh timer for the notes box, not one per mode. Checked in headless Edge (no errors, alt scene drawn, tiers per file).

```
Date: 2026-11-15 11:51
Author's note: I don't like the Records scroll, I think this is why we have achievements. we can get rid of them. past wizard stats will be in the Cementery
```

```
Date: 2026-11-15 11:51
Author's note: For the achievments, I think we need to add the date and time where it was won, in small text and perhaps gray
```


### 2026-11-17: Shrine walk
- The author's shrine notes: he now stops a little before the cross (offset 22, clear of every zone's cross), the shrine sound plays once he is in the shrine (not before he walks there), the mystic stays while he walks back out to the left and goes with the scene. The 'not walking to or from shrines' note predated the walk-in and walk-back. Checked by a headless playtest run (no errors); not watched in a browser.

### 2026-11-17: Hands down at every tier
- Author's request: the flame in the raised hand (magic tiers) and the hands that were not all down. All tiers now rest with both hands down, arms recoloured per tier; the flame shows only in the cast animation, held in the lowered hand. Author's choice: tiers 0 and 10 look alike and differ in the attack. The cast no longer has a flame by the hand; the spark at the staff tip stays. A hands-up pose would be new art (see the thinker's inbox).


## Dev notes handled 2026-11-17 (charger wait, dream follows the scene, hydra note removed)

```
Date: 2026-11-14 23:48
Author's note: enemies that charge need extra time to be back to the position before wizard attach them, aatack is vissiable even without the enemi is in position
```


```
Date: 2026-11-15 11:39
Author's note: dreem scene do not respect the reposition of the scene view when stats or other UI scroll are opened
```


```
Date: 2026-11-15 11:54
Author's note: I noticed in the bestirary a note about the hydra, we dont need that. remove it.
```


### 2026-11-17: Hydra entrances redrawn
- Author approved ice option A (icedra-style peaks, burst frames 10-15 unchanged, reveal frame stays) and the mud burst without the pond (its fade-out was not polished). Option B rejected. Swapped the two strips, fixed the HYDRA_FADE comment; fade logic untouched.

```
Date: 2026-11-15 11:26
Author's note: dev we need 2 or 3 ways the enemy mages appear, the current is fine, but we could do one like fading in, another only for rares and bosses is can be a portal type animation send request to @artist about tthis animation
```

```
Date: 2026-11-15 16:37
Author's note: dreams are quite frequent, we need to reduce them
```

### 2026-11-17: Walk to the loot, never into the same scene
- The author's dev notes: he now walks up to the bag, barrel, box, chest or pot and stops just before it (LOOT_STOP), opens it there, then walks on into the next scene as after a statue. Exploring could walk him out and back into the same scene: the stage was never updated on an in-zone move, so the next move could pick the background already shown; it is kept now, and newStage never rolls the stage he is on. Checked by a headless playtest (3 seeds to level 60, no errors); not watched in a browser.

## AUTHOR_NOTES: ticked items (cut 2026-11-17)
[x] ~~looking a inn need to be compose for two scenes, one walk to the scene where the actual entrance of the inn is (if not visible in the current scene), then enter by the door.~~ (done for the Town and City inns and dice houses: the street with the door, then in; the Desert inn has no door on its streets) Author note: yes, it is a blue,yellow tent the inn in the desert
[x] ~~boxes and other breakable items appear in a very werid way, when the wizar is already in the scene. I think we need to compute what the next scene will have before showing the scene, and then when the wizard goes into the scene the box or breakable is already there.~~ (done: the next scene is built with the container already in it, he walks in and up to it, opens it, then walks on)
[x] ~~Not sure but it wizard is not walking towards or away frm the shrines. This is a bug~~ (done: he walks in from the left to the cross and back out to the left)
[x] ~~in altars, due to its nature, i tis better to return the wizard walking to the left~~ (done: he leaves the shrine walking left, the way he came)

## Art notes: handled (cut 2026-11-17)
```
Art test
Scene: Enemy: arrival: animalejo17 (wizard tier 0)
Speed x1, crisp pixels on
Viewer: A anim_god_death.png (local file)
Frame 1 / 1 (1664 x 56 px), zoom x2, backdrop mid
Date: 2026-11-15 16:12
Author's note: @dev art console is quite confusing.  please clear things  up
```

### 2026-11-17: Records retired, achievements dated
- The author's two dev notes: the Records page and its tab are removed from the stats scroll (the stats it read stay; the Stats page and achievements use them). An achievement now stores the time it was won and the list shows it in small grey text; ones won before this show no date. Also ticked the breakables item in AUTHOR_NOTES (fixed earlier, never ticked). Checked by a headless playtest (3 seeds to level 40, no errors); the scrolls were not opened in a browser.

### 2026-11-17: Chargers get home first, the dream follows the scene
- The author's three dev notes. Chargers (capricorns, taurens) took about 2 s to paw, dash, ram and trot back, but a battle step is 1.5 s, so the wizard cast while they were still running home; now a move longer than a step holds the game's clocks for its tail and the wizard casts about 0.15 s after the enemy is back (shorter moves unchanged). The sleep dark with its dream, and the boss scene-spell layer, now follow the scene when a scroll opens or closes. The hydra explanation under the bestiary's Secrets is gone. Checked by a headless playtest (3 seeds to level 40, no errors), which skips animations, so the charge and the dream were not watched in a browser.

### 2026-11-17: Mages fade in or step out of a portal, fewer dreams, dev pickers
- Two author notes from the dev inbox. Random dreams drop from 15% to 5% of rests (story dreams unchanged). Enemy mages flicker or fade in at random; rare mages (Evoker, Sacred wizardess) come through one of the artist's three portals (a purple, b blue, c red, at random); of the bosses only the mages do: Doria blue, King Midas golden, Rainbow multicolour, bigger strips (all six strips drawn by the artist and wired in; a code stand-in plays if a file is missing). Boss portals at 70% of the strip so the whole boss shows, and the boss grows from the portal's centre while it turns. The review drop moved outside the project (wizardidle-review/, still review/ in the dev tools) and tools/land.py lands work branches on dev-repo after every commit (hooks in tools/hooks). The dev panel's Wizard and Fight now buttons became pickers (wizard, bosses, hydras, enemies by sprite or random by attack, rare, arrival, each with a forced arrival); scenarios are one list. Checked by a headless playtest (3 seeds to level 40, no errors) and a headless page load (panel builds, no console errors); the entrances were not watched in a browser.

### 2026-11-17: Scene spells wipe themselves, faster arrows
- Two author notes. A scene spell (rain, poison cloud…) sometimes stayed on screen forever: boss and hydra scene spells were drawn by the enemy's animation clock, which other animations (a hit, a death, an entrance) replace, and then nothing cleared the layer. Scene spells now run on their own clock, and a clock can carry a clean-up that runs however it ends (finished, replaced, stopped, or every clock stopped when the wizard dies). Arrows fly 60 px every 50 ms (was 36), 3 frames instead of 4. The flicker note was dropped (the author no longer sees it). Checked by a headless playtest (3 seeds to level 40, no errors), which skips animations, so neither change was watched in a browser.

### 2026-11-17: The Cemetery becomes tombs
- The author approved the artist's five tombs (A-E), their cracked versions, a 3 x 5 carved pixel font and a small parchment note (img/ui/cemetery/). The Cemetery page of the kill scroll now shows one tomb per dead wizard, newest first, each always the same design (picked from his name and birth), with his name and age carved by code (8 characters a row, long names cut, ages as 1.2K / 3.4M). A tap opens the note with level, age, victories, falls and dates. Records with erased (set only by the final battle, not built yet) get the cracked tomb, the name upside down and crossed out. Dev panel: Cemetery, add or remove ten sample tombs. Checked by a headless screenshot of the page with the samples and a note open, and a headless playtest (2 seeds to level 20, no errors).

### 2026-11-17: Dev note cut (reload)
- 2026-11-17 15:22, "when the game is reload, sometimes the previous enemy is in the enemy position": done with the clean scene on reload.
```
Date: 2026-11-15 11:23 (moved from the art notes, 2026-11-17)
Author's note: hands up can be another moment for the wizard, it can be related with some healing schools and perhaps another specific school defined from the beginning (the natural school that the wizard can dominate naturally, without the help of the staff). Think about this system.
Artist, 2026-11-17: every tier now rests with both hands down. The tiers that held a flame in the raised hand now show it only in the cast animation, held in the lowered hand. A hands-up pose would be new art.
```

```
Date: 2026-11-17
Author's note: time away from the game. The player is a god: when the app is closed he cannot see the world, other gods are there, time does not belong to him. So nothing of the scene comes back on reload (done: the scene starts clean), but the time away could change the wizard. Short absence (a few days): same level and region, gold and faith change a little. 1 week to 1 month: he may even gain some levels, without triggering any important story factor or event. More than a month: the same, but the chance that the wizard is permadead grows. Discuss a little with the author before planning.
```
(handled: plan in docs/AWAY.md)

### 2026-11-17: Belief dreams, written, decided and built
- The author's note "some dreams can increase believer score", with the wish that dreams never repeat. The story side wrote a pool of dreams in docs/ideas/dreams.md: light dreams, callings for doubters, nightmares, fall dreams, general chapter dreams and echo dreams, plus six story-linked chapter dreams kept for later. The author decided (docs/SLEEP.md, Belief dreams): belief dreams give +1 Devout/Believer, +2 Doubter, +3 Atheist; nightmares take 1 only from a Believer or Devout, never below the Believer line; every weight in config for playtests; a shuffle bag per pool and per wizard, so no dream returns before its whole pool has played; no wake line. Built the same day: src/dream.js (shuffle bags saved per wizard in state, the dream-or-nightmare split by belief level, belief effect run in simulation too with the real RNG), the full pool in src/data/dreams.js, every number in config.belief and config.balance. Fall dreams by healer or alone (the rescuer pool waits for rescuers). Echo dreams join after an erasure (world.erasures does not exist yet).

Dev note (done 2026-11-17):
```
Date: 2026-11-17 13:03
Author's note: prologue scroll should be visable only when the game load, so in the button we can see the scene, not before.
```

Dev note (done 2026-11-17):
```
Date: 2026-11-17 13:05
Author's note: remove phisical  attack from our wizard, it is a wizard after all. only spells
```

### 2026-11-17: A Texts mode in the dev tools
- The author asked for one place to see every text of the game in its real context and edit it live. Modes > Texts lists Chapters (read from docs/STORY.md, slot variants picked in the panel), Dreams (by pool) and Console (phrase lists read from the game code and zone legends, plus the story's console beats). The picked text shows in the chapter scroll, over the dark of the night, or in the console printed as the game would; the author notes box becomes a taller editor and every edit shows at once. Texts are HTML; `[sprite]` is an icon and `{name}` the wizard's name (src/ui/text.js). Save to file appends to docs/history-notes.md; the code is updated from there. Dream lines in the game became HTML over the dark for this, so styled dreams look the same in play.

## Author notes done (cut 2026-11-17)

[x] ~~poison cloud scene spell is quite anoying is not disapearing, we need a better way to disapeer it, kind of disipating.~~ (done: it was every scene spell, rains too, now and then; they rode on the enemy animation clock, other animations replaced it and nothing wiped them; now they run on their own clock and wipe themselves however they end)
[x] ~~arrows need to be faster~~ (done: 60 px every 50 ms, was 36; the flight takes 3 frames instead of 4)
[x] ~~cemeentery each wizard should ahve a tumb with their name and perhaps age, touch extend information.  ERASURE follow rules, i think it is invert and crossed name and perhaps a cracked tomb. maybe 4 to 5 tombs desings with each one cracked just in case.~~ (done: the Cemetery page shows a tomb per wizard, one of the five designs, name and age carved; a tap opens a small parchment with level, age, victories, falls and dates; an erased wizard lies under the cracked version, name upside down and crossed out)
[x] ~~some dreams can increase believer score~~ (done: belief dreams and callings raise belief by his level, nightmares sow doubt; shuffle bags so no dream repeats)
[x] ~~if a battle is interrumpted because i close the game, when i start again previous content (enemies, runes, etc), in in place~~ (done: the author chose not to restore anything, the god can't watch the world while the game is closed; the scene now starts clean, no enemy or object left standing from before. The idea of time away changing the wizard went to the thinker)

## Dev notes done (cut 2026-11-17)

```
Date: 2026-11-15 16:38
Author's note: sometimes the wizard spend so much time in a given zone. we need to avoid that, I think createing scenes with the other zoner will help to revolve this.
```

```
Date: 2026-11-15 16:40
Author's note: if the wizar is already in the dice games, why exit and go again, we need to check the way to evaluate the next destignation in the gampling house, that is the actual gambling house, wizard skip leaving and play another round
```

### Dev note done 2026-11-17: bestiary headings

```
Date: 2026-11-17 20:03
Author's note: when the game start it says no creature defeated yet but it puts bosses and Secrets, only add bosses when the first boss is encountered, and only put secrets when the first hydra is found
```


### Dev notes done 2026-11-17: enemy leaves when the wizard falls, boss entrances

```
Date: 2026-11-17 14:51
Author's note: we need to think a way to remove the enemy when the wizard is beated. i think an approach like ethe entrance is ncie, rather than animation, just math and other programatic way
```

```
Date: 2026-11-17 14:52
Author's note: magic bosses, or flying bosses, need to have similar entrances thatn mages and flying enemies. regarding bosses likes fenix, they need t fly. enemis like kkck can grow from the grown, other boses that can jump or slam, can enter jumping.
```

### 2026-11-17: A reload starts a clean scene
- The author's note on a battle cut short by closing the game. The author chose not to restore it: the player is a god who can't watch the world while the game is closed, other gods are there, time isn't his. The real problem was the leftovers: the sprite on the right of the scene (state.npc) was saved and drawn as the page loaded, so a hydra or an enemy stood there doing nothing. It is now forgotten when the save is read (src/state.js). The author's next idea, time away changing the wizard (a little gold and faith, levels after a week, a chance of permadeath after a month), is in the thinker's inbox.

- [x] (done 2026-11-17) Fix the rest message (v1 text bug): `wakeUp()` in `events.js` counts the recovered HP twice when choosing it, so "feels totally renewed" also shows after a partial rest.
- [x] (done 2026-11-17) Queue chapters first: with the keys fixed, consecutive levels will have chapters (128–129, 139–140, 149–150, 199–200). The chapter-race fix keeps one chapter at a time, so a second chapter opening while the scroll is still closing would replace the first one's text.
- [x] (done 2026-11-17) Fix the chapter keys in `src/story.js` (a v1 bug, kept so stage 1 doesn't change gameplay): `lvl60` and `lvl90` appear twice, so the later entries (Chapter IX and X, meant for levels 160 and 190) replace the earlier ones and show at levels 60 and 90; Chapter IV never shows. `lvl99` should be `lvl199`, and `lv200` (missing an `l`) means Chapter XI never fires.

## Wired 2026-11-17: hydra entrances (SOUNDS.md)

Each file fuses the author's two sounds: the "inf" sound from the start of the entrance, the "burst" placed where the hydra shows (its reveal frame; the "inf" fades out over 100 ms from there). Plays with the entrance from frame 0 (playHydraEnter in `src/ui/entrances.js`); approved and wired: snd/creatures/hydra_*_enter.ogg; the generic `hidra` sound now plays only when a head regrows (the author dropped the landing sounds for hydras).

| Game sound | Sources | Burst at | Cut | Volume (fade) | Landing sound |
|---|---|---|---|---|---|
| hydra_mud_enter (mother) | inf_hydra_swamp.mp3 + burst_hydra_swamp.mp3 | 1.08 s (frame 9) | 0.000 s to 1.500 s | 0.3 (fade in 0, out 30 ms) | Nature (spellChispasGreen_8), heard |
| hydra_ice_enter (icedra) | inf_hydra_ice.mp3 + burst_hydra_ice.mp3 | 1.20 s (frame 10) | 0.000 s to 2.500 s | 0.6 (fade in 0, out 30 ms) | Frost (spellChispasBlue_8), heard |
| hydra_bones_enter (hydskon) | inf_hydra_bones.mp3 + burst_hydra_bone.mp3 | 1.32 s (frame 11) | 0.000 s to 2.100 s | 0.3 (fade in 0, out 30 ms) | Shadow (spellMaldicion_8), heard |


```
Date: 2026-11-15 16:43
Author's note: @artist, comming from the ground generalized animation need to be a little more expresive
```

## Dev note done 2026-11-17: elementals arrive by their element

```
Date: 2026-11-15 11:53
Author's note: For elementals, I changed my mind; the entry to battle should be linked to its element, perhaps animate them adequately.
```

Done: the "element" arrival in src/ui/entrances.js (fire pillar, lightning strike, ice that shatters).

```
Date: 2026-11-17
Author's note: for @artist, the hydra swamp (mud pool) exit animation (img/bosses/hydras/anim_hydra_mud_leave.png, the mother hydra sinking into her mud pool) is not the best. Let's come up with another idea: propose a few options for the mother hydra's exit, the author picks one.
```
Done 2026-11-17: the author picked option D (dive splash) of four; it replaces anim_hydra_mud_leave.png.

```
Date: 2026-11-17 (done 2026-11-18: option D wired in, white plate, dark text)
Author's note: @artist, art for the XP bar and the line under it (the heading above the scene).
Today: the XP bar is a plain HTML <meter> (white bar, index.html #XPprogressBar); under it the
indicators line (#indicadores): level, heart + HP, gold + gold, spirit + faith, as text with the
existing icons img/ui/heart.png, gold.png, spirit.png.
Wanted: something that fits the game's look instead of the white thing; perhaps a little frame.
Ideally one design that holds both the bar and the indicators (a small plate or band), quiet
enough that it never pulls attention from the scene.
For dev, so it can be wired:
- The bar must stretch: upright it is about 70% of the scene width and 3.5% of its height; on
  phones held sideways about 95% wide and 3% high (src/ui/layout.js). So draw it in pieces: left
  cap, a middle tile that repeats, right cap, and a fill tile (plus an empty-track tile if needed).
- The numbers stay HTML text (they change all the time); the art is the frame / backing plate
  and maybe new small icons if the old ones clash.
- Match the palette of the existing UI (img/ui/frame.png, console.png, the scroll parts).
Process as usual: several hand-drawn options first, the author picks in the art dev console, then
the final pieces go to the review drop and to dev to wire in.
```

```
Date: 2026-11-17
Author's note: time away, decisions are done (docs/AWAY.md, Open questions 1-7). Finish the feature:
1. A reloaded soft-dead wizard must stay down: no weak self-revive; only the god's touch lifts him.
2. Protected chapters (STORY.md true-death rule): no soft dead and no permadeath from absence there, silently; gold and faith still drift.
3. The saving touch gives the usual free revive faith (FAITH.md).
4. Soft-dead console line is candidate 1, with the {zone} filled in.
5. Poem: a bag of poems that never repeat in one world (shuffle bag like the dreams); shown over the dark scene like a dream, not a scroll. Keep the placeholders until the author/historian writes them.
6. A hidden page is settled by calculation on return (no slow-motion game). Keep the live game stopped while hidden. When the page shows after a long absence play one return sound (see sound-notes).
```
(done 2026-11-18: points 1 and 2 built; 3 to 6 were already in place; the return sound waits for the musician)

[] we need a place to show the inventory i think in the stats, another scroll
[] faith related aspects is empty we need to put things there, probably a beliefmeter should be there 
(done 2026-11-18: Inventory page as a second page of the stats scroll, with the staff, gold and artefacts found; the Faith section of Stats gained a belief meter bar)

[x] ~~use a tool such as https://github.com/ChristosMaragkos/Oggify or a permanent created script to transform mp3 to ogg. never use tokens to do each transformaion from scratch~~ (done: `python tools/to_ogg.py <files or folder>`; see its help)
[x] ~~thanks https://ko-fi.com/dragonstudio for a bunch of sounds~~ (done: in the help scroll's sound credits)
