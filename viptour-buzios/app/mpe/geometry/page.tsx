import Link from "next/link";
import MpeOrganSourceSurface from "../MpeOrganSourceSurface";
import MpeEntityObserverMax from "../MpeEntityObserverMax";
import MpeInterfaceFrame from "../MpeInterfaceFrame";

const groups = [
  { label: "MORPHOGENESIS", keys: ["morphogenesis", "geometry_states", "states", "forms"] },
  { label: "ATLAS / FAMILIES", keys: ["atlas", "families", "regions", "morphospace"] },
  { label: "ARTIFACTS", keys: ["artifacts", "glb", "outputs", "renders", "images"] },
  { label: "LINEAGE / METRICS", keys: ["lineage", "lineages", "metrics", "geometry_metrics"] },
];

export default function MpeGeometryPage() {
  return <MpeInterfaceFrame active="GEOMETRY"><MpeEntityObserverMax/><main className="px-4 py-5 sm:px-6">
    <section className="relative overflow-hidden rounded-[28px] border border-cyan-300/10 bg-[#07101b]/55 p-6 sm:p-8"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(34,211,238,.12),transparent_34%),radial-gradient(circle_at_68%_55%,rgba(217,70,239,.08),transparent_25%)]"/><div className="relative grid gap-8 xl:grid-cols-[minmax(0,1fr)_430px] xl:items-center"><div><p className="text-[9px] tracking-[0.22em] text-cyan-200/45">GEOMETRY · MORPHOGENESIS TERRITORY</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Morphogenesis y territorio geométrico</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-white/40">Geometry conecta estados, familias, morfospacio, artefactos y métricas sin sustituir los generadores existentes. LAB es la superficie activa de composición browser-native.</p><div className="mt-5 flex gap-2"><Link href="/mpe/lab" className="rounded-xl border border-fuchsia-300/20 bg-fuchsia-300/[0.04] px-3 py-2 text-[10px] text-fuchsia-100">GENERAR EN LAB</Link><Link href="/mpe/evolution" className="rounded-xl border border-cyan-300/20 px-3 py-2 text-[10px] text-cyan-100">EVOLUTION</Link></div></div><div className="relative mx-auto grid h-64 w-64 place-items-center"><div className="absolute inset-0 rotate-45 rounded-[38%] border border-cyan-200/10"/><div className="absolute inset-8 -rotate-12 rounded-full border border-fuchsia-200/12"/><div className="absolute inset-14 rounded-full bg-[conic-gradient(from_30deg,rgba(34,211,238,.22),rgba(217,70,239,.16),transparent,rgba(34,211,238,.22))] blur-[1px]"/><div className="absolute inset-[76px] rounded-full bg-[#06121d] shadow-[0_0_55px_rgba(34,211,238,.18)]"/><p className="relative text-[9px] tracking-[0.18em] text-cyan-100/45">MORPHOSPACE</p></div></div></section>
    <section className="mt-5 rounded-2xl border border-white/[0.07] bg-[#07101b]/45 p-5"><MpeOrganSourceSurface apiPath="/api/mpe/geometry" organ="GEOMETRY" title="Geometry surface" description="Observa estados geométricos, atlas, morfospacio, artefactos y lineage desde una fuente real; la visualización no convierte una forma en hallazgo científico." groups={groups}/></section>
  </main></MpeInterfaceFrame>;
}
