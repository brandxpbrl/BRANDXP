"use client";

import { useEffect, useMemo, useState } from "react";

type RuntimeEvent = {
  id: string;
  timestamp: string | null;
  type: string;
  source: string;
  subject: string | null;
};

type RuntimeArtifact = {
  id: string;
  name: string;
  type: string;
  producer: string | null;
  source_ref: string | null;
  path: string | null;
};

type RuntimeProbe = {
  connected?: boolean;
  normalized?: {
    events?: RuntimeEvent[];
    artifacts?: RuntimeArtifact[];
  };
};

type LineageState = "COMPLETE" | "PARTIAL" | "UNLINKED";

function lineageState(artifact: RuntimeArtifact, event: RuntimeEvent | undefined): LineageState {
  if (artifact.source_ref && event) return "COMPLETE";
  if (artifact.source_ref || artifact.producer) return "PARTIAL";
  return "UNLINKED";
}

export default function MpeEvidenceSurface() {
  const [probe, setProbe] = useState<RuntimeProbe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch("/api/mpe/runtime", { cache: "no-store" });
        const payload = (await response.json()) as RuntimeProbe;
        if (active) setProbe(payload);
      } catch {
        if (active) setProbe({ connected: false });
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    const timer = window.setInterval(load, 10000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const events = probe?.normalized?.events ?? [];
  const artifacts = probe?.normalized?.artifacts ?? [];
  const eventMap = useMemo(() => new Map(events.map((event) => [event.id, event])), [events]);

  return (
    <section className="mt-5 rounded-2xl border border-cyan-300/10 bg-[#07101b]/45 p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[9px] tracking-[0.2em] text-cyan-200/45">RUNTIME LINEAGE · READ ONLY</p>
          <h2 className="mt-2 text-lg font-medium text-white/82">ARTIFACT ← EVENT ← SOURCE</h2>
        </div>
        <div className="rounded-lg border border-white/[0.08] px-3 py-2 text-[9px] tracking-[0.12em] text-white/38">
          {loading ? "PROBING" : probe?.connected ? "RUNTIME CONNECTED" : "RUNTIME DISCONNECTED"}
        </div>
      </div>

      <p className="mt-3 max-w-3xl text-xs leading-5 text-white/34">
        Esta superficie no infiere evidencia. Sólo muestra vínculos que existen en el payload normalizado del runtime. Si falta un source_ref o no resuelve a un event real, la cadena queda explícitamente incompleta.
      </p>

      {!probe?.connected ? (
        <div className="mt-5 rounded-xl border border-amber-300/10 bg-amber-300/[0.025] px-4 py-4 text-xs text-amber-100/45">
          Sin fuente runtime accesible. No se generan eventos ni artefactos de demostración.
        </div>
      ) : artifacts.length === 0 ? (
        <div className="mt-5 rounded-xl border border-white/[0.07] px-4 py-4 text-xs text-white/30">
          Runtime conectado, pero el payload no expone artifacts reconocibles.
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-xl border border-white/[0.07]">
          <div className="min-w-[860px]">
            <div className="grid grid-cols-[1.2fr_.75fr_1fr_1fr_.65fr] gap-3 border-b border-white/[0.07] bg-white/[0.025] px-4 py-3 text-[9px] tracking-[0.13em] text-white/28">
              <span>ARTIFACT</span><span>PRODUCER</span><span>EVENT</span><span>SOURCE</span><span>LINEAGE</span>
            </div>
            {artifacts.map((artifact) => {
              const event = artifact.source_ref ? eventMap.get(artifact.source_ref) : undefined;
              const state = lineageState(artifact, event);
              return (
                <div key={artifact.id} className="grid grid-cols-[1.2fr_.75fr_1fr_1fr_.65fr] gap-3 border-b border-white/[0.055] px-4 py-4 text-[11px] last:border-b-0">
                  <div><p className="font-medium text-white/75">{artifact.name}</p><p className="mt-1 text-[9px] text-white/25">{artifact.type} · {artifact.id}</p></div>
                  <span className="text-white/38">{artifact.producer ?? "UNKNOWN"}</span>
                  <div><p className="text-white/48">{event?.type ?? artifact.source_ref ?? "UNKNOWN"}</p>{event ? <p className="mt-1 text-[9px] text-white/24">{event.id}</p> : null}</div>
                  <span className="text-cyan-100/42">{event?.source ?? "UNKNOWN"}</span>
                  <span className="text-white/40">{state}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2 text-[9px] text-white/26">
        <span className="rounded-lg border border-white/[0.07] px-2 py-1">COMPLETE = source_ref resuelve a event</span>
        <span className="rounded-lg border border-white/[0.07] px-2 py-1">PARTIAL = existe vínculo parcial</span>
        <span className="rounded-lg border border-white/[0.07] px-2 py-1">UNLINKED = sin vínculo declarado</span>
        <span className="rounded-lg border border-white/[0.07] px-2 py-1">EPISTEMIC = UNKNOWN hasta Source Registry</span>
      </div>
    </section>
  );
}
