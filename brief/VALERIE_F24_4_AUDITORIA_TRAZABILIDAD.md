# VALERIE F24.3 → F24.4 — Auditoría de trazabilidad basada en ZIP real

**Base comprobada:** `VALERIE_F24_3_DIRECTORS_CUT_COMPLETO.zip` (199,1 MB comprimidos, 520 entradas, prueba de integridad ZIP sin errores). Revisión de los archivos de `src/` y de las observaciones del autor. No se alteró el ZIP original.

## Evidencia y distinción epistemológica
- **Observación del autor (teléfono):** fallos, ritmo y resultados artísticos descritos en el mensaje. Es evidencia experiencial válida, pero no reproducida en un teléfono físico en este entorno.
- **Confirmación en código:** rutas, condiciones o recursos concretos que explican o pueden explicar la observación.
- **Recomendación de diseño:** solución propuesta. No debe presentarse como corrección ya programada.
- **Pruebas ejecutadas localmente sobre la copia extraída:** `npm test` 32/32, `npm run test:vertical` 31/31, `npm run test:forest` 15/15, `npm run test:cut` 9/9, `npm run test:polish` 3/3; `npm run build` aprobada. **90 ejecuciones**, parcialmente duplicadas entre suites, no 90 pruebas diferentes. No certifican experiencia física ni arte. Intento adicional de Chromium local bloqueado por política del navegador (`ERR_BLOCKED_BY_ADMINISTRATOR`); no se afirma prueba visual automatizada propia.

