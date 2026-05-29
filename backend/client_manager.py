import json
import re
from datetime import datetime
from pathlib import Path

from entity_bible_loader import load_entity_bible_context, load_entity_bible_for_master, load_entity_bible_for_visual_boards

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
CLIENTS_ROOT = PROJECT_ROOT / "BRAND_EXPERIENCE" / "03_CLIENT_SYSTEM" / "CLIENTES_ACTIVOS"
MAX_UPLOAD_BYTES = 10 * 1024 * 1024
UPLOAD_CHUNK_BYTES = 1024 * 1024
ALLOWED_UPLOAD_EXTENSIONS = {
    ".csv",
    ".docx",
    ".jpeg",
    ".jpg",
    ".json",
    ".md",
    ".pdf",
    ".png",
    ".txt",
    ".webp",
}
DELIVERABLES_BASE_FOLDER = "05_ENTREGAS"
MAX_DELIVERABLE_ITEMS = 200
MAX_DELIVERABLE_DEPTH = 3
MAX_DELIVERABLE_CONTENT_BYTES = 256 * 1024
ALLOWED_DELIVERABLE_CONTENT_EXTENSIONS = {
    ".json",
    ".md",
    ".txt",
}
ALLOWED_DELIVERABLE_ASSET_EXTENSIONS = {
    ".gif",
    ".jpeg",
    ".jpg",
    ".png",
    ".webp",
}
LATEST_ANALYSIS_FOLDER = "01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience"
FINAL_DELIVERABLE_FILES = {
    "brand_analysis.md": "Brand Analysis",
    "identity_patch.md": "Identity Patch",
    "entity_bible.md": "Entity Bible",
    "visual_universe.md": "Visual Universe",
    "content_strategy.md": "Content Strategy",
    "ai_prompts.md": "AI Prompts",
    "action_plan.md": "Action Plan",
}
VISUAL_BOARD_FILES = {
    "brand_identity_board": "Brand Identity Board",
    "storytelling_strategy_board": "Storytelling Strategy Board",
    "visual_universe_board": "Visual Universe Board",
}
VISUALS_BASE_FOLDER = "05_ENTREGAS/visuals"
BOARD_SPECS_BASE_FOLDER = "05_ENTREGAS/board_specs"
VISUAL_BOARD_IMAGE_SIZE = (1920, 1080)
MASTER_DELIVERABLE_FILE = "MASTER_BRAND_EXPERIENCE.md"
MASTER_DELIVERABLE_SOURCES = [
    ("Brand Analysis", "brand_analysis.md"),
    ("Identity Patch", "identity_patch.md"),
    ("Entity Bible", "entity_bible.md"),
    ("Visual Universe", "visual_universe.md"),
    ("Content Strategy", "content_strategy.md"),
    ("AI Prompts", "ai_prompts.md"),
    ("Action Plan", "action_plan.md"),
    ("Brand Identity Board", "brand_identity_board.md"),
    ("Storytelling Strategy Board", "storytelling_strategy_board.md"),
    ("Visual Universe Board", "visual_universe_board.md"),
]
MASTER_VISUAL_REFERENCES = [
    "brand_identity_board.png",
    "storytelling_strategy_board.png",
    "visual_universe_board.png",
]
PROMPT_PACK_BASE_FOLDER = "05_ENTREGAS/prompt_pack"
PROMPT_PACK_FILES = [
    "identity_cliente.md",
    "visual_generation_mode.md",
    "logo_system_prompt.md",
    "color_palette_prompt.md",
    "tone_of_brand_prompt.md",
    "brand_identity_board_prompt.md",
    "storytelling_board_prompt.md",
    "visual_universe_board_prompt.md",
    "full_brand_experience_prompt_pack.md",
]
PROMPT_PACK_CLEANABLE_FILES = PROMPT_PACK_FILES + [
    "instagram_feed_prompt.md",
    "commercial_proposal_prompt.md",
]
ANALYSIS_PIPELINE = [
    "intake_normalization",
    "current_diagnosis",
    "brand_essence",
    "brand_transformation",
    "content_strategy",
    "final_deliverables",
]
ANALYSIS_AGENTS = [
    "instagram_audit_agent",
    "branding_agent",
    "psychology_agent",
    "strategy_agent",
    "cinematic_director_agent",
    "content_agent",
    "sales_agent",
]
EXCLUDED_DELIVERABLE_DIRS = {
    ".git",
    ".venv",
    "__pycache__",
    "dist",
    "node_modules",
    "runtime",
}
EXCLUDED_DELIVERABLE_NAMES = {
    ".env",
    ".env.local",
    ".env.production",
}
EXCLUDED_DELIVERABLE_EXTENSIONS = {
    ".bat",
    ".bin",
    ".cmd",
    ".db",
    ".dll",
    ".env",
    ".exe",
    ".log",
    ".msi",
    ".ps1",
    ".pyc",
    ".tmp",
    ".zip",
}
SOURCE_FILE_EXTENSIONS = {
    ".csv",
    ".docx",
    ".jpeg",
    ".jpg",
    ".json",
    ".md",
    ".pdf",
    ".png",
    ".txt",
    ".webp",
}
SOURCE_EXCLUDED_DIRS = {
    ".git",
    ".venv",
    "__pycache__",
    "dist",
    "node_modules",
    "runtime",
}
SOURCE_EXCLUDED_NAMES = {
    ".env",
    ".env.local",
    ".env.production",
}
SOURCE_EXCLUDED_EXTENSIONS = {
    ".bat",
    ".bin",
    ".cmd",
    ".db",
    ".dll",
    ".env",
    ".exe",
    ".log",
    ".msi",
    ".ps1",
    ".pyc",
    ".tmp",
    ".zip",
}
RESERVED_FILENAMES = {
    "con",
    "prn",
    "aux",
    "nul",
    "com1",
    "com2",
    "com3",
    "com4",
    "com5",
    "com6",
    "com7",
    "com8",
    "com9",
    "lpt1",
    "lpt2",
    "lpt3",
    "lpt4",
    "lpt5",
    "lpt6",
    "lpt7",
    "lpt8",
    "lpt9",
}

CLIENT_FOLDERS = [
    "00_ADMIN/Contratos",
    "00_ADMIN/Pagos",
    "00_ADMIN/Presupuestos",
    "00_ADMIN/Datos_Cliente",
    "00_ADMIN/Links_Accesos",
    "01_DIAGNOSTICO_ACTUAL/Instagram_Actual",
    "01_DIAGNOSTICO_ACTUAL/Logos_Actuales",
    "01_DIAGNOSTICO_ACTUAL/Material_Actual",
    "01_DIAGNOSTICO_ACTUAL/Reuniones_Zoom",
    "01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience",
    "02_ESENCIA_DE_MARCA/Identidad",
    "02_ESENCIA_DE_MARCA/Publico_Ideal",
    "02_ESENCIA_DE_MARCA/Emociones",
    "02_ESENCIA_DE_MARCA/Universo_Visual",
    "02_ESENCIA_DE_MARCA/Storytelling",
    "03_BRAND_TRANSFORMATION",
    "04_CONTENIDO",
    "05_ENTREGAS",
    "06_REFERENCIAS",
]

SEED_FILES = {
    "01_DIAGNOSTICO_ACTUAL/Briefing_Semilla.md": """# BRIEFING DE TRANSFORMACION: {client_name}

## 1. ESTADO ACTUAL
- Que vende hoy:
- Como se ve su presencia actual:
- Punto de dolor principal:

## 2. LA VISION
- Atmosfera deseada:
- Sentimiento que debe evocar:
- Referencia aspiracional:

## 3. DIFERENCIAL BRAND EXPERIENCE
- Alma que vamos a revelar:
- Elemento cinematico clave:
""",
    "02_ESENCIA_DE_MARCA/CLIENT_CONTEXT.md": """# CLIENT CONTEXT - {client_name}

## INFORMACION GENERAL

Nombre:
{client_name}

Industria:
Tours / travel / experience

## HISTORIA

## PERSONALIDAD

## PROBLEMAS ACTUALES

## PERCEPCION DESEADA

## EXPERIENCIA IDEAL

## UNIVERSO VISUAL

## PUBLICO IDEAL

## EMOCIONES PRINCIPALES

## OBJETIVO DE TRANSFORMACION
""",
    "01_DIAGNOSTICO_ACTUAL/INSTAGRAM_EXTRACTION.md": """# INSTAGRAM EXTRACTION

## PERSONALIDAD DETECTADA

## PERCEPCION ACTUAL

## UNIVERSO VISUAL

## OPORTUNIDADES

## DIRECCION RECOMENDADA
""",
    "02_ESENCIA_DE_MARCA/BRAND_DIAGNOSIS.md": """# BRAND DIAGNOSIS

## PROBLEMAS ACTUALES

## DESCONEXION EMOCIONAL

## PROBLEMAS DE PERCEPCION

## OPORTUNIDADES PREMIUM

## DIRECCION RECOMENDADA
""",
    "02_ESENCIA_DE_MARCA/VISUAL_DIRECTION.md": """# VISUAL DIRECTION

## PALETA CROMATICA

## TIPOGRAFIAS

## ATMOSFERA

## ILUMINACION

## ESTILO FOTOGRAFICO

## ESTETICA CINEMATOGRAFICA

## EXPERIENCIA VISUAL
""",
    "02_ESENCIA_DE_MARCA/EMOTIONAL_POSITIONING.md": """# EMOTIONAL POSITIONING

## PERCEPCION ACTUAL

## PERCEPCION IDEAL

## EMOCIONES

## DIFERENCIACION

## EXPERIENCIA PREMIUM
""",
    "02_ESENCIA_DE_MARCA/STORYTELLING.md": """# STORYTELLING

## NARRATIVA DE MARCA

## HISTORIA EMOCIONAL

## ATMOSFERA

## MENSAJE CENTRAL

## VOZ DE MARCA
""",
    "03_BRAND_TRANSFORMATION/TRANSFORMATION_GOAL.md": """# TRANSFORMATION GOAL

## ESTADO ACTUAL

## PROBLEMAS

## OBJETIVO FINAL

## NUEVA IDENTIDAD

## NUEVA PERCEPCION
""",
}


def _sanitize_client_name(client_name):
    cleaned = re.sub(r'[<>:"/\\|?*\x00-\x1f]', "", client_name).strip()
    cleaned = re.sub(r"\s+", " ", cleaned)

    return cleaned[:90].strip(" .")


def _find_existing_client(client_name):
    if not CLIENTS_ROOT.exists():
        return None

    normalized = client_name.casefold()

    for candidate in CLIENTS_ROOT.iterdir():
        if candidate.is_dir() and candidate.name.casefold() == normalized:
            return candidate

    return None


def get_client_path(client_name):
    safe_name = _sanitize_client_name(client_name)

    if not safe_name:
        return None

    return _find_existing_client(safe_name) or CLIENTS_ROOT / safe_name


def _resolve_existing_client_path(client_name):
    safe_name = _sanitize_client_name(client_name)

    if not safe_name:
        return None, None

    client_path = _find_existing_client(safe_name)

    if not client_path:
        return safe_name, None

    resolved_clients_root = CLIENTS_ROOT.resolve()
    resolved_client_path = client_path.resolve()

    if resolved_client_path != resolved_clients_root and resolved_clients_root not in resolved_client_path.parents:
        return safe_name, None

    return client_path.name, client_path


def _is_allowed_deliverable_item(path, deliverables_dir):
    if path.name.startswith("."):
        return False

    relative_parts = path.relative_to(deliverables_dir).parts

    if len(relative_parts) > MAX_DELIVERABLE_DEPTH:
        return False

    if any(part in EXCLUDED_DELIVERABLE_DIRS or part.startswith(".") for part in relative_parts):
        return False

    name = path.name.casefold()

    if name in EXCLUDED_DELIVERABLE_NAMES:
        return False

    if path.is_file() and path.suffix.casefold() in EXCLUDED_DELIVERABLE_EXTENSIONS:
        return False

    return True


def list_client_deliverables(client_name):
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    deliverables_dir = client_path / DELIVERABLES_BASE_FOLDER

    result = {
        "client": resolved_client_name,
        "base": DELIVERABLES_BASE_FOLDER,
        "items": [],
    }

    if not deliverables_dir.is_dir():
        return result

    resolved_deliverables_dir = deliverables_dir.resolve()
    resolved_client_path = client_path.resolve()

    if resolved_deliverables_dir != resolved_client_path and resolved_client_path not in resolved_deliverables_dir.parents:
        return result

    for path in sorted(deliverables_dir.rglob("*"), key=lambda item: str(item.relative_to(deliverables_dir)).casefold()):
        if len(result["items"]) >= MAX_DELIVERABLE_ITEMS:
            break

        if not _is_allowed_deliverable_item(path, deliverables_dir):
            continue

        item_type = "directory" if path.is_dir() else "file"
        relative_path = Path(DELIVERABLES_BASE_FOLDER) / path.relative_to(deliverables_dir)
        stat = path.stat()

        result["items"].append(
            {
                "name": path.name,
                "type": item_type,
                "relative_path": relative_path.as_posix(),
                "extension": path.suffix.casefold() if path.is_file() else "",
                "size": stat.st_size if path.is_file() else 0,
                "modified_at": datetime.fromtimestamp(stat.st_mtime).isoformat(timespec="seconds"),
                **(
                    {
                        "children_count": sum(
                            1
                            for child in path.iterdir()
                            if _is_allowed_deliverable_item(child, deliverables_dir)
                        )
                    }
                    if path.is_dir()
                    else {}
                ),
            }
        )

    return result


def get_client_deliverable_content(client_name, relative_path):
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    if not relative_path or "\\" in relative_path:
        raise ValueError("Invalid deliverable path.")

    submitted_path = Path(relative_path)

    if submitted_path.is_absolute() or any(part in {"", ".", ".."} for part in submitted_path.parts):
        raise ValueError("Invalid deliverable path.")

    if not submitted_path.parts or submitted_path.parts[0] != DELIVERABLES_BASE_FOLDER:
        raise ValueError("Deliverable path must stay inside 05_ENTREGAS.")

    deliverables_dir = client_path / DELIVERABLES_BASE_FOLDER
    target_path = client_path / submitted_path

    resolved_client_path = client_path.resolve()
    resolved_deliverables_dir = deliverables_dir.resolve()
    resolved_target_path = target_path.resolve()

    if resolved_client_path not in resolved_deliverables_dir.parents and resolved_deliverables_dir != resolved_client_path:
        raise ValueError("Invalid deliverables path.")

    if resolved_deliverables_dir not in resolved_target_path.parents:
        raise ValueError("Deliverable path must stay inside 05_ENTREGAS.")

    if not target_path.exists():
        raise FileNotFoundError("Deliverable file not found.")

    if not target_path.is_file():
        raise IsADirectoryError("Deliverable path is not a file.")

    if not _is_allowed_deliverable_item(target_path, deliverables_dir):
        raise ValueError("Deliverable file is not allowed.")

    extension = target_path.suffix.casefold()

    if extension not in ALLOWED_DELIVERABLE_CONTENT_EXTENSIONS:
        raise ValueError("Deliverable extension is not allowed for reading.")

    size = target_path.stat().st_size

    if size > MAX_DELIVERABLE_CONTENT_BYTES:
        raise ValueError("Deliverable file is too large to read.")

    return {
        "client": resolved_client_name,
        "name": target_path.name,
        "relative_path": submitted_path.as_posix(),
        "extension": extension,
        "content": target_path.read_text(encoding="utf-8"),
        "size": size,
    }


def get_client_deliverable_asset_path(client_name, relative_path):
    _resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    if not relative_path or "\\" in relative_path:
        raise ValueError("Invalid deliverable path.")

    submitted_path = Path(relative_path)

    if submitted_path.is_absolute() or any(part in {"", ".", ".."} for part in submitted_path.parts):
        raise ValueError("Invalid deliverable path.")

    if not submitted_path.parts or submitted_path.parts[0] != DELIVERABLES_BASE_FOLDER:
        raise ValueError("Deliverable path must stay inside 05_ENTREGAS.")

    deliverables_dir = client_path / DELIVERABLES_BASE_FOLDER
    target_path = client_path / submitted_path
    resolved_deliverables_dir = deliverables_dir.resolve()
    resolved_target_path = target_path.resolve()

    if resolved_deliverables_dir not in resolved_target_path.parents:
        raise ValueError("Deliverable path must stay inside 05_ENTREGAS.")

    if not target_path.exists():
        raise FileNotFoundError("Deliverable asset not found.")

    if not target_path.is_file():
        raise IsADirectoryError("Deliverable path is not a file.")

    if not _is_allowed_deliverable_item(target_path, deliverables_dir):
        raise ValueError("Deliverable asset is not allowed.")

    if target_path.suffix.casefold() not in ALLOWED_DELIVERABLE_ASSET_EXTENSIONS:
        raise ValueError("Deliverable extension is not allowed as an asset.")

    return target_path


def _client_relative_path(client_path, path):
    return path.relative_to(client_path).as_posix()


def _safe_deliverables_dir(client_path):
    deliverables_dir = client_path / DELIVERABLES_BASE_FOLDER
    deliverables_dir.mkdir(parents=True, exist_ok=True)

    resolved_client_path = client_path.resolve()
    resolved_deliverables_dir = deliverables_dir.resolve()

    if resolved_deliverables_dir != resolved_client_path and resolved_client_path not in resolved_deliverables_dir.parents:
        raise ValueError("Invalid deliverables path.")

    return deliverables_dir


def _load_latest_analysis(client_path):
    analysis_dir = client_path / LATEST_ANALYSIS_FOLDER
    json_path = analysis_dir / "LATEST_ANALYSIS.json"
    markdown_path = analysis_dir / "LATEST_ANALYSIS.md"
    analysis_payload = None
    markdown_text = ""
    source_paths = {}

    if json_path.is_file():
        try:
            analysis_payload = json.loads(json_path.read_text(encoding="utf-8"))
            source_paths["json"] = _client_relative_path(client_path, json_path)
        except json.JSONDecodeError as error:
            raise ValueError("LATEST_ANALYSIS.json is invalid.") from error

    if markdown_path.is_file():
        markdown_text = markdown_path.read_text(encoding="utf-8")
        source_paths["markdown"] = _client_relative_path(client_path, markdown_path)

    if not analysis_payload and not markdown_text.strip():
        raise ValueError("No LATEST_ANALYSIS.json or LATEST_ANALYSIS.md found for this client.")

    return analysis_payload, markdown_text, source_paths


def _as_list(value):
    return value if isinstance(value, list) else []


def _section_from_items(items, formatter):
    lines = []

    for item in _as_list(items):
        lines.extend(formatter(item))
        lines.append("")

    return "\n".join(lines).strip() or "- No structured data available."


def _format_scorecard(scorecard):
    return _section_from_items(
        scorecard,
        lambda item: [
            f"## {item.get('label', 'Signal')}",
            f"- Score: {item.get('score', 'n/a')}",
            f"- Status: {item.get('status', 'n/a')}",
            f"- Signal: {item.get('signal', 'n/a')}",
            f"- Action: {item.get('action', 'n/a')}",
        ],
    )


def _format_priorities(priorities):
    return _section_from_items(
        priorities,
        lambda item: [
            f"## {item.get('title', 'Priority')}",
            f"- Urgency: {item.get('urgency', 'n/a')}",
            f"- Reason: {item.get('reason', 'n/a')}",
            f"- Action: {item.get('action', 'n/a')}",
        ],
    )


def _format_deliverables(deliverables):
    return _section_from_items(
        deliverables,
        lambda item: [
            f"## {item.get('name', 'Deliverable')}",
            f"- Outcome: {item.get('outcome', 'n/a')}",
            "### Actions",
            *[f"- {action}" for action in _as_list(item.get("actions"))],
        ],
    )


