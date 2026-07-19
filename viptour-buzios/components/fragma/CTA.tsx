"use client";

import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section id="solicitar" className="py-24 md:py-36 px-6 bg-gradient-to-b from-[#07090e] via-[#0b0e14] to-black border-t border-white/5 relative flex items-center justify-center text-center overflow-hidden">
      
      {/* Light glow effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-radial from-[#0ea5e9]/10 to-transparent blur-3xl opacity-60" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8 flex flex-col items-center">
        
        <span className="text-xs font-bold tracking-[0.3em] text-[#0ea5e9] uppercase">
          Eleve Seu Negócio
        </span>

        <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight max-w-3xl">
          Sua marca merece ser lembrada.
        </h2>

        <p className="text-gray-400 text-base sm:text-lg max-w-2xl leading-relaxed">
          Vamos desenhar a linguagem que seu negócio precisa para atrair clientes qualificados e consolidar sua exclusividade no mercado. Agende uma conversa diagnóstica.
        </p>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="pt-4"
        >
          <a
            href="https://wa.me/5545999686381?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20um%20diagn%C3%B3stico%20de%20Brand%20Experience%20para%20minha%20marca."
            target="_blank"
            rel="noopener noreferrer"
            className="cta interactive inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-white text-sm tracking-wide bg-[#0ea5e9] hover:bg-[#0284c7] transition-all duration-300"
          >
            Agendar uma reunião
          </a>
        </motion.div>

        <div className="flex gap-8 text-[10px] tracking-widest font-mono text-gray-500 uppercase pt-8 border-t border-white/5 w-full justify-center">
          <span>ATENDIMENTO CONCIERGE</span>
          <span>•</span>
          <span>BÚZIOS & RIO DE JANEIRO</span>
        </div>

      </div>
    </section>
  );
}
