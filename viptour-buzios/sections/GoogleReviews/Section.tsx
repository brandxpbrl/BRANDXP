"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ExternalLink } from "lucide-react";
import { googleReviewsCta, googleReviewsDescription, googleReviewsLabel, googleReviewsTitle, reviewCards } from "./constants";
import { googleReviewItemVariants, googleReviewsSectionVariants } from "./animations";

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
              className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl"
            >
              {googleReviewsTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {googleReviewsDescription}
            </p>
          </div>

          <Link
            href={googleReviewsCta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-[color:var(--color-primary)] px-5 text-sm font-semibold text-[color:var(--color-primary)] transition-colors hover:bg-[color:var(--color-primary)] hover:text-white"
          >
            {googleReviewsCta.label}
            <ExternalLink className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviewCards.map((review) => (
            <motion.article
              key={review.author}
              variants={googleReviewItemVariants}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-1 text-[color:var(--color-secondary)]">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" aria-hidden />
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-700">{review.text}</p>
              <div className="mt-5 border-t border-slate-200 pt-4">
                <p className="text-sm font-bold text-slate-950">{review.author}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{review.source}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
