"use client";

import { motion } from "framer-motion";
import { Sparkles, Eye, Compass, LayoutGrid, Hotel, Waves, Flame, Landmark, User, Coffee, Target } from "lucide-react";

const whyCards = [
  {
    icon: Compass,
    title: "Brand Strategy",
    color: "#D6A24A",
    description: "Definimos o posicionamento no mercado, o tom de voz e a narrativa que tornarão seu negócio incomparável.",
  },
  {
    icon: Sparkles,
    title: "Direção Criativa",
    color: "#FF3D8E",
    description: "Traduzimos a essência de sua marca em conceitos visuais sofisticados, layouts fluidos e experiências imersivas.",
  },
  {
    icon: Eye,
    title: "Produção Visual",
    color: "#29B8FF",
    description: "Produzimos fotos e vídeos cinematográficos sob medida que geram atração orgânica e desejo de reserva imediata.",
  },
];

const clients = [
  { icon: Hotel, label: "Hotéis", color: "#D6A24A" },
  { icon: Waves, label: "Pousadas", color: "#29B8FF" },
  { icon: Flame, label: "Airbnb", color: "#FF3D8E" },
  { icon: LayoutGrid, label: "Restaurantes", color: "#D6A24A" },
  { icon: Compass, label: "Beach Clubs", color: "#29B8FF" },
  { icon: Coffee, label: "Cafés", color: "#FF3D8E" },
  { icon: Landmark, label: "Arquitetos", color: "#D6A24A" },
  { icon: User, label: "Marcas Pessoais", color: "#29B8FF" },
];

export default function Why() {
  return (
    <section className="py-24 md:py-32 px-6 bg-[#050505] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION 2: Why Brand Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold tracking-[0.2em] text-[#D6A24A] uppercase">
              A Diferença de Valor
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white font-primary">
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
                className="group relative rounded-3xl border border-white/5 bg-[#0D0D0D] p-8 hover:border-white/15 transition-all duration-300 backdrop-blur-md overflow-hidden"
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundImage: `radial-gradient(circle at 50% 50%, ${card.color}15, transparent 60%)` }}
                />
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6" style={{ color: card.color }} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{card.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{card.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* SECTION 3: Who We Help */}
        <div className="border-t border-white/5 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold tracking-[0.2em] text-[#FF3D8E] uppercase">
                Para quem transformamos
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-primary">
                Alineados para o extraordinário
              </h2>
            </div>
            
            <div className="lg:col-span-6 lg:border-l lg:border-white/5 lg:pl-10">
              <span className="text-4xl font-serif text-[#D6A24A] leading-none">“</span>
              <p className="text-gray-400 text-sm leading-relaxed italic -mt-2">
                O cliente compra emoção antes de comprar qualquer produto ou serviço. Nós tornamos essa emoção visível, desejável e real.
              </p>
            </div>
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
                  className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-white/5 bg-[#0D0D0D] hover:bg-[#0D0D0D]/60 hover:border-white/10 transition-all duration-300 text-center"
                >
                  <Icon className="w-8 h-8 text-gray-500 group-hover:scale-105 transition-all mb-3" style={{ color: `${item.color}bb` }} />
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
