# The story: script per chapter

Stage 3 of the roadmap. This is the text for every chapter scroll, the console lines between chapters, the deaths and the two endings, revised from the author's 2018 arc (`wizardidle-old-ideas/historiaperlevel.txt`, summarised in [ideas.md](../ideas.md)). It is a script, not code: `src/story.js` still holds only the Prologue, I and II. The final battle's mechanics (souls of erased wizards, the rewind) are planned in [ERASURE.md](ERASURE.md); faith, rescuers and true death in [FAITH.md](FAITH.md).

## Decisions

Decided by the author on 2026-11-12, one question at a time.

| Question | Decision |
|---|---|
| Voice | **The scroll speaks to you, the god.** The player *is* the wizard's god (divine touch, faith), so when he turns on "you" it lands on the player. |
| Arc | **Free to revise**; the 2018 beats are inspiration. |
| Hooks | **A secret behind the exile, a recurring stranger, a cliffhanger last line.** |
| The world | **Hyperpolytheist:** a hundred gods. Midas has his own; the wizard prays to you, the "wrong god". |
| The secret | **A prophecy:** an exile heard by a single god will strike a god down and rise as **the Omni, god of gods**. The dead hunger for his soul, but **only a crown can feed them**, and the crown that bends his road is cursed forever. |
| Why exile, not death | **Midas wanted no part in it:** killing him would feed the dead and bring the curse. He exiled him and never touched him. |
| Midas's fate | **The curse found him:** exile counted as bending his road. The boy he spared kills him (VII). |
| The stranger | **Your mask:** the hooded healer (already in the game: the divine revive leads to his cabin) is you, the god. |
| Your motive | **He is your believer, and you believe prophecies can change.** |
| The lynching | **A gamble to change fate:** you held back on purpose, betting a broken man would never strike a god, ready to catch him at the edge. |
| The afterlife gods | **They court him:** they planted the staff, and after the lynching they whisper, "We would never have watched." |
| The staff | **One staff that changes**, made by the dead: cracked (60), seems sacred (90), shows its makers in the lava (130), carried off by the seer (149), reforged as *Nomaleatorio* (200). |
| Prophecy reveal | **In pieces:** III, the red rune (128), Midas at VII; the seer gives the last line at XI. |
| Deaths in play | **Falls, not deaths:** he lies injured, almost dead (a new sprite on the ground; the planner is looking for one). Your touch sends the hooded healer; otherwise a rescuer (FAITH.md). Rarely nobody comes: a **true death**, and his soul waits in purgatory until the end of days. |
| True death rule | **Always possible while you can click to revive him.** Where the story takes that click away, the story protects him: the corrupt staff (VI), the scripted escape (VIII), the Last Escape scroll (X, FAITH.md), the reforged staff (XI until the final battle). |
| V vs IX | **V is a moral shock** (guilt for the harm he did). **IX is depression and questions:** why didn't you protect me? X answers it. |
| The seer | **Guards the staff in Heidan** and gives it up at XI. **She sees the loops:** in echo games she counts your rewinds. |
| The Tower at 139 | **The corrupt staff drags him there**, hungry for a king. |
| Self-crowning (XI) | **A dark irony:** by crowning himself he bends his own road and calls the curse on himself (harder XI). |
| Ending: you win | **You unmake his soul.** The game ends, a museum, then a new wizard: for a god time is nothing, so a new game is you going back in time. The cemetery shows his name **reversed and struck through**. |
| Ending: he wins | **He becomes the Omni and engulfs the universe** to make a new one. The save becomes a **black museum, blocked forever**: chapter scrolls, snapshots of each chapter's moment, stats, map. |
| Echoes | **Small echoes, only after an erasure:** a different Prologue and a few déjà vu lines. Never after a true death or the kill button. |
| Final battle | The souls of erased wizards help him, **one by one** (ERASURE.md); the museum's final snapshot shows them. |
| Length | **Short scrolls + console beats.** |

**Small choices made while writing** (change any freely): the wizard is "he", as the code already prints; Midas's last words; the staff's name *Nomaleatorio* ("not random") and the line playing on it.

## The prophecy

> An exile, heard by a single god,
> shall strike a god down
> and rise as the Omni, god of gods.
> The dead will hunger for his soul,
> but only a crown can feed them.
> And the crown that bends his road
> shall be hunted by chaos and misfortune, without end.

| Where | What the player learns |
|---|---|
| I (10) | Midas read the sentence himself and never looked at him |
| III (50) | On the exile scroll: *"An exile, heard by a single god…"* |
| 128 | The red rune: *"…shall strike a god down…"* |
| 139 | Sorceresses flee from his face, whispering a verse |
| VII (140) | Midas: the crown that feeds the dead, the road that was bent |
| XI (200) | The seer: *"…and rise as the Omni."* |
| Museum | The whole verse |

