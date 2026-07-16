import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Experience OS - Admin",
  description: "Terminal de administración interactiva para Brand Experience, MPE y QUBIT.",
};

export default function AdminPage() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-[#07090e]">
      <iframe 
        src="/admin.html" 
        className="w-full h-full border-none"
        title="Brand Experience OS"
      />
    </main>
  );
}
