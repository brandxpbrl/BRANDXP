"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type RuntimeEvent = { id: string; timestamp: string | null; type: string; source: string; subject: string | null };
export type RuntimeArtifact = { id: string; name: string; type: string; producer: string | null; source_ref: string | null; path: string | null };
export type RuntimeProbe = {
  connected: boolean;
  mode: "remote-read-only" | "disconnected";
  checked_at: string;
  endpoint: string | null;
  state: unknown | null;
  normalized?: { services: unknown[]; events: RuntimeEvent[]; artifacts: RuntimeArtifact[] };
  error: string | null;
};

type RuntimeContextValue = { probe: RuntimeProbe | null };
const RuntimeContext = createContext<RuntimeContextValue>({ probe: null });

export function MpeRuntimeProvider({ children }: { children: ReactNode }) {
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
  return <RuntimeContext.Provider value={{ probe }}>{children}</RuntimeContext.Provider>;
}

export function useMpeRuntime() { return useContext(RuntimeContext); }
