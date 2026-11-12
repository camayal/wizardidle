# Professions plan

A plan for the wizard's professions: reagents, recipes, what each item does, why it matters, and the new NPCs (vendors and trainers). Written 2026-11-11 from the author's notes and the hooks already in the code. Nothing here is built yet; it's stage 4 material (see [ROADMAP.md](ROADMAP.md)), and every number is a starting point for playtesting.

Sources:
- `wizardidle-old-ideas/Recetas.csv` (the 15 recipes, prices, difficulty) and `Help.txt` (the old *Comercio* and *Recolección* help pages). These are local only, outside the repo.
- `ideas.md`: the "Professions" entry, plus "Track almost everything as stats", "Unused sprites", "Ideas found in the v1 code comments" (robbery, inn brawl), the faith rebalance and the story.
- The code: `drop:` per zone (`src/data/zones.js`), `pFindMaterials` "scavenger skills" (`src/config.js`, raised by the Dwarf statue in `src/events.js`), and the `//ToDo: add some material or resource` for enemies without gold (`src/wizard.js`, end of the gold function).

---

## 1. What the author already decided

From the old help (translated):

> **Commerce:** the character can gather materials to develop **one of three** professions: Alchemy, Enchanting and Writing.
> **Gathering:** each zone has a specific material used by one of his professions.
> **Gold:** … obtained from loot when killing some humanoids, **trading**, finding treasures and playing dice.

So the original design was:
- **one profession per wizard**, out of three;
- materials come **from the zone** you're in;
- **trading** is a source of gold, which means someone has to buy what he makes.

### The recipe sheet has a hidden structure

Each profession has a **base reagent** that appears in all five of its recipes. Each recipe pairs the base with one of the other five reagents:

| Profession | Base reagent | Makes |
|---|---|---|
| Alchemy | Mushroom (*hongo*) | Potions (consumed) |
| Enchanting | Gem (*gema*) | Rings (worn) |
| Writing | Essence (*esencia*) | Scrolls (read once) |

The **price** (50 or 100) and **difficulty** (on a 1–5 scale where 5 is easy) follow from this. A recipe that uses **two base reagents** costs 100 at difficulty 2 (hard). A recipe that uses one base reagent plus a "common" one (bone, ectoplasm, herb) costs 50 at difficulty 4 (easier). All 15 rows follow this rule: each profession has 3 easy recipes and 2 hard ones.

Every profession uses **all six reagents**, so whatever he gathers is useful to him whichever profession he has.

The sheet's footer reads `Lugares 1,3,1,3,1,3 = 12`: **1 place** each for mushroom, gem and essence (the three bases, each used in 7 recipes) and **3 places** each for bone, ectoplasm and herb (each used in 3). The bases were meant to be scarce. The code today gives every reagent **2 zones** (12 in total too). The last three rows of numbers (`20,2,1,0,5,5,2` / `240,100,…` / `400,249,…`) look like simulation counts; I couldn't decode them.

---

## 2. Reagents

| Key (code) | Name | Zones today (`drop:`) | Base of | Used in |
|---|---|---|---|---|
| `hongo` | Mushroom | Forest, Swamp | Alchemy | 7 recipes |
| `gema` | Gem | Cave, Mine | Enchanting | 7 |
| `esencia` | Essence | Tower, Heidan | Writing | 7 |
| `hueso` | Bone | Grotto, Desert | | 3 |
| `ectoplasma` | Ectoplasm | Castle, Duenon | | 3 |
| `hierba` | Herb | Prairie, Tundra | | 3 |
| `NA` | (none) | City, Town, Dunes, Volcano | | |

The keys stay in Spanish (as in `zones.js` and the CSV) and the names shown to the player are in English, the same convention as zones and enemies.

**City and Town have no reagent, and that suits the plan:** they're where the shops are. Dunes and Volcano are open (see the questions at the end).

### How he gets them

