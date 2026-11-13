// Wizard Idle v2 - how normal enemies attack: plain sprites moved by code, an effect on top.
//
// No enemy has its own animation: its sprite is moved frame by frame (lunge, pounce, slam, or
// a cast flick), stretched and squashed from the feet, with a reusable overlay in front of it
// (a school spark, a weapon slash, a bite, dust). When the blow lands, the game's own spell
// effect plays on the wizard. Designed by the artist with the author (2026-11-12); bosses and
// hydras keep their hop until they get their own animations.

import { ui, run, fight } from '../runtime.js';
import { state } from '../state.js';
import * as loop from '../loop.js';
import { enemySprites } from '../data/enemies.js';
import { imageNow, loadNPC, npcCanvas, pixelContext } from './render.js';

// Melee families by the attack their sprites make (approved by the author): swords slash,
// bows shoot, spears thrust, heavy weapons smash, horns charge, beasts pounce, heavy bodies
// slam. Each family takes its most common attack; families that only cast need no entry.
const MELEE = {
    animalejo: "pounce", el_diabillo: "pounce", la_hidra: "pounce",
    el_ent: "slam", el_umigubi: "slam", el_golem: "slam", momia: "slam", el_roco: "slam",
    el_elfo: "shoot",
    el_guerrero: "thrust", el_dare: "thrust",
    el_ogro: "smash", el_enano: "smash", el_herbo: "smash", el_cornovit: "smash",
    el_capricor: "charge", el_tauren: "charge",
};
const DEFAULT_MELEE = "slash";

// The school of an enemy's spell, for its spark.
const SPELL_SCHOOL = { spellPush1: "arcane", spellPush2: "arcane", spellPush3: "nature", spellPush7: "nature",
    spellPush4: "fire", spellPush5: "thunder", spellPush8: "frost", spellChispasMulti_12: "divine" };

// Overlay strips: frame width and height in sprite pixels (school sparks are 16 x 16).
const FX_SIZE = { fx_slash: [24, 32], fx_bite: [14, 14], fx_dust: [24, 8], fx_arrow: [12, 5],
    fx_thrust: [28, 10], fx_smash: [24, 40], fx_impact: [16, 16] };
const WIZARD_DISTANCE = 160;        // sprite px from the enemy's box to the wizard's (5 squares)

// One entry per 100 ms frame: sprite offset dx/dy and squash/stretch sx/sy (anchored at the
// feet), the overlay [strip, frame, x, y] relative to the enemy's 32 x 32 box, and a shake.
// The blow lands on the frame marked hit (by default the one before last). The frame lists of
// shoot, thrust, smash and charge are the artist's.
function frames(kind, school) {
    const f = (dx = 0, dy = 0, sx = 1, sy = 1, fx = null, shake = 0) => ({ dx, dy, sx, sy, fx, shake });
    if (kind == "shoot") {          // draw, release, recoil; the arrow flies 16 px a frame to the wizard
        const seq = [f(), f(2, 0, 1, 1), f(3, 0, 1.02, 0.98)];
        for (let x = -12; x > 12 - WIZARD_DISTANCE; x -= 16) seq.push(f(seq.length == 3 ? -1 : seq.length == 4 ? 1 : 0, 0, 1, 1, ["fx_arrow", 0, x, 13]));
        seq[seq.length - 1].hit = true;
        seq.push(f());
        return seq;
    }
    if (kind == "thrust") return [f(), f(2, 0), f(-6, 0, 1.04, 0.97, ["fx_thrust", 0, -26, 11]), f(-7, 0, 1, 1, ["fx_thrust", 1, -26, 11]),
        f(-6, 0, 1, 1, ["fx_thrust", 2, -26, 11]), f(-3, 0, 1, 1, ["fx_thrust", 3, -26, 11]), f()];
    if (kind == "smash") return [f(), f(1, -1, 0.97, 1.08), f(2, -2, 0.95, 1.12, ["fx_smash", 0, -14, -8]), f(0, -1, 1, 1.05, ["fx_smash", 1, -14, -8]),
        f(-3, 0, 1.08, 0.9, ["fx_smash", 2, -14, -8]), f(-3, 0, 1.1, 0.86, ["fx_smash", 3, -14, -8], 1),
        f(-2, 0, 1.04, 0.95, ["fx_smash", 4, -14, -8], -1), f(-1, 0, 1, 1, ["fx_dust", 0, -14, 25]), f(0, 0, 1, 1, ["fx_dust", 1, -14, 25]),
        f(0, 0, 1, 1, ["fx_dust", 2, -14, 25]), f()];
    if (kind == "charge") return [f(), f(2, 0, 1.04, 0.94), f(-5, 0), f(-10, 0, 1.06, 0.96, ["fx_impact", 0, -10, 8]),
        f(-11, 0, 1.04, 0.97, ["fx_impact", 1, -10, 8], 1), f(-9, 0, 1, 1, ["fx_impact", 2, -10, 8]), f(-5, 0, 1, 1, ["fx_impact", 3, -10, 8]), f(-2, 0), f()];
    if (kind == "slash") return [f(), f(1, 0, 1, 1), f(2, 0, 1.02, 0.97), f(-3, 0, 1, 1, ["fx_slash", 0, -14, 0]),
        f(-3, 0, 1, 1, ["fx_slash", 1, -14, 0]), f(-3, 0, 1, 1, ["fx_slash", 2, -14, 0]), f(-2, 0, 1, 1, ["fx_slash", 3, -14, 0]),
        f(-1, 0, 1, 1, ["fx_slash", 4, -14, 0]), f()];
    if (kind == "pounce") return [f(), f(1, 0, 1.06, 0.88), f(1, 0, 1.08, 0.84), f(-5, -5, 0.96, 1.06), f(-9, -7, 1, 1),
        f(-11, 0, 1.08, 0.9, ["fx_bite", 0, -10, 9]), f(-11, 0, 1.04, 0.95, ["fx_bite", 2, -10, 9]), f(-11, 0, 1, 1, ["fx_bite", 3, -10, 9]),
        f(-6, 0), f(-2, 0), f()];
    if (kind == "slam") return [f(), f(0, 0, 0.97, 1.06), f(1, -2, 0.95, 1.1), f(-2, 0, 1.12, 0.84, ["fx_dust", 0, 4, 25], 1),
        f(-2, 0, 1.08, 0.9, ["fx_dust", 1, 4, 25], -1), f(-1, 0, 1.03, 0.96, ["fx_dust", 2, 4, 25], 1), f()];
    const spark = `fx_spark_${school}`;      // cast: gather, then flick the magic forward
    return [f(), f(1, 0, 1, 1, [spark, 0, -9, 2]), f(1, -1, 1, 1.02, [spark, 1, -9, 2]), f(1, -1, 1, 1.03, [spark, 2, -9, 1]),
        f(-1, 0, 1, 1, [spark, 3, -11, 2]), f(-2, 0, 1, 1, [spark, 4, -13, 3]), f(-1, 0, 1, 1, [spark, 5, -16, 4]), f()];
}

