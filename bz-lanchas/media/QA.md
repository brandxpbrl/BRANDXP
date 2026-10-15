# Verificación y archivos de la entrega — 2026-10-15

## Resultado

- `npm ci`: correcto; 347 paquetes instalados. Persisten cinco avisos altos de las dependencias de desarrollo existentes. `package.json` y lockfile no cambian; no se agregan dependencias.
- `npm run build`: correcto, `/` prerenderizada como página estática.
- `npm run typecheck`: correcto.
- `npm run lint`: correcto, cero warnings.
- Chrome con reproducción H.264 real a 320, 375, 390, 430, 768, 1024 y 1440 px: autoplay muted, avance de tiempo, duración de 12 segundos, loop, playsInline, preload metadata y object-fit cover comprobados.
- Una visita inicial solo solicita el video de su viewport. Cambio entre mobile/desktop verificado; no aparecen dos reproductores. Posters responsive correctos.
- Poster auténtico visible sin JavaScript, ante fallo de video y con movimiento reducido. Sin JavaScript y con movimiento reducido no se solicita ningún MP4. El caso de fallo solo solicita la variante correspondiente.
- Sin barra de controles visible. Botón de pausa/reproducción disponible al enfocar con teclado y probado con Enter.
- Sin overflow a los siete anchos ni a 320×568, 375×667, 844×390 y 1024×600. Hero con altura de viewport, logo completo, ficha en una columna hasta 900 px y dos columnas en desktop.
- Menú móvil, Escape, cierre al navegar, scroll a `#lancha`, seis enlaces a `https://wa.me/5522997362297`, única ficha FÊNIX 27.5 “Gratidão” y ocho características confirmadas verificados.
- Título, descripción y ausencia de canonical comprobados. Sin información comercial adicional ni futuras embarcaciones.
- Sin errores de consola, HTTP ni solicitudes fallidas inesperadas durante la navegación normal. Los MP4 contienen solo una pista H.264 sin audio, con índice `moov` antes de `mdat` (faststart).
- Los cuatro originales coinciden por SHA-256 con los archivos entregados en Downloads. Entregables coinciden con `provenance.json`. No se generan imágenes, videos ni contenido visual mediante IA.
- URL de la imagen artificial eliminada y URLs públicas de los originales secundarios: 404.
- Logo oficial idéntico por hash Git a `240abfc`. Ningún cambio en `viptour-buzios` frente a `9e264b2`.
- Revisión de React: hooks estables, selección responsive antes de crear el video, estado de reproducción aislado al cambiar de fuente, suscripciones con limpieza, sin dependencias pesadas ni CSS-in-JS añadidos.

## Archivos modificados

- `app/components/HeroMedia.tsx`
- `app/client-media.ts`
- `app/page.tsx`
- `app/layout.tsx`
- `app/bzlanchas.css`
- `README.md`
- `MEDIA_POLICY.md`

## Archivos añadidos

- `public/videos/bz-hero-desktop.mp4`
- `public/videos/bz-hero-mobile.mp4`
- `public/images/fenix-275-gratidao.webp`
- `public/images/bz-hero-mobile.webp`
- `media/originals/1000716633.mp4`
- `media/originals/1000717086.mp4`
- `media/originals/1000718566.mp4`
- `media/originals/1000716629.mp4`
- `media/provenance.json`
- `media/README.md`
- `media/QA.md`
- `scripts/prepare-client-media.mjs`

Todo queda dentro de `bz-lanchas/`. Commit y push solo a `chore/extract-bz-lanchas`, sin merge, cambios en main, dominios ni promoción a producción. El Preview de Vercel se verifica después del push; los deployments históricos permanecen sin cambios.
