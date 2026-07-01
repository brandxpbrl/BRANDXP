import { siteConfig } from "@/config/site";
import type { FooterLink } from "./types";

export const footerLinks: FooterLink[] = [
  { label: "Passeios", href: "#passeios" },
  { label: "Avaliações", href: "#avaliacoes" },
  { label: "FAQ", href: "#faq" },
  { label: "Contato", href: "#contato" },
];

export const footerSocialLinks: FooterLink[] = [
  { label: "Instagram", href: siteConfig.links.instagram },
  { label: "WhatsApp", href: siteConfig.links.whatsappMessage },
];

export const footerCopy =
  "VIPTOUR BÚZIOS · Aluguel de buggy y excursiones guiadas con atención bilingüe.";
