# Rig ilustrado — Anatomía 03

Dieciocho piezas originales conservadas. La textura de cada brazo se prepara una vez con `upper` y su patita izquierda/derecha. Dos buffers de luz y sus variantes con raíz atenuada evitan deformar una manga por decenas de triángulos en cada fotograma. La parte proximal queda dentro del torso y la distal se mezcla delante. El solver y los objetivos mundiales siguen activos; no se dibuja una articulación humana de codo.

Torso más ancho, raíces de hombro interiores y pies parcialmente cubiertos por el vientre. No se utiliza el antebrazo como muslo. El rosado se apoya/despega con ambas patas; el beige conserva su rostro y orejas caídas.

Ambas orejas rosas tienen recortes diferentes. Se limpian y orientan por su eje en buffers, sin tocar los PNG. Se conserva la asimetría y el pliegue de la derecha. El parpadeo sigue deformando exclusivamente la pintura ocular.

`Kinematics.posture` se comparte con el renderer y el cálculo de contacto. Verificar continuidad, raíces y objetivos al cambiar anatomía. Las pruebas son técnicas; la naturalidad y el parecido quedan a juicio del usuario.
