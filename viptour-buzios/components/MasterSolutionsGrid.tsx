'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const worlds = [
  { title: 'CREATE', subtitle: 'Brand Experience · Fragma · Content', accent: 'from-fuchsia-500/20', href: '/brand-experience' },
  { title: 'TECHNOLOGY', subtitle: 'QUBIT · MPE · AI Solutions', accent: 'from-cyan-500/20', href: '/qubit' },
  { title: 'TRAVEL', subtitle: 'VIPTOUR · Transfers · Hospedajes', accent: 'from-teal-400/20', href: '/projects/viptour' },
  { title: 'BUILD', subtitle: 'Woodcraft · Electrical · Construction', accent: 'from-amber-500/20', href: '/gonzalo' },
  { title: 'LIFESTYLE', subtitle: 'ZAPT · Gastronomy · Experiences', accent: 'from-lime-400/20', href: '/zaptdeliverybz' },
];

const featured = [
  { title: 'FRAGMA', kicker: 'FILMMAKING & VISUAL STORYTELLING', href: '/fragma-brand-experience', glow: 'from-fuchsia-500/20 via-transparent to-transparent' },
  { title: 'VIPTOUR', kicker: 'BÚZIOS EXPERIENCES', href: '/projects/viptour', glow: 'from-cyan-400/20 via-transparent to-transparent' },
  { title: 'QUBIT', kicker: 'TECHNOLOGY & AI SOLUTIONS', href: '/qubit', glow: 'from-violet-500/20 via-transparent to-transparent' },
];

const services = [
  ['BRAND EXPERIENCE','Branding & Identity','/brand-experience','text-fuchsia-300 border-fuchsia-400/20'],
  ['MPE','Evolutionary Intelligence','/mpe','text-violet-300 border-violet-400/20'],
  ['QUBIT','Technology & AI','/qubit','text-cyan-300 border-cyan-400/20'],
  ['FRAGMA','Photography & Content','/fragma-brand-experience','text-pink-300 border-pink-400/20'],
  ['VIPTOUR','Búzios Experiences','/projects/viptour','text-teal-300 border-teal-400/20'],
  ['ZAPT','Night Delivery','/zaptdeliverybz','text-lime-300 border-lime-400/20'],
  ['WOODCRAFT','Custom Wood Solutions','/gonzalo','text-amber-300 border-amber-400/20'],
  ['ELECTRICAL','Electrical Solutions','/services','text-yellow-300 border-yellow-400/20'],
];

