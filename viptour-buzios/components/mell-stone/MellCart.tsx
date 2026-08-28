import Link from "next/link";
import { mellStoneBrand } from "@/config/mell-stone.content";

export function MellCart() {
  return (
    <main className="mell-page">
      <section className="mell-page-hero mell-cart-empty">
        <p className="mell-eyebrow">Carrinho</p>
        <h1>Compra direta em preparação.</h1>
        <p>
          O carrinho existe como rota estratégica, mas não está conectado a
          pagamento ou estoque real nesta fase. Enquanto o catálogo é confirmado,
          as consultas acontecem por atendimento direto.
        </p>
        <div className="mell-actions">
          <a className="mell-button mell-button-dark" href={mellStoneBrand.whatsapp}>
            Consultar peças
          </a>
          <Link className="mell-button mell-button-light" href="/mell-stone/shop">
            Voltar ao shop
          </Link>
        </div>
      </section>
    </main>
  );
}
