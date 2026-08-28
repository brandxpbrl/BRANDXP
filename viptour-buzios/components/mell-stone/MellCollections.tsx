import { mellCollections } from "@/config/mell-stone.content";
import { MellCollectionCard } from "./MellCollectionCard";
import { MellSectionHeading } from "./MellSectionHeading";

export function MellCollections() {
  return (
    <main className="mell-page">
      <section className="mell-page-hero">
        <p className="mell-eyebrow">Coleções</p>
        <h1>Arquitetura emocional da matéria.</h1>
        <p>
          As coleções funcionam como portas de entrada: Earth, Ocean, Forest,
          Fire e Signature organizam sensações, texturas e ritmos de uso.
        </p>
      </section>

      <section className="mell-section">
        <MellSectionHeading
          eyebrow="Sistema"
          title="Menos vitrine. "
          accent="Mais curadoria."
          copy="Cada coleção pode receber landing própria no futuro, mantendo a mesma linguagem e sem criar uma experiência fragmentada."
        />
        <div className="mell-collection-grid mell-collection-grid-large">
          {mellCollections.map((collection) => (
            <div key={collection.slug} id={collection.slug}>
              <MellCollectionCard collection={collection} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
