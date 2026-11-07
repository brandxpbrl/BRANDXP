import json
from datetime import datetime
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
CANON_ROOT = PROJECT_ROOT / "runtime" / "entity_bible_v2" / "canon"
OUTPUT_ROOT = PROJECT_ROOT / "runtime" / "entity_bible_v2" / "gravity_reviews"

DOMAIN_AGENTS = {
    "philosophy": ["A13", "A07", "A06"],
    "visual_psychology": ["A01", "A03", "A04"],
    "systems": ["A12", "A05", "A09"],
}


def _now():
    return datetime.now().astimezone().isoformat(timespec="seconds")


def _write(path, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    temporary.replace(path)


def load_canon(knowledge_id):
    path = CANON_ROOT / f"{knowledge_id}.json"
    if not path.is_file():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def build_gravity_review_packet(knowledge_id, persist=True):
    unit = load_canon(knowledge_id)
    if not unit:
        return None
    specialists = DOMAIN_AGENTS.get(unit["domain"], ["A06", "A12", "A13"])
    packet = {
        "gravity_contract_version": "1.0.0",
        "knowledge_id": knowledge_id,
        "canon_version": unit["governance"]["version"],
        "generated_at": _now(),
        "rector_documents": [
            "00_indice_maestro_agentes.md",
            "00_protocolo_evidencia_comun.md",
            "00_protocolo_seguridad_etica.md",
        ],
        "execution_order": [
            {"stage": "factual_base", "agents": ["A23"], "output": "Verified claims, source hash and declared scope"},
            {"stage": "specialist_review", "agents": specialists, "output": "Independent domain critiques with evidence layers"},
            {"stage": "lateral_crossing", "agents": ["synaptic_neurons", "mirror_neurons"], "output": "Coherences, contradictions and unresolved flags"},
            {"stage": "cleanup", "agents": ["A99"], "output": "Deduplicated active evidence without deleting history"},
            {"stage": "synthesis", "agents": ["A00-B"], "output": "Compressed synthesis without new unsupported claims"},
            {"stage": "master_cycle", "agents": [f"A{number}" for number in range(27, 35)], "output": "Activation through new-scale sequence"},
            {"stage": "final_verdict", "agents": ["A00"], "output": "Coherence verdict, risks and open contradictions"},
        ],
        "evidence_layers_required": ["fact", "inference", "hypothesis", "recommendation"],
        "input": {
            "definition": unit["definition"],
            "provenance": unit["provenance"],
            "decision_rules": unit["decision_rules"],
            "mcos_diagnostics": unit["mcos_validation"]["diagnostics"],
        },
        "promotion_rule": "Gravity may recommend a revision but cannot overwrite approved canon.",
        "status": "ready_for_gravity_execution",
    }
    if persist:
        _write(OUTPUT_ROOT / f"{knowledge_id}.json", packet)
    return packet


def build_all_gravity_packets():
    if not CANON_ROOT.is_dir():
        return []
    return [
        build_gravity_review_packet(path.stem)
        for path in sorted(CANON_ROOT.glob("*.json"))
    ]
