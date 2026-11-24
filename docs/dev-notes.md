# Dev notes

The one notes file: new improvements, bugs, and the author's talk with dev. Notes saved from the dev tools' notes box (dev mode) and typed ones, newest last: the date and the
author's comment (technical details only when a moment was captured). A later note on the same test replaces an
earlier one.

## Open items from the old play-test list (2026-11-18)

[] Border scenes (end of one zone, start of the next): the author wants the list of missing ones first; artist reviews map, coords and scenes (2026-11-24). Planned in docs/plans/MAPS.md.

- Own music (2026-11-18): built as code, no WAVs: Music mode in the dev console (src/dev/music.js, src/synth.js, songs/). Still open for the author: where songs play in the game, stingers only, loops, or both (musician suggests stingers first). The musician can drop songs as <name>.song.txt in the review drop.
- Map revamp, Prairie creek, bridges: planned in docs/plans/MAPS.md (map ribbons built; ground map spots still to re-check against the new art).


- Travel graph (corrected 2026-11-24): the game DOES use it. travel.js picks moves()/destinations() from travelGraph.js, which reads the author's manual links (data/travelOverrides.js, set in Modes > Travel) and falls back to the typed strings of zones.js for a stage with no link; connector walks use connectorsBetween/reachesPoint. The generated graph (manualLinksOnly = 1: blank) only serves travelCost/route in the dev tools. Still unlinked, waiting for the author: future_cave_NW (60,44), future_chamber (80,132), ladder_cueva4_mina2 (112,162). The (130,120) volcano mouth must not link to the lava chamber (only through la_Mina2).

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
Date: 2026-11-20 23:21
Author's note: work on the etmos boss split
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
Date: 2026-11-21 10:25
Author's note: We need a simple AI for battle system, now is just random and the survaibalility of the wizard is very low, healing, protective spells, etc. but i dont want the wizard is fully invincible, bosses need to be almost 90% killable with god help, regular enemies 100%, rares 95, so in that way the god has a purpose
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
Date: 2026-11-22 09:29
Author's note: i am thinking that reviving the wizard by touching him is actually penalizing him by removing him from his track (cabin will leave the wizard in many places. we need to be sure to dev soemthing that mke him to be relased close on in the region he was when hi is doing a quest
```

```
Date: 2026-11-22 09:44
Author's note: beach scenes are interesting but it is weird the transitions, i think we need to be sure that during our dynamic scene implementation we do sintermeditate scenes where the walk line is beach and the rest on top is ocean, then before the next scene we need to transition with another scene to a more away from the ocean scene so the following scene has a good fit with the current fixed beach scenes
```

```
Date: 2026-11-22 09:47
Author's note: i was thinking in anothe mouth that conect the cave with la_Gruta3 to give other access to them, also we need a conector for praire/dunes to the Gruta, my idea with the Gruta, parhaps a big opening
```

