# Product Backlog (versión 3, por sprints)

> **Replanificado el 12 de noviembre de 2026.** El proyecto se presenta como **sprint el jueves 19 de noviembre**, donde debe mostrarse el **70 %** terminado, y se entrega completo el **jueves 26 de noviembre**. Por eso el backlog pasa de fases a **dos sprints**. Las tareas son las mismas de la versión 2; cambió cuándo se hacen. Fuente principal: [CONTEXTO_COMPLETO.md](CONTEXTO_COMPLETO.md).
> Cada tarea se traza a un **objetivo particular (OP)** y tiene **criterio de aceptación**: si no se puede comprobar, no está terminada.
> **Definición de terminado:** el script o la página funciona con datos reales o de ejemplo marcados; las pruebas de `pruebas/` pasan (cuando aplican); el integrante que la sube la entiende y la puede explicar; la bitácora está al día.
> Cada fila es una tarjeta del **tablero**: <https://github.com/users/Souls-Nao/projects/7>. El reparto día por día está en `CONTEXTO_COMPLETO.md`, sección 16.

## Cómo se mide el avance

- **Estados del tablero:** Backlog → Por hacer → En progreso → En revision → Terminado.
- **Puntos:** esfuerzo relativo estimado por el equipo (1 = muy fácil, 2 = fácil, 3 = medio, 5 = grande). Son una estimación, no una medida exacta.
- **El 70 %** se cuenta en puntos terminados sobre el total.

| Sprint | Fechas | Qué se muestra | Puntos | % del total |
| --- | --- | --- | --- | --- |
| **Sprint 1** | jue 12 – jue 19 nov | Datos reales, clasificación por reglas en todo Jalisco, mapa de incendios, página “Probar” y plan de ataque con los tres métodos en la región piloto | 73 | 69.5 % |
| **Sprint 2** | vie 20 – jue 26 nov | Evaluación (E1 a E5), bosque aleatorio, clima, página “Resultados”, informe final, presentación y `v1.0` | 32 | 30.5 % |
| **Total** | | | **105** | 100 % |

Los identificadores (F1-1, F2-4…) conservan la fase a la que pertenece cada tarea: F1 datos y base del sitio, F2 clasificación, F3 plan de ataque, F4 evaluación y F5 cierre.

## F0 · Definición ✅

| ID | Tarea | Estado |
| --- | --- | --- |
| F0-1 | Actividad 03 (planteamiento, OG y OP) | ✅ entregada (la Parte 7, revisión cruzada, quedó sin llenar) |
| F0-2 | Análisis crítico de la propuesta Gemini | ✅ |
| F0-3 | Arquitectura, plan de evaluación y roadmap v1 | ✅ |
| F0-4 | Enfoque v2: clasificación + plan de ataque | ✅ 12 nov |
| F0-5 | Código sencillo y sitio estático (decisiones D10 a D12) | ✅ 12 nov |
| F0-6 | Replanificación por sprints (70 % el 19 nov, entrega el 26 nov) | ✅ 12 nov |

## Sprint 1 · jueves 12 al jueves 19 de noviembre · 73 puntos (70 %)

**Objetivo del sprint:** que el profesor pueda abrir el sitio publicado, ver los incendios de Jalisco clasificados por nivel y generar un plan de ataque en la región piloto.

