// Wizard Idle v2 - one world, one tab. Only the first tab opened is the original and the only one
// that saves; any other tab is "another dimension": a throwaway copy that never writes the save
// (src/state.js makeReadOnly) and falls apart with a paradox: glitches on the console text, the stats, the
// scene and sprites and the buttons (never the page's own colours) that grow for 30 s to 2 min and end in a collapsed, unusable tab.
// The console says the dimension is unstable. The original only gets a line in its console. Nothing here touches the game's state, only the page.
// Slow changes only (no flashing). In DEV it is off unless the address has ?dimension=1.

import { DEV } from './config.js';
import { makeReadOnly } from './state.js';
import { run } from './runtime.js';
import { el } from './ui/dom.js';
import { print } from './ui/render.js';
import * as loop from './loop.js';

const LOCK = 'wizardidle:world', CHANNEL = 'wizardidle:dimension';
const MIN_MS = 30000, MAX_MS = 120000, TICK_MS = 1500;

// Is this the original tab? (the first to ask holds the lock until it closes; resolves at once)
export function claimWorld() {
    const params = new URLSearchParams(location.search);
    if (params.has('sim') || (DEV && !params.has('dimension'))) return Promise.resolve(true);
    if (!navigator.locks) return claimByHeartbeat();
    return new Promise((resolve) => {
        navigator.locks.request(LOCK, { ifAvailable: true }, (lock) => {
            resolve(!!lock);
            return lock ? new Promise(() => {}) : undefined;
        }).catch(() => resolve(true));
    });
}

// Fallback for browsers without Web Locks (or a page opened from a file): the original tab writes its id and the
// time to localStorage every 3 s and clears it on leaving; a tab finding a fresh id of another tab is a dimension.
// A tab that crashed leaves a stale id: after 10 s the next tab takes over. Two tabs opened in the same instant
// both write, wait a moment and read back: the one whose id stayed is the original.
function claimByHeartbeat() {
    const KEY = 'wizardidle:owner', me = Math.random().toString(36).slice(2);
    const read = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } };
    const write = () => { try { localStorage.setItem(KEY, JSON.stringify({ id: me, t: Date.now() })); } catch (e) { /* no storage: nothing to protect */ } };
    const other = read();
    if (other && other.id != me && Date.now() - other.t < 10000) return Promise.resolve(false);
    write();
    return new Promise((resolve) => setTimeout(() => {
        const now = read();
        if (now && now.id != me) return resolve(false);
        setInterval(() => { const o = read(); if (!o || o.id == me) write(); }, 3000);
        window.addEventListener('pagehide', () => { const o = read(); if (o && o.id == me) try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } });
        resolve(true);
    }, 150));
}

// The original tab: a line in its console when another dimension opens or collapses.
export function watchDimensions() {
    if (!window.BroadcastChannel) return;
    let last = 0;
    new BroadcastChannel(CHANNEL).onmessage = (e) => {
        if (Date.now() - last < 20000) return;
        last = Date.now();
        if (e.data == 'opened') print('<i>Something stirs in another dimension...</i>');
        if (e.data == 'collapsed') print('<i>Another dimension collapsed. Nothing changed here.</i>');
    };
}

const rnd = (a, b) => a + Math.random() * (b - a);
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const GLYPHS = '#%&@?!/\\<>~^*0123456789';
const LINES = ['the god sees himself', 'TIME LOOP', 'who is watching whom', 'two wizards, one name', 'the world forgets this place',
    'ERROR: dimension 2', 'you were never here', 'the stars fall upward', 'nothing is saved'];
const COLORS = ['#f0f', '#0ff', '#f80', '#8f0', '#f33', '#aaf'];

