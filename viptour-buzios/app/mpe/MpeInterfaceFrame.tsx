import Link from "next/link";

const nav = [
  ["ALIVE", "/mpe"],
  ["EARTH", "/mpe/earth"],
  ["LAB", "/mpe/lab"],
  ["SYSTEM", "/mpe/system"],
  ["MEMORY", "/mpe/memory"],
  ["SOURCE", "/mpe/source"],
] as const;

export default function MpeInterfaceFrame({ active, children }: { active: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#02060c] text-white">
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#030812]/90 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1600px] items-center gap-6 px-4 py-3 sm:px-6">
          <Link href="/mpe" className="flex min-w-fit items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-cyan-300/25 bg-[radial-gradient(circle,rgba(34,211,238,.28),rgba(168,85,247,.12),transparent_70%)] text-xs font-black text-cyan-100">M</span>
            <span><b className="block text-lg tracking-[0.08em]">MPE</b><small className="block text-[8px] tracking-[0.24em] text-white/35">ORGANISM</small></span>
          </Link>
          <div className="hidden h-8 w-px bg-white/8 lg:block" />
          <div className="hidden min-w-0 flex-1 lg:block"><p className="text-[10px] tracking-[0.15em] text-white/65">MPE · MAXIMIZADOR DE POSIBILIDADES EVOLUTIVAS</p><p className="mt-0.5 text-[10px] text-white/30">El organismo que observa, experimenta y evoluciona.</p></div>
          <nav className="ml-auto hidden items-center gap-1 md:flex">{nav.map(([label, href]) => <Link key={label} href={href} className={`border-b px-3 py-3 text-[11px] tracking-[0.08em] transition ${active === label ? "border-fuchsia-300 text-white" : "border-transparent text-white/50 hover:text-white"}`}>{label}</Link>)}</nav>
          <div className="ml-auto rounded-xl border border-amber-300/15 bg-amber-300/[0.035] px-3 py-2 text-right md:ml-2"><p className="text-[9px] font-semibold tracking-[0.14em] text-amber-200">NODE · OBSERVED</p><p className="text-[9px] text-white/30">LIVE sólo con fuente real</p></div>
        </div>
      </header>
      <div className="mx-auto max-w-[1600px]">{children}</div>
    </div>
  );
}
