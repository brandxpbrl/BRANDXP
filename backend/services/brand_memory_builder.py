import json
import re
import shutil
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BASE_DIR.parent
CLIENTS_ROOT = PROJECT_ROOT / "BRAND_EXPERIENCE" / "03_CLIENT_SYSTEM" / "CLIENTES_ACTIVOS"

EXPECTED_FILES = {
    "identity_cliente.md": "01_IDENTITY",
    "brand_memory_core_generator.py": "00_SYSTEM",
    "visual_generation_mode.md": "00_SYSTEM",
    "full_brand_experience_prompt_pack.md": "00_SYSTEM",
    "logo_system_prompt.md": "04_PROMPTS",
    "color_palette_prompt.md": "04_PROMPTS",
    "tone_of_brand_prompt.md": "04_PROMPTS",
    "storytelling_board_prompt.md": "04_PROMPTS",
    "visual_universe_board_prompt.md": "04_PROMPTS",
    "brand_identity_board_prompt.md": "04_PROMPTS",
}

FOLDER_STRUCTURE = [
    "00_SYSTEM",
    "01_IDENTITY",
    "02_MEMORY",
    "02_MEMORY/modules",
    "03_OUTPUTS",
    "03_OUTPUTS/boards",
    "03_OUTPUTS/logo_system",
    "03_OUTPUTS/palettes",
    "03_OUTPUTS/storytelling",
    "03_OUTPUTS/visual_universe",
    "03_OUTPUTS/content",
    "04_PROMPTS",
    "05_ASSETS",
    "05_ASSETS/logos",
    "05_ASSETS/images",
    "05_ASSETS/references",
    "05_ASSETS/mockups",
    "06_EXPORTS",
    "06_EXPORTS/chatgpt",
    "06_EXPORTS/gemini",
    "06_EXPORTS/claude",
    "06_EXPORTS/n8n",
]


def slugify(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9áéíóúñü]+", "_", text)
    return text.strip("_") or "cliente"


def _read_file(path: Path) -> str:
    if path.is_file():
        try:
            return path.read_text(encoding="utf-8", errors="ignore").strip()
        except OSError:
            return ""
    return ""


def _write_file(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.strip() + "\n", encoding="utf-8")


def _copy_or_move(src: Path, dst: Path, mode: str):
    if not src.is_file():
        return False

    dst.parent.mkdir(parents=True, exist_ok=True)

    if dst.exists():
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup = dst.with_name(f"{dst.stem}_backup_{timestamp}{dst.suffix}")
        try:
            dst.rename(backup)
        except OSError:
            pass

    if mode == "move":
        try:
            shutil.move(str(src), str(dst))
        except OSError:
            shutil.copy2(str(src), str(dst))
            try:
                src.unlink()
            except OSError:
                pass
    else:
        shutil.copy2(str(src), str(dst))

    return True


def _extract_section(text: str, title: str) -> str:
    pattern = rf"(##+\s+[^#\n]*{re.escape(title)}.*?)(?=\n##+\s+|\Z)"
    match = re.search(pattern, text, flags=re.IGNORECASE | re.DOTALL)
    return match.group(1).strip() if match else ""


