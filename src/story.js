// Wizard Idle v2 - The story: chapters unlocked by level, the history scroll and the events that follow a chapter.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { getRandomInt } from './utils.js';
import { count, state } from './state.js';
import { run, ui } from './runtime.js';
import { pauseToggle } from './game.js';
import { playSound } from './audio.js';
import { loadBackground, loadCanvasChar, loadNPC, npcCanvas, print, showStage, wizardName } from './ui/render.js';
import { counterText, scrollClose, scrollOpen } from './ui/scrolls.js';
import { el } from './ui/dom.js';

//////////////////////////////////////////////////////////
//██╗  ██╗██╗███████╗████████╗ ██████╗ ██████╗ ██╗   ██╗//
//██║  ██║██║██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗╚██╗ ██╔╝//
//███████║██║███████╗   ██║   ██║   ██║██████╔╝ ╚████╔╝ //
//██╔══██║██║╚════██║   ██║   ██║   ██║██╔══██╗  ╚██╔╝  //
//██║  ██║██║███████║   ██║   ╚██████╔╝██║  ██║   ██║   //
//╚═╝  ╚═╝╚═╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝   //
//////////////////////////////////////////////////////////                                                      
// The story: one entry per level that has a chapter or a story event.

// text "NA" means the level only runs an event, without showing a chapter scroll.
const chapter = {
    lvl1:{
        text:'<span class="titles" id="historyTitle">Prologue</span>~~THE BEGINNING~~<br>',
        event: function(){
            // story text only, no event
        }
    },
    lvl10:{
        text:'<span class="titles" id="historyTitle">Chapter I</span>~~~~<br>',
        event: function(){
            // story text only, no event
        }
    },
    lvl30:{
        text:'<span class="titles" id="historyTitle">Chapter II</span>~~DEVOTION~~<br>',
        event: function(){
            // teleport to the zone's altar
            playSound("altar");
            count("altar");
            count("altar_zone_" + state.zone.current);
            // faith multiplier
            state.player.faithMultiplier = 2
            let text;
            if (Number(counterText("divineTouch")) + Number(counterText("DivineHeal")) + Number(counterText("DivineHit")) > 200){
                text = "decides to devote himself to your consecration to retribute all your help";
            }else{
                text = "decides to devote himself to your consecration to get more divine attention";
            }
            print(wizardName() + " " + text + ", and obtain a Divine crosier")
            loadBackground(state.zone.current + "_altar");
            const mistico = "mistico" + getRandomInt(1,3);
            loadNPC(mistico);
            loadCanvasChar(state.player.lvl, ui.squareSide, ui.headLevel);
        }
    },
    lvl50:{
        text:'<span class="titles" id="historyTitle">Chapter III</span>',
        event: function(){
            // halve the faith multiplier, but keep the current faith
            console.log("evento2")
        }
    },
    lvl60:{
        text:'NA',
        event: function(){
            // message: a new staff is found
        }
    },
    lvl80:{
        text:'NA',
        event: function(){
            // message: the staff breaks
        }
    },
    lvl90:{
        text:'<span class="titles" id="historyTitle">Chapter IV</span>',
        event: function(){
            // story text only
            console.log("evento2")
        }
    },
    lvl100:{
        text:'NA',
        event: function(){
            // sacredDamageMultiplier: a saved value that multiplies damage x1.5
            // loses faith with every kill: a flag ("inPecado", now state.player.inSin) checked in battle() when an enemy dies
            // message: he controls the sacred staff
        }
    },
    lvl110:{
        text:'<span class="titles" id="historyTitle">Chapter V</span>',
        event: function(){
            // sacred damage multiplier back to 1
            // remove the lose-faith flag ("inPecado" / inSin)
            console.log("evento2")
        }
    },
    lvl128:{
        text:'NA',
        event: function(){
            // a rune appears (new event with 4 steps)
            // 1 finds a RED rune
            // 2 tries to study it
            // 3 finds some writing
            // 4 believes it is a map
            // red rune achievement
        }
    },
    lvl129:{
        text:'NA',
        event: function(){
            // message: teleport to the volcano
            // teleport to the volcano
            // can't leave the volcano
            // self-revive in 5 seconds, shown in the console (e.g. a clock every 1.5 s that revives on the 5th tick)
            // refuses help: every divine touch prints a refusal
            // heals more
        }
    },
    lvl130:{
        text:'<span class="titles" id="historyTitle">Chapter VI</span>',
        event: function(){
            // self-revive time back to normal (even if unused for now)
            // unlock the other events
            // no longer dies: at 0 HP he teleports away and heals completely
            // total refusal, no help at all
            // inPecado = true (now state.player.inSin)
            // sacred damage x3
            console.log("evento2")
        }
    },
    lvl139:{
        text:'NA',
        event: function(){
            // message: teleport to the tower
            // teleport to the tower
            // can't leave the tower
            // slightly raise the boss chance; in addXP, when less than 25% is left to level up, make the boss certain
            // after level 139 the tower boss is no longer picked
        }
    }, 
    lvl140:{
        text:'<span class="titles" id="historyTitle">Chapter VII</span>',
        event: function(){
            // boss chance back to the initial value
            // unlock the other events
            // flag so no wizards appear among the enemies in the city and the tower
            console.log("evento2")
        }
    },
    lvl149:{
        text:'<span class="titles" id="historyTitle">Chapter VIII Part I</span>',
        event: function(){
            // travels to the tower
            // remove the flag that changes the city and tower enemies
            // flag that cancels addXP from every enemy
            // special npc: la_hechicera7 with several wizards behind her
            // curse spell on the wizard: he can't heal
            // allowHeal * 0 to remove the chance of healing
            // the lynching starts (flag): only battles and scene changes, no loot
            // count the lynching in the stats
            // on death, call the special chapter specialDeathLvl149
                // no skull: death pauses the game and loads the special chapter
            console.log("evento2")
        }
    },
    specialDeathLvl149:{
        text:'<span class="titles" id="historyTitle">Chapter VIII Part II</span>',
        event: function(){
            // npc: the two sacred ones
            // denegateDivineHelp = 0
            // unlock the other events
                // including entering altars
                    // while faith > 0, gains add nothing; each time he would gain faith, a message says he feels ignored (-FE)
                    // while faith < 0, gains add up
            // self-revive in 5 seconds, shown in the console (a clock every 1.5 s, revive on the 5th tick); messages say he knows he's abandoned and expects no help, but a divine touch can still revive him
            // level up to 150
            // achievement: lynched
            console.log("evento2")
        }
    },
    lvl60:{
        text:'<span class="titles" id="historyTitle">Chapter IX</span>',
        event: function(){
            // gains faith again while it is above 0
            console.log("evento2")
        }
    },
    lvl90:{
        text:'<span class="titles" id="historyTitle">Chapter X</span>',
        event: function(){
            // no longer dies: at 0 HP he teleports away and heals completely
            // total refusal, no help (denegateDivineHelp)
            //
            console.log("evento2")
        }
    },
    lvl99:{
        text:'NA',
        event: function(){
            // teleport to Heidan
            // message: he goes to Heidan
            // can't leave Heidan
            console.log("evento2")
        }
    },
    lv200:{
        text:'<span class="titles" id="historyTitle">Chapter XI</span>',
        event: function(){
            // sacred damage x3
            // no longer enters altars
            // remove the faith icon and values
            // the XP bar turns full and dark red
            // addXP stops working, nothing gives XP
            // new event: the healer appears
                // the healer has as much HP as the wizard
                // the healer's attacks between 0.5x and 1x the wizard's
            // the healer battle happens with some probability
            // if he kills the healer, the god descends and fights him
            console.log("evento2")
        }
    },
    specialEnd:{
        text:'<span class="titles" id="historyTitle">Epilogue</span>',
        event: function(){
            // pause: end of the game and final story
            // flag so after a reload nothing happens: only random scene changes
            // in the kill scroll, change the text and show a "Game Over" button
            console.log("evento2")
        }
    },
}


