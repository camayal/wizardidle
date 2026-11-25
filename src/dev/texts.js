// Wizard Idle v2 - dev tools: the texts mode (only while developing).
//
// The author's request (2026-11-17): one place to read every text of the game and see it where
// the game shows it. Three drops: Chapters (the story scrolls, read from docs/STORY.md), Dreams
// (src/data/dreams.js, by pool) and Console (the phrases the game picks from, read from the game
// code and the zones, and the story's console beats from docs/STORY.md). Picking one shows it in
// place: a chapter in the chapter scroll, a dream over the dark of the night, console lines in the
// console, one after another as the game prints them.
//
// The text goes into the author notes box (src/dev/notes.js), which becomes its editor: every
// edit shows in the game at once. Texts are HTML (bold, italics, sizes, colours); [sprite] is an
// icon and {name} the wizard's name (src/ui/text.js); a new line is a line break. Save to file
// appends the text, with where it comes from, to docs/history-notes.md; the code is changed from
// there. Unsaved edits are kept in this browser (drafts) until "Back to the original".
//
// Opened from the dev panel (Modes > Texts), on the right of the game; the game waits until it is
// closed.

import { state, world } from '../state.js';
import { ui } from '../runtime.js';
import { zones } from '../data/zones.js';
import { dreams } from '../data/dreams.js';
import { poems } from '../data/awayTexts.js';
import { BOSS_STORIES, RARE_STORIES } from '../data/questTexts.js';
import { beliefLevel } from '../belief.js';
import { dreamStill, dreamStillOff, sleepInDark, wizardName } from '../ui/render.js';
import { scrollClose, scrollOpen } from '../ui/scrolls.js';
import { markup } from '../ui/text.js';
import { el } from '../ui/dom.js';
import { sidePanel } from './panel.js';
import { clearNoteEditor, setNoteEditor, setNoteSource } from './notes.js';

const DRAFTS_KEY = 'wizardidle2:textDrafts';        // edited texts not yet back to the original, in this browser
const PICK_KEY = 'wizardidle2:textPick';
// Game files whose console phrases are listed (pickRandomItem("a,b,c") and const textX = "a,b,c").
const CODE_FILES = ['events.js', 'combat.js', 'divine.js', 'travel.js', 'story.js', 'wizard.js', 'bossEffects.js', 'belief.js'];
const POOL_NAMES = {
    light: 'Light dreams (Devout, Believer)', call: 'Callings (Doubter, Atheist)', night: 'Nightmares',
    fallHealer: 'After a fall: the healer', fallRescuer: 'After a fall: a rescuer', fallAlone: 'After a fall: alone',
    chap: 'Chapter dreams', echo: 'Echo dreams (after an erasure)', poem: 'Away poems (death while the god is away)',
};
const FAITH = ['Devout', 'Believer', 'Doubter', 'Atheist'];

let side, p, tools, items = { chapter: [], dream: [], console: [] }, current = null, picks = {}, consoleBefore = '';
let frame = 0;

// ---------------------------------------------------------------- reading the texts

function readJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (e) { return fallback; }
}
function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode */ }
}

const md = (t) => t.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>').replace(/`(.+?)`/g, '$1').trim();
const beats = (t) => md(t).split(/\s+·\s+/).map((s) => s.replace(/\s*<i>\(.*?\)<\/i>\s*$/, '')).filter(Boolean);

