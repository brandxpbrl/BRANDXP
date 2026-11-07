from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any


def now_iso():
    return datetime.now(timezone.utc).isoformat()


class GravityEventType(str, Enum):
    INPUT_SUPPLIED = "input_supplied"
    AGENT_REQUESTED = "agent_requested"
    AGENT_OUTPUT_SAVED = "agent_output_saved"
    MESSAGE_CONTEXT_BUILT = "message_context_built"
    CONTRADICTION_FLAGGED = "contradiction_flagged"
    SYNTHESIS_SAVED = "synthesis_saved"
    FEEDBACK_REQUESTED = "feedback_requested"
    FAILED = "failed"
    SKIPPED = "skipped"


class GravityRunState(str, Enum):
    PENDING = "pending"
    REQUESTED = "requested"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"
    INVALID = "invalid"
    AWAITING_REVIEW = "awaiting_review"
    APPROVED = "approved"


@dataclass
class GravityTraceEvent:
    id: str
    run_id: str
    task_id: str
    component_id: str
    event_type: GravityEventType
    sequence: int
    origin: str
    trajectory_kind: str = "observed"
    validity: str = "not_evaluated"
    causal_parent_ids: list[str] = field(default_factory=list)
    source_hashes: list[str] = field(default_factory=list)
    input_hash: str | None = None
    output_hash: str | None = None
    missing_reason: str | None = None
    failure_reason: str | None = None
    occurred_at: str = field(default_factory=now_iso)
    details: dict[str, Any] = field(default_factory=dict)

    def __post_init__(self):
        if self.sequence < 0:
            raise ValueError("Gravity trace sequence must be non-negative.")
        if self.trajectory_kind not in {"observed", "replayed", "simulated", "counterfactual"}:
            raise ValueError("Invalid Gravity trajectory kind.")
        if self.event_type == GravityEventType.FAILED and not self.failure_reason:
            raise ValueError("Failed Gravity events require failure_reason.")
        if self.event_type == GravityEventType.SKIPPED and not self.missing_reason:
            raise ValueError("Skipped Gravity events require missing_reason.")

    def to_dict(self):
        return asdict(self)
