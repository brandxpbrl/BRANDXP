"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const serviceCards = [
  {
    title: "Brand Audit",
    price: "Diagnóstico",
    desc: "Análise profunda do posicionamento atual e identificação de gargalos de imagem.",
    deliverables: ["Análise de concorrentes", "Auditoria de redes sociais", "Relatório de oportunidades"],
  },
  {
    title: "Brand Strategy",
    price: "Posicionamento",
    desc: "Definição do DNA, pilares narrativos, arquétipo de marca e tom de comunicação.",
    deliverables: ["Brandbook estratégico", "Tom de voz e copywriting", "Arquitetura conceitual"],
  },
  {
    title: "Creative Direction",
    price: "Identidade",
    desc: "Conceituação visual das campanhas, moodboards, escolha de modelos e direção de arte.",
    deliverables: ["Identidade visual (logo)", "Paleta e tipografias", "Direção de arte integrada"],
  },
  {
    title: "Photography & Drone",
    price: "Produção Cinematográfica",
    desc: "Direção técnica e captura sob luz natural focando em hospitalidade de luxo.",
    deliverables: ["Fotos corporativas e de espaço", "Imagens aéreas drone 4K", "Edição editorial avançada"],
  },
  {
    title: "Social Content",
    price: "Mídias Premium",
    desc: "Estruturação de posts, reels e stories para gerar conversão e atração estética.",
    deliverables: ["Diretrizes estéticas para Feed", "Design de capas exclusivas", "Templates editáveis de marca"],
  },
  {
    title: "Website Experience",
    price: "Design & Conversão",
    desc: "Experiências web fluidas sob princípios Apple/Aesop focando em conversão direta.",
    deliverables: ["Landing page institucional", "Otimização de SEO local", "Arquitetura UX limpa e premium"],
  },
];

export default function Services() {
  return (
    <section className="py-24 md:py-32 px-6 bg-[#0b0e14]/40 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="max-w-3xl mb-20 space-y-6">
          <span className="text-xs font-bold tracking-[0.2em] text-[#0ea5e9] uppercase">
            Nossos Serviços
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Serviços Premium sob medida.
          </h2>
          <p className="text-gray-400 text-lg">
            Soluções completas de ponta a ponta para elevar seu negócio ao patamar de marca inesquecível.
          </p>
        </div>

        {/* Premium Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCards.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative rounded-3xl border border-white/5 bg-[#07090e]/60 p-8 hover:border-white/15 transition-all duration-300 backdrop-blur-md flex flex-col justify-between"
            >
              <div className="absolute inset-0 bg-radial from-[#0ea5e9]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded">
                    {service.price}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#0ea5e9] transition-colors">
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
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0ea5e9] shrink-0" />
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
