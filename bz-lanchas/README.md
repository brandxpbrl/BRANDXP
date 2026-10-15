# BZ Lanchas — Home

Aplicación Next.js independiente de `brandxpbrl/BRANDXP`, branch `chore/extract-bz-lanchas`. La home se sirve en `/`. El trabajo queda dentro de `bz-lanchas/`, sin modificar `viptour-buzios`, hacer merge ni configurar dominios.

## Ejecutar y verificar

Node.js 24.x. Desde esta carpeta:

```sh
npm ci
npm run build
npm run typecheck
npm run lint
npm run start
```

Desarrollo: `npm run dev`. No se requieren variables de entorno, backend ni base de datos. Esta corrección no agrega dependencias npm.

## Home y contenido confirmado

Hero fullscreen (`100svh`), una embarcación, reserva y footer. Navegación a `#lancha` y `#reserva`; menú móvil con cierre al navegar, pulsar fuera o utilizar Escape.

Solo se publica **FÊNIX 27.5**, nombre **Gratidão**, lancha cabinada para hasta 10 personas. Características confirmadas: 27,5 pés, até 10 pessoas, banheiro, churrasqueira, Bluetooth, cabine, pia y ducha com água doce. Reserva directa por WhatsApp, sin formulario.

El footer contiene la marca, Armação dos Búzios · RJ y WhatsApp +55 (22) 99736-2297. Todos los CTA de WhatsApp usan `https://wa.me/5522997362297`, definido en `app/content.ts`. No se muestran pagos sin confirmar, políticas sin página, idiomas decorativos ni enlaces vacíos.

## Fotografías y video: solo originales del cliente

La política obligatoria y el procedimiento de incorporación están en [MEDIA_POLICY.md](MEDIA_POLICY.md).

**Actualmente no hay foto ni video de la embarcación con procedencia del cliente verificada.** La imagen artificial anterior se eliminó de `public/` y de la home. El hero tiene un fondo de marca sin imagen ni video, y la ficha muestra solo la información confirmada. No hay fotografías de sustitución ni espacios vacíos de relleno.

El componente sigue preparado para recibir video auténtico local en:

```text
bz-lanchas/public/videos/bz-hero.mp4
```

Añadir ese archivo no lo activa por sí solo. Después de verificar su entrega por el cliente, registrar el recurso y su procedencia en `app/client-media.ts`, reconstruir y desplegar. Fotografías y posters auténticos pueden guardarse en `public/media/` y registrarse allí también. No copiar material de stock, otras embarcaciones o la web de referencia.

El video registrado utiliza `autoPlay`, `muted`, `loop`, `playsInline`, `preload="metadata"` y `object-fit: cover`, con control de pausa/reproducción. No bloquea el render. Un poster solo se muestra si también está registrado como original auténtico. Ante errores o movimiento reducido se omite el video; sin poster verificado se conserva el fondo de marca. Los recursos ausentes o no registrados no crean peticiones de medios.

## Logo oficial

`public/bz-lanchas-logo-oficial.png` conserva los bytes aprobados en `240abfc`:

```text
SHA-256: aa2f23941934f3d1ed42ac18767b4d0810105d0699659cdde079af60a6d6e508
Git blob: e47bbd5fc6dd9eb92d310a5fb05379a05ed47814
```

Se sirve sin recomprensión, completo en header y footer, con proporción 3:2 y `object-fit: contain`. No se recorta, deforma ni edita su número impreso. Ese número no genera enlaces de contacto.

## SEO

Documento `pt-BR`, un H1 en el hero y H2 para embarcación y reserva. Metadata de BZ Lanchas, FÊNIX 27.5, paseo privativo y Armação dos Búzios / RJ. Sin canonical, dominio definitivo ni imágenes de embarcación no verificadas en metadata.

## Archivos principales

- `app/page.tsx`: composición y ficha de la única embarcación.
- `app/client-media.ts`: registro explícito de originales verificados; actualmente vacío.
- `app/components/HeroMedia.tsx`: reproducción de medios aprobados, pausa y omisión segura.
- `app/components/SiteHeader.tsx`: navegación y menú móvil.
- `app/content.ts`: logo oficial y WhatsApp confirmado.
- `app/bzlanchas.css`: diseño y responsive, incluida ficha sin fotografía.
- `app/layout.tsx`: metadata específica, sin canonical.
- `public/bz-lanchas-logo-oficial.png`: logo aprobado sin alteraciones.
- `public/icons/whatsapp.svg`: icono local de Bootstrap Icons, licencia MIT en `THIRD_PARTY_NOTICES.txt`.
- `public/videos/.gitkeep`: carpeta preparada para el video auténtico.
- `MEDIA_POLICY.md`: restricciones y procedencia de medios.

## Verificación de la corrección de medios — 15 de octubre de 2026

- `npm ci`, build de producción, TypeScript y lint completados. `/` se genera como página estática.
- Navegador verificado a 320, 375, 390, 430, 768, 1024 y 1440 px, más pantallas de poca altura: sin overflow, logo completo y ficha sin columna de fotografía vacía.
- Una embarcación, ocho características confirmadas, seis enlaces al WhatsApp correcto; menú, Escape, navegación y scroll a `#lancha` verificados. Metadata específica y ausencia de canonical comprobadas.
- No se renderizan fotos, posters ni videos de embarcación, ni se solicitan MP4 inexistentes. La URL de la imagen artificial retirada y la del MP4 ausente responden 404.
- Sin errores de consola, de carga o de HTTP durante la navegación normal. Logo idéntico a `240abfc`; `viptour-buzios`, `package.json` y lockfile sin cambios.
- La auditoría de dependencias de producción no reporta vulnerabilidades. La instalación informa cinco avisos altos en las dependencias de desarrollo existentes; no se modifica su versión en esta corrección.
- La reproducción de un video auténtico queda pendiente hasta recibir y registrar material del cliente; no se crea un video de prueba ni de sustitución.

## Vercel

Proyecto `bz-lanchas` en ORBIS (`brandxpbrls-projects`), ID `prj_hlk1SQ0NCPf7AhKHnRrNOKEIA3G5`, repositorio `brandxpbrl/BRANDXP`, Root Directory `bz-lanchas`, Next.js, Node 24.x, instalación `npm ci`, build `npm run build`. No incluye archivos externos al Root Directory.

Los cambios se revisan en el Preview de `chore/extract-bz-lanchas`. No se cambia la branch de producción, no se promueve un deployment y no se añaden ni modifican dominios. Los previews pueden requerir sesión de Vercel con acceso a ORBIS. Los deployments históricos no cambian al publicar un Preview corregido.
