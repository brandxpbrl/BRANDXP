import Link from "next/link";
import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

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
    <main className="relative min-h-screen bg-[#030306] text-white overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
      
      {/* Cybernetic Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-radial from-sky-500/5 to-transparent blur-[80px]" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-radial from-purple-500/5 to-transparent blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.01]" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-[var(--container-default)] pt-10">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Master Solutions Hub
          </Link>
        </div>

        <div className="max-w-3xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-400 bg-sky-950/40 px-4 py-1.5 rounded-full border border-sky-900/30">
            {eyebrow}
          </span>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-6xl bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-gray-400">{description}</p>

          {ctas && ctas.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-4">
              {ctas.map((cta) => (
                <Link
                  key={cta.href}
                  href={cta.href}
                  className={
                    cta.variant === "secondary"
                      ? "interactive inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 bg-white/5 hover:bg-white/10 hover:border-white/20"
                      : "cta interactive inline-flex items-center justify-center px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-black bg-gradient-to-r from-[#F5D08C] to-[#D6A24A] hover:opacity-90 rounded-full transition-all duration-300"
                  }
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        {children ? <div className="mt-16">{children}</div> : null}
      </section>
    </main>
  );
}

export function PortalCardGrid({ items }: PortalCardGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const cardContent = (
          <>
            <h2 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors duration-300">
              {item.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              {item.description}
            </p>
            {item.cta ? (
              <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-400 hover:underline">
                {item.cta}
                <span>→</span>
              </span>
            ) : null}
          </>
        );

        const className =
          "group rounded-3xl border border-white/5 bg-slate-950/20 p-8 shadow-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-sky-500/5 relative overflow-hidden flex flex-col justify-between";

        if (item.href) {
          return (
            <Link key={item.title} href={item.href} className={className}>
              {cardContent}
            </Link>
          );
        }

        return (
          <article key={item.title} className={className}>
            {cardContent}
          </article>
        );
      })}
    </div>
  );
}