| ID | Tarea | Criterio de aceptación | OP | Responsable sugerido | Pts |
| --- | --- | --- | --- | --- | --- |
| F1-1 | Entorno, repositorio y tablero | Python 3.12 con las librerías de `requirements.txt`; repositorio **público** en GitHub con GitHub Pages activo; tablero con las tarjetas del backlog. | OP1 | Johan | 2 |
| F1-2 | `scripts/config.py` | Jalisco, región piloto, EPSG:32613, rutas de archivos y fuentes de datos; cada valor con su fuente o “valor inicial”. | OP1 | Oswaldo | 1 |
| F1-3 | Registros de CONAFOR 2024–2025 · `scripts/02_preparar_conafor.py` | Archivo limpio en `datos/procesados/` con fuente; informe de qué campos trae (coordenadas, fecha, superficie). | OP1 | Omar | 3 |
| F1-4 | FIRMS 2024–2025 de Jalisco · `scripts/01_descargar_firms.py` | VIIRS y MODIS recortados a Jalisco, confianza normalizada a 0–1, guardados en CSV. | OP1 | Oswaldo | 3 |
| F1-5 | Fuentes complementarias | Localidades, uso de suelo y vegetación y áreas protegidas de Jalisco, con fuente y fecha, listas para el script 04. | OP1 | Oswaldo | 3 |
| F1-7 | Sitio base | `index.html` (raíz) redirige a `web/`; `web/index.html` muestra el mapa de Jalisco con el menú; `web/acerca.html`. | OP3 | Johan y Omar | 3 |
| F1-8 | Análisis exploratorio | `reportes/analisis_datos.md`: qué trae cada fuente, cuántos candidatos coinciden con CONAFOR, distribución de superficies, variables candidatas. | OP1 | Cuauhtémoc | 3 |
| F2-1 | `scripts/03_agrupar_incendios.py` | DBSCAN espacio-temporal; comprobado con un caso pequeño (dos incendios separados, uno que dura varios días). | OP3 | Oswaldo | 3 |
| F2-2 | `scripts/04_calcular_variables.py` | Variables de la sección 11.2 del contexto para 2024 y 2025 (las de clima entran en el Sprint 2). | OP1 | Omar | 5 |
| F2-3 | Etiquetas real/falsa | Cruce con CONAFOR con tolerancia documentada; conteo por clase. | OP1 | Omar | 2 |
| F2-4 | `scripts/05_clasificar.py` · paso A por reglas | Reglas que deciden si un candidato es incendio real o falsa alarma, con salida `es_real` y `prob_real`; ajustadas con 2024 y probadas con 2025. | OP3 | Omar | 2 |
| F2-5 | Cortes de severidad | Cuatro niveles definidos con los datos de 2024; justificación escrita. | OP2 | Omar | 2 |
| F2-6 | `scripts/05_clasificar.py` · paso B por reglas | Puntaje por reglas para los cuatro niveles; regla de seguridad por cercanía a localidades; `razones` por incendio. | OP3 | Omar | 3 |
| F2-7 | Tabla de respuesta | En `config.py`, con justificación; si es posible, revisada por un brigadista. | OP2 | Omar | 1 |
| F2-8 | `scripts/07_exportar_web.py` | `web/datos/incendios_2024.json` e `incendios_2025.json` con el formato de la sección 14 del contexto. | OP3 | Oswaldo | 3 |
| F2-9 | Página del mapa | `web/index.html` + `web/js/mapa.js`: selector de fecha, colores por nivel, filtro, ficha con razones. | OP3 | Johan | 5 |
| F2-10 | Página “Probar clasificación” | `web/probar.html` + `web/js/probar.js` con las mismas reglas que el script 05. | OP3 | Johan | 3 |
| F2-11 | `pruebas/probar_clasificacion.py` | Casos con resultado conocido para las reglas de los pasos A y B. | OP3 | Omar | 1 |
| F2-12 | `docs/05_modelo_de_decision.md` | Entregable OP2: reglas, variables, cortes, tabla de respuesta y plan de ataque. | OP2 | Cuauhtémoc | 3 |
| F3-1 | Bases de brigadas | `datos/referencia/bases.csv` con fuente o marca “hipotética”. | OP1 | Oswaldo | 1 |
| F3-2 | `scripts/06_rutas_region_piloto.py` | Red vial de la región piloto, punto de acceso por incendio, tiempos y rutas en `web/datos/rutas_piloto.json`. | OP3 | Oswaldo | 5 |
| F3-3 | Escenarios reales | `web/datos/escenarios_piloto.json` con días reales de 2 o más incendios simultáneos en la región piloto. | OP3 | Oswaldo | 2 |
| F3-4 | `web/js/plan.js` | Demanda por nivel, orden de atención, húngaro con columnas repetidas, voraz y más cercana; métricas del plan. | OP3 | Omar | 5 |
| F3-5 | `pruebas/probar_plan.py` | El mismo caso pequeño que `plan.js`, con el óptimo conocido calculado a mano. | OP3 | Omar | 2 |
| F3-6 | Página “Plan de ataque” | `web/plan.html`: escenario, brigadas disponibles, método, rutas, tabla, métricas y comparación de los tres métodos. | OP3 | Johan | 5 |
| R-01 | Revisión del Sprint 1 (jueves 19 de noviembre) | Presentación del sprint con el sitio publicado funcionando: mapa de incendios clasificados y plan de ataque en la región piloto; qué se terminó, qué no y qué sigue. | — | Todos | 2 |

