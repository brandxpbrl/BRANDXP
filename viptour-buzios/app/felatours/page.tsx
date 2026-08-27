import type { Metadata } from "next";
import FelaLanding from "./FelaLanding";

const canonical = "https://www.riovibestransfer.com/felatours";

export const metadata: Metadata = {
  title: "FELA TOURS | Tours y Traslados en Río de Janeiro y Búzios",
  description:
    "Traslados, tours y experiencias en Río de Janeiro, Búzios, Arraial do Cabo, Angra e Ilha Grande. Consultá disponibilidad por WhatsApp.",
  keywords: [
    "FELA TOURS",
    "tours Búzios",
    "traslados Río de Janeiro",
    "excursiones Búzios",
    "Arraial do Cabo",
    "Ilha Grande",
  ],
  alternates: { canonical },
  robots: { index: true, follow: true },
  icons: {
    icon: "/fela/icon.webp",
    shortcut: "/fela/icon.webp",
    apple: "/fela/icon.webp",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: canonical,
    siteName: "FELA TOURS",
    title: "FELA TOURS | Viví Río. Sentí Búzios.",
    description:
      "Traslados y experiencias con acompañamiento real en Río de Janeiro y Búzios.",
    images: [
      {
        url: "/images/orbis/ecosystem/travel.png",
        width: 1200,
        height: 630,
        alt: "FELA TOURS — Río de Janeiro y Búzios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FELA TOURS | Río de Janeiro y Búzios",
    description:
      "Traslados, tours y experiencias. Consultá disponibilidad por WhatsApp.",
    images: ["/images/orbis/ecosystem/travel.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "FELA TOURS",
  url: canonical,
  telephone: "+5545999686381",
  areaServed: [
    "Rio de Janeiro",
    "Armação dos Búzios",
    "Arraial do Cabo",
    "Angra dos Reis",
    "Ilha Grande",
  ],
  availableLanguage: ["Spanish", "Portuguese"],
};

export default function FelaToursPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FelaLanding />
    </>
  );
}
