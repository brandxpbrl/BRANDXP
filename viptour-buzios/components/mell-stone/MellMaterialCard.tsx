import type { MellMaterial } from "@/config/mell-stone.content";

export function MellMaterialCard({ material }: { material: MellMaterial }) {
  return (
    <article className="mell-material-card" id={material.slug}>
      <span className="mell-material-dot" aria-hidden="true" />
      <h3>{material.name}</h3>
      <p>{material.description}</p>
      <div className="mell-material-tags">
        {material.visualCharacteristics.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </article>
  );
}
