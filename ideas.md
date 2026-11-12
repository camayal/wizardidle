# Ideas & development journal

The working notebook for Wizard Idle v2: where the project stands, what was decided and why, and ideas waiting their turn. Read this first before starting a session; update it before ending one.

- What changed in each release → [CHANGELOG.md](CHANGELOG.md) (short bullet points)
- The route ahead (cleanup, speed, story, features) and the fixed v1 bugs → [docs/ROADMAP.md](docs/ROADMAP.md)
- The author's old notes, spreadsheets and art sources (2014–2018) live **outside the repo**, in the sibling folder `wizardidle-old-ideas/` on the author's machine; the layer extraction script is in its `tools/`. Paths below like `wizardidle-old-ideas/layers/` refer to it.

---

## Where we are

- **Branch:** `dev` (v2 work). `main` is the live site, so merge only when playable.
- **Released:** 2.0.0 is live since 2026-11-11 (tag `v2.0.0`). **Stage 1 (code cleanup) done. Next: stage 2**, modern and faster (first: the endless spell animations). Then stage 3 (the story), stage 4 (new features).
- **Live:** [camayal.info/wizardidle](https://camayal.info/wizardidle/) serves 2.0.0 from `main`; `/legacy/` serves the frozen `v1.0.0` tag (not linked anywhere).

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
| 2026-11-10 | Shared runtime variables live in `fight`, `run` and `ui` (`src/runtime.js`), never saved | Modules can't reassign each other's variables; a fight still doesn't survive a reload, as in v1 |
| 2026-11-10 | One game loop with named clocks (`src/loop.js`) instead of `setInterval` handles | v1 leaked master clocks that could never be stopped; a named clock exists at most once |
| 2026-11-10 | One module per system; startup values stay together in `game.js`, other modules only define things at load | Keeps load order identical to v1 and makes circular imports safe |
| 2026-11-10 | The old notes and the extraction tool live outside the repo, in `wizardidle-old-ideas/` next to it | Working material, not part of the game; never committed or published |
| 2026-11-10 | No link to `/legacy/` from the game or the README | The legacy copy is for the author and the historical record |
| 2026-11-10 | Unfinished achievements ship hidden (`planned:true`) and don't count towards completion | Design them later; until then 100% is reachable |
| 2026-11-10 | Past level 200 the wizard keeps the 21 existing spell tiers | Fixes the level-210 crash with no new content |
| 2026-11-10 | Offline mode: network first for code, stored copy first for art and sound, new cache per release | Online players always get the newest version; offline still plays; old versions don't linger |
| 2026-11-11 | Route after 2.0.0: 1 clean up the code, 2 modern and faster, 3 the story, 4 new features | The author's order: a clean, fast base before adding content |
| 2026-11-11 | CHANGELOG is a flat list of short bullets per version, no narrative or subtitles | The author's preference for readability |
| 2026-11-12 | Story script revised: the scroll speaks to you (the god), a prophecy of the Omni behind the exile, the hooded healer is your mask, one staff made by the dead, falls instead of deaths, two endings (you unmake him and rewind time, or he becomes the Omni) | Decided one question at a time; full list and the text in [docs/STORY.md](docs/STORY.md) |

## Ideas backlog

Things to try after 2.0.0 (or sooner if they fit). Add freely; nothing here is a commitment.

New ideas are added as `- **Short name** (YYYY-MM-DD): what it is, and why it would be fun or useful.` Once dev takes one on, it's marked *→ picked up by dev* and links to where it went.

- Finish the 13 placeholder achievements (`logro_jugon`, `logro_ricachon`, `logro_muchapradera`...): give them titles, descriptions and real triggers. *Since 2.0.0* they're marked `planned:true` in `src/data/achievements.js`: hidden, and not counted towards completion. So finishing one means designing it and removing the flag. Every one already has its icon. The names hint at the plan: *jugón* (gambler), *dados cargados* (loaded dice) and *full carga* (full cargo) are dice; *inventario lleno* (full inventory) needs an inventory (professions); *dormiletas* (sleepyhead) is camping or inn; *corazón grande* (big heart), *ricachón* (rich), *fanático*, *estudioso* (studious), *eso sí es iluminación* (now that's enlightenment), *flawless*, *mucha pradera* / *mucho poblado* (lots of meadow / village), *primer boss* (first boss). Most need the stats from "Track almost everything as stats".
- ~~Link to the legacy version from inside the game (help or stats scroll).~~ *Dropped 2026-11-10:* the author decided there's no link to `/legacy/` from the game or the README.
- A real offline mode (new service worker) so it plays like an app again.
- ~~Fix the typos in player-facing text.~~ *Done by dev in phase 4 (2.0.0):* fourteen kinds of typos fixed ("the Grute" → "the Grotto", "shire" → "shrine", "restauration" → "restoration", …). See CHANGELOG.md.
- **Map revamp: many ways to move, fog, inner maps** (2026-11-10): the map should work differently, and the character's location should be able to change in several ways, not just one. Also from the author:
  - **Map fog:** places the wizard doesn't know stay hidden and are revealed as he discovers them. Some places start out known because they're part of the story (e.g. the City where he was exiled, the Tower of King Midas).
  - **Inner or local maps:** maps of a single area (inside the City, the Tower, a cave or mine) in addition to the world map.
  - *Art to start from* (`wizardidle-old-ideas/layers/`): `mapa` has **one layer per zone** (Pradera, Bosque, Desierto, Pantano, Gruta, Tundra, Volcán, Duenon…), which suits revealing the map zone by zone under the fog. `mapa_conaltares` marks the altars; `guias` / `guias y otros mapas` have circles, dots and numbers (the place markers); `mapas numeros actuliazados julio 2018` is a 487×768 numbered map. Fog and discovery tie into stats ("unique places visited").
  - *Today:* the map is mostly a display: the marker sits at the current zone's fixed spot, and zone changes pick a random destination from the place graph (`places` in `src/data/zones.js`: each place has `x`, `y`, `moves` within the zone and `destinations` to other zones). Tapping the map to teleport was planned ("travelFavor") and is described in the help, but **never built**: nothing sets `travelFavor` and the map has no tap handler (map code at the `//Put the bocadillo in the right place in the map` comment in `src/ui/scrolls.js`). Old notes: `wizardidle-old-ideas/localidades…txt` (the original place graph) and `correspondencia de colores.txt`, a colour per place, which looks like the colour-coded hit map the original app used to know which place was tapped. Useful if tap-to-travel gets built. *Travel favor* (from dev, phase 2): kept as `state.travelFavor` in `src/state.js`, default false. The help scroll already shows "Touch the map…" / "Touching it can…" when it's on, and a v1 comment says `love god give setLocal("travelFavor",1)`, so the idea was that the god *grants* travel as a favour when the wizard loves him. There's no travel code behind it yet.
