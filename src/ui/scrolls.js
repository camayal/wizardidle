// Wizard Idle v2 - The parchment scroll and its pages: stats, achievements, help, kill, and the map bubble.
// Code from v1 (hand-written by Carlos Alonso Maya Lastra), split into modules in phase 3.

import { places, zones } from '../data/zones.js';
import { roundNumbertoLetter, secsToHours } from '../utils.js';
import { state, world } from '../state.js';
import { run, ui } from '../runtime.js';
import * as loop from '../loop.js';
import { version } from '../game.js';
import { achievementList, countLogros, hasOthers, othersList } from '../achievements.js';
import { playSound } from '../audio.js';
import { detectmob, layoutPortrait } from './layout.js';
import { realKill } from './menu.js';
import { el } from './dom.js';
import { stats } from '../stats.js';
import { faithPageHtml, inventoryPageHtml, questsPageHtml, statsPageHtml } from './statsPages.js';
import { questNamesPlace, questPath, godDrop, godMove, godOrder, isSecretAt } from '../quests.js';
import { DEV } from '../config.js';
import { bestiaryPageHtml, paintInkStains } from './bestiary.js';
import { cemeteryPageHtml, paintCemetery, parchmentNote } from './cemetery.js';
import { art } from '../media.js';
import { connectorSceneInfo } from '../data/connectors.js';
import { pointSpot } from '../travelGraph.js';

let scrollIDContent;


// Stats page helpers

// A stats counter formatted for the stats page, or 0 if it never happened.
function counterText(name){
    const value = stats.get(name);
    return value ? roundNumbertoLetter(value) : 0;
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
    ui.faithHtml = '';
    delete el("scrollText").dataset.page;
    el("scroll").style.zIndex = 0;
    el("scrollBackCenter").removeEventListener("transitionend", hideScrollContent)
	
	
	//switch positions scene and console
	ui.sceneOnTop = true;
	layoutPortrait()
}
  
// Close the scroll with its animation.
function scrollClose(){
    ui.scrollCurrentContent = "";
    placeScrollTabs(null);
    playSound("scroll");
    el("btnClose").style.display = "none";
    el("btnClose").style.top = `${ui.objectSize * 0.065}px`;
    const content = el("scrollText");
    const scrollBack = el("scrollBackCenter");
    const sbd =  el("scrollBackDown");

    scrollBack.style.minHeight = `${0}px`;
    content.style.minHeight = `${0}px`;
    sbd.style.top = `${ui.objectSize * 0.02}px`;

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
    content.dataset.page = currentContent;   // lets the CSS style one page (the faith border)
    const scrollBack = el("scrollBackCenter");

    const orientation = screen.msOrientation || (screen.orientation || screen.mozOrientation || {}).type;
    if (!!orientation.match("landscape") && detectmob()){
        height = window.innerHeight * 0.92;
    }

    disableMainButtons()
    el("scrollBackUp").style.opacity = 1;
    const sbd =  el("scrollBackDown");
    sbd.style.top = `${ui.objectSize * 0.02}px`;
    sbd.style.opacity = 1;


    el("scroll").style.zIndex = 150;
    scrollBack.style.minHeight = `${height * 0.97}px`;
    content.style.minHeight = `${height * 0.92}px`;
    sbd.style.top = `${height * 0.97}px`;

    scrollBack.addEventListener("transitionend", showCloseButton);
    placeScrollTabs(currentContent);
	
		//switch positions scene and console
	ui.sceneOnTop = false;
	layoutPortrait()
  }


// Which map picture shows a zone (docs/plans/MAPS.md): el_Heidan is aboveground, the mine, the cave and
// the volcano are underground, everything else is ground.
function mapLayerFor(zone){
    if (zone == "el_Heidan") return "mapaboveground";
    if (zone == "la_Mina" || zone == "la_Cueva" || zone == "el_Volcan") return "mapaunderground";
    return "mapa";
}

// The three map pages (the map scroll's ribbons, top to bottom of the world) and their pictures.
const MAP_PAGES = { above: "mapaboveground", ground: "mapa", underground: "mapaunderground" };

// The map page that shows a zone.
function mapPageFor(zone){
    return Object.keys(MAP_PAGES).find((page) => MAP_PAGES[page] == mapLayerFor(zone));
}

// The quest's way ahead on the open map page: a dotted line along the route (only the part on this layer) and a ring on the goal.
const LAYER_PAGE = { ground: "ground", under: "underground", above: "above" };
function drawQuestPath(page){
    let svg = el("questPath");
    if (!svg) {
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.id = "questPath";
        svg.style.cssText = "position:absolute; pointer-events:none; z-index:2";
        el("mapa").appendChild(svg);
    }
    const path = questPath();
    const img = el("backMapa"), w = img.offsetWidth || parseFloat(img.style.width), h = img.offsetHeight || w;
    if (!path || !w) { svg.innerHTML = ""; return; }
    Object.assign(svg.style, { left: `${img.offsetLeft}px`, top: `${img.offsetTop}px`, width: `${w}px`, height: `${h}px` });
    svg.setAttribute("viewBox", `0 0 1 ${h / w}`);
    const on = path.filter((p) => LAYER_PAGE[p.layer] == page);
    let html = "";
    // the dotted way is a developer option
    if (DEV && on.length > 1) html += `<polyline points="${on.map((p) => `${p.x},${p.y}`).join(" ")}" fill="none" stroke="#c0392b" stroke-width="0.008" stroke-dasharray="0.012 0.014" stroke-linecap="round" stroke-linejoin="round"/>`;
    const goal = path[path.length - 1];
    if (LAYER_PAGE[goal.layer] == page && questNamesPlace()) html += `<circle cx="${goal.x}" cy="${goal.y}" r="0.02" fill="none" stroke="#c0392b" stroke-width="0.006"/>`;
    svg.innerHTML = html;
}

