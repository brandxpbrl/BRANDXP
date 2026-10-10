import type { Metadata } from "next";
import { PortalCardGrid, PortalPage } from "../_components/PortalPage";
import { portalConfig } from "@/config/portal";

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Casos de éxito del ecosistema, comenzando por Buzios Buggy.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Proyectos",
    description: "Casos de éxito del ecosistema, comenzando por Buzios Buggy.",
    url: `${portalConfig.url}/projects`,
  },
};

const projectItems = [
  {
    title: "Buzios Buggy",
    description:
      "Landing premium construida con los motores del ecosistema para excursiones y alquiler de buggy.",
    href: "/projects/buzios-buggy",
    cta: "Ver proyecto",
  },
];

export default function ProjectsPage() {
  return (
    <PortalPage
      eyebrow="Casos de éxito"
      title="Proyectos creados sobre los motores del ecosistema"
      description="Conoce Buzios Buggy: paseos privativos por las playas y miradores de Búzios."
    >
      <PortalCardGrid items={projectItems} />
    </PortalPage>
  );
}
