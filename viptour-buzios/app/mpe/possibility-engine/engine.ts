import {
  MpeState,
  Perturbation,
  PerturbationResult,
  Possibility,
  PossibilityOperator,
  StateFact,
  ViabilityDimension,
} from "./model";

const slug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 42) || "state";

const sourceRefs = (facts: StateFact[]) =>
  facts.flatMap((fact) => (fact.source?.ref ? [fact.source.ref] : []));

export function createState(input: {
  objective: string;
  resources?: string[];
  constraints?: string[];
  pressures?: string[];
  opportunities?: string[];
  unknowns?: string[];
}): MpeState {
  const makeFacts = (kind: string, values: string[] = []): StateFact[] =>
    values
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value, index) => ({
        id: `${kind}-${index + 1}-${slug(value)}`,
        label: value,
        value,
        confidence: "declared" as const,
        source: { kind: "user_state" as const, ref: "current-session" },
      }));

  const objective = input.objective.trim();
  const stateKey = slug(
    [objective, ...(input.resources ?? []), ...(input.constraints ?? [])].join("|")
  );

  return {
    id: `state-${stateKey}`,
    objective,
    resources: makeFacts("resource", input.resources),
    constraints: makeFacts("constraint", input.constraints),
    pressures: makeFacts("pressure", input.pressures),
    opportunities: makeFacts("opportunity", input.opportunities),
    unknowns: makeFacts("unknown", input.unknowns),
    createdAt: new Date().toISOString(),
  };
}

function viabilityFor(state: MpeState, operator: PossibilityOperator): ViabilityDimension[] {
  const hasResources = state.resources.length > 0;
  const hasConstraints = state.constraints.length > 0;
  const hasUnknowns = state.unknowns.length > 0;
  const hasEvidence = [...state.resources, ...state.constraints, ...state.opportunities].some(
    (fact) => fact.confidence === "observed" || fact.source?.kind === "external_data" || fact.source?.kind === "experiment"
  );

  return [
    {
      id: "resource_fit",
      status: hasResources ? "medium" : "unknown",
      rationale: hasResources
        ? "Hay recursos declarados, pero todavía no se midió su suficiencia para esta posibilidad."
        : "No hay recursos explícitos suficientes para evaluar compatibilidad.",
      sourceRefs: sourceRefs(state.resources),
    },
    {
      id: "constraint_fit",
      status: hasConstraints ? "medium" : "unknown",
      rationale: hasConstraints
        ? "Las restricciones están declaradas; falta probar si la transformación puede convivir con ellas."
        : "No hay restricciones explícitas para someter esta posibilidad a prueba.",
      sourceRefs: sourceRefs(state.constraints),
    },
    {
      id: "dependency_load",
      status: operator === "cooperate" || operator === "acquire" || operator === "scale" ? "high" : "medium",
      rationale: "Clasificación estructural inicial; no representa una probabilidad de éxito.",
      sourceRefs: [],
    },
    {
      id: "uncertainty",
      status: hasUnknowns ? "high" : "medium",
      rationale: hasUnknowns
        ? "El estado contiene desconocidos explícitos que deben reducirse antes de elevar el estatus epistemológico."
        : "La ausencia de desconocidos declarados no implica ausencia real de incertidumbre.",
      sourceRefs: sourceRefs(state.unknowns),
    },
    {
      id: "reversibility",
      status: operator === "experiment" || operator === "delay" || operator === "combine" ? "high" : "medium",
      rationale: "Estimación cualitativa del tipo de operador, pendiente de un experimento contextual.",
      sourceRefs: [],
    },
    {
      id: "evidence_support",
      status: hasEvidence ? "medium" : "low",
      rationale: hasEvidence
        ? "Hay al menos una fuente observada/externa/experimental en el estado, todavía sin atribución causal a esta posibilidad."
        : "La posibilidad parte principalmente de información declarada o derivada, no de validación experimental.",
      sourceRefs: sourceRefs([...state.resources, ...state.constraints, ...state.opportunities]),
    },
    {
      id: "future_optionality",
      status: "unknown",
      rationale: "Los futuros abiertos se medirán en el grafo después de generar descendientes y aplicar perturbaciones.",
      sourceRefs: [],
    },
  ];
}

