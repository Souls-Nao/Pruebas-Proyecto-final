# Vigía Jalisco · Contexto completo del proyecto

> **Para quién es este archivo:** para Claude Fable (o cualquier sesión de IA o persona) que continúe el desarrollo. Contiene todo lo necesario para trabajar sin haber leído conversaciones anteriores: qué es el proyecto, qué se decidió y por qué, qué problemas ya se resolvieron, cómo debe ser el código, cómo se publica, cómo se reparte el trabajo y qué falta.
> **Fecha de corte:** jueves 12 de noviembre de 2026.
> **Idioma de trabajo:** español en todo (documentos, comentarios, mensajes de commit, interfaz y, desde esta versión, también nombres de variables y funciones).
> **Si este archivo contradice a otro documento del repositorio, manda este archivo.** Los cambios importantes se registran en la sección 5 y en `BITACORA.md`.
> **Empieza por la sección 0.**

---

## Índice

0. [Cómo empezar (para Claude Fable)](#0-cómo-empezar-para-claude-fable)
1. [Resumen en un minuto](#1-resumen-en-un-minuto)
2. [Equipo, curso y entregas](#2-equipo-curso-y-entregas)
3. [El problema](#3-el-problema)
4. [Objetivo general y objetivos particulares (versión 2)](#4-objetivo-general-y-objetivos-particulares-versión-2)
5. [Historia del proyecto y decisiones clave](#5-historia-del-proyecto-y-decisiones-clave)
6. [Problemas que ya se resolvieron](#6-problemas-que-ya-se-resolvieron)
7. [Reglas para el código: sencillo y claro](#7-reglas-para-el-código-sencillo-y-claro)
8. [Arquitectura de implementación](#8-arquitectura-de-implementación)
9. [Tecnologías](#9-tecnologías)
10. [Datos y fuentes externas](#10-datos-y-fuentes-externas)
11. [Clasificación: cómo funciona](#11-clasificación-cómo-funciona)
12. [Plan de ataque: cómo funciona](#12-plan-de-ataque-cómo-funciona)
13. [Sitio web: lo que el profesor podrá hacer](#13-sitio-web-lo-que-el-profesor-podrá-hacer)
14. [Estructura del repositorio y formato de archivos](#14-estructura-del-repositorio-y-formato-de-archivos)
15. [Plan de desarrollo: dos sprints hasta el 26 de noviembre](#15-plan-de-desarrollo-dos-sprints-hasta-el-26-de-noviembre)
16. [Trabajo por integrante y guía de GitHub](#16-trabajo-por-integrante-y-guía-de-github)
17. [Estado actual, entorno y pendientes](#17-estado-actual-entorno-y-pendientes)
18. [Riesgos y planes B](#18-riesgos-y-planes-b)
19. [Evaluación](#19-evaluación)
20. [Instrucciones para la IA que continúe](#20-instrucciones-para-la-ia-que-continúe)
21. [Glosario](#21-glosario)

---

## 0. Cómo empezar (para Claude Fable)

### 0.1 Requisito

Para encargarte de todo, tienes que trabajar en **Claude Code** con acceso a la carpeta `C:\Users\souls\Proyectos\Proyecto Final` (el repositorio está en `vigia-jalisco\` y las entregas diarias van en `entregas_por_dia\`). En un chat sin acceso a archivos solo podrías dar código para copiar a mano: si ese es el caso, díselo al usuario antes de empezar.

### 0.2 Primer mensaje sugerido (lo escribe el usuario)

> Lee `CONTEXTO_COMPLETO.md` y `CLAUDE.md` en `vigia-jalisco`. Te encargas del desarrollo completo de Vigía Jalisco siguiendo esas reglas. Empieza con la sección 0.3 y avísame cuando necesites algo de nosotros.

### 0.3 Primera tarea, en este orden

1. **Leer** este archivo completo, `CLAUDE.md`, `docs/01_planteamiento_y_objetivos.md` y `BACKLOG.md`.
2. **Confirmar con el usuario**, en un solo mensaje:
   - Permiso para instalar Python 3.12 con `winget install Python.Python.3.12`.
   - Quién solicitará la clave `MAP_KEY` de FIRMS (cualquier integrante, con su correo; llega en minutos).
   - Que Johan hará `gh auth login` para crear el repositorio público.
   - Si la fecha de entrega final sigue siendo la semana del 7 al 11 de diciembre. *(Respondido el 12 nov: revisión de sprint el jueves 19 y entrega final el jueves 26 de noviembre.)*
3. **Instalar** Python y las librerías de `requirements.txt` (cuando haya permiso) y comprobar que `import geopandas, sklearn, osmnx` funciona.
4. **Revisar las fuentes de datos** de la sección 10 empezando por **CONAFOR** (fecha límite 15 nov) y FIRMS. Anotar en `BITACORA.md` qué trae cada una y qué plan B se activa.
5. **Preparar la entrega del jueves 12** (`entregas_por_dia/2026-11-12_jueves/`) según la tabla de la sección 16.4, con su `LEEME.md`.
6. **Seguir día por día** con las entregas del 13 al 16 de noviembre y después según la sección 15.

### 0.4 Qué no hacer

- No hacer commits ni pushes en nombre de los integrantes: ellos suben sus archivos.
- No instalar software, crear cuentas ni solicitar claves sin preguntar.
- No agregar tecnologías fuera de la sección 9 ni estructura de más (sección 7).
- No inventar datos ni cifras: usar datos de ejemplo marcados como tales cuando falten los reales.
- No poner enlaces privados, correos ni claves en archivos del repositorio: es público.

---

## 1. Resumen en un minuto

**Vigía Jalisco** es una herramienta web de apoyo a la decisión para incendios forestales en Jalisco, México. Hace dos cosas:

1. **Clasifica incendios** (en todo Jalisco) a partir de los puntos de calor satelitales de NASA FIRMS y de fuentes públicas (localidades, vegetación, áreas protegidas, clima):
   - **Paso A:** ¿es un incendio **real** o una **falsa alarma**?
   - **Paso B:** ¿qué **nivel de severidad** tiene? Bajo, medio, alto o crítico.
2. **Propone un plan de ataque** a las instituciones de protección (CONAFOR, SEMADET, Protección Civil, brigadas municipales) en la **región piloto** del Bosque La Primavera y el Área Metropolitana de Guadalajara: recursos según el nivel, orden de atención, qué brigadas enviar a cada incendio y por qué ruta.

La herramienta **recomienda; no actúa**. No envía alertas ni sustituye a los sistemas oficiales.

El sitio se publica en **GitHub Pages** como página estática: Python prepara los datos una vez y el navegador hace todo lo interactivo. El profesor debe poder usar todas las funciones sin instalar nada.

El código lo escribe una IA (Claude) y el equipo lo **revisa, entiende, decide y sube**. El equipo tiene poca experiencia programando, así que **el código debe ser sencillo y claro**.

---

## 2. Equipo, curso y entregas

| Dato | Valor |
| --- | --- |
| Curso | Seminario de Integración de Desarrollo |
| Profesor | Jorge Ernesto López Arce Delgado |
| Equipo | **Brigada Binaria** |
| Integrantes | Castañeda Hernández Oswaldo Daniel · Gutierrez Nava Johan Daniel · Ruvalcaba Velazquez Omar Alejandro · Soria Hernández Cuauhtémoc |
| Revisión de sprint | **Jueves 19 de noviembre de 2026:** se presenta el proyecto como sprint, con el **70 %** terminado (decidido el 12 nov). |
| Entrega final | **Jueves 26 de noviembre de 2026** (confirmado por el equipo el 12 nov). |
| Repositorio | <https://github.com/Souls-Nao/vigia-jalisco> (público) |
| Tablero | <https://github.com/users/Souls-Nao/projects/7> |

**Roles sugeridos** (el equipo puede cambiarlos; se usan en el reparto de la sección 16):

| Integrante | Rol | Por qué |
| --- | --- | --- |
| Johan | Repositorio, publicación y sitio web (mapa) | Ya tiene Git, GitHub CLI y la carpeta del proyecto en su computadora |
| Oswaldo | Datos: descarga y preparación (FIRMS, fuentes externas, red vial) | Responsable de que los datos existan y sean correctos |
| Omar | Clasificación y plan de ataque (algoritmos) | Responsable de la lógica que se evalúa |
| Cuauhtémoc | Documentación, evaluación, bitácora y presentación | Dueño del documento de la Actividad 03 en Google Docs |

**Entregas hechas:**
- *Primer avance* (≈12 oct): documento con Partes 1 a 3. El profesor señaló que **convertimos la solución (los algoritmos) en el problema**.
- *Actividad 03 · Proyecto Final 01* (18 oct): “Del problema a los objetivos”. Google Doc “Proyecto Final 01 _ Brigada _ Binaria” (dueño: Cuauhtémoc). Cada respuesta muestra **primer intento** y **versión final** con el porqué del cambio. **La Parte 7 (revisión cruzada con otro equipo) quedó sin llenar.**

---

## 3. El problema

Jalisco tiene cada año, de enero a junio, una temporada de incendios forestales. En 2025 fue el estado con más incendios del país (912 de 9,996) y acumuló 88,536 ha afectadas, según cifras preliminares de CONAFOR. El Bosque La Primavera, junto al AMG, tuvo 49 incendios y 1,936 ha dañadas. **(Cifras pendientes de referencia formal; verificar antes de citarlas en el informe final.)**

Cuando hay varios incendios a la vez, los coordinadores reciben **puntos de calor sueltos**: un incendio produce muchos puntos, hay falsas alarmas (quemas agrícolas, fuentes industriales) y la información llega varias veces al día. Con eso deben decidir rápido **cuáles son reales, qué tan graves son, cuántos recursos necesita cada uno y en qué orden atenderlos**. Hoy esa decisión depende sobre todo de la experiencia del personal y se vuelve lenta cuando los incendios se multiplican.

La detección ya existe (CONABIO, CONAFOR, NASA FIRMS, LANOT con GOES-16). **Lo que no está resuelto es el paso entre la alerta y el plan de ataque.**

> **Regla de redacción (lección del primer avance):** el problema se describe desde la situación de las personas (coordinadores, brigadistas, comunidades), nunca como “falta una aplicación” ni como “falta saber qué algoritmo es mejor”. Los algoritmos son un **medio**.

---

## 4. Objetivo general y objetivos particulares (versión 2)

**Objetivo general:**
Desarrollar una herramienta web de apoyo a la decisión que, a partir de los puntos de calor de NASA FIRMS y de información geográfica y meteorológica de fuentes públicas, clasifique los incendios de Jalisco según si son reales y su nivel de severidad, y proponga a las instituciones de protección un plan de ataque (recursos por nivel, orden de atención, asignación de brigadas y ruta de acceso) en la región piloto del Bosque La Primavera y el Área Metropolitana de Guadalajara, para reducir el tiempo de decisión y el tiempo estimado de llegada de los recursos cuando ocurren varios incendios simultáneos durante la temporada de estiaje.

| # | Objetivo particular | Bloom | Cómo se demuestra |
| --- | --- | --- | --- |
| OP1 | **Analizar** los puntos de calor de FIRMS y los registros de CONAFOR 2024–2025 de Jalisco, con fuentes complementarias, red de caminos y bases de la región piloto, para identificar las variables que distinguen un incendio real de una falsa alarma y las que se relacionan con su severidad | Analizar | `reportes/analisis_datos.md` |
| OP2 | **Diseñar** el modelo de clasificación (real/falsa y severidad) y el de plan de ataque (tabla de respuesta, orden, asignación, ruta), con métricas y estrategias de referencia | Crear | `docs/05_modelo_de_decision.md` |
| OP3 | **Implementar** la aplicación web con clasificación estatal y plan de ataque en la región piloto, con datos actuales y modo de simulación con días históricos | Aplicar | Sitio publicado en GitHub Pages |
| OP4 | **Evaluar** la clasificación contra CONAFOR y el plan contra estrategias de referencia (exactitud, tiempo de llegada, tiempo de decisión) | Evaluar | `reportes/evaluacion.md` y página de resultados |

La **versión 1** (la entregada el 18 oct) identificaba y priorizaba incendios y asignaba **una** brigada por incendio, solo en la región piloto. Está conservada al final de `docs/01_planteamiento_y_objetivos.md`. El cambio a la versión 2 se decidió el 12 nov y está justificado ahí y en `BITACORA.md`.

**Fuera de alcance:** detectar incendios; enviar alertas; clasificar por tipo (superficial, de copa, subterráneo); simular la propagación; asignar medios aéreos (solo se recomienda pedirlos); rutas fuera de la región piloto; drones.

---

## 5. Historia del proyecto y decisiones clave

| Fecha | Qué pasó | Decisión |
| --- | --- | --- |
| ≈12 oct | Primer avance entregado | — |
| ≈13 oct | Profesor: “la forma en que hablan del proyecto no es correcta según la guía” | Reescribir el problema desde los afectados |
| ≈13 oct | Un integrante generó con Gemini una arquitectura multiagente (Redis, Celery, PostGIS, LangGraph, LLM supervisor, drones, propagación física) | Analizada y **descartada** (`docs/02`) |
| 18 oct | Actividad 03 completada en Google Docs con primer intento y versión final | Objetivo v1 |
| 18 oct | Repositorio local preparado con documentación (sin código) | Pipeline sencillo + sitio estático |
| 19 oct – 11 nov | Sin avance técnico | — |
| 12 nov | El equipo redefine el enfoque | **Versión 2:** clasificación (real + severidad) y plan de ataque; cobertura mixta |
| 12 nov | El equipo pide código sencillo, sitio web usable por el profesor y entregas diarias por integrante | Secciones 7, 8, 13 y 16 de este archivo |
| 12 nov | El equipo decide que el repositorio será **público** (necesario para GitHub Pages gratis) | Sección 9 |
| 12 nov | El desarrollo pasa a Claude Fable en otra sesión de Claude Code | Sección 0 |
| 12 nov | Nuevo calendario: el jueves 19 nov se presenta un sprint con el 70 % y el jueves 26 nov es la entrega final | **Dos sprints** en lugar de cinco fases (sección 15, `BACKLOG.md` v3, `ROADMAP.md` v3) |
| 12 nov | Se crean el repositorio público y el tablero de GitHub Projects con la cuenta `Souls-Nao` | Una tarjeta (issue) por tarea del backlog, con Sprint, Puntos y OP |
| 12 nov | El equipo decide subir los archivos desde la página de GitHub, arrastrándolos, en lugar de usar comandos de Git | Sección 16.3 |
| 12 nov | Revisión de fuentes: CONAFOR publica polígonos 2024 y 2025 con fecha y superficie; FIRMS tiene archivos anuales de México sin clave | Etiquetas desde IDEFOR; FIRMS sin `MAP_KEY` (sección 10 y `BITACORA.md`) |

**Decisiones de diseño vigentes** (numeración compartida con `docs/03_arquitectura.md`):

| # | Decisión | Alternativa descartada | Razón |
| --- | --- | --- | --- |
| D1 | Scripts que se corren una vez + sitio estático | Bus de eventos, servidor | Los datos son históricos; no hace falta tiempo real para cumplir |
| D2 | Archivos (CSV, JSON) en lugar de base de datos | PostGIS | Volumen pequeño; hosting gratuito |
| D3 | Ruta al **punto de acceso** del incendio | Zona de 500 m bloqueada alrededor del fuego | La zona bloqueada hacía inalcanzable el destino |
| D4 | Modelos verificables (reglas y bosque aleatorio) | LLM que decide | Se pueden medir y reproducir |
| D5 | Clasificación en todo Jalisco; plan de ataque solo en región piloto | Todo piloto / todo estatal | Muchos casos para validar sin calcular rutas estatales |
| D6 | Publicación en GitHub Pages | Servidor propio | Gratis, URL pública, sin mantenimiento |
| D7 | Clasificación en dos pasos | Un solo índice de prioridad | Cada paso se valida contra CONAFOR |
| D8 | Varias brigadas por incendio (columnas repetidas en el algoritmo húngaro) | Una brigada por incendio | Un incendio grave necesita más recursos |
| D9 | Entrenar con 2024, probar con 2025 | Mezclar años al azar | Evita resultados demasiado optimistas |
| **D10** | **Código sencillo para principiantes** (sección 7): scripts numerados, nombres en español, sin empaquetado, sin CI ni linters | Paquete Python con `src/`, pytest, ruff y GitHub Actions | El equipo debe poder leer y explicar cada archivo |
| **D11** | **Rutas y tiempos precalculados en Python**; el navegador solo reparte brigadas y dibuja | Grafo vial completo en el navegador | El grafo pesaría decenas de MB; así el sitio es ligero |
| **D12** | Modo histórico como núcleo; modo en vivo opcional | Modo en vivo obligatorio | El curso ocurre fuera de temporada |

---

## 6. Problemas que ya se resolvieron

### 6.1 De planteamiento

| # | Problema | Cómo se resolvió |
| --- | --- | --- |
| P1 | El primer avance planteaba como necesidad “determinar qué algoritmos son mejores”: convertía la solución en el problema | Problema reescrito desde coordinadores y afectados; los algoritmos pasan a los objetivos 2 y 4 |
| P2 | Frase tipo “no existe una herramienta que integre…” | Sustituida por la limitación real: los sistemas entregan puntos sueltos, sin severidad ni recursos |
| P3 | Objetivo v1 con lista de tecnologías y varios objetivos mezclados | Un solo resultado principal, sin tecnologías en el objetivo |
| P4 | “Reducir daños” no se podía medir | Cambiado por tiempo de decisión y tiempo estimado de llegada |
| P5 | Alcance irreal (todo Jalisco con rutas, drones, propagación, multiagentes) | Región piloto para rutas; drones y propagación fuera |
| P6 | “Priorizar” era vago y no se podía validar | Clasificación en dos pasos validable contra CONAFOR (v2) |

### 6.2 Técnicos (de la propuesta Gemini y de la v1)

| # | Problema | Cómo se resolvió |
| --- | --- | --- |
| P7 | Arquitectura sobredimensionada (Redis, Celery, PostGIS, LangGraph) | Scripts + archivos + sitio estático |
| P8 | Un LLM “supervisor” decidía y alertaba a servicios de emergencia | Eliminado: decisiones con modelos medibles; la herramienta solo recomienda |
| P9 | La zona de 500 m bloqueada alrededor del fuego hacía imposible llegar | Ruta al punto de acceso más cercano al incendio |
| P10 | Agrupamiento solo espacial fusionaba incendios de días distintos | Agrupamiento espacio-temporal (distancia + ventana de horas) |
| P11 | Descartar detecciones de baja confianza borraba incendios pequeños reales | La confianza se usa como variable, no como filtro |
| P12 | Parámetros sin fuente (60 km/h, 500 m, etc.) | Todo parámetro en `config.py` con su fuente o justificación |
| P13 | Una brigada por incendio | Demanda de *k* brigadas según el nivel |
| P14 | Comparación débil contra “la más cercana en línea recta” | Se agrega la referencia voraz por nivel con tiempos reales por camino |
| P15 | El curso ocurre fuera de la temporada de incendios | Modo de simulación con días reales de 2024–2025 |
| P16 | Pocos incendios en la región piloto para validar | Clasificación en todo Jalisco (cobertura mixta) |
| P17 | Riesgo de resultados inflados al mezclar años | Entrenamiento 2024, prueba 2025 |
| P18 | El profesor debe poder usarlo sin instalar nada y sin servidor | Sitio estático en GitHub Pages con datos precalculados |
| P19 | El equipo apenas programa | Reglas de código sencillo (sección 7) |
| P20 | Tres semanas sin avance | Roadmap comprimido a 4 semanas con lista de recortes |

### 6.3 De entorno (útiles para quien continúe en esta computadora)

| # | Problema | Cómo se resolvió |
| --- | --- | --- |
| P21 | No había Git ni GitHub CLI | Instalados con winget (Git 2.55, gh 2.102) |
| P22 | No hay Python | Resuelto: el 12 nov se comprobó que Python 3.12.10 ya está instalado y se instalaron las librerías con `pip install -r requirements.txt` |
| P23 | No hay Word, Edge ni Chrome para generar PDF | Se crea un Google Doc desde HTML y se exporta a PDF con Google Drive |
| P24 | PowerShell 5.1 lee los `.ps1` sin BOM como ANSI y rompe los acentos | Scripts de PowerShell solo con ASCII o guardados con BOM; usar `[char]0x00F3` para acentos |
| P25 | Llenar el `.docx` sin Word | Edición directa del XML dentro del `.docx` |
| P26 | La carpeta se movió de `Descargas` a `C:\Users\souls\Proyectos\Proyecto Final\vigia-jalisco` | Trabajar siempre en la ruta nueva |

---

## 7. Reglas para el código: sencillo y claro

El equipo tiene poca experiencia programando y tiene que poder **explicar cada archivo** al profesor. Estas reglas mandan sobre cualquier “buena práctica” que agregue complejidad.

1. **Solo lo necesario para cumplir los objetivos.** Nada de capas, clases abstractas, patrones de diseño, configuración por variables de entorno (salvo la clave de FIRMS), registros de eventos elaborados ni optimizaciones prematuras.
2. **Scripts numerados que se corren en orden** (`scripts/01_…py`, `02_…py`, …). Cada uno lee archivos, hace una cosa y escribe archivos.
3. **Funciones cortas** (idealmente menos de 30 líneas), con un comentario arriba que diga qué hacen en una frase.
4. **Nombres en español, sin acentos ni ñ**: `calcular_distancia`, `incendios`, `nivel_severidad`, `anio`. Así el equipo entiende el código al leerlo.
5. **Comentarios en español** que expliquen el *porqué*, no lo obvio.
6. **Sin clases** salvo que de verdad simplifiquen. Diccionarios y listas.
7. **Un solo archivo de configuración** (`scripts/config.py`) con todos los números importantes y su fuente o justificación.
8. **Librerías: solo las de la sección 9.** No agregar otras sin una razón escrita en la bitácora.
9. **JavaScript sin frameworks ni compilación**: HTML + CSS + JavaScript plano, con Leaflet desde CDN. Un archivo JS por página más uno compartido.
10. **Sin CI, sin linters, sin empaquetado.** Una carpeta `pruebas/` con scripts simples que usan `assert` para lo crítico (asignación y clasificación por reglas). Se corren con `python pruebas/probar_plan.py`.
11. **Mensajes claros para el usuario**, en español, cuando algo falla (“No se encontró el archivo X. Corre primero el script 01.”).
12. **Cada archivo empieza con un encabezado** de 3 a 6 líneas: qué hace, qué lee, qué escribe, cómo se corre.

Ejemplo del estilo esperado:

```python
# 03_agrupar_incendios.py
# Junta los puntos de calor cercanos (en distancia y en tiempo) en "incendios candidatos".
# Lee:    datos/procesados/puntos_calor_jalisco.csv
# Escribe: datos/procesados/incendios_candidatos.csv
# Uso:    python scripts/03_agrupar_incendios.py

import pandas as pd
from sklearn.cluster import DBSCAN
import config


def agrupar_puntos(puntos):
    """Asigna a cada punto el número de incendio al que pertenece."""
    # DBSCAN necesita números en la misma escala: metros en x, y, y horas convertidas a metros.
    horas_como_metros = puntos["horas"] * config.METROS_POR_HORA
    coordenadas = list(zip(puntos["x"], puntos["y"], horas_como_metros))
    modelo = DBSCAN(eps=config.DISTANCIA_MAXIMA_M, min_samples=1)
    puntos["incendio_id"] = modelo.fit_predict(coordenadas)
    return puntos
```

---

## 8. Arquitectura de implementación

```
 ┌───────────────────── EN LA COMPUTADORA (Python, se corre una vez) ─────────────────────┐
 │                                                                                         │
 │  01 descargar FIRMS ─► 02 preparar CONAFOR ─► 03 agrupar ─► 04 variables ─► 05 clasificar │
 │                                                                       │                 │
 │                                    06 red vial y rutas (región piloto) │                 │
 │                                                    │                  ▼                 │
 │                                                    └────────► 07 exportar web ─► 08 evaluar │
 │                                                                       │                 │
 └───────────────────────────────────────────────────────────────────────┼─────────────────┘
                                                                         ▼
                                                     web/datos/*.json (pocos MB)
                                                                         │
 ┌───────────────────── EN EL NAVEGADOR (GitHub Pages) ───────────────────▼─────────────────┐
 │  Mapa de incendios clasificados · Plan de ataque interactivo · Probar clasificación ·    │
 │  Resultados de la evaluación · Acerca del proyecto                                        │
 └───────────────────────────────────────────────────────────────────────────────────────────┘
```

**Por qué así:**
- El profesor no instala nada: abre una URL.
- No hay servidor que mantener ni que se caiga.
- Lo pesado (descargar, agrupar, entrenar el bosque aleatorio, calcular rutas) se hace una vez en Python.
- Lo interactivo (elegir día, marcar brigadas disponibles, generar el plan, comparar métodos, probar la clasificación) corre en JavaScript con datos pequeños.

**Qué se precalcula y qué se calcula en el navegador:**

| Precalculado en Python | Calculado en el navegador |
| --- | --- |
| Incendios candidatos y sus variables | Filtrar por fecha y nivel |
| Clasificación real/falsa y nivel (reglas y bosque aleatorio) | Clasificación por reglas en la página “Probar” |
| Tiempo de cada base a cada incendio de la región piloto | Orden de atención |
| Ruta (lista de coordenadas) de cada base a cada incendio | Asignación: húngaro, voraz y más cercana |
| Métricas de evaluación | Métricas del plan generado en pantalla |

---

## 9. Tecnologías

| Parte | Tecnología | Versión | Para qué |
| --- | --- | --- | --- |
| Lenguaje de datos | Python | 3.12 | Scripts 01 a 08 |
| Tablas | pandas | la que instale pip | Leer y escribir CSV |
| Datos geográficos | geopandas, shapely, pyproj | — | Recortar a Jalisco, distancias en metros (EPSG:32613) |
| Agrupamiento y modelo | scikit-learn | — | DBSCAN y bosque aleatorio |
| Red de caminos | osmnx, networkx | — | Descargar caminos de OpenStreetMap y calcular rutas (Dijkstra) |
| Descargas | requests | — | FIRMS y clima |
| Sitio | HTML5, CSS, JavaScript plano | — | Páginas |
| Mapa | Leaflet | **1.9.4** desde unpkg | Mapa base OpenStreetMap, puntos, rutas |
| Publicación | GitHub Pages | — | URL pública |
| Control de versiones | Git + GitHub | Git 2.55, gh 2.102 | Historial por integrante |

`requirements.txt`:

```
pandas
geopandas
shapely
pyproj
scikit-learn
osmnx
networkx
scipy
requests
```

**No usar:** frameworks web (React, Vue), bundlers (Vite, webpack), bases de datos, Docker, Redis, Celery, PostGIS, LangGraph, LLMs para decidir, TypeScript, pytest, ruff, GitHub Actions (salvo el opcional del modo en vivo).

> **Repositorio público (decidido el 12 nov):** con una cuenta gratuita, GitHub Pages solo funciona en repositorios públicos, así que el repositorio `vigia-jalisco` será **público**. Consecuencias: **nunca** subir `.env`, la clave de FIRMS, correos personales, enlaces a documentos privados (Google Docs) ni datos crudos con información personal. Todo lo que esté en el repositorio lo puede ver cualquiera, incluido el profesor.

---

## 10. Datos y fuentes externas

Todas son públicas. **Antes de programar con cada una, confirmar disponibilidad, formato y licencia.** Si una falla, aplicar el plan B y anotarlo en la bitácora.

| # | Fuente | Qué se usa | Cómo se obtiene | Plan B |
| --- | --- | --- | --- | --- |
| F1 | **NASA FIRMS** (VIIRS S-NPP 375 m y MODIS 1 km) | Puntos de calor 2024–2025: fecha, hora, coordenadas, FRP, confianza, día/noche y tipo de fuente (`type`) | **Comprobado el 12 nov:** archivos anuales de México, sin clave: `https://firms.modaps.eosdis.nasa.gov/data/country/{sensor}/{anio}/{sensor}_{anio}_Mexico.csv` con sensor `viirs-snpp` o `modis`. No hay archivos por país de NOAA-20 ni NOAA-21. La `MAP_KEY` solo haría falta para el modo en vivo (opcional) | — (indispensable) |
| F2 | **Registros de incendios de CONAFOR** 2024–2025 | Etiquetas: polígono quemado, fecha de inicio y de liquidación, superficie (`AREA_HA`), municipio, causa, vegetación y área protegida | **Comprobado el 12 nov:** “Concentrado Nacional de Polígonos de Incendios Forestales” en IDEFOR (`https://idefor.cnf.gob.mx`), por WFS. Capas `geonode:_2024_incendios_forestales` y `geonode:poligonos_aq_2025`. Jalisco: 950 registros en 2024 y 919 en 2025 | Ya no hace falta (los registros traen ubicación, fecha y superficie) |
| F3 | **INEGI · localidades** | Distancia y población de la localidad más cercana | Marco Geoestadístico / Censo 2020 | — |
| F4 | **INEGI · uso de suelo y vegetación** | Forestal o agrícola; tipo de vegetación | Serie más reciente, recortada a Jalisco | Cobertura de OpenStreetMap |
| F5 | **Áreas naturales protegidas** | Dentro o cerca de un área protegida | CONANP (federales) y SEMADET (estatales) | Solo federales |
| F6 | **Clima histórico** | Viento, humedad y temperatura el día de la detección | Servicio gratuito con histórico, por ejemplo Open-Meteo (verificar límites) | Clasificar sin clima y declararlo |
| F7 | **OpenStreetMap** | Red de caminos de la región piloto | osmnx | — |
| F8 | **Bases de brigadas** | Origen de los recursos | Información pública de CONAFOR, SEMADET, OPD Bosque La Primavera y Protección Civil | Bases **hipotéticas** documentadas como supuesto |

**Regiones:**
- Jalisco completo para la clasificación (polígono estatal del INEGI).
- Región piloto para el plan de ataque: `oeste -103.90, sur 20.40, este -103.15, norte 20.95` (WGS84).
- Distancias y agrupamiento en **EPSG:32613** (UTM 13N). Lo que va a la web, en latitud/longitud (EPSG:4326).

**Qué se sube a GitHub y qué no:**
- No se suben: `.env`, datos crudos grandes (`datos/crudos/`), archivos de INEGI completos.
- Sí se suben: scripts, `web/` completa con `web/datos/*.json` (deben pesar pocos MB en total) y reportes.

---

## 11. Clasificación: cómo funciona

### 11.1 Agrupamiento (script 03)

Cada punto de calor se convierte a metros (EPSG:32613). DBSCAN agrupa puntos que están a menos de `DISTANCIA_MAXIMA_M` y a menos de `VENTANA_HORAS` entre sí. Cada grupo es un **incendio candidato**. Valores iniciales en `config.py` (se calibran en OP1): 1,000 m y 48 h.

### 11.2 Variables por incendio (script 04)

| Variable | Significado |
| --- | --- |
| `n_puntos` | Puntos de calor del grupo |
| `n_pasadas` | En cuántas pasadas de satélite distintas se detectó (persistencia) |
| `duracion_horas` | Entre la primera y la última detección |
| `frp_max`, `frp_total` | Intensidad radiativa (MW) |
| `confianza_media` | Confianza normalizada de 0 a 1 |
| `fraccion_nocturna` | Parte de las detecciones hechas de noche |
| `es_forestal` | Vegetación forestal (1) o agrícola/urbana (0) |
| `fuente_fija` | El lugar tiene detecciones casi todo el año (industria, volcán) |
| `en_area_protegida` | Dentro de un área natural protegida |
| `dist_localidad_km`, `poblacion_localidad` | Localidad más cercana |
| `viento_kmh`, `humedad_pct`, `temperatura_c` | Clima del día (si está disponible) |

### 11.3 Etiquetas (script 02 + 05)

- **Real:** el candidato coincide con un registro de CONAFOR a menos de `TOLERANCIA_KM` y `TOLERANCIA_DIAS` (iniciales: 3 km y 3 días).
- **Probable falsa alarma:** no coincide con ningún registro.
- **Severidad real** (para entrenar el paso B): superficie registrada por CONAFOR agrupada en 4 rangos. Los cortes se fijan con los datos de 2024 (por ejemplo, cuartiles) y quedan en `config.py`.
- Limitación declarada: CONAFOR no registra todo, así que hay ruido en las etiquetas.

> **Actualización del 13 nov:** los valores de 11.3 a 11.5 eran puntos de partida. Los calibrados con 2024 están en `scripts/config.py` y se explican en `reportes/analisis_datos.md` (versión 2), secciones 5 a 8. Resumen: tolerancia de 1 km y 2 días; niveles reales en 30, 100 y 600 ha; paso A con “forestal y 2 o más pasadas” y “15 o más puntos”; paso B con la condición de lejanía y niveles 0, 1-2, 3-4 y 5 o más; regla de seguridad a 1 km (confirmada el 13 nov).

### 11.4 Paso A · ¿real o falsa alarma? (script 05)

Dos métodos con la misma salida (`es_real` y `prob_real`):

1. **Reglas** (fáciles de explicar). Punto de partida, se ajusta en OP1:
   - Si `fuente_fija` → falsa alarma.
   - Si `n_pasadas >= 2` → real.
   - Si `es_forestal` y `frp_max >= 10` → real.
   - En otro caso → falsa alarma.
2. **Bosque aleatorio** (`RandomForestClassifier` de scikit-learn, 200 árboles, `class_weight="balanced"`), entrenado con 2024 y probado con 2025.

### 11.5 Paso B · nivel de severidad (script 05)

Solo para los incendios que el paso A considera reales.

1. **Puntaje por reglas** (punto de partida, se calibra en OP1/OP2):

| Condición | Puntos |
| --- | --- |
| `n_puntos` ≥ 5 / ≥ 15 / ≥ 40 | +1 / +2 / +3 |
| `frp_max` ≥ 30 / ≥ 100 MW | +1 / +2 |
| `duracion_horas` ≥ 24 | +1 |
| `en_area_protegida` | +1 |
| `viento_kmh` ≥ 20 o `humedad_pct` ≤ 25 | +1 |

   Puntaje 0–1 → **bajo**, 2–3 → **medio**, 4–5 → **alto**, 6 o más → **crítico**.
   **Regla de seguridad:** si `dist_localidad_km` < 2 (valor inicial), el nivel sube al menos a **alto**.
2. **Bosque aleatorio** para los 4 niveles, con la misma regla de seguridad aplicada después.

**Explicación (`razones`):** cada incendio guarda una lista de frases que justifican su clasificación (“Detectado en 3 pasadas de satélite”, “A 1.2 km de Tala (35,000 hab.)”). La web las muestra. Con el bosque aleatorio se muestran las 3 variables más importantes del modelo.

### 11.6 Tabla de respuesta (propuesta inicial, en `config.py`)

| Nivel | Brigadas terrestres | Unidad con motobomba | Apoyo aéreo |
| --- | --- | --- | --- |
| Bajo | 1 (si hay disponibles) | No | No |
| Medio | 2 | No | No |
| Alto | 3 | Sí | No |
| Crítico | 4 | Sí | **Recomendar solicitarlo** |

Si es posible, validar esta tabla con un brigadista o especialista. Si no, declararla como supuesto del equipo.

---

## 12. Plan de ataque: cómo funciona

Solo en la región piloto.

### 12.1 Rutas y tiempos (script 06, Python)

1. Descargar con osmnx la red de caminos para auto de la región piloto y guardarla.
2. Asignar velocidad por tipo de camino (osmnx lo hace con valores por defecto; anotar en `config.py` los que se usen).
3. Para cada incendio real de la región piloto, el **punto de acceso** es el nodo del camino más cercano a su centro.
4. Para cada base, Dijkstra desde la base a todos los nodos (una corrida por base) y guardar el tiempo (minutos) y la ruta (lista de coordenadas simplificada) hacia cada punto de acceso.
5. Guardar todo en `web/datos/rutas_piloto.json`.

### 12.2 En el navegador (`web/js/plan.js`)

1. **Demanda:** cada incendio pide brigadas según su nivel (tabla 11.6).
2. **Orden de atención:** primero crítico, luego alto, medio y bajo; a igual nivel, el de menor tiempo de llegada.
3. **Asignación** (tres métodos, misma entrada y salida):
   - **Húngaro con columnas repetidas** (propuesta): un incendio que pide *k* brigadas aparece *k* veces como columna. Costo = tiempo de llegada × peso del nivel (crítico 8, alto 4, medio 2, bajo 1). Si hay más columnas que brigadas, se rellenan con brigadas ficticias de costo alto y lo que reciba una ficticia queda **sin cubrir**. Implementación clásica O(n³), unas 60 líneas bien comentadas.
   - **Voraz por nivel** (referencia B): recorre los incendios en el orden de atención y a cada uno le da sus brigadas libres más rápidas.
   - **Más cercana en línea recta** (referencia A): una brigada por incendio, por orden de detección, la más cercana sin usar caminos.
4. **Salida en pantalla:** tabla de brigada → incendio, tiempo de llegada, ruta dibujada, recursos que faltan, recomendación de apoyo aéreo y métricas (tiempo total ponderado, primera llegada a incendios altos o críticos, % de demanda cubierta).

---

## 13. Sitio web: lo que el profesor podrá hacer

Páginas (HTML separados, estilo y menú compartidos):

| Página | Archivo | Qué puede hacer el profesor |
| --- | --- | --- |
| **Mapa de incendios** | `web/index.html` | Elegir una fecha de 2024–2025, ver los incendios de Jalisco coloreados por nivel (gris = falsa alarma), filtrar por nivel, hacer clic en uno y ver su ficha: real o falsa, probabilidad, nivel, razones y, si existe, el registro de CONAFOR con el que coincide |
| **Plan de ataque** | `web/plan.html` | Elegir un escenario (días reales con varios incendios simultáneos en la región piloto y escenarios de prueba), marcar qué brigadas están disponibles, elegir el método y generar el plan; ver rutas, tabla, métricas y comparar los tres métodos lado a lado |
| **Probar clasificación** | `web/probar.html` | Escribir las variables de un incendio inventado (puntos, intensidad, distancia a localidad, clima…) y ver qué nivel le asignan las reglas y por qué |
| **Resultados** | `web/resultados.html` | Ver las métricas de la evaluación (E1 a E4) en tablas y gráficas simples, con limitaciones |
| **Acerca de** | `web/acerca.html` | Problema, objetivos, fuentes, equipo, cómo se usó la IA y aviso de que no sustituye sistemas oficiales |

Requisitos:
- Funciona en computadora y en celular.
- Carga en menos de 5 segundos con internet normal (datos JSON de pocos MB).
- Cada página tiene un recuadro corto de “Cómo usar esta página”.
- Si falta un archivo de datos, muestra un mensaje claro en vez de quedarse en blanco.

**Publicación (sin GitHub Actions):** GitHub Pages en modo *Deploy from a branch*, rama `main`, carpeta `/ (root)`. En la raíz hay un `index.html` mínimo que redirige a `web/index.html`. La URL queda como `https://<usuario>.github.io/vigia-jalisco/`.

---

## 14. Estructura del repositorio y formato de archivos

```
vigia-jalisco/
├── index.html                  Redirige a web/index.html (para GitHub Pages)
├── README.md                   Presentación del proyecto y cómo correrlo
├── CONTEXTO_COMPLETO.md        Este archivo
├── CLAUDE.md                   Reglas para la IA
├── ROADMAP.md · BACKLOG.md · BITACORA.md · CONTRIBUTING.md
├── requirements.txt
├── .gitignore · .env.example
├── docs/                       Planteamiento, análisis crítico, arquitectura, evaluación, modelo de decisión
├── entregables/                Documentos entregados al profesor
├── scripts/
│   ├── config.py               Todos los parámetros con su fuente
│   ├── 01_descargar_firms.py
│   ├── 02_preparar_conafor.py
│   ├── 02b_fuentes_complementarias.py   (localidades del INEGI; vegetación y áreas protegidas desde CONABIO)
│   ├── 03_agrupar_incendios.py
│   ├── 04_calcular_variables.py
│   ├── 04b_etiquetar.py                 (cruce de los candidatos con CONAFOR: etiquetas)
│   ├── 05_clasificar.py
│   ├── 06_rutas_region_piloto.py
│   ├── 07_exportar_web.py
│   ├── plan_ataque.py                   (el reparto de brigadas en Python; lo usan las pruebas y el script 08)
│   └── 08_evaluar.py
├── pruebas/
│   ├── probar_agrupamiento.py
│   ├── probar_clasificacion.py
│   └── probar_plan.py          (mismos casos que web/js/plan.js, para comprobar el húngaro)
├── datos/
│   ├── crudos/                 NO se sube (descargas grandes)
│   ├── referencia/             Archivos pequeños de referencia (bases, cortes)
│   └── procesados/             CSV intermedios (se suben si pesan poco)
├── reportes/
│   ├── analisis_datos.md
│   └── evaluacion.md
└── web/
    ├── index.html · plan.html · probar.html · resultados.html · acerca.html
    ├── css/estilos.css
    ├── js/comun.js             Menú, carga de JSON, colores por nivel
    ├── js/pagina_plan.js       Página del plan (pantalla); el reparto vive en js/plan.js
    ├── js/mapa.js · js/plan.js · js/probar.js · js/resultados.js
    └── datos/
        ├── incendios_2024.json · incendios_2025.json
        ├── escenarios_piloto.json
        ├── rutas_piloto.json
        └── resultados.json
```

> Nota: la versión anterior de `docs/03_arquitectura.md` proponía un paquete `src/vigia/` con módulos, pytest, ruff y GitHub Actions. **La decisión D10 lo sustituye por la estructura de arriba.**

**Formatos JSON para la web** (usar estos nombres de campo):

```json
// web/datos/incendios_2025.json
{
  "anio": 2025,
  "generado": "2026-11-15",
  "incendios": [
    {
      "id": "2025-0412",
      "inicio": "2025-04-15T19:42",
      "fin": "2025-04-16T08:10",
      "lat": 20.67, "lon": -103.55,
      "n_puntos": 18, "n_pasadas": 3, "frp_max": 64.2,
      "es_real": true, "prob_real": 0.91,
      "nivel": "alto",
      "nivel_modelo": "medio",
      "razones": ["Detectado en 3 pasadas", "A 1.4 km de una localidad de 4,200 hab."],
      "en_piloto": true,
      "conafor": { "coincide": true, "superficie_ha": 120 }
    }
  ]
}
```

```json
// web/datos/rutas_piloto.json
{
  "bases": [ { "id": "B1", "nombre": "Base hipotética Tala", "lat": 20.65, "lon": -103.70, "hipotetica": true } ],
  "brigadas": [ { "id": "BR1", "base": "B1", "tipo": "terrestre" } ],
  "tiempos": { "2025-0412": { "B1": 23.5, "B2": 41.0 } },
  "rutas":   { "2025-0412|B1": [[20.65, -103.70], [20.66, -103.66], [20.67, -103.55]] }
}
```

```json
// web/datos/escenarios_piloto.json
{
  "escenarios": [
    { "id": "E01", "nombre": "15 abr 2025, 20:00 (4 incendios)", "tipo": "real", "incendios": ["2025-0412", "2025-0415"] },
    { "id": "S10", "nombre": "Escenario de prueba con 10 incendios", "tipo": "sintetico", "incendios": ["..."] }
  ]
}
```

---

## 15. Plan de desarrollo: dos sprints hasta el 26 de noviembre

**Decidido el 12 nov:** el jueves 19 de noviembre el proyecto se presenta como **sprint** y debe mostrar el **70 %** terminado; el **jueves 26 de noviembre** es la entrega final. El plan de cinco fases hasta diciembre queda sustituido por dos sprints. Detalle de tareas y puntos en `BACKLOG.md` (versión 3); día por día en `ROADMAP.md` (versión 3); tarjetas en el tablero.

| Sprint | Fechas | Puntos | Lo que debe quedar terminado |
| --- | --- | --- | --- |
| **Sprint 1** | jue 12 – jue 19 nov | 73 de 105 (70 %) | Repositorio y tablero · scripts 01 a 07 · clasificación **por reglas** (pasos A y B) en todo Jalisco · `incendios_2024/2025.json` · página del mapa completa · página “Probar” · bases, rutas y escenarios reales de la región piloto · `plan.js` con húngaro, voraz y más cercana · página “Plan de ataque” · pruebas con `assert` · `reportes/analisis_datos.md` · `docs/05_modelo_de_decision.md` · presentación del sprint |
| **Sprint 2** | vie 20 – jue 26 nov | 32 de 105 (30 %) | Bosque aleatorio (pasos A y B) · clima histórico · escenarios de prueba · script 08 con E1 a E5 · página “Resultados” · `reportes/evaluacion.md` · informe final · presentación, video y etiqueta `v1.0` |

**Cómo se mide el 70 %:** en puntos del backlog terminados (1 = muy fácil, 2 = fácil, 3 = medio, 5 = grande). Los puntos son una estimación del equipo.

**Si el Sprint 1 se atrasa**, se pasa al Sprint 2, en este orden: (1) comparación lado a lado de los tres métodos, (2) página “Probar”, (3) datos de 2024 en el mapa.
**Si hay atraso general, recortar en este orden:** (1) modo en vivo, (2) escenarios sintéticos grandes, (3) bosque aleatorio del paso B (quedan solo reglas), (4) prueba de uso con brigadistas (se hace con compañeros), (5) variables de clima.
**Nunca recortar:** clasificación en dos pasos, plan de ataque con el húngaro y las dos referencias, sitio publicado y evaluación E1 a E3.

---

## 16. Trabajo por integrante y guía de GitHub

### 16.1 Idea

Cada día, la IA prepara una **carpeta de entrega** con las versiones de archivos que le toca subir a cada integrante. Cada quien:

1. Lee y entiende sus archivos (esa es su aportación real: revisar y poder explicar).
2. Los sube al repositorio **con su propia cuenta**, arrastrándolos en la página de GitHub (sección 16.3).

Así el historial de GitHub muestra trabajo continuo de todo el equipo. El `README.md` y la página “Acerca de” dicen abiertamente que el código se desarrolló con apoyo de IA y que el equipo lo revisa y lo integra. **No ocultarlo.**

**Las carpetas de entrega viven fuera del repositorio**, para que no se suban por accidente:

```
C:\Users\souls\Proyectos\Proyecto Final\
├── vigia-jalisco\                     ← el repositorio
└── entregas_por_dia\
    ├── 2026-11-12_jueves\
    │   ├── LEEME.md                   ← qué sube cada quien hoy, en qué orden, con qué mensaje
    │   ├── Johan\ ...
    │   ├── Oswaldo\ ...
    │   ├── Omar\ ...
    │   └── Cuauhtemoc\ ...
    ├── 2026-11-13_viernes\
    ├── 2026-11-14_sabado\
    ├── 2026-11-15_domingo\
    └── 2026-11-16_lunes\
```

Dentro de la carpeta de cada integrante, los archivos van con **la misma ruta que tendrán en el repositorio** (por ejemplo `Omar\scripts\05_clasificar.py`). Si un archivo ya existía, la nueva versión lo reemplaza.

### 16.2 Preparación única (jueves 12)

**Johan** (dueño del repositorio):

```bash
# 1. Iniciar sesión en GitHub desde la terminal
gh auth login

# 2. Configurar su nombre y correo de GitHub para los commits
git config --global user.name "Nombre de GitHub de Johan"
git config --global user.email "correo-de-github-de-johan"

# 3. Crear el repositorio y subir el primer commit (desde la carpeta vigia-jalisco)
git add .
git commit -m "docs: documentación inicial del proyecto (versión 2)"
gh repo create vigia-jalisco --public --source . --push
```

Después, en GitHub: *Settings → Collaborators* → invitar a Oswaldo, Omar y Cuauhtémoc. En *Settings → Pages*: *Deploy from a branch*, rama `main`, carpeta `/ (root)`.

**Oswaldo, Omar y Cuauhtémoc** (una sola vez): entrar a GitHub con su propia cuenta y aceptar la invitación al repositorio. No necesitan instalar Git.

### 16.3 Rutina diaria de cada integrante

**Decidido el 12 nov:** los archivos se suben **desde la página de GitHub, arrastrándolos**, sin Git ni comandos. Motivo: el equipo tiene poca experiencia y así nadie tiene que instalar ni aprender Git para subir su parte.

1. Abrir la página principal del repositorio (no dentro de una carpeta) y hacer clic en **Add file → Upload files**.
2. Abrir su carpeta del día (`entregas_por_dia/<fecha>/<nombre>/`), seleccionar todo lo que hay dentro y arrastrarlo al recuadro. Las carpetas se arrastran completas para conservar las rutas.
3. Revisar que la lista muestre las rutas correctas (por ejemplo `scripts/config.py`).
4. Escribir el mensaje del `LEEME.md` del día, dejar **Commit directly to the main branch** y hacer clic en **Commit changes**.

Si un archivo ya existía, el nuevo lo reemplaza. Como cada integrante toca archivos distintos el mismo día, no debería haber conflictos. El `LEEME.md` de cada día repite estos pasos con el detalle de cada quien.

**Consecuencias para la IA que prepara las entregas:**
- Cada `LEEME.md` debe indicar, por archivo, **dónde queda en el repositorio**, porque la ruta depende de cómo se arrastra.
- La carpeta `vigia-jalisco` de la computadora de desarrollo no se actualiza sola: Johan corre `git pull` ahí al final de cada día para traer lo que todos subieron por la página.
- Límites de la subida por la página: 100 archivos por vez y 25 MB por archivo. Los JSON de `web/datos/` deben respetar ese tamaño.

**Formato de mensajes de commit:** `tipo: descripción en presente`. Tipos: `feat` (función nueva), `fix` (corrección), `docs` (documentación), `data` (datos), `test` (pruebas), `chore` (configuración).

### 16.4 Reparto del Sprint 1 (12 al 19 de noviembre)

| Día | Johan (repo y web) | Oswaldo (datos) | Omar (clasificación y plan) | Cuauhtémoc (docs y evaluación) |
| --- | --- | --- | --- | --- |
| **Jue 12** | Crear el repo, subir la documentación v2, activar Pages · `index.html` (raíz, redirección) | `requirements.txt`, `.gitignore` actualizado · `scripts/config.py` v1 (regiones, rutas de archivos) | `web/index.html` v1 + `web/css/estilos.css` v1 (mapa de Jalisco vacío con menú) | `entregables/actividad-03/` (docx y guía PDF) · entrada de bitácora del día |
| **Vie 13** | `web/js/comun.js` v1 (menú, carga de JSON, colores) · `web/acerca.html` | `scripts/01_descargar_firms.py` | `scripts/02_preparar_conafor.py` | `reportes/analisis_datos.md` v1 (qué trae cada fuente, incluido CONAFOR) |
| **Sáb 14** | `web/js/mapa.js` v1 (pinta incendios de un JSON de ejemplo) · `web/index.html` v2 | `scripts/03_agrupar_incendios.py` | `scripts/04_calcular_variables.py` | `docs/05_modelo_de_decision.md` v1 (reglas de agrupamiento y variables) |
| **Dom 15** | `web/js/mapa.js` v2 (colores por nivel, ficha con razones, selector de fecha) | `scripts/07_exportar_web.py` v1 + `web/datos/incendios_2025.json` (primera versión) | `scripts/05_clasificar.py` v1 (reglas de los pasos A y B) + `pruebas/probar_clasificacion.py` | `reportes/analisis_datos.md` v2 (primeros números) · bitácora S4 |
| **Lun 16** *(feriado)* | `web/probar.html` + `web/js/probar.js` | `scripts/06_rutas_region_piloto.py` v1 + bases hipotéticas en `datos/referencia/bases.csv` | `web/js/plan.js` v1 (demanda, orden, voraz y más cercana) + `pruebas/probar_plan.py` v1 | `docs/05_modelo_de_decision.md` v2 (tabla de respuesta y plan de ataque) |
| **Mar 17** | `web/plan.html` v1 (escenario, brigadas disponibles, rutas y tabla) | `scripts/06_rutas_region_piloto.py` v2 + `web/datos/rutas_piloto.json` y `escenarios_piloto.json` (días reales) | `web/js/plan.js` v2 (húngaro con columnas repetidas y métricas) + `pruebas/probar_plan.py` v2 | Guion de la presentación del sprint · bitácora del Sprint 1 |
| **Mié 18** | `web/plan.html` v2 (comparación de los tres métodos) · revisión del sitio en celular | `web/datos/incendios_2024.json` y correcciones de datos | Ajuste de reglas con los datos de 2024 · correcciones | Presentación del sprint · `README.md` actualizado |
| **Jue 19** | **Revisión del Sprint 1** (presentación) | | | |

**Dependencias:** el viernes 13 y el sábado 14 dependen de que Python esté instalado y de que existan los datos de FIRMS. Si los datos reales no están listos, la IA entrega los scripts con **datos de ejemplo pequeños** (marcados como ejemplo) para que el sitio funcione, y se reemplazan cuando lleguen los reales.

### 16.5 Sprint 2 (20 al 26 de noviembre)

La IA sigue preparando carpetas diarias con el mismo formato, según `ROADMAP.md`. Cada `LEEME.md` del día dice qué sube cada quien y el mensaje del commit. Cada integrante debe tener al menos **un commit en 4 de cada 7 días**.

### 16.6 Tablero

Las tareas viven en el tablero de GitHub Projects <https://github.com/users/Souls-Nao/projects/7>, con la misma estructura que el del proyecto de Huffman: columnas **Backlog → Por hacer → En progreso → En revision → Terminado** y campos **Sprint**, **Puntos** y **OP**. Cada tarjeta es un issue del repositorio con título `[ID] Tarea`. Cuando un integrante sube los archivos de una tarea, mueve su tarjeta a **Terminado** (o cierra el issue). **En progreso** y **En revision** se mueven a mano.

---

## 17. Estado actual, entorno y pendientes

### 17.1 Lo que existe (12 nov)

| Elemento | Estado |
| --- | --- |
| Documentación del repositorio (`docs/01` a `04`, `ROADMAP`, `BACKLOG`, `BITACORA`, `README`, `CLAUDE.md`, `CONTRIBUTING`) | ✅ Versión 2 |
| Código Python | `scripts/config.py` v6 y scripts 01, 02, 02b, 03, 04, 04b, 05 (solo `metodo="reglas"`), 06 v2 y 07 v3, corridos con datos reales; `scripts/plan_ataque.py` v2 (húngaro con SciPy, voraz, cercana y métricas); pruebas de agrupamiento, clasificación y plan (entregas del 12 al 17) |
| Datos | `web/datos/`: `incendios_2024.json`, `incendios_2025.json`, `reglas.json`, `rutas_piloto.json` (6 bases hipotéticas, 15 brigadas, 570 rutas) y `escenarios_piloto.json` (40 días reales con 2 o más incendios en la región piloto) |
| Clasificación por reglas | Ajustada con 2024, probada con 2025. Paso A en 2025: precisión 0.33, sensibilidad 0.43. Paso B en 2025: mismo nivel 0.49, ±1 nivel 0.93 |
| Plan de ataque | Completo: `web/js/plan.js` v2 (húngaro con columnas repetidas, voraz, cercana y métricas) y `web/plan.html` + `web/js/pagina_plan.js`. En los 40 escenarios: tiempo ponderado 1,142 (húngaro) contra 1,164 (voraz); demanda cubierta 98 % los dos y 42 % la más cercana. **Falta:** comparación lado a lado en pantalla (miércoles 18) |
| Sitio web | `index.html` de la raíz; `web/index.html` v3, `plan.html`, `probar.html`, `acerca.html`; `web/js/comun.js` v3, `mapa.js` v2, `plan.js` v2, `pagina_plan.js` v1, `probar.js` v1; `web/css/estilos.css` v6. Falta `resultados.html` (Sprint 2) |
| Documentos | `reportes/analisis_datos.md` v2, `docs/05_modelo_de_decision.md` v2, `entregables/sprint-1/guion_presentacion.md` y `BITACORA.md` con entradas hasta el 17 nov |
| Entregas diarias | `entregas_por_dia/` tiene listas las del jueves 12 al martes 17, cada una con su `LEEME.md` |
| Fuentes que cambiaron de origen | Vegetación (INEGI Serie VII) y áreas protegidas **federales** desde el geoportal de CONABIO (IDEFOR respondía 503). La red de caminos se baja probando varios servidores de OpenStreetMap (`config.SERVIDORES_OSM`) |
| Copia de trabajo de la IA | `C:\Users\souls\Proyectos\Proyecto Final\copia_de_trabajo\`: tiene todos los archivos juntos y los datos crudos. Ahí se escribe y se prueba; de ahí se copian los archivos a las carpetas de entrega. No es un repositorio |
| Repositorio en GitHub | ✅ Público: <https://github.com/Souls-Nao/vigia-jalisco>, con un primer commit de documentación. `gh` tiene la sesión de `Souls-Nao`. **GitHub Pages aún no está activo** y faltan los colaboradores |
| Tablero | ✅ <https://github.com/users/Souls-Nao/projects/7>, vinculado al repositorio, con las tarjetas del backlog v3 |
| Actividad 03 en Google Docs | ✅ Entregada; Parte 7 sin llenar |
| Guía de preparación del equipo | ✅ PDF en `entregables/actividad-03/` y Google Doc |
| Página “Mapa del proyecto” (Artifact de Claude) | Desactualizada (describe la versión 1) |

### 17.2 Entorno de la computadora de desarrollo

| Elemento | Valor |
| --- | --- |
| Sistema | Windows 11 Pro |
| Terminal | PowerShell 5.1 (sin `&&`; usar `;` o `if ($?)`) y Git Bash |
| Carpeta del proyecto | `C:\Users\souls\Proyectos\Proyecto Final\vigia-jalisco` |
| Git / GitHub CLI | Instalados (2.55 / 2.102); `gh` con la sesión de `Souls-Nao` (permisos `repo` y `project`). En el repositorio local, los commits usan el correo privado de GitHub (`…@users.noreply.github.com`) |
| Python | **3.12.10 instalado**, con las librerías de `requirements.txt` (instaladas el 12 nov con pip, en el Python general, sin entorno virtual): pandas 3.1.1, geopandas 1.2.0, shapely 2.2.0, pyproj 3.8.0, scikit-learn 1.9.1, osmnx 2.1.1, networkx 3.7, scipy 1.13.1, requests 2.34.2, numpy 2.2.6 |
| Otros programas de Python en la computadora | Ya había un paquete ajeno al proyecto (`autoeq`) que pide numpy 1.24. La instalación subió numpy de 1.26.4 a 2.2.6; `autoeq` y `matplotlib` siguen importándose, pero si `autoeq` falla, la salida es pasar el proyecto a un entorno virtual (`.venv`, ya está en `.gitignore`) y regresar numpy a 1.26.4 |
| Servidor local de prueba | `.claude/launch.json` (ignorado solo en esta computadora con `.git/info/exclude`) sirve una copia de prueba del sitio en el puerto 8765 |
| Word, Edge, Chrome | No instalados. PDF vía exportación de Google Drive |
| Conectores disponibles para la IA | Google Drive y Google Docs (lectura y edición), navegador integrado |

### 17.3 Pendientes inmediatos (en orden)

1. ~~Instalar las librerías de `requirements.txt`~~ Hecho el 12 nov, con permiso del usuario (ver 17.2).
2. ~~Crear el repositorio público~~ Hecho el 12 nov con la cuenta `Souls-Nao`. Falta activar GitHub Pages e invitar a los colaboradores.
3. ~~Solicitar la `MAP_KEY` de FIRMS~~ Ya no es necesaria para el núcleo (solo para el modo en vivo opcional).
4. ~~Revisar qué traen los registros de CONAFOR~~ Hecho el 12 nov (sección 10).
5. ~~Generar la carpeta `entregas_por_dia/2026-11-12_jueves/`~~ Hecho el 12 nov.
6. Avisar al profesor del ajuste de enfoque (versión 2).
7. Llenar la Parte 7 de la Actividad 03 si el profesor todavía la acepta.
8. Referencias formales de las cifras del planteamiento. Ojo: la capa de polígonos 2025 de CONAFOR trae 919 registros de Jalisco y 7,002 del país, no 912 y 9,996; aclarar de dónde sale cada cifra.
9. Fuentes F3, F4 y F5, localizadas el 12 nov (detalle en `reportes/analisis_datos.md`): localidades con población en el servicio del INEGI `https://gaia.inegi.org.mx/wscatgeo/v2/localidades/14/<municipio>` (una consulta por municipio); uso de suelo y vegetación Serie VII y áreas naturales protegidas en IDEFOR. Falta revisar su contenido al escribir el script 04.
10. El polígono de Jalisco sale del servicio del INEGI (`config.JALISCO_POLIGONO_URL`). Un polígono de CONAFOR queda inválido tras simplificar: el script que lea `incendios_conafor_jalisco.geojson` debe aplicar `make_valid()`.
12. **Instrucción del usuario (12 nov): no hacer ningún cambio en GitHub.** La IA solo deja archivos en `entregas_por_dia/`; el equipo sube todo a mano. Los cambios de documentación hechos en la carpeta `vigia-jalisco` (BACKLOG v3, ROADMAP v3, README y este archivo) están solo en la computadora, sin subir.
14. **Parámetros ya calibrados con 2024** (todos en `config.py`): cruce con CONAFOR a 1 km y 2 días; niveles reales en 30, 100 y 600 ha; paso A = fuente fija → falsa, forestal y 2+ pasadas → real, 15+ puntos → real; paso B con la condición nueva “a 4 km o más de una localidad” y niveles 0, 1-2, 3-4 y 5+. **La regla de seguridad quedó en 1 km, confirmada por el usuario el 13 nov.**
18. **Para el miércoles 18:** (a) comparación lado a lado de los tres métodos en `plan.html` (misma entrada, tabla con las métricas de cada uno); (b) revisión completa del sitio en computadora y celular; (c) `docs/05` v3 con el húngaro y las métricas; (d) `README.md` actualizado; (e) ajustar el guion con los números finales; (f) `web/datos/incendios_ejemplo.json` ya no se usa. **Decisión abierta:** cuando faltan brigadas, el húngaro y el voraz pueden dejar un incendio alto sin ninguna (pasa en el escenario del 2 de mayo de 2024); se propuso que la primera brigada de cada incendio pese más, falta que el equipo decida.
19. Hallazgo para la evaluación (E3): en los escenarios reales el húngaro mejora al voraz solo 2 % en tiempo ponderado. Decirlo con claridad; medir con los escenarios de prueba de 5, 10 y 20 incendios en el Sprint 2.
16. (Hecho el 13 nov) **Para el martes 17:** (a) húngaro con columnas repetidas en `plan.js` y `plan_ataque.py` (en Python con `scipy.optimize.linear_sum_assignment`); el costo de dejar un lugar sin cubrir debe pesar según el nivel, para que el húngaro no deje sin brigada a un incendio grave por cubrir uno leve; (b) métricas del plan; (c) `web/datos/escenarios_piloto.json` con días reales (por ejemplo, 13 y 16 de marzo de 2025 tienen 4 incendios reales que empiezan ese día en la región piloto); (d) `web/plan.html`, que lee `rutas_piloto.json`, `reglas.json` y los incendios; (e) el caso de prueba de 4 brigadas y 3 incendios ya está en `probarPlan()` y en `pruebas/probar_plan.py`: agregarle el resultado del húngaro; (f) poner `plan.html` como `lista: true` en `comun.js`.
17. Node.js está instalado en la computadora de desarrollo (v26): sirve para probar `plan.js` y `probar.js` sin navegador. El equipo no lo necesita.
15. (Hecho el 13 nov) Para el lunes 16: `docs/05` v2 debe incluir las reglas ajustadas, quitar el aviso de que faltan `es_forestal` y `en_area_protegida`, y agregar la tabla de respuesta (`TABLA_RESPUESTA` en `config.py`, tarjeta F2-7).
13. Observaciones para calibrar las reglas (`docs/05`, sección 4): el umbral de 10 MW lo supera el 43 % de los candidatos; el 36.5 % está a menos de 2 km de una localidad de 100 habitantes o más; 1 de cada 5 se ve en 2 o más pasadas.
11. Hallazgo para OP1: la región piloto tiene unos 200 incendios registrados por año (190 en 2024 y 205 en 2025), más de lo supuesto en P16.

### 17.4 Documentos fuera del repositorio

Por ser público, el repositorio no guarda enlaces a documentos privados. Para encontrarlos, buscar en Google Drive (conector de Google Drive) por título:
- **“Proyecto Final 01 _ Brigada _ Binaria”**: la Actividad 03 entregada (dueño: Cuauhtémoc).
- **“Vigía Jalisco - Guía de preparación del equipo”**: guía para la exposición (también está en PDF en `entregables/actividad-03/`).
- La página “Mapa del proyecto” (Artifact de Claude) describe la versión 1 y está desactualizada; no usarla como referencia.

---

## 18. Riesgos y planes B

| Riesgo | Probabilidad | Impacto | Plan B | Fecha límite |
| --- | --- | --- | --- | --- |
| ~~CONAFOR sin coordenadas o sin superficie~~ | — | — | **Riesgo cerrado el 12 nov:** los polígonos de IDEFOR traen ubicación, fechas y superficie | — |
| ~~Python o librerías geográficas no instalan bien en Windows~~ | — | — | **Riesgo cerrado el 12 nov:** todas instalaron con pip y pasaron una prueba básica | — |
| La clave de FIRMS tarda | Baja | Bajo | Archivos anuales por país | 13 nov |
| Clima no disponible o con límite de consultas | Media | Medio | Una consulta por celda de 0.25° y día; si no, sin clima | 18 nov |
| JSON de la web demasiado grande | Media | Medio | Redondear coordenadas a 4 decimales, simplificar rutas, separar por año | 22 nov |
| No hay bases reales | Alta | Medio | Bases hipotéticas documentadas | 22 nov |
| Atraso acumulado | Alta | Alto | Lista de recortes (sección 15) | Cada domingo |
| El equipo no puede explicar el código | Media | Alto | Reglas de la sección 7 y revisión antes de cada commit | Continuo |
| Se sube por error una clave o un dato privado al repositorio público | Baja | Alto | `.env` en `.gitignore`; revisar `git status` antes de cada commit; si pasa, cambiar la clave de inmediato | Continuo |

---

## 19. Evaluación

Detalle completo en `docs/04_plan_de_evaluacion.md`. Resumen:

| # | Pregunta | Datos | Métricas | Comparación |
| --- | --- | --- | --- | --- |
| E1 | ¿Distingue reales de falsas alarmas? | Candidatos 2025 (entrena con 2024) | Precisión, sensibilidad, F1, matriz | Reglas vs bosque aleatorio |
| E2 | ¿El nivel corresponde a lo que pasó? | Reales 2025 con superficie | Exactitud, exactitud ±1 nivel, críticos clasificados como bajos | Puntaje vs bosque aleatorio vs solo número de puntos |
| E3 | ¿El plan reduce el tiempo de llegada? | Escenarios de la región piloto | Tiempo ponderado, primera llegada a altos/críticos, % de demanda cubierta | Húngaro vs voraz vs más cercana |
| E4 | ¿Responde rápido? | Escenarios de 5 a 50 incendios | Milisegundos en el navegador | Meta: menos de 10 s |
| E5 | ¿Se decide más rápido con la herramienta? | 6 a 10 personas, 4 escenarios | Tiempo y calidad del plan | Con vs sin herramienta |

`scripts/08_evaluar.py` produce `web/datos/resultados.json` (para la página de resultados) y `reportes/evaluacion.md`.

---

## 20. Instrucciones para la IA que continúe

1. **Lee primero:** este archivo, `CLAUDE.md`, `docs/01_planteamiento_y_objetivos.md` y `BACKLOG.md`.
2. **Respeta la sección 7** en todo el código. Si dudas entre dos soluciones, elige la que un principiante entienda.
3. **Trabaja por entregas diarias** (sección 16): genera las carpetas en `C:\Users\souls\Proyectos\Proyecto Final\entregas_por_dia\` con un `LEEME.md` por día. No hagas commits ni pushes en nombre de los integrantes.
4. **No inventes datos.** Si una fuente no está disponible, usa datos de ejemplo marcados como tales y avísalo.
5. **No inventes cifras** para el informe. Las de la sección 3 están pendientes de referencia.
6. **Cada parámetro nuevo** va a `scripts/config.py` con su fuente o la frase “valor inicial; se calibra en OP1”.
7. **Antes de instalar software o crear cuentas, pregunta.** Nunca escribas claves en archivos que se suban.
8. **La herramienta recomienda, nunca actúa.** No agregues envío de alertas, correos ni llamadas a servicios de emergencia.
9. **Comprueba lo que entregas:** corre los scripts con datos reales o de ejemplo, abre el sitio en el navegador integrado y revisa que no haya errores en la consola.
10. **Registra decisiones** en `BITACORA.md` (qué y por qué) y actualiza este archivo si cambia algo importante.
11. **Habla con el equipo en español, de forma breve y clara.** Explica qué hiciste y qué tienen que hacer ellos.
12. **Entorno:** PowerShell 5.1 sin `&&`; guarda scripts `.ps1` en ASCII o con BOM; Git Bash disponible para comandos POSIX.

---

## 21. Glosario

| Término | Significado |
| --- | --- |
| Punto de calor | Píxel de imagen satelital con temperatura anormalmente alta |
| FIRMS | Sistema de la NASA que publica puntos de calor casi en tiempo real |
| VIIRS / MODIS | Sensores satelitales (375 m y 1 km por píxel) |
| FRP | Potencia radiativa del fuego, en megawatts; mide intensidad |
| Pasada | Cada vez que un satélite observa la zona |
| Incendio candidato | Grupo de puntos de calor cercanos en distancia y tiempo |
| Falsa alarma | Candidato que no corresponde a un incendio forestal (quema agrícola, industria) |
| Nivel de severidad | Bajo, medio, alto o crítico |
| Tabla de respuesta | Recursos recomendados para cada nivel |
| Punto de acceso | Punto del camino más cercano al incendio al que llegan las brigadas |
| DBSCAN | Algoritmo que agrupa puntos cercanos y marca los aislados |
| Bosque aleatorio | Modelo de aprendizaje automático formado por muchos árboles de decisión que votan |
| Dijkstra | Algoritmo de camino más corto en una red |
| Algoritmo húngaro | Encuentra el reparto de menor costo total entre dos grupos (brigadas e incendios) |
| Voraz | Método que en cada paso toma la mejor opción inmediata |
| Región piloto | La Primavera y el AMG, donde se calcula el plan de ataque |
| EPSG:32613 | Sistema de coordenadas en metros (UTM zona 13 norte) usado para medir distancias en Jalisco |
| GitHub Pages | Servicio gratuito de GitHub para publicar sitios estáticos |
| Estiaje | Temporada seca (enero a junio en Jalisco) |
