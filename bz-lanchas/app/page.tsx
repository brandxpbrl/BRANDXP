import Image from "next/image";
import { ArrowDown, ArrowUpRight, Phone } from "lucide-react";
import { HeroMedia } from "./components/HeroMedia";
import { SiteHeader } from "./components/SiteHeader";
import { BoatCard } from "./components/BoatCard";
import { boats } from "./boats";
import { LOGO, WHATSAPP } from "./content";
import { getClientMedia } from "./client-media";
import "./bzlanchas.css";

export default function Page() {
  const media = getClientMedia();
  return (
    <main className="bz-home" id="conteudo">
      <a className="skip-link" href="#lancha">Ir para nossa lancha</a>
      <section className="hero" id="inicio" aria-label="BZ Lanchas em Búzios">
        {(media.heroVideo || media.heroPoster || media.heroMobileVideo || media.heroMobilePoster) && <HeroMedia desktopVideo={media.heroVideo} mobileVideo={media.heroMobileVideo} desktopPoster={media.heroPoster} mobilePoster={media.heroMobilePoster} />}
        <SiteHeader />
        <div className="hero-content shell"><div className="hero-copy"><h1>VIVA BÚZIOS <span>PELO MAR</span></h1><p>Experiências privativas para viver Búzios de um jeito especial.</p><div className="hero-actions"><a className="button button-light" href="#lancha">CONHEÇA NOSSAS LANCHAS <ArrowDown aria-hidden="true" /></a><a className="hero-consult" href={WHATSAPP}>CONSULTAR DISPONIBILIDADE <ArrowUpRight aria-hidden="true" /></a></div></div></div>
        <a className="hero-scroll" href="#lancha" aria-label="Descer para nossa lancha"><ArrowDown aria-hidden="true" /></a>
      </section>

      <section className="boat-section shell" id="lancha" aria-labelledby="boat-title">
        <div className="section-heading"><p className="eyebrow">BZ LANCHAS</p><h2 id="boat-title">NOSSAS LANCHAS</h2><p className="boat-subtitle">Escolha sua experiência e fale diretamente com a nossa equipe.</p></div>
        <div className="fleet-list">{boats.map((boat) => <BoatCard boat={boat} key={boat.slug} />)}</div>
      </section>

      {(media.experiencePhoto || media.interiorPhoto || media.bowPhoto) && <section className="experience-section shell" aria-labelledby="experience-title">
        <div className="experience-copy"><p className="eyebrow">A EXPERIÊNCIA</p><h2 id="experience-title">BÚZIOS PELO MAR, DE UM JEITO ESPECIAL.</h2><p>Liberdade, conforto e momentos para viver com família e amigos.</p></div>
        <div className="experience-grid">{media.experiencePhoto && <div className="experience-photo experience-photo-main"><Image src={media.experiencePhoto} alt="Grupo aproveitando Búzios a bordo da BZ Lanchas" fill sizes="(max-width: 800px) 100vw, 65vw" quality={88} /></div>}<div className="experience-side">{media.interiorPhoto && <div className="experience-photo"><Image src={media.interiorPhoto} alt="Interior da FÊNIX 27.5 Gratidão" fill sizes="(max-width: 800px) 100vw, 35vw" quality={88} /></div>}{media.bowPhoto && <div className="experience-photo"><Image src={media.bowPhoto} alt="Proa da Gratidão em Búzios" fill sizes="(max-width: 800px) 100vw, 35vw" quality={88} /></div>}</div></div>
      </section>}

      <section className="reservation" id="reserva" aria-labelledby="reservation-title"><div className="reservation-inner shell"><div><h2 id="reservation-title">SEU DIA EM BÚZIOS COMEÇA PELO MAR.</h2><p>Consulte disponibilidade e fale diretamente com a BZ Lanchas.</p></div><a className="button button-whatsapp" href={WHATSAPP}><Image src="/icons/whatsapp.svg" alt="" aria-hidden="true" width={22} height={22} unoptimized />CONSULTAR DISPONIBILIDADE</a></div></section>

      <section className="work-with-us" id="trabalhe-conosco"><div className="work-inner shell"><p className="eyebrow">PARCERIAS</p><h2>TRABALHE CONOSCO</h2><p>Quer fazer parte da nossa rede de parceiros e vendedores? Fale com a BZ Lanchas e conheça nossas oportunidades de parceria.</p><a className="button button-turquoise" href={WHATSAPP}>QUERO SER PARCEIRO <ArrowUpRight aria-hidden="true" /></a></div></section>

      <footer className="site-footer"><div className="footer-grid shell">
        <div className="footer-brand"><a className="footer-logo" href="#inicio" aria-label="BZ Lanchas — início"><Image src={LOGO} alt="BZ Lanchas" width={1200} height={1200} unoptimized /></a><p>Búzios pelo mar, de um jeito especial.</p></div>
        <div className="footer-column"><h2>INSTITUCIONAL</h2><a href="#inicio">Home</a><a href="/quem-somos">Quem Somos</a><a href="/nossa-missao">Nossa Missão</a><a href="/politica-de-privacidade">Política de Privacidade</a><a href="/politica-de-cancelamento">Política de Cancelamento</a><a href="#trabalhe-conosco">Trabalhe Conosco</a></div>
        <div className="footer-column"><h2>REDES SOCIAIS</h2><a className="social-link" href="https://www.instagram.com/bzlanchas/" target="_blank" rel="noreferrer"><span className="instagram-mark" aria-hidden="true">◎</span> Instagram</a></div>
        <div className="footer-column"><h2>ATENDIMENTO</h2><a className="contact-row" href="tel:+5522997362297"><Phone aria-hidden="true" /><span>+55 (22) 99736-2297</span></a><a className="contact-row" href={WHATSAPP}><Image src="/icons/whatsapp.svg" alt="" aria-hidden="true" width={22} height={22} unoptimized /><span>WhatsApp</span></a><p>Armação dos Búzios · RJ</p></div>
      </div><div className="footer-bottom shell"><span>© 2026 BZ Lanchas</span><span>Momentos para viver e lembrar.</span></div></footer>
      <a className="floating-whatsapp" href={WHATSAPP} aria-label="Consultar disponibilidade pelo WhatsApp" title="WhatsApp"><Image src="/icons/whatsapp.svg" alt="" aria-hidden="true" width={30} height={30} unoptimized /></a>
    </main>
  );
}
