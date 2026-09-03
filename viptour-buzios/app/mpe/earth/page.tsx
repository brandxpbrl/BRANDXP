"use client";

import Link from "next/link";
import MpeRuntimeSurface from "../MpeRuntimeSurface";
import MpeEntityObserverMax from "../MpeEntityObserverMax";
import MpeInterfaceFrame from "../MpeInterfaceFrame";
import { useMpeRuntime } from "../MpeRuntimeContext";

function EarthNodeState() {
  const { probe } = useMpeRuntime();
  const observed = probe?.connected === true;

  return (
    <div className="relative mx-auto grid h-64 w-64 place-items-center">
      <div className="absolute inset-0 rounded-full border border-cyan-300/10" />
      <div className="absolute inset-6 rounded-full border border-cyan-300/10" />
      <div className="absolute inset-12 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(103,232,249,.30),rgba(37,99,235,.12)_38%,rgba(2,6,12,.8)_70%)] shadow-[0_0_80px_rgba(34,211,238,.12)]" />
      <div className="relative text-center">
        <p className="text-[9px] tracking-[0.2em] text-cyan-100/45">EARTH NODE</p>
        <p className="mt-2 text-sm text-white/65">{observed ? "OBSERVED" : "UNOBSERVED"}</p>
        <p className="mt-1 text-[9px] text-white/25">{observed ? "real runtime source confirmed" : "physical state unknown"}</p>
      </div>
    </div>
  );
}

export default function MpeEarthPage() {
  return (
    <MpeInterfaceFrame active="EARTH">
      <MpeEntityObserverMax />
      <main className="px-4 py-5 sm:px-6">
        <section className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#07101b]/55 p-6 sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(34,211,238,.13),transparent_34%),radial-gradient(circle_at_35%_80%,rgba(59,130,246,.08),transparent_28%)]" />
          <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-center">
            <div><p className="text-[9px] tracking-[0.22em] text-cyan-200/45">EARTH · PHYSICAL STATE SURFACE</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Estado terrestre y telemetría</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-white/40">Earth es la frontera entre el organismo browser-native y el nodo físico. Sólo muestra actividad cuando FaseOS / Earth entrega una fuente observable.</p><div className="mt-5 flex flex-wrap gap-2"><Link href="/mpe/system" className="rounded-xl border border-cyan-300/20 px-3 py-2 text-[10px] text-cyan-100">VER SYSTEM</Link><Link href="/mpe/lab" className="rounded-xl border border-fuchsia-300/20 px-3 py-2 text-[10px] text-fuchsia-100">ABRIR LAB</Link></div></div>
            <EarthNodeState />
          </div>
        </section>
        <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]"><div className="rounded-2xl border border-white/[0.07] bg-[#07101b]/45 p-5"><p className="text-[9px] tracking-[0.2em] text-cyan-200/45">EARTH RUNTIME</p><h2 className="mt-1 mb-4 text-xl font-semibold">Telemetría observable</h2><MpeRuntimeSurface /></div><div className="grid gap-3"><div className="rounded-2xl border border-white/[0.07] bg-[#07101b]/45 p-5"><p className="text-[9px] tracking-[0.18em] text-white/30">CONTRACT</p><p className="mt-2 text-sm">EVENT → EARTH → MEMORY</p><p className="mt-3 text-[10px] leading-5 text-white/30">El estado físico debe llegar con fuente y tiempo. Ausencia de datos se conserva como ausencia.</p></div><div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.025] p-5"><p className="text-[9px] tracking-[0.18em] text-amber-200/45">EPISTEMIC GUARD</p><p className="mt-2 text-xs leading-5 text-white/38">NODE LIVE sólo puede aparecer cuando el bridge confirma una fuente runtime real.</p></div></div></section>
      </main>
    </MpeInterfaceFrame>
  );
}
