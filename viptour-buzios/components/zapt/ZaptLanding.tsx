"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Clock3, Crown, MapPin, MessageCircle, Volume2, VolumeX, Zap } from "lucide-react";
import hero from "@/images/ChatGPT Image 15 may 2026, 23_03_53.png";
import delivery from "@/images/ChatGPT Image 15 may 2026, 05_44_13.png";
import menu from "@/images/ChatGPT Image 15 may 2026, 05_05_50.png";
import beers from "@/images/ChatGPT Image 15 may 2026, 05_05_44.png";
import fastFood from "@/images/ChatGPT Image 15 may 2026, 05_17_50.png";
import cigarettes from "@/images/ChatGPT Image 15 may 2026, 05_12_06.png";
import drinks from "@/images/ChatGPT Image 15 may 2026, 21_14_19.png";
import combos from "@/images/ChatGPT Image 15 may 2026, 21_41_34.png";
import dog from "@/images/ChatGPT Image 15 may 2026, 21_15_36.png";
import zaptLogo from "@/images/zapt-logo-original.png";
import { zaptFaqItems } from "@/config/zapt-seo";

const whatsapp = "https://wa.me/5522992430867?text=Ol%C3%A1%20ZAPT!%20Vim%20pelo%20site%20e%20quero%20fazer%20um%20pedido%20%E2%9A%A1";
const comboWhatsapp = (name: string) => `https://wa.me/5522992430867?text=${encodeURIComponent(`Olá ZAPT! Quero pedir o ${name}.`)}`;

const menuSections: { label: string; eyebrow: string; image: StaticImageData }[] = [
  { label: "Bebidas", eyebrow: "Geladas e prontas", image: drinks },
  { label: "Cervejas", eyebrow: "Da geladeira pra tua noite", image: beers },
  { label: "Vinhos & destilados", eyebrow: "Pra subir o nível", image: menu },
  { label: "Fast food", eyebrow: "Fome de madrugada", image: fastFood },
  { label: "Cigarros", eyebrow: "Entrega rápida", image: cigarettes },
];

const combosList = ["Combo Brahma", "Combo Heineken", "Combo ZAPT Night", "Combo Corona"];

function TrackLink({ href, children, event }: { href: string; children: React.ReactNode; event: string }) {
  return <a href={href} onClick={() => window.dispatchEvent(new CustomEvent(`zapt:${event}`))}>{children}</a>;
}