// Which move the current enemy makes: casters cast (with their spell's spark), the rest by family.
export function enemyMove() {
    if (fight.polymorphed) return { kind: "pounce" };          // a sheep or a chicken just charges
    const sprite = enemySprites[fight.enemyAndNumber];
    if (sprite && sprite.type != "melee" && SPELL_SCHOOL[fight.spellEnemy]) return { kind: "cast", school: SPELL_SCHOOL[fight.spellEnemy] };
    return { kind: MELEE[fight.enemy] || DEFAULT_MELEE };
}

function drawFrame(npc, frame) {
    const sprite = imageNow(`img/${npc}.png`);
    if (!sprite) return;
    const unit = ui.charWidth / 32;                             // one sprite pixel on screen
    const ex = ui.squareSide * 6 + frame.shake * unit, ey = ui.headLevel;
    const ctx = pixelContext(npcCanvas);
    ctx.clearRect(0, 0, npcCanvas.width, npcCanvas.height);
    const w = ui.charWidth * frame.sx, h = ui.charWidth * frame.sy;
    ctx.drawImage(sprite, ex + frame.dx * unit + (ui.charWidth - w) / 2, ey + frame.dy * unit + ui.charWidth - h, w, h);
    if (!frame.fx) return;
    const [strip, index, ox, oy] = frame.fx;
    const fx = imageNow(`img/${strip}.png`);
    if (!fx) return;
    const [fw, fh] = FX_SIZE[strip] || [16, 16];
    ctx.drawImage(fx, index * fw, 0, fw, fh, ex + (frame.dx + ox) * unit, ey + (frame.dy + oy) * unit, fw * unit, fh * unit);
}

// Play the enemy's attack; onHit runs once, when the blow lands (at once if nothing is drawn).
export function playEnemyMove(move, onHit) {
    let hit = false;
    const land = () => { if (!hit) { hit = true; onHit(); } };
    if (run.simulation || !document.hasFocus() || !state.npc) return land();
    const npc = state.npc, seq = frames(move.kind, move.school);
    const marked = seq.findIndex((frame) => frame.hit), hitAt = marked >= 0 ? marked : seq.length - 2;
    imageNow(`img/${npc}.png`);
    for (const frame of seq) if (frame.fx) imageNow(`img/${frame.fx[0]}.png`);   // start loading
    npcCanvas.width = npcCanvas.offsetWidth;
    npcCanvas.height = npcCanvas.offsetHeight;
    let k = 0;
    const next = () => {
        if (k >= seq.length || state.npc != npc) {             // done, or the enemy is gone
            loop.stop("animNPC");
            land();
            if (state.npc == npc) loadNPC(npc);
            return;
        }
        drawFrame(npc, seq[k]);
        if (k == hitAt) land();
        k++;
    };
    next();
    loop.every("animNPC", next, 100);
}
