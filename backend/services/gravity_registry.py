import hashlib
import re
from copy import deepcopy
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
GRAVITY_ROOT = PROJECT_ROOT / "agentes_desarrollo_local"

CANONICAL_NAMES = {
    "A00": "Integrador de Coherencia Sistemica",
    "A00B": "El Escribano",
    "A01": "Imagen", "A02": "Tipografia", "A03": "Psicologia",
    "A04": "Emociones", "A05": "Comportamiento", "A06": "Texto",
    "A07": "Tension de Identidad", "A08": "Contenido y Canales",
    "A09": "Embudos de Captacion", "A10": "Copy de Trafico",
    "A11": "Niveles de Consciencia", "A12": "Pedagogia y Metodos",
    "A13": "Tesis Filosofica", "A14": "Carta Natal, Diseno Humano y Claves Geneticas",
    "A15": "Ciclos y Transitos", "A16": "Sinastria de Marca", "A17": "PNL",
    "A18": "Comportamiento Social", "A19": "Proposito del Alma",
    "A20": "Sombra y Alquimia", "A21": "Ritual y Ceremonia",
    "A22": "Biodescodificacion", "A23": "Identity Miner",
    "A27": "Activacion", "A28": "Expansion", "A29": "Condensacion",
    "A30": "Integracion", "A31": "Resonancia", "A32": "Proyeccion",
    "A33": "Anclaje", "A34": "Nueva Escala", "A99": "Limpiador",
}

STAGES = [
    {"id": "factual_extraction", "members": ["A23"]},
    {"id": "specialists", "members": [f"A{i:02d}" for i in range(1, 23)]},
    {"id": "crossings", "members": ["SYNAPSES"]},
    {"id": "cleanup", "members": ["A99"]},
    {"id": "semantic_compression", "members": ["A00B"]},
    *[
        {"id": f"macro_{i:02d}", "members": [f"A{i:02d}"]}
        for i in range(27, 35)
    ],
    {"id": "final_integration", "members": ["A00"]},
]


def _agent_id(path):
    match = re.match(r"^(\d{2})(_b)?_agente_", path.name)
    if not match:
        return None
    return f"A{match.group(1)}{'B' if match.group(2) else ''}"


def _sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _stage_for(agent_id):
    for index, stage in enumerate(STAGES):
        if agent_id in stage["members"]:
            return index, stage["id"]
    raise ValueError(f"Gravity agent {agent_id} is missing from the execution graph.")


def _dependencies(agent_id):
    index, _ = _stage_for(agent_id)
    if agent_id == "A00":
        return ["A34", "A00B"]
    if agent_id == "A00B":
        return ["A99", "SYNAPSES", "A23"] + [f"A{i:02d}" for i in range(1, 23)]
    if agent_id == "A99":
        return ["SYNAPSES"]
    if agent_id == "A23":
        return []
    if agent_id.startswith("A") and agent_id[1:].isdigit():
        number = int(agent_id[1:])
        if 1 <= number <= 22:
            return ["A23"]
        if number == 27:
            return ["A00B"]
        if 28 <= number <= 34:
            return [f"A{number - 1:02d}"]
    return STAGES[index - 1]["members"] if index else []


def list_gravity_agents():
    agents = []
    for path in sorted(GRAVITY_ROOT.glob("[0-9][0-9]*_agente_*.md")):
        agent_id = _agent_id(path)
        if not agent_id:
            continue
        stage_index, stage_id = _stage_for(agent_id)
        agents.append({
            "id": agent_id,
            "namespaced_id": f"GRAVITY:{agent_id}",
            "name": CANONICAL_NAMES[agent_id],
            "execution_kind": "prompt_only",
            "source_path": path.relative_to(PROJECT_ROOT).as_posix(),
            "source_sha256": _sha256(path),
            "stage": stage_id,
            "stage_index": stage_index,
            "depends_on": _dependencies(agent_id),
        })
    if len(agents) != 34:
        raise ValueError(f"Expected 34 Gravity agents, found {len(agents)}.")
    return deepcopy(agents)


def get_gravity_agent(agent_id):
    normalized = str(agent_id or "").strip().upper().removeprefix("GRAVITY:")
    return next((agent for agent in list_gravity_agents() if agent["id"] == normalized), None)


def gravity_execution_graph():
    agents = list_gravity_agents()
    return {
        "namespace": "GRAVITY",
        "status": "registered_not_executed",
        "agent_count": len(agents),
        "crossing_components": {"synaptic": 10, "mirror": 2, "execution_kind": "prompt_only"},
        "stages": deepcopy(STAGES),
        "agents": agents,
        "governance": {
            "human_approval_required": True,
            "mpe_observer_mode": "read_only",
            "gravity_a00b_is_not_mpe_00b": True,
            "outputs_are_not_canon_until_approved": True,
        },
    }