// Draw the map page that is open (the wizard's own layer when the scroll opens, or the ribbon the
// player tapped) and put the marker (speech bubble) on the wizard's current stage, only on his layer.
function localizarBocadillo(){
    // a connector scene sits on the map at its connector's point, on that point's layer
    const info = connectorSceneInfo(ui.currentBackGround), spot = info && pointSpot(info.point);
    const mine = spot ? ({ ground: "ground", under: "underground", above: "above" })[spot.layer] : mapPageFor(state.zone.current);
    const page = MAP_PAGES[ui.scrollViews.map] ? ui.scrollViews.map : mine;
    el("backMapa").src = art(MAP_PAGES[page]);
    drawQuestPath(page);
    const hide = () => { el("bocadilloMapa").style.display ="none"; el("pjMapa").style.display ="none"; };
    if (ui.currentBackGround.startsWith("curanderobg")) return hide();
    el("zoneMap").innerHTML = page == mine ? (info ? info.label[0].toUpperCase() + info.label.slice(1) : `The ${zones[state.zone.current].name}`) : "Map";
    if (page != mine || ui.currentBackGround.match(/_altar/) || ui.currentBackGround.match(/_estatua/)) return hide();
    const localidad = spot || places[ui.currentBackGround];
    if (!localidad) return hide();
    const mapWidth = el("backMapa").style.width;
    el("bocadilloMapa").style.display ="block";
    el("pjMapa").style.display ="block";
    el("bocadilloMapa").style.left = `${parseInt(mapWidth) * localidad.x}px`;
    el("bocadilloMapa").style.top = `${parseInt(mapWidth) * localidad.y}px`;
    el("pjMapa").style.left = `${parseInt(mapWidth) * localidad.x * 1.01}px`;
    el("pjMapa").style.top = `${parseInt(mapWidth) * localidad.y * 0.98}px`;
}



// Block the toolbar while a scroll is open (remembers each button's handler).
function disableMainButtons() {
    const eles = document.getElementsByClassName('dis');
    for (let i=0; i < eles.length; i++) {
      if (eles[i].onclick) eles[i].prev_click = eles[i].onclick; // save it once: a second disable must not overwrite it with false
      eles[i].onclick = false;
    }
}

// Give the toolbar its handlers back.
function enableMainButtons() {
    const eles = document.getElementsByClassName('dis');
    for (let i=0; i < eles.length; i++)
       if (eles[i].prev_click) eles[i].onclick = eles[i].prev_click;  // restore the previous value
}

// Fill the achievements scroll.
function updateAchievements(){
    const others = hasOthers();
    if (!others) ui.scrollViews.achievements = "run";
    const all = others && ui.scrollViews.achievements == "all";
    let txt = "<div id='achievements'><span class='titles' id='titleAchievements'>Achievements</span><br>"
    txt += all ? othersList() : achievementList();
    txt += "</div>"
    el('innerTextScroll').innerHTML=txt;
    el("titleAchievements").style.fontSize = `${ui.em * 2.5}px`;
    el("titleAchievements").style.lineHeight = `${ui.em * 2.5}px`;
    if (ui.scrollCurrentContent == "achievements") placeScrollTabs("achievements");  // ribbons only when others earned some
}

// ------------------------------------------------------------------ tabbed scrolls
// Some scrolls have several pages (Kill / Cemetery / Bestiary). Each page has a small ribbon
// bookmark with an icon hanging from the scroll's top edge; tapping one brings that page to the
// front and plays the scroll sound. The open page's ribbon hangs lower and is lighter (the
// author chose look A and the one-colour ribbons on 2026-11-18, replacing the paper strips).
const TAB_SETS = { kill: ["kill", "cemetery", "bestiary"], stats: ["stats", "inventory"], faith: ["faith", "quests"], map: ["above", "ground", "underground"] };
const PAGE_NAMES = { run: "This wizard", all: "Other wizards", kill: "Kill", cemetery: "Cemetery", bestiary: "Bestiary", stats: "Stats", inventory: "Inventory", faith: "Faith", quests: "Quests", above: "Aboveground", ground: "Ground", underground: "Underground" };
const RIBBON_ICONS = { kill: "icon_kill_kill", cemetery: "icon_kill_cemetery", bestiary: "icon_kill_bestiary",
    run: "icon_achievements_run", all: "icon_achievements_all", stats: "icon_stats_stats", inventory: "icon_stats_inventory", faith: "icon_faith_faith", quests: "icon_faith_quests",
    above: "icon_map_above", ground: "icon_map_ground", underground: "icon_map_underground" };
