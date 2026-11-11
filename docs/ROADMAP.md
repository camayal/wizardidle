# v2 Roadmap

Same game, same content and art; better code, then new features. Work happens on `dev` and is merged into `main` (the live site) only when it's playable.

## Phases

- [x] **1. Structure.** ES modules under `src/`, game data in `src/data/`, no build step. Gameplay identical.
- [x] **2. State.** One `state` object (`src/state.js`) saved as plain JSON under `wizardidle2:save`, plus `wizardidle2:world` for what outlives a wizard (cemetery). Balance constants in `src/config.js`. "Kill wizard" no longer calls `localStorage.clear()`. The v1 dev console is disabled and kept as commented code. (Combat variables such as `enemyHP` and `bossCombat` moved in phase 3 to the runtime `fight` object, which is never saved, as in v1.)
- [x] **3. Systems.** `game.js` split into 15 modules (`combat`, `events`, `wizard`, `travel`, `divine`, `story`, `achievements`, `spells`, `audio`, `ui/render`, `ui/scrolls`, `ui/menu`, `ui/layout`, `minigames/sixFiveFour`, and a small `game.js`). Shared runtime variables in `fight` / `run` / `ui`; one game loop with named clocks (`src/loop.js`).
- [x] **4. Polish and release.** v1 bugs fixed (list below), real offline mode (`service-worker.js`), fixed install manifest, unfinished achievements hidden, version 2.0.0. No link to `/legacy/` inside the game (decided: legacy is for the author and the record). *Remaining: the author's playtest, then merge `dev` into `main`.*

After 2.0.0: the features v1 never got to.

## Bugs spotted in v1

Phases 1-3 deliberately preserved v1 behavior, so these were written down first and fixed in phase 4:

- ~~**Level 210+ crashes every attack.**~~ Fixed: past level 200 the wizard keeps using the 21 existing spell tiers instead of asking for a 22nd (`knownTier()` in `spells.js`). Verified by stress runs from level 205 up to 270.
- ~~**"acá hay un BUG" (v1 author's own note).**~~ Root cause found: the wizard and the enemy can fall in the same round. The enemy's death cleared `fight.enemy` and restarted the event picker; the wizard's death then read `enemyTypes[""]` and crashed, and events would keep running while he lay dead. Fixed: a fallen enemy takes no gold, and the event picker stops until the wizard revives.
- ~~**"another Boss" never shows.**~~ Fixed: the text is chosen before `previousEvent` is overwritten.
- ~~**Easter egg check uses an unset variable.**~~ Fixed: the "HEY GUY LOOK AT ME!" check only runs for normal enemies.
- ~~**`stats.random()` assumes two methods.**~~ Fixed: picks from the skills explicitly.
- ~~**Boss fights read the previous enemy.**~~ On closer reading this was not a real bug: gold and XP already branch on boss / hydra / normal enemy. The one weak spot, a hydra without gold reading the last normal enemy, can't happen today (every hydra drops gold) and was hardened anyway.
- ~~**Placeholder achievements.**~~ The 13 unfinished ones are marked `planned:true`, stay hidden and no longer count towards completion (which made 100% impossible). Designing them is in the ideas backlog.
- ~~**Typos in player-facing text.**~~ Fixed: explosion, tries, Cemetery, Grotto, increased studying, restoration, intellect, Completion, defeated, loses, eradication, environment, BEGINNING, shrine (was "shire").
- ~~**Forest's Capricor is decided at load.**~~ Fixed in phase 2: the check moved into game start.
- ~~**Clocks may survive a wizard's death.**~~ Fixed in phase 3: the game loop allows each named clock only once, and kill stops them all.
- **Manifest paths** (found in phase 4): `manifest.json` pointed at `wizardidle/index.html`, which resolves to `/wizardidle/wizardidle/index.html`, so installing the app opened a broken page. Fixed with relative paths and 192/512 px icons.
