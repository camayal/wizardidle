# Dev notes

The one notes file: new improvements, bugs, and the author's talk with dev. Notes saved from the dev tools' notes box (dev mode) and typed ones, newest last: the date and the
author's comment (technical details only when a moment was captured). A later note on the same test replaces an
earlier one.

## Open items from the old play-test list (2026-11-18)

[] Border scenes (end of one zone, start of the next): the author wants the list of missing ones first; artist reviews map, coords and scenes (2026-11-24). Planned in docs/plans/MAPS.md.

- Own music (2026-11-18): built as code, no WAVs: Music mode in the dev console (src/dev/music.js, src/synth.js, songs/). Still open for the author: where songs play in the game, stingers only, loops, or both (musician suggests stingers first). The musician can drop songs as <name>.song.txt in the review drop.


- Travel graph (corrected 2026-11-24): the game DOES use it. travel.js picks moves()/destinations() from travelGraph.js, which reads the author's manual links (data/travelOverrides.js, set in Modes > Travel) and falls back to the typed strings of zones.js for a stage with no link; connector walks use connectorsBetween/reachesPoint. The generated graph (manualLinksOnly = 1: blank) only serves travelCost/route in the dev tools. Checked 2026-11-24: ladder_cueva4_mina2 is linked (la_Cueva2 and la_Mina2 move, la_Cueva4 far); the future_* points are no longer separate points, they are the stages el_Volcan6 (80,132) and la_Cueva6 (60,44), linked like any stage. The (130,120) volcano mouth must not link to the lava chamber (only through la_Mina2).

- Rainbow and the seven spectra (2026-11-24): all wired; only a browser test is left (author).

## Next for dev: connectors as scenes (2026-11-20, updated)
Built and committed, all untested in a browser (no node in the dev session): bridges, stairs, cave and mine mouths, the ladder, enter_mine_S (a guess: the tunnel behind mouth_33_165's underground side), and the pier (dead end, 3 s stop, back left). Code: src/data/connectors.js (scenes, mouth and ladder opening x read off the art, pier steps), travel.js (crossing, connectorTests, visitPier), render.walkAcross (steps: dir, start, end, fade, pause), travelGraph.connectorsBetween / reachesPoint. Connectors play only on trips that change zone (City, Town, Castle sub maps will fix the shared gate points later). Dev panel > Connectors forces any walk (ends the running event first).
- 2026-11-20: the walk stopping on connector scenes (wizard gone) is fixed (map dot lookup threw); bridge and mouth walks verified in headless Edge (a temp page importing render.js, hasFocus forced true). The author can only test in the dev panel, so check the rest there.
- First: the author tests every walk in the dev panel's Connectors list and real trips (Poblado to Pradera over the bridge, Desierto to Heidan stairs, Dunas to the south mine, Cueva4 to Mina2 ladder): check openings (mouthDoors), mirrored east-to-west strip, fade timing, wizard standing place after arrival, the pier visit (config.balance.pPier 0.08, PIER_STAY_MS 3000, placeholders).
- Connector scenes as scenes (2026-11-20): registry done (connectorSceneInfo: point, label, n of m; map dot, map title, console line). Author also asked for 'events inside' and 'each scene a stage entry': NOT done. Stage entries in places{} would be read as stages by the pathfinder (reachesPoint skips places[n]) and the Travel tool, so they need a design first; events inside needs the thinker (chance, how long a scene lasts, which zone's enemies, mirrored cast).
- Fights inside connector scenes: not done. When a fight happens in a mirrored (east to west) scene, mirror the wizard cast, spells, scene spells, enemy entrance and attacks only (never the art); a flag like ui.facing read by those. Start small, extend if it looks good. Open: do enemies appear in connector scenes at all, and how long a scene lasts.
- Jumps and teleports: later (jump the shaft; about level 100 short teleports to hop obstacles and reach other scenes). Floor shaft of the ladder mine side may sit on the walk line.
- Still open from the author: bridge halves shown as neighbours with no gap (done by order, no joined wide scene); exit markers drawn per connector pair; enter_mine_S placement.

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
Date: 2026-11-22 09:47
Author's note: i was thinking in anothe mouth that conect the cave with la_Gruta3 to give other access to them, also we need a conector for praire/dunes to the Gruta, my idea with the Gruta, parhaps a big opening
```
- Dunas2 underground inn is in the game (2026-11-24, untested in a browser; the shop half still waits for the professions vendors, docs/PROFESSIONS.md).
- Healer cabin on a quest (2026-11-24): done in code and the four looks are wired (src/cabin.js); untested in a browser. Waiting: the quest system must set state.quest. The open-door curanderobg.png is kept for the final battle.
