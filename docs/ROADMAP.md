# Roadmap

Work happens on `dev`; `main` is the live site and only gets playable versions. Each stage starts when the one before it is done.

## 1. Clean up the code (done 2026-11-11)

- [x] Update the code to modern JavaScript (`let`/`const`, template strings, arrow functions where they help).
- [x] Remove redundancy: repeated blocks (e.g. the same "end of event, back to the event picker" code in many places), copy-pasted texts, duplicated constants.
- [x] Make it more manageable: smaller functions with clear names, related code together.
- [x] Annotate each part of the code: a short comment per module and per function saying what it does. No excessive comments.
- [x] Keep gameplay identical, checked with the same tests as the v2 rebuild.

## 2. Modern, faster, less redundant

Gate before moving on: the whole code base is modern, measurably faster where it matters (game loop, drawing, console output), and free of the redundancy found in stage 1.

- [x] Spell animations never stop (a v1 bug, found in stage 1): when the last frame is drawn, `spell()` cancels the frame request but then requests another one, so every spell ever cast keeps redrawing about 60 times per second, each loop clearing the shared spell canvas. Fix first: it costs CPU and can make spells flicker. *Fixed 2026-11-12: over a 30-minute game, 72,329 animation callbacks (peak 646/s) became 3,730 (peak 50/s).*
- [x] Images loaded once and reused (v1 created a new image on every redraw), with stale late loads ignored.
- [x] Dead speed-debug branches (`masterTime < 500`) removed; enemy flags are real booleans; the medium-length event functions split into named steps.
- [ ] Offline file list generated automatically at deploy instead of kept by hand in `service-worker.js`.
- Found in passing, left for later (gameplay text): when the wizard wakes up after resting, the recovered HP is counted twice when choosing the message, so "feels totally renewed" also shows after a partial rest (`wakeUp()` in `events.js`).

## 3. The story

- [ ] Implement the story from the ideas backlog in `ideas.md` ("Finish the story": chapters III–XI and the final battle, plus the related story ideas).
- [ ] Fix the chapter keys in `src/story.js` first (a v1 bug, kept so stage 1 doesn't change gameplay): `lvl60` and `lvl90` appear twice, so the later entries (Chapter IX and X, meant for levels 160 and 190) replace the earlier ones and show at levels 60 and 90; Chapter IV never shows. `lvl99` should be `lvl199`, and `lv200` (missing an `l`) means Chapter XI never fires.

## 4. New features

- [ ] The rest of the ideas backlog in `ideas.md`, one feature at a time. This is the long part.

## Done: the v2 rebuild (2.0.0, live since 2026-11-11)

- [x] **Structure.** ES modules under `src/`, game data in `src/data/`, no build step.
- [x] **State.** One plain-JSON save (`src/state.js`), balance in `src/config.js`, kill no longer wipes other site data.
- [x] **Systems.** 15 modules, shared runtime objects (`src/runtime.js`), one game loop (`src/loop.js`).
- [x] **Polish and release.** v1 bugs fixed (below), offline mode, fixed manifest, version 2.0.0.

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
