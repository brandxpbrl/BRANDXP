"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Cpu, Sparkles, Compass, Layers, Hammer, Zap } from "lucide-react";

const services = [
  {
    icon: Sparkles,
    category: "CREATIVE & IDENTITY",
    title: "Brand Experience",
    description: "Sleek, high-converting digital architectures integrating strategy, premium branding, UX design, and next-gen development.",
    link: "/brandexperience",
    accentColor: "#FF3D8E",
  },
  {
    icon: Compass,
    category: "SACRED GEOMETRY",
    title: "MPE Lab",
    description: "Maximizer of Evolutionary Possibilities. Crafting resonant geometry systems, visual portals, and mathematical beauty for brands.",
    link: "/mpe",
    accentColor: "#D6A24A",
    secondaryLink: "/universos-visuales",
    secondaryLinkLabel: "Visual Universes Gallery",
  },
  {
    icon: Cpu,
    category: "TECH & QUANTUM SENSORS",
    title: "QUBIT Engine",
    description: "Advanced technological backbone, architectural blueprints, data structures, and integrations driving modern digital ecosystems.",
    link: "/qubit",
    accentColor: "#29B8FF",
  },
  {
    icon: Layers,
    category: "PREMIUM STUDIO",
    title: "Fragma Studio",
    description: "Art direction and tailor-made premium branding. Transforming luxury hospitality, hotels, and businesses into unforgettable experiences.",
    link: "/fragma-brand-experience",
    accentColor: "#a855f7",
  },
  {
    icon: ShieldCheck,
    category: "LIVE DEPLOYMENT",
    title: "VIPTOUR Búzios",
    description: "Premium buggy rental and tour agency portal operating live, built directly on top of the Master Solutions ecosystem core.",
    link: "/projects/viptour",
    accentColor: "#22c55e",
  },
  {
    icon: Hammer,
    category: "CUSTOM CRAFTSMANSHIP",
    title: "Bespoke Woodcraft",
    description: "Premium tailor-made carpentry, custom furniture engineering, and high-end wooden architectures to transform luxury spaces.",
    link: "/gonzalo",
    accentColor: "#f97316",
  },
  {
    icon: Zap,
    category: "INFRASTRUCTURE & POWER",
    title: "Electrical Solutions",
    description: "High-safety electrical installations, smart home automations, energy blueprints, and complete technical grid deployments.",
    link: "/services",
    accentColor: "#facc15",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030306] text-white flex flex-col justify-between pt-20 relative overflow-hidden">
      
      {/* Background Cyber Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-radial from-sky-500/10 via-purple-500/5 to-transparent blur-[120px] opacity-80" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-radial from-[#D6A24A]/5 to-transparent blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.015]" />
      </div>

      <div className="relative z-10 container-padding py-16 sm:py-24 mx-auto w-full max-w-[var(--container-default)] flex-1 flex flex-col justify-center">
        
        {/* Top Eyebrow */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold tracking-[0.4em] text-sky-400 uppercase bg-sky-950/40 px-5 py-2 rounded-full border border-sky-900/30 backdrop-blur-md">
            THE DIGITAL SUPER-PLATFORM
          </span>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl sm:text-8xl font-black tracking-tight leading-none bg-gradient-to-b from-white via-slate-100 to-slate-500 bg-clip-text text-transparent">
            MASTER SOLUTIONS
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover all our services in one place. An integrated ecosystem of visual art, brand strategy, next-gen coding, and premium experiences.
          </p>
        </div>

        {/* Core Services Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative rounded-3xl border border-white/5 bg-slate-950/30 p-8 hover:border-white/15 transition-all duration-300 flex flex-col justify-between overflow-hidden backdrop-blur-md"
              >
                {/* Radial Hover glow */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundImage: `radial-gradient(circle at 10% 10%, ${service.accentColor}0e, transparent 50%)` }}
                />

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-widest font-mono" style={{ color: service.accentColor }}>
                      {service.category}
                    </span>
                    <Icon className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors duration-300" />
                  </div>

                  <h3 className="text-2xl font-bold mt-6 text-white group-hover:translate-x-1 transition-transform duration-300">
                    {service.title}
                  </h3>

                  <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-3">
                  <Link
                    href={service.link}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:underline group-hover:text-sky-400 transition-colors"
                  >
                    Explore Service
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>

                  {service.secondaryLink && (
                    <Link
                      href={service.secondaryLink}
                      className="text-[11px] font-medium text-gray-500 hover:text-white transition-colors"
                    >
                      {service.secondaryLinkLabel}
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Cybernetic Footer */}
      <footer className="border-t border-white/5 bg-black/40 px-6 py-8 text-center text-xs text-gray-500 z-10 backdrop-blur-sm">
        <div className="max-w-[var(--container-default)] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 MASTER SOLUTIONS. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/universos-visuales" className="hover:text-white transition-colors">Visual Universes</Link>
            <Link href="/brandexperience" className="hover:text-white transition-colors">Brand Experience</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact Hub</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
