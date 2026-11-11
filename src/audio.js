// Wizard Idle v2 - Sound effects.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { ui } from './runtime.js';
import { masterTime } from './config.js';

    
//retorno a la anterior para evitar bug en background
function playSound(ogg, volume = 0.3){
    
    //avoid sound in speed debug
    if(masterTime < 500){return}

    ui.audio = new Audio("ogg/" + ogg + ".ogg");
    //audio.volume = 0.3;
    ui.audio.volume = volume;
    //audio.playbackRate = -1.0; 
    //if (loop){audio.loop = true}
    var promise = ui.audio.play();
    //avoid autoplay policy error
    if (promise !== undefined) {
        promise.then(_ => {
          // Autoplay started!
        }).catch(error => {
          // Autoplay was prevented.
          // Show a "Play" button so that user can start playback.
        });
      }
}

export {
    playSound,
};
