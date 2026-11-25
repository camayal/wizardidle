// Wizard Idle - the manual work of the travel tool (Modes > Travel), read from travel.json, the one file the
// tool saves (tools/serve.py writes it as it comes and keeps a backup of the old one in docs/travel-backups).
// Do not put data here: this module only loads the file.
//   verdicts   "stageA|stageB" (names sorted, the link works both ways): move (Accessible), dest (Difficult), far (Impossible)
//   positions  {name: [x, y]} in map pixels: a scene or waypoint moved by hand (wins over zones.js)
//   points     {name: {kind: future|connector|border, layer, x, y, note}}: points added by hand
//   kinds      {scene: future|connector|border}: a game scene marked as another type
// tools/travel_graph.py reads the same file. See docs/TRAVEL.md.
import data from './travel.json' with { type: 'json' };
import { places } from './zones.js';

export const travelSaved = data.saved || '';
export const travelOverrides = data.verdicts || {};
export const travelPositions = data.positions || {};
export const travelPoints = data.points || {};
export const travelKinds = data.kinds || {};

// A scene moved in the tool keeps its place here (zones.js has the fractions of the 250 px map).
for (const [name, xy] of Object.entries(travelPositions)) {
    if (places[name]) { places[name].x = xy[0] / 250; places[name].y = xy[1] / 250; }
}
