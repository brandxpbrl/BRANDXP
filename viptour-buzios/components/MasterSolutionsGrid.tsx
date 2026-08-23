'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const worlds = [
  { title: 'CREATE', subtitle: 'Brand Experience · Fragma · Content', accent: 'from-fuchsia-500/35', href: '/brand-experience' },
  { title: 'TECHNOLOGY', subtitle: 'QUBIT · MPE · AI Solutions', accent: 'from-cyan-500/30', href: '/qubit' },
  { title: 'TRAVEL', subtitle: 'VIPTOUR · Transfers · Hospedajes', accent: 'from-teal-400/30', href: '/projects/viptour' },
  { title: 'BUILD', subtitle: 'Woodcraft · Electrical · Construction', accent: 'from-amber-500/30', href: '/gonzalo' },
  { title: 'LIFESTYLE', subtitle: 'ZAPT · Gastronomy · Experiences', accent: 'from-lime-400/30', href: '/zaptdeliverybz' },
];

const featured = [
  { title: 'FRAGMA', kicker: 'FILMMAKING & VISUAL STORYTELLING', href: '/fragma-brand-experience', glow: 'from-fuchsia-500/35 via-purple-500/10 to-transparent' },
  { title: 'VIPTOUR', kicker: 'BÚZIOS EXPERIENCES', href: '/projects/viptour', glow: 'from-cyan-400/35 via-sky-500/10 to-transparent' },
  { title: 'QUBIT', kicker: 'TECHNOLOGY & AI SOLUTIONS', href: '/qubit', glow: 'from-violet-500/35 via-indigo-500/10 to-transparent' },
];

const services = [
  ['BRAND EXPERIENCE','Branding & Identity','/brand-experience','text-fuchsia-300 border-fuchsia-400/30'],
  ['MPE','Evolutionary Intelligence','/mpe','text-violet-300 border-violet-400/30'],
  ['QUBIT','Technology & AI','/qubit','text-cyan-300 border-cyan-400/30'],
  ['FRAGMA','Photography & Content','/fragma-brand-experience','text-pink-300 border-pink-400/30'],
  ['VIPTOUR','Búzios Experiences','/projects/viptour','text-teal-300 border-teal-400/30'],
  ['ZAPT','Night Delivery','/zaptdeliverybz','text-lime-300 border-lime-400/30'],
  ['WOODCRAFT','Custom Wood Solutions','/gonzalo','text-amber-300 border-amber-400/30'],
  ['ELECTRICAL','Electrical Solutions','/services','text-yellow-300 border-yellow-400/30'],
];

