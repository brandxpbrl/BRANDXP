export type Boat = {
  slug: string;
  title: string;
  name: string;
  subtitle: string;
  description: string;
  price: string;
  tags: string[];
  features: string[];
  photos: string[];
  video?: string;
};

export const boats: Boat[] = [
  {
    slug: "gratidao",
    title: "FÊNIX 27.5 — GRATIDÃO",
    name: "Gratidão",
    subtitle: "Lancha cabinada · Até 10 pessoas",
    description: "Conforto e praticidade para viver Búzios pelo mar com família e amigos.",
    price: "A partir de R$ 2.000",
    tags: ["27,5 pés", "10 pessoas"],
    features: ["Cabine", "Banheiro", "Churrasqueira", "Pia", "Ducha com água doce", "Som Bluetooth", "Máscara de mergulho", "Macarrão flutuante"],
    photos: [
      "/IMG-20261017-WA0134.jpg",
      "/IMG-20261017-WA0135.jpg",
      "/IMG-20261017-WA0140.jpg",
      "/IMG-20261017-WA0141.jpg",
      "/IMG-20261017-WA0143.jpg",
      "/IMG-20261017-WA0150.jpg",
      "/IMG-20261017-WA0151.jpg",
      "/IMG-20261015-WA0164.jpg",
      "/IMG-20261015-WA0170(1).jpg"
    ],
    video: "/VID-20261017-WA0136.mp4"
  },
  {
    slug: "segunda-lancha",
    title: "SEGUNDA LANCHA",
    name: "Segunda lancha",
    subtitle: "Informações a completar",
    description: "Modelo, capacidade e informações comerciais a completar.",
    price: "Valor a completar",
    tags: ["Modelo a completar", "Capacidade a completar"],
    features: ["Informações a completar"],
    photos: [
      "/WhatsApp Image 2026-10-17 at 21.46.29.jpeg",
      "/WhatsApp Image 2026-10-17 at 21.46.22.jpeg",
      "/WhatsApp Image 2026-10-17 at 21.46.23.jpeg",
      "/WhatsApp Image 2026-10-17 at 21.46.23 (1).jpeg",
      "/WhatsApp Image 2026-10-17 at 21.46.23 (2).jpeg",
      "/WhatsApp Image 2026-10-17 at 21.46.24.jpeg",
      "/WhatsApp Image 2026-10-17 at 21.46.26.jpeg",
      "/WhatsApp Image 2026-10-17 at 21.46.27.jpeg",
      "/WhatsApp Image 2026-10-17 at 21.46.30 (1).jpeg",
      "/WhatsApp Image 2026-10-17 at 21.46.31.jpeg",
      "/WhatsApp Image 2026-10-17 at 21.46.32.jpeg"
    ],
    video: "/WhatsApp Video 2026-10-17 at 21.46.40.mp4"
  }
];

export function getBoat(slug: string) {
  return boats.find((boat) => boat.slug === slug);
}
