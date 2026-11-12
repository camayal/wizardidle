// Wizard Idle v2 - The parchment scroll and its pages: stats, achievements, help, kill, and the map bubble.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { enemyTypes } from '../data/enemies.js';
import { places, zones } from '../data/zones.js';
import { capitalize, roundNumbertoLetter, secsToHours } from '../utils.js';
import { stat, state, world } from '../state.js';
import { run, ui } from '../runtime.js';
import * as loop from '../loop.js';
import { version } from '../game.js';
import { statueObj } from '../events.js';
import { statObj } from '../wizard.js';
import { achievementList, countLogros, logro } from '../achievements.js';
import { countSpellKnown } from '../spells.js';
import { playSound } from '../audio.js';
import { detectmob, layoutPortrait } from './layout.js';
import { realKill } from './menu.js';
import { el } from './dom.js';

let scrollIDContent;


//Stats page helpers (v1 scanned every localStorage key for these)

// A counter formatted for the stats page, or 0 if it never happened (v1: check("idx_..."))
function counterText(name){
    return state.counters[name] ? roundNumbertoLetter(state.counters[name]) : 0;
}

// "Golem (3), Slime (5)" for every counter starting with prefix, e.g. "enemy_".
// Names come from enemies/zones, or from statObj/statueObj when inObj says so.
function counterList(prefix, inObj = ""){
    let out = "";
    for (const [key, value] of Object.entries(state.counters)){
        if (!key.startsWith(prefix)) continue;
        const text = key.slice(prefix.length);
        const entry = inObj == "" ? (enemyTypes[text] || zones[text]) : { statObj, statueObj }[inObj][text];
        out += capitalize(entry.name) + " (" + value + "), ";
    }
    return out.slice(0,-2);
}




//hide content from scroll
function hideScrollContent(){
    loop.stop("stats");
    enableMainButtons()
    el("scrollBackDown").style.opacity = 0;
    el("scrollBackUp").style.opacity = 0;
    el("mapa").style.display = "none"
    el("innerTextScroll").style.display = "none"
    el('innerTextScroll').innerHTML='';
    el("scroll").style.zIndex = 0;
    el("scrollBackCenter").removeEventListener("transitionend", hideScrollContent)
	
	
	//switch positions scene and console
	ui.sceneOnTop = true;
	layoutPortrait()
}
  
// scroll close 
function scrollClose(){
    ui.scrollCurrentContent = "";
    playSound("scroll");
    el("btnClose").style.display = "none";
    el("btnClose").style.top = ui.objectSize * 0.065 + "px";
    const content = el("scrollText");
    const scrollBack = el("scrollBackCenter");
    const sbd =  el("scrollBackDown");

    scrollBack.style.minHeight = 0 + "px";
    content.style.minHeight = 0 + "px";
    sbd.style.top = ui.objectSize * 0.02 + "px";

    //crate a event that listen the css transition, and after that remove the listener in hideScrollContent
    scrollBack.addEventListener("transitionend", hideScrollContent);
	
  }

//show the close button only when the scroll is totally opened
function showCloseButton(){
    el("btnClose").style.display = "block";
    el("scrollBackCenter").removeEventListener("transitionend", showCloseButton)
}

// scroll open
function scrollOpen(currentContent,height = (window.innerHeight - (ui.objectSize * 0.25) * 1.5)){
    ui.scrollCurrentContent = currentContent;
    playSound("scroll");
    const content = el("scrollText");
    const scrollBack = el("scrollBackCenter");

    const orientation = screen.msOrientation || (screen.orientation || screen.mozOrientation || {}).type;
    if (!!orientation.match("landscape") && detectmob()){
        height = window.innerHeight * 0.92;
    }

    disableMainButtons()
    el("scrollBackUp").style.opacity = 1;
    const sbd =  el("scrollBackDown");
    sbd.style.top = ui.objectSize * 0.02 + "px";
    //sbd.style.visibility = "visible";
    sbd.style.opacity = 1;


    el("scroll").style.zIndex = 150;
    scrollBack.style.minHeight = height * 0.97 + "px";
    content.style.minHeight = height * 0.92 + "px";
    sbd.style.top = height * 0.97 + "px";

    scrollBack.addEventListener("transitionend", showCloseButton);
	
		//switch positions scene and console
	ui.sceneOnTop = false;
	layoutPortrait()
  }


