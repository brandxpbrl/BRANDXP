import type { ReactNode } from "react";
import { MellShell } from "@/components/mell-stone";
import { mellBodyFont, mellDisplayFont } from "./fonts";

export default function MellStoneLayout({ children }: { children: ReactNode }) {
  return (
    <section
      className={`mell-scope ${mellDisplayFont.variable} ${mellBodyFont.variable}`}
      lang="pt-BR"
    >
      <MellShell>{children}</MellShell>
    </section>
  );
}
