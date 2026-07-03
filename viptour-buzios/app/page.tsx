import Link from "next/link";
import { PortalCardGrid } from "./_components/PortalPage";
import { portalConfig } from "@/config/portal";

const ecosystemCards = [
  {
    title: "Brand Experience",
    description:
      "Sistema de experiencias digitales pensadas para conversión, branding, UX y desarrollo de alto nivel.",
    href: "/brandexperience",
    cta: "Explorar sistema",
  },
  {
    title: "MPE",
    description:
      "Espacio institucional del proyecto con investigación, publicaciones, visión y hoja de ruta.",
    href: "/mpe",
    cta: "Ver proyecto",
  },
  {
    title: "QUBIT",
    description:
      "Página institucional para arquitectura, visión y próximos desarrollos del ecosistema.",
    href: "/qubit",
    cta: "Abrir",
  },
  {
    title: "Servicios",
    description:
      "Landing pages, Google Business, SEO, branding, automatización y consultoría en un solo lugar.",
    href: "/services",
    cta: "Ver servicios",
  },
  {
    title: "Casos de éxito",
    description:
      "Proyectos entregados sobre motores ya construidos. El primero es VIPTOUR BÚZIOS.",
    href: "/projects",
    cta: "Ir a proyectos",
  },
  {
    title: "Contacto",
    description:
      "Punto de entrada directo por WhatsApp, email y redes sociales para avanzar con cada proyecto.",
    href: "/contact",
    cta: "Contactar",
  },
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      <section id="hero" className="relative px-4 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-[var(--container-default)] gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-text-secondary">
              Portal oficial del ecosistema
            </p>
            <h1 className="mt-4 max-w-3xl text-5xl font-black tracking-tight text-text-primary sm:text-6xl">
              {portalConfig.name}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
              Un punto de acceso claro para navegar Brand Experience, MPE, QUBIT, servicios y casos de
              éxito como VIPTOUR BÚZIOS.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/projects/viptour" className="cta interactive">
                Ver caso VIPTOUR
              </Link>
              <Link href="/projects" className="interactive rounded-full border border-border px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-surface">
                Ver proyectos
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-surface p-5">
                <p className="text-sm font-semibold text-text-secondary">Brand Experience</p>
                <p className="mt-2 text-base font-bold text-text-primary">Conversión + UX + desarrollo</p>
              </div>
              <div className="rounded-2xl bg-surface p-5">
                <p className="text-sm font-semibold text-text-secondary">MPE</p>
                <p className="mt-2 text-base font-bold text-text-primary">Investigación y roadmap</p>
              </div>
              <div className="rounded-2xl bg-surface p-5">
                <p className="text-sm font-semibold text-text-secondary">QUBIT</p>
                <p className="mt-2 text-base font-bold text-text-primary">Arquitectura institucional</p>
              </div>
              <div className="rounded-2xl bg-surface p-5">
                <p className="text-sm font-semibold text-text-secondary">VIPTOUR</p>
                <p className="mt-2 text-base font-bold text-text-primary">Caso de éxito en producción</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ecosistema" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[var(--container-default)]">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-text-secondary">
              Ecosistema
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-text-primary sm:text-4xl">
              Estructura preparada para crecer sin perder claridad
            </h2>
          </div>
          <div className="mt-10">
            <PortalCardGrid items={ecosystemCards} />
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[var(--container-default)] rounded-3xl border border-border bg-surface p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-text-secondary">CTA</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-text-primary">
            ¿Listo para seguir con otro proyecto del ecosistema?
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
            El portal centraliza el acceso y deja cada producto en su propia ruta, manteniendo el
            sistema limpio para desplegar nuevos casos sin rehacer la base.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contact" className="cta interactive">
              Hablar por WhatsApp
            </Link>
            <Link href="/brandexperience" className="interactive rounded-full border border-border px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-background">
              Ver Brand Experience
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[var(--container-default)] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-extrabold tracking-tight text-text-primary">
              {portalConfig.name}
            </p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">
              Portal oficial del ecosistema con acceso directo a proyectos, servicios y contacto.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/projects" className="interactive rounded-full border border-border px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:bg-surface">
              Proyectos
            </Link>
            <Link href="/contact" className="interactive rounded-full border border-border px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:bg-surface">
              Contacto
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
