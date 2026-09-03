import type { MpeState, Perturbation, Possibility, PossibilityGraph } from "./model";
import { buildPossibilityGraph } from "./engine";

export type GraphPerturbationResult = {
  perturbation: Perturbation;
  nextState: MpeState;
  graph: PossibilityGraph;
  changedPossibilityIds: string[];
  interpretation: string[];
};

const cloneState = (state: MpeState): MpeState => ({
  ...state,
  resources: state.resources.map((x) => ({ ...x })),
  constraints: state.constraints.map((x) => ({ ...x })),
  pressures: state.pressures.map((x) => ({ ...x })),
  opportunities: state.opportunities.map((x) => ({ ...x })),
  unknowns: state.unknowns.map((x) => ({ ...x })),
  createdAt: new Date().toISOString(),
});

const collections = (state: MpeState) => [
  state.resources,
  state.constraints,
  state.pressures,
  state.opportunities,
  state.unknowns,
];

export function applyStatePerturbation(
  state: MpeState,
  possibilities: Possibility[],
  perturbation: Perturbation
): GraphPerturbationResult {
  const nextState = cloneState(state);
  const touched = new Set<string>();

  for (const change of perturbation.changes) {
    for (const collection of collections(nextState)) {
      const index = collection.findIndex((fact) => fact.id === change.factId);
      if (index < 0) continue;
      const fact = collection[index];
      touched.add(change.factId);
      if (change.operation === "remove") {
        collection.splice(index, 1);
      } else if (change.operation === "set") {
        fact.value = change.value ?? fact.value;
        fact.label = String(change.value ?? fact.label);
        fact.confidence = "derived";
      } else if (typeof fact.value === "number" && typeof change.value === "number") {
        fact.value = change.operation === "increase" ? fact.value + change.value : fact.value - change.value;
        fact.confidence = "derived";
      } else {
        fact.label = `${fact.label} · ${change.operation}`;
        fact.confidence = "derived";
      }
    }
  }

  const changedPossibilityIds: string[] = [];
  const evolved = possibilities.map((p) => {
    const dependencyHit = p.dependencies.some((id) => touched.has(id));
    const contradictionHit = p.contradictsConstraintIds.some((id) => touched.has(id));
    const next = {
      ...p,
      parentPossibilityIds: [...p.parentPossibilityIds],
      childPossibilityIds: [...p.childPossibilityIds],
      openedFutureIds: [...p.openedFutureIds],
      closedFutureIds: [...p.closedFutureIds],
      falsificationCriteria: p.falsificationCriteria.map((f) => ({ ...f })),
    };

    if (dependencyHit || contradictionHit) {
      changedPossibilityIds.push(p.id);
      next.lifecycleStage = "candidate";
      next.perturbationResults = [
        ...p.perturbationResults,
        {
          perturbationId: perturbation.id,
          viability: "unknown",
          reason: "La perturbación tocó una dependencia/restricción relacionada. Sin modelo causal no se infiere supervivencia ni colapso.",
        },
      ];
    }
    return next;
  });

  const graph = buildPossibilityGraph(nextState, evolved, 2);
  for (const p of evolved) {
    if (changedPossibilityIds.includes(p.id)) {
      graph.edges.push({ from: perturbation.id, to: p.id, relation: "depends_on" });
    }
  }

  return {
    perturbation,
    nextState,
    graph,
    changedPossibilityIds,
    interpretation: changedPossibilityIds.length
      ? [
          `${changedPossibilityIds.length} posibilidades quedaron afectadas estructuralmente.`,
          "El resultado permanece UNKNOWN hasta ejecutar un evaluador o experimento contextual.",
        ]
      : [
          "La perturbación no toca dependencias explícitas del grafo actual.",
          "Esto no demuestra que el sistema sea inmune; puede faltar modelado de relaciones.",
        ],
  };
}

export function createFactRemovalPerturbation(factId: string, label: string): Perturbation {
  return {
    id: `perturb-remove-${factId}`,
    label: `Retirar: ${label}`,
    changes: [{ factId, operation: "remove" }],
  };
}
