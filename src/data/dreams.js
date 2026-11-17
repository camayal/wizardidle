// Wizard Idle v2 - dreams and nightmares while he sleeps (docs/SLEEP.md, text in docs/ideas/dreams.md).
// Each dream is 1-3 short lines shown over the dark scene and kept in the console. `belief: true`
// marks a belief dream (it moves belief by his level's weight, config.belief.weights.dream*).
// Pools: light (Devout, Believer), call (Doubter, Atheist), night (nightmares), fallHealer,
// fallRescuer, fallAlone (first rest after a fall, by who got him up), chap (general chapter
// dreams), echo (only after an erasure). Ids are stable: the shuffle bags save them.

export const dreams = {
    light: [
        { id: "light.candle", belief: true, lines: ["A candle burns in an empty shrine.", "It does not go out when he breathes on it."] },
        { id: "light.rain", lines: ["Warm rain on the Prairie.", "He holds out his palms and they fill like a purse of coins."] },
        { id: "light.margin", belief: true, lines: ["A boy again, in the Tower library.", "Every book has the same name written in the margin.", "He cannot read it, but it is kind."] },
        { id: "light.bloom", belief: true, lines: ["In the middle of the Tundra winter, a tree blooms,", "only on the side that faces him."] },
        { id: "light.river", lines: ["Fish made of light circle his ankles in a river.", "Every one of them knows the way home."] },
        { id: "light.cloak", lines: ["Someone mends his cloak while he sleeps.", "The stitches glow, then fade into the wool."] },
        { id: "light.stair", belief: true, lines: ["Up a stair of clouds, and at the top", "a chair, and a cup set out for him."] },
        { id: "light.bells", belief: true, lines: ["Bells across the Desert, though there is no town.", "He knows, without counting, which one rings for him."] },
        { id: "light.fire", lines: ["Old wizards sit around a fire, laughing.", "One pours him tea and calls him by a name he likes."] },
        { id: "light.roots", lines: ["Roots spill from his staff, and it blooms white.", "A wren builds a nest in the crook."] },
        { id: "light.stars", belief: true, lines: ["The stars draw a road across the sky,", "and it ends exactly where he is standing."] },
        { id: "light.ink", lines: ["A warm sea of ink holds him up.", "Whatever he writes on its surface stays."] },
    ],
    call: [
        { id: "call.voice", belief: true, lines: ["Someone says his name in a voice he had forgotten.", "Not angry. Only patient."] },
        { id: "call.bowl", belief: true, lines: ["A cracked bowl on a shelf,", "filled again every morning by no one."] },
        { id: "call.moss", belief: true, lines: ["Moss has swallowed the shrine by the road.", "Under it, the doorstep has been swept clean."] },
        { id: "call.door", belief: true, lines: ["Every door in the corridor is shut but one,", "and warm light leans out of it."] },
        { id: "call.snow", belief: true, lines: ["Snow covers him, and covers him,", "then stops, as if someone had said enough."] },
        { id: "call.prayer", belief: true, lines: ["His childhood prayer, sung in a stranger's tongue.", "He knows every word anyway."] },
        { id: "call.lantern", belief: true, lines: ["Down the Swamp a lantern follows him at a polite distance.", "It never asks him to stop."] },
        { id: "call.dog", belief: true, lines: ["A dog he never owned waits at the gate.", "It wags as if he were late, not lost."] },
        { id: "call.graves", belief: true, lines: ["In the cemetery, the gravestones turn to face him.", "One of them says: we were heard too."] },
        { id: "call.mine", belief: true, lines: ["Deep in the mine his torch dies.", "The dark is not empty. It is listening."] },
        { id: "call.argue", belief: true, lines: ["All night he argues with the sky.", "The sky lets him finish."] },
        { id: "call.tide", belief: true, lines: ["The tide comes in over the Dunes.", "It stops at his feet and draws back, careful."] },
    ],
    night: [
        { id: "night.fall", lines: ["He falls, and the ground never comes.", "Above him the hole closes like an eye."] },
        { id: "night.staff", lines: ["His staff speaks in many voices,", "and all of them are hungry."] },
        { id: "night.midas", lines: ["Midas reads the sentence again.", "This time the hall is full, and everyone laughs."] },
        { id: "night.bricks", lines: ["Every shrine on the road has a door,", "and every door is bricked shut."] },
        { id: "night.slimes", lines: ["Slimes fill the room up to his chin.", "They are warm, and in no hurry."] },
        { id: "night.return", lines: ["From very far away his own prayer comes back,", "a little wrong."] },
        { id: "night.flood", lines: ["Water rises in the cabin.", "He cannot find the door he came in by."] },
        { id: "night.grave", lines: ["A fresh grave in the cemetery.", "The stone carver asks him how to spell his name."] },
        { id: "night.sun", lines: ["The sun goes out like a pinched wick.", "Someone in the dark says: finally."] },
        { id: "night.book", lines: ["The pages of his spellbook turn on their own.", "All blank, but the last, which is burning."] },
        { id: "night.table", lines: ["A hundred gods sit at a long table,", "and none of them knows who he is."] },
        { id: "night.ice", lines: ["Under the Grotto ice, faces press up", "and mouth his name, one after another."] },
        { id: "night.stairs", lines: ["The Tower stairs go down instead of up,", "and his old teacher waits on every landing."] },
        { id: "night.hoods", lines: ["A sandstorm tears the hood off every traveler.", "Under each hood: nothing at all."] },
        { id: "night.ash", lines: ["Ash eats his fingertips.", "The wind is very interested."] },
        { id: "night.town", lines: ["A bell tolls once in a dead town.", "Every window opens to watch him pass."] },
    ],
    fallHealer: [
        { id: "fall.carried", lines: ["Being carried. A heartbeat that isn't his,", "and the smell of pine smoke."] },
        { id: "fall.soup", lines: ["A fire, and a bowl of soup going cold beside him.", "When he looks up, only the hood, turned to the window."] },
    ],
    fallRescuer: [
        { id: "fall.cart", lines: ["Cart wheels, and strangers arguing over his weight.", "One of them tucks a blanket under his chin."] },
        { id: "fall.ribs", lines: ["A rough voice counts his ribs out loud.", "All there. All there."] },
    ],
    fallAlone: [
        { id: "fall.light", lines: ["He crawls toward a light that keeps its distance.", "He wakes where he fell."] },
        { id: "fall.crows", lines: ["Crows wait on a branch, patient.", "He gets up just to disappoint them."] },
    ],
    chap: [
        { id: "chap.map", lines: ["The map in his pack redraws itself while he watches.", "The road he came by is gone from it."] },
        { id: "chap.coat", lines: ["A coat he has worn for years slides off his shoulders.", "Underneath is another, and it fits better."] },
        { id: "chap.moon", lines: ["The moon turns over like a coin", "and shows a side no one has seen yet."] },
        { id: "chap.bridge", lines: ["Halfway across a rope bridge, the planks behind him fall away.", "The ones ahead are new."] },
        { id: "chap.puddle", lines: ["In a puddle, his reflection is a year older.", "It nods, as if to say: keep going."] },
        { id: "chap.ship", lines: ["From a cliff he watches a ship leave the harbor,", "carrying everything he used to be."] },
        { id: "chap.keys", lines: ["Keys hang from every branch of an orchard.", "Only one is cold to the touch, and it is his."] },
        { id: "chap.seasons", lines: ["Spring, summer, autumn and winter cross the field", "in a single breath, and he is still lying there."] },
    ],
    echo: [
        { id: "echo.bank", lines: ["A wizard with his walk but not his face", "waves from the far bank of a river."] },
        { id: "echo.frost", lines: ["His name, written backwards in frost on a window,", "and struck through."] },
        { id: "echo.bag", lines: ["Someone has already slept in this bag tonight.", "It is still warm."] },
    ],
};
