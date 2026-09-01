import Link from "next/link";
import MpeOrganSourceSurface from "../MpeOrganSourceSurface";
import MpeBrowserLab from "./MpeBrowserLab";

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
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-[11px] tracking-[0.24em] text-cyan-300/60">MPE ORGANISM · LAB</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Explorá posibilidades. Combiná morfogénesis. Generá artefactos.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/50">Esta superficie funciona directamente en el navegador: no necesita FaseOS, Earth ni tu computadora local para crear una simulación, exportar PNG, GLB y su manifest de provenance.</p>
          </div>
          <Link href="/mpe" className="rounded-full border border-white/12 px-4 py-2 text-sm text-white/60 hover:text-white">Volver a ALIVE</Link>
        </div>

        <MpeBrowserLab />

        <div className="mt-10 border-t border-white/8 pt-8">
          <div className="mb-5">
            <p className="text-[10px] tracking-[0.22em] text-white/35">RUNTIME OBSERVER</p>
            <h2 className="mt-2 text-2xl font-semibold">Cuando el organismo real esté conectado</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">La zona inferior conserva la lectura read-only del runtime. Así la página diferencia explícitamente una simulación browser-native de un experimento observado desde FaseOS/Earth.</p>
          </div>
          <MpeOrganSourceSurface
            apiPath="/api/mpe/lab"
            organ="LAB"
            title="Observed experiment surface"
            description="Lee experimentos, métricas, perturbaciones y artefactos cuando existe una fuente runtime real. No convierte simulaciones del navegador en evidencia LIVE."
            groups={groups}
          />
        </div>
      </div>
    </main>
  );
}
