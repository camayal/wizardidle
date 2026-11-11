# Ideas & development journal

The working notebook for Wizard Idle v2: where the project stands, what was decided and why, and ideas waiting their turn. Read this first before starting a session; update it before ending one.

- Player-facing story of each release → [CHANGELOG.md](CHANGELOG.md) (written for humans)
- The phase plan and known v1 bugs → [docs/ROADMAP.md](docs/ROADMAP.md)

## Who's who

Two working roles share this notebook:

| Name | Role | Owns |
|---|---|---|
| **dev** | Builds the game: works through the phases on the `dev` branch | `src/`, "Where we are", "Decisions", journal entries for code work |
| **bulb** | Keeps the ideas: writes down development ideas as they come up, in the author's own terms, without judging or building them | "Ideas backlog", "Open questions" |

Ideas go to bulb, building goes to dev. When dev picks up an idea, it moves from the backlog into the phase plan or a decision.

---

## Where we are

- **Branch:** `dev` (v2 work). `main` is the live site, so merge only when playable.
- **Phase:** 1 done (ES modules). **Next: phase 2**, a `state` object, `config.js` for balance constants, and a plain-JSON save.
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

## Ideas backlog

Things to try after 2.0.0 (or sooner if they fit). Add freely; nothing here is a commitment. Kept by **bulb**.

New ideas are added as `- **Short name** (YYYY-MM-DD): what it is, and why it would be fun or useful.` Once dev takes one on, it's marked *→ picked up by dev* and links to where it went.

- Finish the 13 placeholder achievements (`logro_jugon`, `logro_ricachon`, `logro_muchapradera`...): give them titles, descriptions and real triggers.
- Link to the legacy version from inside the game (help or stats scroll).
- A real offline mode (new service worker) so it plays like an app again.
- Fix the typos in player-facing text.
- **Map rework: many ways to move** (2026-11-10): the map should work differently, and the character's location should be able to change in several ways, not just one. *Today:* the map is mostly a display: the marker sits at the current zone's fixed spot, and the only player-driven move is tapping the map to teleport once the "travelFavor" is unlocked (map code near `src/game.js:2556`).
- **Rebalance faith and player interaction** (2026-11-10): rebalance faith points and how the player (the god) interacts with the wizard, while **keeping the atheist ending possible**. *Today:* faith comes from praying, shrine offerings (gold to faith) and wiping out corrupted enemies. It's lost by skipping shrines, self-reviving, and every divine touch (heal, hit enemy). Below 0 faith the player can't help at all, which is the road to atheism (help text near `src/game.js:3077`; touch costs near `src/game.js:2758`).

## Open questions

- Faith rebalance: what feels off today: too little faith, touches too expensive, too easy or too hard to fall into atheism? And should atheism stay a one-way fate, or could the wizard drift back and forth?
- Map rework: which ways should the character be able to move? (walking between neighbouring zones, teleporting, being pushed by events or bosses, choosing a destination...) And should the map itself look or behave differently, or only how the location changes?
- Should the dev console (`exe()`, unlocked by clicking name → level → faith icon) stay in v2 as a secret, or move behind a debug flag?

---

## Journal

### 2026-11-10: Idea: faith rebalance (bulb)

- Added "Rebalance faith and player interaction" to the backlog (the atheist path must survive), with an open question about what feels off.

### 2026-11-10: Idea: map rework (bulb)

- Added "Map rework: many ways to move" to the backlog, with an open question about which kinds of movement.

### 2026-11-10: Roles named (bulb)

- Named the two working roles: **dev** builds the game, **bulb** keeps the ideas. Added "Who's who" and a format for new backlog entries.

### 2026-11-10: Legacy preserved, phase 1 done

- Tagged the original as `v1.0.0`, created `legacy/1.x`, set up the Actions deploy. Legacy is live at `/legacy/`.
- Phase 1: split the 4,254-line `main.js` into `src/` modules: data (enemies, zones, spells, achievements), utils, storage, game logic, entry point. Strict mode exposed 11 undeclared variables and 3 canvases reached via the "element id = global" quirk; all fixed.
- Replaced v1's cache-first service worker with a self-removing one so returning players aren't pinned to v1.
- Verified by running v1 and v2 side by side in headless Edge with virtual time and boosted rare events: zero errors, v2 reached level 118. The dice game didn't come up in testing.
- Found v1 bugs along the way (boss fights read the previous enemy's data, "another Boss" text never shows, …), logged in the roadmap for phase 4.
- Housekeeping: removed co-author trailers from commit history; turned off commit attribution globally.
