"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fragmaVisualFrames } from "@/config/fragma.content";

export default function Gallery() {
  return (
    <section id="gallery" className="fragma-gallery-section px-6">
      <div className="mx-auto max-w-[var(--fragma-content-max)]">
        <div className="mb-16 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,28rem)] lg:items-end">
          <div className="space-y-5">
            <span className="fragma-eyebrow">Arquivo visual / BUZIOSAMA</span>
            <h2 className="fragma-display max-w-3xl text-4xl leading-[1.04] tracking-[-0.035em] text-[#1F1F1F] sm:text-6xl">
              Imagem é percepção.
            </h2>
          </div>
          <p className="fragma-body max-w-md text-base leading-8 text-[#8E7867]">
            Uma seleção identificada de materiais reais do case BUZIOSAMA, organizada para mostrar atmosfera, contexto e direção visual.
          </p>
        </div>

        <div className="fragma-gallery-grid">
          {fragmaVisualFrames.map((frame, idx) => (
            <motion.figure
              key={frame.src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: idx * 0.08 }}
              className={`group relative overflow-hidden border border-black/10 bg-[#EEE9E1] ${frame.aspect}`}
            >
              <Image
                src={frame.src}
                alt={frame.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#1F1F1F]/65 via-transparent to-transparent" />
              <figcaption className="fragma-body absolute bottom-4 left-4 text-[0.625rem] font-bold uppercase tracking-[0.16em] text-[#FAF7F2]">
                {frame.label}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
