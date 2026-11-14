# Ideas & development journal

The working notebook for Wizard Idle v2: where the project stands, what was decided and why, and ideas waiting their turn. Read this first before starting a session; update it before ending one.

- What changed in each release → [CHANGELOG.md](CHANGELOG.md) (short bullet points)
- The route ahead (cleanup, speed, story, features) and the fixed v1 bugs → [docs/ROADMAP.md](docs/ROADMAP.md)
- The author's old notes, spreadsheets and art sources (2014–2018) live **outside the repo**, in the sibling folder `wizardidle-old-ideas/` on the author's machine; the layer extraction script is in its `tools/`. Paths below like `wizardidle-old-ideas/layers/` refer to it.

---

## Where we are

- **Branch:** `dev` (v2 work). `main` is the live site, so merge only when playable.
- **Released:** 2.1.0 live since 2026-11-12 (stages 1 and 2: cleanup and speed). **Now:** stage 3a; the dev test bar, the stats module and the playtest tools are built, with a baseline. **Next:** the faith stats and playtests ([FAITH.md](docs/FAITH.md)); then the story with the faith rebalance.
- **Live:** [camayal.info/wizardidle](https://camayal.info/wizardidle/) serves 2.1.0 from `main`; `/legacy/` serves the frozen `v1.0.0` tag (not linked anywhere).

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
| 2026-11-11 | Professions: one trade per wizard, a second at chapter III; the wizard asks the god for guidance (the god chooses only with faith above 0) | The old help's "one of three", with the god as guide rather than master. All 11 decisions in [docs/PROFESSIONS.md](docs/PROFESSIONS.md) |
| 2026-11-12 | Stats: one `src/stats.js` (counters, totals, records, firsts; per wizard and per world); all counters renamed, no save migration in the dev phase; playtest tools in the repo, 10 seeds to lvl 200 per setting | Professions and faith need numbers, and no balance number is set without a playtest. Details in [docs/STATS.md](docs/STATS.md) |
| 2026-11-12 | Faith: four belief levels, both ways until chapter X; the god's revive stays free and gives faith; other rescuers instead of the self-revive; offerings and all numbers decided only by playtests | The author's choices; details in [docs/FAITH.md](docs/FAITH.md) |
| 2026-11-12 | Route after 2.1.0: stats and playtest tools, then the story with the faith rebalance, then professions, then the rest | The story depends on faith and professions; no balance number without a playtest |
| 2026-11-12 | After an erasure, the souls of erased wizards fight beside the next wizard in the final battle (one per erasure, max 5; wizard → souls → god); no faith change | The god's wins bring his own end closer; details in [docs/ERASURE.md](docs/ERASURE.md) |
| 2026-11-12 | The .md docs (journal, roadmap, changelog, plans) stay published on the site | The repository is public anyway |
| 2026-11-12 | Sprites stay as separate image files; only animations are sheets (like the spell strips), for now | Editing art in sheets would slow down every art change; measured: sheets would only speed up the first download and updates (679 sprites: ~4 s as files vs ~0.2 s as sheets), not play |
| 2026-11-12 | A dev test bar replaces the old dev console: scenarios, quick actions and a command line, on while developing (`DEV` in config.js), switched off by the deploy | The author wants to test specific criteria quickly; players never load it |

## Ideas backlog

Things to try after 2.0.0 (or sooner if they fit). Add freely; nothing here is a commitment.

New ideas are added as `- **Short name** (YYYY-MM-DD): what it is, and why it would be fun or useful.` Once dev takes one on, it's marked *→ picked up by dev* and links to where it went.

- Finish the 13 placeholder achievements (`logro_jugon`, `logro_ricachon`, `logro_muchapradera`...): give them titles, descriptions and real triggers. *Since 2.0.0* they're marked `planned:true` in `src/data/achievements.js`: hidden, and not counted towards completion. So finishing one means designing it and removing the flag. Every one already has its icon. The names hint at the plan: *jugón* (gambler), *dados cargados* (loaded dice) and *full carga* (full cargo) are dice; *inventario lleno* (full inventory) needs an inventory (professions); *dormiletas* (sleepyhead) is camping or inn; *corazón grande* (big heart), *ricachón* (rich), *fanático*, *estudioso* (studious), *eso sí es iluminación* (now that's enlightenment), *flawless*, *mucha pradera* / *mucho poblado* (lots of meadow / village), *primer boss* (first boss). Most need the stats from "Track almost everything as stats".
- ~~Link to the legacy version from inside the game (help or stats scroll).~~ *Dropped 2026-11-10:* the author decided there's no link to `/legacy/` from the game or the README.
- A real offline mode (new service worker) so it plays like an app again.
- ~~Fix the typos in player-facing text.~~ *Done by dev in phase 4 (2.0.0):* fourteen kinds of typos fixed ("the Grute" → "the Grotto", "shire" → "shrine", "restauration" → "restoration", …). See CHANGELOG.md.
- **Map revamp: many ways to move, fog, inner maps** (2026-11-10; the scenes plan **[docs/SCENES.md](docs/SCENES.md)** covers the map of places, exits, three tiers with one map each, and fixed places like inn doors): the map should work differently, and the character's location should be able to change in several ways, not just one. Also from the author:
  - **Map fog:** places the wizard doesn't know stay hidden and are revealed as he discovers them. Some places start out known because they're part of the story (e.g. the City where he was exiled, the Tower of King Midas).
  - **Inner or local maps:** maps of a single area (inside the City, the Tower, a cave or mine) in addition to the world map.
  - *Art to start from* (`wizardidle-old-ideas/layers/`): `mapa` has **one layer per zone** (Pradera, Bosque, Desierto, Pantano, Gruta, Tundra, Volcán, Duenon…), which suits revealing the map zone by zone under the fog. `mapa_conaltares` marks the altars; `guias` / `guias y otros mapas` have circles, dots and numbers (the place markers); `mapas numeros actuliazados julio 2018` is a 487×768 numbered map. Fog and discovery tie into stats ("unique places visited").
  - *Today:* the map is mostly a display: the marker sits at the current zone's fixed spot, and zone changes pick a random destination from the place graph (`places` in `src/data/zones.js`: each place has `x`, `y`, `moves` within the zone and `destinations` to other zones). Tapping the map to teleport was planned ("travelFavor") and is described in the help, but **never built**: nothing sets `travelFavor` and the map has no tap handler (map code at the `//Put the bocadillo in the right place in the map` comment in `src/ui/scrolls.js`). Old notes: `wizardidle-old-ideas/localidades…txt` (the original place graph) and `correspondencia de colores.txt`, a colour per place, which looks like the colour-coded hit map the original app used to know which place was tapped. Useful if tap-to-travel gets built. *Travel favor* (from dev, phase 2): kept as `state.travelFavor` in `src/state.js`, default false. The help scroll already shows "Touch the map…" / "Touching it can…" when it's on, and a v1 comment says `love god give setLocal("travelFavor",1)`, so the idea was that the god *grants* travel as a favour when the wizard loves him. There's no travel code behind it yet.
- **Rebalance faith and player interaction** (2026-11-10; **plan → [docs/FAITH.md](docs/FAITH.md)**, decisions recorded there, numbers wait for playtests): rebalance faith points and how the player (the god) interacts with the wizard, while **keeping the atheist ending possible**. *Today:* faith comes from praying, shrine offerings (gold to faith) and wiping out corrupted enemies. It's lost by skipping shrines, self-reviving, and every divine touch (heal, hit enemy). Below 0 faith the player can't help at all, which is the road to atheism ("The player" help text and the divine-touch faith costs, `//determine faith cost`, in `src/ui/scrolls.js` and `src/divine.js`).
- **Professions for the wizard** (2026-11-10, *asked to be built: ready for dev*; **plan written 2026-11-11 → [docs/PROFESSIONS.md](docs/PROFESSIONS.md)**: reagents, the 15 items and their effects, vendors and trainers, build order): give the wizard professions. *From the old notes* (`wizardidle-old-ideas/Help.txt`, `Recetas.csv`): three professions, **Alchemy, Enchanting and Writing**. Each zone has its own material to gather: mushroom (hongo), bone (hueso), gem (gema), ectoplasm, essence, herb. Recipes take two materials and have a price (50 or 100) and a difficulty:
  - *Writing → scrolls:* reduction, teleportation, understanding, maximisation, divine binding.
  - *Enchanting → rings:* health, magic power, natural integration, luck, greatness.
  - *Alchemy → potions:* health, mana, vitality, alcohol, golden potion.

  *Today:* half-prepared. Zones already name their material (`drop:` in `src/data/zones.js`) and there's a "scavenger skills" stat (`pFindMaterials`, raised by the Dwarf statue), but gathering is only a `//found materials` ToDo in `src/combat.js`, and there's no inventory, crafting or use for the items. The old help also had "Commerce" and "Gathering" pages that the current help lacks. *Art already drawn* (`wizardidle-old-ideas/unorganzed_sprites/Sprites/`): `anilos.png` is **five gem rings** (pink, blue, green, orange, brown), one per ring recipe. `BASE/dg_food32.gif` has mushrooms in a dozen colours (the *hongo* material), plus drinks, bread and meat.

