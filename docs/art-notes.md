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
Date: 2026-11-20
Author's note: for @artist, el_Duenon7 (future scene, travel map): the sea part should be a waterfall, and the water must be rancid (sickly green-brown, foul). The idea of Duenon is that it is sinking into the underworld: a mega-corruption. In the future the author wants this shown on the whole map (Duenon slowly sinking, corrupted water falling away), so keep el_Duenon7 as the first piece of that look. Redo el_Duenon7 with this and drop it in the review as before.
```

- For artist (dev, 2026-11-20): the walk line is the same in every scene of the game, connector scenes included (the wizard is not lifted there; the idea of raising him 3-6 px was dropped). Anything he should walk behind in a connector scene (bridge handrails and posts, stair rails, mouth or mine timbers, pier posts, the ladder) is drawn as a front overlay instead: a 256x64 transparent PNG named overlay_<scene>.png (for example overlay_bridge_south_west.png), only the parts that cover him, everything else clear; it is drawn over the wizard and every sprite (like la_mina6 and la_mina7). Put them in the review drop; dev lists them in src/data/overlays.js. Check each connector scene first for what overlaps his row (feet rows are the walk line; dev-notes has the range question) and draw an overlay only where it is needed. Bridge halves (_west and _east) line up as neighbours, so their overlays must too.
- For artist, stone bridge (author, 2026-11-20): the stone bridge (the spring bridge on the ground map, overlay_bridge_spring_west / _east) gets an overlay shaped as the bridge's low front wall (parapet): it covers about the lower 25% of the wizard (roughly the bottom 8 of his 32 sprite px, from his feet up), so he seems to walk behind the wall. The wall runs the full width of both halves and must line up at the seam. Same idea can apply to the other bridges if they have a front rail; author to decide after seeing it.
