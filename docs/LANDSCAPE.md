# Big screens in landscape

Plan for tablets and computers held wide: the game gets columns, so a scroll opens beside the scene instead of over it. From the author's notes of 2026-11-15 (the smartwatch idea is parked at the end). No code yet; dev waits for the author's OK.

## What the game does today

- Two layouts, picked by the device name in the browser (phone/tablet list), not by the window size.
- Computers always get the upright layout: one centred column (heading with the six buttons, scene, console), the game square is half the window height. On a wide monitor about two thirds of the screen is empty.
- Phones held sideways get the scene and heading only: no console, no buttons; turning the phone closes an open scroll (except a story chapter).
- There is one scroll. It opens over the same column, the scene drops below the console, and the six buttons stop working until it closes. Opening another scroll means close, then open.
- Recent iPads say they are a Mac, so they already get the computer layout.

## The idea

At rest nothing changes: the game sits centred, buttons in the heading, as today. Opening a scroll slides the game to the left and unrolls the scroll in a column to its right, full height. The game keeps playing beside it, the scene stays on top, and the buttons keep working.

- A second scroll opens in a third column when the screen is wide enough (a 16:9 monitor fits three columns: the game square is about 0.3 of the width), otherwise it replaces the first. A third scroll replaces the oldest.
- Tapping the button of an open scroll closes that one. The close button on a scroll closes it; when the last one closes, the game slides back to the centre.
- The map scroll, while open beside the game, follows the wizard: the marker moves when he travels. The stats scroll keeps counting. This is the part that makes columns worth it in an idle game: you watch the scene and the numbers at once.
- The author's other reading of the note (a fixed side panel with the buttons, then the live map, then the stats, a scroll replacing the buttons panel) is option B in question 1.

## Columns

- Order: game, then scroll columns to its right (question 5 has the other orders).
- Width: each scroll column is as wide as the game column today (the game square plus its frame), so scroll pages, tabs and the map keep the shape they have now and need no new art.
- Height: the scroll uses the full window height; its parchment stretches as it does now.
- The heading (name, XP plate, level, HP, gold, faith) and the console stay in the game column, under and over the scene as in the upright layout.

## Scene sharpness, walk line and overlays

- The scene is 256 art pixels wide. It stays sharp only when each art pixel covers a whole number of screen pixels; otherwise some pixel columns come out one screen pixel wider, which shimmers when a sprite walks.
- In wide mode the game square snaps down to the largest whole multiple of 256 screen pixels that fits the window height (counting the screen's pixel density). The game may be a little smaller than half the height, never blurry.
- The walk line, the head level and the sprite size are already fractions of the game square (head at row 24 of 256), and the front overlay canvas shares the scene's box. So they scale with the snap by themselves and land on whole art pixels. The same holds for the god's touch zones over the scene.
- The heading and console text scale with the square as now; they do not need snapping.
- The same snap could help today's centred computer layout too (step 2 below).

## What breaks on phones

- Phones keep their layouts. The wide mode needs a window both wide and tall enough, so a big phone sideways (wide but short) still gets today's scene-only view.
- Turning a phone closes scrolls; turning a tablet in wide mode must not (it moves the scroll between the column and the centred overlay instead).
- Today the choice is by device name; a size test would move some tablets and small laptop windows between layouts. Narrow or upright windows fall back to the centred layout.
- The dev side panels sit left and right of the game on a computer, which is where the scroll columns would go. Wide mode has to share the space with them, or the author cannot test it on the dev build.
- The name screen stays centred in every layout.

## First small step for dev

One scroll beside the game, nothing more: on a computer window wider than it is tall, opening a scroll moves the game left and shows the scroll in a column to its right, the scene stays on top, the buttons stay live, and opening another scroll swaps the page in that column. Closing it re-centres the game. No second column, no snap, no live map yet. The author tries it in the dev build and says yes or no to the rest.

Then, each after the author's OK:
1. Scroll beside the game (above).
2. Snap the game square to whole art pixels (wide mode, maybe the centred layout too).
3. The live map and stats while open.
4. The third column on wide screens.
5. Wide mode by window size on tablets.

## Question for dev

Paste to dev (answers shape steps 1 to 3):

```
1. Scene canvases: drawn at 256x64 and stretched by CSS, or drawn at display size with smoothing off?
2. Could two scrolls be open at once, or do the pages (stats clock, map, tabs, faith) assume the one #scrollText?
3. If a scroll stays open while the game runs, does the map marker or the stats page refresh by itself?
4. On a computer, do the dev side panels push the game aside or float over it?
```

## Later: smartwatches

The note: the scene takes most of the face, level and HP above it, one button below that opens the list of scrolls. Parked: watch browsers barely run web apps today, so there is nothing to test on. Revisit if the game gets a native wrapper.

## Decisions

Open (asked one at a time, answers recorded here):

1. Column model. DECIDED (2026-11-20): columns appear only when needed, as in the plan.
2. Is the game live while a scroll is open beside it? DECIDED (2026-11-20): fully live and clickable, story chapters too.
3. What switches wide mode on? DECIDED (2026-11-20): the window size (wide and tall enough), on any device.
4. Sharpness: snap the scene or fill the height?
5. Column order.
6. Smartwatch layout.
