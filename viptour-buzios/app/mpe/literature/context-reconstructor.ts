import type {NarrativeState} from "./literary-engine";
import {retrieveKnowledgeDomains,type KnowledgeRetrieval} from "./knowledge-fabric";
import {ENTITY_BIBLE_SOURCE_PRINCIPLES,type SourcePrinciple} from "./entity-bible-source";

export type ActiveKnowledgeContext={
 query:string;
 domains:KnowledgeRetrieval["matchedDomains"];
 principles:SourcePrinciple[];
 sourceCount:number;
 provenance:string[];
 status:"SOURCE_DERIVED_CONTEXT";
 boundaries:[
  "DOMAIN_MATCH_IS_NOT_SEMANTIC_DOCUMENT_RETRIEVAL",
  "SOURCE_PROJECTION_IS_NOT_FULL_DOCUMENT_TEXT",
  "CONTEXT_GUIDES_GENERATION_NOT_CANON"
 ];
};

const normalize=(value:string)=>value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim();
const terms=(value:string)=>new Set(normalize(value).split(/\s+/).filter(Boolean));

function principleScore(principle:SourcePrinciple,query:string,domains:string[]){
 const q=terms(query);
 const text=terms(principle.text);
 let score=0;
 for(const token of q) if(text.has(token)) score+=2;
 for(const source of principle.sources){const domain=source.split("/")[0];if(domains.includes(domain))score+=3;}
 return score;
}

export function reconstructNarrativeContext(state:NarrativeState,limit=5):ActiveKnowledgeContext{
 const query=[state.sourceText,state.hiddenQuestion,...state.themes,...state.symbols,...state.bodySignals,...state.openThreads].join(" ");
 const retrieval=retrieveKnowledgeDomains(query,6);
 const domainIds=retrieval.matchedDomains.map(domain=>domain.id);
 const ranked=ENTITY_BIBLE_SOURCE_PRINCIPLES.map(principle=>({principle,score:principleScore(principle,query,domainIds)}))
  .sort((a,b)=>b.score-a.score)
  .filter(item=>item.score>0)
  .slice(0,limit)
  .map(item=>item.principle);
 const principles=ranked.length?ranked:ENTITY_BIBLE_SOURCE_PRINCIPLES.filter(item=>["network-intelligence","cross-reference-before-output","narrative-translation"].includes(item.id));
 const provenance=[...new Set(principles.flatMap(item=>item.sources))];
 return {
  query,
  domains:retrieval.matchedDomains,
  principles,
  sourceCount:provenance.length,
  provenance,
  status:"SOURCE_DERIVED_CONTEXT",
  boundaries:["DOMAIN_MATCH_IS_NOT_SEMANTIC_DOCUMENT_RETRIEVAL","SOURCE_PROJECTION_IS_NOT_FULL_DOCUMENT_TEXT","CONTEXT_GUIDES_GENERATION_NOT_CANON"],
 };
}
