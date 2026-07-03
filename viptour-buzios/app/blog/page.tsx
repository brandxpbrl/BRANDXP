import type { Metadata } from "next";
import { PortalPage } from "../_components/PortalPage";
import { portalConfig } from "@/config/portal";

export const metadata: Metadata = {
  title: "Blog",
  description: "Placeholder editorial para futuros artículos del ecosistema.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog",
    description: "Placeholder editorial para futuros artículos del ecosistema.",
    url: `${portalConfig.url}/blog`,
  },
};

export default function BlogPage() {
  return (
    <PortalPage
      eyebrow="Blog"
      title="No hay artículos publicados todavía"
      description="Se reserva este espacio para contenido editorial futuro sin romper la arquitectura actual."
    />
  );
}
