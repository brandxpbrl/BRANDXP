import type { Metadata } from "next";
import InternationalLanding from "./InternationalLanding";

const canonical = "https://www.riovibestransfer.com/felatours/international";

export const metadata: Metadata = {
  title: "FELA TOURS International | Private Brazil Tours & Airport Transfers",
  description:
    "Personalized tours, private airport transfers and English-speaking local assistance in Rio de Janeiro, Búzios, Arraial do Cabo, Angra dos Reis and Ilha Grande.",
  alternates: { canonical },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: canonical,
    siteName: "FELA TOURS International",
    title: "FELA TOURS International | Custom Brazil Experiences",
    description:
      "Private airport transfers, curated tours and personalized local assistance in Brazil.",
    images: [
      {
        url: "/fela/transfers/passengers.webp",
        width: 1200,
        height: 800,
        alt: "FELA TOURS travelers arriving in Brazil with luggage",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "FELA TOURS International",
  url: canonical,
  telephone: "+5545999686381",
  email: "admin@riovibestransfer.com",
  areaServed: [
    "Rio de Janeiro",
    "Armação dos Búzios",
    "Arraial do Cabo",
    "Angra dos Reis",
    "Ilha Grande",
  ],
  availableLanguage: ["English", "Spanish", "Portuguese"],
};

export default function FelaToursInternationalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InternationalLanding />
    </>
  );
}
