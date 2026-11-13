// Wizard Idle v2 - The dice game ("six, five, four"): the gambler in town houses, betting, rolling and scoring.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { getRandomInt, roundNumbertoLetter } from '../utils.js';
import { state } from '../state.js';
import { run, ui } from '../runtime.js';
import * as loop from '../loop.js';
import { endEvent, event, nextEvent, startEvent } from '../events.js';
import { hopEnemy, hopWizard } from '../combat.js';
import { spell } from '../spells.js';
import { playSound } from '../audio.js';
import { clearNPC, leavePlace, print, showStage, updateHeading, wizardName } from '../ui/render.js';

//TODO add idx for all this part and achievements
//temp dicegame
//define dice and set 1 as default
let dicesToRoll = {a: 1,b: 1,c: 1,d: 1,e: 1}
let nameDicePlayer, tie, firstPlayerWins, diceRolled; // shared by the dice game functions (were implicit globals)
let ship = false;
let captain = false;
let crew = false;
let cargo = 0;
let cargoFirstPlayer = 0;
let nameFirstPlayer = ""
let riskinDice = 7;
let countRounds = 0;
let currentHand = "";
let symbolCurrentHand = "";
const currentPlayerDice = ""
const gamblingManName = "<i>Gambling man</i>"
let isRolling = false
let resultDice = "";
let betForDice = 0;


// Start a game of six-five-four against the gambler: decide who opens and place the bet.
function sixfivefour(){
    //calculate the risk (amount of cargo that consider risky)
    riskinDice = Math.floor(Math.random() * (10 - 6) ) + 6;
    //determine if the opponent start or the wizard
    const enemyStart = Math.random() >= 0.5;
    //declare bet
    betForDice = getRandomInt(state.player.gold * 0.1,state.player.gold * 0.5)
    playSound("coins");

    if (enemyStart){
        nameDicePlayer = gamblingManName
    } else {
        nameDicePlayer = `${wizardName()} `
    }

    

    countRounds++
    //set or equal the bet
    state.player.gold = state.player.gold - betForDice;
    updateHeading();
    print(`${nameDicePlayer} starts the game and suggest a bet of ${ui.goldIcon}${roundNumbertoLetter(betForDice)}`)

    

    loop.stop("event");
    startEvent(function() { rollDicesForSixfivefour(enemyStart,nameDicePlayer); });
}


// A small dice-game icon for the console (img/<name>.png).
function diceImg(name) {
    return `<img class='imgInConsole' height='${ui.em}' src='img/${name}.png'/>`;
}

// The banked symbols in parentheses, or nothing.
function inParens(symbols) {
    return symbols != '' ? `(${symbols})` : '';
}

// One step of a player's turn, run by the event clock. Steps alternate between rolling the
// dice and showing the result, for up to three rolls.
function rollDicesForSixfivefour(enemyStart, nameDicePlayer) {
    run.multipleEventsCounter += 1;
    isRolling = !isRolling;
    if (isRolling) {
        // keep rolling while the cargo is risky or doesn't beat the first player's
        if (cargo < riskinDice || cargo <= cargoFirstPlayer) {
            rollTurn(nameDicePlayer);
        } else {
            skipRoll(enemyStart, nameDicePlayer);
        }
    } else {
        showRoll(enemyStart, nameDicePlayer);
    }
}

// Roll the dice that are still in play and bank ship (6), captain (5) and crew (4) in that order;
// with all three banked, the two remaining dice are the cargo.
function rollTurn(nameDicePlayer) {
    if (nameDicePlayer == gamblingManName) {
        hopEnemy();
    } else {
        hopWizard();
    }
    spell("spellMiniDados_18", true, false, true);
    playSound("dice");
    rollMessage(nameDicePlayer);

    resultDice = "";
    for (let die in dicesToRoll) {
        dicesToRoll[die] = Math.floor(Math.random() * 6 + 1);
        resultDice = resultDice + diceImg(`d${dicesToRoll[die]}`);
    }
    if (!ship && bankDie(6)) {
        ship = true;
        currentHand = `${diceImg("d6")}:${diceImg("ship")} `;
        symbolCurrentHand = diceImg("ship");
    }
    if (ship && !captain && bankDie(5)) {
        captain = true;
        currentHand += `${diceImg("d5")}:${diceImg("captain")} `;
        symbolCurrentHand += diceImg("captain");
    }
    if (ship && captain && !crew && bankDie(4)) {
        crew = true;
        currentHand += `${diceImg("d4")}:${diceImg("crew")} `;
        symbolCurrentHand += diceImg("crew");
    }
    if (ship && captain && crew) {
        cargo = 0;
        for (let die in dicesToRoll) {
            cargo = cargo + dicesToRoll[die];
        }
    }
}

