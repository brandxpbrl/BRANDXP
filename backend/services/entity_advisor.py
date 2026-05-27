from pathlib import Path

from services.entity_reasoning_core import build_entity_reasoning


BASE_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BASE_DIR.parent
CLIENTS_ROOT = PROJECT_ROOT / "BRAND_EXPERIENCE" / "03_CLIENT_SYSTEM" / "CLIENTES_ACTIVOS"
CREATIVE_LIBRARY_ROOT = PROJECT_ROOT / "BRAND_EXPERIENCE" / "04_CREATIVE_LIBRARY"
ENTITY_ASSETS_DIR = CREATIVE_LIBRARY_ROOT / "02_Assets_Visuales" / "Entidad"

ALLOWED_ENTITY_ASSET_EXTENSIONS = {
    ".gif",
    ".jpeg",
    ".jpg",
    ".mp4",
    ".png",
    ".webp",
}


def _sanitize_client_name(client_name):
    return (client_name or "").strip()


def _resolve_client_path(client_name):
    safe_name = _sanitize_client_name(client_name)

    if not safe_name or not CLIENTS_ROOT.exists():
        return None, None

    for candidate in CLIENTS_ROOT.iterdir():
        if candidate.is_dir() and candidate.name.casefold() == safe_name.casefold():
            return candidate.name, candidate

    return safe_name, None


def _exists(client_path, relative_path):
    return (client_path / relative_path).exists()


def _has_files(client_path, relative_path, patterns):
    folder = client_path / relative_path

    if not folder.is_dir():
        return False

    for pattern in patterns:
        if any(folder.glob(pattern)):
            return True

    return False


def _client_state(client_path):
    return {
        "latest_analysis": _exists(client_path, "01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.json")
        or _exists(client_path, "01_DIAGNOSTICO_ACTUAL/Analisis_Brand_Experience/LATEST_ANALYSIS.md"),
        "deliverables": _has_files(client_path, "05_ENTREGAS", ["*.md", "*.json"]),
        "visual_board_specs": _has_files(client_path, "05_ENTREGAS/board_specs", ["*.json"]),
        "visual_assets": _has_files(client_path, "05_ENTREGAS/visuals", ["*.png", "*.jpg", "*.jpeg", "*.webp"]),
        "prompt_pack": _has_files(client_path, "05_ENTREGAS/prompt_pack", ["*.md"]),
        "master_deliverable": _exists(client_path, "05_ENTREGAS/MASTER_BRAND_EXPERIENCE.md"),
        "deliverables_reviewed": _exists(client_path, "05_ENTREGAS/deliverables_review.json"),
        "campaign_active": _has_files(client_path, "06_CAMPAIGNS", ["*.md", "*.json"])
        or _has_files(client_path, "05_ENTREGAS/campaigns", ["*.md", "*.json"]),
        "evolution_timeline": _exists(client_path, "05_ENTREGAS/evolution_timeline.md")
        or _has_files(client_path, "10_EVOLUTION_TIMELINE", ["*.md", "*.json"]),
        "brand_memory_core": _exists(client_path, "02_MEMORY/BRAND_MEMORY_CORE_MASTER.md")
        or _exists(client_path, "02_MEMORY/brand_memory_core.json"),
        "visual_dna_engine": _exists(client_path, "07_VISUAL_DNA_ENGINE/VISUAL_DNA_ENGINE_MASTER.md")
        or _exists(client_path, "07_VISUAL_DNA_ENGINE/visual_dna_engine.json"),
        "content_intelligence_engine": _exists(client_path, "08_CONTENT_INTELLIGENCE_ENGINE/CONTENT_INTELLIGENCE_ENGINE_MASTER.md")
        or _exists(client_path, "08_CONTENT_INTELLIGENCE_ENGINE/content_intelligence_engine.json"),
        "ai_agent_os": _exists(client_path, "09_AI_AGENT_OS/AI_AGENT_OS_MASTER.md")
        or _exists(client_path, "09_AI_AGENT_OS/ai_agent_os.json"),
    }


