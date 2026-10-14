# Protección pendiente de `main`

La conexión usada para esta fase no tiene permisos administrativos suficientes para escribir branch protection. Aplicar manualmente en GitHub cuando el PR de Fase 1 esté revisado.

## Configuración recomendada

- Require a pull request before merging.
- Require at least 1 approving review.
- Dismiss stale approvals after new commits.
- Require status checks:
  - `backend-tests`
  - `frontend-vite`
  - `next-portal`
- Require branches to be up to date before merging.
- Block force pushes and branch deletion.
- Restrict direct pushes to `main`.

## Verificación posterior

1. Abrir un PR de prueba con un fallo controlado.
2. Confirmar que el gate falla.
3. Confirmar que GitHub bloquea el merge.
4. Restaurar el estado del PR sin tocar producción.
