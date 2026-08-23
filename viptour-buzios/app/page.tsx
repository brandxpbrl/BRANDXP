"use client";

import Link from "next/link";
import MasterSolutionsGrid from "@/components/MasterSolutionsGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#03050a] text-white flex flex-col justify-between relative overflow-hidden">
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
