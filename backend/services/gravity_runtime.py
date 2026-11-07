import hashlib
import json
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path
from threading import RLock
from uuid import uuid4

from services.gravity_registry import get_gravity_agent, gravity_execution_graph
from services.gravity_output_validator import validate_gravity_output
from services.gravity_trace import GravityEventType, GravityTraceEvent


PROJECT_ROOT = Path(__file__).resolve().parents[2]
RUNS_ROOT = PROJECT_ROOT / "runtime" / "gravity" / "runs"
_LOCK = RLock()


def _now():
    return datetime.now(timezone.utc).isoformat()


def _id(prefix):
    return f"{prefix}-{uuid4().hex[:12]}"


def _hash_text(value):
    return hashlib.sha256(str(value).encode("utf-8")).hexdigest()


def _run_path(run_id):
    if not str(run_id).startswith("gravity-run-") or Path(str(run_id)).name != str(run_id):
        raise ValueError("Invalid Gravity run ID.")
    return RUNS_ROOT / f"{run_id}.json"


def _write_atomic(path, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    temporary.replace(path)


def _event(payload, event_type, component_id, task_id, **kwargs):
    event = GravityTraceEvent(
        id=_id("gravity-event"),
        run_id=payload["id"],
        task_id=task_id,
        component_id=component_id,
        event_type=event_type,
        sequence=len(payload["events"]),
        origin="gravity_runtime",
        **kwargs,
    ).to_dict()
    payload["events"].append(event)
    return event


def _selected_ids(mode):
    if mode == "a23_only":
        return ["A23"]
    if mode == "minimal_specialists":
        return ["A23", "A01", "A03", "A06"]
    if mode == "full_plan":
        graph = gravity_execution_graph()
        ordered = []
        for stage in graph["stages"]:
            ordered.extend(stage["members"])
        return ordered
    raise ValueError("Unknown Gravity run mode.")


def create_dry_run(request):
    if request.get("execution_mode", "dry_run") != "dry_run":
        raise ValueError("Only dry_run Gravity planning is enabled.")
    if request.get("evidence_kind", "synthetic") != "synthetic":
        raise ValueError("The first Gravity runner only accepts synthetic evidence.")
    title = " ".join(str(request.get("title") or "").split())
    evidence = str(request.get("evidence") or "").strip()
    if not title or not evidence:
        raise ValueError("Gravity dry run requires title and synthetic evidence.")

    mode = request.get("mode", "a23_only")
    selected_ids = _selected_ids(mode)
    run_id = _id("gravity-run")
    now = _now()
    tasks = []
    selected_set = set(selected_ids)
    for component_id in selected_ids:
        if component_id == "SYNAPSES":
            source_hash = None
            dependencies = [f"A{i:02d}" for i in range(1, 23) if f"A{i:02d}" in selected_set]
            name = "Synaptic and mirror comparison bundle"
        else:
            agent = get_gravity_agent(component_id)
            source_hash = agent["source_sha256"]
            dependencies = [item for item in agent["depends_on"] if item in selected_set]
            name = agent["name"]
        tasks.append({
            "id": _id("gravity-task"),
            "component_id": f"GRAVITY:{component_id}",
            "name": name,
            "state": "pending",
            "depends_on_components": [f"GRAVITY:{item}" for item in dependencies],
            "source_hash": source_hash,
            "input_hash": None,
            "output_hash": None,
            "output": None,
            "review": {"state": "not_submitted", "reviewer": None, "reviewed_at": None, "note": ""},
        })

    payload = {
        "schema_version": "gravity-run-v1",
        "id": run_id,
        "title": title,
        "mode": mode,
        "execution_mode": "dry_run",
        "evidence_kind": "synthetic",
        "state": "pending",
        "created_at": now,
        "updated_at": now,
        "input": {"content": evidence, "sha256": _hash_text(evidence)},
        "tasks": tasks,
        "events": [],
        "approval_gate": {
            "state": "locked",
            "model_calls_allowed": False,
            "production_data_allowed": False,
            "memory_promotion_allowed": False,
            "mpe_observer_mode": "read_only",
        },
    }
    first_task = tasks[0]
    _event(
        payload, GravityEventType.INPUT_SUPPLIED, "GRAVITY:INPUT", first_task["id"],
        source_hashes=[payload["input"]["sha256"]], input_hash=payload["input"]["sha256"],
        details={"evidence_kind": "synthetic", "mode": mode},
    )
    with _LOCK:
        _write_atomic(_run_path(run_id), payload)
    return deepcopy(payload)


def get_dry_run(run_id):
    path = _run_path(run_id)
    if not path.is_file():
        return None
    with _LOCK:
        return json.loads(path.read_text(encoding="utf-8"))


def list_dry_runs():
    if not RUNS_ROOT.is_dir():
        return []
    runs = []
    for path in sorted(RUNS_ROOT.glob("gravity-run-*.json"), reverse=True):
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            continue
        runs.append({key: payload.get(key) for key in ("id", "title", "mode", "state", "created_at", "updated_at")})
    return runs


def request_task(run_id, component_id):
    component_id = str(component_id).upper().removeprefix("GRAVITY:")
    with _LOCK:
        payload = get_dry_run(run_id)
        if not payload:
            return None
        task = next((item for item in payload["tasks"] if item["component_id"] == f"GRAVITY:{component_id}"), None)
        if not task:
            raise ValueError("Gravity task not found in this run.")
        if task["state"] != "pending":
            raise ValueError("Gravity task is not pending.")
        incomplete = [
            dependency for dependency in task["depends_on_components"]
            if (
                next((item for item in payload["tasks"] if item["component_id"] == dependency), {}).get("state") != "completed"
                or next((item for item in payload["tasks"] if item["component_id"] == dependency), {}).get("review", {}).get("state") != "approved"
            )
        ]
        if incomplete:
            raise ValueError("Gravity task dependencies are not completed.")
        source_hashes = [payload["input"]["sha256"]]
        source_hashes.extend(item["output_hash"] for item in payload["tasks"] if item["output_hash"])
        task["input_hash"] = _hash_text("|".join(source_hashes))
        task["state"] = "requested"
        payload["state"] = "requested"
        payload["updated_at"] = _now()
        parent_ids = [payload["events"][-1]["id"]] if payload["events"] else []
        _event(
            payload, GravityEventType.AGENT_REQUESTED, task["component_id"], task["id"],
            causal_parent_ids=parent_ids, source_hashes=source_hashes, input_hash=task["input_hash"],
            details={"dry_run": True, "model_call_performed": False},
        )
        _write_atomic(_run_path(run_id), payload)
        return deepcopy(payload)


def record_synthetic_output(run_id, component_id, output):
    component_id = str(component_id).upper().removeprefix("GRAVITY:")
    namespaced_id = f"GRAVITY:{component_id}"
    with _LOCK:
        payload = get_dry_run(run_id)
        if not payload:
            return None
        if payload.get("execution_mode") != "dry_run" or payload.get("evidence_kind") != "synthetic":
            raise ValueError("Only synthetic dry-run outputs can be recorded.")
        task = next((item for item in payload["tasks"] if item["component_id"] == namespaced_id), None)
        if not task:
            raise ValueError("Gravity task not found in this run.")
        if task["state"] != "requested":
            raise ValueError("Gravity task must be requested before recording output.")
        candidate = deepcopy(output)
        candidate["component_id"] = namespaced_id
        allowed_hashes = {payload["input"]["sha256"]}
        allowed_hashes.update(item["output_hash"] for item in payload["tasks"] if item["output_hash"])
        ledger = validate_gravity_output(candidate, allowed_hashes)
        task["output"] = ledger
        task["output_hash"] = ledger["sha256"]
        task["state"] = "completed"
        task["review"] = {"state": "pending", "reviewer": None, "reviewed_at": None, "note": ""}
        payload["state"] = "awaiting_review"
        payload["updated_at"] = _now()
        parent_ids = [payload["events"][-1]["id"]] if payload["events"] else []
        _event(
            payload, GravityEventType.AGENT_OUTPUT_SAVED, namespaced_id, task["id"],
            causal_parent_ids=parent_ids,
            source_hashes=sorted(allowed_hashes),
            input_hash=task["input_hash"],
            output_hash=ledger["sha256"],
            trajectory_kind="simulated",
            validity="structurally_valid_awaiting_human_review",
            details={
                "model_call_performed": False,
                "claim_count": len(ledger["claims"]),
                "open_contradictions": ledger["open_contradictions"],
                "memory_promotion_allowed": False,
            },
        )
        _write_atomic(_run_path(run_id), payload)
        return deepcopy(payload)


def review_task_output(run_id, component_id, decision, reviewer, note=""):
    component_id = str(component_id).upper().removeprefix("GRAVITY:")
    namespaced_id = f"GRAVITY:{component_id}"
    decision = str(decision).strip().casefold()
    reviewer = " ".join(str(reviewer or "").split())
    note = " ".join(str(note or "").split())
    if decision not in {"approved", "rejected"}:
        raise ValueError("Gravity review decision must be approved or rejected.")
    if not reviewer:
        raise ValueError("Gravity review requires a human reviewer.")
    with _LOCK:
        payload = get_dry_run(run_id)
        if not payload:
            return None
        task = next((item for item in payload["tasks"] if item["component_id"] == namespaced_id), None)
        if not task or task.get("state") != "completed" or not task.get("output"):
            raise ValueError("Gravity task has no completed output to review.")
        review_state = task.get("review", {}).get("state") or "pending"
        if review_state != "pending":
            raise ValueError("Gravity task output is not pending review.")
        reviewed_at = _now()
        task["review"] = {
            "state": decision,
            "reviewer": reviewer,
            "reviewed_at": reviewed_at,
            "note": note,
            "output_hash": task["output_hash"],
        }
        if decision == "approved":
            remaining = [item for item in payload["tasks"] if item["state"] != "completed"]
            payload["state"] = "approved" if not remaining else "ready_for_next_stage"
        else:
            payload["state"] = "needs_revision"
        payload["updated_at"] = reviewed_at
        payload["approval_gate"]["state"] = "human_review_recorded"
        parent_ids = [payload["events"][-1]["id"]] if payload["events"] else []
        _event(
            payload, GravityEventType.FEEDBACK_REQUESTED, namespaced_id, task["id"],
            causal_parent_ids=parent_ids,
            source_hashes=[task["output_hash"]],
            output_hash=task["output_hash"],
            trajectory_kind="observed",
            validity=f"human_{decision}",
            details={
                "decision": decision,
                "reviewer": reviewer,
                "reviewed_at": reviewed_at,
                "note": note,
                "memory_promotion_allowed": False,
            },
        )
        _write_atomic(_run_path(run_id), payload)
        return deepcopy(payload)
