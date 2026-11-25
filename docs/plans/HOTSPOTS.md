# Hotspots: nudging by clicking the scene

Design for step 6 of the faith plan ([for_implementation_faith.md](for_implementation_faith.md), section 6, and the author's decision of 2026-11-25). **Status: design decided (author, 2026-11-25). Steps 1 to 4 built 2026-11-25; untested in a browser, and no spot is authored yet. Headless runs with a bot that nudges (`god=active&nudge=1`) ran without errors and walked more (163 zone changes against 112 over 40 levels).**

## 1. What the author asked for

The god can nudge the wizard by clicking things in the scene, with text in the console: a rune, a book, a destination, a cave or mine mouth, and any area of an intersection (for example the Tower crossing: clicking a part of it suggests he goes that way). So scenes need **clickable spots in their data**.

## 2. Today

- The scene has three transparent buttons that cover it: left (the wizard: heal or revive), centre (the scene: tithe at an altar, or "leave the offer"), right (the enemy: hit, or "take the offer").
- Nothing in the scene itself is clickable. Finds (runes, books, statues, chests), mouths, doors and exits exist only as code and art positions: `STATUE_X`, `mouthDoors` (data/connectors.js), `findSpot`, the board/post spot (events.js), `READ_SPOT`.
- Where he goes next is decided by `moves()` and `destinations()` (travelGraph.js, the author's manual links) and steered by quests (`steer()`).

## 3. The idea in one paragraph

A **hotspot** is a rectangle on a scene that means "he could go or do this here". The player taps it; the god **spends a little faith**; a console line says what the god suggested; the spot glows. The suggestion is a **pending nudge** that the wizard's next decision may follow, by his belief (Devout almost always, Believer usually, Doubter about half, Atheist rarely and then he thinks it was his idea). A refused nudge still costs the faith.

## 4. Kinds of hotspot

| Kind | Where it comes from | What the nudge does |
|---|---|---|
| **find** (rune, book, statue, chest, pot) | made at run time at the find's position (no authoring) | next, he goes to it and studies or opens it |
| **prop** (board, wanted post, stranger) | made at run time where the prop stands | he walks up and reads it / talks to the stranger |
| **place** (shrine, inn door, dice house, guild, healer-free) | the scene's known door x (already in the data) | his next event is that place |
| **mouth** (cave, mine, canyon, ladder) | `mouthDoors` positions | his next trip crosses that connector |
| **exit** (intersections, towers, bridges, borders) | **authored by hand** (dev mode below) | his next move goes to the scene or zone that spot leads to |

The first four need no authoring: the code already knows the positions. Only **exits** need the author, and only where a scene really has several ways out.

## 5. The data

`src/data/hotspots.js`, written by a dev mode like `travelOverrides.js` (do not edit by hand):

```
hotspots = {
  la_Torre3: [ { x: 20, y: 8, w: 40, h: 48, kind: 'exit', to: 'la_Torre1', label: 'the stairs up' }, ... ],
  ...
}
```

- Units: sprite px of the 256 x 64 scene, like the other scene positions. `to` is a stage (a `moves()` neighbour or any reachable stage), a zone, or a connector point.
- A spot may be limited (`when`: only while a quest or a flag is true) later; not in the first version.
- Scenes with no authored exits just have the automatic spots.

## 6. Layer and taps

- A fourth transparent layer over the three buttons holds one button per **active** hotspot. A tap on a spot is handled first; anywhere else the three old buttons work as today.
- **No hotspots during a fight** (the enemy and the wizard buttons own the scene then) and while a scroll covers the scene.
- Touch size: a spot is never smaller than about 24 sprite px wide, however small its art.

## 7. The nudge

1. Tap on a spot. Needs faith for `nudgeCost` (placeholder: about two prayers' worth, a number for the playtests). Without enough faith: a console line and nothing happens.
2. Console line, by kind: *"You turn his eyes to the rune"*, *"You point him toward the cave"*, *"You urge him toward the stairs"*. The spot glows (the glow colour will follow the god's face).
3. One pending nudge at a time; a short cool-down so the player cannot spam. It **expires** after a few events or when the scene changes.
4. At his next decision the wizard follows it or not (roll by belief). Followed: *"{name} follows your hint and goes to the rune"*. Refused: *"{name} shrugs it off"* (Atheist: *"he thinks it was his own idea"*, and then he may even follow it). Belief does not move on nudges (plan, section 6).
5. Stats: nudges by kind, followed, refused, faith spent. Achievements later.

## 8. Quests and nudges together

The wizard on an errand keeps his errand unless the nudge is followed; then the quest resumes from where he is (the quest steering already routes from his current stage). A **secret** quest still jumps the queue. A nudge never completes or cancels a quest (only the god's order and cancel do that).

## 9. Letting the player find the spots

**No marks at all (decided):** pure discovery. The Information scroll already says the deity can interact with the environment. The answer is the console: when a tap lands on a spot, the line depends on his belief (*"a good idea, he goes"*, *"I will obey you"*, a Doubter's *"why not"*, an Atheist's *"his own idea"*), so the player learns what works by trying. A tap on nothing says nothing and costs nothing.

## 10. Authoring tool

Dev mode **Modes > Hotspots**: the scene picker, drag a rectangle on the scene, choose the kind and the target (a stage picker like the Travel mode), a label, save to `src/data/hotspots.js` through `tools/serve.py`. Spots show as outlines while the mode is open. Exits first for the intersections and the Tower; the author places them over time, and the game works with none.

## 11. Build order

1. Data file, the hotspot layer, taps, glow, console lines, the dev mode (kind `exit` only).
2. Automatic spots from finds, props, places and mouths.
3. The nudge: cost, pending, expiry, following by belief, stats.
4. Steering: exits and mouths feed travel's `steer`/`moves`; finds and places feed the event picker.
5. The author's authoring pass; playtests of the follow chances (the bots gain a "nudge" action).

## 12. Questions for the author (answers go in Decisions)

1. **How does the player know a spot is there?** (a) nothing is shown, the cursor changes on desktop; (b) a faint pulse for a second when the scene appears, only while the god can afford a nudge; (c) spots stay hidden until the first successful nudge of that kind, then shimmer. (Recommended: b.)
2. **Nudge or order for finds and places?** A nudge on a rune or a book: does he need to *want* it (roll by belief), or does a Believer or Devout always go? (Recommended: roll by belief, as in section 7.)
3. **Does a followed nudge override a quest trip?** (a) yes, he detours, then resumes; (b) only when the nudge leads toward the same zone as the quest; (c) never during a quest. (Recommended: a.)
4. **Cost.** One flat cost, or more for far trips (a mouth costs more than a rune)? (Recommended: flat to start, tune in playtests.)

## Decisions

1. **Visibility:** no marks, no pulse, no glow before a tap. Discovery only; the console answers each tap by belief. (Section 9. The glow after a successful tap stays.)
2. **Following:** belief rolls (Devout nearly always, Believer usually, Doubter about half, Atheist rarely); a refused nudge still costs faith.
3. **Quests:** a followed nudge is a detour; the quest resumes from where he ends up. A nudge never completes or cancels a quest.
4. **Cost:** flat, one number in config, tuned by playtests.
- **One touch of the environment per scene (author, 2026-11-25):** the first tap in a scene visit counts; every later tap, on the same spot or another, does nothing and shows nothing (no text, no glow, no cost). A tap with too little faith, or while a nudge is still pending, is silent too, so nothing reveals where a spot is. During a fight, in an altar scene or while a job is waiting, a tap falls through to the old buttons.
- **What got built for each kind (2026-11-25):**
  - **find** (rune, book, statue): made by the code while he studies it (`showFindSpot`). A followed nudge makes that study succeed (`studyFocus`). It ends with the find.
  - **place** (authored, `to` = shrine, inn or study): a followed nudge decides the next event (`nudgeEvent`; a shrine or inn nudge makes him go in, like a quest's). Only for spots drawn on a scene that shows the building.
  - **exit** and **mouth** (authored, `to` = a stage, a zone or a connector point): steer the walk like a quest target, ahead of the quest (`steer`, `mode` and `eventPick` in quests.js), until he arrives or `nudgeTravelLife` events pass; the quest then takes over again (a detour).
  - **prop** (board, post, stranger): no new spot. The existing touches (stranger or giver: take the job; door: leave it) already do this.
  - **mouth** spots are authored, not automatic: the mouth scenes are only walked through during a crossing, so the spot goes in the scenes whose art shows an entrance.
- **Divine lines in the console** (decided with the build): little css sparkles play over the whole line about the god's own doing (touches, tithe, nudges) for a couple of seconds and are then gone: the text is never changed (author, 2026-11-25). A tapped spot shows a sparkle sprite (spellSparkGold_8), no glow, and the cursor never changes over a spot. `printDivine()` in ui/render.js.
- **Two more kinds (author, 2026-11-25):** `place` can lead to `book` (the shelves: the next study is a book, never a statue) and a new `dream` kind leads to `nightmare` (the palantir: tonight's sleep is a nightmare, whatever the odds; `run.godDream`, src/dream.js). Like every nudge they are only followed by his belief roll: the god's hints are never mandatory.
- **Tower, as approved:** Torre1 (door right to Torre2, both bookshelves, the palantir), Torre2 (door left to Torre1), Torre3 (archway, target waits for the author), Torre5 gate removed.
