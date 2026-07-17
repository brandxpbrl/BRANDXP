"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import portfolioItems from "@/config/portfolio-mapping.json";

export default function Home() {
  const [selectedItem, setSelectedItem] = useState(portfolioItems[0] || null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // Programmatically clear any service worker that might be caching the old dashboard
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        if (registrations.length > 0) {
          for (let registration of registrations) {
            registration.unregister();
          }
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

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color).then(() => {
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
    });
  };

  if (!selectedItem) {
    return (
      <main className="min-h-screen bg-[#07090e] text-white flex items-center justify-center">
        <p className="text-slate-400">Cargando portafolio...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07090e] text-white flex flex-col pt-20">
      
      {/* Hero Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 mx-auto w-full max-w-[var(--container-default)] border-b border-slate-900">
        <div className="max-w-3xl">
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest bg-sky-950/40 px-3 py-1 rounded-full border border-sky-900/30">
            MPE & QUBIT ECOSISTEMA
          </span>
          <h1 className="mt-6 text-4xl sm:text-6xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Universos Visuales & Geometría Sagrada
          </h1>
          <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-400 max-w-xl">
            Diseños generados por el laboratorio de **MPE (Maximador de Posibilidades Evolutivas)** en conjunto con sensores **QUBIT**, calibrando la frecuencia y el ADN visual para cada marca.
          </p>
        </div>
      </section>

      {/* Showcase Grid */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 mx-auto w-full max-w-[var(--container-default)] flex-1 grid lg:grid-cols-[1fr_1.8fr] gap-8">
        
        {/* Left Column: Client List */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Entidades de Marca</p>
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

          {/* MPE Explanation Card */}
          <div className="rounded-2xl border border-slate-900/80 bg-slate-950/50 p-5 mt-6">
            <h4 className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-2">MPE LAB</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              **MPE (Maximador de Posibilidades Evolutivas)** actúa como un laboratorio que investiga y diseña geometrías de resonancia que actúan como mallas de decisión visual. Cada trazo y color expresa un pilar vibracional.
            </p>
          </div>
        </div>

        {/* Right Column: Visual Universe details */}
        <div className="rounded-3xl border border-slate-900 bg-[#0a0d14]/70 p-6 sm:p-8 flex flex-col justify-between min-h-[600px] relative overflow-hidden">
          
          {/* Brand Info & Sacred Geometry */}
          <div>
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
              <div>
                <span className="text-[9px] font-bold text-sky-400 uppercase tracking-widest block">{selectedItem.category}</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">{selectedItem.name}</h2>
              </div>
              
              {/* Color chips (copy on click) */}
              <div className="flex gap-2">
                {selectedItem.colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => copyToClipboard(color)}
                    className="h-6 w-6 rounded-full border border-slate-800 hover:scale-110 active:scale-95 transition-transform relative group"
                    style={{ backgroundColor: color }}
                    title={`Haga clic para copiar ${color}`}
                  >
                    <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-950 text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {copiedColor === color ? "¡Copiado!" : color}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 border-b border-slate-900/60 pb-6 mb-6">
              <div>
                <h4 className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-1">Diagnóstico QUBIT</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{selectedItem.description}</p>
              </div>
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900">
                <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Geometría Sagrada: {selectedItem.geometry}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{selectedItem.geometry_desc}</p>
              </div>
            </div>
          </div>

          {/* Big Image Viewer / Carousel */}
          <div className="my-4 aspect-video rounded-2xl border border-slate-900/80 bg-slate-950 overflow-hidden relative group">
            <Image
              src={selectedItem.images[activeImageIdx]}
              alt={`${selectedItem.name} Universo Visual - Vista ${activeImageIdx + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1200px) 100vw, 800px"
              priority
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
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/brandexperience"
              className="flex-1 text-center py-3 bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-900 rounded-xl font-semibold text-xs transition-colors"
            >
              Biblioteca Visual
            </Link>
            {selectedItem.id === "viptour" && (
              <Link
                href="/projects/viptour"
                className="cta flex-1 text-center py-3 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-sky-500/10"
              >
                Ver Landing
              </Link>
            )}
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
