import type { PossibilityGraph } from "./model";
import type { GraphPerturbationResult } from "./perturbation-engine";
import type { ScenarioPersistenceReport } from "./scenario-persistence";
import { buildPossibilityMorphospace, type PerturbationBoundaryState } from "./possibility-morphospace";

export type RegionPerturbationTransition = {
  regionId: string;
  before: PerturbationBoundaryState;
  after: PerturbationBoundaryState;
  affectedPossibilityIds: string[];
  interpretation: "unchanged" | "affected" | "fragmented" | "closed" | "indeterminate";
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
    const beforeState: PerturbationBoundaryState = b?.boundaryState ?? "indeterminate";
    const afterState: PerturbationBoundaryState = a?.boundaryState ?? "indeterminate";
    let interpretation: RegionPerturbationTransition["interpretation"] = "unchanged";
    if (afterState === "observed_closed") interpretation = "closed";
    else if (afterState === "observed_fragmented") interpretation = "fragmented";
    else if (touched.length && afterState === "indeterminate") interpretation = "indeterminate";
    else if (touched.length || beforeState !== afterState) interpretation = "affected";
    return { regionId, before: beforeState, after: afterState, affectedPossibilityIds: touched, interpretation };
  });
  return {
    perturbationId: result.perturbation.id,
    transitions,
    affectedPossibilityIds: result.changedPossibilityIds,
    boundary: "PERTURBATION_COMPARISON_IS_STRUCTURAL_OBSERVATION_NOT_PROBABILITY",
  };
}
