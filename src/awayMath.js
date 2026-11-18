// Wizard Idle v2 - time away: the numbers (docs/AWAY.md). Pure functions, nothing is read or
// changed here, so the simulation and node can check them. Every value is in config.away.

import { config } from './config.js';

// World hours for an absence in seconds: capped, divided by the world divisor.
export function worldHours(awaySeconds) {
    const a = config.away;
    const capped = Math.min(awaySeconds, a.capDays * 86400);
    return capped / a.worldDivisor / 3600;
}

// Chance he dies for good after this many world hours: none before the soft-dead stage, rising
// to deadRampChance at about two months and to certain at the cap.
export function permadeathChance(hours) {
    const a = config.away;
    if (hours < a.softDeadHours) return 0;
    if (hours <= a.deadRampHours) {
        return a.deadRampChance * (hours - a.softDeadHours) / (a.deadRampHours - a.softDeadHours);
    }
    if (hours >= a.deadCertainHours) return 1;
    return a.deadRampChance + (1 - a.deadRampChance) * (hours - a.deadRampHours) / (a.deadCertainHours - a.deadRampHours);
}

// Faith left after the absence (it only falls; never pushed below 0 if it was above).
export function faithAfter(faith, hours) {
    if (faith <= 0) return faith;
    return faith * Math.pow(1 - config.away.faithLossPerHour, hours);
}

// Gold after the absence: up or down by up to goldDriftPerHour per world hour (rand 0..1).
export function goldAfter(gold, hours, rand) {
    return Math.max(0, gold * (1 + (rand * 2 - 1) * config.away.goldDriftPerHour * hours));
}

// Levels gained: levelsPerHour * hours with a random rounding, at most maxLevels, and never up to
// the next chapter level (thresholds: levels with a chapter, and the last level).
export function levelsGained(lvl, hours, rand, thresholds) {
    const a = config.away;
    const want = hours * a.levelsPerHour;
    let n = Math.min(a.maxLevels, Math.floor(want) + (rand < want - Math.floor(want) ? 1 : 0));
    const next = Math.min(...thresholds.filter((t) => t > lvl));
    return Math.max(0, Math.min(n, next - 1 - lvl));
}
