# Quests

Quests give the wizard a purpose to walk somewhere, and give the god new ways to steer him. Written 2026-11-24 from the author's notes of 2026-11-20 and 2026-11-21 (thinker notes). Nothing here is built yet. Dev and artist wait for the author's OK. No numbers until playtests.

## What exists today

- **The prism quest** (Tundra spectra): given as a whisper of the god after the second spectrum; a flag in `state.spectra`, no quest scroll.
- **Whispers** (FAITH.md): the god's voice brings quests, secrets and warnings; a Believer always hears it, a Doubter sometimes, an Atheist rarely (as his own thought).
- **The healer's cabin** stands near where he fell only while `state.quest` is set: it waits for this plan.
- **Travel**: travel.js picks the next stage from the author's links; the travel graph can already find a route between two map points (dev tools).
- **Professions** are planned, not built: crafting and ingredient quests wait for them. There is no fishing yet.
- **Trainers** (PROFESSIONS.md) set the pattern for the god choosing through an NPC: touch the trainer to accept, touch the door to leave, no touch and he decides alone.

## The idea

A quest is **a goal plus a place to go**. While he has one, his walking leans toward it, so the map has meaning: he is going somewhere, not wandering. When it ends, he wanders again.

### Who gives quests

1. **The wizard himself (his own wishes).** When he has no quest, he sometimes sets one from what he lacks: low on gold → "earn some coin", has a profession → "gather mushrooms", weak → "train before the Castle". Picked by his needs, not by pure chance, so he looks like he thinks.
2. **The god (the Faith scroll).** The god can give an order from the Faith scroll: mostly faith tasks (pray at a shrine, a pilgrimage). Only a Believer always obeys; a doubting wizard may ignore it.
3. **People (inns, taverns, merchants, the desert tent keeper).** A host offers a job. The god accepts by touching the NPC, refuses by touching the door; no touch → he decides by his needs (same rule as the trainers).
4. **Whispers and secrets.** Finding a secret (a spectrum, a rune, a hidden shrine) can start a quest, as the prism does. While on a secret, he is **focused**: it goes first and his walking leans hard toward it.

### Kinds of quests

| Kind | Example | Given by |
|---|---|---|
| Wanted | Hunt a named rare or a boss; while hunting, that enemy shows up a little more often (not a sure thing) | People, wizard |
| Ingredients | Bring 5 gems; drops from any time count, nothing spoils, he hands them in when he has them | People, wizard |
| Explore | Visit a zone (or every stage of one) | People, wizard, whisper |
| Study | Find and study a rune, a book or a statue | Wizard, whisper |
| Shrine bounty | Pray at a shrine for a big faith gain | God, whisper |
| Pilgrimage | Visit 3 shrines in 3 different zones | God |
| Hidden shrine | Find a very hidden shrine (the Volcano) | Whisper, god |
| Delivery | Carry a parcel from one inn to another | People |
| Crafting | Make a recipe for someone | People (after professions) |
| Fishing | Catch a fish | People (after fishing exists) |

### Quests and his age

Small jobs (deliveries, errands) fade as he nears the last levels; then only hunting and self-improvement quests come, so the story's end isn't spent carrying parcels.

### How a quest moves him

Two phases (decided 2026-11-24):

1. **Travelling: he takes the best route.** Travel already knows the steps between two map points. If his quest is in the Tundra, he follows that route stage by stage, the shortest way there. Events on the way (fights, finds, inns) still happen; after them he carries on along the route.
2. **Searching: he roams the target area.** Once he arrives, he stays in that zone, wandering from stage to stage, and **doesn't leave until he finds what he came for** (the wanted enemy, the shrine, the rune, the inn for a delivery). Then the quest ends, he takes the next one from his queue, and he's travelling again.

**A long search:** the longer he searches, the more likely the target shows up. If it still drags on, he doesn't give up: he moves that quest down the queue and takes the next one, and comes back to it later. Only the god can cancel a quest.

With an empty queue he wanders freely as today.

### The quest scroll

One page (maybe a tab of the stats scroll) lists the current quest, who gave it, and the last few finished ones. The cemetery note can mention a quest he never finished ("he never delivered the letter to the Town inn").

### Rewards

Gold, XP, faith or items, by kind: faith tasks give faith, people's jobs give gold, hunts give XP. Amounts come from playtests.

