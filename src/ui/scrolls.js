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


// Stats page helpers

// A stats counter formatted for the stats page, or 0 if it never happened.
function counterText(name){
    return state.counters[name] ? roundNumbertoLetter(state.counters[name]) : 0;
}

// "Golem (3), Slime (5)" for every counter starting with prefix (e.g. "enemy_"); names come
// from enemies/zones, or from statObj/statueObj when inObj says so.
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




// When the scroll has finished closing: hide its content and put the scene back on top.
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
  
// Close the scroll with its animation.
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

// Show the close button once the scroll has finished opening.
function showCloseButton(){
    el("btnClose").style.display = "block";
    el("scrollBackCenter").removeEventListener("transitionend", showCloseButton)
}

// Open the scroll for a page ("stats", "help", ...) with its animation.
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


// Place the map marker (speech bubble) on the wizard's current stage.
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








// Block the toolbar while a scroll is open (remembers each button's handler).
  function disableMainButtons() {
    const eles = document.getElementsByClassName('dis');
    for (let i=0; i < eles.length; i++) {
      eles[i].prev_click = eles[i].onclick; // save the previous value
      eles[i].onclick = false;
    }
}

// Give the toolbar its handlers back.
function enableMainButtons() {
    const eles = document.getElementsByClassName('dis');
    for (let i=0; i < eles.length; i++)
       eles[i].onclick = eles[i].prev_click;  // restore the previous value
    };

// Cemetery lines as v1 wrote them: "Name (lvl: 12) died at the age of 23. <born> - <died>".
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
// Fill the achievements scroll.
function updateAchievements(){

    let txt = "<div id='achievements'><span class='titles' id='titleAchievements'>Achievements</span><br>"
    txt += achievementList();
    txt += "</div>"
    el('innerTextScroll').innerHTML=txt;
    el("titleAchievements").style.fontSize = ui.em * 2.5 + "px";
    el("titleAchievements").style.lineHeight = ui.em * 2.5 + "px";  

}

// One "Label: value" line of the stats page.
function statLine(label, value) {
    return label + ": " + value + "<br>";
}

// A section title of the stats page.
function statSection(title) {
    return "<br><span class='subtitles'>" + title + "</span><br>";
}

// Zones in the order the stats page lists them.
const STATS_ZONES = ["la_Pradera", "la_Ciudad", "el_Castillo", "el_Poblado", "la_Cueva", "la_Gruta", "la_Torre", "el_Bosque",
    "el_Pantano", "las_Dunas", "la_Tundra", "el_Volcan", "el_Desierto", "el_Heidan", "el_Duenon", "la_Mina"];

// Loot containers: counter suffix and plural label.
const STATS_CONTAINERS = [["bag", "Bags"], ["chest", "Chests"], ["pot", "Pots"], ["barrel", "Barrels"], ["box", "Boxes"]];

// Spell schools with a cast counter, and their label.
const STATS_SCHOOLS = [["Nature", "Nature"], ["Fire", "Fire"], ["Frost", "Frost"], ["Thunder", "Thunder"], ["Shadow", "Shadow"], ["Divine", "Divine"]];

function statsWizard(secondsInGame) {
    return "<span class='subtitles'>Wizard</span><br>" +
        statLine("Name", state.player.name) +
        statLine("Level", roundNumbertoLetter(state.player.lvl)) +
        "Age: " + roundNumbertoLetter(state.player.age) + " yrs<br>" +
        statLine("Health points", roundNumbertoLetter(state.player.hpBase)) +
        statLine("Attack points", roundNumbertoLetter(state.player.attack)) +
        statLine("Critic multiplier", roundNumbertoLetter(stat("fCritic"))) +
        statLine("Exp. to next level", Math.round((state.player.xpNext - state.player.xp) * 100)) +
        statLine("Time of existence", secsToHours(secondsInGame));
}

function statsBattles() {
    const hydras = state.hydraMysteryResolved && counterText("Hydras") > 0;
    return statSection("Battles") +
        statLine("Attacks", counterText("Attacks")) +
        statLine("Critic attacks", counterText("Critics")) +
        statLine("Melee attacks", counterText("school_Physical")) +
        statLine("Magical attacks", Number(counterText("Attacks")) - Number(counterText("school_Physical"))) +
        statLine("Attacks received", counterText("IncomingAttacks")) +
        statLine("Enemy encounters", counterText("enemyEncounters")) +
        statLine("Enemies defeated", counterText("EnemiesKilled")) +
        statLine("Rare encounters", counterText("rareEnemyEncounters")) +
        statLine("Rare defeated", counterText("rareEnemiesKilled")) +
        (counterText("enemyEncounters") > 0 ? statLine("Types of enemies found", counterList("enemy_")) : "") +
        "Bosses found: " + counterText("Bosses") + (counterText("Bosses") > 0 ? " {" + counterList("typeBoss_") + "}" : "") + "<br>" +
        statLine("Bosses defeated", counterText("BossesKilled")) +
        (hydras ? "Hydras found: " + counterText("Hydras") + " {" + counterList("typeofHydras_") + "}<br>" : "") +
        (hydras ? statLine("Hydras defeated", counterText("HydrasKilled")) : "") +
        (hydras ? statLine("Hydras heads chopped off", counterText("HydrasHeadCut")) : "") +
        statLine("Falls", counterText("Deaths")) +
        statLine("Current flawless victory", counterText("Combo")) +
        statLine("Longest flawless victory", counterText("longestCombo"));
}

