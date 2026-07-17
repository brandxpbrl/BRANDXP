"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import galleryItems from "@/config/gallery-mapping.json";

export default function Home() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % galleryItems.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + galleryItems.length) % galleryItems.length);
    }
  };

  return (
    <main className="min-h-screen bg-[#07090e] text-white flex flex-col pt-20">
      
      {/* Hero Header Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 mx-auto w-full max-w-[var(--container-default)] text-center border-b border-slate-900">
        <div className="max-w-3xl mx-auto">
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest bg-sky-950/40 px-4 py-1.5 rounded-full border border-sky-900/30">
            MPE LAB & QUBIT SENSORS
          </span>
          <h1 className="mt-8 text-4xl sm:text-7xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-slate-100 to-slate-500 bg-clip-text text-transparent">
            MPE: Maximador de Posibilidades Evolutivas
          </h1>
          <p className="mt-6 text-sm sm:text-lg leading-relaxed text-slate-400 max-w-2xl mx-auto">
            Galería del laboratorio de **Geometría Sagrada** y estructuración de marca. Cada obra representa un universo visual de resonancia diseñado para expandir la identidad de nuestros clientes.
          </p>
        </div>
      </section>

      {/* Gallery Grid Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 mx-auto w-full max-w-[var(--container-default)] flex-1">
        <div className="flex justify-between items-center mb-8 border-b border-slate-900/50 pb-4">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Universos Visuales</p>
            <h2 className="text-xl font-bold mt-1 text-white">Galería de Geometría Resonante</h2>
          </div>
          <span className="text-[10px] font-mono bg-slate-950 px-3 py-1 rounded border border-slate-900 text-sky-400">
            {galleryItems.length} Diseños Únicos
          </span>
        </div>

        {/* Masonry-style Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryItems.map((imagePath, index) => (
            <div 
              key={index}
              onClick={() => openLightbox(index)}
              className="group aspect-[4/3] rounded-2xl border border-slate-900 bg-slate-950/50 overflow-hidden relative cursor-pointer hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-300"
            >
              <Image
                src={imagePath}
                alt={`Universo Visual MPE - ${index + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                loading={index < 8 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                  Ampliar Universo #{index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div 
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 cursor-zoom-out"
        >
          {/* Main Image Container */}
          <div className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-slate-900 bg-slate-950 shadow-2xl">
            <Image
              src={galleryItems[lightboxIndex]}
              alt={`Lightbox Universo Visual MPE - ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />

            {/* Navigation buttons */}
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-slate-950/80 border border-slate-800 text-white flex items-center justify-center hover:bg-slate-900 hover:border-sky-500/40 transition-colors"
              aria-label="Imagen anterior"
            >
              ←
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-slate-950/80 border border-slate-800 text-white flex items-center justify-center hover:bg-slate-900 hover:border-sky-500/40 transition-colors"
              aria-label="Siguiente imagen"
            >
              →
            </button>
          </div>

          {/* Footer Info */}
          <div className="mt-4 text-center max-w-lg">
            <p className="text-sm font-bold text-white">Universo Visual MPE #{lightboxIndex + 1}</p>
            <p className="text-xs text-slate-500 mt-1">Estructurado bajo códigos de Geometría Sagrada e Inteligencia QUBIT.</p>
            <button 
              onClick={closeLightbox}
              className="mt-4 text-xs font-semibold text-sky-400 hover:underline uppercase tracking-widest"
            >
              Cerrar Vista
            </button>
          </div>
        </div>
      )}

      {/* Admin Link footer */}
      <footer className="border-t border-slate-950 bg-slate-950/30 px-4 py-8 sm:px-6 lg:px-8 text-center text-xs text-slate-600">
        <div className="mx-auto flex justify-between items-center max-w-[var(--container-default)]">
          <p>© 2026 Brand Experience OS.</p>
          <div className="flex gap-4">
            <Link href="/brandexperience" className="hover:text-slate-400 font-semibold transition-colors">
              Biblioteca Visual
            </Link>
            <Link href="/admin" className="hover:text-slate-400 font-semibold transition-colors">
              Terminal de Administración
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