def _format_content_pillars(pillars):
    return _section_from_items(
        pillars,
        lambda item: [
            f"## {item.get('name', 'Pillar')}",
            f"- Role: {item.get('role', 'n/a')}",
            "- Formats: " + ", ".join(_as_list(item.get("formats"))),
        ],
    )


def _format_ai_prompts(prompts):
    return _section_from_items(
        prompts,
        lambda item: [
            f"## {item.get('name', 'Prompt')}",
            item.get("prompt", "No prompt available."),
        ],
    )


def _format_list(title, items):
    values = _as_list(items)

    if not values:
        return f"# {title}\n\n- No structured data available.\n"

    return f"# {title}\n\n" + "\n".join(f"- {item}" for item in values) + "\n"


def _build_deliverable_documents(client_name, analysis_payload, markdown_text):
    analysis = (analysis_payload or {}).get("analysis") or {}
    diagnosis = analysis.get("diagnosis") or {}
    headline = analysis.get("headline") or "No structured headline available."
    source_markdown = markdown_text.strip() or "No narrative markdown analysis available."

    if not analysis:
        fallback_header = f"# Brand Experience Deliverable - {client_name}\n\n"
        return {
            filename: (
                fallback_header
                + "Generated from LATEST_ANALYSIS.md fallback.\n\n"
                + source_markdown
                + "\n"
            )
            for filename in FINAL_DELIVERABLE_FILES
        }

    return {
        "brand_analysis.md": f"""# Brand Analysis - {client_name}

## Headline

{headline}

## Diagnosis

- Current state: {diagnosis.get('current_state', 'n/a')}
- Main gap: {diagnosis.get('main_gap', 'n/a')}
- Strategic decision: {diagnosis.get('strategic_decision', 'n/a')}

## Scorecard

{_format_scorecard(analysis.get('scorecard'))}

## Source Synthesis

{source_markdown}
""",
        "identity_patch.md": f"""# Identity Patch - {client_name}

## Core Decision

{diagnosis.get('strategic_decision', headline)}

## Priority Identity Moves

{_format_priorities(analysis.get('priorities'))}
""",
        "entity_bible.md": f"""# Entity Bible - {client_name}

## Brand Operating System

{_format_deliverables(analysis.get('deliverables'))}

## Risks To Avoid

{_format_list('Risks', analysis.get('risks'))}
""",
        "visual_universe.md": f"""# Visual Universe - {client_name}

## Visual Signals

{_format_scorecard([item for item in _as_list(analysis.get('scorecard')) if item.get('key') in {'visual_coherence', 'premium_perception'}])}
""",
        "content_strategy.md": f"""# Content Strategy - {client_name}

## Content Pillars

{_format_content_pillars(analysis.get('content_pillars'))}
""",
        "ai_prompts.md": f"""# AI Prompts - {client_name}

{_format_ai_prompts(analysis.get('ai_prompts'))}
""",
        "action_plan.md": f"""# Action Plan - {client_name}

## Priorities

{_format_priorities(analysis.get('priorities'))}

## Next Sprint

{_format_list('Next Sprint', analysis.get('next_sprint'))}
""",
    }


def _versioned_deliverable_path(path, timestamp):
    candidate = path.with_name(f"{path.stem}_{timestamp}{path.suffix}")
    counter = 2

    while candidate.exists():
        candidate = path.with_name(f"{path.stem}_{timestamp}_{counter}{path.suffix}")
        counter += 1

    return candidate


def _write_markdown_deliverable(deliverables_dir, filename, content, timestamp):
    target_path = deliverables_dir / filename
    versioned = False

    if target_path.exists():
        target_path = _versioned_deliverable_path(target_path, timestamp)
        versioned = True

    target_path.write_text(content.rstrip() + "\n", encoding="utf-8")

    return target_path, versioned


def generate_client_deliverables(client_name):
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    analysis_payload, markdown_text, source_paths = _load_latest_analysis(client_path)
    deliverables_dir = _safe_deliverables_dir(client_path)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    documents = _build_deliverable_documents(resolved_client_name, analysis_payload, markdown_text)
    created = []
    versioned = []

    for filename, content in documents.items():
        path, was_versioned = _write_markdown_deliverable(deliverables_dir, filename, content, timestamp)
        relative_path = _client_relative_path(client_path, path)
        created.append(relative_path)

        if was_versioned:
            versioned.append(relative_path)

    index_path = deliverables_dir / "deliverables_index.json"
    archived_index = None

    if index_path.exists():
        archived_index_path = _versioned_deliverable_path(index_path, timestamp)
        index_path.replace(archived_index_path)
        archived_index = _client_relative_path(client_path, archived_index_path)

    index_payload = {
        "client": resolved_client_name,
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "source": source_paths,
        "deliverables": created,
        "versioned": versioned,
        "archived_index": archived_index,
    }
    index_path.write_text(json.dumps(index_payload, indent=2, ensure_ascii=False), encoding="utf-8")

    return {
        "client": resolved_client_name,
        "base": DELIVERABLES_BASE_FOLDER,
        "source": source_paths,
        "created": created,
        "versioned": versioned,
        "index": _client_relative_path(client_path, index_path),
        "archived_index": archived_index,
    }


def _analysis_from_payload(analysis_payload):
    return (analysis_payload or {}).get("analysis") or {}


def _first_priority(analysis):
    priorities = _as_list(analysis.get("priorities"))

    return priorities[0] if priorities else {}


def _content_pillar_specs(analysis):
    pillars = _as_list(analysis.get("content_pillars"))

    if pillars:
        return [
            {
                "name": item.get("name", "Pillar"),
                "description": item.get("role", "No description available."),
            }
            for item in pillars
        ]

    return [
        {
            "name": "Authority",
            "description": "Show method, expertise, and a clear point of view.",
        },
        {
            "name": "Desire",
            "description": "Make the transformation emotionally visible.",
        },
    ]


def _brand_experience_values():
    return [
        {
            "name": "Identidad",
            "description": "Revelar la esencia real y hacerla reconocible.",
        },
        {
            "name": "Percepcion",
            "description": "Elevar el valor sentido antes de explicar la oferta.",
        },
        {
            "name": "Emocion",
            "description": "Crear deseo, confianza y memoria emocional.",
        },
        {
            "name": "Autenticidad",
            "description": "Construir desde verdad, no desde decoracion.",
        },
        {
            "name": "Experiencia",
            "description": "Convertir cada contacto en una senal de marca.",
        },
    ]


def _storytelling_formats():
    return [
        {"name": "Reels cinematicos", "purpose": "Transformar una idea estrategica en una escena memorable."},
        {"name": "Posts narrativos", "purpose": "Revelar criterio, posicionamiento y punto de vista."},
        {"name": "Carruseles educativos", "purpose": "Ordenar el metodo y elevar autoridad."},
        {"name": "Voz & manifiestos", "purpose": "Transmitir filosofia, energia y verdad de marca."},
        {"name": "Videos documentales", "purpose": "Mostrar proceso, prueba y mundo interno."},
        {"name": "Series de historias", "purpose": "Sostener continuidad narrativa y deseo."},
    ]


def _golden_storytelling_rules():
    return [
        {"name": "Se autentico", "description": "No imites. Se real; eso te hace unico."},
        {"name": "Muestra, no cuentes", "description": "Las imagenes y experiencias dicen mas que las palabras."},
        {"name": "Se claro", "description": "Una historia confusa no conecta."},
        {"name": "Genera emocion", "description": "Sin emocion, no hay conexion."},
        {"name": "Ten un proposito", "description": "Cada historia debe tener una intencion clara."},
        {"name": "Se constante", "description": "La consistencia construye confianza y autoridad."},
    ]


def _board_source_summary(source_paths):
    return {
        "json": source_paths.get("json", ""),
        "markdown": source_paths.get("markdown", ""),
    }


def _load_visual_boards_entity_bible_context():
    try:
        return load_entity_bible_for_visual_boards(max_total_chars=12_000)
    except Exception:
        return ""


def _visual_board_bible_signals(entity_bible_context):
    source = (entity_bible_context or "").lower()

    def has_any(*keywords):
        return any(keyword in source for keyword in keywords)

    return {
        "available": bool(entity_bible_context),
        "perception_angle": "Perception first: make value felt before it is explained."
        if has_any("perception", "percepcion")
        else "Clarify perception through repeated brand signals.",
        "premium_positioning": "Premium positioning through restraint, coherence, and emotional precision."
        if has_any("premium", "luxury", "lujo")
        else "Elevate the brand with clearer hierarchy and controlled visual language.",
        "visual_authority": "Build visual authority with hierarchy, negative space, contrast, and repeatable codes."
        if has_any("visual", "negative", "contrast", "composition")
        else "Create authority through consistent composition and recognizable assets.",
        "color_emotion": "Use color as an emotional signal, not decoration."
        if has_any("color", "emotion")
        else "Use a restrained palette with one memorable accent.",
        "cinematic_composition": "Favor cinematic composition: focus, rhythm, silence, contrast, and intentional framing."
        if has_any("cinematic", "composition", "atmosphere", "atmosfera")
        else "Use clear focal points and editorial rhythm.",
        "storytelling_axis": "Narrative should move from tension to transformation to proof."
        if has_any("storytelling", "narrative", "narrativa")
        else "Build stories around a clear before, shift, and after.",
        "footer_claim": "Designed to make the brand easier to feel, trust, remember, and choose.",
        "layout_theme": "premium_editorial_entity_system" if entity_bible_context else "premium_editorial_fallback",
    }


def _build_brand_identity_board_spec(client_name, analysis, source_paths, bible_signals=None):
    priority = _first_priority(analysis)
    headline = analysis.get("headline") or f"{client_name} needs a clearer identity system."
    bible_signals = bible_signals or _visual_board_bible_signals("")

    return {
        "client_name": client_name,
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "source": _board_source_summary(source_paths),
        "entity_bible_applied": bible_signals["available"],
        "layout_theme": bible_signals["layout_theme"],
        "hero_title": client_name,
        "hero_subtitle": "Brand Identity Board",
        "brand_promise": analysis.get("diagnosis", {}).get("strategic_decision", headline),
        "perception_angle": bible_signals["perception_angle"],
        "premium_positioning": bible_signals["premium_positioning"],
        "visual_authority": bible_signals["visual_authority"],
        "tagline": headline,
        "brand_descriptor": analysis.get("diagnosis", {}).get("current_state", "Brand identity board generated from available analysis."),
        "identity_sections": [
            {"name": "Logo principal", "description": "Marca madre como senal inmediata de reconocimiento."},
            {"name": "Variantes", "description": "Versiones flat, monocromo, icono y aplicacion digital."},
            {"name": "Aplicaciones", "description": "Instagram, WhatsApp Business, web, propuesta y materiales comerciales."},
        ],
        "logo_system": {
            "primary": "Use current primary logo as the main recognition asset.",
            "variants": ["Horizontal lockup", "Compact lockup", "Single-color version"],
            "icon": "Use or derive a simplified symbol from the most recognizable brand mark.",
        },
        "palette": [
            {
                "name": "Signature Accent",
                "hex": "#D9428F",
                "meaning": "Emotional distinction and premium attention.",
            },
            {
                "name": "Deep Base",
                "hex": "#0D0F18",
                "meaning": "Depth, contrast, and editorial focus.",
            },
            {
                "name": "Clarity Light",
                "hex": "#FFFFFF",
                "meaning": "Legibility, simplicity, and trust.",
            },
        ],
        "typography": {
            "primary": "High-contrast editorial sans",
            "secondary": "Clean supporting sans",
            "usage": "Use strong hierarchy for titles and restrained supporting text for details.",
        },
        "brand_tone": [
            {
                "name": priority.get("title", "Strategic clarity"),
                "description": priority.get("action", "Communicate with clearer, more intentional language."),
            },
            {
                "name": "Premium confidence",
                "description": "Sound curated, specific, and operational rather than generic.",
            },
        ],
        "tone_cards": [
            {
                "name": "Precise",
                "description": "Use language that removes ambiguity and supports premium perception.",
            },
            {
                "name": "Atmospheric",
                "description": "Let the brand transmit feeling before over-explaining the offer.",
            },
            {
                "name": "Authoritative",
                "description": "Make every claim concrete through assets, proof, and visual order.",
            },
        ],
        "fundamental_values": _brand_experience_values(),
        "applications": [
            {
                "name": "Digital presence",
                "description": "Apply the identity consistently across website, social profile, and sales material.",
            },
            {
                "name": "Client proposal",
                "description": "Translate the identity into offer pages, highlights, and proof points.",
            },
        ],
        "digital_applications": [
            {"name": "Foto perfil Instagram", "description": "Icono simple, reconocible y legible en pequeno."},
            {"name": "WhatsApp Business", "description": "Perfil comercial con promesa clara, beneficios y horario visible."},
            {"name": "Favicon / web", "description": "Sistema compacto para presencia digital coherente."},
        ],
        "instagram_style": [
            {
                "pillar": item["name"],
                "description": item["description"],
            }
            for item in _content_pillar_specs(analysis)
        ],
        "feed_system": [
            {"name": "Promesa", "description": "Posts que hacen tangible el valor principal."},
            {"name": "Experiencia", "description": "Escenas que muestran el resultado emocional."},
            {"name": "Prueba", "description": "Evidencia, proceso, testimonios y detalle operativo."},
            {"name": "Conversion", "description": "Piezas directas para reserva, consulta o compra."},
        ],
        "commercial_example": {
            "offer": "Premium brand experience package",
            "services": ["Diagnosis", "Identity direction", "Content system", "Execution roadmap"],
            "cta": "Book a strategic discovery session.",
        },
        "commercial_offer": {
            "title": "Signature Experience",
            "promise": analysis.get("diagnosis", {}).get("strategic_decision", "Turn scattered signals into a premium brand system."),
            "cta": "Start with a strategic diagnosis.",
        },
        "benefits": [
            {
                "name": "Sharper perception",
                "description": "Help the audience understand the value faster.",
            },
            {
                "name": "Reusable system",
                "description": "Turn scattered ideas into rules that can guide future assets.",
            },
        ],
        "benefit_bar": [
            "Sharper perception",
            "Recognizable assets",
            "Premium trust",
            "Clearer conversion",
            "Reusable system",
        ],
        "footer_claim": bible_signals["footer_claim"],
    }


def _build_storytelling_strategy_board_spec(client_name, analysis, source_paths, bible_signals=None):
    diagnosis = analysis.get("diagnosis") or {}
    priority = _first_priority(analysis)
    bible_signals = bible_signals or _visual_board_bible_signals("")

    return {
        "client_name": client_name,
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "source": _board_source_summary(source_paths),
        "entity_bible_applied": bible_signals["available"],
        "narrative_axis": bible_signals["storytelling_axis"],
        "storyworld": "A premium brand world where perception, desire, trust, and proof work as one system.",
        "emotional_tension": diagnosis.get("main_gap", priority.get("title", "Unclear transformation")),
        "story_objective": diagnosis.get("strategic_decision", "Create a narrative system that turns attention into action."),
        "story_essence": [
            {
                "principle": "Transformation",
                "description": analysis.get("headline", "Show the shift the brand creates for its audience."),
            },
            {
                "principle": "Specificity",
                "description": priority.get("reason", "Use concrete signals instead of abstract claims."),
            },
        ],
        "framework": [
            {
                "step": "1",
                "name": "Current tension",
                "description": diagnosis.get("current_state", "Name the current state clearly."),
            },
            {
                "step": "2",
                "name": "Main gap",
                "description": diagnosis.get("main_gap", "Show what is missing or unclear."),
            },
            {
                "step": "3",
                "name": "Strategic decision",
                "description": diagnosis.get("strategic_decision", "Define the new direction."),
            },
        ],
        "emotional_pillars": [
            {
                "name": "Trust",
                "description": "Reduce uncertainty through evidence, process, and consistency.",
            },
            {
                "name": "Desire",
                "description": "Make the desired experience feel tangible.",
            },
        ],
        "tone_voice": {
            "keywords": ["clear", "premium", "specific", "useful"],
            "description": "Speak with authority, sensory detail, and practical direction.",
        },
        "storytelling_steps": [
            {
                "step": "1",
                "name": "Tension",
                "description": diagnosis.get("current_state", "Name what feels incomplete, confusing, or under-valued."),
            },
            {
                "step": "2",
                "name": "Reframe",
                "description": "Show the perception shift that makes the brand easier to understand and desire.",
            },
            {
                "step": "3",
                "name": "Proof",
                "description": "Use assets, process, and examples to make the promise believable.",
            },
            {
                "step": "4",
                "name": "Action",
                "description": "Close with one clear next step.",
            },
        ],
        "content_pillars": _content_pillar_specs(analysis),
        "formats": _storytelling_formats(),
        "systems": [
            {
                "name": "Manifesto de marca",
                "description": "Declaracion de principios, valores y proposito.",
            },
            {
                "name": "Narrativa de marca",
                "description": "Historia que explica quienes somos y hacia donde vamos.",
            },
            {
                "name": "Arquetipos & personajes",
                "description": "Rol de la marca, cliente, guia, antagonista y transformacion.",
            },
            {
                "name": "Puentes emocionales",
                "description": "Dolores, deseos, aspiraciones y simbolos que conectan.",
            },
            {
                "name": "Sistema de mensajes",
                "description": "Pilares, mensajes clave y tono para todos los formatos.",
            },
            {
                "name": "Rituales narrativos",
                "description": "Frases, cierres y estructuras que se repiten para crear memoria.",
            },
        ],
        "golden_rules": _golden_storytelling_rules(),
        "story_structure": [
            {
                "stage": "Hook",
                "description": "Name the tension or desire.",
            },
            {
                "stage": "Insight",
                "description": "Explain what changes perception.",
            },
            {
                "stage": "Action",
                "description": "Tell the audience what to do next.",
            },
        ],
        "impact_questions": ["Que hace sentir?", "Que hace pensar?", "Que hace actuar?"],
        "bottom_claims": [
            "Contamos historias que inspiran.",
            "Generamos conexiones que trascienden.",
            "Creamos experiencias que se recuerdan.",
        ],
        "closing_manifesto": "Build stories that make the brand easier to feel, trust, remember, and choose.",
        "manifesto": "The brand story should not decorate the offer. It should make the transformation visible.",
        "footer_claim": bible_signals["footer_claim"],
    }


