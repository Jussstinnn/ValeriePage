# VALERIE F24.2 — Auditoría real del ZIP, capturas y recorrido

**Base inspeccionada:** `VALERIE_F24_2_CUENTO_CINEMATOGRAFICO_COMPLETO.zip` (original no modificado).  
**Evidencia visual facilitada:** captura de inicio vertical, reproducción de *El grito*, reproducción de *La noche estrellada*. Las dos pinturas son referencias de obras auténticas solicitadas por el usuario; **NO** son capturas de cómo se ve el museo actual.  
**Grados de certeza:** [C] confirmado en código o ejecución; [V] evidente en captura del usuario; [I] inferencia técnica con reproducción en Safari/Android pendiente.

## A. Pruebas efectivamente ejecutadas

- `npm test`: **32/32 PASS**.
- `npm run test:vertical`: **30/30 PASS**.
- `npm run test:forest`: **15/15 PASS**.
- `npm run test:journey`: **3/3 PASS**.
- `npm run test:polish`: **3/3 PASS**.
- `npm run build`: **PASS**; recursos protegidos verificados por el script.
- Chromium headless, `page.set_content()` de la edición autónoma HTML en viewport móvil **390×844**: carga, primera escena renderizada, `body[data-ready]=true`, **0 errores JavaScript capturados** durante la apertura. `Valerie.state().view.frame = {x:22, y:66, w:346, h:574}`. Se generó inspección interna del primer fotograma; la visita programática a escenas posteriores no se verificó porque el salto empleado no cambió de escena y el intento de larga duración agotó el tiempo asignado.
- **NO se han ejecutado pruebas en iPhone Safari ni Android físico.** No se afirma fluidez medida ni ausencia de bugs a lo largo del recorrido.

Los tests pasan, pero **no evalúan la calidad de dirección, el interés narrativo, la fidelidad de las pinturas, la composición de todo el recorrido ni el momento de revelar el anillo**.

## B. Captura de inicio: fallos y causas

### F24.2-01 — P0: alrededor de 160 px inferiores desaprovechados [V+C]

La captura facilitada (484×884) muestra la ilustración hasta ~y714 y una franja inferior turquesa oscuro de ~160 px; los dos personajes están en el centro, la burbuja está arriba y no hay texto útil debajo. En una ejecución independiente a 390×844, el motor usa `frame={x:22,y:66,w:346,h:574}`.

**Causa principal:** `src/composition.js:7–31` reserva `captionHeight` y finaliza el frame por encima de la zona inferior. `src/dialogue-layout.js:10–13` mantiene reserva medida aunque el diálogo se presente en una burbuja; `src/film.css` vuelve invisible `#reading-panel` con `data-presentation=bubble`, pero el frame no recupera ese espacio. `src/director.js:45–49` usa la geometría calculada. **No es simplemente falta de decoración**.

**Arreglo de arquitectura:** modelo de composición editorial por plano donde las capas escénicas puedan ocupar toda la pantalla y texto/burbujas dispongan de zonas seguras; evitar variación brusca del tamaño del mundo al cambiar de presentación. Si los personajes, escenarios y subtítulos pueden solaparse, definir cinematografía de cámara y zonas de lectura planificadas, no “devolver” el frame a saltos entre beats.

### F24.2-02 — P0: composición mobile centrada de modo genérico [V+C]

En el fotograma inicial, ambos peluches están casi al mismo nivel, alineados frontalmente, con mucho fondo inmóvil tras ellos; el farol/cinta no se lee como actividad protagonista. `src/journey-script.js` define acciones, pero la experiencia percibida no exhibe un conflicto dramático con suficiente fuerza. No se corrige agregando textos o cambiando tipografía.

**Aceptación:** en los primeros segundos se ven acciones con objetivo claro y cámara apropiada. Dos conejitos pueden ocupar el plano, pero se necesita una coreografía visible y no esperar al siguiente turno hablado.

### F24.2-03 — P0: prólogo lento antes de pedir colaboración [C]

`src/journey-script.js` define las primeras ocho intervenciones del prólogo con duraciones: 3.8 + 3.6 + 3.4 + 3.8 + 3.2 + 3.6 + 3 + 3.2 = **27.6 s de duraciones editoriales nominales antes de `lantern-release`**. El prólogo completo tiene **39.4 s nominales**. Puede durar más por esperas de actuaciones. No se ha cronometrado el tiempo de reproducción real en un teléfono. Esto explica que pueda sentirse denso, incluso si cada beat tiene una animación.

**Arreglo:** una apertura breve y visualmente potente: acontecimiento temprano, presentación de personajes mediante acciones, primera intervención de Valerie mucho antes; recuperar diálogo solo donde aporte personalidad. No forzar un contador rígido de segundos sin valorar la duración física.

## C. Primeros actos y acciones

### F24.2-04 — P0: la densidad del guion no garantiza dramaturgia [C+valoración]

