// Wizard Idle - the trophy room of the hunters' hut: the empty wall of the round hut (img/places/el_poblado/el_poblado_cazadores_trofeos.png,
// 256 x 64, no door) with the trophies he has hung (state.trophies, boss ids in the order he brought them), drawn on the props canvas.
// The plaques are 32 x 32 sprites (img/objects/item_trophy_<boss>.png) put space by space in a zigzag: two rows, the lower one shifted
// half a plaque and drawn over the upper one's feet. Room for SLOTS plaques; more are not drawn (the author checks how many fit).

import { art } from '../media.js';
import { state } from '../state.js';
import { run, ui } from '../runtime.js';

export const TROPHY_ROOM = 'el_poblado_cazadores_trofeos';
const PLAQUE = 32, ROW_Y = [2, 14], SLOTS = 15;

// Where slot i sits (scene sprite px, top-left of the plaque): even slots on the upper row, odd ones on the lower, half a plaque to the right.
export const slotAt = (i) => ({ x: Math.floor(i / 2) * PLAQUE + (i % 2) * (PLAQUE / 2), y: ROW_Y[i % 2] });

const images = {};
function load(name, then) {
    const img = images[name] || (images[name] = Object.assign(new Image(), { src: art(name) }));
    if (img.complete && img.naturalWidth) then(img); else img.addEventListener('load', () => then(img), { once: true });
}

export const hung = () => (state.trophies = state.trophies || []);
export function hang(boss) { if (boss && !hung().includes(boss)) hung().push(boss); }

let here = false;
function paint() {
    if (run.simulation || !here) return;
    const canvas = document.getElementById('propsCanvas');
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const list = hung().slice(0, SLOTS), u = ui.charWidth / 32;
    list.forEach((boss, i) => load(`item_trophy_${boss}`, (img) => {
        if (!here) return;
        const ctx = canvas.getContext('2d'), s = slotAt(i);
        ctx.imageSmoothingEnabled = !ui.crisp;
        ctx.drawImage(img, s.x * u, s.y * u, PLAQUE * u, PLAQUE * u);
    }));
}

// A background was loaded: show the plaques when it is the trophy room (call it after showDiceTable, which clears the props canvas).
export function showTrophyWall(bg) {
    here = (bg || '').toLowerCase() === TROPHY_ROOM;
    if (here) paint();
}
export const repaintTrophyWall = () => paint();
