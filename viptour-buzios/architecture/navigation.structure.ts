/**
 * Navigation Structure
 * Portal global navigation for the ecosystem.
 */

export const navigationStructure = {
  navbar: {
    items: [
      { label: "Inicio", href: "/" },
      { label: "Brand Experience", href: "/brandexperience" },
      { label: "MPE", href: "/mpe" },
      { label: "QUBIT", href: "/qubit" },
      { label: "Servicios", href: "/services" },
      { label: "Proyectos", href: "/projects" },
      { label: "Contacto", href: "/contact" },
    ],
    primaryCta: { label: "Ver proyecto VIPTOUR", href: "/projects/viptour" },
  },
  footer: {
    links: [
      { label: "Inicio", href: "/" },
      { label: "Brand Experience", href: "/brandexperience" },
      { label: "MPE", href: "/mpe" },
      { label: "QUBIT", href: "/qubit" },
      { label: "Proyectos", href: "/projects" },
      { label: "Contacto", href: "/contact" },
    ],
    social: [
      { label: "Instagram", href: "https://www.instagram.com/viptourbuzios" },
      { label: "WhatsApp", href: "https://wa.me/552223503366" },
    ],
  },
} as const;
