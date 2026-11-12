# Changelog

## Unreleased

- Code: all `var` replaced by `const`/`let`.
- Code: small helpers for repeated snippets (`startEvent`, `endEvent`, `nextEvent`, `showStage`, `wizardName`, `el`).
- Code: 117 lines of commented-out dead code removed; the ideas found in them moved to `ideas.md`.
- Code: one short comment above every function; Spanish comments, including the story plans, translated to English.
- Code: the longest functions split into named pieces (battle, attacks, stats page, dice rolls).
- Code: screen layout rewritten as one line per element (352 → 139 lines), same positions and sizes.
- Code: template strings instead of long + concatenations; more small helpers (`drawWizard`, `clearNPC`, `studyPhase`); `spell()` no longer takes four constant arguments.
- Fixed typos: health points, Currently won, Gold spent at inns, Hydra heads, enough, decides to come back, gaming house, wants to gamble, a hydra, Divine polypoid.
- Restored the disabled developer console notes, lost in the 2.0.0 module split.

## 2.0.0 — 2026-11-11

- Code split from one 4,254-line file into ES modules under `src/`, one per system.
- Game data (enemies, zones, spells, achievements) moved to `src/data/`.
- Buttons wired from `src/main.js` instead of inline `onclick` attributes.
- 11 undeclared variables declared; canvases looked up explicitly.
- Save is now one plain-JSON object instead of ~150 encoded storage entries.
- Names with spaces no longer get corrupted in the save.
- Balance numbers (XP curve, chances, starting skills) moved to `src/config.js`.
- Skills raised by statues, runes and books are stored as a bonus on top of the base values.
- Killing a wizard no longer erases other data stored by the site.
- Cemetery kept as records (name, level, age, born, died) that survive every wizard.
- One game loop with named clocks replaces five independent timers.
- Fixed: leaked timers that kept running events in parallel and could not be stopped.
- Fixed: every attack crashed from level 210 on (spell tiers ran out).
- Fixed: crash when the wizard and the enemy fell in the same round.
- Fixed: events kept running while the wizard was dead.
- Fixed: "another Boss" message never appeared.
- Fixed: easter egg check used a missing value on boss fights.
- Fixed: random skill training depended on the order of its fields.
- Fixed: installing as an app opened a broken page (wrong paths in `manifest.json`).
- Fixed typos: explosion, tries, Cemetery, Grotto, increased studying, restoration, intellect, Completion, defeated, loses, eradication, environment, BEGINNING, shrine.
- Unfinished achievements hidden and left out of the completion percentage.
- Offline mode: the whole game is stored on the device after the first visit.
- Old offline cache from v1 removed automatically.
- Version shown as 2.0.0.
- Developer console disabled (kept in the code as a comment).
- Removed unused files: `exp.js`, `cache.appcache`.

## 1.0.0 — 2018–2020

- Original version, written by hand while learning JavaScript. Frozen as tag `v1.0.0`.
