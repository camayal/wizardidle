# Other ideas

Smaller ideas: achievements, UI, town and tavern, v1 leftovers, pace. Read only when working on one.

- Finish the 13 placeholder achievements (`logro_jugon`, `logro_ricachon`, `logro_muchapradera`...): give them titles, descriptions and real triggers. *Since 2.0.0* they're marked `planned:true` in `src/data/achievements.js`: hidden, and not counted towards completion. So finishing one means designing it and removing the flag. Every one already has its icon. The names hint at the plan: *jugón* (gambler), *dados cargados* (loaded dice) and *full carga* (full cargo) are dice; *inventario lleno* (full inventory) needs an inventory (professions); *dormiletas* (sleepyhead) is camping or inn; *corazón grande* (big heart), *ricachón* (rich), *fanático*, *estudioso* (studious), *eso sí es iluminación* (now that's enlightenment), *flawless*, *mucha pradera* / *mucho poblado* (lots of meadow / village), *primer boss* (first boss). Most need the stats from "Track almost everything as stats".

- A real offline mode (new service worker) so it plays like an app again.

- **Notify story and achievements in the background** (from old notes, 2014): the Android app played a sound and vibrated for new achievements and story chapters while in the background. For the web version, this could use browser notifications. Pairs with the offline-mode idea.

- **Levelling pace: XP per enemy** (from `wizardidle-old-ideas/infodexp.xlsx`, 2018): the XP spreadsheet planned that each level takes **16 × level kills**: XP per enemy = (XP gap to next level) ÷ (16 × level). That's 16 kills at level 1, 800 at 50, 1,600 at 100 and 3,200 at 200, where the sheet marks **END**. *Today:* the game divides by 16 only (`xpPerEnemy` in `levelUP()`, `rEnemyXP` in `src/config.js`), so every level takes about 16 base kills (normal kills give ×1.5, so ~11) no matter the level. The sheet's own playtest log (sheet "Hoja4", pivot of XP events per level for levels 1–196) shows the shipped pace: ~17–27 XP events per level, flat. The rest of the sheet matches the code exactly: XP curve `lvl^1.1 × 8`, HP = XP × 1.6483, enemy HP = HP × 1.2, age starting at 19 and growing by XP × 0.0005. One more difference: gold per HP is **0.25** in the sheet but **0.15** in `config.js`.

- **Unused sprites: abandoned ideas with art ready** (2026-11-10, from `wizardidle-old-ideas/unorganzed_sprites/`): 51 of the folder's images aren't in `img/`. Most of the folder (backgrounds, altars, statues, dice, buttons) is already in the game. What's left points at ideas:
  - **Rings** (`anilos.png`) → Enchanting (see Professions).
  - **Playing cards numbered 1–6**, in the town sheet `BASE/townactions.gif` → **a card game against tavern NPCs** (confirmed by the author). That's what the empty `cardCombat()` stub was for. Taverns already exist (`la_ciudad_taberna`, `el_poblado_taberna`, `el_desierto_taberna` backgrounds; `innEV()` and the `taberna` counters), so the game would sit next to the dice game (played at the dice house, `casadados`). It would need its own stats (games, wins / losses, gold won / lost, opponents) and could share the gambling achievements (*jugón*).
  - **Town sheet** (`townactions.gif`, D.E. Gervais): a *Rumors* scroll (quests or hints), keys, a map, potions, books, a coin bag, food, a crown, NPC portraits → quests, rumours, shops.
  - **Shop fronts** (`BASE/dg_town932.gif`): ~~weapons, armour,~~ potions, magic, books, tavern, bank, temple, stables, guild signs → shops and guilds in the City or Village. Commerce from the old help, profession trainers.
  - **Townsfolk** (`BASE/dg_people32.gif`, 12 characters) and a **speech bubble with text** (`bocadillo con letras.png`) → NPCs who talk: quest givers, merchants, rumours. We can find them anywere, they are humans so they are not hostile with other humans.
  - **Interior tiles** (`BASE/L2_*`: bar, beds, kegs, tables, cabinet, columns, doors, a prison mat) → indoor scenes: the inn, the healer's hut, or a prison (the Chapter VIII lynching?).
  - **Boss crowns** (`boss icons/`: plain, silver, gold, red; `bossCoronas.pdn`) → boss ranks. *Today* bosses, hydras and guardians all show the same `boss.png`. Could mark boss / guardian / hydra / megaboss, or how many times a boss has been beaten.
  - **`logro_level100` icon** → a level-100 achievement that doesn't exist (only 2, 140 and 200 do). Level 100 is when the wizard takes control of the sacred staff in the story.
  - **New Meadow backgrounds** (`Bkg/news/la_pradera32.png`, a crowd at the edge; `la_pradera4b.png`, a rock or hut) → scene variants or story scenes.
  - Not features: `iconSiluete.png` (the "IDLE" logo), `ForGooglePlay.png` (store art).

