import type { PossibilityGraph } from "./model";
import type { ScenarioPersistenceReport } from "./scenario-persistence";

export type TemporalObservationState = "accessible" | "fragile" | "closed" | "indeterminate" | "unobserved";
export type TemporalSnapshot = {
  id:string;
  capturedAt:string;
  graphRootStateId:string;
  possibilityCount:number;
  relationCount:number;
  observations:Array<{ possibilityId:string; state:TemporalObservationState; source:"scenario_persistence"|"graph_only"; note:string }>;
};
export type PossibilityTrajectory = {
  possibilityId:string;
  sequence:Array<{ snapshotId:string; capturedAt:string; state:TemporalObservationState; note:string }>;
  historicalPattern:"historically_persistent"|"historically_variable"|"historically_closed"|"insufficient_history";
};
export type TemporalMemory = { sessionKey:string; snapshots:TemporalSnapshot[]; trajectories:PossibilityTrajectory[]; boundary:"HISTORY_IS_OBSERVATION_NOT_PREDICTION" };

const mapPersistence=(classification:string):TemporalObservationState=>classification==="observed_persistent"?"accessible":classification==="observed_fragile"?"fragile":classification==="observed_closed"?"closed":"indeterminate";

export function captureTemporalSnapshot(graph:PossibilityGraph,persistence:ScenarioPersistenceReport|null,index:number):TemporalSnapshot{
 const byId=new Map((persistence?.possibilities??[]).map(p=>[p.possibilityId,p]));
 return {id:`snapshot-${index+1}`,capturedAt:new Date().toISOString(),graphRootStateId:graph.rootStateId,possibilityCount:graph.nodes.length,relationCount:graph.edges.length,observations:graph.nodes.map(node=>{const p=byId.get(node.id);return p?{possibilityId:node.id,state:mapPersistence(p.classification),source:"scenario_persistence" as const,note:`Clasificación descriptiva: ${p.classification}.`}:{possibilityId:node.id,state:"unobserved" as const,source:"graph_only" as const,note:"Existe en el grafo, pero este ciclo no tiene evaluación de persistencia."}})};
}

export function buildTemporalMemory(sessionKey:string,snapshots:TemporalSnapshot[]):TemporalMemory{
 const ids=Array.from(new Set(snapshots.flatMap(s=>s.observations.map(o=>o.possibilityId))));
 const trajectories=ids.map(possibilityId=>{const sequence=snapshots.flatMap(s=>{const o=s.observations.find(x=>x.possibilityId===possibilityId);return o?[{snapshotId:s.id,capturedAt:s.capturedAt,state:o.state,note:o.note}]:[]});const meaningful=sequence.filter(x=>x.state!=="unobserved");let historicalPattern:PossibilityTrajectory["historicalPattern"]="insufficient_history";if(meaningful.length>=2){const states=new Set(meaningful.map(x=>x.state));historicalPattern=states.size===1&&states.has("accessible")?"historically_persistent":states.size===1&&states.has("closed")?"historically_closed":"historically_variable"}return {possibilityId,sequence,historicalPattern}});
 return {sessionKey,snapshots,trajectories,boundary:"HISTORY_IS_OBSERVATION_NOT_PREDICTION"};
}

export function appendTemporalSnapshot(memory:TemporalMemory|null,graph:PossibilityGraph,persistence:ScenarioPersistenceReport|null,sessionKey:string):TemporalMemory{
 const snapshots=[...(memory?.snapshots??[]),captureTemporalSnapshot(graph,persistence,memory?.snapshots.length??0)];
 return buildTemporalMemory(sessionKey,snapshots);
}