## Matriz completa, en orden del relato
| ID | Observación precisa | Evidencia en código | Acción y aceptación |
|---|---|---|---|
| N01 | Ya no existe introducción suficiente de guardianes | `src/directors-cut-script.js:5-11` reemplaza beats del prólogo y no contiene roles guardianes; el guion anterior en `src/journey-script.js:5-11` tampoco explica el origen | Presentar a Rosa y Beige como guardianes de la caja, propósito de la luz y misión antes de la huida; mostrarlo con actuación |
| N02 | Hada entra sin causa y la persiguen sin motivo | `src/fairy-guide.js:8-18` describe cuándo nace y vuela; `directors-cut-script.js:8-10` solo suelta el broche, anuncia alas y sale | Mostrar su relación con la luz y su función de guía; no perseguir sin objetivo |
| N03 | Inicio pesado, muchas acciones sin sentido | `src/directors-cut-script.js:5-23` da frases y duraciones sin arco de objetivos; varios beats nacen de automatismos | Edición de guion y movimiento: cada acto con objetivo, obstáculo, acción y resultado; ritmo sin espera muerta |
| A01 | Hoja no tapa el acceso; parece que pesa más que ellos | `src/journey-script.js:18-22`; `src/vineyard-scene.js:67-71,162` hoja pegada a portador y desplazamientos cortos | Hacer hoja vegetal anclada a pérgola y tapar realmente un arco/umbral; escribir diálogo coherente |
| A02 | Beige sostiene, Rosa no cruza al fondo | `src/vineyard-scene.js:70` usa dos pasos cortos de `sign*.11` y `sign*.10` con escala esencialmente fija | Trayectoria en mundo (x,y,z), disminución de escala, ocultación bajo hoja, reaparición al otro lado, luego regreso por quien sostiene; probar ambos órdenes |
| A03 | Río funciona bien | `src/vineyard-scene.js` tiene trayectorias para piedras, saltos y cámara, con stage `creek` | Preservar coreografía, profundidad y gestos; usar como referencia, no reconstruirla por estética |
| A04 | Flor bonita, pero sin motivo; hada estorba | `src/journey-script.js:28-31`, `src/fairy-guide.js:10-18`; apuntado automático del hada al objetivo | Introducir razón narrativa: descanso, aprendizaje a observar, pista hacia cuidado/pétalo; evitar invadir encuadre |
| A05 | Caja aparece bien, pero no explica qué deben reunir | `src/journey-script.js:32-35` lo sugiere vagamente; `src/story-graph.js` tiene vieja referencia a tres destellos | Exponer visualmente 3 señales necesarias, con indicación de dónde buscarlas y cómo serán usadas |
| A06 | «Esta vez sí te esperé» no tiene antecedente claro | `src/journey-script.js:36-38` | Mostrar antes que Rosa se adelanta, Beige queda atrás y luego Rosa decide esperar; o cambiar frase |
| A07 | Guiar luz entre ramas parece no provocar cambios | `src/journey-script.js:36-38` interacción; `src/director.js:244-252` valida toque cerca de luz / objetivo | Movimiento observable de hada y luz que realmente abre paso, con ramas desplazándose y continuidad de cámara |
| A08 | Haces/hojas del bosque permanecen al entrar en nueva escena | `src/transition-director.js:20-45` compone oclusores; `src/director.js:112,122` transporta poses y superpone transición | Auditar limpieza de capas, máscaras, filtros y state invalidation al transferir plano; no doble exposición |
| M01 | La llegada al museo y abrir puerta son muy buenas | `src/gallery-theatre.js:4-33` comparte panorama y recorrido en coordenadas del mundo; `src/vineyard-scene.js` tiene puerta | Patrón arquitectónico de referencia obligatorio; preservar ritmo y puerta |
| M02 | Recorrido con cuadros y sorpresa «Dos sonrisas» funciona | `src/gallery-theatre.js:34-49` obras auténticas y foto cubierta; `src/directors-cut-script.js:25-55` orden reconfigurado | Preservar recorrido y revelación, sin exponer fotos antes del gesto |
| M03 | Cambio a noche frente al cuadro excelente | `gallery-theatre.js` y puente a `la-noche-en-la-pared` | Mantener la obra real enmarcada y transformación de luz, sin sustituir por fondo plano |
| M04 | «Seguir dentro del cuadro» teletransporta a mundo sin lógica | `src/directors-cut-script.js:51-65`; `src/world-cinema.js:5-10` mueve la escena `painting` | Continuar dentro del mismo lenguaje pictórico mediante acercamiento a la superficie del cuadro; no colocar actores encima de un fondo incoherente |
| M05 | Pintar encima de la obra se bugea | `src/sky-brush.js:8-25` almacena coordenadas del frame general, deforma imagen con malla y dibuja trazos; `src/director.js:247,250,252` controla puntero | Usar coordenadas locales de la pintura visible, clipping, overlay propio, pointer capture, sin texturas deformadas; gestos repetibles |
| M06 | Nueva opción «Dibuja tu deseo» | `src/reactive-quests.js:4` opción `paint`; `src/directors-cut-script.js:62` ayuda genera dibujo automático | Dibujo libre real, 1 o más trazos, borrar/deshacer/terminar, respuesta de hada; fallback accesible separado, no fingir que dibujó |
| M07 | Segunda opción «Unir las luces» para V + J | `src/reactive-quests.js:4,23-24` viejo patrón de cinco puntos y `src/sky-brush.js:13` asiste con trazado circular | Puntos suficientes para formar inequívocamente **V + J**, no cinco luces genéricas; completar por interacción o accesibilidad |
| M08 | Después pisan plantas sobre el cuadro | `src/world-cinema.js:9,22`, etapas superpuestas de painting/sky y foreground; atribución de causa precisa por validar visualmente | Prohibir plantas/alfombras/suelo de jardín en la superficie pictórica; capas por mundo estricto; evitar continuar sobre el cuadro |
| G01 | Flores bellas, texto tapa a Rosa y Beige | `src/composition.js:22-28`, `src/dialogue-layout.js`, `src/film.css` y burbujas dinámicas | Definir áreas seguras dinámicas por escena y estado, reencuadrar si hace falta; no mover siempre a los conejitos ni cortar texto |
| G02 | Quiere jardín continuo con flores y mariposas | `src/lily-garden.js`, `src/world-cinema.js` | Ampliar después de la floración con recorrido horizontal/profundidad de mundo; preservar animación floral original |
| R01 | Frase «¡Hay un perrito!» debe mencionar Almendrita | `src/memory-adventures.js:17` contiene beat `dog` | Usar exactamente «¡Hay un perrito! Alguien me dijo que se llama Almendrita.» en el guion final efectivo; no cambiar fotografía |
| R02 | Objetos y decisiones de carta sin peso visual | `src/reactive-quests.js:5,28-29`; `src/vertical-script.js:65` opciones estrella/lirio | Diseñar tres objetos reconocibles, visibles y persistentes; ofrecer a la carta detalle escogido, no iconitos mínimos |
| F01 | Plano/inventario final tapa a Rosita y símbolos ambiguos | `src/story-homecoming.js` compone motivos y `src/director.js:112` dibuja estados; escena final con superposiciones | Presentación de reliquias con safe zone que no oculte personajes y causalidad para la caja |
| F02 | Sujetar caja no es actuación real; caja/texto se estorban | `src/directors-cut-script.js:72-77` dice que sostienen tapa, pero `src/gift-ceremony.js:39-41,47-54` compone poses y geometría por separado | Contacto patita-tapa/broche, animación de levantar, oclusión coherente de personajes, texto sin colisión |
| F03 | Anillo ya visible antes de «Descubrir» | `src/reveal-director.js:5-9` abre y revela a partir de autorización de apertura; `src/director.js:69` ofrece «Descubrir lo que guardaron» por posición de beat | **Separar apertura de broche y revelación del anillo**: tras abrir, secreto aún cubierto; elección posterior lo descubre; no enseñar anillo de antemano |
| F04 | «Mirarlo de cerca» y acciones repetidas | `src/director.js:69,83` etiquetas derivadas de índice/vista | Botones por estado de la ceremonia, cada uno una sola vez y con efecto claro: Abrir / Descubrir secreto / Contemplar / Volver / Una última cosa |
| F05 | Letras finales deben acomodarse dentro de la caja | `src/gift-ceremony.js:15-19,56-58` compone cintas/letras prehorneadas; final en `src/ending-theatre.js:25-27` | Animación espacial de letras dentro de caja formando mensaje; sincronizar con la pregunta final, no texto repentino flotando |
| T01 | Mejorar transiciones como barrido de color final; conservar hoja bonita | `src/transition-director.js:20-45` actualmente varias familias | Sistema coherente de gradientes/motivos, con hoja para cambios propios; nunca sacrificar continuidad espacial |
| T02 | UI se descompone en capítulos posteriores | `src/director.js` centraliza estados; `src/film.css` aplica selectores por estado y modo | Matriz transversal de burbujas, subtítulos, decisiones y botones en todas las escenas, no solo bosque |
| P01 | Mobile vertical bien en iOS y Android, y mejor ritmo | `src/composition.js`, `src/film.css`, `src/director.js`, caches | Probar tamaños 320/375/390/412/430, DPR, viewport dinámico, duración real, uso de memoria, recuperación y regresiones |

