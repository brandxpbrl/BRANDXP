import json
import re
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
CANON_ROOT = PROJECT_ROOT / "runtime" / "entity_bible_v2" / "canon"
KNOWLEDGE_ID_PATTERN = re.compile(r"^eb-[a-z0-9-]+$")


class CanonValidationError(ValueError):
    pass


def _canon_path(knowledge_id, canon_root=None):
    if not KNOWLEDGE_ID_PATTERN.fullmatch(knowledge_id or ""):
        raise CanonValidationError("Invalid Entity Bible knowledge_id.")
    root = Path(canon_root or CANON_ROOT).resolve()
    path = (root / f"{knowledge_id}.json").resolve()
    if path.parent != root:
        raise CanonValidationError("Entity Bible canon path escaped its approved root.")
    return path


def _validate_approved_unit(unit, path):
    if not isinstance(unit, dict):
        raise CanonValidationError(f"Canon unit {path.name} must be a JSON object.")
    knowledge_id = unit.get("knowledge_id")
    if knowledge_id != path.stem:
        raise CanonValidationError(f"Canon unit identity does not match filename: {path.name}.")
    if unit.get("status") != "approved":
        raise CanonValidationError(f"Canon unit {knowledge_id} is not approved.")

    governance = unit.get("governance") or {}
    if not governance.get("reviewer") or not governance.get("approved_at"):
        raise CanonValidationError(f"Canon unit {knowledge_id} lacks human approval evidence.")

    provenance = unit.get("provenance") or {}
    source_hash = provenance.get("source_sha256", "")
    if not provenance.get("source_path") or not re.fullmatch(r"[a-f0-9]{64}", source_hash):
        raise CanonValidationError(f"Canon unit {knowledge_id} lacks valid provenance.")

    validation = unit.get("mcos_validation") or {}
    if validation.get("status") != "accepted" or not validation.get("reviewed_by"):
        raise CanonValidationError(f"Canon unit {knowledge_id} lacks accepted MCOS validation.")
    return unit


def get_approved_unit(knowledge_id, canon_root=None):
    path = _canon_path(knowledge_id, canon_root)
    if not path.is_file():
        return None
    try:
        unit = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise CanonValidationError(f"Canon unit {knowledge_id} cannot be read: {error}.") from error
    return _validate_approved_unit(unit, path)


def list_approved_units(canon_root=None):
    root = Path(canon_root or CANON_ROOT).resolve()
    if not root.is_dir():
        return []
    units = []
    for path in sorted(root.glob("eb-*.json")):
        units.append(get_approved_unit(path.stem, root))
    return units


def search_approved_units(query="", domains=None, recommended_agent=None, limit=20, canon_root=None):
    normalized_query = (query or "").strip().casefold()
    allowed_domains = {item.casefold() for item in (domains or [])}
    normalized_agent = (recommended_agent or "").strip().casefold()
    matches = []
    for unit in list_approved_units(canon_root):
        if allowed_domains and unit.get("domain", "").casefold() not in allowed_domains:
            continue
        agents = {
            item.casefold()
            for item in (unit.get("agent_access", {}).get("recommended_agents") or [])
        }
        if normalized_agent and normalized_agent not in agents:
            continue
        searchable = " ".join([
            unit.get("knowledge_id", ""),
            unit.get("title", ""),
            unit.get("definition", ""),
            " ".join(unit.get("decision_rules") or []),
        ]).casefold()
        if normalized_query and normalized_query not in searchable:
            continue
        matches.append(unit)
        if len(matches) >= max(1, min(int(limit), 100)):
            break
    return matches
