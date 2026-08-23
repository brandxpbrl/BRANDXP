'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';

const worlds = [
  { title: 'CREATE', subtitle: 'Brand Experience · Fragma · Content', accent: 'from-fuchsia-500/25 via-violet-500/10 to-transparent', href: '/brand-experience' },
  { title: 'TECHNOLOGY', subtitle: 'QUBIT · MPE · AI Solutions', accent: 'from-cyan-500/25 via-blue-500/10 to-transparent', href: '/qubit' },
  { title: 'TRAVEL', subtitle: 'VIPTOUR · Transfers · Hospedajes', accent: 'from-teal-400/25 via-cyan-500/10 to-transparent', href: '/projects/viptour' },
  { title: 'BUILD', subtitle: 'Woodcraft · Electrical · Construction', accent: 'from-amber-500/25 via-orange-500/10 to-transparent', href: '/gonzalo' },
  { title: 'LIFESTYLE', subtitle: 'ZAPT · Gastronomy · Experiences', accent: 'from-lime-400/25 via-emerald-500/10 to-transparent', href: '/zaptdeliverybz' },
];

const featured = [
  {
    title: 'FRAGMA',
    kicker: 'FILMMAKING & VISUAL STORYTELLING',
    href: '/fragma-brand-experience',
    className: 'from-zinc-950 via-zinc-900 to-black',
  },
  {
    title: 'VIPTOUR',
    kicker: 'BÚZIOS EXPERIENCES',
    href: '/projects/viptour',
    className: 'from-cyan-950 via-slate-900 to-black',
  },
  {
    title: 'QUBIT',
    kicker: 'TECHNOLOGY & AI SOLUTIONS',
    href: '/qubit',
    className: 'from-indigo-950 via-slate-950 to-black',
  },
];

const services = [
  { title: 'BRAND EXPERIENCE', meta: 'Branding & Identity', href: '/brand-experience', accent: 'text-fuchsia-300 border-fuchsia-400/20' },
  { title: 'MPE', meta: 'Evolutionary Intelligence', href: '/mpe', accent: 'text-violet-300 border-violet-400/20' },
  { title: 'QUBIT', meta: 'Technology & AI', href: '/qubit', accent: 'text-cyan-300 border-cyan-400/20' },
  { title: 'FRAGMA', meta: 'Photography & Content', href: '/fragma-brand-experience', accent: 'text-pink-300 border-pink-400/20' },
  { title: 'VIPTOUR', meta: 'Búzios Experiences', href: '/projects/viptour', accent: 'text-teal-300 border-teal-400/20' },
  { title: 'ZAPT', meta: 'Night Delivery', href: '/zaptdeliverybz', accent: 'text-lime-300 border-lime-400/20' },
  { title: 'WOODCRAFT', meta: 'Custom Wood Solutions', href: '/gonzalo', accent: 'text-amber-300 border-amber-400/20' },
  { title: 'ELECTRICAL', meta: 'Electrical Solutions', href: '/services', accent: 'text-yellow-300 border-yellow-400/20' },
];

function OrbVisual() {
  return (
    <div className="relative aspect-square w-full max-w-[520px]">
      <div className="absolute inset-[6%] rounded-full border border-fuchsia-400/20 shadow-[0_0_80px_rgba(217,70,239,0.12)]" />
      <div className="absolute inset-[14%] rounded-full border border-cyan-300/40 shadow-[0_0_80px_rgba(34,211,238,0.22)]" />
      <div className="absolute inset-[22%] rounded-full border border-cyan-200/70" />
      <div className="absolute inset-[31%] rounded-full border border-fuchsia-300/35" />
      <div className="absolute inset-[41%] rounded-full border border-amber-100/60 shadow-[0_0_45px_rgba(254,240,138,0.3)]" />
      <div className="absolute inset-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-50 shadow-[0_0_50px_18px_rgba(254,240,138,0.45)]" />
      <div className="absolute inset-[10%] rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(34,211,238,0.22),transparent,rgba(217,70,239,0.20),transparent)] blur-[1px]" />
      <div className="absolute inset-[18%] rounded-full border border-dashed border-cyan-300/30 animate-[spin_24s_linear_infinite]" />
      <div className="absolute inset-[28%] rounded-full border border-dashed border-fuchsia-300/25 animate-[spin_18s_linear_infinite_reverse]" />
      {[...Array(18)].map((_, i) => {
        const angle = (i / 18) * Math.PI * 2;
        const x = 50 + Math.cos(angle) * 41;
        const y = 50 + Math.sin(angle) * 41;
        return <span key={i} className="absolute h-1.5 w-1.5 rounded-full bg-fuchsia-200 shadow-[0_0_12px_rgba(244,114,182,0.8)]" style={{ left: `${x}%`, top: `${y}%` }} />;
      })}
      <div className="absolute inset-x-[8%] bottom-[5%] h-8 rounded-[50%] bg-fuchsia-500/20 blur-xl" />
    </div>
  );
}

