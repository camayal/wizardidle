# Playtest: belief (2026-11-13)

10 seeds per setting (1–10), to level 200, with `tools/playtest.py` (simulation mode, `src/dev/sim.js`).

Settings:

- **idle**: `god=idle`
- **active**: `god=active`

Each cell: median (min–max) over the seeds. Hours are play time in the game.

## Pace: hours played to reach each level

| setting | runs | hours | h25 | h50 | h100 | h150 | h200 |
|---|---|---|---|---|---|---|---|
| idle | 10 | 43.3 (40.2–48.1) | 5.18 (3.46–7.04) | 10.1 (7.19–12) | 20.1 (17.9–23.1) | 31.8 (28.1–33.4) | 43.3 (40.2–48.1) |
| active | 10 | 16.1 (14.8–16.9) | 2.27 (1.83–2.83) | 4.57 (3.43–5.27) | 8.96 (7.82–9.42) | 12.6 (11.4–13.4) | 16.1 (14.8–16.9) |

## What happened on the way

| setting | runs | kills | bossKills | falls | selfRevives | godTouches | godHeals | freezes | faith | gold |
|---|---|---|---|---|---|---|---|---|---|---|
| idle | 10 | 1568 (1407–1590) | 10 (4–18) | 558 (460–739) | 558 (460–739) | 0 (0–0) | 0 (0–0) | 0 (0–0) | -1.5M (-2.2M–-1.3M) | 39k (1662–110k) |
| active | 10 | 1380 (1326–1435) | 5 (3–13) | 110 (84–146) | 0 (0–0) | 110 (84–146) | 539 (426–603) | 0 (0–0) | 9.0M (7.7M–12.4M) | 3693 (1341–26k) |

*kills* include rare enemies; *freezes* are the v1 guardian freeze above level 190 (the game would stop until a reload; the simulation goes on). Every run is in `runs.csv`.

## Notes (dev)

Compared with 2026-11-13-boss-effects, after the belief meter (docs/FAITH.md 3.1, starting weights):

- **Active god:** no real change in pace (16.1 h against 16.2 h to level 200); faith a little higher (9.0M against 7.7M). His touches keep him a believer or devout.
- **Idle god:** each fall he gets up from alone is -10, so from +20 he is an **Atheist after about 9 falls** (early, before level 25) and stays one: he never enters a shrine again, so his faith goes **deeply negative** (-1.5M against +7.1M) and nothing brings it back. Pace a little slower (43.3 h against 41 h).
- For the author and the planner: an idle player's wizard is an atheist for nearly the whole game with these weights. That may be the intended road to the atheist ending, or the -10 may be too strong; the "winning back" actions (FAITH.md 3.6) and the rescuers aren't built yet.

