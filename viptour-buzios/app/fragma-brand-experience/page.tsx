import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/fragma/Hero";
import Why from "@/components/fragma/Why";
import CaseStudy from "@/components/fragma/CaseStudy";
import Services from "@/components/fragma/Services";
import Gallery from "@/components/fragma/Gallery";
import Manifesto from "@/components/fragma/Manifesto";
import Method from "@/components/fragma/Method";
import ComingSoon from "@/components/fragma/ComingSoon";
import WhyUs from "@/components/fragma/WhyUs";
import CTA from "@/components/fragma/CTA";
import { fragmaBodyFont, fragmaDisplayFont } from "./fonts";

export const metadata: Metadata = {
  title: "Fragma Brand Experience Studio | Posicionamento Premium",
  description:
    "Estúdio de Brand Experience especializado em transformar negócios de hospitalidade através de branding, direção criativa e produção visual premium.",
  alternates: { canonical: "/fragma-brand-experience" },
  openGraph: {
    title: "Fragma Brand Experience Studio | Posicionamento Premium",
    description:
      "Transformamos hotéis, pousadas, restaurantes e marcas premium em experiências memoráveis. Direção de arte e branding sob medida.",
    url: "https://www.riovibestransfer.com/fragma-brand-experience",
  },
};

export default function FragmaBrandExperiencePage() {
  return (
    <main className={`fragma-scope fragma-phase-two ${fragmaDisplayFont.variable} ${fragmaBodyFont.variable} min-h-screen overflow-x-hidden selection:bg-black/10 selection:text-[#1F1F1F]`}>
      <Hero />
      <Why />
      <CaseStudy />
      <ComingSoon />
      <Services />
      <Method />
      <Gallery />
      <WhyUs />
      <Manifesto />
      <CTA />
      
      {/* Footer minimalista específico para Fragma Brand Experience */}
      <footer className="border-t border-black/10 bg-[#EEE9E1] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#8E7867]">
          <div className="flex flex-col gap-1">
            <span className="font-bold tracking-widest text-[#1F1F1F] uppercase text-xs">FRAGMA BRAND EXPERIENCE</span>
            <p className="text-xs">Estúdio de Direção Criativa & Branding Premium</p>
          </div>
          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <Link href="/" className="text-[#1F1F1F] hover:underline font-semibold">RioVibesTransfer</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