1. **Kills that give no gold** (the ToDo in `src/wizard.js`). Enemies with `hasgold:"false"` (creature, slime, elemental, quent, spectre, skeleton, eye, umigubi, ether, pybrya, polypoid; bosses cuboq, etymos, infraespectro, kkck) drop **1–2 of the zone's reagent** instead of gold. Today they give nothing. This is the most natural hook and it costs no new event. It fits well: spectres and skeletons in the Castle drop ectoplasm, ethers in the Tower and Heidan drop essence. Rares drop ×`RAREMULTIPLIER`, and bosses drop a handful plus a chance at a non-local reagent.
2. **Gathering while exploring.** Inside `exploreEV()`, next to the loot roll: on `stat("pFindMaterials")` (0.2 + Dwarf statue) he "picks some herbs / digs out a gem / scrapes ectoplasm from a wall". It shows the mushroom sprite from `dg_food32.gif` (or a pick or sack sprite) and gives 1–3 of the zone's reagent. **It doesn't add a sixth master event**, so the event mix and the levelling pace (checked against v1 in every phase) stay the same.
3. **Loot.** Chests and pots sometimes hold a reagent as well as the gold (`getBotin()`).
4. **Buying** from vendors (section 6).

Reagents scale with **nothing**: a mushroom is a mushroom at level 1 or 200. What scales with level is the **effect** of what he makes and the **gold price** (section 5). This keeps the bag simple.

---

## 3. The three professions

### Who chooses

**Recommendation: the wizard chooses, once, and the god only watches.** That's the spirit of the game ("the player is a mere spectator"). It happens the first time he meets a trainer (section 6), at **level 10** or later. The choice is weighted by his trained skills: *intellect* (`pStudy`) leans toward Writing, *restoration knowledge* (`fHeal`) toward Alchemy, *avarice* (`pBotin`) toward Enchanting. Each new wizard can end up with a different trade, which makes the cemetery more varied ("Name (lvl 87, alchemist) died at…").

He can still **use** all 15 items. He just can't **make** the other professions' items; he buys them from vendors.

### Skill

Each wizard has one profession with a **skill level 1–100** (`state.profession = { id, skill, xp }`). Crafting raises it; failing raises it a little too.

- **Success chance** = `difficulty / 5 + skill / 200`, capped at 95%. A difficulty-4 recipe starts at 80%, a difficulty-2 recipe at 40%, and at skill 100 both reach 95%.
- **Failure** loses one of the two reagents (the non-base one) and prints a line ("the potion turns black and bubbles over").
- The **unlock order inside a profession**: the three easy recipes (50) from the start, the two hard ones (100) at skill 25.

### When he crafts: while resting

Crafting happens **during the rest event** (`innEV()` → `searchInn()`), as an extra step after he sleeps, when he has the reagents for something he wants (section 7). It needs no new master event and it reads well ("before sleeping he grinds mushrooms by the fire").

Flavour that also spreads the work across the map:
- **Alchemy** works anywhere: the campfire or the inn.
- **Enchanting** and **Writing** need a table, so they're **inn only** (City, Town, Desert).

---

## 4. Items and effects

Fifteen items. Each one hooks into a mechanic that already exists, so it has a visible effect. Effects scale with level where it makes sense (a % of max HP, not a flat amount).

### Alchemy: potions (consumed)

| Id | Item | Recipe | Effect | When the wizard uses it |
|---|---|---|---|---|
| `pocima1` | Health potion | mushroom + essence (100, hard) | Heals 40% of max HP | In a fight, below 25% HP, before casting a heal spell |
| `pocima2` | Mana potion | mushroom + ectoplasm (50) | For one fight: +attack chance, +heal chance (he "casts more") | At the start of a boss or hydra fight |
| `pocima3` | Vitality potion | mushroom + bone (50) | Full HP outside a fight, and he skips the rest | When he'd camp in the wild with no inn nearby |
| `pocima4` | Alcohol | mushroom + herb (50) | For one fight: +crit chance, −attack chance. Sells well in taverns | At the tavern, or to pay a bed when he has no gold (see the inn brawl idea) |
| `pocima5` | Golden potion | mushroom + gem (100, hard) | "Golden touch": the next 10 kills give gold ×3, even from enemies that carry none. A nod to King Midas | When the bag has no room for more reagents, or before a boss |

