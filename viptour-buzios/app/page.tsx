import Link from "next/link";
import { PortalCardGrid } from "./_components/PortalPage";
import { portalConfig } from "@/config/portal";

import Link from "next/link";
import { portalConfig } from "@/config/portal";

const ecosystemCards = [
  {
    title: "Brand Experience",
    description: "Centro de inteligencia creativa para leer marcas, activar agentes y convertir estrategia en entregables observables.",
    href: "http://127.0.0.1:6090",
    cta: "Acceder al OS",
  },
  {
    title: "MPE Engine",
    description: "MPE Runtime OS. Panel de control del runtime de simulación unificado para Big Bang De Mundos.",
    href: "http://127.0.0.1:6090",
    cta: "Abrir Consola",
  },
  {
    title: "QUBIT",
    description: "Servidor de arquitectura y motor cognitivo integrado en el ecosistema.",
    href: "http://127.0.0.1:6090",
    cta: "Conectar",
  },
  {
    title: "Servicios",
    description: "Landing pages premium, consultoría AI y desarrollo de ecosistemas de conversión.",
    href: "/contact",
    cta: "Solicitar acceso",
  },
  {
    title: "Contacto Directo",
    description: "Comunícate directamente con el CTO Felipe Vallejo para integrar y desplegar nuevos nodos.",
    href: "/contact",
    cta: "Escribir",
  }
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-slate-950 text-slate-100 min-h-screen">
      <section id="hero" className="relative px-4 pt-32 pb-20 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
        <div className="mx-auto grid w-full max-w-[var(--container-default)] gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">
              Control Unificado
            </p>
            <h1 className="mt-4 max-w-3xl text-5xl font-black tracking-tight text-white sm:text-6xl">
              Brand Experience OS
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Sistema operativo unificado e inteligencia cognitiva. Accede directamente al panel local del motor o explora la biblioteca de tus clientes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="http://127.0.0.1:6090" target="_blank" rel="noopener noreferrer" className="cta interactive bg-sky-500 hover:bg-sky-400 text-white rounded-full px-6 py-3 font-semibold text-sm transition-all shadow-lg shadow-sky-500/20">
                Iniciar OS (Puerto 6090)
              </a>
              <Link href="/brandexperience" className="interactive rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-900">
                Biblioteca Visual
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Estado del Sistema Unificado</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-950/80 p-5 border border-slate-800">
                <p className="text-xs font-semibold text-slate-400">Brand Experience</p>
                <p className="mt-2 text-sm font-bold text-sky-400 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Creative Intelligence OS
                </p>
              </div>
              <div className="rounded-2xl bg-slate-950/80 p-5 border border-slate-800">
                <p className="text-xs font-semibold text-slate-400">MPE Runtime</p>
                <p className="mt-2 text-sm font-bold text-sky-400 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Big Bang De Mundos
                </p>
              </div>
              <div className="rounded-2xl bg-slate-950/80 p-5 border border-slate-800">
                <p className="text-xs font-semibold text-slate-400">QUBIT Engine</p>
                <p className="mt-2 text-sm font-bold text-sky-400 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Cognitive Core
                </p>
              </div>
              <div className="rounded-2xl bg-slate-950/80 p-5 border border-slate-800">
                <p className="text-xs font-semibold text-slate-400">RioVibes Transfer</p>
                <p className="mt-2 text-sm font-bold text-slate-400">Hub / Portal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ecosistema" className="px-4 py-20 sm:px-6 lg:px-8 border-t border-slate-900">
        <div className="mx-auto w-full max-w-[var(--container-default)]">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">
              Ecosistema
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Nodos de Trabajo y Control OS
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ecosystemCards.map((item) => (
              <a key={item.title} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="group rounded-3xl border border-slate-800 bg-slate-900/30 p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:bg-slate-900/50">
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>
                <span className="mt-6 inline-flex text-sm font-semibold text-sky-400 transition-colors group-hover:text-sky-300">
                  {item.cta}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>


      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[var(--container-default)] rounded-3xl border border-slate-800 bg-slate-900/20 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">Despliegue</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
            ¿Listo para construir un nuevo portal?
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
            El ecosistema centraliza el acceso y la inteligencia cognitiva. Conecta nuevos agentes, automatizaciones y visualiza tus universos de marca.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contact" className="cta interactive bg-sky-500 hover:bg-sky-400 text-white rounded-full px-6 py-3 font-semibold text-sm transition-all">
              Hablar por WhatsApp
            </Link>
            <Link href="/brandexperience" className="interactive rounded-full border border-slate-800 px-6 py-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-900">
              Ver Biblioteca Visual
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-900 bg-slate-950 px-4 py-10 sm:px-6 lg:px-8 text-slate-400">
        <div className="mx-auto flex w-full max-w-[var(--container-default)] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-extrabold tracking-tight text-white">
              {portalConfig.name}
            </p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Portal oficial y centro de inteligencia creativa del ecosistema Brand Experience, MPE & QUBIT.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="interactive rounded-full border border-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-900">
              Contacto
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
