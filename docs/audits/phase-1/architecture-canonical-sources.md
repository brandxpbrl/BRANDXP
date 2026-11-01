# Fuentes canónicas y límites de responsabilidad

Este documento fija una convención operativa para que las carpetas no sigan funcionando como fuentes de verdad implícitas.

| Dominio | Fuente canónica | Naturaleza | Regla |
|---|---|---|---|
| Conocimiento normativo de Brand Experience OS | `BRAND_EXPERIENCE_OS/` | Fuente editable de conocimiento | Las copias en `backend/entity_bible/` o exports no se editan como fuente independiente. |
| Runtime Brand Experience OS | `backend/` | Aplicación ejecutable FastAPI | Consume conocimiento y datos; no debe crear una segunda biblia normativa. |
| Datos operativos y entregables de clientes | `BRAND_EXPERIENCE/03_CLIENT_SYSTEM/CLIENTES_ACTIVOS/` | Datos operativos | Deben migrar a almacenamiento privado; mientras tanto se consideran zona restringida. |
| Frontend Brand Experience OS | `frontend/` | Source React/Vite | Es el source; su `dist/` generado no debe convertirse en fuente manual. |
| Portal público RioVibes/BRANDXP | `viptour-buzios/` | Aplicación Next.js | Es la fuente canónica del portal público y sus rutas. |
| Exportaciones | `exports/` | Artefactos generados | No se editan como fuente; se regeneran desde el sistema que los produce. |
| Build iframe heredado | `viptour-buzios/public/brandexperience.html` y `public/assets/index-*` | Puente compilado temporal | Mantener sólo mientras exista la ruta; automatizar su generación antes de eliminarlo. |
| Scripts históricos | `scripts/legacy/` y backups | Archivo histórico | No se consideran runtime activo; requieren revisión antes de archivar o quitar. |

## Política de conflicto

Cuando dos ubicaciones contienen conocimiento distinto:

1. preservar ambas durante la auditoría;
2. registrar el conflicto y el commit de origen;
3. elegir una fuente canónica por dominio;
4. regenerar adaptadores/exports;
5. eliminar copias sólo después de validar tests y deployment.

## No aplicado todavía

- No se movieron clientes.
- No se eliminaron duplicados.
- No se modificó Access Control.
- No se aplicó protección de branch.
- No se cambió Render, Vercel ni ningún secreto.