- ~~**Pixel-art UI: tiles for the bars and panels** (2026-11-10): the interface mixes two styles. The buttons, the heart HP icon (`heartMeter()`), the scroll and the frame are pixel-art images, but the **XP bar is a plain HTML `<meter>`** (`#XPprogressBar` in `index.html`, updated in `updateHeading()`), styled by the browser. Idea: draw a small set of pixel-art tiles (left cap, repeating middle, right cap, fill, maybe a sparkle when levelling up) and build the XP bar from them, then reuse the same kit for anything else still drawn in plain HTML, so the whole UI shares one hand-made look. Existing pieces to match: `img/emptyLongBtn.png`, `img/frame.png`, the scroll backgrounds, and the `Btn` / `Empty` / `regilla` / `tile000` source files in `wizardidle-old-ideas/layers/`.~~

- **Ideas found in the v1 code comments** (2026-11-11, from commented-out code removed in stage 1; the original lines are in tag `v1.0.0`):
  - *Robbery* ("robbed!", "rest: chance to be robbed", and in Spanish "a rogue robs him and escapes, gold drops"): a thief steals part of the wizard's gold, at random or while he rests.
  - *Fight at the inn when he can't pay* ("add event of fight if have not gold"): today the inn just turns him away or lets him sleep; a brawl could be the price.
  - *Quests*: "quest? check the scrolls" with a link to a fantasy tile set used as reference. Ties into the stats and NPC ideas above.
  - *Quest: the prism* (DONE 2026-11-24, author approved: the quest is given, as a whisper of the god, when the wizard meets his second Tundra spectrum, so it reads as a pattern; the prism artefact turns up in finds only after that). Built as a flag in state.spectra, no quest scroll yet: when one exists, list it there.
  - *Achievements for every boss and for each hydra* ("todo logro de todos los boss", "todo logro de cada hidra").
  - *"Hey guy look at me" achievement*: when `el_mediano14` appears (the shortie who shouts "HEY GUY LOOK AT ME!"). Original flavour line: "The world is losing its values, the un-polite enemies do not see the opponent in the face".
  - *Dice game stats and achievements* ("TODO add idx for all this part and achievements" in the dice game). Fits the planned *jugón* / *dados cargados* / *full carga* achievements.
  - *See-through ghosts*: enemies marked `translucid` in `src/data/enemies.js` (slime, spectre, ether) and the ghost-like bosses (cuboq, etymos, infraespectro) were meant to be drawn semi-transparent (opacity 0.7–0.8).
  - *Locked achievements on the achievements page*: show not-yet-earned ones with a placeholder image (`img/no_logro.png` exists) instead of hiding them. Not sure, (nov 11, 2026) i think just put how many achievemenst has completed from how many they are in the game.
  - *Only one game tab*: detect the game open in two tabs and warn ("Wizardidle is running in another tab!").
  - *Android back button*: keep it from closing the app when installed.
  - *Fade transitions* ~~between the clouds~~, the name screen and the game.

## Already built (from the old notes)

Checked against the code on 2026-11-10, so these don't get re-proposed: the healer's cabin that rescues the wizard for faith · studying runes, books and statues to raise stats · the *Ship, Captain and Crew* dice game · bosses (touchable for faith) · faith from altars and gold offerings · the place graph with x/y positions and destinations · spells unlocking by level tier · the D.E. Gervais art credit (CC BY 3.0) · the per-sprite enemy table: all 669 sprites in `InformationByEnemy.xlsx` match `src/data/enemies.js` exactly (type, rare, corrupted, display name) · the zone boss and enemy table in `enemyLocation.xlsx` (2014): all 16 bosses match, and 14 of 16 enemy lists match exactly. The Castle's sorceress (`la_Hechicera`) was later dropped from the code, and the Forest's elf (`el_Elfo`) was added · the XP/HP/age/enemy-HP formulas in `infodexp.xlsx` (except the two differences noted in "Levelling pace").

## Open questions

- ~~Pixel-art UI: which elements get tiles first (XP bar, then faith or HP bars, scroll frames, console)? Should the XP bar animate (filling, a level-up flash)?~~
- Card game: what are the rules (how the 1–6 cards are played, betting, how the wizard decides), and who are the tavern NPCs he plays? U
- Unused sprites: were the boss crowns for boss ranks, or something else (achievement tiers)? Which town ideas (shops, rumours, talking NPCs, interiors) are still worth keeping?
- Stats: should everything show on the stats scroll, or only some, with the rest hidden and used for achievements and quests? Per wizard, per world, or both? And what was `cardCombat()` meant to be?
- Levelling pace: keep the flat ~16 kills per level the game has always had, or move toward the spreadsheet's 16 × level (much slower late game)? Or something in between? And should gold go back to 0.25 per HP?
