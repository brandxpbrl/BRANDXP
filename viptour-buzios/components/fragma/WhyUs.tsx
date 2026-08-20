"use client";

import { motion } from "framer-motion";
import { Building2, Gem, Globe2, Hotel, House, Monitor, Utensils } from "lucide-react";

const sectors = [
  { title: "Arquitetura", icon: Building2 },
  { title: "Real estate", icon: House },
  { title: "Hospitalidade", icon: Hotel },
  { title: "Pousadas e hotéis", icon: Globe2 },
  { title: "Airbnb", icon: House },
  { title: "Restaurantes", icon: Utensils },
  { title: "Lifestyle brands", icon: Gem },
  { title: "Marcas pessoais", icon: Monitor },
];

export default function WhyUs() {
  return (
    <section id="sectors" className="fragma-sector-section px-6">
      <div className="mx-auto max-w-[var(--fragma-content-max)]">
        <div className="mb-16 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,28rem)] lg:items-end">
          <div className="space-y-5">
            <span className="fragma-eyebrow">Onde atuamos</span>
            <h2 className="fragma-display max-w-3xl text-4xl leading-[1.04] tracking-[-0.035em] text-[#1F1F1F] sm:text-6xl">
              Para espaços, marcas e experiências.
            </h2>
          </div>
          <p className="fragma-body max-w-md text-base leading-8 text-[#8E7867]">
            A linguagem muda de acordo com o contexto. O compromisso com a percepção de valor permanece.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {sectors.map((sector, idx) => {
            const Icon = sector.icon;

            return (
              <motion.article
                key={sector.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                className="fragma-sector-card flex min-h-36 flex-col justify-between p-5 sm:p-6"
              >
                <div className="fragma-sector-icon flex h-10 w-10 items-center justify-center rounded-full">
                  <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="fragma-body mt-8 text-sm font-bold uppercase tracking-[0.08em] text-[#1F1F1F]">{sector.title}</h3>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
