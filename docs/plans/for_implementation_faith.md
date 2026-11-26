# Faith and belief: for implementation

The whole faith and belief design in one file, ready to build. It replaces the old faith plan ([FAITH.md](FAITH.md)): everything still valid from it is copied here, and the 2026-11-24 rework is folded in. **No amount here is final:** every number is a starting point or waits for the playtests (section 12).

Already built (from the old plan): the belief meter and its four levels, touch cost and shrine chance by level, the god's super-critic. Parts of these change below.

---

## 1. The goal

Faith never punishes an idle player, and the believer and atheist games are **two equally good ways to play**:
- the **Shepherd** (Devout): big visible miracles, a wizard who leans on the god;
- the **Silent Guardian** (Atheist): the god helps unseen, a wizard strong on his own.

Believer and Doubter are the bridges between them. The god always has something to do, at every level.

## 2. Two meters

| | Faith | Belief |
|---|---|---|
| What it is | What the god **spends** | How much the wizard **believes** |
| Range | **0 to a max**, never negative. The max grows with level or chapter (curve to playtest) | **−100 to +100**, start **+20** |
| Moved by | Gains (prayers, milestones, offerings, revive) and spending (touches, nudges) | **Moments** (section 4), never by spending |

**Belief levels:** Devout from +60, Believer 0 to +60, Doubter −60 to 0, Atheist below −60, with a **10-point margin** so he doesn't flicker at a line (e.g. back from Atheist only at −50). In chapter X the story locks him as *Lost*, shown as a **symbol**, not a number (section 9).

Because faith has a max, spare gold can't snowball faith past it. Offering amounts still go to the playtests (section 12).

## 3. Faith: where it comes from and where it goes

**Gains**
- **His own prayers:** he prays when he camps, rests or levels up. Devout and Believer pray more, Doubter less, Atheist never.
- **Milestones** (no touch needed): a boss kill, a new chapter, a new zone, a close call.
- **Shrines:** prayer and offering when he enters. Base chance to enter **50%**; Devout +15%, Doubter −15%, Atheist never (and no skip penalty: he doesn't care). A Devout offers more, sometimes a crafted item. The god's **tithe** (touching the shrine) gives the most.
- **The god's revive:** free, and it gives a little faith (×2 for a Doubter or Atheist: being raised by a god you deny is hard to ignore). If playtests show farming by letting him die, the gain applies only once every few minutes.

**Spending:** the god's touches (section 5) and nudges (section 6). **A heal always costs clearly less than a hit**: protecting him is the god's job, hitting is the luxury. Professions touches (PROFESSIONS.md) are priced like the tithe.

**Drains, softer:** skipping a shrine and getting up without the god cost less faith, or none. Every loss stops at 0.

**One road for every change:** every faith gain and loss goes through one place, so stats, belief moments and console lines happen together.

## 4. Belief: what moves it

| Moment | Belief (start) |
|---|---|
| **Saved from the killing blow:** a heal that keeps him alive through the enemy's next hit | +8 |
| **Heal at very low HP** (below about 20%) | +5 |
| **The god's final blow** on an enemy (the god's touch may kill) | +5 |
| The god's touch lands a **critic** (×8) | +3 |
| The god's touch lands a **super-critic** (1 in 10 of his critics, ×16) | +6 |
| A normal heal or hit | +0.5 |
| Revive by the god | +2 |
| Prayer at a shrine | +1 |
| Skipping a shrine | −1 |
| Passing by a shrine while Doubter or Atheist (*"glances at the shrine longer than he means to"*) | +0.5 |
| **Close call:** survives a fight below 10% HP with no help | +1 |
| Left to get up without the god, while Believer or Devout | −10 |
| Left to get up without the god, while Doubter or Atheist | −1 |
| **Unanswered prayer** answered / ignored (below) | big up / down |
| **Silence:** belief drifts down while the god does nothing | slow, steady |

- **Unanswered prayers:** at low HP in a boss fight he prays, and a short timed window opens. If the god answers (touches him), belief jumps up and the heal works at any level. If the god ignores it, belief drops, but he gains a lasting **Hardened Heart** bonus (+crit/XP). This replaces the old "prayer in despair".
- **Miracle tolerance:** the same miracle again and again raises belief less each time; help he has learnt to expect that doesn't come lowers it.