## Sprint 2 · viernes 20 al jueves 26 de noviembre · 32 puntos (30 %)

**Objetivo del sprint:** demostrar con números que la herramienta clasifica bien y que el plan reduce los tiempos, y cerrar el proyecto.

| ID | Tarea | Criterio de aceptación | OP | Responsable sugerido | Pts |
| --- | --- | --- | --- | --- | --- |
| F1-6 | Clima histórico | Viento, humedad y temperatura por incendio, o plan B registrado. | OP1 | Oswaldo | 3 |
| F2-13 | Bosque aleatorio (pasos A y B) | `scripts/05_clasificar.py` con `metodo="bosque"`: misma salida que las reglas; entrenado con 2024 y probado con 2025; regla de seguridad aplicada después. | OP3 | Omar | 5 |
| F3-7 | Escenarios de prueba | Escenarios de 5, 10 y 20 incendios en `web/datos/escenarios_piloto.json`, marcados como de prueba. | OP3 | Oswaldo | 2 |
| F4-1 | `scripts/08_evaluar.py` | Calcula E1 a E3 y escribe `web/datos/resultados.json` y `reportes/evaluacion.md`. | OP4 | Cuauhtémoc | 3 |
| F4-2 | E1: real o falsa alarma | Precisión, sensibilidad, F1 y matriz por método; revisión manual de 30 casos. | OP4 | Cuauhtémoc | 2 |
| F4-3 | E2: severidad | Exactitud, exactitud ±1 nivel y matriz por método. | OP4 | Cuauhtémoc | 2 |
| F4-4 | E3: plan de ataque | Tabla por estrategia y escenario. | OP4 | Cuauhtémoc | 2 |
| F4-5 | E4: tiempo de respuesta | Medido en el navegador; criterio de 10 s verificado. | OP4 | Cuauhtémoc | 1 |
| F4-6 | E5: prueba de uso | Protocolo, resultados y limitaciones. | OP4 | Cuauhtémoc | 3 |
| F4-7 | Página “Resultados” | `web/resultados.html` + `web/js/resultados.js`. | OP4 | Johan | 3 |
| F5-1 | Informe final | Problema → objetivos (v1 y v2) → método → resultados → conclusiones, con referencias. | — | Cuauhtémoc | 3 |
| F5-2 | Presentación y demo | Diapositivas y video de 3 a 5 min. | — | Todos | 2 |
| F5-3 | Versión `v1.0` | Etiqueta en GitHub, README actualizado y sitio funcionando en la URL pública. | — | Johan | 1 |

## Opcional (después de `v1.0`)

| ID | Tarea |
| --- | --- |
| X-1 | Explicación en lenguaje natural del plan |
| X-2 | Capa visual de propagación |
| X-3 | Escenarios “¿qué pasa si…?” |
| X-4 | Modo en vivo con datos recientes de FIRMS |

## Qué cambió respecto a la versión 2

| Tarea | Versión 2 | Versión 3 |
| --- | --- | --- |
| F2-4 y F2-6 (pasos A y B) | Reglas y bosque aleatorio juntos | En el Sprint 1 van las **reglas**; el bosque aleatorio pasa a la tarea nueva **F2-13** del Sprint 2 |
| F3-3 (escenarios) | Reales y de prueba juntos | En el Sprint 1 van los **reales**; los de prueba pasan a la tarea nueva **F3-7** del Sprint 2 |
| F1-6 (clima) | Fase 1 | Sprint 2: la clasificación del Sprint 1 funciona sin clima |
| F3 (plan de ataque) | Del 16 al 29 de noviembre | Entra completo en el Sprint 1 |
| R-01 | No existía | Revisión del Sprint 1 el jueves 19 |
