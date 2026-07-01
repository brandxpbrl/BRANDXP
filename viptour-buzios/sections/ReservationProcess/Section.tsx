"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  reservationProcessCta,
  reservationProcessDescription,
  reservationProcessLabel,
  reservationProcessTitle,
  reservationSteps,
} from "./constants";
import { reservationProcessSectionVariants, reservationStepVariants } from "./animations";

export function ReservationProcessSection() {
  return (
    <section
      id="reservation-process"
      aria-labelledby="reservation-process-title"
      className="section-padding bg-white px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        className="mx-auto w-full max-w-[var(--container-default)]"
        variants={reservationProcessSectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--color-primary)]">
            {reservationProcessLabel}
          </p>
          <h2
            id="reservation-process-title"
            className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl"
          >
            {reservationProcessTitle}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {reservationProcessDescription}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {reservationSteps.map((step) => (
            <motion.article
              key={step.number}
              variants={reservationStepVariants}
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 shadow-sm"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-primary)] text-sm font-bold text-white">
                {step.number}
              </span>
              <h3 className="mt-5 text-xl font-bold text-slate-950">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[color:var(--color-primary)]">
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                Flujo simple y directo
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex justify-start">
          <Link
            href={reservationProcessCta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[color:var(--color-secondary)] px-5 text-sm font-semibold text-slate-950 transition-transform duration-200 hover:-translate-y-0.5"
          >
            {reservationProcessCta.label}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
