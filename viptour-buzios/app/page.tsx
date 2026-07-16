"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const portfolioItems = [
  {
    id: "viptour",
    name: "VIPTOUR BÚZIOS",
    category: "Turismo y Aventura",
    description: "Plataforma de reservas de excursiones y alquiler de buggy premium en Armação dos Búzios, Brasil. Foco en reservas de alta velocidad e interfaz premium.",
    images: [
      "/portfolio/viptour/image-1.png",
      "/portfolio/viptour/image-2.png",
      "/portfolio/viptour/image-3.png",
    ],
    colors: ["#0284c7", "#0f172a", "#f8fafc"],
    cta: "/projects/viptour",
    ctaLabel: "Ver Landing"
  },
  {
    id: "miranda-experience",
    name: "Miranda Experience",
    category: "Servicios Premium",
    description: "Servicio exclusivo de turismo receptivo boutique y experiencias premium personalizadas en Río de Janeiro.",
    images: [
      "/portfolio/miranda-experience/image-1.png",
      "/portfolio/miranda-experience/image-2.png",
      "/portfolio/miranda-experience/image-3.png",
    ],
    colors: ["#c084fc", "#1e1b4b", "#faf5ff"],
    cta: null,
    ctaLabel: "Ver Universo"
  },
  {
    id: "mau-viagens",
    name: "Mau Viagens Tours",
    category: "Turismo",
    description: "Consultora y operadora de viajes personalizados, enfocada en conectar a viajeros de Argentina y Brasil con destinos de playa auténticos.",
    images: [
      "/portfolio/mau-viagens/image-1.png",
      "/portfolio/mau-viagens/image-2.png",
      "/portfolio/mau-viagens/image-3.png",
    ],
    colors: ["#e11d48", "#0f172a", "#fff1f2"],
    cta: null,
    ctaLabel: "Ver Universo"
  },
  {
    id: "ryaan-louis",
    name: "Ryaan Louis",
    category: "Diseño & Moda",
    description: "Identidad visual de autor para una marca independiente de moda y estilo urbano de alta costura.",
    images: [
      "/portfolio/ryaan-louis/image-1.png",
      "/portfolio/ryaan-louis/image-2.png",
      "/portfolio/ryaan-louis/image-3.png",
    ],
    colors: ["#14b8a6", "#111827", "#f0fdfa"],
    cta: null,
    ctaLabel: "Ver Universo"
  },
  {
    id: "nicolas-cabrera",
    name: "Nicolas Cabrera",
    category: "Dirección Creativa",
    description: "Portafolio de consultoría de marca, fotografía y dirección creativa de autor con estética vanguardista.",
    images: [
      "/portfolio/nicolas-cabrera/image-1.png",
      "/portfolio/nicolas-cabrera/image-2.png",
      "/portfolio/nicolas-cabrera/image-3.png",
    ],
    colors: ["#f59e0b", "#18181b", "#fffbeb"],
    cta: null,
    ctaLabel: "Ver Universo"
  },
  {
    id: "vmais-tour",
    name: "Vmais Tour",
    category: "Traslados VIP",
    description: "Logística y traslados privados corporativos de alta gama con foco en la comodidad, puntualidad y servicio concierge.",
    images: [
      "/portfolio/vmais-tour/image-1.png",
      "/portfolio/vmais-tour/image-2.png",
      "/portfolio/vmais-tour/image-3.png",
    ],
    colors: ["#3b82f6", "#0f172a", "#eff6ff"],
    cta: null,
    ctaLabel: "Ver Universo"
  },
  {
    id: "psicotherapiasoyluz",
    name: "Psicotherapia & Luz",
    category: "Bienestar",
    description: "Identidad mística y moderna para portal holístico de expansión de conciencia y terapias alternativas.",
    images: [
      "/portfolio/psicotherapiasoyluz/image-1.png",
      "/portfolio/psicotherapiasoyluz/image-2.png",
      "/portfolio/psicotherapiasoyluz/image-3.png",
    ],
    colors: ["#8b5cf6", "#1e1b4b", "#faf5ff"],
    cta: null,
    ctaLabel: "Ver Universo"
  }
];

