// Wizard Idle v2 - Moving around: changing zone, moving between the stages of a zone, picking backgrounds.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { places, zones } from './data/zones.js';
import { pickRandomItem } from './utils.js';
import { state } from './state.js';
import { stats } from './stats.js';
import { run, ui } from './runtime.js';
import { endEvent, event, nextEvent } from './events.js';
import { addXP } from './wizard.js';
import { loadBackground, print, showStage, walkWizardTo, wizardName } from './ui/render.js';

const OFF_SCENE_RIGHT = 240, OFF_SCENE_LEFT = -72;     // just past the scene's edges (ui/render.js)

// Steps of travelling: leave the zone, enter a new one and show its legend.
function changeLocality() {
    run.multipleEventsCounter += 1;
    switch (run.multipleEventsCounter) {
    case 1:
        //get new zone
        state.zone.last = state.zone.current;
        print(`${wizardName()} left the ${zones[state.zone.last].name}`);
        walkWizardTo(OFF_SCENE_RIGHT);       // walks out of the scene to the right
        
        getZone();
        //get a new zone
        break;
    case 2:
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



// Move to another stage of the current zone.
function pickRandomBackgroundForCurrentZone() {
    const randomLocality = pickRandomItem(places[state.zone.current + state.zone.stage].moves)
    loadBackground(randomLocality);
};


// Pick the next zone and stage from the current stage's destinations.
function getZone() {
    if (state.zone.current !== undefined) {
        stats.count("explore.zoneChanges");
        const randomLocality = pickRandomItem(places[state.zone.current + state.zone.stage].destinations)
        state.zone.current = randomLocality.match(/\D+/).toString();//extract no digits
        state.zone.stage = Number(randomLocality.match(/\d+/));//extract digits
        stats.count(`explore.zone.${state.zone.current}`);
        } else {
        state.zone.current = "la_Ciudad";//default start
    }
};


;


//Put first char in uppercase
;

export {
    changeLocality,
    pickRandomBackgroundForCurrentZone,
};
