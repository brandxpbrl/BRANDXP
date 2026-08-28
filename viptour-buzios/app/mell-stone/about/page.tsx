import type { Metadata } from "next";
import { MellAbout } from "@/components/mell-stone";
import { mellStoneBrand } from "@/config/mell-stone.content";

export const metadata: Metadata = {
  title: "Sobre | Mell & Stone",
  description:
    "A visão da Mell & Stone: joias artesanais, luxo natural e peças únicas finalizadas com calma.",
  alternates: {
    canonical: `${mellStoneBrand.canonical}/about`,
  },
};

export default function MellStoneAboutPage() {
  return <MellAbout />;
}