const OPERATOR_LABELS: Record<PossibilityOperator, string> = {
  combine: "Combinar recursos existentes",
  acquire: "Adquirir una capacidad o recurso faltante",
  remove_constraint: "Reducir una restricción dominante",
  reuse: "Reutilizar una capacidad en otro contexto",
  connect: "Crear una nueva conexión entre recursos",
  cooperate: "Cooperar con otro actor",
  divide: "Dividir el problema en una unidad menor",
  scale: "Escalar una estructura que ya funciona",
  delay: "Postergar compromiso y recolectar evidencia",
  abandon: "Cerrar una vía que consume posibilidades",
  experiment: "Probar la incertidumbre con un experimento mínimo",
  mutate: "Mutar una posibilidad existente",
};

export function generateStructuralCandidates(state: MpeState): Possibility[] {
  const operators: PossibilityOperator[] = [
    "combine",
    "reuse",
    "connect",
    "remove_constraint",
    "cooperate",
    "divide",
    "delay",
    "experiment",
  ];

  return operators.map((operator, index) => {
    const id = `p-${String(index + 1).padStart(3, "0")}-${operator}-${slug(state.id)}`;
    const evidenceRefs = sourceRefs([
      ...state.resources,
      ...state.constraints,
      ...state.pressures,
      ...state.opportunities,
      ...state.unknowns,
    ]);

    return {
      id,
      title: OPERATOR_LABELS[operator],
      description: `${OPERATOR_LABELS[operator]} para avanzar hacia: ${state.objective || "objetivo no definido"}.`,
      parentStateId: state.id,
      parentPossibilityIds: [],
      operators: [operator],
      sources: [{ kind: "derived", ref: `operator:${operator}`, note: "Candidato derivado estructuralmente del estado declarado." }],
      assumptions: ["Este candidato todavía no incorpora conocimiento externo ni una evaluación causal."],
      dependencies: [],
      viability: viabilityFor(state, operator),
      perturbationResults: [],
      experiment:
        operator === "experiment"
          ? {
              id: `exp-${slug(state.id)}`,
              question: "¿Cuál es el desconocido de mayor impacto que puede probarse con el menor compromiso?",
              action: "Definir una prueba mínima, reversible y con señal observable antes de comprometer más recursos.",
              successSignal: "La prueba produce evidencia que reduce una incertidumbre explícita.",
              failureSignal: "La prueba no produce señal útil o invalida el supuesto principal.",
              costClass: "low",
              reversible: true,
              status: "proposed",
            }
          : undefined,
      epistemicStatus: "generated_candidate",
      openedFutureIds: [],
    } satisfies Possibility;
  });
}

export function applyPerturbation(
  possibility: Possibility,
  perturbation: Perturbation,
  evaluator?: (possibility: Possibility, perturbation: Perturbation) => PerturbationResult
): Possibility {
  const result = evaluator
    ? evaluator(possibility, perturbation)
    : {
        perturbationId: perturbation.id,
        viability: "unknown" as const,
        reason: "La perturbación fue registrada pero todavía no existe un evaluador contextual que permita afirmar supervivencia o fallo.",
      };

  return {
    ...possibility,
    perturbationResults: [
      ...possibility.perturbationResults.filter((item) => item.perturbationId !== perturbation.id),
      result,
    ],
  };
}

export function canPromotePossibility(possibility: Possibility) {
  const evidence = possibility.viability.find((item) => item.id === "evidence_support");
  const hasCompletedExperiment = possibility.experiment?.status === "completed";
  return Boolean(hasCompletedExperiment && evidence && evidence.status !== "low" && evidence.status !== "unknown");
}
