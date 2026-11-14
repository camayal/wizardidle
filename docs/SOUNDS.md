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

## Approved, still to wire

Approved by ear, each tried against its animation. The files are cut and in `snd/creatures/`
(2026-11-14); nothing is wired yet.
A row leaves this table when its sound plays in the game. "Starts at" is counted from the first
frame of the animation; "Game sound" is the name it will have in `snd/creatures/` (see "The
files" below).

| Move | Game sound | Plays | Volume | Starts at |
|---|---|---|---|---|
| Ent: slam | `thud` | 2.11 s | 0.3 | 500 ms (when the blow lands) |
| Protromus: ground punch | `thud` | 2.11 s | 0.3 | 400 ms |
| Protromus: earthquake | `rumble` | 2.11 s | 0.3 | 400 ms (the earthquake starts) |
| Elf: shoot | `arrow` | 1.04 s | 0.3 | 200 ms (the release) |
| Tauren: charge | `hooves` | 0.88 s | 0.55 | 370 ms (just before the dash) |
| Capricor: charge | `hooves` | 0.88 s | 0.55 | 370 ms |
| Kkck: roll | `rock_roll` | 1.87 s | 0.3 | 400 ms (the roll starts) |
| Bicaptop: roar | `roar` | 1.12 s | 0.3 | 200 ms |
| Bicaptop: charge | `hooves` | 0.88 s | 1.0 | 200 ms (the charge starts) |
| Bicaptop: slam | `rock_smash` | 0.94 s | 0.3 | 600 ms (when the slam lands) |
| Cuboq: bounce | `bounce` | 0.99 s | 0.3 | 0 ms (the first frame) |
| Imp: pounce | `bite` | 0.74 s | 0.3 | 100 ms |
| Sandstorm | `wind_gust` | 1.22 s | 0.3 | 100 ms (the scene spell starts) |
| Medusa's gaze: he turns to stone | `stone_grind` | 1.15 s | 0.3 | 700 ms (the stone starts to climb) |
| The stone bursts off | `stone_break` | 0.99 s | 0.3 | 400 ms (the stone cracks) |
| Orc: slash swing | `swing_slash` | 0.08 s | 0.3 | 300 ms (the slash opens) |
| Warrior: thrust swing | `swing_thrust` | 0.07 s | 0.3 | 200 ms (the spear goes out) |
| Ogre: smash swing | `Physical` (already in the game, whole) | 0.23 s | 0.3 | 400 ms (the downswing) |
| Capricor: ram, Tauren: ram (each approved) | `Physical` (already in the game, whole) | 0.23 s | 0.3 | 950 ms (when the ram lands) |
| Infraespectro: curse | `curse` | 1.80 s | 1.0 | 200 ms (the curse starts) |
| Doria: sonic boom | `sonic_boom` | 3.12 s | 0.3 | 0 ms (the blow lands at 1000 ms, the move lasts 2300 ms) |
| Doria: rune circle | `rune_circle` | 4.05 s | 0.3 | 0 ms (the blow lands at 1000 ms, the move lasts 2400 ms) |
| Swamp hydra: a head grows (each growth, 1 to 2 up to 6 to 7) | `squelch` | 2.33 s | 0.3 | 0 ms (the growth starts) |

All at normal speed, not repeated. Notes for whoever wires them:

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
`wizardidle-old-ideas/unorganized_sounds/`.

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

## Still to choose

One by one, in the game's dev mode for sounds (its list is `src/dev/soundNeeds.js`).

| Who | Moves |
|---|---|
| Regular enemies | slam (Golem) |
| Infraespectro | arcane flare, phase |
| Doria | arcane rain |
| Goro | flurry, slam, charge |
| Kkck | poison cloud |
| Protromus | earth spikes |
| Midas | golden touch, rainbow orbs, golden rays |
| Herbus | vines, spores |
| Cuboq | spit |
| Skeleton | great slash, curse, arcane rain |
| Rainbow | blizzard, ice spikes |
| Fenix | wing flap, fire breath, flame pillar |
| Medusa | poison strike |
| Arcangel | lightning, golden storm |
| Etymos | prism pulse, colour burst |
| Rojo | flaming punch, fire rain, slam (fire peak) |
| Hydras | strike (Swamp, ice, Dunes), frost breath, a head grows (ice, Dunes). On hold: the author wants new sounds for the hydras |
| Scene spells no boss casts yet | whirlwind, eclipse, divine light, healing rain |
| Dice game | the roll: `snd/places/dice.ogg` is 2.07 s and the dice animation now lasts 1.44 s (18 frames of 80 ms), with a new roll possible every 1.5 s. Wanted: about 1.2 to 1.4 s, the clatter early and the dice settled by the end (the author's playtest note, 2026-11-14) |
