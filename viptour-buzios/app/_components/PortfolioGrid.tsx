import Image from "next/image";

export type PortfolioItem = {
  title: string;
  category: string;
  src: string;
  alt: string;
};

type PortfolioGridProps = {
  items: PortfolioItem[];
};

export function PortfolioGrid({ items }: PortfolioGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <article key={item.title} className="card overflow-hidden bg-white">
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
            <Image src={item.src} alt={item.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain p-4" />
          </div>
          <div className="p-5">
            <p className="text-caption text-text-secondary">{item.category}</p>
            <h3 className="mt-2 text-h3 text-text-primary">{item.title}</h3>
          </div>
        </article>
      ))}
    </div>
  );
}
