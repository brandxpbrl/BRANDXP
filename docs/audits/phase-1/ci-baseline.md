# CI baseline — Fase 1

Run: [BRANDXP Gate #1](https://github.com/brandxpbrl/BRANDXP/actions/runs/36287979890)  
Commit: `7beb523f4e573262165f0fb3d52c7f3c482b8f67`  
Fecha: 2026-09-27

El gate se activó correctamente en el PR #36. Los tres jobs terminaron en fallo por problemas preexistentes detectados por las validaciones; esta fase no modifica esos componentes.

## Resumen

| Job | Resultado | Evidencia |
|---|---|---|
| `backend-tests` | 189 passed / 4 failed | Fallos concentrados en `test_visual_board_images.py` |
| `frontend-vite` | failed | 10 errores de ESLint |
| `next-portal` | failed | 21 errores de ESLint |
| Vercel Preview Comments | success | Sin feedback pendiente |

## Backend

Fallos:

- `VisualBoardImagesTests.test_endpoint_response_shape`: esperaba 200, recibió 410.
- `VisualBoardImagesTests.test_missing_board_specs_returns_clear_error`: esperaba 400, recibió 410.
- `VisualBoardImagesTests.test_missing_client_returns_404`: esperaba 404, recibió 410.
- `VisualBoardImagesTests.test_response_does_not_include_absolute_paths`: el mensaje 410 contiene escapes JSON.

Lectura: el endpoint de generación local de imágenes fue desactivado en runtime, pero la suite todavía espera el contrato anterior. Esto requiere decidir si se actualizan las pruebas al nuevo contrato 410 o si se restaura el endpoint; no se decide en Fase 1.

## Frontend Vite

Los 10 errores de ESLint están en:

- `frontend/src/App.jsx`: `visitorName` y `creationIntent` no usados.
- `frontend/src/components/CinematicCampaignBuilder.jsx`: dos usos de `setState` síncrono dentro de effects.
- `frontend/src/components/EntityAdvisorPanel.jsx`: dos variables `err` no usadas y un `setState` síncrono dentro de effect.
- `frontend/src/components/OnboardingWizard.jsx`: `React` y `onComplete` no usados.

## Next portal

Los 21 errores de ESLint están en:

- `viptour-buzios/app/felatours/CatalogViewer.tsx:30`: `setState` síncrono dentro de effect.
- `viptour-buzios/app/mpe/MpeVisionExperience.tsx:169-170`: acceso a refs durante render.
- `viptour-buzios/app/mpe/possibility/MpeTemporalMemoryPanel.tsx:10`: `setState` síncrono dentro de effect.
- `viptour-buzios/components/max/MaxPublicObserver.tsx`: 9 hooks llamados condicionalmente.
- `viptour-buzios/components/system/SelfObserverIdentity.tsx`: 9 hooks llamados condicionalmente.

Estos errores son especialmente relevantes para la revisión del PR #32 y para la integración de SelfObserver/ORBIS. El gate queda correctamente estricto: no se deben silenciar las reglas para hacer pasar el pipeline.

## Estado

Este archivo es diagnóstico. La Fase 1 no corrige los errores de producto; deja la línea base registrada para que la Fase 2 los trate de forma aislada y verificable.
