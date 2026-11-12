# Faith rebalance plan

A plan to rebalance faith: how the wizard gains and loses it, what the god (the player) can do with it, and how belief and atheism work. It must **keep the atheist ending possible**, and it's tied to the professions plan ([PROFESSIONS.md](PROFESSIONS.md)), where every god touch is priced in faith. Written 2026-11-12 from the code and `ideas.md` ("Rebalance faith and player interaction", the story notes). Nothing is built yet.

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

### 3.1 Belief levels

Turn the number into **four belief levels**, measured in g so they scale with level. Each one changes how the wizard **behaves**, so the road to atheism (or devotion) is visible.

| Level | Faith | Behaviour |
|---|---|---|
| **Devout** | above +300 g | Enters shrines more (+15%), offers more, sometimes offers crafted items; the god's touches cost 25% less |
| **Believer** | 0 to +300 g | Today's behaviour |
| **Doubter** | −300 g to 0 | Enters shrines less (−15%); the god's heal and hit touches **work but cost double**; "doubts" lines in the console |
| **Atheist** | below −300 g | Never enters shrines (no skip penalty either: he doesn't care), **refuses every touch** except a revive, relies on potions and scrolls (professions), self-revives faster |

The console announces each change ("starts to doubt his god", "no longer believes in anything"). The heading's faith icon can change with the level (art to draw).

**Drift with a margin:** to climb back from Atheist to Doubter, faith must pass −200 g, not −300 g, so it doesn't flicker at the edge.

### 3.2 Revival costs faith

- **Divine revive** costs **10 g** (twice a self-revive's 8 g, because it's instant and at full HP). The god can always revive, even at negative faith: it's the last bond and it pushes faith down.
- An **Atheist** revived by the god: *"wakes up and curses the healer"*. It works but costs double.
- **Self-revive** stays at ≈ 8 g; an Atheist does it in 1 minute instead of 2.

### 3.3 Offerings don't snowball

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
| Revive | 10 g (Atheist 20 g) |
| Tithe (touch the shrine) | gains up to 40 g |
| Professions (from PROFESSIONS.md) | harvest, blessed craft, generous merchant, item offering: priced with the tithe rate |

### 3.6 Atheism and the story

- **Belief levels are the everyday system; the story can lock them.** Chapter X (*Disobedience*) forces **Atheist** and freezes it: from then on he refuses all help until the end, as the story notes plan. That's the one-way fate. Before chapter X, belief drifts both ways.
- Chapter III halves the multiplier (story notes) and chapter VIII/IX rules follow the notes, applied on top of belief levels.
- **"Atheist!" achievement:** reaching the Atheist level (or staying there for a while) instead of −10,000.
- New achievements: reaching Devout; climbing from Atheist back to Believer (*Repentance*, which matches chapter V's name).

### 3.7 Stats

Counters and records from "Track almost everything as stats": faith gained and spent by source (totals), highest and lowest faith (records, in g), times each belief level was reached, time spent at each level, touches refused, revives by the god vs self.

---

## 4. Code plan

- `src/config.js`: belief thresholds (in g), shrine chance, offering caps, touch prices, revive cost.
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

To be asked as choices (see the Decisions section once answered).

- What feels off when playing: too much faith, touches too expensive, too easy or too hard to become atheist?
- Four belief levels, or fewer (believer / atheist)?
- Should the god's revive cost faith, and should it work for an atheist?
- Cap offerings, or keep the share-of-gold snowball?
- Atheism drifting both ways until chapter X (proposed), always reversible, or one-way once reached?
- Should the god's absence (idle player) push toward atheism, as it does now through skipped shrines and self-revives?
