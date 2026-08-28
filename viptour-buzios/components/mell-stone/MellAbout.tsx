import Image from "next/image";
import { mellStoneBrand } from "@/config/mell-stone.content";

export function MellAbout() {
  return (
    <main className="mell-page">
      <section className="mell-about-hero">
        <div>
          <p className="mell-eyebrow">Sobre</p>
          <h1>A natureza cria a obra. Mell & Stone finaliza o gesto.</h1>
          <p>
            A marca nasce do encontro entre joalheria artesanal, curadoria de
            materiais naturais e uma linguagem visual silenciosa. Não seguimos o
            ritmo de catálogo infinito. Preferimos presença, acabamento e escolha.
          </p>
        </div>
        <div className="mell-about-mark">
          <Image
            src="/images/mell-stone/mell-stone-monogram-obsidian.png"
            alt="Mell & Stone monogram"
            fill
            sizes="(max-width: 760px) 100vw, 42vw"
          />
        </div>
      </section>

      <section className="mell-editorial-split mell-section-sand">
        <div>
          <p className="mell-eyebrow">Essência</p>
          <h2>{mellStoneBrand.essence}</h2>
        </div>
        <p>
          {mellStoneBrand.manifesto} A experiência digital acompanha essa calma:
          tipografia clássica, espaço negativo, materiais em primeiro plano e
          informação comercial apenas quando ela estiver confirmada.
        </p>
      </section>
    </main>
  );
}
