# Procedencia y preparación del material real

El usuario entregó los cuatro MP4 y declaró expresamente en las instrucciones de esta tarea que son originales del cliente y la fuente visual oficial de **FÊNIX 27.5 “Gratidão”**. Se conservan sin modificaciones en `originals/`, fuera de `public/` y sin enlaces desde la web. Los videos secundarios no se cargan en la home.

## Entregables web

| Recurso | Original | Intervalo / frame | Resolución | Formato | Bytes finales |
| --- | --- | --- | --- | --- | ---: |
| `public/videos/bz-hero-desktop.mp4` | `1000716633.mp4` | 00:24.000–00:36.000 (12 s) | 1024 × 576 | H.264 High 3.1, yuv420p, 30 fps | 1.571.398 |
| `public/videos/bz-hero-mobile.mp4` | `1000717086.mp4` | 00:00.000–00:12.000 (12 s) | 480 × 848 | H.264 High 3.1, yuv420p, 30 fps | 1.602.576 |
| `public/images/fenix-275-gratidao.webp` | `1000716633.mp4` | frame 00:26.000 | 1024 × 576 | WebP, calidad 90 | 26.978 |
| `public/images/bz-hero-mobile.webp` | `1000717086.mp4` | frame 00:07.500 | 480 × 848 | WebP, calidad 88 | 34.442 |

El frame horizontal se comparte entre la ficha y el poster desktop/tablet para evitar duplicados. Los posters son frames del material original, sin composición, retoque ni elementos generados.

Los MP4 son segmentos continuos del archivo entregado. Se conserva su montaje original, sin agregar efectos, transiciones, interpolación óptica, música ni cambios de color. El loop reinicia el segmento; no se fabrica una transición para ocultar el corte. No se amplía la resolución original. Se elimina cualquier pista de audio y se aplica `faststart` (índice al principio) para reproducción web.

Desktop/tablet usa el MP4 horizontal a partir de 768 px; mobile usa el vertical hasta 767 px. La selección ocurre antes de crear el elemento de video, de modo que una visita inicial solo solicita el MP4 que corresponde. El cambio de tamaño puede cargar la otra variante cuando sea necesaria.

## Originales conservados

| Archivo | Bytes originales | Uso |
| --- | ---: | --- |
| `originals/1000716633.mp4` | 5.379.127 | Hero desktop/tablet, poster y ficha |
| `originals/1000717086.mp4` | 4.354.031 | Hero y poster mobile |
| `originals/1000718566.mp4` | 4.538.655 | Reservado para futuras secciones; no publicado |
| `originals/1000716629.mp4` | 8.919.175 | Reservado para futuras secciones; no publicado |

## Reproducir la preparación

Requiere Node.js y FFmpeg con `libx264` y `libwebp`, además de ffprobe. Desde `bz-lanchas/`:

```sh
node scripts/prepare-client-media.mjs
```

Si no están en PATH, definir `FFMPEG_PATH` y `FFPROBE_PATH` con las rutas a los ejecutables. No se agregan paquetes npm.

El script contiene los argumentos exactos de cada transformación y genera `media/provenance.json`: versión de FFmpeg, intervalos, resoluciones, codecs, tamaños, comandos y SHA-256 de originales y resultados. No forma parte del build normal: Vercel utiliza los entregables ya preparados y no necesita FFmpeg.