## Contradicciones que una buena implementación debe resolver
1. El código reescribe guiones sucesivamente (`journey-script`, `vertical-script`, `directors-cut-script`): en F24.4 debe haber una fuente autoritativa inequívoca por escena; ninguna corrección debe ser sobrescrita al cargar otro módulo.
2. El encuentro de la caja en el primer acto y el regreso final deben ser la **misma ubicación física**, no solo imágenes parecidas.
3. El rastro del dedo debe pertenecer al área proyectada de la obra real, no al viewport. No transformar el cuadro con una malla deformante para «simular» interacción.
4. Tres reliquias con función definida y persistencia real, no tres iconos sin narrativa.
5. Guardar el estado de **abrir la caja** y de **revelar el anillo** como dos autorizaciones distintas; ni un cronómetro ni una recarga deben saltarse la sorpresa.

## Límites del alcance
- Sin sustitución de fotos, anatomía, peluches, carta personal ni jardín de lirios ya aprobado.
- El cambio «lirios» → «rosas» de la carta debe permanecer. Un lirio del jardín puede seguir existiendo como objeto si la historia lo justifica; no cambiar toda la vegetación por rosas.
- La opción de contemplar libremente fotos/carta, así como la pregunta final, debe permanecer protegida sin temporizador.
- No convertir la película en navegación por scroll ni añadir menú permanente.
- No exigir al usuario capturas, video o paquetes de evidencia: pruebas técnicas, resumen y ZIP completo.
