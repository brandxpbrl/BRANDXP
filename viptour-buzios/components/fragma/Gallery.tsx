"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fragmaVisualFrames } from "@/config/fragma.content";

export default function Gallery() {
  return (
    <section className="relative border-t border-white/5 bg-[#07090e] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D6A24A]">
            Experiência visual / arquivo de caso
          </span>
          <h2 className="font-primary text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Direção visual com contexto.
          </h2>
          <p className="text-sm leading-relaxed text-gray-500">
            Uma seleção identificada de materiais visuais de BUZIOSAMA. CASA DA
            VÓ será publicada aqui quando seus assets reais forem validados.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {fragmaVisualFrames.map((frame, idx) => (
            <motion.div
              key={frame.src}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className={`group relative w-full overflow-hidden rounded-2xl border border-white/5 bg-[#0b0e14]/50 transition-all duration-500 hover:border-white/20 ${frame.aspect}`}
            >
              <Image
                src={frame.src}
                alt={frame.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="pointer-events-none absolute bottom-4 left-4">
                <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#D6A24A]">
                  {frame.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
