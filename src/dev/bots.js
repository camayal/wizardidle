// Wizard Idle v2 - god bots for the simulation mode (src/dev/sim.js).
//
// A bot plays the god between two steps of the game, using the same touches a player has
// (src/divine.js). Its rules come from the URL:
//   god=idle     never touches
//   god=active   revives at once, heals below 30% HP, tithes at every shrine
//   heal=0.5, revive=0|1, tithe=0|1   change one rule of either bot (a custom god)

import { state } from '../state.js';
import { fight, run, ui } from '../runtime.js';
import { centerBtn, pjBtn } from '../divine.js';

const BOTS = {
    idle: { heal: 0, revive: false, tithe: false },
    active: { heal: 0.3, revive: true, tithe: true },
};

export function makeBot(params) {
    const name = params.get('god') || 'idle';
    const rules = { ...(BOTS[name] || BOTS.idle) };
    if (params.has('heal')) rules.heal = Number(params.get('heal'));
    if (params.has('revive')) rules.revive = params.get('revive') == '1';
    if (params.has('tithe')) rules.tithe = params.get('tithe') == '1';
    return {
        name, rules,
        step() {
            if (fight.pjDead) {
                if (rules.revive && !run.disablePjBtn) pjBtn();
                return;
            }
            const p = state.player;
            if (rules.heal > 0 && p.hp < p.hpBase * rules.heal && p.faith > 0 && !run.disablePjBtn) pjBtn();
            if (rules.tithe && !run.disableCenterBtn && p.gold > 0 && /altar/i.test(ui.currentBackGround || '')) centerBtn();
        },
    };
}
