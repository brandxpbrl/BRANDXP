import { mellCategories, mellProducts } from "@/config/mell-stone.content";
import { MellProductCard } from "./MellProductCard";
import { MellSectionHeading } from "./MellSectionHeading";

export function MellShop() {
  return (
    <main className="mell-page">
      <section className="mell-page-hero">
        <p className="mell-eyebrow">Shop</p>
        <h1>Catálogo em curadoria.</h1>
        <p>
          Uma seleção de peças artesanais construídas a partir de pedras naturais,
          pérolas e materiais escolhidos com atenção ao detalhe.
        </p>
      </section>

      <section className="mell-section mell-section-tight">
        <div className="mell-category-row">
          {mellCategories.map((category) => (
            <a key={category} href={`#${category}`}>
              {category}
            </a>
          ))}
        </div>
      </section>

      <section className="mell-section mell-section-sand">
        <MellSectionHeading
          eyebrow="Peças"
          title="Peças únicas, "
          accent="histórias reais."
          copy="As criações abaixo estão disponíveis para consulta privada. Preço, medidas e prazo são confirmados individualmente pelo atendimento Mell & Stone."
        />
        <div className="mell-product-grid">
          {mellProducts.map((product) => (
            <MellProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
