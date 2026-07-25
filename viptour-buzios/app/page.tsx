"use client";

import Link from "next/link";
import MasterSolutionsGrid from "@/components/MasterSolutionsGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#05050a] text-white flex flex-col justify-between relative overflow-hidden">
      <MasterSolutionsGrid />

      {/* Cybernetic Footer */}
      <footer className="border-t border-white/5 bg-black/40 px-6 py-8 text-center text-xs text-gray-500 z-10 backdrop-blur-sm">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 MASTER SOLUTIONS. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/universos-visuales" className="hover:text-white transition-colors">Visual Universes</Link>
            <Link href="/brandexperience" className="hover:text-white transition-colors">Brand Experience</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact Hub</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
