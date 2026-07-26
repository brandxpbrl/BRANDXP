"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Cpu, ShieldAlert, Key, Database, Eye, Activity, Award, Landmark, RefreshCw } from "lucide-react";

export default function QubitManifestoPage() {
  const [activeTab, setActiveTab] = useState<"manifesto" | "simulator">("manifesto");

  const layers = [
    {
      icon: Key,
      title: "1. Capa de Nodo",
      desc: "Identidad criptográfica única (node_id) con firma digital, niveles de permiso y reputación evolutiva.",
    },
    {
      icon: Activity,
      title: "2. Capa de Comunicación",
      desc: "Red distribuida P2P mediante protocolos de fase UDP y API híbrida para transmisión de estados en tiempo real.",
    },
    {
      icon: ShieldAlert,
      title: "3. Capa de Validación",
      desc: "Filtro criptográfico estricto que audita formato, firma, timestamp y límites de seguridad antes de aceptar señales.",
    },
    {
      icon: Database,
      title: "4. Capa de Memoria",
      desc: "Registro inmutable de eventos territoriales y reputación colectiva que sirve de base para el Proof of Resonance (PoR).",
    },
    {
      icon: Eye,
      title: "5. Capa Visual",
      desc: "Representación tridimensional del metaverso mediante esferas de génesis, tetraedros de fase y geometría sagrada de nodos.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#030306] text-white pt-24 pb-16 relative overflow-hidden">
      {/* Background Cyber Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-radial from-[#10b981]/10 via-transparent to-transparent blur-[120px] opacity-75" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-radial from-[#00f2fe]/5 to-transparent blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.012]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Back Link & Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Volver al inicio</span>
          </Link>

          {/* Toggle Tabs */}
          <div className="flex bg-[#0b0c14] border border-zinc-800 p-1.5 rounded-xl backdrop-blur-xl">
            <button
              onClick={() => setActiveTab("manifesto")}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                activeTab === "manifesto"
                  ? "bg-[#10b981] text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Manifiesto QUBIT
            </button>
            <button
              onClick={() => setActiveTab("simulator")}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                activeTab === "simulator"
                  ? "bg-[#10b981] text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Simulador en Vivo
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "manifesto" ? (
            <motion.div
              key="manifesto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Hero header */}
              <header className="mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] mb-4">
                  <Cpu className="w-4 h-4" />
                  <span className="text-xs font-mono tracking-widest uppercase">AI & Meta-Nodes Protocol</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 bg-gradient-to-r from-emerald-100 via-teal-300 to-cyan-500 bg-clip-text text-transparent">
                  QUBIT ENGINE
                </h1>
                <p className="text-xl md:text-2xl text-zinc-300 font-medium max-w-3xl leading-relaxed">
                  El Metaverso Vivo de la Tierra Generado por Nodos Distribuidos
                </p>
              </header>

              {/* Core Thesis Card */}
              <section className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#0b0c14]/90 to-[#05050a]/90 border border-emerald-500/20 shadow-2xl mb-16 backdrop-blur-2xl overflow-hidden group">
                <div className="absolute -right-24 -top-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-700" />
                <blockquote className="text-xl md:text-3xl font-light italic leading-relaxed text-zinc-100 max-w-4xl">
                  “Si los datos humanos construyen el mundo digital, las personas deben gobernar ese mundo y participar de su valor proporcional.”
                </blockquote>
                <div className="mt-8 flex items-center gap-4 text-xs font-mono text-zinc-500">
                  <span>HISTÓRICO INTERNO: FASEOS</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  <span>WHITEPAPER V0.1</span>
                </div>
              </section>

              {/* Grid 5 Layers */}
              <section className="mb-16">
                <h2 className="text-2xl font-bold text-emerald-400 mb-8 tracking-wider uppercase font-mono">
                  Arquitectura del Metasistema (5 Capas)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {layers.map((layer, idx) => {
                    const Icon = layer.icon;
                    return (
                      <div
                        key={idx}
                        className="bg-[#0b0c14]/50 border border-zinc-800/80 p-6 rounded-2xl hover:border-emerald-500/40 transition-all duration-300"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-100 mb-3">{layer.title}</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed">{layer.desc}</p>
                      </div>
                    );
                  })}

                  {/* Highlighted Proof of Resonance Card */}
                  <div className="bg-gradient-to-br from-emerald-950/20 to-teal-950/20 border border-emerald-500/30 p-6 rounded-2xl md:col-span-2 lg:col-span-1">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 mb-6">
                      <Award className="w-5 h-5 animate-pulse" />
                    </div>
                    <h3 className="text-lg font-bold text-emerald-300 mb-3">Proof of Resonance (PoR)</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      Mecanismo de validación que recompensa aportes territoriales coherentes, no redundantes y verificados por otros nodos. La contribución se traduce en unidades <code className="text-emerald-400">DELTA_test</code>.
                    </p>
                  </div>
                </div>
              </section>

              {/* Mechanics & Tokenomics */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                <div className="p-8 rounded-3xl bg-[#0b0c14]/30 border border-zinc-800/50 backdrop-blur-xl">
                  <Landmark className="w-8 h-8 text-emerald-400 mb-6" />
                  <h3 className="text-xl font-bold text-zinc-100 mb-4">Gobernanza Cívica Territorial</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    A diferencia del modelo corporativo centralizado, QUBIT propone una estructura cívica donde la reputación de cada nodo le confiere poder de decisión territorial. Desde Nodos Activos hasta Gobernadores de Zona, la autoridad emerge del valor aportado a la memoria del sistema.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                    <span>Poder Cívico = f(DELTA, Reputación, PoR)</span>
                  </div>
                </div>

                <div className="p-8 rounded-3xl bg-[#0b0c14]/30 border border-zinc-800/50 backdrop-blur-xl">
                  <Cpu className="w-8 h-8 text-emerald-400 mb-6" />
                  <h3 className="text-xl font-bold text-zinc-100 mb-4">Emisión de Recompensas DELTA</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    Se propone una reserva total fija de 432 millones de tokens DELTA, distribuidos de forma estricta según el PoR. Durante el prototipo actual de laboratorio, los tokens DELTA operan en fase experimental de prueba como reputación criptográfica simulada sin valor financiero.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                    <span>Supply Max: 432,000,000 DELTA</span>
                  </div>
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="simulator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full h-[75vh] rounded-3xl overflow-hidden border border-emerald-500/20 bg-black/60 shadow-2xl relative"
            >
              {/* Iframe Loading Banner */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 border border-zinc-800 text-zinc-400 text-xs">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                <span>Simulando Red Local de Nodos</span>
              </div>

              <iframe
                src="/qubit/index.html"
                className="w-full h-full border-none"
                title="QUBIT Engine Simulator"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
