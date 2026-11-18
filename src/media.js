// Wizard Idle v2 - where every image and sound lives.
//
// The author's layout (2026-11-14): instead of one folder with 1,400 files, art and sounds sit
// in folders by kind, and creatures in folders of their own. The game keeps asking by plain name
// (art('el_golem1'), snd('Fire')); only this file knows the folders, from the name:
//
//   img/wizard/<cast|walk|pray|fall|petrify|unpetrify>/   anim_<name><tier>
//   img/wizard/poses/            lvl<tier>, stone<tier>, fallen<tier>, dead<tier>
//   img/enemies/<family>/        el_golem1 ..., run_<sprite>, ram_<sprite>; polymorph/ (sheep, chicken)
//   img/bosses/<boss>/           the boss and anim_<boss>_<attack>; hydras/<hydra>/ the hydras,
//                                hydras/ anim_hydra_<effect>_enter (every hydra)
//   img/effects/<spells|scene|fx>/
//   img/places/<zone>/           stages 1-5, altar, statue, tavern, dice house
//   img/story/  img/objects/  img/ui/  img/ui/achievements/  img/app/ (icons the browser uses)
//   img/ui/cemetery/             tomb_<a-e>, tomb_<a-e>_cracked, tomb_font, tomb_note
//   snd/<schools|wizard|creatures|places|ui>/
//
// Files from outside (downloads, packs) are renamed before they come in: short, lowercase, words
// joined by _, the prefix of their kind, no author, site or ids (those go in SOUNDS.md or the art
// notes). New kinds get a folder when they arrive: add the rule here, then move the files. While
// developing, a name no rule knows is reported in the browser console (and looked for in
// the main folder), so a misplaced file shows at once.

import { DEV } from './config.js';
import { enemySprites } from './data/enemies.js';
import { zones } from './data/zones.js';
import { bossAttacks } from './data/bossAttacks.js';

const BOSSES = new Set([...Object.keys(bossAttacks), ...Object.values(zones).map((z) => z.boss).filter(Boolean)]);
const ZONES = new Set(Object.keys(zones).map((z) => z.toLowerCase()));
const HYDRA = /^(?:anim_)?(mother|icedra|hydskon)(?:\d+|_.+)$/;
const WIZARD_ANIM = { cast: 'cast', walk: 'walk', pray: 'pray', fall_sit: 'fall', fall_dead: 'fall', petrify: 'petrify', unpetrify: 'unpetrify' };
const STORY = /^(god_|anim_god_|anim_shrine_|healer|curandero|mistico|comerciante|jugon)/;
const OBJECTS = /^(chest\d|pot\d|bag$|barrel$|box$|libro\d|runa\d|item_|d[1-6]$|ship$|captain$|crew$|sleepingbag$|stuff$)/;
const APP = /^(favicon|apple-touch-icon|mstile|icon\d*$|safari-pinned-tab)/;
const UI = /^(achivement|attack|bocadillo|boss|CloseBtn|console|continue|crash|emptyLongBtn|frame|gold|heal|heart\d*|helpbtn|initBack|learn|mapa|mapaunderground|mapbtn|matar|muerto|nubes|plegariabtn|scroll\w*|spirit|star|start|statsbtn|archbtn|diebtn|xp)$/;

// The folder of an image (without img/), or '' when no rule knows the name.
export function artFolder(name) {
    let m;
    if (APP.test(name)) return 'app';
    if ((m = /^anim_([a-z_]+?)\d+$/.exec(name)) && WIZARD_ANIM[m[1]]) return `wizard/${WIZARD_ANIM[m[1]]}`;
    if (/^(lvl|stone|fallen|dead)\d+$/.test(name)) return 'wizard/poses';
    if ((m = HYDRA.exec(name))) return `bosses/hydras/${m[1]}`;
    if (/^anim_hydra_/.test(name)) return 'bosses/hydras';     // effects shared by every hydra
    if (BOSSES.has(name)) return `bosses/${name}`;
    if ((m = /^anim_([a-z]+)_/.exec(name)) && BOSSES.has(m[1])) return `bosses/${m[1]}`;
    if (enemySprites[name]) return `enemies/${name.replace(/\d+$/, '')}`;
    if ((m = /^(?:run|ram)_(.+)$/.exec(name)) && enemySprites[m[1]]) return `enemies/${m[1].replace(/\d+$/, '')}`;
    if (name == 'oveja' || name == 'gallina') return 'enemies/polymorph';
    if (/^spell/.test(name)) return 'effects/spells';
    if (/^scene_/.test(name)) return 'effects/scene';
    if (/^fx_/.test(name)) return 'effects/fx';
    if ((m = /^([a-z]+_[a-z]+?)(\d|_altar|_estatua|_taberna|_casadados)$/.exec(name)) && ZONES.has(m[1])) return `places/${m[1]}`;
    if (name == 'casadados') return 'places';        // a plain dice house
    if (STORY.test(name)) return 'story';
    if (OBJECTS.test(name)) return 'objects';
    if (/^(logro_|no_logro$)/.test(name)) return 'ui/achievements';
    if (/^tomb_/.test(name)) return 'ui/cemetery';
    if (UI.test(name)) return 'ui';
    return '';
}

const SOUND_FOLDERS = {
    schools: ['Arcane', 'Divine', 'Fire', 'Frost', 'Nature', 'Physical', 'Shadow', 'Thunder'],
    wizard: ['hurt1', 'hurt2', 'hurt3', 'hurt4', 'hurt5', 'hurt6', 'revive', 'heal', 'pray', 'drink', 'studybook', 'studyrune'],
    creatures: ['boss', 'hidra', 'gallina', 'oveja', 'hydra_mud_enter', 'hydra_ice_enter', 'hydra_bones_enter'],
    places: ['altar', 'dice', 'coins', 'breakPot', 'breakWood'],
    ui: ['achivement', 'lvlup', 'statUp', 'unlock', 'scroll', 'start'],
};
const SOUND_FOLDER = {};
for (const [folder, names] of Object.entries(SOUND_FOLDERS)) for (const n of names) SOUND_FOLDER[n] = folder;

// The folder of a sound (without snd/), or '' when no rule knows the name.
export function sndFolder(name) {
    return SOUND_FOLDER[name] || '';
}

const warned = new Set();
function unknown(kind, name) {
    if (DEV && !warned.has(name)) {
        warned.add(name);
        console.warn(`[media] no folder rule for the ${kind} "${name}" (src/media.js): looked for in the main folder`);
    }
}

// The path of an image by its plain name: art('el_golem1') -> 'img/enemies/el_golem/el_golem1.png'.
export function art(name) {
    const folder = artFolder(name);
    if (!folder) unknown('image', name);
    return `img/${folder ? `${folder}/` : ''}${name}.png`;
}

// The path of a sound by its plain name: snd('Fire') -> 'snd/schools/Fire.ogg'.
export function snd(name) {
    const folder = sndFolder(name);
    if (!folder) unknown('sound', name);
    return `snd/${folder ? `${folder}/` : ''}${name}.ogg`;
}