`src/journey-script.js` contiene decorados `arch`, `rows`, `pergola`, `creek`, `rose`, `alcove`, `tunnel`: **sí existen fondos diferentes**. El problema no es que F24.2 use un único viñedo —eso habría sido una conclusión falsa—, sino que no siempre desarrolla visualmente acontecimientos distintos con cámara, actuación y consecuencia. En otras palabras: **existen localizaciones, pero no suficientes escenas dramáticas**.

Dejar de medir calidad por cantidad de fondos, líneas, clases o tests. Cada escena necesita: antecedente causal, obstáculo o descubrimiento, acción visible de uno o ambos conejitos, oportunidad de interacción bien justificada y salida física hacia la siguiente ubicación.

### F24.2-05 — P1: preservar lo bueno [reportado por usuario]

El río, contemplar la flor, aparición de la caja, abrir la puerta y el bosque son puntos positivos del recorrido del usuario. **No autorizar reescritura masiva de esas mecánicas**; elevar su montaje, iluminación, consecuencias y continuidad sin destruirlas.

## D. Museo y pinturas auténticas

### F24.2-06 — P0: museo escenográficamente contradictorio [C+V]

`assets/art/gallery-room.png` es una sala cálida con columnas, plantas laterales, grandes huecos hacia viñedos y **pared central vacía**. El asset `assets/journey/vestibule.webp` ya tiene faroles, marcos y una imagen alusiva a *La noche estrellada* al fondo, pero eso no constituye todavía un recorrido de obras auténticas de cuadro en cuadro. `src/set-dressing.js` dibuja luminarias cerca de la pintura, no una secuencia curada de obras.

Las referencias aportadas por el usuario son las reproducciones reconocibles de *El grito* (Edvard Munch) y *La noche estrellada* (Vincent van Gogh). Exigir que se muestren como pinturas reales dentro de marcos y muros creíbles, con escala física, parallax y luz. Conservar la integridad visual de los cuadros (no deformarlos, recolorearlos ni reemplazarlos por interpretaciones genéricas); verificar la licencia de la fotografía digital que se distribuya cuando no sea la proporcionada por el usuario.

### F24.2-07 — P0: la Noche estrellada del programa NO es reproducción de la obra [C]

`src/night-painting.js:1–13` genera un Canvas de 960×760 descrito expresamente como “procedural interpretation of Van Gogh's 1889 composition”, no como un asset fiel de *La noche estrellada*. Ese render puede servir como capa animada posterior, pero **no debe reemplazar la pintura auténtica en la pared**. Crear dos niveles: cuadro original dentro de la galería; transición espacial justificada hacia una dimensión animada creada a partir de motivos de la obra. No presentar la versión procedimental como el original.

### F24.2-08 — P0: decisión del cielo insuficiente [C + feedback]

`src/reactive-quests.js:4` solo ofrece “Pintar una estrella” y “Encender una constelación”, con consecuencias `brush-star` / `constellation`; faltan la secuencia de contemplación, la actuación de pintar con trazos integrados en la composición, una respuesta dramática significativa y un clímax emocional visible. La frase solicitada **“Valerie es nuestro mayor deseo”** debe formar parte del clímax, no aparecer como una etiqueta genérica adelantada.

### F24.2-09 — P0: `Dos sonrisas` está después, no antes del museo [C]

`src/content.js` sitúa `el-museo-de-la-noche`, `dentro-del-cuadro`, `un-deseo-para-dos` antes de los capítulos de recuerdos, y `src/personal-content.js` define `dos-sonrisas` como recuerdo posterior. El usuario quiere la memoria `Dos sonrisas` **antes** de la culminación en *La noche estrellada*. No es un simple copy: requiere reordenar el grafo, las protecciones, la persistencia, la navegación y el orden de los recursos precargados, garantizando que la foto personal solo se revele en la interacción adecuada y no quede expuesta por accidente.

## E. Hada, luz y consecuencias

### F24.2-10 — P1: la hada todavía no tiene identidad física [C]

`src/adventure-world.js:... forestLife()` dibuja una luz con dos pequeñas elipses que simulan alas, y `stats.fairy` registra coordenadas. No hay un personaje-hada riggeado con silueta, gestos, expresiones o continuidad comparable a los peluches. Es válido como luciérnaga, **insuficiente para la hada guía que pide el usuario**. Necesita identidad visual original, pequeño set de poses, path continuo y apariciones narrativamente justificadas. Rosa y Beige siguen siendo protagonistas.

### F24.2-11 — P1: consecuencias más simbólicas que escénicas [C]

Hay huellas del camino en `src/story-homecoming.js` (`forestLight`, `skyMotif`, `gardenRelic`, etc.), pero se representan como motivos pequeños cerca de manos, no siempre como transformaciones claras del entorno. Añadir estado persistente de color/forma de pétalo y estrella, visible en elecciones, museo, jardín y regreso. **No presentar una respuesta textual como consecuencia suficiente**.

## F. Final y anillo

