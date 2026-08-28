import Image from "next/image";
import Link from "next/link";
import type { MellProduct } from "@/config/mell-stone.content";

type MellProductCardProps = {
  product: MellProduct;
};

export function MellProductCard({ product }: MellProductCardProps) {
  const hasImage = product.images.length > 0;

  return (
    <article className="mell-product-card">
      <Link href={`/mell-stone/product/${product.slug}`} className="mell-product-image">
        {hasImage ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 760px) 100vw, 33vw"
          />
        ) : (
          <div className="mell-product-placeholder">
            <span>Imagem em curadoria</span>
            <strong>M&S</strong>
          </div>
        )}
      </Link>
      <div className="mell-product-body">
        <div>
          <p className="mell-eyebrow">
            {product.collection} / {product.category}
          </p>
          <h3>
            <Link href={`/mell-stone/product/${product.slug}`}>{product.name}</Link>
          </h3>
        </div>
        <p>{product.shortDescription}</p>
        <div className="mell-product-meta">
          <span>{product.isUnique ? "Peça única" : "Coleção"}</span>
          <span>{product.price === null ? "Sob consulta" : `R$ ${product.price}`}</span>
        </div>
        {product.status === "available" ? (
          <span className="mell-status">Disponível para consulta</span>
        ) : null}
      </div>
    </article>
  );
}
