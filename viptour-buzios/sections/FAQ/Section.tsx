"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { faqDescription, faqItems, faqLabel, faqTitle } from "./constants";
import { faqItemVariants, faqSectionVariants } from "./animations";

export function FAQSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="section-padding bg-slate-50 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        className="mx-auto w-full max-w-[var(--container-default)]"
        variants={faqSectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--color-primary)]">
            {faqLabel}
          </p>
          <h2
            id="faq-title"
            className="mt-3 text-h2 text-slate-950"
          >
            {faqTitle}
          </h2>
          <p className="mt-4 text-body text-slate-600">
            {faqDescription}
          </p>
        </div>

        <div className="mt-10 grid gap-4">
          {faqItems.map((item) => (
            <motion.details
              key={item.question}
              variants={faqItemVariants}
              className="card group rounded-[1.5rem] bg-white p-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-bold text-slate-950">
                {item.question}
                <ChevronDown className="h-5 w-5 shrink-0 text-[color:var(--color-primary)] transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
                {item.answer}
              </p>
            </motion.details>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