- **Rebalance faith and player interaction** (2026-11-10): rebalance faith points and how the player (the god) interacts with the wizard, while **keeping the atheist ending possible**. *Today:* faith comes from praying, shrine offerings (gold to faith) and wiping out corrupted enemies. It's lost by skipping shrines, self-reviving, and every divine touch (heal, hit enemy). Below 0 faith the player can't help at all, which is the road to atheism ("The player" help text and the divine-touch faith costs, `//determine faith cost`, in `src/ui/scrolls.js` and `src/divine.js`).
- **Professions for the wizard** (2026-11-10, *asked to be built: ready for dev*): give the wizard professions. *From the old notes* (`wizardidle-old-ideas/Help.txt`, `Recetas.csv`): three professions, **Alchemy, Enchanting and Writing**. Each zone has its own material to gather: mushroom (hongo), bone (hueso), gem (gema), ectoplasm, essence, herb. Recipes take two materials and have a price (50 or 100) and a difficulty:
  - *Writing → scrolls:* reduction, teleportation, understanding, maximisation, divine binding.
  - *Enchanting → rings:* health, magic power, natural integration, luck, greatness.
  - *Alchemy → potions:* health, mana, vitality, alcohol, golden potion.

  *Today:* half-prepared. Zones already name their material (`drop:` in `src/data/zones.js`) and there's a "scavenger skills" stat (`pFindMaterials`, raised by the Dwarf statue), but gathering is only a `//found materials` ToDo in `src/combat.js`, and there's no inventory, crafting or use for the items. The old help also had "Commerce" and "Gathering" pages that the current help lacks. *Art already drawn* (`wizardidle-old-ideas/unorganzed_sprites/Sprites/`): `anilos.png` is **five gem rings** (pink, blue, green, orange, brown), one per ring recipe. `BASE/dg_food32.gif` has mushrooms in a dozen colours (the *hongo* material), plus drinks, bread and meat.

- **Finish the story: chapters III–XI and the final battle** (from old notes, 2018): **Scripted 2026-11-12 in [docs/STORY.md](docs/STORY.md)** (branch `plan/story`): every scroll and console beat, revised from the arc below; the code still has to follow. *Today:* only the Prologue, Chapter I and Chapter II (Devotion: faith multiplier, Divine crosier) do anything. Chapters III–VIII (lvl 50–149) exist as titles with TODO comments describing the plan (`var chapter` object in `src/story.js`). Chapters IX–XI and the ending aren't there at all. The planned arc (`wizardidle-old-ideas/historiaperlevel.txt`):
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

  *"In sin" switch* (from dev, phase 2): the mechanism for the lvl 100 "loses faith with every kill" rule is already coded. In `battle()`, kills while `state.player.inSin` is true subtract faith, and cleansing corrupted enemies only gains faith when it's false. Nothing ever turns it on: the chapter events have only comments (lvl 100 sets it, lvl 110 clears it, lvl 130 sets it again). v2 keeps it as `state.player.inSin` in `src/state.js` (v1 key `inPecado`), default false. Wiring the chapters to flip it is most of the work.
