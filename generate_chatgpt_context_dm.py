from pathlib import Path
from datetime import datetime
import json
import re


# ============================================================
# CONFIG
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parent
BACKEND_DIR = PROJECT_ROOT / "backend"
DOCS_DIR = PROJECT_ROOT / "docs"

ENTITY_BIBLE_DIR = BACKEND_DIR / "entity_bible"
AGENTS_DIR = BACKEND_DIR / "agents" / "AGENTS"

OUTPUT_DM = DOCS_DIR / "BRAND_EXPERIENCE_OS_CHATGPT_CONTEXT.dm"
OUTPUT_JSON_REPORT = DOCS_DIR / "BRAND_EXPERIENCE_OS_CHATGPT_CONTEXT_REPORT.json"
OUTPUT_MD_REPORT = DOCS_DIR / "BRAND_EXPERIENCE_OS_CHATGPT_CONTEXT_REPORT.md"

MAX_FILE_CHARS = 8_000
MAX_TOTAL_CHARS = 120_000

ALLOWED_EXTENSIONS = {".md", ".txt", ".dm"}

BLOCKED_PARTS = {
    ".git",
    ".venv",
    "venv",
    "node_modules",
    "dist",
    "build",
    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",
    "05_ENTREGAS",
    "CLIENTES_ACTIVOS",
    "uploads",
    "visuals",
    "board_specs",
}

BLOCKED_SUFFIXES = {
    ".env",
    ".zip",
    ".py",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".gif",
    ".mp4",
    ".mov",
    ".pdf",
    ".docx",
    ".xlsx",
    ".pptx",
    ".log",
    ".bak",
}

AGENT_ORDER = [
    "branding_agent",
    "strategy_agent",
    "psychology_agent",
    "cinematic_director_agent",
    "content_agent",
    "instagram_audit_agent",
    "sales_agent",
]

ENTITY_CORE_ORDER = [
    "core/brand_philosophy.md",
    "core/entity_framework.md",
    "core/identity_system.md",
    "core/operating_system.md",
    "core/positioning.md",
    "core/storytelling_framework.md",
    "core/tone_of_voice.md",
    "core/visual_language.md",
    "core/ai_behavior.md",
]

KNOWLEDGE_PRIORITY_KEYWORDS = [
    "identity",
    "perception",
    "visual",
    "luxury",
    "premium",
    "storytelling",
    "voice",
    "archetype",
    "emotion",
    "cinematic",
    "authority",
]


# ============================================================
# SAFETY HELPERS
# ============================================================

def normalize_text(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"\n{4,}", "\n\n\n", text)
    return text.strip()


def safe_relative(path: Path, base: Path) -> str:
    return path.resolve().relative_to(base.resolve()).as_posix()


def is_within(path: Path, base: Path) -> bool:
    try:
        path.resolve().relative_to(base.resolve())
        return True
    except ValueError:
        return False


def is_allowed_file(path: Path, allowed_root: Path) -> bool:
    if not path.is_file():
        return False

    if not is_within(path, allowed_root):
        return False

    parts = set(path.parts)

    if parts.intersection(BLOCKED_PARTS):
        return False

    lower_name = path.name.lower()

    if lower_name.startswith("."):
        return False

    if path.suffix.lower() not in ALLOWED_EXTENSIONS:
        return False

    if path.suffix.lower() in BLOCKED_SUFFIXES:
        return False

    for suffix in BLOCKED_SUFFIXES:
        if lower_name.endswith(suffix):
            return False

    return True


def read_limited(path: Path) -> str:
    text = path.read_text(encoding="utf-8", errors="replace")
    text = normalize_text(text)

    if len(text) > MAX_FILE_CHARS:
        text = text[:MAX_FILE_CHARS].rstrip() + "\n\n[TRUNCATED FOR CHATGPT CONTEXT]"

    return text


def section(title: str, content: str = "") -> str:
    if content:
        return f"\n\n# {title}\n\n{content.strip()}\n"
    return f"\n\n# {title}\n"


def subsection(title: str, content: str = "") -> str:
    if content:
        return f"\n\n## {title}\n\n{content.strip()}\n"
    return f"\n\n## {title}\n"