def _build_visual_universe_board_spec(client_name, analysis, source_paths, bible_signals=None):
    priority = _first_priority(analysis)
    bible_signals = bible_signals or _visual_board_bible_signals("")
    visual_items = [
        item
        for item in _as_list(analysis.get("scorecard"))
        if item.get("key") in {"visual_coherence", "premium_perception"}
    ]

    return {
        "client_name": client_name,
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "source": _board_source_summary(source_paths),
        "entity_bible_applied": bible_signals["available"],
        "visual_mood": "Premium cinematic clarity",
        "central_essence": {
            "title": analysis.get("headline", f"{client_name} as a recognizable brand experience."),
            "signals": ["Autenticidad", "Percepcion", "Emocion", "Confianza", "Memoria"],
        },
        "atmosphere": bible_signals["cinematic_composition"],
        "core_essence": analysis.get("headline", f"Visual universe for {client_name}."),
        "general_atmosphere": [
            "Editorial",
            "Intentional",
            "Premium but practical",
        ],
        "emotional_palette": [
            {
                "name": "Signature Accent",
                "hex": "#D9428F",
                "emotion": "Desire and distinction.",
            },
            {
                "name": "Deep Base",
                "hex": "#0D0F18",
                "emotion": "Focus and depth.",
            },
            {
                "name": "Cool Signal",
                "hex": "#5F6EE6",
                "emotion": "Modernity and precision.",
            },
        ],
        "color_meanings": [
            {
                "color": "#D9428F",
                "meaning": "Use for emotional emphasis and signature moments.",
            },
            {
                "color": "#0D0F18",
                "meaning": "Use as a premium base for contrast and depth.",
            },
        ],
        "color_significance": [
            {"name": "Color base", "meaning": "Profundidad, foco y autoridad visual."},
            {"name": "Color acento", "meaning": "Deseo, energia y recordacion inmediata."},
            {"name": "Color claro", "meaning": "Legibilidad, amplitud y confianza."},
        ],
        "cinematic_language": bible_signals["cinematic_composition"],
        "composition_rules": [
            "One clear focal point per piece.",
            "Use negative space to increase perceived value.",
            "Build hierarchy before adding decoration.",
            "Use contrast to guide attention and create authority.",
        ],
        "lighting": ["Soft contrast", "Clear focal points", "Avoid flat generic lighting"],
        "composition": ["Strong hierarchy", "Generous spacing", "Intentional cropping"],
        "cinematic_style": ["Close sensory details", "Editorial rhythm", "Before-and-after contrast"],
        "official_elements": [
            {
                "name": item.get("label", "Visual signal"),
                "meaning": item.get("action", "Turn this visual signal into a repeatable rule."),
            }
            for item in visual_items
        ]
        or [
            {
                "name": priority.get("title", "Visual coherence"),
                "meaning": priority.get("action", "Create repeatable visual rules."),
            }
        ],
        "official_visual_elements": [
            {"name": "Paisaje / contexto", "meaning": "Ubicar la marca en un mundo reconocible."},
            {"name": "Experiencia humana", "meaning": "Mostrar presencia, emocion y transformacion."},
            {"name": "Texturas", "meaning": "Dar sensacion tactil y premium."},
            {"name": "Iconografia", "meaning": "Ordenar informacion sin perder estetica."},
            {"name": "Luz cinematografica", "meaning": "Crear atmosfera y jerarquia emocional."},
        ],
        "motion_system": ["Slow reveal", "Clean transitions", "Text rhythm synced to key ideas"],
        "typography": {
            "title": "Editorial display sans",
            "body": "Readable supporting sans",
            "usage": "Use contrast between concise titles and calm explanatory text.",
        },
        "instagram_direction": ["Lead with one idea per post", "Use recurring visual structures", "Make proof easy to scan"],
        "reels_style": ["Strong first frame", "Sensory proof", "Clear final CTA"],
        "reels_rules": [
            "Primer frame con tension o deseo.",
            "Movimiento suave y direccionado.",
            "Texto breve con una sola idea.",
            "Cierre con promesa o accion clara.",
        ],
        "symbolic_elements": [
            {
                "name": "Signature accent",
                "meaning": bible_signals["color_emotion"],
            },
            {
                "name": "Controlled space",
                "meaning": bible_signals["visual_authority"],
            },
        ],
        "brand_soul": "A system that makes the brand feel recognizable before it is explained.",
        "soul_statement": "La marca debe sentirse antes de leerse: una experiencia clara, emocional y recordable.",
        "pillars": _content_pillar_specs(analysis),
        "final_objective": "Create a visual world that can guide posts, reels, proposals, and client-facing assets.",
        "footer_claim": bible_signals["footer_claim"],
    }


def _markdown_list(items, key_name="name", key_description="description"):
    values = _as_list(items)

    if not values:
        return "- No structured data available."

    lines = []

    for item in values:
        if isinstance(item, dict):
            label = item.get(key_name) or item.get("principle") or item.get("stage") or item.get("color") or "Item"
            description = item.get(key_description) or item.get("purpose") or item.get("meaning") or item.get("emotion") or ""
            lines.append(f"- **{label}:** {description}" if description else f"- **{label}**")
        else:
            lines.append(f"- {item}")

    return "\n".join(lines)


def _render_brand_identity_board_markdown(spec):
    logo = spec["logo_system"]
    typography = spec["typography"]
    commercial = spec["commercial_example"]

    return f"""# Brand Identity Board - {spec['client_name']}

## Hero

- Title: {spec.get('hero_title', spec['client_name'])}
- Subtitle: {spec.get('hero_subtitle', 'Brand Identity Board')}
- Layout Theme: {spec.get('layout_theme', 'premium_editorial_fallback')}

## Brand Promise

{spec.get('brand_promise', 'No structured brand promise available.')}

## Perception Angle

{spec.get('perception_angle', 'No perception angle available.')}

## Premium Positioning

{spec.get('premium_positioning', 'No premium positioning available.')}

## Visual Authority

{spec.get('visual_authority', 'No visual authority guidance available.')}

## Tagline

{spec['tagline']}

## Brand Descriptor

{spec['brand_descriptor']}

## Logo System

- Primary: {logo['primary']}
- Variants: {', '.join(logo['variants'])}
- Icon: {logo['icon']}

## Palette

{_markdown_list(spec['palette'], 'name', 'meaning')}

## Typography

- Primary: {typography['primary']}
- Secondary: {typography['secondary']}
- Usage: {typography['usage']}

## Brand Tone

{_markdown_list(spec['brand_tone'])}

## Tone Cards

{_markdown_list(spec.get('tone_cards'))}

## Applications

{_markdown_list(spec['applications'])}

## Instagram Style

{_markdown_list(spec['instagram_style'], 'pillar', 'description')}

## Commercial Example

- Offer: {commercial['offer']}
- Services: {', '.join(commercial['services'])}
- CTA: {commercial['cta']}

## Commercial Offer

- Title: {spec.get('commercial_offer', {}).get('title', 'No structured offer available.')}
- Promise: {spec.get('commercial_offer', {}).get('promise', 'No structured offer available.')}
- CTA: {spec.get('commercial_offer', {}).get('cta', 'No CTA available.')}

## Benefits

{_markdown_list(spec['benefits'])}

## Benefit Bar

{_markdown_list(spec.get('benefit_bar'))}

## Footer Claim

{spec.get('footer_claim', 'No footer claim available.')}
"""


def _render_storytelling_strategy_board_markdown(spec):
    tone = spec["tone_voice"]

    return f"""# Storytelling Strategy Board - {spec['client_name']}

## Narrative Axis

{spec.get('narrative_axis', 'No narrative axis available.')}

## Storyworld

{spec.get('storyworld', 'No storyworld available.')}

## Emotional Tension

{spec.get('emotional_tension', 'No emotional tension available.')}

## Story Objective

{spec['story_objective']}

## Story Essence

{_markdown_list(spec['story_essence'], 'principle', 'description')}

## Narrative Framework

{_markdown_list(spec['framework'], 'name', 'description')}

## Storytelling Steps

{_markdown_list(spec.get('storytelling_steps'), 'name', 'description')}

## Emotional Pillars

{_markdown_list(spec['emotional_pillars'])}

## Tone And Voice

- Keywords: {', '.join(tone['keywords'])}
- Description: {tone['description']}

## Content Pillars

{_markdown_list(spec['content_pillars'])}

## Formats

{_markdown_list(spec['formats'], 'name', 'purpose')}

## Systems

{_markdown_list(spec['systems'])}

## Golden Rules

{_markdown_list(spec['golden_rules'])}

## Story Structure

{_markdown_list(spec['story_structure'], 'stage', 'description')}

## Impact Questions

{_markdown_list(spec['impact_questions'])}

## Closing Manifesto

{spec['closing_manifesto']}

## Manifesto

{spec.get('manifesto', 'No manifesto available.')}

## Footer Claim

{spec.get('footer_claim', 'No footer claim available.')}
"""


def _render_visual_universe_board_markdown(spec):
    typography = spec["typography"]

    return f"""# Visual Universe Board - {spec['client_name']}

## Visual Mood

{spec.get('visual_mood', 'No visual mood available.')}

## Atmosphere

{spec.get('atmosphere', 'No atmosphere available.')}

## Core Essence

{spec['core_essence']}

## General Atmosphere

{_markdown_list(spec['general_atmosphere'])}

## Emotional Palette

{_markdown_list(spec['emotional_palette'], 'name', 'emotion')}

## Color Meanings

{_markdown_list(spec['color_meanings'], 'color', 'meaning')}

## Cinematic Language

{spec.get('cinematic_language', 'No cinematic language available.')}

## Composition Rules

{_markdown_list(spec.get('composition_rules'))}

## Lighting

{_markdown_list(spec['lighting'])}

## Composition

{_markdown_list(spec['composition'])}

## Cinematic Style

{_markdown_list(spec['cinematic_style'])}

## Official Elements

{_markdown_list(spec['official_elements'], 'name', 'meaning')}

## Motion System

{_markdown_list(spec['motion_system'])}

## Typography

- Title: {typography['title']}
- Body: {typography['body']}
- Usage: {typography['usage']}

## Instagram Direction

{_markdown_list(spec['instagram_direction'])}

## Reels Style

{_markdown_list(spec['reels_style'])}

## Symbolic Elements

{_markdown_list(spec.get('symbolic_elements'), 'name', 'meaning')}

## Brand Soul

{spec['brand_soul']}

## Pillars

{_markdown_list(spec['pillars'])}

## Final Objective

{spec['final_objective']}

## Footer Claim

{spec.get('footer_claim', 'No footer claim available.')}
"""


def _safe_board_specs_dir(client_path, deliverables_dir):
    specs_dir = deliverables_dir / "board_specs"
    specs_dir.mkdir(parents=True, exist_ok=True)
    resolved_client_path = client_path.resolve()
    resolved_specs_dir = specs_dir.resolve()

    if resolved_specs_dir != resolved_client_path and resolved_client_path not in resolved_specs_dir.parents:
        raise ValueError("Invalid board specs path.")

    return specs_dir


def _write_visual_board_file(path, content, timestamp):
    target_path = path
    versioned = False

    if target_path.exists():
        target_path = _versioned_deliverable_path(target_path, timestamp)
        versioned = True

    if isinstance(content, dict):
        target_path.write_text(json.dumps(content, indent=2, ensure_ascii=False), encoding="utf-8")
    else:
        target_path.write_text(content.rstrip() + "\n", encoding="utf-8")

    return target_path, versioned


def generate_client_visual_board_specs(client_name):
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    analysis_payload, markdown_text, source_paths = _load_latest_analysis(client_path)
    analysis = _analysis_from_payload(analysis_payload)
    deliverables_dir = _safe_deliverables_dir(client_path)
    specs_dir = _safe_board_specs_dir(client_path, deliverables_dir)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    bible_signals = _visual_board_bible_signals(_load_visual_boards_entity_bible_context())
    board_specs = {
        "brand_identity_board": _build_brand_identity_board_spec(resolved_client_name, analysis, source_paths, bible_signals),
        "storytelling_strategy_board": _build_storytelling_strategy_board_spec(resolved_client_name, analysis, source_paths, bible_signals),
        "visual_universe_board": _build_visual_universe_board_spec(resolved_client_name, analysis, source_paths, bible_signals),
    }
    board_markdown = {
        "brand_identity_board": _render_brand_identity_board_markdown(board_specs["brand_identity_board"]),
        "storytelling_strategy_board": _render_storytelling_strategy_board_markdown(board_specs["storytelling_strategy_board"]),
        "visual_universe_board": _render_visual_universe_board_markdown(board_specs["visual_universe_board"]),
    }
    created = []
    versioned = []

    for board_name, spec in board_specs.items():
        spec_path, spec_versioned = _write_visual_board_file(specs_dir / f"{board_name}.json", spec, timestamp)
        relative_spec_path = _client_relative_path(client_path, spec_path)
        created.append(relative_spec_path)

        if spec_versioned:
            versioned.append(relative_spec_path)

    for board_name, markdown in board_markdown.items():
        markdown_path, markdown_versioned = _write_visual_board_file(deliverables_dir / f"{board_name}.md", markdown, timestamp)
        relative_markdown_path = _client_relative_path(client_path, markdown_path)
        created.append(relative_markdown_path)

        if markdown_versioned:
            versioned.append(relative_markdown_path)

    return {
        "client": resolved_client_name,
        "base": DELIVERABLES_BASE_FOLDER,
        "created": created,
        "versioned": versioned,
        "source": source_paths,
        "will_generate_images": False,
        "used_ai": False,
    }


