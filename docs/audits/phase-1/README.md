# Fase 1 — saneamiento arquitectónico (solo lectura + control)

Rama: `audit/phase-1-architecture-saneamiento`  
Base: `main` en `2b4fbf4d182417cf2a7464bb1aa1da44100cbd7f`  
Fecha de medición: 2026-09-27 UTC

## Alcance aplicado

Esta fase establece una base segura para consolidar BRANDXP sin borrar ni mover contenido:

- manifiesto reproducible de archivos con contenido idéntico;
- inventario de backups, builds antiguos y rutas legacy;
- inventario explícito de fronteras de datos de clientes;
- declaración de fuentes canónicas y de carpetas generadas;
- gate CI para backend, frontend Vite y portal Next.js;
- checklist para protección de `main`, que requiere permisos administrativos de GitHub.

No se realizaron eliminaciones, movimientos de assets, cambios de secretos, cambios de Vercel/Render ni cambios de runtime en producción.

## Medición del árbol

| Métrica | Resultado |
|---|---:|
| Archivos | 2,591 |
| Directorios | 550 |
| Tamaño lógico del checkout | 1.613 GiB (1,732,457,912 bytes) |
| Grupos de blobs idénticos | 288 |
| Archivos pertenecientes a grupos repetidos | 1,065 |
| Tamaño lógico de esos archivos repetidos | 1.273 GiB (1,366,499,079 bytes) |
| Porcentaje de duplicación lógica | 78.88% |

> La “duplicación lógica” suma todos los archivos que pertenecen a un grupo repetido. Git puede compartir internamente un mismo blob, por lo que esta cifra no equivale al espacio físico usado por el repositorio ni autoriza a borrar copias.

## Bloques principales

| Bloque | Tamaño lógico |
|---|---:|
| `viptour-buzios` | 0.941 GiB (1,010,047,137 bytes) |
| `BRAND_EXPERIENCE` | 0.630 GiB (676,570,806 bytes) |
| `docs` | 0.023 GiB (24,769,117 bytes) |
| `exports` | 0.014 GiB (15,346,186 bytes) |
| `frontend` | 0.002 GiB (1,971,161 bytes) |
| `backend` | 0.001 GiB (1,202,132 bytes) |
| `BRAND_EXPERIENCE_OS` | 0.001 GiB (948,312 bytes) |
| `brand_experience_universe_dashboard_1779841350327.png` | 0.001 GiB (795,417 bytes) |
| `entity_bible_full_analysis.zip` | 0.000 GiB (412,052 bytes) |
| `FelaTours_Brand_Identity_Board.pdf` | 0.000 GiB (93,599 bytes) |

## Archivos de esta fase

- [Fuente canónica y límites de responsabilidad](./architecture-canonical-sources.md)
- [Duplicados exactos](./duplicate-files.csv)
- [Backups, builds antiguos y legacy](./legacy-and-build-candidates.csv)
- [Fronteras de datos privados de clientes](./client-data-boundaries.csv)
- [Gate de CI](../../../.github/workflows/brandxp-gate.yml)

## Decisiones pendientes, no ejecutadas

1. Confirmar qué copia de cada grupo duplicado es realmente referenciada por runtime.
2. Mover los datos privados de clientes fuera del repositorio público, con preservación y control de acceso.
3. Integrar o automatizar el build de Brand Experience en lugar de mantener bundles copiados.
4. Definir lockfile reproducible para backend antes de pinnear producción.
5. Habilitar protección de `main`: PR obligatorio, al menos un review, checks `backend-tests`, `frontend-vite` y `next-portal`, y bloqueo de push directo.
6. Ejecutar el secret scan histórico después de decidir el alcance de repositorio público/privado.

## Regla de seguridad

Ningún archivo listado aquí debe eliminarse sólo por aparecer como duplicado, backup o legacy. La eliminación o migración requiere comprobar referencias, historial Git y estado de deployment en una fase posterior.
