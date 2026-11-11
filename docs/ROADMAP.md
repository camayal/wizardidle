# v2 Roadmap

Same game, same content and art; better code, then new features. Work happens on `dev` and is merged into `main` (the live site) only when it's playable.

## Phases

- [x] **1. Structure.** ES modules under `src/`, game data in `src/data/`, no build step. Gameplay identical.
- [x] **2. State.** One `state` object (`src/state.js`) saved as plain JSON under `wizardidle2:save`, plus `wizardidle2:world` for what outlives a wizard (cemetery). Balance constants in `src/config.js`. "Kill wizard" no longer calls `localStorage.clear()`. The v1 dev console is disabled and kept as commented code. (Combat globals such as `enemyHP` and `bossCombat` move into state in phase 3, together with the combat module.)
- [ ] **3. Systems.** Split `game.js` into `combat`, `events`, `spells`, `zones`, `ui/render`, `ui/layout`, `audio` and `minigames/sixFiveFour`; one game loop instead of a handful of independent timers.
- [ ] **4. Polish and release.** Fix the bugs below, add a real offline service worker, link to `/legacy/` from the game, and set the version to 2.0.0. Then merge into `main`.

After 2.0.0: the features v1 never got to.

## Bugs spotted in v1 (kept as-is until phase 4)

Phase 1 deliberately preserves v1 behavior, so these are written down rather than fixed:

- **Boss fights read the previous enemy.** Boss combat uses `enemyAndNumber` (rarity, XP and gold multipliers), but only normal fights set it. A boss uses the last normal enemy's data, and a boss as the very first fight after loading would crash (`enemySprites[""]` is undefined). `battle()`, `addGold()`.
- **"another Boss" never shows.** In `getEnemy()`, `previousEvent` is set to `"enemy"` just before it's checked for `"boss"`, so the text always says "a Boss".
- **Easter egg check uses an unset variable.** `enemy + number == "el_mediano14"` runs where `number` may be undefined (boss branch).
- **`stats.random()` assumes two methods.** It picks from `keys.length - 2`, counting on `increase` and `random` being the last two keys of `statObj`.
- **Level 210+ crashes every attack.** There are 21 spell tiers (0–20), one per 10 levels. At level 210 `getSpell()` asks for tier 21, gets `undefined`, and `attackEV()` fails reading `.school`. Reproduced in both v1 and v2 by stress tests (v1 reached 243–274 before failing).
- **"acá hay un BUG" (v1 author's own note).** When the wizard dies, `battle()` reads `enemyTypes[enemy].hasgold`; if `enemy` is already empty the read crashes. v1 left a `console.log(enemy + ": a")` to hunt it. Once an error interrupts `battle()`, its interval keeps running and errors cascade.
- ~~**Forest's Capricor is decided at load.**~~ Fixed in phase 2: the check moved into game start.
- **Clocks may survive a wizard's death** (note from v1's author at the end of `game.js`): after killing a wizard and starting another, some intervals may still be running.
- **Placeholder achievements.** 13 of the 31 achievements have empty or placeholder titles/descriptions (`logro_corazongrande`, `logro_jugon`, …).
- **Typos in player-facing text.** "explotion", "trys", "Cementery", "incresed studing", "restauration", "Grute"…
