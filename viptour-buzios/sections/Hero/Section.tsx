"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { brandStrategy } from "@/brand/brand.strategy";
import {
  heroBadges,
  heroCtas,
  heroDescription,
  heroEyebrow,
  heroFeatures,
  heroMedia,
  heroTitle,
} from "./constants";
import { heroItemVariants, heroMediaVariants, heroSectionVariants } from "./animations";

export function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate min-h-screen overflow-hidden bg-black text-white"
    >
      <motion.div
        className="absolute inset-0"
        variants={heroMediaVariants}
        initial="hidden"
        animate="visible"
      >
        <Image
          src={heroMedia.src}
          alt={heroMedia.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/45 to-black/85" />
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-[var(--container-default)] items-end px-4 py-10 sm:px-6 lg:px-8"
        variants={heroSectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-end">
          <div className="max-w-3xl">
            <motion.p
              variants={heroItemVariants}
              className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-caption font-semibold text-white/90 backdrop-blur-md"
            >
              {heroEyebrow}
            </motion.p>

            <motion.h1
              id="hero-title"
              variants={heroItemVariants}
              className="max-w-2xl text-display"
            >
              {heroTitle}
            </motion.h1>

            <motion.p
              variants={heroItemVariants}
              className="mt-6 max-w-xl text-subtitle text-white/80"
            >
              {heroDescription}
            </motion.p>

            <motion.div
              variants={heroItemVariants}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              {heroCtas.map((cta) => {
                const sharedClass =
                  "interactive inline-flex h-14 items-center justify-center rounded-full px-6 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80";

                if (cta.external) {
                  return (
                    <a
                      key={cta.label}
                      href={cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${sharedClass} bg-[color:var(--color-secondary)] text-slate-950`}
                    >
                      {cta.label}
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                    </a>
                  );
                }

                return (
                  <Link
                    key={cta.label}
                    href={cta.href}
                    className={`${sharedClass} border border-white/20 bg-white/10 text-white backdrop-blur-md`}
                  >
                    {cta.label}
                  </Link>
                );
              })}
            </motion.div>

            <motion.div
              variants={heroItemVariants}
              className="mt-8 flex flex-wrap gap-3"
            >
              {heroBadges.map((badge) => (
                <span
                  key={badge.label}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white/90 backdrop-blur-md"
                >
                  {badge.label}
                </span>
              ))}
            </motion.div>

            <motion.ul
              variants={heroItemVariants}
              className="mt-8 grid gap-3 text-sm text-white/75 sm:grid-cols-3"
            >
              {heroFeatures.map((feature) => (
                <li key={feature.label} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[color:var(--color-secondary)]" />
                  <span>{feature.label}</span>
                </li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            variants={heroItemVariants}
            className="hidden lg:flex lg:justify-end"
          >
            <div className="w-full max-w-[18rem] rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/10">
                <Image
                  src={heroMedia.src}
                  alt={heroMedia.alt}
                  width={heroMedia.width}
                  height={heroMedia.height}
                  className="h-[28rem] w-full object-cover object-center"
                />
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold text-white/90">VIPTOUR BÚZIOS</p>
                <p className="text-sm leading-6 text-white/75">
                  {brandStrategy.promise}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.a
        href="#passeios"
        className="interactive absolute bottom-6 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white/85 backdrop-blur-md"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        Explorar abajo
        <ChevronDown className="h-4 w-4" aria-hidden />
      </motion.a>
    </section>
  );
}
