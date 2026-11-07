import json
from copy import deepcopy
from datetime import datetime
from pathlib import Path
from threading import RLock
from uuid import uuid4

from services.orbis_agent_registry import get_orbis_agent


PROJECT_ROOT = Path(__file__).resolve().parents[3]
RUNTIME_ROOT = PROJECT_ROOT / "runtime" / "orbis"
OBJECTIVES_ROOT = RUNTIME_ROOT / "objectives"
_LOCK = RLock()

ALLOWED_TASK_TRANSITIONS = {
    "draft": {"ready", "active", "cancelled"},
    "ready": {"active", "blocked", "cancelled"},
    "active": {"completed", "blocked", "pending_approval", "cancelled"},
    "blocked": {"ready", "cancelled"},
    "pending_approval": {"completed", "rejected", "cancelled"},
    "completed": set(),
    "rejected": {"ready", "cancelled"},
    "cancelled": set(),
}


def _now():
    return datetime.now().astimezone().isoformat(timespec="seconds")


def _id(prefix):
    return f"{prefix}-{uuid4().hex[:12]}"


def _clean(value):
    return " ".join(str(value or "").split()).strip()


def _objective_path(objective_id):
    safe_id = _clean(objective_id)
    if not safe_id or safe_id != Path(safe_id).name or not safe_id.startswith("goal-"):
        raise ValueError("Invalid objective id.")
    return OBJECTIVES_ROOT / f"{safe_id}.json"


