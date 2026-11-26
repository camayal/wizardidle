# The Tower: Midas's tower as a place of many floors

The Tower (`la_Torre`) becomes a big place: **7 floors and 2 basements, 3 or 4 rooms on each**, an exterior, and one spiral stair scene that joins the floors. Asked by the author on 2026-11-26. It builds on [STORY.md](../STORY.md) (the Tower is Midas's: the Prologue's whisper, the Ascent at 139–140, the mages' exile and return), [MAPS.md](MAPS.md) and [HOTSPOTS.md](HOTSPOTS.md), and on the dev-notes decision that the castle, tower, city and town each get a **sub-map** later. Nothing here is built yet. No balance numbers: every chance, cost and duration waits for playtests.

---

## Decisions

*None yet. Answers to the open decisions at the end move up here.*

| Question | Decision |
|---|---|

## What exists today

- **Zone data:** `la_Torre` has the elemental, the sorcerer and the sorceress as enemies, **Midas** as boss, `esencia` (Essence) as its drop, and one way out: the Tundra. Its five stages (`la_Torre1`–`5`) all share one spot on the world map and are all moves of each other: today the Tower is one flat room set.
- **Scenes (img/places/la_torre/, tall versions in progress):**

| File | Room | Status |
|---|---|---|
| `la_torre1` | Library with a gallery (shelves, the palantir) | approved |
| `la_torre2` | Study with a pentagram | drawn |
| `la_torre3` | Dining hall (Midas's portrait, an archway) | drawn |
| `la_torre4` | Lab / torture room | drawn |
| `la_torre5` | Cells | drawn |
| `la_torre_altar` | Altar with the magenta cross (a god that is not yours) | drawn; today an altar-event scene |
| `la_torre_estatua` | Statue hall (a statue and a shelf) | drawn; today a statue-event scene |
| `la_torre6` | Star vault, a table with a map of the game world | new |

- **Being drawn now by wizard-artist** (descriptive names, no floor numbers): exterior, spiral stair room, portal room, barracks, greenhouse / herbalist, grand library, artifact vault.
- **Hotspots in the Tower** (HOTSPOTS.md Decisions): Torre1 has a door on the right to Torre2, both bookshelves and the palantir; Torre2 has a door on the left to Torre1; Torre3's archway still waits for a target; the Torre5 gate is removed. The author is having dev remove every exit hotspot in the Tower that is not tied to an object.

## The tower in the story

The Tower is **Midas's Tower, where a hundred gods are worshipped and you are not one of them.** The apprentice whispered to you here and was exiled for it (Prologue). At 139 the corrupt staff drags him back, the doors seal, and the sorceresses flee from his face. At 140 (Chapter VII, **The Ascent**) he kills Midas on the steps of his own throne and sits "below an empty throne, wondering what else they hid". The mages flee and return only after the lynching (149).

The floor plan follows that story: **the higher he goes, the closer to the king.** Servants and prisoners below, apprentices in the middle, masters and gods above, the crown at the top. The chapter title becomes literal: at 139 he climbs the tower floor by floor to the throne. What "they hid" is below: the deepest basement opens only after Midas dies.

## Floor by floor

Floors are numbered from the ground: **floor 1 is the entrance**, floor 7 the top, B1 and B2 below (open decision 1). Stage names are working names, Spanish like the rest; the existing `la_Torre1`–`5` keep their names, because saves, hotspots and the travel links point at them. **The floor lives in the data, never in a file name,** so a room can move floors without a rename.

Legend: **have** = drawn, **drawing** = wizard-artist is on it, **gap** = still to draw (briefs below). Priority A = the story or a system needs it; B = brings the floor to three rooms; C = the fourth room.

| Floor | Theme | Rooms |
|---|---|---|
| **Outside** | The approach | Exterior (`la_Torre_exterior`, drawing) |
| **7** | **The crown** (Midas) | Throne room (`la_Torre_trono`, gap A) · Star vault (`la_torre6`, have) · Portal room (`la_Torre_portal`, drawing) · King's bedchamber (`la_Torre_alcoba`, gap C) |
| **6** | **The masters** | Grand library (`la_Torre_biblioteca`, drawing) · Seers' chamber (`la_Torre_videntes`, gap B) · Council chamber (`la_Torre_consejo`, gap B) |
| **5** | **The green floor** (light, herbs) | Greenhouse / herbalist (`la_Torre_invernadero`, drawing) · Still-room (`la_Torre_destileria`, gap B) · Aviary (`la_Torre_pajarera`, gap B) |
| **4** | **The pantheon** (the hundred gods) | Altar room (`la_torre_altar`, have) · Hall of a Hundred Gods (`la_Torre_panteon`, gap B) · Midas's chapel (`la_Torre_capilla`, gap B) |
| **3** | **Learning** (apprentices) | Library with a gallery (`la_Torre1`, have) · Pentagram study (`la_Torre2`, have) · Scriptorium (`la_Torre_scriptorium`, gap B) · Lecture hall (`la_Torre_aula`, gap C) |
| **2** | **The barracks** (the mages' quarters) | Wizard barracks (`la_Torre_barracones`, drawing) · Duelling hall (`la_Torre_duelo`, gap B) · Infirmary (`la_Torre_enfermeria`, gap B) |
| **1** | **The halls** (entrance, public) | Entrance hall (`la_Torre_entrada`, gap A) · Statue hall (`la_torre_estatua`, have) · Dining hall (`la_Torre3`, have) · Kitchen (`la_Torre_cocina`, gap C) |
| **B1** | **The dungeon** | Cells (`la_Torre5`, have) · Lab / torture room (`la_Torre4`, have) · Jailer's room (`la_Torre_carcelero`, gap B) · Cellar (`la_Torre_bodega`, gap C) |
| **B2** | **What they hid** | Artifact vault (`la_Torre_boveda`, drawing) · Crypt of the founders (`la_Torre_cripta`, gap B) · Cistern (`la_Torre_cisterna`, gap B) |
| **Every floor** | The way between floors | Spiral stair room (`connector`, drawing; one scene for all) |

**Totals:** 31 rooms on 9 floors, plus the exterior and the stair: **33 scenes.** 8 are drawn, 7 are being drawn, **18 are gaps** (2 priority A, 12 B, 4 C). With only A and B the tower has 3 rooms on every floor (29 scenes); the C rooms make floors 1, 3, 7 and B1 four rooms each.

**Why the existing rooms sit where they do:**

- **Library and study on floor 3:** their doors already link them to each other (Torre1's right door, Torre2's left door), so they must share a floor. The apprentices' floor: the shelves give books, the palantir gives dreams.
- **Dining hall on floor 1,** beside the kitchen and over the cellar; Midas's portrait hangs where everyone eats.
- **Statue hall on floor 1:** the founder's statue greets visitors, a hall of honour off the entrance.
- **Altar on floor 4:** one of the hundred gods' altars, with its foreign magenta cross. The pantheon floor is where the apprentice whispered to the wrong god.
- **Cells and lab in B1,** the dungeon; the Tundra's jailer (`el_Carcero`) would fit its jailer's room.
- **Star vault on floor 7,** beside the portal room: its world map table is the portal's destination picker (see *Special rooms*).
- **New art:** barracks on 2 (the mages live low, near the hall), greenhouse on 5 (high enough for sun through glass), grand library on 6 (the masters' books, above the apprentices'), portal on 7 (behind the throne, the king's own way out), vault in B2 (deepest and sealed).

### Art briefs for the gaps

All tall (256×128, the viewer is always tall now), the Tower's grey stone with Midas's red and gold banners, like `la_torre3`. **Every room shows at least one door or arch,** because in the Tower only object hotspots lead anywhere. Descriptive file names, no floor numbers.

| Room | Brief | Pri. |
|---|---|---|
| Entrance hall | Great double doors on the left, Midas's banners, a frieze of many small god symbols along the top, a guard's brazier, an arch on the right to the stair | A |
| Throne room | Gold throne on a high stepped dais (he dies on these steps), red carpet, tall windows with sky; a small door behind the throne (to the portal room). Later variant: the empty throne after VII | A |
| Seers' chamber | Round room, red wax seals, scrolls pinned to the walls, a single red eye painted on the floor or a lens; where the prophecy was written | B |
| Council chamber | Long table with high-backed chairs, one chair broken or turned to the wall; scrolls of sentences; where the masters judged the apprentices | B |
| Still-room | Copper stills, rows of coloured flasks, drying herbs hanging from beams, a little smoke | B |
| Aviary | Perches and cages of owls and ravens, feathers on the floor, an open window to the sky (the Tower's messengers) | B |
| Hall of a Hundred Gods | Rows of niches with small god statues, candles, **one niche empty** (no statue for you) | B |
| Midas's chapel | A gold sanctuary for the king's own god: a sun disc, gold leaf, offerings of coins | B |
| Scriptorium | Slanted writing desks, inkpots, quills, stacks of blank scrolls, a lectern; the scribe's trade (Essence is the writing reagent) | B |
| Duelling hall | A chalk circle on the floor, scorch marks, a rack of staves, training dummies | B |
| Infirmary | A few cots, white sheets, a cabinet of potions, a basin | B |
| Jailer's room | A table with keys, a chair, a lantern, a whip on the wall, a barred door | B |
| Crypt of the founders | Stone tombs with carved mages, candles, a sealed sarcophagus | B |
| Cistern | Underground water, stone pillars, a narrow walkway on the left, drips (elementals) | B |
| King's bedchamber | Canopied bed, a crown stand (empty), a wardrobe, a wide window | C |
| Lecture hall | Benches, a blackboard with a pentagram, a master's desk, an orrery | C |
| Kitchen | Hearth with a cauldron, hanging pots, a long work table, sacks | C |
| Cellar | Barrels and wine racks, sacks, low vaults, cobwebs | C |

**For the art being drawn now:** the stair room should read as "a landing on a spiral stair" with the stair going up on one side and down on the other, so it works for both directions. The exterior should show the tower tall enough for seven floors (about seven rows of windows) and, if it fits, a cellar grate at its foot; if it is already drawn otherwise, no redraw: the sub-map carries the count.

## How the wizard moves

```
Tundra  ─►  Exterior  ─►  (the door)  ─►  Entrance hall  ─►  rooms of floor 1
                                               │
                                     Spiral stair room  ◄─►  any other floor
                                               │
                                         rooms of that floor
```

1. **Outside to inside.** The exterior is a normal stage, joined to the Tundra (and to the Tower crossing once the author's "intersection as a connection" note is built). The way in is the **gate walk the castle uses**: he walks to the door, stops, fades out, and fades in on the entrance hall. Recommended: the door is drawn in the exterior scene, so no extra gate scenes are needed (open decision 5). Leaving is the same walk the other way.
2. **Rooms on one floor** are moves of each other, so he wanders a floor freely. A floor's rooms never link straight to another floor's rooms.
3. **Between floors: the spiral stair.** One scene, reused. He walks out of a room through its stair door, crosses the stair scene, and comes out in a room of the other floor. **Going up** plays the scene as drawn; **going down** plays it mirrored, like the connector walks already do east to west. One crossing per trip, whatever the number of floors (open decision 4); the console says where he goes (*"{name} climbs the spiral stair to the fifth floor"*, *"…down into the dungeon"*), and the map title says *"Tower, 5th floor"*.
4. **The stair is a connector, not a stage.** It holds no events and no fights at first (the dev notes already say events inside connector scenes need their own design); one exception is scripted, the sorceresses fleeing past him at 139.
5. **Where he lands on a floor:** the floor's first room in the table (the hall, the barracks, the library…), or a random room of the floor; recommended the first room, so the stair always opens onto the same place and the floor feels like a place.

### Hotspots

With only object hotspots left, every link the god can suggest is something drawn:

| Spot | Kind | Leads to |
|---|---|---|
| Each room's stair door or arch | exit | the stair, toward a floor (one floor per door is enough; the god cannot pick the floor) |
| Doors between rooms of a floor (Torre1 ↔ Torre2 already) | exit | that room |
| `la_Torre3` archway (waiting) | exit | recommended: the stair; or the kitchen |
| The exterior's door | exit | the entrance hall |
| Shelves (Torre1, grand library, scriptorium) | place → book | his next study is a book |
| The palantir (Torre1) | dream | tonight's sleep is a nightmare |
| Star vault map table, one rectangle per region of the painted map | exit (via portal) | that zone, through the portal (from VII) |
| The portal itself | exit | a zone he has not been to lately (from VII) |
| Altar room's altar | place → shrine | as the altar event today |
| Barracks bunks (VII–149) | place → inn | he sleeps here |
| Greenhouse plants (once professions ship) | place → harvest | he gathers herbs (a new target, later) |

Nudges stay nudges: followed by belief, one touch per scene visit, no marks (HOTSPOTS.md Decisions). The stair scene has no spots.

### The sub-map

When he is anywhere in the Tower, the map scroll shows **the tower sub-map** instead of the world map: a side cut of the tower, nine bands from B2 to 7 plus the roof line and the snow outside, the stair shaft drawn up one side, each room a small box, the marker in his room. Floors still locked are dark (the map fog idea in docs/ideas/world.md). The world map keeps the Tower as one spot. The sub-map is drawn **after the author approves the room list**, so it matches; the castle, city and town sub-maps can follow the same pattern.

## What unlocks when

Recommended (open decision 3):

| When | Open | What changes |
|---|---|---|
| **From the start** (an exile walking in) | Exterior, floors 1–3, B1 | The tower is hostile: mages and elementals fight him as today. Floors 4–7 are warded (the stair will not take him up); B2 is sealed |
| **139, the staff drags him in** | Floors 4–7, one way up | The doors seal behind him (no exit to the Tundra). The stair only goes up: on each floor a short visit, then up again; sorceresses flee past him on the stair, whispering the verse. At the top, the throne room |
| **140, Chapter VII** | Throne room fight; then **portal room and B2** | Midas dies on the throne steps. He takes the **king's seal** from Midas's hand (the key to the portal and the vault: the seal, not the crown, which waits for XI). The throne room shows the empty throne. *"What else they hid"*: B2 opens. No mages until the lynching, only elementals |
| **VII to 149** | The whole tower | His home for a while: free bed in the empty barracks, the greenhouse, the vault, the portal |
| **149, the lynching** | (see open decision 7) | The mages come back: the tower is full of mages again. Recommended: he keeps the portal and the vault (the seal answers to the hand that killed its king); the mages hold the lower floors again (fights as before VII) |
| **Story pulls** (129 Volcano, 139 Tower, 149 lynching, 190 shrine, 199 Heidan) | | The portal does not work while the story is moving him |

**Midas before 139:** recommended that he keeps appearing as today, in any open room ("the king walks his tower"); at 140 he waits in the throne room. After VII he never appears again (STORY.md).

## The special rooms in play

Each one is described as what it does; the numbers wait for playtests.

- **Portal room (floor 7, from VII).** **Travel to a zone in one step.** He walks into the portal (MAPS.md: portals are part of his path) and comes out at the edge of the chosen zone, with the existing portal flash. Recommended: only zones he has visited, one way (the way back is walking, or a teleport scroll once professions ship), no cost to him; a god nudge costs the usual flat nudge. He uses it himself when a quest target is far (travel sees the portal as one more edge, with a cost tuned like the stairs and portals in TRAVEL.md).
- **Star vault (floor 7, `la_torre6`).** The world map on the table **is the destination picker**: the god taps a region, and if the wizard follows the nudge he walks to the portal and goes there. Before VII it is just a room he cannot reach.
- **Greenhouse / herbalist (floor 5).** Before professions ship: a quiet room, a little rest among the plants (flavour, maybe a small heal; open decision 10). With professions (PROFESSIONS.md): he **gathers herbs and mushrooms** there on a visit (Tundra herb, mushroom), and an Alchemy wizard **brews potions** at its bench. The trainers stay in the wild as PROFESSIONS.md decides; this is a place to gather and brew, not a trainer.
- **Artifact vault (B2, from VII).** Recommended: **his collection room**, like the guild's trophy wall: the finds he has studied (runes, books, statues, Medusa's mirror shield and gorgon's eye) and the faith relics (psalm, medallion, crosier shard, letter) appear on its shelves as he gets them, and the ending museum can show it. No new item system needed. Open decision 8 has the bigger options.
- **Barracks (floor 2).** While the mages live here (before VII, after 149) the barracks is where fights with sorcerers are likeliest. From VII to 149 the bunks are empty: **a free bed**, like an inn without the cost. One bunk is his own from his apprentice days, with something scratched into the wood (a prayer to you; in echo games, a tally of lines like the exile scroll's).
- **Library, grand library, scriptorium (floors 3 and 6).** Book finds from the shelves (as Torre1 today); the scriptorium is where the Writing trade fits, since Essence, the Tower's drop, is its reagent.
- **Throne room (floor 7).** The Midas fight at 140; afterwards the empty throne, and nothing else: the crown is taken in Heidan, at XI.
- **Hall of a Hundred Gods (floor 4).** Flavour with weight: the empty niche is the god nobody here worships. A natural place for one console line on his first visit after VII (*"There is still no statue for you."*), worded with the author.
- **Cells (B1).** Flavour today. An idea for the faith plan later, not decided: if he falls in the Tower while the mages live there, he wakes in a cell instead of a rescuer's camp, and walks out when the jailer sleeps.

**Enemies by depth (an idea, no numbers):** the basements lean to elementals (and the jailer in B1), the upper floors to sorceresses, the barracks to sorcerers; the zone's list stays the same.

## Order of work

1. **The author answers the open decisions** (below), starting with the room list.
2. **Artist:** finishes the seven rooms in progress; then the two A gaps (entrance hall, throne room), then the B gaps floor by floor, then C. Each to the review drop for the author's check.
3. **Dev (after the question below is answered):** the floors as data (each room a stage with its floor), the stair connector, the exterior gate walk, the story locks (warded floors, the 139 climb, `midasDead` opening the portal and B2), then the portal travel and the star vault's map spots.
4. **Artist:** the tower sub-map, once the room list is fixed. **Dev:** the map scroll shows it inside the Tower.
5. **Author:** places the object hotspots in each new room (Modes > Hotspots).
6. **Later, with professions:** greenhouse gathering and brewing, the scriptorium. **Later, with the faith relics:** the vault shelves.

## Question for dev

For the author to paste:

> Tower plan (docs/plans/TOWER.md): (1) Can one connector scene (the spiral stair) serve nine connector points, one per floor, and play mirrored when going down? (2) Can la_Torre stages carry x,y on a tower sub-map image while the zone keeps one world-map spot? (3) Are la_Torre_altar and la_Torre_estatua event scenes or stages today, and can a stage be locked behind a story flag (e.g. midasDead) without new code per stage?

## Open decisions

Recommended option first in each.

1. **What "7 floors" means.** (a) Floors 1–7 counting the ground floor, plus B1 and B2: 9 levels. (b) A ground floor plus 7 upper floors and 2 basements: 10 levels (one more floor of rooms to fill). (c) Add or talk first.
2. **The room list and floor themes** (the table above). (a) Approve as written. (b) Approve with changes (which rooms move or go). (c) Add or talk first.
3. **When floors open.** (a) Staged: floors 1–3 and B1 from the start; 4–7 at 139, climbed one way; portal room and B2 after Midas dies. (b) Everything open from the start except the portal room and B2. (c) Only floor 1 and B1 before 139. (d) Add or talk first.
4. **The stair walk.** (a) One crossing per trip, the floor named in the console and map title. (b) One crossing per floor passed (slower; 7 crossings from bottom to top). (c) Add or talk first.
5. **Getting in.** (a) The door is in the exterior scene; the gate walk fades straight into the entrance hall (no new gate art). (b) A gate connector pair like the castle's (two more scenes). (c) Add or talk first.
6. **Portal destinations.** (a) Zones he has visited, one way, free for him. (b) Every zone, one way. (c) Visited zones, and also back to the Tower from each zone's edge. (d) Add or talk first.
7. **The portal after the lynching (149).** (a) He keeps it, and the vault: the seal answers to him; the mages hold the lower floors. (b) The mages close the top floor until XI. (c) Closed for good once the mages return. (d) Add or talk first.
8. **What the vault does.** (a) His collection room: finds and relics on shelves, like the trophy wall, shown in the museum. (b) A one-time haul at VII: a few artifacts that each give a lasting bonus. (c) Both. (d) Add or talk first.
9. **The barracks.** (a) Free bed from VII to 149, mages' fights when they are home, his old bunk as a story touch. (b) Flavour only. (c) Add or talk first.
10. **The greenhouse before professions ship.** (a) A quiet room with a small herbal rest. (b) Pure flavour until professions. (c) Add or talk first.
11. **Midas before 139.** (a) Can appear in any open room, as today; at 140 in the throne room. (b) Only in the throne room, so no Midas fights before 139. (c) Add or talk first.
12. **Torre3's archway.** (a) To the stair. (b) To the kitchen. (c) To the entrance hall. (d) Add or talk first.
13. **Knowing the floor.** (a) Console line and map title only; the sub-map later. (b) Also a small floor number plaque drawn over the stair scene. (c) Also a banner colour per floor in every room's art. (d) Add or talk first.
14. **Where he lands on a floor.** (a) Always the floor's first room. (b) A random room of the floor. (c) Add or talk first.
