import Link from "next/link";
import MpeRuntimeSurface from "../MpeRuntimeSurface";

export default function MpeEarthPage() {
  return (
    <main className="min-h-screen bg-[#02070b] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <Link href="/mpe" className="text-xs tracking-[0.18em] text-cyan-200/55 transition hover:text-cyan-100">← MPE ORGANISM</Link>
        <div className="mt-10 max-w-3xl">
          <p className="text-[11px] tracking-[0.24em] text-cyan-300/65">EARTH</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">Estado terrestre y telemetría</h1>
          <p className="mt-5 text-base leading-7 text-white/48">Vista read-only del estado que FaseOS / Earth exponga al organismo. Si el runtime no está conectado, la interfaz lo muestra como desconocido en lugar de simular actividad.</p>
        </div>
        <MpeRuntimeSurface />
      </div>
    </main>
  );
}
