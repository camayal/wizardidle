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
