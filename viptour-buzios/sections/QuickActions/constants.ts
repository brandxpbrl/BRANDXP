import { siteConfig } from "@/config/site";
import { ctaStrategy } from "@/experience/experience.cta";
import type { QuickAction } from "./types";

const whatsappCta = ctaStrategy.find((cta) => cta.text === "Falar no WhatsApp");

export const quickActions: QuickAction[] = [
  {
    label: whatsappCta?.text ?? "Falar no WhatsApp",
    href: siteConfig.links.whatsapp,
    external: true,
    icon: "whatsapp",
  },
  {
    label: "Passeios",
    href: "#passeios",
    icon: "tours",
  },
  {
    label: "Nossa Localização",
    href: "#localizacao",
    icon: "location",
  },
];

export const quickActionsLabel = "Acesso rápido";
export const quickActionsTitle = "Escolha o caminho mais rápido para reservar";
export const quickActionsDescription =
  "Atalhos imediatos para quem já sabe o que quer: falar com a equipe, ver os passeios ou checar onde estamos.";
