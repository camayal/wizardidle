// Wizard Idle - the clickable spots of the scenes (docs/plans/HOTSPOTS.md), made in the dev tools (Modes >
// Hotspots) and saved by tools/serve.py: do not edit by hand. { scene (lower case): [{ x, y, w, h, kind, to, label }] }
// in sprite px of the 256 x 64 scene. kind: exit (a way out: `to` is the stage, zone or connector he is nudged
// toward); more kinds come from the code itself (finds, props, places, mouths).
export const hotspots = {
    "la_torre1": [
        {
            "x": 226,
            "y": 3,
            "w": 26,
            "h": 32,
            "kind": "exit",
            "to": "la_Torre2",
            "label": "the wooden door"
        },
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
            "x": 112,
            "y": 28,
            "w": 28,
            "h": 30,
            "kind": "dream",
            "to": "nightmare",
            "label": "the palantir"
        }
    ],
    "la_torre2": [
        {
            "x": 28,
            "y": 6,
            "w": 26,
            "h": 30,
            "kind": "exit",
            "to": "la_Torre1",
            "label": "the wooden door"
        }
    ],
    "la_torre3": [
        {
            "x": 194,
            "y": 2,
            "w": 30,
            "h": 34,
            "kind": "exit",
            "to": "la_Torre5",
            "label": "the dark archway"
        }
    ]
};
