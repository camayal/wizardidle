// Wizard Idle v2 - dev tools: the console text effects, to look at them (Dev panel > Console).
// Each effect is a css class in index.html (.fx*); the sample line is printed into the real console so it shows in
// the real font and size. "Play all" prints one every 2.8 s; the other buttons replay one.

import { print } from '../ui/render.js';

export const EFFECTS = [
    { id: 'fxDivA', name: 'Divine A: whisper (fades in, soft glow)', text: 'A warmth settles over you. Someone is listening.' },
    { id: 'fxDivB', name: 'Divine B: carved light (letter by letter)', text: 'You feel a gentle push toward the east.', letters: true },
    { id: 'fxDivC', name: 'Divine C: halo line (thin gold rules)', text: 'Your hand rests on his shoulder, and he stops to listen.' },
    { id: 'fxLevel', name: 'Level up (pop and sweep)', text: 'Level 12! He feels stronger.' },
    { id: 'fxAch', name: 'Achievement (gold glint and frame)', text: 'Achievement: first blood.' },
    { id: 'fxBad', name: 'Bad thing (red shake)', text: 'The goblin bites deep. He is badly hurt.' },
    { id: 'fxDream', name: 'Dream (blurred, italic)', text: 'He dreams of a door that was never there.' },
    { id: 'fxLoot', name: 'Loot (glint)', text: 'He finds 12 gold in the grass.' },
    { id: 'fxBless', name: 'Blessing (warm light)', text: 'A passing healer mends his wounds.' },
];

export function playEffect(e) {
    const body = e.letters ? [...e.text].map((c, i) => `<span class="ch" style="animation-delay:${(i * 0.04).toFixed(2)}s">${c === ' ' ? '&nbsp;' : c}</span>`).join('') : e.text;
    print(`<span class="fx ${e.id}">${body}</span>`, false, true, 'journey');
}

export function playAll() { EFFECTS.forEach((e, i) => setTimeout(() => playEffect(e), i * 2800)); }