// docs/STORY.md: every scroll (### heading with > paragraphs and its slots) and every console beat.
function parseStory(text) {
    const chapters = [], lines = [];
    const body = text.split('\n## The chapters')[1];
    if (!body) return { chapters, lines };
    let h2 = 'The chapters', sec = null, slot = null, para = [];
    const endPara = () => { if (para.length && sec) sec.paras.push(md(para.join(' '))); para = []; };
    const endSec = () => { endPara(); if (sec && sec.paras.length) chapters.push(sec); sec = null; slot = null; };
    for (const ln of body.split(/\r?\n/)) {
        if (ln.startsWith('## ')) { endSec(); h2 = ln.slice(3).trim(); if (h2.startsWith('Notes for the code')) break; continue; }
        if (ln.startsWith('### ')) {
            endSec();
            const heading = ln.slice(4).trim();
            const when = (heading.match(/\(([^)]*)\)\s*$/) || [])[1] || '';
            const name = heading.replace(/\s*\([^)]*\)\s*$/, '');
            const [title, sub] = name.includes(': ') ? [name.slice(0, name.indexOf(': ')), name.slice(name.indexOf(': ') + 2)] : [name, ''];
            sec = { heading, name, when, title, sub, paras: [], slots: {} };
            continue;
        }
        if (ln.startsWith('>')) {
            const t = ln.slice(1).trim();
            if (t) para.push(t); else endPara();
            continue;
        }
        endPara();
        let m;
        if (sec && (m = ln.match(/^- \*\*⟨(\w+)⟩\*\*/))) { slot = m[1]; sec.slots[slot] = []; continue; }
        if (sec && slot && (m = ln.match(/^\s+- \*([^*]+):\*\s*(.*)$/))) {
            const t = m[2].trim();
            sec.slots[slot].push([m[1].trim(), t == '—' ? '' : md(t)]);
            continue;
        }
        if ((m = ln.match(/^\*\*((?:Console|Echo)[^*]*):\*\*\s*(.+)$/))) {
            lines.push({ label: `${sec ? sec.name : h2}, ${m[1]}`, where: `docs/STORY.md (${sec ? sec.heading : h2})`, lines: beats(m[2]) });
            slot = null;
            continue;
        }
        if (h2.startsWith('The final battle') && (m = ln.match(/^- \*\*([^*]+):\*\*\s*(.+)$/))) {
            lines.push({ label: `Final battle: ${m[1].trim()}`, where: 'docs/STORY.md (The final battle)', lines: beats(m[2]) });
            continue;
        }
        if (h2.startsWith('Falls and deaths') && (m = ln.match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|$/)) && !/^-+$|^Moment$/.test(m[1])) {
            lines.push({ label: `Falls: ${md(m[1]).replace(/<[^>]+>/g, '')}`, where: 'docs/STORY.md (Falls and deaths)', lines: beats(m[2]) });
            continue;
        }
        if (ln.trim() && !ln.startsWith(' ')) slot = null;
    }
    endSec();
    return { chapters, lines };
}

