# Maps plan: the map revamp, the coast and the Heidan

Redraw the world maps and add the places they are missing: a better ground map, the Heidan as its own aboveground map, a new east coast (a river delta and a beach, home of the nagas), a creek in the Prairie, a bridge scene per zone and border scenes between zones. It also fixes the Dunes bug where the wizard walks through the sea. Asked by the author on 2026-11-19. It builds on [SCENES.md](SCENES.md) (composed scenes, three tiers, one map per tier) and the "Map revamp" idea in `docs/ideas/world.md`. Nothing is built yet.

---

## Decisions

| Question | Decision |
|---|---|
| Map tiers (author, 2026-11-18) | **el_Heidan is the only aboveground zone.** Underground stays la_Mina, la_Cueva, el_Volcan; every other zone is ground |
| Map ribbons (author, 2026-11-18) | **Not built until the map art is approved.** Their icons wait in `img/ui/ribbon/` (`icon_map_underground`, `icon_map_ground`, `icon_map_above`). When built: the ribbons switch the shown map by hand; the default is the current zone's layer |
| Order (author, 2026-11-18) | **Ground map first; the aboveground map is a later, big step** |
| Heidan on the ground map (author, 2026-11-19) | **The two cloud parts go; only the sacred stairs stay, with a few clouds at the top** |
| Aboveground map (author, 2026-11-19) | **New art: two massive separate clouds, joined by the portals** |
| Water scenes (author, 2026-11-19) | **A river delta and a beach, home of the nagas. Water only on the east side,** so the wizard's spot never moves |
| Creek (author, 2026-11-15) | **One creek in the Prairie; the Swamp keeps its own.** The maps change to show both |
| Bridges (author, 2026-11-15) | **One bridge scene per region** |
| Border scenes (author, old play-test list) | **Scenes that end one area and start the next** |
| Delta and beach (author, 2026-11-19) | **Two zones, `el_delta` and `la_playa`:** each with its own scenes, map spot and boss; the nagas live in both |
| Dunes bug (author, 2026-11-19) | **First remove the sea from the Dunes and Desert scenes that have it on the left. Later, add a walkable shore** (the sea pushed back, wide sand where he walks) as new art |
| River system (author, 2026-11-19) | **One river system:** the Prairie creek runs along the back of the scenes, under the Prairie bridge, and flows east into the delta, which meets the beach |
| Nagas and bosses (author, 2026-11-19) | **The beach is the naga home** (all the nagas live there). **The beach has both bosses, the lamia and the greater naga, as a couple:** special to that zone. The delta is wilder (sea snake, giant frog) with a few nagas for diversity and ingredients; the author plans them for a future fishing profession. The guardian serpent is no longer a boss |
| Ground map (author, 2026-11-19) | **Repaint the current layout** |
| Heidan clouds (author, 2026-11-19) | **They stay on their own layer until the aboveground map ships,** then go in the same release |
| Stair scenes (author, 2026-11-19) | **The ground map shows him until he steps onto a cloud**, then the aboveground map |
| Portals (author, 2026-11-19) | **The portals are part of the wizard's path:** he walks into one and is teleported. The existing portal scenes change with the dynamic-scene big change |
| Bridges (author, 2026-11-19) | **Where there is a river or creek: the Prairie and the Swamp each get a bridge** (supersedes "every zone"; other zones only if they gain water) |
| Border scenes (author, 2026-11-19) | **Every pair at once** |
| Aboveground map (author, 2026-11-19) | **Same size and style as the ground map** |
| Delta dropped (author, 2026-11-19) | **No delta: the beach alone is enough** (no `el_delta` zone; the nagas live at the beach; supersedes the delta, two-zones and river-system rows where they mention it). The river must not run into the sea and back onto land. The Dunes grow a little to give a well-placed beach, like a long land bridge joining the Prairie on the north-west, which turns the west gulf into a lake the river flows from. The north Prairie beach stays and extends to the beginning of the Desert. The Heidan clouds on the ground map become about 5 |
| Ground map layout (author, 2026-11-19) | **Approved: `map_layout_options/mapa_b4.png`** (option B with a thin land bridge; the big lake and its river; the small lake by the city removed; the wide beach with the sand spit, extended to the Desert; bridges in the Prairie and Swamp; a cluster of about 5 clouds at the end of each sacred stair). Not installed as img/ui/mapa.png yet; the map spots must be re-checked when it is |

