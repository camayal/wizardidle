# Art notes

Notes saved from the dev tools' notes box (art mode), newest last: the technical details
filled in by the game, then the author's comment. A later note on the same test replaces an
earlier one.

```
Date: 2026-11-15 11:20
Author's note: for @artist, in the dinamic scenes we need to be sure that the path of the wizard is never blocked. we can also include a ontop layer to put decorations that are close to the screen, so the wizard can pass behind them
```

```
Date: 2026-11-15 11:44
Author's note: Praire need some scene backround where the road is freatured, @artist
```


```
Date: 2026-11-18
Author's note: for @artist, achievements redesign. (1) Extract the images from C:\Users\camayal\OneDrive\Documentos\GitHub\wizardidle-old-ideas\unorganzed_sprites\Sprites\Archivements\Logros.pdn. (2) Idea: make the achievement frame one static piece and let only the inner picture vary per achievement (frame + content layers), so new achievements only need a picture. (3) New achievement icon: "Aren't you extinct?" (logro_capricorreturns), killing the "last" Capricor again with another wizard; funny, Capricor again. The game already looks for art named logro_capricorreturns.
```

```
Date: 2026-11-18
Author's note: for @artist, wax seals by rarity. The author likes frame C (with the seal) and icon B for "Aren't you extinct?". Draw the seal as its own 53x53 transparent sprite at frame C's position, one per tier, hand-drawn (no hue filter): logro_seal_common (grey), _uncommon (green), _rare (blue), _epic (purple), _legendary (orange), _mythic (red), _ancient (teal), _divine (gold; the game adds a sparkle glow in css, you may also draw sparks). Same seal shape, only colours change (a tier detail, like a ring or gem, is welcome). The icons themselves (frame + picture) must come WITHOUT the seal, and make the final logro_capricorreturns (icon B, no seal). Files go to img/ui/achievements/ through the review drop.
```
