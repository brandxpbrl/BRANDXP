import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MellProductPage } from "@/components/mell-stone";
import {
  getMellProduct,
  mellProducts,
  mellStoneBrand,
} from "@/config/mell-stone.content";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return mellProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getMellProduct(slug);

  if (!product) {
    return {
      title: "Peça não encontrada | Mell & Stone",
    };
  }

  return {
    title: `${product.name} | Mell & Stone`,
    description: product.shortDescription,
    alternates: {
      canonical: `${mellStoneBrand.canonical}/product/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | Mell & Stone`,
      description: product.shortDescription,
      url: `${mellStoneBrand.canonical}/product/${product.slug}`,
      siteName: "Mell & Stone",
      type: "website",
    },
  };
}

export default async function MellStoneProductRoute({ params }: Props) {
  const { slug } = await params;
  const product = getMellProduct(slug);

  if (!product) {
    notFound();
  }

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: mellStoneBrand.name,
    },
    material: product.materials.join(", "),
    category: product.category,
    url: `${mellStoneBrand.canonical}/product/${product.slug}`,
    ...(product.images.length > 0 ? { image: product.images } : {}),
    ...(product.price !== null
      ? {
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: product.currency,
            availability:
              product.status === "available"
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <MellProductPage product={product} />
    </>
  );
}
