/*
  plan.js · Plan de ataque: reparto de brigadas entre incendios (versión 2)
  Qué hace:  1) calcula cuántos recursos pide cada incendio según su nivel (demanda),
             2) decide en qué orden atenderlos,
             3) reparte las brigadas disponibles con el método elegido:
                  "hungaro" · busca el reparto con el menor tiempo total, ponderado por nivel (propuesta)
                  "voraz"   · recorre los incendios en orden y da a cada uno sus brigadas más rápidas
                  "cercana" · una brigada por incendio, la más cercana en línea recta (referencia)
             4) y mide el plan (tiempo ponderado, demanda cubierta, llegada a los incendios graves).
  Qué recibe: listas y diccionarios ya cargados (incendios, brigadas, bases, tiempos y reglas).
             No lee archivos ni toca la página: así se puede probar por separado.
  Cómo se prueba: abrir la consola del navegador en una página que cargue este archivo y
             escribir probarPlan(). Debe responder "Todas las pruebas del plan pasaron".
*/

// ---------------------------------------------------------------------------
// 1. Demanda: qué pide cada incendio
// ---------------------------------------------------------------------------

// Devuelve lo que pide un incendio según la tabla de respuesta: {brigadas, motobomba, apoyo_aereo}.
function demandaDe(incendio, reglas) {
  return reglas.tabla_respuesta[incendio.nivel];
}

// ---------------------------------------------------------------------------
// 2. Tiempos y distancias
// ---------------------------------------------------------------------------

// Minutos que tarda una base en llegar por camino a un incendio. Si no hay camino, Infinity.
function minutosDesde(tiempos, incendioId, baseId) {
  var deEseIncendio = tiempos[incendioId] || {};
  var minutos = deEseIncendio[baseId];
  return minutos === undefined ? Infinity : minutos;
}

// Minutos de la base que llega más rápido a un incendio.
function llegadaMasRapida(tiempos, incendioId) {
  var mejor = Infinity;
  Object.keys(tiempos[incendioId] || {}).forEach(function (baseId) {
    mejor = Math.min(mejor, tiempos[incendioId][baseId]);
  });
  return mejor;
}

// Distancia en línea recta entre dos lugares, en kilómetros (fórmula del haversine).
function distanciaEnLineaRecta(lat1, lon1, lat2, lon2) {
  var aRadianes = Math.PI / 180;
  var dLat = (lat2 - lat1) * aRadianes;
  var dLon = (lon2 - lon1) * aRadianes;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * aRadianes) * Math.cos(lat2 * aRadianes) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 6371 * 2 * Math.asin(Math.sqrt(a));     // 6371 km es el radio de la Tierra
}

// ---------------------------------------------------------------------------
// 3. Orden de atención
// ---------------------------------------------------------------------------

// Ordena los incendios: primero el nivel más grave; a igual nivel, el que se alcanza más rápido.
function ordenDeAtencion(incendios, tiempos, reglas) {
  var copia = incendios.slice();          // se ordena una copia para no cambiar la lista original
  copia.sort(function (a, b) {
    var diferencia = reglas.niveles.indexOf(b.nivel) - reglas.niveles.indexOf(a.nivel);
    if (diferencia !== 0) { return diferencia; }
    return llegadaMasRapida(tiempos, a.id) - llegadaMasRapida(tiempos, b.id);
  });
  return copia;
}

// ---------------------------------------------------------------------------
// 4. Reparto
// ---------------------------------------------------------------------------

// Saca de la lista de libres la brigada que llega más rápido a un incendio y la devuelve.
// Si ninguna puede llegar, devuelve null.
function tomarLaMasRapida(libres, tiempos, incendioId) {
  var mejor = -1;
  libres.forEach(function (brigada, posicion) {
    var minutos = minutosDesde(tiempos, incendioId, brigada.base);
    if (minutos < Infinity && (mejor === -1 || minutos < minutosDesde(tiempos, incendioId, libres[mejor].base))) {
      mejor = posicion;
    }
  });
  return mejor === -1 ? null : libres.splice(mejor, 1)[0];
}

// Arma el renglón de una asignación: qué brigada va a qué incendio y cuánto tarda.
function nuevaAsignacion(brigada, incendio, tiempos) {
  return { brigada: brigada.id, base: brigada.base, tipo: brigada.tipo, incendio: incendio.id,
           minutos: minutosDesde(tiempos, incendio.id, brigada.base) };
}

