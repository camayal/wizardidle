# Playtest: faith-stage1 (2026-11-25)

3 seeds per setting (1–3), to level 60, with `tools/playtest.py` (simulation mode, `src/dev/sim.js`).

Settings:

- **idle**: `god=idle`
- **active**: `god=active`

Each cell: median (min–max) over the seeds. Hours are play time in the game.

## Pace: hours played to reach each level

| setting | runs | hours | h25 | h50 | h100 | h150 | h200 |
|---|---|---|---|---|---|---|---|
| idle | 3 | 5.01 (4.89–6.57) | 2.9 (2.31–2.97) | 4.6 (3.81–5.54) | – | – | – |
| active | 3 | 2.75 (2.66–3.39) | 1.19 (0.94–1.23) | 2.29 (2.23–2.88) | – | – | – |

## What happened on the way

| setting | runs | kills | bossKills | falls | selfRevives | godTouches | godHeals | freezes | zoneChanges | faith | gold |
|---|---|---|---|---|---|---|---|---|---|---|---|
| idle | 3 | 204 (188–239) | 0 (0–0) | 71 (58–106) | 71 (58–106) | 0 (0–0) | 0 (0–0) | 0 (0–0) | 172 (149–193) | 88k (31k–117k) | 9457 (8022–13k) |
| active | 3 | 204 (189–219) | 0 (0–1) | 9 (7–12) | 0 (0–0) | 9 (7–12) | 225 (81–410) | 0 (0–0) | 158 (152–172) | 116k (116k–116k) | 577 (490–818) |

## Belief

| setting | runs | beliefEnd | firstDoubter | firstAtheist | backToBeliever | h_devout | h_believer | h_doubter | h_atheist |
|---|---|---|---|---|---|---|---|---|---|
| idle | 3 | 4 (2–6.5) | 1 (1–1) | – | 5 (4–6) | 0 (0–0) | 0.77 (0.56–0.88) | 4.24 (4.01–6.01) | 0 (0–0) |
| active | 3 | 97 (96–99) | – | – | 0 (0–0) | 2.43 (2.19–2.9) | 0.49 (0.23–0.56) | 0 (0–0) | 0 (0–0) |

Level at the end: **idle**: believer 1, doubter 2; **active**: devout 3. *firstDoubter* / *firstAtheist*: the wizard's level when he first became one (empty: never); *backToBeliever*: times he climbed back to Believer; *h_*: hours of play at each level.

## Achievements earned (share of runs)

| achievement | idle | active |
|---|---|---|
| logro_lvl2 | 100% | 100% |
| logro_primeraderrotaporboss | 100% | 100% |
| logro_ultimocapricor | 100% | 100% |
| logro_attack500 | 100% | 100% |
| logro_killedbysheep | 100% | 33% |
| logro_hydramystery | 66% | 33% |
| logro_killedbychicken | 66% | 0% |
| logro_attack1000 | 66% | 0% |
| logro_tocado | 0% | 66% |
| logro_primerbossderrotado | 0% | 33% |

*kills* include rare enemies; *freezes* are the v1 guardian freeze above level 190 (the game would stop until a reload; the simulation goes on). Every run is in `runs.csv`.
