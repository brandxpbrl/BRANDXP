import type { Metadata } from "next";
import MpeVisionExperience from "../MpeVisionExperience";

export const metadata: Metadata = {
  title: "MPE Perception | ORBIS",
  description: "Percepción visual en vivo dentro de MPE Organism.",
  alternates: { canonical: "/mpe/vision" },
};

export default function MpeVisionPage() {
  return <MpeVisionExperience />;
}
