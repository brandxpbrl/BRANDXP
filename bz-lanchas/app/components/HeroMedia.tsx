"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useRef, useState, useSyncExternalStore } from "react";

function subscribeMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverMotion = () => true;

export function HeroMedia({ videoSrc, posterSrc }: { videoSrc?: string; posterSrc?: string }) {
  const prefersReducedMotion = useSyncExternalStore(subscribeMotion, reducedMotion, serverMotion);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const showVideo = !!videoSrc && !prefersReducedMotion && !failed;

  // No synthetic/stock fallback: without approved media, retain the brand color.
  if (!showVideo && !posterSrc) return null;

  return (
    <>
      <div className="hero-media" data-media={showVideo ? "video" : "photo"} aria-hidden="true">
        {posterSrc && <Image className="hero-poster" src={posterSrc} alt="" fill sizes="100vw" preload quality={85} />}
        {showVideo && <video ref={video} className={`hero-video${ready ? " is-ready" : ""}`} src={videoSrc} poster={posterSrc} autoPlay muted loop playsInline preload="metadata" onLoadedData={() => setReady(true)} onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} />}
        <div className="hero-shade" />
      </div>
      {showVideo && ready && <button className="video-control" type="button" aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"} onClick={() => {
        if (video.current?.paused) video.current.play().catch(() => setFailed(true));
        else video.current?.pause();
      }}>{playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}</button>}
    </>
  );
}
