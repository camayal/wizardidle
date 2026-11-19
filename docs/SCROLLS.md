# Scroll looks plan

Two notes from the author (2026-11-18):

- *"Would it be a nice idea to make each scroll a little more thematic instead of the same parchment? The cemetery with a grass background; the inventory with a wooden texture and crates; the stats and the bestiary kept as parchment, or each with its own look."*
- *"Faith scroll: improve its graphic design, it needs to look more divine; the belief meter needs to be more artistic (art from the artist may help)."*

The second is one case of the first, so they share this plan. Dev and the artist wait for the author's OK before building or drawing.

## Decisions (by the author)

| Date | Question | Answer |
|---|---|---|
| 2026-11-18 | Themed scrolls | **A: themed trim on the shared parchment.** Faith and the cemetery deserve it most; stats, achievements and help stay plain |
| 2026-11-18 | The faith scroll's look | **A: illuminated manuscript** (4.1) |
| 2026-11-18 | The belief meter | **The stained-glass arc plus the candle** (the author's mix of A and B): the arc shows how close he is to the next level, the candle gives the level at a glance, cold wax when *Lost*. How they fit: 4.2 |
| 2026-11-18 | Order of work | **A: the faith scroll is the pilot.** The artist draws options, the author picks in the art dev console, then the cemetery and the inventory, the rest later if worth it |

## 1. Themed scrolls: pros and cons

Today one parchment style serves every scroll: stats (with the inventory tab), achievements, help, kill (bestiary, cemetery), map, faith, and the chapter scrolls.

**Pros of themed scrolls**

- Each scroll is known at a glance: you can tell where you are before reading a word.
- Flavour: the cemetery feels like a graveyard, the inventory like a storeroom, the faith scroll like something holy.
- The faith redesign stops being a lone exception and becomes the first of a family.
- The artist gets small, self-contained pieces to draw (a good fit for "options first").

**Cons of themed scrolls**

- **The parchment is part of the story.** The scroll is how the wizard's world reaches you, the god ([STORY.md](STORY.md)). If the inventory becomes a wooden crate, the idea of "pages you read" weakens.
- **Readability.** Text and small icons on grass or wood grain are harder to read than on plain parchment, mostly on phones.
- **Tabs that change look.** The kill scroll holds the bestiary and the cemetery; the stats scroll holds the inventory. A full theme per tab means the scroll changes its whole look when you switch tabs, which can feel like opening another window.
- **Upkeep.** Every new widget (button, tab, list, popup note) must be checked on every theme. With the landscape and watch layouts planned (thinker notes, 2026-11-15), each theme must also stretch to more sizes.
- **Art cost** grows with every full texture (see 3).

## 2. Options

**A. Themed trim on the shared parchment (recommended).** Every scroll keeps the same parchment page, frame shape, tabs and text area, so text always sits on plain parchment. Each scroll gets its own **border, corner ornaments and a header piece**, and themed **content pieces** where they fit:

| Scroll | Trim | Content pieces |
|---|---|---|
| Faith | Gold-leaf illuminated border, rays from the header, a lighter vellum tint | The belief meter (see 4) |
| Kill: cemetery | Moss and grass creeping up the bottom edge, a wrought-iron header | The tombs already drawn |
| Stats: inventory | A wooden frame | Inventory slots drawn as small crates or shelves |
| Kill: bestiary | Claw marks or a hunter's leather corner | none |
| Map | A compass rose corner | none |
| Stats, achievements, help | Plain parchment (the default) | none |

Like an illuminated manuscript: one book, each chapter with its own illumination. Switching tabs only changes the trim, so it never feels like another window.

**B. Full themed backgrounds.** Grass behind the cemetery, wood behind the inventory, and so on. The strongest flavour, with all the costs in 1.

**C. One parchment for all; only the faith scroll changes.** Cheapest, and it keeps today's unity, but the faith scroll then stands alone.

## 3. What it costs the artist

- **A:** per themed scroll, one border set that stretches to any size (four corners plus edge pieces that repeat) and one header ornament. Content pieces (crate slots, the belief meter) are separate sprites. Corners and edges fit every layout without being redrawn.
- **B:** per scroll, a full texture that repeats without visible seams at every size, plus text, button and tab colours checked on each texture. Several times the work of A, and readability needs testing on a phone.
- **C:** only the faith set from A.

Under any option the artist draws options first on one scroll (faith), the author picks in the art dev console, then the rest follows in the same style.

## 4. The faith scroll

### 4.1 Look

- **Illuminated manuscript (recommended):** gold-leaf border with vines, soft rays fanning down from a header ornament (a halo or a small sun), a lighter, warmer vellum than the other scrolls, and a few slow motes of light drifting over the page.
- **Temple tablet:** pale stone with gold inlay, as if carved at a shrine. Holy, but heavy, and stone reads less like a scroll.
- **Night sky:** deep blue vellum with stars and gold letters. Striking, but light text on dark breaks with every other scroll and is harder to read.

### 4.2 The belief meter

Belief runs from −100 to +100 across four levels (Devout, Believer, Doubter, Atheist), and at chapter X it becomes *Lost*, shown as a symbol ([FAITH.md](FAITH.md) 3.1). The god decides whether to touch based on how close the wizard is to the next line, so the meter should show **the level and roughly where in it** he stands.

- **Stained-glass arc (recommended):** a half-circle window of four panes, one per level, from dark (Atheist) to radiant (Devout). Light fills the arc up to his belief, and a small marker shows the exact point. When belief rises, the pane flares; when it falls, it dims. *Lost:* the glass goes dark and cracks, and the lost symbol sits in the middle.
- **Candle:** a tall flame with a halo for Devout, a steady flame for Believer, a guttering one for Doubter, a smoking wick for Atheist, and cold wax for *Lost*. Very readable at icon size and tied to the shrines, but it shows only the level, not how close he is to the next line.
- **Sun and eclipse:** a full sun for Devout, slowly eclipsed down to a black sun for Atheist; *Lost* is a sun that's fully gone. Shows the value, but the middle steps look alike.
- **Scales:** light against dark. Shows the value, but reads like justice more than faith.

**Decided: the arc and the candle together.** How they fit:

- **On the scroll:** the candle stands at the foot of the arc, in the middle of the half-circle, like a candle lit before a church window. The arc gives the exact value; the candle gives the level at a glance. Its glow lights the panes from below, so the two read as one picture.
- **The candle's four states** follow the level: a tall flame with a halo (Devout), a steady flame (Believer), a guttering flame (Doubter), a smoking wick (Atheist). It flickers gently while lit.
- **When belief moves:** a gain makes the pane flare and the flame jump; a loss dims the pane and makes the flame shrink and gutter. When the level changes, the candle shifts to its new state.
- ***Lost:*** the glass goes dark and cracks, the candle is cold wax, and the lost symbol sits in the arc above it.
- **In the heading** (next to faith): the candle alone, small. It reads at icon size where the arc would not, and it's the same object the god sees on the scroll.

The artist draws options for the arc and the candle together, as one piece.

Faith, the currency, stays a number with its own icon on the same page.

### 4.3 Question for dev (to paste)

> Thinker here, for the faith scroll redesign (docs/SCROLLS.md). What does the faith scroll show today, from top to bottom (faith number, belief bar, level name, shrines, offerings, anything else)? Is the belief bar drawn by code or a sprite, and does the heading have a belief icon yet? Can one scroll page have its own border without changing the others, and can a small sprite animate on a scroll (a candle flicker)?

## 5. Order (decided)

1. The faith scroll as the pilot: the artist draws options for its border and the belief meter, the author picks.
2. If the pilot reads well, the cemetery and the inventory follow in the same style.
3. The rest only if they're worth it.

## 6. Open questions

None left; all four answered (see Decisions). Waiting on dev's answer to 4.3 before the artist starts.
