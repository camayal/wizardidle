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
| The staff | **One staff that changes**, made by the dead: cracked (60), seems sacred (90), shows its makers in the lava (130), carried off by the seer (149), reforged at 200 under its true name, `{staffName}`: a random name made in the first game and kept in every loop. |
| Prophecy reveal | **In pieces:** III, the red rune (128), Midas at VII; the seer gives the last line at XI. |
| Deaths in play | **Falls, not deaths:** he lies injured, almost dead (a new sprite on the ground, still to find or draw). Your touch sends the hooded healer; otherwise a rescuer (FAITH.md). Rarely nobody comes: a **true death**, and his soul waits in purgatory until the end of days. |
| True death rule | **Always possible while you can click to revive him.** Where the story takes that click away, the story protects him: the corrupt staff (VI), the scripted escape (VIII), the Last Escape scroll (X, FAITH.md), the reforged staff (XI until the final battle). |
| V vs IX | **V is a moral shock** (guilt for the harm he did). **IX is depression and questions:** why didn't you protect me? X answers it. |
| The seer | **Guards the staff in Heidan** and gives it up at XI. **She sees the loops:** in echo games she counts your rewinds. |
| The Tower at 139 | **The corrupt staff drags him there**, hungry for a king. |
| Your shrine | **He destroys it in X.** After breaking with you he walks back to the shrine he found in II and breaks it with his bare hands; the candle goes out. Animated. From then on it stays broken (and the museum shows it broken). |
| Self-crowning (XI) | **A dark irony:** by crowning himself he bends his own road and calls the curse on himself (harder XI). |
| Ending: you win | **You unmake his soul.** The game ends, a museum, then a new wizard: for a god time is nothing, so a new game is you going back in time. The cemetery shows his name **reversed and struck through**. |
| Ending: he wins | **He becomes the Omni and engulfs the universe** to make a new one. The save becomes a **black museum, blocked forever**: chapter scrolls, snapshots of each chapter's moment, stats, map. |
| Echoes | **Small echoes, only after an erasure:** a different Prologue and a few déjà vu lines. Never after a true death or the kill button. |
| Final battle | The souls of erased wizards help him, **one by one** (ERASURE.md); the museum's final snapshot shows them. |
| Length | **Short scrolls + console beats.** |
| Variable phrases | **Each scroll changes a little with the moment:** one phrase by the wizard's belief level, one by the place he is in, and one déjà vu line in echo games (see *How the variables work*). |

**Small choices made while writing** (change any freely): the wizard is "he", as the code already prints; Midas's last words.

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
| I (10) | A hooded healer carries him to a cabin he can never find again; he never sees his face |
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

The scroll font is `0.04 × objectSize`, so the scroll is about 25 em wide: roughly 40–45 characters per line of centred Munro, and 22–25 lines under the title on desktop and phones. About 110–140 words fill it without scrolling. Every scroll below stays under 100 words even with its longest variants. Line breaks mark paragraphs (`<br><br>` in code).

## How the variables work

Each scroll has a fixed text with at most three slots, filled when the scroll opens:

| Slot | Filled from | Variants |
|---|---|---|
| `{name}` | `wizardName()` | |
| `{zone}` | the current zone's display name | |
| `{shrineZone}` | the zone where he found your shrine in Chapter II (saved then, `state.story.shrineZone`) | |
| `{staffName}` | the staff's true name: a random name made once, in the first game of the world, and kept in every loop (`world.staffName`) | |
| **⟨place⟩** | the current zone's **scenery** (a new field in `src/data/zones.js`) | 6, below |
| **⟨faith⟩** | the **belief level** at that moment (FAITH.md 3.1) | Devout · Believer · Doubter · Atheist |
| **⟨echo⟩** | `world.erasures.length > 0` (ERASURE.md) | *normal* · *echo*; `{loop}` = `world.loop` |

A slot whose variant is "—" prints nothing. Faith slots are left out where the story locks faith (VII, X, XI); place slots where the place is fixed (VI Volcano, VII Tower, XI Heidan).

**Sceneries** (16 zones in 6 groups):

| Scenery | Zones |
|---|---|
| **open** | Prairie, Town |
| **wild** | Forest, Swamp |
| **cold** | Tundra |
| **hot** | Desert, Dunes, Volcano |
| **deep** | Cave, Grotto, Mine, Duenon |
| **walls** | City, Castle, Tower, Heidan |

---

## The chapters