## The stranger (you)

| Where | Sighting |
|---|---|
| I (10) | A hooded healer carries him to a cabin he can never find again |
| II (30) | Bandages his arm, smiles as if he already knew your name |
| 40, 70 | Watches from the forest; leaves bread and bandages |
| V (110) | "Guilt is a kind of prayer. Who are you praying to now?" |
| 120 | Kneels at a shrine. Who does he pray to? |
| VIII (149) | Watches the lynching, hands folded, and does not move |
| IX (160) | Never leaves his side; becomes his friend |
| 170 | Hums one of your hymns |
| X (190) | The wizard recognises his hands |
| Final battle | Blocks the road; the hood falls; your face |

## Fitting the screen

The scroll font is `0.04 × objectSize`, so the scroll is about 25 em wide: roughly 40–45 characters per line of centred Munro, and 22–25 lines under the title on desktop and phones. About 110–140 words fill it without scrolling; every scroll below is shorter. Line breaks mark paragraphs (`<br><br>` in code); `{name}` is `wizardName()`; *(echo)* lines show only when `world.erasures.length > 0`.

---

## The chapters

### Prologue: The Beginning (lvl 1)

> You heard him first.
>
> A whisper in the Tower of Midas, where a hundred gods are worshipped and you are not one of them.
>
> For that whisper, his king cast him out.
>
> Now {name} walks alone, with a borrowed staff and a god he has never seen.
>
> He believes you are listening.
>
> Are you?

### Prologue, after an erasure (echo)

> You have heard him before.
>
> You will hear him again.
>
> A whisper in the Tower of Midas. A king who will not touch him. A road beyond the gates.
>
> Time is nothing to you. To him, it is everything.
>
> Will this one win?

### Chapter I: The Exile (lvl 10)

> The meadow has taught him what the Tower never did: hunger, fear, the weight of a staff swung in anger.
>
> He talks to you at night. Small things. The cold. The wolves. Why Midas read the sentence himself, and never once looked at him.
>
> Every time he falls, a hooded healer carries him to a cabin he can never find again.
>
> He doesn't know it's you.
>
> He has started to wonder.

**Echo (console, first divine revive):** The hooded healer pauses at the door, as if he had done this before.

### Chapter II: Devotion (lvl 30)
*Event (exists): the altar, faith ×2, the Divine crosier.*

> He found your shrine half-buried in moss, in a land of a hundred gods where no one remembers your name.
>
> He knelt, and for the first time you let him feel you. Warmth. A Divine crosier in his hands.
>
> On the road out, a hooded stranger bandaged his arm and refused his coins.
>
> "Who do you pray to?" the stranger asked. {name} told him.
>
> The stranger smiled, as if he already knew.

**Console, lvl 40:** A hooded man watches {name} from the edge of the forest. · When {name} looks again, he is gone.

### Chapter III: Knowledge (lvl 50)
*Event: faith multiplier halves. (Professions plan: the second trade opens here.)*

> Prayer is not enough anymore. He wants to understand you.
>
> He reads everything: runes, ruined books, the margins of his own exile scroll.
>
> That is where he finds it. A seers' mark in red wax beneath the king's seal, and words too small to be meant for him:
>
> *"An exile, heard by a single god…"*
>
> Seers do not sign the sentences of apprentices.
>
> Why was he worth a prophecy?

**Console, lvl 60 (event):** {name} pulls a cracked staff from a dead man's grip. · The wood is cold, and old, and humming. · The dead man is smiling.

**Console, lvl 70:** Someone left bread and bandages by {name}'s camp. · The footprints lead nowhere.

**Console, lvl 80 (event):** The cracked staff splits in {name}'s hands. · Something inside it is glowing.

### Chapter IV: The Forbidden (lvl 90)
*Event: the staff seems sacred.*

> The staff woke tonight.
>
> Light ran through the cracks like blood through veins, and the wood healed itself in his hands. It feels sacred. It feels like you.
>
> It is not yours.
>
> You search every shrine and every memory, and you cannot say whose it is.
>
> {name} sleeps with it across his chest, and dreams of thrones.
>
> You watch him dream, and for the first time, you are afraid.

**Console, lvl 100 (event):** {name} masters the staff. Enemies fall faster. · Every death costs him a little faith. He doesn't seem to notice.

### Chapter V: Repentance (lvl 110)
*Event: damage bonus and faith loss removed; faith rises again, less than in II. A moral shock.*

