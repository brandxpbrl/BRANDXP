'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const services = [
  {
    title: 'Brand Experience',
    category: 'BRANDING & IDENTITY',
    description: 'Construcción y reconstrucción integral de identidad de marcas con un enfoque de alto nivel.',
    slug: '/brand-experience',
    tagColor: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'MPE Lab',
    category: 'MAXIMIZADOR EVOLUTIVO',
    description: 'Maximizado de posibilidades evolutivas y modelado matemático aplicado a negocios.',
    slug: '/mpe',
    tagColor: 'from-purple-500 to-indigo-600',
  },
  {
    title: 'QUBIT Engine',
    category: 'AI & META-NODES',
    description: 'Plataforma desarrollada con nodos que alimentan IA y generan universos digitales.',
    slug: '/qubit',
    tagColor: 'from-emerald-400 to-teal-600',
  },
  {
    title: 'Fragma Studio',
    category: 'VISUAL ART & PHOTO',
    description: 'Estudio fotográfico de alto nivel especializado en hospitalidad, lujo y branding visual.',
    slug: '/fragma-brand-experience',
    tagColor: 'from-pink-500 to-rose-600',
  },
  {
    title: 'Bespoke Woodcraft',
    category: 'CUSTOM CRAFTSMANSHIP',
    description: 'Carpintería de diseño a medida, muebles personalizados y estructuras de madera de alta gama.',
    slug: '/gonzalo',
    tagColor: 'from-orange-400 to-amber-600',
  },
  {
    title: 'Electrical Solutions',
    category: 'INFRASTRUCTURE & POWER',
    description: 'Instalaciones eléctricas residenciales y comerciales de alta seguridad, domótica y soluciones energéticas.',
    slug: '/services',
    tagColor: 'from-yellow-400 to-amber-500',
  },
  {
    title: 'VIPTOUR Búzios',
    category: 'LIVE DEPLOYMENT',
    description: 'Premium buggy rental and tour agency portal operating live, built directly on top of the Master Solutions ecosystem core.',
    slug: '/projects/viptour',
    tagColor: 'from-green-400 to-emerald-600',
  }
];

export default function MasterSolutionsGrid() {
  return (
    <section className="relative w-full min-h-screen bg-transparent text-white py-20 px-6 flex flex-col items-center justify-center overflow-hidden">
      {/* Fondo con brillo ambiental difuso */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-900/20 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-6xl w-full z-10">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-semibold bg-cyan-950/40 border border-cyan-800/50 px-4 py-1.5 rounded-full">
            The Digital Super Platform
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mt-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            MASTER SOLUTIONS
          </h1>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm md:text-base">
            Servicios especializados independientes evolucionando hacia un ecosistema integrado de alta tecnología.
          </p>
        </div>

        {/* Grid de Servicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.01, y: -2 }}
              transition={{ duration: 0.2 }}
              className="group relative bg-[#0b0c14]/80 border border-slate-800/80 hover:border-slate-600 p-8 rounded-2xl backdrop-blur-xl shadow-2xl transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent rounded-2xl pointer-events-none" />
              
              <div className="flex justify-between items-start mb-6">
                <span className={`text-[10px] font-bold tracking-widest uppercase bg-gradient-to-r ${service.tagColor} bg-clip-text text-transparent`}>
                  {service.category}
                </span>
                <span className="w-2 h-2 rounded-full bg-slate-700 group-hover:bg-cyan-400 transition-colors shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
              </div>

              <h3 className="text-2xl font-semibold text-slate-100 group-hover:text-white transition-colors mb-3">
                {service.title}
              </h3>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                {service.description}
              </p>

              <Link 
                href={service.slug}
                className="inline-flex items-center text-xs font-semibold tracking-wider uppercase text-slate-300 group-hover:text-cyan-400 transition-colors"
              >
                Explorar Servicio 
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
