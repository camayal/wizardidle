# Playtest: baseline (2026-11-12)

The game as of 2.1.0 plus the stats module, before any balance change: the reference every later change is compared with.

10 seeds per setting (1–10), to level 200, with `tools/playtest.py` (simulation mode, `src/dev/sim.js`).

Settings:

- **idle**: `god=idle`
- **active**: `god=active`

Each cell: median (min–max) over the seeds. Hours are play time in the game.

## Pace: hours played to reach each level

| setting | runs | hours | h25 | h50 | h100 | h150 | h200 |
|---|---|---|---|---|---|---|---|
| idle | 10 | 43.5 (30.9–47.2) | 4.36 (3.23–6.24) | 8.95 (6.31–11.5) | 18.4 (14.2–22.9) | 31 (22.8–34.3) | 43.5 (30.9–47.2) |
| active | 10 | 15.7 (14.6–16.4) | 2.24 (1.68–2.6) | 4.57 (3.79–5.36) | 8.75 (7.34–9.41) | 12.3 (11.3–13.1) | 15.7 (14.6–16.4) |

## What happened on the way

| setting | runs | kills | bossKills | falls | selfRevives | godTouches | godHeals | freezes | faith | gold |
|---|---|---|---|---|---|---|---|---|---|---|
| idle | 10 | 1454 (1094–1593) | 7 (1–15) | 570 (489–801) | 570 (489–801) | 0 (0–0) | 0 (0–0) | 9 (7–18) | 6.8M (4.8M–9.5M) | 18k (7966–40k) |
| active | 10 | 1350 (1296–1394) | 10 (6–15) | 109 (72–141) | 0 (0–0) | 109 (72–141) | 446 (388–487) | 5.5 (4–11) | 8.1M (5.5M–9.6M) | 6230 (-148–28k) |

*kills* include rare enemies; *freezes* are the v1 guardian freeze above level 190 (the game would stop until a reload; the simulation goes on). Every run is in `runs.csv`.
