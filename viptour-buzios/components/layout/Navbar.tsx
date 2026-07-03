"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Menu, ChevronRight } from "lucide-react";
import Link from "next/link";
import { navigationStructure } from "@/architecture/navigation.structure";
import { zIndex, typography } from "@/design-system";
import { useSmartHeader } from "./useSmartHeader";
import { MobileDrawer } from "./MobileDrawer";
import { NavbarLogo } from "./NavbarLogo";

export function Navbar() {
  const { isVisible, isAtTop } = useSmartHeader();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const { items, primaryCta } = navigationStructure.navbar;
  const logoVariant = isAtTop ? "light" : "dark";
  const linkClass = isAtTop
    ? "text-text-inverse/90 hover:text-text-inverse"
    : "text-text-secondary hover:text-text-primary";

  return (
    <>
      <motion.header
        role="banner"
        className={`fixed inset-x-0 top-0 transition-[background-color,box-shadow,border-color] duration-300 ${
          isAtTop
            ? "border-transparent bg-transparent"
            : "border-b border-border bg-background/85 shadow-sm backdrop-blur-md"
        }`}
        style={{ zIndex: zIndex.navbar }}
        initial={false}
        animate={{ y: isVisible ? 0 : "-100%" }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.3,
          ease: "easeOut",
        }}
      >
        <div
          className="container-padding flex h-14 items-center justify-between lg:h-[4.5rem]"
          style={{ maxWidth: "var(--container-default)" }}
        >
          <NavbarLogo variant={logoVariant} />

          <nav
            className="hidden flex-1 items-center justify-center lg:flex"
            aria-label="Navegação principal"
          >
            <ul className="flex items-center gap-8">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`interactive font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-interactive-focus ${linkClass}`}
                    style={{ fontSize: typography.semantics.navigation }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link href={primaryCta.href} className="cta interactive hidden gap-1.5 lg:inline-flex">
              {primaryCta.label}
              <ChevronRight size={18} aria-hidden className="opacity-80" />
            </Link>

            <button
              type="button"
              className={`interactive flex h-10 w-10 items-center justify-center rounded-lg lg:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-interactive-focus ${
                isAtTop ? "text-text-inverse" : "text-text-primary"
              }`}
              aria-label="Abrir menu de navegação"
              aria-expanded={isDrawerOpen}
              onClick={() => setIsDrawerOpen(true)}
            >
              <Menu size={24} aria-hidden />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
