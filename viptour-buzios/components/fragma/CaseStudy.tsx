"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function CaseStudy() {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <section id="case-study" className="py-24 md:py-32 px-6 bg-[#0b0e14]/40 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-16">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold tracking-[0.2em] text-[#0ea5e9] uppercase">
              Featured Case
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              BÚZIOSAMA
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Como redefinimos o posicionamento de uma marca premium local, levando sua presença de amadora a extraordinária.
            </p>
          </div>
          
          <div className="lg:col-span-7 flex flex-wrap gap-4 text-xs font-mono text-gray-500 uppercase">
            <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">Branding</span>
            <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">Direção Criativa</span>
            <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">Fotografia Golden Hour</span>
            <span className="bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 text-white px-3 py-1.5 rounded-full">Resultado: +42% Reservas</span>
          </div>
        </div>

        {/* Before / After Slider Component */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7">
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl select-none">
              
              {/* After (New Brand Experience Style) */}
              <div className="absolute inset-0 w-full h-full bg-[#0b0e14] flex flex-col justify-between p-8">
                {/* Note: Insert high-end AFTER photo of Búziosama here */}
                <div className="absolute inset-0 bg-radial from-black/20 to-black/80" />
                <div className="relative z-10">
                  <span className="text-[10px] font-bold tracking-[0.3em] text-[#0ea5e9] uppercase bg-[#0ea5e9]/20 px-3 py-1 rounded">
                    AFTER: EXPERIÊNCIA PREMIUM
                  </span>
                </div>
                <div className="relative z-10">
                  <h4 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                    Presença imersiva sob a luz dourada de Búzios.
                  </h4>
                  <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-lg">
                    Fotografia de sentimento real combinada a uma tipografia imponente e limpa.
                  </p>
                </div>
              </div>

              {/* Before (Old Style - Crop slider mask) */}
              <div 
                className="absolute inset-y-0 left-0 overflow-hidden bg-slate-900 flex flex-col justify-between p-8"
                style={{ width: `${sliderPosition}%` }}
              >
                <div className="absolute inset-0 min-w-[700px] h-full w-full bg-slate-950 p-8 flex flex-col justify-between">
                  {/* Note: Insert low-end BEFORE photo of Búziosama here */}
                  <div className="absolute inset-0 bg-black/60" />
                  <div className="relative z-10">
                    <span className="text-[10px] font-bold tracking-[0.3em] text-red-500 uppercase bg-red-950/40 px-3 py-1 rounded">
                      BEFORE: IMAGENS DE BANCO / FOTOS COMUNS
                    </span>
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-2xl sm:text-3xl font-bold text-gray-400 tracking-tight leading-tight">
                      Presença genérica e inconsistente.
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm mt-2 max-w-lg">
                      Falta de conexão humana e iluminação artificial de baixa qualidade.
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
                className="absolute inset-y-0 w-0.5 bg-white/40 pointer-events-none z-20"
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
              <h3 className="text-xs font-bold tracking-widest text-[#0ea5e9] uppercase">O Problema</h3>
              <p className="text-gray-400 mt-2 text-sm leading-relaxed">
                Apesar de oferecer uma experiência excepcional no local, a presença digital da marca parecia barata e genérica, afastando o público de alto padrão que buscavam atrair.
              </p>
            </div>
            
            <div>
              <h3 className="text-xs font-bold tracking-widest text-[#0ea5e9] uppercase">Processo de Brand Experience</h3>
              <p className="text-gray-400 mt-2 text-sm leading-relaxed">
                Refizemos a identidade corporativa sob códigos estéticos minimalistas de luxo, gerando uma narrativa editorial calorosa e executando uma produção visual completa com modelos reais.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold tracking-widest text-[#0ea5e9] uppercase">Resultados Finais</h3>
              <p className="text-gray-400 mt-2 text-sm leading-relaxed">
                +42% no ticket médio de conversão, atração direta de clientes estrangeiros qualificados e posicionamento consolidado nas redes sociais.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