- **King Midas hits ×4** (from old notes): the old story notes wanted a special modifier giving Midas four times the damage. *Today:* ×2 (`if (enemy == "midas"){enemyHit *= 2}` in `src/combat.js`).
- **Notify story and achievements in the background** (from old notes, 2014): the Android app played a sound and vibrated for new achievements and story chapters while in the background. For the web version, this could use browser notifications. Pairs with the offline-mode idea.
- **Wizards from the past help in the story** (2026-11-10, via dev): build on the cemetery. In the author's words: *"perhaps the cemetery will be something we can build on in the future, for example part of the history in which wizards from the past can help."* *Today* (phase 2, on dev): killed wizards are kept as records in the `wizardidle2:world` save, which outlives every wizard (`world.cemetery = [{ name, lvl, age, born, died }]`). The kill scroll lists them ("Name (lvl: 12) died at the age of 23. born – died"), and nothing else uses them yet. Fallen wizards from earlier runs could come back to help in the story: as ghosts, allies, legends in the console, or tied to the "story for whoever dies" from the old notes.
- **Levelling pace: XP per enemy** (from `wizardidle-old-ideas/infodexp.xlsx`, 2018): the XP spreadsheet planned that each level takes **16 × level kills**: XP per enemy = (XP gap to next level) ÷ (16 × level). That's 16 kills at level 1, 800 at 50, 1,600 at 100 and 3,200 at 200, where the sheet marks **END**. *Today:* the game divides by 16 only (`xpPerEnemy` in `levelUP()`, `rEnemyXP` in `src/config.js`), so every level takes about 16 base kills (normal kills give ×1.5, so ~11) no matter the level. The sheet's own playtest log (sheet "Hoja4", pivot of XP events per level for levels 1–196) shows the shipped pace: ~17–27 XP events per level, flat. The rest of the sheet matches the code exactly: XP curve `lvl^1.1 × 8`, HP = XP × 1.6483, enemy HP = HP × 1.2, age starting at 19 and growing by XP × 0.0005. One more difference: gold per HP is **0.25** in the sheet but **0.15** in `config.js`.
- **New creatures from the old list** (from `infodexp.xlsx`, sheet "Hoja2"): a list of 27 creatures written as zone-enemy names. 4 are already enemies (elf, dwarf, ogre, golem), and a griffin appears as an animal sprite's display name. Not in the game yet: salamander, gargoyle, gremlin, ghoul, troll, harpy, banshee, serpent, leviathan, minotaur, nymph, centaur, chimera, sphinx, cyclops, naga, sylph, treant, doxy, duende. They'd need sprites, and the v2 plan keeps the existing assets, so this is post-2.0.0 material.
- **Track almost everything as stats** (2026-11-10): keep a stat for nearly everything that happens, so later achievements, missions, quests and new areas have numbers to hang on ("kill 50 corrupted enemies", "reach 0 faith three times", "visit every place in the Swamp"). *Today:* 56 counters via `count()` into `state.counters`, several split by key (`zone_*`, `enemy_*`, `typeBoss_*`, `school_*`, `altar_zone_*`, `BotinGot_*`, `Polymorph_*`, `study_*`…), plus `meta.playTimeMs`. Gaps found: they're **all counters**. There are no records (highest / lowest), no "firsts" (when something first happened), and nothing across wizards. The **dice game tracks nothing at all**.

  Four kinds of stat to keep:
  - *Counters:* how many times (what `count()` does today).
  - *Totals:* how much in all (damage, gold, faith).
  - *Records:* the best or worst ever (biggest hit, most gold held, lowest faith).
  - *Firsts:* the level, age and date something first happened (first boss, first death, first rare). These are great for story callbacks and quest unlocks.

  Each can live per wizard (`state`) or per world across all wizards (`wizardidle2:world`, next to the cemetery).

  Candidates, by area:
  - *Combat:* damage dealt / taken (totals); biggest hit and biggest crit (records); longest fight in rounds; fights won without taking a hit; close calls (won under 10% HP); kill streak without dying; kills by enemy type (melee, wizard, nature, fire, frost…) and by zone; corrupted enemies killed; rare enemies killed by name; spells cast by spell, not just school; total HP healed; kills while polymorphed.
  - *Deaths:* deaths by zone and **killed by** (which enemy or boss); divine revives vs self-revives (amount of faith lost); level and age at each death.
  - *Faith and the god:* faith gained / spent (totals); highest and lowest faith ever (how deep into atheism); times faith crossed 0 in each direction; time spent below 0; divine touches by target (wizard, enemy, boss, shrine); touches with too little faith; faith lost skipping shrines (an amount; `negar` only counts).
  - *Gold:* earned / spent (totals); most gold held (record); inn spending (exists); robbed, once robbery exists.
  - *Dice (untracked today):* games played; won / lost / tied; gold won / lost; best cargo; times he risked another roll and whether it paid; opponents beaten.
  - *Exploration:* unique places visited (e.g. `el_Bosque3`, not just zones); first-visit level per zone; time spent per zone; overworld vs underground; longest stay in one zone; map opened.
  - *Study:* runes vs books separately; total skill gained per stat (`statBonus` holds the result, not the history).
  - *Progress and time:* time per level (real play time); level, age and date of each chapter; sessions, days played, longest session; offline time, if offline progress comes back.
  - *Player habits:* scrolls opened (stats, achievements, help, map); taps on the scene.
  - *World, across wizards:* wizards created / killed; highest level ever; oldest wizard; lifetime kills, bosses, gold, faith. Enables account-wide achievements and the cemetery idea.
  - *For future systems:* materials gathered by type, items crafted / used (professions); quests started / completed; story choices.

  Found while looking: `cardCombat()` in `src/combat.js` is an empty placeholder (a card-combat idea that never started?).
