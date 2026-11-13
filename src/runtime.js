// Wizard Idle v2 - what the game keeps in mind while it runs (never saved).
//
// In v1 these were loose global variables shared by the whole game. They're grouped here
// so every module can read and change them. Unlike `state` (src/state.js), none of this
// survives a page reload, exactly as in v1: a fight in progress is simply gone.
// Starting values are set in game.js, in the same order v1 set them.

// The current fight.
export const fight = {
    enemy: undefined,              // enemy family or boss/hydra name, e.g. "el_golem", "doria"
    enemyAndNumber: undefined,     // sprite of a normal enemy, e.g. "el_golem5"
    enemyName: undefined,          // display name, e.g. "<i>Zubruwi</i> the Maro"
    enemyHP: undefined,
    enemyHPbase: undefined,
    spellEnemy: undefined,         // spell the enemy casts
    bossCombat: undefined,
    hydraCombat: undefined,
    hydra: undefined,              // hydra name in hydra fights, e.g. "mother"
    bossMultiplier: undefined,     // HP multiplier for bosses
    bossGoldMultiplier: undefined,
    polymorphed: undefined,        // enemy turned into a sheep or a chicken
    polymorphedAnimal: undefined,
    pjDead: undefined,             // the wizard has fallen
    autorevive: undefined,         // timer for the wizard's self-revive
};

// The flow of the current session.
export const run = {
    previousEvent: undefined,      // last event type, for texts like "finds another enemy"
    multipleEventsCounter: undefined,
    timeStart: undefined,          // loop.now() when play time was last counted
    pause: undefined,
    offer: undefined,              // gold asked at a shrine
    feGanada: undefined,           // faith just gained, for the message
    objectToBreak: undefined,      // loot container: pot, chest, barrel...
    objectToStudy: undefined,      // rune or book
    restAtInn: undefined,
    afterChapterExe: undefined,
    disablePjBtn: undefined,       // divine buttons temporarily blocked
    disableCenterBtn: undefined,
    simulation: false,             // simulation mode (src/dev/sim.js): no sound, no spell animations
    forceOnce: undefined,          // dev tools: event number for the next event only
    forceEnemy: undefined,         // dev tools: sprite for the next normal enemy, e.g. "animalejo13"
};

// Screen layout and what's on screen.
export const ui = {
    objectSize: undefined,         // main square size, depends on the window
    headLevel: undefined,
    squareSide: undefined,
    charWidth: undefined,
    charHeight: undefined,
    jumpSpace: undefined,          // how high characters hop when animated (v1: JUMPSPACE, set once at load)
    em: undefined,                 // base font size in px
    xpPercent: undefined,
    frameCounter: undefined,       // character animation frame
    sceneOnTop: undefined,
    currentBackGround: undefined,
    scrollCurrentContent: undefined, // which scroll is open: "stats", "achievements", ...
    statsPage: undefined,
    wizardOffset: 0,               // how far right of his place the wizard walked (sprite px)
    findSpot: null,                // where a find lies in the scene (sprite px), see events.js
    crisp: true,                   // sprites drawn as sharp pixels (dev bar can switch it off to compare)
    scrollViews: { stats: "stats", kill: "kill" },  // front page of each tabbed scroll (ui/scrolls.js)
    audio: undefined,              // last sound played
    goldIcon: undefined,           // <img> snippets sized to em, used in console messages
    spiritIcon: undefined,
    attackIcon: undefined,
    healIcon: undefined,
    heartIcon: undefined,
};
