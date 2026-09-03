import Link from "next/link";
import MpeEntityObserverMax from "../MpeEntityObserverMax";
import MpeInterfaceFrame from "../MpeInterfaceFrame";
import MpeOrganSourceSurface from "../MpeOrganSourceSurface";

const groups = [
  { label: "WORKING MEMORY", keys: ["working_memory", "memory", "active_memory", "context"] },
  { label: "EVENT LOG", keys: ["events", "event_log", "kernel_events", "episodes"] },
  { label: "EXPERIMENT MEMORY", keys: ["experiments", "experiment_memory", "runs", "replays"] },
  { label: "EPISTEMIC / ARTIFACT INDEX", keys: ["claims", "epistemic_memory", "artifacts", "artifact_index"] },
];

const layers = [
  ["WORKING MEMORY", "contexto activo", "Mantiene lo que el organismo necesita ahora."],
  ["EVENT LOG", "append-only", "Preserva secuencias observadas sin reescribir la historia."],
  ["EXPERIMENT MEMORY", "runs + replay", "Conecta hipótesis, ejecuciones, métricas y artefactos."],
  ["EPISTEMIC MEMORY", "claims + status", "Recuerda qué se sabe, qué se propone y con qué evidencia."],
  ["HERITAGE", "promoted structures", "Sólo conserva como herencia lo que supera criterios explícitos."],
];

export default function MpeMemoryPage() {
  return (
    <MpeInterfaceFrame active="MEMORY">
      <MpeEntityObserverMax />
      <main className="px-4 py-5 sm:px-6">
        <section className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#07101b]/55 p-6 sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(139,92,246,.13),transparent_30%),radial-gradient(circle_at_28%_85%,rgba(34,211,238,.07),transparent_28%)]" />
          <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1fr)_430px] xl:items-center">
            <div><p className="text-[9px] tracking-[0.22em] text-violet-200/45">MEMORY · ADAPTIVE FABRIC</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Memoria sin confundir recuerdo con verdad</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-white/40">MPE separa contexto, historia, experimentos, claims y herencia. Recordar sirve para evolucionar; provenance impide que el recuerdo se transforme en evidencia por repetición.</p><div className="mt-5 flex flex-wrap gap-2"><Link href="/mpe/heritage" className="rounded-xl border border-violet-300/20 px-3 py-2 text-[10px] text-violet-100">HERITAGE</Link><Link href="/mpe/source" className="rounded-xl border border-cyan-300/20 px-3 py-2 text-[10px] text-cyan-100">SOURCE</Link></div></div>
            <div className="relative mx-auto h-[270px] w-full max-w-[430px]">{layers.map(([name,kind],index)=><div key={name} className="absolute left-1/2 w-[82%] -translate-x-1/2 rounded-2xl border border-violet-300/10 bg-[#080c18]/90 px-4 py-3 shadow-[0_18px_50px_rgba(0,0,0,.22)]" style={{top:`${index*43}px`,transform:`translateX(-50%) scale(${1-index*0.035})`,opacity:1-index*0.08}}><div className="flex items-center justify-between gap-3"><span className="text-[9px] tracking-[0.13em] text-violet-100/60">{name}</span><span className="text-[8px] text-white/22">{kind}</span></div></div>)}</div>
          </div>
        </section>

        <section className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">{layers.map(([name,kind,desc])=><article key={name} className="rounded-2xl border border-white/[0.07] bg-[#07101b]/45 p-4"><p className="text-[9px] tracking-[0.15em] text-violet-200/45">{name}</p><p className="mt-2 text-[10px] text-white/28">{kind}</p><p className="mt-3 text-[10px] leading-5 text-white/38">{desc}</p></article>)}</section>

        <section className="mt-5 rounded-2xl border border-white/[0.07] bg-[#07101b]/45 p-5"><div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-[9px] tracking-[0.2em] text-violet-200/45">OBSERVED MEMORY</p><h2 className="mt-1 text-xl font-semibold">Memory surface</h2><p className="mt-1 text-xs text-white/32">Datos sólo desde adapters observables; sin memoria simulada presentada como runtime.</p></div><span className="rounded-lg border border-white/10 px-2 py-1 text-[8px] tracking-[0.12em] text-white/30">READ ONLY</span></div><MpeOrganSourceSurface apiPath="/api/mpe/memory" organ="MEMORY" title="Memory surface" description="Separa memoria operacional, eventos, experimentos y referencias epistemológicas. El olvido selectivo nunca reemplaza provenance ni evidencia primaria." groups={groups} /></section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]"><div className="rounded-2xl border border-white/[0.07] bg-[#07101b]/45 p-5"><p className="text-[9px] tracking-[0.18em] text-cyan-200/40">MEMORY FLOW</p><div className="mt-4 flex flex-wrap items-center gap-2">{["EVENT","WORKING","EPISODE","EPISTEMIC","HERITAGE"].map((item,index)=><span key={item} className="flex items-center gap-2"><span className="rounded-lg border border-white/10 px-3 py-2 text-[9px] text-white/48">{item}</span>{index<4?<b className="text-violet-300/25">→</b>:null}</span>)}</div></div><div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.025] p-5"><p className="text-[9px] tracking-[0.18em] text-amber-200/45">FORGETTING LAW</p><p className="mt-3 text-[10px] leading-5 text-white/38">Olvidar puede compactar o depriorizar memoria operativa. Nunca debe borrar evidencia primaria ni romper provenance.</p></div></section>
      </main>
    </MpeInterfaceFrame>
  );
}
