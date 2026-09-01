import Link from "next/link";
import MpeOrganSourceSurface from "../MpeOrganSourceSurface";

const groups = [
  { label: "MORPHOGENESIS", keys: ["morphogenesis", "geometry_states", "states", "forms"] },
  { label: "ATLAS / FAMILIES", keys: ["atlas", "families", "regions", "morphospace"] },
  { label: "ARTIFACTS", keys: ["artifacts", "glb", "outputs", "renders", "images"] },
  { label: "LINEAGE / METRICS", keys: ["lineage", "lineages", "metrics", "geometry_metrics"] },
];

export default function MpeGeometryPage() {
  return (
    <main className="min-h-screen bg-[#02070b] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.24em] text-cyan-300/60">MPE ORGANISM · GEOMETRY</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">Morphogenesis y territorio geométrico</h1>
          </div>
          <Link href="/mpe" className="rounded-full border border-white/12 px-4 py-2 text-sm text-white/60 hover:text-white">Volver a ALIVE</Link>
        </div>
        <MpeOrganSourceSurface
          apiPath="/api/mpe/geometry"
          organ="GEOMETRY"
          title="Geometry surface"
          description="Observa estados geométricos, atlas, morfospacio, artefactos y lineage desde una fuente real sin reemplazar los generadores existentes."
          groups={groups}
        />
      </div>
    </main>
  );
}
