"use client";

import { motion } from "framer-motion";

const galleryImages = [
  { aspect: "aspect-[4/5]", color: "bg-[#0b0e14]/50" },
  { aspect: "aspect-square", color: "bg-[#0b0e14]/40" },
  { aspect: "aspect-[3/4]", color: "bg-[#0b0e14]/60" },
  { aspect: "aspect-[4/3]", color: "bg-[#0b0e14]/30" },
  { aspect: "aspect-[3/2]", color: "bg-[#0b0e14]/50" },
  { aspect: "aspect-[4/5]", color: "bg-[#0b0e14]/40" },
  { aspect: "aspect-square", color: "bg-[#0b0e14]/50" },
  { aspect: "aspect-[3/4]", color: "bg-[#0b0e14]/60" },
];

export default function Gallery() {
  return (
    <section className="py-24 md:py-32 px-6 bg-[#07090e] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs font-bold tracking-[0.2em] text-[#0ea5e9] uppercase">
            Galeria Editorial
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Curadoria Visual
          </h2>
          <p className="text-gray-500 text-sm">
            Sem legendas. Sem distrações. Apenas a potência estética das produções que lideramos.
          </p>
        </div>

        {/* Editorial Masonry Layout */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {galleryImages.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className={`break-inside-avoid relative ${img.aspect} w-full rounded-2xl border border-white/5 ${img.color} overflow-hidden group hover:border-white/20 transition-all duration-500`}
            >
              {/* Future image placement point */}
              <div className="absolute inset-0 bg-radial from-[#0ea5e9]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
                <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest">
                  FRAGMA FRAME #{idx + 1}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
