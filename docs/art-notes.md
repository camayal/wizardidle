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
Date: 2026-11-17
Author's note: @artist, art for the XP bar and the line under it (the heading above the scene).
Today: the XP bar is a plain HTML <meter> (white bar, index.html #XPprogressBar); under it the
indicators line (#indicadores): level, heart + HP, gold + gold, spirit + faith, as text with the
existing icons img/ui/heart.png, gold.png, spirit.png.
Wanted: something that fits the game's look instead of the white thing; perhaps a little frame.
Ideally one design that holds both the bar and the indicators (a small plate or band), quiet
enough that it never pulls attention from the scene.
For dev, so it can be wired:
- The bar must stretch: upright it is about 70% of the scene width and 3.5% of its height; on
  phones held sideways about 95% wide and 3% high (src/ui/layout.js). So draw it in pieces: left
  cap, a middle tile that repeats, right cap, and a fill tile (plus an empty-track tile if needed).
- The numbers stay HTML text (they change all the time); the art is the frame / backing plate
  and maybe new small icons if the old ones clash.
- Match the palette of the existing UI (img/ui/frame.png, console.png, the scroll parts).
Process as usual: several hand-drawn options first, the author picks in the art dev console, then
the final pieces go to the review drop and to dev to wire in.
```