export default function MasterSolutionsGrid() {
  return (
    <section className="relative w-full bg-[#03050a] text-white">
      <div className="relative min-h-[88vh] overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-portal-fixed bg-cover bg-center opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,5,10,0.96)_0%,rgba(3,5,10,0.80)_35%,rgba(3,5,10,0.30)_70%,rgba(3,5,10,0.78)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,5,10,0.18)_0%,rgba(3,5,10,0.08)_55%,#03050a_100%)]" />
        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-[1440px] items-center px-6 pb-20 pt-32 md:px-10 lg:px-14">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="max-w-2xl">
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.4em] text-cyan-300">The Connected Ecosystem</p>
            <h1 className="text-6xl font-light tracking-[0.2em] sm:text-7xl md:text-8xl">ORBIS</h1>
            <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.42em] text-white/70">Everything, connected.</p>
            <p className="mt-8 max-w-xl text-base leading-7 text-slate-300/80 md:text-lg">Un ecosistema de marcas, servicios y experiencias independientes conectadas en un mismo lugar.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#ecosystem" className="group inline-flex items-center gap-3 rounded-xl border border-cyan-300/35 bg-black/30 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition hover:border-cyan-200/70 hover:bg-cyan-300/[0.08]">Explore ORBIS <ArrowRight size={15} className="transition group-hover:translate-x-1" /></a>
              <a href="#everything" className="inline-flex items-center rounded-xl border border-white/15 bg-black/25 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300 transition hover:border-white/30 hover:text-white">View all worlds</a>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative overflow-hidden bg-[#03050a]">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/[0.035] blur-[140px]" />
        <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-24 md:px-10 lg:px-14">
          <div id="ecosystem" className="scroll-mt-28">
            <div className="mb-12 text-center"><p className="text-[9px] uppercase tracking-[0.4em] text-cyan-300/70">Discover</p><h2 className="mt-4 text-2xl font-light uppercase tracking-[0.3em] md:text-3xl">The Ecosystem</h2></div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {worlds.map((world, i) => <motion.div key={world.title} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.05}}><Link href={world.href} className="group relative flex min-h-56 flex-col justify-end overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080b12] p-6 transition hover:-translate-y-1 hover:border-white/20"><div className={`absolute inset-0 bg-gradient-to-b ${world.accent} via-transparent to-transparent opacity-70`} /><div className="relative"><div className="mb-10 text-xl text-white/25">◎</div><h3 className="text-base tracking-[0.18em]">{world.title}</h3><p className="mt-3 text-[10px] leading-5 text-slate-500">{world.subtitle}</p><ArrowRight size={15} className="mt-5 text-cyan-300 transition group-hover:translate-x-1" /></div></Link></motion.div>)}
            </div>
          </div>

          <div className="pt-28">
            <div className="mb-12 text-center"><h2 className="text-2xl font-light uppercase tracking-[0.3em] md:text-3xl">Featured Worlds</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500">Identidades independientes. Experiencias digitales construidas dentro del ecosistema ORBIS.</p></div>
            <div className="grid gap-5 lg:grid-cols-3">
              {featured.map((item,i) => <motion.div key={item.title} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.07}}><Link href={item.href} className="group relative flex min-h-[360px] flex-col justify-end overflow-hidden rounded-3xl border border-white/[0.08] bg-[#07090e] p-8 transition hover:-translate-y-1 hover:border-cyan-300/25"><div className={`absolute inset-0 bg-gradient-to-br ${item.glow}`} /><div className="absolute right-[-8%] top-[-6%] h-64 w-64 rounded-full border border-white/[0.05]"/><div className="absolute right-[8%] top-[12%] h-36 w-36 rounded-full border border-cyan-300/[0.07]"/><div className="relative"><p className="mb-3 text-[9px] uppercase tracking-[0.24em] text-slate-500">Featured World</p><h3 className="text-3xl font-semibold tracking-[0.08em]">{item.title}</h3><p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-slate-500">{item.kicker}</p><span className="mt-8 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">Explore world <ArrowUpRight size={14}/></span></div></Link></motion.div>)}
            </div>
          </div>

          <div id="everything" className="scroll-mt-28 pt-28">
            <div className="mb-12 text-center"><h2 className="text-2xl font-light uppercase tracking-[0.3em] md:text-3xl">Explore Everything</h2></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {services.map(([title,meta,href,accent]) => <Link key={title} href={href} className={`group rounded-2xl border bg-[#07090e] p-6 transition hover:-translate-y-1 hover:bg-[#0a0d14] ${accent}`}><div className="mb-12 text-xl opacity-70">◎</div><h3 className="text-base font-medium tracking-[0.08em] text-white">{title}</h3><p className="mt-2 text-[9px] uppercase tracking-[0.18em] text-slate-600">{meta}</p><ArrowUpRight size={14} className="mt-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>)}
            </div>
          </div>

          <div className="mt-28 border-t border-white/[0.06] py-20 text-center"><div className="mx-auto text-3xl text-cyan-200/80">◎</div><p className="mt-7 text-3xl font-light tracking-[0.2em] md:text-5xl">ORBIS</p><p className="mt-4 text-[9px] uppercase tracking-[0.4em] text-slate-600">Everything, connected.</p></div>
        </div>
      </div>
    </section>
  );
}
