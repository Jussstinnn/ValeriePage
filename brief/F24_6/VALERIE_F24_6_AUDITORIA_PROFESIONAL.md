# VALERIE F24.5 — Auditoría de regresiones y dirección de F24.6

**Base examinada:** `VALERIE_F24_5_MOBILE_CINEMATIC_REFINEMENT_COMPLETO.zip` (ZIP íntegro; fuente completa extraída).

**Método:** lectura focalizada del guion autoritativo, motor de cámara, hojas, galería, subtítulos, transiciones, escena de foto, excavación, reliquias, sonido, ceremonia y HUD. Comparación puntual contra F24.4. Ejecución local de suites y build.

**Precaución:** no se consiguió abrir la página en el Chromium aislado de este entorno: respondió `net::ERR_BLOCKED_BY_ADMINISTRATOR` con HTTP local y `file://`. Por eso **no** se afirma que los defectos gráficos o el congelamiento se hayan reproducido en un navegador real aquí. Las observaciones visuales del usuario son reportes directos del uso móvil; las explicaciones del código se clasifican por evidencia.

## A. Verificaciones ejecutadas

| Verificación | Resultado |
|---|---|
| `unzip -t` | Integridad OK |
| `npm test` | 32/32 |
| `npm run test:vertical` | 31/31 |
| `npm run test:forest` | 15/15 |
| `npm run test:refinement` | 6/6 |
| `npm run test:cut` | 9/9 |
| `npm run build` | Correcta, HTML autónomo ~48 MB |

**93 ejecuciones de prueba**, con casos superpuestos. No implica 93 comprobaciones únicas, aprobación en teléfono físico ni ausencia de bloqueos visuales. El archivo `QA_F24_5.md` de la entrega reconoce expresamente que la aceptación artística, audio real y móviles físicos están pendientes.

## B. Hallazgos, evidencia y criterio de reparación

| ID | Severidad | Observación del usuario | Evidencia técnica o clasificación | Aceptación requerida |
|---|---|---|---|---|
| P0-01 | **Bloqueante** | Revelación del anillo: página se queda pegada | `src/director.js` aprox. 83, 97–99, 204–226; `src/cinematic-hud.js` 6–10 y 39–47. `requestOnly` oculta continuación contextual en `revealed`, `macro`, `return`; además hay guardas `nextReady`. Es ruta plausible, NO causa única demostrada. | Completar físicamente todas las fases sin bloqueo, avanzar con botón visible cuando corresponda, restaurar/pausar/volver, sin desaparición del anillo. |
| P0-02 | **Bloqueante** | Al final, el entorno queda por delante de las ranuras/reliquias | `src/ceremony-theatre.js` 15, 37–51 compone caras, tapa, forro, actores, reliquias y rótulo en fases; el propio contrato `renderLayers` (línea 34) no garantiza oclusión correcta si proyección/capas fallan. Riesgo + defecto observado. | Z-order real con superficies 3D proyectadas y pruebas de píxeles/oclusiones en móvil. |
| P0-03 | **Bloqueante** | Broches mal alineados, vuelven a fallar | `src/ceremony-theatre.js` 15, 26–30, 46–50 calcula ranuras y contacto por separado. | Cada símbolo centrado, anclado a la superficie frontal de la caja, sin saltos en 320–430 px ni durante zoom, sin atravesar actores o fondo. |
| P0-04 | Alta | «Plano» de tres recuerdos sigue bugueado y muestra símbolos anteriores | `src/relic-journey.js` 7–18 (ledger/variantes), `src/film-script.json` sección `la-caja-rosa`, `src/ceremony-theatre.js` 46–50; múltiples módulos históricos de motivos coexisten. No se estableció en navegador la capa culpable. | Presentar solamente las **tres variantes actuales** del ledger, con identidad y sin sprites/efectos heredados. |
| P0-05 | Alta | Al salir de la hoja los conejos quedan desacomodados | `src/threshold-leaf.js` 6–20 termina en z≈1; `src/vineyard-scene.js` 36–40 mezcla poses y 43–46 inicializa nuevas posiciones; `src/transition-director.js` 8–19 transfiere mediante transición. Posible quiebre de coordenadas del mundo entre capítulos. | Los pies quedan sobre camino representado; entrada al siguiente plano parte del punto de salida real, sin teletransportación. |
| P0-06 | Alta | Transiciones siguen feas e inconsistentes | `src/transition-director.js` 7 usa `leaf-occlusion` por defecto, 21–49 combina hojas sobredimensionadas, franjas de escena, reflejo y rellenos genéricos. | Storyboard por pareja de escenas; corte con intención, oclusión/continuidad/transformación coherente, sin gran hoja genérica para todo. |
| P0-07 | Alta | Burbujas mal ejecutadas y diferentes por escena | `src/bubble-director.js` 8 filtra estilos, 17 dibuja 3 círculos solo para `kind==='thought'`; `src/film.css` 19 mantiene tonos crema genéricos; el guion incluye escenas `dialogueStyle:'subtitle'`. | Un sistema visual editorial coherente de burbujas pastel Rosa/Beige y tres puntos, con excepciones justificadas para carta/foto/final. Sin parpadeos/oclusiones. |
| P0-08 | Alta | Excavación mediocre, sin una acción memorable | `src/garden-dig.js` 3–11 contabiliza 8 ciclos y tiempos por acción. Animación/arte dependen de render externo; cantidad de toques no prueba materialidad. | Tierra que cambia de forma, excavación física en 2–3 gestos significativos, descubrimiento gradual, alternancia y cooperación de conejitos, recogida sin aparición instantánea. |
| P0-09 | Alta | «Dos sonrisas» se desplaza extraño y no aparece como se esperaba | `src/album-object.js` 6–20 traslada un objeto banco→entre personajes→primer plano, desvanece personajes en acercamiento. El usuario rechaza precisamente el traslado con los conejitos. | Álbum **permanece anclado al banco** hasta que se revela allí; la cámara acerca la foto o la cubierta se abre sin cargar el álbum físicamente ni duplicar la foto. |
| P1-10 | Alta | Profundidad del umbral del museo empeoró | `src/vineyard-scene.js` 100 y `src/gallery-theatre.js` 10–30 tienen profundidad y seguimiento distintos; `src/transition-director.js` cambia la cobertura. | Comparar contra versión aprobada: recuperar recorrido, escala y cámara originales del umbral del museo. No modificar su buena coreografía sin razón. |
| P1-11 | Alta | Saltos extraños/regresión | `src/guardian-acting.js` coincide con F24.4 en comparación directa; `src/world-path.js` 4–9 y `src/path-depth.js` 7–18 transforman escala, piso y vuelo; `src/vineyard-scene.js` 12–17 agrega arcos. | Calibrar impulso, anticipación, trayectoria y aterrizaje con sombra/pies; evitar doble aplicación de elevación. Probar antiguo contra nuevo. |
| P1-12 | Media-alta | Introducción no explica claramente para qué sirven tres broches | `src/film-script.json` `antes-del-primer-pasito`: dice «tres señales que necesita el broche» sin una explicación inequívoca de la caja cerrada que se abrirá después. | Explicar con naturalidad que tres señales activan los cierres de **la caja que guardan Rosa y Beige**; mostrar brevemente la relación sin revelar el regalo. |
| P1-13 | Alta | Falta más interactividad y misiones | La historia tiene tres reliquias, decisiones y acciones. El problema no es un contador de botones sino la respuesta física y propósito. | Añadir 2–3 micro-misiones significativas ancladas al relato (sin crear llave n.º 4), con variación visible y continuidad. |
| P1-14 | Media | Animación de floración tiene movimiento de fondo innecesario | `src/garden-promenade.js` y `src/lily-garden.js` separan panorámica y floración. | Mantener floración aprobada; bloquear la cámara/fondo únicamente durante su presentación íntima; después permitir paseo panorámico. |
| P1-15 | Media-alta | No se perciben efectos de sonido suficientes | `src/sound.js` 15–27 sí incluye música original sintetizada, ambiente y cues, pero `enabled=false` por defecto, sonidos con pocas clases y activación explícita. | Habilitación voluntaria, efectos originales de hoja, tierra, agua, salto, puerta, álbum, mariposas, broches, caja, anillo; mezclar sin saturar ni violar autoplay móvil. |
| P1-16 | Media | Ralentizaciones con acumulación de escenas | `src/director.js` 54 estima recursos; 106–133 renderiza y gestiona RAF; el HTML autónomo mide ~48 MB. No hubo medición térmica móvil física. | Perf/memoria comparables antes/después, no recargar assets continuamente, sin congelamiento, fallback de calidad que preserve las actuaciones. |

