# Actualizacion F24.3

F24.3: el viewport escenico cubre toda la pantalla, separado de superficies editoriales. Actos nuevos usan lectura superior estable. Galeria panoramica compartida, reproducciones con aspecto/pixeles preservados; hada ilustrada consistente. Identidad de peluches protegida.

---

---
name: Valerie — Entre hojas y promesas
description: Peluches reales reinterpretados con ilustración articulada y escenario 2.5D.
colors:
  ink: "#fff0df"
  muted: "#d9d9c9"
  ground: "#142c30"
  warm: "#e4bfa7"
  hover-ink: "#fff9ef"
  dialog: "#213b39"
  error: "#263f3c"
  progress-track: "#52685d"
  progress-value: "#e8c6ae"
  set-ground: "#18302d"
  reading-plane: "#10282d"
  thread-core: "#fff7d8"
typography:
  display:
    fontFamily: "FilmSerif, Georgia, serif"
    fontSize: "24px"
    fontWeight: 500
    letterSpacing: "-.025em"
  narration:
    fontFamily: "FilmSerif, Georgia, serif"
    fontSize: "clamp(22px, 6vw, 27px)"
    fontWeight: 500
    lineHeight: 1.22
  body:
    fontFamily: "FilmSans, system-ui, sans-serif"
    fontSize: "14px"
  label:
    fontFamily: "FilmSans, system-ui, sans-serif"
    fontSize: "13px"
  dialog-title:
    fontFamily: "FilmSerif, Georgia, serif"
    fontSize: "37px"
    fontWeight: 500
    lineHeight: 1.05
rounded:
  flat: "0"
spacing:
  control-gap: "10px"
  group-gap: "12px"
  dialog-padding: "24px"
  mobile-gutter: "22px"
components:
  button-quiet:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "8px 0"
  button-quiet-hover:
    textColor: "{colors.hover-ink}"
  button-icon:
    textColor: "{colors.ink}"
    padding: "12px"
    width: "48px"
    height: "48px"
  narration:
    textColor: "{colors.ink}"
    typography: "{typography.narration}"
  dialog:
    backgroundColor: "{colors.dialog}"
    textColor: "{colors.ink}"
    padding: "{spacing.dialog-padding}"
    width: "min(92vw, 560px)"
  progress:
    backgroundColor: "{colors.progress-track}"
    height: "3px"
    rounded: "{rounded.flat}"
---

## Superficie vigente · F24.1 vertical

Prioridad exclusiva portrait 320–390 px. Dos opciones de acción, de igual peso, con contorno cálido y dibujos lineales; sin CTA de avance en cine/elección/gesto. Opciones de 62–66 px y acceso de esquina 44–48 px. Paleta, fuentes y arte aprobados conservados. Las sombras pertenecen a la integración nocturna ilustrada; no se cambia el mundo por avisos del inventario histórico.

Guion y cámara se rigen por actionPlan; raíces, objetos, escala y apoyos se proyectan juntos antes de IK. El HUD no modifica Composition. La documentación y el sidecar históricos de Impeccable siguen siendo referencia de la base, no prueba de aceptación de esta dirección.


## Contrato de superficie F24

Modo Experience: las ilustraciones aprobadas lideran. HUD contextual sin barra permanente; acceso de esquina de al menos44px, foco visible y menú hidden/inert al cerrarlo. Decisiones fuera del menú, incluso con controles abiertos. Composition mide safe areas y reservas editoriales estables, nunca la altura del HUD. Sólo la posición de opciones puede ajustarse para no solaparlo. Narración y fotografías siguen legibles en vertical y horizontal.

Se conserva la paleta nocturna/cálida y la tipografía de la película; bordes vegetales, botones curvos y sombras de integración son decisiones del mundo ilustrado. Las advertencias mecánicas de paleta/tamaños respecto del inventario histórico no justifican cambiar esta dirección aprobada. Los apartados históricos siguientes describen la base; donde discrepen, prevalece este contrato F24.


# Design System: Valerie — Entre hojas y promesas

## Overview

**Creative North Star: "Los peluches de Valerie, dentro del cuento"**

La fuente de identidad son las fotografías reales. La dirección ilustrada de ARTE01 va en el camino correcto según el autor. Anatomía03 la conserva y refina únicamente uniones, proporciones y apoyo, sin generar nuevas ilustraciones. La aceptación artística y el parecido siguen pendientes de su evaluación personal.

El sistema activo combina caras pintadas, brazos cortos compuestos con upper y patitas laterales originales, hombros interiores ocultos suavemente por el torso y pies recogidos bajo el vientre. Las sombras de cada suela se atenúan gradualmente al levantarla. El rosa usa saltitos con ambas patas y microgestos, sin marcha ni braceo humano. Cada oreja rosa utiliza su propio recorte orientado en memoria. Se conserva el paisaje de viñedo por capas. La caja es la del regalo grande rosa con ribete oscuro, presentada cerrada en primer término. Su vista abierta es un recurso preparado, no una apertura ni ceremonia implementada. El alcance continúa en F2–F3; no iniciar F4.

