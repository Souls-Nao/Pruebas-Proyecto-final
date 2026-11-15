# plan_ataque.py
# El mismo reparto de brigadas que hace web/js/plan.js, pero en Python. Sirve para dos cosas:
# comprobar con pruebas que el reparto es correcto y, más adelante, evaluar muchos escenarios
# sin abrir el navegador (script 08). Si se cambia una regla aquí, hay que cambiarla en plan.js.
# Lee:     nada (recibe listas y diccionarios).
# Escribe: nada.
# Uso:     no se corre solo; lo usan pruebas/probar_plan.py y, después, scripts/08_evaluar.py.
#
# Métodos: "hungaro" (propuesta), "voraz" y "cercana" (referencias).
# Aquí el húngaro lo resuelve la librería SciPy; en plan.js está escrito paso a paso. Deben dar
# el mismo tiempo total: eso es lo que comprueba pruebas/probar_plan.py.

import math

from scipy.optimize import linear_sum_assignment

import config


def demanda_de(incendio):
    """Devuelve lo que pide un incendio según la tabla de respuesta."""
    return config.TABLA_RESPUESTA[incendio["nivel"]]


def minutos_desde(tiempos, incendio_id, base_id):
    """Minutos que tarda una base en llegar por camino a un incendio. Si no hay camino, infinito."""
    return tiempos.get(incendio_id, {}).get(base_id, math.inf)


def llegada_mas_rapida(tiempos, incendio_id):
    """Minutos de la base que llega más rápido a un incendio."""
    return min(tiempos.get(incendio_id, {}).values(), default=math.inf)


def distancia_en_linea_recta(lat1, lon1, lat2, lon2):
    """Distancia en línea recta entre dos lugares, en kilómetros (fórmula del haversine)."""
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (math.sin(d_lat / 2) ** 2
         + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lon / 2) ** 2)
    return 6371 * 2 * math.asin(math.sqrt(a))     # 6371 km es el radio de la Tierra


def orden_de_atencion(incendios, tiempos):
    """Ordena los incendios: primero el nivel más grave; a igual nivel, el que se alcanza más rápido."""
    return sorted(incendios, key=lambda incendio: (-config.NIVELES.index(incendio["nivel"]),
                                                   llegada_mas_rapida(tiempos, incendio["id"])))


def tomar_la_mas_rapida(libres, tiempos, incendio_id):
    """Saca de la lista de libres la brigada que llega más rápido a un incendio; None si ninguna llega."""
    alcanzan = [b for b in libres if minutos_desde(tiempos, incendio_id, b["base"]) < math.inf]
    if not alcanzan:
        return None
    mejor = min(alcanzan, key=lambda b: minutos_desde(tiempos, incendio_id, b["base"]))
    libres.remove(mejor)
    return mejor


def nueva_asignacion(brigada, incendio, tiempos):
    """Arma el renglón de una asignación: qué brigada va a qué incendio y cuánto tarda."""
    return {"brigada": brigada["id"], "base": brigada["base"], "tipo": brigada["tipo"],
            "incendio": incendio["id"], "minutos": minutos_desde(tiempos, incendio["id"], brigada["base"])}


def repartir_voraz(en_orden, libres, tiempos, asignaciones):
    """Método voraz: en el orden de atención, cada incendio toma las brigadas libres más rápidas."""
    faltantes = {}
    for incendio in en_orden:
        pedidas = demanda_de(incendio)["brigadas"]
        dadas = 0
        while dadas < pedidas:
            brigada = tomar_la_mas_rapida(libres, tiempos, incendio["id"])
            if brigada is None:
                break
            asignaciones.append(nueva_asignacion(brigada, incendio, tiempos))
            dadas += 1
        faltantes[incendio["id"]] = pedidas - dadas
    return faltantes


def repartir_mas_cercana(incendios, libres, bases, tiempos, asignaciones):
    """Referencia: UNA brigada por incendio, por orden de detección, la más cercana en línea recta."""
    faltantes = {}
    for incendio in sorted(incendios, key=lambda i: i["inicio"]):
        pedidas = demanda_de(incendio)["brigadas"]
        if not libres:
            faltantes[incendio["id"]] = pedidas
            continue
        brigada = min(libres, key=lambda b: distancia_en_linea_recta(
            bases[b["base"]]["lat"], bases[b["base"]]["lon"], incendio["lat"], incendio["lon"]))
        libres.remove(brigada)
        asignaciones.append(nueva_asignacion(brigada, incendio, tiempos))
        faltantes[incendio["id"]] = pedidas - 1
    return faltantes


def costo_de(brigada, incendio, tiempos):
    """Costo de mandar una brigada a un lugar: minutos de llegada por el peso del nivel."""
    # Si la brigada es ficticia (None) o no puede llegar, cuesta como dejar el lugar sin cubrir.
    minutos = math.inf if brigada is None else minutos_desde(tiempos, incendio["id"], brigada["base"])
    if minutos == math.inf:
        minutos = config.MINUTOS_SIN_CUBRIR
    return minutos * config.PESO_NIVEL[incendio["nivel"]]


