# Preparación privada / NO PUBLICADO

El HTML offline y la vista LAN son copias personales. Noindex, una URL difícil y HTTPS por sí solos no protegen fotografías. No se ha publicado el sitio, contratado hosting ni generado un QR.

El ZIP modular contiene sitio (dist), server y esta guía. No subas src, referencias, legacy, documentos personales ni el ZIP editable como raíz pública. Las tres fotos sí forman parte necesaria de sitio y requieren protección igual que index, JS, fuentes y todos los activos.

## Servidor HTTPS privado preparado

scripts/private-server.mjs sirve únicamente dist. No inicia sin usuario, contraseña de al menos12 caracteres y certificado/clave TLS válidos. Autentica TODAS las rutas antes de leer archivos, usa comparación de digest constante, no-store, no-referrer y nosniff. No hay contraseña por defecto ni credenciales dentro del ZIP.

En PowerShell, con certificado confiable para el dominio que controles:

```powershell
$env:VALERIE_PRIVATE_USER = 'valerie'
$valerieSecret = Read-Host 'Contraseña privada' -AsSecureString
$env:VALERIE_PRIVATE_PASSWORD = [System.Net.NetworkCredential]::new('', $valerieSecret).Password
$env:VALERIE_TLS_CERT = 'C:\ruta\certificado.pem'
$env:VALERIE_TLS_KEY = 'C:\ruta\clave-privada.pem'
npm run private
```

En el paquete modular usa `node server/private-server.mjs` con las mismas variables; sirve la carpeta sitio. Conserva server fuera de la raíz pública. En el editable, npm run private sirve dist.

Por defecto escucha solo 127.0.0.1:8443. Es preparación para un despliegue posterior autorizado, no publicación. No ignores advertencias de certificado ni subas claves privadas al proyecto. El proveedor o administrador debe instalar un certificado válido y proteger todas las rutas también si usa proxy/CDN. Prueba sin credenciales cada imagen antes de compartir.

La autenticación se ensayó en un servidor de prueba local y se verificó401 tanto para HTML como para fotos/fuentes/JS. No se certifica un dominio real ni su TLS porque todavía no hay despliegue autorizado. Falta prueba externa, Safari/iPhone y Android físicos. El QR solo se prepara después de validar URL HTTPS, acceso y carga reales, con autorización del autor. Ningún archivo del proyecto crea o imprime QR.
