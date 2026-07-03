import type { Metadata } from "next";
import { PortalCardGrid, PortalPage } from "../_components/PortalPage";
import { portalConfig } from "@/config/portal";

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Casos de éxito del ecosistema, comenzando por VIPTOUR BÚZIOS.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Proyectos",
    description: "Casos de éxito del ecosistema, comenzando por VIPTOUR BÚZIOS.",
    url: `${portalConfig.url}/projects`,
  },
};

const projectItems = [
  {
    title: "VIPTOUR BÚZIOS",
    description:
      "Landing premium construida con los motores del ecosistema para excursiones y alquiler de buggy.",
    href: "/projects/viptour",
    cta: "Ver proyecto",
  },
];

export default function ProjectsPage() {
  return (
    <PortalPage
      eyebrow="Casos de éxito"
      title="Proyectos creados sobre los motores del ecosistema"
      description="La primera tarjeta está reservada para VIPTOUR BÚZIOS y redirige a la landing ya construida."
    >
      <PortalCardGrid items={projectItems} />
    </PortalPage>
  );
}
