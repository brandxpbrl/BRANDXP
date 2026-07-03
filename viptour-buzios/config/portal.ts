export const portalConfig = {
  name: "Brand Experience OS",
  shortName: "BE OS",
  description:
    "Portal oficial del ecosistema Brand Experience, MPE y QUBIT con acceso a proyectos, servicios y casos de éxito.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.riovibestransfer.com",
  links: {
    instagram: "https://www.instagram.com/viptourbuzios",
    whatsapp: "https://wa.me/552223503366",
  },
} as const;
