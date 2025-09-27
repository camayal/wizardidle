//EXPERIMENTALES

//
function distanceVector (loc1,loc2){
    return  Math.sqrt(Math.pow((window[loc2].x - window[loc1].x),2) + Math.pow((window[loc2].y - window[loc1].y),2)) * 100;
}


//to test
function drawLoc(localidad){
    var mapWidth = document.getElementById("backMapa").style.width;
    var point = document.createElement('span');
    point.style.position = 'absolute';
    point.style.color = "red"
    point.style.left = parseInt(mapWidth) * window[localidad].x  + "px";
    point.style.top = parseInt(mapWidth) * window[localidad].y + objectSize * 0.075 + "px";
    point.innerHTML = localidad.match(/\d+/);
    document.getElementById("mapa").appendChild(point);
}

//pinta todos los puntos en el mapa
function drawAllLocs(){
    //var locs = ["el_Bosque1","el_Bosque2","el_Bosque3","el_Bosque4","el_Bosque5","el_Bosque_altar","el_Castillo1","el_Castillo2","el_Castillo3","el_Castillo4","el_Castillo5","el_Castillo_altar","el_Desierto1","el_Desierto2","el_Desierto3","el_Desierto4","el_Desierto5","el_Desierto_altar","el_Desierto_taberna","el_Duenon1","el_Duenon2","el_Duenon3","el_Duenon4","el_Duenon5","el_Duenon_altar","el_Heidan1","el_Heidan2","el_Heidan3","el_Heidan4","el_Heidan5","el_Heidan_altar","el_Pantano1","el_Pantano2","el_Pantano3","el_Pantano4","el_Pantano5","el_Pantano_altar","el_Poblado1","el_Poblado2","el_Poblado3","el_Poblado4","el_Poblado5","el_Poblado_altar","el_Poblado_casadados","el_Poblado_taberna","la_Ciudad1","la_Ciudad2","la_Ciudad3","la_Ciudad4","la_Ciudad5","la_Ciudad_casadados","la_Ciudad_altar","la_Ciudad_taberna","la_Gruta1","la_Gruta2","la_Gruta3","la_Gruta4","la_Gruta5","la_Gruta_altar","la_Pradera1","la_Pradera2","la_Pradera3","la_Pradera4","la_Pradera5","la_Pradera_altar","la_Torre1","la_Torre2","la_Torre3","la_Torre4","la_Torre5","la_Torre_altar","la_Tundra1","la_Tundra2","la_Tundra3","la_Tundra4","la_Tundra5","la_Tundra_altar","las_Dunas1","las_Dunas2","las_Dunas3","las_Dunas4","las_Dunas5","las_Dunas_altar"]
    var locs = ["el_Volcan1","el_Volcan2","el_Volcan3","el_Volcan4","el_Volcan5","el_Volcan_altar","la_Cueva1","la_Cueva2","la_Cueva3","la_Cueva4","la_Cueva5","la_Cueva_altar","la_Mina1","la_Mina2","la_Mina3","la_Mina4","la_Mina5","la_Mina_altar"]
    for (var i = 0, len = locs.length; i < len; i++) {
        drawLoc(locs[i]);
      }
}

//halla las disatancias mínimas entre las escenas y genera objeto para copiar y pegar
function distancesMin(){
var resultado = "";
    var locs = ["la_Mina1","la_Mina3","la_Mina5","la_Cueva1","la_Cueva3","la_Cueva5","el_Volcan2","el_Bosque1","el_Bosque2","el_Bosque3","el_Bosque4","el_Bosque5","el_Castillo1","el_Castillo2","el_Castillo3","el_Castillo4","el_Castillo5","el_Desierto1","el_Desierto2","el_Desierto3","el_Desierto4","el_Desierto5","el_Duenon1","el_Duenon2","el_Duenon3","el_Duenon4","el_Duenon5","el_Heidan1","el_Heidan2","el_Heidan3","el_Heidan4","el_Heidan5","el_Pantano1","el_Pantano2","el_Pantano3","el_Pantano4","el_Pantano5","el_Poblado1","el_Poblado2","el_Poblado3","el_Poblado4","el_Poblado5","la_Ciudad1","la_Ciudad2","la_Ciudad3","la_Ciudad4","la_Ciudad5","la_Gruta1","la_Gruta2","la_Gruta3","la_Gruta4","la_Gruta5","la_Pradera1","la_Pradera2","la_Pradera3","la_Pradera4","la_Pradera5","la_Torre1","la_Torre2","la_Torre3","la_Torre4","la_Torre5","la_Tundra1","la_Tundra2","la_Tundra3","la_Tundra4","la_Tundra5","las_Dunas1","las_Dunas2","las_Dunas3","las_Dunas4","las_Dunas5"]
    for (var i = 0, len = locs.length; i < len; i++) {
        resultado += locs[i] + "={x:" + window[locs[i]].x + ",y:" + window[locs[i]].y + ",destinations:";
        for (var ii = 0, len = locs.length; ii < len; ii++) {
            var distancia = distanceVector (locs[i],locs[ii])
            if(distancia > 0 && distancia <= 17){
                //console.log(locs[i] + ": " + locs[ii] + " - " +  distancia)
                resultado += locs[ii] + ",";
            }
        }
        resultado += "\n"
    }
    return resultado;
}


