"use client";

import { useMemo, useState } from "react";
import { useMpeRuntime } from "./MpeRuntimeContext";

type ObservedEvent = { type: string; source: string; subject: string | null };
type ObservedArtifact = { source_ref: string | null };

function interpretation(connected: boolean, services: number, events: ObservedEvent[], artifacts: ObservedArtifact[]) {
  if (!connected) return { status:"observando", headline:"El nodo físico está fuera de línea.", body:"El organismo web sigue disponible en modo autónomo. No presentaré actividad FaseOS/Earth como LIVE hasta recibir una fuente real.", action:"Podés explorar LAB, SOURCE y los demás órganos mientras el runtime local está desconectado." };
  const traceableArtifacts = artifacts.filter((artifact) => Boolean(artifact.source_ref)).length;
  const lineageIncomplete = artifacts.length > traceableArtifacts;
  const last=events.at(-1);
  if(last) return {
    status:"vivo",
    headline:`${last.type} detectado desde ${last.source}.`,
    body:`El runtime expone ${services} servicios, ${events.length} eventos y ${artifacts.length} artefactos. ${traceableArtifacts} artefactos exponen source_ref${lineageIncomplete ? "; el lineage está incompleto." : "; el lineage expuesto está completo en esta lectura."}`,
    action:last.subject?`El último evento referencia ${last.subject}. Seguí EVENT → ARTIFACT y verificá source_ref antes de asumir linaje.`:"Seguí EVENT → ARTIFACT y verificá source_ref antes de asumir linaje."
  };
  return { status:"vivo", headline:"El núcleo runtime está conectado.", body:`Hay ${services} servicios expuestos, pero todavía no recibí una colección de eventos reconocible.`, action:"El sistema permanece en observación sin inventar actividad." };
}

export default function MpeEntityObserverMax() {
  const { probe }=useMpeRuntime(); const [open,setOpen]=useState(true);
  const connected=probe?.connected===true, normalized=probe?.normalized||{services:[],events:[],artifacts:[]};
  const traceableArtifacts=normalized.artifacts.filter((artifact)=>Boolean(artifact.source_ref)).length;
  const lineageIncomplete=normalized.artifacts.length>traceableArtifacts;
  const message=useMemo(()=>interpretation(connected,normalized.services.length,normalized.events,normalized.artifacts),[connected,normalized.services.length,normalized.events,normalized.artifacts]);
  if(!open) return <button onClick={()=>setOpen(true)} className="fixed bottom-5 right-5 z-50 rounded-full border border-fuchsia-300/25 bg-[#07101a]/95 px-4 py-3 text-xs font-medium text-fuchsia-100 shadow-2xl backdrop-blur-xl">MAX · OBSERVER</button>;
  return <aside className="fixed bottom-5 right-5 z-50 w-[min(390px,calc(100vw-2.5rem))] overflow-hidden rounded-3xl border border-fuchsia-300/20 bg-[#07101a]/95 shadow-2xl shadow-fuchsia-950/30 backdrop-blur-xl"><div className="flex items-start justify-between gap-4 border-b border-white/7 px-5 py-4"><div><div className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${connected?"bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,.8)]":"bg-amber-300/70"}`}/><h2 className="text-sm font-semibold">Entity Observer Max</h2><span className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] tracking-[0.14em] text-white/45">{message.status.toUpperCase()}</span></div><p className="mt-1 text-[10px] tracking-[0.12em] text-fuchsia-200/45">OBSERVA · INTERPRETA · GUÍA · NARRA</p></div><button onClick={()=>setOpen(false)} aria-label="Cerrar Observer Max" className="text-lg leading-none text-white/30 hover:text-white">×</button></div><div className="px-5 py-4"><p className="text-sm font-medium leading-5 text-white/85">{message.headline}</p><p className="mt-2 text-xs leading-5 text-white/52">{message.body}</p><div className="mt-4 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.025] p-3"><p className="text-[9px] tracking-[0.16em] text-cyan-200/45">NEXT OBSERVATION</p><p className="mt-1 text-xs leading-5 text-white/48">{message.action}</p></div><div className="mt-4 flex items-center justify-between gap-3 text-[10px] text-white/30"><span>{connected?(lineageIncomplete?"LIVE / LINEAGE INCOMPLETE":"LIVE / REAL SOURCE"):"AUTONOMOUS / NO LIVE CLAIM"}</span><span>{normalized.events.length} EVT · {traceableArtifacts}/{normalized.artifacts.length} ART+REF</span></div></div></aside>;
}
