import Link from "next/link";
import MpeRuntimeSurface from "../MpeRuntimeSurface";

export default function MpeSystemPage() {
  return (
    <main className="min-h-screen bg-[#02070b] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <Link href="/mpe" className="text-xs tracking-[0.18em] text-cyan-200/55 transition hover:text-cyan-100">← MPE ORGANISM</Link>
        <div className="mt-10 max-w-3xl">
          <p className="text-[11px] tracking-[0.24em] text-fuchsia-300/65">SYSTEM</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">Runtime, servicios y salud</h1>
          <p className="mt-5 text-base leading-7 text-white/48">Superficie de observación del runtime. V0.1 no ejecuta start/stop ni muta servicios: lee el estado expuesto, muestra desconexiones y conserva la separación entre arquitectura declarada y actividad realmente observada.</p>
        </div>
        <MpeRuntimeSurface />
      </div>
    </main>
  );
}
