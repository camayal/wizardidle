// Wizard Idle v2 - The dice game ("six, five, four"): the gambler in town houses, betting, rolling and scoring.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { getRandomInt, roundNumbertoLetter } from '../utils.js';
import { state } from '../state.js';
import { run, ui } from '../runtime.js';
import * as loop from '../loop.js';
import { masterTime } from '../config.js';
import { event } from '../events.js';
import { currentFrame, frameHeight, frameWidth, shift, spell } from '../spells.js';
import { playSound } from '../audio.js';
import { animateNPC, animatePJ, loadBackground, npcCanvas, print, updateHeading } from '../ui/render.js';

//TODO add idx for all this part and archievements
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


//Start the game Six Five Four
function sixfivefour(){
    //calculate the risk (amount of cargo that consider risky)
    riskinDice = Math.floor(Math.random() * (10 - 6) ) + 6;
    //determine if the opponent start or the wizard
    const enemyStart = Math.random() >= 0.5;
    //declare bet
    betForDice = getRandomInt(state.player.gold * 0.1,state.player.gold * 0.5)
    playSound("coins");

    //console.log("enemy start: " + enemyStart)
    if (enemyStart){
        nameDicePlayer = gamblingManName
    } else {
        nameDicePlayer = "<b>" + state.player.name + "</b> "
    }

    

    countRounds++
    //spell("spellCoins",false,frameWidth,frameHeight,currentFrame,shift);
    //spell("spellCoins",true,frameWidth,frameHeight,currentFrame,shift);
    //set or equal the bet
    state.player.gold = state.player.gold - betForDice;
    updateHeading();
    print(nameDicePlayer + " starts the game and suggest a bet of " + ui.goldIcon + roundNumbertoLetter(betForDice))

    

    loop.stop("event");
    loop.every("event", function() { rollDicesForSixfivefour(enemyStart,nameDicePlayer); }, masterTime);
}


//Mechanism for the game Six Five Four
function rollDicesForSixfivefour(enemyStart, nameDicePlayer) {
    run.multipleEventsCounter += 1;
    
    //switch between rolling and results
    isRolling = !isRolling

    //detect if is rolling or presenting the result
    if (isRolling){
        //Roll if cargo is <= risknumber, this is usefull to skip the last rollings in case the player has a good amoung of points

        if (cargo < riskinDice || cargo <= cargoFirstPlayer){

            //animate thow dice
            if (nameDicePlayer == gamblingManName){
                if (document.hasFocus()){loop.every("animNPC", animateNPC, 100)};
            }else{
                if (document.hasFocus()){loop.every("animPJ", animatePJ, 100)};
            }
            spell("spellMiniDados_18",true,frameWidth,frameHeight,currentFrame,shift,false,true);
            playSound("dice");


            //console.log("risk: " + riskinDice)
            //Set a dialog if the risk is too high
            if (riskinDice > cargo && ship && captain && crew){
                print(nameDicePlayer + " feels risky and rolls the dice to try a better cargo")
            }else if(cargo <= cargoFirstPlayer && ship && captain && crew){
                print(nameDicePlayer + " rolls the dice to try to get more cargo")
            }else{
                if (run.multipleEventsCounter == 3){
                    print(nameDicePlayer + " rolls the dice again " + ((symbolCurrentHand != '') ? '(' : '') + symbolCurrentHand + ((symbolCurrentHand != '') ? ')' : ''))
                }else if (run.multipleEventsCounter == 5){
                    print(nameDicePlayer + " plays the last turn " + ((symbolCurrentHand != '') ? '(' : '') + symbolCurrentHand + ((symbolCurrentHand != '') ? ')' : ''))
                }else{
                    print(nameDicePlayer + " rolls the dice")
                }
            }
            

            resultDice = "";
            //for each element in the dicesToRoll object put a randon from 1 to 6
            for (let elem in dicesToRoll) {
                dicesToRoll[elem] = Math.floor(Math.random() * 6 + 1)
                // "dado: " + elem + " roll: " + dicesToRoll[elem]
                //console.log("dado: " + elem + " roll: " + dicesToRoll[elem])
                //save current roll (to avoid delete info in the next steps) with images
                resultDice = resultDice + "<img class='imgInConsole' height='" + ui.em + "' src='img/d" + dicesToRoll[elem] +".png'/>"
            }
            

        
            //check if some dice is 6 an delete the dice and set ship true
            for (let elem in dicesToRoll){
                if(dicesToRoll[elem] == 6 && !ship){
                    delete dicesToRoll[elem];
                    ship = true
                    currentHand = "<img class='imgInConsole' height='" + ui.em + "' src='img/d6.png'/>:<img class='imgInConsole' height='" + ui.em + "' src='img/ship.png'/> "
                    symbolCurrentHand = "<img class='imgInConsole' height='" + ui.em + "' src='img/ship.png'/>"
                    //console.log("ship: " + ship)
                }
            }
            //check if some dice is 5 an delete the dice and set captain true
            for (let elem in dicesToRoll){
                if(dicesToRoll[elem] == 5 && ship && !captain){
                    delete dicesToRoll[elem];
                    captain = true
                    currentHand += "<img class='imgInConsole' height='" + ui.em + "' src='img/d5.png'/>:<img class='imgInConsole' height='" + ui.em + "' src='img/captain.png'/> "
                    symbolCurrentHand += "<img class='imgInConsole' height='" + ui.em + "' src='img/captain.png'/>"
                    //console.log("captain: " + captain)
                }
            }
            //check if some dice is 4 an delete the dice and set crew true
            for (let elem in dicesToRoll){
                if(dicesToRoll[elem] == 4 && ship && captain && !crew){
                    delete dicesToRoll[elem];
                    crew = true
                    currentHand += "<img class='imgInConsole' height='" + ui.em + "' src='img/d4.png'/>:<img class='imgInConsole' height='" + ui.em + "' src='img/crew.png'/> "
                    symbolCurrentHand += "<img class='imgInConsole' height='" + ui.em + "' src='img/crew.png'/>"
                    //console.log("crew: " + crew)
                }
            }
        
            //check the cargo and roll if is less than 7 (most probable number for two dices)
            if(ship && captain && crew ){
                //reset cargo in case need a second rolling of risk
                cargo = 0;
                for (let elem in dicesToRoll){
                        cargo = cargo + dicesToRoll[elem]
                }
                //console.log("cargo: " + cargo)
            }

        }else{
            
            loop.stop("event");
            run.multipleEventsCounter = 0;
            print(nameDicePlayer + " thinks the cargo is enought and skip")
            //va a eval
            loop.every("event", function() { evalSixFiveFour(enemyStart,nameDicePlayer); }, masterTime);
        }


}
//display the results of each roll in a separate line of print
else{

    //print result
    print(nameDicePlayer + " gets " + resultDice + ((currentHand != '') ? ' and banks ' +  currentHand : '') )

    currentHand = "";
    symbolCurrentHand = "";

    if (run.multipleEventsCounter == 6){
        loop.stop("event");
        run.multipleEventsCounter = 0;
        
        //eval
        loop.every("event", function() { evalSixFiveFour(enemyStart,nameDicePlayer); }, masterTime);
    }
}
}






