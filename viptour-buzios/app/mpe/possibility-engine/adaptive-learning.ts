import type { Possibility, PossibilityGraph, PossibilityOperator } from "./model";
import type { TemporalMemory, TrajectoryPattern } from "./temporal-memory";

export type AdaptiveSignal = "explore_related" | "diversify" | "seek_evidence" | "deprioritize" | "insufficient_history";
export type AdaptiveGuidance = {
  possibilityId: string;
  pattern: TrajectoryPattern;
  signal: AdaptiveSignal;
  operatorHints: PossibilityOperator[];
  reason: string;
  boundary: "HISTORY_GUIDES_EXPLORATION_NOT_TRUTH";
};
export type AdaptiveExplorationPolicy = {
  guidance: AdaptiveGuidance[];
  preferredOperators: PossibilityOperator[];
  boundary: "ADAPTATION_IS_SEARCH_POLICY_NOT_EPISTEMIC_PROMOTION";
};

const hints:Record<AdaptiveSignal,PossibilityOperator[]>={
 explore_related:["combine","scale"], diversify:["substitute","decompose","partner"], seek_evidence:["experiment"], deprioritize:["reduce_scope","substitute"], insufficient_history:["experiment"]
};

export function deriveAdaptiveExplorationPolicy(graph:PossibilityGraph,memory:TemporalMemory):AdaptiveExplorationPolicy{
 const guidance=graph.nodes.map((p):AdaptiveGuidance=>{
  const trajectory=memory.trajectories.find(t=>t.possibilityId===p.id);
  const pattern=trajectory?.pattern??"insufficient_history";
  const signal:AdaptiveSignal=pattern==="historically_persistent"?"explore_related":pattern==="historically_variable"?"diversify":pattern==="historically_closed"?"deprioritize":"insufficient_history";
  return {possibilityId:p.id,pattern,signal,operatorHints:hints[signal],reason:pattern==="historically_persistent"?"La rama mostró continuidad histórica observada; explorar vecindad sin asumir superioridad.":pattern==="historically_variable"?"La rama cambió entre ciclos; diversificar transformaciones y buscar condiciones explicativas.":pattern==="historically_closed"?"La rama apareció cerrada históricamente; reducir prioridad de búsqueda sin borrar evidencia ni declarar imposibilidad universal.":"Historia insuficiente; priorizar observación o experimento antes de adaptar la búsqueda.",boundary:"HISTORY_GUIDES_EXPLORATION_NOT_TRUTH"};
 });
 const counts=new Map<PossibilityOperator,number>();guidance.forEach(g=>g.operatorHints.forEach(o=>counts.set(o,(counts.get(o)??0)+1)));
 const preferredOperators=[...counts.entries()].sort((a,b)=>b[1]-a[1]).map(([o])=>o);
 return {guidance,preferredOperators,boundary:"ADAPTATION_IS_SEARCH_POLICY_NOT_EPISTEMIC_PROMOTION"};
}

export function reorderForAdaptiveExploration(possibilities:Possibility[],policy:AdaptiveExplorationPolicy):Possibility[]{
 const rank=new Map(policy.guidance.map((g,i)=>[g.possibilityId,g.signal==="explore_related"?0:g.signal==="diversify"?1:g.signal==="insufficient_history"?2:3+i]));
 return [...possibilities].sort((a,b)=>(rank.get(a.id)??99)-(rank.get(b.id)??99));
}
