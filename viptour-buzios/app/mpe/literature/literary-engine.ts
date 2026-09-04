export type LiteraryEpistemicStatus = "SOURCE" | "CANON" | "OBSERVATION" | "PROPOSED" | "UNKNOWN";

export type NarrativeState = {
  id: string;
  sourceText: string;
  objective: string;
  characters: string[];
  locations: string[];
  objects: string[];
  openThreads: string[];
  themes: string[];
  symbols: string[];
  bodySignals: string[];
  hiddenQuestion: string;
  provenance: { source: string; status: LiteraryEpistemicStatus }[];
};

export type NarrativePossibility = {
  id: string;
  title: string;
  transformation: string;
  changes: string[];
  status: "candidate" | "development" | "contradiction" | "novel";
  epistemicStatus: "PROPOSED";
};

export const LITERARY_BOUNDARIES = [
  "GENERATED_SCENE_IS_PROPOSED_NOT_CANON",
  "NARRATIVE_MEMORY_IS_CONTEXT_NOT_TRUTH",
  "STYLE_MATCH_IS_NOT_EVIDENCE",
  "STATE_TRANSITION_IS_EXPLORATORY_NOT_OBSERVED_REALITY",
] as const;

const unique=(values:string[])=>[...new Set(values.map(v=>v.trim()).filter(Boolean))];
const sentences=(text:string)=>text.split(/(?<=[.!?])\s+|\n+/).map(v=>v.trim()).filter(Boolean);
const words=(text:string)=>text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").match(/[a-z0-9]+/g)??[];

const BODY=["mano","manos","mirada","ojos","respira","respirar","pecho","espalda","cuello","cuerpo","camina","toca","sostiene","tension"];
const OBJECTS=["archivo","cuaderno","documento","espejo","hoja","papel","mesa","puerta","ventana","taza","lapiz","lampara","espiral"];
const LOCATIONS=["monsefu","buenos aires","brasil","habitacion","laboratorio","ciudad","calle","patio","playa","bosque"];
const THEMES=["memoria","identidad","posibilidad","persistencia","relacion","patron","lenguaje","traduccion","mundo","conciencia","evolucion"];

function contains(text:string,term:string){return text.includes(term.normalize("NFD").replace(/[\u0300-\u036f]/g,""));}
function extractTerms(text:string,terms:string[]){const normalized=words(text).join(" ");return unique(terms.filter(term=>contains(normalized,term)));}

export function buildNarrativeState(sourceText:string):NarrativeState{
  const clean=sourceText.trim();
  const bodySignals=extractTerms(clean,BODY);
  const objects=extractTerms(clean,OBJECTS);
  const locations=extractTerms(clean,LOCATIONS);
  const themes=extractTerms(clean,THEMES);
  const question=sentences(clean).find(s=>s.includes("?"))??"¿Qué cambia después de esta escena?";
  const seed=clean.slice(0,48).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"untitled";
  return {id:`narrative-${seed}`,sourceText:clean,objective:"Transformar el estado narrativo sin romper canon ni continuidad.",characters:[],locations,objects,openThreads:[question],themes,symbols:objects.slice(0,3),bodySignals,hiddenQuestion:question,provenance:[{source:"USER_TEXT",status:"SOURCE"}]};
}

export function generateNarrativePossibilities(state:NarrativeState):NarrativePossibility[]{
  const anchor=state.symbols[0]??state.objects[0]??"objeto central";
  const question=state.hiddenQuestion;
  return [
    {id:"reveal-partial",title:"Revelación parcial",transformation:`El personaje descubre sólo una parte de lo que ${anchor} implica.`,changes:["information_state","open_thread"],status:"development",epistemicStatus:"PROPOSED"},
    {id:"body-before-idea",title:"El cuerpo registra primero",transformation:"La consecuencia aparece físicamente antes de que el texto la interprete.",changes:["character_state","embodiment"],status:"development",epistemicStatus:"PROPOSED"},
    {id:"symbol-shift",title:"El símbolo cambia de función",transformation:`${anchor} reaparece, pero deja de significar lo mismo.`,changes:["symbol_state","reader_expectation"],status:"novel",epistemicStatus:"PROPOSED"},
    {id:"contradict-assumption",title:"Contradecir una certeza",transformation:`La escena introduce evidencia narrativa que tensiona: ${question}`,changes:["belief_state","relationship_or_world_state"],status:"contradiction",epistemicStatus:"PROPOSED"},
  ];
}

export function transitionNarrativeState(state:NarrativeState,possibility:NarrativePossibility):NarrativeState{
  return {...state,id:`${state.id}-${possibility.id}`,openThreads:unique([...state.openThreads,`Consecuencia pendiente: ${possibility.transformation}`]),provenance:[...state.provenance,{source:`GENERATED:${possibility.id}`,status:"PROPOSED"}]};
}
