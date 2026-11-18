// Wizard Idle v2 - texts for the time away (docs/AWAY.md). Placeholder wording until the
// thinker's final texts land in AWAY.md. {name} is the wizard's name.

export const awayTexts = {
    // console line when he is found fallen after about a month away (he can still be revived)
    softDead: "{name} has lain in the {zone} since dawn. If no god comes for him before nightfall, it will be his last day.",
};

// The poems for an absence permadeath, a shuffle bag per world (they never repeat until all
// have been read). The thinker's eight final poems (docs/AWAY.md, Final poems). title: the first line, bigger; lines: one per line, HTML; {name} and {zone}.
export const poems = [
    { id: "a", title: "No one came", lines: [
        "You looked away, and the world went on without you.",
        "{name} lay in the {zone} and waited,",
        "then he stopped waiting.",
        "For you, time is nothing.",
        "For him it was everything he had.",
        "No one came.",
    ] },
    { id: "b", title: "The last call", lines: [
        "{name} called you at dusk, and again at dawn.",
        "After that, he did not call.",
        "A god can be gone for a moment.",
        "A man is gone for good.",
        "The {zone} keeps him now.",
    ] },
    { id: "c", title: "The candle", lines: [
        "{name} kept a small light burning for you.",
        "He shielded it from the wind with his hands.",
        "You did not come to see it.",
        "The light went out, and so did he.",
        "He will not light another.",
    ] },
    { id: "d", title: "The road", lines: [
        "{name} watched the road for you.",
        "Every shadow on it might have been you.",
        "None of them were.",
        "He is still facing the road,",
        "but his eyes are closed for good.",
    ] },
    { id: "e", title: "Stars", lines: [
        "{name} looked up for you",
        "until the stars moved on without him.",
        "You were somewhere else.",
        "He was only here.",
        "Now the {zone} has him, and will not give him back.",
    ] },
    { id: "f", title: "Last prayer", lines: [
        "{name} prayed softly, so as not to wake you,",
        "and waited for an answer.",
        "None came.",
        "He forgave you. It was the last thing he did.",
        "He will not rise again.",
    ] },
    { id: "g", title: "Dust", lines: [
        "Dust settled on {name} while he waited,",
        "and he did not brush it off.",
        "He wanted you to find him as he was.",
        "You did not find him.",
        "The dust is all that keeps him now.",
    ] },
    { id: "h", title: "A blink", lines: [
        "To you it was a blink.",
        "To {name} it was the rest of his life.",
        "He spent all of it waiting for you,",
        "and you did not come.",
        "He is gone, and he will not come back.",
    ] },
];

// A text with {name} and {zone} filled in.
export function awayText(key, slots) {
    return awayTexts[key].replace(/\{(\w+)\}/g, (w, k) => (k in slots ? slots[k] : w));
}