// Starts the paradox in this (secondary) tab.
export function startParadox() {
    makeReadOnly();
    run.muted = true;
    const channel = window.BroadcastChannel ? new BroadcastChannel(CHANNEL) : null;
    if (channel) channel.postMessage('opened');
    const born = Date.now(), life = rnd(MIN_MS, MAX_MS);
    const style = document.createElement('style');
    style.textContent = '#main canvas,#main img{transition:transform 1.5s,filter 1.5s,opacity 1.5s}';
    document.head.append(style);
    print('<b>A new dimension has opened. It is unstable and will collapse.</b>');

    const buttons = ['btn1', 'btn2', 'btn3', 'btn4', 'btn5', 'btn6'].sort(() => Math.random() - 0.5);
    const canvases = ['esceneCanvas', 'pjCanvas', 'npcCanvas', 'spellCanvas'].map(el);
    const textNodes = (root) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), found = [];
        while (walker.nextNode()) if (walker.currentNode.nodeValue.trim()) found.push(walker.currentNode);
        return found;
    };
    const garble = (node, amount) => {
        const chars = node.nodeValue.split('');
        for (let i = 0; i < chars.length * amount; i++) {
            const at = Math.floor(Math.random() * chars.length);
            if (chars[at] != ' ') chars[at] = pick(GLYPHS);
        }
        node.nodeValue = chars.join('');
    };
    const wrap = (node) => {       // a text node of the console gets its own look (the console keeps the spans)
        if (node.parentNode.id != 'console' || Math.random() > 0.5) return;
        const span = document.createElement('span');
        span.style.fontSize = rnd(0.6, 1.9).toFixed(2) + 'em';
        if (Math.random() < 0.5) span.style.color = pick(COLORS);
        else { span.style.background = 'linear-gradient(90deg,' + pick(COLORS) + ',' + pick(COLORS) + ')'; span.style.webkitBackgroundClip = 'text'; span.style.backgroundClip = 'text'; span.style.color = 'transparent'; }
        node.replaceWith(span);
        span.append(node);
    };

    const timer = setInterval(() => {
        const p = (Date.now() - born) / life;
        if (p >= 1) { clearInterval(timer); return collapse(channel); }
        if (document.hidden) return;
        const chance = 0.25 + p * 0.6;
        if (p > 0.08 && Math.random() < chance) {                      // the console
            const nodes = textNodes(el('console'));
            if (nodes.length) { const n = pick(nodes); wrap(n); garble(n, p * 0.25); }
            if (Math.random() < 0.15 * p) print('<i>' + pick(LINES) + '</i>');
        }
        if (p > 0.2 && Math.random() < chance) {                       // the numbers and the name
            for (const id of ['hp', 'gold', 'fe', 'lvl', 'pjName']) if (el(id) && Math.random() < 0.4) textNodes(el(id)).forEach((n) => garble(n, p * 0.5));
        }
        if (p > 0.35 && Math.random() < chance) {                      // the sprites and the scene
            const c = pick(canvases);
            if (c) {
                const flip = Math.random() < 0.5 ? -1 : 1;
                c.style.transform = 'scaleX(' + flip + ') rotate(' + (Math.random() < 0.3 ? rnd(-6, 6).toFixed(1) : 0) + 'deg)';
                c.style.filter = 'hue-rotate(' + Math.floor(rnd(0, 360)) + 'deg) saturate(' + rnd(0.3, 2.5).toFixed(1) + ')' + (Math.random() < 0.2 ? ' invert(1)' : '');
            }
        }
        const gone = Math.floor(Math.max(0, p - 0.5) / 0.5 * buttons.length);   // the buttons go one by one
        buttons.slice(0, gone).forEach((id) => { const b = el(id); if (b) { b.style.opacity = 0; b.style.pointerEvents = 'none'; } });
        if (p > 0.75 && Math.random() < chance * 0.5) {                // the scene itself
            const c = pick(canvases);
            if (c) c.style.transform = 'skewX(' + rnd(-8, 8).toFixed(1) + 'deg) scaleY(' + (Math.random() < 0.3 ? -1 : 1) + ')';
        }
    }, TICK_MS);
}

// The end: the game stops, everything fades and nothing can be clicked.
function collapse(channel) {
    try { loop.freezeGame(); loop.stopAll(); } catch (e) { /* the game was already stopped */ }
    if (channel) channel.postMessage('collapsed');
    const veil = document.createElement('div');
    veil.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#000;color:#999;display:flex;align-items:center;justify-content:center;' +
        'font:1.4em monospace;text-align:center;opacity:0;transition:opacity 3s;padding:2em';
    veil.textContent = 'This unstable dimension collapsed. The real world is safe in the other tab. Close this one.';
    document.body.append(veil);
    requestAnimationFrame(() => { veil.style.opacity = 1; });
}
