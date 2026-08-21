"use client";

import { motion } from "framer-motion";
import { FragmaHorizonLight } from "@/components/fragma/foundations";

export default function CTA() {
  return (
    <section id="solicitar" className="relative flex min-h-[80svh] w-full items-center justify-center overflow-hidden border-t border-black/10 bg-[#FAF7F2] px-6 py-24">
      
      {/* Dark Cinematic Background & Soft Blurred Lights */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <FragmaHorizonLight className="absolute inset-x-0 bottom-0 h-2/3 opacity-100" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center space-y-8 text-center">
        
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
          className="fragma-display fragma-fluid-heading max-w-3xl text-[#1F1F1F]"
        >
          Sua marca merece ser lembrada.
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="fragma-body max-w-2xl text-base leading-8 text-[#8E7867] sm:text-lg"
        >
          Transformamos estratégia, imagem e tecnologia em percepção de valor.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex w-full flex-col items-center justify-center gap-4 pt-4 sm:w-auto sm:flex-row"
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
          className="fragma-body flex w-full flex-wrap justify-center gap-3 border-t border-black/10 pt-8 text-[10px] font-mono uppercase tracking-[0.4em] text-[#8E7867]"
        >
          <span>Búzios</span>
          <span>•</span>
          <span>Rio de Janeiro</span>
        </motion.div>

      </div>
    </section>
  );
}
