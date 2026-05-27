from pathlib import Path

# ==========================
# ESTRUCTURA BASE
# ==========================

BASE_DIR = Path("brand-experience")

folders = [
    "core/brand_system",
    "core/identities",
    "core/universes",
    "core/research",
    "core/outputs",

    "agents/agent_identity",
    "agents/agent_research",
    "agents/agent_universe",
    "agents/agent_narrative",
    "agents/agent_strategy",
    "agents/agent_experience",
    "agents/agent_assets",

    "data/zoom_transcripts",
    "data/json",
    "data/md",
    "data/clients"
]

for folder in folders:
    (BASE_DIR / folder).mkdir(parents=True, exist_ok=True)

print("Estructura creada")


# ==========================
# BRAND BIBLE
# ==========================

brand_bible = """
# BRAND_BIBLE_SYSTEM

## PURPOSE
Sistema maestro para análisis, construcción y expansión de universos de marca impulsado por IA.

---

# INPUT SOURCES

- Zoom Transcripts
- Entrevistas
- Archivos .MD
- Archivos .DM
- JSON
- Research
- Briefs
- Documentación cliente
- Material comercial
- Observaciones

---

# PIPELINE

## 1. CAPTURA COGNITIVA

Objetivo:
Convertir información dispersa en conocimiento estructurado.

INPUT:
- Zoom
- PDFs
- Docs
- Audio
- Notas

OUTPUT:
Knowledge Base

---

## 2. EXTRACCIÓN IDENTITARIA

Extraer:

- Propósito
- Misión
- Visión
- Valores
- Creencias
- Diferenciación
- Personalidad

OUTPUT:
IDENTITY CORE

---

## 3. BRAND DNA

Construir:

- Arquetipos
- Posicionamiento
- Territorio
- Storytelling
- Tono
- Promesa

OUTPUT:
BRAND DNA

---

## 4. UNIVERSO BRAND

Crear:

- Storyworld
- Símbolos
- Narrativas
- Ecosistema
- Experiencias

OUTPUT:
UNIVERSO BRAND

---

## 5. ACTIVOS

Generar:

- Manifesto
- Identity
- Value Proposition
- Customer Journey
- Roadmap
- Experiencias
- Estrategias

OUTPUT:
Sistema Operativo Brand

"""

# ==========================
# AGENTS
# ==========================

agents_architecture = """
# AGENTS_ARCHITECTURE

## AGENT_IDENTITY

MISIÓN:
Construir esencia de marca.

RESPONSABLE:

- Propósito
- Misión
- Visión
- Valores
- DNA
- Posicionamiento

OUTPUT:
identity.md

---

## AGENT_RESEARCH

MISIÓN:
Analizar contexto.

RESPONSABLE:

- Competencia
- Tendencias
- Mercado
- Insights

OUTPUT:
research.md

---

## AGENT_BRAND_UNIVERSE

MISIÓN:
Crear universo.

RESPONSABLE:

- Storyworld
- Arquetipos
- Símbolos
- Ecosistema

OUTPUT:
universe.md

---

## AGENT_NARRATIVE

MISIÓN:
Construir relato.

RESPONSABLE:

- Manifesto
- Storytelling
- Voice
- Messaging

OUTPUT:
narrative.md

---

## AGENT_STRATEGY

MISIÓN:
Transformar identidad en acción.

RESPONSABLE:

- Roadmap
- Growth
- Customer Journey

OUTPUT:
strategy.md

---

## AGENT_EXPERIENCE

MISIÓN:
Diseñar experiencia.

RESPONSABLE:

- Touchpoints
- Journey
- Activaciones

OUTPUT:
experience.md

---

## AGENT_ASSETS

MISIÓN:
Generar entregables.

RESPONSABLE:

- PDFs
- Docs
- Brand Assets

OUTPUT:
assets/

---

FLUJO:

INPUT
 ↓

RESEARCH
 ↓

IDENTITY
 ↓

UNIVERSE
 ↓

NARRATIVE
 ↓

STRATEGY
 ↓

EXPERIENCE
 ↓

ASSETS

"""

# ==========================
# CREAR ARCHIVOS
# ==========================

brand_file = BASE_DIR / "core/brand_system/BRAND_BIBLE_SYSTEM.md"
agents_file = BASE_DIR / "core/brand_system/AGENTS_ARCHITECTURE.md"

brand_file.write_text(
    brand_bible,
    encoding="utf-8"
)

agents_file.write_text(
    agents_architecture,
    encoding="utf-8"
)

print("Archivos creados:")
print(brand_file)
print(agents_file)