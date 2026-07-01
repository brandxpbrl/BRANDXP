"use client";

import { ShieldCheck, MessageCircle, Users2 } from "lucide-react";
import { motion } from "framer-motion";
import { whyChooseUsDescription, whyChooseUsFeatures, whyChooseUsLabel, whyChooseUsStats, whyChooseUsTitle } from "./constants";
import { whyChooseUsItemVariants, whyChooseUsSectionVariants } from "./animations";

const iconMap = {
  shield: ShieldCheck,
  users: Users2,
  message: MessageCircle,
} as const;

export function WhyChooseUsSection() {
  return (
    <section
      id="why-choose-us"
      aria-labelledby="why-choose-us-title"
      className="section-padding bg-slate-950 px-4 text-white sm:px-6 lg:px-8"
    >
      <motion.div
        className="mx-auto grid w-full max-w-[var(--container-default)] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)] lg:items-start"
        variants={whyChooseUsSectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--color-secondary)]">
            {whyChooseUsLabel}
          </p>
          <h2
            id="why-choose-us-title"
            className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            {whyChooseUsTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
            {whyChooseUsDescription}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {whyChooseUsFeatures.map((feature) => {
              const Icon = iconMap[feature.icon];
              return (
                <motion.article
                  key={feature.title}
                  variants={whyChooseUsItemVariants}
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--color-secondary)] text-slate-950">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">{feature.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>

        <motion.aside
          variants={whyChooseUsItemVariants}
          className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
        >
          <h3 className="text-lg font-bold">Datos que refuerzan confianza</h3>
          <div className="mt-6 space-y-4">
            {whyChooseUsStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">{stat.label}</p>
                <p className="mt-1 text-sm font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.aside>
      </motion.div>
    </section>
  );
}
