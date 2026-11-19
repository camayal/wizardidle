# Playtest: achievement-rates (2026-11-18)

How often each achievement is earned in a normal run, to set their rarity tiers.

12 seeds per setting (1–12), to level 200, with `tools/playtest.py` (simulation mode, `src/dev/sim.js`).

Settings:

- **idle**: `god=idle`
- **active**: `god=active`

Each cell: median (min–max) over the seeds. Hours are play time in the game.

## Pace: hours played to reach each level

| setting | runs | hours | h25 | h50 | h100 | h150 | h200 |
|---|---|---|---|---|---|---|---|
| idle | 12 | 26.4 (23.7–29) | 3.41 (2.87–5) | 6.33 (5.18–8.39) | 12.4 (10.8–15.2) | 19.5 (17.1–21.8) | 26.4 (23.7–29) |
| active | 12 | 12.2 (11.8–12.9) | 1.71 (1.61–1.9) | 3.38 (3.22–3.84) | 6.42 (6.13–6.98) | 9.36 (9.05–10) | 12.2 (11.8–12.9) |

## What happened on the way

| setting | runs | kills | bossKills | falls | selfRevives | godTouches | godHeals | freezes | zoneChanges | faith | gold |
|---|---|---|---|---|---|---|---|---|---|---|---|
| idle | 12 | 1089 (1049–1136) | 6.5 (3–13) | 426 (337–501) | 426 (337–501) | 0 (0–0) | 0 (0–0) | 0 (0–0) | 554 (521–582) | 6.0M (4.1M–8.2M) | 69k (10k–135k) |
| active | 12 | 1187 (1153–1214) | 6 (4–10) | 91 (72–187) | 0 (0–0) | 91 (72–187) | 457 (335–615) | 0 (0–0) | 575 (552–657) | 7.8M (5.8M–10.1M) | 4792 (1055–23k) |

## Belief

| setting | runs | beliefEnd | firstDoubter | firstAtheist | backToBeliever | h_devout | h_believer | h_doubter | h_atheist |
|---|---|---|---|---|---|---|---|---|---|
| idle | 12 | 2.5 (-6–8) | 1 (1–3) | – | 31 (28–36) | 0 (0–0) | 3.17 (2.49–4.05) | 23.3 (19.9–26.5) | 0 (0–0) |
| active | 12 | 100 (98–100) | – | – | 0 (0–0) | 11.9 (11.1–12.8) | 0.215 (0.04–1.45) | 0 (0–0) | 0 (0–0) |

Level at the end: **idle**: doubter 12; **active**: devout 12. *firstDoubter* / *firstAtheist*: the wizard's level when he first became one (empty: never); *backToBeliever*: times he climbed back to Believer; *h_*: hours of play at each level.

## Achievements earned (share of runs)

| achievement | idle | active |
|---|---|---|
| logro_lvl2 | 100% | 100% |
| logro_primeraderrotaporboss | 100% | 100% |
| logro_ultimocapricor | 100% | 100% |
| logro_attack500 | 100% | 100% |
| logro_attack1000 | 100% | 100% |
| logro_hydramystery | 100% | 100% |
| logro_primerbossderrotado | 100% | 100% |
| logro_level140 | 100% | 100% |
| logro_level200 | 100% | 100% |
| logro_killedbysheep | 100% | 91% |
| logro_killedbychicken | 100% | 75% |
| logro_hategod | 75% | 0% |

*kills* include rare enemies; *freezes* are the v1 guardian freeze above level 190 (the game would stop until a reload; the simulation goes on). Every run is in `runs.csv`.
