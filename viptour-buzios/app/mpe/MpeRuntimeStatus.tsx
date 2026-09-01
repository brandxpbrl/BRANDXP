"use client";

import { useEffect, useState } from "react";

type Probe = {
  connected: boolean;
  mode: "remote-read-only" | "disconnected";
  checked_at: string;
  endpoint: string | null;
  error: string | null;
};

export default function MpeRuntimeStatus() {
  const [probe, setProbe] = useState<Probe | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const response = await fetch("/api/mpe/runtime", { cache: "no-store" });
        const data = (await response.json()) as Probe;
        if (!cancelled) setProbe(data);
      } catch {
        if (!cancelled) setProbe({ connected: false, mode: "disconnected", checked_at: new Date().toISOString(), endpoint: null, error: "Runtime probe unavailable" });
      }
    };
    run();
    const timer = window.setInterval(run, 15000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, []);

  const connected = probe?.connected === true;

  return (
    <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] tracking-[0.2em] text-white/35">LIVE RUNTIME</p>
          <p className="mt-1 text-sm text-white/70">{probe ? (connected ? "FaseOS / Earth conectado" : "Runtime todavía desconectado") : "Comprobando runtime…"}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-[9px] tracking-[0.16em] ${connected ? "border-emerald-300/25 bg-emerald-300/8 text-emerald-200" : "border-amber-300/20 bg-amber-300/5 text-amber-200/70"}`}>
          {connected ? "CONNECTED · READ ONLY" : "DISCONNECTED"}
        </span>
      </div>
      {probe?.endpoint ? <p className="mt-3 break-all text-[11px] text-white/30">{probe.endpoint}</p> : null}
      {!connected && probe?.error ? <p className="mt-2 text-[11px] text-white/25">{probe.error}</p> : null}
    </div>
  );
}