export default function ZaptLanding() {
  const [activeMenu, setActiveMenu] = useState(0);
  const [videoMuted, setVideoMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const selectedMenu = menuSections[activeMenu];

  const toggleVideoSound = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setVideoMuted(videoRef.current.muted);
  };

  return (
    <main className="zapt-page" lang="pt-BR">
      <header className="zapt-nav">
        <a className="zapt-logo" href="#top" aria-label="ZAPT Delivery Búzios">
          <Image src={zaptLogo} alt="ZAPT Delivery Búzios" priority />
        </a>
        <nav aria-label="Navegação da ZAPT">
          <a href="#cardapio">Cardápio</a><a href="#combos">Combos</a><a href="#como-funciona">Como funciona</a>
        </nav>
        <TrackLink href={whatsapp} event="whatsapp_click"><span className="zapt-nav-cta">Pedir agora <ArrowUpRight size={16} /></span></TrackLink>
      </header>

      <section className="zapt-hero" id="top">
        <div className="zapt-hero-ambient" aria-hidden="true">
          <Image src={hero} alt="" priority sizes="100vw" />
        </div>
        <div className="zapt-hero-copy">
          <p className="zapt-kicker"><Zap size={15} /> Búzios after dark · delivery imediato</p>
          <h1>Delivery em<br /><em>Búzios de<br />madrugada.</em></h1>
          <p className="zapt-hero-brand-line">A madrugada agora tem outro nome. <strong>ZAPT.</strong></p>
          <p className="zapt-hero-lede">Quando a maioria fecha, a <strong>ZAPT</strong> começa. Bebidas geladas, lanches e combos para a tua noite continuar.</p>
          <div className="zapt-hero-actions">
            <TrackLink href={whatsapp} event="whatsapp_click"><span className="zapt-button zapt-button--acid"><MessageCircle size={19} /> Pedir pelo WhatsApp <Zap size={16} /></span></TrackLink>
            <a className="zapt-button zapt-button--ghost" href="#cardapio">Ver cardápio <ArrowDown size={16} /></a>
          </div>
          <div className="zapt-hero-meta"><span><Clock3 size={16} /> 23:00 — 04:00</span><span><MapPin size={16} /> Búzios — RJ</span></div>
        </div>
        <div className="zapt-hero-art"><Image src={hero} alt="ZAPT Delivery Búzios durante a madrugada" priority sizes="(max-width: 760px) 100vw, 52vw" /></div>
        <div className="zapt-scribble">a noite<br /><b>começa aqui.</b></div>
      </section>

      <section className="zapt-cinema zapt-wrap" aria-labelledby="zapt-cinema-title">
        <div className="zapt-cinema-copy">
          <p className="zapt-eyebrow"><Zap size={15} /> A energia da madrugada</p>
          <h2 id="zapt-cinema-title">Não é só<br />delivery.<br /><em>É ZAPT.</em></h2>
          <p>A cidade desacelera. A fome aparece. A bebida acaba. É nesse momento que a ZAPT entra em cena.</p>
          <div className="zapt-cinema-signature"><span>8 segundos</span><span>Búzios after dark</span><span>Delivery imediato</span></div>
        </div>
        <div className="zapt-cinema-frame">
          <div className="zapt-cinema-glow" aria-hidden="true">
            <video autoPlay loop muted playsInline preload="metadata"><source src="/zapt/zapt-cinematic.mp4" type="video/mp4" /></video>
          </div>
          <video ref={videoRef} autoPlay loop muted playsInline preload="metadata" poster={hero.src}>
            <source src="/zapt/zapt-cinematic.mp4" type="video/mp4" />
          </video>
          <button aria-label={videoMuted ? "Ativar som do vídeo" : "Desativar som do vídeo"} onClick={toggleVideoSound} type="button">
            {videoMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}{videoMuted ? "Ativar som" : "Desativar som"}
          </button>
          <span className="zapt-cinema-label">ZAPT / FILM 01</span>
        </div>
      </section>

      <section className="zapt-proof zapt-wrap">
        <p className="zapt-eyebrow">A cidade dorme. A gente entrega.</p>
        <h2>Tua noite não precisa acabar.</h2>
        <p className="zapt-section-lede">Bateu fome? Acabou a bebida? Precisa de gelo? A ZAPT leva a madrugada até você, com rapidez e atitude.</p>
        <div className="zapt-proof-grid"><div><Zap /><b>Delivery de madrugada</b><span>Rápido como raio.</span></div><div><Clock3 /><b>Das 23h às 04h</b><span>Quando você mais precisa.</span></div><div><MapPin /><b>Búzios — RJ</b><span>A noite começa aqui.</span></div></div>
      </section>

      <section className="zapt-menu zapt-wrap" id="cardapio">
        <div className="zapt-section-head"><div><p className="zapt-eyebrow">Escolhe teu mood</p><h2>O que vai salvar<br /><em>tua madrugada?</em></h2></div><TrackLink href={whatsapp} event="menu_click"><span className="zapt-text-link">Ver cardápio completo <ArrowUpRight size={17} /></span></TrackLink></div>
        <div className="zapt-menu-experience">
          <div className="zapt-menu-tabs" role="tablist" aria-label="Categorias do cardápio">
            {menuSections.map((section, index) => (
              <button
                aria-selected={activeMenu === index}
                className={activeMenu === index ? "is-active" : ""}
                key={section.label}
                onClick={() => setActiveMenu(index)}
                role="tab"
                type="button"
              >
                <span>0{index + 1}</span>{section.label}
              </button>
            ))}
          </div>
          <div className="zapt-menu-stage" role="tabpanel">
            <div className="zapt-menu-poster">
              <Image src={selectedMenu.image} alt={`Cardápio de ${selectedMenu.label} da ZAPT Delivery`} sizes="(max-width: 760px) 100vw, 62vw" priority={activeMenu === 0} />
            </div>
            <aside>
              <span className="zapt-menu-number">0{activeMenu + 1}</span>
              <p>{selectedMenu.eyebrow}</p>
              <h3>{selectedMenu.label}</h3>
              <p className="zapt-menu-help">Escolheu? Envie a categoria pelo WhatsApp e confirme disponibilidade, valor e entrega.</p>
              <TrackLink href={comboWhatsapp(selectedMenu.label)} event="menu_click">
                <span className="zapt-button zapt-button--acid"><MessageCircle size={18} /> Pedir {selectedMenu.label}</span>
              </TrackLink>
            </aside>
          </div>
        </div>
        <div className="zapt-menu-note"><span><Zap size={18} /> Produtos e valores confirmados no cardápio oficial.</span><span>Peça pelo WhatsApp e consulte disponibilidade.</span></div>
      </section>

      <section className="zapt-combos zapt-wrap" id="combos">
        <div className="zapt-section-head"><div><p className="zapt-eyebrow">Para dividir. Ou não.</p><h2>Combos pra<br /><em>madrugada.</em></h2></div><Crown className="zapt-crown" /></div>
        <div className="zapt-combo-layout"><div className="zapt-combo-art"><Image src={combos} alt="Combos de cervejas ZAPT" sizes="(max-width: 760px) 100vw, 55vw" /></div><div className="zapt-combo-list">{combosList.map((combo, index) => <a href={comboWhatsapp(combo)} key={combo} onClick={() => window.dispatchEvent(new CustomEvent("zapt:combo_click"))}><span>0{index + 1}</span><strong>{combo}</strong><ArrowUpRight size={18} /></a>)}<p>Escolhe teu combo e manda uma mensagem. A ZAPT resolve o resto.</p></div></div>
      </section>

      <section className="zapt-process zapt-wrap" id="como-funciona"><p className="zapt-eyebrow">Sem complicação</p><h2>3 toques. <em>ZAPT.</em></h2><div className="zapt-process-grid"><div><span>01</span><b>Escolhe</b><p>O que a tua noite está pedindo.</p></div><div><span>02</span><b>Chama</b><p>Fala com a gente no WhatsApp.</p></div><div><span>03</span><b>Chegou</b><p>A ZAPT leva até você em Búzios.</p></div></div></section>

      <section className="zapt-night"><Image src={delivery} alt="Entregador ZAPT pelas ruas de Búzios à noite" sizes="100vw" /><div className="zapt-night-overlay"><p className="zapt-eyebrow">A madrugada agora tem outro nome</p><h2>Quando Búzios dorme,<br /><em>a ZAPT acelera.</em></h2></div></section>

      <section className="zapt-local-seo zapt-wrap" aria-labelledby="zapt-local-title">
        <div className="zapt-local-seo-copy">
          <p className="zapt-eyebrow"><MapPin size={15} /> Búzios — RJ</p>
          <h2 id="zapt-local-title">Delivery em Búzios<br /><em>das 23h às 04h.</em></h2>
          <p>Procurando delivery em Búzios durante a madrugada? A ZAPT entrega lanches, bebidas, cervejas, gelo e combos para sua noite. Peça pelo WhatsApp e receba seu pedido em Búzios.</p>
        </div>
        <div className="zapt-local-seo-facts">
          <span><Clock3 size={17} /> 23:00 — 04:00</span>
          <span><MapPin size={17} /> Armação dos Búzios · RJ · Brasil</span>
          <span><MessageCircle size={17} /> Pedidos pelo WhatsApp</span>
        </div>
      </section>

      <section className="zapt-faq zapt-wrap" aria-labelledby="zapt-faq-title">
        <p className="zapt-eyebrow"><Zap size={15} /> Perguntas frequentes</p>
        <h2 id="zapt-faq-title">ZAPT RESPONDE <em>⚡</em></h2>
        <div className="zapt-faq-list">
          {zaptFaqItems.map((item) => (
            <details key={item.question}>
              <summary>{item.question}<span>+</span></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="zapt-final zapt-wrap"><div><p className="zapt-eyebrow"><Zap size={15} /> Tá esperando o quê?</p><h2>Bateu fome?<br />Ficou sem bebida?<br /><em>A ZAPT resolve.</em></h2></div><div className="zapt-final-card"><Image src={dog} alt="Hot dog Oh My Dog da ZAPT" sizes="(max-width: 760px) 100vw, 45vw" /><TrackLink href={whatsapp} event="whatsapp_click"><span className="zapt-button zapt-button--acid"><MessageCircle size={19} /> Pedir agora no WhatsApp</span></TrackLink><small>+55 22 99243-0867 · Búzios — RJ</small></div></section>

      <footer className="zapt-footer"><div className="zapt-logo"><Image src={zaptLogo} alt="ZAPT Delivery Búzios" /></div><div><b>Delivery de madrugada</b><span>23:00 — 04:00 · Búzios — Rio de Janeiro</span></div><TrackLink href={whatsapp} event="whatsapp_click"><span className="zapt-footer-link">WhatsApp <ArrowUpRight size={16} /></span></TrackLink><small>© ZAPT Delivery Búzios</small></footer>
      <a className="zapt-floating" href={whatsapp} onClick={() => window.dispatchEvent(new CustomEvent("zapt:whatsapp_click"))}><MessageCircle size={20} /> Pedir agora <Zap size={15} /></a>
    </main>
  );
}

