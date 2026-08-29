import type { Metadata } from "next";
import ExperiencesCatalog from "./ExperiencesCatalog";

const canonical = "https://www.riovibestransfer.com/felatours/experiencias";

export const metadata: Metadata = {
  title: "Catálogo de Tours y Experiencias | FELA TOURS",
  description: "Tours, playas, aventura y traslados en Río de Janeiro, Búzios, Arraial do Cabo, Angra dos Reis e Ilha Grande.",
  alternates: { canonical },
  openGraph: { title: "Catálogo de experiencias FELA TOURS", description: "Elegí tu próxima experiencia en Brasil y consultá disponibilidad.", url: canonical, type: "website" },
};

export default function ExperiencesPage() {
  return <ExperiencesCatalog />;
}
