# Sounds for the new attacks

The author's playtest note: some new enemy attacks need sounds; which can be reused, and which
should be found. Written 2026-11-13.

## What plays today

Every enemy attack plays **one** sound: the school sound of the spell behind it (Arcane, Fire,
Frost, Nature, Physical, Shadow, Thunder, Divine), when the blow lands. The new animations (the
charge across the scene, slams, roars, the slime's bounce, Medusa's stone, scene spells) play
nothing of their own, so a long animation is silent until its very end.

The plan: each move gets a sound **at its own moment** (the swing, the run, the roar), and the
landing keeps the spell's sound. Reused files are judged by name and length only (the sounds
could not be listened to here): the author confirms by ear.

## The existing sounds that can be reused

| File | Length | Reuse for |
|---|---|---|
| Physical.ogg | 0.23 s | the swing of a regular enemy's slash, thrust, smash (to confirm by ear); ~~phase, great slash, the flurry~~ (boss moves) |
| ~~Nature.ogg~~ | 0.35 s | ~~spit, slime spit, poison strike / dart, poison cloud, spores, vines~~ |
| ~~Fire.ogg~~ | 1.73 s | ~~fire breath, flame pillar, fire rain, fire fist, fire peak, fire tornado~~ |
| ~~Frost.ogg~~ | 1.16 s | ~~blizzard, ice spikes, frost breath~~ |
| ~~Thunder.ogg~~ | 0.70 s | ~~lightning, golden storm~~ |
| ~~Shadow.ogg~~ | 3.43 s | ~~curse, eclipse (long: may need a shorter cut)~~ |
| ~~Arcane.ogg~~ | 1.25 s | ~~arcane flare, arcane rain, rune circle, sonic boom, prism pulse, colour burst, rainbow orbs~~ |
| ~~Divine.ogg~~ | 2.27 s | ~~golden touch, divine light~~ |
| ~~heal.ogg~~ | 3.43 s | ~~Midas healed by his golden rays, healing rain~~ |
| ~~breakPot.ogg~~ | 1.36 s | ~~the stone bursting off the wizard (unpetrify)~~ (another sound chosen, see Decisions) |
| ~~breakWood.ogg~~ | 1.50 s | ~~stand-in for the ram's impact and heavy slams until a thud is found~~ (the thud is found; the ram needs its own sound) |
| hidra.ogg | 3.32 s | already plays when a hydra appears or grows a head |

The author's decision (2026-11-13): the rows crossed out are boss spells, and each boss move gets
its own sound instead of sharing its school's (see "Boss moves" below). The school sound still
plays when the blow lands, as today.

## Sounds to find

Short (under 1 s unless noted), mono, .ogg, about as loud as the current ones, free to use
(CC0 or similar; record the source and licence next to the file).

| # | Sound | For |
|---|---|---|
| ~~1~~ | ~~Heavy thud / ground hit~~ | ~~slam (Ent, Golem, Mummy, Umigubi, Roco, bosses), ground punch~~ (found, see Decisions) |
| ~~2~~ | ~~Deep rumble, ~1.5 s~~ | ~~the earthquake scene spell (with the shake)~~ (found, see Decisions) |
| ~~3~~ | ~~Bow twang + arrow whoosh~~ | ~~shoot (Elf)~~ (found, see Decisions) |
| ~~4~~ | ~~Hooves galloping, ~1 s, loopable~~ | ~~charge (Capricor, Tauren, boss charges)~~ (found, see Decisions) |
| ~~5~~ | ~~Rolling rumble, ~1.5 s~~ | ~~the boss's roll~~ (found, see Decisions) |
| ~~6~~ | ~~Beast roar, ~1 s~~ | ~~roar (boss) only~~ (found, see Decisions) |
| ~~6b~~ | ~~Small creature snarl, under 0.5 s~~ | ~~pounce (small creatures need their own, lighter sound)~~ (found, see Decisions) |
| ~~7~~ | ~~Slime squelch / boing~~ | ~~the slime boss's bounce~~ (found, see Decisions) |
| 8 | Wind gust, ~1 s | ~~sandstorm~~ (found, see Decisions); whirlwind and the Fenix's wing flap still to hear on their own |
| ~~9~~ | ~~Stone grinding / crackle, ~0.8 s~~ | ~~Medusa's gaze turning him to stone~~ (found, see Decisions) |
| 10 | Hydra strike | the hydras' strikes: the author wants new sounds for the hydras (on hold); ~~pounce bites~~ (the small creatures' snarl, 6b) |
| ~~11~~ | ~~Ram impact~~ | ~~the Capricor's and the Tauren's ram when the charge lands (not a thud)~~ (Physical.ogg chosen, see Decisions) |

Until a sound is found, its move stays silent (or uses the stand-in above), so they can be added
one at a time: drop the file in `ogg/` and dev wires it.

## Decisions

Sounds the author approved by ear (2026-11-13), each tried against its animation. The source
files are in `wizardidle-old-ideas/unorganized_sounds/`; they are not in `ogg/` yet (still to
be cut and converted to .ogg, with source and licence recorded), and nothing is wired.
"Starts at" is counted from the first frame of the animation.

