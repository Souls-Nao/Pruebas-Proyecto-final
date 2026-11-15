# Roadmap: sprints y días (versión 3)

> **Replanificado el 12 de noviembre de 2026.** El proyecto se presenta como **sprint el jueves 19 de noviembre**, con el **70 %** terminado, y se entrega completo el **jueves 26 de noviembre**. El plan anterior (cinco fases hasta el 11 de diciembre) se comprime a **dos sprints**.
> El avance real se registra en [BITACORA.md](BITACORA.md); el detalle de cada tarea, en [BACKLOG.md](BACKLOG.md); las tarjetas, en el [tablero](https://github.com/users/Souls-Nao/projects/7); el reparto diario por integrante, en [CONTEXTO_COMPLETO.md](CONTEXTO_COMPLETO.md), sección 16.

## Sprints ligados a los objetivos

```
F0 Definición ─► SPRINT 1 (12 – 19 nov) ─────────────────────────────► SPRINT 2 (20 – 26 nov)
  (Act. 03, v2)   Datos · Clasificación por reglas · Plan de ataque      Evaluación · Bosque aleatorio · Cierre
                  OP1 + OP2 + OP3            70 %                        OP4                       30 %
```

| Sprint | Objetivos | Fechas | Hito verificable |
| --- | --- | --- | --- |
| **F0 Definición** | Planteamiento y objetivos | hasta 12 nov | Actividad 03 entregada; enfoque v2 y reglas de código sencillo documentados ✅ |
| **Sprint 1** | OP1, OP2, OP3 | 12 – 19 nov | Sitio publicado en GitHub Pages con el mapa de incendios clasificados (reglas), la página “Probar” y el plan de ataque con los tres métodos en la región piloto. **Revisión: jueves 19** |
| **Sprint 2** | OP4 y cierre | 20 – 26 nov | Evaluación E1 a E5, bosque aleatorio, clima, página “Resultados”, informe final, presentación, video y `v1.0`. **Entrega final: jueves 26** |

El 70 % se mide en puntos del backlog: 73 de 105 en el Sprint 1.

## Sprint 1 día por día

| Día | Lo que debe quedar listo |
| --- | --- |
| **Jue 12** ✅ | Repositorio público y tablero · `config.py` · redirección y mapa base · fuentes de datos revisadas |
| **Vie 13** ✅ | Scripts 01 (FIRMS) y 02 (CONAFOR) con datos reales · menú compartido y “Acerca de” · análisis de datos v1 |
| **Sáb 14** | Script 03 (agrupar) · script 04 (variables y fuentes complementarias) · mapa que pinta incendios · modelo de decisión v1 |
| **Dom 15** | Script 05 por reglas (pasos A y B) con pruebas · script 07 y los JSON de 2024 y 2025 · mapa con colores, ficha y selector de fecha · análisis de datos v2 |
| **Lun 16** *(feriado)* | Página “Probar” · bases y script 06 (rutas) · `plan.js` con demanda, orden, voraz y más cercana · modelo de decisión v2 |
| **Mar 17** | `plan.js` con el húngaro y las métricas, con pruebas · escenarios reales · página “Plan de ataque” |
| **Mié 18** | Comparación de los tres métodos en pantalla · revisión del sitio completo en computadora y celular · presentación del sprint |
| **Jue 19** | **Revisión del Sprint 1** |

## Sprint 2 día por día (preliminar)

| Día | Lo que debe quedar listo |
| --- | --- |
| **Vie 20 – Sáb 21** | Bosque aleatorio (pasos A y B) · clima histórico · escenarios de prueba |
| **Dom 22 – Lun 23** | Script 08 con E1 a E3 · página “Resultados” · E4 medido en el navegador |
| **Mar 24** | Prueba de uso (E5) · `reportes/evaluacion.md` |
| **Mié 25** | Informe final · presentación y video · revisión completa del sitio |
| **Jue 26** | **Entrega final** y etiqueta `v1.0` |

## Qué se recorta primero si hay atraso

En este orden, sin tocar el núcleo (clasificación en dos pasos, plan de ataque con el húngaro y sus dos referencias, sitio publicado y evaluación E1 a E3):

1. Modo en vivo con datos recientes.
2. Escenarios de prueba de 10 y 20 incendios: se evalúa solo con días reales.
3. Bosque aleatorio en el paso B: se queda solo el puntaje por reglas.
4. Prueba de uso con brigadistas: se hace con compañeros y se declara como limitación.
5. Variables de clima.

**Si el Sprint 1 se atrasa**, lo que se pasa al Sprint 2, en este orden: (1) comparación lado a lado de los tres métodos, (2) página “Probar”, (3) datos de 2024 en el mapa (se muestra solo 2025). Nunca se pasan: la clasificación por reglas, el mapa y el plan de ataque con el húngaro.

## Ruta crítica y riesgos

| Riesgo | Probabilidad | Impacto | Mitigación | Fecha límite para activar el plan B |
| --- | --- | --- | --- | --- |
| ~~Registros de CONAFOR sin coordenadas o sin superficie~~ | — | — | **Cerrado el 12 nov:** traen polígono, fechas y superficie | — |
| ~~Python o librerías geográficas no instalan en Windows~~ | — | — | **Cerrado el 12 nov** | — |
| Una semana para el 70 % (clasificación y plan de ataque) | Alta | **Muy alto** | Entregas diarias; lista de lo que se pasa al Sprint 2 | Cada noche |
| El equipo no alcanza a revisar y subir lo de cada día | Alta | Alto | Subida por la página de GitHub; `LEEME.md` diario con “para explicar en clase” | Continuo |
| No conseguir ubicaciones reales de bases | Alta | Medio | Bases hipotéticas documentadas | 16 nov |
| La red de caminos tarda o pesa demasiado | Media | Alto | Descargar solo la región piloto; simplificar rutas | 16 nov |
| Datos de la web demasiado pesados | Media | Medio | Redondear coordenadas, simplificar rutas, separar por año | 15 nov |
| Servicio de clima histórico no disponible | Media | Bajo | Clasificar sin variables de clima y declararlo | 21 nov |
| El equipo no puede explicar el código | Media | Alto | Código sencillo y revisión de cada integrante antes de subir sus archivos | Continuo |

## Extensiones opcionales (solo después de `v1.0`)

1. Explicación en lenguaje natural del plan propuesto (un LLM solo como redactor, nunca como decisor).
2. Capa visual simple de propagación.
3. Escenarios de tipo “¿qué pasa si…?” agregando o quitando brigadas.
4. Modo en vivo con datos recientes de FIRMS.