## C. Regresiones más delicadas

- **No eliminar** las actuaciones con profundidad de la hoja, el río ni el paseo al museo.
- **Recuperar** la puerta del museo aprobada en iteraciones anteriores, no reescribir el escenario por completo.
- **Rehacer «Dos sonrisas»** de acuerdo con la dirección del usuario, no suponer que «transportar el álbum» equivale a «hacerlo aparecer bonito».
- **Respetar** las pinturas reales en pared, el cuadro y el dibujo sobre el arte, la floración y los recuerdos privados.
- **No revelar** anillo ni pregunta antes del gesto autorizado, ni dejar bloqueado al usuario después.

## D. Ruta probable del bloqueo final (investigación obligatoria, no conclusión prematura)

1. El editor/relato pasa por `opening` → `unveil` → `revealed` → `macro` → `return` → `question`.
2. `RevealDirector.frame` en `src/reveal-director.js` 5–10 define gates de autorización, animación y `nextReady`.
3. `src/director.js` 83 y 210 deshabilita avances según gate; 99 aplica `requestOnly` en tres vistas.
4. `src/cinematic-hud.js` 41 oculta botón contextual si `requestOnly`, aunque aún puedan existir requisitos narrativos de avance.
5. `src/director.js` 52, 127–134 entra a modo reposo y deja de solicitar fotogramas en determinados estados protegidos. Una ruta donde `nextReady` no cambia o el control de salida está oculto se percibirá como «pegada».
6. Probar también errores Canvas/recursos, sesiones reanudadas, `reduced-motion`, `visibilitychange`, doble toque, `pointercancel`, reentradas, estado editorial y recuperación del contexto.

**No basta con quitar `requestOnly`:** se necesita un contrato de interactividad por estado y pruebas de recorrido completo, incluido teléfono físico.

## E. Evaluación de entrega

F24.5 **no obtiene aprobación** con la evidencia actual: usuario reporta bloqueo crítico y errores de composición. Aunque compila y las suites pasan, su alcance de prueba no coincide con los errores visuales y narrativos del usuario.