//Put the bocadillo in the right place in the map
function localizarBocadillo(){
    if (ui.currentBackGround == "curanderobg"){
        el("bocadilloMapa").style.display ="none";
        el("pjMapa").style.display ="none";
    }else{
        if(state.zone.current == "la_Mina" || state.zone.current == "la_Cueva" || state.zone.current == "el_Volcan"){
            el("backMapa").src = "img/mapaunderground.png";
        }else{
            el("backMapa").src = "img/mapa.png";
        }
        if(!ui.currentBackGround.match(/_altar/) && !ui.currentBackGround.match(/_estatua/)){
        const localidad = places[ui.currentBackGround];
        el("zoneMap").innerHTML= "The " + zones[state.zone.current].name;
        const mapWidth = el("backMapa").style.width;
        el("bocadilloMapa").style.display ="block";
        el("pjMapa").style.display ="block";
        el("bocadilloMapa").style.left = parseInt(mapWidth) * localidad.x + "px";
        el("bocadilloMapa").style.top = parseInt(mapWidth) * localidad.y + "px";
        el("pjMapa").style.left = parseInt(mapWidth) * localidad.x * 1.01 + "px";
        el("pjMapa").style.top = parseInt(mapWidth) * localidad.y * 0.98 + "px";
        }else{
            el("bocadilloMapa").style.display ="none";
            el("pjMapa").style.display ="none";
        }
    }
    
}

// //start counting seconds of live of each wizard
// window.addEventListener('load', function(event) {
//     timeStart = performance.now()
//     //avoid back key in android go works and exit the app
//     window.history.pushState({ noBackExitsApp: true }, '')
//   });

//avoid back button in android exit app
// window.addEventListener('popstate', function(event) {
    // if (event.state && event.state.noBackExitsApp) {
    //   window.history.pushState({ noBackExitsApp: true }, '')
    // }
//   })



// v1 registered an offline-cache service worker here. v2 ships a self-removing
// service-worker.js instead (so nobody gets stuck on cached v1 files); a proper
// offline cache comes back before the 2.0.0 release.




//avoid clic when scroll is open
  function disableMainButtons() {
    const eles = document.getElementsByClassName('dis');
    for (let i=0; i < eles.length; i++) {
      eles[i].prev_click = eles[i].onclick; // save the previous value
      eles[i].onclick = false;
    }
}

function enableMainButtons() {
    const eles = document.getElementsByClassName('dis');
    for (let i=0; i < eles.length; i++)
       eles[i].onclick = eles[i].prev_click;  // restore the previous value
    };

// Cemetery lines as v1 wrote them: "Name (lvl: 12) died at the age of 23. May 3, 2026 - May 9, 2026"
function cemeteryText(){
    const dateOptions = {year: 'numeric', month: 'long', day: 'numeric'};
    return world.cemetery.map(function(w){
        return w.name + " (lvl: " + roundNumbertoLetter(w.lvl) + ") died at the age of " + roundNumbertoLetter(w.age) + ". " +
            new Date(w.born).toLocaleDateString("en", dateOptions) + " - " + new Date(w.died).toLocaleDateString("en", dateOptions) + "<br>";
    }).join("");
}


////////////////////////////////////////////////
//  ████████╗███████╗██╗  ██╗████████╗███████╗//
//  ╚══██╔══╝██╔════╝╚██╗██╔╝╚══██╔══╝██╔════╝//
//     ██║   █████╗   ╚███╔╝    ██║   ███████╗//
//     ██║   ██╔══╝   ██╔██╗    ██║   ╚════██║//
//     ██║   ███████╗██╔╝ ██╗   ██║   ███████║//
//     ╚═╝   ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝//
////////////////////////////////////////////////
//Texts
function updateAchievements(){

    let txt = "<div id='achievements'><span class='titles' id='titleAchievements'>Achievements</span><br>"
    txt += achievementList();
    //txt += '<div class="divTableRow"><div class="divTableCell"><img src="img/no_logro.png" height="' + em * 4 + 'px" /></div><div class="divTableCell"><strong>?????????????</strong> <br></div></div>';
    txt += "</div>"
    el('innerTextScroll').innerHTML=txt;
    el("titleAchievements").style.fontSize = ui.em * 2.5 + "px";
    el("titleAchievements").style.lineHeight = ui.em * 2.5 + "px";  

}