> Today he killed a creature that was only guarding its young.
>
> He saw it too late. The staff hummed with pleasure.
>
> He buried every one he had killed that week, and said their names, not yours. He has no right to your forgiveness, he says. Only theirs.
>
> The hooded stranger watched him dig.
>
> "Guilt is a kind of prayer," he said. "Who are you praying to now?"
>
> That night, the staff whispered back.

**Console, lvl 120:** {name} sees the hooded stranger kneeling at a shrine. · Who does he pray to?

**Console, lvl 128 (event, red rune):** {name} finds a red rune in the ash. · Words are burned into it: *"…shall strike a god down…"* · On the back, a map: a mountain made of fire.

**Console, lvl 129 (event, volcano):** The rune burns in his palm and drags him into the Volcano. · He can't leave until the mountain gives back what it hid.

### Chapter VI: Corruption (lvl 130)
*Event: ×2–3 damage, no altars, faith only falls; when he falls, the staff raises him.*

> At the heart of the Volcano, he held the staff over the lava and let it drink.
>
> In the fire, the staff remembered who made it. Not you. The dead had been patient.
>
> It came out black and red, and it no longer asked for faith. It took it.
>
> He doesn't kneel at your shrines anymore. When he falls, the staff drags him up again.
>
> *…shall strike a god down.*
>
> Which god?

**Console, lvl 139 (event, tower):** The staff pulls {name} through ash and stone. · He stands in the Tower of Midas. The doors seal. · The staff is hungry for a king. · Sorceresses see his face and flee, whispering a verse.

### Chapter VII: The Ascent (lvl 140)
*Event: Midas is dead; no mages in the City or the Tower.*

> Midas fell on the steps of his own throne.
>
> "I never touched you," the king whispered. "I only sent you away. I would not be the crown that fed you to the dead."
>
> He laughed, and blood ran into his beard. "The seers said *bends his road*. Exile is a road too."
>
> The curse had come home, in the shape of the boy he spared.
>
> The mages are leaving the Tower. {name} sits below an empty throne, and wonders what else they hid from him.

**Echo (console, when Midas appears):** Midas frowns at {name}, as if trying to remember a dream.

### Chapter VIII, Part I: Overthrow (lvl 149)
*Event: the lynching. The seer's curse (no healing), only battles, no loot.*

> They came at dawn: every mage who fled the Tower, and a sorceress with a seer's red eyes.
>
> "I wrote your prophecy," she said. "I will not watch it come true."
>
> Her curse sealed his wounds. No spell will heal him now.
>
> He calls your name between every blow.
>
> Far behind the crowd, a hooded figure watches, hands folded, and does not move.

**Echo (console, as the lynching starts):** The seer stares at him a long moment. · "Again," she whispers. "How many times, god?" · *(if `world.loop` > 1: "This is the {loop}th.")*

### Chapter VIII, Part II: The Escape (on death during the lynching)
*Event: up to lvl 150; the seer carries the staff away; achievement "lynched".*

> They tore the staff from his hands, and the seer carried it away.
>
> He crawled out of the mud at nightfall, alive, and remembered one thing: the folded hands of a hooded man who never moved.
>
> You could have stopped them. A word. A touch.
>
> But a broken man might never strike a god, and you were ready to catch him at the edge.
>
> You told yourself it was mercy.
>
> It was a gamble.

**Console, lvl 150–159 (at shrines):** {name} prays at the shrine. Nothing answers.

### Chapter IX: Vindication (lvl 160)
*Event: gains faith again, everything back to normal. Depression and questions.*

> He has stopped fighting the way he used to. He walks, he falls, he gets up.
>
> At night he asks you one thing, again and again: why didn't you protect me?
>
> The hooded healer has not left his side since the mud. He cleans the wounds, shares his bread, says little.
>
> {name} calls him friend. The first since the Tower.
>
> You let him believe.
>
> But he has started to look at the healer's hands.

**Console, lvl 170:** The healer hums a hymn while he works. · It's one of yours. {name} never taught it to him.

### Chapter X: Disobedience (lvl 190)
*Event: refuses all help, no altars, no faith, more bosses. He carries the Last Escape scroll (FAITH.md): at 0 HP it tears him away and heals him, and each use burns it a little.*

> He knew those hands.
>
> Folded, behind the crowd, while the seer cursed him and he called your name.
>
> His question had an answer after all.
>
> The healer was gone by morning. So was his prayer.
>
> In the silence you left, a voice from below found him: "We would never have watched."
>
> He has stopped asking whether you are listening. He hopes you are.

**Console, lvl 190 (event, the Last Escape):** {name} writes one last scroll, for himself alone. · No god will carry him now. He will carry himself.

**Console, Last Escape used:** The scroll tears {name} out of the fight and closes his wounds. · A new burn spreads across its edge.

