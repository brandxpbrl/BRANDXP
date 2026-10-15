# BZ Lanchas — Home

Aplicación Next.js independiente de `brandxpbrl/BRANDXP`, branch `chore/extract-bz-lanchas`, servida en `/`. Trabajo exclusivamente dentro de `bz-lanchas/`, sin modificar `viptour-buzios`, hacer merge ni configurar dominios.

## Ejecutar y verificar

Node.js 24.x. Desde esta carpeta:

```sh
npm ci
npm run build
npm run typecheck
npm run lint
npm run start
```

Desarrollo: `npm run dev`. No se requieren variables de entorno, backend ni base de datos. Esta implementación no agrega dependencias npm. FFmpeg solo se requiere para regenerar los entregables, no para ejecutar o desplegar la web.

## Home y contenido confirmado

Hero fullscreen (`100svh`), una embarcación, reserva y footer. Navegación a `#lancha` y `#reserva`; menú móvil con cierre al navegar, pulsar fuera o utilizar Escape.

Solo se publica **FÊNIX 27.5**, nombre **Gratidão**, lancha cabinada para hasta 10 personas. Características confirmadas: 27,5 pés, até 10 pessoas, banheiro, churrasqueira, Bluetooth, cabine, pia y ducha com água doce. Reserva directa por WhatsApp, sin formulario.

El footer contiene la marca, Armação dos Búzios · RJ y WhatsApp +55 (22) 99736-2297. Todos los CTA usan `https://wa.me/5522997362297`, definido en `app/content.ts`. No se muestran pagos sin confirmar, políticas sin página, idiomas decorativos ni enlaces vacíos.

## Fotografías y video: originales del cliente

La política obligatoria está en [MEDIA_POLICY.md](MEDIA_POLICY.md). El inventario, procedencia, segmentos, resoluciones, codecs, pesos y procedimiento reproducible están en [media/README.md](media/README.md) y [media/provenance.json](media/provenance.json).

- Desktop/tablet (desde 768 px): `public/videos/bz-hero-desktop.mp4`, extraído de `1000716633.mp4`, segundos 24–36.
- Mobile (hasta 767 px): `public/videos/bz-hero-mobile.mp4`, extraído de `1000717086.mp4`, segundos 0–12.
- Poster horizontal y fotografía de la ficha: `public/images/fenix-275-gratidao.webp`, frame del segundo 26 de `1000716633.mp4`.
- Poster mobile: `public/images/bz-hero-mobile.webp`, frame del segundo 7,5 de `1000717086.mp4`.

Los originales se conservan en `media/originals/`, sin acceso público ni carga desde la home; `1000718566.mp4` y `1000716629.mp4` quedan disponibles para futuras secciones.

`app/client-media.ts` registra los assets con su procedencia. Copiar otro MP4 a la carpeta no lo activa por sí solo. La imagen artificial anterior permanece eliminada. No se utilizan fotografías de stock, otras embarcaciones como sustitución ni contenido visual generado.

El hero elige el video según el viewport antes de crear `<video>`, evitando solicitar ambos MP4 en una visita inicial. Usa autoplay muted, loop, playsInline, preload metadata y object-fit cover. El poster responsive está en el HTML inicial y permanece si falla el video, se bloquea autoplay o se prefiere movimiento reducido. Sin JavaScript se conserva el poster. No hay barra de controles visible; existe un botón de pausa/reproducción que aparece únicamente al recibir foco de teclado. No se añade audio ni se modifica físicamente la embarcación.

## Logo oficial

`public/bz-lanchas-logo-oficial.png` conserva los bytes aprobados en `240abfc`:

```text
SHA-256: aa2f23941934f3d1ed42ac18767b4d0810105d0699659cdde079af60a6d6e508
Git blob: e47bbd5fc6dd9eb92d310a5fb05379a05ed47814
```

Se sirve sin recomprensión, completo y proporcional en header y footer, con `object-fit: contain`. No se edita su número impreso ni se utiliza para generar enlaces de contacto.

## SEO

Documento `pt-BR`, un H1 en el hero y H2 para embarcación y reserva. Título: “BZ Lanchas | Passeio Privativo de Lancha em Búzios”. Descripción de FÊNIX 27.5, Gratidão, paseo privativo y Armação dos Búzios / RJ. Sin canonical ni dominio definitivo.

## Vercel

Proyecto `bz-lanchas` en ORBIS (`brandxpbrls-projects`), ID `prj_hlk1SQ0NCPf7AhKHnRrNOKEIA3G5`, repositorio `brandxpbrl/BRANDXP`, Root Directory `bz-lanchas`, Next.js, Node 24.x, instalación `npm ci`, build `npm run build`. No incluye archivos externos al Root Directory.

Los cambios se revisan en el Preview de `chore/extract-bz-lanchas`. No se cambia la branch de producción, no se promueve un deployment y no se añaden ni modifican dominios. Los previews pueden requerir sesión de Vercel con acceso a ORBIS. Los deployments históricos no cambian al publicar un Preview.

El icono local de WhatsApp pertenece a Bootstrap Icons; licencia MIT en `THIRD_PARTY_NOTICES.txt`.
