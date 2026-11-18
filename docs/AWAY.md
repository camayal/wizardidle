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
| Faith | Falls while the god is away (an absent god is believed in less); it does not drift up. Gold may drift either way, a little. |
| Hidden page | Treated like a closed app: when the page hides, the live game stops and the time is stored; on showing again the 108 clock settles it (proposed, author unsure what it meant, explained 2026-11-17). |
| Numbers | First numbers are estimates; adjust after playtests. |
| Cap | Elapsed time is capped, so a device clock set forward cannot farm levels. |
| Faith revive and absence (2026-11-17) | **The free revive does not catch an absence death.** Absence is staged by world time instead: after about **1 month away** he is **soft dead** (not permadead) and coming back can still save him; on that return the console shows one line implying that if the god does not appear, this is the last day of his life. After **another month away** the permadeath chance is high, and finally certain ("no chances"). Exact curve: Estimates. |
| What the player is told (2026-11-17) | **Only an absence permadeath is told**, with a **poem**, and only when it happened. The soft-dead console line is the one other trace (a game line, not a message about time). |
| The 108 factor (2026-11-17) | **Never announced**; only the FAQ hint. |

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

## The story side

### Three states, side by side

| | Soft sleep (SLEEP.md) | Soft dead (absence) | Death (cemetery) |
|---|---|---|---|
| What it is | Rest at an inn or camp | He fell while the god was away; no rescuer came, nothing finished him. He lies where he fell, fading, waiting for the one hand that can still lift him | Gone for good |
| How it ends | He wakes by himself | **Only the god** can end it, on return | Never: cemetery, then the name screen |
| Rescuers (FAITH.md) | not needed | **none**: the caravan, the shaman and the others had their chance while the god was away | none |
| Looks | Dark fade, maybe a dream | The fallen sprite with the skull above him (the skull means "the god can still act", FAITH.md) | The dead sprite, no skull |
| Told to the player | sleep lines | **one console line** (below) | **the poem** (absence permadeath only) |

**Story rules:**
- Permadeath from absence comes **only out of the soft-dead state**, never straight from a healthy wizard. Soft dead is the last door: the god walks through it or he doesn't.
- It obeys the true death rule (FAITH.md): he dies for good only where the god could have clicked. The god could have come back, so absence counts; the protected chapters are an open question below.
- No word about time in any line: no "months", no "days" (a month away is only some hours of world time), no "offline", no 108.

### The soft-dead line (console, on return)

Shown once when the god returns and finds him soft dead. It must say: he is still alive, he cannot last, only the god can change it. A month away is about seven world hours, so "since dawn" fits and quietly hints at the slow clock. Candidates:

1. *{name} has lain in the {zone} since dawn. If no god comes for him before nightfall, it will be his last day.* (recommended: plain, the same register as "No one came.")
2. *{name} opens one eye. "If you are coming," he whispers, "come today."*
3. *Somewhere in the {zone}, {name} is still breathing. Not for long. Today is the last day he can wait.*

### The poem (absence permadeath only)

**Brief:**
- **When and how:** once, on entering, over the dark scene the way a dream vision is shown (SLEEP.md): the lines appear softly, then the cemetery record and the name screen (STORY.md, *True death*). Not a scroll, not a popup.
- **Voice:** addressed to **you**, the god (STORY.md). Quiet, plain words; grief more than accusation, no blame spelled out.
- **Length:** 4 to 6 short lines.
- **Must say:** he waited for you; you did not come; he is dead for good. Uses {name}, may use {zone}. May echo the death-chapter idea *"for you, god, time is nothing; for the world it is everything"* (FAITH.md).
- **Must not say:** any time unit or count, the 108 factor, system words (save, app, offline, closed), any number.
- **Final text:** the author or the historian writes it; the drafts are starting points.

**Draft A**
> You looked away, and the world went on without you.
> {name} lay in the {zone} and counted the hours,
> then he stopped counting.
> For you, time is nothing.
> For him it was everything he had.
> No one came.

**Draft B**
> {name} called you once at dusk, once at dawn.
> The third time, he did not call.
> A god can be gone for a moment.
> A man is gone for good.
> The {zone} keeps him now.

### Cemetery, not erasure

An absence permadeath is a **regular cemetery death** (erasure is only for final-battle losers): a normal tomb (not cracked), his name **not** reversed or struck through, **no echo slot**, no soul in the final battle. He is a regular past wizard, so he can come back as the **ghost rescuer** and write **letters** (FAITH.md). The tomb's parchment note gives the cause in one line, for example *"He waited for you in the {zone}."* A letter from such a wizard (he waited, the god never came) is a strong hook; not decided.

### Hidden page in slow motion: the idea weighed

The idea: while the page is hidden (not closed), the game keeps running at 1/108 speed with the sound low and slowed, so the player can feel time passing for the wizard; a closed app is settled by calculation on return.

