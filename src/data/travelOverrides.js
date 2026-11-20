// Wizard Idle - manual corrections of the travel graph, made in the dev tools (Modes > Travel) and saved
// by tools/serve.py: do not edit by hand. "stageA|stageB" (names sorted, the link works both ways) is
// "move" (Accessible, green), "dest" (Difficult, yellow) or "far" (Impossible, red). travelPositions: waypoints moved
// by hand ({name: [x, y]} in map pixels); travelPoints: points added by hand ({name: {kind: future|connector, layer, x, y}}),
// both read by tools/travel_graph.py. See docs/TRAVEL.md.
export const travelOverrides = {
    "el_Heidan1|el_Heidan5": "far",
    "el_Heidan2|el_Heidan3": "move",
    "el_Heidan2|el_Heidan5": "far",
    "el_Heidan3|el_Heidan5": "move",
    "el_Heidan3|stairs_above": "far",
    "el_Heidan4|el_Heidan5": "move",
    "el_Heidan5|stairs_above": "move",
    "el_Volcan1|el_Volcan4": "move",
    "el_Volcan1|la_Cueva4": "far",
    "el_Volcan1|la_Mina4": "far",
    "el_Volcan2|la_Cueva1": "far",
    "el_Volcan2|la_Cueva2": "far",
    "el_Volcan2|mouth_147_31_under": "far",
    "el_Volcan3|la_Cueva2": "move",
    "el_Volcan3|la_Cueva3": "move",
    "el_Volcan3|la_Cueva4": "far",
    "el_Volcan3|mouth_27_114_under": "far",
    "el_Volcan4|la_Cueva4": "far",
    "el_Volcan4|la_Mina4": "far",
    "el_Volcan5|la_Cueva2": "far",
    "el_Volcan5|la_Cueva4": "far",
    "el_Volcan5|la_Mina4": "far",
    "la_Cueva1|la_Cueva2": "move",
    "la_Cueva1|la_Mina1": "far",
    "la_Cueva1|mouth_229_64_under": "far",
    "la_Cueva2|la_Cueva3": "move",
    "la_Cueva2|mouth_130_120_under": "far",
    "la_Cueva2|mouth_147_31_under": "far",
    "la_Cueva3|la_Mina5": "far",
    "la_Cueva3|mouth_27_114_under": "move",
    "la_Cueva4|la_Cueva5": "move",
    "la_Cueva4|la_Mina5": "move",
    "la_Cueva4|mouth_130_120_under": "far",
    "la_Cueva4|mouth_87_224_under": "far",
    "la_Cueva5|la_Mina5": "far",
    "la_Mina1|la_Mina4": "move",
    "la_Mina2|la_Mina3": "move",
    "la_Mina2|la_Mina4": "move",
    "la_Mina2|mouth_218_182_under": "far",
    "la_Mina3|la_Mina4": "move",
    "la_Mina4|mouth_130_120_under": "far",
    "la_Mina4|mouth_218_182_under": "far",
    "la_Mina4|mouth_229_64_under": "far",
    "la_Mina5|mouth_27_114_under": "far",
    "la_Mina5|mouth_87_224_under": "far"
};
export const travelPositions = {};
export const travelPoints = {
    "stairs_N": {
        "kind": "connector",
        "layer": "above",
        "x": 81,
        "y": 46
    }
};
