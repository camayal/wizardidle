# Dev notes

The one notes file: new improvements, bugs, and the author's talk with dev. Notes saved from the dev tools' notes box (dev mode) and typed ones, newest last: the date and the
author's comment (technical details only when a moment was captured). A later note on the same test replaces an
earlier one.

## Open items from the old play-test list (2026-11-18)

[~] some new enemy attacks need some sounds (the first table is wired 2026-11-18 and waits for your ears; left: the second table's boss/hydra moves, whose files are not cut yet, and the moves still to choose; docs/SOUNDS.md)
[] create scenes that are the end of one ad the beginon of the otherone. (planned: docs/plans/MAPS.md, border scenes)

- Own music (2026-11-18): built as code, no WAVs: Music mode in the dev console (src/dev/music.js, src/synth.js, songs/). Still open for the author: where songs play in the game, stingers only, loops, or both (musician suggests stingers first). The musician can drop songs as <name>.song.txt in the review drop.
- Map revamp, Prairie creek, bridges: planned in docs/plans/MAPS.md (map ribbons built; ground map spots still to re-check against the new art).

- Achievements (2026-11-18): libros, runas, tabernero, tocado and the eagle are now wired (tocado = 100 god touches in config.touchedAchievement). Still to do: re-run a playtest and tools/odds.py to confirm the tiers; capricorreturns and namesake are only rare by design.

- Idea (author, 2026-11-19): nudging from the god. Clicking a door, gate, cave entrance and the like raises the chance that the wizard takes that path next. The wizard can reject the suggestion and carry on his own way, and then the faith spent is wasted. Design questions for thinker first: faith cost, how much the odds rise, how often he refuses (belief level?), and what the player sees (console line, door glow).

- Travel graph, for later (author, 2026-11-19): the graph starts blank on purpose (config.travel.manualLinksOnly = 1: tools/travel_graph.py makes no links, every link is set by hand in the Travel mode; 0 brings the computed ones back; the old curated verdicts are in commit 18743d0). The game still does not use the graph (travel.js). The new underground points future_cave_NW (60,44), future_chamber (80,132) and the connector ladder_cueva4_mina2 (112,162) have no links yet and wait for the author's scenes and links. The (130,120) volcano mouth must not link to the lava chamber: the chamber is entered only through la_Mina2.

- Future and connector scenes, open questions (2026-11-20): the artist drew 27 future scenes (review drop `scene_future/`, one file per travel point; future_chamber, both Heidan ones, la_Pradera_lago and pantano_fueracastle approved by the author) and 31 connector scenes (`scene_connectors/`: bridge_spring/south/swamp _west/_east, pier_land/_end, stairs_s/n _base/_mid/_top, mouth_<x>_<y> and _under, enter_mine_S, ladder_cueva4_mina2 _cave/_mine). None is wired into the game (no zone/scene entry yet; index.txt lines have replaces `-`). Questions to settle with the author, one at a time:
  1. Walk line: the artist drew surfaces on rows 34-60, bottom strip from row 42 clear, without knowing the real feet row range. Dev to give the real range and the artist to adjust if scenes block it.
  2. Mouths: the artist guessed cave, mine or volcano for each from the underground map colour; check each (147_31 swamp cave, 27_114 Prairie cave, 87_224 Duenon cave, 229_64 / 33_165 / 218_182 mines, 130_120 volcano). Mine insides reuse the crystals of la_mina2; doorway light is only a small patch.
  3. Stairs are seen from above (shaded steps rising right), not in profile: accepted? Heidan8 and Heidan9 sit on the cloud's south edge, drawn without it.
  4. Border scenes are drawn one way (old zone on the left): are mirrored copies fine for walking back, or draw them?
  5. el_Pantano_fishing keeps a few low reeds: leave or remove? la_Pradera6 and la_pradera_n_dunasS also lost a stray twig (shared grass texture): keep?
  6. Duenon corruption (author): el_Duenon7 is the rancid waterfall; the author wants Duenon visibly sinking into the underworld across the whole map later (note kept in docs/art-notes.md, do not cut it). future_chamber is based on the current Volcano and may need retouching if the redrawn Volcano is approved.
  7. Wiring, still open: the connectors (bridges, mouths, stairs, ladder, pier) as scenes on a trip (ideas.md 2026-11-19). Keep the pathfinder (docs/TRAVEL.md) for the story. The future scenes are stages now (2026-11-20).

- Update to the scene questions above (2026-11-20, later): the six bridge scenes were redone as one 512px picture per bridge cut in half at the seam (`_west` + `_east` line up when shown side by side, so the game must show them as neighbours with no gap); the deck covers rows 34-60 and the river shows only behind it (rows 12-33). All ground mouths (147_31, 27_114, 87_224, 229_64, 33_165, 218_182) were redrawn bedded into their terrain, and mouth_130_120 now sits in a basalt slope at the back. Still open for the author to review in the drop (`scene_connectors/`, `scene_future/`): the redone bridges, the bedded mouths, the stairs (seen from above), the pier, the ladder scenes, el_Duenon7, el_Pantano_fishing, el_Pantano9_fueracastle, la_Pradera_northTown, la_Pradera_fueraCity, future_cave_NW, pradera_pantano_E/_w. New questions for the author: (a) the bridge halves must be shown as one place: should the game join them in one wide scene or just place them next to each other? (b) which scenes keep the shared grass texture twig removal, (c) does each connector pair need an exit marker drawn (path, gate) per SCENES.md "exits are drawn in the scene"? The author left the computer unattended on 2026-11-20; nothing is wired into the game.

- ladder_cueva4_mina2 mine side: floor shaft x 101-143, y 47-62 may sit on the walk line; revisit walkable path later (artist, 2026-11-20).

## Next for dev: connectors as scenes (2026-11-20, updated)
Built and committed, all untested in a browser (no node in the dev session): bridges, stairs, cave and mine mouths, the ladder, enter_mine_S (a guess: the tunnel behind mouth_33_165's underground side), and the pier (dead end, 3 s stop, back left). Code: src/data/connectors.js (scenes, mouth and ladder opening x read off the art, pier steps), travel.js (crossing, connectorTests, visitPier), render.walkAcross (steps: dir, start, end, fade, pause), travelGraph.connectorsBetween / reachesPoint. Connectors play only on trips that change zone (City, Town, Castle sub maps will fix the shared gate points later). Dev panel > Connectors forces any walk (ends the running event first).
- 2026-11-20: the walk stopping on connector scenes (wizard gone) is fixed (map dot lookup threw); bridge and mouth walks verified in headless Edge (a temp page importing render.js, hasFocus forced true). The author can only test in the dev panel, so check the rest there.
- First: the author tests every walk in the dev panel's Connectors list and real trips (Poblado to Pradera over the bridge, Desierto to Heidan stairs, Dunas to the south mine, Cueva4 to Mina2 ladder): check openings (mouthDoors), mirrored east-to-west strip, fade timing, wizard standing place after arrival, the pier visit (config.balance.pPier 0.08, PIER_STAY_MS 3000, placeholders).
- Connector scenes as scenes (2026-11-20): registry done (connectorSceneInfo: point, label, n of m; map dot, map title, console line). Author also asked for 'events inside' and 'each scene a stage entry': NOT done. Stage entries in places{} would be read as stages by the pathfinder (reachesPoint skips places[n]) and the Travel tool, so they need a design first; events inside needs the thinker (chance, how long a scene lasts, which zone's enemies, mirrored cast).
- Fights inside connector scenes: not done. When a fight happens in a mirrored (east to west) scene, mirror the wizard cast, spells, scene spells, enemy entrance and attacks only (never the art); a flag like ui.facing read by those. Start small, extend if it looks good. Open: do enemies appear in connector scenes at all, and how long a scene lasts.
- Jumps and teleports: later (jump the shaft; about level 100 short teleports to hop obstacles and reach other scenes). Floor shaft of the ladder mine side may sit on the walk line.
- Still open from the author: bridge halves shown as neighbours with no gap (done by order, no joined wide scene); exit markers drawn per connector pair; enter_mine_S placement.
- Test the front overlays (la_mina6, la_mina7) and the new stages in a browser.
- After that: la_playa zone data (docs/plans/MAPS.md step 5).

```
Game test
Wizard: level 50, HP 166 / 166, gold 465, faith -2104
Zone: Beach, stage 3
On the scene: lamia (boss fight)
Speed x1
Date: 2026-11-20 22:41
Author's note: spell powers of both bosses should match the color of the sea
```

```
Date: 2026-11-20 22:48
Author's note: la_Mina2 rail road only should extend to the right of the scene a little bit, never reach the left (following the map art)
```

```
Date: 2026-11-20 23:02
Author's note: improvements for travel dev console 
- similar to art dev console, add another scene viewer called target, source will be in the top in the actual scene view, the target scene will be display in the target.
- now conectors have actual scenes, i would like to see the scenes when the conector is selected, most conectors have 2 scenes, put them in source and target
- if the conector has more than 2 scenes, add more scener viewers
- move all the buttons from the left of the map to the button of the map and expand the map  and the console a little more, to try to utilize the max space of the screen, i need to see that map large
- another function called optimous path, when I select target and one and only one source, use the pathfinder algoritm to identify the path. remember this will be used in the future for the wizard to reach important destinations.
- be sure to have values of the lenght of the edges of the graph, we need to convert them in sort of unity, for example for xx px we need 2 or 3 dynamic scenes
- remove note box, instead the author notes recover technical info about everythign it is in the travel dev console so I can use the normal author notes to comunicate about the map, scenes, travel, etc.
- edges should have outline, see green lines in a green praire is dificult
```

```
Date: 2026-11-20 23:04
Author's note: las_Dunas2 already have a cave entrance, we need  to decide what to do with this:
1. remove that entrance
2. make a room for example a merchants undergrown shop and inn (prefered)
```

```
Date: 2026-11-20 23:15
Author's note: Important to work in submaps, ideas:
1. locations: city, town, castle (areas in castle), perhaps tower (in this rather than places we can have floors and rooms)
2. revamp tower image in the map, not to be more exagerated but to be kinda recognizable
3. create a city map with streets, two gates, northwest and southeast, wall and and decent size. the this map should be added to the existent map, two options: 1) replace the full ground map fo rthe one in the city, more detail and nicer or 2) create a little patch of scroll, perhaps 3/4 of the normal map size and put on top of the map with a pin (kinda better).
4. Town, very similar to city, but this is not walled town, adobe houses plus some huts, etc
5. in the castle we can make two floors with different rooms, add stairs (conector similar to mouths), this would be 2 maps, one put on top of the other one a little bit not pefflyeny alingned
6. in the tower we can make 7 floors with at least two rooms in each floor plust stairs (conector). this will need 7 maps, one per room
7. not sure if 5 or 7 we can create some planes rather than "realistic map", perhaps that is the way to go

Additionnal not about map and submaps. those will be only discovered when the wizard enters to the place the first time, parts of the city map can be already discovered and some floors of the  tower (he lived in both places), but we need to introduce the fog system, that only discover when the wizard visit the region.
```

```
Date: 2026-11-20 23:18
Author's note: faith is being a problem with inactive games, the faith falls quick and it is almost not oportunity in getting more. sent [[wt how to improve the believer and faith system
```

```
Date: 2026-11-20 23:19
Author's note: whe tinted glass is not easy to read, perhalps a little stick that move and inciate that it can move, replace the simple diamant for something more visible. candel stil is nice touch.
```

```
Date: 2026-11-20 23:20
Author's note: in all wizard achievements, put instead of Earned by, First earned by:
```

```
Date: 2026-11-20 23:21
Author's note: work on the etmos boss split
```

```
Date: 2026-11-20 23:22
Author's note: Send to [[wt, better ways to improve the emotion of the game other than collecting all the things?
```

```
Date: 2026-11-20 23:26
Author's note: idea for the end if the player god is dead. it is an  desintegration animation, when the animation is getting to the end, 1 frame before , the entire ui start fading out and get completly black the whole screen, no announcement no nothing, god has died, no response, no text, no what happened with the world, literarly the god died.
```

```
Date: 2026-11-20 23:29
Author's note: send to [[wt, we need something nice, such a missions:
- some can be assigned by wizard himself, for example pick ingridients, get more gold, something, i think we need to design some learning algoritm here, perhaps genetic algornitm to give some "inteligence"
- some task in we can asign in the faith screen, most of them to booth the faith points
- some given by npc in taverns, inns or merchants
- when a secret is found, wizard is mostly focus on that, looking for something, it is why we need to keep checking pathfinder to give some movement purpose
```

```
Date: 2026-11-20 23:31
Author's note: send to [[wa in la_Pradera9 the far away tower should be in a kinda hill, same the trees on the left, so in the horizon we can do a kinda elevation and only the base of the tower is visible
```

```
Date: 2026-11-20 23:32
Author's note: texts dev console is failing sais invelid or unexpected token
```

```
Game test
Wizard: level 13, HP 147 / 221, gold 1621, faith -862
Zone: Dunes, stage 3
On the scene: skeleton (boss fight)
Speed x1
Date: 2026-11-21 09:56
Author's note: Before some scene, this boss disappears and appears
```

```
Game test
Wizard: level 13, HP 22 / 221, gold 1537, faith -862
Zone: Tundra, stage 3
On the scene: rainbow (boss fight)
Speed x1
Date: 2026-11-21 10:07
Author's note: for this boss, i would like to add another special events:
1. appear rare npcs in the following sheet C:\Users\camayal\OneDrive\Documentos\GitHub\wizardidle-old-ideas\unorganzed_sprites\dark-skelets.png
2. these rare enemies only apper once and they are take off of the pool of enemies. 
3. these enemies will come when enemies or bosses events are triggered
4. we can add an artefact to increase the chances of find one of those policorlor  school spectros.
5. those are secred enemies.
6. we need to be sure all colors found in the boss Rainbow are represented, so modify the sprites accordently.
7. when all of them are dead we need to change the animation of the entrance of this boss when it will appear for firs time, we make that all the specturm sprites (a little translucid) come from multiple directions to the enemy position and them a fash of all the raimbow color and then the boss Raimbow appears.
8. from this point in this region the raimbow boss is the one that will appear using the portal as it is today.

art notes: we need some spectrum created to match colors of the raimbow:
Red
Orange
Yellow
Green
Blue
Indigo
Violet

in the sprite, we have some already, their attasks weill be light school mostly with the color they represent, those are only found in Tundra region of course.

anotehr art change is the current Rainbow boss, the cape is yellow, we need to die it black to match the spectrum
```

```
Date: 2026-11-21 10:09
Author's note: Create art and events for carabans and random healer npcs, they should walk from right to left to reach the wizard sometimes, not all times the wizard fell to help the wizard. wizard continues his way, lose some money.
```

```
Date: 2026-11-21 10:14
Author's note: big dramatic change, only reserverd for v.3.0.0 send to [[wt.
double the size of the scene screen, no animations, no sice of things, just souble to finish the tip part  to allow to finish the scenes, for example to of the trees, entire buildings, big mountans, tower, and the most important add sky details, like moons and suns cycles
```

```
Date: 2026-11-21 10:23
Author's note: quests ideas:
- Wanted type of quests, hunt a given rare or even boss enemy (this increase the changes of finding them a little, not too much because it getting easy, but not as regular because will be boring)
- Get special ingridients from some enemies, they can be drop anytime, so if the wizard has them in the inventory the wizard can give them , avoid to have spoilable ingredients
- Explore some zones
- Fishing quests
- Crafting quests
- Find runes, books, or statues to study them
```

```
Date: 2026-11-21 10:25
Author's note: We need a simple AI for battle system, now is just random and the survaibalility of the wizard is very low, healing, protective spells, etc. but i dont want the wizard is fully invincible, bosses need to be almost 90% killable with god help, regular enemies 100%, rares 95, so in that way the god has a purpose
```

```
Date: 2026-11-21 10:26
Author's note: More quest ideas related with faith:
- Chances of have quest to get good amount of faith in the shrines
- Short peregrinations, for example visit 3 shries in different zones
- Find very hiddent shrines (such as vulcano)
```

```
Date: 2026-11-21 10:28
Author's note: More ideas for economy quests:
- Deliver things from one inn to another (some of those quest need to be reduced the chances when the wizard is in almost final levels, at that moment, only killing or selfimprovement quests should be done.
```

```
Date: 2026-11-21 10:52
Author's note: Ideas for dynamic scenes. The current model is having all dynamic, with the last change in travel system i think to much randomization will be bad, better to have some ideantity with areas that are common.

So here are the most updated ideas of dynamic scenes:
- Dynamic scenes will be build based on rules, where things can go or not  and what features should be added in relation with the map.
- Dynamic scenes (DS) will be to give the ilusion of traveling distance from one fixed scene to another. for example moving in the praire is usually pretty free and involve long distance, using the edge lenght we can calculate an estimate or intermediate dynamic scenes between two already selected fixed scenes.  for example la_Pradera1 to 6 require perhaps one intermediated DS, while go to 11 would require perhpas 3 DS
```

```
Date: 2026-11-21 11:10
Author's note: for Etymos boss idea, i will need to remove some regular enemies, now ccalled la_esencia, not all numbers are the ones we need to remove from the normal la_esencia pool, only the ones that are very symilar to the etymos

reminder, when etymos is destroyed for first time, this boss will be out of the game then it is repaced for all the other mini bosses, they are more like a Rare type of strengh rather than boss level of strengh
```

```
Game test
Wizard: level 17, HP 183 / 297, gold 2571, faith 2714
Zone: Beach, stage 5
On the scene: lamia (boss fight)
Speed x1
Date: 2026-11-21 11:13
Author's note: we need to wire specieal animations created for the lamia boss attacks
```

```
Date: 2026-11-21 19:42
Author's note: dice house should be a specific location so we need to screate scene in the city and in the town for them. we can also play dice in the desert inside the tent (tent is inn, tavern, gambling house)

one intersting thing we can do is red dice are for the city, wooden dice are for the town, and some make of bone (white yellowish) for the desert.  

perhaps we could create another game, such as shut the box,  sevens,
```

```
Date: 2026-11-21 19:44
Author's note: regarding the dice house. the current version shows the dice as decoration, perhaps put a table next to the npc player, then the wizard approach and tiny dice are trwow there, i think this wil e a little more fit in the actual game play
```

```
Date: 2026-11-21 19:45
Author's note: Taverns need to be redesigned by [[wa, the new walk line makes the wizard walk about the tables.
```

```
Date: 2026-11-22 09:27
Author's note: [waits for art: el_desierto_tienda asked from the artist in docs/art-notes.md, 2026-11-24] important, in the desert make the way wizard enter to the inn is first showing the tent, now he just move from any scene in the desert to the actual inn
```

```
Date: 2026-11-22 09:29
Author's note: i am thinking that reviving the wizard by touching him is actually penalizing him by removing him from his track (cabin will leave the wizard in many places. we need to be sure to dev soemthing that mke him to be relased close on in the region he was when hi is doing a quest
```

```
Date: 2026-11-22 09:30
Author's note: idea for [[wt healing him will cost less than attacking enemis
```

```
Game test
Wizard: level 25, HP 371 / 454, gold 3796, faith 5513
Zone: Duenon, stage 3
On the scene: nothing
Speed x10
Date: 2026-11-22 09:37
Author's note: regarding god touches, attacking directly bosses, also boost belief (healing in normal and rare enemies, still)
```

```
Date: 2026-11-22 09:44
Author's note: beach scenes are interesting but it is weird the transitions, i think we need to be sure that during our dynamic scene implementation we do sintermeditate scenes where the walk line is beach and the rest on top is ocean, then before the next scene we need to transition with another scene to a more away from the ocean scene so the following scene has a good fit with the current fixed beach scenes
```

```
Date: 2026-11-22 09:47
Author's note: i was thinking in anothe mouth that conect the cave with la_Gruta3 to give other access to them, also we need a conector for praire/dunes to the Gruta, my idea with the Gruta, parhaps a big opening
```

```
Date: 2026-11-23 14:30
Author's note: add some detailss for [[wt about faith. we need to include whispers when the character is atheist. also think about ways that both types of games enjoiable (believer vs atheist). regarding action, the player power should be linked directly with the belief level, faith should be less punitive, perhas change the scale from 0 to xxx rather than go negative. we need to think about it
```

```
Date: 2026-11-23 18:34
Author's note: [[wa regarding the healer hood, i was never happy with the result.  you can see the following sketch: healer_hooded_better.webm please draw something likes this for reeview, when you have my approval we need to update all animimations (pass them to approval)
```

```
Date: 2026-11-23 19:07
Author's note: for [[wt some ideas for faith think:

Design Spec: 4-Tier Belief & Silent Guardian Mechanics1. Core Premise & EconomyNarrative Framing: The player is a solitary deity worshipped by a single subject (the wizard). Even when the wizard stops believing, the player continues trying to protect and win back their only subject.Faith (0 → +Max): Strictly positive spendable resource (divine mana). Never goes negative to prevent soft-locks.Belief (4-Tier Relationship State): Devout $\leftrightarrow$ Believer $\leftrightarrow$ Doubter $\leftrightarrow$ Atheist.Extremes (Devout & Atheist): Distinct, equally viable playstyles (Active Shepherd vs. Silent Guardian). Neither extreme is punitive.Bridges (Believer & Doubter): Transitional momentum states separating the two extremes.2. Tier Breakdown & Action Bar MorphingRather than locking out player agency as Belief drops, the player's action bar morphs from Overt Miracles (direct wizard buffs) into Invisible Hand Nudges (environmental/enemy manipulation that the wizard perceives as luck or skill).Belief TierRoleCombat & Survival ActionsDecision & Path GuidanceWizard Stat Scaling1. DevoutActive Extreme (Shepherd)Overt Miracles: Direct Heal, Resurrect, Smite, Divine Shield.Divine Command: 100% obedience on paths and professions.Low solo stats; high multiplier from divine buffs and shrines.2. BelieverUpper BridgeStandard Miracles: Heal, Smite, Bless Drop, Whisper.Persuade: ~80% chance wizard follows suggested path/profession.Balanced baseline stats; responsive to active intervention.3. DoubterLower BridgeSubtle Aid: Weak Heal, soften enemy armor, Whisper (primary pull back toward Believer).Nudge: ~50% coin-flip whether wizard listens or acts independently.Rising Self-Reliance (+XP%, +Crit%); miracle potency scales down.4. AtheistIdle Extreme (Silent Guardian)Invisible Hand: Reduce enemy resistance/armor, turn lethal hits into 1-HP "grazes," spawn hidden healing herbs.Stray Omen: Low-cost, ~80–85% ignored; wizard relies on stubborn instinct.Peak Self-Reliance (+XP%, +Crit%); immune to direct heals/commands.3. Key System LoopsDual Faith Generation (0 → +Max):Active Loop (Devout / Believer): Clutch heals (below 25% HP), shrine visits, and fulfilled Divine Commands generate Faith.Passive Loop (Doubter / Atheist): Surviving fights rigged by Invisible Hand nudges, unassisted boss kills, and chapter milestones generate latent Faith—ensuring idle players return to a full Faith pool.Universal Steering via Whispers:Low/zero-cost action with a short cooldown available across all tiers.Increments Belief upward (Atheist → Doubter → Believer → Devout), allowing an active player to slowly win back an Atheist wizard through persistent subtle signs.Stat Handoff Curve:Miracle potency scales inversely with wizard Self-Reliance (+XP% and +Crit%) across the four tiers so progression remains smooth during transitions without a "weak middle" valley.4. Implementation Checklist for Engineering[ ] Migrate faith state variable from signed integer (-/+) to clamped unsigned range (0 to maxFaith).[ ] Implement 4-state belief enum/thresholds (DEVOUT, BELIEVER, DOUBTER, ATHEIST) with idle-time decay and miracle/whisper increment hooks.[ ] Build action-bar swapping logic so ATHEIST and DOUBTER replace direct targeted miracles with environmental/enemy modifiers (e.g., enemy.resistance debuffs, lethal-hit survival clamping).[ ] Add probabilistic compliance rolls to path/profession guidance (100% $\rightarrow$ 80% $\rightarrow$ 50% $\rightarrow$ 15%).[ ] Wire passive Faith generation triggers to unassisted kills, rigged-fight survivals, and story chapter transitions.
```

```
Date: 2026-11-23 19:17
Author's note: [[wc other faith potential ideas:
Attribution Log: Show the wizard's "luck/skill" excuse in the text log when you use an invisible Atheist nudge (e.g., "It looks like the {enemy] blade snapped on its own").

Unanswered Prayers: Low-HP in bosses battles trigger a timed prayer prompt—answering spikes Belief upward; ignoring drops Belief and adds a permanent +Crit/XP ("Hardened Heart") buff.

Miracle Tolerance: Spamming the same miracle gives diminishing Belief returns; decaying Belief based on unmet expectations replaces flat real-time timers.

Relic Tethering: Equipped gear carries a passive bonus into the next timeline based on the previous run's ending Belief (+Faith/Whisper for Devout, +Crit/XP for Atheist).

Witness Meter: Overt miracles draw heavier enemy aggro/difficulty; invisible nudges let the wizard ambush foes undetected.
```

