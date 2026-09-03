export type EpistemicStatus =
  | "generated_candidate"
  | "structural_candidate"
  | "experiment_candidate"
  | "observed"
  | "repeated"
  | "validated_in_context"
  | "heritage_candidate"
  | "rejected";

export type EvidenceKind =
  | "user_state"
  | "memory"
  | "external_data"
  | "derived"
  | "generative_model"
  | "experiment";

export type PossibilitySource = {
  kind: EvidenceKind;
  ref: string;
  note?: string;
};

export type StateFact = {
  id: string;
  label: string;
  value: string | number | boolean;
  confidence: "declared" | "observed" | "derived" | "unknown";
  source?: PossibilitySource;
};

export type MpeState = {
  id: string;
  objective: string;
  resources: StateFact[];
  constraints: StateFact[];
  pressures: StateFact[];
  opportunities: StateFact[];
  unknowns: StateFact[];
  createdAt: string;
};

export type PossibilityOperator =
  | "combine"
  | "acquire"
  | "remove_constraint"
  | "reuse"
  | "connect"
  | "cooperate"
  | "divide"
  | "scale"
  | "delay"
  | "abandon"
  | "experiment"
  | "mutate";

export type ViabilityDimension = {
  id:
    | "resource_fit"
    | "constraint_fit"
    | "dependency_load"
    | "uncertainty"
    | "reversibility"
    | "evidence_support"
    | "future_optionality";
  status: "low" | "medium" | "high" | "unknown";
  rationale: string;
  sourceRefs: string[];
};

export type Perturbation = {
  id: string;
  label: string;
  changes: Array<{
    factId: string;
    operation: "set" | "increase" | "decrease" | "remove";
    value?: string | number | boolean;
  }>;
};

export type PerturbationResult = {
  perturbationId: string;
  viability: "survives" | "degrades" | "fails" | "unknown";
  reason: string;
};

export type ExperimentProposal = {
  id: string;
  question: string;
  action: string;
  successSignal: string;
  failureSignal: string;
  costClass: "low" | "medium" | "high" | "unknown";
  reversible: boolean;
  status: "proposed" | "running" | "completed" | "rejected";
};

export type Possibility = {
  id: string;
  title: string;
  description: string;
  parentStateId: string;
  parentPossibilityIds: string[];
  operators: PossibilityOperator[];
  sources: PossibilitySource[];
  assumptions: string[];
  dependencies: string[];
  viability: ViabilityDimension[];
  perturbationResults: PerturbationResult[];
  experiment?: ExperimentProposal;
  epistemicStatus: EpistemicStatus;
  openedFutureIds: string[];
  closedReason?: string;
};

export type PossibilityFamily = {
  id: string;
  label: string;
  possibilityIds: string[];
  sharedPattern: string;
};

export type PossibilityLedgerEvent = {
  id: string;
  timestamp: string;
  type:
    | "state_created"
    | "possibility_generated"
    | "possibility_filtered"
    | "perturbation_applied"
    | "experiment_proposed"
    | "experiment_completed"
    | "epistemic_updated"
    | "heritage_promoted";
  entityId: string;
  note: string;
  sourceRefs: string[];
};

export type PossibilitySession = {
  id: string;
  state: MpeState;
  possibilities: Possibility[];
  families: PossibilityFamily[];
  perturbations: Perturbation[];
  ledger: PossibilityLedgerEvent[];
  law: {
    exhaustiveClaimAllowed: false;
    probabilityClaimsRequireCalibration: true;
    generatedIsNotEvidence: true;
  };
};

export const POSSIBILITY_ENGINE_LAW: PossibilitySession["law"] = {
  exhaustiveClaimAllowed: false,
  probabilityClaimsRequireCalibration: true,
  generatedIsNotEvidence: true,
};
