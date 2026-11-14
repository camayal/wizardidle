# Faith rebalance plan

A plan to rebalance faith: how the wizard gains and loses it, what the god (the player) can do with it, and how belief and atheism work. It must **keep the atheist ending possible**, and it's tied to the professions plan ([PROFESSIONS.md](PROFESSIONS.md)), where every god touch is priced in faith. Written 2026-11-12 from the code and `ideas.md` ("Rebalance faith and player interaction", the story notes). Nothing is built yet.

---

## Decisions (by the author)

| Date | Question | Decision |
|---|---|---|
| 2026-11-12 | Belief | **Four levels:** Devout / Believer / Doubter / Atheist, each changing his behaviour |
| 2026-11-12 | God's revive | **Always free, and it gives a little faith** (amount to playtest). It works for atheists too: the god still helps |
| 2026-11-12 | Full rejection (chapter X) | **A unique artefact or scroll teleports him away before he dies, and the story has a plot where it breaks** |
| 2026-11-12 | When the god doesn't revive him | **Other rescuers** (a pagan caravan, a shaman, other ideas), **not the mysterious healer**, who stays the god's own |
| 2026-11-12 | Offerings snowball | **Not decided without playtests:** the plan includes a test setup to compare the options |
| 2026-11-12 | Atheism | **Both ways.** While atheist outside chapter X, **the god has actions to try to win him back** |
| 2026-11-12 | Rescuers | **All four:** pagan caravan, shaman, gravedigger / necromancer, ghost of a fallen wizard (plus his own potion, and alone as the fallback) |
| 2026-11-12 | Winning back | **All of them:** prayer in despair, a sign, a dream, a pilgrim, hidden blessings, **and rare scrolls or artefacts** (the author's addition, 3.6) |
| 2026-11-12 | Escape item | **The Last Escape scroll:** written by the wizard himself at chapter X, burnt a little by each use, burns to ash in chapter XI |
| 2026-11-12 | True death and the story | **The author's rule: a true death is possible only while the god can click to revive him. Wherever the story takes that click away, the story must protect him.** Chapter VI–VIII: the corrupt staff raises him; X: the Last Escape scroll (he writes it himself); XI, after it burns: the reforged staff *{staffName}*. No true death from X until the final battle. No afterlife gods in the death mechanics |
| 2026-11-12 | Playtests also cover | Revive boost and farming, belief thresholds, shrine chance, professions touches |
| 2026-11-13 | Belief vs faith (from the author's playtest notes) | **Two meters.** Faith stays the currency the god spends. **Belief is its own bounded meter** (e.g. −100 to +100), moved by **moments**, not by spending: a heal at a critical moment or the final blow on an enemy counts a lot, normal heals and hits only a little, leaving him to revive alone drops it a lot. The four levels read from belief. The story can lock it at "lost", shown as a symbol rather than −∞. To be detailed in this plan (weights, bounds, what counts as critical) before it is built |
| 2026-11-13 | A way back from atheism | **Passing by a shrine** (Doubter or Atheist) +0.5; **a close call** (survives a fight below 10% HP with no help) +1; **getting up alone** −10 only while a Believer or Devout, −1 once a Doubter or Atheist. The god's super-critic: **1 in 10 of his critics, ×16** |
| 2026-11-13 | Belief meter details | **−100 to +100, start +20; Devout from +60, Doubter below 0, Atheist below −60, 10-point margin.** Critical moments: saved from the killing blow (+8), heal at very low HP (+5), the god's final blow (+5), the god's critic (+3) and super-critic (+6); small ones +0.5; left to get up without the god −10. The god's touch may now kill. Details in 3.1 |

---

## 1. How faith works today

### One unit for everything: *g*

Almost every faith amount comes from the wizard's max HP (`hpBase`). To compare them, this plan uses **g = the gold of an average kill's lower bound = `hpBase × rGold`** (`rGold` 0.15). A normal kill gives 1–2 g of gold. `calculateFe()` (`src/wizard.js`) returns **1–5 g** (average 3 g), and most faith events use it.

### Gains

| Source | Where | Amount | Notes |
|---|---|---|---|
| Praying at a shrine | `doOffering()`, `src/events.js` | 3 × `calculateFe()` ≈ **9 g** | When he enters and doesn't offer gold |
| Offering at a shrine | `doOffering()` | 10–50% of **the gold he holds** × `fOfrenda` (0.57) | 25% of shrine visits (`pOfrenda`) |
| God's tithe (touch the shrine) | `centerBtn()`, `src/divine.js` | 25–75% of the gold he holds × `fOfrenda` | The god's only way to *gain* faith |
| Cleansing a corrupted enemy | `battle()`, `src/combat.js` | 5 × `calculateFe()` ≈ **15 g** | Not while in sin |
| Perfect sphere statue (Dunes) | `statueObj`, `src/events.js` | ≈ **11 g** | Rare |
| Chapter II (lvl 30) | `src/story.js` | **all gains ×2** from then on (`faithMultiplier`) | |

### Losses

| Source | Where | Amount | Notes |
|---|---|---|---|
| Skipping a shrine | `prayEV()` | `calculateFe()` ≈ **3 g** | He enters only 35% of the time (`pFindCapel`), so **65% of shrine events are skips** |
| God heals him | `pjBtn()` | HP healed × 1–3 ≈ **1–2 g** per small heal, ~13 g for a full heal | Blocked at faith ≤ 0 |
| God hits the enemy | `npcBtn()` | damage × 1–3 | Blocked at faith ≤ 0 |
| **God revives him** | `pjBtn()` (dead) | **free** | **Works at any faith**, even below 0 |
| He revives himself | `scheduleSelfRevive()`, `src/combat.js` | 1.25 × `hpBase` ≈ **8 g** | After 2 minutes dead |
| Reloaded while dead | `src/game.js` | 0.25 × `hpBase` ≈ 1.7 g | |
| Kill while in sin | `battle()` | ≈ 3 g | Coded but never switched on (`state.player.inSin`) |

### Belief and atheism today

- Faith is **just a number**. Below 0 the god's heal and hit touches stop working, and nothing else changes: he still prays, offers and skips shrines at the same rates.
- The **"Atheist!"** achievement fires at **−10,000 faith** (`src/ui/render.js`), a fixed amount whatever his level.
- The story plans much more (`src/story.js`, `ideas.md`): chapter III halves the multiplier, chapters IV–VI put him in sin, VIII/IX make altars give nothing while faith is above 0, X refuses all help, XI removes the faith icon. None of it is built.

---

## 2. What's off

1. **Revival is free.** The best divine touch costs nothing and works for an atheist. Death never costs the god anything, and the old help ("the healer charges his service in faith") says otherwise.
2. **Faith grows with hoarded gold.** Offerings and the tithe take a share of the gold he holds, and gold has few uses (the inn, dice). By mid-game one tithe can give hundreds of g, and the god can heal at will. Professions will add gold sinks, which helps, but the share-of-gold rule stays a snowball.
3. **Atheism isn't a state.** Negative faith only blocks two touches. The wizard behaves exactly the same, so there's no "road" to atheism to watch, just a number going down.
4. **Fixed thresholds don't scale.** −10,000 is out of reach at level 5 and a few self-revives at level 100.
5. **Skipping shrines is the main drain** (65% of shrine events), and it's pure chance: the god can't do anything about it.

---

## 3. Proposal

### 3.1 Belief: its own meter (decided 2026-11-13)

**Faith** stays the currency the god spends (touches, offerings). **Belief** is a separate, bounded meter of how much the wizard believes, moved by **moments**, never by spending. The four levels read from belief.

**Bounds and levels**

| | Value |
|---|---|
| Range | **−100 to +100** |
| Start | **+20** (a mild believer: he was exiled for believing) |
| **Devout** | +60 and above |
| **Believer** | 0 to +60 |
| **Doubter** | −60 to 0 |
| **Atheist** | below −60 |
| Margin | **10 points**, so he doesn't flicker at a line (e.g. back from Atheist only at −50) |
| *Lost* | The story lock (chapter X): shown as a **symbol**, not a number; belief stops moving |

**What moves it** (starting weights, to playtest)

| Moment | Belief |
|---|---|
| **Saved from the killing blow:** a heal touch that keeps him alive through the enemy's very next hit (he would have died without it) | **+8** |
| **Heal at very low HP** (below about 20%) | **+5** |
| **Final blow:** the god's touch on an enemy lands the killing hit | **+5** |
| **The god's touch lands a critic** on an enemy | **+3** |
| **The god's touch lands a super-critic** (1 in 10 of the god's critics, ×16 damage against the critic's ×8; decided 2026-11-13) | **+6** |
| A normal heal or hit touch | +0.5 |
| Revive by the god's touch | +2 |
| Prayer at a shrine | +1 |
| Skipping a shrine | −1 |
| **Passing by a shrine** while a Doubter or Atheist (he walks past without entering: *"glances at the shrine longer than he means to"*) | **+0.5** |
| **Close call:** he survives a fight below 10% HP with no help | **+1** |
| **Left to get up without the god** (a rescuer or alone) **while a Believer or Devout** (he was used to the god's help) | **−10** |
| Left to get up without the god **while a Doubter or Atheist** (he expects nothing) | −1 |

- **No drift on its own.**
- **A way back from atheism, even with an idle player** (decided 2026-11-13, the author: *"we should have a way to revert atheism"*): the first playtest (`docs/playtests/2026-11-13-belief`) showed that with −10 for every fall, an idle player's wizard became an Atheist after about 9 falls, before level 25, and stayed one for the whole game (an Atheist never prays, so nothing raised his belief). Now passing by shrines and close calls raise belief a little, and getting up alone costs only −1 once he's a Doubter or Atheist. A new playtest checks where an idle wizard ends up.
- *Change from today:* the god's touch **may now kill** an enemy (the final blow). Today `npcBtn()` in `src/divine.js` caps the hit so the enemy keeps 1 HP ("avoid god kills").
- *Critic for the god's touch:* today's "divine power" spells in `npcBtn()` (×8 damage) are the god's critic; in [SCENE_SPELLS.md](SCENE_SPELLS.md) they play a scene spell. A super-critic is a rarer, stronger one (chance to playtest).
- *Stats:* `belief.highest`, `belief.lowest` (records), `belief.moment.<kind>` (counters), the level and age when each level is first reached (firsts).

**What each level does**

| Level | Behaviour |
|---|---|
| **Devout** | Enters shrines more (+15%), offers more, sometimes offers crafted items; the god's touches cost 25% less faith |
| **Believer** | Today's behaviour |
| **Doubter** | Enters shrines less (−15%); the god's heal and hit touches **work but cost double** faith; "doubts" lines in the console |
| **Atheist** | Never enters shrines (no skip penalty either: he doesn't care), **refuses every touch** except a revive, relies on potions and scrolls (professions), gets up faster |

The console announces each change ("starts to doubt his god", "no longer believes in anything"). The heading shows belief with its own icon next to faith (art to draw).

### 3.2 Revival (decided)

**The god's revive is free and gives faith.** Touching the dead wizard always works, at any belief level, and the miracle strengthens his belief: **+`calculateFe()` (≈ 3 g)** as a starting value, to playtest. For an Atheist or Doubter it's a stronger nudge (×2), since being raised by a god you deny is hard to ignore: *"wakes up in the healer's cabin and wonders who brought him here"*.

*Guard to test:* a free revive that gives faith could become a way to farm faith by letting him die. Dying already costs time and gold (`goldLostInBattle`). If playtests show farming, the boost only applies once every few minutes.

**When the god doesn't touch: other rescuers.** Today, after 2 minutes, he *"recovers himself but feels abandoned by his god"* (−8 g). That becomes a **rescue event** with someone who isn't the god. The **mysterious healer stays the god's own** (only the divine revive leads to the healer's cabin). Candidates, picked by zone and belief level:

| Rescuer | Where | What happens | Faith | Art |
|---|---|---|---|---|
| **Pagan caravan** | Prairie, Desert, Dunes (roads) | Travelling pagans pick him up, heal him with their rites and drop him in another zone | −8 g (pagan rites) | townsfolk (`dg_people32.gif`), the Meadow crowd background |
| **Shaman** | Forest, Swamp, Tundra | Heals him with herbs; asks for reagents or gold as payment (professions) | −5 g | townsfolk sprite, healer hut layers |
| **Gravedigger / necromancer** | Castle, Duenon, Grotto | Raises him "not quite alive": half HP; pushes toward sin | −12 g | skeleton or spectre sprites |
| **Ghost of a fallen wizard** | Anywhere, rare, only if the cemetery has wizards | A wizard from a past run (`world.cemetery`) lifts him: *"the ghost of Merlin (lvl 87) lifts him up"*. Ties to "wizards from the past" | none | spectre sprite, translucent |
| **His own potion** | Anywhere, if he carries a Health potion (professions) | Drinks it with his last strength | −3 g (he trusts himself) | potion sprite |
| **Alone** | Anywhere, if nobody else fits | Today's self-revive | −8 g | |

An Atheist is rescued faster (1 minute instead of 2): the world takes care of those who don't wait for gods.

**And when nobody comes:** the author's idea "Death management" (`ideas.md`, 2026-11-12): in a rare case no rescuer comes and the wizard **dies for good**. A death chapter (*"for you, god, time is nothing; for the world it is everything"*), the cemetery, then back to the name screen. Not decided yet; its chance would be measured in the playtests.

**The skull as an alert (decided 2026-11-13):** the fallen wizard is drawn lying injured (`img/fallen*.png`), and the skull (`img/muerto.png`) floats **above him only while the god can still act**: from the fall until a touch revives him or a rescuer picks him up. It never shows over a true death (`img/dead*.png`), where nothing is left to do.

### 3.3 Offerings don't snowball (option A, pending playtests: see 3.10)

The offering and the tithe stay a share of his gold (the gold leaves the bag, which is a nice sink), but the **faith they give is capped at 20 g per offering** (40 g for the god's tithe). Spare gold becomes useless for faith past that point, so the snowball stops.

### 3.4 Fewer, fairer drains

- Entering a shrine: from 35% to **50%** base (`pFindCapel`), modified by belief level. Fewer random skips.
- Skipping a shrine stays at ≈ 3 g. An Atheist doesn't pay it (he isn't refusing anything; he doesn't care).

### 3.5 The god's price list

All touches priced in g, adjusted by belief level (Devout −25%, Doubter ×2, Atheist refused):

| Touch | Cost / gain |
|---|---|
| Heal | HP healed / `hpBase` × 15 g (a full heal ≈ 15 g) |
| Hit the enemy | damage / enemy HP × 10 g |
| Revive | **free, gives ≈ 3 g** (×2 for Doubter/Atheist) |
| Tithe (touch the shrine) | gains up to 40 g |
| Professions (from PROFESSIONS.md) | harvest, blessed craft, generous merchant, item offering: priced with the tithe rate |

### 3.6 Winning back an atheist (decided: the god tries)

Outside chapter X belief drifts both ways, and an Atheist **refuses the god's heal and hit**. So the god gets gentler actions that don't ask for his consent. They cost no faith (his faith is negative anyway); each has a cool-down instead, so the player can't spam them.

| Action | How | Effect |
|---|---|---|
| **Free revive** | Touch him when dead (decided above) | +faith ×2 for an Atheist |
| **Prayer in despair** | Below 10% HP in a fight, a short window opens: *"in despair, he whispers a prayer to nobody"*. Touching him then **works** | Heals him and gives a big faith boost (≈ 20 g): the foxhole prayer |
| **A sign** | Touch the sky / scene outside a fight | A light, a rainbow, a flight of birds. A small chance (rising with each sign) of a little faith: *"stares at the sky, unsettled"* |
| **A dream** | Touch the sleeping bag while he camps | A dream of the shrine: next time he finds one, he enters despite being Atheist |
| **Hidden blessings** | The professions touches (harvest, blessed craft, generous merchant) still work, because he doesn't know it's the god | After several lucky moments: *"feels someone is watching over him"*, +faith |
| **A pilgrim** | Touch the scene in a town | A believer NPC walks in and talks to him; small faith gain, more if he's a Doubter |
| **Rare relics** | Touch a chest or pot while he loots (Atheist only) | The loot becomes a rare relic (below) instead of gold |

**Rare relics** (the author's addition; a proposal). Each turns up only for an Atheist, when the god touches his loot, at most once every few levels. He keeps it in the bag (professions), and it works slowly, the way doubt does:

| Relic | Kind | Effect |
|---|---|---|
| **Forgotten psalm** | Scroll | He reads it at the next rest: faith moves a third of the way back toward 0. *"reads a few lines and can't stop thinking about them"* |
| **Pilgrim's medallion** | Worn (takes a ring slot) | While worn, every shrine he passes has a chance to make him enter, curious; each visit gives a little faith. He takes it off when he reaches Believer |
| **Shard of the Divine crosier** | Keepsake | A piece of the crosier from chapter II (Devotion). Holding it reminds him of who he was: one big jump to Doubter, once per wizard. Only if he reached chapter II |
| **Letter from a fallen wizard** | Scroll | Written by a wizard from the cemetery (by name) who died faithless and regretted it. A small faith gain and a story line |

### 3.7 The escape artefact and the story (decided: it exists, and it breaks)

The story notes already contain the mechanism twice:
- **Chapter VI (lvl 130, Corruption):** *"when about to die he teleports away and heals"*, the power of the **staff of corruption**. At **chapter VIII (lvl 149)** the lynching mob **strips the corrupt staff** from him. That's the first "break".
- **Chapter X (lvl 190, Disobedience):** *"no longer dies: at 0 HP he teleports away and heals completely"*, and he refuses all help.

**Decided (2026-11-12):** when he breaks with the god at **chapter X** he **writes the *Last Escape* himself**, a unique master version of the Scroll of teleportation (console lines for writing and using it are in `docs/STORY.md`). At 0 HP it tears him out of the fight and heals him; each use leaves a burn on it. In **chapter XI** at Heidan it **burns to ash** when he takes the reforged staff and the crown. **From then on the reforged staff, *{staffName}* (its true name is random: generated in the world's first game and kept for every later wizard and loop, `world.staffName`), raises him when he falls**, as the corrupt staff did in chapter VI. So there is **no true death from chapter X until the final battle**, which alone decides his end. No afterlife gods carry him: they court him in the story, but they play no part in the death mechanics.

### 3.8 Atheism and the story

- **Belief levels are the everyday system; the story can lock them.** Chapter X (*Disobedience*) forces **Atheist** and freezes it: from then on he refuses all help until the end, as the story notes plan, and the winning-back actions stop working. That's the one-way fate. Before chapter X, belief drifts both ways.
- Chapter III halves the multiplier (story notes) and chapter VIII/IX rules follow the notes, applied on top of belief levels.
- **"Atheist!" achievement:** reaching the Atheist level (or staying there for a while) instead of −10,000.
- New achievements: reaching Devout; climbing from Atheist back to Believer (*Repentance*, which matches chapter V's name).

### 3.9 Stats

Counters and records from "Track almost everything as stats": faith gained and spent by source (totals), highest and lowest faith (records, in g), times each belief level was reached, time spent at each level, touches refused, revives by the god vs self.

---

### 3.10 Playtest setup (decided: no decision without tests)

The offering question (cap, diminishing returns, fixed by level, keep the snowball) and every number in this plan are decided by **measured runs**, not by guessing.

- **Switches in `src/config.js`:** `offeringMode: "share" | "cap" | "sqrt" | "level"`, plus the belief meter's lines and weights, revive boost and shrine chance, so each option runs from the same code.
- **Simulated runs:** the headless browser runs already used in every phase (virtual time, boosted clocks), from level 1 to 100+, with two **god bots**:
  - *Idle god:* never touches. Shows the natural drift (toward atheism?).
  - *Active god:* heals below 30% HP, revives at once, tithes at every shrine, tries to win back an Atheist. Shows whether faith snowballs.
- **Measured per level:** faith (in g), time spent at each belief level, touches the god could afford, deaths and how he was revived, gold held.
- **Output:** a small table or chart per option, kept in `docs/playtests/`, so each decision is written down with its numbers.
- **When:** after step 1 of the build order (every faith change goes through one function), because the bots need it to count everything.

## 4. Code plan

- `src/config.js`: the belief meter (bounds, level lines, moment weights), shrine chance, offering caps, touch prices, revive cost.
- `src/wizard.js`: `g()` (the unit), `beliefLevel()` (from faith, with the margin), `faithChange(amount, source)`, one function every gain and loss goes through, so stats, belief changes and console lines happen in one place.
- `src/divine.js`: prices by belief level, revive cost, refusals.
- `src/events.js`: shrine chance and skip by belief level, offering cap.
- `src/combat.js`: self-revive time by belief level.
- `src/ui/render.js`: faith icon per level; the atheist achievement.
- `src/story.js`: chapter X locks Atheist (stage 3, with the story).

## 5. Build order

1. `faithChange()` and `g()`: route every gain and loss through one function, with no change in amounts. Check the pace stays the same.
2. Belief levels and their behaviour; the atheist achievement.
3. Revive cost, offering caps, shrine chance, the price list. Playtest how often each level is reached.
4. The professions touches on top (PROFESSIONS.md).
5. Story locks with stage 3.

## 6. Open questions

- **Offerings:** cap, diminishing returns, fixed by level, or keep the snowball: decided by the playtests (3.10).
- **Revive boost amount**, and whether farming needs a guard: playtests.
- The rescuers, the winning-back actions and the escape scroll's plot: to be confirmed (see Decisions).