- **Unused sprites: abandoned ideas with art ready** (2026-11-10, from `wizardidle-old-ideas/unorganzed_sprites/`): 51 of the folder's images aren't in `img/`. Most of the folder (backgrounds, altars, statues, dice, buttons) is already in the game. What's left points at ideas:
  - **Rings** (`anilos.png`) → Enchanting (see Professions).
  - **Playing cards numbered 1–6**, in the town sheet `BASE/townactions.gif` → **a card game against tavern NPCs** (confirmed by the author). That's what the empty `cardCombat()` stub was for. Taverns already exist (`la_ciudad_taberna`, `el_poblado_taberna`, `el_desierto_taberna` backgrounds; `innEV()` and the `taberna` counters), so the game would sit next to the dice game (played at the dice house, `casadados`). It would need its own stats (games, wins / losses, gold won / lost, opponents) and could share the gambling achievements (*jugón*).
  - **Town sheet** (`townactions.gif`, D.E. Gervais): a *Rumors* scroll (quests or hints), keys, a map, potions, books, a coin bag, food, a crown, NPC portraits → quests, rumours, shops.
  - **Shop fronts** (`BASE/dg_town932.gif`): weapons, armour, potions, magic, books, tavern, bank, temple, stables, guild signs → shops and guilds in the City or Village. Commerce from the old help, profession trainers.
  - **Townsfolk** (`BASE/dg_people32.gif`, 12 characters) and a **speech bubble with text** (`bocadillo con letras.png`) → NPCs who talk: quest givers, merchants, rumours.
  - **Interior tiles** (`BASE/L2_*`: bar, beds, kegs, tables, cabinet, columns, doors, a prison mat) → indoor scenes: the inn, the healer's hut, or a prison (the Chapter VIII lynching?).
  - **Boss crowns** (`boss icons/`: plain, silver, gold, red; `bossCoronas.pdn`) → boss ranks. *Today* bosses, hydras and guardians all show the same `boss.png`. Could mark boss / guardian / hydra / megaboss, or how many times a boss has been beaten.
  - **`logro_level100` icon** → a level-100 achievement that doesn't exist (only 2, 140 and 200 do). Level 100 is when the wizard takes control of the sacred staff in the story.
  - **New Meadow backgrounds** (`Bkg/news/la_pradera32.png`, a crowd at the edge; `la_pradera4b.png`, a rock or hut) → scene variants or story scenes.
  - Not features: `iconSiluete.png` (the "IDLE" logo), `ForGooglePlay.png` (store art).
- **Dynamic scenes: as alive as possible** (2026-11-10, *a big idea*): make the scenes change as much as possible instead of being fixed pictures. *Today:* every place is one flat 256×64 PNG set as the canvas's CSS background (`loadBackground()` in `src/ui/render.js`; a canvas-drawing version sits commented out right below it). The same place always looks the same, and nothing moves except the wizard, the NPC and the spells.

  *Source art exists, in layers* (`wizardidle-old-ideas/unorganzed_sprites/Sprites/Bkg/pdns/`, Paint.NET files): 32 scene files, 256×64, most with **5–42 layers**. Plain + Forest has 42, Duenon 41, Volcano 27–36, Dunes 25–30, Heidan 22, City 18–25. Most are built as `Fondo` (base) + `Deco` + many prop layers. Named layers show intent: the City has `calle` (street), `puerta` (door), `lampara` (lamp); Plain + Forest has layers **`1`–`5`**, which look like the five numbered versions of each place, made from one file; the Swamp has `death_ooze`; the healer's hut is assembled from the interior tiles (keg, floor decoration, potion). Also there: `bkgtemplate.pdn` (Fondo + Deco template), `mapa.pdn` (a layer per zone: Pradera, Bosque, Desierto, Pantano, Gruta, Tundra, Volcán, Duenon), and `guias.pdn` / `guias y otros mapas.pdn` (map guides with circles, dots and numbers), useful for the map rework.

  **Direction from the author:** build scenes dynamically, but **keep the nature of the hand-crafted ones**: compose from his own layers following the way he composed them, not generic generation. Keep **special scenes identical to the legacy ones**.

  **Layers extracted** (2026-11-10): all 51 .pdn files are now in `wizardidle-old-ideas/layers/` (*local only*: on the author's machine, not in git) (901 PNGs, a `layers.json` per file with each layer's name, visibility, opacity and blend mode, plus `composite.png`). The tool is `wizardidle-old-ideas/tools/pdn_extract.py` (also local only). **26 of the 34 scene files rebuild a game background pixel for pixel** from their saved layers (e.g. `la Ciudad` → `la_ciudad_altar.png`), so legacy-identical scenes are possible. The files hide most of their layers (City 13 of 18, Duenon 34 of 41, Plain + Forest 31 of 42): the numbered versions of each place, `_altar` and `_estatua`, were made by switching layers in one file. So "dynamic" can mean recording which layer combinations he used and which he'd allow, then mixing within those rules. See the README there for the full match table.

  Ways to make scenes dynamic:
  - **Compose from layers:** draw base + deco + a random or state-driven set of props on the canvas, so each visit looks a bit different and the five versions per place become combinations instead of fixed images.
  - **Time and weather:** day / night tint, the City's lamp layer lit at night, rain, snow in the Tundra, a lava glow in the Volcano. Could follow real time or the wizard's age.
  - **Small animations:** flickering lamps and fire, bubbling ooze, water, smoke; light parallax between layers.
  - **Scenes that remember:** fallen enemies or broken loot stay for a while, doors open (`puerta`), the altar or statue appears in the scene when found, the Forest thins out as the last capricors die.
  - **Story changes the world:** the tower empties after the mages' exile (VII), the staff in the Volcano's lava (129), a darker world in the corruption chapters, the City after Midas falls.
  - **Passers-by:** townsfolk from `dg_people32.gif` walking through towns, tavern patrons for the card game.

  Practical note: done. Each layer is its own PNG in `wizardidle-old-ideas/layers/`, with names, visibility and opacity read exactly. To add or update a source file, re-run `python tools/pdn_extract.py <file or folder> wizardidle-old-ideas/layers`.
