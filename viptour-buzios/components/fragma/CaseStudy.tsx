"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function CaseStudy() {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <section id="case-study" className="py-24 md:py-32 px-6 bg-[#0d0d0d] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-16">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold tracking-[0.2em] text-[#D6A24A] uppercase">
              Case Destaque
            </span>
            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#F7F7F7] leading-tight">
              BUZIOSAMA
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
              Pousada Boutique: Como redefinimos o posicionamento de uma marca premium local, levando sua presença de amadora a extraordinária.
            </p>
          </div>
          
          <div className="lg:col-span-6 flex flex-wrap gap-3 text-xs font-mono text-gray-500 uppercase justify-start lg:justify-end">
            <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">Branding Estratégico</span>
            <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">Direção Criativa</span>
            <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">Produção Fotográfica</span>
            <span className="bg-[#D6A24A]/10 border border-[#D6A24A]/30 text-[#D6A24A] px-3 py-1.5 rounded-full">Conteúdo & Resultados</span>
          </div>
        </div>

        {/* Before / After Slider Component */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          <div className="lg:col-span-7">
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl select-none">
              
              {/* After (New Brand Experience Style) */}
              <div className="absolute inset-0 w-full h-full bg-[#050505] flex flex-col justify-between p-8">
                {/* Note: High-end AFTER photo of Búziosama (luxurious view) */}
                <div className="absolute inset-0 bg-radial from-black/10 to-black/70" />
                <div className="relative z-10">
                  <span className="text-[9px] font-bold tracking-[0.3em] text-[#D6A24A] uppercase bg-[#D6A24A]/20 px-3 py-1 rounded border border-[#D6A24A]/30">
                    DEPOIS: EXPERIÊNCIA PREMIUM
                  </span>
                </div>
                <div className="relative z-10">
                  <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
                    Imagens que posicionam. Arquitetura de marca que transforma.
                  </h4>
                  <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-lg">
                    Fotografia real e narrativa que despertam o desejo de reserva imediata.
                  </p>
                </div>
              </div>

              {/* Before (Old Style - Crop slider mask) */}
              <div 
                className="absolute inset-y-0 left-0 overflow-hidden bg-slate-900 flex flex-col justify-between p-8"
                style={{ width: `${sliderPosition}%` }}
              >
                <div className="absolute inset-0 min-w-[700px] h-full w-full bg-slate-950 p-8 flex flex-col justify-between">
                  <div className="absolute inset-0 bg-black/60" />
                  <div className="relative z-10">
                    <span className="text-[9px] font-bold tracking-[0.3em] text-red-500 uppercase bg-red-950/40 px-3 py-1 rounded border border-red-500/20">
                      ANTES: IMAGENS DE BANCO COMUNS
                    </span>
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-xl sm:text-2xl font-bold text-gray-500 tracking-tight leading-tight">
                      Falta de consistência e conexão humana.
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm mt-2 max-w-lg">
                      Imagens sem propósito de design estratégico.
                    </p>
                  </div>
                </div>
              </div>

              {/* Slider Input overlay */}
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliderPosition} 
                onChange={handleSliderChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30" 
                aria-label="Arrastar controle de antes e depois"
              />

              {/* Slider Line Divider */}
              <div 
                className="absolute inset-y-0 w-0.5 bg-white/20 pointer-events-none z-20"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg font-bold text-xs">
                  ↔
                </div>
              </div>

            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div>
              <h3 className="text-xs font-bold tracking-widest text-[#D6A24A] uppercase">O Problema</h3>
              <p className="text-gray-400 mt-2 text-sm leading-relaxed">
                Apesar de possuir uma das melhores localizações e infraestrutura de Búzios, a imagem digital comunicava inconsistência, atraindo clientes de baixo ticket e forçando a marca a competir por preço.
              </p>
            </div>
            
            <div>
              <h3 className="text-xs font-bold tracking-widest text-[#D6A24A] uppercase">O Processo de Transformação</h3>
              <p className="text-gray-400 mt-2 text-sm leading-relaxed">
                Desenvolvemos um Brand System minimalista focado na hospitalidade sensorial. Planejamos sessões de fotografia golden hour com fator humano real e aplicamos UX integrada de alta conversão.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold tracking-widest text-[#D6A24A] uppercase">Resultados e Escala</h3>
              <p className="text-gray-400 mt-2 text-sm leading-relaxed">
                Posicionamento de mercado redefinido, libertando a pousada da dependência de OTAs e gerando atração direta qualificada.
              </p>
            </div>
          </div>

        </div>

        {/* Real Metrics from presentation board */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/5 pt-10">
          <div className="text-center md:text-left">
            <span className="block text-3xl sm:text-5xl font-black text-[#D6A24A] font-mono">+273%</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mt-1">AUMENTO DE RESERVAS</span>
          </div>
          <div className="text-center md:text-left">
            <span className="block text-3xl sm:text-5xl font-black text-[#FF3D8E] font-mono">+185%</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mt-1">VISIBILIDADE NO GOOGLE</span>
          </div>
          <div className="text-center md:text-left">
            <span className="block text-3xl sm:text-5xl font-black text-[#29B8FF] font-mono">+300%</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mt-1">ENGAJAMENTO NAS REDES</span>
          </div>
          <div className="text-center md:text-left">
            <span className="block text-3xl sm:text-5xl font-black text-white font-mono">+100%</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mt-1">PERCEPÇÃO DE VALOR</span>
          </div>
        </div>
      </div>
    </section>
  );
}

