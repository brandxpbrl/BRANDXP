"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Cpu,
  Compass,
  FileText,
  Workflow,
  Link2,
  Terminal,
  Activity,
  Server,
  Network
} from "lucide-react";

type TabType = "observatorio" | "whitepaper" | "arquitectura" | "agentes" | "nodos";

export default function QubitManifestoPage() {
  const [activeTab, setActiveTab] = useState<TabType>("observatorio");
  const [nodeName, setNodeName] = useState("");
  const [nodeResponse, setNodeResponse] = useState<string[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "> [INIT] Conectando con earth_memory_limpia.jsonl...",
    "> [SUCCESS] Handshake Vesica completado. Coherencia de red al 92.4%.",
    "> [MPE] Sistema operando en atractor de estabilidad principal."
  ]);

  useEffect(() => {
    const logs = [
      "> [TELEMETRY] Recibidas señales de nodo_buzios_02: coherencia 0.89",
      "> [POR] Calculando Proof of Resonance... Aprobado",
      "> [DELTA] +0.000432 DELTA test distribuido a validadores",
      "> [MPE] Anomalía de fase local corregida mediante tensor topológico",
      "> [SECURITY] Perímetro Zero-Trust: Firma criptográfica HMAC-SHA256 verificada",
      "> [DATABASE] Consolidando evento en earth_memory.jsonl"
    ];

    const interval = setInterval(() => {
      if (activeTab === "observatorio") {
        const randomLog = logs[Math.floor(Math.random() * logs.length)];
        setConsoleLogs((prev) => [...prev.slice(-8), randomLog]);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [activeTab]);

  const handleRegisterNode = () => {
    if (!nodeName.trim()) {
      setNodeResponse(["> [ERROR] Ingresá un identificador válido para el nodo."]);
      return;
    }
    setIsRegistering(true);
    setNodeResponse([`> [INIT] Generando par de llaves HMAC-SHA256 para '${nodeName}'...`]);

    setTimeout(() => {
      const peerId = `qb_${Math.random().toString(36).substring(2, 12)}`;
      setNodeResponse((prev) => [
        ...prev,
        `> [SUCCESS] Identidad firmada. peer_id asignado: ${peerId}`,
        `> [VESICA] Handshake completado. Nodo integrado a QUBIT Earth.`
      ]);
      
      setConsoleLogs((prev) => [
        ...prev,
        `> [NEW_NODE] Acoplado exitosamente: ${nodeName} (${peerId})`
      ]);
      setIsRegistering(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen text-white pt-28 pb-20 relative overflow-hidden font-mono">
      {/* Immersive background fusion */}
      <div className="fixed inset-0 bg-earth-fixed z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-[#050505]/90 to-black z-0 pointer-events-none" />
      
      {/* Tactical grid background overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-radial from-[#00E5FF]/6 via-transparent to-transparent blur-[140px] opacity-75" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-radial from-[#ff2a85]/4 to-transparent blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,229,255,0.015)_1px,transparent_1px)] [background-size:32px_32px] opacity-80" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#00E5FF] transition-colors group mb-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] tracking-wider uppercase">[ VOLVER AL INICIO ]</span>
        </Link>

        {/* Global Tactical Header */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#00E5FF]/20 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#00E5FF]/30 bg-[#00E5FF]/5 text-[#00E5FF] mb-4 text-[10px] tracking-widest uppercase">
              <Cpu className="w-3.5 h-3.5 animate-pulse" />
              <span>CORE SYSTEM STATUS // ACTIVE</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-wider text-white uppercase">
              QUBIT SYSTEM PORTAL
            </h1>
            <p className="text-zinc-400 text-xs md:text-sm mt-2 max-w-3xl leading-relaxed font-sans">
              Infraestructura descentralizada de inteligencia colectiva, memoria planetaria y navegación de flujos.
            </p>
          </div>
          <div className="text-right font-mono text-[10px] text-zinc-500 flex flex-col gap-1">
            <div>VERSION: 0.2 // PROTOCOL: VESICA</div>
            <div>LATENCY: 14ms // SIGNAL: STABLE</div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap gap-2.5 mb-8">
          {[
            { id: "observatorio", label: "[01] OBSERVATORIO", icon: Compass },
            { id: "whitepaper", label: "[02] WHITEPAPER V0.2", icon: FileText },
            { id: "arquitectura", label: "[03] ARQUITECTURA", icon: Workflow },
            { id: "agentes", label: "[04] SALA DE AGENTES", icon: Server },
            { id: "nodos", label: "[05] ACOPLAR NODO", icon: Link2 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-5 py-3 rounded border text-xs tracking-wider transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-[#00E5FF]/10 border-[#00E5FF] text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                    : "border-zinc-800/80 bg-black/40 text-zinc-400 hover:text-white hover:border-zinc-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Tactical Terminal Panel */}
        <div className="rounded-xl bg-black/60 border border-[#00E5FF]/20 p-6 md:p-10 backdrop-blur-md shadow-[0_0_20px_rgba(0,229,255,0.05)] min-h-[550px] relative">
          <AnimatePresence mode="wait">
            {activeTab === "observatorio" && (
              <motion.div
                key="observatorio"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-lg font-bold text-[#00E5FF] tracking-wider border-b border-dashed border-[#00E5FF]/20 pb-3 mb-6 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#00E5FF]" />
                    <span>TELEMETRÍA DE LA TIERRA (EN VIVO)</span>
                  </h2>
                  
                  {/* Expanded Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {[
                      { label: "ESTADO MPE", value: "MPE_RESONANCIA", statusColor: "text-[#00E5FF]" },
                      { label: "NODOS ACTIVOS", value: "9 / 9", statusColor: "text-white" },
                      { label: "POSSIBILITY INDEX (PI)", value: "0.8055", statusColor: "text-[#00E5FF]" },
                      { label: "ESTADOS HISTÓRICOS", value: "745,837", statusColor: "text-white" }
                    ].map((metric, i) => (
                      <div key={i} className="bg-black/40 border border-zinc-800/80 p-5 rounded-lg">
                        <span className="block text-[9px] text-zinc-500 tracking-widest uppercase mb-2">{metric.label}</span>
                        <span className={`text-xl font-bold ${metric.statusColor}`}>{metric.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Simulator Canvas iframe container */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    <div className="lg:col-span-8">
                      <div className="w-full h-[520px] rounded-lg overflow-hidden border border-zinc-800/80 bg-black/80">
                        <iframe
                          src="/qubit/index.html"
                          className="w-full h-full border-none"
                          title="QUBIT Engine Simulator"
                        />
                      </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col">
                      {/* Active Console logs */}
                      <div className="flex-grow flex flex-col justify-between bg-black/60 border border-zinc-850 p-6 rounded-lg h-full">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-4 border-b border-zinc-900 pb-2">
                            <Terminal className="w-4 h-4 text-[#00E5FF]" />
                            <span>REGISTRO DE OPERACIONES</span>
                          </div>
                          <div className="space-y-2.5 text-[11px] leading-relaxed text-[#00FF66] overflow-y-auto max-h-[380px]">
                            {consoleLogs.map((log, idx) => (
                              <div key={idx} className="whitespace-pre-wrap">{log}</div>
                            ))}
                          </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-between items-center text-[9px] text-zinc-500">
                          <span>FEED STATUS: STREAMING</span>
                          <span className="w-2.5 h-2.5 rounded-full bg-[#00FF66] animate-pulse shadow-[0_0_8px_#00FF66]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "whitepaper" && (
              <motion.div
                key="whitepaper"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-bold text-[#00E5FF] tracking-wider border-b border-dashed border-[#00E5FF]/20 pb-3 mb-6">
                  WHITEPAPER V0.2: EL METAVERSO VIVO DE LA TIERRA
                </h2>
                
                {/* Full Flow Readability (No scroll boundaries) */}
                <div className="space-y-8 text-zinc-300 font-sans text-sm leading-relaxed max-w-5xl">
                  <section className="space-y-3">
                    <h3 className="text-sm font-bold text-[#00E5FF] font-mono tracking-wider uppercase">1. Resumen & Tesis Central</h3>
                    <p>
                      QUBIT es una red descentralizada de nodos que construye un metaverso vivo y paralelo de la Tierra. Cada nodo perimetral percibe, registra y aporta señales del mundo físico (como variables acústicas, lumínicas, de movimiento o telemetría ambiental validada) validadas por identidad criptográfica, reputación y <strong>Proof of Resonance (PoR)</strong>.
                    </p>
                    <div className="border-l-2 border-[#00E5FF] pl-4 py-2 my-4 italic text-[#00E5FF] font-mono text-xs bg-[#00E5FF]/5">
                      "Si los datos humanos y territoriales construyen el mundo digital, las personas deben gobernar ese mundo y participar de su valor de forma proporcional."
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-sm font-bold text-[#00E5FF] font-mono tracking-wider uppercase">2. Problema & Visión</h3>
                    <p>
                      Las plataformas centralizadas concentran de forma extractiva la identidad, datos y valor de la sociedad, convirtiendo la interacción humana en un producto. QUBIT descentraliza este flujo:
                    </p>
                    <div className="bg-black/40 border border-zinc-800 p-4 rounded font-mono text-xs text-center text-[#00E5FF] my-4">
                      Tierra física ➔ Nodos ➔ Señales ➔ Coherencia ➔ Memoria ➔ Metaverso
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-sm font-bold text-[#00E5FF] font-mono tracking-wider uppercase">3. Tokenomics & DELTA</h3>
                    <p>
                      <strong>DELTA</strong> es el token de recompensa nativo. El suministro máximo propuesto es de 432,000,000 DELTA (con un 12% reservado para desarrollo). DELTA representa contribución validada al sistema y no una simple tenencia extractiva pasiva.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-sm font-bold text-[#00E5FF] font-mono tracking-wider uppercase">4. Gobernanza Cívica</h3>
                    <p>
                      Escalera de roles basada en reputación territorial y validez operativa: Nodo Visitante, Nodo Activo, Nodo Validador, Coordinador de Zona, Gobernador de Ciudad y Consejo QUBIT.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-sm font-bold text-[#00E5FF] font-mono tracking-wider uppercase">5. Roadmap Sistémico Actualizado</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs text-zinc-400">
                      <div className="border border-zinc-800/80 p-4 rounded bg-black/20">
                        <span className="text-[#00E5FF] font-bold block mb-1">Fase 1 (MVP Local):</span>
                        Servidor local, nodos firmados, visual web y puntaje DELTA test.
                      </div>
                      <div className="border border-zinc-800/80 p-4 rounded bg-black/20">
                        <span className="text-[#00E5FF] font-bold block mb-1">Fase 2 (Comunidad Cerrada):</span>
                        Despliegue de 10 a 50 nodos humanos y validación cruzada.
                      </div>
                      <div className="border border-zinc-800/80 p-4 rounded bg-black/20">
                        <span className="text-[#00E5FF] font-bold block mb-1">Fase 3 (Comunicación Global):</span>
                        Integración de APIs robustas, WebSockets, topologías P2P y gossiping seguro.
                      </div>
                      <div className="border border-zinc-800/80 p-4 rounded bg-black/20">
                        <span className="text-[#00E5FF] font-bold block mb-1">Fase 4 (Economía DELTA):</span>
                        Definición final de tokenomics, auditoría y tesorería descentralizada.
                      </div>
                      <div className="border border-zinc-850 p-4 rounded bg-black/30 md:col-span-2">
                        <span className="text-[#00E5FF] font-bold block mb-1">Fase 5 (Integración Sistémica y Evolutiva):</span>
                        Incorporación nativa del motor analítico de simulación, cálculo de tensores topológicos y predicción estocástica. La red se convierte en una inteligencia colectiva capaz de observar, medir y proponer en tiempo real.
                      </div>
                    </div>
                  </section>
                </div>
              </motion.div>
            )}

            {activeTab === "arquitectura" && (
              <motion.div
                key="arquitectura"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-bold text-[#00E5FF] tracking-wider border-b border-dashed border-[#00E5FF]/20 pb-3 mb-6">
                  ARQUITECTURA GENERAL (5 CAPAS)
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { num: "01", title: "Capa de Nodo", desc: "node_id, identidad criptográfica HMAC-SHA256, permisos dinámicos y capacidad sensorial perimetral (acústica, de fase y estado local)." },
                    { num: "02", title: "Capa de Comunicación", desc: "UDP local para telemetría inicial de telemetría de fase, evolucionando hacia WebSockets, libp2p, protocolos gossip y tablas DHT." },
                    { num: "03", title: "Capa de Validación", desc: "Perímetro Zero-Trust. Whitelisting de eventos, firmas obligatorias y control anti-replay con sesgo temporal máximo de 120s para prevenir ataques." },
                    { num: "04", title: "Capa de Memoria", desc: "Data Lake distribuido basado en almacenamiento JSON Lines (earth_memory.jsonl), base inmutable para el cálculo del PoR y la gobernanza." },
                    { num: "05", title: "Capa Visual", desc: "Observatorio topológico sinestésico que renderiza núcleos, esferas, tetraedros y vectores de coherencia en tiempo real en un canvas 2D." }
                  ].map((layer, i) => (
                    <div key={i} className="bg-black/30 border border-zinc-800/80 p-6 rounded-lg relative overflow-hidden group hover:border-[#00E5FF]/40 transition-colors">
                      <div className="absolute top-4 right-4 text-3xl font-black text-[#00E5FF]/10 font-mono tracking-tighter select-none group-hover:text-[#00E5FF]/20 transition-colors">
                        {layer.num}
                      </div>
                      <h3 className="font-mono text-xs font-bold text-[#00E5FF] mb-3 uppercase tracking-wider">{layer.title}</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">{layer.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "agentes" && (
              <motion.div
                key="agentes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-bold text-[#00E5FF] tracking-wider border-b border-dashed border-[#00E5FF]/20 pb-3 mb-6">
                  SALA DE AGENTES Y MOTORES MPE
                </h2>
                <p className="text-xs text-zinc-400">
                  Sistemas independientes y modelado matemático que actúan en la red:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {[
                    { name: "MPE Research", desc: "Valida los límites epistémicos y la consistencia matemática de los estados globales analizados en red." },
                    { name: "MPE Engine & Tensores", desc: "Calcula los campos escalares topológicos mediante matrices Hessianas y puntos de silla para acoplar los nodos en red." },
                    { name: "QSIM Predictor", desc: "Motor estocástico basado en Cadenas de Markov V0 e Índice de Posibilidad (PI) para anticipar transiciones inestables." },
                    { name: "Brand Guardian (El Auditor)", desc: "Filtra la interfaz y los reportes para garantizar rigor técnico y estética minimalista de lujo futurista." }
                  ].map((agent, i) => (
                    <div key={i} className="flex gap-4 p-5 rounded-lg border border-zinc-850 bg-black/40">
                      <div className="w-9 h-9 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] font-bold text-xs shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <strong className="block text-xs font-bold text-[#00E5FF] mb-1.5 uppercase tracking-wide">{agent.name}</strong>
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans">{agent.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "nodos" && (
              <motion.div
                key="nodos"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-bold text-[#00E5FF] tracking-wider border-b border-dashed border-[#00E5FF]/20 pb-3 mb-6">
                  REGISTRO Y HANDSHAKE DE NODO
                </h2>
                <p className="text-xs text-zinc-400 max-w-xl">
                  Inicia el protocolo de acoplamiento criptográfico para registrar y firmar tu nodo en la red QUBIT Earth:
                </p>

                <div className="max-w-xl space-y-5 pt-4">
                  <div className="space-y-2">
                    <label className="block text-[9px] tracking-wider text-zinc-500 uppercase">Identificador de Nodo</label>
                    <input
                      type="text"
                      value={nodeName}
                      onChange={(e) => setNodeName(e.target.value)}
                      placeholder="Ej: nodo_buzios_01"
                      className="w-full bg-black/75 border border-[#00E5FF]/30 focus:border-[#00E5FF] px-4 py-3 rounded text-white text-xs placeholder-zinc-700 focus:outline-none transition-colors shadow-[0_0_10px_rgba(0,229,255,0.05)]"
                    />
                  </div>

                  <button
                    onClick={handleRegisterNode}
                    disabled={isRegistering}
                    className="w-full bg-[#00E5FF]/10 border border-[#00E5FF] hover:bg-[#00E5FF] hover:text-black text-[#00E5FF] font-bold text-xs py-3.5 rounded tracking-widest transition-all duration-300 disabled:opacity-50 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] cursor-pointer"
                  >
                    {isRegistering ? "[ PROCESANDO HANDSHAKE VESICA... ]" : "[ INICIAR HANDSHAKE VESICA ]"}
                  </button>

                  {nodeResponse.length > 0 && (
                    <div className="bg-black/80 border border-[#00E5FF]/20 p-5 rounded text-xs text-[#00E5FF] space-y-1.5 shadow-[0_0_15px_rgba(0,229,255,0.02)]">
                      {nodeResponse.map((res, i) => (
                        <div key={i} className="whitespace-pre-wrap">{res}</div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

