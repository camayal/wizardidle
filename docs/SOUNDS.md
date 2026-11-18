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

## Approved boss and hydra moves (from the sound notes, 2026-11-14/15)

Same rules as the table above (cut, convert to .ogg, record source and licence, wire). A later test of the same scene replaced an earlier one. Doria's two sounds and the mother hydra's growth are in the tables above.

| Move | Source file | Cut | Plays | Volume | Starts at | Landing sound | Author's note |
|---|---|---|---|---|---|---|---|
| Midas: rainbow orbs | dragon-studio-bubble-gum-popping-467465.mp3 | whole file | 0.87 s (speed 1.6x, extend 1x) | 0.3 | 0 ms (blow lands at 1200 ms, the move lasts 2700 ms) | Nature (spellChispasGreen_8), heard | - |
| Midas: golden rays | dragon-studio-eerie-resonant-tone-478368.mp3 | whole file | 3.12 s | 0.3 | 0 ms (blow lands at 1100 ms, the move lasts 2600 ms) | Thunder (spellChispasReddish_8), muted | Remember that this spell needs to be changed in the code, this is a Midas healing spell, not an attack spell |
| Midas: golden touch | dragon-studio-glass-wail-570451.mp3 | whole file | 1.41 s | 0.3 | 0 ms (blow lands at 1100 ms, the move lasts 2600 ms) | Frost (spellChispasBlue_8), heard | this school need to be changed, perhaps holy or something, now is kinda shock/electric. Landing sound will change as well |
| Rojo: slam | dragon-studio-elemental-spell-impact-flame-448566.mp3 | 0.000 s to 2.541 s | 2.54 s | 0.3 (fade in 0, out 140 ms) | 0 ms (blow lands at 1300 ms, the move lasts 2600 ms) | Physical (spellPush9), heard | - |
| Rojo: flaming punch | dragon-studio-elemental-spell-impact-flame-448566.mp3 | 2.559 s to 5.592 s | 3.03 s | 0.3 | 0 ms (blow lands at 1000 ms, the move lasts 2300 ms) | Physical (spellPush10), heard | - |
| Cuboq: spit | dragon-studio-clean-minimal-pop-467466.mp3 | whole file | 3.63 s (speed 0.45x, extend 1x) | 0.3 | 0 ms (blow lands at 1100 ms, the move lasts 2400 ms) | Nature (spellPoisson_8), heard | - |
| Skeleton: great slash | dragon-studio-simple-whoosh-copyright-free-631457.mp3 | whole file | 1.04 s | 0.3 | 740 ms (blow lands at 900 ms, the move lasts 1900 ms) | Arcane (spellPush2), heard | - |
| Skeleton: curse | freesound_community-deathmagic-94937.mp3 | whole file | 8.02 s | 0.3 | -1140 ms (blow lands at 1300 ms, the move lasts 3000 ms) | Arcane (spellRainPurple_24), muted | This is a curse spell, need to work kinda like hemoragie, no need landing sound, change school is needed |
| Rainbow: ice spikes | dragon-studio-glass-cracking-504028.mp3 | whole file | 2.62 s (speed 0.65x, extend 1x) | 0.3 | 0 ms (blow lands at 1100 ms, the move lasts 2500 ms) | Frost (spellPush8), heard | - |
| Rainbow: blizzard | dragon-studio-freezing-winter-wind-499654.mp3 | 0.000 s to 2.200 s | 2.20 s | 0.3 (fade in 0, out 1000 ms) | 0 ms (blow lands at 1000 ms, the move lasts 2400 ms) | Frost (spellChispasBlue_8), heard | - |
| Fenix: fire breath | dragon-studio-fire-spell-impact-393921.mp3 | whole file | 2.90 s | 0.3 | 0 ms (blow lands at 1100 ms, the move lasts 2500 ms) | Fire (spellPush4), heard | - |
| Fenix: wing flap | dragon-studio-bush-rustling-467467.mp3 | whole file | 3.09 s (speed 0.45x, extend 1x) | 0.3 | 0 ms (blow lands at 1200 ms, the move lasts 2700 ms) | Fire (spellChispasRed_8), heard | - |
| Fenix: flame pillar | dragon-studio-elemental-spell-impact-flame-448566.mp3 | 0.000 s to 2.200 s | 2.20 s | 0.3 (fade in 0, out 870 ms) | 0 ms (blow lands at 1000 ms, the move lasts 2400 ms) | Fire (spellRainRed_24), heard | - |
| Protromus: earth spikes | dragon-studio-colossal-footsteps-467495.mp3 | whole file | 3.46 s (speed 2.55x, extend 1x) | 0.82 | 0 ms (blow lands at 1400 ms, the move lasts 2800 ms) | Nature (spellEarthSpike_10), heard | - |
| Goro: flurry | dragon-studio-beast-growl-sound-376873.mp3 | whole file | 1.04 s (speed 1.05x, extend 1x) | 0.3 | 0 ms (blow lands at 700 ms, the move lasts 1200 ms) | Physical (spellPush10), heard | - |
| Goro: slam | dragon-studio-heavy-boulder-thud-515257.mp3 | whole file | 2.11 s | 0.3 | 0 ms (blow lands at 600 ms, the move lasts 1100 ms) | Physical (spellPush6), heard | - |
| Goro: charge | dragon-studio-heavy-boulder-thud-515257.mp3 | 0.343 s to 0.678 s | 0.80 s (speed 1.25x, extend 3x) | 0.3 | 0 ms (blow lands at 700 ms, the move lasts 1800 ms) | Physical (spellPush9), heard | - |
| Infraespectro: arcane flare | dragon-studio-creepy-sound-effect-570459.mp3 | 0.000 s to 1.702 s | 1.70 s | 0.3 (fade in 0, out 810 ms) | 0 ms (blow lands at 1000 ms, the move lasts 2400 ms) | Shadow (spellWhiteMaldicion_8), heard | - |
| Infraespectro: phase | dragon-studio-velvet-whoosh-sfx-570450.mp3 | 0.000 s to 0.473 s | 0.68 s (speed 0.7x, extend 1x) | 0.3 | 0 ms (blow lands at 600 ms, the move lasts 1100 ms) | Arcane (spellChispasWhite_8), heard | Perhaps reclasify this to adjust landing sound |
| Herbus: vines | yodguard-bouncy_jelly_creature_movement-387893.mp3 | 0.000 s to 1.132 s | 2.83 s (speed 0.4x, extend 1x) | 0.3 | 0 ms (blow lands at 1000 ms, the move lasts 2400 ms) | Nature (spellChispasGreen_8), heard | - |
| Herbus: spores | dragon-studio-sand-transition-451861.mp3 | 0.000 s to 2.400 s | 2.82 s (speed 0.85x, extend 1x) | 0.3 (fade in 0, out 500 ms) | -360 ms (blow lands at 1000 ms, the move lasts 2400 ms) | Nature (spellPoisson_8), heard | - |
| Arcangel: lightning | dragon-studio-thunder-4-631461.mp3 | 0.000 s to 2.233 s | 2.23 s | 0.3 (fade in 0, out 810 ms) | 0 ms (blow lands at 900 ms, the move lasts 2200 ms) | Thunder (spellChispasReddish_8), heard | - |

## Still to choose

One by one, in the game's dev mode for sounds (its list is `src/dev/soundNeeds.js`).

| Who | Moves |
|---|---|
| Regular enemies | slam (Golem) |
| Doria | arcane rain |
| Kkck | poison cloud |
| Skeleton | arcane rain |
| Medusa | poison strike |
| Arcangel | golden storm |
| Etymos | prism pulse, colour burst |
| Rojo | fire rain |
| Hydras | strike (Swamp, ice, Dunes), frost breath, a head grows (ice, Dunes). On hold: the author wants new sounds for the hydras (the entrances have theirs since 2026-11-17) |
| Scene spells no boss casts yet | whirlwind, eclipse, divine light, healing rain |
| Dice game | the roll: `snd/places/dice.ogg` is 2.07 s and the dice animation now lasts 1.44 s (18 frames of 80 ms), with a new roll possible every 1.5 s. Wanted: about 1.2 to 1.4 s, the clatter early and the dice settled by the end (the author's playtest note, 2026-11-14) |
