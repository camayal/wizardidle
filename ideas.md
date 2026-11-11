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
- **Map rework: many ways to move** (2026-11-10): the map should work differently, and the character's location should be able to change in several ways, not just one. *Today:* the map is mostly a display: the marker sits at the current zone's fixed spot, and zone changes pick a random destination from the place graph (`places` in `src/data/zones.js`: each place has `x`, `y`, `moves` within the zone and `destinations` to other zones). Tapping the map to teleport was planned ("travelFavor") and is described in the help, but **never built**: nothing sets `travelFavor` and the map has no tap handler (map code near `src/game.js:2556`). Old notes: `docs/old_ideas/localidades…txt` (the original place graph) and `correspondencia de colores.txt`, a colour per place, which looks like the colour-coded hit map the original app used to know which place was tapped. Useful if tap-to-travel gets built.
- **Rebalance faith and player interaction** (2026-11-10): rebalance faith points and how the player (the god) interacts with the wizard, while **keeping the atheist ending possible**. *Today:* faith comes from praying, shrine offerings (gold to faith) and wiping out corrupted enemies. It's lost by skipping shrines, self-reviving, and every divine touch (heal, hit enemy). Below 0 faith the player can't help at all, which is the road to atheism (help text near `src/game.js:3077`; touch costs near `src/game.js:2758`).
- **Professions for the wizard** (2026-11-10, *asked to be built: ready for dev*): give the wizard professions. *From the old notes* (`docs/old_ideas/Help.txt`, `Recetas.csv`): three professions, **Alchemy, Enchanting and Writing**. Each zone has its own material to gather: mushroom (hongo), bone (hueso), gem (gema), ectoplasm, essence, herb. Recipes take two materials and have a price (50 or 100) and a difficulty:
  - *Writing → scrolls:* reduction, teleportation, understanding, maximisation, divine binding.
  - *Enchanting → rings:* health, magic power, natural integration, luck, greatness.
  - *Alchemy → potions:* health, mana, vitality, alcohol, golden potion.

  *Today:* half-prepared. Zones already name their material (`drop:` in `src/data/zones.js`) and there's a "scavenger skills" stat (`pFindMaterials`, raised by the Dwarf statue), but gathering is only a `//found materials` ToDo (`src/game.js:701`), and there's no inventory, crafting or use for the items. The old help also had "Commerce" and "Gathering" pages that the current help lacks.

- **Finish the story: chapters III–XI and the final battle** (from old notes, 2018): *Today:* only the Prologue, Chapter I and Chapter II (Devotion: faith multiplier, Divine crosier) do anything. Chapters III–VIII (lvl 50–149) exist as titles with TODO comments describing the plan (`chapter` object near `src/game.js:3173`). Chapters IX–XI and the ending aren't there at all. The planned arc (`docs/old_ideas/historiaperlevel.txt`):
  - **50, III:** faith multiplier halves; he seeks knowledge and artefacts instead of preaching.
  - **60–80:** finds a staff he believes is sacred, then breaks it.
  - **90, IV, The search for the forbidden:** gains the sacred staff. **100:** controls it, ×1.5 damage, loses faith with every kill.
  - **110, V, Repentance:** damage bonus and faith loss removed; faith rises again but less than in II.
  - **128–129:** finds a red rune with the location of the staff of corruption, then teleports to the volcano. He can't leave and fights until the staff appears in the lava.
  - **130, VI, Corruption:** ×2–3 damage, no altars, faith only falls; when about to die he teleports away and heals.
  - **139–140, VII, The ascent:** locked in the tower until King Midas appears (forced if he's near the next level). He kills Midas, absorbs his essence (the god can no longer revive him) and becomes the tower's boss. The wizards and sorceresses go into exile.
  - **149, VIII, Overthrow:** a lynching. A rare sorceress and a crowd of mages curse him (no healing) and strip the corrupt staff. He escapes at 150 with his last strength.
  - **150–159:** altars give no faith while it's above 0, he can't be revived but self-revives faster, and he never refuses help.
  - **160, IX, Vindication:** regains faith.
  - **190, X, Disobedience:** breaks his bond with the god, refuses all help, starts hunting the staff of *Nomaleatorio*. More bosses plus a Megaboss, no altars, no faith.
  - **199–200, XI, The return of the king:** goes to Heidan for the staff and proclaims himself king to take revenge on the god who abandoned him. ×2–3 damage, faith icon gone, XP bar stuck full in dark red.
  - **Final battle:** the healer appears with HP like the wizard's. When the healer dies, the god's true form appears, and that death is final. The player gets a button each second to heal or hit.
  - **Also planned:** a story for whoever dies (wizard or god), and narrative text every 10 levels. Only the lvl 0 text was written: *"Exiled by his king Midas for believing in the wrong god…"*

  Ties into the faith rebalance and the atheist path.
- **King Midas hits ×4** (from old notes): the old story notes wanted a special modifier giving Midas four times the damage. *Today:* ×2 (`src/game.js:1680`).
- **Notify story and achievements in the background** (from old notes, 2014): the Android app played a sound and vibrated for new achievements and story chapters while in the background. For the web version, this could use browser notifications. Pairs with the offline-mode idea.

## Already built (from the old notes)

Checked against the code on 2026-11-10, so these don't get re-proposed: the healer's cabin that rescues the wizard for faith · studying runes, books and statues to raise stats · the *Ship, Captain and Crew* dice game · bosses (touchable for faith) · faith from altars and gold offerings · the place graph with x/y positions and destinations · spells unlocking by level tier · the D.E. Gervais art credit (CC BY 3.0).

## Open questions

- Story: keep the old arc as written (sacred staff → corruption → killing Midas → lynching → disobedience → war on the god), or revise it? Should the late chapters' rules (no altars, no revive, refusing help) follow the faith rebalance?
- Professions: keep the old trio (Alchemy, Enchanting, Writing) and the 15 recipes, or rethink them? What should each item actually do (e.g. teleportation scroll ↔ map rework, divine binding ↔ faith)? Does the wizard pick one himself (free will) or does the player choose? One at a time or several, with their own levels? What do they produce: gold, faith, items, spell boosts? Do they tie into the faith rebalance or atheism?
- Faith rebalance: what feels off today: too little faith, touches too expensive, too easy or too hard to fall into atheism? And should atheism stay a one-way fate, or could the wizard drift back and forth?
- Map rework: which ways should the character be able to move? (walking between neighbouring zones, teleporting, being pushed by events or bosses, choosing a destination...) And should the map itself look or behave differently, or only how the location changes?
- Should the dev console (`exe()`, unlocked by clicking name → level → faith icon) stay in v2 as a secret, or move behind a debug flag?

---

## Journal

### 2026-11-10: Old notes mined (bulb)

- Read the 2014–2018 notes in `docs/old_ideas/` (old help text, story-per-level plan, place graph, place colours, recipes, spell list) and checked each against the code.
- Added: story chapters III–XI and the final battle, Midas ×4, background notifications. Enriched professions with the old trio, materials and recipes.
- Corrected the map entry: tap-to-teleport (`travelFavor`) was never built. It only appears in the help text.
- Listed what's already built so it isn't proposed again.

### 2026-11-10: Idea: professions (bulb)

- Added "Professions for the wizard" to the backlog, marked ready for dev since it was asked to be built, with open questions on how professions should work.

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
