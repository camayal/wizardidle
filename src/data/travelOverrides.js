// Wizard Idle - manual corrections of the travel graph, made in the dev tools (Modes > Travel) and saved
// by tools/serve.py: do not edit by hand. "stageA|stageB" (names sorted, the link works both ways) is
// "move" (Accessible, green), "dest" (Difficult, yellow) or "far" (Impossible, red). travelPositions: waypoints moved
// by hand ({name: [x, y]} in map pixels); travelPoints: points added by hand ({name: {kind: future|connector, layer, x, y}}),
// both read by tools/travel_graph.py. See docs/TRAVEL.md.
export const travelOverrides = {
    "el_Volcan1|el_Volcan2": "move",
    "el_Volcan1|el_Volcan3": "move",
    "el_Volcan1|el_Volcan4": "move",
    "el_Volcan1|el_Volcan5": "move",
    "el_Volcan1|mouth_130_120_under": "move",
    "el_Volcan2|el_Volcan3": "move",
    "el_Volcan2|el_Volcan4": "move",
    "el_Volcan2|el_Volcan5": "move",
    "el_Volcan2|mouth_130_120_under": "move",
    "el_Volcan3|el_Volcan4": "move",
    "el_Volcan3|el_Volcan5": "move",
    "el_Volcan3|future_chamber": "move",
    "el_Volcan3|mouth_130_120_under": "move",
    "el_Volcan4|el_Volcan5": "move",
    "el_Volcan4|la_Cueva5": "far",
    "el_Volcan4|mouth_130_120_under": "move",
    "el_Volcan5|mouth_130_120_under": "move",
    "future_cave_NW|la_Cueva2": "move",
    "la_Cueva1|la_Cueva2": "move",
    "la_Cueva1|la_Mina1": "move",
    "la_Cueva1|mouth_147_31_under": "move",
    "la_Cueva1|mouth_27_114_under": "far",
    "la_Cueva2|la_Cueva3": "move",
    "la_Cueva2|mouth_147_31_under": "far",
    "la_Cueva3|la_Mina5": "move",
    "la_Cueva3|mouth_27_114_under": "move",
    "la_Cueva4|la_Cueva5": "move",
    "la_Cueva4|ladder_cueva4_mina2": "move",
    "la_Cueva5|mouth_130_120_under": "far",
    "la_Mina1|la_Mina4": "move",
    "la_Mina1|mouth_229_64_under": "move",
    "la_Mina2|la_Mina4": "move",
    "la_Mina2|ladder_cueva4_mina2": "move",
    "la_Mina3|la_Mina4": "move",
    "la_Mina3|mouth_218_182_under": "move",
    "la_Mina5|mouth_27_114_under": "far"
};
export const travelPositions = {
    "mouth_130_120": [
        137,
        113
    ]
};
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
    },
    "mina_cueva1": {
        "kind": "future",
        "layer": "under",
        "x": 27,
        "y": 138
    },
    "mina_cueva_2": {
        "kind": "future",
        "layer": "under",
        "x": 187,
        "y": 47
    }
};
