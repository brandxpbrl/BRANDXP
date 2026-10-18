# Configuración privada · CRM NZ

Proyecto Vercel **existente**: `brandxp`. No ejecutar `vercel --prod`, crear
proyectos, modificar dominios, promover previews ni hacer merge.
Mantener `CRM_NZ_ENABLED=false` hasta completar pruebas reales y revisar
los riesgos de `CRM_NZ_ARCHITECTURE.md`.

## Variables y secretos

Plantilla: `viptour-buzios/integrations/crm-nz/.env.example`.
Copiar localmente a `viptour-buzios/.env.local` (ignorado por Git).
En Vercel usar únicamente Preview, limitado a `feat/brand-experience-crm-nz`.
No usar valores de producción en tests ni poner secretos en `NEXT_PUBLIC_*`.
No publicar IDs privados de Sheets o correos personales en el PR.

| Variable                         | Uso                                                                   |
| -------------------------------- | --------------------------------------------------------------------- |
| CRM_NZ_ENABLED                   | `false` por defecto; `true` habilita el piloto configurado            |
| CRM_NZ_ORIGIN                    | Origen exacto, sin slash final; alias estable del preview o localhost |
| CRM_NZ_AUTH_SECRET               | Secreto aleatorio de mínimo 32 caracteres para sesiones               |
| CRM_NZ_GOOGLE_CLIENT_ID / SECRET | Cliente OAuth Google de tipo aplicación web                           |
| CRM_NZ_USERS_JSON                | Lista `{email, role, sub}`; roles `admin`, `ben`, `cassia`            |
| CRM_NZ_REFERENCE_SHEET_ID        | ID del original, sólo para impedir escribir en él                     |
| CRM_NZ_SHEET_ID                  | ID de la copia privada NZ, obligatoriamente distinto                  |
| CRM_NZ_APPS_SCRIPT_URL           | URL `/macros/s/.../exec` del despliegue NZ independiente              |
| CRM_NZ_BRIDGE_SECRET             | Otro secreto aleatorio de mínimo 32 caracteres para HMAC              |
| CRM_NZ_PLACES_API_KEY            | Clave de Places API (New), sólo backend                               |
| CRM_NZ_GEMINI_ENABLED            | `false` por defecto; opcional                                         |
| CRM_NZ_GEMINI_API_KEY            | Clave Gemini dedicada, sólo si se activa                              |

Guardar secretos directamente en Google/Vercel. No pegarlos en chats, archivos
versionados o parámetros CLI. `CRM_NZ_USERS_JSON` también se trata como privado.
La eliminación de un usuario en Vercel requiere redeploy del **preview** y también
actualizar la allowlist de Apps Script; el script revalida desde sus propiedades.

## Google OAuth

1. Configurar un cliente web y una pantalla de consentimiento para el piloto.
2. Registrar `<CRM_NZ_ORIGIN>/api/crm-nz/auth/callback/google` como URI de retorno.
   Usar el alias estable de la rama, no una URL por commit ni otro dominio.
3. Autorizar las cuentas piloto en Google si el consentimiento está en testing.
4. Definir sus correos y roles en ambas allowlists. No inventar correos para Ben
   o Cassia. Fijar el subject `sub` del usuario; nunca usar IDs enviados por el cliente.
5. Una cuenta Gmail o Workspace verificada puede entrar sin `sub` fijado;
   una cuenta de otro dominio requiere ese subject para evitar confiar sólo en email.
6. Probar Google real, un usuario no autorizado, cuenta no verificada y logout.

## Copia Sheets NZ

La copia fue creada por Drive en una carpeta verificada privada, con un ID
distinto. Sólo el propietario tiene permisos. La URL privada se entrega en el chat;
configurar sus IDs directamente en los servicios, sin registrarlos en Git.

`NZ_EVENTS` ya tiene `id | at | type | actor | event_json`, sin datos de prueba.
Cada operación añade un evento JSON con UUID, requestId, hash del comando,
fecha del servidor, responsable y datos validados. No editar eventos a mano.
Las pestañas copiadas son referencia; el backend no las importa ni las consulta.
La lectura de oportunidades usa exclusivamente fichas NZ registradas en eventos.

Correspondencia semántica con las cabeceras existentes:

| Original                                 | CRM NZ                                        |
| ---------------------------------------- | --------------------------------------------- |
| Nombre del negocio / Rubro / Ciudad-Zona | businessName / category / region              |
| Sitio web / Email / WhatsApp-Teléfono    | website / contactEmail / phone                |
| Estado / Valor ofrecido                  | stage / proposalCents                         |
| Próximo paso / Fecha seguimiento         | nextStep / nextStepAt                         |
| Fecha contacto / Respondió / Notas       | actividades contact / response / note         |
| Problema / Oportunidad / Lead Score      | evidencias con URL+fecha / score reproducible |
| Google Maps / rating / reseñas           | sólo Place ID; no migrar contenido Places     |

