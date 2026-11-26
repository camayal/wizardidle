// What the console says when the god touches a spot of the scene (src/nudge.js). One list per belief level; {name} the
// wizard, {where} the spot's label ("the stairs up"). `yes`: he follows the hint; `no`: he does not (the faith is spent
// all the same). An Atheist who follows thinks it was his own idea.
export const NUDGE_TEXTS = {
    devout: {
        yes: ["{name} lifts his eyes, as if someone had whispered to him. {then}", "A quiet certainty settles on {name}: this is the way. {then}", "{name} feels a warm light guiding him. {then}"],
        no: ["{name} hears you but his mind is elsewhere; he lets it pass."],
    },
    believer: {
        yes: ["{name} thinks it over: \"A good idea.\" {then}", "{name} feels a pull and follows it. {then}"],
        no: ["{name} feels a pull but keeps to his own way."],
    },
    doubter: {
        yes: ["{name} shrugs: \"Why not?\" {then}", "{name} frowns, unsure why, and does it anyway. {then}"],
        no: ["{name} feels something nudge him and tells himself it is nothing."],
    },
    atheist: {
        yes: ["{name} decides, all on his own: {then}", "\"I was going that way anyway,\" says {name}, and does it. {then}"],
        no: ["{name} does not even notice the nudge."],
    },
};

// What he does when he follows, by the kind of spot; {where} is the spot's label.
export const THEN = {
    exit: ["He heads for {where}.", "He turns toward {where}."],
    mouth: ["He heads for {where}.", "He turns toward {where}."],
    place: ["He makes for {where}.", "He turns toward {where}."],
    dream: ["The night ahead will not be easy for him.", "He will sleep uneasily tonight."],
    find: ["He looks closer at {where}.", "He studies {where} with care."],
};
