"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black py-20 px-6">
      
      {/* Background Cinematic Image with Slow Zoom Animation */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.15, opacity: 0.2 }}
          animate={{ scale: 1.02, opacity: 0.45 }}
          transition={{ duration: 12, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          {/* Note: Insert cinematic project background photo (e.g. hotel exterior golden hour) here */}
          <div className="absolute inset-0 bg-radial from-transparent via-[#07090e]/80 to-[#07090e]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#07090e]/20 via-transparent to-[#07090e]" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        
        {/* Fragma Logo container */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <Image
            src="/images/fragma-logo.png"
            alt="Fragma Studio Logo"
            width={120}
            height={120}
            className="brightness-200 contrast-125 object-contain"
            priority
          />
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs font-semibold tracking-[0.4em] text-[#0ea5e9] uppercase mb-6 bg-[#0ea5e9]/10 px-4 py-1.5 rounded-full border border-[#0ea5e9]/20"
        >
          Brand Experience Studio
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight max-w-4xl"
        >
          Transformamos negócios em marcas inesquecíveis.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 text-lg sm:text-xl text-gray-400 max-w-3xl leading-relaxed font-medium"
        >
          Branding estratégico, direção criativa e produção visual para hotéis, pousadas, restaurantes e marcas premium.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="#solicitar"
            className="cta interactive px-8 py-4 rounded-full font-bold text-white text-sm tracking-wide bg-[#0ea5e9] hover:bg-[#0284c7] transition-all duration-300"
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
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-50">
        <span className="text-[10px] tracking-[0.3em] font-bold text-gray-500 uppercase">Scroll para explorar</span>
        <div className="w-1.5 h-6 bg-white/20 rounded-full relative overflow-hidden">
          <motion.div 
            animate={{ y: [0, 16, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute top-0 left-0 right-0 h-2 bg-[#0ea5e9] rounded-full"
          />
        </div>
      </div>
    </section>
  );
}
