import { brandStrategy } from "@/brand/brand.strategy";
import { siteConfig } from "@/config/site";
import type { WhyChooseFeature } from "./types";

export const whyChooseUsLabel = "Por qué elegir VIPTOUR";
export const whyChooseUsTitle = "Confianza real para vivir Búzios sin fricción";
export const whyChooseUsDescription = brandStrategy.promise;

export const whyChooseUsFeatures: WhyChooseFeature[] = [
  {
    title: "Atención personalizada",
    description:
      "Te acompañamos con una comunicación clara y directa para reservar sin vueltas.",
    icon: "message",
  },
  {
    title: "Guías bilingües",
    description:
      "Servicio pensado para viajeros que necesitan portugués y español con comodidad.",
    icon: "users",
  },
  {
    title: "Base física comprobable",
    description:
      "Contamos con ubicación y operación local en Búzios para transmitir seguridad.",
    icon: "shield",
  },
];

export const whyChooseUsStats = [
  { label: "WhatsApp oficial", value: siteConfig.contacts.phone },
  { label: "Ubicación", value: siteConfig.location.address },
  { label: "Idiomas", value: "Portugués / Español" },
] as const;