// The phrase lists in the game code: one console line is picked from each.
function parseCode(file, text) {
    const found = [], rows = text.split(/\r?\n/);
    rows.forEach((row, i) => {
        const re = /pickRandomItem\(\s*"([^"]*)"\s*\)|const (text\w+)\s*=\s*"([^"]*)"/g;
        let m;
        while ((m = re.exec(row))) {
            const list = (m[1] != null ? m[1] : m[3]).split(',').map((s) => s.trim()).filter(Boolean);
            const near = row + (rows[i + 1] || '');
            if (!list.length || (!row.includes('print(') && !list.some((s) => s.includes(' ')))) continue;
            const before = near.slice(0, near.indexOf('pickRandomItem'));
            found.push({
                label: `${file}:${i + 1} ${list[0].slice(0, 36)}${list[0].length > 36 ? '…' : ''}`,
                where: `src/${file} line ${i + 1} (one phrase per line; the game picks one)`,
                lines: list,
                prefix: /enemyName/.test(before) ? '{enemy} ' : /wizardName\(\)/.test(near) ? '{name} ' : '',
                suffix: /\)\s*\+\s*zones\[/.test(row) ? '{zone}' : '',
            });
        }
    });
    return found;
}

// Zone arrival lines (src/data/zones.js, legend): "... is entering to the Castle, <one of them>".
function zoneLines() {
    return Object.entries(zones).map(([key, z]) => {
        const list = String(z.legend || '').split(',').map((s) => s.trim()).filter(Boolean);
        return list.length && { label: `Entering the ${z.name}`, where: `src/data/zones.js, ${key}.legend (one per line; the game picks one)`,
            lines: list, prefix: `{name} is entering to the ${z.name}, ` };
    }).filter(Boolean);
}

// A file of the project as text ('' when missing or slower than 5 s, so the mode never hangs).
async function fetchText(path) {
    const stop = new AbortController(), timer = setTimeout(() => stop.abort(), 5000);
    try {
        const r = await fetch(path, { cache: 'no-store', signal: stop.signal });
        return r.ok ? await r.text() : '';
    } catch (e) {
        console.warn(`[texts] could not read ${path}`, e);
        return '';
    } finally { clearTimeout(timer); }
}

async function loadItems() {
    const story = parseStory(await fetchText('docs/STORY.md'));
    items.chapter = story.chapters.map((c) => ({
        kind: 'chapter', id: `chapter:${c.heading}`, group: '', label: c.when ? `${c.name} (${c.when})` : c.name, where: `docs/STORY.md (### ${c.heading})`,
        slots: c.slots,
        text: [`<span class="titles" id="historyTitle">${c.title}</span>${c.sub ? `~~${c.sub.toUpperCase()}~~` : ''}`, ...c.paras].join('\n\n'),
    }));
    items.dream = Object.entries(dreams).flatMap(([pool, list]) => list.map((d) => ({
        kind: 'dream', id: `dream:${d.id}`, group: POOL_NAMES[pool] || pool, pool, belief: !!d.belief,
        label: `${d.belief ? '✦ ' : ''}${d.lines[0].slice(0, 44)}${d.lines[0].length > 44 ? '…' : ''}`,
        where: `src/data/dreams.js, ${d.id}${d.belief ? ' (belief dream)' : ''} (one line per line)`,
        text: d.lines.join('\n'),
    })));
    // the poems of an absence permadeath are shown like a dream (first line: the title)
    items.dream.push(...poems.map((x) => ({
        kind: 'dream', id: `dream:poem-${x.id}`, group: POOL_NAMES.poem, pool: 'poem', belief: false,
        label: x.title, where: `src/data/awayTexts.js, poems, ${x.id} (first line is the title, then one line per line; {zone} too)`,
        text: [`<b>${x.title}</b>`, ...x.lines].join('\n'),
    })));
    const code = [];
    for (const file of CODE_FILES) code.push(...parseCode(file, await fetchText(`src/${file}`)).map((x) => ({ ...x, group: `Game phrases: ${file}` })));
    const hunts = (list, what) => Object.entries(list).map(([key, lines]) => ({ label: `${what}: ${key}`, where: `src/data/questTexts.js, ${what === 'Boss' ? 'BOSS_STORIES' : 'RARE_STORIES'}.${key} (one per line; {who} and {where} are filled)`, lines, group: 'Hunt stories (quests)' }));
    const consoleItems = [...code, ...hunts(BOSS_STORIES, 'Boss'), ...hunts(RARE_STORIES, 'Rare school'), ...zoneLines().map((x) => ({ ...x, group: 'Entering a zone' })),
        ...story.lines.map((x) => ({ ...x, group: 'Story beats (docs/STORY.md)' }))];
    items.console = consoleItems.map((x, i) => ({ kind: 'console', id: `console:${x.where}:${x.label}`, prefix: '', suffix: '', ...x, text: x.lines.join('\n'), n: i }));
}

// ---------------------------------------------------------------- showing a text in the game

const drafts = () => readJSON(DRAFTS_KEY, {});
const textOf = (item) => (drafts()[item.id] != null ? drafts()[item.id] : item.text);

function zoneName() {
    const z = zones[state.zone.current];
    return z ? z.name : state.zone.current;
}

// What the {slots} say in the preview: the game's own values, or a sample where none exists yet.
function slotValues() {
    const name = wizardName();
    return { name, zone: zoneName(), shrineZone: zoneName(), staffName: world.staffName || 'Orrovan',
        loop: world.loop || 2, reversedName: name.split('').reverse().join(''), enemy: 'The Slime', who: 'the creature', where: zoneName() };
}

// A chapter's ⟨slots⟩ filled with the variants picked in the panel.
function fillSlots(text, item) {
    return text.replace(/⟨(\w+)⟩/g, (whole, key) => {
        const variants = item.slots && item.slots[key];
        if (!variants || !variants.length) return whole;
        const pick = variants.find(([name]) => name == picks[key]) || variants[0];
        return pick[1];
    });
}

const toHtml = (text) => text.replace(/\r?\n/g, '<br>');
const scrollIsOpen = () => parseInt(el('scrollBackCenter').style.minHeight) > 0;

function showChapter(item, text) {
    el('innerTextScroll').innerHTML = toHtml(markup(fillSlots(text, item), slotValues()));
    el('innerTextScroll').style.display = 'block';
    const title = el('historyTitle');
    if (title) {            // as story.js sizes it
        title.style.fontSize = `${ui.em * 2.5}px`;
        title.style.lineHeight = `${ui.em * 2.5}px`;
    }
    if (!scrollIsOpen()) scrollOpen('texts');
    ui.scrollCurrentContent = 'texts';
}

function dreamOf(item, text) {
    return { lines: text.split(/\r?\n/).filter((l) => l.trim()), nightmare: item.pool == 'night' || item.pool.startsWith('fall') };
}

// The console as the game leaves it after printing the lines one after another (newest on top).
function showConsole(item, text) {
    const slots = slotValues();
    const withName = p.withName.checked;
    const lines = text.split(/\r?\n/).filter((l) => l.trim())
        .map((l) => markup(`${withName ? item.prefix : ''}${l}${item.suffix ? ` ${item.suffix}` : ''}`, slots));
    el('console').style.visibility = '';
    el('backConsole').style.visibility = '';
    el('console').innerHTML = lines.reverse().join('<br>');
}

// Leave only the place this kind of text is shown in.
function clearOthers(kind) {
    if (kind != 'dream') dreamStillOff();
    if (kind != 'chapter' && ui.scrollCurrentContent == 'texts' && scrollIsOpen()) scrollClose();
    if (kind != 'console') el('console').innerHTML = consoleBefore;
}

function show(text) {
    if (!current) return;
    playing = false;                // an edit or another pick ends a night being played
    clearOthers(current.kind);
    if (current.kind == 'chapter') showChapter(current, text);
    else if (current.kind == 'dream') dreamStill(dreamOf(current, text));
    else showConsole(current, text);
}

// The scene moved (a scroll closed, the window turned): the dream is drawn again at its new size.
function relayout() {
    if (current && current.kind == 'dream' && !playing) dreamStill(dreamOf(current, textOf(current)));
}
let playing = false;

// Every edit in the notes box: shown at once (one redraw per frame), kept as a draft.
function edited(text) {
    const all = drafts();
    if (text == current.text) delete all[current.id]; else all[current.id] = text;
    writeJSON(DRAFTS_KEY, all);
    showStatus();
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => show(text));
}