// Método voraz: en el orden de atención, cada incendio toma las brigadas libres más rápidas.
// Devuelve cuántas brigadas le faltaron a cada incendio: {idDelIncendio: faltantes}.
function repartirVoraz(enOrden, libres, tiempos, reglas, asignaciones) {
  var faltantes = {};
  enOrden.forEach(function (incendio) {
    var pedidas = demandaDe(incendio, reglas).brigadas;
    var dadas = 0;
    while (dadas < pedidas) {
      var brigada = tomarLaMasRapida(libres, tiempos, incendio.id);
      if (brigada === null) { break; }
      asignaciones.push(nuevaAsignacion(brigada, incendio, tiempos));
      dadas += 1;
    }
    faltantes[incendio.id] = pedidas - dadas;
  });
  return faltantes;
}

// Saca de la lista de libres la brigada cuya base queda más cerca en línea recta de un incendio.
function tomarLaMasCercana(libres, bases, incendio) {
  var mejor = -1;
  var mejorKm = Infinity;
  libres.forEach(function (brigada, posicion) {
    var base = bases[brigada.base];
    var km = distanciaEnLineaRecta(base.lat, base.lon, incendio.lat, incendio.lon);
    if (km < mejorKm) { mejor = posicion; mejorKm = km; }
  });
  return mejor === -1 ? null : libres.splice(mejor, 1)[0];
}

// Método de referencia: UNA brigada por incendio, en el orden en que se detectaron, eligiendo
// la base más cercana en línea recta (sin mirar los caminos ni el nivel).
function repartirMasCercana(incendios, libres, bases, tiempos, reglas, asignaciones) {
  var faltantes = {};
  var porDeteccion = incendios.slice().sort(function (a, b) { return a.inicio < b.inicio ? -1 : 1; });
  porDeteccion.forEach(function (incendio) {
    var pedidas = demandaDe(incendio, reglas).brigadas;
    var brigada = tomarLaMasCercana(libres, bases, incendio);
    if (brigada !== null) { asignaciones.push(nuevaAsignacion(brigada, incendio, tiempos)); }
    faltantes[incendio.id] = pedidas - (brigada === null ? 0 : 1);
  });
  return faltantes;
}

// Reparte las unidades con motobomba: en el orden de atención, cada incendio que la pide
// recibe la unidad libre que llega más rápido. Devuelve los incendios que se quedaron sin ella.
function repartirMotobombas(enOrden, libres, tiempos, reglas, asignaciones) {
  var sinMotobomba = [];
  enOrden.forEach(function (incendio) {
    if (!demandaDe(incendio, reglas).motobomba) { return; }
    var unidad = tomarLaMasRapida(libres, tiempos, incendio.id);
    if (unidad === null) { sinMotobomba.push(incendio.id); return; }
    asignaciones.push(nuevaAsignacion(unidad, incendio, tiempos));
  });
  return sinMotobomba;
}

// ---------------------------------------------------------------------------
// 5. Método húngaro
// ---------------------------------------------------------------------------

// Algoritmo húngaro: recibe una tabla cuadrada de costos (filas contra columnas) y devuelve,
// para cada fila, la columna que le toca, de modo que la suma de los costos sea la menor posible.
// Es la versión clásica con "potenciales": u y v guardan cuánto se le ha descontado a cada fila
// y a cada columna, y en cada vuelta se agrega una fila buscando el camino más barato.
function hungaro(costos) {
  var n = costos.length;
  var u = new Array(n + 1).fill(0);            // descuento de cada fila
  var v = new Array(n + 1).fill(0);            // descuento de cada columna
  var filaDe = new Array(n + 1).fill(0);       // filaDe[columna] = fila que la ocupa (0 = libre)
  var vengoDe = new Array(n + 1).fill(0);      // por qué columna se llegó a cada columna
  for (var fila = 1; fila <= n; fila++) {
    filaDe[0] = fila;                          // la columna 0 es ficticia: ahí empieza la búsqueda
    var columna = 0;
    var minimo = new Array(n + 1).fill(Infinity);   // lo más barato visto para llegar a cada columna
    var usada = new Array(n + 1).fill(false);
    // Se avanza de columna en columna hasta encontrar una que esté libre.
    do {
      usada[columna] = true;
      var filaActual = filaDe[columna];
      var delta = Infinity;
      var siguiente = 0;
      for (var j = 1; j <= n; j++) {
        if (usada[j]) { continue; }
        var costo = costos[filaActual - 1][j - 1] - u[filaActual] - v[j];
        if (costo < minimo[j]) { minimo[j] = costo; vengoDe[j] = columna; }
        if (minimo[j] < delta) { delta = minimo[j]; siguiente = j; }
      }
      // Se ajustan los descuentos para que el siguiente paso cueste cero.
      for (var k = 0; k <= n; k++) {
        if (usada[k]) { u[filaDe[k]] += delta; v[k] -= delta; } else { minimo[k] -= delta; }
      }
      columna = siguiente;
    } while (filaDe[columna] !== 0);
    // Se recorre el camino hacia atrás, moviendo cada fila a su nueva columna.
    do {
      var anterior = vengoDe[columna];
      filaDe[columna] = filaDe[anterior];
      columna = anterior;
    } while (columna !== 0);
  }
  var columnaDe = new Array(n);
  for (var c = 1; c <= n; c++) { columnaDe[filaDe[c] - 1] = c - 1; }
  return columnaDe;
}

