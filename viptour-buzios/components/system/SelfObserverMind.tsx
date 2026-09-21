"use client";

import {useEffect,useRef} from "react";
import {usePathname} from "next/navigation";
import {MPE_FOUNDATION,relevantTheories,theoryLens} from "./selfObserverKnowledge";

type MemoryEntry={ts:number;path:string;type:string;text:string;source:string;theories:string[]};
type LearningState={routeVisits:Record<string,number>;conceptFrequency:Record<string,number>};

type ObserverPacket={observed?:string[];interpreted?:string[];proposed?:string[];unknown?:string[];provenance?:string[];source?:string};

const MEMORY_KEY="mpe:self-observer-memory:v1";
const LEARNING_KEY="mpe:self-observer-learning:v1";
const MAX_MEMORY=180;
const clean=(v:string|null|undefined)=>(v??"").replace(/\s+/g," ").trim();
const short=(v:string,max=420)=>{const t=clean(v);return t.length>max?`${t.slice(0,max-1)}…`:t};
const norm=(v:string)=>clean(v).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim();

function readJson<T>(key:string,fallback:T):T{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw) as T:fallback}catch{return fallback}}
function writeJson(key:string,value:unknown){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}

function compactMemory(entries:MemoryEntry[]){
  const seen=new Set<string>();
  const compacted:MemoryEntry[]=[];
  for(const entry of [...entries].sort((a,b)=>b.ts-a.ts)){
    const sig=`${entry.path}|${entry.type}|${norm(entry.text).slice(0,180)}`;
    if(!entry.text||seen.has(sig))continue;
    seen.add(sig);compacted.push({...entry,text:short(entry.text,420)});
    if(compacted.length>=MAX_MEMORY)break;
  }
  return compacted.sort((a,b)=>a.ts-b.ts);
}

function conceptTokens(text:string){
  const stop=new Set(["para","como","este","esta","esto","with","from","that","this","aqui","uma","the","and","del","las","los","una","uno","por","que","mais","mais","into","your","you","are"]);
  return norm(text).split(" ").filter(t=>t.length>=5&&!stop.has(t)).slice(0,18);
}

function remember(entry:MemoryEntry){
  const current=readJson<MemoryEntry[]>(MEMORY_KEY,[]);
  writeJson(MEMORY_KEY,compactMemory([...current,entry]));
}

function learn(path:string,text:string){
  const state=readJson<LearningState>(LEARNING_KEY,{routeVisits:{},conceptFrequency:{}});
  state.routeVisits[path]=(state.routeVisits[path]??0)+1;
  for(const token of conceptTokens(text))state.conceptFrequency[token]=(state.conceptFrequency[token]??0)+1;
  const ordered=Object.entries(state.conceptFrequency).sort((a,b)=>b[1]-a[1]).slice(0,120);
  state.conceptFrequency=Object.fromEntries(ordered);
  writeJson(LEARNING_KEY,state);
  return state;
}

function emit(packet:ObserverPacket){window.dispatchEvent(new CustomEvent<ObserverPacket>("mpe:self-observer",{detail:packet}))}

export default function SelfObserverMind(){
  const pathname=usePathname();
  const narratedRoutes=useRef(new Set<string>());

  useEffect(()=>{
    const onPacket=(event:Event)=>{
      const packet=(event as CustomEvent<ObserverPacket>).detail??{};
      const source=packet.source??packet.provenance?.[0]??"DECLARED_PACKET";
      if(source.startsWith("SELF_OBSERVER_MIND"))return;
      const text=packet.observed?.[0]??packet.interpreted?.[0]??packet.proposed?.[0]??packet.unknown?.[0]??"";
      if(!text)return;
      const theories=relevantTheories(text).map(t=>t.id);
      remember({ts:Date.now(),path:location.pathname,type:"packet",text,source,theories});
      learn(location.pathname,text);
    };
    window.addEventListener("mpe:self-observer",onPacket as EventListener);
    return()=>window.removeEventListener("mpe:self-observer",onPacket as EventListener);
  },[]);

  useEffect(()=>{
    const onClick=(event:MouseEvent)=>{
      const target=(event.target as HTMLElement|null)?.closest<HTMLElement>("a,button");
      if(!target)return;
      const text=short(target.innerText||target.getAttribute("aria-label")||"",180);
      if(!text)return;
      const href=target instanceof HTMLAnchorElement?target.getAttribute("href")??"":"";
      const payload=`${text}${href?` → ${href}`:""}`;
      const theories=relevantTheories(payload).map(t=>t.id);
      remember({ts:Date.now(),path:location.pathname,type:"interaction",text:payload,source:"USER_INTERFACE_INTERACTION",theories});
      learn(location.pathname,payload);
    };
    document.addEventListener("click",onClick,{capture:true});
    return()=>document.removeEventListener("click",onClick,{capture:true});
  },[]);

  useEffect(()=>{
    const timer=window.setTimeout(()=>{
      if(narratedRoutes.current.has(pathname))return;
      narratedRoutes.current.add(pathname);
      const main=document.querySelector<HTMLElement>("main");
      const visible=short(main?.innerText||document.body.innerText||"",1800);
      const theories=relevantTheories(`${pathname} ${visible}`,3);
      const learning=learn(pathname,visible);
      const memory=readJson<MemoryEntry[]>(MEMORY_KEY,[]);
      const routeCount=memory.filter(m=>m.path===pathname).length;
      const topConcepts=Object.entries(learning.conceptFrequency).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([k])=>k);
      const lens=theories[0]?theoryLens(theories[0]):MPE_FOUNDATION.statement;
      remember({ts:Date.now(),path:pathname,type:"route_state",text:visible,source:"SELF_OBSERVER_MIND_VISIBLE_STATE",theories:theories.map(t=>t.id)});
      emit({
        interpreted:[`Estoy integrando este espacio con mi memoria de navegación. En esta ruta ya registré ${routeCount} eventos observables. La lente activa es: ${lens}${topConcepts.length?` Los conceptos que más se repiten en mi memoria reciente son ${topConcepts.join(", ")}.`:""}`],
        provenance:["VISIBLE_SITE_STATE","BROWSER_LOCAL_MEMORY","MPE_THEORY_REGISTRY"],
        source:`SELF_OBSERVER_MIND · ${pathname}`,
      });
      window.dispatchEvent(new CustomEvent("mpe:self-observer-mind-state",{detail:{pathname,memorySize:memory.length,theories:theories.map(t=>t.id),topConcepts,boundaries:["MEMORY_IS_LOCAL_OBSERVATION_NOT_TRUTH","LEARNING_CHANGES_ATTENTION_NOT_EPISTEMIC_STATUS","THEORY_GUIDES_INTERPRETATION_NOT_PROOF","MEMORY_COMPACTION_PRESERVES_RECENT_PROVENANCE"]}}));
    },1850);
    return()=>window.clearTimeout(timer);
  },[pathname]);

  return null;
}
