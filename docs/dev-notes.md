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

- Bug (author, 2026-11-19): after inactivity in the tab the game never restarts: it just sits there with an empty console. Dev's first read: either the page reloaded (src/away.js watchHidden, minSeconds 300) and the new load never fires its first event, or a freeze from loop.freezeGame (hide, or a transition's animation stalled while hidden) was never thawed, so the master clock stays stopped. Needs a repro: how long hidden, reload or not, errors in the browser console, whether the dev panel was open.
