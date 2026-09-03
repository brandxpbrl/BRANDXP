import type { PossibilityGraph } from "./model";
import type { GraphPerturbationResult } from "./perturbation-engine";

export type ScenarioObservation = "accessible" | "affected" | "closed" | "unknown";
export type ScenarioCase = { id:string; label:string; result:GraphPerturbationResult };
export type PossibilityPersistence = {
  possibilityId:string;
  observations:{scenarioId:string;scenarioLabel:string;state:ScenarioObservation;reason:string}[];
  accessibleCount:number; affectedCount:number; closedCount:number; unknownCount:number;
  classification:"observed_persistent"|"observed_fragile"|"observed_closed"|"indeterminate";
};
export type ScenarioPersistenceReport = {
  graph:PossibilityGraph;
  scenarios:string[];
  possibilities:PossibilityPersistence[];
  boundary:"STRUCTURAL_SCENARIO_EXPLORATION_NOT_PROBABILITY";
};

export function evaluateScenarioPersistence(graph:PossibilityGraph,cases:ScenarioCase[]):ScenarioPersistenceReport{
 const possibilities=graph.nodes.map(node=>{
  const observations=cases.map(s=>{
   const candidate=s.result.graph.nodes.find(p=>p.id===node.id);
   if(!candidate)return {scenarioId:s.id,scenarioLabel:s.label,state:"unknown" as const,reason:"La posibilidad no está representada en este escenario."};
   if(candidate.lifecycleStage==="rejected"||candidate.closedReason)return {scenarioId:s.id,scenarioLabel:s.label,state:"closed" as const,reason:candidate.closedReason??"Rama rechazada en el escenario."};
   if(s.result.changedPossibilityIds.includes(node.id))return {scenarioId:s.id,scenarioLabel:s.label,state:"affected" as const,reason:"La perturbación toca una dependencia explícita; el resultado causal permanece UNKNOWN."};
   return {scenarioId:s.id,scenarioLabel:s.label,state:"accessible" as const,reason:"No se observó cierre estructural bajo las reglas explícitas de este escenario."};
  });
  const count=(state:ScenarioObservation)=>observations.filter(o=>o.state===state).length;
  const accessibleCount=count("accessible"),affectedCount=count("affected"),closedCount=count("closed"),unknownCount=count("unknown");
  const classification:PossibilityPersistence["classification"]=closedCount===cases.length&&cases.length>0?"observed_closed":accessibleCount===cases.length&&cases.length>0?"observed_persistent":affectedCount+closedCount>0&&accessibleCount>0?"observed_fragile":"indeterminate";
  return {possibilityId:node.id,observations,accessibleCount,affectedCount,closedCount,unknownCount,classification};
 });
 return {graph,scenarios:cases.map(s=>s.id),possibilities,boundary:"STRUCTURAL_SCENARIO_EXPLORATION_NOT_PROBABILITY"};
}
