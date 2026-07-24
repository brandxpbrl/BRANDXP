/**
 * Navigation Structure
 * Portal global navigation for the ecosystem.
 */

export const navigationStructure = {
  navbar: {
    items: [
      { label: "Home", href: "/" },
      { label: "Brand Experience", href: "/brandexperience" },
      { label: "MPE", href: "/mpe" },
      { label: "QUBIT", href: "/qubit" },
      { label: "Visual Universes", href: "/universos-visuales" },
      { label: "Services", href: "/services" },
      { label: "Projects", href: "/projects" },
      { label: "Contact", href: "/contact" },
    ],
    primaryCta: { label: "Fragma Studio", href: "/fragma-brand-experience" },
  },
  footer: {
    links: [
      { label: "Home", href: "/" },
      { label: "Brand Experience", href: "/brandexperience" },
      { label: "MPE", href: "/mpe" },
      { label: "QUBIT", href: "/qubit" },
      { label: "Visual Universes", href: "/universos-visuales" },
      { label: "Projects", href: "/projects" },
      { label: "Contact", href: "/contact" },
    ],
    social: [
      { label: "Instagram", href: "https://www.instagram.com/viptourbuzios" },
      { label: "WhatsApp", href: "https://wa.me/552223503366" },
    ],
  },
} as const;
