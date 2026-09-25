import type { Metadata } from "next";
import { Bath, Flame, Menu, Music2, SlidersHorizontal, Users } from "lucide-react";
import "./bzlanchas.css";

export const metadata: Metadata={title:"BZ Lanchas | Lanchas em Búzios",description:"Passeios privativos de lancha em Búzios. Consulte disponibilidade e reserve pelo WhatsApp."};
const whatsapp="https://wa.me/5522997362297?text=Ol%C3%A1%21%20Quero%20consultar%20a%20disponibilidade%20da%20BZ%20Lanchas.";
const realFeatures=[["27,5 pés","27,5 PÉS"],["Até 10 pessoas","10 PESSOAS"]];
export default function Page(){return <main className="bzRef">
<header className="refHeader"><a className="refLogo" href="#"><img src="/logolancha.jpeg" alt="BZ Lanchas"/></a><div className="refHeaderRight"><div className="languages"><button aria-label="English">🇺🇸</button><button aria-label="Português">🇧🇷</button><button aria-label="Español">🇪🇸</button></div><button className="menuBtn" aria-label="Menu"><Menu/></button></div></header>
<section className="catalogPage">
<button className="filterBtn"><SlidersHorizontal/> Filtrar</button>
<div className="boatCards">
<article className="boatCard"><div className="boatImage realBoat"><button className="arrow left">‹</button><button className="arrow right">›</button></div><div className="boatInfo"><h1>Lancha cabinada de 27,5 pés com capacidade para até 10 pessoas.</h1><p><b>BZ Lanchas</b> — embarcação privativa equipada para aproveitar Búzios com conforto, liberdade e segurança. Cabine, banheiro, som Bluetooth, pia e ducha com água doce e churrasqueira a bordo.</p><div className="chips">{realFeatures.map(([a,b])=><span key={a}>{b}</span>)}</div><div className="miniFeatures"><span><Bath/> Banheiro</span><span><Flame/> Churrasqueira</span><span><Music2/> Bluetooth</span></div><a className="reserve" href={whatsapp}>INFORMAÇÕES & RESERVAS</a></div></article>
<article className="boatCard soon"><div className="boatImage soonBoat"><span>NOVA EMBARCAÇÃO</span></div><div className="boatInfo"><h2>Nova lancha BZ Lanchas</h2><p>Este espaço está preparado para receber fotos, capacidade, características e informações da próxima embarcação.</p><div className="chips"><span>EM BREVE</span></div></div></article>
<article className="boatCard soon"><div className="boatImage soonBoat alt"><span>NOVA EMBARCAÇÃO</span></div><div className="boatInfo"><h2>Mais opções para viver Búzios pelo mar</h2><p>Novas embarcações serão adicionadas ao catálogo assim que o material da frota estiver disponível.</p><div className="chips"><span>EM BREVE</span></div></div></article>
</div></section>
<footer className="refFooter"><div className="footerGrid"><div><a className="footerLogo" href="#"><img src="/logolancha.jpeg" alt="BZ Lanchas"/></a></div><nav><a href="#">Início</a><a href="#lanchas">Lanchas</a><a href={whatsapp}>Reservas</a><a href="#">Política de privacidade</a><a href="#">Política de cancelamento</a></nav><div className="social"><b>Siga a BZ Lanchas</b><div>Instagram&nbsp;&nbsp; WhatsApp</div></div><div className="contact"><b>+55 (22) 99736-2297</b><span>WhatsApp: +55 (22) 99736-2297</span><span>Armação dos Búzios · RJ</span><span>Atendimento mediante consulta</span></div><div className="payments"><b>FORMAS DE PAGAMENTO</b><div><span>VISA</span><span>Mastercard</span><span>PIX</span></div></div></div><div className="copyright">BZ LANCHAS · ARMAÇÃO DOS BÚZIOS / RJ · BRASIL</div></footer>
<a className="floatingWhatsapp" href={whatsapp} aria-label="WhatsApp">◉</a>
</main>}