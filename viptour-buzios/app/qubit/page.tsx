"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Cpu,
  ShieldAlert,
  Key,
  Database,
  Eye,
  Activity,
  Award,
  Landmark,
  RefreshCw,
  Compass,
  FileText,
  Workflow,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Radio,
  Globe
} from "lucide-react";

type SectionType = "manifesto" | "earth" | "network" | "governance" | "delta" | "branding" | "simulator";

export default function QubitManifestoPage() {
  const [activeSection, setActiveSection] = useState<SectionType>("manifesto");

  const sidebarItems = [
    { id: "manifesto", label: "Filosofía y Visión", icon: Compass },
    { id: "earth", label: "Metaverso Tierra", icon: MapPin },
    { id: "network", label: "Mecánica de Red", icon: Workflow },
    { id: "governance", label: "Gobernanza Cívica", icon: Landmark },
    { id: "delta", label: "Tokenomics DELTA", icon: TrendingUp },
    { id: "branding", label: "Identidad Visual", icon: Eye },
    { id: "simulator", label: "Simulador de Nodos", icon: RefreshCw },
  ];

  return (
    <main className="min-h-screen bg-[#030306] text-white pt-24 pb-16 relative overflow-hidden">
      {/* Background Cyber Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-radial from-[#10b981]/8 via-transparent to-transparent blur-[120px] opacity-75" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-radial from-[#00f2fe]/4 to-transparent blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.012]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group mb-12"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Volver al inicio</span>
        </Link>

        {/* Hero header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] mb-4">
            <Cpu className="w-4 h-4" />
            <span className="text-xs font-mono tracking-widest uppercase">QUBIT ENGINE / FASEOS PROTOCOL</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2 bg-gradient-to-r from-emerald-100 via-teal-300 to-cyan-500 bg-clip-text text-transparent">
            QUBIT SYSTEM PORTAL
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-3xl leading-relaxed">
            Explora la arquitectura completa del prototipo de Inteligencia Sensorial Distribuida y Metaverso vivo de la Tierra.
          </p>
        </header>

        {/* Portal Interface Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar Navigation */}
          <nav className="flex flex-col gap-2 p-2 rounded-2xl bg-[#0b0c14]/40 border border-zinc-800/80 backdrop-blur-xl lg:col-span-1">
            <div className="px-4 py-3 border-b border-zinc-800/50 mb-2">
              <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Capas del Sistema</span>
            </div>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as SectionType)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                      : "border border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/30"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activeSection === item.id ? "text-emerald-400" : "text-zinc-500"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Section Content Stage */}
          <div className="lg:col-span-3 min-h-[50vh] p-8 md:p-12 rounded-3xl bg-[#0b0c14]/20 border border-zinc-800/60 backdrop-blur-2xl relative">
            <AnimatePresence mode="wait">
              {activeSection === "manifesto" && (
                <motion.div
                  key="manifesto"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-12"
                >
                  {/* Poster Grid */}
                  <div className="relative w-full min-h-[65vh] earth-bg-container flex items-center px-6 md:px-12 py-12 overflow-hidden border border-cyan-500/25 rounded-3xl">
                    {/* Destello de luz ambiental superior */}
                    <div className="absolute top-0 left-1/4 w-[500px] h-[250px] bg-cyan-500/10 blur-[140px] pointer-events-none rounded-full" />

                    <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
                      {/* Columna de Texto y Llamado a la Acción */}
                      <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
                        <div className="flex items-center space-x-3">
                          <span className="text-[11px] font-mono tracking-[0.3em] text-cyan-400 uppercase bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded">
                            MPE / MAXIMIZING VIABLE POSSIBILITIES
                          </span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-white futuristic-title font-mono">
                          QUBIT <span className="text-cyan-400 block md:inline drop-shadow-[0_0_15px_rgba(0,242,254,0.4)]">EARTH</span>
                        </h2>

                        <p className="text-slate-350 text-sm md:text-base max-w-xl font-light leading-relaxed font-mono">
                          Una red global para <span className="text-cyan-300 font-medium">observar patrones ocultos</span> en la realidad. Entender lo complejo para ampliar lo posible.
                        </p>

                        {/* Métricas de Nodos / Datos / Futuros */}
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 max-w-lg">
                          <div className="border-l-2 border-cyan-500/50 pl-3">
                            <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider">Primeros</span>
                            <span className="text-sm font-bold text-cyan-300 font-mono">Nodos.</span>
                          </div>
                          <div className="border-l-2 border-cyan-500/50 pl-3">
                            <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider">Primeros</span>
                            <span className="text-sm font-bold text-cyan-300 font-mono">Datos.</span>
                          </div>
                          <div className="border-l-2 border-purple-500/50 pl-3">
                            <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider">Primeros</span>
                            <span className="text-sm font-bold text-purple-300 font-mono">Futuros.</span>
                          </div>
                        </div>

                        {/* Frase de cierre y Botón de Conexión */}
                        <div className="pt-4 space-y-4">
                          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                            Sé parte del primer sistema que <span className="text-white font-semibold">observa. comprende. anticipa.</span>
                          </p>

                          <motion.a 
                            href="#conectar"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="inline-flex items-center justify-between w-full max-w-lg px-6 py-4 rounded-xl glow-cyan-box text-cyan-300 hover:text-white transition-all group border border-cyan-500/40"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f2fe]" />
                              <span className="text-xs font-mono tracking-wider uppercase">Conectá tu nodo. Sumá tu mirada.</span>
                            </div>
                            <span className="text-cyan-400 group-hover:translate-x-1 transition-transform font-bold font-mono">| CONSTRUIMOS EL FUTURO JUNTOS.</span>
                          </motion.a>
                        </div>
                      </div>

                      {/* Columna Derecha: Glass Box */}
                      <div className="lg:col-span-5 hidden lg:flex justify-center items-center">
                        <div className="relative w-full h-[320px] rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-cyan-950/20 to-black/60 backdrop-blur-md overflow-hidden flex items-center justify-center p-6 shadow-2xl">
                           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,254,0.08)_0%,transparent_70%)]" />
                           <span className="text-[10px] font-mono text-cyan-400/60 tracking-[0.2em] uppercase animate-pulse">
                             [LIVE MPE SATELLITE FEED ACTIVE]
                           </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Theoretical Manifesto Section */}
                  <div className="border-t border-zinc-850 pt-10 space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2 font-mono uppercase tracking-wider text-emerald-400">
                        Filosofía & Visión Fundacional
                      </h3>
                      <p className="text-zinc-400 text-sm">El origen conceptual del prototipo y la hipótesis central del metaverso distribuido.</p>
                    </div>

                    <div className="p-8 rounded-2xl bg-gradient-to-br from-[#0c1815] to-[#040807] border border-emerald-500/20">
                      <blockquote className="text-lg md:text-xl font-light italic text-emerald-100">
                        “Si los datos humanos construyen el mundo digital, las personas deben gobernar ese mundo y participar de su valor de forma proporcional.”
                      </blockquote>
                      <p className="mt-4 text-xs font-mono text-zinc-500 uppercase tracking-widest">— Tesis Central, Whitepaper V0.1</p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-emerald-300 font-mono uppercase">Computador Cosmológico</h4>
                      <p className="text-zinc-300 text-sm leading-relaxed">
                        FaseOS organiza su arquitectura utilizando geometrías complejas como la <strong>Vesica Piscis</strong>, la <strong>Flor de la Vida</strong> y el <strong>Cubo Maestro</strong> no solo como lenguaje visual, sino como mapas topológicos para organizar y balancear redes de sensores distribuidos.
                      </p>
                      <p className="text-zinc-400 text-xs leading-relaxed italic border-l-2 border-zinc-700 pl-4">
                        *Nota científica del laboratorio: FaseOS no busca ocultar el cálculo; lo convierte en experiencia perceptible a través de la vista (geometrías y mandalas), el sonido (tonos de coherencia) y registros inmutables.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === "earth" && (
                <motion.div
                  key="earth"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Metaverso Tierra</h2>
                    <p className="text-zinc-400 text-sm">Construyendo una historia paralela a través de capas sensoriales.</p>
                  </div>

                  <p className="text-zinc-300 text-sm leading-relaxed">
                    QUBIT no crea un mundo virtual ficticio. Emerge como una capa de realidad paralela a la Tierra física, registrando una crónica de eventos y coherencias generada exclusivamente por sensores distribuidos en el territorio.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: "Capa Geográfica", desc: "Coordenadas aproximadas y delimitación de territorios activos." },
                      { title: "Capa Sensorial", desc: "Captura de ruido ambiental, frecuencias sonoras y movimiento local." },
                      { title: "Capa Temporal", desc: "Flujos de ciclos, anómalos de fase y eventos fechados." },
                      { title: "Capa Semántica", desc: "Aportes contextuales de usuarios (relatos, etiquetas y bitácoras)." },
                      { title: "Capa de Coherencia", desc: "Estabilidad de fase local y reputación criptográfica." },
                      { title: "Capa Visual", desc: "Geometría sagrada dinámica que traduce frecuencias en mandalas vivos." }
                    ].map((layer, idx) => (
                      <div key={idx} className="p-5 rounded-xl bg-zinc-900/30 border border-zinc-800/80">
                        <h4 className="text-sm font-bold text-emerald-300 mb-1">{layer.title}</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">{layer.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeSection === "network" && (
                <motion.div
                  key="network"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Mecánica de Red (FaseOS)</h2>
                    <p className="text-zinc-400 text-sm">Cómo interactúan los nodos y los sensores físicos.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-xl bg-zinc-900/20 border border-zinc-800">
                      <span className="text-[10px] font-bold text-emerald-400 font-mono tracking-wider block mb-2">CAPA 1 (SENSORES)</span>
                      <p className="text-xs text-zinc-300 leading-relaxed">Dispositivos móviles (Termux), micrófonos y simuladores de ondas cerebrales que emiten señales en tiempo real.</p>
                    </div>
                    <div className="p-6 rounded-xl bg-zinc-900/20 border border-zinc-800">
                      <span className="text-[10px] font-bold text-emerald-400 font-mono tracking-wider block mb-2">CAPA 3 (NÚCLEO PC)</span>
                      <p className="text-xs text-zinc-300 leading-relaxed">Servidor central que procesa handshakes Vesica, calcula coherencia y almacena la memoria inmutable de fase.</p>
                    </div>
                    <div className="p-6 rounded-xl bg-zinc-900/20 border border-zinc-800">
                      <span className="text-[10px] font-bold text-emerald-400 font-mono tracking-wider block mb-2">RESONANCIA MESH</span>
                      <p className="text-xs text-zinc-300 leading-relaxed">Topología mesh P2P basada en reputación de pares para garantizar resiliencia ante pérdida de conexión.</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800">
                    <h3 className="text-base font-bold text-emerald-300 mb-4">Métricas del Prototipo</h3>
                    <ul className="space-y-2 text-xs font-mono text-zinc-400">
                      <li className="flex justify-between border-b border-zinc-800 pb-2"><span>Frecuencia Base del Sistema:</span> <strong className="text-zinc-200">4.32 Hz</strong></li>
                      <li className="flex justify-between border-b border-zinc-800 pb-2"><span>Umbral de Coherencia Requerido:</span> <strong className="text-zinc-200">0.72</strong></li>
                      <li className="flex justify-between pb-2"><span>Protocolo de Comunicación:</span> <strong className="text-zinc-200">UDP Port 8892 / HTTP Port 8787</strong></li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeSection === "governance" && (
                <motion.div
                  key="governance"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Gobernanza Cívica</h2>
                    <p className="text-zinc-400 text-sm">Gobernabilidad democrática basada en reputación y no solo en tokens.</p>
                  </div>

                  <p className="text-zinc-300 text-sm leading-relaxed">
                    QUBIT implementa una regla meritocrática en el territorio virtual: <strong>“Quien más ayuda a comprender y mejorar una zona, gana más responsabilidad y poder de decisión dentro de ella.”</strong> Para evitar la plutocracia (captura del sistema por capital), el peso del voto es cuadrático y reputacional.
                  </p>

                  <div className="p-6 rounded-2xl bg-zinc-900/20 border border-zinc-850">
                    <h3 className="text-base font-bold text-emerald-300 mb-6">Escalera de Roles de Nodo</h3>
                    <div className="space-y-4">
                      {[
                        { role: "Nodo Visitante", desc: "Acceso básico de lectura, sin reputación previa." },
                        { role: "Nodo Activo", desc: "Aporta señales de sensores validadas de forma recurrente." },
                        { role: "Nodo Validador", desc: "Firma y audita eventos de nodos de menor reputación." },
                        { role: "Coordinador de Zona", desc: "Modera y organiza la memoria territorial local." },
                        { role: "Gobernador de Ciudad", desc: "Abre votaciones y lidera propuestas en su región." },
                        { role: "Consejo QUBIT / FaseOS", desc: "Gobernanza del núcleo de red y del protocolo global." }
                      ].map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-start text-xs border-b border-zinc-800 pb-3 last:border-0 last:pb-0">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold font-mono">
                            {idx + 1}
                          </div>
                          <div>
                            <strong className="text-zinc-200 block mb-0.5">{item.role}</strong>
                            <span className="text-zinc-500">{item.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === "delta" && (
                <motion.div
                  key="delta"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Tokenomics del Token DELTA</h2>
                    <p className="text-zinc-400 text-sm">Distribución justa de valor para la red sensorial.</p>
                  </div>

                  <p className="text-zinc-300 text-sm leading-relaxed">
                    DELTA es la unidad de reconocimiento de la red. No premia el volumen bruto de datos, sino la utilidad y no redundancia de las señales enviadas a través del mecanismo <strong>Proof of Resonance (PoR)</strong>.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800">
                      <h4 className="text-xs font-bold text-emerald-400 tracking-wider font-mono mb-4 uppercase">Parámetros de Emisión</h4>
                      <ul className="space-y-2 text-xs font-mono text-zinc-400">
                        <li className="flex justify-between"><span>Suministro Máximo:</span> <strong className="text-zinc-200">432M DELTA</strong></li>
                        <li className="flex justify-between"><span>Reserva de Desarrollo:</span> <strong className="text-zinc-200">12% (Bloqueado)</strong></li>
                        <li className="flex justify-between"><span>Distribución Core:</span> <strong className="text-zinc-200">Proof of Resonance</strong></li>
                      </ul>
                    </div>

                    <div className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800">
                      <h4 className="text-xs font-bold text-emerald-400 tracking-wider font-mono mb-4 uppercase">Etapa de Desarrollo</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-2">
                        En la fase actual de laboratorio, los tokens operan bajo la modalidad de <strong>DELTA_test</strong>. Son puntajes de reputación internos sin valor financiero ni cotización en mercados secundarios.
                      </p>
                      <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                        Estado: Simulación de Laboratorio
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === "branding" && (
                <motion.div
                  key="branding"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Identidad Visual QUBIT</h2>
                    <p className="text-zinc-400 text-sm">Colección de imágenes conceptuales y branding para el metasistema.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {Array.from({ length: 11 }, (_, i) => i + 1).map((num) => (
                      <div 
                        key={num} 
                        className="group relative rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-800/80 hover:border-emerald-500/40 transition-all duration-300 shadow-xl"
                      >
                        <div className="relative aspect-square overflow-hidden bg-black/40">
                          <img
                            src={`/images/qubit/qubit-${num}.png`}
                            alt={`QUBIT Visual Concept ${num}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="absolute bottom-3 left-3 bg-black/70 border border-zinc-800 px-2.5 py-1 rounded-md text-[10px] font-mono text-emerald-400">
                          CONCEPT #{num}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeSection === "simulator" && (
                <motion.div
                  key="simulator"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">Simulador de Nodos</h2>
                      <p className="text-zinc-400 text-sm">Visualizador en tiempo real de la red local de FaseOS.</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#10b981] text-xs">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Fase local activa</span>
                    </div>
                  </div>

                  <div className="w-full h-[60vh] rounded-2xl overflow-hidden border border-zinc-800 bg-black/60 shadow-2xl">
                    <iframe
                      src="/qubit/index.html"
                      className="w-full h-full border-none"
                      title="QUBIT Engine Simulator"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