| # | Sound | Source file | Cut | Plays | Volume | Starts at | Tried on |
|---|---|---|---|---|---|---|---|
| 1 | Heavy thud | dragon-studio-heavy-boulder-thud-515257.mp3 | whole file | 2.11 s | 0.3 | 500 ms (when the blow lands) | Ent slams |
| 2 | Deep rumble | dragon-studio-heavy-rock-rolling-515254.mp3 | whole file | 2.11 s | 0.3 | 400 ms (the earthquake starts) | Protromus: ground punch and earthquake |
| 3 | Arrow whoosh | djartmusic-arrow-swish_03-306040.mp3 | whole file | 1.04 s | 0.3 | 200 ms (the release) | Elf shoots |
| 4 | Hooves | freesound_community-single-horse-galopp-6152.mp3 | 1.556 s to 2.432 s | 0.88 s | 0.55 | 370 ms (just before the dash) | Tauren charges |
| 5 | Rolling rumble | dragon-studio-heavy-rock-rolling-515254.mp3 | 0.239 s to 2.110 s | 1.87 s | 0.3 | 400 ms (the roll starts) | Kkck rolls |
| 6 | Beast roar | dragon-studio-beast-growl-494304.mp3 | 0.097 s to 1.216 s | 1.12 s | 0.3 | 200 ms | Bicaptop roars |
| 7 | Slime bounce | yodguard-bouncy_jelly_creature_movement-387893.mp3 | 1.211 s to 2.206 s | 0.99 s | 0.3 | 0 ms (the first frame) | Cuboq bounces |
| 6b | Small creature snarl | freesound_community-monster-bite-44538.mp3 | 0.402 s to 1.142 s | 0.74 s | 0.3 | 100 ms | Imp pounces |
| 8 | Wind gust | dragon-studio-gust-of-wind-511325.mp3 | whole file | 1.22 s | 0.3 | 100 ms (the scene spell starts) | Sandstorm |
| 9 | Stone grinding | freesound_community-stoneblockdragwoodgrind-82327.mp3 | whole file | 1.15 s | 0.3 | 700 ms (the stone starts to climb) | Medusa's gaze, he turns to stone |
| - | Stone bursting off | freesound_community-rock-destroy-6409.mp3 | 0.000 s to 0.993 s | 0.99 s | 0.3 | 400 ms (the stone cracks) | The stone bursts off (instead of breakPot.ogg) |
| - | Slash swing | ogg/Physical.ogg (already in the game) | 0.029 s to 0.105 s | 0.08 s | 0.3 | 300 ms (the slash opens) | Orc slashes |
| - | Thrust swing | ogg/Physical.ogg (already in the game) | 0.034 s to 0.107 s | 0.07 s | 0.3 | 200 ms (the spear goes out) | Warrior thrusts |
| - | Smash swing | ogg/Physical.ogg (already in the game) | whole file | 0.23 s | 0.3 | 400 ms (the downswing) | Ogre smashes |
| 11 | Ram impact | ogg/Physical.ogg (already in the game) | whole file | 0.23 s | 0.3 | 950 ms (when the ram lands) | Capricor rams, Tauren rams (each approved) |

The author also heard two approved sounds on other moves and approved them there, with the same
file and cut: the thud (1) on Protromus's ground punch, starting at 400 ms, and the hooves (4) on
the Capricor's charge, starting at 370 ms.

All at normal speed, not repeated, with a 30 ms fade out. Notes for whoever wires them:
1, 2 and 5 are longer than the lengths asked above, approved as they are; 2 and 5 come from the
same file (5 without its first 0.24 s); 4 is louder than the game's usual 0.3 and runs about
300 ms past the ram's impact on the Tauren. The author first approved another hooves file
(freesound_community-gallop-98644.mp3) and replaced it with this one a minute later. For the
stone grinding (9) the first choice was dragon-studio-glass-cracking-511310.mp3, replaced the next day.

The roar (2026-11-13): the author heard the beast growl on a pounce and decided a roar like
that is only for Bicaptop; small creatures need another sound. Row 6 is now the boss's roar
alone (approved for Bicaptop, in the table) and 6b is the small creatures' snarl, not chosen yet.

## Boss moves: one sound each

The author's decisions while listening (2026-11-13 and 14):

- One sound per move, heard on that move: a sound approved on one creature is not assumed for
  another (the roar is Bicaptop's; the thud and the hooves are approved move by move).
- Bosses apart from regular enemies.
- Each boss spell needs its own, more interesting sound than its school's; the author is looking
  for them. The Capricor's ram is not a thud. The hydras need new sounds.

Still to choose, one by one (approved ones are in the tables above):

| Who | Moves |
|---|---|
| Regular enemies | slam (Golem) |
| Infraespectro | curse, arcane flare, phase |
| Doria | sonic boom, arcane rain, rune circle |
| Goro | flurry, slam, charge |
| Kkck | poison cloud |
| Protromus | earth spikes |
| Bicaptop | slam, charge |
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
| Hydras | strike (Swamp, ice, Dunes), frost breath |
| Scene spells no boss casts yet | whirlwind, eclipse, divine light, healing rain |
