import type { MpeState, PossibilityGraph } from "./model";
import type { TemporalMemory } from "./temporal-memory";
import { generateNextAdaptiveCycle, type ClosedLoopCycle } from "./closed-loop-evolution";
import { generateNovelStructures, type RecombinationResult } from "./recombination";

export type NovelAdaptiveCycle = {
  adaptive: ClosedLoopCycle;
  novelty: RecombinationResult;
  graph: PossibilityGraph;
  boundary: "ADAPTIVE_NOVELTY_IS_SEARCH_NOT_VALIDATION";
};

export function generateNovelAdaptiveCycle(
  state: MpeState,
  previousGraph: PossibilityGraph,
  memory: TemporalMemory,
  cycleIndex: number
): NovelAdaptiveCycle {
  const adaptive = generateNextAdaptiveCycle(state, previousGraph, memory, cycleIndex);
  const novelty = generateNovelStructures(adaptive.graph, 6);
  return {
    adaptive,
    novelty,
    graph: novelty.graph,
    boundary: "ADAPTIVE_NOVELTY_IS_SEARCH_NOT_VALIDATION",
  };
}
