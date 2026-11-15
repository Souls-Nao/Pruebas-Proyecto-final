/*
  probar.js · Código de la página "Probar clasificación" (versión 1)
  Qué hace:  toma los datos de un incendio inventado que escribe el usuario y le aplica las
             MISMAS reglas que scripts/05_clasificar.py: paso A (¿real o falsa alarma?), paso B
             (nivel de severidad) y regla de seguridad. Muestra el resultado con sus razones y
             los recursos que recomienda la tabla de respuesta.
  Qué lee:   datos/reglas.json (los números de las reglas; los copia el script 07 de config.py).
  Qué usa:   js/comun.js (menú, carga de JSON, colores y nombres de nivel).
  Cómo se prueba: abrir la página, elegir un ejemplo y hacer clic en "Clasificar".
*/

// Los números de las reglas. Se llenan al cargar datos/reglas.json.
var reglas = null;

// ---------------------------------------------------------------------------
// 1. Las reglas (igual que en scripts/05_clasificar.py)
// ---------------------------------------------------------------------------

// Cuenta cuántos cortes de la lista alcanza un valor. Con [5, 15, 40], un 20 alcanza 2.
function cortesAlcanzados(valor, cortes) {
  return cortes.filter(function (corte) { return valor >= corte; }).length;
}

// Paso A: decide si el incendio es real. Devuelve {esReal, regla, razon}.
function pasoA(incendio) {
  if (incendio.fuente_fija) {
    return { esReal: false, regla: "fuente_fija", razon: "Fuente fija: el lugar tiene puntos de calor casi todo el año" };
  }
  if (incendio.es_forestal && incendio.n_pasadas >= reglas.pasadas_minimas_real) {
    return { esReal: true, regla: "forestal_persistente",
             razon: "Terreno forestal y visto en " + incendio.n_pasadas + " pasadas de satélite" };
  }
  if (incendio.n_puntos >= reglas.puntos_minimos_real) {
    return { esReal: true, regla: "grupo_grande", razon: "Grupo grande: " + incendio.n_puntos + " puntos de calor" };
  }
  if (incendio.es_forestal) {
    return { esReal: false, regla: "forestal_una_pasada", razon: "Terreno forestal, pero visto en una sola pasada de satélite" };
  }
  return { esReal: false, regla: "no_forestal", razon: "Terreno no forestal" };
}

// Paso B: suma los puntos de severidad. Devuelve {puntaje, razones}.
function puntajeSeveridad(incendio) {
  var puntaje = 0;
  var razones = [];
  var puntos = cortesAlcanzados(incendio.n_puntos, reglas.puntos_severidad);
  if (puntos > 0) { puntaje += puntos; razones.push(incendio.n_puntos + " puntos de calor (+" + puntos + ")"); }
  puntos = cortesAlcanzados(incendio.frp_max, reglas.frp_severidad);
  if (puntos > 0) { puntaje += puntos; razones.push("Intensidad máxima de " + incendio.frp_max + " MW (+" + puntos + ")"); }
  if (incendio.duracion_horas >= reglas.duracion_severidad_h) {
    puntaje += 1;
    razones.push("Duró " + incendio.duracion_horas + " horas (+1)");
  }
  if (incendio.en_area_protegida) {
    puntaje += 1;
    razones.push("Dentro de un área natural protegida (+1)");
  }
  if (incendio.dist_localidad_km >= reglas.distancia_lejos_km) {
    puntaje += 1;
    razones.push("Lejos de poblaciones: a " + incendio.dist_localidad_km + " km de la más cercana (+1)");
  }
  return { puntaje: puntaje, razones: razones };
}

// Convierte el puntaje en nivel: 0 bajo, 1-2 medio, 3-4 alto, 5 o más crítico.
function nivelPorPuntaje(puntaje) {
  return reglas.niveles[cortesAlcanzados(puntaje, reglas.puntaje_minimo_nivel)];
}

