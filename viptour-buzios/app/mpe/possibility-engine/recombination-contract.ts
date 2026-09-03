import type { PossibilityGraph } from "./model";
import { generateNovelStructures } from "./recombination";

export function assertRecombinationContract(graph: PossibilityGraph) {
  const result = generateNovelStructures(graph, 4);
  const boundary: "NOVEL_STRUCTURE_IS_PROPOSED_NOT_EVIDENCE" = result.boundary;
  const proposedOnly = result.generated.every(
    (item) => item.possibility.epistemicStatus === "proposed" && item.possibility.lifecycleStage === "generated"
  );
  return {
    boundary,
    generatedCount: result.generated.length,
    proposedOnly,
    parentLinks: result.generated.map((item) => item.parentIds.length),
  };
}
