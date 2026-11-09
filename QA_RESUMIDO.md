# Verificación F24.2

**Contratos:** npm test32/32, test:vertical30/30, test:forest15/15, test:polish3/3 y test:journey3/3.73 casos únicos al descontar contratos compartidos. Build valida originales, fotografías, atlas, referencias y nueve motores.

**Navegador:** recorridos y grupos de npm run test:browser ejecutados de forma aislada en WebKit26 y Chromium/Edge de Windows. Ambos recorrieron72 intervenciones del prólogo al museo, diez sets y siete acciones deliberadas. Se verificaron tres rutas (árbol/luciérnaga/neutral), sus ecos, cambio de ruta, recargas en raíz y puerta, contacto de Beige con picaporte, seis tamaños320/360/375/390/412/430, objetivos44px,240 taps vacíos y30 cancelaciones por motor, ocho decisiones y rechazo de doble selección. Pausa/reanudación, cancelación de carga tardía, sesión por ID, pagehide/pageshow y vuelta accidental a vertical pasan.

**Lectura y protección:** ambos motores verificaron textos150%, presentación estable por turno y áreas seguras simuladas. Tres fotos originales, carta y páginas, caja, anillo y pregunta permanecen protegidos tras recarga/espera. El frame del cuadro conserva exactamente su geometría al transferir museo→interior. El driver usa toque con hit-test y espera finalización real de máscara/ceremonia, no un plazo fijo para avanzar.

**Offline:** los diez sets cargan en ambos motores desde file:// sin HTTP; recorrido protegido de fotos/carta/caja/anillo/final pasó en Edge. Transporte binario de cada recurso incorporado e integridad de186 archivos originales comprobados. Modelos, rig, física, jardín y texto personal conservan sus hashes.

**Sonido:** activación y suspensión en Edge verificadas. WebKit de Windows no habilitó audio; la película siguió correctamente en silencio. No se presenta como audio Safari certificado.

## Medición reproducible

Edge headless,390×844,DPR2,servidor local,CPU de escritorio,2s por escena. Composiciones se cuentan en el tick que realmente dibuja, después del límite de cadencia; no confundirlo con la frecuencia nativa de RAF del monitor. El callback mide trabajo JS/Canvas despachado, no tiempo GPU. Memoria estimada de imágenes/buffers/Blobs, no RAM total del navegador.

| Escena | Composiciones/s | Callback p50/p95 | Memoria estimada |
|---|---:|---:|---:|
| antes-del-primer-pasito | 59.2 | 0.5/0.7 ms | 37.52 MB |
| una-patita-mas | 59.6 | 0.7/1.0 ms | 37.60 MB |
| el-tiempo-de-los-dos | 59.8 | 0.8/1.2 ms | 46.42 MB |
| el-bosque-escucha | 59.9 | 0.8/1.2 ms | 56.71 MB |
| donde-apuntan-las-raices | 59.9 | 0.8/1.1 ms | 44.89 MB |
| el-museo-de-la-noche | 57.2 | 1.0/1.3 ms | 50.46 MB |

Primera escena útil: 237 ms en esta muestra. Transferencia del recorrido de seis escenas: 25.39 MB. 7 tareas largas, máxima 89 ms, incluidas preparación/decodificación; requieren validación bajo hardware móvil real. Cuatro ciclos adicionales (16 navegaciones) mantuvieron41 recursos comprimidos y memoria estimada entre38,51 y44,80 MB, sin tendencia creciente; varía con la precarga. No es un ensayo prolongado de batería ni presión de memoria.

HTML autónomo:42,666,285 bytes frente a33.148.040 en F24.1.1; incorpora7.594.938 bytes de nuevas láminas WebP. Los PNG originales nuevos se conservan en el ZIP (35.666.208 bytes), pero no se descargan en el reproductor modular. El HTML completo no es la vía recomendada de arranque móvil; usar servidor modular. Las escenas/muestras difieren de la revisión anterior, así que estos datos no prueban mayor FPS entre versiones. Valores completos en PERF_F24_2.json.

**Pendiente real:** aprobación artística, iPhone/Safari, Android/Chrome y Samsung Internet físicos; VoiceOver/TalkBack, barras dinámicas y rendimiento sostenido/batería. Emulación y eventos sintéticos no equivalen a esos dispositivos. Sin publicación, QR, capturas, grabaciones ni videos. Impeccable detectó avisos sobre sombras/tokens heredados; se conserva la identidad aprobada.

**Distribución:**493 entradas con CRC correcto, reconstrucción independiente sin node_modules y69 salidas idénticas byte a byte. Seis pruebas de protección/migración pasan en la extracción limpia. Original F24.1.1 conservado.
