# VALERIE — Diagnóstico independiente sobre F24.1.1

Base examinada: `VALERIE_F24_1_1_IOS_VERTICAL_POLISH_COMPLETO.zip` (451 entradas, aprox. 114 MB comprimidos). Lectura de `src/`, `brief/`, `CAMBIOS.md`, `CHECKPOINT.md` y pruebas ejecutadas **sobre la extracción actual**. Este informe NO certifica calidad artística en teléfono físico ni modifica el proyecto.

## Veredicto

El usuario tiene razón en el problema central: el desarrollo ha optimizado el *mecanismo* de una experiencia que aún carece de puesta en escena diferenciada y de causalidad suficiente en su primer recorrido. Un motor que funciona y un guion con más líneas no equivalen a un cuento cinematográfico.

## Hallazgos respaldados por el código

**A. El primer acto comparte el mismo fondo principal.** `src/cinematic-world.js`, `background()`, carga explícitamente `VF.Art.image('clearing')`, dibuja el mismo matte y añade capas de follaje, una orilla y props. `src/director.js` define `isVineyard=()=>index<=5` y dirige esos seis capítulos al mismo `VineyardScene`; `src/vineyard-scene.js` cambia poses, trayectoria, props y cámara por número de capítulo. Son intervenciones reales, pero no una variedad de escenarios con arquitectura distinta. El prólogo está insertado en `dos-miradas` por `src/vertical-script.js`, no es una secuencia escenográfica autónoma.

**B. El salto del bosque al museo no tiene un recorrido causal.** El capítulo `el-bosque-escucha` es el índice 6; `el-museo-de-la-noche` es 7. En `src/transition-director.js`, `kind()` solo reconoce un umbral de hoja entre 5↔6. Para 6→7 cae en `leaf-occlusion` (caso genérico). En `src/director.js`, `go()` cambia el índice, prepara el mundo y transfiere el plano; no existen una senda física, una puerta ni un edificio intermedio que el espectador atraviese. `src/reactive-quests.js` puede cambiar la primera línea del museo por una alusión a la luciérnaga/árbol, pero eso no representa visualmente el desplazamiento.

**C. El contenido narrativo sigue comprimido en unidades pequeñas.** `src/vertical-script.js` presenta seis intervenciones y una invitación de inicio en el prólogo, cinco intervenciones en `dos-miradas`, seis en `te-abro-el-camino`, seis en `una-patita-mas`, seis más silencio en `el-tiempo-de-los-dos`; los planos comparten contexto físico muy parecido. Un diálogo adicional no sustituye un conflicto, progresión espacial o descubrimiento visible.

**D. La interactividad existe y merece conservarse.** `src/forest-action.js` implementa las fases `discover → shape → cross → rest`, con rutas `firefly`, `tree`, `neutral`, gestos y asistencia; `src/vertical-script.js` añade acciones explícitas de levantar la hoja y guiar la luz; `src/story-graph.js` y `src/reactive-quests.js` contienen elecciones. No eliminarlas ni volver a una secuencia pasiva.

**E. El formato de navegación es frágil frente a añadir escenas.** `src/director.js` supone índices para mundo (`index<=5`, `next>6`, `next<=5`); `src/transition-director.js` asocia tipos de transición a números (`from===5&&to===6`, `from===7&&to===8`...); `src/session.js` restaura por `index` y almacena fotogramas por ID. Insertar capítulos sin migración por ID rompería rutas, cámara, guardado o protecciones. Antes de insertar escenas, refactorizar lo estrictamente necesario hacia identificadores estables y enlaces de grafo.

**F. Hay buena base técnica, pero sus pruebas no miden lo que el usuario pide.** En esta extracción se ejecutaron `npm test` **32/32**, `npm run test:vertical` **29/29** y `npm run test:forest` **15/15**, sin fallos. Esto NO prueba calidad del guion, diferencia entre escenarios, contacto visual correcto ni continuidad entre mundos. `CHECKPOINT.md` documenta que los navegadores físicos no fueron certificados.

**G. El proyecto merece protección especial.** Mantener el arte/anatomía original de los dos peluches, los mecanismos aprobados del bosque, las ocho decisiones y los recuerdos, fotos, carta, caja, anillo y pregunta final. La carta actualmente dice **rosas** en la enumeración; no revertirla a lirios. El jardín de lirios sigue sin cambios.

## Decisión de producto

Crear **F24.2 — Reconstrucción narrativa y escenográfica: Acto I + conexión bosque→museo**, sobre copia independiente. NO una auditoría genérica ni cinco arreglos CSS. Debe existir un antes/después material: lugares realmente nuevos, causa narrativa clara, coreografías específicas y un viaje físicamente comprensible.

No recomendar sustituir todos los 19 capítulos a la vez. Un avance sustancial y demostrable es reconstruir íntegramente el Acto I y unir el bosque con el museo; preservando funcionalmente las etapas posteriores. Si Codex no logra completar una parte, deberá reportarlo como pendiente, no declarar el hito terminado.
