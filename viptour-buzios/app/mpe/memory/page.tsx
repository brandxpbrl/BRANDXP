import Link from "next/link";
import MpeOrganSourceSurface from "../MpeOrganSourceSurface";

const groups = [
  { label: "WORKING MEMORY", keys: ["working_memory", "memory", "active_memory", "context"] },
  { label: "EVENT LOG", keys: ["events", "event_log", "kernel_events", "episodes"] },
  { label: "EXPERIMENT MEMORY", keys: ["experiments", "experiment_memory", "runs", "replays"] },
  { label: "EPISTEMIC / ARTIFACT INDEX", keys: ["claims", "epistemic_memory", "artifacts", "artifact_index"] },
];

export default function MpeMemoryPage() {
  return (
    <main className="min-h-screen bg-[#02070b] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.24em] text-violet-300/60">MPE ORGANISM · MEMORY</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">Memoria sin confundir recuerdo con verdad</h1>
          </div>
          <Link href="/mpe" className="rounded-full border border-white/12 px-4 py-2 text-sm text-white/60 hover:text-white">Volver a ALIVE</Link>
        </div>
        <MpeOrganSourceSurface
          apiPath="/api/mpe/memory"
          organ="MEMORY"
          title="Memory surface"
          description="Separa memoria operacional, eventos, experimentos y referencias epistemológicas. El olvido selectivo nunca reemplaza provenance ni evidencia primaria."
          groups={groups}
        />
      </div>
    </main>
  );
}
