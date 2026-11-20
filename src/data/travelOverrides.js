// Wizard Idle - manual corrections of the travel graph, made in the dev tools (Modes > Travel) and saved
// by tools/serve.py: do not edit by hand. "stageA|stageB" (names sorted, the link works both ways) is
// "move" (Accessible, green), "dest" (Difficult, yellow) or "far" (Impossible, red). travelPositions: waypoints moved
// by hand ({name: [x, y]} in map pixels); travelPoints: points added by hand ({name: {kind: future|connector, layer, x, y}}),
// both read by tools/travel_graph.py. See docs/TRAVEL.md.
export const travelOverrides = {};
export const travelPositions = {};
export const travelPoints = {
    "stairs_N": {
        "kind": "connector",
        "layer": "above",
        "x": 81,
        "y": 46
    }
};
