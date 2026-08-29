"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type VisionMetrics = { brightness: number; contrast: number; motion: number; entropy: number };
type VisualState = "NUCLEUS" | "COHERENCE" | "EXPANSION" | "TURBULENCE";
type PerceptionEvent = "INTRO" | "CALIBRATING" | "STABLE" | "LOCAL_CHANGE" | "GLOBAL_CHANGE" | "RECOVERY" | "REPEATED_CHANGE";

const NODE_COUNT = 432;
const SAMPLE_W = 96;
const SAMPLE_H = 72;
const INTRO = [
  "Esto no son partículas decorativas. Los nodos vuelven visibles relaciones y cambios dentro de un estado.",
  "Estable significa que, durante un intervalo, el entorno cambia poco. Coherencia, aquí, significa que varios cambios conservan una organización común.",
  "MPE compara diferencias, relaciones y persistencias para estudiar qué configuraciones abren o cierran posibilidades.",
  "Cuando algo cambia, el campo se dispersa. Cuando recupera organización, converge. Ahora mové algo frente a la cámara.",
];
const INTRO_DELAYS = [0, 3200, 6900, 10400];
const INTRO_END = 14200;

function clamp(value: number, min = 0, max = 1) { return Math.max(min, Math.min(max, value)); }
function entropy16(values: Uint8ClampedArray) {
  const bins = new Array(16).fill(0); let total = 0;
  for (let i = 0; i < values.length; i += 4) { const lum = Math.round(values[i] * .299 + values[i + 1] * .587 + values[i + 2] * .114); bins[Math.min(15, Math.floor(lum / 16))]++; total++; }
  let h = 0; for (const count of bins) { if (!count) continue; const p = count / total; h -= p * Math.log2(p); }
  return h / 4;
}
function chooseVisualState(opening: number, turbulence: number): VisualState { if (turbulence > .72) return "TURBULENCE"; if (opening > .52) return "EXPANSION"; if (opening < .22) return "NUCLEUS"; return "COHERENCE"; }

