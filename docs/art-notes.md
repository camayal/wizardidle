# Art notes

Notes saved from the dev tools' notes box (art mode), newest last: the technical details
filled in by the game, then the author's comment. A later note on the same test replaces an
earlier one.

## Scenes and backgrounds

```
Date: 2026-11-15 11:20
Author's note: for @artist, in the dinamic scenes we need to be sure that the path of the wizard is never blocked. we can also include a ontop layer to put decorations that are close to the screen, so the wizard can pass behind them
```

```
Date: 2026-11-15 11:44
Author's note: Praire need some scene backround where the road is freatured, @artist
```

```
Date: 2026-11-20
Author's note: for @artist, el_Duenon7 (future scene, travel map): the sea part should be a waterfall, and the water must be rancid (sickly green-brown, foul). The idea of Duenon is that it is sinking into the underworld: a mega-corruption. In the future the author wants this shown on the whole map (Duenon slowly sinking, corrupted water falling away), so keep el_Duenon7 as the first piece of that look. Redo el_Duenon7 with this and drop it in the review as before.
```

## Connector overlays (bridges, stairs, mines)

- For artist (dev, 2026-11-20): the walk line is the same in every scene of the game, connector scenes included (the wizard is not lifted there; the idea of raising him 3-6 px was dropped). Anything he should walk behind in a connector scene (bridge handrails and posts, stair rails, mouth or mine timbers, pier posts, the ladder) is drawn as a front overlay instead: a 256x64 transparent PNG named overlay_<scene>.png (for example overlay_bridge_south_west.png), only the parts that cover him, everything else clear; it is drawn over the wizard and every sprite (like la_mina6 and la_mina7). Put them in the review drop; dev lists them in src/data/overlays.js. Check each connector scene first for what overlaps his row (feet rows are the walk line; dev-notes has the range question) and draw an overlay only where it is needed. Bridge halves (_west and _east) line up as neighbours, so their overlays must too.
- For artist, stone bridge (author, 2026-11-20): the stone bridge (the spring bridge on the ground map, overlay_bridge_spring_west / _east) gets an overlay shaped as the bridge's low front wall (parapet): it covers about the lower 25% of the wizard (roughly the bottom 8 of his 32 sprite px, from his feet up), so he seems to walk behind the wall. The wall runs the full width of both halves and must line up at the seam. Same idea can apply to the other bridges if they have a front rail; author to decide after seeing it.
- For artist (author, 2026-11-20): the Heidan stairs scenes (stairs_s_base/mid/top, stairs_n_base/mid/top) are fine as they are: no overlay needed there.
- For artist (dev, 2026-11-20): the first six connector overlays (bridges) are in the game. His real feet row is 60 (head at row 28), not 57: dev moved the stone wall of the spring bridge down 3 rows (now rows 52-60); the rope rails were left as drawn. Use feet = row 60 from now on.

## Beach bosses: lamia and greater naga

- Status (dev, 2026-11-24): the Water spells, all six boss moves, both scene spells and both 64 px sprites are done and in the game. Only the entrance remains and it is optional: dev made it with code (the lamia's sea jump, the naga's sand burst); the author may still ask for `anim_<boss>_enter` strips.

