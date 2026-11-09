# VALERIE F24.1.1 — Cobertura de comentarios y criterios de aceptación

**Base revisada:** `VALERIE_F24_1_VERTICAL_DIRECTORS_CUT_COMPLETO.zip` (109 MB, fuente JS/Canvas + `dist` + HTML offline). **Alcance:** prompt para Codex, no modificaciones de código en esta entrega documental. **Objetivo:** iOS/Safari móvil vertical. **Sin SEO.**

## Qué se comprobó en el código

- `src/director.js` abre/cierra `hud?.toggle()` en `pointerdown` cuando el toque cae fuera de `view.frame`. Es una causa concreta y corregible de que tocar canvas abra el menú.
- `src/bubble-director.js` recalcula ubicaciones en el render y puede pasar a `subtitle-fallback`; `director.js` cambia visibilidad de la narración en `draw()`. Es una causa plausible del texto intermitente, no una reproducción certificada en Safari físico.
- `src/film.css` define `#story` con altura fija de 120 px. Es una limitación visible para textos variables y tamaños accesibles.
- `src/vertical-script.js` incluye el diálogo de la flor; `src/vineyard-scene.js` contiene su implementación visual, que requiere mayor visibilidad y dirección de cámara.
- `src/environment.js` calcula `p.globalAlpha=.83*q+.25` al dibujar helechos; con biome 0 conserva .25 de opacidad. Debe comprobarse en la cadena real del museo antes de corregir por mundo.
- `src/personal-content.js` contiene literalmente el fragmento «los viñedos, los conejitos, la noche y los lirios». Su reemplazo debe ser *solo textual*; jardín de lirios intacto.
- `src/session.js` usa `sessionStorage`; no debe confundirse con guardado persistente después de cerrar Safari.
- El proyecto tiene pruebas con scripts `test`, `test:vertical`, `test:forest`, `test:browser` y `build`. Sus resultados anteriores NO certifican Safari físico.
- El HTML autónomo es un documento autocontenido grande, distinto del ZIP fuente. El peso del ZIP no equivale al tráfico de la web modular.

## Trazabilidad literal: cada comentario del autor debe generar trabajo

| Comentario del autor | Prioridad | Implementación que se exige | Cómo verificar |
|---|---|---|---|
| «En iOS, cada clic abre el menú» | P0 | Corregir `pointerdown`/HUD; sólo botón explícito | 30 taps vacíos, 10 rápidos, cancelaciones, eventos duplicados |
| «El texto abajo aparece y desaparece» | P0 | Política estable de burbuja/subtítulo por turno | Sin alternancia durante una misma línea y sin anuncios duplicados |
| «El texto sale de la parte turquesa» | P0 | Altura real y geometría compartida DOM/Canvas | Frases largas, zoom de texto, safe-area y tamaños verticales |
| «Debe empezar con introducción» | P1 | Prólogo cinematográfico, no pantalla estática | Historia explicada sin spoilers, continuidad al cap. 1 |
| «Presentar los personajes» | P1 | Guion físico con personalidad y nombres | Rosa y Beige se presentan con gestos distintos |
| «La escena de agua y hoja es demasiado básica» | P1 | Rediseño de agua/orillas/hoja y actuación | Cruce legible; dos ramas físicamente distintas |
| «La transición de hoja es feíta» | P1 | Plano puente con hoja/cámara/oclusiones | Sin salto de posición/escala, pausa/retroceso correctos |
| «Hay assets del environment bugueados» | P1 | Auditoría por escena de alphas, capas, atlas, z-order | Inventario corto de defectos con causa y corrección real |
| «Dice que vio una flor y no se ve» | P1 | Flor perceptible y foco/reacción de personajes | Visible antes de mencionar la flor en 390×844 |
| «Me gusta presionar para ejecutar acciones» | CRÍTICO conservar | Estados de interacción con CTA/gesto específico | Toque deliberado → actuación, no continuar genérico |
| «Me gusta decidir; se ve muy bonito» | CRÍTICO conservar | Ocho decisiones, composición premium, resultados reales | Dos elecciones claras, una ejecución, sin CTA duplicado |
| «Museo tiene plantas, mejor lámparas» | P1 | Museo propio con apliques, marcos, luz; sin helechos extraños | Escenas del museo sin invasión de vegetación |
| «Caja sin fondo» | P1 | Set de ceremonia y luz/espacio con profundidad | Caja con contacto/escenografía sin spoilers |
| «Le gustan las rosas, carta no lirios» | P1 | Cambio exacto en `personal-content.js` | La carta dice rosas; animación lirios sin tocar |
| «Se pone pesado/lento» | P1 | Medir y optimizar decodificación, Canvas, caching, DOM | Métricas antes/después; sin afirmar Safari físico probado |
| «Muchas animaciones e interactividad, que no sea tieso» | Visión artística | Actuaciones, microgestos, cámara, entorno y continuidad | Revisar 1–7 y resto ya existente, no sólo efectos genéricos |
| «Siguiente sólo cuando se necesite» | P0/P1 | Contrato PLAYING/CHOICE/INTERACTION/PROTECTED | Nunca Siguiente en cine automático o en dos opciones |
| «Opciones siguen ambiguas» | P1 | Etiquetas que describen acción y respuesta | Ocho `choiceId` sin romper sus valores/sesiones |
| «Mobile vertical es lo único que importa ahora» | P0 alcance | QA iPhone portrait y safe-area; no horizontal/SEO | 320×568, 360×800, 375×812, 390×844, 430×932 |
| «No cambiar lo que ya gustó» | Bloqueo de regresión | Arte/anatomía, bosque, cuadros, fotos, carta, final | Regression suite y comprobación de hashes/contratos |

## Qué NO debe hacerse

No reconstruir F24 o F23; no introducir mundos de playa/honguitos/cabaña en F24.1.1; no inventar recuerdos de pareja; no alterar fotos personales ni la escena de lirios; no cambiar la propuesta final; no reemplazar los personajes por dibujos genéricos; no eliminar controles táctiles útiles; no forzar un click «Siguiente» después de una elección por comodidad técnica; no esconder defectos con fundidos negros; no llamar «Safari verificado» a una prueba sólo de Chromium; no SEO, no publicar, no enviar capturas o videos como entregables.

## Entrega exigida a Codex

`VALERIE_F24_1_1_IOS_VERTICAL_POLISH_COMPLETO.zip` con código actualizado, ejecutables/sitio generados según la base, `CHECKPOINT.md`, comandos de Windows, pruebas REALMENTE ejecutadas, pendientes verificados y cifras de rendimiento solo si se midieron. El usuario hará la aprobación artística en su iPhone.
