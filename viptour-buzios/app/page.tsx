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

import Link from "next/link";
import { portalConfig } from "@/config/portal";

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#0a0d14] text-slate-100 min-h-screen font-sans">
      {/* Brand Experience OS Header */}
      <header className="border-b border-slate-900 bg-[#0f131a] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-gradient-to-br from-violet-600 to-indigo-600 font-black text-sm tracking-tighter text-white">
            BE
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white leading-none">
              BRAND EXPERIENCE
            </h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-semibold">
              Creative Intelligence OS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-medium text-emerald-400 border border-emerald-950">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Sistema online
          </span>
          <span className="text-slate-400">Gemini AI</span>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="grid lg:grid-cols-[250px_1fr] min-h-[calc(100vh-69px)] bg-[#07090e]">
        
        {/* Sidebar Nav */}
        <aside className="border-r border-slate-900 bg-[#0a0d14] p-4 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Módulos Activos</p>
              <nav className="space-y-1">
                <Link href="/brandexperience" className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-900/50 border border-slate-800">
                  <span>Panel Principal</span>
                  <span className="text-[9px] bg-sky-950 text-sky-400 px-1.5 py-0.5 rounded font-mono">active</span>
                </Link>
                <Link href="/brandexperience" className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/30 transition-colors">
                  Entidades
                </Link>
                <Link href="/brandexperience" className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/30 transition-colors">
                  Chat operativo
                </Link>
                <Link href="/brandexperience" className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/30 transition-colors">
                  Núcleo de memoria
                </Link>
                <Link href="/brandexperience" className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/30 transition-colors">
                  IA visual
                </Link>
                <Link href="/brandexperience" className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/30 transition-colors">
                  Analítica
                </Link>
                <a href="http://127.0.0.1:6090" target="_blank" rel="noopener noreferrer" className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/30 transition-colors">
                  MCOS Engine
                </a>
              </nav>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Herramientas</p>
              <nav className="space-y-1">
                <Link href="/brandexperience" className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/30 transition-colors">
                  Motor cognitivo
                </Link>
                <Link href="/brandexperience" className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/30 transition-colors">
                  Portal del Cliente
                </Link>
                <Link href="/brandexperience" className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/30 transition-colors">
                  Cinematic Campaign
                </Link>
                <Link href="/brandexperience" className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/30 transition-colors">
                  Biblia de Entidad
                </Link>
                <Link href="/brandexperience" className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/30 transition-colors">
                  Estudio de estrategia
                </Link>
                <Link href="/brandexperience" className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/30 transition-colors">
                  Exportaciones
                </Link>
              </nav>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1">Contacto Oficial</p>
            <Link href="/contact" className="block rounded-lg px-3 py-2 text-xs font-semibold text-sky-400 hover:underline">
              Felipe Vallejo (CTO)
            </Link>
          </div>
        </aside>

        {/* Central Dashboard Area */}
        <div className="p-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-6 bg-[#07090e] items-start">
          
          {/* Left Column: Visual Universe Canvas */}
          <div className="rounded-3xl border border-slate-900 bg-[#0a0d14]/70 p-6 flex flex-col justify-between min-h-[500px]">
            <div>
              <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-1">Visualizer Terminal</p>
              <h2 className="text-xl font-extrabold tracking-tight text-white">Brand Experience Shell</h2>
              <p className="text-xs text-slate-400 mt-1">Ecosistema unificado de MPE & QUBIT.</p>
            </div>

            {/* Neural Matrix Abstract Visualization Placeholder */}
            <div className="my-8 aspect-video rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-950 border border-slate-900/80 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-500/5 via-transparent to-transparent opacity-50"></div>
              <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/25 mb-4 group-hover:scale-105 transition-transform duration-300">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <p className="text-sm font-extrabold text-white">Navegar por el Ecosistema</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[280px]">
                Inicializar simulador y visualizadores de onda cerebral, matrices cuánticas y mallas de hilos de MPE.
              </p>
            </div>

            <div className="flex gap-3">
              <a href="http://127.0.0.1:6090" target="_blank" rel="noopener noreferrer" className="cta flex-1 text-center py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold text-xs transition-all shadow-md hover:shadow-indigo-500/10">
                Iniciar OS Unificado
              </a>
              <Link href="/brandexperience" className="flex-1 text-center py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl font-semibold text-xs transition-colors">
                Abrir Biblioteca Visual
              </Link>
            </div>
          </div>

          {/* Right Column: Active Client Mesa de Activación & Controls */}
          <div className="space-y-6">
            
            {/* Panel 1: Entidad Asesora Status */}
            <div className="rounded-3xl border border-slate-900 bg-[#0a0d14]/70 p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Entidad Asesora</p>
                  <h3 className="text-2xl font-black text-white mt-1">Brand Experience</h3>
                </div>
                <div className="flex gap-2">
                  <span className="rounded bg-slate-900 border border-slate-800 px-2.5 py-1 text-[10px] font-bold text-sky-400 uppercase">
                    Lectura
                  </span>
                  <span className="rounded bg-slate-950/40 px-2.5 py-1 text-[10px] font-bold text-slate-500 uppercase">
                    Conversar
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Selecciona un cliente o universo visual desde el portafolio para activar la lectura de la Entidad.
              </p>
            </div>

            {/* Panel 2: Big Bang de Mundos Nodo Status */}
            <div className="rounded-3xl border border-slate-900 bg-[#0a0d14]/70 p-6 relative overflow-hidden">
              <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-1">MPE Earth Monitor</p>
              <h3 className="text-lg font-bold text-white">Big Bang De Mundos Nodo</h3>
              <p className="text-xs text-slate-400 mt-1">Delta Founder Node activo.</p>
              
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-900 text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">Nodos</span>
                  <span className="text-lg font-black text-white mt-1 block">1</span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-900 text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">Eventos</span>
                  <span className="text-lg font-black text-white mt-1 block">56</span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-900 text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">Resonancia</span>
                  <span className="text-lg font-black text-emerald-400 mt-1 block">9.68</span>
                </div>
              </div>
            </div>

            {/* Panel 3: Active Client Selector */}
            <div className="rounded-3xl border border-slate-900 bg-[#0a0d14]/70 p-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Mesa de activación</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center rounded-xl bg-slate-950/80 px-4 py-3 border border-slate-900 text-xs">
                  <span className="text-slate-400 font-medium">RJ Miranda Experience</span>
                  <span className="text-[9px] bg-slate-900 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded font-semibold">Ready</span>
                </div>
                <div className="flex justify-between items-center rounded-xl bg-slate-950/80 px-4 py-3 border border-slate-900 text-xs">
                  <span className="text-slate-400 font-medium">Mau Viagens Tours</span>
                  <span className="text-[9px] bg-slate-900 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded font-semibold">Ready</span>
                </div>
                <div className="flex justify-between items-center rounded-xl bg-slate-950/80 px-4 py-3 border border-slate-900 text-xs">
                  <span className="text-slate-400 font-medium">Duality Tokyo</span>
                  <span className="text-[9px] bg-slate-900 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded font-semibold">Ready</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
