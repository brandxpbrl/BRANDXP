"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const serviceCards = [
  {
    title: "Brand Audit & Strategy",
    price: "BRAND",
    desc: "Análise profunda do posicionamento atual e identificação de gargalos de imagem.",
    deliverables: ["Estudos de posicionamento", "Tom de voz & Narrativa", "Storytelling & Brandbook"],
    color: "#D6A24A"
  },
  {
    title: "Creative Direction & Art",
    price: "CREATE",
    desc: "Conceituação visual das campanhas, moodboards, direção de arte e produção fotográfica profissional.",
    deliverables: ["Fotografia & Video Drone 4K", "Iluminação de cinema real", "Curadoria visual de espaço"],
    color: "#FF3D8E"
  },
  {
    title: "Technology & Web Apps",
    price: "BUILD",
    desc: "Experiências web fluidas sob princípios Apple/Aesop focando em conversão direta de reservas.",
    deliverables: ["Landing Pages de conversão", "Aplicações web sob medida", "Integrações & IA de atendimento"],
    color: "#29B8FF"
  },
  {
    title: "Growth & Content Strategy",
    price: "GROW",
    desc: "Estruturação de posts, reels e otimização de canais de busca local.",
    deliverables: ["Diretrizes estéticas de mídias", "Google Business estratégico", "Consultoria de campanhas ads"],
    color: "#D6A24A"
  }
];

export default function Services() {
  return (
    <section className="py-24 md:py-32 px-6 bg-[#0d0d0d] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="max-w-3xl mb-20 space-y-6">
          <span className="text-xs font-bold tracking-[0.2em] text-[#D6A24A] uppercase">
            Nossos Serviços
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-primary">
            Transformação Estética Completa.
          </h2>
          <p className="text-gray-400 text-lg">
            Soluções completas de ponta a ponta para elevar seu negócio ao patamar de marca inesquecível.
          </p>
        </div>

        {/* Premium Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {serviceCards.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative rounded-3xl border border-white/5 bg-[#050505] p-8 hover:border-white/15 transition-all duration-300 backdrop-blur-md flex flex-col justify-between overflow-hidden"
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ backgroundImage: `radial-gradient(circle at 80% 20%, ${service.color}10, transparent 50%)` }}
              />
              
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded" style={{ color: service.color }}>
                    {service.price}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#D6A24A] transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {service.desc}
                </p>
              </div>

              <div className="border-t border-white/5 pt-6 mt-auto">
                <ul className="space-y-2">
                  {service.deliverables.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: service.color }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