function updateStats(){

    const secondsIngameInstats = ((state.meta.playTimeMs + (performance.now() - run.timeStart))/1000).toFixed(0);
    const numLogrosGanados = countLogros();
    ui.statsPage = "<div id='stats'><span class='titles' id='titleStats'>Stats</span><br>" + 
    "<span class='subtitles'>Wizard</span><br>" + 
    "Name: " + (state.player.name) + "<br>" +
    "Level: " + roundNumbertoLetter(state.player.lvl) + "<br>" +
    "Age: " + roundNumbertoLetter(state.player.age) + " yrs<br>" +
    "Health points: " + roundNumbertoLetter(state.player.hpBase) + "<br>" + 
    "Attack points: " + roundNumbertoLetter(state.player.attack) + "<br>" + 
    "Critic multiplier: " + roundNumbertoLetter(stat("fCritic")) + "<br>" + 
    "Exp. to next level: " + Math.round((state.player.xpNext - state.player.xp) * 100) + "<br>" + 
    "Time of existence: " + /*roundNumbertoLetter(secondsIngameInstats) + "~" +*/ secsToHours(secondsIngameInstats) + "<br>" +
    "<br><span class='subtitles'>Battles</span><br>" + 
    "Attacks: " + counterText("Attacks") + "<br>" + 
    "Critic attacks: " + counterText("Critics") + "<br>" + 
    "Melee attacks: " + counterText("school_Physical") + "<br>" + 
    "Magical attacks: " + (Number(counterText("Attacks")) - Number(counterText("school_Physical")))  + "<br>" + 
    "Attacks received: " + counterText("IncomingAttacks") + "<br>" + 
    "Enemy encounters: " + counterText("enemyEncounters") + "<br>" + 
    "Enemies defeated: " + counterText("EnemiesKilled") + "<br>" + 
    "Rare encounters: " + counterText("rareEnemyEncounters") + "<br>" + 
    "Rare defeated: " + counterText("rareEnemiesKilled") + "<br>" + 
    (counterText("enemyEncounters") > 0 ? "Types of enemies found: " + counterList("enemy_") + "<br>" : "") + 
    //"Bosses found: " + check("idx_Bosses") + "<br>" + 
    "Bosses found: " + counterText("Bosses") + (counterText("Bosses") > 0 ? " {" + counterList("typeBoss_") + "}": "") + "<br>" + 
    "Bosses defeated: " + counterText("BossesKilled") + "<br>" +
    (state.hydraMysteryResolved &&  counterText("Hydras") > 0 ?  "Hydras found: " + counterText("Hydras") + " {" + counterList("typeofHydras_") + "}<br>": "") +
    (state.hydraMysteryResolved &&  counterText("Hydras") > 0 ?  "Hydras defeated: " + counterText("HydrasKilled") + "<br>" : "") +
    (state.hydraMysteryResolved &&  counterText("Hydras") > 0 ?  "Hydras heads chopped off: " + counterText("HydrasHeadCut") + "<br>" : "") +
    "Falls: " + counterText("Deaths") + "<br>" + 
    "Current flawless victory: " + counterText("Combo") + "<br>" + 
    "Longest flawless victory: " + counterText("longestCombo") + "<br>" + 
    "<br><span class='subtitles'>Magic</span><br>" + 
    "Current magical level: " + Math.floor(state.player.lvl / 10) + "<br>" + 
    "Known spells: " + countSpellKnown() + "<br>" + 
    "Arcane spells cast: " + counterText("school_Arcane") + "<br>" + 
    "Healing spells cast: " + counterText("Heal") + "<br>" + 
    "Nature spells cast: " + counterText("school_Nature") + "<br>" + 
    "Fire spells cast: " + counterText("school_Fire") + "<br>" + 
    "Frost spells cast: " + counterText("school_Frost") + "<br>" + 
    "Thunder spells cast: " + counterText("school_Thunder") + "<br>" + 
    "Shadow spells cast: " + counterText("school_Shadow") + "<br>" + 
    "Divine spells cast: " + counterText("school_Divine") + "<br>" + 
    "Enemies polymorphed into a sheep: " + counterText("Polymorph_oveja") + "<br>" + 
    "Enemies polymorphed into a chicken: " + counterText("Polymorph_gallina") + "<br>" + 
    "<br><span class='subtitles'>Study</span><br>" + 
    "Books found: " + counterText("book") + "<br>" + 
    "Runes found: " + counterText("rune") + "<br>" + 
    "Successful studies: " + counterText("sucessStudy") + "<br>" + 
    "Failed studies: " + counterText("failStudy") + "<br>" + 
    "Successful statue studies: " + counterText("sucessStudyStatue") + "<br>" + 
    "Failed statue studies: " + counterText("failStudyStatue") + "<br>" + 
    (counterText("sucessStudyStatue") > 0 ?  "Skills increased studying books or runes: " + counterList("study_", "statObj") + "<br>" : "") + 
    "<br><span class='subtitles'>Exploration</span><br>" + 
    "Current zone: " + "The " + zones[state.zone.current].name + "<br>" + 
    "Last zone: " + "The " + zones[state.zone.last].name + "<br>" + 
    "Changes of zones: " + counterText("zonesChanged") + "<br>" + 
    "Times in the Prairie: " + counterText("zone_la_Pradera") + "<br>" + 
    "Times in the City: " + counterText("zone_la_Ciudad") + "<br>" + 
    "Times in the Castle: " + counterText("zone_el_Castillo") + "<br>" + 
    "Times in the Town: " + counterText("zone_el_Poblado") + "<br>" + 
    "Times in the Cave: " + counterText("zone_la_Cueva") + "<br>" + 
    "Times in the Grotto: " + counterText("zone_la_Gruta") + "<br>" + 
    "Times in the Tower: " + counterText("zone_la_Torre") + "<br>" + 
    "Times in the Forest: " + counterText("zone_el_Bosque") + "<br>" + 
    "Times in the Swamp: " + counterText("zone_el_Pantano") + "<br>" + 
    "Times in the Dunes: " + counterText("zone_las_Dunas") + "<br>" + 
    "Times in the Tundra: " + counterText("zone_la_Tundra") + "<br>" + 
    "Times in the Volcano: " + counterText("zone_el_Volcan") + "<br>" + 
    "Times in the Desert: " + counterText("zone_el_Desierto") + "<br>" + 
    "Times in the Heidan: " + counterText("zone_el_Heidan") + "<br>" + 
    "Times in the Duenon: " + counterText("zone_el_Duenon") + "<br>" + 
    "Times in the Mine: " + counterText("zone_la_Mina") + "<br>" + 
    "Bags found: " + counterText("BotinGot_bag") + "<br>" + 
    "Chests found: " + counterText("BotinGot_chest") + "<br>" + 
    "Pots found: " + counterText("BotinGot_pot") + "<br>" + 
    "Barrels found: " + counterText("BotinGot_barrel") + "<br>" + 
    "Boxes found: " + counterText("BotinGot_box") + "<br>" + 
    "Total statues found: " + counterText("statuesFound") + "<br>" + 
    (counterText("statuesFound") > 0 ? "Type of statues found: " + counterList("estatuas_", "statueObj") + "<br>" : "") + 
    "<br><span class='subtitles'>Economy</span><br>" + 
    "Current gold: " + roundNumbertoLetter(state.player.gold) + "<br>" + 
    "Total gold looted: " + counterText("GoldFromEnemies") + "<br>" + 
    "Total gold looted from bosses: " + counterText("GoldFromBosses") + "<br>" + 
    "Total gold found: " + counterText("GoldFromBotin") + "<br>" + 
    "Total gold lost in battles: " + counterText("goldLostInBattle") + "<br>" + 
    "Gold found in bags: " + counterText("GoldFromBotin_bag") + "<br>" + 
    "Gold found in chests: " + counterText("GoldFromBotin_chest") + "<br>" + 
    "Gold found in pots: " + counterText("GoldFromBotin_pot") + "<br>" + 
    "Gold found in barrels: " + counterText("GoldFromBotin_barrel") + "<br>" + 
    "Gold found in boxes: " + counterText("GoldFromBotin_box") + "<br>" + 
    "<br><span class='subtitles'>Leisure</span><br>" + 
    "Rests in inns: " + counterText("taberna") + "<br>" + 
    "Gold spend at inns: " + counterText("GoldSpendInn") + "<br>" + 
    "Campings: " + counterText("camping") + "<br>" + 
    "<br><span class='subtitles'>Spirituality</span><br>" + 
    "Faith: " + roundNumbertoLetter(state.player.faith) + "<br>" + 
    "Offers: " + counterText("offers") + "<br>" + 
    "Tithe: " + counterText("GoldOffered") + "<br>" + 
    "Faith obtained by gold: " + counterText("FeByGold") + "<br>" + 
    "Faith obtained by pray: " + counterText("FeByPray") + "<br>" + 
    "Faith obtained by corruption eradication: " + counterText("FeByCleanCorruption") + "<br>" + 
    "Shrines visited: " + counterText("altar") + "<br>" + 
    (counterText("altar") > 0 ? "Shrines visited in: " + counterList("altar_zone_") + "<br>" : "") + 
    "Mandatory offers: " + counterText("DivineMandatoryOffers") + "<br>" + 
    "Negations: " + counterText("negar") + "<br>" + 
    "Self recovery: " + counterText("selfRevive")  + "<br>" + 
    "Recovered by healer: " + counterText("hospital") + "<br>" + 
    "Divine touches: " + counterText("divineTouch") + "<br>" + 
    "Divine healings: " + counterText("DivineHeal") + "<br>" + 
    "Divine punishments to enemies: " + counterText("DivineHit") + "<br>" + 
    "<br><span class='subtitles'>Achievements</span><br>" + 
    "Currenly won: " + numLogrosGanados + "<br>" + 
    "Completion: " + Math.round((numLogrosGanados / Object.keys(logro).filter((key) => logro[key].name && !logro[key].planned).length) * 100) + "%<br>" + 
    "</div>";   
    el('innerTextScroll').innerHTML= ui.statsPage;  
    el("stats").style.fontSize = ui.em + "px";
    el("stats").style.lineHeight = ui.em + "px";
    el("titleStats").style.fontSize = ui.em * 2.5 + "px";
    el("titleStats").style.lineHeight = ui.em * 2.5 + "px";    

}

