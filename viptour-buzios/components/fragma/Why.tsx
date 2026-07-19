"use client";

import { motion } from "framer-motion";
import { Sparkles, Eye, Compass, LayoutGrid, Hotel, Waves, Flame, Landmark, User, ShieldAlert } from "lucide-react";

const whyCards = [
  {
    icon: Compass,
    title: "Brand Strategy",
    description: "Definimos o posicionamento no mercado, o tom de voz e a narrativa que tornarão seu negócio incomparável.",
  },
  {
    icon: Sparkles,
    title: "Direção Criativa",
    description: "Traduzimos a essência de sua marca em conceitos visuais sofisticados, layouts fluidos e experiências imersivas.",
  },
  {
    icon: Eye,
    title: "Produção Visual",
    description: "Produzimos fotos e vídeos cinematográficos sob medida que geram atração orgânica e desejo de reserva imediata.",
  },
];

const clients = [
  { icon: Hotel, label: "Hotéis" },
  { icon: Waves, label: "Pousadas" },
  { icon: Flame, label: "Airbnb" },
  { icon: LayoutGrid, label: "Restaurantes" },
  { icon: Compass, label: "Beach Clubs" },
  { icon: Landmark, label: "Arquitetura" },
  { icon: User, label: "Marcas Pessoais" },
  { icon: ShieldAlert, label: "Corporativos" },
];

export default function Why() {
  return (
    <section className="py-24 md:py-32 px-6 bg-[#07090e] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION 2: Why Brand Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold tracking-[0.2em] text-[#0ea5e9] uppercase">
              A Diferença de Valor
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Você não precisa apenas de fotos.
              <span className="block text-gray-500 font-medium">Você precisa de percepção.</span>
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-gray-400 text-lg sm:text-xl leading-relaxed">
              Fotografia desacompanhada é apenas documentação visual. O verdadeiro Brand Experience alinha estratégia de identidade, design de conversão e comunicação artística. Capturamos e desenhamos a emoção que antecede a decisão de compra de seu cliente.
            </p>
          </div>
        </div>

        {/* Animated Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          {whyCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="group relative rounded-3xl border border-white/5 bg-[#0b0e14]/40 p-8 hover:border-white/15 transition-all duration-300 backdrop-blur-md overflow-hidden"
              >
                <div className="absolute inset-0 bg-radial from-[#0ea5e9]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6 text-[#0ea5e9]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{card.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{card.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* SECTION 3: Who We Help */}
        <div className="border-t border-white/5 pt-20">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-[0.2em] text-[#0ea5e9] uppercase">
              Público Alvo
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Para quem criamos valor
            </h2>
            <p className="text-gray-500 text-sm">
              Especialistas em posicionar negócios que prezam por curadoria, sofisticação e experiência de cliente de alto padrão.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {clients.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-white/5 bg-[#0b0e14]/20 hover:bg-[#0b0e14]/60 hover:border-white/10 transition-all duration-300 text-center"
                >
                  <Icon className="w-8 h-8 text-gray-500 group-hover:text-[#0ea5e9] transition-colors mb-3" />
                  <span className="text-xs font-bold tracking-widest text-gray-400 uppercase group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
