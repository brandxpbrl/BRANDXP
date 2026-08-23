export const portalConfig = {
  name: "ORBIS",
  shortName: "ORBIS",
  tagline: "EVERYTHING, CONNECTED.",
  description:
    "ORBIS is a connected ecosystem of independent brands, services, projects, and digital experiences.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.riovibestransfer.com",
  links: {
    instagram: "https://www.instagram.com/brandexperience.br",
    instagramPersonal: "https://www.instagram.com/fela_cto",
    instagramTours: "https://www.instagram.com/fela.tours",
    instagramMpe: "https://www.instagram.com/mpe_engine",
    whatsapp: "https://wa.me/5545999686381",
  },
  contacts: {
    phone: "+55 45 99968-6381",
    location: "Rio de Janeiro, Brazil",
  }
} as const;
