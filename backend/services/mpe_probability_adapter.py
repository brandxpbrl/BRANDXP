"""Read-only bridge for the isolated MPE probability research lab."""

import json
import os
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen


SOURCE = "mpe_probability_statistics"
NAMESPACE = "mpe.market_research"


def _timestamp() -> str:
    return datetime.now(timezone.utc).isoformat()


def _unavailable(reason: str) -> dict:
    return {
        "source": SOURCE,
        "provenance": "paper research / historical analysis",
        "timestamp": _timestamp(),
        "metric_namespace": NAMESPACE,
        "status": "UNKNOWN",
        "validation": "UNVALIDATED",
        "lineage": [SOURCE, "read_only_adapter"],
        "availability": "UNAVAILABLE",
        "evidence": {},
        "message": reason,
    }


def _first_value(payload: object, keys: set[str]):
    if isinstance(payload, dict):
        for key, value in payload.items():
            if str(key).lower() in keys and isinstance(value, (int, float)):
                return value
        for value in payload.values():
            found = _first_value(value, keys)
            if found is not None:
                return found
    elif isinstance(payload, list):
        for value in payload:
            found = _first_value(value, keys)
            if found is not None:
                return found
    return None


def _normalize(payload: object) -> dict:
    evidence = {
        "sai": _first_value(payload, {"sai"}),
        "nii": _first_value(payload, {"nii"}),
        "ftr": _first_value(payload, {"ftr"}),
        "re_mpe": _first_value(payload, {"re_mpe"}),
        "lfr": _first_value(payload, {"lfr"}),
        "open_paths": _first_value(payload, {"open_paths", "openness_score"}),
    }
    evidence = {key: value for key, value in evidence.items() if value is not None}
    return {
        "source": SOURCE,
        "provenance": "paper research / historical analysis",
        "timestamp": _timestamp(),
        "metric_namespace": NAMESPACE,
        "status": "PROPOSED",
        "validation": "UNVALIDATED",
        "lineage": [SOURCE, "read_only_adapter", "external_state_endpoint"],
        "availability": "AVAILABLE" if evidence else "NO_EVIDENCE",
        "evidence": evidence,
        "message": "Research context only. It is not a booking, market or user prediction.",
    }


def load_market_research_state() -> dict:
    """Return research context without importing or executing the lab."""
    endpoint = os.getenv("MPE_MARKET_RESEARCH_STATE_URL", "").strip()
    state_file = os.getenv("MPE_MARKET_RESEARCH_STATE_FILE", "").strip()

    if state_file:
        try:
            path = Path(state_file).expanduser().resolve()
            if not path.is_file():
                return _unavailable("MPE_MARKET_RESEARCH_STATE_FILE does not exist.")
            if path.stat().st_size > 256 * 1024:
                return _unavailable("MPE_MARKET_RESEARCH_STATE_FILE is too large.")
            return _normalize(json.loads(path.read_text(encoding="utf-8")))
        except (OSError, ValueError, json.JSONDecodeError):
            return _unavailable("Research state file could not be read.")

    if not endpoint:
        return _unavailable("MPE_MARKET_RESEARCH_STATE_URL is not configured.")

    parsed = urlparse(endpoint)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        return _unavailable("MPE_MARKET_RESEARCH_STATE_URL must be an HTTP(S) URL.")

    try:
        request = Request(endpoint, headers={"Accept": "application/json"}, method="GET")
        with urlopen(request, timeout=2.5) as response:
            raw = response.read(256 * 1024)
        return _normalize(json.loads(raw.decode("utf-8")))
    except (OSError, URLError, TimeoutError, ValueError, json.JSONDecodeError) as error:
        return _unavailable(f"Research state unavailable: {error.__class__.__name__}.")
