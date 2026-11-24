# Thinker notes

The author's design notes for the thinker (moved from the dev notes), newest last. Cut a note to the archive once it is in a plan.

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

Decided (2026-11-17, docs/plans/DECISIONS.md): achievements belong to the player, saved per world so they survive permadeath. Each one is either lifetime (world stats) or one life (the current wizard), and shows which wizard won it. Mark each idea as lifetime or one life in the plan.

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

## Etymos, the elemental boss: minibosses and a secret bestiary (author, 2026-11-19)

```
Reference sprites: ../wizardidle-old-ideas/unorganzed_sprites/Sprites/Tiles Gervais/_explored/enemies/elementals/ (ElementalAir, ElementalEarth, ElementalVoid, ElementalWater: elemental creatures; one of them, the void one, is our current boss Etymos, img/bosses/etymos).

Idea: develop a plot around it. When the wizard kills Etymos, he is replaced in later encounters by six minibosses, one per colour Etymos has now: air, fire, poison, water, ice, gold. Killing all six at least once gives a very rare achievement; killing each one gives its own achievement too. The minibosses live in a secret section of the bestiary.

Please turn this into a plan with options (why Etymos breaks into six, where and how often the minibosses appear, their attacks and sprites, the achievement tiers (src/data/rarity.js), how the secret bestiary section shows up); dev and artist wait for the author's OK.
```

- Connector scenes as real scenes (dev, 2026-11-20; author asked, design open). Done in code: each connector scene is registered (connectorSceneInfo) with its connector, place in the walk and map spot. Still to design before dev builds it:
  1. Events inside a connector scene (enemy, fight, find): chance per scene, and does it stop the walk or can it end it early?
  2. How long a scene lasts (today a plain walk across, about 3 s a scene) and whether he can rest or stop in one.
  3. Whose enemies: the zone he leaves, the zone he enters, or a list of the connector's own (bridge, stairs, mouth, tunnel, ladder differ?).
  4. Fights in a mirrored (east to west) scene: wizard, spells and enemy entrance mirrored, art never (dev-notes has the ui.facing idea).
  5. Stage entries: should each scene be a stage of a `connector` zone (legend, events, travel links), or stay outside `places`? The pathfinder reads places{} as stages, so a decision is needed on how the Travel graph and tool see them.


## From the author's notes, moved from dev-notes (2026-11-24)

```
Date: 2026-11-20 23:22
Author's note: Send to [[wt, better ways to improve the emotion of the game other than collecting all the things?
```

```
Date: 2026-11-20 23:26
Author's note: idea for the end if the player god is dead. it is an  desintegration animation, when the animation is getting to the end, 1 frame before , the entire ui start fading out and get completly black the whole screen, no announcement no nothing, god has died, no response, no text, no what happened with the world, literarly the god died.
```

```
Date: 2026-11-20 23:29
Author's note: send to [[wt, we need something nice, such a missions:
- some can be assigned by wizard himself, for example pick ingridients, get more gold, something, i think we need to design some learning algoritm here, perhaps genetic algornitm to give some "inteligence"
- some task in we can asign in the faith screen, most of them to booth the faith points
- some given by npc in taverns, inns or merchants
- when a secret is found, wizard is mostly focus on that, looking for something, it is why we need to keep checking pathfinder to give some movement purpose
```

```
Date: 2026-11-21 10:14
Author's note: big dramatic change, only reserverd for v.3.0.0 send to [[wt.
double the size of the scene screen, no animations, no sice of things, just souble to finish the tip part  to allow to finish the scenes, for example to of the trees, entire buildings, big mountans, tower, and the most important add sky details, like moons and suns cycles
```

```
Date: 2026-11-21 10:23
Author's note: quests ideas:
- Wanted type of quests, hunt a given rare or even boss enemy (this increase the changes of finding them a little, not too much because it getting easy, but not as regular because will be boring)
- Get special ingridients from some enemies, they can be drop anytime, so if the wizard has them in the inventory the wizard can give them , avoid to have spoilable ingredients
- Explore some zones
- Fishing quests
- Crafting quests
- Find runes, books, or statues to study them
```

```
Date: 2026-11-21 10:26
Author's note: More quest ideas related with faith:
- Chances of have quest to get good amount of faith in the shrines
- Short peregrinations, for example visit 3 shries in different zones
- Find very hiddent shrines (such as vulcano)
```

```
Date: 2026-11-21 10:28
Author's note: More ideas for economy quests:
- Deliver things from one inn to another (some of those quest need to be reduced the chances when the wizard is in almost final levels, at that moment, only killing or selfimprovement quests should be done.
```

```
Date: 2026-11-24
Author's note: battle AI, for the thinker to design before dev codes it (dev's proposal is only a starting point, the author says it is more complicated than that).
Goal: with the god's help bosses ~90% killable, rares ~95%, regular enemies 100%; the wizard never invincible so the god keeps a purpose.
Today (src/combat.js battle()): dice only. Wizard heals 17% when hurt, polymorph 2.5%, attack 60%, else the enemy hits; spell random. Enemies and bosses pick attacks at random from a list; boss effects fire by chance.
Dev's draft: step 1 wizard AI (heal when one more hit could drop him under ~35% HP, else attack, polymorph only on regular enemies with real HP, never count on the god); step 2 boss AI (strong or status attack when he is healthy, heal or defend when low, a bounded finishing attack when he is low: strongest normal attack, no extra damage, cooldown, not right after a heal); regular enemies simple, rares a little variety; a shared difficulty knob in config.js; tune with tools/playtest.py (check first that it simulates god touches).
Open for the thinker and author: protective ward spell (heal-only first or ward now: needs a new spell, art and an effect); does the AI get smarter with level; do bosses read the wizard's HP at all (finishing attack) or only their own; how the kill rates are measured and what counts as 'with god help'.
```
