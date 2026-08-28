import type { Metadata } from "next";
import { MellContact } from "@/components/mell-stone";
import { mellStoneBrand } from "@/config/mell-stone.content";

export const metadata: Metadata = {
  title: "Contato | Mell & Stone",
  description:
    "Entre em contato com a Mell & Stone para consultar peças únicas, disponibilidade e atendimento personalizado.",
  alternates: {
    canonical: `${mellStoneBrand.canonical}/contact`,
  },
};

export default function MellStoneContactPage() {
  return <MellContact />;
}
