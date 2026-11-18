// Wizard Idle v2 - texts for the time away (docs/AWAY.md). Placeholder wording until the
// thinker's final texts land in AWAY.md. {name} is the wizard's name.

export const awayTexts = {
    // console line when he is found fallen after about a month away (he can still be revived)
    softDead: "{name} has lain here since dawn. If no god comes for him before nightfall, it will be his last day.",
    // the poem on a scroll when he died for good while away (the only thing the player is told)
    poemTitle: "Farewell",
    poem: "You looked away, and the world went on without you.<br>{name} lay waiting and counted the hours,<br>then he stopped counting.<br>For you, time is nothing.<br>For him it was everything he had.<br>No one came.",
};

export function awayText(key, name) {
    return awayTexts[key].replace("{name}", name);
}
