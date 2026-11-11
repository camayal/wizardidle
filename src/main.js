// Wizard Idle v2 - entry point.
// Wires the page to the game. In v1 this was done with inline onclick="..." attributes,
// which can't see functions that live inside ES modules.

import * as game from './game.js';

// Handlers are assigned as .onclick properties (not addEventListener) on purpose:
// disableMainButtons()/enableMainButtons() in game.js temporarily swap .onclick
// to block the toolbar while a scroll is open.
const clickHandlers = {
    startBtn: game.setName,
    btn1: game.archBtn,
    btn2: game.statsBtn,
    btn3: game.killBtn,
    btn5: game.mapBtn,
    btn6: game.helpBtn,
    pjDivineBtn: game.pjBtn,
    centerDivineBtn: game.centerBtn,
    npcDivineBtn: game.npcBtn,
    btnClose: game.btnCloseEvent,
};
for (const [id, handler] of Object.entries(clickHandlers)) {
    document.getElementById(id).onclick = () => handler();
}

window.addEventListener('resize', () => game.responsiveLayout());
window.addEventListener('load', () => game.responsiveLayout());

game.initialName();
