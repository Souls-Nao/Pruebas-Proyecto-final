# Instrucciones para Claude Code en este repositorio

## Contexto
Proyecto académico "Vigía Jalisco" (equipo Brigada Binaria, Seminario de Integración de Desarrollo). Claude Code escribe el código; el equipo decide y revisa. Idioma del proyecto: **español** en todo, incluidos los nombres de variables y funciones (sin acentos ni ñ).

Antes de proponer o implementar algo, lee:
0. `CONTEXTO_COMPLETO.md`: contexto completo, reglas de código sencillo (sección 7) y entregas diarias por integrante (sección 16). **Si algo aquí lo contradice, manda ese archivo.**
1. `docs/01_planteamiento_y_objetivos.md`: el problema y los objetivos **versión 2** (clasificación + plan de ataque).
2. `docs/03_arquitectura.md`: los módulos y las decisiones D1 a D9.
3. `BACKLOG.md`: el issue que se está trabajando y su criterio de aceptación.

## Reglas de alcance
- Todo cambio debe trazarse a un issue del BACKLOG y a un OP. Si una idea no se traza a un OP, **proponla, no la implementes**.
- No introducir Redis, Celery, PostGIS, LangGraph ni LLMs que tomen decisiones (ver `docs/02`, sección 6) sin que el equipo lo apruebe y quede registrado en la bitácora.
- La herramienta **recomienda**; nunca envía alertas ni contacta servicios externos de emergencia.
- Los parámetros numéricos (velocidades, distancias, ventanas de tiempo, cortes de severidad, tabla de respuesta) van en `scripts/config.py` con un comentario de **fuente o justificación**.
- La clasificación cubre todo Jalisco; las rutas y el plan de ataque, solo la región piloto.
- Los modelos de clasificación se entrenan con 2024 y se prueban con 2025. Nunca se mezclan años al azar.

## Convenciones de código (código sencillo para principiantes)
- Python 3.12 con **scripts numerados** en `scripts/` que se corren en orden; sin paquete, sin pytest, sin ruff, sin CI.
- Funciones cortas, diccionarios y listas, sin clases salvo que simplifiquen. Encabezado en cada archivo: qué hace, qué lee, qué escribe y cómo se corre.
- Web: HTML + CSS + JavaScript plano con Leaflet 1.9.4 desde CDN; sin frameworks ni compilación. Publicada en GitHub Pages.
- Lo pesado (agrupar, entrenar, rutas) se precalcula en Python; el navegador solo filtra, reparte brigadas y dibuja.
- CRS de trabajo: EPSG:32613. Lo que va a la web, en latitud/longitud (EPSG:4326).
- Los métodos que se comparan (clasificación, severidad, asignación) reciben los mismos datos y devuelven el mismo formato, con un parámetro `metodo`.
- Pruebas mínimas con `assert` en `pruebas/` para lo crítico (clasificación por reglas y asignación).

## Al entregar trabajo
- El código se entrega en carpetas diarias por integrante (`entregas_por_dia/`, fuera del repositorio), con un `LEEME.md` por día. **No hacer commits en nombre de los integrantes.**
- Explicar en español **qué hace, por qué y cómo se probó**, en términos que un integrante pueda defender en clase.
- Si cambió una decisión de diseño, actualizar `CONTEXTO_COMPLETO.md` y agregar una nota en `BITACORA.md`.
