# The story: script per chapter

Stage 3 of the roadmap. This is the text for every chapter scroll and the console lines between chapters, revised from the author's 2018 arc (`wizardidle-old-ideas/historiaperlevel.txt`, summarised in [ideas.md](../ideas.md)). It is a script, not code: `src/story.js` still holds only the Prologue, I and II.

## Decisions

Decided by the author on 2026-11-12, one question at a time.

| Question | Decision | What it means for the text |
|---|---|---|
| Voice | **The scroll speaks to you, the god** | Second person. The player *is* the wizard's god (divine touch, faith), so when he turns on "you" it lands on the player. |
| Arc | **Free to revise** | The 2018 beats are inspiration; the structure below reworks them. |
| Hooks | **A secret behind the exile, a recurring stranger, a cliffhanger last line** | Every scroll ends on an open question or a threat. |
| The secret | **A prophecy** | The seers foretold that an exile would kill a god. Midas exiled him instead of killing him, hoping exile would make him small. |
| The stranger | **Your mask** | A hooded healer who keeps crossing his path is the god (the player) walking among mortals. |
| Ending | **Two endings, by who dies** | The final heal-or-hit buttons decide: one epilogue if the wizard falls, another if the god falls. |
| Length | **Short scrolls + console beats** | About 40–80 words per scroll, plus 1–2 console lines at the events between chapters. |
| Staffs | **One staff that changes** | One relic for the whole game: cracked (60) → sacred (90) → corrupt (130) → torn away (149) → reforged as *Nomaleatorio* (200). Replaces the four separate staffs of 2018. |
| Prophecy reveal | **In pieces, complete at VII** | A fragment in III, another on the red rune (128), sorceresses flee (139), dying Midas says it (VII); the full verse closes XI. |
| IX → X | **He finds out who watched** | IX: the hooded healer nurses him back to faith. X: he recognises the hands that didn't move at the lynching. |
| God's motive | **You fear the prophecy** | You keep him devoted so he never turns, and let the mob break him when he grows too strong. That abandonment is what makes him your killer. |

**Small choices made while writing** (change any of them freely):
- The rare sorceress who leads the lynching (`la_hechicera7`) is **the seer who wrote the prophecy**.
- The reforged staff takes the old name ***Nomaleatorio*** ("not random"), and the text plays on it.
- Midas misread the prophecy: the Tower calls him divine, so he thought *he* was the god.
- The wizard is "he", as the existing code already prints.
- Titles keep the 2018 ones where they existed; I is *The Exile*, III is *Knowledge*.

## The prophecy

Revealed in pieces. Only the last chapter shows it whole.

> The king shall cast him out.
> A god alone will hear him.
> And the hand that prayed
> shall strike the one who answered.

| Where | What the player learns |
|---|---|
| I (10) | Midas read the sentence himself, which kings never do |
| III (50) | A seers' mark on his exile scroll: *"A god alone will hear him."* |
| 128 | The red rune: *"…the hand that prayed shall strike…"* |
| 139 | Sorceresses see his face and flee, whispering a verse |
| VII (140) | Dying Midas: *"They said you would kill a god."* |
| XI (200) | The full verse: *"…the one who answered."* (you) |

## The stranger

| Where | Sighting |
|---|---|
| II (30) | A hooded stranger bandages his arm and smiles as if he already knew your name |
| 40 | Watches from the edge of the forest |
| 70 | Leaves bread and bandages at his camp |
| V (110) | *"You pray well. Does anyone ever answer?"* |
| 120 | Kneels at a shrine. Who does he pray to? |
| VIII (149) | Watches the lynching from behind the crowd and doesn't move |
| IX (160) | Stays at his side as a healer and friend |
| 170 | Hums a hymn of yours that the wizard never taught him |
| X (190) | The wizard recognises his hands |
| Finale | The healer blocks the road; the hood falls; your face |

## Fitting the screen

The scroll font is `0.04 × objectSize`, so the scroll is about 25 em wide: roughly 40–45 characters per line of centred Munro, and 22–25 lines under the title on desktop and phones. About 110–140 words fill it without scrolling. Every scroll below is 38–77 words, so it fits with room to breathe. Line breaks mark paragraphs (`<br><br>` in code); `{name}` is `wizardName()`.

