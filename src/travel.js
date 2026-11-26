// Wizard Idle v2 - Moving around: changing zone, moving between the stages of a zone, picking backgrounds.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { places, zones } from './data/zones.js';
import { connectorsBetween, destinations, moves, reachesPoint, spotX } from './travelGraph.js';
import { borderScenes, bridgeLeftZone, connectorScenes, DOOR_STOP, mouthDoors, pierSteps, stairScenes } from './data/connectors.js';
import { pickRandomItem, YesOrNot } from './utils.js';
import { state } from './state.js';
import { stats } from './stats.js';
import { milestone } from './milestones.js';
import { run, ui } from './runtime.js';
import { endEvent, event, nextEvent, startEvent } from './events.js';
import { startCrossingFight } from './combat.js';
import * as loop from './loop.js';
import { config } from './config.js';
import { addXP } from './wizard.js';
import { steer, onStep } from './quests.js';
import { drawWizard, loadBackground, printIn, setFacing, showStage, walkAcross, walkThroughScene, walkWizardTo, wizardName } from './ui/render.js';
const print = printIn('journey');      // the console category (Settings: Text in the console)

const OFF_SCENE_RIGHT = 240, OFF_SCENE_LEFT = -72;     // just past the scene's edges (ui/render.js)

// The walking steps (render.walkAcross) of each kind of connector.
const bridgeSteps = (c, dir) => (dir > 0 ? connectorScenes[c] : connectorScenes[c].slice().reverse()).map(scene => ({ scene, dir, walkIn: dir < 0 }));      // going west he keeps walking left into the new area, from its right edge
const stairSteps = (ground, up) => (up ? stairScenes[ground].scenes : stairScenes[ground].scenes.slice().reverse()).map(scene => ({ scene, dir: up ? 1 : -1 }));
// A cave or mine mouth, or the ladder: he walks to the opening of the first scene (left to right), the scene fades
// into the second, and he walks on from the opening there.
const doorSteps = (a, b) => [
    { scene: a, dir: 1, end: mouthDoors[a] - DOOR_STOP, fade: true },
    { scene: b, dir: 1, start: mouthDoors[b] - DOOR_STOP },
];
// The south mine's mouth has a tunnel scene (enter_mine_S, a plain walk left to right) behind its underground
// side: after it going in, before it coming out.
const MINE_TUNNEL = { scene: "enter_mine_S", dir: 1 };
function mouthSteps(a, b) {
    const steps = doorSteps(a, b);
    if (b === "mouth_dunas_mina_under") steps.push(MINE_TUNNEL);
    if (a === "mouth_dunas_mina_under") steps.unshift(MINE_TUNNEL);
    return steps;
}
const LADDER = "ladder_cueva4_mina2", LADDER_CAVE = "ladder_cueva4_mina2_cave", LADDER_MINE = "ladder_cueva4_mina2_mine";

// The connector scenes between two stages as walking steps, or null when the trip has none.
// A bridge is entered from the side he stands on (origin east of the bridge: he walks west); stairs by
// going up or down; a mouth always left to right, stopping at its opening and fading into its twin.
function crossing(origin, target) {
    const walk = crossingSteps(origin, target);
    if (walk) planFight(walk.steps);
    return walk;
}

function crossingSteps(origin, target) {
    // within one zone a connector only passes the trip on (all the Town's stages link to the same bridge): no crossing
    if (places[origin].zone === places[target].zone) return null;
    const chain = connectorsBetween(origin, target), steps = [], x = spotX(origin);
    for (let i = 0; i < chain.length; i++) {
        const c = chain[i];
        if (borderScenes[c]) {
            const b = borderScenes[c];
            steps.push({ scene: b.scene, dir: 1, mirror: places[origin].zone !== b.left, border: true });
        } else if (connectorScenes[c]) {
            const bx = spotX(c);
            const east = bridgeLeftZone[c] ? places[origin].zone === bridgeLeftZone[c]      // art with a known zone on its left
                : !(x !== undefined && bx !== undefined && x > bx);
            steps.push(...bridgeSteps(c, east ? 1 : -1));
        } else if (stairScenes[c] || Object.values(stairScenes).some(s => s.top === c)) {
            const ground = stairScenes[c] ? c : Object.keys(stairScenes).find(k => stairScenes[k].top === c);
            if (c !== ground || !chain.includes(stairScenes[c].top)) continue;   // the top point is handled with its ground point
            steps.push(...stairSteps(c, chain.indexOf(c) < chain.indexOf(stairScenes[c].top)));
        } else if (c === LADDER) {
            const fromCave = places[origin].zone === "la_Cueva";
            steps.push(...(fromCave ? doorSteps(LADDER_CAVE, LADDER_MINE) : doorSteps(LADDER_MINE, LADDER_CAVE)));
        } else if (mouthDoors[c] !== undefined && chain[i + 1] && mouthDoors[chain[i + 1]] !== undefined) {
            steps.push(...mouthSteps(c, chain[++i]));
        }
    }
    return steps.length ? { steps, dir: steps[0].dir } : null;
}

