import Link from "next/link";
import { mellStoneBrand } from "@/config/mell-stone.content";

export function MellContact() {
  return (
    <main className="mell-page">
      <section className="mell-page-hero">
        <p className="mell-eyebrow">Contato</p>
        <h1>Atendimento calmo, direto e personalizado.</h1>
        <p>
          Para consultar uma peça, pedir uma seleção curada ou confirmar
          disponibilidade, o fluxo principal por agora é conversa direta.
        </p>
        <div className="mell-actions">
          <a className="mell-button mell-button-dark" href={mellStoneBrand.whatsapp}>
            Falar no WhatsApp
          </a>
          <Link className="mell-button mell-button-light" href="/mell-stone/shop">
            Ver catálogo
          </Link>
        </div>
      </section>

      <section className="mell-contact-panel">
        <article>
          <p className="mell-eyebrow">Disponibilidade</p>
          <h2>Peças únicas exigem confirmação manual.</h2>
          <p>
            Antes de publicar valores, estoque ou variações, cada item precisa
            estar fotografado, descrito e validado. Assim evitamos vender uma
            promessa em vez de uma peça real.
          </p>
        </article>
        <article>
          <p className="mell-eyebrow">Canais</p>
          <a href={mellStoneBrand.whatsapp}>WhatsApp</a>
          <a href={mellStoneBrand.instagram}>Instagram</a>
        </article>
      </section>
    </main>
  );
}
