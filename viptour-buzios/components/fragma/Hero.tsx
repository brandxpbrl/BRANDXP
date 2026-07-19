"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] py-20 px-6">
      
      {/* Background Cinematic Image with Slow Zoom & Complex Radial Lights */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.12, opacity: 0.15 }}
          animate={{ scale: 1.02, opacity: 0.35 }}
          transition={{ duration: 12, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          {/* Background image underlay / light gradients */}
          <div className="absolute inset-0 bg-[#050505]" />
          <div className="absolute inset-0 bg-radial from-[#29B8FF]/10 via-[#FF3D8E]/5 to-transparent blur-3xl opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505]" />
        </motion.div>
        
        {/* Noise overlay texture */}
        <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        
        {/* Fragma Logo container */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <Image
            src="/images/fragma-logo.png"
            alt="Fragma Studio Logo"
            width={260}
            height={80}
            className="brightness-200 contrast-125 object-contain h-auto w-auto max-h-[70px]"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="text-[10px] font-bold tracking-[0.4em] text-[#D6A24A] uppercase bg-[#D6A24A]/10 px-4 py-1.5 rounded-full border border-[#D6A24A]/20">
            Brand Experience Studio
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#F7F7F7] leading-none max-w-4xl font-primary"
        >
          Transformamos negócios em <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D6A24A] via-[#FF3D8E] to-[#29B8FF]">marcas inesquecíveis.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-8 text-base sm:text-lg text-gray-400 max-w-2xl leading-relaxed font-medium"
        >
          Estratégia, identidade, produção visual e tecnologia trabalhando juntas para gerar percepção de valor, desejo e resultados exponenciais.
        </motion.p>

        {/* Feature badges from presentation board */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl w-full border-y border-white/5 py-6 mb-10"
        >
          <div className="text-center">
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest">ESTRATÉGIA</span>
            <span className="text-[10px] text-[#D6A24A] font-mono">Que direciona</span>
          </div>
          <div className="text-center">
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest">CRIAÇÃO</span>
            <span className="text-[10px] text-[#FF3D8E] font-mono">Que impacta</span>
          </div>
          <div className="text-center">
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest">TECNOLOGIA</span>
            <span className="text-[10px] text-[#29B8FF] font-mono">Que escala</span>
          </div>
          <div className="text-center">
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest">RESULTADOS</span>
            <span className="text-[10px] text-white font-mono">Que permanecem</span>
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
            className="cta interactive px-8 py-4 rounded-full font-bold text-black text-sm tracking-wide bg-[#D6A24A] hover:bg-[#c3913e] transition-all duration-300 shadow-lg shadow-[#D6A24A]/10 border border-[#D6A24A]/20"
            style={{ background: 'linear-gradient(180deg, #F5D08C 0%, #D6A24A 100%)' }}
          >
            Solicitar Diagnóstico
          </a>
          <a
            href="#case-study"
            className="interactive inline-flex items-center justify-center rounded-full border border-white/10 px-8 py-4 text-sm font-semibold text-white bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md"
          >
            Ver Transformação
          </a>
        </motion.div>
      </div>

      {/* Subtle bottom scroll guide */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-30">
        <span className="text-[9px] tracking-[0.3em] font-bold text-gray-500 uppercase">Scroll para explorar</span>
        <div className="w-1.5 h-6 bg-white/10 rounded-full relative overflow-hidden">
          <motion.div 
            animate={{ y: [0, 16, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute top-0 left-0 right-0 h-2 bg-[#D6A24A] rounded-full"
          />
        </div>
      </div>
    </section>
  );
}