## Art it needs

- A quest icon for the heading or the scroll (the old *Rumors* scroll of the Town sheet may serve).
- A parcel or letter item for deliveries.
- Inn NPCs already exist; the speech bubble art (`bocadillo con letras.png`) could show an offer.

## Open questions

All eight decided 2026-11-24 (see Decisions). Dev answered the code question (below). Still open: every number (playtests).

## Dev's answer (2026-11-24)

- **Leaning the walk works.** Travel already picks from a list of candidate moves. On a quest, the candidates that bring him closer to the target get extra weight, so he leans toward it without being forced. (Superseded the same day: the author wants the best route instead, see "How a quest moves him".)
- **Fast enough to run in play.** The travel graph is already used in play (the healer's cabin uses it). A few lookups at each crossing cost nothing. Limit: **a quest target must be a stage the travel graph knows**, so each quest names a target stage, not just a zone.
- **`state.quest` is free to reshape.** Only the cabin reads it, and only to check whether one is set. No save migration is needed.

## Dev's answer on the queue and route (2026-11-24)

The design fits travel. Four points:

1. **Staying put.** Today two things push him out of a zone: restlessness (too many events in one zone) and a plain chance to change zone. **While searching, both are switched off.**
2. **Split zones.** Roaming uses only the moves inside the zone. If a zone's stages only connect through another zone, he can't reach all of them that way. Not checked yet. Default: he may cross through the other zone on the shortest path and come back; that still counts as searching.
3. **Following the route** takes the next stage on the path at each crossing. The travel pick needs an optional fixed target (code detail).
4. **Zone-only targets** (a wanted enemy): the quest aims at the zone's nearest stage, then searching starts. Queue order by travel cost works as is.

Events on the way are fine: travel carries on at the next explore.

## Decisions

| Date | Question | Decision |
|---|---|---|
| 2026-11-24 | How many quests at once | **One.** A secret jumps the queue: it pauses the current quest, and he goes back to it after |
| 2026-11-24 | How smart are his own wishes | **A needs score plus a personality.** He picks his biggest need (gold, faith, ingredients, strength); each wizard gets a small random personality (greedy, pious, curious) that tilts the scores. No learning system |
| 2026-11-24 | Can the god cancel a quest | **Yes, from the Faith scroll** ("forget it"), obeyed by the same belief rule as the god's orders |
| 2026-11-24 | Do quests fail | **No timers.** A quest ends when done, dropped or cancelled, or at **permadeath** (the cemetery note remembers it unfinished). A soft death (touch revive, healer's cabin) keeps it |
| 2026-11-24 | Does belief decide if he obeys the god | **Yes, like whispers:** a Believer always obeys, a Doubter sometimes, an Atheist rarely. Obeying or ignoring doesn't move belief; a finished god's order gives faith |
| 2026-11-24 | Can a wanted target leave its zone | **No.** The quest sends him to its zone, where it shows a little more often (tuned by playtest) |
| 2026-11-24 | Which kinds ship first | **Wanted, explore, study, shrine bounty, pilgrimage, hidden shrine, delivery.** Ingredients and crafting come with professions, fishing later |
| 2026-11-24 | How rewards are chosen | **By kind, shown in the offer:** faith tasks pay faith, people's jobs gold, hunts XP, sized to his level. Amounts from playtests |
| 2026-11-24 | One quest at a time, more precisely | **He works on one quest at a time, but keeps a queue of the others.** When one ends he takes the next. A secret still goes first |
| 2026-11-24 | How a quest moves him | **He follows the best route to the target zone** (travel's route between two map points), then **roams that zone until he finds what he came for**, never leaving early. Replaces the earlier "lean, not forced" idea |
| 2026-11-24 | Queue order and size | **Secrets first, then the quest whose target is nearest on the map** (travel cost from where he stands). **A small cap** (count from playtests); when the queue is full he turns down new offers |
| 2026-11-24 | A search that drags on | **The odds of finding the target rise the longer he searches.** If it drags on anyway he **moves the quest down the queue** (doesn't drop it) and takes the next one. **Only the god cancels.** Restlessness and the zone-change chance are off while searching |
| 2026-11-24 | Split zones (dev's point 2) | Default, not asked: he may cross another zone on the shortest path to reach a cut-off stage of his target zone; it still counts as searching |
