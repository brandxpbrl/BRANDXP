import type { PossibilityGraph } from "./model";
import type { ScenarioPersistenceReport } from "./scenario-persistence";
import type { TemporalMemory } from "./temporal-memory";
import { selectPossibilityPopulation } from "./population-selection";

export function assertPopulationSelectionContract(
  graph: PossibilityGraph,
  persistence: ScenarioPersistenceReport | null,
  memory: TemporalMemory | null,
) {
  const selection = selectPossibilityPopulation(graph, persistence, memory);
  const boundary: "POPULATION_SELECTION_IS_RESOURCE_ALLOCATION_NOT_EPISTEMIC_PROMOTION" =
    selection.boundary;

  return {
    boundary,
    total: selection.members.length,
    counts: selection.counts,
    dispositions: selection.members.map((member) => member.disposition),
  };
}
