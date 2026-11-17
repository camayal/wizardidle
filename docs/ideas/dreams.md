# Dream pool

The text of every dream and nightmare, waiting to replace the stand-in lines in the game. The rules (when a dream comes, which dreams raise belief, how they avoid repeating) are in [docs/SLEEP.md](../SLEEP.md), *Belief dreams*. Read only when working on dreams.

Each dream is 1–3 short lines shown over the dark scene (one line per `/` below, kept in the console). The wizard is "he"; "you" would be the god, the player. **★ = belief dream:** it raises belief by the weight for his level; **nightmares** can lower it a little ("seeds of doubt", SLEEP.md). Ids are stable so the shuffle bags can save them.

**Rules for anyone adding a dream:** no two dreams share an opening word pair or a main image; the hooded healer is never linked to the god (no hands, hymns, faces, or the healer and a god in the same dream); no prophecy lines quoted, no crown; dreams that name the healer play only after the healer has carried him at least once.

## Light dreams (Devout and Believer) — 12, 6 ★

| Id | ★ | Dream |
|---|---|---|
| `light.candle` | ★ | A candle burns in an empty shrine. / It does not go out when he breathes on it. |
| `light.rain` | | Warm rain on the Prairie. / He holds out his palms and they fill like a purse of coins. |
| `light.margin` | ★ | A boy again, in the Tower library. / Every book has the same name written in the margin. / He cannot read it, but it is kind. |
| `light.bloom` | ★ | In the middle of the Tundra winter, a tree blooms, / only on the side that faces him. |
| `light.river` | | Fish made of light circle his ankles in a river. / Every one of them knows the way home. |
| `light.cloak` | | Someone mends his cloak while he sleeps. / The stitches glow, then fade into the wool. |
| `light.stair` | ★ | Up a stair of clouds, and at the top / a chair, and a cup set out for him. |
| `light.bells` | ★ | Bells across the Desert, though there is no town. / He knows, without counting, which one rings for him. |
| `light.fire` | | Old wizards sit around a fire, laughing. / One pours him tea and calls him by a name he likes. |
| `light.roots` | | Roots spill from his staff, and it blooms white. / A wren builds a nest in the crook. |
| `light.stars` | ★ | The stars draw a road across the sky, / and it ends exactly where he is standing. |
| `light.ink` | | A warm sea of ink holds him up. / Whatever he writes on its surface stays. |

## Callings (Doubter and Atheist) — 12, all ★

Quiet: the god never commands here. Different from the god's dream touch (FAITH.md 3.6), which sends him into the next shrine.

| Id | ★ | Dream |
|---|---|---|
| `call.voice` | ★ | Someone says his name in a voice he had forgotten. / Not angry. Only patient. |
| `call.bowl` | ★ | A cracked bowl on a shelf, / filled again every morning by no one. |
| `call.moss` | ★ | Moss has swallowed the shrine by the road. / Under it, the doorstep has been swept clean. |
| `call.door` | ★ | Every door in the corridor is shut but one, / and warm light leans out of it. |
| `call.snow` | ★ | Snow covers him, and covers him, / then stops, as if someone had said enough. |
| `call.prayer` | ★ | His childhood prayer, sung in a stranger's tongue. / He knows every word anyway. |
| `call.lantern` | ★ | Down the Swamp a lantern follows him at a polite distance. / It never asks him to stop. |
| `call.dog` | ★ | A dog he never owned waits at the gate. / It wags as if he were late, not lost. |
| `call.graves` | ★ | In the cemetery, the gravestones turn to face him. / One of them says: we were heard too. |
| `call.mine` | ★ | Deep in the mine his torch dies. / The dark is not empty. It is listening. |
| `call.argue` | ★ | All night he argues with the sky. / The sky lets him finish. |
| `call.tide` | ★ | The tide comes in over the Dunes. / It stops at his feet and draws back, careful. |

## Nightmares — 16, seeds of doubt

Each costs −1 belief while he is a Believer or Devout, never taking him below the Believer line (0); no effect on a Doubter or Atheist (SLEEP.md).