def _write_atomic(path, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    temporary.replace(path)


def _event(event_type, actor, details=None):
    return {
        "id": _id("event"),
        "type": event_type,
        "actor": actor,
        "occurred_at": _now(),
        "details": details or {},
    }


def _active_agent(agent_id):
    agent = get_orbis_agent(agent_id)
    if not agent:
        raise ValueError(f"ORBIS agent '{agent_id}' not found.")
    if agent.get("activation_state") != "identity_validated":
        raise ValueError(f"ORBIS agent '{agent_id}' is not validated for runtime work.")
    return agent


def _task(spec, project_id, previous_task_id=None):
    assignee = _active_agent(spec["assignee_agent_id"])
    dependencies = list(spec.get("depends_on") or [])
    if previous_task_id and spec.get("sequential", True) and not dependencies:
        dependencies = [previous_task_id]
    return {
        "id": _id("task"),
        "project_id": project_id,
        "title": _clean(spec.get("title")),
        "description": _clean(spec.get("description")),
        "assignee_agent_id": assignee["id"],
        "tool_ids": list(spec.get("tool_ids") or assignee.get("tools") or []),
        "depends_on": dependencies,
        "state": "draft" if dependencies else "ready",
        "approval_required": bool(spec.get("approval_required", False)),
        "deliverable_ids": [],
        "evidence_ids": [],
    }


def _default_tasks():
    return [
        {
            "title": "Definir dirección y criterios de éxito",
            "assignee_agent_id": "nicolas",
            "tool_ids": ["executive_dashboards", "consolidated_reports"],
        },
        {
            "title": "Evaluar viabilidad, métricas y riesgo",
            "assignee_agent_id": "axiom",
            "tool_ids": ["spreadsheets", "costs", "margins", "cash"],
        },
        {
            "title": "Preparar estrategia y comunicación",
            "assignee_agent_id": "nova",
            "tool_ids": ["campaign_calendars", "content_scripts"],
        },
        {
            "title": "Organizar ejecución, responsables y seguimiento",
            "assignee_agent_id": "lyra",
            "tool_ids": ["operations", "tasks"],
            "approval_required": True,
        },
    ]


def create_objective(payload):
    title = _clean(payload.get("title"))
    description = _clean(payload.get("description"))
    created_by = _clean(payload.get("created_by")) or "Felipe Vallejo"
    if not title:
        raise ValueError("Objective title is required.")

    owner = _active_agent(payload.get("owner_agent_id") or "nicolas")
    goal_id = _id("goal")
    project_id = _id("project")
    plan_id = _id("plan")
    task_specs = payload.get("tasks") or _default_tasks()
    tasks = []
    previous_task_id = None
    for spec in task_specs:
        task = _task(spec, project_id, previous_task_id)
        tasks.append(task)
        previous_task_id = task["id"]

    approval_id = _id("approval")
    created_at = _now()
    bundle = {
        "schema_version": "1.0.0",
        "goal": {
            "id": goal_id,
            "title": title,
            "description": description,
            "owner_agent_id": owner["id"],
            "success_criteria": list(payload.get("success_criteria") or []),
            "created_by": created_by,
            "state": "active",
            "created_at": created_at,
        },
        "project": {
            "id": project_id,
            "goal_id": goal_id,
            "name": _clean(payload.get("project_name")) or title,
            "owner_agent_id": owner["id"],
            "state": "active",
            "start_at": created_at,
            "due_at": payload.get("due_at"),
        },
        "plan": {
            "id": plan_id,
            "goal_id": goal_id,
            "project_id": project_id,
            "owner_agent_id": owner["id"],
            "task_ids": [task["id"] for task in tasks],
            "assumptions": list(payload.get("assumptions") or []),
            "alternative_ids": [],
            "state": "active",
        },
        "tasks": tasks,
        "delegations": [
            {
                "id": _id("delegation"),
                "task_id": task["id"],
                "from_agent_id": owner["id"],
                "to_agent_id": task["assignee_agent_id"],
                "scope": task["title"],
                "authority_granted": "prepare_and_recommend",
                "created_at": created_at,
            }
            for task in tasks
            if task["assignee_agent_id"] != owner["id"]
        ],
        "approvals": [
            {
                "id": approval_id,
                "subject_type": "project_execution",
                "subject_id": project_id,
                "requested_by_agent_id": owner["id"],
                "required_approver": _clean(payload.get("required_approver")) or "Felipe Vallejo",
                "state": "pending",
                "reason": "Required before external or sensitive execution.",
                "decided_at": None,
                "decided_by": None,
                "note": "",
            }
        ],
        "evidence": [],
        "deliverables": [],
        "memory": [],
        "results": [],
        "events": [
            _event("objective_created", created_by, {"goal_id": goal_id}),
            _event("plan_created", owner["id"], {"plan_id": plan_id, "task_count": len(tasks)}),
        ],
        "execution_gate": {
            "state": "locked",
            "approval_id": approval_id,
            "external_actions_allowed": False,
        },
        "updated_at": created_at,
    }
    with _LOCK:
        _write_atomic(_objective_path(goal_id), bundle)
    return deepcopy(bundle)


def get_objective(objective_id):
    path = _objective_path(objective_id)
    if not path.is_file():
        return None
    with _LOCK:
        return json.loads(path.read_text(encoding="utf-8"))


def list_objectives():
    if not OBJECTIVES_ROOT.is_dir():
        return []
    objectives = []
    for path in sorted(OBJECTIVES_ROOT.glob("goal-*.json"), reverse=True):
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            continue
        objectives.append(
            {
                "goal": payload["goal"],
                "project": payload["project"],
                "task_summary": {
                    state: sum(task["state"] == state for task in payload.get("tasks", []))
                    for state in {task["state"] for task in payload.get("tasks", [])}
                },
                "execution_gate": payload["execution_gate"],
                "updated_at": payload["updated_at"],
            }
        )
    return objectives


def transition_task(objective_id, task_id, target_state, actor, note=""):
    target_state = _clean(target_state).casefold()
    with _LOCK:
        payload = get_objective(objective_id)
        if not payload:
            return None
        task = next((item for item in payload["tasks"] if item["id"] == task_id), None)
        if not task:
            raise ValueError("Task not found.")
        current = task["state"]
        if target_state not in ALLOWED_TASK_TRANSITIONS.get(current, set()):
            raise ValueError(f"Invalid task transition: {current} -> {target_state}.")
        if target_state == "active":
            incomplete = [
                dependency for dependency in task["depends_on"]
                if next((item for item in payload["tasks"] if item["id"] == dependency), {}).get("state") != "completed"
            ]
            if incomplete:
                raise ValueError("Task dependencies are not completed.")
        if target_state == "completed" and task["approval_required"] and payload["execution_gate"]["state"] != "approved":
            raise ValueError("Human approval is required before completing this task.")
        task["state"] = target_state
        payload["updated_at"] = _now()
        payload["events"].append(
            _event("task_transitioned", actor, {"task_id": task_id, "from": current, "to": target_state, "note": note})
        )
        _write_atomic(_objective_path(objective_id), payload)
        return deepcopy(payload)


def decide_approval(objective_id, approval_id, decision, approver, note=""):
    decision = _clean(decision).casefold()
    if decision not in {"approved", "rejected"}:
        raise ValueError("Approval decision must be approved or rejected.")
    with _LOCK:
        payload = get_objective(objective_id)
        if not payload:
            return None
        approval = next((item for item in payload["approvals"] if item["id"] == approval_id), None)
        if not approval:
            raise ValueError("Approval not found.")
        if approval["state"] != "pending":
            raise ValueError("Approval was already decided.")
        if _clean(approver).casefold() != approval["required_approver"].casefold():
            raise ValueError("Approver is not authorized for this decision.")
        approval.update({
            "state": decision,
            "decided_at": _now(),
            "decided_by": _clean(approver),
            "note": _clean(note),
        })
        payload["execution_gate"] = {
            **payload["execution_gate"],
            "state": decision,
            "external_actions_allowed": decision == "approved",
        }
        payload["updated_at"] = _now()
        payload["events"].append(
            _event("approval_decided", approver, {"approval_id": approval_id, "decision": decision, "note": note})
        )
        _write_atomic(_objective_path(objective_id), payload)
        return deepcopy(payload)
