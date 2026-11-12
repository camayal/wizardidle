// Wizard Idle v2 - Sound effects.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { ui } from './runtime.js';
import { masterTime } from './config.js';

    
// Play ogg/<name>.ogg once. Browsers may block sound until the player interacts; that is ignored.
function playSound(ogg, volume = 0.3){
    
    //avoid sound in speed debug
    if(masterTime < 500){return}

    ui.audio = new Audio("ogg/" + ogg + ".ogg");
    ui.audio.volume = volume;
    const promise = ui.audio.play();
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