// What the player says before rolling.
function rollMessage(nameDicePlayer) {
    if (riskinDice > cargo && ship && captain && crew) {
        print(`${nameDicePlayer} feels risky and rolls the dice to try a better cargo`);
    } else if (cargo <= cargoFirstPlayer && ship && captain && crew) {
        print(`${nameDicePlayer} rolls the dice to try to get more cargo`);
    } else if (run.multipleEventsCounter == 3) {
        print(`${nameDicePlayer} rolls the dice again ${inParens(symbolCurrentHand)}`);
    } else if (run.multipleEventsCounter == 5) {
        print(`${nameDicePlayer} plays the last turn ${inParens(symbolCurrentHand)}`);
    } else {
        print(`${nameDicePlayer} rolls the dice`);
    }
}

// Take the first die showing `face` out of play. Returns whether one was found.
function bankDie(face) {
    for (let die in dicesToRoll) {
        if (dicesToRoll[die] == face) {
            delete dicesToRoll[die];
            return true;
        }
    }
    return false;
}

// The cargo is good enough: end the turn early.
function skipRoll(enemyStart, nameDicePlayer) {
    endEvent();
    print(`${nameDicePlayer} thinks the cargo is enough and skips`);
    startEvent(function () { evalSixFiveFour(enemyStart, nameDicePlayer); });
}

// Show what was rolled and banked; after the third roll the turn ends.
function showRoll(enemyStart, nameDicePlayer) {
    print(`${nameDicePlayer} gets ${resultDice}${(currentHand != '') ? ' and banks ' + currentHand : ''}`);
    currentHand = "";
    symbolCurrentHand = "";
    if (run.multipleEventsCounter == 6) {
        endEvent();
        startEvent(function () { evalSixFiveFour(enemyStart, nameDicePlayer); });
    }
}






// After a player's turn: hand over to the other player, or go to the final score.
function evalSixFiveFour(enemyStart, nameDicePlayer){
    //Evaluate the current round
    if (ship && captain && crew){print(`${nameDicePlayer} set sail with ${cargo} of cargo`)}
    if (ship && captain && !crew){print(`${nameDicePlayer} got a ship and captain but no the crew, does not set sail (${cargo})`)}
    if (ship && !captain && !crew){print(`${nameDicePlayer} got a ship but neither captain nor crew were available, does not set sail (${cargo})`)}
    if (!ship && !captain && !crew){print(`${nameDicePlayer} got nothing (${cargo})`)}


       //Start the second round
        if (countRounds == 1){
            cargoFirstPlayer = cargo;
            nameFirstPlayer = nameDicePlayer;
            countRounds++
            if (!enemyStart){nameDicePlayer = gamblingManName} else {nameDicePlayer = `${wizardName()} `}
            resetSixFiveFour()
            loop.stop("event");
            startEvent(function() { rollDicesForSixfivefour(!enemyStart,nameDicePlayer); });
        }else{
            //Final scoring call
            loop.stop("event");
            startEvent(function() { finalScoreSixFiveFour(nameDicePlayer); });
        }

    
     

}



// Compare both cargos, pay the winner and go back to the road.
function finalScoreSixFiveFour(nameDicePlayer){

    run.multipleEventsCounter += 1;
    let winnerDice;
    switch (run.multipleEventsCounter){
        case 1:
            countRounds = 0
            tie = cargoFirstPlayer == cargo
            
            if (!tie){
                firstPlayerWins = cargoFirstPlayer > cargo;
                if(firstPlayerWins){
                    print(`${nameFirstPlayer} wins ${ui.goldIcon}${roundNumbertoLetter(betForDice * 2)} (${cargoFirstPlayer} vs. ${cargo}) `)
                    winnerDice = nameFirstPlayer;
                }else{
                    print(`${nameDicePlayer} wins ${ui.goldIcon}${roundNumbertoLetter(betForDice * 2)} (${cargoFirstPlayer} vs. ${cargo}) `)
                    winnerDice = nameDicePlayer;
                }

                if (winnerDice == gamblingManName){
                    playSound("coins");
                    spell("spellCoins",false);
                }else{
                    playSound("coins");
                    spell("spellCoins",true);
                    state.player.gold = state.player.gold + betForDice * 2;
                    updateHeading();
                }

            }else{
                print(`Nobody won (${cargoFirstPlayer} vs. ${cargo})`)
                state.player.gold = state.player.gold + betForDice;
                updateHeading();
            }
        break;
        case 2:
            print(`${wizardName()} exits the gaming house`);
            cargoFirstPlayer = 0;
            resetSixFiveFour()
            clearNPC();
            run.restAtInn = false;
            endEvent();
            leavePlace(showStage, nextEvent);       // out through the dice house's door
    }
}


// Clear the dice game state for the next game.
function resetSixFiveFour(){
    nameDicePlayer = ""
     currentHand = "";
     symbolCurrentHand = "";
     dicesToRoll = {a: 1,b: 1,c: 1,d: 1,e: 1};
     ship = false;
     captain = false;
     crew = false;
     cargo = 0;
     isRolling = false
     diceRolled = ""
}

export {
    sixfivefour,
};
