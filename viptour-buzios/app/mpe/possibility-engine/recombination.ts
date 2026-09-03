import type { Possibility, PossibilityGraph, PossibilityOperator } from "./model";

export type RecombinantKind = "mutation" | "recombination";
export type RecombinantPossibility = { possibility:Possibility; kind:RecombinantKind; parentIds:string[] };
export type RecombinationResult = { graph:PossibilityGraph; generated:RecombinantPossibility[]; boundary:"NOVEL_STRUCTURE_IS_PROPOSED_NOT_EVIDENCE" };

const clone=(p:Possibility):Possibility=>({...p,parentPossibilityIds:[...p.parentPossibilityIds],childPossibilityIds:[...p.childPossibilityIds],operators:[...p.operators],sources:p.sources.map(s=>({...s})),assumptions:[...p.assumptions],dependencies:[...p.dependencies],supportsObjectiveIds:[...p.supportsObjectiveIds],contradictsConstraintIds:[...p.contradictsConstraintIds],viability:p.viability.map(v=>({...v,sourceRefs:[...v.sourceRefs]})),perturbationResults:p.perturbationResults.map(r=>({...r})),openedFutureIds:[...p.openedFutureIds],closedFutureIds:[...p.closedFutureIds],falsificationCriteria:p.falsificationCriteria.map(f=>({...f})),experiment:p.experiment?{...p.experiment}:undefined});
const uniq=<T,>(x:T[])=>Array.from(new Set(x));
const safe=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,28);
const opFor=(p:Possibility):PossibilityOperator=>p.operators.includes("experiment")?"mutate":p.operators.includes("combine")?"connect":"experiment";

function mutate(parent:Possibility,index:number):RecombinantPossibility{
 const op=opFor(parent),id=`mut-${safe(parent.id)}-${index+1}`;
 const possibility:Possibility={...clone(parent),id,title:`Mutación: ${parent.title}`,description:`Variación estructural de ${parent.id} que agrega el operador ${op} para explorar una vecindad distinta del espacio de posibilidades.`,parentPossibilityIds:[parent.id],childPossibilityIds:[],operators:uniq([...parent.operators,"mutate",op]),sources:[...parent.sources,{kind:"evolutionary",ref:`mutation:${parent.id}`,note:"Mutación estructural generada por MPE; no es evidencia de viabilidad."}],assumptions:[...parent.assumptions,"La nueva combinación de operadores todavía no fue evaluada."],epistemicStatus:"proposed",lifecycleStage:"generated",openedFutureIds:[],closedFutureIds:[],falsificationCriteria:[{id:`falsify-${id}`,claim:"La mutación mantiene compatibilidad estructural suficiente para justificar una prueba.",falsifiedBy:"Una evaluación contextual o experimento reproducible muestra incompatibilidad necesaria.",status:"untested"}],closedReason:undefined};
 return {possibility,kind:"mutation",parentIds:[parent.id]};
}

function recombine(a:Possibility,b:Possibility,index:number):RecombinantPossibility{
 const id=`rec-${safe(a.id)}-${safe(b.id)}-${index+1}`;
 const possibility:Possibility={...clone(a),id,title:`Recombinar: ${a.title} × ${b.title}`,description:`Descendiente que combina operadores, dependencias y supuestos de ${a.id} y ${b.id}. La recombinación expande el espacio explorado; no implica mejora.`,parentPossibilityIds:[a.id,b.id],childPossibilityIds:[],operators:uniq([...a.operators,...b.operators,"mutate"]),sources:[...a.sources,...b.sources,{kind:"evolutionary",ref:`recombination:${a.id}+${b.id}`,note:"Recombinación estructural; no es evidencia ni validación."}],assumptions:uniq([...a.assumptions,...b.assumptions,"La compatibilidad entre ambas ramas no fue demostrada."]),dependencies:uniq([...a.dependencies,...b.dependencies]),supportsObjectiveIds:uniq([...a.supportsObjectiveIds,...b.supportsObjectiveIds]),contradictsConstraintIds:uniq([...a.contradictsConstraintIds,...b.contradictsConstraintIds]),epistemicStatus:"proposed",lifecycleStage:"generated",openedFutureIds:[],closedFutureIds:[],falsificationCriteria:[{id:`falsify-${id}`,claim:"La recombinación conserva una ruta estructuralmente testable hacia el objetivo.",falsifiedBy:"Un stress test o experimento muestra que la combinación introduce una incompatibilidad necesaria.",status:"untested"}],experiment:undefined,closedReason:undefined};
 return {possibility,kind:"recombination",parentIds:[a.id,b.id]};
}

export function generateNovelStructures(graph:PossibilityGraph,maxGenerated=6):RecombinationResult{
 const parents=graph.nodes.filter(p=>p.lifecycleStage!=="rejected"&&!p.closedReason).slice(0,8);const generated:RecombinantPossibility[]=[];
 parents.slice(0,3).forEach((p,i)=>generated.push(mutate(p,i)));
 for(let i=0;i<parents.length-1&&generated.length<maxGenerated;i+=2)generated.push(recombine(parents[i],parents[i+1],i/2));
 const nextNodes=graph.nodes.map(clone);for(const g of generated){nextNodes.push(g.possibility);for(const parentId of g.parentIds){const parent=nextNodes.find(p=>p.id===parentId);if(parent){parent.childPossibilityIds=uniq([...parent.childPossibilityIds,g.possibility.id]);parent.openedFutureIds=uniq([...parent.openedFutureIds,g.possibility.id])}}}
 const edges=[...graph.edges.map(e=>({...e}))];for(const g of generated)for(const parentId of g.parentIds)edges.push({from:parentId,to:g.possibility.id,relation:"opens" as const});
 return {graph:{...graph,nodes:nextNodes,edges,exploration:{...graph.exploration,depth:graph.exploration.depth+1,generatedCount:nextNodes.length}},generated,boundary:"NOVEL_STRUCTURE_IS_PROPOSED_NOT_EVIDENCE"};
}
