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
Author's note: for @artist, wax seals by rarity. The author likes frame C (with the seal) and icon B for "Aren't you extinct?". Draw the seal as its own 53x53 transparent sprite at frame C's position, one per tier, hand-drawn (no hue filter): logro_seal_common (grey), _uncommon (green), _rare (blue), _epic (purple), _legendary (orange), _mythic (red), _ancient (teal), _divine (gold; the game adds a sparkle glow in css, you may also draw sparks). Same seal shape, only colours change (a tier detail, like a ring or gem, is welcome). The icons themselves (frame + picture) must come WITHOUT the seal, and make the final logro_capricorreturns (icon B, no seal). Files go to img/ui/achievements/ through the review drop. Addition: the seals get a little more fancy as the tier goes up. Common is plain; each tier adds some detail (a ring, a rim, a gem, wings, a crown, sparks...), up to divine, the most ornate (gold, rays, sparks). Keep the same base shape so they read as a family, and keep them small and readable at 53x53.
```

```
Date: 2026-11-18
Author's note: for @artist, achievement icons become layers: ONE parchment frame (logro_frame.png, 53x53, the frame B look) + the picture alone on a transparent background (same file names as today, e.g. logro_ultimocapricor.png) + the tier seal. The game stacks them, so the pictures must NOT include the parchment or the seal. The extracted layers of Logros.pdn are already picture-only. Please produce logro_frame.png and the picture-only versions of all icons (and logro_capricorreturns picture-only); no_logro stays a full icon for now.
```