function details() {
    if (!current) return 'Texts: pick a text';
    const out = [`Text: ${current.label}`, `From: ${current.where}`];
    if (current.kind == 'chapter' && Object.keys(current.slots).length)
        out.push(`Shown with: ${Object.keys(current.slots).map((k) => `${k} ${picks[k] || current.slots[k][0][0]}`).join(', ')}`);
    if (current.kind == 'console' && current.prefix && p.withName.checked) out.push(`Each line starts with: ${current.prefix.trim()}`);
    return out.join('\n');
}

function showStatus() {
    if (!current) { p.status.textContent = ''; return; }
    p.status.textContent = drafts()[current.id] != null ? 'Edited (a draft kept in this browser): Save to file sends it to docs/history-notes.md.' : 'The text as it is in the game files.';
}

// ---------------------------------------------------------------- the panel

function fillSelect(select, list) {
    const groups = new Map();
    for (const item of list) {
        if (!groups.has(item.group)) groups.set(item.group, []);
        groups.get(item.group).push(item);
    }
    const option = (item) => `<option value="${list.indexOf(item)}">${item.label.replace(/</g, '&lt;')}</option>`;
    select.innerHTML = '<option value="">—</option>' + [...groups].map(([group, its]) =>
        (group ? `<optgroup label="${group}">${its.map(option).join('')}</optgroup>` : its.map(option).join(''))).join('');
}

function slotPickers(item) {
    p.slots.innerHTML = '';
    p.slots.style.display = item && item.kind == 'chapter' && Object.keys(item.slots).length ? '' : 'none';
    if (!item || item.kind != 'chapter') return;
    const level = beliefLevel();
    for (const [key, variants] of Object.entries(item.slots)) {
        if (!variants.some(([name]) => name == picks[key])) {
            const faith = FAITH.find((f) => f.toLowerCase() == level);
            picks[key] = (key == 'faith' && faith) || variants[0][0];
        }
        const label = document.createElement('label');
        label.textContent = `⟨${key}⟩ `;
        const select = document.createElement('select');
        select.innerHTML = variants.map(([name]) => `<option${name == picks[key] ? ' selected' : ''}>${name}</option>`).join('');
        select.onchange = () => { picks[key] = select.value; show(textOf(current)); };
        label.appendChild(select);
        p.slots.appendChild(label);
    }
}

function choose(kind, index) {
    for (const k of Object.keys(items)) if (k != kind) p[k].value = '';
    current = index === '' ? null : items[kind][Number(index)];
    writeJSON(PICK_KEY, current ? { kind, id: current.id } : null);
    slotPickers(current);
    p.play.style.display = current && current.kind == 'dream' ? '' : 'none';
    p.nameRow.style.display = current && current.kind == 'console' && current.prefix ? '' : 'none';
    p.withName.checked = true;
    p.prefix.textContent = current && current.prefix ? current.prefix.trim() : '';
    if (!current) { clearOthers(''); clearNoteEditor(); showStatus(); return; }
    const text = textOf(current);
    setNoteEditor(text, edited, 'Text');
    show(text);
    showStatus();
}

