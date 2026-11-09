# VALERIE — Plan maestro de dirección cinematográfica mobile vertical
**Propuesta creativa y técnica — 29 de octubre de 2026**

## Decisión de producto no negociable
La versión principal y única prioridad de diseño es **teléfono en vertical (portrait)**. No invertir trabajo de esta etapa en horizontal, desktop ni en rehacer un diseño responsive universal. El primer dispositivo de referencia es iPhone 13 Pro (~390 × 844 CSS px), con protección desde 320 × 568, 360 × 800, 375 × 812 y 390 × 844; considerar variaciones de barra del navegador, safe areas y teclado/VoiceOver. Mantener funcionamiento de otros tamaños como compatibilidad secundaria, sin pulirlos en esta fase.

**Visión:** una película ilustrada en movimiento que Valerie ve y ocasionalmente toca. No es un juego de puntos, una presentación de diapositivas ni un sitio web convencional. El 80 % del tiempo la historia fluye sola; el resto son decisiones y momentos que merecen detenerse. La experiencia deberá sostener la emoción sin forzar una respuesta amorosa ni manipular sentimientos.

## Base real estudiada
- Proyecto F24 recibido: 19 escenas, motor `cinema-clock.js`, política editorial, `vineyard-scene.js`, `transition-director.js`, HUD, bosque F23, museo/cielo, jardín/lirios, 3 fotos, carta y regalo/final.
- La biblia actual: Rosa lleva la iniciativa y se asombra; Beige es cuidadoso, cómplice y también se sorprende. Ambos buscan devolver luz a una caja dormida. Tres motivos — curiosidad, cuidado y recuerdos — conectan la historia; no son puntos.
- Ocho decisiones existentes conservadas como IDs y consecuencias: `leaf-holder`, `forest-way`, `museum-sky`, `garden-gift`, `portrait-reveal`, `album-space`, `quiet-memory`, `letter-seal`.
- Los textos de las fotos, la carta existente, las identidades de los peluches, sus proporciones, el contenido del regalo y la pregunta final son elementos protegidos. No reescribir ni anticipar la carta, revelar el anillo antes de su escena ni inventar hechos históricos reales.
- Hallazgo técnico: el HUD actual calcula `showNext` con `held || manual`; por ello puede mostrar «Siguiente» al entrar en cualquier espera de elección/interacción/lectura/revelación, en vez de reservarlo para una necesidad real. Corregir semánticamente, no solo con CSS.

## Experiencia objetivo — contrato de control
**PLAYING:** diálogo, miradas, saltitos, reacciones y cambios de plano automáticos; **ningún botón «Siguiente»**. Únicamente un acceso discreto y recuperable a controles si la persona lo necesita. El texto permanece el tiempo suficiente para leerse; no detener una coreografía a la mitad por temporizador.

**CHOICE:** la película pausa antes de que los conejitos actúen. Se atenúa sutilmente el fondo (sin desaparecer escenario), se colocan **dos opciones claras con verbo, protagonista y resultado inmediato visible**. Aparecen con una animación motivada por luz/hoja/objeto del mundo. **No mostrar «Siguiente» ni «Continuar sin elegir» como CTA principal**. Al tocar una alternativa, el panel se transforma en una señal de confirmación muy corta, ejecuta la consecuencia visual y reanuda automáticamente. Si se conserva ruta neutral por accesibilidad, ofrecerla discretamente en opciones secundarias, sin crear un bloqueo.

**INTERACTION:** si se necesita tocar, mantener presionado, arrastrar o trazar, indicar una sola acción específica y breve en lenguaje humano: «Toca la luciérnaga», «Desliza la hoja hacia arriba». Mostrar dónde tocar con iluminación/respiración del objeto, no flechas genéricas. Cuando detecta la acción, dar feedback visual, deshabilitar duplicados y reanudar automáticamente al terminar la actuación. Mantener alternativa accesible de un toque «Ayudarles» solo si el gesto complejo no puede realizarse; no dejarla inerte.

