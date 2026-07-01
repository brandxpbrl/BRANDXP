"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgePercent, Clock3 } from "lucide-react";
import {
  services,
  servicesDescription,
  servicesLabel,
  servicesTitle,
} from "./constants";
import { serviceCardVariants, servicesSectionVariants } from "./animations";

export function ServicesSection() {
  return (
    <section
      id="passeios"
      aria-labelledby="services-title"
      className="section-padding bg-white px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        className="mx-auto w-full max-w-[var(--container-default)]"
        variants={servicesSectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--color-primary)]">
            {servicesLabel}
          </p>
          <h2
            id="services-title"
            className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl"
          >
            {servicesTitle}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {servicesDescription}
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <motion.article
              key={service.title}
              variants={serviceCardVariants}
              className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/hero-buggy.png"
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />
                {service.price.value === "A consultar" ? (
                  <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-950 shadow-md">
                    <BadgePercent className="h-4 w-4 text-[color:var(--color-primary)]" aria-hidden />
                    Consulta
                  </span>
                ) : null}
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-slate-950">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
                  <div>
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      <Clock3 className="h-4 w-4 text-[color:var(--color-primary)]" aria-hidden />
                      {service.price.label}
                    </span>
                    <p className="mt-1 text-lg font-extrabold text-[color:var(--color-primary)]">
                      {service.price.value}
                    </p>
                    {service.note ? (
                      <p className="mt-1 text-xs leading-5 text-slate-500">{service.note}</p>
                    ) : null}
                  </div>

                  <Link
                    href={service.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-[color:var(--color-primary)] px-4 text-sm font-semibold text-[color:var(--color-primary)] transition-colors hover:bg-[color:var(--color-primary)] hover:text-white"
                  >
                    {service.ctaLabel}
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
