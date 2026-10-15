# BZ Lanchas — Home

Aplicación Next.js independiente de `brandxpbrl/BRANDXP`, branch `chore/extract-bz-lanchas`. Sirve la home directamente en `/`. Todas las modificaciones de esta fase están dentro de `bz-lanchas/`; `viptour-buzios` se conserva intacto y no se realiza merge ni configuración de dominios.

## Ejecutar y verificar

Node.js 24.x. Desde esta carpeta:

```sh
npm ci
npm run build
npm run typecheck
npm run lint
npm run start
```

Desarrollo: `npm run dev`. No se requieren variables de entorno, backend ni base de datos. No se agregan dependencias npm en esta fase.

## Home

La experiencia se organiza en cuatro bloques: hero fullscreen, embarcación, reserva y footer. El hero usa `100svh`, mantiene espacio para el contenido en pantallas de poca altura y ofrece navegación a `#lancha` y `#reserva`. El menú móvil abre, cierra, responde a Escape y se cierra al navegar o pulsar fuera.

Solo se publica **FÊNIX 27.5**, nombre **Gratidão**, lancha cabinada para hasta 10 personas. La ficha muestra únicamente: 27,5 pés, até 10 pessoas, banheiro, churrasqueira, Bluetooth, cabine, pia y ducha com água doce. La reserva es directa por WhatsApp, sin formulario.

El footer contiene únicamente la marca, Armação dos Búzios · RJ y WhatsApp +55 (22) 99736-2297. No hay pagos, políticas sin página, idiomas decorativos ni enlaces vacíos. Todos los CTA de WhatsApp usan la constante `https://wa.me/5522997362297` de `app/content.ts`.

## Video definitivo

Colocar el MP4 exactamente en:

```text
bz-lanchas/public/videos/bz-hero.mp4
```

Su URL será `/videos/bz-hero.mp4`. **Mientras no exista ese archivo, el hero usa la fotografía existente de la embarcación.** No se incluye ni se inventa ningún video.

La presencia del archivo se comprueba durante el build: después de añadirlo, ejecutar `npm run build` y volver a desplegar. No hace falta cambiar código. El archivo debe ser un MP4 reproducible en los navegadores de destino (por ejemplo, H.264); conviene exportarlo sin pista de audio y con tamaño contenido.

Cuando el MP4 existe, se utiliza `autoPlay`, `muted`, `loop`, `playsInline`, `preload="metadata"`, poster y `object-fit: cover`. La foto aparece desde el render inicial y permanece visible mientras el video carga o si falla. Se ofrece control de pausa/reproducción y se conserva la fotografía para usuarios con preferencia de movimiento reducido. No hay reproductores ni videos externos.

Las fotografías usan la optimización de imágenes de Next.js (calidad 85). El logo oficial se sirve sin optimización ni recomprensión. No se bloquea el render esperando al video.

## Logo oficial

`public/bz-lanchas-logo-oficial.png` conserva exactamente los bytes de la versión aprobada en `240abfc`:

```text
SHA-256: aa2f23941934f3d1ed42ac18767b4d0810105d0699659cdde079af60a6d6e508
Git blob: e47bbd5fc6dd9eb92d310a5fb05379a05ed47814
```

Se muestra completo en header y footer, con proporción 3:2 y `object-fit: contain`, sin recortar, deformar ni editar su número impreso. Ese número no se utiliza para generar enlaces de contacto.

## SEO

Documento `pt-BR`, un H1 en el hero y H2 para embarcación y reserva. La metadata menciona BZ Lanchas, FÊNIX 27.5, paseo privativo y Armação dos Búzios / RJ. No se emite canonical ni se fija un dominio definitivo.

## Archivos de la home

- `app/page.tsx`: composición, ficha real y comprobación del MP4 local.
- `app/components/HeroMedia.tsx`: fallback, video progresivo y pausa.
- `app/components/SiteHeader.tsx`: navegación y menú móvil.
- `app/content.ts`: rutas de los assets y WhatsApp confirmado.
- `app/bzlanchas.css`: hero, ficha, reserva, footer y responsive.
- `app/layout.tsx`: metadata específica, sin canonical.
- `next.config.ts`: raíces independientes y calidades de imágenes permitidas.
- `eslint.config.mjs`: revisión Next.js/TypeScript sin excepciones para imágenes.
- `public/icons/whatsapp.svg`: icono local de Bootstrap Icons.
- `public/videos/.gitkeep`: carpeta preparada para recibir el MP4.
- `THIRD_PARTY_NOTICES.txt`: licencia del icono.

El logo oficial y la fotografía existente no se modifican. No se copian assets ni contenido de la web de referencia conceptual.

## Icono de WhatsApp

Se utiliza el SVG de [Bootstrap Icons](https://github.com/twbs/icons/blob/main/icons/whatsapp.svg), servido localmente. Su licencia MIT se conserva en `THIRD_PARTY_NOTICES.txt`. No se agrega una biblioteca npm de iconos de marcas.

## Verificación de esta fase — 15 de octubre de 2026

- Instalación reproducible con `npm ci`, build de producción, TypeScript y lint ejecutados correctamente. El build genera `/` como página estática.
- QA de navegador a 320, 375, 390, 430, 768, 1024 y 1440 px: hero con altura de viewport, una columna en móvil/tablet y dos en escritorio, sin overflow horizontal. Se verifican imágenes, logos, menú (incluido Escape), cierre al navegar y scroll a `#lancha`.
- Se comprueban H1/H2, FÊNIX 27.5, Gratidão, las ocho características confirmadas, footer simplificado y seis accesos con el WhatsApp correcto. No se emite canonical.
- Sin MP4: foto visible y ninguna solicitud a un video inexistente. En una respuesta de prueba se simula disponibilidad del recurso y se aborta su petición: se verifican los atributos de video y el regreso a la foto, sin crear un MP4. También se verifica el fallback por movimiento reducido.
- Logo y fotografía coinciden por hash Git con `240abfc`. Ninguna dependencia npm nueva. El proyecto original no tiene modificaciones.

## Vercel

Proyecto `bz-lanchas` en ORBIS (`brandxpbrls-projects`), ID `prj_hlk1SQ0NCPf7AhKHnRrNOKEIA3G5`, repositorio `brandxpbrl/BRANDXP`, Root Directory `bz-lanchas`, Next.js, Node 24.x, instalación `npm ci`, build `npm run build`. No incluye archivos externos al Root Directory.

Esta fase se revisa con un Preview de `chore/extract-bz-lanchas`. No se cambia la branch de producción, no se promueve un deployment y no se añaden ni modifican dominios. Los previews pueden requerir una sesión de Vercel con acceso a ORBIS.
