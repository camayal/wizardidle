// Wizard Idle - connector points that are crossed as scenes on a trip (img/places/connectors/).
import { zones } from './zones.js';
// Bridge scenes are listed in the order they were drawn, west to east: going east to west the wizard sees
// them the other way round, walking right to left. Stairs rise to the right as drawn, so going up he walks
// right (base, mid, top) and going down he walks left (top, mid, base). A cave or mine mouth keeps the
// left to right walk: he stops at its opening, the scene fades into its twin, and he walks on from the
// opening there (docs/dev-notes.md, connectors as scenes).
export const connectorScenes = {
    bridge_south: ["bridge_south_west", "bridge_south_east"],
    bridge_spring: ["bridge_spring_west", "bridge_spring_east"],
    bridge_swamp: ["bridge_swamp_west", "bridge_swamp_east"],
};

// Bridges whose art has a known zone on its left (the swamp bridge: Prairie on the left, Swamp on the right, as on the map): going
// from that zone he walks left to right, from the other one right to left. The swamp stages sit west of the bridge point on the map,
// so the position test would send both ways east; this line fixes it. Other bridges follow the side he stands on.
export const bridgeLeftZone = { bridge_swamp: "la_Pradera" };

// Border scenes: a static scene joining two regions, no special rules but he can walk it either way. Drawn with the
// zone on its left and the zone on its right; going the other way he walks right to left over the same art.
// point -> { left: zone on the left, scene }.
export const borderScenes = {
    border_gruta_duenon: { left: "la_Gruta", scene: "border_gruta_duenon" },
};

// The ground end of each stairs (the point on the Heidan cloud, the other end, only passes the trip on):
// its three scenes bottom to top, and the point at the top.
export const stairScenes = {
    stairs: { top: "stairs_above", scenes: ["stairs_s_base", "stairs_s_mid", "stairs_s_top"] },
    stairs_n_ground: { top: "stairs_N", scenes: ["stairs_n_base", "stairs_n_mid", "stairs_n_top"] },
};

// The pier is a dead end (the future fishing place): he walks out to its end, stops there, and walks back
// the way he came, right to left. One trip of steps for render.walkAcross; the stop is in ms.
export const PIER_STAY_MS = 3000, PIER_STOP = 100;
export const pierSteps = [
    { scene: "pier_land", dir: 1 },
    { scene: "pier_end", dir: 1, end: PIER_STOP, pause: PIER_STAY_MS },
    { scene: "pier_end", dir: -1, start: PIER_STOP },
    { scene: "pier_land", dir: -1 },
];

// Centre of each mouth's opening in its scene, in scene pixels (read off the art, a 256 x 64 scene).
export const mouthDoors = {
    mouth_tundra_volcan: 150, mouth_tundra_volcan_under: 169,
    mouth_pantano_cueva: 157, mouth_pantano_cueva_under: 171,
    mouth_desierto_mina: 138, mouth_desierto_mina_under: 166,
    "mouth_playa-pradera_mina": 171, "mouth_playa-pradera_mina_under": 166,
    mouth_pradera_cueva: 165, mouth_pradera_cueva_under: 171,
    mouth_dunas_mina: 152, mouth_dunas_mina_under: 166,
    "mouth_dunas-pradera_gruta": 170, "mouth_dunas-pradera_gruta_under": 170,      // the big canyon entrance into the Grotto (a front overlay each: he steps in behind the boulders)
    mouth_duenon_cueva: 140, mouth_duenon_cueva_under: 171,
    mouth_gruta_cueva: 160, mouth_gruta_cueva_under: 160,      // Grotto side (ground map, la_Gruta3) and Cave side (underground map, la_Cueva2): the crack
    ladder_cueva4_mina2_cave: 150, ladder_cueva4_mina2_mine: 122,      // the ladder and the floor shaft
};
export const DOOR_STOP = 48;     // the wizard's offset is the door minus this to stand in front of it

// Every connector scene as a scene of its own (the registry the map, the console and the tools read):
// scene (lower case) -> { point: the connector's name in the travel graph, label, n: place in its trip, of: scenes in the trip }.
// A connector joins two zones and is usually several scenes; "point" says where it sits on the map.
const SCENE_INFO = {};
const addScenes = (point, label, scenes) => scenes.forEach((s, i) =>
    { SCENE_INFO[s.toLowerCase()] = { point, label, n: i + 1, of: scenes.length }; });
for (const [c, scenes] of Object.entries(connectorScenes)) addScenes(c, `the ${c.replace("bridge_", "")} bridge`, scenes);
for (const [c, s] of Object.entries(stairScenes)) addScenes(c, "the Heidan stairs", s.scenes);
for (const [b, d] of Object.entries(borderScenes)) addScenes(b, "the border between the Grotto and Dueñon", [d.scene]);
addScenes("pier", "the pier", ["pier_land", "pier_end"]);
addScenes("enter_mine_S", "the south mine tunnel", ["enter_mine_S"]);
addScenes("ladder_cueva4_mina2", "the ladder between the cave and the mine", ["ladder_cueva4_mina2_cave", "ladder_cueva4_mina2_mine"]);
// A mouth's name is mouth_<outside zone(s)>_<inside zone> in the Spanish short names (pantano, cueva...): the label says them in English.
const zoneEnglish = (short) => { const k = Object.keys(zones).find((z) => z.toLowerCase().replace(/^(el|la|las)_/, "") === short); return k ? zones[k].name : short; };
const mouthLabel = (m) => { const [out, inside] = m.replace("mouth_", "").split("_"); return `the mouth from ${out.split("-").map(zoneEnglish).join(" / ")} to ${zoneEnglish(inside)}`; };
for (const m of Object.keys(mouthDoors).filter((k) => k.startsWith("mouth_") && !k.endsWith("_under"))) {
    addScenes(m, mouthLabel(m), [m]);
    addScenes(`${m}_under`, `${mouthLabel(m)}, inside`, [`${m}_under`]);
}
// The scenes of a connector point, in trip order (a mouth point has its twin inside as the second one).
export const connectorScenesOf = (point) => {
    const own = Object.entries(SCENE_INFO).filter(([, v]) => v.point === point).sort((a, b) => a[1].n - b[1].n).map(([k]) => k);
    return own.length && !own[0].endsWith("_under") && SCENE_INFO[`${own[0]}_under`] ? [...own, `${own[0]}_under`] : own;
};
export const connectorSceneInfo = (scene) => SCENE_INFO[String(scene).toLowerCase()];

// Where the wizard's head sits, as a share of the scene (row 28 of 256 everywhere; row 24 in the connector scenes, whose overlays were drawn for the raised walk line).
export const headLevelShare = (scene) => connectorSceneInfo(scene) ? 0.09375 : 0.109375;
