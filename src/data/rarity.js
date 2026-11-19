// Wizard Idle v2 - Achievement rarity: eight tiers, from the grey common to the golden divine.
// The tier of each achievement was set from the achievement-rates playtest (docs/playtests/
// 2026-11-18-achievement-rates: the bots earn a dozen of them in every run to level 200, those are
// the common end) and from how rare the deed is for a person. Achievements not listed are common.

const tiers = [
    {key: "common",    name: "Common",    color: "#6e6e6e"},
    {key: "uncommon",  name: "Uncommon",  color: "#2e8b2e"},
    {key: "rare",      name: "Rare",      color: "#2468c8"},
    {key: "epic",      name: "Epic",      color: "#8a3fc0"},
    {key: "legendary", name: "Legendary", color: "#e07a10"},
    {key: "mythic",    name: "Mythic",    color: "#c02828"},
    {key: "ancient",   name: "Ancient",   color: "#1a9aa8"},
    {key: "divine",    name: "Divine",    color: "#d4a017"},
];

const rarityOf = {
    logro_lvl2: "common", logro_primerbossderrotado: "common", logro_primeraderrotaporboss: "common", logro_attack500: "common",
    logro_killedbysheep: "uncommon", logro_killedbychicken: "uncommon", logro_pots: "uncommon", logro_botines: "uncommon", logro_attack1000: "uncommon",
    logro_ultimocapricor: "rare", logro_tocado: "rare", logro_level140: "rare", logro_hydramystery: "rare", logro_vistoaguilaencueva: "rare",
    logro_tabernero: "epic", logro_libros: "epic", logro_runas: "epic", logro_hategod: "epic",
    logro_level200: "legendary", logro_capricorreturns: "legendary",
    logro_namesake: "divine",
};

export { tiers, rarityOf };
