import type { Metadata } from "next";
import { portalConfig } from "@/config/portal";
import MpeVisionExperience from "./MpeVisionExperience";

export const metadata: Metadata = {
  title: "MPE Vision | ORBIS",
  description: "Experiencia interactiva de percepción visual MPE dentro de ORBIS.",
  alternates: { canonical: "/mpe" },
  openGraph: {
    title: "MPE Vision | ORBIS",
    description: "Activá la cámara y experimentá cómo MPE hace visible el cambio, la relación y la organización en tiempo real.",
    url: `${portalConfig.url}/mpe`,
  },
};

export default function MpePage() {
  return <MpeVisionExperience />;
}
