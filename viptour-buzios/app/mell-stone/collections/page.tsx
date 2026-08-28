import type { Metadata } from "next";
import { MellCollections } from "@/components/mell-stone";
import { mellStoneBrand } from "@/config/mell-stone.content";

export const metadata: Metadata = {
  title: "Coleções | Mell & Stone",
  description:
    "Coleções Mell & Stone organizadas por matéria, luz, superfície e intenção editorial.",
  alternates: {
    canonical: `${mellStoneBrand.canonical}/collections`,
  },
};

export default function MellStoneCollectionsPage() {
  return <MellCollections />;
}
