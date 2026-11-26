# The Tower: Midas's tower as a place of many floors

The Tower (`la_Torre`) becomes a big place: **a ground floor, 7 upper floors and 2 basements (10 levels)**, an exterior, a gate pair, and one spiral stair scene that joins the floors. Each floor has rooms, and **a room can span several scenes** (backgrounds he walks through). Asked by the author on 2026-11-26; the floor shapes follow the author's minimap sketches (review drop `minimaps ideas.zip`). It builds on [STORY.md](../STORY.md) (the Tower is Midas's: the Prologue's whisper, the Ascent at 139–140, the mages' exile and return), [MAPS.md](MAPS.md) and [HOTSPOTS.md](HOTSPOTS.md), and on the dev-notes decision that the castle, tower, city and town each get a **sub-map** later. Nothing here is built yet. No balance numbers: every chance, cost and duration waits for playtests.

---

## Decisions

Answered by the author on 2026-11-26.

| Question | Decision |
|---|---|
| 1. What "7 floors" means | **A ground floor + 7 upper floors + B1 and B2: 10 levels.** B2 keeps its role: it is "what else they hid", opened after Midas dies, and it holds the vault. |
| 2. The room list | **Approved, changed to fit the author's minimap sketches:** the ground floor is one round room with the stair in the centre and the main door at the bottom; general floors are round, split into 3 or 4 rooms round a central stair; B1 is a ring of prison cells round the stair; floor 6 (just below the top) is two halves, throne and portals; floor 7 (the top, the end of the stair) is one room, Midas's study and bedroom (study place, map on the wall, telescope, his bed). |
| 3. When floors open | **Staged.** From the start: exterior, ground floor, floors 1–3, B1. At 139: floors 4–6 up to the throne room, climbed one way. After Midas dies: the portal room, floor 7 and B2. (Re-mapped from "1–3, 4–7, portal and B2" to the 10 levels: the old crown floor is now split over 6 and 7, and the old plan already kept the star-vault room shut until VII.) |
| 4. The stair walk | **One crossing per trip.** He walks left to right through the stair scene and it fades out. How up and down differ (entry and exit points, mirroring) is fitted to the finished stair art. |
| 5. Getting in | **A gate connector pair like the castle's** (two more gate scenes, outside and inside). Briefs below. |
| 6. Portal destinations | **Part of the story, not built now.** Over time he finds portals placed at set points across the world, for quick travel. Recorded in dev-notes (future) and docs/ideas/world.md. |
| 7. The portal after the lynching (149) | **The mages close the top until XI** (made exact by decision 15). |
| 8. The vault | **Midas's personal collection: static set dressing, no item system.** Idea kept: story later, or the vault changes once the wizard controls the tower. |
| 9. The barracks | **Flavour only.** No free bed, no fight weighting. |
| 10. The greenhouse before professions | **Pure flavour** until professions ship. |
| 11. Midas before 139 | **Can appear in any open room, as today;** at 140 he waits in the throne room. |
| 12. Doors and arches | **Rooms on a floor join through invisible doors** (plain moves, no drawn door). **The arch is only for the stair:** exactly one room per floor has the stair arch, and only that room joins the stair. Torre3 (dining hall) is floor 1's stair room; its archway is the stair arch. |
| 13. Knowing the floor | **Only the minimap shows it.** No console line, no plaque, no banner colours. |
| 14. Landing on a floor | **In the stair room** (the scene with the arch), and he moves on from there to the next rooms, one room linking to two others, as in the sketches. |
| 15. What the mages close at 149 | **Floors 6 and 7, from 149 until XI: the stair stops at floor 5.** The throne, the portals and the king's room are all shut. |
| 16. Telling floors apart on the minimap | **Odd and even floors differ:** "odd for odd, even for even". The odd general floors (1, 3, 5) share one room count and layout (4 rooms), the even ones (2, 4) share another (3 rooms), so the floor's shape on the minimap tells odd from even. How it tells 3 from 5 (or 2 from 4): decision 18. |
| 17. The altar and statue scenes | **They also become ordinary walkable rooms**, on floors 4 and 1; the altar and statue events keep using the same art. |
| Rooms of several scenes (the author, unasked) | **A room can span several scenes.** The prison (B1) is 3 scenes; Midas's room (7) at least 4 scenes plus a top landing, a stair scene where the spiral only goes down, with wooden rails; the ground floor at least 2 scenes, though it is one room. No minimum for the other floors. Each drawn picture counts as one scene of its room. |
| 18. Telling floor 3 from 5 (or 2 from 4) | **A small column of ten marks beside the minimap plan, his floor lit.** |

