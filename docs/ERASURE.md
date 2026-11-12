# After an erasure: the god's loop

What happens to the next wizards after the god wins the final battle and **erases** a wizard. Asked by the author (via the story session) on 2026-11-12: *"something special for wizards after an erasure, perhaps a super boost in the final battle against god."* Nothing is built yet. The story script is `docs/STORY.md` on branch `plan/story`.

---

## The frame (decided by the author, from the story session)

- **Final battle:** heal-or-hit buttons. If **the god wins**, the god reclaims the wizard's soul personally and **removes it from existence**. The game ends, a **museum** appears (chapter scrolls, a snapshot of each chapter's moment, stats, map), and then a new wizard can be created.
- **The loop:** for gods, time means little. A new game is **the god going back in time** to live the story again and see whether the wizard wins this time.
- **The end of the loop:** only when **a wizard wins**. The god falls, the wizard becomes **the Omni**, and that save becomes a **black museum, blocked forever**.
- **Easter egg (decided):** an erased wizard appears in the cemetery with his **name reversed and struck through** (~~nilreM~~).
- **A true death is not an erasure.** A wizard who dies for good in play ("Death management" in `ideas.md`) goes to the cemetery as usual and can come back as a ghost rescuer ([FAITH.md](FAITH.md), 3.2).

## Who is erased, and who is not (the author, 2026-11-12)

- **Erased wizards are only those the god defeats in the final battle.** Only they leave a soul for the next final battles, appear in the cemetery with the name reversed and struck through, and count in `world.erasures`.
- **Every other wizard who dies at some moment of the game** (a true death when nobody rescues him, or the kill button) is a **regular part of the cemetery**, written normally. **Their role is different:** they belong to the "wizards from the past" ideas (ghost rescuers in [FAITH.md](FAITH.md), letters, legends), never to the souls of the final battle.

## The idea: every erasure makes the next wizard stronger against you

The loop has a built-in twist: **each time the god wins, the god brings his own end closer.** An erased wizard leaves no soul, but he leaves an **echo in time**, and the next wizard carries it. The god can keep winning, but each win tilts the next final battle toward the wizard, so the loop must end one day, the way the prophecy says.

### Proposal (decided 2026-11-12 except where marked; see Decisions at the end)

| Part | Proposal |
|---|---|
| **The boost** | **The souls of the erased wizards in the final battle.** Each one appears beside the new wizard as a translucent sprite of his tier, with his reversed name. |
| **Turn order** | **Wizard → souls → god.** Each round the wizard attacks, then each soul attacks (or shields him), then it's the god's turn (the heal-or-hit buttons). |
| **Stacking** | **One echo per erasure, up to 5.** 1 echo is a small help, 5 make the wizard very hard to beat. Past 5, the echoes don't grow, so the god can still win if the player is very good. |
| **Earlier signs: small echoes** (decided) | **Only when `world.erasures.length > 0`** (at least one wizard erased; a true death or the kill button never counts). The **Prologue opens differently**: *"You have heard him before. You will hear him again. Time is nothing to you. To him, it is everything. Will this one win?"* A few **déjà vu lines** in the chapters (the stranger hesitates, Midas frowns as if he knew). The text lives in `docs/STORY.md` (branch `plan/story`). These are words only: **the souls and their help still appear only in the final battle.** |
| **Faith** | **No change to the faith rules.** The loop changes the story text and the final battle, not the faith economy (FAITH.md stays as decided). |
| **Saving** | World level, next to the cemetery: `world.erasures = [{ name, lvl, age, date, loop }]` and `world.loop` (how many times the god has gone back). Killing a wizard with the kill button or a true death never adds to it. The black museum is `world.omni = { name, date, … }`, and once it's set the world is locked. |
| **Museum** | The museum after an erasure lists the earlier erasures too ("the god has erased 3 wizards"), so the player sees the loop growing. |

### Why it's special

- It turns the player's victories into the story's engine: **winning makes you weaker.** That fits the prophecy and the god's fear of it (STORY.md, "God's motive").
- It rewards persistence without making the first final battle easy.
- The struck-through names, the scratched names in the Tower and the echoes all use the same data (`world.erasures`), so they always agree.

## Open questions

- How strong is one soul's attack (a share of the wizard's, e.g. 30%?), and can a soul shield instead of striking? To playtest, like every number.
- With 5 souls, can a very good player still win? The playtests should check the final battle at 0–5 souls.
- Should the souls arrive one by one during the battle (a dramatic entrance) or all at the start?
- ~~Déjà vu lines before the finale: add them or not?~~ Decided: small echoes (see Decisions).
- The museum: does it show the souls that fought in the battle?

## Decisions

| Date | Question | Decision |
|---|---|---|
| 2026-11-12 | The boost | **Souls (echoes) that act** in the final battle, one per erased wizard: his tier sprite, translucent, his reversed name |
| 2026-11-12 | Stacking | **One soul per erasure, capped at 5** |
| 2026-11-12 | When the souls appear | **Only in the final battle.** *"In this moment the soul of the previous come to help."* |
| 2026-11-12 | Small echoes (text before the finale) | **Yes, after at least one erasure** (`world.erasures.length > 0`): a different Prologue opening and a few déjà vu lines in the chapters, written in STORY.md. Text only; no help or boost before the final battle |
| 2026-11-12 | Turn order | **The wizard attacks, then the soul or souls of the previous wizards attack, then the god (the player) takes a turn** |
| 2026-11-12 | Faith | **No change:** the loop changes the story and the final battle, not the faith economy |
