"use client";

import { motion } from "framer-motion";
import { Compass, Sparkles, LayoutGrid, Award } from "lucide-react";

const reasons = [
  {
    icon: Compass,
    title: "Estratégia",
    desc: "Não começamos pela câmera. Começamos pelo posicionamento de mercado e definição de público qualificado.",
    color: "#D6A24A"
  },
  {
    icon: Sparkles,
    title: "Imagem",
    desc: "Cada fotografia comunica um valor consciente. Nada é aleatório; tudo é direcionado para a atração visual.",
    color: "#FF3D8E"
  },
  {
    icon: LayoutGrid,
    title: "Tecnologia",
    desc: "Landing Pages robustas, aplicações sob medida, automatizações operacionais e integrações inteligentes.",
    color: "#29B8FF"
  },
  {
    icon: Award,
    title: "Resultado",
    desc: "Nosso objetivo não é criar imagens bonitas. É aumentar o valor percebido e a conversão direta de reservas do seu negócio.",
    color: "#D6A24A"
  }
];

export default function WhyUs() {
  return (
    <section className="py-24 md:py-32 px-6 bg-[#050505] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="max-w-3xl mb-20 space-y-6">
          <span className="text-xs font-bold tracking-[0.2em] text-[#D6A24A] uppercase">
            Nosso Diferencial
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-primary">
            Por que FRAGMA Brand Experience?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="group relative rounded-3xl border border-white/5 bg-[#0D0D0D] p-8 hover:border-white/10 transition-all duration-300 flex items-start gap-6 overflow-hidden"
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundImage: `radial-gradient(circle at 10% 20%, ${item.color}08, transparent 40%)` }}
                />
                
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#D6A24A] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
