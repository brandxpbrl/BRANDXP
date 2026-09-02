"use client";

import Link from "next/link";
import MpeRuntimeSurface from "./MpeRuntimeSurface";
import MpeEntityObserverMax from "./MpeEntityObserverMax";
import MpeInterfaceFrame from "./MpeInterfaceFrame";
import { useMpeRuntime } from "./MpeRuntimeContext";
import { organismFlow, organismNodes, organismViews, epistemicLegend } from "./mpe-organism.data";

const statusLabel: Record<string, string> = { implemented: "IMPLEMENTED", partial: "PARTIAL", bridge: "BRIDGE", proposed: "PROPOSED", evidence: "EVIDENCE" };

export default function MpeOrganismShell() {
  const { probe } = useMpeRuntime();
  const runtimeObserved = probe?.connected === true;
  const topStates = [
    ["ARCHITECTURE", "ONLINE"],
    ["RUNTIME", runtimeObserved ? "OBSERVED" : "UNOBSERVED"],
    ["EPISTEMIC", "ENFORCED"],
  ];

  return (
    <MpeInterfaceFrame active="ALIVE">
      <MpeEntityObserverMax />
      <main className="px-4 py-5 sm:px-6">
        <section className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#07101b]/55 px-5 py-10 sm:px-8 lg:px-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_20%,rgba(34,211,238,.14),transparent_35%),radial-gradient(circle_at_72%_55%,rgba(217,70,239,.09),transparent_28%)]" />
          <div className="relative grid gap-8 xl:grid-cols-[220px_minmax(0,1fr)_260px] xl:items-center">
            <div><p className="text-[9px] tracking-[0.22em] text-cyan-200/45">MPE LIVE</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Estado del organismo</h1><p className="mt-3 text-xs leading-6 text-white/38">Una superficie para observar qué existe, qué está conectado y qué sigue siendo propuesta.</p><div className="mt-5 flex gap-2"><Link href="/mpe/lab" className="rounded-xl border border-fuchsia-300/20 bg-fuchsia-300/[0.06] px-3 py-2 text-[10px] text-fuchsia-100">ABRIR LAB</Link><Link href="/mpe/vision" className="rounded-xl border border-cyan-300/20 px-3 py-2 text-[10px] text-cyan-100">PERCEPTION</Link></div></div>
            <div className="relative mx-auto grid h-[270px] w-full max-w-[520px] place-items-center">
              <div className="absolute h-64 w-64 rounded-full border border-cyan-300/10"/><div className="absolute h-48 w-48 rounded-full border border-fuchsia-300/10"/><div className="absolute h-36 w-36 animate-pulse rounded-full bg-[radial-gradient(circle,rgba(34,211,238,.32),rgba(168,85,247,.14)_40%,transparent_72%)] shadow-[0_0_90px_rgba(34,211,238,.12)]"/><div className="relative text-center"><p className="text-[9px] tracking-[0.24em] text-cyan-200/45">ORGANISM CORE</p><p className="mt-2 text-xl font-semibold">MPE</p><p className="mt-1 text-[10px] text-white/30">observable · traceable</p></div>
            </div>
            <div className="grid gap-2">{topStates.map(([k,v]) => <div key={k} className="rounded-xl border border-white/[0.07] bg-black/15 px-4 py-3"><p className="text-[9px] tracking-[0.16em] text-white/30">{k}</p><p className="mt-1 text-sm">{v}</p></div>)}</div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="rounded-2xl border border-white/[0.07] bg-[#07101b]/45 p-5"><div className="mb-4"><p className="text-[9px] tracking-[0.2em] text-cyan-300/50">REAL RUNTIME</p><h2 className="mt-1 text-xl font-semibold">Heartbeat & lineage</h2></div><MpeRuntimeSurface /></div>
          <div className="rounded-2xl border border-white/[0.07] bg-[#07101b]/45 p-5"><p className="text-[9px] tracking-[0.2em] text-fuchsia-200/45">EVENT PROPAGATION</p><div className="mt-4 grid gap-2">{organismFlow.map((step,index)=><div key={step} className="flex items-center gap-3"><span className="grid h-7 w-7 place-items-center rounded-full border border-cyan-300/15 text-[9px] text-cyan-200/55">{String(index+1).padStart(2,'0')}</span><span className="text-[10px] tracking-[0.08em] text-white/55">{step}</span></div>)}</div></div>
        </section>

        <section className="mt-5"><div className="mb-4 flex items-end justify-between"><div><p className="text-[9px] tracking-[0.2em] text-white/35">ORGAN NETWORK</p><h2 className="mt-1 text-xl font-semibold">Nodos del organismo</h2></div><span className="text-[9px] tracking-[0.14em] text-white/25">STATUS ≠ TRUTH</span></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{organismNodes.map(node=><article key={node.id} className="rounded-2xl border border-white/[0.07] bg-[#07101b]/45 p-4"><div className="flex justify-between gap-3"><div><p className="text-[9px] tracking-[0.16em] text-cyan-200/45">{node.organ}</p><h3 className="mt-1 text-sm font-medium">{node.label}</h3></div><span className="h-fit rounded-lg border border-white/10 px-2 py-1 text-[8px] tracking-[0.1em] text-white/35">{statusLabel[node.status]}</span></div><p className="mt-3 text-[11px] leading-5 text-white/38">{node.role}</p><p className="mt-3 border-t border-white/[0.06] pt-3 text-[9px] text-white/25">SOURCE · {node.source}</p></article>)}</div></section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]"><div className="rounded-2xl border border-white/[0.07] bg-[#07101b]/45 p-5"><p className="text-[9px] tracking-[0.2em] text-cyan-200/45">SUPER APP</p><div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{organismViews.map(view=>{const card=<div className="rounded-xl border border-white/[0.07] px-4 py-3 transition hover:border-cyan-300/20 hover:bg-cyan-300/[0.025]"><div className="flex justify-between"><span className="text-xs">{view.label}</span><span className="text-[8px] text-white/25">{view.status==='active'?'ACTIVE':'NEXT'}</span></div><p className="mt-2 text-[10px] leading-4 text-white/30">{view.description}</p></div>;return view.href?<Link key={view.id} href={view.href}>{card}</Link>:<div key={view.id}>{card}</div>})}</div></div><div className="rounded-2xl border border-fuchsia-300/10 bg-[radial-gradient(circle_at_90%_10%,rgba(217,70,239,.08),transparent_50%)] p-5"><p className="text-[9px] tracking-[0.2em] text-fuchsia-200/45">EPISTEMIC LAYER</p><h2 className="mt-2 text-lg font-semibold">Nada entra sin estado.</h2><div className="mt-4 flex flex-wrap gap-2">{epistemicLegend.map(item=><span key={item} className="rounded-lg border border-white/10 px-2 py-1 text-[8px] tracking-[0.08em] text-white/40">{item}</span>)}</div><p className="mt-4 text-[10px] leading-5 text-white/32">Fuente, hipótesis, resultado y propuesta pueden convivir sin ser confundidos.</p></div></section>

        <section className="mt-5 rounded-2xl border border-cyan-300/10 bg-[radial-gradient(circle_at_50%_100%,rgba(34,211,238,.07),transparent_55%)] px-5 py-6 text-center"><p className="text-base text-white/70">“La evolución no maximiza complejidad. Maximiza posibilidades viables.”</p><p className="mt-2 text-[9px] tracking-[0.16em] text-cyan-200/40">MPE · SOURCE PRINCIPLE</p></section>
      </main>
    </MpeInterfaceFrame>
  );
}
