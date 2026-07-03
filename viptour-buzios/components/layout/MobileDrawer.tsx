"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { navigationStructure } from "@/architecture/navigation.structure";
import { zIndex, typography } from "@/design-system";
import { NavbarLogo } from "./NavbarLogo";

type MobileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  const handleNavClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Fechar menu"
            className="fixed inset-0 bg-overlay"
            style={{ zIndex: zIndex.overlay }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.2,
              ease: "easeOut",
            }}
            onClick={onClose}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            tabIndex={-1}
            className="fixed inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col bg-background shadow-xl"
            style={{ zIndex: zIndex.overlay + 1 }}
            initial={{ x: prefersReducedMotion ? 0 : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: prefersReducedMotion ? 0 : "100%" }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.3,
              ease: "easeOut",
            }}
          >
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <NavbarLogo variant="dark" />
              <button
                type="button"
                onClick={onClose}
                className="interactive flex h-10 w-10 items-center justify-center rounded-lg text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-interactive-focus"
                aria-label="Fechar menu"
              >
                <X size={22} aria-hidden />
              </button>
            </div>

            <nav
              className="flex flex-1 flex-col px-4 py-6"
              aria-label="Navegação principal"
            >
              <ul className="flex flex-col gap-1">
                {navigationStructure.navbar.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={handleNavClick}
                      className="interactive block rounded-lg px-3 py-4 font-semibold text-text-primary transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-interactive-focus"
                      style={{ fontSize: typography.semantics.navigation }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-auto border-t border-border pt-6">
                <a
                  href={navigationStructure.navbar.primaryCta.href}
                  className="cta interactive w-full gap-2"
                  onClick={handleNavClick}
                >
                  {navigationStructure.navbar.primaryCta.label}
                </a>
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
