// Wizard Idle - the table of a dice house and its dice, on their own canvas between the scene and the characters
// (img/places/dice/: dice_table_<style>, dice_tumble_<style> 14 frames of 40 x 40, dice_faces_<style> six 4 x 4 faces).
// Every size and position below is in scene sprite px (the scene is 256 x 64). The wizard throws from the left
// (the strip as drawn); the gambler throws from the right (the strip mirrored over the table's middle).

import { art } from '../media.js';
import { run, ui } from '../runtime.js';

// Dice house backgrounds and the style of their table (red lacquer, wood, bone). The desert tent joins when it exists.
export const DICE_HOUSES = { la_ciudad_casadados: "ciudad", el_poblado_casadados: "poblado" };

const TABLE = { x: 148, y: 27, w: 34 };
export const WIZARD_AT_TABLE = 80;                  // wizardOffset that puts him just left of the table
const SPOTS = [[8, 2], [15, 2], [22, 2], [11, 6], [19, 6]];     // where the five dice rest, from the table's top-left: back row, then front row
const CELL = 40, CELL_DX = -14, CELL_DY = -30, FRAMES = 14, FRAME_MS = 100, DIE = 4;

let style = null, faces = [], seq = 0;
const images = {};

function load(name, then) {
    const img = images[name] || (images[name] = Object.assign(new Image(), { src: art(name) }));
    if (img.complete && img.naturalWidth) then(img); else img.addEventListener("load", () => then(img), { once: true });
}

// The table, and either the tumbling dice (frame >= 0) or the faces that came up.
function paint(frame = -1, mirror = false) {
    if (run.simulation) return;
    const canvas = document.getElementById("propsCanvas");
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    if (!style) return;
    const mine = style;
    load(`dice_table_${mine}`, (table) => load(`dice_tumble_${mine}`, (tumble) => load(`dice_faces_${mine}`, (strip) => {
        if (style !== mine) return;
        const ctx = canvas.getContext("2d"), u = ui.charWidth / 32;
        ctx.imageSmoothingEnabled = !ui.crisp;
        ctx.drawImage(table, TABLE.x * u, TABLE.y * u, table.naturalWidth * u, table.naturalHeight * u);
        if (frame >= 0) {
            ctx.save();
            if (mirror) { const mid = (TABLE.x + TABLE.w / 2) * u; ctx.translate(mid, 0); ctx.scale(-1, 1); ctx.translate(-mid, 0); }
            ctx.drawImage(tumble, frame * CELL, 0, CELL, CELL, (TABLE.x + CELL_DX) * u, (TABLE.y + CELL_DY) * u, CELL * u, CELL * u);
            ctx.restore();
            return;
        }
        faces.slice(0, SPOTS.length).forEach((v, i) => {
            ctx.drawImage(strip, (v - 1) * DIE, 0, DIE, DIE, (TABLE.x + SPOTS[i][0]) * u, (TABLE.y + SPOTS[i][1]) * u, DIE * u, DIE * u);
        });
    })));
}

// A background was loaded: show the table when it is a dice house, nothing otherwise.
export function showDiceTable(bg) {
    style = DICE_HOUSES[(bg || "").toLowerCase()] || null;
    faces = [];
    seq++;
    paint();
}

// The window changed size: draw again at the new scale.
export function repaintDiceTable() { paint(); }

// Throw the dice: they tumble onto the table (thrown from the left by the wizard, from the right by the gambler)
// and settle showing `values`, the dice still in play.
export function throwDice(byWizard, values) {
    if (!style) return;
    const mine = ++seq;
    faces = [];
    if (run.simulation || !document.hasFocus()) { faces = values; return paint(); }
    const start = performance.now();
    const step = (now) => {
        if (mine !== seq) return;                       // another scene or another throw took over
        const frame = Math.floor((now - start) / FRAME_MS);
        if (frame >= FRAMES) { faces = values; return paint(); }
        paint(frame, !byWizard);
        requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}