def repartir_hungaro(incendios, libres, tiempos, asignaciones):
    """Método húngaro con columnas repetidas: busca el reparto de menor tiempo total ponderado."""
    # Un incendio que pide 3 brigadas aparece 3 veces en la lista de lugares por cubrir.
    lugares = [incendio for incendio in incendios for _ in range(demanda_de(incendio)["brigadas"])]
    # La tabla debe ser cuadrada: se completa con brigadas ficticias (None) o con lugares ficticios.
    n = max(len(libres), len(lugares))
    filas = libres + [None] * (n - len(libres))
    costos = [[costo_de(brigada, lugares[c], tiempos) if c < len(lugares) else 0 for c in range(n)]
              for brigada in filas]
    _, columna_de = linear_sum_assignment(costos)
    faltantes = {incendio["id"]: demanda_de(incendio)["brigadas"] for incendio in incendios}
    for brigada, columna in zip(libres, columna_de):
        # Solo cuenta si le tocó un lugar real y sí puede llegar.
        if columna < len(lugares) and minutos_desde(tiempos, lugares[columna]["id"], brigada["base"]) < math.inf:
            asignaciones.append(nueva_asignacion(brigada, lugares[columna], tiempos))
            faltantes[lugares[columna]["id"]] -= 1
    return faltantes


def repartir_motobombas(en_orden, libres, tiempos, asignaciones):
    """Da a cada incendio que la pide la unidad con motobomba libre que llega más rápido."""
    sin_motobomba = []
    for incendio in en_orden:
        if not demanda_de(incendio)["motobomba"]:
            continue
        unidad = tomar_la_mas_rapida(libres, tiempos, incendio["id"])
        if unidad is None:
            sin_motobomba.append(incendio["id"])
        else:
            asignaciones.append(nueva_asignacion(unidad, incendio, tiempos))
    return sin_motobomba


def generar_plan(incendios, brigadas, bases, tiempos, metodo="voraz"):
    """Genera el plan de ataque con el método indicado. Devuelve un diccionario con el resultado."""
    terrestres = [b for b in brigadas if b["tipo"] == "terrestre"]
    motobombas = [b for b in brigadas if b["tipo"] == "motobomba"]
    en_orden = orden_de_atencion(incendios, tiempos)
    asignaciones = []
    if metodo == "hungaro":
        faltantes = repartir_hungaro(en_orden, terrestres, tiempos, asignaciones)
    elif metodo == "voraz":
        faltantes = repartir_voraz(en_orden, terrestres, tiempos, asignaciones)
    elif metodo == "cercana":
        faltantes = repartir_mas_cercana(incendios, terrestres, bases, tiempos, asignaciones)
    else:
        raise SystemExit(f'El método "{metodo}" no existe. Usa "hungaro", "voraz" o "cercana".')
    sin_motobomba = repartir_motobombas(en_orden, motobombas, tiempos, asignaciones)
    return {
        "metodo": metodo,
        "orden": [incendio["id"] for incendio in en_orden],
        "asignaciones": asignaciones,
        "brigadas_faltantes": faltantes,
        "sin_motobomba": sin_motobomba,
        # La herramienta solo RECOMIENDA pedir apoyo aéreo; no lo asigna ni lo solicita.
        "recomendar_apoyo_aereo": [i["id"] for i in en_orden if demanda_de(i)["apoyo_aereo"]],
    }


def metricas_del_plan(plan, incendios):
    """Mide un plan, para comparar los tres métodos con los mismos incendios y brigadas."""
    nivel_de = {incendio["id"]: incendio["nivel"] for incendio in incendios}
    pedidas = sum(demanda_de(incendio)["brigadas"] for incendio in incendios)
    terrestres = [a for a in plan["asignaciones"] if a["tipo"] == "terrestre"]
    # 1. Tiempo total ponderado: minutos de cada brigada por el peso del nivel de su incendio.
    ponderado = sum(a["minutos"] * config.PESO_NIVEL[nivel_de[a["incendio"]]] for a in terrestres)
    # 2. Primera llegada a los incendios graves (altos y críticos).
    primera_llegada = {}
    for a in terrestres:
        primera_llegada[a["incendio"]] = min(a["minutos"], primera_llegada.get(a["incendio"], math.inf))
    graves = [i["id"] for i in incendios if i["nivel"] in ("alto", "critico")]
    atendidos = [primera_llegada[i] for i in graves if i in primera_llegada]
    return {
        "tiempo_ponderado": round(ponderado, 1),
        "brigadas_pedidas": pedidas,
        "brigadas_asignadas": len(terrestres),
        # 3. Parte de la demanda de brigadas que sí se cubrió.
        "demanda_cubierta_pct": 100 if pedidas == 0 else round(100 * len(terrestres) / pedidas),
        "primera_llegada_graves_min": round(sum(atendidos) / len(atendidos), 1) if atendidos else None,
        "graves_sin_brigada": len(graves) - len(atendidos),
    }
