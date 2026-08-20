"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const visualCards = [
  {
    src: "/images/buziosama-experiencias.jpg",
    label: "Conexão",
    title: "Experiências que permanecem",
    alt: "Experiência de hospitalidade do case BUZIOSAMA",
  },
  {
    src: "/images/buziosama-quarto.jpg",
    label: "Hospitalidade",
    title: "Conforto intencional",
    alt: "Interior de hospedagem do case BUZIOSAMA",
  },
  {
    src: "/images/buziosama-decor.jpg",
    label: "Presença",
    title: "Detalhes com significado",
    alt: "Detalhes de atmosfera do case BUZIOSAMA",
  },
];

export default function CaseStudy() {
  return (
    <section id="case-study" className="fragma-case-section px-6 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1360px]">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <span className="fragma-eyebrow">Trabalhos em destaque / Case real</span>
            <h2 className="fragma-display mt-6 text-5xl tracking-[-0.04em] sm:text-7xl">BUZIOSAMA</h2>
            <p className="fragma-display mt-6 max-w-2xl text-2xl leading-tight text-[#514940] sm:text-3xl">
              Um refúgio de hospitalidade consciente, organizado para ser percebido com presença.
            </p>
          </div>
          <div className="flex max-w-sm flex-wrap gap-2 lg:justify-end">
            {['Identidade', 'Direção visual', 'Aplicações digitais'].map((tag) => (
              <span key={tag} className="fragma-tag">{tag}</span>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-stretch">
          <motion.figure
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="fragma-feature-image relative aspect-[4/3] overflow-hidden rounded-[4px]"
          >
            <Image
              src="/images/buziosama-retiros.jpg"
              alt="Atmosfera natural do case BUZIOSAMA"
              fill
              sizes="(max-width: 1024px) 100vw, 68vw"
              className="object-cover transition-transform duration-700 hover:scale-[1.02]"
            />
            <figcaption className="absolute bottom-5 left-5 text-[10px] font-bold uppercase tracking-[0.22em] text-white">
              BUZIOSAMA / seleção visual documentada
            </figcaption>
          </motion.figure>

          <div className="fragma-case-copy flex flex-col justify-between gap-10 border-l border-black/10 pl-0 lg:pl-10">
            <div>
              <span className="fragma-eyebrow">A essência</span>
              <p className="fragma-body mt-5 text-base leading-7 text-[#514940]">
                BUZIOSAMA articula natureza, hospitalidade, bem-estar e uma forma mais consciente de viver Búzios. O trabalho documentado parte dessa essência para construir uma presença visual reconhecível.
              </p>
            </div>
            <div>
              <span className="fragma-eyebrow">O que foi organizado</span>
              <p className="fragma-body mt-5 text-base leading-7 text-[#514940]">
                Narrativa, identidade, direção de imagem e aplicações digitais foram reunidas em um sistema capaz de comunicar o lugar antes da chegada.
              </p>
            </div>
            <p className="border-t border-black/10 pt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8E7867]">
              Métricas de negócio não publicadas neste momento.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-5 border-t border-black/10 pt-16 md:grid-cols-3">
          {visualCards.map((card, index) => (
            <motion.figure
              key={card.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: index * 0.08 }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#D9D1C6]">
                <Image
                  src={card.src}
                  alt={card.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <figcaption className="pt-4">
                <span className="fragma-eyebrow">{card.label}</span>
                <h3 className="fragma-display mt-2 text-2xl">{card.title}</h3>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
