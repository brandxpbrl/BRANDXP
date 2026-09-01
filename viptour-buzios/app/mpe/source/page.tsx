import Link from "next/link";
import { organismNodes } from "../mpe-organism.data";

export default function MpeSourceEvidencePage() {
  return (
    <main className="min-h-screen bg-[#02070b] px-5 py-12 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.24em] text-cyan-300/60">MPE ORGANISM / SOURCE / EVIDENCE</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">Trazabilidad antes que narrativa.</h1>
          </div>
          <Link href="/mpe" className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:text-white">Volver a ALIVE</Link>
        </div>

        <p className="mt-6 max-w-3xl text-base leading-7 text-white/50">
          Esta vista empieza como un índice verificable de superficies reales. Cada órgano debe poder responder de dónde viene, qué estado epistemológico tiene, qué produce y cómo se relaciona con la evidencia.
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-white/8">
          <div className="grid grid-cols-[1.1fr_.8fr_1.5fr_.8fr] gap-3 border-b border-white/8 bg-white/[0.035] px-4 py-3 text-[10px] tracking-[0.16em] text-white/38">
            <span>ENTITY</span><span>ORGAN</span><span>SOURCE</span><span>STATUS</span>
          </div>
          {organismNodes.map((node) => (
            <div key={node.id} className="grid grid-cols-[1.1fr_.8fr_1.5fr_.8fr] gap-3 border-b border-white/6 px-4 py-4 text-sm last:border-b-0">
              <span className="font-medium text-white/85">{node.label}</span>
              <span className="text-cyan-200/55">{node.organ}</span>
              <span className="break-words text-white/45">{node.source}</span>
              <span className="text-white/40">{node.status.toUpperCase()}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-fuchsia-300/12 bg-fuchsia-300/[0.025] p-5 text-sm leading-6 text-white/48">
          Siguiente evolución de esta vista: SOURCE → CLAIM → HYPOTHESIS → EXPERIMENT → METRIC → RESULT → ARTIFACT → HERITAGE, consumiendo datos reales de los adapters del runtime.
        </div>
      </div>
    </main>
  );
}
