export type KnowledgeDomainStatus = "INDEXED_METADATA" | "UNOBSERVED";

export type KnowledgeDomain = {
  id: string;
  documentCount: number;
  source: string;
  tags: string[];
  status: KnowledgeDomainStatus;
};

export type KnowledgeRetrieval = {
  query: string;
  matchedDomains: KnowledgeDomain[];
  documentCount: number;
  boundary: "DOMAIN_MATCH_IS_NOT_SEMANTIC_DOCUMENT_RETRIEVAL";
};

export const ENTITY_BIBLE_MANIFEST = {
  source: "ENTITY_BIBLE.zip",
  sourceKind: "USER_SUPPLIED_ARCHIVE",
  totalDocuments: 222,
  totalDomains: 30,
  networkDocument: "ENTITY_BIBLE/KNOWLEDGE_NETWORK.md",
  status: "INDEXED_METADATA" as const,
  boundary: "INDEXED_METADATA_IS_NOT_LIVE_SEMANTIC_RETRIEVAL" as const,
};

export const ENTITY_BIBLE_DOMAINS: KnowledgeDomain[] = [
  ["aesthetics",6,["aesthetic","visual","style","beauty"]],
  ["archetypes",6,["archetype","character","role","identity"]],
  ["atmospheres",6,["atmosphere","environment","mood","scene"]],
  ["audience_psychology",6,["audience","reader","psychology","attention"]],
  ["cinematic",6,["cinematic","camera","scene","film"]],
  ["communication",6,["communication","voice","dialogue","message"]],
  ["emotional_intelligence",6,["emotion","empathy","relationship","character"]],
  ["emotional_triggers",6,["emotion","trigger","tension","attention"]],
  ["entity_detection",14,["entity","identity","voice","symbol","archetype"]],
  ["entity_models",6,["entity","model","identity","character"]],
  ["examples",6,["example","pattern","reference"]],
  ["forbidden_patterns",6,["forbidden","avoid","cliche","risk","restriction"]],
  ["frameworks",6,["framework","structure","system","method"]],
  ["luxury",14,["luxury","premium","silence","minimalism","value"]],
  ["memory",6,["memory","continuity","recall","history","canon"]],
  ["narrative_architecture",6,["narrative","story","scene","chapter","arc","structure"]],
  ["perception",14,["perception","attention","meaning","value","subconscious"]],
  ["perception_engineering",6,["perception","attention","design","control"]],
  ["philosophy",14,["philosophy","meaning","identity","principle"]],
  ["premium_positioning",6,["premium","positioning","value","identity"]],
  ["prompts",6,["prompt","instruction","generation"]],
  ["psychology",6,["psychology","behavior","emotion","mind"]],
  ["rhythm",6,["rhythm","cadence","pause","silence","tempo"]],
  ["social_media",6,["social","content","attention","platform"]],
  ["storytelling",6,["storytelling","story","conflict","scene","character"]],
  ["symbols",6,["symbol","metaphor","meaning","object"]],
  ["systems",6,["system","relation","structure","network"]],
  ["transformation",6,["transformation","change","state","evolution","consequence"]],
  ["visual_direction",6,["visual","direction","scene","composition"]],
  ["visual_psychology",14,["visual","psychology","contrast","color","composition","focus"]],
].map(([id,documentCount,tags])=>({id:id as string,documentCount:documentCount as number,source:`ENTITY_BIBLE/${id}`,tags:tags as string[],status:"INDEXED_METADATA"}));

const normalize=(value:string)=>value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim();

export function retrieveKnowledgeDomains(query:string,limit=6):KnowledgeRetrieval{
  const tokens=new Set(normalize(query).split(/\s+/).filter(Boolean));
  const ranked=ENTITY_BIBLE_DOMAINS.map(domain=>{
    const score=domain.tags.reduce((sum,tag)=>{
      const normalizedTag=normalize(tag);
      if(tokens.has(normalizedTag)) return sum+3;
      const related=[...tokens].some(token=>normalizedTag.includes(token)||token.includes(normalizedTag));
      return sum+(related?1:0);
    },0);
    return {domain,score};
  }).filter(item=>item.score>0).sort((a,b)=>b.score-a.score||b.domain.documentCount-a.domain.documentCount).slice(0,limit).map(item=>item.domain);
  const fallback=["narrative_architecture","storytelling","memory","symbols","rhythm","emotional_intelligence"].map(id=>ENTITY_BIBLE_DOMAINS.find(domain=>domain.id===id)!).filter(Boolean).slice(0,limit);
  const matchedDomains=ranked.length?ranked:fallback;
  return {query,matchedDomains,documentCount:matchedDomains.reduce((sum,item)=>sum+item.documentCount,0),boundary:"DOMAIN_MATCH_IS_NOT_SEMANTIC_DOCUMENT_RETRIEVAL"};
}