# ============================================================
# COLLECT ENTITY BIBLE
# ============================================================

def collect_entity_core_files() -> list[Path]:
    files = []

    for relative in ENTITY_CORE_ORDER:
        path = ENTITY_BIBLE_DIR / relative
        if path.exists() and is_allowed_file(path, ENTITY_BIBLE_DIR):
            files.append(path)

    return files


def collect_entity_knowledge_files() -> list[Path]:
    if not ENTITY_BIBLE_DIR.exists():
        return []

    all_files = [
        path
        for path in ENTITY_BIBLE_DIR.rglob("*")
        if is_allowed_file(path, ENTITY_BIBLE_DIR)
    ]

    core_files = set(collect_entity_core_files())

    knowledge_files = []
    for path in all_files:
        if path in core_files:
            continue

        relative = safe_relative(path, ENTITY_BIBLE_DIR).lower()

        if any(keyword in relative for keyword in KNOWLEDGE_PRIORITY_KEYWORDS):
            knowledge_files.append(path)

    return sorted(knowledge_files, key=lambda p: safe_relative(p, ENTITY_BIBLE_DIR))[:35]


def render_entity_bible_section(report: dict) -> str:
    chunks = []

    chunks.append(section("ENTITY BIBLE — OPERATIVE SUMMARY"))

    chunks.append(
        """Este bloque resume la lógica central de Brand Experience OS.

Usar como principios obligatorios:
- La identidad viene antes del diseño.
- La percepción viene antes de la venta.
- La marca debe interpretarse como entidad viva.
- La estética no es decoración: es lenguaje emocional.
- El storytelling no es contenido: es transformación de percepción.
- La coherencia visual, verbal y comercial construye valor.
- Todo output debe elevar claridad, presencia, deseo y confianza.
"""
    )

    core_files = collect_entity_core_files()
    knowledge_files = collect_entity_knowledge_files()

    report["entity_core_files"] = [safe_relative(p, PROJECT_ROOT) for p in core_files]
    report["entity_knowledge_files"] = [safe_relative(p, PROJECT_ROOT) for p in knowledge_files]

    if core_files:
        chunks.append(subsection("Core Files"))
        for path in core_files:
            rel = safe_relative(path, ENTITY_BIBLE_DIR)
            chunks.append(f"\n\n### ENTITY_BIBLE_FILE: {rel}\n\n")
            chunks.append(read_limited(path))

    if knowledge_files:
        chunks.append(subsection("Knowledge Signals"))
        for path in knowledge_files:
            rel = safe_relative(path, ENTITY_BIBLE_DIR)
            chunks.append(f"\n\n### ENTITY_BIBLE_FILE: {rel}\n\n")
            chunks.append(read_limited(path))

    return "\n".join(chunks)


# ============================================================
# COLLECT AGENTS
# ============================================================

def collect_agent_files(agent_name: str) -> list[Path]:
    agent_dir = AGENTS_DIR / agent_name

    if not agent_dir.exists():
        return []

    priority_names = [
        "identity.md",
        "mission.md",
        "behavior.md",
        "context_rules.md",
        "entity_interpretation.md",
        "perception_model.md",
        "visual_psychology.md",
        "workflow.md",
        "output_structure.md",
        "prompts.md",
        "forbidden_patterns.md",
        "examples.md",
        "memory.md",
    ]

    files = []

    for name in priority_names:
        path = agent_dir / name
        if path.exists() and is_allowed_file(path, agent_dir):
            files.append(path)

    extra_files = [
        path
        for path in agent_dir.glob("*.md")
        if path not in files and is_allowed_file(path, agent_dir)
    ]

    files.extend(sorted(extra_files, key=lambda p: p.name))

    return files


