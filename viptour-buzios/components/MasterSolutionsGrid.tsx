'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, LayoutGrid, X } from 'lucide-react';
import { useState } from 'react';

const services = [
  { title: 'Brand Experience', category: 'BRANDING & IDENTITY', description: 'Construcción y reconstrucción integral de identidad de marcas con un enfoque de alto nivel.', slug: '/brand-experience', tagColor: 'from-cyan-500 to-blue-600' },
  { title: 'MPE Lab', category: 'MAXIMIZADOR EVOLUTIVO', description: 'Maximizado de posibilidades evolutivas y modelado matemático aplicado a negocios.', slug: '/mpe', tagColor: 'from-purple-500 to-indigo-600' },
  { title: 'QUBIT Engine', category: 'AI & META-NODES', description: 'Plataforma desarrollada con nodos que alimentan IA y generan universos digitales.', slug: '/qubit', tagColor: 'from-emerald-400 to-teal-600' },
  { title: 'Fragma Studio', category: 'VISUAL ART & PHOTO', description: 'Estudio fotográfico de alto nivel especializado en hospitalidad, lujo y branding visual.', slug: '/fragma-brand-experience', tagColor: 'from-pink-500 to-rose-600' },
  { title: 'Bespoke Woodcraft', category: 'CUSTOM CRAFTSMANSHIP', description: 'Carpintería de diseño a medida, muebles personalizados y estructuras de madera de alta gama.', slug: '/gonzalo', tagColor: 'from-orange-400 to-amber-600' },
  { title: 'Electrical Solutions', category: 'INFRASTRUCTURE & POWER', description: 'Instalaciones eléctricas residenciales y comerciales de alta seguridad, domótica y soluciones energéticas.', slug: '/services', tagColor: 'from-yellow-400 to-amber-500' },
  { title: 'VIPTOUR Búzios', category: 'LIVE DEPLOYMENT', description: 'Premium buggy rental and tour agency portal operating live inside the ORBIS connected ecosystem.', slug: '/projects/viptour', tagColor: 'from-green-400 to-emerald-600' },
  { title: 'ZAPT Delivery Búzios', category: 'NIGHT DELIVERY · LIVE SITE', description: 'Experiência digital oficial para delivery de madrugada em Búzios, com cardápio, combos e pedidos pelo WhatsApp.', slug: '/zaptdeliverybz', tagColor: 'from-lime-300 to-fuchsia-500' }
];

const siteServices = services.filter((service) => ['/brand-experience', '/mpe', '/qubit', '/fragma-brand-experience', '/projects/viptour', '/zaptdeliverybz'].includes(service.slug));

export default function MasterSolutionsGrid() {
  const [isSitesOpen, setIsSitesOpen] = useState(false);

  return (
    <section className="relative w-full min-h-screen bg-transparent text-white py-20 px-6 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-900/20 blur-[120px] pointer-events-none rounded-full" />
      <div className="max-w-6xl w-full z-10">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-semibold bg-cyan-950/40 border border-cyan-800/50 px-4 py-1.5 rounded-full">THE CONNECTED ECOSYSTEM</span>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-[0.14em] mt-6 text-white">ORBIS</h1>
          <p className="mt-3 text-[10px] md:text-xs font-semibold tracking-[0.32em] text-cyan-200/80">EVERYTHING, CONNECTED.</p>
          <p className="text-slate-400 mt-5 max-w-xl mx-auto text-sm md:text-base">Marcas, servicios, proyectos y experiencias independientes conectados dentro de un mismo ecosistema.</p>
          <button type="button" onClick={() => setIsSitesOpen(true)} className="mt-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-cyan-300 transition hover:border-cyan-300/70 hover:bg-cyan-400/20"><LayoutGrid size={15} />Ver todos nuestros Sites</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div key={index} whileHover={{ scale: 1.01, y: -2 }} transition={{ duration: 0.2 }} className="group relative bg-[#0b0c14]/80 border border-slate-800/80 hover:border-slate-600 p-8 rounded-2xl backdrop-blur-xl shadow-2xl transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent rounded-2xl pointer-events-none" />
              <div className="flex justify-between items-start mb-6"><span className={`text-[10px] font-bold tracking-widest uppercase bg-gradient-to-r ${service.tagColor} bg-clip-text text-transparent`}>{service.category}</span><span className="w-2 h-2 rounded-full bg-slate-700 group-hover:bg-cyan-400 transition-colors shadow-[0_0_8px_rgba(34,211,238,0.5)]" /></div>
              <h3 className="text-2xl font-semibold text-slate-100 group-hover:text-white transition-colors mb-3">{service.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">{service.description}</p>
              <Link href={service.slug} className="inline-flex items-center text-xs font-semibold tracking-wider uppercase text-slate-300 group-hover:text-cyan-400 transition-colors">Explorar Servicio<span className="ml-2 group-hover:translate-x-1 transition-transform">→</span></Link>
            </motion.div>
          ))}
        </div>
      </div>
      {isSitesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md" role="presentation" onClick={() => setIsSitesOpen(false)}>
          <div className="relative max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-cyan-400/25 bg-[#080a12]/95 p-6 shadow-[0_0_80px_rgba(14,165,233,0.15)] md:p-10" role="dialog" aria-modal="true" aria-labelledby="sites-dialog-title" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setIsSitesOpen(false)} aria-label="Cerrar ventana de Sites" className="absolute right-5 top-5 rounded-full border border-white/10 p-2 text-slate-400 transition hover:border-white/30 hover:text-white"><X size={18} /></button>
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-300">ORBIS · LIVE EXPERIENCES</span>
            <h2 id="sites-dialog-title" className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-white md:text-5xl">Todos nuestros <span className="text-cyan-300">Sites.</span></h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">Experiencias digitales independientes conectadas dentro del ecosistema ORBIS.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {siteServices.map((service) => (
                <Link key={service.slug} href={service.slug} onClick={() => setIsSitesOpen(false)} className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-cyan-300/[0.06]">
                  <span className={`bg-gradient-to-r ${service.tagColor} bg-clip-text text-[10px] font-bold uppercase tracking-[0.18em] text-transparent`}>{service.category}</span>
                  <span className="mt-3 flex items-center justify-between text-lg font-semibold text-slate-100">{service.title}<ArrowUpRight size={17} className="text-cyan-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
                  <span className="mt-2 block text-xs leading-relaxed text-slate-400">{service.description}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
