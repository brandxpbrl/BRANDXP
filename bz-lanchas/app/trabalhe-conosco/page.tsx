import Image from "next/image";
import { ArrowUpRight, Phone } from "lucide-react";
import { LOGO, WHATSAPP } from "../content";
import "../bzlanchas.css";

export default function TrabalheConosco() {
 return <main className="institutional-page">
  <header className="institutional-header shell"><a className="institutional-logo" href="/"><Image src={LOGO} alt="BZ Lanchas" width={1200} height={1200} unoptimized /></a><a className="button button-turquoise" href="/">VOLTAR AO SITE</a></header>
  <section className="institutional-content shell"><p className="eyebrow">PARCERIAS</p><h1>TRABALHE CONOSCO</h1><div className="institutional-body"><p>Quer fazer parte da nossa rede de parceiros e vendedores?</p><p>Fale com a BZ Lanchas e conheça nossas oportunidades de parceria.</p><a className="button button-turquoise" href={WHATSAPP}>QUERO SER PARCEIRO <ArrowUpRight aria-hidden="true" /></a></div></section>
 </main>;
}