*Open decisions are at the end; answers move up here.*

## Reading of the brief

- **"East side" means the right of the scene.** The wizard walks in from the left, stands on the left and walks out at the right edge (`walkThroughScene()`). So in every water scene the water lies on the right, the wizard's spot and his walk line stay dry, and the enemy's spot (right) can sit in the shallows. On the map the coast also lies on the east edge, so scene and map face the same way.
- **The same rule fixes the Dunes:** the bug is sea on the left, where he walks in.

## The world after the revamp

| Tier | Zones | What changes |
|---|---|---|
| Aboveground | el_Heidan | Its own map: two big clouds and the portals between them. The stairs arrive at each cloud's edge |
| Ground | la_Pradera, el_Bosque, el_Desierto, las_Dunas, el_Pantano, la_Tundra, el_Poblado, la_Ciudad, la_Torre, el_Castillo, el_Duenon, la_Gruta, **+ the delta, + the beach** | Repainted. New east coast; the Prairie creek; bridges marked; the Heidan clouds gone, the stairs stay |
| Underground | la_Mina, la_Cueva, el_Volcan | Not in this plan (the map stays as it is; a style touch-up can follow the ground map) |

**New zones (working names, Spanish like the rest):** `el_delta` (river delta) and `la_playa` (beach). Two zones (decided).

### The coast

- **Delta:** reeds, sandbanks and river arms on the right of the scene; the wizard walks a dry bank on the left. A natural end for the Prairie creek (question 3).
- **Beach:** sand on the left, surf on the right. The walk line follows the sand to the right edge (a dry strip along the bottom or the top, the artist picks per base).
- **Nagas** (`New NPC/nagas/`): naga, naga warrior, mage, ritualist, sharpshooter, guardian naga, greater naga, guardian serpent, lamia (64×64). They arrive by rising out of the water at the enemy's spot (the existing "rise" entrance). Which zone gets which, and the bosses, is question 4. Before use: check the tile licence and credit it like the Gervais art; `vashnia` and `aizul_new` get names of our own.
- **Also from the art pile:** `statue_costa` (the spear-bearer) becomes the coast's statue; the sea snake and giant frog fit the delta if more enemies are wanted later.
- **Stats:** the coast scenes feed the existing explore stats (unique and rare scenes); no new counters needed.

### The Prairie creek and the bridges

- **The creek runs along the back edge** of the Prairie scenes that have it, so it never crosses the walk line, **except in the bridge scene**, where it turns and crosses under a bridge. If question 3 is "yes", it flows east into the delta.
- **One bridge scene per zone**, as a landmark scene (SCENES.md: a fixed place, the path over the bridge is protected). What each one crosses:

| Zone | Bridge |
|---|---|
| Prairie | Stone bridge over the new creek |
| Swamp | Plank walk over its creek |
| Forest | Rope bridge over a ravine (matches the dream `chap.bridge`) |
| Desert | Old stone span over a dry wadi |
| Dunes | Driftwood bridge over a tidal channel (east side only) |
| Tundra | Ice bridge over a frozen river |
| Town | Wooden footbridge |
| City | Stone bridge over a canal |
| Castle | Drawbridge over the moat |
| Tower | Bridge to the Tower's door |
| Duenon | Broken bridge over a chasm |
| Grotto | Rock arch over a pool |
| Delta / Beach | Pier or boardwalk |
| Mine | Rail trestle over a pit |
| Cave | Natural arch over an underground river |
| Volcano | Basalt bridge over lava |
| Heidan | Cloud bridge (or the portals take this role) |

Which of these are in scope is question 9.

### Border scenes

- **A border scene is half one zone, half the next:** the old zone on the left, the new one on the right, since he always walks left to right. It is the first scene he sees after a zone change.
- **Going back needs the mirror** (new zone on the left). The cheapest way is to mirror the drawn scene and have the author check each mirror in the art console, redrawing only the ones that look wrong.
- **Pairs come from the map's neighbours** (the zones' destinations). How many to draw first is question 10.

### The Heidan