function updateHelp(){
    const frequentQuestions = '<b>Why everyone has a name?</b> - All individuals of sentient species have one (Pybryas are very smart!)<br>' +
    '<b>Why the wizard knows all the names?</b> - The console is not what the wizard sees, is what you sees, and you are an omniscient god that know all the names<br>' +
    '<b>Why everyone is so hostile?</b> - It is a very conflictive world and the interspecific hate is very accepted<br>' +
    '<b>Why other humans attack my wizard</b> - He is a heretic in the eyes of the King Midas<br>' +
    '<b></b> - <br>' +
    '<b></b> - <br>' +
    '<b></b> - <br>' +
    '<b></b> - <br>' +
    '<b></b> - <br>' +
    '<b></b> - <br>';

    const txt = '<div id="help"><span class="titles" id="titleHelp">Help</span><br>' +
   '<div class="faq">WizardIDLE, what is this?</div><div class="a">It is a game with typical elements of a common RPG game, the only difference is the player role. You are the god of the wizard and your interaction is limited due his free will. With or withour your help the wizard can reach to his fate being a deep believer or a hardened atheist.</div>' +
   '<div class="faq">About the Gameplay</div><div class="a">This is an idle game, a true idle game, you must do nothing. The wizard can perform all actions without your help. This is a different way to play, watching what other beings do without your control but some interference (you can interact with miracles). <b><i>This is a god like game</i></b>.</div>' +
   '<div class="faq">Graphical layout</div><div class="a">The screen is divided in three main parts. From top to bottom:<br> <b>The control</b>, this is an informational panel with the name, experience bar, level, heal points, gold and faith points. In this panel you can found the buttons to access other information displayed in <b>The scroll</b>.<br><b>The console</b>, where is printed all actions performed by the wizard.<br><b>The scene</b>, this is the graphical version of the console, <i>you can click or touch to intect</i> with the wizard, non-player caracters or environments. </div>' +
   '<div class="faq">Icons explanation</div><div class="a">' +
        '<div class="divTableRow"><div class="divTableCell"><img src="img/boss.png" height="' + ui.em + 'px" /></div><div class="divTableCell">Boss, this encounter is harder than others, the reward is multiplied too.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img src="img/attack.png" height="' + ui.em + 'px" /></div><div class="divTableCell">Attack, followed by the amount of damage against the wizard or the enemy.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img src="img/heart.png" height="' + ui.em + 'px" /></div><div class="divTableCell">Wizard health, can be found in five states depending of the percentage (100%, 75%, 50%, 10%, and 0%).</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img style="filter: hue-rotate(45deg)" src="img/heart.png" height="' + ui.em + 'px" /></div><div class="divTableCell">Enemy health, as well wizard health, it can be found in five states.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img src="img/achivement.png" height="' + ui.em + 'px" /></div><div class="divTableCell">Achivement, just won a achivement.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img src="img/gold.png" height="' + ui.em + 'px" /></div><div class="divTableCell">Gold, represent the currency in the game.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img src="img/heal.png" height="' + ui.em + 'px" /></div><div class="divTableCell">Healing, followed by amount of health recovered.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img src="img/spirit.png" height="' + ui.em + 'px" /></div><div class="divTableCell">Faith, divine currency in the game, divine touches and other stuff cost faith instead gold.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><span style="font-size:' + ui.em * 1.5 + 'px">!</span></div><div class="divTableCell">Showed near the bottom-right corner, new content or update is available in the server. Reload the game to download the new content for offline access.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><span style="font-size:' + ui.em * 1.5 + 'px">...</span></div><div class="divTableCell">Showed near the bottom-right corner, searching for new content or updates.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><span style="font-size:' + ui.em * 1.5 + 'px">.</span></div><div class="divTableCell">Showed near the bottom-right corner, the game can run but some problem with the offline functions happens. No enough space, your browser does not allow cache, or cache is in conflict with a previous one.</div></div>' +
   '</div>' +
   '<div class="faq">The wizard</div><div class="a">The center of this game, ' + (state.player.name) + ' is growing in power and ambitions. The fate is just one.</div>' +
   '<div class="faq">The player</div><div class="a"><b>You</b>, to avoid interrupt the free will of the wizard, you can only watch and help limited reducing the faith of the wizard. If the wizard has faith < 0 you cannot help him.</div>' +
   '<div class="faq">Divine touches</div><div class="a">This is the main player interaction with the wizard and occurs when click or touch the Scene panel. Some basic interactions are: <ol><li>Touch the wizard heal him (cost faith).</li><li>Touch the wizard when he is dead (soft dead) revive him.</li><li>Touch the enemy damage him/her/it (cost faith).</li><li>Touch a shrine mandate the wizard to give a tribute in gold (gain faith).</li>'+(state.travelFavor ? "<li>Touch the map teleport the wizard to the selected area.</li>" : "")+'</ol></div>' +
   '<div class="faq">Kill the wizard</div><div class="a">' +
   '<div class="divTableRow"><div class="divTableCell"><img src="img/diebtn.png" height="' + ui.objectSize * 0.09375 + 'px" /></div><div class="divTableCell">This is a definitive option, with this the player can destroy the current wizard in order to create another, <b>this action cannot be undone.</b></div></div>' +
   '</div>' +
   '<div class="faq">Achievements</div><div class="a">' + 
   '<div class="divTableRow"><div class="divTableCell"><img src="img/archbtn.png" height="' + ui.objectSize * 0.09375 + 'px" /></div><div class="divTableCell">A history of events your wizard achieve during his journey.</div></div>' +
   '</div>' +
   '<div class="faq">Stats</div><div class="a">' +
   '<div class="divTableRow"><div class="divTableCell"><img src="img/statsbtn.png" height="' + ui.objectSize * 0.09375 + 'px" /></div><div class="divTableCell">Many stats about what happen in the wizard trip. Pure informational.</div></div>' +
   '</div>' +
   '<div class="faq">Map</div><div class="a">' + 
   '<div class="divTableRow"><div class="divTableCell"><img src="img/mapbtn.png" height="' + ui.objectSize * 0.09375 + 'px" /></div><div class="divTableCell">   Here you can see the representation of the continent where everything happens. ' + (state.travelFavor ? "Touching it can teleport the wizard to the selected area." : "") + '</div></div>' +
   '</div>' +
   '<div class="faq">Study and skills</div><div class="a">During the wizard\'s trip, books, runes and statues can be found available to study. A successful study of them increase some stats. In this way the wizard can be a strong archmage or a devote donor to your cause.</div>' +
   '<div class="faq">Faith</div><div class="a">Your interaction with the wizard\'s world depends of this currency. The wizard gains faith praying and offering in your shrines. He loses the faith avoiding enter to the shires, reviving himself, and after each divine touch.</div>' +
   '<div class="faq">Rest and healing</div><div class="a">There are different ways to heal the wizard:<br><ol><li>By himself, casting some restoration spell during the battles.</li><li>By himself, sleeping.</li><li>By your interaction, in exchange for faith.</li></ol></div>' +
   '<div class="faq">Revive (soft dead)</div><div class="a">' +
        '<div class="divTableRow"><div class="divTableCell"><img src="img/muerto.png" height="' + ui.em * 3 + 'px" /></div><div class="divTableCell">If the wizard falls in a battle, there are two ways to revive and continue with the game: <ol><li>By divine intervention touching the dead image (promotes godliness).</li><li>By himself, after some time, this cost huge amounts of faith and the recover is partial (promotes atheism).</li></ol></div></div>' +
   '</div>' +
   '<div class="faq">FAQ</div><div class="a">' + frequentQuestions + '</div>' +
   '<div class="faq">Licences</div><div class="a">' + 
   'All media included in this game was provided by the authors under Creative Commons licenses or Public domain (included: CC0,CC-BY 3.0, CC-BY-SA 3.0).<br><br>The vast majority of the graphics was created by: David E. Gervais found in the follow repository <a href="http://pousse.rapiere.free.fr/tome/" target="_blank">http://pousse.rapiere.free.fr/tome/</a>.  <br>Some other graphics was created by multiple artist and distributed by Crawl Stone Soup team (<a href="http://crawl.develz.org/wordpress/" target="_blank">http://crawl.develz.org/wordpress/</a>) based on the work rltiles (<a href="http://rltiles.sourceforge.net/" target="_blank">http://rltiles.sourceforge.net/</a>). The repository can be found at <a href="https://github.com/crawl/tiles" target="_blank">https://github.com/crawl/tiles</a> <br><br>Some of the sounds was created by:<br>David McKee (VIRiX Dreamcore) (<a href="https://soundcloud.com/virix" target="_blank">https://soundcloud.com/virix</a>) <br>Little Robot Sound Factory (<a href="http://www.littlerobotsoundfactory.com/" target="_blank">http://www.littlerobotsoundfactory.com/</a>) <br>p0ss (<a href="https://opengameart.org/users/p" target="_blank">https://opengameart.org/users/p</a>) 0ss) <br>wobbleboxx (<a href="http://wobbleboxx.com" target="_blank">http://wobbleboxx.com</a>) <br>kenney (<a href="http://kenney.nl" target="_blank">http://kenney.nl</a>) <br>Iwan Gabovitch (<a href="http://qubodup.net" target="_blank">http://qubodup.net</a>) <br>Bart Kelsey (<a href="https://opengameart.org/users/bart" target="_blank">https://opengameart.org/users/bart</a>) <br>spookymodem (<a href="https://opengameart.org/users/spookymodem" target="_blank">https://opengameart.org/users/spookymodem</a>) <br>artisticdude (<a href="https://opengameart.org/users/artisticdude" target="_blank">https://opengameart.org/users/artisticdude</a>) <br>DoKashiteru (<a href="https://opengameart.org/users/dokashiteru" target="_blank">https://opengameart.org/users/dokashiteru</a>) <br>Vehicle (<a href="http://www.vehiclemusic.eu" target="_blank">http://www.vehiclemusic.eu</a>) <br>Ogrebane (<a href="https://opengameart.org/users/ogrebane" target="_blank">https://opengameart.org/users/ogrebane</a>) <br><br>Thanks to all kind artist to share their art for other people projects' +
   '</div>' +
   '<div class="faq">Version</div><div class="a">The current version is: <b>' + version + '</b></div>' +
   '</div>';

   //'<div class="divTableRow"><div class="divTableCell"><img src="img/muerto.png" height="' + em * 3 + 'px" /></div><div class="divTableCell"></div></div>' +
   //'</div>' +

    el('innerTextScroll').innerHTML=txt;
    el("help").style.fontSize = ui.em + "px";
    el("help").style.lineHeight = ui.em + "px";
    el("titleHelp").style.fontSize = ui.em * 2.5 + "px";
    el("titleHelp").style.lineHeight = ui.em * 2.5 + "px";  


    
    //collapsible in help scroll
    const coll = document.getElementsByClassName("faq");
    let i;
    for (i = 0; i < coll.length; i++) {
    coll[i].style.lineHeight = ui.em * 2 + "px";
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        const content = this.nextElementSibling;
        if (content.style.maxHeight){
        content.style.maxHeight = null;
        } else {
        content.style.maxHeight = content.scrollHeight + "px";
        } 
    });
    }
}

