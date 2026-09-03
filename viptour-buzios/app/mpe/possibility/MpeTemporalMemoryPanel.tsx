"use client";
import {useEffect,useMemo,useState} from "react";
import type {PossibilityGraph} from "../possibility-engine/model";
import type {ScenarioPersistenceReport} from "../possibility-engine/scenario-persistence";
import {appendTemporalSnapshot,buildTemporalMemory,type TemporalMemory} from "../possibility-engine/temporal-memory";

export default function MpeTemporalMemoryPanel({graph,persistence,activeId}:{graph:PossibilityGraph|null;persistence:ScenarioPersistenceReport|null;activeId?:string}){
 const sessionKey=graph?`mpe-temporal:${graph.rootStateId}`:"mpe-temporal:idle";
 const [memory,setMemory]=useState<TemporalMemory|null>(null);
 useEffect(()=>{if(!graph){setMemory(null);return}try{const raw=localStorage.getItem(sessionKey);if(raw){const parsed=JSON.parse(raw) as TemporalMemory;setMemory(buildTemporalMemory(sessionKey,parsed.snapshots??[]))}else setMemory(null)}catch{setMemory(null)}},[graph,sessionKey]);
 const activeTrajectory=useMemo(()=>memory?.trajectories.find(t=>t.possibilityId===activeId),[memory,activeId]);
 const capture=()=>{if(!graph)return;const next=appendTemporalSnapshot(memory,graph,persistence,sessionKey);setMemory(next);localStorage.setItem(sessionKey,JSON.stringify(next))};
 const clear=()=>{localStorage.removeItem(sessionKey);setMemory(null)};
 return <div className="mt-3 rounded-2xl border border-violet-300/10 bg-violet-300/[.025] p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-[9px] tracking-[.14em] text-violet-100/50">TEMPORAL MEMORY</p><p className="mt-1 text-[10px] text-white/30">P(t₀) → P(t₁) → P(t₂)</p></div><span className="text-[9px] text-white/25">{memory?.snapshots.length??0} CICLOS</span></div><button disabled={!graph} onClick={capture} className="mt-3 w-full rounded-xl border border-violet-300/20 bg-violet-300/[.05] px-3 py-2 text-[9px] tracking-[.12em] text-violet-100/70 disabled:opacity-30">REGISTRAR CICLO</button>{activeTrajectory?<div className="mt-3 border-t border-white/[.06] pt-3"><p className="text-[9px] text-violet-100/55">{activeTrajectory.historicalPattern.replaceAll("_"," ").toUpperCase()}</p><div className="mt-2 flex flex-wrap gap-1">{activeTrajectory.sequence.map(step=><span key={`${step.snapshotId}-${step.capturedAt}`} title={step.note} className="rounded-full border border-white/[.08] px-2 py-1 text-[8px] text-white/40">{step.snapshotId.replace("snapshot-","t")} · {step.state.toUpperCase()}</span>)}</div></div>:<p className="mt-3 text-[9px] leading-4 text-white/25">Seleccioná una posibilidad y registrá ciclos para construir su trayectoria.</p>}{memory?.snapshots.length?<button onClick={clear} className="mt-3 text-[8px] text-white/25">BORRAR MEMORIA LOCAL</button>:null}<p className="mt-3 text-[8px] leading-4 text-white/20">Historia observada ≠ predicción. Guardado local en este navegador.</p></div>
}
