# Integración de agentes MPE World

Estado: integrada en backend, pendiente de ejecución de Gravity.

## Separación de sistemas

- ORBIS conserva sus diez posiciones corporativas.
- MPE World mantiene un registro paralelo de entidades cognitivas.
- Gravity continúa como inteligencia especializada y consulta límites MPE antes de ejecutarse.
- MCOS conserva anatomía, Visual DNA, voz y producción cinematográfica.
- QSIM produce simulaciones, nunca hechos.

## Entidades integradas

00B, 001, 027, 028, 029, 030, 031, 032, 033, 034, 099, GPT y GEMINI.

Cada entidad conserva ahora procedencia del snapshot textual revisado: identificador documental,
versión declarada, SHA-256, tamaño y ruta de captura. La resolución de IDs y revisiones de los
documentos canónicos en Drive sigue pendiente y está declarada, no inferida.

## Reglas transversales

1. La autoridad humana es final para acciones sensibles.
2. 00B preserva trazabilidad sin decidir.
3. 001 coordina sin sustituir el trabajo especializado.
4. Ninguna simulación se registra como hecho.
5. Ninguna creación del Soñador se incorpora automáticamente al canon.
6. GPT produce auditorías; no constituye por sí solo una fuente de verdad.
7. 034 propone cambios de paradigma, pero no modifica reglas sin aprobación.
8. 099 prioriza archivo, cuarentena y retención antes de eliminar.

La propuesta de protocolos de crisis permanece fuera del canon hasta una revisión posterior.

## Registro Gravity separado

Gravity conserva un namespace propio (`GRAVITY:Axx`). Sus 34 definiciones siguen marcadas
como `prompt_only` hasta que exista una corrida trazada. `GRAVITY:A00B` es un compresor
semántico y no debe confundirse con `MPE:00B`, guardián de memoria y procedencia.

El grafo técnico separa A27–A34 en ocho etapas secuenciales y expone contratos de eventos
inmutables antes de habilitar cualquier ejecución de modelos.

## Runner Gravity v1

El primer runner solo acepta evidencia sintética y modo `dry_run`. Congela el input por SHA-256,
crea tareas según dependencias, mantiene bloqueadas las llamadas a modelos y registra eventos.
Los modos iniciales son `a23_only`, `minimal_specialists` y `full_plan`. Ninguno ejecuta IA.
