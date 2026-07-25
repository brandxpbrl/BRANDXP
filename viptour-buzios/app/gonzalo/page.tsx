"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MessageCircle, MapPin, Hammer, Sparkles } from "lucide-react";

export default function GonzaloWoodcraftPage() {
  const images = [
    {
      src: "/images/gonzalo-board.jpg",
      title: "Projetos Sob Medida",
      desc: "Decks, barras, mesas e estruturas de alta gama para espaços comerciais e residenciais.",
    },
    {
      src: "/images/gonzalo-mockup.jpg",
      title: "Desenho & Experiência",
      desc: "Mobiliario exclusivo fabricado com madeira de alta qualidade e terminação impecável.",
    },
    {
      src: "/images/gonzalo-card.jpg",
      title: "Soluções Personalizadas",
      desc: "Planificação e execução de projetos premium em Búzios y toda la región.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#030306] text-white pt-24 pb-16 relative overflow-hidden">
      {/* Background Cyber Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-radial from-[#f97316]/10 via-transparent to-transparent blur-[120px] opacity-70" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-radial from-amber-500/5 to-transparent blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Volver al inicio</span>
        </Link>

        {/* Hero Section */}
        <header className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 mb-4">
            <Hammer className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-wider uppercase">Custom Craftsmanship</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-amber-200 via-orange-400 to-amber-600 bg-clip-text text-transparent">
            GONZALO
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 font-medium max-w-2xl mb-2">
            Marcenaria & Projetos Sob Medida
          </p>
          <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-sm mt-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-amber-500" />
              Armação dos Búzios • RJ
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
            <span className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Atendimento Premium na Região
            </span>
          </div>
        </header>

        {/* Gallery / Interactive Board */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className="group relative rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-800/80 hover:border-amber-500/50 transition-all duration-500"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-lg font-semibold text-amber-300 mb-1">{img.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{img.desc}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Features Info */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-8 md:p-12 mb-16 backdrop-blur-xl">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Madeira que inspira, projetos que perduram.</h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              Criamos, fabricamos e instalamos soluções personalizadas em madeira com precisão, design e qualidade excepcional. Cada projeto é único, adaptado às necessidades específicas de residências, restaurantes, pousadas e espaços comerciais.
            </p>
            <ul className="space-y-4">
              {[
                "Decks e painéis de madeira de alta qualidade",
                "Estruturas e balcões para gastronomia e hotelaria",
                "Móveis exclusivos sob medida com fabricação própria",
                "Acabamento impecável e resistente",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-zinc-300 text-sm">
                  <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold text-xs">✓</div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6 items-center md:items-start p-8 rounded-2xl bg-amber-500/[0.02] border border-amber-500/10">
            <h3 className="text-xl font-bold text-amber-300">Quer iniciar um projeto?</h3>
            <p className="text-zinc-400 text-sm text-center md:text-left leading-relaxed">
              Fale diretamente com o Gonzalo para desenhar e cotar seu móvel ou estrutura sob medida. Oferecemos acompanhamento completo desde a ideia inicial até a instalação final.
            </p>
            <a
              href="https://wa.me/5522997491823?text=Olá%20Gonzalo,%20vi%20seus%20trabalhos%20no%20Master%20Solutions%20e%20gostaria%20de%20fazer%20um%20orçamento%20sob%20medida."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold tracking-wider transition-all duration-300 shadow-[0_4px_20px_rgba(249,115,22,0.3)] hover:scale-[1.02]"
            >
              <MessageCircle className="w-5 h-5" />
              <span>FALE NO WHATSAPP</span>
            </a>
            <div className="text-zinc-500 text-xs text-center w-full mt-2">
              WhatsApp: +55 22 99749-1823
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
