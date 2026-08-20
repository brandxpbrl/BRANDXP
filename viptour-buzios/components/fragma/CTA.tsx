"use client";

import { motion } from "framer-motion";
import { FragmaHorizonLight } from "@/components/fragma/foundations";

export default function CTA() {
  return (
    <section id="solicitar" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#FAF7F2] py-24 px-6 border-t border-black/10">
      
      {/* Dark Cinematic Background & Soft Blurred Lights */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <FragmaHorizonLight className="absolute inset-x-0 bottom-0 h-2/3 opacity-100" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 flex flex-col items-center">
        
        <motion.span 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="fragma-eyebrow"
        >
          Eleve Seu Negócio
        </motion.span>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="fragma-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#1F1F1F] leading-tight max-w-3xl"
        >
          Sua marca merece ser lembrada.
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="fragma-body text-[#8E7867] text-lg sm:text-xl max-w-2xl leading-relaxed"
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
            className="fragma-button fragma-button-earth cta interactive"
          >
            Solicitar Diagnóstico
          </a>
          <a
            href="https://wa.me/5545999686381?text=Ol%C3%A1%2C%20gostaria%20de%20conversar%20com%20a%20equipe%20da%20Fragma."
            target="_blank"
            rel="noopener noreferrer"
            className="fragma-button fragma-button-light interactive"
          >
            Falar com nossa equipe
          </a>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="fragma-body text-[10px] tracking-[0.4em] font-mono text-[#8E7867] uppercase pt-8 border-t border-black/10 w-full justify-center flex gap-3"
        >
          <span>Búzios</span>
          <span>•</span>
          <span>Rio de Janeiro</span>
        </motion.div>

      </div>
    </section>
  );
}

