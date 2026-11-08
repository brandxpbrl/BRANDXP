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

SPECIALIST_BATCHES = {
    "identity_perception": ["A02", "A04", "A05", "A07"],
    "marketing_communication": ["A08", "A09", "A10"],
    "consciousness_structure": ["A11", "A12", "A13"],
    "human_symbolic": ["A14", "A15", "A16", "A17", "A18", "A19", "A20", "A21", "A22"],
}


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
    if mode == "crossings_only":
        return ["SYNAPSES"]
    if mode == "cleanup_only":
        return ["A99"]
    if mode == "synthesis_only":
        return ["A00B"]
    if str(mode).startswith("specialist_batch:"):
        batch_id = str(mode).split(":", 1)[1]
        if batch_id not in SPECIALIST_BATCHES:
            raise ValueError("Unknown Gravity specialist batch.")
        return ["A23", *SPECIALIST_BATCHES[batch_id]]
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
        source_hashes.extend(payload.get("lineage", {}).get("inherited_output_hashes", []))
        source_hashes = list(dict.fromkeys(source_hashes))
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
        allowed_hashes.update(payload.get("lineage", {}).get("inherited_output_hashes", []))
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


def derive_minimal_specialist_run(source_run_id):
    source = get_dry_run(source_run_id)
    if not source:
        return None
    source_a23 = next(
        (item for item in source.get("tasks", []) if item.get("component_id") == "GRAVITY:A23"),
        None,
    )
    if (
        not source_a23
        or source_a23.get("state") != "completed"
        or source_a23.get("review", {}).get("state") != "approved"
        or not source_a23.get("output_hash")
    ):
        raise ValueError("Source run requires a human-approved A23 output.")

    derived = create_dry_run({
        "title": f"{source['title']} — especialistas mínimos",
        "evidence": source["input"]["content"],
        "mode": "minimal_specialists",
        "execution_mode": "dry_run",
        "evidence_kind": "synthetic",
    })
    with _LOCK:
        payload = get_dry_run(derived["id"])
        target_a23 = next(item for item in payload["tasks"] if item["component_id"] == "GRAVITY:A23")
        target_a23.update({
            "state": "completed",
            "input_hash": source_a23.get("input_hash"),
            "output_hash": source_a23["output_hash"],
            "output": deepcopy(source_a23["output"]),
            "review": deepcopy(source_a23["review"]),
            "inherited_from": {"run_id": source["id"], "task_id": source_a23["id"]},
        })
        payload["lineage"] = {
            "parent_run_id": source["id"],
            "inherited_component_ids": ["GRAVITY:A23"],
            "inherited_output_hashes": [source_a23["output_hash"]],
            "derivation_kind": "approved_output_reuse",
        }
        payload["state"] = "ready_for_next_stage"
        payload["updated_at"] = _now()
        payload["approval_gate"]["state"] = "a23_human_approval_inherited"
        parent_ids = [payload["events"][-1]["id"]] if payload["events"] else []
        _event(
            payload, GravityEventType.MESSAGE_CONTEXT_BUILT, "GRAVITY:A23", target_a23["id"],
            causal_parent_ids=parent_ids,
            source_hashes=[payload["input"]["sha256"], source_a23["output_hash"]],
            input_hash=target_a23.get("input_hash"),
            output_hash=source_a23["output_hash"],
            trajectory_kind="replayed",
            validity="inherited_human_approved",
            details={
                "parent_run_id": source["id"],
                "model_call_performed": False,
                "memory_promotion_allowed": False,
            },
        )
        _write_atomic(_run_path(payload["id"]), payload)
        return deepcopy(payload)


