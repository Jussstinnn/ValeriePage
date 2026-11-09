# Personalizar sin cambiar el motor

Las frases auténticas de las tres fotos se escriben en src/personal-notes.js (claves0,1,2). Vacío conserva una leyenda poética neutral. No se inventaron fechas, lugares ni emociones personales.

La carta y firma originales permanecen en src/personal-content.js; las tres fotos originales se identifican en PERSONAL_ASSETS.json. Modificar una fotografía requiere actualizar conscientemente el manifiesto: el build rechaza una sustitución accidental.

Los diálogos ficticios vigentes están en src/story-graph.js, companion-performance.js, reactive-quests.js y memory-adventures.js (sobre los guiones previos), por capítulo y ID estable. Mantén IDs aunque mejores texto; el historial y la sesión los usan. `view:'photo'` reserva la foto entera y limpia. `view:'read'` activa el lector protegido.

Después ejecuta npm run build. El offline y dist se regeneran desde los mismos contenidos. No edites el HTML generado a mano. No se necesita un panel de administración ni un servicio remoto.


F18–F22: editorial-cut.js reúne los turnos. dramatic-scenes.js y consequence-theatre.js ajustan personalidad/ecos; memory-shortfilms.js y final-ceremony.js dirigen los objetos y el clímax. Mantén IDs de capítulos, decisiones y nodos estables; nunca cambies carta/fotos al editar la ficción.
