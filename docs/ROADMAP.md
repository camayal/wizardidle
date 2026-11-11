# v2 Roadmap

Same game, same content and art; better code, then new features. Work happens on `dev` and is merged into `main` (the live site) only when it's playable.

## Phases

- [x] **1. Structure.** ES modules under `src/`, game data in `src/data/`, no build step. Gameplay identical.
- [ ] **2. State.** One `state` object for the wizard, combat and flags; balance constants (`rXP`, `pAttack`, …) move from the save into `config.js`. A single plain-JSON save under one prefixed key (`wizardidle2:save`) replaces the base-36 encoded keys, and "kill wizard" stops calling `localStorage.clear()` (which also wipes other games on the same domain, including the legacy copy).
- [ ] **3. Systems.** Split `game.js` into `combat`, `events`, `spells`, `zones`, `ui/render`, `ui/layout`, `audio` and `minigames/sixFiveFour`; one game loop instead of a handful of independent timers.
- [ ] **4. Polish and release.** Fix the bugs below, add a real offline service worker, link to `/legacy/` from the game, and set the version to 2.0.0. Then merge into `main`.

After 2.0.0: the features v1 never got to.

## Bugs spotted in v1 (kept as-is until phase 4)

Phase 1 deliberately preserves v1 behavior, so these are written down rather than fixed:

- **Boss fights read the previous enemy.** Boss combat uses `enemyAndNumber` (rarity, XP and gold multipliers), but only normal fights set it. A boss uses the last normal enemy's data, and a boss as the very first fight after loading would crash (`enemySprites[""]` is undefined). `battle()`, `addGold()`.
- **"another Boss" never shows.** In `getEnemy()`, `previousEvent` is set to `"enemy"` just before it's checked for `"boss"`, so the text always says "a Boss".
- **Easter egg check uses an unset variable.** `enemy + number == "el_mediano14"` runs where `number` may be undefined (boss branch).
- **`stats.random()` assumes two methods.** It picks from `keys.length - 2`, counting on `increase` and `random` being the last two keys of `statObj`.
- **Forest's Capricor is decided at load.** `zones.el_Bosque.enemies` reads `localStorage.logro_ultimocapricor` when the module loads, and is patched again in combat.
- **Clocks may survive a wizard's death** (note from v1's author at the end of `game.js`): after killing a wizard and starting another, some intervals may still be running.
- **Placeholder achievements.** 13 of the 31 achievements have empty or placeholder titles/descriptions (`logro_corazongrande`, `logro_jugon`, …).
- **Typos in player-facing text.** "explotion", "trys", "Cementery", "incresed studing", "restauration", "Grute"…
