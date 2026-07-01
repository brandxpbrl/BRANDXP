import { brandStrategy } from "@/brand/brand.strategy";
import { siteConfig } from "@/config/site";
import { ctaStrategy } from "@/experience/experience.cta";
import type { HeroBadge, HeroCta, HeroFeature, HeroMedia } from "./types";

const primaryCta = ctaStrategy.find((cta) => cta.text === "Reservar Agora");
const secondaryCta = ctaStrategy.find((cta) => cta.text === "Ver Passeios");

export const heroMedia: HeroMedia = {
  src: "/images/hero-buggy.png",
  alt: "Pareja disfrutando un paseo en buggy amarillo con vista a la costa de Búzios",
  width: 1600,
  height: 2000,
};

export const heroTitle = "Conheça Búzios do jeito certo.";
export const heroEyebrow = brandStrategy.differentiation;
export const heroDescription = siteConfig.narrative;

export const heroCtas: HeroCta[] = [
  {
    label: primaryCta?.text ?? "Reservar Agora",
    href: siteConfig.links.whatsappMessage,
    external: true,
  },
  {
    label: secondaryCta?.text ?? "Ver Passeios",
    href: "#passeios",
  },
];

export const heroBadges: HeroBadge[] = [
  { label: "Guia Bilíngue" },
  { label: "Atendimento Rápido" },
  { label: "Buggy + Excursiones" },
];

export const heroFeatures: HeroFeature[] = [
  { label: "Aluguel de buggy e passeios" },
  { label: "Guías em português e español" },
  { label: "Reserva rápida por WhatsApp" },
];