**PROTECTED_HOLD:** fotografías, lectura de carta, inspección del anillo, momentos íntimos y ceremonia: **pausa sin vencimiento**, con CTA específico, elegante y contextual cuando de verdad toca continuar: «Seguir cuando quieras», «He terminado de leer», «Volver con los conejitos». Si un libro tiene páginas, controles de páginas son explícitos sin esconder un «Siguiente» ambiguo. La pregunta final no tiene botón «Sí/No» ni cierre por reloj: la respuesta es presencial.

**PAUSED / MENU:** botón mínimo de acceso en borde seguro que revela solo al solicitarse un panel sencillo (Pausar/Reanudar, Volver, Repetir momento, Capítulos, Sonido/Texto). No abrir el menú automáticamente por el simple hecho de entrar a una decisión. Nunca cambiar posición o escala del mundo al abrir/cerrar controles. El foco de teclado y VoiceOver debe permanecer válido. El propio menú no es la interfaz principal de la película.

**MANUAL (opcional):** accesible como preferencia, sin contaminar el modo Cine por defecto. En él sí puede haber avanzar/retroceder persistentes o contextuales.

## Reglas de puesta en escena y animación
1. **Los conejitos actúan, no se deslizan.** Para cada salto: preparación con flexión, mirada al destino, impulso, parábola, contacto, recuperación; apoyo de patitas y sombra consistente. Para caminar, pasos cortos creíbles. Rosa es más vivaz; Beige se anima progresivamente.
2. **Acción y reacción.** Quien no habla también escucha, cambia la mirada, inclina orejas, sostiene un objeto, se sorprende, tiene intención. Evitar dos personajes congelados mientras surge un texto.
3. **Continuidad mensurable.** Conservar coordenadas lógicas del escenario, escala, luz y orientación; plano siguiente hereda raíces cuando es contiguo. Ocultar cambios de lugar solo bajo oclusiones diegéticas (hoja, tronco, marco, ola, página), no con fundidos negros genéricos.
4. **Cámara con propósito.** Travelling suave siguiendo saltitos; aproximación lenta para confidencias; plano general para maravilla; sobrehombro o contraplanos para conversaciones; detalle en flor/estrella/recuerdo; regreso al plano compartido. Nada de zooms mecánicos repetidos.
5. **Movimiento ambiental único por mundo.** Hojas, brisa, luciérnagas, luz volumétrica, hongos bioluminiscentes, trazos pictóricos en el museo, cielo respirando, reflejos de mar, flores creciendo, páginas de tela, polvo dorado. No todo brilla al mismo tiempo: jerarquía visual.
6. **Transiciones con causa.** El objeto del plano motiva el siguiente: una hoja cubre lente → bosque; luciérnaga entra por rendija → cabaña; ventana de la cabaña encuadra una estrella → museo; pincelada → dentro del cuadro; estrella cae reflejada → playa; ola deja una semilla luminosa → jardín; pétalo → fotos; página → carta; sobre → camino de vuelta; luz → caja.
7. **Silencios justificados.** Puede haber pausas quietas que transmitan ternura, pero el mundo permanece vivo con microgestos; no bloquear narración por 10 segundos de figura inmóvil.
8. **Tipografía e inmersión.** Usar diálogos muy breves por beat, en burbujas que no tapan caras; subtítulos garantizados y transcripción opcional. Salida/entrada delicada, no tipeo monótono de cada carácter. Alta legibilidad sobre cualquier fondo.
9. **Sonido original opcional.** Activar solo tras gesto voluntario y respetar restricciones de autoplay. Capa ambiental original sutil por bioma; silencios antes de la carta, el anillo y la pregunta. No incrustar canciones comerciales sin licencia.
10. **Respeto y accesibilidad.** Soporte de movimiento reducido con cortes compuestos, rutas equivalentes de un toque, 44×44 px mínimo, contraste legible, foco anunciado, sin scroll narrativo ni gestos obligatorios difíciles.

