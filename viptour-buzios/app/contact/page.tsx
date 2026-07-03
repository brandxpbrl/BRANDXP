import type { Metadata } from "next";
import Link from "next/link";
import { PortalPage } from "../_components/PortalPage";
import { portalConfig } from "@/config/portal";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Formulario visual, WhatsApp, email y redes para iniciar conversaciones.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contacto",
    description: "Formulario visual, WhatsApp, email y redes para iniciar conversaciones.",
    url: `${portalConfig.url}/contact`,
  },
};

export default function ContactPage() {
  return (
    <PortalPage
      eyebrow="Contacto"
      title="Un punto claro para conversar y avanzar"
      description="El formulario es visual y el contacto principal sigue siendo WhatsApp para responder rápido."
      ctas={[
        { label: "Abrir WhatsApp", href: "https://wa.me/552223503366", variant: "primary" },
        { label: "Escribir email", href: "mailto:contato@viptourbuzios.com", variant: "secondary" },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-border bg-background p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-text-secondary">Formulario visual</p>
          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl bg-surface p-4 text-sm text-text-secondary">Nombre</div>
            <div className="rounded-2xl bg-surface p-4 text-sm text-text-secondary">Email</div>
            <div className="rounded-2xl bg-surface p-4 text-sm text-text-secondary">Mensaje</div>
            <div className="rounded-2xl bg-surface p-4 text-sm text-text-secondary">Servicio de interés</div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-text-secondary">Redes</p>
          <div className="mt-6 space-y-3 text-sm font-semibold text-text-primary">
            <Link href="https://www.instagram.com/viptourbuzios" target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-border bg-background px-4 py-4 transition-colors hover:bg-surface">
              Instagram
            </Link>
            <Link href="https://wa.me/552223503366" target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-border bg-background px-4 py-4 transition-colors hover:bg-surface">
              WhatsApp
            </Link>
            <div className="rounded-2xl border border-border bg-background px-4 py-4">
              Email: contato@viptourbuzios.com
            </div>
          </div>
        </div>
      </div>
    </PortalPage>
  );
}
