# Evidencia de verificación · CRM NZ MVP 001

14 octubre 2026. Sólo fixtures sintéticos y ejecución local. Ningún merge o
despliegue de producción. El piloto permanece deshabilitado por defecto.

| Comprobación | Resultado | Alcance |
| --- | --- | --- |
| `npm run test:crm-nz` | 13/13 aprobadas | Autorización, negocio, criptografía y adaptadores con fixtures |
| ESLint de rutas/componentes CRM y backend | Aprobado | Sin errores en archivos nuevos revisados |
| `npx tsc --noEmit` | Aprobado | Tipos de la aplicación completa tras generar tipos Next |
| `npm run build` | Aprobado | Build estándar Turbopack; rutas existentes y nuevas |
| `node tests/crm-nz/http-smoke.mjs` | Aprobado | Build local: sesiones sintéticas, APIs privadas y límites |
| Navegador local | Aprobado | Piloto cerrado, enlaces al ecosistema, sin observadores públicos |
| Google Drive / Sheets | Aprobado | Copia independiente privada; esquema `NZ_EVENTS` vacío y zona NZ |
| Google OAuth real | Pendiente | Correos, cliente OAuth y consentimiento privados |
| Backend → Apps Script → Sheets real | Pendiente | Instalación del puente y propiedades privadas |
| Google Places real | Pendiente | API habilitada, clave, cuotas y facturación |
| Gemini real | Pendiente; deshabilitado | Clave dedicada y evaluación humana |
| Código Apps Script original y funciones duplicadas | Pendiente | Código vinculado no disponible en Git/conector |

Las 13 pruebas cubren:

- Firma HMAC alterada, vencimiento, rol falso y bloqueo del Sheet original antes
  de cualquier lectura.
- Flujo firmado completo de ficha, contacto, propuesta e ingreso con el mismo
  código que se entrega a Apps Script; idempotencia y JSON sin fórmulas ejecutables.
- Nonces repetidos, cuota compartida de búsqueda y esquema incorrecto.
- Configuración cerrada, revocación y subject fijado, CSRF y límite de tamaño.
- Cifrado Auth.js: rechazo de sesión manipulada y vencida.
- Puente firmado, máscara Places y exclusión de empresas sin país NZ confirmado.
- Allowlist inválida/duplicada, email Google no verificado y cuentas externas.
- Aislamiento Ben/Cassia y prohibición de leer o escribir finanzas.
- Duplicados por Place ID, sitio independiente y nombre/región.
- Conflictos de edición por revisión.
- Evidencias futuras, vencidas o incompatibles y fuentes Google excluidas.
- Reparto 55/45, centavos, pérdidas, anticipos, saldos y pagos excesivos.
- Descarte de campos no permitidos como ratings, reseñas o identidad inventada.

El smoke HTTP usa un servidor local del build optimizado con identidades de
prueba cifradas por Auth.js. Comprueba 401 para visitantes y sesiones falsas,
403 para cuentas fuera de la allowlist/subject incorrecto, y 403 para origen
externo. Una sesión válida llega a la frontera de Sheets y recibe 503 por estar
deliberadamente sin conexión. Places y Gemini deshabilitados también reciben 503.
Esta prueba no sustituye la interacción real con Google ni valida credenciales.

La auditoría de dependencias detectó riesgos heredados detallados en
`CRM_NZ_ARCHITECTURE.md`. No se corrigieron mediante una actualización global
del runtime compartido. El piloto requiere esa revisión antes de datos reales.

El build alternativo Webpack encontró un selector CSS heredado en FELA; no se
modificó esa aplicación. El build estándar del proyecto con Turbopack pasó.
Una revisión visual nativa de Sheets no estuvo disponible; se verificaron por API
los permisos, IDs distintos, zona horaria, cabeceras, formato y filas NZ vacías.
