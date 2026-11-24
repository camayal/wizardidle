// Wizard Idle v2 - the seven secret spectra of the Tundra (the author's note, 2026-11-21). One for each colour
// of the Rainbow boss: each is a rare that appears only once and then leaves the pool for good. They come
// where an enemy or boss event would (la_Tundra only), a little more often with the prism in his pack. The
// prism is found only after the quest is given (the second spectrum he meets gives it, in a whisper). When all seven are
// dead the Rainbow's next arrival is the fusion of the spectra into it (the artist's strip, entrances.js),
// and from then on it steps out of its portal as before.

import { config } from './config.js';
import { state } from './state.js';
import { stats } from './stats.js';
import { YesOrNot } from './utils.js';
import { run } from './runtime.js';

export const SPECTRA = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
export const SPECTRA_ZONE = "la_Tundra";

const sp = () => (state.spectra = state.spectra || { killed: [], quest: false, prism: false, fused: false });
export const isSpectrum = (sprite) => /^spectrum_/.test(sprite || "");

// The spectrum for this fight, or "" (a normal fight): one still alive, in the Tundra, by chance.
export function pickSpectrum() {
    if (state.zone.current != SPECTRA_ZONE) return "";
    const left = SPECTRA.filter((c) => !sp().killed.includes(c));
    if (!left.length) return "";
    const boost = sp().prism ? config.balance.prismSpectrumBoost : 1;
    if (!YesOrNot(config.balance.pSpectrum * boost, 0)) return "";
    return `spectrum_${left[Math.floor(Math.random() * left.length)]}`;
}

// He meets one: the second time (so it is a pattern, not chance) a whisper gives the quest for the prism.
export function spectrumSeen() {
    sp().met = (sp().met || 0) + 1;
    if (sp().quest || sp().met < 2) return false;
    sp().quest = true;
    stats.first("spectra.quest");
    return true;
}

// One has fallen: it never comes back. True when it was the seventh.
export function spectrumKilled(sprite) {
    const color = sprite.replace("spectrum_", "");
    if (!sp().killed.includes(color)) sp().killed.push(color);
    stats.count("spectra.killed");
    return SPECTRA.every((c) => sp().killed.includes(c));
}

// A find may be the prism, once the quest is given and he does not have it yet.
export function prismFound() {
    if (!sp().quest || sp().prism || !YesOrNot(config.balance.prismChance, 0)) return false;
    sp().prism = true;
    stats.first("spectra.prism");
    return true;
}

// The Rainbow's next arrival is the fusion: all seven dead and it has not played yet.
export const fusionPending = () => SPECTRA.every((c) => sp().killed.includes(c)) && !sp().fused;
export function fusionDone() { sp().fused = true; }
