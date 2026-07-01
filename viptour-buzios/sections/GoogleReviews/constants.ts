import { siteConfig } from "@/config/site";
import type { ReviewCard } from "./types";

export const googleReviewsLabel = "Google Reviews";
export const googleReviewsTitle = "Avaliações reais, prontas para reforçar confiança";
export const googleReviewsDescription =
  "Dejamos esta sección preparada para que subas las reseñas reales sin inventar testimonios ni alterar la voz de la marca.";

export const googleReviewsCta = {
  label: "Ver en Google Maps",
  href: siteConfig.links.maps,
};

export const reviewCards: ReviewCard[] = [
  {
    author: "Reseña 1",
    text: "Pega aquí una reseña real del perfil de Google.",
    rating: 5,
    source: "Google",
  },
  {
    author: "Reseña 2",
    text: "Pega aquí otra reseña real para reforzar confianza.",
    rating: 5,
    source: "Google",
  },
  {
    author: "Reseña 3",
    text: "Pega aquí una tercera reseña real cuando la subas.",
    rating: 5,
    source: "Google",
  },
];
