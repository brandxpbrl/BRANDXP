import Image from "next/image";
import Link from "next/link";
import {
  mellCollections,
  mellMaterials,
  mellProducts,
  mellStoneBrand,
} from "@/config/mell-stone.content";
import { MellCollectionCard } from "./MellCollectionCard";
import { MellMaterialCard } from "./MellMaterialCard";
import { MellProductCard } from "./MellProductCard";
import { MellSectionHeading } from "./MellSectionHeading";

export function MellHome() {
  const featuredProducts = mellProducts.filter((product) => product.featured);

  return (
    <main className="mell-page">
      <section className="mell-hero">
        <div className="mell-hero-copy">
          <p className="mell-eyebrow">{mellStoneBrand.essence}</p>
          <h1>MELL & STONE</h1>
          <p className="mell-hero-tagline">{mellStoneBrand.tagline}</p>
          <p>
            Joias artesanais que revelam a beleza irrepetível dos minerais naturais.
            Cada peça nasce do encontro entre matéria, tempo, arte e mãos humanas.
          </p>
          <div className="mell-actions">
            <Link className="mell-button mell-button-dark" href="/mell-stone/shop">
              Ver peças
            </Link>
            <Link className="mell-button mell-button-light" href="/mell-stone/about">
              Conhecer a maison
            </Link>
          </div>
        </div>

        <div className="mell-hero-visual" aria-label="Mell & Stone visual identity">
          <Image
            src="/images/mell-stone/products/conjunto-perolas-cristal-01.png"
            alt="Conjunto artesanal de pérolas e cristais naturais Mell & Stone"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 48vw"
          />
          <div className="mell-hero-stone" />
        </div>
      </section>

      <section className="mell-statement">
        <p className="mell-eyebrow">Manifesto</p>
        <h2>{mellStoneBrand.statement}</h2>
        <p>{mellStoneBrand.manifesto}</p>
      </section>

      <section className="mell-section">
        <MellSectionHeading
          eyebrow="Coleções"
          title="Cinco leituras da "
          accent="matéria."
          copy="A loja nasce organizada por atmosferas, não por excesso de produto. Cada coleção aproxima você da matéria antes da escolha."
        />
        <div className="mell-collection-grid">
          {mellCollections.map((collection) => (
            <MellCollectionCard key={collection.slug} collection={collection} />
          ))}
        </div>
      </section>

      <section className="mell-section mell-section-sand">
        <MellSectionHeading
          eyebrow="Shop preview"
          title="Peças únicas, "
          accent="sem pressa."
          copy="Peças artesanais fotografadas em seu próprio universo: matéria natural, luz suave e detalhes que não se repetem."
        />
        <div className="mell-product-grid">
          {featuredProducts.map((product) => (
            <MellProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mell-editorial-split">
        <div>
          <p className="mell-eyebrow">Processo</p>
          <h2>
            Não aceleramos a natureza. <span>Apenas escutamos a forma.</span>
          </h2>
        </div>
        <div className="mell-process-list">
          {["Curadoria da matéria", "Composição manual", "Finalização", "Entrega ritual"].map(
            (item, index) => (
              <article key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item}</h3>
                <p>
                  Uma etapa pensada para preservar textura, proporção e presença
                  sem transformar a peça em produto genérico.
                </p>
              </article>
            ),
          )}
        </div>
      </section>

      <section className="mell-section">
        <MellSectionHeading
          eyebrow="Materiais"
          title="Pedras, pérolas e superfícies "
          accent="naturais."
          copy="O arquivo de materiais descreve apenas características visuais e táteis. Sem promessas terapêuticas, sem exageros: matéria, origem e beleza."
        />
        <div className="mell-material-grid">
          {mellMaterials.slice(0, 6).map((material) => (
            <MellMaterialCard key={material.slug} material={material} />
          ))}
        </div>
        <Link className="mell-text-link" href="/mell-stone/materials">
          Ver arquivo completo
        </Link>
      </section>

      <section className="mell-final-cta">
        <p className="mell-eyebrow">Atendimento privado</p>
        <h2>Uma peça natural não precisa gritar para permanecer.</h2>
        <p>
          Consulte disponibilidade, reserve uma peça ou solicite uma seleção
          curada diretamente pelo WhatsApp.
        </p>
        <a className="mell-button mell-button-dark" href={mellStoneBrand.whatsapp}>
          Falar com Mell & Stone
        </a>
      </section>
    </main>
  );
}
