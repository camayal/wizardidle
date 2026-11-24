# Sound notes

Notes saved from the dev tools' notes box (sound mode), newest last: the technical details
filled in by the game, then the author's comment. A later note on the same test replaces an
earlier one.

```
Date: 2026-11-17
Author's note (time away, docs/plans/AWAY.md): one new sound for when the god's page shows again after a long absence: low and slowed, like a distant bell. Plays once, quiet, no music in the game so it stands alone. Try options on the Sound Bench.
```

- For musician (dev, 2026-11-20): a new **Water school** exists (enemy spells of the beach nagas and the lamia). Pending: `snd/schools/Water.ogg`, the sound that plays when a water blow lands on the wizard (like Frost.ogg, Nature.ogg). Today it is a copy of Frost.ogg. Water, not ice: a splash or a wave slap.

- For musician (dev, 2026-11-20): the beach bosses' moves will need sounds once the artist draws them (one sound per move, at its moment, as always): lamia: maelstrom (a roaring whirl), tidal wave (a crashing wave), serpent gaze (a hypnotic hum); greater naga: tide charge (a dive and a splash, then a burst), fury slaps (fast wet slaps), coil crush (a creak and squeeze); and the entrance (a splash far away, a whoosh across the sky, a landing splash). Not yet: wait for the animations.

```
Date: 2026-11-20 23:44
Author's note: -
```

```
Date: 2026-11-20 23:45
Author's note: comment for [[wa healing rain animation stops abruptly, please soft the end
```

```
Date: 2026-11-22 13:59
Author's note: -
```

```
Date: 2026-11-22 14:08
Author's note: the new walking line point affect a little bit the hydras, i think we can do an exception for them, we dont need they follow the current walking like, we can make for them a little lower, good think is they are big creatures so it is fine in the aestetics
```

```
Date: 2026-11-22 15:19
Author's note: reviewing the sounds i noticed for enemies we have arrival, leave and beat, differences between the last two???
```

```
Date: 2026-11-22 15:50
Author's note: be sure that in sounds dev console are the actions, so i can change or update the sounds, for example when study, when sleep, when go into an specific door, etc
```

```
Date: 2026-11-22 16:13
Author's note: just exploring options, is the synth we have enought capable to produce sound effects? kinda realistic, so a explosion that sound like explosion (obvisly in old fashion sound vibe)?
```

```
Song: a_minor_walk

title Prologue: The Beginning
tempo 72
length 24
loop 0

instrument whisper sine 0.08 0.6 0.16
instrument tower pad 0.8 1.2 0.06
instrument pulse triangle 0.02 0.3 0.09

# Sparse, hollow bed
A2+E3 0 8 tower
F2+C3 8 8 tower
D2+A2 16 8 tower

# The Whisper Motif
A4 2 2 whisper
E5 4 2 whisper
F5 6 3 whisper
E5 9 3 whisper

D4 12 2 whisper
A4 14 2 whisper
C5 16 3 whisper
B4 19 3 whisper
E4 22 2 pulse
Date: 2026-11-22 16:40
Author's note: additionally, i am testing other  midi producers and i noticed we lack of hability to use personalzie instruments, we need to implement it so i can produce better music for the game
```
