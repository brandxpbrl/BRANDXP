import type { Metadata } from "next";
import { portalConfig } from "@/config/portal";
import MpeOrganismShell from "./MpeOrganismShell";

export const metadata: Metadata = {
  title: "MPE Organism | ORBIS",
  description: "Interfaz viva de MPE: percepción, evolución, memoria, geometría, evidencia y estado conectados.",
  alternates: { canonical: "/mpe" },
  openGraph: {
    title: "MPE Organism | ORBIS",
    description: "La evolución no maximiza complejidad. Maximiza posibilidades viables.",
    url: `${portalConfig.url}/mpe`,
  },
};

export default function MpePage() {
  return (\n    <main className="min-h-screen bg-[#02040a] text-white">\n      <MpeOrganismShell />\n      <section className="border-t border-cyan-300/20 bg-black px-4 py-16 md:px-10">\n        <div className="mx-auto max-w-[1600px]">\n          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">\n            <div>\n              <p className="text-[10px] uppercase tracking-[0.42em] text-cyan-300">MPE / INTERACTIVE LAB</p>\n              <h1 className="mt-3 text-3xl font-light uppercase tracking-[0.18em] md:text-5xl">MPE SIMULATORS</h1>\n              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">Estudio cinematográfico interactivo para combinar capas GLB, movimiento, wireframe y exportación visual.</p>\n            </div>\n            <a href="/mpe-simulators/mpe-cinematic-studio.html" target="_blank" rel="noreferrer" className="rounded-xl border border-cyan-300/60 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200 transition hover:bg-cyan-300/10">Abrir en ventana completa ↗</a>\n          </div>\n          <div className="overflow-hidden rounded-2xl border border-cyan-300/30 bg-[#050505] shadow-[0_0_60px_rgba(0,255,255,0.08)]">\n            <iframe title="MPE Cinematic Studio Simulator" src="/mpe-simulators/mpe-cinematic-studio.html" allow="fullscreen" className="h-[78vh] min-h-[620px] w-full border-0" />\n          </div>\n        </div>\n      </section>\n    </main>\n  );
}
