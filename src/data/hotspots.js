// Wizard Idle - the clickable spots of the scenes (docs/plans/HOTSPOTS.md), made in the dev tools (Modes >
// Hotspots) and saved by tools/serve.py: do not edit by hand. { scene (lower case): [{ x, y, w, h, kind, to, label }] }
// in sprite px of the 256 x 64 scene. kind: exit (a way out: `to` is the stage, zone or connector he is nudged
// toward); more kinds come from the code itself (finds, props, places, mouths).
export const hotspots = {
    "bridge_south_east": [
        {
            "x": 113,
            "y": 27,
            "w": 51,
            "h": 10,
            "kind": "exit",
            "to": "el_Poblado",
            "label": "the town"
        }
    ],
    "el_desierto1": [
        {
            "x": 155,
            "y": 16,
            "w": 27,
            "h": 32,
            "kind": "place",
            "to": "inn",
            "label": "the tent"
        }
    ],
    "el_heidan3": [
        {
            "x": 216,
            "y": 22,
            "w": 38,
            "h": 30,
            "kind": "exit",
            "to": "el_Heidan5",
            "label": "the portal"
        }
    ],
    "el_heidan5": [
        {
            "x": 212,
            "y": 21,
            "w": 42,
            "h": 31,
            "kind": "exit",
            "to": "el_Heidan3",
            "label": "the portal"
        },
        {
            "x": 68,
            "y": 25,
            "w": 110,
            "h": 31,
            "kind": "idea",
            "to": "",
            "label": "gold",
            "note": "get some gold"
        }
    ],
    "la_ciudad4": [
        {
            "x": 41,
            "y": 22,
            "w": 24,
            "h": 19,
            "kind": "idea",
            "to": "",
            "label": "the dice house",
            "note": "go into the dice house (needs a dice-house event)"
        }
    ],
    "la_playa4": [
        {
            "x": 145,
            "y": 33,
            "w": 19,
            "h": 7,
            "kind": "idea",
            "to": "",
            "label": "",
            "note": "find some gold"
        }
    ],
    "la_pradera15": [
        {
            "x": 202,
            "y": 0,
            "w": 52,
            "h": 35,
            "kind": "exit",
            "to": "el_Castillo",
            "label": "the castle"
        }
    ],
    "la_pradera3": [
        {
            "x": 102,
            "y": 18,
            "w": 154,
            "h": 33,
            "kind": "exit",
            "to": "el_Pantano",
            "label": "the swamp"
        }
    ],
    "la_pradera4": [
        {
            "x": 115,
            "y": 24,
            "w": 40,
            "h": 18,
            "kind": "idea",
            "to": "",
            "label": "",
            "note": "a secret place we need to develop this idea"
        }
    ],
    "la_pradera7": [
        {
            "x": 166,
            "y": 27,
            "w": 75,
            "h": 12,
            "kind": "exit",
            "to": "el_Poblado",
            "label": "the town"
        }
    ],
    "la_pradera9": [
        {
            "x": 149,
            "y": 5,
            "w": 19,
            "h": 22,
            "kind": "exit",
            "to": "la_Torre",
            "label": "the tower"
        },
        {
            "x": 149,
            "y": 28,
            "w": 25,
            "h": 19,
            "kind": "exit",
            "to": "la_Tundra",
            "label": "the tundra"
        },
        {
            "x": 103,
            "y": 35,
            "w": 17,
            "h": 10,
            "kind": "exit",
            "to": "la_Ciudad",
            "label": "the city"
        }
    ],
    "la_torre1": [
        {
            "x": 14,
            "y": 3,
            "w": 76,
            "h": 30,
            "kind": "place",
            "to": "book",
            "label": "the bookshelves"
        },
        {
            "x": 162,
            "y": 3,
            "w": 38,
            "h": 30,
            "kind": "place",
            "to": "book",
            "label": "the bookshelves"
        },
        {
            "x": 118,
            "y": 22,
            "w": 28,
            "h": 30,
            "kind": "dream",
            "to": "nightmare",
            "label": "the palantir"
        }
    ],
    "ladder_cueva4_mina2_cave": [
        {
            "x": 141,
            "y": 0,
            "w": 19,
            "h": 35,
            "kind": "exit",
            "to": "ladder_cueva4_mina2_mine",
            "label": "the ladder down"
        }
    ],
    "ladder_cueva4_mina2_mine": [
        {
            "x": 102,
            "y": 46,
            "w": 38,
            "h": 16,
            "kind": "exit",
            "to": "ladder_cueva4_mina2_cave",
            "label": "the ladder up"
        }
    ],
    "las_dunas2": [
        {
            "x": 226,
            "y": 32,
            "w": 31,
            "h": 29,
            "kind": "place",
            "to": "inn",
            "label": "the tavern"
        }
    ],
    "las_dunas5": [
        {
            "x": 128,
            "y": 47,
            "w": 28,
            "h": 11,
            "kind": "idea",
            "to": "",
            "label": "skeleton",
            "note": "find a rune"
        }
    ]
};
