// Wizard Idle v2 - data module. Content is unchanged from v1 (hand-written by Carlos Alonso Maya Lastra).

// Spell animations: sprite sheet name -> school (for sound + stats), frame count and display name.
export const spells = {
    spellAnk_8: {school:"na",frames:16, name:"Faith"},
    spellBread_16: {school:"na",frames:16,name:"Eat"},
    spellChispasBlue_8: {school:"Frost",frames:16,name:"<span style='color:#1E90FF'>Ice shards</span>"},
    spellChispasGreen_8: {school:"Nature",frames:16,name:"<span style='color:#00AB00'>Poison needles</span>"},
    spellChispasReddish_8: {school:"Thunder",frames:16,name:"<span style='color:#FFD800'>Golden touch</span>"},
    spellChispasRed_8: {school:"Fire",frames:16,name:"<span style='color:#E32300'>Crimson flash</span>"},
    spellChispasWhite_8: {school:"Arcane",frames:16,name:"<span style='color:#BA47E0'>Arcane flare</span>"},
    spellChispasYellow_8: {school:"Thunder",frames:16,name:"<span style='color:#FFD800'>Sparks</span>"},
    spellColorSpin_16: {school:"Divine",frames:32,name:"<span style='background: linear-gradient(to right, #1E90FF, #4800FF, #FFD800, #E32300, #BA47E0, #00AB00);-webkit-text-fill-color:transparent;-webkit-background-clip:text;background-clip:text;'>Multielemental vortex</span>"},
    spellHeal_8: {school:"na",frames:16,name:"Heal"},
    spellKey_8: {school:"na",frames:16,name:"Open chest"},
    spellMaldicion_8: {school:"Shadow",frames:16,name:"<span style='color:#4800FF'>Curse</span>"},
    spellPinBlue_16: {school:"Arcane",frames:16,name:"Polymorphy"},
    spellPinRed_16: {school:"na",frames:16,name:"Death"},
    spellPoisson_8: {school:"Nature",frames:16,name:"<span style='color:#00AB00'>Toxic touch</span>"},
    spellPush1: {school:"Arcane",frames:12,name:"<span style='color:#BA47E0'>Arcane blast</span>"},
    spellPush10: {school:"Physical",frames:12,name:"Staff"},
    spellPush2: {school:"Arcane",frames:12,name:"<span style='color:#BA47E0'>Sonic boom</span>"},
    spellPush3: {school:"Nature",frames:12,name:"<span style='color:#00AB00'>Toxic strike </span>"},
    spellPush4: {school:"Fire",frames:12,name:"<span style='color:#E32300'>Fire explotion</span>"},
    spellPush5: {school:"Thunder",frames:12,name:"<span style='color:#FFD800'>Shock</span>"},
    spellPush6: {school:"Physical",frames:12,name:"Staff and cause hemorrhage"},
    spellPush7: {school:"Nature",frames:12,name:"<span style='color:#00AB00'>Viper strike</span>"},
    spellPush8: {school:"Frost",frames:12,name:"<span style='color:#1E90FF'>Ice hit</span>"},
    spellPush9: {school:"Physical",frames:12,name:"Staff"},
    spellRainBlue_24: {school:"Frost",frames:24,name:"<span style='color:#1E90FF'>Blizzard</span>"},
    spellRainGreen_24: {school:"Nature",frames:24,name:"<span style='color:#00AB00'>Toxic rain</span>"},
    spellRainMultiColor_24: {school:"Divine",frames:24,name:"<span style='background: linear-gradient(to right, #1E90FF, #4800FF, #FFD800, #E32300, #BA47E0, #00AB00);-webkit-text-fill-color:transparent;-webkit-background-clip:text;background-clip:text;'>Multielemental tempest</span>"},
    spellRainPurple_24: {school:"Arcane",frames:24,name:"<span style='color:#BA47E0'>Arcane rain</span>"},
    spellRainRed_24: {school:"Fire",frames:24,name:"<span style='color:#E32300'>Armageddon</span>"},
    spellRainSpark_24: {school:"Thunder",frames:24,name:"<span style='color:#FFD800'>Storm</span>"},
    spellRingBlue_8: {school:"Frost",frames:16,name:"<span style='color:#1E90FF'>Frozen mist</span>"},
    spellRingGreen_8: {school:"Nature",frames:16,name:"<span style='color:#00AB00'>Poison cloud</span>"},
    spellRingPale_8: {school:"Fire",frames:16,name:"<span style='color:#E32300'>Superheated steam</span>"},
    spellRingRose_8: {school:"Arcane",frames:16,name:"<span style='color:#BA47E0'>Arcane atmosphere</span>"},
    spellRingYellow_8: {school:"Thunder",frames:8,name:"<span style='color:#FFD800'>Electrostatic ring</span>"},
    spellSparkGold_8: {school:"Thunder",frames:16,name:"<span style='color:#FFD800'>Shock</span>"},
    spellSparkGreen_8: {school:"Nature",frames:16,name:"<span style='color:#00AB00'>Poison sparks</span>"},
    spellSparkRose_8: {school:"Arcane",frames:16,name:"<span style='color:#BA47E0'>Arcane sparks</span>"},
    spellSparkWhite_8: {school:"Frost",frames:16,name:"<span style='color:#1E90FF'>Ice sparks</span>"},
    spellSparkYellow_8: {school:"Fire",frames:16,name:"<span style='color:#E32300'>Fire sparks</span>"},
    spellSpiralBlue_15: {school:"Frost",frames:15,name:"<span style='color:#1E90FF'>Frozen spiral</span>"},
    spellSpiralGreen_15: {school:"Nature",frames:15,name:"<span style='color:#00AB00'>Rancid spiral</span>"},
    spellSpiralRed_15: {school:"Fire",frames:15,name:"<span style='color:#E32300'>Flame spiral</span>"},
    spellSpiralRose_15: {school:"Arcane",frames:15,name:"<span style='color:#BA47E0'>Arcane spiral</span>"},
    spellSpiralYellow_15: {school:"Thunder",frames:15,name:"<span style='color:#FFD800'>Electric spiral</span>"},
    spellStudyGood_15: {school:"na",frames:30,name:"Study ok"},
    spellStudySleep_15: {school:"na",frames:30,name:"Study sleep"},
    spellStudyTry_16: {school:"na",frames:32,name:"Study try"},
    spellWhiteMaldicion_8: {school:"Shadow",frames:16,name:"<span style='color:#4800FF'>White curse</span>"},
    spellWhiteSpin_16: {school:"Frost",frames:32,name:"<span style='color:#1E90FF'>Wind of cold</span>"},
    spellEarthSpike_10: {school:"Nature",frames:20,name:"<span style='color:#00AB00'>Earth spike</span>"},
    spellIceSpike_10: {school:"Frost",frames:20,name:"<span style='color:#1E90FF'>Ice spike</span>"},
    spellChispasMulti_12: {school:"Divine",frames:24,name:"<span style='background: linear-gradient(to right, #1E90FF, #4800FF, #FFD800, #E32300, #BA47E0, #00AB00);-webkit-text-fill-color:transparent;-webkit-background-clip:text;background-clip:text;'>Multielemental sparks</span>"},
    spellCoins: {school:"na",frames:20,name:"Coin"},
    spellSleep_24: {school:"na",frames:24,name:"Sleep"},
    spellMultiDivine_28: {school:"na",frames:28,name:"Divine interaction"},
    spellMiniDados_18: {school:"na",frames:18,name:"Dice"},
};

