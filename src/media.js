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
import { bossesOf, zones } from './data/zones.js';
import { bossAttacks } from './data/bossAttacks.js';

const BOSSES = new Set([...Object.keys(bossAttacks), ...Object.values(zones).flatMap(bossesOf)]);
const ZONES = new Set(Object.keys(zones).map((z) => z.toLowerCase()));
const HYDRA = /^(?:anim_)?(mother|icedra|hydskon)(?:\d+|_.+)$/;
const WIZARD_ANIM = { cast: 'cast', walk: 'walk', pray: 'pray', fall_sit: 'fall', fall_dead: 'fall', petrify: 'petrify', unpetrify: 'unpetrify' };
const STORY = /^(god_|anim_god_|anim_shrine_|healer|curandero|mistico|comerciante|jugon|viejo|stranger_|cazador_|bubble_)/;
const OBJECTS = /^(chest\d|pot\d|bag$|barrel$|box$|libro\d|runa\d|item_|proof_|prop_|d[1-6]$|ship$|captain$|crew$|sleepingbag$|stuff$|staff_\d+$)/;
const APP = /^(favicon|apple-touch-icon|mstile|icon\d*$|safari-pinned-tab)/;
const UI = /^(achivement|attack|bocadillo|boss|CloseBtn|console|continue|crash|emptyLongBtn|frame|frame_tall_\d+|gold|heal|heart\d*|helpbtn|initBack|learn|mapa|mapaunderground|mapaboveground|mapbtn|matar|muerto|nubes|plegariabtn|scroll\w*|spirit|star|start|statsbtn|archbtn|diebtn|settingsbtn|slider_\w+|toggle_\w+|settings_btn_\w+|xp)$/;

// The folder of an image (without img/), or '' when no rule knows the name.
export function artFolder(name) {
    let m;
    if (APP.test(name)) return 'app';
    if ((m = /^anim_([a-z_]+?)\d+$/.exec(name)) && WIZARD_ANIM[m[1]]) return `wizard/${WIZARD_ANIM[m[1]]}`;
    if (/^(lvl|stone|fallen|dead)\d+$/.test(name)) return 'wizard/poses';
    if ((m = HYDRA.exec(name))) return `bosses/hydras/${m[1]}`;
    if (/^anim_hydra_/.test(name)) return 'bosses/hydras';     // effects shared by every hydra
    if (BOSSES.has(name)) return `bosses/${name}`;
    for (const b of BOSSES) if (name.startsWith(`anim_${b}_`)) return `bosses/${b}`;     // b may hold an underscore (greater_naga)
    if (/^spectrum_/.test(name)) return 'enemies/spectrum';       // the seven spectra: img/enemies/spectrum/spectrum_<colour>.png
    if (enemySprites[name]) return `enemies/${name.replace(/\d+$/, '')}`;
    if ((m = /^(?:run|ram)_(.+)$/.exec(name)) && enemySprites[m[1]]) return `enemies/${m[1].replace(/\d+$/, '')}`;
    if (name == 'oveja' || name == 'gallina') return 'enemies/polymorph';
    if (/^spell/.test(name)) return 'effects/spells';
    if (/^scene_/.test(name)) return 'effects/scene';
    if (/^tall_/.test(name)) return 'places/tall';       // the double-height version of a scene (data/tallScenes.js)
    if (/^overlay_/.test(name)) return 'places/overlays';      // front layer of a scene (data/overlays.js)
    if (/^dice_(table|tumble|faces)_/.test(name)) return 'places/dice';     // the dice house's table and its dice (ui/diceTable.js)
    if (/^border_/.test(name)) return 'places/borders';     // border scenes: a static scene joining two regions (data/connectors.js)
    if (/^(bridge|mouth|enter_mine|ladder|pier|stairs)_/.test(name)) return 'places/connectors';     // the connector scenes (bridges, cave and mine mouths, ladders, pier, stairs)
    if (/^fx_/.test(name)) return 'effects/fx';
    if ((m = /^([a-z]+_[a-z]+?)(\d+|_altar|_estatua|_taberna|_casadados|_cazadores|_cazadores_fuera|_cazadores_trofeos)$/.exec(name)) && ZONES.has(m[1])) return `places/${m[1]}`;
    if (name == 'casadados') return 'places';        // a plain dice house
    if (STORY.test(name)) return 'story';
    if (OBJECTS.test(name)) return 'objects';
    if (/^(logro_|no_logro$)/.test(name)) return 'ui/achievements';
    if (/^tomb_/.test(name)) return 'ui/cemetery';
    if (/^(anim_)?faith_|^anim_faith_|^icon_candle_|^icon_order_|^order_plate_|^btn_(up|down|x)_/.test(name)) return 'ui/faith';   // the faith scroll's meter, candle, border
    if (/^quest_scroll_/.test(name)) return 'ui/quests';     // the little info scroll of a quest
    if (/^(ribbon_(rest|selected)|icon_(stats|kill|achievements|map|faith|help)_[a-z]+)$/.test(name)) return 'ui/ribbon';   // the scroll bookmarks
    if (UI.test(name)) return 'ui';
    return '';
}

const SOUND_FOLDERS = {
    schools: ['Arcane', 'Divine', 'Fire', 'Frost', 'Nature', 'Physical', 'Shadow', 'Thunder', 'Water'],
    wizard: ['hurt1', 'hurt2', 'hurt3', 'hurt4', 'hurt5', 'hurt6', 'revive', 'heal', 'pray', 'drink', 'studybook', 'studyrune'],
    creatures: ['boss', 'hidra', 'gallina', 'oveja', 'hydra_mud_enter', 'hydra_ice_enter', 'hydra_bones_enter',
        'thud', 'rumble', 'rock_roll', 'arrow', 'hooves', 'roar', 'rock_smash', 'stone_break', 'stone_grind', 'bounce',
        'bite', 'wind_gust', 'swing_slash', 'swing_thrust', 'curse', 'sonic_boom', 'rune_circle', 'squelch',
        'midas_orbs', 'midas_rays', 'midas_touch', 'rojo_slam', 'rojo_punch', 'rojo_fire_rain', 'cuboq_spit', 'skeleton_slash',
        'skeleton_curse', 'ice_spikes', 'blizzard', 'fire_breath', 'wing_flap', 'flame_pillar', 'earth_spikes', 'goro_flurry',
        'goro_charge', 'arcane_flare', 'phase', 'vines', 'spores', 'lightning', 'colour_burst', 'prism_pulse', 'golem_slam',
        'doria_arcane_rain', 'skeleton_arcane_rain', 'arcangel_golden_storm', 'kkck_poison_cloud', 'lamia_tidal_wave', 'greater_naga_tide_charge',
        'scene_healing_rain', 'scene_divine_light'],
    places: ['altar', 'dice', 'coins', 'breakPot', 'breakWood'],
    ui: ['achivement', 'lvlup', 'statUp', 'unlock', 'scroll', 'start'],
};
const SOUND_FOLDER = {};
for (const [folder, names] of Object.entries(SOUND_FOLDERS)) for (const n of names) SOUND_FOLDER[n] = folder;

// The folder of a sound (without snd/), or '' when no rule knows the name.
export function sndFolder(name) {
    if (/^arrival_[a-z]+_(arrive|leave)$/.test(name)) return 'creatures';     // how a boss comes and goes (entrances.js)
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
