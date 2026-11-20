// Wizard Idle - manual corrections of the travel graph, made in the dev tools (Modes > Travel) and saved
// by tools/serve.py: do not edit by hand. "stageA|stageB" (names sorted, the link works both ways) is
// "move" (Accessible, green), "dest" (Difficult, yellow) or "far" (Impossible, red). travelPositions: waypoints moved
// by hand ({name: [x, y]} in map pixels); travelPoints: points added by hand ({name: {kind: future|connector, layer, x, y}}),
// both read by tools/travel_graph.py. See docs/TRAVEL.md.
export const travelOverrides = {
    "el_Bosque1|la_Pradera1": "move",
    "el_Bosque2|la_Pradera1": "dest",
    "el_Bosque3|la_Ciudad1": "move",
    "el_Bosque3|la_Ciudad2": "move",
    "el_Bosque3|la_Ciudad3": "move",
    "el_Bosque3|la_Ciudad4": "move",
    "el_Bosque3|la_Ciudad5": "move",
    "el_Duenon1|el_Duenon2": "move",
    "el_Duenon2|el_Duenon3": "move",
    "el_Duenon2|el_Duenon5": "move",
    "el_Duenon2|la_Gruta4": "move",
    "el_Duenon2|la_Gruta5": "move",
    "el_Duenon3|el_Duenon5": "move",
    "el_Duenon4|el_Duenon5": "move",
    "el_Duenon5|mouth_87_224": "move",
    "el_Heidan1|el_Heidan3": "dest",
    "el_Heidan2|el_Heidan3": "move",
    "el_Heidan2|stairs_N": "move",
    "el_Heidan3|el_Heidan5": "move",
    "el_Heidan4|el_Heidan5": "move",
    "el_Heidan4|stairs_above": "move",
    "el_Heidan5|stairs_above": "move",
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
    "la_Ciudad1|la_Pradera1": "move",
    "la_Ciudad1|la_Pradera4": "dest",
    "la_Ciudad1|la_Tundra1": "move",
    "la_Ciudad2|la_Pradera1": "move",
    "la_Ciudad2|la_Pradera4": "dest",
    "la_Ciudad2|la_Tundra1": "move",
    "la_Ciudad3|la_Pradera1": "move",
    "la_Ciudad3|la_Pradera4": "dest",
    "la_Ciudad3|la_Tundra1": "move",
    "la_Ciudad4|la_Pradera1": "move",
    "la_Ciudad4|la_Pradera4": "dest",
    "la_Ciudad4|la_Tundra1": "move",
    "la_Ciudad5|la_Pradera1": "move",
    "la_Ciudad5|la_Pradera4": "dest",
    "la_Ciudad5|la_Tundra1": "move",
    "la_Cueva1|la_Cueva2": "move",
    "la_Cueva1|la_Mina1": "move",
    "la_Cueva1|mina_cueva_2": "move",
    "la_Cueva1|mouth_147_31_under": "move",
    "la_Cueva1|mouth_27_114_under": "far",
    "la_Cueva2|la_Cueva3": "move",
    "la_Cueva2|mouth_147_31_under": "far",
    "la_Cueva3|la_Mina5": "move",
    "la_Cueva3|mina_cueva1": "move",
    "la_Cueva3|mina_cueva_2": "far",
    "la_Cueva3|mouth_27_114_under": "move",
    "la_Cueva4|la_Cueva5": "move",
    "la_Cueva4|ladder_cueva4_mina2": "dest",
    "la_Cueva5|mouth_130_120_under": "far",
    "la_Gruta1|la_Gruta2": "move",
    "la_Gruta1|la_Gruta3": "move",
    "la_Gruta1|la_Gruta4": "move",
    "la_Gruta1|la_Pradera4": "move",
    "la_Gruta1|las_Dunas5": "move",
    "la_Gruta2|la_Pradera4": "dest",
    "la_Gruta2|las_Dunas5": "dest",
    "la_Gruta3|la_Pradera4": "far",
    "la_Gruta3|las_Dunas5": "far",
    "la_Gruta4|la_Gruta5": "move",
    "la_Gruta4|la_Pradera4": "far",
    "la_Gruta4|las_Dunas5": "far",
    "la_Gruta5|la_Pradera4": "far",
    "la_Gruta5|las_Dunas5": "far",
    "la_Mina1|la_Mina4": "move",
    "la_Mina1|mina_cueva_2": "move",
    "la_Mina1|mouth_229_64_under": "move",
    "la_Mina2|la_Mina4": "move",
    "la_Mina2|ladder_cueva4_mina2": "move",
    "la_Mina3|la_Mina4": "move",
    "la_Mina3|mouth_218_182_under": "move",
    "la_Mina5|mina_cueva1": "move",
    "la_Mina5|mina_cueva_2": "far",
    "la_Mina5|mouth_27_114_under": "far",
    "la_Pradera1|mouth_27_114": "move",
    "las_Dunas1|las_Dunas3": "move",
    "las_Dunas1|las_Dunas4": "move",
    "las_Dunas1|mouth_33_165": "move",
    "las_Dunas2|las_Dunas5": "move",
    "las_Dunas2|mouth_33_165": "move",
    "las_Dunas3|mouth_27_114": "move",
    "las_Dunas4|mouth_33_165": "move",
    "mouth_130_120|mouth_130_120_under": "move",
    "mouth_147_31|mouth_147_31_under": "move",
    "mouth_218_182|mouth_218_182_under": "move",
    "mouth_229_64|mouth_229_64_under": "move",
    "mouth_27_114|mouth_27_114_under": "move",
    "stairs_N|stairs_n_ground": "move"
};
export const travelPositions = {
    "mouth_33_165": [
        33,
        165
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
    },
    "stairs_n_ground": {
        "kind": "connector",
        "layer": "ground",
        "x": 79,
        "y": 43
    },
    "pradera_pantano_w": {
        "kind": "future",
        "layer": "ground",
        "x": 86,
        "y": 61
    },
    "pradera_pantano_E": {
        "kind": "future",
        "layer": "ground",
        "x": 203,
        "y": 50
    },
    "la_playa1": {
        "kind": "future",
        "layer": "ground",
        "x": 232,
        "y": 39
    },
    "la_playa2": {
        "kind": "future",
        "layer": "ground",
        "x": 225,
        "y": 81
    },
    "la_playa3": {
        "kind": "future",
        "layer": "ground",
        "x": 234,
        "y": 116
    },
    "la_playa4": {
        "kind": "future",
        "layer": "ground",
        "x": 216,
        "y": 117
    },
    "la_playa6": {
        "kind": "future",
        "layer": "ground",
        "x": 190,
        "y": 113
    },
    "la_Pradera_lago": {
        "kind": "future",
        "layer": "ground",
        "x": 68,
        "y": 135
    },
    "la_Pradera_fueraCity": {
        "kind": "future",
        "layer": "ground",
        "x": 58,
        "y": 109
    },
    "intersection_city_tower": {
        "kind": "future",
        "layer": "ground",
        "x": 89,
        "y": 139
    },
    "el_Duenon7": {
        "kind": "future",
        "layer": "ground",
        "x": 155,
        "y": 198
    },
    "el_Pantano9_fueracastle": {
        "kind": "future",
        "layer": "ground",
        "x": 164,
        "y": 87
    },
    "el_Pantano_fishing": {
        "kind": "future",
        "layer": "ground",
        "x": 167,
        "y": 69
    },
    "la_Pradera_northTown": {
        "kind": "future",
        "layer": "ground",
        "x": 180,
        "y": 130
    },
    "la_pradera_n_dunasS": {
        "kind": "future",
        "layer": "ground",
        "x": 68,
        "y": 163
    },
    "la_Pradera_n_dunasN": {
        "kind": "future",
        "layer": "ground",
        "x": 19,
        "y": 118
    },
    "enter_mine_S": {
        "kind": "connector",
        "layer": "under",
        "x": 34,
        "y": 166
    }
};
