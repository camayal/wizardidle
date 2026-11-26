// Wizard Idle v2 - data module. Content is unchanged from v1 (hand-written by Carlos Alonso Maya Lastra).

// Achievements ("logros"). Unlocking logic lives with the game (logro.set).
// Adding one: also set its tier in data/rarity.js and re-run a playtest and tools/odds.py (docs/MAP.md); a counter achievement also goes in COUNTERS there.
// Entries marked planned:true were sketched in v1 but never finished (no title, no trigger).
// They stay hidden and don't count towards completion until they are designed.
export const achievements = {
    logro_attack500: {name:"logro_attack500", title:"Over 500!", description:"Great performance! Land a 500 HP attack."},//ok
    logro_attack1000: {name:"logro_attack1000", title:"Divine hit!", description:"The power of a deity flows through you. Land a 1000 HP attack."},//ok
    logro_botines: {name:"logro_botines", title:"Follow the pirate path", description:"Excellent work for someone without a shovel. Find 100 chests."},//ok
    logro_pots: {name:"logro_pots", title:"Fragile, handle with care", description:"This behaviour has a certain Link to it. Break 100 pots."},//ok
    logro_corazongrande: {name:"logro_corazongrande", planned:true, title:"logro_corazongrande", description:"logro_corazongrande"},
    logro_dadoscargados: {name:"logro_dadoscargados", planned:true, title:"logro_dadoscargados", description:"logro_dadoscargados"},
    logro_dormiletas: {name:"logro_dormiletas", planned:true, title:"logro_dormiletas", description:"logro_dormiletas"},
    logro_esosiesiluminacion: {name:"logro_esosiesiluminacion", planned:true, title:"logro_esosiesiluminacion", description:"logro_esosiesiluminacion"},
    logro_estudioso: {name:"logro_estudioso", planned:true, title:"logro_estudioso", description:"logro_estudioso"},
    logro_fanatico: {name:"logro_fanatico", planned:true, title:"logro_fanatico", description:"logro_fanatico"},
    logro_flawless: {name:"logro_flawless", planned:true, title:"logro_flawless", description:"logro_flawless"},
    logro_fullcarga: {name:"logro_fullcarga", planned:true, title:"", description:""},
    logro_inventariolleno: {name:"logro_inventariolleno", planned:true, title:"", description:""},
    logro_jugon: {name:"logro_jugon", planned:true, title:"", description:""},    
    logro_lvl2: {name:"logro_lvl2", title:"Level UP!", description:"Reach level 2. No new powers, just pure fun."},//ok
    logro_level140: {name:"logro_level140", title:"A new king", description:"Kill King Midas and take his throne."},//ok
    logro_level200: {name:"logro_level200", title:"The return of the king", description:"An evil king of great power. Take back the throne."},//ok
    logro_libros: {name:"logro_libros", title:"The librarian", description:"Like Alexandria, but pixelated. Find 1000 books."},
    logro_muchapradera: {name:"logro_muchapradera", planned:true, title:"", description:""},
    logro_muchopoblado: {name:"logro_muchopoblado", planned:true, title:"", description:""},
    logro_primeraderrotaporboss: {name:"logro_primeraderrotaporboss", title:"Poor little creature", description:"Never underestimate a boss. Get killed by a boss for the first time."},//ok
    logro_primerbossderrotado: {name:"logro_primerbossderrotado", title:"Piece of cake", description:"Who's the boss now? Defeat a boss."},//ok
    logro_ricachon: {name:"logro_ricachon", planned:true, title:"", description:""},
    logro_runas: {name:"logro_runas", title:"Someone is throwing rocks", description:"Runemaster. Find 1000 runes to study."},
    logro_tabernero: {name:"logro_tabernero", title:"B&B: beer and bed", description:"Spend some time at the inn. Visit an inn 250 times."},
    logro_hardened: {name:"logro_hardened", title:"Hardened Heart", description:"Pray in despair and hear nothing. Let a prayer go unanswered."},
    logro_mercy: {name:"logro_mercy", title:"A merciful deity", description:"Be Devout while the deity is known for healing."},
    logro_wrath: {name:"logro_wrath", title:"A wrathful deity", description:"Be Devout while the deity is known for striking."},
    logro_distant: {name:"logro_distant", title:"A distant deity", description:"Be Devout while the deity is known for silence."},
    logro_tocado: {name:"logro_tocado", title:"Feel the divine touch", description:"Feel your touch many times."},
    logro_ultimocapricor: {name:"logro_ultimocapricor", title:"The last of their kind", description:"Kill the last living Capricor, an atheist lineage with no hope of revival. Are you happy?"},
    logro_capricorreturns: {name:"logro_capricorreturns", title:"Aren't you extinct?", description:"Kill the \"last\" Capricor again, with another wizard"},
    logro_vistoaguilaencueva: {name:"logro_vistoaguilaencueva", title:"Why is this animal here?", description:"Find an eagle in the cave."},
    logro_killedbysheep: {name:"logro_killedbysheep", title:"Shaaaaame on you", description:"Get killed by a mighty sheep."},//ok
    logro_killedbychicken: {name:"logro_killedbychicken", title:"The last cluck-cluck", description:"Get badly beaten by a demonic chicken."},//ok
    logro_spectra: {name:"logro_spectra", title:"All the colours", description:"Defeat the seven secret spectra of the Tundra"},
    logro_namesake: {name:"logro_namesake", title:"Tocayo", description:"Find a namesake, something almost impossible in these lands"},//ok -i
    logro_hategod:  {name:"logro_hategod", title:"Atheist!", description:"A new way of life: pure, honest hatred for the heavens. Lose every belief in the heavens."},//ok -i
    // planned: when the god loves the wizard, unlock state.travelFavor (map travel)
    logro_hydramystery:  {name:"logro_hydramystery", title:"The hydra is awake", description:"Discover the mantra that wakes the ancient hydras."},//ok
};
