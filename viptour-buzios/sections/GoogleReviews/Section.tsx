"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, MessageCircleWarning } from "lucide-react";
import { googleReviewsCta, googleReviewsDescription, googleReviewsLabel, googleReviewsTitle } from "./constants";
import { googleReviewsSectionVariants } from "./animations";

export function GoogleReviewsSection() {
  return (
    <section
      id="avaliacoes"
      aria-labelledby="google-reviews-title"
      className="section-padding bg-slate-50 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        className="mx-auto w-full max-w-[var(--container-default)]"
        variants={googleReviewsSectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--color-primary)]">
              {googleReviewsLabel}
            </p>
            <h2
              id="google-reviews-title"
              className="mt-3 text-h2 text-slate-950"
            >
              {googleReviewsTitle}
            </h2>
            <p className="mt-4 text-body text-slate-600">
              {googleReviewsDescription}
            </p>
          </div>

          <Link
            href={googleReviewsCta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="interactive inline-flex h-12 items-center gap-2 rounded-full border border-[color:var(--color-primary)] px-5 text-sm font-semibold text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)] hover:text-white"
          >
            {googleReviewsCta.label}
            <ExternalLink className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="card mt-10 rounded-[1.75rem] bg-white p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-secondary)] text-slate-950">
              <MessageCircleWarning className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-950">
                Espacio listo para reseñas reales
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Aquí puedes pegar las reseñas auténticas de Google cuando quieras. El diseño ya está preparado para mostrarlas con confianza sin usar testimonios ficticios.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