- **Pixel-art UI: tiles for the bars and panels** (2026-11-10): the interface mixes two styles. The buttons, the heart HP icon (`heartMeter()`), the scroll and the frame are pixel-art images, but the **XP bar is a plain HTML `<meter>`** (`#XPprogressBar` in `index.html`, updated in `updateHeading()`), styled by the browser. Idea: draw a small set of pixel-art tiles (left cap, repeating middle, right cap, fill, maybe a sparkle when levelling up) and build the XP bar from them, then reuse the same kit for anything else still drawn in plain HTML, so the whole UI shares one hand-made look. Existing pieces to match: `img/emptyLongBtn.png`, `img/frame.png`, the scroll backgrounds, and the `Btn` / `Empty` / `regilla` / `tile000` source files in `wizardidle-old-ideas/layers/`.

- **Ideas found in the v1 code comments** (2026-11-11, from commented-out code removed in stage 1; the original lines are in tag `v1.0.0`):
  - *Robbery* ("robbed!", "rest: chance to be robbed", and in Spanish "a rogue robs him and escapes, gold drops"): a thief steals part of the wizard's gold, at random or while he rests.
  - *Fight at the inn when he can't pay* ("add event of fight if have not gold"): today the inn just turns him away or lets him sleep; a brawl could be the price.
  - *Quests*: "quest? check the scrolls" with a link to a fantasy tile set used as reference. Ties into the stats and NPC ideas above.
  - *Achievements for every boss and for each hydra* ("todo logro de todos los boss", "todo logro de cada hidra").
  - *"Hey guy look at me" achievement*: when `el_mediano14` appears (the shortie who shouts "HEY GUY LOOK AT ME!"). Original flavour line: "The world is losing its values, the un-polite enemies do not see the opponent in the face".
  - *Dice game stats and achievements* ("TODO add idx for all this part and achievements" in the dice game). Fits the planned *jugón* / *dados cargados* / *full carga* achievements.
  - *See-through ghosts*: enemies marked `translucid` in `src/data/enemies.js` (slime, spectre, ether) and the ghost-like bosses (cuboq, etymos, infraespectro) were meant to be drawn semi-transparent (opacity 0.7–0.8).
  - *Locked achievements on the achievements page*: show not-yet-earned ones with a placeholder image (`img/no_logro.png` exists) instead of hiding them.
  - *Only one game tab*: detect the game open in two tabs and warn ("Wizardidle is running in another tab!").
  - *Android back button*: keep it from closing the app when installed.
  - *Fade transitions* between the clouds, the name screen and the game.
- **Story implementation notes live in the code** (from the v1 code): `var chapter` in `src/story.js` keeps the author's 2018 step-by-step plan for chapters III–XI and the ending, as Spanish comments inside each chapter: the 4-step red rune event (lvl 128), locking the wizard in the volcano, 5-second self-revive, the tower siege and Midas (139–140), the lynching (149) with flags and a special death chapter, refusing divine help, the healer's final battle and the game-over flag. Read them together with "Finish the story" above when stage 3 starts. The notes are in English since 2026-11-11. Watch out: the chapter keys have v1 typos (`lvl60`/`lvl90` twice, `lvl99`, `lv200`); see the roadmap, stage 3.

## Already built (from the old notes)

Checked against the code on 2026-11-10, so these don't get re-proposed: the healer's cabin that rescues the wizard for faith · studying runes, books and statues to raise stats · the *Ship, Captain and Crew* dice game · bosses (touchable for faith) · faith from altars and gold offerings · the place graph with x/y positions and destinations · spells unlocking by level tier · the D.E. Gervais art credit (CC BY 3.0) · the per-sprite enemy table: all 669 sprites in `InformationByEnemy.xlsx` match `src/data/enemies.js` exactly (type, rare, corrupted, display name) · the zone boss and enemy table in `enemyLocation.xlsx` (2014): all 16 bosses match, and 14 of 16 enemy lists match exactly. The Castle's sorceress (`la_Hechicera`) was later dropped from the code, and the Forest's elf (`el_Elfo`) was added · the XP/HP/age/enemy-HP formulas in `infodexp.xlsx` (except the two differences noted in "Levelling pace").

## Open questions

