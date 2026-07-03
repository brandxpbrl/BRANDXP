import type { Metadata } from "next";
import { PortalPage } from "../_components/PortalPage";
import { portalConfig } from "@/config/portal";

export const metadata: Metadata = {
  title: "Brand Experience",
  description:
    "Sistema para crear experiencias digitales de alta conversión mediante estrategia, branding, UX y desarrollo.",
  alternates: { canonical: "/brandexperience" },
  openGraph: {
    title: "Brand Experience",
    description:
      "Sistema para crear experiencias digitales de alta conversión mediante estrategia, branding, UX y desarrollo.",
    url: `${portalConfig.url}/brandexperience`,
  },
};

export default function BrandExperiencePage() {
  return (
    <PortalPage
      eyebrow="Brand Experience"
      title="Sistema para experiencias digitales de alta conversión"
      description="Estructura institucional dedicada a estrategia, branding, UX y desarrollo para convertir intención en resultados."
    />
  );
}
