import type { Perturbation, Possibility, PossibilityGraph } from "./model";
import type { GraphPerturbationResult } from "./perturbation-engine";

export type EvolutionaryBranchingResult = {
  graph: PossibilityGraph;
  descendants: Possibility[];
  parentIds: string[];
  interpretation: string[];
};

const safeId = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 42);

const clonePossibility = (p: Possibility): Possibility => ({
  ...p,
  parentPossibilityIds: [...p.parentPossibilityIds],
  childPossibilityIds: [...p.childPossibilityIds],
  operators: [...p.operators],
  sources: p.sources.map((s) => ({ ...s })),
  assumptions: [...p.assumptions],
  dependencies: [...p.dependencies],
  supportsObjectiveIds: [...p.supportsObjectiveIds],
  contradictsConstraintIds: [...p.contradictsConstraintIds],
  viability: p.viability.map((v) => ({ ...v, sourceRefs: [...v.sourceRefs] })),
  perturbationResults: p.perturbationResults.map((r) => ({ ...r })),
  openedFutureIds: [...p.openedFutureIds],
  closedFutureIds: [...p.closedFutureIds],
  falsificationCriteria: p.falsificationCriteria.map((f) => ({ ...f })),
  experiment: p.experiment ? { ...p.experiment } : undefined,
});

function descendantFrom(parent: Possibility, perturbation: Perturbation, ordinal: number): Possibility {
  const id = `evo-${safeId(parent.id)}-${safeId(perturbation.id)}-${ordinal}`;
  return {
    ...clonePossibility(parent),
    id,
    title: `Adaptar: ${parent.title}`,
    description: `Descendiente estructural generado al explorar una adaptación de ${parent.id} bajo la perturbación “${perturbation.label}”.`,
    parentPossibilityIds: [parent.id],
    childPossibilityIds: [],
    operators: Array.from(new Set([...parent.operators, "mutate", "experiment"])),
    sources: [...parent.sources, { kind: "evolutionary", ref: perturbation.id, note: "Generación estructural; no evidencia de viabilidad." }],
    assumptions: [...parent.assumptions, "La adaptación propuesta todavía no fue evaluada en contexto."],
    perturbationResults: [...parent.perturbationResults, { perturbationId: perturbation.id, viability: "unknown", reason: "Descendiente nuevo: requiere evaluación contextual." }],
    epistemicStatus: "proposed",
    lifecycleStage: "generated",
    openedFutureIds: [],
    closedFutureIds: [],
    falsificationCriteria: [{ id: `falsify-${id}`, claim: "La adaptación conserva una ruta hacia el objetivo bajo la perturbación.", falsifiedBy: "Un experimento contextual muestra que la adaptación no mantiene una ruta operable hacia el objetivo.", status: "untested" }],
    experiment: parent.experiment ? { ...parent.experiment, id: `exp-${id}`, question: `¿La adaptación ${id} mantiene una ruta operable bajo “${perturbation.label}”?`, status: "proposed" } : undefined,
    closedReason: undefined,
  };
}

export function evolveAfterPerturbation(result: GraphPerturbationResult): EvolutionaryBranchingResult {
  const graph: PossibilityGraph = {
    ...result.graph,
    nodes: result.graph.nodes.map(clonePossibility),
    edges: result.graph.edges.map((e) => ({ ...e })),
    exploration: { ...result.graph.exploration, depth: result.graph.exploration.depth + 1 },
  };
  const descendants: Possibility[] = [];
  const parents = graph.nodes.filter((p) => result.changedPossibilityIds.includes(p.id));

  parents.forEach((parent, index) => {
    const child = descendantFrom(parent, result.perturbation, index + 1);
    descendants.push(child);
    parent.childPossibilityIds = Array.from(new Set([...parent.childPossibilityIds, child.id]));
    parent.openedFutureIds = Array.from(new Set([...parent.openedFutureIds, child.id]));
    graph.nodes.push(child);
    graph.edges.push({ from: parent.id, to: child.id, relation: "opens" });
    graph.edges.push({ from: result.perturbation.id, to: child.id, relation: "derived_from" });
  });

  graph.exploration.generatedCount = graph.nodes.length;
  return {
    graph,
    descendants,
    parentIds: parents.map((p) => p.id),
    interpretation: descendants.length
      ? [`La perturbación abrió ${descendants.length} descendientes estructurales nuevos.`, "Son PROPOSED/GENERATED: nacimiento de rama ≠ viabilidad ni evidencia."]
      : ["No se generaron descendientes porque la perturbación no afectó relaciones explícitas.", "Esto puede indicar falta de modelado; no prueba ausencia de futuros alternativos."],
  };
}
