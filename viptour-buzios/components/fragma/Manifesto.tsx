"use client";

import { motion } from "framer-motion";
import { FragmaHorizonLight } from "@/components/fragma/foundations";

export default function Manifesto() {
  return (
    <section className="fragma-manifesto-section relative overflow-hidden px-6 py-28 sm:py-40">
      <FragmaHorizonLight className="absolute inset-0 opacity-100" />
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="fragma-eyebrow"
        >
          Nosso manifesto
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="fragma-display mt-7 max-w-4xl text-4xl leading-[1.05] tracking-[-0.035em] text-[#1F1F1F] sm:text-6xl"
        >
          Não queremos simplesmente mostrar espaços. Queremos fazer pessoas desejarem estar neles.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.24 }}
          className="fragma-body mt-8 max-w-2xl text-lg leading-8 text-[#8E7867]"
        >
          O lugar já tem uma história. Nossa função é fazer com que ela seja percebida.
        </motion.p>
      </div>
    </section>
  );
}
