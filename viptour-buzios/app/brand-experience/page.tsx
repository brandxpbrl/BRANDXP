import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Experience OS - Dashboard",
  description: "Terminal interactiva de Brand Experience OS.",
};

export default function BrandExperienceHyphenPage() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-[#030306]">
      <iframe 
        src="/brandexperience.html" 
        className="w-full h-full border-none"
        title="Brand Experience OS"
      />
    </main>
  );
}
