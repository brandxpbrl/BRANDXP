"use client";

import { motion } from "framer-motion";
import { Compass, Eye, LayoutGrid, Sparkles } from "lucide-react";

const pillars = [
  {
    icon: Compass,
    index: "01",
    title: "Estratégia",
    description: "Encontramos o valor que já existe no negócio, no espaço e na experiência.",
  },
  {
    icon: Eye,
    index: "02",
    title: "Identidade",
    description: "Damos significado e coerência para que a marca seja reconhecida antes de ser explicada.",
  },
  {
    icon: Sparkles,
    index: "03",
    title: "Imagem",
    description: "Transformamos intenção em direção visual, fotografia, vídeo e narrativa.",
  },
  {
    icon: LayoutGrid,
    index: "04",
    title: "Tecnologia",
    description: "Ampliamos a percepção em websites, conteúdo e sistemas digitais que fazem sentido.",
  },
];

export default function Why() {
  return (
    <section id="about" className="fragma-editorial-section px-6 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <span className="fragma-eyebrow">Fragma Brand Experience / Búzios</span>
            <h2 className="fragma-display mt-7 max-w-xl text-4xl leading-[1.04] tracking-[-0.035em] sm:text-6xl">
              Um lugar pode ser extraordinário. Mas se sua imagem não transmite isso, seu <span>valor não é percebido.</span>
            </h2>
          </div>
          <div className="flex items-end">
            <p className="fragma-body max-w-xl text-lg leading-8 text-[#514940]">
              É aí que entramos. Organizamos estratégia, identidade, imagem e tecnologia para que a essência de uma marca encontre uma forma clara de ser percebida.
            </p>
          </div>
        </div>

        <div className="mt-20 grid border-y border-black/10 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.article
                key={pillar.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="fragma-pillar-card group border-black/10 p-7 first:border-l-0 md:border-l lg:min-h-[250px]"
              >
                <div className="flex items-center justify-between">
                  <span className="fragma-index">{pillar.index}</span>
                  <Icon aria-hidden="true" className="h-7 w-7 text-[#8E7867] transition-transform duration-300 group-hover:scale-110" strokeWidth={1.35} />
                </div>
                <h3 className="fragma-display mt-10 text-2xl">{pillar.title}</h3>
                <p className="fragma-body mt-3 text-sm leading-6 text-[#6F6358]">{pillar.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
