import type { Possibility, PossibilityGraph, PossibilityOperator } from "./model";
import type { ScenarioPersistenceReport } from "./scenario-persistence";

export type PossibilityRegionKind =
  | "expansion"
  | "reconfiguration"
  | "experimentation"
  | "mutation"
  | "conservation"
  | "exit"
  | "unclassified";

export type PerturbationBoundaryState =
  | "observed_stable"
  | "observed_fragile"
  | "observed_fragmented"
  | "observed_closed"
  | "indeterminate";

export type PossibilityRegion = {
  id: string;
  kind: PossibilityRegionKind;
  label: string;
  possibilityIds: string[];
  operatorSignature: PossibilityOperator[];
  boundaryState: PerturbationBoundaryState;
  observations: {
    persistent: number;
    fragile: number;
    closed: number;
    indeterminate: number;
  };
  note: string;
};

export type PossibilityMorphospace = {
  rootStateId: string;
  regions: PossibilityRegion[];
  transitions: Array<{
    fromRegionId: string;
    toRegionId: string;
    relation: PossibilityGraph["edges"][number]["relation"];
    edgeCount: number;
  }>;
  unclassifiedPossibilityIds: string[];
  boundary: "MORPHOSPACE_IS_STRUCTURAL_MAP_NOT_EVIDENCE";
  persistenceBoundary: "STRUCTURAL_PERSISTENCE_IS_NOT_PROBABILITY";
  geometryBoundary: "GEOMETRY_IS_VISUALIZATION_NOT_EVIDENCE";
};

const REGION_LABELS: Record<PossibilityRegionKind, string> = {
  expansion: "Expansión",
  reconfiguration: "Reconfiguración",
  experimentation: "Experimentación",
  mutation: "Mutación / recombinación",
  conservation: "Conservación / espera",
  exit: "Salida / abandono",
  unclassified: "No clasificado",
};

const OPERATOR_REGION: Partial<Record<PossibilityOperator, PossibilityRegionKind>> = {
  combine: "expansion",
  acquire: "expansion",
  reuse: "expansion",
  connect: "expansion",
  cooperate: "expansion",
  scale: "expansion",
  remove_constraint: "reconfiguration",
  experiment: "experimentation",
  mutate: "mutation",
  divide: "mutation",
  delay: "conservation",
  abandon: "exit",
};

function classifyPossibility(possibility: Possibility): PossibilityRegionKind {
  const counts = new Map<PossibilityRegionKind, number>();
  for (const operator of possibility.operators) {
    const region = OPERATOR_REGION[operator] ?? "unclassified";
    counts.set(region, (counts.get(region) ?? 0) + 1);
  }
  if (!counts.size) return "unclassified";
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0];
}

function boundaryFromCounts(counts: PossibilityRegion["observations"]): PerturbationBoundaryState {
  const total = counts.persistent + counts.fragile + counts.closed + counts.indeterminate;
  if (!total || counts.indeterminate === total) return "indeterminate";
  if (counts.closed === total) return "observed_closed";
  if (counts.persistent === total) return "observed_stable";
  if (counts.closed > 0 && counts.persistent > 0) return "observed_fragmented";
  if (counts.fragile > 0 || counts.closed > 0) return "observed_fragile";
  return "indeterminate";
}

export function buildPossibilityMorphospace(
  graph: PossibilityGraph,
  persistence: ScenarioPersistenceReport | null,
): PossibilityMorphospace {
  const persistenceById = new Map(
    (persistence?.possibilities ?? []).map((item) => [item.possibilityId, item.classification] as const),
  );

  const buckets = new Map<PossibilityRegionKind, Possibility[]>();
  for (const possibility of graph.nodes) {
    const kind = classifyPossibility(possibility);
    const bucket = buckets.get(kind) ?? [];
    bucket.push(possibility);
    buckets.set(kind, bucket);
  }

  const regions: PossibilityRegion[] = [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([kind, possibilities]) => {
      const observations = { persistent: 0, fragile: 0, closed: 0, indeterminate: 0 };
      for (const possibility of possibilities) {
        const classification = persistenceById.get(possibility.id) ?? "indeterminate";
        if (classification === "observed_persistent") observations.persistent++;
        else if (classification === "observed_fragile") observations.fragile++;
        else if (classification === "observed_closed") observations.closed++;
        else observations.indeterminate++;
      }
      const operatorSignature = [...new Set(possibilities.flatMap((p) => p.operators))].sort();
      return {
        id: `region:${kind}`,
        kind,
        label: REGION_LABELS[kind],
        possibilityIds: possibilities.map((p) => p.id),
        operatorSignature,
        boundaryState: boundaryFromCounts(observations),
        observations,
        note: "Región derivada de operadores estructurales compartidos. No representa probabilidad, verdad ni evidencia científica.",
      };
    });

  const regionByPossibility = new Map<string, string>();
  regions.forEach((region) => region.possibilityIds.forEach((id) => regionByPossibility.set(id, region.id)));
  const transitionCounts = new Map<string, { fromRegionId: string; toRegionId: string; relation: PossibilityGraph["edges"][number]["relation"]; edgeCount: number }>();
  for (const edge of graph.edges) {
    const fromRegionId = regionByPossibility.get(edge.from);
    const toRegionId = regionByPossibility.get(edge.to);
    if (!fromRegionId || !toRegionId || fromRegionId === toRegionId) continue;
    const key = `${fromRegionId}|${toRegionId}|${edge.relation}`;
    const current = transitionCounts.get(key);
    if (current) current.edgeCount++;
    else transitionCounts.set(key, { fromRegionId, toRegionId, relation: edge.relation, edgeCount: 1 });
  }

  const unclassifiedPossibilityIds = regions.find((region) => region.kind === "unclassified")?.possibilityIds ?? [];

  return {
    rootStateId: graph.rootStateId,
    regions,
    transitions: [...transitionCounts.values()],
    unclassifiedPossibilityIds,
    boundary: "MORPHOSPACE_IS_STRUCTURAL_MAP_NOT_EVIDENCE",
    persistenceBoundary: "STRUCTURAL_PERSISTENCE_IS_NOT_PROBABILITY",
    geometryBoundary: "GEOMETRY_IS_VISUALIZATION_NOT_EVIDENCE",
  };
}

export function getRegionForPossibility(
  morphospace: PossibilityMorphospace,
  possibilityId: string,
): PossibilityRegion | undefined {
  return morphospace.regions.find((region) => region.possibilityIds.includes(possibilityId));
}
