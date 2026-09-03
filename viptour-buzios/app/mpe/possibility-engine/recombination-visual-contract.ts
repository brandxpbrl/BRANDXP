import type { RecombinationResult } from "./recombination";

export function recombinantVisualSummary(result: RecombinationResult) {
  return {
    total: result.generated.length,
    mutations: result.generated.filter((item) => item.kind === "mutation").length,
    recombinations: result.generated.filter((item) => item.kind === "recombination").length,
    genealogyEdges: result.generated.reduce((sum, item) => sum + item.parentIds.length, 0),
    boundary: result.boundary,
  } as const;
}