| Id | Dream |
|---|---|
| `night.fall` | He falls, and the ground never comes. / Above him the hole closes like an eye. |
| `night.staff` | His staff speaks in many voices, / and all of them are hungry. |
| `night.midas` | Midas reads the sentence again. / This time the hall is full, and everyone laughs. |
| `night.bricks` | Every shrine on the road has a door, / and every door is bricked shut. |
| `night.slimes` | Slimes fill the room up to his chin. / They are warm, and in no hurry. |
| `night.return` | From very far away his own prayer comes back, / a little wrong. |
| `night.flood` | Water rises in the cabin. / He cannot find the door he came in by. |
| `night.grave` | A fresh grave in the cemetery. / The stone carver asks him how to spell his name. |
| `night.sun` | The sun goes out like a pinched wick. / Someone in the dark says: finally. |
| `night.book` | The pages of his spellbook turn on their own. / All blank, but the last, which is burning. |
| `night.table` | A hundred gods sit at a long table, / and none of them knows who he is. |
| `night.ice` | Under the Grotto ice, faces press up / and mouth his name, one after another. |
| `night.stairs` | The Tower stairs go down instead of up, / and his old teacher waits on every landing. |
| `night.hoods` | A sandstorm tears the hood off every traveler. / Under each hood: nothing at all. |
| `night.ash` | Ash eats his fingertips. / The wind is very interested. |
| `night.town` | A bell tolls once in a dead town. / Every window opens to watch him pass. |

## Fall dreams — 6, by who got him up, pure story

The first rest after a fall. The bag is per kind of rescue (FAITH.md: the god's touch sends the healer; otherwise a rescuer, or nobody).

| Id | Got him up | Dream |
|---|---|---|
| `fall.carried` | the healer | Being carried. A heartbeat that isn't his, / and the smell of pine smoke. |
| `fall.soup` | the healer | A fire, and a bowl of soup going cold beside him. / When he looks up, only the hood, turned to the window. |
| `fall.cart` | a rescuer | Cart wheels, and strangers arguing over his weight. / One of them tucks a blanket under his chin. |
| `fall.ribs` | a rescuer | A rough voice counts his ribs out loud. / All there. All there. |
| `fall.light` | alone | He crawls toward a light that keeps its distance. / He wakes where he fell. |
| `fall.crows` | alone | Crows wait on a branch, patient. / He gets up just to disappoint them. |

## Chapter dreams — 8, general, pure story

The first rest after any chapter opens, from their own shuffle bag. A chapter turning, never a chapter's events: they fit any chapter and spoil nothing.

| Id | Dream |
|---|---|
| `chap.map` | The map in his pack redraws itself while he watches. / The road he came by is gone from it. |
| `chap.coat` | A coat he has worn for years slides off his shoulders. / Underneath is another, and it fits better. |
| `chap.moon` | The moon turns over like a coin / and shows a side no one has seen yet. |
| `chap.bridge` | Halfway across a rope bridge, the planks behind him fall away. / The ones ahead are new. |
| `chap.puddle` | In a puddle, his reflection is a year older. / It nods, as if to say: keep going. |
| `chap.ship` | From a cliff he watches a ship leave the harbor, / carrying everything he used to be. |
| `chap.keys` | Keys hang from every branch of an orchard. / Only one is cold to the touch, and it is his. |
| `chap.seasons` | Spring, summer, autumn and winter cross the field / in a single breath, and he is still lying there. |

## Echo dreams — 3, only after an erasure, pure story

Join the random pool only when `world.erasures` is not empty (SLEEP.md, ERASURE.md).

| Id | Dream |
|---|---|
| `echo.bank` | A wizard with his walk but not his face / waves from the far bank of a river. |
| `echo.frost` | His name, written backwards in frost on a window, / and struck through. |
| `echo.bag` | Someone has already slept in this bag tonight. / It is still warm. |

## Story-linked chapter dreams (later, not built)

Kept for the future, when some dreams will be tied to the story (the author, 2026-11-17). Each belongs to one chapter and would replace the general chapter dream on the first rest after it. Not in any bag yet.

| Id | After | Dream |
|---|---|---|
| `ch.I` | I, The Exile (10) | The Tower gate closes, and keeps closing, / a thousand times, and he is always on the wrong side. |
| `ch.II` | II, Devotion (30) | The half-forgotten shrine again. / Dust lifts off the altar, as if someone had just sat up. |
| `ch.III` | III, Knowledge (50) | Letters crawl off the exile scroll like ants / and spell a word he is not ready for. |
| `ch.IV` | IV, The Forbidden (90) | Warm as a sleeping animal, his staff. / He does not remember feeding it. |
| `ch.V` | V, Repentance (110) | Everyone he has hurt stands in line at the inn. / They only want to watch him sleep. |
| `ch.IX` | IX, Vindication (160) | He asks the dark why it let them take him. / For once, the dark has nothing to say. |
