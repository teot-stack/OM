# Rutina de Práctica Consciente · PWA

PWA personal para Android/Chromium. No requiere servidor ni cuenta: el estado diario y los temporizadores se guardan localmente en el dispositivo.

## V2 · ajustes de legibilidad

- Texto de las instrucciones aumentado un 25% respecto de V1.
- Tarjetas superiores reorganizadas en dos áreas independientes (texto + ilustración) para impedir superposiciones.
- Cronómetros normalizados con el patrón Bhramari: anillo de progreso, hora centrada y etiqueta `Tiempo de práctica` dentro del círculo.
- Botones `Iniciar/Pausar` y `Reiniciar` a la derecha del reloj.
- Adaptación específica para pantallas Android de poca altura sin scroll en las fichas de práctica.
- Caché PWA incrementada a V2 para forzar la actualización de CSS/JS al publicar la nueva versión.

## Publicación en GitHub Pages

1. Sustituir en el repositorio los archivos `index.html`, `styles.css`, `app.js`, `sw.js`, `manifest.webmanifest` y la carpeta `assets` por los de este paquete.
2. Hacer commit/push a `main`.
3. Si GitHub Pages ya estaba activo, no hace falta reconfigurarlo.
4. En Android, cerrar y volver a abrir la PWA. Si tarda en actualizar, abrir una vez la URL de GitHub Pages en Chrome y luego volver a abrir la aplicación instalada.


## V3
- Ilustraciones superiores recortadas para eliminar texto incrustado.
- `object-fit: contain` en todas las tarjetas superiores: ninguna figura debe recortarse.
- Columnas de texto e ilustración separadas sin gradientes superpuestos.
- Cronómetros reajustados para proteger números y etiqueta dentro del anillo.