The game has no mana. **Recommendation: don't add it.** The Mana potion means "more spells this fight", using the chances the game already has.

### Enchanting: rings (worn)

Two ring slots (two hands). A ring adds to the wizard's skills through `stat()`, so the stats scroll shows it, then **wears out** after about 300 fights and cracks ("the ring of luck cracks"). This keeps the trade alive instead of finishing it after five rings.

| Id | Item | Recipe | Effect | Art (`anilos.png`) |
|---|---|---|---|---|
| `anillo1` | Ring of health | mushroom + gem (100, hard) | +15% max HP | pink |
| `anillo2` | Ring of magic power | essence + gem (100, hard) | +damage (`fAttack`) | blue |
| `anillo3` | Ring of natural integration | herb + gem (50) | +scavenger skills (`pFindMaterials`), +Nature school damage | green |
| `anillo4` | Ring of luck | ectoplasm + gem (50) | +crit chance, +avarice (`pBotin`). In the dice game: one free reroll per game ("loaded dice") | orange |
| `anillo5` | Ring of greatness | bone + gem (50) | +10% XP from kills | brown |

The colour mapping is a proposal; the five rings are already drawn.

### Writing: scrolls (read once)

Scrolls are about **the world, knowledge and the god**, so they link professions to the other big ideas (map revamp, study, faith, story).

| Id | Item | Recipe | Effect | When he reads it |
|---|---|---|---|---|
| `scroll1` | Scroll of reduction | bone + essence (50) | The next enemy (or boss) starts with 30% less HP | When a boss or hydra appears |
| `scroll2` | Scroll of teleportation | ectoplasm + essence (50) | **Escape:** leaves a fight he's losing and lands in another zone, without dying. After the map revamp: travel to a chosen or undiscovered place | Below 10% HP, when the enemy is still healthy |
| `scroll3` | Scroll of understanding | herb + essence (50) | The next rune, book or statue always teaches him, ×2 skill gain | When he finds a rune, book or statue |
| `scroll4` | Scroll of maximisation | mushroom + essence (100, hard) | The next fight's XP and gold ×2 | Before a boss, or at random |
| `scroll5` | Scroll of divine binding | gem + essence (100, hard) | Binds him to the god: for the next 50 events faith can't fall below 0, and divine touches cost half | When faith is about to cross below 0 |

**Divine binding and the story.** At chapter X (*Disobedience*, lvl 190) he breaks his bond with the god: he burns the binding scrolls he carries and can no longer read them. An atheist wizard (faith below 0 for a long time) refuses to write or read them.

---

## 5. Why it matters (importance)