//eval the game, if is the first round, pass to the next player
function evalSixFiveFour(enemyStart, nameDicePlayer){
    //Evaluate the current round
    if (ship && captain && crew){print(nameDicePlayer + " set sail with " + cargo + " of cargo")}
    if (ship && captain && !crew){print(nameDicePlayer + " got a ship and captain but no the crew, does not set sail (" + cargo + ")")}
    if (ship && !captain && !crew){print(nameDicePlayer + " got a ship but neither captain nor crew were available, does not set sail (" + cargo + ")")}
    if (!ship && !captain && !crew){print(nameDicePlayer + " got nothing (" + cargo + ")")}


       //Start the second round
        if (countRounds == 1){
            cargoFirstPlayer = cargo;
            nameFirstPlayer = nameDicePlayer;
            countRounds++
            if (!enemyStart){nameDicePlayer = gamblingManName} else {nameDicePlayer = "<b>" + state.player.name + "</b> "}
            resetSixFiveFour()
            loop.stop("event");
            loop.every("event", function() { rollDicesForSixfivefour(!enemyStart,nameDicePlayer); }, masterTime);
        }else{
            //Final scoring call
            //multipleEventsCounter = 0;
            loop.stop("event");
            loop.every("event", function() { finalScoreSixFiveFour(nameDicePlayer); }, masterTime);
        }

    
     

}

/*
spell("spellCoins",true,frameWidth,frameHeight,currentFrame,shift);
setLocal("Gold", Number(getLocal("Gold")) - betForDice);
updateHeading();
*/

//calculate the final result and check the winner
function finalScoreSixFiveFour(nameDicePlayer){

    run.multipleEventsCounter += 1;
    switch (run.multipleEventsCounter){
        case 1:
            countRounds = 0
            tie = cargoFirstPlayer == cargo
            
            if (!tie){
                firstPlayerWins = cargoFirstPlayer > cargo;
                if(firstPlayerWins){
                    print(nameFirstPlayer + " wins " + ui.goldIcon + roundNumbertoLetter(betForDice * 2) + " (" + cargoFirstPlayer + " vs. " + cargo + ") ")
                    var winnerDice = nameFirstPlayer;
                }else{
                    print(nameDicePlayer + " wins " + ui.goldIcon + roundNumbertoLetter(betForDice * 2) + " (" + cargoFirstPlayer + " vs. " + cargo + ") ")
                    var winnerDice = nameDicePlayer;
                }

                if (winnerDice == gamblingManName){
                    playSound("coins");
                    spell("spellCoins",false,frameWidth,frameHeight,currentFrame,shift);
                }else{
                    playSound("coins");
                    spell("spellCoins",true,frameWidth,frameHeight,currentFrame,shift);
                    state.player.gold = state.player.gold + betForDice * 2;
                    updateHeading();
                }

            }else{
                print("Nobody won (" + cargoFirstPlayer + " vs. " + cargo + ")")
                //spell("spellCoins",true,frameWidth,frameHeight,currentFrame,shift);
                state.player.gold = state.player.gold + betForDice;
                updateHeading();
            }
        break;
        case 2:
            print("<b>" + state.player.name + "</b> exits the gaming house");
            cargoFirstPlayer = 0;
            resetSixFiveFour()
            npcCanvas.getContext("2d").clearRect(0, 0, npcCanvas.width, npcCanvas.height);
            state.npc = "";
            loadBackground(state.zone.current +  state.zone.stage);
            run.restAtInn = false;
            run.multipleEventsCounter = 0;
            loop.stop("event");
            loop.every("master", event, masterTime);
    }
}


//reset game
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
