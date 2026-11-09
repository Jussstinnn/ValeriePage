# F23 · Asset de tronco vivo

Nuevo: assets/forest-living/tree-gate-atlas-v1.png (1536×1024 RGBA). Generado con image_gen integrado, usando forest-path y foliage-atlas únicamente como referencias de estilo. Originales intactos; manifiesto, prompt y procedencia junto al asset.

Piezas izquierda [0,0,768,1024] y derecha [768,0,768,1024]. Con altura H, ancho de cada pieza=0,75H. Para cerrar, alinear borde interior izquierdo x≈0,80 y derecho x≈0,20 de sus respectivos recortes. Al abrir, desplazar hacia fuera; admitir rotación mínima y profundidad. Apoyar raíces en suelo común, y≈0,98. No recortar ramas/raíces irregulares. Centro de la hoja y esquinas: alpha0; máximo de corteza254 conservado sin retoque.

El tronco debe ser un objeto protagonista del escenario, no una puerta pequeña flotante. El movimiento descubre una cámara/mapa y altera la oclusión del bosque. El PNG solo no constituye la interacción. No hay personajes, fotografías, texto o símbolos generados.

## Claro de las luciérnagas

`assets/forest-living/firefly-clearing-v1.png`: 1024×1536 RGB opaco, geografía nueva en el mismo bosque cálido. Arroyo de izquierda a derecha; usar los anclajes normalizados reales del manifiesto: orilla próxima (.50,.79), orilla lejana (.50,.61); agua entre y=.626–.771. El generador colocó el arroyo algo más alto de lo solicitado, por lo que el motor debe transformar estos anclajes junto con el recorte cover. Banco inferior amplio para apoyo y sombras. No incluye puente ni personajes: el cruce y sus consecuencias siguen siendo responsabilidad de la animación. Prompt exacto en `clearing-prompt.txt`; procedencia y SHA en JSON. PNG copiado sin cambios ni extracción de fotografías.