export default function MasterSolutionsGrid() {
  return (
    <section className="relative w-full overflow-hidden bg-transparent text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_12%,rgba(14,165,233,0.12),transparent_28%),radial-gradient(circle_at_62%_18%,rgba(217,70,239,0.08),transparent_22%)]" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 pb-20 pt-28 md:px-10 lg:px-14 lg:pt-36">
        <div className="grid min-h-[72vh] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.38em] text-cyan-300/80">The Connected Ecosystem</p>
            <h1 className="text-6xl font-medium tracking-[0.18em] text-white sm:text-7xl md:text-8xl">ORBIS</h1>
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.38em] text-white/65 sm:text-sm">Everything, connected.</p>
            <p className="mt-8 max-w-lg text-base leading-7 text-slate-400 md:text-lg">Un ecosistema de marcas, servicios y experiencias independientes conectadas en un mismo lugar.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#ecosystem" className="group inline-flex items-center gap-3 rounded-xl border border-cyan-400/40 bg-cyan-400/[0.06] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:border-fuchsia-400/60 hover:bg-fuchsia-400/[0.08]">
                Explore ORBIS <ArrowRight size={15} className="transition group-hover:translate-x-1" />
              </a>
              <a href="#everything" className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300 transition hover:border-white/25 hover:text-white">
                View all worlds
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.1 }} className="flex justify-center lg:justify-end">
            <OrbVisual />
          </motion.div>
        </div>

        <div id="ecosystem" className="scroll-mt-28 pt-8 md:pt-14">
          <div className="mb-9 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-300">Discover</p>
            <h2 className="mt-3 text-2xl font-light uppercase tracking-[0.28em] text-white md:text-3xl">The Ecosystem</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {worlds.map((world, index) => (
              <motion.div key={world.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.05 }}>
                <Link href={world.href} className="group relative flex min-h-64 flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-[#070911]/85 p-6 transition hover:-translate-y-1 hover:border-cyan-300/35">
                  <div className={`absolute inset-0 bg-gradient-to-b ${world.accent}`} />
                  <div className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/30 text-cyan-200"><Sparkles size={17} /></div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-medium tracking-[0.18em] text-white">{world.title}</h3>
                    <p className="mt-3 text-[11px] leading-5 text-slate-400">{world.subtitle}</p>
                    <ArrowRight size={16} className="mt-5 text-cyan-300 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="pt-24">
          <div className="mb-9 text-center">
            <h2 className="text-2xl font-light uppercase tracking-[0.28em] text-white md:text-3xl">Featured Worlds</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {featured.map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }}>
                <Link href={item.href} className={`group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${item.className} p-7 transition hover:-translate-y-1 hover:border-cyan-300/35`}>
                  <div className="absolute right-[-12%] top-[-10%] h-52 w-52 rounded-full border border-cyan-300/10 shadow-[0_0_80px_rgba(34,211,238,0.08)]" />
                  <div className="absolute right-[4%] top-[10%] h-32 w-32 rounded-full border border-fuchsia-300/10" />
                  <div className="relative z-10">
                    <h3 className="text-3xl font-semibold tracking-[0.08em] text-white">{item.title}</h3>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">{item.kicker}</p>
                    <span className="mt-7 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">Explore world <ArrowUpRight size={14} /></span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <div id="everything" className="scroll-mt-28 pt-24">
          <div className="mb-9 text-center">
            <h2 className="text-2xl font-light uppercase tracking-[0.28em] text-white md:text-3xl">Explore Everything</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Link key={service.title} href={service.href} className={`group rounded-2xl border bg-black/35 p-6 backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/[0.04] ${service.accent}`}>
                <div className="mb-10 flex h-10 w-10 items-center justify-center rounded-xl border border-current/20 bg-current/[0.03] text-current">◎</div>
                <h3 className="text-lg font-medium tracking-[0.08em] text-white">{service.title}</h3>
                <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">{service.meta}</p>
                <ArrowUpRight size={15} className="mt-5 text-current transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-24 border-t border-white/[0.08] py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/[0.04] text-2xl text-cyan-200 shadow-[0_0_45px_rgba(34,211,238,0.10)]">◎</div>
          <p className="mt-6 text-3xl font-medium tracking-[0.16em] text-white md:text-5xl">ORBIS</p>
          <p className="mt-3 text-[10px] uppercase tracking-[0.34em] text-slate-500">Everything, connected.</p>
        </div>
      </div>
    </section>
  );
}
