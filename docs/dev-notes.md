# Dev notes

The one notes file: new improvements, bugs, and the author's talk with dev. Notes saved from the dev tools' notes box (dev mode) and typed ones, newest last: the date and the
author's comment (technical details only when a moment was captured). A later note on the same test replaces an
earlier one.

## Open items from the old play-test list (2026-11-18)

[~] some new enemy attacks need some sounds (the first table is wired 2026-11-18 and waits for your ears; left: the second table's boss/hydra moves, whose files are not cut yet, and the moves still to choose; docs/SOUNDS.md)
[] create scenes that are the end of one ad the beginon of the otherone. (planned: docs/MAPS.md, border scenes)

- Own music (2026-11-18): built as code, no WAVs: Music mode in the dev console (src/dev/music.js, src/synth.js, songs/). Still open for the author: where songs play in the game, stingers only, loops, or both (musician suggests stingers first). The musician can drop songs as <name>.song.txt in the review drop.
- Map revamp, Prairie creek, bridges: planned in docs/MAPS.md (map ribbons built; ground map spots still to re-check against the new art).

- Achievements (2026-11-18): libros, runas, tabernero, tocado and the eagle are now wired (tocado = 100 god touches in config.touchedAchievement). Still to do: re-run a playtest and tools/odds.py to confirm the tiers; capricorreturns and namesake are only rare by design.

- Idea (author, 2026-11-19): nudging from the god. Clicking a door, gate, cave entrance and the like raises the chance that the wizard takes that path next. The wizard can reject the suggestion and carry on his own way, and then the faith spent is wasted. Design questions for thinker first: faith cost, how much the odds rise, how often he refuses (belief level?), and what the player sees (console line, door glow).

- Travel graph, for later (author, 2026-11-19): the graph starts blank on purpose (config.travel.manualLinksOnly = 1: tools/travel_graph.py makes no links, every link is set by hand in the Travel mode; 0 brings the computed ones back; the old curated verdicts are in commit 18743d0). The game still does not use the graph (travel.js). The new underground points future_cave_NW (60,44), future_chamber (80,132) and the connector ladder_cueva4_mina2 (112,162) have no links yet and wait for the author's scenes and links. The (130,120) volcano mouth must not link to the lava chamber: the chamber is entered only through la_Mina2.
