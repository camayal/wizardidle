// Wizard Idle v2 - Achievement rarity: eight tiers, from the grey common to the golden divine.
// Tiers come from tools/odds.py (share of players who ever earn it, with players quitting at random;
// data docs/playtests/2026-11-18-odds-data) and judgment: hydramystery (bots know the mantra, a person must find it)
// and the never-seen ones (tocado, eagle, capricorreturns, namesake) keep their guessed tier. Re-run odds.py after real testing. Achievements not listed are common.

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
    logro_ultimocapricor: "common", logro_killedbysheep: "common",
    logro_attack1000: "uncommon", logro_killedbychicken: "uncommon",
    logro_level140: "rare", logro_level200: "rare", logro_hategod: "rare", logro_runas: "rare", logro_hydramystery: "rare",
    logro_tocado: "rare", logro_vistoaguilaencueva: "rare",
    logro_pots: "epic", logro_botines: "epic",
    logro_tabernero: "legendary", logro_capricorreturns: "legendary",
    logro_libros: "mythic",
    logro_namesake: "divine",
};

export { tiers, rarityOf };