def _load_visual_board_specs(client_path):
    specs_dir = client_path / BOARD_SPECS_BASE_FOLDER
    resolved_client_path = client_path.resolve()
    resolved_specs_dir = specs_dir.resolve()

    if resolved_client_path not in resolved_specs_dir.parents:
        raise ValueError("Invalid board specs path.")

    specs = {}
    source_specs = []

    for board_name in VISUAL_BOARD_FILES:
        spec_path = specs_dir / f"{board_name}.json"

        if not spec_path.is_file():
            raise FileNotFoundError(f"Missing required board spec: {BOARD_SPECS_BASE_FOLDER}/{board_name}.json")

        try:
            specs[board_name] = json.loads(spec_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as error:
            raise ValueError(f"Invalid board spec JSON: {BOARD_SPECS_BASE_FOLDER}/{board_name}.json") from error

        source_specs.append(_client_relative_path(client_path, spec_path))

    return specs, source_specs


def _safe_visuals_dir(client_path):
    visuals_dir = client_path / VISUALS_BASE_FOLDER
    visuals_dir.mkdir(parents=True, exist_ok=True)
    resolved_client_path = client_path.resolve()
    resolved_visuals_dir = visuals_dir.resolve()

    if resolved_client_path not in resolved_visuals_dir.parents:
        raise ValueError("Invalid visuals path.")

    return visuals_dir


def _load_board_font(size, bold=False):
    from PIL import ImageFont

    candidates = [
        "arialbd.ttf" if bold else "arial.ttf",
        "segoeuib.ttf" if bold else "segoeui.ttf",
        "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf",
    ]

    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            continue

    return ImageFont.load_default()


def _draw_wrapped_text(draw, text, xy, font, fill, max_width, line_spacing=6, max_lines=None):
    value = str(text or "Pendiente de definir").strip() or "Pendiente de definir"
    words = value.split()
    lines = []
    current = ""

    for word in words:
        candidate = f"{current} {word}".strip()
        bbox = draw.textbbox((0, 0), candidate, font=font)

        if bbox[2] - bbox[0] <= max_width or not current:
            current = candidate
        else:
            lines.append(current)
            current = word

    if current:
        lines.append(current)

    if max_lines and len(lines) > max_lines:
        lines = lines[:max_lines]
        lines[-1] = lines[-1].rstrip(".") + "..."

    x, y = xy
    line_height = draw.textbbox((0, 0), "Ag", font=font)[3] - draw.textbbox((0, 0), "Ag", font=font)[1]

    for line in lines:
        draw.text((x, y), line, font=font, fill=fill)
        y += line_height + line_spacing

    return y


def _draw_card(draw, box, title, lines, palette):
    x1, y1, x2, y2 = box
    draw.rounded_rectangle(box, radius=24, fill=palette["card"], outline=palette["border"], width=2)
    draw.text((x1 + 26, y1 + 22), title, font=palette["font_h3"], fill=palette["accent"])
    y = y1 + 66

    for line in lines[:8]:
        y = _draw_wrapped_text(draw, line, (x1 + 26, y), palette["font_body"], palette["text"], x2 - x1 - 52, max_lines=2)
        y += 6

        if y > y2 - 34:
            break


def _item_texts(items, label_key="name", description_key="description", limit=4):
    values = _as_list(items)[:limit]
    result = []

    for item in values:
        if isinstance(item, dict):
            label = item.get(label_key) or item.get("pillar") or item.get("principle") or item.get("stage") or item.get("color") or "Item"
            description = item.get(description_key) or item.get("purpose") or item.get("meaning") or item.get("emotion") or ""
            result.append(f"{label}: {description}" if description else label)
        else:
            result.append(str(item))

    return result or ["Pendiente de definir"]


def _draw_palette_swatches(draw, swatches, box, palette):
    x1, y1, x2, y2 = box
    draw.rounded_rectangle(box, radius=24, fill=palette["card"], outline=palette["border"], width=2)
    draw.text((x1 + 26, y1 + 22), "Palette", font=palette["font_h3"], fill=palette["accent"])
    x = x1 + 26
    y = y1 + 70
    swatch_width = max(120, int((x2 - x1 - 72) / max(1, min(4, len(swatches)))))

    for item in _as_list(swatches)[:4]:
        color = item.get("hex") or "#888888"
        name = item.get("name") or item.get("color") or color
        meaning = item.get("meaning") or item.get("emotion") or ""

        try:
            draw.rounded_rectangle((x, y, x + swatch_width - 18, y + 74), radius=18, fill=color)
        except ValueError:
            draw.rounded_rectangle((x, y, x + swatch_width - 18, y + 74), radius=18, fill="#888888")

        draw.text((x, y + 88), name, font=palette["font_small_bold"], fill=palette["text"])
        _draw_wrapped_text(draw, meaning, (x, y + 112), palette["font_small"], palette["muted"], swatch_width - 18, max_lines=2)
        x += swatch_width


def _draw_board_layout(spec, title, subtitle, cards, swatches=None, theme=None):
    from PIL import Image, ImageDraw

    theme = theme or {}
    image = Image.new("RGB", VISUAL_BOARD_IMAGE_SIZE, theme.get("background", "#0D0F18"))
    draw = ImageDraw.Draw(image)
    palette = {
        "background": theme.get("background", "#0D0F18"),
        "card": theme.get("card", "#171B2A"),
        "border": theme.get("border", "#2A3146"),
        "accent": theme.get("accent", "#FF7ABB"),
        "text": theme.get("text", "#FFFFFF"),
        "muted": theme.get("muted", "#B8C0D8"),
        "font_title": _load_board_font(64, bold=True),
        "font_subtitle": _load_board_font(28),
        "font_h3": _load_board_font(24, bold=True),
        "font_body": _load_board_font(21),
        "font_small": _load_board_font(16),
        "font_small_bold": _load_board_font(16, bold=True),
    }

    draw.rectangle((0, 0, 1920, 1080), fill=palette["background"])
    draw.ellipse((1450, -260, 2140, 430), fill=theme.get("glow", "#34204A"))
    draw.ellipse((-220, 760, 420, 1360), fill=theme.get("glow_2", "#182E4C"))
    draw.text((90, 70), title, font=palette["font_title"], fill=palette["text"])
    _draw_wrapped_text(draw, subtitle, (92, 150), palette["font_subtitle"], palette["muted"], 1140, max_lines=2)
    draw.text((90, 1010), f"{spec.get('client_name', '')} / generated locally", font=palette["font_small"], fill=palette["muted"])

    if swatches:
        _draw_palette_swatches(draw, swatches, (90, 235, 760, 470), palette)

    card_boxes = [
        (790, 235, 1325, 470),
        (1355, 235, 1830, 470),
        (90, 500, 600, 760),
        (630, 500, 1140, 760),
        (1170, 500, 1830, 760),
        (90, 790, 600, 980),
        (630, 790, 1140, 980),
        (1170, 790, 1830, 980),
    ]

    if not swatches:
        card_boxes[0] = (90, 235, 600, 470)
        card_boxes[1] = (630, 235, 1140, 470)
        card_boxes[2] = (1170, 235, 1830, 470)

    for card, box in zip(cards, card_boxes):
        _draw_card(draw, box, card["title"], card["lines"], palette)

    return image


def _brand_v2_fonts():
    return {
        "hero": _load_board_font(86, bold=True),
        "title": _load_board_font(34, bold=True),
        "subtitle": _load_board_font(25),
        "section": _load_board_font(22, bold=True),
        "body": _load_board_font(18),
        "small": _load_board_font(14),
        "small_bold": _load_board_font(14, bold=True),
        "tiny": _load_board_font(12),
    }


def _brand_v2_theme():
    return {
        "bg": "#061426",
        "bg_2": "#0D1B2A",
        "panel": "#F7F8FA",
        "panel_dark": "#071A2F",
        "line": "#DDE4EF",
        "line_dark": "#35506B",
        "text": "#FFFFFF",
        "ink": "#111827",
        "muted": "#C9D5E6",
        "muted_dark": "#5B6778",
        "pink": "#E94584",
        "blue": "#1B7FC2",
        "cyan": "#4DA8DA",
    }


def _draw_gradient_background(draw, width, height, theme):
    for y in range(height):
        ratio = y / max(1, height)
        r = int(6 + ratio * 4)
        g = int(20 + ratio * 10)
        b = int(38 + ratio * 18)
        draw.line((0, y, width, y), fill=(r, g, b))

    draw.ellipse((-260, -180, 860, 720), fill="#0A2746")
    draw.ellipse((1740, -220, 2600, 560), fill="#0C3152")
    if height > 1180:
        draw.rectangle((0, 1180, width, height), fill=theme["bg_2"])


def _draw_v2_panel(draw, box, title, fonts, theme, fill=None):
    fill = fill or theme["panel"]
    x1, y1, x2, y2 = box
    outline = theme["line_dark"] if fill == theme["panel_dark"] else theme["line"]
    draw.rounded_rectangle(box, radius=18, fill=fill, outline=outline, width=2)
    title_fill = theme["text"] if fill == theme["panel_dark"] else theme["ink"]
    draw.text((x1 + 24, y1 + 18), title.upper(), font=fonts["section"], fill=title_fill)


def _draw_dark_panel(draw, box, title, fonts, theme, fill=None):
    fill = fill or theme["panel_dark"]
    x1, y1, x2, y2 = box
    draw.rounded_rectangle(box, radius=16, fill=fill, outline=theme["line_dark"], width=2)
    draw.text((x1 + 22, y1 + 16), title.upper(), font=fonts["section"], fill=theme["text"])


def _draw_bullet_panel(draw, box, title, items, fonts, theme, icon_kind="heart", max_items=5):
    _draw_dark_panel(draw, box, title, fonts, theme)
    x1, y1, x2, _y2 = box
    y = y1 + 66

    for index, item in enumerate(_as_list(items)[:max_items]):
        if isinstance(item, dict):
            label = item.get("name") or item.get("principle") or item.get("stage") or item.get("title") or item.get("color") or "Item"
            description = item.get("description") or item.get("purpose") or item.get("meaning") or item.get("emotion") or ""
        else:
            label = str(item)
            description = ""

        _draw_icon(draw, (x1 + 42, y + 14), icon_kind, theme["pink"] if index % 2 else theme["cyan"], size=22, width=3)
        _draw_wrapped_text(draw, str(label).upper(), (x1 + 78, y), fonts["small_bold"], theme["text"], x2 - x1 - 102, max_lines=1)
        if description:
            y = _draw_wrapped_text(draw, description, (x1 + 78, y + 24), fonts["tiny"], theme["muted"], x2 - x1 - 102, line_spacing=3, max_lines=2)
        else:
            y += 32
        y += 12


def _draw_step_row(draw, box, title, items, fonts, theme):
    _draw_dark_panel(draw, box, title, fonts, theme)
    x1, y1, x2, y2 = box
    steps = _as_list(items)[:6]
    slot = (x2 - x1 - 52) / max(1, len(steps))

    for index, item in enumerate(steps):
        if isinstance(item, dict):
            label = item.get("name") or item.get("stage") or item.get("step") or f"Step {index + 1}"
            description = item.get("description") or item.get("purpose") or ""
        else:
            label = str(item)
            description = ""

        cx = int(x1 + 26 + slot * index + slot / 2)
        _draw_icon(draw, (cx, y1 + 82), ["pin", "heart", "book", "eye", "rocket", "star"][index % 6], theme["cyan"] if index % 2 else theme["pink"], size=28, width=3)
        number = f"{index + 1:02d}"
        bbox = draw.textbbox((0, 0), number, font=fonts["small_bold"])
        draw.text((cx - (bbox[2] - bbox[0]) / 2, y1 + 118), number, font=fonts["small_bold"], fill=theme["text"])
        bbox = draw.textbbox((0, 0), str(label).upper(), font=fonts["tiny"])
        draw.text((cx - (bbox[2] - bbox[0]) / 2, y1 + 142), str(label).upper(), font=fonts["tiny"], fill=theme["text"])
        _draw_wrapped_text(draw, description, (int(cx - slot / 2 + 12), y1 + 168), fonts["tiny"], theme["muted"], int(slot - 24), line_spacing=2, max_lines=3)


def _draw_format_strip(draw, box, title, formats, fonts, theme):
    _draw_dark_panel(draw, box, title, fonts, theme)
    x1, y1, x2, y2 = box
    values = _as_list(formats)[:6]
    slot = (x2 - x1 - 44) / max(1, len(values))

    for index, item in enumerate(values):
        label = item.get("name", "Formato") if isinstance(item, dict) else str(item)
        sx = int(x1 + 22 + slot * index)
        if index:
            draw.line((sx, y1 + 58, sx, y2 - 24), fill=theme["line_dark"], width=1)
        _draw_icon(draw, (sx + int(slot / 2), y1 + 82), ["card", "quote", "book", "mic", "play", "infinity"][index % 6], theme["cyan"] if index % 2 == 0 else theme["pink"], size=30, width=3)
        _draw_wrapped_text(draw, str(label).upper(), (sx + 8, y1 + 122), fonts["tiny"], theme["text"], int(slot - 16), max_lines=2)


def _draw_content_grid(draw, box, title, items, fonts, theme):
    _draw_dark_panel(draw, box, title, fonts, theme)
    x1, y1, x2, y2 = box
    values = _as_list(items)[:8]
    gap = 8
    cols = 4
    cell_w = int((x2 - x1 - 44 - gap * (cols - 1)) / cols)
    cell_h = int((y2 - y1 - 82 - gap) / 2)
    colors = [theme["blue"], theme["pink"], theme["cyan"], "#7C3AED", "#F5B85B", "#0E5A91"]

    for index, item in enumerate(values):
        col = index % cols
        row = index // cols
        px = x1 + 22 + col * (cell_w + gap)
        py = y1 + 64 + row * (cell_h + gap)
        draw.rounded_rectangle((px, py, px + cell_w, py + cell_h), radius=10, fill=colors[index % len(colors)])
        draw.rectangle((px, py + int(cell_h * 0.58), px + cell_w, py + cell_h), fill="#07121F")
        label = item.get("name") if isinstance(item, dict) else str(item)
        description = item.get("description", "") if isinstance(item, dict) else ""
        _draw_wrapped_text(draw, f"{index + 1}. {label}".upper(), (px + 10, py + int(cell_h * 0.62)), fonts["tiny"], "#FFFFFF", cell_w - 20, max_lines=1)
        if cell_h >= 105:
            _draw_wrapped_text(draw, description, (px + 10, py + int(cell_h * 0.78)), fonts["tiny"], theme["muted"], cell_w - 20, max_lines=2)


def _draw_quote_card(draw, box, quote, author, fonts, theme):
    _draw_dark_panel(draw, box, "", fonts, theme)
    x1, y1, x2, y2 = box
    compact = y2 - y1 < 190
    draw.text((x1 + 28, y1 + 22), "“", font=fonts["title"] if compact else fonts["hero"], fill=theme["pink"])
    _draw_wrapped_text(draw, quote, (x1 + 48, y1 + (58 if compact else 110)), fonts["body"] if compact else fonts["subtitle"], theme["text"], x2 - x1 - 86, max_lines=3 if compact else 5)
    draw.line((x1 + 48, y2 - 44, x1 + 130, y2 - 44), fill=theme["pink"], width=3)
    draw.text((x1 + 48, y2 - 28), str(author).upper(), font=fonts["tiny"] if compact else fonts["small_bold"], fill=theme["text"])


def _draw_icon(draw, center, kind, color, size=38, width=4):
    x, y = center
    r = size // 2

    if kind == "shield":
        points = [(x, y - r), (x + r, y - r // 3), (x + r // 2, y + r), (x, y + r + 8), (x - r // 2, y + r), (x - r, y - r // 3)]
        draw.line(points + [points[0]], fill=color, width=width, joint="curve")
        draw.line((x - 9, y + 3, x - 1, y + 12, x + 14, y - 10), fill=color, width=width)
    elif kind == "heart":
        draw.ellipse((x - r, y - r // 2, x, y + r // 2), outline=color, width=width)
        draw.ellipse((x, y - r // 2, x + r, y + r // 2), outline=color, width=width)
        draw.line((x - r, y, x, y + r + 8, x + r, y), fill=color, width=width)
    elif kind == "pin":
        draw.ellipse((x - r, y - r, x + r, y + r), outline=color, width=width)
        draw.ellipse((x - 8, y - 8, x + 8, y + 8), outline=color, width=width)
        draw.line((x, y + r, x, y + r + 28), fill=color, width=width)
    elif kind == "clock":
        draw.ellipse((x - r, y - r, x + r, y + r), outline=color, width=width)
        draw.line((x, y, x, y - r + 10), fill=color, width=width)
        draw.line((x, y, x + r - 8, y), fill=color, width=width)
    elif kind == "thumb":
        draw.rounded_rectangle((x - r, y - 4, x + r, y + r), radius=8, outline=color, width=width)
        draw.line((x - 8, y - 4, x + 2, y - r, x + 12, y - r, x + 8, y - 4), fill=color, width=width)
    elif kind == "book":
        draw.rectangle((x - r, y - r, x, y + r), outline=color, width=width)
        draw.rectangle((x, y - r, x + r, y + r), outline=color, width=width)
        draw.line((x, y - r, x, y + r), fill=color, width=width)
    elif kind == "eye":
        draw.arc((x - r, y - r // 2, x + r, y + r // 2), 0, 180, fill=color, width=width)
        draw.arc((x - r, y - r // 2, x + r, y + r // 2), 180, 360, fill=color, width=width)
        draw.ellipse((x - 6, y - 6, x + 6, y + 6), outline=color, width=width)
    elif kind == "rocket":
        draw.line((x - r, y + r, x + r, y - r, x + 4, y + r, x - r, y + r), fill=color, width=width)
        draw.line((x - r, y + r, x - r - 10, y + r + 16), fill=color, width=width)
    elif kind == "star":
        draw.line((x, y - r, x, y + r), fill=color, width=width)
        draw.line((x - r, y, x + r, y), fill=color, width=width)
        draw.line((x - r // 2, y - r // 2, x + r // 2, y + r // 2), fill=color, width=width)
        draw.line((x + r // 2, y - r // 2, x - r // 2, y + r // 2), fill=color, width=width)
    elif kind == "card":
        draw.rectangle((x - r, y - r // 2, x + r, y + r // 2), outline=color, width=width)
        draw.line((x - r + 8, y, x + r - 8, y), fill=color, width=width)
    elif kind == "quote":
        draw.arc((x - r, y - r, x, y), 90, 360, fill=color, width=width)
        draw.arc((x, y - r, x + r, y), 90, 360, fill=color, width=width)
    elif kind == "mic":
        draw.rounded_rectangle((x - 10, y - r, x + 10, y + 8), radius=8, outline=color, width=width)
        draw.arc((x - 22, y - 5, x + 22, y + 35), 0, 180, fill=color, width=width)
        draw.line((x, y + 28, x, y + r + 12), fill=color, width=width)
    elif kind == "play":
        draw.polygon([(x - r, y - r), (x - r, y + r), (x + r, y)], outline=color)
        draw.line((x - r, y - r, x - r, y + r, x + r, y, x - r, y - r), fill=color, width=width)
    elif kind == "infinity":
        draw.ellipse((x - r, y - r // 2, x, y + r // 2), outline=color, width=width)
        draw.ellipse((x, y - r // 2, x + r, y + r // 2), outline=color, width=width)
    else:
        draw.ellipse((x - r, y - r, x + r, y + r), outline=color, width=width)


def _draw_logo_placeholder_v2(draw, box, client_name, subtitle, promise, perception_angle, fonts, theme):
    x1, y1, x2, y2 = box
    draw.rounded_rectangle(box, radius=42, fill="#09233E", outline="#2B638C", width=3)
    draw.ellipse((x1 + 495, y1 + 70, x2 - 55, y1 + 430), fill="#0E5A91", outline="#BFE7FF", width=4)
    draw.arc((x1 + 545, y1 + 130, x2 - 110, y1 + 390), 190, 340, fill=theme["cyan"], width=24)
    draw.arc((x1 + 575, y1 + 170, x2 - 140, y1 + 420), 195, 335, fill=theme["pink"], width=22)
    draw.arc((x1 + 525, y1 + 105, x2 - 75, y1 + 355), 198, 328, fill="#FFFFFF", width=9)
    draw.text((x1 + 56, y1 + 58), str(subtitle or "Brand Identity Board").upper(), font=fonts["section"], fill=theme["pink"])
    _draw_wrapped_text(draw, str(client_name or "Brand").upper(), (x1 + 54, y1 + 112), fonts["hero"], "#FFFFFF", 455, line_spacing=4, max_lines=2)
    _draw_wrapped_text(draw, promise, (x1 + 58, y1 + 300), fonts["subtitle"], theme["muted"], 440, max_lines=3)
    draw.rounded_rectangle((x1 + 56, y2 - 116, x2 - 56, y2 - 40), radius=20, fill="#071A2F", outline=theme["line_dark"], width=2)
    _draw_wrapped_text(draw, perception_angle, (x1 + 86, y2 - 98), fonts["small_bold"], "#FFFFFF", x2 - x1 - 172, max_lines=2)


def _draw_values_row(draw, values, box, fonts, theme):
    icons = ["shield", "heart", "pin", "clock", "thumb"]
    x1, y1, x2, y2 = box
    slot = (x2 - x1) / max(1, len(values))

    for index, value in enumerate(values[:5]):
        cx = int(x1 + slot * index + slot / 2)
        _draw_icon(draw, (cx, y1 + 34), icons[index % len(icons)], theme["pink"] if index % 2 else theme["cyan"], size=34)
        label = str(value).upper()
        bbox = draw.textbbox((0, 0), label, font=fonts["tiny"])
        draw.text((cx - (bbox[2] - bbox[0]) / 2, y1 + 80), label, font=fonts["tiny"], fill=theme["text"])


def _safe_palette_items(spec):
    items = [item for item in _as_list(spec.get("palette")) if isinstance(item, dict)]
    defaults = [
        {"name": "Deep Base", "hex": "#0D1B2A", "meaning": "Premium depth"},
        {"name": "Blue Signal", "hex": "#1B7FC2", "meaning": "Trust and movement"},
        {"name": "Sky Accent", "hex": "#4DA8DA", "meaning": "Fresh clarity"},
        {"name": "Signature Pink", "hex": "#E94584", "meaning": "Emotional attention"},
        {"name": "White", "hex": "#FFFFFF", "meaning": "Clean contrast"},
    ]

    return (items + defaults)[:5]


def _draw_palette_panel_v2(draw, spec, box, fonts, theme):
    _draw_v2_panel(draw, box, "Paleta de colores", fonts, theme, fill=theme["panel_dark"])
    x1, y1, _x2, _y2 = box
    x = x1 + 26

    for item in _safe_palette_items(spec):
        color = item.get("hex", "#888888")
        try:
            draw.rounded_rectangle((x, y1 + 70, x + 128, y1 + 154), radius=12, fill=color, outline="#FFFFFF", width=2)
        except ValueError:
            draw.rounded_rectangle((x, y1 + 70, x + 128, y1 + 154), radius=12, fill="#888888", outline="#FFFFFF", width=2)

        draw.text((x, y1 + 170), color.upper(), font=fonts["small_bold"], fill=theme["text"])
        _draw_wrapped_text(draw, item.get("name", "Color"), (x, y1 + 196), fonts["tiny"], theme["muted"], 132, max_lines=2)
        x += 156


def _draw_logo_system_panel_v2(draw, spec, box, fonts, theme):
    _draw_v2_panel(draw, box, "Variantes de logo", fonts, theme, fill=theme["panel_dark"])
    x1, y1, x2, y2 = box
    client_name = spec.get("client_name", "Brand")
    draw.rounded_rectangle((x1 + 34, y1 + 70, x2 - 34, y1 + 140), radius=34, fill=theme["pink"], outline="#FFFFFF", width=2)
    _draw_wrapped_text(draw, client_name.upper(), (x1 + 76, y1 + 88), fonts["section"], "#FFFFFF", x2 - x1 - 152, max_lines=1)
    draw.text((x1 + 40, y1 + 162), "VERSION FLAT", font=fonts["tiny"], fill=theme["muted"])
    draw.rounded_rectangle((x1 + 40, y1 + 194, x1 + 245, y1 + 262), radius=16, fill="#FFFFFF")
    draw.text((x1 + 68, y1 + 216), client_name[:14].upper(), font=fonts["small_bold"], fill=theme["ink"])
    draw.rounded_rectangle((x1 + 285, y1 + 194, x1 + 490, y1 + 262), radius=16, fill="#07121F", outline="#FFFFFF", width=2)
    draw.text((x1 + 315, y1 + 216), client_name[:14].upper(), font=fonts["small_bold"], fill="#FFFFFF")
    draw.text((x1 + 40, y2 - 96), "ICONO / SIMBOLO", font=fonts["tiny"], fill=theme["muted"])
    draw.ellipse((x1 + 250, y2 - 112, x1 + 346, y2 - 16), fill="#FFFFFF", outline=theme["cyan"], width=3)
    draw.arc((x1 + 270, y2 - 88, x1 + 330, y2 - 32), 195, 340, fill=theme["pink"], width=10)
    draw.arc((x1 + 262, y2 - 98, x1 + 340, y2 - 42), 200, 330, fill=theme["blue"], width=10)


def _draw_typography_panel_v2(draw, spec, box, fonts, theme):
    _draw_v2_panel(draw, box, "Tipografias", fonts, theme, fill=theme["panel_dark"])
    x1, y1, x2, _y2 = box
    typography = spec.get("typography", {})
    _draw_wrapped_text(draw, str(typography.get("primary", "MONTSERRAT BOLD")).upper(), (x1 + 36, y1 + 82), fonts["section"], theme["text"], 310, max_lines=1)
    draw.text((x1 + 36, y1 + 138), "ABCDEFGHIJKLMN OPQRSTUVWXYZ", font=fonts["small"], fill=theme["text"])
    draw.text((x1 + 36, y1 + 170), "0123456789 !@#$%&*()", font=fonts["small"], fill=theme["text"])
    draw.line((x1 + 360, y1 + 78, x1 + 360, y1 + 205), fill=theme["line_dark"], width=2)
    _draw_wrapped_text(draw, str(typography.get("secondary", "OPEN SANS REGULAR")).upper(), (x1 + 400, y1 + 82), fonts["section"], theme["text"], x2 - x1 - 438, max_lines=1)
    draw.text((x1 + 400, y1 + 138), "abcdefghijklmn opqrstuvwxyz", font=fonts["small"], fill=theme["muted"])
    _draw_wrapped_text(draw, typography.get("usage", "Clean hierarchy for board, proposal and social assets."), (x1 + 36, y1 + 204), fonts["small"], theme["muted"], x2 - x1 - 72, max_lines=2)


def _draw_tone_panel_v2(draw, spec, box, fonts, theme):
    _draw_v2_panel(draw, box, "Tono de marca", fonts, theme, fill=theme["panel_dark"])
    x1, y1, x2, _y2 = box
    tones = _as_list(spec.get("tone_cards")) or _as_list(spec.get("brand_tone")) or [{"name": "Confianza", "description": "Lenguaje claro y confiable"}]
    icons = ["shield", "heart", "pin", "thumb"]
    slot = (x2 - x1 - 52) / 4

    for index in range(4):
        tone = tones[index % len(tones)]
        cx = int(x1 + 34 + slot * index + slot / 2)
        _draw_icon(draw, (cx, y1 + 74), icons[index], theme["cyan"] if index % 2 else theme["pink"], size=30)
        label = str(tone.get("name", "Tone")).upper()
        bbox = draw.textbbox((0, 0), label, font=fonts["small_bold"])
        draw.text((cx - (bbox[2] - bbox[0]) / 2, y1 + 112), label, font=fonts["small_bold"], fill=theme["text"])


def _draw_phone_mockup(draw, box, client_name, fonts, theme):
    x1, y1, x2, y2 = box
    draw.rounded_rectangle(box, radius=34, fill="#101827", outline="#0B0F18", width=5)
    draw.rounded_rectangle((x1 + 12, y1 + 42, x2 - 12, y2 - 12), radius=22, fill="#F7F8FA")
    draw.rectangle((x1 + 12, y1 + 88, x2 - 12, y1 + 150), fill="#102C4A")
    draw.ellipse((x1 + 32, y1 + 105, x1 + 82, y1 + 155), fill=theme["pink"])
    draw.text((x1 + 96, y1 + 108), client_name[:18], font=fonts["small_bold"], fill="#FFFFFF")
    y = y1 + 185

    for label in ["Traslados premium", "Atencion rapida", "Reserva simple", "Experiencia memorable"]:
        draw.ellipse((x1 + 34, y + 2, x1 + 54, y + 22), fill=theme["blue"])
        draw.text((x1 + 68, y), label, font=fonts["tiny"], fill=theme["ink"])
        y += 42


def _draw_applications_panel_v2(draw, spec, box, fonts, theme):
    _draw_v2_panel(draw, box, "Aplicaciones digitales", fonts, theme)
    x1, y1, x2, y2 = box
    client_name = spec.get("client_name", "Brand")
    card_w = int((x2 - x1 - 72) / 3)
    cards = [
        (x1 + 24, y1 + 70, x1 + 24 + card_w, y2 - 24),
        (x1 + 36 + card_w, y1 + 70, x1 + 36 + card_w * 2, y2 - 24),
        (x1 + 48 + card_w * 2, y1 + 70, x2 - 24, y2 - 24),
    ]
    draw.rounded_rectangle(cards[0], radius=14, fill="#FFFFFF", outline=theme["line"])
    draw.text((cards[0][0] + 34, cards[0][1] + 28), "FOTO PERFIL", font=fonts["small_bold"], fill=theme["ink"])
    draw.ellipse((cards[0][0] + 52, cards[0][1] + 92, cards[0][0] + 180, cards[0][1] + 220), fill=theme["bg"])
    draw.arc((cards[0][0] + 78, cards[0][1] + 126, cards[0][0] + 156, cards[0][1] + 195), 200, 340, fill=theme["pink"], width=16)
    draw.text((cards[0][0] + 48, cards[0][3] - 74), "@brand.profile", font=fonts["small"], fill=theme["ink"])
    _draw_phone_mockup(draw, cards[1], client_name, fonts, theme)
    draw.rounded_rectangle(cards[2], radius=14, fill="#FFFFFF", outline=theme["line"])
    draw.text((cards[2][0] + 40, cards[2][1] + 28), "FAVICON / WEB", font=fonts["small_bold"], fill=theme["ink"])
    draw.ellipse((cards[2][0] + 72, cards[2][1] + 110, cards[2][0] + 198, cards[2][1] + 236), fill=theme["bg"])
    draw.rounded_rectangle((cards[2][0] + 26, cards[2][3] - 88, cards[2][2] - 26, cards[2][3] - 38), radius=12, fill="#E8F0F8")
    draw.text((cards[2][0] + 48, cards[2][3] - 74), "www.brand.com", font=fonts["tiny"], fill=theme["ink"])


def _draw_instagram_feed_v2(draw, spec, box, fonts, theme):
    _draw_v2_panel(draw, box, "Feed Instagram", fonts, theme, fill=theme["panel_dark"])
    x1, y1, x2, y2 = box
    pillars = _as_list(spec.get("instagram_style")) or [{"pillar": "Autoridad", "description": "Contenido premium"}]
    gap = 8
    size = int((x2 - x1 - 52 - gap * 2) / 3)
    colors = [theme["blue"], theme["pink"], theme["cyan"], "#F5B85B", "#FFFFFF"]

    for row in range(3):
        for col in range(3):
            index = row * 3 + col
            px = x1 + 26 + col * (size + gap)
            py = y1 + 72 + row * (size + gap)
            draw.rounded_rectangle((px, py, px + size, py + size), radius=8, fill=colors[index % len(colors)])
            draw.rectangle((px, py + int(size * 0.58), px + size, py + size), fill="#071A2F")
            item = pillars[index % len(pillars)]
            _draw_wrapped_text(draw, item.get("pillar", "POST").upper(), (px + 10, py + int(size * 0.64)), fonts["tiny"], "#FFFFFF", size - 20, max_lines=2)


def _draw_commercial_panel_v2(draw, spec, box, fonts, theme):
    _draw_v2_panel(draw, box, "Propuesta comercial", fonts, theme)
    x1, y1, x2, y2 = box
    offer = spec.get("commercial_offer") or spec.get("commercial_example", {})
    draw.rounded_rectangle((x1 + 26, y1 + 74, x1 + 300, y2 - 28), radius=18, fill="#102C4A")
    draw.text((x1 + 55, y1 + 128), spec.get("client_name", "BRAND").upper(), font=fonts["title"], fill="#FFFFFF")
    draw.text((x1 + 55, y1 + 245), "PROPUESTA", font=fonts["subtitle"], fill="#FFFFFF")
    draw.text((x1 + 55, y1 + 280), "PERSONALIZADA", font=fonts["subtitle"], fill="#FFFFFF")
    detail_x = x1 + 340
    draw.line((detail_x, y1 + 90, x2 - 32, y1 + 90), fill=theme["line"], width=2)
    offer_title = offer.get("title") or offer.get("offer") or "Premium brand package"
    offer_promise = offer.get("promise") or spec.get("brand_promise") or "Turn scattered signals into a premium brand system."
    draw.text((detail_x + 24, y1 + 118), str(offer_title).upper(), font=fonts["section"], fill=theme["ink"])
    _draw_wrapped_text(draw, offer_promise, (detail_x + 24, y1 + 154), fonts["small"], theme["muted_dark"], x2 - detail_x - 70, max_lines=3)
    y = y1 + 245

    for service in _as_list(offer.get("services"))[:4] or ["Diagnosis", "Identity", "Content", "Roadmap"]:
        draw.ellipse((detail_x + 28, y + 4, detail_x + 50, y + 26), fill=theme["pink"])
        draw.text((detail_x + 66, y), str(service), font=fonts["body"], fill=theme["ink"])
        y += 44

    draw.rounded_rectangle((detail_x + 20, y2 - 104, x2 - 32, y2 - 42), radius=12, fill=theme["pink"])
    draw.text((detail_x + 48, y2 - 88), str(offer.get("cta", "Book a strategic session")).upper(), font=fonts["section"], fill="#FFFFFF")


def _draw_benefits_footer_v2(draw, spec, box, fonts, theme):
    benefit_bar = _as_list(spec.get("benefit_bar"))
    benefits = [{"name": item, "description": ""} for item in benefit_bar] if benefit_bar else _as_list(spec.get("benefits")) or [
        {"name": "Seguridad", "description": "Decision clara"},
        {"name": "Puntualidad", "description": "Sistema repetible"},
        {"name": "Atencion 24/7", "description": "Operacion lista"},
        {"name": "Experiencias unicas", "description": "Valor memorable"},
        {"name": "Servicio premium", "description": "Percepcion elevada"},
    ]
    icons = ["shield", "clock", "heart", "thumb", "pin"]
    x1, y1, x2, y2 = box
    slot = (x2 - x1) / 5

    for index in range(5):
        benefit = benefits[index % len(benefits)]
        sx = int(x1 + slot * index)
        _draw_icon(draw, (sx + 54, y1 + 52), icons[index], theme["pink"] if index % 2 == 0 else theme["cyan"], size=36)
        draw.text((sx + 110, y1 + 24), str(benefit.get("name", "Benefit")).upper(), font=fonts["section"], fill=theme["text"])
        _draw_wrapped_text(draw, benefit.get("description", ""), (sx + 110, y1 + 64), fonts["small"], theme["muted"], int(slot - 135), max_lines=2)

        if index < 4:
            draw.line((int(x1 + slot * (index + 1)), y1 + 22, int(x1 + slot * (index + 1)), y2 - 22), fill=theme["line_dark"], width=2)

    footer_claim = spec.get("footer_claim")
    if footer_claim:
        _draw_wrapped_text(draw, footer_claim, (x2 - 650, y2 - 42), fonts["small_bold"], "#FFFFFF", 600, max_lines=2)


def _draw_strategy_statement_v2(draw, spec, box, fonts, theme):
    _draw_v2_panel(draw, box, "Autoridad visual", fonts, theme, fill=theme["panel_dark"])
    x1, y1, x2, y2 = box
    _draw_icon(draw, (x1 + 58, y1 + 92), "shield", theme["cyan"], size=38)
    _draw_wrapped_text(draw, spec.get("visual_authority", "Create authority through consistent composition and recognizable assets."), (x1 + 110, y1 + 70), fonts["small_bold"], theme["text"], x2 - x1 - 145, max_lines=3)
    draw.line((x1 + 28, y1 + 154, x2 - 28, y1 + 154), fill=theme["line_dark"], width=2)
    _draw_wrapped_text(draw, spec.get("premium_positioning", "Elevate the brand with clearer hierarchy and controlled visual language."), (x1 + 34, y1 + 178), fonts["small"], theme["muted"], x2 - x1 - 68, max_lines=4)


def _render_brand_identity_board_image(spec, output_path):
    from PIL import Image, ImageDraw

    width, height = 2400, 1350
    theme = _brand_v2_theme()
    fonts = _brand_v2_fonts()
    image = Image.new("RGB", (width, height), theme["bg"])
    draw = ImageDraw.Draw(image)
    client_name = spec.get("hero_title") or spec.get("client_name", "Brand")
    subtitle = spec.get("hero_subtitle") or "Brand Identity Board"
    brand_promise = spec.get("brand_promise") or spec.get("tagline") or "Premium brand system"
    perception_angle = spec.get("perception_angle") or "Make value felt before it is explained."
    descriptor = spec.get("brand_descriptor") or brand_promise
    values = [str(item) for item in _as_list(spec.get("benefit_bar"))[:5]]

    if not values:
        values = [item.get("name", "Valor") for item in _as_list(spec.get("benefits"))[:5] if isinstance(item, dict)]

    while len(values) < 5:
        values.append(["Confianza", "Cercania", "Experiencia", "Pasion", "Servicio"][len(values)])

    _draw_gradient_background(draw, width, height, theme)
    _draw_logo_placeholder_v2(draw, (38, 48, 855, 635), client_name, subtitle, brand_promise, perception_angle, fonts, theme)
    _draw_wrapped_text(draw, descriptor, (95, 660), fonts["subtitle"], theme["muted"], 690, max_lines=3)
    _draw_values_row(draw, values, (80, 785, 820, 900), fonts, theme)
    _draw_logo_system_panel_v2(draw, spec, (890, 36, 1455, 405), fonts, theme)
    _draw_strategy_statement_v2(draw, spec, (890, 430, 1455, 610), fonts, theme)
    _draw_palette_panel_v2(draw, spec, (1490, 36, 2360, 250), fonts, theme)
    _draw_typography_panel_v2(draw, spec, (1490, 285, 2360, 455), fonts, theme)
    _draw_tone_panel_v2(draw, spec, (1490, 490, 2360, 610), fonts, theme)
    _draw_applications_panel_v2(draw, spec, (38, 925, 855, 1168), fonts, theme)
    _draw_instagram_feed_v2(draw, spec, (890, 635, 1455, 1168), fonts, theme)
    _draw_commercial_panel_v2(draw, spec, (1490, 635, 2360, 1168), fonts, theme)
    _draw_benefits_footer_v2(draw, spec, (38, 1188, 2360, 1330), fonts, theme)
    image.save(output_path, format="PNG")


def _render_storytelling_strategy_board_image(spec, output_path):
    from PIL import Image, ImageDraw

    width, height = VISUAL_BOARD_IMAGE_SIZE
    theme = _brand_v2_theme()
    theme.update(
        {
            "bg": "#050813",
            "bg_2": "#07121F",
            "panel_dark": "#080E1E",
            "line_dark": "#30384D",
            "muted": "#C7D0E8",
            "pink": "#FF2F91",
            "cyan": "#00D5FF",
            "blue": "#6D45FF",
        }
    )
    fonts = _brand_v2_fonts()
    image = Image.new("RGB", (width, height), theme["bg"])
    draw = ImageDraw.Draw(image)
    _draw_gradient_background(draw, width, height, theme)

    client_name = spec.get("client_name", "Brand")
    draw.ellipse((-180, -260, 620, 540), fill="#081A37")
    draw.ellipse((640, -240, 1280, 380), fill="#1A0A31")
    draw.ellipse((1350, 760, 2260, 1500), fill="#081B2A")
    draw.text((44, 42), client_name.upper(), font=fonts["small_bold"], fill=theme["muted"])
    draw.text((44, 78), "STORYTELLING", font=_load_board_font(64, bold=True), fill=theme["text"])
    draw.text((48, 168), "SISTEMA DE NARRATIVA EMOCIONAL Y CINEMATOGRAFICA", font=fonts["section"], fill=theme["text"])
    _draw_wrapped_text(draw, spec.get("storyworld", ""), (48, 218), fonts["body"], theme["muted"], 500, max_lines=3)

    _draw_bullet_panel(draw, (18, 300, 570, 680), f"Esencia del storytelling de {client_name}", spec.get("story_essence"), fonts, theme, "heart", max_items=5)
    _draw_bullet_panel(draw, (18, 696, 570, 900), "Pilares emocionales", spec.get("emotional_pillars"), fonts, theme, "star", max_items=5)
    _draw_dark_panel(draw, (18, 916, 570, 1018), "Tono & voz", fonts, theme)
    tone = spec.get("tone_voice", {})
    _draw_wrapped_text(draw, ", ".join(tone.get("keywords", [])), (44, 968), fonts["body"], theme["muted"], 480, max_lines=2)

    _draw_dark_panel(draw, (600, 34, 1228, 202), "Objetivo del storytelling", fonts, theme)
    _draw_wrapped_text(draw, spec.get("story_objective"), (632, 86), fonts["body"], theme["text"], 380, max_lines=4)
    draw.rounded_rectangle((1025, 58, 1196, 178), radius=18, fill="#101D34", outline=theme["line_dark"], width=2)
    _draw_wrapped_text(draw, spec.get("emotional_tension", ""), (1048, 84), fonts["small_bold"], theme["pink"], 128, max_lines=3)

    _draw_step_row(draw, (600, 220, 1228, 462), "Framework de storytelling", spec.get("storytelling_steps") or spec.get("framework"), fonts, theme)
    _draw_content_grid(draw, (600, 480, 1228, 840), "Pilares de contenido storytelling", spec.get("content_pillars"), fonts, theme)
    _draw_step_row(draw, (600, 858, 1228, 1018), "La estructura de toda historia", spec.get("story_structure"), fonts, theme)

    _draw_format_strip(draw, (1252, 34, 1886, 190), "Formatos de storytelling", spec.get("formats"), fonts, theme)
    _draw_bullet_panel(draw, (1252, 210, 1625, 650), "Sistemas de storytelling", spec.get("systems"), fonts, theme, "book", max_items=6)
    _draw_quote_card(draw, (1644, 210, 1886, 650), "Las marcas que perduran no tienen mejores disenos. Tienen mejores historias.", client_name, fonts, theme)
    _draw_bullet_panel(draw, (1252, 670, 1886, 970), "Reglas de oro del storytelling", spec.get("golden_rules"), fonts, theme, "eye", max_items=6)

    claims = _as_list(spec.get("bottom_claims")) or [spec.get("closing_manifesto")]
    x = 120
    for claim in claims[:3]:
        _draw_icon(draw, (x, 1038), "star", theme["cyan"] if x == 120 else theme["pink"], size=26, width=3)
        _draw_wrapped_text(draw, str(claim).upper(), (x + 48, 1022), fonts["small_bold"], theme["text"], 360, max_lines=2)
        x += 520

    image.save(output_path, format="PNG")


def _render_visual_universe_board_image(spec, output_path):
    from PIL import Image, ImageDraw

    width, height = VISUAL_BOARD_IMAGE_SIZE
    theme = _brand_v2_theme()
    theme.update(
        {
            "bg": "#F4E8D6",
            "bg_2": "#173E33",
            "panel": "#F7EBDD",
            "panel_dark": "#F7EBDD",
            "line": "#C99A52",
            "line_dark": "#B88438",
            "text": "#111827",
            "ink": "#111827",
            "muted": "#293B34",
            "muted_dark": "#4F4232",
            "pink": "#C88A36",
            "cyan": "#183F34",
            "blue": "#0E5A55",
        }
    )
    fonts = _brand_v2_fonts()
    image = Image.new("RGB", (width, height), "#173E33")
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, width, height - 92), fill="#F4E8D6")
    draw.ellipse((-260, -220, 720, 620), fill="#E5C799")
    draw.ellipse((1280, 520, 2140, 1260), fill="#E7CFA8")

    client_name = spec.get("client_name", "Brand")
    draw.rounded_rectangle((24, 24, 626, 342), radius=18, fill="#183F34")
    draw.text((96, 54), client_name[:1].upper(), font=_load_board_font(138, bold=True), fill="#F7EBDD")
    draw.text((84, 184), client_name.upper(), font=fonts["title"], fill="#F7EBDD")
    _draw_wrapped_text(draw, spec.get("core_essence"), (84, 232), fonts["body"], "#F7EBDD", 470, max_lines=3)

    central = spec.get("central_essence") or {}
    central_signals = central.get("signals") or [spec.get("visual_mood"), spec.get("brand_soul"), spec.get("core_essence")]
    _draw_bullet_panel(draw, (650, 24, 895, 342), "Esencia central", central_signals, fonts, theme, "shield", max_items=5)
    _draw_bullet_panel(draw, (910, 24, 1138, 342), "Atmosfera general", spec.get("general_atmosphere"), fonts, theme, "star", max_items=5)
    _draw_dark_panel(draw, (1154, 24, 1418, 342), "Paleta emocional", fonts, theme)
    y = 92
    for item in _as_list(spec.get("emotional_palette"))[:5]:
        color = item.get("hex", "#FFFFFF")
        try:
            draw.rounded_rectangle((1184, y, 1236, y + 28), radius=6, fill=color)
        except ValueError:
            draw.rounded_rectangle((1184, y, 1236, y + 28), radius=6, fill="#FFFFFF")
        draw.text((1250, y + 2), str(item.get("name", color)), font=fonts["tiny"], fill=theme["ink"])
        y += 42
    _draw_bullet_panel(draw, (1434, 24, 1896, 342), "Significado de los colores", spec.get("color_significance") or spec.get("color_meanings"), fonts, theme, "eye", max_items=5)

    _draw_bullet_panel(draw, (24, 365, 535, 590), "Iluminacion", spec.get("lighting"), fonts, theme, "star", max_items=6)
    _draw_bullet_panel(draw, (552, 365, 905, 590), "Composicion visual", spec.get("composition"), fonts, theme, "pin", max_items=5)
    _draw_content_grid(draw, (920, 365, 1395, 590), "Estilo cinematografico", [{"name": item, "description": ""} for item in _as_list(spec.get("cinematic_style"))], fonts, theme)
    _draw_bullet_panel(draw, (1410, 365, 1896, 590), "Elementos visuales oficiales", spec.get("official_visual_elements") or spec.get("official_elements"), fonts, theme, "heart", max_items=5)

    _draw_bullet_panel(draw, (24, 610, 535, 805), "Motion system", spec.get("motion_system"), fonts, theme, "rocket", max_items=5)
    _draw_dark_panel(draw, (552, 610, 905, 805), "Tipografia oficial", fonts, theme)
    typography = spec.get("typography", {})
    draw.text((584, 684), str(typography.get("title", "Editorial Display")).upper(), font=fonts["section"], fill=theme["ink"])
    draw.text((584, 724), str(typography.get("body", "Readable Sans")).upper(), font=fonts["body"], fill=theme["muted_dark"])
    _draw_content_grid(draw, (920, 610, 1370, 805), "El Instagram", [{"name": item, "description": ""} for item in _as_list(spec.get("instagram_direction"))], fonts, theme)
    _draw_bullet_panel(draw, (1386, 610, 1896, 805), "Estilo de reels", spec.get("reels_rules") or spec.get("reels_style"), fonts, theme, "play", max_items=5)

    _draw_dark_panel(draw, (24, 825, 575, 970), f"El alma de {client_name}", fonts, theme)
    _draw_wrapped_text(draw, spec.get("soul_statement") or spec.get("brand_soul"), (56, 884), fonts["body"], theme["ink"], 480, max_lines=4)
    _draw_quote_card(draw, (592, 825, 940, 970), "No solo se ve mejor. Se siente mas claro, mas deseable y mas recordable.", client_name, fonts, theme)
    _draw_bullet_panel(draw, (958, 825, 1268, 970), "Nuestros pilares", spec.get("pillars"), fonts, theme, "shield", max_items=4)
    _draw_dark_panel(draw, (1285, 825, 1896, 970), "Objetivo final", fonts, theme)
    _draw_wrapped_text(draw, spec.get("final_objective"), (1320, 884), fonts["body"], theme["ink"], 530, max_lines=4)

    draw.rectangle((0, height - 92, width, height), fill="#173E33")
    footer_items = ["Identidad", "Percepcion", "Emocion", "Autenticidad", "Hospitalidad", "Conexion", "Memorable"]
    x = 78
    for item in footer_items:
        _draw_icon(draw, (x, height - 48), "star", "#C88A36", size=20, width=2)
        draw.text((x + 32, height - 58), item.upper(), font=fonts["tiny"], fill="#F7EBDD")
        x += 250

    image.save(output_path, format="PNG")


def _write_visual_board_image(visuals_dir, board_name, spec, renderer, timestamp):
    target_path = visuals_dir / f"{board_name}.png"
    versioned = False

    if target_path.exists():
        target_path = _versioned_deliverable_path(target_path, timestamp)
        versioned = True

    renderer(spec, target_path)

    return target_path, versioned


def render_client_visual_board_images(client_name):
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    specs, source_specs = _load_visual_board_specs(client_path)
    visuals_dir = _safe_visuals_dir(client_path)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    renderers = {
        "brand_identity_board": _render_brand_identity_board_image,
        "storytelling_strategy_board": _render_storytelling_strategy_board_image,
        "visual_universe_board": _render_visual_universe_board_image,
    }
    created = []
    versioned = []

    for board_name, renderer in renderers.items():
        path, was_versioned = _write_visual_board_image(visuals_dir, board_name, specs[board_name], renderer, timestamp)
        relative_path = _client_relative_path(client_path, path)
        created.append(relative_path)

        if was_versioned:
            versioned.append(relative_path)

    return {
        "client": resolved_client_name,
        "base": VISUALS_BASE_FOLDER,
        "created": created,
        "versioned": versioned,
        "source_specs": source_specs,
        "renderer": "pillow",
        "used_ai": False,
    }


def _load_deliverable_markdown_files(client_path, deliverables_dir):
    included = []

    for title, filename in MASTER_DELIVERABLE_SOURCES:
        path = deliverables_dir / filename

        if not path.is_file():
            continue

        if not _is_allowed_deliverable_item(path, deliverables_dir):
            continue

        if path.suffix.casefold() != ".md":
            continue

        included.append(
            {
                "title": title,
                "path": path,
                "relative_path": _client_relative_path(client_path, path),
                "content": path.read_text(encoding="utf-8").strip(),
            }
        )

    if not included:
        raise ValueError("No valid Markdown deliverables found in 05_ENTREGAS.")

    return included


def _latest_visual_for_name(visuals_dir, filename):
    direct_path = visuals_dir / filename

    if direct_path.is_file():
        return direct_path

    stem = Path(filename).stem
    candidates = sorted(
        visuals_dir.glob(f"{stem}_*.png"),
        key=lambda path: path.stat().st_mtime,
        reverse=True,
    )

    return candidates[0] if candidates else None


def _list_visual_references(client_path, deliverables_dir):
    visuals_dir = deliverables_dir / "visuals"

    if not visuals_dir.is_dir():
        return []

    resolved_deliverables_dir = deliverables_dir.resolve()
    resolved_visuals_dir = visuals_dir.resolve()

    if resolved_deliverables_dir not in resolved_visuals_dir.parents:
        return []

    references = []

    for filename in MASTER_VISUAL_REFERENCES:
        path = _latest_visual_for_name(visuals_dir, filename)

        if not path:
            continue

        references.append(_client_relative_path(client_path, path))

    return references


def _render_master_deliverable(client_name, included, visual_references):
    generated_at = datetime.now().isoformat(timespec="seconds")
    lines = [
        f"# Master Brand Experience - {client_name}",
        "",
        "## Portada",
        "",
        f"- Cliente: {client_name}",
        f"- Fecha de generacion: {generated_at}",
        "- Fuente: LATEST_ANALYSIS y entregables textuales existentes en 05_ENTREGAS",
        "",
        "## Indice",
        "",
    ]

    for index, item in enumerate(included, start=1):
        lines.append(f"{index}. {item['title']}")

    if visual_references:
        lines.append(f"{len(included) + 1}. Apendice: visuales generados")

    lines.append("")

    for item in included:
        lines.extend(
            [
                "---",
                "",
                f"# {item['title']}",
                "",
                f"_Fuente: {item['relative_path']}_",
                "",
                item["content"] or "_Sin contenido._",
                "",
            ]
        )

    if visual_references:
        lines.extend(
            [
                "---",
                "",
                "# Apendice: visuales generados",
                "",
                "Las imagenes no se incrustan en este documento. Se listan solo como rutas relativas:",
                "",
            ]
        )

        for relative_path in visual_references:
            lines.append(f"- {relative_path}")

        lines.append("")

    return "\n".join(lines).rstrip() + "\n"


MASTER_INCLUDED_SECTIONS = [
    "Lectura de Entidad",
    "Diagnostico de Percepcion",
    "Nucleo Identitario",
    "ADN de Marca",
    "Storytelling y Narrativa",
    "Universo Visual",
    "Estrategia de Contenido",
    "Experiencia y Touchpoints",
    "Prompts IA",
    "Plan de Accion",
    "Visual Boards",
]


def _read_optional_board_spec(client_path, board_name):
    path = client_path / BOARD_SPECS_BASE_FOLDER / f"{board_name}.json"

    if not path.is_file():
        return None

    resolved_client_path = client_path.resolve()
    resolved_path = path.resolve()

    if resolved_client_path not in resolved_path.parents:
        return None

    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return None


def _format_master_scorecard(scorecard):
    values = _as_list(scorecard)

    if not values:
        return "- No disponible en el analisis actual."

    return "\n".join(
        f"- **{item.get('label', 'Criterio')}**: {item.get('score', 'n/a')} ({item.get('status', 'n/a')}). {item.get('action', '')}"
        for item in values
    )


def _format_master_priorities(priorities):
    values = _as_list(priorities)

    if not values:
        return "- No disponible en el analisis actual."

    return "\n".join(
        f"- **{item.get('title', 'Prioridad')}** [{item.get('urgency', 'n/a')}]: {item.get('action') or item.get('reason') or 'Pendiente de definir.'}"
        for item in values
    )


def _format_master_deliverables(deliverables):
    values = _as_list(deliverables)

    if not values:
        return "- No disponible en el analisis actual."

    lines = []

    for item in values:
        lines.append(f"- **{item.get('name', 'Entregable')}**: {item.get('outcome', 'Pendiente de definir.')}")

        for action in _as_list(item.get("actions"))[:3]:
            lines.append(f"  - {action}")

    return "\n".join(lines)


def _format_master_content_pillars(pillars):
    values = _as_list(pillars)

    if not values:
        return "- No disponible en el analisis actual."

    return "\n".join(
        f"- **{item.get('name', 'Pilar')}**: {item.get('role', item.get('description', 'Pendiente de definir.'))}"
        for item in values
    )


def _format_master_ai_prompts(prompts):
    values = _as_list(prompts)

    if not values:
        return "No disponible en el analisis actual."

    lines = []

    for item in values:
        lines.extend(
            [
                f"### {item.get('name', 'Prompt')}",
                "",
                item.get("prompt", "No disponible en el analisis actual."),
                "",
            ]
        )

    return "\n".join(lines).strip()


def _format_master_list(items):
    values = _as_list(items)

    if not values:
        return "- No disponible en el analisis actual."

    return "\n".join(f"- {item}" for item in values)


def _load_master_entity_bible_context():
    try:
        return load_entity_bible_for_master(max_total_chars=12_000)
    except Exception:
        return ""


def _entity_bible_signal(entity_bible_context):
    if not entity_bible_context:
        return "Entity Bible no disponible; se usa estructura fallback del sistema."

    source = entity_bible_context.lower()
    signals = []

    checks = [
        ("Marca como entidad", ["entidad", "entity"]),
        ("Percepcion antes de comunicacion", ["percepcion", "perception"]),
        ("Identidad antes del diseno", ["identidad", "identity"]),
        ("Storytelling como sistema de transformacion", ["storytelling", "narrativa"]),
        ("Universo visual como traduccion emocional", ["visual", "atmosfera", "atmosphere"]),
        ("Lujo emocional y valor percibido", ["lujo", "luxury", "premium"]),
        ("Tono de voz consistente", ["tono", "voice"]),
        ("Posicionamiento con autoridad", ["posicionamiento", "positioning"]),
    ]

    for label, keywords in checks:
        if any(keyword in source for keyword in keywords):
            signals.append(label)

    if not signals:
        signals.append("Marco conceptual curado de Brand Experience OS")

    return "\n".join(f"- {signal}" for signal in signals[:6])


def _format_board_spec_summary(spec, fallback_title):
    if not spec:
        return f"No hay spec dedicada para {fallback_title}. Se recomienda regenerar visual boards desde el analisis actual."

    lines = []

    for key, value in spec.items():
        if key in {"generated_at", "source"}:
            continue

        title = key.replace("_", " ").title()

        if isinstance(value, str):
            lines.append(f"- **{title}**: {value}")
        elif isinstance(value, list):
            lines.append(f"- **{title}**:")

            for item in value[:6]:
                if isinstance(item, dict):
                    label = item.get("name") or item.get("pillar") or item.get("principle") or item.get("stage") or item.get("color") or "Item"
                    description = item.get("description") or item.get("meaning") or item.get("emotion") or item.get("purpose") or item.get("role") or ""
                    lines.append(f"  - {label}: {description}".rstrip())
                else:
                    lines.append(f"  - {item}")
        elif isinstance(value, dict):
            lines.append(f"- **{title}**:")

            for inner_key, inner_value in value.items():
                if isinstance(inner_value, list):
                    inner_value = ", ".join(str(item) for item in inner_value)

                lines.append(f"  - {inner_key.replace('_', ' ').title()}: {inner_value}")

    return "\n".join(lines) or f"No disponible en la spec actual de {fallback_title}."


def _render_master_from_latest_analysis(client_name, analysis_payload, markdown_text, source_paths, board_specs, visual_references):
    generated_at = datetime.now().isoformat(timespec="seconds")
    analysis = _analysis_from_payload(analysis_payload)
    diagnosis = analysis.get("diagnosis") or {}
    source_used = source_paths.get("json") or source_paths.get("markdown") or "LATEST_ANALYSIS"
    headline = analysis.get("headline") or "No disponible en el analisis actual."
    markdown_fallback = markdown_text.strip() or "No disponible en el analisis actual."
    entity_bible_context = _load_master_entity_bible_context()
    entity_bible_note = "Disponible y aplicada como marco conceptual." if entity_bible_context else "No disponible; se uso fallback estructural."
    entity_bible_signal = _entity_bible_signal(entity_bible_context)

    if not analysis:
        entity_reading_block = markdown_fallback
        perception_block = markdown_fallback
        identity_block = markdown_fallback
        brand_dna_block = markdown_fallback
        storytelling_block = markdown_fallback
        visual_block = markdown_fallback
        content_block = markdown_fallback
        experience_block = markdown_fallback
        action_block = markdown_fallback
    else:
        entity_reading_block = f"""## Que entidad de marca esta emergiendo

{headline}

## Marco Entity Bible aplicado

{entity_bible_signal}

## Como se percibe

- Estado actual: {diagnosis.get('current_state', 'No disponible.')}
- Energia transmitida: marca con potencial de sistema, pero necesita codigos repetibles para ser reconocible.
- Tension principal: {diagnosis.get('main_gap', 'No disponible.')}
- Decision de entidad: {diagnosis.get('strategic_decision', 'No disponible.')}
"""
        perception_block = f"""## Percepcion actual

- Estado actual: {diagnosis.get('current_state', 'No disponible.')}
- Brecha principal: {diagnosis.get('main_gap', 'No disponible.')}
- Oportunidad de posicionamiento: {diagnosis.get('strategic_decision', headline)}

## Score general

- Overall score: {analysis.get('overall_score', 'n/a')}
- Confidence: {analysis.get('confidence', 'n/a')}

## Scorecard

{_format_master_scorecard(analysis.get('scorecard'))}
"""
        identity_block = f"""## Proposito

{diagnosis.get('strategic_decision', headline)}

## Promesa

Convertir la percepcion actual en una experiencia de marca clara, confiable y repetible.

## Diferenciacion

{_format_master_priorities(analysis.get('priorities'))}

## Personalidad

Precisa, sensorial, estrategica y orientada a transformacion.

## Tono de voz

Claro, premium, directo y emocionalmente inteligente.
"""
        brand_dna_block = f"""## Esencia

{headline}

## Arquetipos

- Autoridad experta
- Guia transformacional
- Curador de experiencia

## Territorio simbolico

Percepcion, deseo, confianza, experiencia, autoridad visual y transformacion.

## Creencias

{entity_bible_signal}

## Valores

Claridad, coherencia, belleza funcional, precision emocional y ejecucion.

## Limites de marca

{_format_master_list(analysis.get('risks'))}
"""
        storytelling_block = f"""## Relato principal

{diagnosis.get('strategic_decision', headline)}

## Estructura narrativa

- Situacion actual: {diagnosis.get('current_state', 'No disponible.')}
- Conflicto: {diagnosis.get('main_gap', 'No disponible.')}
- Transformacion: convertir senales dispersas en un sistema de marca.
- Prueba: reglas visuales, contenido, experiencia y entregables reutilizables.
- Accion: ejecutar el proximo sprint.

## Pilares emocionales

{_format_master_content_pillars(analysis.get('content_pillars'))}

## Mensajes clave

{_format_master_priorities(analysis.get('priorities'))}

## Manifiesto corto

La marca no necesita sonar mas fuerte. Necesita transmitir con mas precision.
"""
        visual_block = f"""## Atmosfera

Premium, clara, emocional y reconocible.

## Paleta emocional

Debe expresar confianza, autoridad, deseo y calma visual.

## Lenguaje visual

{diagnosis.get('strategic_decision', headline)}

## Composicion y estilo cinematografico

## Senales visuales prioritarias

{_format_master_scorecard([item for item in _as_list(analysis.get('scorecard')) if item.get('key') in {'visual_coherence', 'premium_perception'}])}
"""
        content_block = f"""## Pilares de contenido

{_format_master_content_pillars(analysis.get('content_pillars'))}

## Prioridades editoriales

{_format_master_priorities(analysis.get('priorities'))}
"""
        experience_block = f"""## Primer contacto

La primera impresion debe transmitir autoridad, claridad y valor percibido antes de explicar demasiado.

## Experiencia digital

Usar Instagram, links, propuesta y piezas visuales como un sistema coherente, no como activos sueltos.

## Experiencia comercial

Traducir la promesa en oferta, prueba, CTA y secuencia de confianza.

## Momentos memorables

- Frase madre de marca.
- Codigo visual repetible.
- Propuesta comercial clara.
- Entregables que convierten analisis en accion.
"""
        action_block = f"""## Proximo sprint

{_format_master_list(analysis.get('next_sprint'))}

## Prioridades

{_format_master_priorities(analysis.get('priorities'))}

## Riesgos

{_format_master_list(analysis.get('risks'))}
"""

    sections = [
        ("Lectura de Entidad", entity_reading_block),
        ("Diagnostico de Percepcion", perception_block),
        ("Nucleo Identitario", identity_block),
        ("ADN de Marca", brand_dna_block),
        ("Storytelling y Narrativa", storytelling_block),
        ("Universo Visual", visual_block),
        ("Estrategia de Contenido", content_block),
        ("Experiencia y Touchpoints", experience_block),
        ("Prompts IA", _format_master_ai_prompts(analysis.get("ai_prompts") if analysis else [])),
        ("Plan de Accion", action_block),
        (
            "Visual Boards",
            f"""## Brand Identity Board

{_format_board_spec_summary(board_specs.get("brand_identity_board"), "Brand Identity Board")}

## Storytelling Strategy Board

{_format_board_spec_summary(board_specs.get("storytelling_strategy_board"), "Storytelling Strategy Board")}

## Visual Universe Board

{_format_board_spec_summary(board_specs.get("visual_universe_board"), "Visual Universe Board")}
""",
        ),
    ]
    lines = [
        f"# Master Brand Experience - {client_name}",
        "",
        "## Portada",
        "",
        f"- Cliente: {client_name}",
        f"- Fecha de generacion: {generated_at}",
        f"- Fuente usada: {source_used}",
        f"- Entity Bible: {entity_bible_note}",
        "",
        "## Indice",
        "",
    ]

    for index, (title, _content) in enumerate(sections, start=1):
        lines.append(f"{index}. {title}")

    lines.append(f"{len(sections) + 1}. Apendice de visuales")
    lines.append("")

    for title, content in sections:
        lines.extend(["---", "", f"# {title}", "", content.strip() or "No disponible en el analisis actual.", ""])

    lines.extend(
        [
            "---",
            "",
            "# Apendice de visuales",
            "",
            "Las imagenes no se incrustan en este documento. Se listan solo como rutas relativas:",
            "",
        ]
    )

    if visual_references:
        lines.extend(f"- {relative_path}" for relative_path in visual_references)
    else:
        lines.append("- No hay visuales generados disponibles.")

    return "\n".join(lines).rstrip() + "\n", [title for title, _content in sections]


def _safe_write_master_deliverable(deliverables_dir, content, timestamp):
    target_path = deliverables_dir / MASTER_DELIVERABLE_FILE
    versioned = []

    if target_path.exists():
        target_path = _versioned_deliverable_path(target_path, timestamp)
        versioned.append(target_path)

    target_path.write_text(content, encoding="utf-8")

    return target_path, versioned


def generate_master_deliverable(client_name):
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    analysis_payload, markdown_text, source_paths = _load_latest_analysis(client_path)
    deliverables_dir = _safe_deliverables_dir(client_path)
    visual_references = _list_visual_references(client_path, deliverables_dir)
    board_specs = {
        "brand_identity_board": _read_optional_board_spec(client_path, "brand_identity_board"),
        "storytelling_strategy_board": _read_optional_board_spec(client_path, "storytelling_strategy_board"),
        "visual_universe_board": _read_optional_board_spec(client_path, "visual_universe_board"),
    }
    content, included_sections = _render_master_from_latest_analysis(
        resolved_client_name,
        analysis_payload,
        markdown_text,
        source_paths,
        board_specs,
        visual_references,
    )
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    master_path, versioned_paths = _safe_write_master_deliverable(deliverables_dir, content, timestamp)

    return {
        "client": resolved_client_name,
        "created": _client_relative_path(client_path, master_path),
        "source": source_paths,
        "included_sections": included_sections,
        "visuals_referenced": visual_references,
        "versioned": [_client_relative_path(client_path, path) for path in versioned_paths],
        "used_ai": False,
    }


def _safe_prompt_pack_dir(client_path, deliverables_dir):
    prompt_pack_dir = deliverables_dir / "prompt_pack"
    prompt_pack_dir.mkdir(parents=True, exist_ok=True)
    resolved_client_path = client_path.resolve()
    resolved_prompt_pack_dir = prompt_pack_dir.resolve()

    if resolved_prompt_pack_dir != resolved_client_path and resolved_client_path not in resolved_prompt_pack_dir.parents:
        raise ValueError("Invalid prompt pack path.")

    return prompt_pack_dir


def _format_prompt_pack_items(items, label_key="name", description_key="description", fallback="No disponible en el analisis actual."):
    values = _as_list(items)

    if not values:
        return f"- {fallback}"

    lines = []

    for item in values:
        if isinstance(item, dict):
            label = item.get(label_key) or item.get("title") or item.get("pillar") or item.get("principle") or item.get("stage") or "Item"
            description = item.get(description_key) or item.get("role") or item.get("action") or item.get("reason") or item.get("meaning") or item.get("purpose") or ""
            lines.append(f"- **{label}**: {description}" if description else f"- **{label}**")
        else:
            lines.append(f"- {item}")

    return "\n".join(lines)


def _prompt_pack_board_specs(client_path):
    return {
        "brand_identity_board": _read_optional_board_spec(client_path, "brand_identity_board"),
        "storytelling_strategy_board": _read_optional_board_spec(client_path, "storytelling_strategy_board"),
        "visual_universe_board": _read_optional_board_spec(client_path, "visual_universe_board"),
    }


def _prompt_pack_sources(source_paths, entity_bible_context, board_specs):
    lines = [
        f"- LATEST_ANALYSIS.json: {source_paths.get('json') or 'No disponible'}",
        f"- LATEST_ANALYSIS.md: {source_paths.get('markdown') or 'No disponible'}",
        f"- Entity Bible: {'Disponible como marco conceptual limitado' if entity_bible_context else 'No disponible; se uso fallback'}",
    ]

    for board_name, spec in board_specs.items():
        lines.append(f"- {board_name}.json: {'Disponible' if spec else 'No disponible'}")

    return "\n".join(lines)


def _analysis_field(analysis, key, fallback="No disponible en el analisis actual."):
    value = analysis.get(key)
    return value if value not in (None, "", []) else fallback


def _render_identity_cliente_prompt(client_name, analysis, markdown_text, source_paths, board_specs, entity_bible_context):
    diagnosis = analysis.get("diagnosis") or {}
    brand_spec = board_specs.get("brand_identity_board") or {}
    storytelling_spec = board_specs.get("storytelling_strategy_board") or {}
    visual_spec = board_specs.get("visual_universe_board") or {}
    headline = analysis.get("headline") or markdown_text.strip() or "No disponible en el analisis actual."
    entity_signals = _entity_bible_signal(entity_bible_context)
    source_summary = _prompt_pack_sources(source_paths, entity_bible_context, board_specs)

    return f"""# IDENTITY CLIENTE — {client_name}

## 1. Instruccion inicial

Este documento es el contexto maestro de identidad para trabajar esta marca en ChatGPT u otra herramienta creativa. Usalo antes de pedir logos, paletas, tono de marca, boards, piezas visuales o propuestas comerciales.

## 2. Perfil del cliente

- Nombre: {client_name}
- Industria/categoria: {brand_spec.get('brand_descriptor') or 'No disponible en el analisis actual.'}
- Links o Instagram: revisar fuentes cargadas del cliente si estan disponibles en el sistema.
- Contexto general: {diagnosis.get('current_state', headline)}

## 3. Diagnostico actual

- Headline: {headline}
- Overall score: {analysis.get('overall_score', 'n/a')}
- Confidence: {analysis.get('confidence', 'n/a')}
- Problemas principales: {diagnosis.get('main_gap', 'No disponible.')}
- Tension de percepcion: {brand_spec.get('perception_angle') or diagnosis.get('main_gap', 'No disponible.')}
- Riesgos:
{_format_prompt_pack_items(analysis.get('risks'))}

## 4. Lectura de entidad

- Entidad emergente: {brand_spec.get('brand_promise') or diagnosis.get('strategic_decision', headline)}
- Energia transmitida: premium, clara, sensorial y orientada a transformacion.
- Debe dejar de parecer: generica, dispersa, improvisada o solo estetica.
- Debe empezar a parecer: reconocible, confiable, editorial, coherente y con autoridad.
- Senales Entity Bible:
{entity_signals}

## 5. Nucleo de marca

- Proposito: {diagnosis.get('strategic_decision', headline)}
- Promesa: {brand_spec.get('brand_promise') or 'Convertir percepcion dispersa en una experiencia de marca clara y deseable.'}
- Personalidad: precisa, premium, humana, estrategica y visualmente consistente.
- Diferenciadores:
{_format_prompt_pack_items(analysis.get('priorities'), 'title', 'action')}
- Valores: claridad, coherencia, confianza, belleza funcional y precision emocional.
- Territorio simbolico: percepcion, experiencia, deseo, autoridad visual y transformacion.

## 6. Publico ideal

- A quien le habla: personas que necesitan entender rapido el valor de la marca y confiar antes de comprar.
- Que desea ese publico: claridad, seguridad, belleza, prueba, experiencia y una razon concreta para elegir.
- Objeciones probables: falta de confianza, poca diferenciacion, precio, claridad de oferta o prueba insuficiente.
- Que necesita sentir para confiar: orden, autoridad, consistencia visual, promesa concreta y acompanamiento.

## 7. Tono de voz

- Personalidad verbal: clara, premium, sensorial, directa y util.
- Palabras que si usa: experiencia, claridad, transformacion, confianza, sistema, percepcion, estrategia.
- Palabras que evita: barato, improvisado, generico, rapido sin criterio, tendencia vacia.
- Frases ejemplo:
  - Esta marca no necesita sonar mas fuerte; necesita transmitir con mas precision.
  - El valor debe sentirse antes de explicarse.
  - Cada pieza debe reforzar la misma promesa.
- Tono Instagram: editorial, concreto, visual y aspiracional.
- Tono WhatsApp: cercano, seguro, claro y resolutivo.
- Tono comercial: directo, confiable, orientado a valor y accion.

## 8. Direccion visual

- Estilo recomendado: {visual_spec.get('visual_mood') or 'premium, editorial y cinematografico.'}
- Atmosfera: {visual_spec.get('atmosphere') or ', '.join(_as_list(visual_spec.get('general_atmosphere'))) or 'clara, premium y reconocible.'}
- Paleta sugerida:
{_format_prompt_pack_items(visual_spec.get('emotional_palette') or brand_spec.get('palette'), 'name', 'emotion')}
- Colores y significados:
{_format_prompt_pack_items(visual_spec.get('color_meanings'), 'color', 'meaning')}
- Composicion:
{_format_prompt_pack_items(visual_spec.get('composition_rules') or visual_spec.get('composition'))}
- Referencias conceptuales: autoridad visual, contraste, espacio negativo, ritmo cinematografico y valor percibido.
- Que evitar visualmente: ruido, plantillas genericas, exceso de efectos, baja jerarquia y piezas sin promesa.

## 9. Logo System Direction

- Tipo de logo recomendado: sistema principal con version horizontal, version compacta y simbolo reconocible.
- Variantes necesarias: principal, horizontal, compacta, monocromo, fondo claro y fondo oscuro.
- Simbolo/icono sugerido: una forma simple que concentre la promesa y pueda vivir en favicon, perfil e historias.
- Uso en fondo claro: alto contraste, lectura inmediata y espacio de seguridad generoso.
- Uso en fondo oscuro: version luminosa, elegante y con acento controlado.
- Instrucciones para generar logo: crear un logo premium, legible, no generico, con simbolo memorable y sistema de uso real.

## 10. Storytelling

- Narrativa central: {storytelling_spec.get('narrative_axis') or diagnosis.get('strategic_decision', headline)}
- Pilares emocionales:
{_format_prompt_pack_items(storytelling_spec.get('emotional_pillars'))}
- Storyworld: {storytelling_spec.get('storyworld') or 'un universo de marca donde percepcion, deseo, confianza y prueba trabajan juntos.'}
- Mensajes clave:
{_format_prompt_pack_items(analysis.get('priorities'), 'title', 'action')}
- Manifiesto corto: {storytelling_spec.get('manifesto') or 'La marca debe hacer visible una transformacion, no solo explicar una oferta.'}

## 11. Contenido

- Pilares de contenido:
{_format_prompt_pack_items(analysis.get('content_pillars'))}
- Formatos recomendados:
{_format_prompt_pack_items(storytelling_spec.get('formats'), 'name', 'purpose')}
- Ideas de reels/posts: autoridad, deseo, prueba, conversion, antes/despues, proceso y manifiesto.
- Direccion de feed:
{_format_prompt_pack_items(visual_spec.get('instagram_direction'))}

## 12. Objetivo creativo

Cualquier diseno o pieza generada para esta marca debe aumentar claridad, autoridad, deseo, confianza y recordacion. La estetica debe servir a la percepcion; no debe ser decoracion aislada.

## 13. MODO DE GENERACION VISUAL

Actua como director creativo senior, disenador de identidad visual premium y estratega de marca.

No empieces disenando. Primero interpreta la entidad de marca.

Identifica antes de proponer:
- energia emocional
- percepcion deseada
- territorio visual
- tension actual
- promesa de marca
- nivel de lujo/premium
- estilo cultural/sectorial

Trabaja por etapas:
1. Interpretacion estrategica
2. Direccion visual
3. Sistema de logo
4. Paleta cromatica
5. Tipografia
6. Aplicaciones
7. Board final

Evita resultados genericos, plantillas basicas, iconos obvios y estetica stock.

Prioriza coherencia, memorabilidad, percepcion premium y claridad comercial.

Antes de generar imagenes finales, propone 2 o 3 rutas creativas. Para cada ruta explica:
- concepto
- emocion
- simbolos
- colores
- tipografia
- estilo visual
- riesgos
- cuando usarla

Mantener coherencia con Entity Bible:
- identidad antes de diseno
- percepcion antes de explicacion
- marca como entidad
- lujo emocional
- autoridad visual
- storytelling como transformacion

## 14. Instruccion final para ChatGPT

Actua como director creativo senior, estratega de marca, disenador de identidad visual premium y especialista en storytelling. Usa todo este documento como contexto maestro del cliente. Antes de proponer piezas visuales, interpreta la entidad de marca, su percepcion actual, su potencial emocional y su territorio visual. Manten coherencia estrategica en logo, paleta, tono, storytelling, feed y propuestas comerciales.

## 15. Fuentes usadas

{source_summary}
"""


def _specific_prompt(title, task):
    return f"""# {title}

Usa primero `identity_cliente.md` como contexto maestro. Luego ejecuta esta tarea especifica:

{task.strip()}
"""


def _visual_generation_mode_prompt():
    return """# VISUAL GENERATION MODE

## Como usar este modo

Primero pega `identity_cliente.md`.
Despues pega `visual_generation_mode.md`.
Despues pega el prompt especifico que quieras ejecutar.

## Reglas generales

- No disenar antes de interpretar.
- Pedir rutas creativas antes del resultado final.
- Pedir variaciones controladas.
- Pedir justificacion estrategica.
- Pedir formato, composicion, color, tipografia, simbolos y restricciones.
- Pedir negativos.

## Formula de prompt visual

[ROL]
Actua como director creativo senior, disenador de identidad visual premium, estratega de marca y especialista en storytelling visual.

[CONTEXTO]
Usa `identity_cliente.md` como contexto maestro. Interpreta la entidad de marca, su percepcion actual, su promesa, su territorio simbolico y su universo visual.

[OBJETIVO]
Disena o propone el entregable solicitado con criterio profesional, no como plantilla generica.

[CRITERIO ESTRATEGICO]
Debe transmitir claridad, memorabilidad, autoridad visual, coherencia, deseo, confianza y valor percibido.

[COMPOSICION]
Define formato, layout, jerarquia, modulos, escala, aire, contraste y lectura.

[ESTILO VISUAL]
Premium, editorial, cinematografico, claro, moderno y coherente con la categoria.

[ELEMENTOS OBLIGATORIOS]
Incluye los elementos pedidos: logo, paleta, tipografia, simbolos, aplicaciones, boards, feed, motion o piezas.

[RESTRICCIONES]
No usar recursos obvios, estetica stock, exceso de elementos ni soluciones genericas.

[OUTPUT]
Entrega rutas creativas, variantes, prompts visuales finales o instrucciones listas para generar imagen.

## Negative prompt base

- generic template
- stock design
- cluttered composition
- low contrast
- cheap tourism logo
- overused icons
- illegible typography
- inconsistent palette
- childish style
- random gradients
- too many effects
"""


def _render_prompt_pack_files(client_name, analysis, markdown_text, source_paths, board_specs, entity_bible_context):
    identity = _render_identity_cliente_prompt(
        client_name,
        analysis,
        markdown_text,
        source_paths,
        board_specs,
        entity_bible_context,
    )
    files = {
        "identity_cliente.md": identity,
        "visual_generation_mode.md": _visual_generation_mode_prompt(),
        "logo_system_prompt.md": _specific_prompt(
            "Logo System Prompt",
            """## Modo para generar logo

Primero:
- analiza la entidad de marca
- propone 3 rutas conceptuales de logo
- define un simbolo posible para cada ruta
- define estilo tipografico
- define que evitar

Despues:
- genera un prompt visual para cada ruta
- explica concepto, emocion, simbolos, colores, tipografia, riesgos y uso ideal

Crea una direccion de logo system para esta marca. Incluye:
- logo principal
- version horizontal
- version compacta
- simbolo / icono
- monocromo
- uso en fondo claro
- uso en fondo oscuro
- reglas de uso
- direccion conceptual
- favicon
- uso social media

Instrucciones negativas:
- no usar iconos turisticos obvios si no aportan diferenciacion
- no usar logos genericos de agencia
- no usar simbolos cliche
- no mezclar demasiados elementos
- no usar tipografias ilegibles
- no perder legibilidad en tamano pequeno

No generes una propuesta generica. Interpreta la entidad de marca, su percepcion, su promesa y su territorio visual antes de proponer el sistema.""",
        ),
        "color_palette_prompt.md": _specific_prompt(
            "Color Palette Prompt",
            """Crea una paleta cromatica premium para esta marca. Incluye:
- color principal
- secundario
- acento
- neutro oscuro
- neutro claro
- significado emocional de cada color
- combinaciones recomendadas
- que evitar

La paleta debe transmitir percepcion, autoridad visual, atmosfera y valor percibido.""",
        ),
        "tone_of_brand_prompt.md": _specific_prompt(
            "Tone Of Brand Prompt",
            """Define el tono de marca. Incluye:
- personalidad
- voz
- tono
- palabras que si usa
- palabras que evita
- frases ejemplo
- tono Instagram
- tono WhatsApp
- tono comercial

El tono debe ser coherente con la entidad, la promesa, el publico ideal y la percepcion premium.""",
        ),
        "brand_identity_board_prompt.md": _specific_prompt(
            "Brand Identity Board Prompt",
            """## Modo para generar board premium

Crea un board horizontal 16:9 premium de identidad visual con composicion editorial modular.

Debe incluir:
- hero de marca
- logo principal
- variantes
- paleta
- tipografias
- tono
- aplicaciones digitales
- feed Instagram
- propuesta comercial
- beneficios
- footer conceptual

Indicaciones de calidad:
- no usar cards simples
- no usar layout plano
- no hacer una presentacion corporativa generica
- usar jerarquia fuerte, espacios premium, contraste, mockups y modulos de distinta escala
- estilo similar a brand board premium / commercial kit

El resultado debe sentirse como un brand board editorial, con jerarquia fuerte, modulos de distinta escala y coherencia visual.""",
        ),
        "storytelling_board_prompt.md": _specific_prompt(
            "Storytelling Board Prompt",
            """## Modo para generar storytelling board

Crea un Storytelling Strategy Board con composicion editorial clara y memoria narrativa.

Debe incluir:
- hero narrativo
- objetivo storytelling
- framework narrativo
- pilares emocionales
- formatos
- sistemas
- reglas de oro
- manifiesto
- estructura narrativa
- footer con claims memorables

La narrativa debe transformar tension en deseo, prueba y accion.""",
        ),
        "visual_universe_board_prompt.md": _specific_prompt(
            "Visual Universe Board Prompt",
            """## Modo para generar universo visual

Crea un Visual Universe Board que traduzca la entidad en atmosfera, lenguaje visual y direccion creativa.

Debe incluir:
- esencia
- atmosfera
- moodboard
- paleta emocional
- iluminacion
- composicion
- cinematic style
- texturas
- motion system
- Instagram direction
- reels style
- conceptos visuales prohibidos

El universo visual debe ser coherente con la entidad, la percepcion y el objetivo creativo.""",
        ),
    }
    full_sections = [files["identity_cliente.md"].rstrip()]

    for filename in PROMPT_PACK_FILES[1:-1]:
        full_sections.append(files[filename].rstrip())

    files["full_brand_experience_prompt_pack.md"] = "\n\n---\n\n".join(full_sections) + "\n"

    return files


def _is_cleanable_prompt_pack_file(path):
    if not path.is_file():
        return False

    if path.suffix.casefold() != ".md":
        return False

    if path.name in PROMPT_PACK_CLEANABLE_FILES:
        return True

    for filename in PROMPT_PACK_CLEANABLE_FILES:
        stem = Path(filename).stem
        if re.fullmatch(rf"{re.escape(stem)}_\d{{8}}_\d{{6}}\.md", path.name):
            return True

    return False


def _clean_prompt_pack_directory(prompt_pack_dir, client_path):
    resolved_prompt_pack_dir = prompt_pack_dir.resolve()
    expected_prompt_pack_dir = (client_path / PROMPT_PACK_BASE_FOLDER).resolve()

    if resolved_prompt_pack_dir != expected_prompt_pack_dir:
        raise ValueError("Invalid prompt pack cleanup path.")

    deleted = []

    if not prompt_pack_dir.is_dir():
        return deleted

    for path in sorted(prompt_pack_dir.iterdir(), key=lambda item: item.name):
        if path.is_dir():
            continue

        resolved_path = path.resolve()

        if resolved_prompt_pack_dir not in resolved_path.parents:
            continue

        if not _is_cleanable_prompt_pack_file(path):
            continue

        relative_path = _client_relative_path(client_path, path)
        path.unlink()
        deleted.append(relative_path)

    return deleted


def _write_prompt_pack_file(path, content):
    path.write_text(content.rstrip() + "\n", encoding="utf-8")
    return path


def generate_client_prompt_pack(client_name):
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    analysis_payload, markdown_text, source_paths = _load_latest_analysis(client_path)
    analysis = _analysis_from_payload(analysis_payload)
    deliverables_dir = _safe_deliverables_dir(client_path)
    prompt_pack_dir = _safe_prompt_pack_dir(client_path, deliverables_dir)
    board_specs = _prompt_pack_board_specs(client_path)
    entity_bible_context = _load_master_entity_bible_context()
    files = _render_prompt_pack_files(
        resolved_client_name,
        analysis,
        markdown_text,
        source_paths,
        board_specs,
        entity_bible_context,
    )
    deleted_previous = _clean_prompt_pack_directory(prompt_pack_dir, client_path)
    created = []

    for filename in PROMPT_PACK_FILES:
        written_path = _write_prompt_pack_file(prompt_pack_dir / filename, files[filename])
        relative_path = _client_relative_path(client_path, written_path)
        created.append(relative_path)

    return {
        "client": resolved_client_name,
        "base": PROMPT_PACK_BASE_FOLDER,
        "created": created,
        "deleted_previous": deleted_previous,
        "used_ai": False,
    }


def _is_allowed_source_item(path, source_root):
    if not path.is_file():
        return False

    if path.name.startswith("."):
        return False

    relative_parts = path.relative_to(source_root).parts

    if any(part in SOURCE_EXCLUDED_DIRS or part.startswith(".") for part in relative_parts):
        return False

    name = path.name.casefold()
    suffix = path.suffix.casefold()

    if name in SOURCE_EXCLUDED_NAMES:
        return False

    if suffix in SOURCE_EXCLUDED_EXTENSIONS:
        return False

    return suffix in SOURCE_FILE_EXTENSIONS


def _count_source_files(client_path, relative_folder):
    source_root = client_path / relative_folder

    if not source_root.is_dir():
        return 0

    resolved_client_path = client_path.resolve()
    resolved_source_root = source_root.resolve()

    if resolved_source_root != resolved_client_path and resolved_client_path not in resolved_source_root.parents:
        return 0

    count = 0

    for path in source_root.rglob("*"):
        if _is_allowed_source_item(path, source_root):
            count += 1

    return count


def _count_existing_files(client_path, relative_paths):
    count = 0

    for relative_path in relative_paths:
        path = client_path / relative_path

        if not path.is_file():
            continue

        if not _is_allowed_source_item(path, path.parent):
            continue

        if path.stat().st_size > 0:
            count += 1

    return count


def _source_status(items):
    return {
        "status": "available" if items > 0 else "missing",
        "items": items,
    }


def _analysis_confidence(sources):
    available = {name for name, data in sources.items() if data["items"] > 0}

    if len(available) >= 4 and ({"transcription", "notes"} & available):
        return "high"

    if len(available) >= 2:
        return "medium"

    return "low"


def build_client_analysis_plan(client_name):
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        return None

    sources = {
        "instagram": _source_status(
            _count_source_files(client_path, "01_DIAGNOSTICO_ACTUAL/Instagram_Actual")
            + _count_existing_files(client_path, ["01_DIAGNOSTICO_ACTUAL/INSTAGRAM_EXTRACTION.md"])
        ),
        "logo": _source_status(
            _count_source_files(client_path, "01_DIAGNOSTICO_ACTUAL/Logos_Actuales")
        ),
        "material": _source_status(
            _count_source_files(client_path, "01_DIAGNOSTICO_ACTUAL/Material_Actual")
        ),
        "transcription": _source_status(
            _count_source_files(client_path, "01_DIAGNOSTICO_ACTUAL/Reuniones_Zoom")
        ),
        "notes": _source_status(
            _count_existing_files(
                client_path,
                [
                    "01_DIAGNOSTICO_ACTUAL/Briefing_Semilla.md",
                    "02_ESENCIA_DE_MARCA/CLIENT_CONTEXT.md",
                ],
            )
        ),
        "links": _source_status(
            _count_existing_files(client_path, ["00_ADMIN/Links_Accesos/LINKS.md"])
        ),
    }
    missing_sources = [
        source_name
        for source_name, source_data in sources.items()
        if source_data["status"] == "missing"
    ]

    return {
        "client": resolved_client_name,
        "can_run": any(source_data["items"] > 0 for source_data in sources.values()),
        "confidence": _analysis_confidence(sources),
        "sources": sources,
        "missing_sources": missing_sources,
        "pipeline": ANALYSIS_PIPELINE,
        "agents": ANALYSIS_AGENTS,
        "will_write_files": False,
    }


def list_clients():
    if not CLIENTS_ROOT.exists():
        return []

    clients = []

    for client_path in sorted(CLIENTS_ROOT.iterdir(), key=lambda path: path.name.casefold()):
        if not client_path.is_dir():
            continue

        profile_path = client_path / "00_ADMIN" / "Datos_Cliente" / "client_profile.json"
        profile = {}

        if profile_path.exists():
            try:
                profile = json.loads(profile_path.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                profile = {}

        clients.append(
            {
                "name": client_path.name,
                "path": str(client_path),
                "profile": profile,
                "updated_at": datetime.fromtimestamp(client_path.stat().st_mtime).isoformat(timespec="seconds"),
            }
        )

    return clients


def extract_client_name(prompt):
    if not prompt:
        return None

    intent = prompt.lower()

    if not any(word in intent for word in ["analiza", "analyza", "analyze", "cliente", "agencia", "marca"]):
        return None

    quote_match = re.search(r'["“”\']([^"“”\']{2,90})["“”\']', prompt)

    if quote_match:
        return _sanitize_client_name(quote_match.group(1))

    patterns = [
        r"(?:analiza|analyza|analyze)\s+(?:esta|este)?\s*(?:agencia de tours|agencia|cliente|marca)\s+([A-Za-z0-9 _&.-]{2,90})",
        r"(?:cliente|marca)\s+(?:llamada|llamado|name|nombre)?\s*[:\-]?\s*([A-Za-z0-9 _&.-]{2,90})",
        r"agencia\s+(?:llamada|llamado|name|nombre)\s*[:\-]?\s*([A-Za-z0-9 _&.-]{2,90})",
    ]

    for pattern in patterns:
        match = re.search(pattern, prompt, re.IGNORECASE)

        if match:
            candidate = match.group(1)
            candidate = re.split(r"\s+(?:quiero|para|y|con|que)\s+", candidate, maxsplit=1, flags=re.IGNORECASE)[0]
            return _sanitize_client_name(candidate)

    return None


def ensure_client(client_name, source_prompt=""):
    safe_name = _sanitize_client_name(client_name)

    if not safe_name:
        return None

    existing_path = _find_existing_client(safe_name)
    client_path = existing_path or CLIENTS_ROOT / safe_name
    created = existing_path is None

    for folder in CLIENT_FOLDERS:
        (client_path / folder).mkdir(parents=True, exist_ok=True)

    created_at = datetime.now().strftime("%Y-%m-%d")
    profile_path = client_path / "00_ADMIN" / "Datos_Cliente" / "client_profile.json"
    profile = {
        "client_info": {
            "name": client_path.name,
            "date": created_at,
            "status": "Discovery",
            "industry": "Tours / travel / experience",
        },
        "analysis": {
            "created_from_dashboard": True,
            "last_prompt": source_prompt,
            "last_analysis_at": datetime.now().isoformat(timespec="seconds"),
        },
    }

    if profile_path.exists():
        try:
            existing_profile = json.loads(profile_path.read_text(encoding="utf-8"))
            existing_profile.setdefault("client_info", {})
            existing_profile.setdefault("analysis", {})
            existing_profile["client_info"].setdefault("name", client_path.name)
            existing_profile["client_info"].setdefault("date", created_at)
            existing_profile["client_info"]["status"] = "Discovery"
            existing_profile["client_info"].setdefault("industry", "Tours / travel / experience")
            existing_profile["analysis"]["created_from_dashboard"] = True
            existing_profile["analysis"]["last_prompt"] = source_prompt
            existing_profile["analysis"]["last_analysis_at"] = datetime.now().isoformat(timespec="seconds")
            profile = existing_profile
        except json.JSONDecodeError:
            pass

    profile_path.write_text(
        json.dumps(profile, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    for relative_path, template in SEED_FILES.items():
        file_path = client_path / relative_path

        if not file_path.exists():
            file_path.parent.mkdir(parents=True, exist_ok=True)
            file_path.write_text(
                template.format(client_name=client_path.name),
                encoding="utf-8",
            )

    return {
        "name": client_path.name,
        "path": str(client_path),
        "created": created,
    }


def _append_markdown(file_path, title, fields):
    file_path.parent.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().isoformat(timespec="seconds")
    body = [f"\n\n# {title}", f"\nCreated at: {timestamp}\n"]

    for label, value in fields.items():
        if not value:
            continue

        body.append(f"\n## {label}\n\n{value}\n")

    with file_path.open("a", encoding="utf-8") as file:
        file.write("\n".join(body))


def save_client_intake(client_name, intake):
    client = ensure_client(client_name, intake.get("notes", ""))
    client_path = Path(client["path"])
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    intake_dir = client_path / "01_DIAGNOSTICO_ACTUAL" / "Analisis_Brand_Experience"
    intake_dir.mkdir(parents=True, exist_ok=True)

    intake_file = intake_dir / f"intake_{timestamp}.json"
    intake_payload = {
        "client": client["name"],
        "created_at": datetime.now().isoformat(timespec="seconds"),
        "intake": intake,
    }
    intake_file.write_text(json.dumps(intake_payload, indent=2, ensure_ascii=False), encoding="utf-8")

    if intake.get("transcription"):
        _append_markdown(
            client_path / "01_DIAGNOSTICO_ACTUAL" / "Reuniones_Zoom" / "TRANSCRIPCIONES.md",
            "Transcripcion / notas",
            {"Contenido": intake.get("transcription")},
        )

    if intake.get("links") or intake.get("instagram"):
        _append_markdown(
            client_path / "00_ADMIN" / "Links_Accesos" / "LINKS.md",
            "Links de investigacion",
            {
                "Instagram": intake.get("instagram"),
                "Links": "\n".join(intake.get("links", [])) if isinstance(intake.get("links"), list) else intake.get("links"),
            },
        )

    if intake.get("notes"):
        _append_markdown(
            client_path / "02_ESENCIA_DE_MARCA" / "CLIENT_CONTEXT.md",
            "Notas de intake",
            {"Notas": intake.get("notes")},
        )

    return {
        "client": client,
        "intake_file": str(intake_file),
    }


def load_latest_client_intake(client_name):
    resolved_client_name, client_path = _resolve_existing_client_path(client_name)

    if not client_path:
        raise ValueError("Client not found.")

    intake_dir = client_path / "01_DIAGNOSTICO_ACTUAL" / "Analisis_Brand_Experience"

    if not intake_dir.is_dir():
        raise ValueError("No intake files found for this client.")

    intake_files = sorted(
        intake_dir.glob("intake_*.json"),
        key=lambda path: path.stat().st_mtime,
        reverse=True,
    )

    if not intake_files:
        raise ValueError("No intake files found for this client.")

    latest_file = intake_files[0]

    try:
        payload = json.loads(latest_file.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        raise ValueError("Latest intake file is invalid.") from error

    intake = payload.get("intake")

    if not isinstance(intake, dict):
        raise ValueError("Latest intake file has no intake payload.")

    return {
        "client": resolved_client_name,
        "client_path": str(client_path),
        "intake_file": str(latest_file),
        "intake": intake,
        "created_at": payload.get("created_at"),
    }


def save_uploaded_file(client_name, file_obj, filename, category="Material_Actual"):
    submitted_name = Path(filename).name
    safe_filename = re.sub(r'[<>:"/\\|?*\x00-\x1f]', "", submitted_name).strip()

    if not safe_filename or safe_filename in {".", ".."}:
        raise ValueError("Invalid file name.")

    if Path(safe_filename).stem.casefold() in RESERVED_FILENAMES:
        raise ValueError("Invalid file name.")

    extension = Path(safe_filename).suffix.casefold()

    if extension not in ALLOWED_UPLOAD_EXTENSIONS:
        allowed = ", ".join(sorted(ALLOWED_UPLOAD_EXTENSIONS))
        raise ValueError(f"File extension is not allowed. Allowed extensions: {allowed}.")

    client = ensure_client(client_name)
    client_path = Path(client["path"])
    category_folder = re.sub(r'[^A-Za-z0-9_ -]', "", category).strip() or "Material_Actual"
    upload_dir = client_path / "01_DIAGNOSTICO_ACTUAL" / category_folder
    upload_dir.mkdir(parents=True, exist_ok=True)
    target_path = upload_dir / safe_filename

    if target_path.exists():
        stem = target_path.stem
        suffix = target_path.suffix
        target_path = upload_dir / f"{stem}_{datetime.now().strftime('%Y%m%d_%H%M%S')}{suffix}"

    resolved_upload_dir = upload_dir.resolve()
    resolved_target = target_path.resolve()

    if resolved_upload_dir not in resolved_target.parents:
        raise ValueError("Invalid upload path.")

    bytes_written = 0

    with target_path.open("wb") as output:
        while True:
            chunk = file_obj.read(UPLOAD_CHUNK_BYTES)

            if not chunk:
                break

            bytes_written += len(chunk)

            if bytes_written > MAX_UPLOAD_BYTES:
                output.close()
                target_path.unlink(missing_ok=True)
                raise ValueError("File is too large. Maximum size is 10 MB.")

            output.write(chunk)

    return {
        "client": client,
        "file": str(target_path),
        "filename": target_path.name,
    }


def build_framework_prompt(client_name, intake=None):
    intake = intake or {}
    links = intake.get("links", [])
    entity_bible_context = _load_framework_entity_bible_context()

    if isinstance(links, list):
        links_text = "\n".join(f"- {link}" for link in links if link)
    else:
        links_text = str(links or "")

    return f"""
Analiza el cliente "{client_name}" usando el framework completo de Brand Experience OS.

=== ENTITY BIBLE CONTEXT ===
{entity_bible_context or "No Entity Bible context loaded."}

=== CLIENT CONTEXT ===
Fuentes cargadas:
- Instagram: {intake.get("instagram") or "No informado"}
- Links: {links_text or "No informados"}
- Transcripcion/notas: {intake.get("transcription") or "No informada"}
- Contexto adicional: {intake.get("notes") or "No informado"}

=== ANALYSIS INSTRUCTIONS ===
Genera una respuesta ejecutiva con estos entregables:

1. Identity Patch
2. Brand Analysis
3. Entity Bible
4. Universo Visual
5. Estrategia de Contenido
6. Prompts IA
7. Exportables recomendados

Para cada entregable incluye:
- diagnostico
- oportunidad
- direccion recomendada
- proximas acciones concretas

Mantén claridad estrategica, percepcion premium y lenguaje util para ejecutar.
""".strip()


def _extract_prompt_block(prompt, start_marker, end_marker=None):
    if not prompt or start_marker not in prompt:
        return ""

    start_index = prompt.find(start_marker) + len(start_marker)
    end_index = len(prompt)

    if end_marker and end_marker in prompt[start_index:]:
        end_index = prompt.find(end_marker, start_index)

    return prompt[start_index:end_index].strip()


def sanitize_prompt_for_client_storage(prompt):
    if not prompt:
        return ""

    if "=== ENTITY BIBLE CONTEXT ===" not in prompt:
        return prompt.strip()

    intro = prompt.split("=== ENTITY BIBLE CONTEXT ===", 1)[0].strip()
    client_context = _extract_prompt_block(
        prompt,
        "=== CLIENT CONTEXT ===",
        "=== ANALYSIS INSTRUCTIONS ===",
    )
    instructions = _extract_prompt_block(prompt, "=== ANALYSIS INSTRUCTIONS ===")
    sections = []

    if intro:
        sections.append(intro)

    if client_context:
        sections.append(f"=== CLIENT CONTEXT ===\n{client_context}")

    if instructions:
        sections.append(f"=== ANALYSIS INSTRUCTIONS ===\n{instructions}")

    return "\n\n".join(sections).strip()


def _load_framework_entity_bible_context():
    try:
        return load_entity_bible_context(max_total_chars=30_000)
    except Exception:
        return ""


def ensure_client_from_prompt(prompt, explicit_client_name=None):
    client_name = explicit_client_name or extract_client_name(prompt)

    if not client_name:
        return None

    return ensure_client(client_name, sanitize_prompt_for_client_storage(prompt))


def _format_structured_analysis(structured_analysis):
    if not structured_analysis:
        return ""

    lines = [
        "\n## Decision Dashboard\n",
        f"- Overall score: {structured_analysis.get('overall_score', 'n/a')}",
        f"- Confidence: {structured_analysis.get('confidence', 'n/a')}",
        f"- Headline: {structured_analysis.get('headline', '')}",
    ]
    diagnosis = structured_analysis.get("diagnosis") or {}

    if diagnosis:
        lines.extend(
            [
                "\n### Diagnosis\n",
                f"- Current state: {diagnosis.get('current_state', '')}",
                f"- Main gap: {diagnosis.get('main_gap', '')}",
                f"- Strategic decision: {diagnosis.get('strategic_decision', '')}",
            ]
        )

    scorecard = structured_analysis.get("scorecard") or []

    if scorecard:
        lines.append("\n### Scorecard\n")

        for item in scorecard:
            lines.append(
                f"- {item.get('label')}: {item.get('score')} ({item.get('status')}) - {item.get('action')}"
            )

    priorities = structured_analysis.get("priorities") or []

    if priorities:
        lines.append("\n### Priorities\n")

        for item in priorities:
            lines.append(
                f"- {item.get('title')} [{item.get('urgency')}]: {item.get('action')}"
            )

    next_sprint = structured_analysis.get("next_sprint") or []

    if next_sprint:
        lines.append("\n### Next Sprint\n")

        for action in next_sprint:
            lines.append(f"- {action}")

    return "\n".join(lines)


def save_client_analysis(client, prompt, response, provider=None, concepts=None, agents=None, structured_analysis=None, status="completed"):
    if not client:
        return None

    client_path = Path(client["path"])
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    analysis_dir = client_path / "01_DIAGNOSTICO_ACTUAL" / "Analisis_Brand_Experience"
    analysis_dir.mkdir(parents=True, exist_ok=True)

    file_path = analysis_dir / f"analysis_{timestamp}.md"
    provider_name = provider.get("active_provider") if provider else "unknown"
    fallback_used = provider.get("fallback_used") if provider else False
    concept_text = ", ".join(concepts or [])
    agent_text = ", ".join(agents or [])
    structured_text = _format_structured_analysis(structured_analysis)
    stored_prompt = sanitize_prompt_for_client_storage(prompt)

    file_path.write_text(
        f"""# Brand Experience Analysis - {client["name"]}

## Metadata

- Client: {client["name"]}
- Created at: {datetime.now().isoformat(timespec="seconds")}
- Provider: {provider_name}
- Fallback used: {fallback_used}
- Status: {status}
- Concepts: {concept_text}
- Agents: {agent_text}

## Client Context Used

{stored_prompt}

## Strategic Synthesis

{response}

{structured_text}
""",
        encoding="utf-8",
    )

    latest_path = analysis_dir / "LATEST_ANALYSIS.md"
    latest_path.write_text(file_path.read_text(encoding="utf-8"), encoding="utf-8")

    structured_path = None

    if structured_analysis:
        structured_path = analysis_dir / f"analysis_{timestamp}.json"
        structured_path.write_text(
            json.dumps(
                {
                    "client": client["name"],
                    "created_at": datetime.now().isoformat(timespec="seconds"),
                    "status": status,
                    "prompt": stored_prompt,
                    "system_context_omitted": stored_prompt != (prompt or "").strip(),
                    "provider": provider,
                    "concepts": concepts or [],
                    "agents": agents or [],
                    "analysis": structured_analysis,
                },
                indent=2,
                ensure_ascii=False,
            ),
            encoding="utf-8",
        )

        latest_json_path = analysis_dir / "LATEST_ANALYSIS.json"
        latest_json_path.write_text(structured_path.read_text(encoding="utf-8"), encoding="utf-8")

    return {
        "file": str(file_path),
        "latest": str(latest_path),
        "structured": str(structured_path) if structured_path else None,
    }
