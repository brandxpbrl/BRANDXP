import Link from "next/link";
import MpeOrganSourceSurface from "../MpeOrganSourceSurface";

const groups = [
  { label: "PROMOTED RESULTS", keys: ["heritage", "promoted", "validated_results", "inherited_results"] },
  { label: "STRUCTURES", keys: ["structures", "persistent_structures", "codes", "geometries"] },
  { label: "EVIDENCE LINKS", keys: ["evidence", "evidence_refs", "sources", "claims"] },
  { label: "LINEAGE", keys: ["lineage", "lineages", "inheritance", "history"] },
];

export default function MpeHeritagePage() {
  return (
    <main className="min-h-screen bg-[#02070b] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.24em] text-amber-300/60">MPE ORGANISM · HERITAGE</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">Lo que el organismo decide conservar</h1>
          </div>
          <Link href="/mpe" className="rounded-full border border-white/12 px-4 py-2 text-sm text-white/60 hover:text-white">Volver a ALIVE</Link>
        </div>
        <MpeOrganSourceSurface
          apiPath="/api/mpe/heritage"
          organ="HERITAGE"
          title="Heritage surface"
          description="Heritage no es historial bruto: muestra sólo resultados, estructuras o conocimiento promovido por una fuente real y conserva sus vínculos de evidencia y lineage."
          groups={groups}
        />
      </div>
    </main>
  );
}
