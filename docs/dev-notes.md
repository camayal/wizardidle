# Dev notes

Notes saved from the dev tools' notes box (dev mode), newest last: the date and the
author's comment (technical details only when a moment was captured). A later note on the same test replaces an
earlier one.

```
Date: 2026-11-14 23:48
Author's note: enemies that charge need extra time to be back to the position before wizard attach them, aatack is vissiable even without the enemi is in position
```

```
Date: 2026-11-14 23:49
Author's note: When walk towards the shrine wizars is almost on top of the cross, perhaps put him some space away
```

```
Date: 2026-11-14 23:50
Author's note: when leaving the shrine, monk does not need to disapear, it can stay there.
```

```
Date: 2026-11-14 23:54
Author's note: we need to modify pots, boxes and chest, wizard need to walt towards them before interacting.
```

```
Date: 2026-11-14 23:59
Author's note: the shrine sound is played before enteringinto the actual shrine scene. i think it better to play it when is entering the shrine
```


```
Date: 2026-11-15 11:26
Author's note: dev we need 2 or 3 ways the enemy mages appear, the current is fine, but we could do one like fading in, another only for rares and bosses is can be a portal type animation send request to @artist about tthis animation
```

```
Date: 2026-11-15 11:38
Author's note: I would like to have one creek in the praire, and keep the one in the swam, but we need to modify the maps to include them, and additionally cbe sure to create scenes of bridges one for each region
```

```
Date: 2026-11-15 11:39
Author's note: dreem scene do not respect the reposition of the scene view when stats or other UI scroll are opened
```

```
Date: 2026-11-15 11:51
Author's note: I don't like the Records scroll, I think this is why we have achievements. we can get rid of them. past wizard stats will be in the Cementery
```

```
Date: 2026-11-15 11:51
Author's note: For the achievments, I think we need to add the date and time where it was won, in small text and perhaps gray
```

```
Date: 2026-11-15 11:53
Author's note: For elementals, I changed my mind; the entry to battle should be linked to its element, perhaps animate them adequately.
```

```
Date: 2026-11-15 11:54
Author's note: I noticed in the bestirary a note about the hydra, we dont need that. remove it.
```

```
Date: 2026-11-15 16:34
Author's note: sometime when wizar is exploring he walks to reach the same scene. wizar only should walk if the scene is different.
```

```
Date: 2026-11-15 16:37
Author's note: dreams are quite frequent, we need to reduce them
```

```
Date: 2026-11-15 16:38
Author's note: sometimes the wizard spend so much time in a given zone. we need to avoid that, I think createing scenes with the other zoner will help to revolve this.
```

```
Date: 2026-11-15 16:40
Author's note: if the wizar is already in the dice games, why exit and go again, we need to check the way to evaluate the next destignation in the gampling house, that is the actual gambling house, wizard skip leaving and play another round
```

```
Date: 2026-11-17 06:58
Author's note: healer teleport is quite rudimentary, we can use the metod we use in entrance wizards but in reverse to vanish him
```

```
Date: 2026-11-17 13:03
Author's note: prologue scroll should be visable only when the game load, so in the button we can see the scene, not before.
```

```
Date: 2026-11-17 13:05
Author's note: remove phisical  attack from our wizard, it is a wizard after all. only spells
```

```
Date: 2026-11-17
From artist (approved by the author): hydra entrances, ready to wire.
Files: img/bosses/hydras/<hydra>/anim_<hydra>_enter.png, one strip each, 16 frames, played once
when the hydra arrives (instead of its normal entrance), then its idle. About 120 ms a frame.
- mother (Swamp): rises out of a green mud pool. Frames 96x96: the hydra sits 16 px in from the
  left, so draw the frame 16 px further left than mother1.png (same feet line).
- icedra (Tundra): an iceberg grows with the hydra inside, cracks and shatters. Frames 64x64.
- hydskon (Dunes): bones whirl and fly in to build the hydra, eyes light up. Frames 64x64.
Same pixel scale as the stage-1 sprites (hydskon1, icedra1, mother1): draw at the hydra's normal
scale, never stretched to a fixed box, or the wider mother frame comes out smaller.
They show the stage-1 hydra (one head).
```
