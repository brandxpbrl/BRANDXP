import { siteConfig } from "@/config/site";
import type { LocationPoint } from "./types";

export const locationLabel = "Ubicación";
export const locationTitle = "Estamos en el centro de Búzios";
export const locationDescription =
  "La ubicación real refuerza confianza y facilita el acceso directo al punto de operación.";

export const locationPoints: LocationPoint[] = [
  { label: "Dirección", value: siteConfig.location.address },
  { label: "Área de servicio", value: siteConfig.location.area },
  { label: "Horario", value: "Lun 09:00-21:00 | Mié-Sáb 09:00-22:00 | Dom 24h" },
];

export const locationMapUrl = siteConfig.location.mapEmbedUrl;
export const locationMapLink = siteConfig.location.mapUrl;
