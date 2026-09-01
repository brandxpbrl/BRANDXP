import Link from "next/link";
import MpeOrganSourceSurface from "../MpeOrganSourceSurface";

const groups = [
  { label: "POPULATIONS", keys: ["populations", "species", "individuals", "variants"] },
  { label: "VIABILITY", keys: ["viability", "viability_scores", "fitness", "future_possibility_index", "fpi"] },
  { label: "SELECTION / DISCOVERY", keys: ["selection", "selected", "discoveries", "discovery_candidates", "candidates"] },
  { label: "RECOVERY / LINEAGE", keys: ["recovery", "recovery_events", "lineage", "lineages", "heritage_candidates"] },
];

export default function MpeEvolutionPage() {
  return (
    <main className="min-h-screen bg-[#02070b] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.24em] text-fuchsia-300/60">MPE ORGANISM · EVOLUTION</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">Poblaciones, viabilidad y futuros posibles</h1>
          </div>
          <Link href="/mpe" className="rounded-full border border-white/12 px-4 py-2 text-sm text-white/60 hover:text-white">Volver a ALIVE</Link>
        </div>
        <MpeOrganSourceSurface
          apiPath="/api/mpe/evolution"
          organ="EVOLUTION"
          title="Evolution surface"
          description="Observa poblaciones, viabilidad, selección, discovery, recovery y lineage sin imponer una métrica única ni reescribir los motores existentes."
          groups={groups}
        />
      </div>
    </main>
  );
}
