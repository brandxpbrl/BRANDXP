/**
 * ORBIS global navigation.
 * The portal shell represents the ecosystem, never one individual world.
 */

export const navigationStructure = {
  navbar: {
    items: [
      { label: "Explore", href: "/#ecosystem" },
      { label: "Worlds", href: "/#everything" },
      { label: "Projects", href: "/projects" },
      { label: "About", href: "/about" },
    ],
    primaryCta: { label: "Discover", href: "/#ecosystem" },
  },
  footer: {
    links: [
      { label: "Explore", href: "/#ecosystem" },
      { label: "Worlds", href: "/#everything" },
      { label: "Projects", href: "/projects" },
      { label: "Contact", href: "/contact" },
    ],
    social: [
      { label: "WhatsApp", href: "https://wa.me/5545999686381" },
    ],
  },
} as const;
