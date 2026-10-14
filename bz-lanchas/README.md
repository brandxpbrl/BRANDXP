# BZ Lanchas

Aplicación Next.js independiente extraída de la implementación aprobada de `viptour-buzios/app/bzlanchas/` en `brandxpbrl/BRANDXP`, commit de origen `1c9521305fff66dec7d3d571337ac17d46ddc655`.

La página se sirve directamente en `/`. El proyecto original conserva `/bzlanchas` y no se ha modificado ningún archivo suyo. La extracción se realiza en la branch `chore/extract-bz-lanchas`, sin merge a `main`.

## Ejecución local

Desde esta carpeta, con Node.js 24 LTS (verificado con 24.15.0):

```sh
npm install
npm run dev
```

Abrir `http://localhost:3000/`.

```sh
npm run build
npm run typecheck
npm run lint
npm run start
```

El lockfile pertenece a esta aplicación. Para instalaciones reproducibles también se puede usar `npm ci`. No se requieren variables de entorno, backend, base de datos ni archivos externos a esta carpeta.

## Verificación realizada el 14 de octubre de 2026

- `npm install`: completado. El primer intento de descarga sufrió un corte de red; el reintento terminó correctamente.
- `npm run build`: completado con Next.js 16.4.0 / Turbopack; `/` se genera como página estática.
- `npm run typecheck`: completado sin errores.
- `npm run lint`: completado sin errores ni warnings.
- `npm audit --omit=dev`: cero vulnerabilidades.
- Servidor de producción: `/` responde 200 y renderiza BZ Lanchas; `/bzlanchas` responde 404 en la aplicación nueva.
- Browser QA en Chrome: 1440, 1024, 900, 768, 600, 390, 375 y 320 px. No hay desbordamiento horizontal. Contenido, estilos calculados y geometría coinciden con un render del JSX aprobado y el CSS heredado; las capturas completas coinciden dentro del contenido de la página. La referencia normaliza la URL del asset para cargar el mismo PNG en este entorno.
- Los dos assets responden 200; el PNG de fondo se decodifica a 1536 × 1024. Ambos archivos coinciden por SHA-256 con los originales.
- Se comprobaron los tres enlaces de WhatsApp y el número visible; no se envió ningún mensaje.
- Se comprobaron título, descripción, canonical raíz, idioma, Open Graph, Twitter y favicon. No hay metadata ni observadores de ORBIS.
- Sin errores de JavaScript ni solicitudes fallidas durante la navegación.
- `git diff HEAD -- viptour-buzios`: vacío. El checkout local previo y sus cambios ajenos se conservaron mediante un worktree aislado.

## Archivos copiados y adaptados

| Archivo nuevo | Procedencia / adaptación |
| --- | --- |
| `app/page.tsx` | Página aprobada: mismo JSX y contenido; se retira el import no utilizado `Users` y se añade `id="lanchas"` al catálogo para el enlace existente del footer. |
| `app/bzlanchas.css` | Estilos aprobados, incluidos los breakpoints de 900 y 600 px. Se elimina la regla que ocultaba MAX y se codifica la URL de la imagen (incluida la coma como `%2C`) para que cargue correctamente. |
| `public/logolancha.jpeg` | Logo original, sin cambios de bytes. |
| `public/ChatGPT Image 22 sept 2026, 09_11_29 p.m..png` | Imagen original utilizada como fondo de la lancha, sin cambios de bytes. |
| `tsconfig.json` | Configuración TypeScript del proyecto de origen, con rutas y tipos locales a esta carpeta. |
| `next.config.ts` | Configuración mínima con raíz de Turbopack y de trazado dentro de esta aplicación. Se descartan las redirecciones de VIPTOUR/Búzios Buggy. |

## Archivos creados

- `app/layout.tsx`: documento `pt-BR`, metadata exclusiva de BZ Lanchas, favicon con el logo existente; sin navbar ni observadores del proyecto principal.
- `app/globals.css`: únicamente reglas base que afectaban a la página aprobada (reset, botones, imágenes, tipografía y suavizado), para conservar su apariencia sin instalar Tailwind.
- `package.json` y `package-lock.json`: scripts y dependencias independientes.
- `next-env.d.ts`: tipos de Next.js generados localmente.
- `eslint.config.mjs`: revisión del código; se conserva el elemento `img` aprobado y su recorte actual.
- `.gitignore`: excluye dependencias, build, caché local y configuración privada de Vercel.
- `README.md`: análisis, inventario e instrucciones.

