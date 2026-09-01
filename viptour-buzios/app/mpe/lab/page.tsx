import Link from "next/link";
import MpeOrganSourceSurface from "../MpeOrganSourceSurface";

const groups = [
  { label: "EXPERIMENTS", keys: ["experiments", "runs", "experiment_runs", "recent_experiments"] },
  { label: "METRICS", keys: ["metrics", "measurements", "scores", "experiment_metrics"] },
  { label: "PERTURBATIONS", keys: ["perturbations", "interventions", "stress_tests", "ablations"] },
  { label: "ARTIFACTS / REPLAY", keys: ["artifacts", "outputs", "replays", "manifests"] },
];

export default function MpeLabPage() {
  return (
    <main className="min-h-screen bg-[#02070b] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.24em] text-cyan-300/60">MPE ORGANISM · LAB</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">Experimentos observables y reproducibles</h1>
          </div>
          <Link href="/mpe" className="rounded-full border border-white/12 px-4 py-2 text-sm text-white/60 hover:text-white">Volver a ALIVE</Link>
        </div>
        <MpeOrganSourceSurface
          apiPath="/api/mpe/lab"
          organ="LAB"
          title="Experiment surface"
          description="Lee experimentos, métricas, perturbaciones y artefactos desde una fuente real. No ejecuta runners ni modifica parámetros en V0.1."
          groups={groups}
        />
      </div>
    </main>
  );
}
