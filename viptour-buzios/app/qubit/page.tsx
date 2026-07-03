import type { Metadata } from "next";
import { PortalCardGrid, PortalPage } from "../_components/PortalPage";
import { portalConfig } from "@/config/portal";

export const metadata: Metadata = {
  title: "QUBIT",
  description: "Página institucional con hero, arquitectura, visión y próximos desarrollos.",
  alternates: { canonical: "/qubit" },
  openGraph: {
    title: "QUBIT",
    description: "Página institucional con hero, arquitectura, visión y próximos desarrollos.",
    url: `${portalConfig.url}/qubit`,
  },
};

const qubitItems = [
  { title: "Qué es", description: "Placeholder para explicar el rol del sistema dentro del ecosistema." },
  { title: "Arquitectura", description: "Base visual para representar estructura y componentes." },
  { title: "Visión", description: "Espacio para el objetivo institucional del proyecto." },
  { title: "Próximos desarrollos", description: "Lista viva de las siguientes iteraciones del producto." },
];

export default function QubitPage() {
  return (
    <PortalPage
      eyebrow="QUBIT"
      title="Página institucional de arquitectura y visión"
      description="Un espacio limpio para presentar el proyecto sin inventar contenido técnico y dejando lista la evolución futura."
    >
      <PortalCardGrid items={qubitItems} />
    </PortalPage>
  );
}
