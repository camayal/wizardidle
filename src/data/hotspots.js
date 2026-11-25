// Wizard Idle - the clickable spots of the scenes (docs/plans/HOTSPOTS.md), made in the dev tools (Modes >
// Hotspots) and saved by tools/serve.py: do not edit by hand. { scene (lower case): [{ x, y, w, h, kind, to, label }] }
// in sprite px of the 256 x 64 scene. kind: exit (a way out: `to` is the stage, zone or connector he is nudged
// toward); more kinds come from the code itself (finds, props, places, mouths).
export const hotspots = {};
