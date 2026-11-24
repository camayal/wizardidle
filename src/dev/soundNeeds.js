// Wizard Idle v2 - dev tools: the moves that still need a sound (the sounds dev mode's list).
//
// One entry per move, heard on that move (the author's rule: never several creatures under one
// entry; bosses apart from regular enemies; each boss spell its own sound). From docs/SOUNDS.md,
// "Boss moves: one sound each". When a sound is approved, delete its line (or add done: true).
//
// scene is what the sounds mode puts on the scene (the lists of src/dev/scenes.js): kind, target
// (what) and variant (which). Any other scene can be picked freely in the mode too.

export const soundNeeds = [




    { id: 'MED.poison_strike', who: 'Medusa', move: 'poison strike', scene: { kind: 'boss', target: 'medusa', variant: 'poison_strike' } },




    { id: 'HYD.swamp.strike', who: 'Hydras', move: 'strike (Swamp hydra)', scene: { kind: 'hydra', target: 'mother', variant: '4 heads: strike' } },
    { id: 'HYD.ice.strike', who: 'Hydras', move: 'strike (ice hydra)', scene: { kind: 'hydra', target: 'icedra', variant: '3 heads: strike' } },
    { id: 'HYD.dunes.strike', who: 'Hydras', move: 'strike (Dunes hydra)', scene: { kind: 'hydra', target: 'hydskon', variant: '2 heads: strike' } },
    { id: 'HYD.ice.frost_breath', who: 'Hydras', move: 'frost breath (ice hydra)', scene: { kind: 'hydra', target: 'icedra', variant: '3 heads: cast' } },


    { id: 'SCN.whirlwind', who: 'Scene spells no boss casts yet', move: 'whirlwind', scene: { kind: 'scene', target: 'whirlwind' } },
    { id: 'SCN.eclipse', who: 'Scene spells no boss casts yet', move: 'eclipse', scene: { kind: 'scene', target: 'eclipse' } },

    { id: 'DICE.roll', who: 'Dice game', move: 'the roll (about 1.2 to 1.4 s, clatter early, settled by the end)', scene: { kind: 'dice', target: 'dice' } },
];
