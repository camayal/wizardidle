// Wizard Idle v2 - Device preferences (text size, sound). Kept apart from the save: they belong to
// the device, not to the wizard or the world, and they survive killing a wizard.
// Stored as plain JSON under `wizardidle2:prefs`.

import { run } from './runtime.js';

const PREFS_KEY = 'wizardidle2:prefs';

// Text size steps offered in the settings scroll (a multiplier on top of the automatic one).
const TEXT_SIZES = [
    { id: 'small', label: 'Small', scale: 0.85 },
    { id: 'normal', label: 'Normal', scale: 1 },
    { id: 'large', label: 'Large', scale: 1.25 },
    { id: 'huge', label: 'Extra large', scale: 1.5 },
];

const prefs = { textSize: 'normal', sound: true };

try {
    const saved = JSON.parse(localStorage.getItem(PREFS_KEY) || 'null');
    if (saved && TEXT_SIZES.some(t => t.id == saved.textSize)) prefs.textSize = saved.textSize;
    if (saved && typeof saved.sound == 'boolean') prefs.sound = saved.sound;
} catch (e) { /* no storage: defaults */ }
run.muted = !prefs.sound;

function savePrefs() {
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch (e) { /* no storage */ }
}

function setTextSize(id) {
    if (!TEXT_SIZES.some(t => t.id == id)) return;
    prefs.textSize = id;
    savePrefs();
}

function setSound(on) {
    prefs.sound = !!on;
    run.muted = !prefs.sound;
    savePrefs();
}

// The scale the player chose in the settings scroll.
function chosenTextScale() {
    return TEXT_SIZES.find(t => t.id == prefs.textSize).scale;
}

// The browser's own text size (accessibility): the root font size against the default 16 px.
function browserTextScale() {
    try {
        const px = parseFloat(getComputedStyle(document.documentElement).fontSize);
        return px > 0 ? Math.min(2, Math.max(0.8, px / 16)) : 1;
    } catch (e) { return 1; }
}

// Tall screens (20:9 phones) get bigger text and buttons: 1 up to 16:9, then growing with the
// height, capped. Only phones held upright; desktop windows are sized from their height already.
function heightScale(W, H, isPhone) {
    if (!isPhone || H <= W) return 1;
    return Math.min(1.3, Math.max(1, (H / W) / (16 / 9)));
}

export { prefs, TEXT_SIZES, setTextSize, setSound, chosenTextScale, browserTextScale, heightScale };
