// Wizard Idle - manual corrections of the travel graph, made in the dev tools (Modes > Travel) and saved
// by tools/serve.py: do not edit by hand. "stageA|stageB" (names sorted, the link works both ways) is
// "move" (Accessible, green), "dest" (Difficult, yellow) or "far" (Impossible, red). travelPositions: waypoints moved
// by hand ({name: [x, y]} in map pixels); travelPoints: points added by hand ({name: {kind: future|connector, layer, x, y}}),
// both read by tools/travel_graph.py. See docs/TRAVEL.md.
export const travelOverrides = {};
export const travelPositions = {};
export const travelPoints = {
    "future_cave_NW": {
        "kind": "future",
        "layer": "under",
        "x": 60,
        "y": 44
    },
    "future_chamber": {
        "kind": "future",
        "layer": "under",
        "x": 80,
        "y": 132
    },
    "ladder_cueva4_mina2": {
        "kind": "connector",
        "layer": "under",
        "x": 112,
        "y": 162
    },
    "stairs_N": {
        "kind": "connector",
        "layer": "above",
        "x": 81,
        "y": 46
    }
};
