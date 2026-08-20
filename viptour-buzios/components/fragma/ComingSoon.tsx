"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fragmaCases, fragmaCasaDaVoAssets } from "@/config/fragma.content";

const casaDaVo = fragmaCases.find((item) => item.id === "casa-da-vo");

export default function ComingSoon() {
  return (
    <section id="casa-da-vo" className="fragma-case-section fragma-case-section-alt px-6 md:px-10 lg:px-16">
      <div className="mx-auto grid max-w-[1360px] items-start gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
        <div className="max-w-xl">
          <span className="fragma-eyebrow">Case / Property experience</span>
          <h2 className="fragma-display mt-6 text-5xl tracking-[-0.04em] sm:text-7xl">{casaDaVo?.name}</h2>
          <p className="fragma-display mt-6 text-2xl leading-tight text-[#514940] sm:text-3xl">
            Uma comunicação completa para um imóvel que traduz exclusividade e autenticidade.
          </p>
          <p className="fragma-body mt-8 text-base leading-7 text-[#514940]">
            {casaDaVo?.summary}
          </p>
          <p className="fragma-body mt-6 text-sm leading-6 text-[#6F6358]">
            A seleção abaixo apresenta o sistema de identidade e storytelling documentado. As fotografias incorporadas nas peças seguem com procedência em validação e não são apresentadas como produção fotográfica final da FRAGMA.
          </p>
          <span className="mt-7 inline-flex border border-[#B69A80] bg-[#FAF7F2] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6F6358]">
            Material selecionado / procedência em validação
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="fragma-case-mosaic rounded-[4px] border border-[#D9D1C6] bg-[#FAF7F2] p-4 shadow-[0_24px_70px_rgba(31,31,31,0.1)] sm:p-6"
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {fragmaCasaDaVoAssets.map((asset, index) => (
              <figure key={asset.src} className={index === 0 ? "col-span-2 sm:col-span-2" : "col-span-1"}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] bg-[#D9D1C6]">
                  <Image
                    src={asset.src}
                    alt={asset.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 30vw, 28vw"
                    className="object-cover transition duration-700 hover:scale-[1.02]"
                  />
                </div>
                <figcaption className="pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8E7867]">
                  {asset.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
