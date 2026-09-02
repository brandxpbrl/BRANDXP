import Link from "next/link";
import MpeOrganSourceSurface from "../MpeOrganSourceSurface";
import MpeEntityObserverMax from "../MpeEntityObserverMax";
import MpeInterfaceFrame from "../MpeInterfaceFrame";

const groups = [
  { label: "POPULATIONS", keys: ["populations", "species", "individuals", "variants"] },
  { label: "VIABILITY", keys: ["viability", "viability_scores", "fitness", "future_possibility_index", "fpi"] },
  { label: "SELECTION / DISCOVERY", keys: ["selection", "selected", "discoveries", "discovery_candidates", "candidates"] },
  { label: "RECOVERY / LINEAGE", keys: ["recovery", "recovery_events", "lineage", "lineages", "heritage_candidates"] },
];

export default function MpeEvolutionPage() {
  return <MpeInterfaceFrame active="EVOLUTION"><MpeEntityObserverMax/><main className="px-4 py-5 sm:px-6">
    <section className="relative overflow-hidden rounded-[28px] border border-fuchsia-300/10 bg-[#07101b]/55 p-6 sm:p-8"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_35%,rgba(217,70,239,.11),transparent_34%),radial-gradient(circle_at_35%_70%,rgba(34,211,238,.06),transparent_30%)]"/><div className="relative grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-center"><div><p className="text-[9px] tracking-[0.22em] text-fuchsia-200/45">EVOLUTION · POSSIBILITY ENGINE</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Poblaciones, viabilidad y futuros posibles</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-white/40">La interfaz conserva las familias métricas de cada motor. No existe un MPE SCORE único: selección, FPI, recovery y discovery mantienen su contexto.</p><div className="mt-5 flex gap-2"><Link href="/mpe/geometry" className="rounded-xl border border-cyan-300/20 px-3 py-2 text-[10px] text-cyan-100">GEOMETRY</Link><Link href="/mpe/heritage" className="rounded-xl border border-amber-300/20 px-3 py-2 text-[10px] text-amber-100">HERITAGE</Link></div></div><div className="relative h-56 overflow-hidden rounded-2xl border border-fuchsia-300/10 bg-black/15"><div className="absolute left-[18%] top-[45%] h-3 w-3 rounded-full bg-cyan-200/50 shadow-[0_0_28px_rgba(34,211,238,.5)]"/><div className="absolute left-[42%] top-[28%] h-4 w-4 rounded-full bg-fuchsia-200/55 shadow-[0_0_35px_rgba(217,70,239,.5)]"/><div className="absolute left-[65%] top-[60%] h-2 w-2 rounded-full bg-white/45"/><div className="absolute left-[78%] top-[35%] h-5 w-5 rounded-full border border-fuchsia-200/30"/><svg className="absolute inset-0 h-full w-full opacity-25" viewBox="0 0 400 220"><path d="M70 100 C140 20 220 170 325 75" fill="none" stroke="currentColor" strokeWidth="1"/><path d="M70 100 C160 190 240 30 325 75" fill="none" stroke="currentColor" strokeWidth="1"/></svg><p className="absolute bottom-4 left-4 text-[9px] tracking-[0.18em] text-white/25">POSSIBILITY SPACE · OBSERVED WHEN SOURCED</p></div></div></section>
    <section className="mt-5 rounded-2xl border border-white/[0.07] bg-[#07101b]/45 p-5"><MpeOrganSourceSurface apiPath="/api/mpe/evolution" organ="EVOLUTION" title="Evolution surface" description="Observa poblaciones, viabilidad, selección, discovery, recovery y lineage sin imponer una métrica única ni reescribir los motores existentes." groups={groups}/></section>
  </main></MpeInterfaceFrame>;
}
