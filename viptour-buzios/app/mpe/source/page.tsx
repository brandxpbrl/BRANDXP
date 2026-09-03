import Link from "next/link";
import MpeEntityObserverMax from "../MpeEntityObserverMax";
import MpeInterfaceFrame from "../MpeInterfaceFrame";
import { organismNodes } from "../mpe-organism.data";

const chain = ["SOURCE","CLAIM","HYPOTHESIS","EXPERIMENT","METRIC","RESULT","ARTIFACT","HERITAGE"];

export default function MpeSourceEvidencePage() {
  return (
    <MpeInterfaceFrame active="SOURCE">
      <MpeEntityObserverMax />
      <main className="px-4 py-5 sm:px-6">
        <section className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#07101b]/55 p-6 sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(34,211,238,.11),transparent_30%),radial-gradient(circle_at_36%_82%,rgba(217,70,239,.07),transparent_28%)]" />
          <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1fr)_430px] xl:items-center">
            <div><p className="text-[9px] tracking-[0.22em] text-cyan-200/45">SOURCE / EVIDENCE · PROVENANCE SPINE</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Trazabilidad antes que narrativa.</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-white/40">Cada entidad del organismo debe poder responder de dónde viene, qué afirma, qué estado epistemológico tiene y qué artefactos o experimentos la sostienen. El registry registra; no decide la verdad.</p><div className="mt-5 flex flex-wrap gap-2"><Link href="/mpe/memory" className="rounded-xl border border-violet-300/20 px-3 py-2 text-[10px] text-violet-100">MEMORY</Link><Link href="/mpe/lab" className="rounded-xl border border-fuchsia-300/20 px-3 py-2 text-[10px] text-fuchsia-100">LAB</Link></div></div>
            <div className="rounded-2xl border border-cyan-300/10 bg-black/15 p-5"><p className="text-[9px] tracking-[0.18em] text-cyan-200/45">PROVENANCE CONTRACT</p><div className="mt-4 grid grid-cols-2 gap-2">{[["ORIGIN","required"],["STATUS","required"],["LINEAGE","required"],["EVIDENCE","explicit"]].map(([a,b])=><div key={a} className="rounded-xl border border-white/[0.07] px-3 py-3"><p className="text-[9px] text-white/28">{a}</p><p className="mt-1 text-xs text-white/60">{b}</p></div>)}</div></div>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-white/[0.07] bg-[#07101b]/45 p-5"><p className="text-[9px] tracking-[0.2em] text-fuchsia-200/45">EVIDENCE CHAIN</p><div className="mt-4 flex flex-wrap items-center gap-2">{chain.map((item,index)=><span key={item} className="flex items-center gap-2"><span className="rounded-lg border border-white/10 px-3 py-2 text-[9px] tracking-[0.08em] text-white/48">{item}</span>{index<chain.length-1?<b className="text-cyan-300/25">→</b>:null}</span>)}</div><p className="mt-4 text-[10px] leading-5 text-white/30">La cadena puede ser incompleta. Un hueco debe quedar visible como UNKNOWN, no rellenarse automáticamente.</p></section>

        <section className="mt-5 overflow-x-auto rounded-2xl border border-white/[0.07] bg-[#07101b]/45"><div className="min-w-[760px]"><div className="grid grid-cols-[1.05fr_.7fr_1.45fr_.7fr] gap-3 border-b border-white/[0.07] bg-white/[0.025] px-4 py-3 text-[9px] tracking-[0.14em] text-white/30"><span>ENTITY</span><span>ORGAN</span><span>SOURCE</span><span>STATUS</span></div>{organismNodes.map(node=><div key={node.id} className="grid grid-cols-[1.05fr_.7fr_1.45fr_.7fr] gap-3 border-b border-white/[0.055] px-4 py-4 text-xs last:border-b-0"><span className="font-medium text-white/78">{node.label}</span><span className="text-cyan-200/48">{node.organ}</span><span className="break-words text-white/34">{node.source}</span><span className="text-white/34">{node.status.toUpperCase()}</span></div>)}</div></section>

        <section className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{[["SOURCE ID","stable identity"],["CLAIM STATUS","epistemic layer"],["METRIC NAMESPACE","no score collapse"],["ARTIFACT LINK","traceable output"]].map(([a,b])=><article key={a} className="rounded-2xl border border-white/[0.07] bg-[#07101b]/45 p-4"><p className="text-[9px] tracking-[0.15em] text-cyan-200/42">{a}</p><p className="mt-2 text-[10px] text-white/32">{b}</p></article>)}</section>

        <section className="mt-5 rounded-2xl border border-amber-300/10 bg-amber-300/[0.025] p-5"><p className="text-[9px] tracking-[0.18em] text-amber-200/45">SOURCE LAW</p><p className="mt-3 max-w-4xl text-xs leading-6 text-white/40">Una teoría, una propuesta arquitectónica, un resultado interno y una observación runtime pueden coexistir dentro de MPE sin ser equivalentes. SOURCE/EVIDENCE preserva esa diferencia.</p></section>
      </main>
    </MpeInterfaceFrame>
  );
}
