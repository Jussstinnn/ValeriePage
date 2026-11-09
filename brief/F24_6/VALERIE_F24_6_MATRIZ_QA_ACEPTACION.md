# VALERIE F24.6 — Matriz de aceptación ejecutable y artística

**Norma:** cada caso debe registrar estado (PASS/FAIL/BLOCKED), navegador/dispositivo, condición inicial, acción, resultado y si fue real o emulado. No inventar pruebas físicas. Los casos bloqueantes no se pueden declarar aprobados únicamente porque un test inspecciona variables de estado.

| ID | Recorrido / acción | Criterio obligatorio |
|---|---|---|
| QA-01 | Abrir prólogo en móvil 320×568 | Burbujas y CTA accesibles, sin recortes, caja y objetivo comprensibles |
| QA-02 | Probar 375×667, 390×844, 412×915, 430×932 | Sin overflow, clipping, safe-area invadida o controles tapados |
| QA-03 | Lectura Rosa y Beige | Rosa pastel rosa, Beige pastel beige, tres puntos; anclaje correcto y estable |
| QA-04 | Pasar de capítulo con burbuja a otro con subtítulo | No hay salto editorial injustificado ni texto que aparece/desaparece |
| QA-05 | Hoja opción A | Uno sostiene, el otro atraviesa al fondo, ambos terminan sobre el sendero |
| QA-06 | Hoja opción B | Lo mismo con papeles invertidos, sin deformaciones ni salto de escala |
| QA-07 | Transición después de hoja | Pose/pies/escala/cámara son coherentes con salida anterior |
| QA-08 | Salto en piedras | Impulso/sombra/aterrizaje estables, zoom no corta piedra ni personajes |
| QA-09 | Cruce de bosque→museo | Sin capas heredadas de bosque, transición motivada, sin teletransporte |
| QA-10 | Umbral museo | Igual o mejor que referencia aprobada: andar, profundidad, abrir puerta |
| QA-11 | «Dos sonrisas» | Álbum existe en banco; se abre/revela ahí, cámara hace el movimiento, no se transporta ni duplica |
| QA-12 | Noche estrellada | Reproducción de cuadro intacta, pintura/constelación sobre el propio cuadro, sin glitches |
| QA-13 | Constelación | No se revela V+J antes de completarla, dibujo final sí forma V+J |
| QA-14 | Floración | Fondo/cámara quietos mientras florece, lirios originales intactos |
| QA-15 | Jardín posterior | Paseo coherente, mariposas/flores diferentes, sin tapar protagonistas |
| QA-16 | Excavación | Tierra desaparece progresivamente bajo gestos naturales; conejos excavan; objeto emerge y se limpia |
| QA-17 | Recolectar tercera señal | Solo una tercera reliquia; la opción elegida se conserva |
| QA-18 | Carta, ambas decoraciones | El adorno correcto aparece **en la carta** y persiste en recarga |
| QA-19 | Plano de 3 reliquias | Exactamente las variantes ganadas, sin símbolos anteriores, sin tapar Rosa |
| QA-20 | Regreso a caja | Alineación de 3 broches a 320, 390, 430; coordenadas de ranuras relativas a caja |
| QA-21 | Proyección de objetos | Cada objeto viaja desde mano a broche visible; no pasa tras la caja ni frente a capas equivocadas |
| QA-22 | Abrir caja | Broches y manos conectados, tapa correcta, anillo sigue oculto |
| QA-23 | «Descubrir el secreto» | Solo al tocar se revela el anillo con animación, texto no lo tapa |
| QA-24 | «Mirarlo de cerca» | Zoom elegante, luego vuelta y salida clara a pregunta, sin congelarse |
| QA-25 | Pregunta final | Letras emergen de caja abierta con anillo visible; «Valerie, ¿quieres ser mi novia?»; sin respuesta digital obligatoria |
| QA-26 | 2 minutos en pregunta | Permanece; controles de volver y pausa recuperables |
| QA-27 | Volver/recargar en anillo, pregunta, excavación y foto | Estado íntegro, sin revelar sorpresas de nuevo ni bloquear navegación |
| QA-28 | Pausa/resume y visibilidad | Tiempos coherentes, AudioContext no sigue en background, UI recuperable |
| QA-29 | Activar sonido tras toque | Efectos de bosque, agua, puerta, álbum, excavación y caja; silencio real al desactivar |
| QA-30 | Rendimiento 15–20 min | Reportar FPS percentiles, frame times, memoria/caches, ralentizaciones, sin errores acumulativos |
| QA-31 | Dispositivo iOS real si está disponible | Safari táctil/safe-area/teclado/gestos sin bugs; marcar NO PROBADO si no disponible |
| QA-32 | Dispositivo Android real si está disponible | Chrome/Samsung Internet según disponibilidad; marcar NO PROBADO si no disponible |

## Gating por hitos internos

- **Hito 1 — P0:** final sin bloqueo, caja y broches bien ordenados, compositor estable, transiciones sin residuos. No avanzar artísticamente si no funciona.
- **Hito 2 — Narrativa y escenas:** hoja, saltos, museo protegido, álbum, excavación, burbujas.
- **Hito 3 — Sonido y micro-misiones:** solo después de estabilizar recorrido base.
- **Hito 4 — Prueba integrada:** recorrido completo desde inicio hasta pregunta; evidencias en texto/logs, no videos/capturas salvo autorización del usuario.

## Prueba anti-falsos positivos

Es insuficiente comprobar `worldPosition.neverThroughBox=true`, `progress=1`, `bubble.visible=true`, `question.sameShot=true`, o que existan ocho ciclos de excavación. Esos son indicadores internos, **no pruebas de lo que se dibujó**. Exigir además verificación de bounds/píxeles/oclusiones, análisis de imágenes *interno* del motor cuando se pueda hacer sin producir paquetes de capturas, y aceptación visual del usuario. Los saltos y colocaciones exigen continuidad fotograma a fotograma.
