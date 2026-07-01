"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock3 } from "lucide-react";
import {
  experienceHighlights,
  experienceHighlightsCta,
  experienceHighlightsDescription,
  experienceHighlightsLabel,
  experienceHighlightsTitle,
} from "./constants";
import { experienceHighlightVariants, experienceHighlightsSectionVariants } from "./animations";

export function ExperienceHighlightsSection() {
  return (
    <section
      id="experiencias"
      aria-labelledby="experience-highlights-title"
      className="section-padding bg-slate-50 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        className="mx-auto w-full max-w-[var(--container-default)]"
        variants={experienceHighlightsSectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--color-primary)]">
            {experienceHighlightsLabel}
          </p>
          <h2
            id="experience-highlights-title"
            className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl"
          >
            {experienceHighlightsTitle}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {experienceHighlightsDescription}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {experienceHighlights.map((highlight) => (
            <motion.article
              key={highlight.title}
              variants={experienceHighlightVariants}
              className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={highlight.image.src}
                  alt={highlight.image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
                {highlight.badge ? (
                  <span className="absolute left-4 top-4 rounded-full bg-[color:var(--color-secondary)] px-3 py-1 text-xs font-bold text-slate-950 shadow-md">
                    {highlight.badge}
                  </span>
                ) : null}
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-slate-950">
                    {highlight.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {highlight.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Clock3 className="h-4 w-4 text-[color:var(--color-primary)]" aria-hidden />
                    {highlight.duration}
                  </span>
                  <Link
                    href={experienceHighlightsCta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-primary)] transition-colors hover:text-[color:var(--color-interactive-hover)]"
                  >
                    {experienceHighlightsCta.label}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