Solo existen los dos assets utilizados dentro de `public/`. No se copiaron imágenes, favicons, manifests, fuentes, componentes ni APIs de otras marcas.

## Dependencias

Producción: Next.js `16.4.0`, React y React DOM `19.2.4`, Lucide React `1.22.0`.

Desarrollo: TypeScript, tipos de Node/React, ESLint y la configuración de Next.js.

Se eliminan Framer Motion, Tailwind y su plugin PostCSS; BZ Lanchas no los necesita. No hay imports hacia `viptour-buzios` ni dependencias de workspace, servicios de ORBIS, MAX, SelfObserver o fuentes remotas.

Next.js y su configuración de lint se actualizan de `16.2.9` a `16.4.0` solo en esta aplicación por los avisos detectados durante la instalación. El audit de producción queda sin hallazgos; el audit completo conserva cinco avisos altos de desarrollo en la cadena `eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`. npm propone un downgrade incompatible de la configuración de Next; no se aplica `npm audit fix --force`.

## Contenido e interacciones preservadas

Los tres enlaces de reserva/WhatsApp mantienen `https://wa.me/5522997362297` y el mensaje aprobado. El teléfono visible sigue siendo `+55 (22) 99736-2297`.

Se conservan todos los textos y características existentes, incluidos los bloques “em breve”. Los botones de idioma, menú, filtro y flechas no tenían handlers en el código de origen; mantienen ese comportamiento. Las políticas siguen teniendo sus enlaces placeholder. No se inventan traducciones, políticas ni información comercial.

## Metadata

Se mantienen exactamente el título `BZ Lanchas | Lanchas em Búzios` y la descripción aprobada. Se añade idioma `pt-BR` y metadata social de la propia marca, sin heredar ORBIS.

La canonical es `/`. En Vercel, la base se obtiene de las variables automáticas `VERCEL_PROJECT_PRODUCTION_URL` o `VERCEL_URL`. No se fija un dominio futuro ni se configura ningún dominio personalizado.

## Crear el nuevo proyecto en Vercel

1. En Vercel, seleccionar el equipo **ORBIS** y abrir **Add New → Project**.
2. Importar el repositorio existente **brandxpbrl/BRANDXP**. Seleccionar la branch **chore/extract-bz-lanchas** como fuente del primer despliegue: esa branch contiene la carpeta nueva, mientras que `main` todavía no la contiene.
3. Configurar únicamente el proyecto nuevo:

   | Campo | Valor |
   | --- | --- |
   | Project Name | `bz-lanchas` |
   | Framework Preset | `Next.js` |
   | Root Directory | `bz-lanchas` |
   | Build Command | `npm run build` |
   | Install Command | `npm ci` |
   | Output Directory | Default de Next.js (sin override) |
   | Node.js Version | `24.x` |
   | Environment Variables | Ninguna requerida |

4. Dejar desactivada la inclusión de archivos externos al Root Directory. No cambiar ajustes del proyecto `viptour-buzios`.
5. Si la pantalla de importación no permite elegir la branch, guardar la configuración del proyecto nuevo; en **Settings → Environments → Production → Branch Tracking**, seleccionar `chore/extract-bz-lanchas`. Después usar **Deployments → Create Deployment** e introducir esa branch para construir el código correcto. No desplegar desde `main`, que aún no contiene esta extracción.
6. Desplegar y revisar la URL `.vercel.app` generada, en `/`, incluyendo móvil y el destino de WhatsApp. No añadir ni transferir dominios personalizados.

El selector de Production Branch afecta solamente al proyecto nuevo. Tras una futura revisión y merge explícitamente autorizado, se podrá elegir `main` para este proyecto; no se hizo ningún merge en esta tarea.

La conexión Vercel disponible durante la extracción devolvió una lista vacía de equipos: no se verificó acceso a ORBIS y no se creó ni desplegó ningún proyecto remoto.

Documentación oficial: [configuración de build y Root Directory](https://vercel.com/docs/builds/configure-a-build), [despliegues desde una referencia Git y Production Branch](https://vercel.com/docs/git), [Next.js 16.4.0](https://github.com/vercel/next.js/releases/tag/v16.4.0).
