"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CaseStudy() {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <section id="case-study" className="py-24 md:py-32 px-6 bg-[#0d0d0d] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-16">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold tracking-[0.2em] text-[#D6A24A] uppercase">
              Case Destaque
            </span>
            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#F7F7F7] leading-tight">
              BUZIOSAMA
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl font-serif">
              “Donde el verdadeiro luxo es volver a estar presente.” Uma pousada boutique e comunidade de prática em Caravelas, Búzios.
            </p>
          </div>
          
          <div className="lg:col-span-5 flex flex-wrap gap-3 text-xs font-mono text-gray-500 uppercase justify-start lg:justify-end">
            <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">Branding Estratégico</span>
            <span className="bg-[#D6A24A]/10 border border-[#D6A24A]/30 text-[#D6A24A] px-3 py-1.5 rounded-full">Direção Criativa</span>
            <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">Luz Natural & Presença</span>
          </div>
        </div>

        {/* Before / After Slider Component */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          <div className="lg:col-span-7">
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl select-none">
              
              {/* After (New Brand Experience Style) */}
              <div className="absolute inset-0 w-full h-full bg-[#050505] flex flex-col justify-between">
                <Image 
                  src="/images/buziosama-retiros.jpg"
                  alt="Búziosama Posicionamento Premium Depois"
                  fill
                  className="object-cover opacity-60"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
                <div className="relative z-10 p-8">
                  <span className="text-[9px] font-bold tracking-[0.3em] text-[#D6A24A] uppercase bg-[#D6A24A]/20 px-3 py-1 rounded border border-[#D6A24A]/30">
                    DEPOIS: VIVÍ NATURAL. VIVÍ CONSCIENTE.
                  </span>
                </div>
                <div className="relative z-10 p-8">
                  <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
                    Experiência sensorial e descanso consciente.
                  </h4>
                  <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-lg">
                    Fotografia de sentimento e presença real sob a luz dourada de Búzios.
                  </p>
                </div>
              </div>

              {/* Before (Old Style - Crop slider mask) */}
              <div 
                className="absolute inset-y-0 left-0 overflow-hidden bg-slate-900"
                style={{ width: `${sliderPosition}%` }}
              >
                <div className="absolute inset-0 min-w-[700px] h-full w-full bg-slate-950 flex flex-col justify-between">
                  <Image 
                    src="/images/buziosama-board.jpg"
                    alt="Búziosama Posicionamento Antes"
                    fill
                    className="object-cover opacity-30 grayscale"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/60 pointer-events-none" />
                  <div className="relative z-10 p-8">
                    <span className="text-[9px] font-bold tracking-[0.3em] text-red-500 uppercase bg-red-950/40 px-3 py-1 rounded border border-red-500/20">
                      ANTES: PRESENÇA FRAGMENTADA E DE BANCO
                    </span>
                  </div>
                  <div className="relative z-10 p-8">
                    <h4 className="text-xl sm:text-2xl font-bold text-gray-500 tracking-tight leading-tight">
                      Falta de conexão e essência.
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm mt-2 max-w-lg">
                      Imagens frias que não capturavam a hospitalidade de Victoria.
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
              <h3 className="text-xs font-bold tracking-widest text-[#D6A24A] uppercase">A Essência</h3>
              <p className="text-gray-400 mt-2 text-sm leading-relaxed font-serif">
                BUZIOSAMA nasceu como uma decisão de vida de Victoria e seus filhos Antonella e Gonzalo. Um refúgio com apenas três suítes de hospitalidade intencional, focado em yoga, bem-estar, retiros de mindfulness e descanso mental consciente.
              </p>
            </div>
            
            <div>
              <h3 className="text-xs font-bold tracking-widest text-[#D6A24A] uppercase">O Processo Criativo</h3>
              <p className="text-gray-400 mt-2 text-sm leading-relaxed">
                Capturamos a natureza intocada de Caravelas, o silêncio da mata, e a luz dourada do entardecer. Redesenhamos a marca sob a premissa de que o verdadeiro luxo é voltar a habitar o momento presente.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold tracking-widest text-[#D6A24A] uppercase">Proteção de Experiência</h3>
              <p className="text-gray-400 mt-2 text-sm leading-relaxed">
                Reposicionamos a marca para afastar o turismo masivo. BUZIOSAMA protege a paz e o silêncio de seus visitantes, gerando conexões reais e profundas com viajantes alinhados a esse propósito.
              </p>
            </div>
          </div>

        </div>

        {/* Cinematic Grid of the transformation showing new assets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 border-t border-white/5 pt-16">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d0d] group">
            <Image 
              src="/images/buziosama-experiencias.jpg"
              alt="Búziosama Retiro Experiencia"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] text-[#D6A24A] font-bold tracking-widest uppercase">CONEXÃO</span>
              <h4 className="text-lg font-bold text-white mt-1">Descanso Mental</h4>
            </div>
          </div>

          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d0d] group">
            <Image 
              src="/images/buziosama-quarto.jpg"
              alt="Búziosama Suíte Suite"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] text-[#FF3D8E] font-bold tracking-widest uppercase">HOSPITALIDADE</span>
              <h4 className="text-lg font-bold text-white mt-1">Conforto Intencional</h4>
            </div>
          </div>

          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d0d] group">
            <Image 
              src="/images/buziosama-decor.jpg"
              alt="Búziosama Livro Café"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] text-[#29B8FF] font-bold tracking-widest uppercase">SILÊNCIO</span>
              <h4 className="text-lg font-bold text-white mt-1">Prática do Presente</h4>
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