// Dev tools: a pair of stages {from, to} whose real trip walks exactly these steps (same scenes, same directions),
// or null. The pier is a dead end: the same stage both ways.
const sigOf = (steps) => steps.map((s) => `${s.scene}/${s.dir}`).join();
const pairCache = {};
export function stagesFor(steps) {
    const key = sigOf(steps);
    if (key in pairCache) return pairCache[key];
    let found = null;
    const names = Object.keys(places);
    if (steps[0].scene === "pier_land") {
        const p = names.find((n) => reachesPoint(n, "pier"));
        found = p ? { from: p, to: p } : null;
    }
    for (let i = 0; !found && i < names.length; i++) {
        for (const b of names) {
            if (places[names[i]].zone === places[b].zone) continue;
            const w = crossingSteps(names[i], b);
            if (w && sigOf(w.steps) === key) { found = { from: names[i], to: b }; break; }
        }
    }
    return (pairCache[key] = found);
}

// A fight on a crossing: now and then one of its scenes stops him for a normal fight of the zone he is entering.
// Going left to right he stands in his usual place (offset 0); right to left the whole fight is mirrored
// (render.setFacing) and he stands in the mirror image of it, offset 160, so nothing jumps. Not on stairs, ladders or the pier.
const FIGHT_SPOT_LEFT = 0, FIGHT_SPOT_RIGHT = 160;
// force: the dev tools ask for the fight (and the walk is not a changeLocality event).
function planFight(steps, force = false) {
    if (!force && !YesOrNot(config.balance.pFightInCrossing, 0)) return;
    const ok = steps.filter((s) => {
        if (/^(stairs|ladder|pier)_/.test(s.scene)) return false;     // no fights on stairs, ladders or the pier
        const spot = s.dir > 0 ? FIGHT_SPOT_LEFT : FIGHT_SPOT_RIGHT;
        const from = s.start != null ? s.start : s.dir > 0 ? OFF_SCENE_LEFT : OFF_SCENE_RIGHT;
        const to = s.end != null ? s.end : s.dir > 0 ? OFF_SCENE_RIGHT : OFF_SCENE_LEFT;
        return (spot - from) * s.dir > 0 && (to - spot) * s.dir > 0;      // the walk of this scene passes the spot
    });
    if (!ok.length) return;
    const step = ok[Math.floor(Math.random() * ok.length)];
    step.fightSpot = step.dir > 0 ? FIGHT_SPOT_LEFT : FIGHT_SPOT_RIGHT;
    step.fight = (resume) => crossFight(step.dir, step.fightSpot, resume, !force);
    return step;
}

// Dev tools: the same walk with a fight on it (the first scene that can have one); false when no scene can.
export function withFight(steps) {
    const copy = steps.map((s) => ({ ...s }));
    return planFight(copy, true) ? copy : null;
}

// He stops where he is (the travelling event waits), the fight runs as an ordinary event, and when he wins the
// travelling event goes on. If he falls the crossing is given up and he lies in the stage he was heading to.
function crossFight(dir, spot, resume, resumeEvent = true) {
    const saved = run.multipleEventsCounter;
    loop.stop("event");
    run.multipleEventsCounter = 0;
    ui.wizardOffset = 0;
    if (!run.simulation) drawWizard();
    setFacing(dir > 0 ? 1 : -1);
    stats.count("travel.crossingFights");
    print(`${wizardName()} is stopped on the way`);
    run.crossFightAbort = () => { setFacing(1); ui.wizardOffset = 0; showStage(); };
    startCrossingFight(() => {
        const goOn = () => {
            setFacing(1);
            ui.wizardOffset = spot;
            run.crossFightAbort = undefined;
            run.multipleEventsCounter = saved;
            if (resumeEvent) startEvent(changeLocality);      // (a dev walk has no travelling event to wake)
            resume();
        };
        // the last spell frames still play on the mirrored canvas: wait for them before un-mirroring
        const wait = (run.spellUntil || 0) - performance.now();
        if (wait > 0) setTimeout(goOn, wait); else goOn();
    });
}

// Dev tools: every connector walk as {label, steps}, to force a crossing in the game (src/dev/tests.js).
function connectorTests() {
    const list = [];
    for (const c of Object.keys(connectorScenes)) {
        list.push({ label: `${c}: west to east`, steps: bridgeSteps(c, 1) }, { label: `${c}: east to west`, steps: bridgeSteps(c, -1) });
    }
    for (const [b, d] of Object.entries(borderScenes)) {
        list.push({ label: `${b}: left to right`, steps: [{ scene: d.scene, dir: 1 }] }, { label: `${b}: right to left`, steps: [{ scene: d.scene, dir: -1 }] });
    }
    for (const g of Object.keys(stairScenes)) {
        list.push({ label: `${g}: up`, steps: stairSteps(g, true) }, { label: `${g}: down`, steps: stairSteps(g, false) });
    }
    list.push({ label: "ladder: cave to mine (down)", steps: doorSteps(LADDER_CAVE, LADDER_MINE) },
        { label: "ladder: mine to cave (up)", steps: doorSteps(LADDER_MINE, LADDER_CAVE) });
    const mouths = Object.keys(mouthDoors).filter(k => !k.endsWith("_under") && k.startsWith("mouth_"));
    for (const m of mouths) {
        list.push({ label: `${m}: in`, steps: mouthSteps(m, `${m}_under`) }, { label: `${m}: out`, steps: mouthSteps(`${m}_under`, m) });
    }
    list.push({ label: "pier: out and back", steps: pierSteps });
    return list;
}

