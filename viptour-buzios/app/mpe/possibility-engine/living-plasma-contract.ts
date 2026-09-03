import type { PossibilityGraph } from "./model";

export const assertLivingPlasmaContract = (graph: PossibilityGraph) => {
  const nonExhaustive: false = graph.exploration.exhaustiveClaimAllowed;
  return {
    nonExhaustive,
    nodeCount: graph.nodes.length,
    relationCount: graph.edges.length,
    epistemicStatuses: graph.nodes.map((node) => node.epistemicStatus),
    lifecycleStages: graph.nodes.map((node) => node.lifecycleStage),
  };
};
