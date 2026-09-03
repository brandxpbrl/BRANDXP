import type { MpeState, Possibility, PossibilityGraph, PossibilityOperator } from "./model";
import { buildPossibilityGraph, generateStructuralCandidates } from "./engine";
import { deriveAdaptiveExplorationPolicy, reorderForAdaptiveExploration, type AdaptiveExplorationPolicy } from "./adaptive-learning";
import type { TemporalMemory } from "./temporal-memory";

export type ClosedLoopCycle = {
  cycleId: string;
  sourceStateId: string;
  policy: AdaptiveExplorationPolicy;
  graph: PossibilityGraph;
  generated: Possibility[];
  retained: Possibility[];
  boundary: "MEMORY_CHANGES_SEARCH_NOT_TRUTH";
};

const preferred = (p: Possibility, operators: PossibilityOperator[]) => p.operators.some((o) => operators.includes(o));

export function generateNextAdaptiveCycle(
  state: MpeState,
  previousGraph: PossibilityGraph,
  memory: TemporalMemory,
  cycleIndex: number
): ClosedLoopCycle {
  const policy = deriveAdaptiveExplorationPolicy(previousGraph, memory);
  const fresh = generateStructuralCandidates(state).map((p) => ({
    ...p,
    id: `${p.id}-c${cycleIndex + 1}`,
    sources: [
      ...p.sources,
      {
        kind: "evolutionary" as const,
        ref: `adaptive-cycle:${cycleIndex + 1}`,
        note: "Candidate regenerated under a history-guided search policy; this is not evidence or epistemic promotion.",
      },
    ],
  }));

  const preferredFresh = fresh.filter((p) => preferred(p, policy.preferredOperators));
  const fallbackFresh = fresh.filter((p) => !preferred(p, policy.preferredOperators));
  const orderedFresh = reorderForAdaptiveExploration([...preferredFresh, ...fallbackFresh], policy);

  const retained = previousGraph.nodes
    .filter((p) => policy.guidance.find((g) => g.possibilityId === p.id)?.signal !== "deprioritize")
    .map((p) => ({ ...p, parentPossibilityIds: [...p.parentPossibilityIds], childPossibilityIds: [...p.childPossibilityIds] }));

  const generated = orderedFresh.slice(0, Math.max(4, Math.min(8, orderedFresh.length)));
  const nodes = [...retained, ...generated];
  const graph = buildPossibilityGraph(state, nodes, previousGraph.exploration.depth + 1);
  for (const p of generated) {
    graph.edges.push({ from: previousGraph.rootStateId, to: p.id, relation: "derived_from" });
  }
  graph.exploration.generatedCount = nodes.length;

  return {
    cycleId: `adaptive-cycle-${cycleIndex + 1}`,
    sourceStateId: state.id,
    policy,
    graph,
    generated,
    retained,
    boundary: "MEMORY_CHANGES_SEARCH_NOT_TRUTH",
  };
}
