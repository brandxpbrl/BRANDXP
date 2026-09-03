"use client";

import { useMemo, useState } from "react";
import MpeInterfaceFrame from "../MpeInterfaceFrame";
import { createState, generateStructuralCandidates } from "../possibility-engine/engine";
import type { Possibility } from "../possibility-engine/model";

const split = (value: string) => value.split(";").map((item) => item.trim()).filter(Boolean);

const viabilityLabel = (status: string) => {
  if (status === "high") return "HIGH";
  if (status === "medium") return "MEDIUM";
  if (status === "low") return "LOW";
  return "UNKNOWN";
};

function PossibilityCard({ possibility }: { possibility: Possibility }) {
  return (
    <article className="rounded-2xl border border-white/[0.08] bg-[#07101b]/55 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[9px] tracking-[0.16em] text-cyan-200/45">{possibility.id}</p>
          <h3 className="mt-1 text-sm font-medium text-white/85">{possibility.title}</h3>
        </div>
        <span className="rounded-lg border border-fuchsia-300/15 px-2 py-1 text-[8px] tracking-[0.12em] text-fuchsia-100/65">
          {possibility.epistemicStatus.toUpperCase()}
        </span>
      </div>
      <p className="mt-3 text-[11px] leading-5 text-white/42">{possibility.description}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {possibility.viability.map((dimension) => (
          <div key={dimension.id} className="rounded-xl border border-white/[0.06] bg-black/15 px-3 py-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[9px] tracking-[0.08em] text-white/38">{dimension.id}</span>
              <span className="text-[8px] tracking-[0.1em] text-cyan-100/55">{viabilityLabel(dimension.status)}</span>
            </div>
            <p className="mt-1 text-[9px] leading-4 text-white/28">{dimension.rationale}</p>
          </div>
        ))}
      </div>
      {possibility.experiment ? (
        <div className="mt-4 rounded-xl border border-cyan-300/10 bg-cyan-300/[0.025] p-3">
          <p className="text-[9px] tracking-[0.14em] text-cyan-200/55">MINIMUM EXPERIMENT</p>
          <p className="mt-2 text-[10px] leading-5 text-white/45">{possibility.experiment.action}</p>
        </div>
      ) : null}
    </article>
  );
}