// Spells the wizard learns, one tier every 10 levels (v1: spellTier0..spellTier20).
export const spellTiers = [
    "spellPush1,spellPush2,spellPush3,spellPush4,spellPush5,spellPush6", // tier 0
    "spellPush7,spellPush8,spellPush9,spellPush10", // tier 1
    "spellChispasBlue_8,spellChispasGreen_8,spellChispasReddish_8", // tier 2
    "spellChispasRed_8,spellChispasWhite_8,spellChispasYellow_8", // tier 3
    "spellMaldicion_8,spellPoisson_8", // tier 4
    "spellSpiralBlue_15,spellSpiralGreen_15", // tier 5
    "spellSpiralRed_15,spellSpiralRose_15", // tier 6
    "spellSpiralYellow_15,spellWhiteSpin_16", // tier 7
    "spellWhiteMaldicion_8,spellRingBlue_8", // tier 8
    "spellEarthSpike_10,spellIceSpike_10", // tier 9
    "spellRingGreen_8,spellRingPale_8", // tier 10
    "spellRingRose_8,spellRingYellow_8", // tier 11
    "spellSparkGold_8,spellSparkGreen_8", // tier 12
    "spellSparkRose_8,spellSparkWhite_8", // tier 13
    "spellRainBlue_24,spellRainRed_24,spellSparkYellow_8", // tier 14
    "spellRainGreen_24", // tier 15
    "spellRainSpark_24", // tier 16
    "spellRainPurple_24", // tier 17
    "spellChispasMulti_12", // tier 18
    "spellRainMultiColor_24", // tier 19
    "spellColorSpin_16", // tier 20
];

// Spells an enemy can cast, by the `type` of its sprite (v1: wizard_spells, melee_spells...).
export const npcSpells = {
    wizard: "spellPush1,spellPush2,spellPush3,spellPush4,spellPush5,spellPush7,spellPush8",
    melee: "spellPush9,spellPush6,spellPush10",
    fire: "spellPush4",
    frost: "spellPush8",
    nature: "spellPush3,spellPush7",
    arcane: "spellPush1,spellPush2",
    thunder: "spellPush5",
    divine: "spellChispasMulti_12",
};