- **Finish the story: chapters III–XI and the final battle** (from old notes, 2018): *Today:* only the Prologue, Chapter I and Chapter II (Devotion: faith multiplier, Divine crosier) do anything. Chapters III–VIII (lvl 50–149) exist as titles with TODO comments describing the plan (`var chapter` object in `src/story.js`). Chapters IX–XI and the ending aren't there at all. The planned arc (`wizardidle-old-ideas/historiaperlevel.txt`):
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
- **Track almost everything as stats** (2026-11-10; **plan → [docs/STATS.md](docs/STATS.md)**, with the playtest tools): keep a stat for nearly everything that happens, so later achievements, missions, quests and new areas have numbers to hang on ("kill 50 corrupted enemies", "reach 0 faith three times", "visit every place in the Swamp"). *Today:* 56 counters via `count()` into `state.counters`, several split by key (`zone_*`, `enemy_*`, `typeBoss_*`, `school_*`, `altar_zone_*`, `BotinGot_*`, `Polymorph_*`, `study_*`…), plus `meta.playTimeMs`. Gaps found: they're **all counters**. There are no records (highest / lowest), no "firsts" (when something first happened), and nothing across wizards. The **dice game tracks nothing at all**.

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
- **Dynamic scenes: as alive as possible** (2026-11-10, *a big idea*; **plan → [docs/SCENES.md](docs/SCENES.md)**, decided 2026-11-13: a finite world of about 100 composed scenes per run from about 300 curated variants, three tiers, visible exits): make the scenes change as much as possible instead of being fixed pictures. *Today:* every place is one flat 256×64 PNG set as the canvas's CSS background (`loadBackground()` in `src/ui/render.js`; a canvas-drawing version sits commented out right below it). The same place always looks the same, and nothing moves except the wizard, the NPC and the spells.

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
- **Death management: a wizard can really die** (2026-11-12): when nobody rescues the fallen wizard, there's a **small chance the game ends and that wizard dies for good**. In the author's words: *"no rescuing, the wizard can have small chances of ending the game and that wizard will die."* It becomes **part of the story**: *"the story repeats again: for you, god, time is nothing; for the world it is everything."* Then the game **returns to the main screen** (the name screen) for a new wizard.
  - *Today:* a fallen wizard always comes back: the god's touch revives him, otherwise he gets up alone after 2 minutes (`scheduleSelfRevive()` in `src/combat.js`). The faith plan replaces that self-revive with rescuers (pagan caravan, shaman, gravedigger, ghost of a fallen wizard; [docs/FAITH.md](docs/FAITH.md), 3.2). **True death would be the rare case where no rescuer comes.**
  - *Already there to build on:* `realKill()` (`src/ui/menu.js`, the kill button) records the wizard in the cemetery (`world.cemetery`, which outlives every wizard), stops every clock, deletes the save and reloads to the name screen. A true death can reuse it, plus a farewell text and a cause of death in the cemetery record ("fell in the Swamp to a pybrya and nobody came").
  - *Story:* a short death chapter shown before the reload, with the author's line about time. The next wizard's opening could echo it ("another wizard is exiled…"), and the fallen one can come back as a ghost rescuer or a legend ("Wizards from the past help in the story").
  - *Ties to:* the faith plan (rescuers, belief levels, the free revive), the story's final battle (whose death is already meant to be final), stats (deaths, true deaths, the cause, kept per world), and achievements.
  - **Rule (the author, 2026-11-12):** a true death is possible **only while the god can click to revive him**. Wherever the story takes that click away (the corrupt staff in VI, the Last Escape scroll at X, the reforged staff *{staffName}* after it burns in XI), **the story protects him**: no true death from chapter X until the final battle. See [docs/FAITH.md](docs/FAITH.md), 3.7.
  - *Open questions:* how small the chance is, and what changes it: belief level (does an atheist risk more, since he waits for no god?), level, zone, a boss kill, how long he has lain dead. Is the god warned (a last chance to touch him, a fading heart)? Can it happen before a certain level, or never in the first hours? Does the next wizard inherit anything (gold, a relic, a letter)? Playtests should measure how often it happens.

- **A fallen wizard sprite instead of the skull** (2026-11-12, asked by the author with the story plan): in the story a fall in battle is now **badly injured, almost dead**, and only a rare true death is final (see "Death management" above and the rescuers in [docs/FAITH.md](docs/FAITH.md)). *Today* the fallen wizard is drawn as a skull (`img/muerto.png`, 32×32, through `loadAlterCanvasChar("muerto")` in `src/combat.js` and `src/ui/layout.js`), which no longer fits. **The skull stays for a true death.**
  - *Searched for a ready-made sprite* (2026-11-12): **none exists.** Checked `img/`, `wizardidle-old-ideas/layers/` (layer names of all 51 .pdn files: the only wizard layer, `lvl0: Background` in `mapa` and `pradera y bosque`, is the standing sprite placed for scale), `unorganzed_sprites/Sprites/` (`LVLs/`, `BASE/`, `imgBkp2/`, `dg_people32.gif`: everyone stands) and the full D.E. Gervais set in `unorganzed_sprites/Sprites/Tiles Gervais/` (3,571 files: AngbandTk sheets, DO Items / Monsters / Terrain / XR module, Silmar).
  - *Parts that could help:* lying human skeletons and dark flattened corpse shapes in `Tiles Gervais/AngbandTk/dg_misc32.gif` (rows 6–8; Angband's "dead monster" tiles), `DO XR module/XR module/HB_BatCorpse.PNG` (32×32, a creature lying flat: the right pose, the wrong subject), `DO Items/Items/SkeletonHumanMedium.PNG`, blood pools `DO Terrain/Terrain/L1_Blood001–007.PNG` and `L2_PoolBlood.PNG` (54×54, would need scaling to 32), robes `DO Items/Items/RobeBlue/Green/Purple/Red.PNG`, and the sleeping bag `img/sleepingbag.png` (a lying shape in the game's own style). The wizard tiers are `img/lvl0.png`…`lvl200.png` (21 images, 32×32, a robed figure with a staff, recoloured per 10 levels).
  - *Options:*
    1. **Rotate the existing tier sprites** (recommended to start): turn each `lvlN.png` 90° so he lies on his side at the bottom of the 32×32 square, staff fallen beside him, optionally over a small blood pool. Lossless for pixel art, can be done by a script for all 21 tiers, keeps each tier's colours. Looks stiff, but it's ready in an hour and clearly "him".
    2. **Draw a collapsed or kneeling pose** by hand in Paint.NET, like the other sprites: one base drawing, recoloured per tier (21 images) or one generic image. The most expressive; the most work.
    3. **One generic fallen image** (robe and staff on the ground, no face), not per tier. Cheapest drawing, loses the tier look.
  - *Size and frames:* 32×32 PNG, drawn like the tier sprites (`ui.charWidth` × `ui.charHeight` at `ui.squareSide`); a lying figure fits in the bottom 12–14 rows so he rests on the ground line. One frame is enough; two frames (a 1-pixel rise, "still breathing") would work on the existing `animPJ` clock if wanted. Name them `fallen0.png`…`fallen200.png` (or `fallen.png` if generic); the two `loadAlterCanvasChar("muerto")` calls switch to the fallen image, and `muerto.png` is used only when the death is final.
  - **Decided (2026-11-12):** option 2, **a collapsed pose drawn per tier** (not the rotation); dev is prototyping it, and an "artist" session may do the final art.
  - **Poses chosen (2026-11-12, by the author)** from five hand-drawn sketches (crawling, sitting, one knee, on all fours, on his back); a first kneeling version was rejected:
    - **Fallen (regular fall, a death he can be revived from): sitting slumped, his staff leaning on his shoulder, head down** → `img/fallen0.png … fallen200.png`.
    - **Permadeath (true death): flat on his back, staff on the ground** → `img/dead0.png … dead200.png`. *For the planner:* the author decided this sprite is the true death (see "Death management" and the rescuers in [docs/FAITH.md](docs/FAITH.md)).
    - **The skull stays, as an "attention needed" sign** (the author): the fallen wizard is drawn with the new sprite, and the skull (`img/muerto.png`) **appears above the wizard** to tell the player something is wrong, no longer as his body. **Decided (2026-11-13):** the skull shows above the fallen wizard **only while the god can still act**: from the fall until he is revived by a touch or picked up by a rescuer, then it disappears. **Never over a true death** (nothing is left to do; the true-death scroll speaks instead). Recorded in [docs/FAITH.md](docs/FAITH.md), 3.2.
    - Each tier keeps its own robe, skin, hair, staff and crown (140, 200). Drawn by the artist session on branch `artist/art`, waiting for dev to wire in. *Still open:* should the fallen sprite change with the rescuer (e.g. carried on the caravan) or stay the same?

- **After an erasure: the souls of erased wizards help the next one** (2026-11-12, asked by the author with the story plan; **plan → [docs/ERASURE.md](docs/ERASURE.md)**): when the god wins the final battle he erases the wizard (removed from existence, name reversed and struck through in the cemetery), a museum appears, and a new game is the god going back in time. Decided: in the next final battles **the souls of the erased wizards come to help**, one per erasure **up to 5**, **entering one by one** every few rounds (each named by his reversed name), shown in the museum's final-battle snapshot, in turn order **wizard → souls → god**; the souls act only in the final battle, but after at least one erasure the next game's text shows **small echoes** (a different Prologue opening: *"You have heard him before. You will hear him again. Time is nothing to you. To him, it is everything. Will this one win?"*, and a few déjà vu lines in the chapters); faith rules don't change. Saved per world (`world.erasures`, `world.loop`, next to the cemetery). Every win brings the god's own end closer, which is the prophecy. **Only wizards defeated by the god in the final battle are erased** (the author, 2026-11-12); wizards who die at any other moment are a regular part of the cemetery and have a different role (ghost rescuers, letters, legends: "Wizards from the past help in the story").

