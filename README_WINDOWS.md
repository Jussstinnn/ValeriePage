# Windows · F24.6.4

1. Extraer el ZIP entero en una carpeta nueva; conservar las versiones anteriores.
2. Offline: abrir VALERIE_F24_6_4_CEREMONIA_Y_PAISAJE_SONORO.html.
3. Teléfono: con Node22 o posterior, ejecutar INICIAR_VALERIE_WINDOWS.cmd y usar la dirección IP de la consola, puerto4202, misma Wi-Fi. En la red actual: http://192.168.1.15:4202/ . La IP puede cambiar.
4. Recargar y comprobar título F24.6.4. Para repetir la ceremonia desde una sesión ya terminada en esta edición, abrir controles → Capítulos → Volver al anillo. No es necesario borrar el progreso del cuento. La sesión del antiguo puerto4197 sigue intacta y es independiente del nuevo puerto4202.
5. Activar Sonido. Música tenue es una opción aparte en ajustes. El volumen multimedia del teléfono y el volumen del cuento siguen siendo independientes.

Ctrl+C detiene un servidor iniciado en consola. Si4202 está ocupado, elegir otro desde PowerShell con $env:PORT='4201' y ejecutar node scripts/serve.mjs --lan.

Reconstruir: npm run build. Empaquetar: npm run package (Windows). Build y ejecución usan sólo recursos locales y Node; no necesitan regenerar los audios. scripts/prepare-audio.cjs es una herramienta de producción opcional y necesita Playwright; conserva las grabaciones originales.
