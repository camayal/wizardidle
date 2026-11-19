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
[~] (decided: two meters, faith = currency, belief = its own meter moved by moments; in docs/FAITH.md, the planner details it, then dev builds) implement the levels of believe. i think other than faith they should be included, for example a wizard where the player interact with him a lot in the best moments are better (heal in critical moments, final blow to enemies, etc), that should influence the amount of faith it gets. normal heals, normal attacks can improve the believe but in a minimum scale. obviously no revival will reduce a lot. we can think in creating to tier or faith, + number - numbers, in the story it will be modifies to some points to -inf (symbol) or we can came up with a more manable number, perhaps a different idea than a "currency" which is the current state.
[] create scenes that are the end of one ad the beginon of the otherone.
[] in desert wizard walks from left. some of those scenes have ocean on the left of the screen, we need to modify them to make a beach (walkable) or other solution.

- Own music (author decided 2026-11-18): plain Web Audio synth, no soundfont, no library (heard tools/synth_demo.html, chose A). Next: a note-list bench in tools/ (lines like 'C4 0.0 0.5 lead', pick instrument and envelope, play), render with OfflineAudioContext to WAV into the review drop, dev copies approved files to snd/. Still open for the author: stingers only, loops, or both (musician suggests stingers first).
- Ribbon bookmarks (author chose look A, 2026-11-18): replace the scroll strips (src/ui/scrolls.js stripAt/placeScrollTabs, TAB_SETS kill: kill/cemetery/bestiary, stats: stats/inventory) with ribbons hanging from the scroll's top edge, an icon each (no text), the open page's ribbon hangs lower and brighter. Clicking a ribbon keeps playSound("scroll") as the strips do now. Waiting on the artist's ribbon sprite (rest + selected) and per-page icons in the review drop; dev copies approved ones to img/ui/ribbon/ after the author's OK in the Art mode check. Then remove the strip code and the scrollTab CSS if unused, keep the layout offset logic only if the front scroll still needs room.
