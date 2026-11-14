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
| What they do | **For now, pure story:** text and image only, no effect on faith, rest or stats |

## How it plays

1. **Arrive:** the inn background or the camping spot (as today).
2. **Lie down:** no beds. At an inn he walks slowly in; camping, the sleeping bag is laid where he stops, and he lies down.
3. **Dark:** about 1 s to fade, about 2 s dark. If tonight has a dream, its lines (and image) appear over the dark for a few seconds.
4. **Wake:** fade back, the wake-up line and HP as today (`wakeUp()`; its double-count text bug is fixed in stage 3).

## Dreams and nightmares

- **Story dreams** are written with the story (the story script, `docs/STORY.md`), keyed to moments: after each chapter, after a fall, near the final battle. They can carry hints (the hood, the staff, the prophecy) without any mechanical effect.
- **Random dreams and nightmares** come from a small pool, chosen by level and belief level (dreams more for believers, nightmares more for doubters and atheists): this only picks the *text*, it changes nothing in play.
- **After an erasure** ([ERASURE.md](ERASURE.md)) the pool can include echo dreams (a wizard who isn't him, a reversed name), only when `world.erasures` is not empty. Text only, like the small echoes.
- **The god's "dream" touch** ([FAITH.md](FAITH.md), 3.6) stays a separate god action: touching the sleeping bag while an atheist camps sends a dream of a shrine, and he enters the next one. It uses this same dark-and-vision scene.

## Needs

- Art (artist): optional faint dream images.
- Text (story script): story dreams per moment; a pool of short random dreams and nightmares.
- Stats ([STATS.md](STATS.md)): `sleep.inn`, `sleep.camping`, `dream.story`, `dream.random`, `nightmare.random`.

## Open

- How rare is "rare" (to playtest).
- Whether dreams ever get an effect later (faith, rest quality): the author chose pure story for now.
