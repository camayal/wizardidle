// Wizard Idle v2 - dev tools: the console text effects, to look at them (Dev panel > Console).
// Each effect is a css class in index.html (.fx*); the sample line is printed into the real console so it shows in
// the real font and size. "Play all" prints one every 2.8 s; the other buttons replay one.

import { print } from '../ui/render.js';

export const EFFECTS = [
    { id: 'fxDivA', name: 'Whisper (fades in, soft glow; for some events)', text: 'A warmth settles over you. Someone is listening.' },
    { id: 'fxLevel', name: 'Level up (pop and sweep, green triangle)', text: 'Level 12! He feels stronger.' },
    { id: 'fxAch', name: 'Achievement (gold glint)', text: 'Achievement: first blood.' },
    { id: 'fxBad', name: 'Bad thing (red shake)', text: 'The goblin bites deep. He is badly hurt.' },
    { id: 'fxDream', name: 'Dream (blurred, italic)', text: 'He dreams of a door that was never there.' },
    { id: 'fxLoot', name: 'Loot (glint)', text: 'He finds 12 gold in the grass.' },
    { id: 'fxBless', name: 'Divine / blessing (gold light)', text: 'A passing healer mends his wounds.' },
];

export function playEffect(e) {
    print(`<span class="fx ${e.id}">${e.text}</span>`, false, true, 'journey');
}

export function playAll() { EFFECTS.forEach((e, i) => setTimeout(() => playEffect(e), i * 2800)); }