def derive_specialist_batch_run(source_run_id, batch_id):
    if batch_id not in SPECIALIST_BATCHES:
        raise ValueError("Unknown Gravity specialist batch.")
    source = get_dry_run(source_run_id)
    if not source:
        return None
    approved_tasks = [
        item for item in source.get("tasks", [])
        if item.get("state") == "completed"
        and item.get("review", {}).get("state") == "approved"
        and item.get("output_hash")
    ]
    source_a23 = next(
        (item for item in approved_tasks if item.get("component_id") == "GRAVITY:A23"), None
    )
    if not source_a23:
        raise ValueError("Source run requires a human-approved A23 output.")
    context_hashes = [item["output_hash"] for item in approved_tasks]
    derived = create_dry_run({
        "title": f"{source['title']} — lote {batch_id}",
        "evidence": source["input"]["content"],
        "mode": f"specialist_batch:{batch_id}",
        "execution_mode": "dry_run",
        "evidence_kind": "synthetic",
    })
    with _LOCK:
        payload = get_dry_run(derived["id"])
        target_a23 = next(item for item in payload["tasks"] if item["component_id"] == "GRAVITY:A23")
        target_a23.update({
            "state": "completed",
            "input_hash": source_a23.get("input_hash"),
            "output_hash": source_a23["output_hash"],
            "output": deepcopy(source_a23["output"]),
            "review": deepcopy(source_a23["review"]),
            "inherited_from": {"run_id": source["id"], "task_id": source_a23["id"]},
        })
        payload["batch"] = {
            "id": batch_id,
            "component_ids": [f"GRAVITY:{item}" for item in SPECIALIST_BATCHES[batch_id]],
            "manifest": None,
            "review": {"state": "not_ready", "reviewer": None, "reviewed_at": None, "note": ""},
        }
        payload["lineage"] = {
            "parent_run_id": source["id"],
            "inherited_component_ids": [item["component_id"] for item in approved_tasks],
            "inherited_output_hashes": context_hashes,
            "derivation_kind": "approved_batch_context_reuse",
        }
        payload["state"] = "ready_for_next_stage"
        payload["updated_at"] = _now()
        payload["approval_gate"]["state"] = "approved_context_inherited"
        _event(
            payload, GravityEventType.MESSAGE_CONTEXT_BUILT, "GRAVITY:BATCH", target_a23["id"],
            causal_parent_ids=[payload["events"][-1]["id"]],
            source_hashes=[payload["input"]["sha256"], *context_hashes],
            output_hash=source_a23["output_hash"],
            trajectory_kind="replayed",
            validity="inherited_human_approved",
            details={"batch_id": batch_id, "parent_run_id": source["id"], "model_call_performed": False},
        )
        _write_atomic(_run_path(payload["id"]), payload)
        return deepcopy(payload)


def build_specialist_batch_manifest(run_id):
    with _LOCK:
        payload = get_dry_run(run_id)
        if not payload:
            return None
        batch = payload.get("batch")
        if not batch:
            raise ValueError("Gravity run is not a specialist batch.")
        tasks = [
            next((item for item in payload["tasks"] if item["component_id"] == component_id), None)
            for component_id in batch["component_ids"]
        ]
        if any(not item or item.get("state") != "completed" or not item.get("output_hash") for item in tasks):
            raise ValueError("Every specialist batch task must be completed before manifest creation.")
        entries = [{
            "component_id": item["component_id"],
            "output_hash": item["output_hash"],
            "claim_count": len(item["output"]["claims"]),
            "claim_kinds": sorted({claim["truth_kind"] for claim in item["output"]["claims"]}),
            "open_contradictions": item["output"]["open_contradictions"],
        } for item in tasks]
        manifest = {
            "schema_version": "gravity-specialist-batch-manifest-v1",
            "batch_id": batch["id"],
            "run_id": payload["id"],
            "entries": entries,
            "total_claims": sum(item["claim_count"] for item in entries),
            "open_contradictions": sum(item["open_contradictions"] for item in entries),
            "created_at": _now(),
        }
        manifest["sha256"] = hashlib.sha256(
            json.dumps(manifest, ensure_ascii=False, sort_keys=True).encode("utf-8")
        ).hexdigest()
        payload["batch"]["manifest"] = manifest
        payload["batch"]["review"] = {"state": "pending", "reviewer": None, "reviewed_at": None, "note": ""}
        payload["state"] = "awaiting_batch_review"
        payload["updated_at"] = _now()
        _write_atomic(_run_path(payload["id"]), payload)
        return deepcopy(payload)