function buildPanel() {
    side = sidePanel('right', 'Texts', () => close());
    side.body.innerHTML = `
        <div class="row"><label>Chapters</label><select data-k="chapter"></select></div>
        <div class="row"><label>Dreams</label><select data-k="dream"></select></div>
        <div class="row"><label>Console</label><select data-k="console"></select></div>
        <div class="row" data-n="slots"></div>
        <div class="row" data-n="nameRow"><label><input type="checkbox" data-n="withName" checked> Starts as in the game (<span data-n="prefix"></span>)</label></div>
        <div class="row"><button data-n="play">Play as at night</button><button data-n="original">Back to the original</button></div>
        <div class="muted" data-n="status"></div>
        <details><summary>How to write a text</summary><div class="muted">
            The text is edited in the Author notes box; the game shows each change at once.<br>
            HTML works: <code>&lt;b&gt;bold&lt;/b&gt;</code>, <code>&lt;i&gt;italics&lt;/i&gt;</code>,
            <code>&lt;span style="color:#7F0000; font-size:1.3em"&gt;…&lt;/span&gt;</code>, <code>&lt;img&gt;</code>.<br>
            <code>[gold]</code> is an icon (any image name of the game), <code>{name}</code> the wizard's name;
            chapters also use <code>⟨place⟩ ⟨faith⟩ ⟨echo⟩</code> (pick their variant above), <code>{zone}</code>, <code>{staffName}</code>.<br>
            A new line is a line break; a blank line between paragraphs of a chapter.<br>
            Dreams: one line per line. Console: one line per line, printed one after another (the first ends at the bottom);
            for game phrases each line is one choice the game picks from.<br>
            Save to file adds the text and where it comes from to docs/history-notes.md.
        </div></details>`;
    p = {};
    side.body.querySelectorAll('[data-k]').forEach((node) => { p[node.dataset.k] = node; });
    side.body.querySelectorAll('[data-n]').forEach((node) => { p[node.dataset.n] = node; });
    for (const kind of Object.keys(items)) {
        p[kind].innerHTML = '<option value="">loading…</option>';
        p[kind].onchange = () => choose(kind, p[kind].value);
    }
    p.withName.onchange = () => { show(textOf(current)); };
    p.play.onclick = () => {
        if (!current || current.kind != 'dream') return;
        const dream = dreamOf(current, textOf(current));
        dreamStillOff();
        playing = true;
        sleepInDark(dream, () => { playing = false; relayout(); });
    };
    p.original.onclick = () => {
        if (!current) return;
        const all = drafts();
        delete all[current.id];
        writeJSON(DRAFTS_KEY, all);
        setNoteEditor(current.text, edited, 'Text');
        show(current.text);
        showStatus();
    };
    p.slots.style.display = 'none';
    p.nameRow.style.display = 'none';
    p.play.style.display = 'none';
}

export async function open(devTools) {
    tools = devTools;
    tools.resetScene();             // the game waits while the mode is open
    document.addEventListener('wizardidle:layout', relayout);
    consoleBefore = el('console').innerHTML;
    buildPanel();
    setNoteSource(details, 'history');
    await loadItems();
    if (!side) return;              // closed while loading
    for (const kind of Object.keys(items)) fillSelect(p[kind], items[kind]);
    const last = readJSON(PICK_KEY, null);
    const found = last && items[last.kind] ? items[last.kind].findIndex((x) => x.id == last.id) : -1;
    if (found >= 0) { p[last.kind].value = String(found); choose(last.kind, String(found)); }
}

// Close the panel; resume: the game goes on (not when another mode opens instead).
export function close(resume = true) {
    if (!side) return;
    cancelAnimationFrame(frame);
    document.removeEventListener('wizardidle:layout', relayout);
    playing = false;
    dreamStillOff();
    if (ui.scrollCurrentContent == 'texts' && scrollIsOpen()) scrollClose();
    el('console').innerHTML = consoleBefore;
    clearNoteEditor();
    setNoteSource(null);
    side.close();
    side = null;
    p = null;
    current = null;
    if (resume) tools.closed();
}
