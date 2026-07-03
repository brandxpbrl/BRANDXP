import type { Metadata } from "next";
import { PortalCardGrid, PortalPage } from "../_components/PortalPage";
import { portalConfig } from "@/config/portal";

export const metadata: Metadata = {
  title: "MPE",
  description: "Página institucional con investigación, publicaciones, estado del proyecto y roadmap.",
  alternates: { canonical: "/mpe" },
  openGraph: {
    title: "MPE",
    description: "Página institucional con investigación, publicaciones, estado del proyecto y roadmap.",
    url: `${portalConfig.url}/mpe`,
  },
};

const mpeItems = [
  { title: "Investigación", description: "Placeholder elegante para método, hipótesis y aprendizajes." },
  { title: "Publicaciones", description: "Espacio para artículos, notas y reportes del proyecto." },
  { title: "Estado del proyecto", description: "Resumen visual del avance actual y prioridades activas." },
  { title: "Roadmap", description: "Hoja de ruta para próximos desarrollos y entregas." },
];

export default function MpePage() {
  return (
    <PortalPage
      eyebrow="MPE"
      title="Página institucional del proyecto"
      description="Estructura base para presentar investigación, publicaciones, estado y próximos desarrollos sin teorizar de más."
    >
      <PortalCardGrid items={mpeItems} />
    </PortalPage>
  );
}
