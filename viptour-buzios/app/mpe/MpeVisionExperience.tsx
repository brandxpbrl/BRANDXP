"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type VisionMetrics = {
  brightness: number;
  contrast: number;
  motion: number;
  entropy: number;
};

type VisualState = "NUCLEUS" | "COHERENCE" | "EXPANSION" | "TURBULENCE";

const NODE_COUNT = 432;
const SAMPLE_W = 96;
const SAMPLE_H = 72;

const SCRIPT = [
  "Ahora puedo percibir cambios en tu entorno. No necesito saber qué objeto estoy mirando para comenzar.",
  "Primero observo diferencias.",
  "Cuando algo cambia, aparece información.",
  "Cuando las diferencias se relacionan, aparecen patrones.",
  "Algunos patrones desaparecen. Otros persisten.",
  "MPE estudia qué organizaciones sobreviven, cuáles se adaptan y cuáles abren nuevas posibilidades.",
  "Eso es lo que estás viendo.",
];

function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function entropy16(values: Uint8ClampedArray) {
  const bins = new Array(16).fill(0);
  let total = 0;
  for (let i = 0; i < values.length; i += 4) {
    const lum = Math.round(values[i] * 0.299 + values[i + 1] * 0.587 + values[i + 2] * 0.114);
    bins[Math.min(15, Math.floor(lum / 16))] += 1;
    total += 1;
  }
  let h = 0;
  for (const count of bins) {
    if (!count) continue;
    const p = count / total;
    h -= p * Math.log2(p);
  }
  return h / 4;
}

function chooseVisualState(opening: number, turbulence: number): VisualState {
  if (turbulence > 0.72) return "TURBULENCE";
  if (opening > 0.52) return "EXPANSION";
  if (opening < 0.22) return "NUCLEUS";
  return "COHERENCE";
}