// Arma la lista de "lugares" a cubrir: un incendio que pide 3 brigadas aparece 3 veces.
function lugaresPorCubrir(incendios, reglas) {
  var lugares = [];
  incendios.forEach(function (incendio) {
    for (var i = 0; i < demandaDe(incendio, reglas).brigadas; i++) { lugares.push(incendio); }
  });
  return lugares;
}

// Costo de mandar una brigada a un lugar: minutos de llegada por el peso del nivel.
// Si la brigada es ficticia (null) o no puede llegar, cuesta como dejar el lugar sin cubrir.
function costoDe(brigada, incendio, tiempos, reglas) {
  var peso = reglas.peso_nivel[incendio.nivel];
  var minutos = brigada === null ? Infinity : minutosDesde(tiempos, incendio.id, brigada.base);
  return (minutos === Infinity ? reglas.minutos_sin_cubrir : minutos) * peso;
}

// Método húngaro con columnas repetidas: busca el reparto de menor tiempo total ponderado.
function repartirHungaro(incendios, libres, tiempos, reglas, asignaciones) {
  var lugares = lugaresPorCubrir(incendios, reglas);
  // La tabla debe ser cuadrada: se completa con brigadas ficticias o con lugares ficticios.
  var n = Math.max(libres.length, lugares.length);
  var costos = [];
  for (var f = 0; f < n; f++) {
    var renglon = [];
    for (var c = 0; c < n; c++) {
      // Un lugar ficticio (brigada que sobra) no cuesta nada.
      renglon.push(c < lugares.length ? costoDe(f < libres.length ? libres[f] : null, lugares[c], tiempos, reglas) : 0);
    }
    costos.push(renglon);
  }
  var columnaDe = hungaro(costos);
  var faltantes = {};
  incendios.forEach(function (incendio) { faltantes[incendio.id] = demandaDe(incendio, reglas).brigadas; });
  libres.forEach(function (brigada, f) {
    var lugar = lugares[columnaDe[f]];
    // Solo cuenta si le tocó un lugar real y sí puede llegar.
    if (lugar && minutosDesde(tiempos, lugar.id, brigada.base) < Infinity) {
      asignaciones.push(nuevaAsignacion(brigada, lugar, tiempos));
      faltantes[lugar.id] -= 1;
    }
  });
  return faltantes;
}

// ---------------------------------------------------------------------------
// 6. Plan completo
// ---------------------------------------------------------------------------

// Genera el plan de ataque con el método indicado ("hungaro", "voraz" o "cercana").
//   incendios: [{id, nivel, inicio, lat, lon}]      brigadas: [{id, base, tipo}] (solo las disponibles)
//   bases: {idDeBase: {lat, lon}}                   tiempos: {idDeIncendio: {idDeBase: minutos}}
//   reglas: lo que trae datos/reglas.json (niveles, tabla_respuesta, peso_nivel, minutos_sin_cubrir)
function generarPlan(incendios, brigadas, bases, tiempos, reglas, metodo) {
  var terrestres = brigadas.filter(function (b) { return b.tipo === "terrestre"; });
  var motobombas = brigadas.filter(function (b) { return b.tipo === "motobomba"; });
  var enOrden = ordenDeAtencion(incendios, tiempos, reglas);
  var asignaciones = [];
  var faltantes;
  if (metodo === "hungaro") {
    faltantes = repartirHungaro(enOrden, terrestres, tiempos, reglas, asignaciones);
  } else if (metodo === "voraz") {
    faltantes = repartirVoraz(enOrden, terrestres, tiempos, reglas, asignaciones);
  } else if (metodo === "cercana") {
    faltantes = repartirMasCercana(incendios, terrestres, bases, tiempos, reglas, asignaciones);
  } else {
    throw new Error('El método "' + metodo + '" no existe. Usa "hungaro", "voraz" o "cercana".');
  }
  var sinMotobomba = repartirMotobombas(enOrden, motobombas, tiempos, reglas, asignaciones);
  return {
    metodo: metodo,
    orden: enOrden.map(function (incendio) { return incendio.id; }),
    asignaciones: asignaciones,
    // Lo que no se pudo cubrir: brigadas que faltaron y unidades con motobomba que faltaron.
    brigadas_faltantes: faltantes,
    sin_motobomba: sinMotobomba,
    // La herramienta solo RECOMIENDA pedir apoyo aéreo; no lo asigna ni lo solicita.
    recomendar_apoyo_aereo: enOrden.filter(function (incendio) {
      return demandaDe(incendio, reglas).apoyo_aereo;
    }).map(function (incendio) { return incendio.id; })
  };
}

