import { mellMaterials } from "@/config/mell-stone.content";
import { MellMaterialCard } from "./MellMaterialCard";
import { MellSectionHeading } from "./MellSectionHeading";

export function MellMaterials() {
  return (
    <main className="mell-page">
      <section className="mell-page-hero mell-page-hero-dark">
        <p className="mell-eyebrow">Arquivo de materiais</p>
        <h1>O luxo começa na superfície.</h1>
        <p>
          Um arquivo simples para documentar o repertório mineral e orgânico da
          marca sem transformar matéria natural em promessa exagerada.
        </p>
      </section>

      <section className="mell-section">
        <MellSectionHeading
          eyebrow="Matéria-prima"
          title="Pedras e pérolas descritas por "
          accent="forma, luz e textura."
        />
        <div className="mell-material-grid">
          {mellMaterials.map((material) => (
            <MellMaterialCard key={material.slug} material={material} />
          ))}
        </div>
      </section>
    </main>
  );
}
