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
      description="Inicia tu proyecto de Brand Experience. Respondemos de forma inmediata para construir tu ecosistema."
      ctas={[
        { label: "Abrir WhatsApp", href: portalConfig.links.whatsapp, variant: "primary" },
        { label: "Instagram Principal", href: portalConfig.links.instagram, variant: "secondary" },
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
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-text-secondary">Canales Oficiales</p>
          <div className="mt-6 space-y-3 text-sm font-semibold text-text-primary">
            <Link href={portalConfig.links.instagram} target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-border bg-background px-4 py-4 transition-colors hover:bg-surface">
              Instagram: @brandexperience.br
            </Link>
            <Link href={portalConfig.links.instagramPersonal} target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-border bg-background px-4 py-4 transition-colors hover:bg-surface">
              Felipe Vallejo: @fela_cto
            </Link>
            <Link href={portalConfig.links.instagramTours} target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-border bg-background px-4 py-4 transition-colors hover:bg-surface">
              Fela Tours: @fela.tours
            </Link>
            <Link href={portalConfig.links.instagramMpe} target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-border bg-background px-4 py-4 transition-colors hover:bg-surface">
              MPE & QUBIT: @mpe_engine
            </Link>
            <Link href={portalConfig.links.whatsapp} target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-border bg-background px-4 py-4 transition-colors hover:bg-surface">
              WhatsApp: +55 (45) 99968-6381
            </Link>
          </div>
        </div>
      </div>
    </PortalPage>
  );
}