// ---------------------------------------------------------------------------
// 7. Métricas: qué tan bueno es un plan
// ---------------------------------------------------------------------------

// Mide un plan. Sirve para comparar los tres métodos con los mismos incendios y brigadas.
function metricasDelPlan(plan, incendios, reglas) {
  var nivelDe = {};
  var pedidas = 0;
  incendios.forEach(function (incendio) {
    nivelDe[incendio.id] = incendio.nivel;
    pedidas += demandaDe(incendio, reglas).brigadas;
  });
  var terrestres = plan.asignaciones.filter(function (a) { return a.tipo === "terrestre"; });
  // 1. Tiempo total ponderado: minutos de cada brigada por el peso del nivel de su incendio.
  var ponderado = 0;
  var primeraLlegada = {};        // minutos de la primera brigada que llega a cada incendio
  terrestres.forEach(function (a) {
    ponderado += a.minutos * reglas.peso_nivel[nivelDe[a.incendio]];
    primeraLlegada[a.incendio] = Math.min(a.minutos, primeraLlegada[a.incendio] === undefined ? Infinity : primeraLlegada[a.incendio]);
  });
  // 2. Primera llegada a los incendios graves (altos y críticos): promedio, y cuántos quedaron sin brigada.
  var graves = incendios.filter(function (i) { return i.nivel === "alto" || i.nivel === "critico"; });
  var atendidos = graves.filter(function (i) { return primeraLlegada[i.id] !== undefined; });
  var suma = 0;
  atendidos.forEach(function (i) { suma += primeraLlegada[i.id]; });
  return {
    tiempo_ponderado: Math.round(ponderado * 10) / 10,
    brigadas_pedidas: pedidas,
    brigadas_asignadas: terrestres.length,
    // 3. Parte de la demanda de brigadas que sí se cubrió.
    demanda_cubierta_pct: pedidas === 0 ? 100 : Math.round(100 * terrestres.length / pedidas),
    primera_llegada_graves_min: atendidos.length === 0 ? null : Math.round(10 * suma / atendidos.length) / 10,
    graves_sin_brigada: graves.length - atendidos.length
  };
}

// ---------------------------------------------------------------------------
// 8. Prueba con un caso pequeño calculado a mano
// ---------------------------------------------------------------------------

// El mismo caso está en pruebas/probar_plan.py. Si se cambia aquí, hay que cambiarlo allá.
function casoDePrueba() {
  return {
    reglas: {
      niveles: ["bajo", "medio", "alto", "critico"],
      peso_nivel: { bajo: 1, medio: 2, alto: 4, critico: 8 },
      minutos_sin_cubrir: 1000,
      tabla_respuesta: {
        bajo: { brigadas: 1, motobomba: false, apoyo_aereo: false },
        medio: { brigadas: 2, motobomba: false, apoyo_aereo: false },
        alto: { brigadas: 3, motobomba: true, apoyo_aereo: false },
        critico: { brigadas: 4, motobomba: true, apoyo_aereo: true }
      }
    },
    bases: { B1: { lat: 20.0, lon: -103.0 }, B2: { lat: 20.0, lon: -103.5 } },
    brigadas: [
      { id: "BR1", base: "B1", tipo: "terrestre" }, { id: "BR2", base: "B1", tipo: "terrestre" },
      { id: "BR3", base: "B2", tipo: "terrestre" }, { id: "BR4", base: "B2", tipo: "terrestre" }
    ],
    // I3 se detectó primero; I1 y I2 son de nivel medio (piden 2 brigadas) e I3 es bajo (pide 1).
    incendios: [
      { id: "I1", nivel: "medio", inicio: "2025-04-15T12:00", lat: 20.0, lon: -103.2 },
      { id: "I2", nivel: "medio", inicio: "2025-04-15T13:00", lat: 20.0, lon: -103.3 },
      { id: "I3", nivel: "bajo", inicio: "2025-04-15T11:00", lat: 20.0, lon: -103.1 }
    ],
    // Desde B2, el camino a I2 es muy lento (40 min) aunque en línea recta quede cerca.
    tiempos: { I1: { B1: 10, B2: 12 }, I2: { B1: 11, B2: 40 }, I3: { B1: 5, B2: 6 } }
  };
}