// Regla de seguridad: muy cerca de una localidad, el nivel sube al menos a alto.
// Devuelve {nivel, razon}; razon es null si la regla no cambió nada.
function aplicarReglaSeguridad(nivel, incendio) {
  var cerca = incendio.dist_localidad_km < reglas.distancia_seguridad_km;
  var esMenor = reglas.niveles.indexOf(nivel) < reglas.niveles.indexOf(reglas.nivel_minimo_seguridad);
  if (cerca && esMenor) {
    return { nivel: reglas.nivel_minimo_seguridad,
             razon: "Regla de seguridad: a " + incendio.dist_localidad_km + " km de una localidad, sube a nivel " +
                    reglas.nivel_minimo_seguridad };
  }
  return { nivel: nivel, razon: null };
}

// Clasifica un incendio con los pasos A y B. Devuelve {es_real, prob_real, nivel, puntaje, razones}.
function clasificarConReglas(incendio) {
  var a = pasoA(incendio);
  var resultado = { es_real: a.esReal, prob_real: reglas.prob_real[a.regla], nivel: null, puntaje: 0, razones: [a.razon] };
  // El paso B solo se aplica a los incendios que el paso A considera reales.
  if (a.esReal) {
    var b = puntajeSeveridad(incendio);
    var seguridad = aplicarReglaSeguridad(nivelPorPuntaje(b.puntaje), incendio);
    resultado.razones = resultado.razones.concat(b.razones);
    if (seguridad.razon) { resultado.razones.push(seguridad.razon); }
    resultado.nivel = seguridad.nivel;
    resultado.puntaje = b.puntaje;
  }
  return resultado;
}

// ---------------------------------------------------------------------------
// 2. Formulario
// ---------------------------------------------------------------------------

// Incendios de ejemplo para llenar el formulario con un clic. Son inventados.
var EJEMPLOS = {
  bosque: { n_puntos: 22, n_pasadas: 4, duracion_horas: 30, frp_max: 85, dist_localidad_km: 6.5,
            es_forestal: true, fuente_fija: false, en_area_protegida: true },
  agricola: { n_puntos: 3, n_pasadas: 2, duracion_horas: 2, frp_max: 12, dist_localidad_km: 2.5,
              es_forestal: false, fuente_fija: false, en_area_protegida: false },
  industria: { n_puntos: 4, n_pasadas: 3, duracion_horas: 20, frp_max: 6, dist_localidad_km: 1.5,
               es_forestal: false, fuente_fija: true, en_area_protegida: false },
  pueblo: { n_puntos: 2, n_pasadas: 2, duracion_horas: 3, frp_max: 9, dist_localidad_km: 0.6,
            es_forestal: true, fuente_fija: false, en_area_protegida: false }
};

var CAMPOS_DE_NUMERO = ["n_puntos", "n_pasadas", "duracion_horas", "frp_max", "dist_localidad_km"];
var CAMPOS_DE_CASILLA = ["es_forestal", "fuente_fija", "en_area_protegida"];

// Lee lo que el usuario escribió y lo devuelve como un incendio.
function leerFormulario() {
  var incendio = {};
  CAMPOS_DE_NUMERO.forEach(function (campo) { incendio[campo] = Number(document.getElementById(campo).value); });
  CAMPOS_DE_CASILLA.forEach(function (campo) { incendio[campo] = document.getElementById(campo).checked; });
  return incendio;
}

// Llena el formulario con uno de los ejemplos.
function ponerEjemplo(nombre) {
  var ejemplo = EJEMPLOS[nombre];
  CAMPOS_DE_NUMERO.forEach(function (campo) { document.getElementById(campo).value = ejemplo[campo]; });
  CAMPOS_DE_CASILLA.forEach(function (campo) { document.getElementById(campo).checked = ejemplo[campo]; });
  clasificarFormulario();
}

// Revisa que los datos tengan sentido. Devuelve un mensaje de error, o "" si todo está bien.
function revisarDatos(incendio) {
  if (incendio.n_puntos < 1 || incendio.n_pasadas < 1) {
    return "Un incendio tiene al menos 1 punto de calor y 1 pasada de satélite.";
  }
  if (incendio.n_pasadas > incendio.n_puntos) {
    return "No puede haber más pasadas que puntos de calor: cada pasada deja al menos un punto.";
  }
  if (incendio.duracion_horas < 0 || incendio.frp_max < 0 || incendio.dist_localidad_km < 0) {
    return "La duración, la intensidad y la distancia no pueden ser negativas.";
  }
  return "";
}

