import { siteConfig } from "@/config/site";
import type { ReservationStep } from "./types";

export const reservationProcessLabel = "Cómo reservar";
export const reservationProcessTitle = "Tres pasos simples para cerrar tu reserva";
export const reservationProcessDescription =
  "Un flujo directo para convertir interés en acción sin carrito, sin formularios complejos y sin fricción.";

export const reservationSteps: ReservationStep[] = [
  {
    number: "01",
    title: "Elige tu experiencia",
    description: "Explora los servicios y selecciona la opción que mejor encaje con tu viaje.",
  },
  {
    number: "02",
    title: "Escríbenos por WhatsApp",
    description: "Confirma disponibilidad, resuelve dudas y recibe atención personalizada.",
  },
  {
    number: "03",
    title: "Disfruta Búzios",
    description: "Nos ocupamos de la operación para que te concentres en vivir la experiencia.",
  },
];

export const reservationProcessCta = {
  label: "Iniciar reserva",
  href: siteConfig.links.whatsappMessage,
};
