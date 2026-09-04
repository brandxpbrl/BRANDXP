import type {KnowledgeDomain} from "./knowledge-fabric";

export type McosBridgeState="UNCONFIGURED"|"CONNECTING"|"AVAILABLE"|"UNREACHABLE";

export type McosLiteraryResponse={
 status:string;
 adapter:{name:string;version:string;mode:string;full_mcos_pipeline_active:boolean};
 analysis:{
  objects:{main_object:string;secondary_objects:string[]};
  embodiment:{body_signals:string[];physical_reaction:string};
  narrative:{hidden_question:string;dominant_symbol:string;themes:string[]};
  diagnostics:{body_rule_score:number;show_vs_tell_score:number;hidden_question_presence:number;method:string};
  knowledge_context:Record<string,unknown>[];
 };
 blueprint:Record<string,unknown>;
 provenance:{source:string;status:string}[];
 readiness:{ready_for_scene_dna:boolean;ready_for_full_mcos:boolean;missing:string[]};
 boundaries:string[];
};

const base=(process.env.NEXT_PUBLIC_MPE_BACKEND_URL??"").replace(/\/$/,"");

export function mcosBridgeConfigured(){return Boolean(base)}

export async function analyzeWithMcos(text:string,domains:KnowledgeDomain[]):Promise<McosLiteraryResponse>{
 if(!base)throw new Error("MCOS_BACKEND_UNCONFIGURED");
 const response=await fetch(`${base}/api/mcos/literary/analyze`,{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({
   text,
   source:"MPE_LITERATURE_UI",
   knowledge_context:domains.map(domain=>({source:domain.source,status:"INDEXED_METADATA",domain:domain.id,document_count:domain.documentCount})),
  }),
 });
 if(!response.ok)throw new Error(`MCOS_HTTP_${response.status}`);
 return response.json() as Promise<McosLiteraryResponse>;
}

export const MCOS_BRIDGE_BOUNDARY="REMOTE_MCOS_RESULT_REQUIRES_OBSERVABLE_BACKEND" as const;
