"use client";

import { useEffect, useMemo, useState } from "react";

type Probe = {
  connected: boolean;
  mode: "remote-read-only" | "disconnected";
  checked_at: string;
  endpoint: string | null;
  state: unknown | null;
  error: string | null;
};

type Group = { label: string; keys: string[] };
type Props = { apiPath: string; organ: string; title: string; description: string; groups: Group[] };
type RecordValue = Record<string, unknown>;

function isRecord(value: unknown): value is RecordValue {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function scalar(value: unknown): string | null {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  return null;
}

function collection(state: RecordValue | null, keys: string[]) {
  if (!state) return [] as unknown[];
  for (const key of keys) {
    const value = state[key];
    if (Array.isArray(value)) return value;
    if (isRecord(value)) return Object.entries(value).map(([name, item]) => ({ name, value: item }));
  }
  return [] as unknown[];
}

function row(item: unknown, index: number) {
  if (!isRecord(item)) return { title: scalar(item) || `item ${index + 1}`, detail: "" };
  const title = scalar(item.title) || scalar(item.name) || scalar(item.id) || scalar(item.type) || scalar(item.status) || `item ${index + 1}`;
  const detail = scalar(item.timestamp) || scalar(item.created_at) || scalar(item.source) || scalar(item.path) || scalar(item.value) || scalar(item.score) || "";
  return { title, detail };
}

export default function MpeOrganSourceSurface({ apiPath, organ, title, description, groups }: Props) {
  const [probe, setProbe] = useState<Probe | null>(null);

  useEffect(() => {
    let cancelled = false;
    const read = async () => {
      try {
        const response = await fetch(apiPath, { cache: "no-store" });
        const next = (await response.json()) as Probe;
        if (!cancelled) setProbe(next);
      } catch {
        if (!cancelled) setProbe({ connected: false, mode: "disconnected", checked_at: new Date().toISOString(), endpoint: null, state: null, error: "Source probe unavailable" });
      }
    };
    void read();
    const timer = window.setInterval(read, 10000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [apiPath]);

  const state = isRecord(probe?.state) ? probe.state : null;
  const resolvedGroups = useMemo(() => groups.map((group) => ({ ...group, items: collection(state, group.keys) })), [groups, state]);
  const connected = probe?.connected === true;

  return (
    <section className="rounded-3xl border border-white/8 bg-white/[0.025] p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.22em] text-cyan-300/55">{organ} · READ ONLY</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/45">{description}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-[9px] tracking-[0.15em] ${connected ? "border-emerald-300/25 bg-emerald-300/8 text-emerald-200" : "border-amber-300/20 bg-amber-300/5 text-amber-200/70"}`}>
          {connected ? "CONNECTED" : "NOT CONNECTED"}
        </span>
      </div>

      {!connected ? (
        <div className="mt-6 rounded-2xl border border-amber-300/10 bg-amber-300/[0.025] p-4">
          <p className="text-sm text-white/55">No se muestra actividad simulada.</p>
          <p className="mt-2 text-xs leading-5 text-white/30">{probe?.error || "Esperando fuente real."}</p>
        </div>
      ) : null}

      {connected ? (
        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          {resolvedGroups.map((group) => (
            <div key={group.label} className="rounded-2xl border border-white/7 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs tracking-[0.12em] text-white/48">{group.label}</p>
                <span className="text-xs text-white/25">{group.items.length}</span>
              </div>
              <div className="mt-3 space-y-2">
                {group.items.slice(0, 8).map((item, index) => { const current = row(item, index); return (
                  <div key={`${current.title}-${index}`} className="rounded-xl border border-white/7 bg-black/10 p-3">
                    <p className="text-xs text-white/66">{current.title}</p>
                    {current.detail ? <p className="mt-1 truncate text-[10px] text-white/28">{current.detail}</p> : null}
                  </div>
                ); })}
                {!group.items.length ? <p className="text-xs leading-5 text-white/28">La fuente conectada no expone esta colección con un nombre reconocido todavía.</p> : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