def review_specialist_batch(run_id, decision, reviewer, note=""):
    decision = str(decision).strip().casefold()
    reviewer = " ".join(str(reviewer or "").split())
    note = " ".join(str(note or "").split())
    if decision not in {"approved", "rejected"} or not reviewer:
        raise ValueError("Batch review requires approved/rejected and a human reviewer.")
    with _LOCK:
        payload = get_dry_run(run_id)
        if not payload:
            return None
        batch = payload.get("batch") or {}
        manifest = batch.get("manifest")
        if not manifest or batch.get("review", {}).get("state") != "pending":
            raise ValueError("Specialist batch manifest is not pending review.")
        reviewed_at = _now()
        for component_id in batch["component_ids"]:
            task = next(item for item in payload["tasks"] if item["component_id"] == component_id)
            task["review"] = {
                "state": decision, "reviewer": reviewer, "reviewed_at": reviewed_at,
                "note": note, "output_hash": task["output_hash"], "batch_manifest_hash": manifest["sha256"],
            }
        batch["review"] = {
            "state": decision, "reviewer": reviewer, "reviewed_at": reviewed_at,
            "note": note, "manifest_hash": manifest["sha256"],
        }
        payload["state"] = "approved" if decision == "approved" else "needs_revision"
        payload["updated_at"] = reviewed_at
        payload["approval_gate"]["state"] = "human_batch_review_recorded"
        _event(
            payload, GravityEventType.FEEDBACK_REQUESTED, "GRAVITY:BATCH", payload["tasks"][0]["id"],
            causal_parent_ids=[payload["events"][-1]["id"]],
            source_hashes=[manifest["sha256"]], output_hash=manifest["sha256"],
            trajectory_kind="observed", validity=f"human_{decision}",
            details={"decision": decision, "reviewer": reviewer, "batch_id": batch["id"], "memory_promotion_allowed": False},
        )
        _write_atomic(_run_path(payload["id"]), payload)
        return deepcopy(payload)


def derive_crossing_run(source_run_ids):
    source_run_ids = list(dict.fromkeys(source_run_ids or []))
    if len(source_run_ids) != 5:
        raise ValueError("Gravity crossing requires the approved minimal run and four approved batch runs.")
    sources = []
    approved_by_component = {}
    for run_id in source_run_ids:
        run = get_dry_run(run_id)
        if not run or run.get("state") != "approved":
            raise ValueError(f"Gravity source run is missing or not approved: {run_id}.")
        sources.append(run)
        for task in run.get("tasks", []):
            component_id = task.get("component_id")
            if (
                component_id and component_id.startswith("GRAVITY:A")
                and task.get("state") == "completed"
                and task.get("review", {}).get("state") == "approved"
                and task.get("output_hash")
            ):
                existing = approved_by_component.get(component_id)
                if existing and existing["output_hash"] != task["output_hash"]:
                    raise ValueError(f"Conflicting approved outputs for {component_id}.")
                approved_by_component[component_id] = task
    expected = {"GRAVITY:A23", *{f"GRAVITY:A{i:02d}" for i in range(1, 23)}}
    if set(approved_by_component) != expected:
        missing = sorted(expected - set(approved_by_component))
        extra = sorted(set(approved_by_component) - expected)
        raise ValueError(f"Crossing coverage mismatch. Missing={missing}; extra={extra}.")
    input_hashes = {run["input"]["sha256"] for run in sources}
    input_contents = {run["input"]["content"] for run in sources}
    if len(input_hashes) != 1 or len(input_contents) != 1:
        raise ValueError("All crossing source runs must share the exact same input.")
    derived = create_dry_run({
        "title": "Gravity — cruces sinápticos y espejos",
        "evidence": next(iter(input_contents)),
        "mode": "crossings_only",
        "execution_mode": "dry_run",
        "evidence_kind": "synthetic",
    })
    with _LOCK:
        payload = get_dry_run(derived["id"])
        ordered_components = ["GRAVITY:A23", *[f"GRAVITY:A{i:02d}" for i in range(1, 23)]]
        inherited_hashes = [approved_by_component[item]["output_hash"] for item in ordered_components]
        payload["lineage"] = {
            "parent_run_ids": source_run_ids,
            "inherited_component_ids": ordered_components,
            "inherited_output_hashes": inherited_hashes,
            "derivation_kind": "complete_approved_specialist_crossing",
        }
        payload["crossing"] = {
            "synaptic_units": 10,
            "mirror_units": 2,
            "coverage": "A01-A23_complete",
            "source_count": 23,
            "output_contract": ["coherences", "tensions", "duplicates", "gaps", "human_impact"],
        }
        payload["state"] = "ready_for_next_stage"
        payload["updated_at"] = _now()
        payload["approval_gate"]["state"] = "complete_specialist_approval_inherited"
        _event(
            payload, GravityEventType.MESSAGE_CONTEXT_BUILT, "GRAVITY:SYNAPSES", payload["tasks"][0]["id"],
            causal_parent_ids=[payload["events"][-1]["id"]],
            source_hashes=[payload["input"]["sha256"], *inherited_hashes],
            trajectory_kind="replayed", validity="complete_human_approved_context",
            details={"specialist_count": 23, "synaptic_units": 10, "mirror_units": 2, "model_call_performed": False},
        )
        _write_atomic(_run_path(payload["id"]), payload)
        return deepcopy(payload)


