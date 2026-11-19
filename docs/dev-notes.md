# Dev notes

The one notes file: new improvements, bugs, and the author's talk with dev. Notes saved from the dev tools' notes box (dev mode) and typed ones, newest last: the date and the
author's comment (technical details only when a moment was captured). A later note on the same test replaces an
earlier one.

```
Date: 2026-11-15 11:38
Author's note: I would like to have one creek in the praire, and keep the one in the swam, but we need to modify the maps to include them, and additionally cbe sure to create scenes of bridges one for each region
```

## Open items from the old play-test list (2026-11-18)

[~] some new enemy attacks need some sounds (the first table is wired 2026-11-18 and waits for your ears; left: the second table's boss/hydra moves, whose files are not cut yet, and the moves still to choose; docs/SOUNDS.md)
[] create scenes that are the end of one ad the beginon of the otherone.
[] in desert wizard walks from left. some of those scenes have ocean on the left of the screen, we need to modify them to make a beach (walkable) or other solution.

- Own music (2026-11-18): built as code, no WAVs: Music mode in the dev console (src/dev/music.js, src/synth.js, songs/). Still open for the author: where songs play in the game, stingers only, loops, or both (musician suggests stingers first). The musician can drop songs as <name>.song.txt in the review drop.
- Map layers (author, 2026-11-18): ribbons on the map scroll to view underground, ground and aboveground. Today localizarBocadillo (src/ui/scrolls.js) picks mapaunderground for la_Mina, la_Cueva and el_Volcan and mapa for the rest, automatically; no aboveground map or zones exist. Dev: make the ribbons switch the shown map by hand (default: the layer of the current zone) once the art is approved. Open for thinker and the author: which zones are aboveground, and the aboveground map art. Icons: icon_map_underground / icon_map_ground / icon_map_above from the artist.
- Map layers, answered (author, 2026-11-18): el_Heidan is the only aboveground zone. Underground stays la_Mina, la_Cueva, el_Volcan; everything else is ground. The aboveground map is for later, a big step: some maps will be revamped first. Do not build the map ribbons yet (their icons stay in img/ui/ribbon/, ready).

- Achievements (2026-11-18): libros, runas, tabernero, tocado and the eagle are now wired (tocado = 100 god touches in config.touchedAchievement). Still to do: re-run a playtest and tools/odds.py to confirm the tiers; capricorreturns and namesake are only rare by design.
