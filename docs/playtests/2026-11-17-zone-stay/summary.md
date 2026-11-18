# Playtest: zone-stay (2026-11-17)

dev-notes 3/4: restless zone changes; old = push off

6 seeds per setting (1–6), to level 60, with `tools/playtest.py` (simulation mode, `src/dev/sim.js`).

Settings:

- **old**: `god=idle&set=zoneStayPush:0,zoneStayMax:99999,pDadosAgain:0`
- **new**: `god=idle`

Each cell: median (min–max) over the seeds. Hours are play time in the game.

## Pace: hours played to reach each level

| setting | runs | hours | h25 | h50 | h100 | h150 | h200 |
|---|---|---|---|---|---|---|---|
| old | 6 | 7.53 (6.52–10) | 3.48 (3.1–5.54) | 6.3 (5.44–8.96) | – | – | – |
| new | 6 | 7.45 (6.47–7.79) | 3.42 (2.91–3.65) | 6.33 (5.58–6.61) | – | – | – |

## What happened on the way

| setting | runs | kills | bossKills | falls | selfRevives | godTouches | godHeals | freezes | faith | gold |
|---|---|---|---|---|---|---|---|---|---|---|
| old | 6 | 347 (329–350) | 1 (0–3) | 106 (77–169) | 106 (77–169) | 0 (0–0) | 0 (0–0) | 0 (0–0) | 145k (108k–161k) | 27k (7217–31k) |
| new | 6 | 326 (313–349) | 1.5 (0–3) | 107 (79–114) | 107 (79–114) | 0 (0–0) | 0 (0–0) | 0 (0–0) | 150k (63k–229k) | 11k (4915–24k) |

## Belief

| setting | runs | beliefEnd | firstDoubter | firstAtheist | backToBeliever | h_devout | h_believer | h_doubter | h_atheist |
|---|---|---|---|---|---|---|---|---|---|
| old | 6 | 6 (-2.5–10) | 2 (1–4) | – | 9 (8–10) | 0 (0–0) | 1.15 (0.95–1.6) | 6.38 (5.18–9.09) | 0 (0–0) |
| new | 6 | 1.5 (-7.5–7.5) | 1.5 (1–3) | – | 9 (9–10) | 0 (0–0) | 1.14 (1.11–1.27) | 6.21 (5.31–6.67) | 0 (0–0) |

Level at the end: **old**: believer 2, doubter 4; **new**: doubter 6. *firstDoubter* / *firstAtheist*: the wizard's level when he first became one (empty: never); *backToBeliever*: times he climbed back to Believer; *h_*: hours of play at each level.

*kills* include rare enemies; *freezes* are the v1 guardian freeze above level 190 (the game would stop until a reload; the simulation goes on). Every run is in `runs.csv`.
