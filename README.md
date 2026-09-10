# Rutina de Práctica Consciente · PWA

PWA estática, sin servidor backend y sin cuentas. Guarda el estado diario y los temporizadores en el almacenamiento local del dispositivo.

## Ejecutar en una computadora

Desde esta carpeta:

```bash
python -m http.server 8080
```

Abrir `http://localhost:8080` en Chrome/Chromium.

## Instalar en Android

La PWA debe publicarse por HTTPS (GitHub Pages, Netlify, Cloudflare Pages, etc.). Luego abrir la URL en Chrome y elegir **Instalar aplicación** / **Agregar a pantalla de inicio**.

## Archivos principales

- `index.html`: shell de la app.
- `styles.css`: estética y tipografía.
- `app.js`: prácticas, instrucciones, temporizadores, tildes e historial.
- `manifest.webmanifest`: instalación PWA.
- `sw.js`: funcionamiento offline.
- `assets/practices/`: ilustraciones.

## Editar una práctica

En `app.js`, buscar el objeto dentro de `practices`. Los textos son HTML real, no forman parte de las imágenes. La tipografía preferida es **Roboto Condensed**; si no está disponible o no puede cargarse, se utiliza una alternativa condensada/sistema.
