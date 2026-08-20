"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fragmaCases, fragmaCasaDaVoAssets } from "@/config/fragma.content";

const casaDaVo = fragmaCases.find((item) => item.id === "casa-da-vo");

export default function ComingSoon() {
  return (
    <section
      id="casa-da-vo"
      className="relative border-t border-[#d9d1c6] bg-[#eee9e1] px-6 py-24 text-[#1f1f1f] md:py-32"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8e7867]">
            Segundo caso / material seleccionado
          </span>
          <h2 className="font-primary text-3xl font-normal leading-tight tracking-tight sm:text-5xl">
            {casaDaVo?.name}
          </h2>
          <p className="text-lg leading-relaxed text-[#514940]">
            {casaDaVo?.summary}
          </p>
          <p className="max-w-xl text-sm leading-relaxed text-[#6f6358]">
            Esta selección presenta el sistema de identidad y storytelling
            documentado. La procedencia de las fotografías integradas en las
            piezas todavía requiere validación antes de publicarlas como
            producción fotográfica de FRAGMA.
          </p>
          <span className="inline-flex rounded-full border border-[#b69a80] bg-[#faf7f2] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#6f6358]">
            Material suministrado / provenance pendiente
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[8px] border border-[#d9d1c6] bg-[#faf7f2] p-4 shadow-[0_24px_70px_rgba(31,31,31,0.12)] lg:col-span-7 lg:p-6"
        >
          <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3">
            {fragmaCasaDaVoAssets.map((asset, index) => (
              <figure
                key={asset.src}
                className={index === 0 ? "col-span-2 sm:col-span-2" : "col-span-1"}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-[#d9d1c6]">
                  <Image
                    src={asset.src}
                    alt={asset.alt}
                    fill
                    sizes="(min-width: 1024px) 28vw, 45vw"
                    className="object-cover transition duration-500 hover:scale-[1.02]"
                  />
                </div>
                <figcaption className="pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8e7867]">
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
