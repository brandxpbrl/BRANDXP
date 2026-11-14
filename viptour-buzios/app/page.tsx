"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import MasterSolutionsGrid from "@/components/MasterSolutionsGrid";

export default function Home() {
  const [showIntro, setShowIntro] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem("orbis-intro-seen") !== "1") setShowIntro(true);
  }, []);

  function enterSite() {
    sessionStorage.setItem("orbis-intro-seen", "1");
    setShowIntro(false);
  }

  async function enableSound() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    try {
      await video.play();
      setSoundEnabled(true);
    } catch {
      video.muted = true;
    }
  }

  return (
    <main className="min-h-screen bg-[#03050a] text-white flex flex-col justify-between relative overflow-hidden">
      {showIntro && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#10031b]" aria-label="Apertura ORBIS">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-contain"
            src="/videos/orbisfluidcuadrado.mp4"
            autoPlay
            muted={!soundEnabled}
            playsInline
            preload="auto"
            onEnded={enterSite}
            onError={enterSite}
          />
          <div className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-0 right-0 flex justify-center gap-3 px-4">
            {!soundEnabled && <button type="button" onClick={enableSound} className="rounded-full border border-white/40 bg-black/45 px-4 py-2 text-xs tracking-widest text-white backdrop-blur">ACTIVAR SONIDO</button>}
            <button type="button" onClick={enterSite} className="rounded-full border border-white/40 bg-black/45 px-4 py-2 text-xs tracking-widest text-white backdrop-blur">ENTRAR AL SITIO</button>
          </div>
        </div>
      }
      <div className="relative z-10 w-full flex-grow flex flex-col justify-between">
        <MasterSolutionsGrid />
        <footer className="border-t border-white/[0.06] bg-[#03050a] px-6 py-8 text-center text-xs text-gray-500 z-10">
          <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>© 2026 ORBIS. Everything, Connected.</p>
            <div className="flex gap-6">
              <Link href="/#ecosystem" className="hover:text-white transition-colors">Worlds</Link>
              <Link href="/#everything" className="hover:text-white transition-colors">Explore</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
