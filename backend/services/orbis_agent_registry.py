import json
import re
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
ORBIS_DOCUMENTATION_ROOT = PROJECT_ROOT / "exports" / "orbis-team" / "documentation"
ORBIS_REGISTRY_PATH = PROJECT_ROOT / "backend" / "config" / "orbis_agents.json"

DOCUMENT_SECTIONS = {
    "identity": "00_MASTER_IDENTIDAD",
    "avatar": "01_AVATAR_Y_REFERENCIAS",
    "communication": "02_PERSONALIDAD_Y_COMUNICACION",
    "scripts": "03_GUIONES",
    "videos": "04_VIDEOS_DE_PRESENTACION",
    "templates": "05_PLANTILLAS_Y_RECURSOS",
    "social": "06_CONTENIDO_SOCIAL",
    "capabilities": "07_FUNCION_CAPACIDADES_Y_LIMITES",
    "knowledge": "08_MEMORIA_CONOCIMIENTO_Y_FUENTES",
    "reports": "09_RESULTADOS_Y_REPORTES",
    "messaging": "10_MENSAJERIA_Y_ATENCION_AUTOMATIZADA",
}


def _read_markdown(directory):
    if not directory.is_dir():
        return "", None

    files = sorted(directory.glob("*.md"))
    if not files:
        return "", None

    path = files[0]
    return path.read_text(encoding="utf-8", errors="ignore").strip(), path


def _match(text, pattern, fallback=""):
    match = re.search(pattern, text or "", re.IGNORECASE | re.MULTILINE)
    return match.group(1).strip() if match else fallback


def _canonical_agents():
    try:
        payload = json.loads(ORBIS_REGISTRY_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}
    return {item["id"].casefold(): item for item in payload.get("agents", [])}


def _agent_from_directory(agent_directory):
    canonical = _canonical_agents().get(agent_directory.name.casefold(), {})
    documents = {}
    content = {}

    for key, folder in DOCUMENT_SECTIONS.items():
        text, path = _read_markdown(agent_directory / folder)
        content[key] = text
        documents[key] = str(path) if path else None

    identity = content["identity"]
    heading = _match(identity, r"^#\s+(.+?)(?:\s+[—-]\s+|$)", agent_directory.name.title())
    name = _match(identity, r"\*\*Nombre completo:\*\*\s*(.+)", heading)
    role = _match(identity, r"\*\*Cargo:\*\*\s*(.+)", "Rol pendiente de validacion")
    specialty = _match(identity, r"\*\*Especialidad organizacional:\*\*\s*(.+)")
    mission = _match(identity, r"## Misi[oó]n\s*\n+(.+)")
    status = _match(identity, r"## Estado\s*\n+(.+)", "Documentacion localizada")

    return {
        "id": agent_directory.name.casefold(),
        "name": canonical.get("name") or name,
        "role": canonical.get("role") or role,
        "department": canonical.get("department", ""),
        "activation_state": canonical.get("activation_state", "draft"),
        "authority": canonical.get("authority", "none_until_validation"),
        "avatar": canonical.get("avatar"),
        "video": canonical.get("video"),
        "tools": canonical.get("tools", []),
        "specialty": specialty,
        "mission": mission,
        "status": status,
        "documentation_complete": all(documents.values()),
        "documents": documents,
        "capability_summary": content["capabilities"],
        "communication_summary": content["communication"],
        "report_protocol": content["reports"],
        "source_policy": content["knowledge"],
    }


def list_orbis_agents(include_internal=False):
    if not ORBIS_DOCUMENTATION_ROOT.is_dir():
        return []

    agents = [
        _agent_from_directory(directory)
        for directory in sorted(ORBIS_DOCUMENTATION_ROOT.iterdir())
        if directory.is_dir()
    ]

    if include_internal:
        return agents

    public_keys = {
        "id",
        "name",
        "role",
        "specialty",
        "mission",
        "status",
        "documentation_complete",
        "documents",
        "department",
        "activation_state",
        "authority",
        "avatar",
        "video",
        "tools",
    }
    return [{key: agent[key] for key in public_keys} for agent in agents]


def get_orbis_agent(agent_id, include_internal=False):
    normalized = (agent_id or "").strip().casefold()
    if not normalized:
        return None

    for agent in list_orbis_agents(include_internal=True):
        aliases = {
            agent["id"],
            agent["name"].casefold(),
            agent["name"].split()[0].casefold(),
        }
        if normalized in aliases:
            if include_internal:
                return agent
            return next(
                item for item in list_orbis_agents() if item["id"] == agent["id"]
            )

    return None
