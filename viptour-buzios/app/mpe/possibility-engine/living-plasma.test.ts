import { describe, expect, it } from "vitest";
import { buildPossibilityGraph, createState, generateStructuralCandidates } from "./engine";

describe("PossibilityGraph semantic projection", () => {
  it("keeps generated possibilities proposed and exploration non-exhaustive", () => {
    const state = createState({ objective: "explore a new project", resources: ["time"], unknowns: ["demand"] });
    const nodes = generateStructuralCandidates(state);
    const graph = buildPossibilityGraph(state, nodes);
    expect(graph.exploration.exhaustiveClaimAllowed).toBe(false);
    expect(graph.exploration.generatedCount).toBe(nodes.length);
    expect(nodes.every((node) => node.epistemicStatus === "proposed")).toBe(true);
    expect(nodes.every((node) => node.lifecycleStage === "generated")).toBe(true);
  });
});
