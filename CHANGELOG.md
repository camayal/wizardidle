# Changelog

The story of Wizard Idle, one version at a time. Newest first.

---

## 2.0.0 — *in progress*

### Phase 2: The wizard gets one memory

v1 remembered things the way a hoarder keeps receipts: about 150 separate scraps in the browser's storage, each one in a homemade cipher. The game read and rewrote them hundreds of times a minute through `getLocal("Gold")` and `setLocal("Gold", …)`, turned the text back into numbers every single time, and even kept the rules of the world (how fast XP grows, how likely a boss is) inside each wizard's save.

Now the wizard has **one memory**, a single object called `state`, saved as plain, readable JSON:

```json
{ "player": { "name": "Netile", "lvl": 12, "gold": 340, "faith": 55 },
  "zone": { "current": "la_Pradera", "stage": 3 }, "achievements": { "logro_lvl2": true } }
```

- **The rules of the world moved to `config.js`.** Change the boss chance or the XP curve there and every wizard plays by the new rules on the next visit. Before, you had to wipe saves to see a change.
- **Skills grow on top of the rules.** Statues, runes and books still sharpen each wizard, and the save remembers only what *this* wizard learned.
- **The cemetery is forever.** Killing a wizard used to erase the browser's entire storage for the site, including any other game living there and the legacy copy of Wizard Idle itself. Now it removes only that wizard. Fallen wizards are kept in a separate "world" save as proper records (name, level, age, born, died) waiting for future stories.
- **A ten-year-old bug, gone without trying.** The old cipher wrote each letter as two base-36 digits, but a space only takes one. So **any wizard named with a space came back garbled**: "Old Merlin" turned into `Old҂¶ЗÛҧ`. Plain JSON doesn't care.

**Still the same game.** The trickiest part was everywhere v1 quietly relied on numbers being text. For example, the level-2, 140 and 200 achievements checked `case "2"`, which would have silently stopped firing. Each spot was found and converted. Saving and reloading, killing a wizard next to other games' data, and hours of stress-tested play all behave as before.

**Found while digging:** two ideas from 2018 that were wired up but never switched on. One is a "sin" state where the wizard loses faith for every kill; the other is fast travel from the map once the god favors the wizard. Both are kept as switches for later. Also found: past level 210 the wizard runs out of spells to learn and every attack fails, in v1 too. That's on the list for the 2.0.0 polish.

The old developer console (click the name, then the level, then the faith icon) is switched off and kept in the code as a museum piece.

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