// Dev tools: put him in a stage of region `from` and make him walk to a stage of region `to` (zone ids, as in `zones`),
// through the real connectors between them when there are some (a pair of stages with a crossing is preferred).
// Returns a text for the console, or null when a region has no stages.
function regionTrip(from, to, onArrive) {
    const names = Object.keys(places), ins = (z) => names.filter((n) => places[n].zone === z);
    const at = (n) => ({ current: places[n].zone, stage: Number(n.match(/\d+$/)[0]) });
    for (const a of ins(from)) {          // a pair with connector scenes between them first
        for (const b of ins(to)) {
            const w = crossingSteps(a, b);
            if (!w) continue;
            Object.assign(state.zone, at(a)); showStage();
            Object.assign(state.zone, at(b));
            walkAcross(w.steps, showStage, onArrive);
            return `${a} to ${b}: ${w.steps.map((x) => x.scene + (x.mirror ? " (mirrored)" : "")).join(", ")}`;
        }
    }
    // none: the way the game's links go, stage by stage (a stage at the edge of a zone is the border), shortest first
    const start = ins(from)[0], goal = new Set(ins(to));
    if (!start || !goal.size) return null;
    const prev = { [start]: null }, todo = [start];
    let end = null;
    while (todo.length && !end) {
        const n = todo.shift();
        for (const m of [...moves(n), ...destinations(n)]) {
            if (!places[m] || m in prev) continue;
            prev[m] = n; todo.push(m);
            if (goal.has(m)) { end = m; break; }
        }
    }
    if (!end) return null;
    const path = [];
    for (let n = end; n; n = prev[n]) path.unshift(n);
    Object.assign(state.zone, at(start)); showStage();
    const hop = (k) => {
        if (k >= path.length) { if (onArrive) onArrive(); return; }
        const a = path[k - 1], b = path[k], w = crossingSteps(a, b);
        Object.assign(state.zone, at(b));
        if (w) walkAcross(w.steps, showStage, () => hop(k + 1));
        else walkWizardTo(OFF_SCENE_RIGHT, () => { showStage(); ui.wizardOffset = OFF_SCENE_LEFT; walkWizardTo(0, () => hop(k + 1)); });
    };
    hop(1);
    return `${path.join(" > ")}: stage by stage along the game's links, a plain walk between stages`;
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
            // the scenes of the crossing come first ("comes to the spring bridge"); he enters the zone when its own scene shows
            walkAcross(steps, () => {
                showStage();
                print(`${wizardName()} is entering to the ${zones[state.zone.current].name}, ${pickRandomItem(zones[state.zone.current].legend)}`);
            });
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
function pickRandomBackgroundForCurrentZone(onArrive, onScene) {   // onScene: the new scene is shown (before he walks in)
    const origin = state.zone.current + state.zone.stage;
    const randomLocality = steer(origin, moves(origin)) || pickRandomItem(moves(origin).join(","));     // a quest steers (src/quests.js)
    const change = () => {
        state.zone.stage = Number(randomLocality.match(/\d+$/));
        loadBackground(randomLocality);
        stats.count(`explore.scene.${randomLocality}`);
        onStep();
        if (onScene) onScene();
    };
    const cross = crossing(origin, randomLocality);
    if (cross) walkAcross(cross.steps, change, onArrive);
    else walkThroughScene(change, onArrive);
};


// Pick the next zone and stage from the current stage's destinations.
function getZone() {
    if (state.zone.current !== undefined) {
        stats.count("explore.zoneChanges");
        const origin = state.zone.current + state.zone.stage;
        const randomLocality = steer(origin, destinations(origin)) || pickRandomItem(destinations(origin).join(","))
        state.zone.current = randomLocality.match(/\D+/).toString();//extract no digits
        state.zone.stage = Number(randomLocality.match(/\d+/));//extract digits
        stats.count(`explore.zone.${state.zone.current}`);
        if (stats.get(`explore.zone.${state.zone.current}`) == 1) milestone("zone");      // a zone seen for the first time
        stats.count(`explore.scene.${randomLocality}`);
        onStep();
        state.zone.stay = 0;
        } else {
        state.zone.current = "la_Ciudad";//default start
    }
};


;


//Put first char in uppercase
;

export {
    connectorTests,
    regionTrip,
    canVisitPier,
    visitPier,
    changeLocality,
    pickRandomBackgroundForCurrentZone,
};
