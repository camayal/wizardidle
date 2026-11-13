# Scene spells for the wizard, the god and the story

Scene spells are full-scene animations (the size of a zone background, ground effects translucent over the zone's own soil), drafted by the artist for boss attacks (`ideas.md`, "Scene spells"; the boss ones are in the game since 2026-11-13: `src/data/bossAttacks.js`, played by `src/ui/bossAttacks.js`). This plan covers the author's request: **our wizard uses scene spells when he is very powerful**, and the spare ones go **to the story and other powers**. Decided on 2026-11-13. Nothing is built yet.

## The scene spells

- *Used by bosses:* earth spikes (protromus), ice spikes and blizzard (rainbow), fire rain (rojo), arcane rain (doria, king skeleton), lightning (arcangel), entangling vines (herbus), flame pillar (fenix).
- *More boss ones after the author's boss reviews* (35 scene spells in all, in the game since 2026-11-13): see the "Scene spells" backlog entry in `ideas.md`. The **earthquake now follows protromus's ground punch** and shakes the scene.
- *Spare (used by no boss):* meteor shower, divine light, eclipse, sandstorm, whirlwind, healing rain.

## Decisions (the author, 2026-11-13)

| Question | Decision |
|---|---|
| When the wizard earns them | **With the staff's story:** the sacred staff (lvl 90) unlocks one, the corrupt staff (chapter VI, 130) a darker one, the reforged staff *{staffName}* (chapter XI, 200; its random true name, `world.staffName`) the strongest |
| Super-critic | **Sometimes a critic becomes a super-critic:** instead of the normal spell he casts a scene spell with very high damage. **Very rare before level 90, rare once he has a staff** |
| The god's touches | **A god touch-critic is a scene spell, as a regular critic:** when the god's touch lands a critical, it plays a scene spell (replacing today's ×8 "god's wrath" effects in `npcBtn()`), with no extra faith cost |
| The spare ones | **The god's critics and the story** (below) |

## How it plays

**The wizard's super-critic** (in `attackEV()`, `src/combat.js`, where critics are rolled today):
- When a critic is rolled, a second roll decides whether it becomes a super-critic. Starting values to playtest: **1 in 50 critics before level 90**, **1 in 10 once he has a staff**.
- Before he has a staff, the super-critic casts the boss scene spell of **his strongest school** (the `school_*` counters already exist): Nature → vines, Frost → ice spikes, Fire → fire rain, Arcane → arcane rain, Thunder → lightning, Physical → earth spikes, Shadow → arcane rain (the darkest of the boss ones). Divine is left out: those are the god's own spells (his touch), so they never count as the wizard's school.
- With a staff, it casts the staff's scene spell (below). Damage: very high, e.g. 3× a critic, but **never a one-shot on a boss or hydra** (capped below their remaining HP, the way the god's touch never kills today).

**The staff scene spells** (proposal, to decide): the sacred staff → **lightning** (holy thunder), the corrupt staff → **flame pillar** (the Volcano where it was found), *{staffName}* → **all of them, picked by school**, plus the meteor shower in the final battle.

**The god's critics** (the touches in `src/divine.js`, already paid in faith):
- Touch on the enemy, critical → **divine light** or **meteor shower**.
- Touch on the wizard (heal), critical → **healing rain**.

**The story's scene spells** (scripted, in the story script `docs/STORY.md`):
- **Eclipse:** chapter VI, Corruption.
- **Earthquake** (protromus's, reused): the Tower siege (139) and chapter VII.
- **Sandstorm / whirlwind:** the road to Heidan (199) and chapter XI.
- **Divine light:** the final battle, when the hood falls.

## Boss effects (decided 2026-11-13)

Most boss scene spells stay **looks only** (the damage is the boss's normal hit). A few get one simple effect:

| Boss attack | Effect (starting values, to playtest) |
|---|---|
| **Medusa's petrifying gaze** | **Rare:** about 1 in 4 of her gazes turns him to stone for **2 turns** (Medusa hits freely; the stone can't cast, walk or pray; a fall ends it). After his **first petrification** he can **find a rare artefact that makes him immune for good** (rare: the author, 2026-11-13) (a mirror shield or a gorgon's-eye amulet, found like a rune or book; art to draw). Replaces today's 2.5 s placeholder |
| **King Midas's golden rays** | **Heal Midas** about **15% of his max HP, at most twice per fight**. The god's touch on Midas while the rays spin **interrupts the heal** |
| **Blizzard** (rainbow) | On a roll, he **skips his next attack** (slowed by the cold) |
| **Poison cloud** (kkck) | A little **damage over 2 turns** |
| **Earthquake** (protromus) | On a roll, he **misses his next spell** (and the scene shakes, as built) |

Stats: `boss.petrified`, `boss.petrifyImmune` (a first), `boss.midasHeal`, `boss.midasHealInterrupted`, `boss.effect.<name>`.

## Needs

- Art: the spare scene spells are already drawn by the artist (not in the game yet); the wizard's own versions may need the wizard's side of the animation.
- Stats ([STATS.md](STATS.md)): `combat.superCritic`, `combat.superCritic.<spell>`, `god.critic.<spell>`; a record for the biggest super-critic.
- An achievement for the first super-critic, and one for each staff scene spell.

## Open

- Which scene spell each staff unlocks (proposal above).
- The super-critic chances and damage (playtests).
