import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Bath, DoorOpen, Droplets, Flame, Music2, Ruler, ShowerHead, UsersRound } from "lucide-react";
import { HeroMedia } from "./components/HeroMedia";
import { SiteHeader } from "./components/SiteHeader";
import { BOAT_PHOTO, LOGO, WHATSAPP } from "./content";
import "./bzlanchas.css";

const features = [
  { Icon: Ruler, label: "27,5 pés" },
  { Icon: UsersRound, label: "Até 10 pessoas" },
  { Icon: Bath, label: "Banheiro" },
  { Icon: Flame, label: "Churrasqueira" },
  { Icon: Music2, label: "Bluetooth" },
  { Icon: DoorOpen, label: "Cabine" },
  { Icon: Droplets, label: "Pia" },
  { Icon: ShowerHead, label: "Ducha com água doce" },
];

export default function Page() {
  // Evaluated at build time: an absent MP4 never creates a broken media request.
  const hasHeroVideo = existsSync(path.join(process.cwd(), "public/videos/bz-hero.mp4"));

  return (
    <main className="bz-home" id="conteudo">
      <a className="skip-link" href="#lancha">Ir para nossa lancha</a>
      <section className="hero" id="inicio" aria-label="BZ Lanchas em Búzios">
        <HeroMedia available={hasHeroVideo} />
        <SiteHeader />
        <div className="hero-content shell">
          <div className="hero-copy">
            <h1>VIVA BÚZIOS <span>PELO MAR</span></h1>
            <p>Experiências privativas a bordo da BZ Lanchas.</p>
            <div className="hero-actions">
              <a className="button button-light" href="#lancha">CONHEÇA NOSSA LANCHA <ArrowDown aria-hidden="true" /></a>
              <a className="hero-consult" href={WHATSAPP}>CONSULTAR DISPONIBILIDADE <ArrowUpRight aria-hidden="true" /></a>
            </div>
          </div>
        </div>
        <a className="hero-scroll" href="#lancha" aria-label="Descer para nossa lancha"><ArrowDown aria-hidden="true" /></a>
      </section>

      <section className="boat-section shell" id="lancha" aria-labelledby="boat-title">
        <div className="section-heading">
          <p className="eyebrow">NOSSA LANCHA</p>
          <h2 id="boat-title">FÊNIX 27.5</h2>
          <p className="boat-subtitle">Lancha cabinada · Até 10 pessoas</p>
        </div>
        <article className="boat-card" aria-label="Gratidão, FÊNIX 27.5">
          <div className="boat-photo">
            <Image src={BOAT_PHOTO} alt="FÊNIX 27.5 — Gratidão, lancha cabinada da BZ Lanchas" fill sizes="(max-width: 900px) 100vw, 60vw" quality={85} />
          </div>
          <div className="boat-info">
            <p className="eyebrow">NOME DA EMBARCAÇÃO</p>
            <h3>Gratidão</h3>
            <ul className="boat-features" aria-label="Características confirmadas">
              {features.map(({ Icon, label }) => <li key={label}><Icon aria-hidden="true" /><span>{label}</span></li>)}
            </ul>
            <a className="button button-turquoise" href={WHATSAPP}>INFORMAÇÕES &amp; RESERVAS <ArrowUpRight aria-hidden="true" /></a>
          </div>
        </article>
      </section>

      <section className="reservation" id="reserva" aria-labelledby="reservation-title">
        <div className="reservation-inner shell">
          <div>
            <h2 id="reservation-title">SEU DIA EM BÚZIOS COMEÇA PELO MAR.</h2>
            <p>Consulte disponibilidade e fale diretamente com a BZ Lanchas.</p>
          </div>
          <a className="button button-whatsapp" href={WHATSAPP}>
            <Image src="/icons/whatsapp.svg" alt="" aria-hidden="true" width={22} height={22} unoptimized />
            CONSULTAR DISPONIBILIDADE
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-inner shell">
          <a className="footer-logo" href="#inicio" aria-label="BZ Lanchas — início"><Image src={LOGO} alt="BZ Lanchas" width={1536} height={1024} unoptimized /></a>
          <div className="footer-location"><p className="footer-name">BZ Lanchas</p><p>Armação dos Búzios · RJ</p></div>
          <a className="footer-contact" href={WHATSAPP}><span>WhatsApp</span><span>+55 (22) 99736-2297</span></a>
        </div>
      </footer>

      <a className="floating-whatsapp" href={WHATSAPP} aria-label="Consultar disponibilidade pelo WhatsApp" title="WhatsApp">
        <Image src="/icons/whatsapp.svg" alt="" aria-hidden="true" width={30} height={30} unoptimized />
      </a>
    </main>
  );
}