- ~~Publishing: would `wizardidle-old-ideas/` and `tools/` go live with the site?~~ **Resolved 2026-11-10:** the author keeps both **local only**. They're untracked on `dev` and listed in `.gitignore`, and the files stay on disk in the main checkout.
- Pixel-art UI: which elements get tiles first (XP bar, then faith or HP bars, scroll frames, console)? Should the XP bar animate (filling, a level-up flash)?
- Dynamic scenes: which kinds of change matter most (layer variety, day / night and weather, animation, scenes that remember, story changes, passers-by)? Do the layers `1`–`5` in *pradera y bosque* really match the five versions of each place? And which .pdn is the latest when there's a "- copia" (copy) with more layers than the original (e.g. Volcano 36 vs 27, Dunes 30 vs 25)?
- Card game: what are the rules (how the 1–6 cards are played, betting, how the wizard decides), and who are the tavern NPCs he plays? Unused sprites: were the boss crowns for boss ranks, or something else (achievement tiers)? Which town ideas (shops, rumours, talking NPCs, interiors) are still worth keeping?
- Stats: should everything show on the stats scroll, or only some, with the rest hidden and used for achievements and quests? Per wizard, per world, or both? And what was `cardCombat()` meant to be?
- Levelling pace: keep the flat ~16 kills per level the game has always had, or move toward the spreadsheet's 16 × level (much slower late game)? Or something in between? And should gold go back to 0.25 per HP?
- Wizards from the past: how do they help: a one-off appearance, a recurring ally, a boost that scales with their level? Only at story moments or at random?
- Travel favor: what earns it (a faith threshold, a chapter, an achievement), and can the wizard lose it (e.g. while in sin or atheist)?
- Story: ~~keep the old arc or revise it?~~ Revised, see [docs/STORY.md](docs/STORY.md). Still open: should the late chapters' rules (no altars, no revive, refusing help) follow the faith rebalance?
- Professions: keep the old trio (Alchemy, Enchanting, Writing) and the 15 recipes, or rethink them? What should each item actually do (e.g. teleportation scroll ↔ map rework, divine binding ↔ faith)? Does the wizard pick one himself (free will) or does the player choose? One at a time or several, with their own levels? What do they produce: gold, faith, items, spell boosts? Do they tie into the faith rebalance or atheism?
- Faith rebalance: what feels off today: too little faith, touches too expensive, too easy or too hard to fall into atheism? And should atheism stay a one-way fate, or could the wizard drift back and forth?
- Map revamp: which places are known from the start for story reasons, and how are the others discovered (visiting, rumours, scrolls, the travel favour)? Which areas get an inner map first? Which ways should the character be able to move? (walking between neighbouring zones, teleporting, being pushed by events or bosses, choosing a destination...) And should the map itself look or behave differently, or only how the location changes?
- Should the dev console (`exe()`, unlocked by clicking name → level → faith icon) stay in v2 as a secret, or move behind a debug flag?

---

## Journal

