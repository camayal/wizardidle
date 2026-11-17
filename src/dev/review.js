// Wizard Idle v2 - dev tools: the review drop (what the sessions made last, ready to look at).
//
// The author's idea (2026-11-14): finding a session's new files was hard, so every session
// copies its latest outputs into review/ at the root of the main checkout (git-ignored, served by
// tools/serve.py) and adds one line per file to review/index.txt:
//
//     date | who | file | game file it would replace, or - | short note
//     2026-11-14 12:30 | artist | goro_charge_b.png | img/anim_goro_charge.png | option B, longer dust
//
// The art and sounds modes list them in a table, newest first, with buttons to look at or try each one.
// Handled lines are deleted (and their files), so the list stays short.

const INDEX = 'review/index.txt';

// The entries, newest first: { date, who, file, url, replaces, note }.
export async function reviewEntries() {
    try {
        const r = await fetch(INDEX, { cache: 'no-store' });
        if (!r.ok) return [];
        return (await r.text()).split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith('#'))
            .map((line) => {
                const [date = '', who = '', file = '', replaces = '-', ...note] = line.split('|').map((x) => x.trim());
                return { date, who, file, url: `review/${file}`, replaces: replaces == '-' ? '' : replaces, note: note.join(' | ') };
            })
            .filter((e) => e.file)
            .reverse();
    } catch (e) {
        return [];
    }
}

// A table in a container: entries passing `only` (e.g. images), one row each (the file, what it
// would replace, the buttons), the buttons given as [label, (entry) => ..., when(entry)?].
// Refresh reads the index again.
export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function reviewList(container, only, buttons) {
    let shown = [];
    const draw = async () => {
        shown = (await reviewEntries()).filter(only).slice(0, 30);
        container.innerHTML = `<div class="row"><button data-r="refresh">Refresh</button>
            <span class="muted">${shown.length ? `${shown.length} newest` : 'nothing yet (review/index.txt)'}</span></div>` +
            (shown.length ? `<table class="files"><tr><th>File</th><th>Replaces</th><th></th></tr>` +
            shown.map((e, i) => `<tr><td class="name"><b>${esc(e.file)}</b>
                <div class="small">${esc(e.who)}, ${esc(e.date)}${e.note ? `: ${esc(e.note)}` : ''}</div></td>
                <td class="small">${esc(e.replaces || '-')}</td>
                <td class="acts">${buttons.map(([label, , when], b) => !when || when(e) ? `<button data-r="${i}:${b}">${label}</button>` : '').join('')}</td></tr>`).join('') +
            '</table>' : '');
    };
    container.onclick = (ev) => {
        const r = ev.target.dataset && ev.target.dataset.r;
        if (!r) return;
        if (r == 'refresh') return draw();
        const [i, b] = r.split(':').map(Number);
        buttons[b][1](shown[i]);
    };
    draw();
    return draw;
}

export const isImage = (e) => /\.png$/i.test(e.file);
export const isSound = (e) => /\.(mp3|ogg|wav)$/i.test(e.file);
