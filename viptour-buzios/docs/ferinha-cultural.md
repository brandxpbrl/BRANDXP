# FERINHA CULTURAL

Implementada en `viptour-buzios`, aplicación Next.js 16.2.9 / React 19 / App Router del repositorio BRANDXP. Copia de trabajo local creada desde HEAD `d9d2a9a0e652b4bcc7517cdb71f91430958340c1`. No se realizaron commits, push, merge ni deploy.

## Archivos

- `app/ferinha-cultural/page.tsx`: diez secciones editoriales, enlaces al ecosistema, contenido y metadata específica.
- `app/ferinha-cultural/page.module.css`: estilos encapsulados, fondo cálido, tipografías existentes y serif editorial de sistema, responsive y foco visible.
- `app/ferinha-cultural/participation-form.tsx`: campos, validación nativa, selección múltiple, consentimiento, carga, error, éxito condicionado a recepción real, bloqueo de doble clic y clave de idempotencia para reintentos.
- `app/ferinha-cultural/opengraph-image.tsx`: imagen editorial PNG 1200 × 630 mediante `next/og`; sin fotografías inventadas.
- `app/api/ferinha-cultural/route.ts`: POST con validación del servidor, comprobación de origen y límite de cuerpo de 16 KB. No persiste ni registra datos personales.
- `config/ferinha.ts`: metadata, categorías, intereses, colaboradores y campos de la primera edición.
- `components/layout/ConditionalNavbar.tsx`: excepción exacta para la nueva página, siguiendo el patrón existente de páginas con identidad propia.
- `app/sitemap.ts`: incorpora la URL canónica sin eliminar rutas.
- `tests/ferinha.test.mjs`: seis pruebas HTTP de integración ejecutables con Node, sin dependencias nuevas.
- `docs/ferinha-desktop.png`, `docs/ferinha-mobile.png`: capturas del preview.

## Recepción real pendiente

El repositorio no tiene un servicio identificado de inscripciones de FERINHA. No se inventó una base de datos ni se enviaron propuestas a contactos o servicios externos. Un POST válido responde **503** con `{ accepted: false, error: "registration_not_configured" }`. Los datos permanecen en los campos mientras la página sigue abierta; no se guardan al recargar.

El punto de conexión es el retorno 503 al final de `app/api/ferinha-cultural/route.ts`, después de las validaciones. Sustituirlo por un adaptador del servicio que el responsable del proyecto elija y configure. Mantener credenciales solamente en variables del servidor, nunca `NEXT_PUBLIC_*`.

Contrato requerido antes de habilitar inscripciones:

1. Persistencia duradera del payload validado y del consentimiento; no usar memoria del proceso ni archivos locales de Vercel como almacenamiento.
2. Procesar `Idempotency-Key` con restricción única duradera para evitar duplicados entre reintentos e instancias. La protección actual del navegador evita doble clic durante un envío, pero no sustituye deduplicación del servidor.
3. Responder 2xx con `{ accepted: true }` únicamente tras confirmar que la propuesta fue guardada. Ante fallo, responder no-2xx; no registrar el payload en logs.
4. Configurar protección contra abuso y política de conservación / baja con el servicio elegido.
5. Actualizar el aviso de inscripciones no habilitadas en el formulario, y verificar con pruebas de integración una recepción real, reintentos y el estado de éxito.

No hay variables secretas nuevas que configurar en esta implementación. Los nombres de credenciales dependerán del servicio elegido. El estado de éxito y el texto solicitado están implementados, pero **no se verificó éxito extremo a extremo**, porque no existe todavía un receptor real. No se expuso una ruta falsa de éxito.

## Contenido por completar

Completar `ferinha.edition.date`, `time`, `address` y `host` en `config/ferinha.ts`. Editar `collaborators` para nuevas marcas. Confirmar condiciones y alcance de premios antes de seleccionar participantes. La sección de votación no genera un QR ni contabiliza votos: conectar allí una URL real únicamente después de implementar reglas, proyectos elegibles y protección de duplicados. No se agregaron datos estructurados de Event porque no hay fecha ni ubicación confirmadas.

## Validación realizada

- `npm ci --no-audit --no-fund`: instalación desde lockfile; ninguna dependencia añadida al proyecto.
- `npm run lint`: 4 errores y 27 warnings preexistentes, ajenos a los archivos de FERINHA. Incluyen reglas de efectos de React en Fela Tours / MPE. No se modificaron esas páginas para silenciar el resultado.
- `npx eslint app/ferinha-cultural app/api/ferinha-cultural config/ferinha.ts components/layout/ConditionalNavbar.tsx app/sitemap.ts tests/ferinha.test.mjs`: aprobado.
- `npx tsc --noEmit`: aprobado después de generar las declaraciones de Next. La primera ejecución antes de la generación reportó imports de imágenes de Zapt; el typecheck posterior y los dos builds finales los resolvieron.
- `npm run build`: aprobado con acceso de red para las fuentes Google existentes. El primer intento restringido falló únicamente al descargarlas. El build final generó la página estática y el endpoint de Open Graph.
- No existía script de tests en el paquete. Se ejecutó `npm run test --if-present`; se añadieron y ejecutaron seis pruebas relevantes con `node --test tests/ferinha.test.mjs`.
- Las seis pruebas pasaron en desarrollo y en producción (`FERINHA_TEST_URL=http://127.0.0.1:3101`). Comprueban validación, consentimiento, origen, tamaño, formato, metadata, PNG Open Graph y ocho rutas principales existentes.
- Barrido HTTP del manifiesto: las 39 rutas de páginas públicas estáticas respondieron 200; el endpoint interno `/_global-error` se excluye de la evaluación de rutas públicas. Las rutas dinámicas de productos se generaron correctamente en el build.
- Revisión de navegador en 390, 768 y 1440 px, sin desbordamiento horizontal. Formulario operado con datos ficticios en desktop y móvil, observados carga y error. Campo obligatorio vacío probado con foco automático y validación nativa.
- Verificado un único h1, title exacto, canonical y URL absoluta de Open Graph. Texto oscuro sobre fondos claros, labels asociados, fieldsets, foco visible y estado anunciado mediante aria-live.
- `git diff --check`: aprobado (avisos de conversión LF/CRLF del entorno Windows).

La revisión de rutas verifica carga HTTP y generación; no sustituye pruebas exhaustivas de todas las interacciones de proyectos existentes. Los observadores globales ORBIS / MAX continúan presentes según el layout existente.

## Preview local

Desde `viptour-buzios`: `npm run build`, luego `npm run start -- --hostname 127.0.0.1 --port 3101`. Abrir `http://127.0.0.1:3101/ferinha-cultural`. Publicar requiere autorización del usuario.

## Actualización visual con referencias del usuario
Se incorporaron tres piezas originales aportadas por el usuario en public/ferinha, optimizadas al servir mediante next/image. Hero azul piscina, títulos fucsia, llamados amarillos y sección de campaña. Imágenes identificadas como conceptuales. Open Graph actualizado. Lint de la página, TypeScript y build aprobados; capturas renovadas en desktop (1440 px) y móvil (390 px), sin desbordamiento horizontal. La publicación continúa pendiente de autorización.
