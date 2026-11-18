# Bugs, ideas, and implementation needs after real play testing

[~] some new enemy attacks need some sounds, check which can be reused, and what other should I find (checked: docs/SOUNDS.md lists the reusable sounds and the 10 to find; wiring waits for your OK)
[~] (decided: two meters, faith = currency, belief = its own meter moved by moments; in docs/FAITH.md, the planner details it, then dev builds) implement the levels of believe. i think other than faith they should be included, for example a wizard where the player interact with him a lot in the best moments are better (heal in critical moments, final blow to enemies, etc), that should influence the amount of faith it gets. normal heals, normal attacks can improve the believe but in a minimum scale. obviously no revival will reduce a lot. we can think in creating to tier or faith, + number - numbers, in the story it will be modifies to some points to -inf (symbol) or we can came up with a more manable number, perhaps a different idea than a "currency" which is the current state.
[] dice sounds are not nicely sync send to @musician
[] create scenes that are the end of one ad the beginon of the otherone.
[] in desert wizard walks from left. some of those scenes have ocean on the left of the screen, we need to modify them to make a beach (walkable) or other solution.
[] add a defensive spells school to avoid damage we can incorporeate thos with the lvl. no overpowered, so rare. ideas: rune shield = circle in front of him; ice block = it can be in fron of him as well; more advance": phase off, and later in the game magic shield, like a multicharge, spell that protect from the following 2 or 3 attacks, this should be an outline probably black + white, that fade with every hit
[] we need a place to show the inventory i think in the stats, another scroll
[] faith related aspects is empty we need to put things there, probably a beliefmeter should be there 
[] use a tool such as https://github.com/ChristosMaragkos/Oggify or a permanent created script to transform mp3 to ogg. never use tokens to do each transformaion from scratch
[] thanks https://ko-fi.com/dragonstudio for a bunch of sounds