**Pros**
- Poetic: the god's eye drifts away and the world goes on, far and slow. Fits "the god cannot see the world".
- An audible hint at the slow clock, for players who like to guess the factor.

**Cons**
- **It is a simulation**, against the "no simulation" wish, and a second path for the same thing: the live slow game and the return calculation could disagree (a fight half-played when the page shows again, two rules for dying while away).
- **Nothing visible happens.** A hidden page cannot be seen, and at 1/108 a short fight lasts most of an hour; only the sound would ever reach the player.
- Sound from a hidden page annoys (another tab, a phone in a pocket) and costs battery on phones. Browsers also slow hidden pages down on their own, so a live run would be unreliable anyway.

**Recommendation: no slow-motion game.** Keep the decided rule (hidden = closed, settled by the 108 calculation). Keep the one good part, the feeling, as a **sound cue only**: when the page hides, the music slows and fades to silence over a few seconds; when it shows, the music comes back. One cue, no simulation, the same story ("you looked away").

## Open questions

- The cap value, and the first estimates for drift, level odds and the permadeath curve (to write next, then adjust after playtests).
- Story side, to ask the author one at a time:
  1. **On return to a soft-dead wizard:** DECIDED 2026-11-17: (a) he lies fallen and the god's touch saves him; returning alone does not.
  2. **If the god returns and leaves again without touching him:** DECIDED 2026-11-17: (a) he stays soft dead and the clock goes on toward permadeath.
  3. **Protected chapters (STORY.md true death rule):** DECIDED 2026-11-17: (a) the protection holds silently: no soft dead and no permadeath there.
  4. **Hidden page:** (a) no slow-motion game, a fade-and-slow sound cue only (recommended); (b) the slow-motion game as proposed; (c) nothing at all; (d) add or talk first.
  5. **Soft-dead line:** (a) candidate 1 (recommended); (b) candidate 2; (c) candidate 3; (d) add or talk first.
  6. **Poem:** (a) one poem, the author or historian writes it from the brief (recommended); (b) Draft A as is; (c) Draft B as is; (d) a small bag of poems that never repeat in one world; (e) add or talk first.
  7. **Does the touch that saves a soft-dead wizard give the usual revive faith (FAITH.md)?** (a) yes, the usual free revive (recommended: he was saved by the god he waited for); (b) no faith; (c) add or talk first.

## To do when built

- Add the 108 line to the game's FAQ (`src/ui/scrolls.js`), worded as a hint, not an explanation.

## Estimates

First numbers (dev, 2026-11-17), all in `config.away`, formulas in `src/awayMath.js`. Not simulated: the simulation runs a wizard on a virtual clock and has no closed-game time, so these were checked by hand and by loading a test save (35, 50 and 90 days) in the browser. Adjust after playtests.

| Number | Value | Why |
|---|---|---|
| World time | away / 108 | the decision |
| Minimum | 5 minutes | a reload or a quick look elsewhere changes nothing |
| Cap | 90 days away = 20 world hours | a device clock set forward cannot farm; equals "certain death" below |
| Faith | x0.98 per world hour (compounds, never below 0) | 1 week x0.97, 1 month x0.87, cap x0.67; never up |
| Gold | up or down by up to 0.5% per world hour, random | a week about 1%, the cap at most 10% |
| Levels | 0.3 expected per world hour, at most 3 per absence, never up to the next chapter level (or 200) | his normal pace is 3 to 6 levels an hour (docs/playtests), so this is under a tenth of it: a week about half a level, a month 2 |
| Soft dead | from 6.6 world hours (a little under 1 month) | fallen, hp 0, no self revive; only the god's touch; one console line |
| Permadeath | 0 before the soft-dead line; rises to 70% at 13.3 world hours (about 2 months); to 100% at 20 (the cap) | only from the soft-dead stage, never from a healthy wizard |

| Away | World hours | Faith left | Levels (expected) | Permadeath |
|---|---|---|---|---|
| 1 day | 0.2 | 100% | 0.07 | 0 |
| 1 week | 1.6 | 97% | 0.5 | 0 |
| 1 month | 6.7 | 87% | 2 | 0, but soft dead |
| 1.5 months | 10 | 82% | 3 | 35% |
| 2 months | 13.3 | 76% | 3 | 70% |
| 3 months or more | 20 | 67% | 3 | 100% |

Built: the save stores `meta.lastSeen` (stamped every save while the page is visible, kept at the moment of hiding or closing); on load `src/away.js` settles it. A page hidden for 5 minutes or more reloads when shown (the load settles it; not in the dev tools). The soft-dead line and the poem are in `src/data/awayTexts.js` (candidate 1 and draft A as placeholders until the author decides). To try it, in the browser console lower `dev.state.meta.lastSeen` by days in milliseconds and reload.
