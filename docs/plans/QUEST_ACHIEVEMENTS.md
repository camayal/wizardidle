# Quest achievements and stats (draft by dev, for thinker and the author to review)

Counters now recorded (src/quests.js, stats): quest.started, quest.done, quest.cancelled, quest.failed, quest.turnedDown, quest.hunted, quest.huntFell, and per kind `quest.<kind>.<how>` (how: done, cancelled, failed). Still to count when built: quest.delivered, quest.trophies, quest.bossHunted, quest.gold, quest.secretDone.

Achievement ideas (names are placeholders):
- First errand: finish 1 quest. Errand runner: 10. Hero for hire: 50.
- Bounty hunter: hunt 5 rares. Giant slayer: hunt 1 boss; hunt every boss.
- Lost the hunt: fall to the hunted enemy (a joke one).
- Postman: deliver 10 parcels; deliver to every kind of place (city, town, tent, pier, both bridges).
- Explorer: finish an explore quest in each zone.
- Scholar: 10 study quests.
- Pilgrim: finish a pilgrimage; Faithful: finish the hidden shrine quest.
- Obedient: finish 10 quests the god suggested; Stubborn: turn down 10 suggestions.
- Overbooked: fill the queue (8 in all).
- Patience: have a quest demoted twice and still finish it.
- Quiet failure: drop 3 quests in a row.
