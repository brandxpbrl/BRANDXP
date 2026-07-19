import type { Metadata } from "next";
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
    <main className="min-h-screen bg-[#050505] text-[#F7F7F7] overflow-x-hidden selection:bg-white/10 selection:text-white">
      <Hero />
      <Why />
      <CaseStudy />
      <Services />
      <Gallery />
      
      {/* SECTION 1: Manifesto */}
      <Manifesto />
      
      {/* SECTION 2: Our Method */}
      <Method />
      
      {/* SECTION 3: Coming Soon Case Study */}
      <ComingSoon />
      
      {/* SECTION 4: Why Us */}
      <WhyUs />
      
      {/* SECTION 5: Final CTA */}
      <CTA />
      
      {/* Footer minimalista específico para Fragma Brand Experience */}
      <footer className="border-t border-white/5 bg-black/60 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500">
          <div className="flex flex-col gap-1">
            <span className="font-bold tracking-widest text-white uppercase text-xs">FRAGMA BRAND EXPERIENCE</span>
            <p className="text-xs">Estúdio de Direção Criativa & Branding Premium</p>
          </div>
          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <a href="/" className="text-white hover:underline font-semibold">RioVibesTransfer</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