// Convierte las asignaciones en textos como "BR1>I1:10", ordenados por brigada, para compararlas fácil.
function resumenDeAsignaciones(plan) {
  return plan.asignaciones.map(function (a) { return a.brigada + ">" + a.incendio + ":" + a.minutos; }).sort().join(" ");
}

// Revisa que una condición se cumpla; si no, avisa cuál falló.
function comprobar(condicion, mensaje) {
  if (!condicion) { throw new Error("Falló la prueba: " + mensaje); }
}

// Corre el caso de prueba con los tres métodos y compara contra el resultado calculado a mano.
function probarPlan() {
  var c = casoDePrueba();
  // Orden de atención: los dos medios primero (I1 se alcanza en 10 min, I2 en 11) y luego el bajo.
  comprobar(ordenDeAtencion(c.incendios, c.tiempos, c.reglas).map(function (i) { return i.id; }).join(",") === "I1,I2,I3",
            "orden de atención");
  // Voraz: I1 toma las dos brigadas de B1 (10 min); a I2 le quedan las de B2 (40 min); I3 se queda sin brigada.
  var voraz = generarPlan(c.incendios, c.brigadas, c.bases, c.tiempos, c.reglas, "voraz");
  comprobar(resumenDeAsignaciones(voraz) === "BR1>I1:10 BR2>I1:10 BR3>I2:40 BR4>I2:40", "reparto voraz");
  comprobar(voraz.brigadas_faltantes.I3 === 1 && voraz.brigadas_faltantes.I1 === 0, "faltantes del voraz");
  // Más cercana: por orden de detección (I3, I1, I2), una brigada cada uno, por línea recta:
  // I3 y I1 quedan más cerca de B1; I2 queda más cerca de B2, aunque por camino tarde 40 min.
  var cercana = generarPlan(c.incendios, c.brigadas, c.bases, c.tiempos, c.reglas, "cercana");
  comprobar(resumenDeAsignaciones(cercana) === "BR1>I3:5 BR2>I1:10 BR3>I2:40", "reparto de la más cercana");
  comprobar(cercana.brigadas_faltantes.I1 === 1 && cercana.brigadas_faltantes.I2 === 1 &&
            cercana.brigadas_faltantes.I3 === 0, "faltantes de la más cercana");
  // Húngaro: cruza las brigadas. Las de B1 van a I2 (11 min) y las de B2 a I1 (12 min); I3, que es
  // el de menor nivel, se queda sin brigada. Tiempo ponderado: 2×(11+11) + 2×(12+12) = 92,
  // contra 2×(10+10) + 2×(40+40) = 200 del voraz.
  var optimo = generarPlan(c.incendios, c.brigadas, c.bases, c.tiempos, c.reglas, "hungaro");
  comprobar(resumenDeAsignaciones(optimo) === "BR1>I2:11 BR2>I2:11 BR3>I1:12 BR4>I1:12", "reparto del húngaro");
  comprobar(optimo.brigadas_faltantes.I3 === 1, "faltantes del húngaro");
  comprobar(metricasDelPlan(optimo, c.incendios, c.reglas).tiempo_ponderado === 92, "tiempo ponderado del húngaro");
  comprobar(metricasDelPlan(voraz, c.incendios, c.reglas).tiempo_ponderado === 200, "tiempo ponderado del voraz");
  comprobar(metricasDelPlan(voraz, c.incendios, c.reglas).demanda_cubierta_pct === 80, "demanda cubierta del voraz");
  comprobar(metricasDelPlan(cercana, c.incendios, c.reglas).demanda_cubierta_pct === 60, "demanda cubierta de la más cercana");
  return "Todas las pruebas del plan pasaron";
}
