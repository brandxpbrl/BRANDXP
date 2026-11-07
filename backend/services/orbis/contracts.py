from dataclasses import asdict, dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any


def now_iso():
    return datetime.now().astimezone().isoformat(timespec="seconds")


class Contract:
    def to_dict(self):
        return asdict(self)


class RecordState(str, Enum):
    DRAFT = "draft"
    READY = "ready"
    ACTIVE = "active"
    PENDING_APPROVAL = "pending_approval"
    COMPLETED = "completed"
    BLOCKED = "blocked"
    CANCELLED = "cancelled"


class ApprovalState(str, Enum):
    NOT_REQUIRED = "not_required"
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class TruthKind(str, Enum):
    FACT = "fact"
    INFERENCE = "inference"
    PROPOSAL = "proposal"
    SIMULATION = "simulation"
    DECISION = "decision"
    RESULT = "result"


@dataclass
class Evidence(Contract):
    id: str
    claim: str
    source: str
    observed_at: str
    truth_kind: TruthKind = TruthKind.FACT
    confidence: float = 1.0
    uri: str | None = None
    owner: str | None = None
    period: str | None = None
    method: str | None = None
    sensitive: bool = False

    def __post_init__(self):
        if not 0 <= self.confidence <= 1:
            raise ValueError("Evidence confidence must be between 0 and 1.")


@dataclass
class Metric(Contract):
    id: str
    name: str
    value: float | int | str
    unit: str
    period: str
    source_evidence_ids: list[str]
    comparison_value: float | int | None = None
    method: str | None = None


@dataclass
class Tool(Contract):
    id: str
    name: str
    category: str
    source_of_truth: str
    owner_agent_id: str
    read_agent_ids: list[str] = field(default_factory=list)
    write_agent_ids: list[str] = field(default_factory=list)
    requires_approval: bool = True
    version: str | None = None
    schema: dict[str, Any] = field(default_factory=dict)


@dataclass
class Agent(Contract):
    id: str
    name: str
    role: str
    department: str
    activation_state: str
    authority: str
    tool_ids: list[str] = field(default_factory=list)
    avatar: str | None = None
    video: str | None = None


@dataclass
class Goal(Contract):
    id: str
    title: str
    owner_agent_id: str
    success_criteria: list[str]
    created_by: str
    state: RecordState = RecordState.DRAFT
    created_at: str = field(default_factory=now_iso)
    description: str = ""


@dataclass
class Project(Contract):
    id: str
    goal_id: str
    name: str
    owner_agent_id: str
    state: RecordState = RecordState.DRAFT
    start_at: str | None = None
    due_at: str | None = None


@dataclass
class Plan(Contract):
    id: str
    goal_id: str
    project_id: str
    owner_agent_id: str
    task_ids: list[str]
    assumptions: list[str] = field(default_factory=list)
    alternative_ids: list[str] = field(default_factory=list)
    state: RecordState = RecordState.DRAFT


@dataclass
class Task(Contract):
    id: str
    project_id: str
    title: str
    assignee_agent_id: str
    tool_ids: list[str] = field(default_factory=list)
    depends_on: list[str] = field(default_factory=list)
    state: RecordState = RecordState.DRAFT
    approval_required: bool = False


@dataclass
class Delegation(Contract):
    id: str
    task_id: str
    from_agent_id: str
    to_agent_id: str
    scope: str
    authority_granted: str
    created_at: str = field(default_factory=now_iso)


@dataclass
class Deliverable(Contract):
    id: str
    task_id: str
    producer_agent_id: str
    kind: str
    uri: str
    evidence_ids: list[str] = field(default_factory=list)
    state: RecordState = RecordState.DRAFT


@dataclass
class Approval(Contract):
    id: str
    subject_type: str
    subject_id: str
    requested_by_agent_id: str
    required_approver: str
    state: ApprovalState = ApprovalState.PENDING
    reason: str = ""
    decided_at: str | None = None


@dataclass
class MemoryRecord(Contract):
    id: str
    subject_type: str
    subject_id: str
    truth_kind: TruthKind
    content: str
    evidence_ids: list[str]
    recorded_at: str = field(default_factory=now_iso)
    supersedes_id: str | None = None


@dataclass
class Result(Contract):
    id: str
    goal_id: str
    project_id: str
    status: str
    metric_ids: list[str]
    evidence_ids: list[str]
    summary: str
    learned: list[str] = field(default_factory=list)
    recorded_at: str = field(default_factory=now_iso)
