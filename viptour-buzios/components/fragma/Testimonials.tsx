"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "A transformação foi instantânea. A Fragma não apenas tirou fotos, eles desenharam como queríamos ser vistos. Nosso volume de reservas diretas pelo site aumentou significativamente.",
    author: "Elena R.",
    role: "Diretora Geral, Pousada Mar Azul",
  },
  {
    quote: "O diagnóstico de marca revelou que nossa comunicação digital parecia barata comparada ao nosso hotel físico. O trabalho deles reposicionou nossa pousada boutique no topo do mercado de Búzios.",
    author: "Mateo S.",
    role: "Fundador, Búzios Luxury Houses",
  },
  {
    quote: "Uma visão cirúrgica e editorial. É difícil encontrar estúdios criativos com esse refino técnico internacional e domínio do ecossistema local.",
    author: "Carla V.",
    role: "CMO, Destino Concept Store",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32 px-6 bg-[#07090e] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="max-w-3xl mb-20 space-y-6">
          <span className="text-xs font-bold tracking-[0.2em] text-[#0ea5e9] uppercase">
            Testemunhos
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            O que dizem os anfitriões premium.
          </h2>
          <p className="text-gray-400 text-lg">
            Histórias de marcas que escolheram valor e exclusividade sobre conveniência.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative rounded-3xl border border-white/5 bg-[#0b0e14]/40 p-8 hover:border-white/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="absolute inset-0 bg-radial from-[#0ea5e9]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="space-y-4">
                <span className="text-5xl font-serif text-[#0ea5e9]/30 leading-none">“</span>
                <p className="text-gray-300 text-sm leading-relaxed relative z-10 italic">
                  {t.quote}
                </p>
              </div>

              <div className="border-t border-white/5 pt-6 mt-8">
                <h4 className="font-bold text-white text-sm">{t.author}</h4>
                <p className="text-gray-500 text-xs mt-1">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
