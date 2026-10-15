"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useRef, useState, useSyncExternalStore } from "react";
import { BOAT_PHOTO } from "../content";

function subscribeMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverMotion = () => true;

export function HeroMedia({ available }: { available: boolean }) {
  const prefersReducedMotion = useSyncExternalStore(subscribeMotion, reducedMotion, serverMotion);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const showVideo = available && !prefersReducedMotion && !failed;

  return (
    <>
      <div className="hero-media" data-media={showVideo ? "video" : "photo"} aria-hidden="true">
        <Image className="hero-poster" src={BOAT_PHOTO} alt="" fill sizes="100vw" preload quality={85} />
        {showVideo && <video ref={video} className={`hero-video${ready ? " is-ready" : ""}`} src="/videos/bz-hero.mp4" poster={BOAT_PHOTO} autoPlay muted loop playsInline preload="metadata" onLoadedData={() => setReady(true)} onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} />}
        <div className="hero-shade" />
      </div>
      {showVideo && ready && <button className="video-control" type="button" aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"} onClick={() => {
        if (video.current?.paused) video.current.play().catch(() => setFailed(true));
        else video.current?.pause();
      }}>{playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}</button>}
    </>
  );
}
