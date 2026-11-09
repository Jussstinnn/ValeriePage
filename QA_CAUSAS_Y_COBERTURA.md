# F24.2 · Integración focalizada

| Causa confirmada | Corrección |
|---|---|
| Índices de mundo/transición y sesión no sobreviven insertar lugares | engine/set e IDs de enlaces; migración por chapterId desde el orden original |
| Actuación de entrada cruzaba el fin de la frase y no podía completar | Saltos contenidos en su intervalo; contratos de extremos asentados y continuidad de puntuación |
| Cambiar ruta conservaba acciones terminadas del puente | Invalidación acotada de raíces/exterior/vestíbulo; sincronización al restaurar historial |
| Ruta neutral conservaba una elección anterior | Limpiar explícitamente elección y fase antes de continuar neutral |
| Intervalos de más de8s perdían el final al recargar | Guardar/recuperar tiempo de intervención hasta120s con límites validados |
| Patas podían deslizarse entre saltos de la puerta | Progresión espacial y profundidad solo durante las dos trayectorias, con descanso plantado en coordenadas del mundo |
| Tocar rosa coincidía con hit-area de luz | Un tap resuelve el objeto; solo el desplazamiento real se trata como arrastre |

P0 de HUD y texto de F24.1.1 se conserva. Métricas/pruebas efectivamente ejecutadas y límites físicos están en QA_RESUMIDO.md. No interpretar contratos como aprobación artística.