export default function MpeVisionExperience() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fieldRef = useRef<HTMLCanvasElement | null>(null);
  const sampleRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const previousFrameRef = useRef<Uint8ClampedArray | null>(null);
  const metricsRef = useRef<VisionMetrics>({ brightness: 0, contrast: 0, motion: 0, entropy: 0 });
  const visualRef = useRef({ opening: 0, turbulence: 0, energy: 0 });
  const narrationTimerRef = useRef<number | null>(null);

  const [active, setActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [metrics, setMetrics] = useState<VisionMetrics>({ brightness: 0, contrast: 0, motion: 0, entropy: 0 });
  const [visualState, setVisualState] = useState<VisualState>("NUCLEUS");
  const [narration, setNarration] = useState("Para comenzar, necesito percibir tu entorno.");
  const [stage, setStage] = useState(0);
  const [muted, setMuted] = useState(false);
  const [showCamera, setShowCamera] = useState(true);
  const [showHud, setShowHud] = useState(true);

  const speak = useCallback((text: string) => {
    if (muted || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 0.92;
    utterance.pitch = 0.96;
    const voices = window.speechSynthesis.getVoices();
    const spanish = voices.find((voice) => voice.lang.toLowerCase().startsWith("es"));
    if (spanish) utterance.voice = spanish;
    window.speechSynthesis.speak(utterance);
  }, [muted]);

  const startNarration = useCallback(() => {
    let index = 0;
    const run = () => {
      const text = SCRIPT[index];
      setNarration(text);
      setStage(index + 1);
      speak(text);
      index += 1;
      if (index < SCRIPT.length) {
        narrationTimerRef.current = window.setTimeout(run, index < 3 ? 5600 : 6500);
      }
    };
    narrationTimerRef.current = window.setTimeout(run, 1700);
  }, [speak]);

  const stopCamera = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (narrationTimerRef.current) window.clearTimeout(narrationTimerRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  const activateVision = useCallback(async () => {
    setCameraError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Este navegador no permite acceso a cámara. Probá desde Chrome o Safari actualizado.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);
      setNarration("Visión activa. La imagen se procesa localmente en este dispositivo y no se almacena.");
      speak("Visión activa. La imagen se procesa localmente en este dispositivo y no se almacena.");
      startNarration();
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo activar la cámara.";
      setCameraError(`No pude acceder a la cámara: ${message}`);
    }
  }, [speak, startNarration]);

  useEffect(() => {
    if (!active) return;
    const sampleCanvas = sampleRef.current;
    const video = videoRef.current;
    if (!sampleCanvas || !video) return;
    const ctx = sampleCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    sampleCanvas.width = SAMPLE_W;
    sampleCanvas.height = SAMPLE_H;

    let lastUi = 0;
    const analyse = (time: number) => {
      if (video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, SAMPLE_W, SAMPLE_H);
        const image = ctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H);
        const data = image.data;
        let lumSum = 0;
        let lumSq = 0;
        let diffSum = 0;
        const previous = previousFrameRef.current;
        let pixelCount = 0;
        for (let i = 0; i < data.length; i += 4) {
          const lum = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
          lumSum += lum;
          lumSq += lum * lum;
          if (previous) {
            const prevLum = previous[i] * 0.299 + previous[i + 1] * 0.587 + previous[i + 2] * 0.114;
            diffSum += Math.abs(lum - prevLum);
          }
          pixelCount += 1;
        }
        const meanLum = lumSum / pixelCount;
        const variance = Math.max(0, lumSq / pixelCount - meanLum * meanLum);
        const nextMetrics: VisionMetrics = {
          brightness: meanLum / 255,
          contrast: clamp(Math.sqrt(variance) / 128),
          motion: previous ? clamp((diffSum / pixelCount) / 255) : 0,
          entropy: entropy16(data),
        };
        previousFrameRef.current = new Uint8ClampedArray(data);
        metricsRef.current = nextMetrics;

        const motionEnergy = clamp(nextMetrics.motion * 7.5);
        const targetOpening = clamp(motionEnergy * 0.72 + nextMetrics.entropy * 0.20 + nextMetrics.brightness * 0.08);
        const targetTurbulence = clamp(motionEnergy * 1.35);
        const targetEnergy = clamp(targetOpening * 0.55 + targetTurbulence * 0.35 + nextMetrics.brightness * 0.10);
        visualRef.current.opening += (targetOpening - visualRef.current.opening) * 0.12;
        visualRef.current.turbulence += (targetTurbulence - visualRef.current.turbulence) * 0.16;
        visualRef.current.energy += (targetEnergy - visualRef.current.energy) * 0.12;

        if (time - lastUi > 180) {
          lastUi = time;
          setMetrics(nextMetrics);
          setVisualState(chooseVisualState(visualRef.current.opening, visualRef.current.turbulence));
        }
      }
      rafRef.current = requestAnimationFrame(analyse);
    };
    rafRef.current = requestAnimationFrame(analyse);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const canvas = fieldRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const nodes = Array.from({ length: NODE_COUNT }, (_, i) => ({
      i,
      n: i / NODE_COUNT,
      angle: i * Math.PI * (3 - Math.sqrt(5)),
      phase: Math.random() * Math.PI * 2,
      seed: Math.random() * 1000,
    }));
    let animation = 0;
    const started = performance.now();

    const render = (now: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      ctx.clearRect(0, 0, width, height);
      const t = (now - started) / 1000;
      const cx = width / 2;
      const cy = height / 2;
      const dimension = Math.min(width, height);
      const opening = visualRef.current.opening;
      const turbulence = visualRef.current.turbulence;
      const energy = visualRef.current.energy;
      const radius = dimension * (0.065 + opening * 0.40);
      const rotation = t * (0.16 + energy * 1.12);

      ctx.lineWidth = 0.5;
      ctx.strokeStyle = `rgba(76,255,235,${0.035 + energy * 0.09})`;
      for (let ring = 1; ring <= 4; ring += 1) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius * ring / 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = 0; i < NODE_COUNT; i += 6) {
        const a = nodes[i];
        const b = nodes[(i + 21) % NODE_COUNT];
        const ra = radius * Math.sqrt(a.n);
        const rb = radius * Math.sqrt(b.n);
        const aa = a.angle + rotation;
        const ba = b.angle - rotation * 0.48;
        ctx.strokeStyle = `rgba(25,218,255,${0.02 + energy * 0.065})`;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(aa) * ra, cy + Math.sin(aa) * ra);
        ctx.lineTo(cx + Math.cos(ba) * rb, cy + Math.sin(ba) * rb);
        ctx.stroke();
      }

      for (const node of nodes) {
        const radial = Math.sqrt(node.n);
        let r = radius * radial;
        r *= 1 + Math.sin(t * 1.6 + node.i * 0.09) * 0.035;
        const direction = node.i % 2 ? -0.5 : 1;
        const angle = node.angle + rotation * direction + opening * Math.sin(node.i * 0.035) * 1.4;
        const jitter = turbulence * (2 + radial * 25);
        const x = cx + Math.cos(angle) * r + Math.sin(t * 9.2 + node.seed) * jitter;
        const y = cy + Math.sin(angle) * r + Math.cos(t * 8.4 + node.seed * 1.31) * jitter;
        const pulse = (Math.sin(t * 3 + node.phase) + 1) * 0.5;
        const size = 0.8 + pulse * 1.1 + energy * 1.9;
        const thermal = clamp(energy + radial * 0.13);
        const red = Math.round(50 + thermal * 205);
        const green = Math.round(255 - thermal * 145);
        const blue = Math.round(235 + thermal * 20);
        ctx.shadowBlur = 6 + energy * 12;
        ctx.shadowColor = `rgb(${red},${green},${blue})`;
        ctx.fillStyle = `rgba(${red},${green},${blue},0.96)`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      const coreRadius = 13 + Math.sin(t * 2.2) * 3 + energy * 20;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * 4);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.12, "rgba(80,255,245,.95)");
      gradient.addColorStop(0.42, "rgba(255,0,150,.28)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 4, 0, Math.PI * 2);
      ctx.fill();
      animation = requestAnimationFrame(render);
    };
    animation = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animation);
  }, [active]);

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-black text-white">
      <video ref={videoRef} playsInline muted className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${active && showCamera ? "opacity-70" : "opacity-0"}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,.18)_38%,rgba(0,0,0,.88)_100%)]" />
      <canvas ref={fieldRef} className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${active ? "opacity-100" : "opacity-35"}`} />
      <canvas ref={sampleRef} className="hidden" />
      <div className="pointer-events-none absolute inset-4 border border-cyan-200/10 sm:inset-6" />

      {!active ? (
        <section className="relative z-10 flex min-h-[100svh] items-center justify-center px-6 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 text-[10px] font-bold uppercase tracking-[0.42em] text-cyan-300/70">ORBIS // MPE VISION</div>
            <div className="mx-auto mb-10 h-24 w-24 rounded-full border border-cyan-300/20 bg-cyan-300/[0.03] shadow-[0_0_80px_rgba(34,211,238,.12)]" />
            <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-6xl">Antes de entrar, dejame percibir.</h1>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
              La cámara se procesa localmente en tu dispositivo. ORBIS no necesita guardar ni enviar tu video para esta experiencia.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button onClick={activateVision} className="rounded-full border border-cyan-200/30 bg-cyan-200 px-7 py-4 text-xs font-black uppercase tracking-[0.2em] text-black transition hover:scale-[1.02]">Activar visión</button>
              <Link href="/" className="rounded-full border border-white/10 bg-white/[0.04] px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white/70">Continuar sin cámara</Link>
            </div>
            {cameraError ? <p className="mt-6 text-sm text-rose-300">{cameraError}</p> : null}
          </div>
        </section>
      ) : (
        <section className="relative z-10 flex min-h-[100svh] flex-col justify-between p-5 sm:p-8">
          <header className="flex items-start justify-between gap-4">
            <div className="max-w-[70vw]">
              <div className="text-[9px] font-bold uppercase tracking-[0.36em] text-cyan-200/75">ORBIS // MPE // LIVE PERCEPTION</div>
              <div className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">{visualState}</div>
              <div className="mt-2 text-[9px] uppercase tracking-[0.2em] text-white/35">Representación visual · no diagnóstico</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setMuted((value) => !value)} className="rounded-full border border-white/10 bg-black/30 px-3 py-2 text-[9px] uppercase tracking-widest text-white/65">{muted ? "Voice off" : "Voice on"}</button>
              <button onClick={() => setShowCamera((value) => !value)} className="rounded-full border border-white/10 bg-black/30 px-3 py-2 text-[9px] uppercase tracking-widest text-white/65">Camera</button>
              <button onClick={() => setShowHud((value) => !value)} className="rounded-full border border-white/10 bg-black/30 px-3 py-2 text-[9px] uppercase tracking-widest text-white/65">HUD</button>
            </div>
          </header>

          <div className="pointer-events-none flex flex-1 items-center justify-center">
            <div className="max-w-xl text-center">
              <p className="text-lg font-medium leading-8 text-white/85 drop-shadow-[0_2px_18px_rgba(0,0,0,.9)] sm:text-2xl">{narration}</p>
              {stage >= 7 ? <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.32em] text-cyan-200/70">¿Qué estructuras generan más futuros viables?</p> : null}
            </div>
          </div>

          <footer className="flex items-end justify-between gap-4">
            {showHud ? (
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 rounded-2xl border border-white/10 bg-black/30 p-4 text-[9px] uppercase tracking-[0.15em] text-white/50 backdrop-blur-md sm:grid-cols-4">
                <span>Motion {metrics.motion.toFixed(3)}</span>
                <span>Light {metrics.brightness.toFixed(3)}</span>
                <span>Contrast {metrics.contrast.toFixed(3)}</span>
                <span>Entropy {metrics.entropy.toFixed(3)}</span>
              </div>
            ) : <span />}
            <div className="flex gap-2">
              <Link href="/" className="rounded-full border border-white/10 bg-black/40 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white/70 backdrop-blur-md">Entrar a ORBIS</Link>
              <button onClick={() => { stopCamera(); setActive(false); setStage(0); setNarration("Para comenzar, necesito percibir tu entorno."); }} className="rounded-full border border-white/10 bg-black/40 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white/45 backdrop-blur-md">Cerrar visión</button>
            </div>
          </footer>
        </section>
      )}
    </main>
  );
}
