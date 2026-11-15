/*
  pagina_plan.js · Código de la página "Plan de ataque" (versión 1)
  Qué hace:  carga los escenarios, las rutas y las reglas; arma los controles (escenario,
             brigadas disponibles y método) y, al generar el plan, lo dibuja en el mapa y lo
             escribe en tablas. El reparto en sí lo hace js/plan.js.
  Qué lee:   datos/reglas.json, datos/rutas_piloto.json y datos/escenarios_piloto.json.
  Qué usa:   Leaflet, js/comun.js y js/plan.js.
  Cómo se prueba: abrir la página, elegir un escenario y hacer clic en "Generar plan".
*/

// Esquinas de la región piloto: [latitud, longitud] del suroeste y del noreste (como en config.py).
var CAJA_PILOTO = [[20.40, -103.90], [20.95, -103.15]];

// Lo que la página recuerda mientras está abierta.
var reglas = null;             // datos/reglas.json
var rutas = null;              // datos/rutas_piloto.json (bases, brigadas, tiempos y rutas)
var escenarios = null;         // datos/escenarios_piloto.json (escenarios e incendios)
var mapa = null;
var capaPlan = null;           // grupo con lo que se dibuja de un plan (incendios y rutas)

// ---------------------------------------------------------------------------
// 1. Mapa
// ---------------------------------------------------------------------------

// Crea el mapa de la región piloto y marca las bases.
function crearMapa() {
  mapa = L.map("mapa");
  mapa.fitBounds(CAJA_PILOTO);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; colaboradores de OpenStreetMap"
  }).addTo(mapa);
  rutas.bases.forEach(function (base) {
    L.circleMarker([base.lat, base.lon], {
      radius: 7, color: "#ffffff", weight: 2, fillColor: "#1d5c4b", fillOpacity: 1
    }).bindTooltip(base.id + " · " + base.nombre).addTo(mapa);
  });
  capaPlan = L.layerGroup().addTo(mapa);
}

// ---------------------------------------------------------------------------
// 2. Controles
// ---------------------------------------------------------------------------

// Escribe un día como "2 de mayo de 2024". Recibe el texto "2024-05-02".
function diaEnPalabras(dia) {
  var fecha = new Date(dia + "T12:00:00");
  return fecha.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
}

// Llena la lista de escenarios, con la fecha en palabras y el número de incendios.
function llenarEscenarios() {
  var lista = document.getElementById("escenario");
  escenarios.escenarios.forEach(function (escenario) {
    var opcion = document.createElement("option");
    opcion.value = escenario.id;
    opcion.textContent = diaEnPalabras(escenario.fecha) + " (" + escenario.incendios.length + " incendios)";
    lista.appendChild(opcion);
  });
}

// Pone una casilla por brigada, agrupadas por base. Todas empiezan marcadas (disponibles).
function llenarBrigadas() {
  var contenedor = document.getElementById("brigadas");
  rutas.bases.forEach(function (base) {
    var grupo = document.createElement("div");
    grupo.className = "brigadas-base";
    var titulo = document.createElement("strong");
    titulo.textContent = base.id + " · " + base.nombre;
    grupo.appendChild(titulo);
    rutas.brigadas.filter(function (b) { return b.base === base.id; }).forEach(function (brigada) {
      var etiqueta = document.createElement("label");
      var casilla = document.createElement("input");
      casilla.type = "checkbox";
      casilla.value = brigada.id;
      casilla.checked = true;
      etiqueta.appendChild(casilla);
      etiqueta.appendChild(document.createTextNode(" " + brigada.id + " (" + brigada.tipo + ")"));
      grupo.appendChild(etiqueta);
    });
    contenedor.appendChild(grupo);
  });
}

// Devuelve las brigadas cuya casilla está marcada.
function brigadasDisponibles() {
  var marcadas = [];
  document.querySelectorAll("#brigadas input").forEach(function (casilla) {
    if (casilla.checked) { marcadas.push(casilla.value); }
  });
  return rutas.brigadas.filter(function (b) { return marcadas.indexOf(b.id) !== -1; });
}

// Devuelve los incendios del escenario elegido, con sus datos (nivel, lugar, inicio).
function incendiosDelEscenario() {
  var id = document.getElementById("escenario").value;
  var escenario = escenarios.escenarios.filter(function (e) { return e.id === id; })[0];
  return escenario.incendios.map(function (incendioId) {
    var datos = escenarios.incendios[incendioId];
    return { id: incendioId, nivel: datos.nivel, inicio: datos.inicio, lat: datos.lat, lon: datos.lon };
  });
}