function statsMagic() {
    return statSection("Magic") +
        statLine("Current magical level", Math.floor(state.player.lvl / 10)) +
        statLine("Known spells", countSpellKnown()) +
        statLine("Arcane spells cast", counterText("school_Arcane")) +
        statLine("Healing spells cast", counterText("Heal")) +
        STATS_SCHOOLS.map(([school, label]) => statLine(label + " spells cast", counterText("school_" + school))).join("") +
        statLine("Enemies polymorphed into a sheep", counterText("Polymorph_oveja")) +
        statLine("Enemies polymorphed into a chicken", counterText("Polymorph_gallina"));
}

function statsStudy() {
    return statSection("Study") +
        statLine("Books found", counterText("book")) +
        statLine("Runes found", counterText("rune")) +
        statLine("Successful studies", counterText("sucessStudy")) +
        statLine("Failed studies", counterText("failStudy")) +
        statLine("Successful statue studies", counterText("sucessStudyStatue")) +
        statLine("Failed statue studies", counterText("failStudyStatue")) +
        (counterText("sucessStudyStatue") > 0 ? statLine("Skills increased studying books or runes", counterList("study_", "statObj")) : "");
}

function statsExploration() {
    return statSection("Exploration") +
        statLine("Current zone", "The " + zones[state.zone.current].name) +
        statLine("Last zone", "The " + zones[state.zone.last].name) +
        statLine("Changes of zones", counterText("zonesChanged")) +
        STATS_ZONES.map((zone) => statLine("Times in the " + zones[zone].name, counterText("zone_" + zone))).join("") +
        STATS_CONTAINERS.map(([container, label]) => statLine(label + " found", counterText("BotinGot_" + container))).join("") +
        statLine("Total statues found", counterText("statuesFound")) +
        (counterText("statuesFound") > 0 ? statLine("Type of statues found", counterList("estatuas_", "statueObj")) : "");
}

function statsEconomy() {
    return statSection("Economy") +
        statLine("Current gold", roundNumbertoLetter(state.player.gold)) +
        statLine("Total gold looted", counterText("GoldFromEnemies")) +
        statLine("Total gold looted from bosses", counterText("GoldFromBosses")) +
        statLine("Total gold found", counterText("GoldFromBotin")) +
        statLine("Total gold lost in battles", counterText("goldLostInBattle")) +
        STATS_CONTAINERS.map(([container, label]) => statLine("Gold found in " + label.toLowerCase(), counterText("GoldFromBotin_" + container))).join("");
}

function statsLeisure() {
    return statSection("Leisure") +
        statLine("Rests in inns", counterText("taberna")) +
        statLine("Gold spend at inns", counterText("GoldSpendInn")) +
        statLine("Campings", counterText("camping"));
}

function statsSpirituality() {
    return statSection("Spirituality") +
        statLine("Faith", roundNumbertoLetter(state.player.faith)) +
        statLine("Offers", counterText("offers")) +
        statLine("Tithe", counterText("GoldOffered")) +
        statLine("Faith obtained by gold", counterText("FeByGold")) +
        statLine("Faith obtained by pray", counterText("FeByPray")) +
        statLine("Faith obtained by corruption eradication", counterText("FeByCleanCorruption")) +
        statLine("Shrines visited", counterText("altar")) +
        (counterText("altar") > 0 ? statLine("Shrines visited in", counterList("altar_zone_")) : "") +
        statLine("Mandatory offers", counterText("DivineMandatoryOffers")) +
        statLine("Negations", counterText("negar")) +
        statLine("Self recovery", counterText("selfRevive")) +
        statLine("Recovered by healer", counterText("hospital")) +
        statLine("Divine touches", counterText("divineTouch")) +
        statLine("Divine healings", counterText("DivineHeal")) +
        statLine("Divine punishments to enemies", counterText("DivineHit"));
}

function statsAchievements() {
    const won = countLogros();
    const total = Object.keys(logro).filter((key) => logro[key].name && !logro[key].planned).length;
    return statSection("Achievements") +
        statLine("Currenly won", won) +
        "Completion: " + Math.round((won / total) * 100) + "%<br>";
}

// Fill the stats scroll from the wizard's counters, section by section.
function updateStats(){
    const secondsInGame = ((state.meta.playTimeMs + (performance.now() - run.timeStart)) / 1000).toFixed(0);
    ui.statsPage = "<div id='stats'><span class='titles' id='titleStats'>Stats</span><br>" +
        statsWizard(secondsInGame) + statsBattles() + statsMagic() + statsStudy() + statsExploration() +
        statsEconomy() + statsLeisure() + statsSpirituality() + statsAchievements() +
        "</div>";
    el('innerTextScroll').innerHTML = ui.statsPage;
    el("stats").style.fontSize = ui.em + "px";
    el("stats").style.lineHeight = ui.em + "px";
    el("titleStats").style.fontSize = ui.em * 2.5 + "px";
    el("titleStats").style.lineHeight = ui.em * 2.5 + "px";
}

// Fill the help scroll (collapsible sections).
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

// Fill the kill scroll: the warning, the kill button and the cemetery.
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
