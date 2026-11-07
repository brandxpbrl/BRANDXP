# ORBIS–Gravity Upgrade Checkpoint — 2026-11-07

Estado: checkpoint técnico recuperable, previo a ejecuciones reales de Gravity.

## Alcance protegido

- Contratos y runtime inicial de ORBIS.
- Registro corporativo de diez posiciones.
- Pipeline de reportes de agentes.
- Auditoría, esquema, pilotos y canon inicial de Entity Bible v2.
- Adaptadores MCOS, Gravity y QSIM para Entity Bible v2.
- Registro separado de entidades MPE World.
- Registro, grafo, trazas y runner `dry_run` de Gravity.
- Pruebas automatizadas asociadas.

## Estado de seguridad

- Los agentes Gravity permanecen `prompt_only`.
- El runner Gravity solo acepta evidencia sintética en `dry_run`.
- Las llamadas a modelos están bloqueadas en el runner nuevo.
- MPE observa en modo de solo lectura.
- Ninguna simulación se trata como hecho.
- `GRAVITY:A00B` y `MPE:00B` permanecen separados.
- Las acciones externas continúan sujetas a aprobación humana.

## Exclusiones deliberadas

- `backend/main.py`: contiene cambios mezclados con trabajo previo y no se incluye en este checkpoint.
- `runtime/gravity/runs/`: corridas sintéticas temporales.
- `runtime/orbis/objectives/`: expedientes operativos temporales.
- Cambios de clientes, activos visuales y demás trabajo no relacionado del repositorio.
- Protocolos de crisis sugeridos, todavía no canónicos.
- Puente QUBIT–Gravity, todavía no implementado.

## Validación disponible

La batería focal del upgrade aprobó 19 pruebas antes de este checkpoint. El smoke test general
mantiene una incompatibilidad preexistente entre una expectativa de acceso público y el control
de acceso activo del entorno; no se atribuye al upgrade.

## Próximo gate

Antes de cualquier ejecución real de A23 se requieren:

1. contrato y validador de output;
2. ledger de afirmaciones, fuentes, incertidumbre y contradicciones;
3. procedencia documental de las entidades MPE World;
4. revisión humana del primer resultado sintético.
