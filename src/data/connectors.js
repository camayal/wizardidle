// Wizard Idle - connector points that are crossed as scenes on a trip (img/places/connectors/).
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
    mouth_130_120: 150, mouth_130_120_under: 169,
    mouth_147_31: 157, mouth_147_31_under: 171,
    mouth_218_182: 138, mouth_218_182_under: 166,
    mouth_229_64: 171, mouth_229_64_under: 166,
    mouth_27_114: 165, mouth_27_114_under: 171,
    mouth_33_165: 152, mouth_33_165_under: 166,
    mouth_87_224: 140, mouth_87_224_under: 171,
    ladder_cueva4_mina2_cave: 150, ladder_cueva4_mina2_mine: 122,      // the ladder and the floor shaft
};
export const DOOR_STOP = 48;     // the wizard's offset is the door minus this to stand in front of it
