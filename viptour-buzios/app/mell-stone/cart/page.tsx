import type { Metadata } from "next";
import { MellCart } from "@/components/mell-stone";
import { mellStoneBrand } from "@/config/mell-stone.content";

export const metadata: Metadata = {
  title: "Carrinho | Mell & Stone",
  description:
    "Carrinho editorial Mell & Stone. A compra direta será ativada quando o catálogo real estiver confirmado.",
  alternates: {
    canonical: `${mellStoneBrand.canonical}/cart`,
  },
};

export default function MellStoneCartPage() {
  return <MellCart />;
}