// ---------------------------------------------------------------------------
// 3. Dibujar el plan en el mapa
// ---------------------------------------------------------------------------

// Dibuja los incendios del escenario como círculos del color de su nivel.
function dibujarIncendios(incendios) {
  incendios.forEach(function (incendio) {
    L.circleMarker([incendio.lat, incendio.lon], {
      radius: 10, color: "#333333", weight: 1, fillColor: COLORES_NIVEL[incendio.nivel], fillOpacity: 0.9
    }).bindTooltip(incendio.id + " · nivel " + NOMBRES_NIVEL[incendio.nivel].toLowerCase()).addTo(capaPlan);
  });
}

// Dibuja la ruta de cada brigada asignada, del color del nivel del incendio al que va.
function dibujarRutas(plan, incendios) {
  var nivelDe = {};
  incendios.forEach(function (incendio) { nivelDe[incendio.id] = incendio.nivel; });
  plan.asignaciones.forEach(function (asignacion) {
    var trazo = rutas.rutas[asignacion.incendio + "|" + asignacion.base];
    if (!trazo) { return; }
    L.polyline(trazo, { color: COLORES_NIVEL[nivelDe[asignacion.incendio]], weight: 4, opacity: 0.8 })
      .bindTooltip(asignacion.brigada + " → " + asignacion.incendio + " (" + asignacion.minutos + " min)")
      .addTo(capaPlan);
  });
}

// Encuadra el mapa para que se vean los incendios del escenario y todas las bases.
function encuadrar(incendios) {
  var puntos = incendios.map(function (i) { return [i.lat, i.lon]; })
    .concat(rutas.bases.map(function (b) { return [b.lat, b.lon]; }));
  mapa.fitBounds(puntos, { padding: [30, 30] });
}

// ---------------------------------------------------------------------------
// 4. Escribir el plan en tablas
// ---------------------------------------------------------------------------

// Agrega un renglón a una tabla. "celdas" es la lista de textos; si esTitulo, van en negritas.
function agregarRenglon(tabla, celdas, esTitulo) {
  var renglon = document.createElement("tr");
  celdas.forEach(function (texto) {
    var celda = document.createElement(esTitulo ? "th" : "td");
    celda.textContent = texto;
    renglon.appendChild(celda);
  });
  tabla.appendChild(renglon);
}

// Tabla de incendios en orden de atención: qué pidió cada uno y qué recibió.
function escribirIncendios(plan, incendios) {
  var tabla = document.getElementById("tabla-incendios");
  tabla.textContent = "";
  agregarRenglon(tabla, ["Orden", "Incendio", "Nivel", "Brigadas pedidas", "Asignadas", "Faltan", "Primera llegada"], true);
  plan.orden.forEach(function (incendioId, posicion) {
    var incendio = incendios.filter(function (i) { return i.id === incendioId; })[0];
    var pedidas = demandaDe(incendio, reglas).brigadas;
    var faltan = plan.brigadas_faltantes[incendioId];
    var llegadas = plan.asignaciones.filter(function (a) { return a.incendio === incendioId && a.tipo === "terrestre"; })
      .map(function (a) { return a.minutos; });
    var primera = llegadas.length === 0 ? "sin brigada" : Math.min.apply(null, llegadas) + " min";
    agregarRenglon(tabla, [posicion + 1, incendioId, NOMBRES_NIVEL[incendio.nivel], pedidas, pedidas - faltan, faltan, primera]);
  });
}

// Tabla de asignaciones: qué brigada va a qué incendio y en cuántos minutos.
function escribirAsignaciones(plan) {
  var tabla = document.getElementById("tabla-asignaciones");
  tabla.textContent = "";
  agregarRenglon(tabla, ["Brigada", "Tipo", "Sale de", "Va al incendio", "Llega en"], true);
  // Se ordenan igual que los incendios (orden de atención) y, dentro de cada uno, por tiempo.
  var ordenadas = plan.asignaciones.slice().sort(function (a, b) {
    var diferencia = plan.orden.indexOf(a.incendio) - plan.orden.indexOf(b.incendio);
    return diferencia !== 0 ? diferencia : a.minutos - b.minutos;
  });
  ordenadas.forEach(function (a) {
    agregarRenglon(tabla, [a.brigada, a.tipo, a.base, a.incendio, a.minutos + " min"]);
  });
}