// ---------------------------------------------------------------------------
// 3. Mostrar el resultado
// ---------------------------------------------------------------------------

// Escribe en palabras los recursos que recomienda la tabla de respuesta para un nivel.
function textoDeRespuesta(nivel) {
  var respuesta = reglas.tabla_respuesta[nivel];
  var texto = respuesta.brigadas + (respuesta.brigadas === 1 ? " brigada terrestre" : " brigadas terrestres");
  if (respuesta.motobomba) { texto += ", una unidad con motobomba"; }
  if (respuesta.apoyo_aereo) { texto += " y se recomienda solicitar apoyo aéreo"; }
  return texto + ".";
}

// Agrega un elemento con texto dentro de otro. Devuelve el elemento nuevo.
function agregarTexto(padre, etiqueta, texto, clase) {
  var elemento = document.createElement(etiqueta);
  elemento.textContent = texto;
  if (clase) { elemento.className = clase; }
  padre.appendChild(elemento);
  return elemento;
}

// Dibuja el recuadro del resultado.
function mostrarResultado(resultado) {
  var caja = document.getElementById("resultado");
  caja.textContent = "";
  var nivelDePintura = resultado.es_real ? resultado.nivel : "falsa";
  caja.className = "resultado";
  caja.style.borderLeftColor = COLORES_NIVEL[nivelDePintura];
  var titulo = resultado.es_real ? "Incendio real · nivel " + NOMBRES_NIVEL[resultado.nivel].toLowerCase()
                                 : "Probable falsa alarma";
  agregarTexto(caja, "h2", titulo);
  if (resultado.es_real) {
    agregarTexto(caja, "p", "Puntaje de severidad: " + resultado.puntaje + " (0 es bajo; 1 o 2, medio; 3 o 4, alto; 5 o más, crítico).");
  }
  agregarTexto(caja, "p", "Por qué:", "resultado-subtitulo");
  var lista = document.createElement("ul");
  resultado.razones.forEach(function (razon) { agregarTexto(lista, "li", razon); });
  caja.appendChild(lista);
  if (resultado.es_real) {
    agregarTexto(caja, "p", "Respuesta recomendada:", "resultado-subtitulo");
    agregarTexto(caja, "p", textoDeRespuesta(resultado.nivel));
  }
  agregarTexto(caja, "p", "De los casos parecidos de 2024, el " + Math.round(resultado.prob_real * 100) +
                          " % coincidió con un incendio registrado por CONAFOR.", "nota");
}

// Lo que pasa al hacer clic en "Clasificar".
function clasificarFormulario() {
  var incendio = leerFormulario();
  var error = revisarDatos(incendio);
  if (error) {
    mostrarAviso("resultado", error);
    return;
  }
  mostrarResultado(clasificarConReglas(incendio));
}

// ---------------------------------------------------------------------------
// 4. Arranque
// ---------------------------------------------------------------------------

// Conecta los botones con sus funciones.
function conectarBotones() {
  document.getElementById("formulario").addEventListener("submit", function (evento) {
    evento.preventDefault();          // evita que el navegador recargue la página
    clasificarFormulario();
  });
  document.querySelectorAll("#ejemplos button").forEach(function (boton) {
    boton.addEventListener("click", function () { ponerEjemplo(boton.value); });
  });
}

// Punto de partida de la página.
function iniciarPagina() {
  dibujarMenu();
  cargarJSON("datos/reglas.json",
    function (datos) {
      reglas = datos;
      conectarBotones();
      ponerEjemplo("bosque");       // la página abre con un ejemplo ya clasificado
    },
    function (mensaje) { mostrarAviso("resultado", mensaje); });
}

// En el navegador arranca la página. (La condición permite probar las reglas fuera del navegador.)
if (typeof document !== "undefined") {
  iniciarPagina();
}
