# Ideas & development journal

The working notebook for Wizard Idle v2: where the project stands, what was decided and why, and ideas waiting their turn. Read this first before starting a session; update it before ending one.

- Player-facing story of each release → [CHANGELOG.md](CHANGELOG.md) (written for humans)
- The phase plan and known v1 bugs → [docs/ROADMAP.md](docs/ROADMAP.md)

---

## Where we are

- **Branch:** `dev` (v2 work). `main` is the live site, so merge only when playable.
- **Phase:** 1 (ES modules) and 2 (state + JSON save) done. **Next: phase 3**, split `game.js` into systems (combat, events, spells, zones, UI, audio, dice game) and one game loop.
- **Live:** [camayal.info/wizardidle](https://camayal.info/wizardidle/) still serves v1 code from `main`; [/legacy/](https://camayal.info/wizardidle/legacy/) serves the frozen `v1.0.0` tag.

## Decisions (and why)

| Date | Decision | Why |
|---|---|---|
| 2026-11-10 | One repo; v1 frozen as tag `v1.0.0` + branch `legacy/1.x` | Keeps history connected (`git diff v1.0.0 main` shows how far v2 has come) |
| 2026-11-10 | GitHub Actions deploys `main` at the root and `v1.0.0` at `/legacy/` | `main` stays clean, legacy can never drift from the tag |
| 2026-11-10 | v2 work on `dev`, merge to `main` when playable | `main` deploys straight to the live site |
| 2026-11-10 | ES modules, no build step | Plain JS, same spirit as v1, deploys as static files |
| 2026-11-10 | Plain-JSON save under one prefixed key, no obfuscation | Obfuscation protected nothing (the decoder is public, the dev console edits values) and made debugging hard |
| 2026-11-10 | No v1 save import | The game was never distributed |
| 2026-11-10 | Phase 1 preserves v1 behavior exactly; bugs are logged, not fixed | A refactor and a behavior change mixed together are impossible to verify |
| 2026-11-10 | Commits: real subject + body explaining what and why, no attribution trailers | |
| 2026-11-10 | Balance constants live in `src/config.js`, not in the save | Rebalancing used to require wiping saves; now an edit applies to every wizard |
| 2026-11-10 | Trainable skills = `config.baseStats` + this wizard's `statBonus` | Statues, runes and books keep raising skills per wizard while the base stays tunable |
| 2026-11-10 | Two saves: `wizardidle2:save` (the wizard) and `wizardidle2:world` (cemetery, device id) | Killing a wizard deletes only the first; the world, and its cemetery, outlives every wizard |
| 2026-11-10 | Kill never calls `localStorage.clear()` | It wiped every game on the domain, including the legacy copy |
| 2026-11-10 | v1 dev console (`exe()`) disabled, kept as commented code for the record | It ran typed text with `eval()`; hacky for its time. Safe to delete later |

## Ideas backlog

Things to try after 2.0.0 (or sooner if they fit). Add freely; nothing here is a commitment.

- Finish the 13 placeholder achievements (`logro_jugon`, `logro_ricachon`, `logro_muchapradera`...): give them titles, descriptions and real triggers.
- Link to the legacy version from inside the game (help or stats scroll).
- A real offline mode (new service worker) so it plays like an app again.
- Fix the typos in player-facing text.

## Open questions

- Should the dev console (`exe()`, unlocked by clicking name → level → faith icon) stay in v2 as a secret, or move behind a debug flag?

---

## Journal

### 2026-11-10: Phase 2 done, the wizard has one memory

- All ~150 encoded localStorage entries became one `state` object (`src/state.js`) saved as plain JSON every 2 seconds and when the tab hides or closes. `getLocal`/`setLocal`/`idx`/`check` and `storage.js` are gone; 578 lines were converted from a key map that refused unknown keys.
- Balance moved to `src/config.js`. Achievements, counters, hydra heads and the two sacred wizards' names are plain fields now.
- Found while converting: the old `thx`/`hx` encoding corrupted any name with a space (a space is one base-36 digit, the decoder reads two), and emoji/CJK broke it too. JSON fixes it.
- Behavior kept: the level-up achievements compared the level as text (`case "2"`), converted to numbers so lvl 2/140/200 still fire. The Capricor extinction check moved from the zone data into game start.
- Kill is now safe for other games on the domain; the cemetery is structured data (name, level, age, born, died), shown with v1's exact wording. **Idea from the author:** build on the cemetery later, e.g. wizards from the past helping in the story (for bulb's backlog).
- Two v1 plans found switched off and kept as flags: `inSin` (lose faith after killing) and `travelFavor` (map travel).
- Tests: normal play, save/reload persistence, kill with foreign keys present, and v1 vs v2 stress runs. Zero errors below level 210. **At level 210+ both v1 and v2 crash in `attackEV`**: spell tiers run out (21 tiers, one per 10 levels). Logged for phase 4.

### 2026-11-10: Legacy preserved, phase 1 done

- Tagged the original as `v1.0.0`, created `legacy/1.x`, set up the Actions deploy. Legacy is live at `/legacy/`.
- Phase 1: split the 4,254-line `main.js` into `src/` modules: data (enemies, zones, spells, achievements), utils, storage, game logic, entry point. Strict mode exposed 11 undeclared variables and 3 canvases reached via the "element id = global" quirk; all fixed.
- Replaced v1's cache-first service worker with a self-removing one so returning players aren't pinned to v1.
- Verified by running v1 and v2 side by side in headless Edge with virtual time and boosted rare events: zero errors, v2 reached level 118. The dice game didn't come up in testing.
- Found v1 bugs along the way (boss fights read the previous enemy's data, "another Boss" text never shows, …), logged in the roadmap for phase 4.
- Housekeeping: removed co-author trailers from commit history; turned off commit attribution globally.
