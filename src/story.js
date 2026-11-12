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
//History

//declaration of chapter object, if text is NA, considere only a event and not a history.
const chapter = {
    lvl1:{
        text:'<span class="titles" id="historyTitle">Prologue</span>~~THE BEGINNING~~<br>',
        event: function(){
            //just history reserve the event
        }
    },
    lvl10:{
        text:'<span class="titles" id="historyTitle">Chapter I</span>~~~~<br>',
        event: function(){
            //just history reserve the event
        }
    },
    lvl30:{
        text:'<span class="titles" id="historyTitle">Chapter II</span>~~DEVOTION~~<br>',
        event: function(){
            //teleport al altar de la zona
            playSound("altar");
            count("altar");
            count("altar_zone_" + state.zone.current);
            //multiplicador de fe 
            state.player.faithMultiplier = 2
            if (Number(counterText("divineTouch")) + Number(counterText("DivineHeal")) + Number(counterText("DivineHit")) > 200){
                var text = "decides to devote himself to your consecration to retribute all your help";
            }else{
                var text = "decides to devote himself to your consecration to get more divine attention";
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
            //baja multiplicador de fe a la mitad, pero fe normal intacta
            console.log("evento2")
        }
    },
    lvl60:{
        text:'NA',
        event: function(){
            //print sobre nuevo staff encontrado
        }
    },
    lvl80:{
        text:'NA',
        event: function(){
            //print sobre break staff
        }
    },
    lvl90:{
        text:'<span class="titles" id="historyTitle">Chapter IV</span>',
        event: function(){
            //solo historia
            console.log("evento2")
        }
    },
    lvl100:{
        text:'NA',
        event: function(){
            //sacredDamageMultiplier agregar variable en localStorage para multiplciar daño x1.5
            //pierde fe cada que mata a alguien, esto agregar una flag, pero desarrollar eso en battleEV cuando muere enemy - "inPecado"
            //print control del staff sagrado
        }
    },
    lvl110:{
        text:'<span class="titles" id="historyTitle">Chapter V</span>',
        event: function(){
            //sacredDamageMultiplier variable de dañosagrado a 1 = sacredDamageMultiplier
            //quita flag de perder fe - "inPecado"
            console.log("evento2")
        }
    },
    lvl128:{
        text:'NA',
        event: function(){
            //aparece runa (crear nuevo evento con 4 pasos)
            //1 encuentra runa, ROJA, 
            //2 intenta estudiarla
            //3 encuentra una escritura 
            //4 cree que se trata de un mapa
            //Logro de runa roja
        }
    },
    lvl129:{
        text:'NA',
        event: function(){
            //print de teleport al volcan
            //teleport al volcal
            //no salir volcan,
            //reduce tiempo de selfrevive a 5 segundos e indicarlo en la consola, puede ser un clock cada 1.5s y al 5to ciclo, reviva.
            //Niega ayuda, agregar en divinetouch un print de negación cada toque
            //aumenta curación
        }
    },
    lvl130:{
        text:'<span class="titles" id="historyTitle">Chapter VI</span>',
        event: function(){
            //normaliza tiempo selfrevive aunque no se use por ahora
            //desbloquear otros eventos
            //ya no muere, cuando llegba a 0, se teletransporta y sana completamente
            //negación total, ninguna ayuda 
            //inPecado = "true" en localstorage
            //Daño sagrado x 3
            console.log("evento2")
        }
    },
    lvl139:{
        text:'NA',
        event: function(){
            //print de teleport a la torre
            //teleport a la torre
            //no salir de la torre,
            //aumenta ligeramente la probabilidad de encotnrar boss, agregar a addXP funcion de porcentaje y si falta 25% para subir de nivel, subir a 1 prob de que aparezca boss
            //crear condicional que luego de lvl139 no se seleccine boss en la torre
        }
    }, 
    lvl140:{
        text:'<span class="titles" id="historyTitle">Chapter VII</span>',
        event: function(){
            //bajar probabilidad de boss a la inicial
            //desbloquear otros eventos
            //hacer bandera para modificar enemigos en ciudad y torre que no aparezcan hechiceros
            console.log("evento2")
        }
    },
    lvl149:{
        text:'<span class="titles" id="historyTitle">Chapter VIII Part I</span>',
        event: function(){
            //viaja a la torre
            //elimina bandera que modifica enemigos en ciudad y torre
            //add bandera para nulificar la addXP de todos los enemigos
            //load npc especial, con hechicera7 y varios magos juntos atras
            //spell de maldición sobre PJ evita que se cure
            //allowHeal * 0 para bajar la probabilidad de que se cure
            //inicia linchamiento (agregar bandera). forzar solo batallas y cambios de escenario pero sin botines
            //agregar idx en linchamiento
            //agregar condicional de muerte y llamar chapter especial specialDeathLvl149
                //no salga calavera muerte es pausa y carga especial chapter
            console.log("evento2")
        }
    },
    specialDeathLvl149:{
        text:'<span class="titles" id="historyTitle">Chapter VIII Part II</span>',
        event: function(){
            //load npc dos sagrados
            //denegateDivineHelp = 0
            //desbloquear otros eventos
                //incluido entrar altares
                    //aplicar modificción, si fe > 0, no gana suma. Puede ser un letreo, cada que consiga fe, en el updateHeading, PJ siente como es ignorado (-FE)
                    // si fe < 0 va sumando 
            //reduce tiempo de selfrevive a 5 segundos e indicarlo en la consola, puede ser un clock cada 1.5s y al 5to ciclo, reviva. Poner textos como sabe que esta abandonado y no espera que le ayuden. Pero se puede revivir con toque divino si uno quiere
            //subir a lvl150
            //logro, linchado
            console.log("evento2")
        }
    },
    lvl60:{
        text:'<span class="titles" id="historyTitle">Chapter IX</span>',
        event: function(){
            //vuevle a ganar fe si es mayor a 0
            console.log("evento2")
        }
    },
    lvl90:{
        text:'<span class="titles" id="historyTitle">Chapter X</span>',
        event: function(){
            //ya no muere, cuando llegba a 0, se teletransporta y sana completamente
            //negación total, ninguna ayuda denegateDivineHelp
            //
            console.log("evento2")
        }
    },
    lvl99:{
        text:'NA',
        event: function(){
            //telepor a heidan
            //print que va a heidan
            //no sale de heidan
            console.log("evento2")
        }
    },
    lv200:{
        text:'<span class="titles" id="historyTitle">Chapter XI</span>',
        event: function(){
            //daño sagrado 3x
            //no entra a altares
            //eliminar fe icon y valores
            //barra xp se pone DarkRed llena
            //addXP no funciona, ningun elemento sube xp
            //add nuevo evento de aparecer curandero
                //curandero con sangre igual a la del wizard
                //ataques del curandero entre el 0.5 y 1 del wizard
            //add evento de batalla del curandero con prob
            //si mata el curandero add desenso y batalla con uno.
            console.log("evento2")
        }
    },
    specialEnd:{
        text:'<span class="titles" id="historyTitle">Epilogue</span>',
        event: function(){
            //pause end of game and final history.
            //add flag para que en reload no aparezca nada, que en vez cambie randomly de paisaje
            //en Kill, cambiar el texto y colocar boton que diga Game Over
            console.log("evento2")
        }
    },
}


//Open scroll for history closing if opened only ishas history, if not only event is triggered
function openHistory(){
    //execute the action for each lvl
    run.afterChapterExe = true;//activate post chapter event
    chapter["lvl" + state.player.lvl].event()

    //if has writen history display it
    if (chapter["lvl" + state.player.lvl].text != "NA"){
        if (parseInt(el("scrollBackCenter").style.minHeight) > 0) {
            scrollClose()
            el("scrollBackCenter").addEventListener("transitionend", updateHistory);
        } else{
            updateHistory();
        }
    } 
}

//update content of history scroll
function updateHistory(){
   el("scrollBackCenter").removeEventListener("transitionend", updateHistory)
   pauseToggle();
   el('innerTextScroll').innerHTML= chapter["lvl" + state.player.lvl].text;
   el("innerTextScroll").style.display = "block";
   el("historyTitle").style.fontSize = ui.em * 2.5 + "px";
   el("historyTitle").style.lineHeight = ui.em * 2.5 + "px";
   scrollOpen("history");
}


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