## 5. What the god can do, by level

The action bar changes with the level. Strength and price do **not** scale by level on top (the old Devout −25% / Doubter ×2 is gone).

| Level | The god's touches | The wizard alone |
|---|---|---|
| **Devout** | Heal, hit, and one **signature miracle** from the god's face (section 7) | Weakest alone; leans on the god |
| **Believer** | Heal, hit (today's touches) | Baseline |
| **Doubter** | A weaker heal; subtle aid (soften the enemy) | Self-reliance bonus grows; "doubts" lines in the console |
| **Atheist** | **The invisible hand** and the **winning-back actions** (below). Refuses every direct touch except a revive | Highest **self-reliance bonus** (+XP, +crit) |

**Self-reliance:** the lower his belief, the more XP and crit he earns on his own, while the god's miracles weaken. No weak middle.

**The invisible hand** (Atheist): the touches act on the world, not on him. He never knows.
- Weaken the enemy (its armour or resistance).
- Turn a killing hit into a **1 HP graze**.
- A **healing herb** appears on the path.

Each one shows his **luck excuse** in the console: *"the goblin's blade snapped on its own"*, *"lucky dodge"*, *"a herb, right where he needed it"*.

**Winning back an Atheist** (no consent needed, each with a cool-down):

| Action | How | Effect |
|---|---|---|
| Free revive | Touch him when dead | Belief and faith, ×2 for an Atheist |
| A sign | Touch the sky or scene outside a fight | A light, a rainbow, birds; a small chance (rising with each sign) of a little belief: *"stares at the sky, unsettled"* |
| A dream | Touch the sleeping bag while he camps | He dreams of a shrine; at the next one he enters despite being Atheist |
| Hidden blessings | Professions touches still work (he doesn't know it's the god) | After several lucky moments: *"feels someone is watching over him"*, + belief |
| A pilgrim | Touch the scene in a town | A believer NPC talks to him; a little belief, more for a Doubter |
| Rare relics | Touch a chest or pot while he loots, at most once every few levels | The loot becomes a relic (below) |

| Relic | Kind | Effect |
|---|---|---|
| Forgotten psalm | Scroll | Read at the next rest: belief moves a third of the way back toward 0 |
| Pilgrim's medallion | Worn (ring slot) | Each shrine he passes may draw him in, curious; each visit a little belief. He takes it off at Believer |
| Shard of the Divine crosier | Keepsake | One jump to Doubter, once per wizard; only if he reached chapter II |
| Letter from a fallen wizard | Scroll | From a cemetery wizard (by name) who died faithless and regretted it; a little belief and a story line |

## 6. Whispers and nudges

**Whispers:** the god's voice carries quests, secrets and warnings (like the Tundra prism quest). A Believer or Devout always hears one, a Doubter sometimes, an Atheist rarely, and then as his own thought (*"a thought he can't shake"*). Whispers don't move belief.

**Nudges:** the god clicks a door, gate or cave entrance to suggest a path; it costs faith. Devout almost always follows, Believer usually, Doubter about half the time, Atheist rarely (and he thinks it was his idea). A refused nudge wastes its faith. Feedback: a console line and a glow on the door.

## 7. The god's face

He forms a picture of the god from how the player plays:

| Most of the god's acts | Face | Devout signature miracle |
|---|---|---|
| Heals | **Mercy** | *Sanctuary*: a shield outline that takes the next few hits, fading with each |
| Hits | **Wrath** | *Smite*: a strong strike from above |
| Silence | **Distant** | *Providence*: invisible-hand luck while Devout |

The face always shapes **his prayers, his console lines and the glow colour of the god's touches**. At Devout it picks the signature miracle. Heal and hit stay for every face. The face doesn't change while the game is closed.

## 8. Showing it

- **The candle:** a **static candle** at the end of the white space after the wizard's name, one drawing per belief level, no animation. Read at a glance.
- The **faith scroll** keeps its button for the details.
- The console announces each level change (*"starts to doubt his god"*, *"no longer believes in anything"*).
- No popups.

## 9. Death, rescue and the story

**The god's revive is always free** and works at every level (section 3).

**When the god doesn't touch him: rescuers** (the mysterious healer stays the god's own; only the divine revive leads to the healer's cabin). Picked by zone and belief level:

| Rescuer | Where | What happens | Faith |
|---|---|---|---|
| Pagan caravan | Prairie, Desert, Dunes | Pagans heal him with rites and drop him in another zone | −8 g |
| Shaman | Forest, Swamp, Tundra | Heals him with herbs; asks reagents or gold | −5 g |
| Gravedigger / necromancer | Castle, Duenon, Grotto | Raises him "not quite alive", half HP; pushes toward sin | −12 g |
| Ghost of a fallen wizard | Anywhere, rare, if the cemetery has wizards | *"the ghost of Merlin (lvl 87) lifts him up"* | none |
| His own potion | If he carries a Health potion | Drinks it with his last strength | −3 g |
| Alone | If nobody else fits | Today's self-revive | −8 g |

(The faith costs above become "less or nothing" with the softer drains; amounts to playtest.) An Atheist is rescued faster (1 minute instead of 2).

**The skull:** floats above the fallen wizard only while the god can still act; never over a true death.

**True death rule:** a true death is possible only while the god can click to revive him. Where the story takes that click away, the story protects him:
- Chapters VI–VIII: the **corrupt staff** raises him (stripped by the mob in VIII).
- Chapter X: he writes the **Last Escape** himself, a master teleport scroll; at 0 HP it pulls him out and heals him, burning a little each use.
- Chapter XI: it burns to ash at Heidan; from then the reforged staff ***{staffName}*** raises him (its name is random per world).
- No true death from chapter X until the final battle. No afterlife gods in the death mechanics.

**Chapter X locks him as Atheist** (*Lost*, a symbol), and belief stops moving. He refuses all direct help and the winning-back actions stop. **The invisible hand still works, but weaker**: he can't refuse what he can't see. His luck excuses turn bitter (*"luck, again. I need no one"*). Before chapter X belief moves both ways. Chapter III halves the multiplier and chapters VIII/IX follow STORY.md, on top of the levels.

## 10. A god who is gone (the game closed)

The [AWAY.md](AWAY.md) rule. Two cases, never mixed:
- **Idle** (the game open, the god silent): everything above runs on the live clock.
- **Gone** (the game closed or the page hidden): settled once on return, on **world time = time away / 108**. No fights are played, so **no prayers and no milestone faith**. Faith only falls (×0.98 per world hour, never below 0). **Belief drifts down at the idle rate per world hour.** The face doesn't change. Soft dead after about a month away and the permadeath curve stay as AWAY.md has them; the saving touch on return is the usual free revive. Nothing about time is announced: a lower candle is the only trace.

## 11. Art, achievements, stats

**Art (all new; options on one sprite first, then the set):** Sanctuary, Smite, Providence, the healing herb, the 1 HP graze, the enemy weakening, the door glow for nudges, the four candles. Sanctuary shares its look with the defensive spells plan (a black and white outline that fades with each hit). The rescuers reuse townsfolk, skeleton and spectre sprites.

**Achievements:** reaching Atheist (*Atheist!*), reaching Devout, climbing from Atheist back to Believer (*Repentance*), one per god's face reached at Devout, ignoring an unanswered prayer (*Hardened Heart*). Lifetime or one life: the achievements plan decides.

**Stats:** faith gained and spent by source, highest and lowest faith and belief, times and time at each level, moments by kind, touches refused, invisible-hand touches by kind, nudges followed and refused, whispers heard and missed, the face reached, revives by the god vs each rescuer.

## 12. Playtests (no number without them)

Switches in the config for every amount, and simulated runs from level 1 to 100+ with two god bots:
- **Idle god:** never touches. Where does the wizard end up, and is the Atheist game good?
- **Active god:** heals below 30% HP, revives at once, tithes at every shrine, wins back an Atheist.

Measured per level: faith, belief and time at each level, touches the god could afford, deaths and how he was revived, gold. Results kept in `docs/playtests/`.

**To tune:** the faith max curve, prayer and milestone faith, offering amounts, drain amounts, the drift pace, the belief moment weights, the self-reliance bonus, the invisible hand's strength (and its weaker chapter X version), nudge chances and cost, whisper hearing chances, the heal-to-hit ratio, the unanswered prayer window and Hardened Heart bonus, miracle tolerance, how many acts decide the face, the revive gain and its farming guard.

## 13. Build order

1. One road for every faith change; faith 0 to max. Check the pace.
2. Belief levels with the new action bar, self-reliance, the candle.
3. The invisible hand and luck excuses; winning-back actions.
4. Prayers, milestones, softer drains, belief drift (live and away).
5. Unanswered prayers, miracle tolerance, the god's face and the signature miracles.
6. Whispers and nudges.
7. Rescuers and the free revive.
8. Story locks (chapter X and after) with the story.

Playtests after step 1 and again after each step that adds an amount.

---

## Decisions (author, 2026-11-25)

- **Signature miracles are BACK (author, 2026-11-25, reverses the line that dropped them):** at Devout the god's face picks one extra miracle (section 7: Mercy gives Sanctuary, Wrath gives Smite, Distant gives Providence). Art asked of the artist; dev builds them in step 5 with the god's face.
- **Miracle looks by belief level (author, 2026-11-25; my reading of his words, to confirm):** all three looks of each miracle are kept, final art in the review drop (fx_sanctuary_a/b/c 40x40 4 frames, fx_smite_a/b/c 32x64 6 frames, fx_providence_a/b/c 16x16 6 frames). Sanctuary: Doubter the plain shield (b, the cross was removed by the author 2026-11-26), Believer adds the round bubble (a), Devout all three (a, b, c, the hexagon). Smite: Doubter the sword of light (c, 'dagger'), Believer adds the jagged bolt (b), Devout all three (c, b, a, the pillar). Providence: one of its three at random. Atheists keep the invisible hand, no visible miracle. Providence is the effect of the god's touches on the ENVIRONMENT (runes, books, doors, mouths and other hotspot elements, see HOTSPOTS.md); healing and attacking touches keep their own effects (heal, hit; Sanctuary and Smite are the miracles). Which of its three looks plays is random (author, 2026-11-25).
- **Sanctuary rules (author, 2026-11-26, multiple choice):** with a Mercy god every heal touch also raises a Sanctuary on the wizard (a heal bonus, no separate action). It takes hits by belief level: Doubter 1, Believer 2, Devout 3 (same as its number of looks); each enemy attack, boss or not, uses one hit and moves the strip one frame on (fade, crack, dashed). Doubter, Believer and Devout all get it, looks by level. Final art: fx_sanctuary_a/b/c, fx_smite_a/b/c in the review drop, Smite b restyled; waiting for his yes. Open: faith cost of the bonus, what a refused/Atheist heal does (nothing, the hand has no Sanctuary), whether a new heal renews it.
- (superseded, kept for the record) No signature miracles (sections 5 and 7): the scene spells and scene heals are already the big miracles. The god's face stays (prayers, console lines, glow colour) but picks no extra miracle.
- **The candle** sits on top of the stats/XP box, right aligned; long wizard names must never run under it (the name is clipped or shrunk first). Four static drawings, one per belief level (art asked in docs/art-notes.md).
- **Nudges must work everywhere with console text**: the god clicks a rune, a book, a destination, a cave or mine mouth, or any part of an intersection (for example the Tower crossing) to suggest he goes or does it. Needs clickable spots in the scene data (hotspots per scene: a rect, what it suggests, where it leads). Step 6.
- Built 2026-11-25: step 1 (src/faith.js, cap), and from step 2 the equal touch cost at every level, the weaker Doubter heal (config.belief.doubterHealFactor) and self-reliance (selfReliance(): extra XP and crit as belief falls). Still to do in step 2: the candle (waits for art).
- Built 2026-11-25: step 3 part 1, the invisible hand (src/hand.js). Left in step 3: the winning-back actions.