### Prologue: The Beginning (lvl 1)
*He always starts in the City; faith is 0. No slots.*

> You heard him first.
>
> A whisper in Midas's Tower, where a hundred gods are worshipped and you are not one of them.
>
> For that whisper, his king cast him out.
>
> Now {name} walks alone, with a borrowed staff and a god he has never seen.
>
> He believes you are listening.
>
> Are you?

### Prologue, after an erasure (echo)
*Replaces the Prologue when `world.erasures.length > 0`.*

> You have heard him before.
>
> You will hear him again.
>
> A whisper in Midas's Tower. A king who will not touch him. A road beyond the gates.
>
> Time is nothing to you. To him, it is everything.
>
> Will this one win?

### Chapter I: The Exile (lvl 10)

> ⟨place⟩ has taught him what the Tower never did: hunger, fear, the weight of a staff swung in anger.
>
> He talks to you at night. Small things. The cold. The slimes. Why Midas read the sentence himself, and never once looked at him.
>
> Every time he falls, a hooded healer carries him to a cabin he can never find again.
>
> He never sees the healer's face. ⟨echo⟩
>
> ⟨faith⟩

- **⟨place⟩**
  - *open:* The open road
  - *wild:* The forest mud
  - *cold:* The frozen waste
  - *hot:* The burning sand
  - *deep:* The dark under the earth
  - *walls:* Every locked door
- **⟨echo⟩**
  - *normal:* —
  - *echo:* The healer always pauses at the door, as if he has done this before.
- **⟨faith⟩**
  - *Devout:* He thanks you anyway, every night, for things he cannot name.
  - *Believer:* He has started to wonder.
  - *Doubter:* He has started to wonder if anyone is there at all.
  - *Atheist:* He has decided that no one is. He is wrong.

