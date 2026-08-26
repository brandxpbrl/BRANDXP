import type { Metadata } from "next";
import ZaptLanding from "@/components/zapt/ZaptLanding";
import { zaptFaqItems, zaptMetaDescription } from "@/config/zapt-seo";

const canonical = "https://www.riovibestransfer.com/zaptdeliverybz";

export const metadata: Metadata = {
  title: "Delivery Búzios | ZAPT Delivery de Madrugada",
  description: zaptMetaDescription,
  keywords: [
    "delivery Búzios",
    "delivery em Búzios",
    "delivery madrugada Búzios",
    "delivery de madrugada",
    "lanche madrugada Búzios",
    "bebidas delivery Búzios",
    "cerveja delivery Búzios",
  ],
  alternates: { canonical },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: canonical,
    siteName: "ZAPT Delivery Búzios",
    title: "Delivery Búzios | ZAPT Delivery de Madrugada",
    description:
      "Quando a maioria fecha, a ZAPT começa. Peça bebidas, lanches e combos em Búzios, das 23h às 04h.",
  images: [{ url: "/zapt/hero.png", width: 1280, height: 1280, alt: "ZAPT Delivery Búzios durante a madrugada" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Delivery Búzios | ZAPT Delivery de Madrugada",
    description: "Delivery de madrugada em Búzios, das 23h às 04h.",
    images: ["/zapt/hero.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FoodEstablishment",
      "@id": `${canonical}#business`,
      name: "ZAPT Delivery Búzios",
      description: metadata.description,
      url: canonical,
      telephone: "+55 22 99243-0867",
      sameAs: ["https://www.instagram.com/zaptbuzios.delivery/"],
      areaServed: {
        "@type": "City",
        name: "Armação dos Búzios",
        containedInPlace: { "@type": "State", name: "Rio de Janeiro", containedInPlace: { "@type": "Country", name: "Brasil" } },
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "23:00",
          closes: "04:00",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${canonical}#faq`,
      mainEntity: zaptFaqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

export default function ZaptDeliveryBuziosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ZaptLanding />
    </>
  );
}