- **Story art: the hooded healer, his true form, the god's shrine** (2026-11-13, asked by the historian for the story script; drawn by the artist, chosen by the author; art in `wizardidle-old-ideas/tools/story_art/out/`, not in the game yet):
  - *The hooded healer (the god in disguise):* today's healer with a simple snug hood in his own cape greens, his face lost in the hood's shadow (only a hint of chin), like the plain hood of the hooded enemies. The hood is the allegory of the disguise.
  - *His true form when the hood and cape fall:* white and gold robes, glowing hair and eyes, halo, rays of light, standing on a pool of light with the green disguise folded at his feet.
  - *For the planner (the author's words): the final battle has phases.* He starts **with great wings of light (G2)**; as the battle goes on and he takes damage, **the wings are torn and singed and shed feathers (G3, the second phase)**; at the end **they are gone (G1, radiant, no wings)**. When each phase starts (by his HP, by rounds) is for the plan.
  - *The god's shrine (Chapter II):* humble, for a god only one believer hears: a small cross with ring ends (after a cross in the old Gervais tile sheet) on a little two-step statue base, one candle flickering (4 frames). It stands in whatever zone he is in.
  - *The shrine destroyed (Chapter X, per the historian):* the author chose **shattered**: cracks spread, the cross bursts into chunks around the base, a stub remains, the candle gutters out with a wisp of smoke. The broken state stays for later visits and the museum.
  - *The reveal (final battle):* his hood and cape go up in a huge **holy fire** (white-gold, sky-blue tips, sparkles) that covers him, dies into a blinding light, and his true form appears with golden rays; then his wings spread. When the wings burn out, **a few charred remnants stay behind his shoulders** in the last phase. No cloth left on the floor.
  - *Medusa's artefacts (for the immunity):* a mirror shield and a gorgon's eye, in the style of the book and rune finds (sent to dev).
  - *The god's death:* from his last form (only the charred wing remnants), every pixel comes loose from the edge inward, drifting apart in his shape, then they vanish. He is never killed while he still has wings.
  - All of it was sent to dev with the author's approval (2026-11-13).

- **Scene spells: attacks that cover the whole scene** (2026-11-12, the author, via the artist session). Boss fights are special, so some boss attacks play over the **whole scene**, not just on the wizard: spikes erupting from the ground toward him, rains, lightning, a blizzard, a pillar of fire. They are drawn as independent full-scene animations (the size of a zone background) whose ground effects are translucent, so a spike bursts out of a bit of that zone's own soil. Drafted by the artist (art in `wizardidle-old-ideas/tools/scene_spells/`, not in the game yet):
  - *Used by bosses:* earth spikes (protromus), ice spikes and blizzard (rainbow), fire rain (rojo), arcane rain (doria, king skeleton), lightning (arcangel), entangling vines (herbus), flame pillar (fenix).
  - *Added after the author's boss review (round 2):* sonic boom and rune circle (doria), poison cloud (kkck), golden touch, rainbow orbs and golden rays (king midas), spore storm (herbus), slime spit (cuboq), curse (king skeleton), fire tornado and fire breath (fenix), petrifying gaze and poison dart (medusa), golden storm (arcangel), prism pulse and colour burst (etymos), fire fist and fire peak (rojo); the earthquake now follows protromus's ground punch. 34 scene spells in all.
  - *Kept for later, not used by anyone yet:* meteor shower, divine light, eclipse, sandstorm, whirlwind, healing rain.
  - *For the planner (the author, round 3):* **king midas's golden rays heal him** (the rays spinning around him are a self-heal, not an attack).
  - *For the planner (the author, round 3):* **medusa's gaze turns the wizard to stone for a couple of turns.** It needs to be rare, or, better (the author prefers it), the wizard can **find an artefact that makes him immune** to it. Art drawn for every tier (not in the game yet): the wizard turning to stone, a stone wizard held while he is petrified, and the stone cracking and bursting off him (`wizardidle-old-ideas/tools/anim/stone/`).
  - Infraespectro's curse and arcane flare are scene spells too (a new "arcane flare": a blinding burst that races over the scene).
  - *For the planner (the author's words): the scene must shake.* The earthquake (and big hits like slams and the meteor shower) needs **the whole scene to shake** for a moment, which art alone can't do: the game moves the scene canvas a pixel or two each frame (suggested for the earthquake: 0, 1, −1, 2, −2, 2, −2, 1, −1, 2, −2, 1, −1, 1, 0, 0 px).
  - **Boss effects decided (2026-11-13, [docs/SCENE_SPELLS.md](docs/SCENE_SPELLS.md)):** Medusa's gaze petrifies rarely (about 1 in 4 gazes, 2 turns) and after the first time he can find a **rare** artefact for permanent immunity; Midas's golden rays heal him about 15%, at most twice per fight, and the god's touch interrupts them; a few signature effects (blizzard: skip an attack; poison cloud: damage over 2 turns; earthquake: miss a spell), the rest looks only.
  - **Plan → [docs/SCENE_SPELLS.md](docs/SCENE_SPELLS.md)** (decided 2026-11-13): the wizard earns them with the staff (90, VI, XI); a critic can become a **super-critic** that casts a scene spell (very rare before 90, rare with a staff); the god's touch-critics play divine light, meteor shower or healing rain; eclipse, sandstorm/whirlwind and divine light go to story moments, and the earthquake (now protromus's) is reused at the Tower siege.
  - *For the planner (the author's words):* add notes for **our wizard to use scene spells when he is very powerful**, and use the spare ones **for the story and for other powers**. Open: at what level or chapter he earns them, which god actions or story moments trigger the "kept for later" ones (an eclipse at a dark chapter, divine light for a miracle, an earthquake, healing rain from the god…), and whether they cost faith.

- **Soft sleep, dreams and nightmares** (2026-11-12, the author; **plan → [docs/SLEEP.md](docs/SLEEP.md)**, decided 2026-11-13: he walks to the bed or sleeping bag, the scene fades to dark; dreams are rare visions over the dark plus story nights; pure story for now): resting today plays a sleep effect over the wizard and prints a few lines (`searchInn` in `src/events.js`: arrive, sleep, wake up, at an inn or camping). The author wants something soft: the scene goes dark for a couple of seconds, then he wakes. Sleep is also the natural place for the story's **dreams and nightmares**. Leave sleeping untouched until it's planned.
  - *To decide:* how the darkness looks and how long; what a dream or nightmare is (console text, a short scroll, a vision over the dark scene); when they come (chance, level, chapter, belief level, after a fall, near the final battle); what they do (pure story, hints, a rest bonus, faith changes, ties to the erasure echoes and souls); whether nightmares belong to atheism and dreams to faith. The artist can help with the visuals once it's decided.

- **Discoveries in the scene** (2026-11-12, the author; **for the planner** about ingredients): a small blink appears at a random reachable spot in the scene; the wizard walks to it and discovers what is there: a rune or a book today, and later the professions' **ingredients** (gathering, `docs/PROFESSIONS.md`). The study or find effect plays at its current size right above the found item. Statues: he walks to the statue to study it. Shrines: no walk; the prayer effect appears around the big cross. Dev builds the runes, books, statues and shrines part; ingredients come with professions.

- **Bosses return, except Midas** (2026-11-13, the author): zone bosses keep coming back as today (1.5% of fights in their zone, `setUpBoss()` in `src/combat.js`, no memory of past defeats). **The only boss removed forever is King Midas**, because his death is part of the story: once he dies at the Tower in **chapter VII**, he never appears again. *For dev, when the story is built:* save it (e.g. `state.story.midasDead`), and from then on a boss roll in the Tower starts a normal fight instead (the Tower has no boss left, the same kind of guard as the level-190 freeze fix); his golden-ray heal only exists before VII.
  - **The Tower refills** (the author, 2026-11-13): from chapter VII until the lynching (lvl 149) there are **no mages in the City or the Tower** (the wizards and sorceresses go into exile); **after the lynching the Tower is populated by mages again**. *For dev:* the enemy lists of `la_Ciudad` and `la_Torre` drop `el_Hechicero` / `la_Hechicera` in that window (the Tower keeps its elementals), then the Tower gets its mages back.
  - **The staff's true name is random** (the author, 2026-11-13): "Nomaleatorio" in the 2018 notes was a slip. The name is generated in the world's first game and kept for every later wizard and loop (`world.staffName`, next to `world.erasures` / `world.loop`); text uses `{staffName}`.

- **New races and statues, art ready** (2026-11-13, the author: *"keep them in mind for future developments"*): sprites in `wizardidle-old-ideas/unorganzed_sprites/Sprites/New NPC/` (83 files; only `Hydra/hydskon*` and `Hydra/mother*` are in the game already). All 32×32 unless noted. Grouped by where they could live (suggestions, nothing decided):
  - *Nagas* (`nagas/`): naga, naga warrior, mage, ritualist, sharpshooter, guardian naga, greater naga, guardian serpent, plus **lamia** (64×64, boss-sized). Natural for a **coast zone** (see `statue_costa` below), the Swamp or the Dunes. Matches "naga" and "serpent" in the old creature list.
  - *Salamanders* (`Salamander/`): salamander, firebrand, mystic, stormcaller → the **Volcano**. Matches "salamander" in the old list.
  - *Yaktaurs* (`Yaktur/`): yaktaur and captain, each ranged and melee → the **Tundra** or the Prairie (the old list's "centaur" role).
  - *Swamp and poison:* black mamba, giant frog, zombie toad, **death ooze** (the Swamp's scene already has a `death_ooze` layer), sea snake (coast).
  - *Mushrooms:* deathcap, wandering mushroom → the **Forest**; they fit the mushroom reagent (professions).
  - *Chaos:* chaos spawn (5 variants), cigotuvis monster → **Duenon** or the corruption chapters.
  - *Training dummy* → a professions trainer, or a training spot in the City.
  - *Hydras* (`Hydra/`): **simulacrum1–5** (64×64, an ice-crystal hydra growing in 5 steps like `hydskon`) could be new art for the Tundra's **icedra** or a new hydra; **lernaean_hydra01–10** (32×48, 10 steps like `mother`) is a smaller version of the Swamp's mother hydra.
  - *Statues* (`Statues mistery/`): `archivo/` holds **the 14 existing statues as standalone sprites** (one per zone: Snail, Knight, Queen…), useful now that the wizard walks to the statue to study it (today they are painted into the `*_estatua` backgrounds). New ones for the future: **statue_costa** (a spear-bearer, for a coast zone that doesn't exist yet), a **golden statue** (Midas, the golden touch, or the Tower after chapter VII), a **light-vine** and a **dark-vine** statue (a pair: faith and corruption, or belief levels), and an empty **pedestal** (`statue_base`: a broken or stolen statue, a story moment).
  - *Before using them:* the file names match the free Dungeon Crawl tile set; check each tile's licence and credit it like the Gervais art. **Vashnia** and **Aizul** (`nagas/vashnia.png`, `nagas/aizul_new.png`) are named characters of that game: use the sprites under names of our own.

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
- Story: keep the old arc as written (sacred staff → corruption → killing Midas → lynching → disobedience → war on the god), or revise it? Should the late chapters' rules (no altars, no revive, refusing help) follow the faith rebalance?
- ~~Professions: keep the old trio (Alchemy, Enchanting, Writing) and the 15 recipes, or rethink them? What should each item actually do (e.g. teleportation scroll ↔ map rework, divine binding ↔ faith)? Does the wizard pick one himself (free will) or does the player choose? One at a time or several, with their own levels? What do they produce: gold, faith, items, spell boosts? Do they tie into the faith rebalance or atheism?~~ **Decided 2026-11-11:** see "Decisions" in [docs/PROFESSIONS.md](docs/PROFESSIONS.md); a few smaller questions remain there.
- Faith rebalance: what feels off today: too little faith, touches too expensive, too easy or too hard to fall into atheism? And should atheism stay a one-way fate, or could the wizard drift back and forth?
- Map revamp: which places are known from the start for story reasons, and how are the others discovered (visiting, rumours, scrolls, the travel favour)? Which areas get an inner map first? Which ways should the character be able to move? (walking between neighbouring zones, teleporting, being pushed by events or bosses, choosing a destination...) And should the map itself look or behave differently, or only how the location changes?
- ~~Should the dev console (`exe()`, unlocked by clicking name → level → faith icon) stay in v2 as a secret, or move behind a debug flag?~~ **Decided 2026-11-12:** behind a flag: the dev test bar (`src/dev/tests.js`), on while developing, switched off by the deploy.

---

## Journal

### 2026-11-13: Sounds: the first seven chosen by ear (musician)
- The author tried the candidate sounds against the attack animations and approved seven: the heavy thud, the deep rumble, the arrow whoosh, the hooves (a second file replaced the first choice), the rolling rumble, the beast roar (for Bicaptop only: small creatures get their own snarl, new row 6b) and the slime bounce. Files, cuts, volume and the moment each starts are in `docs/SOUNDS.md` (Decisions); those seven are crossed out of "Sounds to find". Still to find: small creature snarl, wind, stone, bite; the reuse table is still to confirm by ear. The files are not in `ogg/` yet and nothing is wired.

### 2026-11-13: Medusa's poison shot, more visible
- The author's note, redrawn by the artist (approved by the author): `scene_poison_dart.png` is now a slim dark stinger with a green venom drop, outlined, with a venom streak, drips and a splash on the wizard; 15 frames (was 14), set in `sceneSpells`.

### 2026-11-13: Belief: the way back from atheism, and a fix
- The author's way back (FAITH.md 3.1 Decisions): a Doubter or Atheist passing a shrine +0.5; a close call (a fight won below 10% HP with no help from the god) +1; getting up alone -10 only as a Believer or Devout, -1 as a Doubter or Atheist; the god's super-critic is 1 in 10 of his critics at x16.
- Fix: the stored belief level started empty and followed the value, so level changes were never recorded (no margin, no announcement, no time per level). He now starts as a Believer.
- Time spent at each level is counted (`belief.time.<level>`, ms of play), and `tools/playtest.py` writes a Belief table (end value and level, when he first turned Doubter / Atheist, times back to Believer, hours per level).
- Playtest `docs/playtests/2026-11-13-belief-way-back`: an idle wizard is a Doubter from level 1-2, never an Atheist, and yo-yos back to Believer 32-48 times (Doubter ~37 h, Believer ~6 h of ~43 h); his faith stays positive. An active god's wizard is Devout within the first hour and pinned at +100.

### 2026-11-13: Belief built; rest without beds
- **Belief** (docs/FAITH.md 3.1, the author's decision detailed by the planner) is in the game: `src/belief.js`, numbers in `config.belief`. Faith stays the currency; belief (-100 to +100, start +20) moves only by moments (saved from the killing blow +8, heal below 20% HP +5, the god's final blow +5, critic +3, normal touch +0.5, revive +2, shrine +1, skipped shrine -1, getting up alone -10). Levels with a 10-point margin on the way up: Devout (touches -25%, shrines +15%), Believer, Doubter (touches x2, shrines -15%), Atheist (refuses heal and hit touches, never enters shrines, no penalty for skipping). The god's touch may now kill. Stats page shows the level and value. Not yet: super-critic chance (off), Atheists getting up faster, rescuers and potions, the heading icon.
- Playtest `docs/playtests/2026-11-13-belief`: the active god plays as before; an idle god's wizard turns Atheist after about 9 falls alone (before level 25), never enters a shrine again and his faith ends deeply negative (-1.5M). For the author and the planner: intended road to atheism, or -10 too strong?
- **Rest** (the author, through the artist: no beds or sleeping pose needed): at an inn he walks slowly to the middle and the scene goes dark; camping, he walks a few steps, the sleeping bag appears in front of him (no more bag at the enemy's place on arrival) and it goes dark; when the scene comes back he stands in his place, with no walk back. The stand-in bed spots are gone.
- Tests: browser runs of the touches and of both rests; gameplay suite 0 errors.

### 2026-11-13: Story art merged; the hooded healer in the cabin
- The artist's story art (approved by the author) is on dev: the hooded healer (`healer_hooded`), the final battle (`anim_god_unhood` 29 frames, `anim_god_wings_open` 8, `anim_god_wings_burn` 15, `anim_god_death` 26 at 64 x 56, stills `god_form_G1/G2/G3/G3b/G1_remnants` at 48 x 40, drawn at the healer's box - 8 sprite px, about 110 ms a frame) and the god's shrine (`god_shrine` 4-frame candle loop, `anim_shrine_break` 13 frames, `god_shrine_broken`). Frame counts checked against the artist's notes.
- Wired now: the healer in the cabin after a divine revive is the hooded healer (the god in disguise). The rest waits for the story stage (docs/STORY.md): the stranger moments in II, V, VIII, IX, the shrine in chapter II and its breaking in chapter X, the final battle phases (when each starts is for the planner).

### 2026-11-13: Enemies arrive their own way
- The author's playtest notes ("flying enemies arrive from the air, floating ones float in, those that hide jump into the scene, underground creatures come out of the ground"), done with code on the plain sprites as the author asked, no new art: `src/ui/entrances.js`. Six ways by family: **fly** (angelicus, demon, dragus; arcangel, fenix) glides down from the upper right with wingbeats and lands; **float** (spectre, ether, eye, elemental, infraespectro) drifts in, fading in and bobbing; **rise** (slime, polypoid, ent, umigubi, mummy, skeleton, the hydras) pushes up out of the ground line with dust; **jump** (rogues, imp, creatures, shortie, elf, amazon) leaps in on an arc and lands squashed with dust; **blink** (wizards, wizardesses, vampire) flickers in, opening from a line; everyone else **walks** in from the right with steps. Bosses and new hydra encounters too (a growing head keeps its own animation).
- The game waits while it arrives (about 0.9 s); it waits for the sprite to load first, so a first-time sprite isn't skipped. Nothing plays in a simulation or in the background.
- Dev bar: "Fight now: arrives ..." for each of the six.
- No art asked for now; real run or flight strips from the artist could replace the math later for some families.
- Tests: real-browser frames of all six; gameplay suite 0 errors.

### 2026-11-13: He stops at the door before going in
- The author (playtest notes, then "doors outside too"): before entering an inn or a dice house in the Town or the City, he walks to the street that shows its door (if he isn't on it), walks to the door, stops a moment (0.4 s), then the fade takes him inside. The doors were already in the street art: the Town's open doorways (stages 4 and 5), the City's saloon doors by the beer poster (stage 4) and the door by the dice sign (stage 1). `STREET_DOORS` in render.js; no art needed. Simulations and the page in the background go straight in, as before.
- Tests: real-browser trace of the Town inn (street, doorway, stop, inside, sleep, out); gameplay suite 0 errors.

### 2026-11-13: Belief levels: two meters (decision)
- From the author's playtest notes, the author chose **two meters**: faith stays the currency the god spends; belief becomes its own bounded meter moved by moments (a critical heal or the final blow a lot, normal touches a little, leaving him to revive alone a lot down), the four levels read from it, and the story can lock it at "lost" (a symbol, not -inf). Recorded in docs/FAITH.md Decisions; the planner details weights, bounds and what counts as critical before it is built.

### 2026-11-13: Sleep and dreams (docs/SLEEP.md), first version
- The planner's sleep plan, asked for by the author: when he rests he walks to his bed or to the sleeping bag, the sleep spell plays, the scene fades to dark (about 2 s), and when tonight has a dream its 1-3 lines appear softly over the dark one after the other (pale for dreams, reddish for nightmares) and stay in the console; then it fades back and he wakes as before (camping: he walks back from the bag).
- Dreams: a story dream on the first rest after a fall or a chapter (`run.storyDream`); otherwise `config.balance.dreamChance` (0.15, to decide: "how rare" is open) of a random dream or nightmare, nightmares more likely when faith is not positive (until belief levels exist). Pure story: picked with the looks' random, only when drawn, no effect on play; simulations unchanged. Stats: `sleep.inn`, `sleep.camping`, `dream.story`, `dream.random`, `nightmare.random`.
- STAND-INS until the art and the story script: the inns have no beds, so he goes to the Town inn's door to the rooms, a free spot in the City inn, the Desert inn's carpet; he doesn't lie down (no sleeping pose yet); the dream lines in `src/data/dreams.js` are placeholders for the story script. Asks for the artist: beds in the inn backgrounds (or a bed sprite), the wizard lying in bed / in the sleeping bag, optional faint dream images.
- Dev bar: "Sleep: Town inn, with a dream" and "Sleep: camping, with a dream".
- Tests: real-browser capture of the camping scene (walk, dark, the fall dream over the dark, wake, walk back); gameplay suite 0 errors; seeded simulation runs fine.

### 2026-11-13: Into a shrine on foot
- The author: entering a shrine should be a walk, like a change of scene, not a fade. Every place without a door (shrines, statues, inns outside the towns) now works that way: he walks out to the right, the place appears, he walks in from the left (`enterPlace`). Places with a door keep the fade and the door; waking up in the healer's cabin keeps its plain fade (`fade = true`). When he is already in the place (back to the same shrine), only who is there changes, with no walk.
- Tests: real-browser trace of the shrine scenario (out, into the shrine with the mystic, the offering, out again); gameplay suite 0 errors.

### 2026-11-13: Sounds for the new attacks: what to reuse, what to find
- The author asked which sounds can be reused for the new attacks and which to find: `docs/SOUNDS.md`. Today every attack plays only its spell's school sound when the blow lands, so long animations are silent until the end. Twelve existing files can cover most moves and scene spells (by name and length; the author confirms by ear); ten are to find (thud, rumble, bow, hooves, roll, roar, squelch, wind, stone, bite). Nothing wired yet: waiting for the author's choice.

### 2026-11-13: Hydras: their wounds stay, a word on the heads
- The author: a hydra doesn't heal from one battle to the next, only when a new head grows. When the wizard falls against a hydra, the share of its HP left is kept (`state.hydraHealth`); the next encounter with that hydra starts with that share of its new HP ("The hydra still bears the wounds of their last battle"). A growing head brings its HP back in full, and killing it forgets the wound. The share (not the HP) is kept so a wound from many levels ago still means something.
- The author: short info on the heads. When a head grows: "Each head cut off grows back with more life: 3 of 5 heads", or at the last head "the next one cut off is for good". The bestiary's Secrets section explains it in one line once a hydra has been met.
- Gameplay change from the author's own rule (no new number). Tests: a real-browser run (wounded at 36%, back at 36% next fight, full again after a head grew).

### 2026-11-13: The revive in order: rings, fade, cabin
- Bug (the author): the divine rings of a revive played over the wizard already standing and the fade started at once. Now the rings play over him where he fell (the game frozen for 0.65 s), then the fade, then he is in the healer's cabin, and the cabin's event starts after the fade. In a simulation or in the background it goes straight to the cabin, as before.
- Tests: a real-browser capture over 3 s (rings over the fallen pose, the dark, the cabin, "wakes up perplexed").

### 2026-11-13: Author's playtest notes: stray lines and flicker
- Bug (the author): two lines of pixels by the fallen wizard, left and bottom. Each spell effect drew one step past its last frame to "leave the canvas clear"; 6 sheets have spare cells, and many have pixels in their 1-px gutters, so a sliver (or a whole spare cell) could stay on the spell canvas. The last step now only clears, and each frame is copied out at 1:1 before scaling, so no neighbour cell or gutter is sampled.
- Bug (the author): flicker when animations change. The wizard, his poses and the enemy wiped their canvas before the new image was ready, so an image not yet cached left a blank frame. They now clear only when the image is ready (and a late image for an enemy that is gone is not drawn). Animation strips (wizard, walk, hydras, bosses, enemy moves) also use the 1:1 copy (`drawFrame` in render.js).
- Tests: the gameplay suite, 0 errors (it caught a first try that used the copy canvas before it existed); a real-browser close-up of the fallen pose, clean. Visual only: simulations unchanged.

### 2026-11-13: Medusa's artefacts in the game
- The artist's two artefacts (approved by the author) are the rare find against Medusa's gaze: a mirror shield or a gorgon's-eye amulet (which one is for the looks), drawn where the find twinkle was, the size of a book, and named in the text ("finds a gorgon's-eye amulet!", "takes the ... and continues").

### 2026-11-13: Boss effects built
- The planner's "Boss effects" (docs/SCENE_SPELLS.md) are in the game (`src/bossEffects.js`, numbers in `config.balance` to tune): Medusa's gaze turns him to stone for 2 turns, 1 in 4 gazes (she hits freely; he breaks free after); after his first stone, 1 find in 20 is the mirror shield that makes him immune for good (art asked from the artist); King Midas's golden rays heal him 15% of his max HP at most twice per fight, and the god's touch while they spin stops the heal; the blizzard (Rainbow) makes him skip his next attack half of the time, the earthquake (Protromus) makes his next spell miss half of the time, the poison cloud (Kkck) hurts him 4% of his max HP for 2 turns.
- The boss's attack now follows from the spell the game picks (its place in the zone's list), so the effects are part of the game and the simulations play them; the looks play that same attack. The stone ends when the game says (no more 2.5 s timer).
- Playtest `docs/playtests/2026-11-13-boss-effects` vs the baseline: pace barely changes (idle ~41 h, active ~16 h to level 200), since bosses are rare (1.5% of fights). With bosses at 50% in test runs every effect fires; the artefact came after 1-3 stones each time.

### 2026-11-13: Dev bar: real fights instead of drawn previews
- Bug (the author): the boss, hydra and enemy previews drew the creature on top of whatever fight was running. They are now **"Fight now"** actions: the current event ends (every clock stops, the fight and the scene are cleared, the wizard is back in his place at full HP) and a real fight starts with the game's own code (forced event and chances, like the scenarios, but without a reload): 5 bosses, the 3 hydras, and one enemy for each attack move. The two hydra growth previews reset the scene first.

### 2026-11-13: Hydra attacks and weaving heads
- Merged the artist's hydra art (approved by the author) and wired it: while a hydra is on screen its heads weave (idle strip for its head count); it attacks with a strike (the front heads bite) or, half of the time when its spell has one, a cast with a scene spell from frame 5: the Swamp mother's poison rain, poison cloud or earth spikes, the Dunes hydra's curse, fire rain or fire tornado, the ice hydra's new frost breath, blizzard or ice spikes. A new head still grows in with its animation, then the weaving goes on at the new size. The strike or cast is picked for the looks only (never the game's random).

### 2026-11-13: Hydra attacks and moving heads (artist)

- The author asked for hydra attacks (some ordinary, some scene spells) and heads that move. Tried three head motions (sway, bob, weave); **the author chose weave**: each head traces a small circle, out of step, bending from where its neck meets the body.
- For every head stage of the three hydras: idle (weave), strike (the heads lunge in turn and bite: venom for mother, dark sparks for hydskon, frost shards for icedra) and cast (heads rear up glowing, then thrust into a scene spell). Scene spells match each hydra's spells: mother poison rain, poison cloud, earth spikes; hydskon curse, fire rain, fire tornado; icedra a new frost breath, blizzard, ice spikes.
- Added to the review page (`wizardidle-old-ideas/tools/boss_review/index.html`, "Hydras" section). The author approved them all and they were sent to dev.

### 2026-11-13: Scene transitions (option B) and a scene director
- The author found scene changes unreliable (shrines, for example). Review: 12 scene changes behaved differently (some walked, most snapped), walks ran on their own clock while events kept going every 1.5 s (zone changes jumped, the next event could start mid-walk), and nothing kept transitions from overlapping.
- Chosen: **B, walk for travel, fade for places**. Every scene change goes through one place in `ui/render.js`: he walks out right and in from the left when he goes somewhere (the plain walk to the next spot, leaving a shrine, a find or a statue, changing zone); a quick fade brings a place around him (shrine, inn, dice house, the healer's cabin, a statue's scene); places with a door (both dice houses, the Town and City inns) have him come in and go out through it (a door table of scene x positions).
- While a transition plays the game's clocks wait (`loop.freezeGame`/`thawGame`), so events never overlap it. In a simulation nothing is drawn and everything happens at once in the same order: seeded runs unchanged.
- Fixed on the way: backgrounds no longer flash the page behind while the new image loads (the old one stays until the new has loaded; a fade holds the dark until the place is ready, 5 s at most); an animation no longer wipes the wizard before its first frame is ready (he went blank while praying until the strip arrived); his strips and poses for the tier are preloaded.
- The author's plan for later: more dynamic scenes (walking with background layers scrolling right to left). That needs layered art per zone; the director is where it would replace the walk out and in.

### 2026-11-13: Walking through scene changes; capricor in the bestiary
- The author found the walk back after a find cut off by the scene change. Now, when he leaves a find or a statue, he walks on out of the scene to the right, the scene changes to another spot of the zone, and he walks in from the left to his place; changing zone works the same way (walks out, the new zone appears, walks in). Walking is faster (16 sprite px a frame). The new spot is for the looks only: a simulation keeps its stage, so seeded runs are unchanged.
- Bug (the author): a defeated capricor didn't show in the bestiary. The last capricor's death takes it off the Forest's enemy list, and the bestiary built its families from those lists; it now takes them as they are when the game loads.
- Stress-test levels looked low; a side-by-side 30-minute run of the code before today (level 88, 18 fights) and now (level 72, 19 fights) shows the same pace: earlier higher levels came from runs cut off by the real-time limit, measured differently.

### 2026-11-13: Planner items

- Belief, after the first playtest (an idle wizard was an Atheist for good before level 25): a way back decided (passing shrines +0.5, close calls +1, getting up alone −1 once a Doubter or Atheist); the god's super-critic is 1 in 10 of his critics at ×16. Sleep plan: no beds.
- Belief meter detailed (FAITH.md 3.1, the author's choices): −100 to +100, start +20, levels at +60 / 0 / −60 with a 10-point margin; critical moments and starting weights; the god's touch may now kill (the final blow).
- Scenes plan: the street doors (`STREET_DOORS`) are the first fixed door landmarks; enemy entrance paths stay free of props.
- Scenes plan written (`docs/SCENES.md`) from the author's decisions: scenes composed from his layers, a finite seeded world (about 100 of 300 variants), three tiers joined by stairs and cave mouths, visible exits with a god nudge, light and weather from game time. Checked the art: every layer file already splits `Fondo` (base) and `Piso` (floor). Decided too: one map per tier (a new Heidan map), rare scenes marked quietly, engine first then art.
- Recorded the author's new races and statues (`New NPC/` in the old sprites): nagas, salamanders, yaktaurs, swamp creatures, mushrooms, chaos spawn, two hydras, the existing statues as sprites and five new statues; licence check noted.
- From the author's story review: the Tower refills with mages after the lynching (none in the City or Tower from VII to 149); the staff's true name is random (`world.staffName`), replacing "Nomaleatorio" in FAITH.md and SCENE_SPELLS.md.
- Bosses keep returning as today, except King Midas: removed forever after he dies in chapter VII (noted for dev with the Tower guard). Medusa's immunity artefact is rare.
- Boss effects decided: Medusa's stone rare plus an immunity artefact; Midas heals about 15% at most twice, interruptible by the god; blizzard, poison cloud and earthquake get one effect each (SCENE_SPELLS.md).
- Professions: gathering plays as a discovery in the scene (blink, walk, the reagent appears; bountiful harvest is a touch on it).
- Skull alert decided: it floats above the fallen wizard only while the god can still act, never over a true death (FAITH.md 3.2).
- Scene spells plan written (`docs/SCENE_SPELLS.md`): staff unlocks, super-critic, god's critics, story moments.
- Sleep plan written (`docs/SLEEP.md`): walk to the bed or sleeping bag, fade to dark; dreams are rare visions over the dark plus story nights; pure story for now.

### 2026-11-13: Boss attacks, scene spells, Medusa's stone
- Merged the artist's boss art (approved by the author): 16 bosses with 2-3 attacks each, 35 scene spells (256x64 frames over the whole scene), the petrify set for every tier. `src/data/bossAttacks.js` holds the attacks (frames, scene spell and its start frame, travel paths, Medusa's petrify frame); `src/ui/bossAttacks.js` plays them: the boss strip at its usual box (goro and bicaptop charge, kkck rolls, the king skeleton's great slash travels), the scene spell on a new layer above everyone, the earthquake shakes the scene, Medusa's gaze turns the wizard to stone (2.5 s for now, then he breaks free; the stone can't cast or walk; a fall ends it). The attack is picked at random for the looks (never the game's random). Hydras keep the hop.
- Open for the planner: how long the stone lasts and whether it costs turns; whether scene spells should have game effects.

### 2026-11-13: The level-190 freeze fixed; new baseline
- Above level 190 the guardian chance (10% of fights, guardians never written in v1) did nothing and the game stopped until a reload. Until the story adds guardians, it starts a normal fight. The dev bar scenario now checks that.
- New baseline in `docs/playtests/2026-11-13-baseline` (no freezes): idle god ~43 h to level 200, active ~16 h, much as before. Negative gold appears again in active runs (as low as -1,041): still to look into with the faith stats.

### 2026-11-13: Discoveries in the scene: blink, walk, find
- The author's idea, built: before a book or rune is found, a small twinkle appears at a random spot on the ground; the wizard walks there (walk animation) and the find lies there; the study effects play at their usual size right above it; afterwards he walks back to his place before the next event. Statues: he walks to the statue (a table of where each zone's statue stands) and the effects play over it. Shrines: no walk; the prayer sparkle appears here and there around the cross.
- The wizard can now leave his place (`ui.wizardOffset`); every drawing of him follows it. The random spot uses its own randomness (never the game's `Math.random`), so seeded simulations play exactly the same.
- Stress tests: the slow runs were the known freeze above level 190 (the empty guardian branch), caught by a new stall detector in the test page; not related to this change.

### 2026-11-12: Boss review, round 3; the wizard turned to stone (artist)

- Infraespectro's curse and arcane flare became scene spells; kkck now curls into a dung ball, rolls to the wizard, hits, jumps back and lands in its own shape; king skeleton runs in with the sword raised and swings it down into the slash.
- Drew the wizard turning to stone, staying stone, and breaking free, for all 21 tiers; medusa's gaze uses it in the review page. Noted for the planner: midas's golden rays heal him; medusa's gaze petrifies the wizard for a couple of turns (rare, or better, an artefact for immunity). Nothing sent to dev.

### 2026-11-12: Boss review, round 2 (artist)

- Applied the author's notes on every boss: 18 more boss attacks became scene spells (see "Scene spells" in the backlog); goro's four arms flail; goro and bicaptop run across the scene to ram the wizard; kkck rolls to him like a dung ball; king skeleton runs up for the great slash; cuboq bounces three times; protromus punches the ground into an earthquake; rojo's slam raises a fiery stone peak under the wizard; the last ice spike explodes; meteors, earthquake and whirlwind are stronger.
- The review page (`wizardidle-old-ideas/tools/boss_review/index.html`) is updated for the next round of comments. Noted for the planner: the scene must shake. Nothing sent to dev.

### 2026-11-12: Chargers get running frames (artist)

- For the charge across the scene: a 4-frame run cycle and a head-down ram frame for capricor and the four cowrens (`img/run_<sprite>.png`, `img/ram_<sprite>.png`), approved by the author and sent to dev. The outline change for bosses and hydras was dropped: the author likes them as they are.

### 2026-11-12: Boss attacks, scene spells, review page (artist)

- Drafted 2–3 unique attacks for each of the 16 bosses, themed on the spells each really casts (bossSpell in the zones). The ones that cover the whole scene now trigger **scene spells**: 8 used by bosses plus 8 kept for the story and other powers (see "Scene spells" in the backlog; noted for the planner, who wasn't running).
- A local review page shows every boss attack in its own zone and every scene spell over any zone, with a comment box each: `wizardidle-old-ideas/tools/boss_review/index.html`. Waiting for the author's comments; nothing in the game yet.
- The author asked that nothing be sent to dev without their approval from now on.

### 2026-11-12: The charge crosses the scene
- One stress run (of about fifteen today) stalled after the level 10 chapter; four reruns reached level 200+. Recorded in the roadmap's bugs as a likely chapter/scroll race, to investigate. The author asked to leave the outline question as is for now; boss comments go in the boss review.
- The author agreed: the horned chargers (capricor, cowrens) now paw the ground, dash across the scene to the wizard with a dust trail, hit (impact burst, shake, the spell effect), recoil and trot back (about 2 s). The artist was asked for running frames (`img/run_<sprite>.png`, 32x32 frames facing left); the code uses them automatically when they exist (mirrored for the trot back) and the standing sprite until then.

### 2026-11-12: Enemy moves matched to their weapons
- The author asked for each family's move to match the attack its sprites make; the artist drew the four missing overlays (arrow, thrust, smash, impact) with frame lists. New moves: **shoot** (elves: draw, release, the arrow flies 16 px a frame to the wizard), **thrust** (warriors, dares: spears), **smash** (ogres, dwarves, herbos, cornovits: heavy overhead weapons, then dust), **charge** (capricor, cowrens: horns, impact burst). Slash for the other sword users, pounce for beasts, slam for heavy bodies. Each family uses its most common attack; per-sprite moves could come later.

### 2026-11-12: Hydras grow their heads
- The artist's head-growth strips (approved by the author) play when a hydra grows its next head: the Dunes hydra's neck grows with a shimmer, the ice hydra's head forms in an ice block that shatters, the Swamp mother's neck rises from a green splash. 90 ms per frame, at the hydra's size and place (loadNPC's size rules are now `npcBox()`, shared by both).

### 2026-11-12: Enemy attack moves; the wizard's spark by school
- Asked by the author via the artist: normal enemies no longer hop. Their plain sprite moves by code (`src/ui/enemyMoves.js`, from the artist's reference): **slash** (weapon users), **pounce** (beasts), **slam** (heavy bodies), or **cast** with the spark of their spell's school for casters (from the sprite's type); a reusable overlay (spark, slash, bite, dust) plays in front, and when the blow lands the game's spell effect plays on the wizard. Bosses and hydras keep the hop until they get their own animations. Polymorphed enemies (sheep, chicken) pounce.
- Move per family, decided by dev from the sprites (to review with the author): pounce for creatures, capricor, imps and pybryas; slam for ents, umigubis, golems, mummies and rock men; slash for the other 28 melee families.
- The wizard's cast now shows what he casts: the spark of the spell's school at the staff tip on the glint frames (found from each tier's art), a mirrored weapon slash for staff hits, the plain glint for heals and other non-attacks.

### 2026-11-12: Hydras in the bestiary; a no-cache local server
- Bestiary: a hydra shows as it is now (its picture grows with each head cut off), or after it was defeated, as the most heads it ever had (new record `hydra.maxHeads.<hydra>`). Pictures keep their proportions (the swamp hydra is taller than wide).
- The author couldn't test some animations: most likely the browser reused old code files, because `python -m http.server` sends no cache rules. New `tools/serve.py` serves the game with `Cache-Control: no-store` (`python tools/serve.py`, then http://localhost:8000).

### 2026-11-12: Wizard animations, fallen and true-death poses; Volcano boss fixed
- Merged the artist's animation strips (21 tiers each) and wired them (`playWizardAnim()` in `ui/render.js`, on the animPJ clock; any normal redraw stops them): **cast** on every attack (the author's choice, replaces the hop), **walk** on the plain walk and when changing zone, **pray** at shrines (frames 3-5 loop until he leaves), **fall** when he falls in battle, then the **fallen** pose with the **skull above his head** (half size, the artist's spot) until he is revived, and the **true death** (fall_dead, then the dead pose) when the player kills him with the kill button, before the page reloads. The story's permadeath comes with the faith rebalance.
- The dev bar can preview each animation. The old hop and the skull-as-body drawing are gone.
- v1 bug found by the stress tests: the Volcano boss (`fenix`) had no entry in the enemy families, so a boss fight there crashed and the game stopped until a reload (the simulation counted it as a freeze). Added the entry.

### 2026-11-12: Bestiary secrets; stale code while testing
- Bestiary: the hydras are secret characters, so their section is "Secrets", shown from the start as ink stains labelled "Secret" until met. Only enemies are listed (never the healer). The total no longer counts two old sprite families that live in no zone (`la_guerrera`, `la_pilla`).
- The author still saw the scroll text run long on open, fixed after interacting: that is how the code behaved before the fix, so the browser most likely ran stale code. Real-time captures (driving Edge through its debugging protocol) at desktop, big-monitor and phone sizes show the right size after the opening animation. Two fixes against stale code: the offline worker now re-checks code files with the server every time (`cache: 'no-cache'`), so players also get new code right after a release; and while developing (`DEV`) no offline worker is installed (an old one is removed).

### 2026-11-12: Kill scroll: Kill / Cemetery / Bestiary
- The author asked for the kill scroll as tabbed scrolls, with a bestiary. The tab code is now shared: Stats / Records, and Kill / Cemetery / Bestiary (two strips stacked above the front scroll).
- **Cemetery** gets its own page; entries now say how many victories and falls the wizard had (for wizards killed from now on).
- **Bestiary** (layout A from three mockups): families he has met, every sprite with how many he defeated (★ = rare); never defeated as an **ink stain** (grainy dotted shape with a ragged rim, chosen from three silhouette mockups), drawn in the browser from the sprite itself. Bosses and hydras have their own sections; "X of 632 creatures discovered" on top.
- New stats for it: `kill.sprite.<sprite>`, `kill.boss.<boss>`, `kill.hydra.<hydra>` (start counting now).
- Then (the author): a creature shows as soon as he **sees** it, and the number counts defeats (0 until the first). New stats `seen.sprite.<sprite>`, `seen.boss.<boss>`, `seen.hydra.<hydra>`; the header reads "X of 632 creatures seen, Y defeated".

### 2026-11-12: Wizard animations (artist)

- The author asked for five animations: fall to sitting, fall to lying (permadeath), moving the staff (also for casting), dropping the staff to pray, and walking. Drafted on tier 0, the author asked for polish, then all tiers.
- Made all five for every tier as frame strips (32×32 frames side by side, for the 100 ms animation clock): `img/anim_cast<tier>.png` (7 frames), `anim_walk` (4, loop), `anim_fall_sit` (6, ends on `fallen<tier>`), `anim_fall_dead` (6, ends on `dead<tier>`), `anim_pray` (6; frames 3–5 can loop). Built from each tier's own sprite (staff, gripping hand, body), so the style matches.
- Known: tiers with the staff on the right end the sitting fall with the staff on the left (the approved sitting pose), so it jumps across on the last frames.
- Previews (local only): `wizardidle-old-ideas/tools/anim/out/` (GIFs for tier 0, a board per tier; review GIFs of every tier in `review/`) and the generator `anim.py`. Not wired into the game yet.
- Fixed after the author's review: in the pray loop only the head bows; the body no longer bobs.

### 2026-11-12: Crisp pixels; scroll text overflow fixed
- The author chose crisp pixels: images are enlarged as sharp squares instead of blurred (`image-rendering: pixelated` on images and the scene, `imageSmoothingEnabled = false` on the canvases). No image files changed. The dev bar has "Crisp pixels on / off" to compare.
- Bug (found by the author): on the stats scroll the text ran past the bottom roll over the scene. The layout redoes the scroll right after it opens (and on resize), which reset the front scroll's height until the next stats refresh. The layout now announces it (`wizardidle:layout`) and the tab refits at once.

### 2026-11-12: Stats scroll tabs built (option a)
- Merged `artist/art` (fallen and dead sprites, not wired yet; the shaded scroll art). Removed a worktree path from the artist's journal line.
- The stats scroll's other page now lies behind and peeks out above (the back roll and a strip of shaded paper with the page name, Pixeled, #462808); clicking it swaps Stats and Records. The front scroll, with the close button, moves down by the strip (0.092 of the scroll width) and gets shorter by the same, so the bottom roll stays put. Only on the stats scroll; the plain "Stats · Records" text line is gone.

### 2026-11-12: Sprite sheets measured, decided against for now
- The author asked whether to convert the ~1,000 images into sheets. Measured: 1,008 images, 2.25 MB (the 679 sprites of 32x32 are 262 KB; the 117 backgrounds are half the bytes). Sheets don't save space (one sheet of the 679 sprites is ~310 KB), they save requests: from the live site, 679 files took ~4 s (6-7 s with 6 connections) vs ~0.2 s for the same bytes in 5 files. That cost is paid at the first visit and after every release (the offline copy re-downloads everything); during play images come from the cache.
- With the game's smoothing on, sprites drawn from a sheet differ at the edges; with smoothing off they match exactly. Smoothing off also looks sharper (`wizardidle-old-ideas/tools/sheets-test/smooth_vs_crisp.png`).
- **Decided:** keep separate sprites, because editing art in sheets would be a bottleneck; only animations are sheets. Possible later: a script that packs sheets at deploy from the separate files (art stays editable), if downloads become a problem.

### 2026-11-12: Author's playtest of stage 3a
- Everything tested fine on localhost. Notes: the dev bar can now be hidden and shown from Help > Developer tools (only while developing; remembered per browser).
- Stats: the author likes Records, and wants real tabs: two scrolls, one behind the other, offset at the top or to the side so the back one shows. Asked the artist for mockups of both versions; dev builds it after the author picks.
- Simulation mode: the author isn't sure yet that it works as intended; to check together later.
- Next: the author's ideas about how sprites are drawn (opinion and tests first).

### 2026-11-12: Stats scroll: curated page and Records
- Built mockups of three options with a simulated level-120 wizard and three earlier ones (local preview in `wizardidle-old-ideas/tools/stats-preview/`). The author chose **A + B**.
- **Stats** (curated): Wizard, Battles, Magic, Travels, Gold, Faith, Achievements, about 35 lines; totals instead of long lists (enemies defeated with rare, bosses defeated of met, favourite school and zone, zones visited of 16, critical hit %, your touches in one line).
- **Records** (tab in the same scroll): this wizard's bests (longest streak, biggest hit, most faith at once, richest; the last three are new records), firsts, a chart of hours played per level, numbers across all wizards, and a Hall of wizards. Records now keep the wizard's name; cemetery entries keep kills and falls.
- v1 bug gone with the old page: "Magical attacks" showed NaN past 1,000 attacks (it subtracted numbers already formatted as "2.35k").

### 2026-11-12: Stats module, simulation mode, god bots, runner, baseline
- **Stats** (`src/stats.js`): counters, totals, records and firsts, per wizard (`state.stats`) and per world (`world.stats`); all 55 old counters renamed to dotted names (no migration); one history line per level. Stats, achievements, help and kill pages byte-identical before and after.
- **Simulation mode** (`?sim=1`, `src/dev/sim.js`): the loop jumps to the next due clock on a virtual clock (`loop.now()`), `Math.random` is seeded, sound, spell animations, hops and drawing are skipped (the logic inside the drawing functions still runs), nothing is read from or written to the saves. The self-revive is now a loop clock instead of a `setTimeout`. A seed always plays the same run; a level-200 run takes about 2 real seconds.
- **God bots** (`src/dev/bots.js`): idle, active (revive at once, heal below 30%, tithe at shrines), or custom rules from the URL. `set=key:value` overrides config for a run; unknown keys are reported.
- **Runner** (`tools/playtest.py`, standard library only): serves the repo, runs headless Edge per setting and seed, writes `docs/playtests/<date>-<name>/summary.md` and `runs.csv`. `tools/` is kept off the live site.
- Found on the way: the enemy hop clock never stopped when no enemy was on screen (harmless for players, it flooded the simulation; now it stops). Headless browsers throttle chained `setTimeout`s, so the sim yields with a `MessageChannel`.
- **Baseline** ([docs/playtests/2026-11-12-baseline](docs/playtests/2026-11-12-baseline/summary.md)), 10 seeds each to level 200: idle god about 43 h of play (falls 570, all self-revived), active god about 16 h (falls 109). Faith ends in the millions with nothing to spend it on (the faith rebalance's starting point). The guardian freeze hits 4–18 times per run above level 190. One active run ended with negative gold (-148): something can spend more gold than he has; to look into with the faith stats.

### 2026-11-12: Faith and story agree on chapter X

- The author decided (with the story plan) the two conflicts between FAITH.md and STORY.md: no afterlife gods in the death mechanics; the Last Escape scroll stays, written by the wizard himself at X and burnt at Heidan in XI; after that the reforged staff raises him. Rule: a true death only while the god can click to revive; where the story removes the click, the story protects him. FAITH.md 3.7 and the death-management entry updated.

### 2026-11-12: Stats scroll tabs, art and mockups (artist)

- Asked by the author via dev: real tabs for the Stats / Records scroll, as two scrolls, one behind the other. Two options to test: (a) the back scroll peeks out above, (b) its edge shows at the side.
- Drew the back scroll's art: `img/scrollBackUpShade.png` and `img/scrollBackCenterShade.png` (the same paper in warm shadow), plus `img/scrollShadowV.png` / `scrollShadowH.png` (a hard 2 px shadow from the front scroll).
- Mockups at 400×760 with the game fonts, offsets and swap notes: `wizardidle-old-ideas/tools/scroll_tabs/` (local only: `out/mockups_board.png`, `NOTES.md`, `make_tabs.py`). **The author picked (a)**, with the close button on the front scroll; dev builds it for the next version.

### 2026-11-12: Fallen and dead wizard sprites drawn (artist)

- Dev handed over the fallen sprite. A first kneeling version (all 21 tiers) didn't meet the author's standard and was replaced.
- Drew five poses on tier 0 by hand; the author picked two: **sitting slumped** for a fall and **flat on his back** for permadeath. The skull stays as a sign that the wizard needs attention.
- Made both for all 21 tiers: `img/fallen0…200.png` and `img/dead0…200.png` (32×32), hand-drawn bodies recoloured per tier, with each tier's own staff (slanted, ornament upright), hair, skin and crown.
- Generator and previews are local only, in `wizardidle-old-ideas/tools/fallen/artist/` (`make_fallen2.py`, `poses/`, `sheet2.png`, `preview_B_E.png`). Next: dev wires them in; the planner designs when the skull shows. No planner session was running, so the two decisions are noted in the backlog entry.

### 2026-11-12: New session: artist

- The author started an **artist** session: it draws and edits pixel-art sprites, UI tiles and backgrounds in the game's existing style, and hands them to dev to wire into the game. It works on the `artist/art` branch (off `dev`); finished PNGs go in `img/` there and are merged into `dev` when the author says so. Working files (.pdn, drafts) stay outside the repo in `wizardidle-old-ideas/`.
- First job waiting for it: the final art of the fallen wizard (a collapsed pose per tier), see "A fallen wizard sprite instead of the skull".

### 2026-11-12: Erasure plan

- Wrote `docs/ERASURE.md` for the "god wins" ending (asked by the author with the story plan): each erasure leaves a soul that helps the next wizard in the final battle.
- The author decided: souls that act, one per erasure capped at 5, turn order wizard → souls → god, only in the final battle, no faith change. Open: a soul's strength, entrance, déjà vu lines, the museum.

### 2026-11-12: Fallen wizard sprite searched

- Searched every art source for a wizard lying injured, to replace the skull for a fall that isn't a death (asked by the author with the story plan). None exists; recorded the closest parts and three options (rotate the tier sprites, draw a collapsed pose, one generic image) in the backlog entry "A fallen wizard sprite instead of the skull".

### 2026-11-12: 2.1.0 released; the dev test bar
- 2.1.0 released after the author's playtest: `main` fast-forwarded, tag `v2.1.0`, live site checked (version 2.1.0, worker stamped with the commit, offline list published).
- The author asked for a way to test specific criteria, like the old dev console but with a list of scenarios, on while developing and off on the live site. Built `src/dev/tests.js`: a bar at the bottom of the screen with a dropdown (12 scenarios, 6 quick actions), a Run button, a "Check:" line saying what to look at, and a command line (`dev` gives the game objects).
- A scenario saves the wizard, reloads, prepares him (level, zone, HP, gold), forces the first event and changes config chances only until that event is picked. Small hooks in the game: `run.forceOnce` (events.js), `run.forceEnemy` (combat.js), a clock speed in loop.js (also used by the self-revive), and `setLevelValues()` split out of `levelUP()`. With `DEV` false nothing changes.
- `DEV` lives in `src/config.js`; the deploy rewrites it to false (and fails if it can't), so players never load the bar.
- Found while writing scenarios: above level 190, the empty guardian branch in `enemyEV()` freezes the game on about 2% of events (also in v1). Recorded in the roadmap's v1 bugs, with a scenario that shows it.
- Tests: every scenario run headless and checked (chapter, two levels at once, boss, fall, shrine, inn, dice, level 210, hydra, rare, corrupted, guardian freeze), overrides restored after each; the full gameplay suite with the bar on; layout and pixels identical to 2.1.0 with `DEV` false.

### 2026-11-12: Idea: death management

- Added "Death management: a wizard can really die" to the backlog, in the author's words: a small chance of true death when nobody rescues him, a story line about time ("for you, god, time is nothing; for the world it is everything"), then back to the name screen. Linked from the faith plan's rescuers.

### 2026-11-12: Stats and playtest tools plan

- Wrote `docs/STATS.md`: a stats module with four kinds of stat, per-level history, data-driven achievements; a `?sim=1` fast-forward mode with a fixed seed, god bots and a JSON report; a Python runner driving headless Edge (no Node on the machine).
- Found: no playtest scripts were kept from earlier phases; the self-revive is the last `setTimeout` outside the game loop; `Math.random` is called 13 times.
- The author decided: tools in the repo; curated stats scroll plus a records page; rename every counter, old saves don't matter in the dev phase; 10 seeds to level 200 per setting.

### 2026-11-12: Faith rebalance plan

- Wrote `docs/FAITH.md`: every faith gain and loss in one unit (g = `hpBase × rGold`), what's off, and a proposal.
- Found: the god's revive is free and works at any faith (the old help said the healer charges faith); offerings and the tithe are a share of the gold he holds, so faith grows with hoarded gold; 65% of shrine events are skips; the "Atheist!" achievement is a fixed −10,000 whatever the level.
- The author decided: four belief levels that change behaviour, drifting both ways until chapter X; the revive stays free and gives a little faith, also for atheists; rescuers replace the self-revive (pagan caravan, shaman, gravedigger, ghost of a fallen wizard); the god can win back an atheist (prayer in despair, sign, dream, pilgrim, hidden blessings, rare relics); the Last Escape scroll at chapter X burns in chapter XI; offerings and every number wait for playtests with idle and active god bots.

### 2026-11-12: Professions details

- Added starting numbers (≈10 reagents per level), god-touch prices tied to the tithe rate, the vendor scene and the holy recipes to `docs/PROFESSIONS.md`.
- The author decided: trainers appear by chance in cabins and huts (the god touches the trainer to accept, the door to leave; silence → the wizard decides); holy recipes only with a blessed craft; the Volcano gets a 7th reagent (proposed: brimstone for "infernal" items made while in sin).
- Next plan: the faith rebalance.

### 2026-11-12: 2.1.0 prepared

- Version set to 2.1.0; CHANGELOG "Unreleased" became the 2.1.0 entry, player-visible changes first. Stage 2 marked done in the roadmap.
- Waiting for: the author's playtest, and reviews from the planner and historian sessions.

### 2026-11-12: Stage 2, offline list at deploy; chapter race

- The deploy workflow now writes `precache.json` (every file except legacy and docs, 1,074 today) and stamps the worker with the commit, so each deploy gets a fresh cache without editing `service-worker.js` (22 KB → 3 KB). Checked with a simulated deploy; the live site picks it up on the next merge into `main`.
- Stress runs found a v1 race: a chapter opened while a scroll was open was read again after the scroll closed, by then possibly for the next level (crash). `openHistory()` now keeps the chapter it opened. Chapter-focused stress runs (levels 25 → 126) zero errors.

### 2026-11-12: Stage 2, tidy data and medium functions

- Removed the `masterTime < 500` speed-debug branches (masterTime is a constant now, they could never run).
- Enemy data: `hasgold`, `rare`, `corrupted` are booleans instead of "true"/"1" strings; the 10 checks read naturally.
- Split `searchInn`, `doOffering`, `getBotin`, `getEnemy`, `pjBtn` into named steps; `clearNPC()` also forgets the npc (it always went together).
- Pace re-checked over 4 runs of 10 game-minutes per version: 48 vs 48 encounters, 9 vs 9 deaths.
- Noted a v1 text bug in `wakeUp()` (HP counted twice when choosing the message), recorded in the roadmap.

### 2026-11-12: Stage 2 started, the endless animations

- Measured first (10 and 30 virtual minutes, counting animation callbacks, images, sounds and console writes). The only big cost was the spell animations: up to 999 animation callbacks per second in the 10-minute baseline runs (646/s in the 30-minute comparison), growing with play time. Images, sounds and the console are small.
- Spell animations now stop after their last frame; images are cached and a late-loading image can't overwrite a newer one.
- 30-minute game: 72,329 → 3,730 animation callbacks, peak 646/s → 50/s. Wizard sprite verified pixel-identical; gameplay suite zero errors.

### 2026-11-11: Professions decided

- The author decided the plan's open questions: one trade per wizard plus a second at chapter III; the wizard asks the god for guidance (the god chooses only with faith above 0, otherwise he decides by his skills); 2 zones per reagent (to revisit); rings wear out; all four god touches ship together; the Town dice quirk is fixed with the vendors; no mana; holy recipes later; vendors as scene events; divine binding refused by atheists and burnt at chapter X. Recorded in `docs/PROFESSIONS.md`.

### 2026-11-11: Professions plan

- Wrote `docs/PROFESSIONS.md` from `Recetas.csv`, the old help and the code hooks: reagents and where they come from, one profession per wizard (the old help says "one of three"), the 15 items with effects tied to existing mechanics, level-scaled prices, new NPCs (travelling merchant, herbalist, jeweller, scribe, tavern keeper, fence), bag, stats, code plan, build order.
- Found in the recipe sheet: each profession has a base reagent (Alchemy mushroom, Enchanting gem, Writing essence) in all five recipes; two bases = price 100 / hard, one base = 50 / easy. The sheet planned 1 zone per base reagent and 3 for the others; the code has 2 each.
- Found in `exploreEV()`: the dice-house check `pDados && City || Town` sends every non-loot explore in the Town to the dice house (precedence). Not changed; noted in the plan.

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

### 2026-11-11: Stage 1 steps 1-3, var gone and helpers

- Step 1: 157 `var` statements became `const`/`let` with a scope-aware tool that only converted what provably couldn't change behavior.
- Step 2: helpers for repeated snippets (`startEvent`, `endEvent`, `nextEvent`, `showStage`, `wizardName`, `el`). The tests caught three mistakes in the replacement script (helpers calling themselves, `events.js` importing itself, a local variable named like the new `el`), fixed before pushing. The module checker now also checks that imports match exports, self-imports, duplicate names and shadowed imports.
- Step 3: the 92 remaining `var` converted by hand (one `let` per name where first needed); `YesOrNot()` and `heartMeter()` rewritten.

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
