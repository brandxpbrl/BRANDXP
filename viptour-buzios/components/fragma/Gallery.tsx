"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const galleryImages = [
  { src: "/images/gallery-1.jpg", aspect: "aspect-[3/2]" },
  { src: "/images/gallery-2.jpg", aspect: "aspect-[3/2]" },
  { src: "/images/gallery-3.jpg", aspect: "aspect-[3/2]" },
  { src: "/images/gallery-4.jpg", aspect: "aspect-[3/2]" },
  { src: "/images/gallery-5.jpg", aspect: "aspect-[3/2]" },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className={`relative ${img.aspect} w-full rounded-2xl border border-white/5 bg-[#0b0e14]/50 overflow-hidden group hover:border-white/20 transition-all duration-500`}
            >
              <Image 
                src={img.src} 
                alt={`Produção Fragma Studio - Obra ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              
              <div className="absolute inset-0 bg-radial from-[#0ea5e9]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none">
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

