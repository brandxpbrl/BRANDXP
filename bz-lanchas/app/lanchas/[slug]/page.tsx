import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { boats, getBoat } from "../../boats";
import { LOGO, WHATSAPP } from "../../content";
import "../../bzlanchas.css";

export function generateStaticParams() { return boats.map(({ slug }) => ({ slug })); }

export default async function BoatPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const boat = getBoat(slug);
  if (!boat) notFound();
  return <main className="bz-home boat-detail">
    <header className="detail-header shell"><Link href="/" className="institutional-logo"><Image src={LOGO} alt="BZ Lanchas" width={1200} height={1200} unoptimized /></Link><Link href="/#lancha" className="detail-back"><ArrowLeft /> NOSSAS LANCHAS</Link></header>
    <section className="detail-intro shell">
      <p className="eyebrow">CONHEÇA NOSSA LANCHA</p><h1>{boat.title}</h1><p>{boat.subtitle}</p>
      <div className="detail-commercial"><strong>{boat.price}</strong><a className="button button-turquoise" href={WHATSAPP}>INFORMAÇÕES &amp; RESERVAS <ArrowUpRight /></a></div>
    </section>
    <section className="detail-gallery shell" aria-label={`Galeria da ${boat.name}`}>
      {boat.photos.map((src, i) => <div className={`detail-photo ${i === 0 ? "detail-photo-featured" : ""}`} key={src}><Image src={src} alt={`${boat.name} — foto ${i + 1}`} fill sizes={i === 0 ? "100vw" : "(max-width: 700px) 100vw, 50vw"} quality={88} /></div>)}
    </section>
    {boat.video && <section className="detail-video shell"><video controls playsInline preload="metadata"><source src={boat.video} type="video/mp4" /></video></section>}
    <section className="detail-features shell"><div><p className="eyebrow">A BORDO</p><h2>DETALHES DA EXPERIÊNCIA</h2></div><ul>{boat.features.map(feature => <li key={feature}>{feature}</li>)}</ul></section>
    <section className="reservation"><div className="reservation-inner shell"><div><h2>PRONTO PARA VIVER BÚZIOS PELO MAR?</h2><p>Consulte disponibilidade diretamente com a BZ Lanchas.</p></div><a className="button button-whatsapp" href={WHATSAPP}>CONSULTAR DISPONIBILIDADE</a></div></section>
  </main>;
}
