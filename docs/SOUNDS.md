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

Approved by ear, each tried against its animation. None is in `snd/` yet and nothing is wired:
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
| Orc: slash swing | snd/schools/Physical.ogg (already in the game) | 0.029 s to 0.105 s | 0.08 s | 0.3 | 300 ms (the slash opens) |
| Warrior: thrust swing | snd/schools/Physical.ogg (already in the game) | 0.034 s to 0.107 s | 0.07 s | 0.3 | 200 ms (the spear goes out) |
| Ogre: smash swing | snd/schools/Physical.ogg (already in the game) | whole file | 0.23 s | 0.3 | 400 ms (the downswing) |
| Capricor: ram, Tauren: ram (each approved) | snd/schools/Physical.ogg (already in the game) | whole file | 0.23 s | 0.3 | 950 ms (when the ram lands) |
| Infraespectro: curse | freesound_community-deathmagic-94937.mp3 | 1.717 s to 3.519 s | 1.80 s | 1.0 | 200 ms (the curse starts) |

All at normal speed, not repeated, with a 30 ms fade out. Notes for whoever wires them:

- The thud, the rumble and the roll are longer than first asked, approved as they are.
- The rumble and the roll come from the same file (the roll without its first 0.24 s).
- The hooves on the Tauren and the Capricor are louder than the game's usual 0.3, and run about
  300 ms past the ram's impact on the Tauren.
- The stone bursting off replaces `snd/places/breakPot.ogg`.

## Approved boss and hydra moves (from the sound notes, 2026-11-14/15)

Same rules as the table above (cut, convert to .ogg, record source and licence, wire). A later test of the same scene replaced an earlier one.

| Move | Source file | Cut | Plays | Volume | Starts at | Landing sound | Author's note |
|---|---|---|---|---|---|---|---|
| Doria: sonic boom | dragon-studio-ghostly-tone-499659.mp3 | whole file | 3.12 s | 0.3 | 0 ms (blow lands at 1000 ms, the move lasts 2300 ms) | Arcane (spellPush2), heard | - |
| Doria: rune circle | coghezzi-sacred-rune-lock-02-arcane-seal-activation-536458.mp3 | whole file | 4.05 s | 0.3 | 0 ms (blow lands at 1000 ms, the move lasts 2400 ms) | Arcane (spellRingRose_8), heard | - |
| Hydra: mother / 1 heads: grow to 2 | universfield-wet-squelch-276679.mp3 | whole file | 2.33 s | 0.3 | 0 ms (no timing) | Nature (spellChispasGreen_8), muted | - |
| Hydra: mother / 2 heads: grow to 3 | universfield-wet-squelch-276679.mp3 | whole file | 2.33 s | 0.3 | 0 ms (no timing) | Nature (spellChispasGreen_8), muted | - |
| Hydra: mother / 3 heads: grow to 4 | universfield-wet-squelch-276679.mp3 | whole file | 2.33 s | 0.3 | 0 ms (no timing) | Nature (spellChispasGreen_8), muted | - |
| Hydra: mother / 4 heads: grow to 5 | universfield-wet-squelch-276679.mp3 | whole file | 2.33 s | 0.3 | 0 ms (no timing) | Nature (spellChispasGreen_8), muted | - |
| Hydra: mother / 5 heads: grow to 6 | universfield-wet-squelch-276679.mp3 | whole file | 2.33 s | 0.3 | 0 ms (no timing) | Nature (spellChispasGreen_8), muted | - |
| Hydra: mother / 6 heads: grow to 7 | universfield-wet-squelch-276679.mp3 | whole file | 2.33 s | 0.3 | 0 ms (no timing) | Nature (spellChispasGreen_8), muted | - |
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
| Hydras | strike (Swamp, ice, Dunes), frost breath. On hold: the author wants new sounds for the hydras |
| Scene spells no boss casts yet | whirlwind, eclipse, divine light, healing rain |
| Dice game | the roll: `snd/places/dice.ogg` is 2.07 s and the dice animation now lasts 1.44 s (18 frames of 80 ms), with a new roll possible every 1.5 s. Wanted: about 1.2 to 1.4 s, the clatter early and the dice settled by the end (the author's playtest note, 2026-11-14) |
