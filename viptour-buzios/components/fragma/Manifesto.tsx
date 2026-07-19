"use client";

import { motion } from "framer-motion";

export default function Manifesto() {
  return (
    <section className="py-32 md:py-44 px-6 bg-[#050505] text-center relative overflow-hidden">
      
      {/* Subtle radial lights */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[#FF3D8E]/5 to-transparent blur-3xl opacity-40" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-xs font-bold tracking-[0.3em] text-[#D6A24A] uppercase mb-6"
        >
          Nosso Manifesto
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight font-primary"
        >
          Não criamos apenas imagens.<br />
          <span className="text-[#D6A24A]">Criamos percepção.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 space-y-6 max-w-2xl text-lg sm:text-xl text-gray-400 font-serif leading-relaxed"
        >
          <p className="font-bold text-white text-2xl not-italic">
            Toda empresa comunica. Poucas comunicam valor.
          </p>
          <p className="text-gray-400 text-base sm:text-lg not-italic">
            Na FRAGMA Brand Experience unimos estratégia, branding, direção criativa, produção visual e tecnologia para transformar negócios em marcas memoráveis.
          </p>
        </motion.div>
      </div>
      
    </section>
  );
}
