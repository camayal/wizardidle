// Wizard Idle v2 - the bestiary: every creature the wizard has defeated, family by family.
//
// Third page of the kill scroll (Kill / Cemetery / Bestiary). A family appears once he has
// met it. A creature shows once he has seen it (stat seen.sprite.<sprite>), with how many he
// has defeated (kill.sprite.<sprite>, 0 if none yet); the ones never seen are a faint ink
// stain with "?" (the author chose "ink dither" from three mockups on 2026-11-12). Bosses and
// hydras have their own sections (seen.boss / kill.boss, seen.hydra / kill.hydra); the hydras
// are secret characters, so they stay "Secret" stains until met. Only enemies are listed (never
// the healer or other people).

import { enemySprites, enemyTypes } from '../data/enemies.js';
import { zones } from '../data/zones.js';
import { roundNumbertoLetter } from '../utils.js';
import { state } from '../state.js';
import { stats } from '../stats.js';
import { ui } from '../runtime.js';

const INK = [70, 50, 30];                        // the scroll's dark brown ink
const SIZE = () => Math.round(ui.em * 2.4);      // sprite size on the page

function cell(sprite, seen, count, scale = 1, unknown = '?') {
    const size = Math.round(SIZE() * scale);
    const rare = enemySprites[sprite] && enemySprites[sprite].rare ? '★' : '';
    const picture = seen || count
        ? `<img src='img/${sprite}.png' width='${size}' height='${size}'>`
        : `<canvas class='inkStain' data-sprite='${sprite}' width='32' height='32' style='width:${size}px;height:${size}px;image-rendering:pixelated'></canvas>`;
    return `<div style='display:inline-block;width:${size + ui.em * 0.6}px;text-align:center;vertical-align:top'>${picture}` +
        `<br><small>${seen || count ? roundNumbertoLetter(count) + rare : unknown}</small></div>`;
}

function familySection(family) {
    const max = enemyTypes[family].max;
    const sprites = Array.from({ length: max }, (_, i) => `${family}${i + 1}`);
    const found = sprites.filter((s) => seenSprite(s)).length;
    return `<br><span class='subtitles'>${capital(enemyTypes[family].name)}s</span> <small>(${found} of ${max})</small><br>` +
        sprites.map((s) => cell(s, seenSprite(s), stats.get(`kill.sprite.${s}`))).join('');
}

function seenSprite(sprite) {
    return stats.get(`seen.sprite.${sprite}`) || stats.get(`kill.sprite.${sprite}`);
}

function capital(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function bestiaryPageHtml() {
    // families that live in some zone (two old sprite families are in none)
    const living = new Set(Object.values(zones).flatMap((z) => z.enemies.toLowerCase().split(',')));
    const families = Object.keys(enemyTypes).filter((f) => enemyTypes[f].max && living.has(f));
    const met = families.filter((f) => stats.get(`combat.enemy.${f}`));
    const total = families.reduce((sum, f) => sum + enemyTypes[f].max, 0);
    const found = families.reduce((sum, f) => sum + Array.from({ length: enemyTypes[f].max }, (_, i) => `${f}${i + 1}`).filter(seenSprite).length, 0);
    const defeated = Object.keys(state.stats).filter((k) => k.startsWith('kill.sprite.')).length;
    const bosses = [...new Set(Object.values(zones).map((z) => z.boss))];
    const hydras = [...new Set(Object.values(zones).map((z) => z.hidrasName).filter(Boolean))];
    return `<div style='text-align:center'>${found} of ${total} creatures seen, ${defeated} defeated</div>` +
        (met.length ? met.map(familySection).join('') : '<br>No creature defeated yet.<br>') +
        "<br><span class='subtitles'>Bosses</span><br>" +
        bosses.map((b) => cell(b, stats.get(`seen.boss.${b}`), stats.get(`kill.boss.${b}`), 1.25)).join('') +
        // the hydras are a secret (they only come after the hydra mystery): stains until met
        "<br><span class='subtitles'>Secrets</span><br>" +
        hydras.map((h) => cell(`${h}1`, stats.get(`seen.hydra.${h}`), stats.get(`kill.hydra.${h}`), 1.25, 'Secret')).join('');
}

// ------------------------------------------------------------------ the ink stains
// Drawn from the sprite itself: its shape, in grainy dotted ink with a ragged rim, so the
// size and posture show but not what the creature is. Made once per sprite and reused.
const stains = new Map();

function seeded(text) {
    let a = [...text].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
    return () => {
        a = (a + 0x6D2B79F5) >>> 0;
        let t = Math.imul(a ^ (a >>> 15), a | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function inkStain(img, sprite) {
    const w = img.naturalWidth, h = img.naturalHeight;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const src = ctx.getImageData(0, 0, w, h).data;
    const out = ctx.createImageData(w, h);
    const solid = (x, y) => x >= 0 && y >= 0 && x < w && y < h && src[(y * w + x) * 4 + 3] >= 128;
    const random = seeded(sprite);
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            if (!solid(x, y)) continue;
            // the core (all neighbours inside) keeps more ink than the rim
            const core = solid(x - 1, y) && solid(x + 1, y) && solid(x, y - 1) && solid(x, y + 1);
            const keep = core ? 0.75 : 0.35;
            let alpha = 0;
            if ((x + y) % 2 == 0 && random() < keep) alpha = 150;
            else if (random() < keep * 0.35) alpha = 90;
            if (!alpha) continue;
            const i = (y * w + x) * 4;
            out.data[i] = INK[0]; out.data[i + 1] = INK[1]; out.data[i + 2] = INK[2]; out.data[i + 3] = alpha;
        }
    }
    return { data: out, w, h };
}

// Paint every ink stain placeholder inside the scroll.
export function paintInkStains(container) {
    for (const canvas of container.querySelectorAll('canvas.inkStain')) {
        const sprite = canvas.dataset.sprite;
        const paint = (stain) => {
            canvas.width = stain.w; canvas.height = stain.h;
            canvas.getContext('2d').putImageData(stain.data, 0, 0);
        };
        if (stains.has(sprite)) { paint(stains.get(sprite)); continue; }
        const img = new Image();
        img.onload = () => { const stain = inkStain(img, sprite); stains.set(sprite, stain); paint(stain); };
        img.src = `img/${sprite}.png`;
    }
}
