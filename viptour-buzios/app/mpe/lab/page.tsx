import Link from "next/link";
import MpeEntityObserverMax from "../MpeEntityObserverMax";
import MpeInterfaceFrame from "../MpeInterfaceFrame";
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
    <MpeInterfaceFrame active="LAB">
      <MpeEntityObserverMax />
      <main className="px-4 py-5 sm:px-6">
        <div className="grid gap-5 xl:grid-cols-[190px_minmax(0,1fr)]">
          <aside className="hidden rounded-2xl border border-white/[0.07] bg-[#07101b]/65 p-3 xl:block">
            <p className="px-3 py-2 text-[9px] tracking-[0.2em] text-cyan-200/45">MPE LIVE</p>
            {[['ALIVE','/mpe','Latido del organismo'],['EARTH','/mpe/earth','Eventos y memoria'],['LAB','/mpe/lab','Explorar posibilidades'],['SYSTEM','/mpe/system','Salud y servicios'],['MEMORY','/mpe/memory','Archivo evolutivo'],['SOURCE','/mpe/source','Evidencia y linaje']].map(([label,href,desc]) => <Link key={label} href={href} className={`mb-1 block rounded-xl border px-3 py-3 ${label === 'LAB' ? 'border-fuchsia-300/20 bg-fuchsia-300/[0.07]' : 'border-transparent hover:bg-white/[0.025]'}`}><p className="text-xs font-medium">{label}</p><p className="mt-1 text-[9px] text-white/30">{desc}</p></Link>)}
            <div className="mt-8 rounded-2xl border border-cyan-300/10 bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,.14),transparent_55%)] p-4"><div className="mx-auto mb-4 h-20 w-20 rounded-full border border-cyan-300/20 bg-[radial-gradient(circle,rgba(217,70,239,.25),rgba(34,211,238,.12),transparent_70%)]"/><p className="text-xs font-medium">MPE es un organismo</p><p className="mt-2 text-[10px] leading-5 text-white/40">No es un software. Es un sistema vivo de posibilidades.</p></div>
          </aside>

          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-white/[0.07] bg-[#07101b]/45 px-5 py-4">
              <div><p className="text-[9px] tracking-[0.2em] text-cyan-300/55">MPE LAB · MORPHOGENESIS COMPOSER</p><h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Explorá, combiná y materializá posibilidades.</h1><p className="mt-2 text-xs text-white/38">Browser-native · PNG · GLB · manifest · provenance explícita</p></div>
              <span className="rounded-lg border border-fuchsia-300/30 bg-fuchsia-300/[0.06] px-3 py-1.5 text-[9px] tracking-[0.14em] text-fuchsia-200">SIMULATION</span>
            </div>

            <MpeBrowserLab />

            <section className="mt-5 rounded-2xl border border-white/[0.07] bg-[#07101b]/45 p-5">
              <div className="mb-5 flex items-end justify-between gap-3"><div><p className="text-[9px] tracking-[0.2em] text-white/35">REAL EXPERIMENT OBSERVER</p><h2 className="mt-1 text-xl font-semibold">FaseOS / Earth lineage</h2><p className="mt-1 text-xs text-white/35">Esta zona sólo se vuelve LIVE cuando existe una fuente runtime real.</p></div><Link href="/mpe/earth" className="text-[10px] tracking-[0.12em] text-cyan-200/55">IR A EARTH →</Link></div>
              <MpeOrganSourceSurface apiPath="/api/mpe/lab" organ="LAB" title="Observed experiment surface" description="Experimentos, métricas, perturbaciones y artefactos observados. Las simulaciones browser-native nunca se convierten automáticamente en evidencia LIVE." groups={groups} />
            </section>

            <section className="mt-5 grid gap-3 md:grid-cols-[1fr_320px]">
              <div className="rounded-2xl border border-white/[0.07] bg-[#07101b]/45 p-5"><p className="text-[9px] tracking-[0.18em] text-fuchsia-200/45">LINEAGE</p><div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] text-white/55">{['EVENT','SOURCE','EXPERIMENT','ARTIFACT','METRICS','HERITAGE'].map((item,index) => <span key={item} className="flex items-center gap-2"><span className="rounded-lg border border-white/10 px-3 py-2">{item}</span>{index < 5 ? <b className="text-cyan-300/25">→</b> : null}</span>)}</div></div>
              <div className="rounded-2xl border border-cyan-300/10 bg-[radial-gradient(circle_at_90%_50%,rgba(34,211,238,.10),transparent_55%)] p-5 text-xs leading-5 text-white/50">“La evolución no maximiza complejidad; maximiza posibilidades viables.”<p className="mt-3 text-[9px] tracking-[0.14em] text-cyan-200/45">— MPE MANIFESTO</p></div>
            </section>
          </div>
        </div>
      </main>
    </MpeInterfaceFrame>
  );
}