const RIBBON_SIDE = "left";         // "left" or "right" of the top edge; the close button sits at the top right
const RIBBON_SCALE = 1.5;           // one ribbon pixel = this many pixels of the 320-wide scroll art (2 was too big, 1.5 a bit small)
const RIBBON_TOP = -5;              // ribbon pixels below the roll's top edge (negative = above it). Test (author): -5, the ribbons start above the roll and hang over it; 3 with the roll over them (ribbon z-index 1) tucks them into it
const RIBBON_W = 18, RIBBON_ICON = 9, RIBBON_GAP = 3, RIBBON_MARGIN = 6;   // in ribbon pixels (the picture is 18 wide with its flap, 29 tall)
const RIBBON_H_REST = 25, RIBBON_H_OPEN = 29;                              // the open ribbon hangs 4 lower
const ribbons = [];
// Load every ribbon image up front, so a ribbon changing state never shows half-loaded.
const ribbonImages = ["ribbon_rest", "ribbon_selected", ...Object.values(RIBBON_ICONS)].map((name) => {
    const image = new Image();
    image.src = art(name);
    return image;
});

// The pages of a tabbed scroll; achievements have ribbons only when other wizards earned some.
function tabPages(set) {
    if (set == "achievements") return hasOthers() ? ["run", "all"] : null;
    return TAB_SETS[set] || null;
}

function ribbonAt(index) {
    while (ribbons.length <= index) {
        const ribbon = document.createElement("div");
        ribbon.className = "scrollRibbon";
        ribbon.style.cssText = "position:absolute; display:none; cursor:pointer; z-index:3; image-rendering:pixelated;";
        // both bodies are loaded once and only shown or hidden, so a heavy page (the bestiary) never
        // catches the ribbon with a picture half swapped
        const bodyStyle = 'position:absolute; left:0; top:0; width:100%; image-rendering:pixelated';
        ribbon.innerHTML = `<img class="ribbonBody rest" style="${bodyStyle}" src="${art("ribbon_rest")}">` +
            `<img class="ribbonBody selected" style="${bodyStyle}" src="${art("ribbon_selected")}">` +
            '<img class="ribbonIcon" style="position:absolute; image-rendering:pixelated">';
        ribbon.onclick = () => {
            const set = ui.scrollCurrentContent;
            if (!tabPages(set) || ui.scrollViews[set] == ribbon.dataset.page) return;
            ui.scrollViews[set] = ribbon.dataset.page;
            playSound("scroll");
            placeScrollTabs(set);                         // the ribbons move at once...
            setTimeout(() => PAGE_RENDER[set](), 0);      // ...and the page, which can be slow to build, after they were painted
        };
        el("scroll").appendChild(ribbon);
        ribbons.push(ribbon);
    }
    return ribbons[index];
}

// Show the ribbons of the scroll's pages (the open one lower), or hide them all.
function placeScrollTabs(set) {
    const pages = tabPages(set) || [];
    ribbons.forEach((ribbon, i) => { if (i >= pages.length) ribbon.style.display = "none"; });
    const text = el("innerTextScroll");
    if (!pages.length) { text.style.removeProperty("--ribbonGap"); return; }
    const up = el("scrollBackUp");
    const width = parseFloat(up.style.width);
    // One ribbon pixel is a whole number of device pixels, and every position is snapped to one:
    // with a fractional scale the nearest-neighbour drawing drops thin rows of the icon (the
    // bestiary's dotted row vanished when its ribbon was opened and the icon moved).
    const dpr = window.devicePixelRatio || 1;
    const snap = (v) => Math.round(v * dpr) / dpr;
    const u = Math.max(1, Math.round(width / 320 * RIBBON_SCALE * dpr)) / dpr;   // one ribbon pixel on screen
    text.style.setProperty("--ribbonGap", "0px");           // measured below (index.html applies it after the page title)
    const slot = (RIBBON_W + RIBBON_GAP) * u;
    pages.forEach((page, i) => {
        const open = ui.scrollViews[set] == page;
        const ribbon = ribbonAt(i);
        const x = RIBBON_SIDE == "left" ? RIBBON_MARGIN * u + i * slot
            : width - RIBBON_MARGIN * u - (pages.length - i) * slot + RIBBON_GAP * u;
        ribbon.dataset.page = page;
        ribbon.title = PAGE_NAMES[page];
        Object.assign(ribbon.style, { display: "block", left: `${snap(parseFloat(up.style.left) + x)}px`,
            top: `${snap(parseFloat(up.style.top) + RIBBON_TOP * u)}px`, width: `${RIBBON_W * u}px`, height: `${(open ? RIBBON_H_OPEN : RIBBON_H_REST) * u}px` });
        ribbon.querySelector(".ribbonBody.rest").style.display = open ? "none" : "block";
        ribbon.querySelector(".ribbonBody.selected").style.display = open ? "block" : "none";
        const icon = ribbon.querySelector(".ribbonIcon");
        if (!icon.src.endsWith(art(RIBBON_ICONS[page]))) icon.src = art(RIBBON_ICONS[page]);
        Object.assign(icon.style, { left: `${3 * u}px`, top: `${(open ? 11 : 7) * u}px`, width: `${RIBBON_ICON * u}px` });
    });
    // Space after the page title, so the page never lies under the open ribbon (the bestiary's
    // wide rows of creatures hid the lower part of its icon): the title ends at least a ribbon's
    // length (RIBBON_H_OPEN ribbon pixels) below the scroll's top edge, plus a little air.
    const title = text.querySelector(".titles");
    if (title) {
        const ribbonBottom = parseFloat(up.style.top) + (RIBBON_TOP + RIBBON_H_OPEN) * u + up.parentElement.getBoundingClientRect().top;
        const titleBottom = title.getBoundingClientRect().bottom;
        text.style.setProperty("--ribbonGap", `${Math.max(5 * u, ribbonBottom - titleBottom + 2 * u)}px`);
    }
}

