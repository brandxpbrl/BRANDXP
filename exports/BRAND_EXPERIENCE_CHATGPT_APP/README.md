# BRAND EXPERIENCE CHATGPT APP

Este paquete exporta Brand Experience OS para trabajar dentro de ChatGPT.

## Estructura

- `00_SYSTEM`: sistema operativo, contexto maestro y modo visual.
- `01_CLIENT_INPUT`: plantillas para cargar clientes.
- `02_OUTPUT_TEMPLATES`: plantillas de entregables.
- `03_PROMPTS`: prompts maestros para ejecutar el sistema.
- `04_CLIENTS`: clientes exportados desde la app local, si existen.

## Flujo recomendado

1. Subí `00_SYSTEM/BRAND_EXPERIENCE_OS_CHATGPT_CONTEXT.dm` a un Project de ChatGPT.
2. Subí o pegá el contexto del cliente.
3. Ejecutá `03_PROMPTS/01_RUN_FRAMEWORK_PROMPT.md`.
4. Guardá el resultado como `MANUAL_FRAMEWORK_ANALYSIS.md`.
5. Usá los prompts siguientes para generar Master, logo system, paleta, tono, visual board y contenido.

## Filosofía

La app local organiza.
ChatGPT interpreta.
El resultado vuelve como análisis maestro.
