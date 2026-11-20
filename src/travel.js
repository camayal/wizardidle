// Wizard Idle v2 - Moving around: changing zone, moving between the stages of a zone, picking backgrounds.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { places, zones } from './data/zones.js';
import { connectorsBetween, destinations, moves, reachesPoint, spotX } from './travelGraph.js';
import { connectorScenes, DOOR_STOP, mouthDoors, pierSteps, stairScenes } from './data/connectors.js';
import { pickRandomItem } from './utils.js';
import { state } from './state.js';
import { stats } from './stats.js';
import { run, ui } from './runtime.js';
import { endEvent, event, nextEvent } from './events.js';
import { addXP } from './wizard.js';
import { loadBackground, print, showStage, walkAcross, walkThroughScene, walkWizardTo, wizardName } from './ui/render.js';

const OFF_SCENE_RIGHT = 240, OFF_SCENE_LEFT = -72;     // just past the scene's edges (ui/render.js)

// The connector scenes between two stages as walking steps (render.walkAcross), or null when the trip has none.
// A bridge is entered from the side he stands on (origin east of the bridge: he walks west); stairs by
// going up or down; a mouth always left to right, stopping at its opening and fading into its twin.
function crossing(origin, target) {
    // within one zone a connector only passes the trip on (all the Town's stages link to the same bridge): no crossing
    if (places[origin].zone === places[target].zone) return null;
    const chain = connectorsBetween(origin, target), steps = [], x = spotX(origin);
    for (let i = 0; i < chain.length; i++) {
        const c = chain[i];
        if (connectorScenes[c]) {
            const bx = spotX(c), dir = x !== undefined && bx !== undefined && x > bx ? -1 : 1;
            const scenes = dir > 0 ? connectorScenes[c] : connectorScenes[c].slice().reverse();
            scenes.forEach(scene => steps.push({ scene, dir }));
        } else if (stairScenes[c] || Object.values(stairScenes).some(s => s.top === c)) {
            const ground = stairScenes[c] ? c : Object.keys(stairScenes).find(k => stairScenes[k].top === c);
            if (c !== ground || !chain.includes(stairScenes[c].top)) continue;   // the top point is handled with its ground point
            const up = chain.indexOf(c) < chain.indexOf(stairScenes[c].top);
            const scenes = up ? stairScenes[c].scenes : stairScenes[c].scenes.slice().reverse();
            scenes.forEach(scene => steps.push({ scene, dir: up ? 1 : -1 }));
        } else if (mouthDoors[c] !== undefined && chain[i + 1] && mouthDoors[chain[i + 1]] !== undefined) {
            const twin = chain[++i];
            steps.push({ scene: c, dir: 1, end: mouthDoors[c] - DOOR_STOP, fade: true });
            steps.push({ scene: twin, dir: 1, start: mouthDoors[twin] - DOOR_STOP });
        }
    }
    return steps.length ? { steps, dir: steps[0].dir } : null;
}

// The pier (a dead end): can he walk out on it from this stage, and the walk out and back to the same stage.
const canVisitPier = () => reachesPoint(state.zone.current + state.zone.stage, "pier");
function visitPier(onArrive) {
    walkAcross(pierSteps, showStage, onArrive);
}

// Steps of travelling: leave the zone, enter a new one and show its legend.
function changeLocality() {
    run.multipleEventsCounter += 1;
    switch (run.multipleEventsCounter) {
    case 1:
        //get new zone
        state.zone.last = state.zone.current;
        print(`${wizardName()} left the ${zones[state.zone.last].name}`);
        {
            const origin = state.zone.current + state.zone.stage;
            getZone();
            run.crossing = crossing(origin, state.zone.current + state.zone.stage);
        }
        // walks out of the scene to the right (to the left when a bridge is crossed west)
        walkWizardTo(run.crossing && run.crossing.dir < 0 ? OFF_SCENE_LEFT : OFF_SCENE_RIGHT);
        break;
    case 2:
        if (run.crossing) {                  // over a bridge: its scenes first, then the new stage
            const { steps } = run.crossing;
            run.crossing = null;
            print(`${wizardName()} is entering to the ${zones[state.zone.current].name}, ${pickRandomItem(zones[state.zone.current].legend)}`);
            walkAcross(steps, showStage);
            break;
        }
        //change background
        showStage();
        print(`${wizardName()} is entering to the ${zones[state.zone.current].name}, ${pickRandomItem(zones[state.zone.current].legend)}`);
        ui.wizardOffset = OFF_SCENE_LEFT;    // and into the new zone from the left
        walkWizardTo(0);
        break;
    case 3:
        //cancel the Interval, put 0 to the counter and trigger a new event
        addXP(1);
        run.previousEvent = "changeLocality";
        endEvent();
        nextEvent();
        //trigger event selecter
    }

};



// Move to another stage of the current zone. The stage is kept too: it was not, so the next
// move could pick the scene he was already in (the author: he walked to the same scene).
function pickRandomBackgroundForCurrentZone(onArrive) {
    const origin = state.zone.current + state.zone.stage;
    const randomLocality = pickRandomItem(moves(origin).join(","));
    const change = () => {
        state.zone.stage = Number(randomLocality.match(/\d+$/));
        loadBackground(randomLocality);
    };
    const cross = crossing(origin, randomLocality);
    if (cross) walkAcross(cross.steps, change, onArrive);
    else walkThroughScene(change, onArrive);
};


// Pick the next zone and stage from the current stage's destinations.
function getZone() {
    if (state.zone.current !== undefined) {
        stats.count("explore.zoneChanges");
        const randomLocality = pickRandomItem(destinations(state.zone.current + state.zone.stage).join(","))
        state.zone.current = randomLocality.match(/\D+/).toString();//extract no digits
        state.zone.stage = Number(randomLocality.match(/\d+/));//extract digits
        stats.count(`explore.zone.${state.zone.current}`);
        state.zone.stay = 0;
        } else {
        state.zone.current = "la_Ciudad";//default start
    }
};


;


//Put first char in uppercase
;

export {
    canVisitPier,
    visitPier,
    changeLocality,
    pickRandomBackgroundForCurrentZone,
};