export default function MpeVisionExperience() {
  const videoRef = useRef<HTMLVideoElement | null>(null), fieldRef = useRef<HTMLCanvasElement | null>(null), sampleRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null), rafRef = useRef<number | null>(null), previousFrameRef = useRef<Uint8ClampedArray | null>(null);
  const visualRef = useRef({ opening: 0, turbulence: 0, energy: 0 });
  const baselineRef = useRef(0), activatedAtRef = useRef(0), lastEventRef = useRef(0), lastEpisodeEndRef = useRef(0), eventRef = useRef<PerceptionEvent>("INTRO");
  const episodeActiveRef = useRef(false), episodeStartRef = useRef(0), episodePeakRatioRef = useRef(0), episodeCountRef = useRef(0), highFramesRef = useRef(0), lowFramesRef = useRef(0), stableAnnouncedRef = useRef(false);
  const introActiveRef = useRef(false), introTimersRef = useRef<number[]>([]), introSpreadRef = useRef(0);
  const [active, setActive] = useState(false), [cameraError, setCameraError] = useState("");
  const [metrics, setMetrics] = useState<VisionMetrics>({ brightness: 0, contrast: 0, motion: 0, entropy: 0 });
  const [visualState, setVisualState] = useState<VisualState>("NUCLEUS"), [event, setEvent] = useState<PerceptionEvent>("INTRO");
  const [narration, setNarration] = useState("Para comenzar, necesito percibir tu entorno."), [muted, setMuted] = useState(false), [showCamera, setShowCamera] = useState(true), [showHud, setShowHud] = useState(true);

  const speak = useCallback((text: string) => {
    if (muted || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = "es-ES"; u.rate = 1.05; u.pitch = .96;
    const voice = window.speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith("es")); if (voice) u.voice = voice; window.speechSynthesis.speak(u);
  }, [muted]);
  const announce = useCallback((next: PerceptionEvent, text: string, now: number, force = false) => {
    if (introActiveRef.current && next !== "INTRO") return;
    if (!force && now - lastEventRef.current < 2400) return;
    lastEventRef.current = now; eventRef.current = next; setEvent(next); setNarration(text); speak(text);
  }, [speak]);
  const clearIntro = useCallback(() => { introTimersRef.current.forEach(id => window.clearTimeout(id)); introTimersRef.current = []; introActiveRef.current = false; }, []);
  const stopCamera = useCallback(() => { if (rafRef.current) cancelAnimationFrame(rafRef.current); clearIntro(); streamRef.current?.getTracks().forEach(t => t.stop()); streamRef.current = null; if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel(); }, [clearIntro]);
  useEffect(() => stopCamera, [stopCamera]);

  const runIntro = useCallback(() => {
    introActiveRef.current = true; introSpreadRef.current = 0; eventRef.current = "INTRO"; setEvent("INTRO");
    INTRO.forEach((text, index) => {
      const id = window.setTimeout(() => { setNarration(text); speak(text); }, INTRO_DELAYS[index]); introTimersRef.current.push(id);
    });
    const end = window.setTimeout(() => {
      introActiveRef.current = false; eventRef.current = "CALIBRATING"; setEvent("CALIBRATING"); setNarration("Percepción en vivo. Ahora observo lo que realmente cambia en la escena."); speak("Percepción en vivo. Ahora observo lo que realmente cambia en la escena.");
      lastEventRef.current = performance.now();
    }, INTRO_END); introTimersRef.current.push(end);
  }, [speak]);

  const activateVision = useCallback(async () => {
    setCameraError(""); if (!navigator.mediaDevices?.getUserMedia) { setCameraError("Este navegador no permite acceso a cámara."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      streamRef.current = stream; if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      previousFrameRef.current = null; baselineRef.current = 0; episodeActiveRef.current = false; episodeCountRef.current = 0; highFramesRef.current = 0; lowFramesRef.current = 0; stableAnnouncedRef.current = false; activatedAtRef.current = performance.now(); lastEventRef.current = 0; lastEpisodeEndRef.current = 0;
      setActive(true); runIntro();
    } catch (e) { setCameraError(`No pude acceder a la cámara: ${e instanceof Error ? e.message : "error desconocido"}`); }
  }, [runIntro]);

  useEffect(() => {
    if (!active) return; const canvas = sampleRef.current, video = videoRef.current; if (!canvas || !video) return; const ctx = canvas.getContext("2d", { willReadFrequently: true }); if (!ctx) return;
    canvas.width = SAMPLE_W; canvas.height = SAMPLE_H; let lastUi = 0;
    const analyse = (now: number) => {
      if (video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, SAMPLE_W, SAMPLE_H); const data = ctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H).data; const previous = previousFrameRef.current;
        let lumSum = 0, lumSq = 0, diffSum = 0, changed = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) { const lum = data[i] * .299 + data[i + 1] * .587 + data[i + 2] * .114; lumSum += lum; lumSq += lum * lum; if (previous) { const pl = previous[i] * .299 + previous[i + 1] * .587 + previous[i + 2] * .114; const d = Math.abs(lum - pl); diffSum += d; if (d > 24) changed++; } count++; }
        const mean = lumSum / count, variance = Math.max(0, lumSq / count - mean * mean), motion = previous ? clamp((diffSum / count) / 255) : 0, changedRatio = previous ? changed / count : 0;
        const next = { brightness: mean / 255, contrast: clamp(Math.sqrt(variance) / 128), motion, entropy: entropy16(data) }; previousFrameRef.current = new Uint8ClampedArray(data);
        const age = now - activatedAtRef.current;
        if (age < 2200) baselineRef.current = baselineRef.current * .9 + motion * .1; else if (!episodeActiveRef.current) baselineRef.current = baselineRef.current * .998 + motion * .002;
        const startThreshold = Math.max(.024, baselineRef.current * 3.8 + .010), stopThreshold = Math.max(.012, baselineRef.current * 1.8 + .004), strongChange = motion > startThreshold || changedRatio > .09, quiet = motion < stopThreshold && changedRatio < .035;

        if (!introActiveRef.current && age > INTRO_END) {
          if (!episodeActiveRef.current) {
            highFramesRef.current = strongChange ? highFramesRef.current + 1 : Math.max(0, highFramesRef.current - 1);
            if (highFramesRef.current >= 4) {
              episodeActiveRef.current = true; episodeStartRef.current = now; episodePeakRatioRef.current = changedRatio; highFramesRef.current = 0; lowFramesRef.current = 0; stableAnnouncedRef.current = false; episodeCountRef.current += 1;
              const repeated = lastEpisodeEndRef.current > 0 && now - lastEpisodeEndRef.current < 9000, global = changedRatio > .24;
              const text = repeated ? "Esta diferencia reapareció después de la anterior. Puedo compararlas como dos episodios distintos." : global ? "El cambio ocupa una parte amplia de la escena. El campo se abre porque aumentó la perturbación visual." : "Detecté un cambio localizado. El resto de la escena permanece más estable.";
              announce(repeated ? "REPEATED_CHANGE" : global ? "GLOBAL_CHANGE" : "LOCAL_CHANGE", text, now, true);
            }
          } else {
            episodePeakRatioRef.current = Math.max(episodePeakRatioRef.current, changedRatio); lowFramesRef.current = quiet ? lowFramesRef.current + 1 : 0;
            if (lowFramesRef.current >= 12 && now - episodeStartRef.current > 550) {
              episodeActiveRef.current = false; lowFramesRef.current = 0; lastEpisodeEndRef.current = now; const duration = (now - episodeStartRef.current) / 1000;
              announce("RECOVERY", `El cambio terminó después de ${duration.toFixed(1)} segundos. La escena vuelve a una organización más estable.`, now, true);
            }
          }
          if (!episodeActiveRef.current && !stableAnnouncedRef.current && lastEpisodeEndRef.current > 0 && now - lastEpisodeEndRef.current > 4500) { stableAnnouncedRef.current = true; announce("STABLE", "Ahora el cambio es bajo. Este estado funciona como referencia para comparar lo que venga después.", now); }
        }

        const motionEnergy = clamp(motion * 7.5), targetOpening = clamp(motionEnergy * .72 + next.entropy * .20 + next.brightness * .08), targetTurbulence = clamp(motionEnergy * 1.35), targetEnergy = clamp(targetOpening * .55 + targetTurbulence * .35 + next.brightness * .10);
        visualRef.current.opening += (targetOpening - visualRef.current.opening) * .12; visualRef.current.turbulence += (targetTurbulence - visualRef.current.turbulence) * .16; visualRef.current.energy += (targetEnergy - visualRef.current.energy) * .12;
        if (now - lastUi > 180) { lastUi = now; setMetrics(next); setVisualState(chooseVisualState(visualRef.current.opening, visualRef.current.turbulence)); }
      }
      rafRef.current = requestAnimationFrame(analyse);
    }; rafRef.current = requestAnimationFrame(analyse); return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [active, announce]);

  useEffect(() => {
    if (!active) return; const canvas = fieldRef.current; if (!canvas) return; const ctx = canvas.getContext("2d"); if (!ctx) return;
    const nodes = Array.from({ length: NODE_COUNT }, (_, i) => ({ i, n: i / NODE_COUNT, angle: i * Math.PI * (3 - Math.sqrt(5)), phase: Math.random() * Math.PI * 2, seed: Math.random() * 1000 })); let animation = 0; const started = performance.now();
    const render = (now: number) => { const dpr = Math.min(window.devicePixelRatio || 1, 2), w = canvas.clientWidth, h = canvas.clientHeight; if (canvas.width !== Math.round(w*dpr) || canvas.height !== Math.round(h*dpr)) { canvas.width=Math.round(w*dpr); canvas.height=Math.round(h*dpr); ctx.setTransform(dpr,0,0,dpr,0,0); } ctx.clearRect(0,0,w,h);
      const t=(now-started)/1000,cx=w/2,cy=h/2,d=Math.min(w,h); if(introActiveRef.current) introSpreadRef.current += (1-introSpreadRef.current)*.012; else introSpreadRef.current += (0-introSpreadRef.current)*.015;
      const liveOpening=visualRef.current.opening,opening=Math.max(liveOpening,introSpreadRef.current*.88),turb=visualRef.current.turbulence,energy=Math.max(visualRef.current.energy,introSpreadRef.current*.26),radius=d*(.07+opening*.52),rotation=t*(.12+energy*.9);
      ctx.lineWidth=.5; ctx.strokeStyle=`rgba(76,255,235,${.035+energy*.09})`; for(let ring=1;ring<=4;ring++){ctx.beginPath();ctx.arc(cx,cy,radius*ring/4,0,Math.PI*2);ctx.stroke();}
      for(let i=0;i<NODE_COUNT;i+=6){const a=nodes[i],b=nodes[(i+21)%NODE_COUNT],ra=radius*Math.sqrt(a.n),rb=radius*Math.sqrt(b.n),aa=a.angle+rotation,ba=b.angle-rotation*.48;ctx.strokeStyle=`rgba(25,218,255,${.02+energy*.065})`;ctx.beginPath();ctx.moveTo(cx+Math.cos(aa)*ra,cy+Math.sin(aa)*ra);ctx.lineTo(cx+Math.cos(ba)*rb,cy+Math.sin(ba)*rb);ctx.stroke();}
      for(const node of nodes){const radial=Math.sqrt(node.n);let r=radius*radial;r*=1+Math.sin(t*1.4+node.i*.09)*.035;const direction=node.i%2?-.5:1,angle=node.angle+rotation*direction+opening*Math.sin(node.i*.035)*1.4,jitter=turb*(2+radial*25),x=cx+Math.cos(angle)*r+Math.sin(t*8.5+node.seed)*jitter,y=cy+Math.sin(angle)*r+Math.cos(t*7.9+node.seed*1.31)*jitter,pulse=(Math.sin(t*3+node.phase)+1)*.5,size=.8+pulse*1.1+energy*1.9,thermal=clamp(energy+radial*.13),red=Math.round(50+thermal*205),green=Math.round(255-thermal*145),blue=Math.round(235+thermal*20);ctx.shadowBlur=6+energy*12;ctx.shadowColor=`rgb(${red},${green},${blue})`;ctx.fillStyle=`rgba(${red},${green},${blue},.96)`;ctx.beginPath();ctx.arc(x,y,size,0,Math.PI*2);ctx.fill();}
      ctx.shadowBlur=0;const cr=13+Math.sin(t*2.2)*3+energy*20,g=ctx.createRadialGradient(cx,cy,0,cx,cy,cr*4);g.addColorStop(0,"rgba(255,255,255,1)");g.addColorStop(.12,"rgba(80,255,245,.95)");g.addColorStop(.42,"rgba(255,0,150,.28)");g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,cr*4,0,Math.PI*2);ctx.fill();animation=requestAnimationFrame(render);
    }; animation=requestAnimationFrame(render); return()=>cancelAnimationFrame(animation);
  },[active]);

  return <main className="relative min-h-[100svh] overflow-hidden bg-black text-white">
    <video ref={videoRef} playsInline muted className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${active&&showCamera?"opacity-75":"opacity-0"}`}/><div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,.16)_42%,rgba(0,0,0,.82)_100%)]"/><canvas ref={fieldRef} className={`absolute inset-0 h-full w-full ${active?"opacity-100":"opacity-35"}`}/><canvas ref={sampleRef} className="hidden"/>
    {!active?<section className="relative z-10 flex min-h-[100svh] items-center justify-center px-6"><div className="max-w-xl text-center"><div className="mb-7 text-[10px] font-bold uppercase tracking-[.42em] text-cyan-300/70">ORBIS // MPE VISION v0.4</div><h1 className="text-4xl font-black tracking-[-.04em]">Activá la visión. Entendé MPE en segundos.</h1><p className="mt-5 text-sm leading-7 text-white/55">La cámara se procesa localmente. Primero te muestro qué representan los nodos; después la experiencia responde a cambios reales.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"><button onClick={activateVision} className="rounded-full bg-cyan-200 px-7 py-4 text-xs font-black uppercase tracking-[.2em] text-black">Activar visión</button><Link href="/" className="rounded-full border border-white/10 px-7 py-4 text-xs uppercase tracking-[.18em] text-white/70">Continuar sin cámara</Link></div>{cameraError&&<p className="mt-6 text-sm text-rose-300">{cameraError}</p>}</div></section>:
    <section className="relative z-10 flex min-h-[100svh] flex-col justify-between p-4 sm:p-8"><header className="flex items-start justify-between gap-3"><div><div className="text-[8px] font-bold uppercase tracking-[.3em] text-cyan-200/70">ORBIS // MPE LIVE</div><div className="mt-1 text-lg font-black">{introActiveRef.current?"DISCOVER":visualState}</div><div className="mt-1 text-[8px] uppercase tracking-[.18em] text-white/35">{event} · señales visuales · no diagnóstico</div></div><div className="flex gap-1"><button onClick={()=>setMuted(v=>!v)} className="rounded-full border border-white/10 bg-black/35 px-2.5 py-2 text-[8px] uppercase">{muted?"Voice off":"Voice"}</button><button onClick={()=>setShowCamera(v=>!v)} className="rounded-full border border-white/10 bg-black/35 px-2.5 py-2 text-[8px] uppercase">Camera</button><button onClick={()=>setShowHud(v=>!v)} className="rounded-full border border-white/10 bg-black/35 px-2.5 py-2 text-[8px] uppercase">HUD</button></div></header>
      <div className="pointer-events-none flex flex-1 flex-col items-center justify-center gap-5 px-4"><p key={narration} className="max-w-lg rounded-2xl bg-black/20 px-4 py-3 text-center text-base font-medium leading-7 text-white/90 backdrop-blur-[2px] sm:text-xl">{narration}</p>{introActiveRef.current?<div className="flex flex-wrap justify-center gap-2 text-[8px] font-bold uppercase tracking-[.16em]"><span className="rounded-full border border-cyan-200/20 bg-black/30 px-3 py-2 text-cyan-100/75">ESTABLE · poco cambio</span><span className="rounded-full border border-cyan-200/20 bg-black/30 px-3 py-2 text-cyan-100/75">COHERENCIA · organización común</span><span className="rounded-full border border-fuchsia-200/20 bg-black/30 px-3 py-2 text-fuchsia-100/75">DIFERENCIA · nueva información</span></div>:null}</div>
      <footer className="flex items-end justify-between gap-3">{showHud?<div className="grid grid-cols-2 gap-x-4 rounded-2xl border border-white/10 bg-black/35 p-3 text-[8px] uppercase tracking-[.12em] text-white/55 backdrop-blur-md"><span>Motion {metrics.motion.toFixed(3)}</span><span>Light {metrics.brightness.toFixed(3)}</span><span>Contrast {metrics.contrast.toFixed(3)}</span><span>Entropy {metrics.entropy.toFixed(3)}</span></div>:<span/>}<div className="flex gap-1"><Link href="/" className="rounded-full border border-white/10 bg-black/45 px-3 py-3 text-[8px] font-bold uppercase tracking-[.14em]">Entrar a ORBIS</Link><button onClick={()=>{stopCamera();setActive(false);setNarration("Para comenzar, necesito percibir tu entorno.");}} className="rounded-full border border-white/10 bg-black/45 px-3 py-3 text-[8px] uppercase text-white/50">Cerrar</button></div></footer>
    </section>}
  </main>;
}
