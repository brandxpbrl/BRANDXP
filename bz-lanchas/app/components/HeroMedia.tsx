"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useRef, useState, useSyncExternalStore } from "react";

const mobileQuery = "(max-width: 767px)";
const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribe(query: string, callback: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const subscribeViewport = (callback: () => void) => subscribe(mobileQuery, callback);
const subscribeMotion = (callback: () => void) => subscribe(motionQuery, callback);
const getViewport = () => window.matchMedia(mobileQuery).matches ? "mobile" : "desktop";
const getMotion = () => window.matchMedia(motionQuery).matches;
const serverViewport = (): "mobile" | "desktop" | null => null;
const serverMotion = () => true;

type Props = {
  desktopVideo?: string;
  mobileVideo?: string;
  desktopPoster?: string;
  mobilePoster?: string;
};

export function HeroMedia(props: Props) {
  const viewport = useSyncExternalStore(subscribeViewport, getViewport, serverViewport);
  const reducedMotion = useSyncExternalStore(subscribeMotion, getMotion, serverMotion);
  // Select before creating <video>: initial visits never fetch both MP4 files.
  const videoSrc = viewport && !reducedMotion
    ? viewport === "mobile" ? props.mobileVideo : props.desktopVideo
    : undefined;
  return <HeroSurface key={videoSrc ?? "poster"} {...props} videoSrc={videoSrc} viewport={viewport} />;
}

function HeroSurface({ desktopPoster, mobilePoster, videoSrc, viewport }: Props & { videoSrc?: string; viewport: string | null }) {
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const showVideo = !!videoSrc && !failed;
  const fallbackPoster = desktopPoster ?? mobilePoster;
  const selectedPoster = viewport === "mobile" ? mobilePoster : desktopPoster;

  if (!showVideo && !fallbackPoster) return null;

  return (
    <>
      <div className="hero-media" data-media={showVideo ? "video" : "photo"} data-variant={viewport ?? "poster"} aria-hidden="true">
        {fallbackPoster && <picture>
          {mobilePoster && <source media={mobileQuery} srcSet={mobilePoster} />}
          <Image className="hero-poster" src={fallbackPoster} alt="" fill unoptimized loading="eager" fetchPriority="high" />
        </picture>}
        {showVideo && <video ref={video} className={`hero-video${ready ? " is-ready" : ""}`} src={videoSrc} poster={selectedPoster} autoPlay muted loop playsInline preload="metadata" disablePictureInPicture onLoadedData={() => setReady(true)} onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} />}
        <div className="hero-shade" />
      </div>
      {showVideo && ready && <button className="video-control" type="button" aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"} onClick={() => {
        if (video.current?.paused) video.current.play().catch(() => setFailed(true));
        else video.current?.pause();
      }}>{playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}</button>}
    </>
  );
}
