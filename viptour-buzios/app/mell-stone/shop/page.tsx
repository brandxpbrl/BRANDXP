import type { Metadata } from "next";
import { MellShop } from "@/components/mell-stone";
import { mellStoneBrand } from "@/config/mell-stone.content";

export const metadata: Metadata = {
  title: "Shop | Mell & Stone",
  description:
    "Catálogo editorial de peças únicas Mell & Stone. Produtos reais serão publicados com preço e disponibilidade confirmados.",
  alternates: {
    canonical: `${mellStoneBrand.canonical}/shop`,
  },
};

export default function MellStoneShopPage() {
  return <MellShop />;
}
