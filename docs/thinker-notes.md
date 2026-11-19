# Thinker notes

The author's design notes for the thinker (moved from the dev notes), newest last. Cut a note to the archive once it is in a plan.

```
Date: 2026-11-15 12:28
Author's note: hey @thinker, I am thinking about adding a large screens interface in landscape mode (tablets and computers), perhaps adding another column where we hve the buttons then the map, then the stats,  if user clic another button, it will replace the button panel. user always can close all and the game center again, clicing one of the scrools opern the scrioll in the second column, copen another one will open in the button, kinda dinamic.
```

```
Date: 2026-11-15 12:50
Author's note: considering the layouts for other screens, we can think in one for smartwahses, maybe in the largerst part the the scene, above the lvl,  health etc. below a button that show other buttons to open the scrolls
```

```
Date: 2026-11-15 12:53
Author's note: @historian and @dev. god the player must be unable to use the kill button after some point in the history, we need to came up for a plan, and narrative.
```

```
Date: 2026-11-14 23:53
Author's note: send to @artist, perhaps we can create a generalized animation to read bookx, inspect runes (and other items) e.g. drop the staff, kneel a little bit, intem disapear, wizards with hands close and on top the object that is examining. This is just an idea, we need to determine if is interesting. the way it is working is also nice and kinda signature. consult with  @thinker
```

```
Date: 2026-11-17
Author's note: @thinker, new achievements for the things built since 2.1.0. Dev checked which of them record stats.

Already counted, ready for achievements now:
- Belief way back from atheism (belief.reached.<level>), super-critics (belief.moment.superCritic)
- Dreams and nightmares (dream.random, nightmare.random, dream.story)
- Hydras: kills per hydra, most heads (kill.hydra.<h>, hydra.maxHeads.<h>, kill.hydraHeads)
- Bestiary seen counts (seen.sprite / seen.boss / seen.hydra), polymorph per animal (spell.polymorph.<animal>)
- Boss effects survived: blizzard, earthquake, poison, petrified, Midas heal interrupted
- God: touches, heals, hits, touches refused; camping (inn.campings), shrines per zone, statues
- World: wizards, oldest age, highest level; away hours (away.worldHours)

Not counted yet (dev would add them with the achievement):
- Dice house (6-5-4): games, wins, losses, gold won and lost, "another round"
- Time away: soft dead and permadeath share death.away; split them, count "saved by the touch", longest absence
- Leaving a zone after a long stay (restless) vs a normal zone change
- Killed by which enemy (death.by.<sprite>); the sheep and chicken achievements need it
- Kill button taken back at the second ask; cemetery notes read; erased wizards; chapters read

Achievement ideas (names are drafts):
- "Back from the void": climb from atheist back to doubter
- "Wrath of god": 10 super-critics
- "Bad dreams": 50 nightmares · "Sweet dreams": see every dream in the pool
- "Hydra slayer": kill every hydra · "All heads on deck": beat a hydra at its most heads
- "Naturalist": the bestiary complete (every sprite seen)
- "Old MacDonald": polymorph into every animal
- "Weather-proof": survive 25 blizzards and 25 earthquakes · "Not today, Midas": interrupt his heal 10 times
- "Stone cold": petrified 50 times · "Pilgrim": a shrine in every zone
- "Under the stars": camp 100 times
- "Lazarus": save a soft-dead wizard with the god's touch
- "Long night": come back after a month away
- "Restless soul": leave 25 zones after a long stay
- "High roller": win 50 dice games (the v1 placeholder logro_dadoscargados / logro_jugon could become these)
- "Second thoughts": take back the kill 10 times
- "Generations": 10 wizards in the world · "Keeper of tombs": read every cemetery note
- "Chronicler": read every chapter so far

Decided (2026-11-17, docs/DECISIONS.md): achievements belong to the player, saved per world so they survive permadeath. Each one is either lifetime (world stats) or one life (the current wizard), and shows which wizard won it. Mark each idea as lifetime or one life in the plan.

Please turn these into a plan with options; dev waits for the author's OK before building.
```

```
Date: 2026-11-18
Author's note (moved from dev-notes): add a defensive spells school to avoid damage we can incorporeate thos with the lvl. no overpowered, so rare. ideas: rune shield = circle in front of him; ice block = it can be in fron of him as well; more advance": phase off, and later in the game magic shield, like a multicharge, spell that protect from the following 2 or 3 attacks, this should be an outline probably black + white, that fade with every hit

Please turn this into a plan with options (rarity, level scaling, charges, the art it needs); dev waits for the author's OK before building.
```

## Plot for the dark skeleton sprites (author, 2026-11-19)

```
We need to develop a nice plot with these sprites: a row of six hooded dark skeletons (dark cloak, bony face, a coloured outline or glow on each: cyan, orange, blue, red, green, gold-and-red). The sheet is ../wizardidle-old-ideas/unorganzed_sprites/dark-skelets.png (outside the repo, not wired into the game).

Please turn this into a plan with options (who they are, where they appear, how they tie into the story and the god, boss or enemy or story characters, what the six colours mean); dev and artist wait for the author's OK.
```
