// Wizard Idle v2 - dev tools: side panels beside the game (only while developing).
//
// On a computer screen the game is a square in the middle and the sides are empty: the dev tools
// use them. The left panel holds the dev menus (src/dev/tests.js); the right one holds the open
// mode (sounds, art). When a side is too narrow (a phone, a small window) the panel floats over
// the game instead and can be folded to its title.

const MIN_SIDE = 240;           // px of free space a side needs to hold a panel beside the game
const GAP = 8;

let styled = false;
function addStyle() {
    if (styled) return;
    styled = true;
    const style = document.createElement('style');
    style.textContent = `
        .devPanel { position: fixed; z-index: 9998; box-sizing: border-box; overflow: auto; padding: 6px 8px;
            background: #fbf8f2; color: #222; font: 12px/1.4 sans-serif; border-radius: 4px;
            border: 1px solid #d8cfc0; box-shadow: 0 1px 6px rgba(0, 0, 0, 0.25); }
        .devPanel.folded > :not(.devHead) { display: none; }
        .devPanel .devHead { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
        .devPanel .devHead b { flex: 1; color: #7a3b00; font-size: 13px; cursor: pointer; }
        .devPanel select, .devPanel input, .devPanel button, .devPanel textarea { font: inherit; }
        .devPanel select { max-width: 100%; min-width: 0; }
        .devPanel button { cursor: pointer; }
        .devPanel details { border-top: 1px solid #e2d9ca; padding: 3px 0; }
        .devPanel summary { cursor: pointer; color: #7a3b00; font-weight: bold; padding: 2px 0; }
        .devPanel .devList { display: flex; flex-wrap: wrap; gap: 3px; padding: 3px 0 4px; }
        .devPanel .devList button { text-align: left; }
        .devPanel .devSub { width: 100%; color: #666; font-weight: bold; margin-top: 3px; }
        .devPanel .row { display: flex; flex-wrap: wrap; gap: 4px 10px; align-items: center; margin: 4px 0; }
        .devPanel .row > select { flex: 1 1 180px; }
        .devPanel label { white-space: nowrap; }
        .devPanel input[type=number] { width: 5.5em; }
        .devPanel input[type=text] { flex: 1 1 140px; min-width: 0; }
        .devPanel textarea { width: 100%; box-sizing: border-box; height: 3.4em; }
        .devPanel .muted { color: #666; }
        .devPanel .slide { flex-wrap: nowrap; margin: 2px 0; }
        .devPanel .slide label { width: 5.5em; flex: none; }
        .devPanel .slide input[type=range] { flex: 1 1 100px; min-width: 60px; }
        .devPanel .note { color: #8a4b00; }
        .devPanel .log { max-height: 9em; overflow: auto; white-space: pre-wrap; color: #333; font-family: monospace; }
        .devPanel .devNotes { border-top: 2px solid #d8cfc0; margin-top: 6px; padding-top: 4px; position: sticky; bottom: -6px;
            background: #fbf8f2; padding-bottom: 6px; }
        .devPanel textarea[readonly] { background: #f0ebe2; color: #333; }
        .devPanel .blow { color: #bbb; font-weight: bold; }
        .devPanel .blow.on { color: #d00; }
        .devPanel table.files { width: 100%; border-collapse: collapse; margin: 2px 0 4px; }
        .devPanel table.files th { text-align: left; color: #666; font-weight: bold; border-bottom: 1px solid #d8cfc0; padding: 2px 4px; }
        .devPanel table.files td { border-bottom: 1px solid #ece4d6; padding: 3px 4px; vertical-align: top; }
        .devPanel table.files td.name { word-break: break-all; }
        .devPanel table.files td.acts { white-space: nowrap; text-align: right; }
        .devPanel table.files td.acts button { padding: 1px 6px; }
        .devPanel table.files .small { font-size: 11px; color: #777; word-break: normal; }
        .devPanel table.files tr.isMain td:first-child { box-shadow: inset 3px 0 #3a8a2a; }
        .devPanel table.files tr.isAlt td:first-child { box-shadow: inset 3px 0 #2a5fa8; }
        .devPanel table.files tr.isMain.isAlt td:first-child { box-shadow: inset 3px 0 #3a8a2a, inset 6px 0 #2a5fa8; }
        .devPanel .tagMain { color: #3a8a2a; font-weight: bold; } .devPanel .tagAlt { color: #2a5fa8; font-weight: bold; }
    `;
    document.head.appendChild(style);
}

// The game's box on the screen: the scene, its frame and the console under it.
function gameBox() {
    let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
    for (const id of ['marco', 'esceneCanvas', 'backConsole', 'heading', 'launcher']) {
        const node = document.getElementById(id);
        if (!node || !node.offsetWidth) continue;
        const r = node.getBoundingClientRect();
        left = Math.min(left, r.left); right = Math.max(right, r.right);
        top = Math.min(top, r.top); bottom = Math.max(bottom, r.bottom);
    }
    if (left == Infinity) return { left: innerWidth / 2, right: innerWidth / 2, top: 0, bottom: innerHeight };
    return { left, right, top, bottom };
}

const panels = new Set();

function place(panel) {
    const box = gameBox(), side = panel.side;
    const free = side == 'left' ? box.left : innerWidth - box.right;
    const s = panel.root.style;
    if (free >= MIN_SIDE) {
        const width = Math.min(free - 2 * GAP, 520);
        Object.assign(s, { top: `${GAP}px`, bottom: `${GAP}px`, maxHeight: '', width: `${width}px`,
            left: side == 'left' ? `${box.left - GAP - width}px` : `${box.right + GAP}px`, right: '' });
    } else {            // no room beside the game: float over it, at its side
        const width = Math.min(innerWidth - 2 * GAP, 420);
        Object.assign(s, { top: `${GAP}px`, bottom: '', maxHeight: `${innerHeight - 2 * GAP}px`, width: `${width}px`,
            left: side == 'left' ? `${GAP}px` : '', right: side == 'right' ? `${GAP}px` : '' });
    }
}

function placeAll() {
    for (const panel of panels) place(panel);
}
addEventListener('resize', () => setTimeout(placeAll, 50));     // after the game's own layout
setInterval(placeAll, 1000);        // the game's box also changes without a resize (the name screen, a scroll)

// A panel on one side: { root, body, close() }. The head has its title (click: fold) and,
// when onClose is given, a Close button.
export function sidePanel(side, title, onClose) {
    addStyle();
    const root = document.createElement('div');
    root.className = 'devPanel';
    root.innerHTML = `<div class="devHead"><b title="Fold or unfold">${title}</b>${onClose ? '<button>Close</button>' : ''}</div><div></div>`;
    document.body.appendChild(root);
    const panel = { side, root, body: root.lastElementChild };
    root.querySelector('.devHead b').onclick = () => root.classList.toggle('folded');
    if (onClose) root.querySelector('.devHead button').onclick = onClose;
    // keys typed in a panel are not the game's
    root.addEventListener('keydown', (e) => e.stopPropagation());
    panel.close = () => { panels.delete(panel); root.remove(); };
    panels.add(panel);
    place(panel);
    setTimeout(() => place(panel), 300);        // the game may still be laying itself out
    return panel;
}

export { placeAll, gameBox };