export default function Home() {
  const [selectedItem, setSelectedItem] = useState(portfolioItems[0]);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Programmatically clear any service worker that might be caching the old dashboard
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        if (registrations.length > 0) {
          for (let registration of registrations) {
            registration.unregister();
          }
          // Clear caches and reload
          if (window.caches) {
            caches.keys().then((names) => {
              for (let name of names) caches.delete(name);
            }).then(() => {
              window.location.reload();
            });
          } else {
            window.location.reload();
          }
        }
      });
    }
  }, []);

  const handleSelect = (item: typeof portfolioItems[0]) => {
    setSelectedItem(item);
    setActiveImageIdx(0);
  };

  return (
    <main className="min-h-screen bg-[#07090e] text-white flex flex-col pt-20">
      {/* Hero Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 mx-auto w-full max-w-[var(--container-default)] border-b border-slate-900">
        <div className="max-w-3xl">
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest bg-sky-950/40 px-3 py-1 rounded-full border border-sky-900/30">
            Brand Experience Engine
          </span>
          <h1 className="mt-6 text-4xl sm:text-6xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Universos Visuales & Portafolio de Marca
          </h1>
          <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-400 max-w-xl">
            Diseñamos e implementamos experiencias digitales que transmiten confianza, posicionan la marca y maximizan conversiones.
          </p>
        </div>
      </section>

      {/* Showcase Grid */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 mx-auto w-full max-w-[var(--container-default)] flex-1 grid lg:grid-cols-[1fr_1.5fr] gap-8">
        
        {/* Left Column: Client List */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Mesa de Proyectos</p>
          <div className="space-y-2">
            {portfolioItems.map((item) => {
              const isSelected = selectedItem.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all flex justify-between items-center ${
                    isSelected 
                      ? "border-sky-500/40 bg-sky-950/20 text-white shadow-lg shadow-sky-500/5" 
                      : "border-slate-900 bg-slate-950/40 text-slate-400 hover:border-slate-800 hover:bg-slate-900/20 hover:text-white"
                  }`}
                >
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider block opacity-75 mb-1">{item.category}</span>
                    <span className="font-extrabold text-sm tracking-tight">{item.name}</span>
                  </div>
                  {isSelected && (
                    <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Visual Universe details */}
        <div className="rounded-3xl border border-slate-900 bg-[#0a0d14]/70 p-6 sm:p-8 flex flex-col justify-between min-h-[500px]">
          
          {/* Brand Info */}
          <div>
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
              <div>
                <span className="text-[9px] font-bold text-sky-400 uppercase tracking-widest">{selectedItem.category}</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">{selectedItem.name}</h2>
              </div>
              <div className="flex gap-2">
                {selectedItem.colors.map((color, idx) => (
                  <span
                    key={idx}
                    className="h-4 w-4 rounded-full border border-slate-800"
                    style={{ backgroundColor: color }}
                    title={`Color ${idx + 1}: ${color}`}
                  />
                ))}
              </div>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              {selectedItem.description}
            </p>
          </div>

          {/* Big Image Viewer / Carousel */}
          <div className="my-8 aspect-video rounded-2xl border border-slate-900/80 bg-slate-950 overflow-hidden relative group">
            <Image
              src={selectedItem.images[activeImageIdx]}
              alt={`${selectedItem.name} Universo Visual - Vista ${activeImageIdx + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Carousel navigation overlay */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {selectedItem.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`h-1.5 w-6 rounded-full transition-all ${
                    idx === activeImageIdx ? "bg-sky-400" : "bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Ver imagen ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap gap-3">
            {selectedItem.cta ? (
              <Link
                href={selectedItem.cta}
                className="cta flex-1 text-center py-3 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-sky-500/10"
              >
                {selectedItem.ctaLabel}
              </Link>
            ) : (
              <div className="flex-1 text-center py-3 bg-slate-900 text-slate-400 border border-slate-800/80 rounded-xl font-semibold text-xs">
                Caso de Estudio
              </div>
            )}
            <Link
              href="/brandexperience"
              className="flex-1 text-center py-3 bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-900 rounded-xl font-semibold text-xs transition-colors"
            >
              Biblioteca Visual
            </Link>
          </div>

        </div>

      </section>

      {/* Admin Link footer */}
      <footer className="border-t border-slate-950 bg-slate-950/30 px-4 py-8 sm:px-6 lg:px-8 text-center text-xs text-slate-600">
        <div className="mx-auto flex justify-between items-center max-w-[var(--container-default)]">
          <p>© 2026 Brand Experience OS.</p>
          <Link href="/admin" className="hover:text-slate-400 font-semibold transition-colors">
            Terminal de Administración
          </Link>
        </div>
      </footer>
    </main>
  );
}
