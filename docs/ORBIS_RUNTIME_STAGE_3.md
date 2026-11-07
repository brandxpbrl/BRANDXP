# ORBIS Runtime — Etapa 3

## Propósito

Convertir objetivos de negocio en expedientes persistentes, observables y controlados dentro del backend activo de Brand Experience OS.

## Ciclo implementado

```text
Objetivo
→ proyecto
→ plan
→ tareas
→ delegaciones
→ herramientas declaradas
→ compuerta de aprobación
→ ejecución autorizada
→ eventos trazables
```

Los contratos de evidencia, entregables, memoria, resultados y métricas ya existen. Su incorporación automática al ciclo ocurrirá cuando se conecten los adaptadores de la Etapa 4.

## Seguridad

- Solo agentes con `activation_state: identity_validated` pueden recibir tareas.
- Los agentes en borrador no pueden participar en ejecución real.
- Toda tarea respeta sus dependencias.
- Las acciones externas permanecen bloqueadas por defecto.
- Solo el aprobador registrado puede abrir la compuerta de ejecución.
- Cada creación, transición y decisión queda registrada como evento.
- El runtime no publica, envía mensajes, mueve fondos ni genera videos.

## Persistencia

Cada objetivo se guarda como un expediente JSON autocontenido en:

`runtime/orbis/objectives/goal-<id>.json`

La escritura es atómica para evitar expedientes parcialmente guardados.

## API

- `POST /api/orbis/objectives`
- `GET /api/orbis/objectives`
- `GET /api/orbis/objectives/{objective_id}`
- `POST /api/orbis/objectives/{objective_id}/tasks/{task_id}/transition`
- `POST /api/orbis/objectives/{objective_id}/approvals/{approval_id}/decision`

## Primer objetivo persistido

`goal-0d8ab84cd5ae` — Activar el primer flujo integral de ORBIS.

Responsabilidades iniciales:

1. Nicolás: dirección y criterios de éxito.
2. Axiom: viabilidad, métricas y riesgo.
3. Nova: estrategia y comunicación.
4. Lyra: ejecución, responsables y seguimiento.

La aprobación permanece pendiente y la ejecución externa bloqueada.

## Siguiente etapa corregida

Entity Bible requiere alteraciones y upgrade antes de actuar como fuente del runtime. El orden correcto es:

1. Auditar las tres versiones existentes de Entity Bible.
2. Crear esquema, manifiesto, versionado y gobierno de conocimiento.
3. Curar y aprobar el canon operativo.
4. Profundizar cada unidad mediante Gravity.
5. Probar sus aplicaciones narrativas, visuales y experienciales mediante MCOS.
6. Comparar alternativas y riesgos mediante Possibility Lab.
7. Someter el conocimiento candidato a aprobación humana.
8. Construir el loader Entity Bible v2 para contenido aprobado.
9. Conectar Entity Bible v2 con ORBIS mediante adaptador.
10. Conectar Brand Memory.
11. Incorporar el registro de herramientas y hojas de cálculo.

Los adaptadores producirán evidencia y entregables bajo los contratos universales; no copiarán ni mezclarán los sistemas fuente. La biblioteca histórica de 222 documentos no será tratada automáticamente como canon aprobado.
