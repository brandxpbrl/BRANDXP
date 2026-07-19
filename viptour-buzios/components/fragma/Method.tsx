"use client";

import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Diagnóstico", desc: "Mapeamento aprofundado das forças do negócio e identificação dos gargalos de posicionamento atual." },
  { num: "02", title: "Estratégia", desc: "Definição do novo posicionamento de mercado e da narrativa de marca de alta gama." },
  { num: "03", title: "Branding", desc: "Design do logotipo, universo tipográfico e manual de identidade sensorial." },
  { num: "04", title: "Direção Criativa", desc: "Desenho artístico das campanhas, moodboards, curadoria de modelos e direção de cena." },
  { num: "05", title: "Fotografia", desc: "Captura cinematográfica profissional sob as regras de luz natural local." },
  { num: "06", title: "Vídeo", desc: "Filmagens cinemáticas em alta definição focadas em despertar desejo de consumo e experiência." },
  { num: "07", title: "Website", desc: "Design & UX integrado de altíssimo valor e conversão direta." },
  { num: "08", title: "IA & Automação", desc: "Sistemas inteligentes de atendimento concierge e automações de fluxo de trabalho." },
  { num: "09", title: "Resultado", desc: "Aumento real do valor percebido, gerando reservas e vendas orgânicas qualificadas." },
];

export default function Method() {
  return (
    <section className="py-24 md:py-32 px-6 bg-[#050505] border-t border-white/5 relative">
      <div className="max-w-5xl mx-auto">
        
        <div className="max-w-3xl mb-20 space-y-6">
          <span className="text-xs font-bold tracking-[0.2em] text-[#D6A24A] uppercase">
            Nosso Método
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-primary">
            Como transformamos um negócio.
          </h2>
          <p className="text-gray-400 text-lg">
            Um percurso estratégico linear projetado para transmutar presença amadora em prestígio de mercado.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative border-l border-[#D6A24A]/25 pl-6 md:pl-10 ml-4 md:ml-6 space-y-12">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.05 }}
              className="relative group"
            >
              {/* Bullet node indicator */}
              <div 
                className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full border-2 border-[#D6A24A] bg-[#050505] group-hover:scale-125 transition-transform duration-300"
                style={{ boxShadow: '0 0 10px rgba(214, 162, 74, 0.4)' }}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-4 flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#D6A24A] bg-[#D6A24A]/10 px-2.5 py-1 rounded">
                    {step.num}
                  </span>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#D6A24A] transition-colors duration-300">
                    {step.title}
                  </h3>
                </div>
                <div className="md:col-span-8">
                  <p className="text-gray-400 leading-relaxed text-sm max-w-xl">
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

