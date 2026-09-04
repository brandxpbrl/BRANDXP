import type { Possibility, PossibilityGraph } from "./model";
import type { ScenarioPersistenceReport } from "./scenario-persistence";
import type { TemporalMemory } from "./temporal-memory";

export type PopulationDisposition =
  | "continue_exploration"
  | "experiment_first"
  | "reserve"
  | "deprioritize";

export type PopulationMemberDecision = {
  possibilityId: string;
  disposition: PopulationDisposition;
  reasons: string[];
  evidenceBoundary: "SELECTION_GUIDES_SEARCH_NOT_TRUTH";
};

export type PossibilityPopulationSelection = {
  members: PopulationMemberDecision[];
  counts: Record<PopulationDisposition, number>;
  boundary: "POPULATION_SELECTION_IS_RESOURCE_ALLOCATION_NOT_EPISTEMIC_PROMOTION";
};

const evidenceSupport = (p: Possibility) =>
  p.viability.find((dimension) => dimension.id === "evidence_support")?.status ?? "unknown";

const hasUntestedFalsification = (p: Possibility) =>
  p.falsificationCriteria.some((criterion) => criterion.status === "untested");

export function selectPossibilityPopulation(
  graph: PossibilityGraph,
  persistence: ScenarioPersistenceReport | null,
  memory: TemporalMemory | null,
): PossibilityPopulationSelection {
  const persistenceById = new Map(
    (persistence?.possibilities ?? []).map((item) => [item.possibilityId, item.classification] as const),
  );
  const trajectoryById = new Map(
    (memory?.trajectories ?? []).map((trajectory) => [trajectory.possibilityId, trajectory.historicalPattern] as const),
  );

  const members = graph.nodes.map((possibility): PopulationMemberDecision => {
    const observedPersistence = persistenceById.get(possibility.id);
    const historicalPattern = trajectoryById.get(possibility.id) ?? "insufficient_history";
    const support = evidenceSupport(possibility);
    const reasons: string[] = [];

    if (
      possibility.lifecycleStage === "rejected" ||
      possibility.epistemicStatus === "rejected" ||
      Boolean(possibility.closedReason) ||
      historicalPattern === "historically_closed" ||
      observedPersistence === "observed_closed"
    ) {
      reasons.push("La rama tiene cierre o rechazo explícito dentro de la evidencia disponible.");
      reasons.push("Se reduce prioridad sin borrar genealogía, evidencia ni posibilidad de revisión futura.");
      return {
        possibilityId: possibility.id,
        disposition: "deprioritize",
        reasons,
        evidenceBoundary: "SELECTION_GUIDES_SEARCH_NOT_TRUTH",
      };
    }

    if (
      support === "low" ||
      support === "unknown" ||
      hasUntestedFalsification(possibility) ||
      historicalPattern === "insufficient_history"
    ) {
      reasons.push("La rama todavía no tiene soporte suficiente para recibir más expansión sin prueba.");
      reasons.push("La prioridad es generar observación, experimento o intento explícito de falsificación.");
      return {
        possibilityId: possibility.id,
        disposition: "experiment_first",
        reasons,
        evidenceBoundary: "SELECTION_GUIDES_SEARCH_NOT_TRUTH",
      };
    }

    if (
      historicalPattern === "historically_persistent" ||
      observedPersistence === "observed_persistent"
    ) {
      reasons.push("La rama mostró continuidad estructural observada en los escenarios o ciclos disponibles.");
      reasons.push("Puede recibir más presupuesto de exploración sin inferir superioridad ni probabilidad de éxito.");
      return {
        possibilityId: possibility.id,
        disposition: "continue_exploration",
        reasons,
        evidenceBoundary: "SELECTION_GUIDES_SEARCH_NOT_TRUTH",
      };
    }

    reasons.push("La rama sigue abierta, pero su comportamiento histórico o estructural no justifica expansión prioritaria.");
    reasons.push("Se conserva en reserva para recombinación, nueva evidencia o cambio de contexto.");
    return {
      possibilityId: possibility.id,
      disposition: "reserve",
      reasons,
      evidenceBoundary: "SELECTION_GUIDES_SEARCH_NOT_TRUTH",
    };
  });

  const counts: Record<PopulationDisposition, number> = {
    continue_exploration: 0,
    experiment_first: 0,
    reserve: 0,
    deprioritize: 0,
  };
  members.forEach((member) => counts[member.disposition]++);

  return {
    members,
    counts,
    boundary: "POPULATION_SELECTION_IS_RESOURCE_ALLOCATION_NOT_EPISTEMIC_PROMOTION",
  };
}

export function getPopulationDecision(
  selection: PossibilityPopulationSelection,
  possibilityId: string,
): PopulationMemberDecision | undefined {
  return selection.members.find((member) => member.possibilityId === possibilityId);
}
