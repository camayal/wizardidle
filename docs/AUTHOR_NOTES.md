# Bugs, ideas, and implementation needs after real play testing

[~] some new enemy attacks need some sounds, check which can be reused, and what other should I find (checked: docs/SOUNDS.md lists the reusable sounds and the 10 to find; wiring waits for your OK)
[~] (decided: two meters, faith = currency, belief = its own meter moved by moments; in docs/FAITH.md, the planner details it, then dev builds) implement the levels of believe. i think other than faith they should be included, for example a wizard where the player interact with him a lot in the best moments are better (heal in critical moments, final blow to enemies, etc), that should influence the amount of faith it gets. normal heals, normal attacks can improve the believe but in a minimum scale. obviously no revival will reduce a lot. we can think in creating to tier or faith, + number - numbers, in the story it will be modifies to some points to -inf (symbol) or we can came up with a more manable number, perhaps a different idea than a "currency" which is the current state.
[] poison cloud scene spell is quite anoying is not disapearing, we need a better way to disapeer it, kind of disipating.
[x] ~~looking a inn need to be compose for two scenes, one walk to the scene where the actual entrance of the inn is (if not visible in the current scene), then enter by the door.~~ (done for the Town and City inns and dice houses: the street with the door, then in; the Desert inn has no door on its streets) Author note: yes, it is a blue,yellow tent the inn in the desert
[] arrows need to be faster
[] still flickery with some wizard animation, when it will start walking for example
[] cemeentery each wizard should ahve a tumb with their name and perhaps age, touch extend information.  ERASURE follow rules, i think it is invert and crossed name and perhaps a cracked tomb. maybe 4 to 5 tombs desings with each one cracked just in case.
[] boxes and other breakable items appear in a very werid way, when the wizar is already in the scene. I think we need to compute what the next scene will have before showing the scene, and then when the wizard goes into the scene the box or breakable is already there.
[x] ~~Not sure but it wizard is not walking towards or away frm the shrines. This is a bug~~ (done: he walks in from the left to the cross and back out to the left)
[] dice sounds are not nicely sync send to @musician
[] create scenes that are the end of one ad the beginon of the otherone.
[] in desert wizard walks from left. some of those scenes have ocean on the left of the screen, we need to modify them to make a beach (walkable) or other solution.
[] some dreams can increase believer score
[x] ~~in altars, due to its nature, i tis better to return the wizard walking to the left~~ (done: he leaves the shrine walking left, the way he came)
[] if a battle is interrumpted because i close the game, when i start again previous content (enemies, runes, etc), in in place
[] add a defensive spells school to avoid damage we can incorporeate thos with the lvl. no overpowered, so rare. ideas: rune shield = circle in front of him; ice block = it can be in fron of him as well; more advance": phase off, and later in the game magic shield, like a multicharge, spell that protect from the following 2 or 3 attacks, this should be an outline probably black + white, that fade with every hit
[] we need a place to show the inventory i think in the stats, another scroll
[] faith related aspects is empty we need to put things there, probably a beliefmeter should be there 
[] use a tool such as https://github.com/ChristosMaragkos/Oggify or a permanent created script to transform mp3 to ogg. never use tokens to do each transformaion from scratch
[] thanks https://ko-fi.com/dragonstudio for a bunch of sounds