export default function MasterSolutionsGrid() {
  return (
    <section className="relative w-full overflow-hidden bg-[#02040a] text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-portal-fixed bg-cover bg-center opacity-[0.32]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_62%_10%,rgba(0,217,255,0.11),transparent_34%),radial-gradient(circle_at_25%_28%,rgba(217,70,239,0.09),transparent_32%),linear-gradient(180deg,rgba(2,4,10,0.15),rgba(2,4,10,0.52))]" />

      <div className="relative z-10 min-h-[92vh] overflow-hidden border-b border-white/[0.07]">
        <div className="absolute inset-0 bg-portal-fixed bg-cover bg-center opacity-[0.98]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,4,10,0.78)_0%,rgba(2,4,10,0.55)_26%,rgba(2,4,10,0.08)_58%,rgba(2,4,10,0.12)_82%,rgba(2,4,10,0.42)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,4,10,0.06)_0%,rgba(2,4,10,0.04)_58%,rgba(2,4,10,0.68)_100%)]" />
        <div className="absolute right-[5%] top-[14%] h-[520px] w-[520px] rounded-full bg-cyan-400/[0.10] blur-[100px]" />
        <div className="absolute right-[18%] top-[26%] h-[240px] w-[240px] rounded-full bg-fuchsia-500/[0.10] blur-[80px]" />

        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-[1440px] items-center px-6 pb-16 pt-28 md:px-10 lg:px-14">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="max-w-[560px]">
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.42em] text-cyan-300">The Connected Ecosystem</p>
            <h1 className="text-6xl font-light tracking-[0.22em] sm:text-7xl md:text-8xl">ORBIS</h1>
            <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.42em] text-white/80">Everything, connected.</p>
            <p className="mt-7 max-w-md text-base leading-7 text-slate-200/90 md:text-lg">Un ecosistema de marcas, servicios y experiencias independientes conectadas en un mismo lugar.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#ecosystem" className="group inline-flex items-center gap-3 rounded-xl border border-cyan-300/70 bg-black/20 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-[0_0_28px_rgba(34,211,238,0.08)] transition hover:border-fuchsia-300/70 hover:bg-fuchsia-400/[0.08]">Explore ORBIS <ArrowRight size={15} className="transition group-hover:translate-x-1" /></a>
              <a href="#everything" className="inline-flex items-center rounded-xl border border-white/20 bg-black/20 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200 transition hover:border-white/35 hover:text-white">View all worlds</a>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,4,10,0.28)_0%,rgba(2,4,10,0.62)_22%,rgba(2,4,10,0.76)_100%)]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[720px] w-[1100px] -translate-x-1/2 rounded-full bg-cyan-500/[0.06] blur-[150px]" />
        <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-20 md:px-10 lg:px-14">
          <div id="ecosystem" className="scroll-mt-28">
            <div className="mb-10 text-center"><p className="text-[9px] uppercase tracking-[0.42em] text-cyan-300/90">Discover</p><h2 className="mt-4 text-2xl font-light uppercase tracking-[0.32em] md:text-3xl">The Ecosystem</h2></div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {worlds.map((world, i) => (
                <motion.div key={world.title} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.05}}>
                  <Link href={world.href} className="group relative flex min-h-60 flex-col justify-end overflow-hidden rounded-2xl border border-white/[0.10] bg-[#07101b]/80 p-6 backdrop-blur-md transition hover:-translate-y-1 hover:border-cyan-300/35">
                    <div className={`absolute inset-0 bg-gradient-to-b ${world.accent} via-transparent to-transparent opacity-90`} />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.03),transparent_45%)]" />
                    <div className="relative"><div className="mb-10 text-xl text-cyan-200/50">◎</div><h3 className="text-base tracking-[0.18em]">{world.title}</h3><p className="mt-3 text-[10px] leading-5 text-slate-400">{world.subtitle}</p><ArrowRight size={15} className="mt-5 text-cyan-300 transition group-hover:translate-x-1" /></div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="pt-24">
            <div className="mb-10 text-center"><h2 className="text-2xl font-light uppercase tracking-[0.32em] md:text-3xl">Featured Worlds</h2></div>
            <div className="grid gap-5 lg:grid-cols-3">
              {featured.map((item,i) => (
                <motion.div key={item.title} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.07}}>
                  <Link href={item.href} className="group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-2xl border border-white/[0.10] bg-[#060914]/86 p-7 backdrop-blur-md transition hover:-translate-y-1 hover:border-cyan-300/35">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.glow}`} />
                    <div className="absolute right-[-10%] top-[-15%] h-64 w-64 rounded-full border border-white/[0.06]"/>
                    <div className="absolute right-[9%] top-[10%] h-36 w-36 rounded-full border border-cyan-300/[0.08]"/>
                    <div className="relative"><h3 className="text-3xl font-semibold tracking-[0.08em]">{item.title}</h3><p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-slate-400">{item.kicker}</p><span className="mt-7 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">Explore world <ArrowUpRight size={14}/></span></div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <div id="everything" className="scroll-mt-28 pt-24">
            <div className="mb-10 text-center"><h2 className="text-2xl font-light uppercase tracking-[0.32em] md:text-3xl">Explore Everything</h2></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {services.map(([title,meta,href,accent]) => (
                <Link key={title} href={href} className={`group rounded-2xl border bg-[#060914]/82 p-6 backdrop-blur-md transition hover:-translate-y-1 hover:bg-[#0a0d18]/90 ${accent}`}>
                  <div className="mb-10 text-xl opacity-80">◎</div><h3 className="text-base font-medium tracking-[0.08em] text-white">{title}</h3><p className="mt-2 text-[9px] uppercase tracking-[0.18em] text-slate-500">{meta}</p><ArrowUpRight size={14} className="mt-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-24 border-t border-white/[0.07] py-16 text-center"><div className="mx-auto text-3xl text-cyan-200/90">◎</div><p className="mt-6 text-3xl font-light tracking-[0.22em] md:text-5xl">ORBIS</p><p className="mt-4 text-[9px] uppercase tracking-[0.4em] text-slate-500">Everything, connected.</p></div>
        </div>
      </div>
    </section>
  );
}
