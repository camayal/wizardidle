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
- Achievements in two ribbons (author, 2026-11-18): the achievements scroll gets its own ribbon set: 'this run' achievements (new, tracked per run) and 'historic' (the ones we have today, across all runs). Both stay player-centric. Needs from dev: what counts as a run and a per-run achievement store (check src/stats and the logro data first); and a TAB_SETS entry for the achievements scroll with the two ribbons. Open for the author via thinker: which achievements count per run, and are some historic-only. Icons: icon_achievements_run / icon_achievements_all from the artist.
- Map layers (author, 2026-11-18): ribbons on the map scroll to view underground, ground and aboveground. Today localizarBocadillo (src/ui/scrolls.js) picks mapaunderground for la_Mina, la_Cueva and el_Volcan and mapa for the rest, automatically; no aboveground map or zones exist. Dev: make the ribbons switch the shown map by hand (default: the layer of the current zone) once the art is approved. Open for thinker and the author: which zones are aboveground, and the aboveground map art. Icons: icon_map_underground / icon_map_ground / icon_map_above from the artist.
- Map layers, answered (author, 2026-11-18): el_Heidan is the only aboveground zone. Underground stays la_Mina, la_Cueva, el_Volcan; everything else is ground. The aboveground map is for later, a big step: some maps will be revamped first. Do not build the map ribbons yet (their icons stay in img/ui/ribbon/, ready).
- Achievements ribbons, answered (author, 2026-11-18; NOT STARTED, the author will say when): 'this run' = what the current wizard earned; the other scroll lists all achievements (global). With only one wizard in the list of wizards with achievements, a single scroll and NO ribbon is needed; with more (one alive plus dead ones) two scrolls with ribbons: the current wizard's, and everyone else's, whose entries carry the text 'Earned by: <wizard name>'. Dev: record which wizard earned each achievement (a field on the achievement store; check the logro handling in src/), then add a TAB_SETS entry shown only when more than one wizard has earned something.
