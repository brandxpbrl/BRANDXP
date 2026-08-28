import type { Metadata } from "next";
import { MellMaterials } from "@/components/mell-stone";
import { mellStoneBrand } from "@/config/mell-stone.content";

export const metadata: Metadata = {
  title: "Materiais | Mell & Stone",
  description:
    "Um arquivo visual de pérolas, jade, ônix, nácar, pedras vulcânicas e materiais naturais usados pela Mell & Stone.",
  alternates: {
    canonical: `${mellStoneBrand.canonical}/materials`,
  },
};

export default function MellStoneMaterialsPage() {
  return <MellMaterials />;
}
