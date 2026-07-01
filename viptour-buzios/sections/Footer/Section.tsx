"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { footerCopy, footerLinks, footerSocialLinks } from "./constants";
import { footerItemVariants, footerSectionVariants } from "./animations";
import { brandStrategy } from "@/brand/brand.strategy";

export function FooterSection() {
  return (
    <footer id="footer" className="border-t border-slate-200 bg-slate-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <motion.div
        className="mx-auto grid w-full max-w-[var(--container-default)] gap-8 lg:grid-cols-[minmax(0,1fr)_auto_auto]"
        variants={footerSectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={footerItemVariants}>
          <p className="text-lg font-extrabold tracking-tight">{brandStrategy.identity}</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/70">{footerCopy}</p>
        </motion.div>

        <motion.nav variants={footerItemVariants} aria-label="Navegación del footer">
          <ul className="space-y-3 text-sm font-semibold text-white/80">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.nav>

        <motion.nav variants={footerItemVariants} aria-label="Redes sociales">
          <ul className="space-y-3 text-sm font-semibold text-white/80">
            {footerSocialLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.nav>
      </motion.div>

      <div className="mx-auto mt-10 w-full max-w-[var(--container-default)] border-t border-white/10 pt-6 text-sm text-white/50">
        © 2026 VIPTOUR BÚZIOS. Todos os direitos reservados.
      </div>
    </footer>
  );
}
