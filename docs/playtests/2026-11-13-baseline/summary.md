# Playtest: baseline (2026-11-13)

The game after the level-190 freeze fix (2026-11-13): the reference for later balance changes. Replaces 2026-11-12-baseline, which counted the freezes.

10 seeds per setting (1–10), to level 200, with `tools/playtest.py` (simulation mode, `src/dev/sim.js`).

Settings:

- **idle**: `god=idle`
- **active**: `god=active`

Each cell: median (min–max) over the seeds. Hours are play time in the game.

## Pace: hours played to reach each level

| setting | runs | hours | h25 | h50 | h100 | h150 | h200 |
|---|---|---|---|---|---|---|---|
| idle | 10 | 43.1 (30.9–47.8) | 4.36 (3.23–6.24) | 8.95 (6.31–11.5) | 18.4 (14.2–22.9) | 31 (22.8–34.3) | 43.1 (30.9–47.8) |
| active | 10 | 15.6 (14.5–16.4) | 2.24 (1.68–2.6) | 4.57 (3.79–5.36) | 8.75 (7.34–9.41) | 12.3 (11.3–13.1) | 15.6 (14.5–16.4) |

## What happened on the way

| setting | runs | kills | bossKills | falls | selfRevives | godTouches | godHeals | freezes | faith | gold |
|---|---|---|---|---|---|---|---|---|---|---|
| idle | 10 | 1452 (1095–1598) | 7.5 (1–15) | 568 (494–817) | 568 (494–817) | 0 (0–0) | 0 (0–0) | 0 (0–0) | 6.9M (4.6M–9.6M) | 15k (3210–72k) |
| active | 10 | 1350 (1288–1393) | 10 (6–15) | 112 (75–143) | 0 (0–0) | 112 (75–143) | 444 (394–485) | 0 (0–0) | 8.4M (5.5M–9.5M) | 5943 (-1041–30k) |

*kills* include rare enemies; *freezes* are the v1 guardian freeze above level 190 (the game would stop until a reload; the simulation goes on). Every run is in `runs.csv`.