### F24.2-12 — P0: el anillo aparece por el reloj en lugar de una revelación explícita [C]

`src/gift-ceremony.js:39` define `open = span(1.3,6.3,t)` en modo ceremonia. `src/gift-ceremony.js:54` dibuja la joya cuando `open > .65`, independientemente de un evento de apertura confirmado por Valerie. El toque `jewel` activa sobre todo el acercamiento macro, **no la primera aparición**. Además, `src/content.js` declara `placement.confirmed:false` y `gift-ceremony.js` vuelve a anotar `placementConfirmed:false`.

**Debe corregirse a estado explícito:** `BOX_CLOSED` -> `UNLATCHED` -> `LID_OPENING` -> `RING_REVEALED` -> `RING_CLOSEUP` -> `QUESTION`. No renderizar ni precargar visualmente el anillo en la escena hasta que la acción autorizada desbloquee la revelación. Ajustar máscara/oclusiones, profundidad respecto a la tapa y posición de joya física. Confirmar contra la referencia del anillo incluida en ZIP.

### F24.2-13 — P0: el último escenario cambia al jardín, no a la localización de la caja [C]

`src/ending-theatre.js` en `EndingWorld.background` usa `VF.Art.image('garden')` cuando `chapter==='finale'`. `src/set-dressing.js` en ceremonia usa una versión oscurecida de `clearing` con piso superpuesto. El resultado puede sugerir regresar, pero **no garantiza volver al mismo lugar visible donde hallaron la caja en el primer acto** (`alcove` / localización donde se descubrió). Se necesita un retorno cinematográfico a un mismo espacio identificable, con continuidad de la caja, orientación de cámara, vegetación y farol.

## G. HUD, textos, ritmo y rendimiento

### F24.2-14 — P0: HUD/captions tienen múltiples sistemas de composición [C+I]

`src/cinematic-hud.js:6–10` centraliza controles; `src/director.js:69–99` mezcla navegación por beat, ayudas y estados. `src/bubble-director.js` fija burbuja por turno con fallback a subtítulos y `src/dialogue-layout.js` mide el mayor texto del capítulo. La escena del bosque utiliza un director gráfico distinto al del museo y final (`isForest()`, `activeWorld()` / `activeStage()`). **La caída posterior reportada por el usuario no queda reproducida en Safari**, pero existen varios caminos de presentación y offsets fijos que justifican un recorrido de QA escena por escena.

**Prueba necesaria:** cada entrada/salida de capítulo, móvil vertical de 320/375/390/412/430px, safe areas, Chrome Android y Safari iOS reales. Afirmar “no pasa en tests unitarios” no lo arregla.

### F24.2-15 — P1: recursos y rendimiento [C]

HTML autónomo ~**42.7 MB** (bytes sin comprimir); paquete ZIP F24.2 ~**169 MB**; recursos `assets/journey` contienen imágenes PNG originales de ~3.5MB y WebP de ~0.7–0.8MB para escenas. Esto no mide necesariamente la transferencia web. `src/journey-assets.js` usa carga y retención limitada de escenas, una base positiva. La optimización debe medir tiempo de cuadro, recursos decodificados en memoria, picos, GC, transiciones y latencia de entrada; evitar bajar artificialmente FPS o eliminar animaciones valiosas.

## H. Plan de implementación propuesto — en puertas de aceptación, no 1h20 de parches

**Gate 1 — Arranque premium móvil:** corregir la reserva de caption/encuadre y reescribir prólogo y primeros 4 capítulos, manteniendo el río y rosa aprobados. Primera interacción mucho antes. El usuario debe notar transformación sustancial en los primeros minutos antes de seguir.

**Gate 2 — Recorrido y museo auténtico:** hada y luz coherentes; entrada desde bosque; galería con cuadros auténticos, `Dos sonrisas` antes de Noche estrellada; gran escena interactiva de cielo. Proteger foto y decisiones.

**Gate 3 — Cierre circular:** misma localización de la caja, anillo oculto que se revela con una acción, pregunta final intacta; revisar HUD en TODO el recorrido.

**Gate 4 — QA y empaquetado:** pruebas focalizadas y generales una sola vez tras estabilización; mobile emulado y físico claramente distinguidos; ZIP completo, changelog y limitaciones reales. No capturas ni videos a entregar.

## I. Qué NO se ha certificado

- Safari físico y Android físico.
- Ritmo real de reproducción completa cronometrada.
- Rendimiento FPS/memoria en dispositivos reales.
- Que se haya reproducido el colapso posbosque en navegador.
- Calidad final de los escenarios nuevos: **todavía no se han implementado**.

**Conclusión:** la base técnica existe y pasa pruebas, pero varias decisiones arquitectónicas y artísticas verificables contradicen la dirección solicitada. Repetir el viejo prompt genérico no resolverá este desajuste. Hay que exigir evidencia de transformación por escenas, con criterios observables, sin quemar cuota en trabajo que no mejore la experiencia.
