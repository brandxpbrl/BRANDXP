import csv
import json
import os
from datetime import datetime, timezone
from pathlib import Path

MAX_EVENTS = 100
MAX_ARTIFACTS = 100
MAX_SERVICES = 100

SAFE_KERNEL_KEYS = {
    "status",
    "state",
    "health",
    "mode",
    "tick",
    "uptime",
    "uptime_seconds",
    "started_at",
    "updated_at",
    "timestamp",
    "time",
    "ts",
    "version",
    "node_id",
    "service",
    "service_name",
}


def _read_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None


def _read_jsonl(path: Path, limit: int):
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError:
        return []

    rows = []
    for raw in lines[-limit:]:
        raw = raw.strip()
        if not raw:
            continue
        try:
            value = json.loads(raw)
        except json.JSONDecodeError:
            continue
        if isinstance(value, dict):
            rows.append(value)
    return rows


def _read_csv(path: Path, limit: int):
    try:
        with path.open("r", encoding="utf-8", newline="") as handle:
            return list(csv.DictReader(handle))[-limit:]
    except OSError:
        return []


def _configured_path(env_name: str):
    raw = os.getenv(env_name, "").strip()
    if not raw:
        return None
    return Path(raw).expanduser()


def _text(record, keys, fallback=None):
    if not isinstance(record, dict):
        return fallback
    for key in keys:
        value = record.get(key)
        if value is None:
            continue
        text = str(value).strip()
        if text:
            return text
    return fallback


def _sanitize_kernel_status(record):
    if not isinstance(record, dict):
        return {}
    # Kernel status is an allow-list projection, not a filtered copy. This keeps
    # filesystem paths, database locations, logs, environment/config payloads,
    # and arbitrary nested dictionaries out of the public runtime snapshot.
    sanitized = {}
    for key in SAFE_KERNEL_KEYS:
        value = record.get(key)
        if value is None or isinstance(value, (dict, list, tuple, set)):
            continue
        if isinstance(value, (str, int, float, bool)):
            sanitized[key] = value
    return sanitized


def _normalize_event(record, index):
    return {
        "id": _text(record, ["id", "event_id", "lineage_id"], f"runtime-event-{index}"),
        "timestamp": _text(record, ["timestamp", "time", "created_at", "ts"]),
        "event_type": _text(record, ["event_type", "type", "kind", "label"], "UNKNOWN_EVENT"),
        "source": _text(record, ["source_organ", "source_service", "source", "node_id", "producer"], "runtime"),
        "subject": _text(record, ["subject_id", "subject", "entity_id", "artifact_id"]),
    }


def _normalize_service(record):
    if not isinstance(record, dict):
        return None
    return {
        "name": _text(record, ["name", "service", "service_name", "node_id", "id"], "unknown"),
        "status": _text(record, ["status", "state", "health"], "unknown"),
        "updated_at": _text(record, ["updated_at", "timestamp", "time", "ts"]),
    }


def _normalize_artifact(record, index):
    if not isinstance(record, dict):
        return None
    return {
        "artifact_id": _text(record, ["artifact_id", "id", "lineage_id"], f"runtime-artifact-{index}"),
        "artifact_name": _text(record, ["artifact_name", "name", "filename"], f"artifact-{index}"),
        "artifact_type": _text(record, ["type", "artifact_type", "format"], "UNKNOWN_ARTIFACT"),
        "producer": _text(record, ["producer", "linked_service", "source_service", "service"]),
        "source_ref": _text(record, ["source_event_ref", "source_ref", "event_id", "derived_from", "lineage_ref"]),
    }


def _artifact_records(path: Path):
    if not path.exists():
        return []
    if path.is_file():
        if path.suffix.lower() == ".jsonl":
            return _read_jsonl(path, MAX_ARTIFACTS)
        data = _read_json(path)
        if isinstance(data, list):
            return [row for row in data if isinstance(row, dict)][-MAX_ARTIFACTS:]
        if isinstance(data, dict):
            for key in ("artifacts", "outputs", "recent_artifacts"):
                value = data.get(key)
                if isinstance(value, list):
                    return [row for row in value if isinstance(row, dict)][-MAX_ARTIFACTS:]
            return [data]
        return []

    rows = []
    for candidate in sorted(path.glob("*.json"), key=lambda item: item.stat().st_mtime)[-MAX_ARTIFACTS:]:
        data = _read_json(candidate)
        if isinstance(data, dict):
            rows.append(data)
    return rows


def build_runtime_snapshot():
    kernel_status_path = _configured_path("MPE_KERNEL_STATUS_PATH")
    service_health_path = _configured_path("MPE_SERVICE_HEALTH_PATH")
    kernel_events_path = _configured_path("MPE_KERNEL_EVENTS_PATH")
    earth_memory_path = _configured_path("MPE_EARTH_MEMORY_PATH")
    artifacts_path = _configured_path("MPE_ARTIFACT_INDEX_PATH")

    configured = {
        "kernel_status": bool(kernel_status_path),
        "service_health": bool(service_health_path),
        "kernel_events": bool(kernel_events_path),
        "earth_memory": bool(earth_memory_path),
        "artifact_index": bool(artifacts_path),
    }

    kernel_status = _read_json(kernel_status_path) if kernel_status_path and kernel_status_path.is_file() else None
    kernel_status = _sanitize_kernel_status(kernel_status)

    services = []
    if service_health_path and service_health_path.is_file():
        if service_health_path.suffix.lower() == ".csv":
            raw_services = _read_csv(service_health_path, MAX_SERVICES)
        else:
            data = _read_json(service_health_path)
            if isinstance(data, list):
                raw_services = data
            elif isinstance(data, dict):
                raw_services = data.get("services") or data.get("service_health") or []
            else:
                raw_services = []
        services = [item for item in (_normalize_service(row) for row in raw_services) if item]

    events = []
    if kernel_events_path and kernel_events_path.is_file():
        events.extend(_read_jsonl(kernel_events_path, MAX_EVENTS))
    if earth_memory_path and earth_memory_path.is_file():
        events.extend(_read_jsonl(earth_memory_path, MAX_EVENTS))
    events = [_normalize_event(row, index) for index, row in enumerate(events[-MAX_EVENTS:])]

    raw_artifacts = _artifact_records(artifacts_path) if artifacts_path else []
    artifacts = [item for index, row in enumerate(raw_artifacts) if (item := _normalize_artifact(row, index))]

    return {
        "mode": "LIVE" if any(configured.values()) else "DISCONNECTED",
        "observed_at": datetime.now(timezone.utc).isoformat(),
        "configured_sources": configured,
        "kernel": kernel_status,
        "services": services,
        "events": events,
        "artifacts": artifacts,
        "provenance": {
            "policy": "read_only_real_sources_only",
            "synthetic_activity": False,
            "raw_local_paths_exposed": False,
        },
    }
