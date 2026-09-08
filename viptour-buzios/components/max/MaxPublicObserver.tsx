"use client";

import { Activity, Volume2, VolumeX, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type ResearchState = { source: string; provenance: string; timestamp: string; metric_namespace: string; status: string; validation: string; availability: "AVAILABLE" | "NO_EVIDENCE" | "UNAVAILABLE"; lineage: string[]; message: string };
type ObservationPacket = { source: "MAX_PUBLIC_OBSERVER"; provenance: string; timestamp: string; metric_namespace: "mpe.observation"; status: "OBSERVED"; lineage: string[]; route: string; scene: string; scroll_band: string; delta: string; research: ResearchState };

const FALLBACK_RESEARCH: ResearchState = { source: "mpe_probability_statistics", provenance: "MPE_MARKET_RESEARCH_STATE_URL no configurado", timestamp: new Date(0).toISOString(), metric_namespace: "mpe.market_research", status: "UNKNOWN", validation: "UNVALIDATED", availability: "UNAVAILABLE", lineage: ["MAX_PUBLIC_OBSERVER", "MCOS_UNAVAILABLE"], message: "MCOS_UNAVAILABLE: no hay contexto de investigación conectado." };

function scrollBand() { const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1); const ratio = window.scrollY / max; return ratio < .2 ? "top" : ratio > .8 ? "bottom" : "middle"; }

export function MaxPublicObserver() {
  const [open, setOpen] = useState(false); const [voiceEnabled, setVoiceEnabled] = useState(false); const [packet, setPacket] = useState<ObservationPacket | null>(null);
  const previousScene = useRef(""); const lastVoice = useRef(""); const lastVoiceAt = useRef(0);
  const capture = useCallback((reason: string) => {
    const route = window.location.pathname; const scene = document.querySelector("main h1, main [data-scene], main")?.getAttribute("data-scene") || document.title || "portal"; const currentScene = `${route}|${scene}|${scrollBand()}`;
    const next: ObservationPacket = { source: "MAX_PUBLIC_OBSERVER", provenance: "navegador: escena visible y navegación pública", timestamp: new Date().toISOString(), metric_namespace: "mpe.observation", status: "OBSERVED", lineage: ["PERCEPTION", "VISIBLE_SCENE", "ENTITIES", "DELTA", "OBSERVATION_PACKET", "CONTEXT", "VOICE"], route, scene: String(scene).slice(0, 120), scroll_band: scrollBand(), delta: previousScene.current === currentScene ? "NO_SIGNIFICANT_CHANGE" : reason, research: FALLBACK_RESEARCH };
    previousScene.current = currentScene; setPacket((current) => current ? { ...next, research: current.research } : next); return next;
  }, []);
  useEffect(() => {
    const initial = capture("initial_scene"); let active = true;
    fetch("/api/max/research", { cache: "no-store" }).then((response) => response.json()).then((research: ResearchState) => { if (active) setPacket((current) => current ? { ...current, research } : { ...initial, research }); }).catch(() => undefined);
    const onScroll = () => capture("scroll_band_change"); const onClick = (event: MouseEvent) => { if ((event.target as HTMLElement | null)?.closest("a,button")) capture("visible_action"); };
    const observer = new MutationObserver(() => capture("relevant_mutation")); observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-scene", "aria-current"] });
    window.addEventListener("scroll", onScroll, { passive: true }); document.addEventListener("click", onClick); const timer = window.setInterval(() => capture("scene_check"), 15000);
    return () => { active = false; observer.disconnect(); window.removeEventListener("scroll", onScroll); document.removeEventListener("click", onClick); window.clearInterval(timer); };
  }, [capture]);
  useEffect(() => { if (!voiceEnabled || !packet || packet.delta === "NO_SIGNIFICANT_CHANGE") return; const text = `MAX observa la ruta ${packet.route}. Contexto ${packet.research.availability === "AVAILABLE" ? "MPE disponible" : "MPE no disponible"}.`; const now = Date.now(); if (text === lastVoice.current || now - lastVoiceAt.current < 30000 || !window.speechSynthesis) return; window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(text)); lastVoice.current = text; lastVoiceAt.current = now; }, [packet, voiceEnabled]);
  const research = packet?.research ?? FALLBACK_RESEARCH;
  return <aside className={`max-public-observer${open ? " is-open" : ""}`} aria-label="MAX Global Self Observer">
    {open && <div className="max-public-observer__panel"><div className="max-public-observer__heading"><span><Activity size={15} /> MAX / MPE</span><button type="button" aria-label="Cerrar MAX" onClick={() => setOpen(false)}><X size={16} /></button></div><p className="max-public-observer__title">Observación contextual read-only</p><p className="max-public-observer__route">{packet?.route ?? "cargando ruta"}</p><div className="max-public-observer__status"><span className={`max-dot ${research.availability.toLowerCase()}`} /> MPE: {research.availability}</div><div className="max-public-observer__tags"><span>{research.status}</span><span>{research.validation}</span></div><p className="max-public-observer__note">{research.message} MCOS_EXPRESSION_IS_NOT_EVIDENCE.</p><button type="button" className="max-public-observer__voice" onClick={() => setVoiceEnabled((value) => !value)}>{voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />} {voiceEnabled ? "Voz activa" : "Activar voz"}</button></div>}
    <button type="button" className="max-public-observer__trigger" aria-expanded={open} onClick={() => setOpen((value) => !value)}><Activity size={16} /> <span>MAX</span></button>
  </aside>;
}
