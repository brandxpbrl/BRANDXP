export type TheoryStatus="FOUNDATIONAL"|"SOURCE_REGISTERED"|"SOURCE_REQUIRED";

export type MpeTheory={
  id:string;
  name:string;
  status:TheoryStatus;
  statement?:string;
  formulas?:string[];
  keywords:string[];
  boundary:string;
};

export const MPE_FOUNDATION={
  id:"MPE-FOUNDATION",
  statement:"La evolución no maximiza complejidad. La evolución no maximiza información. La evolución maximiza posibilidades viables.",
  boundary:"FOUNDATIONAL_SOURCE_IS_NOT_EMPIRICAL_PROOF",
};

export const MPE_THEORIES:MpeTheory[]=[
  {id:"MPE-THE-001",name:"Theory of Difference",status:"SOURCE_REQUIRED",keywords:["difference","diferencia","delta","variation","variacion"],boundary:"TITLE_REGISTERED_FULL_SOURCE_TEXT_NOT_YET_LOADED"},
  {id:"MPE-THE-002",name:"Theory of Evolutionary Code",status:"SOURCE_REQUIRED",keywords:["code","codigo","evolutionary","evolutivo","inheritance","herencia"],boundary:"TITLE_REGISTERED_FULL_SOURCE_TEXT_NOT_YET_LOADED"},
  {id:"MPE-THE-003",name:"Theory of Persistent Geometry",status:"SOURCE_REQUIRED",keywords:["geometry","geometria","persistent","persistente","form","forma","structure","estructura"],boundary:"TITLE_REGISTERED_FULL_SOURCE_TEXT_NOT_YET_LOADED"},
  {id:"MPE-THE-004",name:"Theory of Meta-Emergence",status:"SOURCE_REQUIRED",keywords:["emergence","emergencia","meta","organization","organizacion"],boundary:"TITLE_REGISTERED_FULL_SOURCE_TEXT_NOT_YET_LOADED"},
  {id:"MPE-THE-005",name:"Theory of Intelligence",status:"FOUNDATIONAL",statement:"Capacidad de un sistema para generar, explorar, seleccionar y sostener posibilidades viables.",keywords:["intelligence","inteligencia","generate","generar","explore","explorar","select","seleccionar","sustain","sostener","possibility","posibilidad"],boundary:"THEORY_IS_A_FRAMEWORK_NOT_EMPIRICAL_PROOF"},
  {id:"MPE-THE-006",name:"Theory of Viable Possibilities",status:"FOUNDATIONAL",statement:"La evolución puede analizarse como cambio en posibilidades viables y futuros sostenibles.",formulas:["PVV = Σ(Δf)","FV = D' × R × H","APV = (PVV(t+1)-PVV(t))/PVV(t)"],keywords:["viable","viable","possibility","posibilidad","future","futuro","pvv","fv","apv","constraint","restriccion"],boundary:"FORMULAS_ARE_CANONICAL_MPE_METRICS_NOT_UNIVERSAL_SCORES"},
  {id:"MPE-THE-007",name:"Theory of Adaptive Recovery",status:"SOURCE_REGISTERED",statement:"La recuperación adaptativa estudia cómo un sistema conserva o reconstruye organización después de perturbaciones.",keywords:["recovery","recuperacion","adaptive","adaptativa","perturbation","perturbacion","resilience","resiliencia","memory","memoria"],boundary:"INTERNAL_THEORY_AND_EXPERIMENTAL_CONTEXT_NOT_CLINICAL_OR_EXTERNAL_PROOF"},
];

const normalize=(value:string)=>value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");

export function relevantTheories(text:string,limit=3){
  const blob=normalize(text);
  return MPE_THEORIES.map(theory=>({theory,score:theory.keywords.reduce((n,k)=>n+(blob.includes(normalize(k))?1:0),0)}))
    .filter(item=>item.score>0)
    .sort((a,b)=>b.score-a.score)
    .slice(0,limit)
    .map(item=>item.theory);
}

export function theoryLens(theory:MpeTheory){
  if(theory.statement)return `${theory.id} · ${theory.name}: ${theory.statement}`;
  return `${theory.id} · ${theory.name}: teoría registrada; el texto fuente completo todavía debe cargarse antes de usarla como lente semántica profunda.`;
}