def render_agents_section(report: dict) -> str:
    chunks = []

    chunks.append(section("AGENT SYSTEM"))

    chunks.append(
        """Brand Experience OS trabaja como un sistema multiagente.

En ChatGPT, no ejecutes estos agentes como procesos separados.
Simula su razonamiento en capas y produce una síntesis integrada.

Los agentes principales son:
1. branding_agent
2. strategy_agent
3. psychology_agent
4. cinematic_director_agent
5. content_agent
6. instagram_audit_agent
7. sales_agent
"""
    )

    report["agents"] = {}

    for agent_name in AGENT_ORDER:
        files = collect_agent_files(agent_name)
        report["agents"][agent_name] = [safe_relative(p, PROJECT_ROOT) for p in files]

        chunks.append(subsection(f"AGENT: {agent_name}"))

        if not files:
            chunks.append("No files found for this agent.")
            continue

        for path in files:
            rel = safe_relative(path, AGENTS_DIR / agent_name)
            chunks.append(f"\n\n### AGENT_FILE: {agent_name}/{rel}\n\n")
            chunks.append(read_limited(path))

    return "\n".join(chunks)


# ============================================================
# FRAMEWORK OPERATING MODE
# ============================================================

def render_framework_mode() -> str:
    return section(
        "FRAMEWORK OPERATING MODE",
        """Cuando recibas contexto de un cliente, ejecuta Brand Experience OS con este pipeline:

## 1. INTAKE NORMALIZATION

Ordena toda la información recibida:
- nombre del cliente
- industria
- Instagram / links
- contexto de negocio
- transcripción o notas
- materiales actuales
- objetivos
- problemas explícitos
- señales implícitas

## 2. CURRENT DIAGNOSIS

Diagnostica:
- percepción actual
- claridad estratégica
- coherencia visual
- narrativa
- diferenciación
- confianza
- preparación comercial
- debilidades de Instagram / presencia digital
- oportunidades rápidas

## 3. BRAND ESSENCE

Define:
- entidad emergente
- energía emocional
- esencia
- propósito
- promesa
- personalidad
- diferenciación
- territorio simbólico
- percepción deseada

## 4. BRAND TRANSFORMATION

Transforma el diagnóstico en dirección:
- qué debe dejar de parecer
- qué debe empezar a parecer
- cómo elevar percepción premium
- qué código visual debe construir
- qué tono verbal debe adoptar
- qué narrativa debe instalar

## 5. CONTENT STRATEGY

Definir:
- pilares de contenido
- hooks
- formatos
- reels
- posts
- stories
- prueba social
- autoridad
- deseo
- conversión

## 6. FINAL DELIVERABLES

Generar:
- Brand Analysis
- Identity Patch
- Entity Bible del cliente
- Visual Universe
- Content Strategy
- Prompt Pack
- Action Plan
- Commercial Direction
""",
    )


def render_output_contract() -> str:
    return section(
        "OUTPUT CONTRACT",
        """Toda respuesta de framework debe entregar una salida clara y accionable.

Usa esta estructura:

## 1. Executive Diagnosis

- estado actual
- brecha principal
- oportunidad de mayor impacto
- decisión estratégica recomendada

## 2. Scorecard

Evaluar de 0 a 100:
- claridad estratégica
- diferenciación
- percepción premium
- coherencia visual
- potencia narrativa
- preparación comercial
- preparación para ejecutar

## 3. Entity Reading

- qué entidad está emergiendo
- energía emocional
- percepción actual
- percepción deseada
- tensión de identidad

## 4. Brand Core

- esencia
- propósito
- promesa
- personalidad
- diferenciadores
- valores
- territorio simbólico

## 5. Perception Strategy

- qué debe dejar de parecer
- qué debe empezar a parecer
- señales de confianza
- señales de autoridad
- señales premium

## 6. Visual Direction

- atmósfera
- paleta sugerida
- tipografía
- composición
- fotografía
- iluminación
- referencias conceptuales
- qué evitar

## 7. Tone of Brand

- voz
- personalidad verbal
- palabras que sí usa
- palabras que evita
- frases modelo
- tono Instagram
- tono WhatsApp
- tono comercial

## 8. Storytelling

- narrativa central
- conflicto
- transformación
- pilares emocionales
- mensajes clave
- manifiesto corto

## 9. Content Strategy

- pilares
- formatos
- ideas de reels
- ideas de posts
- secuencia de contenido

## 10. Sales Direction

- oferta
- beneficios
- objeciones
- CTA
- secuencia comercial
- propuesta de valor

## 11. Prompt Pack Seeds

Crear semillas para:
- logo system
- color palette
- tone of brand
- brand identity board
- storytelling board
- visual universe board
- Instagram feed
- commercial proposal

## 12. Next Sprint

- próximas acciones
- orden de producción
- riesgos
- criterios de éxito
""",
    )