**Key Characteristics:**

- Dos atlas nuevos y dieciocho piezas articuladas, con caras completas que mantienen los ojos y hocicos de la ilustración de referencia.
- Pintura de viñedo, vides, musgo y hoja separados para componer profundidad; cinco planes de cámara distintos.
- Regalo rectangular rosa en primer término; caja cerrada y sorpresa final reservada.
- Botones permanentes, narración sin caducidad, silencio inicial y gestos opcionales.

## Colors

La interfaz conserva tinta marfil, secundarios cálidos, fondo verde oscuro y foco rosa cálido. Los valores normativos están en el frontmatter. La pintura del paisaje y los textiles usan el color de sus PNG originales, no las ternas de gradientes de F1.

El rosa mantiene pelo pálido y hocico marfil; el beige conserva pelo topo y cara sin hocico blanco. La caja tiene cartón rosa y ribete oscuro. El fondo de respaldo usa set-ground; reading-plane permite leer sobre la pintura; thread-core identifica el centro de la luz.

**The Reference Identity Rule.** Los pigmentos de los protagonistas proceden de sus ilustraciones de referencia; cambiar una paleta no sustituye su anatomía.

## Typography

Cormorant Garamond local (FilmSerif) lleva encabezado y narración; DM Sans local (FilmSans) lleva controles. Se conservan los roles del frontmatter. Narración base de 22–27 px y 37ch; escritorio 31 px/1.24, horizontal bajo 21 px/1.22. Los archivos de fuente se precargan y la preparación espera document.fonts.ready.

**The Held Voice Rule.** La narración permanece hasta cambiar de plano; no caduca por temporizador ni depende del sonido.

## Layout

Superficie fija 100dvh, sin scroll narrativo. Encabezado, relato y pie respetan safe areas. Los controles permanecen fuera del arte útil. Vertical: márgenes de 22 px, 16 px hasta 350 px. Escritorio desde 900 px y 551 px de alto: relato a la izquierda y arte desde el 33% del ancho. Horizontal bajo: relato en 29% izquierdo y arte desde el 35%, ajustado a los bordes seguros reales. El listado del diálogo puede desplazarse sin cambiar el plano.

Los cinco planes asignan escala y profundidad antes del primer fotograma. El retrato escalona los protagonistas; la hoja usa un plano próximo; el cruce abre el contexto; el encuentro acerca el fondo; el regalo ocupa el primer término. Lentes 1.12/1.40/0.94/1.63/1.16. Las envolventes incluyen orejas y se comprueban con el contorno alfa realmente dibujado. No aplicar escalas CSS adicionales.

**The Chosen Pace Rule.** Anterior, Siguiente y el recorrido eligen el plano; scroll, rueda y gestos sobre el arte no navegan.

## Elevation & Depth

La profundidad procede de fondo pintado, vides laterales, banco de musgo, hoja, actores, regalo y helechos cercanos. Escala, centro y parallax cambian por plano. El rosa permanece delante del beige también durante el salto. Sombras de contacto bajo los pies y reflejos suaves conectan los personajes al suelo. La interfaz no usa tarjetas ni sombras de caja decorativas.

Los PNG nuevos se decodifican una vez. El atlas derivado trabaja a escala 2 y conserva dieciocho piezas. La limpieza selecciona el componente alfa principal y dos píxeles de franja, eliminando fragmentos de celdas vecinas sin alterar el PNG. El paisaje y follaje ya están ilustrados: no se hornean los árboles geométricos de F1.

Objetivos del código: 30 fps, o 24 en modo ligero; DPR máximo 1.8/1.25. Imágenes decodificadas alrededor de 30 MiB, atlas alrededor de 5.9 MiB más buffers faciales y Canvas. El coste alto sostenido puede activar calidad ligera. Esto no certifica rendimiento en dispositivos físicos.

## Shapes

La interfaz conserva esquinas rectas y SVG lineales. Los protagonistas utilizan siluetas pintadas nuevas; no se construyen con los Bézier, ojos y sonrisas de F1. El beige tiene orejas largas de 221 unidades nativas que caen por fuera y bajo la cara; el rosa tiene dos orejas erguidas de alturas 139/110 y hocico voluminoso.

Las caras mantienen nariz, ojos de cuenta y textura. Parpadeo y asombro deforman pequeñas regiones de la propia pintura ocular con malla cacheada. Las zonas exteriores de la cara mantienen su contenido, y la máscara evita huecos entre triángulos. No se dibujan ojos humanos nuevos. La iluminación del rostro deformado coincide con la variante quieta.

## Components

Los seis componentes de interfaz existentes se conservan: acción discreta, control con icono, navegación permanente, narración, progreso y selección del recorrido. Botones de 48 px, o 44 px en ancho mínimo y horizontal bajo; foco cálido de 2 px con separación de 4 px. Los estados deshabilitados indican los extremos del recorrido o un corte en curso. Pausar durante el corte lo completa y mantiene la navegación accesible.

