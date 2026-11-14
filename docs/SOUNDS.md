# Sounds for the new attacks

Only what is still pending: the sounds approved and waiting to be cut and wired, and the moves
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

## Approved, still to cut and wire

Approved by ear, each tried against its animation. None is in `ogg/` yet and nothing is wired:
each still has to be cut and converted to .ogg, with its source and licence recorded. A row
leaves this table when its sound plays in the game. The source files are in
`wizardidle-old-ideas/unorganized_sounds/`. "Starts at" is counted from the first frame of the
animation.

| Move | Source file | Cut | Plays | Volume | Starts at |
|---|---|---|---|---|---|
| Ent: slam | dragon-studio-heavy-boulder-thud-515257.mp3 | whole file | 2.11 s | 0.3 | 500 ms (when the blow lands) |
| Protromus: ground punch | dragon-studio-heavy-boulder-thud-515257.mp3 | whole file | 2.11 s | 0.3 | 400 ms |
| Protromus: earthquake | dragon-studio-heavy-rock-rolling-515254.mp3 | whole file | 2.11 s | 0.3 | 400 ms (the earthquake starts) |
| Elf: shoot | djartmusic-arrow-swish_03-306040.mp3 | whole file | 1.04 s | 0.3 | 200 ms (the release) |
| Tauren: charge | freesound_community-single-horse-galopp-6152.mp3 | 1.556 s to 2.432 s | 0.88 s | 0.55 | 370 ms (just before the dash) |
| Capricor: charge | freesound_community-single-horse-galopp-6152.mp3 | 1.556 s to 2.432 s | 0.88 s | 0.55 | 370 ms |
| Kkck: roll | dragon-studio-heavy-rock-rolling-515254.mp3 | 0.239 s to 2.110 s | 1.87 s | 0.3 | 400 ms (the roll starts) |
| Bicaptop: roar | dragon-studio-beast-growl-494304.mp3 | 0.097 s to 1.216 s | 1.12 s | 0.3 | 200 ms |
| Bicaptop: charge | freesound_community-single-horse-galopp-6152.mp3 | 1.556 s to 2.432 s | 0.88 s | 1.0 | 200 ms (the charge starts) |
| Bicaptop: slam | freesound_community-rock-destroy-6409.mp3 | 0.000 s to 0.943 s | 0.94 s | 0.3 | 600 ms (when the slam lands) |
| Cuboq: bounce | yodguard-bouncy_jelly_creature_movement-387893.mp3 | 1.211 s to 2.206 s | 0.99 s | 0.3 | 0 ms (the first frame) |
| Imp: pounce | freesound_community-monster-bite-44538.mp3 | 0.402 s to 1.142 s | 0.74 s | 0.3 | 100 ms |
| Sandstorm | dragon-studio-gust-of-wind-511325.mp3 | whole file | 1.22 s | 0.3 | 100 ms (the scene spell starts) |
| Medusa's gaze: he turns to stone | freesound_community-stoneblockdragwoodgrind-82327.mp3 | whole file | 1.15 s | 0.3 | 700 ms (the stone starts to climb) |
| The stone bursts off | freesound_community-rock-destroy-6409.mp3 | 0.000 s to 0.993 s | 0.99 s | 0.3 | 400 ms (the stone cracks) |
| Orc: slash swing | ogg/Physical.ogg (already in the game) | 0.029 s to 0.105 s | 0.08 s | 0.3 | 300 ms (the slash opens) |
| Warrior: thrust swing | ogg/Physical.ogg (already in the game) | 0.034 s to 0.107 s | 0.07 s | 0.3 | 200 ms (the spear goes out) |
| Ogre: smash swing | ogg/Physical.ogg (already in the game) | whole file | 0.23 s | 0.3 | 400 ms (the downswing) |
| Capricor: ram, Tauren: ram (each approved) | ogg/Physical.ogg (already in the game) | whole file | 0.23 s | 0.3 | 950 ms (when the ram lands) |
| Infraespectro: curse | freesound_community-deathmagic-94937.mp3 | 1.717 s to 3.519 s | 1.80 s | 1.0 | 200 ms (the curse starts) |

All at normal speed, not repeated, with a 30 ms fade out. Notes for whoever wires them:

- The thud, the rumble and the roll are longer than first asked, approved as they are.
- The rumble and the roll come from the same file (the roll without its first 0.24 s).
- The hooves on the Tauren and the Capricor are louder than the game's usual 0.3, and run about
  300 ms past the ram's impact on the Tauren.
- The stone bursting off replaces `breakPot.ogg`.

## Still to choose

One by one, in the game's dev mode for sounds (its list is `src/dev/soundNeeds.js`).

| Who | Moves |
|---|---|
| Regular enemies | slam (Golem) |
| Infraespectro | arcane flare, phase |
| Doria | sonic boom, arcane rain, rune circle |
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
| Hydras | strike (Swamp, ice, Dunes), frost breath. On hold: the author wants new sounds for the hydras |
| Scene spells no boss casts yet | whirlwind, eclipse, divine light, healing rain |
| Dice game | the roll: `ogg/dice.ogg` is 2.07 s and the dice animation now lasts 1.44 s (18 frames of 80 ms), with a new roll possible every 1.5 s. Wanted: about 1.2 to 1.4 s, the clatter early and the dice settled by the end (the author's playtest note, 2026-11-14) |
