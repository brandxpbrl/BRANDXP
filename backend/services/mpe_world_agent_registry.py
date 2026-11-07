import json
from copy import deepcopy
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
REGISTRY_PATH = PROJECT_ROOT / "backend" / "config" / "mpe_world_agents.json"


def _load_registry():
    payload = json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))
    agents = payload.get("agents") or []
    ids = [agent.get("id") for agent in agents]
    if len(ids) != len(set(ids)):
        raise ValueError("MPE World registry contains duplicate agent IDs.")
    return payload


def mpe_world_registry():
    return deepcopy(_load_registry())


def list_mpe_world_agents():
    return deepcopy(_load_registry()["agents"])


def get_mpe_world_agent(agent_id):
    normalized = str(agent_id or "").strip().casefold()
    for agent in _load_registry()["agents"]:
        aliases = {agent["id"].casefold(), agent["name"].casefold()}
        if normalized in aliases:
            return deepcopy(agent)
    return None


def gravity_governance_context():
    registry = _load_registry()
    selected = [
        agent for agent in registry["agents"]
        if agent["id"] in {"00B", "001", "029", "030", "031", "034", "099", "GPT", "GEMINI"}
    ]
    lines = [
        "# MPE WORLD GOVERNANCE",
        "Human authority is final for sensitive actions.",
        "Simulations are not facts; creative outputs are not evidence.",
    ]
    for agent in selected:
        forbidden = ", ".join(agent.get("must_not") or [])
        lines.append(f"- {agent['id']} {agent['name']} ({agent['role']}): must not {forbidden}.")
    return "\n".join(lines)