No ejecutar importación masiva ni reutilizar puntuaciones antiguas sin evidencia.
Los datos originales no deben aparecer en pruebas locales o previews.

## Apps Script NZ

1. Crear un proyecto Apps Script **standalone e independiente**, propiedad del
   dueño de la copia; no modificar el proyecto vinculado al original ni usar su URL.
2. Agregar `integrations/crm-nz/Code.gs` como `Code.gs` y copiar
   `lib/crm-nz/domain.js` **sin cambios** como `Domain.gs`. Agregar el manifiesto
   `integrations/crm-nz/appsscript.json`. La suite ejecuta estos mismos archivos.
3. Configurar Script Properties: `CRM_NZ_SHEET_ID`, `CRM_NZ_REFERENCE_SHEET_ID`,
   `CRM_NZ_USERS_JSON`, `CRM_NZ_BRIDGE_SECRET` con los mismos valores del backend.
   Estos valores no van en código. La allowlist inicialmente vacía deniega acceso.
4. Ejecutar `crmNzSetup()` como propietario. Valida los IDs y cabeceras; crea la
   pestaña sólo si falta y fija `CRM_NZ_READY=true`. Nunca toca el libro original.
5. Deploy > New deployment > Web app. Execute as propietario. El backend usa una
   firma HMAC, no el login de navegador; el acceso al endpoint debe admitir la
   llamada servidor-servidor. **No** compartir el Sheet públicamente.
6. Si las políticas Workspace impiden web apps con este tipo de llamada, detener
   la activación y diseñar un puente autenticado aprobado; no abrir el libro.
7. Copiar la URL `/exec` en `CRM_NZ_APPS_SCRIPT_URL`. No usar `/dev`.
8. Probar con un libro NZ de fixtures separado del libro comercial: createLead,
   updateLead con revisión, addActivity, recordTransaction, snapshot y reintento
   con el mismo UUID. Verificar Ben/Cassia y ausencia de datos fuera de su rol.

Firmas: el backend envía `{body, signature}`, donde body es una cadena JSON UTF-8
firmada HMAC-SHA256/base64. Incluye timestamp, nonce, sheetId, actor, action,
payload. El script acepta una ventana de 5 minutos, rechaza nonce repetido y
valida nuevamente el rol. No pasa tokens Google ni claves Places al Sheet.

El código original de Apps Script sigue pendiente de auditoría. Si se recibe,
extraer funciones necesarias al namespace NZ y comprobar nombres duplicados.
No pegar funciones globales antiguas junto a `doPost`, ni copiar triggers de email
o automatismos comerciales. El MVP no envía mensajes a contactos.

## Places y Gemini

Habilitar Places API (New) con facturación y una clave restringida a esa API.
Definir presupuesto y cuotas Google; las cuotas internas complementan las del
proveedor. Vercel suele requerir una estrategia específica para restricción por IP;
no prometer una restricción IP sin salida estática configurada. Mostrar atribución,
mantener resultados temporales y verificar país NZ y fuente independiente.

Gemini permanece deshabilitado. El endpoint usa `gemini-2.5-flash` y sólo recibe
evidencias; activar con una clave dedicada después de revisar privacidad/costos.
No usar su salida como hecho verificado ni puntuación automática.

## Verificación y preview

Desde `viptour-buzios`:

```powershell
npm ci
npm run test:crm-nz
npx tsc --noEmit -p tests/crm-nz/tsconfig.json
npx eslint app/brandexperience/crm-nz app/api/crm-nz lib/crm-nz/*.ts
npm run build
node tests/crm-nz/http-smoke.mjs
```

El último comando usa el build optimizado en un servidor **local** puerto 3100,
identidades/secretos sintéticos y ninguna conexión comercial. No despliega nada.
No ejecutarlo si el puerto ya corresponde a otro servicio. El proceso se limpia
al terminar. Sólo valida sesiones de prueba y límites HTTP, no un login Google real.

Publicar sólo la rama feature para que la integración Git existente genere preview.
Comprobar commit, proyecto `brandxp`, target Preview y protección antes de usarlo.
No quitar protección, añadir bypass público ni cambiar configuración de producción.
El estado cerrado sin variables permite revisar la pantalla y la denegación de API.
El piloto real sigue pendiente de credenciales, allowlists, Apps Script, pruebas
en vivo y resolución de las vulnerabilidades heredadas del runtime.
