import Link from "next/link";
import { ReactNode } from "react";

type PortalPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  ctas?: Array<{
    label: string;
    href: string;
    variant?: "primary" | "secondary";
  }>;
};

type PortalCardGridProps = {
  items: Array<{
    title: string;
    description: string;
    href?: string;
    cta?: string;
  }>;
};

export function PortalPage({ eyebrow, title, description, children, ctas }: PortalPageProps) {
  return (
    <main className="px-4 py-24 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-[var(--container-default)]">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-text-secondary">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-text-primary sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-text-secondary">{description}</p>

          {ctas && ctas.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {ctas.map((cta) => (
                <Link
                  key={cta.href}
                  href={cta.href}
                  className={
                    cta.variant === "secondary"
                      ? "interactive inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-surface"
                      : "cta interactive inline-flex items-center justify-center px-5 py-3 text-sm font-semibold"
                  }
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        {children ? <div className="mt-14">{children}</div> : null}
      </section>
    </main>
  );
}

export function PortalCardGrid({ items }: PortalCardGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const className =
          "group rounded-3xl border border-border bg-background p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg";

        if (item.href) {
          return (
            <Link key={item.title} href={item.href} className={className}>
              <h2 className="text-xl font-bold text-text-primary">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-text-secondary">{item.description}</p>
              {item.cta ? (
                <span className="mt-6 inline-flex text-sm font-semibold text-interactive-primary transition-colors group-hover:text-interactive-primary-hover">
                  {item.cta}
                </span>
              ) : null}
            </Link>
          );
        }

        return (
          <article key={item.title} className={className}>
            <h2 className="text-xl font-bold text-text-primary">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">{item.description}</p>
            {item.cta ? (
              <span className="mt-6 inline-flex text-sm font-semibold text-interactive-primary">
                {item.cta}
              </span>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
