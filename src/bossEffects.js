// Wizard Idle v2 - what some boss attacks do besides their damage (docs/SCENE_SPELLS.md,
// "Boss effects", decided by the author on 2026-11-13). The numbers are starting values in
// config.balance, to tune with playtests. Game logic only: the looks are in ui/bossAttacks.js.
//
//   Medusa's gaze      sometimes turns him to stone for a few turns (she hits freely); after his
//                      first time he can find a rare artefact that makes him immune for good
//   Midas's golden rays heal Midas (twice per fight at most), unless the god's touch interrupts
//   Blizzard           sometimes he skips his next attack
//   Poison cloud       a little damage over a few turns
//   Earthquake         sometimes his next spell misses

import { config } from './config.js';
import { zones } from './data/zones.js';
import { bossAttacks } from './data/bossAttacks.js';
import { roundNumbertoLetter, YesOrNot } from './utils.js';
import { state } from './state.js';
import { stats } from './stats.js';
import { fight, run, ui } from './runtime.js';
import { playWizardAnim, print, updateHeading, updateHeartNPC, wizardName } from './ui/render.js';

const b = () => config.balance;

// The boss's attack follows from the spell the game picked (no extra randomness): the spell's
// place in the zone's list, over the boss's attacks.
export function bossAttackFor(boss, spellId) {
    const attacks = bossAttacks[boss];
    if (!attacks) return null;
    const list = String(zones[state.zone.current].bossSpell).split(",");
    return attacks[Math.max(0, list.indexOf(spellId)) % attacks.length];
}

// A new fight (or the end of one): no effect carries over.
export function resetBossEffects() {
    Object.assign(fight, { stoneTurns: 0, skipAttack: false, missSpell: false, poisonTurns: 0, midasHeals: 0, midasPendingHeal: 0 });
}

// After a boss attack lands: its effect, if it has one. Returns true when he is turned to stone
// (the looks play the petrify).
export function applyBossEffect(attack) {
    if (!attack) return false;
    if (fight.enemy == "medusa" && attack.id == "gaze" && !state.petrifyImmune && !fight.stoneTurns
        && YesOrNot(b().petrifyChance, 0)) {
        fight.stoneTurns = b().petrifyTurns;
        state.petrifiedOnce = true;
        stats.count("boss.petrified");
        print(`${wizardName()} is turned to stone by Medusa's gaze!`);
        return true;
    }
    if (fight.enemy == "midas" && attack.id == "golden_rays" && fight.midasHeals < b().midasHealsPerFight) {
        fight.midasPendingHeal = Math.round(fight.enemyHPbase * b().midasHeal);
        print(`<span style='color:DarkGoldenRod'>The golden rays spin around King Midas...</span>`);
    }
    if (attack.scene == "blizzard" && YesOrNot(b().blizzardChance, 0)) {
        fight.skipAttack = true;
        stats.count("boss.effect.blizzard");
    }
    if (attack.scene == "poison_cloud") {
        fight.poisonTurns = b().poisonTurns;
        stats.count("boss.effect.poison");
    }
    if (attack.scene == "earthquake" && YesOrNot(b().earthquakeChance, 0)) {
        fight.missSpell = true;
        stats.count("boss.effect.earthquake");
    }
    return false;
}

// At the start of each fight turn: poison hurts, Midas's rays heal him. Returns true when the
// wizard can't act this turn (he is stone: the boss then attacks freely).
export function startOfTurn() {
    if (fight.poisonTurns > 0) {
        fight.poisonTurns--;
        const damage = Math.min(state.player.hp, state.player.hpBase * b().poisonDamage);
        state.player.hp -= damage;
        print(`${wizardName()} suffers the poison (${ui.attackIcon}${roundNumbertoLetter(damage)})`);
    }
    if (fight.midasPendingHeal) {
        fight.enemyHP = Math.min(fight.enemyHPbase, fight.enemyHP + fight.midasPendingHeal);
        print(`King Midas is healed by his golden rays (${ui.healIcon}${roundNumbertoLetter(fight.midasPendingHeal)})`);
        fight.midasPendingHeal = 0;
        fight.midasHeals++;
        stats.count("boss.midasHeal");
        updateHeartNPC();
    }
    updateHeading();
    if (fight.stoneTurns > 0) {
        fight.stoneTurns--;
        if (fight.stoneTurns == 0) {
            print(`${wizardName()} breaks free from the stone`);
            if (!run.simulation) playWizardAnim("unpetrify");
        } else {
            print(`${wizardName()} is still stone and can't move`);
        }
        return true;
    }
    return false;
}

// Before his attack: the cold may stop it, the quake may make it miss. Returns true when the
// attack doesn't happen (the turn is lost).
export function attackPrevented() {
    if (fight.skipAttack) {
        fight.skipAttack = false;
        print(`${wizardName()} is too cold to attack`);
        return true;
    }
    if (fight.missSpell) {
        fight.missSpell = false;
        print(`${wizardName()}'s spell misses: the ground is still shaking`);
        return true;
    }
    return false;
}

// The god's touch on Midas while the rays spin stops the heal.
export function interruptMidasHeal() {
    if (!fight.midasPendingHeal) return;
    fight.midasPendingHeal = 0;
    stats.count("boss.midasHealInterrupted");
    print(`<span style='color:DarkGoldenRod'>Your touch breaks the golden rays: King Midas is not healed</span>`);
}

// A find may be the rare artefact against Medusa's gaze, once he has been stone at least once.
export function artefactFound() {
    if (!state.petrifiedOnce || state.petrifyImmune || !YesOrNot(b().artefactChance, 0)) return false;
    state.petrifyImmune = true;
    stats.first("boss.petrifyImmune");
    return true;
}
