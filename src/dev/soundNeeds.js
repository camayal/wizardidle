// Wizard Idle v2 - dev tools: the moves that still need a sound (the sounds dev mode's list).
//
// One entry per move, heard on that move (the author's rule: never several creatures under one
// entry; bosses apart from regular enemies; each boss spell its own sound). From docs/SOUNDS.md,
// "Boss moves: one sound each". When a sound is approved, delete its line (or add done: true).
//
// scene is what the sounds mode puts on the scene (the lists of src/dev/scenes.js): kind, target
// (what) and variant (which). Any other scene can be picked freely in the mode too.

export const soundNeeds = [
    { id: 'EN.golem.slam', who: 'Regular enemies', move: 'slam (Golem)', scene: { kind: 'enemyMove', target: 'el_golem1', variant: 'slam' } },

    { id: 'DOR.arcane_rain', who: 'Doria', move: 'arcane rain', scene: { kind: 'boss', target: 'doria', variant: 'arcane_rain' } },

    { id: 'KKC.poison_cloud', who: 'Kkck', move: 'poison cloud', scene: { kind: 'boss', target: 'kkck', variant: 'poison_cloud' } },

    { id: 'SKE.arcane_rain', who: 'Skeleton', move: 'arcane rain', scene: { kind: 'boss', target: 'skeleton', variant: 'arcane_rain' } },

    { id: 'MED.poison_strike', who: 'Medusa', move: 'poison strike', scene: { kind: 'boss', target: 'medusa', variant: 'poison_strike' } },

    { id: 'ARC.golden_storm', who: 'Arcangel', move: 'golden storm', scene: { kind: 'boss', target: 'arcangel', variant: 'golden_storm' } },

    { id: 'ETY.orb_pulse', who: 'Etymos', move: 'prism pulse', scene: { kind: 'boss', target: 'etymos', variant: 'orb_pulse' } },
    { id: 'ETY.colour_burst', who: 'Etymos', move: 'colour burst', scene: { kind: 'boss', target: 'etymos', variant: 'colour_burst' } },

    { id: 'ROJ.fire_rain', who: 'Rojo', move: 'fire rain', scene: { kind: 'boss', target: 'rojo', variant: 'fire_rain' } },

    { id: 'HYD.swamp.strike', who: 'Hydras', move: 'strike (Swamp hydra)', scene: { kind: 'hydra', target: 'mother', variant: '4 heads: strike' } },
    { id: 'HYD.ice.strike', who: 'Hydras', move: 'strike (ice hydra)', scene: { kind: 'hydra', target: 'icedra', variant: '3 heads: strike' } },
    { id: 'HYD.dunes.strike', who: 'Hydras', move: 'strike (Dunes hydra)', scene: { kind: 'hydra', target: 'hydskon', variant: '2 heads: strike' } },
    { id: 'HYD.ice.frost_breath', who: 'Hydras', move: 'frost breath (ice hydra)', scene: { kind: 'hydra', target: 'icedra', variant: '3 heads: cast' } },

    // Tried and approved once in the sounds mode (docs/SOUNDS.md, second table): the author checks them again
    // with the files from his test folder; delete a line when its sound is approved and wired.
    { id: 'MID.rainbow_orbs', who: 'Midas', move: 'rainbow orbs', scene: { kind: 'boss', target: 'midas', variant: 'rainbow_orbs' } },
    { id: 'MID.golden_rays', who: 'Midas', move: 'golden rays', scene: { kind: 'boss', target: 'midas', variant: 'golden_rays' } },
    { id: 'MID.golden_touch', who: 'Midas', move: 'golden touch', scene: { kind: 'boss', target: 'midas', variant: 'golden_touch' } },
    { id: 'ROJ.slam', who: 'Rojo', move: 'slam', scene: { kind: 'boss', target: 'rojo', variant: 'slam' } },
    { id: 'ROJ.flaming_punch', who: 'Rojo', move: 'flaming punch', scene: { kind: 'boss', target: 'rojo', variant: 'flaming_punch' } },
    { id: 'CUB.spit', who: 'Cuboq', move: 'spit', scene: { kind: 'boss', target: 'cuboq', variant: 'spit' } },
    { id: 'SKE.great_slash', who: 'Skeleton', move: 'great slash', scene: { kind: 'boss', target: 'skeleton', variant: 'great_slash' } },
    { id: 'SKE.curse', who: 'Skeleton', move: 'curse', scene: { kind: 'boss', target: 'skeleton', variant: 'curse' } },
    { id: 'RAI.ice_spikes', who: 'Rainbow', move: 'ice spikes', scene: { kind: 'boss', target: 'rainbow', variant: 'ice_spikes' } },
    { id: 'RAI.blizzard', who: 'Rainbow', move: 'blizzard', scene: { kind: 'boss', target: 'rainbow', variant: 'blizzard' } },
    { id: 'FEN.fire_breath', who: 'Fenix', move: 'fire breath', scene: { kind: 'boss', target: 'fenix', variant: 'fire_breath' } },
    { id: 'FEN.wing_flap', who: 'Fenix', move: 'wing flap', scene: { kind: 'boss', target: 'fenix', variant: 'wing_flap' } },
    { id: 'FEN.flame_pillar', who: 'Fenix', move: 'flame pillar', scene: { kind: 'boss', target: 'fenix', variant: 'flame_pillar' } },
    { id: 'PRO.earth_spikes', who: 'Protromus', move: 'earth spikes', scene: { kind: 'boss', target: 'protromus', variant: 'earth_spikes' } },
    { id: 'GOR.flurry', who: 'Goro', move: 'flurry', scene: { kind: 'boss', target: 'goro', variant: 'flurry' } },
    { id: 'GOR.slam', who: 'Goro', move: 'slam', scene: { kind: 'boss', target: 'goro', variant: 'slam' } },
    { id: 'GOR.charge', who: 'Goro', move: 'charge', scene: { kind: 'boss', target: 'goro', variant: 'charge' } },
    { id: 'INF.arcane_flare', who: 'Infraespectro', move: 'arcane flare', scene: { kind: 'boss', target: 'infraespectro', variant: 'arcane_flare' } },
    { id: 'INF.phase', who: 'Infraespectro', move: 'phase', scene: { kind: 'boss', target: 'infraespectro', variant: 'phase' } },
    { id: 'HER.vines', who: 'Herbus', move: 'vines', scene: { kind: 'boss', target: 'herbus', variant: 'vines' } },
    { id: 'HER.spores', who: 'Herbus', move: 'spores', scene: { kind: 'boss', target: 'herbus', variant: 'spores' } },
    { id: 'ARC.lightning', who: 'Arcangel', move: 'lightning', scene: { kind: 'boss', target: 'arcangel', variant: 'lightning' } },

    { id: 'SCN.whirlwind', who: 'Scene spells no boss casts yet', move: 'whirlwind', scene: { kind: 'scene', target: 'whirlwind' } },
    { id: 'SCN.eclipse', who: 'Scene spells no boss casts yet', move: 'eclipse', scene: { kind: 'scene', target: 'eclipse' } },
    { id: 'SCN.divine_light', who: 'Scene spells no boss casts yet', move: 'divine light', scene: { kind: 'scene', target: 'divine_light' } },
    { id: 'SCN.healing_rain', who: 'Scene spells no boss casts yet', move: 'healing rain', scene: { kind: 'scene', target: 'healing_rain' } },

    { id: 'DICE.roll', who: 'Dice game', move: 'the roll (about 1.2 to 1.4 s, clatter early, settled by the end)', scene: { kind: 'dice', target: 'dice' } },
];
