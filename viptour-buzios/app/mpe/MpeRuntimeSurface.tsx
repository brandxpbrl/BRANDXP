"use client";

import { useEffect, useMemo, useState } from "react";

type RuntimeEvent = { id: string; timestamp: string | null; type: string; source: string; subject: string | null };
type RuntimeArtifact = { id: string; name: string; type: string; producer: string | null; source_ref: string | null; path: string | null };
type RuntimeProbe = {
  connected: boolean;
  mode: "remote-read-only" | "disconnected";
  checked_at: string;
  endpoint: string | null;
  state: unknown | null;
  normalized?: { services: unknown[]; events: RuntimeEvent[]; artifacts: RuntimeArtifact[] };
  error: string | null;
};

type UnknownRecord = Record<string, unknown>;
function isRecord(value: unknown): value is UnknownRecord { return typeof value === "object" && value !== null && !Array.isArray(value); }
function scalar(value: unknown): string | null { return typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? String(value) : null; }

export default function MpeRuntimeSurface() {
  const [probe, setProbe] = useState<RuntimeProbe | null>(null);

  useEffect(() => {
    let cancelled = false;
    const read = async () => {
      try {
        const response = await fetch("/api/mpe/runtime", { cache: "no-store" });
        const next = (await response.json()) as RuntimeProbe;
        if (!cancelled) setProbe(next);
      } catch {
        if (!cancelled) setProbe({ connected: false, mode: "disconnected", checked_at: new Date().toISOString(), endpoint: null, state: null, normalized: { services: [], events: [], artifacts: [] }, error: "Runtime probe unavailable" });
      }
    };
    void read();
    const timer = window.setInterval(read, 10000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, []);

  const state = isRecord(probe?.state) ? probe.state : null;
  const normalized = probe?.normalized || { services: [], events: [], artifacts: [] };
  const scalarState = useMemo(() => {
    if (!state) return [] as Array<[string, string]>;
    const rows: Array<[string, string]> = [];
    for (const [key, value] of Object.entries(state)) {
      const rendered = scalar(value);
      if (rendered !== null) rows.push([key, rendered]);
      if (rows.length >= 8) break;
    }
    return rows;
  }, [state]);
  const connected = probe?.connected === true;

  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      <section className="rounded-2xl border border-white/8 bg-white/[0.025] p-5">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-[10px] tracking-[0.22em] text-cyan-300/55">SYSTEM / EARTH</p><h3 className="mt-2 text-lg font-medium">Runtime state</h3></div>
          <span className={`rounded-full border px-2.5 py-1 text-[9px] tracking-[0.14em] ${connected ? "border-emerald-300/25 bg-emerald-300/8 text-emerald-200" : "border-amber-300/20 bg-amber-300/5 text-amber-200/70"}`}>{connected ? "LIVE · READ ONLY" : "NOT CONNECTED"}</span>
        </div>
        {!probe ? <p className="mt-5 text-sm text-white/40">Comprobando FaseOS / Earth…</p> : null}
        {probe && !connected ? <div className="mt-5 rounded-xl border border-amber-300/10 bg-amber-300/[0.025] p-4"><p className="text-sm text-white/55">No se presenta actividad simulada.</p><p className="mt-2 text-xs leading-5 text-white/30">{probe.error || "Runtime unavailable"}</p></div> : null}
        {connected ? <div className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs"><div className="rounded-xl border border-white/7 p-3"><p className="text-white/30">SERVICES EXPOSED</p><p className="mt-1 text-xl text-white/80">{normalized.services.length}</p></div><div className="rounded-xl border border-white/7 p-3"><p className="text-white/30">STATE KEYS</p><p className="mt-1 text-xl text-white/80">{state ? Object.keys(state).length : 0}</p></div></div>
          {scalarState.length ? <dl className="space-y-2 border-t border-white/7 pt-4">{scalarState.map(([key, value]) => <div key={key} className="flex justify-between gap-4 text-xs"><dt className="text-white/35">{key}</dt><dd className="max-w-[60%] truncate text-right text-white/60">{value}</dd></div>)}</dl> : <p className="text-xs text-white/30">El endpoint está conectado pero no expone campos escalares en la raíz.</p>}
        </div> : null}
      </section>

      <section className="rounded-2xl border border-white/8 bg-white/[0.025] p-5">
        <p className="text-[10px] tracking-[0.22em] text-fuchsia-300/55">EVENT → ARTIFACT LINEAGE</p><h3 className="mt-2 text-lg font-medium">Primer latido trazable</h3>
        {!connected ? <p className="mt-5 text-sm leading-6 text-white/38">Esperando una fuente runtime real. La cadena permanece vacía hasta recibir eventos o artefactos reales.</p> : null}
        {connected ? <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div><div className="flex items-center justify-between"><p className="text-xs tracking-[0.12em] text-white/45">EVENTS</p><span className="text-xs text-white/25">{normalized.events.length}</span></div><div className="mt-3 space-y-2">{normalized.events.slice(0, 5).map((event) => <div key={event.id} className="rounded-xl border border-white/7 p-3"><p className="text-xs text-white/65">{event.type}</p><p className="mt-1 truncate text-[10px] text-white/30">{event.source}{event.timestamp ? ` · ${event.timestamp}` : ""}</p>{event.subject ? <p className="mt-1 truncate text-[10px] text-cyan-200/35">subject: {event.subject}</p> : null}</div>)}{!normalized.events.length ? <p className="text-xs leading-5 text-white/28">No hay colección de eventos reconocible todavía.</p> : null}</div></div>
          <div><div className="flex items-center justify-between"><p className="text-xs tracking-[0.12em] text-white/45">ARTIFACTS</p><span className="text-xs text-white/25">{normalized.artifacts.length}</span></div><div className="mt-3 space-y-2">{normalized.artifacts.slice(0, 5).map((artifact) => <div key={artifact.id} className="rounded-xl border border-white/7 p-3"><p className="text-xs text-white/65">{artifact.name}</p><p className="mt-1 truncate text-[10px] text-white/30">{artifact.type}{artifact.producer ? ` · ${artifact.producer}` : ""}</p>{artifact.source_ref ? <p className="mt-1 truncate text-[10px] text-fuchsia-200/40">source: {artifact.source_ref}</p> : <p className="mt-1 text-[10px] text-amber-200/35">source lineage not exposed</p>}</div>)}{!normalized.artifacts.length ? <p className="text-xs leading-5 text-white/28">No hay colección de artefactos reconocible todavía.</p> : null}</div></div>
        </div> : null}
      </section>
    </div>
  );
}
