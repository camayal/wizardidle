# Sounds for the new attacks

Only what is still pending: the sounds approved and waiting to be wired, and the moves
still to choose. Finished history is in the archive.

## What plays today

Every enemy attack plays **one** sound: the school sound of the spell behind it (Arcane, Fire,
Frost, Nature, Physical, Shadow, Thunder, Divine), when the blow lands. The new animations (the
charge across the scene, slams, roars, the slime's bounce, Medusa's stone, scene spells) play
nothing of their own, so a long animation is silent until its very end.

The plan: each move gets a sound **at its own moment** (the swing, the run, the roar), and the
landing keeps the spell's sound.

The author's rules (2026-11-13 and 14):

- One sound per move, heard on that move: a sound approved on one creature is not assumed for
  another.
- Bosses apart from regular enemies.
- Each boss spell gets its own sound, more interesting than its school's; the author looks for
  the files.

A new file should be short (under 1 s unless noted), mono, .ogg, about as loud as the current
ones, and free to use (CC0 or similar; record the source and licence next to the file).

## Wired (2026-11-18)

The 24 approved moves of the old table now play at their own moment: regular enemies by family in
`MOVE_SOUND` (src/ui/enemyMoves.js), boss moves in `attackSounds` (src/data/bossAttacks.js), both
through `playSoundAt` (src/audio.js). The stone grinds on Medusa's gaze when it petrifies him and
bursts off in src/bossEffects.js; the mother hydra's regrowth plays `squelch` (the other hydras keep
`hidra`); the Sandstorm plays its wind in `playSceneSpell` (no boss casts it yet). The ram hits and the
Ogre's smash keep the game's `Physical` sound. Not yet heard in play: the author should try each.

Notes kept from the old table:

- The thud, the rumble and the roll are longer than first asked, approved as they are.
- The hooves on the Tauren and the Capricor are louder than the game's usual 0.3, and run about
  300 ms past the ram's impact on the Tauren.
- The stone bursting off replaces `snd/places/breakPot.ogg`.
- Doria's two sounds (approved 2026-11-14) outlast their moves, by 0.8 s and 1.65 s; the landing
  spell's Arcane sound was heard with them.
- The head growing (approved 2026-11-14) was tried on the Swamp hydra only, with the landing
  Nature sound muted. The ice and the Dunes hydras' growth is not chosen.

### The files

`python tools/cut_sounds.py` makes them from the list in `tools/sound_cuts.txt`: the cut, mono,
a 30 ms fade out, Ogg Vorbis, the volume untouched. It needs the `soundfile` library once
(`python -m pip install soundfile`). The originals are in
`wizardidle-old-ideas/unorganized_sounds/`. To turn whole files into game .ogg files without a cut,
use `python tools/to_ogg.py <files or folder> [--out snd/<folder>] [--name game_name]` (same settings).

