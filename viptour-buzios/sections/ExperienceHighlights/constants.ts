import { siteConfig } from "@/config/site";
import type { HighlightCard } from "./types";

export const experienceHighlightsLabel = "Experiencias destacadas";
export const experienceHighlightsTitle = "Uma forma melhor de conhecer Búzios";
export const experienceHighlightsDescription =
  "Tres experiencias principales que combinan libertad, seguridad y el encanto real de la península.";

export const experienceHighlights: HighlightCard[] = [
  {
    title: "Buggy com liberdade total",
    description:
      "Alugue un buggy para explorar playas, miradores y paradas icónicas a su propio ritmo.",
    duration: "24 horas o parcial",
    badge: "Más buscado",
    image: {
      src: "/images/hero-buggy.png",
      alt: "Pareja disfrutando un paseo en buggy amarillo en Búzios",
    },
  },
  {
    title: "Excursiones guiadas",
    description:
      "Rutas guiadas con atención personalizada y soporte bilingüe para viajar con más tranquilidad.",
    duration: "Según itinerario",
    image: {
      src: "/images/hero-buggy.png",
      alt: "Buggy amarillo con vista a la costa de Búzios",
    },
  },
  {
    title: "Reservas rápidas por WhatsApp",
    description:
      "Atención directa para confirmar disponibilidad, resolver dudas y cerrar la reserva sin fricción.",
    duration: "Respuesta rápida",
    image: {
      src: "/images/hero-buggy.png",
      alt: "Vista de buggy amarillo en un mirador de Búzios",
    },
  },
];

export const experienceHighlightsCta = {
  label: "Reservar agora",
  href: siteConfig.links.whatsappMessage,
};