// The layout was redone (window resized or rotated): fit the ribbons again.
document.addEventListener("wizardidle:layout", () => {
    if (tabPages(ui.scrollCurrentContent)) placeScrollTabs(ui.scrollCurrentContent);
});

// Fill the stats scroll (ui/statsPages.js).
function updateStats(){
    const secondsInGame = ((state.meta.playTimeMs + (loop.now() - run.timeStart)) / 1000).toFixed(0);
    const inventory = ui.scrollViews.stats == "inventory";
    ui.statsPage = inventory ? inventoryPageHtml() : statsPageHtml(secondsInGame);
    el('innerTextScroll').innerHTML = ui.statsPage;
    const id = inventory ? "inventory" : "stats", title = inventory ? "titleInventory" : "titleStats";
    el(id).style.fontSize = `${ui.em}px`;
    el(id).style.lineHeight = `${ui.em}px`;
    el(title).style.fontSize = `${ui.em * 2.5}px`;
    el(title).style.lineHeight = `${ui.em * 2.5}px`;
    if (ui.scrollCurrentContent == "stats") placeScrollTabs("stats");  // the Stats and Inventory pages
}

// Fill the faith scroll (ui/statsPages.js).
function updateFaith(){
    const quests = ui.scrollViews.faith == "quests";
    const html = quests ? questsPageHtml() : faithPageHtml();
    if (html === ui.faithHtml) return;   // unchanged: keep the candle's animation running
    ui.faithHtml = html;
    ui.questConfirm = null;      // the page is redrawn: a pending forget-note is gone
    el('innerTextScroll').innerHTML = html;
    const id = quests ? "quests" : "faith", title = quests ? "titleQuests" : "titleFaith";
    el(id).style.fontSize = `${ui.em}px`;
    el(id).style.lineHeight = `${ui.em}px`;
    el(title).style.fontSize = `${ui.em * 2.5}px`;
    el(title).style.lineHeight = `${ui.em * 2.5}px`;
    if (ui.scrollCurrentContent == "faith") placeScrollTabs("faith");
}

// The dev bar switch in Help (src/dev/tests.js listens for the event; the game never
// imports the dev tools).
el('innerTextScroll').addEventListener('click', (e) => {
    if (e.target.closest('.devToggle')) document.dispatchEvent(new Event('wizardidle:toggleDevBar'));
    if (e.target.closest('.questLogToggle')) { ui.questLogOpen = !ui.questLogOpen; ui.faithHtml = ''; updateFaith(); }
    if (e.target.closest('[data-card]')) { ui.questInfo = null; ui.faithHtml = ''; updateFaith(); return; }
    const info = e.target.closest('[data-info]');       // a quest's name opens its little scroll
    if (info) { ui.questInfo = info.dataset.info; ui.faithHtml = ''; updateFaith(); return; }
    const questBtn = e.target.closest('[data-quest]');       // the Faith scroll's quest buttons: the god's orders and "forget it" (src/quests.js)
    if (questBtn) {
        const what = questBtn.dataset.quest;
        const [act, arg] = what.split(':');
        if (act === 'drop' && isSecretAt(+arg) && ui.questConfirm !== what) return askForgetSecret(questBtn, what);    // a one-time quest: ask first (like the Kill button)
        ui.questConfirm = null;
        if (act === 'order') godOrder(arg);
        else if (act === 'up') godMove(+arg, -1);
        else if (act === 'down') godMove(+arg, 1);
        else if (act === 'drop') godDrop(+arg);
        ui.faithHtml = '';
        updateFaith();
    }
});

