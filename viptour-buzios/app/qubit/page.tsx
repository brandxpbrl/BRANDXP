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
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
                >
                  {/* Left Column - Poster Content */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-8 bg-[#0b0c14]/40 border border-zinc-800/80 p-8 md:p-10 rounded-3xl backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                    
                    {/* Header */}
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-sm font-bold tracking-[0.25em] text-zinc-400 font-mono block">MPE</span>
                        <span className="text-[9px] font-semibold tracking-[0.18em] text-zinc-500 uppercase font-mono block">MAXIMIZING VIABLE POSSIBILITIES</span>
                      </div>
                      
                      <div className="space-y-2">
                        <h2 className="text-4xl md:text-5.5xl font-black tracking-wider text-white font-mono uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                          QUBIT <span className="text-[#00f2fe] drop-shadow-[0_0_20px_rgba(0,242,254,0.4)]">EARTH</span>
                        </h2>
                        <p className="text-sm md:text-base font-semibold tracking-wider text-zinc-300 uppercase leading-relaxed font-mono">
                          Una red global para <span className="text-[#00f2fe]">observar patrones</span> ocultos en la realidad.
                        </p>
                      </div>
                    </div>

                    {/* Three Columns of Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-4 border-y border-zinc-800/50">
                      {/* Feature 1 */}
                      <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3">
                        <div className="w-12 h-12 rounded-full bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                          <Radio className="w-6 h-6 animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-zinc-500 font-mono tracking-widest uppercase block">PRIMEROS</span>
                          <span className="text-xs font-black text-cyan-400 font-mono tracking-wider uppercase block">NODOS.</span>
                        </div>
                      </div>

                      {/* Feature 2 */}
                      <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3 sm:border-l sm:border-zinc-800/50 sm:pl-6">
                        <div className="w-12 h-12 rounded-full bg-teal-950/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.15)]">
                          <Database className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-zinc-500 font-mono tracking-widest uppercase block">PRIMEROS</span>
                          <span className="text-xs font-black text-teal-400 font-mono tracking-wider uppercase block">DATOS.</span>
                        </div>
                      </div>

                      {/* Feature 3 */}
                      <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3 sm:border-l sm:border-zinc-800/50 sm:pl-6">
                        <div className="w-12 h-12 rounded-full bg-purple-950/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                          <Activity className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-zinc-500 font-mono tracking-widest uppercase block">PRIMEROS</span>
                          <span className="text-xs font-black text-purple-400 font-mono tracking-wider uppercase block">FUTUROS POSIBLES.</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Taglines */}
                    <div className="space-y-4 pt-2">
                      <p className="text-[11px] md:text-xs font-semibold tracking-[0.2em] text-zinc-300 font-mono uppercase text-center leading-relaxed">
                        Sé parte del primer sistema que <br className="sm:hidden" />
                        <span className="text-[#00f2fe]">observa</span>. <span className="text-[#00f2fe]">comprende</span>. <span className="text-[#00f2fe]">anticipa</span>.
                      </p>

                      {/* Glowing border box */}
                      <div className="p-3 md:p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/5 flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left shadow-[0_0_20px_rgba(6,182,212,0.05)]">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-cyan-400" />
                          <span className="text-[10px] font-bold tracking-wider text-zinc-300 font-mono uppercase">
                            Conectá tu nodo. Sumá tu mirada.
                          </span>
                        </div>
                        <span className="text-[10px] font-bold tracking-wider text-cyan-400 font-mono uppercase border-t md:border-t-0 md:border-l border-zinc-800/85 pt-2 md:pt-0 md:pl-4">
                          Construimos el futuro juntos.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Earth Visual Image */}
                  <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-zinc-800/80 shadow-2xl min-h-[350px] lg:min-h-auto">
                    <img
                      src="/images/qubit/qubit-poster.jpg"
                      alt="QUBIT Earth Visual Metasystem"
                      className="absolute inset-0 w-full h-full object-cover object-right"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
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
