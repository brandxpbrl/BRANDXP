import Image from "next/image";
import Link from "next/link";
import type { MellProduct } from "@/config/mell-stone.content";
import { mellCollections, mellStoneBrand } from "@/config/mell-stone.content";

export function MellProductPage({ product }: { product: MellProduct }) {
  const collection = mellCollections.find((item) => item.slug === product.collection);
  const hasImages = product.images.length > 0;

  return (
    <main className="mell-page">
      <section className="mell-product-detail">
        <div className="mell-product-gallery">
          {hasImages ? (
            product.images.map((image, index) => (
              <div className="mell-product-detail-image" key={image}>
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  sizes="(max-width: 900px) 100vw, 48vw"
                  priority={index === 0}
                />
              </div>
            ))
          ) : (
            <div className="mell-product-detail-image mell-product-placeholder">
              <span>Fotografia real pendente</span>
              <strong>M&S</strong>
            </div>
          )}
        </div>

        <aside className="mell-product-info">
          <p className="mell-eyebrow">
            {collection?.name ?? product.collection} / {product.category}
          </p>
          <h1>{product.name}</h1>
          <p>{product.description}</p>

          <div className="mell-product-purchase">
            <span>{product.price === null ? "Preço sob consulta" : `R$ ${product.price}`}</span>
            <a className="mell-button mell-button-dark" href={mellStoneBrand.whatsapp}>
              Consultar peça
            </a>
          </div>

          {product.status === "available" ? (
            <p className="mell-product-note">
              Peça única disponível mediante confirmação de preço, medidas e prazo
              de entrega pelo atendimento Mell & Stone.
            </p>
          ) : null}

          <div className="mell-accordions">
            <details open>
              <summary>Materiais</summary>
              <p>{product.materials.join(", ")}</p>
            </details>
            <details>
              <summary>Medidas e acabamento</summary>
              <p>
                Medidas: {product.dimensions}. Acabamento: {product.hardware}.
              </p>
            </details>
            <details>
              <summary>Cuidados</summary>
              <p>{product.care}</p>
            </details>
          </div>

          <Link className="mell-text-link" href="/mell-stone/shop">
            Voltar ao shop
          </Link>
        </aside>
      </section>
    </main>
  );
}
