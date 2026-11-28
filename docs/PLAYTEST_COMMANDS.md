# Playtest commands: faith and experience

Run from the repo root (C:\Users\camayal\OneDrive\Documentos\GitHub\wizardidle). Needs Python and Edge or Chrome (headless, found by itself). Each run plays the real game in `?sim=1` mode with a seeded random, so a seed always plays the same run. Results go to `docs/playtests/<date>-<name>/` (`summary.md` = tables, `runs.csv` = every run).

## Settings

A setting is `label:query`. The query is added to the sim URL:
- `god=idle` (never helps) or `god=active` (a bot that prays, heals, revives).
- `set=key:value,key2:value2` overrides config values. A bare name is looked up in `config.balance` and `config.baseStats` (e.g. `rXP`, `rEnemyXP`, `pGetBoss`); `group.key` reaches any group (e.g. `faith.reviveFe`, `hand.costFe`).
- Other params: `seed`, `until` (final level, default 200), `hours` (cap, default 2000).
- Separate several overrides with commas; in a setting write the query as `label:god=active&set=rXP:1.2,rEnemyXP:20`.

## 1. Baseline (the game as it is now)

    python tools/playtest.py --name baseline --seeds 10 --until 200 --setting idle:god=idle --setting active:god=active

Summary shows hours to reach levels 25, 50, 100, 150, 200 (median and range), falls, and achievement odds.

## 2. Experience: try variants of the XP curve

Levels per hour is the number to read. Knobs in `config.balance`: `rXP` (curve exponent, now 1.1), `rEnemyXP` (enemies per level, now 16), `factorHP`, `rHP`, `rGold`; quest XP is `quests.xpMult` (12).

    python tools/playtest.py --name xp-curve --seeds 10 --until 200 --setting base:god=active --setting "rXP12:god=active&set=rXP:1.2" --setting "enemies20:god=active&set=rEnemyXP:20" --setting "enemies12:god=active&set=rEnemyXP:12"

(Quote any setting that contains `&`.)

Target from the config notes: his normal pace is 3 to 6 levels per world hour (`levelsPerHour: 0.3` is the quest pace). Compare the `hours to L50/L100/L200` columns.

## 3. Faith: prayer value per level

`tools/faith_sim.py` reports faith per prayer at levels 10, 25, 50, 100, 150, 190. Config keys under `faith.*` and `hand.*` (see src/config.js).

    python tools/faith_sim.py --name faith-base --seeds 6 --until 200 --setting idle:god=idle --setting active:god=active
    python tools/faith_sim.py --name faith-cost --seeds 6 --until 200 --setting "base:god=active" --setting "cost4:god=active&set=hand.costFe:4" --setting "revive5:god=active&set=faith.reviveFe:5"

Columns to read: faith at each level, end faith, falls, god touches. Past results: docs/playtests/2026-11-26-faith-base and 2026-11-26-faith-variants.

## 4. Achievement rates (after adding achievements)

    python tools/playtest.py --name achievement-rates --seeds 12 --setting idle:god=idle --setting active:god=active
    python tools/odds.py docs/playtests/<date>-achievement-rates/odds-data.json

## 5. One run by hand (browser)

Open `index.html` through `python tools/serve.py`, then `http://localhost:<port>/index.html?sim=1&seed=7&god=active&until=100&set=rXP:1.2`.

## Tips

- `--workers 4` runs four browsers at once; raise it on a strong PC. `--timeout 600` is seconds per run. `--note "why"` is written into the summary.
- Quick check first: `--seeds 3 --until 50`. Real decisions: 10 seeds to level 200 (author's rule: no balance number is set without a playtest).
- Change one knob per setting, keep a `base` setting in every run to compare against.
- Sim bots do not study, rest at inns or read runes; judge those by hand.