**Console, lvl 199 (event, Heidan):** {name} learns where the seer took his staff: Heidan. · He walks to Heidan. He will not leave without it.

### Chapter XI: The Return of the King (lvl 200)
*Event: the Last Escape scroll burns to ash as he takes the staff; from now on Nomaleatorio raises him when he falls (no true death until the final battle). ×2–3 damage, faith icon gone, XP bar full and dark red, more bosses and the Megaboss (the curse), the healer can appear.*

> The seer was waiting in Heidan, the staff across her knees.
>
> "I wrote you," she said. "I cannot unwrite you." She told him its true name: Nomaleatorio. Nothing about this was ever random.
>
> He reforged it in his own blood and set a crown of ash on his head.
>
> "Take the crown and you take the curse," she warned. He put it on anyway.
>
> *…and rise as the Omni.*
>
> He is coming for you.

---

## Falls and deaths (console)

| Moment | Lines |
|---|---|
| He falls (any time) | {name} falls, broken, at the edge of the gray. |
| Your touch | A hooded healer lifts him and carries him away. *(then the cabin event, as today)* |
| A rescuer comes | One line per rescuer, in FAITH.md (caravan, shaman, gravedigger, ghost, potion, alone). |
| He falls in VI | The staff drags {name} up before he touches the ground. |
| He falls in X | The Last Escape scroll (see Chapter X). |
| He falls in XI | Nomaleatorio drags {name} up, burning. · He does not thank it. |

### True death (rare: nobody comes)
*Only where you could have revived him: never in VI, VIII, X or XI (see the rule above). Skull sprite, cemetery record with the cause, back to the name screen (FAITH.md / ideas.md "a wizard can really die"). Not an erasure: no echoes.*

> No one came.
>
> Not the caravans, not the shamans, not you.
>
> {name} lies still at the edge of the gray, where souls wait until the end of days.
>
> For you, god, time is nothing.
>
> For the world, it is everything.
>
> Somewhere, another apprentice is already whispering.

## The final battle (console)

- **The healer appears:** A hooded healer blocks the road. · "You don't have to do this," says a voice {name} knows.
- **A soul enters** (one by one, one per erasure, up to 5; ERASURE.md): The air cracks. A translucent wizard steps beside {name}. · {reversedName}. You erased him once. · He remembers.
- **The healer falls:** The hood falls. Beneath it, your face. · The sky tears open. You step down to meet him.
- **Each round:** the wizard attacks, the souls attack, then you choose: heal or hit.

### Epilogue: if you win

*Then the museum (scrolls, snapshots, stats, map), the cemetery shows his name reversed and struck through, and a new wizard can begin: the echo game.*

> He fell at your feet, still holding the staff.
>
> Below, the dead reached for him. You were faster. You always were.
>
> You took his soul in your own hands, and unmade it.
>
> The prophecy is broken. You were right.
>
> No one prays to you now.
>
> But time is nothing to you. You could hear him again.

### Epilogue: if he wins

*Then the black museum, blocked forever: outside a scroll, the scene and the console are one black mass.*

> The hand that prayed has struck its god down.
>
> He rose as the Omni, and the dead came to collect him. He swallowed them. Then the gods. Then the Tower, the meadow, the stars, the last of the light.
>
> Nothing is left but him, and a universe waiting to be made.
>
> Your story ends here.
>
> His is just beginning.

---

## Notes for the code (stage 3)

- **Fix the chapter keys:** `lvl60`/`lvl90` appear twice (the second pair is IX and X: `lvl160`, `lvl190`), `lvl99` → `lvl199`, `lv200` → `lvl200`. Already recorded in the roadmap.
- **Console beats** (40, 60, 70, 80, 100, 120, 128, 129, 139, 150–159, 170, 199) go in a separate `beats` table keyed by level, so chapters stay readable.
- **Echo lines** read `world.erasures.length > 0` and `world.loop` (ERASURE.md). Never shown after a true death or the kill button.
- **Falls:** the skull (`img/muerto.png`) is kept for a true death; a fall needs a sprite of the wizard lying injured (asked of the planner).
- **Snapshots for the museums:** at each chapter save a small record (zone, background, NPC, level, key stats), not an image, so the save stays small. The final battle's snapshot includes the souls.
- **Two epilogues:** `specialEnd` becomes `endGodWins` (museum, then a new wizard) and `endOmni` (black museum, the app blocked forever).
- **Dropped from 2018:** drinking Midas's essence so the god can't revive him (the falls model replaces it); Midas becoming the Tower's boss.
- **Scroll format:** title in `.titles`, the subtitle under it, short `<br><br>` paragraphs; the last line can use `.subtitles` (dark red, bold).
