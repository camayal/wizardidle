// Wizard Idle v2 - faith, the god's currency (docs/plans/for_implementation_faith.md, sections 2 and 3).
// 0 to a max, never negative. EVERY gain and loss goes through faithChange(), so the stats, the cap and
// later the belief moments and console lines happen in one place. Numbers: config.faith (placeholders).

import { config } from './config.js';
import { state } from './state.js';
import { stats } from './stats.js';

// The most faith he can hold: it grows with his strength (hpBase), so spare gold cannot snowball past it.
export const faithMax = () => Math.max(config.faith.maxMin, state.player.hpBase * config.faith.maxPerHp);

// Add (amount > 0) or spend (amount < 0) faith for a reason (`source`: prayer, offering, cleanse, shrine, heal, hit, ...).
// Returns the change that really happened (a gain stops at the max, a loss at 0).
export function faithChange(amount, source) {
    const p = state.player, before = p.faith;
    p.faith = Math.max(0, Math.min(faithMax(), before + amount));
    const done = p.faith - before;
    if (amount > 0) {
        stats.add(`faith.gain.${source}`, Math.round(done));
        if (done < amount) stats.add('faith.capped', Math.round(amount - done));      // gain lost to the max
    } else if (amount < 0) stats.add(`faith.spent.${source}`, Math.round(-done));
    stats.max('faith.highest', Math.round(p.faith));
    return done;
}