---

## The chapters

### Prologue: The Beginning (lvl 1)

> You heard him first.
>
> A whisper in the Tower of Midas, where magic is law and no one prays.
>
> For that whisper, his king cast him out.
>
> Now {name} walks alone, with a borrowed staff and a god he has never seen.
>
> He believes you are listening.
>
> Are you?

### Chapter I: The Exile (lvl 10)

> Ten days beyond the gates, and the meadow has taught him what the Tower never did: hunger, fear, the weight of a staff swung in anger.
>
> He talks to you at night. Small things. The cold. The wolves. Why Midas read the sentence himself, when kings never do.
>
> You do not answer. Not yet.
>
> But every time he falls, something lifts him back up.
>
> He has started to wonder who.

### Chapter II: Devotion (lvl 30)
*Event (exists): the altar, faith ×2, the Divine crosier.*

> He found your shrine half-buried in moss, in a land where no one remembers your name.
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
> *"A god alone will hear him."*
>
> Seers do not sign the sentences of apprentices.
>
> Why was he worth a prophecy?

**Console, lvl 60 (event):** {name} pulls a cracked staff from a dead man's grip. · The wood is cold, and old, and humming.

**Console, lvl 70:** Someone left bread and bandages by {name}'s camp. · The footprints lead nowhere.

**Console, lvl 80 (event):** The cracked staff splits in {name}'s hands. · Something inside it is glowing.

### Chapter IV: The Forbidden (lvl 90)
*Event: the staff becomes sacred.*

> The staff woke tonight.
>
> Light ran through the cracks like blood through veins, and the wood healed itself in his hands. Sacred. Older than the Tower, older than Midas.
>
> You know this staff. It was made for your chosen. It was also made to kill.
>
> {name} sleeps with it across his chest, and dreams of thrones.
>
> You watch him dream, and for the first time, you are uneasy.

**Console, lvl 100 (event):** {name} masters the sacred staff. Enemies fall faster. · Every death costs him a little faith. He doesn't seem to notice.

### Chapter V: Repentance (lvl 110)
*Event: damage bonus and faith loss removed; faith rises again, less than in II.*

> The staff drinks a little of his faith with every life it takes. He noticed, at last.
>
> Tonight he buried the dead he made, and asked you to forgive him.
>
> The hooded stranger found him at the graves.
>
> "You pray well," he said. "Does anyone ever answer?"
>
> {name} said yes.
>
> The stranger looked up at the sky for a long time, as if he were listening for you too.

**Console, lvl 120:** {name} sees the hooded stranger kneeling at a shrine. · Who does he pray to?

**Console, lvl 128 (event, red rune):** {name} finds a red rune in the ash. · Half a verse is burned into it: *"…the hand that prayed shall strike…"* · On the back, a map: a mountain made of fire.

**Console, lvl 129 (event, volcano):** The rune burns in his palm and drags him into the Volcano. · He can't leave until the mountain gives back what it hid.

### Chapter VI: Corruption (lvl 130)
*Event: ×2–3 damage, no altars, faith only falls, teleports and heals instead of dying.*

> At the heart of the Volcano, he held the staff over the lava and let it drink.
>
> It came out black and red, and it no longer asked for faith. It took it.
>
> He doesn't kneel at your shrines anymore. When death reaches for him, the staff tears him away and stitches him whole.
>
> He doesn't need you.
>
> Somewhere, a verse is finishing itself. *The hand that prayed shall strike…*
>
> Strike whom?

**Console, lvl 139 (event, tower):** {name} appears in the Tower of Midas. The doors seal behind him. · Sorceresses see his face and flee, whispering a verse.

### Chapter VII: The Ascent (lvl 140)
*Event: Midas is dead; the god can no longer revive him; no mages in the City or the Tower.*

> Midas fell on the steps of his own throne.
>
> "They said you would kill a god," the king whispered. "The Tower calls me divine. I thought they meant me."
>
> He laughed, and blood ran into his beard. "I was wrong about which god."
>
> {name} drank the king's essence before it could rise. Now not even you can call him back from death.
>
> The mages are leaving the Tower. He is alone with a crown, and a question.

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
> Far behind the crowd, a hooded figure watches, and does not move.

