export const portalConfig = {
  name: "Brand Experience OS",
  shortName: "BE OS",
  description:
    "Portal oficial del ecosistema Brand Experience, MPE y QUBIT con acceso a proyectos, servicios y casos de éxito.",
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

