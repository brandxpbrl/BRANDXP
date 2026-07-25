import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QUBIT Engine - Dashboard",
  description: "FaseOS Live Visualizer and Earth Metasystem interface.",
};

export default function QubitPage() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-[#030306]">
      <iframe 
        src="/qubit/index.html" 
        className="w-full h-full border-none"
        title="QUBIT Engine"
      />
    </main>
  );
}
