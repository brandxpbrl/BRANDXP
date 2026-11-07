import hashlib
import json
import re
from copy import deepcopy
from datetime import datetime
from pathlib import Path
from uuid import uuid4


PROJECT_ROOT = Path(__file__).resolve().parents[2]
SOURCE_ROOT = PROJECT_ROOT / "BRAND_EXPERIENCE_OS" / "KNOWLEDGE" / "ENTITY_BIBLE"
CANDIDATES_ROOT = PROJECT_ROOT / "runtime" / "entity_bible_v2" / "candidates"
VALIDATIONS_ROOT = PROJECT_ROOT / "runtime" / "entity_bible_v2" / "mcos_validations"
CANON_ROOT = PROJECT_ROOT / "runtime" / "entity_bible_v2" / "canon"

MODES = {"narrative", "character", "scene", "visual", "cinematic", "brand", "operational"}


def _now():
    return datetime.now().astimezone().isoformat(timespec="seconds")


def _slug(value):
    return re.sub(r"[^a-z0-9]+", "-", str(value or "").casefold()).strip("-")


def _write(path, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    temporary.replace(path)


def _source_provenance(source_path):
    root = SOURCE_ROOT.resolve()
    path = (root / source_path).resolve()
    path.relative_to(root)
    if not path.is_file():
        raise ValueError(f"Entity Bible source not found: {source_path}")
    content = path.read_bytes()
    return {
        "source_path": path.relative_to(root).as_posix(),
        "source_sha256": hashlib.sha256(content).hexdigest(),
        "source_type": "legacy_doctrine",
        "confidence": 0.35,
    }


def create_candidate(payload, persist=True):
    required = [
        "knowledge_id", "title", "domain", "knowledge_type", "definition",
        "when_to_use", "diagnostic_method", "observable_indicators",
        "analysis_questions", "decision_rules", "good_examples", "bad_examples",
        "limits_and_counterexamples", "expected_result", "relationships",
        "source_path", "recommended_agents",
    ]
    missing = [field for field in required if not payload.get(field)]
    if missing:
        raise ValueError(f"Missing candidate fields: {', '.join(missing)}")
    candidate = {key: deepcopy(value) for key, value in payload.items() if key != "source_path"}
    candidate.update({
        "status": "in_review",
        "provenance": _source_provenance(payload["source_path"]),
        "governance": {
            "version": payload.get("version", "2.0.0-candidate.1"),
            "author": payload.get("author", "ORBIS Entity Bible Upgrade"),
            "reviewer": None,
            "approved_at": None,
            "supersedes": payload.get("supersedes"),
        },
        "agent_access": {
            "recommended_agents": list(payload["recommended_agents"]),
            "forbidden_uses": list(payload.get("forbidden_uses") or [
                "Treating the candidate as approved canon",
                "Using it as evidence of a real-world fact without an external source",
            ]),
        },
        "created_at": _now(),
    })
    if persist:
        _write(CANDIDATES_ROOT / f"{_slug(candidate['knowledge_id'])}.json", candidate)
    return candidate


def validate_candidate_with_mcos(candidate, persist=True):
    transformations = _transformations(candidate)
    diagnostics = [
        _diagnostic(
            "semantic_specificity",
            len(candidate.get("definition", "")) >= 80 and len(candidate.get("decision_rules", [])) >= 2,
            [
                f"definition_chars={len(candidate.get('definition', ''))}",
                f"decision_rules={len(candidate.get('decision_rules', []))}",
            ],
        ),
        _diagnostic(
            "observability",
            len(candidate.get("observable_indicators", [])) >= 3,
            [f"observable_indicators={len(candidate.get('observable_indicators', []))}"],
        ),
        _diagnostic(
            "diagnostic_operability",
            len(candidate.get("diagnostic_method", [])) >= 3 and len(candidate.get("analysis_questions", [])) >= 3,
            [
                f"diagnostic_steps={len(candidate.get('diagnostic_method', []))}",
                f"analysis_questions={len(candidate.get('analysis_questions', []))}",
            ],
        ),
        _diagnostic(
            "counterexample_strength",
            bool(candidate.get("bad_examples")) and len(candidate.get("limits_and_counterexamples", [])) >= 2,
            [
                f"bad_examples={len(candidate.get('bad_examples', []))}",
                f"limits={len(candidate.get('limits_and_counterexamples', []))}",
            ],
        ),
        _diagnostic(
            "cross_modal_application",
            len({item["mode"] for item in transformations}) >= 3,
            [f"modes={','.join(item['mode'] for item in transformations)}"],
        ),
    ]
    passed = sum(item["result"] == "pass" for item in diagnostics)
    validation_id = f"mcos-validation-{uuid4().hex[:12]}"
    validation = {
        "validation_id": validation_id,
        "engine": "MCOS Semantic Validation Adapter",
        "engine_version": "0.1.0",
        "knowledge_id": candidate["knowledge_id"],
        "candidate_version": candidate["governance"]["version"],
        "generated_at": _now(),
        "status": "candidate" if passed == len(diagnostics) else "needs_revision",
        "transformations": transformations,
        "diagnostics": diagnostics,
        "score": round(100 * passed / len(diagnostics)),
        "lineage": [
            {
                "source_id": candidate["knowledge_id"],
                "output_id": item["output_id"],
                "action": f"MCOS transformed candidate into {item['mode']} application",
            }
            for item in transformations
        ],
        "reviewed_by": None,
        "canon_effect": "none_until_human_approval",
    }
    if persist:
        _write(VALIDATIONS_ROOT / f"{_slug(candidate['knowledge_id'])}.json", validation)
    return validation


def _diagnostic(criterion, passed, reasons):
    return {
        "criterion": criterion,
        "result": "pass" if passed else "fail",
        "reasons": reasons,
    }


def _transformations(candidate):
    title = candidate["title"]
    definition = candidate["definition"]
    indicators = candidate["observable_indicators"]
    good = candidate["good_examples"][0]
    modes = _modes_for_domain(candidate["domain"])
    transformations = []
    for mode in modes:
        output_id = f"mcos-{mode}-{_slug(candidate['knowledge_id'])}"
        transformations.append({
            "output_id": output_id,
            "mode": mode,
            "input": f"Apply {title}: {definition}",
            "output": _mode_output(mode, title, good),
            "expected_observation": f"At least one observable indicator must be visible: {indicators[0]}",
        })
    return transformations


def _modes_for_domain(domain):
    if domain in {"visual_psychology", "visual_direction", "cinematic", "aesthetics", "luxury"}:
        return ["visual", "cinematic", "brand"]
    if domain in {"systems", "frameworks", "memory", "transformation", "forbidden_patterns"}:
        return ["operational", "brand", "narrative"]
    return ["narrative", "character", "brand"]


def _mode_output(mode, title, example):
    situation = example.get("situation") or example.get("context") or "Applied case"
    result = example.get("result") or example.get("outcome") or "Observable coherent result"
    templates = {
        "narrative": f"Narrative test for {title}: show {situation} through a decision and its consequence; expected outcome: {result}.",
        "character": f"Character test for {title}: behavior must reveal the principle before dialogue explains it; expected outcome: {result}.",
        "scene": f"Scene test for {title}: encode the principle in action, object and spatial relation; expected outcome: {result}.",
        "visual": f"Visual test for {title}: translate the principle into hierarchy, contrast and focus; expected outcome: {result}.",
        "cinematic": f"Cinematic test for {title}: express the principle through framing, light, rhythm and transition; expected outcome: {result}.",
        "brand": f"Brand test for {title}: apply the principle to one real touchpoint and compare before/after perception; expected outcome: {result}.",
        "operational": f"Operational test for {title}: convert the principle into ownership, sequence and verification; expected outcome: {result}.",
    }
    return templates[mode]


def compare_validations(previous, current):
    previous_results = {item["criterion"]: item["result"] for item in previous.get("diagnostics", [])}
    current_results = {item["criterion"]: item["result"] for item in current.get("diagnostics", [])}
    changed = [
        {"criterion": key, "from": previous_results.get(key), "to": value}
        for key, value in current_results.items()
        if previous_results.get(key) != value
    ]
    return {
        "knowledge_id": current.get("knowledge_id"),
        "previous_version": previous.get("candidate_version"),
        "current_version": current.get("candidate_version"),
        "score_change": current.get("score", 0) - previous.get("score", 0),
        "diagnostic_changes": changed,
        "requires_canon_review": bool(changed),
    }


def get_candidate(knowledge_id):
    path = CANDIDATES_ROOT / f"{_slug(knowledge_id)}.json"
    if not path.is_file():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def get_validation(knowledge_id):
    path = VALIDATIONS_ROOT / f"{_slug(knowledge_id)}.json"
    if not path.is_file():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def list_candidates():
    if not CANDIDATES_ROOT.is_dir():
        return []
    result = []
    for path in sorted(CANDIDATES_ROOT.glob("*.json")):
        candidate = json.loads(path.read_text(encoding="utf-8"))
        validation = get_validation(candidate["knowledge_id"])
        result.append({
            "knowledge_id": candidate["knowledge_id"],
            "title": candidate["title"],
            "domain": candidate["domain"],
            "status": candidate["status"],
            "version": candidate["governance"]["version"],
            "recommended_agents": candidate["agent_access"]["recommended_agents"],
            "mcos_score": validation.get("score") if validation else None,
            "mcos_status": validation.get("status") if validation else "not_run",
        })
    return result


def review_candidate(knowledge_id, decision, reviewer, note=""):
    decision = str(decision or "").strip().casefold()
    reviewer = str(reviewer or "").strip()
    if decision not in {"approved", "rejected"}:
        raise ValueError("Decision must be approved or rejected.")
    if not reviewer:
        raise ValueError("Reviewer is required.")
    candidate = get_candidate(knowledge_id)
    validation = get_validation(knowledge_id)
    if not candidate:
        return None
    if not validation:
        raise ValueError("MCOS validation is required before human review.")
    if decision == "approved" and validation.get("status") != "candidate":
        raise ValueError("Candidate must pass MCOS structural validation before approval.")
    canon_path = CANON_ROOT / f"{_slug(knowledge_id)}.json"
    if decision == "approved" and canon_path.exists():
        raise ValueError("An approved canon entry already exists; create a new candidate version instead.")
    reviewed_at = _now()
    candidate["status"] = decision
    candidate["governance"].update({
        "reviewer": reviewer,
        "approved_at": reviewed_at if decision == "approved" else None,
    })
    candidate["review_note"] = str(note or "").strip()
    candidate["mcos_validation"] = {
        "status": "accepted" if decision == "approved" else "rejected",
        "transformations": validation["transformations"],
        "diagnostics": validation["diagnostics"],
        "lineage": validation["lineage"],
        "reviewed_by": reviewer,
    }
    _write(CANDIDATES_ROOT / f"{_slug(knowledge_id)}.json", candidate)
    if decision == "approved":
        _write(canon_path, candidate)
    return candidate