// A chapter was reached: run its event and, if it has text, show it in the scroll.
function openHistory(){
    // run the chapter's event
    run.afterChapterExe = true;//activate post chapter event
    chapter["lvl" + state.player.lvl].event()

    // show the scroll if the chapter has text
    if (chapter["lvl" + state.player.lvl].text != "NA"){
        if (parseInt(el("scrollBackCenter").style.minHeight) > 0) {
            scrollClose()
            el("scrollBackCenter").addEventListener("transitionend", updateHistory);
        } else{
            updateHistory();
        }
    } 
}

// Write the current chapter's text into the scroll once it has opened.
function updateHistory(){
   el("scrollBackCenter").removeEventListener("transitionend", updateHistory)
   pauseToggle();
   el('innerTextScroll').innerHTML= chapter["lvl" + state.player.lvl].text;
   el("innerTextScroll").style.display = "block";
   el("historyTitle").style.fontSize = ui.em * 2.5 + "px";
   el("historyTitle").style.lineHeight = ui.em * 2.5 + "px";
   scrollOpen("history");
}


// Clean up after a chapter's event when the next event starts (e.g. leave the altar after chapter II).
function afterChapter(){
    run.afterChapterExe = false;
    const lvl = state.player.lvl;
    switch(lvl){
        case 30:
        npcCanvas.getContext("2d").clearRect(0, 0, npcCanvas.width, npcCanvas.height);
        state.npc = "";
        showStage();
        print(wizardName() + " leaves the shrine and continues the journey");
        break;       
        case 50:

    }
    
}

export {
    afterChapter,
    chapter,
    openHistory,
};
