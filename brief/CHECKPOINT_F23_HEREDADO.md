# Continuidad · F23

Proyecto activo: work/VALERIE_BOSQUE_VIVO_F23. Base exacta F22: VALERIE_CUENTO_F22_COMPLETO.zip, SHA256 e80b8d3c36fe2d3a793070c53c30ca646947beaad4c131679043984f8209731e,93 624 483 bytes. No modificar F22 ni regenerar los recursos existentes.

Hito implementado: bosque independiente con rutas firefly/tree y neutral. discover→shape→cross→rest. ForestAction controla la sesión; ForestScene solo representa sus objetivos. No avanzar F24: el autor evaluará F23 primero.

Fuentes: src/forest-action.js, src/forest-scene.js, src/director.js, src/session.js. Arte nuevo: assets/forest-living/ con manifiesto, SHA y procedencia. release.json define puerto 4189, ZIP y HTML. Build verifica los originales y ensambla los PNG offline sin cambiar píxeles. No editar dist ni el HTML generado.

Sesión: valerie.forest.living.session. Migración de lectura desde la clave F22, sin modificarla; reinicio escribe una sesión nueva vacía. actions.chapters['el-bosque-escucha'] es la fuente canónica. El historial lleva sceneAction separado de los anclajes de diálogo. Punteros no se restauran. No autorresolver gestos con tiempo de animación.

Anatomía: objetivos y desplazamientos siempre antes de RigAnimator.resolve. Vuelo usa patas actor-local, aterrizaje vuelve a apoyo world. No cambiar los cuatro archivos protegidos de anatomía ni personal-content.js. El tallo se conecta a la mano realmente renderizada; el nudo de escucha usa un objetivo local alcanzable fuera del rostro.

Verificado: build;15 contratos F23; gestos, controles, recarga/historial/neutral/reduced online y offline; carta/anillo/pregunta offline. Las capturas internas de desarrollo están fuera del proyecto y no forman parte del ZIP. Los 24 contratos conservados pasaron durante la integración; no repetir auditorías históricas sin una regresión concreta.

Entrega: VALERIE_BOSQUE_VIVO_F23_COMPLETO.zip y VALERIE_BOSQUE_VIVO_F23.html. `npm run build` / `npm run phone` / `npm run package`. Node 22+. README_WINDOWS.md contiene los comandos completos.

Pendientes reales: aceptación artística del autor; iPhone/Android físicos (rendimiento, audio y safeareas reales); fases F24–F30 no iniciadas. No se desplegó ni se generó QR. Mantener botones y privacidad.