// Fill the help scroll (collapsible sections).
function updateHelp(){
    const frequentQuestions = '<b>Why does everyone have a name?</b> - All individuals of sentient species have one (Pybryas are very smart!)<br>' +
    '<b>Why does the wizard know all the names?</b> - The console is not what the wizard sees, it is what you see, and you are an omniscient god that know all the names<br>' +
    '<b>Why is everyone so hostile?</b> - It is a very conflict-ridden world and interspecies hate is widely accepted<br>' +
    '<b>Why do other humans attack my wizard?</b> - He is a heretic in the eyes of King Midas<br>' +
    '<b>Do I have to do anything?</b> - No. The wizard fights, explores, rests, studies and prays on his own. Everything you do is a nudge, and every nudge costs faith.<br>' +
    '<b>My touch did nothing. Why?</b> - Either you have no faith left, or the wizard does not believe in you any more: an atheist refuses every touch except a revive. Look at the Faith scroll to see how he feels.<br>' +
    '<b>Why does the wizard sometimes ignore what I suggest?</b> - He has free will. Orders, nudges and suggestions are followed according to his belief: a devout wizard nearly always listens, a doubter often does not.<br>' +
    '<b>Can I lose the wizard for good?</b> - Yes, in two ways: you kill him yourself with the Kill button, or you leave him alone for far too long. He then rests in the cemetery of the Kill scroll and the next wizard begins. A fall in battle alone is not the end: the revive touch is free, and if you do not come, he gets up by himself.<br>' +
    '<b>Why was my wizard lying on the ground when I came back?</b> - The world does not wait for a god who looks away, but it does not hurry either. A god who comes back in time can still lift him.<br>' +
    '<b>What is the ring on the map?</b> - When a quest names a place, the map rings it, so you can see where he is heading.<br>' +
    '<b>Why does the wizard stop and talk to strangers?</b> - People offer him jobs: an innkeeper, a notice board, a wanted post or a traveller on the road. You can suggest an answer by touching the giver (accept) or the door (leave), but he decides.<br>' +
    '<b>What are the Errands?</b> - The quests he follows, one at a time, with the rest waiting in a queue. On the Quests page of the Faith scroll you can move them up or down, cancel them, or give the three divine orders. Each order is obeyed or ignored by his belief.<br>' +
    '<b>What do the hunters do?</b> - When he hunts a rare enemy or a boss, he must report to the hunters guild in the Town after the kill. He tells the story, gets paid, and a boss hunt leaves a trophy hung on the wall of the hut.<br>' +
    '<b>Why is a quest sometimes dropped?</b> - If he searches too long or gets lost, he gives up and makes up an errand of his own. Secret quests are never dropped.<br>' +
    '<b>What is the difference between faith and belief?</b> - Faith is your currency, what your touches cost. Belief is how much the wizard trusts you, from doubt to devotion, in four levels (devout, believer, doubter, atheist). A devout wizard pays less for your touches and prays more; an atheist refuses them. You see it in the Faith scroll.<br>' +
    '<b>Does the wizard dream?</b> - Sometimes, when he sleeps at an inn or in his sleeping bag. Some dreams strengthen his belief, some nightmares sow doubt.<br>' +
    '<b>What is that dice game?</b> - Six, five, four. In the dice houses of the City, the Town and the Desert the wizard may bet gold against a gambler. A ship (6), a captain (5) and a crew (4) must be banked in that order, and the other two dice are the cargo.<br>' +
    '<b>I opened the game in another tab and it fell apart. Is that a bug?</b> - Not exactly. There is one world and one tab: the first tab keeps and saves the world, any other is a dimension that is unstable and collapses by itself. Close the extra tab.<br>' +
    '<b>Where is my game saved?</b> - In your browser, on this device only. Clearing the site data erases it. The game also works offline once it has loaded.<br>';

    const txt = '<div id="help"><span class="titles" id="titleHelp">Help</span><br>' +
   '<div class="faq">WizardIDLE, what is this?</div><div class="a">It is a game with typical elements of a common RPG game, the only difference is the player role. You are the god of the wizard and your interaction is limited due his free will. With or without your help the wizard can reach his fate being a deep believer or a hardened atheist.</div>' +
   '<div class="faq">About the Gameplay</div><div class="a">This is an idle game, a true idle game, you must do nothing. The wizard can perform all actions without your help. This is a different way to play, watching what other beings do without your control but some interference (you can interact with miracles). <b><i>This is a god like game</i></b>. When no god is looking the world is in no hurry: it counts its time in the beads of a mala.</div>' +
   '<div class="faq">Graphical layout</div><div class="a">The screen is divided into three main parts. From top to bottom:<br> <b>The control</b>, this is an informational panel with the name, experience bar, level, health points, gold and faith points. In this panel you can find the buttons to access other information displayed in <b>The scroll</b>.<br><b>The console</b>, where all actions performed by the wizard are printed.<br><b>The scene</b>, this is the graphical version of the console, <i>you can click or touch to interact</i> with the wizard, non-player characters or environments. </div>' +
   '<div class="faq">Icons explanation</div><div class="a">' +
        '<div class="divTableRow"><div class="divTableCell"><img src="' + art('boss') + '" height="' + ui.em + 'px" /></div><div class="divTableCell">Boss, this encounter is harder than others, the reward is multiplied too.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img src="' + art('attack') + '" height="' + ui.em + 'px" /></div><div class="divTableCell">Attack, followed by the amount of damage against the wizard or the enemy.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img src="' + art('heart') + '" height="' + ui.em + 'px" /></div><div class="divTableCell">Wizard health, can be found in five states depending on the percentage (100%, 75%, 50%, 10%, and 0%).</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img style="filter: hue-rotate(45deg)" src="' + art('heart') + '" height="' + ui.em + 'px" /></div><div class="divTableCell">Enemy health, as well as wizard health, it can be found in five states.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img src="' + art('achivement') + '" height="' + ui.em + 'px" /></div><div class="divTableCell">Achievement, just won an achievement.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img src="' + art('gold') + '" height="' + ui.em + 'px" /></div><div class="divTableCell">Gold, represent the currency in the game.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img src="' + art('heal') + '" height="' + ui.em + 'px" /></div><div class="divTableCell">Healing, followed by amount of health recovered.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><img src="' + art('spirit') + '" height="' + ui.em + 'px" /></div><div class="divTableCell">Faith, divine currency in the game, divine touches and other stuff cost faith instead of gold.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><span style="font-size:' + ui.em * 1.5 + 'px">!</span></div><div class="divTableCell">Shown near the bottom-right corner, new content or update is available in the server. Reload the game to download the new content for offline access.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><span style="font-size:' + ui.em * 1.5 + 'px">...</span></div><div class="divTableCell">Shown near the bottom-right corner, searching for new content or updates.</div></div>' +
        '<div class="divTableRow"><div class="divTableCell"><span style="font-size:' + ui.em * 1.5 + 'px">.</span></div><div class="divTableCell">Shown near the bottom-right corner, the game can run but some problems with the offline functions happen. Not enough space, your browser does not allow cache, or cache is in conflict with a previous one.</div></div>' +
   '</div>' +
   '<div class="faq">The wizard</div><div class="a">The center of this game, ' + (state.player.name) + ' is growing in power and ambitions. The fate is just one.</div>' +
   '<div class="faq">The player</div><div class="a"><b>You</b>. To respect the free will of the wizard, you can only watch and help in a limited way, and every help costs your faith. When your faith runs out you cannot heal or strike for him, and an atheist wizard refuses your help (a revive he always accepts).</div>' +
   '<div class="faq">Divine touches</div><div class="a">This is the main player interaction with the wizard and occurs when click or touch the Scene panel. Some basic interactions are: <ol><li>Touch the wizard to heal him (costs faith).</li><li>Touch the wizard when he has fallen to revive him (free, and it strengthens his belief).</li><li>Touch the enemy to hurt it (costs faith; it can be the killing blow).</li><li>Touch a shrine to make the wizard give a tribute in gold (gains faith).</li><li>While someone offers him a job, touch the giver to suggest he takes it, or the door to suggest he leaves it.</li>'+(state.travelFavor ? "<li>Touch the map teleport the wizard to the selected area.</li>" : "")+'</ol></div>' +
   '<div class="faq">Kill the wizard</div><div class="a">' +
   '<div class="divTableRow"><div class="divTableCell"><img src="' + art('diebtn') + '" height="' + ui.objectSize * 0.09375 + 'px" /></div><div class="divTableCell">This is a definitive option, with this the player can destroy the current wizard in order to create another, <b>this action cannot be undone.</b> The scroll also keeps the bestiary of the enemies he has met and the cemetery of the wizards who came before, each with a tomb.</div></div>' +
   '</div>' +
   '<div class="faq">Achievements</div><div class="a">' + 
   '<div class="divTableRow"><div class="divTableCell"><img src="' + art('archbtn') + '" height="' + ui.objectSize * 0.09375 + 'px" /></div><div class="divTableCell">A history of events your wizard achieve during his journey.</div></div>' +
   '</div>' +
   '<div class="faq">Stats</div><div class="a">' +
   '<div class="divTableRow"><div class="divTableCell"><img src="' + art('statsbtn') + '" height="' + ui.objectSize * 0.09375 + 'px" /></div><div class="divTableCell">Many stats about what happens in the wizard trip, pure information. The second page, Inventory, shows what he carries: his staff, his gold and the artefacts he found.</div></div>' +
   '</div>' +
   '<div class="faq">Faith scroll</div><div class="a">' +
   '<div class="divTableRow"><div class="divTableCell"><img src="' + art('plegariabtn') + '" height="' + ui.objectSize * 0.09375 + 'px" /></div><div class="divTableCell">Your faith, and the wizard\'s belief in you: its level, a meter from doubt to devotion, and where faith came from. A second page, Quests, lists his errands and the divine orders you can give.</div></div>' +
   '</div>' +
   '<div class="faq">Map</div><div class="a">' + 
   '<div class="divTableRow"><div class="divTableCell"><img src="' + art('mapbtn') + '" height="' + ui.objectSize * 0.09375 + 'px" /></div><div class="divTableCell">   Here you can see the representation of the continent where everything happens. ' + (state.travelFavor ? "Touching it can teleport the wizard to the selected area." : "") + '</div></div>' +
   '</div>' +
   '<div class="faq">Travelling over bridges, borders and mouths</div><div class="a">Some trips cross a place between two zones: a bridge, a border, a cave or mine mouth, the Heidan stairs or the ladder between the cave and the mine. The wizard walks across each scene of the crossing instead of appearing on the other side; a mouth fades out, the wizard walks through its tunnel and comes out on the other side. Near the pier, an exploring wizard sometimes walks out to its end, stands there a while and walks back.</div>' +
   '<div class="faq">Fights on the road</div><div class="a">A crossing can be stopped halfway by a normal fight against the zone he is entering. It happens about one crossing in ten, and never on stairs or ladders; there are no bosses, hydras or spectra in these fights. If he wins he walks on; if he falls he wakes up in the zone he was heading to.</div>' +
   '<div class="faq">The healer\'s cabin</div><div class="a">When the god revives the wizard, a hooded healer takes him to a cabin that stands as near as possible to where he fell. Duenon, Heidan, the Castle and the Tower never have a cabin: there he wakes up in the nearest zone that can have one. The cabin has its own look in the wild, the Town, the City and the caves.</div>' +
   '<div class="faq">Spectra and prisms</div><div class="a">In the Tundra roam seven secret spectra (red, orange, yellow, green, blue, indigo and violet). They are rare enemies, each fights with the spells of its colour and each appears only once. The second one he meets brings a whispered quest from the god to find a prism. Once a prism turns up in a find, the spectra show up three times as often. When all seven have fallen, the Rainbow arrives as the spectra fuse into it.</div>' +
   '<div class="faq">The underground inn</div><div class="a">In the Dunes, the cave entrance of the second Dunes scene is an underground inn: a dark cave with beds, where a red-robed old merchant breathes while the wizard rests. A lantern and a sign mark the entrance.</div>' +
   '<div class="faq">Study and skills</div><div class="a">During the wizard\'s trip, books, runes and statues can be found available to study. A successful study of them increases some stats. In this way the wizard can be a strong archmage or a devoted donor to your cause.</div>' +
   '<div class="faq">Faith</div><div class="a">Your interaction with the wizard\'s world depends on this currency. The wizard gains faith praying and offering in your shrines. He loses faith when he passes a shrine without entering, when he gets up by himself after a fall, and with each divine touch. How much a touch costs depends on his belief.</div>' +
   '<div class="faq">Rest and healing</div><div class="a">There are different ways to heal the wizard:<br><ol><li>By himself, casting some restoration spell during the battles.</li><li>By himself, sleeping.</li><li>By your interaction, in exchange for faith.</li></ol></div>' +
   '<div class="faq">Revive (soft dead)</div><div class="a">' +
        '<div class="divTableRow"><div class="divTableCell"><img src="' + art('muerto') + '" height="' + ui.em * 3 + 'px" /></div><div class="divTableCell">If the wizard falls in a battle, there are two ways to revive and continue with the game: <ol><li>By divine intervention touching the fallen wizard: it is free, he wakes in a healer\'s cabin at full health (promotes godliness).</li><li>By himself, after some time, which costs a lot of faith (promotes atheism).</li></ol>A fall in battle also costs some of his gold.</div></div>' +
   '</div>' +
   '<div class="faq">FAQ</div><div class="a">' + frequentQuestions + '</div>' +
   '<div class="faq">Licences</div><div class="a">' + 
   'All media included in this game was provided by the authors under Creative Commons licenses or Public domain (included: CC0,CC-BY 3.0, CC-BY-SA 3.0).<br><br>The vast majority of the graphics were created by: David E. Gervais found in the following repository <a href="http://pousse.rapiere.free.fr/tome/" target="_blank">http://pousse.rapiere.free.fr/tome/</a>.  <br>Some other graphics were created by multiple artists and distributed by Crawl Stone Soup team (<a href="http://crawl.develz.org/wordpress/" target="_blank">http://crawl.develz.org/wordpress/</a>) based on the work rltiles (<a href="http://rltiles.sourceforge.net/" target="_blank">http://rltiles.sourceforge.net/</a>). The repository can be found at <a href="https://github.com/crawl/tiles" target="_blank">https://github.com/crawl/tiles</a> <br><br>Some of the sounds were created by:<br>David McKee (VIRiX Dreamcore) (<a href="https://soundcloud.com/virix" target="_blank">https://soundcloud.com/virix</a>) <br>Little Robot Sound Factory (<a href="http://www.littlerobotsoundfactory.com/" target="_blank">http://www.littlerobotsoundfactory.com/</a>) <br>p0ss (<a href="https://opengameart.org/users/p" target="_blank">https://opengameart.org/users/p</a>) 0ss) <br>wobbleboxx (<a href="http://wobbleboxx.com" target="_blank">http://wobbleboxx.com</a>) <br>kenney (<a href="http://kenney.nl" target="_blank">http://kenney.nl</a>) <br>Iwan Gabovitch (<a href="http://qubodup.net" target="_blank">http://qubodup.net</a>) <br>Bart Kelsey (<a href="https://opengameart.org/users/bart" target="_blank">https://opengameart.org/users/bart</a>) <br>spookymodem (<a href="https://opengameart.org/users/spookymodem" target="_blank">https://opengameart.org/users/spookymodem</a>) <br>artisticdude (<a href="https://opengameart.org/users/artisticdude" target="_blank">https://opengameart.org/users/artisticdude</a>) <br>DoKashiteru (<a href="https://opengameart.org/users/dokashiteru" target="_blank">https://opengameart.org/users/dokashiteru</a>) <br>Vehicle (<a href="http://www.vehiclemusic.eu" target="_blank">http://www.vehiclemusic.eu</a>) <br>Ogrebane (<a href="https://opengameart.org/users/ogrebane" target="_blank">https://opengameart.org/users/ogrebane</a>) <br>Dragon Studio (<a href="https://ko-fi.com/dragonstudio" target="_blank">https://ko-fi.com/dragonstudio</a>), for a bunch of sounds <br>freesound_community (<a href="https://pixabay.com/users/freesound_community-46691455/" target="_blank">https://pixabay.com/users/freesound_community-46691455/</a>), for many more sounds <br><br>Thanks to all the kind artists who share their art for other people\'s projects' +
   '</div>' +
   (DEV ? '<div class="faq">Developer tools</div><div class="a">Only while developing (never on the live site): the dev panel beside the game, with modes (sounds, art), test scenarios, fights, quick actions, a command line and the author notes box.<br><br><span class="devToggle" style="text-decoration:underline;cursor:pointer">Show or hide the dev panel</span></div>' : '') +
   '<div class="faq">Version</div><div class="a">The current version is: <b>' + version + '</b></div>' +
   '</div>';


    el('innerTextScroll').innerHTML=txt;
    el("help").style.fontSize = `${ui.em}px`;
    el("help").style.lineHeight = `${ui.em}px`;
    el("titleHelp").style.fontSize = `${ui.em * 2.5}px`;
    el("titleHelp").style.lineHeight = `${ui.em * 2.5}px`;  


    
    //collapsible in help scroll
    const coll = document.getElementsByClassName("faq");
    let i;
    for (i = 0; i < coll.length; i++) {
    coll[i].style.lineHeight = `${ui.em * 2}px`;
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        const content = this.nextElementSibling;
        if (content.style.maxHeight){
        content.style.maxHeight = null;
        } else {
        content.style.maxHeight = `${content.scrollHeight}px`;
        } 
    });
    }
}

