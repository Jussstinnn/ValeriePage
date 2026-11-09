# Valerie F24.6.4

Ceremonia reconstruida y paisaje sonoro grabado. Ver CAMBIOS.md, CHECKPOINT.md y CREDITOS_SONIDO.md.

Abrir VALERIE_F24_6_4_CEREMONIA_Y_PAISAJE_SONORO.html para uso autónomo. Todos sus recursos necesarios están incorporados.

Para teléfono: ejecutar INICIAR_VALERIE_WINDOWS.cmd con Node22 o posterior y abrir la dirección de la misma Wi-Fi que muestra la consola. Puerto4202. Recargar la pestaña anterior; el título debe decir F24.6.4. Para repetir desde el final: controles → Capítulos → Volver al anillo.

Fuentes en src/, recursos en assets/. npm run build reconstruye dist y el HTML. npm test y npm run test:vertical cubren contratos. Las pruebas específicas de navegador están en tests/ceremony-2464.cjs y tests/audio-2464.cjs; necesitan Playwright y admiten VALERIE_URL.

El sonido empieza apagado. Al activarlo se escuchan ambiente y foley; la música tenue se activa separadamente en ajustes. No hay servicios externos, publicación, seguimiento ni envío de fotos.
