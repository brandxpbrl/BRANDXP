import type { Metadata } from "next";
import MpeVisionExperience from "../MpeVisionExperience";
import MpeInterfaceFrame from "../MpeInterfaceFrame";

export const metadata: Metadata = {
  title: "MPE Perception | ORBIS",
  description: "Percepción visual en vivo dentro de MPE Organism.",
  alternates: { canonical: "/mpe/vision" },
};

export default function MpeVisionPage() {
  return (
    <MpeInterfaceFrame active="PERCEPTION">
      <section className="border-b border-cyan-300/10 bg-[#06101a]/70 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3">
          <div><p className="text-[9px] tracking-[0.2em] text-cyan-200/45">PERCEPTION · BROWSER SENSOR</p><p className="mt-1 text-[10px] text-white/32">La cámara sólo se activa con permiso del usuario. Sus métricas son percepción browser-native, no telemetría FaseOS.</p></div>
          <span className="rounded-lg border border-cyan-300/15 px-3 py-1.5 text-[9px] tracking-[0.12em] text-cyan-100/55">LOCAL SENSOR</span>
        </div>
      </section>
      <MpeVisionExperience />
    </MpeInterfaceFrame>
  );
}
