import type { Metadata } from "next";
import Hero from "@/components/fragma/Hero";
import Why from "@/components/fragma/Why";
import Method from "@/components/fragma/Method";
import CaseStudy from "@/components/fragma/CaseStudy";
import Gallery from "@/components/fragma/Gallery";
import Services from "@/components/fragma/Services";
import Testimonials from "@/components/fragma/Testimonials";
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
    <main className="min-h-screen bg-[#07090e] text-white overflow-x-hidden selection:bg-white/10 selection:text-white">
      <Hero />
      <Why />
      <CaseStudy />
      <Method />
      <Services />
      <Gallery />
      
      {/* SECTION 7: Behind the Scenes */}
      <section className="py-24 md:py-32 px-6 border-t border-white/5 bg-[#0b0e14]/50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold tracking-widest text-[#0ea5e9] uppercase bg-[#0ea5e9]/10 px-3 py-1 rounded-full">
                Behind The Scenes
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
                Como criamos percepção de valor.
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Cada produção visual segue nossa metodologia exclusiva orientada à experiência do usuário final. Unimos técnica cinematográfica, luz natural e branding estratégico para capturar a alma do seu espaço.
              </p>
            </div>
            
            <div className="lg:col-span-7">
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black/40 group">
                {/* Horizontal Video Placeholder / Visual Asset */}
                <div className="absolute inset-0 flex items-center justify-center bg-radial from-[#0ea5e9]/10 to-transparent">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-widest block">
                      Assista ao Concept Video (16:9 Production Loop)
                    </span>
                  </div>
                </div>
                {/* Future Video Integration Point */}
                {/* <video src="/videos/behind-the-scenes.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" /> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />
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
