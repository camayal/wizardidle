// What the console says when the god touches a spot of the scene (src/nudge.js). One list per belief level; {name} the
// wizard, {where} the spot's label ("the stairs up"). `yes`: he follows the hint; `no`: he does not (the faith is spent
// all the same). An Atheist who follows thinks it was his own idea.
export const NUDGE_TEXTS = {
    devout: {
        yes: ["{name} bows his head: \"I will obey you.\" He turns to {where}.", "\"As you wish.\" {name} goes to {where} at once."],
        no: ["{name} hears you but his mind is elsewhere; he does not go to {where}."],
    },
    believer: {
        yes: ["{name} thinks it over: \"A good idea.\" He heads for {where}.", "{name} feels a pull toward {where} and follows it."],
        no: ["{name} feels a pull toward {where} but keeps to his own way."],
    },
    doubter: {
        yes: ["{name} shrugs: \"Why not?\" He goes to {where}.", "{name} frowns, unsure why, and heads for {where} anyway."],
        no: ["{name} feels something nudge him toward {where} and tells himself it is nothing."],
    },
    atheist: {
        yes: ["{name} decides, all on his own, to go to {where}.", "\"I was going that way anyway,\" says {name}, and heads for {where}."],
        no: ["{name} does not even notice the nudge toward {where}."],
    },
};