### 2026-11-12: Story reviewed for plot holes, then rewritten
- Recapped the arc and listed its weak spots (why Midas didn't kill him, who planted the staff, death rules, V and IX repeating, the seer vanishing, the Tower at 139, the self-crowning). The author answered each one; [docs/STORY.md](docs/STORY.md) rewritten with the decisions table.
- New lore from the author: a hyperpolytheist world; the prophecy names **the Omni, god of gods**; the dead hunger for his soul but only a crown can feed them, and a crown that bends his road is cursed (so Midas exiled him and was cursed anyway); deaths in play are falls; a rare true death leaves the soul in purgatory; if the god wins he unmakes the soul and rewinds time (echo games, reversed struck-through names in the cemetery); if the wizard wins he engulfs the universe and the save becomes a black museum, blocked forever.
- Coordinated with the planner: [docs/ERASURE.md](docs/ERASURE.md) (souls of erased wizards in the final battle, one by one, shown in the museum; echoes only after an erasure) and a request for a sprite of the wizard lying injured.

### 2026-11-12: The story is scripted
- Wrote [docs/STORY.md](docs/STORY.md) on branch `plan/story`: the text of every chapter scroll (Prologue to XI, both epilogues) and the console lines between them. 38–77 words each, so every scroll fits the screen without scrolling (it holds about 110–140).
- The author decided, one question at a time: the scroll speaks to you, the god; the arc is free to revise; hooks are a secret behind the exile, a recurring stranger and a cliffhanger last line; the secret is a prophecy; the stranger is your mask; two endings by who dies; short scrolls plus console beats; one staff that changes; the prophecy is revealed in pieces, complete at VII; in X he finds out who watched the lynching; the god fears the prophecy.
- Choices made while writing, open to change: the lynching's sorceress is the seer who wrote the prophecy; the reforged staff is *Nomaleatorio*; Midas thought he was the god of the prophecy.

### 2026-11-12: Stage 2 started, the endless animations

- Measured first (10 and 30 virtual minutes, counting animation callbacks, images, sounds and console writes). The only big cost was the spell animations: up to 999 animation callbacks per second, growing with play time. Images, sounds and the console are small.
- Spell animations now stop after their last frame; images are cached and a late-loading image can't overwrite a newer one.
- 30-minute game: 72,329 → 3,730 animation callbacks, peak 646/s → 50/s. Wizard sprite verified pixel-identical; gameplay suite zero errors.

### 2026-11-11: Stage 1 step 8, tidy-ups; stage 1 done

- 223 single-line concatenations became template strings (only where it can't change the text); `spell()` keeps its own animation counters instead of taking four constant arguments; `drawWizard()`, `clearNPC()` and `studyPhase()` replace repeated snippets. Stats page and all 8 layout cases verified identical.
- Player-facing typos fixed (health points, Currently, spent, enough, gaming, gamble, a hydra, polypoid...). Internal names that live in saves or file names (`sucessStudy`, `polipoide`) left as they are.
- Found a v1 performance bug: spell animations never stop and keep redrawing forever. First item of stage 2 in the roadmap.
- **Stage 1 is done.** Next: stage 2 (modern and faster).

### 2026-11-11: Stage 1 step 7, layout

- `layoutPortrait()` 225 → 88 lines and `layoutLandscapeMobile()` 127 → 51: one `setStyles(id, {...})` call per element (numbers become px), grouped by area, with the shared sizes named once.
- Verified by snapshotting every element's inline style in 8 cases (desktop and phone, normal, first visit, scroll open) for the old and new code: identical, property by property.

### 2026-11-11: Stage 1 step 6, long functions split

- `battle()` 189 → 15 lines (announce, enemy falls, defeat, rewards, wizard falls, self-revive, plus `updateLongestCombo()` / `clearFight()` that were copied in two places).
- `attackEV()` 95 → 12 lines (polymorph, critic, normal attack, enemy attack; helpers for divine spells, damage and hops).
- `updateStats()` 123 lines → one helper per section with loops for zones, containers and schools; checked to produce the exact same HTML as before from a rich test save.
- `rollDicesForSixfivefour()` 115 → 15 lines (roll, message, bank a die, show, skip; `diceImg()` for the repeated icon HTML). A dice-only test played ~80 games without errors.
- Pace against v1 checked again: same spread of levels and the same ratios of attacks, critics and heals.

### 2026-11-11: Stage 1 step 5, comments

- One short comment above each of the 95 functions; stale comments replaced (old storage API, "possible bug" note in studyEV, which was checked and is fine).
- The author's Spanish story plans in `src/story.js` translated line by line, plus the few other Spanish comments.
- Found a v1 bug in the chapter keys (`lvl60`/`lvl90` twice, `lvl99`, `lv200`); left as is to keep gameplay identical, recorded in the roadmap for stage 3.

### 2026-11-11: Stage 1 step 4, dead code removed

- 117 lines of commented-out v1 code removed (old versions of live lines, debug `console.log`s, leftovers of the old storage API, unused layout lines). Every idea hidden in them was moved to the backlog first ("Ideas found in the v1 code comments").
- Kept: the story plans in `src/story.js`, TODO notes that mark where a feature will hook in, the empty "guardians after level 190" branch.
- Restored the disabled dev console block and the author's signature line, lost by the phase 3 module split (the splitter dropped the text attached to the old export list).

### 2026-11-11: New route, simpler changelog

- CHANGELOG rewritten as plain bullet points per version (the narrative version was not what the author wanted).
- Roadmap now follows the author's route: 1 clean up the code, 2 modern and faster, 3 the story, 4 new features.

### 2026-11-11: 2.0.0 is live

- `dev` fast-forwarded into `main`, tagged `v2.0.0`, deployed by GitHub Actions. Checked live: new modules load, version 2.0.0, new service worker served, `/legacy/` still serves v1, old notes not published.
- The author confirmed bulb won't be used again; its leftover worktree folders are deleted.

### 2026-11-10: Playtest passed; one notebook, one keeper

- The author played 2.0.0 locally: the wizard comes back after a reload, the pages look right, the offline service worker is activated and running.
- The bulb role is retired at the author's request: everything on `bulb/ideas` was already in `dev`; the branch is deleted locally and on GitHub. dev keeps this notebook, backlog included.
- The old notes (`docs/old_ideas/`, ~15,000 files) and `tools/` moved out of the repo into the sibling folder `wizardidle-old-ideas/`; `.gitignore` no longer needs to list them.

### 2026-11-10: Backlog after 2.0.0 (bulb)

- Synced phase 4. Placeholder achievements: noted the `planned:true` flag (design them, then remove the flag). Struck the legacy-link idea (the author decided against it) and the typo fixes (done in 2.0.0). No quotes in the backlog used the old spellings.

### 2026-11-10: Phase 4 done, 2.0.0 ready for the playtest

- Fixed: the level-210 crash (`knownTier()` keeps the 21 tiers; stress runs from level 205 reached 224–270 with zero errors), the author's own "acá hay un BUG" (wizard and enemy falling in the same round; the event picker also kept running while the wizard was dead), "another Boss" text, the easter egg check, `statObj.random()`, 14 kinds of typos ("shire" was meant to be "shrine").
- Corrected an earlier roadmap entry: "bosses read the previous enemy" wasn't a real bug; hardened the one theoretical spot.
- 13 unfinished achievements marked `planned:true`: hidden, not counted, so completion can reach 100%.
- Offline mode (`service-worker.js`): stores ~6 MB of code, art and sound; network first for code, stored first for media; per-release cache. Fixed `manifest.json`, whose paths opened `/wizardidle/wizardidle/index.html` when installed.
- Version 2.0.0. No legacy link in the game; removed the public legacy link from the README.
- Testing gap: headless Edge can't complete a service worker install here (its fetches never resolve), so offline mode needs a manual check in a real browser before going live.

### 2026-11-10: Old ideas and tools kept local (bulb)

- The author decided `docs/old_ideas/` (sources, extracted layers) and `tools/` stay local only. dev untracked them and added `.gitignore`. Marked the publishing question resolved and noted "local only" where the backlog points at them. The paths are unchanged.

### 2026-11-10: Anchors updated for phase 3 (bulb)

- Phase 3 split `src/game.js` into 15 modules. Pointed the backlog's code references at their new files (`src/combat.js`, `src/story.js`, `src/divine.js`, `src/ui/render.js`, `src/ui/scrolls.js`). Function names didn't change.
- Added dev's question about `docs/old_ideas/` and `tools/` being published with the site.

### 2026-11-10: Phase 3 done, the tower has rooms

- 3a: ~45 shared variables moved into `fight` / `run` / `ui` (`src/runtime.js`) with a scope-aware rename (711 references; locals with the same name untouched).
- 3b: `src/loop.js`, one 50 ms tick with named clocks (`master`, `event`, `animPJ`, `animNPC`, `stats`). Fixes v1's leaked master clocks (several places restarted it without stopping it); kill stops everything. Pace checked against v1 over four 30-minute runs: average level 6.5 (v1) vs 6.75 (v2), same encounter and kill counts.
- 3c: `game.js` (3,700 lines) split into 15 modules by a script from a name-to-module map, imports/exports computed. Constants (`masterTime`, `RAREMULTIPLIER`...) moved to `config.js`; `JUMPSPACE` became `ui.jumpSpace`.
- Tests: play, persistence across a full browser restart (new test: quit the browser, reopen the same profile), kill with foreign keys, v1 vs v2 stress with identical settings (v2 197-232, v1 208). Only the known level-210 bug.
- Note for the merge into `main`: bulb's extracted art layers (`docs/old_ideas/`, ~900 files) and `tools/` would be published with the site; decide before 2.0.0 whether the deploy should skip them.

### 2026-11-10: Layers extracted; map fog, inner maps, pixel UI (bulb)

- Wrote `tools/pdn_extract.py` (standard library only) and extracted all 51 .pdn files into `docs/old_ideas/layers/` (901 PNGs, with layer names, visibility and opacity). 26 of 34 scene files rebuild a game background pixel for pixel.
- Dynamic scenes: added the author's direction (keep the hand-crafted nature; special scenes identical to the legacy ones).
- Map revamp: added map fog with story-known places, and inner or local maps.
- New idea: pixel-art tiles for the XP bar and the rest of the HTML-drawn UI.

### 2026-11-10: Idea: dynamic scenes (bulb)

- Added "Dynamic scenes". Read the 32 background .pdn files: 256×64 scenes with 5–42 layers each (base + deco + props, some named). Proposed composing scenes from layers plus time, weather, animation, memory and story changes. Also found layered map files (`mapa.pdn`, `guias.pdn`) for the map rework, and a merchant sprite (`Monsters/comerciante.pdn`).

### 2026-11-10: Cards confirmed (bulb)

- The author confirmed the 1–6 playing cards were for a card game against tavern NPCs, which explains the empty `cardCombat()`. Updated the sprites entry. The open question is now about the rules.

### 2026-11-10: Unused sprites matched to ideas (bulb)

- Compared `docs/old_ideas/unorganzed_sprites/` with `img/`: 51 images aren't in the game. Matched them to ideas: rings and mushrooms (professions), playing cards (`cardCombat()`), town and shop sheets (shops, rumours, NPCs), interior tiles, boss crowns, a missing level-100 achievement icon.
- Wrote the placeholder achievements' intended meanings next to that entry, decoded from their icon names.

### 2026-11-10: Idea: track almost everything (bulb)

- Added "Track almost everything as stats": listed the 56 counters the game keeps today, proposed records, totals and firsts on top of counters, and a catalogue of candidates by area. Noted the dice game is untracked and `cardCombat()` is an empty stub.

### 2026-11-10: Old spreadsheets checked (bulb)

- `infodexp.xlsx`: the XP model. The curve, HP, age and enemy HP match the code. Two differences went to the backlog: the planned kills per level (16 × level vs. today's flat 16) and gold per HP (0.25 vs. 0.15). Its creature list became a new-enemies idea.
- `InformationByEnemy.xlsx` and `enemyLocation.xlsx`: already in the game (669/669 sprites identical; zones match apart from two later edits). Recorded under "Already built".

### 2026-11-10: Phase 2 done, the wizard has one memory

- All ~150 encoded localStorage entries became one `state` object (`src/state.js`) saved as plain JSON every 2 seconds and when the tab hides or closes. `getLocal`/`setLocal`/`idx`/`check` and `storage.js` are gone; 578 lines were converted from a key map that refused unknown keys.
- Balance moved to `src/config.js`. Achievements, counters, hydra heads and the two sacred wizards' names are plain fields now.
- Found while converting: the old `thx`/`hx` encoding corrupted any name with a space (a space is one base-36 digit, the decoder reads two), and emoji/CJK broke it too. JSON fixes it.
- Behavior kept: the level-up achievements compared the level as text (`case "2"`), converted to numbers so lvl 2/140/200 still fire. The Capricor extinction check moved from the zone data into game start.
- Kill is now safe for other games on the domain; the cemetery is structured data (name, level, age, born, died), shown with v1's exact wording. **Idea from the author:** build on the cemetery later, e.g. wizards from the past helping in the story (for bulb's backlog).
- Two v1 plans found switched off and kept as flags: `inSin` (lose faith after killing) and `travelFavor` (map travel).
- Tests: normal play, save/reload persistence, kill with foreign keys present, and v1 vs v2 stress runs. Zero errors below level 210. **At level 210+ both v1 and v2 crash in `attackEV`**: spell tiers run out (21 tiers, one per 10 levels). Logged for phase 4.

### 2026-11-10: From dev: unfinished flags and the cemetery (bulb)

- dev found two v1 features coded but never switched on: "in sin" (`inPecado` → `state.player.inSin`) and "travel favor" (`state.travelFavor`). Added to the story and map entries.
- New idea via dev: wizards from the cemetery help in the story.

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
