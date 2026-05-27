# Entity Bible Curada

Fecha de creacion: 2026-05-18

Esta carpeta contiene una copia curada de la Entity Bible para uso futuro del backend.
No es la fuente completa. Es una seleccion minima, segura y util para alimentar el
framework de analisis, el generador de Master y los board_specs en etapas posteriores.

## Fuente Original

- CORE: `BRAND_EXPERIENCE_OS/CORE/`
- KNOWLEDGE: `BRAND_EXPERIENCE_OS/KNOWLEDGE/ENTITY_BIBLE/`

## Archivos Core Copiados

- `core/ai_behavior.md`
- `core/brand_philosophy.md`
- `core/entity_framework.md`
- `core/identity_system.md`
- `core/operating_system.md`
- `core/positioning.md`
- `core/storytelling_framework.md`
- `core/tone_of_voice.md`
- `core/visual_language.md`

## Archivos Knowledge Copiados

### Philosophy

- `knowledge/philosophy/identity_before_design.md`
- `knowledge/philosophy/perception_is_reality.md`
- `knowledge/philosophy/transmission_over_communication.md`

### Perception

- `knowledge/perception/perception_before_logic.md`
- `knowledge/perception/visual_authority.md`
- `knowledge/perception/perceived_value.md`
- `knowledge/perception/subconscious_branding.md`

### Visual Psychology

- `knowledge/visual_psychology/negative_space.md`
- `knowledge/visual_psychology/contrast_psychology.md`
- `knowledge/visual_psychology/color_emotion.md`
- `knowledge/visual_psychology/cinematic_composition.md`

### Luxury

- `knowledge/luxury/luxury_perception.md`
- `knowledge/luxury/premium_positioning.md`
- `knowledge/luxury/presence_over_noise.md`

### Entity Detection

- `knowledge/entity_detection/identity_patterns.md`
- `knowledge/entity_detection/entity_voice.md`
- `knowledge/entity_detection/visual_archetypes.md`
- `knowledge/entity_detection/narrative_essence.md`

## Excluido Por Seguridad Y Ruido

- `.env` y archivos de secretos.
- `.zip` y archivos comprimidos.
- Scripts `.py` legacy.
- Imagenes, videos, PDFs y binarios.
- Outputs de clientes.
- Carpetas `05_ENTREGAS`.
- `node_modules`, `dist`, caches, venvs y logs.
- Archivos genericos masivos `rules.md`, `psychology.md`, `principles.md`,
  `patterns.md`, `framework.md` y `examples.md`.
- `BRAND_EXPERIENCE/00_BRAND_CORE`.
- `BRAND_EXPERIENCE/01_OPERATING_SYSTEM/01_Frameworks`.
- `brand-experience/core/brand_system`.
- `entity_bible` semilla de raiz.

## Nota Operativa

Esta Biblia todavia no esta conectada al framework de analisis. El siguiente paso
debe ser crear un `EntityBibleLoader` seguro que lea solamente esta carpeta, con
filtros por extension, tamano, profundidad, cantidad de archivos y path traversal.
