# Política de medios — BZ Lanchas

Las fotografías y los videos del sitio deben ser auténticos y entregados por el cliente. La embarcación real es **FÊNIX 27.5 “Gratidão”**. Los originales del cliente son la única referencia para su apariencia física.

- Prohibidas imágenes o videos generados con IA, sintéticos, de stock o de relleno, incluidos hero, poster, ficha y metadata.
- Se permiten optimización, recorte, cambio de tamaño, compresión y corrección de color de originales auténticos. No alterar la embarcación ni generar contenido visual ausente.
- Si falta un recurso auténtico, omitir el elemento visual. No sustituirlo por otra lancha ni mostrar un espacio de relleno.
- El hero solo puede utilizar video local suministrado por el cliente. El poster, si se utiliza, también debe proceder del cliente o ser un fotograma del video auténtico.

## Estado actual

El usuario suministró `1000716633.mp4`, `1000717086.mp4`, `1000718566.mp4` y `1000716629.mp4` como originales del cliente y fuente visual oficial en las instrucciones adjuntas de esta tarea del 15 de octubre de 2026. El hero utiliza exclusivamente segmentos de los dos primeros y la ficha utiliza un frame del video horizontal. La imagen artificial anterior permanece eliminada del hero, de la ficha y de `public/`.

Originales, SHA-256, intervalos y transformaciones se conservan en `media/`: consultar `media/README.md`, `media/provenance.json` y `scripts/prepare-client-media.mjs`. Los otros dos videos se reservan fuera de `public/` para futuras secciones.

Se conserva intacto el logo oficial suministrado y aprobado por el usuario en `240abfc`. Es identidad gráfica, no una fotografía documental de la embarcación. Los iconos de interfaz tampoco representan fotografías del barco.

## Incorporar originales del cliente

1. Obtener los originales e identificar su entrega por el cliente. Verificar que muestran FÊNIX 27.5 “Gratidão”; no asumir autenticidad por el nombre del archivo.
2. Registrar la procedencia y conservar la trazabilidad del original y cualquier optimización. No incluir datos personales o enlaces privados de acceso en el repositorio.
3. Guardar fotografías y posters auténticos en `public/images/`, y videos web en `public/videos/`. Conservar originales y su procedencia en `media/`, fuera del contenido público.
4. Registrar únicamente los recursos verificados en `app/client-media.ts`, con su URL local `src` y una descripción no vacía de la entrega original en `clientSource`. Cualquier recurso nuevo permanece sin registrar hasta verificar su procedencia. Copiar un MP4 a la carpeta no lo activa automáticamente.
5. Ejecutar instalación, build, TypeScript, lint y QA de desktop/mobile. Volver a desplegar el Preview para revisión.

Los archivos ausentes o no registrados se omiten. Si falla el video o el usuario prefiere movimiento reducido, solo se permite un poster auténtico registrado; sin poster, se conserva el fondo de marca sin imagen de sustitución.
