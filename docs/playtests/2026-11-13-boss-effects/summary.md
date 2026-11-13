# Playtest: boss-effects (2026-11-13)

After the boss effects (Medusa's stone, Midas's heal, blizzard, poison, earthquake), to compare with 2026-11-13-baseline.

10 seeds per setting (1–10), to level 200, with `tools/playtest.py` (simulation mode, `src/dev/sim.js`).

Settings:

- **idle**: `god=idle`
- **active**: `god=active`

Each cell: median (min–max) over the seeds. Hours are play time in the game.

## Pace: hours played to reach each level

| setting | runs | hours | h25 | h50 | h100 | h150 | h200 |
|---|---|---|---|---|---|---|---|
| idle | 10 | 41 (33.7–48.7) | 4.42 (3.23–6.24) | 9.1 (6.31–11.5) | 19.2 (14.2–22.9) | 29.9 (23.1–34.3) | 41 (33.7–48.7) |
| active | 10 | 16.2 (14.6–17.1) | 2.23 (1.75–2.54) | 4.8 (3.58–5.17) | 8.75 (7.83–9.53) | 12.7 (11.5–13.5) | 16.2 (14.6–17.1) |

## What happened on the way

| setting | runs | kills | bossKills | falls | selfRevives | godTouches | godHeals | freezes | faith | gold |
|---|---|---|---|---|---|---|---|---|---|---|
| idle | 10 | 1510 (1268–1607) | 9 (1–12) | 524 (443–743) | 524 (443–743) | 0 (0–0) | 0 (0–0) | 0 (0–0) | 7.1M (4.8M–9.7M) | 18k (727–44k) |
| active | 10 | 1383 (1274–1419) | 7 (4–14) | 113 (66–139) | 0 (0–0) | 113 (66–139) | 467 (429–516) | 0 (0–0) | 7.7M (5.7M–11.5M) | 13k (999–27k) |

*kills* include rare enemies; *freezes* are the v1 guardian freeze above level 190 (the game would stop until a reload; the simulation goes on). Every run is in `runs.csv`.