export default function MpePossibilitySurface() {
  const [objective, setObjective] = useState("");
  const [resources, setResources] = useState("");
  const [constraints, setConstraints] = useState("");
  const [pressures, setPressures] = useState("");
  const [opportunities, setOpportunities] = useState("");
  const [unknowns, setUnknowns] = useState("");
  const [started, setStarted] = useState(false);

  const state = useMemo(
    () =>
      createState({
        objective,
        resources: split(resources),
        constraints: split(constraints),
        pressures: split(pressures),
        opportunities: split(opportunities),
        unknowns: split(unknowns),
      }),
    [objective, resources, constraints, pressures, opportunities, unknowns]
  );

  const possibilities = useMemo(() => (started ? generateStructuralCandidates(state) : []), [started, state]);

  return (
    <MpeInterfaceFrame active="ALIVE">
      <main className="px-4 py-5 sm:px-6">
        <section className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#07101b]/60 px-5 py-8 sm:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,.12),transparent_35%),radial-gradient(circle_at_85%_30%,rgba(217,70,239,.08),transparent_30%)]" />
          <div className="relative grid gap-7 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <p className="text-[9px] tracking-[0.22em] text-cyan-200/45">MPE-PE-001 · POSSIBILITY ENGINE V0.1</p>
              <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">Explorar antes de elegir.</h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/42">
                Esta primera versión no predice éxito y no afirma exhaustividad. Convierte un estado declarado en candidatos estructurales trazables para después someterlos a evidencia, perturbaciones y experimentos.
              </p>
            </div>
            <div className="grid gap-2">
              <div className="rounded-xl border border-white/[0.07] bg-black/15 px-4 py-3"><p className="text-[9px] text-white/30">EXHAUSTIVE CLAIM</p><p className="mt-1 text-sm text-white/70">FORBIDDEN</p></div>
              <div className="rounded-xl border border-white/[0.07] bg-black/15 px-4 py-3"><p className="text-[9px] text-white/30">GENERATED</p><p className="mt-1 text-sm text-white/70">≠ EVIDENCE</p></div>
              <div className="rounded-xl border border-white/[0.07] bg-black/15 px-4 py-3"><p className="text-[9px] text-white/30">PROBABILITY</p><p className="mt-1 text-sm text-white/70">REQUIRES CALIBRATION</p></div>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className="rounded-2xl border border-white/[0.07] bg-[#07101b]/45 p-5">
            <p className="text-[9px] tracking-[0.2em] text-fuchsia-200/45">CURRENT STATE</p>
            <h2 className="mt-1 text-xl font-semibold">Definí el problema</h2>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-[10px] text-white/45">Objetivo<textarea value={objective} onChange={(e) => { setObjective(e.target.value); setStarted(false); }} className="min-h-24 rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/25" placeholder="Ej: crear una nueva fuente de ingresos sin comprometer todo mi capital" /></label>
              {[
                ["Recursos", resources, setResources, "capital; experiencia; contactos; tiempo"],
                ["Restricciones", constraints, setConstraints, "presupuesto limitado; horario; ubicación"],
                ["Presiones", pressures, setPressures, "necesidad de ingresos; competencia; plazo"],
                ["Oportunidades observadas", opportunities, setOpportunities, "demanda; capacidad ociosa; nueva tecnología"],
                ["Desconocidos", unknowns, setUnknowns, "demanda real; costo de adquisición; conversión"],
              ].map(([label, value, setter, placeholder]) => (
                <label key={label as string} className="grid gap-2 text-[10px] text-white/45">{label as string}<input value={value as string} onChange={(e) => { (setter as (value: string) => void)(e.target.value); setStarted(false); }} className="rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-xs text-white outline-none focus:border-cyan-300/25" placeholder={placeholder as string} /></label>
              ))}
            </div>
            <button disabled={!objective.trim()} onClick={() => setStarted(true)} className="mt-5 w-full rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-3 text-xs font-medium text-cyan-50 disabled:cursor-not-allowed disabled:opacity-30">GENERAR CANDIDATOS ESTRUCTURALES</button>
            <p className="mt-3 text-[9px] leading-4 text-white/25">Separá elementos con punto y coma. En V0.1 estos datos se consideran DECLARED, no observados.</p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#07101b]/45 p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div><p className="text-[9px] tracking-[0.2em] text-cyan-200/45">POSSIBILITY SPACE</p><h2 className="mt-1 text-xl font-semibold">Candidatos descubiertos</h2></div>
              <span className="text-[9px] tracking-[0.12em] text-white/30">{possibilities.length} CURRENT CANDIDATES</span>
            </div>
            {!started ? (
              <div className="mt-5 grid min-h-72 place-items-center rounded-2xl border border-dashed border-white/[0.07] bg-black/10 p-8 text-center"><div><p className="text-sm text-white/48">Todavía no existe un espacio de posibilidades.</p><p className="mt-2 text-[10px] leading-5 text-white/28">Primero declaramos el estado. Luego MPE aplica operadores explícitos; no inventa probabilidades.</p></div></div>
            ) : (
              <div className="mt-5 grid gap-3 lg:grid-cols-2">{possibilities.map((possibility) => <PossibilityCard key={possibility.id} possibility={possibility} />)}</div>
            )}
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-fuchsia-300/10 bg-[#07101b]/45 p-5">
          <p className="text-[9px] tracking-[0.2em] text-fuchsia-200/45">NEXT COMPUTATIONAL LAYER</p>
          <div className="mt-3 flex flex-wrap gap-2 text-[9px] text-white/45">
            {['STATE','OPERATORS Δ','POSSIBILITY GRAPH','PRESSURE','PERTURBATION','EXPERIMENT','LEDGER','EPISTEMIC UPDATE','MEMORY / HERITAGE'].map((item, index) => <span key={item} className="rounded-lg border border-white/10 px-2 py-1">{String(index + 1).padStart(2,'0')} · {item}</span>)}
          </div>
        </section>
      </main>
    </MpeInterfaceFrame>
  );
}