## Nueva estructura dramática: 23 capítulos, seis actos
Se conservan los 19 existentes y se **proponen cuatro nuevos**. No agregar escenas sin mejorar su función emocional; cada escena debe cambiar a un personaje, revelar un detalle o preparar una emoción.

| Acto | Capítulos | Función emocional | Mundos |
|---|---|---|---|
| I. Un poquito de valor | 1–6 | Rosa quiere llegar rápido; Beige quiere cuidar; ambos aprenden a esperar y confiar | Viñedo |
| II. Una luz que escucha | 7–9 | Descubren que la luz responde cuando atienden al otro | Bosque, honguitos **nuevo**, cabaña **nueva** |
| III. Lo que dibuja la noche | 10–12 | Transforman curiosidad en un cielo propio | Museo, cuadro, estrellas |
| IV. El lugar donde llega la luz | 13–15 | Una estrella se refleja en el mar y trae cuidado al jardín | Playa nocturna **nueva**, lirios |
| V. Las cosas que permanecen | 16–19 | Fotos auténticas sin ficcionalizar; sobre y carta íntegra | Tres recuerdos, carta |
| VI. Volver con algo verdadero | 20–23 | Regresan por un camino transformado; caja/anillo; pregunta presencial | Regreso **nuevo**, regalo, final |

**Logline:** Rosa pierde una pequeña luz que debía proteger para una caja dormida. Beige le ayuda a buscarla, pero descubren que no se recupera persiguiéndola: su brillo reaparece en momentos de curiosidad compartida, cuidado y recuerdos. Valerie no está sometida a pruebas; acompaña los gestos, decide cómo descubrir y llega a una pregunta que solo existe fuera de la pantalla.

**Arco de personajes:** al inicio Rosa se adelanta, teme que algo se escape y quiere actuar primero; al final aprende a esperar y a invitar a Beige a dar el primer paso. Beige al inicio contiene y protege, pero aprende a arriesgarse un poquito, a reírse y a ser el primero en saltar cuando importa. Ninguno sermonea al otro. Su amistad y complicidad se narran a través de coreografía más que de frases grandilocuentes.

## Ocho decisiones rediseñadas, sin ambigüedad
Mantener los `choiceId` y los valores de opción ya existentes; cambiar **copy y presentación** sin romper sesiones antiguas. Cada elección anuncia qué hará la protagonista o su compañero y muestra su consecuencia exacta después del toque. No hay opción correcta ni penalización, y ambas rutas reconvergen de manera orgánica.

| ID | Pregunta clara | Alternativa A | Alternativa B | Consecuencia visible y eco |
|---|---|---|---|---|
| `leaf-holder` | «¿Quién sostiene la hoja para que pasen?» | «Rosa la levanta; Beige cruza» | «Beige la levanta; Rosa cruza» | Toma real de hoja, pasos distintos, el portador reaparece luego bajo ella |
| `forest-way` | «¿Por dónde descubren el camino?» | «Seguir a la luciérnaga» | «Escuchar al árbol antiguo» | Ruta, luz y gesto diferentes; luz/pista vuelve al museo |
| `museum-sky` | «¿Cómo abrirán el cielo del cuadro?» | «Dibujar una estrella juntos» | «Unir las cinco luces» | Trazo visual distinto, figura reaparece en el cielo |
| `garden-gift` | «¿Qué podrán cuidar en el camino?» | «Guardar el pétalo rosado» | «Proteger la pequeña flor de luz» | Dos formas de cargar, motivo visible en la carta/caja |
| `portrait-reveal` | «¿Cómo descubren lo que se esconde?» | «Levantar la hoja entre los dos» | «Pedirle luz a la luciérnaga» | Revelado diferente, foto completa sin filtros destructivos |
| `album-space` | «¿Cómo miran juntos esta página?» | «Rosa le hace sitio a Beige» | «Beige ayuda a pasar la página» | Coreografías y ángulos distintos; no es elegir una persona |
| `quiet-memory` | «¿Cómo acompañan este instante?» | «Sostenerlo con una lucecita» | «Quedarse acurrucados» | Variación de atmósfera que reaparece en el sobre |
| `letter-seal` | «¿Qué detalle acompañará la carta?» | «Una estrella del cielo» | «Un lirio del jardín» | Sello animado coherente en el sobre y en el regreso |

