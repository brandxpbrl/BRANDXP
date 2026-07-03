import type { Metadata } from "next";
import { PortalCardGrid, PortalPage } from "../_components/PortalPage";
import { portalConfig } from "@/config/portal";

export const metadata: Metadata = {
  title: "Servicios",
  description: "Landing pages, Google Business, SEO, branding, automatización y consultoría.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Servicios",
    description: "Landing pages, Google Business, SEO, branding, automatización y consultoría.",
    url: `${portalConfig.url}/services`,
  },
};

const serviceItems = [
  { title: "Landing Pages", description: "Estructuras de conversión para campañas y productos." },
  { title: "Google Business", description: "Optimización y orden de presencia local." },
  { title: "SEO", description: "Fundamentos técnicos y contenido alineado a búsqueda." },
  { title: "Branding", description: "Sistema visual y narrativo para marcas consistentes." },
  { title: "Automatización", description: "Procesos y flujos para reducir fricción operativa." },
  { title: "Consultoría", description: "Acompañamiento para decisiones de arquitectura y producto." },
];

export default function ServicesPage() {
  return (
    <PortalPage
      eyebrow="Servicios"
      title="Capas de servicio del ecosistema"
      description="Tarjetas placeholder elegantes para mostrar la oferta del sistema sin mezclarla con la landing de VIPTOUR."
    >
      <PortalCardGrid items={serviceItems} />
    </PortalPage>
  );
}
