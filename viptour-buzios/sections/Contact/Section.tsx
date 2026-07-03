"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PhoneCall, MapPin, Globe, Clock3 } from "lucide-react";
import { contactCta, contactDescription, contactItems, contactLabel, contactTitle } from "./constants";
import { contactItemVariants, contactSectionVariants } from "./animations";

const iconMap = {
  WhatsApp: PhoneCall,
  Instagram: Globe,
  Horario: Clock3,
  Dirección: MapPin,
} as const;

export function ContactSection() {
  return (
    <section
      id="contato"
      aria-labelledby="contact-title"
      className="section-padding bg-slate-950 px-4 text-white sm:px-6 lg:px-8"
    >
      <motion.div
        className="mx-auto w-full max-w-[var(--container-default)] rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl lg:p-8"
        variants={contactSectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--color-secondary)]">
              {contactLabel}
            </p>
            <h2
              id="contact-title"
              className="mt-3 text-h2"
            >
              {contactTitle}
            </h2>
            <p className="mt-4 text-body text-white/75">
              {contactDescription}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {contactItems.map((item) => {
                const Icon = iconMap[item.label as keyof typeof iconMap];
                return (
                  <motion.article
                    key={item.label}
                    variants={contactItemVariants}
                    className="card rounded-[1.25rem] border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-center gap-3">
                      {Icon ? (
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-secondary)] text-slate-950">
                          <Icon className="h-4 w-4" aria-hidden />
                        </span>
                      ) : null}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">
                          {item.label}
                        </p>
                        <p className="text-sm font-semibold text-white">{item.value}</p>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>

          <motion.div variants={contactItemVariants} className="lg:min-w-[280px]">
            <Link
              href={contactCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="cta interactive inline-flex w-full items-center justify-center gap-2 bg-[color:var(--color-secondary)] text-slate-950 hover:bg-[color:var(--color-secondary)]"
            >
              {contactCta.label}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
