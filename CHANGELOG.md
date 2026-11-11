# Changelog

The story of Wizard Idle, one version at a time. Newest first.

---

## 2.0.0 — *in progress*

### Phase 1: The tower gets floors

For years, the whole game lived in a single 4,254-line `main.js`. Every enemy, every zone, every spell and every achievement was a loose global variable, and the code found them by name: `window["el_golem"]`, `window["spellTier" + i]`. It worked, but it was a tower with no floors, where everything shared one room.

Now the tower has floors:

- **`src/data/`** holds the world itself: 50 enemy families plus 18 bosses and hydras, 669 enemy sprite variants, 16 zones with 80 stages of map paths, 58 spells (21 tiers the wizard learns along the way), and 31 achievements. It's plain data you can read without scrolling through combat code.
- **`src/utils.js`** and **`src/storage.js`** hold the small helpers everything else leans on.
- **`src/game.js`** keeps the game logic, still the same code as v1, now as a proper ES module.
- **`src/main.js`** wires the buttons. The old inline `onclick="..."` attributes couldn't see inside modules, so the page and the code now shake hands in one place.

Modules run in *strict mode*, which turned up a few things v1 had been getting away with: eleven variables that were never declared (they silently became globals), and three canvases the code reached through an old browser quirk where every element `id` is also a global variable. All of them are declared properly now.

**Nothing about gameplay changed.** To make sure, v1 and v2 were played side by side by a headless browser for hours of fast-forwarded game time, with bosses, hydras, statues and story chapters boosted so they'd come up often. Both reached level 60–118 with zero errors.

**One quiet fix for returning players:** v1 installed a service worker that cached every file forever, which would have kept anyone who visited before stuck on v1 for good. `service-worker.js` is now a *kill switch* that clears that cache and removes itself. A real offline mode comes back before 2.0.0 ships.

Retired: `enemyinfo.js` (now `src/data/enemies.js`), `exp.js` (unused experiments), and `cache.appcache` (AppCache no longer exists in browsers). All of them remain in the legacy version.

---

## 1.0.0 — 2018–2020, the original

The hand-written original, made while learning JavaScript and frozen as tag `v1.0.0`. You can still play it at [/legacy/](https://camayal.info/wizardidle/legacy/).