Narración con aria-live polite y sin caducidad; reacción con role=status. El Canvas es decorativo para asistencia y la acción HTML ofrece alternativa al toque. El diálogo pausa sonido/actuación, conserva el estado previo y devuelve foco. Historial y capítulo se sincronizan también durante una transición.

Los clips, resortes, solver de dos segmentos, apoyos y captura/restauración de F2 se conservan, adaptados a las piezas nuevas. La hoja comparte su anclaje con la mano del beige. Las manos de ambos usan un punto común durante el apoyo. La caja se descubre con una abertura entre hojas a tamaño ya preparado; no abre la tapa ni revela anillo o carta.

El audio inicia apagado y requiere activación; pausa, diálogo y pestaña oculta suspenden voces. Movimiento reducido usa un fotograma completo y quieto. Fuentes, cinco imágenes, piezas y primera composición terminan antes de retirar preparación; un error ofrece reintento.

La documentación se cerró directamente tras el límite de uso del agente documental. El detector ya ejecutado solo señaló advertencias heredadas de tamaños y dos colores CSS frente al registro anterior; no se rediseñó la interfaz por ellas. No se generaron capturas ni se otorgó aprobación artística.

## Do's and Don'ts

### Do:

- **Do** Conservar la identidad de las fotos y la asimetría de ambos peluches.
- **Do** Mantener mensajes sin caducidad y controles de 44–48 px, incluidos horizontal y safe areas.
- **Do** Preparar imágenes, piezas y primer fotograma antes de revelar el escenario.
- **Do** Preservar los PNG originales y las fotografías; limpiar máscaras únicamente en buffers derivados.

### Don't:

- **Don't** No tratar F1/F2/F3 anteriores ni esta revisión como artísticamente aprobadas.
- **Don't** No sustituir ojos, hocicos u orejas por rasgos genéricos.
- **Don't** No avanzar por scroll ni iniciar F4.
- **Don't** No confundir pruebas numéricas con aprobación visual ni producir capturas o grabaciones de QA.

## Continuidad autorizada F4

El usuario aprueba expresamente la referencia Anatomía03 y autoriza avanzar. Sus caras, orejas, rig y lenguaje de peluche quedan congelados. F4 añade tres mates originales en el mismo mundo pictórico; las nuevas escenas tienen dirección propia. Galería/cuadro→cielo conserva la pintura procedural heredada y el jardín conserva el vector botánico V6. No se afirma que la película entera esté migrada. No hay aprobación visual unilateral de los mundos nuevos.

## Intimidad F5

Fotografías originales completas, sin recorte de caras ni recreaciones; tres revelados editoriales distintos. La carta ocupa el papel del escenario, con tipografía DOM accesible y máscaras cortas, sin desaparecer. Peluches pequeños bajo el texto, navegación permanente, papel cálido y tinta verde oscura. El lector decide el ritmo.

## Sorpresa F6

Caja rosa grande con ribete oscuro y tres filas de banderines, no joyero genérico. Planos articulados de las texturas existentes, ambos peluches aprobados y joya ilustrada desde la foto con luz material. Pregunta final en Canvas con motivos que se vuelven tipografía de alta resolución. Sin presión de respuesta.

## Sonido F7

Nueve campos originales y silenciosos por defecto, seis voces máximas. La mezcla se retira durante lectura, el motivo agudo del rosa y el grave del beige se distinguen; los momentos materiales tienen acentos propios. Símbolos recordados sin puntuación ni obligación.

## Reposo F8

Lectura sin movimiento constante: Canvas descansa tras asentamiento y responde al gesto. Música y lectura siguen independientes. Sobre el papel, hover/foco usan tinta verde oscura. La cámara conserva cobertura y los personajes aprobados no cambian. No se confunde regresión técnica con certificación móvil.


## F24.1.1 · Política de lectura móvil

Se conserva el mundo ilustrado aprobado. El panel turquesa es una superficie DOM cuya reserva máxima por capítulo comparte el compositor. La burbuja mantiene posición por turno; fallback de seguridad enclavado. La transcripción accesible no se mueve con la presentación visual. Las esquinas orgánicas y la sombra cromática existentes son deliberadas para este cuento, no una redefinición de la identidad. La confirmación de reinicio y la reanudación son las únicas superficies nuevas de gestión; no hay onboarding convencional.


## F24.2 · Producción espacial

Diez pinturas verticales nuevas en assets/journey, materiales del claro aprobado como referencia. Geometrías independientes: arquitectura de arco/pergola/alcoba, río con apoyos anotados, terraza floral, túnel y raíz, exterior de cristal y galería. El escenario y sus objetos motivan la acción. La cámara proyecta cuerpo/suelo/utilería conjuntamente antes de IK. No modificar personajes para adaptarlos al set. Broche y puerta son acciones del mundo, sin pantalla convencional de bienvenida.
