"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ComingSoon() {
  return (
    <section className="py-24 md:py-32 px-6 bg-[#0d0d0d] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold tracking-[0.2em] text-[#FF3D8E] uppercase">
              Coming Soon
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-primary">
              Nosso primeiro Case Study: <span className="text-[#D6A24A] block">BUZIOSAMA</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Estamos documentando cada etapa da transformação da Búziosama. Em breve publicaremos o estudo de caso completo, detalhando:
            </p>
            
            <ul className="space-y-3 font-mono text-xs text-gray-500 uppercase">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D6A24A]" />
                Diagnóstico & Mapeamento
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D8E]" />
                Construção do Brand System
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#29B8FF]" />
                Produção de Foto & Video Real
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D6A24A]" />
                Lançamento do Website & UX
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D8E]" />
                Métricas & Resultados de Conversão
              </li>
            </ul>

            <div className="pt-6">
              <button 
                disabled 
                className="px-6 py-3 rounded-full font-bold text-xs tracking-widest bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed uppercase"
              >
                Coming Soon
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            {/* Glass card with large preview image placeholder */}
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 bg-[#050505] p-2 shadow-2xl backdrop-blur-md">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image 
                  src="/images/buziosama-retiros.jpg"
                  alt="Búziosama Retiro preview"
                  fill
                  className="object-cover opacity-30 grayscale filter blur-[1px]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-mono tracking-[0.4em] font-bold text-[#D6A24A] bg-[#050505]/95 px-6 py-3 rounded-full border border-white/10 shadow-lg">
                    DOCUMENTANDO TRANSFORMAÇÃO
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
