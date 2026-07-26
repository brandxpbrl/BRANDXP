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
  ShieldCheck,
  Server
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

  // Simular logs de la consola en tiempo real
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
      
      // Añadir log a la consola general
      setConsoleLogs((prev) => [
        ...prev,
        `> [NEW_NODE] Acoplado exitosamente: ${nodeName} (${peerId})`
      ]);
      setIsRegistering(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-transparent text-white pt-24 pb-16 relative overflow-hidden font-sans">
      <div className="fixed inset-0 bg-earth-fixed z-0 pointer-events-none" />
      
      {/* Background Cyber Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-radial from-[#00E5FF]/8 via-transparent to-transparent blur-[120px] opacity-75" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-radial from-[#ff2a85]/5 to-transparent blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.012]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group mb-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs uppercase tracking-wider">Volver al inicio</span>
        </Link>

        {/* Hero header */}
        <header className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono tracking-widest uppercase">[ SYSTEM: ACTIVE ]</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 font-mono text-white">
            QUBIT SYSTEM PORTAL
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-3xl leading-relaxed">
            Infraestructura descentralizada de inteligencia colectiva, memoria planetaria y navegación de flujos.
          </p>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap justify-center md:justify-start gap-2.5 mb-8 border-b border-zinc-800/60 pb-5">
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
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border font-mono text-xs transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-[#00E5FF]/15 border-[#00E5FF] text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                    : "border-zinc-800 bg-black/40 text-zinc-400 hover:text-white hover:border-zinc-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Main Content Box (Terminal Screen) */}
        <div className="rounded-2xl bg-black/75 border border-zinc-800/80 p-6 md:p-10 backdrop-blur-xl shadow-2xl min-h-[500px] relative">
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
                  <h2 className="text-xl font-bold text-[#00E5FF] font-mono uppercase tracking-wider border-b border-dashed border-zinc-800/60 pb-3 mb-6">
                    TELEMETRÍA DE LA TIERRA (EN VIVO)
                  </h2>
                  
                  {/* Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                      { label: "ESTADO MPE", value: "MPE_RESONANCIA", statusColor: "text-[#00E5FF]" },
                      { label: "NODOS ACTIVOS", value: "9 / 9", statusColor: "text-white" },
                      { label: "POSSIBILITY INDEX (PI)", value: "0.8055", statusColor: "text-[#00E5FF]" },
                      { label: "ESTADOS HISTÓRICOS", value: "745,837", statusColor: "text-white" }
                    ].map((metric, i) => (
                      <div key={i} className="bg-[#00E5FF]/5 border border-zinc-800/80 p-5 rounded-xl text-center">
                        <span className="block text-[10px] text-zinc-500 font-mono tracking-wider uppercase mb-1.5">{metric.label}</span>
                        <span className={`text-base font-bold font-mono ${metric.statusColor}`}>{metric.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Simulator Canvas iframe container */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="w-full h-[450px] rounded-xl overflow-hidden border border-zinc-800 bg-black/60 shadow-inner">
                        <iframe
                          src="/qubit/index.html"
                          className="w-full h-full border-none"
                          title="QUBIT Engine Simulator"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-between">
                      {/* Active Console logs */}
                      <div className="flex-grow flex flex-col justify-between bg-black border border-zinc-800 p-5 rounded-xl">
                        <div>
                          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-4 border-b border-zinc-900 pb-2">
                            <Terminal className="w-3.5 h-3.5 text-[#00E5FF]" />
                            <span>CONSOLA DEL SISTEMA</span>
                          </div>
                          <div className="space-y-2 font-mono text-[11px] leading-relaxed text-[#00FF66] overflow-y-auto max-h-[300px]">
                            {consoleLogs.map((log, idx) => (
                              <div key={idx} className="whitespace-pre-wrap">{log}</div>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-zinc-900 flex justify-between items-center text-[10px] font-mono text-zinc-500">
                          <span>FEED STATUS: ACTIVE</span>
                          <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse" />
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
                <h2 className="text-xl font-bold text-[#00E5FF] font-mono uppercase tracking-wider border-b border-dashed border-zinc-800/60 pb-3 mb-6">
                  WHITEPAPER V0.2: EL METAVERSO VIVO DE LA TIERRA
                </h2>
                
                <div className="max-h-[500px] overflow-y-auto pr-4 space-y-6 text-sm leading-relaxed text-zinc-300 font-sans scrollbar-thin">
                  <div>
                    <h3 className="text-base font-bold text-[#00E5FF] font-mono uppercase mb-2">1. Resumen & Tesis Central</h3>
                    <p className="mb-3">
                      QUBIT es una red descentralizada de nodos que construye un metaverso vivo y paralelo de la Tierra. Cada nodo perimetral percibe, registra y aporta señales del mundo físico (como variables acústicas, lumínicas, de movimiento o telemetría ambiental validada) validadas por identidad criptográfica, reputación y <strong>Proof of Resonance (PoR)</strong>.
                    </p>
                    <div className="border-l-2 border-[#00E5FF] pl-4 py-1.5 my-4 italic text-[#00E5FF]/90 font-mono text-xs">
                      "Si los datos humanos y territoriales construyen el mundo digital, las personas deben gobernar ese mundo y participar de su valor."
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#00E5FF] font-mono uppercase mb-2">2. Problema & Visión</h3>
                    <p className="mb-3">
                      Las plataformas centralizadas concentran de forma extractiva la identidad, datos y valor de la sociedad, convirtiendo la interacción humana en un producto. QUBIT descentraliza este flujo:
                    </p>
                    <div className="bg-black/40 border border-zinc-900 p-4 rounded-lg font-mono text-xs text-center text-zinc-400 my-4">
                      Tierra física ➔ Nodos ➔ Señales ➔ Coherencia ➔ Memoria ➔ Metaverso
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#00E5FF] font-mono uppercase mb-2">3. Tokenomics & DELTA</h3>
                    <p className="mb-3">
                      <strong>DELTA</strong> es el token de recompensa nativo. El suministro máximo propuesto es de 432,000,000 DELTA (con un 12% reservado para desarrollo). DELTA representa contribución validada al sistema y no una simple tenencia extractiva pasiva.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#00E5FF] font-mono uppercase mb-2">4. Gobernanza Cívica</h3>
                    <p className="mb-3">
                      Escalera de roles basada en reputación territorial y validez operativa: Nodo Visitante, Nodo Activo, Nodo Validador, Coordinador de Zona, Gobernador de Ciudad y Consejo QUBIT.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#00E5FF] font-mono uppercase mb-2">5. Roadmap Sistémico Actualizado</h3>
                    <ul className="list-disc pl-5 space-y-2 text-zinc-400 font-mono text-xs">
                      <li><strong>Fase 1 (MVP Local):</strong> Servidor local, nodos firmados, visual web y puntaje DELTA test.</li>
                      <li><strong>Fase 2 (Comunidad Cerrada):</strong> Despliegue de 10 a 50 nodos humanos y validación cruzada.</li>
                      <li><strong>Fase 3 (Comunicación Global):</strong> Integración de APIs robustas, WebSockets, topologías P2P y gossiping seguro.</li>
                      <li><strong>Fase 4 (Economía DELTA):</strong> Definición final de tokenomics, auditoría y despliegue de tesorería descentralizada.</li>
                      <li><strong>Fase 5 (Integración Sistémica y Evolutiva):</strong> Incorporación nativa del motor analítico de simulación, cálculo de tensores topológicos y predicción estocástica. La red se convierte en una inteligencia colectiva capaz de observar, medir y proponer en tiempo real.</li>
                      <li><strong>Fase 6 (QUBIT Earth Public):</strong> Lanzamiento de ciudades piloto, nodos ciudadanos activos, mapas vivos y apertura total del metaverso territorial.</li>
                    </ul>
                  </div>
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
                <h2 className="text-xl font-bold text-[#00E5FF] font-mono uppercase tracking-wider border-b border-dashed border-zinc-800/60 pb-3 mb-6">
                  ARQUITECTURA GENERAL (5 CAPAS)
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[
                    { title: "01. Capa de Nodo", desc: "node_id, identidad criptográfica HMAC-SHA256, permisos dinámicos y capacidad sensorial perimetral (acústica, de fase y estado local)." },
                    { title: "02. Capa de Comunicación", desc: "UDP local para telemetría inicial de telemetría de fase, evolucionando hacia WebSockets, libp2p, protocolos gossip y tablas DHT." },
                    { title: "03. Capa de Validación", desc: "Perímetro Zero-Trust. Whitelisting de eventos, firmas obligatorias y control anti-replay con sesgo temporal máximo de 120s para prevenir ataques." },
                    { title: "04. Capa de Memoria", desc: "Data Lake distribuido basado en almacenamiento JSON Lines (earth_memory.jsonl), base inmutable para el cálculo del PoR y la gobernanza." },
                    { title: "05. Capa Visual", desc: "Observatorio topológico sinestésico que renderiza núcleos, esferas, tetraedros y vectores de coherencia en tiempo real en un canvas 2D." }
                  ].map((layer, i) => (
                    <div key={i} className="bg-white/[0.01] border border-zinc-800/80 p-6 rounded-xl hover:border-[#00E5FF]/40 transition-colors">
                      <h3 className="font-mono text-sm font-bold text-[#00E5FF] mb-3">{layer.title}</h3>
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
                <h2 className="text-xl font-bold text-[#00E5FF] font-mono uppercase tracking-wider border-b border-dashed border-zinc-800/60 pb-3 mb-6">
                  SALA DE AGENTES Y MOTORES MPE
                </h2>
                <p className="text-sm text-zinc-400">
                  Subsistemas autónomos que operan en segundo plano en el ecosistema para garantizar la consistencia, cálculo y visualización:
                </p>

                <div className="space-y-4 pt-2">
                  {[
                    { name: "MPE Research", desc: "Valida los límites epistémicos y la consistencia matemática de los estados globales analizados en red." },
                    { name: "MPE Engine & Tensores", desc: "Calcula los campos escalares topológicos mediante matrices Hessianas y puntos de silla para acoplar los nodos en red." },
                    { name: "QSIM Predictor", desc: "Motor estocástico basado en Cadenas de Markov V0 e Índice de Posibilidad (PI) para anticipar transiciones inestables." },
                    { name: "Brand Guardian (El Auditor)", desc: "Filtra la interfaz y los reportes para garantizar rigor técnico y estética minimalista de lujo futurista." }
                  ].map((agent, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl border border-zinc-900 bg-black/40">
                      <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] font-bold text-xs font-mono shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <strong className="block text-sm font-mono text-[#00E5FF] mb-1">{agent.name}</strong>
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
                <h2 className="text-xl font-bold text-[#00E5FF] font-mono uppercase tracking-wider border-b border-dashed border-zinc-800/60 pb-3 mb-6">
                  REGISTRO Y HANDSHAKE DE NODO
                </h2>
                <p className="text-sm text-zinc-400 max-w-xl">
                  Iniciá el protocolo de acoplamiento criptográfico para registrar y firmar tu nodo en la red QUBIT Earth:
                </p>

                <div className="max-w-md space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="block font-mono text-[10px] text-zinc-500 uppercase">Identificador de Nodo</label>
                    <input
                      type="text"
                      value={nodeName}
                      onChange={(e) => setNodeName(e.target.value)}
                      placeholder="Ej: nodo_buzios_01"
                      className="w-full bg-black border border-zinc-850 px-4 py-3 rounded-lg text-white font-mono text-sm placeholder-zinc-700 focus:outline-none focus:border-[#00E5FF] transition-colors"
                    />
                  </div>

                  <button
                    onClick={handleRegisterNode}
                    disabled={isRegistering}
                    className="w-full bg-[#00E5FF]/15 border border-[#00E5FF] hover:bg-[#00E5FF] hover:text-black text-[#00E5FF] font-mono text-xs py-3 rounded-lg font-bold tracking-wider transition-all duration-300 disabled:opacity-50"
                  >
                    {isRegistering ? "[ PROCESANDO HANDSHAKE VESICA... ]" : "[ INICIAR HANDSHAKE VESICA ]"}
                  </button>

                  {nodeResponse.length > 0 && (
                    <div className="bg-black border border-zinc-900 p-4 rounded-lg font-mono text-xs text-[#00E5FF] space-y-1.5">
                      {nodeResponse.map((res, i) => (
                        <div key={i}>{res}</div>
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

