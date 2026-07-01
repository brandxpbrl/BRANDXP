import { siteConfig } from "@/config/site";
import type { ContactItem } from "./types";

export const contactLabel = "Contacto";
export const contactTitle = "Hablemos y cerramos tu reserva";
export const contactDescription =
  "Conecta con VIPTOUR por WhatsApp y coordina tu experiencia con atención rápida y directa.";

export const contactItems: ContactItem[] = [
  { label: "WhatsApp", value: siteConfig.contacts.phone },
  { label: "Instagram", value: "@viptourbuzios" },
  { label: "Horario", value: "Lun 09:00-21:00 | Mié-Sáb 09:00-22:00 | Dom 24h" },
  { label: "Dirección", value: siteConfig.location.address },
];

export const contactCta = {
  label: "Reservar pelo WhatsApp",
  href: siteConfig.links.whatsappMessage,
};
