"use client";

import { motion } from "framer-motion";
import { FragmaHorizonLight, FragmaLogoPair } from "@/components/fragma/foundations";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#FAF7F2] py-20 px-6 text-[#1F1F1F]">
      
      {/* Background Cinematic Image with Slow Zoom & Complex Radial Lights */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.12, opacity: 0.15 }}
          animate={{ scale: 1.02, opacity: 0.35 }}
          transition={{ duration: 12, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          <div className="absolute inset-0 bg-[#FAF7F2]" />
          <FragmaHorizonLight className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FAF7F2]/70 to-[#FAF7F2]" />
        </motion.div>
        
        {/* Noise overlay texture */}
        <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        
        {/* Brand Logos container */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-10"
        >
          <FragmaLogoPair priority />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="fragma-eyebrow">
            Brand Experience Studio
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl sm:text-6xl md:text-7xl tracking-tight text-[#1F1F1F] leading-none max-w-4xl fragma-display"
        >
          Transformamos negócios em <span>marcas inesquecíveis.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-8 text-base sm:text-lg text-[#8E7867] max-w-2xl leading-relaxed font-medium fragma-body"
        >
          Estratégia, identidade, produção visual e tecnologia trabalhando juntas para gerar percepção de valor, desejo e resultados exponenciais.
        </motion.p>

        {/* Feature badges from presentation board */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl w-full border-y border-black/10 py-6 mb-10"
        >
          <div className="text-center">
            <span className="block text-xs font-bold text-[#1F1F1F] uppercase tracking-widest">ESTRATÉGIA</span>
            <span className="text-[10px] text-[#8E7867]">Que direciona</span>
          </div>
          <div className="text-center">
            <span className="block text-xs font-bold text-[#1F1F1F] uppercase tracking-widest">CRIAÇÃO</span>
            <span className="text-[10px] text-[#8E7867]">Que impacta</span>
          </div>
          <div className="text-center">
            <span className="block text-xs font-bold text-[#1F1F1F] uppercase tracking-widest">TECNOLOGIA</span>
            <span className="text-[10px] text-[#8E7867]">Que escala</span>
          </div>
          <div className="text-center">
            <span className="block text-xs font-bold text-[#1F1F1F] uppercase tracking-widest">RESULTADOS</span>
            <span className="text-[10px] text-[#8E7867]">Que permanecem</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="#solicitar"
            className="fragma-button fragma-button-earth interactive"
          >
            Solicitar Diagnóstico
          </a>
          <a
            href="#case-study"
            className="fragma-button fragma-button-light interactive"
          >
            Ver Transformação
          </a>
        </motion.div>
      </div>

      {/* Subtle bottom scroll guide */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-60">
        <span className="text-[9px] tracking-[0.3em] font-bold text-[#8E7867] uppercase">Scroll para explorar</span>
        <div className="w-1.5 h-6 bg-black/10 rounded-full relative overflow-hidden">
          <motion.div 
            animate={{ y: [0, 16, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute top-0 left-0 right-0 h-2 bg-[#8E7867] rounded-full"
          />
        </div>
      </div>
    </section>
  );
}
