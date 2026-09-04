"use client";

import type { PossibilityGraph } from "../possibility-engine/model";
import type { GraphPerturbationResult } from "../possibility-engine/perturbation-engine";
import type { ScenarioPersistenceReport } from "../possibility-engine/scenario-persistence";
import { comparePerturbationBoundary } from "../possibility-engine/perturbation-comparison";

const label = (value: string) => value.replaceAll("_", " ").replace("region:", "").toUpperCase();

export default function MpePerturbationBoundaryPanel({ beforeGraph, perturbed, beforePersistence, afterPersistence }: { beforeGraph: PossibilityGraph | null; perturbed: GraphPerturbationResult | null; beforePersistence: ScenarioPersistenceReport | null; afterPersistence: ScenarioPersistenceReport | null }) {
  if (!beforeGraph || !perturbed) return null;
  const comparison = comparePerturbationBoundary(beforeGraph, perturbed, beforePersistence, afterPersistence);
  const changed = comparison.transitions.filter((transition) => transition.interpretation !== "unchanged");
  return <section className="mt-4 rounded-[28px] border border-orange-300/[.10] bg-[#080504]/70 p-5">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[9px] tracking-[.2em] text-orange-100/55">PERTURBATION BOUNDARY · PRE / POST</p><h2 className="mt-1 text-lg font-light text-white/78">¿Qué sigue siendo posible después de Δ?</h2><p className="mt-2 max-w-2xl text-[10px] leading-5 text-white/34">Comparación estructural del Morphospace antes y después de la perturbación. Un cambio de frontera no implica probabilidad, causalidad ni evidencia científica.</p></div><span className="rounded-full border border-orange-300/15 px-3 py-1 text-[8px] tracking-[.1em] text-orange-100/45">{changed.length} REGIONES CAMBIADAS</span></div>
    <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">{comparison.transitions.map((transition)=><div key={transition.regionId} className={`rounded-2xl border p-4 ${transition.interpretation==="unchanged"?"border-white/[.05] bg-black/15":"border-orange-300/15 bg-orange-300/[.025]"}`}><div className="flex items-center justify-between gap-3"><p className="text-[9px] tracking-[.12em] text-white/45">{label(transition.regionId)}</p><span className="text-[8px] tracking-[.1em] text-orange-100/45">{label(transition.interpretation)}</span></div><div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-[9px]"><div className="rounded-xl border border-white/[.05] bg-black/20 px-3 py-2 text-white/35"><p className="text-[7px] tracking-[.12em] text-white/18">PRE</p><p className="mt-1">{label(transition.before)}</p></div><span className="text-white/18">→</span><div className="rounded-xl border border-white/[.05] bg-black/20 px-3 py-2 text-white/45"><p className="text-[7px] tracking-[.12em] text-white/18">POST</p><p className="mt-1">{label(transition.after)}</p></div></div><p className="mt-3 text-[8px] leading-4 text-white/24">{transition.affectedPossibilityIds.length?`${transition.affectedPossibilityIds.length} ramas tocadas por dependencias explícitas.`:"Sin dependencias explícitas tocadas en esta región."}</p></div>)}</div>
    <div className="mt-4 border-t border-white/[.05] pt-3 text-[8px] tracking-[.1em] text-white/20">PERTURBATION COMPARISON = STRUCTURAL OBSERVATION · NOT PROBABILITY · NOT CAUSAL PROOF</div>
  </section>;
}