// Fill the kill scroll: one of its three pages (Kill, Cemetery, Bestiary).
function updateKill(){
    const page = ui.scrollViews.kill;
    const title = `<span class="titles" id="titleKill">${PAGE_NAMES[page]}</span>`;
    let body;
    if (page == "cemetery") {
        body = cemeteryPageHtml();
    } else if (page == "bestiary") {
        body = bestiaryPageHtml();
    } else {
        const secondsIngameInstats = ((state.meta.playTimeMs + (loop.now() - run.timeStart))/1000).toFixed(0);
        body = '<br><div>' +
        'Do you want to kill <b>' + state.player.name + '</b>?<br><br>' +
        'All progress, achievement and stats of this wizard will be lost forever (<b>this action cannot be undone</b>).<br><br>' +
        '<b>' + state.player.name + '</b> has existed for ' + secsToHours(secondsIngameInstats) + ", he is on level " + roundNumbertoLetter(state.player.lvl) + (countLogros() > 0 ? ` and has ${countLogros()} achievements` : "") + "<br><br>" +
        'For kill the wizard press Kill button below, otherwise just close this scroll.' +
        '</div>' +
        '<br><br><div id="killBtnWrap" style="position:relative">' +
        '<img class="btn" id="realKillBtn" src="' + art('matar') + '"/>' +
        '</div><br><br>';
    }
    el('innerTextScroll').innerHTML = `<div id="kill">${title}${body}</div>`;
    el("kill").style.fontSize = `${ui.em}px`;
    el("kill").style.lineHeight = `${ui.em}px`;
    el("titleKill").style.fontSize = `${ui.em * 2.5}px`;
    el("titleKill").style.lineHeight = `${ui.em * 2.5}px`;
    if (page == "kill") {
        el("realKillBtn").onclick = killClick;
        const realKillBtnW = el("realKillBtn").style.width  = `${((ui.objectSize * 0.09375) * 1.90625) * 1.5}px`;
        el("realKillBtn").style.left = `${(ui.objectSize - parseInt(realKillBtnW)) / 2}px`;
        el("realKillBtn").style.height  = `${(ui.objectSize * 0.09375) * 1.5}px`;
    }
    if (page == "bestiary") paintInkStains(el('innerTextScroll'));
    if (page == "cemetery") paintCemetery(el('innerTextScroll'));
    if (ui.scrollCurrentContent == "kill") placeScrollTabs("kill");
}

