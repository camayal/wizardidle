# Scenes plan: a finite world composed from parts

Replace the 36 fixed backgrounds with scenes **composed from the author's own parts**, so one wizard's world is varied but finite and every place stays recognisable. In the author's words: ***"limited, not boring, but not infinite."*** Decided by the author on 2026-11-13. It builds on the "Dynamic scenes" and "Map revamp" entries in `ideas.md`. Nothing is built yet.

---

## Decisions (the author, 2026-11-13)

| Question | Decision |
|---|---|
| Scrolling background built on the fly | **Rejected.** The art is composed for a fixed 256×64 frame, special scenes would need a second mode, there would be no "place" for fog, memory or story changes, and walk-to-find, statues, boss effects and the scene shake all assume a still frame |
| The look | **Compose only from the author's layers and art he approves.** No free random placement |
| Special scenes | **Identical to legacy:** City, Tower, altars, statues, taverns |
| Returning to a place | **Looks the same every time within one run;** the run's seed decides it once |
| Size of the world | **Finite: about 100 scenes per run, from a catalogue of about 300** (roughly 8 curated variants per base) |
| The map | **Places joined by exits**, extending the `places` graph in `src/data/zones.js` |
| Tiers | **Three: upperground** (the Heidan, on clouds, *above*), **ground**, **underground** (caves, mines) |
| Between tiers | **Landmarks:** stairs up, cave mouths down. **The stairs to the Heidan are always three scenes** |
| Exits | **Visible in the scene**, so the player can read where he might go |
| Walking | **The current walk stays:** out at the right edge, in from the left (`walkThroughScene()`, `src/ui/render.js`) |
| Who picks the exit | **The wizard chooses; the god can nudge** by tapping an exit, and he may or may not listen (could later depend on belief). **The odds are left open** until playtests |
| Light | **Day, dusk and night as a tint, plus weather per zone,** driven by **game time, not real time**. Hidden underground, so he can come out at a different hour |
| Dropped | **Two suns, five moons and a sky dial** (discussed and dropped) |
| Doors | **A door is a landmark with a fixed position;** no prop may cover it or the path to it (the wizard already stops at the doors drawn on the Town and City streets) |
| The inn | **Reached in two scenes:** walk to the scene where its entrance is, then enter by the door. On the map, the inn's door lives in one specific place. The same rule can serve shrines, dice houses and the stairs |
| Enemy entrances | **Not part of this plan** (dev handles them from the author's notes) |
| Tiers on the map | **One map per tier:** the ground map (`img/mapa.png`) and the underground map (`img/mapaunderground.png`) already exist; **the upperground (Heidan) needs a new map** (art to draw) |
| Rare variants | **Stats and a quiet mark:** a soft console line the first time he sees one (*"{name} has never seen the Forest like this"*), counted in the stats and the records page (unique and rare scenes, per world), and a few achievements (first rare scene, all rare scenes of a zone) |
| Order of work | **Engine first, then art:** dev builds composed drawing, the seed and the map using the existing layers as they are; the artist cleans up the parts and adds the landmarks afterwards |

## The world

- **A map of places joined by exits.** Today `places` in `src/data/zones.js` gives each place `x`, `y`, `moves` within the zone and `destinations` to other zones, picked at random and invisible to the player. The run's seed turns that into a fixed map of about 100 scenes, each a composed variant of one of the 36 bases.
- **Three tiers:**
  - *Upperground:* the Heidan, on clouds. Reached by stairs that always take three scenes.
  - *Ground:* the zones as today.
  - *Underground:* caves, mines and the like, reached by cave mouths.
- **Exits are drawn in the scene** (a path, a gate, stairs, a cave mouth), so the player can see the choices. The wizard picks one; the god's tap on an exit is a nudge he may ignore.
- **Fixed places:** inn doors, shrines, dice houses and stairs live in one specific scene each, so they can be found, remembered and shown on the map.
- **The street doors already exist** (`STREET_DOORS` in `src/ui/render.js`): the Town inn on `el_Poblado4` at x 120, the Town dice house on `el_Poblado5` at x 119, the City inn on `la_Ciudad4` at x 52, the City dice house on `la_Ciudad1` at x 149. He walks to the door, stops, then goes in. **These are the first fixed door landmarks:** a composed variant of those bases must keep the door at that x and the path to it clear.

## The scene recipe (back to front)

| Part | What it is | Decided by |
|---|---|---|
| **Back edge** | Treeline, wall or thin horizon along the top | Fixed per base |
| **Floor** | Most of the scene; carries the zone's identity | A few variants per zone, chosen by the seed |
| **Prop slots** | 2–4 marked spots per base, each with a pool of 3–5 allowed props | The seed, once per run |
| **Landmark slot** | The exit or feature (stairs, cave mouth, door, gate) | The map |
| **State layers** | Altar, statue, open door, story changes | What has happened |
| **Light tint** | Over the whole scene | The game clock |

- Variants are **common, uncommon or rare**. The finite catalogue ties into the "unique places visited" stat ([STATS.md](STATS.md)).
- **Protected spots** no prop may cover: the wizard's place, the enemy's spot, the find spots (discoveries), the statue's position, doors and the path to them, and **the enemies' entrance paths** (enemies now arrive by family, `src/ui/entrances.js`: they walk or fly in from the scene's right edge, or rise out of the ground at the enemy's spot, so the strip from the right edge to the enemy's spot and the ground at his spot stay free).
- **Per tier:**
  - *Upperground:* a cloud floor that can drift; no weather.
  - *Ground:* the full recipe, with weather.
  - *Underground:* no tint and no weather; light from its own sources (torches, lava, crystals).

## What the art already gives (checked 2026-11-13)

- **The layers already separate base and floor.** Every scene file extracted in `wizardidle-old-ideas/layers/` starts with a `Fondo` layer (the base) and one or more `Piso` layers (the floor). *Pradera y bosque* has **six `Piso` layers**, which look like ready-made floor variants. Most other layers are unnamed props (`Layer 5`, `Capa 19`…); a few are named (`calle`, `puerta`, `lampara`, `señal` in the City). The visible/hidden flags in each `layers.json` record which layers the author switched on together, so those combinations can become the allowed sets.
- **Ground scenes** (desert, meadow, forest, city) are seen from above with at most about 8 px of sky: a back edge, no sky part.
- **Underground scenes have a tall back edge:** the Cave and the Mine show a rock wall over roughly the upper half, with props in front (stalactites and stalagmites in the Cave; a rail track and coloured crystals in the Mine).
- **The Heidan** is a flat cloud floor with a row of pillars and a thin pale band along the top: the drifting cloud floor and the pillars as props fit the recipe directly.
- *Not checked yet:* how many props each base really has, and whether shadows are separate from props. The slot counts, pool sizes and the 100 / 300 split are working figures the author accepted, not measured against the art.

## Light and weather

- **Tint:** day, dusk and night over the scene, from the game clock (not real time). Underground has no tint, so he can come out at a different hour.
- **Weather per zone:** e.g. rain in the Forest and Swamp, snow in the Tundra, sand in the Desert and Dunes, ash near the Volcano. None in the Heidan or underground.
- **Risk:** tinting pixel art can muddy the palette, so a night tint is tested on two or three scenes before it's used everywhere.

## Work by role

- **Author:** mark the prop slots on each of the 36 bases, approve each pool and the allowed combinations, mark rarity.
- **Artist:** split each base into back edge and floor (mostly done by the `Fondo` / `Piso` layers); cut props out of the layers so each stands alone; draw the landmarks (stairs, cave mouths, visible exits); test a night tint on two or three scenes; report whether shadows can be separated from props.
- **Dev:** draw the scene on the canvas from parts instead of the CSS background in `loadBackground()`; add the run seed and generate the map from it; keep props out of the protected spots; add the game clock, tint and weather; add the exit nudge.

## Needs

- Stats: `explore.uniqueScenes`, `explore.rareScenes`, `explore.tier.<tier>`, `explore.exitNudged` / `explore.exitNudgeFollowed`.
- Save: the run seed and the generated map (per wizard), plus the scenes visited (fog, see the map revamp).

## Open questions

- The nudge odds (playtests).
- Which zone dev uses first to prove the engine (the meadow and forest file already has six floor layers).
- How fog works on each map (scene by scene, or zone by zone as in the map revamp idea).
