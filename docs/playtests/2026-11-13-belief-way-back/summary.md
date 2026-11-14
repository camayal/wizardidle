# Playtest: belief-way-back (2026-11-13)

After the author's way back from atheism (FAITH.md 3.1, 2026-11-13): passing a shrine as a Doubter or Atheist +0.5, a close call (a fight won below 10% HP with no help) +1, getting up alone -10 only as a Believer or Devout and -1 as a Doubter or Atheist, the god's super-critic 1 in 10 of his critics at x16. To compare with 2026-11-13-belief.

10 seeds per setting (1–10), to level 200, with `tools/playtest.py` (simulation mode, `src/dev/sim.js`).

Settings:

- **idle**: `god=idle`
- **active**: `god=active`

Each cell: median (min–max) over the seeds. Hours are play time in the game.

## Pace: hours played to reach each level

| setting | runs | hours | h25 | h50 | h100 | h150 | h200 |
|---|---|---|---|---|---|---|---|
| idle | 10 | 42.7 (29.7–44) | 4.06 (2.8–6.04) | 8.61 (5.83–11.1) | 17.7 (11.4–20.9) | 29.4 (19.4–33.3) | 42.7 (29.7–44) |
| active | 10 | 16.1 (14.4–18.1) | 2.27 (1.84–3.23) | 4.4 (3.52–5.04) | 8.96 (7.06–9.63) | 12.6 (11–14.4) | 16.1 (14.4–18.1) |

## What happened on the way

| setting | runs | kills | bossKills | falls | selfRevives | godTouches | godHeals | freezes | faith | gold |
|---|---|---|---|---|---|---|---|---|---|---|
| idle | 10 | 1489 (1252–1593) | 7.5 (3–11) | 540 (408–733) | 540 (408–733) | 0 (0–0) | 0 (0–0) | 0 (0–0) | 6.5M (3.1M–17.5M) | 14k (5143–133k) |
| active | 10 | 1380 (1309–1451) | 6 (4–15) | 108 (43–146) | 0 (0–0) | 108 (43–146) | 508 (426–610) | 0 (0–0) | 8.9M (7.3M–11.5M) | 4074 (1341–23k) |

## Belief

| setting | runs | beliefEnd | firstDoubter | firstAtheist | backToBeliever | h_devout | h_believer | h_doubter | h_atheist |
|---|---|---|---|---|---|---|---|---|---|
| idle | 10 | 2.5 (-3–10) | 1 (1–2) | – | 42.5 (32–48) | 0 (0–0) | 5.75 (3.55–5.92) | 36.9 (24.7–40.2) | 0 (0–0) |
| active | 10 | 100 (98–100) | – | – | 0 (0–0) | 15.7 (13.9–18) | 0.15 (0.04–1) | 0 (0–0) | 0 (0–0) |

Level at the end: **idle**: believer 3, doubter 7; **active**: devout 10. *firstDoubter* / *firstAtheist*: the wizard's level when he first became one (empty: never); *backToBeliever*: times he climbed back to Believer; *h_*: hours of play at each level.

*kills* include rare enemies; *freezes* are the v1 guardian freeze above level 190 (the game would stop until a reload; the simulation goes on). Every run is in `runs.csv`.

## Notes (dev)

Where an idle wizard ends up, with the author's way back (compare 2026-11-13-belief):

- **He becomes a Doubter almost at once:** at level 1 or 2 (two falls alone, -10 each from +20).
- **He never becomes an Atheist** in any of the 10 runs: as a Doubter a fall costs only -1, and passing shrines (+0.5) and close calls (+1) slowly lift him.
- **He comes back, again and again:** he climbs back to Believer (at +10, the margin) 32-48 times per game, and each time the next falls alone (-10) push him back down. Belief ends between -3 and +10.
- **Time at each level (median):** Doubter 36.9 h, Believer 5.8 h, Devout and Atheist 0, out of about 42.7 h to level 200.
- His faith stays positive (6.5M, against -1.5M before the way back) since a Doubter still enters shrines (at -15%). Pace barely changes (42.7 h).
- **Active god:** Devout within the first hour and pinned at +100 for the rest of the game (Devout 15.7 h of 16.1 h). His touches cost 25% less from then on.
- Fixed before this run: the stored level started empty and followed the value, so level changes were never recorded (the margin, the announcements and the time per level). The first run of this playtest was thrown away.

