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
| Physical.ogg | 0.23 s | the swing of slash, thrust, smash, phase, great slash; repeated for the flurry |
| Nature.ogg | 0.35 s | spit, slime spit, poison strike / dart, poison cloud, spores, vines |
| Fire.ogg | 1.73 s | fire breath, flame pillar, fire rain, fire fist, fire peak, fire tornado |
| Frost.ogg | 1.16 s | blizzard, ice spikes, frost breath |
| Thunder.ogg | 0.70 s | lightning, golden storm |
| Shadow.ogg | 3.43 s | curse, eclipse (long: may need a shorter cut) |
| Arcane.ogg | 1.25 s | arcane flare, arcane rain, rune circle, sonic boom, prism pulse, colour burst, rainbow orbs |
| Divine.ogg | 2.27 s | golden touch, divine light |
| heal.ogg | 3.43 s | Midas healed by his golden rays, healing rain |
| breakPot.ogg | 1.36 s | the stone bursting off the wizard (unpetrify) |
| breakWood.ogg | 1.50 s | stand-in for the ram's impact and heavy slams until a thud is found |
| hidra.ogg | 3.32 s | already plays when a hydra appears or grows a head |

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
| 6 | Beast roar, ~1 s | roar (boss) only |
| 6b | Small creature snarl, under 0.5 s | pounce (small creatures need their own, lighter sound) |
| 7 | Slime squelch / boing | the slime boss's bounce |
| 8 | Wind gust, ~1 s | wing flap, whirlwind, sandstorm |
| 9 | Stone grinding / crackle, ~0.8 s | Medusa's gaze turning him to stone |
| 10 | Bite snap | the hydra's strike, pounce bites |

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

All five at normal speed, not repeated, with a 30 ms fade out. Notes for whoever wires them:
1, 2 and 5 are longer than the lengths asked above, approved as they are; 2 and 5 come from the
same file (5 without its first 0.24 s); 4 is louder than the game's usual 0.3 and runs about
300 ms past the ram's impact on the Tauren. The author first approved another hooves file
(freesound_community-gallop-98644.mp3) and replaced it with this one a minute later.

The roar (2026-11-13): the author heard the beast growl on a pounce and decided a roar like
that is only for Bicaptop; small creatures need another sound. Row 6 is now the boss's roar
alone and 6b is the small creatures' snarl. Neither is chosen yet.
