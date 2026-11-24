# The desert tent

The Desert has only one building, the tent, so the tent does all the jobs: inn, dice house and shop. Written 2026-11-24 from the author's note (dev's facts below). Nothing here is built yet. Art waits for the artist after the author's OK, and dev waits too.

## What exists today (from dev)

- The tent has one interior, `el_desierto_taberna` (the inn). Its door is the dark opening in `el_Desierto1` (a street door).
- A place has **one background, one door and one NPC at a time.**
- The City and Town each have two interiors (inn and dice house) behind two street doors.
- The dice table is only a style and a position, so dice work in any interior that has a table. The **bone table, dice and throw sheet in the desert style are already drawn.**
- The explore event offers the dice house only in the City and Town, so the desert has no gambling yet.
- The shop waits for the professions vendors ([PROFESSIONS.md](PROFESSIONS.md) section 6 already says the Desert's vendor lives in its inn).

## The idea

The tent is a desert caravanserai: everything happens under one roof, and **one host runs all of it.** That fits the nomad mood and the "one NPC at a time" rule.

**Proposal (to be decided below):**

1. **The old tent scene stays, and shows what the visit is for.** He enters the tent with one purpose, and the scene draws only what that purpose needs (decided, see Decisions):
   - **Dice:** the bone dice table is there, and he plays at it.
   - **Buying:** he walks to the far end, where the shopkeeper stands.
   - **Sleeping:** he walks in a little and sleeps.
2. The tent stays one place with one door, so the map and the pathfinder see one landmark, and the walking line isn't broken.
3. **One host, the tent keeper**, stands wherever the visit needs her (at the table for dice, at the far end for buying, by the door for a bed). Innkeeper, gambler and merchant are the same person: "she sells you a bed, then takes your gold at dice, then sells you the bed's blanket."
4. **How he gets in:** he enters the tent by the door like today; inside, the visit picks a service. Inn when he needs rest (as today); otherwise dice or trade by chance. No numbers until playtests: start from the City and Town dice share and tune it.
5. **No buying visits until professions ship** (nothing to draw or sell before that). Then the tent keeper is the Desert's vendor from PROFESSIONS.md, and sells desert things: bone, and the Volcano's brimstone sometimes, since the caravan comes from there.

## Art it needs

None new (decided): the old tent scene is fine, and the desert dice set exists. The shopkeeper sprite comes with the professions vendors.

## Open questions

1. ~~One interior or several scenes?~~ Decided.
2. ~~Does he walk to a spot for each service?~~ Decided.
3. One host for everything, or a different NPC per service?
4. How does a visit pick its service (need first, chance, the god's touch)?
5. ~~The shop before professions?~~ Follows from the decision: no buying visits until professions ship.

## Decisions

- **2026-11-24, interior and walking:** one interior, the **old tent scene, no new art.** The scene shows things by what he came to do: to play dice, the table is there; to buy, he walks to the far end where the shopkeeper is; to sleep, he walks in a little and sleeps. No corners to walk between: that would break the walking line.
