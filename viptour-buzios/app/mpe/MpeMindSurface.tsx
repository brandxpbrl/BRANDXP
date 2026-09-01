"use client";

import { useEffect, useMemo, useState } from "react";

type MindProbe = {
  connected: boolean;
  mode: "remote-read-only" | "disconnected";
  checked_at: string;
  endpoint: string | null;
  snapshot: unknown | null;
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

function collection(snapshot: UnknownRecord | null, names: string[]): unknown[] {
  if (!snapshot) return [];
  for (const name of names) {
    const value = snapshot[name];
    if (Array.isArray(value)) return value;
    if (isRecord(value)) return Object.entries(value).map(([key, item]) => ({ key, value: item }));
  }
  return [];
}

function summarize(item: unknown, index: number) {
  if (!isRecord(item)) return { id: String(index + 1), title: scalar(item) || `item ${index + 1}`, status: "" };
  const id = scalar(item.id) || scalar(item.hypothesis_id) || scalar(item.discovery_id) || scalar(item.key) || String(index + 1);
  const title = scalar(item.text) || scalar(item.statement) || scalar(item.title) || scalar(item.name) || `item ${index + 1}`;
  const status = scalar(item.epistemic_status) || scalar(item.status) || scalar(item.classification) || "";
  return { id, title, status };
}

export default function MpeMindSurface() {
  const [probe, setProbe] = useState<MindProbe | null>(null);

  useEffect(() => {
    let cancelled = false;
    const read = async () => {
      try {
        const response = await fetch("/api/mpe/mind", { cache: "no-store" });
        const next = (await response.json()) as MindProbe;
        if (!cancelled) setProbe(next);
      } catch {
        if (!cancelled) setProbe({ connected: false, mode: "disconnected", checked_at: new Date().toISOString(), endpoint: null, snapshot: null, error: "MPE Mind probe unavailable" });
      }
    };
    void read();
    const timer = window.setInterval(read, 12000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, []);

  const snapshot = isRecord(probe?.snapshot) ? probe.snapshot : null;
  const hypotheses = useMemo(() => collection(snapshot, ["hypotheses", "candidates", "hypothesis_candidates", "ranked_hypotheses"]), [snapshot]);
  const discoveries = useMemo(() => collection(snapshot, ["discoveries", "discovery_candidates", "findings"]), [snapshot]);
  const memory = useMemo(() => collection(snapshot, ["memory", "remembered", "working_memory", "useful_memory"]), [snapshot]);
  const connected = probe?.connected === true;

  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-3">
      <section className="rounded-2xl border border-white/8 bg-white/[0.025] p-5 lg:col-span-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.22em] text-cyan-300/55">MIND GATEWAY</p>
            <h2 className="mt-2 text-xl font-medium">Scientific MPE Core · read only</h2>
          </div>
          <span className={`rounded-full border px-3 py-1 text-[9px] tracking-[0.14em] ${connected ? "border-emerald-300/25 bg-emerald-300/8 text-emerald-200" : "border-amber-300/20 bg-amber-300/5 text-amber-200/70"}`}>
            {connected ? "CONNECTED" : "NOT CONNECTED"}
          </span>
        </div>
        {!probe ? <p className="mt-4 text-sm text-white/40">Comprobando MPE Core…</p> : null}
        {probe && !connected ? (
          <div className="mt-4 rounded-xl border border-amber-300/10 bg-amber-300/[0.025] p-4">
            <p className="text-sm text-white/55">MIND permanece vacío hasta conectar una fuente real.</p>
            <p className="mt-2 text-xs leading-5 text-white/30">{probe.error}</p>
          </div>
        ) : null}
        {connected && probe?.endpoint ? <p className="mt-4 break-all text-[11px] text-white/25">SOURCE · {probe.endpoint}</p> : null}
      </section>

      {[{ label: "HYPOTHESES", items: hypotheses }, { label: "DISCOVERY CANDIDATES", items: discoveries }, { label: "WORKING MEMORY", items: memory }].map((group) => (
        <section key={group.label} className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between gap-3"><p className="text-[10px] tracking-[0.18em] text-white/45">{group.label}</p><span className="text-xs text-white/25">{group.items.length}</span></div>
          <div className="mt-4 space-y-2">
            {group.items.slice(0, 6).map((item, index) => { const row = summarize(item, index); return <div key={`${row.id}-${index}`} className="rounded-xl border border-white/7 p-3"><p className="text-xs leading-5 text-white/65">{row.title}</p>{row.status ? <p className="mt-1 text-[9px] tracking-[0.12em] text-cyan-200/35">{row.status}</p> : null}</div>; })}
            {connected && !group.items.length ? <p className="text-xs leading-5 text-white/28">La fuente conectada no expone esta colección con un nombre reconocido todavía.</p> : null}
            {!connected ? <p className="text-xs leading-5 text-white/25">Sin datos simulados.</p> : null}
          </div>
        </section>
      ))}
    </div>
  );
}
