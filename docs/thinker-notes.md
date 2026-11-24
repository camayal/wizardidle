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
- Idea (author, 2026-11-19): nudging from the god. Clicking a door, gate, cave entrance and the like raises the chance that the wizard takes that path next. The wizard can reject the suggestion and carry on his own way, and then the faith spent is wasted. Design questions for thinker first: faith cost, how much the odds rise, how often he refuses (belief level?), and what the player sees (console line, door glow).

```
Date: 2026-11-20 23:18
Author's note: faith is being a problem with inactive games, the faith falls quick and it is almost not oportunity in getting more. sent [[wt how to improve the believer and faith system
```

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
Date: 2026-11-22 09:30
Author's note: idea for [[wt healing him will cost less than attacking enemis
```

```
Date: 2026-11-23 14:30
Author's note: add some detailss for [[wt about faith. we need to include whispers when the character is atheist. also think about ways that both types of games enjoiable (believer vs atheist). regarding action, the player power should be linked directly with the belief level, faith should be less punitive, perhas change the scale from 0 to xxx rather than go negative. we need to think about it
```

```
Date: 2026-11-23 19:07
Author's note: for [[wt some ideas for faith think:

Design Spec: 4-Tier Belief & Silent Guardian Mechanics1. Core Premise & EconomyNarrative Framing: The player is a solitary deity worshipped by a single subject (the wizard). Even when the wizard stops believing, the player continues trying to protect and win back their only subject.Faith (0 → +Max): Strictly positive spendable resource (divine mana). Never goes negative to prevent soft-locks.Belief (4-Tier Relationship State): Devout $\leftrightarrow$ Believer $\leftrightarrow$ Doubter $\leftrightarrow$ Atheist.Extremes (Devout & Atheist): Distinct, equally viable playstyles (Active Shepherd vs. Silent Guardian). Neither extreme is punitive.Bridges (Believer & Doubter): Transitional momentum states separating the two extremes.2. Tier Breakdown & Action Bar MorphingRather than locking out player agency as Belief drops, the player's action bar morphs from Overt Miracles (direct wizard buffs) into Invisible Hand Nudges (environmental/enemy manipulation that the wizard perceives as luck or skill).Belief TierRoleCombat & Survival ActionsDecision & Path GuidanceWizard Stat Scaling1. DevoutActive Extreme (Shepherd)Overt Miracles: Direct Heal, Resurrect, Smite, Divine Shield.Divine Command: 100% obedience on paths and professions.Low solo stats; high multiplier from divine buffs and shrines.2. BelieverUpper BridgeStandard Miracles: Heal, Smite, Bless Drop, Whisper.Persuade: ~80% chance wizard follows suggested path/profession.Balanced baseline stats; responsive to active intervention.3. DoubterLower BridgeSubtle Aid: Weak Heal, soften enemy armor, Whisper (primary pull back toward Believer).Nudge: ~50% coin-flip whether wizard listens or acts independently.Rising Self-Reliance (+XP%, +Crit%); miracle potency scales down.4. AtheistIdle Extreme (Silent Guardian)Invisible Hand: Reduce enemy resistance/armor, turn lethal hits into 1-HP "grazes," spawn hidden healing herbs.Stray Omen: Low-cost, ~80–85% ignored; wizard relies on stubborn instinct.Peak Self-Reliance (+XP%, +Crit%); immune to direct heals/commands.3. Key System LoopsDual Faith Generation (0 → +Max):Active Loop (Devout / Believer): Clutch heals (below 25% HP), shrine visits, and fulfilled Divine Commands generate Faith.Passive Loop (Doubter / Atheist): Surviving fights rigged by Invisible Hand nudges, unassisted boss kills, and chapter milestones generate latent Faith—ensuring idle players return to a full Faith pool.Universal Steering via Whispers:Low/zero-cost action with a short cooldown available across all tiers.Increments Belief upward (Atheist → Doubter → Believer → Devout), allowing an active player to slowly win back an Atheist wizard through persistent subtle signs.Stat Handoff Curve:Miracle potency scales inversely with wizard Self-Reliance (+XP% and +Crit%) across the four tiers so progression remains smooth during transitions without a "weak middle" valley.4. Implementation Checklist for Engineering[ ] Migrate faith state variable from signed integer (-/+) to clamped unsigned range (0 to maxFaith).[ ] Implement 4-state belief enum/thresholds (DEVOUT, BELIEVER, DOUBTER, ATHEIST) with idle-time decay and miracle/whisper increment hooks.[ ] Build action-bar swapping logic so ATHEIST and DOUBTER replace direct targeted miracles with environmental/enemy modifiers (e.g., enemy.resistance debuffs, lethal-hit survival clamping).[ ] Add probabilistic compliance rolls to path/profession guidance (100% $\rightarrow$ 80% $\rightarrow$ 50% $\rightarrow$ 15%).[ ] Wire passive Faith generation triggers to unassisted kills, rigged-fight survivals, and story chapter transitions.
```

```
Date: 2026-11-23 19:17
Author's note: [[wc other faith potential ideas:
Attribution Log: Show the wizard's "luck/skill" excuse in the text log when you use an invisible Atheist nudge (e.g., "It looks like the {enemy] blade snapped on its own").

Unanswered Prayers: Low-HP in bosses battles trigger a timed prayer prompt—answering spikes Belief upward; ignoring drops Belief and adds a permanent +Crit/XP ("Hardened Heart") buff.

Miracle Tolerance: Spamming the same miracle gives diminishing Belief returns; decaying Belief based on unmet expectations replaces flat real-time timers.

Relic Tethering: Equipped gear carries a passive bonus into the next timeline based on the previous run's ending Belief (+Faith/Whisper for Devout, +Crit/XP for Atheist).

Witness Meter: Overt miracles draw heavier enemy aggro/difficulty; invisible nudges let the wizard ambush foes undetected.
```

```
Date: 2026-11-24
Author's note: battle AI, for the thinker to design before dev codes it (dev's proposal is only a starting point, the author says it is more complicated than that).
Goal: with the god's help bosses ~90% killable, rares ~95%, regular enemies 100%; the wizard never invincible so the god keeps a purpose.
Today (src/combat.js battle()): dice only. Wizard heals 17% when hurt, polymorph 2.5%, attack 60%, else the enemy hits; spell random. Enemies and bosses pick attacks at random from a list; boss effects fire by chance.
Dev's draft: step 1 wizard AI (heal when one more hit could drop him under ~35% HP, else attack, polymorph only on regular enemies with real HP, never count on the god); step 2 boss AI (strong or status attack when he is healthy, heal or defend when low, a bounded finishing attack when he is low: strongest normal attack, no extra damage, cooldown, not right after a heal); regular enemies simple, rares a little variety; a shared difficulty knob in config.js; tune with tools/playtest.py (check first that it simulates god touches).
Open for the thinker and author: protective ward spell (heal-only first or ward now: needs a new spell, art and an effect); does the AI get smarter with level; do bosses read the wizard's HP at all (finishing attack) or only their own; how the kill rates are measured and what counts as 'with god help'.
```
