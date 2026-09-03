import Link from "next/link";
import MpeRuntimeSurface from "../MpeRuntimeSurface";
import MpeEntityObserverMax from "../MpeEntityObserverMax";
import MpeInterfaceFrame from "../MpeInterfaceFrame";

const contracts = ["SERVICE HEALTH", "EVENT SURFACE", "ARTIFACT INDEX", "SOURCE PROVENANCE"];

export default function MpeSystemPage() {
  return (
    <MpeInterfaceFrame active="SYSTEM">
      <MpeEntityObserverMax />
      <main className="px-4 py-5 sm:px-6">
        <section className="rounded-[28px] border border-white/[0.07] bg-[#07101b]/55 p-6 sm:p-8"><div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]"><div><p className="text-[9px] tracking-[0.22em] text-fuchsia-200/45">SYSTEM · RUNTIME CONTROL PLANE</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Runtime, servicios y salud</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-white/40">SYSTEM observa infraestructura sin fingir control. Esta versión es read-only: muestra lo que el bridge puede demostrar y mantiene UNKNOWN cuando no puede.</p><div className="mt-5 flex gap-2"><Link href="/mpe/earth" className="rounded-xl border border-cyan-300/20 px-3 py-2 text-[10px] text-cyan-100">EARTH</Link><Link href="/mpe/source" className="rounded-xl border border-fuchsia-300/20 px-3 py-2 text-[10px] text-fuchsia-100">SOURCE</Link></div></div><div className="grid grid-cols-2 gap-2">{contracts.map((item,index)=><div key={item} className="rounded-xl border border-white/[0.07] bg-black/15 p-4"><span className="text-[9px] text-fuchsia-200/35">0{index+1}</span><p className="mt-2 text-[10px] tracking-[0.08em] text-white/55">{item}</p><p className="mt-2 text-[9px] text-white/22">declared contract</p></div>)}</div></div></section>
        <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]"><div className="rounded-2xl border border-white/[0.07] bg-[#07101b]/45 p-5"><div className="mb-4 flex items-end justify-between"><div><p className="text-[9px] tracking-[0.2em] text-fuchsia-200/45">RUNTIME OBSERVER</p><h2 className="mt-1 text-xl font-semibold">Servicios, eventos y artefactos</h2></div><span className="rounded-lg border border-white/10 px-2 py-1 text-[8px] tracking-[0.12em] text-white/30">READ ONLY</span></div><MpeRuntimeSurface /></div><div className="grid gap-3"><div className="rounded-2xl border border-white/[0.07] bg-[#07101b]/45 p-5"><p className="text-[9px] tracking-[0.18em] text-white/30">SYSTEM LAW</p><p className="mt-3 text-sm leading-6 text-white/50">Declarado ≠ observado.<br/>Conectado ≠ validado.<br/>Implementado ≠ evidencia científica.</p></div><div className="rounded-2xl border border-cyan-300/10 bg-[radial-gradient(circle_at_80%_20%,rgba(34,211,238,.08),transparent_55%)] p-5"><p className="text-[9px] tracking-[0.18em] text-cyan-200/45">BRIDGE</p><p className="mt-2 text-xs leading-5 text-white/38">La web pública consume un contrato seguro; no expone rutas locales ni convierte localhost en una fuente accesible desde Vercel.</p></div></div></section>
        <section className="mt-5 rounded-2xl border border-white/[0.07] bg-[#07101b]/45 p-5"><p className="text-[9px] tracking-[0.2em] text-white/30">SYSTEM PATH</p><div className="mt-4 flex flex-wrap items-center gap-2">{["PHYSICAL NODE","RUNTIME BRIDGE","NORMALIZER","ORGANISM API","INTERFACE","MAX"].map((item,index)=><span key={item} className="flex items-center gap-2"><span className="rounded-lg border border-white/10 px-3 py-2 text-[9px] tracking-[0.08em] text-white/48">{item}</span>{index<5?<b className="text-fuchsia-300/25">→</b>:null}</span>)}</div></section>
      </main>
    </MpeInterfaceFrame>
  );
}
