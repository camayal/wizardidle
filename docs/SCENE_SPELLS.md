# Scene spells for the wizard, the god and the story

Scene spells are full-scene animations (the size of a zone background, ground effects translucent over the zone's own soil), drafted by the artist for boss attacks (`ideas.md`, "Scene spells"; art in `wizardidle-old-ideas/tools/scene_spells/`, not in the game yet). This plan covers the author's request: **our wizard uses scene spells when he is very powerful**, and the spare ones go **to the story and other powers**. Decided on 2026-11-13. Nothing is built yet.

## The sixteen scene spells

- *Used by bosses:* earth spikes (protromus), ice spikes and blizzard (rainbow), fire rain (rojo), arcane rain (doria, king skeleton), lightning (arcangel), entangling vines (herbus), flame pillar (fenix).
- *Spare:* meteor shower, earthquake, divine light, eclipse, sandstorm, whirlwind, healing rain.

## Decisions (the author, 2026-11-13)

| Question | Decision |
|---|---|
| When the wizard earns them | **With the staff's story:** the sacred staff (lvl 90) unlocks one, the corrupt staff (chapter VI, 130) a darker one, the reforged *Nomaleatorio* (chapter XI, 200) the strongest |
| Super-critic | **Sometimes a critic becomes a super-critic:** instead of the normal spell he casts a scene spell with very high damage. **Very rare before level 90, rare once he has a staff** |
| The god's touches | **A god touch-critic is a scene spell, as a regular critic:** when the god's touch lands a critical, it plays a scene spell (replacing today's ×8 "god's wrath" effects in `npcBtn()`), with no extra faith cost |
| The spare ones | **The god's critics and the story** (below) |

## How it plays

**The wizard's super-critic** (in `attackEV()`, `src/combat.js`, where critics are rolled today):
- When a critic is rolled, a second roll decides whether it becomes a super-critic. Starting values to playtest: **1 in 50 critics before level 90**, **1 in 10 once he has a staff**.
- Before he has a staff, the super-critic casts the boss scene spell of **his strongest school** (the `school_*` counters already exist): Nature → vines, Frost → ice spikes, Fire → fire rain, Arcane → arcane rain, Thunder → lightning, Physical → earth spikes.
- With a staff, it casts the staff's scene spell (below). Damage: very high, e.g. 3× a critic, but **never a one-shot on a boss or hydra** (capped below their remaining HP, the way the god's touch never kills today).

**The staff scene spells** (proposal, to decide): the sacred staff → **lightning** (holy thunder), the corrupt staff → **flame pillar** (the Volcano where it was found), *Nomaleatorio* → **all of them, picked by school**, plus the meteor shower in the final battle.

**The god's critics** (the touches in `src/divine.js`, already paid in faith):
- Touch on the enemy, critical → **divine light** or **meteor shower**.
- Touch on the wizard (heal), critical → **healing rain**.

**The story's scene spells** (scripted, in the story script `docs/STORY.md`):
- **Eclipse:** chapter VI, Corruption.
- **Earthquake:** the Tower siege (139) and chapter VII.
- **Sandstorm / whirlwind:** the road to Heidan (199) and chapter XI.
- **Divine light:** the final battle, when the hood falls.

## Needs

- Art: the spare scene spells (artist).
- Stats ([STATS.md](STATS.md)): `combat.superCritic`, `combat.superCritic.<spell>`, `god.critic.<spell>`; a record for the biggest super-critic.
- An achievement for the first super-critic, and one for each staff scene spell.

## Open

- Which scene spell each staff unlocks (proposal above).
- The super-critic chances and damage (playtests).
