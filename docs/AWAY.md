# Time away from the game

A plan for what happens to the wizard while the god is not watching. From the author's note of 2026-11-17. Nothing is built yet.

## The idea

The player is a god. When the app is closed he cannot see the world: other gods are there and time does not belong to him. The scene already starts clean on reload; the time away changes only the wizard's numbers, a little.

## Decisions (the author, 2026-11-17)

| Question | Decision |
|---|---|
| How is away time applied? | Slowed clock, small effects. Away time is divided by **108** to give "world time". No fights are played. |
| Why 108? | A number with meaning in several cultures (beads of a mala, Hindu and Buddhist traditions). Players can guess it. |
| Is it announced? | **No scroll, no popup.** The only trace is one line in the game's FAQ: unwatched time runs 108 times slower. Players find out by guessing. |
| What may world time change? | Gold and faith drift a little. A few levels over long absences. Same region. |
| Limit on levels | Never enough to reach another chapter or trigger a story event: levels from away time stop below the next chapter threshold. |
| Permadeath | The only thing that grows dramatically with absence, and it is the clock-forwarding control. The only moment the player is told anything on return: something poetic (a short text, not a system message). |
| Cap | Elapsed time is capped, so a device clock set forward cannot farm levels. |

## Rough scale (factor 108)

| Away | World time |
|---|---|
| 1 hour | about 33 seconds |
| 1 day | about 13 minutes |
| 1 week | about 1.6 hours |
| 1 month | about 6.7 hours |
| 1 year | about 3.4 days |

## How it works (sketch)

1. On close or hide, store a timestamp (plain JSON, in the save).
2. On load, away = now - timestamp, capped. World time = away / 108.
3. Apply small drift to gold and faith per world hour, an occasional level (stopped below the next chapter), and roll permadeath with a chance that rises steeply with world time.
4. If he died: on entering, show the poetic text once. Otherwise show nothing.

## Open questions

- The drift numbers, the level odds and the permadeath curve: wait for playtests (STATS tools can simulate world hours).
- The cap value.
- The poetic text itself (the historian/author writes it).
- Does the faith free revive (FAITH.md) catch an absence death, or is an absence death final?
- Does a hidden tab count as away time (same 108 rule), or only a closed app? The dev tools already freeze the game when hidden.

## To do when built

- Add the 108 line to the game's FAQ (`src/ui/scrolls.js`), worded as a hint, not an explanation.
