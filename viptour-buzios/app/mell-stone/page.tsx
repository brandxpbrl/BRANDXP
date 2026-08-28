import type { Metadata } from "next";
import { MellHome } from "@/components/mell-stone";
import { mellStoneBrand } from "@/config/mell-stone.content";

export const metadata: Metadata = {
  title: "Mell & Stone | Handcrafted Natural Jewelry",
  description:
    "Joias artesanais de luxo natural feitas com pérolas, pedras, formas orgânicas e curadoria editorial.",
  alternates: {
    canonical: mellStoneBrand.canonical,
  },
  openGraph: {
    title: "Mell & Stone | Where Nature Becomes Art",
    description:
      "Uma experiência editorial de joias artesanais dentro do universo Rio Vibes Transfer.",
    url: mellStoneBrand.canonical,
    siteName: "Mell & Stone",
    type: "website",
    images: [
      {
        url: "/images/mell-stone/mell-stone-logo-ivory.png",
        width: 1536,
        height: 1024,
        alt: "Mell & Stone handwritten natural jewelry logo",
      },
    ],
  },
};

export default function MellStonePage() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: mellStoneBrand.name,
    url: mellStoneBrand.canonical,
    slogan: mellStoneBrand.tagline,
    sameAs: [mellStoneBrand.instagram],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <MellHome />
    </>
  );
}