1. **Kills that pay nothing start paying.** About a third of the enemy types (and four bosses) give no gold today. Reagents give them a reward.
2. **Gold gets uses.** Today gold only goes to offerings, the inn and dice. Vendors add a real **source** (selling surplus) and a **sink** (buying reagents and other professions' items). That's the old help's "trading".
3. **Fewer deaths, so faith matters differently.** Potions and the teleport scroll keep him alive without the god. That's the theme: **crafting is the faithless wizard's prayer.** An atheist wizard relies on his trade; a devout one on the god. This plays right into the faith rebalance and the atheist ending, and it should be **tuned together** with it (a wizard who never dies never loses faith to self-revives).
4. **Variety between wizards.** One trade per wizard makes each run a bit different, and the cemetery remembers it.
5. **Hooks for stats and achievements** (section 9) and for the story (chapter III "seeks knowledge and artefacts": the scribe; chapter X burns the binding scrolls).

### Gold prices scale with level

A flat 50 or 100 gold becomes meaningless by level 30, because gold per kill grows with HP (`hpBase × rGold`). So the sheet's price becomes a **multiplier of a kill's gold**:

- **Sell price of an item** = `price / 50 × goldPerKill(lvl) × 3`, where `goldPerKill(lvl) = hpBase × rGold × 1.5` (the average of the random range). An easy potion sells for about 3 kills, a hard one for about 6.
- **Reagent:** buy at ~1 kill's gold, sell at ~⅓.
- **Vendor margin:** they buy at 50% of the price and sell at 100–150%, depending on the vendor.

---

## 6. New NPCs: vendors and trainers

Vendors live where there's no reagent: the **City**, the **Town**, and the inn of the **Desert**. They appear the same way the dice house does: an explore event while in that zone (`exploreEV()`), with its own background and NPC sprite.

| NPC | Where | Role | Buys | Sells | Art available |
|---|---|---|---|---|---|
| **Travelling merchant** | Any zone, rarely (explore event) | The main trader: carries the reagents of **other** zones | Any reagent, any item | 2–3 random reagents, sometimes an item | **`comerciante.pdn`** (32×32 merchant, already drawn) |
| **Herbalist** | City | Alchemy trainer | Mushroom, herb, potions | Potions, mushroom, herb | potions shop front (`dg_town932.gif`), townsfolk (`dg_people32.gif`) |
| **Jeweller** | Town | Enchanting trainer | Gem, rings | Rings, gems | magic or jewellery shop front |
| **Scribe** | City (until chapter VII), then the Town | Writing trainer | Essence, scrolls | Scrolls, essence | books shop front, *Rumors* scroll (`townactions.gif`) |
| **Tavern keeper** | Inns (City, Town, Desert) | Buys drink; host of the inn and, later, the card game | Alcohol (the best price) | A bed (exists), food | inn interior tiles (`L2_*`), food (`dg_food32.gif`) |
| **Fence** | City, at night or at random | Buys anything, at 30%, no questions asked | Everything | Nothing | rogue sprites (`el_Pillo`, `la_Pilla`) |

Notes:
- **Trainers** are where the wizard picks his profession (section 3), the first time he meets one at lvl 10+. Afterwards he can visit his own trainer to learn the two hard recipes faster (a skill boost for gold).
- **The scribe and the story:** the Tower's mages go into exile at chapter VII, and the scribe moves from the City to the Town. That's a small "story changes the world" moment.
- **Robbery** (an idea from the v1 comments): a rogue sometimes steals **one item** or some gold while he sleeps in the wild. The fence sells it back.
- **Inn brawl** (idea from the v1 comments, "add event of fight if have not gold"): when he can't pay for a bed, he pays with an Alcohol potion if he has one; otherwise a brawl starts.
- **Healer:** stays as the god's representative and **doesn't trade**. It still charges faith, never gold.

### Before adding the vendor hook: a v1 quirk

In `exploreEV()` the dice-house check is `YesOrNot(pDados) && zone == "la_Ciudad" || zone == "el_Poblado"`. Operator precedence turns this into "(chance and City) or Town", so **in the Town every explore that doesn't find loot goes to the dice house**. Vendor events in the Town would never get their turn. Decide whether this was intended before adding vendors there, and if it wasn't, fix it with brackets in the same change (it changes the pace in the Town, so record it).

---

## 7. How the wizard decides (idle rules)

The player never presses "craft" or "buy". The wizard follows simple rules, and the console tells the story:

- **What to craft:** the recipe he has the reagents for whose product he holds the fewest of. Ties go to the easier recipe. He keeps **one reagent of each** in reserve when he can.
- **What to sell:** at a vendor, everything above the bag's soft limit (section 8), and alcohol always at the tavern.
- **What to buy:** the missing reagent for his best recipe, if he has more than ~20 kills' worth of gold; a Health potion when he has none and it isn't his trade.
- **What to use:** the "when" column of the tables in section 4. One item per fight at most, so a fight doesn't become a list of potions.
- **Faith twist:** below 0 faith he uses potions earlier (he trusts himself, not the god). Above a high faith he sometimes **offers** a crafted item at a shrine instead of gold (more faith than the same value in gold).

### The god's part (the player)

Today the god's only tool is the **touch**, always priced in faith (`src/divine.js`): touch the wizard to heal or revive him, touch the enemy to hurt it, touch the scene at a shrine to ask for a gold tithe (gold to faith). Professions use the same tool.

**Rule: the god never gives orders, only blesses.** No "craft", "buy" or "sell" buttons, and the bag stays view-only. The god acts by touching the scene at the right moment, pays in faith, and a faithless wizard can refuse.

| Moment | God's touch | Effect | Faith |
|---|---|---|---|
| He **gathers** (reagent sprite on screen) | Touch the reagent | **Bountiful harvest:** ×2 yield, sometimes a base reagent from another zone | small cost |
| He **crafts** at rest | Touch the wizard | **Blessed craft:** success guaranteed and the item comes out *blessed* (stronger, golden name, sells for more) | medium cost, more for hard recipes |
| He **trades** with a vendor | Touch the merchant | **Generous merchant:** better prices. The reverse of the tithe: faith becomes gold | cost grows with the deal |
| He **visits a shrine** carrying items | Touch the shrine (the tithe touch) | He offers a **crafted item** instead of gold, worth more faith than its gold value; a blessed item is worth double | gains faith |
| He **chooses his profession** | Touch one trainer | **Sways the choice** towards that trade; the god's only say in it. Only works with faith above 0 | large, once per wizard |
| He'd **drink a potion** in a fight | Touch the wizard (existing heal) | A divine heal makes him keep the potion for later | same cost as today |

Faith and the story:
- **Below 0 faith he refuses:** blessing a craft does nothing ("I need no god for this"), and he never offers items at shrines. Crafting stays the faithless wizard's way to survive, so the atheist path keeps working.
- **Scroll of divine binding** halves the cost of these touches for a while: the one item that makes him easier to help.
- **Chapter X** (he breaks his bond): every blessed item he carries loses its blessing.
- **Optional:** a sixth "holy" recipe per profession (holy water, a ring of devotion, a scroll of prayer) that he can only learn while faith is high. It would reward a devout run as potions reward an atheist one.

The two touches that matter most are the **blessed craft** and the **generous merchant**: they spend faith in both directions (to craft better, or to trade for gold), so they have to be tuned together with the faith rebalance.

Code: each touch is a new branch in the scene-touch handlers of `src/divine.js`, checking what is on screen (`run.previousEvent`, `state.npc`) the same way the shrine tithe does. Counters: `bless_gather`, `bless_craft`, `bless_trade`, `offerItem_<item>`, `blessRefused`.

---

## 8. The bag (inventory)

- `state.bag = { reagents: { hongo: 0, … }, items: { pocima1: 0, … }, rings: [ { id, fightsLeft } ] }`. It's saved in `wizardidle2:save` with the wizard. A dead wizard's bag dies with him.
- **Limits:** 20 per reagent, 5 per item, 2 rings worn. When everything is full: the *inventario lleno* (full inventory) achievement, which already has its icon.
- **A bigger bag** (30 / 8) from the merchant for a big price: a gold sink, once.
- **Where the player sees it:** a "Bag" section on the stats scroll first (cheap). A scroll of its own with the item icons later (there's a coin-bag icon in `townactions.gif`).

---

## 9. Stats and achievements

Following "Track almost everything as stats":

- **Counters** (`count()`): `gather_<reagent>`, `gather_zone_<zone>`, `craft_<item>`, `craftFail_<item>`, `use_<item>`, `sell_<item>`, `buy_<item>`, `vendor_<npc>`, `ringCracked`, `escapedByScroll`.
- **Totals:** gold earned trading, gold spent at vendors.
- **Firsts:** the level and age of the first craft, the first ring, the profession choice.
- **Achievements** (they need titles and icons, except the first):
  - *Full inventory* (`logro_inventariolleno`, placeholder exists): everything in the bag full at once.
  - *Rich* (`logro_ricachon`, placeholder exists): could include gold earned trading.
  - New: master of his trade (skill 100); the 5 items of his profession made; 100 potions drunk; saved from death by a scroll; a ring worn until it cracks.

---

## 10. Code plan

New files:
- `src/data/recipes.js`: the 15 recipes from `Recetas.csv` with their original ids (`pocima1`, `anillo1`, `scroll1`), reagents, price and difficulty; plus the reagent names. Pure data, like the other data modules.
- `src/professions.js`: `gather(zone, amount)`, `canCraft()`, `craft()`, `useItem(id)`, `wearRing()`, `trade(vendor)`, `chooseProfession()`.
- `src/data/vendors.js`: who sells and buys what, where, and their margins.

Changes to existing code:
- `src/config.js`: drop amounts, the gathering chance, success formula, price factors, bag limits, ring wear. No balance numbers in the save, as decided.
- `src/state.js`: `bag`, `profession`, defaults. The save version handles a missing `bag` in older saves (as the plain-JSON loader does for other new fields).
- `src/wizard.js`: the no-gold ToDo becomes `gather()`. `stat()` adds worn rings.
- `src/events.js`: gathering and vendor rolls in `exploreEV()`, a crafting step in `searchInn()`, reagents in `getBotin()`, Scroll of understanding in the study events.
- `src/combat.js`: potion and scroll use inside the fight, golden touch on rewards, reduction on enemy HP.
- `src/divine.js`: divine binding and faith costs.
- `src/minigames/sixFiveFour.js`: the Ring of luck reroll.
- `src/ui/scrolls.js`: the Bag section on stats; the old help pages **Commerce** and **Gathering**, back in English.

---

## 11. Build order

Each step is playable on its own and checked for pace against the previous version, as in every phase so far.

1. **Reagents and the bag:** drops from no-gold kills, gathering while exploring, loot, the Bag section on stats, counters. Nothing to spend them on yet, but the numbers show whether the drop rates feel right.
2. **The travelling merchant:** selling reagents for gold. That's the first use, and it tests the price scaling.
3. **Alchemy and the herbalist:** profession choice, skill, crafting at rest, the five potions and their auto-use. The biggest step; potions touch combat and faith.
4. **Enchanting and the jeweller:** rings, slots, wear, the dice reroll.
5. **Writing and the scribe:** the five scrolls. Teleportation ships as "escape" first and becomes travel after the map revamp; divine binding waits for, or ships with, the faith rebalance.
6. **The rest:** tavern keeper and alcohol, the fence and robbery, the inn brawl, achievements, the help pages.

---

## 12. Open questions

- **One profession or all three?** The old help says one of three, and this plan follows it. Should the wizard ever be able to change trade (at a cost) or learn a second one late in the story?
- **Who chooses:** the wizard, weighted by his skills, with the god's one paid nudge (the trainer touch)? Or the wizard alone?
- **God's touches:** are the six in "The god's part" too many? Which ship first (recommended: blessed craft and generous merchant)? Should the holy recipes exist?
- **Scarcity:** keep 2 zones per reagent (code today) or go back to the sheet's 1 zone for the bases and 3 for the rest?
- **Dunes and Volcano** have no reagent: leave them empty, give them existing ones (bone for the Dunes, gem for the Volcano), or add a seventh reagent (ash, ember) for a later recipe?
- **Rings wear out** (recommended, to keep the trade useful) or last forever?
- **Mana:** keep the game without mana and make the Mana potion "more spells this fight" (recommended)?
- **Divine binding:** is it right that an atheist wizard refuses it, and that chapter X burns it?
- **Shops as places:** are vendors a scene in the zone (like the dice house), or the start of the inner maps for the City and Town (map revamp)?
- **The Town dice-house quirk** (section 6): intended, or a precedence bug to fix?
