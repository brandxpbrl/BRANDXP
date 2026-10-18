import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { LOGO, WHATSAPP } from "../content";
import "../bzlanchas.css";

export function InstitutionalPage({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return <main className="bz-home institutional-page"><header className="institutional-header shell"><Link href="/" className="institutional-logo"><Image src={LOGO} alt="BZ Lanchas" width={1200} height={1200} unoptimized /></Link><a href={WHATSAPP} className="button button-turquoise">RESERVAS PELO WHATSAPP</a></header><article className="institutional-content shell"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><div className="institutional-body">{children}</div><Link href="/" className="institutional-back">← Voltar para o início</Link></article></main>;
}
