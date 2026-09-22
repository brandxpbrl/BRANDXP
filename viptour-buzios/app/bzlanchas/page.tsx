import type { Metadata } from "next";
import { Anchor, Bath, Bluetooth, Droplets, Flame, Ship, Users, Waves } from "lucide-react";
import "./bzlanchas.css";

export const metadata: Metadata = {
  title: "BZ Lanchas | Passeio Privativo em Búzios",
  description: "Passeio privativo em Búzios a bordo de uma lancha cabinada de 27,5 pés para até 10 pessoas.",
};

const whatsapp = "https://wa.me/5522992362297?text=Ol%C3%A1%21%20Quero%20consultar%20a%20disponibilidade%20da%20BZ%20Lanchas.";

const roteiro = ["Armação","Praia do Canto","Amores","Tartaruguinha","Tartaruga","Ossos","Azeda","Azedinha","João Fernandes","João Fernandinho"];

export default function BZLanchasPage() {
  return (
    <main className="bz">
      <header className="bz-nav">
        <a className="bz-logo" href="#inicio" aria-label="BZ Lanchas"><span>BZ</span><small>LANCHAS</small></a>
        <nav><a href="#lancha">A lancha</a><a href="#roteiro">Roteiro</a><a href="#incluso">Incluso</a></nav>
        <a className="bz-nav-cta" href={whatsapp} target="_blank" rel="noreferrer">Reservar</a>
      </header>

      <section className="bz-hero" id="inicio">
        <div className="bz-overlay" />
        <div className="bz-hero-content">
          <p className="bz-kicker">PASSEIO PRIVATIVO • BÚZIOS</p>
          <h1>Búzios visto<br/><em>de outro ângulo.</em></h1>
          <p className="bz-lead">Um dia no mar, no seu ritmo. Conforto, liberdade e os cenários mais desejados da península.</p>
          <a className="bz-primary" href={whatsapp} target="_blank" rel="noreferrer">CONSULTAR DISPONIBILIDADE <span>→</span></a>
        </div>
        <div className="bz-stats">
          <div><strong>27,5</strong><span>PÉS</span></div><div><strong>10</strong><span>PESSOAS</span></div><div><strong>100%</strong><span>PRIVATIVO</span></div>
        </div>
      </section>

      <section className="bz-intro" id="lancha">
        <p className="bz-kicker dark">SUA EXPERIÊNCIA NO MAR</p>
        <h2>Seu barco. Seu grupo.<br/><em>Seu dia.</em></h2>
        <p>Uma lancha cabinada preparada para você aproveitar Búzios com privacidade, conforto e estrutura para curtir cada parada.</p>
        <div className="bz-features">
          <article><Ship/><h3>Lancha cabinada</h3><p>27,5 pés com espaço para até 10 pessoas.</p></article>
          <article><Bath/><h3>Cabine + banheiro</h3><p>Quarto e banheiro com vaso sanitário elétrico.</p></article>
          <article><Bluetooth/><h3>Som Bluetooth</h3><p>Sua trilha sonora durante toda a experiência.</p></article>
          <article><Droplets/><h3>Água doce</h3><p>Pia e ducha com água doce a bordo.</p></article>
          <article><Flame/><h3>Churrasqueira</h3><p>Mais liberdade para aproveitar o dia no mar.</p></article>
          <article><Users/><h3>Até 10 pessoas</h3><p>Ideal para família, amigos e momentos especiais.</p></article>
        </div>
      </section>

      <section className="bz-route" id="roteiro">
        <div className="bz-route-copy"><p className="bz-kicker">UM ROTEIRO. VÁRIOS PARAÍSOS.</p><h2>Descubra Búzios<br/><em>pelo mar.</em></h2><p>Uma sequência de paisagens icônicas para viver a península de um ponto de vista completamente diferente.</p></div>
        <div className="bz-route-list">{roteiro.map((lugar, i)=><div key={lugar}><span>{String(i+1).padStart(2,"0")}</span><strong>{lugar}</strong></div>)}</div>
      </section>

      <section className="bz-included" id="incluso">
        <p className="bz-kicker dark">JÁ ESTÁ INCLUSO</p><h2>Você só precisa<br/><em>aproveitar.</em></h2>
        <div className="bz-included-grid"><div><Waves/><strong>Gelo em escamas</strong></div><div><Flame/><strong>Carvão</strong></div><div><Droplets/><strong>Água mineral</strong></div></div>
      </section>

      <section className="bz-final">
        <Anchor/>
        <p className="bz-kicker">BZ LANCHAS • BÚZIOS</p>
        <h2>O mar está<br/><em>te esperando.</em></h2>
        <p>Consulte valores e disponibilidade para o seu dia em Búzios.</p>
        <a className="bz-primary" href={whatsapp} target="_blank" rel="noreferrer">FALAR NO WHATSAPP <span>→</span></a>
      </section>
      <footer><div className="bz-logo"><span>BZ</span><small>LANCHAS</small></div><p>Experiências privativas no mar de Búzios.</p></footer>
    </main>
  );
}