import type { MpeState, Possibility, PossibilityGraph, PossibilityOperator } from "./model";
import { buildPossibilityGraph, generateStructuralCandidates } from "./engine";
import { deriveAdaptiveExplorationPolicy, reorderForAdaptiveExploration, type AdaptiveExplorationPolicy } from "./adaptive-learning";
import type { TemporalMemory } from "./temporal-memory";
import { generateNovelStructures, type RecombinantPossibility } from "./recombination";
import { selectPossibilityPopulation, type PossibilityPopulationSelection } from "./population-selection";
import type { ScenarioPersistenceReport } from "./scenario-persistence";

export type ReproductionTrace = {
  childId: string;
  parentIds: string[];
  mode: "selected_parent" | "root_fallback" | "recombination";
  reasons: string[];
  boundary: "REPRODUCTION_TRACE_IS_PROVENANCE_NOT_EVIDENCE";
};

export type ClosedLoopCycle = {
  cycleId: string;
  sourceStateId: string;
  policy: AdaptiveExplorationPolicy;
  populationSelection: PossibilityPopulationSelection;
  reproductiveParentIds: string[];
  reproductionTrace: ReproductionTrace[];
  graph: PossibilityGraph;
  generated: Possibility[];
  retained: Possibility[];
  novelGenerated: RecombinantPossibility[];
  boundary: "MEMORY_CHANGES_SEARCH_NOT_TRUTH";
  reproductionBoundary: "SELECTION_CONTROLS_REPRODUCTION_NOT_TRUTH";
  noveltyBoundary: "NOVEL_STRUCTURE_IS_PROPOSED_NOT_EVIDENCE";
};

const preferred = (p: Possibility, operators: PossibilityOperator[]) => p.operators.some((o) => operators.includes(o));

export function generateNextAdaptiveCycle(
  state: MpeState,
  previousGraph: PossibilityGraph,
  memory: TemporalMemory,
  cycleIndex: number,
  persistence: ScenarioPersistenceReport | null = null,
): ClosedLoopCycle {
  const policy = deriveAdaptiveExplorationPolicy(previousGraph, memory);
  const populationSelection = selectPossibilityPopulation(previousGraph, persistence, memory);
  const dispositionById = new Map(populationSelection.members.map((m) => [m.possibilityId, m.disposition] as const));
  const decisionById = new Map(populationSelection.members.map((m) => [m.possibilityId, m] as const));
  const reproductiveParents = previousGraph.nodes.filter((p) => dispositionById.get(p.id) === "continue_exploration");
  const reserveParents = previousGraph.nodes.filter((p) => dispositionById.get(p.id) === "reserve");
  const parentPool = reproductiveParents.length ? reproductiveParents : reserveParents;
  const reproductiveParentIds = parentPool.map((p) => p.id);

  const fresh = generateStructuralCandidates(state).map((p, index) => {
    const parent = parentPool.length ? parentPool[index % parentPool.length] : undefined;
    const decision = parent ? decisionById.get(parent.id) : undefined;
    return {
      ...p,
      id: `${p.id}-c${cycleIndex + 1}`,
      parentPossibilityIds: parent ? [parent.id] : p.parentPossibilityIds,
      sources: [
        ...p.sources,
        {
          kind: "evolutionary" as const,
          ref: `adaptive-cycle:${cycleIndex + 1}`,
          note: parent
            ? `Child generated from ${parent.id} after population selection (${decision?.disposition ?? "unknown"}). ${decision?.reasons.join(" ") ?? ""} This is provenance, not evidence or epistemic promotion.`
            : "Candidate regenerated from S₀ because no selected reproductive parent was available. This is provenance, not evidence or epistemic promotion.",
        },
      ],
    };
  });

  const preferredFresh = fresh.filter((p) => preferred(p, policy.preferredOperators));
  const fallbackFresh = fresh.filter((p) => !preferred(p, policy.preferredOperators));
  const orderedFresh = reorderForAdaptiveExploration([...preferredFresh, ...fallbackFresh], policy);

  const retained = previousGraph.nodes
    .filter((p) => dispositionById.get(p.id) !== "deprioritize")
    .map((p) => ({ ...p, parentPossibilityIds: [...p.parentPossibilityIds], childPossibilityIds: [...p.childPossibilityIds] }));

  const generated = orderedFresh.slice(0, Math.max(4, Math.min(8, orderedFresh.length)));
  const nodes = [...retained, ...generated];
  const adaptiveGraph = buildPossibilityGraph(state, nodes, previousGraph.exploration.depth + 1);
  for (const p of generated) {
    const parentId = p.parentPossibilityIds[0];
    adaptiveGraph.edges.push({ from: parentId ?? previousGraph.rootStateId, to: p.id, relation: parentId ? "opens" : "derived_from" });
  }
  adaptiveGraph.exploration.generatedCount = nodes.length;

  const noveltySourceGraph: PossibilityGraph = parentPool.length >= 2
    ? { ...adaptiveGraph, nodes: adaptiveGraph.nodes.filter((n) => reproductiveParentIds.includes(n.id) || generated.some((g) => g.id === n.id)) }
    : adaptiveGraph;
  const novelty = generateNovelStructures(noveltySourceGraph, 6);
  const novelIds = new Set(novelty.generated.map((item) => item.possibility.id));
  const graph: PossibilityGraph = {
    ...adaptiveGraph,
    nodes: [...adaptiveGraph.nodes, ...novelty.graph.nodes.filter((n) => novelIds.has(n.id) && !adaptiveGraph.nodes.some((a) => a.id === n.id))],
    edges: [...adaptiveGraph.edges, ...novelty.graph.edges.filter((e) => novelIds.has(e.to) && !adaptiveGraph.edges.some((a) => a.from === e.from && a.to === e.to && a.relation === e.relation))],
  };
  graph.exploration.generatedCount = graph.nodes.length;

  const reproductionTrace: ReproductionTrace[] = generated.map((child) => ({
    childId: child.id,
    parentIds: [...child.parentPossibilityIds],
    mode: child.parentPossibilityIds.length ? "selected_parent" : "root_fallback",
    reasons: child.parentPossibilityIds.flatMap((parentId) => decisionById.get(parentId)?.reasons ?? []),
    boundary: "REPRODUCTION_TRACE_IS_PROVENANCE_NOT_EVIDENCE",
  }));
  for (const item of novelty.generated) {
    reproductionTrace.push({
      childId: item.possibility.id,
      parentIds: [...item.possibility.parentPossibilityIds],
      mode: item.possibility.parentPossibilityIds.length > 1 ? "recombination" : "selected_parent",
      reasons: ["Novel structure generated from the selected reproductive subgraph."],
      boundary: "REPRODUCTION_TRACE_IS_PROVENANCE_NOT_EVIDENCE",
    });
  }

  return {
    cycleId: `adaptive-cycle-${cycleIndex + 1}`,
    sourceStateId: state.id,
    policy,
    populationSelection,
    reproductiveParentIds,
    reproductionTrace,
    graph,
    generated: [...novelty.generated.map((item) => item.possibility), ...generated],
    retained,
    novelGenerated: novelty.generated,
    boundary: "MEMORY_CHANGES_SEARCH_NOT_TRUTH",
    reproductionBoundary: "SELECTION_CONTROLS_REPRODUCTION_NOT_TRUTH",
    noveltyBoundary: novelty.boundary,
  };
}
