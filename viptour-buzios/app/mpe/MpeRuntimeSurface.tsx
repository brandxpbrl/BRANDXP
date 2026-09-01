"use client";

import { useEffect, useMemo, useState } from "react";

type RuntimeProbe = {
  connected: boolean;
  mode: "remote-read-only" | "disconnected";
  checked_at: string;
  endpoint: string | null;
  state: unknown | null;
  error: string | null;
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function scalar(value: unknown): string | null {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  return null;
}

function firstCollection(state: UnknownRecord | null, names: string[]): unknown[] {
  if (!state) return [];
  for (const name of names) {
    const value = state[name];
    if (Array.isArray(value)) return value;
    if (isRecord(value)) return Object.entries(value).map(([key, item]) => ({ key, value: item }));
  }
  return [];
}

function summarizeItem(item: unknown, index: number) {
  if (!isRecord(item)) return { id: String(index + 1), title: scalar(item) || `item ${index + 1}`, detail: "" };
  const id = scalar(item.id) || scalar(item.event_id) || scalar(item.artifact_id) || scalar(item.key) || String(index + 1);
  const title = scalar(item.type) || scalar(item.event_type) || scalar(item.name) || scalar(item.label) || scalar(item.status) || `item ${index + 1}`;
  const detail = scalar(item.timestamp) || scalar(item.created_at) || scalar(item.source) || scalar(item.path) || scalar(item.value) || "";
  return { id, title, detail };
}

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
        if (!cancelled) {
          setProbe({
            connected: false,
            mode: "disconnected",
            checked_at: new Date().toISOString(),
            endpoint: null,
            state: null,
            error: "Runtime probe unavailable",
          });
        }
      }
    };
    void read();
    const timer = window.setInterval(read, 10000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, []);

  const state = isRecord(probe?.state) ? probe.state : null;
  const events = useMemo(() => firstCollection(state, ["recent_events", "events", "event_log", "kernel_events"]), [state]);
  const artifacts = useMemo(() => firstCollection(state, ["recent_artifacts", "artifacts", "outputs", "generated_artifacts"]), [state]);
  const services = useMemo(() => firstCollection(state, ["services", "service_health", "registry", "nodes"]), [state]);
  const scalarState = useMemo(() => {
    if (!state) return [] as [string, string][];
    return Object.entries(state)
      .map(([key, value]) => [key, scalar(value)] as const)
      .filter((entry): entry is [string, string] => entry[1] !== null)
      .slice(0, 8);
  }, [state]);

  const connected = probe?.connected === true;

  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      <section className="rounded-2xl border border-white/8 bg-white/[0.025] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.22em] text-cyan-300/55">SYSTEM / EARTH</p>
            <h3 className="mt-2 text-lg font-medium">Runtime state</h3>
          </div>
          <span className={`rounded-full border px-2.5 py-1 text-[9px] tracking-[0.14em] ${connected ? "border-emerald-300/25 bg-emerald-300/8 text-emerald-200" : "border-amber-300/20 bg-amber-300/5 text-amber-200/70"}`}>
            {connected ? "LIVE · READ ONLY" : "NOT CONNECTED"}
          </span>
        </div>

        {!probe ? <p className="mt-5 text-sm text-white/40">Comprobando FaseOS / Earth…</p> : null}
        {probe && !connected ? (
          <div className="mt-5 rounded-xl border border-amber-300/10 bg-amber-300/[0.025] p-4">
            <p className="text-sm text-white/55">No se presenta actividad simulada.</p>
            <p className="mt-2 text-xs leading-5 text-white/30">{probe.error || "Runtime unavailable"}</p>
          </div>
        ) : null}

        {connected ? (
          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-white/7 p-3"><p className="text-white/30">SERVICES EXPOSED</p><p className="mt-1 text-xl text-white/80">{services.length}</p></div>
              <div className="rounded-xl border border-white/7 p-3"><p className="text-white/30">STATE KEYS</p><p className="mt-1 text-xl text-white/80">{state ? Object.keys(state).length : 0}</p></div>
            </div>
            {scalarState.length ? (
              <dl className="space-y-2 border-t border-white/7 pt-4">
                {scalarState.map(([key, value]) => <div key={key} className="flex justify-between gap-4 text-xs"><dt className="text-white/35">{key}</dt><dd className="max-w-[60%] truncate text-right text-white/60">{value}</dd></div>)}
              </dl>
            ) : <p className="text-xs text-white/30">El endpoint está conectado pero no expone campos escalares en la raíz.</p>}
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-white/8 bg-white/[0.025] p-5">
        <p className="text-[10px] tracking-[0.22em] text-fuchsia-300/55">EVENTS / ARTIFACTS</p>
        <h3 className="mt-2 text-lg font-medium">Actividad trazable reciente</h3>
        {!connected ? <p className="mt-5 text-sm leading-6 text-white/38">Esperando una fuente runtime real. Esta superficie permanecerá vacía hasta recibir eventos o artefactos del endpoint.</p> : null}
        {connected ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <div className="flex items-center justify-between"><p className="text-xs tracking-[0.12em] text-white/45">EVENTS</p><span className="text-xs text-white/25">{events.length}</span></div>
              <div className="mt-3 space-y-2">
                {events.slice(0, 5).map((item, index) => { const row = summarizeItem(item, index); return <div key={`${row.id}-${index}`} className="rounded-xl border border-white/7 p-3"><p className="text-xs text-white/65">{row.title}</p>{row.detail ? <p className="mt-1 truncate text-[10px] text-white/28">{row.detail}</p> : null}</div>; })}
                {!events.length ? <p className="text-xs leading-5 text-white/28">El runtime conectado no expone una colección de eventos reconocible todavía.</p> : null}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between"><p className="text-xs tracking-[0.12em] text-white/45">ARTIFACTS</p><span className="text-xs text-white/25">{artifacts.length}</span></div>
              <div className="mt-3 space-y-2">
                {artifacts.slice(0, 5).map((item, index) => { const row = summarizeItem(item, index); return <div key={`${row.id}-${index}`} className="rounded-xl border border-white/7 p-3"><p className="text-xs text-white/65">{row.title}</p>{row.detail ? <p className="mt-1 truncate text-[10px] text-white/28">{row.detail}</p> : null}</div>; })}
                {!artifacts.length ? <p className="text-xs leading-5 text-white/28">El runtime conectado no expone una colección de artefactos reconocible todavía.</p> : null}
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
