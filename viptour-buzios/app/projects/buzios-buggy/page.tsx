import type { Metadata } from "next";
import "./buzios-buggy.css";

export const metadata: Metadata = {
  title: "Búzios Buggy | Passeio de Buggy Privativo em Búzios",
  description: "Passeio de buggy privativo em Búzios: 8 praias e 3 mirantes em cerca de 1h30. Consulte disponibilidade e reserve pelo WhatsApp.",
  alternates: { canonical: "/projects/buzios-buggy" },
  openGraph: { title: "Búzios Buggy", description: "Conheça 8 praias e 3 mirantes em um passeio privativo por Búzios.", url: "https://www.riovibestransfer.com/projects/buzios-buggy" },
};

const whatsapp = "5545999686381";
const book = (service = "Passeio de Buggy Privativo") =>
  `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Olá! Gostaria de consultar disponibilidade para ${service} com a Búzios Buggy.`)}`;

const services = [
  ["🚙", "Passeio Buggy", "1h30m • Búzios", "buggy"],
  ["⛴", "Combo Búzios", "Terra/Mar", "combo"],
  ["⛵", "Passeio de Barco", "3h • Búzios", "barco"],
  ["🌴", "Arubinha", "Saindo de Búzios", "arubinha"],
  ["🐠", "Arraial do Cabo", "Saindo de Búzios", "arraial"],
  ["✈", "Transfer Privado", "Búzios ⇄ Rio (GIG)", "transfer"],
] as const;

const gallery = [
  ["Mirante de João Fernandes", "/images/hero-buggy.png"],
  ["Praias de Búzios", "/images/hero-buggy.png"],
  ["Passeio privativo", "/images/hero-buggy.png"],
  ["Buggy e mar", "/images/hero-buggy.png"],
  ["Paisagens de Búzios", "/images/hero-buggy.png"],
  ["Viagem inesquecível", "/images/hero-buggy.png"],
];
const beaches = [
  ["Praia da Armação", "Orla histórica com barcos, esculturas e o charme da cidade."],
  ["Praia dos Ossos", "Pequena praia tradicional perto do centro histórico."],
  ["Praia Brava", "Natureza exuberante e uma das paisagens mais bonitas da península."],
  ["Praia do Olho de Boi", "Enseada escondida e vista panorâmica no roteiro."],
  ["Praia do Forno", "Conhecida pela areia rosada e águas transparentes."],
  ["Praia de João Fernandes", "Mar azul e pontos especiais para fotografar."],
  ["Praia de João Fernandinho", "Enseada tranquila e natureza preservada."],
  ["Praia da Ferradura", "Águas calmas e uma das praias favoritas das famílias."],
];
const viewpoints = ["Mirante de João Fernandes", "Mirante do Forno", "Ponta da Lagoinha"];
const faq = [
  ["Quantas pessoas cabem em cada buggy?", "Até quatro passageiros, além do motorista. Para grupos maiores, consulte mais de um buggy."],
  ["Preciso pagar antecipado?", "Não. A reserva é consultada pelo WhatsApp e o pagamento é feito no dia, conforme confirmação."],
  ["O buggy busca no meu local?", "A busca em hotel, pousada ou Airbnb de Búzios está incluída nas regiões atendidas."],
  ["Quanto tempo dura o passeio?", "Aproximadamente 1h30, incluindo paradas para fotos e banho."],
  ["Qual o horário das saídas?", "Entre 8h e 16h, conforme disponibilidade."],
  ["Qual a diferença entre o passeio tradicional e o estendido?", "O estendido permite mais tempo e personalização do roteiro. Consulte condições e preço."],
];
export default function BuziosBuggyPage() {
  return <main className="bb">
    <header className="bb-header">
      <div className="bb-top"><a className="bb-logo" href="#inicio"><span>Búzios</span> Buggy</a><div className="bb-toplinks"><a href="#blog">Blog</a><span className="bb-lang bb-selected">BR</span><span className="bb-lang">US</span><span className="bb-lang">ES</span></div></div>
      <nav className="bb-services" aria-label="Passeios e serviços">{services.map(([icon, title, sub, id], i)=><a key={id} className={i===0?"bb-service active":"bb-service"} href={i===0?"#inicio":`#${id}`}><span className="bb-icon">{icon}</span><span><strong>{title}</strong><small>{sub}</small></span></a>)}</nav>
    </header>
    <section id="inicio" className="bb-hero"><div className="bb-heroshade"/><div className="bb-hero-inner"><p>EXPERIÊNCIAS EM BÚZIOS</p><h1>Passeio de Buggy Privativo em Búzios – 8 Praias e 3 Mirantes</h1></div></section>
    <section className="bb-intro bb-wrap"><div className="bb-risk"><strong>✓</strong><h3>RESERVA<br/><em>SEM RISCO</em></h3><p>SEM PAGAMENTO ANTECIPADO</p><p>SEM SINAL PARA RESERVAR</p><p>ALTERE OU CANCELE GRÁTIS*</p></div><p className="bb-lead">Descubra 8 praias e 3 mirantes em apenas 1h30 com uma experiência exclusiva, pensada para quem valoriza conforto, privacidade e atenção aos detalhes. Paradas estratégicas para fotos e banho nos cenários mais deslumbrantes da região.</p>
      <div className="bb-price"><div className="bb-pill">PROMOÇÃO ESPECIAL 2026</div><p>Mais reservado</p><div className="bb-price-line"><del>R$ 130</del><strong>R$ 100</strong><span>/pessoa</span></div><hr/><p>Crianças: 0–5 anos grátis · 6–10 anos meia · 11+ inteira</p><p>Pagamento no dia · Consulte disponibilidade</p></div>
      <a className="bb-button" href={book()} target="_blank" rel="noopener noreferrer">☏ Reservar pelo WhatsApp</a>
      <div className="bb-benefits">{["◷ Duração média: 1h30","♙ Tour 100% privativo","⌖ Busca na hospedagem","▣ Saídas das 08h às 16h"].map(t=><div key={t}>{t}</div>)}</div>
      <div className="bb-info"><h3>♧ Reserva Segura e Sem Compromisso</h3><p>✓ Zero pagamento antecipado: reserve sem sinal e pague no dia ao guia.</p><p>✓ Busca inclusa: buscamos você no hotel, pousada ou Airbnb.</p><p>✓ Segurança e atendimento com confirmação pelo WhatsApp.</p></div>
    </section>
    <section id="galeria" className="bb-section bb-wrap"><h2>Galeria do Passeio de Buggy em Búzios</h2><p className="bb-subtitle">Uma prévia da experiência que espera por você.</p><div className="bb-gallery">{gallery.map(([name,img],i)=><div key={i} className={i===0?"bb-gallery-tall":""}><img src={img} alt={name} loading="lazy"/></div>)}</div></section>
    <section id="roteiro" className="bb-section bb-wrap"><h2>Roteiro Tradicional de Buggy em Búzios</h2><div className="bb-route"><p>✓ 8 praias & 3 mirantes</p><p>✓ Paradas flexíveis para fotos e banho</p><p>⌖ Orla Bardot → Armação → Ossos → Brava → Forno → João Fernandes → Ferradura</p></div><div className="bb-mapnote">Roteiro pela península de Armação dos Búzios</div><h3>8 Praias</h3><div className="bb-placegrid">{beaches.map(([name,desc],i)=><article key={name}><img src="/images/hero-buggy.png" alt={name} loading="lazy"/><div><strong>{i+1}. {name}</strong><p>{desc}</p></div></article>)}</div><h3>3 Mirantes</h3><div className="bb-placegrid">{viewpoints.map((name,i)=><article key={name}><img src="/images/hero-buggy.png" alt={name} loading="lazy"/><div><strong>{i+1}. {name}</strong><p>Parada especial para contemplar e fotografar a paisagem.</p></div></article>)}</div><h3>Pontos Históricos no Caminho</h3><div className="bb-placegrid">{["Orla Bardot & Estátua de Brigitte Bardot","Monumento dos Três Pescadores","Igreja de Sant’Anna (1740)"].map(name=><article key={name}><div><strong>{name}</strong><p>Um encontro com a história e a cultura de Búzios.</p></div></article>)}</div></section>
    <section id="combo" className="bb-extended"><div className="bb-wrap"><h2>Quer Descobrir Ainda Mais de Búzios?</h2><img src="/images/hero-buggy.png" alt="Paisagens de Búzios" loading="lazy"/><p>Além do passeio tradicional, também oferecemos uma experiência estendida com mais tempo e roteiro personalizado.</p><div className="bb-info"><h3>Uma Experiência 100% Personalizada</h3><p>Converse com a gente para adaptar o percurso ao seu ritmo e aos pontos que deseja conhecer.</p></div><a className="bb-button" href={book("Passeio Estendido de Buggy")} target="_blank" rel="noopener noreferrer">Solicitar orçamento no WhatsApp</a></div></section>
    <section id="barco" className="bb-extra bb-wrap"><h2>Outras Experiências</h2><div className="bb-other">{services.slice(2).map(([,name,desc,id])=><article id={id} key={id}><strong>{name}</strong><p>{desc}</p><a href={book(name)} target="_blank" rel="noopener noreferrer">Consultar disponibilidade →</a></article>)}</div></section>
    <section className="bb-section bb-wrap"><h2>Perguntas Frequentes</h2><div className="bb-faq">{faq.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section>
    <section className="bb-section bb-wrap"><h2>Onde Atuamos em Búzios</h2><iframe title="Mapa de Búzios" src="https://www.google.com/maps?q=Arma%C3%A7%C3%A3o%20dos%20B%C3%BAzios%2C%20RJ&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/></section>
    <section id="blog" className="bb-section bb-wrap"><h2>Guia de Viagem</h2><p className="bb-subtitle">Explore praias, passeios e experiências inesquecíveis em Búzios.</p></section>
    <footer className="bb-footer"><div className="bb-wrap"><strong><span>Búzios</span> Buggy</strong><p>Armação dos Búzios · Rio de Janeiro · Brasil</p><p>Reservas e informações pelo WhatsApp: +55 45 99968-6381</p><small>© {new Date().getFullYear()} Búzios Buggy</small></div></footer>
    <a className="bb-floating" aria-label="Reservar por WhatsApp" href={book()} target="_blank" rel="noopener noreferrer">☏</a>
  </main>;
}
