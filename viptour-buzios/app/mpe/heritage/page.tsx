import Link from "next/link";
import MpeOrganSourceSurface from "../MpeOrganSourceSurface";
import MpeEntityObserverMax from "../MpeEntityObserverMax";
import MpeInterfaceFrame from "../MpeInterfaceFrame";

const groups = [
  { label: "PROMOTED RESULTS", keys: ["heritage", "promoted", "validated_results", "inherited_results"] },
  { label: "STRUCTURES", keys: ["structures", "persistent_structures", "codes", "geometries"] },
  { label: "EVIDENCE LINKS", keys: ["evidence", "evidence_refs", "sources", "claims"] },
  { label: "LINEAGE", keys: ["lineage", "lineages", "inheritance", "history"] },
];

export default function MpeHeritagePage() {
  return <MpeInterfaceFrame active="HERITAGE"><MpeEntityObserverMax/><main className="px-4 py-5 sm:px-6">
    <section className="relative overflow-hidden rounded-[28px] border border-amber-300/10 bg-[#07101b]/55 p-6 sm:p-8"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_30%,rgba(251,191,36,.10),transparent_34%)]"/><div className="relative grid gap-7 xl:grid-cols-[minmax(0,1fr)_360px]"><div><p className="text-[9px] tracking-[0.22em] text-amber-200/45">HERITAGE · PERSISTENT KNOWLEDGE</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Lo que el organismo decide conservar</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-white/40">Heritage no es historial bruto. Es promoción explícita de resultados, estructuras y relaciones que conservan evidencia y lineage.</p><div className="mt-5 flex gap-2"><Link href="/mpe/evolution" className="rounded-xl border border-fuchsia-300/20 px-3 py-2 text-[10px] text-fuchsia-100">EVOLUTION</Link><Link href="/mpe/source" className="rounded-xl border border-amber-300/20 px-3 py-2 text-[10px] text-amber-100">SOURCE</Link></div></div><div className="grid place-items-center rounded-2xl border border-amber-300/10 bg-black/15 p-6 text-center"><div className="grid h-28 w-28 place-items-center rounded-full border border-amber-200/15 bg-[radial-gradient(circle,rgba(251,191,36,.16),transparent_68%)]"><span className="text-3xl text-amber-100/65">H</span></div><p className="mt-4 text-[9px] tracking-[0.18em] text-amber-100/35">PROMOTION REQUIRES PROVENANCE</p></div></div></section>
    <section className="mt-5 rounded-2xl border border-white/[0.07] bg-[#07101b]/45 p-5"><MpeOrganSourceSurface apiPath="/api/mpe/heritage" organ="HERITAGE" title="Heritage surface" description="Sólo muestra material promovido por una fuente observable. Ausencia de heritage explícito no se interpreta como validación implícita." groups={groups}/></section>
    <section className="mt-5 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/[0.07] bg-[#07101b]/35 p-5">{["RESULT","EVIDENCE","PROMOTION","HERITAGE","NEW POSSIBILITY"].map((x,i)=><span key={x} className="flex items-center gap-2"><span className="rounded-lg border border-amber-300/10 px-3 py-2 text-[9px] text-white/45">{x}</span>{i<4?<b className="text-amber-200/20">→</b>:null}</span>)}</section>
  </main></MpeInterfaceFrame>;
}