### Chapter II: Devotion (lvl 30)
*Event (exists): the altar, faith ×2, the Divine crosier. Its console line already changes with the divine touches used. Art needed: your own shrine (the god's, half-forgotten), and a hooded stranger sprite that is clearly different from the ordinary hooded figures.*

> He found your shrine ⟨place⟩, in a land of a hundred gods where no one remembers your name.
>
> ⟨faith⟩ and for the first time you let him feel you. Warmth. A Divine crosier in his hands.
>
> On the road out, a hooded stranger bandaged his arm and refused his coins.
>
> "Who do you pray to?" the stranger asked. {name} told him.
>
> ⟨echo⟩

- **⟨place⟩**
  - *open:* in the long grass beside the road
  - *wild:* half-buried in moss and roots
  - *cold:* under a crust of old ice
  - *hot:* half-swallowed by the sand
  - *deep:* in a cave no torch had reached in years
  - *walls:* behind a market stall, hidden in plain sight
- **⟨faith⟩**
  - *Devout:* He knelt as if he had waited his whole life for it,
  - *Believer:* He knelt,
  - *Doubter:* He knelt, half expecting nothing,
  - *Atheist:* He almost walked past. Something made him kneel,
- **⟨echo⟩**
  - *normal:* The stranger smiled, as if he already knew.
  - *echo:* The stranger's smile slipped for a moment, as if he had heard that answer before.

**Console, lvl 40:** A hooded man watches {name} from the edge of the {zone}. · When {name} looks again, he is gone.

### Chapter III: Knowledge (lvl 50)
*Event: faith multiplier halves. (Professions plan: the second trade opens here.)*

> ⟨faith⟩
>
> He reads everything: runes, ruined books, the margins of his own exile scroll.
>
> That is where he finds it. A seers' mark in red wax beneath the king's seal, and words too small to be meant for him:
>
> *"An exile, heard by a single god…"*
>
> Seers do not sign the sentences of apprentices. ⟨echo⟩
>
> Why was he worth a prophecy?

- **⟨faith⟩**
  - *Devout:* Prayer is not enough anymore. He wants to understand you.
  - *Believer:* Prayer is not enough anymore. He wants to understand you.
  - *Doubter:* Prayer has not answered him. Perhaps books will.
  - *Atheist:* He no longer prays. He wants proof, one way or the other.
- **⟨echo⟩**
  - *normal:* —
  - *echo:* Beside the mark, in fresher ink, someone has scratched a tally: {loop} lines.

**Console, lvl 60 (event):** {name} pulls a cracked staff from a dead man's grip. · The wood is cold, and old, and humming. · The dead man is smiling.

**Console, lvl 70:** Someone left bread and bandages by {name}'s camp. · The footprints lead nowhere.

**Console, lvl 80 (event):** The cracked staff splits in {name}'s hands. · Something inside it is glowing.

### Chapter IV: The Forbidden (lvl 90)
*Event: the staff seems sacred.*

> The staff woke tonight, ⟨place⟩.
>
> Light ran through the cracks like blood through veins, and the wood healed itself in his hands. It feels sacred. ⟨faith⟩
>
> It is not yours.
>
> ⟨echo⟩
>
> {name} sleeps with it across his chest, and dreams of thrones.
>
> You watch him dream, and for the first time, you are afraid.

- **⟨place⟩**
  - *open:* under an open sky
  - *wild:* among the dripping trees
  - *cold:* in the blue cold of the night
  - *hot:* in a heat that never leaves the sand
  - *deep:* deep underground, lighting the stone like a lantern
  - *walls:* behind the walls of the {zone}
- **⟨faith⟩**
  - *Devout:* He weeps, because it feels like you.
  - *Believer:* It feels like you.
  - *Doubter:* For the first time in months, he feels close to you.
  - *Atheist:* He doesn't believe in sacred things. He holds it anyway.
- **⟨echo⟩**
  - *normal:* You search every shrine and every memory, and you cannot say whose it is.
  - *echo:* You have watched this staff wake before. Every time, you swear you will take it from him.

**Console, lvl 100 (event):** {name} masters the staff. Enemies fall faster. · Every death costs him a little faith. He doesn't seem to notice.

### Chapter V: Repentance (lvl 110)
*Event: damage bonus and faith loss removed; faith rises again, less than in II. A moral shock.*

> He woke among the dead of a pilgrim camp, the staff warm in his hand.
>
> He does not remember the fight. He remembers the silence after it.
>
> He buried every one of them ⟨place⟩, and prayed to their gods, not to you. ⟨faith⟩
>
> The hooded stranger watched him dig. ⟨echo⟩
>
> "Guilt is a kind of prayer," he said. "Who are you praying to now?"
>
> That night, the staff whispered back.

- **⟨place⟩**
  - *open:* in the soft earth beside the road
  - *wild:* in the black mud
  - *cold:* in frozen ground, with bleeding hands
  - *hot:* in sand that would not stay
  - *deep:* under stones, in the dark
  - *walls:* outside the walls, where no one would see
- **⟨faith⟩**
  - *Devout:* He has no right to your forgiveness, he says. Only theirs.
  - *Believer:* He has no right to your forgiveness, he says. Only theirs.
  - *Doubter:* Your forgiveness would mean nothing now. He wants theirs.
  - *Atheist:* There is no one to forgive him, he says. Only them, and they are dead.
- **⟨echo⟩**
  - *normal:* —
  - *echo:* He knew exactly where to stand, as if he had stood there before.

**Console, lvl 120:** {name} sees the hooded stranger kneeling at a shrine. · Who does he pray to?

**Console, lvl 128 (event, red rune):** {name} finds a red rune in the ash. · Words are burned into it: *"…shall strike a god down…"* · On the back, a map: a mountain made of fire.

**Console, lvl 129 (event, volcano):** The rune burns in his palm and drags him into the Volcano. · He can't leave until the mountain gives back what it hid.

### Chapter VI: Corruption (lvl 130)
*Event: ×2–3 damage, no altars, faith only falls from here; when he falls, the staff raises him. Always the Volcano: no place slot.*

> At the heart of the Volcano, he held the staff over the lava and let it drink.
>
> In the fire, the staff remembered who made it. Not you. The dead had been patient.
>
> It came out black and red, and it no longer asked for faith. It took it.
>
> ⟨faith⟩ When he falls, the staff drags him up again.
>
> *…shall strike a god down.*
>
> ⟨echo⟩

- **⟨faith⟩** (how far he falls)
  - *Devout:* He walked out still whispering your name, out of habit. By the next shrine, he had stopped.
  - *Believer:* He doesn't kneel at your shrines anymore.
  - *Doubter:* He stopped kneeling long ago. Now he doesn't even look at your shrines.
  - *Atheist:* He had stopped believing in you long ago. He had not expected to stop needing you.
- **⟨echo⟩**
  - *normal:* Which god?
  - *echo:* Which god? This time, you almost say it out loud.

**Console, lvl 139 (event, tower):** The staff pulls {name} through ash and stone. · He stands in Midas's Tower. The doors seal. · The staff is hungry for a king. · Sorceresses see his face and flee, whispering a verse.

### Chapter VII: The Ascent (lvl 140)
*Event: Midas is dead and gone for good (he never returns; the Tower has no boss from now on). No mages in the City or the Tower until the lynching. Always the Tower; faith is falling: echo slot only.*

> Midas fell on the steps of his own throne. ⟨echo⟩
>
> "I never touched you," the king whispered. "I only sent you away. I would not be the crown that fed you to the dead."
>
> He laughed, and blood ran into his beard. "The seers said *bends his road*. Exile is a road too."
>
> The curse had come home, in the shape of the boy he spared.
>
> The mages are fleeing the Tower. {name} sits below an empty throne, wondering what else they hid.

- **⟨echo⟩**
  - *normal:* —
  - *echo:* "I dream of these steps," he said. "Every time."

### Chapter VIII, Part I: Overthrow (lvl 149)
*Event: the lynching, wherever he is. The seer's curse (no healing), only battles, no loot. After it the mages return: the Tower is full of mages again.*

> They came at dawn, ⟨place⟩: every mage who fled the Tower, and a sorceress with a seer's red eyes.
>
> "I wrote your prophecy," she said. "I will not watch it come true." ⟨echo⟩
>
> Her curse sealed his wounds. No spell will heal him now.
>
> ⟨faith⟩
>
> Far behind the crowd, a hooded figure watches, hands folded, and does not move.

- **⟨place⟩**
  - *open:* across the open grass
  - *wild:* through the trees
  - *cold:* over the snow
  - *hot:* out of the heat haze
  - *deep:* down every tunnel at once
  - *walls:* through every gate
- **⟨echo⟩**
  - *normal:* —
  - *echo:* Then she looked past him, at you. "Again? How many times, god?"
- **⟨faith⟩**
  - *Devout:* He calls your name between every blow.
  - *Believer:* He calls your name between every blow.
  - *Doubter:* He hasn't called your name in months. He calls it now, between every blow.
  - *Atheist:* He swore he would never call your name again. He calls it between every blow.

### Chapter VIII, Part II: The Escape (on death during the lynching)
*Event: up to lvl 150; the seer carries the staff away; achievement "lynched".*

> They tore the staff from his hands, and the seer carried it away.
>
> He crawled ⟨place⟩ at nightfall, alive, and remembered one thing: the folded hands of a hooded man who never moved.
>
> You could have stopped them. A word. A touch.
>
> But a broken man might never strike a god, and you were ready to catch him at the edge.
>
> You told yourself it was mercy.
>
> ⟨echo⟩

- **⟨place⟩**
  - *open:* out of the trampled grass
  - *wild:* out of the mud
  - *cold:* out of the red snow
  - *hot:* out of the sand
  - *deep:* out of the dark
  - *walls:* out of the gutter
- **⟨echo⟩**
  - *normal:* It was a gamble.
  - *echo:* It was a gamble. You have lost it before.

**Console, lvl 150–159 (at shrines):** {name} prays at the shrine. Nothing answers.

### Chapter IX: Vindication (lvl 160)
*Event: gains faith again, everything back to normal. Depression and questions.*

> He has stopped fighting the way he used to. He walks, he falls, he gets up. ⟨place⟩
>
> ⟨faith⟩
>
> The hooded healer has not left his side since the lynching. He cleans the wounds, shares his bread, says little.
>
> {name} calls him friend. The first since the Tower.
>
> ⟨echo⟩
>
> But he has started to look at the healer's hands.

- **⟨place⟩**
  - *open:* Every road looks the same now.
  - *wild:* The forest no longer frightens him. Nothing does.
  - *cold:* He no longer feels the cold.
  - *hot:* He no longer feels the heat.
  - *deep:* He stays in the dark for days.
  - *walls:* He walks the streets and no one sees him.
- **⟨faith⟩**
  - *Devout:* At night he asks you one thing, again and again: why didn't you protect me?
  - *Believer:* At night he asks you one thing, again and again: why didn't you protect me?
  - *Doubter:* At night he asks the dark, in case you are in it: why didn't you protect me?
  - *Atheist:* He doesn't pray. But at night, without meaning to, he asks: why didn't you protect me?
- **⟨echo⟩**
  - *normal:* You let him believe.
  - *echo:* You let him believe. You always do.

**Console, lvl 170:** The healer hums a hymn while he works. · It's one of yours. {name} never taught it to him.

### Chapter X: Disobedience (lvl 190)
*Event: faith locked at Atheist (FAITH.md 3.8): refuses all help, no altars, more bosses. He carries the Last Escape scroll (FAITH.md 3.7): at 0 HP it tears him away and heals him, and each use burns it a little. Faith is locked: echo slot only.*

> He knew those hands.
>
> Folded, behind the crowd, while the seer cursed him and he called your name.
>
> His question had an answer after all.
>
> The healer was gone by morning. ⟨echo⟩
>
> In the silence you left, a voice from below found him: "We would never have watched."
>
> He has stopped asking whether you are listening. He hopes you are.

- **⟨echo⟩**
  - *normal:* So was his prayer.
  - *echo:* So was his prayer. You have watched it go before. It does not get easier.

**Console, lvl 190 (event, the broken shrine), step by step:** {name} leaves the road. He knows where he is going. · He walks back to the {shrineZone}, to the shrine where he first felt you. · It is still there. The candle is still lit. · He breaks the cross with his bare hands. Cracks run through the stone, and it bursts apart. *(the shattering animation)* · The candle gutters and goes out. A thin smoke rises. · Somewhere, you feel it.

**Echo (console, as the candle goes out):** You have watched this candle go out before.

**Console, lvl 190 (event, the Last Escape, right after the shrine):** {name} writes one last scroll, for himself alone. · No god will carry him now. He will carry himself.

**Console, Last Escape used:** The scroll tears {name} out of the fight and closes his wounds. · A new burn spreads across its edge.

**Console, lvl 199 (event, Heidan):** {name} learns where the seer took his staff: Heidan. · He walks to Heidan. He will not leave without it.

### Chapter XI: The Return of the King (lvl 200)
*Event: the Last Escape scroll burns to ash as he takes the staff; from now on {staffName} raises him when he falls (no true death until the final battle). ×2–3 damage, faith icon gone, XP bar full and dark red, more bosses and the Megaboss (the curse), the healer can appear. Always Heidan, faith locked: echo slot only.*

> The seer was waiting in Heidan, the staff across her knees.
>
> "I wrote you," she said. "I cannot unwrite you. ⟨echo⟩" She told him its true name: {staffName}. He had heard it before, in the voice from below.
>
> He reforged it in his own blood and set a crown of ash on his head.
>
> "Take the crown and you take the curse," she warned. He put it on anyway.
>
> *…and rise as the Omni.*
>
> He is coming for you.

- **⟨echo⟩**
  - *normal:* —
  - *echo:* Believe me, god, I have tried.

---

## Falls and deaths (console)

| Moment | Lines |
|---|---|
| He falls (any time) | {name} falls, broken, somewhere in the {zone}. |
| Your touch | A hooded healer lifts him and carries him away. *(then the cabin event, as today)* |
| A rescuer comes | One line per rescuer, in FAITH.md (caravan, shaman, gravedigger, ghost, potion, alone). |
| He falls in VI | The staff drags {name} up before he touches the ground. |
| He falls in X | The Last Escape scroll (see Chapter X). |
| He falls in XI | {staffName} drags {name} up, burning. · He does not thank it. |

### True death (rare: nobody comes)
*Only where you could have revived him: never in VI, VIII, X or XI (see the true death rule). Skull sprite, cemetery record with the cause, back to the name screen (FAITH.md). A regular cemetery death, not an erasure: no echo slot.*

> No one came.
>
> ⟨faith⟩
>
> {name} lies still in the {zone}, at the edge of the gray, where souls wait until the end of days.
>
> For you, god, time is nothing.
>
> For the world, it is everything.
>
> Somewhere, another apprentice is already whispering.

- **⟨faith⟩**
  - *Devout:* He called your name until the end. No caravan came, no shaman, not you.
  - *Believer:* Not the caravans, not the shamans, not you.
  - *Doubter:* He wondered, at the end, whether you had ever been there at all.
  - *Atheist:* He had stopped waiting for gods long ago. Tonight, not even the world came.

## The final battle (console)

- **The healer appears:** A hooded healer blocks the road. · "You don't have to do this," says a voice {name} knows.
- **A soul enters** (one by one, one per erasure, up to 5; ERASURE.md): The air cracks. A translucent wizard steps beside {name}. · {reversedName}. You erased him once. · He remembers.
- **The healer falls (the reveal):** The healer's hood catches fire. · White-gold flame climbs his cape and burns it away. · When the light fades, your face looks back at {name}. · Golden rays break behind you. Your wings open.
- **Phase 2, the wings burn:** Your wings catch fire. Light drips from them like smoke.
- **Phase 3, no wings:** The last of your wings falls away in ash. · Only you are left, and him.
- **Each round:** the wizard attacks, the souls attack, then you choose: heal or hit.

### Epilogue: The Unmaking (if you win)
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
> ⟨echo⟩

- **⟨echo⟩** (counts the erasure that just happened)
  - *first erasure:* But time is nothing to you. You could hear him again.
  - *later erasures:* But time is nothing to you. You have unmade {loop} of them. You could hear him again.

### Epilogue: The Last Light (if he wins)
*Then the black museum, blocked forever: outside a scroll, the scene and the console are one black mass.*

> The hand that prayed has struck its god down.
>
> He rose as the Omni, and the dead came to collect him. He swallowed them. Then the gods. Then the Tower, the meadow, the stars, the last of the light. ⟨echo⟩
>
> Nothing is left but him, and a universe waiting to be made.
>
> Your story ends here.
>
> His is just beginning.

- **⟨echo⟩**
  - *normal:* —
  - *echo:* Beside him stood every wizard you ever unmade.

---

## Notes for the code (stage 3)

- **Fix the chapter keys:** `lvl60`/`lvl90` appear twice (the second pair is IX and X: `lvl160`, `lvl190`), `lvl99` → `lvl199`, `lv200` → `lvl200`. Already recorded in the roadmap.
- **Scroll slots:** each chapter's `text` becomes a template with `⟨place⟩`, `⟨faith⟩` and `⟨echo⟩` keys and a small table of variants, filled by one function when the scroll opens (`{name}`, `{zone}`, `{loop}` too). Zones get a `scenery` field (open, wild, cold, hot, deep, walls); faith uses the belief level from FAITH.md 3.1.
- **Snapshot the filled text:** the museum shows each scroll as it was read, so store the filled text (not the template) with the chapter's snapshot.
- **Console beats** (40, 60, 70, 80, 100, 120, 128, 129, 139, 150–159, 170, 190, 199) go in a separate `beats` table keyed by level, so chapters stay readable.
- **Echo slots** read `world.erasures.length > 0` and `world.loop` (ERASURE.md). Never triggered by a true death or the kill button.
- **Falls:** the skull (`img/muerto.png`) is kept for a true death; a fall needs a new sprite of the wizard lying injured.
- **Snapshots for the museums:** at each chapter save a small record (zone, background, NPC, level, key stats, the filled scroll text), not an image, so the save stays small. The final battle's snapshot includes the souls.
- **Two epilogues:** `specialEnd` becomes `endGodWins` (museum, then a new wizard) and `endOmni` (black museum, the app blocked forever).
- **Midas is gone forever after VII:** zone bosses keep returning in play, but Midas never appears again once he dies in the Tower; the Tower has no boss, and his golden-ray heal exists only before VII (ideas.md, "Bosses return, except Midas").
- **The Tower's people:** no mages in the City or the Tower from VII until the lynching (149); after it the Tower is full of mages again.
- **The staff's name:** `world.staffName`, a random name generated in the first game and kept across every loop and new wizard.
- **The art (chosen by the author):** the stranger is today's healer in a snug hood of his cape greens; the reveal burns hood and cape in holy fire into the true form (white and gold, halo, rays). Final battle in three phases: great wings of light, wings burning, no wings with charred remnants. The shrine breaks as D3, shattered (cracks, a burst of stone, a stub on the base, the candle out); the broken state stays.
- **The broken shrine (X):** save the zone of the Chapter II shrine; at 190, after the scroll, he travels there (like the Volcano and Tower pulls), the shrine is shown lit, the destruction animation plays, then the Last Escape event. Afterwards the shrine is drawn broken, candle out, wherever it appears (later visits, the museum).
- **Art for the story:** the god's own shrine (II), its destruction animation and its broken state (X); a hooded stranger sprite distinct from the ordinary hooded figures (II onward); the wizard lying injured (falls).
- **Dropped from 2018:** drinking Midas's essence so the god can't revive him (the falls model replaces it); Midas becoming the Tower's boss.
- **Scroll format:** title in `.titles`, the subtitle under it, short `<br><br>` paragraphs; the last line can use `.subtitles` (dark red, bold).
