// Wizard Idle - the trophy room of the hunters' hut: the empty wall of the round hut (img/places/el_poblado/el_poblado_cazadores_trofeos.png,
// 256 x 64, no door) with the trophies he has hung (state.trophies, boss ids in the order he brought them), drawn on the props canvas.
// The plaques are 32 x 32 sprites shown at 24 px (img/objects/item_trophy_<boss>.png) put space by space in a zigzag: two rows, the lower one shifted
// half a plaque and drawn over the upper one's feet. Room for SLOTS plaques; more are not drawn (the author checks how many fit).

import { art } from '../media.js';
import { state } from '../state.js';
import { run, ui } from '../runtime.js';

export const TROPHY_ROOM = 'el_poblado_cazadores_trofeos';
const PLAQUE = 24, STRIDE = 32, ROW_Y = [2, 14], SLOTS = 15;       // plaques drawn at 75% (24 px) so more fit; the sprite is 32 px

// Where slot i sits (scene sprite px, top-left of the plaque): even slots on the upper row, odd ones on the lower, half a plaque to the right.
export const slotAt = (i) => ({ x: 4 + Math.floor(i / 2) * STRIDE + (i % 2) * (STRIDE / 2), y: ROW_Y[i % 2] });

const images = {};
function load(name, then) {
    const img = images[name] || (images[name] = Object.assign(new Image(), { src: art(name) }));
    if (img.complete && img.naturalWidth) then(img); else img.addEventListener('load', () => then(img), { once: true });
}

export const hung = () => (state.trophies = state.trophies || []);
export function hang(boss) { if (boss && !hung().includes(boss)) hung().push(boss); }

export const MAIN_HUT = 'el_poblado_cazadores';
const CAPRICOR = { x: 222, y: -1 };           // the goat's head over the counter of the main hall (a rare rare with a story: not in the trophy room)
let here = false, main = false;
function paint() {
    if (run.simulation || !(here || main)) return;
    const canvas = document.getElementById('propsCanvas');
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const u = ui.charWidth / 32;
    if (main) { if (hung().includes('capricor')) load('item_trophy_capricor', (img) => { if (main) { const ctx = canvas.getContext('2d'); ctx.imageSmoothingEnabled = !ui.crisp; ctx.drawImage(img, CAPRICOR.x * u, CAPRICOR.y * u, 32 * u, 32 * u); } }); return; }
    const list = hung().filter((b) => b !== 'capricor').slice(0, SLOTS);
    list.forEach((boss, i) => load(`item_trophy_${boss}`, (img) => {
        if (!here) return;
        const ctx = canvas.getContext('2d'), s = slotAt(i);
        ctx.imageSmoothingEnabled = !ui.crisp;
        ctx.drawImage(img, s.x * u, s.y * u, PLAQUE * u, PLAQUE * u);
    }));
}

// A background was loaded: show the plaques when it is the trophy room (call it after showDiceTable, which clears the props canvas).
export function showTrophyWall(bg) {
    const name = (bg || '').toLowerCase();
    here = name === TROPHY_ROOM;
    main = name === MAIN_HUT;
    if (here || main) paint();
}
export const repaintTrophyWall = () => paint();
