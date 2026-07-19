"use client";

import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section id="solicitar" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] py-24 px-6 border-t border-white/5">
      
      {/* Dark Cinematic Background & Soft Blurred Lights */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-radial from-[#D6A24A]/10 to-transparent blur-3xl opacity-50" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-radial from-[#FF3D8E]/5 to-transparent blur-3xl opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/60 to-[#050505]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 flex flex-col items-center">
        
        <motion.span 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-xs font-bold tracking-[0.3em] text-[#D6A24A] uppercase"
        >
          Eleve Seu Negócio
        </motion.span>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight max-w-3xl font-primary"
        >
          Sua marca merece ser lembrada.
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-gray-400 text-lg sm:text-xl max-w-2xl leading-relaxed"
        >
          Transformamos estratégia, imagem e tecnologia em percepção de valor.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
        >
          <a
            href="https://wa.me/5545999686381?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20um%20diagn%C3%B3stico%20de%20Brand%20Experience%20para%20minha%20marca."
            target="_blank"
            rel="noopener noreferrer"
            className="cta interactive inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-black text-sm tracking-wide bg-[#D6A24A] hover:bg-[#c3913e] transition-all duration-300"
            style={{ background: 'linear-gradient(180deg, #F5D08C 0%, #D6A24A 100%)' }}
          >
            Solicitar Diagnóstico
          </a>
          <a
            href="https://wa.me/5545999686381?text=Ol%C3%A1%2C%20gostaria%20de%20conversar%20com%20a%20equipe%20da%20Fragma."
            target="_blank"
            rel="noopener noreferrer"
            className="interactive inline-flex items-center justify-center rounded-full border border-white/10 px-8 py-4 text-sm font-semibold text-white bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md"
          >
            Falar com nossa equipe
          </a>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-[10px] tracking-[0.4em] font-mono text-gray-500 uppercase pt-8 border-t border-white/5 w-full justify-center flex gap-3"
        >
          <span>Búzios</span>
          <span>•</span>
          <span>Rio de Janeiro</span>
        </motion.div>

      </div>
    </section>
  );
}


