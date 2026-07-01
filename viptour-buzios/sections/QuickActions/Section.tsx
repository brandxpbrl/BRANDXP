"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, MessageCircle, Route } from "lucide-react";
import { colors } from "@/design-system";
import {
  quickActions,
  quickActionsDescription,
  quickActionsLabel,
  quickActionsTitle,
} from "./constants";
import { quickActionVariants, quickActionsSectionVariants } from "./animations";

const iconMap = {
  whatsapp: MessageCircle,
  tours: Route,
  location: MapPin,
} as const;

export function QuickActionsSection() {
  return (
    <section
      id="quick-actions"
      aria-labelledby="quick-actions-title"
      className="relative z-10 -mt-8 px-4 pb-6 sm:px-6 lg:-mt-10 lg:px-8"
    >
      <motion.div
        className="mx-auto w-full max-w-[var(--container-default)] rounded-[2rem] border border-slate-200/80 bg-white/95 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl"
        variants={quickActionsSectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="space-y-2">
            <p
              className="text-xs font-bold uppercase tracking-[0.24em]"
              style={{ color: colors.typography.secondary }}
            >
              {quickActionsLabel}
            </p>
            <h2
              id="quick-actions-title"
              className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl"
            >
              {quickActionsTitle}
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              {quickActionsDescription}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = iconMap[action.icon];
              const baseClass =
                "group inline-flex items-center justify-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--color-interactive-focus)]";
              const inner = (
                <>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/5 text-slate-950 transition-colors group-hover:bg-[color:var(--color-primary)] group-hover:text-white">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-left leading-5 text-slate-950">{action.label}</span>
                </>
              );

              if (action.external) {
                return (
                  <motion.a
                    key={action.label}
                    variants={quickActionVariants}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${baseClass} border border-emerald-200 bg-emerald-50 text-emerald-950 hover:-translate-y-0.5 hover:shadow-lg`}
                  >
                    {inner}
                  </motion.a>
                );
              }

              return (
                <motion.div key={action.label} variants={quickActionVariants}>
                  <Link
                    href={action.href}
                    className={`${baseClass} border border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-lg`}
                  >
                    {inner}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