function updateKill(){
    const secondsIngameInstats = ((state.meta.playTimeMs + (performance.now() - run.timeStart))/1000).toFixed(0);
    const txt = '<div id="kill"><span class="titles" id="titleKill">Kill</span><br>' +
    '<div>' + 
    'Do you want to kill <b>' + state.player.name + '</b>?<br><br>' +
    'All progress, achievement and stats of this wizard will be lost forever (<b>this action cannot be undone</b>).<br><br>' +
    '<b>' + state.player.name + '</b> has existed for ' + secsToHours(secondsIngameInstats) + ", he is on level " + roundNumbertoLetter(state.player.lvl) + (countLogros() > 0 ? " and has " + countLogros() + " achievements" : "") + "<br><br>" +
    'For kill the wizard press Kill button below, otherwise just close this scroll.' +
    '</div>' +
    '<br><br><div>' + 
    '<img class="btn" id="realKillBtn" src="img/matar.png"/>' +
    '</div><br><br>' + 
    '<span class="titles" id="titleCementery">' + (world.cemetery.length == 0 ? "" : "Cemetery") + '</span>' + 
    (world.cemetery.length == 0 ? "" : "<small>" + cemeteryText() + "</small>");
    el('innerTextScroll').innerHTML=txt;
    el("realKillBtn").onclick = realKill;
    el("kill").style.fontSize = ui.em + "px";
    el("kill").style.lineHeight = ui.em + "px";
    el("titleKill").style.fontSize = ui.em * 2.5 + "px";
    el("titleKill").style.lineHeight = ui.em * 2.5 + "px";
    el("titleCementery").style.fontSize = ui.em * 2.5 + "px";
    el("titleCementery").style.lineHeight = ui.em * 2.5 + "px";
    
    const realKillBtnW = el("realKillBtn").style.width  = ((ui.objectSize * 0.09375) * 1.90625) * 1.5 + "px";  
    el("realKillBtn").style.left = ((ui.objectSize - parseInt(realKillBtnW)) / 2) + "px";
    el("realKillBtn").style.height  = (ui.objectSize * 0.09375) * 1.5 + "px"; 

}

export {
    counterText,
    localizarBocadillo,
    scrollClose,
    scrollOpen,
    updateAchievements,
    updateHelp,
    updateKill,
    updateStats,
};
