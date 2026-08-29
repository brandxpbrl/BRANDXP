import type { Metadata } from "next";
import InternationalExperiencesCatalog from "./InternationalExperiencesCatalog";

const canonical = "https://www.riovibestransfer.com/felatours/international/experiences";

export const metadata: Metadata = {
  title: "Brazil Tours & Experiences in English | FELA TOURS International",
  description: "Explore 20 tours, beach experiences, adventures and transfers in Rio de Janeiro, Búzios, Arraial do Cabo, Angra dos Reis and Ilha Grande.",
  alternates: { canonical },
  openGraph: {
    title: "20 Brazil Experiences | FELA TOURS International",
    description: "Choose your Brazil experiences and request a personalized English-language proposal.",
    url: canonical,
    type: "website",
  },
};

export default function InternationalExperiencesPage() {
  return <InternationalExperiencesCatalog />;
}
