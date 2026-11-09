# Ejecutar Valerie RC07 en Windows

## Abrir sin instalar
1. Haz clic derecho en el ZIP y selecciona «Extraer todo».
2. Abre VALERIE_OFFLINE.html con Edge o Chrome, fuera de la vista previa del ZIP.
3. Pulsa «Entrar». Desliza o utiliza Anterior, Siguiente y El recorrido. Pausa y sonido siempre están disponibles.

La narración se ve durante la película; «Releer» abre otra lectura. El modo guiado recorre los primeros mundos y se detiene antes de abandonar mensajes importantes. En la carta, desliza su texto y avanza entre tres folios. Abre la cajita cuando quieras; después entra en su brillo y continúa. Puedes saltar la carta o la ceremonia explícitamente. Con la caja cerrada, la omisión está dentro de El recorrido.

Sonido y respuesta táctil empiezan apagados. El tacto solo aparece donde existe soporte; iPhone puede no ofrecer vibración web. El índice permite ajustar calidad. «Portada» conserva la sesión; «Empezar de nuevo» la limpia. La pregunta permanece y no incluye botones de respuesta.

## Editar o servir
Con Node.js 22 o posterior, abre PowerShell en la carpeta extraída:

    npm run build
    npm start

Abre http://127.0.0.1:4173. Ctrl+C detiene el servidor. No necesitas npm install para estas operaciones. Si el puerto está ocupado, antes de npm start escribe:

    $env:PORT = '4179'

Edita src/personal-story.js para añadir frases reales; los campos vacíos conservan los textos actuales. src/story.js contiene la estructura. Recompila después. No edites dist/ ni el HTML construido a mano. Los nueve originales permanecen íntegros; las modificaciones de motor están en scripts/acting-rc07.mjs y sus adaptadores anteriores. Fuentes y licencias incluidas.

## Pruebas y ZIP
El build incluido permite ejecutar los contratos sin instalar nada:

    npm test

Para las seis suites de navegador, necesitas Edge instalado y el servidor abierto en otra ventana:

    npm ci
    $env:VALERIE_URL = 'http://127.0.0.1:4173'
    npm run test:rc07

No generan capturas ni videos. npm run package crea VALERIE_CINEMATIC_REBIRTH_RC07_COMPLETO.zip con código, producción, originales y documentación; excluye node_modules y cachés.

## Teléfono
La producción está en dist/ y puede alojarse en HTTPS; esta entrega no se ha publicado. Para Safari/iPhone utiliza una dirección web servida: abrir HTML desde Archivos depende de la aplicación. El HTML offline se comprobó mediante file:// en Edge. Progreso y símbolos usan sessionStorage, con alternativa en memoria si el navegador lo bloquea. No se guardan respuestas ni se envían fotografías.
