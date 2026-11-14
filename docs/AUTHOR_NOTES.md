# Bugs, ideas, and implementation needs after real play testing

[x] ~~sometimes defeated sit position leave two lines of pixels, one left side and one buttom side~~ (fixed: spell effects left a sliver of their sheet behind)
[x] ~~some characters are very flickery, i think it is when animations are changing.~~ (fixed: canvases are cleared only when the new image is ready)
[x] ~~when click to revive the animation of the rings is mixed the wizard, it should be, rings, fade, and apear in the cabin~~ (fixed)
[x] ~~with hydras, we need to add some short info about the heads growing~~ (done)
[x] ~~also for hydras, they do not regenerate health from one battle to the other, only when a new head is growing~~ (done)
[~] some new enemy attacks need some sounds, check which can be reused, and what other should I find (checked: docs/SOUNDS.md lists the reusable sounds and the 10 to find; wiring waits for your OK)
[x] ~~implement the sleep that @planner has~~ (done with stand-ins: no beds in the inns or sleeping pose yet, placeholder dream lines; art asks in ideas.md)
[x] ~~entering into a shrine rather than a fade need to be more like a walk, similar to change of scene~~ (done, also for statues and door-less inns)
[~] (decided: two meters, faith = currency, belief = its own meter moved by moments; in docs/FAITH.md, the planner details it, then dev builds) implement the levels of believe. i think other than faith they should be included, for example a wizard where the player interact with him a lot in the best moments are better (heal in critical moments, final blow to enemies, etc), that should influence the amount of faith it gets. normal heals, normal attacks can improve the believe but in a minimum scale. obviously no revival will reduce a lot. we can think in creating to tier or faith, + number - numbers, in the story it will be modifies to some points to -inf (symbol) or we can came up with a more manable number, perhaps a different idea than a "currency" which is the current state.
[x] (done with code, no new art: walk, fly, float, rise, jump, blink by family) ~~with the walking system, we need to add enemy sa entries system, it should be thematic, flying enemies arrive from the air, floating just float with a movements. things or humanoides that tend to hide, jump in the scene, underground creatures get from the ground, @artist will need to participate on those creating generalize animations for each family of enemies.~~
[x] ~~we need to keep reference of the doors, so the wizard stops before entering in some places.~~ (done: Town and City inns and dice houses, doors already drawn on the streets)
[] poison cloud scene spell is quite anoying is not disapearing, we need a better way to disapeer it, kind of disipating.
[x] ~~looking a inn need to be compose for two scenes, one walk to the scene where the actual entrance of the inn is (if not visible in the current scene), then enter by the door.~~ (done for the Town and City inns and dice houses: the street with the door, then in; the Desert inn has no door on its streets)
[x] ~~after sleeping in sleeping bag, the wizard do not need to return the the common standing point, it can just walk right to the next scene, I think only inn or buildings that back walk is needed~~ (done your way: after the rest he is already in his place, no walk back)
[] arrows need to be faster
[] check with @artist, medusa poison shoot need to be more visible
[] still flickery with some wizard animation, when it will start walking for example
[] cemeentery each wizard should ahve a tumb with their name and perhaps age, touch extend information.  ERASURE follow rules, i think it is invert and crossed name and perhaps a cracked tomb. maybe 4 to 5 tombs desings with each one cracked just in case.
