# Cómo trabajamos

> Versión del 12 de noviembre de 2026. El detalle completo está en [CONTEXTO_COMPLETO.md](CONTEXTO_COMPLETO.md), sección 16.

## Roles

El código lo prepara una IA (Claude). El trabajo del equipo es **revisar, entender, decidir, probar y subir**. Cada integrante tiene un área principal:

| Integrante | Área principal |
| --- | --- |
| Johan | Repositorio, publicación en GitHub Pages y sitio web (mapa) |
| Oswaldo | Datos: descarga y preparación (FIRMS, CONAFOR, fuentes externas, red vial) |
| Omar | Clasificación y plan de ataque |
| Cuauhtémoc | Documentación, evaluación, bitácora y presentación |

**Todos** deben poder explicar cualquier parte del proyecto en la presentación.

## Flujo de trabajo

1. Cada día, la IA deja una carpeta en `C:\Users\souls\Proyectos\Proyecto Final\entregas_por_dia\<fecha>\` con un `LEEME.md` y una subcarpeta por integrante.
2. Cada integrante **lee y entiende** sus archivos. Si algo no se entiende, se pregunta antes de subirlo.
3. Cada integrante sube sus archivos **con su propia cuenta, desde la página de GitHub** (sin instalar Git ni escribir comandos):
   1. Abrir la página principal del repositorio y hacer clic en **Add file → Upload files**.
   2. Abrir su carpeta del día, seleccionar todo lo que hay dentro y arrastrarlo al recuadro de la página. Las carpetas (`scripts`, `web`, …) se arrastran completas para que conserven su acomodo.
   3. Escribir el mensaje indicado en el `LEEME.md`, dejar marcada la opción **Commit directly to the main branch** y hacer clic en **Commit changes**.

   Si un archivo ya existía, el nuevo lo reemplaza. Los pasos detallados y qué hacer si algo sale mal están en el `LEEME.md` de cada día.
4. Cada domingo se agrega la entrada de la semana a `BITACORA.md`.

No usamos ramas ni Pull Requests: cada integrante toca archivos distintos el mismo día, así que trabajamos directo en `main`.

## Mensajes de commit

`tipo: descripción en presente`. Tipos: `feat` (función nueva), `fix` (corrección), `docs` (documentación), `data` (datos), `test` (pruebas), `chore` (configuración).
Ejemplo: `feat: agrega el agrupamiento de puntos de calor en incendios`.

## Uso de IA

El `README.md` y la página “Acerca de” dicen abiertamente que el código se desarrolló con apoyo de IA y que el equipo lo revisa e integra. No se oculta.
