"use client";

import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Diagnosis", desc: "Mapeamento das forças do negócio e identificação dos pontos fracos de percepção visual." },
  { num: "02", title: "Strategy", desc: "Definição do novo posicionamento de mercado e da estratégia de comunicação de nicho." },
  { num: "03", title: "Branding", desc: "Design do logotipo, paleta cromática de alta vibração e arquitetura de marca completa." },
  { num: "04", title: "Creative Direction", desc: "Desenho e conceituação artística das narrativas visuais e moodboards de produção." },
  { num: "05", title: "Photography", desc: "Captura cinematográfica profissional sob as regras de luz natural e emoção autêntica." },
  { num: "06", title: "Video", desc: "Filmagens cinemáticas em alta definição focadas em despertar desejo de consumo e experiência." },
  { num: "07", title: "Content", desc: "Organização estratégica dos novos assets nas mídias sociais e landing pages de conversão." },
  { num: "08", title: "Delivery", desc: "Entrega e suporte na implementação completa da nova linguagem visual de alto valor." },
];

export default function Method() {
  return (
    <section className="py-24 md:py-32 px-6 bg-[#07090e] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="max-w-3xl mb-20 space-y-6">
          <span className="text-xs font-bold tracking-[0.2em] text-[#0ea5e9] uppercase">
            Nosso Método
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Uma esteira de valor milimétrica.
          </h2>
          <p className="text-gray-400 text-lg">
            Da análise inicial à entrega do portfólio de assets, cada etapa é desenhada para construir exclusividade.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative border-l border-white/10 pl-6 md:pl-10 ml-4 md:ml-6 space-y-12">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative group"
            >
              {/* Bullet node indicator */}
              <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full border-2 border-[#0ea5e9] bg-[#07090e] group-hover:scale-125 transition-transform" />
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-3 flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-gray-500 bg-white/5 px-2.5 py-1 rounded">
                    {step.num}
                  </span>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#0ea5e9] transition-colors">
                    {step.title}
                  </h3>
                </div>
                <div className="md:col-span-9">
                  <p className="text-gray-400 leading-relaxed text-sm max-w-2xl">
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
