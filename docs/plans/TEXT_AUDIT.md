# Text audit

A pass over every player-facing string: grammar, spelling, sentences that make no sense, and the word "god". Only displayed text changes. Internal names (variables, stat keys like `god.touches`, file and image names, `logro_hategod`) stay as they are. Code comments are not in scope.

## Glossary (proposed, waiting for the author)

The story rule stays: the player *is* the wizard's divine being, and the console says "you" whenever it can.

| Old | New | When |
|---|---|---|
| god (the player, said by the narrator) | **you** | Always first choice: "his god" becomes "you". |
| god (general, any divine being) | **deity**, plural **deities** | Main term: "an all-seeing deity", "a hundred deities". |
| the god's wrath / power / touch | **divine** wrath / power, **your** touch | Adjective "divine" stays everywhere (Divine hit, divine touch, divine hound). |
| the god's order / whisper / will | **your** order / whisper / will | Already the voice of the Faith scroll. |
| godly, godliness | divine; "belief" | "promotes godliness" becomes "strengthens his belief". |
| (impersonal, the wizard cannot name you) | **the heavens**, **someone above** | Already used: "the heavens need a while". |
| (poetic name strangers give you, rare) | **the Unseen** | Dreams, poems, later story text only. |
| faith, belief, prayer, shrine, holy, sacred, atheist, devout | unchanged | Generic words, not tied to one religion. |

Prophecy and endings (docs/STORY.md, not in the game yet) would read: *"An exile, heard by a single deity, shall strike a deity down and rise as the Omni, deity of deities."*

**Open question for the author: which main term?**
1. **"deity" (recommended)**: "you" first, "deity/deities" for any divine being, "divine" as adjective, "the heavens" and "the Unseen" as variants. The prophecy becomes "deity of deities".
2. "deity" everywhere, but keep "god" in the prophecy and the two endings only, where its weight helps ("the Omni, god of gods").
3. "divinity" as the main term ("a hundred divinities", "divinity of divinities"); softer, a little abstract.
4. "the Unseen" as your name everywhere, "deity" only for the other hundred.
5. Add or talk first.

The table below uses option 1. If another option wins, only the rows marked **G** change.

## Changes

Achievement descriptions are made imperative ("Find", "Defeat", "Get killed by") since some already are.

