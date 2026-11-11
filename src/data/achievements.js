// Wizard Idle v2 - data module. Content is unchanged from v1 (hand-written by Carlos Alonso Maya Lastra).

// Achievements ("logros"). Unlocking logic lives with the game (logro.set).
// Entries marked planned:true were sketched in v1 but never finished (no title, no trigger).
// They stay hidden and don't count towards completion until they are designed.
export const achievements = {
    logro_attack500: {name:"logro_attack500", title:"Over 500!", description:"Great performance!, execute a 500 HP attack"},//ok
    logro_attack1000: {name:"logro_attack1000", title:"Divine hit!", description:"The power of a god is inside, execute a 1000 HP attack"},//ok
    logro_botines: {name:"logro_botines", title:"Follow the pirate path", description:"Excellent work for someone without a shovel, found 100 chests"},//ok
    logro_pots: {name:"logro_pots", title:"Fragile, handle with care", description:"This behavior have some link, break 100 pots"},//ok
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
    logro_lvl2: {name:"logro_lvl2", title:"Level UP!", description:"Reach to the level 2, no new powers but pure fun"},//ok
    logro_level140: {name:"logro_level140", title:"A new king", description:"Occupate the throne and kill King Midas"},//ok
    logro_level200: {name:"logro_level200", title:"The return of the king", description:"A evil king with a great power, recover the throne"},//ok
    logro_libros: {name:"logro_libros", title:"The librarian", description:"Like Alejandria but pixelated, found 1000 books"},
    logro_muchapradera: {name:"logro_muchapradera", planned:true, title:"", description:""},
    logro_muchopoblado: {name:"logro_muchopoblado", planned:true, title:"", description:""},
    logro_primeraderrotaporboss: {name:"logro_primeraderrotaporboss", title:"Poor little creature", description:"A boss can not be underestimated, killed by a boss for first time"},//ok
    //logro_primerboss: {name:"logro_primerboss", title:"", description:""},
    logro_primerbossderrotado: {name:"logro_primerbossderrotado", title:"Piece of cake", description:"Who is the boss now?, defeat a boss"},//ok
    logro_ricachon: {name:"logro_ricachon", planned:true, title:"", description:""},
    logro_runas: {name:"logro_runas", title:"Someone is throwing rocks", description:"Runemaster, found 1000 runes to study"},
    logro_tabernero: {name:"logro_tabernero", title:"BnB, beer and bed", description:"Spend some time in a inn, visit 250 times a inn"},
    logro_tocado: {name:"logro_tocado", title:"Feel the divine touch", description:"Touched many times"},
    logro_ultimocapricor: {name:"logro_ultimocapricor", title:"The last of their kind", description:"Kill the last existing Capricor, an ateist lineage with no revive posibilities, are you happy?"},
    logro_vistoaguilaencueva: {name:"logro_vistoaguilaencueva", title:"Why this animal is here?", description:"Found a eagle in the cave"},
    logro_killedbysheep: {name:"logro_killedbysheep", title:"Shaaaaame on you", description:"Killed by a powerful sheep"},//ok
    logro_killedbychicken: {name:"logro_killedbychicken", title:"The last cluck-cluck", description:"Badly defeated by a demonic chicken"},//ok
    logro_namesake: {name:"logro_namesake", title:"Tocayo", description:"Find a namesake, something almost impossible in these lands"},//ok -i
    logro_hategod:  {name:"logro_hategod", title:"Atheist!", description:"Found a new way to live the life, pure and real hate for god, reach -10K of faith"},//ok -i
    //love god give setLocal("travelFavor",1)
    logro_hydramystery:  {name:"logro_hydramystery", title:"The hydra is awake", description:"Discover the mantra to wake up the ancient hydras"},//ok
};