### Chapter VIII, Part II: The Escape (on death during the lynching)
*Event: up to lvl 150; the staff is lost; achievement "lynched".*

> They tore the staff from his hands. They were drinking his essence when he vanished with the last of his strength.
>
> He woke in the mud, alive, and remembered nothing but the silence.
>
> You could have stopped them. A word. A touch.
>
> But you have heard the seers too.
>
> Better a broken believer than a god-killer.
>
> That is what you tell yourself.

**Console, lvl 150–159 (at shrines, faith above 0):** {name} prays at the shrine. Nothing answers.

### Chapter IX: Vindication (lvl 160)
*Event: gains faith again, everything back to normal.*

> He came back to you on his knees, like the apprentice he once was.
>
> And this time, you answered. Faith filled him again.
>
> The hooded healer stays at his side now. He cleans the wounds, shares his bread, says little.
>
> {name} calls him friend. The first since the Tower.
>
> You let him believe.
>
> But he has started to look at the healer's hands.

**Console, lvl 170:** The healer hums a hymn while he works. · It's one of yours. {name} never taught it to him.

### Chapter X: Disobedience (lvl 190)
*Event: refuses all help, no altars, no faith, teleports and heals instead of dying, more bosses.*

> He knew those hands.
>
> They had not moved while the mob cursed him. They had not moved while he called your name.
>
> The healer was gone by morning. So was his prayer.
>
> He is hunting for his staff now, and its true name. When death comes for him, he simply refuses it.
>
> He has stopped asking whether you are listening.
>
> He hopes you are.

**Console, lvl 199 (event, Heidan):** {name} learns where the mages hid his staff: Heidan. · He walks to Heidan. He will not leave without it.

### Chapter XI: The Return of the King (lvl 200)
*Event: ×2–3 damage, faith icon gone, XP bar full and dark red, the healer can appear.*

> In Heidan he found the staff in pieces, and reforged it in his own blood.
>
> It told him its true name: Nomaleatorio. Nothing about this was ever random.
>
> He crowned himself in the ruins. King of the exiles. King of no one.
>
> And now the whole verse is his:
>
> *The king shall cast him out. A god alone will hear him. And the hand that prayed shall strike the one who answered.*
>
> He is coming for you.

### The final battle (console)

- **The healer appears:** A hooded healer blocks the road. · "You don't have to do this," says a voice {name} knows.
- **The healer dies:** The hood falls. Beneath it, your face. · The sky tears open. You step down to meet him.
- **Heal-or-hit buttons:** the player chooses, every second, whether to save the wizard or strike.

### Epilogue: if the wizard falls

> He fell at your feet, still holding the staff.
>
> The seers were wrong. Or you made them wrong.
>
> You lift him one last time, gently, the way you did when he was an apprentice who knew nothing.
>
> There is no one left who prays to you.
>
> You are alone again.

### Epilogue: if the god falls

> The prophecy is kept.
>
> {name} sits on an empty throne at the top of the world, waiting for a voice that will never come again.
>
> For the first time since the Tower, he prays.
>
> No one hears him.

---

## Notes for the code (stage 3)

- **Fix the chapter keys:** `lvl60`/`lvl90` appear twice (the second pair is IX and X: `lvl160`, `lvl190`), `lvl99` → `lvl199`, `lv200` → `lvl200`. Already recorded in the roadmap.
- **Console beats need their own entries:** levels 40, 70, 120, 150–159 (shrine) and 170 have no chapter today. Either add `text: 'NA'` entries that print, or a separate `beats` table keyed by level, so chapters stay readable.
- **Two epilogues:** `specialEnd` becomes `endWizardFalls` and `endGodFalls`, picked by who dies in the final battle.
- **One staff:** the 2018 events at 60/80/90/130/149/200 now refer to the same item; it can be shown in the stats or inventory with its current state.
- **Chapter II already varies its console line** with the divine touches used; that stays, but the scroll text is the same for everyone (the author didn't pick "your play shapes the text").
- **Scroll format:** title in `.titles`, the subtitle under it, then short `<br><br>` paragraphs; the cliffhanger line can use `.subtitles` (dark red, bold) for weight.
