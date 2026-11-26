// Wizard Idle - winning back a Doubter or an Atheist with the touch on the scene (docs/plans/for_implementation_faith.md,
// section 5): a sign, a dream of a shrine, a pilgrim. (The hidden blessings count the lucky moments in src/hand.js.)
// The centre touch calls signTouch() when it is not a tithe at an altar or a quest's answer; what it does depends on
// where he is: asleep in the sleeping bag (a dream of a shrine), in a fight or hurt (a sign that helps, src/hand.js),
// in a town (a pilgrim), otherwise a sign in the sky. Numbers: config.winback (placeholders).

import { config } from './config.js';
import { state } from './state.js';
import { run, fight, ui } from './runtime.js';
import { playTime, stats } from './stats.js';
import { isDoubting, beliefLevel, beliefMoment } from './belief.js';
import { faithChange } from './faith.js';
import { nudgeCost } from './nudge.js';
import { handHelpWizard, handWeakenEnemy } from './hand.js';
import { pickRandomItem, YesOrNot } from './utils.js';
import { printDivine, updateHeading, wizardName } from './ui/render.js';

const TOWNS = ["la_Ciudad", "el_Poblado"];

const SKY = "stares at the sky, unsettled,watches a rainbow he can't explain,follows a flight of white birds with his eyes,sees a light in the clouds and looks away too fast";
const SKY_NOTHING = "sees a cloud and walks on,looks up for a moment, and shrugs";
const PILGRIM = "meets a pilgrim who talks about a god he almost remembers,listens to an old believer on the road, and doesn't walk away,is stopped by a pilgrim who asks him nothing, only blesses him";
const DREAM = "lies down with a strange warmth over the bag, thinking of a shrine,falls asleep with the smell of candles,feels the bag settle, as if someone had tucked it in";

const cooled = (key, ms) => playTime() - run[key] >= ms;

// The chance a sign gets through, rising with each one sent.
const signChance = () => Math.min(config.winback.signChanceMax, config.winback.signChance + stats.get("sign.sent") * config.winback.signChanceStep);

function pay() {
    if (state.player.faith < nudgeCost()) return false;
    faithChange(-nudgeCost(), "sign");
    updateHeading();
    return true;
}

// Returns true when the touch did something (the caller then stops).
export function signTouch() {
    if (fight.pjDead || run.simulation) return false;
    const doubting = isDoubting();

    if (ui.bagSpot != null) {                                     // asleep: a dream of a shrine
        if (!doubting || run.dreamShrine || !pay()) return false;
        run.dreamShrine = true;
        stats.count("sign.dream");
        printDivine(`<i>${wizardName()} ${pickRandomItem(DREAM)}</i>`);
        return true;
    }

    if (fight.enemy && fight.enemyHP > 0) {                       // in a fight: a sign that weakens the enemy
        if (!cooled("signAt", config.winback.signCooldownMs)) return false;
        if (!handWeakenEnemy()) return false;
        run.signAt = playTime();
        stats.count("sign.sent");
        return true;
    }

    if (doubting && TOWNS.includes(state.zone.current)) {         // in a town: a pilgrim
        if (!cooled("pilgrimAt", config.winback.pilgrimCooldownMs) || !pay()) return false;
        run.pilgrimAt = playTime();
        stats.count("sign.pilgrim");
        beliefMoment(beliefLevel() == "atheist" ? "pilgrim" : "pilgrimDoubter");
        printDivine(`<i>${wizardName()} ${pickRandomItem(PILGRIM)}</i>`);
        return true;
    }

    if (!cooled("signAt", config.winback.signCooldownMs)) return false;
    if (state.player.hp < state.player.hpBase && handHelpWizard()) {     // hurt: a herb shows itself
        run.signAt = playTime();
        stats.count("sign.sent");
        return true;
    }
    if (!doubting || !pay()) return false;                        // otherwise a sign in the sky
    run.signAt = playTime();
    const gets = YesOrNot(signChance(), 0);
    stats.count("sign.sent");
    stats.count(gets ? "sign.gotThrough" : "sign.missed");
    if (gets) beliefMoment("sign");
    printDivine(`<i>${wizardName()} ${pickRandomItem(gets ? SKY : SKY_NOTHING)}</i>`);
    return true;
}