def _detect_brand_name(identity_text: str, fallback: str) -> str:
    match = re.search(r"-\s*Nombre:\s*(.+)", identity_text, flags=re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return fallback


def find_source_file(client_path: Path, filename: str) -> Path or None:
    candidates = [
        client_path / filename,
        client_path / "05_ENTREGAS" / "prompt_pack" / filename,
        client_path / "prompt_pack" / filename,
        client_path / "05_ENTREGAS" / filename,
        client_path / "01_IDENTITY" / filename,
        client_path / "00_SYSTEM" / filename,
        client_path / "04_PROMPTS" / filename,
    ]
    for candidate in candidates:
        if candidate.is_file():
            return candidate
    return None


def generate_entity_core(identity: str) -> str:
    return f"""# 01_ENTITY_CORE

## Función
Define cómo piensa, siente y debe ser percibida la marca antes de cualquier pieza visual, narrativa o comercial.

{_extract_section(identity, "Lectura de entidad")}

{_extract_section(identity, "Nucleo de marca")}

{_extract_section(identity, "Publico ideal")}

{_extract_section(identity, "Objetivo creativo")}

## Regla principal
La marca no necesita sonar más fuerte. Necesita transmitir con más precisión.

## Principio rector
El valor debe sentirse antes de explicarse.
"""


def generate_visual_dna(identity: str, color_prompt: str, visual_prompt: str) -> str:
    return f"""# 02_VISUAL_DNA

## Función
Define cómo se ve, se siente y se organiza visualmente la marca.

{_extract_section(identity, "Direccion visual")}

## Reglas visuales
- Un foco claro por pieza.
- Espacio negativo para aumentar valor percibido.
- Jerarquía antes que decoración.
- Contraste como guía de atención.
- Composición cinematográfica.
- Evitar ruido, plantilla genérica y exceso de efectos.

## Prompt operativo de paleta
{color_prompt}

## Prompt operativo de universo visual
{visual_prompt}
"""


def generate_symbol_system(identity: str, logo_prompt: str) -> str:
    return f"""# 03_SYMBOL_SYSTEM

## Función
Define memorabilidad visual mediante logo, símbolo, geometría e iconografía.

{_extract_section(identity, "Logo System Direction")}

## Reglas
- Simple.
- Memorable.
- Legible en tamaño pequeño.
- Funcional en fondo claro y oscuro.
- Adaptable a favicon, perfil social, marca de agua y sistema visual.

## Prompt operativo de logo
{logo_prompt}
"""


def generate_typography_dna() -> str:
    return """# 04_TYPOGRAPHY_DNA

## Función
Define el comportamiento tipográfico de la marca.

## Principios
- Claridad.
- Autoridad.
- Precisión.
- Sensación editorial premium.
- Legibilidad antes que ornamento.

## Jerarquía
- H1: idea dominante.
- H2: promesa o insight.
- Body: explicación clara.
- Microcopy: CTA, prueba o dirección.

## Reglas
- Usar contraste entre pesos.
- Evitar tipografías decorativas sin función.
- Mantener aire.
- No saturar una pieza con demasiados estilos.
"""


def generate_story_engine(identity: str, storytelling_prompt: str, tone_prompt: str) -> str:
    return f"""# 05_STORY_ENGINE

## Función
Transforma tensión en deseo, prueba y acción.

{_extract_section(identity, "Storytelling")}

{_extract_section(identity, "Tono de voz")}

## Framework narrativo
1. Tensión.
2. Claridad.
3. Transformación.
4. Prueba.
5. Acción.

## Prompt operativo de storytelling
{storytelling_prompt}

## Prompt operativo de tono
{tone_prompt}
"""


def generate_content_engine(identity: str) -> str:
    return f"""# 06_CONTENT_ENGINE

## Función
Convierte la identidad en contenido social, comercial y narrativo.

{_extract_section(identity, "Contenido")}

## Pilares
- Autoridad.
- Deseo.
- Prueba.
- Conversión.

## Estructura de carrusel
1. Promesa.
2. Problema.
3. Insight.
4. Sistema.
5. Prueba.
6. Beneficio.
7. CTA.

## Estructura de reel
1. Hook.
2. Tensión.
3. Transformación.
4. Prueba.
5. CTA.
"""


def generate_motion_system() -> str:
    return """# 07_MOTION_SYSTEM

## Función
Define cómo se mueve la marca.

## Principios
- Movimiento preciso.
- Ritmo cinematográfico.
- Transiciones limpias.
- Cámara con intención.
- Tipografía con timing editorial.
- Glow controlado.
- Profundidad visual.

## Evitar
- Efectos exagerados.
- Movimiento caótico.
- Zooms sin criterio.
- Transiciones infantiles.
"""


def generate_ai_restrictions(visual_mode: str) -> str:
    return f"""# 08_AI_RESTRICTIONS

## Función
Evita que la IA rompa la identidad.

## Restricciones
- No diseñar antes de interpretar.
- No generar estética sin estrategia.
- No usar plantillas genéricas.
- No saturar.
- No usar recursos stock.
- No confundir premium con exceso.
- No perder jerarquía.
- No perder legibilidad.

## Negative prompt base
- generic template
- stock design
- cluttered composition
- low contrast
- cheap logo
- overused icons
- illegible typography
- inconsistent palette
- childish style
- random gradients
- too many effects
- flat corporate layout
- visual noise

## Visual Generation Mode
{visual_mode}
"""


def generate_prompt_engine(prompts: dict) -> str:
    prompt_blocks = []
    for name, content in prompts.items():
        if content.strip():
            prompt_blocks.append(f"## {name}\n\n{content}")

    return f"""# 09_PROMPT_ENGINE

## Función
Centraliza los prompts operativos de la marca.

## Orden correcto de uso
1. identity_cliente.md
2. BRAND_MEMORY_CORE_MASTER.md
3. prompt específico del output
4. rutas creativas
5. variaciones controladas
6. selección de dirección
7. output final

## Prompt maestro
Actúa como director creativo senior, estratega de marca, diseñador de identidad visual premium y especialista en storytelling. Usa el BRAND MEMORY CORE como memoria persistente. Antes de crear cualquier pieza, interpreta entidad, percepción, tensión, promesa, territorio visual y objetivo comercial.

---

{chr(10).join(prompt_blocks)}
"""


def generate_master_memory(brand_name: str, modules: dict) -> str:
    joined = "\n\n---\n\n".join(modules.values())
    return f"""# BRAND MEMORY CORE — {brand_name}

Generado: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

## Propósito
Este documento funciona como memoria persistente de marca para IA.

Debe usarse antes de generar:
- logos
- paletas
- storytelling
- boards
- contenido
- reels
- campañas
- propuestas comerciales
- landing pages
- sistemas visuales

## Regla principal
La IA no debe crear piezas sueltas. Debe operar como la marca.

---

{joined}
"""


def generate_json_memory(brand_name: str, modules: dict, source_status: dict) -> dict:
    return {
        "brand_name": brand_name,
        "generated_at": datetime.now().isoformat(),
        "system": "Brand Experience OS",
        "priority": "01_BRAND_MEMORY_CORE",
        "purpose": "Persistent AI-readable brand memory.",
        "primary_rule": "Do not design before interpreting the brand entity.",
        "brand_logic": {
            "perception": "Value must be felt before it is explained.",
            "visual_goal": "Increase clarity, authority, desire, trust and memorability.",
            "narrative": "Tension → Transformation → Proof → Action.",
            "commercial_goal": "Convert attention into trust and action."
        },
        "modules": list(modules.keys()),
        "source_files": source_status
    }


def generate_chatgpt_export(brand_name: str) -> str:
    return f"""# CHATGPT INSTRUCTIONS — {brand_name}

Usa primero:
1. 01_IDENTITY/identity_cliente.md
2. 02_MEMORY/BRAND_MEMORY_CORE_MASTER.md

Reglas:
- No diseñes antes de interpretar.
- Propón 2 o 3 rutas creativas antes del resultado final.
- Mantén coherencia con la memoria de marca.
- Evita outputs genéricos.
- Justifica cada decisión visual, narrativa o comercial.

Rol:
Actúa como director creativo senior, estratega de marca, diseñador de identidad visual premium y especialista en storytelling.
"""


def generate_gemini_export(brand_name: str) -> str:
    return f"""# GEMINI CONTEXT — {brand_name}

Carga este contexto como conocimiento base del cliente.

Archivos principales:
- identity_cliente.md
- BRAND_MEMORY_CORE_MASTER.md
- brand_memory_core.json

Objetivo:
Hacer que Gemini entienda la marca como entidad, no como un conjunto de prompts.

Instrucción:
Antes de crear contenido, interpreta la entidad, percepción, tensión, promesa y objetivo comercial.
"""


def generate_claude_export(brand_name: str) -> str:
    return f"""# CLAUDE PROJECT INSTRUCTIONS — {brand_name}

Use this brand memory as the persistent strategic context.

Core behavior:
- Interpret before creating.
- Prioritize perception over decoration.
- Maintain strategic coherence.
- Avoid generic creative outputs.
- Use narrative transformation: tension → transformation → proof → action.
"""


def generate_n8n_export(brand_name: str) -> dict:
    return {
        "client": brand_name,
        "workflow_context": "Brand Memory Core",
        "recommended_files": [
            "01_IDENTITY/identity_cliente.md",
            "02_MEMORY/BRAND_MEMORY_CORE_MASTER.md",
            "02_MEMORY/brand_memory_core.json"
        ],
        "agent_instruction": "Use brand memory before generating any visual, copy, content, funnel, campaign or commercial output.",
        "modules": {
            "identity": "01_IDENTITY",
            "memory": "02_MEMORY",
            "prompts": "04_PROMPTS",
            "assets": "05_ASSETS",
            "exports": "06_EXPORTS"
        }
    }


def resolve_client_path(client_name: str) -> Path:
    slug = slugify(client_name)
    path = CLIENTS_ROOT / slug
    if path.exists():
        return path
    path = CLIENTS_ROOT / client_name
    if path.exists():
        return path
    if CLIENTS_ROOT.exists():
        for candidate in CLIENTS_ROOT.iterdir():
            if candidate.is_dir():
                if candidate.name.casefold() == client_name.casefold():
                    return candidate
                if slugify(candidate.name) == slug:
                    return candidate
    return CLIENTS_ROOT / slug


def build_brand_memory_core(client_name: str, mode: str = "copy") -> dict:
    client_path = resolve_client_path(client_name)
    client_slug = slugify(client_path.name)

    if not client_path.exists():
        raise FileNotFoundError(f"Client folder not found: {client_path}")

    # Build folder structure
    for folder in FOLDER_STRUCTURE:
        (client_path / folder).mkdir(parents=True, exist_ok=True)

    # Locate and copy base files
    source_status = {}
    copied_files = []

    for filename, target_folder in EXPECTED_FILES.items():
        src = find_source_file(client_path, filename)
        dst = client_path / target_folder / filename
        exists = src is not None

        source_status[filename] = exists
        if exists:
            # Avoid copying onto itself if they are already in the target place
            if src.resolve() != dst.resolve():
                _copy_or_move(src, dst, mode)
                copied_files.append(dst.relative_to(client_path).as_posix())
            else:
                copied_files.append(dst.relative_to(client_path).as_posix())

    # Read consolidated identity and visual configurations
    identity = _read_file(client_path / "01_IDENTITY" / "identity_cliente.md")
    visual_mode = _read_file(client_path / "00_SYSTEM" / "visual_generation_mode.md")

    if not identity:
        raise ValueError("Cannot build Brand Memory Core: identity_cliente.md is empty or missing.")

    brand_display_name = _detect_brand_name(identity, client_name)

    # Load prompts
    prompts = {
        "logo_system_prompt": _read_file(client_path / "04_PROMPTS" / "logo_system_prompt.md"),
        "color_palette_prompt": _read_file(client_path / "04_PROMPTS" / "color_palette_prompt.md"),
        "tone_of_brand_prompt": _read_file(client_path / "04_PROMPTS" / "tone_of_brand_prompt.md"),
        "storytelling_board_prompt": _read_file(client_path / "04_PROMPTS" / "storytelling_board_prompt.md"),
        "visual_universe_board_prompt": _read_file(client_path / "04_PROMPTS" / "visual_universe_board_prompt.md"),
        "brand_identity_board_prompt": _read_file(client_path / "04_PROMPTS" / "brand_identity_board_prompt.md"),
        "full_brand_experience_prompt_pack": _read_file(client_path / "00_SYSTEM" / "full_brand_experience_prompt_pack.md"),
    }

    modules = {
        "01_ENTITY_CORE": generate_entity_core(identity),
        "02_VISUAL_DNA": generate_visual_dna(
            identity,
            prompts["color_palette_prompt"],
            prompts["visual_universe_board_prompt"]
        ),
        "03_SYMBOL_SYSTEM": generate_symbol_system(identity, prompts["logo_system_prompt"]),
        "04_TYPOGRAPHY_DNA": generate_typography_dna(),
        "05_STORY_ENGINE": generate_story_engine(
            identity,
            prompts["storytelling_board_prompt"],
            prompts["tone_of_brand_prompt"]
        ),
        "06_CONTENT_ENGINE": generate_content_engine(identity),
        "07_MOTION_SYSTEM": generate_motion_system(),
        "08_AI_RESTRICTIONS": generate_ai_restrictions(visual_mode),
        "09_PROMPT_ENGINE": generate_prompt_engine(prompts),
    }

    # Write modules
    for module_name, content in modules.items():
        _write_file(client_path / "02_MEMORY" / "modules" / f"{module_name}.md", content)

    # Write Master Memory Core
    master_memory = generate_master_memory(brand_display_name, modules)
    _write_file(client_path / "02_MEMORY" / "BRAND_MEMORY_CORE_MASTER.md", master_memory)

    # Write JSON Memory Core
    memory_json = generate_json_memory(brand_display_name, modules, source_status)
    _write_file(
        client_path / "02_MEMORY" / "brand_memory_core.json",
        json.dumps(memory_json, ensure_ascii=False, indent=2)
    )

    # Write exports
    _write_file(client_path / "06_EXPORTS" / "chatgpt" / "chatgpt_instructions.md", generate_chatgpt_export(brand_display_name))
    _write_file(client_path / "06_EXPORTS" / "gemini" / "gemini_context.md", generate_gemini_export(brand_display_name))
    _write_file(client_path / "06_EXPORTS" / "claude" / "claude_project_instructions.md", generate_claude_export(brand_display_name))
    _write_file(
        client_path / "06_EXPORTS" / "n8n" / "n8n_brand_memory_context.json",
        json.dumps(generate_n8n_export(brand_display_name), ensure_ascii=False, indent=2)
    )

    # Write README
    readme = f"""# CLIENTE — {brand_display_name}

Estructura creada automáticamente por Brand Experience OS.

## Carpetas principales
- `00_SYSTEM/` (Reglas generales del sistema y prompts globales)
- `01_IDENTITY/` (Identidad maestra del cliente)
- `02_MEMORY/` (Brand Memory Core - Memoria persistente del cliente)
- `03_OUTPUTS/` (Lugar donde guardar resultados de IA)
- `04_PROMPTS/` (Prompts de tareas específicas)
- `05_ASSETS/` (Logos, imágenes, mockups)
- `06_EXPORTS/` (Model-specific wrappers)
"""
    _write_file(client_path / "README.md", readme)

    created_files = [
        "02_MEMORY/BRAND_MEMORY_CORE_MASTER.md",
        "02_MEMORY/brand_memory_core.json",
        "README.md",
        "06_EXPORTS/chatgpt/chatgpt_instructions.md",
        "06_EXPORTS/gemini/gemini_context.md",
        "06_EXPORTS/claude/claude_project_instructions.md",
        "06_EXPORTS/n8n/n8n_brand_memory_context.json",
    ] + [f"02_MEMORY/modules/{m}.md" for m in modules]

    return {
        "client": client_name,
        "brand_name": brand_display_name,
        "base_directory": "02_MEMORY",
        "created_files": created_files,
        "copied_files": copied_files,
        "source_status": source_status
    }
