"use client";

import { motion } from "framer-motion";
import { Camera, Compass, Eye, Monitor } from "lucide-react";

const serviceCards = [
  {
    num: "01",
    title: "Estratégia",
    statement: "Encontrar valor.",
    desc: "Entendemos o negócio, o público e o contexto para construir uma direção clara.",
    deliverables: ["Diagnóstico", "Posicionamento", "Brand strategy"],
    icon: Compass,
  },
  {
    num: "02",
    title: "Identidade",
    statement: "Dar significado.",
    desc: "Organizamos a essência da marca em uma identidade visual e verbal reconhecível.",
    deliverables: ["Identidade visual", "Storytelling", "Direção de marca"],
    icon: Eye,
  },
  {
    num: "03",
    title: "Imagem",
    statement: "Tornar visível.",
    desc: "Criamos imagens, filmes e experiências visuais com intenção, contexto e sensibilidade.",
    deliverables: ["Fotografia", "Filme e drone", "Direção de arte"],
    icon: Camera,
  },
  {
    num: "04",
    title: "Digital",
    statement: "Ampliar.",
    desc: "Levamos a experiência para os canais digitais com clareza, tecnologia e consistência.",
    deliverables: ["Websites", "Conteúdo", "Tecnologia e automação"],
    icon: Monitor,
  },
];

export default function Services() {
  return (
    <section id="services" className="fragma-services-section px-6">
      <div className="mx-auto max-w-[var(--fragma-content-max)]">
        <div className="mb-16 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,28rem)] lg:items-end">
          <div className="space-y-5">
            <span className="fragma-eyebrow">O que fazemos</span>
            <h2 className="fragma-display max-w-3xl text-4xl leading-[1.04] tracking-[-0.035em] text-[#1F1F1F] sm:text-6xl">
              Construímos <span>percepção.</span>
            </h2>
          </div>
          <p className="fragma-body max-w-md text-base leading-8 text-[#8E7867]">
            Estratégia, identidade, imagem e tecnologia trabalhando juntas para transformar marcas, espaços e experiências em algo desejado.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {serviceCards.map((service, idx) => {
            const Icon = service.icon;

            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: idx * 0.08 }}
                className="fragma-service-card flex min-h-[22rem] flex-col justify-between p-6 sm:p-7"
              >
                <div>
                  <div className="mb-10 flex items-center justify-between">
                    <span className="fragma-index">{service.num}</span>
                    <div className="fragma-service-icon flex h-11 w-11 items-center justify-center rounded-full">
                      <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="fragma-display text-2xl leading-tight text-[#1F1F1F]">{service.title}</h3>
                  <p className="fragma-display mt-2 text-xl text-[#B69A80]">{service.statement}</p>
                  <p className="fragma-body mt-5 text-sm leading-7 text-[#8E7867]">{service.desc}</p>
                </div>

                <ul className="fragma-body mt-8 space-y-2 border-t border-black/10 pt-5 text-xs uppercase tracking-[0.08em] text-[#8E7867]">
                  {service.deliverables.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
