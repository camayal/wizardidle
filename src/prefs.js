// Wizard Idle v2 - Device preferences (text size, sound). Kept apart from the save: they belong to
// the device, not to the wizard or the world, and they survive killing a wizard.
// Stored as plain JSON under `wizardidle2:prefs`.

import { run } from './runtime.js';

const PREFS_KEY = 'wizardidle2:prefs';

// Text size steps offered in the settings scroll (a multiplier on top of the automatic one).
const TEXT_SIZES = [
    { id: 'small', label: 'Small', short: 'S', scale: 0.85 },
    { id: 'normal', label: 'Normal', short: 'N', scale: 1 },
    { id: 'large', label: 'Large', short: 'L', scale: 1.25 },
    { id: 'huge', label: 'Extra large', short: 'XL', scale: 1.5 },
];

// Volume steps of the slider (a multiplier on every sound's own volume).
const VOLUMES = [0.25, 0.5, 0.75, 1];

// The kinds of line the console prints, each with its own switch in Settings (Text in the console).
const CONSOLE_LINES = [
    { id: 'fight', label: 'Battles and bosses' },
    { id: 'divine', label: 'Divine messages' },
    { id: 'dreams', label: 'Dreams and nightmares' },
    { id: 'achievements', label: 'Achievements and level ups' },
    { id: 'quests', label: 'Quests' },
    { id: 'dice', label: 'Dice games' },
    { id: 'journey', label: 'The journey (travel, finds, inns...)' },
];

const DEFAULTS = { textSize: 'normal', sound: true, volume: 3, wake: false, shake: true, vibrate: true, fightLines: true, tallViewer: false, ...Object.fromEntries(CONSOLE_LINES.map(l => ['line_' + l.id, true])) };
const prefs = { ...DEFAULTS };

try {
    const saved = JSON.parse(localStorage.getItem(PREFS_KEY) || 'null');
    if (saved && TEXT_SIZES.some(t => t.id == saved.textSize)) prefs.textSize = saved.textSize;
    if (saved) {
        for (const key of ['sound', 'wake', 'shake', 'vibrate', 'fightLines', 'tallViewer', ...CONSOLE_LINES.map(l => 'line_' + l.id)]) if (typeof saved[key] == 'boolean') prefs[key] = saved[key];
        if (Number.isInteger(saved.volume) && saved.volume >= 0 && saved.volume < VOLUMES.length) prefs.volume = saved.volume;
    }
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

function setVolume(step) {
    prefs.volume = Math.max(0, Math.min(VOLUMES.length - 1, step));
    savePrefs();
}

// Keep the screen awake (Wake Lock): asked again when the page comes back, the browser drops it when hidden.
let wakeLock = null;
async function applyWake() {
    try {
        if (!prefs.wake) {
            if (wakeLock) { await wakeLock.release(); wakeLock = null; }
            return;
        }
        if (!navigator.wakeLock || wakeLock || document.hidden) return;
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => { wakeLock = null; });
    } catch (e) { wakeLock = null; /* refused: low battery, or not allowed */ }
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) applyWake(); });
function setWake(on) { prefs.wake = !!on; savePrefs(); applyWake(); }
applyWake();

function setFlag(key, on) {
    prefs[key] = !!on;
    savePrefs();
}

// A short buzz on phones that can (the divine touches).
function buzz(ms = 25) {
    if (prefs.vibrate && navigator.vibrate) { try { navigator.vibrate(ms); } catch (e) { /* ignore */ } }
}

// Every setting back to its default.
function resetPrefs() {
    Object.assign(prefs, DEFAULTS);
    run.muted = false;
    savePrefs();
    applyWake();
}

const canVibrate = () => !!navigator.vibrate;
const canWake = () => !!navigator.wakeLock;
const volumeScale = () => VOLUMES[prefs.volume];

export { CONSOLE_LINES, DEFAULTS, VOLUMES, setVolume, setWake, setFlag, buzz, resetPrefs, canVibrate, canWake, volumeScale, prefs, TEXT_SIZES, setTextSize, setSound, chosenTextScale, browserTextScale, heightScale };
