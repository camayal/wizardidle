// Wizard Idle v2 - entry point.
// Wires the page to the game. In v1 this was done with inline onclick="..." attributes,
// which can't see functions that live inside ES modules.

import { initialName, setName } from './game.js';
import { responsiveLayout } from './ui/layout.js';
import { archBtn, statsBtn, killBtn, mapBtn, helpBtn, btnCloseEvent } from './ui/menu.js';
import { pjBtn, centerBtn, npcBtn } from './divine.js';

// Handlers are assigned as .onclick properties (not addEventListener) on purpose:
// disableMainButtons()/enableMainButtons() in ui/scrolls.js temporarily swap .onclick
// to block the toolbar while a scroll is open.
const clickHandlers = {
    startBtn: setName,
    btn1: archBtn,
    btn2: statsBtn,
    btn3: killBtn,
    btn5: mapBtn,
    btn6: helpBtn,
    pjDivineBtn: pjBtn,
    centerDivineBtn: centerBtn,
    npcDivineBtn: npcBtn,
    btnClose: btnCloseEvent,
};
for (const [id, handler] of Object.entries(clickHandlers)) {
    document.getElementById(id).onclick = () => handler();
}

window.addEventListener('resize', () => responsiveLayout());
window.addEventListener('load', () => responsiveLayout());

// Offline mode (service-worker.js). Registered after load so storing ~6 MB of art and
// sound doesn't slow down the first visit.
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js').catch((error) => console.warn('[offline] not available:', error));
    });
}

initialName();
