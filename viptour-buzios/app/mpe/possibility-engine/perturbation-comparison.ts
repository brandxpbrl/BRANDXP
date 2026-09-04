import type { PossibilityGraph } from "./model";
import type { GraphPerturbationResult } from "./perturbation-engine";
import type { ScenarioPersistenceReport } from "./scenario-persistence";
import { buildPossibilityMorphospace, type MorphospaceBoundaryState } from "./possibility-morphospace";

export type RegionPerturbationTransition = {
  regionId: string;
  before: MorphospaceBoundaryState;
  after: MorphospaceBoundaryState;
  affectedPossibilityIds: string[];
  interpretation: "UNCHANGED" | "AFFECTED" | "FRAGMENTED" | "CLOSED" | "INDETERMINATE";
};

export type PerturbationBoundaryComparison = {
  perturbationId: string;
  transitions: RegionPerturbationTransition[];
  affectedPossibilityIds: string[];
  boundary: "PERTURBATION_COMPARISON_IS_STRUCTURAL_OBSERVATION_NOT_PROBABILITY";
};

export function comparePerturbationBoundary(
  beforeGraph: PossibilityGraph,
  result: GraphPerturbationResult,
  persistence: ScenarioPersistenceReport | null,
): PerturbationBoundaryComparison {
  const before = buildPossibilityMorphospace(beforeGraph, persistence);
  const after = buildPossibilityMorphospace(result.graph, persistence);
  const affected = new Set(result.changedPossibilityIds);
  const beforeById = new Map(before.regions.map((region) => [region.id, region] as const));
  const afterById = new Map(after.regions.map((region) => [region.id, region] as const));
  const ids = new Set([...beforeById.keys(), ...afterById.keys()]);
  const transitions: RegionPerturbationTransition[] = [...ids].map((regionId) => {
    const b = beforeById.get(regionId);
    const a = afterById.get(regionId);
    const touched = [...new Set([...(b?.possibilityIds ?? []), ...(a?.possibilityIds ?? [])])].filter((id) => affected.has(id));
    const beforeState = b?.boundary ?? "INDETERMINATE";
    const afterState = a?.boundary ?? "INDETERMINATE";
    let interpretation: RegionPerturbationTransition["interpretation"] = "UNCHANGED";
    if (afterState === "OBSERVED_CLOSED") interpretation = "CLOSED";
    else if (afterState === "OBSERVED_FRAGMENTED") interpretation = "FRAGMENTED";
    else if (touched.length && afterState === "INDETERMINATE") interpretation = "INDETERMINATE";
    else if (touched.length || beforeState !== afterState) interpretation = "AFFECTED";
    return { regionId, before: beforeState, after: afterState, affectedPossibilityIds: touched, interpretation };
  });
  return {
    perturbationId: result.perturbation.id,
    transitions,
    affectedPossibilityIds: result.changedPossibilityIds,
    boundary: "PERTURBATION_COMPARISON_IS_STRUCTURAL_OBSERVATION_NOT_PROBABILITY",
  };
}
