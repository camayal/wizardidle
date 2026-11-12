// Wizard Idle v2 - the game loop.
//
// v1 ran the game on up to five independent setInterval timers (the master event clock,
// the clock of the current event, two animation clocks and the stats page clock). Each
// was started and stopped from many places, and some places started the master clock
// again without stopping it first. Every such leak left an extra invisible timer running
// events in parallel, and once its handle was overwritten nothing could ever stop it
// (v1's own note: "maybe some clocks are still running").
//
// Now there is one loop with named clocks. A clock exists at most once: starting it
// again replaces it. Killing the wizard stops them all.
//
//   every("master", event, 1500)   call event() every 1.5 s
//   stop("master")
//   stopAll()

const TICK_MS = 50;
const clocks = new Map();   // name -> { fn, ms, due }
let speed = 1;              // dev tools only: 10 runs every clock ten times faster

export function setSpeed(factor) {
    speed = factor;
}

export function getSpeed() {
    return speed;
}

export function every(name, fn, ms) {
    clocks.set(name, { fn, ms, due: performance.now() + ms / speed });
}

export function stop(name) {
    clocks.delete(name);
}

export function stopAll() {
    clocks.clear();
}

export function isRunning(name) {
    return clocks.has(name);
}

function tick() {
    const now = performance.now();
    for (const [name, clock] of clocks) {
        // a clock run earlier in this tick may have stopped or replaced this one
        if (clocks.get(name) !== clock || now < clock.due) continue;
        // keep the rhythm; if the tab was asleep, don't fire a burst to catch up
        const ms = clock.ms / speed;
        clock.due = clock.due + ms > now ? clock.due + ms : now + ms;
        try {
            clock.fn();
        } catch (error) {
            // Like v1's timers, a clock keeps running after an error, and the other clocks
            // are not affected. The error is still reported to the console.
            if (typeof reportError === 'function') reportError(error);
            else setTimeout(() => { throw error; });
        }
    }
}

setInterval(tick, TICK_MS);