def _advisor_recommendation(state):
    if not state["latest_analysis"]:
        return {
            "state": "needs_analysis",
            "priority": "high",
            "message": "Todavia no hay un diagnostico base. La Entidad recomienda ejecutar el framework completo antes de crear entregables.",
            "next_action": "Ejecutar framework",
            "action_key": "run_framework",
        }

    if not state["brand_memory_core"]:
        return {
            "state": "needs_brand_memory",
            "priority": "high",
            "message": "El cliente tiene analisis, pero todavia no tiene memoria profunda. Antes de disenar, conviene construir su Brand Memory Core.",
            "next_action": "Generar Brand Memory Core",
            "action_key": "generate_brand_memory_core",
        }

    if not state["visual_dna_engine"]:
        return {
            "state": "needs_visual_dna",
            "priority": "high",
            "message": "La memoria existe, pero falta traducirla a reglas visuales operativas. El proximo paso es crear el Visual DNA Engine.",
            "next_action": "Generar Visual DNA Engine",
            "action_key": "generate_visual_dna_engine",
        }

    if not state["content_intelligence_engine"]:
        return {
            "state": "needs_content_engine",
            "priority": "medium",
            "message": "El cliente ya tiene identidad y ADN visual. Ahora conviene convertir eso en contenido, funnel y conversion.",
            "next_action": "Generar Content Intelligence Engine",
            "action_key": "generate_content_intelligence_engine",
        }

    if not state["ai_agent_os"]:
        return {
            "state": "needs_ai_agent_os",
            "priority": "medium",
            "message": "La arquitectura estrategica esta madura. Falta conectar el AI Agent OS para que los agentes operen con roles, rutas y protocolos por cliente.",
            "next_action": "Generar AI Agent OS",
            "action_key": "generate_ai_agent_os",
        }

    if not state["visual_assets"]:
        return {
            "state": "ready_for_visuals",
            "priority": "medium",
            "message": "El sistema cognitivo del cliente esta completo. La Entidad recomienda generar visual boards y assets finales.",
            "next_action": "Renderizar visuales",
            "action_key": "render_visual_assets",
        }

    return {
        "state": "operational",
        "priority": "normal",
        "message": "El cliente ya tiene una base operativa. La Entidad recomienda revisar entregables, sintetizar avances y preparar la proxima expansion.",
        "next_action": "Revisar entregables",
        "action_key": "review_deliverables",
    }


def _entity_asset_sort_key(path):
    extension = path.suffix.casefold()
    video_priority = 0 if extension == ".mp4" else 1
    preferred_order = {
        "BrandIdentity.mp4": 0,
        "762ae545-1c9a-42a1-9497-ea815042ce9b.mp4": 1,
    }
    preferred_priority = preferred_order.get(path.name, 9)

    return (video_priority, preferred_priority, path.name.casefold())


def _entity_assets(limit=8):
    if not ENTITY_ASSETS_DIR.is_dir():
        return []

    assets = []

    for path in sorted(ENTITY_ASSETS_DIR.iterdir(), key=_entity_asset_sort_key):
        if len(assets) >= limit:
            break

        if not path.is_file() or path.suffix.casefold() not in ALLOWED_ENTITY_ASSET_EXTENSIONS:
            continue

        relative_path = path.relative_to(CREATIVE_LIBRARY_ROOT).as_posix()
        assets.append(
            {
                "name": path.name,
                "type": "video" if path.suffix.casefold() == ".mp4" else "image",
                "relative_path": relative_path,
                "asset_url": f"/creative-library/asset?path={relative_path}",
                "role": "brand_experience_entity",
            }
        )

    return assets


def build_entity_advisor(client_name):
    resolved_client_name, client_path = _resolve_client_path(client_name)

    if not client_path:
        return None

    state = _client_state(client_path)
    reasoning = build_entity_reasoning(resolved_client_name, client_path, state)

    return {
        "client": resolved_client_name,
        "advisor": {
            "name": "Entidad Brand Experience",
            "role": "Creative Intelligence Advisor",
            "visual_identity": "Dark Luxury Cinematic Neon",
            "purpose": "Observar el estado del cliente y recomendar el proximo paso creativo, estrategico o operativo.",
        },
        "state": state,
        "entity_profile": reasoning["entity_profile"],
        "entity_state": reasoning["entity_state"],
        "fluid_messages": reasoning["fluid_messages"],
        "recommendation": reasoning["recommendation"],
        "reasoning": reasoning["reasoning"],
        "assets": _entity_assets(),
    }


def chat_with_entity(client_name, message, mode="internal"):
    clean_client_name = _sanitize_client_name(client_name)
    clean_message = (message or "").strip()
    clean_mode = mode if mode in {"internal", "client"} else "internal"

    if not clean_client_name:
        raise ValueError("Client is required.")

    if not clean_message:
        raise ValueError("Message is required.")

    from services.entity_conversation_engine import run_entity_conversation

    return run_entity_conversation(
        clean_client_name,
        clean_message,
        clean_mode,
    )


def get_creative_library_asset_path(relative_path):
    if not relative_path:
        raise FileNotFoundError("Creative asset path is required.")

    requested_path = Path(relative_path)

    if requested_path.is_absolute() or ".." in requested_path.parts:
        raise ValueError("Invalid creative asset path.")

    asset_path = (CREATIVE_LIBRARY_ROOT / requested_path).resolve()
    root = CREATIVE_LIBRARY_ROOT.resolve()

    if asset_path != root and root not in asset_path.parents:
        raise ValueError("Creative asset path must stay inside 04_CREATIVE_LIBRARY.")

    if not asset_path.exists():
        raise FileNotFoundError("Creative asset not found.")

    if asset_path.is_dir():
        raise IsADirectoryError("Creative asset path points to a directory.")

    if asset_path.suffix.casefold() not in ALLOWED_ENTITY_ASSET_EXTENSIONS:
        raise ValueError("Creative asset type is not allowed.")

    return asset_path
