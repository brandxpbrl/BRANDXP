"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPinned, ArrowRight } from "lucide-react";
import { locationDescription, locationLabel, locationMapLink, locationMapUrl, locationPoints, locationTitle } from "./constants";
import { locationItemVariants, locationSectionVariants } from "./animations";

export function LocationSection() {
  return (
    <section
      id="localizacao"
      aria-labelledby="location-title"
      className="section-padding bg-white px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        className="mx-auto grid w-full max-w-[var(--container-default)] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.9fr)] lg:items-start"
        variants={locationSectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--color-primary)]">
            {locationLabel}
          </p>
          <h2
            id="location-title"
            className="mt-3 text-h2 text-slate-950"
          >
            {locationTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-body text-slate-600">
            {locationDescription}
          </p>

          <div className="mt-8 grid gap-4">
            {locationPoints.map((point) => (
              <motion.article
                key={point.label}
                variants={locationItemVariants}
                className="card rounded-[1.5rem] bg-slate-50 p-5"
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  {point.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{point.value}</p>
              </motion.article>
            ))}
          </div>
        </div>

        <motion.div
          variants={locationItemVariants}
          className="card rounded-[1.75rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-xl"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--color-secondary)] text-slate-950">
              <MapPinned className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">
                Mapa
              </p>
              <p className="text-sm font-semibold text-white">Abrir en Google Maps</p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
            <iframe
              title="VIPTOUR Búzios - mapa"
              src={locationMapUrl}
              className="h-[320px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <Link
            href={locationMapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="cta interactive mt-5 inline-flex h-12 items-center gap-2 bg-[color:var(--color-secondary)] px-5 text-sm font-bold text-slate-950 hover:bg-[color:var(--color-secondary)]"
          >
            Cómo llegar
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
