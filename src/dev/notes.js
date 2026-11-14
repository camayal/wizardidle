// Wizard Idle v2 - dev tools: the author's notes box (always in the dev panel).
//
// The author's idea (2026-11-14): the technical details of what is being tested fill themselves
// in (the scene, the sound and its settings, the art), the author only writes a comment, and
// Copy puts both on the clipboard to paste to whoever needs it. "Save to file" also appends it
// to docs/<mode>-notes.md through tools/serve.py.

let source = () => '', area, details, comment, status, kind = 'dev';

// The open mode says what its details are (a function, read when the box refreshes).
export function setNoteSource(fn, mode = 'dev') {
    source = fn || (() => '');
    kind = mode;
    refreshNote();
    // the details follow the game (not while being selected to copy by hand)
    setInterval(() => { if (document.activeElement != details) refreshNote(); }, 1000);
}

export function refreshNote() {
    if (details) details.value = source() || '(nothing open: pick a mode or a scene)';
}

function stamp() {
    const d = new Date(), z = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}`;
}

function noteText() {
    refreshNote();
    return `${details.value}\nDate: ${stamp()}\nAuthor's note: ${comment.value.trim() || '-'}`;
}

async function copyNote() {
    const text = noteText();
    try {
        await navigator.clipboard.writeText(text);
    } catch (e) {               // older browsers: select it and copy
        const t = document.createElement('textarea');
        t.value = text;
        document.body.appendChild(t);
        t.select();
        document.execCommand('copy');
        t.remove();
    }
    status.textContent = 'Copied: paste it to whoever needs it.';
}

async function saveNote() {
    const text = noteText();
    try {
        const r = await fetch(`notes/${kind}`, { method: 'POST', headers: { 'Content-Type': 'text/plain; charset=utf-8' }, body: text });
        if (!r.ok) throw new Error(r.status);
        status.textContent = `Saved to docs/${kind}-notes.md.`;
    } catch (e) {
        status.textContent = 'Not saved (the game is not served by tools/serve.py): use Copy.';
    }
}

// The box, at the end of a panel body.
export function buildNotesBox(container) {
    area = document.createElement('div');
    area.className = 'devNotes';
    area.innerHTML = `
        <div class="devSub">Author notes</div>
        <textarea data-n="details" readonly title="Filled in by itself"></textarea>
        <textarea data-n="comment" placeholder="Your comment"></textarea>
        <div class="row"><button data-n="copy">Copy</button><button data-n="save">Save to file</button>
            <button data-n="clear">Clear comment</button><span class="muted" data-n="status"></span></div>`;
    container.appendChild(area);
    const n = (name) => area.querySelector(`[data-n=${name}]`);
    details = n('details'); comment = n('comment'); status = n('status');
    details.style.height = '7.5em';
    n('copy').onclick = copyNote;
    n('save').onclick = saveNote;
    n('clear').onclick = () => { comment.value = ''; status.textContent = ''; };
    refreshNote();
}
