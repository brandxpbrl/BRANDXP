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
  return <MpeOrganismShell />;
}