def render_visual_generation_mode() -> str:
    return section(
        "VISUAL GENERATION MODE",
        """Usar este modo cuando se pidan logos, paletas, boards, piezas visuales o prompts para herramientas visuales.

## Regla principal

No diseñar antes de interpretar.

Primero interpretar:
- entidad de marca
- energía emocional
- percepción deseada
- promesa
- público
- nivel premium
- símbolos posibles
- códigos visuales
- riesgos de cliché

## Proceso obligatorio

1. Interpretación estratégica
2. Dirección visual
3. Rutas creativas
4. Sistema de logo
5. Paleta
6. Tipografía
7. Aplicaciones
8. Board final

## Para logos

Proponer primero 3 rutas:
- concepto
- símbolo
- emoción
- estilo tipográfico
- paleta
- riesgos
- cuándo usarla

Evitar:
- íconos turísticos obvios
- logos genéricos de agencia
- símbolos cliché
- demasiados elementos
- tipografías ilegibles
- estética barata o stock

## Para Brand Identity Board

Debe ser:
- horizontal 16:9
- premium
- editorial
- modular
- con jerarquía fuerte
- con aire visual
- con mockups
- con módulos de distinta escala

Debe incluir:
- logo principal
- variantes
- paleta
- tipografías
- tono
- aplicaciones digitales
- feed Instagram
- propuesta comercial
- beneficios
- footer conceptual

Evitar:
- cards simples repetidas
- layout plano
- presentación corporativa genérica
- saturación visual
- estética stock

## Negative Prompt Base

Evitar:
generic template, stock design, cluttered composition, low contrast, cheap tourism logo, overused icons, illegible typography, inconsistent palette, childish style, random gradients, too many effects, corporate generic presentation.
""",
    )


def render_master_prompt() -> str:
    return section(
        "MASTER PROMPT TO RUN THE FRAMEWORK",
        """Usa este prompt cuando pegues o subas este archivo en ChatGPT junto con el contexto del cliente.

---

Actúa como Brand Experience OS.

Usa el archivo BRAND_EXPERIENCE_OS_CHATGPT_CONTEXT.dm como sistema operativo creativo, estratégico y perceptual.

Tu tarea es analizar el cliente usando:
- Entity Bible
- sistema de agentes
- framework de análisis
- reglas de percepción
- modo de generación visual
- output contract

No respondas como asistente genérico.
No hagas marketing superficial.
No inventes información no provista.
Cuando falten datos, indícalo como supuesto o vacío de información.

Analiza el cliente como una entidad viva con:
- identidad
- energía
- percepción
- narrativa
- estética
- tono
- potencial comercial

Ejecuta internamente estos agentes:
- branding_agent
- strategy_agent
- psychology_agent
- cinematic_director_agent
- content_agent
- instagram_audit_agent
- sales_agent

Luego entrega una síntesis final con esta estructura:

1. Executive Diagnosis
2. Scorecard
3. Entity Reading
4. Brand Core
5. Perception Strategy
6. Visual Direction
7. Tone of Brand
8. Storytelling
9. Content Strategy
10. Sales Direction
11. Prompt Pack Seeds
12. Next Sprint

Ahora espera el contexto del cliente.
"""
    )


# ============================================================
# BUILD DM
# ============================================================

def trim_to_total_limit(text: str) -> str:
    if len(text) <= MAX_TOTAL_CHARS:
        return text

    return (
        text[:MAX_TOTAL_CHARS].rstrip()
        + "\n\n[MASTER CONTEXT TRUNCATED TO FIT MAX_TOTAL_CHARS]\n"
    )


