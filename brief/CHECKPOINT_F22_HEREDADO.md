# Continuidad · F22 candidata

Proyecto activo: work/VALERIE_CUENTO_CINEMATOGRAFICO. Servidor 4188. F17: SHA256 b697089ac5a6ec4b5a4321a5de970ee06e15714f2381b380b0af7ada565fee7f, intacta. Hitos F18–F21 completos en outputs. No reiniciar ni regenerar ilustraciones.

F18–F22 implementadas e integradas. Fuente de verdad: release.json y src, no el HTML generado. Ocho decisiones, 19 capítulos,59 pasos de muestra frente a 85 de F17. Manual por defecto; CinemaClock nunca avanza decisiones, resultados, recuerdos ni clímax. Una sola presentación visual del diálogo salvo preferencia explícita de ambos.

Módulos nuevos: editorial-cut / cinema-clock (ritmo); dramatic-scenes (apertura/refugio); consequence-theatre (ocho ecos/paño); memory-shortfilms (tres episodios); final-ceremony (regalo y regreso). guardian-stage tiene composeNarrativeProps después de actuación y antes de IK: evita que una página se haga diminuta o gire al juntar los peluches. No volver a derivar su tamaño de la distancia entre patitas.

asset-codec y scripts/embed-codec codifican binarios sin alterar píxeles. El ensamblado del script usa reemplazo por callback: los pares de dólar del alfabeto no pueden pasar por sustituciones de texto de String.replace. Contratos verifican todos los bytes del HTML ya ensamblado. ResourceCache guarda solo comprimidos versionados; el render libera texturas invisibles. No sustituir alpha PNG por WebP sin comparar en navegador: se rechazó esa conversión.

Los cuatro archivos de anatomía/animación/rig y personal-content.js siguen exactos a F17. Root motion siempre antes de IK; patas en espacio del actor durante vuelo. No alterar fotos ni carta. Los textos personales vacíos siguen siendo vacíos.

Verificación vigente: npm test (24 contratos) y scripts/verify.mjs (navegador). Se comprobaron16 alternativas/ecos, tres rutas completas, fotos íntegras, almacenamiento/historial, seis proporciones incluida 568×280, carga fallida y offline sin HTTP. No repetir pruebas históricas salvo regresión concreta.

Pendientes reales: aceptación artística del autor; Safari/iPhone y Android físicos, audio/temperatura/memoria reales; ubicación física exacta del anillo. Hosting/QR solo tras despliegue privado autorizado. Nada se publicó.
