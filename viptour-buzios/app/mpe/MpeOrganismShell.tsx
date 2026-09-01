import Link from "next/link";
import MpeRuntimeSurface from "./MpeRuntimeSurface";
import MpeEntityObserverMax from "./MpeEntityObserverMax";
import { organismFlow, organismNodes, organismViews, epistemicLegend } from "./mpe-organism.data";

const statusLabel: Record<string, string> = {
  implemented: "IMPLEMENTED",
  partial: "PARTIAL",
  bridge: "BRIDGE",
  proposed: "PROPOSED",
  evidence: "EVIDENCE",
};

export default function MpeOrganismShell() {
  return (
    <main className="min-h-screen bg-[#02070b] text-white">
      <MpeEntityObserverMax />
      <section className="relative overflow-hidden border-b border-cyan-300/10 px-5 py-16 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.17),transparent_42%),radial-gradient(circle_at_78%_28%,rgba(217,70,239,0.10),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-center gap-3 text-[11px] tracking-[0.25em] text-cyan-200/70">
            <span>MPE ORGANISM</span><span>·</span><span>V0.1</span><span>·</span><span>READ-ONLY INTEGRATION SPIKE</span>
          </div>
          <p className="max-w-5xl text-4xl font-semibold leading-[1.04] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            La evolución no maximiza complejidad.<br />
            <span className="text-cyan-200">Maximiza posibilidades viables.</span>
          </p>
          <p className="mt-7 max-w-3xl text-base leading-7 text-white/58 sm:text-lg">
            MPE deja de ser una colección de módulos y comienza a operar como un organismo observable: percepción, estado, evolución, memoria, geometría, evidencia y herencia conectadas por relaciones trazables.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/mpe/vision" className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/20">Entrar a PERCEPTION</Link>
            <a href="#alive" className="rounded-full border border-white/12 px-5 py-3 text-sm text-white/72 transition hover:border-white/25 hover:text-white">Ver organismo</a>
          </div>
        </div>
      </section>

      <section id="alive" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div><p className="text-[11px] tracking-[0.24em] text-cyan-300/65">ALIVE</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Estado observable del organismo</h2></div>
          <span className="rounded-full border border-emerald-300/25 bg-emerald-300/8 px-3 py-1 text-xs tracking-[0.16em] text-emerald-200">ARCHITECTURE ONLINE</span>
        </div>

        <MpeRuntimeSurface />

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {organismNodes.map((node) => (
            <article key={node.id} className="rounded-2xl border border-white/9 bg-white/[0.025] p-5 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-[10px] tracking-[0.22em] text-cyan-300/60">{node.organ}</p><h3 className="mt-2 text-lg font-medium">{node.label}</h3></div>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[9px] tracking-[0.15em] text-white/50">{statusLabel[node.status]}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/55">{node.role}</p>
              <div className="mt-5 border-t border-white/7 pt-4 text-xs text-white/38"><span className="text-white/60">SOURCE</span> · {node.source}</div>
              {node.outputs?.length ? <p className="mt-2 text-xs leading-5 text-white/34">{node.outputs.join(" · ")}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/7 bg-white/[0.018]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
          <p className="text-[11px] tracking-[0.24em] text-fuchsia-300/60">EVENT PROPAGATION</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Primer vertical slice</h2>
          <div className="mt-7 flex flex-wrap items-center gap-2">
            {organismFlow.map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded-xl border border-cyan-300/14 bg-cyan-300/[0.045] px-3 py-2 text-[11px] tracking-[0.12em] text-cyan-100/72">{step}</span>
                {index < organismFlow.length - 1 ? <span className="text-cyan-300/30">→</span> : null}
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-4xl text-sm leading-6 text-white/45">V0.1 no inventa un backend nuevo: empieza conectando superficies reales ya existentes y obliga a preservar source, lineage, status, metric namespace y artifact link.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <p className="text-[11px] tracking-[0.24em] text-cyan-300/65">SUPER APP</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">Órganos navegables</h2>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {organismViews.map((view) => {
            const card = <div className="h-full rounded-2xl border border-white/8 bg-white/[0.02] p-5 transition hover:border-cyan-300/20 hover:bg-cyan-300/[0.035]"><div className="flex items-center justify-between gap-3"><h3 className="font-medium tracking-[0.08em]">{view.label}</h3><span className="text-[9px] tracking-[0.15em] text-white/32">{view.status === "active" ? "ACTIVE" : "NEXT"}</span></div><p className="mt-3 text-sm leading-6 text-white/48">{view.description}</p></div>;
            return view.href ? <Link key={view.id} href={view.href}>{card}</Link> : <div key={view.id}>{card}</div>;
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-12">
        <div className="rounded-3xl border border-white/8 bg-[linear-gradient(135deg,rgba(34,211,238,0.06),rgba(217,70,239,0.04))] p-6 sm:p-8">
          <p className="text-[11px] tracking-[0.24em] text-white/40">EPISTEMIC LAYER</p>
          <h2 className="mt-2 text-2xl font-semibold">Nada entra al organismo sin estado.</h2>
          <div className="mt-5 flex flex-wrap gap-2">{epistemicLegend.map((item) => <span key={item} className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] tracking-[0.1em] text-white/55">{item}</span>)}</div>
          <p className="mt-6 max-w-4xl text-sm leading-6 text-white/45">Una fuente, una hipótesis, un resultado experimental y una propuesta arquitectónica pueden convivir dentro de MPE sin ser confundidos. SOURCE / EVIDENCE será transversal a todas las vistas.</p>
        </div>
      </section>
    </main>
  );
}
