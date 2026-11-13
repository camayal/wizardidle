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
| 1 | Heavy thud / ground hit | slam (Ent, Golem, Mummy, Umigubi, Roco, bosses), ground punch |
| 2 | Deep rumble, ~1.5 s | the earthquake scene spell (with the shake) |
| 3 | Bow twang + arrow whoosh | shoot (Elf) |
| 4 | Hooves galloping, ~1 s, loopable | charge (Capricor, Tauren, boss charges) |
| 5 | Rolling rumble, ~1.5 s | the boss's roll |
| 6 | Beast roar, ~1 s | roar (boss), pounce (a short snarl would do) |
| 7 | Slime squelch / boing | the slime boss's bounce |
| 8 | Wind gust, ~1 s | wing flap, whirlwind, sandstorm |
| 9 | Stone grinding / crackle, ~0.8 s | Medusa's gaze turning him to stone |
| 10 | Bite snap | the hydra's strike, pounce bites |

Until a sound is found, its move stays silent (or uses the stand-in above), so they can be added
one at a time: drop the file in `ogg/` and dev wires it.

## Decisions

(none yet)