- For artist (author + dev, 2026-11-20): **the beach bosses, lamia and greater naga** (both 64 x 64, `img/bosses/<boss>/`; the greater naga is today the 32 px sprite doubled, so redraw it at 64 and hand over both final sprites). Attacks follow the usual boss format (`anim_<boss>_<attack>.png`, frames 104 x 80 with the boss resting at (36, 12); a scene spell is a 256 x 64 strip `scene_<spell>.png` starting on frame `sceneAt`). Water look: teal, foam, droplets (the new Water school; the water spells in the game are placeholders until you draw them).
  - **Lamia (magical, 3 attacks):**
    1. `maelstrom`: a huge whirlpool spins up over the whole scene and pulls at the wizard (scene spell `maelstrom`, the boss raises her arms; mightier than a plain whirlpool).
    2. `tidal_wave`: she sweeps a wall of water across the scene from right to left (scene spell `tidal_wave`, like Doria's rune circle in weight).
    3. `serpent_gaze` (suggestion): a charming, hypnotic stare, rings of light from her eyes; it makes the wizard skip his turn like Medusa's gaze (boss effect, dev wires it). Own strip, no scene spell needed.
  - **Greater naga (melee, 3 attacks):**
    1. `tide_charge`: like Goro's charge, but he dives into a splash and vanishes at the middle of the run, then bursts up beside the wizard and hits (give the `path` row: the offsets per frame, with the jump from far to near at the vanish frame).
    2. `fury_slaps`: a quick flurry of tail and hand slaps, 6-8 hits with water splashes (like Goro's flurry).
    3. `coil_crush` (suggestion): he lunges and coils round the wizard, squeezes, and lets go; a heavy hit.
  - **Entrance (special, both bosses):** they **jump in from the sea at the top right of the scene**. They start small (far away, about 8 to 12 px tall, as if on the horizon), arc across the sky growing, and land on their place with a splash; the last frame is the boss resting at its normal place so the swap to the sprite is seamless. One strip per boss, `anim_lamia_enter.png` and `anim_greater_naga_enter.png`, **scene-wide frames of 256 x 64** (the whole scene, drawn over it; transparent except the boss, the splash at the sea and the splash on landing), 100 ms a frame, about 20 frames. The sea is the top-right corner of the beach scenes (la_playa2 to 6 have sea at the right; check the scene you draw against). The art must not depend on one scene's sea: keep the start high and to the right, off the walk line. Dev wires it (a new entrance kind) once the strips are in the review drop.
  - Leaving the scene after the fight needs nothing new (bosses do not leave).


## Etymos boss (unorganized_sprites/etymos)

```
Date: 2026-11-22 13:53
Author's note: checking other details about etymos boss, i decided to keep the scences (la_escencia) without altearteion, here are some intereting ideas for the animation and destruction of etymos, check pleas in unorganzied_sprites/etymos the new files i put there.
- elemental boss sprite atlas can be a nice minibosses sprites,   think second row is my favorited, they shows etymos broken rather thatn full.
- idea of etymos destruction is the concept step by step, creating an animation for that would be nice
- This is a nice text idea for console, achivement, or other that fit: "The boss was never one being. It was a prison containing six elemental fragments. Defeating it releases them back into the world."
- I know in the atlas there are two purpules and two green, for this purpos, only arcane and toxic or poison, ignore the plant green like nature.
```


```
Date: 2026-11-21 19:45
Author's note: Taverns need to be redesigned by [[wa, the new walk line makes the wizard walk about the tables.
```

## Dice house: table and thrown dice (author, 2026-11-21; brief by dev 2026-11-24)

The dice are only shown in the text console today. The author wants the dice in the scene: a small table beside the gambler (the NPC player in the dice house scene, 256x64 like el_poblado_casadados / la_ciudad_casadados), and when the wizard sits in, tiny dice are thrown onto it.
- Table sprite for the two dice houses, placed between the gambler and the wizard's spot (the gambler's x is in the art; leave room for the wizard to stand opposite).
- Dice sets, by place: red dice for the City, wooden dice for the Town, bone dice (white-yellowish) for the desert. Faces 1-6 each (the console uses 20x20 d1-d6 in img/objects; the scene ones should be tiny, about 6-8 px, readable on the table).
- Thrown dice: a short roll frame or two (tumbling) per set, plus the resting faces.
- The desert has no dice place yet: the tent is the inn, tavern and gambling house. A small table or mat inside the tent scene, with the bone dice, would do.
Open for the author: other games later (shut the box, sevens) would reuse the table.

## Swamp stage 4: the firepit is on the walk line (author, 2026-11-24 11:25)

```
Game test
Zone: Swamp, stage 4 (el_Pantano4), runa5 boss fight scene
Date: 2026-11-24 11:25
```
The scene needs to be modified: the firepit sits on the walkable line, so the wizard walks through it. Move or redraw it off the common walk line (as an overlay if it must stand in front, per the connector rule that obstacles go off the walk line or become overlays).


- el_Desierto4 (author, 2026-11-24): the scene art shows a mine mouth the game does not use as a mouth (the Desert's real mine mouth is elsewhere). Redraw it as collapsed or rubble (a caved-in entrance), same scene otherwise. No code change.


- New scenes for explore quests (author via dev, 2026-11-24): these key places are named in the quest texts (src/data/questTexts.js, SPOTS) but no scene shows them yet. Draw each as a new stage of its zone, or redraw an existing one if the author prefers; dev ties the quest to the scene once it exists. Each scene is a place he can stand in and "see": Castle: the old watchtower with a view over the valley. City: the market square (loud and bright) and the fountain in the middle. Town: the round huts glowing at dusk. Grotto: a hall of crystals hanging from the roof, and the still underground pool. Tower: the top of the tower with the whole coast below. Forest: a clearing full of fireflies, and the oldest tree as wide as a hut. Swamp: the hidden walkway over the bog that keeps boots dry. Dunes: a dry well with a story. Tundra: an ice cave, blue as the sea. Options first in the art console, as usual.



- Hunters hut trophy room (author via dev, 2026-11-24): a second scene inside the hunters hut (img/guild/): the other side of the round hut, a plain empty wall with no door, where trophies will be hung space by space in a zigzag (not in a line) to use the space. Draw the wall with room for about 15 plaques of 32x32 (the 15 boss trophies are item_trophy_<boss>.png) and leave the plaques out, dev draws them. After reporting he walks here, hangs the trophy and leaves. Options first in the art console.
- Rare hunt proofs (author via dev, 2026-11-24): a hunted rare keeps nothing special and no cut: draw a small container by enemy type (little box, bottle, bag, pouch, jar...) as its proof, not a trophy, 32x32 like the item sprites, same wooden/plain look but clearly a proof and not a trophy. List the rare enemy types (rare:true in src/data/enemies.js, one container per type, not per sprite) and offer options first.

- Rare proofs, lump similar ones (author via dev, 2026-11-24): the 18 proofs in style C are approved. To keep it simple, families that look alike share one container: e.g. esqueleto and golem the same box, animalejo and the other bagged ones the same bag. Only containers that differ in colour or shape stay separate. Report the groups (which families share which file, named by the shape and colour, e.g. proof_box_grey.png), so dev maps families to files.
- Capricor trophy (author via dev, 2026-11-24): el_capricor is the one rare that gets a real trophy, a rare rare with a story. Its head, look C (outlined piece on the wooden plaque, 32x32, item_trophy_capricor.png). It is hung on the MAIN wall of the hunters hut, perhaps above the table: tell dev the spot (x, y in the 256x64 scene of el_poblado_cazadores.png) where a 32x32 plaque fits.

## Taller scenes (author loved the tests, 2026-11-25; not now)
Tests in the review drop (places/ext15/): five 384x96 expansions (1.5x), a forest mock with wizard and elf, and two tall scenes at the same width, double height: la_tundra_tall.png and la_ciudad_tall.png (256x128). Future: redraw scenes taller (same width), new top half as real scenery. Open points: mountains in the tundra are flat and unoutlined (draw an outlined option); town roof is one straight ridge (try a stepped roofline or a gable, bigger towers, flags); forest and tundra tree tops are the artist's own design; the fight positions in the mock were a guess (ask dev for the wizard and enemy x,y and scale before the real mock). Needs a dev change before any wiring: scene height is 64 everywhere (layout, canvases, walk line row 28).