// Recuadros con las métricas del plan.
function escribirMetricas(metricas, milisegundos) {
  var contenedor = document.getElementById("metricas");
  contenedor.textContent = "";
  var llegada = metricas.primera_llegada_graves_min === null ? "no aplica" : metricas.primera_llegada_graves_min + " min";
  [
    ["Demanda cubierta", metricas.demanda_cubierta_pct + " %", metricas.brigadas_asignadas + " de " + metricas.brigadas_pedidas + " brigadas pedidas"],
    ["Tiempo total ponderado", metricas.tiempo_ponderado, "minutos de cada brigada por el peso del nivel; menos es mejor"],
    ["Primera llegada a incendios altos y críticos", llegada, metricas.graves_sin_brigada + " sin ninguna brigada"],
    ["Tiempo de cálculo", milisegundos + " ms", "lo que tardó el navegador en repartir"]
  ].forEach(function (dato) {
    var caja = document.createElement("div");
    caja.className = "metrica";
    [["metrica-nombre", dato[0]], ["metrica-valor", dato[1]], ["metrica-nota", dato[2]]].forEach(function (parte) {
      var renglon = document.createElement("div");
      renglon.className = parte[0];
      renglon.textContent = parte[1];
      caja.appendChild(renglon);
    });
    contenedor.appendChild(caja);
  });
}

// Avisos de lo que el plan no pudo cubrir y de las recomendaciones de apoyo aéreo.
function escribirAvisos(plan) {
  var contenedor = document.getElementById("avisos-plan");
  contenedor.textContent = "";
  var mensajes = [];
  if (plan.sin_motobomba.length > 0) {
    mensajes.push("Sin unidad con motobomba disponible para: " + plan.sin_motobomba.join(", ") + ".");
  }
  if (plan.recomendar_apoyo_aereo.length > 0) {
    mensajes.push("Se recomienda solicitar apoyo aéreo para: " + plan.recomendar_apoyo_aereo.join(", ") +
                  ". La herramienta no lo solicita.");
  }
  mensajes.forEach(function (mensaje) {
    var parrafo = document.createElement("p");
    parrafo.className = "aviso";
    parrafo.textContent = mensaje;
    contenedor.appendChild(parrafo);
  });
}

// ---------------------------------------------------------------------------
// 5. Generar el plan
// ---------------------------------------------------------------------------

// Lo que pasa al hacer clic en "Generar plan".
function generarYMostrar() {
  var incendios = incendiosDelEscenario();
  var brigadas = brigadasDisponibles();
  var metodo = document.getElementById("metodo").value;
  var bases = {};
  rutas.bases.forEach(function (base) { bases[base.id] = base; });

  var antes = performance.now();
  var plan = generarPlan(incendios, brigadas, bases, rutas.tiempos, reglas, metodo);
  var milisegundos = Math.round((performance.now() - antes) * 10) / 10;

  capaPlan.clearLayers();
  dibujarRutas(plan, incendios);
  dibujarIncendios(incendios);          // los incendios al final, para que queden encima de las rutas
  encuadrar(incendios);
  escribirMetricas(metricasDelPlan(plan, incendios, reglas), milisegundos);
  escribirIncendios(plan, incendios);
  escribirAsignaciones(plan);
  escribirAvisos(plan);
  document.getElementById("resultados").hidden = false;
  mostrarAviso("estado-plan", "Plan generado con el método " +
               document.getElementById("metodo").selectedOptions[0].textContent.toLowerCase() + ": " +
               incendios.length + " incendios y " + brigadas.length + " brigadas disponibles.");
}

// ---------------------------------------------------------------------------
// 6. Arranque
// ---------------------------------------------------------------------------

// Cuando ya están los tres archivos, arma la página y genera el primer plan.
function alTenerTodo() {
  if (reglas === null || rutas === null || escenarios === null) { return; }
  crearMapa();
  llenarEscenarios();
  llenarBrigadas();
  document.getElementById("generar").addEventListener("click", generarYMostrar);
  document.getElementById("escenario").addEventListener("change", generarYMostrar);
  document.getElementById("metodo").addEventListener("change", generarYMostrar);
  generarYMostrar();
}

// Punto de partida de la página.
function iniciarPagina() {
  dibujarMenu();
  if (typeof L === "undefined") {
    mostrarAviso("estado-plan", "No se pudo cargar el mapa. Revisa tu conexión a internet y vuelve a abrir la página.");
    return;
  }
  var alFallar = function (mensaje) { mostrarAviso("estado-plan", mensaje); };
  cargarJSON("datos/reglas.json", function (datos) { reglas = datos; alTenerTodo(); }, alFallar);
  cargarJSON("datos/rutas_piloto.json", function (datos) { rutas = datos; alTenerTodo(); }, alFallar);
  cargarJSON("datos/escenarios_piloto.json", function (datos) { escenarios = datos; alTenerTodo(); }, alFallar);
}

iniciarPagina();
