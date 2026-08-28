import Link from "next/link";
import type { MellCollection } from "@/config/mell-stone.content";

export function MellCollectionCard({ collection }: { collection: MellCollection }) {
  return (
    <article className={`mell-collection-card mell-collection-${collection.slug}`}>
      <div className="mell-collection-orb" aria-hidden="true" />
      <p className="mell-eyebrow">{collection.mood}</p>
      <h3>{collection.name}</h3>
      <p>{collection.description}</p>
      <Link href={`/mell-stone/collections#${collection.slug}`}>Explorar coleção</Link>
    </article>
  );
}
