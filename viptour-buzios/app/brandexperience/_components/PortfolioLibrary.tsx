import Link from "next/link";

const portfolioAreas = [
  {
    title: "Logos",
    slug: "logos",
    description: "Versiones principales, isotipos, variantes monocromas y archivos de uso inmediato.",
    examples: ["logo principal", "isotipo", "monocromo", "horizontal"],
  },
  {
    title: "Identidades",
    slug: "identidades",
    description: "Brand boards, boards de lanzamiento, propuestas visuales y piezas de identidad.",
    examples: ["brand board", "cover system", "identity sheet", "launch deck"],
  },
  {
    title: "Brand Systems",
    slug: "brand-systems",
    description: "Paletas, tipografías, tono, guías de uso y lenguaje visual de cada marca.",
    examples: ["palette", "typography", "voice", "rules"],
  },
  {
    title: "Mockups",
    slug: "mockups",
    description: "Aplicaciones reales sobre piezas, papelería, señalética, packaging y web.",
    examples: ["cards", "web hero", "social mockup", "print mockup"],
  },
  {
    title: "Social",
    slug: "social",
    description: "Posts, stories, reels cover y composiciones listas para redes sociales.",
    examples: ["feed", "stories", "covers", "ads"],
  },
  {
    title: "Video",
    slug: "video",
    description: "Reels, motion boards, loops y piezas animadas del ecosistema.",
    examples: ["reels", "motion", "loop", "promo"],
  },
] as const;

const contentMap = [
  {
    title: "Cliente VIPTOUR",
    subtitle: "Landing ejemplo del ecosistema",
    body:
      "Aquí debe vivir la landing operativa del cliente con su narrativa, servicios, FAQ, contacto y SEO listo para producción.",
    route: "/projects/viptour",
    cta: "Abrir VIPTOUR",
  },
  {
    title: "Brand Experience",
    subtitle: "Biblioteca visual de marca",
    body:
      "Este bloque centraliza los universos visuales que construiste para el ecosistema completo y deja el material ordenado por cliente.",
    route: "/brandexperience",
    cta: "Volver al sistema",
  },
] as const;

export function PortfolioLibrary() {
  return (
    <section className="mx-auto w-full max-w-[var(--container-default)]">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-text-secondary">
          Portfolio de Brand Experience
        </p>
        <h2 className="mt-4 text-3xl font-black tracking-tight text-text-primary sm:text-4xl">
          Biblioteca lista para organizar tus universos visuales por cliente
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
          La idea es simple: un portal claro para exponer el ecosistema y, debajo, una estructura de
          carpetas limpia para que después arrastres tus imágenes y materiales finales sin confundir
          proyectos.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {portfolioAreas.map((area) => (
          <article key={area.slug} className="card border-border bg-background p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-interactive-primary">
              {area.title}
            </p>
            <h3 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
              Carpeta `{area.slug}`
            </h3>
            <p className="mt-3 text-sm leading-6 text-text-secondary">{area.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {area.examples.map((example) => (
                <span
                  key={example}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary"
                >
                  {example}
                </span>
              ))}
            </div>
            <p className="mt-5 text-xs font-medium uppercase tracking-[0.24em] text-text-muted">
              Dejar aquí archivos finales o casi finales
            </p>
          </article>
        ))}
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-border bg-surface p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-text-secondary">
            Orden sugerido
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {contentMap.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-background p-5">
                <p className="text-sm font-semibold text-interactive-primary">{item.subtitle}</p>
                <h3 className="mt-2 text-xl font-bold text-text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{item.body}</p>
                <Link
                  href={item.route}
                  className="mt-4 inline-flex text-sm font-semibold text-text-primary underline decoration-border underline-offset-4 transition-colors hover:text-interactive-primary"
                >
                  {item.cta}
                </Link>
              </div>
            ))}
          </div>
        </article>

        <aside className="rounded-3xl border border-border bg-background p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-text-secondary">
            Reglas prácticas
          </p>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-text-secondary">
            <li>No mezclar VIPTOUR con Brand Experience.</li>
            <li>Guardar logos y variantes en `logos`.</li>
            <li>Usar `identidades` para boards y presentaciones de marca.</li>
            <li>Dejar `brand-systems` para reglas, color y tipografía.</li>
            <li>Subir mockups finales a `mockups` y contenido social a `social`.</li>
            <li>Reservar `video` para piezas animadas y reels.</li>
          </ul>
          <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
            <p className="text-sm font-semibold text-text-primary">Estado del portal</p>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              La landing oficial queda lista para desplegarse en `riovibestransfer.com` con la
              identidad del ecosistema y la biblioteca visual ordenada por cliente.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