| File | ~Line | Old | New |
|---|---|---|---|
| index.html | 6 | WizardIdle | Wizard Idle |
| data/achievements.js | 8 | Great performance!, execute a 500 HP attack | Great performance! Land a 500 HP attack. |
| data/achievements.js | 9 **G** | The power of a god is inside, execute a 1000 HP attack | The power of a deity flows through you. Land a 1000 HP attack. |
| data/achievements.js | 10 | Excellent work for someone without a shovel, found 100 chests | Excellent work for someone without a shovel. Find 100 chests. |
| data/achievements.js | 11 | This behavior have some link, break 100 pots | This behaviour has a certain Link to it. Break 100 pots. |
| data/achievements.js | 22 | Reach to the level 2, no new powers but pure fun | Reach level 2. No new powers, just pure fun. |
| data/achievements.js | 23 | Occupate the throne and kill King Midas | Kill King Midas and take his throne. |
| data/achievements.js | 24 | A evil king with a great power, recover the throne | An evil king of great power. Take back the throne. |
| data/achievements.js | 25 | Like Alejandria but pixelated, found 1000 books | Like Alexandria, but pixelated. Find 1000 books. |
| data/achievements.js | 28 | A boss can not be underestimated, killed by a boss for first time | Never underestimate a boss. Get killed by a boss for the first time. |
| data/achievements.js | 29 | Who is the boss now?, defeat a boss | Who's the boss now? Defeat a boss. |
| data/achievements.js | 31 | Runemaster, found 1000 runes to study | Runemaster. Find 1000 runes to study. |
| data/achievements.js | 32 | BnB, beer and bed / Spend some time in a inn, visit 250 times a inn | B&B: beer and bed / Spend some time at the inn. Visit an inn 250 times. |
| data/achievements.js | 33 | Touched many times | Feel your touch many times. |
| data/achievements.js | 34 | Kill the last existing Capricor, an ateist lineage with no revive posibilities, are you happy? | Kill the last living Capricor, an atheist lineage with no hope of revival. Are you happy? |
| data/achievements.js | 35 | Kill the "last" Capricor again, with another wizard | (fine) |
| data/achievements.js | 36 | Why this animal is here? / Found a eagle in the cave | Why is this animal here? / Find an eagle in the cave. |
| data/achievements.js | 37 | Killed by a powerful sheep | Get killed by a mighty sheep. |
| data/achievements.js | 38 | Badly defeated by a demonic chicken | Get badly beaten by a demonic chicken. |
| data/achievements.js | 40 | Tocayo / Find a namesake, something almost impossible in these lands | Namesake (optional, if the Spanish joke should go) / Meet a namesake, almost impossible in these lands. |
| data/achievements.js | 41 **G** | Found a new way to live the life, pure and real hate for god, reach -10K of faith | A new way of life: pure, honest hatred for the heavens. Reach -10K faith. |
| data/achievements.js | 43 | Discover the mantra to wake up the ancient hydras | Discover the mantra that wakes the ancient hydras. |
| data/awayTexts.js | 6 **G** | If no god comes for him before nightfall | If no deity comes for him before nightfall |
| data/awayTexts.js | 23 **G** | A god can be gone for a moment. | A deity can be gone for a moment. |
| data/dreams.js | 48 **G** | A hundred gods sit at a long table, | A hundred deities sit at a long table, |
| data/enemies.js | 70 | king midas | King Midas (check: combat.js 407 may print "The King Midas") |
| data/enemies.js | 74 | king skeleton | Skeleton King |
| data/enemies.js | 90 | real eagle | golden eagle |
| data/enemies.js | 91 | double head eagle | double-headed eagle |
| data/enemies.js | 96 | bihead cornutspion | two-headed cornutspion |
| data/enemies.js | 124 | bihead snake | two-headed snake |
| data/enemies.js | 422 | Terrifing golem | terrifying golem |
| data/enemies.js | 228-758 | Pure demon, Insane demon, Arcane imp, Divine dragonian, Divine dragus, Master skeleton, Astral golem, Mad ogre, Ice roco, High amazon, Sacred wizardess, Divine polypoid | all lower case like the rest ("pure demon"...): the code capitalises at sentence start, and "A Pure demon" / "Hunt the Mad ogre" read wrong |
| data/zones.js | 7 | some cries are heard in the distance | cries can be heard in the distance |
| data/zones.js | 14 | good and healthy fresh air / something is stalking in the shadows | the air is fresh and clean / something stalks in the shadows |
| data/zones.js | 19 | this hot dry air dries the bones | the hot dry air dries his bones |
| data/zones.js | 21 | the smell of rotten flesh intoxicates the air | the smell of rotten flesh poisons the air |
| data/questTexts.js | 11 | and no mason can finish a wall of it | and no mason can finish mending them |
| data/questTexts.js | 25 | {who} steals the finest cloaks and the wearers with them in the {where}. | {who} steals the finest cloaks of the {where}, and the wearers with them. |
| data/questTexts.js | 34 | no longer dare to sleep, {who} comes by | no longer dare to sleep; {who} comes by |
| data/questTexts.js | 44 | Nobody sleeps in the {where}, {who} screams | Nobody sleeps in the {where}; {who} screams |
| data/questTexts.js | 59 | Nobody can fish the {where}'s pools, {who} drinks | Nobody can fish the {where}'s pools; {who} drinks |
| data/questTexts.js | 97 | The mud of the {where} takes a person a night since {who} came. | Since {who} came, the mud of the {where} swallows someone every night. |
| data/questTexts.js | 102 | and marches the dead behind. | and marches the dead behind it. |
| data/questTexts.js | 123 | found his crops cooked still in the ground | found his crops cooked while still in the ground |
| data/questTexts.js | 129 | freeze in their steps | freeze in their tracks |
| data/questTexts.js | 133 | leaves the {where}'s sand dry of footprints | leaves no footprints in the {where}'s sand |
| data/questTexts.js | 135 | everything that heard the laugh in the {where} went still | everything in the {where} that hears it goes still |
| data/questTexts.js | 181 | The {where}'s shells are taken from the graves of drowned men by {who}. | {who} takes shells from the graves of the {where}'s drowned men. |
| data/questTexts.js | 217 | see no other thing again | never see anything else again |
| data/questTexts.js | 227, 241, 257, 282, 292, 313 | "..., its sparks / its light / it stays / it drinks / its petals / it keeps ..." (comma splice) | same with "; its ..." / "; it ..." |
| data/questTexts.js | 329 | swore to be the greatest mage and begins by beating the villagers | swore to become the greatest mage and has started by beating the villagers |
| data/questTexts.js | 330 | brought down a peg | taken down a peg |
| data/questTexts.js | 346 | {name} finally arrived at the {where} and saw {found}. | {name} finally reaches the {where} and sees {found}. |
| data/questTexts.js | 347 | stands in the {where} at last and saw {found} | stands in the {where} at last and sees {found} |
| data/questTexts.js | 348 | The {where} opens before {name}, as he was told and saw {found}. | The {where} opens before {name}, just as he was told, and he sees {found}. |
| data/questTexts.js | 349 | {name} reached the {where} and looked around slowly and saw {found}. | {name} reaches the {where}, looks around slowly and sees {found}. |
| data/questTexts.js | 375 | {name} came to the inn | {name} comes to the inn |
| data/questTexts.js | 464 | thinks it is better to concentrate on other things and leaves this errand | decides to focus on other things and drops this errand |
| data/questTexts.js | 470 | thinks it is better to concentrate on another quest now | decides to focus on another quest now |
| data/questTexts.js | 471 | changes his mind, almost against it | changes his mind, almost against his will |
| data/questTexts.js | 493 | cannot let this errand go yet and continues | cannot let this errand go yet and carries on |
| data/questTexts.js | 494, 500 | thinks it is only his tiredness and continues with this quest / and keeps his course | thinks it is only fatigue and carries on with this quest / and keeps his course |
| data/questTexts.js | 495 | shrugs it off and continues with this quest | shrugs it off and carries on with this quest |
| data/questTexts.js | 496 | {name} for some reason is tired of this quest, but he does not care and continues. | For some reason {name} is tired of this quest, but he carries on anyway. |
| data/questTexts.js | 502 | {name} for some reason feels like changing plans, but he does not care and keeps his course. | For some reason {name} feels like changing plans, but he keeps his course anyway. |
| data/questTexts.js | 508 | {name} for some reason feels like praying, but he does not care and walks on. | For some reason {name} feels like praying, but he walks on anyway. |
| data/questTexts.js | 514 | {name} for some reason feels like deciding otherwise, but he does not care | For some reason {name} feels like changing his mind, but he does not |
| ui/scrolls.js | 464 **G** | you are an omniscient god that know all the names | you are an all-seeing deity who knows every name |
| ui/scrolls.js | 471 **G** | for a god who looks away ... A god who comes back in time | for a deity who looks away ... A deity who comes back in time |
| ui/scrolls.js | 474 | Each order is obeyed or ignored by his belief. | Whether he obeys each order depends on his belief. |
| ui/scrolls.js | 475 | the hunters guild | the hunters' guild |
| ui/scrolls.js | 502 **G** | WizardIDLE, what is this? / It is a game with typical elements of a common RPG game, the only difference is the player role. You are the god of the wizard and your interaction is limited due his free will. With or without your help the wizard can reach his fate being a deep believer or a hardened atheist. | Wizard Idle, what is it? / A game with the usual elements of an RPG; the difference is your role. You are the wizard's deity, and his free will limits what you can do. With or without your help he will meet his fate, as a deep believer or a hardened atheist. |
| ui/scrolls.js | 503 **G** | This is an idle game, a true idle game, you must do nothing. The wizard can perform all actions without your help. This is a different way to play, watching what other beings do without your control but some interference (you can interact with miracles). This is a god like game. When no god is looking the world is in no hurry | This is an idle game, a true one: you do not have to do anything. The wizard does everything without your help. It is a different way to play: you watch another being live, and can only interfere a little, through miracles. You play the deity, not the hero. When no deity is watching, the world is in no hurry |
| ui/scrolls.js | 504 | The control, this is an informational panel with the name, experience bar, level, health points, gold and faith points. In this panel you can find the buttons to access other information displayed in The scroll. / The scene, this is the graphical version of the console | The control panel, with the name, experience bar, level, health, gold and faith. Its buttons open the pages shown in The scroll. / The scene, the picture of what the console tells |
| ui/scrolls.js | 506 | Boss, this encounter is harder than others, the reward is multiplied too. | Boss: harder than other encounters, with a bigger reward. |
| ui/scrolls.js | 507 | Attack, followed by the amount of damage against the wizard or the enemy. | Attack, followed by the damage dealt to the wizard or the enemy. |
| ui/scrolls.js | 508 | Wizard health, can be found in five states depending on the percentage | Wizard health, shown in five states by percentage |
| ui/scrolls.js | 511 | Gold, represent the currency in the game. | Gold, the game's currency. |
| ui/scrolls.js | 513 | Faith, divine currency in the game, divine touches and other stuff cost faith instead of gold. | Faith, the divine currency: divine touches and other miracles cost faith instead of gold. |
| ui/scrolls.js | 514 | new content or update is available in the server. Reload the game to download the new content for offline access. | new content or an update is on the server. Reload the game to download it for offline play. |
| ui/scrolls.js | 516 | the game can run but some problems with the offline functions happen. Not enough space, your browser does not allow cache, or cache is in conflict with a previous one. | the game runs, but offline play has a problem: not enough space, the browser does not allow caching, or the cache conflicts with an older one. |
| ui/scrolls.js | 518 | The center of this game, {name} is growing in power and ambitions. The fate is just one. | The heart of this game. {name} grows in power and ambition. He has only one fate. |
| ui/scrolls.js | 519 | every help costs your faith ... (a revive he always accepts) | every bit of help costs faith ... (he always accepts a revive) |
| ui/scrolls.js | 520 | occurs when click or touch the Scene panel / Touch the map teleport the wizard to the selected area. | happens when you click or touch the Scene panel / Touch the map to teleport the wizard to the selected area. |
| ui/scrolls.js | 522 | This is a definitive option, with this the player can destroy the current wizard in order to create another | This is final: it destroys the current wizard to make way for a new one |
| ui/scrolls.js | 525 | A history of events your wizard achieve during his journey. | A record of what your wizard achieves on his journey. |
| ui/scrolls.js | 528 | Many stats about what happens in the wizard trip, pure information. | Stats about the wizard's journey, just for information. |
| ui/scrolls.js | 534 | Here you can see the representation of the continent where everything happens. | A map of the continent where everything happens. |
| ui/scrolls.js | 538 **G** | When the god revives the wizard | When you revive the wizard |
| ui/scrolls.js | 539 **G** | brings a whispered quest from the god to find a prism | brings your whispered quest: find a prism |
| ui/scrolls.js | 540 | where a red-robed old merchant breathes while the wizard rests | where a red-robed old merchant dozes while the wizard rests |
| ui/scrolls.js | 541 | books, runes and statues can be found available to study. A successful study of them increases some stats. In this way the wizard can be a strong archmage | the wizard finds books, runes and statues to study. Each successful study raises a skill, so the wizard can become a mighty archmage |
| ui/scrolls.js | 542 | The wizard gains faith praying and offering in your shrines. | The wizard gains faith by praying and making offerings at your shrines. |
| ui/scrolls.js | 545 **G** | If the wizard falls in a battle, there are two ways to revive and continue with the game / (promotes godliness) / (promotes atheism) | If the wizard falls in battle, he can come back in two ways / (strengthens his belief) / (weakens his belief) |
| ui/scrolls.js | 549 | under Creative Commons licenses or Public domain (included: CC0,CC-BY 3.0, CC-BY-SA 3.0) / David E. Gervais found in the following repository / based on the work rltiles | under Creative Commons licenses or in the public domain (CC0, CC-BY 3.0, CC-BY-SA 3.0) / David E. Gervais, found in this repository / based on the rltiles work |
| ui/scrolls.js | 549 | p0ss link: `users/p` ... `</a>) 0ss)` (broken link) | `https://opengameart.org/users/p0ss` as href and text, then `)` |
| ui/scrolls.js | 655 | All progress, achievement and stats | All progress, achievements and stats |
| ui/scrolls.js | 656 | , he is on level | , is on level |
| ui/scrolls.js | 657 | For kill the wizard press Kill button below, otherwise just close this scroll. | To kill the wizard, press the Kill button below; otherwise just close this scroll. |
| belief.js | 14-16 **G** | is filled with devotion for his god / believes in his god again / starts to doubt his god | is filled with devotion for you / believes in you again / starts to doubt you |
| bossEffects.js | 83 | suffers the poison | suffers from the poison |
| combat.js | 58 | releases the power and attack! | unleashes its power and attacks! |
| combat.js | 60 | releases all its fury and attack with brutality! | unleashes all its fury and attacks brutally! |
| combat.js | 62 | goes back, is scared, rammed, shouts, defends himself | backs away, looks scared, charges, shouts, raises its guard |
| combat.js | 132 | , also gained X by corruption eradication | , and X more for cleansing the corruption |
| combat.js | 140 | , and reduce the faith -X | , and faith drops -X |
| combat.js | 187 | was defeated and a big loot has been found | was defeated, leaving a great hoard |
| combat.js | 190 | was defeated and a treasure has been found | was defeated, leaving a treasure |
| combat.js | 262 **G** | recovers himself but feels abandoned by his god | gets up on his own, but feels abandoned by you |
| combat.js | 326 | has entered in a/another battle! / start a/another fight! | enters a/another battle! / starts a/another fight! |
| combat.js | 330 | has entered in a battle with a Boss! / finds a Boss! / start a fight with a Boss! | enters a battle with a boss! / finds a boss! / starts a fight with a boss! |
| combat.js | 333 | shouts: HEY GUY LOOK AT ME! | shouts: HEY, YOU! LOOK AT ME! |
| combat.js | 439 | has entered in a battle with a hydra! / start a fight with a hydra! | enters a battle with a hydra! / starts a fight with a hydra! |
| combat.js | 445 | sees how another head grows! / sees how the hydra regenerates its health points | watches another head grow! / watches the hydra regain its health |
| combat.js | 514 | cast polymorphism! | casts polymorph! |
| combat.js | 530 | performs a critic attack! | lands a critical hit! |
| combat.js | 546 | " cast " | " casts " |
| combat.js | 616 | casts heal spell and restore / cast minor healing / use restoration | casts a healing spell and restores / casts minor healing / uses restoration |
| dimension.js | 69 **G** | the god sees himself | you see yourself |
| divine.js | 126 **G** | sees the god's wrath crush the enemy / sees how the god's wrath destroy the enemy | sees divine wrath crush the enemy / watches divine wrath destroy the enemy |
| divine.js | 129 **G** | feels the god's power over the enemy | feels a divine power strike the enemy |
| divine.js | 148 **G** | refuses the help of a god he doesn't believe in | refuses help from a deity he doesn't believe in |
| divine.js | 165 | feels that someone order to offer extra gold | feels that someone wants him to offer extra gold |
| events.js | 37, 39 | Terrifying Imp (statue) | Terrifying imp |
| events.js | 45 | (Dunes statue returns) divine</i> and gains some faith (X)<i> | faith</i> (X)<i> (reads with the 554 fix below) |
| events.js | 53 | and found some coins | and finds some coins |
| events.js | 301 | sees something interesting and continues in the / advances in the | sees something interesting and goes on into the / advances through the |
| events.js | 326 | is totally recovered (X) and the mysterious guy is gone | is fully recovered (X), and the mysterious healer is gone |
| events.js | 381 | finds again the same shrine | finds the same shrine again |
| events.js | 394 | but does not enter and continues | but does not go in, and walks on |
| events.js | 433 | still is tired | is still tired |
| events.js | 441 | continues with his trip / has energies to continue | goes on with his trip / has the energy to go on |
| events.js | 536 | wants to try study the | wants to try to study the |
| events.js | 547 | learns new mystical arts from the statue scripts | learns new mystical arts from the statue's inscriptions |
| events.js | 554-555 | {learnTxt}. Increases the <i>{result}</i> / increases the <i>{result}</i> | {learnTxt} and increases his <i>{result}</i> / increases his <i>{result}</i> |
| events.js | 561 | reads the glyphs in at the base of the statue | reads the glyphs at the base of the statue |
| events.js | 567 | can not understand the glyphs in the statue | cannot understand the glyphs on the statue |
| events.js | 630 | feels the power of knowledge of the | feels the power of knowledge in the |
| events.js | 634, 636 | and increases the <i>X</i> / increases the <i>X</i> | and increases his <i>X</i> / increases his <i>X</i> |
| events.js | 648 | can not understand anything in the | cannot understand anything in the |
| events.js | 694 | enters in an inn | enters an inn |
| events.js | 696 | looks for a safe place too rest | looks for a safe place to rest |
| events.js | 734 | replenishes energies | recovers his strength |
| events.js | 739 | cannot afford pay a bed, but takes a free drink | cannot afford a bed, but gets a free drink |
| events.js | 768 | has new energies / regained his health | feels full of energy / regains his health |
| events.js | 770 | has some energies / regained some health | has a little more energy / regains some health |
| events.js | 800 | asks you for his favor | asks for your favour |
| events.js | 823 | for cherishing you | to cherish you |
| events.js | 836 | asks for his greatness | prays for greatness |
| game.js | 86 | loses hope in you and tries to restore himself | loses hope in you and tries to get up on his own |
| quests.js | 366 | he cannot find what it asks | he cannot find what it asks for |
| quests.js | 739 **G** | Pray at the shrine. The god will notice. | Pray at the shrine. Someone is listening. |
| story.js | 48 | decides to devote himself to your consecration to retribute all your help | decides to devote himself to you, to repay all your help |
| story.js | 50 | decides to devote himself to your consecration to get more divine attention | decides to devote himself to you, hoping for more of your attention |
| story.js | 52 | , and obtain a Divine crosier | , and receives a divine crosier |
| state.js | 200 | This browser would not store it. | This browser refused to store it. |
| travel.js | 206, 212 | is entering to the {zone} | is entering the {zone} |
| wizard.js | 21-32 | mastery in magic arts / polymorphism mastery / critic chance / heal chance / exploration faculties / devotion for the tithe | magic mastery / polymorph mastery / critical chance / healing chance / wanderlust / devotion to the tithe |

Checked and left as they are: away poems, dreams (except 48), quest place names and quest titles, statue names (except the imp), the Settings labels, the stats pages, bestiary and cemetery lines.

## Decisions

2026-11-25, author: "the Unseen" is the name for you where a name is needed (dreams, poems, later story text), "deity" for any other divine being, and the prophecy keeps "god of gods". The table was applied by dev the same day (rows that did not match the code word for word were left, see the CHANGELOG note).