def build_dm() -> tuple[str, dict]:
    report = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "project_root": str(PROJECT_ROOT),
        "output": str(OUTPUT_DM),
        "max_file_chars": MAX_FILE_CHARS,
        "max_total_chars": MAX_TOTAL_CHARS,
    }

    chunks = []

    chunks.append(
        """# BRAND EXPERIENCE OS — CHATGPT MASTER CONTEXT

Este archivo es el contexto maestro portable de Brand Experience OS.

Uso recomendado:
1. Subir o pegar este archivo en ChatGPT.
2. Subir o pegar identity_cliente.md del cliente.
3. Pedir: “Ejecuta el framework completo para este cliente usando Brand Experience OS”.
4. Usar el resultado para generar Master, Prompt Pack, Visual Boards y dirección creativa.

Este archivo no contiene datos privados de clientes.
Solo contiene el sistema operativo, la Biblia y los agentes.
"""
    )

    chunks.append(
        section(
            "SYSTEM IDENTITY",
            """Brand Experience OS es un sistema de inteligencia creativa para revelar, estructurar y expandir identidades de marca.

No funciona como agencia tradicional.
Funciona como un sistema operativo de percepción, identidad, storytelling, dirección visual y estrategia.

Su objetivo:
transformar marcas con señales dispersas en entidades coherentes, memorables y comercialmente accionables.
""",
        )
    )

    chunks.append(render_entity_bible_section(report))
    chunks.append(render_agents_section(report))
    chunks.append(render_framework_mode())
    chunks.append(render_output_contract())
    chunks.append(render_visual_generation_mode())
    chunks.append(render_master_prompt())

    final_text = normalize_text("\n\n".join(chunks))
    final_text = trim_to_total_limit(final_text)

    report["final_chars"] = len(final_text)
    report["truncated"] = "[MASTER CONTEXT TRUNCATED" in final_text

    return final_text, report


def write_report(report: dict) -> None:
    DOCS_DIR.mkdir(parents=True, exist_ok=True)

    OUTPUT_JSON_REPORT.write_text(
        json.dumps(report, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    lines = [
        "# BRAND EXPERIENCE OS CHATGPT CONTEXT REPORT",
        "",
        f"Generated at: {report['generated_at']}",
        "",
        f"- Output: `{OUTPUT_DM.relative_to(PROJECT_ROOT)}`",
        f"- Final chars: `{report['final_chars']}`",
        f"- Truncated: `{report['truncated']}`",
        "",
        "## Entity Core Files",
        "",
    ]

    for item in report.get("entity_core_files", []):
        lines.append(f"- `{item}`")

    lines.append("")
    lines.append("## Entity Knowledge Files")
    lines.append("")

    for item in report.get("entity_knowledge_files", []):
        lines.append(f"- `{item}`")

    lines.append("")
    lines.append("## Agents")
    lines.append("")

    for agent, files in report.get("agents", {}).items():
        lines.append(f"### {agent}")
        for item in files:
            lines.append(f"- `{item}`")
        lines.append("")

    OUTPUT_MD_REPORT.write_text("\n".join(lines), encoding="utf-8")

    print("Report written:")
    print(f"- {OUTPUT_JSON_REPORT}")
    print(f"- {OUTPUT_MD_REPORT}")


def main() -> None:
    if not BACKEND_DIR.exists():
        raise FileNotFoundError(f"Backend folder not found: {BACKEND_DIR}")

    if not ENTITY_BIBLE_DIR.exists():
        raise FileNotFoundError(f"Entity Bible folder not found: {ENTITY_BIBLE_DIR}")

    if not AGENTS_DIR.exists():
        raise FileNotFoundError(f"Agents folder not found: {AGENTS_DIR}")

    DOCS_DIR.mkdir(parents=True, exist_ok=True)

    dm_text, report = build_dm()

    OUTPUT_DM.write_text(dm_text, encoding="utf-8")
    write_report(report)

    print("")
    print("Generated:")
    print(f"- {OUTPUT_DM}")
    print("")
    print("Use this file with:")
    print("- identity_cliente.md")
    print("- manual client context")
    print("- ChatGPT")
    print("")
    print("Suggested prompt:")
    print(
        "Lee BRAND_EXPERIENCE_OS_CHATGPT_CONTEXT.dm como sistema operativo. "
        "Luego lee identity_cliente.md como contexto del cliente y ejecuta el framework completo."
    )


if __name__ == "__main__":
    main()