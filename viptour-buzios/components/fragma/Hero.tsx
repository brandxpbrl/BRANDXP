"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FragmaHorizonLight, FragmaLogoPair } from "@/components/fragma/foundations";

export default function Hero() {
  return (
    <section className="fragma-hero relative min-h-[760px] overflow-hidden bg-[#FAF7F2] px-6 pb-20 pt-7 text-[#1F1F1F] md:min-h-[820px] md:px-10 lg:px-16">
      <FragmaHorizonLight className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-60" />

      <header className="relative z-20 mx-auto flex max-w-[1360px] items-center justify-between gap-6">
        <FragmaLogoPair priority className="fragma-logo-pair-hero" />
        <nav aria-label="Navegação principal" className="hidden items-center gap-8 lg:flex">
          <a href="#case-study" className="fragma-nav-link">Cases</a>
          <a href="#services" className="fragma-nav-link">Serviços</a>
          <a href="#method" className="fragma-nav-link">Método</a>
          <a href="#solicitar" className="fragma-button fragma-button-light interactive">Diagnóstico</a>
        </nav>
      </header>

      <div className="relative z-10 mx-auto grid max-w-[1360px] items-center gap-12 pt-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:pt-24">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="fragma-eyebrow"
          >
            Estratégia · Identidade · Imagem · Tecnologia
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="fragma-display mt-7 max-w-[680px] text-5xl leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl"
          >
            Transformamos percepção em <span>valor.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="fragma-body mt-8 max-w-xl text-base leading-7 text-[#514940] sm:text-lg"
          >
            Estratégia, identidade, imagem e tecnologia trabalhando juntas para transformar marcas, espaços e experiências em algo desejado.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <a href="#solicitar" className="fragma-button fragma-button-earth interactive">Solicitar diagnóstico</a>
            <a href="#case-study" className="fragma-button fragma-button-light interactive">Conhecer nosso trabalho</a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="fragma-hero-visual relative aspect-[4/3] min-h-[360px] overflow-hidden rounded-[4px] lg:aspect-[1.15/1]"
        >
          <Image
            src="/images/buziosama-retiros.jpg"
            alt="Seleção visual do case BUZIOSAMA"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#faf7f2]/10 via-transparent to-[#1f1f1f]/20" />
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white">
            <span className="fragma-image-label">BUZIOSAMA / CASE</span>
            <span className="hidden text-[10px] uppercase tracking-[0.2em] sm:block">Experiência de hospitalidade</span>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-[#8E7867] md:flex">
        <span>Explorar</span>
        <span aria-hidden="true" className="h-px w-12 bg-[#8E7867]/50" />
        <span>01</span>
      </div>
    </section>
  );
}
