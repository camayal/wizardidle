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
Author's note: for @artist, wax seal as its own layer. The author likes frame C (with the seal) and icon B for "Aren't you extinct?". Instead of one seal colour per tier, draw ONE red seal as a separate 53x53 transparent sprite, named logro_seal (img/ui/achievements/logro_seal.png), at the frame C position; the game recolours it with a css hue filter per tier (grey, green, blue, purple, orange, red, teal, gold). So the icons themselves (frame + picture) must come WITHOUT the seal, and the seal should be a clean red that survives a hue change (avoid hand-picked near-black outlines being the only shading). Also make the final logro_capricorreturns (icon B, no seal).
```