| Game sound | Original file | Cut |
|---|---|---|
| `thud` | dragon-studio-heavy-boulder-thud-515257.mp3 | whole file |
| `rumble` | dragon-studio-heavy-rock-rolling-515254.mp3 | whole file |
| `rock_roll` | dragon-studio-heavy-rock-rolling-515254.mp3 | 0.239 s to 2.110 s |
| `arrow` | djartmusic-arrow-swish_03-306040.mp3 | whole file |
| `hooves` | freesound_community-single-horse-galopp-6152.mp3 | 1.556 s to 2.432 s |
| `roar` | dragon-studio-beast-growl-494304.mp3 | 0.097 s to 1.216 s |
| `rock_smash` | freesound_community-rock-destroy-6409.mp3 | 0.000 s to 0.943 s |
| `stone_break` | freesound_community-rock-destroy-6409.mp3 | 0.000 s to 0.993 s |
| `stone_grind` | freesound_community-stoneblockdragwoodgrind-82327.mp3 | whole file |
| `bounce` | yodguard-bouncy_jelly_creature_movement-387893.mp3 | 1.211 s to 2.206 s |
| `bite` | freesound_community-monster-bite-44538.mp3 | 0.402 s to 1.142 s |
| `wind_gust` | dragon-studio-gust-of-wind-511325.mp3 | whole file |
| `swing_slash` | snd/schools/Physical.ogg (the game's own) | 0.029 s to 0.105 s |
| `swing_thrust` | snd/schools/Physical.ogg (the game's own) | 0.034 s to 0.107 s |
| `curse` | freesound_community-deathmagic-94937.mp3 | 1.717 s to 3.519 s |
| `sonic_boom` | dragon-studio-ghostly-tone-499659.mp3 | whole file |
| `rune_circle` | coghezzi-sacred-rune-lock-02-arcane-seal-activation-536458.mp3 | whole file |
| `squelch` | universfield-wet-squelch-276679.mp3 | whole file |

Source and licence: the original names (author, title, number) are the form Pixabay gives its
downloads, whose content licence allows free use without credit. **To confirm by the author**,
who downloaded them: the site and the licence of each. Thanks to give in the game's credits, the
author's wish: dragon-studio (https://ko-fi.com/dragonstudio). The other authors by their file
names: djartmusic, freesound_community, yodguard, coghezzi, universfield.

## Wired: the boss moves (2026-11-18)

The 25 other approved moves play now: bosses in `attackSounds` (src/data/bossAttacks.js), the Golem's slam in `MOVE_SOUND`
(src/ui/enemyMoves.js). Files made by `tools/cut_sounds.py`, which now also applies the sounds mode's speed, extend and
fade out (optional fields in `tools/sound_cuts.txt`, where every file and cut is listed). Not yet heard in play: the author
should try each.

- Where two tests of one move disagreed (Rojo's slam and punch, the Skeleton's curse, Arcangel's lightning) the author kept
  the older choice; the newer files tried on 2026-11-18 were not used.
- Muted landing (`mutedLanding`): Midas's golden rays and the Skeleton's curse; their spell's school sound stays silent.
- A start before the move (Skeleton's curse -1140 ms, Herbus's spores -360 ms) holds the move back by that much, as the
  sounds mode does.
- Goro's slam reuses `thud`. Etymos's prism pulse and Midas's golden rays share one source file, cut differently.
- Rojo's fire rain is cut from the Fenix fire breath's file (0 to 2.4 s of 2.9 s): they may sound alike.
- Licence as above: the Pixabay names (dragon-studio and others).

## Approved and wired (2026-11-22)

Cut files in the review drop: `wizardidle-review/sfx_2026-11-22/` (ogg, mono, volume, speed and
fades as the sound bench set them). Wired 2026-11-24: in `snd/creatures/` (boss_ prefix dropped), moves in `attackSounds`, arrive/leave in `ui/entrances.js`; the two scene spell sounds wait for a caster.

| Move | Review file | Source (picked folder) |
|---|---|---|
| Doria arcane rain | `boss_doria_arcane_rain.ogg` | dragon-studio elemental spell impact 393917 |
| Skeleton arcane rain | `boss_skeleton_arcane_rain.ogg` | same, 0.657 to 2.149 s, slowed to 0.6x |
| Arcangel golden storm | `boss_arcangel_golden_storm.ogg` | dragon-studio spell impact electric 448567 |
| Kkck poison cloud | `boss_kkck_poison_cloud.ogg` | freesound massive fart 38621 (whole) |
| Lamia tidal wave | `boss_lamia_tidal_wave.ogg` | dragon-studio spell impact water 478377 |
| Greater naga tide charge | `boss_greater_naga_tide_charge.ogg` | same file, 0 to 3.678 s, 1.9x |
| Scene spell: healing rain | `scene_healing_rain.ogg` | dragon-studio spell impact ice 448564 |
| Scene spell: divine light | `scene_divine_light.ogg` | dragon-studio ghostly tone 499659 |
| Arrival: etymos (arrive) | `arrival_etymos_arrive.ogg` | dragon-studio creepy sound effect 570459 |
| Arrival: goro (arrive) | `arrival_goro_arrive.ogg` | dragon-studio beast growl 494304 (whole) |
| Arrival: infraespectro (arrive) | `arrival_infraespectro_arrive.ogg` | dragon-studio creepy whisper 472369 |
| Arrival: infraespectro (leave, the wizard fell) | `arrival_infraespectro_leave.ogg` | same file |
| Arrival: bicaptop (arrive) | none: keeps `snd/creatures/stone_break.ogg` (in the game) | |
| Arrival: bicaptop (leave) | `arrival_bicaptop_leave.ogg` | dragon-studio evil laughter 494314 |
| Arrival: midas (arrive) | `arrival_midas_arrive.ogg` | dragon-studio elemental magic impact 393917 |
| Arrival: midas (leave) | `arrival_midas_leave.ogg` | same file, 0 to 5 s, 2.05x |
| Arrival: herbus (arrive) | `arrival_herbus_arrive.ogg` | universfield wet squelch 276679 (volume 0.54) |
| Arrival: herbus (leave) | `arrival_herbus_leave.ogg` | dragon-studio velvet whoosh 570450 (whole) |
| Arrival: cuboq (arrive) | `arrival_cuboq_arrive.ogg` | universfield wet squelch 276679 |
| Arrival: cuboq (leave) | `arrival_cuboq_leave.ogg` | yodguard bouncy jelly 387893 |
| Arrival: skeleton (arrive) | `arrival_skeleton_arrive.ogg` | dragon-studio spell impact electric 448567 |
| Arrival: skeleton (leave) | `arrival_skeleton_leave.ogg` | same file, 0 to 3.361 s, 2.15x |
| Arrival: rainbow (arrive) | `arrival_rainbow_arrive.ogg` | dragon-studio epic spell impact 478364 |
| Arrival: rainbow (leave) | `arrival_rainbow_leave.ogg` | same file, 0.5x |
| Arrival: fenix (arrive) | `arrival_fenix_arrive.ogg` | dragon-studio spell impact flame 448566 |
| Arrival: fenix (leave) | `arrival_fenix_leave.ogg` | same file, 2.541 to 3.861 s |
| Arrival: medusa (arrive) | `arrival_medusa_arrive.ogg` | dragon-studio sand transition 451861 |
| Arrival: medusa (leave) | `arrival_medusa_leave.ogg` | same file, 0.551 to 1.425 s |
| Arrival: arcangel (arrive) | `arrival_arcangel_arrive.ogg` | dragon-studio heavenly choir 515273 |
| Arrival: arcangel (leave) | `arrival_arcangel_leave.ogg` | dragon-studio thunder 631461 |

Strike in `src/dev/soundNeeds.js` (the ids the notes carry): `DOR.arcane_rain`, `SKE.arcane_rain`,
`ARC.golden_storm`, `KKC.poison_cloud`, `SCN.healing_rain`, `SCN.divine_light`. The arrivals and
the lamia and naga moves are free-choice tests with no id in the note: dev matches them by scene.

## Still to choose

One by one, in the game's dev mode for sounds (its list is `src/dev/soundNeeds.js`).

| Who | Moves |
|---|---|
| ~~Doria~~ | ~~arcane rain~~ (approved 2026-11-22) |
| ~~Kkck~~ | ~~poison cloud~~ (approved 2026-11-22) |
| ~~Skeleton~~ | ~~arcane rain~~ (approved 2026-11-22) |
| Medusa | poison strike |
| ~~Arcangel~~ | ~~golden storm~~ (approved 2026-11-22) |
| Hydras | strike (Swamp, ice, Dunes), frost breath, a head grows (ice, Dunes). On hold: the author wants new sounds for the hydras (the entrances have theirs since 2026-11-17) |
| Scene spells no boss casts yet | whirlwind, eclipse, ~~divine light~~ (approved 2026-11-22), ~~healing rain~~ (approved 2026-11-22) |
| Dice game | the roll: `snd/places/dice.ogg` is 2.07 s and the dice animation now lasts 1.44 s (18 frames of 80 ms), with a new roll possible every 1.5 s. Wanted: about 1.2 to 1.4 s, the clatter early and the dice settled by the end (the author's playtest note, 2026-11-14) |
