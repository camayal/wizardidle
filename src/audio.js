// Wizard Idle v2 - Sound effects.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { run, ui } from './runtime.js';
import { snd } from './media.js';
import { volumeScale } from './prefs.js';

    
// Play a sound once by its name (its folder: src/media.js). Browsers may block sound until the player interacts; that is ignored.
function playSound(ogg, volume = 0.3){
    if (run.simulation || run.muted) return;

    ui.audio = new Audio(snd(ogg));
    ui.audio.volume = Math.min(1, volume * volumeScale());
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

// Play a sound some ms after now: the moment of a move (its swing, its roar), not its landing.
// Nothing plays if the page is hidden or the game is simulated, like the animations.
function playSoundAt(ogg, delayMs, volume = 0.3){
    if (run.simulation) return;
    if (delayMs <= 0) return playSound(ogg, volume);
    setTimeout(() => playSound(ogg, volume), delayMs);
}

export {
    playSound,
    playSoundAt,
};