- **Ground map:** only the stairs, with a few clouds at the top. Tapping or reading the map while on the ground shows where the stairs are.
- **Aboveground map:** two massive clouds, separate, the portals drawn between them; each cloud shows where its stairs arrive.
- **The stairs are three scenes** (SCENES.md). Which map shows him while he climbs is question 7.
- **Portals:** the only way from one cloud to the other. How the crossing looks is question 8 (the mage portal strips `fx_portal_*` already exist).
- **Map layer:** `localizarBocadillo` in `src/ui/scrolls.js` picks the map from the zone. After this plan: `el_heidan` → the aboveground map; la_Mina, la_Cueva, el_Volcan → underground; the rest, including the new coast, → ground. The marker needs a spot for each Heidan place on the new map.

## Order of work

Each step is playable on its own.

1. **Fix the Dunes bug** (it is a bug, so it goes first). Dev answers question A below and removes the sea from the affected Dunes and Desert scenes (leaves the layer out if it is its own layer; otherwise the artist paints it out of those bases). Later, the artist draws walkable-shore versions that bring the sea back without the wizard walking through it.
2. **Agree the new ground layout:** the artist marks the current ground map with the coast, delta, beach, creek, bridges and the cloudless stairs (a rough sketch, two or three options). The author picks one.
3. **Ground map style:** the artist repaints one crop of the map in two or three styles (art: options first). The author picks.
4. **Full ground map** in the chosen style. **The Heidan clouds stay on their own layer** until the aboveground map ships (question 6), so the Heidan marker always has somewhere to sit. Dev sets the map spots of new and moved places.
5. **The coast:** the artist draws the delta and beach bases (base, floors, props, following the SCENES recipe; options on one base first). The nagas are renamed, licence-checked and dropped in the review drop. Dev adds the zone data (zones, enemies, boss, destinations, map spots), the creatures and their entrances. The musician gets the needs: waves and river ambience, naga sounds.
6. **The Prairie creek and the bridges:** creek variants of the Prairie bases, then the bridge scenes (one zone at a time, Prairie first). Dev adds them as landmark scenes.
7. **Border scenes:** the first pairs (question 10), then the rest.
8. **Aboveground map:** options first, then the full map, the same style as step 3.
9. **Heidan data:** dev splits the Heidan into its two clouds, adds the portals and their crossing, points `localizarBocadillo` at the new map for `el_heidan`, and drops the clouds layer from the ground map in the same release.
10. **Map ribbons:** built once all three maps' art is approved (already decided).

## Work by role

- **Author:** answers the questions; picks the layout, the style and each set of options; checks every new scene and mirror in the art console.
- **Artist:** the Dunes/Desert shore fix; the layout sketch and style crops; the full ground map (clouds on their own layer); the delta and beach bases; the creek variants; the bridge scenes; the border scenes; the aboveground map. Everything goes to the review drop.
- **Dev:** hides the bad Dunes combinations if possible, then wires the fixed bases; new zones and their data; nagas as enemies; bridge and border scenes as landmark scenes; the Heidan split, portals and crossing; the map layer for `el_heidan`; map spots; the ribbons last.
- **Musician:** coast ambience and naga sounds, once the nagas are in.
- **Thinker (follow-ups, not in this plan):** add the coast to the STORY place groups (STORY.md, "hot / walls…") and to the FAITH rescuers table; decide if the coast gets a profession reagent (PROFESSIONS.md: the Dunes and Volcano question).

## Questions for dev

**A. Dunes sea.** *Answered by dev, 2026-11-19:* scenes are whole 256x64 images, not composed layers, so the sea is painted into the base. It is a thin strip at the left edge of all five Dunes scenes (img/places/las_dunas/las_dunas1..5.png). Desert scenes have no sea on the left (el_desierto1 has only a small oasis pond near the tent, away from the edge). Nothing can be hidden by combination (all five have it), so the artist paints the strip out as sand.

**B. Heidan today.** How is `el_heidan` built in `src/data/zones.js`: are the two cloud parts separate places, how do the portals connect them (a move, a destination, nothing yet?), and do the three stair scenes belong to the Heidan or to the zone below? Are place `x, y` pixels on `mapa.png`?

**C. A new zone.** What does a new ground zone need besides its data, backgrounds and a map spot (anything in travel, render or the stats that lists zones by hand)?

## Open decisions

None: all 11 are answered (see the Decisions table above). Plan sections that still say "question N" or list 17 bridges are superseded by the table.