## What exists today

- **Zone data:** `la_Torre` has the elemental, the sorcerer and the sorceress as enemies, **Midas** as boss, `esencia` (Essence) as its drop, and one way out: the Tundra. Its five stages (`la_Torre1`–`5`) all share one spot on the world map and are all moves of each other: today the Tower is one flat room set.
- **Scenes** (tall versions in the review drop `places/tall/`; the author has approved Torre1 and the redrawn barracks so far, see the review drop's tower_notes.txt):

| File | Scene | Status |
|---|---|---|
| `la_torre1` | Library with a gallery (shelves, the palantir) | approved |
| `la_torre2` | Study with a pentagram | drawn |
| `la_torre3` | Dining hall (Midas's portrait, an arch on the right) | drawn |
| `la_torre4` | Lab / torture room | drawn |
| `la_torre5` | Cells | drawn |
| `la_torre_altar` | Altar with the magenta cross (a god that is not yours) | drawn; an event scene today, becomes a room too (decision 17) |
| `la_torre_estatua` | Statue hall (a statue and a shelf) | drawn; an event scene today, becomes a room too (decision 17) |
| `la_torre_mapa` (drawn as la_torre6) | Star dome, shelves, a table with a map of the game world | drawn; becomes stage `la_Torre_mapa`, file `tall_la_torre_mapa.png` |
| `la_torre_barracas` | Barracks (bunks), redrawn | approved |
| `la_torre_biblioteca` | Grand library (tall shelves, ladder, a starry window) | drawn |
| `la_torre_herbolario` | Greenhouse / herbalist (glass roof, herb shelves) | drawn |
| `la_torre_portales` / `_sellado` | Five coloured portals; a sealed variant | drawn |
| `la_torre_boveda` | Artifact vault | drawn; to redo with invented staffs and artifacts, none from the story or inventory |
| `la_torre_escalera` | Spiral stair: the spiral in the middle, no windows | drawn |
| `la_torre_exterior` | The tower outside, a wide tower (108 px) in the tundra | drawn |
| `tall_la_torre_full` | Full-tower concept for a future animation, 256×352, 8 storeys | drawn |

- **Hotspots in the Tower** (HOTSPOTS.md Decisions): Torre1 has a door on the right to Torre2, both bookshelves and the palantir; Torre2 has a door on the left to Torre1; every other exit hotspot not tied to an object is removed.

## The tower in the story

The Tower is **Midas's Tower, where a hundred gods are worshipped and you are not one of them.** The apprentice whispered to you here and was exiled for it (Prologue). At 139 the corrupt staff drags him back, the doors seal, and the sorceresses flee from his face. At 140 (Chapter VII, **The Ascent**) he kills Midas on the steps of his own throne and sits "below an empty throne, wondering what else they hid". The mages flee and return only after the lynching (149).

The floor plan follows that story: **the higher he goes, the closer to the king.** The entrance and the halls below, the mages' quarters and the apprentices in the middle, gods and masters above, the throne on 6 and the king's own room at the very top. The chapter title becomes literal: at 139 he climbs the tower floor by floor to the throne. What "they hid" is below: the deepest basement opens only after Midas dies.

## Floor by floor

**Floor names:** G (ground), 1–7 upward, B1 and B2 below. Stage names are working names, Spanish like the rest; `la_Torre1`–`5` keep their names (saves, hotspots and travel links point at them), and new scenes take descriptive names. **The floor and the room live in the data, never in a file name,** so a scene can move without a rename.

**Rooms and scenes.** A **room** is one place on the minimap (one slice of the floor plan). A **scene** is one background, one stage in the data. A room has one or more scenes; he walks through them in a row, first to last and back, and the end scenes of a room join the neighbouring rooms.

**Shape of a floor** (the author's sketches): round, the spiral stair in the centre, the rooms as slices round it. The circle in the middle of each sketch is the stair itself, not a room. Rooms join their neighbours round the ring through invisible doors; **one room per floor, the stair room (★), has the arch in one of its scenes, and only that scene joins the stair.** On a 3-room floor every room joins the other two; on a 4-room floor each joins its two neighbours, so the far room is two moves away.

**Odd and even floors** (decision 16): the general floors alternate. **Odd floors (1, 3, 5): 4 rooms, one shared layout. Even floors (2, 4): 3 rooms, another shared layout.** On every floor of a kind the stair room sits in the same slice. G, 6 and 7 have their own sketched shapes; the basements follow their own sketch (B1) or the 3-room plan (B2).

Legend: **have** = drawn, **gap** = still to draw (briefs below). Priority A = the floor cannot be reached or the story needs it (every stair scene still to draw is A); B = a scene count the author set (G's second scene, the top room's scenes) or a floor's third room; C = the fourth room.

| Floor | Theme | Rooms in ring order → their scenes (★ = stair room; the arch scene first) | Opens |
|---|---|---|---|
| **Outside** | The approach | Exterior (`la_Torre_exterior`, have) · gate pair `gate_la_torre` / `gate_la_torre_in` (connectors, gap A) | start |
| **7** | **The top** (end of the stair) | ★ **Midas's study and bedroom** → top landing (`la_Torre_escalera_cima`, gap A) · study (`la_Torre_estudio`, gap B) · map room (`la_Torre_mapa`, have) · observatory (`la_Torre_telescopio`, gap B) · bedchamber (`la_Torre_alcoba`, gap B) | Midas dead; shut 149–XI |
| **6** | **The crown** | ★ Throne room (`la_Torre_trono`, gap A) · Portal room (`la_Torre_portales`, have) | throne at 139; portals when Midas is dead; shut 149–XI |
| **5** (odd) | **The masters** (high, light) | ★ Seers' chamber (`la_Torre_videntes`, gap A) · Grand library (`la_Torre_biblioteca`, have) · Greenhouse / herbalist (`la_Torre_herbolario`, have) · Council chamber (`la_Torre_consejo`, gap C) | 139 |
| **4** (even) | **The pantheon** (the hundred gods) | ★ Hall of a Hundred Gods (`la_Torre_panteon`, gap A) · Altar room (`la_torre_altar`, have) · Midas's chapel (`la_Torre_capilla`, gap B) | 139 |
| **3** (odd) | **Learning** (apprentices) | ★ Scriptorium (`la_Torre_scriptorium`, gap A) · Library with a gallery (`la_Torre1`, have) · Pentagram study (`la_Torre2`, have) · Lecture hall (`la_Torre_aula`, gap C) | start |
| **2** (even) | **The barracks** (the mages' quarters) | ★ Duelling hall (`la_Torre_duelo`, gap A) · Wizard barracks (`la_Torre_barracas`, have) · Infirmary (`la_Torre_enfermeria`, gap B) | start |
| **1** (odd) | **The halls** | ★ Dining hall (`la_Torre3`, have; its arch) · Kitchen (`la_Torre_cocina`, gap B) · Statue hall (`la_torre_estatua`, have) · Petitioners' hall (`la_Torre_antesala`, gap C) | start |
| **G** | **The entrance** | ★ **Entrance hall** → stair side (`la_Torre_entrada`, gap A) · front side by the main door (`la_Torre_vestibulo`, gap B) | start |
| **B1** | **The prison** | ★ **The prison ring** → jailer's post (`la_Torre_carcelero`, gap A) · cells (`la_Torre5`, have) · torture room (`la_Torre4`, have) | start |
| **B2** | **What they hid** | ★ Crypt of the founders (`la_Torre_cripta`, gap A) · Artifact vault (`la_Torre_boveda`, have, redo asked) · Cistern (`la_Torre_cisterna`, gap B) | Midas dead |
| **Every floor** | The way between floors | Spiral stair (`la_Torre_escalera`, connector, have; one scene for all) | |

**Totals:** 26 rooms on 10 levels, made of **33 scenes**, plus the exterior, the stair and the 2 gate scenes: **37 scenes in all. 15 drawn, 22 still to draw:** 11 priority A (8 stair scenes, the top landing, the 2 gate scenes), 8 B, 3 C. Of the drawn, the vault still has a redo asked.

**Cut from the first list:** the star vault as its own room (it is a scene of the top room), the still-room, the aviary, the cellar (B1 is all prison now). The king's bedchamber is back as a scene of the top room.

**Why the rooms sit where they do:**

- **Ground floor alone:** the sketch shows one round room, the stair and the main door. The entrance hall is the tower's only door to the world: one scene by the stair, one by the main door.
- **Dining hall on floor 1, as the stair room:** it already has an arch on the right, so it needs no new art; the kitchen beside it, the statue hall and the petitioners' hall for visitors waiting to be received.
- **Library and study on floor 3:** Torre1's right door already leads to Torre2, so they are neighbours in the ring. The apprentices' floor: shelves give books, the palantir gives dreams.
- **Altar on floor 4:** one of the hundred gods' altars, with its foreign magenta cross.
- **Floor 5 the masters' floor:** the grand library (the masters' books, above the apprentices'), the greenhouse (high enough for sun through glass), the seers who wrote the prophecy.
- **Floor 6 throne and portals:** the sketch's two halves. The throne room is the stair room, because he climbs straight to it at 139; the portal room opens off it, behind the throne.
- **Floor 7 the top:** Midas's own room at the end of the stair; the sketch's study place, map, telescope and bed become four scenes. The top landing, where the spiral comes up through the floor, stands in for the arch on this floor.
- **B1 the prison:** the sketch's ring of cells round the stair, walked as three scenes; the jailer's post holds the arch (the Tundra's jailer, `el_Carcero`, fits it).
- **B2 sealed and deepest:** the vault of Midas's collection, the founders' crypt, the cistern.
- **Stair scenes on gaps where possible:** a scene still to draw gets its arch for free; drawn scenes stay as they are. If art time runs short, a drawn scene of the floor can take an arch edit instead (barracks, a library, the grand library).

### Art briefs

All tall (256×96, tall file only; a script makes the short file), the Tower's grey stone with Midas's red and gold banners, like `la_torre3`. **Only the stair scene of each floor shows an arch** (to the stair); other scenes need no doors. Descriptive file names, no floor numbers.

| Scene | Brief | Pri. |
|---|---|---|
| Gate, outside (`gate_la_torre`) | Like `gate_castillo`: the foot of the wide tower in the tundra (snow, ice), the great door as an arch near the middle; he walks left to right, stops at the arch, fades out | A |
| Gate, inside (`gate_la_torre_in`) | Like `gate_castillo_in`: the inside of the great door, a few steps, braziers, Midas's banners; he fades in and walks on into the entrance hall | A |
| Entrance hall, stair side ★ (`la_Torre_entrada`) | Round hall, Midas's banners, a frieze of many small god symbols along the top, the stair arch | A |
| Top landing ★ (`la_Torre_escalera_cima`) | The top of the spiral stair: the spiral **only goes down** through an opening in the floor, wooden rails round the opening, the star dome's edge above; he steps off the stair here and walks on into Midas's room. Match `la_torre_escalera` (spiral in the middle, no windows) | A |
| Duelling hall ★ | A chalk circle on the floor, scorch marks, a rack of staves, training dummies, the stair arch | A |
| Scriptorium ★ | Slanted writing desks, inkpots, quills, stacks of blank scrolls, a lectern (Essence is the writing reagent), the stair arch | A |
| Hall of a Hundred Gods ★ | Rows of niches with small god statues, candles, **one niche empty** (no statue for you), the stair arch | A |
| Seers' chamber ★ | Red wax seals, scrolls pinned to the walls, a single red eye painted on the floor or a lens; where the prophecy was written; the stair arch | A |
| Throne room ★ | Gold throne on a high stepped dais (he dies on these steps), red carpet, tall windows with sky; a small door behind the throne (to the portals); the stair arch. Later variant: the empty throne after VII | A |
| Prison, jailer's post ★ (`la_Torre_carcelero`) | A table with keys, a chair, a lantern, a whip on the wall, barred cell doors carrying on to the right, the stair arch | A |
| Crypt of the founders ★ | Stone tombs with carved mages, candles, a sealed sarcophagus, the stair arch | A |
| Entrance hall, front side (`la_Torre_vestibulo`) | The same round hall by the main door: the great door's inner side, a guard's brazier, benches for visitors, a big banner | B |
| Midas's study (`la_Torre_estudio`) | The "study place": a heavy desk under the dome, open books, candles, a star chart pinned to the wall, an hourglass | B |
| Midas's observatory (`la_Torre_telescopio`) | A brass telescope on a stand, pointed at a slit opened in the star dome, star charts, an armillary sphere | B |
| Midas's bedchamber (`la_Torre_alcoba`) | Canopied bed in red and gold, an empty crown stand, a wardrobe, the dome curving down to a wide window | B |
| Midas's chapel | A gold sanctuary for the king's own god: a sun disc, gold leaf, offerings of coins | B |
| Infirmary | A few cots, white sheets, a cabinet of potions, a basin | B |
| Kitchen | Hearth with a cauldron, hanging pots, a long work table, sacks | B |
| Cistern | Underground water, stone pillars, a narrow walkway, drips (elementals) | B |
| Petitioners' hall (`la_Torre_antesala`) | A waiting hall: long benches, a clerk's desk with a ledger, scrolls of petitions, a closed door with Midas's seal | C |
| Lecture hall | Benches, a blackboard with a pentagram, a master's desk, an orrery | C |
| Council chamber | Long table with high-backed chairs, one chair broken or turned to the wall; scrolls of sentences | C |

`la_Torre_mapa` needs no edit now: the bed and the telescope have their own scenes, and the top landing carries the stair.

**Outside views:** the exterior (a wide tower, 108 px) and the full-tower concept (`tall_la_torre_full`, 256×352, 8 storeys: G to 7, the top under the star dome) match the 8 levels above ground; the basements are not seen.

## How the wizard moves

```
Tundra ─► Exterior ─► gate (outside ─► inside) ─► Entrance hall (G)
                                                       │ the stair
                     stair scene ★ of any open floor ◄─┘
                               │ the room's scenes in a row
                       the floor's other rooms, round the ring
```

1. **Outside to inside.** The exterior is a normal stage, joined to the Tundra (and to the Tower crossing once the author's "intersection as a connection" note is built). The way in is the **castle's gate walk**: left to right on `gate_la_torre`, he stops at the arch, fades out, fades in on `gate_la_torre_in`, and walks on into the entrance hall. Leaving is the same walk the other way.
2. **Inside a room** he walks through its scenes in a row. **Between rooms on one floor** the end scenes join round the ring through invisible doors (plain moves). A floor never links straight to another floor.
3. **Between floors: the spiral stair.** Only a floor's stair scene joins the stair. One crossing per trip, however many floors he passes: he walks left to right through the stair scene and it fades out, then he is in the stair scene of the other floor. How a trip down differs from a trip up (another fade point on the spiral, or a mirrored strip) is fitted to the finished stair art. On floor 7 he comes out on the top landing.
4. **He lands in the stair scene** and moves on from there.
5. **The stair is a connector, not a stage.** No events or fights in it for now (the dev notes say events inside connector scenes need their own design). Later, if that design lands: the sorceresses fleeing past him on the stair at 139.
6. **No floor text.** No console line names the floor; only the minimap shows it.

### Hotspots

| Spot | Kind | Leads to |
|---|---|---|
| The stair arch in each stair scene (the rail opening on the top landing) | exit | the stair (the god cannot pick the floor) |
| Torre1's right door, Torre2's left door | exit | each other (drawn already; other scenes have no drawn doors) |
| The throne room's small door | exit | the portal room (once Midas is dead) |
| Shelves (Torre1, grand library, scriptorium) | place → book | his next study is a book |
| The palantir (Torre1) | dream | tonight's sleep is a nightmare |
| Altar room's altar | place → shrine | as the altar event today |
| Greenhouse plants (once professions ship) | place → harvest | he gathers herbs (a new target, later) |

Nudges stay nudges: followed by belief, one touch per scene visit, no marks (HOTSPOTS.md Decisions). The stair and gate scenes have no spots. The portals get spots when the portal network is built.

### The sub-map

When he is anywhere in the Tower, the map scroll shows **the tower sub-map** instead of the world map: **the plan of the floor he is on**, drawn like the author's sketches (round, the stair in the centre, the rooms as slices, the marker in his room whichever of its scenes he is in). Five shapes: G and 7 as one room each, the odd general floors (4 slices), the even ones (3 slices, also used by B2), 6 in two halves, and B1 as the ring of cells. Beside the plan, **a small column of ten marks, one per level from B2 to 7, with his floor lit** (decision 18): this is the only place the floor is shown, and it tells floors of the same kind apart. The world map keeps the Tower as one spot. The castle, city and town sub-maps can follow the same pattern; the author's sketches for them are noted in docs/ideas/world.md.

## What unlocks when

| When | Open | What changes |
|---|---|---|
| **From the start** (an exile walking in) | Exterior, G, floors 1–3, B1 | The tower is hostile: mages and elementals fight him as today. Floors 4–7 are warded (the stair will not take him up); B2 is sealed |
| **139, the staff drags him in** | Floors 4, 5 and 6's throne room, one way up | The doors seal behind him (no exit to the Tundra). The stair only goes up: on each floor a short visit, then up again. The climb ends in the throne room |
| **140, Chapter VII** | Throne room fight; then **the portal room, floor 7 and B2** | Midas dies on the throne steps. The throne room shows the empty throne. The king's room at the top and *"what else they hid"* below open. No mages until the lynching, only elementals |
| **VII to 149** | The whole tower | His to walk: the greenhouse, the vault, the top room, the dormant portals |
| **149, the lynching** | All but floors 6 and 7 | The mages come back and close floors 6 and 7: the stair stops at floor 5. The tower is full of mages again (fights as before VII) |
| **XI** | Floors 6 and 7 reopen | |

**Midas before 139:** he keeps appearing as today, in any open room ("the king walks his tower"); at 140 he waits in the throne room. After VII he never appears again (STORY.md).

## The special rooms in play

Each one is described as what it does; the numbers wait for playtests.

- **Portal room (floor 6; open from VII to 149 and from XI).** Five portals in the art, and a sealed variant. **Not a travel system yet:** the portal network is a later story thread (he finds portals at set points across the world, over time, for quick travel; dev-notes and docs/ideas/world.md). Until then the portals are set dressing, dormant.
- **Midas's study and bedroom (floor 7; open at the same times).** The end of the stair, five scenes. Flavour: the king's desk, his map of the world, his telescope, his bed. A natural home later for the portal network's map (ideas).
- **Throne room (floor 6).** The Midas fight at 140; afterwards the empty throne, and nothing else: the crown is taken in Heidan, at XI.
- **Artifact vault (B2, from VII).** **Midas's personal collection, static set dressing,** no item system. Ideas: story later, or the vault changes once the wizard controls the tower.
- **Altar room and statue hall (floors 4 and 1).** Ordinary rooms he walks through; when the altar or statue event fires, it plays in the same art as today.
- **Greenhouse / herbalist (floor 5).** **Pure flavour** until professions ship. With professions (PROFESSIONS.md): he gathers herbs and mushrooms there, and an Alchemy wizard brews at its bench. A place to gather and brew, not a trainer.
- **Barracks (floor 2).** **Flavour only.**
- **Library, grand library, scriptorium (floors 3 and 5).** Book finds from the shelves (as Torre1 today); the scriptorium is where the Writing trade fits, since Essence, the Tower's drop, is its reagent.
- **Hall of a Hundred Gods (floor 4).** Flavour with weight: the empty niche is the god nobody here worships.
- **The prison (B1).** Flavour today. An idea for the faith plan later, not decided: if he falls in the Tower while the mages live there, he wakes in a cell instead of a rescuer's camp.

**Enemies by depth (an idea, no numbers):** the basements lean to elementals (and the jailer in B1), the upper floors to sorceresses, the barracks to sorcerers; the zone's list stays the same.

## Order of work

1. **Artist:** the vault redo, then the A gaps (the gate pair, the stair scenes floor by floor from G up, the top landing, B1 and B2), then B, then C. Each to the review drop for the author's check.
2. **Dev:** the floors as data (each scene a stage with its `floor` and room; scenes of a room in a row; rooms joined round the ring as plain moves; the altar and statue scenes as stages too, their events unchanged), the stair connector between floors, the tower gate pair, the story locks (warded floors, the 139 climb, the new `midasDead` flag opening the portal room, floor 7 and B2; floors 6 and 7 shut from 149 to XI).
3. **Artist:** the tower sub-map, one plan per shape and the column of ten floor marks. **Dev:** the map scroll shows it inside the Tower.
4. **Author:** places the object hotspots in each new scene (Modes > Hotspots).
5. **Later:** greenhouse gathering and brewing and the scriptorium with professions; the portal network with the story.

## Answers from dev (2026-11-26)

The questions sent to dev, and its answers (read-only, no code changed):

- **One stair for many floors, mirrored going down:** mirroring the stair already works. A stair branch for floors on the same zone is new code: stages get a `floor`, and moving between floors plays the stair scene. That is **one connector, not nine graph points.**
- **Sub-map coordinates while the zone keeps one world-map spot:** a few lines in scrolls.js.
- **Altar and statue scenes:** `la_Torre_altar` and `la_Torre_estatua` are **event scenes, not stages** today; decision 17 makes them stages too.
- **Story locks:** a `requires: "midasDead"` stage field needs one filter plus a flag set when Midas dies; **no midasDead flag exists yet.**
- **The map room's name:** `la_Torre_mapa` (file `tall_la_torre_mapa.png`), not la_torre6.

## Open decisions

None open. Every Tower decision so far is in the Decisions table.