// The Kill button asks twice (the author): the first press opens a small parchment like the
// cemetery's notes above it; the second press, while it shows, kills. Tapping the note closes it.
function killClick() {
    const wrap = el("killBtnWrap"), btn = el("realKillBtn");
    if (!wrap || !btn) return;
    if (wrap.querySelector('.killNote')) { stats.count("world.wizardsKilledByGod"); return realKill(); }
    stats.count("god.killAsked");
    const width = Math.min(wrap.clientWidth * 0.92, btn.offsetWidth * 2.4);
    const note = parchmentNote([
        `Click <b>Kill</b> again to kill <b>${state.player.name}</b>.`,
        'It is permanent.',
    ], width, `left:${(wrap.clientWidth - width) / 2}px; bottom:${btn.offsetHeight * 1.15}px`);
    note.className = 'killNote';
    note.onclick = () => { note.remove(); stats.count("god.killTakenBack"); };
    wrap.appendChild(note);
}

// Forgetting a secret quest (it happens only once) asks twice, like the Kill button: the first press opens a small
// parchment note over the row; pressing the same X again, while it shows, forgets it. Tapping the note closes it.
function askForgetSecret(btn, what) {
    const row = btn.closest('.questRow');
    if (!row) return;
    row.parentElement.querySelectorAll('.killNote').forEach((n) => n.remove());
    ui.questConfirm = what;
    row.style.position = 'relative';
    const width = Math.min(row.clientWidth * 0.8, ui.em * 16);
    const note = parchmentNote([
        'Press <b>X</b> again to forget this quest.',
        'It comes only once.',
    ], width, `right:${btn.offsetWidth}px; top:100%`);
    note.className = 'killNote';
    note.onclick = (e) => { e.stopPropagation(); note.remove(); ui.questConfirm = null; };
    row.appendChild(note);
}

// How each tabbed scroll redraws its front page.
const PAGE_RENDER = { stats: updateStats, faith: updateFaith, kill: updateKill, achievements: updateAchievements, map: localizarBocadillo };

export {
    counterText,
    localizarBocadillo,
    mapPageFor,
    scrollClose,
    scrollOpen,
    updateAchievements,
    updateFaith,
    updateHelp,
    updateKill,
    updateStats,
};
