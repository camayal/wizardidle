// Wizard Idle v2 - the game's texts written as HTML (the author, 2026-11-17).
//
// Story scrolls, dreams and console lines are plain HTML, so bold (<b>), italics (<i>), size
// and colour (<span style="color:#7F0000; font-size:1.2em">) are edited in the text itself.
// Two short forms on top of HTML:
//   [gold]    an inline icon: any image name the game knows (src/media.js), one line high
//   {name}    the wizard's name (other {slots} are filled by whoever shows the text)
// The Texts mode of the dev tools (src/dev/texts.js) uses the same function, so what the
// author edits there is drawn exactly as the game draws it.

import { art } from '../media.js';
import { ui } from '../runtime.js';

// An icon one line high (ui.em: the console's line height), as the gold and heal icons.
export function icon(name) {
    return `<img class='imgInConsole' height='${ui.em || 16}' src='${art(name)}'/>`;
}

// HTML with [sprite] icons and {name} (and any other given slots) filled in.
export function markup(html, slots = {}) {
    return String(html)
        .replace(/\[([A-Za-z0-9_]+)\]/g, (whole, name) => icon(name))
        .replace(/\{(\w+)\}/g, (whole, key) => (key in slots ? slots[key] : whole));
}