def derive_cleanup_run(crossing_run_id):
    source = get_dry_run(crossing_run_id)
    if not source:
        return None
    crossing_task = next(
        (item for item in source.get("tasks", []) if item.get("component_id") == "GRAVITY:SYNAPSES"),
        None,
    )
    if (
        source.get("state") != "approved"
        or not crossing_task
        or crossing_task.get("review", {}).get("state") != "approved"
        or not crossing_task.get("output_hash")
    ):
        raise ValueError("A99 requires a human-approved synaptic crossing.")
    derived = create_dry_run({
        "title": "Gravity — limpieza reversible A99",
        "evidence": source["input"]["content"],
        "mode": "cleanup_only",
        "execution_mode": "dry_run",
        "evidence_kind": "synthetic",
    })
    with _LOCK:
        payload = get_dry_run(derived["id"])
        inherited_hashes = [
            *source.get("lineage", {}).get("inherited_output_hashes", []),
            crossing_task["output_hash"],
        ]
        payload["lineage"] = {
            "parent_run_id": source["id"],
            "inherited_component_ids": [
                *source.get("lineage", {}).get("inherited_component_ids", []),
                "GRAVITY:SYNAPSES",
            ],
            "inherited_output_hashes": inherited_hashes,
            "derivation_kind": "approved_crossing_cleanup",
        }
        payload["cleanup_policy"] = {
            "mode": "reversible_view_only",
            "delete_originals": False,
            "rewrite_source_ledgers": False,
            "close_open_contradictions": False,
            "memory_promotion_allowed": False,
        }
        payload["state"] = "ready_for_next_stage"
        payload["updated_at"] = _now()
        payload["approval_gate"]["state"] = "approved_crossing_inherited"
        _event(
            payload, GravityEventType.MESSAGE_CONTEXT_BUILT, "GRAVITY:A99", payload["tasks"][0]["id"],
            causal_parent_ids=[payload["events"][-1]["id"]],
            source_hashes=[payload["input"]["sha256"], *inherited_hashes],
            output_hash=crossing_task["output_hash"], trajectory_kind="replayed",
            validity="approved_crossing_context",
            details={"cleanup_mode": "reversible_view_only", "delete_originals": False, "model_call_performed": False},
        )
        _write_atomic(_run_path(payload["id"]), payload)
        return deepcopy(payload)


def derive_synthesis_run(cleanup_run_id):
    source = get_dry_run(cleanup_run_id)
    if not source:
        return None
    cleanup_task = next(
        (item for item in source.get("tasks", []) if item.get("component_id") == "GRAVITY:A99"),
        None,
    )
    if (
        source.get("state") != "approved"
        or not cleanup_task
        or cleanup_task.get("review", {}).get("state") != "approved"
        or not cleanup_task.get("output_hash")
    ):
        raise ValueError("A00B requires a human-approved A99 cleanup.")
    derived = create_dry_run({
        "title": "Gravity — síntesis controlada A00B",
        "evidence": source["input"]["content"],
        "mode": "synthesis_only",
        "execution_mode": "dry_run",
        "evidence_kind": "synthetic",
    })
    with _LOCK:
        payload = get_dry_run(derived["id"])
        inherited_hashes = [
            *source.get("lineage", {}).get("inherited_output_hashes", []),
            cleanup_task["output_hash"],
        ]
        payload["lineage"] = {
            "parent_run_id": source["id"],
            "inherited_component_ids": [
                *source.get("lineage", {}).get("inherited_component_ids", []),
                "GRAVITY:A99",
            ],
            "inherited_output_hashes": inherited_hashes,
            "derivation_kind": "approved_cleanup_semantic_compression",
        }
        payload["synthesis_policy"] = {
            "mode": "compression_without_new_claims",
            "preserve_open_tensions": True,
            "may_overwrite_sources": False,
            "may_promote_memory": False,
            "requires_human_review": True,
        }
        payload["state"] = "ready_for_next_stage"
        payload["updated_at"] = _now()
        payload["approval_gate"]["state"] = "approved_cleanup_inherited"
        _event(
            payload, GravityEventType.MESSAGE_CONTEXT_BUILT, "GRAVITY:A00B", payload["tasks"][0]["id"],
            causal_parent_ids=[payload["events"][-1]["id"]],
            source_hashes=[payload["input"]["sha256"], *inherited_hashes],
            output_hash=cleanup_task["output_hash"], trajectory_kind="replayed",
            validity="approved_cleanup_context",
            details={"synthesis_mode": "compression_without_new_claims", "model_call_performed": False},
        )
        _write_atomic(_run_path(payload["id"]), payload)
        return deepcopy(payload)
