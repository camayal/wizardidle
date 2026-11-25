# Sleep, dreams and nightmares

A plan for how the wizard sleeps and dreams. From the author's backlog entry "Soft sleep, dreams and nightmares" (`ideas.md`), decided on 2026-11-13. Nothing is built yet: sleeping stays as it is until this is built.

## Today

Resting is the inn event (`innEV()` → `searchInn()` → `wakeUp()` in `src/events.js`): he arrives at an inn (City, Town, Desert) or camps in the wild (the sleeping-bag sprite), a sleep effect plays over him, a few console lines print, and he wakes with some HP back.

## Decisions (the author, 2026-11-13)

| Question | Decision |
|---|---|
| How sleep looks | **No beds** (the author, 2026-11-13): at an inn he walks slowly in; in the wild **the sleeping bag is laid where he stops**; he lies down and **the scene fades to dark**, then it fades back and he wakes (built by dev) |
| What a dream is | **A vision over the dark scene:** 1–3 short lines appear softly over the darkness, with a faint image when the artist has drawn one (a staff, a face, the hood). The console keeps the lines |
| When dreams come | **Rare, plus story nights:** most rests are plain sleep; a small chance of a dream or nightmare on any rest, and a scripted story dream on the first rest after key moments (a chapter, a fall, the approach of the final battle) |
| What they do | **Pure story at first:** text and image only, no effect on faith, rest or stats. *Changed 2026-11-17 for belief dreams and nightmares, next row* |
| Dreams and belief | **Some dreams raise belief, and dreams must not repeat** (the author's note, 2026-11-17: *"some dreams can increase believer score"*). This replaces "pure story" for belief dreams and nightmares only. Decided 2026-11-17 (the author): **gain by level** (+1 Devout/Believer, +2 Doubter, +3 Atheist, none while Lost); **nightmares sow doubt** (−1 only while Believer or Devout, never below the Believer line); **every weight and the floor in config**; **a shuffle bag per pool, per wizard** (saved in `state`); **chapter dreams are a bag of general dreams** (story-linked ones later); **no wake line**. Rules in *Belief dreams* below |

## How it plays

1. **Arrive:** the inn background or the camping spot (as today).
2. **Lie down:** no beds. At an inn he walks slowly in; camping, the sleeping bag is laid where he stops, and he lies down.
3. **Dark:** about 1 s to fade, about 2 s dark. If tonight has a dream, its lines (and image) appear over the dark for a few seconds.
4. **Wake:** fade back, the wake-up line and HP as today (`wakeUp()`; its double-count text bug is fixed in stage 3).

## Dreams and nightmares

- **Story dreams** come on the first rest after a moment: a chapter (a general chapter dream from its own bag) or a fall (by who got him up). Dreams tied to a chapter's events are kept for later ([ideas/dreams.md](ideas/dreams.md), *Story-linked chapter dreams*), like one near the final battle. They can carry hints (the hood, the staff) without any mechanical effect.
- **Random dreams and nightmares** come from the pool in [ideas/dreams.md](ideas/dreams.md), chosen by belief level (dreams more for believers, nightmares more for doubters and atheists). Belief dreams raise belief and nightmares can lower it a little; the rest change nothing in play (*Belief dreams* below).
- **After an erasure** ([ERASURE.md](ERASURE.md)) the pool can include echo dreams (a wizard who isn't him, a reversed name), only when `world.erasures` is not empty. Text only, like the small echoes.
- **The god's "dream" touch** ([for_implementation_faith.md](for_implementation_faith.md), 3.6) stays a separate god action: touching the sleeping bag while an atheist camps sends a dream of a shrine, and he enters the next one. It uses this same dark-and-vision scene.

## Belief dreams

Decided 2026-11-17 (the author) for the note above. The full text is in [ideas/dreams.md](ideas/dreams.md).

**The pools**

| Pool | Size | Who gets it | Effect |
|---|---|---|---|
| Light dreams | 12 | Devout, Believer | 6 are belief dreams (★), 6 pure story |
| Callings | 12 | Doubter, Atheist | all belief dreams (★): quiet, the god never commands |
| Nightmares | 16 | anyone (more often for Doubters and Atheists) | seeds of doubt: −1 while Believer or Devout, never below 0 |
| Fall dreams | 6 | first rest after a fall, by who got him up (healer, rescuer, alone; 2 each) | pure story |
| Chapter dreams | 8 | first rest after any chapter: general dreams of a chapter turning, no chapter's events | pure story |
| Echo dreams | 3 | join the random pool only after an erasure | pure story |

**Which kind tonight:** a rest still has the small dream chance. On a dream night, a story dream (chapter, then fall) wins if one is due; otherwise it is a nightmare or a dream, split by **belief level** (Believer and Devout: mostly dreams; Doubter and Atheist: mostly nightmares, as today). *Today the split reads faith (the currency); it should read the belief level.* A dream for a Believer or Devout comes from the light dreams, for a Doubter or Atheist from the callings.

**How much a dream moves belief** (starting weights, to playtest, on the for_implementation_faith.md 3.1 scale): the weight depends on his level when he dreams it.

| Level when he dreams | Belief |
|---|---|
| Devout, Believer | +1 (like a prayer) |
| Doubter | +2 |
| Atheist | +3 (the furthest away needs it most; still well under a fall's −10) |
| *Lost* (chapter X lock) | none: the dream plays, belief does not move |
| **Nightmare**, while Devout or Believer | −1, but never below the Believer line (0): at +0.5 it takes him to 0, at 0 it does nothing |
| Nightmare, while Doubter, Atheist or Lost | none |

**Every weight in config** (the author: playtests must retune them easily): one weight per level for belief dreams (e.g. `config.belief.weights.dreamDevout`, `dreamBeliever`, `dreamDoubter`, `dreamAtheist`), one for nightmares (`config.belief.weights.nightmare`), and the nightmare floor (the Believer line, 0) as its own config value. No dream number lives in the code.

- **Callings are a second way back from atheism** for an idle player, next to passing shrines and close calls (for_implementation_faith.md 3.1). They don't send him to a shrine: that stays the god's dream touch (for_implementation_faith.md 3.6).
- **Nightmares are seeds of doubt, never a spiral.** They can shake a believer but cannot make him a Doubter: the floor stops them at the Believer line, and they do nothing once he doubts, so they never push a doubter towards atheism (the spiral for_implementation_faith.md 3.1 fixed).
- **No line about the gain:** the dream is the message; the belief icon moves on its own.

**No repeats: a shuffle bag per pool, per wizard**

- Each random pool (light, callings, nightmares, echoes), the general chapter dreams, and each fall kind (healer, rescuer, alone) keeps a **bag**: its dream ids in a shuffled order. A dream night takes the next id; when the bag is empty it is refilled and reshuffled.
- **No dream returns until its whole pool has played**, and on a refill, if the first id is the dream he had last, it moves to the back, so the same dream never plays twice in a row.
- The bags and the last dream are saved **per wizard, in `state`**: each new game starts with fresh bags.
- A chapter takes the next general chapter dream from its bag; with 8 dreams and more chapters than that, the bag refills once in a game.
- Dreams naming the healer play only after the healer has carried him once; a fall dream for the healer is always after that.

## Needs

- Art (artist): optional faint dream images.
- Text: **written** in [ideas/dreams.md](ideas/dreams.md) (2026-11-17), to replace the stand-in lines in `src/data/dreams.js`.
- Stats ([STATS.md](STATS.md)): `sleep.inn`, `sleep.camping`, `dream.story`, `dream.random`, `nightmare.random`, `belief.moment.dream`.

## Open

- How rare is "rare" (to playtest).
- Belief dreams (to playtest): how fast callings pull an idle Atheist back, and how often nightmares hold a believer near the Believer line. Rest quality stays without effect.
- When story-linked chapter dreams are built, and which chapters get one.