**Diseño de decisiones:** introducción animada de 300–450 ms; dos tarjetas de igual peso visual, sin gradientes estridentes, tipografía clara y un pequeño dibujo/gesto representativo. Las opciones son decisiones de **acción**, no abstracciones sentimentales («amor o destino», «sí/no», etc.). Desaparecen al seleccionar; el resultado se cuenta con movimiento, no con un mensaje de éxito. En teléfono corto, reducir ornamentos, no áreas táctiles. El motor no debe navegar hasta que la actuación derivada confirme `complete`.

## Interacciones orgánicas adicionales (no decisiones)
- Viñedo: una luz se acerca a la patita al **tocar un destello**; una sola acción con resultado inmediato.
- Bosque: **abrir helechos deslizando** o con botón equivalente accesible; el helecho se desplaza de forma física; no activar arrastre de scroll.
- Hongos nuevos: **tocar uno de tres honguitos** para encenderlos en secuencia orgánica. Cada uno influye en los otros; no hay fallo ni timer.
- Cabaña nueva: **acercar una luciérnaga a una ventana** con toque o arrastre corto; dentro aparece fugazmente una constelación que anticipa el museo.
- Museo: **dibujar un trazo corto** o tocar cinco estrellas según la decisión; auto-asistencia de un toque si se necesita.
- Playa nueva: **arrastrar suavemente una estrella reflejada sobre la orilla** para iluminar una pequeña semilla; la marea actúa y produce transición al jardín.
- Jardín: **acariciar/tocar un lirio** para ver crecer la flor, con realimentación en el tallo y el pétalo.
- Recuerdos: fotos no son minijuegos; opcional acercamiento para mirar y continuación consciente.
- Caja: apertura en pasos comprensibles y respetuosos con la revelación, evitando taps que omitan fases.

No convertir cada beat en una obligación. Alternar 1–2 minutos de cine continuo con una interacción significativa donde corresponda. Nada de recolectar premios, puntuaciones, secuencias contrarreloj o falsas elecciones.

## Plan de implementación por entregas reales
**P0 — Congelar base y contratos (corto):** continuar desde ZIP F24; inventario focalizado, rama/copia separada, registrar IDs narrativos, recursos originales y reglas de estado; pruebas de regresión mínimas. No reiniciar F23 ni reemplazar arte/personajes. La próxima entrega se llamará `F24.1_VERTICAL_DIRECTORS_CUT`.

**P1 — F24.1: controles y decisiones verdaderamente cinematográficos (bloqueante):** sustituir semántica de CTA por estados PLAYING/CHOICE/INTERACTION/PROTECTED_HOLD/PAUSED; eliminar «Siguiente» del autoplay normal y de la elección; crear interfaz exclusiva 9:16, opciones de acción con animación y feedback, foco/VoiceOver, cierre limpio, pausas y restauración. Recorrer las ocho decisiones sin modificar contenido final. Corregir ayudas inertes del bosque y eliminar botones duplicados.

**P2 — F24.1: rodar de nuevo los primeros siete capítulos en vertical:** guion y actuaciones de viñedo, primeros conflictos y reconciliación, transiciones encadenadas, actuación física verificable, cámara, luz, microgestos. Validar 1→7 en una reproducción real sin pedir «Siguiente» innecesariamente; hacer cine, no solo refactor.

**P3 — F24.2: bosque, honguitos y cabaña:** integrar arte existente de bosque y hongos; crear solo los assets necesarios para la cabaña, conservando escala/anatomía y estética. Interacción directa y dos rutas de bosque con consecuencias reales. Sembrar el motivo de la ventana/marco.

**P4 — F25: museo, interior del cuadro y cielo:** dirección propia, trazos de pintura vivos, portal continuo, constelaciones con persistencia visual de elección. Conectar una estrella descendente con la nueva playa nocturna (F25.1 si el alcance lo necesita).

**P5 — F26: playa, jardín, lirios:** una playa narrativa y corta, no un mundo sin función; reflejos, espuma, arena, manos/patitas, semilla de luz que germina. Jardín con crecimiento artístico y foco real en conejitos.

**P6 — F27/F28: recuerdos y carta:** miniaventuras de las tres fotografías sin inventar información sobre lo fotografiado. Carta intacta, sin límite de tiempo, transiciones de página y voz narrativa respetuosa. No anticipar regalo.

**P7 — F29/F30: regreso, caja, anillo y final:** retorno de motivos y elecciones, caja que reconoce la luz, apertura por pasos, macro de anillo protegida, ceremonia y pregunta final presencial que permanece sin countdown.

**P8 — masterización privada vertical:** pruebas reales en iPhone 13 Pro/Safari y Android vertical; tiempos y memoria, legibilidad, sonido, movimiento reducido, conexión QR privada HTTPS y privacidad de fotos. El HTML autónomo se conserva como offline, pero el destino del QR debe ser modular/protegido y cargar por etapas. No publicar sin revisión expresa.

## Criterios de aceptación exigentes para F24.1
- Arranque real en **modo Cine** con los primeros siete capítulos conectados sin intervención para avanzar diálogos ordinarios.
- **Cero botones «Siguiente»** en PLAYING y en CHOICE. CTA visible solo al concluir contenido protegido, esperar una ayuda alternativa de interacción, o en modo manual explícito.
- Cada decisión muestra exactamente dos consecuencias legibles; una pulsación ejecuta actuación distinta y vuelve al cine sin botón adicional. Ocho IDs originales compatibles.
- **Cero saltos visibles** de centro/escala/pies entre planos contiguos del viñedo, y ninguna transición que avance sobre animación incompleta.
- Nada se congela durante pausa o fondo de pestaña; reanudar no dispara doble avance ni salta capítulos.
- Interacciones con feedback perceptible, sin toques inútiles, sin multiplicar el mismo evento en taps rápidos.
- Protecciones de fotos, carta, caja, anillo y pregunta se mantienen idénticas (no autoavance). Carta y fotos no cambian.
- Composición probada en portrait 320×568, 360×800, 375×812, 390×844: sin overflow, sin controles sobre ojos/caras/patitas/objetos críticos, área segura correcta, botones >=44px, foco audible y legible.
- Revisión de desempeño con objetivos de **60 fps cuando el dispositivo lo permita**; medir en teléfono real y evitar afirmaciones infundadas. No reducir belleza por cumplir un número sintético.
- QA: pruebas de estado/decisión/gesto/navegación/recarga + build; **no pedir capturas, videos, grabaciones ni paquetes de evidencias** al Codex; el autor revisa el acabado visual en su teléfono.
- Entrega de ZIP completo, archivos fuente y un `CHECKPOINT.md` breve con cambios, pendientes y comandos de arranque para Windows. No documentar o compilar repetidamente sin necesidad.

## Dirección de colaboración y gestión de tokens
Una etapa por iteración. Un agente principal; tareas secuenciales. Reusar módulos existentes, modificar contratos solo con pruebas. No consumir tiempo en horizontal ni en reexaminar toda la historia. Skills: `impeccable` para pulido visual si es útil; otras solo si demuestran necesidad. Primero implementar algo **visiblemente mejor** y probarlo, no acumular cientos de funciones de laboratorio que no llegan a escena.

## Control de alcance / promesa de calidad
Este documento es **plan y guion propuestos**, no código implementado ni resultado verificado. El criterio final de aprobación artística corresponde al autor al probar la película en móvil vertical. Se aceptan nuevas escenas solo después de un primer tramo 1–7 que ya transmita continuidad, interactividad y belleza.
